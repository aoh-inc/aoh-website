import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  getMorningBriefData,
  statTotals,
  type GhlEmailStat,
} from "@/lib/control/morning-brief";

export const metadata: Metadata = {
  title: "Owner Morning Brief - The Hub",
  description: "Running owner brief for AOH Mission Control.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const STANDARD_ITEMS = [
  "Daily owner summary",
  "Reach campaign results",
  "Leads, replies, bounces, and unsubscribes",
  "Market signal",
  "Needs-owner list",
  "Brief archive",
];

const CUSTOM_ITEMS = [
  "GHL or CRM pipeline detail",
  "Email inbox triage",
  "Calendar and booking checks",
  "Google Business Profile checks",
  "Call tracking and missed-call summary",
  "Ads, Stripe, QuickBooks, or custom data",
];

const PRICING_ANCHORS = [
  {
    vendor: "AgencyAnalytics",
    price: "$20/client/mo",
    note: "Billed annually. Includes automated reporting, AI insights, white-label branding, and client portal.",
    source: "https://agencyanalytics.com/pricing",
  },
  {
    vendor: "DashThis",
    price: "$44-$54/mo",
    note: "Individual plan. 3 dashboards and 15 sources. Higher plans run $139-$164/mo and up.",
    source: "https://dashthis.com/pricing",
  },
  {
    vendor: "Databox",
    price: "$159/mo",
    note: "Pro monthly plan for business reporting, dashboards, reports, goals, and shared updates.",
    source: "https://databox.com/pricing",
  },
  {
    vendor: "Whatagraph",
    price: "199 euros/mo",
    note: "Start plan billed annually. Boost is listed at 399 euros/mo, with Max custom.",
    source: "https://whatagraph.com/pricing",
  },
];

const AOH_PRICE_RECOMMENDATION = [
  {
    tier: "Standard / Commercial",
    price: "$149-$299/mo",
    setup: "$0-$500 setup",
    note: "Daily owner brief, Reach/campaign results, market signal, simple archive, and one recommended move.",
  },
  {
    tier: "Custom Layer",
    price: "$399-$1,500+/mo",
    setup: "$750-$3,000 setup",
    note: "Email, calendar, GHL/CRM, GBP, calls, ads, payments, or client-specific agent workflows.",
  },
];

const RETENTION = [
  {
    label: "Daily briefs",
    value: "13 months",
    note: "Enough to look back through the year and compare the same season next year.",
  },
  {
    label: "Raw proof files",
    value: "90 days",
    note: "Keep the heavy logs short. Move only useful summaries into the archive.",
  },
  {
    label: "Monthly rollups",
    value: "24 months",
    note: "Best for sales reviews, renewals, and showing long-term value.",
  },
  {
    label: "Client export",
    value: "On cancel",
    note: "Give the client a simple archive export, then remove private access.",
  },
];

