# Reach Campaign Agent Runbook

## Purpose

This runbook defines how agents prepare and run AOH Reach email campaigns without freewheeling through GHL, credits, or live outreach.

Do not use this runbook to launch a campaign without approval. It exists to make the agent process safe, cheap, repeatable, and auditable.

## Campaign Lanes

The current launcher supports:

| Lane | Meaning | Campaign tag | Import-only tag | Live start tag |
|---|---|---|---|---|
| `reviews` | Review Automation campaign | `aoh_campaign_reviews` | `aoh_campaign_reviews_imported` | `aoh_campaign_reviews_start` |
| `ai` | AI Visibility campaign | `aoh_campaign_ai_visibility` | `aoh_campaign_ai_imported` | `aoh_campaign_ai_visibility_start` |
| `relay` | Relay / missed-call recovery campaign | `aoh_campaign_relay` | `aoh_campaign_relay_imported` | `aoh_campaign_relay_start` |

Tag behavior:

- Import-only runs add the campaign tag and the import-only tag.
- Drip-start runs add the campaign tag and the live start tag.
- The live start tag is the trigger-sensitive tag. Treat it as a separate approval gate.
- Approval for import-only does not approve the live start tag.

## Agent Responsibilities

| Role | Responsibility |
|---|---|
| Manager | Creates the campaign job, assigns agents, watches budget/status, prepares the approval packet, and escalates blockers |
| Sales Manager | Owns campaign strategy, target niche, offer lane, and go/no-go recommendation |
| Scout | Finds prospects, removes obvious bad fits, notes fit signals |
| Sender | Cleans CSVs, checks merge fields, verifies emails, prepares import file |
| Coach | Reviews copy, claims, tone, and objection-sensitive wording |
| GHL Expert | Confirms fields, tags, workflow behavior, start tag, and GHL safety |
| Systems Director | Confirms model/cost routing, tool access, and technical risk |
| Sorter | Classifies replies after launch |
| Booker | Handles booking-ready replies |
| Reporter | Summarizes results and proof after the campaign step |
| Mike | Approves import, drip start, risky changes, and budget increases |

## Job Lifecycle

```text
detected -> recommended -> waiting_approval -> approved -> assigned -> in_progress -> done -> logged
```

Campaigns have two separate live-action approval gates:

1. import contacts into GHL
2. start outreach drip

Import approval does not imply drip-start approval.

## Job Ticket Template

```text
Job name:
Requested by:
Campaign lane: reviews | ai | relay
Target niche:
Target geography:
Raw prospect target:
Desired verified contact count:
Budget cap:
Default model tier:
Allowed escalation tier:
Source: scrape | existing CSV | manual list
Approval requested: prep only | import only | import + start drip
Human owner:
Due date:
Notes:
```

## Stage 1 - Campaign Recommendation

Owner: Manager and Sales Manager

Inputs:

- target niche
- target geography
- campaign lane
- reason this audience is worth testing
- budget cap
- desired batch size

Outputs:

- campaign job ticket
- initial risk level
- assigned agents

Allowed without Mike approval:

- creating a recommendation
- assigning agents to research/prep
- estimating cost

Not allowed without Mike approval:

- importing contacts
- starting drips
- changing live workflows

## Stage 2 - List Build

Owner: Scout

Scout may:

- scrape or collect prospects
- remove obvious irrelevant businesses
- dedupe obvious duplicates
- add fit notes
- save a raw or clean candidate CSV

Scout may not:

- import contacts into GHL
- send messages
- start workflows

Recommended model tier:

- Tier 0 for deterministic cleanup
- Tier 1 for obvious fit/bad-fit classification

## Stage 3 - Sender Prep

Owner: Sender

Sender prepares the campaign file:

- normalize columns
- check required fields
- dedupe by email
- run email verification
- remove invalid, unknown, catch-all unless approved
- prepare verified CSV
- produce a short prep report

Fresh batch prep sequence:

```bash
npm run reach:launch -- --lane LANE --industry "TARGET NICHE" --area "TARGET AREA" --limit N --out tmp-reach-LANE-next.json
npm run reach:csv -- --input tmp-reach-LANE-next.json --out tmp-reach-LANE-next-clean.csv
npm run reach:fresh -- --lane LANE --csv tmp-reach-LANE-next-clean.csv --out tmp-reach-LANE-next-fresh.csv --state "TARGET STATE"
npm run reach:verify -- --csv tmp-reach-LANE-next-fresh.csv --out tmp-reach-LANE-next-verified.csv
npm run reach:quality -- --lane LANE --csv tmp-reach-LANE-next-verified.csv
npm run reach:preflight -- --lane LANE --csv tmp-reach-LANE-next-verified.csv --report tmp-reach-LANE-next-verified-report.json
```

This sequence does not import contacts or start a drip. The first command scrapes/prepares prospects; the last command generates an approval packet.

One-command prep helper:

```bash
npm run reach:prep -- --lane LANE --industry "TARGET NICHE" --area "TARGET AREA" --state "TARGET STATE" --limit N
```

Add `--verify` only when Sender is ready to spend verification credits:

