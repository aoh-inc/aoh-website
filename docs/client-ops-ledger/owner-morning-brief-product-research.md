# Owner Morning Brief Product Research

Status: v1 recommendation
Owner: General Manager
Last updated: 2026-05-21

## Plain-English Recommendation

Build Mike's version first, then sell it as an owner-facing daily brief.

Do not sell "AI agents" first. Sell:

> Every morning, you know what happened, what needs attention, and where money may be leaking.

Mission Control page:

- `/mike-mc/morning-brief`
- Standard / Commercial is the packaged product.
- Custom Layer is paid setup for inbox, calendar, GHL/CRM, GBP, calls, ads, payments, or client-specific workflows.

## Two-Part Product

### Commercial Brief

This is the version most businesses can buy without a custom build.

- New leads and replies
- Campaign/email performance
- Missed calls or urgent customer messages
- New reviews and reputation movement
- One market or competitor signal
- One recommended move

This should feel like a business update, not a software dashboard.

### Custom Layer

This is the upgrade when a client wants deeper integrations.

- CRM/GHL pipeline and workflow stats
- Email inbox triage
- Calendar and booking checks
- Google Business Profile and review response status
- Call tracking or missed-call summaries
- Ad spend or Stripe/payment summaries

Custom means the agents connect to that client's systems. It should cost more and require setup.

## Best First Client Targets

| Priority | Industry | Why it fits |
|---|---|---|
| 1 | Home services | Leads, calls, reviews, booking, and local search are daily revenue issues. |
| 2 | Dental, med spa, wellness, chiropractic | Appointment flow, reviews, missed calls, and follow-up matter every day. |
| 3 | Local professional services | Owners care about qualified leads, reputation, referrals, and fast follow-up. |
| 4 | Restaurants and hospitality | Reviews and local discovery matter, but margins may make pricing harder. |
| 5 | Real estate | High value per lead, but compliance and outreach risk are higher. |

Start with home services and appointment-based local businesses. They feel missed calls, weak reviews, slow follow-up, and local visibility fastest.

## Email And Calendar Recommendation

Use email and calendar as the first custom layer, not the base product.

Why:

- Email is where owner tasks and customer issues hide.
- Calendar shows whether demand is turning into booked work.
- Together they let the brief say "these customers need action today" instead of just showing numbers.

Guardrails:

- Read-only first.
- Summarize, label, and recommend.
- Do not auto-send replies or move meetings without explicit approval.

## Data Retention Recommendation

| Data | Keep on live page | Why |
|---|---:|---|
| Daily owner briefs | 13 months | Lets the owner look back through the year and compare the same season next year. |
| Raw proof/log files | 90 days | Enough for debugging without cluttering the owner page. |
| Monthly rollups | 24 months | Useful for renewals, annual reviews, and proving value. |
| Client export | On cancel | Give a simple archive export, then remove private access. |

The page should feel current, not infinite. Keep the daily archive visible for 13 months, then roll older history into monthly summaries.

## Pricing Anchors

These are software/tool price anchors, not done-for-you agency pricing:

| Tool | Public price anchor | What it proves |
|---|---:|---|
| AgencyAnalytics | $20/client/month billed annually | Agencies pay for automated reports, AI insights, white-label branding, and client portals. |
| DashThis | $44/month annually or $54/month monthly for 3 dashboards | A basic reporting dashboard has a real monthly software cost before labor. |
| Databox | $159/month Pro | Broader BI/reporting dashboards cost more when you add teams, reports, goals, and shared updates. |
| Whatagraph | 199 euros/month Start, billed annually | AI-powered marketing reports with automated emails and unlimited reports are priced as a real platform. |

AOH recommendation:

| Tier | Price |
|---|---:|
| Standard / Commercial Brief | $149-$299/month, with $0-$500 setup |
| Custom Layer | $399-$1,500+/month, with $750-$3,000 setup |

Standard should be easy to buy. Custom should cost more because it needs private access, setup, QA, and monitoring.

## What The Agents Should Do

| Agent | Job |
|---|---|
| GHL Expert | Pull campaign, workflow, pipeline, and email stats. |
| Scout / Market Watcher | Bring one useful market or competitor signal. |
| Sales Manager | Turn the numbers into the next best business move. |
| Systems Director | Watch cron, API failures, source health, and cost. |
| Manager | Give Mike the short owner read. |

## Research Notes

- HighLevel supports email stats for campaigns, workflows, and bulk actions through its Email Statistics API and UI reporting. Use this for Reach stats before relying on screenshots.
- HighLevel's support docs say email stats help monitor deliverability, engagement, sender reputation, opens, clicks, bounces, spam, unsubscribes, and replies.
- BrightLocal's 2026 Local Consumer Review Survey says reviews remain a major local-buying signal: 97% of consumers read reviews for local businesses, and positive reviews move many consumers to check the business site, contact the business, or book.
- Intuit's 2025 Small Business Advertising Trends Report says 81% of small businesses use marketing technology tools to check ROI regularly, and 30% check daily or hourly. That supports a simple owner brief around performance, not another dashboard.
- NFIB's 2025 Small Business and Technology Survey shows AI interest is real but uneven: 24% of small business owners currently use AI tools, while 56% think AI will be important to operating their business over the next five years. This supports selling outcomes, not AI complexity.
- OECD's 2025 SME AI report says small businesses are still behind large firms in core AI adoption, but marketing and sales are one of the practical entry points. That supports a focused brief tied to revenue and follow-up.
- Microsoft's 2026 Work Trend Index shows agent usage is moving into normal business work. Treat this as a direction signal for email/calendar agents, not proof that every local business is ready for a full custom agent stack.
- Acuity's 2025 scheduling survey is vendor-owned, but it reinforces a practical buyer pain: automated scheduling can reduce admin work for appointment-based businesses.
- Talkdesk's 2025 small business AI survey is also vendor-owned, but it directly names missed calls, after-hours gaps, and slow resolution as business-owner service problems.

## Source Links

- HighLevel Email Statistics API: https://marketplace.gohighlevel.com/docs/ghl/emails/get-campaign-stats-under-campaigns-v-2
- HighLevel list workflow campaigns API: https://marketplace.gohighlevel.com/docs/ghl/emails/list-workflow-campaigns-v-2
- HighLevel Email Statistics support: https://help.gohighlevel.com/support/solutions/articles/48001215386-email-statistics
- BrightLocal Local Consumer Review Survey 2026: https://www.brightlocal.com/research/local-consumer-review-survey/
- Intuit 2025 Small Business Advertising Trends Report: https://digitalasset.intuit.com/render/content/dam/intuit/sbseg/en_us/Blog/Downloadable-assset/Ebook/2025-small-business-advertising-trends-report.pdf
- NFIB 2025 Small Business and Technology Survey: https://www.nfib.com/wp-content/uploads/2025/06/2025-NFIB-Technology-Survey.pdf
- OECD AI adoption by SMEs: https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/12/ai-adoption-by-small-and-medium-sized-enterprises_9c48eae6/426399c1-en.pdf
- Microsoft 2026 Work Trend Index: https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization
- Acuity Scheduling 2025 customer outcomes survey: https://acuityscheduling.com/learn/acuity-scheduling-customer-outcomes-survey-2025
- Talkdesk small business AI survey: https://www.talkdesk.com/news-and-press/press-releases/small-business-ai-survey/
