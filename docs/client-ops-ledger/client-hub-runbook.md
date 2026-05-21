# Client Hub Runbook

Status: v1 live page
Last updated: 2026-05-21
Owner: Manager

## Purpose

The client hub is the simple client-facing page for setup and service status.

It should answer:

- what the client still needs to provide
- whether the service is running
- whether results/proof are available
- what is locked behind an upgrade

The client should not need to log into GHL for normal setup visibility.

Client-facing rule: do not list internal agent names on the client hub. Show
only what matters to the business owner. Lead with `Needed from you`, then
service status, then upgrade preview. Keep internal ownership, internal tools,
and completed setup clutter off the first screen.

## Live Routes

Client-zero:

```text
/client/ai-outsource-hub
```

Sample client shape:

```text
/client/abc-business
```

Both pages are `noindex`.

Customer upload route:

```text
/client/[slug]/customers
```

Private feedback route:

```text
/review/[slug]
```

## Standard Section

Every Review Automation client hub should show:

- recent customer/job list status
- Google access status only if it affects setup or launch
- this week's reviews vs weekly goal
- review requests sent
- response rate
- short tips only when reviews are behind goal
- action buttons for updating setup details or sending a file
- customer upload link for recent jobs/customers

This is the commercial standard service.

Do not show request rules, launch proof, screenshots, workflow wording, or
internal testing mechanics to clients. Those belong in Mission Control and the
agent runbooks.

## Custom / Upgrade Section

AI Visibility is shown as a locked preview unless the client buys it.

Locked preview can show:

- ChatGPT visibility
- review replies
- local ranking gaps
- competitor watch

Do not show real private ranking data or client-only analysis until the client is on AI Visibility or Mike approves.

## Prefill Rule

Do not ask clients to retype known signup data.

The page should prefill from:

- checkout/signup data
- GHL contact or opportunity fields
- intake form
- public website basics
- agent-collected public data

Ask the client only for missing or changeable items.

## Plain Customer System Question

Do not ask most owners for "CRM/POS" first.

Use:

```text
Where do you keep recent customers or jobs?
```

Good answer choices:

- spreadsheet
- email inbox
- phone/contact list
- booking software
- invoice/payment system
- CRM
- not sure

## Logo Rule

Agents should try easy public logo discovery first:

1. website favicon or apple-touch icon
2. website metadata or schema logo
3. OpenGraph image when clearly branded
4. client upload

Client upload wins if the auto-found logo is wrong.

## Internal Agent Ownership

Manager owns the client-facing summary.

Local Visibility Manager owns:

- Google Business Profile access
- profile gaps
- review link
- profile screenshots/proof

Reviews Manager owns:

- who receives review requests
- who should not receive them
- request timing
- customer/job list readiness

GHL Expert owns:

- HighLevel workflow setup only while GHL remains the bridge
- custom fields and tags that must be exported or translated
- sender checks for current GHL-backed campaigns
- workflow logs needed for proof/history
- HighLevel AI features OFF unless Mike manually authorizes otherwise

As AOH exits GHL, Systems Director and Website/Codex take over the AOH-owned
client record, intake packet, send log, suppression list, and recap path.

Systems Director owns:

- access risk
- missing env/config
- cost and failure watch
- privacy and protection gaps

## Client Protection

The v1 page is safe only because it uses sample/client-zero data.

Before real private client data goes on a hub:

- enable owner password or magic-link access
- do not expose customer lists publicly
- keep upload links secure
- keep GHL/webhook tokens out of the page
- keep pages `noindex`

Customer uploads:

- full customer rows are stored in Upstash Redis when
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured
- if Redis is not configured, full customer rows must go only to
  `AOH_REVIEW_AUTOMATION_WEBHOOK_URL`, `AOH_CLIENT_INTAKE_WEBHOOK_URL`, or
  another AOH-owned secure intake path
- Slack receives only counts and summary, not the full customer list
- rows missing email, duplicates, and do-not-contact matches are held back before
  Sender gets a sendable list
- if no AOH webhook is configured, the page may show a summary, but real customer
  outreach should wait until secure storage/intake is connected
- default event retention is 90 days; override with
  `AOH_REVIEW_AUTOMATION_STORAGE_TTL_DAYS`

Private feedback:

- 1-3 star feedback stays private for owner follow-up
- 4-5 star feedback can continue to the Google review link only after the
  client profile has a verified `googleReviewUrl`
- no feedback is published automatically

## Manager Slack Summary

When asked for client hub status, Manager should answer in owner language:

```text
Mike, the client hub leads with what the client still needs to do, then shows service status and the locked AI Visibility upgrade. It does not show internal agent names, internal tools, or completed setup clutter.
```
