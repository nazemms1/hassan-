import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type { PortfolioData } from './data/portfolio'
import { initialPortfolio } from './data/portfolio'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBJpyHGjx7eWUKWtZB3-WyD-12-KBJPwFk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'project-test-9bd48.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://project-test-9bd48-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-test-9bd48',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'project-test-9bd48.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '211338110281',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:211338110281:web:a0513b801ebfab5afc6698',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SS6RR7E081',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics safely initialized if supported in current environment
export let analytics: any = null
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app)
  }
}).catch(() => {
  // Silent catch for environments where analytics is not available
})

const LOCAL_STORAGE_KEY = 'portfolio_content_cache'
const PORTFOLIO_DOC_PATH = { collection: 'portfolio', doc: 'content' }

/**
 * Get initial cached portfolio data synchronously from localStorage or fallback seed
 */
export function getCachedPortfolioData(): PortfolioData {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && typeof parsed === 'object' && parsed.profile) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to read portfolio from local storage cache:', e)
  }
  return initialPortfolio
}

/**
 * Save portfolio data to localStorage cache
 */
export function setCachedPortfolioData(data: PortfolioData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save portfolio to local storage cache:', e)
  }
}

/**
 * Subscribe to Firestore realtime updates for portfolio/content with offline local cache fallback.
 * Firestore is always treated as the source of truth once reachable — the caller (PortfolioContext)
 * is responsible for optimistic local UI updates while a save is in flight, so this listener must
 * never prefer a stale local cache over a confirmed cloud snapshot.
 */
export function subscribeToPortfolioData(
  onData: (data: PortfolioData, isLive: boolean, permissionDenied?: boolean) => void,
  onError?: (error: Error) => void
): () => void {
  const contentRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.doc)

  const unsubscribe = onSnapshot(
    contentRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data() as PortfolioData
        setCachedPortfolioData(cloudData)
        onData(cloudData, true, false)
      } else {
        // Doc doesn't exist yet, seed initial data to Firestore
        const cached = getCachedPortfolioData()
        setDoc(contentRef, cached).catch((err) => {
          console.warn('Could not auto-seed initial portfolio data to Firestore:', err.message)
        })
        onData(cached, false, false)
      }
    },
    (error) => {
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permissions')
      if (isPermissionError) {
        console.info('Firestore security rules restricted cloud read. Switched to local storage cache mode.')
      } else {
        console.warn('Firestore snapshot error (using offline local cache):', error)
      }
      const cached = getCachedPortfolioData()
      onData(cached, false, isPermissionError)
      if (onError) onError(error)
    }
  )

  return unsubscribe
}

/**
 * Calculate the byte size of PortfolioData JSON string
 */
export function getPortfolioByteSize(data: PortfolioData): number {
  try {
    return new TextEncoder().encode(JSON.stringify(data)).length
  } catch (e) {
    return 0
  }
}

/**
 * Takes a Base64 Data URL (data:image/...) and compresses it to maximum dimensions (e.g. 750px)
 * and lower JPEG quality (e.g. 0.6) so that its string size is kept under ~35-50 KB.
 */
export async function compressBase64DataUrl(
  dataUrl: string,
  maxWidth = 750,
  quality = 0.6
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 30000) {
    return dataUrl
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        } else {
          width = Math.round((width * maxWidth) / height)
          height = maxWidth
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const compressed = canvas.toDataURL('image/jpeg', quality)
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl)
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

/**
 * Scans PortfolioData and compresses all base64 data URLs in projects and certifications
 * to ensure the total Firestore document payload size stays well below 1MB (typically ~200-400KB).
 */
