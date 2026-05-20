---
name: AOH Agent Architecture v1
description: Canonical architecture for AOH agent fleet. Pattern (orchestration + handoff), CTO/oversight role (Auditor — narrow scope), observability stack (Langfuse), visualization (OpenClaw Mission Control — already exists for the stack), agent meetings pattern (AutoGen GroupChat in Slack threads), and migration plan. Built 2026-05-01, verified 2026-05-01 with WebSearch.
type: reference
status: active
date: 2026-05-01
last-verified: 2026-05-01
agent-readers: [director, auditor, claude]
team-readers: [mike]
tags: [aoh, architecture, agents, observability, canonical]
---

# AOH Agent Architecture v1

**Status:** Active. Verified 2026-05-01 against current state of all tools listed below.

---

## For Mike + Kip + Teri — plain English version

> **What this whole thing is:** AOH is building a team of AI agents that do specific jobs (find prospects, write content, answer the phone, follow up on replies, etc.) so that you, Kip, and Teri don't spend your day on repetitive work. Think of it like hiring 9-12 specialists who each do one thing well, plus a couple of supervisors who watch the team and tell you when something needs your attention.

### The agents — one line each

| Agent | What it does (plain) | Status |
|---|---|---|
| **Scout** | Finds new prospects to reach out to. Posts the daily list to Slack. | Live |
| **Director** | The team's project manager. Decides who does what and when. | Live |
| **Coach** | Answers product/pricing/positioning questions for you, Kip, and Teri in Slack. | Building next |
| **Studio** | Makes the content (images, carousels, eventually copy + video). | Building after Coach |
| **Sender** | Sends the cold emails to prospects Scout finds. | Building after Studio |
| **Press** | Publishes content (LinkedIn, newsletter, GBP) on the right schedule. | After Sender |
| **Sorter** | Sorts inbound replies — flags hot leads, ignores spam. | Pipeline expansion |
| **Booker** | When a prospect agrees, books the call on your calendar. | Pipeline expansion |
| **Enricher** | Finds emails / phone numbers for prospects Scout pulls. | Pipeline expansion |
| **Caller** | Builds the daily cold-call list for you and Kip. | Pipeline expansion |
| **Hub** | Answers your questions about clients in GHL/hub360ai ("Hey Hub, how many reviews did Cherrydale get this month?"). | After first 1-2 paying clients |
| **Auditor** | The team auditor. Watches everything, flags problems, recommends fixes. Quiet most of the time. | Built LAST |

### How they work together — without the jargon

- Most agents work like an **assembly line**: Scout finds prospects → Enricher gets their emails → Sender writes them → Sorter sorts replies → Coach drafts responses → Booker puts the meeting on the calendar.
- For **bigger decisions** (e.g., "should we publish this LinkedIn post?"), agents have a quick **meeting in Slack** — Studio shows the draft, Coach checks the voice, Press checks the format, they go back and forth, you can watch and drop in if you want.
- A separate dashboard (called **Mission Control**) shows you what every agent is doing right now — like watching dispatcher screens at a delivery company.

### Where you'll see them

- **Slack** — agents post their work to dedicated channels (`#04-aoh-prospects`, `#06-agent-activity`, `#01-alerts`). You read at your own pace.
- **Mission Control** dashboard (browser) — live "office" view of who's working on what.
- **Coach** — interactive in Slack ("Hey Coach, how do I handle the price objection from a vet clinic?")
- **Hub** — interactive in Slack ("Hey Hub, what's Cherrydale's last review count?")

### What the team does NOT need to know

The technical stuff below (Docker, Langfuse, AutoGen, code pattern names) — that's for the developer building the agents. You don't need to read it. If something's not working, tell Mike; Mike tells the developer.

### What the team SHOULD read

