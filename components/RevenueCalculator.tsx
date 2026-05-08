"use client";

import { useState, useEffect } from "react";

// Industry data: { avgTransaction, monthlyVolume, benchmark_reviews, label }
const industries: Record<string, { avg: number; vol: number; benchmark: number; label: string }> = {
  petgroomer:    { avg: 70,     vol: 180, benchmark: 85,  label: "pet groomers" },
  vet:           { avg: 290,    vol: 220, benchmark: 120, label: "vet practices" },
  autoshop:      { avg: 480,    vol: 160, benchmark: 140, label: "auto repair shops" },
  funeral:       { avg: 9500,   vol: 12,  benchmark: 60,  label: "funeral homes" },
  moving:        { avg: 2100,   vol: 35,  benchmark: 95,  label: "moving companies" },
  seniorliving:  { avg: 4800,   vol: 40,  benchmark: 75,  label: "senior living facilities" },
  marketing:     { avg: 3200,   vol: 8,   benchmark: 45,  label: "marketing consultants" },
  b2b:           { avg: 2400,   vol: 15,  benchmark: 55,  label: "B2B service businesses" },
};

// Traffic share by ranking position (Google local pack + maps)
const rankingTraffic: Record<number, number> = {
  1: 1.00, 2: 0.78, 3: 0.61,
  4: 0.38, 5: 0.28, 6: 0.21,
  7: 0.15, 8: 0.11, 9: 0.08, 10: 0.06,
  11: 0.04, 12: 0.03, 13: 0.03, 14: 0.02, 15: 0.02,
  16: 0.02, 17: 0.01, 18: 0.01, 19: 0.01, 20: 0.01
};

