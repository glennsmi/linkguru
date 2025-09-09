// Core Link Guru types and interfaces

import { DeviceType, UserRole, PlanType, QrEcLevel, LinkStatus } from './common';

// UTM Parameters interface
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  [key: string]: string | undefined;
}

// QR Configuration interface
export interface QrConfiguration {
  size?: number; // pixels, default 256
  margin?: number; // modules, default 1
  ecLevel?: QrEcLevel; // default 'M'
  fg?: string; // foreground color, default '#000000'
  bg?: string; // background color, default '#FFFFFF'
}

// Link metadata
export interface LinkMetadata {
  title?: string;
  tags?: string[];
  createdBy: string;
  createdAt: Date;
  lastModified?: Date;
  isActive: boolean;
  expiresAt?: Date;
}

// Link statistics
export interface LinkStats {
  totalClicks: number;
  lastClickAt?: Date;
}

// Tenant limits
export interface TenantLimits {
  activeLinks: number;
  monthlyClicks: number;
}

// Tenant settings
export interface TenantSettings {
  defaultUtm?: UtmParams;
  brandColors?: {
    primary?: string;
    secondary?: string;
  };
}

// Core Link interface
export interface Link {
  id: string;
  tenantId: string;
  shortId: string;
  longUrl: string;
  originalUrl: string;
  utm: UtmParams | null;
  metadata: LinkMetadata;
  qrConfig: QrConfiguration | null;
  stats: LinkStats;
}

// Tenant interface
export interface Tenant {
  id: string;
  name: string;
  plan: PlanType;
  limits: TenantLimits;
  createdAt: Date;
  createdBy: string;
  settings: TenantSettings;
}

// Tenant member interface
export interface TenantMember {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  invitedAt: Date;
  invitedBy: string;
  joinedAt?: Date;
}

// Click event for analytics
export interface ClickEvent {
  id: string;
  linkId: string;
  tenantId: string;
  timestamp: Date;
  bucket?: number; // for sharding high-traffic links
  referrer?: string;
  userAgent?: string;
  device: DeviceType;
  browser?: string;
  os?: string;
  location?: {
    country?: string;
    city?: string;
  };
  ipHash?: string; // SHA-256 hash for privacy
}

// Analytics data structures
export interface ClickAnalytics {
  totalClicks: number;
  uniqueVisitors: number;
  clicksByDate: Array<{
    date: string;
    clicks: number;
  }>;
  clicksByDevice: Array<{
    device: DeviceType;
    clicks: number;
    percentage: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    clicks: number;
  }>;
  geographicData: Array<{
    country: string;
    city?: string;
    clicks: number;
  }>;
}

// API request/response types for link operations
export interface CreateLinkRequest {
  tenantId: string;
  originalUrl: string;
  customSlug?: string;
  utm?: UtmParams;
  qrConfig?: QrConfiguration;
  tags?: string[];
  expiresAt?: Date;
}

export interface CreateLinkResponse {
  linkId: string;
  shortId: string;
  shortUrl: string;
  qrUrls: {
    png: string;
    svg: string;
  };
}

export interface GetLinksRequest {
  tenantId: string;
  limit?: number;
  offset?: string;
  search?: string;
  tag?: string;
  status?: LinkStatus;
  sortBy?: 'createdAt' | 'clicks' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateLinkRequest {
  tenantId: string;
  linkId: string;
  originalUrl?: string;
  utm?: UtmParams;
  qrConfig?: QrConfiguration;
  tags?: string[];
  isActive?: boolean;
  expiresAt?: Date;
}

// Tenant management types
export interface CreateTenantRequest {
  name: string;
  plan?: PlanType;
}

export interface InviteMemberRequest {
  tenantId: string;
  email: string;
  role: UserRole;
}

export interface InviteMemberResponse {
  invitationId: string;
  expiresAt: Date;
}

