# Slack Agent Command Runbook

## Purpose

This is the first wiring layer for talking to the AOH agent team from Slack or a manual command prompt.

Slack is the human command surface. Mission Control and the ledger remain the source of truth. The command center reads the ledger, prepares replies, and refuses live GHL action unless the approval and safety gates are clear.

For Mike's plain daily workflow, use `mike-daily-agent-quickstart.md` first. This runbook is the technical setup and command reference.

## What Is Wired Now

| Layer | Status | Notes |
|---|---|---|
| Manager status brief | Wired | `npm run agent:brief` reads the current job queue, domain readiness, QA counts, and daily brief. |
| Reach Cold Email Campaign command | Wired | `Manager, run Reach Cold Email Campaign` runs today's safe QA/readiness routine and reports approval needs. |
| Agent directory | Wired | `Manager, list agents` shows the agent team and example commands. |
| Direct agent addressing | Wired | Mike can address agents by role, such as `Coach, ...`, `Scheduler, ...`, `Reporter, ...`, or `Press, ...`. |
| Fast Slack response mode | Wired | Normal commands answer from the ledger/brief quickly; slower GHL/Reach checks acknowledge first and post follow-up results in the background. |
| Slack-ready command router | Wired | `npm run agent:command -- --command "Manager, status"` returns the same kind of message a Slack bot should post. |
| GHL Expert readiness command | Wired | `GHL Expert, check Reach readiness` runs the read-only GHL checker. Visual sender/warmup/workflow/AI-toggle requests now return a separate visual checklist instead of treating the API check as enough. |
| Sales Manager QA command | Wired | `Sales Manager, review Reach QA` summarizes current QA risk counts. `Sales Manager, resolve Relay QA flags and recommend import only` shows row-level keep/hold recommendations. |
| Mike identity and tone | Wired | Agents recognize Mike by Slack user ID, answer first-name by default, and switch to formal when asked. |
| Approval command parsing | Wired with gates | Approval commands generate the exact live command, but live execution stays blocked while agent gates are unresolved. |
| Production listener secrets | Wired | Production has the Slack signing secret and bot token configured in Vercel. |
| Slack posting | Env-gated | `npm run agent:slack` posts only if `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL` is set. |
| Slack HTTP listener | Wired in code | `/api/agent/slack` verifies Slack requests and routes `Manager, ...` commands. Normal channel commands answer in the channel; threaded commands answer in the thread. |
| `/manager` slash command | Wired in code | Slack should point `/manager` to `https://aioutsourcehub.com/api/agent/slack` for near-instant replies. |
| Slack polling fallback | Wired | `/api/agent/slack?poll=1` lets Vercel Cron scan `#04-aoh-ops` once per minute and catch commands if Slack Events are not delivering. |
| `#04-aoh-ops` bot membership | Done | Manager is in `#04-aoh-ops` and can post replies. |

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
Elon, what is the status of Reach Cold Email Campaign
Manager, run Reach Cold Email Campaign
Manager, brief
GHL Expert, check Reach readiness
GHL Expert, visually confirm Relay sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
Sales Manager, review Reach QA
Sales Manager, resolve Relay QA flags and recommend import only
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
Elon, what is the status of Reach Cold Email Campaign
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

Fast path:

1. Mike types a slash command such as `/manager what is status of Reach Cold Email Campaign`.
2. Slack sends the command to `/api/agent/slack`.
3. The command center answers immediately when the work is quick.
4. For slower checks, Slack gets an acknowledgement first and a follow-up result after the check finishes.

Plain-message path:

1. Mike types a channel message such as `manager what is status of Reach Cold Email Campaign`.
2. Slack Events sends the message to `/api/agent/slack`.
3. The command center answers in the channel.
4. If Slack Events is not delivering, the Vercel Cron fallback catches the message within about one minute.

Live GHL execution only happens after the separate live-action guard is intentionally opened.

## One-Time Slack Step For Mike

The production listener is wired, but Slack will not let the bot answer in `#04-aoh-ops` until the bot is a member of that channel.

In Slack:

```text
/invite @openclaw
```

Type that in the message box inside `#04-aoh-ops`, then press Enter.

After that, use normal agent commands in the same channel:

```text
manager what is status of Reach Cold Email Campaign
Manager, run Reach Cold Email Campaign
Sales Manager, review Reach QA
GHL Expert, check Reach readiness
```

If Slack says `openclaw` cannot be invited, update the Slack app scopes with either `channels:join` or `chat:write.public`, reinstall the app, and try again.

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
| `CRON_SECRET` | Protects the Vercel Cron polling fallback. Vercel sends it as an Authorization bearer token. |
| `SLACK_AGENT_POLL_LOOKBACK_SECONDS` | Optional polling window. Default: `1800` seconds. |
| `GHL_PIT_TOKEN` | Lets GHL Expert run read-only readiness checks. |
| `GHL_LOCATION_ID` | Active AOH / hub360ai location for read-only GHL checks. |

Slack app configuration:

- Add a slash command:
  - Command: `/manager`
  - Request URL: `https://aioutsourcehub.com/api/agent/slack`
  - Short description: `Talk to the AOH Manager and agent team`
  - Usage hint: `what is status of Reach Cold Email Campaign`
