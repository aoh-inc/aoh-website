# Manager GHL Overview Skill Pack

Status: source of truth for Manager-level GHL supervision
Scope: what Manager must understand about HighLevel to route work, catch risk, and require proof without becoming GHL Expert.
Owner agent: Manager
Specialist owner: GHL Expert
Reviewer: Auditor

## Purpose

Manager needs a map of HighLevel, not the full technician manual.

Manager should know enough GHL to:

- assign the right owner
- recognize risky work
- know what proof GHL Expert must provide
- know when Profile, Sorter, Booker, Sender, Coach, Auditor, or Mike must be involved
- prevent "looks done" from becoming live client damage

Manager should not personally build detailed GHL workflows unless explicitly assigned as backup.

## What Manager Must Know

### Agency vs Subaccount

HighLevel has agency-level and subaccount-level work.

Agency-level examples:

- create/delete subaccounts
- manage snapshots
- agency settings and billing/rebilling
- global integrations
- white-label/branding settings

Subaccount-level examples:

- contacts
- workflows
- calendars
- opportunities/pipelines
- conversations
- reputation/reviews
- dashboards/reports
- subaccount users and permissions

Manager risk rule:

- agency-level changes are higher risk
- client subaccount changes are still risky if workflows, messages, billing, or integrations are touched

Proof Manager requires:

- correct client/location/subaccount name or ID
- source used to identify the target location: GitHub/docs, Vercel/Mission Control env, Obsidian, VPS docs when relevant, and live HighLevel UI proof
- what was changed
- whether the change was agency-level or subaccount-level
- whether Auditor reviewed it

### Subaccounts

A subaccount is the client workspace/location inside HighLevel.

For AOH internal work, do not treat the template lab as the live workspace. `AOH Client Template Lab` is for reusable fields, values, tags, snapshots, draft workflow patterns, and QA. Live campaign/report/calendar work belongs in the active AOH/Hub360AI production location, which must be verified before changes.

For AOH client work, Manager must confirm:

- the correct client subaccount exists
- business name/address/phone/website/timezone are correct
- client user access is appropriate
- service-specific snapshot/setup was loaded only into the correct subaccount

Danger signs:

- agent is not sure which subaccount they are in
- multiple similar client names exist
- workflow is being tested on real contacts
- snapshot loaded before client/service is confirmed

### Snapshots

Snapshots are reusable templates that can copy workflows, forms, custom values, custom fields, tags, pipelines, calendars, templates, dashboards, and other setup assets.

Manager does not need to load snapshots, but must know:

- snapshots are powerful
- wrong snapshot/wrong client can create a mess
- imported workflows may not be safe to turn on immediately
- custom values must be updated after snapshot load

Proof Manager requires from GHL Expert:

- snapshot name
- target subaccount
- assets imported
- workflows reviewed before publishing
- custom values updated
- Auditor has enough proof to QA

### Custom Values vs Custom Fields

Custom Values are reusable constants used inside templates/workflows.

Examples:

- business name
- owner name
- business phone
- website
- Google review link
- calendar link
- support email
- logo URL

Custom Fields store per-contact/opportunity/client data.

Examples:

- service interest
- campaign type
- onboarding status
- POS/CRM system
- bottleneck answer
- report URL
- heatmap URL

Manager rule:

- Custom Values must be correct before workflows/messages go live.
- Custom Fields must exist before workflows depend on them.

Proof Manager requires:

- required custom values are not blank
- links point to the correct client/business
- merge fields render in a test message

### Workflows

Workflows are automated sequences.

Common workflow pieces:

- trigger
- action
- wait
- if/else branch
- tag add/remove
- create/update opportunity
- send email/SMS/review request
- webhook
- internal notification

Manager should know the risk:

- wrong trigger can enroll wrong contacts
- no wait can branch before replies/clicks happen
- broken merge fields make emails look amateur
- missing channel setup means messages do not send
- duplicate enrollment can spam people
- webhook payload mismatch can break report/status flow

Proof Manager requires:

- happy path test
- missing-data path test when relevant
- no duplicate send risk
- execution log checked
- test contact used before real contacts
- Auditor QA before launch

### Calendars

Calendars control booking links, availability, reminders, and routing.

Manager should know:

- calendar type matters: personal vs round robin/team
- booking slug/link must be correct
- conflict calendars prevent double booking
- reminders are usually workflow-driven
- appointment-booked triggers need QA

For AOH `/aoh-talk` Discovery calendar, Manager requires proof:

- booking link works
- Mike is assigned for now
- correct fields are captured
- tags are applied
- opportunities move to correct pipeline/stage
- confirmation email works
- reminder SMS steps are queued
- internal notification works

### Pipelines And Opportunities

Pipelines track sales, onboarding, support, and service delivery.

Manager should know:

- pipeline = board
- stage = step in that board
- opportunity = one prospect/client deal or work item

Danger signs:

- lead is in wrong pipeline
- stage name does not match service status
- booking happens but opportunity is missing
- payment happens but onboarding opportunity is missing

Proof Manager requires:

- correct pipeline/stage
- correct contact linked
- status matches Mission Control

### Conversations, Email, Phone, SMS

Conversations hold SMS, email, calls, and replies.

Manager should know:

- sending channels must be configured
- unsubscribe/consent matters
- bulk send risk is real
- phone/SMS setup affects Relay, Reach, reminders, and review requests

Proof Manager requires:

- internal test email/SMS passed
- merge fields rendered
- unsubscribe/compliance language present for outbound campaigns
- channel setup is complete before live sends

