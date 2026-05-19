# AOH Reach Campaign Copy Drafts

Status: controlled-pilot copy, not approved for scaled send
Owner: Sender
Reviewer: Coach + Auditor
Last updated: 2026-05-19

## Rules Before Use

- Reply-first. No price in Email 1. No product pitch in Email 1.
- Email 1 job: get the `send` reply only.
- Price and product explanation live in report delivery email only.
- No links in Email 1, 2, or 3. Links only in report delivery after reply.
- No `{{contact.first_name}}`; OutScraper does not pull owner name from Google Maps.
- Do not broadly headline `$1 for first 2 months`; second `$1` month is conditional on testimonial only.
- No guaranteed rankings or AI citation promises.
- Include physical mailing address and unsubscribe in every email footer.
- GHL unsubscribe/footer must stay enabled; the plain "Reply stop" footer is not a replacement for platform unsubscribe handling.
- Use warmed sending domains only. One domain per lane.

## Sending Guidance

- Today is a controlled pilot, not a scaled send.
- Dedicated domain warmup ladder, per sending domain:
  - Days 1-3: `10-20` emails/day
  - Days 4-6: `40-50` emails/day
  - Days 7-9: `80-100` emails/day
  - After Day 9: check warmup level, bounces, spam placement, replies,
    unsubscribes, complaints, and workflow logs before increasing again.
- Start Reviews first unless Manager/Auditor approve a different lane.
- Cold Emails 1-3 should have no links, no images, no buttons, and no attachments.
- Avoid competitor names in subject lines.
- Avoid "free" in subject lines.
- Keep copy plain and short.
- Preview merge fields before sending.
- Watch bounces, spam placement, replies, unsubscribes, and workflow routing before increasing volume.
- Full launch runbook: `docs/AOH_REACH_LAUNCH_RUNBOOK.md`.

## Reply Routing

- `send` triggers report/details delivery email for that lane
- `book` sends `{{custom_values.aoh_discovery_calendar_link}}`
- unclear positive goes to human review queue, no automation
- STOP / unsubscribe / remove me / not interested / wrong person suppress immediately

---

## Campaign 1 - Review Automation

Domain: `mail.aioutsourcehubs.com`
Offer in report delivery only: First month `$1`, then `$49/mo`, no setup, cancel anytime

### Email 1 - Day 0

```text
Subject: quick scan on {{contact.company_name}}

I pulled a quick public snapshot for {{contact.company_name}}.

You have {{contact.prospect_review_count}} Google reviews at {{contact.prospect_rating}} stars. That is usually enough to spot whether reviews are helping you win locally or quietly holding you back.

If you want, reply `send` and I will send over the quick review-growth audit.

Mike
AI Outsource Hub - 877-521-2224
```

### Email 2 - Day 3

```text
Subject: re: {{contact.company_name}}

Still happy to send what I found on {{contact.company_name}}.

The main thing I look for is whether recent reviews are keeping pace with the businesses showing up around you. When review momentum slows down, it can cost rankings quietly.

If you want the details, reply `send` and I will send them over.

Mike
```

### Email 3 - Day 10

```text
Subject: closing the loop

Last note from me on {{contact.company_name}}.

If reviews are not a focus right now, no problem. If the timing gets better, reply `send` and I will send what I found.

Mike
```

### Report Delivery - fires after `send` reply

```text
Subject: re: {{contact.company_name}} scan

Here is what I found: {{contact.report_url}}

The scan shows where {{contact.company_name}} may be losing local trust signals and what I would fix first.

I would start with automated review requests after every completed job, so happy customers are asked while the job is still fresh. First month is $1, then $49/mo. No setup, cancel anytime.

Worth 10 minutes to walk through what we would fix first?

Mike
AI Outsource Hub - 877-521-2224
```

---

## Campaign 2 - AI Visibility

Domain: `mail.getaioutsourcehub.com`
Offer in report delivery only: Free AI Visibility snapshot; setup-fee discount is a sales-call lever only

### Email 1 - Day 0

