"use client";

import { useState } from "react";
import { CHANNELS, THEMES, scheduledDateFor, formatSchedule, cardUrlFor, type ChannelKey } from "@/lib/social-pack";

const X_NATIVE_LINK = "https://x.com/compose/post";

function charCount(text: string): { count: number; limit: number | null; over: boolean } {
  // X is the only platform with a strict cap that matters here.
  return { count: text.length, limit: null, over: false };
}

function xCount(text: string): { count: number; over: boolean } {
  const count = text.length;
  return { count, over: count > 280 };
}

function CopyButton({ text, label }: { text: string; label: string }) {
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
      {copied ? "✓ Copied" : label}
    </button>
  );
}

function ChannelCard({
  channelKey,
  channelLabel,
  channelColor,
  content,
  scheduled,
  isXManual,
  themeSlug,
}: {
  channelKey: ChannelKey;
  channelLabel: string;
  channelColor: string;
  content: string;
  scheduled: string;
  isXManual: boolean;
  themeSlug: string;
}) {
  const x = xCount(content);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: channelColor }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            {channelLabel}
          </span>
          {isXManual && (
            <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
              Manual on X
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {channelKey === "x" && x.over && (
            <span className="text-[11px] font-semibold text-red-300">
              {x.count}/280 — too long
            </span>
          )}
          <CopyButton text={content} label="Copy text" />
          <CopyButton text={cardUrlFor(themeSlug, "https://aioutsourcehub.com")} label="Copy img URL" />
          {isXManual && (
            <a
              href={X_NATIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              Open X →
            </a>
          )}
        </div>
      </div>
      <div className="text-[11px] text-white/40 mb-2">
        Scheduled: {scheduled}
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85 max-w-prose">
        {content}
      </pre>
    </div>
  );
}

export default function SocialPackPreview() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Social pack — preview before posting
          </h1>

          {/* Legend — how to read this page */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/85 leading-relaxed">
              <div className="font-bold mb-2 text-white">How to read this</div>
              <ul className="list-disc pl-5 space-y-1 text-white/75">
                <li><span className="text-white">Pick ONE image per post</span> — the variants are options, not a stack.</li>
                <li><span className="text-white">Copy the caption</span> for the platform you're on.</li>
                <li>Instagram works best as a carousel (image variants as slides). Other platforms = one image.</li>
                <li>Tap a theme to expand its captions.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100 leading-relaxed">
              <div className="font-bold mb-2">Cadence</div>
              <div>1 theme per week, Wed 09:00 EST, starting 2026-05-13.<br />X stays manual (GHL dropped X).</div>
            </div>
          </div>
        </div>

        {THEMES.map((theme, weekIdx) => {
          const date = scheduledDateFor(weekIdx);
          const scheduled = formatSchedule(date);
          const images = theme.images ?? [{ label: "Card", path: `/api/social-card/${theme.slug}` }];
          const isShowcase = !!theme.images && theme.images.length > 1;

          return (
            <details
              key={theme.slug}
              open={isShowcase}
              className={`mb-6 rounded-2xl border ${
                isShowcase
                  ? "border-emerald-400/40 bg-emerald-400/[0.04]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <summary className="cursor-pointer p-5 list-none flex items-center justify-between gap-4 flex-wrap hover:bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-white/40 shrink-0">
                    W{weekIdx + 1}
                  </span>
                  {isShowcase && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200 shrink-0">
                      Showcase
                    </span>
                  )}
                  <h2 className="text-lg md:text-xl font-bold tracking-tight truncate">
                    {theme.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="hidden md:inline">{scheduled}</span>
                  <span className="font-bold text-emerald-300">Tap to expand ▾</span>
                </div>
              </summary>

              <div className="px-5 pb-5">
                <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                  <code className="text-xs text-white/40">{theme.slug}</code>
                  {theme.blogPath && (
                    <a
                      href={theme.blogPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-300 hover:text-emerald-200 underline"
                    >
                      Matching blog post →
                    </a>
                  )}
                </div>

                {/* Image gallery */}
                <div
                  className={`mb-4 grid gap-3 ${
                    images.length > 1 ? "md:grid-cols-3" : "md:grid-cols-1"
                  }`}
                >
                  {images.map((img) => (
                    <div
                      key={img.path}
                      className="rounded-xl overflow-hidden border border-white/10 bg-black/30"
                    >
                      <div className="bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 flex items-center justify-between">
                        <span>{img.label}</span>
                        <a
                          href={img.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-300 hover:text-emerald-200"
                        >
                          Open →
                        </a>
                      </div>
                      <img
                        src={img.path}
                        alt={`${theme.title} — ${img.label}`}
                        className="w-full block"
                      />
                    </div>
                  ))}
                </div>

                {/* Per-channel copy */}
                <div className="grid gap-3">
                  {CHANNELS.map((ch) => {
                    const content = theme.posts[ch.key];
                    if (!content) return null;
                    return (
                      <ChannelCard
                        key={ch.key}
                        channelKey={ch.key}
                        channelLabel={ch.label}
                        channelColor={ch.color}
                        content={content}
                        scheduled={scheduled}
                        isXManual={ch.key === "x"}
                        themeSlug={theme.slug}
                      />
                    );
                  })}
                </div>
              </div>
            </details>
          );
        })}

        <div className="mt-12 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-6">
          <h3 className="text-lg font-bold mb-3">When you're ready:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-white/80">
            <li>Tell me "go" — I push all 5 GHL channels (LinkedIn page + personal, Facebook, Instagram, Google) via API as scheduled posts on the dates above.</li>
            <li>For X: copy each post above, click "Open X →", paste in x.com compose, attach the matching social-card image, set the date in X's scheduler. 12 X posts × ~30 sec = ~6 min.</li>
            <li>Banners on each social page still need manual upload — those are page covers, not posts. URLs in chat above.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
