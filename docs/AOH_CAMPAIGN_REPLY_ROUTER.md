# AOH Campaign Reply Router

Status: build spec for GHL Expert + Auditor
Owner: Manager
Specialist: GHL Expert
Reviewer: Auditor
Last updated: 2026-05-18

## Purpose

This is the missing piece before scaled outbound email.

Website visitor report generation and combined delivery are already verified in
production. Campaign traffic is separate. Cold prospects should not receive full
report generation until they raise their hand.

## Current Live Facts

- `Reach Reviews - First Touch to Engaged` is published.
- `Reach AI Visibility - First Touch to Engaged` is published.
- `Reach Reviews - Warm Lead` is draft.
- `Reach Reviews - Warm Tagging` is draft.
- `Review Interest to Warm Leads` is published.
- `First Report Engagement Tagging` is published.
- `Website Visitor Free Marketing Report Intake` is published and separate.
- `Website Visitor Free AI Visibility Report Intake` is published and separate.
- `Website Visitor Report Delivery` is published, tested, and separate.
- Live AOH/Hub360AI production location is `tRbczwt6oJsXK4tjuzOI`.
- Live pipelines visible to Mission Control:
  - `Reach - Reviews`: `Engaged`, `Warm Leads`, `Sold`, `Nurture / Closed`
  - `Reach - AI`: `Engaged`, `Warm Leads`, `Sold`, `Nurture / Closed`
  - `Website Leads`: `New Website Lead`, `Website Report Requested`,
    `Report Sent`, `Booked Call`, `Customer`, `Not A Fit`

## Hard Rules

- Do not use `AOH Client Template Lab` for this live campaign work.
- Do not enable HighLevel AI features.
- Do not pre-generate full reports for the cold list.
- Do not use direct report links as the default CTA.
- Do not publish scaled send until Auditor signs off.

## Router Behavior

## Recommended Build Shape

Build this as campaign reply routing, not as another public website form flow.

Recommended workflow name:

- `Campaign Reply Router - Reviews + AI + Beta`

Trigger:

- Customer Replied or the equivalent HighLevel reply trigger used by the active
  Reach campaigns.
- Filter to the active campaign lanes/mailboxes only.
- Do not trigger from website visitor forms.

Preferred AOH-controlled route:

- GHL workflow action: Custom Webhook
- URL: `https://aioutsourcehub.com/api/campaign/reply-router`
- Method: `POST`
- Header: `x-campaign-reply-router-token: <CAMPAIGN_REPLY_ROUTER_TOKEN>`
- Required body fields:
  - `contactId`
  - `replyText`
  - `campaignLane` (`reviews`, `ai`, or `beta`)

Why:

- HighLevel's public workflow API is not a safe full workflow-builder API.
- The AOH endpoint keeps reply classification, duplicate checks, and tag routing
  in testable code.
- GHL only needs a simple Customer Replied trigger that calls the endpoint.
- The endpoint adds tags such as `aoh_reply_send`, `aoh_reply_book`,
  `aoh_reply_beta`, `aoh_campaign_duplicate_blocked`, and the correct report
  generator tag.

Endpoint safety:

- Production will reject calls until `CAMPAIGN_REPLY_ROUTER_TOKEN` is set.
- The endpoint does not enable any HighLevel AI features.
- Use `?dryRun=1` during tests to classify without adding tags.

First safety branch:

1. Opt-out / not interested
2. Duplicate already handled
3. Booking intent
4. Beta intent
5. Report/details intent
6. Unclear positive or everything else

Reason:

- Opt-outs must win before any other action.
- Duplicate guard must run before report generation.
- `book` and `beta` are more specific than generic `send`.

## Tags

Use existing tags if they already exist in GHL. If they do not exist, create
them with these names so agents have a stable vocabulary.

Campaign/source tags:

- `aoh_campaign_reply`
- `aoh_campaign_reviews`
- `aoh_campaign_ai_visibility`
- `aoh_campaign_beta`

Intent tags:

- `aoh_reply_send`
- `aoh_reply_book`
- `aoh_reply_beta`
- `aoh_reply_unclear`
- `aoh_reply_optout`

Guard/completion tags:

- `aoh_campaign_report_requested`
- `aoh_campaign_report_delivered`
- `aoh_campaign_booking_link_sent`
- `aoh_campaign_beta_details_sent`
- `aoh_campaign_reply_needs_human`
- `aoh_campaign_duplicate_blocked`

Report-generation tags:

- reviews lane: `aoh_generate_marketing_report`
- AI Visibility lane: `aoh_generate_ai_visibility_report`
- if a warm reply should receive both reports, add both generator tags only once
  and add `aoh_secondary_report_requested`

## Opportunity Movement

Reviews campaign:

- Pipeline: `Reach - Reviews`
- `send`: move/create opportunity in `Warm Leads`
- `book`: move/create opportunity in `Warm Leads`
- `beta`: only use this if beta is running from the reviews lane; otherwise use
  the beta lane process
- opt-out/not interested: move/create opportunity in `Nurture / Closed`

