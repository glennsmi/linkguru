# PRD — Multi-Tenant Link Shortening + UTM Builder + QR Codes (MVP → v1)

## 1) Summary & Goals

Build a multi-tenant tool where authenticated users can:

1. create/manage short links,
2. append custom UTM parameters, and
3. generate downloadable QR codes (common formats).

**Tech stack:** Ionic React (TS), Firebase (Auth, Firestore, Functions v2, Hosting), optional BigQuery later.

**Primary goals (MVP):**

- Shorten any valid URL (https/http).
- Optional custom slug per link.
- UTM builder with presets and custom fields; canonicalizes/merges into final long URL.
- QR generation for each short link; download as image(s).
- Multi-tenant workspace model with role-based access.
- Reliable, fast redirects with foundational click logging (for later analytics).

**Non-goals (MVP):**

- Deep analytics dashboards (beyond a basic **clicks-over-time** chart).
- Custom branded domains per tenant (v2+).
- Advanced billing/quotas (tiering beyond free limit) (v2+).

---

## 2) Personas & Core Use Cases

- **Marketing manager:** creates campaign links with UTMs, downloads QR for print.
- **SMB owner:** quick links with QR for menus/posters.
- **Ops / Agency (v2+):** multiple clients (tenants), organizes links by campaign. *(Out of scope for v1)*

---

## 3) User Stories (MVP, high priority)

- As a user, I can create a short link from a destination URL.
- As a user, I can add/modify UTM params (source, medium, campaign, term, content + custom).
- As a user, I can set a custom slug if available.
- As a user, I can generate and download a QR code for the short link in common formats.
- As a tenant admin, I can invite members and control access.
- As any member, I can list, search, and edit my tenant’s links.
- As a user, I can view a **clicks-over-time** chart per link.

---

## 4) Functional Requirements

### 4.1 Link creation & management

- Input: destination URL (validated), optional custom slug, optional expiration date (v1), tags (v1).

- UTM builder: UI shows common fields with live preview of resulting URL.

- Auto-canonicalization:

  - merges UTMs into the URL’s query string, preserves existing params, dedupes keys (UTM wins on conflict), lowercases standard UTM keys, percent-encodes values.

- UTM keys supported: **utm\_source**, **utm\_medium**, **utm\_campaign**, **utm\_term**, **utm\_content** (no custom keys in MVP).

- Key casing: standard UTM keys are **lowercased**; values keep user casing.

- Limits: **Free tier** allows up to **5 active links per tenant**; attempting to create more prompts an upgrade CTA.

- On save: backend reserves `shortId`, writes link doc, returns `shortUrl` and QR endpoints.

- List & search: by title/slug/URL/tag; sort by createdAt.

### 4.2 QR codes

- Server-side generation via Function (on-the-fly), with caching headers.
- Options surfaced in UI (MVP): size (px), margin, error correction level (M/Q/H), dark/light colors.
- Download formats (MVP): **PNG**, **SVG**. (PDF/EPS in v2+.)
- Presets: **Web** — 256, 512 px; **Print** — 3 cm @ 300 DPI (≈354 px), 5 cm @ 300 DPI (≈591 px).
- Direct image endpoints:
  - `https://s.<domain>/qr/:shortId.png`
  - `https://s.<domain>/qr/:shortId.svg`

### 4.3 Redirects

- Hosting rewrite `s.<domain>/:shortId → redirect()` Function.
- 302 redirect to long URL; respects active/expired states.
- Foundational click logging (server-only write) to enable future analytics.

### 4.4 Multitenancy & roles

- Tenants (workspaces) with **Owner**, **Admin**, **Member** roles.
- Owners/Admins can invite/remove members; Members can CRUD links.
- Users can belong to multiple tenants; switcher in UI.
- Auth providers: **Email/Password** + **Google Sign-In** (MVP).

### 4.5 Minimal Analytics (Vega) — MVP

- Show a single **line chart** of daily clicks for a selected link.
- Library: **Vega** (vega-runtime in the SPA; no external calls).
- Data: client aggregates from `clicks` events (group by day) for small ranges; when daily rollups exist later, use them.
- Controls: time range (7/30/90 days/ Custom Date Range), hover tooltip, total count label.
- Performance note: paginate or bound query window to avoid loading >10k events at once.

---

## 5) Non-Functional Requirements

- **Latency:** p95 redirect < 150 ms from edge (Hosting → Function).
- **Scale (MVP target):** up to 1M stored click events; peak 100 rps sustained per hottest link (sharded if needed).
- **Availability:** 99.9% monthly for redirects.
- **Security:** Firebase Auth + tenant-scoped Firestore rules; QR endpoints and redirects are public.
- **Privacy:** no raw IP storage; only salted hash; GDPR-friendly data export (phase 2).
- **Accessibility:** UI meets WCAG AA for forms/buttons.

---

## 6) Data Model (Firestore, modular API)

### Paths

```
/tenants/{tenantId}
/tenants/{tenantId}/members/{uid}
/tenants/{tenantId}/links/{linkId}
/tenants/{tenantId}/links/{linkId}/clicks/{eventId}      // raw (write-only from server)
/linkStats/{linkId}/daily/{YYYY-MM-DD}                   // aggregated later (phase 2)
```

### Link document

```ts
{
  tenantId: string,
  shortId: string,            // unique within global short domain
  longUrl: string,            // final canonical URL (with UTMs)
  baseUrl: string,            // destination URL before UTMs (for editing)
  utm?: { source?: string; medium?: string; campaign?: string; term?: string; content?: string; [k:string]: string },
  isActive: boolean,
  createdAt: Timestamp,
  createdBy: string,          // uid
  expiresAt?: Timestamp,
  slugLocked?: boolean,       // if custom slug reserved
  qrStyle?: { size?: number; margin?: number; ecLevel?: 'M'|'Q'|'H'; fg?: string; bg?: string }
}
```

