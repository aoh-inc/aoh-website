# Prospecting Premium (PP) + GHL Wiring

This document is the exact wiring for AOH's PP flow now that GHL report URLs are exposed via workflow output (not API).

## Current site flow (already implemented)

1. Visitor submits report form (`/api/report`).
2. Site creates `runId` + redirects user to `/report/ai-visibility?runId=...`.
3. Report page polls `/api/report/status?runId=...` and shows:
   - submitted
   - report_ready
   - heatmap_ready
4. GHL workflow should POST callbacks to `/api/report/callback` to mark readiness.

## Required env vars (Vercel)

- `GHL_WEBHOOK_URL` (already used)
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
