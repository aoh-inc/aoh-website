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

## Hard Rules

- Do not use `AOH Client Template Lab` for this live campaign work.
- Do not enable HighLevel AI features.
- Do not pre-generate full reports for the cold list.
- Do not use direct report links as the default CTA.
- Do not publish scaled send until Auditor signs off.

## Router Behavior

### Reply Contains Report Intent

Examples:

- `send`
- `send it`
- `send please`
- `please send it`
- `report`

Actions:

- Stop normal no-reply follow-up for that contact.
- Add a campaign report-request tag.
- Update the opportunity to a report-requested or warm stage.
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
- Add a booking-intent tag.
- Send the AOH Talk booking link:
  `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- Update the opportunity to a booking-requested or warm stage.
- Create a Booker task if needed.
- Do not generate a report unless Mike explicitly approves that behavior.

### Unclear Positive Reply

Examples:

- `what is this?`
- `tell me more`
- `how much?`
- `maybe`
- any reply that is not clearly report, booking, opt-out, or bad fit

Actions:

- Stop normal no-reply follow-up for that contact.
- Add a needs-review tag.
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
- Add an opt-out or not-interested tag.
- Do not generate a report.
- Do not send a booking link.

## QA Before Publish

Test contacts must prove:

- `send` routes to report request and does not send booking-only copy.
- `send please` routes to report request.
- `book` routes to AOH Talk and does not generate a report.
- `send booking link` routes to AOH Talk.
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
- no duplicate email delivery occurs
- report generation happens only after a warm signal

No-go for scaled sending until all items pass.
