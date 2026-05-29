# GMF Sales Manager Acquisition Playbook

Status: Active operating doctrine
Owner: Sales Manager
Reviewer: Manager / Auditor
Last updated: 2026-05-29

## Mission

Own and run client acquisition for GetMeFound without burning sender domains, making unsupported claims, or creating fulfillment backlog. The job is to validate the sharpest message at small scale, then scale only what converts and can be delivered inside the 48-hour Get Found promise.

## Positioning

- Method brand: The Visibility Engine.
- Method arc: Map -> Align -> Amplify.
- Supporting phrase: Signal Stack.
- Angle: opportunity plus first-mover urgency. Google AI now picks one or two local businesses instead of ten results; the window closes once a competitor becomes the cleanest answer.
- Complexity: getting picked is dozens of interdependent public signals GMF engineers. Never make the work sound like a trivial one-click fix.
- Proof before customers: use founder credibility, Google's own guidance, specific public observations, and the satisfaction guarantee. Do not use testimonials until real approved proof exists.
- Named systems: Google AI, ChatGPT, Claude, Gemini.
- Never guarantee rankings, AI placement, reviews, revenue, or search inclusion.

## Offer Ladder

| Offer | Role | Sales Use |
|---|---|---|
| Get Found | $149 one-time, delivered in 48 hours | Foot-in-the-door conversion offer |
| Stay Found | $99/mo + $49 setup | Primary recurring upgrade after proof is delivered |
| Always Ready | $299/mo | Advanced readiness, content, and AI-answer/phone path |

The $149 sale matters because it creates trust and before/after proof. The recurring base matters more than squeezing the first sale.

## Target Niches

Priority order:

1. Pet care: dog grooming, dog daycare/boarding, dog training, mobile groomers, pet sitting.
2. Specialty fitness/wellness studios: yoga, pilates, barre, martial arts, dance, climbing, personal-training studios.
3. Beauty/personal care: lash/brow, spray tan, massage therapy, esthetics.
4. Test bucket: tutoring/music/swim schools, specialty auto detailing/tint, event vendors.

Avoid saturated home services, dental, legal, and real estate/realtor campaigns.

## Channel Strategy

| Channel | Role | Owner Agents | Current Rule |
|---|---|---|---|
| Cold email | Primary acquisition channel | Scout, Sender, Coach, Auditor, Sorter, Sales Rep | SmartLead only, cold domains only, warmed-cap paced, CTA to `/lp/get-found` |
| Cold calling / SMS | Highest-leverage second channel | Scout, Sales Rep, Sorter, Auditor | Use Outscraper phones and one safe GBP stat; automated SMS waits for compliant opt-in/STOP proof |
| Instagram/Facebook DMs + owner groups | Native ICP channel | Scout, Sales Rep, Coach, Auditor | Keep it conversational and local; LinkedIn outbound is intentionally excluded |
| Partner/affiliate | Relationship channel | Partnerships, Sales Manager, Coach, Auditor | Recruit web designers, bookkeepers, VAs, coaches, content creators; $50 per Get Found sale |

## Cold Email Operating Rules

- Use Outscraper base Google Maps data for the full list.
- Do not run the per-review Reviews Scraper across the full list.
- Keep only leads with website, verified email, open/operational status, and review count below the configured threshold.
- Every sent lead must have one safe personalization gap. If a field is null, stale, blank, or low-confidence, suppress the lead.
- One CTA link only: `/lp/get-found`.
- Plain-text leaning. No images, attachments, URL shorteners, testimonials, or ranking promises.
- Every email needs honest subject, physical address, opt-out, and global suppression.
- SmartLead warmup state controls volume; do not hardcode send volume beyond account capacity.
- Never send cold email from `getmefound.ai`.

Cold-domain pool:

| Domain | Role |
|---|---|
| `getmefoundlocal.com` | Active/warming cold outreach |
| `getmefoundnow.com` | Active/warming cold outreach |
| `trygetmefound.com` | Active/warming cold outreach |
| `getmefoundhq.com` | Scale capacity as warmup allows |
| `hellogetmefound.com` | Scale capacity as warmup allows |
| `joingetmefound.com` | Scale capacity as warmup allows |
| `getmefoundpro.com` | Scale capacity as warmup allows |

## Validation Plan

Start narrow:

1. First niche: pet care.
2. First geography: CT shoreline / Greater New Haven.
3. First proof target: a few hundred verified leads, not broad volume.
4. Test one primary message: specific profile gap plus AI-first urgency.
5. Scale only after reply/form-fill quality is visible and deliverability is clean.

The first two months are message and market validation. The ceiling is not the issue; the ramp and domain reputation are.

## Fulfillment Capacity Gate

Sales Manager must check delivery capacity before scaling sends.

Do not increase sends if:

- open Get Found jobs would exceed 48-hour delivery capacity
- support/onboarding is behind
- refund/chargeback risk is rising
- client proof reports are late
- Auditor marks fulfillment quality as WATCH or HOLD

If capacity is tight, scale down acquisition, protect trust, and upsell only after proof is delivered.

## Weekly Sales Manager Report

Every week, Reporter publishes a Sales Manager acquisition scorecard covering:

- pipeline by channel and niche
- leads sourced, verified, held, uploaded, sent
- opens only if approved; primary metrics are replies, form fills, purchases
- reply quality by niche/message
- Get Found sales
- Stay Found upgrades
- churn/retention warnings
- deliverability by subdomain
- fulfillment capacity
- recommendation: scale, keep testing, cut, or pause

## Agent Assignments

| Agent | Owns | Done Proof |
|---|---|---|
| Sales Manager | ICP, channel strategy, message validation, go/no-go recommendation | weekly acquisition scorecard and scale/cut decision |
| Scout | lists, niche research, phone/social discovery, partner targets | candidate CSV or partner list with source proof |
| Sender | SmartLead readiness, paused campaign packets, domain pacing | warmup proof, draft packet, no-live-send proof |
| Coach | copy, objections, scripts, partner pitch | approved message packet with claim notes |
| Auditor | claim safety, compliance, suppression, capacity gate | PASS/WATCH/HOLD review |
| Sorter | reply classification and stop rules | reply route log and suppression proof |
| Sales Rep | interested replies, report requests, call/checkout movement | logged prospect status and next action |
| Partnerships | affiliate recruiting and partner follow-up | partner pipeline and approved outreach |
| Reporter | owner-facing scorecard | Mission Control/report artifact |

## Mike Escalation Rule

Do not ask Mike for routine progress, row-level lead judgment, or agent-owned research. Escalate only for final live-send approval, spend/cap increase, legal/reputation/customer-facing risk, credential/access failure, pricing/offer exception, or fulfillment risk that agents cannot clear.

## Source Files

- `config/gmf-prospecting.config.json`
- `docs/GMF_PROSPECTING_ENGINE_README.md`
- `docs/client-ops-ledger/prospecting-cold-email-operating-plan.md`
- `docs/client-ops-ledger/gmf-2026-06-01-prospecting-agent-launch-plan.md`
- `docs/sops/SOP-002-free-visibility-check-intake-report-delivery.md`
