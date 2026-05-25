"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Finding = {
  title: string;
  detail: string;
};

type TransformationCard = {
  title: string;
  before: string;
  after: string;
  proof?: {
    text: string;
    href: string;
  };
};

const BEFORE_FINDINGS: Finding[] = [
  {
    title: "Business hours missing",
    detail: "Customers and search tools see an incomplete profile.",
  },
  {
    title: "Website info does not match",
    detail: "The phone and service area tell a different story.",
  },
  {
    title: "Reviews are too quiet",
    detail: "Competitors look fresher when AI tools compare options.",
  },
  {
    title: "Competitor gets recommended",
    detail: "The public signals are easier to trust somewhere else.",
  },
];

const AFTER_FINDINGS: Finding[] = [
  {
    title: "Google profile cleaned up",
    detail: "Hours, service area, categories, and links line up.",
  },
  {
    title: "Website matches everywhere",
    detail: "Customers see the same phone, address, and offer.",
  },
  {
    title: "Review engine running",
    detail: "New requests go out so the profile keeps moving.",
  },
  {
    title: "AI-ready presence live",
    detail: "Search tools have a clearer reason to recommend you.",
  },
];

const TRANSFORMATION_CARDS: TransformationCard[] = [
  {
    title: "Google Profile",
    before: "Wrong hours, thin services, old photos, weak categories.",
    after: "Clean profile, clear services, stronger trust signals.",
  },
  {
    title: "Reviews",
    before: "Happy customers leave without being asked.",
    after: "Text and email requests go out every week.",
    proof: {
      text: "Twilio reports 98% SMS open rates.",
      href: "https://www.twilio.com/en-us/solutions/text-marketing",
    },
  },
  {
    title: "Website + AI Facts",
    before: "Website, Google, and business info do not match.",
    after: "Google, ChatGPT, Claude, and customers see the same facts.",
  },
];

const SAVINGS_BEFORE = [
  "Separate website hosting bill",
  "Separate texting or review tool",
  "Owner chasing small updates",
];

const SAVINGS_AFTER = [
  "Hosting included in Stay Found",
  "Review requests included",
  "GMF keeps the system moving",
];

