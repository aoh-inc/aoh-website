"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TRUSTED_REPORT_HOSTS = [
  "gohighlevel.com",
  "msgsndr.com",
  "leadconnectorhq.com",
  "hub360ai.com",
  "aioutsourcehub.com",
];

function trustedReportUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    const ok = TRUSTED_REPORT_HOSTS.some(
      (h) => u.hostname === h || u.hostname.endsWith("." + h),
    );
    return ok ? u.toString() : null;
  } catch {
    return null;
  }
}

// vol = monthly transaction count for a typical business in the niche.
// defaultValue = avg customer value per transaction/visit/service (slider seed).
// velocityTarget = healthy reviews/month for top performers (research-tuned 2026).
// valueMin/Max/Step = slider scaling per industry (small-ticket niches get tight ranges
// + small steps; high-ticket niches get wider ranges + bigger steps so mobile drag is sane).
const industries: Record<
  string,
  {
    defaultValue: number;
    vol: number;
    velocityTarget: number;
    valueLabel: string;
    label: string;
    valueMin: number;
    valueMax: number;
    valueStep: number;
  }
> = {
  petgroomer:    { defaultValue: 70,    vol: 180, velocityTarget: 12, valueLabel: "per groom",      label: "pet groomers",            valueMin: 25,    valueMax: 250,    valueStep: 5 },
  vet:           { defaultValue: 290,   vol: 220, velocityTarget: 18, valueLabel: "per visit",      label: "vet practices",           valueMin: 50,    valueMax: 800,    valueStep: 10 },
  autoshop:      { defaultValue: 480,   vol: 160, velocityTarget: 15, valueLabel: "per service",    label: "auto repair shops",       valueMin: 100,   valueMax: 1500,   valueStep: 25 },
  funeral:       { defaultValue: 9500,  vol: 12,  velocityTarget: 5,  valueLabel: "per service",    label: "funeral homes",           valueMin: 2000,  valueMax: 25000,  valueStep: 250 },
  moving:        { defaultValue: 2100,  vol: 35,  velocityTarget: 10, valueLabel: "per move",       label: "moving companies",        valueMin: 500,   valueMax: 6000,   valueStep: 100 },
  seniorliving:  { defaultValue: 4800,  vol: 40,  velocityTarget: 8,  valueLabel: "per resident/mo",label: "senior living facilities",valueMin: 1000,  valueMax: 12000,  valueStep: 250 },
  marketing:     { defaultValue: 3200,  vol: 8,   velocityTarget: 5,  valueLabel: "per engagement", label: "marketing consultants",   valueMin: 500,   valueMax: 10000,  valueStep: 250 },
  b2b:           { defaultValue: 2400,  vol: 15,  velocityTarget: 5,  valueLabel: "per engagement", label: "B2B service businesses",  valueMin: 500,   valueMax: 10000,  valueStep: 100 },
};

const rankingTraffic: Record<number, number> = {
  1: 1.00, 2: 0.78, 3: 0.61,
  4: 0.38, 5: 0.28, 6: 0.21,
  7: 0.15, 8: 0.11, 9: 0.08, 10: 0.06,
  11: 0.04, 12: 0.03, 13: 0.03, 14: 0.02, 15: 0.02,
  16: 0.02, 17: 0.01, 18: 0.01, 19: 0.01, 20: 0.01,
};

type AiVisibilityStatus =
  | ""
  | "yes-cited"
  | "think-so"
  | "dont-know"
  | "tested-invisible";

const aiVisibilityWeights: Record<Exclude<AiVisibilityStatus, "">, number> = {
  "yes-cited":         0.05,
  "think-so":          0.18,
  "dont-know":         0.32,
  "tested-invisible":  0.45,
};

function fmt(n: number): string {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "K";
  return "$" + n.toLocaleString();
}

export function RevenueCalculator() {
  return (
    <Suspense fallback={null}>
      <RevenueCalculatorInner />
    </Suspense>
  );
}

