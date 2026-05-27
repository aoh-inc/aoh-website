import { NextResponse } from "next/server";
import { hasCbcSession } from "@/lib/cbc-auth";
import { readCbcUploadedRecords } from "@/lib/cbc-record-reader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!(await hasCbcSession())) return cbcUnauthorized();
  const body = (await request.json().catch(() => null)) as { force?: boolean } | null;
  return NextResponse.json(await readCbcUploadedRecords(Boolean(body?.force)));
}

export async function GET() {
  if (!(await hasCbcSession())) return cbcUnauthorized();
  return NextResponse.json(await readCbcUploadedRecords(false));
}

function cbcUnauthorized() {
  return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
}
