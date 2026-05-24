"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section
      aria-label="Final call to action"
      className="relative overflow-hidden bg-[var(--color-bg-dark-card)] py-14 md:py-20"
    >
      {/* Soft accent glow corners */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-accent)]/12 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[var(--color-accent)]/8 blur-3xl"
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </span>
            Free report
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-hero-text)] leading-tight mb-5">
            Customers are choosing right now.
            <br className="hidden md:block" />
            <span className="hidden md:inline"> </span>
            <span className="text-[var(--color-accent)]">Make sure they find you.</span>
          </h2>
          <p className="text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed mb-6 max-w-xl mx-auto">
            We handle your Google presence, reviews, and AI search visibility every month — so you show up where it counts. No dashboards. No contract.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--color-accent)]/30"
            >
              See our plans
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-6 py-4 text-base font-semibold text-[var(--color-hero-text)] ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.10] hover:ring-white/20"
            >
              Talk to us
            </Link>
          </div>

          <p className="mt-8 text-xs text-[var(--color-hero-subtext)]/70">
            No contracts. Cancel anytime. Plans from $59/mo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
