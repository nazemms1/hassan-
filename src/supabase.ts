import { createClient } from '@supabase/supabase-js'
import type { PortfolioData } from './data/portfolio'
import { initialPortfolio } from './data/portfolio'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ayubzogruomemjxhtfgo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JDOKwfYwwkMHf6ohfZw9wQ_TYfCk7pg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const LOCAL_STORAGE_KEY = 'portfolio_content_cache'
const BUCKET_NAME = 'app-images'
const DATA_ROW_ID = 'content'

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
 * Subscribe to Supabase realtime updates for public.app_data where id = 'content'
 */
export function subscribeToPortfolioData(
  onData: (data: PortfolioData, isLive: boolean, permissionDenied?: boolean) => void,
  onError?: (error: Error) => void
): () => void {
  let isMounted = true

  const loadInitialData = async () => {
    try {
      const { data: row, error } = await supabase
        .from('app_data')
        .select('data')
        .eq('id', DATA_ROW_ID)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.warn('Supabase fetch error, using local cache fallback:', error.message)
        const cached = getCachedPortfolioData()
        onData(cached, false, false)
        if (onError) onError(new Error(error.message))
        return
      }

      if (row && row.data) {
        const cloudData = row.data as PortfolioData
        setCachedPortfolioData(cloudData)
        onData(cloudData, true, false)
      } else {
        // Doc doesn't exist yet, seed initial data to Supabase
        const cached = getCachedPortfolioData()
        const { error: seedError } = await supabase
          .from('app_data')
          .upsert({ id: DATA_ROW_ID, data: cached, updated_at: new Date().toISOString() })

        if (seedError) {
          console.warn('Could not auto-seed initial portfolio data to Supabase:', seedError.message)
        }
        onData(cached, true, false)
      }
    } catch (err: any) {
      if (!isMounted) return
      console.warn('Supabase load error:', err)
      const cached = getCachedPortfolioData()
      onData(cached, false, false)
      if (onError) onError(err)
    }
  }

  loadInitialData()

  // Realtime subscription
  const channel = supabase
    .channel('public:app_data')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'app_data',
        filter: `id=eq.${DATA_ROW_ID}`,
      },
      (payload) => {
        if (!isMounted) return
        if (payload.new && (payload.new as any).data) {
          const freshData = (payload.new as any).data as PortfolioData
          setCachedPortfolioData(freshData)
          onData(freshData, true, false)
        }
      }
    )
    .subscribe()

  return () => {
    isMounted = false
    supabase.removeChannel(channel)
  }
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
 * Takes a Base64 Data URL (data:image/...) and compresses it
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
 * Save/Sync updated portfolio data to Supabase database table `public.app_data`
 */
export async function savePortfolioData(
  data: PortfolioData
): Promise<{ cloudSynced: boolean; data: PortfolioData }> {
  const dataToSave = data

  // Always update local cache first
  setCachedPortfolioData(dataToSave)

  try {
    const { error } = await supabase.from('app_data').upsert({
      id: DATA_ROW_ID,
      data: dataToSave,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase save error:', error.message)
      return { cloudSynced: false, data: dataToSave }
    }

    return { cloudSynced: true, data: dataToSave }
  } catch (err: any) {
    console.error('Supabase save failed:', err)
    return { cloudSynced: false, data: dataToSave }
  }
}

/**
 * Helper to compress and convert an image file to a JPEG Data URL fallback
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
 * Upload an image file to Supabase Storage Bucket `app-images` and return its public URL.
 */
export async function uploadPortfolioImage(file: File, folder = 'uploads'): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`

  try {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      console.warn('Supabase Storage upload error, using compressed base64 fallback:', uploadError.message)
      return await compressImageToDataUrl(file, 750, 0.6)
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl
    }

    return await compressImageToDataUrl(file, 750, 0.6)
  } catch (err: any) {
    console.warn('Supabase Storage upload failed. Fallback to base64:', err)
    return await compressImageToDataUrl(file, 750, 0.6)
  }
}
