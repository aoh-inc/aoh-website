"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// ── Inline SVG icons (no icon package needed) ────────────────

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconReply() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <polyline points="11 10 8 13 11 16" />
      <path d="M8 13h8" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="0.5" fill="currentColor" />
      <circle cx="4" cy="12" r="0.5" fill="currentColor" />
      <circle cx="4" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.04 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}
function IconMessageQ() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────

type Check = {
  icon: React.ReactNode;
  label: string;
  subline: string;
  pass: boolean;
};

type Slide = {
  id: string;
  category: string;
  categoryIcon: React.ReactNode;
  passed: number;
  total: number;
  checks: Check[];
};

// ── Data — drive from real audit results later ───────────────

const SLIDES: Slide[] = [
  {
    id: "reviews",
    category: "Reviews",
    categoryIcon: <IconStar />,
    passed: 0,
    total: 3,
    checks: [
      { icon: <IconStar />, label: "Not enough reviews to get picked", subline: "Below the bar AI looks for", pass: false },
      { icon: <IconClock />, label: "No reviews recently", subline: "Google sees you as inactive", pass: false },
      { icon: <IconReply />, label: "You're not replying to reviews", subline: "Replies signal an active business", pass: false },
    ],
  },
  {
    id: "google-profile",
    category: "Google profile",
    categoryIcon: <IconMapPin />,
    passed: 1,
    total: 4,
    checks: [
      { icon: <IconMapPin />, label: "Your business appears on Google", subline: "You're on the map", pass: true },
      { icon: <IconClock />, label: "Customers can't see when you're open", subline: "Hours missing or wrong", pass: false },
      { icon: <IconList />, label: "Your services aren't spelled out", subline: "AI can't tell what you do", pass: false },
      { icon: <IconCamera />, label: "No recent photos", subline: "Photos help you get recommended", pass: false },
    ],
  },
  {
    id: "website-match",
    category: "Website match",
    categoryIcon: <IconGlobe />,
    passed: 1,
    total: 3,
    checks: [
      { icon: <IconGlobe />, label: "A website is connected to Google", subline: "Linked from your listing", pass: true },
      { icon: <IconBuilding />, label: "Your name doesn't match site to Google", subline: "AI stops trusting it's one business", pass: false },
      { icon: <IconPhone />, label: "Your phone doesn't match everywhere", subline: "Customers call the wrong number", pass: false },
    ],
  },
  {
    id: "ai-directories",
    category: "AI & directories",
    categoryIcon: <IconSearch />,
    passed: 1,
    total: 3,
    checks: [
      { icon: <IconSearch />, label: "You're listed on a major directory", subline: "One source AI cross-checks", pass: true },
      { icon: <IconMap />, label: "Missing from Facebook and Apple Maps", subline: "Fewer places = less trust", pass: false },
      { icon: <IconMessageQ />, label: "Your info doesn't answer what people ask", subline: "AI pulls answers from your details", pass: false },
    ],
  },
];

