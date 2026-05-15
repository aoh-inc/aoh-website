"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Stat = {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  source: string;
  sourceUrl: string;
  duration?: number;
};

const stats: Stat[] = [
  {
    value: 80,
    suffix: "%",
    label: "of consumers use Google to find local businesses.",
    source: "BrightLocal 2025",
    sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey-2025/",
    duration: 2200,
  },
  {
    value: 83,
    suffix: "%",
    label: "read Google reviews before choosing who to call.",
    source: "BrightLocal 2025",
    sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey-2025/",
    duration: 2400,
  },
  {
    value: 25,
    suffix: "%",
    label: "of searches have moved to AI tools — ChatGPT, Google AI, Claude.",
    source: "Pew Research, 2025",
    sourceUrl: "https://www.pewresearch.org/",
    duration: 2000,
  },
];

export function SocialProof() {
  return (
    <section
      aria-label="Key stats"
      className="relative overflow-hidden bg-[var(--color-bg-dark-card)] py-14 md:py-20 text-[var(--color-hero-text)]"
    >
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 md:mb-10 text-center"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            How customers find you
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-hero-text)] leading-tight">
            The journey starts on Google. The decision is made by reviews.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <div className="flex items-baseline gap-1 justify-center md:justify-start">
                <span className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-hero-text)] leading-none">
                  {s.prefix}
                  <AnimatedNumber value={s.value} duration={s.duration ?? 2200} />
                </span>
                <span className="text-3xl md:text-4xl font-bold text-[var(--color-accent)]">
                  {s.suffix}
                </span>
              </div>
              <p className="mt-4 text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed">
                {s.label}
              </p>
              <a
                href={s.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-hero-subtext)]/60 hover:text-[var(--color-accent)] transition-colors"
              >
                <span aria-hidden="true">↗</span>
                Source: {s.source}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
