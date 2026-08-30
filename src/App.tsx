import { useEffect, useState } from 'react'
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext'
import Capabilities from './components/Capabilities'
import Contact from './components/Contact'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Profile from './components/Profile'
import TopBar from './components/TopBar'
import Work from './components/Work'
import LoginGate from './components/admin/LoginGate'
import AdminDashboard from './components/admin/AdminDashboard'

function MainContent() {
  const { user, authLoading } = usePortfolio()
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash.includes('admin'))

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash.includes('admin'))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (isAdminView) {
    if (authLoading) {
      return (
        <div className="min-h-screen w-full bg-ground flex flex-col items-center justify-center gap-4 text-ink">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-muted">Verifying administrator session...</p>
        </div>
      )
    }

    if (!user) {
      return <LoginGate />
    }

    return <AdminDashboard />
  }

  return (
    <>
      <TopBar />
      <main className="overflow-x-hidden">
        <Hero />
        <Work />
        <Profile />
        <Experience />
        <Capabilities />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  )
}
