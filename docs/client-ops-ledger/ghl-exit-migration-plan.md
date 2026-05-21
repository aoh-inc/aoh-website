# GHL Exit Migration Plan

Status: planning v1  
Owner: Manager  
Specialists: Systems Director, GHL Expert, Website/Codex, Sender, Auditor  
Last updated: 2026-05-21

## Plain-English Decision

AOH should move off GHL as the long-term operating backbone, but should use the
$97 plan as the cheapest short-term bridge if it keeps the active workflows
working.

GHL becomes a short bridge:

1. Downgrade to the $97 plan if support confirms data/workflows/API access will
   remain intact.
2. Do not build new AOH services around GHL.
3. Export and document current GHL assets.
4. Rebuild Review Automation, AI Visibility, Reach, and reports outside GHL.
5. Cancel GHL only after live replacement checks pass.

## Why Not Cancel Immediately

GHL is still being used for:

- active Reach cold email campaigns
- campaign drip workflow starts
- contact import/tagging
- campaign reply routing
- email campaign stats
- website report handoff pieces
- workflow proof while the replacement is being built

Canceling before these are replaced risks losing campaign history, workflow
settings, contacts, and proof.

## Downgrade Rule

Downgrade target:

- $97 Starter plan

Before approving the downgrade, confirm with GHL support:

- contacts stay intact
- workflows stay intact
- calendars stay intact
- email stats/history remain visible
- custom fields/values stay intact
- pipelines stay intact
- API keys/access still work enough for export and transition
- existing automations do not stop because of a plan gate
- upgrade-back path is available if something breaks

Do not tell support the cancellation plan. The immediate ask is only:

> I am reducing cost. What breaks if I move from $497 to $97?

## GHL $97 Bridge Rules

After downgrade:

- no new client subaccounts
- no GHL SaaS Mode work
- no GHL AI Employee
- no Search Atlas/SEO/heatmap add-ons
- no Premium Prospecting add-on
- no new paid GHL feature unless Mike manually approves
- no client-facing promise that depends on a GHL-only feature
- no separate Calendly, Smartlead/Instantly, or review email sender until GHL
  becomes the bottleneck

GHL is allowed only for:

- keeping current Reach workflows alive while migration is underway
- keeping current booking/calendar links alive if the $97 plan supports them
- sending Review Automation and Reach emails at low volume while replacement is
  being tested
- exporting settings/history
- training GHL Expert on how to translate automations into AOH-owned systems

## Calendar Decision

Do not buy Calendly yet if GHL $97 keeps booking working.

Short-term:

- use the existing GHL booking/calendar links if they survive the downgrade
- keep Google Calendar as the real calendar source wherever possible
- archive the old GHL calendar setup for proof

Buy Calendly only when one of these becomes true:

- GHL $97 removes or breaks booking
- AOH needs cleaner website embeds
- AOH needs routing or round-robin booking
- GHL calendar management becomes slower than the $10-$16/mo Calendly cost

Calendly is the fallback, not the immediate purchase.

## Tool Spend Decision

Do not add replacement tools just to replace GHL.

While GHL $97 works, defer:

- Calendly
- Smartlead or Instantly
- a separate review-request email sender

Use GHL short term for:

- booking links
- current Reach drips
- low-volume Review Automation email sends
- current GHL email stats while campaigns are still there

Approximate cost avoided by waiting:

| Deferred tool | Approx monthly cost avoided |
| --- | ---: |
| Calendly | $10-$12 |
| Smartlead | $39+ |
| Instantly alternative | $47+ |
| Separate review email sender | $0-$20 early |

Bridge decision:

- If GHL $97 works, it is the cheaper and simpler short-term answer.
- If GHL blocks reporting, deliverability, booking, or client scaling, replace
  that one piece only.

## Replacement Workstreams

