# AOH — Design System

> **Status:** Locked v9 (2026-05-04). Tokens defined in `app/globals.css` under `@theme`. Components implement these tokens via Tailwind utility classes or `var(--token)` directly.
>
> **Last verified:** 2026-05-04

---

## Theme: Quiet Competence with Warmth

Register: **Stripe / Linear / Anthropic** for structural confidence, with **warm-white background + earthy neutrals** to bridge AOH's local-SMB audience. The site looks like a leader-in-field operation that's confident enough not to shout — but inviting enough that a 55-year-old pet groomer doesn't bounce because "this isn't for me."

The core tension we resolved: 11x.ai's tech-startup aesthetic (astronauts on alien landscapes) reads as "expensive enterprise" to AOH's audience. We adopted 11x.ai's **structure** (minimalist, generous whitespace, bold-typography hero, customer-trust strip), dropped its **imagery**, added warmth via earthy neutrals + real founder photos.

What this means concretely:

- **Light mode default.** Hero is the only dark exception (animated arch hero, intentionally dramatic).
- **One accent color.** Pine green. No second color, no gradients beyond the hero arch.
- **Typography does the heavy lifting.** Geist Sans + Geist Mono. Oversized hero headlines, careful pairing.
- **Animation is restrained.** Hero text reveal (rolls up from below), arch sway (12s loop), section fade-up on scroll. No parallax, no theatrics.
- **Mobile-first.** Half of all visitors arrive on mobile.
- **Reduced-motion respected.** All animations gated by `@media (prefers-reduced-motion: reduce)`.

## Color tokens

All colors live in `app/globals.css` under `@theme`. Reference via `bg-[var(--color-bg-page)]` in Tailwind or `var(--color-accent)` in inline styles.

### Light mode (default — used everywhere except hero)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-page` | `#F8F6F1` | Page background. Warm white (Cloud Dancer-inspired). NOT pure `#FFFFFF` — pure white reads cold/clinical |
| `--color-bg-elevated` | `#FFFFFF` | Card surfaces only. Pure white is OK for elevated cards against the warm page |
| `--color-text-body` | `#1A1F2E` | Body text. Soft near-black, NOT pure `#000000` — pure black is harsh |
| `--color-text-muted` | `#5A6072` | Captions, secondary copy |
| `--color-border` | `#E8E4DD` | Subtle dividers |

### Brand accent

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#2D6A4F` | Pine green. CTAs, links, brand surfaces |
| `--color-accent-hover` | `#3D7A65` | Hover state |
| `--color-accent-soft` | `#5C8472` | Backgrounds, soft tints |

Why pine green: foundation research (memory: `project_aoh_website_design_foundation_2026-05-04.md`) identified three candidate accents — deep electric blue `#3D5AFE`, warm earthy orange `#E97852`, pine green `#2E5D4F`. Pine green won for warmth + maturity + low cliché-risk (every AI startup has either purple or electric blue in 2025-26).

### Status colors

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#3D7A65` | Success states (matches accent family) |
| `--color-error` | `#B85450` | Errors. Muted brick — NOT pure red. Pure red reads angry/cheap |

### Hero (dark exception)

| Token | Value | Usage |
|---|---|---|
| `--color-hero-bg` | `#0F1419` | Dark hero background |
| `--color-hero-text` | `#F8F6F1` | Hero text (mirrors page warm-white) |
| `--color-hero-arch-1` | `#1B4332` | Pine deep — arch gradient stop 1 |
| `--color-hero-arch-2` | `#10B981` | Emerald — arch gradient stop 2 |
| `--color-hero-arch-3` | `#06B6D4` | Cyan — arch gradient stop 3 |

The hero is the ONLY dark surface on the site. Don't add other dark sections.

## Typography

