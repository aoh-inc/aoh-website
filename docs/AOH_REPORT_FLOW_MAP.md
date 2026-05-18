# AOH Report Flow Map

Status: source of truth for homepage/campaign report routing
Owner: Manager
Specialist: GHL Expert
Reviewer: Auditor
Last updated: 2026-05-18

## Why This Exists

AOH has more than one "report" path. Agents must not assume a workflow named
"Marketing Audit Report Ordered" is the same thing as the public homepage
report form, or that outbound campaigns should send prospects straight to a
report link.

Before changing, testing, or wiring reports, Manager must identify which lane is
being discussed.

Manager and GHL Expert must also identify the actual HighLevel target
location/workspace before inspecting or changing workflows. Do not default to
`AOH Client Template Lab`; that location is for reusable template/snapshot
assets unless Mike explicitly says the task is template-lab QA. Report lanes
below are customer-facing AOH/Hub360AI production-location concerns.

## Current Default

As of 2026-05-18, cold email campaigns are reply-first by default.

Default campaign CTA:

- reply `send` to request the report
- reply `book` to request the booking link

Direct personalized report links remain a test variant only. Do not make a
direct report-link campaign the default unless Mike explicitly approves that
test.

## Lane 1: Public Homepage Free Report

Purpose:

- A visitor on `https://aioutsourcehub.com` requests a free report from the
  homepage.

Website entrypoint:

- `POST /api/report`
- source file: `app/api/report/route.ts`

Website expectation:

- The preferred path is the no-premium API/tag handoff: the website creates or
  updates the GHL contact, writes report fields, and adds the report request
  tags.
- If API credentials are unavailable, the website may fall back to
  `process.env.GHL_WEBSITE_REPORT_WEBHOOK_URL`, then legacy `GHL_WEBHOOK_URL`.
- Inbound Webhook triggers are not the default because they can add HighLevel
  premium cost.

Current operational blocker:

- No current website visitor blocker after 2026-05-18 smoke testing.
- Vercel has `GHL_PIT_TOKEN` and `GHL_LOCATION_ID`, so a report webhook URL is
  not required for the homepage lane.
- Campaign reply routing is separate and still requires final build/QA before
  scaled outbound sending.

What GHL Expert must find:

- The exact GHL receiving mechanism for public homepage report submissions.
- Preferred no-premium option while proving the flow: website API creates or
  updates the GHL contact, writes report fields, and adds
  `aoh_website_report_requested` plus report-specific generator tags. GHL starts
  report workflows from `Contact Tag` triggers:
  - `aoh_generate_marketing_report`
  - `aoh_generate_ai_visibility_report`
- Paid/premium option: an Inbound Webhook trigger URL.
- Other possible option: a GHL form endpoint.
- Do not guess from workflow names. Verify the actual receiving mechanism.

Proof required:

- GHL workflow/form/trigger name
- whether it uses Contact Tag, Inbound Webhook, GHL form, or other receiver
- for Contact Tag: proof the website added `aoh_website_report_requested`
- test homepage report request reaches GHL
- Auditor confirms no secret/token is exposed

Current live workflow design:

- Website API writes the contact and tags.
- `Website Visitor Free Marketing Report Intake` starts from
  `aoh_generate_marketing_report`.
- `Website Visitor Free AI Visibility Report Intake` starts from
  `aoh_generate_ai_visibility_report`.
- Both workflows create/update an opportunity in the `Website Leads` pipeline at
  `Website Report Requested`.
- Marketing callback sends `event = report_ready` with `auditUrl`.
- AI visibility/map callback sends `event = heatmap_ready` with `heatmapUrl`.
- `Website Visitor Report Delivery` waits until both URLs exist, sends one
  combined customer email, updates the opportunity, and tags the contact.

Verified live workflows as of 2026-05-18:

- `Website Visitor Free Marketing Report Intake` - published
- `Website Visitor Free AI Visibility Report Intake` - published
- `Website Visitor Report Delivery` - published
- Combined delivery smoke test completed:
  wait -> branch -> send email -> update opportunity -> add tag -> finish

Manager green-light checklist:

- contact exists/updates in HighLevel
- expected tags exist:
  - `aoh_website_report_requested`
  - `aoh_report_requested`
  - `aoh_generate_marketing_report`
  - `aoh_generate_ai_visibility_report`
  - `aoh_secondary_report_requested` when both reports are requested
- both workflows start
- `Website Leads` opportunity exists at `Website Report Requested`
- spreadsheet row action succeeds
- update contact field action succeeds
- marketing callback succeeds
- AI visibility/heatmap callback succeeds
- report URLs are present on the contact
- no red workflow errors remain

Weekly team routine:

- Manager owns final signoff and blocker routing.
- Auditor runs one homepage smoke test and checks for red errors, exposed
  secrets, duplicate contacts, and stale old-test runs.
- GHL Expert checks tags, workflows, callbacks, and the `Website Leads`
  pipeline.
- Reporter opens the generated report links and confirms they are usable.
- Website/Codex fixes `/api/report`, Vercel env, or callback issues if the
  handoff breaks.

