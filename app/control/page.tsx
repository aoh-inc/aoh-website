import type { Metadata } from "next";
import {
  ControlShell,
  FleetStrip,
  AgentCard,
  Pill,
} from "@/components/control/ControlPrimitives";

export const metadata: Metadata = {
  title: "The Hub",
  description: "AOH operator console.",
  robots: { index: false, follow: false },
};

/**
 * SLICE 1 — STATIC WORKFORCE SHELL
 * Every card = one agent. Activity log shows last/now/next.
 * Each card owns the data the agent is responsible for.
 * All data below is mock. Slice 2 wires GHL + Vercel APIs.
 */

const MOCK = {
  refreshedAgo: "2m ago",
  fleet: {
    active: 2,
    total: 9,
    doneToday: 14,
    queued: 23,
  },
};

export default function ControlPage() {
  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ControlShell>
      {/* Header */}
      <header className="mb-8 flex flex-col gap-3 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH · Operator
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            The Hub
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            {dateLine} · Last refresh {MOCK.refreshedAgo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="warn">slice 1 · mock data</Pill>
          <button className="rounded-md border border-zinc-700/60 bg-zinc-900/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300 hover:bg-zinc-800/80">
            ↻ refresh
          </button>
        </div>
      </header>

      {/* Fleet KPI strip */}
      <section className="mb-8">
        <FleetStrip {...MOCK.fleet} />
      </section>

      {/* Agent cards — workforce view */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SCHEDULER — manual, time defender */}
        <AgentCard
          name="Scheduler"
          role="Time defender · books demos · briefs you before calls"
          status="manual"
          cadence="manual today · via Google Cal + GHL"
          activity={{
            lastDone: "9:00am today — confirmed Cherrydale demo for 11:00am",
            doingNow: "Next up in 2h 15m · Cherrydale Lawn demo",
            upNext: "3:30pm — internal · Kip review",
          }}
          ownedTitle="Today's agenda · 2 remaining"
          ownedRows={[
            {
              primary: "11:00am · Cherrydale Lawn demo",
              secondary: "ran /#calculator · clicked /pricing 3× · hot",
              badge: { tone: "hot", label: "in 2h 15m" },
            },
            {
              primary: "3:30pm · Kip review · internal",
              secondary: "weekly 1:1 · 30 min",
              badge: { tone: "default", label: "in 6h 45m" },
            },
            {
              primary: "Focus time today",
              secondary: "4.5h of unbroken blocks remaining",
              badge: { tone: "accent", label: "good" },
            },
            {
              primary: "This week",
              secondary: "6 demos booked · 3 internal calls · 1 day clear",
              badge: { tone: "default", label: "Mon-Fri" },
            },
          ]}
          ownedFooter={
            <div className="flex gap-2">
              <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
                pre-meeting brief
              </button>
              <button className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900">
                open Google Cal
              </button>
            </div>
          }
        />

        {/* SCOUT — live, daily 7am */}
        <AgentCard
          name="Scout"
          role="Prospect researcher · finds warm leads"
          status="live"
          cadence="daily · 7:00am"
          activity={{
            lastDone:
              "7:00am today — pulled 14 prospects across 3 niches (vets-NoVA, lawn-Southington, cleaning-Hartford)",
            doingNow: "Idle until tomorrow's 7am run",
            upNext: "Tomorrow 7:00am — same 3 niches",
          }}
          ownedTitle="Today's warm leads · 3 ready to call"
          ownedRows={[
            {
              primary: "Cherrydale Lawn",
              secondary: 'replied "interested in pricing"',
              badge: { tone: "hot", label: "hot" },
            },
            {
              primary: "Bill, Southington Lawn",
              secondary: "clicked /pricing 3× in 48h",
              badge: { tone: "warm", label: "warm" },
            },
            {
              primary: "Hartford Insurance Brokers",
              secondary: "ran /#calculator + viewed AI Visibility",
              badge: { tone: "warm", label: "warm" },
            },
          ]}
          ownedFooter={
            <div className="flex gap-2">
              <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
                view all 14 prospects
              </button>
              <button className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900">
                open GHL pipeline
              </button>
            </div>
          }
        />

        {/* MANAGER — live, always on */}
        <AgentCard
          name="Manager"
          role="Fleet orchestrator · runs the team"
          status="live"
          cadence="always on"
          activity={{
            lastDone: "9:42am today — queued Coach build slot 5",
            doingNow: "Monitoring 6 agents · all healthy",
            upNext: "Friday 4:00pm — week-end digest assembly",
          }}
          ownedTitle="Fleet state"
          ownedRows={[
            { primary: "Live agents", secondary: "Scout · Manager", badge: { tone: "accent", label: "2" } },
            { primary: "Manual today", secondary: "Scheduler · GHL Expert · Editor v0 · Press v0", badge: { tone: "warm", label: "4" } },
            { primary: "Building", secondary: "Coach (ship May 25)", badge: { tone: "warm", label: "1" } },
            { primary: "Planned", secondary: "Sender · Auditor + 4 more", badge: { tone: "muted", label: "6" } },
          ]}
        />

        {/* GHL EXPERT — manual today, workflow watchdog */}
        <AgentCard
          name="GHL Expert"
          role="Workflow watchdog · monitors every GHL automation"
          status="manual"
          cadence="manual today · continuous when live"
          activity={{
            lastDone: "9:00am today — Mike confirmed Review Automation workflow firing",
            doingNow: "Manual via Hub360ai admin",
            upNext: "When live: continuous webhook + workflow monitoring",
          }}
          ownedTitle="GHL surfaces · 4 active campaigns"
          ownedRows={[
            {
              primary: "Review Automation workflow",
              secondary: "fired 12× today · no errors · webhook healthy",
              badge: { tone: "accent", label: "healthy" },
            },
            {
              primary: "AI Visibility outreach pipeline",
              secondary: "91 enrolled · last send 8:00am",
              badge: { tone: "accent", label: "healthy" },
            },
            {
              primary: "Reviews outreach pipeline",
              secondary: "182 enrolled · last send 8:00am",
              badge: { tone: "accent", label: "healthy" },
            },
            {
              primary: "Custom fields sync",
              secondary: "place_id · rating · review_count — all current",
              badge: { tone: "ok", label: "in sync" },
            },
            {
              primary: "Webhooks (last 24h)",
              secondary: "248 fired · 0 errors · avg latency 340ms",
              badge: { tone: "accent", label: "0 errors" },
            },
          ]}
          ownedFooter={
            <div className="flex gap-2">
              <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
                view workflow log
              </button>
              <button className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900">
                open Hub360 admin
              </button>
            </div>
          }
        />

        {/* EDITOR v0 — manual via Claude */}
        <AgentCard
          name="Editor v0"
          role="Content strategist · picks angles + voice"
          status="manual"
          cadence="manual · via Claude"
          activity={{
            lastDone: "2026-05-15 — applied 3-job spine across home/pricing/about/blog",
            doingNow: "Drafting next post angle (review-velocity)",
            upNext: "Friday — Press v0 hand-off for next week's pack",
          }}
          ownedTitle="Backlog · 4 angles approved"
          ownedRows={[
            {
              primary: "review-velocity 90-day rule",
              secondary: "approved · in draft",
              badge: { tone: "warm", label: "draft" },
            },
            {
              primary: "dental compounding asset",
              secondary: "approved · ready for Press",
              badge: { tone: "accent", label: "ready" },
            },
            {
              primary: "46 beats 50 — star rating sweet spot",
              secondary: "approved · ready for Press",
              badge: { tone: "accent", label: "ready" },
            },
            {
              primary: "pet groomers reviews decide bookings",
              secondary: "approved · in draft",
              badge: { tone: "warm", label: "draft" },
            },
          ]}
        />

        {/* PRESS v0 — manual via Claude */}
        <AgentCard
          name="Press v0"
          role="Content publisher · ships to GHL + socials"
          status="manual"
          cadence="manual · via Claude"
          activity={{
            lastDone: "2026-05-16 — restored /#calculator CTAs in after-hours pack",
            doingNow: "4 posts queued in GHL for this week",
            upNext: "Wed 9:00am — after-hours payback (LI · FB · IG · X)",
          }}
          ownedTitle="This week's schedule"
          ownedRows={[
            {
              primary: "Wed 9am · after-hours payback",
              secondary: "LinkedIn · Facebook · Instagram · X",
              badge: { tone: "accent", label: "scheduled" },
            },
            {
              primary: "Thu 9am · reviews-compound",
              secondary: "LinkedIn · Facebook",
              badge: { tone: "accent", label: "scheduled" },
            },
            {
              primary: "Fri 9am · 46 beats 50",
              secondary: "LinkedIn · Instagram",
              badge: { tone: "accent", label: "scheduled" },
            },
            {
              primary: "Sat 10am · diy-vs-dfy",
              secondary: "LinkedIn · Facebook",
              badge: { tone: "accent", label: "scheduled" },
            },
          ]}
        />

        {/* COACH — building */}
        <AgentCard
          name="Coach"
          role="Sales Q&A in Slack · drafts replies"
          status="building"
          cadence="ship target · May 25"
          activity={{
            lastDone: "2026-05-15 — Slack workspace + bot user provisioned",
            doingNow: "Spec write · retrieval over 02 Training/ vault docs",
            upNext: "First Q&A trace — pricing objection scenario",
          }}
          ownedTitle="Build progress"
          ownedRows={[
            { primary: "Slack workspace", secondary: "mike-mc.slack.com · live", badge: { tone: "accent", label: "done" } },
            { primary: "Vault index over 02 Training/", secondary: "in progress", badge: { tone: "warm", label: "wip" } },
            { primary: "First-question scenarios", secondary: "10 drafted", badge: { tone: "warm", label: "wip" } },
            { primary: "Slack bot wiring", secondary: "blocked on vault index", badge: { tone: "muted", label: "blocked" } },
          ]}
        />

        {/* SENDER — planned, slot 6 */}
        <AgentCard
          name="Sender"
          role="Cold email engine · warmup + send"
          status="planned"
          cadence="build slot 6"
          activity={{
            doingNow: "Not yet built",
            upNext: "Blocked on Coach ship",
          }}
          ownedTitle="Will own (when live)"
          ownedRows={[
            { primary: "Reviews Outreach campaign", secondary: "pipeline ready · awaits Sender" },
            { primary: "AI Visibility Outreach campaign", secondary: "pipeline ready · awaits Sender" },
          ]}
        />

        {/* AUDITOR — planned, slot 11 (LAST) */}
        <AgentCard
          name="Auditor"
          role="Watchdog · stuck deals + inbox + site signals"
          status="planned"
          cadence="build LAST · slot 11"
          activity={{
            doingNow: "Not yet built — Mike watches manually",
            upNext: "Needs fleet stability before it can audit",
          }}
          ownedTitle="Will own (Mike's manual watch today)"
          ownedRows={[
            { primary: "Inbox demands", secondary: "7 emails waiting on reply · oldest 2d", badge: { tone: "warn", label: "manual" } },
            { primary: "Stuck deals", secondary: "5 warm not called in 7+ days", badge: { tone: "warn", label: "manual" } },
            { primary: "Site signals", secondary: "8 calc runs · 2 form submits today", badge: { tone: "warn", label: "manual" } },
          ]}
        />
      </section>

      <footer className="mt-12 border-t border-zinc-800/60 pt-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          AOH Mission Control · slice 1 preview · all data mock until slice 2
        </p>
      </footer>
    </ControlShell>
  );
}
