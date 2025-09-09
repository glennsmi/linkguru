# Technical Specifications

## Overview

This document provides detailed technical specifications for the Link Guru platform, covering architecture, APIs, data models, and implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Firebase       │    │  Cloud         │
│   (Ionic React) │◄──►│  Hosting        │◄──►│  Functions     │
│                 │    │                 │    │  v2            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Firebase Auth  │    │  Firestore DB   │    │  External APIs  │
│                 │    │  (Multi-tenant) │    │  (Optional)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** Ionic React with TypeScript
- **State Management:** React Context + custom hooks
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Ionic components
- **Charts:** Vega runtime for analytics visualization
- **Build Tool:** Vite with TypeScript compilation

#### Backend
- **Platform:** Firebase (Functions v2, Firestore, Hosting, Auth)
- **Runtime:** Node.js 18+ with TypeScript
- **Region:** Europe West 2 (eu-west2)
- **Authentication:** Firebase Auth (Email/Password + Google)
- **Database:** Firestore (Native mode with multi-tenant structure)

#### Development Tools
- **Version Control:** Git with GitHub
- **CI/CD:** GitHub Actions
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint with TypeScript rules
- **Code Formatting:** Prettier
- **Package Management:** npm with workspaces

## Data Model

### Firestore Collections Structure

```
/tenants/{tenantId}
├── name: string
├── plan: 'free' | 'pro' | 'enterprise'
├── limits: { activeLinks: number, monthlyClicks: number }
├── createdAt: Timestamp
├── createdBy: string
├── settings: { defaultUtm: object, brandColors: object }

/tenants/{tenantId}/members/{uid}
├── email: string
├── displayName: string
├── role: 'owner' | 'admin' | 'member'
├── invitedAt: Timestamp
├── invitedBy: string
├── joinedAt?: Timestamp

/tenants/{tenantId}/links/{linkId}
├── shortId: string (unique globally)
├── longUrl: string (final URL with UTMs)
├── originalUrl: string (before UTM processing)
├── utm: UtmParams | null
├── metadata: {
│   ├── title?: string
│   ├── tags?: string[]
│   ├── createdBy: string
│   ├── createdAt: Timestamp
│   ├── lastModified?: Timestamp
│   ├── isActive: boolean
│   ├── expiresAt?: Timestamp
│   }
├── qrConfig: QrConfiguration | null
├── stats: {
│   ├── totalClicks: number
│   ├── lastClickAt?: Timestamp
│   }

/tenants/{tenantId}/links/{linkId}/clicks/{eventId}
├── ts: Timestamp
├── bucket?: number (0-9 for sharding)
├── referrer?: string
├── ua?: string
├── device: 'mobile' | 'desktop' | 'tablet' | 'bot' | 'unknown'
├── browser?: string
├── os?: string
├── country?: string
├── city?: string
├── ipHash?: string
```

### TypeScript Interfaces

```typescript
interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  limits: {
    activeLinks: number;
    monthlyClicks: number;
  };
  createdAt: Date;
  createdBy: string;
  settings: {
    defaultUtm?: UtmParams;
    brandColors?: BrandColors;
  };
}

interface Link {
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

interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  [key: string]: string | undefined;
}

interface ClickEvent {
  id: string;
  linkId: string;
  tenantId: string;
  timestamp: Date;
  bucket?: number;
  referrer?: string;
  userAgent?: string;
  device: DeviceType;
  browser?: string;
  os?: string;
  location?: {
    country?: string;
    city?: string;
  };
  ipHash?: string;
}
```

## API Specifications

### Cloud Functions Endpoints

#### POST /createShortLink
**Authentication:** Required (Firebase Auth)
**Body:**
```json
{
  "tenantId": "string",
  "originalUrl": "string",
  "customSlug?: "string",
  "utm?": {
    "source?": "string",
    "medium?": "string",
    "campaign?": "string",
    "term?": "string",
    "content?": "string"
  },
  "qrConfig?": {
    "size?": number,
    "margin?": number,
    "ecLevel?": "M" | "Q" | "H",
    "fg?": "string",
    "bg?": "string"
  },
  "tags?": ["string"],
  "expiresAt?": "timestamp"
}
```
**Response (201):**
```json
{
  "linkId": "string",
  "shortId": "string",
  "shortUrl": "string",
  "qrUrls": {
    "png": "string",
    "svg": "string"
  }
}
```
**Errors:** 400 (invalid URL), 409 (slug taken), 429 (rate limited)

#### GET /r/:shortId
**Authentication:** None (public endpoint)
**Response:** 302 redirect to long URL
**Headers:** Cache-Control, X-Robots-Tag
**Side Effects:** Logs click event to Firestore

#### GET /qr/:shortId.:format
**Authentication:** None (public endpoint)
**Parameters:**
- `size` (optional): 128-1024
- `margin` (optional): 0-4
- `ec` (optional): M|Q|H
- `fg` (optional): hex color
- `bg` (optional): hex color
**Response:** Image file (PNG/SVG)
**Caching:** Aggressive CDN caching with query parameter consideration

#### GET /api/tenants/:tenantId/links
**Authentication:** Required (tenant member)
**Query Parameters:**
- `limit`: number (default 20, max 100)
- `offset`: string (for pagination)
- `search`: string (title/slug/URL search)
- `tag`: string (filter by tag)
- `status`: 'active' | 'expired' | 'inactive'
- `sortBy`: 'createdAt' | 'clicks' | 'title'
- `sortOrder`: 'asc' | 'desc'
**Response:**
```json
{
  "links": [Link[]],
  "hasMore": boolean,
  "nextOffset": "string"
}
```

### Client-Side APIs

