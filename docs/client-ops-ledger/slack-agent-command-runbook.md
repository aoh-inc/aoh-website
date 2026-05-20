# Slack Agent Command Runbook

## Purpose

This is the first wiring layer for talking to the AOH agent team from Slack or a manual command prompt.

Slack is the human command surface. Mission Control and the ledger remain the source of truth. The command center reads the ledger, prepares replies, and refuses live GHL action unless the approval and safety gates are clear.

## What Is Wired Now

| Layer | Status | Notes |
|---|---|---|
| Manager status brief | Wired | `npm run agent:brief` reads the current job queue, domain readiness, QA counts, and daily brief. |
| Reach Cold Email Campaign command | Wired | `Manager, run Reach Cold Email Campaign` runs today's safe QA/readiness routine and reports approval needs. |
| Agent directory | Wired | `Manager, list agents` shows the agent team and example commands. |
| Direct agent addressing | Wired | Mike can address agents by role, such as `Coach, ...`, `Scheduler, ...`, `Reporter, ...`, or `Press, ...`. |
| Fast Slack response mode | Wired | Normal commands answer from the ledger/brief quickly; slower GHL/Reach checks acknowledge first and post follow-up results in the background. |
| Slack-ready command router | Wired | `npm run agent:command -- --command "Manager, status"` returns the same kind of message a Slack bot should post. |
| GHL Expert readiness command | Wired | `GHL Expert, check Reach readiness` runs the read-only GHL checker. |
| Sales Manager QA command | Wired | `Sales Manager, review Reach QA` summarizes current QA risk counts. |
| Mike identity and tone | Wired | Agents recognize Mike by Slack user ID, answer first-name by default, and switch to formal when asked. |
| Approval command parsing | Wired with gates | Approval commands generate the exact live command, but live execution stays blocked while agent gates are unresolved. |
| Slack posting | Env-gated | `npm run agent:slack` posts only if `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` is set. |
| Slack HTTP listener | Wired in code | `/api/agent/slack` verifies Slack requests and routes `Manager, ...` commands. Requires Slack app env/config before it answers on its own. |

## Slack Channels

Use these channels as the first operating split:

| Channel | Role |
|---|---|
| `#04-aoh-ops` | Primary Manager command channel for briefs, approvals, blockers, and status. |
| `#04-aoh-ghl-feed` | GHL feed and system-event channel. Keep noisy automation proof here instead of the approval channel. |
| `#04-aoh-prospects` | Prospect and campaign-list work. Keep raw prospect discussion out of the main ops brief. |

## Command Map

Mike should be able to talk in plain text.

```text
Manager, status
Manager, list agents
Manager, run Reach Cold Email Campaign
Manager, brief
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Coach, review this copy
Scheduler, what needs attention
Reporter, verify report delivery status
Press, what is ready to publish
approve reviews import only
approve ai import only
approve relay import only
approve reviews start drip
approve ai start drip
approve relay start drip
pause all campaign live actions
```

## Names And Tone

No special introduction command is needed.

When Mike types from his Slack account, agents should know him as Mike. The listener recognizes Mike by `AOH_OWNER_SLACK_USER_ID`; the current default is `U0ATPQYFA85`.

Default style:

```text
Mike, here is the current operating picture.
```

Formal style:

```text
Coach, review this copy formally
```

Expected response style:

```text
Mr. Egidio, you are speaking with Coach.
```

If Mike wants first-name tone again, he can say `first name`, `casual`, or just omit the tone instruction.

## Response Speed Rules

Slack should feel responsive first, complete second.

Fast commands answer from the current ledger, daily brief, and saved job state:

```text
Manager, status
Manager, list agents
Coach, review this copy
Sales Manager, review Reach QA
Reporter, verify report delivery status
```

Slower commands acknowledge first, then post the real result as a follow-up:

```text
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
```