- Set the Events API Request URL to `https://aioutsourcehub.com/api/agent/slack`.
- Subscribe to bot message events:
  - `message.channels`
  - `message.groups` if private channels are used
- Add bot scopes needed to read channel messages and post replies, such as `channels:history` and `chat:write`.
- Confirm Manager is present in `#04-aoh-ops`, or invite it if a new channel is added.
- Keep the app limited to AOH internal channels.

The matching app manifest lives at:

```text
docs/client-ops-ledger/slack-app-manifest.yml
```

If `/manager` says the app did not respond and Vercel logs show no POST to `/api/agent/slack`, Slack is not pointing the command to the HTTP endpoint. Use the app manifest above or turn Socket Mode off, then set the slash-command Request URL.

Fallback polling:

- Vercel Cron calls `/api/agent/slack?poll=1` every minute.
- The route checks `CRON_SECRET`, reads recent `#04-aoh-ops` messages, and posts Manager responses for commands that do not already have a later bot reply.
- The fallback ignores slash commands because `/manager` already gets an immediate Slack response.
- This is a backup for Slack Event Subscription gaps. Slack Events should still be configured for instant responses.

Slash-command style:

```text
/manager what is status of Reach Cold Email Campaign
/manager start cold reach campaign
/manager start campaign
/manager run Reach Cold Email Campaign
/manager deploy campaign
/manager deploy Reach Cold Email Campaign
/manager explain the Reach result in plain English
/manager are we ready to send?
/manager I want to send warmup emails today. What has to happen first?
/manager list agents
/manager Sales Manager, review Reach QA
/manager GHL Expert, check Reach readiness
```

## Reach Cold Email Campaign Default

Mike does not need to name a batch for the normal daily run.

This is Mike's everyday command:

```text
/manager start cold reach campaign
```

It means Manager should use the Reach Warmup Autopilot, refill/replace bad
emails, expand searches when needed, import only QA OK contacts, and start drip
only after the lane is marked `ready_for_drip=yes`.

In Slack, this command queues the GitHub Actions worker
`Reach Warmup Autopilot`. The worker runs the repo scripts and posts the final
result back to the Slack command response.

This older command:

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

This generic shortcut asks Mike which campaign to prepare:

```text
/manager start campaign
```

This specific shortcut means the same warmup autopilot intent:

```text
/manager start cold reach campaign
```

Manager owns the handoff and row cleanup. Mike should not need to approve or
reject individual warmup rows. Start-drip still stays blocked until
`ready_for_drip=yes`, and HighLevel AI features stay OFF.

## Reach Warmup Autopilot

Mike wants daily warmup to run under guardrails instead of asking him to decide
each small row-level issue.

Autopilot source of truth:

```text
docs/client-ops-ledger/reach-warmup-autopilot.json
```

Autopilot runner:

```bash
npm run reach:warmup -- --lane all --execute auto
```

What it does:

- follows the 10-20 / 40-50 / 80-100 warmup ladder
- finds enough QA OK contacts for the day
- reuses already-paid scrape inventory before making any new Outscraper call
- replaces bad/risky emails automatically
- expands to the next search when the first niche/area is too small
- stops at max attempts and scrape caps so it cannot loop forever
- caps the full all-lane run at 60 scraped records total unless the config is deliberately changed
- skips new paid Outscraper calls when budget protection is ON unless Mike explicitly approves spend
- writes reports to `docs/client-ops-ledger/outbox`

Budget protection is currently ON because Outscraper balance is low. Repeating
`/manager start cold reach campaign` will not keep buying more Outscraper data
by accident. To deliberately spend credits for a run, the command must include
clear approval such as:

```text
/manager start cold reach campaign; approve Outscraper spend
```

Without that approval, the worker writes a held report before any paid scrape.

Already-paid scrape inventory can be rebuilt without Outscraper spend:

```bash
npm run reach:inventory
```

The inventory files are:

```text
docs/client-ops-ledger/reach-scrape-inventory-reviews-ok.csv
docs/client-ops-ledger/reach-scrape-inventory-ai-ok.csv
docs/client-ops-ledger/reach-scrape-inventory-relay-ok.csv
```

Import-only:

```bash
npm run reach:warmup -- --lane relay --execute import
```

Start drip:

```bash
npm run reach:warmup -- --lane relay --execute start
```

Auto mode:

```bash
npm run reach:warmup -- --lane all --execute auto
```

Auto mode chooses `start` only for lanes marked `ready_for_drip=yes`; otherwise
it chooses `import` for lanes marked `ready_for_import=yes`.

Start-drip is still blocked unless `ready_for_drip=yes`. This keeps the decision
out of Mike's hands day to day while still requiring the agent/GHL readiness
ledger to be safe before the sender tag is added.

Manager should also answer interpretation questions after a campaign result:

```text
/manager what does this mean?
/manager explain the Reach result in plain English
/manager what should I do next?
/manager are we ready to send?
```

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

When a QA CSV exists, import-only approval uses the QA CSV with `--only-ok` so flagged rows are excluded from the import path. For example, Relay import-only resolves to:

```bash
npm run reach:launch -- --lane relay --csv tmp-reach-relay-2026-05-20-next-qa.csv --limit 2 --commit --only-ok
```

If Mike has personally checked the GHL screens, he can include that in the approval command to clear the visual blocker:

```text
approve relay import only; I visually confirmed Relay sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
```

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
