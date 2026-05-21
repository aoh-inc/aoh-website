import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  CAMPAIGN_LANES,
  CAMPAIGN_SOURCE_DOCS,
  DEDICATED_DOMAIN_WARMUP,
  LAUNCH_GATES,
  MANUAL_LAUNCH_MODEL,
  ROUTER_BRANCHES,
} from "@/lib/control/campaign-launch";

export const metadata: Metadata = {
  title: "Campaign Launch - The Hub",
  description: "AOH Reach campaign launch room.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function CampaignLaunchPage() {
  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-3 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Reach
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Campaign Launch Room
          </h1>
          <p className="mt-1.5 max-w-3xl text-base leading-relaxed text-zinc-400">
            Reviews and AI Visibility are on warmup auto. Relay joins after more clean contacts and final readiness.
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
            href="/mike-mc/jobs"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Job Costs
          </Link>
          <Pill tone="accent">warmup auto on</Pill>
        </div>
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-4">
        <Metric label="Campaign status" value="Auto warmup" tone="accent" />
        <Metric label="Lanes" value="3" />
        <Metric label="Relay need" value="5 more OK" tone="warm" />
        <Metric label="Launch mode" value="Controlled" tone="accent" />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 md:p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
            Domain warmup
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Per dedicated sending domain
          </h2>
          <div className="mt-4 space-y-2">
            {DEDICATED_DOMAIN_WARMUP.map((item) => (
              <div key={item} className="rounded-lg border border-zinc-800/70 bg-black/25 px-3 py-2 text-sm leading-relaxed text-zinc-400">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
            Mike&apos;s role
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Pick target, then approve
          </h2>
          <div className="mt-4 space-y-2">
            {MANUAL_LAUNCH_MODEL.map((item) => (
              <div key={item} className="rounded-lg border border-zinc-800/70 bg-black/25 px-3 py-2 text-sm leading-relaxed text-zinc-400">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              Sender lanes
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              One offer per domain lane
            </h2>
          </div>
          <Pill tone="muted">no broad blast</Pill>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {CAMPAIGN_LANES.map((lane) => (
            <article key={lane.name} className="rounded-xl border border-zinc-800/70 bg-black/25 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-tight text-zinc-100">{lane.name}</h3>
                <Pill tone={lane.status === "Ready" ? "accent" : lane.status === "Draft" ? "muted" : "warm"}>
                  {lane.status}
                </Pill>
              </div>
              <Info label="Domain" value={lane.domainRole} />
              <Info label="From email" value={lane.fromEmail} />
              <Info label="Offer" value={lane.offer} />
              <Info label="CTA" value={lane.cta} />
              <Info label="Positioning" value={lane.positioning} />
              <Info label="Avoid" value={lane.avoid} />
              <Info label="Owner" value={lane.owner} />
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
              GHL router
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              Branch order and required proof
            </h2>
          </div>
          <Pill tone="warn">needs GHL build</Pill>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {ROUTER_BRANCHES.map((branch, index) => (
            <article key={branch.branch} className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                    Branch {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-zinc-100">{branch.branch}</h3>
                </div>
                <Pill tone="warn">{branch.status}</Pill>
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
                Examples
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {branch.keywordExamples.map((keyword) => (
                  <span key={keyword} className="rounded-md border border-zinc-800 bg-black/30 px-2 py-1 text-xs text-zinc-400">
                    {keyword}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-zinc-400">
                {branch.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 md:p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
            Go / no-go
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Launch gates
          </h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {LAUNCH_GATES.map((gate) => (
              <div key={gate} className="rounded-lg border border-zinc-800/70 bg-black/25 px-3 py-2 text-sm leading-relaxed text-zinc-400">
                {gate}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-5 md:p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Source docs
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Team truth
          </h2>
          <div className="mt-4 space-y-2">
            {CAMPAIGN_SOURCE_DOCS.map((doc) => (
              <div key={doc} className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 font-mono text-xs text-zinc-400">
                {doc}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            These docs are the operating source for Sender, Coach, GHL Expert, Sorter, Booker, and Auditor.
          </p>
        </div>
      </section>
    </ControlShell>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm" | "warn";
}) {
  const color = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    warn: "text-rose-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold leading-none ${color}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{value}</p>
    </div>
  );
}