| Workstream | Replacement target | Exit gate |
| --- | --- | --- |
| Review Automation | AOH client page, Redis/database storage, internal status API, optional GHL/email sender bridge, private feedback page, monthly recap | AOH can run review requests for AOH and 1 pilot client with GHL bridge or without GHL. |
| AI Visibility | AOH client page, GBP checklist, AI scans, heatmap vendor/API, AI reply drafts, monthly report | AOH can produce one AI Visibility report without GHL/Search Atlas. |
| Reach cold email | Keep GHL drips short term; later Smartlead/Instantly only if GHL becomes the blocker | New campaign can send, stop on reply, track stats, and report without forcing $297/$497. |
| Report routing | AOH database/API tracks report requests and ready state | Website report request no longer needs GHL workflow state. |
| Email stats | Email provider/API stats feed AOH brief | Morning brief can show campaign stats without GHL email stats. |
| Relay | Partner/reseller voice AI platform | Relay does not require GHL subaccounts or GHL phone workflows. |
| Data/archive | Export GHL contacts, workflows, fields, tags, stats, assets | Auditor can find old proof after GHL is canceled. |

## Build Order

### Step 0: AOH Review Automation Core

Owner: Website/Codex  
Reviewer: Reviews Manager + Auditor

Built:

- `/client/[slug]/customers` for customer/job list upload.
- `/review/[slug]` for private feedback before Google routing.
- Redis-backed event storage through existing Upstash env vars.
- `/api/review-automation/status` for Manager/System status checks.

Rules:

- Slack only gets summaries, not full customer rows.
- The status endpoint requires an internal token. Use
  `AOH_INTERNAL_API_TOKEN`, or the existing report bypass token as the bridge
  token while infrastructure is being consolidated.
- Happy customers route to Google only after the verified client review link is saved.
- GHL remains the sender bridge until AOH has send logs, suppression, unsubscribe, bounce handling, and one follow-up rule.

Current deployment note:

