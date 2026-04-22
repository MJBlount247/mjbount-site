@AGENTS.md

# MJBlount — Client Analytics Dashboard

## Project overview
This is the internal agency dashboard for MJBlount Web Design. It displays analytics data for all clients, with each client getting a fully branded dashboard page driven by their JSON config file.

## Tech stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Data source:** `/data/clients/*.json` — one file per client
- **Analytics:** Google Analytics 4 API (per client GA4 property ID)
- **AI summaries:** Anthropic API (claude-sonnet-4-20250514)
- **Hosting:** Vercel or Netlify

## Project structure
```
/
├── app/
│   ├── page.tsx                  # Master view — all clients
│   └── dashboard/[slug]/
│       └── page.tsx              # Individual client dashboard
├── data/
│   └── clients/
│       └── back-garden-pizzeria.json
├── public/
│   └── clients/
│       └── back-garden-pizzeria/ # Logo SVGs per client
├── lib/
│   ├── getClient.ts              # Load client JSON by slug
│   ├── ga4.ts                    # GA4 API helpers
│   └── analytics.ts              # Data formatting utilities
├── components/
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── TrafficChart.tsx
│   │   ├── SourcesChart.tsx
│   │   ├── TopPages.tsx
│   │   └── AISummary.tsx
│   └── ClientCard.tsx            # Used on master view
├── CLAUDE.md
└── AGENTS.md
```

## Client data system
Each client is defined by a JSON file in `/data/clients/[slug].json`. This is the single source of truth for:
- Brand colours, fonts, logo variants
- GA4 property ID and GTM container ID
- Business info, services, tone of voice
- Dashboard theme overrides

**Never hardcode client-specific values in components.** Always read from the client JSON via `getClient(slug)`.

## Adding a new client
1. Create `/data/clients/[new-slug].json` using the existing BGP file as a template
2. Add logo files to `/public/clients/[new-slug]/`
3. The dashboard route `/dashboard/[new-slug]` will work automatically
4. No other code changes needed

## Coding conventions
- TypeScript throughout
- Tailwind for all styling — use CSS variables from client JSON for brand colours (inject via inline style or CSS vars at the layout level)
- No hardcoded hex values in components — always pull from `client.brand`
- Keep components generic and client-agnostic
- Use `async/await` for all data fetching
- GA4 API calls happen server-side (API keys stay on server)

## Environment variables
```
ANTHROPIC_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=  # Path to GA4 service account JSON
```

## Key behaviours
- The master page (`/`) shows all clients as cards — name, logo, last 30 days visits, quick status
- Clicking a client goes to `/dashboard/[slug]`
- Each client dashboard applies that client's brand colours, logo and fonts
- An AI summary is generated via the Anthropic API using live GA4 data
- All GA4 API calls are server-side — never expose credentials to the client