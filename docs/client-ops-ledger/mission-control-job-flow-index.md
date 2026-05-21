# Mission Control Job Flow Index

Status: active Mission Control view
Owner: Manager
Last updated: 2026-05-21

## Purpose

Mission Control now uses an owner-friendly job view:

1. What agents are doing.
2. What the job costs each day.
3. What is blocked or needs a decision.
4. Which work is optional, such as custom agents connected to a client's CRM.

This keeps the front page useful as more agent jobs are added.

## Mission Control Links

| View | URL | Use |
|---|---|---|
| Front page job index | `/mike-mc` | Start here for active rooms and job links. |
| Find new leads | `/mike-mc/jobs#commercial-reach` | Explain the main growth job simply. |
| What agents do | `/mike-mc/jobs#commercial-reach-steps` | Show each agent step in plain English. |
| Presence Refresh | `/mike-mc/jobs/presence-refresh` | One-time setup to make a business look active before Reach sends attention. |
| Social Reach | `/mike-mc/jobs/social-reach` | Pilot for social conversation listening, helpful comment drafts, and human-approved engagement. |
| Custom agents | `/mike-mc/jobs#custom-agent-layer` | Show optional CRM/custom-agent work after the sale. |
| Send status | `/mike-mc/jobs/reach-cold-email-campaign` | Check whether emails are ready to send or still blocked. |
| Spending | `/mike-mc/jobs` | See daily spend and spend so far by job. |
| Morning Brief skill pack | `docs/client-ops-ledger/morning-brief-skill-pack.md` | Shows who feeds Mike's daily owner brief and how knowledge should be sourced. |
| GBP access test | `docs/client-ops-ledger/gbp-client-access-and-update-test.md` | Shows how clients add AOH by email so Local Visibility Manager can update profiles without password sharing. |

## Commercial Reach

Commercial Reach is the standard lead job:

1. Choose who to target.
2. Find businesses.
3. Pick the best fits.
4. Check emails.
5. Add clean leads.
6. Send outreach.
7. Sort replies.
8. Book calls.
9. Review spend and results.

This is the version to explain to most businesses. It does not require connecting to the client's CRM.

## Presence Refresh

Presence Refresh is the first add-on to build:

1. Audit stale website/social presence.
2. Pick one useful customer-facing angle.
3. Draft five catch-up social posts.
4. Draft one useful blog post.
5. Publish only after approval.
6. Save proof links/screenshots.
7. Hand the refreshed proof to Reach.

This is a setup product. It helps prospects see a current, credible business when outreach sends them to check the client.

## Social Reach

Social Reach is the guarded pilot:

1. Build an approved source watchlist.
2. Find useful social conversations.
3. Score whether the conversation is worth joining.
4. Draft helpful responses.
5. Human approves/posts during v1.
6. Track replies, DMs, profile views, booked calls, and useful buyer language.

Do not sell this as bots posting in groups. Sell it as human-approved community listening and useful engagement.

## Optional Custom Agents And CRM

Custom agents begin only after the client needs the deeper layer:

1. Confirm they need a custom agent.
2. Collect access.
3. Connect their CRM or business software.
4. Teach the agent the business.
5. Start jobs from real events.
6. Watch the agent.

Do not bundle this into the basic Reach promise. It is an add-on for clients that need agents working from their systems.

## Morning Brief

The Morning Brief is Mike's daily owner view:

1. Overnight result.
2. What needs Mike today.
3. What agents are handling.
4. Market/news signal.
5. One recommended move.

Manager owns the final brief. GHL Expert feeds campaign stats, Local Visibility Manager feeds Google Business Profile access/update status, Sales Manager explains what the numbers mean, Scout watches market/news opportunities, and Systems Director watches cron/source failures.

This is internal first. If it proves useful, sell it as Owner Morning Brief.

## Safety Boundary

The send room still controls live sending:

- adding leads is not the same as sending emails
- emails should not send until contacts and sending setup are checked
- unsubscribe and reply handling must work
- social comments should not auto-post; human approval is required during v1
- HighLevel AI features remain OFF unless Mike manually authorizes them