- `REPORT_TEST_BYPASS_TOKEN` exists in Vercel Production and can protect the
  internal status endpoint during the bridge phase.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` were not listed in
  Vercel Production on 2026-05-21, so persistent review event history still
  needs those env vars or a replacement database before live storage is complete.

### Step 1: GHL Inventory And Export

Owner: GHL Expert  
Reviewer: Auditor

Repeatable command:

```bash
npm run ghl:exit-inventory
```

This creates a dated, read-only metadata inventory in
`docs/client-ops-ledger/outbox/`. It does not export contacts, customer records,
message bodies, token values, passwords, or HighLevel AI settings.

Current 2026-05-21 inventory snapshot:

- 1 GHL location
- 6 pipelines
- 167 workflows
- 191 custom fields
- 91 custom values
- 10 email workflow campaigns
- 8 calendars
- 228 tags

Export or document:

- active locations/subaccounts
- contacts and tags
- workflows and triggers
- custom fields and custom values
- pipelines and stages
- email templates
- campaign stats
- active booking links and calendar settings if GHL $97 keeps them working
- report workflow names and callback paths
- wallet/add-ons/current billable features

Done means:

- there is a dated export folder or doc
- no secret values are printed in docs
- Manager knows what still depends on GHL

Contact/customer exports, if needed later, must go to a gitignored folder such
as `data/ghl-exit/YYYY-MM-DD/` and must not be committed.

### Step 2: AOH Review Automation Core

Owner: Website/Codex  
Specialists: Sender, Sorter, Local Visibility Manager, Manager

Build:

- client record
- client page
- intake/customer upload
- do-not-contact list
- Google review link field
- private feedback page
- review request email template
- send log
- one follow-up rule
- monthly recap

Done means:

- AOH can send its own review request test outside GHL
- low-rating feedback routes privately
- happy feedback reaches Google review link
- send log and client page update correctly

Current v1 foundation:

- `/client/[slug]/customers` accepts customer/job rows and applies basic
  missing-email, duplicate, and do-not-contact holds.
- Customer uploads and private feedback now save to Upstash Redis when
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
- `/api/review-automation/customers` forwards full packets only to the AOH-owned
  review automation webhook when Redis is not configured; Slack gets summary
  counts.
- `/review/[slug]` collects private feedback before Google.
- `/api/review-automation/feedback` routes 1-3 star feedback privately and only
  sends 4-5 star customers to Google when a verified review link exists.

### Step 3: AOH AI Visibility Core

Owner: Local Visibility Manager  
Specialists: Scout, Reporter, Website/Codex, Auditor

Build:

- AI visibility prompt scan checklist
- GBP/profile health checklist
- heatmap vendor/API test
- AI reply draft workflow
- monthly visibility report page
- upgrade-only SMS plan using Twilio

Done means:

- one AOH AI Visibility report can be generated outside GHL
- heatmap/ranking source is not GHL/Search Atlas
- reply drafts require approval before publishing

### Step 4: Reach Migration

Owner: Sender  
Specialists: Scout, Sales Manager, Systems Director, Auditor

Target stack:

- Outscraper/business discovery for leads
- NeverBounce or similar for verification
- Smartlead or Instantly for drip sending
- AOH database for prospects/status
- AOH reply classifier for `send`, `book`, interested, not interested,
  unsubscribe
- AOH/Slack for Manager reporting

Done means:

- one small campaign runs outside GHL
- drip stops on reply
- unsubscribe works
- bounces are visible
- reply routing works
- Manager brief shows stats without GHL

### Step 5: Report Flow Migration

Owner: Website/Codex  
Specialists: Reporter, Auditor

Build:

- report request table
- report status table
- generated report URL storage
- heatmap URL storage
- callback or direct update path
- client/prospect-facing report delivery

Done means:

- website report request can complete without GHL workflow state
- Reporter can open generated links
- Auditor can prove no duplicate sends

### Step 6: Cancel GHL

Owner: Systems Director  
Approver: Mike

Cancel only when:

- no live Reach campaign depends on GHL
- no client Review Automation setup depends on GHL
- no AI Visibility reporting depends on GHL/Search Atlas
- contacts/workflows/stats have been exported
- replacement stack has run successfully for at least 30 days or Mike approves
  an earlier exit
- Manager can answer "what breaks if GHL is off?" with "nothing client-facing"

## Agent Training Plan

Yes, agents should be involved.

This migration is a training opportunity because every GHL function becomes an
AOH-owned operating skill.

| Agent | Training focus | Why it matters |
| --- | --- | --- |
| Manager | Route GHL-exit work, track blockers, brief Mike simply | Manager becomes the right-hand operator instead of Mike babysitting. |
| Systems Director | Cost, vendor choices, cron jobs, failure alerts, downgrade/cancel gates | Keeps the replacement lean and reliable. |
| GHL Expert | Export GHL assets, translate workflows into AOH specs, inspect what breaks on downgrade | GHL knowledge becomes sellable automation knowledge, not dependency. |
| Website/Codex | Build AOH client pages, APIs, database, cron, logs | This is the new core platform. |
| Sender | Move drips from GHL to Smartlead/Instantly/AOH logic | Reach cannot leave GHL without Sender owning this. |
| Scout | Research vendors, costs, heatmap tools, cold email tools, voice partners | Prevents expensive tool choices. |
| Sorter | Customer/prospect list cleanup and suppression rules | Bad lists break review automation and outreach. |
| Local Visibility Manager | GBP access, profile checks, review link, AI Visibility findings | Replaces GHL reputation dependence. |
| Reporter | Monthly reports, heatmap/visibility summaries, result pages | Makes the service feel premium without GHL dashboards. |
| Auditor | QA, proof, downgrade safety, cancellation readiness | Prevents silent breakage. |

GHL Expert should not disappear. The role changes:

- from "operate GHL forever"
- to "understand GHL well enough to export, replace, and sell automation
  services to clients who still use GHL"

## Owner View

Mike should only need to see:

- GHL plan: $97 bridge / downgrade confirmed / cancel ready
- Replacement status: Review, AI Visibility, Reach, Reports
- Current blocker
- Next safest action
- Monthly cost avoided

Manager command:

```text
Manager, GHL exit status
```

## First 7 Days

Day 1:

- downgrade call/support confirmation
- export current GHL inventory
- freeze new GHL-dependent work
- keep intake packets flowing to AOH-owned webhooks/Slack before the temporary
  GHL bridge

Days 2-3:

- build AOH Review Automation v1 spec from the client page
- pick database/email sender path
- define first AOH test send
- keep current GHL booking links unless downgrade breaks booking

Days 4-5:

- keep current GHL Reach drips if $97 supports them
- map current GHL tags/workflows to future AOH campaign states

Days 6-7:

- choose heatmap/rank data source for AI Visibility
- create cancellation readiness checklist
- Manager briefs Mike on the first realistic GHL cancellation date
