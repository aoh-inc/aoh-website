# GMF 2026-06-01 Prospecting Agent Launch Plan

Status: engine built; fixture proof passed; live sends still blocked pending Auditor/Mike approval
Owner: Manager / Elon
Reviewer: Auditor
Created: 2026-05-29
Target launch: 2026-06-01 mid-morning ET

## Operating Decision

Mike's 2026-05-29 instruction supersedes the older med-spa/dental/home-services launch packet.

Do not launch the paused med-spa seed as-is. The 6/1 prospecting plan targets local businesses where GetMeFound's $149 foundation offer is easier to believe and where the outreach can be personalized from Google Business Profile facts without expensive per-review scraping.

Saturated or excluded for this launch: home services, dental, legal, realtors.

## Inspection Report: Exists Vs Missing

This inspection was completed before writing new prospecting code.

| Area | Exists today | Missing or not launch-ready |
|---|---|---|
| Smartlead access | `npm run smartlead:check` passed. Campaign `3379589` exists and is paused. Three outreach inboxes are connected. | Existing campaign is CT med-spa, one-email seed, not the requested niche/config/4-email system. |
| Smartlead warmup | `npm run smartlead:warmup-report` and `npm run prospecting:preflight` passed on 2026-05-29. Reputations 100, spam 0, max 20/day. | Code should respect Smartlead/account capacity dynamically instead of hardcoded send volume. |
| Sender domains | Three outreach inboxes exist on non-brand domains: `getmefoundnow.com`, `trygetmefound.com`, `getmefoundlocal.com`. | No new inboxes/domains should be added before first healthy send proof. |
| Lead sourcing | `scripts/reach-discovery-first.mjs` uses Outscraper Google Maps search and cost caps. `OUTSCRAPER_API_KEY` is in local `.env.local`. | Config still uses old Reach lanes and old niches. GitHub Actions has no repo secrets, so scheduled discovery cannot run paid Outscraper in Actions yet. |
| Email verification | `scripts/verify-reach-emails.mjs` supports NeverBounce/Hunter. `NEVERBOUNCE_API_KEY` is in local `.env.local`. 2026-05-29 account-info check passed with paid credits available. | NoBounce is not configured; Mike approved using the existing NeverBounce verifier for the 6/1 MVP. |
| Lead QA/suppression | SOP 016, SOP 021, old Reach QA scripts, duplicate checks, and seed QA CSV patterns exist. | No central GMF cold-outreach suppression store is wired across Smartlead plus Supabase yet. |
| Segmentation | Older lane scoring exists for reviews/AI/relay. | Missing requested single worst-gap buckets: very few reviews, behind nearby competitor, missing hours/photos, weak AI/search readiness. |
| Copy generation | Old one-email med-spa copy exists. Coach/SOP guardrails exist. | Missing 4-email sequence, subject variants, no-testimonial rule, segment-specific personalization, and final claim audit. |
| Sending | Smartlead schedule/upload script exists for the old hardcoded seed. | Needs new configurable campaign builder and schedule guard that reads warmed inbox capacity and keeps campaign paused until final approval. |
| Reply handling | `lib/campaign-reply-router.ts` and `/api/campaign/reply-router` classify replies. | Current router is GHL/tag-centric and lacks Smartlead webhook/event mapping, OOO class, global opt-out, form-fill stop, and purchase stop. |
| Nurture | SOP 030, SOP 031, SOP 041, SOP 113-116 exist for report delivery, follow-up, nurture, and upgrades. | Post-form-fill/post-report nurture and Get Found to Stay Found upsell are not fully wired as automated event-driven flows. |
| Reporting | Monday, Mission Control, warmup reports, and proof docs exist. | Need segment/niche/subdomain metrics: sends, clicks, replies, form fills, purchases, bounces, complaints, auto-pause reason. |
| Compliance/deliverability | SOP 018, SOP 019, SOP 021, SOP 171 exist. FTC CAN-SPAM requirements checked. Physical mailing address found in prior AOH handoff docs: `13727 SW 152nd St. #1236, Miami, FL 33177`. New read-only Smartlead deliverability audit exists: `npm run smartlead:deliverability-audit`. | Current paused CT med-spa campaign is HOLD for launch because the old sequence lacks the physical address and is the wrong target plan. One-click opt-out and global suppression must be proven before live sends. |

## Launch Go/No-Go

6/1 cold outreach can go live only if these are true before the final send window:

1. New target config replaces the old med-spa/dental/home-services plan.
2. Lead source uses base Outscraper Google Maps data only for the full list.
3. Every sent lead has website, valid verified email, review count below default threshold, and no blank personalization fields.
4. NeverBounce fallback is used for the Monday MVP unless Mike later adds NoBounce.
5. The CAN-SPAM footer uses the prior approved mailing address: `13727 SW 152nd St. #1236, Miami, FL 33177`.
6. Auditor approves copy, suppression, opt-out, reply routing, sender capacity, and final launch packet.
7. Mike gives final live-send approval for the exact campaign, niche, cap, inboxes, send window, and follow-up status.
8. `npm run smartlead:deliverability-audit -- --campaign-id <id>` returns PASS before activation. A WATCH requires Auditor approval; a HOLD blocks launch.

