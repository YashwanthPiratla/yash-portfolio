# yash.piratla.com — Engineering Portfolio

Engineering portfolio for **Yashwanth Piratla**, a mechanical engineering student at UC Berkeley.
The site is a static Astro build deployed on Vercel.

- Live review build: <https://yash-piratla.vercel.app>
- Planned canonical production domain: <https://yash.piratla.com>
- Ownership, deployment, domain, and DNS instructions: [`HANDOFF.md`](HANDOFF.md)
- Unsent handoff email draft: [`EMAIL_TO_YASH.md`](EMAIL_TO_YASH.md)

The custom domain is not live yet. Until its DNS is moved to Vercel, canonical and social metadata
will name the planned production URL while the review build remains on `vercel.app`.

## Develop and verify

Requires Node.js 22.12 or newer and npm 9.6.5 or newer.

```bash
npm install
npm run dev        # local development at http://localhost:4321
npm run check      # Astro and TypeScript diagnostics
npm run test:site  # production build plus generated-link/structure audit
npm run preview    # serve the production build locally
```

CI runs the same type check, build, and generated-site audit on pushes and pull requests.

## Structure

```text
src/
  content/
    projects/*.mdx      # one file per engineering project
    research/*.mdx      # one file per research or technical project
  content.config.ts     # shared, typed frontmatter schema
  assets/img/<slug>/    # build-time optimized project images
  components/           # figures, case layouts, lightbox, navigation, scroll reveal, and cards
  layouts/Base.astro    # metadata and shared page shell
  pages/                # home, indexes, resume, about, contact, and 404
scripts/check-site.mjs  # audits generated routes and release-critical markup
public/
  Yash_Piratla_Resume.pdf  # unchanged source file used by Resume links
  og-default.png           # social-sharing image
vercel.json             # clean URLs and apex/www redirects to the planned canonical domain
```

## Adding a project

1. Put its images in `src/assets/img/<slug>/`.
2. Add `src/content/projects/<slug>.mdx`, or use `src/content/research/` for research.
3. Add a `sections` entry for every in-page navigation link. Its `id` must match the corresponding
   `<section id="...">` in the MDX body.
4. Run `npm run check` and `npm run test:site` before publishing.

```yaml
---
title: My New Mechanism
subtitle: Mechanical Design · CAD · Manufacturing
summary: One-paragraph card description.
disciplines: ['Mechanical Design', 'CAD']
kind: mechanical          # mechanical | robotics | electrical | software
order: 5
status: published         # or coming-soon
season: 2027 FRC season   # optional
hero: my-slug/hero.png
heroContain: true         # true for CAD/diagrams; false for photos
thumbnail: my-slug/thumb.png
stats:
  - { value: '20:1', label: 'Gear ratio' }
sections:
  - { id: overview, label: Overview }
---
import Fig from '../../components/Fig.astro';
import PSR from '../../components/PSR.astro';
import { img } from '../../lib/images';

<section id="overview">
<span class="eyebrow">01 — Project overview</span>
<h2>Heading</h2>
Text…
<Fig src={img('my-slug/photo.png')} alt="…" label="CAD" caption="…" contain />
</section>
```

Available MDX building blocks include `<Fig>`, `<PSR>`, `.split`, `.split.rev`, `.psr-list`,
`.timeline`, `.spec-table`, `.note`, `.role`, and `.grid.two/.three`.

## Motion and accessibility

Scroll reveals are progressive enhancement: selected blocks move up 10 pixels while fading in over
420 milliseconds. Content remains visible without JavaScript, and motion is disabled for
`prefers-reduced-motion`. Zoomable images are keyboard-operable and open in a native dialog.

## Updating the résumé

Replace `public/Yash_Piratla_Resume.pdf` with the corrected PDF while keeping the filename, then run
the release checks and redeploy. The current file is intentionally unchanged pending a corrected
export from Yash; see `EMAIL_TO_YASH.md`.

## Accuracy rule

Project source documents are the source of truth. Do not add dimensions, materials, results, or
claims that are not supported by those materials. The research prose and external wearable-health
repositories are outside the scope of this revision and were not corrected or modified.
