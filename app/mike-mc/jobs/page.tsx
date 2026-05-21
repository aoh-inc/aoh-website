import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  REACH_COMMERCIAL_DEMO,
  REACH_INTERNAL_FLOW,
  REACH_OPTIONAL_AGENT_FLOW,
  SCHEDULED_JOB_COSTS,
  costPerBookedCall,
  daysRunning,
  formatUsd,
  totalCost,
  type ReachInternalStep,
  type JobCostStatus,
  type ScheduledJobCost,
} from "@/lib/control/job-costs";

export const metadata: Metadata = {
  title: "Agent Jobs - The Hub",
  description: "A simple view of what AOH agents are doing and what each job costs.",
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
            Agent Jobs
          </h1>
          <p className="mt-1.5 text-base text-zinc-400">
            What agents are doing, what it costs, and what needs a decision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Link
            href="/mike-mc/campaigns"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Campaigns
          </Link>
          <Pill tone="warm">simple owner view</Pill>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Daily spend" value={formatUsd(totalDaily)} tone="warm" />
        <Metric label="Spent so far" value={formatUsd(totalToDate)} />
        <Metric label="Calls booked" value={bookedCalls.toString()} />
        <Metric label="Revenue won" value={formatUsd(wonRevenue)} tone={wonRevenue > totalToDate ? "accent" : "muted"} />
      </section>

      <JobIndexSection />
      {reachJob ? <ReachWorkflowHero job={reachJob} /> : null}
      <CommercialReachFlowSection />
      <OptionalCustomAgentSection />

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Spending
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              Simple job spend breakout
            </h2>
            <p className="mt-2 text-base leading-relaxed text-zinc-400">
              Estimates for now. Use this to decide keep, pause, or improve.
            </p>
          </div>
          <Pill tone="muted">estimated</Pill>
        </div>
        {SCHEDULED_JOB_COSTS.map((job, index) => (
          <JobCostCard key={job.slug} job={job} now={now} featured={index === 0} />
        ))}
      </section>
    </ControlShell>
  );
}

