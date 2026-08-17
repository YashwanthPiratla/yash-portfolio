# PT2 Portfolio Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Yash Piratla portfolio, maintenance handoff, and follow-up communication draft into compliance with the approved PT2 revision brief without changing the approved research page or résumé.

**Architecture:** Keep the existing Astro/MDX site and extend its current content schema and card component only where the future FPV external link requires it. Build the compact homepage and leadership strip from focused Astro components, enforce factual and media constraints in the existing static-site audit, and serve the supplied 1.7 MB drivebase MP4 as a local public asset.

**Tech Stack:** Astro 7, MDX, TypeScript, Astro Assets, Node.js static audit, CSS, Vercel

**Spec:** `docs/superpowers/specs/2026-08-17-pt2-portfolio-revision-design.md`

## Global Constraints

- Merge Yash's pull request #1 before implementation and retain his commit attribution.
- Do not edit `src/content/research/wearable-health-ml.mdx`, any external wearable-health repository, or `public/Yash_Piratla_Resume.pdf`.
- Use only supplied project photos, CAD, the PDF-embedded headshot, and the supplied drivebase video.
- Project-card thumbnails may repeat; a case-study hero or body image may appear only once within that case-study page.
- Preserve Astro, Vercel configuration, light/dark themes, lightbox behavior, sticky case navigation, scroll reveals, and reduced-motion support.
- Keep homepage hierarchy `Hero → Engineering Projects → Research → Experience / Leadership → About`.
- Do not send the corrective email without a separate explicit authorization after deployment.
- Preserve these immutable baseline digests:
  - `src/content/research/wearable-health-ml.mdx`: `9bbf34e834d25a10b1033cd11de85e0d74215623e389336b8da7ebb9a89537ef`
  - `public/Yash_Piratla_Resume.pdf`: `67051606f0fbd1740fce95bd7e3992acb4d43db2aa42637f87d9078d769fb9ff`

---

## File Structure

**Create:**

- `src/components/ExperienceStrip.astro` — owns the four compact leadership cards and their responsive styling.
- `public/media/drivebase-moving.mp4` — exact supplied drivebase footage, served directly by Astro/Vercel.
- `docs/communications/yash-pt2-follow-up-email.md` — final corrected email draft; documentation only.

**Modify:**

- `src/content.config.ts` — adds optional project-card CTA and external case-study URL fields.
- `src/components/ProjectCard.astro` — renders content-provided CTA copy and safe external-link attributes.
- `src/components/ScrollReveal.astro` — includes the new hero portrait and leadership cards in restrained reveals.
- `src/pages/index.astro` — replaces the large image hero and inserts the leadership strip.
- `src/pages/projects/index.astro` — passes FPV CTA/external-link metadata into project cards.
- `src/content/projects/fpv-drone.mdx` — replaces solo-project claims with an accurate group-project placeholder.
- `src/content/projects/three-stage-cascading-elevator.mdx` — removes the repeated hero photograph from the body.
- `src/content/projects/mk4-swerve-drivebase.mdx` — propagates Yash's 2024/125.5 lb correction, removes duplicate CAD, and adds video.
- `src/styles/global.css` — adds a focused native-video figure rule if component-local styles are insufficient.
- `scripts/check-site.mjs` — enforces PT2 hierarchy, FPV wording, image uniqueness, video presence, and immutable-file hashes.
- `README.md` — documents the optional FPV case-study metadata.
- `HANDOFF.md` — records the correct workflow, asset rules, missing media, and future FPV URL update.

No changes are required in the climber MDX: its hero and three body images are already unique and placed beside the correct engineering narratives.

---

### Task 1: Merge Yash's corrections and establish the implementation branch

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Nav.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/content/projects/mk4-swerve-drivebase.mdx:8-15`

**Interfaces:**
- Consumes: GitHub pull request `Johaan-Mannanal/yash-portfolio#1`.
- Produces: `codex/pt2-portfolio-revision`, rebased on the merged Yash PR and containing the committed spec/plan.

- [ ] **Step 1: Confirm the planning branch is clean and inspect the pull request one final time**

Run:

```bash
git status --short --branch
gh pr view 1 --repo Johaan-Mannanal/yash-portfolio --json state,mergeStateStatus,statusCheckRollup,url
gh pr diff 1 --repo Johaan-Mannanal/yash-portfolio
```

Expected: the working tree is clean; PR #1 contains four LinkedIn corrections plus the drivebase season and weight corrections. The known Vercel authorization status may still be red, but the patch itself contains no build-system change.

- [ ] **Step 2: Merge Yash's PR with attribution**

Run:

```bash
gh pr merge 1 --repo Johaan-Mannanal/yash-portfolio --merge
```

