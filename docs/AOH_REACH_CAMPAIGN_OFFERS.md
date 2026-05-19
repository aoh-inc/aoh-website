# AOH Reach Campaign Offers

Status: controlled launch
Owner: Manager
Specialists: Sender, Coach, Scout, GHL Expert
Reviewer: Auditor
Last updated: 2026-05-19

## Decision

Today can be a controlled pilot day, not a scaled-send day.

The website visitor report lane is live and tested. Campaign traffic remains
reply-first: prospects raise their hand before AOH sends details, generates a
report, or spends on deeper analysis.

Default CTA:

- reply `send`

Safety handling:

- reply `book` sends the AOH Talk booking link
- unclear replies go to human review
- STOP, unsubscribe, remove me, no thanks, and not interested suppress safely

Do not send prospects directly to generated report links as the cold email CTA.

## Lane 1: Reviews Special

Domain:

- `mail.aioutsourcehubs.com`

Purpose:

- Sell the easiest first offer: Review Automation.
- Use reviews as the trust-building entry point before AI Visibility.

Recommended offer:

- First month for `$1`.
- A second `$1` month may be offered only as a controlled testimonial/case study
  condition after the business is happy with the work.

Avoid:

- Do not broadly headline `$1 for first 2 months`.
- Do not make the market believe the full Review Automation service is a cheap
  commodity.

Positioning:

- More recent Google reviews without adding work for the team.
- Easy setup.
- Progress compounds over a couple of months.
- Later upgrade path: AI Visibility.

Primary CTA:

- Reply `send` and I will send the short report/details.

## Lane 2: AI Visibility

Domain:

- `mail.getaioutsourcehub.com`

Purpose:

- Create curiosity and premium positioning around AI/local discovery.
- Protect AI Visibility from being treated like a discount offer.

Recommended offer:

- Free AI Visibility snapshot or report after a warm reply.

Avoid:

- No `$1` framing.
- No guaranteed rankings.
- No overpromising ChatGPT, Gemini, or Google AI outcomes.

Positioning:

- When customers ask AI/search tools who to hire locally, the business may or may
  not show up.
- AOH checks the public trust and visibility signals that influence whether the
  business is easy to recommend.

Primary CTA:

- Reply `send` and I will send the snapshot.

## Lane 3: Relay

Domain:

- `mail.myaioutsourcehub.com`

Purpose:

- Test missed-call / AI receptionist demand without needing a prebuilt report.
- Use a simple calculator/details delivery after warm reply.

Recommended offer:

- Missed-call estimate or calculator after a `send` reply.
- Quick walkthrough if the math makes sense for the business.

Avoid:

- Do not imply AOH knows the prospect's exact missed-call rate.
- Do not overstate revenue recovery.
- Do not use a fake per-prospect report URL.

Positioning:

- Missed calls are hidden revenue leakage.
- Relay helps local businesses respond when calls are missed after hours or
  during jobs.

Primary CTA:

- Reply `send` and I will send the estimate/details.

## Hard Gates Before Sending

No scaled campaign send until all of these are true:

- `send` reply generates or queues exactly one appropriate delivery.
- duplicate `send` replies do not create duplicate report jobs or duplicate
  emails.
- `book` reply sends the approved AOH Talk booking link:
  `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- unclear positive replies create a Sorter/human task and do not spend on full
  reports.
- STOP, unsubscribe, remove me, wrong person, and not interested replies are
  suppressed safely.
- Reviews, AI Visibility, and Relay are tested separately.
- campaign copy keeps Reviews, AI Visibility, and Relay promises separate.
- daily send caps are set per domain/mailbox.
- someone owns the first-hour watch.

## Mission Control Must Show

- campaign status: Draft, QA, Armed, Live, or Paused
- domain/mailbox for each lane
- daily send cap per lane
- live offer version
- CTA keyword routes: `send`, `book`, unclear, unsubscribe
- report generation count by campaign
- duplicate-prevention status
- booking link used
- suppression count and latest suppression test
- human review queue for unclear replies
- failure log for report, email, router, and duplicate-block issues
- first-hour watch owner
- emergency pause owner/process

## Team Ownership

- Manager owns the go/no-go call.
- Sender owns copy and sender-lane setup.
- Coach reviews offer truth, voice, and merge-field safety.
- Scout owns list selection and cheap prefiltering.
- GHL Expert owns reply router, tags, opportunities, and workflow proof.
- Sorter owns unclear replies and human review queue.
- Booker owns the AOH Talk booking handoff.
- Auditor owns QA, suppression tests, duplicate-prevention proof, and first-hour
  watch readiness.