export default function MorningBriefPage() {
  const brief = getMorningBriefData();
  const totals = statTotals(brief.stats);

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Owner Morning Brief
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-zinc-400">
            One running page for the owner: what happened, what needs attention, what is standard, and what is custom.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/mike-mc" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Back to MC
          </Link>
          <Link href="/mike-mc/jobs" className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
            Jobs
          </Link>
          <Pill tone="accent">refreshes every 60s</Pill>
          <Pill tone="warm">{brief.date}</Pill>
        </div>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Metric label="Sent" value={totals.sent.toString()} />
        <Metric label="Delivered" value={`${totals.deliveredPct}%`} tone="accent" />
        <Metric label="Opened" value={`${totals.openedPct}%`} tone="warm" />
        <Metric label="Replies" value={totals.replied.toString()} />
        <Metric label="Bounces" value={totals.bounced.toString()} tone={totals.bounced > 0 ? "danger" : "muted"} />
        <Metric label="Unsubs" value={totals.unsubscribed.toString()} />
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill tone="accent">standard</Pill>
              <Pill tone="muted">commercial offer</Pill>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Today&apos;s owner read
            </h2>
            <div className="mt-4 space-y-3">
              {brief.commercialBrief.map((item) => (
                <OwnerLine key={item} text={item} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
            <h3 className="text-lg font-semibold text-zinc-50">Needs Mike</h3>
            <div className="mt-3 space-y-2">
              {brief.needsMike.length ? (
                brief.needsMike.map((item) => <OwnerLine key={item} text={item} compact />)
              ) : (
                <p className="text-sm text-zinc-400">No owner action listed.</p>
              )}
            </div>
            <div className="mt-4 border-t border-zinc-800/70 pt-4">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
                Recommended move
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {brief.recommendedMove}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-2">
        <SplitSection
          eyebrow="Standard / Commercial"
          title="What most clients should get"
          body="This is the packaged version. It does not require custom agents inside every client system."
          items={STANDARD_ITEMS}
          tone="accent"
        />
        <SplitSection
          eyebrow="Custom"
          title="What costs more"
          body="This is where agents connect to the client's actual software, inbox, calendar, CRM, phone, or payment stack."
          items={CUSTOM_ITEMS}
          tone="warm"
        />
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
        <SectionHeader
          eyebrow="Live results"
          title="Reach campaign performance"
          sub="Pulled from HighLevel workflow email stats. These are current GHL totals, not just screenshots."
        />
        <div className="grid gap-3 xl:grid-cols-3">
          {brief.stats.map((stat) => (
            <StatCard key={stat.lane} stat={stat} />
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
          <SectionHeader
            eyebrow="Retention"
            title="How long to hold data"
            sub="My recommendation: keep the owner page useful without turning it into a junk drawer."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {RETENTION.map((item) => (
              <article key={item.label} className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-zinc-50">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
          <SectionHeader
            eyebrow="Pricing"
            title="What the market charges"
            sub="These are tool/software price anchors. AOH should charge for the owner-ready brief plus the human/agent interpretation."
          />
          <div className="space-y-3">
            {PRICING_ANCHORS.map((item) => (
              <a
                key={item.vendor}
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="grid gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4 transition hover:border-zinc-700 md:grid-cols-[150px_120px_1fr]"
              >
                <p className="font-semibold text-zinc-100">{item.vendor}</p>
                <p className="font-mono text-sm text-emerald-300">{item.price}</p>
                <p className="text-sm leading-relaxed text-zinc-400">{item.note}</p>
              </a>
            ))}
          </div>
        </section>
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 md:p-6">
        <SectionHeader
          eyebrow="AOH packaging"
          title="What I would sell"
          sub="Keep the standard offer easy to understand. Charge more when agents need access to private systems."
        />
        <div className="grid gap-3 lg:grid-cols-2">
          {AOH_PRICE_RECOMMENDATION.map((item) => (
            <article key={item.tier} className="rounded-xl border border-zinc-800/70 bg-zinc-950/75 p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Pill tone={item.tier.startsWith("Standard") ? "accent" : "warm"}>{item.tier}</Pill>
                <Pill tone="muted">{item.setup}</Pill>
              </div>
              <p className="font-mono text-3xl font-semibold text-zinc-50">{item.price}</p>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-2">
        <SimpleList
          eyebrow="Market signal"
          title="What Scout is watching"
          items={brief.marketSignals}
          empty="No market signals loaded yet."
        />
        <SimpleList
          eyebrow="Source health"
          title="What feeds this page"
          items={brief.sourceStatus}
          empty="No source status loaded yet."
        />
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
        <SectionHeader
          eyebrow="Archive"
          title="Past owner briefs"
          sub="The page keeps a running history. Daily briefs stay visible for 13 months, then should roll into monthly summaries."
        />
        <div className="grid gap-3 lg:grid-cols-2">
          {brief.archive.map((item) => (
            <article key={item.file} className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-zinc-100">{item.date}</h3>
                <Pill tone="muted">{item.title}</Pill>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{item.summary}</p>
              <code className="mt-3 block truncate rounded-lg border border-zinc-800 bg-black/25 px-3 py-2 font-mono text-xs text-zinc-600">
                {item.file}
              </code>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
        <SectionHeader
          eyebrow="Proof"
          title="Files behind today&apos;s brief"
          sub="This is for owner confidence and debugging. It should stay below the main summary."
        />
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {[brief.currentFile, brief.statsFile, ...brief.proofUsed].filter(Boolean).map((item) => (
            <code key={item} className="truncate rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 font-mono text-xs text-zinc-500">
              {item}
            </code>
          ))}
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
  tone?: "default" | "accent" | "warm" | "muted" | "danger";
}) {
  const valueClass = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    muted: "text-zinc-400",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${valueClass}`}>{value}</p>
    </div>
  );
}

function OwnerLine({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
      <p className={`${compact ? "text-sm" : "text-base"} leading-relaxed text-zinc-300`}>{text}</p>
    </div>
  );
}

function SplitSection({
  eyebrow,
  title,
  body,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  tone: "accent" | "warm";
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pill tone={tone}>{eyebrow}</Pill>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h2>
      <p className="mt-2 text-base leading-relaxed text-zinc-400">{body}</p>
      <div className="mt-5 grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: GhlEmailStat }) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/75 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-50">{labelLane(stat.lane)}</h3>
          <p className="mt-1 text-sm text-zinc-500">{stat.workflow}</p>
        </div>
        <Pill tone={stat.bounced > 0 ? "warn" : "accent"}>{stat.bounced} bounces</Pill>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MiniMetric label="Sent" value={stat.sent.toString()} />
        <MiniMetric label="Delivered" value={`${stat.deliveredPct}%`} />
        <MiniMetric label="Opened" value={`${stat.openedPct}%`} />
        <MiniMetric label="Replies" value={stat.replied.toString()} />
      </div>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800/70 bg-black/20 p-3">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function SimpleList({
  eyebrow,
  title,
  items,
  empty,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
      <SectionHeader eyebrow={eyebrow} title={title} sub="" />
      <div className="space-y-2">
        {items.length ? items.map((item) => <OwnerLine key={item} text={item} compact />) : <p className="text-sm text-zinc-500">{empty}</p>}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <header className="mb-5 max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
        {title}
      </h2>
      {sub ? <p className="mt-2 text-base leading-relaxed text-zinc-500">{sub}</p> : null}
    </header>
  );
}

function labelLane(lane: string) {
  if (lane === "ai") return "AI Visibility";
  return lane.charAt(0).toUpperCase() + lane.slice(1);
}
