# AOH Operations Index

Status: active
Last updated: 2026-05-18
Purpose: one place to find the backup plan, agent operating model, agent skills, and Review Automation onboarding work.

## What Was Solved

The laptop-death scenario now has a documented recovery path stored in GitHub, not only on the laptop.

The website repo is recoverable from GitHub:

- GitHub repo: `https://github.com/aoh-inc/aoh-website`
- Latest recovery commit: `b2b47f7 Add laptop recovery runbook`
- Live site remains on Vercel if the laptop dies.

The local `.claude/` runtime folder is ignored so local lock files do not create false backup noise.

## Laptop Death / Backup Docs

Use these first if the laptop dies:

- `docs/LAPTOP_DEATH_RECOVERY.md`
  - step-by-step new laptop restore path
  - account access checklist
  - repo restore commands
  - Vercel env var recovery notes
  - Obsidian, Google Drive, OpenClaw/Atlantis restore notes

- `docs/BACKUP_READINESS_CHECKLIST.md`
  - current backup map
  - green/red readiness checks
  - monthly 10-minute drill
  - what still depends on Mike confirming account/password access

## Agent Operating Model

Main doc:

- `docs/AGENT_OPERATING_MODEL.md`

This defines the rule:

> Agents own the knowledge. Mission Control displays the work.

It documents:

- Scout researches
- Coach turns research into SOPs/training
- Profile owns Google Business Profile access/health
- GHL Expert owns HighLevel setup/automation
- Sorter owns customer list readiness
- Auditor owns launch QA and drift checks
- Manager owns handoffs, blockers, and status

Manager routing doc:

- `ANTIGRAVITY_START_HERE.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`

This defines how Manager chooses the right agent, model/tool tier, reviewer, proof requirement, and Mike escalation path. It also defines the Antigravity + VS Code parallel operating rule:

- GitHub is the source of truth.
- VS Code/Codex remains the trusted control room until Antigravity proves reliable.
- Antigravity starts on low-risk docs, SOPs, checklists, research, and drafts.
- Auditor reviews Antigravity output before production, GHL workflows, outbound sends, billing, or security work.

The GHL overview pack gives Manager enough HighLevel supervision knowledge to route and audit GHL work without becoming GHL Expert. It covers subaccounts, snapshots, custom values/fields, workflows, calendars, pipelines, Reputation/GBP connection, webhooks, report/heatmap proof, and launch gates.

HighLevel location rule: agents must not default customer-facing work to `AOH Client Template Lab`. The template lab is for reusable setup, snapshots, draft patterns, fields, values, and tags. Live report, campaign, calendar, booking, and visitor flows must first prove the active AOH/Hub360AI production location from GitHub/docs, Vercel/Mission Control env, Obsidian notes, VPS docs when relevant, and the HighLevel UI.

## Review Automation Agent Skills

Main doc:

- `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`

This defines the Review Automation team flow:

1. Client buys Review Automation.
2. Client completes self-serve onboarding.
3. Manager checks readiness.
4. Profile confirms GBP access.
5. GHL Expert configures HighLevel.
6. Sorter prepares customer list if provided.
7. Auditor verifies launch.
8. Manager reports status back to client.

Important offer boundary:

- Base Review Automation is email-only review automation plus GBP audit/fix and monthly digest.
- SMS, AI-drafted replies, Reviews AI, ongoing AI Visibility work, and social review posting belong to AI Visibility or another approved upgrade.

## Email Campaign Agent Skills

For the Reach outbound email campaigns (Reviews + AI Visibility targeting), the following agent skills were loaded on 2026-05-17:

2026-05-18 strategy update:

- Default campaign CTA is now reply-first: prospect replies `send` for the report or `book` for the booking link.
- Direct personalized report links are a controlled test variant only.
- Full report generation should wait for a warm signal unless Mike explicitly approves a test segment.
- Website visitors remain form-first through the homepage report form.

