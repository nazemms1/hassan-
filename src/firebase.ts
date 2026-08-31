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
 * Save/Sync updated portfolio data to Firestore document portfolio/content with local cache fallback.
 * Any failure other than a permission restriction (e.g. network loss, document-size limit exceeded)
 * is rethrown so the caller can surface a real error instead of silently reporting success.
 */
export async function savePortfolioData(data: PortfolioData): Promise<{ cloudSynced: boolean }> {
  // Always update local cache first so the UI is 100% responsive and persistent
  setCachedPortfolioData(data)

  const contentRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.doc)

  try {
    await setDoc(contentRef, data)
    return { cloudSynced: true }
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      console.info('Firestore write permission restricted. Changes saved locally in cache.')
      return { cloudSynced: false }
    }
    console.error('Firestore write failed:', err)
    throw err
  }
}

/**
 * Upload an image file to Firebase Storage and return its public download URL.
 * Images must never be embedded as Base64 inside the portfolio Firestore document —
 * a Firestore document is capped at 1MiB, which a handful of embedded images would exceed
 * and cause the whole portfolio save to fail.
 */
export async function uploadPortfolioImage(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
