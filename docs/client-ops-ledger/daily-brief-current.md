# Daily Agent Brief

Date: 2026-05-20
Prepared by: Chief of Staff

## 1. Needs Mike Today

| # | Decision | Recommendation | Risk | Approval needed |
|---|---|---|---|---|
| 1 | Whether to import or start a warmup campaign batch | Wait for GHL Expert to confirm each dedicated subdomain, then approve one small lane at a time | Warmup/domain readiness and live drip trigger risk | Mike approval required for import and separate approval required for start-drip |

## 2. Campaigns Being Prepared

| Campaign | Lane | Audience | Verified contacts from May 19 | Budget cap | Current status |
|---|---|---|---:|---:|---|
| Reviews | `reviews` | Pet boarding / Connecticut | 8 fresh verified | $2 | Waiting Sales Manager QA review and Reviews subdomain confirmation |
| AI Visibility | `ai` | Senior living / Connecticut | 6 fresh verified | $2 | Waiting Sales Manager QA review and AI subdomain confirmation |
| Relay | `relay` | Veterinary / Connecticut | 4 fresh verified | $2 | Waiting Sales Manager QA review and Relay subdomain confirmation |

## 3. Required Checks Before Any Live Action

| Check | Owner | Status |
|---|---|---|
| Confirm Reviews sending subdomain and daily send limit | GHL Expert | Waiting |
| Confirm AI Visibility sending subdomain and daily send limit | GHL Expert | Waiting |
| Confirm Relay sending subdomain and daily send limit | GHL Expert | Waiting |
| Confirm each start tag triggers only intended workflow | GHL Expert | API metadata passed; visual sender-domain check still required |
| Confirm no HighLevel AI feature is enabled | GHL Expert | Required before approval |
| Generate approval packet per lane | Chief of Staff | Ready after preflight |
| Review personal email / duplicate-contact QA flags | Sales Manager | Waiting |

GHL Expert read-only API result:

- Active GHL location confirmed: `tRbczwt6oJsXK4tjuzOI`
- Reviews domain from runbook: `mail.aioutsourcehubs.com`
- AI Visibility domain from runbook: `mail.getaioutsourcehub.com`
- Relay domain from runbook: `mail.myaioutsourcehub.com`
- Reach pipelines found for all three lanes
- `Warm Leads` stages found for all three lanes
- cold drip workflows found and published for all three lanes
- reply workflows found and published for all three lanes
- 17/17 campaign custom fields verified by API

Remaining GHL Expert visual checks:

- exact sender/from email inside each workflow email node
- sending domain warmup status inside GHL/email settings
- HighLevel AI feature toggles remain OFF

## 4. Fresh Prep Results

| Lane | Raw | Fresh after history/state filter | Verified | QA rows needing review | Approval packet |
|---|---:|---:|---:|---:|---|
| Reviews | 25 | 19 | 8 | 7 | `docs/client-ops-ledger/outbox/reach-reviews-approval-2026-05-20.md` |
| AI Visibility | 25 | 20 | 6 | 5 | `docs/client-ops-ledger/outbox/reach-ai-approval-2026-05-20.md` |
| Relay | 25 | 7 | 4 | 2 | `docs/client-ops-ledger/outbox/reach-relay-approval-2026-05-20.md` |

## 5. Tag Safety

| Lane | Import-only tags | Start-drip tags |
|---|---|---|
| Reviews | `aoh_campaign_reviews` + `aoh_campaign_reviews_imported` | `aoh_campaign_reviews` + `aoh_campaign_reviews_start` |
| AI Visibility | `aoh_campaign_ai_visibility` + `aoh_campaign_ai_imported` | `aoh_campaign_ai_visibility` + `aoh_campaign_ai_visibility_start` |
| Relay | `aoh_campaign_relay` + `aoh_campaign_relay_imported` | `aoh_campaign_relay` + `aoh_campaign_relay_start` |

## 6. Recommendation

Do not start all three live drips at once.

Recommended path:

1. Sales Manager reviews QA flags and removes questionable personal/duplicate contacts if needed.
2. GHL Expert completes visual sender-domain/warmup/AI-toggle checks in GHL.
3. Chief of Staff regenerates preflight packet for the final approved CSV.
4. Approve one lane import-only if the domain is still warming.
5. Approve one lane start-drip only when the lane's sending subdomain is confirmed ready.
6. Keep each first warmup batch to the lane's allowed daily send volume.

Current strongest lane by cleanliness: Relay, but only 4 verified contacts. Reviews has the most volume, but needs the most QA judgment.

## 7. Fresh Batch Prep Commands

These commands prepare files and approval packets only. They do not import contacts or start a drip.

Single-command prep:

```bash
npm run reach:prep -- --lane reviews --industry "pet boarding" --area "Connecticut" --state "Connecticut" --limit 25
```

Manual sequence:

```bash
npm run reach:launch -- --lane reviews --industry "pet boarding" --area "Connecticut" --limit 25 --out tmp-reach-reviews-next.json
npm run reach:csv -- --input tmp-reach-reviews-next.json --out tmp-reach-reviews-next-clean.csv
npm run reach:fresh -- --lane reviews --csv tmp-reach-reviews-next-clean.csv --out tmp-reach-reviews-next-fresh.csv --state "Connecticut"
npm run reach:verify -- --csv tmp-reach-reviews-next-fresh.csv --out tmp-reach-reviews-next-verified.csv
npm run reach:preflight -- --lane reviews --csv tmp-reach-reviews-next-verified.csv --report tmp-reach-reviews-next-verified-report.json
```

Repeat with `ai` / senior living and `relay` / veterinary after confirming the lane priority.

## 8. Approval Commands

```text
approve reviews import only
approve reviews start drip
approve ai import only
approve ai start drip
approve relay import only
approve relay start drip
pause all campaign live actions
```

## 9. Agent Command Surface

Wired locally today:

```bash
npm run agent:brief
npm run agent:command -- --command "Manager, status"
npm run agent:command -- --command "Manager, run Reach Cold Email Campaign"
npm run agent:command -- --command "GHL Expert, check Reach readiness"
npm run agent:command -- --command "Sales Manager, review Reach QA"
```

Slack posting is env-gated through `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`.

Default command channel: `#04-aoh-ops`.

Default daily campaign command: `Manager, run Reach Cold Email Campaign`.

The command center will not import contacts or start a drip unless a separate live execution guard is intentionally opened.
