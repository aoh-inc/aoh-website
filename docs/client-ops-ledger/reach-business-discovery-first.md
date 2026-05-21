# Reach Business Discovery First

Status: active discovery workflow
Owner: Manager
Supporting agents: Scout, Sender, Sales Manager, GHL Expert, Auditor
Last updated: 2026-05-21

## Purpose

The Reach campaign now separates business discovery from email sending.

The goal is to spend the least possible on raw lead discovery, let agents score
business fit, crawl websites for public business emails, and only send contacts
into verification/import once they are worth paying for.

This protects the current Outscraper balance of `$53.29`.

## What Changed

New config:

- `docs/client-ops-ledger/reach-discovery-first.json`

New script:

- `scripts/reach-discovery-first.mjs`

New command:

```powershell
npm run reach:discover
```

New GitHub workflow:

- `.github/workflows/reach-discovery-first.yml`

## Safety Rules

The discovery-first script:

- does not import contacts to GHL
- does not add campaign start tags
- does not start drip workflows
- does not enable or change HighLevel AI features
- can use paid Outscraper discovery automatically inside the daily cap
- writes CSVs and outbox reports only

Paid discovery is now allowed for the scheduled auto run inside the configured cap:

```powershell
npm run reach:discover -- --lane all --allow-spend
```

or:

```powershell
$env:REACH_DISCOVERY_ALLOW_SPEND="yes"
```

GitHub Actions now defaults scheduled discovery to spend-enabled because Mike
approved auto. The cap still protects the Outscraper balance.

## Daily Budget

Current config:

- Outscraper balance: `$53.29`
- daily discovery cap: `$5`
- reserve balance: `$10`
- per-search discovery limit: `20` businesses
- run-level discovery cap: `300` businesses

With Outscraper Maps discovery at about `$3 / 1,000` businesses, the default
`$5/day` cap can screen roughly `1,600` raw businesses in theory. The script's
current run cap is lower on purpose so the first few daily runs stay controlled
while we learn which verticals produce usable contacts.

## Workflow

1. Scout runs business discovery without contact enrichment.
2. The script scores each business for lane fit.
3. The script crawls the top scored websites for public business emails.
4. It prefers business-domain emails over personal Gmail/Yahoo-style emails.
5. It writes candidate CSVs.
6. Candidate CSVs go through fresh filtering, verification, QA, and warmup.
7. Only the existing guarded Reach launcher imports or starts drips.

Plan-only preview:

```powershell
npm run reach:discover -- --lane all --plan-only
```

Approved daily discovery:

```powershell
npm run reach:discover -- --lane all --allow-spend --max-spend 5
```

One lane only:

```powershell
npm run reach:discover -- --lane reviews --allow-spend --limit 20
```

## Outputs

Per lane:

- `tmp-reach-discovery-LANE-DATE-businesses.csv`
- `tmp-reach-discovery-LANE-DATE-candidates.csv`
- `docs/client-ops-ledger/outbox/reach-discovery-LANE-DATE.md`

Summary:

- `docs/client-ops-ledger/outbox/reach-discovery-summary-DATE.md`

Candidate CSVs are compatible with the existing Reach scripts:

```powershell
npm run reach:fresh -- --lane reviews --csv tmp-reach-discovery-reviews-DATE-candidates.csv
npm run reach:verify -- --provider neverbounce --csv tmp-reach-discovery-reviews-DATE-candidates-fresh.csv
npm run reach:quality -- --lane reviews --csv tmp-reach-discovery-reviews-DATE-candidates-fresh-verified.csv
```

## Agent Roles

Scout:

- expands industries and towns
- keeps Outscraper calls inside the daily cap
- reviews why scored rows are weak or strong

Sender:

- reviews whether candidate businesses match the lane offer
- keeps copy aligned to the lane and vertical

Sales Manager:

- reviews QA flags before import
- rejects personal emails and duplicate contacts unless there is a clear reason

GHL Expert:

- confirms sender domain, workflow nodes, unsubscribe footer, and bounce handling
- keeps HighLevel AI features OFF unless Mike manually approves them

Auditor:

- watches cost per candidate, bounce rate, unsubscribe rate, and duplicate risk

## Bounce And Verification Policy

Use pre-send verification first. Bounce handling is the safety net, not the
filter.

Recommended:

- verify candidate emails before GHL import/start tags
- suppress hard bounces immediately
- pause a lane if hard bounces reach about `2%`
- pause a lane on spam complaints or weird reply patterns

HighLevel email validation is cheaper than NeverBounce on current public pricing,
but enabling/using paid GHL validation should be treated as a billing-sensitive
setting. Do not toggle it without Mike's explicit approval.

## East Coast Send Windows

All current Reach targets are East Coast or nearby Eastern-time businesses.

Recommended first-touch windows:

- primary: Tuesday, Wednesday, Thursday from `9:15-10:45 AM ET`
- secondary: Tuesday, Wednesday, Thursday from `1:15-2:45 PM ET`
- make-up only: Monday from `10:30-11:30 AM ET`

Avoid:

- Monday early morning
- Friday afternoon
- weekends
- exact top-of-hour sends like `9:00:00 AM`

Use jitter:

- send over a `60-120` minute window
- vary sends by a few minutes
- avoid all three domains firing at the same exact minute

Lane notes:

- Reviews: `9:45-10:45 AM ET` is the best default.
- AI Visibility: `9:15-10:30 AM ET` is the best default.
- Relay: test both `8:15-9:15 AM ET` and `1:30-2:30 PM ET` because urgent-service owners often check before the day gets loud.

The warmup ladder still controls volume. Send timing does not override domain
health, bounce rate, complaint rate, or Mike approval gates.
