import { NextResponse } from "next/server";
import { hasCbcSession } from "@/lib/cbc-auth";
import { readCbcUploadedRecords } from "@/lib/cbc-record-reader";
import { envValue } from "@/lib/getmefound-env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type CbcChatCase = {
  label?: string;
  cancerType?: string;
  stage?: string;
  biomarkers?: string;
  pathology?: string;
  imaging?: string;
  treatments?: string;
  location?: string;
  notes?: string;
  pastedReport?: string;
};

export async function POST(request: Request) {
  if (!(await hasCbcSession())) {
    return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { question?: string; profile?: CbcChatCase }
    | null;
  const question = body?.question?.trim();
  if (!question) {
    return NextResponse.json({ ok: false, error: "Ask CBC a question first." }, { status: 400 });
  }

  const apiKey = envValue("OPENAI_API_KEY");
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "CBC AI is not configured." }, { status: 503 });
  }

  const extracted = await readCbcUploadedRecords(false);
  const model = envValue("CBC_OPENAI_MODEL") || "gpt-5.5";
  const prompt = buildCbcChatPrompt(question, body?.profile ?? {}, extracted.sourcePreview);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: [
        "You are CBC, Cancer Battle Companion, helping Mike and Mark understand cancer records.",
        "Use the provided case fields and uploaded-file excerpts as the source of truth.",
        "Be warm, plain-spoken, and practical. Do not promise a cure or replace an oncologist.",
        "When the question asks for recommendations, give evidence-aware options to discuss with oncology, the needed confirmation tests, and follow-up questions.",
        "If the records do not prove something, say exactly what is missing.",
        "Keep answers focused and readable. Use short bullets only when helpful.",
      ].join("\n"),
      input: prompt,
      reasoning: { effort: "high" },
      text: { verbosity: "medium" },
      max_output_tokens: 900,
    }),
  });

  const data = (await response.json().catch(() => null)) as OpenAiResponse | null;
  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: data?.error?.message ?? "CBC AI could not answer right now." },
      { status: 502 },
    );
  }

  const answer = extractOpenAiText(data).trim();
  if (!answer) {
    return NextResponse.json({ ok: false, error: "CBC AI returned an empty answer." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    model,
    filesRead: extracted.filesRead,
    answer,
  });
}

type OpenAiResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

function buildCbcChatPrompt(question: string, profile: CbcChatCase, sourcePreview: string) {
  return [
    "QUESTION",
    question,
    "",
    "SAVED CASE FIELDS",
    `Case label: ${profile.label || "Mark"}`,
    `Cancer/history: ${profile.cancerType || "Not filled"}`,
    `Stage/status: ${profile.stage || "Not filled"}`,
    `Biomarkers/genetics: ${profile.biomarkers || "Not filled"}`,
    `Pathology: ${profile.pathology || "Not filled"}`,
    `Imaging: ${profile.imaging || "Not filled"}`,
    `Treatments: ${profile.treatments || "Not filled"}`,
    `Location/travel: ${profile.location || "Not filled"}`,
    `Notes: ${profile.notes || "Not filled"}`,
    `Pasted report text: ${profile.pastedReport || "Not filled"}`,
    "",
    "UPLOADED FILE EXCERPTS",
    sourcePreview || "No readable uploaded-file excerpts were available.",
  ].join("\n");
}

function extractOpenAiText(data: OpenAiResponse | null) {
  if (!data) return "";
  if (typeof data.output_text === "string") return data.output_text;
  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? "")
      .filter(Boolean)
      .join("\n") ?? ""
  );
}
