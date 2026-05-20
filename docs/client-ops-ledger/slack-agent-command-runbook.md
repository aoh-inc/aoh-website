# Slack Agent Command Runbook

## Purpose

This is the first wiring layer for talking to the AOH agent team from Slack or a manual command prompt.

Slack is the human command surface. Mission Control and the ledger remain the source of truth. The command center reads the ledger, prepares replies, and refuses live GHL action unless the approval and safety gates are clear.

## What Is Wired Now

| Layer | Status | Notes |
|---|---|---|
| Manager status brief | Wired | `npm run agent:brief` reads the current job queue, domain readiness, QA counts, and daily brief. |
| Reach Cold Email Campaign command | Wired | `Manager, run Reach Cold Email Campaign` runs today's safe QA/readiness routine and reports approval needs. |
| Slack-ready command router | Wired | `npm run agent:command -- --command "Manager, status"` returns the same kind of message a Slack bot should post. |
| GHL Expert readiness command | Wired | `GHL Expert, check Reach readiness` runs the read-only GHL checker. |
| Sales Manager QA command | Wired | `Sales Manager, review Reach QA` summarizes current QA risk counts. |
| Approval command parsing | Wired with gates | Approval commands generate the exact live command, but live execution stays blocked while agent gates are unresolved. |
| Slack posting | Env-gated | `npm run agent:slack` posts only if `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` is set. |
| Full Slack bot backend | Pending | The same command router can be called by a Slack bot or OpenClaw once that backend is connected. |

## Slack Channels

Use these channels as the first operating split:

| Channel | Role |
|---|---|
| `#04-aoh-ops` | Primary Manager / Chief of Staff command channel for briefs, approvals, blockers, and status. |
| `#04-aoh-ghl-feed` | GHL feed and system-event channel. Keep noisy automation proof here instead of the approval channel. |
| `#04-aoh-prospects` | Prospect and campaign-list work. Keep raw prospect discussion out of the main ops brief. |

## Command Map

Mike should be able to talk in plain text.

```text
Manager, status
Manager, run Reach Cold Email Campaign
Chief of Staff, brief
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve reviews import only
approve ai import only
approve relay import only
approve reviews start drip
approve ai start drip
approve relay start drip
pause all campaign live actions
```

## Local Commands

Generate the current Manager brief:

```bash
npm run agent:brief
```

Route a command:

```bash
npm run agent:command -- --command "Manager, status"
npm run agent:command -- --command "Manager, run Reach Cold Email Campaign"
npm run agent:command -- --command "GHL Expert, check Reach readiness"
npm run agent:command -- --command "approve relay import only"
```

Post the brief through a configured Slack webhook:

```bash
npm run agent:slack
```

The webhook must be configured outside source control:

```text
SLACK_MISSION_CONTROL_WEBHOOK_URL=...
```

## How This Should Work In Slack

1. Manager posts the daily brief in the Mission Control channel.
2. Mike replies with a command such as `approve relay import only` or `GHL Expert, check Reach readiness`.
3. The Slack bot or OpenClaw backend sends that text into `scripts/agent-command-center.mjs`.
4. The command center answers with status, blockers, or the exact next command.
5. Live GHL execution only happens after the separate live-action guard is intentionally opened.

## Reach Cold Email Campaign Default

Mike does not need to name a batch for the normal daily run.

This command:

```text
Manager, run Reach Cold Email Campaign
```

means:

- use today's active prepared Reach jobs
- check all current lanes
- summarize QA risk
- run the GHL Expert read-only readiness check
- recommend the safest next approval
- do not import contacts
- do not start drip
- do not change GHL settings
- do not enable or toggle HighLevel AI features

Use batch names only when Mike explicitly wants a historical or special run.

## Live Action Guard

The command center does not import contacts or start drips by default.

Live execution requires all of the following:

- Mike approval for the exact lane and action.
- No local blockers in `agent-jobs.csv` or `sending-domain-readiness.csv`.
- `--execute-live` passed to the command center.
- `AGENT_ALLOW_LIVE_GHL_ACTIONS=yes` set for the execution window.

Start-drip remains blocked unless `ready_for_drip=yes`.

Import-only approval does not approve start-drip.

## Required Agent Checks

Before any live campaign action:

| Check | Owner |
|---|---|
| Source CSV exists and is fresh | Sender |
| Email verification complete | Sender |
| QA flags reviewed | Sales Manager |
| Approval packet prepared | Chief of Staff |
| Pipeline, workflow, tags, fields verified | GHL Expert |
| Exact sender/from domain visually confirmed | GHL Expert |
| Dedicated sending domain warmup status confirmed | GHL Expert |
| HighLevel AI features confirmed OFF | GHL Expert |
| Budget/model tier checked | Systems Director |
| Import or start-drip explicitly approved | Mike |

## Hard Rule

Never enable or toggle any HighLevel AI feature without Mike's explicit manual authorization.
