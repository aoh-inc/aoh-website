import { NextRequest } from "next/server";

export function authorizeInternalRequest(req: NextRequest) {
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
