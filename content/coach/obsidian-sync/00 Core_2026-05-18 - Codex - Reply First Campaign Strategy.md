# 2026-05-18 - Codex - Reply-First Campaign Strategy

Status: active source-of-truth update
Owner: Manager
Reviewer: Auditor

## Decision

AOH outbound email campaigns are reply-first by default.

Default first-touch CTAs:

- Reply `send` and AOH sends or generates the relevant report.
- Reply `book` and AOH sends the AOH Talk booking link / routes to Booker.

Direct personalized report links are no longer the default campaign journey.
They remain a controlled test variant only.

## Why

The prior plan was cold email -> personalized report link -> instant report.
That may still be useful as a test, but it creates concerns around cold-link
trust, deliverability, tracking-link risk, and the cost of generating full
reports for prospects who never show intent.

Reply-first gives AOH:

- better deliverability signals
- lower perceived spam risk
- a clean warm signal before report spend
- simpler follow-up routing for Booker and Sorter
- better cost accounting: cost per reply, cost per report requested, cost per
  booked call

## Journeys

### Campaign Prospect

1. Scout builds and cheaply prefilters the list.
2. Sender sends a short, specific email.
3. Prospect replies `send` or `book`.
4. Sorter/GHL classifies the reply.
5. `send` -> GHL Expert/Reporter generates or sends the report.
6. `book` -> Booker sends/routes to AOH Talk.
7. Auditor tracks cost per reply, report request, and booked call.

### Website Visitor

1. Visitor fills the homepage report form.
2. Website validates email, business name, bot/honeypot, Turnstile if enabled,
   rate limit, and duplicate request limit.
3. Website sends the request to the website-report GHL workflow.
4. Visitor sees the report-ready/email flow.

## Agent Assignments

- Manager: identifies lane and assigns owner/reviewer before work starts.
- Scout: builds lists and cheap prefilters. Does not trigger full report spend.
- Sender: writes reply-first campaign copy.
- Coach: reviews tone, offer clarity, and objections.
- Sorter: classifies `send`, `book`, interested, objection, unsubscribe, and bad
  fit replies.
- GHL Expert: builds website report workflow and campaign reply-to-report /
  reply-to-book workflow.
- Booker: owns `book` replies and AOH Talk handoff.
- Reporter: generates/sends reports after warm signal.
- Auditor: reviews launch safety and cost metrics.

## Supersedes

This supersedes the 2026-04-30 "personalized token URL" funnel as the default.
That direct-link flow is now Variant B / test-only.
