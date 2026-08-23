# Hand-off: publishing yash.piratla.com

This is the one-time ownership, hosting, and DNS handoff for Yash. The site is already available for
review at <https://yash-piratla.vercel.app>. The intended production URL,
<https://yash.piratla.com>, is not connected yet.

There is no reliable fixed-time estimate for this process. Account access and DNS propagation are
the variable parts; DNS often updates quickly but can take 24–48 hours in some resolvers.

## 1. Complete the shared GitHub ownership-transfer preflight

Both Vercel paths below require this preflight. Do not begin either Vercel path until the GitHub
repository transfer and local-remote update are complete.

### Required preflight for both Vercel paths

Before transfer, merge all approved work from Yash's current fork into
`Johaan-Mannanal/yash-portfolio` and create a verified backup of any work that is not merged.
Record the relevant commit SHAs and verify the backup can be recovered before changing repository
ownership.

GitHub cannot transfer a repository into an account that already owns a repository with the same
name or a fork in the same network. Because `YashwanthPiratla/yash-portfolio` is currently a fork,
resolve that conflict first: prefer asking GitHub Support to detach the fork from the network, then
rename or move the detached archive so Yash no longer owns a repository named `yash-portfolio`.
Delete the fork only after the backup and its recovery have been verified. Confirm both the
same-name and fork-network conflicts are gone before initiating the transfer.

1. Johaan opens GitHub repository **Settings → General → Danger Zone → Transfer ownership** for
   `Johaan-Mannanal/yash-portfolio` and transfers it to `YashwanthPiratla`.
2. Yash accepts GitHub's transfer invitation.
3. Update each local checkout so its `origin` is
   `YashwanthPiratla/yash-portfolio`, then verify the remote before pushing:

   ```bash
   git remote set-url origin git@github.com:YashwanthPiratla/yash-portfolio.git
   git remote -v
   ```

After completing the shared preflight, choose only one Vercel path.

### Path A — Import a new Vercel project (recommended)

1. Yash signs into Vercel with GitHub and selects **Add New → Project**.
2. Import the now-owned `yash-portfolio` repository. An admin collaborator on a repository in
   another personal GitHub account is not sufficient for a personal Vercel import, so the GitHub
   transfer must happen first.
3. Keep the detected Astro settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
   - Node.js: 22.12 or newer
4. Deploy and inspect the generated `vercel.app` URL before changing DNS.

### Path B — Transfer the existing Vercel project

After the shared preflight, Johaan can instead transfer the existing `yash-portfolio` Vercel project
to Yash's Vercel team from **Project Settings → Transfer Project**. Follow Vercel's prompts for Git
integration. This retains the current deployment and project settings; do not also create a duplicate
project through Path A.

In either path, pushes to the connected production branch deploy automatically, and pull requests
receive preview deployments.

## 2. Add the domains in Vercel

In the project, open **Settings → Domains** and add:

1. `yash.piratla.com` as the primary site.
2. `piratla.com` redirected permanently to `yash.piratla.com`.
3. `www.piratla.com` redirected permanently to `yash.piratla.com`.

Keep this page open. Vercel shows the exact DNS record type and value required for each hostname.
Those values can change, so copy the values displayed by this specific Vercel project rather than
using a generic CNAME or IP from an older guide.

## 3. Preserve the old site if needed

`piratla.com` currently serves a GoDaddy Website Builder résumé page. Moving its web records to
Vercel replaces that site. Save screenshots or an export first if Yash wants an archive, then
disconnect Website Builder so it does not recreate its DNS records.

## 4. Update GoDaddy DNS carefully

Open GoDaddy **My Products → piratla.com → DNS**. Change only the web-hosting records requested by
Vercel.

Records observed during the handoff that conflict with the new site:

- `yash` has an `A` record pointing to `50.63.8.181`; delete it before adding Vercel's record for
  `yash`.
- The apex (`@`) has old Website Builder `A` values `76.223.105.230` and `13.248.243.5`; remove the
  old web-hosting values before adding Vercel's exact apex record.
- `www` aliases the old apex site; replace that web record with the exact value Vercel requests.

Before deleting anything, confirm the current records still match this list. DNS may have changed
since this document was written.

