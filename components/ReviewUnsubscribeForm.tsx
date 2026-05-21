"use client";

import { useRef, useState } from "react";
import { validateEmail } from "@/lib/email-validation";

export function ReviewUnsubscribeForm({
  clientSlug,
  clientName,
}: {
  clientSlug: string;
  clientName: string;
}) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if ((honeypotRef.current?.value ?? "").trim()) {
      setDone(true);
      return;
    }
    const emailCheck = validateEmail(customerEmail);
    if (!emailCheck.ok) {
      setError(emailCheck.error);
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/review-automation/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientSlug,
          customerEmail,
          reason,
          websiteTrap: honeypotRef.current?.value ?? "",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Done</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">You will not receive review requests.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          We saved this preference for {clientName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Review requests</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Stop review request emails</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter your email and we will keep it off future review request lists for {clientName}.
        </p>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-950">Email</span>
        <input
          type="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-slate-950">Reason optional</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
      </label>

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="unsubscribe-trap">Leave blank</label>
        <input id="unsubscribe-trap" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Stop requests"}
      </button>
    </form>
  );
}
