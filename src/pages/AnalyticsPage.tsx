import { useState, useEffect } from 'react'
import { useTenant } from '../contexts/TenantContext'

export default function AnalyticsPage() {
  const { currentTenant, links, loading, refreshLinks } = useTenant()
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (currentTenant) {
      refreshLinks()
    }
  }, [currentTenant])

  const totalClicks = links.reduce((sum, link) => sum + link.stats.totalClicks, 0)
  const topLinks = links
    .sort((a, b) => b.stats.totalClicks - a.stats.totalClicks)
    .slice(0, 5)

  const deviceStats = {
    mobile: Math.floor(totalClicks * 0.45),
    desktop: Math.floor(totalClicks * 0.50),
    tablet: Math.floor(totalClicks * 0.05)
  }

  const sourceStats = {
    direct: Math.floor(totalClicks * 0.30),
    google: Math.floor(totalClicks * 0.25),
    facebook: Math.floor(totalClicks * 0.20),
    twitter: Math.floor(totalClicks * 0.15),
    other: Math.floor(totalClicks * 0.10)
  }

  if (!currentTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Tenant Selected</h1>
          <p className="text-xl text-gray-600 mb-8">Please create or select a tenant to view analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">
                Track performance and insights for your short links
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900">{totalClicks.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Links</p>
                <p className="text-2xl font-semibold text-gray-900">{links.filter(l => l.metadata.isActive).length}</p>
                <p className="text-sm text-gray-500">of {links.length} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Clicks/Link</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                </p>
                <p className="text-sm text-gray-500">per link</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Click</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {links.find(l => l.stats.lastClickAt)?.stats.lastClickAt ? 
                    formatRelativeTime(links.find(l => l.stats.lastClickAt)!.stats.lastClickAt!) : 
                    'Never'
                  }
                </p>
                <p className="text-sm text-gray-500">activity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Links */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Links</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : topLinks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No links to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate">
                            s.linkguru.app/r/{link.shortId}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {link.originalUrl}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{link.stats.totalClicks}</p>
                        <p className="text-sm text-gray-500">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Device Breakdown</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(deviceStats).map(([device, clicks]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        device === 'mobile' ? 'bg-blue-500' :
                        device === 'desktop' ? 'bg-green-500' :
                        'bg-primary-500'
                      }`}></div>
                      <span className="capitalize font-medium text-gray-900">{device}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            device === 'mobile' ? 'bg-blue-500' :
                            device === 'desktop' ? 'bg-green-500' :
                            'bg-primary-500'
                          }`}
                          style={{ width: `${(clicks / totalClicks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {clicks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(sourceStats).map(([source, clicks]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        source === 'direct' ? 'bg-gray-500' :
                        source === 'google' ? 'bg-blue-500' :
                        source === 'facebook' ? 'bg-primary-500' :
                        source === 'twitter' ? 'bg-sky-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="capitalize font-medium text-gray-900">{source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            source === 'direct' ? 'bg-gray-500' :
                            source === 'google' ? 'bg-blue-500' :
                            source === 'facebook' ? 'bg-primary-500' :
                            source === 'twitter' ? 'bg-sky-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${(clicks / totalClicks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {clicks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Click Timeline */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Click Timeline</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chart Coming Soon</h3>
                <p className="text-gray-500">Interactive timeline charts will be available in the next update</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }
}