// ── Arrow button ─────────────────────────────────────────────

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous category" : "Next category"}
      className="flex h-9 w-9 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 disabled:opacity-30"
      style={{
        background: "#1b2636",
        border: "1px solid #2a3647",
        color: "#a0b0c8",
        // @ts-expect-error css variable
        "--tw-ring-color": "#e8633f",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        {direction === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

// ── Main component ───────────────────────────────────────────

export function VisibilityCheck() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const reduce = useReducedMotion();
  const pointerX = useRef<number | null>(null);
  const slide = SLIDES[current];

  function go(index: number) {
    setDir(index > current ? 1 : -1);
    setCurrent(index);
  }
  const prev = () => { if (current > 0) go(current - 1); };
  const next = () => { if (current < SLIDES.length - 1) go(current + 1); };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 20 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -20 }),
  };

  return (
    <section
      aria-labelledby="vc-title"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-page)] py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_3fr] md:items-center md:gap-14">

          {/* ── Left column ── */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              The new rules of getting found
            </p>
            <h2
              id="vc-title"
              className="mt-3 text-3xl font-bold leading-tight text-[var(--color-text-body)] md:text-4xl"
            >
              What Google &amp; AI check
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--color-text-muted)]">
              Google's AI decides who to recommend before anyone clicks. Most local businesses fail the basics — and never know it.
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
              The businesses AI picks aren't the biggest. They're the most complete.
            </p>
            <Link
              href="/report/ai-visibility"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-[var(--color-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
            >
              See if AI recommends you
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Based on{" "}
              <a
                href="https://support.google.com/business/answer/7091"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[var(--color-text-muted)]/40 underline-offset-2 transition hover:text-[var(--color-text-body)]"
              >
                Google's own guidance
              </a>{" "}
              for local business visibility
            </p>
          </div>

          {/* ── Right column: carousel card ── */}
          <div
            className="overflow-hidden p-5 md:p-6"
            style={{ background: "#16202f", border: "1px solid #2a3647", borderRadius: "22px" }}
          >
            {/* Card top row */}
            <div className="mb-4 flex items-center justify-between">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: "#3fae7e", boxShadow: "0 0 6px #3fae7e80" }}
              />
              <span className="font-mono text-[11px]" style={{ color: "#6b7f9a" }}>
                {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </span>
            </div>

            <p className="mb-1.5 text-xl font-bold leading-snug" style={{ color: "#f0f6ff" }}>
              Miss any of these and AI skips you.
            </p>

            {/* Slide area */}
            <div
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Slide ${current + 1} of ${SLIDES.length}: ${slide.category}`}
              style={{ minHeight: "300px" }}
              onPointerDown={(e) => { pointerX.current = e.clientX; }}
              onPointerUp={(e) => {
                if (pointerX.current === null) return;
                const delta = e.clientX - pointerX.current;
                if (delta < -50) next();
                else if (delta > 50) prev();
                pointerX.current = null;
              }}
              className="touch-pan-y select-none"
            >
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={current}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {/* Category bar */}
                  <div
                    className="mb-4 pb-3"
                    style={{ borderBottom: "1px solid #2a3647" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2" style={{ color: "#6b7f9a" }}>
                        {slide.categoryIcon}
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                          {slide.category}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold" style={{ color: "#e8633f" }}>
                        {slide.passed} / {slide.total} passed
                      </span>
                    </div>
                  </div>

                  {/* Check rows */}
                  <div className="flex flex-col gap-3">
                    {slide.checks.map((check, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-[10px] p-3"
                        style={{ background: "#1b2636" }}
                      >
                        {/* Icon tile */}
                        <div
                          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px]"
                          style={{
                            background: check.pass ? "rgba(63,174,126,0.12)" : "rgba(232,99,63,0.12)",
                            color: check.pass ? "#3fae7e" : "#e8633f",
                          }}
                        >
                          {check.icon}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold leading-snug" style={{ color: "#dce6f0" }}>
                            {check.label}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "#6b7f9a" }}>
                            {check.subline}
                          </p>
                        </div>

                        {/* State circle */}
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          aria-label={check.pass ? "Pass" : "Fail"}
                          style={{
                            background: check.pass ? "rgba(63,174,126,0.15)" : "rgba(232,99,63,0.15)",
                            border: `1px solid ${check.pass ? "#3fae7e" : "#e8633f"}`,
                          }}
                        >
                          {check.pass ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#3fae7e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#e8633f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation row */}
            <div className="mt-5 flex items-center justify-between">
              <ArrowButton direction="prev" onClick={prev} disabled={current === 0} />

              {/* Dot indicators */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {SLIDES.map((_, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to ${SLIDES[i].category}`}
                    className="h-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    animate={{
                      width: i === current ? "24px" : "6px",
                      backgroundColor: i === current ? "#e8633f" : "#2a3647",
                    }}
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </div>

              <ArrowButton direction="next" onClick={next} disabled={current === SLIDES.length - 1} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
