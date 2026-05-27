# Systems Director Backup And Security Runbook

Status: active
Owner agent: Systems Director
Reviewer: Auditor
Implementer: Codex/Website
Human approver: Mike

## Purpose

GetMeFound should not depend on Mike doing technical backup or server routines by hand.

Systems Director owns the recurring checks. Auditor verifies proof. Codex fixes scripts, docs, and infrastructure wiring. Mike approves only sensitive or paid actions.

## Operating Rule

Mike does not manually run technical backup/security routines.

Systems Director reports:

- what is backed up
- what is not backed up
- what changed since the last check
- what needs Mike's approval
- what an agent can safely fix without approval

Mike approves:

- account deletion, transfer, or merge
- domain deletion or transfer
- paid backup/PITR upgrades
- token rotation that may interrupt production
- destructive server/project/database actions

## Current Critical Resources

| Resource | Current source of truth | Do not delete |
|---|---|---|
| GitHub repo | `mje-gmf/website` | Yes |
| Vercel owner user | `mike-egidio` / `mike@aioutsourcehub.com` | Yes |
| Vercel team | `aoh-inc` / AI Outsource Hub | Yes |
| Vercel production project | `getmefound` | Yes |
| Production domain | `getmefound.ai` | Yes |
| Legacy Vercel project | `aoh-website` | Only after Mike approves |
| Legacy domain | `aioutsourcehub.com` | Only after Mike approves |
| VPS alias | `atlantis` | Yes |
| VPS docs copy | `/root/gmf-docs` | Yes |

## Vercel Support Guardrail

While Vercel support is investigating duplicate or broken accounts, every support reply must include:

- preserve `mike@aioutsourcehub.com`
- preserve user `mike-egidio`
- preserve team `aoh-inc`
- preserve project `getmefound`
- preserve domain `getmefound.ai`
- do not delete the active owner account, active team, or active project

If Vercel asks for permission to delete anything, Systems Director must stop and ask Mike.

## Backup Tiers

### Tier 1: Website Code

Source of truth: GitHub `mje-gmf/website`

Readiness means:

- local `main` is pushed to `origin/main`
- no important uncommitted changes are laptop-only
- GitHub account recovery works without the laptop

### Tier 2: Production Deploy

Source of truth: Vercel project `aoh-inc/getmefound`

Readiness means:

- latest production deployment is ready
- project link points to `getmefound`
- production domain is `getmefound.ai`
- Vercel account access does not depend on one browser session

### Tier 3: Client Data

Source of truth: Supabase and other connected service databases

Readiness means:

- Supabase backups are available on the current plan
- PITR is enabled before client volume becomes serious
- logical exports are tested before relying on them
- restores are tested on a non-production project

### Tier 4: OpenClaw And Agent Runtime

Source of truth: VPS `atlantis`

Readiness means:

- Hostinger VPS backups are enabled
- a manual snapshot is taken before major runtime changes
- `/docker/openclaw-dntw` and runtime config are included in an offsite backup plan
- `/root/gmf-docs` contains current recovery docs
- SSH access works without cached laptop-only credentials

### Tier 5: Account Recovery

Source of truth: password manager

Readiness means:

- GitHub, Vercel, Supabase, Hostinger, Google, domain/DNS, Stripe, Slack, Resend, and Smartlead logins are stored
- 2FA recovery is stored safely
- at least one backup access path exists for business-critical accounts

## Weekly Systems Director Check

Run:

```powershell
npm run systems:readiness
```

The check writes:

- `docs/client-ops-ledger/systems-director-readiness-current.md`
- a timestamped outbox report under `docs/client-ops-ledger/outbox/`

The report must not print secret values.

Systems Director posts or summarizes only:

- pass/warn/fail status
- proof location
- Mike approvals needed
- safe agent next steps

## Monthly Auditor Drill

Auditor verifies:

- GitHub clone can build
- Vercel project/domain identity is still correct
- Supabase backup or PITR status is known
- VPS SSH works
- OpenClaw runtime files are present
- `/root/gmf-docs` exists
- password manager has recovery entries

Auditor does not restore production unless Mike explicitly approves.

## Agent Escalation Rules

Systems Director may run read-only checks without approval.

Codex may update docs, scripts, and non-destructive workflows without approval.

Auditor may run verification checks without approval.

Mike approval is required before:

- deleting Vercel users, teams, projects, deployments, or domains
- transferring domains or projects
- enabling paid backups/PITR
- rotating production secrets
- restoring or overwriting a database
- restoring or overwriting a VPS
- changing HighLevel AI features

## Done Means

A backup/security check is done only when:

- a report exists
- no secrets are printed
- failures have named owners
- Mike approvals are clearly separated from agent-owned fixes
- the next safe action is obvious
