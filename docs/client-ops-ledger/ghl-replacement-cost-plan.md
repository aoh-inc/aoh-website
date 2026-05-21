# GHL Replacement And Cost Plan

Status: planning v1  
Owner: Manager  
Specialists: GHL Expert, Systems Director, Website/Codex, Auditor  
Last updated: 2026-05-21

## Owner Summary

GHL should not be the long-term center of AOH if clients are going to use AOH client pages instead of GHL subaccounts.

Best path:

1. Downgrade from the $497 plan as soon as no active feature requires it.
2. Keep the cheapest useful GHL plan while AOH proves Review Automation and Reach.
3. Build the AOH-owned replacement in phases.
4. Do not buy per-client GHL AI, SEO heatmaps, or SaaS features unless a client is paying enough to justify that exact add-on.

Recommended current decision:

- Use $97 Starter while AOH has 1-3 GHL-backed locations.
- While $97 works, do not buy Calendly, Smartlead/Instantly, or a separate
  review-request email sender.
- Use $297 Unlimited only if AOH needs more GHL locations before the AOH-built backend is ready.
- Avoid $497 Agency Pro unless AOH is reselling GHL as software or needs marked-up rebilling/SaaS Mode.

Cheapest short-term stack:

| Need | Short-term tool | Extra monthly cost |
| --- | --- | ---: |
| Booking | GHL calendar/booking if it survives downgrade | $0 beyond GHL |
| Reach cold email drips | Current GHL workflows | $0 beyond GHL + usage |
| Review request email | LC Email/GHL bridge while AOH tests | usage only |
| Client page/status | AOH website | $0 beyond current hosting |

Tools to defer:

| Deferred tool | Why defer |
| --- | --- |
| Calendly | Not needed if GHL $97 booking works. |
| Smartlead/Instantly | Not needed until GHL cold email becomes a deliverability/reporting/scaling blocker. |
| Separate review email sender | Not needed until AOH Review Automation needs better logs, bounce events, or independence from GHL. |

## Review Automation Promise

This is the promise AOH needs to fulfill for the base Review Automation offer before deciding what GHL can be replaced with.

Current public promise from pricing, checkout, onboarding, and agent docs:

| Promise | What it means operationally | Base or upgrade? |
| --- | --- | --- |
| Automated email review requests after every job | A completed customer/job should trigger an email asking for a Google review. | Base |
| Google Business Profile audit + fix | AOH checks the client's GBP basics and fixes/flags profile gaps in week 1. | Base |
| Google Business Profile connection/access | Client adds AOH as GBP Manager; AOH captures the correct review link and can help with profile work. | Base |
| Monthly recap | Client gets a simple summary of what went out, what came in, and what needs attention. | Base |
| Client does not learn software | Client uses AOH page/email/text, not GHL dashboards. | Base |
| Cancel anytime/no contract | Operationally means no long onboarding lock-in and easy offboarding. | Base |
| Replies in client's voice | AI or AOH-drafted public review replies. | AI Visibility/upgrade |
| SMS review requests | Text-message review requests and compliance setup. | AI Visibility/upgrade |
| Social review posting | Turning reviews into social/GBP posts. | Upgrade/custom |
| AI Visibility/rankings/heatmaps | AI search, local ranking, competitor monitoring. | Upgrade/custom |

Copy alignment note:

- Some social/blog copy says AOH "filters unhappy customers privately" before sending the rest to Google.
- If AOH keeps saying that publicly, the base product needs a private feedback step before the Google link, such as "How did we do?" with happy customers routed to Google and unhappy customers routed to the owner.
- If AOH wants the simplest $49/mo product, public copy should say "email review requests and follow-up" instead of promising advanced filtering.

Recommended product boundary:

- Base Review Automation should include email requests, light private feedback routing, GBP audit/fix, review link setup, client page, and monthly recap.
- AI Visibility should include SMS, AI review response drafts/replies, deeper profile/AI visibility work, and heatmap/ranking reports.

## Best Non-GHL Fulfillment Model For Review Automation

Goal: fulfill the $49/mo promise without needing GHL subaccounts for every client.

Recommended stack:

