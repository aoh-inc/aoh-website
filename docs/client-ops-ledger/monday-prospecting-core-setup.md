# Monday Prospecting Core Setup

Status: live Monday board connected
Owner: Manager
Recorded: 2026-05-27

## Board

Board name: GMF Prospecting Jobs

Live board name: Agents Jobs

Live board ID: `18415045648`

Purpose: owner-visible work board for prospecting jobs, approvals, blockers, due dates, and proof links.

## Suggested Groups

- Human Needed
- Agent Working
- Waiting On System
- Ready For Review
- Done

## Suggested Columns

| Column | Type | Purpose |
|---|---|---|
| Item | Name | Plain-English job title |
| Status | Status | Human Needed, Agent Working, Blocked, Ready, Done |
| Owner | Person/Text | Human or agent owner |
| Priority | Status | High, Medium, Low |
| Due Date | Date | When next movement is expected |
| Human Needed | Status | Yes or No |
| System | Text | Smartlead, Mission Control, Slack, Langfuse, Vercel, etc. |
| Proof Link | Link/Text | Report, commit, trace, or runbook proof |
| Next Action | Long Text | What happens next |
| Notes | Long Text | Short context |

## Item #1

Item: Refresh Smartlead API access

Live item ID: `12115656169`

Group: Human Needed

Status: Human Needed

Owner: Mike

Priority: High

Due Date: 2026-05-27

Human Needed: Yes

System: Smartlead

Proof Link: `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`

Next Action: Generate/confirm a valid Smartlead API key, store it securely, add it locally and in Vercel production, then re-run `npm run prospecting:preflight`.

Notes: This is the first prospecting job because live Smartlead sends must not run until API access and warmup readiness are proven.

## Current Integration Status

`MONDAY_API_TOKEN` is configured locally in `.env.local` and was used to create the live `Agents Jobs` board and the first human-needed job.

The token is not committed to git. Agents should use an approved local script or internal endpoint to write to Monday rather than carrying the raw token in prompts or notes.

The import-ready row remains saved in `docs/client-ops-ledger/monday-prospecting-core-setup-import.csv` as fallback documentation.
