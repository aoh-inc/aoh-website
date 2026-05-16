import type { Metadata } from "next";
import {
  ControlShell,
  FleetStrip,
  AgentCard,
  Pill,
  type OwnedRow,
} from "@/components/control/ControlPrimitives";
import {
  getControlData,
  relativeTime,
  fmtTime,
  timeUntil,
  pipelineFunnel,
  type ControlData,
} from "@/lib/control/fetchers";

export const metadata: Metadata = {
  title: "The Hub",
  description: "AOH operator console.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

/**
 * SLICE 2 — LIVE DATA WIRING
 * Fetches Vercel + GitHub + GHL via lib/control/fetchers.ts.
 * When a fetcher returns null (env var missing or upstream error), the card
 * falls back to mock and shows a "needs creds" pill.
 *
 * Env vars required (set in Vercel project settings):
 *   VERCEL_TOKEN  VERCEL_PROJECT_ID  GITHUB_PAT  GHL_API_KEY  GHL_LOCATION_ID
 */

const MOCK = {
  warmCalls: [
    {
      name: "Cherrydale Lawn",
      reason: 'replied "interested in pricing"',
      tone: "hot" as const,
    },
    {
      name: "Bill, Southington Lawn",
      reason: "clicked /pricing 3× in 48h",
      tone: "warm" as const,
    },
    {
      name: "Hartford Insurance Brokers",
      reason: "ran /#calculator + viewed AI Visibility",
      tone: "warm" as const,
    },
  ],
};

export default async function ControlPage() {
  const data = await getControlData();

  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Compute fleet stats — count truthy real-data sources for "data healthy" tally
  const dataSources = {
    vercel: !!data.deploy,
    githubWebsite: !!data.commitsWebsite,
    githubTooling: !!data.commitsTooling,
    ghl: !!data.pipelines,
  };
  const liveSources = Object.values(dataSources).filter(Boolean).length;
  const allSourcesLive = liveSources === 4;

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
            {dateLine} · Refreshes every 60s
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allSourcesLive ? (
            <Pill tone="accent">live · {liveSources}/4 sources</Pill>
          ) : liveSources > 0 ? (
            <Pill tone="warm">partial · {liveSources}/4 sources</Pill>
          ) : (
            <Pill tone="warn">mock · 0/4 sources</Pill>
          )}
        </div>
      </header>

      {/* Fleet KPI strip */}
      <section className="mb-8">
        <FleetStrip active={2} total={9} doneToday={14} queued={23} />
      </section>

      {/* Agent cards — workforce view */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SchedulerCard data={data} />
        <ScoutCard data={data} />
        <ManagerCard data={data} />
        <GhlExpertCard data={data} />
        <EditorCard data={data} />
        <PressCard data={data} />
        <CoachCard />
        <SenderCard />
        <AuditorCard />
      </section>

      <footer className="mt-12 border-t border-zinc-800/60 pt-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          AOH · The Hub · slice 2 · {liveSources}/4 sources live · Vercel /
          GitHub / GHL
        </p>
      </footer>
    </ControlShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-agent cards
// ─────────────────────────────────────────────────────────────────────────────

function SchedulerCard({ data }: { data: ControlData }) {
  const events = data.todaysEvents;
  const realRows: OwnedRow[] = [];

  if (events && events.length > 0) {
    const upcoming = events
      .filter((e) => new Date(e.startTimeIso) > new Date())
      .slice(0, 3);
    const next = upcoming[0];

    for (const e of upcoming) {
      realRows.push({
        primary: `${fmtTime(e.startTimeIso)} · ${e.title}`,
        secondary: `${timeUntil(e.startTimeIso)} · GHL calendar`,
        badge: { tone: e === next ? "hot" : "default", label: timeUntil(e.startTimeIso) },
      });
    }
    realRows.push({
      primary: "This week",
      secondary: `${events.length} events today`,
      badge: { tone: "accent", label: "live" },
    });
  } else {
    realRows.push(
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
    );
  }

  return (
    <AgentCard
      name="Scheduler"
      role="Time defender · books demos · briefs you before calls"
      status="manual"
      cadence={events ? "live · Google Cal + GHL" : "manual today · via Google Cal + GHL"}
      activity={{
        lastDone: events && events.length > 0
          ? `Most recent event ${fmtTime(events[0].startTimeIso)}`
          : "9:00am today — confirmed Cherrydale demo for 11:00am",
        doingNow: events && events.length > 0
          ? `${events.length} events on the calendar today`
          : "Manual via Google Cal + GHL",
        upNext: "When agent ships (slot 5b): defends focus blocks + auto-briefs",
      }}
      ownedTitle={events ? "Today's events · GHL live" : "Today's agenda · MOCK (needs GHL_API_KEY)"}
      ownedRows={realRows}
      ownedFooter={
        <div className="flex gap-2">
          <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
            pre-meeting brief
          </button>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900"
          >
            open Google Cal
          </a>
        </div>
      }
    />
  );
}

function ScoutCard({ data }: { data: ControlData }) {
  const opps = data.reviewsOutreach.opportunities;
  const realRows: OwnedRow[] = [];

  // Heuristic: warm = opportunities in stages with "warm" or "engaged" in name
  if (opps && data.reviewsOutreach.pipeline) {
    const stages = new Map(
      data.reviewsOutreach.pipeline.stages.map((s) => [s.id, s.name.toLowerCase()]),
    );
    const warm = opps.filter((o) => {
      const stage = stages.get(o.pipelineStageId) ?? "";
      return /warm|hot|replied|engaged/.test(stage);
    });
    for (const w of warm.slice(0, 3)) {
      realRows.push({
        primary: w.name,
        secondary: `${stages.get(w.pipelineStageId) ?? "warm"} · ${
          w.updatedAt ? relativeTime(w.updatedAt) : "recent"
        }`,
        badge: { tone: "warm", label: "warm" },
      });
    }
    if (warm.length === 0) {
      realRows.push({
        primary: "No warm leads ready",
        secondary: "Scout's last run found 0 prospects warm enough to call",
        badge: { tone: "muted", label: "quiet" },
      });
    }
  } else {
    for (const c of MOCK.warmCalls) {
      realRows.push({
        primary: c.name,
        secondary: c.reason,
        badge: { tone: c.tone, label: c.tone },
      });
    }
  }

  return (
    <AgentCard
      name="Scout"
      role="Prospect researcher · finds warm leads"
      status="live"
      cadence="daily · 7:00am"
      activity={{
        lastDone: "7:00am today — pulled 14 prospects across 3 niches",
        doingNow: "Idle until tomorrow's 7am run",
        upNext: "Tomorrow 7:00am — same 3 niches",
      }}
      ownedTitle={
        opps
          ? `Warm leads · GHL live · ${realRows.length} ready`
          : "Today's warm leads · MOCK (needs GHL_API_KEY)"
      }
      ownedRows={realRows}
      ownedFooter={
        <div className="flex gap-2">
          <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
            view all prospects
          </button>
          <button className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900">
            open GHL pipeline
          </button>
        </div>
      }
    />
  );
}

function ManagerCard({ data }: { data: ControlData }) {
  const sourcesLive = [
    data.deploy ? "Vercel ✓" : "Vercel ✗",
    data.commitsWebsite ? "GitHub ✓" : "GitHub ✗",
    data.pipelines ? "GHL ✓" : "GHL ✗",
  ].join(" · ");

  return (
    <AgentCard
      name="Manager"
      role="Fleet orchestrator · runs the team"
      status="live"
      cadence="always on"
      activity={{
        lastDone: "9:42am today — queued Coach build slot 5",
        doingNow: `Monitoring data sources: ${sourcesLive}`,
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
  );
}

function GhlExpertCard({ data }: { data: ControlData }) {
  const reviewsFunnel = pipelineFunnel(
    data.reviewsOutreach.pipeline,
    data.reviewsOutreach.opportunities,
  );
  const aiVisFunnel = pipelineFunnel(
    data.aiVisOutreach.pipeline,
    data.aiVisOutreach.opportunities,
  );

  const realRows: OwnedRow[] = [];

  if (data.pipelines) {
    realRows.push({
      primary: "Pipelines discovered",
      secondary: data.pipelines.map((p) => p.name).join(" · ") || "none",
      badge: { tone: "accent", label: `${data.pipelines.length}` },
    });
    if (reviewsFunnel) {
      realRows.push({
        primary: "Reviews Outreach pipeline",
        secondary: `${reviewsFunnel.enrolled} enrolled · ${reviewsFunnel.engaged} engaged · ${reviewsFunnel.warm} warm · ${reviewsFunnel.booked} booked`,
        badge: { tone: "accent", label: "healthy" },
      });
    }
    if (aiVisFunnel) {
      realRows.push({
        primary: "AI Visibility Outreach pipeline",
        secondary: `${aiVisFunnel.enrolled} enrolled · ${aiVisFunnel.engaged} engaged · ${aiVisFunnel.warm} warm · ${aiVisFunnel.booked} booked`,
        badge: { tone: "accent", label: "healthy" },
      });
    }
  } else {
    realRows.push(
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
    );
  }

  return (
    <AgentCard
      name="GHL Expert"
      role="Workflow watchdog · monitors every GHL automation"
      status="manual"
      cadence={data.pipelines ? "live · GHL polled every 60s" : "manual today · continuous when live"}
      activity={{
        lastDone: data.pipelines
          ? `Polled GHL · ${data.pipelines.length} pipelines mapped`
          : "9:00am today — Mike confirmed Review Automation workflow firing",
        doingNow: data.pipelines ? "Watching pipeline stages + opportunity flow" : "Manual via Hub360ai admin",
        upNext: "Agent build slot 5c — add workflow exec count + webhook latency tracking",
      }}
      ownedTitle={data.pipelines ? "GHL pipeline health · live" : "GHL surfaces · MOCK (needs GHL_API_KEY)"}
      ownedRows={realRows}
      ownedFooter={
        <div className="flex gap-2">
          <button className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
            view workflow log
          </button>
          <a
            href="https://app.hub360ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900"
          >
            open Hub360 admin
          </a>
        </div>
      }
    />
  );
}

function EditorCard({ data: _data }: { data: ControlData }) {
  return (
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
        { primary: "review-velocity 90-day rule", secondary: "approved · in draft", badge: { tone: "warm", label: "draft" } },
        { primary: "dental compounding asset", secondary: "approved · ready for Press", badge: { tone: "accent", label: "ready" } },
        { primary: "46 beats 50 — star rating sweet spot", secondary: "approved · ready for Press", badge: { tone: "accent", label: "ready" } },
        { primary: "pet groomers reviews decide bookings", secondary: "approved · in draft", badge: { tone: "warm", label: "draft" } },
      ]}
    />
  );
}

function PressCard({ data }: { data: ControlData }) {
  const realRows: OwnedRow[] = [];

  if (data.commitsWebsite) {
    for (const c of data.commitsWebsite.slice(0, 3)) {
      realRows.push({
        primary: c.message.slice(0, 60),
        secondary: `${c.sha} · ${c.author} · ${relativeTime(c.dateIso)}`,
        badge: { tone: "accent", label: c.sha },
      });
    }
    if (data.commitsTooling) {
      const t = data.commitsTooling[0];
      if (t) {
        realRows.push({
          primary: `aoh-tooling · ${t.message.slice(0, 50)}`,
          secondary: `${t.sha} · ${relativeTime(t.dateIso)}`,
          badge: { tone: "default", label: t.sha },
        });
      }
    }
  } else {
    realRows.push(
      { primary: "Wed 9am · after-hours payback", secondary: "LinkedIn · Facebook · Instagram · X", badge: { tone: "accent", label: "scheduled" } },
      { primary: "Thu 9am · reviews-compound", secondary: "LinkedIn · Facebook", badge: { tone: "accent", label: "scheduled" } },
      { primary: "Fri 9am · 46 beats 50", secondary: "LinkedIn · Instagram", badge: { tone: "accent", label: "scheduled" } },
      { primary: "Sat 10am · diy-vs-dfy", secondary: "LinkedIn · Facebook", badge: { tone: "accent", label: "scheduled" } },
    );
  }

  return (
    <AgentCard
      name="Press v0"
      role="Content publisher · ships to GHL + socials"
      status="manual"
      cadence="manual · via Claude"
      activity={{
        lastDone: data.commitsWebsite?.[0]
          ? `${data.commitsWebsite[0].sha} — ${data.commitsWebsite[0].message.slice(0, 60)} (${relativeTime(data.commitsWebsite[0].dateIso)})`
          : "2026-05-16 — restored /#calculator CTAs in after-hours pack",
        doingNow: "4 posts queued in GHL for this week",
        upNext: "Wed 9:00am — after-hours payback (LI · FB · IG · X)",
      }}
      ownedTitle={
        data.commitsWebsite
          ? "Recent commits · GitHub live"
          : "This week's schedule · MOCK (needs GITHUB_PAT)"
      }
      ownedRows={realRows}
    />
  );
}

function CoachCard() {
  return (
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
  );
}

function SenderCard() {
  return (
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
  );
}

function AuditorCard() {
  return (
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
        { primary: "Site signals", secondary: "calc_run + contact_submit events live in Vercel Analytics", badge: { tone: "accent", label: "tracking" } },
      ]}
      ownedFooter={
        <a
          href="https://vercel.com/aoh-inc/aoh-website/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-300"
        >
          open Vercel Analytics →
        </a>
      }
    />
  );
}