- [[AOH Brand Voice v1]] — voice rules every piece of content follows. Reference it daily when writing emails or social.
- [[AOH Distribution Strategy v1]] — what gets posted where and how often.
- [[AOH Ground Truth]] — verified facts about AOH (positioning, pricing, who we serve, who we don't).

---

## TL;DR — recommended stack (technical, for the developer)

| Layer | Decision |
|---|---|
| **Architecture pattern** | Hierarchical orchestration (Director-led) + handoff-chained pipeline + shared per-prospect task ledger |
| **CTO/oversight** | NEW agent: **Auditor** — narrow scope (smart oversight only, basic monitoring covered by Mission Control). Atlantis stays as operator console. |
| **Observability — primary** | Langfuse v3 self-hosted on same VPS as OpenClaw (free, Docker compose, per-agent traces + cost) |
| **Observability — backup** | AgentOps free tier (50K events/month — plenty for AOH scale). Usable as primary if Langfuse install drags. |
| **Visualization** | **OpenClaw Mission Control** (already-built dashboard for the OpenClaw stack — multiple GitHub implementations). NOT a custom Streamlit build. |
| **Agent meetings** | AutoGen-style GroupChat pattern, surfaced as Slack threads. Used for high-stakes decisions only (content publish, prospect qualification, sales-strategy review) — not every task. |

---

## 1. Architecture pattern

**Hierarchical orchestration + handoff pipeline + task ledger.**

- **Director** owns: goal decomposition, error escalation, daily/weekly briefs, ad-hoc requests
- **Pipeline agents** chain via direct handoff: `Scout → Enricher → Sender → Sorter → Coach → Booker`
- **Shared task ledger**: per-prospect record in GHL/hub360ai (or a Postgres row) — each pipeline stage writes its progress so the next stage knows where to pick up. Borrowed from Microsoft's Magentic-One pattern.
- **Hub** stays interactive (human-invoked, not orchestrated)
- **Coach** is dual-mode: invoked by Sorter when reply needs response, AND by humans for Q&A
- **Studio + Press** (new content agents) follow the same pattern: Studio creates → human-approval gate → Press publishes

**Why not council/debate:** Overkill for sequential pipeline work. Council is for high-stakes single decisions (medical, legal, code review).

**Why not pure swarm:** Gives up the global view Director needs to brief Mike each morning.

**Why not a separate staff layer:** Just hierarchical orchestration with a marketing label. Director or Manager already does this.

**Vibe shift to know about:** As of late 2025/early 2026, Anthropic and OpenAI both published research showing single agents with better tools + longer context often beat multi-agent systems. Marketing pendulum is swinging back toward "fewer, sharper agents." Build multi-agent only when parallelism, separation of concerns, or context isolation actually pays for itself. AOH's case (specialized roles, sequential pipeline, multi-tenant clients) does justify it — but resist agent sprawl.

---

## 2. CTO/oversight — Auditor (narrow scope)

**Atlantis is the operator console** (chat surface, admin password). Primary VPS host is now `srv1587689.hstgr.cloud` (`2.24.198.207`) and is accessed via SSH alias `atlantis`. It's where Mike *talks to* the system. It does NOT proactively monitor agents.

**Migration note (2026-05-14):** Previous Atlantis host `srv1530955.hstgr.cloud` (`187.124.244.13`) is legacy and pending retirement after migration validation.

**OpenClaw Mission Control covers basic monitoring** — heartbeat checks, gateway health, system resources, cron job tracking, agent up/down status. So Auditor's scope is NARROWER than originally drafted: not "watch everything," but "the smart-judgment layer that Mission Control can't do."

**What Auditor does (narrow scope):**

1. **Cost-anomaly detection** — Mission Control shows cost. Auditor judges whether today's spend is *anomalous* given the work done. (Sender burned 3× tokens — was it 3× the volume, or a runaway loop? Mission Control can't tell. Auditor can.)
2. **Pipeline-health digests** — daily summary tying Scout output → Enricher match rate → Sender reply rate → Sorter hot-reply rate → Coach drafts → Booker conversions. Tells Mike "this week you're up 14% in reply rate but down 8% in conversions — investigate Booker."
3. **Recommended fixes** — pattern-match symptoms to known fixes ("Sender's reply rate dropped 40% week-over-week; subject-line A/B test recommended"). Slack DM to Director for action.
4. **Cross-agent pattern detection** — only Auditor sees the whole fleet at once. Spots: "All 3 agents using ElevenLabs failed at 2pm — likely upstream provider issue, not our bug."

**What Auditor does NOT do** (Mission Control owns these):
- Heartbeat / is-it-alive checks
- Real-time agent status display
- Cron job tracking
- Gateway health
- Resource monitoring (CPU/memory/disk)

**Schedule:**
- Daily 7am — pipeline health digest to `#06-agent-activity`
- Weekly Sunday — cost + pipeline performance review to `#01-alerts`
- Triggered (not scheduled) — when Mission Control posts an alert, Auditor analyzes it and recommends action

