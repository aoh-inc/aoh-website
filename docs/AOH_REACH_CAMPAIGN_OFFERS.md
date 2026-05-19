# AOH Reach Campaign Offers

Status: draft for controlled launch
Owner: Manager
Specialists: Sender, Coach, Scout, GHL Expert
Reviewer: Auditor
Last updated: 2026-05-18

## Decision

Do not treat tomorrow as a scaled send day.

The campaign can move forward only as a controlled launch after the Campaign
Reply Router passes QA. The website visitor report lane is live and tested, but
outbound replies still need their own routing proof before volume.

Default CTA remains reply-first:

- reply `send` for the report/details
- reply `book` for the AOH Talk booking link
- reply `beta` for the small beta/testimonial lane

Do not send prospects directly to generated report links as the default.

## Lane 1: Reviews Special

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

Secondary CTA:

- Reply `book` if you want to talk through setup.

Domain plan:

- Use the main reviews sender lane/domain.
- Keep volume low until replies, deliverability, and router handling are stable.

## Lane 2: AI Visibility

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

Secondary CTA:

- Reply `book` and I will send a time to review it together.

Domain plan:

- Use the AI Visibility sender lane/domain.
- Start smaller than Reviews because the offer is more consultative.

## Lane 3: Beta / Testimonial

Purpose:

- Use the third warmed/burner domain for a small, honest beta/testimonial lane.
- Learn from real replies without risking the main offer positioning.

Recommended offer:

- A few local businesses can try the review system at a special beta rate in
  exchange for honest feedback.
- A testimonial or case study can be requested only if they are happy with the
  work.

Avoid:

- Do not use this as a scale channel.
- Do not require a positive testimonial.
- Do not mix beta copy with the main Reviews or AI Visibility lane.

Primary CTA:

- Reply `beta` if you want me to include you.

Domain plan:

- Keep this lane intentionally tiny.
- Auditor watches reply quality before any expansion.

## Hard Gates Before Sending

No scaled campaign send until all of these are true:

- `send` reply generates or queues exactly one appropriate report/delivery.
- the GHL Customer Replied workflow sends `contactId`, `replyText`, and
  `campaignLane` to `https://aioutsourcehub.com/api/campaign/reply-router` with
  the protected router token.
- duplicate `send` replies do not create duplicate report jobs.
- `book` reply sends the approved AOH Talk booking link:
  `https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY`
- the `book` path is explicitly approved for whether it also queues a report or
  waits for the meeting.
- `beta` reply routes to the beta/testimonial lane and does not generate a full
  report by default.
- unclear positive replies create a Sorter/human task and do not spend on full
  reports.
- STOP, unsubscribe, remove me, wrong person, and not interested replies are
  suppressed safely.
- Reviews and AI Visibility are tested separately.
- campaign copy keeps Reviews, AI Visibility, and Beta promises separate.
- daily send caps are set per domain/mailbox.
- someone owns the first-hour watch.

## Mission Control Must Show

- campaign status: Draft, QA, Armed, Live, or Paused
- domain/mailbox for each lane
- daily send cap per lane
- live offer version
- CTA keyword routes: `send`, `book`, `beta`, unclear, unsubscribe
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
