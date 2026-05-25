import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  listClientAdminRecords,
  upsertClientAdminRecord,
  type ClientAdminRecord,
} from "@/lib/client-profile-admin";
import type { ClientVoiceProfile } from "@/lib/client-hub";
import { hasInternalToolSession, startInternalToolSession } from "@/lib/internal-tool-session";

export const metadata: Metadata = {
  title: "Client Profiles",
  description: "Internal GetMeFound client profile editor.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function ClientProfilesAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const auth = await hasInternalToolSession();

  if (!auth.ok) {
    return (
      <ControlShell>
        <header className="mb-8 max-w-3xl border-b border-zinc-800/60 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - Internal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Client Profiles
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Enter the internal API token to edit client setup, review links, and POS connection notes.
          </p>
        </header>
        <form action={openClientEditor} className="max-w-xl rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Internal token
            </span>
            <input
              name="token"
              type="password"
              autoComplete="off"
              className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            />
          </label>
          <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
            Open editor
          </button>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">
            {auth.message}
          </p>
        </form>
      </ControlShell>
    );
  }

  const result = await listClientAdminRecords();
  const records = result.ok ? result.records : [];

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            GMF - GHL Exit
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Client Profiles
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Supabase-backed client setup, review automation, and POS connection records. This is the first internal editor so we can manage clients without logging into GHL.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </Link>
          <Link
            href="/mike-mc/ghl-exit-ops"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            GHL Exit Ops
          </Link>
          <Link
            href="/mike-mc/setup-jobs"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Setup Jobs
          </Link>
          <Pill tone="accent">token gated</Pill>
          <Pill tone={result.ok ? "ok" : "danger"}>{result.ok ? `${records.length} profiles` : "supabase issue"}</Pill>
        </div>
      </header>

      {params.saved ? (
        <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Saved {params.saved}. Client hub data was refreshed.
        </div>
      ) : null}
      {params.error ? (
        <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {params.error}
        </div>
      ) : null}
      {!result.ok ? (
        <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {result.error}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <NewClientForm />
        <div className="space-y-5">
          {records.map((record) => (
            <ClientRecordForm key={record.profile.slug} record={record} />
          ))}
        </div>
      </section>
    </ControlShell>
  );
}

async function openClientEditor(formData: FormData) {
  "use server";

  const token = valueFrom(formData, "token");
  const ok = await startInternalToolSession(token);
  if (!ok) redirect("/mike-mc/clients?error=Unauthorized");
  redirect("/mike-mc/clients");
}

async function saveClientProfile(formData: FormData) {
  "use server";

  const auth = await hasInternalToolSession();
  if (!auth.ok) redirect("/mike-mc/clients?error=Unauthorized");

  const result = await upsertClientAdminRecord({
    slug: valueFrom(formData, "slug"),
    businessName: valueFrom(formData, "businessName"),
    ownerName: valueFrom(formData, "ownerName"),
    plan: valueFrom(formData, "plan"),
    status: valueFrom(formData, "status"),
    statusLabel: valueFrom(formData, "statusLabel"),
    website: valueFrom(formData, "website"),
    phone: valueFrom(formData, "phone"),
    email: valueFrom(formData, "email"),
    googleReviewUrl: valueFrom(formData, "googleReviewUrl"),
    location: valueFrom(formData, "location"),
    category: valueFrom(formData, "category"),
    logoText: valueFrom(formData, "logoText"),
    brandNote: valueFrom(formData, "brandNote"),
    protection: valueFrom(formData, "protection"),
    statusSummary: valueFrom(formData, "statusSummary"),
    nextClientAction: valueFrom(formData, "nextClientAction"),
    weeklyGoal: Number(valueFrom(formData, "weeklyGoal")),
    voiceMode: valueFrom(formData, "voiceMode"),
    voiceTone: valueFrom(formData, "voiceTone"),
    voiceFavoritePhrases: valueFrom(formData, "voiceFavoritePhrases"),
    voiceAvoidPhrases: valueFrom(formData, "voiceAvoidPhrases"),
    voiceEscalationNotes: valueFrom(formData, "voiceEscalationNotes"),
    integrationSystemName: valueFrom(formData, "integrationSystemName"),
    integrationConnectionLevel: valueFrom(formData, "integrationConnectionLevel"),
    integrationStatus: valueFrom(formData, "integrationStatus"),
    reviewReadyEvent: valueFrom(formData, "reviewReadyEvent"),
    integrationAdminContact: valueFrom(formData, "integrationAdminContact"),
    sendDelayDays: Number(valueFrom(formData, "sendDelayDays")),
    integrationNotes: valueFrom(formData, "integrationNotes"),
  });

  if (!result.ok) {
    redirect(`/mike-mc/clients?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/mike-mc/clients");
  revalidatePath(`/client/${result.slug}`);
  redirect(`/mike-mc/clients?saved=${encodeURIComponent(result.slug)}`);
}

function NewClientForm() {
  return (
    <section className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-5">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
          Add client
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
          New review automation profile
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Start with the business basics and manual POS/upload plan. More integrations can be added after the first client is live.
        </p>
      </div>
      <ClientForm />
    </section>
  );
}

function ClientRecordForm({ record }: { record: ClientAdminRecord }) {
  const { profile, integration } = record;
  return (
    <section className="rounded-lg border border-zinc-800/70 bg-zinc-950/80 p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {profile.slug}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
            {profile.business_name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">{profile.status_label}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/client/${profile.slug}`}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            View hub
          </Link>
          <Link
            href={`/mike-mc/review-proof/${profile.slug}`}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Proof
          </Link>
          <Link
            href={`/mike-mc/review-replies/${profile.slug}`}
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Replies
          </Link>
          <Pill tone={profile.status === "live" ? "accent" : "warm"}>{profile.status}</Pill>
        </div>
      </div>
      <ClientForm record={record} />
      {integration ? (
        <p className="mt-3 text-xs leading-relaxed text-zinc-600">
          POS/CRM: {integration.system_name} - {integration.connection_level} - review-ready event:{" "}
          {integration.review_ready_event || "not set"}
        </p>
      ) : null}
    </section>
  );
}

function ClientForm({ record }: { record?: ClientAdminRecord }) {
  const profile = record?.profile;
  const integration = record?.integration;
  const profileJson = profile?.profile ?? {};
  const voiceProfile = profileJson.voiceProfile ?? ({} as Partial<ClientVoiceProfile>);

  return (
    <form action={saveClientProfile} className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Slug" name="slug" defaultValue={profile?.slug ?? ""} required />
        <Field label="Business" name="businessName" defaultValue={profile?.business_name ?? ""} required />
        <Field label="Owner" name="ownerName" defaultValue={profile?.owner_name ?? ""} />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Select
          label="Plan"
          name="plan"
          defaultValue={profile?.plan ?? "Get Found"}
          options={[
            "Get Found",
            "Stay Found",
            "Always Ready",
            "Client Setup",
          ]}
        />
        <Field label="Status" name="status" defaultValue={profile?.status ?? "setup"} />
        <Field label="Status label" name="statusLabel" defaultValue={profile?.status_label ?? "Setup in progress"} />
        <Field label="Weekly goal" name="weeklyGoal" type="number" defaultValue={String(profileJson.reviews?.weeklyGoal ?? 3)} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Website" name="website" defaultValue={profile?.website ?? ""} />
        <Field label="Phone" name="phone" defaultValue={profile?.phone ?? ""} />
        <Field label="Email" name="email" defaultValue={profile?.email ?? ""} />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_120px]">
        <Field label="Google review URL" name="googleReviewUrl" defaultValue={profile?.google_review_url ?? ""} />
        <Field label="Category" name="category" defaultValue={profile?.category ?? ""} />
        <Field label="Logo text" name="logoText" defaultValue={profileJson.logoText ?? ""} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Location" name="location" defaultValue={profile?.location ?? ""} />
        <Select
          label="Protection"
          name="protection"
          defaultValue={profileJson.protection ?? "Requested"}
          options={["Not enabled", "Requested", "Enabled"]}
        />
        <Field label="Next action" name="nextClientAction" defaultValue={profileJson.nextClientAction ?? ""} />
      </div>

      <TextArea label="Status summary" name="statusSummary" defaultValue={profileJson.statusSummary ?? ""} />
      <TextArea label="Brand note" name="brandNote" defaultValue={profileJson.brandNote ?? ""} />

      <div className="border-t border-zinc-800/70 pt-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
          Review reply voice
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Reply mode"
            name="voiceMode"
            defaultValue={voiceProfile.mode ?? "Draft only"}
            options={["Draft only", "Approval required", "Safe auto-reply eligible"]}
          />
          <Field
            label="Tone"
            name="voiceTone"
            defaultValue={voiceProfile.tone ?? "Friendly, concise, appreciative, and professional."}
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <TextArea label="Favorite phrases" name="voiceFavoritePhrases" defaultValue={voiceProfile.favoritePhrases ?? ""} />
          <TextArea label="Avoid phrases" name="voiceAvoidPhrases" defaultValue={voiceProfile.avoidPhrases ?? ""} />
        </div>
        <div className="mt-3">
          <TextArea
            label="Escalation notes"
            name="voiceEscalationNotes"
            defaultValue={
              voiceProfile.escalationNotes ??
              "Hold any review mentioning refunds, safety, legal issues, staff accusations, or medical/regulated topics for human review."
            }
          />
        </div>
      </div>

      <div className="border-t border-zinc-800/70 pt-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
          POS / CRM connection
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="System" name="integrationSystemName" defaultValue={integration?.system_name ?? "Manual Upload"} />
          <Field label="Connection" name="integrationConnectionLevel" defaultValue={integration?.connection_level ?? "manual_upload"} />
          <Field label="Status" name="integrationStatus" defaultValue={integration?.status ?? "planned"} />
          <Field label="Send delay days" name="sendDelayDays" type="number" defaultValue={String(integration?.send_delay_days ?? 1)} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Review-ready event" name="reviewReadyEvent" defaultValue={integration?.review_ready_event ?? "Completed job/customer export"} />
          <Field label="Admin contact" name="integrationAdminContact" defaultValue={integration?.admin_contact ?? ""} />
        </div>
        <div className="mt-3">
          <TextArea label="Integration notes" name="integrationNotes" defaultValue={integration?.notes ?? ""} />
        </div>
      </div>

      <button className="w-fit rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
        Save profile
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="mt-1.5 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

function valueFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
