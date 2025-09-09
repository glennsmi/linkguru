import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, LogOut, User2, ChevronLeft, ChevronRight, Sun, Moon, Palette } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { name: 'Links', icon: LinkIcon, href: '/app/links' },
  { name: 'Analytics', icon: BarChart3, href: '/app/analytics' },
  { name: 'Settings', icon: Settings, href: '/app/settings' },
]

const externalNavItems = [
  { name: 'Design System', icon: Palette, href: '/design' },
]

type SidebarMode = 'desktop' | 'mobile'

export default function Sidebar({ mode = 'desktop' }: { mode?: SidebarMode }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem('lg_sidebar_collapsed') === '1')
  useEffect(() => { localStorage.setItem('lg_sidebar_collapsed', collapsed ? '1' : '0') }, [collapsed])

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

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('lg_theme', next ? 'dark' : 'light')
  }

  return (
    <aside className={`${mode === 'desktop' ? 'hidden md:flex' : 'flex w-72'} h-screen shrink-0 flex-col transition-all duration-300 ease-out ${mode === 'desktop' ? (collapsed ? 'md:w-16' : 'md:w-64') : ''} bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700`}>
      <div className="h-14 px-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-primary-50/30 dark:bg-primary-900/20">
        <div className="flex items-center">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xs">LG</span>
          </div>
          <span className={`font-semibold text-sm tracking-tight text-slate-700 dark:text-slate-200 ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Link Guru</span>
        </div>
        {/* Collapse button moved to bottom */}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-colors ${isActive ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' : 'text-slate-800 hover:text-primary-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:text-primary-200 dark:hover:bg-primary-900/30'}`}
            >
              <Icon size={18} className="shrink-0" />
              <span className={`truncate ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{item.name}</span>
            </NavLink>
          )
        })}
        
        {/* External Links Section */}
        <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-2 px-3">External</p>
          {externalNavItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-colors text-slate-800 hover:text-primary-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:text-primary-200 dark:hover:bg-primary-900/30"
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </a>
            )
          })}
        </div>
      </nav>

      <div className="border-t p-3 mt-auto border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <User2 size={16} className="text-slate-700 dark:text-slate-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium text-slate-700 dark:text-slate-200 truncate ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{user?.displayName || user?.email}</p>
            <NavLink to="/app/settings" className={`text-xs text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Profile</NavLink>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <button onClick={toggleTheme} className="flex-1 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span className={`${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button onClick={logout} className="flex-1 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <LogOut size={14} />
            <span className={`${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Logout</span>
          </button>
        </div>
        {mode === 'desktop' && (
          <div className="mt-2 flex justify-center">
            <button aria-label="Toggle sidebar" onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors">
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}


