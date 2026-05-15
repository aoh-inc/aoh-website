"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AIVisibilityForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [business, setBusiness] = useState(
    searchParams.get("business") ?? "",
  );
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const email = searchParams.get("email") ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!business.trim()) return;
    const p = new URLSearchParams();
    p.set("business", business.trim());
    if (city.trim()) p.set("city", city.trim());
    if (email) p.set("email", email);
    router.push(`/report/ai-visibility?${p.toString()}`);
  }

  const prefilled = business.length > 0;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-[var(--color-bg-page)] focus:outline-none"
    >
      {/* Hero */}
      <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Free · No credit card
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-5">
            Is AI recommending your competitor instead of you?
          </h1>
          <p className="text-lg text-[var(--color-hero-subtext)] max-w-xl mx-auto">
            We check your Google listing, your website signals, and how you
            compare to your top local competitor. Your report is ready in
            seconds.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-[var(--color-bg-page)] py-10 md:py-14">
        <div className="mx-auto max-w-lg px-6">
          {prefilled ? (
            <div className="rounded-2xl border border-[var(--color-hero-border)] bg-[var(--color-hero-bg)] p-8 text-[var(--color-hero-text)]">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
                Ready to check
              </p>
              <p className="text-2xl font-bold text-[var(--color-hero-text)] mb-1">
                {business}
              </p>
              {city && (
                <p className="text-sm text-[var(--color-hero-subtext)] mb-6">
                  {city}
                </p>
              )}
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className="w-full min-h-[52px] rounded-xl bg-[var(--color-accent)] px-6 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  See My AI Visibility Report →
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-[var(--color-hero-subtext)]">
                We scan your Google listing and website. Takes about 10 seconds.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-hero-border)] bg-[var(--color-hero-bg)] p-8 text-[var(--color-hero-text)]">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-5">
                See your AI visibility score
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="lp-business" className="sr-only">
                    Business name
                  </label>
                  <input
                    id="lp-business"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Business name"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-hero-border)] bg-white/5 px-4 py-3 text-base text-[var(--color-hero-text)] placeholder:text-[var(--color-hero-subtext)] outline-none transition focus:border-[var(--color-accent)] focus:bg-white/10"
                  />
                </div>
                <div>
                  <label htmlFor="lp-city" className="sr-only">
                    City and state
                  </label>
                  <input
                    id="lp-city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="City, State (e.g. Austin, TX)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-hero-border)] bg-white/5 px-4 py-3 text-base text-[var(--color-hero-text)] placeholder:text-[var(--color-hero-subtext)] outline-none transition focus:border-[var(--color-accent)] focus:bg-white/10"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[52px] rounded-xl bg-[var(--color-accent)] px-6 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  See My AI Visibility Report →
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-[var(--color-hero-subtext)]">
                We scan your Google listing and website. Takes about 10 seconds.
                Free — no card needed.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function AIVisibilityLandingPage() {
  return (
    <Suspense>
      <AIVisibilityForm />
    </Suspense>
  );
}
