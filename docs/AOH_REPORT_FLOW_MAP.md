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

- The website forwards the submission to
  `process.env.GHL_WEBSITE_REPORT_WEBHOOK_URL`.
- If that is not set, the website falls back to legacy `GHL_WEBHOOK_URL`.
- If both are missing, the homepage can accept a request but GHL may not receive
  it.

Current operational blocker:

- Vercel production is missing the correct `GHL_WEBSITE_REPORT_WEBHOOK_URL`
  value.
- The weekly smoke test fails until the correct receiving endpoint is added.

What GHL Expert must find:

- The exact GHL receiving endpoint for public homepage report submissions.
- This may be an Inbound Webhook trigger URL, a GHL form endpoint, or another
  intentional receiving route.
- Do not guess from workflow names. Verify the actual receiving mechanism.

Proof required:

- GHL workflow/form/trigger name
- receiving URL copied from the GHL UI or proven source
- whether it is an Inbound Webhook, GHL form, or other receiver
- test homepage report request reaches GHL
- Auditor confirms no secret/token is exposed

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

- `Marketing Audit Report Ordered`
- `AI Visibility Report Ordered`
- `First Report Engagement Tagging`

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
