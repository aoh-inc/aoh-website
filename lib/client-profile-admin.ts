import { CLIENT_HUBS, getClientHub, normalizeClientHubPlan, type ClientHubProfile } from "@/lib/client-hub";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

const CLIENT_PROFILES_TABLE = "client_profiles";
const CLIENT_INTEGRATIONS_TABLE = "client_integrations";

export type ClientProfileAdminRow = {
  slug: string;
  business_name: string;
  owner_name: string;
  plan: ClientHubProfile["plan"];
  status: string;
  status_label: string;
  website: string;
  phone: string;
  email: string;
  google_review_url: string;
  location: string;
  category: string;
  profile: Partial<ClientHubProfile>;
};

export type ClientIntegrationAdminRow = {
  client_slug: string;
  system_name: string;
  system_type: string;
  connection_level: string;
  status: string;
  review_ready_event: string;
  export_available: boolean;
  zapier_available: boolean;
  make_available: boolean;
  webhook_available: boolean;
  api_available: boolean;
  admin_contact: string;
  consent_notes: string;
  send_delay_days: number;
  notes: string;
};

export type ClientAdminRecord = {
  profile: ClientProfileAdminRow;
  integration?: ClientIntegrationAdminRow;
};

export async function listClientAdminRecords(): Promise<{
  ok: true;
  records: ClientAdminRecord[];
} | {
  ok: false;
  error: string;
}> {
  if (!hasSupabaseConfig()) return { ok: false, error: "Supabase is not configured." };

  const profileQuery = new URLSearchParams({
    select: [
      "slug",
      "business_name",
      "owner_name",
      "plan",
      "status",
      "status_label",
      "website",
      "phone",
      "email",
      "google_review_url",
      "location",
      "category",
      "profile",
    ].join(","),
    order: "business_name.asc",
    limit: "200",
  });
  const profiles = await supabaseRest<ClientProfileAdminRow[]>(CLIENT_PROFILES_TABLE, {
    query: profileQuery.toString(),
  });
  if (!profiles.ok) return { ok: false, error: profiles.error };

  const integrationQuery = new URLSearchParams({
    select: [
      "client_slug",
      "system_name",
      "system_type",
      "connection_level",
      "status",
      "review_ready_event",
      "export_available",
      "zapier_available",
      "make_available",
      "webhook_available",
      "api_available",
      "admin_contact",
      "consent_notes",
      "send_delay_days",
      "notes",
    ].join(","),
    order: "client_slug.asc,system_name.asc",
    limit: "500",
  });
  const integrations = await supabaseRest<ClientIntegrationAdminRow[]>(CLIENT_INTEGRATIONS_TABLE, {
    query: integrationQuery.toString(),
  });
  if (!integrations.ok) return { ok: false, error: integrations.error };

  const firstIntegrationByClient = new Map<string, ClientIntegrationAdminRow>();
  for (const integration of integrations.data) {
    if (!firstIntegrationByClient.has(integration.client_slug)) {
      firstIntegrationByClient.set(integration.client_slug, integration);
    }
  }

  return {
    ok: true,
    records: profiles.data.map((profile) => ({
      profile,
      integration: firstIntegrationByClient.get(profile.slug),
    })),
  };
}