| Job | Best non-GHL fulfillment | Estimated cost profile | Notes |
| --- | --- | --- | --- |
| Client page | AOH website route like `/client/[slug]`, protected by magic link/password before real data. | Mostly existing website cost. | This becomes the client's "dashboard" without calling it software. |
| Intake/setup form | AOH form/API writes to database and alerts Manager. | Mostly existing website cost. | Pre-fill from signup/order data where possible. |
| Client/customer database | Postgres/Supabase/Neon tables for clients, jobs/customers, exclusions, review links, sends, events. | About $25-$100/mo early stage depending on provider/usage. | One shared AOH database is cheaper than one GHL subaccount per client. |
| Customer/job upload | CSV upload to AOH page, plus manual paste/list option. | Low. Storage may be pennies to low dollars at first. | Must include do-not-contact and bad-fit exclusions. |
| Google review link | Store URL captured from GBP or public profile. | Free. | The review link is enough to send email requests without GHL. |
| GBP audit/fix | Local Visibility Manager checklist, screenshots, and manual profile updates through Google access. | Labor/agent time, not platform-heavy. | This does not require GHL. |
| Review request email | Use GHL/LC Email as bridge, then move to transactional/email API only when needed. | Low at review volume. GHL LC Email is $0.675/1,000, external email APIs are also low. | Needs unsubscribe, bounce tracking, templates, and sender domain setup before full GHL exit. |
| Private feedback filter | AOH-hosted landing page asks for rating/feedback before showing Google link to happy customers. | Mostly existing website cost. | This supports the "filter unhappy privately" promise without GHL. |
| Follow-up cadence | AOH cron/workflow sends a gentle follow-up if no click/review after X days. | Low. | Start simple: one follow-up. |
| Send windows | AOH scheduler respects timezone and business hours. | Low. | Prevents awkward sends. |
| Suppression/DND | AOH database stores unsubscribed, excluded, bounced, complaint, and do-not-contact statuses. | Low. | Required before replacing GHL safely. |
| Monthly recap | AOH generates an email/client-page summary. | Low. | Start with "requests sent, clicks, reviews reported, issues, next action." |
| Low-review tips | Rule-based tips on client page when weekly/monthly review goal is low. | Free/low. | Already started on client page. |
| Manager alerts | Slack/email alert when setup is blocked, review count is low, or sends fail. | Low. | Keeps Mike from babysitting. |
| AI response drafts | OpenAI/Gemini draft reply on demand, approval required. | Usage-based and likely low. | Upgrade feature; do not auto-publish at first. |
| SMS | Twilio directly if/when sold. | Usage-based plus compliance/admin. | Upgrade only. Do not add to $49 base unless pricing changes. |
| Heatmaps/rankings | Vendor/export/manual report only for AI Visibility clients. | Per report or paid plan. | Do not pay per-client GHL/Search Atlas for base reviews. |

Minimum AOH-owned Review Automation v1:

1. Client record and client page.
2. Intake form with GBP access confirmation and customer upload.
3. Customer/job table with exclusion flags.
4. Review link storage.
5. Email template and send log.
6. Private feedback page that can route happy customers to Google.
7. One follow-up email.
8. Unsubscribe/suppression.
9. Monthly recap.
10. Manager/Auditor proof log.

Build status:

- Client page exists at `/client/[slug]`.
- Customer upload v1 exists at `/client/[slug]/customers`.
- Customer rows are summarized and cleaned before outreach.
- Customer uploads and feedback can save into existing Upstash Redis when
  configured, so no new storage vendor is required for the first test.
- Full customer rows are not posted to Slack.
- Private feedback v1 exists at `/review/[slug]`.
- Unsubscribe/suppression v1 exists at `/review/[slug]/unsubscribe`.
  Stored suppressions are applied to future customer uploads when Redis is
  configured.
- Internal send-log v1 exists at `/api/review-automation/send-log`.
  GHL exports/webhooks or the future AOH sender can record sent, failed,
  bounced, clicked, and follow-up events there.
- Manager/internal summary status exists at `/api/review-automation/status`.
  It returns summary records only by default and requires an internal token.
  Use `AOH_INTERNAL_API_TOKEN`, or the existing report bypass token as the
  bridge token while AOH is consolidating infrastructure.
- Google routing waits for a verified per-client review link.

This v1 fulfills the actual $49/mo promise without GHL.

What not to build into v1:

- Full CRM.
- Full pipeline/opportunity system.
- SMS.
- AI auto-replies.
- Heatmaps.
- Social posting.
- Client login with heavy permissions.
- POS/CRM integrations for every client on day one.

## Review Automation Fulfillment Jobs Outside GHL

