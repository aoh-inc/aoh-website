# Morning Brief Skill Pack

Status: v1 owner brief active
Owner: General Manager
Last updated: 2026-05-21

## Purpose

The Morning Brief gives Mike the owner view before the day starts:

1. What happened yesterday.
2. What needs Mike today.
3. What agents are handling.
4. What changed in the market.
5. The one best move for the day.

This starts as an internal AOH brief for Mike. After it proves useful for a few weeks, package it as a client offer.

## Agent Ownership

| Agent | Owns |
|---|---|
| General Manager | Final brief, priority order, owner language, decisions, blockers. |
| GHL Expert | GHL campaign stats, workflows, pipeline proof, export/readiness checks. |
| Local Visibility Manager | Google Business Profile access, profile updates, local visibility checks, review links, and client GBP handoff proof. |
| Sales Manager | What the campaign numbers mean and what to do next. |
| Scout / Market Watcher | Industry news, competitor signals, niche opportunities, offer ideas. |
| Systems Director | Cron reliability, source health, cost, failed jobs, missing data. |

General Manager sends the final brief. Specialist agents feed the brief.

## Current Knowledge Method

Current agent commands read known local files:

- `docs/client-ops-ledger/daily-brief-current.md`
- `docs/client-ops-ledger/morning-brief-current.md`
- `docs/client-ops-ledger/morning-brief-sources.json`
- `docs/client-ops-ledger/agent-jobs.csv`
- `docs/client-ops-ledger/sending-domain-readiness.csv`
- `docs/client-ops-ledger/outbox/*`

This is reliable for operating status, but it is not a full searchable knowledge base.

## Knowledge Upgrade Path

Use three layers:

1. **Local operating files** for fast facts and job status.
2. **Live APIs/exports** for numbers that change, such as GHL campaign stats.
3. **Retrieval knowledge base** for broad documentation, such as HighLevel docs and playbooks.

Do not paste all GHL documentation into every prompt. Ingest it into a searchable knowledge base, attach source URLs, and retrieve only the relevant passages.

## Recommended Retrieval Design

For AOH v1, use OpenAI hosted file search or a small local retrieval layer.

OpenAI hosted file search:

- best when we want faster setup and less infrastructure
- supports vector stores, filters, result limits, and source results
- good for markdown docs, runbooks, and selected GHL help articles

Self-managed retrieval, such as Qdrant or Postgres/pgvector:

- best when we need more control over chunking, hybrid search, reranking, or metadata
- more work to maintain
- useful later if client knowledge bases grow

## Source Rules

| Topic | Source priority |
|---|---|
| OpenAI/agent build | Official OpenAI docs first. |
| GHL API/platform facts | Official HighLevel developer docs and support docs first. |
| GHL real-world gotchas | Trusted implementation forums second, clearly marked as practitioner signal. |
| Morning news | Google Alerts/RSS first, then curated industry sources. |
| Campaign results | GHL stats/export or read-only API proof, not screenshots alone. |

Forums are useful for edge cases, but they do not override official docs or live system proof.

## Current Build

The v1 generator is:

```bash
npm run morning:brief
```

It writes:

- `docs/client-ops-ledger/morning-brief-current.md`
- `docs/client-ops-ledger/outbox/morning-brief-YYYY-MM-DD.md`

Mission Control page:

- `/mike-mc/morning-brief`
- Shows the current brief, GHL stats, standard/commercial package, custom layer, retention, pricing anchors, source health, proof files, and brief archive.

Optional flags:

```bash
npm run morning:brief -- --date 2026-05-21
npm run morning:brief -- --fetch-news
npm run morning:brief -- --post-slack
```

Current connected data:

- Reach job ledger
- sending domain readiness
- Reach warmup reports
- GHL import/start result files
- GHL workflow email stats from the read-only HighLevel API
- Google News RSS starter feeds; Google Alerts can replace or supplement them later

