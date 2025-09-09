import { z } from 'zod';

// UTM Parameters schema
export const utmParamsSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
}).catchall(z.string().optional()); // Allow custom UTM parameters

// QR Configuration schema
export const qrConfigSchema = z.object({
  size: z.number().int().min(128).max(1024).optional().default(256),
  margin: z.number().int().min(0).max(4).optional().default(1),
  ecLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
  fg: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#000000'),
  bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#FFFFFF'),
});

// Link metadata schema
export const linkMetadataSchema = z.object({
  title: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  createdBy: z.string(),
  createdAt: z.date(),
  lastModified: z.date().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().optional(),
});

// Link stats schema
export const linkStatsSchema = z.object({
  totalClicks: z.number().int().min(0).default(0),
  lastClickAt: z.date().optional(),
});

// Tenant limits schema
export const tenantLimitsSchema = z.object({
  activeLinks: z.number().int().min(0).default(5), // Free tier default
  monthlyClicks: z.number().int().min(0).default(1000),
});

// Tenant settings schema
export const tenantSettingsSchema = z.object({
  defaultUtm: utmParamsSchema.optional(),
  brandColors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
});

// Core Link schema
export const linkSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  shortId: z.string().regex(/^[A-Za-z0-9_-]+$/).min(3).max(20),
  longUrl: z.string().url(),
  originalUrl: z.string().url(),
  utm: utmParamsSchema.nullable(),
  metadata: linkMetadataSchema,
  qrConfig: qrConfigSchema.nullable(),
  stats: linkStatsSchema,
});

// Tenant schema
export const tenantSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
  limits: tenantLimitsSchema,
  createdAt: z.date(),
  createdBy: z.string(),
  settings: tenantSettingsSchema,
});

// Tenant member schema
export const tenantMemberSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  role: z.enum(['owner', 'admin', 'member']),
  invitedAt: z.date(),
  invitedBy: z.string(),
  joinedAt: z.date().optional(),
});

// Click event schema
export const clickEventSchema = z.object({
  id: z.string(),
  linkId: z.string(),
  tenantId: z.string(),
  timestamp: z.date(),
  bucket: z.number().int().min(0).max(9).optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  device: z.enum(['mobile', 'desktop', 'tablet', 'bot', 'unknown']),
  browser: z.string().optional(),
  os: z.string().optional(),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
  ipHash: z.string().optional(),
});

// API Request/Response schemas

// Create link request
export const createLinkRequestSchema = z.object({
  tenantId: z.string(),
  originalUrl: z.string().url(),
  customSlug: z.string().regex(/^[A-Za-z0-9_-]+$/).min(3).max(20).optional(),
  utm: utmParamsSchema.optional(),
  qrConfig: qrConfigSchema.optional(),
  tags: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
});

// Create link response
export const createLinkResponseSchema = z.object({
  linkId: z.string(),
  shortId: z.string(),
  shortUrl: z.string(),
  qrUrls: z.object({
    png: z.string().url(),
    svg: z.string().url(),
  }),
});

// Get links request
export const getLinksRequestSchema = z.object({
  tenantId: z.string(),
  limit: z.number().int().positive().max(100).optional().default(20),
  offset: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(['active', 'inactive', 'expired']).optional(),
  sortBy: z.enum(['createdAt', 'clicks', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Update link request
export const updateLinkRequestSchema = z.object({
  tenantId: z.string(),
  linkId: z.string(),
  originalUrl: z.string().url().optional(),
  utm: utmParamsSchema.optional(),
  qrConfig: qrConfigSchema.optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional(),
});

// Tenant management schemas
export const createTenantRequestSchema = z.object({
  name: z.string().min(1).max(50),
  plan: z.enum(['free', 'pro', 'enterprise']).optional().default('free'),
});

export const inviteMemberRequestSchema = z.object({
  tenantId: z.string(),
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'member']),
});

export const inviteMemberResponseSchema = z.object({
  invitationId: z.string(),
  expiresAt: z.date(),
});

// Firestore-specific schemas (handle Timestamp conversion)
export const firestoreTimestampSchema = z.union([z.date(), z.any()]);

export const firestoreLinkSchema = linkSchema.extend({
  metadata: linkMetadataSchema.extend({
    createdAt: firestoreTimestampSchema,
    lastModified: firestoreTimestampSchema.optional(),
    expiresAt: firestoreTimestampSchema.optional(),
  }),
  stats: linkStatsSchema.extend({
    lastClickAt: firestoreTimestampSchema.optional(),
  }),
});

export const firestoreTenantSchema = tenantSchema.extend({
  createdAt: firestoreTimestampSchema,
});

export const firestoreTenantMemberSchema = tenantMemberSchema.extend({
  invitedAt: firestoreTimestampSchema,
  joinedAt: firestoreTimestampSchema.optional(),
});

export const firestoreClickEventSchema = clickEventSchema.extend({
  timestamp: firestoreTimestampSchema,
});

// Collection names
export const COLLECTIONS = {
  TENANTS: 'tenants',
  TENANT_MEMBERS: 'members',
  LINKS: 'links',
  CLICKS: 'clicks',
} as const;

// Export types
export type Link = z.infer<typeof linkSchema>;
export type Tenant = z.infer<typeof tenantSchema>;
export type TenantMember = z.infer<typeof tenantMemberSchema>;
export type ClickEvent = z.infer<typeof clickEventSchema>;
export type CreateLinkRequest = z.infer<typeof createLinkRequestSchema>;
export type CreateLinkResponse = z.infer<typeof createLinkResponseSchema>;
export type GetLinksRequest = z.infer<typeof getLinksRequestSchema>;
export type UpdateLinkRequest = z.infer<typeof updateLinkRequestSchema>;
export type UtmParams = z.infer<typeof utmParamsSchema>;
export type QrConfiguration = z.infer<typeof qrConfigSchema>;
export type FirestoreLink = z.infer<typeof firestoreLinkSchema>;
export type FirestoreTenant = z.infer<typeof firestoreTenantSchema>;
export type FirestoreTenantMember = z.infer<typeof firestoreTenantMemberSchema>;
export type FirestoreClickEvent = z.infer<typeof firestoreClickEventSchema>;
