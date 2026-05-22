import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CLIENT_HUBS,
  getClientHub,
  statusClasses,
  statusLabel,
  type ClientHubProfile,
  type ClientHubStatus,
} from "@/lib/client-hub";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) {
    return {
      title: "Client Hub",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${client.businessName} Client Hub`,
    description: `AOH setup hub for ${client.businessName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClientHubPage({ params }: PageProps) {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) notFound();

  const clientNeeds = client.checklist.filter((item) => item.owner === "Client" && item.status !== "done");
  const reviewsBehind = client.reviews.weeklyReviews < client.reviews.weeklyGoal;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f8f4] text-slate-950 focus:outline-none">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-6 py-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark client={client} />
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800">
                  {client.plan}
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {client.statusLabel}
                </span>
              </div>
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-slate-950 md:text-2xl">
                {client.businessName}
              </h1>
            </div>
          </div>

          <aside className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
              Needed from you
            </p>
            <p className="text-base font-semibold text-slate-950">
              {clientNeeds.length} item{clientNeeds.length === 1 ? "" : "s"}
            </p>
            <a
              href="#needed"
              className="inline-flex rounded-md bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              View
            </a>
          </aside>
        </div>
      </section>

      <section id="reviews" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.58fr_1.42fr]">
          <div className="max-w-xl">
          <SectionHeader
            eyebrow="Standard"
            title="Review Automation"
            sub="What your review system is doing this week."
          />
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                  Review status
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  {client.reviews.status}
                </h2>
              </div>
              <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                reviewsBehind
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-emerald-200 bg-white text-emerald-800"
              }`}>
                {client.reviews.trendLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <MiniStat label="This week" value={`${client.reviews.weeklyReviews}/${client.reviews.weeklyGoal}`} />
              <MiniStat label="Requests sent" value={client.reviews.requestsSent.toString()} />
              <MiniStat label="Response" value={client.reviews.responseRate} />
              <MiniStat label="Automation" value={client.metrics[2]?.value ?? "Checking"} />
            </div>

            <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Monthly recap
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {client.monthlyRecap.ownerNote}
                  </p>
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  {client.monthlyRecap.label}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Sent" value={client.monthlyRecap.requestsSent.toString()} />
                <MiniStat label="Feedback" value={client.monthlyRecap.feedbackCaptured.toString()} />
                <MiniStat label="Held back" value={client.monthlyRecap.heldBack.toString()} />
              </div>
            </div>

            {reviewsBehind ? (
              <div className="mt-5 rounded-lg border border-amber-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
                  Tips if reviews are low
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                  {client.reviews.lowReviewTips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-700" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="needed" className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <SectionHeader
            eyebrow="Action needed"
            title="What we still need from you"
            sub="Only the items blocking setup or better results."
          />

          <div className="grid gap-3">
            {clientNeeds.length ? (
              clientNeeds.map((item) => (
                <article key={`${item.label}-${item.detail}`} className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
                  <StatusPill status={item.status} />
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))
            ) : (
              <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                <StatusPill status="done" />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">Nothing needed right now</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We have what we need for the next setup step.
                </p>
              </article>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={`/client/${client.slug}/customers`}
                className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Upload customers
              </Link>
              <Link
                href="/intake/review-automation"
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                Update details
              </Link>
              <a
                href="mailto:mike@aioutsourcehub.com?subject=Client%20hub%20upload"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                Send file
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-visibility" className="bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Custom upgrade
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              AI Visibility preview
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Every client hub can show a locked preview so owners understand what they get if they upgrade:
              review replies, local ranking gaps, ChatGPT visibility, and competitor movement.
            </p>
            <Link
              href="/pricing#ai-visibility"
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
            >
              Unlock AI Visibility
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {client.aiVisibilityPreview.map((metric) => (
              <article key={metric.label} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/10 p-5">
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                  Locked
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">{metric.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function LogoMark({ client, size = "normal" }: { client: ClientHubProfile; size?: "normal" | "large" }) {
  const dimensions = size === "large" ? "h-20 w-20 text-2xl" : "h-12 w-12 text-base";

  return (
    <div
      className={`${dimensions} flex flex-shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-700 to-slate-900 font-bold text-white shadow-sm`}
      aria-label={`${client.businessName} logo placeholder`}
    >
      {client.logoText}
    </div>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <header className="mb-5 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{sub}</p>
    </header>
  );
}

function StatusPill({ status }: { status: ClientHubStatus }) {
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClasses(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}