```bash
npm run reach:prep -- --lane LANE --industry "TARGET NICHE" --area "TARGET AREA" --state "TARGET STATE" --limit N --verify
```

The prep helper has no GHL import or drip-start path.

Recommended commands:

```bash
npm run reach:verify -- --csv tmp-reach-LANE-clean.csv
npm run reach:verify -- --provider hunter --csv tmp-reach-LANE-clean.csv
```

Sender may not:

- use `--commit`
- use `--start-drip`
- modify GHL workflows

## Stage 4 - Quality Review

Owners: Sales Manager, Coach, GHL Expert, Systems Director

Review checklist:

| Check | Owner |
|---|---|
| Target niche makes sense | Sales Manager |
| List is not obviously garbage | Scout |
| Emails are verified | Sender |
| Copy/offer is clear and not hypey | Coach |
| Tags and custom fields are correct | GHL Expert |
| Start tag triggers intended workflow only | GHL Expert |
| No HighLevel AI features are enabled | GHL Expert |
| Job is within budget | Systems Director |
| Approval packet is plain English | Manager |

GHL Expert read-only API check:

```bash
npm run reach:ghl-check
```

This checks known dedicated sending domains from the Reach runbook, GHL location access, Reach pipelines, workflow metadata when exposed by the API, and configured custom field IDs. It does not change GHL.

## Stage 5 - Manager Approval Packet

Manager gives Mike one clean packet.

```text
Campaign approval request

Lane:
Audience:
Geography:
Raw prospects:
Verified contacts:
Estimated run cost:
Budget cap:
Recommended action:
Requested approval: import only | start drip | both

Sample prospects:
1.
2.
3.

Tags/fields to be used:

Risks:

Agent checks completed:

Exact command/action to approve:
```

## Stage 6 - Approved Execution

Owner: Sender or GHL Expert

Import only:

```bash
npm run reach:launch -- --lane LANE --csv tmp-reach-LANE-verified.csv --limit N --commit
```

Import and start drip:

```bash
npm run reach:launch -- --lane LANE --csv tmp-reach-LANE-verified.csv --limit N --commit --start-drip
```

Rules:

- only run the exact approved lane, CSV, limit, and action
- confirm the correct dedicated sending domain/subdomain is warming or ready before start-drip approval
- if the approved command fails, stop and report
- if results differ materially from the approval packet, stop and report
- do not improvise with live GHL actions

## Known Baseline From May 19, 2026 Test Run

Yesterday's run created a useful baseline for the three campaign lanes.

| Lane | Verified contacts | Start results | Notes |
|---|---:|---:|---|
| `reviews` | 7 | 7 started after retry | Main start run had one GHL/Cloudflare 502 for one contact; one-contact retry succeeded. |
| `ai` | 6 | 6 started | No GHL result errors in the local result file. |
| `relay` | 5 | 5 started | No GHL result errors in the local result file. |

Verification summary from the May 19 files:

| Lane | Kept valid | Removed invalid | Removed unknown | Removed catch-all |
|---|---:|---:|---:|---:|
| `reviews` | 7 | 0 | 2 | 1 |
| `ai` | 6 | 2 | 2 | 0 |
| `relay` | 5 | 3 | 2 | 0 |

Local evidence files:

- `tmp-reach-reviews-verify-report.json`
- `tmp-reach-ai-verify-report.json`
- `tmp-reach-relay-verify-report.json`
- `tmp-reach-reviews-started-ghl-results.json`
- `tmp-reach-reviews-retry-started-ghl-results.json`
- `tmp-reach-ai-started-ghl-results.json`
- `tmp-reach-relay-started-ghl-results.json`

Operational lesson:

> GHL/API 5xx errors can happen even when the input is correct. If one contact fails during an approved live action, retry only the failed contact and log the retry result.

## Stage 7 - Post-Run Logging

Owner: Reporter

Reporter logs:

- date/time
- lane
- CSV used
- raw contacts
- verified contacts
- contacts imported
- start tag added or not
- failures
- estimated cost
- next action owner
- next action due

Sorter then watches replies and routes:

| Reply type | Owner |
|---|---|
| interested / asks for details | Booker or Sales Manager |
| objection | Sales Manager or Coach |
| opt-out | Sender |
| bad fit | Sorter |
| angry/confused | Manager / Mike |

## Cost Guardrails

Follow `agent-model-routing-policy.md`.

Default caps:

| Batch size | Cap |
|---|---:|
| 10-25 raw prospects | $2 |
| 100 raw prospects | $10 |
| 500 raw prospects | $25 |
| 1,000 raw prospects | $50 |

If a campaign needs more than the approved cap, stop before continuing.

## Hard Safety Rules

- Do not enable or toggle any HighLevel AI feature.
- Do not start outreach without explicit approval.
- Do not import contacts unless the approval packet says import is approved.
- Do not treat one lane approval as approval for another lane.
- Do not use strong models for row-by-row CSV cleanup.
- Do not continue after a failed GHL/API result without reporting it.
- Do not contact prospects or clients as AOH without approval.
