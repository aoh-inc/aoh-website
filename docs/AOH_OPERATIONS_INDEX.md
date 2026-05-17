# AOH Operations Index

Status: active
Last updated: 2026-05-17
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
- `https://hubgateway.aioutsourcehub.com`
  - OpenClaw gateway
  - opened from the Mission Control top button through `/api/openclaw/login`

Current security note:

- `mc.aioutsourcehub.com` is separated from the public website, but subdomain separation is not full access control.
- The OpenClaw gateway token belongs in Vercel as `OPENCLAW_TOKEN`, not in source code.
- The exposed OpenClaw gateway token was rotated on 2026-05-17 in the VPS OpenClaw env/config and in Vercel `OPENCLAW_TOKEN`.
- Stale OpenClaw config backups on the VPS were scrubbed of the exposed token value.
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
