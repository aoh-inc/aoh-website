# AOH Website (`aoh-inc/aoh-website`)

The marketing site for **AI Outsource Hub** — a done-for-you AI services agency for local small businesses. Live at [aioutsourcehub.com](https://aioutsourcehub.com).

> **New developer? Read in this order:**
> 1. This README — repo overview, deploy, conventions
> 2. [`HIRING.md`](./HIRING.md) — Project 1 brief and scope
> 3. [`PRODUCT.md`](./PRODUCT.md) — what AOH is, what it sells, who it serves
> 4. [`DESIGN.md`](./DESIGN.md) — visual system, palette, typography, hero pattern

---

## Tech stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.5 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | Framer Motion | 12.x |
| Type | Geist Sans + Geist Mono | 1.7 |
| Hosting | Vercel | — |
| Repo host | GitHub `aoh-inc` org | — |
| Package mgr | npm | — |

One server route — `app/api/report/route.ts` — handles the homepage lead form + token links. Validates requests, verifies Cloudflare Turnstile (or signed token), forwards to a GHL webhook, and applies server-side rate/dedupe controls. Env vars:

- `TURNSTILE_SECRET_KEY`
- `GHL_WEBHOOK_URL`
- `REPORT_LINK_SECRET` (required for `/r/{token}` outbound links)
- Optional durable limits: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

(Set in Vercel project settings; `.env.local` for local dev). Everything else is fully static and server-rendered.

## Lead capture routes + env

- `/api/report` -> homepage form -> `GHL_WEBHOOK_URL`
- `/api/contact` -> contact form -> `GHL_CONTACT_WEBHOOK_URL` (falls back to `GHL_WEBHOOK_URL`)
- `/api/newsletter` -> newsletter form -> `GHL_NEWSLETTER_WEBHOOK_URL` (falls back to `GHL_WEBHOOK_URL`)

Required/optional envs:
- `TURNSTILE_SECRET_KEY` (used by report/contact anti-bot validation)
- `GHL_WEBHOOK_URL` (base fallback webhook)
- `GHL_CONTACT_WEBHOOK_URL` (optional contact-specific webhook)
- `GHL_NEWSLETTER_WEBHOOK_URL` (optional newsletter-specific webhook)

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Linting:

```bash
npm run lint
```

## Page architecture

Multi-page site (12 routes, all server-rendered + statically prerendered).

**Top-level routes:** `/`, `/about`, `/pricing`, `/contact`, `/faq`, `/privacy`, `/terms`
**Service pages:** `/reviews`, `/ai-visibility`, `/relay`, `/studio`, `/rankings`
**Server route:** `/api/report` (lead form)

Homepage sections (`app/page.tsx`):

1. **Navbar** (`components/Navbar.tsx`)
2. **HeroEmailForm** (`components/hero/HeroEmailForm.tsx`) — dark exception, alternating `HeroVisualAI` / `HeroVisualReviews` per campaign variant
3. **RevenueCalculator** (`components/RevenueCalculator.tsx`) — interactive revenue-loss calculator
4. **Services grid** — inline in `app/page.tsx`
5. **SocialProof** (`components/sections/SocialProof.tsx`) — placeholder until real testimonials land
6. **FAQ** (`components/sections/FAQ.tsx`)
7. **Footer** (`components/sections/Footer.tsx`)

Sub-pages compose `components/PageHeader` + `components/PageBody` (`PageSection`, `CtaBlock`) primitives — extend these, don't duplicate the layout.

JSON-LD strategy: `Organization` + `WebSite` in `app/layout.tsx`; `Service` schema on each service page; `BreadcrumbList` on every sub-page (helper in `lib/seo.ts`); `FAQPage` on home + `/faq` (data in `lib/faq.ts`).

## Design system at a glance

**Light mode default. Hero is the only dark exception.** Token definitions live in `app/globals.css` under `@theme`. Read [`DESIGN.md`](./DESIGN.md) for the why behind every choice.

| Token | Value | Used for |
|---|---|---|
| `--color-bg-page` | `#F8F6F1` | Page background (warm white) |
| `--color-text-body` | `#1A1F2E` | Body text (near-black, not pure) |
| `--color-accent` | `#2D6A4F` | Pine green — the single brand accent |
| `--color-hero-bg` | `#0F1419` | Hero dark exception |

Don't introduce a second accent. Don't switch to pure white or pure black. Don't add gradients beyond the hero arch.

## Deploy

**Branch `main` auto-deploys to production at `aioutsourcehub.com` via Vercel.** Pushes to feature branches generate Vercel preview URLs automatically.

To check the most recent deploy: visit Vercel → AI Outsource Hub project → Deployments.

## Branch + commit conventions

- `main` is production. Always green. Never force-push.
- Feature branches: `v{N+1}-{shortname}` (e.g. `v10-logo-refresh`). PR into main. Squash on merge.
- Commit subjects: imperative, ≤72 chars. Body explains *why*, not *what*.
- Versioned milestones: tag commits like `v9: complete redesign per locked design foundation` (see git log for the pattern).

## What this site is NOT

- **Not** a SaaS dashboard. AOH sells a service, not a product.
- **Not** a tech-bro AI agency aesthetic. No purple gradients, no neural-network illustrations, no AI-persona mascots.
- **Not** a regional-craftsman vibe. AOH targets nationally; never anchor to a specific city or state.
- **Not** a stock-photo site. Zero stock photography. Real founder photos only.
- **Not** an enterprise SaaS site. No demo-request gating, no enterprise feature tables.

## Hard rules (don't break)

- **No regional anchors anywhere.** Any city/state references in code or copy → delete.
- **No single-niche pigeonholing.** Default to plural neutral ("local businesses", "shop owners"). Rotate niches across examples; never lead with one.
- **No fake testimonials.** Testimonial component is intentionally honest about being placeholder until real ones land.
- **No banned hype phrases.** "Transform your business," "revolutionize," "game-changer," "synergy," "10x," "next-level," "unleash" — all out. Voice is direct and operator-tone.
- **No technical jargon in customer-facing copy.** No vendor names, no `place_id`, no API terminology. Use plain language: "our platform" / "your hub" / "we run it."
- **AEO / GEO baked in.** Every visual choice respects semantic HTML, schema markup, sub-1s LCP. Don't break crawler-readability for visual flair.

## Completed since v9 (2026-05-08)

Project 1 in `HIRING.md` was scoped against the v9 single-page site. A lot has shipped since. Don't re-quote these:

- ✅ Multi-page IA built — `/about`, `/pricing`, `/contact`, `/faq`, `/privacy`, `/terms` + 5 service pages (`/reviews`, `/ai-visibility`, `/relay`, `/studio`, `/rankings`)
- ✅ JSON-LD baked in per page — `Organization`, `WebSite`, `Service` per pillar, `BreadcrumbList`, `FAQPage`
- ✅ `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt` — AI crawlers explicitly allowlisted
- ✅ `app/opengraph-image.tsx` — 1200×630 OG image generator (`next/og`)
- ✅ Per-page metadata: unique title, description, `alternates.canonical`
- ✅ `app/api/report` POST endpoint — Turnstile + GHL webhook + rate-limit
- ✅ `next.config.ts` — 301/308 redirects from ~150 old WordPress URLs
- ✅ Google Search Console verified (DNS TXT), sitemap submitted
- ✅ Vercel auto-deploy from `main`

`HIRING.md` is the v9 scope and is partly stale. Active job listings live on Contra.

## Cross-refs

- [`HIRING.md`](./HIRING.md) — original Project 1 brief (partly superseded by what's listed above)
- [`PRODUCT.md`](./PRODUCT.md) — product context
- [`DESIGN.md`](./DESIGN.md) — design system

## PP Wiring
- See \\docs/PP_GHL_WIRING.md\\ for full Prospecting Premium + GHL callback mapping.
