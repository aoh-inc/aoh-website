"use client";

import { useState } from "react";

const PARTNER_TYPES = [
  { value: "web_designer", label: "Web designer" },
  { value: "content_creator", label: "Content creator / influencer" },
  { value: "podcast_host", label: "Podcast host" },
  { value: "bookkeeper", label: "Bookkeeper / accountant" },
  { value: "virtual_assistant", label: "Virtual assistant" },
  { value: "business_coach", label: "Business coach / consultant" },
  { value: "other", label: "Other" },
];

const WHO_ITS_FOR = [
  {
    svg: "M4 3l10 5-10 5V3z",
    type: "Content creators & influencers",
    note: "YouTube, TikTok, Instagram, LinkedIn, and newsletters all work when the audience is local-business owners. Your referral link goes in the description. That's it.",
    tag: "Best fit", borderColor: "#a855f8", bgColor: "rgba(168,85,247,0.08)", tagBg: "rgba(168,85,247,0.2)", tagText: "#c084fc", tagBorder: "rgba(168,85,247,0.3)",
  },
  {
    svg: "M8 2a2.5 2.5 0 012.5 2.5v3a2.5 2.5 0 01-5 0v-3A2.5 2.5 0 018 2zm0 9.5a4.5 4.5 0 004.5-4.5M8 11.5a4.5 4.5 0 01-4.5-4.5M8 11.5V14m-2 0h4",
    type: "Podcast hosts",
    note: "A host read or mid-roll to a small business audience converts better than most ads. Your listeners trust you — that trust transfers.",
    tag: "High intent", borderColor: "#60a5fa", bgColor: "rgba(96,165,250,0.08)", tagBg: "rgba(96,165,250,0.2)", tagText: "#93c5fd", tagBorder: "rgba(96,165,250,0.3)",
  },
  {
    svg: "M2 14V9h3v5M7 14V6h3v8M12 14V3h3v11",
    type: "Bookkeepers & accountants",
    note: "You're already the trusted advisor. When you mention something clients should fix, they listen. Google visibility is a natural part of that conversation.",
    tag: "High trust", borderColor: "#4ade80", bgColor: "rgba(74,222,128,0.08)", tagBg: "rgba(74,222,128,0.2)", tagText: "#86efac", tagBorder: "rgba(74,222,128,0.3)",
  },
  {
    svg: "M8 7a3 3 0 100-6 3 3 0 000 6zm-5 8a5 5 0 0110 0",
    type: "Virtual assistants",
    note: "You work inside local businesses every day. You see the gaps — invisible profiles, no reviews, no visibility. You know who needs this before they do.",
    tag: "Insider edge", borderColor: "#fbbf24", bgColor: "rgba(251,191,36,0.08)", tagBg: "rgba(251,191,36,0.2)", tagText: "#fde68a", tagBorder: "rgba(251,191,36,0.3)",
  },
  {
    svg: "M8 2a6 6 0 100 12A6 6 0 008 2zm0 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 2a.5.5 0 110 1 .5.5 0 010-1z",
    type: "Business coaches & consultants",
    note: "Visibility is part of every growth conversation. GetMeFound handles the execution so you don't have to — and your clients get a result they can see.",
    tag: "Easy add-on", borderColor: "#38bdf8", bgColor: "rgba(56,189,248,0.08)", tagBg: "rgba(56,189,248,0.2)", tagText: "#7dd3fc", tagBorder: "rgba(56,189,248,0.3)",
  },
  {
    svg: "M2 3h12v10H2V3zm0 0l6 5 6-5",
    type: "Web designers",
    note: "You build the site, but may not want ongoing Google profile, review, and visibility work. GetMeFound handles that execution without turning you into a retainer agency.",
    tag: "Natural handoff", borderColor: "#fb7185", bgColor: "rgba(251,113,133,0.08)", tagBg: "rgba(251,113,133,0.2)", tagText: "#fda4af", tagBorder: "rgba(251,113,133,0.3)",
  },
];

