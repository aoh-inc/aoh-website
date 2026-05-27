# Backup Readiness Checklist

Status: active
Purpose: quick recurring check that GetMeFound can survive laptop loss, account lockout, or agent-runtime failure.

Owner agent: Systems Director
Reviewer: Auditor
Implementer: Codex/Website
Human approver: Mike

## Current Known Backup Map

| Area | Source of truth | Current recovery confidence |
|---|---|---|
| Website code | GitHub `mje-gmf/website` | High if changes are pushed |
| Live website | Vercel project `aoh-inc/getmefound` | High |
| Production env vars | Vercel project settings | Medium until manually confirmed |
| Client/training docs | Google Drive + Obsidian | Medium until sync is confirmed |
| Agent architecture notes | Repo docs + Obsidian sync | Medium |
| OpenClaw/Atlantis | VPS | Medium until access is tested |
| VPS operations docs copy | VPS `/root/gmf-docs` | Medium; checked 2026-05-27 |
| Mission Control | Vercel at `mc.getmefound.ai` with legacy fallback hosts | Medium |
| OpenClaw gateway token | Vercel env var `OPENCLAW_TOKEN` + VPS `/docker/openclaw-dntw/.env` | Medium; rotated 2026-05-17, keep in password manager |
| OpenClaw login password | Vercel env vars `OPENCLAW_LOGIN_USER` + `OPENCLAW_LOGIN_PASSWORD` | Medium; route fails closed if password is missing |
| OpenClaw login wrapper patch | VPS `/docker/openclaw-dntw/server.mjs` mounted by compose | Medium; bootstraps dashboard auth without browser URL token exposure |
| Passwords/secrets | Password manager | Unknown until Mike confirms |
| Local `.env.*` files | Laptop only unless recreated | Low by design |
| Uncommitted work | Laptop only | Low |

## Green Means

- `git status --short --branch` shows no important uncommitted work.
- latest important work is pushed to GitHub.
- Vercel has all production env vars.
- Obsidian vault sync is current.
- Google Drive training/client folders are accessible.
- password manager includes all critical accounts.
- VPS/OpenClaw can be reached without relying on cached laptop-only credentials.
- `npm run audit:security` passes before operator/security-sensitive deploys.
- `npm run systems:readiness` produces a current report.
- OpenClaw gateway token is stored in Vercel env vars and not in source code.
- OpenClaw gateway token in Vercel matches the VPS `OPENCLAW_GATEWAY_TOKEN`.
- `/api/openclaw/login` requires Basic Auth and returns locked/unauthorized before showing the OpenClaw form.
- OpenClaw login redirects through `/__aoh-token-bootstrap` and does not show `#token=` in the browser URL.

## Red Flags

- local-only files not committed or copied to Drive
- env values only stored in `.env.local`
- SSH key only exists on the laptop
- Obsidian vault is local-only
- Drive files are downloaded locally but not uploaded
- GitHub/Vercel/GHL/Stripe recovery depends on a device you no longer have
- token, password, or API key appears in a browser URL or screenshot
- `NEXT_PUBLIC_*` env var name contains token, secret, password, API key, or private key

## 10-Minute Monthly Drill

1. Open GitHub repo in browser.
2. Open Vercel project and confirm latest deployment.
3. Run or review `npm run systems:readiness`.
4. Open Obsidian on another synced device or web/sync target if available.
5. Open GHL/Hub360AI.
6. Open Stripe.
7. Open VPS provider.
8. Open Mission Control/OpenClaw.
9. Confirm Slack agent channel still exists.
10. Confirm password manager has every account above.

## Laptop Dies: First Question

Ask: "What work exists only on the laptop?"

If the answer is "none," the recovery is annoying but not dangerous.

## Agent Ownership

Systems Director owns recurring monitoring and status summaries.

Auditor verifies backup proof and restore readiness.

Codex/Website implements scripts, workflows, and non-destructive fixes.

Mike approves paid, destructive, account, domain, token-rotation, and production-restore actions.
