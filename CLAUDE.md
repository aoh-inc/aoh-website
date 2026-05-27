@AGENTS.md

## Design & Messaging Rules (from Mike)

- **Always research before making design decisions.** Never guess on colors, layouts, spacing, or animations. Search for expert best practices first — every time. If unsure, research it. Don't ask Mike for design opinions; he expects you to bring expert-backed recommendations.
- **Target market:** Dentists, attorneys, therapists, accountants — professionals, not trades. Use deep grounded tones (blues, dark greens, slate) that communicate trust. Never use bright/playful colors.
- **Color palette:** The site uses dark navy/green (#1a2332, #162420) and cream/light backgrounds. Accent is muted green. Stick to this palette.
- **Section heights:** Keep sections compact. Use py-8 to py-12 on mobile, md:py-12 to md:py-16 on desktop. Never use py-20+ unless it's the hero.
- **Alternating backgrounds:** Sections should alternate dark/light for visual rhythm.
- **Responsive:** Always design mobile-first. All grids collapse on mobile. Test all breakpoints.
- **Don't ask for opinions on design/marketing.** Research what experts recommend and implement it. Mike is not a designer or marketer — that's your job.
- **PowerShell terminal:** Mike uses Windows PowerShell. Use `;` not `&&` to chain commands. Or give commands on separate lines.
- **Deploy flow:** Always include `vercel --prod` in deploy instructions. Git push alone doesn't reliably trigger Vercel builds.

## Messaging Strategy (May 2026)

The entire site messaging was rebuilt around Google I/O 2026 (announced May 19, 2026). The core angle:

- **Core message:** "Google doesn't rank local businesses anymore. It picks one. If your profile isn't ready, AI skips you."
- **The urgency is real:** AI Mode has 1B+ monthly users, queries doubling every quarter. The search box itself was replaced with AI. This happened 8 days before the messaging rewrite.
- **The opportunity angle:** The old system (10 blue links, pages) was locked by SEO spend. The new system (AI recommends 1-2 businesses) rewards completeness, not budget. Businesses that act first get picked before competitors adapt.
- **Target buyer:** Business owners (dentists, therapists, attorneys, accountants) who've passively gotten clients from Google for years and now face the ground shifting. NOT marketing-savvy people. NOT oversaturated trades (HVAC, plumbing).
- **No clients yet:** The site must do ALL the selling. No testimonials, no referral trust. Every word earns credibility from scratch.
- **GetMeFound = "get found":** The word "found" should appear in key messaging. The brand name IS the value prop.

## Homepage Structure (7 sections)

The homepage was restructured from 14 sections to 7:
1. **Hero** (dark) — "Google doesn't rank you anymore. It picks you — or it doesn't." + red alert banner "May 2026 — Google replaced Search with AI"
2. **Sample Report** (light) — Before/after product demo. Currently shows lawn care — NEEDS TO BE CHANGED TO DENTIST.
3. **How It Works** (light) — 3 horizontal cards with dark backgrounds, colored accents. Steps: "We check what AI sees" → "We fix what's invisible" → "You see the difference" (with 12%→89% animated counter)
4. **Visibility Check** (dark) — Carousel showing what Google & AI check. Strong section, keep as-is.
5. **Pricing** (dark) — Get Found $149, Stay Found $99/mo, Always Ready $299/mo. Bullets rewritten to outcomes not features.
6. **FAQ** (light) — Objection handling. Needs copy update to match new messaging.
7. **Final CTA** (light) — "Your competitor is being recommended. Fix that today."

Sections that were REMOVED from homepage: stats row, trust cards, game changed, cost comparison (moved to pricing page), revenue calculator (has own /calculator page), social proof stats, extra footer CTA.

## Remaining Work

These tasks still need to be done:
1. **Change sample report from lawn care to dentist** — The ReportTransformation component shows "Green Valley Lawn Care" but target market is dentists. Change to a dental practice.
2. **Update visibility check section copy** — Thread the new "Google picks, not ranks" messaging through.
3. **Update FAQ copy** — Match the new outcome-focused messaging. Remove "You give us access, we handle everything" language.
4. **Update final CTA copy** — Currently "Your competitor is being recommended" is the old hero line. Should use new messaging.
5. **Review and update pricing page** — Pricing page hero was updated but the rest of the page sections may need copy updates.
6. **Cost comparison table on pricing page** — Was moved there from homepage. Consider whether it serves dentist buyers or should be reworked (compares to Birdeye/Yext which dentists don't know).
