# Hand-off: deploying yash.piratla.com

Written for Yash. Everything below is the one-time setup to get the site live on
**yash.piratla.com** (with **piratla.com** redirecting to it), and how to update it later.

The site is a static Astro build. Hosting is Vercel (free Hobby plan is plenty). The domain
`piratla.com` stays registered at GoDaddy; you only add DNS records there.

---

## 0. Where things live right now

- Code: `https://github.com/Johaan-Mannanal/yash-portfolio` (will be transferred to your GitHub
  account — see §5).
- Vercel project: currently under Johaan's Vercel account with a temporary `*.vercel.app` URL. You
  can either (a) take over that project, or (b) create your own — §1 covers (b) which is cleanest.

---

## 1. Vercel — create the project (≈5 minutes)

1. Go to https://vercel.com/signup and sign up **with your GitHub account** (`YashwanthPiratla`).
2. Once the repo is in your GitHub account (§5), on the Vercel dashboard click **Add New… → Project**,
   pick `yash-portfolio`, and click **Import**.
3. Vercel auto-detects Astro. Leave defaults:
   - Framework Preset: **Astro**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node.js version: 22.x (Project Settings → General, if it isn't already)
4. Click **Deploy**. In ~1 minute you get a `https://yash-portfolio-xxxx.vercel.app` URL. Check it works.

From now on, **every push to `main` auto-deploys**. Pull requests get preview URLs.

## 2. Vercel — add the domains

Project → **Settings → Domains**. Add these two, in this order:

1. `yash.piratla.com` — this is the **primary** domain.
2. `piratla.com` — when prompted, choose **"Redirect to yash.piratla.com"** (308 permanent).
   Vercel will also suggest adding `www.piratla.com`; add it and redirect it too.

Vercel will show each domain as "Invalid Configuration" until DNS is set (next step). It also tells
you exactly which records it wants — they'll match the table below.

## 3. GoDaddy — DNS records

⚠️ **Heads-up:** `piratla.com` currently points at a GoDaddy Website Builder site (your old
high-school résumé page). Pointing the domain at Vercel replaces it — that's intended, since the new
site supersedes it. If you want to keep a copy, export/screenshot it first.

1. Log in at https://dcc.godaddy.com/ → **My Products** → next to `piratla.com` click **DNS**
   (or "Manage DNS").
2. If GoDaddy Website Builder is "connected" to the domain, disconnect it first:
   Website Builder → Settings → Domain → remove/disconnect. Otherwise GoDaddy may keep overwriting
   the A record.
3. Delete any existing **A** record for `@` and any **CNAME** for `www` that point at GoDaddy/Website
   Builder (values like `Parked`, `WebsiteBuilder Site`, `184.168.x.x`, `76.223.105.230`).
   Leave MX / TXT records alone if you use email on the domain.
4. Add these records:

| Type  | Name   | Value                    | TTL     |
|-------|--------|--------------------------|---------|
| CNAME | `yash` | `cname.vercel-dns.com`   | 600 / default |
| A     | `@`    | `76.76.21.21`            | 600 / default |
| CNAME | `www`  | `cname.vercel-dns.com`   | 600 / default |

   (Vercel's Domains page shows the exact values it wants; if it shows different ones — e.g. a
   newer A record IP or a project-specific CNAME — use what Vercel shows.)

5. Save. Propagation is usually minutes, occasionally up to an hour. Back in Vercel → Domains, click
   **Refresh**; each domain flips to a green check and Vercel issues the SSL certificate
   automatically.

Verify:
- https://yash.piratla.com loads the site over HTTPS
- https://piratla.com and https://www.piratla.com redirect to it
- Paste https://yash.piratla.com into https://www.opengraph.xyz/ — the preview card should show
  your name and the elevator CAD image.

**Do not** use GoDaddy's "Domain Forwarding" feature for the redirect — the Vercel redirect handles
it and keeps HTTPS working on the apex domain.

## 4. Updating the site later

- **Resume:** replace `public/Yash_Piratla_Resume.pdf` (same filename), commit, push. Done.
- **New project:** add images to `src/assets/img/<slug>/` and one `.mdx` file in
  `src/content/projects/` (or `src/content/research/`). The card, page, in-page nav, prev/next
  links and sitemap are generated automatically. Full frontmatter reference in `README.md`.
- **FPV drone page:** `src/content/projects/fpv-drone.mdx` is a placeholder. When the description
  and photos exist, write the sections, add a `hero:`/`thumbnail:` and change
  `status: coming-soon` → `status: published`.
- **Text edits:** everything is in `src/content/**` (case studies) and `src/pages/*.astro`
  (home/about/contact/resume). No build tooling knowledge needed beyond `git push`.
- Preview locally with `npm install && npm run dev`.

## 5. Repository transfer (Johaan → Yash)

When you're ready to own the code:

1. Johaan: GitHub → `Johaan-Mannanal/yash-portfolio` → **Settings → Danger Zone → Transfer
   ownership** → new owner `YashwanthPiratla`.
2. Yash: accept the transfer email. GitHub auto-redirects the old URL.
3. In Vercel, if the project was imported from Johaan's account, either re-import it under your
   account (§1) or, in Johaan's project, **Settings → Transfer Project** to your Vercel team.
   Domains move with the project.
4. Optional: add `https://yash.piratla.com` as the website on your GitHub profile and LinkedIn.

## 6. Troubleshooting

- **"Invalid Configuration" in Vercel after 1 hour:** GoDaddy Website Builder re-added its record,
  or the old A record wasn't deleted. Re-check §3.2–3.3.
- **`www.piratla.com` shows a certificate error:** it's not added in Vercel → Domains. Add it.
- **Build fails on Vercel:** the build log will name the file. Most common: an image path in
  frontmatter that doesn't exist under `src/assets/img/`.
- **Resume link 404s:** the PDF filename in `public/` must be exactly `Yash_Piratla_Resume.pdf`.
