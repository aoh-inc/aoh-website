# Prospecting Cold Email Operating Plan

Status: active planning
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

## Current First Blocker

As of 2026-05-27, local Smartlead API access is blocked by an invalid API key, and production Vercel does not have `SMARTLEAD_API_KEY` configured.

Manager may contact Mike about this because it is a human account/API access blocker.

No live prospect send should run until the key is refreshed and readiness is current.

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
