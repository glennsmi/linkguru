# Phase 2: MVP Core Features (Weeks 4-6)

## Overview
Transform the foundation into a production-ready MVP by adding the core value propositions: UTM builder, enhanced QR options, analytics, and team management.

## Goals
- Complete UTM parameter support with validation
- Professional QR code generation with multiple formats
- Working analytics dashboard with click tracking
- Team collaboration features
- Enforced free tier limits

## Detailed Tasks

### Week 4: UTM Builder & Link Enhancement

#### UTM Builder Implementation
- [ ] Design UTM builder UI component with collapsible interface
- [ ] Implement standard UTM parameter fields:
  - `utm_source` (dropdown with common sources)
  - `utm_medium` (dropdown with common mediums)
  - `utm_campaign` (text input with validation)
  - `utm_term` (text input, optional)
  - `utm_content` (text input, optional)
- [ ] Add UTM parameter validation and smart defaults
- [ ] Implement canonical URL preview with live updates
- [ ] Add UTM template suggestions based on campaign type

#### URL Canonicalization Logic
- [ ] Implement UTM parameter merging with existing query strings
- [ ] Add proper URL encoding for special characters
- [ ] Handle parameter conflicts (UTM takes precedence)
- [ ] Preserve non-UTM query parameters
- [ ] Implement lowercase key canonicalization

#### Custom Slug Support
- [ ] Add custom slug input field with real-time validation
- [ ] Implement slug availability checking
- [ ] Add slug format validation (3-20 chars, URL-safe)
- [ ] Handle slug collision detection and user feedback
- [ ] Update link creation API to support custom slugs

#### Enhanced Link Management
- [ ] Add link expiration date support
- [ ] Implement link activation/deactivation
- [ ] Add basic tagging system for organization
- [ ] Update link list with search and filtering
- [ ] Add link editing functionality

### Week 5: Enhanced QR & Analytics Foundation

#### Advanced QR Generation
- [ ] Extend QR endpoint to support SVG format
- [ ] Add QR customization options:
  - Size presets (256px, 512px, 3cm@300dpi, 5cm@300dpi)
  - Error correction levels (M, Q, H)
  - Margin settings (0-4 modules)
  - Color customization (foreground/background)
- [ ] Implement QR preview component with live updates
- [ ] Add batch QR generation for multiple links
- [ ] Optimize caching strategy for customized QR codes

#### Click Analytics Infrastructure
- [ ] Enhance click event logging with additional metadata:
  - User agent parsing for device/browser detection
  - Referrer URL capture
  - Geographic location (country/city) via IP geolocation
  - IP address hashing for privacy compliance
- [ ] Implement click event bucketing for high-traffic links
- [ ] Add foundational analytics aggregation logic
- [ ] Create analytics data access layer

#### Analytics Dashboard UI
- [ ] Implement Vega-based chart component for clicks-over-time
- [ ] Add time range controls (7/30/90 days, custom range)
- [ ] Create summary metrics display (total clicks, unique visitors)
- [ ] Add device/browser breakdown visualization
- [ ] Implement responsive chart design for mobile

### Week 6: Team Management & Production Readiness

#### Team Collaboration Features
- [ ] Implement member invitation system with email
- [ ] Add role-based permissions (Owner, Admin, Member)
- [ ] Create team management interface in settings
- [ ] Implement pending invitation management
- [ ] Add member removal and role modification

#### Free Tier Limits Enforcement
- [ ] Implement link count validation on creation
- [ ] Add upgrade prompts when limits are reached
- [ ] Create limit tracking and display in UI
- [ ] Add soft warnings before hitting limits
- [ ] Implement graceful degradation for limit exceeded

#### User Experience Polish
- [ ] Implement comprehensive onboarding flow
- [ ] Add contextual help and tooltips
- [ ] Create empty states and loading indicators
- [ ] Implement proper error messaging and recovery
- [ ] Add keyboard shortcuts and accessibility improvements

#### Performance Optimization
- [ ] Optimize Firestore queries with proper indexing
- [ ] Implement pagination for link lists and analytics
- [ ] Add lazy loading for analytics data
- [ ] Optimize bundle size and loading performance
- [ ] Implement proper caching strategies

## Success Criteria

### Functional Requirements
- ✅ UTM parameters work correctly with validation and preview
- ✅ Custom slugs are supported with availability checking
- ✅ QR codes generate in PNG and SVG with customization
- ✅ Analytics dashboard shows real click data with charts
- ✅ Team invitations and role management work
- ✅ Free tier limits (5 active links) are properly enforced
- ✅ Link editing, expiration, and tagging functionality

### Technical Requirements
- ✅ p95 redirect latency maintained < 150ms
- ✅ QR generation performance < 500ms
- ✅ Analytics queries handle up to 10k events efficiently
- ✅ Multi-tenant security rules prevent unauthorized access
- ✅ Firebase Functions scale appropriately under load

### Quality Requirements
- ✅ End-to-end test coverage for critical user flows
- ✅ Comprehensive error handling for edge cases
- ✅ Mobile-responsive design across all features
- ✅ Accessibility compliance (WCAG AA standards)
- ✅ Clean, professional UI matching design system

## Deliverables
- Production-ready MVP with all core features
- Comprehensive user onboarding experience
- Working team collaboration features
- Analytics dashboard with real-time data
- Enforced free tier limitations
- Performance-optimized codebase

## Testing Strategy
- Unit tests for all business logic (>80% coverage)
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Performance testing for redirect and QR generation
- Security testing for multi-tenant isolation

## Risks & Mitigation
- **Analytics performance with large datasets:** Mitigated by implementing pagination and aggregation
- **Complex UTM logic bugs:** Mitigated by comprehensive testing and URL validation
- **Team management security issues:** Mitigated by thorough security rule testing

## Dependencies
- Phase 1 foundation must be stable and tested
- Design system and UI components finalized
- Analytics requirements clearly defined
- Performance benchmarks established

## Next Phase Preparation
- User testing feedback on MVP features
- Performance metrics and optimization opportunities
- Security audit results
- Feature usage analytics for prioritization

