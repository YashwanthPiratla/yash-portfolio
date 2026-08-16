# Hand-off: publishing yash.piratla.com

This is the one-time ownership, hosting, and DNS handoff for Yash. The site is already available for
review at <https://yash-piratla.vercel.app>. The intended production URL,
<https://yash.piratla.com>, is not connected yet.

There is no reliable fixed-time estimate for this process. Account access and DNS propagation are
the variable parts; DNS often updates quickly but can take 24–48 hours in some resolvers.

## 1. Choose one Vercel ownership path

Use only one of these paths.

### Path A — GitHub transfer, then a new Vercel import (recommended)

1. Johaan opens GitHub repository **Settings → General → Danger Zone → Transfer ownership** for
   `Johaan-Mannanal/yash-portfolio` and transfers it to `YashwanthPiratla`.
2. Yash accepts GitHub's transfer invitation.
3. Yash signs into Vercel with GitHub and selects **Add New → Project**.
4. Import the now-owned `yash-portfolio` repository. An admin collaborator on a repository in
   another personal GitHub account is not sufficient for a personal Vercel import, so the GitHub
   transfer must happen first.
5. Keep the detected Astro settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
   - Node.js: 22.12 or newer
6. Deploy and inspect the generated `vercel.app` URL before changing DNS.

### Path B — Transfer the existing Vercel project

Johaan can instead transfer the existing `yash-portfolio` Vercel project to Yash's Vercel team from
**Project Settings → Transfer Project**. Follow Vercel's prompts for Git integration after the
GitHub repository transfer. This retains the current deployment and project settings; do not also
create a duplicate project through Path A.

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

- **Résumé:** send Johaan a corrected `Yash_Piratla_Resume.pdf`; he will replace the current file,
  run the release checks, and deploy it.
- **FPV drone:** the direct page is a coming-soon placeholder and is intentionally excluded from
  the sitemap. Add the description and photos, a `hero` and `thumbnail`, then change its status to
  `published` and remove the sitemap exclusion.
- **New project:** add images and one MDX file, including explicit `sections` metadata as shown in
  `README.md`.
- **Text or image edit:** update `src/content/**` or the relevant file in `src/pages/`.
- **Before publishing:** run `npm run check` and `npm run test:site`.

## 7. Troubleshooting

- **Repository missing during Vercel import:** confirm Yash accepted the GitHub ownership transfer
  and allowed Vercel access to the repository.
- **Domain remains invalid:** remove conflicting web records and use the exact values shown by
  Vercel, not values copied from another project or an older guide.
- **`www` certificate error:** add `www.piratla.com` to the Vercel project as well as DNS.
- **Build failure:** inspect the named source file; a missing image under `src/assets/img/` is a
  common cause.
- **Résumé link returns 404:** the public filename must be exactly `Yash_Piratla_Resume.pdf`.
