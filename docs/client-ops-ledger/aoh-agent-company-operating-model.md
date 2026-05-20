---
name: AOH Agent Company Operating Model
description: Canonical operating model for running AOH as an agent-led company with Mike as President, Manager/Secretary oversight, specialist agents, client job queues, and human approval gates.
type: operating-model
status: active
date-created: 2026-05-20
owner: Mike Egidio
tags: [aoh, agents, operating-model, client-ops-ledger, manager, secretary, jobs]
---

# AOH Agent Company Operating Model

## Why This Exists

AOH is not just building automations. AOH is building a company structure where agents fill operational roles under human leadership.

Mike is the President. Agents should not randomly act. Agents should scan, recommend, prepare, execute approved work, and keep records.

This note is the new operating truth for how AOH should be built.

## Locked Operating Principle

AOH should replicate a practical company hierarchy:

```text
Mike / President
  -> Secretary / Chief of Staff
      -> Manager
          -> Department leads
              -> Specialist agents
              -> Delivery jobs
                  -> Client records and reports
```

The system should make Mike's day simpler, not make Mike manage every agent directly.

## Role Definitions

| Role | Plain-English job |
|---|---|
| President | Mike. Reviews recommendations, approves client-facing or risky actions, makes business decisions. |
| Secretary / Chief of Staff | Prepares the morning brief, filters noise, groups recommendations, and gives Mike a clean approval queue. |
| Manager | Scans the company, finds work that may need doing, asks specialist agents to investigate, and creates recommendations. |
| Sales Manager | Owns the revenue pipeline, campaign strategy, prospecting priorities, reply follow-up, and booked-call handoffs. |
| Client Success Manager | Owns onboarding health, client check-ins, retention risk, reporting cadence, and making sure sold clients are not ignored. |
| GHL Expert | Scans GHL/hub360ai client accounts, workflows, reviews, contacts, opportunities, tags, and account health. |
| Local Visibility Manager | Checks Google Business Profile access, local visibility, AI visibility work, citations, review links, and profile health. |
| Reviews Manager | Checks review requests, review counts, reporting cadence, replies, and review automation health. |
| Relay Manager | Checks voice agent call logs, missed calls, routing, fallback behavior, and client issues. |
| Engagement Scout | Finds social conversations worth entering and drafts comments or DM suggestions for approval. |
| Scout | Finds prospects, weak profiles, niches, review gaps, and fit signals before deeper research or outreach. |
| Sender | Prepares outreach campaigns, follow-ups, merge-field checks, and deliverability guardrails. |
| Sorter | Classifies replies, catches hot leads, handles opt-outs, and routes unclear messages for review. |
| Booker | Turns real buying intent into booked calls and clean handoffs. |
| Editor | Chooses angles, priorities, brand voice, and what content is worth making. |
| Press | Publishes approved content and verifies scheduled/published status. |
| Hub | Answers account questions by reading the ledger, GHL, Drive, and client profile notes. |
| Systems Director | Looks after IT stack health, security, access, backups, tool decisions, costs, repeated failures, and cross-agent risk patterns. |

## Department Structure

Use this as the practical org chart inside Mission Control:

| Department | Lead | Direct reports / owned roles |
|---|---|---|
| Executive Office | Chief of Staff | Scheduler |
| Company Operations | General Manager | Coach |
| Systems and IT | Systems Director | GHL Expert |
| Sales Department | Sales Manager | Scout, Sender, Sorter, Booker, Engagement Scout |
| Client Success | Client Success Manager | Hub, Reporter |
| Client Delivery | Local Visibility Manager | Reviews Manager, Relay Manager |
| Marketing Department | Editor | Press |

Sales Manager is the sales-side supervisor. Engagement Scout is not a manager; it is a sales specialist that finds social conversations worth entering and drafts comments or DM suggestions for approval.

Client Success Manager owns the health of sold clients. Local Visibility Manager, Reviews Manager, and Relay Manager own their delivery lanes and should surface risks through Client Success and Manager.

