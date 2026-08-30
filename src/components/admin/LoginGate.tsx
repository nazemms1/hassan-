import React, { useState } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import { Lock, Mail, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'

export default function LoginGate() {
  const { login } = usePortfolio()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      console.error('Login error:', err)
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password.')
      } else {
        setError(err.message || 'Sign in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#060812] relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-sky-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="panel p-8 sm:p-9 flex flex-col gap-6 shadow-2xl border border-white/10 bg-[#090d1a]/80 backdrop-blur-2xl rounded-3xl">
          {/* Minimalist Header */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-ground shadow-lg shadow-sky-500/20">
              <Sparkles className="w-6 h-6 text-ground" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-xl font-bold text-ink tracking-tight">Studio Sign In</h1>
              <p className="text-xs text-muted">Enter credentials to access your CMS</p>
            </div>
          </div>

          {/* Minimal Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs leading-none">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label text-[0.65rem] text-muted tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-ink text-sm placeholder:text-faint/40 focus:outline-none focus:border-sky-400 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="label text-[0.65rem] text-muted tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-ink text-sm placeholder:text-faint/40 focus:outline-none focus:border-sky-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary justify-center mt-2 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-ground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Minimalist Footer Link */}
          <div className="border-t border-white/10 pt-4 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 label text-xs text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to portfolio site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
