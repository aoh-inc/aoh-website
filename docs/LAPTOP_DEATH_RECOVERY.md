# Laptop Death Recovery Runbook

Status: active
Owner: Systems Director / Mike
Use this when the laptop is lost, dead, stolen, or wiped.

## What Should Still Work

- Public website stays live on Vercel.
- Website source code is recoverable from GitHub: `https://github.com/mje-gmf/website`.
- Google Drive files remain available through Google.
- Vercel production environment variables remain in Vercel.
- Stripe/GHL/Google accounts remain available through their own logins.
- OpenClaw/Atlantis should keep running on the VPS if it is not laptop-hosted.

## What May Be Lost If Not Synced

- Uncommitted local code changes.
- Local `.env.*` files.
- Local downloads, screenshots, generated assets, and scratch files.
- Obsidian vault changes if the vault is not syncing.
- Local-only agent/runtime state.
- SSH keys if they are only on the laptop.

## New Laptop Restore Order

### 1. Regain Account Access

Log into the password manager first.

Confirm access to:

- Google account
- GitHub `mje-gmf`
- Vercel
- Stripe
- GoHighLevel / Hub360AI
- domain/DNS provider
- VPS/hosting provider
- Slack
- Google Drive
- Obsidian sync provider, if used

If any of these are missing from the password manager, fix that before a disaster happens.

### 2. Install Base Tools

Install:

- Git
- Node.js LTS
- npm
- VS Code or Cursor
- Vercel CLI, if needed
- GitHub CLI, if needed
- Tailscale, if used for VPS/OpenClaw access
- Obsidian

### 3. Restore Website Repo

```powershell
mkdir C:\Users\micha\Documents
cd C:\Users\micha\Documents
git clone https://github.com/mje-gmf/website.git aoh-website
cd aoh-website
npm install
npm run build
```

If `npm run build` passes, the website code is restored.

### 4. Restore Environment Variables

Do not rely on old local `.env.*` files.

Use Vercel as the source of truth for production env vars:

- Vercel project settings
- Environment Variables
- Production / Preview / Development

Then recreate `.env.local` only for local development.

Never commit `.env.local`.

### 5. Restore Obsidian

Open Obsidian and restore the vault:

- expected local path: `C:\Users\micha\Obsidian\Oracle`
- AOH training path: `04 AI Outsource Hub/02 Training`

Confirm the latest AOH notes are present before trusting Coach/agent knowledge.

### 6. Restore Google Drive Working Files

Confirm access to:

- onboarding checklist docs
- client onboarding docs
- training videos
- screenshots
- customer/client folders

Google Drive should be treated as the source for shared client docs and raw training assets.

### 7. Restore OpenClaw / Atlantis Access

Known current notes from AOH architecture docs:

- primary VPS host alias: `atlantis`
- current host: `srv1587689.hstgr.cloud`
- current IP noted in docs: `2.24.198.207`
- legacy host noted in docs: `srv1530955.hstgr.cloud`

Confirm:

- SSH key or provider console access exists
- Tailscale access works if enabled
- OpenClaw Mission Control URL works
- Slack integration works
- agent processes are running

If SSH keys were only on the dead laptop, use the VPS provider console to add a new public key.

### 8. Verify Production Website

Check:

- `https://getmefound.ai`
- `https://getmefound.ai/pricing`
- `https://getmefound.ai/mike-mc`
- Vercel latest deployment
- GitHub latest commit

Run locally:

```powershell
npm run build
```

### 9. Resume Work

Before editing:

```powershell
git pull
git status --short --branch
```

If the branch is behind, pull first. If local files are dirty unexpectedly, stop and inspect before changing anything.

## Weekly Backup Habit

Every Friday:

- commit/push finished website changes
- run `npm run systems:readiness`
- confirm Obsidian sync is current
- confirm Google Drive has latest working docs
- confirm Vercel env vars are still present
- confirm password manager has all critical accounts
- confirm VPS/OpenClaw access works

## Absolute Minimum Disaster Kit

These must be recoverable without the laptop:

- password manager login/recovery
- GitHub login/recovery
- Google login/recovery
- Vercel login/recovery
- VPS provider login/recovery
- domain/DNS login/recovery
- Stripe login/recovery
- GHL/Hub360AI login/recovery
- Slack login/recovery

If any of these depend only on the laptop, the laptop is still a single point of failure.
