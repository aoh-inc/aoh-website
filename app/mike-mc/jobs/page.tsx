import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  SCHEDULED_JOB_COSTS,
  costPerBookedCall,
  daysRunning,
  formatUsd,
  totalCost,
  type JobCostStatus,
  type ScheduledJobCost,
} from "@/lib/control/job-costs";

export const metadata: Metadata = {
  title: "Scheduled Jobs - The Hub",
  description: "AOH scheduled job costs and workflow tracking.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function JobsPage() {
  const now = new Date();
  const totalDaily = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.dailyCostUsd, 0);
  const totalToDate = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + totalCost(job, now), 0);
  const bookedCalls = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.bookedCalls, 0);
  const wonRevenue = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.wonRevenueUsd, 0);
  const reachJob = SCHEDULED_JOB_COSTS.find((job) => job.slug === "reviews-outreach");

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-3 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Scheduled Jobs + Workflow Ledger
          </h1>
          <p className="mt-1.5 text-base text-zinc-400">
            The sales story, agent handoffs, daily run cost, and whether each job is paying for itself.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Pill tone="warn">estimated until telemetry</Pill>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Daily run cost" value={formatUsd(totalDaily)} tone="warm" />
        <Metric label="Total to date" value={formatUsd(totalToDate)} />
        <Metric label="Booked calls" value={bookedCalls.toString()} />
        <Metric label="Won revenue" value={formatUsd(wonRevenue)} tone={wonRevenue > totalToDate ? "accent" : "muted"} />
      </section>

      {reachJob ? <ReachWorkflowHero job={reachJob} /> : null}

      <section className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Cost source
            </p>
            <p className="mt-1 max-w-none text-base leading-relaxed text-zinc-400">
              These are operating estimates, not live vendor bills yet. The page is shaped so real OpenClaw,
              GHL, enrichment, email, and model usage can replace the estimates once telemetry is wired.
            </p>
          </div>
          <Pill tone="muted">v0 ledger</Pill>
        </div>
      </section>

      <section className="space-y-5">
        {SCHEDULED_JOB_COSTS.map((job, index) => (
          <JobCostCard key={job.slug} job={job} now={now} featured={index === 0} />
        ))}
      </section>
    </ControlShell>
  );
}

function ReachWorkflowHero({ job }: { job: ScheduledJobCost }) {
  return (
    <section className="mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 p-5 shadow-2xl shadow-black/30 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone="accent">Reach product</Pill>
            <Pill tone="muted">sales workflow</Pill>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
            What Reach does
          </h2>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-300">
            {job.reachPart ?? job.overview}
          </p>
          <p className="mt-4 max-w-none text-base leading-relaxed text-zinc-500">
            The company buying Reach is buying a managed outbound system: prospect selection,
            enrichment, outreach, reply handling, booking, and cost review.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {job.salesAgentTasks.map((task, index) => (
            <WorkflowStep
              key={task.title}
              index={index + 1}
              title={task.title}
              description={task.description}
              owner={task.owner}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm" | "muted";
}) {
  const valueClass = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    muted: "text-zinc-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function JobCostCard({
  job,
  now,
  featured,
}: {
  job: ScheduledJobCost;
  now: Date;
  featured?: boolean;
}) {
  const total = totalCost(job, now);
  const cpb = costPerBookedCall(job, now);
  const days = daysRunning(job.startedOn, now);
  const roi = job.wonRevenueUsd - total;

  return (
    <article
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-xl shadow-black/25 ${
        featured
          ? "border-emerald-500/35 from-emerald-950/30 to-zinc-950"
          : "border-zinc-800/60 from-zinc-900/60 to-zinc-950"
      }`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {featured ? <Pill tone="accent">Reach core</Pill> : null}
            <Pill tone={statusTone(job.status)}>{statusLabel(job.status)}</Pill>
            <Pill tone="muted">{job.cadence}</Pill>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
            {job.name}
          </h2>
          <p className="mt-1 text-base text-zinc-500">
            {job.service} - {job.owner}
          </p>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-400">
            {job.notes}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[34rem]">
          <MiniMetric label="Per day" value={formatUsd(job.dailyCostUsd)} tone="warm" />
          <MiniMetric label="To date" value={formatUsd(total)} />
          <MiniMetric label="Booked" value={job.bookedCalls.toString()} />
          <MiniMetric
            label="Cost/booked"
            value={cpb === null ? "--" : formatUsd(cpb)}
            tone={cpb === null ? "muted" : "accent"}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Job overview
          </h3>
          <p className="mt-2 text-base leading-relaxed text-zinc-400">{job.overview}</p>
          {job.reachPart ? (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                Part of Reach
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{job.reachPart}</p>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Full workflow
          </h3>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <WorkflowColumn title="Possible sales-agent tasks" tasks={job.salesAgentTasks} tone="accent" />
            <WorkflowColumn title="Internal control work" tasks={job.internalTasks} tone="muted" />
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-zinc-800/70 bg-black/20 p-4">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Agent roles
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {job.agentRoles.map((item) => (
            <div key={`${job.slug}-${item.agent}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                {item.agent}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr] 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Cost breakdown
            </h3>
            <span className="text-sm text-zinc-600">{days} day run</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {job.costBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-base">
                <span className="text-zinc-400">{item.label}</span>
                <span className="font-mono text-zinc-200">{formatUsd(item.amountUsd)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Worth it check
          </h3>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            <MiniMetric label="Won revenue" value={formatUsd(job.wonRevenueUsd)} />
            <MiniMetric label="Net so far" value={formatUsd(roi)} tone={roi >= 0 ? "accent" : "warm"} />
            <MiniMetric label="Pipeline value" value={formatUsd(job.estimatedPipelineValueUsd)} />
            <MiniMetric label="Next run" value={job.nextRun} compact />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.checks.map((check) => (
              <span
                key={check}
                className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-sm text-zinc-500"
              >
                {check}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkflowStep({
  index,
  title,
  description,
  owner,
}: {
  index: number;
  title: string;
  description: string;
  owner: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/25 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-emerald-300">
          Step {index}
        </span>
        <span className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
          {owner}
        </span>
      </div>
      <p className="mt-3 text-base font-semibold text-zinc-100">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}

function WorkflowColumn({
  title,
  tasks,
  tone,
}: {
  title: string;
  tasks: ScheduledJobCost["salesAgentTasks"];
  tone: "accent" | "muted";
}) {
  const titleClass = tone === "accent" ? "text-emerald-300" : "text-zinc-400";

  return (
    <div>
      <p className={`font-mono text-xs uppercase tracking-wider ${titleClass}`}>
        {title}
      </p>
      <div className="mt-2 space-y-2">
        {tasks.map((task) => (
          <div key={`${title}-${task.title}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-medium text-zinc-200">{task.title}</p>
              <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
                {task.owner}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone = "default",
  compact,
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm" | "muted";
  compact?: boolean;
}) {
  const valueClass = {
    default: "text-zinc-100",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    muted: "text-zinc-500",
  }[tone];

  return (
    <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p className={`mt-1 font-mono font-semibold ${compact ? "text-sm" : "text-lg"} ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function statusTone(status: JobCostStatus) {
  if (status === "worth-it") return "accent";
  if (status === "watch") return "warm";
  if (status === "paused") return "danger";
  return "muted";
}

function statusLabel(status: JobCostStatus) {
  if (status === "worth-it") return "worth it";
  if (status === "watch") return "watch cost";
  if (status === "paused") return "paused";
  return "too early";
}
