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
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Social pack — preview before posting
          </h1>
          <p className="text-white/70 max-w-2xl leading-relaxed">
            12 themes × 5 platforms via GHL + manual X.{" "}
            <span className="text-amber-200">X posts</span> need manual copy/paste into x.com native scheduler — GHL dropped X integration.
            Approve here, then say go and I'll push all 5 GHL channels via API as scheduled posts.
          </p>
          <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100">
            <div className="font-bold mb-2">Cadence</div>
            <div>1 theme per week, Wednesdays at 09:00 EST, starting 2026-05-13. 12 weeks total. Every theme posts the same week across all 6 channels.</div>
          </div>
        </div>

        {THEMES.map((theme, weekIdx) => {
          const date = scheduledDateFor(weekIdx);
          const scheduled = formatSchedule(date);
          const cardUrl = cardUrlFor(theme.slug, "");

          return (
            <section
              key={theme.slug}
              className="mb-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                    Week {weekIdx + 1} · {scheduled}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{theme.title}</h2>
                  <code className="text-xs text-white/40">{theme.slug}</code>
                </div>
                <a
                  href={cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-300 hover:text-emerald-200 underline"
                >
                  Open image in new tab →
                </a>
              </div>

              {/* Image preview */}
              <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black/30">
                <img
                  src={cardUrl}
                  alt={`${theme.title} card`}
                  className="w-full max-w-[640px] mx-auto block"
                />
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
            </section>
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
