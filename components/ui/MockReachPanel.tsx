"use client";

import { motion } from "framer-motion";

export function MockReachPanel() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-white/40">
        Inbox · this week
      </p>

      <div className="space-y-2">
        {[
          { from: "Linda · HVAC owner", subj: "Re: quick intro", status: "Booked · Thu 10:30am" },
          { from: "Marcus · roofing", subj: "Re: 2-min question", status: "Reply received" },
          { from: "Priya · clinic ops", subj: "Re: idea for you", status: "Booked · Fri 2:15pm" },
        ].map((m, i) => (
          <motion.div
            key={m.from}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.35, delay: i * 0.2, ease: "easeOut" }}
            className="flex items-start justify-between gap-2 border-t border-white/5 pt-1.5 first:border-t-0 first:pt-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-white/85">{m.from}</p>
              <p className="truncate text-[10px] text-white/55">{m.subj}</p>
            </div>
            <span className="flex-shrink-0 rounded-md bg-[var(--color-accent)]/20 px-1.5 py-0.5 text-[9px] font-medium text-[var(--color-accent)]">
              {m.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