| Fulfillment job | Owner | AOH-built process | Done means |
| --- | --- | --- | --- |
| Payment/order confirmed | Manager | Stripe/checkout event creates client record and setup status. | Client exists in AOH system with plan, owner, email, and status. |
| Client setup page created | Website/Codex | Generate `/client/[slug]` page from client record. | Client sees service status and what is needed. |
| Intake collected | Manager/Coach | AOH form collects business info, review flow, exclusions, customer source, GBP invite confirmation. | Required setup fields complete or blockers shown. |
| GBP access accepted | Local Visibility Manager | Accept/check Manager access in Google; capture proof. | Correct profile/location confirmed. |
| GBP audit/fix | Local Visibility Manager | Run profile checklist: name, category, services, hours, phone, site, photos, posts, review link, unanswered reviews. | Fixes made or client/Mike blockers listed. |
| Review link captured | Local Visibility Manager | Store Google review URL in AOH client record. | Test link opens the correct review destination. |
| Customer list cleaned | Sorter | Normalize CSV/list, dedupe, remove exclusions, flag missing email. | Clean sendable customer list exists. |
| Review email written | Coach/Sender | Use approved template with business name, customer name, and review link/private feedback link. | Test email renders cleanly. |
| Email sender configured | Systems Director/Sender | Configure domain/sender in chosen email provider. | SPF/DKIM/DMARC pass, test email delivered. |
| Review request sent | Sender/System | Cron/API sends only eligible customers during approved window. | Send log shows success/fail per customer. |
| Follow-up sent | Sender/System | One follow-up to non-click/non-response customers after configured delay. | Follow-up respects suppression and does not over-send. |
| Private feedback handled | Sorter/Manager | Low-rating/private feedback gets routed to owner/Manager, not Google-first. | Unhappy feedback is visible and not pushed publicly by automation. |
| New reviews tracked | Local Visibility Manager/Auditor | Start manual check or API/vendor check; record review count and new review notes. | Monthly recap has review outcome data. |
| Monthly recap sent | Manager | Generate simple summary and email/client-page update. | Client sees what went out, what came in, and what is needed. |
| Low-review coaching | Manager/Coach | If review count is below goal, page shows simple owner tips. | Client gets practical next action, not internal tooling detail. |
| QA and proof | Auditor | Check sends, links, suppressions, GBP link, and summary accuracy. | Client can be marked live/healthy. |

## Review Automation Status Loop

Manager should not ask Mike to babysit review jobs.

Current v1 loop:

1. Client uploads customers at `/client/[slug]/customers`.
2. AOH stores the full packet in Redis if configured.
3. Slack receives only a short summary.
4. Client feedback lands at `/review/[slug]`.
5. Customer unsubscribe requests land at `/review/[slug]/unsubscribe`.
6. Sender/GHL bridge can log send events to `/api/review-automation/send-log`.
7. Happy feedback routes to Google only after the verified Google review link is saved.
8. Manager/System can check `/api/review-automation/status?client=[slug]` with an internal token.

What this gives Mike:

- Customer uploads happened or did not happen.
- Feedback came in or did not come in.
- Counts and summaries.
- No private customer list dumped into Slack.

Still needed before removing GHL from Review Automation sending:

- Verified Google review link for each client.
- Bounce handling.
- One follow-up rule.
- Monthly recap.

## GHL-Free Cost View For Review Automation

Assumptions for a 50-client base Review Automation scenario:

- Each client sends 50-300 review request emails/month.
- Base plan uses email, not SMS.
- AI reply drafting is upgrade-only.
- Heatmaps/rankings are upgrade-only.
- Clients do not log into GHL.

Likely monthly platform cost without GHL:

| Cost bucket | Rough expectation |
| --- | --- |
| Database/app storage | Low; likely one paid database tier is enough early. |
| Email sending | Low; 50 clients x 300 emails = 15,000 emails/month, still inexpensive with most email APIs. |
| File uploads | Low if only CSV/logo files. |
| AI usage | Near zero for base plan; usage-based for upgrades. |
| SMS | Zero for base plan. Usage-based only for AI Visibility or higher plan. |
| Heatmaps | Zero for base plan. Per-report/vendor cost only when sold. |

Business conclusion:

- GHL is convenient, but not economically required for base Review Automation.
- The hard parts are not expensive software; they are workflow reliability, deliverability, suppression, proof, and GBP/review tracking.
- Build AOH Review Automation around those jobs first.

