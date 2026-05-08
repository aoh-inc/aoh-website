import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

const buckets = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function middleware(req: NextRequest) {
  const ip = clientIp(req);
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { ok: false, error: "Please wait before submitting again." },
      { status: 429 },
    );
  }

  recent.push(now);
  buckets.set(ip, recent);

  if (Math.random() < 0.01) {
    for (const [key, value] of buckets) {
      const fresh = value.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) buckets.delete(key);
      else buckets.set(key, fresh);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/report/:path*"],
};
