import { useState, useEffect } from 'react'
import { useTenant } from '../contexts/TenantContext'
import LinkCard from '../components/LinkCard'
import LinkCreationForm from '../components/LinkCreationForm'

export default function LinkManagementPage() {
  const { currentTenant, links, loading, refreshLinks } = useTenant()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'active' | 'inactive' | 'expired',
    sortBy: 'createdAt' as 'createdAt' | 'clicks',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (currentTenant) {
      refreshLinks()
    }
  }, [currentTenant])

  const filteredLinks = links.filter(link => {
    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !link.metadata.isActive) return false
      if (filters.status === 'inactive' && link.metadata.isActive) return false
      if (filters.status === 'expired' && (!link.metadata.expiresAt || link.metadata.expiresAt > new Date())) return false
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        link.shortId.toLowerCase().includes(term) ||
        link.originalUrl.toLowerCase().includes(term) ||
        link.metadata.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        false
      )
    }

    return true
  }).sort((a, b) => {
    let aValue: any, bValue: any

    if (filters.sortBy === 'createdAt') {
      aValue = a.metadata.createdAt.getTime()
      bValue = b.metadata.createdAt.getTime()
    } else {
      aValue = a.stats.totalClicks
      bValue = b.stats.totalClicks
    }

    return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  if (!currentTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Tenant Selected</h1>
          <p className="text-xl text-gray-600 mb-8">Please create or select a tenant to manage links</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Link Management</h1>
              <p className="text-gray-600 mt-2">
                Create, manage, and track your short links
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              + Create New Link
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Links
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by URL, slug, or tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Links</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="clicks-desc">Most Clicks</option>
                <option value="clicks-asc">Least Clicks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Link</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <LinkCreationForm
                  onSuccess={() => {
                    setShowCreateForm(false)
                    refreshLinks()
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Links List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Links ({filteredLinks.length})
              </h2>
              <div className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${filteredLinks.length} of ${links.length} links`}
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filters.status !== 'all' ? 'No links match your filters' : 'No links yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filters.status !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first short link to get started'
                  }
                </p>
                {!searchTerm && filters.status === 'all' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Create Link
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