#### Authentication Service
```typescript
class AuthService {
  async signIn(email: string, password: string): Promise<User>
  async signInWithGoogle(): Promise<User>
  async signOut(): Promise<void>
  async getCurrentUser(): Promise<User | null>
  onAuthStateChanged(callback: (user: User | null) => void): () => void
}
```

#### Link Service
```typescript
class LinkService {
  async createLink(params: CreateLinkParams): Promise<LinkResult>
  async getLinks(params: GetLinksParams): Promise<PaginatedLinks>
  async updateLink(id: string, updates: Partial<Link>): Promise<Link>
  async deleteLink(id: string): Promise<void>
  async getLinkAnalytics(id: string, range: DateRange): Promise<AnalyticsData>
}
```

## Security Implementation

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenants collection - users can read their own tenant
    match /tenants/{tenantId} {
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid));
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid)).data.role in ['owner', 'admin'];
    }

    // Members subcollection
    match /tenants/{tenantId}/members/{userId} {
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid));
      allow write: if request.auth != null &&
        (request.auth.uid == userId ||
         get(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid)).data.role in ['owner', 'admin']);
    }

    // Links subcollection
    match /tenants/{tenantId}/links/{linkId} {
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid));
      allow write: if request.auth != null &&
        exists(/databases/$(database)/documents/tenants/$(tenantId)/members/$(request.auth.uid));
    }

    // Clicks subcollection - read denied, write by server only
    match /tenants/{tenantId}/links/{linkId}/clicks/{clickId} {
      allow read: if false;
      allow write: if request.auth == null; // Server-side only
    }
  }
}
```

### Authentication Flow

1. **Sign Up:**
   - Validate email format and password strength
   - Create Firebase Auth user
   - Create tenant document with user as owner
   - Add user to tenant members collection

2. **Sign In:**
   - Firebase Auth authentication
   - Retrieve user tenant memberships
   - Set active tenant context

3. **Multi-tenant Switching:**
   - Validate user membership in target tenant
   - Update active tenant context
   - Refresh UI with tenant-specific data

## Performance Optimizations

### Database Indexing Strategy

```javascript
// Composite indexes for efficient queries
{
  collectionGroup: 'links',
  queryScope: 'COLLECTION_GROUP',
  fields: [
    { fieldPath: 'tenantId', order: 'ASCENDING' },
    { fieldPath: 'metadata.createdAt', order: 'DESCENDING' },
    { fieldPath: 'metadata.isActive', order: 'ASCENDING' }
  ]
}

{
  collectionGroup: 'links',
  queryScope: 'COLLECTION_GROUP',
  fields: [
    { fieldPath: 'tenantId', order: 'ASCENDING' },
    { fieldPath: 'shortId', order: 'ASCENDING' }
  ]
}

{
  collectionGroup: 'clicks',
  queryScope: 'COLLECTION_GROUP',
  fields: [
    { fieldPath: 'linkId', order: 'ASCENDING' },
    { fieldPath: 'ts', order: 'DESCENDING' }
  ]
}
```

### Caching Strategy

#### CDN Caching (Firebase Hosting)
- QR images: Cache for 1 hour with query parameter consideration
- Static assets: Cache for 1 year with cache busting
- API responses: No caching (dynamic content)

#### Application Caching
- Link data: Cache in React Query with 5-minute stale time
- Analytics data: Cache with 1-hour stale time
- User preferences: Local storage with sync to Firestore

### Load Balancing & Scaling

#### Firebase Functions
- Automatic scaling based on load
- Region: Europe West 2 for optimal performance
- Memory: 256MB-2GB based on function requirements
- Timeout: 60 seconds for redirect, 30 seconds for other functions

#### Firestore
- Single region deployment for consistency
- Automatic scaling with no performance degradation
- Read/write quotas with burst capacity
- Backup and point-in-time recovery

## Monitoring & Observability

### Application Monitoring

#### Firebase Monitoring
- Function execution times and error rates
- Database query performance
- Hosting request latency and success rates
- Authentication success/failure rates

#### Custom Metrics
- User journey completion rates
- Feature usage statistics
- Performance benchmarks (redirect latency)
- Error categorization and frequency

### Logging Strategy

#### Structured Logging
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO|WARN|ERROR",
  "service": "functions|hosting|client",
  "userId?": "string",
  "tenantId?": "string",
  "operation": "createLink|redirect|qrGenerate",
  "duration?": 150,
  "error?": {
    "code": "string",
    "message": "string",
    "stack?": "string"
  },
  "metadata": {
    "userAgent?": "string",
    "ip?": "string",
    "url?": "string"
  }
}
```

#### Alert Configuration
- Redirect latency > 200ms (p95)
- Error rate > 1% for any service
- Function execution failures > 5%
- Database query timeouts > 10%
- Authentication failures > 10 per minute

## Deployment Strategy

### Environment Configuration

#### Development
- Local Firebase emulators
- Hot reload for frontend development
- Debug logging enabled
- Test data seeding

#### Staging
- Firebase project for staging
- Production-like configuration
- Automated testing on deployment
- Limited user access for testing

#### Production
- Separate Firebase project
- Optimized build configuration
- Monitoring and alerting enabled
- Backup and disaster recovery

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
```

### Rollback Strategy

#### Automated Rollback
- Version tagging for all deployments
- Quick rollback to previous version
- Database migration rollback scripts
- Feature flag system for gradual rollouts

#### Manual Rollback
- Emergency rollback procedures
- Database backup restoration
- Communication templates for incidents
- Post-mortem process for root cause analysis

This technical specification provides the foundation for implementing Link Guru with enterprise-grade reliability, security, and performance.

