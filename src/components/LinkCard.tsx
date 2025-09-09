import { useState } from 'react'
import { Link } from '@shared'

interface LinkCardProps {
  link: Link
}

export default function LinkCard({ link }: LinkCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusColor = () => {
    if (!link.metadata.isActive) return 'bg-red-100 text-red-800'
    if (link.metadata.expiresAt && link.metadata.expiresAt < new Date()) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = () => {
    if (!link.metadata.isActive) return 'Inactive'
    if (link.metadata.expiresAt && link.metadata.expiresAt < new Date()) return 'Expired'
    return 'Active'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Short URL */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-medium text-gray-900 truncate">
              s.linkguru.app/r/{link.shortId}
            </span>
            <button
              onClick={() => copyToClipboard(`https://s.linkguru.app/r/${link.shortId}`)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy short URL"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Original URL */}
          <p className="text-sm text-gray-600 truncate mb-3">
            {link.originalUrl}
          </p>

          {/* Stats and Status */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-gray-600">{link.stats.totalClicks} clicks</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">
                {formatDate(link.metadata.createdAt)}
              </span>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Tags */}
          {link.metadata.tags && link.metadata.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {link.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* UTM Parameters */}
          {link.utm && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-xs font-medium text-blue-900 mb-2">UTM Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(link.utm).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex">
                      <span className="font-medium text-blue-700 capitalize">{key}:</span>
                      <span className="ml-1 text-blue-600 truncate">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* QR Code Button */}
          {link.qrConfig && (
            <button
              onClick={() => copyToClipboard(`https://s.linkguru.app/qr/${link.shortId}.png`)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy QR code URL"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          )}

          {/* More Actions */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
