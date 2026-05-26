"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CheckoutAutoRedirect({
  slug,
  label,
}: {
  slug: string;
  label: string;
}) {
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function startCheckout() {
      try {
        const res = await fetch("/api/checkout/create-session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const data = await res.json();
        if (data.ok && data.url) {
          window.location.replace(data.url);
          return;
        }
        setError(data.error ?? "Checkout could not be started.");
      } catch {
        setError("Checkout could not be started.");
      }
    }

    void startCheckout();
  }, [slug]);

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-[var(--color-bg-dark-card)] p-8 text-center text-[var(--color-hero-text)] ring-1 ring-[var(--color-hero-border)] md:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        Secure Stripe Checkout
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
        Opening {label}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-hero-subtext)]">
        You should be sent to Stripe in a moment.
      </p>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 py-2 font-semibold text-[var(--color-accent-text)]"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-[var(--color-hero-subtext)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-accent)]" />
          Redirecting now
        </div>
      )}

      <Link
        href="/pricing"
        className="mt-8 inline-flex text-sm text-[var(--color-hero-subtext)] underline-offset-4 hover:text-[var(--color-hero-text)] hover:underline"
      >
        Back to pricing
      </Link>
    </div>
  );
}
