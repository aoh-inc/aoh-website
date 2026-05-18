# Prospecting Premium (PP) + GHL Wiring

This document is the exact wiring for AOH's PP flow now that GHL report URLs are exposed via workflow output (not API).

Read first:

- `docs/AOH_REPORT_FLOW_MAP.md`

Important distinction:

- HighLevel target location must be verified before any workflow work. Do not point
  report-flow agents at `AOH Client Template Lab` unless the task is explicitly
  about templates, snapshots, reusable fields, or draft workflow QA. Public
  website report intake and campaign reply routing are live AOH/Hub360AI
  production-location concerns.
- `GHL_WEBSITE_REPORT_WEBHOOK_URL` is the website-to-GHL receiving endpoint for
  the public homepage report route.
- `GHL_CAMPAIGN_REPORT_WEBHOOK_URL` is the website-to-GHL receiving endpoint for
  warm campaign report requests after a prospect replies `send` or `book`, or
  after a manually approved campaign test.
- `GHL_WEBHOOK_URL` is only a legacy fallback.
- If no report webhook URL is configured, `/api/report` can use
  `GHL_PIT_TOKEN` + `GHL_LOCATION_ID` to create/update the GHL contact and add
  the `aoh_website_report_requested` tag. This avoids HighLevel's premium
  Inbound Webhook trigger for the website visitor lane.
- `https://aioutsourcehub.com/api/report/callback` is the GHL-to-website
  callback after a report is generated.
- A GHL trigger named "Marketing Audit Request Form" may be campaign-specific.
  Do not assume it receives public homepage visitor submissions without proof.
- Cold email campaigns are reply-first by default as of 2026-05-18. Direct
  personalized report links are a test variant only.

## Current public website flow (already implemented)

1. Visitor submits report form (`/api/report`).
2. Site creates `runId` + redirects user to the matching report page.
3. If a report webhook URL exists, the site posts the request to that webhook.
4. If no report webhook URL exists, the site creates/updates the GHL contact,
   writes existing report custom fields, and adds:
   - `aoh_website_report_requested`
   - `aoh_report_requested`
   - `aoh_generate_marketing_report` for marketing reports
   - `aoh_generate_ai_visibility_report` for AI visibility reports
   - both generator tags when the visitor requested both reports
   - `aoh_secondary_report_requested` when both reports were requested
5. Report page polls `/api/report/status?runId=...` and shows:
   - submitted
   - report_ready
   - heatmap_ready
6. GHL workflow should POST callbacks to `/api/report/callback` to mark readiness.

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
- `GHL_PIT_TOKEN` + `GHL_LOCATION_ID` (required if using API tag handoff
  instead of a report webhook URL)

## Website lane no-premium trigger option

Recommended while proving the flow:

1. Website `/api/report` creates/updates the GHL contact through the
   LeadConnector Contacts API.
2. Website writes these existing custom fields:
   - `Audit Report ID` (`contact.audit_report_id`) = `runId`
   - `Audit Report URL` (`contact.audit_url`) = website report URL
   - `Report Type Requested` (`contact.report_type_requested`)
   - `Lead Source` (`contact.lead_source`)
   - `website_source` (`contact.website_source`)
   - `campaign_source` (`contact.campaign_source`)
   - `Offer Lane` (`contact.offer_lane`)
3. Website adds the `aoh_website_report_requested` tag.
4. GHL intake/visibility workflow triggers are `Contact Tag` added:
   - `aoh_website_report_requested`
   - `aoh_generate_marketing_report`
   - `aoh_generate_ai_visibility_report`

This replaces the need for a premium Inbound Webhook trigger for homepage
visitor requests.

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
