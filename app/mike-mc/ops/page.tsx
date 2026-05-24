import type { Metadata } from "next";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { SERVICES } from "@/lib/control/mission";
import { hasInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "GMF Ops Index",
  description: "Internal operations index for GMF Mission Control.",
  robots: { index: false, follow: false },
};

const DOCS = [
  {
    title: "GMF Company Operating System",
    path: "docs/GMF_COMPANY_OPERATING_SYSTEM.md",
    purpose: "How GMF is run, what it sells, who owns each lane, and when Mike is pulled in.",
  },
  {
    title: "GMF Agent Training Pack",
    path: "docs/GMF_AGENT_TRAINING_PACK.md",
    purpose: "Agent roster, responsibilities, workflow rules, escalation rules, and weekly checks.",
  },
  {
    title: "Stay Found Monthly Recap Template",
    path: "docs/STAY_FOUND_MONTHLY_RECAP_TEMPLATE.md",
    purpose: "The client-safe monthly note format for the $59/mo Stay Found service.",
  },
  {
    title: "Legacy Operations Index",
    path: "docs/AOH_OPERATIONS_INDEX.md",
    purpose: "Older operating map retained for recovery and migration context.",
  },
  {
    title: "Laptop Death Recovery",
    path: "docs/LAPTOP_DEATH_RECOVERY.md",
    purpose: "What to restore first if the laptop dies or gets replaced.",
  },
  {
    title: "Backup Readiness Checklist",
    path: "docs/BACKUP_READINESS_CHECKLIST.md",
    purpose: "The practical safety check for accounts, code, docs, and agent access.",
  },
  {
    title: "Agent Operating Model",
    path: "docs/AGENT_OPERATING_MODEL.md",
    purpose: "Current GMF agent operating model and handoff rules.",
  },
  {
    title: "Review Power Onboarding",
    path: "docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md",
    purpose: "Client-side setup flow for review requests and review-ready data.",
  },
  {
    title: "Client Hub Runbook",
    path: "docs/client-ops-ledger/client-hub-runbook.md",
    purpose: "Client-facing status page for setup, Review Power, and locked next-step previews.",
  },
  {
    title: "Review Power Skills",
    path: "docs/REVIEW_AUTOMATION_AGENT_SKILLS.md",
    purpose: "Review Power agent skills, boundaries, and first-service operating rules.",
  },
  {
    title: "Profile Knowledge",
    path: "docs/PROFILE_KNOWLEDGE_PACK.md",
    purpose: "Google Business Profile access, verification, review links, and handoffs.",
  },
  {
    title: "GHL Bridge Knowledge",
    path: "docs/GHL_EXPERT_KNOWLEDGE_PACK.md",
    purpose: "Legacy GHL bridge setup, reputation management, workflows, and troubleshooting map while exiting GHL.",
  },
  {
    title: "Morning Brief Skill Pack",
    path: "docs/client-ops-ledger/morning-brief-skill-pack.md",
    purpose: "Who feeds Mike's owner brief and how agent knowledge should be sourced.",
  },
  {
    title: "Owner Morning Brief Product Research",
    path: "docs/client-ops-ledger/owner-morning-brief-product-research.md",
    purpose: "Commercial vs custom brief packaging, retention, pricing anchors, and target industries.",
  },
];

const RECOVERY_STEPS = [
  "Open the password manager and confirm the core business accounts are reachable.",
  "Get GitHub, Vercel, Stripe, GHL/Hub360AI, DNS, Slack, Obsidian, Google, and the VPS provider back online.",
  "Clone the website and tooling repos, install dependencies, and run a clean build.",
  "Restore environment variables from the hosting account instead of storing secrets in docs.",
  "Verify Mission Control, OpenClaw, GHL access, Slack, and the document vault.",
];

const HUMAN_CHECKS = [
  "Password manager has every account needed to operate GMF.",
  "Vercel and GitHub are accessible without the old laptop.",
  "Obsidian and Google Drive copies of the operating docs are current.",
  "OpenClaw/VPS access is documented in the private recovery location.",
  "No credentials, private keys, or secret values are stored on this webpage.",
];

export default async function OpsIndexPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  return (
    <ControlShell>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF · Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Ops Index
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            A sanitized webpage for the docs, agents, backup plan, and service
            operating model. Sensitive recovery details stay out of the website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </a>
          <Pill tone="accent">noindex</Pill>
          <Pill tone="warn">sanitized</Pill>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Operating docs" value={DOCS.length.toString()} />
        <Metric label="Offerings" value={SERVICES.length.toString()} />
        <Metric label="Recovery checks" value={HUMAN_CHECKS.length.toString()} />
      </section>

      <Section
        eyebrow="Docs"
        title="Where the operating knowledge lives"
        sub="This is the public-safe map. The detailed source files remain in the repo."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {DOCS.map((doc) => (
            <article
              key={doc.path}
              className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-50">{doc.title}</h2>
                <Pill tone="muted">doc</Pill>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-zinc-400">
                {doc.purpose}
              </p>
              <code className="block rounded-lg border border-zinc-800 bg-black/25 px-3 py-2 font-mono text-xs text-zinc-500">
                {doc.path}
              </code>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Services"
        title="Offerings and who owns them"
        sub="Plain owner view: what the service does, who owns it, and who supports delivery."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="rounded-lg border border-zinc-800/60 bg-zinc-950/80 p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                {service.job}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-50">
                {service.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {service.outcome}
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <OwnershipRow label="Owner" value={service.agents[0] ?? "Manager"} />
                <OwnershipRow
                  label="Support team"
                  value={service.agents.slice(1).join(", ") || "Assigned as needed"}
                />
                <OwnershipRow
                  label="Current view"
                  value={service.blocked ? "Needs Manager attention" : "Ready for normal agent work"}
                />
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Recovery"
        title="Laptop dies scenario"
        sub="This page shows the sequence, not the private credentials or host details."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Checklist title="Restore order" items={RECOVERY_STEPS} />
          <Checklist title="Human readiness check" items={HUMAN_CHECKS} />
        </div>
      </Section>
    </ControlShell>
  );
}

function Section({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <header className="mb-5 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/80">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{sub}</p>
      </header>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-4xl font-bold leading-none text-emerald-300">
        {value}
      </p>
    </div>
  );
}

function OwnershipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-zinc-900 pt-3 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </dt>
      <dd className="leading-relaxed text-zinc-300">{value}</dd>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-zinc-800/60 bg-zinc-950/80 p-5">
      <h2 className="mb-4 text-lg font-semibold text-zinc-50">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
