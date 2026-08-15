# yash.piratla.com — Engineering Portfolio

Engineering portfolio of **Yashwanth Piratla** (Mechanical Engineering, UC Berkeley).
Static site built with [Astro](https://astro.build), deployed on Vercel.

- Production: https://yash.piratla.com (`piratla.com` redirects here)
- Deploy / domain / DNS instructions: [`HANDOFF.md`](HANDOFF.md)

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview
```

Requires Node 18.17+ (22 recommended).

## Structure

```
src/
  content/
    projects/*.mdx      ← one file per engineering project (mechanical, robotics, electrical, software)
    research/*.mdx      ← one file per research / technical project
  content.config.ts     ← shared frontmatter schema for both collections
  assets/img/<slug>/    ← project images (optimized + converted to WebP at build time)
  components/           ← Fig, PSR (Problem→Solution→Result), Specs, ProjectCard, CaseLayout…
  layouts/Base.astro    ← <head>, metadata, nav, footer, lightbox
  pages/                ← home, projects/, research/, resume, about, contact, 404
public/
  Yash_Piratla_Resume.pdf   ← the resume served by the Resume button
  og-default.png            ← social-sharing preview image
vercel.json               ← clean URLs + piratla.com → yash.piratla.com redirect
```

## Adding a project (no code changes needed)

1. Put images in `src/assets/img/<slug>/`.
2. Create `src/content/projects/<slug>.mdx` (or `src/content/research/<slug>.mdx`) with frontmatter:

```yaml
---
title: My New Mechanism
subtitle: Mechanical Design · CAD · Manufacturing
summary: One-paragraph card description.
disciplines: ['Mechanical Design', 'CAD']
kind: mechanical          # mechanical | robotics | electrical | software  (research collection: research)
order: 5                  # sort position on the index pages
status: published         # or coming-soon
season: 2027 FRC season   # optional eyebrow text
hero: my-slug/hero.png    # path relative to src/assets/img/
heroContain: true         # true for CAD renders / diagrams, false for photos
thumbnail: my-slug/thumb.png
stats:
  - { value: '20:1', label: 'Gear ratio' }
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

Each `<h2>` inside a `<section id="…">` automatically becomes an entry in the sticky in-page nav.
Building blocks available in MDX: `<Fig>`, `<PSR title problem solution result />`, `.split` /
`.split.rev` (text + image), `.psr-list`, `.timeline`, `.spec-table`, `.note`, `.role`, `.grid.two/.three`.

## Updating the resume

Replace `public/Yash_Piratla_Resume.pdf` (keep the filename) and redeploy.

## Accuracy rule

Project documents are the source of truth. Don't add dimensions, materials, results, or claims
that aren't in the source material.
