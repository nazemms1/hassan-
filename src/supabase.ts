import { createClient } from '@supabase/supabase-js'
import type { PortfolioData } from './data/portfolio'
import { initialPortfolio } from './data/portfolio'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qagyqmnreozzksfgsuft.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wwRP5F9y-_mDNDMJXTueag_GTbvU3Qj'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const LOCAL_STORAGE_KEY = 'portfolio_content_cache'
const BUCKET_NAME = 'app-images'
const DATA_ROW_ID = 'content'

/**
 * Clear cached portfolio content from localStorage
 */
export function clearPortfolioCache(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.info('portfolio_content_cache removed successfully')
  } catch (e) {
    console.warn('Failed to delete portfolio_content_cache from localStorage:', e)
  }
}

/**
 * Sanitize and guarantee a safe PortfolioData object supporting both standard and custom database payload schemas
 */
export function sanitizePortfolioData(rawInput: any): any {
  if (!rawInput) return initialPortfolio

  let raw = rawInput
  if (Array.isArray(raw)) {
    raw = raw[0]
  }
  if (raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object') {
    raw = raw.data
  }

  if (!raw || typeof raw !== 'object') {
    return initialPortfolio
  }

  const siteConfig = raw.siteConfig || {}

  // 1. Profile Mapping
  const name = siteConfig.name || raw.profile?.name || initialPortfolio.profile.name || ''
  const title = siteConfig.role || siteConfig.tagline || raw.profile?.title || raw.profile?.role || initialPortfolio.profile.title || ''
  const summary = siteConfig.summary || raw.summary || raw.profile?.summary || initialPortfolio.profile.summary || ''
  const location = siteConfig.location || raw.profile?.location || initialPortfolio.profile.location || ''
  const email = siteConfig.email || raw.profile?.email || initialPortfolio.profile.email || ''
  const phone = siteConfig.phone || raw.profile?.phone || initialPortfolio.profile.phone || ''
  const whatsapp = raw.profile?.whatsapp || phone || initialPortfolio.profile.whatsapp || ''
  const available = typeof raw.profile?.available === 'boolean' ? raw.profile.available : true
  const availableText = raw.profile?.availableText || 'Available for freelance & full-time roles'
  const heroStats = Array.isArray(raw.heroStats)
    ? raw.heroStats
    : Array.isArray(raw.profile?.heroStats)
    ? raw.profile.heroStats
    : initialPortfolio.profile.heroStats

  const socialsObj = {
    linkedin: {
      label: raw.profile?.socials?.linkedin?.label || 'LinkedIn',
      url: siteConfig.socials?.linkedin || raw.profile?.socials?.linkedin?.url || initialPortfolio.profile.socials.linkedin.url,
    },
    portfolio: {
      label: raw.profile?.socials?.portfolio?.label || 'Portfolio',
      url: siteConfig.socials?.github || raw.profile?.socials?.portfolio?.url || initialPortfolio.profile.socials.portfolio.url,
    },
  }

  const profile = {
    name,
    role: title,
    tagline: siteConfig.tagline || raw.profile?.tagline || initialPortfolio.profile.tagline,
    summary,
    longBio: raw.profile?.longBio || summary || initialPortfolio.profile.longBio,
    location,
    email,
    phone,
    whatsapp,
    socials: socialsObj,
    available,
    availableText,
    heroStats,
  }

  // 2. Projects Mapping
  const rawProjects = Array.isArray(raw.projects) ? raw.projects : []
  const projects = rawProjects.length > 0
    ? rawProjects.map((p: any, idx: number) => {
        const images = Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : p.imageBase64
          ? [p.imageBase64]
          : []

        return {
          id: p.id || `proj-${idx + 1}`,
          title: p.name || p.title || `Project ${idx + 1}`,
          client: p.subtitle || p.client || 'Client / Platform',
          year: p.period || p.year || '2026',
          discipline: Array.isArray(p.tags) ? p.tags.join(', ') : (p.discipline || 'Flutter / Mobile'),
          description: p.description || '',
          contribution: Array.isArray(p.highlights) ? p.highlights : (Array.isArray(p.contribution) ? p.contribution : []),
          images: images,
          url: p.url || '',
          hidden: Boolean(p.hidden),
        }
      })
    : initialPortfolio.projects

  // 3. Roles / Experience Mapping
  const rawExperience = Array.isArray(raw.experience)
    ? raw.experience
    : Array.isArray(raw.roles)
    ? raw.roles
    : []

  const roles = rawExperience.length > 0
    ? rawExperience.map((e: any, idx: number) => ({
        id: e.id || `exp-${idx + 1}`,
        title: e.role || e.title || 'Developer',
        company: e.company || 'Company',
        location: e.location || '',
        period: e.period || '',
        current: e.period?.toLowerCase().includes('present') || Boolean(e.current),
        points: Array.isArray(e.highlights) ? e.highlights : (Array.isArray(e.points) ? e.points : []),
      }))
    : initialPortfolio.roles

  // 4. Skills Mapping
  let skills: any[] = []
  if (Array.isArray(raw.skills)) {
    skills = raw.skills
  } else if (raw.skills && typeof raw.skills === 'object') {
    const groups: any[] = []
    if (Array.isArray(raw.skills.technical) && raw.skills.technical.length > 0) {
      groups.push({ category: 'Technical Skills', items: raw.skills.technical })
    }
    if (Array.isArray(raw.skills.soft) && raw.skills.soft.length > 0) {
      groups.push({ category: 'Soft Skills', items: raw.skills.soft })
    }
    skills = groups.length > 0 ? groups : initialPortfolio.skills
  } else {
    skills = initialPortfolio.skills
  }

  // 5. Socials Array Mapping
  let socialsArr: any[] = []
  if (Array.isArray(raw.socials) && raw.socials.length > 0) {
    socialsArr = raw.socials
  } else if (siteConfig.socials && typeof siteConfig.socials === 'object') {
    if (siteConfig.socials.github) socialsArr.push({ platform: 'GitHub', url: siteConfig.socials.github })
    if (siteConfig.socials.linkedin) socialsArr.push({ platform: 'LinkedIn', url: siteConfig.socials.linkedin })
    if (siteConfig.socials.twitter) socialsArr.push({ platform: 'Twitter', url: siteConfig.socials.twitter })
  }

  // 6. Languages, Education, Certifications, Disciplines
  const education = Array.isArray(raw.education)
    ? raw.education.map((edu: any) => ({
        degree: edu.degree || '',
        school: edu.school || '',
        period: edu.period || '',
        detail: edu.detail || '',
      }))
    : initialPortfolio.education

  const languages = Array.isArray(raw.languages) ? raw.languages : initialPortfolio.languages
  const certifications = Array.isArray(raw.certifications) ? raw.certifications : initialPortfolio.certifications
  const disciplines = Array.isArray(raw.disciplines) && raw.disciplines.length > 0
    ? raw.disciplines
    : initialPortfolio.disciplines

  return {
    profile,
    projects,
    disciplines,
    roles,
    experience: roles, // Alias for component compatibility
    stats: heroStats,   // Alias for component compatibility
    skills,
    languages,
    education,
    certifications,
    socials: socialsArr.length > 0 ? socialsArr : initialPortfolio.socials,
  }
}