## Known GHL Cost Points

As of 2026-05-21, based on HighLevel official docs:

| Item | GHL cost | Notes |
| --- | ---: | --- |
| Starter plan | $97/mo | Best for AOH/pilot use if location limit is enough. |
| Unlimited plan | $297/mo | Use only if AOH needs more locations before our backend is ready. |
| Agency Pro/SaaS plan | $497/mo | Not needed unless selling GHL as software/subaccounts. |
| LC Email | $0.675 per 1,000 emails | Cheap enough. Not a major reason to leave GHL. |
| Email validation | $2.50 per 1,000 validations | Use sparingly; NeverBounce/other verifiers may still be better for Reach. |
| Reviews AI pay-per-use | about $0.01 per review response generation | Good for low-volume manual/suggestive replies. |
| AI Employee Unlimited | $97/mo per enabled subaccount | Do not enable by default. 50 clients would be $4,850/mo. |
| SEO powered by Search Atlas | $79/mo per enabled subaccount | Do not enable broadly. 50 clients would be $3,950/mo. |
| Premium Prospecting | $29/mo per enabled subaccount | Avoid unless it clearly beats our own sourcing. |
| Workflow premium actions | $0.01 per execution, with optional bundles | Avoid premium triggers/actions when our own API can do the work. |

External replacement cost references:

| Item | Outside option | Cost signal |
| --- | --- | --- |
| SMS | Twilio directly | US SMS listed at $0.0083 outbound/inbound before carrier fees. |
| Email API | SendGrid/Twilio SendGrid, Postmark, Resend, SES | Usually cheap at AOH volume; choose after deliverability testing. |
| Database/client hub | Supabase/Neon/Postgres | Supabase Pro starts at $25/mo; AOH may already cover website hosting separately. |
| Heatmaps/local rankings | BrightLocal, Local Falcon, Places Scout, outsourced reporting | Buy only for paid AI Visibility clients or monthly reporting clients. |

## GHL Task Map

| Current GHL job | Why AOH uses it | Current cost risk | Build elsewhere? | Recommendation |
| --- | --- | --- | --- | --- |
| Client subaccounts | Separates settings, contacts, reputation, workflows by client. | Starter is limited; Unlimited may be needed if we keep this model. | Yes. Store clients, contacts, jobs, review links, sends, and stats in AOH database. | Replace over time. Do not make subaccounts the client product. |
| Contact database | Stores leads/customers, tags, DND, history. | Low direct cost, but locks us into GHL workflows. | Yes. Build AOH contacts table with tags, status, consent, DND, source, and client ID. | Replace for Review Automation first. |
| Email review requests | Sends review request emails. | LC Email is cheap. Main risk is dependency and workflow complexity. | Yes, later. Use an email API with templates, unsubscribe handling, logs, and retries only when needed. | Keep GHL $97 bridge first. Build AOH sender only when deliverability/logging or cancellation requires it. |
| SMS review requests | Upgrade feature, not base Review Automation. | SMS usage plus compliance/A2P complexity. | Yes, but needs Twilio, opt-out handling, A2P, logs. | Delay. Add only for higher-priced plans. |
| Review link storage | Stores and injects Google review links. | Low. | Yes. Store per client in AOH. | Replace immediately in AOH client hub. |
| Google Business Profile connection | Pulls/replies to reviews through reputation tools. | Valuable, but tied to subaccount model. | Possibly. Use Google Business Profile APIs where available and/or manual first. | Research/build carefully. This is the hardest replacement piece. |
| Reputation/review dashboard | Shows review count, requests, responses, status. | Low direct cost, but clients will not use GHL dashboard. | Yes. This belongs on the AOH client page. | Replace. Already started with client hub. |
| Reviews AI suggestive replies | Drafts review replies. | Pay-per-use is cheap; AI Employee $97/subaccount is expensive. | Yes. Use OpenAI/Gemini to draft replies with approval gates. | Replace. Do not enable GHL AI Employee by default. |
| Reviews AI auto-pilot | Auto-replies to reviews. | Brand and cost risk. | Yes, but should still require approval at first. | Do not sell autopilot until manual approval flow works. |
| Review widget | Embeds reviews on website. | Low value unless included in package. | Yes. Build simple AOH widget or use Google embeds/manual highlights. | Replace later. Not urgent. |
| Reach cold email contact import | Imports verified cold prospects into GHL. | Low platform cost, but workflow lock-in. | Yes. Build AOH campaign database and sender integration. | Keep short term. Replace after Review Automation core. |
| Reach drip workflows | Sends cold emails, waits, stops on replies. | GHL does this well today. | Yes, but requires careful unsubscribe, reply detection, suppression, and warmup logic. | Keep on GHL $97 for now unless cost, reporting, or deliverability blocks us. Replace later with Smartlead/Instantly only if needed. |
| Reach reply routing | Tags warm replies, routes report/book requests. | Low cost but workflow complexity. | Yes. Use inbound email parser/webhook + AOH routing. | Replace after first real campaign proof. |
| Email campaign stats | Reads GHL email stats for morning brief. | Low. | Yes. Email providers expose events/stats. | Replace when email sending moves off GHL. |
| Report flow/opportunities | Website adds contacts/tags; GHL workflows deliver report and track opportunity. | Low to medium; premium webhook actions can add cost. | Yes. AOH already owns website/API. Store report request state in AOH. | Replace. GHL can remain temporary tracker. |
| Calendar booking | Booking link/calendar routing. | Low. | Yes, later. Use Calendly with Google Calendar only if GHL $97 booking is not good enough. | Keep GHL booking short term if it works. Do not buy Calendly yet. |
| Conversations/inbox | Central reply inbox. | Useful if all channels live in GHL. | Partly. Use email inbox + Slack summaries first. | Keep only while using GHL sending. |
| Missed-call/Relay phone flows | Possible future Relay product. | Phone/SMS usage and AI can add up. | Yes with Twilio, but operationally more sensitive. | Keep separate from Review Automation decision. |
| Heatmaps/local SEO | AI Visibility reports and sales proof. | Search Atlas at $79/subaccount becomes too expensive at 50 clients. | Yes. Use external reports only for paid scans or monthly clients. | Do not keep GHL for heatmaps. Outsource or replace. |
| Online listings | Citation/listing service. | $30/mo if enabled. | Yes, via BrightLocal/Whitespark/manual VA process. | Do not enable broadly. Sell separately. |
| Premium prospecting | Prospecting reports, widgets, audits. | $29/subaccount. | Yes. AOH discovery pipeline already exists. | Avoid. |

