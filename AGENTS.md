# AGENTS.md — MJBlount Dashboard

## Agent behaviour

This is a private agency tool — there is no client-facing dashboard. The only client-facing output is exported PDF reports. Do not add any visibility toggles, "my eyes only" UI, or permission logic to dashboard components. Everything in the dashboard is for the agency owner.

Before writing any code, always:
1. Check which client is in scope — read `/data/clients/[slug].json`
2. Apply their brand — colours, fonts and logo come from the JSON, never hardcoded
3. Keep components generic — they receive client data as props

---

## Client brand system

### Reading a client
```typescript
import fs from 'fs'
import path from 'path'

export function getClient(slug: string) {
  const file = path.join(process.cwd(), 'data/clients', `${slug}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

export function getAllClients() {
  const dir = path.join(process.cwd(), 'data/clients')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')))
}
```

### Applying brand colours
```tsx
<div style={{
  '--brand-primary': client.brand.primary,
  '--brand-secondary': client.brand.secondary,
  '--brand-accent': client.brand.accent,
} as React.CSSProperties}>
```

### Logo selection
```typescript
function getLogo(client: Client, context: 'dark' | 'light' | 'icon') {
  const base = `/clients/${client.slug}/`
  const map = {
    dark:  client.brand.logo.full_orange_on_black,
    light: client.brand.logo.icon_orange_on_white,
    icon:  client.brand.logo.icon_white_on_black,
  }
  return base + map[context]
}
```

---

## Active clients

| Client | Slug | GA4 ID | GTM ID |
|---|---|---|---|
| Back Garden Pizzeria | `back-garden-pizzeria` | `G-GZC5SKB658` | `GTM-TVFWWR9S` |

---

## Module overview

Each module follows the same pattern:
- A summary `ModuleCard` on the main dashboard (status, key metric, top finding)
- A full detail view inside `SlidePanel` — no separate page navigation
- An exportable section that can be included in the PDF report builder

### Module 1 — Traffic & behaviour
**Data source:** GA4 API (server-side)
**Key metrics:** sessions, unique visitors, avg session duration, top pages, traffic sources
**GA4 pattern:**
```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data'
const analyticsClient = new BetaAnalyticsDataClient()

export async function getTrafficData(propertyId: string) {
  const [response] = await analyticsClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
  })
  return response.rows
}
```

### Module 2 — ROI calculator
**Data source:** GA4 goal completions + client JSON (`roi` key) — calculated client-side
**Key outputs:** estimated revenue, cost per lead, ROI multiplier, verdict
**ROI JSON schema:**
```json
"roi": {
  "close_rate": 0.6,
  "build_cost": 1200,
  "amortise_months": 12,
  "monthly_retainer": 83,
  "conversion_types": [
    { "name": "Table bookings", "ga4_event": "generate_lead", "value": 55 },
    { "name": "Order & collect", "ga4_event": "order_click", "value": 28 },
    { "name": "Catering enquiries", "ga4_event": "catering_enquiry", "value": 380 },
    { "name": "Phone clicks", "ga4_event": "phone_click", "value": 0 }
  ]
}
```
Inputs are editable in the dashboard and saved via `PATCH /api/clients/[slug]`.

### Module 3 — Technical audit
**Data source:** MCP browser tool crawling the live site on demand
**Key checks:** broken links, missing meta descriptions, missing alt text, redirect chains, mobile viewport
**Pattern:** Run via API route that triggers a headless crawl, results cached in `/data/cache/[slug]-technical.json`

### Module 4 — Site speed
**Data source:** Google PageSpeed Insights API (free, no auth required for basic use)
**Tested pages:** every URL in `client.website.key_pages` — relative paths are resolved to `https://{client.domain}{path}`, absolute URLs are used as-is
**Key metrics:** Performance, SEO, Accessibility, Best Practices scores (mobile + desktop); Core Web Vitals (LCP, CLS, INP, FCP, TTFB, Speed Index); top 4 opportunities
**API pattern:** mobile and desktop run in parallel with `Promise.all`
```typescript
// lib/pagespeed.ts — returns SpeedData | null
// Categories:  lighthouseResult.categories['best-practices'].score  (× 100 for 0–100)
// CWVs:        lighthouseResult.audits['largest-contentful-paint'].displayValue / .numericValue
// Opportunity: audits where details.type === 'opportunity', sorted by details.overallSavingsMs desc, top 4
export async function getSpeedScore(url: string): Promise<SpeedData | null>
```

