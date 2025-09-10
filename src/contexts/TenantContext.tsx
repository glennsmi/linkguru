import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth } from '../config/firebase'
import { Tenant, Link } from '@shared'

interface TenantContextType {
  currentTenant: Tenant | null
  links: Link[]
  loading: boolean
  createTenant: (name: string) => Promise<{ success: boolean; message: string; tenantId?: string }>
  createLink: (linkData: CreateLinkData) => Promise<{ success: boolean; message: string; link?: any }>
  getLinks: (filters?: LinkFilters) => Promise<{ success: boolean; message: string; links?: Link[] }>
  refreshLinks: () => Promise<void>
}

interface CreateLinkData {
  originalUrl: string
  customSlug?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
  qrConfig?: {
    size?: number
    ecLevel?: 'L' | 'M' | 'Q' | 'H'
    foregroundColor?: string
    backgroundColor?: string
  }
  tags?: string[]
  expiresAt?: Date
}

interface LinkFilters {
  status?: 'active' | 'inactive' | 'expired'
  sortBy?: 'createdAt' | 'clicks'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: string
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(false)
  const functions = getFunctions(auth.app, 'us-central1')

  // Load user's tenants on auth change
  useEffect(() => {
    if (auth.currentUser && !currentTenant) {
      loadUserTenants()
    }
  }, [auth.currentUser])

  const loadUserTenants = async () => {
    try {
      setLoading(true)
      const getUserTenants = httpsCallable(functions, 'getUserTenants')
      const result = await getUserTenants({})
      
      const response = result.data as { success: boolean; message: string; data?: Tenant[] }
      if (response.success && response.data && response.data.length > 0) {
        // Set the first tenant as current
        setCurrentTenant(response.data[0])
      }
    } catch (error) {
      console.error('Failed to load tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTenant = async (name: string) => {
    try {
      setLoading(true)
      const createTenantFunction = httpsCallable(functions, 'createTenant')
      const result = await createTenantFunction({ name })
      
      const response = result.data as { success: boolean; message: string; data?: Tenant }
      if (response.success && response.data) {
        setCurrentTenant(response.data)
        return { success: true, message: 'Tenant created successfully', tenantId: response.data.id }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const createLink = async (linkData: CreateLinkData) => {
    console.log('🔗 createLink called with:', linkData)
    
    if (!currentTenant) {
      console.log('❌ No current tenant found')
      return { success: false, message: 'Please create or select a tenant first' }
    }

    console.log('✅ Current tenant:', currentTenant)

    try {
      setLoading(true)
      const createShortLink = httpsCallable(functions, 'createShortLink')
      
      const requestData = {
        url: linkData.originalUrl,
        customAlias: linkData.customSlug,
        tenantId: currentTenant.id,
        utmSource: linkData.utm?.source,
        utmMedium: linkData.utm?.medium,
        utmCampaign: linkData.utm?.campaign,
        utmTerm: linkData.utm?.term,
        utmContent: linkData.utm?.content
      }
      
      console.log('📤 Sending to Firebase function:', requestData)
      
      const result = await createShortLink(requestData)
      console.log('📥 Firebase function response:', result)
      
      const response = result.data as { success: boolean; message: string; data?: any }
      console.log('📋 Parsed response:', response)
      
      if (response.success && response.data) {
        console.log('✅ Link created successfully, refreshing links...')
        // Refresh links after creating
        await refreshLinks()
        return { success: true, message: 'Link created successfully', link: response.data }
      } else {
        console.log('❌ Link creation failed:', response.message)
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      console.error('💥 Error in createLink:', error)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getLinks = async (filters: LinkFilters = {}) => {
    console.log('🔍 getLinks called with filters:', filters)
    
    if (!currentTenant) {
      console.log('❌ No current tenant for getLinks')
      return { success: false, message: 'Please create or select a tenant first' }
    }

    console.log('✅ Current tenant for getLinks:', currentTenant)

    try {
      setLoading(true)
      const getLinksFunction = httpsCallable(functions, 'getLinks')
      
      const requestData = {
        tenantId: currentTenant.id,
        ...filters
      }
      
      console.log('📤 Sending getLinks request:', requestData)
      const result = await getLinksFunction(requestData)
      console.log('📥 getLinks response:', result)
      
      const response = result.data as { success: boolean; message: string; data?: any }
      console.log('📋 Parsed getLinks response:', response)
      
      if (response.success && response.data) {
        console.log('✅ Links retrieved successfully:', response.data)
        console.log('🔍 First link data:', response.data.links?.[0])
        console.log('🔍 First link createdAt:', response.data.links?.[0]?.metadata?.createdAt, 'type:', typeof response.data.links?.[0]?.metadata?.createdAt)
        setLinks(response.data.links || response.data)
        return { success: true, message: 'Links retrieved successfully', links: response.data }
      } else {
        console.log('❌ getLinks failed:', response.message)
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      console.error('💥 Error in getLinks:', error)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const refreshLinks = async () => {
    console.log('🔄 refreshLinks called')
    const result = await getLinks()
    console.log('🔄 refreshLinks result:', result)
    // Don't return the result, just refresh the data
  }

  const value: TenantContextType = {
    currentTenant,
    links,
    loading,
    createTenant,
    createLink,
    getLinks,
    refreshLinks
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}
