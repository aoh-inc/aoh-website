# Systems Director Readiness Check

Generated: 2026-05-30T12:34:21.244Z
Owner agent: Systems Director
Reviewer: Auditor
Human approver: Mike

## Summary

- Pass: 10
- Warn: 4
- Fail: 0
- Skipped: 0


## Watch Items

- Vercel domains: Production and legacy domains are both still present in the Vercel team.
- Supabase backups: Supabase backup/PITR status cannot be proven from this repo alone.
- VPS backups: Hostinger VPS backup/snapshot status cannot be proven from this repo alone.
- Password manager: Password-manager recovery coverage cannot be proven by agents.
## Checks

| Area | Status | Finding | Proof | Next action |
|---|---|---|---|---|
| GitHub | PASS | Local repo is on main, points at the GMF GitHub repo, and has no local-only changes. | ## main...origin/main |  |
| GitHub archive | PASS | Old AOH repo is still present as an archive remote. | Remote: aoh-archive |  |
| Runbooks | PASS | Recovery docs are present and point at the current GMF repo/docs path. | docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md<br>docs/BACKUP_READINESS_CHECKLIST.md<br>docs/LAPTOP_DEATH_RECOVERY.md<br>docs/GETMEFOUND_STACK_STATUS.md |  |
| Vercel link | PASS | Local project is linked to the active GetMeFound Vercel project. | project=getmefound; projectId=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb; orgId=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel owner | PASS | Active Vercel identity matches the protected owner account. | user=mike-egidio; email=mike@aioutsourcehub.com; id=F1j3I59aUYZmc1Gcbc6pJfEU; source=Vercel CLI session |  |
| Vercel team | PASS | Active account is owner of the protected Vercel team. | team=aoh-inc; name=AI Outsource Hub; role=OWNER; id=team_3K7fCmjAF4RxcNGqxfDgoY53 |  |
| Vercel project | PASS | GetMeFound Vercel project is visible from this authenticated runtime. | project=getmefound; id=prj_NyxkjegahECBSR2MYZ4wTGVG0tMb |  |
| Vercel domains | WARN | Production and legacy domains are both still present in the Vercel team. | getmefound.ai=present; aioutsourcehub.com=present | No emergency. Remove or redirect the legacy domain only after Mike approves. |
| VPS/OpenClaw | PASS | VPS is reachable and the required GMF docs copy exists. | /root/gmf-docs/AGENT_OPERATING_MODEL.md<br>/root/gmf-docs/BACKUP_READINESS_CHECKLIST.md<br>/root/gmf-docs/GMF_OPERATIONS_INDEX.md<br>/root/gmf-docs/LAPTOP_DEATH_RECOVERY.md<br>/root/gmf-docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md<br>/root/gmf-docs/MANAGER_ROUTING_SKILL_PACK.md<br>/root/gmf-docs/PP_GHL_WIRING.md<br>/root/gmf-docs/REVIEW_AUTOMATION_AGENT_SKILLS.md<br>/root/gmf-docs/SYSTEMS_DIRECTOR_BACKUP_SECURITY_RUNBOOK.md<br>/root/gmf-docs/backups/2026-05-30-0819-aoh-website/BACKUP_MANIFEST.md |  |
| VPS docs path | PASS | Legacy `/root/aoh-docs` path is no longer treated as the active docs path. | active=/root/gmf-docs |  |
| Supabase backups | WARN | Supabase backup/PITR status cannot be proven from this repo alone. | Owner approval needed before enabling paid PITR. | Systems Director should confirm plan/backups in Supabase before onboarding high client volume. |
| VPS backups | WARN | Hostinger VPS backup/snapshot status cannot be proven from this repo alone. | Provider dashboard proof required. | Systems Director should confirm daily VPS backups and define an encrypted offsite OpenClaw backup. |
| Password manager | WARN | Password-manager recovery coverage cannot be proven by agents. | Mike-only verification. | Mike should confirm GitHub, Vercel, Supabase, Hostinger, DNS, Google, Stripe, Slack, Resend, and Smartlead recovery entries exist. |
| Security sweep | PASS | Auditor security sweep passed. | > getmefound-website@0.1.0 audit:security > node scripts/auditor-security-sweep.mjs Auditor security sweep passed. No obvious secret exposure patterns found. |  |

## Mike Approval Required

- Vercel account/team/project/domain deletion, merge, or transfer
- Legacy AOH domain removal or redirect
- Paid Supabase PITR or backup-plan changes
- Paid VPS backup/snapshot changes
- Production token rotation
- Database or VPS restore/overwrite

## Agent-Owned Next Actions

- Systems Director runs this check weekly and summarizes only status/proof, not secrets.
- Auditor reviews warnings before client volume grows or before production-sensitive changes.
- Codex updates scripts, docs, and non-destructive workflows when checks identify drift.
- No agent deletes accounts, projects, domains, databases, or VPS state without Mike's explicit approval.
