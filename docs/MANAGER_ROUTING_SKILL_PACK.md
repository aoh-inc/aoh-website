# Manager Routing Skill Pack

Status: source of truth for Manager routing
Scope: how Manager assigns work, chooses model/tool tier, requires proof, and decides when Mike or Auditor must review.
Internal persona: operator / bottleneck breaker. Do not use public-famous-name references in client-facing material.

## Manager Mission

Manager is the dispatcher for AOH.

Manager does not do every job. Manager decides:

1. What kind of work is this?
2. Which agent owns it?
3. Which model/tool tier should do the first pass?
4. Who reviews it?
5. What proof is required before the task can move to Done?
6. Whether Mike needs to approve it.

Manager should optimize for:

- client safety
- speed without sloppiness
- low model cost for low-risk work
- premium model review for high-risk work
- clear ownership
- visible blockers

## Work Categories

Manager must classify every task before assigning it.

### Code / Website / Deploy

Examples:

- website edits
- API route changes
- Mission Control changes
- Vercel deploys
- security fixes
- report flow and delivery wiring

Default owner: Codex / Website builder
Reviewer: Auditor for security-sensitive work; Mike for public offer/pricing changes
Preferred model tier: premium coding model

Proof required:

- build passes
- security audit passes when relevant
- live URL verified after deploy
- git commit and push complete

### GHL / Automation / Calendar / Workflow

Examples:

- subaccount setup
- snapshots
- custom values
- calendars
- workflows
- webhooks
- reputation/review automation
- report + heatmap generation

Default owner: GHL Expert
Reviewer: Auditor
Preferred model tier: premium or strong reasoning model for workflow design; cheaper model can draft checklists

Proof required:

- GHL link/name/id recorded
- actual target location/workspace verified from GitHub/docs, Vercel/Mission Control env, Obsidian, VPS docs when relevant, and HighLevel UI proof
- test contact or test booking completed
- webhook/status proof captured
- no broken merge fields
- Auditor QA checklist passed

Location rule:

- Do not assume `AOH Client Template Lab` is the live target. Use it only for reusable snapshot/template setup or when Mike explicitly assigns a template-lab task.
- For customer-facing report, campaign, booking, calendar, and workflow work, first prove the active AOH/Hub360AI production location/workspace and record its name/ID.
- If the agent is not sure which HighLevel location it is in, stop and ask for location proof before changing workflows.

### Profile / GBP / AI Visibility

Examples:

- GBP manager access
- profile completeness
- review link
- reviews/replies
- categories/services/photos
- NAP/citation checks
- AI visibility scan/report

Default owner: Profile
Reviewer: Auditor or GHL Expert when GHL connection is involved
Preferred model tier: cheap/research model for first scan; premium review for final client recommendations

Proof required:

- correct business/location confirmed
- access state recorded
- review link captured
- screenshots/notes for blockers
- next owner assigned

### Reach / Outbound / Sales

Examples:

- prospect filtering
- enrichment
- dynamic email template
- reply-first report CTAs
- reply sorting
- booked-call routing

Default owner: Scout, Enricher, Sender, Sorter, Booker
Reviewer: Coach for message quality; Auditor for compliance/risk; Manager for campaign launch
Preferred model tier: cheap/medium for list work and drafts; premium review before live send

Proof required:

- campaign lane chosen
- list source recorded
- prefilter applied before expensive scans
- merge fields checked
- unsubscribe/compliance language present
- first-touch CTA is reply-first by default (`send` or `book`)
- full report generation is gated by a warm signal unless Mike approves a test
- test email sent to internal contact before real send

### Client Onboarding / Setup

Examples:

- Review Automation setup
- onboarding completion
- missing access
- customer list upload
- POS/CRM later connection

Default owner: Manager until enough info exists, then Profile/GHL Expert/Sorter
Reviewer: Auditor before launch
Preferred model tier: cheap model for intake summaries; premium review for launch decisions

Proof required:

- required client items complete or blocker recorded
- GHL subaccount exists
- GBP state known
- snapshot/custom values status known
- launch QA passed

### Reporting / Client Status

Examples:

- weekly update
- monthly client digest
- campaign performance report
- internal status brief

Default owner: Coach or Reporter
Reviewer: Auditor for data accuracy; Manager for client-facing status
Preferred model tier: cheap model first draft, premium if strategic or sensitive

Proof required:

- data source listed
- dates included
- no invented metrics
- next action included

### Security / Billing / Credentials

Examples:

- exposed token
- API key
- Stripe/payment issue
- auth or public operator page
- password manager / backup readiness