### Reputation / Reviews / GBP

HighLevel Reputation depends on Google Business Profile being connected inside the correct subaccount.

Manager must understand:

- GBP Manager access is not the same as GHL connection
- Profile owns getting AOH access to the GBP
- GHL Expert owns connecting that GBP inside HighLevel
- Reputation should show/sync reviews after connection

Proof Manager requires:

- Profile confirms correct GBP/location
- GHL Expert confirms GBP connected inside HighLevel
- reviews visible/syncing or blocker recorded
- review link correct
- review request workflow tested

### Webhooks And Report Flow

Webhooks move data between HighLevel and the website/other systems.

For AOH report/heatmap flow, Manager should know:

- AOH has multiple report lanes. Read `docs/AOH_REPORT_FLOW_MAP.md` before
  assigning report-flow work.
- Public homepage free report intake is not automatically the same as a
  campaign workflow named "Marketing Audit Report Ordered" or a trigger named
  "Marketing Audit Request Form".
- Cold email campaigns are reply-first by default as of 2026-05-18. A prospect
  replying `send` or `book` is the warm signal that justifies report generation
  or booking handoff.
- Direct report links from cold email are a test variant only.
- `GHL_WEBSITE_REPORT_WEBHOOK_URL` is public homepage website-to-GHL intake.
- `GHL_CAMPAIGN_REPORT_WEBHOOK_URL` is warm campaign reply-to-report intake.
- `GHL_WEBHOOK_URL` is only a legacy fallback.
- `https://aioutsourcehub.com/api/report/callback` is GHL-to-website callback
  after a report is generated.
- the website can receive report requests
- GHL must generate report/heatmap
- GHL must callback the website with the correct `runId`
- status must move from submitted to report_ready/heatmap_ready

Proof Manager requires:

- test report request created
- correct report lane identified
- website-to-GHL intake endpoint verified
- campaign warm signal recorded before full report spend
- GHL workflow generated a report URL
- callback hit `/api/report/callback`
- `/api/report/status?runId=...` moved to the expected stage
- no token/secret exposed in URLs or screenshots

## Manager Routing Rules For GHL Tasks

### Assign To GHL Expert

Use GHL Expert for:

- subaccount setup
- snapshot load
- custom values/custom fields
- workflows
- calendars
- pipelines/opportunities
- reputation/GBP connection inside HighLevel
- report/heatmap workflow
- webhooks
- email/SMS/phone setup

### Assign To Profile First

Use Profile before GHL Expert when:

- GBP access is missing
- wrong Google profile/location might be connected
- review link is needed
- profile completeness/health must be checked
- Google profile verification is unclear

### Assign To Sorter First

Use Sorter before GHL Expert when:

- customer list is messy
- CSV headers need cleanup
- contacts need dedupe
- exclusions/consent risk must be checked
- fields need mapping before import

### Assign To Coach First

Use Coach before GHL Expert when:

- client-facing copy/instructions are unclear
- workflow messaging needs brand voice
- email/SMS templates need approval
- SOP needs cleanup

### Assign To Auditor

Use Auditor when:

- workflow is ready to publish
- campaign is ready to send real messages
- client setup is claimed complete
- security/secret exposure risk exists
- a report says "done" but proof is weak

### Ask Mike

Ask Mike when:

- pricing, billing, refund, or plan boundary is involved
- outbound campaign is about to go live for a new offer
- a GHL workflow could message real contacts incorrectly
- a client exception changes the service promise
- credentials/account ownership decisions are involved

## GHL Proof Checklist

Manager should ask for the right proof based on task type.

### Core Subaccount Proof

- subaccount name/ID
- business settings checked
- user permissions safe
- service plan matched

### Snapshot Proof

- snapshot name
- loaded into correct subaccount
- workflows/templates/custom values imported
- workflows not accidentally live before QA

### Workflow Proof

- trigger named
- actions named
- test contact used
- happy path passed
- missing-data path checked if relevant
- execution logs checked
- no duplicate-send risk

### Calendar Proof

- booking link works
- host/team member correct
- availability correct
- conflict calendar connected if needed
- confirmation/reminders tested
- pipeline/tag routing tested

### Reputation Proof

- correct GBP connected
- reviews visible/syncing or blocker recorded
- review link correct
- review request send test passed

### Report/Heatmap Proof

- report request creates run ID
- GHL stores run ID/report URL
- GHL callback works
- status endpoint updates
- heatmap state is recorded if available

### Outbound Send Proof

- test email sent internally
- merge fields render
- report CTA link works
- unsubscribe/compliance language exists
- no real send until Auditor/Manager approval

## What Manager Should Not Do

Manager should not:

- build complex workflows from memory
- publish workflows without Auditor QA
- approve bulk sends without test proof
- assume snapshot load means ready
- assume GBP manager access means GHL is connected
- assume "report generated" unless URL/status proof exists
- let cheap models make final high-risk GHL decisions

## Source Knowledge Packs

Manager's GHL overview is distilled from:

- `docs/GHL_CORE_KNOWLEDGE_PACK.md`
- `docs/GHL_WORKFLOWS_KNOWLEDGE_PACK.md`
- `docs/GHL_CALENDARS_CONVERSATIONS_PACK.md`
- `docs/GHL_INTEGRATIONS_TROUBLESHOOTING_PACK.md`
- `docs/GHL_EXPERT_KNOWLEDGE_PACK.md`
- `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`
- `docs/PP_GHL_WIRING.md`