- **Display + body:** [Geist Sans](https://vercel.com/font) — set via `next/font` in `app/layout.tsx`
- **Mono:** [Geist Mono](https://vercel.com/font) — used for code, version tags, accent metadata
- **Font features enabled:** `cv11`, `ss01`, `ss03` (alternative cuts that read more editorial / less default-Vercel)
- **Smoothing:** `-webkit-font-smoothing: antialiased`

Hero headline scale: oversized (clamp around `clamp(3rem, 7vw, 6rem)` — verify against `components/hero.tsx`). Body type uses Tailwind's default scale.

## Layout

- **Mobile-first.** Containers use Tailwind's responsive prefixes; hero collapses to single-column under `md:`.
- **Generous whitespace.** Sections separated by `py-16` to `py-24` ranges; nothing crammed.
- **Single-page architecture.** All sections live in `app/page.tsx` and render in order:
  1. Navbar
  2. Hero (dark)
  3. AuditMagnet
  4. Services
  5. About
  6. Testimonials
  7. FAQ
  8. Footer

If service pillar pages get added later (Reviews / Relay / AI Visibility / Studio), they go at `app/services/{slug}/page.tsx` and reuse the same design tokens.

## Animation system

All animations live in `app/globals.css` and are gated by `prefers-reduced-motion`.

| Class | Effect | Duration | Used on |
|---|---|---|---|
| `.hero-reveal` | Rolls text up from `translateY(100%)` to `0` | 0.6s with `cubic-bezier(0.16, 1, 0.3, 1)` | Each hero headline line |
| `.hero-reveal-line-1/2/3/subhead/cta` | Stagger delays (0ms, 100ms, 200ms, 500ms, 700ms) | — | Layered hero entry |
| `.arch-sway` | Gentle 4px-up wave | 12s ease-in-out infinite | Hero SVG arch |
| `.fade-up` | Opacity + 16px translate-up on scroll | 0.5s | Section reveals |

When adding new animations: keep them subtle, gate them by reduced-motion, and add the keyframe + class to `globals.css` (don't inline them in components).

## Component conventions

- **Functional components only.** Named exports (`export function Hero()`).
- **`"use client"` directive** at the top of any component using browser APIs, animation hooks, or interactive state. Server-render everything else.
- **Tailwind first** for styling. Inline `style={}` only for animation delays or programmatic values.
- **No CSS-in-JS libraries** (no styled-components, no emotion). Tailwind v4 + `@theme` tokens cover everything.
- **Icons:** lucide-react. Don't introduce a second icon library.
- **Motion:** Framer Motion for one-off complex animations only; CSS keyframes preferred for repeating patterns.

## Schema.org / AEO baked-in

`app/layout.tsx` injects `Organization` + `WebSite` JSON-LD into `<head>`. The site also ships:

- `public/llms.txt` — plain-text business summary that AI crawlers (GPTBot, ClaudeBot, PerplexityBot) prefer over HTML
- `public/robots.txt` — explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, cohere-ai

If you add a new section or page, add the appropriate Schema.org block (e.g., `Service`, `FAQPage`, `BreadcrumbList`) to maintain AEO / GEO surface. See vault `04 AI Outsource Hub/HR/Training/playbooks/SEO-AEO-GEO Setup.md` for the full schema list AOH commits to.

## What this site is NOT (visual-system anti-patterns)

- **No bizfix landing page** — no giant "GET STARTED FREE" buttons in 30pt orange. No screaming.
- **No tech-bro AI agency** — no purple gradients, no abstract neural-network illustrations, no AI-persona avatars (no "Alice"-style mascots).
- **No local-craftsman warm-tone** — AOH is positioning nationally; regional warmth is the wrong vibe.
- **No stock photo** — zero. Real founder photos only.
- **No second accent color** — pine green is the only accent. Adding a second accent breaks the system.
- **No pure black or pure white** — `#1A1F2E` for text, `#F8F6F1` for backgrounds, `#FFFFFF` for elevated surfaces only.

## Load-bearing constraints

1. **Mike has no artistic ability.** Every design choice must be self-executing through tokens + locked components — never "Mike picks the right font/color in the moment."
2. **No regional anchor** anywhere — no Hartford, no NoVA, no Connecticut, no Virginia, no specific city/state ever.
3. **No single-niche pigeonholing** — default to plural neutral ("local businesses", "shop owners"); rotate niches across examples; never lead with vets.
4. **The site itself sells the AI Visibility upsell** — visitors think *"I want my site like this."* That's the visual standard.
5. **AEO/GEO baked in** — every visual choice must respect semantic HTML, schema markup, structured content, sub-1s LCP. Visual richness can't compromise crawler-readability.

## Outstanding design TODOs

- **Logo refresh.** Current logo is placeholder. Workflow: vault `04 AI Outsource Hub/Marketing/Workflows/Brand Mark Refresh.md`. Pine-green-on-warm-white target; constructed mark, not a wordmark.
- **Kip headshot.** `public/Kip.jpg` missing; About + founder block defaults to initials avatar until landed.
- **Service pillar pages.** Currently single-page; pillar pages (Reviews / Relay / AI Visibility / Studio) may be added when content is ready. Same design tokens, no theme drift.
- **Testimonial component.** Currently honest placeholder; will populate at Day 30 / Day 60 post-first-purchase. Collection SOP in vault.

## Cross-refs

- [`README.md`](./README.md) — repo overview, deploy, conventions
- [`PRODUCT.md`](./PRODUCT.md) — what AOH sells, who it serves
- Memory: `project_aoh_website_design_foundation_2026-05-04.md` — research that drove these locks
- Memory: `project_aoh_website_build_2026-05-02.md` — earlier locked decisions (V0 + Vercel, no AI-persona avatars)
- Vault: `04 AI Outsource Hub/IT/Infrastructure/AOH Website Build Plan.md`
- Vault: `04 AI Outsource Hub/HR/Training/playbooks/SEO-AEO-GEO Setup.md`
