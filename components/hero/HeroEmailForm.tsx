"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { HeroVisualReviews } from "./HeroVisualReviews";
import { HeroVisualAI } from "./HeroVisualAI";
import { validateEmail } from "@/lib/email-validation";

type VisualVariant = "reviews" | "ai";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
    onTurnstileExpired?: () => void;
  }
}

type Variant = "reviews" | "ai" | "default";

type VariantConfig = {
  headlineLines: ReactNode[];
  subheadline: string;
  priceLine: string;
  buttonText: string;
  checkbox?: {
    label: string;
    caption: string;
  };
};

const variants: Record<Variant, VariantConfig> = {
  reviews: {
    headlineLines: ["Your competitor", "just got another", <><span style={{ color: "#2D6A4F" }}>5-star</span> review.</>],
    subheadline:
      "Automated review requests and AI responses, done for you.",
    priceLine: "$1/day. No contract.",
    buttonText: "Get Your Free Report",
    checkbox: {
      label:
        "Also check my AI Visibility Score — see if I'm showing up in ChatGPT and Google AI.",
      caption:
        "25% of searches have already moved to AI. Most local businesses are completely invisible. Find out if you're one of them.",
    },
  },
  ai: {
    headlineLines: ["Your next customer", "asked ChatGPT.", "You weren't there."],
    subheadline:
      "We get your business recommended by ChatGPT and Google AI — before your competitors do.",
    priceLine: "$3/day. No contract.",
    buttonText: "Get Your Free Report",
    checkbox: {
      label:
        "Also run my full Marketing Audit — see how my reviews and listings stack up.",
      caption:
        "Reviews are the fuel that powers AI recommendations. Businesses with more reviews get recommended more. See where you stand.",
    },
  },
  default: {
    headlineLines: ["The way customers", "find you", "just changed."],
    subheadline:
      "Google, Maps, ChatGPT, Perplexity — we make sure your business shows up everywhere.",
    priceLine: "Starting at $1/day. No contract.",
    buttonText: "Get Your Free Reports",
  },
};

function resolveVariant(param: string | null): Variant {
  if (param === "reviews") return "reviews";
  if (param === "ai") return "ai";
  return "default";
}

function HeroInner() {
  const searchParams = useSearchParams();
  const variant = resolveVariant(searchParams.get("campaign"));
  const config = variants[variant];

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [secondaryReport, setSecondaryReport] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [visualVariant, setVisualVariant] = useState<VisualVariant>("reviews");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileTokenRef = useRef<string>("");

  useEffect(() => {
    if (variant === "reviews") setVisualVariant("reviews");
    else if (variant === "ai") setVisualVariant("ai");
    else setVisualVariant(Math.random() >= 0.5 ? "ai" : "reviews");
  }, [variant]);

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      turnstileTokenRef.current = token;
    };
    window.onTurnstileExpired = () => {
      turnstileTokenRef.current = "";
    };
    return () => {
      window.onTurnstileSuccess = undefined;
      window.onTurnstileExpired = undefined;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const honeypotValue = honeypotRef.current?.value ?? "";
    if (honeypotValue.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const v = validateEmail(email);
    if (!v.ok) {
      setError(v.error);
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          website: honeypotValue,
          turnstileToken: turnstileTokenRef.current,
          campaign: variant === "default" ? "organic" : variant,
          visualVariant,
          secondaryReport,
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

  return (
    <section
      aria-label="Hero"
      className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 md:items-stretch">
          <div className="md:flex md:flex-col md:justify-center">
            <h1 className="font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,8vw,3.5rem)] md:text-[clamp(2.5rem,5vw,4.5rem)]">
              {config.headlineLines.map((line, i) => (
                <span className="hero-line-mask" key={`${variant}-${i}`}>
                  <span
                    className="hero-roll"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="hero-roll mt-6 max-w-xl text-lg text-[var(--color-hero-subtext)] md:text-xl"
              style={{ animationDelay: "400ms" }}
            >
              {config.subheadline}
            </p>

            <div
              className="hero-roll mt-8 max-w-xl"
              style={{ animationDelay: "600ms" }}
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
                aria-label="Request free reports"
                noValidate
              >
                <label htmlFor="hero-email" className="sr-only">
                  Business email
                </label>
                <input
                  id="hero-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "hero-email-error" : undefined}
                  className="flex-1 rounded-md border border-[var(--color-hero-border)] bg-white/5 px-4 py-3 text-base text-[var(--color-hero-text)] placeholder:text-[var(--color-hero-subtext)] outline-none transition focus:border-[var(--color-accent)] focus:bg-white/10"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="hero-website">Leave blank</label>
                  <input
                    id="hero-website"
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
                  className="w-full sm:w-auto min-h-[52px] min-w-fit whitespace-nowrap rounded-md bg-[var(--color-accent)] px-6 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-hero-bg)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pending ? "Sending…" : config.buttonText}
                </button>
              </form>

              {error && (
                <p
                  id="hero-email-error"
                  role="alert"
                  className="mt-3 text-sm text-[#E89B98]"
                >
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
                    className="cf-turnstile mt-3"
                    data-sitekey={TURNSTILE_SITE_KEY}
                    data-callback="onTurnstileSuccess"
                    data-expired-callback="onTurnstileExpired"
                    data-size="invisible"
                    data-theme="dark"
                  />
                </>
              )}

              <p className="mt-4 font-mono text-sm text-[var(--color-hero-subtext)]">
                {config.priceLine}
              </p>

              {config.checkbox && (
                <div className="mt-5">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={secondaryReport}
                      onChange={(e) => setSecondaryReport(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-accent)]"
                    />
                    <span className="text-sm text-[var(--color-hero-text)] leading-relaxed">
                      {config.checkbox.label}
                    </span>
                  </label>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-hero-subtext)]">
                    {config.checkbox.caption}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className="hero-roll h-full"
            style={{ animationDelay: "300ms" }}
          >
            {visualVariant === "ai" ? <HeroVisualAI /> : <HeroVisualReviews />}
          </div>
        </div>
      </div>

      {submitted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setSubmitted(false)}
        >
          <div
            className="max-w-md rounded-lg bg-[var(--color-bg-elevated)] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="hero-confirm-title"
              className="text-2xl font-semibold text-[var(--color-text-body)]"
            >
              Check your inbox in 10 minutes.
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-muted)]">
              Your free reports are on the way.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function HeroFallback() {
  return (
    <section
      aria-label="Hero"
      className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <div className="h-32 w-full max-w-xl rounded-md bg-white/[0.03]" />
            <div className="mt-6 h-6 w-3/4 rounded bg-white/[0.03]" />
            <div className="mt-8 h-12 w-full max-w-xl rounded-md bg-white/[0.03]" />
          </div>
          <div className="aspect-[4/3] w-full max-w-lg rounded-2xl bg-white/[0.03]" />
        </div>
      </div>
    </section>
  );
}

export function HeroEmailForm() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroInner />
    </Suspense>
  );
}
