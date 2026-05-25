import type { NextConfig } from "next";

const MC_HOST = "mc.getmefound.ai";
const PUBLIC_HOSTS = ["getmefound.ai", "www.getmefound.ai"];

const mcHostMatch = [{ type: "host" as const, value: MC_HOST }];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/agent/slack": [
      "./docs/client-ops-ledger/agent-jobs.csv",
      "./docs/client-ops-ledger/sending-domain-readiness.csv",
      "./docs/client-ops-ledger/reach-warmup-autopilot.json",
      "./docs/client-ops-ledger/daily-brief-current.md",
      "./docs/client-ops-ledger/outbox/reach-*-quality-*.md",
      "./tmp-reach-*.csv",
      "./tmp-reach-*-report.json",
    ],
  },
  async redirects() {
    return [
      ...PUBLIC_HOSTS.flatMap((host) => [
        {
          source: "/mike-mc",
          destination: `https://${MC_HOST}/mike-mc`,
          permanent: false,
          has: [{ type: "host" as const, value: host }],
        },
        {
          source: "/mike-mc/:path*",
          destination: `https://${MC_HOST}/mike-mc/:path*`,
          permanent: false,
          has: [{ type: "host" as const, value: host }],
        },
      ]),
      { source: "/checkout/review-power", destination: "/checkout/stay-found", permanent: true },
      { source: "/checkout/review-power/", destination: "/checkout/stay-found", permanent: true },
      { source: "/checkout/get-chosen", destination: "/checkout/stay-found", permanent: true },
      { source: "/checkout/get-chosen/", destination: "/checkout/stay-found", permanent: true },
      { source: "/checkout/ai-ready-bundle", destination: "/checkout/always-ready", permanent: true },
      { source: "/checkout/ai-ready-bundle/", destination: "/checkout/always-ready", permanent: true },
      { source: "/control", destination: "/mike-mc", permanent: true },
      { source: "/control/", destination: "/mike-mc", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/", destination: "/about", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/faqs/", destination: "/faq", permanent: true },
      {
        source: "/team",
        destination: "/about",
        permanent: true,
        missing: [{ type: "host", value: "mc.getmefound.ai" }],
      },
      {
        source: "/team/",
        destination: "/about",
        permanent: true,
        missing: [{ type: "host", value: "mc.getmefound.ai" }],
      },
      { source: "/why-ai", destination: "/pricing#always-ready", permanent: true },
      { source: "/why-ai/", destination: "/pricing#always-ready", permanent: true },
      { source: "/zemfar-why-ai", destination: "/pricing#always-ready", permanent: true },
      { source: "/zemfar-why-ai-v2", destination: "/pricing#always-ready", permanent: true },
      { source: "/ai-voice-agents", destination: "/pricing#always-ready", permanent: true },
      { source: "/ai-voice-agents/", destination: "/pricing#always-ready", permanent: true },
      { source: "/reviews", destination: "/pricing#stay-found", permanent: true },
      { source: "/reviews/", destination: "/pricing#stay-found", permanent: true },
      { source: "/ai-visibility", destination: "/pricing#always-ready", permanent: true },
      { source: "/ai-visibility/", destination: "/pricing#always-ready", permanent: true },
      { source: "/relay", destination: "/pricing#always-ready", permanent: true },
      { source: "/relay/", destination: "/pricing#always-ready", permanent: true },
      { source: "/studio", destination: "/pricing", permanent: true },
      { source: "/studio/", destination: "/pricing", permanent: true },
      { source: "/rankings", destination: "/pricing#always-ready", permanent: true },
      { source: "/rankings/", destination: "/pricing#always-ready", permanent: true },
      { source: "/success-stories", destination: "/blog", permanent: true },
      { source: "/success-stories/", destination: "/blog", permanent: true },
      { source: "/blog/google-vs-chatgpt-where-buyers-land", destination: "/blog/why-chatgpt-recommends-by-name", permanent: true },
      { source: "/blog/google-vs-chatgpt-where-buyers-land/", destination: "/blog/why-chatgpt-recommends-by-name", permanent: true },
      { source: "/blog/what-chatgpt-sees-when-it-looks-at-your-business", destination: "/blog/why-chatgpt-recommends-by-name", permanent: true },
      { source: "/blog/what-chatgpt-sees-when-it-looks-at-your-business/", destination: "/blog/why-chatgpt-recommends-by-name", permanent: true },
      { source: "/ai-powered-services", destination: "/", permanent: true },
      { source: "/ai-powered-services/", destination: "/", permanent: true },
      { source: "/ai-powered-services-old", destination: "/", permanent: true },
      { source: "/ai-products-services", destination: "/", permanent: true },
      { source: "/ai-automations", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/privacy-policy/", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/terms-and-conditions/", destination: "/terms", permanent: true },
      { source: "/terms-and-disclosures", destination: "/terms", permanent: true },
      { source: "/terms-and-disclosures/", destination: "/terms", permanent: true },
      { source: "/review-boost", destination: "/pricing#stay-found", permanent: true },
      { source: "/review-boost/", destination: "/pricing#stay-found", permanent: true },
      { source: "/custom-solutions", destination: "/contact", permanent: true },
      { source: "/custom-solutions/", destination: "/contact", permanent: true },

      { source: "/:slug(zemfar-.*)", destination: "/", permanent: true },

      { source: "/service/:path*", destination: "/", permanent: true },
      { source: "/service_category/:path*", destination: "/", permanent: true },
      { source: "/product/:path*", destination: "/", permanent: true },
      { source: "/product-category/:path*", destination: "/", permanent: true },
      { source: "/product-tag/:path*", destination: "/", permanent: true },
      { source: "/portfolio/:path*", destination: "/", permanent: true },
      { source: "/portfolio_category/:path*", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/tag/:path*", destination: "/", permanent: true },
      { source: "/elementskit-content/:path*", destination: "/", permanent: true },
      { source: "/header/:path*", destination: "/", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/mike-mc", has: mcHostMatch },
        { source: "/ops", destination: "/mike-mc/ops", has: mcHostMatch },
        { source: "/jobs", destination: "/mike-mc/jobs", has: mcHostMatch },
        { source: "/jobs/:path*", destination: "/mike-mc/jobs/:path*", has: mcHostMatch },
        { source: "/campaigns", destination: "/mike-mc/campaigns", has: mcHostMatch },
        { source: "/team", destination: "/mike-mc/team", has: mcHostMatch },
      ],
    };
  },
};

export default nextConfig;