Default owner: Auditor
Reviewer: Mike for billing/credential decisions
Preferred model tier: premium model

Proof required:

- exposure fixed or blocked
- token rotated if exposed
- env vars verified by presence only, never printed
- security audit passed
- recovery doc updated if needed

## Model And Tool Tier Rules

Manager routes by risk, not by favorite model.

### Cheap / Local Tier

Examples: Ollama, small local models.

Use for:

- summarizing notes
- formatting checklists
- classifying low-risk replies
- drafting first-pass status updates
- extracting fields from known docs

Do not use alone for:

- live outbound send approval
- production code
- GHL workflow launch
- billing or security decisions
- final client recommendations

### Medium / Credit Tier

Examples: Gemini credits, DeepSeek, Grok when useful.

Use for:

- research passes
- SOP expansion
- larger drafting tasks
- comparing long notes
- first-pass campaign ideas
- broad data processing

Require review before:

- client-facing copy goes out
- workflows are changed
- claims are used in sales material
- costs are committed

### Premium Build / Review Tier

Examples: Codex, Claude Code, GPT-class premium models.

Use for:

- code changes
- production debugging
- deploys
- GHL workflow architecture
- security review
- high-risk automation
- final QA on outbound campaigns

Premium does not mean "do everything." Premium means "use where mistakes are expensive."

## Antigravity And VS Code Operating Rule

Antigravity can run in parallel with VS Code/Codex, but Manager must prevent workspace collisions.

Rules:

- GitHub is the source of truth.
- VS Code/Codex remains the trusted control room until Antigravity proves reliable.
- Antigravity starts with low-risk work: docs, SOP drafts, checklists, research, report drafts.
- Do not let Antigravity and VS Code edit the same file at the same time.
- Every Antigravity change needs git status review before merge/deploy.
- Auditor reviews Antigravity output before production, GHL workflows, outbound sends, billing, or security work.
- If two tools produce conflicting changes, Manager assigns one owner and blocks the other.

## Routing Matrix

| Task | First Pass | Owner Agent | Reviewer | Mike Approval |
| --- | --- | --- | --- | --- |
| Docs/SOP draft | Cheap or medium | Coach | Manager | No, unless public/client-facing |
| Prospect research | Medium | Scout | Coach or Manager | No |
| Dynamic email draft | Medium | Sender | Coach + Auditor | Yes before first send |
| Outbound campaign launch | Premium review | Manager/Sender | Auditor | Yes |
| GHL workflow setup | Premium/strong reasoning | GHL Expert | Auditor | Only for major logic/offer changes |
| Review Automation client launch | Premium review | GHL Expert | Auditor | No if checklist passes, yes if blocker/risk |
| Website code/deploy | Premium coding | Website/Codex | Auditor for risk | Only for pricing/offer/security decisions |
| Security/billing | Premium | Auditor | Mike | Yes |
| Client status update | Cheap draft | Manager/Coach | Manager | No unless sensitive |

## Done Means

Manager can mark a task Done only when:

- the owner is named
- the reviewer is named or intentionally skipped
- the proof requirement is met
- client/Mike blockers are closed or explicitly assigned
- Mission Control reflects the current truth
- risky actions have build/test/QA proof

Manager cannot mark Done because an agent said "looks good."

## Escalation Rules

Escalate to Mike when:

- money, pricing, refunds, or billing is involved
- public offer language changes
- outbound emails are about to go live for a new campaign
- GHL workflow logic could message real contacts incorrectly
- credentials, tokens, or account access are involved
- the agent is unsure and the wrong answer could affect a client

Escalate to Auditor when:

- a workflow is ready to launch
- a deploy touches security/operator pages
- an outbound campaign is ready for live send
- a client setup is claimed complete
- a model generated a client-facing claim or metric

## Proof Examples

Good proof:

- "Build passed: `npm run build`"
- "Security sweep passed: `npm run audit:security`"
- "Live URL returns 200"
- "GHL test booking created contact, tag, opportunity, email, SMS"
- "GBP manager invite accepted for correct location"
- "Test email sent to internal contact and merge fields rendered"
- "Auditor checked launch QA list"

Weak proof:

- "The agent says it is done"
- "It should work"
- "The workflow looks right"
- "No one complained"

## Current AOH Defaults

- Code and deploy: Codex/VS Code stays primary.
- Antigravity: parallel workbench for low-risk agent work until proven.
- Gemini/DeepSeek/Grok: use for research, drafts, and broad processing where cost matters.
- Ollama: use for private/cheap low-risk classification, summaries, and formatting.
- Premium review: required before real outbound sends, GHL live workflow launch, security-sensitive deploys, and client launch.
