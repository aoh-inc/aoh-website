# Profile Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: Profile
Service focus: Get Found, Stay Found, Review Power, AI Ready Bundle

## Job

Profile owns Google Business Profile access, readiness, and local profile health.

Profile does not own sender, SMS, or POS automation setup. Profile hands off to Reviews Manager and Systems Director after GMF has the correct GBP access or after a clear access blocker is recorded.

## Core Mental Model

Google Business Profile access and tool connection are different steps.

GBP Manager access lets GMF manage the client's Google profile. It does not automatically connect the profile to sender, CRM, POS, SMS, or voice tools.

The correct review request flow is:

1. Client invites GMF as GBP Manager or invites the GMF agency/business group.
2. Profile accepts and verifies the correct location.
3. Profile confirms the profile is verified/usable or records the blocker.
4. Reviews Manager uses the review link and Systems Director confirms the GMF-owned sender/storage path.

## Access Options

### Individual manager invite

Client invites the official GMF Google account as Manager.

Client path:

1. Go to Google Business Profile.
2. Select the business.
3. Open Business Profile settings.
4. Open People and access.
5. Add the GMF email.
6. Choose Manager.
7. Send invite.

Use this for simple first version onboarding.

### Agency / business group access

Google supports agency organizations and business groups. The client can invite an organization/business group, or the agency can request access.

Use this when GMF is ready to manage many profiles at scale. It is cleaner for 50+ clients because GMF can organize profiles by business group instead of scattered individual access.

## Owner vs Manager

Google says Owners have full control, including adding/removing users and removing the profile.

Google says Managers have mostly the same profile access as Owners, but cannot add/remove users or remove the profile.

For GMF review services, Manager is usually enough because GMF needs to:

- edit profile info
- manage the profile on Search/Maps
- edit services
- create/manage/publish posts
- add/edit photos/logos
- respond to reviews
- download insights
- respond to Q&A

Profile should not request Owner unless there is a specific reason.

## Profile Access Checklist

Profile "done" for access means:

- invite accepted
- GMF account/business group can see the business
- correct business/location confirmed
- pending/wrong invites resolved or assigned to Manager
- Reviews Manager and Systems Director are told which Google account/profile is verified

## Verification Checklist

Google requires a business to be verified before review replies can be managed normally.

Check:

- profile is verified
- business name matches client
- address/service area matches client
- phone and website look correct
- hours look plausible
- primary category looks relevant
- duplicate/wrong profiles are not being confused with the real one

If not verified:

- record blocker
- send client verification instructions
- Manager follows up until complete
- Systems Director can continue non-dependent setup, but review launch may be blocked

## Review Link Checklist

Google allows managers/owners to create and share a link or QR code to request reviews.

Primary click path:

1. Log into the Google Account that has access to the business.
2. Search Google for the business name or go to Google Business Profile.
3. Open the Business Profile controls for the correct business.
4. Select **Read reviews**.
5. Select **Get more reviews**.
6. Copy the review link, or open the QR/share option and copy the link from there.

Alternate wording Google may show:

- "Ask for reviews"
- "Get more reviews"
- "Share review form"
- review link / QR code share option

Proof checks:

- The link opens a Google review flow for the correct business.
- The business name shown is the exact client/GMF profile, not a similarly named business.
- The profile is verified enough for reviews to be requested.
- The link is public and does not include private admin/session-only URLs.

If blocked:

- Record which Google account is logged in.
- Record whether the profile control panel is visible.
- Record whether the business is verified.
- Record whether the profile tools show "Read reviews" or "Ask for reviews."
- Do not make public edits or publish posts while trying to get the link.

Profile should capture:

- Google review link
- business/location name
- review count
- average rating
- last review date
- number of unreplied reviews

Hand review link to Reviews Manager for GMF-owned review requests. Hand it to Systems Director if a temporary GHL bridge still needs the value.

## Profile Health Checklist

For Get Found / Stay Found baseline:

- name
- address/service area
- phone
- website
- hours
- category
- services
- photos/logo
- reviews
- unanswered reviews
- Q&A

For AI Ready / AEO checks:

- citations/NAP consistency
- review velocity
- profile completeness
- services/categories
- recent posts
- competitor gaps
- AI/search mention tests

## Publishing Handoff

Press can publish approved content to GBP through HighLevel/Social Planner when connected.

Profile owns whether the GBP is healthy and correctly connected. Profile Manager/Coach own approved publishing cadence/content proof.

## Tool Awareness

Profile should understand enough of the current tool stack to know the handoff:

- GHL may still be a temporary bridge for legacy exports or review data while GMF exits it.
- GMF-owned review requests use Supabase, Resend, protected proof pages, and client hubs.
- SMS belongs to Review Power and waits for A2P, opt-in, STOP handling, and sample approval.
- If a connected token expires or shows action required, Profile confirms Google access and Systems Director handles the tool-side fix.

## Common Blockers

Client invited wrong email:

- Manager asks client to cancel and invite the official GMF account or business group.

Client cannot find People and access:

- send screenshot/video
- ask client to search for their business in Google while signed into the owner account
- use Business Profile Manager if they manage multiple locations

Client does not own the profile:

- identify who owns it
- request access
- have owner add GMF

Profile not verified:

- review launch may be blocked
- client must complete verification
- Manager keeps follow-up alive

Multiple locations:

- confirm exact location to connect
- record each location separately
- avoid connecting the wrong branch

Wrong Google account:

- GMF may have access under a different account
- Systems Director must use the same account that has manager access when a tool connection is needed

## Source Links

- Google owner/manager permissions: https://support.google.com/business/answer/3403100
- Google agency invites: https://support.google.com/business/answer/7655924
- Google agency registration: https://support.google.com/business/answer/7353903
- Google agency overview: https://support.google.com/business/answer/9199701
- Google business groups: https://support.google.com/business/answer/6085326
- Google manage agency business groups: https://support.google.com/business/answer/7655842
- Google manage customer reviews and review links: https://support.google.com/business/answer/3474050
- Google manage reviews across profiles: https://support.google.com/business/answer/3098204
- Google review API capabilities: https://developers.google.com/my-business/content/review-data
- HighLevel GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- HighLevel GBP Optimization: https://help.gohighlevel.com/support/solutions/articles/155000005837-easily-optimize-your-google-business-profile-in-highlevel
- HighLevel GBP Post Scheduler: https://help.gohighlevel.com/support/solutions/articles/155000007212-google-business-profile-gbp-post-scheduler-in-highlevel
