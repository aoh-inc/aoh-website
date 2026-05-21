# Mike Daily Agent Quickstart

This is the plain-English daily workflow for working with the AOH agent team.

Use this when you want to start the day, check campaign status, ask agents for work, or approve the next safe action.

## Where To Work

Use Slack channel:

```text
#04-aoh-ops
```

Fast command style:

```text
/manager status
```

Plain messages like `manager status` are also supported, but they may be slower if Slack Events are not delivering. The `/manager` slash command is the preferred daily path.

No intro is needed. Ask Manager the business question directly.

## Start The Day

Type:

```text
/manager status
```

Then ask the owner-level campaign question:

```text
/manager is Reach set to run today, and do I need anything?
```

Or type:

```text
/manager what is status of Reach Cold Email Campaign
```

Normal schedule:

- Discovery/refill runs around 7:30 AM Eastern on weekdays.
- The guarded send check runs around 9:00 AM Eastern daily.
- Relay keeps finding more businesses, checks emails before GHL, drops risky contacts, and waits until the list is clean enough to send.

If you want to see who you can talk to:

```text
/manager list agents
```

## Run The Reach Check

This checks the campaign prep and returns blockers or next approvals. It does not import contacts or start a drip.

```text
/manager run Reach Cold Email Campaign
/manager deploy Reach Cold Email Campaign
```

If you are not sure which campaign should run, use:

```text
/manager deploy campaign
```

Manager will ask which campaign to prepare before doing anything else.

`Deploy Reach Cold Email Campaign` means Manager runs the team gates first. It does not live-send by itself.

## Ask Manager To Interpret

When the result is too technical, ask Manager directly:

```text
/manager owner peek
/manager what does this mean?
/manager explain the Reach result in plain English
/manager what should I do next?
/manager are we ready to send?
/manager I want to send warmup emails today. What has to happen first?
```

Manager should answer with a plain-English readout, the current blocker, and the next safe commands.

Use `owner peek` when you want to know where activity is showing and whether you need to look at anything.

If Manager says agent review is still needed, ask:

```text
/manager Sales Manager, review Reach QA
/manager Sales Manager, resolve Relay QA flags and recommend import only
/manager GHL Expert, check Reach readiness
/manager GHL Expert, visually confirm Relay sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
```

The `resolve Relay QA flags` version should name the actual rows to keep or hold. For Relay on May 20, 2026, Sales Manager should recommend keeping only the OK rows for import-only and holding the personal-email/duplicate-business rows.

The normal GHL readiness check is API-only. It proves pipelines and workflows exist, but it does not prove the sender/from screens, warmup screen, workflow sender nodes, or AI toggles were visually checked.

## Approval Commands

Use import-only first when a lane is ready:

```text
/manager approve relay import only
/manager approve reviews import only
/manager approve ai import only
```

Import-only approval should use the QA file with OK rows only when QA flags exist. It should not import held personal-email or duplicate-business rows.

If you personally checked the Relay GHL screens, use the combined approval so Manager can clear the visual gate in the same command:

```text
/manager approve relay import only; I visually confirmed Relay sender domain, warmup status, workflow sender nodes, and HighLevel AI toggles OFF
```

Manual start-drip approval is only for overrides. Normal auto starts after GHL Expert keeps the lane marked `ready_for_drip=yes` and guardrails pass:

```text
/manager approve relay start drip
```

If anything feels wrong:

```text
/manager pause all campaign live actions
```

## Talk To Specific Agents

Use `/manager`, then address the agent by role:

```text
/manager Sales Manager, review Reach QA
/manager GHL Expert, check Reach readiness
/manager Scheduler, what needs attention
/manager Coach, review this copy
/manager Reporter, verify report delivery status
/manager Press, what is ready to publish
```

## Response Speed

Fast commands should answer right away:

```text
/manager status
/manager list agents
/manager what is status of Reach Cold Email Campaign
```

Slower commands may acknowledge first, then post the final result:

```text
/manager run Reach Cold Email Campaign
/manager GHL Expert, check Reach readiness
```

Plain channel messages have a one-minute polling fallback. Slash commands are the faster path.

## Safety Rules

The agents can recommend, prepare, summarize, and check readiness.

They must not do these outside the approved Reach autopilot or a clear manual approval:

- import contacts into GHL
- start a drip
- publish public content
- send DMs
- change GHL workflows or settings
- enable or toggle any HighLevel AI feature

Import-only approval does not approve a manual start-drip. Normal auto start is governed by `ready_for_drip=yes` and the guardrails.

## Cost Rule

Easy checks should stay cheap. Agents should use no LLM or cheap models for routine status, parsing, QA counts, and simple summaries. They should escalate only when judgment, client-facing language, strategy, or risk review needs a stronger model.

Use `agent-model-routing-policy.md` for the detailed cost-control rules.
