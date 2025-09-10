import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTenant } from '../contexts/TenantContext'
import LinkCreationForm from '../components/LinkCreationForm'
import LinkCard from '../components/LinkCard'
import QuickStats from '../components/QuickStats'

export default function DashboardPage() {
  const { user } = useAuth()
  const { currentTenant, links, loading, refreshLinks, createTenant } = useTenant()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTenantForm, setShowTenantForm] = useState(false)
  const [tenantName, setTenantName] = useState('')
  const [creatingTenant, setCreatingTenant] = useState(false)

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

  // Debug logging for links state
  console.log('📊 DashboardPage render - links:', links, 'loading:', loading, 'currentTenant:', currentTenant)

  useEffect(() => {
    console.log('📊 DashboardPage useEffect - currentTenant:', currentTenant)
    if (currentTenant) {
      console.log('📊 DashboardPage calling refreshLinks')
      refreshLinks()
    }
  }, [currentTenant])

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantName.trim()) return

    setCreatingTenant(true)
    try {
      const result = await createTenant(tenantName.trim())
      if (result.success) {
        setShowTenantForm(false)
        setTenantName('')
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to create tenant')
    } finally {
      setCreatingTenant(false)
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDark ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-indigo-100'}`}>
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Welcome to Link Guru</h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'} mb-8`}>Please sign in to access your dashboard</p>
          <Link
            to="/"
            className={`text-white px-6 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-colors`}
            style={{ backgroundColor: '#0891b2' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    )
  }

  // Show tenant creation if no tenant exists
  if (!currentTenant && !loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-sm border ${isDark ? 'border-slate-700' : ''} p-8`}>
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Create Your Organization</h1>
            <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Get started by creating your first organization to manage your links.</p>
          </div>

          {showTenantForm ? (
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-1`}>Organization Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g., My Company"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-gray-300 bg-white'}`}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTenantForm(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTenant || !tenantName.trim()}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#0891b2' }}
                >
                  {creatingTenant ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowTenantForm(true)}
                className="w-full px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#0891b2' }}
              >
                Create Organization
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} mt-2`}>
            Welcome back! Manage your short links and track their performance.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats links={links} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Link Creation */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Create New Link</h2>
              {showCreateForm ? (
                <LinkCreationForm
                  onSuccess={() => {
                    setShowCreateForm(false)
                    refreshLinks()
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#0891b2' }}
                >
                  + Create Short Link
                </button>
              )}
            </div>
          </div>

          {/* Recent Links */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Links</h2>
                  <Link
                    to="/app/links"
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#0891b2' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0e7490'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#0891b2'}
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className={`p-6 ${isDark ? 'bg-slate-800' : ''}`}>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: '#0891b2' }}></div>
                  </div>
                ) : links.length === 0 ? (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <svg className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>No links yet</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} mb-4`}>Create your first short link to get started</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#0891b2' }}
                    >
                      Create Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.slice(0, 5).map((link) => (
                      <LinkCard key={link.id} link={link} source="dashboard" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/links"
            className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : ''}`} style={{ backgroundColor: isDark ? 'transparent' : '#ecfeff' }}>
                <svg className="w-6 h-6" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Links</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>View and manage all your short links</p>
              </div>
            </div>
          </Link>

          <Link
            to="/analytics"
            className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : ''}`} style={{ backgroundColor: isDark ? 'transparent' : '#ecfdf5' }}>
                <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Track clicks and performance metrics</p>
              </div>
            </div>
          </Link>

          <Link
            to="/settings"
            className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Configure your account and preferences</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
