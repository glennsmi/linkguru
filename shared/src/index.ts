// Types
export * from './types/common';
export * from './types/link';

// Schemas
export * from './schemas/user';

// Link Guru schemas with explicit exports to avoid naming conflicts
export {
  linkSchema,
  tenantSchema,
  tenantMemberSchema,
  clickEventSchema,
  utmParamsSchema,
  qrConfigSchema,
  linkMetadataSchema,
  linkStatsSchema,
  tenantLimitsSchema,
  tenantSettingsSchema,
  createLinkRequestSchema,
  createLinkResponseSchema,
  getLinksRequestSchema,
  updateLinkRequestSchema,
  createTenantRequestSchema,
  inviteMemberRequestSchema,
  inviteMemberResponseSchema,
  firestoreTimestampSchema,
  firestoreLinkSchema,
  firestoreTenantSchema,
  firestoreTenantMemberSchema,
  firestoreClickEventSchema,
  COLLECTIONS as LINK_COLLECTIONS,
  // Types from schemas
  type Link as LinkType,
  type Tenant as TenantType,
  type TenantMember as TenantMemberType,
  type ClickEvent as ClickEventType,
  type CreateLinkRequest as CreateLinkRequestType,
  type CreateLinkResponse as CreateLinkResponseType,
  type GetLinksRequest as GetLinksRequestType,
  type UpdateLinkRequest as UpdateLinkRequestType,
  type UtmParams as UtmParamsType,
  type QrConfiguration as QrConfigurationType,
  type FirestoreLink,
  type FirestoreTenant,
  type FirestoreTenantMember,
  type FirestoreClickEvent
} from './schemas/link';

// Utilities
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
) => ({
  success,
  data,
  error,
  message,
});

export const createErrorResponse = (error: string, message?: string) =>
  createApiResponse(false, undefined, error, message);

export const createSuccessResponse = <T>(data: T, message?: string) =>
  createApiResponse(true, data, undefined, message); 