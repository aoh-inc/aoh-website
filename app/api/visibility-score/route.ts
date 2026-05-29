/**
 * POST /api/visibility-score
 *
 * Server-to-server endpoint (not public).
 * Authenticates with GMF_INTERNAL_API_TOKEN via:
 *   Authorization: Bearer <token>   OR   x-api-key: <token>
 *
 * Used by the cold-outreach pipeline so the gap/hook the lead receives
 * in a cold email is scored by the same engine as their inbound report.
 */

import { NextRequest, NextResponse } from "next/server";
import { searchOutscraperBusinesses } from "@/lib/outscraper";
import { scoreOutscraperBusiness } from "@/lib/visibility-score";
import { createVisibilityReportRequest } from "@/lib/visibility-reports";
import { envValue } from "@/lib/getmefound-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authenticate(req: NextRequest): boolean {
  const expected = envValue("GMF_INTERNAL_API_TOKEN")?.trim();
  if (!expected) return false; // key not configured → always deny
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const xKey = req.headers.get("x-api-key")?.trim();
  return bearer === expected || xKey === expected;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    business_name,
    city,
    category,
    place_id,
    website,
    contact_email,
    source,
  } = body as {
    business_name?: unknown;
    city?: unknown;
    category?: unknown;
    place_id?: unknown;
    website?: unknown;
    contact_email?: unknown;
    source?: unknown;
  };

  if (typeof business_name !== "string" || !business_name.trim()) {
    return NextResponse.json({ ok: false, error: "business_name is required." }, { status: 400 });
  }
  if (typeof city !== "string" || !city.trim()) {
    return NextResponse.json({ ok: false, error: "city is required." }, { status: 400 });
  }

  const cleanName = business_name.trim();
  const cleanCity = city.trim();
  const cleanCategory = typeof category === "string" ? category.trim() : "";
  const cleanEmail = typeof contact_email === "string" ? contact_email.trim().toLowerCase() : "";
  const cleanSource = typeof source === "string" ? source.trim() : "api_visibility_score";

  // ── 1. Enrich via Outscraper ─────────────────────────────────────────────

  // Build query: prefer place_id if given; otherwise name + city + category
  const query = typeof place_id === "string" && place_id.trim()
    ? place_id.trim()
    : cleanCategory
      ? `${cleanName}, ${cleanCategory}, ${cleanCity}`
      : `${cleanName}, ${cleanCity}`;

  const enrichResult = await searchOutscraperBusinesses({
    query,
    limit: 3,
    timeoutMs: 15_000,
  });

  if (!enrichResult.ok) {
    // Fail safe — return insufficient_data so pipeline suppresses the lead
    if (enrichResult.missingKey) {
      return NextResponse.json({ ok: false, error: "Outscraper not configured." }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      status: "insufficient_data",
      error: enrichResult.error,
      visibility_score: null,
      grades: null,
      signals: [],
      worst_gap: null,
      gap_hook: "",
      report_url: null,
    });
  }

  // Pick the best match — prefer name match, then first result
  const businesses = enrichResult.businesses;
  const normalizedInput = cleanName.toLowerCase().replace(/\s+/g, " ");
  const matched =
    businesses.find((b) =>
      b.name.toLowerCase().replace(/\s+/g, " ").includes(normalizedInput) ||
      normalizedInput.includes(b.name.toLowerCase().replace(/\s+/g, " ").slice(0, 12)),
    ) ?? businesses[0];

  if (!matched) {
    return NextResponse.json({
      ok: true,
      status: "insufficient_data",
      error: "No business found matching the input.",
      visibility_score: null,
      grades: null,
      signals: [],
      worst_gap: null,
      gap_hook: "",
      report_url: null,
    });
  }

  // Override website from input if Outscraper didn't find one
  if (typeof website === "string" && website.trim() && !matched.website) {
    matched.website = website.trim();
  }

  // ── 2 + 3. Score using the 20-signal engine + derive gap/hook ────────────

  const scored = scoreOutscraperBusiness(matched);

  // ── 4. Create/ensure report record + build report_url ───────────────────

  const origin = resolveOrigin(req);
  const runId = crypto.randomUUID();
  const reportUrl = buildReportUrl(origin, runId, cleanName, cleanCity, cleanEmail);

  if (cleanEmail) {
    await createVisibilityReportRequest({
      runId,
      context: "prospect_free_check",
      businessName: matched.name || cleanName,
      contactEmail: cleanEmail,
      businessWebsite: matched.website || (typeof website === "string" ? website : ""),
      businessLocation: `${matched.city || cleanCity}, ${matched.state}`.replace(/,\s*$/, ""),
      reportType: "ai_visibility",
      source: cleanSource,
      campaign: "organic",
      auditUrl: reportUrl,
      deliveryMode: "automated",
      metadata: {
        scoringSource: "api_visibility_score",
        worst_gap: scored.worst_gap,
        visibility_score: scored.visibility_score,
        days_since_last_review: scored.days_since_last_review,
        matched_business: matched.name,
        outscraper_query: query,
      },
    }).catch((err) => {
      console.error("[visibility-score] createVisibilityReportRequest failed:", err);
    });
  }

  // ── Return ────────────────────────────────────────────────────────────────

  return NextResponse.json({
    ok: true,
    status: scored.status,
    visibility_score: scored.visibility_score,
    grades: scored.grades,
    signals: scored.signals,
    worst_gap: scored.worst_gap,
    gap_hook: scored.gap_hook,
    report_url: reportUrl,
    // Extra context the pipeline can store
    matched_business: {
      name: matched.name,
      city: matched.city,
      state: matched.state,
      category: matched.primaryCategory,
      review_count: matched.reviewCount,
      rating: matched.rating,
      photos_count: matched.photosCount,
      hours_present: matched.hoursPresent,
      website: matched.website,
      days_since_last_review: scored.days_since_last_review,
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveOrigin(req: NextRequest): string {
  const configured = envValue("GMF_PUBLIC_SITE_URL") ?? envValue("NEXT_PUBLIC_SITE_URL");
  if (configured) return configured.replace(/\/+$/, "");
  const fromHeader = req.headers.get("origin") ?? req.headers.get("x-forwarded-host");
  if (fromHeader) {
    try {
      const u = new URL(fromHeader.startsWith("http") ? fromHeader : `https://${fromHeader}`);
      return u.origin;
    } catch {
      // fall through
    }
  }
  return "https://getmefound.ai";
}

function buildReportUrl(origin: string, runId: string, businessName: string, city: string, email: string): string {
  const base = `${origin}/lp/get-found`;
  const params = new URLSearchParams();
  params.set("runId", runId);
  params.set("business", businessName);
  if (city) params.set("city", city);
  if (email) params.set("email", email);
  params.set("source", "visibility_score_api");
  return `${base}?${params.toString()}`;
}
