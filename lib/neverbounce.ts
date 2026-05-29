import { envValueAny } from "@/lib/getmefound-env";

const NEVERBOUNCE_API_BASE = "https://api.neverbounce.com";

export type NeverBounceVerification =
  | {
      ok: true;
      provider: "neverbounce";
      result: string;
      flags: string[];
      suggestedCorrection: string;
    }
  | {
      ok: false;
      provider: "neverbounce";
      result: string;
      flags: string[];
      error: string;
      suggestedCorrection?: string;
    };

export async function verifyEmailWithNeverBounce(email: string): Promise<NeverBounceVerification> {
  const apiKey = envValueAny("NEVERBOUNCE_API_KEY", "NOBOUNCE_API_KEY");
  if (!apiKey) {
    return {
      ok: false,
      provider: "neverbounce",
      result: "not_configured",
      flags: [],
      error: "NoBounce/NeverBounce API key is not configured.",
    };
  }

  const url = new URL("/v4/single/check", NEVERBOUNCE_API_BASE);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("email", email);

  try {
    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => null)) as
      | {
          status?: string;
          result?: string;
          flags?: string[];
          suggested_correction?: string;
          message?: string;
        }
      | null;

    if (!res.ok || data?.status !== "success") {
      return {
        ok: false,
        provider: "neverbounce",
        result: "api_error",
        flags: [],
        error: data?.message ?? `NeverBounce rejected the request (${res.status}).`,
      };
    }

    const result = data.result ?? "unknown";
    const flags = Array.isArray(data.flags) ? data.flags : [];
    const suggestedCorrection = data.suggested_correction ?? "";
    if (result !== "valid") {
      return {
        ok: false,
        provider: "neverbounce",
        result,
        flags,
        suggestedCorrection,
        error: "Email could not be verified as deliverable.",
      };
    }

    return { ok: true, provider: "neverbounce", result, flags, suggestedCorrection };
  } catch (error) {
    return {
      ok: false,
      provider: "neverbounce",
      result: "api_error",
      flags: [],
      error: error instanceof Error ? error.message : "NeverBounce request failed.",
    };
  }
}
