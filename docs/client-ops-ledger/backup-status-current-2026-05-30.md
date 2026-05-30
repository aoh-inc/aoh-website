# Backup Status Current - 2026-05-30

Owner: Systems Director / Manager
Reviewer: Auditor
Mode: non-destructive backup/readiness check

## Direct Answer

The launch work is now backed in the agent-owned places we can safely control: GitHub main, GitHub backup branches, the AOH archive remote backup branch, a verified git bundle, source zip backups, Obsidian, Google Drive, Proton Drive, iCloud Drive, the VPS `/root/gmf-docs` backup folder, and a Vercel preview deployment. Supabase backup/PITR proof and Hostinger provider snapshot proof still require provider dashboard/API evidence; no paid or destructive backup changes were made.

## Backed Now

| Destination | Status | Proof |
|---|---|---|
| GitHub main | Backed | `origin/main` is pushed and includes the launch backup work plus this current backup-status report. Verify exact restore HEAD with `git rev-parse HEAD` after cloning/restoring. |
| GitHub backup branch | Backed | `origin/backup/gmf-launch-20260530-080040` at commit `d4b1f1200cb85b07831c8eaba19e56306dd7bcac` |
| AOH archive backup branch | Backed | `aoh-archive/backup/gmf-launch-20260530-final` at commit `08d4480f8d0ef310369b4a0af1e0eba0388f23ff`; pushed with the stored `AiOutsourceHub` GitHub auth path |
| Local portable backup | Backed | `C:\Users\micha\Documents\GMF Backups\2026-05-30-0800-aoh-website` |
| Obsidian portable backup | Backed | `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Backups\2026-05-30-0800-aoh-website-portable` |
| Google Drive portable backup | Backed | `G:\My Drive\GMF Backups\2026-05-30-0800-aoh-website` and `H:\My Drive\GMF Backups\2026-05-30-0800-aoh-website` |
| Proton Drive portable backup | Backed | `C:\Users\micha\Proton Drive\ctlkng4fun\GMF Backups\2026-05-30-0800-aoh-website` |
| iCloud Drive portable backup | Backed | `C:\Users\micha\iCloudDrive\GMF Backups\2026-05-30-0800-aoh-website` |
| VPS portable backup | Backed | `/root/gmf-docs/backups/2026-05-30-0819-aoh-website` on `atlantis`; SSH alias works and remote SHA256 hashes match local hashes |
| Git bundle restore check | Pass | `git bundle verify` passed for `aoh-website-all-refs.bundle`; bundle records complete history and 21 refs |
| Vercel preview | Backed | `dpl_5mWX4H1ePbN5tBeJjar3T8qceQgW`, Ready, `https://getmefound-o25k051l1-aoh-inc.vercel.app` |
| Obsidian docs snapshot | Backed | `C:\Users\micha\Obsidian\Oracle\04 AI Outsource Hub\Operations\GMF Backups\2026-05-30 aoh-website launch snapshot` |
| Security sweep | Pass | `npm run audit:security` passed after renaming a false-positive public OAuth endpoint constant |
| Local build | Pass | `npm run build` passed before preview deployment |
| Vercel project identity | Pass | `aoh-inc/getmefound`, project id `prj_NyxkjegahECBSR2MYZ4wTGVG0tMb` |
| Systems Director readiness | Pass with warnings | Latest run: 10 pass, 4 warn, 0 fail, 0 skipped |

## Still Not Fully Proven

| Destination / System | Status | Why |
|---|---|---|
| Production Vercel | Not updated | Preview was deployed; production deploy remains gated until release approval. |
| Hostinger VPS snapshots | Not proven | VPS SSH and `/root/gmf-docs` backup are proven, but Hostinger provider-level snapshots require hPanel/API proof. No `HOSTINGER_API_TOKEN` or provider proof path exists in the repo/env. |
| Supabase backups/PITR | Not proven | Requires Supabase dashboard/API proof. Local `.env.local` has app keys but no `SUPABASE_ACCESS_TOKEN`; Supabase CLI is not logged in or linked to the project. Paid PITR changes require Mike approval. |
| Password manager recovery | Not agent-verifiable | Requires owner/provider verification that recovery entries exist. |

## Actions Taken

1. Ran current Systems Director readiness check.
2. Fixed the security sweep false positive in `scripts/gbp-access-verifier.mjs`.
3. Confirmed `npm run audit:security` passes.
4. Created and verified a GitHub backup branch.
5. Confirmed `origin/main` is updated with the latest backup commit.
6. Created a verified portable git bundle and source zip.
7. Copied portable backups to local Documents, Obsidian, Google Drive, Proton Drive, and iCloud Drive.
8. Created an Obsidian docs snapshot with 709 docs files and a manifest.
9. Deployed a Vercel preview from the current working tree.
10. Confirmed Vercel preview status is Ready.
11. Repaired the archive remote backup path using the stored `AiOutsourceHub` GitHub auth token without exposing the token value.
12. Pushed `aoh-archive/backup/gmf-launch-20260530-final` at commit `08d4480f8d0ef310369b4a0af1e0eba0388f23ff`.
13. Repaired VPS SSH proof path; alias `atlantis` works from this runtime.
14. Confirmed `/root/gmf-docs` and `/docker/openclaw-dntw` exist.
15. Uploaded the portable backup bundle, source zip, manifest, and backup report to `/root/gmf-docs/backups/2026-05-30-0819-aoh-website`.
16. Verified local and remote SHA256 hashes match for all four VPS backup files.
17. Re-ran `npm run systems:readiness -- --deep`: 10 pass, 4 warn, 0 fail, 0 skipped.

## Next Safe Actions

- Keep the GitHub backup branch and portable bundle until after launch stabilization.
- Do not deploy production until the release gate passes.
- Systems Director needs Supabase backup/PITR proof before high client volume.
- Systems Director needs Hostinger hPanel/API proof for provider-level VPS snapshots/backups; the agent-owned VPS file backup is already complete.
- Mike only needs to be involved if provider dashboards require owner login, paid backup/PITR changes, paid VPS snapshot changes, or password-manager recovery verification.
