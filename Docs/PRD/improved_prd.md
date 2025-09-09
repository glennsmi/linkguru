# PRD — Multi-Tenant Link Shortening + UTM Builder + QR Codes (MVP → v1)

## Executive Summary

**Vision:** Become the go-to link management platform for marketing teams and SMBs who need reliable, branded short links with built-in analytics and seamless UTM campaign tracking.

**The Problem:** Marketing teams struggle with fragmented link management across multiple tools, lack proper UTM governance, and need QR codes for omnichannel campaigns. Existing solutions are either too expensive for SMBs or lack multi-tenant collaboration features.

**The Solution:** A unified platform that combines link shortening, UTM building, QR generation, and basic analytics with proper multi-tenant access controls.

**Success Metrics:**
- **Adoption:** 100 active tenants, 1,000 total links created within 3 months
- **Engagement:** 80% of users create >1 link per month, 60% use UTM builder
- **Technical:** 99.9% uptime, <150ms p95 redirect latency
- **Business:** 20% conversion from free to paid tier (when launched in v2)

---

## 1) Market Context & Competitive Analysis

### Market Opportunity
- **TAM:** $2B+ marketing technology space with 15%+ annual growth
- **Target segments:** SMBs (1-50 employees), Marketing agencies, Enterprise marketing teams
- **Key pain points:** UTM inconsistency, link management chaos, expensive enterprise tools

### Competitive Landscape
- **Bitly:** Market leader but expensive for SMBs, limited customization
- **TinyURL:** Basic functionality, no analytics or team features  
- **Rebrandly:** Strong custom domains, weak multi-tenant model
- **Our differentiation:** Multi-tenant first, integrated UTM governance, affordable pricing

---

## 2) Target Users & Personas

### Primary Persona: Marketing Manager (Maria)
- **Role:** Mid-level marketing at 20-200 person company
- **Pain points:** Tracking campaign performance across channels, ensuring UTM consistency across team
- **Goals:** Streamline campaign creation, generate professional QR codes, track link performance
- **Usage:** Creates 10-15 links/month, downloads QR codes for print materials

### Secondary Persona: SMB Owner (Sam)  
- **Role:** Restaurant/retail owner managing own marketing
- **Pain points:** Need QR codes for menus/signage, basic link tracking
- **Goals:** Simple link creation, professional QR codes, basic analytics
- **Usage:** Creates 3-5 links/month, primarily for QR code generation

### Future Persona: Agency Manager (Alex) - v2+
- **Role:** Manages multiple client accounts
- **Pain points:** Client isolation, billing complexity, branded domains
- **Goals:** Separate client workspaces, white-label solutions
- **Usage:** High volume across multiple tenants

---

## 3) Core User Stories (Prioritized)

### Must-Have (MVP)
1. **Link Creation**
   - As Maria, I can shorten any URL and get a working short link in <5 seconds
   - As Maria, I can add standard UTM parameters with validation and preview
   - As Sam, I can set a memorable custom slug if available

2. **QR Code Generation**  
   - As Sam, I can generate and download QR codes in PNG/SVG formats
   - As Maria, I can choose from web/print presets for proper sizing

3. **Multi-tenant Access**
   - As Maria, I can invite team members and control their permissions
   - As a team member, I can see only my organization's links

4. **Basic Analytics**
   - As Maria, I can view a clicks-over-time chart to measure campaign performance

### Should-Have (v1)
5. **Link Management**
   - As Maria, I can search/filter links by campaign, date, or status
   - As Maria, I can set expiration dates and organize with tags

6. **Enhanced QR**
   - As Maria, I can customize QR colors to match brand guidelines
   - As Sam, I can export QR codes as PDF for professional printing

### Could-Have (v2+)
7. **Advanced Analytics** - Detailed click analytics, geographic data, referrer tracking
8. **Custom Domains** - Branded short domains per tenant
9. **API Access** - Programmatic link creation and management

---

## 4) Detailed Functional Requirements

### 4.1 Link Creation & UTM Management

**Core Flow:**
1. User enters destination URL → system validates format and accessibility
2. Optional UTM builder expands with smart defaults and validation
3. Optional custom slug with real-time availability checking
4. System generates canonical URL with proper parameter handling

**UTM Parameter Handling:**
- **Supported keys:** utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Canonicalization rules:**
  - Lowercase standard UTM keys, preserve value casing
  - Merge with existing query params, UTM takes precedence on conflicts
  - URL-encode special characters in values
  - Preserve non-UTM query parameters

**Validation & Constraints:**
- URLs must be http/https with accessible endpoints (HEAD request validation)
- Custom slugs: 3-20 characters, alphanumeric + hyphens/underscores
- Free tier: 5 active links per tenant (clear upgrade CTA when exceeded)

### 4.2 QR Code System

**Generation Specifications:**
- **Server-side rendering** via Cloud Functions with aggressive caching
- **Format support:** PNG (web), SVG (scalable), PDF (v1 candidate)  
- **Customization options:**
  - Size: 128px - 1024px (or preset dimensions)
  - Error correction: M (default), Q, H levels
  - Colors: Foreground/background hex codes
  - Margin: 0-4 modules

