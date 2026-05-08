# AOH — Project 1 Brief for Incoming Developers

> This brief gives you what you need to scope a quote for Project 1. It is intentionally a technical scope, not a business doc.
>
> **Read order:**
> 1. This file — Project 1 scope, stack, work items, constraints
> 2. [`README.md`](./README.md) — repo conventions, deploy, branch strategy
> 3. [`DESIGN.md`](./DESIGN.md) — design system reference (tokens are locked; you do not pick colors or fonts)

---

## What we're building

The marketing site for **AI Outsource Hub** — a done-for-you AI services agency for local small and mid-sized businesses. Live at **aioutsourcehub.com**. The current build (v9) is scaffolded; we're hiring to take it from scaffolded to launch quality.

Service pillars (each gets its own page):

- **Reviews** — review management
- **Relay** — voice receptionist
- **AI Visibility** — AEO/GEO + website visibility work
- **Studio** — content production

Site does NOT need to support transactions, accounts, or user logins. It is a marketing site that converts to a hub-side workflow we already operate.

---

## Project 1 scope

### Current state

- Next.js 16 App Router, React 19, Tailwind v4, Geist, Vercel
- Single-page homepage, scaffolded but needs polish
- Schema.org `Organization` + `WebSite` JSON-LD wired in `app/layout.tsx`
- `llms.txt` + AI-crawler-friendly `robots.txt` in `/public`
- 8 components shipped: Navbar, Hero, AuditMagnet, Services, About, Testimonials, FAQ, Footer

### Homepage structure (current sections)

1. **Navbar** — anchors below + a single primary CTA
2. **Hero** — animated SVG arch gradient, 3-line headline, subhead, CTA
3. **AuditMagnet** — free audit lead-magnet form
4. **Services** — 4 service cards
5. **About** — 3 founders block, honest framing
6. **Testimonials** — placeholder until real ones land
7. **FAQ** — common SMB-owner questions
8. **Footer** — minimal, no regional anchor

### Pages to build (in scope for Project 1)

- `/services/reviews`
- `/services/relay`
- `/services/ai-visibility`
- `/services/studio`
- Optional: `/about`, `/contact`, `/audit` (lead-magnet results page)

### Work items

- Polish all 8 existing sections (spacing, type rhythm, motion restraint, mobile parity)
- Build the 4 service pillar pages on the same design system
- Schema.org JSON-LD per page: `Organization`, `LocalBusiness` / `ProfessionalService`, `Service` per pillar, `FAQPage`, `BreadcrumbList`
- Audit passes:
  - AEO — `llms.txt` accuracy, structured-content alignment with rendered HTML
  - Accessibility — WCAG 2.1 AA
  - Performance — Lighthouse 95+, sub-1s LCP
- On-site signals for Google Business Profile alignment
- Fix small bugs visible in the live build (casing inconsistencies, dev-facing artifacts)
- Motion polish using Framer Motion sparingly

### What's NOT in Project 1 scope

- Logo redesign (separate workflow)
- E-commerce or payments
- CMS integration
- Authentication or user accounts
- Multilingual content (English only)
- Video production
- Backend / database

---

## Stack (locked)

- Next.js 16+ App Router, React 19
- Tailwind v4
- TypeScript
- Vercel + GitHub (push to `main`, Vercel auto-deploys)
- Geist Sans / Geist Mono
- Framer Motion (used sparingly)

Design tokens (palette, typography, motion timing) live in `app/globals.css` under `@theme`. They are locked — you do not propose color/font alternatives. See `DESIGN.md` for the full token map and animation rules.

---

## Hard rules (non-negotiable)

- **No regional anchors.** No specific city/state names. Default to neutral plural ("local businesses", "shop owners"). Existing copy has been audited for this; new copy must hold the line.
- **No single-niche pigeonholing.** Rotate niche examples across copy; never lead with one specific industry.
- **No fake testimonials.** Placeholder copy is intentional until real testimonials land. The current testimonial component is honest about being placeholder.
- **No banned hype phrases.** "Transform your business," "revolutionize," "game-changer," "10x," "next-level," "synergy," "unleash" — all out. Voice is direct, operator-tone.
- **No technical jargon in customer-facing copy.** Keep it plain — "your platform," "your hub," "we run it" — instead of vendor names or technical terms.
- **AEO / GEO baked in.** Every visual choice must respect semantic HTML, schema markup, and sub-1s LCP. Visual richness cannot compromise crawler-readability.

---

## Reference files in this repo

- [`README.md`](./README.md) — tech stack, deploy, branch + commit conventions
- [`DESIGN.md`](./DESIGN.md) — design system, tokens, animation rules, anti-patterns

---

## How to scope a quote

Give us:

- **Hours estimate for Project 1** (range OK)
- Rough timeline from start to ship
- Hourly rate or fixed-bid number
- Anything in your portfolio that demonstrates the AEO/GEO + Schema.org work specifically

Quote what you'd actually deliver. We'll discuss the rest on the call.

— Mike (AI Outsource Hub)
