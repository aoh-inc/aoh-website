"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section
      aria-label="Final call to action"
      className="bg-(--color-bg-page) py-20 text-text-body md:py-28"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">
            One decision
          </p>

          <h2 className="text-[clamp(2.2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-tight text-text-body">
            Your competitor is being recommended.
            <br />
            <span className="text-accent">Fix that today.</span>
          </h2>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/checkout/get-found-refresh"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-8 py-4 text-base font-semibold text-(--color-accent-text) transition-all hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-2xl hover:shadow-(--color-accent)/30"
            >
              Get Found for $149
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                -&gt;
              </span>
            </Link>
            <Link
              href="/report/ai-visibility"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-bg-elevated) px-6 py-4 text-base font-semibold text-text-body ring-1 ring-border transition-all hover:-translate-y-0.5 hover:ring-accent/40"
            >
              See if AI recommends you -&gt;
            </Link>
          </div>

          <p className="mt-6 text-sm text-text-muted">
            No contract / no tech skills needed / results in 48 hours
          </p>

          <p className="mt-4 text-xs text-text-muted">
            Based on Google&apos;s published guidance for local business visibility. Source:{" "}
            <a
              href="https://support.google.com/business/answer/7091"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-text-body"
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
