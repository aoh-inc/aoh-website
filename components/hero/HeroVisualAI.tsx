"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_DURATION = 3000;
const TRANSITION_DURATION = 0.6;
const TOTAL_STEPS = 3;

const platforms = ["ChatGPT", "Google AI", "Claude"] as const;
const BUSINESS = "Austin's Best Plumbing";

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded px-1 font-semibold"
      style={{ color: "#2D6A4F", backgroundColor: "rgba(45,106,79,0.18)" }}
    >
      {children}
    </span>
  );
}

function PlatformHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2D6A4F" }} />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-hero-text)]">
        {label}
      </p>
    </div>
  );
}

function TypingLine({ text, speed = 40 }: { text: string; speed?: number }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <p className="font-mono text-sm text-[var(--color-hero-text)]">
      {typed}
      <span className="inline-block h-3.5 w-[2px] -mb-0.5 ml-0.5 animate-pulse bg-[var(--color-hero-text)] align-middle" />
    </p>
  );
}

function ChatGPTStep() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3.5">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/70">
          You
        </p>
        <TypingLine text="best plumber near Austin" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/70">
          ChatGPT
        </p>
        <p className="font-mono text-sm leading-relaxed text-[var(--color-hero-text)]">
          I recommend <Highlight>{BUSINESS}</Highlight> — they have 47 five-star
          reviews and offer same-day service.
        </p>
      </motion.div>
    </div>
  );
}

function GoogleAIStep() {
  return (
    <div className="flex h-full flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4"
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#2D6A4F" }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-hero-subtext)]/80">
            AI Overview
          </p>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-mono text-sm leading-relaxed text-[var(--color-hero-text)]"
        >
          Top-rated local plumbers in Austin include <Highlight>{BUSINESS}</Highlight>,
          known for fast response times and over 200 verified reviews.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2"
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/60">
          Sources
        </p>
        <p className="text-[11px] text-[var(--color-hero-subtext)]">
          {BUSINESS} · Google Reviews · Yelp
        </p>
      </motion.div>
    </div>
  );
}

function ClaudeStep() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3.5">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/70">
          You
        </p>
        <TypingLine text="who should I call for a plumber in Austin?" speed={32} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-hero-subtext)]/70">
          Claude
        </p>
        <p className="font-mono text-sm leading-relaxed text-[var(--color-hero-text)]">
          <Highlight>{BUSINESS}</Highlight> comes highly recommended by locals,
          with consistent 5-star reviews and same-day availability.
        </p>
      </motion.div>
    </div>
  );
}

const stepComponents = [ChatGPTStep, GoogleAIStep, ClaudeStep];

export function HeroVisualAI() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % TOTAL_STEPS);
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, [reduce]);

  const StepComponent = stepComponents[step];

  return (
    <div
      className="relative w-full h-[280px] md:h-full md:min-h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A1628]"
      aria-label="AI search visibility loop"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(45,106,79,0.15)" }}
      />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative flex h-full flex-col px-5 pt-3 pb-5 md:px-6 md:pt-4 md:pb-6">
        <div className="mb-2 flex items-center justify-between">
          <PlatformHeader label={platforms[step]} />
          <div className="flex gap-1.5">
            {platforms.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? "w-6" : "w-1.5 bg-white/15"
                }`}
                style={i === step ? { backgroundColor: "#2D6A4F" } : undefined}
              />
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TRANSITION_DURATION, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
