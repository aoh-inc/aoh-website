"use client";

import { useState } from "react";

type Motto = {
  slug: string;
  lines: string[];
  tone: string;
};

const MOTTOS: Motto[] = [
  {
    slug: "we-run",
    lines: ["We run the rest.", "You run the business."],
    tone: "Founder signature line — already on the site",
  },
  {
    slug: "dfy",
    lines: ["Done-for-you growth."],
    tone: "Minimal · 3 words",
  },
  {
    slug: "outcome",
    lines: ["We do the work.", "You keep the customer."],
    tone: "Outcome-first · plain",
  },
  {
    slug: "ai-run",
    lines: ["Hands-off."],
    tone: "Two-word minimalism",
  },
  {
    slug: "no-dashboards",
    lines: ["No dashboards.", "No retainers.", "Just done-for-you growth."],
    tone: "Anti-positioning · three-beat",
  },
  {
    slug: "we-pick-up",
    lines: ["We pick up the phones.", "You pick up the work."],
    tone: "Operator-coded · parallel structure",
  },
  {
    slug: "phones-answered",
    lines: ["Phones answered.", "Reviews chased.", "Leads followed up."],
    tone: "Outcome stack · three specifics",
  },
];

const SERVICE_FORMATS = [
  {
    id: "full",
    label: "Full names",
    text: "Get Found · Stay Found · Get Chosen · Always Ready",
  },
  {
    id: "short",
    label: "Short / categories",
    text: "Reviews · AI visibility · Voice readiness · Content · Local trust",
  },
  {
    id: "verbs",
    label: "Outcome verbs",
    text: "Ask. Reply. Answer. Post. Reach. Bundle.",
  },
];

export default function BannerMottoPicker() {
  const [pickedMotto, setPickedMotto] = useState<string | null>(null);
  const [pickedService, setPickedService] = useState<string>("full");

  const summary = pickedMotto
    ? `Motto: ${pickedMotto}\nService list format: ${pickedService}`
    : "";

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Banner motto — pick one
          </h1>
          <p className="text-white/70 max-w-2xl leading-relaxed">
            Simple typographic banner template. Same design across LinkedIn co, FB, X, GBP, and team personal LinkedIns. Motto sits middle, services list runs underneath, GMF wordmark top-left.
          </p>
          <p className="text-white/60 max-w-2xl leading-relaxed mt-3 text-sm">
            7 motto options below — tap any banner to select. Service list format below that — three styles.
          </p>
        </div>

        {/* Motto banners */}
        <div className="mb-10 space-y-4">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
            Mottos
          </div>
          {MOTTOS.map((m) => {
            const picked = pickedMotto === m.slug;
            return (
              <div
                key={m.slug}
                onClick={() => setPickedMotto(m.slug)}
                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all ${
                  picked
                    ? "border-emerald-400 ring-4 ring-emerald-400/30"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                <div className="bg-black/30 px-4 py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`inline-flex w-6 h-6 items-center justify-center rounded-full font-bold text-xs ${
                        picked ? "bg-emerald-400 text-emerald-950" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {picked ? "✓" : ""}
                    </span>
                    <span className="font-semibold">{m.lines.join(" / ")}</span>
                  </div>
                  <span className="text-xs text-white/50 italic">{m.tone}</span>
                </div>
                <img
                  src={`/api/motto-banner/${m.slug}`}
                  alt={m.lines.join(" ")}
                  className="w-full block"
                />
              </div>
            );
          })}
        </div>

        {/* Service list format */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300 mb-3">
            Services list format
          </div>
          <div className="space-y-2">
            {SERVICE_FORMATS.map((sf) => {
              const picked = pickedService === sf.id;
              return (
                <div
                  key={sf.id}
                  onClick={() => setPickedService(sf.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    picked
                      ? "border-amber-300 bg-amber-300/10 ring-2 ring-amber-300/30"
                      : "border-white/10 bg-white/[0.03] hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-bold">{sf.label}</span>
                    {picked && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-white/80">{sf.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky picks summary */}
        <div className="sticky bottom-4 rounded-2xl border-2 border-emerald-400/50 bg-[#0A1628] p-5 shadow-2xl shadow-emerald-400/20">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300 mb-2">
            Your picks
          </div>
          {!pickedMotto ? (
            <div className="text-sm text-white/60">Tap a banner above to select a motto.</div>
          ) : (
            <>
              <pre className="whitespace-pre-wrap font-mono text-xs text-white/85 leading-relaxed">
                {summary}
              </pre>
              <div className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                ✓ Tell me your picks and I'll apply this motto + service list across all 8 surfaces (LinkedIn co / FB / X / IG / GBP / Mike / Kip / Teri personal banners). Personal banners add name + role row. No image gen — pure Satori. Free, instant edits later.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
