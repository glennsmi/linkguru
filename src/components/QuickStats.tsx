import { Link } from '@shared'

interface QuickStatsProps {
  links: Link[]
}

export default function QuickStats({ links }: QuickStatsProps) {
  const totalClicks = links.reduce((sum, link) => sum + link.stats.totalClicks, 0)
  const activeLinks = links.filter(link => link.metadata.isActive).length
  const totalLinks = links.length
  const recentClicks = links
    .filter(link => link.stats.lastClickAt)
    .sort((a, b) => {
      const dateA = new Date(a.stats.lastClickAt || 0)
      const dateB = new Date(b.stats.lastClickAt || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 1)[0]?.stats.lastClickAt

  const stats = [
    {
      name: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      name: 'Active Links',
      value: activeLinks.toString(),
      change: `${activeLinks}/${totalLinks}`,
      changeType: 'neutral' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      name: 'Total Links',
      value: totalLinks.toString(),
      change: '+3 this week',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Last Click',
      value: recentClicks ? formatRelativeTime(recentClicks) : 'Never',
      change: recentClicks ? 'Recently active' : 'No activity',
      changeType: recentClicks ? 'positive' as const : 'neutral' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  function formatRelativeTime(date: Date | string | any): string {
    // Handle various date formats defensively
    let dateObj: Date
    
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'string') {
      dateObj = new Date(date)
    } else if (date && typeof date === 'object' && date._seconds) {
      // Firestore timestamp
      dateObj = new Date(date._seconds * 1000)
    } else {
      // Fallback for any other format
      dateObj = new Date(date)
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return dateObj.toLocaleDateString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                stat.changeType === 'positive' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
                'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
              }`}>
                {stat.icon}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 transition-colors">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">{stat.value}</p>
              <p className={`text-sm transition-colors ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                'text-gray-500 dark:text-slate-400'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