If any item is missing, 6/1 can still launch the organic/requested-report path, but cold outreach stays paused.

## Targeting Config Spec

Default launch geography, unless Mike overrides: Connecticut first, using Greater New Haven/shoreline, Greater Hartford/central CT, and Fairfield County as the initial three regions.

```js
export const gmfProspectingConfig = {
  launchDate: "2026-06-01",
  geos: [
    { id: "ct-shoreline-new-haven", label: "CT shoreline / Greater New Haven", country: "US" },
    { id: "ct-greater-hartford", label: "Greater Hartford / central CT", country: "US" },
    { id: "ct-fairfield-county", label: "Fairfield County CT", country: "US" },
  ],
  excludedCategories: ["home services", "dental", "legal", "realtor", "real estate"],
  tiers: [
    {
      tier: 1,
      label: "Pet care",
      categories: ["dog grooming", "dog daycare", "dog boarding", "dog training", "mobile dog groomer", "pet sitting"],
    },
    {
      tier: 2,
      label: "Specialty fitness and wellness studios",
      categories: ["yoga studio", "pilates studio", "barre studio", "martial arts school", "dance studio", "climbing gym", "personal training studio"],
    },
    {
      tier: 3,
      label: "Beauty and personal care",
      categories: ["lash studio", "brow studio", "spray tan", "massage therapy", "esthetician", "esthetics"],
    },
    {
      tier: "test",
      label: "Test bucket",
      categories: ["tutoring center", "music school", "swim school", "auto detailing", "window tinting", "event vendor"],
    },
  ],
  outscraper: {
    endpoint: "google-maps-search",
    fullListMode: "base_maps_only",
    noBulkReviewsScraper: true,
    fields: ["name", "email", "phone", "site", "full_address", "category", "rating", "reviews", "photos_count", "working_hours", "business_status", "location_link", "reviews_link"],
    keepOnly: { hasWebsite: true, hasValidEmail: true, businessStatus: "OPERATIONAL", reviewCountBelow: 25 },
    suppressWhenNull: ["name", "email", "site", "reviews", "category", "city_or_address"],
    runReviewsScraperOnlyFor: "qualified_or_engaged_subset",
  },
  smartlead: {
    useBrandDomain: false,
    inboxes: ["mike@getmefoundnow.com", "mike@trygetmefound.com", "mike@getmefoundlocal.com"],
    respectAccountMaxPerDay: true,
    sendWindow: { timezone: "America/New_York", preferredStart: "10:00", preferredEnd: "12:00" },
    oneLinkOnly: true,
    plainTextLeaning: true,
    stopOnReply: true,
    stopOnFormFill: true,
    stopOnPurchase: true,
    emailVerifier: "neverbounce",
    postalFooterAddress: "13727 SW 152nd St. #1236, Miami, FL 33177",
    deliverabilityProfile: {
      disableOpenTracking: true,
      disableClickTracking: true,
      plainText: true,
      oneCtaLinkMax: true,
      noAttachments: true,
      noImages: true,
      noUrlShorteners: true,
      stopOnAnyReply: true,
      honorGlobalSuppression: true,
      honorUnsubscribeList: true,
      honorDuplicateLeadProtection: true,
      honorCommunityBounceList: true,
      requirePhysicalAddress: true,
      earlyLaunchMaxNewProspectsPerDay: 30,
      autoPauseOn: ["complaint", "unsubscribe_issue", "bounce_spike", "wrong_audience", "unexpected_extra_sends", "sender_reputation_warning"],
    },
  },
};
```

## Agent Assignments

| Agent | 6/1 job | Done proof | Mike needed |
|---|---|---|---|
| Manager / Elon | Owns launch queue, owner decisions, Monday updates, Slack DM owner asks | Monday rows current, final approval packet routed | Yes only for launch approval, NoBounce/key decision, physical address |
| Systems Director | Builds config, credential presence checks, Smartlead/Outscraper/NoBounce adapters, event plumbing | Read-only checks and no-secret proof docs | Yes only if credential is missing or destructive change is needed |
| Sales Manager | Owns ICP, niche priority, send cap, offer angle, final go/no-go recommendation | Launch packet with niche, list count, cap, and CTA | Yes for final business approval |
| Scout | Runs low-cost sourcing, dedupe, fit filter, competitor check, suppression flags | Clean candidate CSV and source summary | No unless spend cap needs increase |
| Sender | Prepares Smartlead campaign, inbox rotation, send window, opt-out footer, no tracking unless approved | Paused campaign draft and internal test proof | Yes for live-send clearance |
| Coach | Drafts 4-email sequence and subject variants, removes unsupported claims | Copy packet with claim notes | No unless copy needs a promise or positioning exception |
| Auditor | Blocks unsafe list/copy/sends, checks CAN-SPAM, proof, suppression, stop rules | Approve/hold/block note | No unless material legal/reputation risk needs Mike |
| Sorter | Classifies replies: interested, not interested, opt-out, OOO, complaint, unclear | Reply routing log and sequence-stop proof | No unless reply requires owner judgment |
| Sales Rep / Casey lane | Handles warm replies, report requests, post-report nurture | Monitored reply path and logged sends | No unless prospect asks for Mike |
| Reporter | Owner dashboard/reporting: by niche, segment, subdomain, outcome | Mission Control and proof summary | No |
| Agent Ness | Independent daily business improvement critique | Morning report with efficiency/opportunity grades | No unless asking Mike for a strategic decision |

