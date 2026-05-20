# Agent Model Routing Policy

## Purpose

Agents should not choose expensive models by habit.

This policy tells AOH agents which level of model to use, who is allowed to escalate, and when a job must stop for budget or human approval.

The default rule is:

> Use the cheapest reliable method that can complete the step safely.

## Decision Owners

| Decision | Owner |
|---|---|
| Monthly AI/API budget | Mike / President |
| Allowed model providers and current tier mapping | Systems Director |
| Model tier for a specific job step | Manager |
| Campaign strategy risk | Sales Manager |
| Technical workflow risk | GHL Expert and Systems Director |
| Budget escalation or risky live action | Manager prepares for Mike |
| Final approval for live prospect/client-facing action | Mike |

## Model Tiers

| Tier | Name | Use for | Examples |
|---|---|---|---|
| 0 | No LLM | deterministic work | CSV parsing, dedupe, syntax checks, counting rows, API imports |
| 1 | Cheap | simple classification and cleanup | category cleanup, obvious bad-fit removal, short summaries |
| 2 | Standard | judgment work | prospect fit scoring, campaign angle review, reply triage |
| 3 | Strong | risky or ambiguous work | final approval packets, workflow risk review, complex client-facing decisions |
| 4 | Human | business decision | import approval, drip start approval, AI feature authorization |

## Provider Mapping

Mike currently has Gemini, ChatGPT, and Claude available. Do not hard-code a permanent winner. Pricing and model quality change.

Systems Director owns the current mapping and should refresh it monthly or when a provider changes pricing.

Suggested starting map:

| Tier | Gemini | ChatGPT / OpenAI | Claude |
|---|---|---|---|
| Cheap | Flash-style model | mini-style model | Haiku-style model |
| Standard | Pro/standard model | standard/mini reasoning model | Sonnet-style model |
| Strong | strongest available model | frontier/reasoning model | Opus or strongest Sonnet-style model |

If a tool can do the work without an LLM, use the tool instead.

## Escalation Rules

Agents start at Tier 0 or Tier 1 unless the job ticket says otherwise.

An agent may request a higher tier only when one of these is true:

- the action affects prospects, clients, reputation, billing, or live automations
- the lower tier produced conflicting or low-confidence results
- the task requires nuanced judgment, brand voice, or risk review
- the task involves GHL workflow behavior, tags, drip triggers, or contact imports
- the result will be shown to Mike as an approval recommendation

Escalation request format:

```text
Requesting model escalation
Job:
Current tier:
Requested tier:
Reason:
Estimated extra cost:
What happens if we do not escalate:
```

## Budget Rules

Every agent job must have a budget cap before it starts.

Suggested defaults:

| Job type | Default cap |
|---|---:|
| 10-25 prospect pilot | $2 |
| 100 prospect campaign prep | $10 |
| 500 prospect batch | $25 |
| 1,000 prospect batch | $50 |
| Client-facing or workflow-risk review | Manager sets cap before work starts |

If the job hits 80% of budget, the agent warns Manager.

If the job hits 100% of budget, the job stops and Manager decides whether Mike needs to approve more spend.

## Campaign Model Routing

| Step | Owner | Tier |
|---|---|---|
| Build/scrape list | Scout | 0 or 1 |
| Clean CSV | Sender | 0 |
| Dedupe list | Sender | 0 |
| Verify emails | Sender | 0, verifier API only |
| Remove obvious bad fits | Scout | 1 |
| Score uncertain prospects | Sales Manager | 1 first, 2 if unclear |
| Check campaign copy and claims | Coach | 2 |
| Check GHL tags/workflow risk | GHL Expert | 2 or 3 |
| Prepare approval packet | Manager | 2 |
| Approve import or drip start | Mike | 4 |

## Cost Log

Every completed job should record:

- job id
- agent owner
- provider/model tier used
- estimated LLM cost
- external API cost
- total estimated cost
- whether budget was exceeded
- whether escalation was requested

Use estimates at first. Perfect accounting can wait until Langfuse or another observability layer is installed.

## Hard Stops

Agents must stop and request approval before:

- importing contacts into GHL
- starting an outreach drip
- changing a live GHL workflow
- sending a prospect/client-facing message
- enabling or toggling any HighLevel AI feature
- exceeding the approved job budget

HighLevel AI features must remain OFF unless Mike explicitly authorizes them manually.
