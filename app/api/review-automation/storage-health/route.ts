import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return NextResponse.json({
      ok: false,
      configured: false,
      stage: "env",
      error: "Storage env vars are not both set.",
    });
  }

  const key = `review-automation:health:${crypto.randomUUID()}`;
  const value = new Date().toISOString();
  const write = await redisPipeline(url, token, [["SET", key, value, "EX", "60"]]);
  if (!write.ok) {
    return NextResponse.json({
      ok: false,
      configured: true,
      stage: "write",
      status: write.status ?? null,
      error: write.error,
    });
  }

  const read = await redisPipeline(url, token, [["GET", key]]);
  const cleanup = await redisPipeline(url, token, [["DEL", key]]);
  const readValue = read.ok && Array.isArray(read.values) ? read.values[0] : null;

  return NextResponse.json({
    ok: read.ok && readValue === value,
    configured: true,
    stage: read.ok && readValue === value ? "ready" : "read",
    write: write.ok,
    read: read.ok,
    cleanup: cleanup.ok,
    status: read.status ?? write.status ?? null,
  });
}

async function redisPipeline(url: string, token: string, commands: string[][]) {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown Redis error.");
  });

  if (response instanceof Error) {
    return { ok: false as const, error: response.message };
  }
  if (!response.ok) {
    return { ok: false as const, status: response.status, error: "Redis REST request failed." };
  }

  const json = (await response.json().catch(() => null)) as Array<{ result?: unknown; error?: string }> | null;
  if (!Array.isArray(json)) {
    return { ok: false as const, status: response.status, error: "Unexpected Redis REST response." };
  }

  const failed = json.find((item) => item?.error);
  if (failed?.error) {
    return { ok: false as const, status: response.status, error: "Redis command failed." };
  }

  return { ok: true as const, status: response.status, values: json.map((item) => item.result) };
}
