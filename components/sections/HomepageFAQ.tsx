import Link from "next/link";

const ITEMS = [
  {
    q: "What exactly do you do for $149?",
    a: "We fix everything Google and AI look at before recommending a local business. That means correcting your Google listing — hours, services, photos, service area, business description. We update your website so it matches your Google listing exactly. We submit your business to the top directories so your information is consistent everywhere. And we send your first review request campaign to your past customers. You give us access, we handle everything. You get a before/after report showing exactly what changed.",
  },
  {
    q: "Will you break my email?",
    a: "No — and this is the first thing we check. Your email and your website are two completely separate things, like your phone number and your mailing address. Before we touch anything, we check exactly where your email lives. If it's on Google Workspace, Microsoft 365, or similar — which most businesses are — moving or updating your website does nothing to your email. We've never broken a client's email and we verify this upfront before any work starts.",
  },
  {
    q: "Do I need to give you my passwords?",
    a: "We need access to two things: your Google Business listing and your website backend. For Google, you add us as a manager on your listing — you stay the owner, we just get permission to make updates. For your website, you give us a login. You can remove our access any time. We never store passwords or share access with anyone outside our team.",
  },
  {
    q: "Is there a contract?",
    a: "No contract, ever. Get Found is a one-time payment — done. Stay Found and Always Ready are month-to-month. Cancel any time, no notice required, no cancellation fee. We keep clients by getting results, not by trapping them.",
  },
  {
    q: "How is this different from just doing it myself?",
    a: "You can do most of this yourself — Google's tools are free and public. The problem is the time, the consistency, and knowing what actually matters. Most business owners start, get busy, and stop. Google and AI reward businesses that stay active consistently. We handle all 12 signals every month so nothing drifts. If you have 3–4 hours a week to spend on this, do it yourself. If you don't, we're $59/mo.",
  },
  {
    q: "How long before I see results?",
    a: "The fixes from Get Found go live within 48 hours. Google typically takes 1–2 weeks to fully register the changes across its systems. Review velocity builds over 30–60 days as your first review campaign gets responses. Most clients see meaningful movement in their visibility within the first month. We show you the before/after report so you can see exactly what changed from day one.",
  },
  {
    q: "Do you guarantee results?",
    a: "We don't guarantee a specific ranking or a specific number of reviews — nobody can honestly do that. What we guarantee is that every fix in your report gets done, done correctly, and done within 48 hours. We also guarantee that if something isn't right, we fix it. No arguing, no tickets, no runaround. If you don't see movement within 30 days on Stay Found, tell us and we'll dig into why.",
  },
] as const;

export function HomepageFAQ() {
  return (
    <section
      id="faq-home"
      aria-labelledby="faq-home-title"
      className="bg-(--color-bg-page) py-15 md:py-25"
    >
      <div className="mx-auto max-w-3xl px-6">

        <div className="mb-10 text-center">
          <h2
            id="faq-home-title"
            className="text-3xl font-bold text-text-body md:text-4xl"
          >
            Questions we actually get asked
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            No fine print. No runaround.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {ITEMS.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg-page)">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5 hover:text-(--color-accent-hover)"
          >
            More questions? See the full FAQ
            <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
