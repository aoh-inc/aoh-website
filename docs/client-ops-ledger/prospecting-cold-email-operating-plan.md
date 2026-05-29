# Prospecting Cold Email Operating Plan

Status: active planning - 2026-06-01 launch revision active
Owner: Manager
Started: 2026-05-27

## Owner Rule

Manager should not contact Mike for routine progress. Manager contacts Mike only when human involvement is required:

- approval before live prospect or client action
- spend or cap increase
- broken account/API access
- legal, billing, deliverability, reputation, or customer-facing risk
- a blocker agents cannot clear themselves

Routine status belongs in Mission Control, Monday, proof reports, or on-demand Slack commands.

## Core Setup First

Before agents build lists, write copy, upload leads, or send anything, the core operating setup must exist:

- Monday owner board is ready for prospecting jobs, approvals, blockers, and proof links
- Manager contact rule is active: human-needed only
- Smartlead API access is valid
- Smartlead warmup/readiness report is current
- Mission Control has the three owner reports planned
- Langfuse policy is known for agent/tool/client-data traces
- first seed campaign is blocked until preflight passes

The first Monday-visible human job is:

```text
Refresh Smartlead API access so agents can run read-only warmup/readiness checks.
```

Current live Monday status: created on board `Agents Jobs`, board ID `18415045648`, item ID `12115656169`.

## 2026-06-01 Launch Revision

Mike's 2026-05-29 instruction supersedes the older med-spa/dental/home-services launch packet.

Current launch source of truth:

- `docs/client-ops-ledger/gmf-2026-06-01-prospecting-agent-launch-plan.md`
- `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`
- `docs/client-ops-ledger/smartlead-warmup-current.csv`
- `docs/client-ops-ledger/smartlead-deliverability-audit-current.md`

Do not launch the paused CT med-spa campaign as-is. The 6/1 target lanes are:

- Tier 1: pet care
- Tier 2: specialty fitness and wellness studios
- Tier 3: beauty and personal care
- Test bucket: tutoring/music/swim schools, specialty auto, event vendors

Excluded for this launch: home services, dental, legal, realtors.

## First Campaign Goal

Launch a tiny, controlled cold email seed test after Smartlead readiness is proven.

The first campaign should prove:

- inboxes are healthy enough to send
- list quality is acceptable
- copy is safe and on-brand
- replies can be routed to the right agent
- Mike is interrupted only for true approval or access needs

## Agent Roles

| Agent | Owns | Escalates To Mike When |
|---|---|---|
| Manager | Job queue, approval gates, status routing | A human approval, access fix, spend increase, or blocker is needed |
| Sales Manager | Target niche, offer, go/no-go call | Audience or offer needs business judgment |
| Scout | Prospect collection and fit notes | Source quality is unclear or spend is needed |
| Sender | Email verification, Smartlead readiness, upload prep | API access, deliverability, bounce, or unsubscribe risk appears |
| Coach | Cold email copy and claims | Copy needs a risky promise or positioning decision |
| Systems Director | Tool access, credentials, reporting, traceability | Account access or security change is needed |
| Reporter | Mission Control, Monday, and proof summaries | Result differs materially from approval packet |
| Sorter | Reply classification after send | Angry/confused reply or human sales judgment is needed |
| Booker | Booking-ready replies | A real sales conversation is ready |

## Job Flow

```text
preflight -> target selected -> list built -> verified -> copy approved -> seed approved -> sent -> replies sorted -> report
```

## First Gate

Before any new campaign setup, Manager must run:

```bash
npm run prospecting:preflight
```

This check is read-only. It does not add leads, create a campaign, upload a list, or send email.

The first gate passes only when:

- Smartlead API access works
- current warmup data is available
- all active sending inboxes have SMTP/IMAP OK
- warmup is active
- reputation is at least 95
- each inbox has at least 10 warmup sent
- spam count is 0

## GMF Prospecting Engine

