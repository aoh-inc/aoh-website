"use client";

import { motion } from "framer-motion";

export function MockRelayPanel() {
  const lines = [
    { who: "Caller", text: "Hi, I need a plumber for tomorrow morning if possible.", side: "left" as const },
    { who: "Relay", text: "I can book you in at 10am. Can I have your name and address?", side: "right" as const },
    { who: "Caller", text: "It's Sarah, 412 Oak Street.", side: "left" as const },
    { who: "Relay", text: "Booked. You'll get a confirmation text shortly.", side: "right" as const },
  ];

  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/40">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          Live · 11:42 PM
        </p>
        <span className="text-[9px] text-white/50">EN · ES · 27 langs</span>
      </div>

      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.3, delay: i * 0.35, ease: "easeOut" }}
            className={`flex ${l.side === "right" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-2 py-1.5 ${
                l.side === "right"
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-white/[0.06] text-white/80"
              }`}
            >
              <p className="text-[10px] leading-snug">{l.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
