"use client";

import { useEffect, useState } from "react";

export type TypewriterSegment = {
  text: string;
  className?: string;
  /** Per-segment override for typing speed (ms per character). Falls back to top-level `speed`. */
  speed?: number;
};

export function Typewriter({
  segments,
  speed = 70,
  startDelay = 250,
  cursor = true,
}: {
  segments: TypewriterSegment[];
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
}) {
  // Build a per-character delay map so each segment can have its own speed.
  const charDelays: number[] = [];
  for (const seg of segments) {
    const segSpeed = seg.speed ?? speed;
    for (let k = 0; k < seg.text.length; k++) charDelays.push(segSpeed);
  }
  const total = charDelays.length;
  const [position, setPosition] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setPosition(i);
      if (i >= total) {
        setDone(true);
        return;
      }
      timer = setTimeout(step, charDelays[i] ?? speed);
    };
    timer = setTimeout(step, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, speed, startDelay]);

  let consumed = 0;
  return (
    <span aria-label={segments.map((s) => s.text).join("")}>
      {segments.map((seg, i) => {
        const remaining = position - consumed;
        const shown = Math.min(seg.text.length, Math.max(0, remaining));
        consumed += seg.text.length;
        return (
          <span key={i} className={seg.className} aria-hidden>
            {seg.text.slice(0, shown)}
          </span>
        );
      })}
      {cursor && (
        <span
          aria-hidden
          className={`typewriter-cursor inline-block w-[0.06em] -mb-[0.05em] ml-[0.05em] h-[0.9em] align-baseline bg-current ${
            done ? "animate-typewriter-blink" : ""
          }`}
        />
      )}
    </span>
  );
}