The current build command for the 2026-06-01 GetMeFound launch packet is:

```bash
npm run gmf:prospecting -- --fixture
```

Real list prep uses:

```bash
npm run gmf:prospecting -- --input <csv> --verify
```

Paid Outscraper sourcing remains spend-gated:

```bash
npm run gmf:prospecting -- --allow-spend --verify
```

This engine does not send email, upload leads, create campaigns, or mutate Smartlead. It prepares the ready CSV, held CSV, sequence packet, nurture packet, metrics template, and current proof report for Auditor review.

Build the paused Smartlead draft packet:

```bash
npm run gmf:smartlead-draft
```

This is dry-run by default. It validates the ready CSV, sequence copy, footer, opt-out, one-link rule, sender domains, daily cap, schedule, and Smartlead payloads. It never activates a campaign.

Review metrics guardrails:

```bash
npm run gmf:guardrails
```

This reads the metrics CSV, calculates bounce/spam/opt-out/reply-quality rates by subdomain, niche, and segment, and creates a pause recommendation when thresholds are breached.

Reply and stop events route through:

```text
/api/prospecting/events
```

The route is token-protected, logs Smartlead/prospecting events, suppresses opt-outs, not-interested replies, bounces, and complaints, stops nurture/cold-sequence state for form fills and purchases, and creates Sales Rep tasks for interested, OOO, and unclear replies.

## Deliverability Gate

Before any Smartlead campaign can be activated or restarted, Sender must run:

```bash
npm run smartlead:deliverability-audit -- --campaign-id <id>
```

The launch profile is:

- outreach domains only, never `getmefound.ai` for cold prospecting
- no open tracking and no click tracking unless Manager/Auditor approve a tracked test
- plain-text email, one CTA link max, no attachments, no images, no URL shorteners
- stop on any reply, form fill, purchase, unsubscribe, complaint, hard bounce, or manual suppression
- include opt-out language and `13727 SW 152nd St. #1236, Miami, FL 33177` in every commercial cold email
- honor global suppression, unsubscribe, duplicate-lead, and community-bounce protections on import
- keep early launch volume conservative and tied to Smartlead warmup/account capacity

Audit status rules:

- PASS: can move to Auditor launch review.
- WATCH: Auditor must approve the exception before any send.
- HOLD: do not activate or send.

## Current First Blockers

As of 2026-05-29, Smartlead access is no longer the blocker. Read-only checks pass and the campaign is paused:

- `npm run smartlead:check`: pass
- `npm run smartlead:warmup-report`: pass
- `npm run prospecting:preflight`: pass
- Active outreach inboxes: three
- Warmup reputation: 100
- Spam count: 0

The remaining blockers are:

1. The old launch packet/campaign is the wrong target plan for Mike's latest instruction.
2. The old paused Smartlead sequence is HOLD for launch because it lacks the physical mailing address.
3. Final list, copy, suppression, reply routing, deliverability audit, and live-send packet still need Auditor approval.

Resolved on 2026-05-29:

- Mike approved using the existing NeverBounce verifier for the 6/1 MVP.
- NeverBounce account-info check passed with paid credits available.
- Prior physical mailing address found in docs: `13727 SW 152nd St. #1236, Miami, FL 33177`.

Manager may contact Mike only for final live-send clearance or material risk. All other build steps are agent-owned.

No live prospect send should run until the 2026-06-01 launch packet is rebuilt under the new target plan and approved.

## Reporting

Owner monitoring split:

- Slack: human-needed alerts and on-demand questions
- Monday: job status, approvals, blockers, due dates, proof links
- Mission Control: three owner reports
- Langfuse: traces for AI/tool/client-data work
- GitHub/ledger/outbox: proof files and audit trail

Mission Control should summarize:

- Prospecting Pipeline: found, verified, uploaded, sent, replied, booked
- Agent Work: jobs completed, blockers, owners, approvals needed
- Growth/ROI: spend, reply rate, booked calls, clients won