- **Scout**: `cheap-prefilter`
  - Pre-score prospects before deep GBP scanning to control acquisition cost
  - Blocks the "Prospect list filter before spending" blocker

- **Sender**: `dynamic-email-template`, `report-cta-generation`
  - Build personalized emails with merge fields for business/niche/competitor data
  - Use reply-first report CTAs by default: `send` or `book`
  - Blocks the "Final dynamic email template" blocker (execution)

- **Coach**: `email-draft-approval`, `template-merge-field-validation`
  - Review Sender's template drafts for voice/tone correctness
  - Validate all merge fields resolve before send
  - Blocks the "Final dynamic email template" blocker (review + validation)

- **GHL Expert**: `report-generation-workflow`
  - Trigger and monitor GHL workflow to generate reports after website requests or warm campaign replies
  - Blocks the "Live GHL report + heatmap workflow" blocker

All 5 REACH_TOMORROW_BLOCKERS now have agent skill coverage. See `lib/control/job-costs.ts` REACH_TOMORROW_BLOCKERS for current status of each blocker.

## GHL Expert Knowledge Packs

GHL Expert is not limited to reviews. The agent now has modular HighLevel knowledge packs:

- `docs/GHL_CORE_KNOWLEDGE_PACK.md`
  - subaccounts
  - users/permissions
  - snapshots
  - custom values/custom fields
  - contacts/imports
  - pipelines/opportunities
  - email/phone/SMS basics

- `docs/GHL_WORKFLOWS_KNOWLEDGE_PACK.md`
  - triggers
  - actions
  - waits
  - if/else
  - trigger links
  - inbound/outbound webhooks
  - review request workflow action
  - workflow testing

- `docs/GHL_CALENDARS_CONVERSATIONS_PACK.md`
  - calendars
  - appointment booking
  - linked/conflict calendars
  - reminders
  - conversations
  - phone/SMS/email basics

- `docs/GHL_INTEGRATIONS_TROUBLESHOOTING_PACK.md`
  - Google integrations
  - Social Planner
  - rebilling/wallets
  - SMS troubleshooting
  - A2P/carrier approval
  - email/phone issues
  - integration QA

- `docs/GHL_EXPERT_KNOWLEDGE_PACK.md`
  - Review Automation-specific HighLevel setup
  - GBP connection inside HighLevel
  - Reputation sync
  - email review requests
  - review widgets
  - Reviews AI as upgrade-only
  - QA and blockers

## Profile Knowledge Packs

Profile owns Google Business Profile and local visibility:

- `docs/PROFILE_KNOWLEDGE_PACK.md`
  - GBP manager access
  - owner vs manager permissions
  - agency/business group access
  - verification
  - review link capture
  - handoff to GHL Expert

- `docs/PROFILE_LOCAL_VISIBILITY_PACK.md`
  - GBP completeness checks
  - review velocity and unanswered reviews
  - profile health
  - citation/NAP checks
  - AI visibility checks
  - monthly profile reporting

## Client Onboarding

Client-facing draft:

- `docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md`

This is the self-serve onboarding flow for Review Automation:

- business info
- review request/customer-flow details
- add AOH as Google Business Profile Manager
- optional customer list upload
- POS/CRM information for later integration
- upgrade-only social/reply/SMS details
- final confirmation

This is a written draft meant to become:

- an onboarding page/form
- screenshots
- a short walkthrough video
- a dedicated GBP manager invite video

## AOH Discovery Calendar

Internal sales intake build spec:

- `docs/AOH_DISCOVERY_ROUND_ROBIN_CALENDAR.md`

Mission Control should show this as active GHL Expert work with Auditor as reviewer:

- calendar: `Discovery - Round Robin`
- public slug: `talk`
- owner: GHL Expert
- reviewer: Auditor
- manager approval after QA

## Mission Control Source Mapping

Mission Control seed data lives here:

- `lib/control/mission.ts`

It maps agents to:

