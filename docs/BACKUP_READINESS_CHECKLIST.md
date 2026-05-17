# Backup Readiness Checklist

Status: active
Purpose: quick recurring check that AOH can survive laptop loss.

## Current Known Backup Map

| Area | Source of truth | Current recovery confidence |
|---|---|---|
| Website code | GitHub `aoh-inc/aoh-website` | High if changes are pushed |
| Live website | Vercel | High |
| Production env vars | Vercel project settings | Medium until manually confirmed |
| Client/training docs | Google Drive + Obsidian | Medium until sync is confirmed |
| Agent architecture notes | Repo docs + Obsidian sync | Medium |
| OpenClaw/Atlantis | VPS | Medium until access is tested |
| Mission Control | Vercel at `mc.aioutsourcehub.com` | Medium until auth is added |
| OpenClaw gateway token | Vercel env var `OPENCLAW_TOKEN` | Medium until exposed token is rotated |
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
- OpenClaw gateway token is stored in Vercel env vars and not in source code.

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
3. Open Google Drive AOH folder.
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