Expected: PR #1 changes to `MERGED`. Do not use `--admin`; if a protected required check blocks the merge, stop and resolve the GitHub/Vercel authorization instead of bypassing it.

- [ ] **Step 3: Rebase the documentation branch onto the updated main and rename it**

Run:

```bash
git switch main
git pull --ff-only origin main
git switch codex/pt2-revision-plan
git rebase main
git branch -m codex/pt2-portfolio-revision
```

Expected: the new branch includes Yash's merged commits plus the PT2 spec and plan commits.

- [ ] **Step 4: Correct the malformed weight unit introduced by the PR**

Change the frontmatter value in `src/content/projects/mk4-swerve-drivebase.mdx` to:

```yaml
stats:
  - { value: '4', label: 'MK4 swerve modules' }
  - { value: '125.5 lb', label: 'Robot weight limit' }
  - { value: '1', label: 'Panel to remove for full electrical access' }
  - { value: '3 mo', label: 'FRC build season' }
```

- [ ] **Step 5: Verify the merged corrections and baseline build**

Run:

```bash
npm ci
npm run check
npm run test:site
rg -n "5115b826a|2024 FRC season|125\.5 lb" src
```

Expected: both npm checks pass; all LinkedIn destinations end in `5115b826a`; drivebase frontmatter says `2024 FRC season` and `125.5 lb`.

- [ ] **Step 6: Commit the normalization**

```bash
git add src/content/projects/mk4-swerve-drivebase.mdx
git commit -m "fix: normalize drivebase weight unit"
```

---

### Task 2: Correct the FPV project model, card, and placeholder

**Files:**
- Modify: `scripts/check-site.mjs:89-104`
- Modify: `src/content.config.ts:8-21`
- Modify: `src/components/ProjectCard.astro:1-25`
- Modify: `src/pages/index.astro:57-61`
- Modify: `src/pages/projects/index.astro:16-27`
- Modify: `src/content/projects/fpv-drone.mdx:1-68`
- Modify: `README.md`

**Interfaces:**
- Consumes: project fields `status`, `ctaLabel`, and optional `caseStudyUrl`.
- Produces: `ProjectCard` props `ctaLabel?: string` and `external?: boolean`; future FPV URL changes require frontmatter only.

- [ ] **Step 1: Add failing FPV accuracy checks**

Append these checks before the final failure report in `scripts/check-site.mjs`:

```js
const fpvSource = await readFile(path.join(root, 'src/content/projects/fpv-drone.mdx'), 'utf8');
for (const [label, pattern] of [
  ['personal-project wording', /\bpersonal mechanical and electrical project\b/i],
  ['solo-build wording', /\bbuilt solo\b/i],
  ['unsupported solo authorship', /\bI designed and assembled\b/i],
]) {
  if (pattern.test(fpvSource)) fail(`/projects/fpv-drone/: contains ${label}`);
}

for (const relative of ['index.html', 'projects/index.html']) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  if (!html.includes('View Case Study →')) {
    fail(`/${relative === 'index.html' ? '' : 'projects/'}: FPV card is missing View Case Study CTA`);
  }
}
```

- [ ] **Step 2: Run the audit and confirm the intended failure**

Run:

```bash
npm run test:site
```

Expected: FAIL for the FPV personal/solo wording and missing `View Case Study →` CTA.

- [ ] **Step 3: Extend project metadata**

Add these fields to `base` in `src/content.config.ts` after `thumbnail`:

```ts
  ctaLabel: z.string().optional(),
  caseStudyUrl: z.string().url().optional(),
```

- [ ] **Step 4: Make ProjectCard support supplied CTA text and safe external links**

Update the props and link rendering in `src/components/ProjectCard.astro`:

```astro
interface Props {
  href: string;
  title: string;
  summary: string;
  disciplines: string[];
  thumbnail?: string;
  status?: string;
  contain?: boolean;
  kindLabel?: string;
  ctaLabel?: string;
  external?: boolean;
}
const {
  href, title, summary, disciplines, thumbnail, status = 'published', contain = false,
  kindLabel, ctaLabel, external = false,
} = Astro.props;
const soon = status === 'coming-soon';
const meta = thumbnail ? img(thumbnail) : undefined;
const target = external ? '_blank' : undefined;
const rel = external ? 'noopener' : undefined;
```

Use `target={target}` and `rel={rel}` on all three card anchors. Render the CTA as:

```astro
<a class="more" href={href} target={target} rel={rel}>
  {ctaLabel ?? (soon ? 'Preview page →' : 'Read case study →')}
</a>
```

- [ ] **Step 5: Pass content-driven destinations from both project-card lists**