- services
- skills
- source docs
- mission board tasks
- scheduled work

The Hub page is here:

- `app/mike-mc/page.tsx`

The internal operator pages are:

- `https://mc.aioutsourcehub.com`
  - rewrites to `/mike-mc`
  - intended home for Mission Control
- `https://mc.aioutsourcehub.com/ops`
  - rewrites to `/mike-mc/ops`
  - public-safe operations index
- `https://mc.aioutsourcehub.com/jobs`
  - rewrites to `/mike-mc/jobs`
  - scheduled job cost and value ledger
- `https://hubgateway.aioutsourcehub.com`
  - OpenClaw gateway
  - opened from the Mission Control top button through `/api/openclaw/login`

Current security note:

- `mc.aioutsourcehub.com` is separated from the public website, but subdomain separation is not full access control.
- The OpenClaw gateway token belongs in Vercel as `OPENCLAW_TOKEN`, not in source code.
- The exposed OpenClaw gateway token was rotated on 2026-05-17 in the VPS OpenClaw env/config and in Vercel `OPENCLAW_TOKEN`.
- Stale OpenClaw config backups on the VPS were scrubbed of the exposed token value.
- The Hostinger OpenClaw wrapper on the VPS is intentionally patched so login redirects to `/__aoh-token-bootstrap` instead of `/#token=...`.
- The bootstrap page stores the dashboard token in browser storage for `wss://hubgateway.aioutsourcehub.com`, then redirects to `/`.
- The wrapper patch is persisted by `/docker/openclaw-dntw/docker-compose.yml`, which bind-mounts `/docker/openclaw-dntw/server.mjs` over `/hostinger/server.mjs`.
- A current copy of the core AOH operations docs is stored on the VPS at `/root/aoh-docs`.
- Next security step: add real auth/password protection in front of Mission Control.

## Auditor Security Sweep

Auditor now has a concrete pre-deploy sweep:

- script: `scripts/auditor-security-sweep.mjs`
- command: `npm run audit:security`

The sweep checks for:

- hardcoded secret assignments
- token/secret/password URL parameters
- secret-like `NEXT_PUBLIC_*` env names
- private key blocks
- common GitHub and Stripe secret token formats

## Public Offer Alignment Work

The public offer was corrected so Review Automation is not accidentally described as including SMS or replies.

Files touched in that cleanup:

- `app/pricing/page.tsx`
- `content/blog/ai-visibility-vs-seo.md`
- `content/blog/dental-practices-reviews-compounding-asset.md`
- `content/blog/diy-review-tools-vs-done-for-you.md`
- `content/blog/pet-groomers-reviews-decide-bookings.md`
- `content/blog/real-cost-missed-google-review.md`
- `content/blog/why-chatgpt-recommends-by-name.md`
- `content/social-pack/profiles.md`
- `lib/team-options.ts`
- `lib/team-pack.ts`

Current public offer boundary:

- Review Automation: `$49/mo`, no setup, email review asks, GBP audit/fix, monthly digest.
- AI Visibility: `$199/mo + $199 setup`, includes SMS and replies in the client voice.
- Reach: `$299/mo + $299 setup`.
- Relay: `$299/mo + $299 setup`.

## Remaining Human Check

The only part that cannot be fully solved in code is account recovery access.

Mike still needs to confirm the password manager contains:

- Google
- GitHub
- Vercel
- Stripe
- GoHighLevel / Hub360AI
- domain/DNS provider
- VPS provider
- Slack
- Obsidian sync provider, if used

If those are recoverable without the laptop, AOH can survive a laptop loss.

## Quick Recovery Command

On a new laptop:

```powershell
mkdir C:\Users\micha\Documents
cd C:\Users\micha\Documents
git clone https://github.com/aoh-inc/aoh-website.git
cd aoh-website
npm install
npm run build
```

Then follow `docs/LAPTOP_DEATH_RECOVERY.md`.
