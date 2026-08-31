import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, getCachedPortfolioData, savePortfolioData, subscribeToPortfolioData } from '../firebase'
import type { PortfolioData } from '../data/portfolio'
import { initialPortfolio } from '../data/portfolio'

export type SyncStatus = 'live' | 'offline' | 'permission-restricted' | 'syncing' | 'error'

interface PortfolioContextType {
  data: PortfolioData
  syncStatus: SyncStatus
  lastSynced: Date | null
  user: User | null
  authLoading: boolean
  updatePortfolio: (newData: PortfolioData) => Promise<void>
  login: (email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
  exportJson: () => void
  importJson: (jsonContent: string) => Promise<void>
  seedDefaultData: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => getCachedPortfolioData())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline')
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)

  // Realtime Firestore subscription with local cache fallback
  useEffect(() => {
    setSyncStatus('syncing')
    const unsubscribe = subscribeToPortfolioData(
      (freshData, isLive, permissionDenied) => {
        setData(freshData)
        if (isLive) {
          setSyncStatus('live')
        } else if (permissionDenied) {
          setSyncStatus('permission-restricted')
        } else {
          setSyncStatus('offline')
        }
        setLastSynced(new Date())
      },
      () => {
        // Handled silently inside subscribeToPortfolioData
      }
    )

    return () => unsubscribe()
  }, [])

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  const updatePortfolio = async (newData: PortfolioData) => {
    setSyncStatus('syncing')
    setData(newData)
    try {
      const res = await savePortfolioData(newData)
      setSyncStatus(res.cloudSynced ? 'live' : 'permission-restricted')
      setLastSynced(new Date())
    } catch (err) {
      console.error('Failed to update portfolio:', err)
      setSyncStatus('error')
      throw err
    }
  }

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const exportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent) as PortfolioData
      if (!parsed || !parsed.profile || !parsed.projects) {
        throw new Error('Invalid portfolio JSON structure')
      }
      await updatePortfolio(parsed)
    } catch (err) {
      console.error('Failed to import JSON portfolio data:', err)
      throw err
    }
  }

  const seedDefaultData = async () => {
    await updatePortfolio(initialPortfolio)
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        syncStatus,
        lastSynced,
        user,
        authLoading,
        updatePortfolio,
        login,
        logout,
        exportJson,
        importJson,
        seedDefaultData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