In both `src/pages/index.astro` and `src/pages/projects/index.astro`, pass:

```astro
href={p.data.caseStudyUrl ?? `/projects/${p.id}`}
ctaLabel={p.data.ctaLabel}
external={Boolean(p.data.caseStudyUrl)}
```

Keep research cards unchanged.

- [ ] **Step 6: Replace the FPV frontmatter and body with approved group-project copy**

Use this complete content in `src/content/projects/fpv-drone.mdx`:

```mdx
---
title: 5" FPV Drone
subtitle: Group Project · Mechanical Assembly · Electrical Integration
summary: A group-built 5-inch FPV drone combining mechanical assembly, electrical integration, configuration, and flight testing. A separate group case study is in progress.
disciplines: ['Group Project', 'Mechanical Assembly', 'Electrical Integration']
kind: electrical
order: 4
status: coming-soon
ctaLabel: View Case Study →
stats: []
sections:
  - { id: overview, label: Overview }
---

<section id="overview">
<span class="eyebrow">01 — Project overview</span>
<h2>Group case study coming separately</h2>

The 5-inch FPV Drone is a group project involving mechanical assembly, electrical integration,
configuration, troubleshooting, and flight testing.

<div class="note">
<b>The detailed case study will live on a separate group-built website.</b> This placeholder will
link to that site after Yash supplies the final URL.
</div>
</section>
```

- [ ] **Step 7: Document the new metadata in README**

Add these optional fields to the existing project frontmatter example:

```yaml
ctaLabel: View Case Study →       # optional card CTA override
caseStudyUrl: https://example.org # optional external case-study destination
```

Explain that omitting `caseStudyUrl` retains the local project route and that external destinations open in a new tab with `rel="noopener"`.

- [ ] **Step 8: Verify and commit**

Run:

```bash
npm run check
npm run test:site
if rg -n -i "personal mechanical|built solo|I designed and assembled" src/content/projects/fpv-drone.mdx; then exit 1; fi
```

Expected: both npm checks pass and `rg` returns no forbidden FPV wording.

```bash
git add scripts/check-site.mjs src/content.config.ts src/components/ProjectCard.astro src/pages/index.astro src/pages/projects/index.astro src/content/projects/fpv-drone.mdx README.md
git commit -m "fix: present FPV drone as group project"
```

---

### Task 3: Add the compact Experience / Leadership strip

**Files:**
- Create: `src/components/ExperienceStrip.astro`
- Modify: `src/pages/index.astro:66-85`
- Modify: `src/components/ScrollReveal.astro:5-18`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: no props; copy is fixed to the approved PT2 brief.
- Produces: one semantic homepage section with four ordered `.experience-card` elements.

- [ ] **Step 1: Add a failing order check to the site audit**

After loading `home` in `scripts/check-site.mjs`, add:

```js
const leadershipRoles = [
  'FRC Robotics — President',
  'Praevius — Partner',
  'Evergreen Code Camp — Co-founder',
  'VTseva — Community Service',
];
const leadershipPositions = leadershipRoles.map((role) => home.indexOf(role));
if (leadershipPositions.some((position) => position === -1)) {
  fail('/: missing one or more Experience / Leadership cards');
} else if (!leadershipPositions.every((position, index) => index === 0 || position > leadershipPositions[index - 1])) {
  fail('/: Experience / Leadership cards are out of order');
}
```

- [ ] **Step 2: Run the audit and confirm it fails**

Run `npm run test:site`.

Expected: FAIL with `missing one or more Experience / Leadership cards`.

- [ ] **Step 3: Create the leadership component**

Create `src/components/ExperienceStrip.astro`:

```astro
---
const experiences = [
  {
    title: 'FRC Robotics — President',
    copy: 'Led a 40-member team across robot development, mechanical design, manufacturing, technical training, outreach, and STEM fundraising.',
  },
  {
    title: 'Praevius — Partner',
    copy: 'Led social media and used Stable Diffusion, video editing, and four AI outreach systems in work associated with ~$200K lifetime revenue.',
  },
  {
    title: 'Evergreen Code Camp — Co-founder',
    copy: 'Created Python and Scratch curriculum, taught online and in person, and supported 40+ signups and ~$20K revenue.',
  },
  {
    title: 'VTseva — Community Service',
    copy: 'Founded Feeding Hope, raised ~$20K for visually challenged students, supported ~$50K through UTSAV, and mentored FLL students.',
  },
];
---

<section class="section experience" aria-labelledby="experience-heading">
  <div class="wrap">
    <div class="section-head compact">
      <div>
        <span class="eyebrow accent">Experience / Leadership</span>
        <h2 id="experience-heading">Beyond the engineering work</h2>
      </div>
    </div>
    <div class="experience-grid">
      {experiences.map((experience) => (
        <article class="experience-card">
          <h3>{experience.title}</h3>
          <p>{experience.copy}</p>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .experience { padding-block: clamp(2rem, 4vw, 3rem); }
  .section-head.compact { margin-bottom: 1.25rem; }
  .experience-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
  .experience-card { border: 1px solid var(--line); border-radius: var(--radius); padding: 0.9rem; background: var(--bg); }
  .experience-card h3 { font-size: 0.95rem; margin-bottom: 0.4rem; }
  .experience-card p { margin: 0; color: var(--ink-2); font-size: 0.82rem; line-height: 1.45; }
  @media (max-width: 900px) { .experience-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 520px) { .experience-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 4: Insert the component after Research and before About**

Import it in `src/pages/index.astro`:

```astro
import ExperienceStrip from '../components/ExperienceStrip.astro';
```

Place `<ExperienceStrip />` immediately after the Research section's closing tag and before the About section.

- [ ] **Step 5: Include the new cards in scroll reveals**

Add this selector to the array in `src/components/ScrollReveal.astro`:

```ts
'.experience-grid > .experience-card',
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm run check
npm run test:site
```

Expected: PASS; the four roles appear in the required order.

```bash
git add src/components/ExperienceStrip.astro src/pages/index.astro src/components/ScrollReveal.astro scripts/check-site.mjs
git commit -m "feat: add compact leadership strip"
```

---

### Task 4: Replace the homepage hero and headshot

**Files:**
- Replace: `src/assets/img/headshot.png`
- Modify: `src/pages/index.astro:1-45,109-128`
- Modify: `src/components/ScrollReveal.astro`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: the sole image embedded on page 1 of `Stacy directions PT2.pdf`.
- Produces: a compact `.hero` with `.hero-portrait` and `.copy`; Engineering Projects remains the next section.

- [ ] **Step 1: Add failing compact-hero checks**

After reading `home`, add source-level checks in `scripts/check-site.mjs`:

```js
const homeSource = await readFile(path.join(root, 'src/pages/index.astro'), 'utf8');
if (homeSource.includes("img('elevator/robot-full-extension.png')")) {
  fail('/: homepage still imports the large elevator hero');
}
if (!homeSource.includes('class="hero-portrait"')) {
  fail('/: compact hero portrait is missing');
}
const heroClose = homeSource.indexOf('</section>');
const projectsHeading = homeSource.indexOf('Mechanical design, built and tested');
if (heroClose === -1 || projectsHeading < heroClose) {
  fail('/: Engineering Projects is not immediately after the hero');
}
```

- [ ] **Step 2: Run the audit and confirm it fails**

Run `npm run test:site`.

Expected: FAIL for the elevator hero import and missing compact portrait.

- [ ] **Step 3: Extract and verify the supplied headshot**

Run:

```bash
mkdir -p /private/tmp/yash-pt2-headshot
pdfimages -f 1 -l 1 -png "/Users/johaanmannanal/Downloads/Stacy directions PT2.pdf" /private/tmp/yash-pt2-headshot/headshot
sips -g pixelWidth -g pixelHeight /private/tmp/yash-pt2-headshot/headshot-000.png
shasum -a 256 /private/tmp/yash-pt2-headshot/headshot-000.png
cp /private/tmp/yash-pt2-headshot/headshot-000.png src/assets/img/headshot.png
```

Expected: `1227 × 1282`; SHA-256 `8a3a06f0473bbfeaf5ee580fe2d077a863460d0ac77f92b56220a814e1a54d48`.

- [ ] **Step 4: Replace the hero markup**

Remove the `img` import and `heroImg` constant from `src/pages/index.astro`. Keep `Image` and `headshot`. Replace the current hero body with:

```astro
<section class="hero">
  <div class="wrap hero-inner">
    <figure class="hero-portrait">
      <Image src={headshot} alt="Portrait of Yashwanth Piratla" width={168} loading="eager" format="webp" quality={88} />
    </figure>
    <div class="copy">
      <span class="eyebrow accent">Mechanical Engineering — UC Berkeley</span>
      <h1>Yashwanth Piratla</h1>
      <p class="lede">I design, manufacture, test, and iterate mechanical systems for robotics and real hardware.</p>
      <div class="cta">
        <a class="btn primary" href="/projects">Engineering Projects</a>
        <a class="btn" href="/research">Research</a>
        <a class="btn" href="/Yash_Piratla_Resume.pdf" target="_blank" rel="noopener">Resume (PDF)</a>
      </div>
      <div class="links small">
        <a href="https://github.com/YashwanthPiratla" target="_blank" rel="noopener">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/yashwanth-piratla-5115b826a/" target="_blank" rel="noopener">LinkedIn ↗</a>
        <a href="mailto:ypiratla@gmail.com">ypiratla@gmail.com</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Replace the old hero styles with compact centered styles**

