"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const STEPS = [
  {
    number: "01",
    title: "We check what AI sees",
    body: "Your Google profile, website, and directories — reviewed against what AI actually looks for.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    accentColor: "text-amber-900",
    iconBg: "bg-white/30",
    iconRing: "ring-white/40",
    borderColor: "#d97706",
    cardBg: "bg-amber-300",
    numberColor: "text-amber-400/30",
    textColor: "text-amber-950",
    mutedColor: "text-amber-900/70",
  },
  {
    number: "02",
    title: "We fix what's invisible",
    body: "Listings corrected, website matched, directories synced, first review requests sent.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    accentColor: "text-green-900",
    iconBg: "bg-white/30",
    iconRing: "ring-white/40",
    borderColor: "#15803d",
    cardBg: "bg-green-400",
    numberColor: "text-green-500/30",
    textColor: "text-green-950",
    mutedColor: "text-green-900/70",
  },
  {
    number: "03",
    title: "You see the difference",
    body: null,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    accentColor: "text-teal-900",
    iconBg: "bg-white/30",
    iconRing: "ring-white/40",
    borderColor: "#0d9488",
    cardBg: "bg-teal-300",
    numberColor: "text-teal-400/30",
    textColor: "text-teal-950",
    mutedColor: "text-teal-900/70",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={`group relative flex flex-col rounded-2xl ${step.cardBg} overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 h-full`}
    >
      {/* Top accent border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: "easeOut" }}
        className="h-[3px] origin-left"
        style={{ backgroundColor: step.borderColor }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Number + Icon row */}
        <div className="flex items-center justify-between mb-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: index * 0.15 + 0.3,
              type: "spring",
              stiffness: 200,
              damping: 12,
            }}
            className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${step.iconBg} ${step.iconRing} ${step.accentColor}`}
          >
            {step.icon}
          </motion.div>
          <span className={`font-mono text-4xl font-black ${step.numberColor} select-none`}>
            {step.number}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-base font-bold ${step.textColor} mb-1.5`}>
          {step.title}
        </h3>

        {/* Body or visual */}
        {step.body ? (
          <p className={`text-sm leading-relaxed ${step.mutedColor}`}>
            {step.body}
          </p>
        ) : (
          <div className="flex-1 flex flex-col">
            <p className={`text-sm ${step.mutedColor} mb-2`}>
              Before/after report in 48 hours:
            </p>
            <div className="flex items-center gap-3 rounded-lg bg-white/40 px-3 py-2">
              <div className="text-center">
                <span className="block text-[10px] text-teal-900/60 mb-0.5">Before</span>
                <span className="block text-xl font-black text-red-600/80">
                  <AnimatedNumber value={12} suffix="%" duration={800} />
                </span>
              </div>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-teal-900/40 shrink-0">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <div className="text-center">
                <span className="block text-[10px] text-teal-900/60 mb-0.5">After</span>
                <span className="block text-xl font-black text-teal-900">
                  <AnimatedNumber value={89} suffix="%" duration={1200} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-title"
      className="scroll-mt-20 border-y border-border bg-(--color-bg-page) py-8 md:py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-2xl text-center mb-8"
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted mb-2">
            Get Found / $149
          </p>
          <h2
            id="hiw-title"
            className="text-2xl font-bold leading-tight text-text-body md:text-3xl"
          >
            Done for you. Done in 48 hours.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted max-w-lg mx-auto md:text-base">
            We check what Google and AI see. We fix what&apos;s holding you back. You get the proof.
          </p>
        </motion.div>

        {/* Horizontal step cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Bottom bar: CTA + pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/checkout/get-found-refresh"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3 text-base font-semibold text-(--color-accent-text) transition hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-lg hover:shadow-(--color-accent)/25"
          >
            Get Found for $149
            <span aria-hidden="true">-&gt;</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-2">
            {["No contract", "No tech skills needed", "48 hours"].map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-(--color-bg-elevated) px-3 py-1 text-xs font-medium text-text-muted"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {pill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