export async function upsertClientAdminRecord(input: {
  slug: string;
  businessName: string;
  ownerName: string;
  plan: string;
  status: string;
  statusLabel: string;
  website: string;
  phone: string;
  email: string;
  googleReviewUrl: string;
  location: string;
  category: string;
  logoText: string;
  brandNote: string;
  protection: string;
  statusSummary: string;
  nextClientAction: string;
  weeklyGoal: number;
  voiceMode: string;
  voiceTone: string;
  voiceFavoritePhrases: string;
  voiceAvoidPhrases: string;
  voiceEscalationNotes: string;
  integrationSystemName: string;
  integrationConnectionLevel: string;
  integrationStatus: string;
  reviewReadyEvent: string;
  integrationAdminContact: string;
  sendDelayDays: number;
  integrationNotes: string;
}) {
  if (!hasSupabaseConfig()) return { ok: false as const, error: "Supabase is not configured." };

  const slug = cleanClientSlug(input.slug);
  if (!slug) return { ok: false as const, error: "Client slug is required." };

  const fallback = getClientHub(slug) ?? CLIENT_HUBS[0];
  const plan = normalizeClientHubPlan(input.plan) ?? fallback.plan;
  const weeklyGoal = clampNumber(input.weeklyGoal, 1, 50, fallback.reviews.weeklyGoal);
  const sendDelayDays = clampNumber(input.sendDelayDays, 0, 30, 1);
  const businessName = cleanText(input.businessName) || fallback.businessName;
  const statusLabel = cleanText(input.statusLabel) || fallback.statusLabel;

  const profile: ClientHubProfile = {
    ...fallback,
    slug,
    businessName,
    ownerName: cleanText(input.ownerName),
    plan,
    statusLabel,
    website: cleanText(input.website),
    phone: cleanText(input.phone),
    email: cleanText(input.email),
    googleReviewUrl: cleanText(input.googleReviewUrl),
    location: cleanText(input.location),
    category: cleanText(input.category),
    logoText: cleanText(input.logoText) || initialsFor(businessName),
    brandNote: cleanText(input.brandNote) || fallback.brandNote,
    protection: normalizeProtection(input.protection) ?? fallback.protection,
    statusSummary: cleanText(input.statusSummary) || fallback.statusSummary,
    nextClientAction: cleanText(input.nextClientAction) || fallback.nextClientAction,
    reviews: {
      ...fallback.reviews,
      weeklyGoal,
      status: statusLabel,
    },
    voiceProfile: {
      mode: normalizeVoiceMode(input.voiceMode) ?? fallback.voiceProfile?.mode ?? "Draft only",
      tone: cleanText(input.voiceTone) || fallback.voiceProfile?.tone || "Friendly, concise, appreciative, and professional.",
      favoritePhrases: cleanText(input.voiceFavoritePhrases) || fallback.voiceProfile?.favoritePhrases || "",
      avoidPhrases: cleanText(input.voiceAvoidPhrases) || fallback.voiceProfile?.avoidPhrases || "",
      escalationNotes:
        cleanText(input.voiceEscalationNotes) ||
        fallback.voiceProfile?.escalationNotes ||
        "Hold any review mentioning refunds, safety, legal issues, staff accusations, or medical/regulated topics for human review.",
    },
  };

  const profileBody = {
    slug,
    business_name: profile.businessName,
    owner_name: profile.ownerName,
    plan: profile.plan,
    status: cleanStatus(input.status),
    status_label: profile.statusLabel,
    website: profile.website,
    phone: profile.phone,
    email: profile.email,
    google_review_url: profile.googleReviewUrl ?? "",
    location: profile.location,
    category: profile.category,
    profile,
  };

  const profileResult = await supabaseRest<ClientProfileAdminRow[]>(CLIENT_PROFILES_TABLE, {
    method: "POST",
    query: "on_conflict=slug",
    body: [profileBody],
    prefer: "resolution=merge-duplicates,return=representation",
  });
  if (!profileResult.ok) return { ok: false as const, error: profileResult.error };

  const systemName = cleanText(input.integrationSystemName);
  if (systemName) {
    const integrationResult = await supabaseRest<ClientIntegrationAdminRow[]>(
      CLIENT_INTEGRATIONS_TABLE,
      {
        method: "POST",
        query: "on_conflict=client_slug,system_name",
        body: [
          {
            client_slug: slug,
            system_name: systemName,
            system_type: "pos_crm",
            connection_level: cleanText(input.integrationConnectionLevel) || "manual_upload",
            status: cleanStatus(input.integrationStatus),
            review_ready_event: cleanText(input.reviewReadyEvent),
            admin_contact: cleanText(input.integrationAdminContact),
            send_delay_days: sendDelayDays,
            notes: cleanText(input.integrationNotes),
          },
        ],
        prefer: "resolution=merge-duplicates,return=representation",
      },
    );
    if (!integrationResult.ok) return { ok: false as const, error: integrationResult.error };
  }

  return { ok: true as const, slug };
}

function normalizeProtection(protection: string): ClientHubProfile["protection"] | undefined {
  if (protection === "Not enabled" || protection === "Requested" || protection === "Enabled") {
    return protection;
  }
  return undefined;
}

function normalizeVoiceMode(mode: string): NonNullable<ClientHubProfile["voiceProfile"]>["mode"] | undefined {
  if (mode === "Draft only" || mode === "Approval required" || mode === "Safe auto-reply eligible") {
    return mode;
  }
  return undefined;
}

function cleanClientSlug(value: string) {
  return value.trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}

function cleanStatus(value: string) {
  return value.trim().replace(/[^a-z0-9_-]/gi, "").slice(0, 40).toLowerCase() || "setup";
}

function cleanText(value: string) {
  return value.trim().slice(0, 2000);
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function initialsFor(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "GMF";
}