Use:

```css
.hero { padding: clamp(1.5rem, 3vw, 2.5rem) 0 1.5rem; border-bottom: 1px solid var(--line); text-align: center; }
.hero-inner { display: grid; justify-items: center; gap: 0.8rem; }
.hero-portrait { width: clamp(88px, 10vw, 124px); aspect-ratio: 1; border: 1px solid var(--line); border-radius: 50%; overflow: hidden; background: var(--bg-2); }
.hero-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 34%; }
.copy { display: grid; justify-items: center; }
h1 { margin: 0.35rem 0 0.55rem; }
.hero .lede { max-width: 54ch; margin-bottom: 0; }
.cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin: 1rem 0 0.75rem; }
.links { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.25rem; color: var(--ink-3); }
.links a { color: var(--ink-2); }
```

Keep the existing About styles. Remove `.inner`, `.shot`, and their obsolete mobile rules. Reduce the first Engineering Projects section's top padding only if the 1366 × 768 check in Task 8 does not show its eyebrow or heading.

- [ ] **Step 6: Update the reveal selector**

Replace `'main > .hero .shot'` with:

```ts
'main > .hero .hero-portrait',
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm run check
npm run test:site
shasum -a 256 src/assets/img/headshot.png
```

Expected: PASS and the new headshot hash matches `8a3a06f0473bbfeaf5ee580fe2d077a863460d0ac77f92b56220a814e1a54d48`.

```bash
git add src/assets/img/headshot.png src/pages/index.astro src/components/ScrollReveal.astro scripts/check-site.mjs
git commit -m "feat: make homepage hero compact and project-first"
```

---

### Task 5: Enforce unique case media and add the drivebase video

**Files:**
- Modify: `scripts/check-site.mjs`
- Modify: `src/content/projects/three-stage-cascading-elevator.mdx:170-189`
- Modify: `src/content/projects/mk4-swerve-drivebase.mdx:1-140`
- Create: `public/media/drivebase-moving.mp4`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: project `hero` frontmatter plus body `img('path')` references; Google Drive file ID `1kVMGcLvi4kkN9TLs9a84wCrov7s1S-e5`.
- Produces: no repeated case-study asset and a native video at `/media/drivebase-moving.mp4`.

- [ ] **Step 1: Add failing media-uniqueness and video checks**

Add before the audit's final failure report:

```js
const engineeringSources = [
  'three-stage-cascading-elevator.mdx',
  'deployable-climbing-mechanism.mdx',
  'mk4-swerve-drivebase.mdx',
];

for (const filename of engineeringSources) {
  const source = await readFile(path.join(root, 'src/content/projects', filename), 'utf8');
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch?.[1] ?? '';
  const body = frontmatterMatch ? source.slice(frontmatterMatch[0].length) : source;
  const hero = frontmatter.match(/^hero:\s*(.+)$/m)?.[1]?.trim();
  const bodyImages = [...body.matchAll(/img\(['"]([^'"]+)['"]\)/g)].map((match) => match[1]);
  const caseImages = [hero, ...bodyImages].filter(Boolean);
  const duplicates = caseImages.filter((image, index) => caseImages.indexOf(image) !== index);
  if (duplicates.length > 0) {
    fail(`${filename}: repeats case-study media: ${[...new Set(duplicates)].join(', ')}`);
  }
}

const drivebaseSource = await readFile(path.join(root, 'src/content/projects/mk4-swerve-drivebase.mdx'), 'utf8');
if (!drivebaseSource.includes('src="/media/drivebase-moving.mp4"')) {
  fail('/projects/mk4-swerve-drivebase/: supplied video is not embedded');
}
if (!(await exists(path.join(root, 'public/media/drivebase-moving.mp4')))) {
  fail('/projects/mk4-swerve-drivebase/: supplied video file is missing');
}
```

- [ ] **Step 2: Run the audit and confirm all intended failures**

Run `npm run test:site`.

Expected: FAIL for repeated `elevator/robot-full-extension.png`, repeated `drivebase/cad-iso.png`, and missing drivebase video.

- [ ] **Step 3: Remove the repeated elevator body image**

In the manufacturing section, delete the `<Fig>` using `elevator/robot-full-extension.png` and remove the now-unnecessary `.split.rev` wrapper. Keep the four manufacturing paragraphs and the role clarification unchanged.

