# Review Power Agent Skills

Status: draft source of truth
Scope: what each agent must know before GMF runs self-serve review request onboarding for real clients.

## Service Principle

The client completes access and intake asynchronously. Agents do the backend setup after the client finishes enough of the onboarding package.

Default path:

1. Client buys Stay Found or Review Power.
2. Client gets self-serve instructions with screenshots and video.
3. Client fills out business info and invites GMF as Google Business Profile Manager.
4. Profile confirms access.
5. Systems Director confirms the GMF-owned sender, storage, and proof path.
6. Sorter/Reviews Manager handle customer list and POS/CRM connection as the next phase.
7. Auditor verifies launch.

Stay Found is email-only review requests plus weekly GBP post, review monitoring, and monthly report. Review Power adds compliant SMS after A2P readiness, AI-drafted replies in the client's voice, alerts, and sentiment/citation reporting. AI Ready Bundle adds voice readiness, content, strategy, and AEO checks.

## Scout Skill Pack

Purpose: keep the knowledge current.

Scout must know how to research:

- official HighLevel docs only while GHL remains a bridge for legacy exports or temporary data
- official docs for email, SMS/A2P, phone/voice, and CRM/POS integrations as upgrade/service modules
- official Google Business Profile docs for owners/managers, agency invites, verification, reviews, posts, photos, services, and profile edits
- saved GMF Drive/Obsidian SOPs and checklist notes
- edge cases from client onboarding problems

Scout output should be:

- source link
- plain-English summary
- what changed
- what agent needs to learn it
- suggested SOP update

Scout should hand research to Coach, not directly rewrite specialist instructions without review.

## Coach Skill Pack

Purpose: turn raw knowledge into usable training.

Coach must maintain:

- client-facing onboarding instructions
- agent-facing SOPs
- troubleshooting guides
- glossary of GHL/GBP terms
- "done means" checklists
- training examples for each agent

Coach should keep client instructions simple and task-based. Specialist detail belongs in agent SOPs, not client pages.

## Profile Skill Pack

Purpose: own Google Business Profile access and profile readiness.

Profile must know:

- how a client adds GMF as a Google Business Profile Manager
- the difference between Owner and Manager
- what Managers can do and cannot do
- how GMF accepts manager invites
- how to confirm the correct GBP location
- how to check if GBP is verified
- how to find or generate the Google review link
- how to identify if the wrong Google account/location was connected
- how to check basic profile health: name, address, phone, website, hours, categories, services, photos, reviews, unanswered reviews
- when to hand off to Reviews Manager or Systems Director

Profile should know that Manager access gives GMF authority over the profile, but it does not automatically connect the profile to any sender, CRM, or workflow tool. Systems Director owns the tool connection path.

Profile "done" means:

- GMF manager invite accepted
- correct business/location confirmed
- GBP verified or verification blocker recorded
- review link captured
- any access/profile blocker assigned to Manager
- Reviews Manager and Systems Director are notified that GBP is ready to use

## Systems Director Skill Pack

Purpose: own GMF-owned sender, storage, compliance, and automation safety.

Systems Director must know:

- how to confirm the client profile exists in Supabase
- how to confirm review events and proof pages are storing correctly
- how to confirm email sender health
- how to keep Stay Found email-only
- how to confirm SMS/A2P readiness before Review Power SMS sends
- how to configure protected endpoints and webhooks
- how to configure phone/voice basics for AI Ready only after approval
- how to connect POS/CRM later through native integration, Zapier, CRM Connector, or manual CSV flow
- how to test the setup before launch

Systems Director "done" means:

- client profile exists
- review proof page and customer upload path work
- sender health passes
- SMS readiness is blocked unless A2P/opt-in/STOP/sample approval are complete
- review request workflow is protected by internal approval
- launch test passed or blocker assigned
- Auditor notified for verification

## Sorter Skill Pack

Purpose: own customer list readiness.

Sorter must know:

- accepted list formats
- required fields: name, email, phone
- how to clean headers
- how to split combined fields
- how to dedupe
- how to remove bad rows
- how to flag missing consent or risky records
- how to exclude customers the client does not want contacted
- how to prepare a clean import file for Reviews Manager

Sorter "done" means:

- list is clean enough to import
- columns are mapped
- exclusions are removed
- risks are documented
- Reviews Manager has the prepared list

## Auditor Skill Pack

Purpose: verify setup and monitor early launch.

Auditor must know how to check:

- GBP is connected to the correct client
- review link points to the correct profile
- workflows are active only where intended
- test contact receives the expected message/email
- reply number and links are correct
- AI reply tone/signature are correct if the client has Review Power
- customer list import did not create obvious bad data
- first 1-2 weeks of send/review activity

Auditor "done" means:

- launch QA passed
- proof notes/screenshots exist
- monitoring cadence is scheduled
- blockers are assigned to Manager or the correct specialist

## Manager Skill Pack

Purpose: keep the client moving.

Manager must know:

- what onboarding items are required before agent setup
- what can wait until after base setup
- when to ask client for missing access
- when to ask Mike for a decision
- how to assign each blocker to the right agent
- how to report status to the client

Manager "done" means:

- client is in the correct stage
- all blockers have one owner
- client has been told what is missing or what is complete
- Mission Control reflects the current truth

## Client Self-Serve Onboarding Sections

Client-facing instructions should be built around these sections:

1. Business information
2. Review request/customer-flow preferences
3. Google Business Profile manager invite to GMF
4. Customer list upload, optional at first
5. POS/CRM information for later integration
6. Upgrade-only reply/SMS/social details, only if included
7. Final confirmation

## Current Research Anchors

- Google says Business Profile Managers can edit profile info, manage posts/photos, respond to reviews, respond to Q&A, and download insights, but cannot add/remove users or remove the profile.
- Google supports agency-style management through organization/business group invites.
- HighLevel says connecting GBP lets businesses sync Google messages, reviews, and reputation data into the CRM.
- Google Business Profile APIs can list, retrieve, and reply to reviews when properly authorized.

## Source Links

- Google Business Profile owner/manager permissions: https://support.google.com/business/answer/3403100
- Google Business Profile agency invites: https://support.google.com/business/answer/7655924
- HighLevel GBP integration: https://help.gohighlevel.com/support/solutions/articles/48001222899-how-to-integrate-google-business-profile-gbp-with-highlevel
- HighLevel Reputation Management docs: https://help.gohighlevel.com/support/solutions/48000449583
- Google review API capabilities: https://developers.google.com/my-business/content/review-data
