import { Outlet } from 'react-router-dom'
import RequireAuth from '../components/RequireAuth'
import Sidebar from '../components/Sidebar'
import MobileSidebar from '../components/MobileSidebar'
import { useEffect, useState } from 'react'

export default function AppLayout() {
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

  // Listen for theme changes from other components
  useEffect(() => {
    const handleCustomThemeChange = () => {
      const saved = localStorage.getItem('lg_theme')
      if (saved) {
        const dark = saved === 'dark'
        setIsDark(dark)
        document.documentElement.classList.toggle('dark', dark)
      }
    }

    window.addEventListener('lg_theme_change', handleCustomThemeChange)

    return () => {
      window.removeEventListener('lg_theme_change', handleCustomThemeChange)
    }
  }, [])

  return (
    <RequireAuth>
      <div className={`min-h-screen flex ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <MobileSidebar />
        <div className="fixed left-0 top-0 h-full z-10 hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0 lg:ml-64">
          <div className={`p-6 ${isDark ? 'bg-slate-900' : ''} overflow-y-auto min-h-screen`}>
            <Outlet />
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}


