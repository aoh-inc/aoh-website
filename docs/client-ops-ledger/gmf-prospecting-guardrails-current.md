# GMF Prospecting Guardrails

Date: 2026-05-29
Mode: read-only metrics review
Status: PASS

## Inputs

- Metrics CSV: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-metrics-template-2026-05-29.csv`
- Bounce pause threshold: 3.00%
- Spam complaint pause threshold: 0.10%
- Opt-out pause threshold: 4.00%

## Totals

| Metric | Count |
|---|---:|
| Sends | 0 |
| Clicks | 0 |
| Replies | 0 |
| Form fills | 0 |
| Purchases | 0 |
| Bounces | 0 |
| Spam complaints | 0 |
| Opt-outs | 0 |

## Subdomain Findings

| Name | Status | Sends | Bounce | Complaint | Opt-out | Reply quality | Reason |
|---|---|---:|---:|---:|---:|---:|---|
| unassigned | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |

## Niche Findings

| Name | Status | Sends | Bounce | Complaint | Opt-out | Reply quality | Reason |
|---|---|---:|---:|---:|---:|---:|---|
| dog grooming | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| dog daycare | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| dog boarding | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| dog training | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| mobile dog groomer | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| pet sitting | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| yoga studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| pilates studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| barre studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| martial arts school | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| dance studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| climbing gym | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| personal training studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| lash studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| brow studio | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| spray tan | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| massage therapy | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| esthetician | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| esthetics | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| tutoring center | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| music school | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| swim school | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| auto detailing | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| window tinting | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| event vendor | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |

## Segment Findings

| Name | Status | Sends | Bounce | Complaint | Opt-out | Reply quality | Reason |
|---|---|---:|---:|---:|---:|---:|---|
| very_few_reviews | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| behind_nearby_competitor | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| missing_hours_photos | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |
| weak_ai_search_readiness | PASS | 0 | 0.00% | 0.00% | 0.00% | 0.00% | none |

## Auto-Pause Recommendations

- None

## Outputs

- Pause CSV: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-pause-recommendations-2026-05-29.csv`
- Summary JSON: `C:\Users\micha\Documents\aoh-website\docs\client-ops-ledger\outbox\gmf-prospecting-guardrails-2026-05-29.json`

## Operating Rule

If any subdomain is HOLD, Sender pauses that subdomain before the next send window, Auditor reviews the cause, and Manager does not ask Mike unless the fix requires spend, legal/reputation judgment, account access, or final live-send approval.