AI Visibility campaign:

- Pipeline: `Reach - AI`
- `send`: move/create opportunity in `Warm Leads`
- `book`: move/create opportunity in `Warm Leads`
- opt-out/not interested: move/create opportunity in `Nurture / Closed`

Website reports:

- Do not move campaign replies into `Website Leads` unless the person actually
  came through the public website form.

## Duplicate Guard

Before adding report generator tags, check whether any of these are already
present or populated:

- `aoh_campaign_report_requested`
- `aoh_campaign_report_delivered`
- `aoh_report_requested`
- `Audit Report URL` is not empty
- `PP Heatmap URL` is not empty

If already handled:

- add `aoh_campaign_duplicate_blocked`
- create an internal note
- do not generate another report
- do not send another customer-facing report email automatically

## Email Actions

Use one customer-facing action per branch.

Booking branch:

- Send a short plain email with the AOH Talk booking link:
  `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- Add `aoh_campaign_booking_link_sent`
- Create/update opportunity

Beta branch:

- Send beta details or create a Sorter task if the beta copy is not approved.
- Add `aoh_campaign_beta_details_sent` only after the beta details are sent.

Report/details branch:

- Add report request/generator tags.
- Let the approved report delivery workflow send the report when ready.
- Do not add a second separate customer-facing report email from the router.

Unclear branch:

- Add `aoh_campaign_reply_needs_human`.
- Create Sorter task.
- Do not send report.
- Do not send booking link.

Opt-out branch:

- Respect unsubscribe/DND.
- Add `aoh_reply_optout`.
- Move opportunity to `Nurture / Closed`.
- Do not send any further marketing email.

### Reply Contains Report Intent

Examples:

- `send`
- `send it`
- `send please`
- `please send it`
- `report`

Actions:

- Stop normal no-reply follow-up for that contact.
- Add `aoh_campaign_reply`, `aoh_reply_send`, and
  `aoh_campaign_report_requested`.
- Update/create the opportunity in the matching Reach pipeline at `Warm Leads`.
- Trigger the correct campaign report path for the campaign lane.
- Send exactly one report delivery email.
- Do not duplicate report generation if the same contact replies again.

### Reply Contains Booking Intent

Examples:

- `book`
- `book a call`
- `send booking link`
- `calendar`
- `appointment`

Actions:

- Stop normal no-reply follow-up for that contact.
- Add `aoh_campaign_reply`, `aoh_reply_book`, and
  `aoh_campaign_booking_link_sent`.
- Send the AOH Talk booking link:
  `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- Update/create the opportunity in the matching Reach pipeline at `Warm Leads`.
- Create a Booker task if needed.
- Do not generate a report unless Mike explicitly approves that behavior.

### Reply Contains Beta Intent

Examples:

- `beta`
- `include me`
- `test group`
- `I will try it`

Actions:

- Stop normal no-reply follow-up for that contact.
- Add `aoh_campaign_reply`, `aoh_reply_beta`, and `aoh_campaign_beta`.
- Send beta details only if the beta email has passed Coach/Auditor review.
- Otherwise create a Sorter task.
- Do not generate a full report by default.

### Unclear Positive Reply

Examples:

- `what is this?`
- `tell me more`
- `how much?`
- `maybe`
- any reply that is not clearly report, booking, opt-out, or bad fit

Actions:

- Stop normal no-reply follow-up for that contact.
- Add `aoh_campaign_reply`, `aoh_reply_unclear`, and
  `aoh_campaign_reply_needs_human`.
- Create a Sorter task.
- Do not generate a report.
- Do not send the booking link automatically.

### Opt-Out Or Not Interested

Examples:

- `unsubscribe`
- `stop`
- `remove me`
- `not interested`
- `no thanks`

Actions:

- Respect DND/unsubscribe handling.
- Stop campaign follow-up.
- Add `aoh_campaign_reply` and `aoh_reply_optout`.
- Do not generate a report.
- Do not send a booking link.

## QA Before Publish

Test contacts must prove:

- `send` routes to report request and does not send booking-only copy.
- `send please` routes to report request.
- `book` routes to AOH Talk and does not generate a report.
- `send booking link` routes to AOH Talk.
- `beta` routes to the beta/testimonial lane and does not generate a report by
  default.
- `what is this?` creates a human-review task and no report.
- `how much?` creates a human-review or objection task and no report.
- `unsubscribe` stops follow-up and no report.
- `STOP` stops follow-up and no report.
- duplicate `send` does not create duplicate reports or duplicate emails.
- an existing website visitor report contact does not get duplicate delivery if
  they also reply to a campaign.

## Go/No-Go

Go for a tiny seeded pilot only after:

- reply routing logs are green
- send-domain/from address tests pass
- unsubscribe/DND tests pass
- merge fields render cleanly
- report/details copy comes from `docs/AOH_REACH_CAMPAIGN_COPY.md` or a
  Coach-approved variant
- no duplicate email delivery occurs
- report generation happens only after a warm signal

No-go for scaled sending until all items pass.