function JobIndexSection() {
  const links = [
    {
      title: "Find new leads",
      label: "main job",
      tone: "accent" as const,
      href: "#commercial-reach",
      detail: "Agents find local businesses, start conversations, and try to book calls.",
    },
    {
      title: "What agents do",
      label: "steps",
      tone: "warm" as const,
      href: "#commercial-reach-steps",
      detail: "A plain step-by-step view you can explain to a business owner.",
    },
    {
      title: "Custom agents",
      label: "optional",
      tone: "muted" as const,
      href: "#custom-agent-layer",
      detail: "Only for clients who want agents connected to their CRM or business software.",
    },
    {
      title: "Send status",
      label: "internal",
      tone: "warn" as const,
      href: "/mike-mc/jobs/reach-cold-email-campaign",
      detail: "Your internal room for whether emails are ready to send or still blocked.",
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Job index
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Quick job menu
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            Start here. Keep the sales story simple: agents find prospects, send useful outreach,
            sort replies, and book interested people.
          </p>
        </div>
        <Pill tone="accent">simple view</Pill>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {links.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug text-zinc-100">{item.title}</h3>
              <Pill tone={item.tone}>{item.label}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{item.detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReachWorkflowHero({ job }: { job: ScheduledJobCost }) {
  return (
    <section id="commercial-reach" className="scroll-mt-8 mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 p-5 shadow-2xl shadow-black/30 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone="accent">main growth job</Pill>
            <Pill tone="muted">simple offer</Pill>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
            Commercial Reach: find businesses and start conversations
          </h2>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-300">
            {job.reachPart ?? job.overview}
          </p>
          <p className="mt-4 max-w-none text-base leading-relaxed text-zinc-500">
            Say it plainly: agents find businesses that look like a fit, check the contact info,
            send a useful first message, sort replies, and move interested people to a call.
            Connecting to a client&apos;s CRM is optional extra work.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {REACH_COMMERCIAL_DEMO.map((item, index) => (
            <div key={item.title} className="rounded-xl border border-emerald-500/20 bg-black/25 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                Step {index + 1}
              </p>
              <p className="mt-3 text-base font-semibold text-zinc-100">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommercialReachFlowSection() {
  return (
    <section id="commercial-reach-steps" className="scroll-mt-8 mb-8 rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 shadow-xl shadow-black/25 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
            Commercial Reach - standard job
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            What agents do step by step
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            This is the customer-friendly version. It shows the work without the technical plumbing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">ready</Pill>
          <Pill tone="warm">working</Pill>
          <Pill tone="muted">manual</Pill>
          <Pill tone="danger">blocked</Pill>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {REACH_INTERNAL_FLOW.map((step, index) => (
          <InternalStepCard key={step.title} step={step} index={index + 1} />
        ))}
      </div>
    </section>
  );
}

function OptionalCustomAgentSection() {
  return (
    <section id="custom-agent-layer" className="scroll-mt-8 mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
            Optional add-on
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Custom agents after the sale
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            This is extra work for businesses that want agents connected to their CRM or daily
            business software. It is not needed for every client.
          </p>
        </div>
        <Pill tone="muted">optional</Pill>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {REACH_OPTIONAL_AGENT_FLOW.map((step, index) => (
          <InternalStepCard key={step.title} step={step} index={index + 1} />
        ))}
      </div>
    </section>
  );
}

function InternalStepCard({
  step,
  index,
}: {
  step: ReachInternalStep;
  index: number;
}) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Step {index}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-snug text-zinc-100">
            {step.title}
          </h3>
        </div>
        <Pill tone={flowStatusTone(step.status)}>{flowStatusLabel(step.status)}</Pill>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.description}</p>
      <div className="mt-4 rounded-lg border border-zinc-800/70 bg-black/20 p-3">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Agent
        </p>
        <p className="mt-1 text-sm text-zinc-300">{step.owner}</p>
      </div>
    </article>
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
            {featured ? <Pill tone="accent">main growth job</Pill> : null}
            <Pill tone={statusTone(job.status)}>{statusLabel(job.status)}</Pill>
            <Pill tone="muted">{job.cadence}</Pill>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
            {job.name}
          </h2>
          <p className="mt-1 text-base text-zinc-500">
            Agents: {job.owner}
          </p>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-400">
            {job.overview}
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

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            What agents are doing
          </h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {job.salesAgentTasks.map((task) => (
              <SimpleTask key={`${job.slug}-${task.title}`} task={task} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Daily spend
            </h3>
            <span className="text-sm text-zinc-600">{days} days running</span>
          </div>
          <div className="space-y-2">
            {job.costBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-base">
                <span className="text-zinc-400">{item.label}</span>
                <span className="font-mono text-zinc-200">{formatUsd(item.amountUsd)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
              Next run
            </p>
            <p className="mt-1 text-base text-zinc-300">{job.nextRun}</p>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-zinc-800/70 bg-black/20 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Owner note
            </h3>
            <p className="mt-2 text-base leading-relaxed text-zinc-400">
              {job.notes}
            </p>
          </div>
          <div className="grid min-w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[24rem]">
            <MiniMetric label="Revenue" value={formatUsd(job.wonRevenueUsd)} />
            <MiniMetric label="Pipeline" value={formatUsd(job.estimatedPipelineValueUsd)} />
            <MiniMetric label="Next" value={job.nextRun} compact />
          </div>
        </div>
      </section>
    </article>
  );
}

function SimpleTask({
  task,
}: {
  task: ScheduledJobCost["salesAgentTasks"][number];
}) {
  return (
    <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-medium text-zinc-200">{task.title}</p>
        <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
          {task.owner}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{task.description}</p>
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

function flowStatusTone(status: ReachInternalStep["status"]) {
  if (status === "verified") return "accent";
  if (status === "partial") return "warm";
  if (status === "missing") return "danger";
  return "muted";
}

function flowStatusLabel(status: ReachInternalStep["status"]) {
  if (status === "verified") return "ready";
  if (status === "partial") return "working";
  if (status === "missing") return "blocked";
  return "manual";
}