function StatusIcon({ tone }: { tone: "bad" | "good" }) {
  if (tone === "good") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/35">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-error)]/12 text-[var(--color-error)] ring-1 ring-[var(--color-error)]/35">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

function ReportLayer({
  mode,
  score,
  label,
  findings,
}: {
  mode: "before" | "after";
  score: number;
  label: string;
  findings: Finding[];
}) {
  const isAfter = mode === "after";

  return (
    <div
      className={`absolute inset-0 ${
        isAfter
          ? "bg-[linear-gradient(135deg,#f8f6f1_0%,#eef7f2_100%)]"
          : "bg-[linear-gradient(135deg,#fff7f4_0%,#f8f6f1_100%)]"
      }`}
    >
      <div className="flex h-full flex-col p-4 sm:p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <div className="min-w-0">
            <p
              className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
                isAfter ? "text-[var(--color-accent)]" : "text-[var(--color-error)]"
              }`}
            >
              Sample {mode}
            </p>
            <h3 className="mt-1 text-lg font-bold text-[var(--color-text-body)] sm:text-xl">
              Local visibility report
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-4xl font-black leading-none text-[var(--color-text-body)] sm:text-5xl">
              {score}
              <span className="text-base text-[var(--color-text-muted)]">/100</span>
            </p>
            <p
              className={`mt-1 text-xs font-bold uppercase tracking-[0.14em] ${
                isAfter ? "text-[var(--color-accent)]" : "text-[var(--color-error)]"
              }`}
            >
              {label}
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Profile", value: isAfter ? "Fixed" : "Weak" },
            { label: "Reviews", value: isAfter ? "Active" : "Quiet" },
            { label: "AI search", value: isAfter ? "Clear" : "Skipped" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-lg border px-2 py-2 ${
                isAfter
                  ? "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06]"
                  : "border-[var(--color-error)]/20 bg-[var(--color-error)]/[0.05]"
              }`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--color-text-body)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid flex-1 gap-2 sm:gap-3">
          {findings.map((finding) => (
            <div
              key={finding.title}
              className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-white/72 p-3 shadow-sm"
            >
              <StatusIcon tone={isAfter ? "good" : "bad"} />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-[var(--color-text-body)]">
                  {finding.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {finding.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonSlider() {
  const reduce = useReducedMotion();
  const [position, setPosition] = useState(54);
  const [focused, setFocused] = useState(false);
  const afterClip = `inset(0 0 0 ${position}%)`;

  return (
    <div className="relative min-w-0">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[21.5rem] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-2xl shadow-[var(--color-bg-dark-card)]/15 sm:aspect-[16/11] sm:max-w-none">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-dark-card)] px-4 py-3 text-[var(--color-hero-subtext)]">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-error)]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d9a441]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
          </div>
          <p className="min-w-0 flex-1 truncate px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
            getmefound.ai/sample
          </p>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)] sm:block">
            AI ops stack
          </p>
        </div>

        <div className="relative h-[calc(100%-45px)]">
          <ReportLayer
            mode="before"
            score={24}
            label="Leaking calls"
            findings={BEFORE_FINDINGS}
          />

          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: afterClip }}
            animate={reduce ? undefined : { clipPath: afterClip }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <ReportLayer
              mode="after"
              score={84}
              label="Ready to win"
              findings={AFTER_FINDINGS}
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-20 flex -translate-x-1/2 items-center"
            style={{ left: `${position}%` }}
            animate={reduce ? undefined : { left: `${position}%` }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <span className="h-full w-px bg-white shadow-[0_0_0_1px_rgba(10,22,40,0.28),0_0_18px_rgba(10,22,40,0.18)]" />
            <span
              className={`absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-bg-dark-card)] text-[var(--color-hero-text)] shadow-xl ring-1 ring-white/20 ${
                focused ? "outline outline-2 outline-offset-2 outline-[var(--color-accent)]" : ""
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </span>
          </motion.div>

          <input
            type="range"
            min={8}
            max={92}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Slide between the sample before report and after report"
            className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]">
        <span className="min-w-0 text-[var(--color-error)]">Before: unclear</span>
        <span className="min-w-0 text-right text-[var(--color-accent)]">After: AI-ready</span>
      </div>
    </div>
  );
}

export function ReportTransformation() {
  return (
    <section
      aria-labelledby="report-transformation-title"
      className="overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-14 md:py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-14">
        <div className="min-w-0">
          <ComparisonSlider />
        </div>

        <div className="min-w-0 md:pl-2">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            The better promise
          </p>
          <h2
            id="report-transformation-title"
            className="break-words text-[clamp(2rem,8vw,2.75rem)] font-bold leading-tight text-[var(--color-text-body)] md:text-5xl"
          >
            Skip the black-box score. Show the before and after.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
            A sample bad report makes the problem obvious. A sample good report
            makes the outcome feel real. We use modern AI workflows to find the
            gaps, then we clean up the public signals that Google, Maps, and AI
            answers use to choose who gets recommended.
          </p>

          <div className="mt-7 grid gap-3">
            {[
              "Plain-English findings, not fake precision.",
              "Done-for-you fixes across profile, website, reviews, and listings.",
              "Ongoing AI-assisted monitoring so the cleanup does not drift.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-4"
              >
                <StatusIcon tone="good" />
                <p className="text-sm font-medium leading-relaxed text-[var(--color-text-body)]">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
            >
              See plans
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-6 py-3.5 text-base font-semibold text-[var(--color-text-body)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-lg"
            >
              Request an audit
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-6xl px-6 md:mt-16">
        <div className="mb-7 max-w-3xl">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            What actually changes
          </p>
          <h3 className="text-2xl font-bold leading-tight text-[var(--color-text-body)] md:text-4xl">
            From scattered online presence to a system that keeps you found.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
            Most local businesses do not need another dashboard. They need their Google profile, reviews, website, and business facts cleaned up, connected, and maintained.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TRANSFORMATION_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] p-5 shadow-sm"
            >
              <h4 className="text-lg font-bold text-[var(--color-text-body)]">
                {card.title}
              </h4>

              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/[0.04] p-4">
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-error)]">
                    Before
                  </p>
                  <div className="flex gap-3">
                    <StatusIcon tone="bad" />
                    <p className="text-sm leading-relaxed text-[var(--color-text-body)]">
                      {card.before}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] p-4">
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    After
                  </p>
                  <div className="flex gap-3">
                    <StatusIcon tone="good" />
                    <div>
                      <p className="text-sm leading-relaxed text-[var(--color-text-body)]">
                        {card.after}
                      </p>
                      {card.proof && (
                        <a
                          href={card.proof.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-xs font-semibold leading-5 text-[var(--color-accent)] underline decoration-[var(--color-accent)]/35 underline-offset-4 transition hover:text-[var(--color-accent-hover)]"
                        >
                          {card.proof.text}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-dark-card)] p-5 text-[var(--color-hero-text)] md:grid-cols-3 md:p-6">
          <div className="md:pr-4">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Stay Found savings
            </p>
            <h4 className="text-xl font-bold leading-tight">
              The $99/mo plan should remove friction, not add it.
            </h4>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-200">
              Before
            </p>
            <ul className="space-y-2">
              {SAVINGS_BEFORE.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/72">
                  <span aria-hidden="true" className="mt-0.5 text-red-200">x</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/[0.10] p-4">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              After
            </p>
            <ul className="space-y-2">
              {SAVINGS_AFTER.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/82">
                  <span aria-hidden="true" className="mt-0.5 text-[var(--color-accent)]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-white/58">
              Hosting can replace a separate website bill after the GMF-hosted site is live and checked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
