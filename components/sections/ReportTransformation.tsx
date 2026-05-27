"use client";

import { useRef, useState } from "react";
import { AuditRequestForm } from "@/components/sections/AuditRequestForm";
import { trackBeforeAfterInteraction } from "@/lib/analytics";

type Finding = {
  title: string;
  detail: string;
};

const BEFORE_FINDINGS: Finding[] = [
  { title: "Customers can't see when you're open", detail: "Hours missing from Google" },
  { title: "Not enough reviews to get picked", detail: "4 reviews · AI looks for 50+" },
  { title: "Your website tells a different story", detail: "Phone and address don't match Google" },
  { title: "Competitors look more trustworthy", detail: "Their profile is cleaner and more complete" },
];

const AFTER_FINDINGS: Finding[] = [
  { title: "Business hours synced everywhere", detail: "Google, AI, and your site show the same hours" },
  { title: "Review engine running", detail: "New review requests go out weekly, automatically" },
  { title: "Website facts matched", detail: "Phone, address, and categories consistent everywhere" },
  { title: "AI-ready profile live", detail: "ChatGPT and Google have clear reasons to recommend you" },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ReportTransformation() {
  const [tab, setTab] = useState<"before" | "after">("before");
  const trackedInteraction = useRef(false);
  const isAfter = tab === "after";

  const pct = isAfter ? 89 : 12;
  const filledBars = isAfter ? 5 : 1;
  const findings = isAfter ? AFTER_FINDINGS : BEFORE_FINDINGS;

  function handleTab(nextTab: "before" | "after") {
    if (!trackedInteraction.current) {
      trackBeforeAfterInteraction();
      trackedInteraction.current = true;
    }
    setTab(nextTab);
  }

  return (
    <section
      aria-label="Sample visibility report"
      className="overflow-hidden border-y border-border bg-(--color-bg-elevated) py-10 md:py-14"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-14">
        {/* Left: sample report card */}
        <div className="order-2 min-w-0 md:order-1">

        {/* Browser chrome card */}
        <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
          {/* Browser bar */}
          <div className="flex items-center justify-between border-b border-border bg-(--color-bg-dark-card) px-4 py-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d9a441]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <p className="min-w-0 flex-1 truncate px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-hero-text)">
              getmefound.ai/sample
            </p>
            <a
              href="#free-audit"
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-80"
            >
              Get yours free →
            </a>
          </div>

          {/* Report content — light background simulating a real report page */}
          <div className="bg-[#f9f8f5] p-5 sm:p-6">
            {/* Business header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#111] sm:text-lg">
                  Green Valley Lawn Care
                </h3>
                <p className="mt-0.5 text-xs text-[#666] sm:text-sm">
                  Southington, CT 06489 · Lawn &amp; Landscape Services
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-error/30 bg-error/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-error">
                Sample
              </span>
            </div>

            {/* BEFORE / AFTER tabs */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTab("before")}
                className={`rounded-xl border py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  !isAfter
                    ? "border-error/40 bg-error/10 text-error"
                    : "border-black/10 bg-transparent text-[#888]"
                }`}
              >
                Before
              </button>
              <button
                onClick={() => handleTab("after")}
                className={`rounded-xl border py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  isAfter
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-black/10 bg-transparent text-[#888]"
                }`}
              >
                After
              </button>
            </div>

            {/* Likelihood card */}
            <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm sm:p-5">
              <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#999]">
                Likelihood of being found by customers
              </p>

              <div className="mb-4 flex items-end gap-3">
                <p
                  className={`font-mono text-5xl font-black leading-none sm:text-6xl ${
                    isAfter ? "text-accent" : "text-error"
                  }`}
                >
                  {pct}%
                </p>
                <p className="mb-1 text-xs leading-relaxed text-[#555] sm:text-sm">
                  {isAfter
                    ? "Google and AI are actively recommending Green Valley Lawn Care to customers in Southington."
                    : "Customers searching Southington are finding your competitors — not you."}
                </p>
              </div>

              {/* Main progress bar */}
              <div className="mb-2.5 h-2.5 overflow-hidden rounded-full bg-black/8">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isAfter ? "bg-accent" : "bg-error"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* 5 signal segment bars */}
              <div className="mb-4 flex gap-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                      i < filledBars
                        ? isAfter
                          ? "bg-accent"
                          : "bg-error"
                        : "bg-black/10"
                    }`}
                  />
                ))}
              </div>

              {/* Status pill */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isAfter ? "bg-accent/10 text-accent" : "bg-error/10 text-error"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isAfter ? "bg-accent" : "bg-error"}`}
                  aria-hidden="true"
                />
                {isAfter
                  ? "Being recommended by Google and AI"
                  : "Not being recommended by Google or AI"}
              </div>
            </div>

            {/* Findings */}
            <div className="mt-4">
              <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#999]">
                {isAfter ? "What we fixed" : "What's holding you back"}
              </p>
              <div className="space-y-2">
                {findings.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-xl border border-black/8 bg-white p-3 shadow-sm"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        isAfter
                          ? "bg-accent/10 text-accent ring-1 ring-accent/25"
                          : "bg-error/10 text-error ring-1 ring-error/25"
                      }`}
                    >
                      {isAfter ? <CheckIcon /> : <XIcon />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-[#111]">
                        {f.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#777]">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        </div>{/* end left column */}

        {/* Right: audit request form */}
        <div id="free-audit" className="order-1 min-w-0 md:order-2 md:pl-2">
          <AuditRequestForm />
        </div>
      </div>
    </section>
  );
}