export async function optimizePortfolioDataImages(
  data: PortfolioData,
  maxWidth = 750,
  quality = 0.6
): Promise<PortfolioData> {
  const cloned: PortfolioData = JSON.parse(JSON.stringify(data))

  if (Array.isArray(cloned.projects)) {
    for (let i = 0; i < cloned.projects.length; i++) {
      const proj = cloned.projects[i]
      if (Array.isArray(proj.images)) {
        const compressedImages = await Promise.all(
          proj.images.map((img) => compressBase64DataUrl(img, maxWidth, quality))
        )
        cloned.projects[i].images = compressedImages
      }
    }
  }

  if (Array.isArray(cloned.certifications)) {
    for (let i = 0; i < cloned.certifications.length; i++) {
      const cert = cloned.certifications[i]
      if (cert.image) {
        cert.image = await compressBase64DataUrl(cert.image, maxWidth, quality)
      }
    }
  }

  return cloned
}

/**
 * Save/Sync updated portfolio data to Firestore document portfolio/content with local cache fallback.
 * Automatically compresses large Base64 images if the total document payload exceeds 650 KB or
 * if Firestore rejects the write due to document size limits.
 */
export async function savePortfolioData(
  data: PortfolioData
): Promise<{ cloudSynced: boolean; data: PortfolioData }> {
  let dataToSave = data
  let currentSize = getPortfolioByteSize(dataToSave)

  // Automatically optimize images if total document payload exceeds 650 KB
  if (currentSize > 650000) {
    try {
      dataToSave = await optimizePortfolioDataImages(dataToSave, 700, 0.55)
      currentSize = getPortfolioByteSize(dataToSave)
    } catch (optErr) {
      console.warn('Pre-save image optimization failed:', optErr)
    }
  }

  // Always update local cache first so the UI is 100% responsive and persistent
  setCachedPortfolioData(dataToSave)

  const contentRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.doc)

  try {
    await setDoc(contentRef, dataToSave)
    return { cloudSynced: true, data: dataToSave }
  } catch (err: any) {
    // If size limit exceeded, perform aggressive compression retry (550px, 0.45 quality)
    if (err?.message?.includes('exceeds the maximum allowed size') || currentSize > 950000) {
      console.warn('Document size limit exceeded. Retrying with aggressive image compression...')
      try {
        dataToSave = await optimizePortfolioDataImages(dataToSave, 550, 0.45)
        await setDoc(contentRef, dataToSave)
        setCachedPortfolioData(dataToSave)
        return { cloudSynced: true, data: dataToSave }
      } catch (retryErr: any) {
        console.error('Firestore write failed after compression retry:', retryErr)
        throw retryErr
      }
    }

    if (err.code === 'permission-denied') {
      console.info('Firestore write permission restricted. Changes saved locally in cache.')
      return { cloudSynced: false, data: dataToSave }
    }
    console.error('Firestore write failed:', err)
    throw err
  }
}

/**
 * Helper to compress and convert an image file to a lightweight JPEG Data URL.
 * Used as a seamless fallback if Firebase Storage upload fails (e.g. CORS preflight rules).
 */
export async function compressImageToDataUrl(file: File, maxWidth = 750, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxWidth) / height)
            height = maxWidth
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image for compression'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Upload an image file to Firebase Storage and return its public download URL.
 * If Firebase Storage fails or hangs due to CORS policy restrictions on custom origin/localhost,
 * it instantly times out (3.5s) and falls back to a compressed lightweight Base64 Data URL so the application never hangs or breaks.
 */
export async function uploadPortfolioImage(file: File, folder: string): Promise<string> {
  const tryCloudUpload = async () => {
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const path = `${folder}/${Date.now()}-${safeName}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  const uploadTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firebase Storage upload timed out (likely CORS policy blocking preflight request)')), 3500)
  )

  try {
    return await Promise.race([tryCloudUpload(), uploadTimeout])
  } catch (err: any) {
    console.warn(
      'Firebase Storage upload failed or timed out (CORS policy restriction). Using instant compressed Base64 fallback:',
      err
    )
    try {
      const compressedUrl = await compressImageToDataUrl(file, 750, 0.6)
      return compressedUrl
    } catch (fallbackErr) {
      console.error('Image compression fallback failed:', fallbackErr)
      throw err
    }
  }
}



