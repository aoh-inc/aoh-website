"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_DURATIONS = [3500, 3500, 5000, 5500];
const TRANSITION_DURATION = 0.5;

const stepLabels = ["Review request", "Review automation", "AI response", "Google rankings"] as const;

const ACCENT = "#2D6A4F";

function Checkmark({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

function StarIcon({ filled, className = "h-5 w-5" }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? ACCENT : "none"}
      stroke={filled ? ACCENT : "rgba(255,255,255,0.25)"}
      strokeWidth="1.5"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z" />
    </svg>
  );
}

function TrendArrow({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12l5-6 3 3 4-5" />
      <path d="M11 4h4v4" />
    </svg>
  );
}

function PhoneFrame({ children, header }: { children: React.ReactNode; header: string }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[280px] flex-col rounded-[28px] border border-white/10 bg-[#070F1C] p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="mx-auto mb-1 h-1 w-12 rounded-full bg-white/10" />
      <div className="flex flex-1 flex-col rounded-[22px] bg-[#0F1B2E] overflow-hidden">
        <div className="border-b border-white/[0.06] px-4 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-hero-subtext)]">
            {header}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </div>
    </div>
  );
}

function Step1SMS() {
  return (
    <PhoneFrame header="iMessage · Sarah">
      <div className="mt-auto space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-accent)] px-3.5 py-2.5"
        >
          <p className="font-mono text-[12px] leading-relaxed text-white">
            Hi Sarah, thanks for visiting! Mind leaving us a quick review?
          </p>
          <p className="mt-1 font-mono text-[11px] text-white/70">
            review.aoh.link/mp
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="ml-auto flex items-center gap-1 pr-1 text-[10px] text-[var(--color-accent)]"
        >
          <Checkmark className="h-3 w-3" />
          <span className="font-mono uppercase tracking-wider">Delivered</span>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}

function Step2Stars() {
  return (
    <PhoneFrame header="review.aoh.link · Mike's Plumbing">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-[var(--color-hero-text)]"
        >
          How was your visit?
        </motion.p>

        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.25 + i * 0.18,
                type: "spring",
                stiffness: 320,
                damping: 14,
              }}
            >
              <span style={{ color: '#2D6A4F', fontSize: '1.8rem', lineHeight: 1 }}>★</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.35 }}
          className="rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-3 py-1"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
            Thanks for your review!
          </p>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}

const AI_REPLY =
  "Thank you so much Sarah! We're thrilled you had a great experience. We look forward to seeing you again!";

function Step3AIResponse() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(AI_REPLY.slice(0, i));
      if (i >= AI_REPLY.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
      >
        <div className="mb-2 flex items-center gap-0.5">
          <span style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
          <span style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
          <span style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
          <span style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
          <span style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
          <span className="ml-2 text-[11px] text-[var(--color-hero-subtext)]">Sarah K.</span>
        </div>
        <p className="text-[12px] leading-relaxed text-[var(--color-hero-text)]">
          Great service, very professional. Will use them again!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="flex-1 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 p-3.5"
      >
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            AI response · posted in 3 minutes
          </p>
        </div>
        <p className="font-mono text-[12px] leading-relaxed text-[var(--color-hero-text)]">
          {typed}
          <span className="inline-block h-3 w-[2px] -mb-0.5 ml-0.5 bg-[var(--color-hero-text)] animate-pulse align-middle" />
        </p>
      </motion.div>
    </div>
  );
}

function useCountUp(from: number, to: number, durationMs: number, decimals = 0) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, durationMs]);
  return decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
}

function Step4MapsResult() {
  const reviews = useCountUp(23, 47, 2400);
  const rating = useCountUp(3.0, 5.0, 2400, 1);
  const filledStars = Math.round(rating);

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-hero-subtext)]">
            Google Maps
          </p>
        </div>
        <h3 className="text-base font-semibold text-[var(--color-hero-text)]">
          Mike&rsquo;s Plumbing
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold" style={{ color: "#2D6A4F" }}>
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ color: '#2D6A4F', fontSize: '1.2rem' }}>★</span>
            ))}
          </div>
          <span className="text-xs text-[var(--color-hero-subtext)]">
            ({reviews} reviews)
          </span>
        </div>

        <p className="mt-2 text-[11px] text-[var(--color-hero-subtext)]">
          Plumber · Open · Austin, TX
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          30-day trend
        </p>
        <div className="flex items-center gap-1.5 text-[var(--color-accent)]">
          <TrendArrow />
          <span className="font-mono text-sm font-semibold">+24 reviews</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="mt-auto pt-3 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-hero-subtext)]">
          Ranking · #1 in local pack
        </p>
      </motion.div>
    </div>
  );
}

const stepComponents = [Step1SMS, Step2Stars, Step3AIResponse, Step4MapsResult];

export function HeroVisualReviews() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => {
      setStep((s) => (s + 1) % STEP_DURATIONS.length);
    }, STEP_DURATIONS[step]);
    return () => clearTimeout(id);
  }, [step, reduce]);

  const StepComponent = stepComponents[step];

  return (
    <div
      className="relative w-full h-[280px] md:h-full md:min-h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A1628]"
      aria-label="AOH product loop"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative flex h-full flex-col px-5 pt-3 pb-5 md:px-6 md:pt-4 md:pb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-hero-text)]">
              {stepLabels[step]}
            </p>
          </div>
          <div className="flex gap-1.5">
            {STEP_DURATIONS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-[var(--color-accent)]" : "w-1.5 bg-white/15"
                }`}
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
