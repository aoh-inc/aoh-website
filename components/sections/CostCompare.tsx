"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Row = {
  need: string;
  diyTool: string;
  diySub?: string;
  diyCost: string;
};

const ROWS: Row[] = [
  {
    need: "Get more reviews — automatic",
    diyTool: "Birdeye",
    diySub: "Standard plan",
    diyCost: "$349/mo",
  },
  {
    need: "Rank higher in Google + Maps",
    diyTool: "Yext or BrightLocal",
    diyCost: "$37–$39/mo",
  },
  {
    need: "Get found in ChatGPT + AI search",
    diyTool: "Profound Starter",
    diySub: "ChatGPT only — Gemini & Claude cost more",
    diyCost: "$99/mo",
  },
  {
    need: "Someone to run it all",
    diyTool: "Marketing assistant or VA",
    diyCost: "$1,000+/mo",
  },
];

function AnimatedCheck({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--color-accent)] drop-shadow-[0_0_8px_rgba(45,106,79,0.4)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.polyline
        points="20 6 9 17 4 12"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration: 0.9, delay, ease: "easeOut" },
              opacity: { duration: 0.3, delay },
            },
          },
        }}
      />
    </motion.svg>
  );
}

function MultiplierBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: 2.4, duration: 0.7, ease: "easeOut" }}
      className="relative"
    >
      <span
        className="absolute inset-0 rounded-full bg-[var(--color-accent)]/30 blur-lg animate-pulse"
        aria-hidden="true"
      />
      <div className="relative inline-flex items-center gap-2.5 rounded-full bg-[var(--color-bg-dark-card)] px-6 py-3 text-sm font-bold text-[var(--color-hero-text)] ring-1 ring-[var(--color-accent)]/50 shadow-xl">
        <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse shadow-[0_0_10px_rgba(45,106,79,0.8)]" />
        <span className="font-mono tracking-wide">about 5× cheaper</span>
        <span className="text-[var(--color-accent)]">→</span>
      </div>
    </motion.div>
  );
}

function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.5]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(45,106,79,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,106,79,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}

function ScanLine() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/60 to-transparent"
      initial={{ y: 0, opacity: 0 }}
      whileInView={{ y: ["0%", "1200%"], opacity: [0, 0.7, 0] }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 2.4, delay: 0.3, ease: "easeInOut" }}
    />
  );
}

