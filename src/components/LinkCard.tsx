import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { Link } from '@shared'

interface LinkCardProps {
  link: Link
  source?: 'analytics' | 'links' | 'dashboard'
}

export default function LinkCard({ link, source = 'links' }: LinkCardProps) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      return saved === 'dark'
    }
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      const dark = saved === 'dark'
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  // Listen for theme changes from other components (like Sidebar)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lg_theme') {
        const newTheme = e.newValue
        const dark = newTheme === 'dark'
        setIsDark(dark)
        document.documentElement.classList.toggle('dark', dark)
      }
    }

    const handleCustomThemeChange = () => {
      const saved = localStorage.getItem('lg_theme')
      if (saved) {
        const dark = saved === 'dark'
        setIsDark(dark)
        document.documentElement.classList.toggle('dark', dark)
      }
    }

    // Listen for storage events (cross-tab synchronization)
    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom theme change events (same-tab updates)
    window.addEventListener('lg_theme_change', handleCustomThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('lg_theme_change', handleCustomThemeChange)
    }
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatDate = (date: Date | string | any) => {
    // Handle various date formats
    console.log('🗓️ formatDate called with:', date, 'type:', typeof date)
    let dateObj: Date
    
    if (!date) {
      console.log('🗓️ No date provided, using current date')
      dateObj = new Date() // Fallback to current date
    } else if (date instanceof Date) {
      console.log('🗓️ Date instance detected')
      dateObj = date
    } else if (typeof date === 'string') {
      console.log('🗓️ String date detected:', date)
      dateObj = new Date(date)
    } else if (typeof date === 'object' && date._seconds) {
      // Handle Firestore timestamp object
      console.log('🗓️ Firestore timestamp detected:', date)
      dateObj = new Date(date._seconds * 1000)
    } else {
      console.warn('🗓️ Unknown date format:', date)
      dateObj = new Date() // Fallback
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date:', date)
      dateObj = new Date() // Fallback to current date
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const getStatusColor = () => {
    if (!link.metadata.isActive) return `${isDark ? 'bg-red-900/30 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-300'}`
    if (link.metadata.expiresAt && new Date(link.metadata.expiresAt) < new Date()) return `${isDark ? 'bg-yellow-900/30 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`
    return `${isDark ? 'bg-green-900/30 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-300'}`
  }

  const getStatusText = () => {
    if (!link.metadata.isActive) return 'Inactive'
    if (link.metadata.expiresAt && new Date(link.metadata.expiresAt) < new Date()) return 'Expired'
    return 'Active'
  }

  return (
    <div className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'} rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Short URL */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
              linkguru-9b2d1.web.app/{link.shortId}
            </span>
            <button
              onClick={() => copyToClipboard(`https://linkguru-9b2d1.web.app/${link.shortId}`)}
              className={`p-1.5 ${isDark ? 'text-slate-500 hover:text-cyan-400 hover:bg-slate-700' : 'text-gray-400 hover:text-cyan-600 hover:bg-gray-100'} rounded-md transition-all duration-200`}
              title="Copy short URL"
            >
              {copied ? (
                <svg className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-4 h-4 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Original URL */}
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'} truncate mb-3`}>
            {link.originalUrl}
          </p>

          {/* Stats and Status */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <svg className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{link.stats.totalClicks} clicks</span>
            </div>

            <div className="flex items-center space-x-1">
              <svg className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {formatDate(link.metadata.createdAt)}
              </span>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Tags */}
          {link.metadata.tags && link.metadata.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {link.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium border ${isDark ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* UTM Parameters */}
          {link.utm && (
            <div className={`mt-3 p-3 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>UTM Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(link.utm).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center">
                      <span className={`font-medium capitalize min-w-0 flex-shrink-0 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{key}:</span>
                      <span className={`ml-1 truncate font-mono ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Analytics Button */}
          <button
            onClick={() => navigate(`/app/analytics/${link.id}`, { state: { from: source } })}
            className={`p-2 rounded-md transition-all duration-200 ${isDark ? 'text-slate-500 hover:text-cyan-400 hover:bg-slate-700' : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-100'}`}
            title="View Analytics"
          >
            <BarChart3 size={20} />
          </button>

          {/* QR Code Button */}
          {link.qrConfig && (
            <button
              onClick={() => copyToClipboard(`https://us-central1-linkguru-9b2d1.cloudfunctions.net/generateQR?shortId=${link.shortId}&format=png`)}
              className={`p-2 rounded-md transition-all duration-200 ${isDark ? 'text-slate-500 hover:text-cyan-400 hover:bg-slate-700' : 'text-gray-500 hover:text-cyan-600 hover:bg-gray-100'}`}
              title="Copy QR code URL"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          )}

          {/* More Actions */}
          <button className={`p-2 rounded-md transition-all duration-200 ${isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
