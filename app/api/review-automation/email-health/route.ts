import { NextResponse } from "next/server";
import { cleanEnvValue } from "@/lib/env";

export async function GET() {
  const provider = cleanEnvValue(process.env.AOH_REVIEW_EMAIL_PROVIDER).toLowerCase() || "resend";
  const hasResendKey = Boolean(cleanEnvValue(process.env.RESEND_API_KEY));
  const fromEmail = cleanEnvValue(process.env.AOH_REVIEW_REQUEST_FROM_EMAIL);
  const replyTo = cleanEnvValue(process.env.AOH_REVIEW_REQUEST_REPLY_TO);
  const ready = provider === "resend" && hasResendKey && Boolean(fromEmail);

  return NextResponse.json({
    ok: ready,
    provider,
    checks: {
      resendApiKey: hasResendKey ? "present" : "missing",
      fromEmail: fromEmail ? "present" : "missing",
      replyTo: replyTo ? "present" : "optional-missing",
    },
    canSendReviewRequests: ready,
  });
}
