import { NextResponse } from "next/server";
import { getEnvChecks } from "@/lib/getmefound-env";
import { supabaseRest } from "@/lib/supabase-rest";

export async function GET() {
  const env = getEnvChecks().filter((item) => item.name.includes("SUPABASE"));
  const tableCheck = await supabaseRest<Array<{ service: string }>>("tooling_status", {
    query: "select=service&service=eq.supabase&limit=1",
  });

  return NextResponse.json({
    ok: env.every((item) => item.present) && tableCheck.ok,
    env,
    database: tableCheck.ok
      ? { ok: true, status: tableCheck.status, toolingStatusTable: "ready" }
      : {
          ok: false,
          status: tableCheck.status,
          toolingStatusTable: "not-ready",
          error: tableCheck.error,
          code: tableCheck.code,
        },
  });
}
