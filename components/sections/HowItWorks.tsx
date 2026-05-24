"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

function ScoreGauge() {
  const targetScore = 47;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (targetScore / 100) * circumference;

  return (
    <div className="relative flex h-44 w-full items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, ease: "easeOut", delay: 0.3 }}
          style={{
            filter: "drop-shadow(0 0 8px rgba(45,106,79,0.5))",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-hero-subtext)]/60 mb-1">
          Score
        </p>
        <p className="font-mono text-5xl font-bold text-[var(--color-hero-text)] leading-none">
          <AnimatedNumber value={targetScore} duration={2400} />
          <span className="text-xl text-[var(--color-hero-subtext)]/70">/100</span>
        </p>
      </div>
    </div>
  );
}

function SetupTimeline() {
  const tasks = [
    { label: "Google profile connected", delay: 0.3 },
    { label: "Set up to rank higher on Google", delay: 0.7 },
    { label: "Now can be found on ChatGPT and others", delay: 1.1 },
    { label: "Reviews start going out", delay: 1.5 },
  ];

  return (
    <div className="flex h-44 w-full flex-col justify-center gap-2">
      {tasks.map((task) => (
        <motion.div
          key={task.label}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: task.delay, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 ring-1 ring-[var(--color-accent)]/40">
            <motion.svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: task.delay + 0.2, duration: 0.4 }}
            >
              <motion.polyline points="20 6 9 17 4 12" />
            </motion.svg>
          </span>
          <p className="text-xs text-[var(--color-hero-text)] leading-tight">{task.label}</p>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 2.0, duration: 0.5, ease: "easeOut" }}
        className="mt-1 flex items-center justify-between rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] px-3 py-1.5"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
            Going live
          </p>
        </div>
        <p className="font-mono text-xs font-bold text-[var(--color-hero-text)]">
          T-48:00:00
        </p>
      </motion.div>
    </div>
  );
}

function ReviewFeed() {
  const reviews = [
    { name: "Sarah K.", text: "Great service! Quick response.", delay: 0.4 },
    { name: "Mike T.", text: "Best in town. Will use again.", delay: 0.9 },
    { name: "Jen W.", text: "Fast and professional.", delay: 1.4 },
  ];

  return (
    <div className="flex h-44 w-full flex-col justify-center gap-2">
      {reviews.map((r) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: r.delay, duration: 0.5, ease: "easeOut" }}
          className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2"
        >
          <span className="font-mono text-[10px] text-amber-400/90">★★★★★</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--color-hero-text)] truncate">
              {r.text}
            </p>
            <p className="text-[10px] text-[var(--color-hero-subtext)]/60">
              — {r.name}
            </p>
          </div>
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: r.delay + 0.4, duration: 0.3 }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20"
            title="Reply sent in your voice"
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

type Step = {
  number: string;
  title: string;
  body: string;
  meta: string;
  Visual: () => React.ReactElement;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "We audit your presence",
    body: "We review your Google profile, reviews, star rating, AI search visibility, and listing gaps. You see exactly where you stand — and what's costing you customers.",
    meta: "Personal review · Same-day",
    Visual: ScoreGauge,
  },
  {
    number: "02",
    title: "We set you up",
    body: "We connect your accounts, set you up to rank higher on Google, plug you into ChatGPT and AI search, and turn on review requests. You give us access — we do the rest.",
    meta: "Live in 48 hrs",
    Visual: SetupTimeline,
  },
  {
    number: "03",
    title: "We run it",
    body: "Reviews, rankings, AI visibility — handled by us every month. You approve replies in your inbox. You stay focused on your business.",
    meta: "No contract · Cancel anytime",
    Visual: ReviewFeed,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-14 md:py-20 bg-[var(--color-bg-page)] overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 md:mb-10 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-body)] mb-4 leading-tight">
            From signup to live in 48 hours.
          </h2>
          <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            No long onboarding. No learning curve. We run the rest — you stay in your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((step, i) => {
            const VisualComp = step.Visual;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.15 + i * 0.18, duration: 0.6, ease: "easeOut" }}
                className="relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-bg-dark-card)] ring-1 ring-white/[0.08] shadow-xl"
              >
                {/* Visual area — top portion, dark */}
                <div className="relative border-b border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent px-5 pt-6 pb-4">
                  <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                      {step.number}
                    </span>
                    <span className="h-px w-6 bg-[var(--color-accent)]/40" />
                  </div>

                  <div className="absolute right-5 top-5 z-10">
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-[var(--color-hero-subtext)]/70 ring-1 ring-white/[0.06]">
                      {step.meta}
                    </span>
                  </div>

                  <div className="mt-8">
                    <VisualComp />
                  </div>
                </div>

                {/* Text area — bottom portion */}
                <div className="flex-1 px-5 py-5 md:px-6 md:py-6">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-hero-text)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-hero-subtext)] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA below steps */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
          >
            Talk to us
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <p className="text-xs text-[var(--color-text-muted)]">
            We review your profile and follow up same day.
          </p>
        </div>
      </div>
    </section>
  );
}