**Channels:**
- Posts to `#01-alerts` for needs-human pattern detections
- DMs Director for proposed fixes
- Posts daily digest to `#06-agent-activity`

**Why a separate agent (not merged into Director):** Director is in the critical path for every workflow. If Director breaks, Auditor needs to be the one that notices. Separation of concerns.

**Build order:** LAST in the AOH fleet — after Coach, email pipeline, AND Mission Control are live, so Auditor has both real signal AND the right division of labor with Mission Control.

---

## 3. Observability — Langfuse (self-hosted)

**Why Langfuse:**
- Open source, self-hostable on same VPS as OpenClaw (no SaaS bill)
- Docker compose deploy, ~30 min setup
- Per-agent traces, cost tracking, custom evals
- Multi-tenant support (useful if Mike ever resells observability to clients as a feature)
- Stable v3.x as of late 2025 (verify current version)

**Backup option:** AgentOps free tier (cloud) — purpose-built for agent traces (sessions, tool calls, agent handoffs as first-class). Turn on if Langfuse self-host install drags.

**What Mike needs vs nice-to-have:**

| Need | Nice | Don't need |
|---|---|---|
| Per-agent run history | Evals/scoring | Multi-tenant team collab |
| Error rate per agent | Session replay | User analytics |
| Cost per agent per day | A/B prompt tracking | Fine-grained access controls |
| Tool-call inspection on errors | | |

**Slack stays the human-facing layer.** Observability tool is for debugging when something breaks. Slack is for ambient awareness ("Scout posted morning prospects to #04-aoh-prospects").

---

## 4. Visualization — OpenClaw Mission Control (robsannaa fork)

**Major update from initial draft:** OpenClaw already has Mission Control implementations. Don't custom-build.

