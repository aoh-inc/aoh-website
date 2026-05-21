import { NextRequest, NextResponse } from "next/server";
import { listReviewAutomationSummaries } from "@/lib/review-automation-store";

export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanParam(searchParams.get("client"));
  const limit = Number(searchParams.get("limit") ?? 20);
  const result = await listReviewAutomationSummaries({ clientSlug, limit });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, storageConfigured: result.configured, error: result.error },
      { status: result.configured ? 502 : 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: clientSlug || "all",
    count: result.records.length,
    records: result.records,
  });
}

function authorize(req: NextRequest) {
  const expected =
    process.env.AOH_INTERNAL_API_TOKEN?.trim() ||
    process.env.REPORT_TEST_BYPASS_TOKEN?.trim() ||
    "";
  if (!expected) {
    return { ok: false as const, status: 503, error: "Internal status token is not configured." };
  }

  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const token = bearer || req.headers.get("x-aoh-internal-token")?.trim();
  if (token !== expected) {
    return { ok: false as const, status: 401, error: "Unauthorized." };
  }

  return { ok: true as const };
}

function cleanParam(value: string | null) {
  return (value ?? "").trim().replace(/[^a-z0-9-]/gi, "").slice(0, 80).toLowerCase();
}