export function RevenueCalculator() {
  const [industry, setIndustry] = useState("");
  const [reviews, setReviews] = useState(18);
  const [stars, setStars] = useState(3.8);
  const [ranking, setRanking] = useState(8);
  const [results, setResults] = useState<{
    lostCustomers: string;
    lostRevenue: string;
    gainRevenue: string;
    insight: string;
  } | null>(null);

  const updateSliders = () => {
    // Star display logic handled in render
  };

  const calculate = () => {
    if (!industry) return;

    const ind = industries[industry];
    const reviewsNum = reviews;
    const starsNum = stars;
    const rankingNum = ranking;

    // === CALCULATION LOGIC ===

    // 1. Star rating impact on conversion
    // Harvard: each 1-star increase = 5-9% revenue increase
    // BrightLocal: 3.3 stars = minimum threshold, 4.2+ = trust zone
    let starPenalty = 0;
    if (starsNum < 3.3) starPenalty = 0.55;
    else if (starsNum < 3.7) starPenalty = 0.35;
    else if (starsNum < 4.0) starPenalty = 0.20;
    else if (starsNum < 4.2) starPenalty = 0.10;
    else if (starsNum < 4.5) starPenalty = 0.04;
    else starPenalty = 0;

    // 2. Review count impact
    // BrightLocal: avg consumer reads 7 reviews before trusting. Under 20 = low trust.
    const reviewRatio = Math.min(reviewsNum / ind.benchmark, 1);
    const reviewPenalty = Math.max(0, (1 - reviewRatio) * 0.30); // up to 30% loss

    // 3. Ranking impact — traffic lost vs #1
    const currentTraffic = rankingTraffic[Math.min(rankingNum, 20)];
    const trafficLoss = 1 - currentTraffic; // fraction of potential traffic not getting

    // Combined penalty
    const totalPenalty = Math.min(0.90, trafficLoss * 0.6 + starPenalty * 0.25 + reviewPenalty * 0.15);

    // Revenue calculations
    const baseRevenue = ind.avg * ind.vol;
    const lostRevenue = Math.round(baseRevenue * totalPenalty / 100) * 100;
    const lostCustomers = Math.round(ind.vol * totalPenalty);
    const gainRevenue = Math.round(baseRevenue * 0.85 / 100) * 100; // 85% potential

    // Format numbers
    const fmt = (n: number) => n >= 1000 ? '$' + (n/1000).toFixed(1) + 'K' : '$' + n;

    // Insight text
    let insight = '';
    const topBusiness = ind.benchmark;

    if (reviewsNum < 20) {
      insight = `<strong>Your review count is the biggest issue.</strong> The top ${ind.label} in your area average ${topBusiness}+ reviews. At ${reviewsNum}, most customers see your listing and move on — they can't tell if you're good or just new.`;
    } else if (rankingNum > 5) {
      insight = `<strong>Your ranking position is costing you the most.</strong> Businesses in positions #1–3 capture ${Math.round(rankingTraffic[1]*100)}% of local search clicks. At position #${rankingNum}, you're getting roughly ${Math.round(currentTraffic*100)}% of that traffic. Most customers never see you.`;
    } else if (starsNum < 4.0) {
      insight = `<strong>Your star rating is your biggest conversion killer.</strong> 94% of consumers won't consider a business under 4.0 stars. At ${starsNum.toFixed(1)}, you're visible — but customers are choosing your competitors instead.`;
    } else {
      insight = `<strong>You're closer than most.</strong> A few targeted improvements to your review velocity and ranking could recover most of that ${fmt(lostRevenue)}/month. The gap between where you are and your potential is smaller than you think.`;
    }

    setResults({
      lostCustomers: lostCustomers + '/mo',
      lostRevenue: fmt(lostRevenue) + '/mo',
      gainRevenue: fmt(gainRevenue) + '/mo',
      insight,
    });
  };

  useEffect(() => {
    calculate();
  }, [industry, reviews, stars, ranking]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-[var(--color-bg-page)] scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
              Free Estimate
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-body)] mb-3">
              See what your reviews are costing you every month
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-2xl mx-auto">
              Enter your business details below. We'll show you how much revenue your current review count and ranking is leaving on the table.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
          {/* Industry */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
              What type of business do you run?
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text-body)] bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6072' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '40px',
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

          {/* Reviews */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
              How many Google reviews do you currently have? <span className="font-normal text-[var(--color-text-muted)]">({reviews})</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="300"
                value={reviews}
                onChange={(e) => setReviews(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-lg font-bold text-[var(--color-text-body)] min-w-[60px] text-right">
                {reviews}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
              <span>0 reviews</span>
              <span>300+ reviews</span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
              What's your current average star rating?
            </label>
            <div className="flex items-center gap-4">
              <input
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
            <div className="flex mt-3">
              {renderStars(stars)}
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
              <span>1 star</span>
              <span>5 stars</span>
            </div>
          </div>

          {/* Ranking */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[var(--color-text-body)] mb-3">
              Where do you typically rank on Google Maps for your main service? <span className="text-xs font-normal text-[var(--color-text-muted)]">(e.g. "auto repair near me")</span>
            </label>
            <div className="flex items-center gap-4">
              <input
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
            </div>

            {/* Results */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-[var(--color-bg-dark-card)] rounded-2xl p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-6">
                  Your Estimate
                </p>
                {results ? (
                  <>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-white/45 mb-1">Customers lost per month</p>
                        <p className="text-3xl font-bold text-red-400">{results.lostCustomers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/45 mb-1">Revenue left on the table</p>
                        <p className="text-3xl font-bold text-red-400">{results.lostRevenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/45 mb-1">Potential with top rankings</p>
                        <p className="text-3xl font-bold text-green-400">{results.gainRevenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/45 mb-1">AOH costs as little as</p>
                        <p className="text-3xl font-bold text-green-400">$1<span className="text-base font-medium">/day</span></p>
                      </div>
                    </div>
                    <div
                      className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-[var(--color-hero-subtext)] leading-relaxed [&_strong]:text-white [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: results.insight }}
                    />
                    <button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-4 px-6 rounded-xl font-semibold transition-colors">
                      Get My Free Marketing Report — No Credit Card
                    </button>
                    <p className="text-xs text-white/35 text-center mt-3">
                      We'll audit your business and show you exactly what to fix first
                    </p>
                  </>
                ) : (
                  <div className="py-12 text-center text-[var(--color-hero-subtext)] leading-relaxed">
                    Select your industry to see how much revenue your current reviews and ranking are costing you each month.
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