import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'
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
 * Subscribe to Firestore realtime updates for portfolio/content with offline local cache fallback
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
        const cached = getCachedPortfolioData()

        const localSaveTime = parseInt(localStorage.getItem('portfolio_last_local_save') || '0', 10)
        const cloudSyncedTime = parseInt(localStorage.getItem('portfolio_last_cloud_sync') || '0', 10)

        // If local cache has newer unsynced edits than cloud, preserve local cache
        if (localSaveTime > cloudSyncedTime && cached && cached.projects) {
          onData(cached, false, false)
          return
        }

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
 * Save/Sync updated portfolio data to Firestore document portfolio/content with local cache fallback
 */
export async function savePortfolioData(data: PortfolioData): Promise<{ cloudSynced: boolean }> {
  // Always update local cache first so the UI is 100% responsive and persistent
  setCachedPortfolioData(data)
  localStorage.setItem('portfolio_last_local_save', Date.now().toString())

  const contentRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.doc)

  try {
    await setDoc(contentRef, data, { merge: true })
    localStorage.setItem('portfolio_last_cloud_sync', Date.now().toString())
    return { cloudSynced: true }
  } catch (err: any) {
    if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
      console.info('Firestore write permission restricted. Changes saved locally in cache.')
      return { cloudSynced: false }
    }
    console.warn('Firestore write failed, saved to local cache:', err)
    return { cloudSynced: false }
  }
}

/**
 * Helper to convert local image File to Base64 string for zero-cost image uploads
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
