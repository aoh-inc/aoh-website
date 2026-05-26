import { cleanEnvValue } from "@/lib/env";

type RateResult = { ok: boolean; retryAfterSec?: number };

const memoryBuckets = new Map<string, number[]>();

async function incrWithTtl(
  key: string,
  windowSec: number,
): Promise<{ count: number; ttlSec: number } | null> {
  const url = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!url || !token) return null;

  const endpoint = `${url}/pipeline`;
  const body = JSON.stringify([
    ["INCR", key],
    ["EXPIRE", key, String(windowSec), "NX"],
    ["TTL", key],
  ]);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body,
    cache: "no-store",
  }).catch(() => null);

  if (!res?.ok) return null;
  const data = (await res.json().catch(() => null)) as
    | Array<{ result?: number | string }>
    | null;
  if (!data || data.length < 3) return null;

  const count = Number(data[0]?.result ?? 0);
  const ttlRaw = Number(data[2]?.result ?? -1);
  const ttlSec = ttlRaw > 0 ? ttlRaw : windowSec;
  if (!Number.isFinite(count) || count <= 0) return null;
  return { count, ttlSec };
}

function incrInMemory(
  key: string,
  windowMs: number,
): { count: number; ttlSec: number } {
  const now = Date.now();
  const recent = (memoryBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  memoryBuckets.set(key, recent);

  const oldestInWindow = recent[0] ?? now;
  const retryAfterSec = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
  return { count: recent.length, ttlSec: retryAfterSec };
}

async function checkRate({
  key,
  limit,
  windowSec,
}: {
  key: string;
  limit: number;
  windowSec: number;
}): Promise<RateResult> {
  if (!key.trim()) return { ok: true };

  const redis = await incrWithTtl(key, windowSec);
  if (redis) {
    if (redis.count > limit) return { ok: false, retryAfterSec: redis.ttlSec };
    return { ok: true };
  }

  const mem = incrInMemory(key, windowSec * 1000);
  if (mem.count > limit) return { ok: false, retryAfterSec: mem.ttlSec };
  return { ok: true };
}

export async function checkEmailRate(email: string, limit: number): Promise<RateResult> {
  const key = `ratelimit:email:${email.trim().toLowerCase()}`;
  return checkRate({ key, limit, windowSec: 24 * 60 * 60 });
}

export async function checkReportDedupe(email: string, businessName: string): Promise<RateResult> {
  const emailNorm = email.trim().toLowerCase();
  const businessNorm = businessName.trim().toLowerCase().replace(/\s+/g, " ");
  const key = `dedupe:report:${emailNorm}:${businessNorm}`;
  return checkRate({ key, limit: 1, windowSec: 24 * 60 * 60 });
}

export async function checkIpRate(ip: string, limit: number, windowSec: number): Promise<RateResult> {
  const sanitized = ip.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 64) || "unknown";
  const key = `ratelimit:ip:${sanitized}`;
  return checkRate({ key, limit, windowSec });
}
