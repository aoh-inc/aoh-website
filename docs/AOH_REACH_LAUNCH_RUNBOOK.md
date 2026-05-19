# AOH Reach Launch Runbook

Status: controlled pilot launch source of truth
Owner: Manager
Specialists: Scout, Sender, GHL Expert, Auditor
Last updated: 2026-05-19

## Purpose

This runbook defines how AOH launches cold email pilots with the least possible
manual work from Mike.

Mike decides:

- lane
- industry
- area / nearby-town radius idea
- daily volume

The system handles:

- prospect scrape
- email/contact enrichment
- GHL contact create/update
- correct campaign start tag
- drip workflow start
- reply workflow routing
- tags, pipeline movement, and QA

## Active Location

Live HighLevel location:

`tRbczwt6oJsXK4tjuzOI`

Do not use `AOH Client Template Lab` for live campaign work.

## Dedicated Sending Domains

Reviews:

- dedicated domain: `mail.aioutsourcehubs.com`
- from email: `mike@mail.aioutsourcehubs.com`
- offer: Review Automation
- report-delivery offer: first month `$1`, then `$49/mo`, no setup, cancel anytime

AI Visibility:

- dedicated domain: `mail.getaioutsourcehub.com`
- from email: `mike@mail.getaioutsourcehub.com`
- offer: AI Visibility Snapshot / AI Visibility service
- report-delivery offer: free snapshot first; paid service handled after interest/call

Relay:

- dedicated domain: `mail.myaioutsourcehub.com`
- from email: `mike@mail.myaioutsourcehub.com`
- offer: after-hours Relay / missed-call coverage
- report-delivery offer: calculator/details first; paid service handled after interest/call

All lanes:

- from name: `Mike | AI Outsource Hub`
- reply-to: `mike@aioutsourcehub.com`
- physical mailing address/footer must remain present
- GHL unsubscribe/footer must remain enabled where applicable
- no HighLevel AI features may be enabled

## Dedicated Domain Warmup Ladder

Apply this ladder per dedicated sending domain:

Days 1-3:

- `10-20` emails/day

Days 4-6:

- `40-50` emails/day

Days 7-9:

- `80-100` emails/day

After Day 9:

- check sending status, warmup level, bounces, spam placement, replies,
  unsubscribes, and complaints before increasing again

Do not increase a domain when:

- bounce rate is elevated
- spam placement looks bad
- unsubscribe/complaint rate is elevated
- replies are mostly negative
- workflow logs show duplicates, broken merge fields, or wrong sender domain

## Workflow Names

Cold drip workflows:

- `Reviews Special - Pilot Drip`
- `AI Visibility - Pilot Drip`
- `Relay - Pilot Drip`

Reply delivery workflows:

- `Campaign Reply - Reviews Send`
- `Campaign Reply - AI Visibility Send`
- `Campaign Reply - Relay Send`

## Start Tags

Reviews:

- `aoh_campaign_reviews_start`

AI Visibility:

- `aoh_campaign_ai_visibility_start`

Relay:

- `aoh_campaign_relay_start`

The launcher starts a drip by adding the correct start tag. Mike should not need
to tag contacts manually.

## Drip Workflow Shape

Each cold drip should use:

1. Contact Tag trigger for the lane start tag
2. Send Email 1
3. Wait 3 days
4. Contact Reply branch -> End
5. Time Out branch -> Send Email 2
6. Wait 3 days
7. Contact Reply branch -> End
8. Time Out branch -> Send Email 3
9. End

Settings:

- `Stop on Response` ON
- Track clicks OFF
- UTM tracking OFF
- Add Tags toggle inside email OFF
- no SMS
- no voicemail
- no tasks
- no opportunities in cold drip
- no Workflow AI / GPT actions

Opportunities happen later in reply workflows after the prospect replies.

## Reply Workflow Shape

Reviews and AI Visibility reply workflows:

- trigger: Customer Replied contains `send`
- move/create opportunity in matching Reach pipeline at `Warm Leads`
- add requested tag
- generate or route the correct report
- send exactly one report delivery email
- add sent tag
- end

Relay reply workflow:

- trigger: Customer Replied contains `send`
- move/create opportunity in `Reach - Relay` at `Warm Leads`
- add `aoh_campaign_relay_details_requested`
- send missed-call calculator/details email
- add `aoh_campaign_relay_details_sent`
- end
- do not generate a report

## Pipelines

Reviews:

- pipeline: `Reach - Reviews`
- stage after `send`: `Warm Leads`

AI Visibility:

- pipeline: `Reach - AI`
- stage after `send`: `Warm Leads`

Relay:

- pipeline: `Reach - Relay`
- stage after `send`: `Warm Leads`

Do not put cold emailed contacts into opportunity pipelines just because they
were emailed. Create/update opportunities after a warm action such as reply.

## Local Launcher

Script:

`scripts/launch-reach-campaign.mjs`

NPM command:

`npm run reach:launch`

Preview only. This does not touch GHL and does not send:

```powershell
npm run reach:launch -- --lane reviews --industry "pet groomer" --area "Madison CT" --limit 10
```

Import/update contacts but do not start drip:

```powershell
npm run reach:launch -- --lane reviews --industry "pet groomer" --area "Madison CT" --limit 10 --commit
```

Import/update contacts and start drip:

```powershell
npm run reach:launch -- --lane reviews --industry "pet groomer" --area "Madison CT" --limit 10 --commit --start-drip
```

Lane values:

- `reviews`
- `ai`
- `relay`

Safety:

- the launcher defaults to dry run
- `--commit` is required before GHL is touched
- `--start-drip` is required before the start tag is added
- Mike must approve after preview before the live command is run

## Manual Operating Model Until Agents Are Wired

Mike sends:

```text
Lane:
Industry:
Area:
Limit:
```

Example:

```text
Lane: reviews
Industry: pet groomer
Area: Madison CT
Limit: 10
```

Assistant runs preview and summarizes the list.

Mike says:

```text
approve
```

Assistant runs the live command.

## First Pilot Recommendation

Start with Reviews because:

- simplest pain
- easiest offer to understand
- lowest price/friction
- Outscraper data supports review/rating personalization

First tiny pilot:

- lane: `reviews`
- industry: `pet groomer`
- area: `Madison CT`
- limit: `10`

## Launch Blockers

Do not start a live drip if any are true:

- workflow not published
- `Stop on Response` is not ON
- wrong start tag
- wrong sender domain
- click tracking or UTM is ON
- no physical mailing address/footer
- unsubscribe footer disabled
- reply workflow not published
- report/details delivery email not tested
- GHL AI feature enabled
- merge fields render visibly broken
- launch command has not been previewed

## Current Dry Run Results

The launcher was tested in dry-run mode on 2026-05-19. It did not touch GHL and
did not send emails.

Generated files:

- `tmp-reach-dryrun.json`
- `tmp-reach-npm-dryrun.json`

Example prospects found:

- Wonder Paws Pet Spa
- A Hair of the Dog LLC
- Clean Paws Mobile Spa

These were preview outputs only.