### Click event (foundation for time series)

```ts
{
  tenantId: string, linkId: string,
  ts: Timestamp,               // serverTimestamp
  bucket?: number,             // 0..9, only if write bursts demand
  referrer?: string|null, ua?: string|null,
  device?: 'mobile'|'desktop'|'tablet'|'bot'|'unknown',
  browser?: string|null, os?: string|null,
  country?: string|null, city?: string|null,
  ipHash?: string|null
}
```

---

## 7) API Surface (Cloud Functions v2, HTTPS)

- `POST /createShortLink`

  - **Body:** `{ tenantId, baseUrl, utm?, customSlug?, qrStyle? }`
  - **Resp:** `{ linkId, shortId, shortUrl, qrUrls: { png, svg } }`
  - **Errors:** 400 invalid URL; 409 slug taken.

- `GET /r/:shortId`

  - 302 redirect; logs click server-side.

- `GET /qr/:shortId(.png|.svg)`

  - Returns QR image; supports `?size=512&ec=Q&margin=1&fg=%23000&bg=%23fff`.

- `GET /tenants/:tenantId/links` (auth)

  - Paginated list of links for UI.

*(PDF/EPS QR export, custom domains, and admin endpoints are v1 candidates.)*

---

## 8) Firestore Security (summary)

- Tenanted path authorizes by membership; clicks are **read-deny, server-write**.
- Links readable/writable by tenant members; shortId uniqueness enforced via Function.
- Field indexing disabled on high-cardinality unused fields (ua, ipHash, etc.).

---

## 9) UX Flows (MVP)

**1) Create Link**

- Enter destination URL → expand “Add UTM” → fill preset fields → preview final URL.
- Optional: set custom slug → system validates availability.
- Save → shows short link, copy button, QR preview + Download buttons (PNG/SVG).

**2) Manage Links**

- List with search (slug/URL/tag), filters (active/expired), inline copy short link, open QR modal.

**3) Tenant & Members**

- Tenant switcher in header; simple invite flow by email (role selection).

---

## 10) Acceptance Criteria

- Given a valid URL, when I click **Create**, then I receive a unique short URL and a visible QR preview.
- Given UTM inputs, when I save, then the stored long URL contains canonicalized UTMs (lowercased keys, encoded values), preserves existing query params, and dedupes with UTM taking precedence.
- Given a custom slug, if it’s available (3–20 URL-safe chars), creation succeeds; if not, I get a clear 409 “slug taken.”
- Given a short link page, I can download QR as PNG and SVG at chosen size; files open correctly in standard viewers and print apps.
- Redirect p95 < 150 ms (measured via synthetic checks).
- Non-members cannot read or write another tenant’s links; clicks collection is not readable by clients.

---

## 11) Milestones & Rollout

**M0 — Foundations (1–2 weeks)**

- Project setup, multi-tenant data model, auth & roles, Hosting rewrites, Functions skeletons.
- Auth providers configured: **Email/Password + Google**.

**M1 — Core creation & QR (1–2 weeks)**

- Create link API, UTM builder UI (standard UTM set), QR generation (PNG/SVG), link list/search, **clicks-over-time chart (Vega)**.

**M2 — Hardening (1 week)**

- Rate limiting + App Check, validation, error UX, p95 latency tuning, basic click logging foundation, **free-tier limit enforcement (5 active links/tenant)**.

**M3 — Nice-to-haves (v1 candidates)**

- Expiry dates, tags, PDF QR export, custom colors, CSV export of links, member invites UI polish.

---

## 12) Decisions & Clarifications (Locked)

- **QR formats (MVP):** PNG + SVG. **PDF/EPS** deferred to **v2+**.
- **Custom slugs:** No extra reserved words or rules beyond `[A-Za-z0-9_-]{3,20}`.
- **UTM policy:** Support the standard set — `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`. No arbitrary custom keys in MVP. Keys are **lowercased**; values keep user casing. No enforcement of a generic `utm_*` prefix beyond the standard set.
- **Tenant model:** Roles = **Owner/Admin/Member**. No cross-tenant link sharing required.
- **Auth providers:** Email/Password **and** Google Sign-In at launch.
- **Limits (MVP):** Free tier with up to **5 active links per tenant**; higher tiers later.
- **Branding colors / logo in QR:** Defer to **v2**.
- **Domains:** Use one short brand domain now (e.g., `s.brand.com`). Custom domains per tenant in **v2+**.
- **Compliance:** Standard GDPR posture for MVP; DSAR/export workflows deferred to **v1**.
- **Analytics at launch:** Include a basic **clicks-over-time** chart implemented with **Vega**.
- **Print presets:** Provide basic presets (Web: 256/512 px; Print: 3 cm @ 300 DPI ≈354 px, 5 cm @ 300 DPI ≈591 px).

---

## 13) Tricky Bits (plain-English)

- **Multi-tenancy isolation:** Putting data under `/tenants/{tenantId}/…` makes security rules and “delete all data for a client” easy and safe.
- **Sequential-timestamp hotspots:** If a single viral link gets very high click rates, a naive `ts` index can throttle writes. We add a lightweight **bucket** field (0–9) to shard writes while keeping time-range queries simple.
- **Vector vs raster QR:** **SVG/PDF** scale perfectly for print; **PNG** is best for web. Most marketers need both — start with SVG/PNG and add PDF later.

