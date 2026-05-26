"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { validateEmail } from "@/lib/email-validation";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    onAuditTurnstileSuccess?: (token: string) => void;
    onAuditTurnstileExpired?: () => void;
  }
}

export function AuditRequestForm() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileTokenRef = useRef<string>("");

  useEffect(() => {
    window.onAuditTurnstileSuccess = (token: string) => {
      turnstileTokenRef.current = token;
    };
    window.onAuditTurnstileExpired = () => {
      turnstileTokenRef.current = "";
    };
    return () => {
      window.onAuditTurnstileSuccess = undefined;
      window.onAuditTurnstileExpired = undefined;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const honeypot = honeypotRef.current?.value ?? "";
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    if (businessName.trim().length < 2) {
      setError("Enter your business name.");
      return;
    }
    const v = validateEmail(email);
    if (!v.ok) {
      setError(v.error);
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          email: email.trim(),
          website: honeypot,
          turnstileToken: turnstileTokenRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-bold text-[var(--color-text-body)]">
          On its way — check your inbox shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
      <h2 className="text-2xl font-bold text-[var(--color-text-body)]">
        See where your business actually stands.
      </h2>
      <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
        Free. In your inbox within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="audit-business-name" className="block text-sm font-semibold mb-2 text-[var(--color-text-body)]">
            Business name
          </label>
          <input
            id="audit-business-name"
            name="businessName"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)]/60"
          />
        </div>

        <div>
          <label htmlFor="audit-email" className="block text-sm font-semibold mb-2 text-[var(--color-text-body)]">
            Email address
          </label>
          <input
            id="audit-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)]/60"
          />
        </div>

        {/* Honeypot */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
        >
          <label htmlFor="audit-website">Leave blank</label>
          <input
            id="audit-website"
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {pending ? "Sending..." : <>Send my free visibility check <span aria-hidden="true">→</span></>}
        </button>

        {error && (
          <p role="alert" className="text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}

        {TURNSTILE_SITE_KEY && (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
              async
              defer
            />
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="onAuditTurnstileSuccess"
              data-expired-callback="onAuditTurnstileExpired"
              data-size="invisible"
            />
          </>
        )}
      </form>
    </div>
  );
}