export function CostCompare() {
  return (
    <section className="relative py-14 md:py-20 bg-[var(--color-bg-page)] overflow-hidden">
      <GridBackground />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] align-middle mr-2 animate-pulse" />
            The math
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-body)] mb-4 leading-tight">
            Build it yourself:{" "}
            <span className="text-[var(--color-text-body)]">
              $<AnimatedNumber value={1487} duration={2600} />+/mo
            </span>
            .
            <br className="hidden md:block" />
            <span className="hidden md:inline"> </span>
            Run it with us:{" "}
            <span className="text-[var(--color-accent)]">
              $<AnimatedNumber value={299} duration={2600} />/mo
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Same operating lane. Less than one enterprise review platform. Here&apos;s what each piece costs to do yourself.
          </p>
        </div>

        {/* Mobile stacked layout (below md) */}
        <div className="space-y-3 md:hidden">
          {ROWS.map((row, i) => (
            <motion.div
              key={row.need}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.6, ease: "easeOut" }}
              className="rounded-2xl bg-[var(--color-bg-dark-card)] p-5 ring-1 ring-white/[0.08] shadow-xl"
            >
              <p className="text-base font-semibold text-[var(--color-hero-text)] mb-3">
                {row.need}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-hero-subtext)]/70 mb-1.5">
                    Other tools
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-hero-text)]">
                    {row.diyTool}
                  </p>
                  {row.diySub && (
                    <p className="mt-0.5 text-[11px] text-[var(--color-hero-subtext)]/60 leading-snug">
                      {row.diySub}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-sm font-bold text-[var(--color-hero-text)]">
                    {row.diyCost}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--color-accent)]/10 p-3 ring-1 ring-[var(--color-accent)]/30 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-hero-text)] mb-2">
                    GetMeFound
                  </p>
                  <AnimatedCheck delay={0.6 + i * 0.25} />
                  <p className="mt-2 text-xs font-semibold text-[var(--color-accent)]">
                    Included
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className="rounded-2xl bg-[var(--color-bg-dark-card)] p-5 ring-2 ring-[var(--color-accent)]/40 shadow-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-hero-subtext)]/70 mb-3">
              Monthly total
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/60 mb-1">
                  DIY
                </p>
                <p className="font-mono text-2xl font-bold text-[var(--color-hero-text)] leading-none">
                  $<AnimatedNumber value={1487} duration={2800} />
                  <span className="text-sm">+/mo</span>
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, delay: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--color-hero-subtext)]"
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-hero-text)] mb-1">
                  GetMeFound
                </p>
                <p className="font-mono text-2xl font-bold text-[var(--color-accent)] leading-none">
                  $<AnimatedNumber value={299} duration={2800} />
                  <span className="text-sm">/mo</span>
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-accent)]/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "20%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, delay: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(45,106,79,0.6)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop table layout (md+) — DARK TERMINAL */}
        <div className="hidden md:block relative overflow-hidden rounded-2xl bg-[var(--color-bg-dark-card)] shadow-2xl shadow-[var(--color-bg-dark-card)]/30 ring-1 ring-white/[0.08]">
          <ScanLine />

          {/* Terminal-style header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-hero-subtext)]/60">
              cost-comparison.live
            </p>
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
                Live
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[1.6fr_1.6fr_0.8fr] border-b border-white/[0.08]">
            <div className="px-6 py-4">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-hero-subtext)]/80">
                What you need
              </p>
            </div>
            <div className="px-6 py-4 border-l border-white/[0.08]">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-hero-subtext)]/80">
                Other tools
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[var(--color-hero-subtext)]/50">
                DIY — you run them
              </p>
            </div>
            <div className="px-6 py-4 border-l border-white/[0.08] text-center bg-[var(--color-accent)]/[0.08]">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-hero-text)]">
                GetMeFound
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[var(--color-hero-subtext)]/60">
                Done for you
              </p>
            </div>
          </div>

          {ROWS.map((row, i) => (
            <motion.div
              key={row.need}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.4 + i * 0.18, duration: 0.6, ease: "easeOut" }}
              className={`grid grid-cols-[1.6fr_1.6fr_0.8fr] border-b border-white/[0.06] last:border-b-0 ${
                i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
              } group hover:bg-white/[0.03] transition-colors`}
            >
              <div className="px-6 py-5">
                <p className="text-base font-semibold text-[var(--color-hero-text)]">
                  {row.need}
                </p>
              </div>
              <div className="px-6 py-5 border-l border-white/[0.06]">
                <p className="text-sm font-semibold text-[var(--color-hero-text)]">
                  {row.diyTool}
                </p>
                {row.diySub && (
                  <p className="mt-0.5 text-xs text-[var(--color-hero-subtext)]/60">
                    {row.diySub}
                  </p>
                )}
                <p className="mt-1.5 font-mono text-sm font-bold text-[var(--color-hero-text)]">
                  {row.diyCost}
                </p>
              </div>
              <div className="px-6 py-5 flex items-center justify-center border-l border-white/[0.06] bg-[var(--color-accent)]/[0.06]">
                <AnimatedCheck delay={0.9 + i * 0.25} />
              </div>
            </motion.div>
          ))}

          <div className="grid grid-cols-[1.6fr_1.6fr_0.8fr] border-t-2 border-[var(--color-accent)]/30 bg-white/[0.03]">
            <div className="px-6 py-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-hero-subtext)]/70">
                Monthly total
              </p>
            </div>
            <div className="px-6 py-6 border-l border-white/[0.08]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[var(--color-hero-text)] leading-none">
                $<AnimatedNumber value={1487} duration={2800} />
                <span className="text-lg text-[var(--color-hero-subtext)]/70">+/mo</span>
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, delay: 1.0, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--color-hero-subtext)]/70"
                />
              </div>
              <p className="mt-2 text-[11px] text-[var(--color-hero-subtext)]/60">
                Plus your hours every week.
              </p>
            </div>
            <div className="px-6 py-6 text-center border-l border-white/[0.08] bg-[var(--color-accent)]/[0.10]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[var(--color-accent)] leading-none drop-shadow-[0_0_12px_rgba(45,106,79,0.3)]">
                $<AnimatedNumber value={299} duration={2800} />
                <span className="text-lg text-[var(--color-accent)]/70">/mo</span>
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--color-accent)]/15 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "20%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, delay: 1.0, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(45,106,79,0.7)]"
                />
              </div>
              <p className="mt-2 text-[11px] text-[var(--color-hero-subtext)]/60">
                Bundle. No contract.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <MultiplierBadge />
        </div>

        <div className="mt-8 max-w-3xl mx-auto rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-6 md:p-7">
          <p className="text-base text-[var(--color-text-body)] leading-relaxed">
            <strong className="font-bold">The tools are the cheap part.</strong>{" "}
            <span className="text-[var(--color-text-muted)]">
              Even the $37/mo ones need someone who knows how to use them — listings strategy, schema markup, AI search rules, response timing. GetMeFound brings the tools AND the people who run them.
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <Link
            href="/#calculator"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
          >
            Get my free audit
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <p className="text-xs text-[var(--color-text-muted)]">
            No credit card. No contract. Same-day reply.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
          Prices reflect publicly listed examples and can change: Birdeye Standard, Yext or BrightLocal, Profound Starter, and typical small-business marketing-assistant labor. Live voice behavior inside AI Ready stays approval-gated.
        </p>
      </div>
    </section>
  );
}
