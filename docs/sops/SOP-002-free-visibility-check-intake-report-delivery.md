# SOP 002 - Free Visibility Check Intake To Report Delivery

Status: Drafted
Version: 0.4
Owner: Systems Director
Reviewer: Auditor / Sales Manager
Approver: Manager
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-002-free-visibility-check-intake-report-delivery.md`

## Purpose

Turn a homepage free visibility check request into an automated, claim-safe prospect report email that arrives within five minutes and routes the prospect to Get Found.

## Covered Master Map Rows

- Free visibility check request intake
- Free visibility scan research
- Prospect visibility report build
- Prospect report claim audit
- Prospect report delivery email

## Scope

Covers prospect-facing homepage form intake, NoBounce/NeverBounce verification, dedupe, public GBP/Outscraper enrichment, safe fallback copy, report email delivery, click/opt-out logging, and handoff to nurture.

Does not cover client onboarding, full client baseline reports, recurring monthly reports, or abandoned checkout recovery.

## Trigger

- Website free visibility check CTA submission
- Manual lead asks for a free report
- Sales Rep requests a scan/report for a qualified prospect
- Warm prospect asks for a visibility scan from outreach

## Roles

| Role | Responsibility |
|---|---|
| Systems Director | Maintains endpoint, NoBounce/NeverBounce, Outscraper, Resend, Supabase logs, and failure recovery |
| Automation | Verifies email, enriches public facts, sends report, logs events, and enrolls nurture |
| Sales Rep | Owns replies, nurture, and buyer handoff after the automated report |
| Scout | Performs manual public research only when automation cannot safely enrich |
| Reporter | Builds manual prospect report artifacts only when requested outside the homepage fast path |
| Auditor | Reviews templates, claim safety, proof logs, and failed/edge-case sends |
| Sales Manager | Resolves offer-fit or custom-promise questions |

## Hard Rules

- A free report is a sales asset, not a client deliverable.
- Do not open onboarding from a free report alone.
- Do not show the full client-only scoring rubric or full competitor audit.
- Homepage free visibility reports are automated once the template and guardrails are approved.
- Never email a blank, guessed, or low-confidence stat. Omit that line or use safe generic phrasing.
- Verify the email with NoBounce or the existing NeverBounce verifier before storing/sending an accepted homepage request.
- Dedupe repeat same-email/same-business requests through rate limiting and recent Supabase visibility-report lookup.
- Use Resend from the authenticated GMF sender domain with physical address and opt-out.
- Do not promise rankings, reviews, revenue, Google placement, AI Overview inclusion, AI Mode visibility, or timelines.
- Sales Rep does not manually touch normal homepage report delivery.

## Procedure

1. Intake the homepage request.
   - Capture business name and email.
   - Apply honeypot, Turnstile if configured, IP rate limit, email rate limit, and same-email/same-business dedupe.
   - Check recent `visibility_reports` rows before sending so a repeat request does not create a duplicate report email.
   - Verify email with NoBounce or the existing NeverBounce verifier. If invalid/risky, do not send.

2. Store the accepted request.
   - Use `prospect_free_check` for website CTA reports.
   - Store in Supabase `visibility_reports` with `lead_status = free_check_queued`.
   - Log `requested` and `email_verified` in `visibility_report_events`.

3. Run fast automation.
   - Route runs `processFreeVisibilityReport` through Next/Vercel `after()`.
   - Set `report_status = building` and `lead_status = free_check_processing`.
   - Target end-to-end delivery is under five minutes. If enrichment is slow or unavailable, send the fallback report from safe available fields instead of waiting.
   - Do not create a manual agent task unless delivery fails.

4. Enrich public GBP facts.
   - Use Outscraper Google Maps Search only.
   - Pull review count, rating, photos, hours, primary category, city/state, and a nearby competitor review count when confidence is high.
   - If Outscraper is missing, slow, or ambiguous, send a safe generic report without guessed stats.

5. Send report email.
   - Send plain-text-leaning email from the authenticated GMF Resend sender.
   - Use the Visibility Engine voice: opportunity, first-mover urgency, and a clear note that Google AI, ChatGPT, Claude, and Gemini check many signals together.
   - Include only safe facts, Get Found $149 CTA, 48 hours, no contract, satisfaction guarantee, physical mailing address, and opt-out link.
   - CTA points to `/checkout/get-found-refresh` through click tracker `/api/report-click`.

6. Log and enroll nurture.
   - Log enrichment result, email send, click, unsubscribe, and purchase events.
   - Set `report_status = sent` and `lead_status = report_sent_nurture_enrolled`.
   - Nurture stops on purchase, reply, bounce, or opt-out.

7. Failure handling.
   - Retry email send once.
   - If sending still fails, create a high-priority Systems Director task.
   - Do not ask Mike until Systems Director exhausts Resend, Supabase, env, and retry-path checks.

## Required Proof

- `visibility_reports` row with run ID
- `visibility_report_events`: requested, email_verified, automation_started, enrichment result, nurture_enrolled, click/unsubscribe/purchase when applicable
- `email_events`: report send/skipped/failed and opt-out
- Resend provider ID
- Checkout link with run ID metadata
- Failure task only if automation cannot complete

## Communication Rule

Free report emails should be short, useful, and plain-English. Position Get Found as the next step using authority, specificity, the Visibility Engine, and the guarantee. Do not use testimonials until GMF has real customers and approved proof.

## Required Credentials / APIs

- `OUTSCRAPER_API_KEY` for public Google Business Profile enrichment.
- `NOBOUNCE_API_KEY` or `NEVERBOUNCE_API_KEY` for email verification.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` from an authenticated GMF sending domain.
- `GMF_PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_URL` for trusted email/checkout links.
- Supabase URL/public key/secret key for request, event, suppression, and purchase logging.

## Failure Or Blocker Handling

- Missing/ambiguous public data: Automation omits exact stats and sends safe generic phrasing.
- No public footprint: Automation notes limited public data and recommends foundation cleanup.
- Risky claim/template drift: Auditor blocks the template until corrected.
- Prospect asks for custom scope/pricing: Sales Manager reviews before response.
- Prospect pays: Stripe webhook stops nurture and triggers sales-to-client handoff.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded intake-to-report-delivery workflow and prospect/client separation rules | Coach |
| 0.3 | 2026-05-29 | Converted homepage free visibility check to automated NeverBounce, Outscraper, Resend, click/opt-out, and Stripe stop-flow path | Systems Director / Elon |
| 0.4 | 2026-05-29 | Added NoBounce alias, under-five-minute delivery target, Visibility Engine copy rules, and required credential list | Systems Director / Elon |

## Source Documents

- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/GMF_WEBSITE_MESSAGING_CLIENT_HOME_BRIEF.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
