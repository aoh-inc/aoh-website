import { NextResponse } from "next/server";
import { hasCbcSession } from "@/lib/cbc-auth";
import { CBC_UPLOADED_FILES } from "@/lib/cbc-files";
import { hasCbcStorageConfig, uploadCbcStoredFiles } from "@/lib/cbc-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  if (!(await hasCbcSession())) {
    return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, storageConfigured: hasCbcStorageConfig() });
}

export async function POST(request: Request) {
  if (!(await hasCbcSession())) {
    return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
  }

  if (!hasCbcStorageConfig()) {
    return NextResponse.json(
      {
        ok: false,
        uploaded: [],
        skipped: [],
        rejected: [],
        error: "CBC upload storage is not configured.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, uploaded: [], skipped: [], rejected: [], error: "Choose at least one CBC file." },
      { status: 400 },
    );
  }

  const existingNames = new Set(CBC_UPLOADED_FILES.map((file) => file.name));
  const result = await uploadCbcStoredFiles(files, existingNames);

  return NextResponse.json({
    ok: true,
    ...result,
    message:
      result.uploaded.length > 0
        ? "CBC stored the new files privately. They will be read into Mark's case and chat context."
        : "CBC did not add a new file. Check duplicates or rejected files.",
  });
}
