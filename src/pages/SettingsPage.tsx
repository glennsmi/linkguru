import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTenant } from '../contexts/TenantContext'
import { User, Building2, CreditCard, Shield, Key } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { currentTenant, links } = useTenant()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)

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

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'tenant', name: 'Organization', icon: Building2 },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API Keys', icon: Key }
  ]

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDark ? 'from-slate-900 to-slate-800' : 'from-blue-50 to-indigo-100'}`}>
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Please Sign In</h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'} mb-8`}>You need to be signed in to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} mt-2`}>
            Manage your account, organization, and preferences
          </p>
        </div>

        {/* Horizontal Tab Bar */}
        <div className="mb-8">
          <div className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? `border-cyan-500 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`
                        : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-300 hover:border-slate-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                    }`}
                  >
                    <Icon size={18} className={`mr-2 ${activeTab === tab.id ? (isDark ? 'text-cyan-400' : 'text-cyan-600') : ''}`} />
                    {tab.name}
                    {activeTab === tab.id && (
                      <div className={`ml-2 w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'} animate-pulse`} />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className={`rounded-lg shadow-lg border ${isDark ? 'bg-slate-800 border-slate-700 shadow-slate-900/20' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Account Information</h2>

                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'border-gray-300 bg-gray-50 text-gray-500'}`}
                      />
                      <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Email address cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={user.displayName || ''}
                        readOnly
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-gray-300 bg-white'} cursor-not-allowed`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                        Account Created
                      </label>
                      <input
                        type="text"
                        value={user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                        disabled
                        className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'border-gray-300 bg-gray-50 text-gray-500'}`}
                      />
                    </div>

                    <div className={`pt-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Settings */}
              {activeTab === 'tenant' && (
                <div className="p-6">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Organization Settings</h2>

                  {currentTenant ? (
                    <div className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={currentTenant.name || ''}
                          readOnly
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-gray-300 bg-white'} cursor-not-allowed`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                          Plan
                        </label>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${isDark ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-100 text-green-800'}`}>
                            {(currentTenant.plan || 'FREE').toUpperCase()}
                          </span>
                          <button className={`text-sm font-medium ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
                            Upgrade Plan
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                            Active Links Limit
                          </label>
                          <div className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {currentTenant.limits?.activeLinks || 5}
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {links.filter((l: any) => l.metadata?.isActive).length} currently active
                          </p>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                            Monthly Click Limit
                          </label>
                          <div className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {(currentTenant.limits?.monthlyClicks || 1000).toLocaleString()}
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Resets monthly
                          </p>
                        </div>
                      </div>

                      <div className={`pt-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <h3 className={`text-md font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Team Members</h3>
                        <div className="space-y-3">
                          <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                  {user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.displayName || user.email}</p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700' : 'bg-cyan-100 text-cyan-800'}`}>
                              Owner
                            </span>
                          </div>
                        </div>
                        <button className={`mt-4 text-sm font-medium ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
                          + Invite Team Member
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No organization selected</p>
                    </div>
                  )}
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Billing & Subscription</h2>

                  <div className="space-y-6">
                    <div className={`rounded-lg p-4 border ${isDark ? 'bg-green-900/20 border-green-700 text-green-300' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center">
                        <svg className={`w-5 h-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>Free Plan Active</span>
                      </div>
                      <p className={`text-sm mt-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                        You're currently on the free plan with basic features
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`rounded-lg p-6 border ${isDark ? 'border-slate-600 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Free</h3>
                        <p className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>$0<span className={`text-lg font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>/month</span></p>
                        <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          <li>✓ 5 active links</li>
                          <li>✓ 1,000 clicks/month</li>
                          <li>✓ Basic analytics</li>
                          <li>✓ QR codes</li>
                        </ul>
                        <div className={`mt-4 px-3 py-2 text-sm rounded-lg text-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                          Current Plan
                        </div>
                      </div>

                      <div className={`rounded-lg p-6 border ${isDark ? 'border-cyan-700 bg-cyan-900/20' : 'border-cyan-200 bg-cyan-50'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Pro</h3>
                        <p className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>$9<span className={`text-lg font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>/month</span></p>
                        <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          <li>✓ 100 active links</li>
                          <li>✓ 50,000 clicks/month</li>
                          <li>✓ Advanced analytics</li>
                          <li>✓ Custom domains</li>
                          <li>✓ Team collaboration</li>
                        </ul>
                        <button className="mt-4 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                          Upgrade
                        </button>
                      </div>

                      <div className={`rounded-lg p-6 border ${isDark ? 'border-slate-600 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Enterprise</h3>
                        <p className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>$29<span className={`text-lg font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>/month</span></p>
                        <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          <li>✓ Unlimited links</li>
                          <li>✓ Unlimited clicks</li>
                          <li>✓ White-label solution</li>
                          <li>✓ API access</li>
                          <li>✓ Priority support</li>
                        </ul>
                        <button className={`mt-4 w-full py-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                          Contact Sales
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Security Settings</h2>

                  <div className="space-y-6">
                    <div className={`rounded-lg p-4 border ${isDark ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-center">
                        <svg className={`w-5 h-5 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className={`font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>Security Features Coming Soon</span>
                      </div>
                      <p className={`text-sm mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        Two-factor authentication and password management will be available in the next update
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-white'}`}>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Add an extra layer of security to your account</p>
                        </div>
                        <button disabled className={`px-4 py-2 rounded-lg cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                          Coming Soon
                        </button>
                      </div>

                      <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-white'}`}>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Password Change</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Update your account password</p>
                        </div>
                        <button disabled className={`px-4 py-2 rounded-lg cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                          Coming Soon
                        </button>
                      </div>

                      <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-white'}`}>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Login Sessions</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage active login sessions</p>
                        </div>
                        <button disabled className={`px-4 py-2 rounded-lg cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <div className="p-6">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>API Keys</h2>

                  <div className="space-y-6">
                    <div className={`rounded-lg p-4 border ${isDark ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-center">
                        <svg className={`w-5 h-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>API Access Coming Soon</span>
                      </div>
                      <p className={`text-sm mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                        API keys and programmatic access will be available for Pro and Enterprise plans
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-white'}`}>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Generate API Key</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create a new API key for programmatic access</p>
                        </div>
                        <button disabled className={`px-4 py-2 rounded-lg cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                          Coming Soon
                        </button>
                      </div>

                      <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-white'}`}>
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>API Documentation</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>View API reference and examples</p>
                        </div>
                        <button disabled className={`px-4 py-2 rounded-lg cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

  )
}