function RevenueCalculatorInner() {
  const searchParams = useSearchParams();
  const aiVisUrl = trustedReportUrl(searchParams.get("ai_vis_url"));
  const [industry, setIndustry] = useState("");
  const [customerValue, setCustomerValue] = useState(290);
  const [reviewsPerMonth, setReviewsPerMonth] = useState(2);
  const [stars, setStars] = useState(3.8);
  const [ranking, setRanking] = useState(8);
  const [aiVisibility, setAiVisibility] = useState<AiVisibilityStatus>("");
  const [results, setResults] = useState<{
    lostCustomers: string;
    lostRevenue: string;
    gainedCustomers: string;
    gainedRevenue: string;
    insight: string;
    needsAiCheck: boolean;
  } | null>(null);

  useEffect(() => {
    if (industry && industries[industry]) {
      setCustomerValue(industries[industry].defaultValue);
    }
  }, [industry]);

  useEffect(() => {
    if (!industry) {
      setResults(null);
      return;
    }
    const ind = industries[industry];

    let starPenalty = 0;
    if (stars < 3.3) starPenalty = 0.55;
    else if (stars < 3.7) starPenalty = 0.35;
    else if (stars < 4.0) starPenalty = 0.20;
    else if (stars < 4.2) starPenalty = 0.10;
    else if (stars < 4.5) starPenalty = 0.04;

    // Continuous exponential decay (no cap, never plateaus) — every +1 review reduces penalty.
    // pow(0.5, reviews / target) halves penalty every full target step.
    // Slower decay vs half-target keeps per-step deltas above $100 rounding even at low volumes.
    const reviewPenalty = 0.65 * Math.pow(0.5, reviewsPerMonth / ind.velocityTarget);

    const currentTraffic = rankingTraffic[Math.min(ranking, 20)];
    const trafficLoss = 1 - currentTraffic;

    // Weights: review velocity is now the dominant lever (0.45) since it's AOH's primary product
    // and Whitespark 2026 research confirms velocity > total count for ranking.
    const totalPenalty = Math.min(0.90, trafficLoss * 0.40 + starPenalty * 0.15 + reviewPenalty * 0.45);

    const monthlyRevenue = customerValue * ind.vol;
    const lostRevenueRaw = monthlyRevenue * totalPenalty;
    const lostCustomersRaw = ind.vol * totalPenalty;

    const aiWeight = aiVisibility ? aiVisibilityWeights[aiVisibility] : 0;
    const aiRevenueAtRisk = monthlyRevenue * aiWeight;
    const aiCustomersAtRisk = ind.vol * aiWeight;

    const totalLostRevenue = Math.round((lostRevenueRaw + aiRevenueAtRisk) / 100) * 100;
    const totalLostCustomers = Math.round(lostCustomersRaw + aiCustomersAtRisk);

    const recoverableRevenue = Math.round(totalLostRevenue * 0.7 / 100) * 100;
    const recoverableCustomers = Math.round(totalLostCustomers * 0.7);

    let insight = "";
    const target = ind.velocityTarget;

    if (aiVisibility === "tested-invisible") {
      insight = `<strong>You&apos;re invisible in AI search — that&apos;s the biggest issue.</strong> 25%+ of local discovery has shifted to ChatGPT, Claude, and Google AI Overviews. Reviews and ranking only fix half the problem.`;
    } else if (reviewsPerMonth === 0) {
      insight = `<strong>Zero new reviews this month is the biggest issue.</strong> Google&apos;s local pack weights review <em>freshness</em> over total count. Reviews older than 6 months carry only 10–20% of their original ranking power. The top ${ind.label} get ${target}+ new reviews per month, every month — that&apos;s why they outrank you, even if you have a higher total count.`;
    } else if (reviewsPerMonth < target * 0.5) {
      insight = `<strong>Your review velocity is too low to keep ranking.</strong> The top ${ind.label} collect ${target}+ new reviews per month. At ${reviewsPerMonth}/month, Google reads your business as slowing down — your ranking starts decaying within 30 days regardless of how many older reviews you have. Velocity is the ranking signal; volume isn&apos;t.`;
    } else if (aiVisibility === "dont-know" && reviewsPerMonth >= target * 0.6 && ranking <= 5) {
      insight = `<strong>Your Google game is decent — the AI gap is wide open.</strong> You&apos;re close on velocity (${reviewsPerMonth}/mo vs ${target}+) and rank #${ranking}. Unknown is AI search, where most local businesses score under 20/100. Free report includes a live ChatGPT and Claude check for your business.`;
    } else if (ranking > 5) {
      insight = `<strong>Your ranking is costing you the most.</strong> Positions #1–3 capture ${Math.round(rankingTraffic[1] * 100)}% of local search clicks. At #${ranking}, you&apos;re getting roughly ${Math.round(currentTraffic * 100)}% of that traffic. Most customers never see you.`;
    } else if (stars < 4.0) {
      insight = `<strong>Your star rating is your biggest conversion killer.</strong> 94% of consumers won&apos;t consider a business under 4.0 stars. At ${stars.toFixed(1)}, you&apos;re visible — but customers are choosing your competitors instead.`;
    } else if (aiVisibility === "yes-cited") {
      insight = `<strong>You&apos;re ahead of most.</strong> Solid velocity, decent ranking, AND cited in AI engines — rare combo. The remaining gap is keeping velocity steady; one slow month and the algorithm reads you as inactive.`;
    } else {
      insight = `<strong>You&apos;re closer than most.</strong> Targeted improvements to velocity, ranking, and AI search visibility could recover most of that ${fmt(totalLostRevenue)}/month. The gap is smaller than you think.`;
    }

    setResults({
      lostCustomers: totalLostCustomers + "/mo",
      lostRevenue: fmt(totalLostRevenue) + "/mo",
      gainedCustomers: recoverableCustomers + "/mo",
      gainedRevenue: fmt(recoverableRevenue) + "/mo",
      insight,
      needsAiCheck: aiVisibility === "dont-know" || aiVisibility === "think-so",
    });
  }, [industry, customerValue, reviewsPerMonth, stars, ranking, aiVisibility]);

  const renderStars = (rating: number) => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(
        <span
          key={i}
          className={`text-2xl ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>,
      );
    }
    return arr;
  };

  const ind = industry ? industries[industry] : null;

  return (
    <section
      id="calculator"
      className="py-14 md:py-20 bg-[var(--color-bg-page)] scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-sm">
          <div className="text-center mb-6 md:mb-8">
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2 md:mb-3">
              Free Estimate · No email required
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-text-body)] mb-3 md:mb-4 leading-tight">
              See what your reviews are costing you every month
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
              Enter your business details. We&apos;ll show you the customers and revenue your
              current visibility is leaving on the table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
            <div>
              {/* Industry */}
              <div className="mb-8">
                <label htmlFor="industry-select" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  What type of business do you run?
                </label>
                <select
                  id="industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text-body)] bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6072' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "40px",
                  }}
                >
                  <option value="">— Select your industry —</option>
                  <option value="petgroomer">Pet Grooming</option>
                  <option value="vet">Veterinary Practice</option>
                  <option value="autoshop">Auto Repair Shop</option>
                  <option value="funeral">Funeral Home</option>
                  <option value="moving">Moving Company</option>
                  <option value="seniorliving">Senior Living Facility</option>
                  <option value="marketing">Marketing Consultant</option>
                  <option value="b2b">B2B Service Business</option>
                </select>
              </div>

              {/* Customer value */}
              <div className="mb-8">
                <label htmlFor="customer-value-range" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  What&apos;s an average customer worth to your business?{" "}
                  <span className="font-normal text-[var(--color-text-muted)]">
                    (${customerValue.toLocaleString()}{ind ? ` ${ind.valueLabel}` : ""})
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="customer-value-range"
                    type="range"
                    min={ind ? ind.valueMin : 25}
                    max={ind ? ind.valueMax : 15000}
                    step={ind ? ind.valueStep : 25}
                    value={customerValue}
                    onChange={(e) => setCustomerValue(parseInt(e.target.value))}
                    disabled={!ind}
                    className="flex-1 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="text-lg font-bold text-[var(--color-text-body)] min-w-[80px] text-right">
                    ${customerValue.toLocaleString()}
                  </div>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Drag to your actual number. Defaults + slider range are industry-tuned — most
                  owners adjust within the range.
                </p>
              </div>

              {/* Review velocity (replaces total) */}
              <div className="mb-8">
                <label htmlFor="reviews-range" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  How many new Google reviews do you get each month?{" "}
                  <span className="font-normal text-[var(--color-text-muted)]">
                    ({reviewsPerMonth}/mo)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="reviews-range"
                    type="range"
                    min="0"
                    max="20"
                    value={reviewsPerMonth}
                    onChange={(e) => setReviewsPerMonth(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-lg font-bold text-[var(--color-text-body)] min-w-[60px] text-right">
                    {reviewsPerMonth}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>0 / month</span>
                  <span>20+ / month</span>
                </div>
                {ind && (
                  <p className="mt-2 text-xs font-semibold text-[var(--color-accent)]">
                    Top {ind.label} get {ind.velocityTarget}+ new reviews/month.
                  </p>
                )}
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Velocity matters more than total — Google&apos;s algorithm decays old reviews
                  fast. <strong className="text-[var(--color-text-body)]">Not sure?</strong>{" "}
                  Open your Google Business Profile, sort reviews by &quot;Most recent,&quot; count
                  the last 30 days.
                </p>
              </div>

              {/* Star Rating */}
              <div className="mb-8">
                <label htmlFor="stars-range" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  What&apos;s your current average star rating?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="stars-range"
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={stars}
                    onChange={(e) => setStars(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-lg font-bold text-[var(--color-text-body)] min-w-[60px] text-right">
                    {stars.toFixed(1)} ★
                  </div>
                </div>
                <div className="flex mt-3">{renderStars(stars)}</div>
                <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>1 star</span>
                  <span>5 stars</span>
                </div>
              </div>

              {/* Ranking */}
              <div className="mb-8">
                <label htmlFor="ranking-range" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  Where do you typically rank on Google Maps for your main service?{" "}
                  <span className="text-xs font-normal text-[var(--color-text-muted)]">
                    (e.g. &quot;auto repair near me&quot;)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="ranking-range"
                    type="range"
                    min="1"
                    max="20"
                    value={ranking}
                    onChange={(e) => setRanking(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-lg font-bold text-[var(--color-text-body)] min-w-[60px] text-right">
                    #{ranking}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>#1 (top)</span>
                  <span>#20+</span>
                </div>
              </div>

              {/* AI Visibility */}
              <div className="mb-2">
                <label htmlFor="ai-visibility-select" className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  Does ChatGPT, Claude, or Google AI Overviews recommend you?
                </label>
                <select
                  id="ai-visibility-select"
                  value={aiVisibility}
                  onChange={(e) => setAiVisibility(e.target.value as AiVisibilityStatus)}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text-body)] bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6072' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "40px",
                  }}
                >
                  <option value="">— Select —</option>
                  <option value="yes-cited">Yes — I&apos;ve tested and I&apos;m cited</option>
                  <option value="think-so">I think so, but not sure</option>
                  <option value="dont-know">I don&apos;t know — never tested</option>
                  <option value="tested-invisible">Tested and I&apos;m invisible</option>
                </select>
                {(aiVisibility === "dont-know" || aiVisibility === "think-so") && !aiVisUrl && (
                  <p className="mt-3 text-xs text-[var(--color-accent)] leading-relaxed">
                    We&apos;ll run a live ChatGPT + Claude + Google AI Overviews check for your
                    business in your free report — see exactly what they say (or don&apos;t).
                  </p>
                )}
                {aiVisUrl && (
                  <a
                    href={aiVisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-6 py-3 text-base font-semibold transition-all hover:shadow-lg hover:shadow-[var(--color-accent)]/25 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    See My AI Visibility Report
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-[var(--color-bg-dark-card)] rounded-2xl p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-6">
                  Your Estimate
                </p>
                {results ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-red-200 font-bold mb-3">
                          Current Gap
                        </p>
                        <div className="mb-3">
                          <p className="text-xs text-white/80 mb-1">Customers / mo</p>
                          <p className="text-2xl font-bold text-red-400">{results.lostCustomers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/80 mb-1">Revenue / mo</p>
                          <p className="text-2xl font-bold text-red-400">{results.lostRevenue}</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-green-200 font-bold mb-3">
                          With Our Help
                        </p>
                        <div className="mb-3">
                          <p className="text-xs text-white/80 mb-1">Customers / mo</p>
                          <p className="text-2xl font-bold text-green-400">
                            up to {results.gainedCustomers}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/80 mb-1">Revenue / mo</p>
                          <p className="text-2xl font-bold text-green-400">
                            up to {results.gainedRevenue}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/40 mb-6 leading-relaxed">
                      Estimates only. Results vary by business, market, and platform changes. We
                      don&apos;t guarantee outcomes.
                    </p>

                    <div
                      className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-[var(--color-hero-subtext)] leading-relaxed [&_strong]:text-white [&_strong]:font-semibold [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: results.insight }}
                    />

                    {results.needsAiCheck && (
                      <div className="bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 rounded-xl p-4 mb-6 text-sm text-white leading-relaxed">
                        <strong className="block mb-1 text-white">
                          We&apos;ll run the AI check for you.
                        </strong>
                        Your free report includes live ChatGPT, Claude, and Google AI Overviews
                        queries for your business + niche. See exactly who&apos;s being cited (and
                        why it&apos;s not you).
                      </div>
                    )}

                    <a
                      href="/#hero-email"
                      className="block w-full text-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-4 px-6 rounded-xl font-semibold transition-colors"
                    >
                      Get My Free Reviews + AI Visibility Report
                    </a>
                    <p className="text-xs text-white/35 text-center mt-3">
                      No credit card. We&apos;ll show you exactly what to fix first.
                    </p>
                  </>
                ) : (
                  <div className="py-12 text-center text-[var(--color-hero-subtext)] leading-relaxed">
                    Select your industry to see how much revenue your current reviews and ranking
                    are costing you each month.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(45, 106, 79, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(45, 106, 79, 0.3);
        }
      `}</style>
    </section>
  );
}
