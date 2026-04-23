# Back Garden Pizzeria — Brand Guidelines
> Internal reference for MJBlount Web Design. Paste the briefing block at the bottom into any Claude conversation, Figma session or VS Code build to maintain brand consistency.

---

## The brand in one sentence
A founder-led Bristol sourdough pizzeria with a genuine grassroots story — warm, unpretentious, community-rooted, and passionate about real Italian food.

---

## Founder & story
- **Founded by:** Danny (& Roseanna)
- **Started:** Lockdown 2020, selling pizzas to mates via a WhatsApp group ("Party Pizza Line") from his back garden in Barton Hill
- **Grew into:** City-wide Bristol delivery → mobile festival catering → physical restaurant
- **Now:** Permanent city centre restaurant at 35 St Stephens Street + mobile arm (The Big Arancini)
- **Experience:** 10 years cooking pizza in Bristol

This origin story is central to the brand. It should feel present in copy and design — earned, not manufactured.

---

## Sub-brand: The Big Arancini
- Mobile catering for festivals, markets and private events
- Established at Shambala Festival, previously Glastonbury
- Sibling brand — same warmth, more adventurous/mobile energy

---

## Tone of voice

| Do | Don't |
|---|---|
| Warm, direct, personal ("Hey! I'm Danny...") | Corporate, stiff, formal |
| Bristol-proud, local references | Generic "nationwide" language |
| Honest and unpretentious | Overly polished or try-hard |
| Enthusiastic about ingredients and craft | Vague food platitudes ("delicious food!") |
| Conversational, like a mate recommending somewhere | Marketing-speak |

**Example copy:**
> "We've been Bristol-based and making pizzas for over a decade, dedicated to authentic Italian food with a Sicilian twist."

---

## Colour palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Burnt Orange | `#C44A0C` | Main brand colour, CTAs, highlights |
| Secondary | Dark Slate | `#1D242B` | Dark backgrounds, nav, footers |
| Accent | Amber Yellow | `#F2B53B` | Supporting highlights, warmth |
| Background | White | `#FFFFFF` | Page backgrounds |
| Text | Black | `#000000` | Body text |

> Green (`#2B3502`) exists in the original palette but is not in active use.

**Contrast rule:** Always check sufficient contrast. Orange on white ✓, white on dark slate ✓, black on amber ✓, orange on black ✓.

---

## Typography

| Role | Font | Weight | Source |
|---|---|---|---|
| Titles | Prater Sans Pro | Bold | Adobe Fonts (activation required) |
| Headings | Prater Sans Pro | Regular | Adobe Fonts (activation required) |
| Body | Karla | Bold | Google Fonts (free) |
| Fallback | Any thick bold font | — | Use in capitals |

**Google Fonts (Karla):**
```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@700&display=swap');
```

**Web / dashboard note:** Use Karla Bold as the primary web font. Prater Sans Pro is for Figma and WordPress (via Adobe Fonts embed). Do not use Prater on the Next.js dashboard unless a web licence is confirmed.

---

## Logo

**Designer:** Cai Burton — info@caiburton.co.uk
**File location:** `/public/clients/back-garden-pizzeria/`

### The mark
A stylised snowflake / herb icon — distinctive, hand-drawn feel. Always keep it prominent.

### Full inventory

| Key | Filename | Type | Colours | Use on |
|---|---|---|---|---|
| `full_orange_on_black` | `Back-Garden-Pizzeria-Logo_16WoB_Full.svg` | Full horizontal lockup | Orange on black | Dark/black backgrounds, hero sections |
| `full_white_on_black` | `Back-Garden-Pizzeria-Logo_16WoB_Full.svg` | Full horizontal lockup | White on black | Dark backgrounds, subdued contexts |
| `full_white_on_red` | `Back-Garden-Pizzeria-Logo_1WoR_Full.svg` | Full horizontal lockup | White on orange | Orange/primary backgrounds |
| `icon_white_on_black` | `Back-Garden-Pizzeria-Logo_19WoB_Logo.svg` | Icon / mark only | White on black | Favicon, app icon, dark small contexts |
| `icon_black_on_white` | `Back-Garden-Pizzeria-Logo_14BoW_Logo.svg` | Icon / mark only | Black on white | Light backgrounds, small contexts |
| `icon_orange_on_white` | `Back-Garden-Pizzeria-Logo_4RoW_Logo.svg` | Icon / mark only | Orange on white | Light backgrounds, brand colour visible |

### Quick reference: which logo to use

```
Light/white background   → icon_orange_on_white or icon_black_on_white
Dark/black background    → full_orange_on_black or icon_white_on_black
Orange background        → full_white_on_red
Dashboard (dark slate)   → full_orange_on_black
Favicon                  → icon_white_on_black
```

---

## Website

| Detail | Value |
|---|---|
| Platform | WordPress |
| Domain | backgardenpizzeria.com |
| Built by | MJBlount Web Design |
| Order system | order.backgardenpizzeria.com |
| Reservations | /reservations/ |

### Key conversions to track
1. Book a table
2. Online order clicks
3. Event / catering enquiries
4. Phone number clicks
5. Menu page views

---

## Analytics

| Detail | Value |
|---|---|
| GA4 Property ID | `G-GZC5SKB658` ← fill in |
| GTM Container ID | `GTM-TVFWWR9S` ← fill in |

---

## Claude briefing block
> Copy and paste this into any new Claude conversation to instantly brief it on this client.

```
Client: Back Garden Pizzeria (backgardenpizzeria.com)
Founded by Danny in Bristol, 2020. Sourdough pizzeria with Sicilian influences.
Started as a back garden WhatsApp delivery service, now a city centre restaurant.
Sub-brand: The Big Arancini (mobile festival catering).
Tone: warm, personal, Bristol-proud, unpretentious, founder-led.
Platform: WordPress. Built by MJBlount Web Design.

Colours:
- Primary (burnt orange): #C44A0C
- Secondary (dark slate): #1D242B
- Accent (amber): #F2B53B
- Background: #FFFFFF | Text: #000000

Typography:
- Titles: Prater Sans Pro Bold (Adobe)
- Headings: Prater Sans Pro Regular (Adobe)
- Body: Karla Bold (Google Fonts)
- Fallback: thick bold font in capitals

Logo: stylised snowflake/herb mark. Full lockup + icon-only variants available.
Use full_orange_on_black on dark backgrounds, icon_orange_on_white on light backgrounds.
Logo files in: /public/clients/back-garden-pizzeria/

Key conversions: table bookings, online orders, catering enquiries.
```

---

## To-do
- [ ] Copy all 5 SVG logo files to `/public/clients/back-garden-pizzeria/`
- [ ] Fill in GA4 property ID
- [ ] Fill in GTM container ID
- [ ] Confirm Instagram handle with Danny
- [ ] Confirm Adobe Fonts embed code for Prater Sans Pro on WordPress
