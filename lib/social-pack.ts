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
  { key: "linkedin-company", label: "LinkedIn â€” Company", color: "#0A66C2" },
  { key: "linkedin-personal", label: "LinkedIn â€” Personal", color: "#0A66C2" },
  { key: "facebook", label: "Facebook Page", color: "#1877F2" },
  { key: "instagram", label: "Instagram", color: "#E4405F" },
  { key: "x", label: "X / Twitter", color: "#000000" },
  { key: "google", label: "Google Business Profile", color: "#34A853" },
];

export type ImageVariant = {
  label: string;
  path: string; // route path returning PNG
};

export type Theme = {
  slug: string;
  title: string;
  posts: Partial<Record<ChannelKey, string>>;
  blogPath?: string; // /blog/<slug>
  images?: ImageVariant[]; // multiple variants when present
};

export const THEMES: Theme[] = [
  {
    slug: "star-sweet-spot",
    title: "Star sweet spot â€” 4.6 > 5.0",
    blogPath: "/blog/46-beats-50-star-rating-sweet-spot",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/star-sweet-spot" }],
    posts: {
      "linkedin-company": `A 5.0 rating is hurting your bookings.

Northwestern's Spiegel Research Center pulled the data: purchase likelihood peaks between 4.6 and 4.8 stars. After 4.8, conversions actually drop. Buyers read perfect ratings as fake, paid, or filtered.

Here's the part most owners miss. A 4.6 with 30 real reviews outconverts a 5.0 with 30 reviews on the exact same search. The shopper sees the 1-star, reads how you handled it, and trusts you more, not less.

So the goal isn't a clean 5.0. The goal is volume, recency, and a couple of imperfect reviews that prove you're real.

That's what we run for clients. Review Automation is $49/mo, no setup fee. We ask every customer at the right moment, route the unhappy ones to you privately, and let the rest flow to Google. Most clients add 8 to 15 reviews in the first 30 days.

Full breakdown of the math: https://aioutsourcehub.com/blog/46-beats-50-star-rating-sweet-spot

What's your current star rating, and how many reviews are behind it?`,
      "linkedin-personal": `I tell clients to stop chasing 5.0.

Spent last Tuesday on a call with a dentist who was proud of a perfect rating. 22 reviews, all five stars, newest one from January. I told him his profile reads fake to anyone under 40. He pushed back. So I pulled up a competitor down the road, 4.7 with 180 reviews, newest one yesterday. He was quiet for a second.

Northwestern's research has been clear on this for years. Conversions peak at 4.6 to 4.8. Past that, trust drops. Buyers assume the perfect profile is scrubbed.

We run Review Automation for $49/mo. No setup. It asks at the right moment, filters the angry ones to you privately, and pushes the rest to Google. Clients land in the sweet spot inside a quarter.

The blog has the full Spiegel data: https://aioutsourcehub.com/blog/46-beats-50-star-rating-sweet-spot

Curious what other owners think: is a 5.0 a brag or a red flag?`,
      facebook: `Your 5.0 rating might be costing you bookings.

Buyers don't trust perfect. Northwestern research shows conversions peak at 4.6 to 4.8 stars. Past that, people assume the reviews are fake or filtered.

A 4.7 with fresh reviews beats a 5.0 with 20 old ones every time.

We run Review Automation for $49/mo. No setup fee. Asks every customer, filters the unhappy ones to you privately, sends the rest to Google. Clients hit the sweet spot inside 60-90 days.

Read how it works: https://aioutsourcehub.com/pricing#review-automation`,
      instagram: `4.6 outsells 5.0.

Northwestern's research caught what owners miss. Buyers don't trust perfect. They trust real. A 4.7 with 80 fresh reviews and a couple of imperfect ones converts better than a flawless profile with 25 old ones.

The fix is volume and recency, not a clean sweep.

Review Automation is $49/mo, no setup. We ask every customer at the right moment so the reviews actually land. Most clients add 10-15 in the first month.

Tap our bio link â†’ "Review Automation pricing." See the $49/mo math.`,
      x: `Your 5.0 rating is a red flag, not a brag.

Northwestern: conversions peak at 4.6 to 4.8 stars. Past that, trust drops. Buyers assume perfect = filtered.

A 4.7 with 80 reviews beats a 5.0 with 25, every time.

Review Automation $49/mo, no setup.

Price the fix â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `A perfect 5.0 might be costing you bookings.

Northwestern research shows conversions peak at 4.6-4.8 stars. Past that, buyers assume reviews are fake.

A 4.7 with 80 fresh reviews beats a 5.0 with 25 old ones.

Review Automation is $49/mo, no setup. Asks every customer, filters unhappy ones to you, sends the rest to Google.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/46-beats-50-star-rating-sweet-spot`,
    },
  },

  {
    slug: "cost-of-dormant-profile",
    title: "Cost of a dormant profile â€” $38,400/yr",
    blogPath: "/blog/real-cost-missed-google-review",
    images: [{ label: "Big stat", path: "/api/social-card/cost-of-dormant-profile" }],
    posts: {
      "linkedin-company": `A dormant Google profile is $38,400/year.

Harvard Business School (Luca, 2016): a one-star bump = 5 to 9% revenue lift. Run that backwards. A $480K local business losing 8% of organic discovery to the competitor down the road with fresher reviews = $38,400 walking out the door every year.

That's not theoretical. That's the customer who pulled up two profiles, picked the one with 12 reviews from the last 30 days, and never saw yours.

Most owners don't see this because the loss is invisible. No one calls to say "I picked your competitor because your newest review was from 2023." They just don't call.

Review Automation is $49/mo, no setup. We ask every customer at the right moment, filter complaints to you privately, and route the rest to Google. Clients pull 10 to 15 new reviews in month one.

Full Luca study breakdown: https://aioutsourcehub.com/blog/real-cost-missed-google-review

Run yours: https://aioutsourcehub.com/#calculator

What's the last date on your newest Google review?`,
      "linkedin-personal": `I ran the numbers on a dormant Google profile last week.

HVAC company, $620K/year, 47 reviews, newest one 14 months old. Owner thought reviews were "set it and forget it." I plugged his numbers into our calculator. He was bleeding $49,600 a year to a competitor with disciplined reviews.

The Harvard data (Luca, 2016) is brutal: a 1-star delta = 5-9% revenue swing. Dormant profile vs. active competitor isn't a tie. It's a margin transfer.

Worst part: it's invisible. The customer doesn't tell you they passed. They just call someone else.

We fix this with Review Automation, $49/mo, no setup. Asks every customer, filters the angry ones to you, sends the rest to Google. Clients add 10-15 reviews in month one.

Run the math yourself: https://aioutsourcehub.com/#calculator

Blog with the full Harvard breakdown: https://aioutsourcehub.com/blog/real-cost-missed-google-review

Honest question for the owners here: when's the last time you looked at your newest review's date?`,
      facebook: `A dormant Google profile is costing you $38,400/year.

Harvard study (Luca, 2016): a one-star difference = 5-9% revenue. A $480K business losing 8% of customers to a competitor with fresher reviews loses $38,400/year. Quietly. The customer just calls someone else.

Run your number: https://aioutsourcehub.com/#calculator

We fix this for $49/mo, no setup. Review Automation asks every customer, filters complaints to you privately, sends the rest to Google.`,
      instagram: `Your dormant Google profile is leaking $38K a year.

Harvard study, 2016: a one-star difference equals 5-9% of revenue. A $480K business losing 8% of organic discovery = $38,400 gone. Quietly. No phone call. The customer just picked the competitor with fresher reviews.

The fix is $49/mo. Review Automation, no setup. We ask every customer at the right moment so the reviews actually come in.

Tap bio â†’ "Lost-Revenue Calculator." 30 seconds to run yours.`,
      x: `Your dormant Google profile is bleeding $38,400/year.

Harvard study: 1-star revenue swing = 5-9% of top line.

Customer never tells you they passed. They just call someone else.

Review Automation $49/mo, no setup.

Run your loss â†’ https://aioutsourcehub.com/#calculator`,
      google: `Your dormant Google profile is costing you real revenue.

Harvard study: a 1-star bump = 5-9% revenue. A $480K business losing 8% of discovery to a fresher competitor = $38,400/year.

The customer never calls to say they passed. They just call someone else.

Review Automation, $49/mo, no setup. We ask every customer, filter unhappy ones to you, send the rest to Google.

Calculator: https://aioutsourcehub.com/#calculator
Pricing: https://aioutsourcehub.com/pricing#review-automation`,
    },
  },

  {
    slug: "review-velocity-90-day",
    title: "90-day rule â€” 60 fresh > 200 old",
    blogPath: "/blog/review-velocity-90-day-rule",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/review-velocity-90-day" }],
    posts: {
      "linkedin-company": `60 fresh reviews beat 200 old ones.

Google's local algorithm weights recency. Heavily. A profile with 60 reviews from the last 90 days outranks the one with 200 reviews from 2019-2022. Same town, same category. The dormant one looks closed, even when it isn't.

We see this every week with clients. New customer onboards with 140 lifetime reviews and a newest-date from 2023. Within 90 days of running Review Automation, they're sitting on 40-60 fresh reviews and their map-pack position has moved 2-3 spots. Same business, same service. Different signal.

Review Automation is $49/mo, no setup. We ask every customer at the moment they're most likely to leave one, filter unhappy customers to you privately, and route the rest to Google.

Full breakdown of the 90-day math: https://aioutsourcehub.com/blog/review-velocity-90-day-rule

Run yours: https://aioutsourcehub.com/#calculator

What's the date on your most recent Google review?`,
      "linkedin-personal": `A plumber called me last month. 240 lifetime reviews, 4.8 stars, sitting in position 6 in the map pack.

He thought his reviews were "great." I pulled his profile. His newest review was 11 months old. The guy in position 1? 90 reviews, 4.6 stars, newest one 3 days ago. Half the lifetime volume, fresher signal, twice the leads.

Google's local algorithm doesn't care about your career total. It cares about the last 90 days. A dormant profile reads closed.

We onboarded him. Review Automation, $49/mo, no setup. Sixty days in he had 38 new reviews and moved to position 3. Same business. Different velocity.

The full 90-day rule breakdown: https://aioutsourcehub.com/blog/review-velocity-90-day-rule

Run your own math: https://aioutsourcehub.com/#calculator

For the owners here: is "lifetime review count" the metric you obsess over, or are you tracking last 90 days?`,
      facebook: `60 fresh reviews beat 200 old ones.

Google weights recency hard. A profile with the newest review from 2022 reads dormant, even at 4.9 stars. The map pack picks the business with momentum, not the one with history.

Review Automation, $49/mo, no setup. We ask every customer at the right moment so new reviews keep landing.

Run your lost-revenue number: https://aioutsourcehub.com/#calculator

Full breakdown: https://aioutsourcehub.com/blog/review-velocity-90-day-rule`,
      instagram: `60 fresh reviews beat 200 old ones.

A plumber I onboarded had 240 lifetime reviews and sat at position 6 in the map pack. His newest was 11 months old. The shop at position 1? Half his lifetime count, newest review 3 days ago.

Google's local algorithm weights the last 90 days, not your career total.

Review Automation. $49/mo, no setup. We ask every customer at the right moment. Most clients move 2-3 map slots in a quarter.

Tap link in bio â†’ run your lost-revenue number.`,
      x: `60 reviews from the last 90 days beat 200 from 2019.

Google weights recency. Your "lifetime review count" is a vanity number â€” the algorithm only checks the last 90 days.

Review Automation $49/mo, no setup.

Start the systematic ask â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `60 reviews from the last 90 days beat 200 reviews from five years ago.

Google weights recency. A dormant profile reads closed, even at 4.9 stars.

Review Automation, $49/mo, no setup. Systematic ask, filters complaints to you privately, sends the rest to Google. Most clients hit the velocity threshold inside one quarter.

Calculator: https://aioutsourcehub.com/#calculator
Pricing: https://aioutsourcehub.com/pricing#review-automation`,
    },
  },

  {
    slug: "ai-recommendation-vs-rank",
    title: "AI recommendation > Google rank #1",
    blogPath: "/blog/why-chatgpt-recommends-by-name",
    images: [{ label: "Big stat", path: "/api/social-card/ai-recommendation-vs-rank" }],
    posts: {
      "linkedin-company": `Google gives you 10 links. ChatGPT picks 1 to 3 by name.

Different game entirely. The conversion math tells the story: a Google click converts at 3 to 8%. A ChatGPT or Claude recommendation converts at 18 to 30%. When the AI says "I'd go with these three," the user has already filtered. They're not browsing. They're buying.

Most local businesses are invisible in AI results because AI doesn't crawl your site the way Google does. It assembles answers from structured signals: schema, citations, review velocity, third-party mentions, and how clearly your offer is described in machine-readable terms. Pretty website, weak signal.

AI Visibility is $179/mo + $199 setup. We audit what AI currently knows about your business, fix the schema and citations, and rebuild your presence so the answer engines pick you when a customer asks "best plumber near me."

Full breakdown of the AI vs. Google math: https://aioutsourcehub.com/blog/why-chatgpt-recommends-by-name

Run your numbers: https://aioutsourcehub.com/#calculator

Have you searched your own business in ChatGPT yet? What did it say?`,
      "linkedin-personal": `I ran an experiment with a dental practice last month.

Asked ChatGPT: "best family dentist in [their town]." It named three practices. Theirs wasn't one of them. The owner was stunned. They've been in business 18 years, top reviewed in town on Google. AI didn't know they existed in a useful way.

This is the gap nobody is talking about. Google sends 10 links and lets the user sort. AI sends 1-3 names and the user trusts them. A Google click converts at 3-8%. An AI recommendation converts at 18-30%. Different game.

We run AI Visibility for $179/mo + $199 setup. We fix the schema, citations, and structured signals so the answer engines pick you. The dental practice above? Ranking in ChatGPT's top 3 for their town inside 8 weeks.

Blog with the full math: https://aioutsourcehub.com/blog/why-chatgpt-recommends-by-name

Calculator: https://aioutsourcehub.com/#calculator

Try this now: ask ChatGPT to recommend your category in your town. Are you in the top 3? Honest answers welcome.`,
      facebook: `ChatGPT only names 1-3 businesses. Google lists 10.

When AI recommends you by name, the customer converts at 18-30%. A Google click? 3-8%. The customer isn't browsing AI results, they're buying.

Most local businesses are invisible in AI search. Different signals, different game.

AI Visibility, $179/mo + $199 setup. We fix the schema, citations, and structured signals so answer engines pick you.

Try it yourself: ask ChatGPT to recommend your business category in your town. Are you named?

Run the test, then see the fix: https://aioutsourcehub.com/pricing#ai-visibility
Full breakdown: https://aioutsourcehub.com/blog/why-chatgpt-recommends-by-name`,
      instagram: `Google lists 10. AI picks 3.

A Google click converts at 3-8%. An AI recommendation converts at 18-30%. When ChatGPT names you, the customer isn't shopping. They're buying.

Most local businesses are invisible to AI because AI reads structured signals, not pretty websites.

AI Visibility $179/mo + $199 setup. We fix what answer engines look at so you get named.

Tap bio â†’ "AI Visibility pricing." Or run this test now: ask ChatGPT for the best [your category] in your town. See if you exist.`,
      x: `Google lists 10 links. ChatGPT picks 1-3 by name.

Google click converts at 3-8%. AI recommendation converts at 18-30%.

Different game. Most local businesses are invisible in AI.

AI Visibility $179/mo + $199 setup. We fix what AI reads.

See what we fix â†’ https://aioutsourcehub.com/pricing#ai-visibility`,
      google: `Google lists 10 results. ChatGPT picks 1-3 by name.

AI traffic converts at 18-30%. Google clicks convert at 3-8%. Different game, different signals.

AI Visibility, $179/mo + $199 setup. We audit what AI knows about your business, fix the schema and citations, and rebuild your structured presence.

Test yourself: ask ChatGPT for the best [your category] in your town. Are you named?

Pricing: https://aioutsourcehub.com/pricing#ai-visibility
Full breakdown: https://aioutsourcehub.com/blog/why-chatgpt-recommends-by-name`,
    },
  },

  {
    slug: "diy-vs-dfy",
    title: "DIY software vs Done-for-you",
    blogPath: "/blog/diy-review-tools-vs-done-for-you",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/diy-vs-dfy" }],
    posts: {
      "linkedin-company": `DIY review software costs $15 per review. We charge $5.

Math, not opinion. The $30/mo DIY tool works fine on paper. Six months in, here's the real ledger we see across clients who switched: 8 hours of owner time, broken POS sync that nobody fixed, SMS compliance still unfinished, and 12 reviews total. With owner time costed at $50/hr, that's $580 of cost for 12 reviews. $15 per review.

Done-for-you over the same six months: $294 in fees, one hour of owner time, 50-80 reviews. $5 per review. And no dashboard to log into.

The software isn't the problem. The work is. Tools don't do the work. People do.

Review Automation is $49/mo, no setup. We do the work. Most clients land 10-15 reviews in month one and 50-80 by month six.

Full DIY vs. DFY breakdown: https://aioutsourcehub.com/blog/diy-review-tools-vs-done-for-you

If the math surprises you, the $49/mo done-for-you alternative is at https://aioutsourcehub.com/pricing#review-automation`,
      "linkedin-personal": `Owner asked me last week: "Why am I paying $49/mo when I can buy software for $30?"

I told him the software wasn't the problem. The work was. Then I pulled up his account. He'd had the $30 tool for 7 months. Connected once. SMS compliance unfinished. POS integration broken since March. 14 reviews total.

Did the math with him. With his time costed at $50/hr (he runs a $400K plumbing operation, his time is worth more than that), the DIY tool cost him $14 per review when you factor in the 8 hours he'd burned on it.

We onboarded him. First 30 days: 11 new reviews. Zero hours of his time. He texted me last week: "I didn't realize software was the expensive option."

Review Automation, $49/mo, no setup. We do the work. The math is at https://aioutsourcehub.com/blog/diy-review-tools-vs-done-for-you

Real question for the owners here: how many marketing tools do you own that you haven't logged into this quarter?`,
      facebook: `That $30/mo review software is costing you $15 per review.

Math: 6 months in, most DIY users have 8 hours sunk, broken POS sync, SMS compliance unfinished, and 12 reviews. At $50/hr for your time, that's $15 per review.

We charge $5 per review. Done-for-you, no dashboard, no setup time.

Review Automation, $49/mo: https://aioutsourcehub.com/pricing#review-automation

Full math: https://aioutsourcehub.com/blog/diy-review-tools-vs-done-for-you`,
      instagram: `DIY review software: $15 per review.
Done-for-you: $5 per review.

The software isn't the problem. The work is. Six months of "free" software adds up to 8 hours of your time, broken integrations, and 12 reviews to show for it.

We do the work. Review Automation $49/mo, no setup, no dashboard.

Tap bio â†’ "Review Automation pricing." See the $49/mo math.`,
      x: `Your "$30/mo" review software is actually costing you $48 per review.

6 months in: 8 hours of your time, broken POS sync, SMS compliance unfinished, 12 reviews total.

Done-for-you over the same 6 months: $5 per review.

Review Automation $49/mo, no setup.

Price the done-for-you â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `DIY review software costs $15 per review. We charge $5.

Six months of "free" software = 8 hours of your time, broken integrations, 12 reviews. We deliver 50-80 reviews in the same period. No dashboard, no setup.

Review Automation, $49/mo, no setup fee.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/diy-review-tools-vs-done-for-you`,
    },
  },

  {
    slug: "after-hours-payback",
    title: "After-hours calls â€” 30-day payback",
    blogPath: "/blog/after-hours-calls-ai-receptionist",
    images: [
      { label: "Photo + overlay", path: "/api/social-photo/after-hours-payback" },
      { label: "7:15pm story", path: "/api/social-card-story/after-hours-payback" },
    ],
    posts: {
      "linkedin-company": `9 of 10 after-hours calls go to your competitor.

Not because your service is worse. Because nobody picked up.

Tuesday 7:15pm in Southington, CT. A homeowner just got home from work. Her lawn is overgrown. She's hosting her daughter's graduation party Saturday. She calls 3 lawn services. First two ring through to voicemail. Third one picks up.

Third one wins the cut, the cleanup, AND the recurring seasonal contract.

That's the math local service businesses lose every week:

â€¢ 15-30 after-hours calls is a normal week
â€¢ Most go to voicemail
â€¢ Most callers won't leave one
â€¢ You catch about 1 in 10

For a shop like Bill at Southington Lawn Service, one missed Saturday-rush call is $200 in mowing plus a $1,800 annual contract walking next door.

Run your own numbers in 30 seconds: https://aioutsourcehub.com/#calculator

Relay is our phone answering service. Answers, qualifies the lead, books into your calendar. Introduces itself as an AI assistant; transfers to a human if the caller asks. $299/mo + $299 setup. Most clients break even in month one.

See if Relay pays for itself in your industry: https://aioutsourcehub.com/pricing#relay

(Per-vertical breakdown in the first comment.)`,
      "linkedin-personal": `9 of 10 after-hours calls go to your competitor.

Not because your service is worse. Because nobody picked up.

Tuesday 7:15pm in Southington, CT. A homeowner just got home from work, lawn's overgrown, hosting a graduation party Saturday. She calls 3 lawn services. First two: voicemail. Third one picks up.

Third one wins the $200 cut, the cleanup, and the $1,800 recurring contract. The first two never knew she called.

Run your own numbers in 30 seconds: https://aioutsourcehub.com/#calculator

I built Relay because I watched too many local-business owners lose to *availability*, not skill. Operators like Bill at Southington Lawn Service. Phones are still the buy button for lawn care, trades, vets, med spas. The buyer doesn't wait.

One question that comes up in every demo: "won't customers hate that it's a bot?" Relay introduces itself as an AI assistant. If they want a human, it transfers. About 80% don't ask â€” they just want their question answered.

$299/mo, $299 setup. Most clients break even the first month.

See Relay direct: https://aioutsourcehub.com/pricing#relay

If you run a local service business, what does your after-hours call volume actually look like?`,
      facebook: `Tuesday 7:15pm. A homeowner in Southington, CT just got home from work. Lawn's overgrown. Daughter's graduation party Saturday. She calls 3 lawn services.

First two: voicemail.
Third one picks up.

Third one wins $200 in mowing plus an $1,800 annual contract.

9 of 10 after-hours calls go to your competitor. Not because your service is worse. Because nobody picked up.

Run yours in 30 seconds: https://aioutsourcehub.com/#calculator

This is why we built Relay. A phone answering service that catches every call, qualifies the lead, books into your calendar. Introduces itself as AI. Transfers to a human if asked. $299/mo, payback in 30 days for most.

See Relay: https://aioutsourcehub.com/pricing#relay`,
      instagram: `Tuesday 7:15pm. She calls 3 lawn services. First two: voicemail. Third one picks up â€” and wins $200 + an $1,800 contract.

9 of 10 after-hours calls go to your competitor.

See your monthly loss: aioutsourcehub.com/#calculator

#LocalBusiness #LawnCare #SmallBusinessOwner #LocalServices`,
      x: `9 of 10 after-hours calls go to your competitor.

Not because your service is worse. Because nobody picked up.

Tuesday 7:15pm. Homeowner calls 3 lawn services. Two: voicemail. Third picks up â€” wins $200 + an $1,800 contract.

Relay (phone answering service) catches every call. $299/mo.

See your loss â†’ aioutsourcehub.com/#calculator`,
      google: `Tuesday 7:15pm. A homeowner just got home from work. Lawn is overgrown, hosting a party Saturday. She calls 3 lawn services. First two: voicemail. Third one picks up â€” and wins the cut, the cleanup, and the $1,800 contract.

9 of 10 after-hours calls go to your competitor. Not because your service is worse. Because nobody picked up.

Run yours in 30 seconds: https://aioutsourcehub.com/#calculator

Relay is our phone answering service. Catches every call, qualifies the lead, books into your calendar. Introduces itself as AI; transfers to a human if asked. $299/mo + $299 setup, 750 minutes included. Most clients break even in month one.

See Relay: https://aioutsourcehub.com/pricing#relay`,
    },
  },

  {
    slug: "ai-search-share",
    title: "AI search â€” 1 in 4 local queries",
    blogPath: "/blog/ai-visibility-vs-seo",
    images: [{ label: "Big stat", path: "/api/social-card/ai-search-share" }],
    posts: {
      "linkedin-company": `1 in 4 local searches has moved to AI.

ChatGPT, Claude, Google AI Overviews, Perplexity. Roughly 25% of local search volume now happens in answer engines instead of the classic 10-blue-links. The split is higher in high-intent queries: "best dentist near me," "plumber that does emergency repair," "med spa with weekend hours." Those are the queries that close.

Most local businesses have zero strategy for it. Their SEO agency optimized for Google. Their content team optimized for social. Nobody is optimizing for the answer engines that now field a quarter of their highest-value searches.

AI Visibility is $179/mo + $199 setup. We audit what AI currently knows about your business across ChatGPT, Claude, Perplexity, and Google AI Overviews. We fix the schema, citations, and structured signals so the answer engines actually pick you. Most clients show up in the top 3 named recommendations inside 60-90 days.

Full breakdown of AI visibility vs. classic SEO: https://aioutsourcehub.com/blog/ai-visibility-vs-seo

When's the last time you searched your own business in ChatGPT? What did you find?`,
      "linkedin-personal": `I asked a roofer last month how much of his lead flow comes from AI search.

He laughed. "AI? Nobody's using AI to find a roofer."

We checked his Google Search Console. Then we ran the same queries he ranks for through ChatGPT and Perplexity. About 22% of his target query volume now happens in answer engines. He had no presence in any of them. Competitor 3 miles away was named in every single one.

This is the shift nobody is preparing for. Classic SEO still matters, but the share is moving. About 1 in 4 local searches now happens in AI. Those queries skew higher intent. He was invisible in his highest-value channel.

We run AI Visibility for $179/mo + $199 setup. Fixed signals, structured presence, named in answer engines inside 60-90 days for most.

Full blog: https://aioutsourcehub.com/blog/ai-visibility-vs-seo

Honest question for the owners here: have you ever asked ChatGPT to recommend your category in your town? What did it say?`,
      facebook: `1 in 4 local searches is now happening in AI.

ChatGPT, Claude, Perplexity, Google AI Overviews. About 25% of search has moved. The share is higher on high-intent queries (the ones that actually convert).

If your SEO is set up for Google only, you're invisible in a quarter of your market.

AI Visibility, $179/mo + $199 setup. We fix the structured signals AI uses to pick businesses.

Full breakdown: https://aioutsourcehub.com/blog/ai-visibility-vs-seo

Pricing: https://aioutsourcehub.com/pricing#ai-visibility`,
      instagram: `1 in 4 people looking for your business are asking ChatGPT instead of Googling.

Try it right now. Ask ChatGPT: "best [your category] in [your town]."

If you're not in the top 3 names, you're invisible to 25% of your highest-value market.

AI Visibility. $179/mo + $199 setup. We fix the schema and citations so answer engines pick you. Most clients are named in top 3 inside 90 days.

Tap bio â†’ "AI Visibility pricing." See what the fix looks like.`,
      x: `1 in 4 local searches has moved to AI.

ChatGPT. Claude. Google AI Overviews. The share is higher on high-intent queries (the ones that close).

If your SEO is Google-only, you're invisible in 25% of your market.

AI Visibility $179/mo + $199 setup.

See the fix â†’ https://aioutsourcehub.com/pricing#ai-visibility`,
      google: `About 1 in 4 local searches has moved to AI: ChatGPT, Claude, Perplexity, Google AI Overviews.

The share is higher on high-intent queries. If your SEO is set up for Google only, you're invisible in a quarter of your highest-value market.

AI Visibility, $179/mo + $199 setup. We fix the structured signals AI uses.

Pricing: https://aioutsourcehub.com/pricing#ai-visibility
Full breakdown: https://aioutsourcehub.com/blog/ai-visibility-vs-seo`,
    },
  },

  {
    slug: "software-vs-work",
    title: "Software vs work â€” zero dashboards",
    blogPath: "/blog/why-smb-owners-hate-marketing-software",
    images: [{ label: "Big stat", path: "/api/social-card/software-vs-work" }],
    posts: {
      "linkedin-company": `That marketing tool you bought a year ago isn't a tool. It's a $79/month bill.

Honest question for the owners reading this: how many marketing software subscriptions are you paying for right now? How many have you logged into this quarter? For most local businesses we onboard, the answer is 4-7 tools, 1-2 logins per quarter.

Here's why. Software dashboards were designed for marketing managers. You don't have a marketing manager. You have a business to run, a phone that rings, a schedule that fills, and 14 things more important than logging into a dashboard.

Done-for-you means zero dashboards. We run the work. You get the result. No login, no setup wizard, no "have you tried our new feature" email.

Full Service is $999/mo + $999 setup. Reviews, AI visibility, content, ads, the Full Service handled. Most clients cancel 3-5 software subscriptions inside the first 90 days because they don't need them anymore. Net cost: lower than what they were already paying.

Full breakdown: https://aioutsourcehub.com/blog/why-smb-owners-hate-marketing-software

How many marketing tools are sitting in your credit card statement that you haven't opened in 3 months?`,
      "linkedin-personal": `I sat down with an HVAC owner last week and asked him to list every marketing tool he was paying for.

He counted on his fingers. Got to 6. Then remembered a 7th. Total monthly burn: $431 in software he hadn't opened since February. Cumulative since he signed up: $14,000+.

This is the local business tragedy nobody talks about. Software companies sold owners on "automation" and what owners got was a dashboard nobody has time to use. The tools work fine. The work doesn't get done. Different thing.

We pulled his tools, cancelled 5 of them, and rolled him onto Full Service at $999/mo + $999 setup. Net monthly: he saved $200 and got reviews, content, ads, and AI visibility actually handled.

Full breakdown of why software keeps failing local owners: https://aioutsourcehub.com/blog/why-smb-owners-hate-marketing-software

Be honest: how many marketing subscriptions are sitting on your card right now that you haven't opened in 90 days?`,
      facebook: `That marketing tool on your credit card isn't a tool. It's a $79 bill you haven't opened since February.

Most local owners we audit are paying $300-500/mo for software dashboards built for marketing managers they don't have.

Full Service is $999/mo + $999 setup. Reviews, AI visibility, content, ads â€” all run for you. Most clients cancel 3-5 tools in the first 90 days and pay less than they were before.

See what we'd handle for you â†’ https://aioutsourcehub.com/pricing#full-service`,
      instagram: `Your marketing software isn't a tool. It's a bill.

Dashboards were designed for marketing managers. You're a business owner. Different job.

Done-for-you means zero dashboards. We do the work.

Full Service $999/mo + $999 setup. Reviews, AI visibility, content, ads. Most clients cancel 3-5 software tools after onboarding.

Tap bio â†’ "Full Service pricing." See what you'd cancel.`,
      x: `That marketing tool you bought a year ago isn't a tool. It's a $79 bill.

Software dashboards were built for marketing managers. You don't have one.

Done-for-you = zero dashboards. Full Service $999/mo, or pick one service from $49.

See what you'd cancel â†’ https://aioutsourcehub.com/pricing#full-service`,
      google: `Your marketing software isn't a tool. It's a bill you're not using.

Software dashboards were built for marketing managers. You don't have one. Done-for-you means we do the work, you get the result, no logins.

Full Service: $999/mo + $999 setup. Or pick one service at a lower tier.

Pricing: https://aioutsourcehub.com/pricing#full-service
Full breakdown: https://aioutsourcehub.com/blog/why-smb-owners-hate-marketing-software`,
    },
  },

  {
    slug: "reviews-compound",
    title: "Reviews compound â€” 10+ years",
    blogPath: "/blog/dental-practices-reviews-compounding-asset",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/reviews-compound" }],
    posts: {
      "linkedin-company": `Ads stop the day you stop paying. Reviews compound for ten years.

A Google review you collect in 2026 is still in your profile in 2036. It's still ranking you. It's still convincing the customer who pulls up your map listing eight years from now. Reviews are a stock. Ads are a flow.

Run the math on a dental practice. 80 reviews collected this year at an average revenue contribution of $400/review (conservative, given lifetime patient value). That's $32,000 of trust-asset created in year one. In year five, those same reviews are still on your profile, still earning. The ROI on review acquisition keeps stacking. The ROI on a Google ad ends the moment the campaign pauses.

Review Automation is $49/mo, no setup. Most clients add 50-80 reviews/year. Treat reviews like a capital investment, not a marketing expense.

Read the math on why review assets compound for a decade: https://aioutsourcehub.com/blog/dental-practices-reviews-compounding-asset

Then price the $49/mo automation that starts your stack: https://aioutsourcehub.com/pricing#review-automation`,
      "linkedin-personal": `The smartest local owner I know thinks of reviews like a 401k.

He's a dentist outside Hartford. Every patient gets asked. Every single one. He's been doing it for 11 years. His profile has 840 reviews, newest one yesterday. New patients tell him they picked him because his profile "felt like a real practice." That's compounded trust. He can't be unseated by a competitor opening up next year because they're starting from zero.

Most owners treat reviews like a chore. He treats them like capital. Every review he collected in 2018 is still working for him today. Every Google ad he ran in 2018 stopped working the second he turned it off.

We run Review Automation for $49/mo, no setup, for owners who want to start compounding. The systematic ask is the lever.

Blog with the full math: https://aioutsourcehub.com/blog/dental-practices-reviews-compounding-asset

For the owners here: if you stopped all your marketing tomorrow, which asset would still be earning in 2036?`,
      facebook: `Ads stop the day you stop paying. Reviews work for 10 years.

A review collected today is still in your Google profile in 2036, still ranking you, still convincing customers. Reviews are a stock. Ads are a flow.

Review Automation, $49/mo, no setup. Most clients add 50-80 reviews/year.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/dental-practices-reviews-compounding-asset`,
      instagram: `The review you collect today is still earning in 2036.

The ad you ran last week stopped the second you paused it.

A dentist outside Hartford has 840 reviews from 11 years of asking. Newest one yesterday. Competitors opening today can't catch him in their first 5 years.

That's a moat, not a marketing line item.

Review Automation. $49/mo, no setup. Most clients add 50-80 reviews/year.

Tap bio â†’ "Review Automation pricing." Start compounding for $49/mo.`,
      x: `The review you collect today is still earning in 2036.

The ad you ran last week is already dead.

Reviews are a stock. Ads are a flow. Most owners spend 80% of their budget on flow, 0% on stock.

Review Automation $49/mo, no setup.

Start compounding â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `Reviews compound. Ads don't.

A review collected today is still in your Google profile in 2036, still ranking and converting. Ads stop the day you stop paying.

Review Automation, $49/mo, no setup. Start treating reviews like capital, not chores.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/dental-practices-reviews-compounding-asset`,
    },
  },

  {
    slug: "med-spa-math",
    title: "Med spa â€” 1 missed review = 4 bookings",
    blogPath: "/blog/med-spas-one-missed-review-four-bookings",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/med-spa-math" }],
    posts: {
      "linkedin-company": `One missed review costs a med spa four bookings.

Tuesday, 9:47pm. Homeowner has been thinking about Botox for six months. She opens Google. Three med spas in her zip code. Yours first. Star rating is fine, 4.8. But the newest review is from 8 months ago. She hesitates. Backs out. Taps the next one: 4.8, 73 reviews, newest one from last week. She books.

That client just walked. $400 first visit. Filler upgrade at month two: $800. Annual maintenance: $2,000+. Friend referral inside the first quarter: another $400-1,200. Gone in 90 seconds because your newest review was 8 months old.

And it's not one client. It's four. The same missed review costs you the date-forward shopper, the trust-threshold shopper, the story-shaped buyer (looking for "anxious about needles, felt safe here"), and the map-rank slot you lost to a fresher competitor.

Review Automation is $49/mo, no setup. We ask every client at the moment they leave glowing (right after the consult result lands), filter unhappy reviews to you privately, and route the rest to Google.

Full breakdown of the four-booking math: https://aioutsourcehub.com/blog/med-spas-one-missed-review-four-bookings

Run yours: https://aioutsourcehub.com/#calculator

Med-spa owners: what does your newest Google review's date say?`,
      "linkedin-personal": `A med-spa owner showed me her booking funnel last month and asked why her Tuesday-night traffic didn't convert.

I asked her to pull up her Google profile on her phone. 4.8 stars, 64 reviews, newest one from last September. I told her she was losing every Tuesday-night Botox shopper to the practice two miles away with 73 reviews and a newest one from last week. Same star rating. Different signal.

The Tuesday-night Botox shopper is high-intent and date-paranoid. She's been thinking about this for months. She wants proof the practice is current, busy, and still doing good work. A 9-month-old newest review reads "closed" to her, even when you're booking out 3 weeks.

We rolled her onto Review Automation, $49/mo, no setup. Asks every client at the right moment (right after the result settles, not at checkout). 47 days in, she had 22 new reviews and her Tuesday-night conversion rate had doubled.

The full four-booking math: https://aioutsourcehub.com/blog/med-spas-one-missed-review-four-bookings

Run the lost-revenue math: https://aioutsourcehub.com/#calculator

Med-spa owners reading this: what's the date on your newest Google review?`,
      facebook: `One missed review = four lost bookings for a med spa.

Tuesday night Botox shopper. Your profile first. 4.8 stars, but newest review is 8 months old. She backs out, books the next one (fresher reviews). You just lost a $400 first visit + $2,000/year client.

Review Automation, $49/mo, no setup. We ask every client at the right moment so reviews keep landing.

Run your number: https://aioutsourcehub.com/#calculator

Full breakdown: https://aioutsourcehub.com/blog/med-spas-one-missed-review-four-bookings`,
      instagram: `One missed review = 4 lost bookings.

Tuesday night, 9:47pm. A client has been thinking about Botox for 6 months. She opens Google. Your profile is first, 4.8 stars. But the newest review is 8 months old. She backs out.

The next spa (4.8, newest review last week) books her. You just lost a $400 first visit + $2,000/year.

Review Automation $49/mo, no setup. Tap bio â†’ "Lost-Revenue Calculator." See yours in 30 seconds.`,
      x: `One missed Google review costs a med spa 4 bookings â€” and $3,600 in client lifetime value.

Tuesday 9:47pm. Botox shopper backs out because your newest review is 8 months old. Books next door.

Review Automation $49/mo, no setup.

Stop the leak â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `One missed review costs a med spa four bookings.

Tuesday night Botox shopper sees your dormant profile, backs out, books the spa with fresher reviews. That's a $400 first visit + $2,000/year client lost in 90 seconds.

Review Automation, $49/mo, no setup. We ask every client at the right moment (right after the result settles).

Calculator: https://aioutsourcehub.com/#calculator
Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/med-spas-one-missed-review-four-bookings`,
    },
  },

  {
    slug: "groomer-trust",
    title: "Pet groomers â€” under 20 reviews = no booking",
    blogPath: "/blog/pet-groomers-reviews-decide-bookings",
    images: [{ label: "Photo + overlay", path: "/api/social-photo/groomer-trust" }],
    posts: {
      "linkedin-company": `Pet parents don't book groomers under 20 reviews.

Hard threshold. We see it in client funnel data across every groomer we work with. Under 20 reviews and the booking page bounces. The pet parent isn't being picky. She's anxious. She's handing over an animal that can't tell her how the appointment went. She needs proof.

After the 20-review threshold clears, the math shifts. Then it's not how many. It's what they say. Generic 5-star reviews ("great groomer!") don't move the needle. Story-shaped reviews do: "Anxious doodle, first groom, came home calm." "She's nervous about the dryer, they kept it slow." Those convert.

Timing is the other lever. The pickup-moment ask (right when the dog walks out happy) converts at 30-50%. The 2-day-later text converts at 5-10%. Six-times difference for ten seconds of timing work.

Review Automation is $49/mo, no setup. We ask at the pickup moment, prompt for story details, filter unhappy reviews to you privately. Most groomers hit the 20-review threshold inside 60 days.

Full breakdown for groomers: https://aioutsourcehub.com/blog/pet-groomers-reviews-decide-bookings

Groomers reading this: how many of your reviews mention a specific dog story vs. a generic "great job"?`,
      "linkedin-personal": `I sat down with a pet groomer outside Chicago last month. Beautiful shop, great work, 14 Google reviews.

She couldn't figure out why her website traffic wasn't converting. I told her: pet parents don't book under 20 reviews. It's a hard threshold. Then I asked her when she asks for reviews. "Two days after, by text." Of course. 5-10% conversion on that text. That's why she had 14 reviews after 18 months.

The pickup moment is everything. The dog walks out, the parent is relieved and grateful, the bond is fresh. Ask there and you're at 30-50%. Ask two days later and you're at 5-10%. Same business, six-times the result, ten seconds of difference.

We onboarded her on Review Automation, $49/mo, no setup. Built the pickup-moment ask into her checkout flow with story prompts. 52 days in: 31 new reviews, and the booking funnel started converting again.

Full breakdown for groomers: https://aioutsourcehub.com/blog/pet-groomers-reviews-decide-bookings

For the groomers here: pickup-moment ask, or 2-day-later text?`,
      facebook: `Pet parents don't book groomers under 20 reviews.

It's a hard threshold. The fix is timing. Pickup-moment ask converts at 30-50%. The 2-day-later text? 5-10%. Six-times difference for ten seconds of timing.

Review Automation, $49/mo, no setup. We ask at the pickup moment with story prompts.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/pet-groomers-reviews-decide-bookings`,
      instagram: `Pet parents don't book under 20 reviews.

Hard threshold. After that, what reviews SAY matters more than how many. Anxious doodle stories convert. Generic 5-stars don't.

Timing matters too. Pickup-moment ask: 30-50% conversion. 2-day text: 5-10%.

Review Automation $49/mo, no setup. Tap bio â†’ "Review Automation pricing." See how to hit 20.`,
      x: `Pet parents won't book a groomer under 20 reviews. Hard threshold.

Past 20, what reviews SAY matters more than how many.

Pickup-moment ask: 30-50% convert. 2-day text: 5-10%. 10 seconds of timing = 6x the result.

Review Automation $49/mo, no setup.

Hit 20 reviews â†’ https://aioutsourcehub.com/pricing#review-automation`,
      google: `Pet parents don't book groomers under 20 reviews.

Hard threshold. The fix is timing and story prompts. Pickup-moment ask converts at 30-50%. The standard 2-day text converts at 5-10%.

Review Automation, $49/mo, no setup. Pickup-moment ask, story prompts, unhappy reviews filtered to you privately.

Pricing: https://aioutsourcehub.com/pricing#review-automation
Full breakdown: https://aioutsourcehub.com/blog/pet-groomers-reviews-decide-bookings`,
    },
  },
];

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
