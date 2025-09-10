import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const { user } = useAuth()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('lg_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    
    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Link Guru
          </h1>
          <p className={`text-xl mb-8 max-w-3xl mx-auto transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            The ultimate link shortening platform with UTM tracking, QR code generation, 
            and advanced analytics for marketers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                style={{ backgroundColor: '#0891b2' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e7490'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth?mode=signin"
                  className="text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                  style={{ backgroundColor: '#0891b2' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e7490'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className={`px-8 py-3 rounded-lg text-lg font-medium border transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600' : 'bg-white hover:bg-gray-50 border-cyan-600'}`}
                  style={!isDark ? { color: '#0891b2', borderColor: '#0891b2' } : {}}
                >
                  Get Started Free
                </Link>
              </>
            )}
            <Link
              to="/about"
              className={`bg-transparent px-8 py-3 rounded-lg text-lg font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Learn More
            </Link>
            <Link
              to="/design"
              className={`bg-transparent px-8 py-3 rounded-lg text-lg font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Design System
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`rounded-lg shadow-sm p-6 transition-colors ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: isDark ? '#1e293b' : '#e0f2fe' }}>
              <svg className="w-6 h-6" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Link Shortening</h3>
            <p className={`transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Create short, memorable links that redirect to your destination URLs with custom slugs and branding.
            </p>
          </div>

          <div className={`rounded-lg shadow-sm p-6 transition-colors ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-emerald-900' : 'bg-green-100'}`}>
              <svg className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h3>
            <p className={`transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Track clicks, geographic data, device types, and traffic sources with detailed analytics dashboards.
            </p>
          </div>

          <div className={`rounded-lg shadow-sm p-6 transition-colors ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>QR Codes</h3>
            <p className={`transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Generate QR codes for your links with customizable colors, sizes, and error correction levels.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-20 rounded-lg shadow-sm p-8 text-center transition-colors ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to get started?
          </h2>
          <p className={`text-lg mb-8 transition-colors ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Join thousands of marketers and businesses who trust Link Guru for their link management needs.
          </p>
          {!user && (
            <Link
              to="/auth?mode=signup"
              className="text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              style={{ backgroundColor: '#0891b2' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e7490'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
            >
              Start Free Trial
            </Link>
          )}
        </div>
      </div>

    </div>
  )
}