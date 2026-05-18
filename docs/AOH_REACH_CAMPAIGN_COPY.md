# AOH Reach Campaign Copy Drafts

Status: draft, not approved for scaled send
Owner: Sender
Reviewer: Coach + Auditor
Last updated: 2026-05-18

## Rules Before Use

- These are reply-first cold email drafts.
- Do not attach reports.
- Do not use direct report links unless Mike approves a controlled test.
- Do not send at scale until the Campaign Reply Router passes QA.
- Keep one offer per sender lane/domain.
- Include the correct physical mailing address and unsubscribe mechanism in the
  real GHL campaign.
- Use warmed/dedicated sending domains only.

## Reviews Lane

Offer:

- `$1` first month.
- Second `$1` month may be offered later only if the business is happy and
  willing to do a short testimonial or case study.

Subject options:

- quick review idea
- Google reviews for {{contact.company_name}}
- simple review push
- $1 review test

First email:

```text
Hi {{contact.first_name}},

Quick idea for {{contact.company_name}}.

Recent Google reviews are one of the easiest local trust signals to improve, but most teams do not have time to chase them manually.

I am running a small $1 first-month review push for local businesses. We help request more Google reviews without adding work for your team.

Worth sending the short details?

Reply send and I will send them over.

Mike
AI Outsource Hub
```

Follow-up 1:

```text
Hi {{contact.first_name}},

Should I send the $1 review push details for {{contact.company_name}}?

The idea is simple: make it easier for happy customers to leave a Google review, then keep the process running in the background.

Reply send and I will send the short version.

Mike
```

Follow-up 2:

```text
Hi {{contact.first_name}},

Last note from me.

If recent Google reviews are already handled at {{contact.company_name}}, no worries.

If not, I can send the $1 first-month review setup details.

Reply send if you want them, or book if you would rather talk it through.

Mike
```

## AI Visibility Lane

Offer:

- Free AI Visibility snapshot/report after warm reply.
- No `$1` framing.
- No guaranteed rankings.

Subject options:

- AI search question
- visibility check for {{contact.company_name}}
- quick local search question
- is {{contact.company_name}} showing up?

First email:

```text
Hi {{contact.first_name}},

Quick question for {{contact.company_name}}.

When someone asks ChatGPT, Gemini, Google AI, or Maps who to hire locally, are you confident your business shows up the way it should?

I am putting together a few free AI visibility snapshots for local businesses. It looks at public trust signals like reviews, profile strength, business info consistency, and local visibility.

Want me to send one for {{contact.company_name}}?

Reply send and I will queue it.

Mike
AI Outsource Hub
```

Follow-up 1:

```text
Hi {{contact.first_name}},

Should I send the AI visibility snapshot for {{contact.company_name}}?

It is not a rankings guarantee. It is a quick look at whether the public signals around the business make it easy for AI/search tools to understand and recommend you.

Reply send if you want me to queue it.

Mike
```

Follow-up 2:

```text
Hi {{contact.first_name}},

Closing the loop.

If AI search visibility is not a priority right now, no problem.

If you want the snapshot, reply send. If you want to talk through what it means, reply book.

Mike
```

## Beta / Testimonial Lane

Offer:

- Small test group only.
- Honest feedback requested.
- Testimonial or case study requested only if they are happy.

Subject options:

- small beta invite
- beta review setup
- feedback request
- local business beta

First email:

```text
Hi {{contact.first_name}},

I am opening a small beta for a review system we are testing with local businesses.

The goal is simple: help turn more happy customers into Google reviews without giving your team another task.

For the beta, I am offering the first month for $1. If it helps and you are happy with the process, I may ask for honest feedback or a short testimonial.

Open to being one of the beta businesses?

Reply beta and I will send the details.

Mike
AI Outsource Hub
```

Follow-up 1:

```text
Hi {{contact.first_name}},

Should I include {{contact.company_name}} in the small review beta?

It is meant to be low-friction: we help with review requests, you tell us what felt useful or annoying, and if it works well we may ask for feedback.

Reply beta if you want the details.

Mike
```

Follow-up 2:

```text
Hi {{contact.first_name}},

Last check on the beta invite.

If getting more recent Google reviews is already handled, no worries.

If you want to try the $1 first-month beta, reply beta and I will send the short version.

Mike
```

## Reply Routing

- `send` means interested in report/details.
- `book` means booking intent and should receive the AOH Talk link.
- `beta` means interested in the beta/testimonial lane.
- unclear positive replies go to Sorter/human review.
- unsubscribe, stop, remove me, no thanks, not interested, and wrong person must
  suppress safely before any other automation.

## Auditor Checks

- merge fields render for blank first name and blank company name
- footer and unsubscribe render
- from name and from email match the warmed sender domain
- no AI guarantees
- no broad `$1 for first 2 months` headline
- reply keywords match the Campaign Reply Router
- test replies create the right tags, opportunities, and suppressions