- [ ] **Step 4: Propagate Yash's drivebase corrections through the page**

Change every drivebase reference from the old values to:

- `2024 FRC season` in frontmatter.
- `2024 FIRST Robotics Competition robot` in the overview.
- `125.5 lb FRC weight limit` in requirements.
- `2024 competition season` in the result.

Keep the stat value `125.5 lb`. Verify no `2026` or `115 lb` remains in `mk4-swerve-drivebase.mdx`.

- [ ] **Step 5: Remove the repeated drivebase body CAD**

Delete the `<Fig>` using `drivebase/cad-iso.png` from the overview. The same image remains the case hero and card-thumbnail exemption.

- [ ] **Step 6: Download and verify the supplied video**

Run:

```bash
mkdir -p public/media /private/tmp/yash-drivebase-video
curl -L "https://drive.usercontent.google.com/download?id=1kVMGcLvi4kkN9TLs9a84wCrov7s1S-e5&export=download&confirm=t" -o /private/tmp/yash-drivebase-video/drivebase-moving.mp4
file /private/tmp/yash-drivebase-video/drivebase-moving.mp4
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 /private/tmp/yash-drivebase-video/drivebase-moving.mp4
shasum -a 256 /private/tmp/yash-drivebase-video/drivebase-moving.mp4
cp /private/tmp/yash-drivebase-video/drivebase-moving.mp4 public/media/drivebase-moving.mp4
```

Expected: H.264/AAC MP4, `480 × 852`, duration approximately `12.212` seconds, size `1810353` bytes, SHA-256 `af9b170cbfad71f8f1b95a8719a00b1334d267e1ad61a28797b8bd7007ca2e71`.

- [ ] **Step 7: Embed the video in the drivebase result section**

Add after the result paragraph:

```mdx
<figure class="fig video-figure">
  <video controls preload="metadata" playsinline aria-label="MK4 swerve drivebase moving under power">
    <source src="/media/drivebase-moving.mp4" type="video/mp4" />
  </video>
  <figcaption><b>Testing</b> — The completed MK4 swerve drivebase moving under power.</figcaption>
</figure>
```

- [ ] **Step 8: Add restrained video sizing**

Add to `src/styles/global.css` beside figure rules:

```css
figure.video-figure { background: #0b0d10; }
figure.video-figure video { width: auto; max-height: min(72vh, 760px); margin: 0 auto; background: #0b0d10; }
```

- [ ] **Step 9: Verify and commit**

Run:

```bash
npm run check
npm run test:site
rg -n "2026|115 lb|drivebase/cad-iso" src/content/projects/mk4-swerve-drivebase.mdx
shasum -a 256 public/media/drivebase-moving.mp4
```

Expected: checks pass; `rg` reports only the single frontmatter hero/thumbnail references for `drivebase/cad-iso` and no obsolete year or weight; video checksum matches the supplied file.

```bash
git add scripts/check-site.mjs src/content/projects/three-stage-cascading-elevator.mdx src/content/projects/mk4-swerve-drivebase.mdx src/styles/global.css public/media/drivebase-moving.mp4
git commit -m "feat: improve project media coverage"
```

---

### Task 6: Protect immutable research and résumé artifacts

**Files:**
- Modify: `scripts/check-site.mjs:1-104`

**Interfaces:**
- Consumes: bytes of the approved research MDX and résumé PDF.
- Produces: deterministic SHA-256 release failures if either protected file changes.

- [ ] **Step 1: Add the hashing import and deliberately failing digest guard**

Add at the top:

```js
import { createHash } from 'node:crypto';
```

Add before the final failure report, initially using an all-zero digest for the research file:

```js
const immutableFiles = new Map([
  ['src/content/research/wearable-health-ml.mdx', '0000000000000000000000000000000000000000000000000000000000000000'],
  ['public/Yash_Piratla_Resume.pdf', '67051606f0fbd1740fce95bd7e3992acb4d43db2aa42637f87d9078d769fb9ff'],
]);

for (const [relative, expectedDigest] of immutableFiles) {
  const contents = await readFile(path.join(root, relative));
  const digest = createHash('sha256').update(contents).digest('hex');
  if (digest !== expectedDigest) fail(`${relative}: protected content changed`);
}
```

- [ ] **Step 2: Run the audit and verify the guard fails**

Run `npm run test:site`.

Expected: FAIL with `src/content/research/wearable-health-ml.mdx: protected content changed` and no résumé failure.

- [ ] **Step 3: Set the approved research digest**

Replace the all-zero value with:

```text
9bbf34e834d25a10b1033cd11de85e0d74215623e389336b8da7ebb9a89537ef
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run check
npm run test:site
shasum -a 256 src/content/research/wearable-health-ml.mdx public/Yash_Piratla_Resume.pdf
```

