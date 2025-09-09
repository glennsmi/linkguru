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
    
    // Force remove and add the class to ensure it's applied
    document.documentElement.classList.remove('dark')
    if (next) {
      document.documentElement.classList.add('dark')
    }
    
    localStorage.setItem('lg_theme', next ? 'dark' : 'light')
    
    // Force a re-render by updating state again
    setTimeout(() => {
      setIsDark(next)
      console.log('Theme toggled to:', next ? 'dark' : 'light', 'DOM has dark class:', document.documentElement.classList.contains('dark'))
    }, 50)
  }

  return (
    <aside 
      key={`sidebar-${isDark ? 'dark' : 'light'}`}
      className={`${mode === 'desktop' ? 'hidden md:flex' : 'flex w-72'} h-screen shrink-0 flex-col transition-all duration-300 ease-out ${mode === 'desktop' ? (collapsed ? 'md:w-16' : 'md:w-64') : ''} ${isDark ? 'bg-slate-900' : 'bg-white'} border-r border-slate-200 dark:border-slate-700 shadow-sm`}
    >
      <div className={`h-14 px-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 overflow-hidden">
            <img 
              src="/images/Infinite ribbon.svg" 
              alt="Link Guru Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className={`font-semibold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Link Guru</span>
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
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-colors group ${isActive ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-cyan-50')}`}
              style={({ isActive }) => isActive ? { backgroundColor: '#0891b2' } : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-white' : (isDark ? 'text-white group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900')}`} />
                  <span className={`truncate transition-colors ${isActive ? 'text-white' : (isDark ? 'text-white group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900')} ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{item.name}</span>
                </>
              )}
            </NavLink>
          )
        })}
        
        {/* External Links Section */}
        <div className={`mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'} mb-2 px-3`}>External</p>
          {externalNavItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-colors group ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50'}`}
              >
                <Icon size={18} className={`shrink-0 transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-emerald-700'}`} />
                <span className={`truncate transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-emerald-700'}`}>{item.name}</span>
              </a>
            )
          })}
        </div>
      </nav>

      {mode === 'desktop' && (
        <div className="p-3">
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <button aria-label="Toggle sidebar" onClick={() => setCollapsed(!collapsed)} className={`p-1.5 rounded-md group ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50/60'} transition-colors`}>
              {collapsed ? (
                <div className="flex">
                  <ChevronRight size={16} />
                  <ChevronRight size={16} className="-ml-1" />
                </div>
              ) : (
                <div className="flex">
                  <ChevronLeft size={16} />
                  <ChevronLeft size={16} className="-ml-1" />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="border-t p-3 mt-auto border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <User2 size={16} className={`${isDark ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} truncate ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{user?.displayName || user?.email}</p>
            <NavLink to="/app/settings" className={`text-xs transition-colors hover:underline ${isDark ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'} ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Profile</NavLink>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <button onClick={toggleTheme} className={`flex-1 flex items-center gap-2 text-xs group ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-cyan-700 hover:bg-cyan-50'} px-3 py-2 rounded-md transition-colors`}>
            {isDark ? <Sun size={14} className={`transition-colors ${isDark ? 'text-white group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`} /> : <Moon size={14} className={`transition-colors ${isDark ? 'text-white group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`} />}
            <span className={`transition-colors ${isDark ? 'text-white group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'} ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button onClick={logout} className={`flex-1 flex items-center gap-2 text-xs group ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'} px-3 py-2 rounded-md transition-colors`}>
            <LogOut size={14} className={`transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`} />
            <span className={`transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'} ${mode === 'desktop' && collapsed ? 'hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}