## Module Build Plan

| Module | Purpose | Status |
|---|---|---|
| `gmf-prospecting.config` | Niches, geos, Outscraper filters, suppression, Smartlead capacity | Built in `config/gmf-prospecting.config.json` |
| `lead-source-outscraper` | Base Google Maps scrape only, cost capped, no per-review bulk scrape | Built in `scripts/gmf-prospecting-engine.mjs`; spend gated |
| `lead-normalize-qa` | Normalize fields, keep website/email only, exclude closed/no-fit, review count threshold | Built in engine; held CSV emitted |
| `email-verify-nobounce` | Verify every email, drop invalid/risky | Built using `NOBOUNCE_API_KEY` or existing `NEVERBOUNCE_API_KEY` |
| `lead-segment-worst-gap` | Pick one pain per lead | Built: few reviews, competitor gap, hours/photos, weak AI/search readiness |
| `copy-generate-sequence` | 4-email sequence, subject variants, no testimonials | Built: lead-level copy fields plus sequence packet |
| `smartlead-campaign-builder` | Draft paused campaign, rotate inboxes, respect warmup/account caps | Built: `scripts/gmf-smartlead-draft-builder.mjs`; dry-run default, never activates |
| `reply-event-router` | Smartlead webhooks, reply class, OOO, opt-out, bounce, form-fill/purchase stop | Built: GMF lane, reply classes, and guarded `/api/prospecting/events`; Smartlead dashboard webhook mapping still next |
| `nurture-engine` | Post-form/report nurture and Get Found to Stay Found upsell | Nurture packet built; event-driven send wiring still next |
| `metrics-guardrail-reporter` | Segment/niche/subdomain reporting and auto-pause trigger | Built: `scripts/gmf-prospecting-guardrails.mjs`; recommends subdomain pauses from metrics |
| `smartlead-deliverability-audit` | Read current Smartlead campaign settings and block launch if anti-spam guardrails drift | Added 2026-05-29 |

Fixture proof: `npm run gmf:prospecting -- --fixture` passed on 2026-05-29 with 4 synthetic leads, 3 Smartlead-ready rows, 1 ICP-held row, no live sends, and 30/day capacity read from the current Smartlead warmup snapshot.

## Testing Strategy

1. Dry-run config parse with no paid API calls.
2. Plan-only Outscraper query count and spend estimate.
3. Paid Outscraper run capped to a tiny sample only after spend gate.
4. Email verification dry run using fixture rows, then live key smoke with 1 internal/test email if key exists.
5. Segmentation fixture tests covering null fields and "single worst gap" selection.
6. Copy generation fixture tests: no blank merge fields, no testimonial/social-proof claims, one CTA, one link, opt-out footer.
7. Smartlead dry-run campaign payload diff, then `npm run smartlead:deliverability-audit -- --campaign-id <id>`. Live campaign must remain paused until approval and audit PASS.
8. Webhook replay tests for replied, opt-out, OOO, hard bounce, form fill, and purchase.
9. Auditor final launch packet review under SOP 018, SOP 019, SOP 021, SOP 171, SOP 187.

## Owner Requirements

Mike is needed for only these items right now:

Resolved:

1. Mike approved using the existing NeverBounce verifier for the 6/1 MVP.
2. Prior mailing address found and recorded for the footer: `13727 SW 152nd St. #1236, Miami, FL 33177`.

Proof: `docs/client-ops-ledger/neverbounce-and-postal-footer-proof-2026-05-29.md`

Still owner-needed later:

1. Final live send approval: after agents produce the candidate list, copy, suppression proof, and Smartlead paused campaign packet, approve or hold the exact send.

Everything else is agent-owned.

## External Source Checks

- Smartlead official API docs: https://helpcenter.smartlead.ai/en/articles/125-full-api-documentation
- Smartlead campaign setup guide: https://api.smartlead.ai/guides/campaign-setup
- Outscraper Google Maps Search docs: https://docs.outscraper.com/endpoints/google-maps-search/
- NoBounce API surface found at: https://nobounceapi.com/
- FTC CAN-SPAM business guide: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
