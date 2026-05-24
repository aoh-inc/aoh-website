import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientHubActivity } from "@/lib/client-hub-activity";
import { getClientHubProfile, getClientIntegrationSettings } from "@/lib/client-profile-store";
import { summarizeIntegrationEventHealth } from "@/lib/review-integration-events";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";
import { getReviewReplyDigest } from "@/lib/review-reply-digest";
import { getSmsReadiness } from "@/lib/review-sms-readiness";
import {
  CLIENT_HUBS,
  statusClasses,
  statusLabel,
  type ClientHubProfile,
  type ClientHubStatus,
} from "@/lib/client-hub";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientHubProfile(slug);

  if (!client) {
    return {
      title: "Client Hub",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${client.businessName} Client Hub`,
    description: `GMF setup hub for ${client.businessName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClientHubPage({ params }: PageProps) {
  const { slug } = await params;
  const client = await getClientHubProfile(slug);

  if (!client) notFound();

  const activity = await getClientHubActivity(client.slug);
  const integration = await getClientIntegrationSettings({ clientSlug: client.slug });
  const integrationRecords = await listReviewAutomationRecords({ clientSlug: client.slug, limit: 500 });
  const integrationHealth = integrationRecords.ok ? summarizeIntegrationEventHealth(integrationRecords.records) : null;
  const smsReadiness = await getSmsReadiness(client.slug);
  const smsDoneCount = smsReadiness.checklist.filter((item) => item.done).length;
  const replyDigest = await getReviewReplyDigest({ clientSlug: client.slug, days: 30 });
  const clientNeeds = client.checklist.filter((item) => item.owner === "Client" && item.status !== "done");
  const weeklyReviews = activity.ok ? activity.weekly.feedback : client.reviews.weeklyReviews;
  const requestsSent = activity.ok ? activity.monthly.sent : client.reviews.requestsSent;
  const monthlyFeedback = activity.ok ? activity.monthly.feedback : client.monthlyRecap.feedbackCaptured;
  const monthlyHeldBack = activity.ok ? activity.monthly.heldBack : client.monthlyRecap.heldBack;
  const responseRate =
    activity.ok && activity.monthly.sent > 0
      ? `${Math.round((activity.monthly.feedback / activity.monthly.sent) * 100)}%`
      : client.reviews.responseRate;
  const reviewsBehind = weeklyReviews < client.reviews.weeklyGoal;
  const activityNote = activity.ok
    ? activity.monthly.sent > 0
      ? `${activity.monthly.sent} review request${activity.monthly.sent === 1 ? "" : "s"} sent in the last 30 days.`
      : client.monthlyRecap.ownerNote
    : "Live activity is temporarily unavailable; static setup status is shown.";

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
            title="Review Power"
            sub="What your review request system is doing this week."
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
              <MiniStat label="This week" value={`${weeklyReviews}/${client.reviews.weeklyGoal}`} />
              <MiniStat label="Requests sent" value={requestsSent.toString()} />
              <MiniStat label="Response" value={responseRate} />
              <MiniStat label="Automation" value={client.metrics[2]?.value ?? "Checking"} />
            </div>

            <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Monthly recap
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {activityNote}
                  </p>
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  {client.monthlyRecap.label}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Sent" value={requestsSent.toString()} />
                <MiniStat label="Feedback" value={monthlyFeedback.toString()} />
                <MiniStat label="Held back" value={monthlyHeldBack.toString()} />
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

      <section id="data-connection" className="border-b border-slate-200 bg-[#f7f8f4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
          <SectionHeader
            eyebrow="Data connection"
            title="How new customers enter the review system"
            sub="Manual upload is included. Automatic POS or CRM sync can be added when the client system supports it."
          />

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Current source
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    {integration.systemName}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {connectionCopy(integration.connectionLevel)}
                  </p>
                </div>
                <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${integrationTone(integration.connectionLevel)}`}>
                  {integration.connectionLevel.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <MiniStat label="Delay" value={`${integration.sendDelayDays} day${integration.sendDelayDays === 1 ? "" : "s"}`} />
                <MiniStat label="Received" value={String(integrationHealth?.received ?? 0)} />
                <MiniStat label="Clean" value={String(integrationHealth?.sendCandidateEligible ?? 0)} />
                <MiniStat label="Held" value={String(integrationHealth?.held ?? 0)} />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {integrationHealth?.latestAt
                  ? `Latest customer event recorded ${formatShortDate(integrationHealth.latestAt)}.`
                  : "No POS/CRM events have been recorded yet. Use customer upload to start quickly."}
              </p>
            </article>

            <article className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <StatusPill status={isAutoConnection(integration.connectionLevel) ? "working" : "locked"} />
              <h3 className="mt-4 text-xl font-semibold text-slate-950">
                POS/CRM auto-sync
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Auto-sync is available as a paid setup after we confirm the system has an export, webhook, Zapier, Make, or API path. We still hold duplicates, missing emails, and suppressed customers before any proof queue.
              </p>
              <Link
                href={`/client/${client.slug}/customers`}
                className="mt-5 inline-flex rounded-lg bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Upload customers
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="upgrades" className="border-b border-slate-200 bg-[#f7f8f4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
          <SectionHeader
            eyebrow="Available next"
            title="Add-ons and approvals"
            sub="Items that can be unlocked after the base review flow is live."
          />

          <div className="grid gap-3 md:grid-cols-3">
            <UpgradeCard
              label="Review replies"
              status={replyDigest.counts.drafted ? `${replyDigest.counts.drafted} pending` : client.voiceProfile?.mode ?? "Draft only"}
              detail={replyDigest.counts.posted ? `${replyDigest.counts.posted} replies marked posted. AI drafts still require the saved approval rules.` : "AI drafts in your saved voice with approval before anything is posted."}
              tone="emerald"
            />
            <UpgradeCard
              label="SMS requests"
              status={smsReadiness.ready ? "Ready" : `${smsDoneCount}/5 ready`}
              detail={smsReadiness.ready ? "SMS review requests are compliance-ready for this client." : "Available after A2P/10DLC setup, opt-in language, STOP handling, and sample message are approved."}
              tone="amber"
            />
            <UpgradeCard
              label="POS auto-sync"
              status="Custom"
              detail="Starts with manual upload, then connects exports, webhooks, Zapier, or direct APIs when supported."
              tone="slate"
            />
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
                href="mailto:mike@getmefound.ai?subject=Client%20hub%20upload"
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
              Stay Found and AI Ready preview
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Every client hub can show locked next steps so owners understand what they get if they upgrade:
              review replies, local visibility checks, Google profile upkeep, AI voice readiness, and competitor movement.
            </p>
            <Link
              href="/pricing#stay-found"
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
            >
              Unlock Stay Found
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

function UpgradeCard({
  label,
  status,
  detail,
  tone,
}: {
  label: string;
  status: string;
  detail: string;
  tone: "emerald" | "amber" | "slate";
}) {
  const toneClasses = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    slate: "border-slate-200 bg-white text-slate-700",
  }[tone];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${toneClasses}`}>
        {status}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function connectionCopy(connectionLevel: string) {
  const clean = connectionLevel.toLowerCase();
  if (clean.includes("webhook") || clean.includes("api") || clean.includes("zapier") || clean.includes("make")) {
    return "Customer events can be accepted automatically after setup and proof checks.";
  }
  if (clean.includes("export")) {
    return "Customer lists can be imported from scheduled exports when available.";
  }
  return "Customer lists are uploaded or pasted first, so review requests can start without waiting on a POS integration.";
}

function integrationTone(connectionLevel: string) {
  return isAutoConnection(connectionLevel)
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-slate-200 bg-slate-50 text-slate-600";
}

function isAutoConnection(connectionLevel: string) {
  const clean = connectionLevel.toLowerCase();
  return ["webhook", "api", "zapier", "make", "sync"].some((term) => clean.includes(term));
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "an unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