GHL readiness checks are cached briefly to avoid repeating the same API calls. The default cache is 5 minutes. If Mike wants a true live recheck, add `fresh`, `live`, or `no cache`:

```text
GHL Expert, check Reach readiness fresh
Manager, run Reach Cold Email Campaign live
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
3. Slack sends the message to `/api/agent/slack`.
4. The command center answers with status, blockers, or the exact next command.
5. Live GHL execution only happens after the separate live-action guard is intentionally opened.

## Slack Listener Setup

The code endpoint is:

```text
https://aioutsourcehub.com/api/agent/slack
```

Required environment variables:

| Variable | Purpose |
|---|---|
| `SLACK_SIGNING_SECRET` | Verifies inbound Slack requests. Required. |
| `SLACK_BOT_TOKEN` | Lets the listener post replies back in Slack. Required for normal message events. |
| `SLACK_AGENT_ALLOWED_CHANNEL_IDS` | Comma-separated channel IDs allowed to trigger the listener. Default includes `C0ATTA4NBR8` for `#04-aoh-ops`. |
| `AOH_OWNER_SLACK_USER_ID` | Slack user ID for Mike so agents know who is speaking. Default: `U0ATPQYFA85`. |
| `AOH_OWNER_FIRST_NAME` | First-name address for Mike. Default: `Mike`. |
| `AOH_OWNER_FORMAL_NAME` | Formal address for Mike. Default: `Mr. Egidio`. |
| `GHL_READINESS_CACHE_TTL_MS` | Optional GHL readiness cache duration. Default: `300000` ms, or 5 minutes. |
| `SLACK_LISTENER_TEST_TOKEN` | Optional local-only bypass token for testing the endpoint without a real Slack signature. |
| `GHL_PIT_TOKEN` | Lets GHL Expert run read-only readiness checks. |
| `GHL_LOCATION_ID` | Active AOH / hub360ai location for read-only GHL checks. |

Slack app configuration:

- Set the Events API Request URL to `https://aioutsourcehub.com/api/agent/slack`.
- Subscribe to channel message events for `#04-aoh-ops` if Mike wants to type plain `Manager, ...` messages.
- Add bot scopes needed to read channel messages and post replies, such as `channels:history` and `chat:write`.
- Keep the app limited to AOH internal channels.

Optional slash-command style:

- Create a command such as `/manager`.
- Point the slash command Request URL to the same endpoint.
- Then Mike can type `/manager run Reach Cold Email Campaign`.

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

## Talking To Any Agent

Mike should be able to speak to any agent in the org chart by starting the Slack message with the role name.

Examples:

```text
Manager, what needs Mike today?
General Manager, run Reach Cold Email Campaign
Systems Director, check risks before this campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
Scout, what prospect lane should we test next?
Sender, prepare the next import-only plan
Sorter, how should we classify this reply?
Booker, prepare a handoff for this interested lead
Engagement Scout, what social conversations are worth entering?
Client Success, what client risks need attention?
Hub, what do we know about this account?
Reporter, verify report delivery status
Local Visibility Manager, what visibility gaps matter today?
Reviews Manager, check review automation health
Relay Manager, check Relay readiness
Coach, review this copy
Editor, what angle should this content take?
Press, what is ready to publish?
Scheduler, what meetings or booking issues need attention?
```

The first response from agents is intentionally conservative: they identify their job, what they can help with, and the safest next command. Deeper tool actions should be added role by role as each agent gets a verified workflow.

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
| Approval packet prepared | Manager |
| Pipeline, workflow, tags, fields verified | GHL Expert |
| Exact sender/from domain visually confirmed | GHL Expert |
| Dedicated sending domain warmup status confirmed | GHL Expert |
| HighLevel AI features confirmed OFF | GHL Expert |
| Budget/model tier checked | Systems Director |
| Import or start-drip explicitly approved | Mike |

## Hard Rule

Never enable or toggle any HighLevel AI feature without Mike's explicit manual authorization.
