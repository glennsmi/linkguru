import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTenant } from '../contexts/TenantContext'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { currentTenant, links } = useTenant()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'tenant', name: 'Organization', icon: '🏢' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'api', name: 'API Keys', icon: '🔑' }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-xl text-gray-600 mb-8">You need to be signed in to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account, organization, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Email address cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={user.displayName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Created
                      </label>
                      <input
                        type="text"
                        value={user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Settings</h2>
                  
                  {currentTenant ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={currentTenant.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plan
                        </label>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {currentTenant.plan.toUpperCase()}
                          </span>
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Upgrade Plan
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Active Links Limit
                          </label>
                          <div className="text-2xl font-semibold text-gray-900">
                            {currentTenant.limits.activeLinks}
                          </div>
                          <p className="text-sm text-gray-500">
                            {links.filter((l: any) => l.metadata.isActive).length} currently active
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Click Limit
                          </label>
                          <div className="text-2xl font-semibold text-gray-900">
                            {currentTenant.limits.monthlyClicks.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-500">
                            Resets monthly
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-4">Team Members</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.displayName || user.email}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                              Owner
                            </span>
                          </div>
                        </div>
                        <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
                          + Invite Team Member
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No organization selected</p>
                    </div>
                  )}
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-medium">Free Plan Active</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        You're currently on the free plan with basic features
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>✓ 5 active links</li>
                          <li>✓ 1,000 clicks/month</li>
                          <li>✓ Basic analytics</li>
                          <li>✓ QR codes</li>
                        </ul>
                        <div className="mt-4 px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg text-center">
                          Current Plan
                        </div>
                      </div>

                      <div className="border border-primary-200 rounded-lg p-6 bg-primary-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-4">$9<span className="text-lg font-normal text-gray-500">/month</span></p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>✓ 100 active links</li>
                          <li>✓ 50,000 clicks/month</li>
                          <li>✓ Advanced analytics</li>
                          <li>✓ Custom domains</li>
                          <li>✓ Team collaboration</li>
                        </ul>
                        <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                          Upgrade
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-4">$29<span className="text-lg font-normal text-gray-500">/month</span></p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>✓ Unlimited links</li>
                          <li>✓ Unlimited clicks</li>
                          <li>✓ White-label solution</li>
                          <li>✓ API access</li>
                          <li>✓ Priority support</li>
                        </ul>
                        <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-yellow-800 font-medium">Security Features Coming Soon</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        Two-factor authentication and password management will be available in the next update
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                          Coming Soon
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Password Change</h3>
                          <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                          Coming Soon
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Login Sessions</h3>
                          <p className="text-sm text-gray-500">Manage active login sessions</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">API Keys</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-blue-800 font-medium">API Access Coming Soon</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        API keys and programmatic access will be available for Pro and Enterprise plans
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Generate API Key</h3>
                          <p className="text-sm text-gray-500">Create a new API key for programmatic access</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                          Coming Soon
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">API Documentation</h3>
                          <p className="text-sm text-gray-500">View API reference and examples</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
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
      </div>
    </div>
  )
}