**Preset Templates:**
- **Web Small:** 256px PNG, medium error correction
- **Web Large:** 512px PNG, medium error correction  
- **Print Standard:** 3cm @ 300 DPI (~354px), high error correction
- **Print Large:** 5cm @ 300 DPI (~591px), high error correction

**Distribution:**
- Direct endpoints: `s.domain.com/qr/{shortId}.{format}?options`
- Batch download functionality for multiple links
- Print-ready PDF generation (v1)

### 4.3 Redirect Performance & Analytics

**Redirect Requirements:**
- **Latency target:** p95 < 150ms globally via Firebase Hosting edge
- **Status code:** 302 (temporary) to preserve link equity
- **Fallback handling:** 404 page for expired/invalid links
- **Bot detection:** Basic user-agent filtering for analytics accuracy

**Click Event Capture:**
```typescript
{
  tenantId: string,
  linkId: string, 
  timestamp: Timestamp,
  referrer?: string,
  userAgent?: string,
  device: 'mobile' | 'desktop' | 'tablet' | 'bot' | 'unknown',
  location?: { country?: string, city?: string },
  ipHash: string // SHA-256 for privacy
}
```

**Analytics Implementation:**
- Real-time write to Firestore subcollection
- Client-side aggregation for small datasets (<1000 clicks)
- Daily rollup jobs for larger datasets (v1)
- Vega-based visualization with responsive design

### 4.4 Multi-tenancy & Security

**Tenant Structure:**
```
/tenants/{tenantId}: {
  name: string,
  plan: 'free' | 'pro' | 'enterprise',
  limits: { activeLinks: number, monthlyClicks: number },
  createdAt: Timestamp,
  settings: { defaultUtm: object, brandColors: object }
}
```

**Role Definitions:**
- **Owner:** Full tenant management, billing, member management, all link operations
- **Admin:** Member management, all link operations, tenant settings
- **Member:** Create/edit own links, view tenant analytics

**Security Implementation:**
- Firebase Auth with email/password + Google Sign-in
- Firestore security rules with tenant-scoped access
- App Check for bot protection
- Rate limiting: 100 requests/minute per authenticated user

---

## 5) Technical Architecture

### 5.1 System Design

**Frontend:** Ionic React with TypeScript
- Mobile-first responsive design
- Offline-capable for basic operations
- PWA features for mobile installation

**Backend:** Firebase ecosystem
- **Hosting:** CDN + custom domain routing
- **Functions:** Serverless redirect handling and QR generation  
- **Firestore:** Multi-tenant document structure
- **Auth:** Federated identity with role management

**Third-party Integrations:**
- QR generation: `qrcode` npm library
- URL validation: Custom endpoint checking
- Analytics: Vega for client-side visualization

### 5.2 Data Model

**Optimized Link Document:**
```typescript
{
  tenantId: string,
  shortId: string,           // Global uniqueness
  longUrl: string,           // Final URL with UTMs
  originalUrl: string,       // Before UTM processing
  utm: UtmParams,
  metadata: {
    title?: string,
    tags?: string[],
    createdBy: string,
    createdAt: Timestamp,
    lastModified?: Timestamp,
    isActive: boolean,
    expiresAt?: Timestamp
  },
  qrConfig: QrConfiguration,
  stats: {
    totalClicks: number,      // Cached counter
    lastClickAt?: Timestamp
  }
}
```

**Performance Considerations:**
- Composite indexes for tenant-scoped queries
- Click event sharding for high-traffic links
- Lazy loading for analytics data
- CDN caching for QR images

---

## 6) User Experience Design

### 6.1 Core User Flows

**Link Creation Flow:**
1. Dashboard → "Create Link" CTA
2. URL input with real-time validation
3. UTM builder (collapsible) with template suggestions
4. Custom slug availability check
5. QR preview with format options
6. Save → Success page with copy/download options

**Link Management Flow:**
1. Dashboard with search/filter controls
2. Bulk operations (activate/deactivate/delete)
3. Individual link editing with change tracking
4. Analytics drill-down per link

**Team Management Flow:**
1. Settings → Team tab
2. Invite by email with role selection
3. Pending invitations management
4. Role modification with confirmation

### 6.2 Key UI Components

**Link Builder Interface:**
- Smart URL validation with preview
- UTM parameter templates by campaign type
- Real-time canonical URL preview
- Custom slug availability indicator

**QR Customization Panel:**
- Visual preview with live updates
- Preset buttons for common use cases
- Color picker with brand palette
- Format selection with use case guidance

**Analytics Dashboard:**
- Time series chart with zoom/pan
- Summary metrics cards
- Filter controls (date range, device type)
- Export functionality

---

## 7) Success Metrics & KPIs

### 7.1 Product Metrics

**Adoption Metrics:**
- New tenant signups: Target 100 in 3 months
- User activation rate: Target 70% create first link within 24 hours
- Feature adoption: Target 60% use UTM builder, 40% download QR codes

**Engagement Metrics:**
- Monthly active tenants: Target 80% retention
- Links per user per month: Target 5+ for power users
- Team collaboration: Target 50% of tenants have >1 member

