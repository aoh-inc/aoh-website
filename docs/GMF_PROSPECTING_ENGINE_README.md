# GMF Prospecting Engine README

Status: active build for 2026-06-01 launch
Owner: Manager / Elon
Reviewer: Auditor

## Purpose

This engine prepares cold-email prospecting and nurture for GetMeFound, positioned as The Visibility Engine.

It does not send live email. It builds the safe packet agents need before SmartLead upload: target config, low-cost sourcing rules, email verification, one-gap segmentation, copy, sender-capacity checks, nurture plan, and proof reports.

The broader Sales Manager acquisition doctrine lives in `docs/GMF_SALES_MANAGER_ACQUISITION_PLAYBOOK.md`. Cold email is the first validation channel, not the whole acquisition system.

## What Exists

- Outscraper base Google Maps discovery exists in `scripts/reach-discovery-first.mjs`.
- NeverBounce verification exists in `scripts/verify-reach-emails.mjs`.
- SmartLead warmup and readiness checks exist in `scripts/smartlead-warmup-report.mjs` and `scripts/prospecting-smartlead-preflight.mjs`.
- SmartLead deliverability audit exists in `scripts/smartlead-deliverability-audit.mjs`.
- Reply routing exists in `lib/campaign-reply-router.ts` and now includes the GMF visibility lane, interested/not interested/opt-out/OOO classes, and sequence-stop flags.
- Homepage free visibility report automation exists separately through `/api/audit-request`.

## New Files

- `config/gmf-prospecting.config.json`: niches, geos, exclusions, Outscraper cost caps, suppression rules, SmartLead capacity rules, nurture timing, reporting paths.
- `scripts/gmf-prospecting-engine.mjs`: config-driven prospecting prep engine.
- `scripts/gmf-smartlead-draft-builder.mjs`: builds and validates a paused SmartLead draft packet from the ready CSV; dry-run by default and never activates campaigns.
- `scripts/gmf-prospecting-guardrails.mjs`: reads metrics and recommends subdomain pauses when bounce, complaint, or opt-out rates cross thresholds.
- `app/api/prospecting/events/route.ts`: guarded SmartLead/prospecting event intake for replies, opt-outs, bounces, complaints, form fills, and purchases.

## Command

Dry-run with synthetic data:

```bash
npm run gmf:prospecting -- --fixture
```

Prepare from a CSV:

```bash
npm run gmf:prospecting -- --input tmp-leads.csv
```

Prepare and verify emails:

```bash
npm run gmf:prospecting -- --input tmp-leads.csv --verify
```

Run a capped paid Outscraper base Maps scrape after approval:

```bash
npm run gmf:prospecting -- --allow-spend --verify
```

Build a SmartLead draft packet from the latest ready CSV:

```bash
npm run gmf:smartlead-draft
```

Review reporting guardrails:

```bash
npm run gmf:guardrails
```

## Flow

1. Scout sources leads from Outscraper base Google Maps data only.
2. Engine normalizes fields and dedupes by email, website, or business/location.
3. Engine blocks excluded niches: home services, dental, legal, realtors, and configured no-fit terms.
4. Engine keeps only businesses with website, email, valid verification, operational status, and review count below the ICP threshold.
5. Engine assigns one worst gap: very few reviews, behind a nearby competitor, missing hours/photos, or weak AI/search readiness.
6. Engine suppresses any row with missing personalization for its selected gap.
7. Coach copy is generated as four plain-text touches with subject variants, one CTA, no testimonials, no ranking guarantees, opt-out language, and the physical address.
8. Sender capacity is read from the SmartLead warmup snapshot. It blocks `getmefound.ai` and uses only warmed outreach domains.
9. Outputs are written for Auditor review.
10. Sender may only upload the ready CSV into a paused SmartLead draft after Auditor approves the packet.
11. Live send still requires Mike approval for the exact campaign, list count, inboxes, cap, send window, and copy packet.
12. SmartLead events post to `/api/prospecting/events` with `GMF_PROSPECTING_EVENTS_TOKEN`; replies and stop events are logged, suppressed where needed, and routed to Sales Rep tasks.
13. Guardrail reports review sends, clicks, replies, form fills, purchases, bounces, complaints, and opt-outs by niche, segment, and subdomain.
14. Sales Manager reviews the weekly acquisition scorecard before scaling: channel, niche, message, deliverability, fulfillment capacity, and upgrade/churn signals.

## Outputs

- `docs/client-ops-ledger/gmf-prospecting-engine-current.md`
- `docs/client-ops-ledger/outbox/gmf-prospecting-engine-YYYY-MM-DD.md`
- `tmp-gmf-prospecting-candidates-YYYY-MM-DD.csv`
- `tmp-gmf-prospecting-smartlead-ready-YYYY-MM-DD.csv`
- `tmp-gmf-prospecting-held-YYYY-MM-DD.csv`
- `docs/client-ops-ledger/outbox/gmf-prospecting-sequence-YYYY-MM-DD.json`
- `docs/client-ops-ledger/outbox/gmf-prospecting-nurture-YYYY-MM-DD.json`
- `docs/client-ops-ledger/outbox/gmf-prospecting-metrics-template-YYYY-MM-DD.csv`
- `docs/client-ops-ledger/gmf-smartlead-draft-current.md`
- `docs/client-ops-ledger/gmf-prospecting-guardrails-current.md`

## Required Credentials

- `OUTSCRAPER_API_KEY`: paid base Google Maps scrape only. Full-list Reviews Scraper is blocked.
- `NOBOUNCE_API_KEY` or `NEVERBOUNCE_API_KEY`: email verification. Existing MVP uses NeverBounce.
- `SMARTLEAD_API_KEY`: read warmup/capacity and later create/update paused campaigns after approval.
- `GMF_PROSPECTING_EVENTS_TOKEN`: protects the SmartLead/prospecting event webhook. `CAMPAIGN_REPLY_ROUTER_TOKEN` can be reused if needed.

## Live-Send Gates

Do not send unless all are true:

- `npm run smartlead:warmup-report` is current.
- `npm run prospecting:preflight` passes.
- `npm run gmf:prospecting -- --input <csv> --verify` produces a non-empty ready CSV.
- Auditor approves the ready CSV, copy, footer, one-link rule, suppression, and stop rules.
- SmartLead campaign stays paused/drafted until the final approval packet is complete.
- `npm run smartlead:deliverability-audit -- --campaign-id <id>` returns PASS or Auditor explicitly clears a WATCH.
- Mike gives final live-send approval.
- Sales Manager confirms the send will not outrun 48-hour Get Found fulfillment capacity.

## Channel Doctrine

- Cold email: primary validation channel through SmartLead and cold domains only.
- Cold calling/SMS: second channel using Outscraper phone fields and one safe profile fact; automated SMS requires compliance proof before live use.
- Instagram/Facebook DMs and local owner groups: ICP-native outreach channel.
- Partner/affiliate: recruit web designers, bookkeepers, VAs, coaches, and content creators at $50 per Get Found sale.
- LinkedIn outbound: intentionally excluded for this ICP.

## Nurture

Engaged non-buyers follow the nurture packet:

- Day 0: report delivery.
- Day 2: authority and specificity.
- Day 5: objections: email safety, access ownership, no contract.
- Day 9: first-mover urgency and Get Found CTA.

Stop nurture on purchase, reply, opt-out, hard bounce, complaint, or no-fit. After Get Found is delivered with before/after proof, trigger the Stay Found upsell.
