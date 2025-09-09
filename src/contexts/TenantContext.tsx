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
  const functions = getFunctions(auth.app, 'europe-west2')

  // Initialize with a default tenant for demo purposes
  useEffect(() => {
    if (auth.currentUser && !currentTenant) {
      // For demo, create a default tenant
      createTenant('My Organization')
    }
  }, [auth.currentUser])

  const createTenant = async (name: string) => {
    try {
      setLoading(true)
      // For demo purposes, create a mock tenant
      const mockTenant: Tenant = {
        id: 'demo-tenant-1',
        name,
        plan: 'free',
        limits: {
          activeLinks: 5,
          monthlyClicks: 1000
        },
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || '',
        settings: {
          defaultUtm: undefined,
          brandColors: undefined
        }
      }
      
      setCurrentTenant(mockTenant)
      return { success: true, message: 'Tenant created successfully', tenantId: 'demo-tenant-1' }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const createLink = async (linkData: CreateLinkData) => {
    if (!currentTenant) {
      return { success: false, message: 'Please create or select a tenant first' }
    }

    try {
      setLoading(true)
      const createShortLink = httpsCallable(functions, 'createShortLink')
      const result = await createShortLink({
        tenantId: currentTenant.id,
        ...linkData
      })
      
      const response = result.data as { success: boolean; message: string; data?: any }
      if (response.success && response.data) {
        // Refresh links after creating
        await refreshLinks()
        return { success: true, message: 'Link created successfully', link: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getLinks = async (filters: LinkFilters = {}) => {
    if (!currentTenant) {
      return { success: false, message: 'Please create or select a tenant first' }
    }

    try {
      setLoading(true)
      const getLinksFunction = httpsCallable(functions, 'getLinks')
      const result = await getLinksFunction({
        tenantId: currentTenant.id,
        ...filters
      })
      
      const response = result.data as { success: boolean; message: string; data?: Link[] }
      if (response.success && response.data) {
        setLinks(response.data)
        return { success: true, message: 'Links retrieved successfully', links: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const refreshLinks = async () => {
    await getLinks()
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
