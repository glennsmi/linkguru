import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
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
    }
  }, [])

  // Listen for theme changes from other components
  useEffect(() => {
    const handleCustomThemeChange = () => {
      const saved = localStorage.getItem('lg_theme')
      if (saved) {
        const dark = saved === 'dark'
        setIsDark(dark)
      }
    }

    window.addEventListener('lg_theme_change', handleCustomThemeChange)

    return () => {
      window.removeEventListener('lg_theme_change', handleCustomThemeChange)
    }
  }, [])

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className={`md:hidden fixed top-3 left-3 z-40 p-2 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className={`absolute inset-y-0 left-0 w-72 shadow-xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <Sidebar mode="mobile" />
          </div>
        </div>
      )}
    </>
  )
}


