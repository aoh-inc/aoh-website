import { CLIENT_HUBS, getClientHub, normalizeClientHubPlan, type ClientHubProfile } from "@/lib/client-hub";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";

const CLIENT_PROFILES_TABLE = "client_profiles";
const CLIENT_INTEGRATIONS_TABLE = "client_integrations";

type ClientProfileRow = {
  slug: string;
  business_name: string;
  owner_name: string;
  plan: ClientHubProfile["plan"];
  status_label: string;
  website: string;
  phone: string;
  email: string;
  google_review_url: string;
  location: string;
  category: string;
  profile: Partial<ClientHubProfile>;
};

type ClientIntegrationRow = {
  system_name: string;
  connection_level: string;
  send_delay_days: number;
  status: string;
};

export async function getClientHubProfile(slug: string): Promise<ClientHubProfile | undefined> {
  const cleanSlug = cleanClientSlug(slug);
  if (!cleanSlug) return undefined;

  const fromSupabase = await getClientProfileFromSupabase(cleanSlug);
  if (fromSupabase) return fromSupabase;

  return getClientHub(cleanSlug);
}

export async function listClientHubProfiles(): Promise<ClientHubProfile[]> {
  const fromSupabase = await listClientProfilesFromSupabase();
  return fromSupabase.length ? fromSupabase : CLIENT_HUBS;
}

export async function getClientIntegrationSettings(input: {
  clientSlug: string;
  systemName?: string;
}) {
  if (!hasSupabaseConfig()) {
    return { systemName: input.systemName ?? "Manual Upload", connectionLevel: "manual_upload", sendDelayDays: 1, status: "planned" };
  }

  const clientSlug = cleanClientSlug(input.clientSlug);
  if (!clientSlug) {
    return { systemName: input.systemName ?? "Manual Upload", connectionLevel: "manual_upload", sendDelayDays: 1, status: "planned" };
  }

  const query = new URLSearchParams({
    select: "system_name,connection_level,send_delay_days,status",
    client_slug: `eq.${clientSlug}`,
    order: "created_at.asc",
    limit: "20",
  });
  const result = await supabaseRest<ClientIntegrationRow[]>(CLIENT_INTEGRATIONS_TABLE, { query: query.toString() });
  if (!result.ok || !result.data.length) {
    return { systemName: input.systemName ?? "Manual Upload", connectionLevel: "manual_upload", sendDelayDays: 1, status: "planned" };
  }

  const targetSystem = cleanComparable(input.systemName ?? "");
  const row = targetSystem
    ? result.data.find((integration) => cleanComparable(integration.system_name) === targetSystem) ?? result.data[0]
    : result.data[0];

  return {
    systemName: row.system_name,
    connectionLevel: row.connection_level,
    sendDelayDays: clampDelay(row.send_delay_days),
    status: row.status,
  };
}

async function getClientProfileFromSupabase(slug: string) {
  if (!hasSupabaseConfig()) return undefined;

  const query = new URLSearchParams({
    select: "slug,business_name,owner_name,plan,status_label,website,phone,email,google_review_url,location,category,profile",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const result = await supabaseRest<ClientProfileRow[]>(CLIENT_PROFILES_TABLE, { query: query.toString() });
  if (!result.ok) return undefined;
  const row = result.data[0];
  return row ? profileFromRow(row) : undefined;
}

async function listClientProfilesFromSupabase() {
  if (!hasSupabaseConfig()) return [];

  const query = new URLSearchParams({
    select: "slug,business_name,owner_name,plan,status_label,website,phone,email,google_review_url,location,category,profile",
    order: "business_name.asc",
    limit: "200",
  });
  const result = await supabaseRest<ClientProfileRow[]>(CLIENT_PROFILES_TABLE, { query: query.toString() });
  if (!result.ok) return [];
  return result.data.map(profileFromRow);
}

function profileFromRow(row: ClientProfileRow): ClientHubProfile {
  const fallback = getClientHub(row.slug) ?? CLIENT_HUBS[0];
  const profile = row.profile ?? {};

  return {
    ...fallback,
    ...profile,
    slug: row.slug,
    businessName: row.business_name || profile.businessName || fallback.businessName,
    ownerName: row.owner_name || profile.ownerName || fallback.ownerName,
    plan: normalizeClientHubPlan(row.plan) ?? normalizeClientHubPlan(profile.plan) ?? fallback.plan,
    statusLabel: row.status_label || profile.statusLabel || fallback.statusLabel,
    website: row.website || profile.website || fallback.website,
    phone: row.phone || profile.phone || fallback.phone,
    email: row.email || profile.email || fallback.email,
    googleReviewUrl: row.google_review_url || profile.googleReviewUrl || fallback.googleReviewUrl,
    location: row.location || profile.location || fallback.location,
    category: row.category || profile.category || fallback.category,
    checklist: profile.checklist ?? fallback.checklist,
    metrics: profile.metrics ?? fallback.metrics,
    uploadRequests: profile.uploadRequests ?? fallback.uploadRequests,
    reviews: profile.reviews ?? fallback.reviews,
    monthlyRecap: profile.monthlyRecap ?? fallback.monthlyRecap,
    aiVisibilityPreview: profile.aiVisibilityPreview ?? fallback.aiVisibilityPreview,
  };
}

function cleanClientSlug(value: string) {
  return value.trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}

function cleanComparable(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function clampDelay(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(30, Math.max(0, Math.round(value)));
}
