# Daily Agent Brief

Date: 2026-05-21
Prepared by: Manager

## 1. Needs Mike Today

| # | Decision | Recommendation | Risk | Approval needed |
|---|---|---|---|---|
| 1 | Normal Reach warmup | Auto mode is on. Reviews and AI Visibility started today. Relay is waiting for enough clean contacts and ready_for_drip=yes. | Relay only has 5 OK contacts and is not marked ready | No Mike action unless overriding auto |

## 2. Campaigns Being Prepared

| Campaign | Lane | Audience | Verified contacts from May 19 | Budget cap | Current status |
|---|---|---|---:|---:|---|
| Reviews | `reviews` | Pet boarding / Connecticut | 12 OK started | $2 | Auto warmup start executed |
| AI Visibility | `ai` | Senior living / Connecticut | 20 OK started | $2 | Auto warmup start executed |
| Relay | `relay` | Veterinary / Connecticut | 5 OK / 10 min | $2 | Auto waiting for refill and ready status |

## 3. Required Checks Before Any Live Action

| Check | Owner | Status |
|---|---|---|
| Confirm Reviews sending subdomain and daily send limit | GHL Expert | Waiting |
| Confirm AI Visibility sending subdomain and daily send limit | GHL Expert | Waiting |
| Confirm Relay sending subdomain and daily send limit | GHL Expert | Mike visually confirmed for import-only approval. Drip readiness still no |
| Confirm each start tag triggers only intended workflow | GHL Expert | API metadata passed; visual sender-domain check still required |
| Confirm no HighLevel AI feature is enabled | GHL Expert | Mike visually confirmed OFF for Relay import-only approval. Required again before start-drip |
| Generate approval packet per lane | Manager | Ready after preflight |
| Review personal email / duplicate-contact QA flags | Sales Manager | Relay resolved: 2 OK imported and 2 flagged rows held. Reviews and AI still waiting |

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
| Relay | 25 | 7 | 4 | 2 | 2 QA OK rows imported-only; 2 flagged rows held |

## 5. Tag Safety

| Lane | Import-only tags | Start-drip tags |
|---|---|---|
| Reviews | `aoh_campaign_reviews` + `aoh_campaign_reviews_imported` | `aoh_campaign_reviews` + `aoh_campaign_reviews_start` |
| AI Visibility | `aoh_campaign_ai_visibility` + `aoh_campaign_ai_imported` | `aoh_campaign_ai_visibility` + `aoh_campaign_ai_visibility_start` |
| Relay | `aoh_campaign_relay` + `aoh_campaign_relay_imported` | `aoh_campaign_relay` + `aoh_campaign_relay_start` |

## 6. Recommendation

Do not manually override auto.

Recommended path:

1. Let auto continue for Reviews and AI Visibility.
2. Refill Relay until it has at least 10 OK contacts.
3. Mark Relay `ready_for_drip=yes` only after the sending setup is checked.
4. Auto will start Relay when both conditions are true.
5. Keep HighLevel AI features OFF.

Current picture: Reviews and AI started today. Relay is the only holdout.

## 7. Fresh Batch Prep Commands

Normal daily run is auto:

```bash
npm run reach:warmup -- --lane all --execute auto
```

Prep commands below are for manual research or rebuilding a lane.

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

## 8. Manual Override Commands

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
npm run agent:command -- --command "Manager, list agents"
npm run agent:command -- --command "Manager, run Reach Cold Email Campaign"
npm run agent:command -- --command "GHL Expert, check Reach readiness"
npm run agent:command -- --command "Sales Manager, review Reach QA"
```

Slack posting is env-gated through `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`.

Default command channel: `#04-aoh-ops`.

Default daily campaign command: `Manager, run Reach Cold Email Campaign`.

Slack HTTP listener endpoint: `/api/agent/slack`.

Direct agent addressing is now expected in Slack, for example `Coach, review this copy` or `Reporter, verify report delivery status`.

Agents recognize Mike by Slack user ID and answer first-name by default. Add `formal` to a command when a formal response is wanted.

Slack speed mode is now expected: fast commands answer from the ledger/brief, while slower GHL or Reach checks acknowledge first and post the full result as a follow-up. Say `fresh` or `live` when a cached GHL readiness result is not acceptable.

The scheduled Reach Warmup Autopilot can import/start ready lanes inside guardrails. Manual overrides still need the live execution guard.