**Technical Metrics:**
- Redirect latency: p95 < 150ms, p99 < 300ms
- Uptime: 99.9% monthly (excluding planned maintenance)
- Error rates: <0.1% failed redirects

### 7.2 Business Metrics

**Revenue Indicators (for v2 planning):**
- Free tier limit hits: Track upgrade funnel conversion
- Feature usage patterns: Identify premium feature demand
- Support ticket volume: Measure product-market fit

**Quality Metrics:**
- User satisfaction: Target NPS > 40
- Support response time: < 4 hours business hours
- Bug resolution: 90% within 1 week

---

## 8) Risk Assessment & Mitigation

### 8.1 Technical Risks

**Performance Risk:** Viral link causing traffic spikes
- **Mitigation:** Auto-scaling Functions, CDN caching, load testing
- **Monitoring:** Real-time latency alerts, traffic pattern analysis

**Security Risk:** Abuse for spam/phishing
- **Mitigation:** URL scanning, rate limiting, user reporting system
- **Monitoring:** Suspicious pattern detection, manual review queue

**Data Loss Risk:** Firestore limitations or corruption
- **Mitigation:** Regular backups, cross-region replication, data validation
- **Monitoring:** Backup verification, data integrity checks

### 8.2 Product Risks

**Market Risk:** Strong competitor response
- **Mitigation:** Fast execution, unique differentiators, customer lock-in
- **Monitoring:** Competitive analysis, customer feedback

**Adoption Risk:** Complex UX reducing signup conversion  
- **Mitigation:** User testing, simplified onboarding, progressive disclosure
- **Monitoring:** Funnel analytics, session recordings

**Monetization Risk:** Low willingness to pay for premium features
- **Mitigation:** Value-first approach, clear upgrade triggers, pricing research
- **Monitoring:** Conversion tracking, customer interviews

---

## 9) Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)
**Goals:** Core infrastructure and basic functionality
- Multi-tenant auth and data model
- Basic link creation and redirect system
- Simple QR generation (PNG only)
- Minimal UI for core flows

**Success Criteria:**
- Can create working short links
- Multi-tenant isolation works
- QR codes generate correctly
- <200ms redirect latency

### Phase 2: MVP Features (Weeks 4-6)  
**Goals:** Production-ready feature set
- UTM builder with validation
- Enhanced QR options (SVG, sizing)
- Click analytics with Vega charts
- Team management and invitations
- Link management interface

**Success Criteria:**
- UTM parameters work correctly
- Analytics show real data
- Team collaboration functions
- Free tier limits enforced

### Phase 3: Polish & Scale (Weeks 7-8)
**Goals:** Production hardening and optimization
- Performance tuning and monitoring
- Error handling and edge cases
- Rate limiting and abuse protection
- User onboarding optimization

**Success Criteria:**
- Meets all performance targets
- Robust error handling
- Clean user experience
- Ready for user acquisition

### Phase 4: V1 Enhancements (Weeks 9-12)
**Goals:** Value-added features for retention
- PDF QR export
- Advanced link management (tags, search, bulk operations)
- Enhanced analytics (device breakdown, geographic data)
- Email templates and link sharing

**Success Criteria:**
- High user engagement
- Clear upgrade value proposition
- Strong retention metrics
- Ready for monetization

---

## 10) Launch Strategy

### 10.1 Go-to-Market Approach

**Target Channels:**
- Product Hunt launch for initial awareness
- Content marketing (UTM best practices, QR code guides)  
- Integration partnerships (marketing automation tools)
- Freemium model with clear upgrade path

**Pricing Strategy (v2):**
- **Free:** 5 active links, basic analytics, standard QR
- **Pro ($10/month):** 100 links, advanced analytics, custom QR, team collaboration
- **Enterprise ($50/month):** Unlimited links, custom domains, advanced security

### 10.2 Success Criteria for Launch

**Week 1:** 50+ signups, <5 critical bugs, >95% uptime
**Month 1:** 200+ users, 1000+ links created, <150ms p95 latency  
**Month 3:** 500+ users, 20% monthly retention, clear product-market fit signals

---

## 11) Appendix

### 11.1 Technical Specifications

**API Endpoints:**
```
POST /api/links - Create new short link
GET /api/links - List tenant links (paginated)
PUT /api/links/:id - Update existing link
DELETE /api/links/:id - Deactivate link
GET /r/:shortId - Redirect endpoint  
GET /qr/:shortId.:format - QR code generation
```

**Database Indexes:**
```
tenantId + createdAt (desc) - Link listing
shortId (unique) - Redirect lookup
tenantId + isActive + createdAt - Active link queries
linkId + timestamp - Analytics queries
```

### 11.2 Security Considerations

**Data Protection:**
- IP address hashing for privacy compliance
- GDPR-compliant data retention policies
- SOC 2 preparation for enterprise customers

**Access Control:**
- Firebase security rules with tenant isolation
- API rate limiting per user and tenant
- Audit logging for sensitive operations

This improved PRD provides the strategic context, detailed specifications, and execution roadmap needed for successful product development while maintaining clear priorities and measurable outcomes.