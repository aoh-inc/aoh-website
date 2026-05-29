# GMF SmartLead Draft Builder

Date: 2026-05-29
Mode: dry run
Live sends: no

## Inputs

- Ready CSV: `C:\Users\micha\Documents\aoh-website\tmp-gmf-prospecting-smartlead-ready-2026-05-29.csv`
- Sequence packet: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-sequence-2026-05-29.json`
- Campaign name: GMF Visibility Engine Seed - 2026-06-01
- CTA required: `/lp/get-found`

## Validation

Status: PASS

Blockers:
- None

Warnings:
- None

## Campaign Payload Summary

| Item | Value |
|---|---:|
| Leads | 3 |
| Sequence steps | 4 |
| Sender inboxes | 3 |
| Max new leads/day | 3 |
| Min minutes between emails | 23 |

By tier:
- tier_1: 1
- tier_2: 1
- tier_3: 1

By segment:
- behind_nearby_competitor: 1
- missing_hours_photos: 1
- weak_ai_search_readiness: 1

By sender domain:
- getmefoundnow.com: 1
- trygetmefound.com: 1
- getmefoundlocal.com: 1

## SmartLead Settings

- Open tracking disabled: yes
- Click tracking disabled: yes
- Plain text: yes
- Stop on reply: yes
- Suppression import rules: global blocklist, unsubscribe list, duplicate leads, and community bounce list are honored.
- Activation: blocked by this script.

## Actions

- Dry run only; no SmartLead mutation.

## Outputs

- Payload JSON: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-smartlead-draft-payload-2026-05-29.json`
- Validation JSON: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-smartlead-draft-validation-2026-05-29.json`

## Next Gate

Sender may use this packet only to create or inspect a paused SmartLead draft. Before any activation, run:

```bash
npm run smartlead:deliverability-audit -- --campaign-id <id>
```

Then Auditor reviews the PASS/WATCH/HOLD result and Manager asks Mike for the exact final send approval if no agent-owned blockers remain.
