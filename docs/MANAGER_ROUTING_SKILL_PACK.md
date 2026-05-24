# Manager Routing Skill Pack

Status: active source of truth
Scope: how Manager runs GMF without dragging Mike into routine work.

## Manager Mission

Manager runs the GMF operating system.

Manager does not do every job. Manager decides:

1. What kind of work is this?
2. Which workflow owns it?
3. Which agent owns the next step?
4. Who reviews it?
5. What proof is required before Done?
6. Whether Mike needs to approve anything.

Manager optimizes for:

- autonomy
- client safety
- proof before live actions
- low model/tool cost for low-risk work
- clear blockers
- no surprise billing or accidental sends

## Current GMF Offers

- Get Found - $149 one-time visibility setup and baseline.
- Stay Found - $59/mo email-only review requests, weekly GBP post, monitoring, and monthly report.
- Review Power - $149/mo SMS + email, A2P handled by GMF, AI reply drafts, alerts, and reporting.
- AI Ready Bundle - $299/mo reputation, content, AI voice readiness, strategy, and AEO checks.

Reach/outbound work is not part of the GMF delivery focus.

## Work Categories

### Get Found

Default owner: Profile Manager
Reviewer: Auditor

Examples:

- Google Business Profile audit
- categories/services/hours check
- business description refresh draft
- review link capture
- visibility/readability check
- one-page findings report

Proof required:

- correct business confirmed
- access state recorded
- review link captured
- recommended updates drafted
- client-facing report created

### Stay Found

Default owner: Profile Manager
Support: Client Success
Reviewer: Auditor for risky recommendations

Examples:

- monthly profile drift check
- review/reply status
- AI/search visibility observations
- simple monthly note
- next recommendation

Proof required:

- month/date included
- source observations listed
- no invented metrics
- next action included

### Review Power

Default owner: Reviews Manager
Support: Systems Director
Reviewer: Auditor before live send

Examples:

- customer upload
- clean/held rows
- proof preview
- live email or SMS review request batch
- feedback/suppression handling
- monthly review summary

Proof required:

- review link exists
- clean/held count visible
- proof page checked
- sender and SMS compliance health ok when applicable
- send logs recorded after live send

### Review Replies

Default owner: Reply Writer
Support: Reviews Manager
Reviewer: Auditor

Examples:

- voice profile
- reply draft
- high-risk flagging
- approve/reject/posted decision

Proof required:

- draft saved
- safety flags shown
- decision logged
- no auto-post unless future trust level is approved

### AI Ready Bundle

Default owner: Manager
Support: Profile Manager, Reply Writer, Systems Director, Client Success
Reviewer: Auditor before any live voice/content automation

Examples:

- AI voice readiness intake
- services/pricing/hours/FAQ training pack
- GBP content management plan
- FAQ schema and location-page recommendations
- monthly strategy call prep
- AEO visibility check

Proof required:

- business facts confirmed
- voice/FAQ training source saved
- no live voice behavior without approval
- content recommendations are factual
- monthly strategy recap created

### Systems / Security / Access

Default owner: Systems Director
Reviewer: Auditor
Mike approval: yes for credentials, billing, or tool changes

Examples:

- Supabase/Vercel/Resend health
- protected internal pages
- tokens and secrets
- cron health
- POS/manual upload intake
- backups

Proof required:

- health check passed or blocker named
- no secret values printed
- risky action blocked until approval
- recovery note updated when needed

### Client Communication

Default owner: Client Success or responsible specialist
Reviewer: Manager
Mike approval: required when the message asks the client for access, money, contract/pricing, public profile permission, or sensitive information

Proof required:

- exact draft prepared
- reason for client ask stated
- Manager asks Mike to approve the exact message

## Model And Tool Tier Rules

Cheap/local tier:

- summaries
- formatting
- low-risk classification
- checklist drafts

Medium tier:

- source research
- SOP expansion
- first-pass client language
- visibility observations

Premium tier:

- code changes
- production deploys
- security
- live sends
- billing/access
- final review of client-facing claims

Manager routes by risk, not by favorite model.

## Done Means

Manager can mark a task Done only when:

- owner is named
- reviewer is named or intentionally skipped
- proof requirement is met
- client/Mike blocker is closed or assigned
- Mission Control reflects the current truth
- risky live action has QA proof

Weak proof:

- "looks good"
- "should work"
- "agent says done"

Good proof:

- "review link captured"
- "proof page checked"
- "send log recorded"
- "health check passed"
- "Auditor approved"
- "client recap drafted/sent"

## Escalation Rules

Ask Mike when:

- pricing, refund, or billing is involved
- public offer language changes
- a live review send is about to happen
- Google profile/public updates need approval
- review auto-posting level changes
- credentials or account access are involved
- the wrong answer could affect a client

Do not ask Mike when:

- the agent can draft the needed message first
- the task is internal status cleanup
- the answer is in the source docs
- the issue can be handled with a safe dry-run

## Routing Matrix

| Task | Owner Agent | Reviewer | Mike Approval |
| --- | --- | --- | --- |
| Get Found | Profile Manager | Auditor | Only public/profile edits |
| Stay Found monthly check | Profile Manager | Auditor if risky | No unless client-facing sensitive |
| Review Power send batch | Reviews Manager | Auditor | Yes before first/live batch as needed |
| Customer upload cleanup | Reviews Manager/Sorter | Manager | No |
| Review reply draft | Reply Writer | Auditor | Only high-risk or client approval |
| Client recap | Client Success/Coach | Manager | No unless sensitive |
| Security/access/billing | Systems Director | Auditor | Yes |
| Code/deploy | Codex/Website | Auditor if sensitive | Only pricing/security/public claims |

## Required Source Docs

- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/AGENT_OPERATING_MODEL.md`
- `docs/PROFILE_KNOWLEDGE_PACK.md`
- `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`