## Lane 2: Campaign Reply-First Report Request

Purpose:

- A prospect receives a cold email, replies with `send`, and AOH sends or
  generates the relevant report only after that warm signal.

Customer journey:

1. Prospect receives a short campaign email with no attachment.
2. Email asks for a reply, usually `send` for the report or `book` for the
   calendar link.
3. Sorter/automation classifies the reply.
4. If reply is `send`, GHL Expert/Reporter generates or sends the report.
5. If reply is `book`, Booker routes the prospect to the AOH Talk calendar.
6. GHL tracks report requested, booked requested, report delivered, booked call,
   and any reply outcome.

Website/GHL entrypoint:

- Warm campaign report requests may post to `POST /api/report` from GHL or an
  internal tool.
- The website forwards campaign submissions to
  `process.env.GHL_CAMPAIGN_REPORT_WEBHOOK_URL`.
- If that is not set, the website falls back to legacy `GHL_WEBHOOK_URL`.

Likely GHL workflow names:

- `Reach Reviews - First Touch to Engaged` - published
- `Reach AI Visibility - First Touch to Engaged` - published
- `Reach Reviews - Warm Lead` - draft
- `Reach Reviews - Warm Tagging` - draft
- `First Report Engagement Tagging` - published
- Legacy/older names may still exist, including `Marketing Audit Report
  Ordered`; do not assume they are the active campaign lane without proof.

Important distinction:

- A trigger named "Marketing Audit Request Form" may belong to campaign
  execution, not the public website homepage.
- Do not use this lane for `GHL_WEBSITE_REPORT_WEBHOOK_URL` unless GHL Expert
  verifies it is intentionally the receiver for public homepage submissions too.
- Do not generate full reports for every cold prospect by default. Scout may
  cheaply prefilter large lists, but full report generation should wait for a
  warm signal such as reply `send`, reply `book`, a qualified manual decision,
  or an explicitly approved test.

Proof required:

- campaign lane: Reviews, AI Visibility, or other
- reply trigger recorded (`send`, `book`, or human-classified equivalent)
- contact tagged/staged correctly in GHL
- report generation cost justified by warm signal
- report delivered or booking link sent
- Auditor can measure cost per reply, cost per report requested, and cost per
  booked call

Campaign Reply Router target behavior:

- `send` reply:
  - classify as warm report request
  - add/report-request tags for the campaign lane
  - generate the right report only after this warm signal
  - deliver the report through the approved combined delivery path
  - move/update the opportunity to a report-requested or warm stage
- `book` reply:
  - classify as booking intent
  - send the AOH Talk booking link:
    `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
  - move/update the opportunity to a booking-requested or warm stage
- unclear positive reply:
  - create a task for Sorter/Mike review
  - do not auto-generate a full report until intent is clear
- unsubscribe/stop/not interested:
  - honor DND/unsubscribe behavior
  - do not generate reports
  - move/tag as not interested where appropriate

Campaign Reply Router QA before scaled sends:

- test contact replies `send`
- test contact replies `book`
- test contact replies with a vague positive answer
- test contact replies unsubscribe/stop/not interested
- confirm no duplicate customer emails
- confirm no report is generated for unclear or not-interested replies
- confirm GHL execution logs are green
- confirm opportunity stage and tags match the reply outcome

## Lane 3: Direct Report-Link Test Variant

Purpose:

- A controlled experiment where a prospect clicks a personalized report link
  directly from a cold email.

Status:

- Not the default campaign journey as of 2026-05-18.
- Use only when Mike explicitly approves the test size, niche, and success
  metric.

Rules:

- No PDF attachment.
- Use branded `aioutsourcehub.com` links only.
- Do not use tracking-heavy redirect chains.
- Do not prebuild expensive full reports for the entire cold list.
- Auditor must compare this variant against reply-first on deliverability,
  reply rate, report requests, booked calls, and cost per booked call.

## Callback Back To Website

Purpose:

- After GHL generates a report, it tells the website the report is ready.

Direction:

- GHL -> website

URL:

- `https://aioutsourcehub.com/api/report/callback`

Important:

- This callback URL is not the missing `GHL_WEBHOOK_URL`.
- The callback token is a secret. Do not paste it in chat or screenshots.
- If exposed, Auditor should rotate it in both Vercel and GHL.

## Routing Rule

For any report-flow issue:

1. Manager identifies the lane:
   - public homepage free report
   - campaign reply-first report request
   - direct report-link test variant
   - callback/status update
2. Manager assigns GHL Expert for HighLevel inspection.
3. Auditor reviews proof before the flow is marked done.
4. Codex/Website only wires Vercel/API/code after GHL Expert provides the
   verified receiving URL or endpoint.

## Anti-Confusion Checks

Ask these before doing work:

- Is this visitor-facing homepage traffic or campaign traffic?
- Is this website-to-GHL intake, or GHL-to-website callback?
- Is this reply-first default, or a specifically approved direct-link test?
- What exact workflow/form/trigger receives the data?
- What proof shows a test request arrived in GHL?
- What warm signal justified report generation?
- Are any secrets visible in the output?