GHL stats command:

```bash
npm run ghl:email-stats
```

It writes:

- `docs/client-ops-ledger/ghl-email-stats-current.csv`
- `docs/client-ops-ledger/outbox/ghl-email-stats-YYYY-MM-DD.csv`
- `docs/client-ops-ledger/outbox/ghl-email-stats-YYYY-MM-DD.md`

The expected GHL stats shape is in `docs/client-ops-ledger/ghl-email-stats-template.csv`.

Note: the HighLevel API returns workflow-campaign totals. Daily movement can be calculated after there are multiple saved daily snapshots.

## Owner Brief Shape

```text
Morning Brief - YYYY-MM-DD

1. Commercial Brief
- Reach: sent/delivered/opened/replied/bounced if available.
- Leads: new clean contacts found.
- Replies: hot replies, opt-outs, unclear replies.
- Market: one useful signal.

2. Custom Layer
- GHL stats/API proof.
- Email and calendar status once connected.
- Custom client systems only when paid/approved.

3. Needs Mike today
- Approval, spend change, target change, or client-facing risk only.

4. Agents working
- GHL Expert: campaign stats and GHL proof.
- Sales Manager: what the numbers mean.
- Scout: news/opportunity signals.
- Systems Director: cron/source failures.

5. Recommended move
- One clear action.
```

## Client Offer

Working name: **Owner Morning Brief**

Promise:

> Every morning, you get what happened, what needs attention, where money may be leaking, and the next best move.

Potential packages:

| Package | Includes |
|---|---|
| Commercial Brief | New leads/replies, campaign results, reviews, missed calls, market signal, one recommended move. |
| Growth Brief | Commercial plus competitor/news/opportunity tracking and weekly trend notes. |
| Custom Brief | Growth plus GHL/CRM, inbox, calendar, GBP, call tracking, ad, or payment integrations. |

Best first targets:

- home services
- dental, med spa, wellness, chiropractic
- local professional services
- restaurants/hospitality only where review volume and margins support it
- real estate only with tighter compliance controls

## Research Notes

- Product research and source list: `docs/client-ops-ledger/owner-morning-brief-product-research.md`
- OpenAI file search uses vector stores as knowledge bases and lets Responses retrieve relevant files at runtime: https://developers.openai.com/api/docs/guides/tools-file-search
- OpenAI Agents SDK supports FileSearchTool, WebSearchTool, filters, result limits, and included search results: https://openai.github.io/openai-agents-python/tools/
- HighLevel says official API docs live in the Developer Marketplace and support directs developers there for API work: https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api-documentation
- HighLevel email statistics/export docs are the source for campaign reporting shape: https://help.gohighlevel.com/support/solutions/articles/155000005552-how-to-access-the-all-in-one-dashboard-for-email-marketing and https://help.gohighlevel.com/support/solutions/articles/155000007499-exporting-email-marketing-data
- HighLevel Email Statistics API used by AOH: https://marketplace.gohighlevel.com/docs/ghl/emails/get-campaign-stats-under-campaigns-v-2
- HighLevel workflow campaign list API used by AOH: https://marketplace.gohighlevel.com/docs/ghl/emails/list-workflow-campaigns-v-2
- Google Alerts can track topics and control frequency, sources, language, region, and result count: https://support.google.com/websearch/answer/4815696
- LangChain retrieval docs describe the standard pieces: document loaders, splitters, embeddings, vector stores, and RAG architectures: https://docs.langchain.com/oss/python/langchain/retrieval
- Qdrant documents hybrid search as dense semantic search plus sparse/BM25 keyword search and reranking: https://qdrant.tech/documentation/search-precision/reranking-hybrid-search/
- Practitioner forum signal: chunking/retrieval quality and stale indexes are common production failure points; treat as guidance, not authority: https://www.reddit.com/r/LangChain/comments/1tgcldy/why_does_everyone_skip_the_chunking_part/
