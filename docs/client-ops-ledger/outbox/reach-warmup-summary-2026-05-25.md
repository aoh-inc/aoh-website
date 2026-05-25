# Reach Warmup Autopilot Summary

Date: 2026-05-25
Requested action: auto

| Lane | Status | Warmup day | Quota | Selected | Report |
|---|---|---:|---|---:|---|
| Reviews | blocked | 6 | 40-50 | 1 | reach-warmup-reviews-2026-05-25.md |
| AI Visibility | blocked | 6 | 40-50 | 1 | reach-warmup-ai-2026-05-25.md |
| Relay | blocked | 6 | 40-50 | 11 | reach-warmup-relay-2026-05-25.md |

## Guardrail Meaning

- The runner keeps refilling bad or risky emails until it reaches the daily quota or hits max attempts/scrape caps.
- It will not loop forever.
- It can call Outscraper automatically inside the configured scrape caps.
- It will not exceed the run-level Outscraper scrape cap across all lanes.
- It rotates through the configured search list so a stuck lane does not keep buying the same first searches.
- It subtracts prior same-day lane scraping before spending more.
- It will not reuse contacts already imported or started in prior GHL result files.
- It re-verifies the selected live-action CSV before import or start tags.
- Auto mode refills lanes while they are import-ready; start tags still require clean selected contacts.
- It will not start drip unless the lane is marked ready_for_drip=yes.
- HighLevel AI features must stay OFF.
