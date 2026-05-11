"use client";

import { motion } from "framer-motion";

export function MockStudioPanel() {
  const posts = [
    { day: "Mon", title: "Spring HVAC tune-up checklist", time: "9:00 AM" },
    { day: "Wed", title: "Behind the scenes: tankless install", time: "9:00 AM" },
    { day: "Fri", title: "5-star review reel", time: "11:00 AM" },
  ];

  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
          This week · auto-posted
        </p>
        <span className="flex items-center gap-1 text-[9px] text-[var(--color-accent)]">
          <motion.span
            className="h-1 w-1 rounded-full bg-[var(--color-accent)]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          Live
        </span>
      </div>

      <div className="space-y-1.5">
        {posts.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.35, delay: i * 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-md bg-white/[0.04] px-2 py-1.5"
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-[var(--color-accent)]/20 text-[9px] font-bold text-[var(--color-accent)]">
              {p.day}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] text-white/85">{p.title}</p>
              <p className="text-[9px] text-white/45">{p.time}</p>
            </div>
            <span className="flex-shrink-0 text-[10px] text-[var(--color-accent)]">✓</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
