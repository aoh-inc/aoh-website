import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  productStatusLabel,
  type GrowthProduct,
  type GrowthProductStep,
} from "@/lib/control/growth-products";
import type { ControlTone } from "@/lib/control/internal-jobs";

export function GrowthProductPage({ product }: { product: GrowthProduct }) {
  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Reach add-on
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 max-w-5xl text-base leading-relaxed text-zinc-400">
            {product.headline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc/jobs"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to jobs
          </Link>
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Pill tone={product.tone}>{productStatusLabel(product.status)}</Pill>
        </div>
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-4">
        <Metric label="Product type" value={product.type} />
        <Metric label="Status" value={productStatusLabel(product.status)} tone={product.tone} />
        <Metric label="Agents" value={product.agentOwners.length.toString()} />
        <Metric label="Steps" value={product.steps.length.toString()} />
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6">
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              Plain English
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              What we are selling
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-300">
              {product.plainEnglish}
            </p>
            <div className="mt-4 rounded-xl border border-zinc-800/70 bg-black/20 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                How to say it
              </p>
              <p className="mt-2 text-base leading-relaxed text-zinc-200">
                {product.sellAs}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoList title="Best fit clients" items={product.idealClient} tone="accent" />
            <InfoList title="What client buys" items={product.whatClientBuys} tone="warm" />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
              Agent job flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              What agents do step by step
            </h2>
          </div>
          <Pill tone="muted">human approval where needed</Pill>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {product.steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <InfoList title="Why it is marketable" items={product.pros} tone="accent" />
        <InfoList title="Watch-outs" items={product.cons} tone="warm" />
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <InfoList title="Guardrails" items={product.guardrails} tone="danger" />
        <InfoList title="Next build tasks" items={product.nextBuild} tone="muted" />
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Pricing direction
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              Keep this simple to sell
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-300">
              {product.pricingDirection}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Source links
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {product.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              Agent ownership
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
              Who owns the work
            </h2>
          </div>
          <Pill tone="accent">{product.agentOwners.length} owners</Pill>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {product.agentOwners.map((owner) => (
            <article key={owner.agent} className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
              <p className="text-base font-semibold text-zinc-100">{owner.agent}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{owner.role}</p>
            </article>
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
  tone?: ControlTone;
}) {
  const valueClass = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    hot: "text-rose-300",
    warn: "text-amber-300",
    ok: "text-emerald-300",
    muted: "text-zinc-400",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-semibold leading-tight ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function InfoList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "warm" | "muted" | "danger";
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-black/20 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
          {title}
        </h3>
        <Pill tone={tone}>{items.length}</Pill>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-zinc-400">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ step, index }: { step: GrowthProductStep; index: number }) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Step {index}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-snug text-zinc-100">
            {step.title}
          </h3>
        </div>
        <Pill tone={stepTone(step.status)}>{step.status}</Pill>
      </div>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-emerald-300">
        {step.owner}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.description}</p>
      <p className="mt-4 border-t border-zinc-800/60 pt-3 text-xs leading-relaxed text-zinc-500">
        Proof: {step.proof}
      </p>
    </article>
  );
}

function stepTone(status: GrowthProductStep["status"]) {
  if (status === "ready") return "accent";
  if (status === "draft") return "warm";
  if (status === "guarded") return "danger";
  return "muted";
}
