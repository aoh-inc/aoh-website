import { supabaseRest } from "@/lib/supabase-rest";

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  source: string;
  user_agent?: string | null;
  ip_hint?: string | null;
};

export async function saveContactSubmission(input: ContactSubmission) {
  return supabaseRest<null>("contact_submissions", {
    method: "POST",
    body: {
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source,
      user_agent: input.user_agent ?? null,
      ip_hint: input.ip_hint ?? null,
    },
    prefer: "return=minimal",
  });
}

export async function createAgentTask(input: {
  title: string;
  kind: string;
  priority?: "low" | "normal" | "high";
  source?: string;
  payload?: Record<string, unknown>;
}) {
  return supabaseRest<null>("agent_tasks", {
    method: "POST",
    body: {
      title: input.title,
      kind: input.kind,
      priority: input.priority ?? "normal",
      status: "new",
      source: input.source ?? "website",
      payload: input.payload ?? {},
    },
    prefer: "return=minimal",
  });
}

export async function logEmailEvent(input: {
  provider: string;
  event_type: string;
  to_email: string;
  subject?: string;
  status: "sent" | "skipped" | "failed";
  provider_id?: string;
  error?: string;
  payload?: Record<string, unknown>;
}) {
  return supabaseRest<Array<{ id: string }>>("email_events", {
    method: "POST",
    body: {
      provider: input.provider,
      event_type: input.event_type,
      to_email: input.to_email,
      subject: input.subject ?? null,
      status: input.status,
      provider_id: input.provider_id ?? null,
      error: input.error ?? null,
      payload: input.payload ?? {},
    },
    prefer: "return=minimal",
  });
}
