import type { Metadata } from "next";
import Link from "next/link";
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
import {
  AGENT_SKILLS,
  BOARD_COLUMNS,
  BOARD_TASKS,
  SCHEDULED_WORK,
  SERVICES,
  type BoardStatus,
  type BoardTask,
  type MissionTone,
} from "@/lib/control/mission";
import { INTERNAL_JOBS } from "@/lib/control/internal-jobs";
import { SCHEDULED_JOB_COSTS } from "@/lib/control/job-costs";

export const metadata: Metadata = {
  title: "The Hub",
  description: "AOH operator console.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const OPENCLAW_HREF = "/api/openclaw/login";
const DISCOVERY_BOOKING_HREF = "https://link.hub360ai.com/widget/booking/1Xq9XMNFjvxgxQj9kNLY";

/**
 * SLICE 2 — LIVE DATA WIRING
 * Fetches Vercel + GitHub + GHL via lib/control/fetchers.ts.
 * When a fetcher returns null (env var missing or upstream error), the card
 * falls back to mock and shows a "needs creds" pill.
 *
 * Env vars required (set in Vercel project settings):
 *   VERCEL_TOKEN  GITHUB_PAT  GHL_PIT_TOKEN  GHL_LOCATION_ID
 * (VERCEL_PROJECT_ID has a hardcoded fallback)
 */

const MOCK = {
  warmCalls: [
    {
      name: "Sample Lawn Co",
      reason: 'replied "interested in pricing"',
      tone: "hot" as const,
    },
    {
      name: "Sample HVAC Co",
      reason: "clicked /pricing 3× in 48h",
      tone: "warm" as const,
    },
    {
      name: "Sample Med Spa",
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
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/mike-mc/ops"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Ops Docs
          </a>
          <a
            href="/mike-mc/jobs"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Job Index
          </a>
          <a
            href="/mike-mc/campaigns"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Campaigns
          </a>
          <a
            href="/mike-mc/team"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Org Chart
          </a>
          <a
            href={OPENCLAW_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Open OpenClaw
          </a>
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
        <FleetStrip active={2} total={10} doneToday={14} queued={23} />
      </section>

      <JobsInProgressSection />
      <TeamTrackerSection />

      {/* Agent cards — workforce view */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SchedulerCard data={data} />
        <ScoutCard data={data} />
        <ManagerCard data={data} />
        <GhlExpertCard data={data} />
        <ProfileCard />
        <EditorCard data={data} />
        <PressCard data={data} />
        <CoachCard />
        <SenderCard />
        <AuditorCard />
      </section>

      <ServiceMapSection />
      <MissionBoardSection />
      <AgentSkillsSection />
      <ScheduledWorkSection />

      <footer className="mt-12 border-t border-zinc-800/60 pt-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          AOH · The Hub · slice 3 · {liveSources}/4 sources live · Vercel /
          GitHub / GHL
        </p>
      </footer>
    </ControlShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-agent cards
// ─────────────────────────────────────────────────────────────────────────────

function JobsInProgressSection() {
  const job = INTERNAL_JOBS[0];
  const jobLinks = [
    {
      title: "Find new leads",
      href: "/mike-mc/jobs#commercial-reach",
      badge: "main job",
      tone: "accent" as const,
      detail: "Agents find businesses, send outreach, sort replies, and book calls.",
    },
    {
      title: "Agent steps",
      href: "/mike-mc/jobs#commercial-reach-steps",
      badge: "steps",
      tone: "warm" as const,
      detail: "Plain view of what each agent does along the job.",
    },
    {
      title: "Custom agents",
      href: "/mike-mc/jobs#custom-agent-layer",
      badge: "optional",
      tone: "muted" as const,
      detail: "Only for clients who want agents connected to their CRM or business software.",
    },
    {
      title: "Email send status",
      href: job.href,
      badge: "internal",
      tone: "warn" as const,
      detail: "Shows whether emails are ready to send or still blocked.",
    },
    {
      title: "Spending",
      href: "/mike-mc/jobs",
      badge: `${SCHEDULED_JOB_COSTS.length} jobs`,
      tone: "default" as const,
      detail: "Simple daily cost and spend so far by job.",
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">
            Job index
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            What agents are doing
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            A simple view for you as the owner: active jobs, what agents are doing, and where money is going.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="warm">{INTERNAL_JOBS.length} active room</Pill>
          <Pill tone="muted">{SCHEDULED_JOB_COSTS.length} jobs tracked</Pill>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {jobLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-snug text-zinc-100">
                {link.title}
              </h3>
              <Pill tone={link.tone}>{link.badge}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{link.detail}</p>
          </Link>
        ))}
      </div>

      <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill tone={job.statusTone}>{job.status}</Pill>
              <Pill tone="muted">owner: {job.owner}</Pill>
            </div>
            <Link
              href={job.href}
              className="text-xl font-semibold tracking-tight text-zinc-50 transition hover:text-amber-200"
            >
              {job.title}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {job.summary}
            </p>
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm leading-relaxed text-amber-100/90">
              Blocked on: {job.currentBlocker}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-2">
              {job.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-zinc-800/70 bg-black/20 p-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold text-zinc-100">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={job.href}
              className="mt-3 inline-flex rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-200 transition hover:bg-amber-500/20"
            >
              Open job room
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-zinc-800/60 pt-4 md:grid-cols-3">
          {job.lanes.map((lane) => (
            <div key={lane.name} className="rounded-lg border border-zinc-800/70 bg-black/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  {lane.name}
                </p>
                <Pill tone={lane.tone}>{lane.dripState}</Pill>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{lane.status}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                {lane.rows} - {lane.qa}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function TeamTrackerSection() {
  const focusTasks = BOARD_TASKS.filter(
    (task) =>
      task.title.includes("Campaign Reply Router") ||
      task.title.includes("controlled Reach offer") ||
      task.title.includes("first-hour campaign watch"),
  );

  return (
    <section className="mb-8 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            Team tracker
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Campaign launch work
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Website reports are verified. Scaled sending waits on GHL reply routing, Systems Director proof,
            then Sender.
          </p>
        </div>
        <Pill tone="warn">send blocked until QA</Pill>
      </div>
      <div className="mb-4">
        <a
          href="/mike-mc/campaigns"
          className="inline-flex rounded-md border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-sky-300 transition hover:bg-sky-500/20"
        >
          Open campaign launch room
        </a>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {focusTasks.map((task) => (
          <article key={task.title} className="rounded-xl border border-zinc-800/70 bg-black/25 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-snug text-zinc-100">{task.title}</h3>
              <Pill tone={priorityTone(task.priority)}>{task.status}</Pill>
            </div>
            <div className="space-y-1 text-xs text-zinc-500">
              <p>Owner: {task.agent}</p>
              <p>Reviewer: {task.reviewer ?? "Manager"}</p>
              <p>Due: {task.due}</p>
            </div>
            {task.reviewChecks ? (
              <ul className="mt-3 space-y-1 text-[11px] leading-snug text-zinc-500">
                {task.reviewChecks.slice(0, 3).map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function SchedulerCard({ data }: { data: ControlData }) {
  const events = data.todaysEvents;
  const calendar = data.discoveryCalendar;
  const realRows: OwnedRow[] = [];
  const schedulerLive = events !== null;

  if (events) {
    const upcoming = events.slice(0, 4);
    const next = upcoming[0];

    for (const e of upcoming) {
      realRows.push({
        primary: `${fmtTime(e.startTimeIso)} · ${e.title}`,
        secondary: `${timeUntil(e.startTimeIso)} · AOH calendar ${e.kind === "blocked" ? "block" : "appointment"}`,
        badge: { tone: e === next ? "hot" : "default", label: timeUntil(e.startTimeIso) },
      });
    }

    realRows.push({
      primary: calendar?.name ?? "AOH calendar",
      secondary:
        events.length > 0
          ? `${events.length} AOH calendar item${events.length === 1 ? "" : "s"} today`
          : "Connected to AOH calendar - no remaining items today",
      badge: { tone: "accent", label: "live" },
    });
  } else {
    realRows.push({
      primary: "AOH calendar",
      secondary: "Calendar data unavailable - check HighLevel API/token",
      badge: { tone: "warn", label: "check" },
    });
  }

  return (
    <AgentCard
      name="Scheduler"
      role="Time defender · books demos · briefs you before calls"
      status={schedulerLive ? "live" : "manual"}
      cadence={schedulerLive ? "live - AOH HighLevel calendar" : "manual today - AOH calendar check needed"}
      activity={{
        lastDone: schedulerLive
          ? `${calendar?.name ?? "AOH calendar"} connected`
          : "AOH calendar data unavailable",
        doingNow: schedulerLive
          ? `${events.length} AOH calendar item${events.length === 1 ? "" : "s"} today`
          : "Check HighLevel calendar API/token",
        upNext: "Add manual AOH-only items as HighLevel appointments or block slots",
      }}
      ownedTitle={schedulerLive ? "Today's AOH calendar - HighLevel live" : "Today's AOH calendar - needs GHL check"}
      ownedRows={realRows}
      ownedFooter={
        <div className="flex gap-2">
          <a
            href={DISCOVERY_BOOKING_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20"
          >
            open booking page
          </a>
          <a
            href="https://app.hub360ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900"
          >
            open AOH calendar
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
          : "Today's warm leads · MOCK (needs GHL_PIT_TOKEN)"
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
        { primary: "Planned", secondary: "Sender · Systems Director + 4 more", badge: { tone: "muted", label: "6" } },
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
  const activeTask = BOARD_TASKS.find(
    (task) =>
      task.agent === "GHL Expert" &&
      task.status === "In Progress" &&
      task.title.includes("aoh-talk"),
  );

  if (activeTask) {
    realRows.push({
      primary: activeTask.title,
      secondary: `${activeTask.service} · reviewer: ${activeTask.reviewer ?? "Systems Director"} · due ${activeTask.due}`,
      badge: { tone: "warm", label: "working" },
    });
  }

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
        doingNow: activeTask
          ? "Working on AOH /aoh-talk Discovery Round Robin calendar"
          : data.pipelines ? "Watching pipeline stages + opportunity flow" : "Manual via Hub360ai admin",
        upNext: "Agent build slot 5c — add workflow exec count + webhook latency tracking",
      }}
      ownedTitle={data.pipelines ? "GHL pipeline health · live" : "GHL surfaces · MOCK (needs GHL_PIT_TOKEN)"}
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

function ProfileCard() {
  return (
    <AgentCard
      name="Local Visibility Manager"
      role="Google profile + local visibility"
      status="planned"
      cadence="build after Coach"
      activity={{
        doingNow: "Not yet built - job definition added to Mission Control",
        upNext: "AOH Google Business Profile audit as client zero",
      }}
      ownedTitle="Will own"
      ownedRows={[
        { primary: "Google Business Profile audit/fix", secondary: "categories, services, hours, photos, description", badge: { tone: "accent", label: "core" } },
        { primary: "Citation/NAP consistency", secondary: "name, address, phone, website drift checks", badge: { tone: "default", label: "weekly" } },
        { primary: "AI visibility signals", secondary: "reviews, trust signals, local proof, monthly benchmark", badge: { tone: "warm", label: "soon" } },
      ]}
    />
  );
}

function EditorCard({}: { data: ControlData }) {
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
      name="Systems Director"
      role="IT stack · security + tool health"
      status="planned"
      cadence="build LAST · slot 11"
      activity={{
        doingNow: "Not yet built - Mike watches manually",
        upNext: "Owns tech-stack review once Mission Control jobs stabilize",
      }}
      ownedTitle="Will own (Mike's manual watch today)"
      ownedRows={[
        { primary: "Tool stack review", secondary: "OpenClaw, VPS, GitHub, Vercel, Slack, GHL", badge: { tone: "warn", label: "manual" } },
        { primary: "Security and access checks", secondary: "tokens, stale permissions, exposed URLs, backups", badge: { tone: "warn", label: "manual" } },
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

function ServiceMapSection() {
  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Services"
        title="Offerings -> agents -> skills"
        sub="Built as client x service x task so this can scale past 50 clients without one giant board."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SERVICES.map((service) => (
          <article
            key={service.slug}
            className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 shadow-xl shadow-black/30"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  {service.job}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-50">
                  {service.name}
                </h2>
              </div>
              <div className="flex gap-1.5">
                <Pill tone={service.blocked > 0 ? "warn" : "accent"}>
                  {service.openTasks} open
                </Pill>
                <Pill tone="muted">{service.activeClients} clients</Pill>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {service.outcome}
            </p>
            <LabelList label="Agents" items={service.agents} />
            <LabelList label="Skills" items={service.skills} muted />
          </article>
        ))}
      </div>
    </section>
  );
}

function MissionBoardSection() {
  const grouped = new Map<BoardStatus, BoardTask[]>();
  for (const column of BOARD_COLUMNS) grouped.set(column, []);
  for (const task of BOARD_TASKS) {
    grouped.get(task.status)?.push(task);
  }

  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Mission board"
        title="Trello-style work queue"
        sub="Mission Control owns task state. Slack should create, move, query, and alert from this board."
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
        {BOARD_COLUMNS.map((column) => (
          <div
            key={column}
            className="min-h-48 rounded-2xl border border-zinc-800/60 bg-black/20 p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                {column}
              </h3>
              <Pill tone="muted">{grouped.get(column)?.length ?? 0}</Pill>
            </div>
            <div className="space-y-2">
              {(grouped.get(column) ?? []).map((task) => (
                <TaskCard key={task.title} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgentSkillsSection() {
  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Skill loadout"
        title="What each agent must know"
        sub="These are the initial skill profiles to load into agent identities before real client work starts."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENT_SKILLS.map((profile) => (
          <article
            key={profile.agent}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-950/80 p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-mono text-base font-bold uppercase tracking-wider text-zinc-50">
                  {profile.agent}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{profile.role}</p>
              </div>
              <Pill tone="default">{profile.skills.length}</Pill>
            </div>
            <LabelList label="Services" items={profile.serviceOwners} />
            <LabelList label="Skills" items={profile.skills} muted />
            {profile.sourceDocs ? (
              <LabelList label="Source docs" items={profile.sourceDocs} muted />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ScheduledWorkSection() {
  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Scheduled work"
        title="Recurring checks to keep 50+ clients sane"
        sub="These are the boring-but-vital tasks agents should run before problems reach Mike."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SCHEDULED_WORK.map((item) => (
          <article
            key={`${item.cadence}-${item.title}`}
            className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  {item.cadence}
                </p>
                <h3 className="mt-1 text-base font-semibold text-zinc-50">
                  {item.title}
                </h3>
              </div>
              <Pill tone="accent">{item.owner}</Pill>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-zinc-500">
              {item.reason}
            </p>
            <LabelList label="Checks" items={item.checks} muted />
          </article>
        ))}
      </div>
    </section>
  );
}

function TaskCard({ task }: { task: BoardTask }) {
  const tone = priorityTone(task.priority);

  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug text-zinc-100">
          {task.title}
        </h4>
        <Pill tone={tone}>{task.priority}</Pill>
      </div>
      <div className="space-y-1 text-xs text-zinc-500">
        <p>
          <span className="font-mono uppercase tracking-wider text-zinc-600">Client</span>{" "}
          {task.client}
        </p>
        <p>
          <span className="font-mono uppercase tracking-wider text-zinc-600">Owner</span>{" "}
          {task.agent}
        </p>
        {task.reviewer ? (
          <p>
            <span className="font-mono uppercase tracking-wider text-zinc-600">Reviewer</span>{" "}
            {task.reviewer}
          </p>
        ) : null}
        <p>
          <span className="font-mono uppercase tracking-wider text-zinc-600">Due</span>{" "}
          {task.due}
        </p>
      </div>
      {task.reviewChecks ? (
        <div className="mt-3 rounded-lg border border-zinc-800 bg-black/20 p-2">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            QA checks
          </p>
          <ul className="space-y-1 text-[11px] leading-snug text-zinc-500">
            {task.reviewChecks.slice(0, 4).map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="mb-5 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{sub}</p>
    </header>
  );
}

function LabelList({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-md border px-2 py-1 text-xs ${
              muted
                ? "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function priorityTone(priority: BoardTask["priority"]): MissionTone {
  if (priority === "P0") return "danger";
  if (priority === "P1") return "warm";
  if (priority === "P2") return "accent";
  return "muted";
}
