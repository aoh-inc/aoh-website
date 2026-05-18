# Prospecting Premium (PP) + GHL Wiring

This document is the exact wiring for AOH's PP flow now that GHL report URLs are exposed via workflow output (not API).

Read first:

- `docs/AOH_REPORT_FLOW_MAP.md`

Important distinction:

- `GHL_WEBSITE_REPORT_WEBHOOK_URL` is the website-to-GHL receiving endpoint for
  the public homepage report route.
- `GHL_CAMPAIGN_REPORT_WEBHOOK_URL` is the website-to-GHL receiving endpoint for
  warm campaign report requests after a prospect replies `send` or `book`, or
  after a manually approved campaign test.
- `GHL_WEBHOOK_URL` is only a legacy fallback.
- `https://aioutsourcehub.com/api/report/callback` is the GHL-to-website
  callback after a report is generated.
- A GHL trigger named "Marketing Audit Request Form" may be campaign-specific.
  Do not assume it receives public homepage visitor submissions without proof.
- Cold email campaigns are reply-first by default as of 2026-05-18. Direct
  personalized report links are a test variant only.

## Current public website flow (already implemented)

1. Visitor submits report form (`/api/report`).
2. Site creates `runId` + redirects user to `/report/ai-visibility?runId=...`.
3. Report page polls `/api/report/status?runId=...` and shows:
   - submitted
   - report_ready
   - heatmap_ready
4. GHL workflow should POST callbacks to `/api/report/callback` to mark readiness.

## Current campaign flow (active operating plan)

1. Sender emails a specific, low-friction first touch with a reply CTA:
   - reply `send` for the report
   - reply `book` for the booking link
2. Sorter or GHL automation classifies replies.
3. GHL Expert/Reporter generates or sends the report only after a warm signal.
4. Booker handles `book` replies and routes them to AOH Talk.
5. Auditor tracks cost per reply, report request, and booked call.

## Required env vars (Vercel)

- `GHL_WEBSITE_REPORT_WEBHOOK_URL` (public homepage report intake)
- `GHL_CAMPAIGN_REPORT_WEBHOOK_URL` (optional campaign report intake)
- `GHL_WEBHOOK_URL` (legacy fallback)
- `REPORT_CALLBACK_TOKEN` (new; any long random string)

## GHL workflow actions

Use your existing "Generate Marketing Audit Report" workflow action and map output fields.

### Action A: Report ready callback

- Method: `POST`
- URL: `https://aioutsourcehub.com/api/report/callback`
- Header:
  - `x-report-callback-token: <REPORT_CALLBACK_TOKEN>`
- JSON body:

```json
{
  "runId": "{{customField.runId}}",
  "event": "report_ready",
  "auditUrl": "{{workflow.generate_marketing_audit_report.generated_report_url}}"
}
```

### Action B: Heatmap ready callback (if/when available in your workflow)

- Method: `POST`
- URL: `https://aioutsourcehub.com/api/report/callback`
- Header:
  - `x-report-callback-token: <REPORT_CALLBACK_TOKEN>`
- JSON body:

```json
{
  "runId": "{{customField.runId}}",
  "event": "heatmap_ready",
  "heatmapUrl": "{{custom.heatmap_url}}"
}
```

If your workflow does not expose heatmap URL/timestamp yet, keep Action A only.

## Notes from GHL support that shape this design

- Generated report URL is available in workflow output.
- Generated report URL is currently not API retrievable.
- Report links are persistent (do not expire unless prospect deleted).
- Heatmap limits are separate from report generation limits.

## Operational checklist

1. Ensure workflow writes/stores `run_id` and `audit_url` custom fields.
   - Site already sends both in webhook payload as:
     - `runId`
     - `auditUrl`
     - `customField.runId`
     - `customField.auditUrl`
2. Trigger report generation action.
3. Send callback Action A.
4. (Optional) Send callback Action B when heatmap finishes.
5. Confirm `/api/report/status?runId=...` transitions correctly.

## Heatmap constraint (live account)

- Current max grid selectable in GHL Prospecting: `7 x 7`
- Coverage selector currently used in this account: `50 km`
- Automation should target `7 x 7` + `50 km` for consistency with available UI options.

## Internal nightly canary (automation)

For unattended nightly verification, website API supports token-gated Turnstile bypass on `/api/report`:

- Header: `x-report-test-bypass-token: <REPORT_TEST_BYPASS_TOKEN>`
- Env var (Vercel): `REPORT_TEST_BYPASS_TOKEN`

This is for internal automation only. Public form behavior remains Turnstile-protected.
