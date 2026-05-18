# Antigravity Start Here

Purpose: onboard Antigravity as a parallel agent workbench for AOH.

Antigravity is not the boss yet. It is a workbench for low-risk agent tasks while VS Code/Codex remains the trusted control room.

## Current AOH Setup

- Main repo: `C:\Users\micha\Documents\aoh-website`
- Tooling repo: `C:\Users\micha\Documents\aoh-tooling`
- Source of truth: GitHub
- Website deploy target: Vercel
- Knowledge library: Obsidian + Google Drive + repo docs
- VPS docs copy: `/root/aoh-docs`
- Mission Control: `https://mc.aioutsourcehub.com`

## First Files To Read

Read these before doing anything:

1. `docs/AGENT_OPERATING_MODEL.md`
2. `docs/MANAGER_ROUTING_SKILL_PACK.md`
3. `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`
4. `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`
5. `docs/AOH_OPERATIONS_INDEX.md`
6. `docs/PP_GHL_WIRING.md`
7. `docs/AOH_REPORT_FLOW_MAP.md`

## Operating Rule

Antigravity produces. Codex/VS Code verifies and ships.

Antigravity may draft, research, summarize, propose, and prepare checklists. Antigravity should not deploy, push, edit secrets, change live workflows, or send outbound email until Mike explicitly approves that step after review.

## Agent Router Rule

Before doing any task, Antigravity must classify the work and name the owner agent.

Use this routing:

- **Manager**: decide owner, model tier, reviewer, blockers, proof required.
- **GHL Expert**: HighLevel subaccounts, calendars, workflows, webhooks, custom values/fields, pipelines, report/heatmap workflow, Reputation setup.
- **Auditor**: verify, QA, security, billing/credential risk, launch checks, drift checks.
- **Scout**: research, docs lookup, competitive/source gathering.
- **Coach**: SOPs, training docs, client instructions, message quality review.
- **Profile**: Google Business Profile access, profile health, review link, GBP connection state.
- **Sender**: outbound email copy/templates, merge fields, report CTA language.
- **Sorter**: customer/prospect list cleanup, dedupe, field mapping.
- **Booker**: appointment routing, booked-call handoff, calendar booking process.
- **Codex/Website**: website code, Vercel, GitHub, API routes, deploys. Antigravity may draft or inspect; Codex ships.

Default model rule:

- cheap/fast model for classification, summaries, simple checklist work, and first-pass UI inspection
- medium/research model for long docs, research, campaign drafts, and comparisons
- premium model only for production code, live workflow design, security/billing, final outbound approval, or when a cheap model is blocked

If the task touches HighLevel workflows, calendars, webhooks, contacts, opportunities, or report generation, route to **GHL Expert** automatically.

If the task touches report flow, Manager must first identify the lane using `docs/AOH_REPORT_FLOW_MAP.md`: public homepage free report, campaign marketing audit/report, or GHL-to-website callback.

Campaign report work is reply-first by default as of 2026-05-18: cold email asks the prospect to reply `send` or `book`; full report generation waits for that warm signal unless Mike explicitly approves a direct-link test.

If the task is about "is this working?", "verify", "test", "safe to launch?", "credits", "billing", or "secrets", route to **Auditor** or require Auditor review.

If the task asks who should do it, route to **Manager** first.

## Allowed First Tasks

Good first tasks:

- summarize AOH docs
- propose SOP improvements
- draft checklists
- draft client-facing instructions
- draft internal QA checklists
- research GHL/GBP docs and summarize findings
- draft dynamic Reach email copy for review
- compare an onboarding checklist against a client setup note
- suggest Mission Control wording improvements
- propose task routing rules for Manager

## Forbidden Until Trusted

Do not:

- deploy to Vercel
- push to GitHub
- edit `.env` files or secrets
- rotate tokens
- change Stripe/payment links
- change live GHL workflows
- send outbound emails
- bulk import contacts
- modify billing/rebilling settings
- delete files or folders
- edit the same files VS Code/Codex is actively editing

## Model/Tool Tier Rules

Use cheap/local models for:

- summaries
- formatting
- low-risk classification
- draft status notes

Use Gemini/DeepSeek/Grok-style models for:

- research
- large draft generation
- SOP expansion
- comparison of long notes

Require premium review for:

- production code
- deploys
- GHL live workflows
- outbound campaigns
- client launch
- security
- billing
- public offer/pricing language

## First Prompt

Paste this into Antigravity as the first task:

```text
You are helping AOH set up an agent workforce.

Open and read these files:
- docs/AGENT_OPERATING_MODEL.md
- docs/MANAGER_ROUTING_SKILL_PACK.md
- docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md
- docs/REVIEW_AUTOMATION_AGENT_SKILLS.md
- docs/AOH_OPERATIONS_INDEX.md
- docs/PP_GHL_WIRING.md
- docs/AOH_REPORT_FLOW_MAP.md

Do not edit files.
Do not run deploy commands.
Do not push to GitHub.
Do not touch env vars or secrets.

Your task:
1. Explain in plain English how Manager should route work between agents.
2. List the first 10 low-risk tasks Antigravity can safely handle.
3. List the tasks Antigravity should NOT handle yet.
4. Tell me what proof you would require before marking an agent task done.
```

## Reusable Router Prompt

Paste this at the top of any Antigravity task when you want it to pick the right agent:

```text
You are Manager for AI Outsource Hub. Before doing work, classify this task and route it to the correct AOH agent.

Rules:
- Do not enable HighLevel AI features or anything that spends AI credits.
- Do not deploy, push, edit secrets, send outbound email, bulk import contacts, or change live workflows unless Mike explicitly approves.
- If the task touches HighLevel workflows, calendars, webhooks, contacts, opportunities, report generation, Reputation, or GHL settings, assign GHL Expert.
- If the task touches report flow, identify the lane first using docs/AOH_REPORT_FLOW_MAP.md: public homepage free report, campaign marketing audit/report, or GHL-to-website callback.
- For campaign report work, default to reply-first (`send` or `book`) and do not assume a direct report-link funnel unless Mike explicitly approved that test.
- If the task is verification, QA, launch safety, security, billing, credentials, or "is this working?", assign Auditor or require Auditor review.
- If the task is website code, Vercel, GitHub, API routes, or deploys, assign Codex/Website. Antigravity may inspect/draft only.
- If the task is prospect research, assign Scout.
- If the task is outbound email copy/templates/merge fields, assign Sender with Coach review and Auditor review before sending.
- If the task is SOPs, training, or client instructions, assign Coach.
- If the task is Google Business Profile access/profile health/review link, assign Profile.
- If the task is list cleanup/import mapping/dedupe, assign Sorter.

Return this header first:
OWNER AGENT:
MODEL TIER:
REVIEWER:
RISK LEVEL:
PROOF REQUIRED:

Then do the task only if it is allowed under these rules. If not allowed, explain the blocker and the exact safe next step.

Task:
```

## First Week Plan

### Day 1

Install Antigravity, open `C:\Users\micha\Documents\aoh-website`, and run the first read-only prompt.

### Day 2

Ask Antigravity to draft Manager task-routing examples. Review output in Codex/VS Code.

### Day 3

Ask Antigravity to draft Sender's dynamic Reach email template. Do not send it. Coach/Auditor must review.

### Day 4

Ask Antigravity to draft a GHL Expert QA checklist for report + heatmap workflow.

### Day 5

Ask Antigravity to draft Review Automation client onboarding checklist improvements.

### Day 6

Ask Antigravity to review Mission Control job/workflow wording and suggest clearer language.

### Day 7

Review how well Antigravity followed rules. Only then decide whether to let it make small docs-only edits.

## Done Means

Antigravity output is not Done by itself.

Done means:

- owner is clear
- reviewer is clear
- proof required is listed
- risky action is blocked until reviewed
- any proposed file changes are reviewed in Git
- Codex/VS Code handles final push/deploy until Mike changes the rule

## If Unsure

If Antigravity is unsure, it should stop and ask Manager/Mike instead of guessing.
