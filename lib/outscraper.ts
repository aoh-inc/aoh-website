import { envValue } from "@/lib/getmefound-env";

const OUTSCRAPER_API_BASE = "https://api.outscraper.com";

export type OutscraperBusiness = {
  name: string;
  rating: number | null;
  reviewCount: number | null;
  photosCount: number | null;
  hoursPresent: boolean | null;
  primaryCategory: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  googleMapsUrl: string;
  sourceQuery: string;
  latestReviewDate: string | null;
};

type OutscraperRow = Record<string, unknown>;

export async function searchOutscraperBusinesses(input: {
  query: string;
  limit: number;
  timeoutMs?: number;
}): Promise<{ ok: true; businesses: OutscraperBusiness[] } | { ok: false; error: string; missingKey?: boolean }> {
  const apiKey = envValue("OUTSCRAPER_API_KEY");
  if (!apiKey) return { ok: false, error: "OUTSCRAPER_API_KEY is not configured.", missingKey: true };

  const url = new URL("/google-maps-search", OUTSCRAPER_API_BASE);
  url.searchParams.set("query", input.query);
  url.searchParams.set("limit", String(Math.max(1, Math.min(20, input.limit))));
  url.searchParams.set("async", "false");
  url.searchParams.set("dropDuplicates", "true");
  url.searchParams.set("region", "US");

  try {
    const res = await fetch(url, {
      headers: { "X-API-KEY": apiKey, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(input.timeoutMs ?? 12_000),
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `Outscraper failed ${res.status}: ${text.slice(0, 240)}` };
    }

    const data = parseJson(text);
    const rows = flattenOutscraperData(data?.data);
    return {
      ok: true,
      businesses: rows.map((row) => normalizeOutscraperBusiness(row, input.query)).filter((row) => row.name),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Outscraper request failed.",
    };
  }
}

function normalizeOutscraperBusiness(row: OutscraperRow, sourceQuery: string): OutscraperBusiness {
  const address = pick(row, ["full_address", "address", "formatted_address"]);
  const city = pick(row, ["city", "borough"]) || cityFromAddress(address);
  const state = pick(row, ["us_state", "state", "region"]) || stateFromAddress(address);
  const photosRaw = row.photos_count ?? row.photo_count ?? row.photos;
  const hoursRaw = row.working_hours ?? row.hours ?? row.schedule ?? row.opening_hours;

  return {
    name: pick(row, ["name", "business_name", "company_name", "title"]),
    rating: numberOrNull(pick(row, ["rating", "gbp_rating", "stars"])),
    reviewCount: integerOrNull(pick(row, ["reviews", "review_count", "reviews_count", "user_ratings_total"])),
    photosCount: photosCountFrom(photosRaw),
    hoursPresent: hoursPresentFrom(hoursRaw),
    primaryCategory: pick(row, ["type", "category", "primary_category", "niche"]),
    website: cleanUrl(pick(row, ["site", "website", "domain"])),
    phone: pick(row, ["phone", "phone_1", "phone_number"]),
    address,
    city,
    state,
    googleMapsUrl: pick(row, ["link", "google_maps_url", "location_link", "reviews_link"]),
    sourceQuery,
    latestReviewDate: pick(row, ["latest_review_date", "last_review_date", "latest_review_time_ago"]) || null,
  };
}

function flattenOutscraperData(data: unknown): OutscraperRow[] {
  if (!Array.isArray(data)) return [];
  const flattened = data.every((item) => Array.isArray(item)) ? data.flat() : data;
  return flattened.filter((item): item is OutscraperRow => Boolean(item && typeof item === "object" && !Array.isArray(item)));
}

function pick(record: OutscraperRow, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function parseJson(raw: string): { data?: unknown } | null {
  try {
    return JSON.parse(raw) as { data?: unknown };
  } catch {
    return null;
  }
}

function cleanUrl(value: string) {
  if (!value) return "";
  try {
    return new URL(value).toString();
  } catch {
    try {
      return new URL(`https://${value}`).toString();
    } catch {
      return "";
    }
  }
}

function numberOrNull(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function integerOrNull(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function photosCountFrom(value: unknown) {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === "string" && value.trim()) return integerOrNull(value);
  return null;
}

function hoursPresentFrom(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return null;
}

function cityFromAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length >= 3 ? parts[parts.length - 3] : "";
}

function stateFromAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const stateZip = parts.length >= 2 ? parts[parts.length - 2] : "";
  const match = stateZip.match(/\b[A-Z]{2}\b/i);
  return match ? match[0].toUpperCase() : "";
}