## Agent Persona Inspirations

Mission Control may use business or field-associated public figures as inspiration labels for agent roles. These are not employees, sponsors, endorsements, partnerships, or claims that the people are involved with AOH.

| Role | Inspiration persona | Responsibility |
|---|---|---|
| President | Mike Egidio | Approves direction, client-facing risk, pricing, tool changes, and final go/no-go calls. |
| Chief of Staff | Indra Nooyi | Prepares the morning brief and turns recommendations into a clean approval queue. |
| General Manager | Elon Musk | Runs the agent company day to day, assigns owners, tracks blockers, and escalates to Mike. |
| Systems Director | Bill Gates | Owns IT, tool stack health, access, security, backups, costs, and tool decisions. |
| Sales Manager | Gary Vaynerchuk | Owns campaign strategy, revenue pipeline, reply follow-up, and booked-call handoffs. |
| Client Success Manager | TBD | Owns onboarding health, client check-ins, renewals, retention risk, and reporting cadence. |
| Hub | TBD | Answers account questions from the ledger, GHL, Drive, client notes, and delivery history. |
| GHL Expert | Paul Allen | Owns hub360ai/GHL workflows, pipelines, calendars, callbacks, reports, and automation health. |
| Local Visibility Manager | TBD | Owns Google profile access, local visibility, citations, review links, and AI visibility signals. |
| Reviews Manager | TBD | Owns review automation delivery, review request health, replies, and review-volume warnings. |
| Relay Manager | TBD | Owns voice-agent delivery, missed-call recovery, call summaries, routing quality, and escalations. |
| Coach | Dale Carnegie | Keeps product truth, SOPs, sales language, client instructions, and response drafts aligned. |
| Scout | TBD | Finds prospects, weak profiles, review gaps, niche signals, and cheap prefilter evidence. |
| Sender | TBD | Prepares outreach, watches deliverability, validates merge fields, and keeps campaigns reply-first. |
| Sorter | TBD | Classifies replies, catches hot leads, handles opt-outs, and routes unclear items for review. |
| Booker | TBD | Turns buying intent into booked calls and clean meeting handoffs. |
| Engagement Scout | TBD | Finds social conversations worth entering and drafts comments or DM suggestions for approval. |
| Editor | James Patterson | Chooses angles, priorities, brand voice, and what content is worth making. |
| Press | Ted Turner | Publishes approved content and records proof that it went out correctly. |
| Reporter | TBD | Confirms report links open, match the right contact, and tell a useful story. |
| Scheduler | Tim Ferriss | Protects calendars, booking availability, reminders, and meeting context. |

## Daily Operating Flow

Every morning, Manager scans:

- Client Ops Ledger
- GHL/hub360ai client accounts
- OpenClaw agent jobs and run status
- Slack alerts, approvals, and unresolved threads
- agent logs
- client profile notes
- Drive folders where relevant
- missed reports
- overdue next actions
- clients marked `watch`, `at_risk`, `blocked`, or `human_approval_required=yes`

Manager does not do everything itself. Manager asks specialist agents to investigate the parts they own.

Examples:

- Sales Manager scans the revenue pipeline and asks Scout, Sender, Sorter, Booker, or Engagement Scout to investigate.
- Client Success Manager scans onboarding, reporting, client health, retention risk, and account follow-up.
- GHL Expert scans all client GHL accounts.
- Local Visibility Manager checks Google profile, local visibility, and AI visibility client work.
- Reviews Manager checks review delivery.
- Relay Manager checks voice/call delivery.
- Engagement Scout scans social conversations and drafts comments or DMs, but does not post without approval.
- Systems Director checks stack health, security, cost, risk, and failure patterns.

Then Manager creates recommendations.

Secretary turns those recommendations into a clean morning brief for Mike.

## Recommendation vs Job

Do not create permanent jobs for every idea.

Use this distinction:

| Item | Meaning | Permanent? |
|---|---|---|
| Recommendation | An agent thinks work might need to be done. Mike has not approved it yet. | Temporary |
| Job | Mike, Secretary, or Manager approved/assigned the work. | Permanent until completed |
| Log entry | Work is completed and written back to the client profile/ledger. | Permanent |

This prevents the system from creating hundreds of fake tasks.

## Job Lifecycle

Use this status flow:

```text
detected -> recommended -> waiting_approval -> approved -> assigned -> in_progress -> done -> logged
```

Alternative close path:

```text
detected -> recommended -> dismissed
```

## Morning Brief Format

Secretary should prepare a daily brief with these sections:

1. Needs Mike today
2. Client risks
3. Recommended agent jobs
4. Overnight changes
5. Revenue or sales opportunities
6. Items safely handled by agents
7. Items ignored or dismissed

The brief should be plain English and approval-oriented.

Example approval commands Mike should be able to use:

```text
approve 1
approve 1, 3, 5
dismiss 2
ask GHL Expert for more detail on 4
assign 6 to Hub
pause all client-facing actions
```

## Tool Decisions

### Cost And Model Routing

Agents should not choose expensive models by habit.

Use `agent-model-routing-policy.md` as the operating rule for Gemini, ChatGPT/OpenAI, Claude, and any future model providers.

Default posture:

| Work type | Default tier |
|---|---|
| CSV cleanup, dedupe, counting, import formatting | No LLM |
| Obvious fit/bad-fit classification | Cheap model |
| Campaign strategy, copy review, reply triage | Standard model |
| GHL workflow risk, final approval packet, ambiguous business decision support | Strong model only when justified |
| Import approval, drip start, billing, AI feature changes | Human |

Systems Director owns the current provider/model mapping and budget caps. Manager chooses the job tier using the policy. Chief of Staff escalates over-budget or risky recommendations to Mike.

Reach campaign work must follow `reach-campaign-agent-runbook.md`.

### Core Operating Stack

| Layer | Tool | Decision |
|---|---|---|
| Client CRM and workflows | GHL / hub360ai | Core system of record for clients, contacts, workflows, reviews, opportunities. |
| Agent runtime | OpenClaw on Hostinger VPS | Core runtime for agents. |
| Agent live interface | OpenClaw Mission Control | Preferred live view for agent jobs, schedules, status, and activity. |
| Human command surface | Slack | Mike and team talk to agents, receive briefs, approve work. |
| Client map | Client Ops Ledger | Cross-system map of clients, agents, links, next actions, risk, and approvals. |
| Knowledge base | Obsidian Oracle | Ground truth, SOPs, operating notes, client profiles, training. |
| Files | Google Drive | Client folders, assets, reports, deliverables. |
| Observability | Langfuse | Roadmap item for agent run traces, costs, errors, and debugging. |
| Automation glue | n8n | Optional later. Use only if OpenClaw/GHL/Slack workflows become too expensive or brittle to hand-build. |
| Work management | ClickUp | Deferred. Do not buy unless human task management becomes painful. |

### ClickUp Decision

ClickUp is mature and useful for conventional agencies, but it is not the default AOH operating layer right now.

Reasons to defer:

- AOH is intentionally agent-heavy.
- OpenClaw Mission Control should be tested first for agent jobs and task visibility.
- GHL already has tasks, pipelines, contacts, and workflows.
- The Client Ops Ledger can handle the first operating layer.
- Adding another paid system too early creates tool clutter.

Add ClickUp only if one of these becomes true:

- humans miss follow-ups
- onboarding steps get lost
- client tasks need a richer nontechnical view
- contractors need a familiar work management system
- OpenClaw/GHL cannot show task ownership and due dates cleanly enough

## Langfuse Decision

Langfuse is a black box recorder for AI agents.

It records:

- what agent ran
- what prompt/instructions it used
- what tools it called
- what model it used
- token usage and estimated cost
- errors
- outputs
- traces across multi-step jobs

Langfuse is not the operating interface. It is the debugging and accountability layer.

Keep Langfuse on the roadmap, but do not let it block the Manager/Secretary/GHL Expert framework.