Do **not** delete MX or TXT records. The domain has Microsoft/Outlook mail configuration, and those
records are unrelated to web hosting. Do not use GoDaddy Domain Forwarding; Vercel handles the apex
and `www` redirects with HTTPS.

For each hostname, create the record exactly as Vercel displays it, including record type, name,
value, and any project-specific suffix. A default TTL is fine.

## 5. Wait for Vercel verification

Return to **Vercel → Settings → Domains** and refresh until all three domains show valid
configuration. Vercel provisions HTTPS after DNS validates.

Then verify in a private browser window:

- `https://yash.piratla.com` loads the portfolio with a valid certificate.
- `https://piratla.com` redirects to `https://yash.piratla.com`.
- `https://www.piratla.com` redirects to `https://yash.piratla.com`.
- `https://yash.piratla.com/Yash_Piratla_Resume.pdf` loads.
- Social metadata looks correct in an Open Graph preview tool.

Optional terminal checks:

```bash
dig +short yash.piratla.com
dig +short piratla.com
dig +short www.piratla.com
```

If Vercel still reports invalid configuration, compare every displayed record with GoDaddy and
check whether Website Builder recreated an old value. Public resolvers may also be serving cached
records during propagation.

## 6. Updating the site later

### GitHub editing workflow

Before the ownership transfer, Yash works from `YashwanthPiratla/yash-portfolio` and opens pull
requests into `Johaan-Mannanal/yash-portfolio`. Merge approved Yash changes before the transfer
preflight in Section 1.

After the transfer, `YashwanthPiratla/yash-portfolio` is the canonical repository. Pull its updated
`main`, create each revision branch from that commit, and open pull requests back into that same
repository. Do not treat `Johaan-Mannanal/yash-portfolio` as an independent upstream after the
transfer. Review every pull request through its Vercel preview before merging to production.

- **Résumé:** send Johaan a corrected `Yash_Piratla_Resume.pdf`; he will replace the current file,
  run the release checks, and deploy it.
- **FPV drone:** this is a group project. Do not expand it into a solo case study. When the separate
  group-built case study is published, set `caseStudyUrl` in
  `src/content/projects/fpv-drone.mdx` to its final URL. Do not invent or substitute a URL.
- **New project:** add images and one MDX file, including explicit `sections` metadata as shown in
  `README.md`.
- **Text or image edit:** export the current linked Google source document first, compare its media
  against `src/assets/img/**`, then update `src/content/**` or the relevant file in `src/pages/`.
  Do not assume an older downloaded DOCX still contains Yash's latest images.
- **Before publishing:** run `npm run check` and `npm run test:site`.

### Content guardrails

- Project-card thumbnails are navigation UI and may also appear as a case-study hero.
- Within a case-study page, do not repeat a hero or body image in another section.
- Wearable Health Telemetry is approved and must remain unchanged unless Yash supplies a newly
  approved revision.
- The current résumé PDF remains unchanged until Yash supplies a replacement file.
- Use only supplied project photos, CAD, and video; do not generate substitute engineering media.

### Project media still requested

- **Elevator:** failed motor mount or bent pulley and dedicated manufacturing/assembly photos.
- **Climber:** carbon-fiber hook close-up, hook-testing media, and the final mechanism installed on
  the robot.
- **Drivebase:** bumper mounts, battery mount, wiring close-ups, manufacturing-process photos, and
  a final full-robot photograph.

The current pages intentionally remain asset-honest until these files arrive.

For future drivebase video updates, replace `/media/drivebase-moving.mp4` with the supplied file.

## 7. Troubleshooting

- **Repository missing during Vercel import:** confirm Yash accepted the GitHub ownership transfer
  and allowed Vercel access to the repository.
- **Domain remains invalid:** remove conflicting web records and use the exact values shown by
  Vercel, not values copied from another project or an older guide.
- **`www` certificate error:** add `www.piratla.com` to the Vercel project as well as DNS.
- **Build failure:** inspect the named source file; a missing image under `src/assets/img/` is a
  common cause.
- **Résumé link returns 404:** the public filename must be exactly `Yash_Piratla_Resume.pdf`.