function PartnerForm() {
  const [form, setForm] = useState({
    name: "", email: "", partnerType: "", handle: "",
    audienceSize: "", howYouWork: "", offersGbp: "", website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center">
        <p className="text-2xl font-bold text-white mb-2">Application received.</p>
        <p className="text-white/60 text-base">
          We review every application personally and will get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  const inp = "w-full rounded-xl border border-white/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-colors";
  const lbl = "block text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="website" value={form.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Your name</label>
          <input required className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} placeholder="Jane Smith" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className={lbl}>Email address</label>
          <input required type="email" className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} placeholder="jane@example.com" value={form.email} onChange={set("email")} />
        </div>
      </div>
      <div>
        <label className={lbl}>How you reach local business owners</label>
        <select required className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} value={form.partnerType} onChange={set("partnerType")}>
          <option value="" disabled>Select one...</option>
          {PARTNER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>
            Channel or handle{" "}
            <span className="normal-case font-normal text-white/25">(optional)</span>
          </label>
          <input className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} placeholder="@yourhandle or YouTube URL" value={form.handle} onChange={set("handle")} />
        </div>
        <div>
          <label className={lbl}>
            Audience or client count{" "}
            <span className="normal-case font-normal text-white/25">(approx.)</span>
          </label>
          <input className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} placeholder="e.g. 8,000 subscribers" value={form.audienceSize} onChange={set("audienceSize")} />
        </div>
      </div>
      <div>
        <label className={lbl}>How do you plan to introduce GetMeFound?</label>
        <textarea
          required
          rows={3}
          className={inp}
          style={{ backgroundColor: "white", color: "#0f172a" }}
          placeholder="Your audience, how you'd mention it, why it fits..."
          value={form.howYouWork}
          onChange={set("howYouWork")}
        />
      </div>
      <div>
        <label className={lbl}>Do you currently offer Google profile or SEO services?</label>
        <select required className={inp} style={{ backgroundColor: "white", color: "#0f172a" }} value={form.offersGbp} onChange={set("offersGbp")}>
          <option value="" disabled>Select one...</option>
          <option value="no">No — I don&apos;t offer those</option>
          <option value="yes_basic">Occasionally, but not as a core service</option>
          <option value="yes_full">Yes — it&apos;s part of what I sell</option>
        </select>
      </div>
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-[var(--color-accent)] px-6 py-4 text-base font-semibold text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Apply to become a partner →"}
      </button>
      <p className="text-center text-xs text-white/30">
        We review every application and respond within 1-2 business days.
      </p>
    </form>
  );
}

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--color-hero-bg)", borderBottomColor: "var(--color-hero-border)" }}
        className="border-b py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Partner program
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-[var(--color-hero-text)]">
            One referral a day.
            <br className="hidden sm:block" />
            <span className="text-[var(--color-accent)]"> $1,500 a month.</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-[var(--color-hero-subtext)]"
            style={{ opacity: 0.7 }}
          >
            There are over 30 million local businesses in the US. Most are not ready for AI-driven Google
            search, maps, and local recommendations. GetMeFound fixes that &mdash; $149 to start.
            You earn $50 every time someone buys through your link.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-text)" }}
          >
            Apply now &rarr;
          </a>
        </div>
      </section>

      {/* What they get */}
      <section
        style={{ backgroundColor: "var(--color-hero-bg)", borderBottomColor: "var(--color-hero-border)" }}
        className="border-b py-12 md:py-16"
      >
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] text-center">
            What your referral gets
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                svgPath: "M10.5 10.5l3 3M6.5 11a4.5 4.5 0 100-9 4.5 4.5 0 000 9z",
                title: "Visibility check",
                desc: "They see exactly where they stand vs. local competitors — before and after",
                color: "#60a5fa",
              },
              {
                svgPath: "M4 2h8l2 2v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm2 6l2 2 3-3",
                title: "Profile cleanup",
                desc: "Google Business Profile cleaned up and synced so AI can trust it",
                color: "#4ade80",
              },
              {
                svgPath: "M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5L8 2z",
                title: "Review jumpstart",
                desc: "First review request path prepared for real customers, with safe send proof",
                color: "#fbbf24",
              },
              {
                svgPath: "M2 14V9h3v5M7 14V6h3v8M12 14V3h3v11",
                title: "Proof report",
                desc: "Before/after snapshot showing exactly what changed and what improved",
                color: "#a855f8",
              },
            ].map(({ svgPath, title, desc, color }) => (
              <div
                key={title}
                className="rounded-2xl border p-5 text-center"
                style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex justify-center mb-4">
                  <svg
                    width="20" height="20" viewBox="0 0 16 16"
                    fill="none" stroke={color} strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d={svgPath} />
                  </svg>
                </div>
                <p className="font-bold text-sm mb-1.5 text-white">{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                <div className="mt-3 h-px w-8 rounded-full mx-auto" style={{ backgroundColor: color, opacity: 0.6 }} />
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            Done for them, with no software to learn and no dashboard to manage. Easy to explain, easy to sell.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        style={{ backgroundColor: "var(--color-hero-bg)", borderBottomColor: "var(--color-hero-border)" }}
        className="border-b py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-10 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] text-center">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Apply", body: "Tell us about your audience. We review every application within 1-2 business days.", top: "#60a5fa" },
              { step: "02", title: "Get your link", body: "Approved partners get a unique link that tracks every click and conversion back to you.", top: "#4ade80" },
              { step: "03", title: "Share it", body: "Drop it in a video, post, email, or conversation. We give you ready-to-use copy.", top: "#fbbf24" },
              { step: "04", title: "Get paid", body: "$50 per sale. Payouts happen monthly by PayPal or bank transfer. No minimums, no caps.", top: "#a855f8" },
            ].map(({ step, title, body, top }) => (
              <div
                key={step}
                className="rounded-2xl border p-6"
                style={{
                  borderTopColor: top,
                  borderTopWidth: "2px",
                  borderColor: "rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <p className="font-mono text-xs font-bold mb-3" style={{ color: top }}>{step}</p>
                <p className="font-bold mb-2 text-white">{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        style={{ backgroundColor: "var(--color-hero-bg)", borderBottomColor: "var(--color-hero-border)" }}
        className="border-b py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] text-center">
            Who it&apos;s for
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight mb-4 text-white">
            If you talk to local business owners,
            <br className="hidden sm:block" /> your audience is the buyer.
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.5)" }}>
            You don&apos;t need millions of followers. You need the right ones.
            One honest mention to the right audience moves real volume.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHO_ITS_FOR.map(({ svg, type, note, tag, borderColor, bgColor, tagBg, tagText, tagBorder }) => (
              <div
                key={type}
                className="rounded-2xl border p-5"
                style={{
                  borderLeftColor: borderColor,
                  borderLeftWidth: "4px",
                  borderColor: "rgba(255,255,255,0.06)",
                  backgroundColor: bgColor,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <svg
                      width="16" height="16" viewBox="0 0 16 16"
                      fill="none" stroke={borderColor} strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <path d={svg} />
                    </svg>
                    <p className="font-bold text-sm text-white">{type}</p>
                  </div>
                  <span
                    className="flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: tagBg, color: tagText, borderColor: tagBorder }}
                  >
                    {tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed pl-7" style={{ color: "rgba(255,255,255,0.5)" }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready-to-use copy */}
      <section
        style={{ backgroundColor: "var(--color-bg-page)", borderBottomColor: "var(--color-border)" }}
        className="border-b py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] text-center">
            Ready-to-use copy
          </p>
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--color-text-body)" }}>
            Words that actually convert.
          </h2>
          <p className="text-center mb-10" style={{ color: "var(--color-text-muted)" }}>
            Written around what business owners are feeling right now. Use word-for-word or riff on it.
          </p>
          <div className="space-y-4">
            {/* Short blurb */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <div
                className="flex items-center gap-3 px-6 py-3 border-b"
                style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(168,85,247,0.05)" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#a855f8" }} />
                <p
                  className="font-mono text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#a855f8" }}
                >
                  Short &mdash; video / social plug
                </p>
              </div>
              <div className="px-6 py-5" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-text-body)" }}>
                  &ldquo;Real talk &mdash; if someone searches for your type of business right now,
                  is AI recommending you? Probably not, and it&apos;s not your fault. Google Search
                  is becoming more AI-driven and most local businesses have no idea. There&apos;s a service
                  called GetMeFound &mdash; $149, they clean up your Google profile and fix your AI visibility signals,
                  and they help set up the first safe review request path.
                  No monthly fee. Link is below.&rdquo;
                </p>
              </div>
            </div>
            {/* Long blurb */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <div
                className="flex items-center gap-3 px-6 py-3 border-b"
                style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(96,165,250,0.05)" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#60a5fa" }} />
                <p
                  className="font-mono text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ color: "#60a5fa" }}
                >
                  Long &mdash; email / newsletter / podcast
                </p>
              </div>
              <div className="px-6 py-5" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-text-body)" }}>
                  &ldquo;Something worth flagging if you run a local business or know someone who does:
                  Google Search is becoming more AI-driven and conversational. Instead of only matching keywords,
                  it needs complete, trustworthy business facts before it can confidently recommend a local company.
                  Most local profiles are too incomplete for that. A service called GetMeFound fixes this.
                  They clean up your Google Business Profile, sync your info, set up your first review
                  request path, and show you the before/after proof &mdash; all for a
                  one-time $149. No subscription, no contract. If you&apos;ve been getting fewer calls lately
                  and can&apos;t figure out why, this is probably it. Check it out: [YOUR LINK]&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission math */}
      <section
        style={{ backgroundColor: "var(--color-hero-bg)", borderBottomColor: "var(--color-hero-border)" }}
        className="border-b py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                The math
              </p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5 text-[var(--color-hero-text)]">
                One referral a day
                <br /> is{" "}
                <span className="text-[var(--color-accent)]">$1,500 a month.</span>
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "var(--color-hero-subtext)", opacity: 0.7 }}
              >
                There are over 30 million local businesses in the US. Most are not ready for AI-driven local
                search &mdash; and many don&apos;t know it yet. The opportunity is everywhere. Your audience
                just needs to hear about it once.
              </p>
              <p className="text-sm" style={{ color: "var(--color-hero-subtext)", opacity: 0.4 }}>
                $50 per Get Found conversion &middot; paid monthly &middot; no minimum &middot; no cap
              </p>
            </div>
            <div className="space-y-3">
              {[
                { freq: "1 referral / day", monthly: "$1,500 / mo", annual: "$18,000 / yr", highlight: true },
                { freq: "2 referrals / day", monthly: "$3,000 / mo", annual: "$36,000 / yr", highlight: false },
                { freq: "5 referrals / day", monthly: "$7,500 / mo", annual: "$90,000 / yr", highlight: false },
              ].map(({ freq, monthly, annual, highlight }) => (
                <div
                  key={freq}
                  className="rounded-2xl border px-6 py-4 flex items-center justify-between"
                  style={
                    highlight
                      ? { borderColor: "var(--color-accent)", backgroundColor: "rgba(74,222,128,0.1)" }
                      : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" }
                  }
                >
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: highlight ? "var(--color-accent)" : "rgba(255,255,255,0.5)" }}
                    >
                      {freq}
                    </p>
                    <p className="text-2xl font-black text-white">{monthly}</p>
                  </div>
                  <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>{annual}</p>
                </div>
              ))}
              <p className="text-xs text-center pt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                Earnings sent directly to you each month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section
        id="apply"
        style={{ backgroundColor: "var(--color-hero-bg)", borderTopColor: "var(--color-hero-border)" }}
        className="border-t py-16 md:py-24"
      >
        <div className="mx-auto max-w-xl px-6">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] text-center">
            Apply
          </p>
          <h2 className="text-3xl font-bold text-center mb-3 text-[var(--color-hero-text)]">
            Ready to partner up?
          </h2>
          <p className="text-center mb-8" style={{ color: "var(--color-hero-subtext)", opacity: 0.6 }}>
            Takes two minutes. We review every application personally.
          </p>
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <PartnerForm />
          </div>
          <p className="mt-5 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Questions? Email{" "}
            <a
              href="mailto:mike@getmefound.ai"
              className="hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              mike@getmefound.ai
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