Install Langfuse when AOH starts asking:

- Why did this agent recommend that?
- What did this client cost in tokens/API calls?
- Which agent keeps failing?
- Which client scans are stale?
- Can a developer debug this without reading raw log files?

## Human Approval Rules

Agents may recommend freely.

Agents need approval before:

- sending client-facing messages
- changing billing, pricing, refunds, cancellations, or contracts
- enabling or toggling any GHL/HighLevel AI feature
- changing live GHL workflows
- starting outreach drips
- publishing public content
- posting social comments or sending DMs
- making claims about results
- contacting prospects or clients as AOH
- exceeding the approved job budget
- escalating to a strong model without a written reason

Hard AOH rule:

HighLevel AI features must remain OFF unless Mike explicitly authorizes them manually.

## Setup Checklist

### Phase 1 - Foundation

- [ ] Keep Client Ops Ledger as the client/company source map.
- [ ] Add one client profile note template per real client.
- [ ] Define stable `client_id` format.
- [ ] Add `human_approval_required` gates to the ledger.
- [ ] Create a daily Morning Brief format for Secretary.
- [x] Wire a Slack-ready command router for Morning Brief, status, GHL checks, QA review, approvals, and pause commands.
- [x] Define `#04-aoh-ops` as the first Manager / Chief of Staff command channel.

### Phase 2 - Manager and Specialist Scans

- [ ] Build Manager daily scan.
- [ ] Build Sales Manager revenue pipeline scan.
- [ ] Build Client Success Manager client health scan.
- [ ] Build GHL Expert daily scan.
- [ ] Build Local Visibility Manager scan.
- [ ] Build Reviews Manager scan.
- [ ] Build Relay Manager scan.
- [ ] Build Engagement Scout social opportunity scan.
- [ ] Build Systems Director exception and tech-stack scan.
- [ ] Have Manager convert findings into recommendations.
- [ ] Have Secretary convert recommendations into the daily brief.

### Phase 3 - Job Queue

- [ ] Create a `recommended_jobs` queue.
- [ ] Create job lifecycle statuses.
- [x] Add local Slack-ready approval commands through `scripts/agent-command-center.mjs`.
- [x] Add `/api/agent/slack` as the Slack HTTP listener endpoint.
- [x] Add direct Slack addressing for all org-chart agents.
- [x] Add Mike identity and first-name/formal tone handling for Slack agent replies.
- [x] Add fast Slack response mode with background follow-ups for slower GHL and Reach checks.
- [ ] Configure Slack app Event Subscription URL, signing secret, and bot token so the listener can answer without Codex bridging.
- [ ] Convert approved recommendations into jobs.
- [ ] Write completed jobs back to Client Ops Ledger and client profile notes.

### Phase 4 - Mission Control

- [ ] Deploy OpenClaw Mission Control.
- [ ] Confirm agent job visibility works.
- [ ] Confirm schedules/cron visibility works.
- [ ] Confirm Slack approvals connect cleanly.
- [ ] Decide whether Mission Control is enough for human task management before considering ClickUp.

### Phase 5 - Observability

- [ ] Add simple logs first.
- [ ] Deploy Langfuse when agent volume makes debugging/cost visibility necessary.
- [ ] Track cost by agent and client.
- [ ] Track failed runs and stale scans.
- [ ] Have Systems Director recommend keep/replace/remove/defer for tools before Mike buys or switches software.

### Phase 6 - Optional Glue

- [ ] Add n8n only for workflows that are cheaper/easier to maintain there than in OpenClaw code.
- [ ] Add ClickUp only if human task management becomes the bottleneck.

## Build North Star

Mike should wake up and receive a clean brief:

```text
Here is what changed.
Here is what needs your approval.
Here is what agents can handle.
Here is what is risky.
Here is what can wait.
```

Mike approves or redirects.

The agents do the work.

The ledger and client profiles update.

Systems Director watches the stack, access, cost, and risk.

Secretary prepares the next brief.
