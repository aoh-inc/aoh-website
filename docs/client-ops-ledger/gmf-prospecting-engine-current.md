# GMF Prospecting Engine

Date: 2026-05-29
Owner: Manager / Elon
Mode: fixture dry run
Live sends: no

## Exists Vs Missing

Exists in repo: Outscraper base-map discovery, NeverBounce verification, Smartlead warmup/readiness checks, a hardcoded seed campaign script, deliverability audit, reply-router API, free visibility report automation, and SOP guardrails.

Built by this run: GMF-specific config, target niches/geos, single worst-gap segmentation, no-blank personalization suppression, 4-step copy packet, Smartlead-ready CSV, nurture packet, sender-capacity read from warmup data, and reporting templates.

Related event route: `/api/prospecting/events` handles SmartLead/prospecting replies, opt-outs, bounces, complaints, form fills, and purchases behind a token.

Still not live-send complete: Smartlead draft setup should remain paused until `npm run gmf:smartlead-draft`, suppression proof, and deliverability audit are reviewed by Auditor and Mike approves the exact send.

## Source And Cost Guard

- Config: `config/gmf-prospecting.config.json`
- CTA path: `/lp/get-found`
- Full CTA URL: https://getmefound.ai/lp/get-found
- Outscraper mode: base Google Maps scrape only
- Bulk reviews scraper: blocked for full-list use
- Estimated plan queries: 75
- Estimated max records this run: 120
- Estimated max Outscraper spend: $0.36
- Spend enabled this run: no
- Email verification requested this run: no

## Results

| Item | Count |
|---|---:|
| Source rows read | 4 |
| Leads evaluated | 4 |
| Ready for Smartlead upload | 3 |
| Needs verification | 0 |
| Held/suppressed | 1 |

## Smartlead Capacity

| Item | Count |
|---|---:|
| Ready senders | 3 |
| Held senders | 0 |
| Raw daily mailbox capacity | 30 |
| Early launch cap | 30 |
| Allowed new prospects/day | 30 |

Ready senders:
- mike@getmefoundnow.com: 10/day
- mike@trygetmefound.com: 10/day
- mike@getmefoundlocal.com: 10/day

Held senders:
- None

## Ready Breakdown

By niche tier:
- Pet care: 1
- Specialty fitness and wellness studios: 1
- Beauty and personal care: 1

By segment:
- behind_nearby_competitor: 1
- missing_hours_photos: 1
- weak_ai_search_readiness: 1

By assigned sender domain:
- getmefoundnow.com: 1
- trygetmefound.com: 1
- getmefoundlocal.com: 1

## Top Held Reasons

- review_count_above_icp_threshold: 1

## Outputs

- Candidate CSV: `C:\Users\micha\Documents\aoh-website\tmp-gmf-prospecting-candidates-2026-05-29.csv`
- Smartlead-ready CSV: `C:\Users\micha\Documents\aoh-website\tmp-gmf-prospecting-smartlead-ready-2026-05-29.csv`
- Held CSV: `C:\Users\micha\Documents\aoh-website\tmp-gmf-prospecting-held-2026-05-29.csv`
- Sequence packet: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-sequence-2026-05-29.json`
- Nurture packet: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-nurture-2026-05-29.json`
- Metrics template: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-metrics-template-2026-05-29.csv`

## Guardrails Confirmed

- No live prospect send ran.
- No Smartlead campaign was created, changed, activated, or uploaded.
- No HighLevel AI feature was enabled.
- No per-review Outscraper scraper ran across the full list.
- Records missing safe personalization are held before send.
- Cold emails use outreach domains only; `getmefound.ai` is blocked for cold prospecting senders.
- Every generated body has one CTA link, clear opt-out language, and the physical mailing address.

## Credentials/APIs Needed

- Outscraper: `OUTSCRAPER_API_KEY` for paid base Google Maps scrape only.
- NoBounce/NeverBounce: `NOBOUNCE_API_KEY` or existing `NEVERBOUNCE_API_KEY` for email verification.
- SmartLead: `SMARTLEAD_API_KEY` for read-only warmup/capacity checks and, after approval, campaign draft/upload.

## Next Agent Actions

1. Scout runs this engine with `--allow-spend --verify` only after the spend gate is approved or already documented.
2. Sender runs `npm run gmf:smartlead-draft -- --csv tmp-gmf-prospecting-smartlead-ready-2026-05-29.csv` to build the paused Smartlead draft packet.
3. Reporter runs `npm run gmf:guardrails` after metrics exist.
4. Auditor reviews sequence, footer, one-link rule, suppression, sender capacity, and deliverability audit.
5. Manager asks Mike by Slack DM for final live-send approval only after the approval packet is complete.