```text
Subject: when customers ask AI who to hire

More customers are starting to ask ChatGPT and Google AI who they should hire locally.

For businesses like {{contact.company_name}}, the early window matters. The companies that show up first in these answers may get a head start before everyone else catches on.

I can send over a quick check showing how {{contact.company_name}} looks when someone asks AI who to hire in {{contact.city}}.

Reply `send` and I will send it over.

Mike
AI Outsource Hub - 877-521-2224
```

### Email 2 - Day 3

```text
Subject: your competitors may not be watching this yet

Most local business owners still focus on Google rankings, reviews, and getting more calls.

That still matters.

But customers are now also asking AI questions like "who is the best {{contact.niche_vertical}} near me?" before they ever call anyone.

I am checking which local businesses are already getting mentioned and which ones are missing.

Reply `send` and I will send the quick results for {{contact.company_name}}.

Mike
```

### Email 3 - Day 10

```text
Subject: before this gets crowded

This is still early, but it probably will not stay that way.

Local customers are beginning to use ChatGPT and Google AI to decide who to call, who looks trusted, and who shows up as a good option nearby.

Getting ahead now could be easier than trying to catch up later after competitors notice.

Reply `send` and I will send a simple snapshot of where {{contact.company_name}} stands.

Mike
```

### Report Delivery - fires after `send` reply

```text
Subject: quick AI visibility check for {{contact.company_name}}

Here is the quick check for {{contact.company_name}}:
{{contact.report_url}}

It shows how {{contact.company_name}} looks when people ask ChatGPT or Google AI about local {{contact.niche_vertical}} options in {{contact.city}}.

No one can guarantee placement in AI answers, but there are clear ways to improve the chances that a local business is understood, trusted, and considered when people ask who to hire.

Worth a 10-minute walkthrough?

Mike
AI Outsource Hub - 877-521-2224
```

---

## Campaign 3 - Relay

Domain: `mail.myaioutsourcehub.com`
Offer in report delivery only: ROI calculator + product explanation

### Email 1 - Day 0

```text
Subject: missed calls - {{contact.company_name}}

The calls {{contact.company_name}} misses don't go to voicemail. They go to the next {{contact.niche_vertical}} in Google.

Our Relay system handles calls when no one answers - in your company voice.

One recovered job covers the monthly cost. Most break even in month one.

Worth a quick call to run the numbers for {{contact.company_name}}?

Mike
AI Outsource Hub - 877-521-2224
```

### Email 2 - Day 3

```text
Subject: re: {{contact.company_name}}

Still happy to send the missed-call estimate for {{contact.company_name}}.

Even a few missed calls a month can turn into real lost revenue. It usually comes down to average job value, weekly call volume, and how often calls go unanswered.

If you want to see the math, reply `send` and I will send it over.

Mike
```

### Email 3 - Day 10

```text
Subject: last note

Not going to keep nudging on {{contact.company_name}}.

If missed calls become worth solving, reply `send` and I will send the breakdown.

Mike
```

### Report Delivery - fires after `send` reply

```text
Subject: re: {{contact.company_name}} missed-call estimate

Here is the calculator: https://aioutsourcehub.com/calculator

For a {{contact.niche_vertical}} handling 15-20 calls a week, missing 20% after hours is typically 3-5 jobs a month going to whoever picks up.

Relay answers calls in your company voice, qualifies the lead, and can book straight into your calendar - 24/7. If one extra job is worth more than the monthly cost, the math can work fast.

Worth 10 minutes?

Mike
AI Outsource Hub - 877-521-2224
```

---

## Auditor Checks Before Any Send

- merge fields render correctly for blank city, blank competitor, blank review count
- footer with unsubscribe and physical address renders in all emails
- from name and from email match the warmed sender domain for that lane
- no price or product pitch appears in Email 1, 2, or 3
- no links appear in Email 1, 2, or 3
- report delivery fires exactly once per `send` reply; no duplicates
- `book` reply sends `{{custom_values.aoh_discovery_calendar_link}}`
- suppression keywords trigger immediate suppress with no further sends
- daily send caps set per domain before arming