## 50 Client Scenarios

### Scenario A: Keep GHL as backend for 50 clients

Likely monthly cost:

- $297/mo Unlimited base plan, or $497/mo if SaaS/rebilling is used.
- Email usage is small.
- Reviews AI pay-per-use can stay tiny if only drafting occasional replies.
- Do not enable AI Employee Unlimited by default.
- Do not enable Search Atlas/SEO heatmaps by default.

Good:

- Fastest path to support 50 clients if workflows are already solid.
- GHL already handles many operational edges.

Bad:

- AOH becomes dependent on GHL subaccounts and workflows.
- Client pages become a front-end over a hidden GHL system.
- Add-ons can explode cost if enabled per client.

Verdict:

- Acceptable bridge.
- Not the long-term target.

### Scenario B: Remove GHL completely before 50 clients

Likely monthly platform cost:

- Database/app: about $25-$100+/mo depending on stack and usage.
- Email API: likely low at review-request volume.
- SMS: usage-based if AOH sells SMS review requests.
- AI reply drafts: usage-based and likely low if using OpenAI/Gemini directly.
- Heatmaps: outsourced or bought only when needed.

Good:

- AOH owns the product.
- Client experience stays on AOH pages.
- Cleaner margins at 50+ clients.

Bad:

- We must build the workflow engine, logs, suppression, delivery proof, reply handling, Google review data, approvals, and alerts.
- Biggest risk is Google Business Profile review sync/reply capability.

Verdict:

- Best long-term.
- Do not cut over until 3-5 clients run successfully for 30 days.

### Scenario C: Hybrid

Use GHL only as a temporary backend while AOH owns the client page, intake, status, and reporting.

Good:

- Lowest risk right now.
- Lets AOH sell while building.
- Lets agents learn the process with real client data.

Bad:

- Some double-entry until replacement is complete.

Verdict:

- Recommended.

### Scenario D: Cheapest $97 Bridge

Use GHL $97 for booking, current Reach drips, current Review Automation email
sends, and email stats while AOH owns client pages, intake, private feedback,
customer upload, and reporting.

Good:

