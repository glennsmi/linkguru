export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Device types for analytics
export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'bot' | 'unknown';

// Role definitions for multi-tenancy
export type UserRole = 'owner' | 'admin' | 'member';

// Plan types
export type PlanType = 'free' | 'pro' | 'enterprise';

// QR error correction levels
export type QrEcLevel = 'L' | 'M' | 'Q' | 'H';

// Link status
export type LinkStatus = 'active' | 'inactive' | 'expired'; 