/**
 * Get initial cached portfolio data synchronously from localStorage or fallback seed
 */
export function getCachedPortfolioData(): PortfolioData {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && typeof parsed === 'object') {
        return sanitizePortfolioData(parsed)
      }
    }
  } catch (e) {
    console.warn('Failed to read portfolio from local storage cache:', e)
  }
  return sanitizePortfolioData(initialPortfolio)
}

/**
 * Save portfolio data to localStorage cache
 */
export function setCachedPortfolioData(data: PortfolioData): void {
  try {
    const sanitized = sanitizePortfolioData(data)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized))
  } catch (e) {
    console.warn('Failed to save portfolio to local storage cache:', e)
  }
}

/**
 * Subscribe to Supabase realtime updates for public.app_data
 */
export function subscribeToPortfolioData(
  onData: (data: PortfolioData, isLive: boolean, permissionDenied?: boolean) => void,
  onError?: (error: Error) => void
): () => void {
  let isMounted = true

  const loadInitialData = async () => {
    try {
      // 1. Try single fetch by ID 'content'
      const { data: row, error } = await supabase
        .from('app_data')
        .select('*')
        .eq('id', DATA_ROW_ID)
        .maybeSingle()

      if (!isMounted) return

      if (!error && row) {
        const cloudData = sanitizePortfolioData(row.data || row)
        setCachedPortfolioData(cloudData)
        onData(cloudData, true, false)
        return
      }

      // 2. Fallback: select all rows from app_data if 'content' wasn't directly found
      const { data: allRows, error: allErr } = await supabase
        .from('app_data')
        .select('*')

      if (!isMounted) return

      if (!allErr && allRows && allRows.length > 0) {
        const targetRow = allRows.find((r: any) => r.id === DATA_ROW_ID) || allRows[0]
        const cloudData = sanitizePortfolioData(targetRow.data || targetRow)
        setCachedPortfolioData(cloudData)
        onData(cloudData, true, false)
        return
      }

      // 3. Document doesn't exist yet, seed initial data to Supabase
      const cached = getCachedPortfolioData()
      await supabase
        .from('app_data')
        .upsert({ id: DATA_ROW_ID, data: cached, updated_at: new Date().toISOString() })

      onData(cached, true, false)
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
      },
      (payload) => {
        if (!isMounted) return
        if (payload.new) {
          const rawPayload = (payload.new as any).data || payload.new
          const freshData = sanitizePortfolioData(rawPayload)
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

export interface StorageCapacityStats {
  payloadBytes: number
  payloadKb: number
  payloadMaxKb: number
  payloadPercentUsed: number
  mediaCount: number
  embeddedMediaBytes: number
  embeddedMediaKb: number
  storageQuotaBytes: number
  storageQuotaMb: number
  totalUsedBytes: number
  totalUsedMb: number
  remainingBytes: number
  remainingMb: number
  remainingGb: number
  storagePercentUsed: number
  statusLevel: 'healthy' | 'warning' | 'critical'
}

/**
 * Calculate full storage space stats, remaining free capacity in Supabase
 */
export function getStorageCapacityStats(
  data: PortfolioData,
  storageQuotaMb = 1000
): StorageCapacityStats {
  const payloadBytes = getPortfolioByteSize(data)
  const payloadKb = payloadBytes / 1024
  const payloadMaxKb = 1024 // 1 MB limit per Postgres JSONB row
  const payloadPercentUsed = Math.min(100, (payloadKb / payloadMaxKb) * 100)

  let mediaCount = 0
  let embeddedMediaBytes = 0

  if (Array.isArray(data.projects)) {
    data.projects.forEach((proj) => {
      if (Array.isArray(proj.images)) {
        proj.images.forEach((img) => {
          if (img) {
            mediaCount++
            if (img.startsWith('data:image/')) {
              embeddedMediaBytes += new TextEncoder().encode(img).length
            }
          }
        })
      }
    })
  }

  if (Array.isArray(data.certifications)) {
    data.certifications.forEach((cert) => {
      if (cert.image) {
        mediaCount++
        if (cert.image.startsWith('data:image/')) {
          embeddedMediaBytes += new TextEncoder().encode(cert.image).length
        }
      }
    })
  }

  const embeddedMediaKb = embeddedMediaBytes / 1024
  const storageQuotaBytes = storageQuotaMb * 1024 * 1024
  const totalUsedBytes = payloadBytes
  const totalUsedMb = totalUsedBytes / (1024 * 1024)
  const remainingBytes = Math.max(0, storageQuotaBytes - totalUsedBytes)
  const remainingMb = remainingBytes / (1024 * 1024)
  const remainingGb = remainingMb / 1024
  const storagePercentUsed = Math.min(100, (totalUsedBytes / storageQuotaBytes) * 100)

  let statusLevel: 'healthy' | 'warning' | 'critical' = 'healthy'
  if (payloadPercentUsed > 85 || storagePercentUsed > 85) {
    statusLevel = 'critical'
  } else if (payloadPercentUsed > 60 || storagePercentUsed > 60) {
    statusLevel = 'warning'
  }

  return {
    payloadBytes,
    payloadKb,
    payloadMaxKb,
    payloadPercentUsed,
    mediaCount,
    embeddedMediaBytes,
    embeddedMediaKb,
    storageQuotaBytes,
    storageQuotaMb,
    totalUsedBytes,
    totalUsedMb,
    remainingBytes,
    remainingMb,
    remainingGb,
    storagePercentUsed,
    statusLevel,
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

  return sanitizePortfolioData(cloned)
}

/**
 * Save/Sync updated portfolio data to Supabase database table `public.app_data`
 */
export async function savePortfolioData(
  data: PortfolioData
): Promise<{ cloudSynced: boolean; data: PortfolioData }> {
  const dataToSave = sanitizePortfolioData(data)

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