- avoids Calendly, Smartlead/Instantly, and separate email sender cost for now
- keeps active campaigns moving
- lets AOH keep building without rushing the cutover

Bad:

- still depends on GHL for some live sending and booking
- not enough for many separate client subaccounts
- reporting/API limits may still force replacement later

Verdict:

- Best immediate cost-control move.
- Replace only the piece that breaks or blocks growth.

## Replacement Build Plan

### Phase 1: AOH Review Core

Goal: replace enough GHL work that Review Automation can run from AOH.

Build:

- Client record
- Client page
- Customer/job upload
- Google review link storage
- Do-not-contact list
- Review request email template
- Email send log
- Weekly review goal/status
- Manager alert when reviews are low
- Manual approval before first live send
- Simple morning/client summary

Keep GHL for:

- Existing cold email Reach workflows
- Temporary review backend if needed
- Existing email stats until AOH sender is live
- Calendars/booking if $97 keeps them working

### Phase 2: AOH Review Automation Sender

Build:

- Email provider integration
- Unsubscribe handling
- Bounce/event handling
- Customer suppression rules
- Send windows by timezone
- Retry/follow-up rules
- Owner/client visible logs
- Slack/Manager exception alerts

Cutover test:

- AOH runs itself first.
- Then 1 pilot client.
- Then 3-5 clients for 30 days.

### Phase 3: AOH Review Intelligence

Build:

- Pull or enter new Google reviews
- AI draft responses
- Owner approval flow
- Approved public reply process
- Review trends and low-review coaching

Rule:

- Do not auto-publish replies until manual approval proves safe.

### Phase 4: Replace Reach GHL Dependency

Build:

- Campaign contact table
- Suppression/unsubscribe table
- Cold email provider integration
- Drip scheduler
- Reply parser
- Warm reply routing
- Report/book intent classification
- Stats and Manager brief

Keep GHL until:

- Drip stop-on-reply is proven.
- Unsubscribe is proven.
- Deliverability is acceptable.
- Reply routing is proven.
- Or until GHL $97 cannot support the active campaign workflow.

### Phase 5: Replace GHL Reporting/Heatmap Dependency

Build or outsource:

- One-time heatmap/vendor report generation
- AI Visibility report storage
- Competitor snapshot
- Client page upsell preview

Rule:

- Do not pay $79/client/mo for Search Atlas unless that client is paying for a plan that covers it.

## Decision Rules

Downgrade to $97 when:

- AOH has no need for more than the included locations.
- No active rebilling/SaaS Mode feature is needed.
- No required feature only exists on $297/$497.

Move to $297 when:

- AOH needs more GHL-backed locations before the AOH replacement is ready.
- The added client revenue clearly covers the $200/mo difference.

Stay away from $497 unless:

- AOH sells GHL as a client software portal.
- AOH needs marked-up rebilling inside GHL.
- AOH needs SaaS Mode as the product.

Enable AI Employee Unlimited only when:

- The client pays for it.
- Their expected usage would exceed pay-per-use.
- Mike manually approves the feature.

Enable SEO/Search Atlas only when:

- The client pays for AI Visibility or a local SEO plan that covers it.
- AOH has a reporting reason that cannot be handled cheaper elsewhere.

## Immediate Action List

1. Systems Director checks current GHL plan and all enabled add-ons.
2. GHL Expert lists which subaccounts/locations exist and what each one is used for.
3. GHL Expert confirms whether any live workflow requires $297 or $497 features.
4. Website/Codex scopes AOH Review Core tables and API routes.
5. Manager downgrades to $97 if support confirms booking, workflows, contacts,
   stats, API access, and current drips keep working.
6. Auditor creates a monthly GHL cost report: base plan, wallet usage, AI, SEO, phone, email, validation, premium workflow actions.
7. Do not buy Calendly, Smartlead/Instantly, or a separate email sender until a specific blocker appears.

## Sources

- HighLevel Pricing Guide: https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide
- HighLevel Reviews AI pricing/modes: https://help.gohighlevel.com/support/solutions/articles/155000001074-maximizing-customer-engagement-with-reviews-ai-a-guide-to-suggestive-and-auto-pilot-modes
- HighLevel pricing page: https://www.gohighlevel.com/pricing
- Twilio US SMS pricing: https://www.twilio.com/en-us/sms/pricing/us
- SendGrid pricing: https://sendgrid.com/en-us/pricing
- Supabase pricing: https://supabase.com/pricing
