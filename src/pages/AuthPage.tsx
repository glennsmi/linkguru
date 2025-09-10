import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getAuth } from 'firebase/auth'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>(
    (searchParams.get('mode') as 'signin' | 'signup') || 'signin'
  )
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(false)

  const auth = getAuth()

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('lg_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/app/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, formData.displayName)
      }

      if (result.success) {
        navigate('/app/dashboard')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        navigate('/app/dashboard')
      }
    } catch (err: any) {
      console.error('Google sign in error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Please allow popups and try again.')
      } else {
        setError('Failed to sign in with Google. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-md w-full">
        <div className={`rounded-lg shadow-sm border p-8 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/Infinite ribbon.svg" 
                  alt="Link Guru Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Link Guru</span>
            </Link>
            <h2 className={`text-2xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className={`transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {mode === 'signin' 
                ? 'Sign in to your account to continue' 
                : 'Get started with your free account'
              }
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6 ${isDark ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : `${mode === 'signin' ? 'Sign in' : 'Sign up'} with Google`}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  required={mode === 'signup'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#0891b2' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0e7490')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
            >
              {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-medium transition-colors"
                style={{ color: '#0891b2' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0e7490'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#0891b2'}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}