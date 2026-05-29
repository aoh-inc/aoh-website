"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { trackAuditFormSubmit } from "@/lib/analytics";
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
      trackAuditFormSubmit();
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
        className="rounded-2xl border border-[var(--color-accent)]/20 bg-(--color-bg-dark-card) p-8"
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
          <svg className="h-6 w-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xl font-bold text-(--color-hero-text)">
          Your free visibility check is on its way.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          We received your request for <span className="font-semibold text-white/80">{businessName}</span>. Your personalized Visibility Engine report is being sent to <span className="font-semibold text-white/80">{email}</span> now - usually within 5 minutes.
        </p>
        <p className="mt-4 text-xs text-white/35">
          Check spam if you don&apos;t see it. Questions? Email{" "}
          <a href="mailto:support@getmefound.ai" className="text-[var(--color-accent)] hover:underline">
            support@getmefound.ai
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-(--color-bg-dark-card) p-8">
      <h2 className="text-2xl font-bold text-(--color-hero-text)">
        See where your business actually stands.
      </h2>
      <p className="mt-1.5 text-sm text-white/55">
        Free. We&apos;ll email your personalized Visibility Engine report in under 5 minutes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="audit-business-name" className="block text-sm font-semibold mb-2 text-white/80">
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
            className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white/6 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors text-white placeholder:text-white/35"
          />
        </div>

        <div>
          <label htmlFor="audit-email" className="block text-sm font-semibold mb-2 text-white/80">
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
            className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white/6 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors text-white placeholder:text-white/35"
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
          {pending ? "Checking..." : <>Send my free visibility check <span aria-hidden="true">{"->"}</span></>}
        </button>

        {error && (
          <p role="alert" className="text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-white/35 text-center">
          No password needed. We never touch your email hosting.{" "}
          <span className="text-white/50">Google access is manager-only - you stay the owner.</span>
        </p>

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
