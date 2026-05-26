"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section
      aria-label="Final call to action"
      className="relative overflow-hidden bg-(--color-hero-bg) py-20 md:py-28"
    >
      {/* Accent glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-(--color-accent)/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-(--color-accent)/7 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-hero-subtext/50">
            One decision
          </p>

          <h2 className="text-[clamp(2.2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-tight text-hero-text">
            Your competitor is being recommended.
            <br />
            <span className="text-accent">Fix that today.</span>
          </h2>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout/get-found-refresh"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-8 py-4 text-base font-semibold text-(--color-accent-text) transition-all hover:bg-(--color-accent-hover) hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-(--color-accent)/30"
            >
              Get Found for $149
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/report/ai-visibility"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-6 py-4 text-base font-semibold text-hero-text ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.10] hover:ring-white/20"
            >
              See if AI recommends you →
            </Link>
          </div>

          <p className="mt-6 text-sm text-hero-subtext/60">
            No contract · No tech skills needed · Results in 48 hours
          </p>

          <p className="mt-4 text-xs text-hero-subtext/35">
            Based on Google&apos;s published guidance for local business visibility. Source:{" "}
            <a
              href="https://support.google.com/business/answer/7091"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-hero-subtext/60 transition-colors"
            >
              Google&apos;s local business visibility guidance
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
