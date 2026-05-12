"use client";

import { useState } from "react";
import { SURFACES, LOGOS, type Surface, type CopyBlock } from "@/lib/team-pack";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function BlockCard({ block }: { block: CopyBlock }) {
  const len = block.text.length;
  const over = block.charLimit ? len > block.charLimit : false;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-xs font-bold uppercase tracking-wider text-white/70">
          {block.label}
        </div>
        <div className="flex items-center gap-2">
          {block.charLimit && (
            <span
              className={`text-[11px] font-mono ${
                over ? "text-red-300" : "text-white/40"
              }`}
            >
              {len}/{block.charLimit}
            </span>
          )}
          <CopyButton text={block.text} />
        </div>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85 max-w-prose">
        {block.text}
      </pre>
    </div>
  );
}

function SurfaceSection({ surface }: { surface: Surface }) {
  const bannerUrl = surface.bannerSlug ? `/api/team-banner/${surface.bannerSlug}` : null;
  const isPerson = surface.type === "person";

  return (
    <section
      id={surface.key}
      className={`mb-10 rounded-2xl border p-6 scroll-mt-24 ${
        isPerson
          ? "border-emerald-400/30 bg-emerald-400/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
              isPerson
                ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {isPerson ? "Person" : "Company"}
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{surface.label}</h2>
          {surface.bannerWidth && surface.bannerHeight && (
            <span className="text-xs font-mono text-white/40 shrink-0">
              {surface.bannerWidth}×{surface.bannerHeight}
            </span>
          )}
        </div>
      </div>

      {/* Banner */}
      {bannerUrl && (
        <div className="mb-5 rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <div className="bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 flex items-center justify-between">
            <span>Banner — right-click to save</span>
            <div className="flex items-center gap-2">
              <CopyButton text={`https://aioutsourcehub.com${bannerUrl}`} />
              <a
                href={bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 text-xs font-semibold"
              >
                Open →
              </a>
            </div>
          </div>
          <img
            src={bannerUrl}
            alt={`${surface.label} banner`}
            className="w-full block"
          />
        </div>
      )}

      {/* Copy blocks */}
      <div className="space-y-3 mb-5">
        {surface.blocks.map((b) => (
          <BlockCard key={b.label} block={b} />
        ))}
      </div>

      {/* Hashtags */}
      {surface.hashtags && (
        <div className="mb-5 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {surface.hashtags.label}
            </div>
            <CopyButton text={surface.hashtags.tags} />
          </div>
          <div className="font-mono text-sm text-amber-100/90 leading-relaxed">
            {surface.hashtags.tags}
          </div>
        </div>
      )}

      {/* Profile fields */}
      {surface.fields.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">
            Profile fields to fill on the platform
          </div>
          <div className="grid gap-2">
            {surface.fields.map((l) => (
              <div
                key={l.field}
                className="flex items-center justify-between gap-3 text-sm flex-wrap"
              >
                <div className="text-white/60 shrink-0 font-mono text-xs min-w-[140px]">
                  {l.field}
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                  <code className="text-white/85 text-xs truncate">{l.value}</code>
                  <CopyButton text={l.value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function TeamProfilesPreview() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Team profile kit — final
          </h1>
          <p className="text-white/70 max-w-2xl leading-relaxed mb-4">
            Picked motto: <span className="text-emerald-300 font-semibold">Phones answered. Reviews chased. Leads followed up.</span>
            <br />
            Applied across all 8 surfaces below. Right-click any banner → save → upload to platform. Tap copy on any text block to grab paste-ready copy.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/85 leading-relaxed">
              <div className="font-bold mb-2 text-white">Formatting notes</div>
              <ul className="list-disc pl-5 space-y-1 text-white/75 text-xs">
                <li>LinkedIn About uses Unicode bold characters (𝗯𝗼𝗹𝗱) for section headers — renders inline on LinkedIn since real markdown is stripped.</li>
                <li>Hashtags listed per surface are for POSTS, not bios (X bio hashtags aren't clickable; IG bio hashtags eat your 150-char budget).</li>
                <li>Instagram has no banner — profile pic + bio + 5 native links.</li>
                <li>Banner template identical across all 7 banner surfaces — wordmark + motto + services + URL.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
              <div className="font-bold mb-2">Jump to</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {SURFACES.map((s) => (
                  <a
                    key={s.key}
                    href={`#${s.key}`}
                    className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 hover:bg-emerald-400/20"
                  >
                    {s.key}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Logos — same set everywhere
          </h2>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.04] p-5">
            <p className="text-sm text-white/85 leading-relaxed mb-4">
              <span className="font-bold text-emerald-300">For all profile pictures</span> (LinkedIn personal + company, Facebook page, Instagram, X, GBP) — use the same navy-background icon. The 2048×2048 file downscales cleanly to every platform's display size and stays crisp.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {LOGOS.map((logo) => (
                <div
                  key={logo.filename}
                  className={`rounded-xl border p-4 ${
                    logo.recommended
                      ? "border-emerald-400/50 bg-emerald-400/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {logo.recommended && (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                          Recommended
                        </span>
                      )}
                      <code className="text-xs text-white/85 font-mono">
                        {logo.filename}
                      </code>
                    </div>
                    <CopyButton text={`https://aioutsourcehub.com${logo.url}`} />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={logo.url}
                      alt={logo.filename}
                      className="h-16 w-auto rounded-md border border-white/10 bg-black/30"
                    />
                    <div className="text-[11px] font-mono text-white/50">
                      {logo.dimensions}
                    </div>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {logo.bestFor}
                  </p>
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="mt-2 inline-block text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Open / download →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company surfaces */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Company surfaces
          </h2>
          {SURFACES.filter((s) => s.type === "company").map((s) => (
            <SurfaceSection key={s.key} surface={s} />
          ))}
        </div>

        {/* Personal LinkedIns */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Personal LinkedIn — team
          </h2>
          {SURFACES.filter((s) => s.type === "person").map((s) => (
            <SurfaceSection key={s.key} surface={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
