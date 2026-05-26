"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BUSINESS = "Austin's Best Plumbing";
const CHAR_DELAY_MS = 22;

type Brand = { name: string; color: string };

const BRANDS: Record<string, Brand> = {
  google:  { name: "Google",      color: "#4285F4" },
  chatgpt: { name: "ChatGPT",     color: "#10A37F" },
  maps:    { name: "Google Maps", color: "#E8491D" },
  claude:  { name: "Claude",      color: "#DA7756" },
};

type Slide = {
  brand: Brand;
  query: string;
  before: string;
  after: string;
  meta: string;
};

const SLIDES: Slide[] = [
  {
    brand: BRANDS.google,
    query: "best plumber Austin",
    before: "",
    after: " · Recommended · 4.9 ★ · 200+ reviews",
    meta: "Google Search",
  },
  {
    brand: BRANDS.chatgpt,
    query: "best plumber near Austin",
    before: "I recommend ",
    after: " — top-rated, same-day.",
    meta: "ChatGPT",
  },
  {
    brand: BRANDS.maps,
    query: "plumber open now near me",
    before: "",
    after: " · 4.9 ★ · Open now · 0.8 mi",
    meta: "Google Maps",
  },
  {
    brand: BRANDS.claude,
    query: "who should I call for a plumber?",
    before: "",
    after: " — my top pick. 5-star, same-day.",
    meta: "Claude",
  },
];

type Phase = "entering" | "thinking" | "typing" | "done" | "exiting";

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="Generating response">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-hero-subtext)]/50"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.22 }}
        />
      ))}
    </span>
  );
}

function SlideCard({
  slide,
  phase,
  charIndex,
}: {
  slide: Slide;
  phase: Phase;
  charIndex: number;
}) {
  const businessStart = slide.before.length;
  const businessEnd = businessStart + BUSINESS.length;

  const visibleBefore = slide.before.slice(0, Math.min(charIndex, businessStart));
  const visibleBusiness =
    charIndex > businessStart
      ? BUSINESS.slice(0, Math.min(charIndex - businessStart, BUSINESS.length))
      : "";
  const visibleAfter =
    charIndex > businessEnd ? slide.after.slice(0, charIndex - businessEnd) : "";

  const businessComplete = charIndex >= businessEnd;
  const showText = phase === "typing" || phase === "done" || phase === "exiting";
  const cursorVisible = phase === "typing" || phase === "done";
  const cursorBlink = phase === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="rounded-xl border border-white/[0.10] bg-white/[0.04] p-5"
      style={{
        boxShadow: `0 0 0 1px ${slide.brand.color}22, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Platform header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: slide.brand.color,
              boxShadow: `0 0 8px ${slide.brand.color}90`,
            }}
          />
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: slide.brand.color }}
          >
            {slide.brand.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--color-hero-subtext)]/50">
          {slide.meta}
        </span>
      </div>

      {/* Query */}
      <p className="mb-4 text-[12px] text-[var(--color-hero-subtext)]/70">
        <span className="mr-1 opacity-40">›</span>
        {slide.query}
      </p>

      {/* Response */}
      <div className="min-h-[52px]">
        {phase === "thinking" && <ThinkingDots />}
        {showText && (
          <p className="font-mono text-[13px] leading-relaxed text-[var(--color-hero-text)]">
            {visibleBefore}
            {visibleBusiness && (
              <motion.span
                className="rounded px-1 font-semibold"
                animate={
                  businessComplete
                    ? { color: "#2D6A4F", backgroundColor: "rgba(45,106,79,0.22)" }
                    : { color: "inherit", backgroundColor: "transparent" }
                }
                transition={{ duration: 0.35 }}
              >
                {visibleBusiness}
              </motion.span>
            )}
            {visibleAfter}
            {cursorVisible && (
              <motion.span
                className="ml-0.5 inline-block h-[13px] w-[2px] translate-y-[1px] rounded-full bg-[var(--color-hero-text)]/60 align-middle"
                animate={cursorBlink ? { opacity: [1, 0, 1] } : { opacity: 1 }}
                transition={cursorBlink ? { duration: 0.85, repeat: Infinity } : {}}
              />
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function HeroVisualAI() {
  const reduce = useReducedMotion();
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("entering");
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = SLIDES[slideIndex];
  const fullText = slide.before + BUSINESS + slide.after;

  useEffect(() => {
    if (reduce) return;

    function later(fn: () => void, ms: number) {
      timerRef.current = setTimeout(fn, ms);
    }

    if (phase === "entering") {
      later(() => setPhase("thinking"), 380);
    } else if (phase === "thinking") {
      later(() => {
        setCharIndex(0);
        setPhase("typing");
      }, 920);
    } else if (phase === "typing") {
      if (charIndex < fullText.length) {
        later(() => setCharIndex((c) => c + 1), CHAR_DELAY_MS);
      } else {
        later(() => setPhase("done"), 150);
      }
    } else if (phase === "done") {
      later(() => setPhase("exiting"), 2800);
    } else if (phase === "exiting") {
      later(() => {
        setSlideIndex((i) => (i + 1) % SLIDES.length);
        setCharIndex(0);
        setPhase("entering");
      }, 400);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, charIndex, fullText.length, reduce]);

  if (reduce) {
    const s = SLIDES[0];
    const full = s.before + BUSINESS + s.after;
    return (
      <div className="relative flex w-full items-center rounded-2xl border border-white/[0.08] bg-[#0A1628] p-5 h-[280px] md:min-h-[380px]">
        <SlideCard slide={s} phase="done" charIndex={full.length} />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A1628] h-[300px] md:h-full md:min-h-[380px] md:max-h-[440px]"
      aria-label="Search visibility demo"
      aria-live="polite"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-colors duration-700"
        style={{ backgroundColor: "rgba(45,106,79,0.14)" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full blur-3xl"
        animate={{ backgroundColor: slide.brand.color + "18" }}
        transition={{ duration: 0.8 }}
      />

      <div className="flex h-full flex-col justify-center px-6 py-7 md:px-7 md:py-8">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-hero-text)]/80">
              Showing up when they search
            </p>
          </div>

          {/* Slide indicator dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <motion.span
                key={s.brand.name}
                className="rounded-full"
                animate={{
                  width: i === slideIndex ? 16 : 6,
                  height: 6,
                  backgroundColor:
                    i === slideIndex ? s.brand.color : "rgba(255,255,255,0.18)",
                }}
                transition={{ duration: 0.35 }}
              />
            ))}
          </div>
        </div>

        {/* Cycling card */}
        <AnimatePresence mode="wait">
          <SlideCard
            key={slideIndex}
            slide={slide}
            phase={phase}
            charIndex={charIndex}
          />
        </AnimatePresence>

        {/* Platform name row */}
        <div className="mt-4 flex items-center justify-center gap-5">
          {SLIDES.map((s, i) => (
            <motion.span
              key={s.brand.name}
              className="font-mono text-[10px] uppercase tracking-[0.15em]"
              animate={{
                color: i === slideIndex ? s.brand.color : "rgba(255,255,255,0.22)",
              }}
              transition={{ duration: 0.4 }}
            >
              {s.brand.name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