Expected: PASS and both digests match Global Constraints.

```bash
git add scripts/check-site.mjs
git commit -m "test: protect approved research and resume"
```

---

### Task 7: Rewrite the maintenance handoff and corrective email draft

**Files:**
- Modify: `HANDOFF.md:1-122`
- Create: `docs/communications/yash-pt2-follow-up-email.md`

**Interfaces:**
- Consumes: final content behavior and known asset inventory.
- Produces: accurate owner workflow, remaining-media request, FPV URL procedure, and unsent email draft.

- [ ] **Step 1: Add the fork-and-PR maintenance workflow to HANDOFF**

Keep the existing ownership, Vercel, DNS, HTTPS, and troubleshooting sections. In `Updating the site later`, state:

```md
### GitHub editing workflow

Yash currently works from `YashwanthPiratla/yash-portfolio` and opens pull requests into
`Johaan-Mannanal/yash-portfolio`. Before beginning another revision, merge approved Yash changes,
pull the updated original `main`, and create the revision branch from that commit. Review each pull
request through its Vercel preview before merging to production.
```

- [ ] **Step 2: Replace the outdated FPV instruction**

Use:

```md
- **FPV drone:** this is a group project. Do not expand it into a solo case study. When the separate
  group-built case study is published, set `caseStudyUrl` in
  `src/content/projects/fpv-drone.mdx` to its final URL. Do not invent or substitute a URL.
```

- [ ] **Step 3: Add media and immutable-content rules**

Add:

```md
### Content guardrails

- Project-card thumbnails are navigation UI and may also appear as a case-study hero.
- Within a case-study page, do not repeat a hero or body image in another section.
- Wearable Health Telemetry is approved and must remain unchanged unless Yash supplies a newly
  approved revision.
- The current résumé PDF remains unchanged until Yash supplies a replacement file.
- Use only supplied project photos, CAD, and video; do not generate substitute engineering media.
```

- [ ] **Step 4: Add the exact missing-media list**

Add:

```md
### Project media still requested

- **Elevator:** belt-tensioner CAD/physical photo, PLA-to-carbon-fiber-PLA pulley iteration, failed
  motor mount or bent pulley, manufacturing/assembly, and detailed belt-routing views.
- **Climber:** dead-axle close-up, carbon-fiber hook close-up, FEA screenshot, hook-testing media,
  and the final mechanism installed on the robot.
- **Drivebase:** bumper mounts, battery mount, under-bumper intake, wiring close-ups, manufacturing,
  and a final full-robot photograph.

The current pages intentionally remain asset-honest until these files arrive.
```

Document `/media/drivebase-moving.mp4` as the replacement target for future drivebase video updates.

- [ ] **Step 5: Create the unsent corrective email draft**

Create `docs/communications/yash-pt2-follow-up-email.md`:

```md
To: ypiratla@gmail.com
Subject: Portfolio update — PT2 revisions and remaining project media

Hey Yash,

I incorporated the updated PT2 directions into your portfolio:

- the homepage is now compact and project-first, using the new headshot;
- the engineering project pages use each available image once within the case study;
- the drivebase video is included;
- the FPV drone is correctly identified as a group project with a placeholder for the future group case study; and
- the compact FRC, Praevius, Evergreen Code Camp, and VTseva cards are included below the engineering and research work.

The Wearable Health Telemetry page and your current résumé were left unchanged. If you later send
an explicitly approved research revision or a replacement résumé, I can update the corresponding
page or file then.

The updated site is at:
https://yash-piratla.vercel.app

The handoff and remaining-media list are here:
https://github.com/Johaan-Mannanal/yash-portfolio/blob/main/HANDOFF.md

The FPV item I need later is the final URL for the separate group-built case study—not a solo write-up. The handoff also lists the elevator, climber, and drivebase photos/CAD that would strengthen the current pages when available.

Johaan
```

Do not send this file during implementation.

- [ ] **Step 6: Review documentation consistency and commit**

Run:

```bash
rg -n "FPV drone|caseStudyUrl|Wearable Health|Project media still requested|test:site" HANDOFF.md
if rg -n "description and photos|built solo|personal mechanical" HANDOFF.md docs/communications/yash-pt2-follow-up-email.md; then exit 1; fi
git diff --check
```

Expected: the first command finds every new handoff element; the second returns no outdated wording; whitespace check passes.

```bash
git add HANDOFF.md docs/communications/yash-pt2-follow-up-email.md
git commit -m "docs: update PT2 handoff and follow-up draft"
```

---