**Client-side fetch route:** `GET /api/speed?url=` — called when the user switches page tabs in the SlidePanel

**SpeedScore component spec** (`components/dashboard/speed/SpeedScore.tsx`):
- Props: `client: ClientConfig`, `initialData: SpeedData | null`
- Page tabs — one per entry in `client.website.key_pages`; clicking a tab fetches `/api/speed?url=` for that page
- Two device cards side by side (Mobile + Desktop): score ring (Performance, coloured green/amber/red) + SEO, Accessibility, Best Practices as a compact sub-list
- Core Web Vitals grid (6 cards — LCP, CLS, INP, FCP, TTFB, Speed Index): value colour-coded to Google thresholds, target label, progress bar using `numericValue`
- Opportunities list (up to 4): red dot if savingsMs > 1000ms else amber dot, title, description, saving in seconds (right-aligned)
- Full report link: `https://pagespeed.web.dev/report?url={currentPageUrl}`

**Multi-page speed testing pattern:**
Use `client.website.key_pages` as the list of URLs to test — no separate `speed_test_urls` array.
Every client JSON's `website.key_pages` is the single source of truth for which pages the speed module tests.
Relative paths (`/menu/`) are resolved to full URLs at call time; absolute URLs (external subdomains) are used as-is.

### Module 5 — SEO / AEO audit
**Data source:** Google Search Console API + Claude analysis of page content
**Key checks:** impressions, clicks, average position, crawl errors, schema markup, FAQ/AEO readiness
**AEO check:** Claude reads page content and assesses whether it would be cited by AI search (structured answers, FAQ schema, clear entity definitions)

### Module 6 — Strategic audit
**Data source:** Claude reads the live site via MCP browser tool + client brand guidelines JSON
**Runs:** On demand (not automatic). Results cached in `/data/cache/[slug]-strategic.json` with timestamp.
**Sections:** Conversion & CTAs, Brand messaging, Competitive positioning, Content & social proof, Digital marketing strategy
**Output:** Scored sections (0–100), findings with severity, top 3 recommended actions

### Module 7 — Site maintenance
**Always visible on dashboard, no toggle.**
**Data source:** WP REST API or manual fields in client JSON
**Checks:** WordPress version, PHP version, SSL certificate expiry, plugin versions and update status
**JSON schema:**
```json
"maintenance": {
  "wordpress_version": "6.5.3",
  "php_version": "7.4",
  "php_target": "8.2",
  "ssl_expiry": "2027-01-12",
  "plugins": [
    { "name": "Yoast SEO", "status": "update_available" },
    { "name": "GTM4WP", "status": "up_to_date" },
    { "name": "WPCode", "status": "critical_update" }
  ]
}
```

---

## AI summary caching

Generate once, serve cached. Never call Anthropic API on every page load.

```typescript
// On load: check cache first
const cache = await getCachedSummary(slug)
if (cache) return cache.summary

// On manual refresh: generate and cache
const summary = await generateSummary(client, analyticsData)
await writeSummaryCache(slug, summary)
return summary
```

Cache files live in `/data/cache/[slug]-summary.json`.

---

## Report export

Route: `/dashboard/[slug]/export`

The report builder:
1. Renders checkboxes for each module (all checked by default)
2. Shows a live preview of the branded PDF layout
3. On export: generates PDF using client brand (logo, primary colour, accent, Karla font)
4. Footer: "Prepared by MJBlount Web Design · [date]"
5. No agency-internal values (fees, close rate) included in exports

Use `@react-pdf/renderer` for PDF generation — it runs server-side and supports custom fonts and brand colours.

---

## Component props pattern

```typescript
// Every module card follows this interface
interface ModuleCardProps {
  title: string
  status: 'good' | 'warning' | 'issue' | 'info'
  metric?: string
  metricLabel?: string
  findings?: string[]
  onExpand: () => void  // opens SlidePanel
}
```

---

## File naming
- Client JSON: `[slug].json`
- Cache files: `[slug]-[module].json` in `/data/cache/`
- Components: PascalCase in `/components/dashboard/[module]/`
- API routes: `/app/api/[resource]/route.ts`