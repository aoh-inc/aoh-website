export type ChannelKey =
  | "linkedin-company"
  | "linkedin-personal"
  | "facebook"
  | "instagram"
  | "x"
  | "google";

export type Channel = {
  key: ChannelKey;
  label: string;
  color: string;
};

export const CHANNELS: Channel[] = [
  { key: "linkedin-company", label: "LinkedIn — Company", color: "#0A66C2" },
  { key: "linkedin-personal", label: "LinkedIn — Personal", color: "#0A66C2" },
  { key: "facebook", label: "Facebook Page", color: "#1877F2" },
  { key: "instagram", label: "Instagram", color: "#E4405F" },
  { key: "x", label: "X / Twitter", color: "#000000" },
  { key: "google", label: "Google Business Profile", color: "#34A853" },
];

export type Theme = {
  slug: string;
  title: string;
  posts: Partial<Record<ChannelKey, string>>;
};

const linkedinPersonalIntro = (s: string) => s; // currently identical to company copy

export const THEMES: Theme[] = [
  {
    slug: "star-sweet-spot",
    title: "Star sweet spot — 4.6 > 5.0",
    posts: {
      "linkedin-company": `Every owner I talk to wants a 5.0 rating. Five round stars, nothing under.

Here's the part most of them haven't heard: customers don't trust 5.0.

Northwestern's Spiegel Center studied how shoppers actually behave on review pages. Conversion peaks somewhere between 4.2 and 4.7, then drops above that. A 5.0 with 30 reviews converts worse than a 4.6 with 30 reviews. Same volume, fewer customers calling.

Why? Because people have been on the internet long enough to know perfect doesn't happen. If everybody loved you, somebody's brother-in-law is writing reviews. They click past you.

The sweet spot is 4.6–4.8 with at least 25–50 reviews. Looks great, reads as real.

You don't need to chase perfect. You need to be visibly good — with enough reviews to prove it.

aioutsourcehub.com`,
      facebook: `Customers don't trust a 5.0. They trust 4.6.

Northwestern research found conversion peaks at 4.2–4.7 and drops above that. A perfect rating reads as fake, no matter how clean your work is.

The sweet spot: 4.6–4.8 with at least 25–50 reviews. That's the rating range that says "real business, mostly excellent, occasionally has a bad day."

You don't need to be perfect. You need to be visibly good, consistently.`,
      instagram: `Customers don't trust 5.0 stars.

Research: conversion peaks at 4.6–4.8, then drops. Perfect rating = looks fake.

You don't need to chase perfect. You need to be visibly good.

#LocalBusiness #SmallBusinessTips #Reviews #LocalSEO #GoogleReviews #SmallBiz #LocalMarketing`,
      x: `Customers don't trust 5.0. They trust 4.6.

Northwestern research: conversion peaks between 4.2 and 4.7, then drops.

A 5.0 with 30 reviews converts WORSE than a 4.6 with 30 reviews.

Stop chasing perfect.`,
      google: `Customers don't trust a perfect 5.0 rating — research from Northwestern shows conversion actually peaks at 4.6–4.8 and drops above that. The sweet spot is 4.6–4.8 with at least 25–50 reviews. Looks great, reads as real. You don't need to be perfect — you need to be visibly good, consistently.`,
    },
  },
  {
    slug: "cost-of-dormant-profile",
    title: "Cost of a dormant profile — $38,400/yr",
    posts: {
      "linkedin-company": `$38,400 a year.

That's what a Harvard Business School study (Luca 2016, updated through 2024) suggests a local service business loses when its review velocity drifts and a competitor stays disciplined.

Take a typical local business: $480K annual revenue, 4.6 stars, 142 reviews. A competitor across town moves from 4.5 to 4.7 over six months. Their map rank rises, yours decays.

Roughly 8% of organic discovery shifts away from you.

8% of $480K = $38,400.

That's not the missing review you didn't get last week. It's the cumulative absence of every review you didn't collect over a multi-year window while a competitor did.

The gap doesn't close. It widens.

Want this run on your real numbers? Free calculator: aioutsourcehub.com`,
      facebook: `$38,400/year.

That's what one Harvard study suggests a local business loses when reviews go quiet and a competitor keeps asking. 8% of organic traffic shifts. That's the math.

The structural cost isn't the one review you missed. It's every review you didn't collect while a competitor did — compounding for years.`,
      instagram: `$38,400/year.

That's the math on letting your reviews go stale while a competitor stays disciplined.

Not a fee. Not a marketing cost. Pure revenue walking out the door.

#LocalBusiness #GoogleReviews #SmallBiz #ReviewMarketing #LocalSEO #SmallBusinessOwner`,
      x: `$38,400/year.

That's roughly what a local business loses when reviews go quiet and a competitor stays disciplined.

Not a marketing expense. Pure revenue walking out.

Run the math: aioutsourcehub.com`,
      google: `$38,400/year — that's roughly what a typical local business loses when reviews go quiet and a competitor stays disciplined. 8% of organic discovery shifts away. The structural cost isn't the one review you missed. It's every review you didn't collect while a competitor did. Run the math on your business at aioutsourcehub.com.`,
    },
  },
  {
    slug: "review-velocity-90-day",
    title: "90-day rule — 60 fresh > 200 old",
    posts: {
      "linkedin-company": `A business with 60 reviews from the last 90 days outranks one with 200 reviews from five years ago. Same neighborhood, same service. The first one looks alive. The second one looks abandoned.

Google has never published the exact formula, but reviews from the last 90 days carry significantly more weight than older ones. Map rankings respond fast — sometimes within days — when a steady cadence of fresh reviews hits a profile.

Most owners I talk to have a beautiful 4.8 average with 187 reviews. Then I scroll down to the dates. The newest one is from eight months ago. The one before that, a year before that.

To Google's eye, that business has gone quiet. To a customer's eye, the same thing — they look at the dates and start wondering if you're still open.

You don't need a review every week. You need a cadence that says "this business is operating." 2–6 new reviews a month, spread out, from real recent customers.

That's the entire 90-day rule.`,
      facebook: `60 fresh reviews beat 200 old ones.

Google weights review recency heavily — reviews from the last 90 days carry significantly more weight than older ones. A profile with the newest review from 2022 reads as dormant, no matter how high the star average.

Steady drip beats burst. 2–6 a month, every month.`,
      instagram: `60 new > 200 old.

Google weights review freshness over total count. If your last review is from 2022, you look dormant — no matter how clean the star average.

The 90-day rule decides your rank.

#LocalSEO #GoogleReviews #SmallBusiness #LocalMarketing #ReviewStrategy`,
      x: `60 fresh reviews beat 200 old ones.

Google weights review freshness. If your last review is from 2022, your rank is decaying — no matter how clean your average.

2–6 new reviews a month, steady. That's the rule.`,
      google: `60 fresh reviews from the last 90 days outrank 200 old ones from five years ago. Google heavily weights review recency. A profile with the newest review from 2022 reads as dormant. 2–6 new reviews a month, steady — that's the entire 90-day rule.`,
    },
  },
  {
    slug: "ai-recommendation-vs-rank",
    title: "AI recommendation > Google rank #1",
    posts: {
      "linkedin-company": `For 20 years, local search worked one way. You optimized for Google, aimed for the first page, hoped customers clicked.

That's changing. A growing share of customers don't search Google at all anymore. They ask ChatGPT or Claude. They see Google's own AI summary at the top of the page.

The AI doesn't return ten links. It returns a recommendation — one to three businesses by name, with a sentence about each.

Here's where the math gets interesting:

A Google click is the start of a journey. The customer still has to scan your page, decide to call, and follow through. Local services convert that journey at 3–8% on average.

A ChatGPT recommendation is the end of the journey. The AI already endorsed you. Trust is transferred. The competitor scan is over.

Those conversions land closer to 18–30%.

A ChatGPT recommendation isn't traffic. It's a customer who's already most of the way to picking up the phone.

aioutsourcehub.com`,
      facebook: `A Google click is the start of a journey. A ChatGPT recommendation is the end of one.

When ChatGPT says "I'd recommend Acme Plumbing — they're highly rated and handle emergencies" — that's not traffic. That's a customer already most of the way to picking up the phone.

Conversion rates land 3–5× higher than Google clicks.`,
      instagram: `Google rank #1 = clicks.

ChatGPT recommendation = the customer.

When AI names your business out loud, you skip the comparison. The competitor scan is over before it starts.

#AIVisibility #LocalSEO #ChatGPT #SmallBusiness #LocalBusiness #DigitalMarketing`,
      x: `Google rank #1 captures clicks.

ChatGPT recommendation captures the customer.

A click is the start of a journey (3–8% convert).
A name-by-name recommendation is the end of one (18–30%).

Different game.`,
      google: `A Google click is the start of a journey. A ChatGPT recommendation is the end of one. When AI names your business out loud, the customer is already most of the way to calling — conversion rates land 3–5× higher than Google clicks. Different game, different math.`,
    },
  },
  {
    slug: "diy-vs-dfy",
    title: "DIY software vs Done-for-you",
    posts: {
      "linkedin-company": `"Why am I paying you $49 a month when I can buy software that does the same thing for $30?"

It's a fair question. Here's the honest answer.

The $30 software works. The price is real. What's not advertised is the rest of the cost:

— 2–6 hours of setup
— Monthly maintenance (templates, sender info, troubleshooting)
— Actually triggering the requests (manual entry or POS sync that breaks)
— SMS carrier compliance paperwork

Six months in, most owners I see have spent $180 in software fees + 8 hours of their time, and added maybe 12 reviews — mostly in the first two months. Then it sits idle.

Done-for-you over the same six months: $294 in fees, 1 hour of your time total, 50–80 reviews steady throughout.

Cost per actual new review:
DIY: $15 (including your time at $50/hr)
Done-for-you: $5

The price difference is $19 a month. The work difference is roughly all of it.

Software gives you a tool. Done-for-you gives you the result.

aioutsourcehub.com`,
      facebook: `The $30 software isn't cheaper if nobody runs it.

Out of pocket on DIY: $180 in fees + 8 hours of your time over 6 months = ~12 reviews.

Done-for-you over the same 6 months: $294 in fees, 1 hour of your time, 50–80 reviews.

Cost per actual new review: $15 DIY vs $5 done-for-you.

You're not buying software. You're buying the result.`,
      instagram: `$30 software vs $49 done-for-you.

Both real. The work difference is all of it.

DIY: $15 per review (including your time).
DFY: $5 per review.

Cheap isn't cheaper if nobody runs it.

#SmallBusinessOwner #LocalBusiness #ReviewMarketing #DoneForYou #SmallBiz`,
      x: `$30 software vs $49 done-for-you.

Cost per actual review:
DIY: $15 (incl. your time)
DFY: $5

Software gives you a tool. Done-for-you gives you the result.`,
      google: `$30 software vs $49 done-for-you. Both real prices. The difference: $180 in DIY fees + 8 hours of your time over 6 months = ~12 reviews. Done-for-you over the same 6 months: $294 in fees, 1 hour of your time, 50–80 reviews. You're not buying software. You're buying the result.`,
    },
  },
  {
    slug: "after-hours-payback",
    title: "After-hours calls — 30-day payback",
    posts: {
      "linkedin-company": `7:43pm. The phone rings.

You're home. The dog needs walking. The shop closed at 6.

You let it go to voicemail. Maybe you'll listen later. You don't.

That call was somebody who needed what you sell, right now, tonight. By the time you check voicemail at 8am, they've already called the next business on the list. The next one picked up.

Here's the math:

Most local businesses get 15–30 after-hours calls a week. 60–70% go to voicemail. Maybe 20% leave a real message. Maybe half of those still need what they called about by the time you call back.

You're catching about 1 in 10 after-hours calls. Nine in ten are gone before you knew they existed.

If one job is worth $300–$2,000, three missed jobs a month is $2,400+ walking out the door.

An AI receptionist at $499/month needs to catch one extra job to break even. That's a single service call.

In most local businesses I look at, that payback lands inside 30 days.

aioutsourcehub.com`,
      facebook: `You catch about 1 in 10 after-hours calls. Nine in ten are gone before you knew they existed.

Most local businesses get 15–30 a week. 60–70% go to voicemail. Most customers won't leave one.

If one job is worth $500, an AI receptionist that catches one extra call a month already paid for itself. Most pay back in 30 days.`,
      instagram: `You catch 1 in 10 after-hours calls.

The other 9 went to your competitor.

An AI receptionist that catches just ONE extra job a month pays for itself in 30 days.

#LocalBusiness #SmallBusinessTips #AIReceptionist #HVAC #Plumbing #LocalServices`,
      x: `You catch 1 in 10 after-hours calls. The other 9 went to your competitor.

An AI receptionist that catches ONE extra job a month pays for itself. Most do in 30 days.`,
      google: `You catch about 1 in 10 after-hours calls. Nine in ten go to a competitor. An AI receptionist that catches just one extra job a month pays for itself — most local businesses see payback inside 30 days. Stop losing the calls that already wanted you.`,
    },
  },
  {
    slug: "ai-search-share",
    title: "AI search — 1 in 4 local queries",
    posts: {
      "linkedin-company": `About 1 in 4 local searches has moved to AI.

Not in two years. Right now. ChatGPT, Claude, Google's AI summary at the top of search results — they're already answering the high-intent questions.

"Best plumber in Hartford for an old house."
"What's the best vet near me for a senior dog?"
"Recommend an auto shop that handles older Volvos."

These used to scroll past ten blue links. Now the customer gets a paragraph with one to three business names and a recommendation. If you're not in that paragraph, you don't exist.

The share of AI-answered search is overweighted on the most valuable queries. The customer asking ChatGPT for a specific recommendation is way more likely to book than the customer browsing page two of Google.

Most local businesses are invisible there.

The fix isn't more Google ads. It's getting your business set up so AI tools can confidently recommend you. Clean profile. Consistent info everywhere. Fresh reviews. A few small AI-friendly bits on your site.

We handle the whole thing. aioutsourcehub.com`,
      facebook: `Roughly 1 in 4 local searches has moved to AI.

ChatGPT, Claude, Google's AI summary — they answer with one to three business names instead of ten links. If you're not in that answer, you don't exist.

Most local businesses are invisible there. The fix isn't more ads. It's getting found by the AI.`,
      instagram: `1 in 4 local searches has moved to AI.

ChatGPT recommends 1–3 businesses by name. No list, no scrolling, no second chance.

If you're not the name AI says, you don't exist.

#AIVisibility #ChatGPT #LocalBusiness #LocalSEO #DigitalMarketing #AISearch`,
      x: `1 in 4 local searches now happens on AI tools.

ChatGPT names 1–3 businesses by name. No list. No scroll. No second chance.

Most local businesses are invisible there. Right now.`,
      google: `About 1 in 4 local searches has moved to AI tools — ChatGPT, Claude, Google's AI summary. They answer with 1–3 business names instead of 10 links. If you're not in that answer, you don't exist. Most local businesses are invisible there. The fix isn't more ads.`,
    },
  },
  {
    slug: "software-vs-work",
    title: "Software vs work — zero dashboards",
    posts: {
      "linkedin-company": `Owner pulls up the dashboard of the marketing tool they're paying for. They log in. Look at me. Sigh.

"I bought this a year ago. I think it's supposed to send review requests? I haven't opened it in six months."

This is the rule, not the exception.

Marketing software dashboards assume you're somebody who opens dashboards every day, enjoys configuring templates, notices when settings need adjusting. That's a job description. It describes a marketing manager.

It does NOT describe most local business owners. You're scheduling jobs, managing a team, fixing problems that come up at 4pm Friday. You're not pulling up a marketing dashboard Tuesday morning to tweak SMS send timing.

Done-for-you flips the model. Instead of "here's a dashboard," it's "we run this for you." Instead of a monthly software fee plus your time, it's a monthly service fee — and you don't think about it.

Zero dashboards. Reviews still come in. Calls still get answered. AI visibility still gets handled.

You stay in your business. We run the AI.

aioutsourcehub.com`,
      facebook: `The marketing tool you bought a year ago that you haven't opened in six months isn't a marketing tool anymore. It's a $79/month bill.

Software dashboards were designed for marketing managers. They don't describe local business owners. You don't have time to tweak SMS send timing on Tuesday morning.

Done-for-you = we run the work, not the tool. Zero dashboards.`,
      instagram: `The marketing tool you haven't opened in 6 months isn't a tool anymore.

It's a $79/month bill.

Done-for-you = zero dashboards. Zero tweaking. Just results.

#DoneForYou #SmallBusinessOwner #LocalBusiness #MarketingAutomation #SmallBiz`,
      x: `That marketing tool you haven't opened in 6 months isn't a tool. It's a bill.

Software dashboards were built for marketing managers. Not for owners running a business.

Done-for-you = zero dashboards.`,
      google: `The marketing tool you bought a year ago and haven't opened in 6 months isn't a tool anymore — it's a bill. Software dashboards were built for marketing managers. Done-for-you flips the model: we run the work, not the tool. Zero dashboards. You stay in your business.`,
    },
  },
  {
    slug: "reviews-compound",
    title: "Reviews compound — 10+ years",
    posts: {
      "linkedin-company": `A new patient is worth somewhere between $1,500 and $3,500 to a dental practice in the first year. After that, if they stay, they're worth several hundred to a few thousand a year — for the next 10 to 20 years.

Most dentists already know this.

What they don't always realize is that the cheapest way to acquire that patient is the one most of them have stopped doing: asking for reviews.

Ads stop the moment you stop paying. The next patient costs another $400. No compounding.

A review left by a happy patient in 2026 is still in your Google profile in 2036. Still being read by prospective patients searching at midnight Tuesday. Still helping you rank for "dentist near me."

Reviews are a stock, not a flow. The review you collect today still pays you ten years from now.

Ads are a tax. Reviews are an investment.

aioutsourcehub.com`,
      facebook: `Ads stop the day you stop paying.

A review left by a happy customer in 2026 is still in your Google profile in 2036 — still bringing in calls, free, with no ad spend.

Reviews are the only marketing asset that compounds. Ads are a tax. Reviews are an investment.`,
      instagram: `Ads stop when you stop paying.

A review left today still pays you in 2036.

Reviews are the only marketing asset that compounds.

#GoogleReviews #SmallBusiness #LocalBusiness #ReviewMarketing #LocalSEO`,
      x: `Ads stop the day you stop paying.

A review you collect today still pays you in 2036.

Reviews are the only marketing asset that compounds.`,
      google: `Ads stop the day you stop paying. A review you collect today is still in your Google profile in 2036 — still bringing in calls, free, with no ad spend. Reviews are the only marketing asset that compounds. Ads are a tax. Reviews are an investment.`,
    },
  },
  {
    slug: "trade-yelp-trap",
    title: "Yelp ads trap — $30–80/lead",
    posts: {
      "linkedin-company": `Most HVAC and plumbing owners have paid for Yelp ads at some point. The pitch is compelling — appear at the top, beat the competition.

The reality:

— Yelp's local share is small. Most emergency searches happen on Google
— Cost per lead is $30–$80
— Leads aren't exclusive. The same emergency customer is calling four businesses
— Cancelling is painful. Yelp's contract structure has burned more than a few owners

Even when Yelp ads work, they stop the day you stop paying. You're renting visibility. Every month is a fresh bill for the same lead flow.

Reviews are the opposite. You "pay" once — by asking the customer at the end of the job. The review keeps pulling in calls for years. It also makes your Google profile rank above the businesses paying Yelp.

You don't need Yelp ads. You don't need to pay for leads. You need the ask to actually happen, every job, automatically.

aioutsourcehub.com`,
      facebook: `Yelp ads rent visibility. Reviews own it.

$30–$80 per lead, leads aren't exclusive, and the moment you stop paying, the calls stop.

A review you "pay for" by asking the customer once keeps pulling in calls for years — AND makes your Google profile rank above the businesses paying Yelp.`,
      instagram: `Yelp ads rent visibility.

Reviews own it.

$30–$80/lead vs ask once and it pays for years.

#HVAC #Plumbing #LocalServices #SmallBusiness #LocalSEO #Trades`,
      x: `Yelp ads rent visibility. Reviews own it.

$30–$80/lead, non-exclusive, dies the day you stop paying.

Reviews: ask once, paid forever, and outrank Yelp.`,
      google: `Yelp ads rent visibility. Reviews own it. $30–$80 per lead, non-exclusive, and the calls stop the day you stop paying. A review you "pay for" by asking once keeps pulling in calls for years — AND makes your Google profile outrank the businesses paying Yelp.`,
    },
  },
  {
    slug: "med-spa-math",
    title: "Med spa — 1 missed review = 4 bookings",
    posts: {
      "linkedin-company": `A woman in her thirties is on her phone Tuesday night. She's been thinking about Botox for six months. She finally decided this is the week.

She taps your med spa first. Star rating looks fine. But the most recent review is from eight months ago. She scrolls. The one before that is from a year and a half ago.

She backs out.

She taps the second one. 4.8 stars, 73 reviews, most recent from last week. She reads three of them. She books.

That was a $400 first appointment, the start of a $2,000-per-year client. Lost in 90 seconds, before you knew she existed.

One missed review is doing more damage than it looks. That review would have:

1. Pushed your most-recent-review date forward
2. Gotten you past whatever review-count threshold mattered for the next 10 customers
3. Added one specific, story-shaped review that built trust
4. Boosted your map rank

Stack the math. One missing review = roughly four lost bookings.

aioutsourcehub.com`,
      facebook: `She wanted Botox. She picked your med spa first.

But your most recent review was from eight months ago. She backed out. Tapped the next one. Booked.

That was $400 first appointment + $2,000/year. Lost in 90 seconds.

One missing review = roughly four lost bookings. The math compounds.`,
      instagram: `She wanted Botox.

She picked your profile first.

Last review: 8 months ago. She backed out. Booked next door.

One missed review = four lost bookings.

#MedSpa #MedSpaMarketing #Botox #LocalBusiness #ReviewMarketing #SmallBiz`,
      x: `A first-time Botox client = $400 visit + ~$2,000/yr.

She picks you first. Last review is 8 months old. She backs out. Books next door.

One missed review = roughly four lost bookings.`,
      google: `A first-time Botox client is worth $400 today plus ~$2,000/year for years. She picks your med spa first — but your most recent review is 8 months old. She backs out, books next door. One missed review = roughly four lost bookings. The math compounds.`,
    },
  },
  {
    slug: "groomer-trust",
    title: "Pet groomers — under 20 reviews = no booking",
    posts: {
      "linkedin-company": `If you've groomed dogs for any length of time, you already know something other industries don't: your customers aren't buying a haircut. They're handing you their family member for an hour and trusting you not to traumatize them.

That trust doesn't come from your prices, your website, or your years in business. It comes from other pet parents saying "she was so good with my dog, he actually loves going now."

Pet parents read for empathy. Generic 5-star reviews don't move the needle nearly as much as one specific story does.

The number of reviews matters too — most pet parents won't book under 20 reviews. But after that, what the reviews SAY matters more than how many.

Best way to get the right kind of reviews:

Ask at pickup, when the dog looks great. The customer is happy, the dog is happy, they have 30 seconds of post-grooming joy. Hand them their phone with the review form open. "If you have a second — it means everything to us."

That's it. Don't say "five stars please." Don't offer a discount.

A pickup ask converts at 30–50%. A two-day-later text converts at 5–10%. Timing is everything.

aioutsourcehub.com`,
      facebook: `Pet parents don't book under 20 reviews. After that, what the reviews SAY matters most.

Generic 5-star reviews don't move the needle. Stories do.

Best way to get them: ask at pickup, while the dog still looks great. 30 seconds. One tap. The customer is glowing. So is the dog.`,
      instagram: `Pet parents don't book under 20 reviews.

After that, what the reviews SAY matters most.

Stories beat generic 5-stars. Always.

#PetGrooming #DogGrooming #PetBusiness #SmallBusinessOwner #LocalBusiness`,
      x: `Pet parents don't book under 20 reviews.

After that, what the reviews SAY matters more than how many.

Stories beat generic 5-stars. Every time.`,
      google: `Pet parents don't book a groomer under 20 reviews. After that, what the reviews SAY matters more than how many. Generic 5-stars don't move the needle — stories do. Ask at pickup, while the dog still looks great. 30 seconds. One tap. The customer is glowing. So is the dog.`,
    },
  },
];

// Default LinkedIn-personal reuses the company copy. Slot left empty in data
// because GHL can post the same text to multiple LinkedIn accounts in one
// scheduled post.
THEMES.forEach((t) => {
  if (!t.posts["linkedin-personal"] && t.posts["linkedin-company"]) {
    t.posts["linkedin-personal"] = linkedinPersonalIntro(t.posts["linkedin-company"]!);
  }
});

export function scheduledDateFor(weekIndex: number): Date {
  // First post Wed 2026-05-13 09:00 America/New_York (== 13:00 UTC during EDT)
  const start = new Date("2026-05-13T13:00:00Z");
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + weekIndex * 7);
  return d;
}

export function formatSchedule(d: Date): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
  return fmt.format(d);
}

export function cardUrlFor(themeSlug: string, origin = ""): string {
  return `${origin}/api/social-card/${themeSlug}`;
}
