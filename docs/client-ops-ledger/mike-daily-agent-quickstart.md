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

## Start The Day

Type:

```text
/manager status
```

Then type:

```text
/manager what is status of Reach Cold Email Campaign
```

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

If Manager says agent review is still needed, ask:

```text
/manager Sales Manager, review Reach QA
/manager GHL Expert, check Reach readiness
```

## Approval Commands

Use import-only first when a lane is ready:

```text
/manager approve relay import only
/manager approve reviews import only
/manager approve ai import only
```

Start-drip approval is separate and should only happen after GHL Expert confirms the lane is ready for drip:

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

They must not do these without explicit approval:

- import contacts into GHL
- start a drip
- publish public content
- send DMs
- change GHL workflows or settings
- enable or toggle any HighLevel AI feature

Import-only approval does not approve start-drip. Start-drip must be approved separately.

## Cost Rule

Easy checks should stay cheap. Agents should use no LLM or cheap models for routine status, parsing, QA counts, and simple summaries. They should escalate only when judgment, client-facing language, strategy, or risk review needs a stronger model.

Use `agent-model-routing-policy.md` for the detailed cost-control rules.