### Task 8: Perform full verification, preview, and guarded release

**Files:**
- Verify only: all changed files

**Interfaces:**
- Consumes: completed PT2 implementation branch.
- Produces: reviewed Vercel preview, merge-ready pull request, and verified production deployment.

- [ ] **Step 1: Run the complete automated suite from a clean install**

Run:

```bash
npm ci
npm run check
npm run test:site
git diff --check main...HEAD
```

Expected: every command exits 0.

- [ ] **Step 2: Verify protected files and supplied binary assets**

Run:

```bash
shasum -a 256 src/content/research/wearable-health-ml.mdx public/Yash_Piratla_Resume.pdf src/assets/img/headshot.png public/media/drivebase-moving.mp4
git diff --exit-code main...HEAD -- src/content/research/wearable-health-ml.mdx public/Yash_Piratla_Resume.pdf
```

Expected hashes, in order:

```text
9bbf34e834d25a10b1033cd11de85e0d74215623e389336b8da7ebb9a89537ef
67051606f0fbd1740fce95bd7e3992acb4d43db2aa42637f87d9078d769fb9ff
8a3a06f0473bbfeaf5ee580fe2d077a863460d0ac77f92b56220a814e1a54d48
af9b170cbfad71f8f1b95a8719a00b1334d267e1ad61a28797b8bd7007ca2e71
```

The diff command must produce no output.

- [ ] **Step 3: Run focused content assertions**

Run:

```bash
if rg -n -i "personal mechanical|built solo|I designed and assembled" src/content/projects/fpv-drone.mdx; then exit 1; fi
rg -n "FRC Robotics — President|Praevius — Partner|Evergreen Code Camp — Co-founder|VTseva — Community Service" src/components/ExperienceStrip.astro
if rg -n "2026|115 lb" src/content/projects/mk4-swerve-drivebase.mdx; then exit 1; fi
```

Expected: the first and third commands return no matches; the second returns four ordered matches.

- [ ] **Step 4: Inspect the local site visually**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Inspect these routes at `1366 × 768`, `1440 × 900`, and `390 × 844`:

- `/`
- `/projects`
- `/projects/three-stage-cascading-elevator`
- `/projects/deployable-climbing-mechanism`
- `/projects/mk4-swerve-drivebase`
- `/projects/fpv-drone`
- `/research/wearable-health-ml`

Verify the project heading is visible in the initial 1366 × 768 homepage viewport; leadership cards form one row on wide desktop and wrap cleanly; the headshot is sharp; the drivebase video plays; dark mode is legible; keyboard focus is visible; the lightbox still works; and reduced-motion mode removes reveal transitions.

- [ ] **Step 5: Review the branch diff and commit any verification-only corrections**

Run:

```bash
git status --short
git diff --stat main...HEAD
git diff main...HEAD
```

Expected: only PT2-scoped files are changed. If visual review required corrections, rerun Steps 1–4 and commit them with a narrowly scoped message before continuing.

- [ ] **Step 6: Push and open the implementation pull request**

Run:

```bash
git push -u origin codex/pt2-portfolio-revision
gh pr create --repo Johaan-Mannanal/yash-portfolio --base main --head codex/pt2-portfolio-revision --title "Revise portfolio for PT2 directions" --body "Implements the approved PT2 portfolio revision: compact project-first homepage, new headshot, leadership strip, accurate FPV group-project positioning, unique case-study media, drivebase video, regression checks, and updated handoff. Wearable Health Telemetry and the résumé are unchanged."
```

Expected: GitHub returns a pull-request URL and Vercel starts a preview deployment.

- [ ] **Step 7: Verify the Vercel preview**

Run `gh pr checks` for the new pull-request number until checks complete. Open the Vercel preview and repeat the homepage, FPV, drivebase-video, and mobile checks from Step 4.

Expected: the Astro build and site checks pass; the preview matches local behavior.

- [ ] **Step 8: Stop for merge approval**

Report the pull-request URL, Vercel preview URL, test output, protected-file hashes, and known missing-media list. Merge only after explicit user approval.

- [ ] **Step 9: After approval, merge and verify production**

Run:

```bash
gh pr merge --repo Johaan-Mannanal/yash-portfolio --merge --delete-branch
git switch main
git pull --ff-only origin main
```

Verify <https://yash-piratla.vercel.app> after Vercel marks the production deployment Ready. Repeat checks for `/`, the drivebase video, FPV placeholder, research page, and résumé PDF.

- [ ] **Step 10: Keep the email draft unsent until separately authorized**

Present `docs/communications/yash-pt2-follow-up-email.md` to the user. Send it to `ypiratla@gmail.com` only after the user explicitly authorizes that external action.
