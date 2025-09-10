import { useState, useEffect } from 'react'
import { useTenant } from '../contexts/TenantContext'
import CustomDatePicker from './DatePicker'

interface LinkCreationFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function LinkCreationForm({ onSuccess, onCancel }: LinkCreationFormProps) {
  const { createLink } = useTenant()
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      return saved === 'dark'
    }
    return document.documentElement.classList.contains('dark')
  })

  const [formData, setFormData] = useState({
    originalUrl: '',
    customSlug: '',
    utm: {
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: ''
    },
    qrConfig: {
      size: 200,
      ecLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF'
    },
    tags: [] as string[],
    expiresAt: null as Date | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      const dark = saved === 'dark'
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('lg_theme')
      if (saved) {
        const dark = saved === 'dark'
        setIsDark(dark)
        document.documentElement.classList.toggle('dark', dark)
      }
    }

    window.addEventListener('lg_theme_change', handleThemeChange)
    return () => window.removeEventListener('lg_theme_change', handleThemeChange)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.originalUrl) {
      newErrors.originalUrl = 'URL is required'
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL'
    }

    if (formData.customSlug && !isValidSlug(formData.customSlug)) {
      newErrors.customSlug = 'Slug must be 3-20 characters, letters, numbers, hyphens, and underscores only'
    }

    if (formData.expiresAt && formData.expiresAt <= new Date()) {
      newErrors.expiresAt = 'Expiration date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidSlug = (slug: string) => {
    return /^[A-Za-z0-9_-]{3,20}$/.test(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Form submitted with data:', formData)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    console.log('✅ Form validation passed')
    setLoading(true)
    try {
      const utmData = Object.values(formData.utm).some(v => v) ? formData.utm : undefined
      const qrData = formData.qrConfig.size !== 200 || formData.qrConfig.ecLevel !== 'M' || 
                    formData.qrConfig.foregroundColor !== '#000000' || 
                    formData.qrConfig.backgroundColor !== '#FFFFFF' ? formData.qrConfig : undefined
      
      const linkPayload = {
        originalUrl: formData.originalUrl,
        customSlug: formData.customSlug || undefined,
        utm: utmData,
        qrConfig: qrData,
        tags: formData.tags,
        expiresAt: formData.expiresAt || undefined
      }
      
      console.log('🚀 Calling createLink with payload:', linkPayload)
      const result = await createLink(linkPayload)
      console.log('📊 createLink result:', result)

      if (result.success) {
        console.log('✅ Link creation succeeded, calling onSuccess')
        onSuccess()
      } else {
        console.log('❌ Link creation failed:', result.message)
        setErrors({ submit: result.message })
      }
    } catch (error) {
      console.error('💥 Error in handleSubmit:', error)
      setErrors({ submit: 'Failed to create link. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleUtmChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      utm: {
        ...prev.utm,
        [field]: value
      }
    }))
  }

  const handleQrChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      qrConfig: {
        ...prev.qrConfig,
        [field]: value
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div>
        <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Destination URL *
        </label>
        <input
          type="url"
          id="originalUrl"
          value={formData.originalUrl}
          onChange={(e) => handleInputChange('originalUrl', e.target.value)}
          placeholder="https://example.com"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 ${
            errors.originalUrl ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
          }`}
        />
        {errors.originalUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.originalUrl}</p>
        )}
      </div>

      {/* Custom Slug */}
      <div>
        <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Custom Slug (optional)
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-sm">
            s.linkguru.app/r/
          </span>
          <input
            type="text"
            id="customSlug"
            value={formData.customSlug}
            onChange={(e) => handleInputChange('customSlug', e.target.value)}
            placeholder="my-custom-link"
            className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 ${
              errors.customSlug ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
            }`}
          />
        </div>
        {errors.customSlug && (
          <p className="mt-1 text-sm text-red-600">{errors.customSlug}</p>
        )}
      </div>

      {/* UTM Parameters */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">UTM Parameters (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="utm_source" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Source
            </label>
            <input
              type="text"
              id="utm_source"
              value={formData.utm.source}
              onChange={(e) => handleUtmChange('source', e.target.value)}
              placeholder="google, facebook, newsletter"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="utm_medium" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Medium
            </label>
            <input
              type="text"
              id="utm_medium"
              value={formData.utm.medium}
              onChange={(e) => handleUtmChange('medium', e.target.value)}
              placeholder="cpc, email, social"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="utm_campaign" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Campaign
            </label>
            <input
              type="text"
              id="utm_campaign"
              value={formData.utm.campaign}
              onChange={(e) => handleUtmChange('campaign', e.target.value)}
              placeholder="spring_sale, product_launch"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="utm_term" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Term
            </label>
            <input
              type="text"
              id="utm_term"
              value={formData.utm.term}
              onChange={(e) => handleUtmChange('term', e.target.value)}
              placeholder="running shoes, laptop"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* QR Code Configuration */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">QR Code Settings (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qr_size" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Size (pixels)
            </label>
            <input
              type="number"
              id="qr_size"
              value={formData.qrConfig.size}
              onChange={(e) => handleQrChange('size', parseInt(e.target.value))}
              min="100"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="qr_ecLevel" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Error Correction
            </label>
            <select
              id="qr_ecLevel"
              value={formData.qrConfig.ecLevel}
              onChange={(e) => handleQrChange('ecLevel', e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expiration Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Expiration Date (optional)
        </label>
        <CustomDatePicker
          selected={formData.expiresAt}
          onChange={(date) => handleInputChange('expiresAt', date)}
          placeholderText="Select expiration date and time"
          isDark={isDark}
          error={errors.expiresAt}
          disabled={loading}
        />
        {errors.expiresAt && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiresAt}</p>
        )}
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: '#0891b2' }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0e7490')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
        >
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </div>
    </form>
  )
}