**Recommended: [robsannaa/openclaw-mission-control](https://github.com/robsannaa/openclaw-mission-control)**

Why this one (vs the 3 alternatives):

| Repo | Stars | Slack? | Setup | Verdict |
|---|---|---|---|---|
| **robsannaa/openclaw-mission-control** | 608 | **YES** (+ Telegram, Discord, WhatsApp, Signal) | Zero-config (`./setup.sh`, runs on localhost:3333) | ✅ **Pick this.** |
| abhi1693/openclaw-mission-control | 3.9k | No | Docker compose | Runner-up. Bigger user base but no Slack, enterprise-focused. |
| manish-raana/openclaw-mission-control | 269 | Not mentioned | Bun install | Maybe. Cleaner React+Convex stack but smaller scope. |
| navjotdhanawat/openclaw-mission-control | 34 | Not mentioned | npx wizard | Skip. Too small (6 commits). |

**What you get with the robsannaa fork:**

- **Real-time dashboard** — live agent status, gateway health, cron jobs, system resources (CPU/memory/disk)
- **Built-in chat with each agent** (streaming responses) — talk to Scout from the browser without going to Slack
- **Kanban task board** (Backlog → In Progress → Review → Done)
- **Cron job scheduling + monitoring** — schedule any agent without writing crontab
- **Token + cost tracking** per model and per agent
- **Memory management** — view/edit each agent's long-term memory + vector search
- **Built-in terminal** with multi-tab support
- **Slack + Telegram + Discord + WhatsApp + Signal channels** — all wired in, including Mike's existing Slack workspace
- **Tailscale integration** — secure off-site access (matters for nomad life)
- **Browser-based GUI on localhost:3333** — zero CLI required
- **agentbay.space hosted option** — alternative to running it on Mike's VPS

**Tech stack (relevant for the vibe-coding paths):**
- TypeScript (98.6%) + Next.js (frontend)
- Node.js (backend, npm-based)
- No separate database — operates as thin layer over OpenClaw, reads/writes directly (no sync delays)

**Why this is the right pick for Mike specifically:**
- Built for non-technical users — explicitly markets itself as "manage OpenClaw without touching the CLI"
- Slack pre-wired = no integration work
- Zero-config = works on first run
- Actively maintained (v0.5.1 March 26, 2026; 42 releases total)
- Tailscale + agentbay.space = nomad-proof access from anywhere
- MIT license — free for commercial use

**What to skip:**
- Custom Streamlit / static-HTML dashboards (initial draft recommendation — superseded)
- AI Town / Sims-style worlds (research toys, wrong tool)
- Cursor-style activity feeds (not installable over your own fleet)

---

## 5. Agent meetings — AutoGen GroupChat in Slack threads

Mike's question: "can we have agent meetings live to discuss decisions, watch the meeting between agents we have built?"

**Yes — production pattern verified 2026-05-01: AutoGen AG2 GroupChat.**

**How it works:**
- Multiple agents share one conversation
- A "selector" (rule or judge agent) picks who speaks next
- Agents debate, refine, reach consensus
- Conversation is text-based and fully watchable

**Production proof:** Microsoft uses this internally for code review (reviewer agent + security agent + documentation agent debate ambiguous cases before settling on recommendations). Same pattern fits AOH's content review, prospect qualification, sales-strategy decisions.

**For AOH — the Slack-thread surface:**

Don't make agents talk in some hidden console. Surface every meeting as a Slack thread Mike + Kip + Teri can watch in real-time, drop into mid-stream, or read after the fact.

**Concrete example — Studio drafts a LinkedIn carousel about Reviews Pro launch:**

```
[Studio] Drafted Reviews Pro carousel. 8 slides. Voice ✓.
         Drive link: drive.google.com/.../carousel-v1.pdf
[Coach] Slide 4 contradicts our anti-positioning — we say "for shops doing $500K+" 
        but slide 4 implies "any business." Suggest cut or reframe.
[Press] Agreed with Coach. Also: slide 7 has 9 banned phrases — needs scrub.
[Studio] Revising. v2 incoming.
[Studio] v2 posted. Slide 4 reframed. Slide 7 scrubbed. Banned-phrase count: 0.
[Coach] LGTM.
[Press] Approved. Publishing Tuesday 9am ET.
[Mike] (watching thread, drops emoji) 👍
```

**When to use GroupChat (not every task):**

| Use for | Don't use for |
|---|---|
| Content publish decisions (Studio → Press → Coach review) | Routine pipeline runs (Scout daily prospect pull) |
| Prospect qualification (high-value deal needs Director + Coach + Hub debate) | Standard cold email send |
| Sales-strategy review (Coach + Auditor weekly) | Single-agent tasks (transcribe, file, summarize) |
| Anomaly response (Auditor flag → Director + relevant agent debate fix) | Anything where consensus doesn't add value |

**Cost warning:** Every GroupChat turn = full LLM call with accumulated history. 4 agents × 5 rounds = 20 LLM calls minimum. Set `max_consecutive_auto_reply` hard limits to prevent infinite loops. Use sparingly — high-leverage decisions only.

**Implementation note:** AutoGen's GroupChat primitive is the cleanest for this pattern. Could also build a lightweight version directly in OpenClaw using existing agent-to-agent messaging — depends on what fits the OpenClaw fleet best when build time comes.

---

## 6. Migration plan

In order (don't skip ahead):

1. **Deploy OpenClaw Mission Control (robsannaa fork)** — `./setup.sh`, runs on localhost:3333, Slack pre-wired. ~15 min. Gives Mike the "watch agents work" surface immediately, AND covers basic monitoring (heartbeat, cron, system resources) so Auditor's scope can stay narrow.
2. **Stand up Langfuse v3 on VPS** — Docker compose, ~30 min. Wire OpenClaw + each agent SDK to send traces. Verify Scout traces appear before touching anything else.
3. **Lock the architecture pattern** in agent SOULs/identities — Director-as-orchestrator + handoff pipeline + per-prospect task ledger. Document where the ledger lives (GHL/hub360ai or Postgres), what fields, who writes what stage.
4. **Build remaining agents in priority order** (per build sequence) — Coach → Studio v1 → Sender → Press v1 → Sorter/Booker/Enricher → Auditor LAST.
5. **Wire GroupChat meeting threads in Slack** — start with Studio↔Press↔Coach for content review, expand to other meetings as agent fleet grows. Set `max_consecutive_auto_reply` per meeting type.
6. **Build Auditor LAST** — after Coach + email pipeline + Mission Control are live. Narrow scope: cost anomalies, pipeline-health digests, recommended fixes, cross-agent pattern detection.
7. **Defer until there's volume:** evals/scoring, A/B testing of agent prompts, multi-environment Langfuse projects. Pay off after first paying clients, not before.

---

## 7. What NOT to do

- **Don't switch frameworks** (CrewAI / LangGraph / Mastra / Agents SDK) right now. OpenClaw is running, Director and Scout are live, recommendations above are framework-agnostic. Save framework changes for the day OpenClaw stops being the right base.
- **Don't add agents speculatively.** Each new agent adds maintenance + cost. Build only when a specific bottleneck demands it.
- **Don't merge Auditor into Director.** Critical-path separation matters.
- **Don't custom-build a Streamlit / static-HTML dashboard.** OpenClaw Mission Control already exists and does it better.
- **Don't build AI Town / Sims-style visualization.** Research toy, wrong tool.
- **Don't put agents in GroupChat for routine work.** Cost spirals fast. High-stakes decisions only.

---

## 8. Cross-bucket reuse

Mike's rule: **agents do NOT cross buckets.** Studio + Press + Auditor are AOH-only. When LC and Personal/Atlas-Nomad bucket out their own content/oversight needs, they get their own agents under their own naming themes.

**The architecture pattern, observability stack, AND Mission Control all REUSE across buckets** — same Langfuse instance can host multiple projects (one per bucket), same Mission Control instance can manage agents across buckets (just tag agents by bucket). Code + infrastructure reuse is fine; agent identity is not.

---

## 9. Verified versions (as of 2026-05-01)

| Tool | Verified state | Source |
|---|---|---|
| **Langfuse** | v3 current; Docker compose self-host standard; v2 still supported | langfuse.com/self-hosting |
| **AgentOps** | Free tier 50K events/month; Pro $49/mo for 500K events; integrates with 400+ frameworks | agentops.ai |
| **Claude Agent SDK** | `agents` parameter in `ClaudeAgentOptions`; each subagent in fresh conversation; concurrent execution supported. Packages: `@anthropic-ai/claude-agent-sdk` (TS), `claude-agent-sdk` (Python) | docs.claude.com/en/docs/agent-sdk/subagents |
| **AutoGen AG2** | GroupChat is primary coordination pattern; multi-agent debate is documented design pattern | microsoft.github.io/autogen |
| **OpenClaw Mission Control (robsannaa)** | v0.5.1 (March 26, 2026); 608 stars; 42 releases; Slack pre-wired | github.com/robsannaa/openclaw-mission-control |

**Re-verify trigger:** every 6 months, or before any major framework switch.

---

## 10. Tech stack + developer onboarding — moved to `06 Systems/AOH/`

The full tech inventory (infrastructure, vendors, APIs, connection diagram, day-1 checklist for an incoming developer, known gotchas) lives in a separate operational doc:

**→ [[AOH Tech Stack & Developer Onboarding]]** (in `06 Systems/AOH/`)

**Why split:**
- This doc (`02 Training/AOH Agent Architecture v1`) is **strategic** — what we're building, why, and how the agents work together. Coach reads from `02 Training/` for sales conversations.
- The tech stack doc (`06 Systems/AOH/AOH Tech Stack & Developer Onboarding`) is **operational** — SSH commands, API keys, vendor list, day-1 checklist. Lives in `06 Systems/` per the existing pattern (alongside Atlantis System Map, WaveWatch, me-curator).

A new developer starts there, then circles back to this doc for the strategic context.

---

## Cross-references

- [[AOH Ground Truth]] — verified facts about AOH
- [[AOH Brand Voice v1]] — voice rules for content agents (Studio, Press)
- [[AOH Distribution Strategy v1]] — what Studio + Press publish where
- `reference_aoh_agent_fleet.md` (memory) — agent naming + roster (Scout, Director, Coach, Sender, Booker, Enricher, Sorter, Caller, Hub + new: Studio, Press, Auditor)
- `reference_openclaw_architecture.md` (memory) — current OpenClaw + Atlantis setup
- `project_openclaw_system.md` (memory) — 13-agent system overview
- `project_atlantis_fixes_2026-04-22.md` (memory) — Atlantis context
- [robsannaa/openclaw-mission-control](https://github.com/robsannaa/openclaw-mission-control) — Mission Control implementation (chosen)
- [Langfuse self-hosting docs](https://langfuse.com/self-hosting)
- [Claude Agent SDK Subagents docs](https://docs.claude.com/en/docs/agent-sdk/subagents)
- [AutoGen Multi-Agent Debate pattern](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/multi-agent-debate.html)
