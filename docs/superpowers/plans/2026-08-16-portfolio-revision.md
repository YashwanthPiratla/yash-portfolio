# Portfolio Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the confirmed portfolio and handoff defects, add restrained accessible scroll motion, and leave the resume and research claims unchanged.

**Architecture:** Extend the existing Astro content model for reliable case metadata, isolate motion in one progressive-enhancement component, use native dialog semantics for image expansion, and validate the static output with a dependency-free Node script. Keep launch instructions and the unsent email as repository documentation.

**Tech Stack:** Astro, MDX content collections, TypeScript, CSS, native browser APIs, Node.js, GitHub Actions, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-revision-design.md`

## Global Constraints

- Do not edit `public/Yash_Piratla_Resume.pdf`.
- Do not alter any wearable-health research claim or external research repository.
- Motion must be subtle and disabled by `prefers-reduced-motion`.
- Do not invent project facts or conclusions.
- Do not mutate GitHub, Vercel, GoDaddy, DNS, or email state.

---

### Task 1: Static output audit and toolchain

**Files:**
- Create: `scripts/check-site.mjs`
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: Astro's generated `dist/**/*.html` and `dist/sitemap-0.xml`.
- Produces: `npm run test:site`, a zero-dependency release gate used locally and in CI.

- [ ] Add `@astrojs/check` and TypeScript and upgrade Astro, MDX, sitemap, and Sharp to mutually
  compatible supported releases.
- [ ] Add scripts: `check`, `build`, `audit:site` (`node scripts/check-site.mjs`), and `test:site`
  (`npm run build && npm run audit:site`).
- [ ] Implement `scripts/check-site.mjs` to fail when internal route targets are absent, published
  case pages lack `.subnav`, CAD hero pages lack `shot contain`, the lightbox is not a dialog, or the
  FPV route appears in the sitemap.
- [ ] Add CI using Node 22 with `npm ci`, `npm run check`, `npm run build`, and `npm run audit:site`.
- [ ] Run the audit before feature fixes and confirm it fails on subnavigation, contain heroes,
  accessible lightbox, and FPV sitemap expectations.

### Task 2: Reliable case metadata and sitemap

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/projects/*.mdx`
- Modify: `src/content/research/wearable-health-ml.mdx` frontmatter only
- Modify: `src/pages/projects/[...slug].astro`
- Modify: `src/pages/research/[...slug].astro`
- Modify: `astro.config.mjs`

**Interfaces:**
- Produces: `heroContain: boolean` and `sections: Array<{id: string; label: string}>` on every
  content entry.
- Consumed by: `CaseLayout` props and static output audit.

- [ ] Add typed `heroContain` and `sections` fields to the shared Zod schema.
- [ ] Populate `sections` from each file's existing `<section id>` and `<h2>` pairs without changing
  research prose.
- [ ] Replace `render(entry).headings` usage with `entry.data.sections` in both dynamic routes.
- [ ] Pass `entry.data.heroContain` without `as any` fallbacks.
- [ ] Filter `/projects/fpv-drone/` from the sitemap while retaining the generated page.
- [ ] Run `npm run check` and `npm run test:site`; confirm section navigation and contain heroes pass.

### Task 3: Accessible lightbox and mobile navigation

**Files:**
- Modify: `src/components/Lightbox.astro`
- Modify: `src/components/Fig.astro`
- Modify: `src/components/CaseHero.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Nav.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Zoom trigger contract: `.zoomable[role="button"][tabindex="0"]` containing an image.
- Dialog contract: `HTMLDialogElement#lightbox` opened with `showModal()` and closed with `close()`.

- [ ] Convert the lightbox container to `<dialog>` with a named close button and figure caption.
- [ ] Add trigger semantics to shared figure components and the home hero figure.
- [ ] Support click, Enter, and Space activation; focus the close button; close on button, backdrop,
  and Escape; restore focus to the trigger.
- [ ] Update CSS for dialog and `::backdrop` while preserving the current visual treatment.
- [ ] Make the mobile menu close on Escape, outside click, and navigation; synchronize label and
  expanded state.
- [ ] Run `npm run check` and `npm run test:site`, then manually verify keyboard behavior at desktop
  and 390-pixel mobile widths.

### Task 4: Subtle scroll reveals

**Files:**
- Create: `src/components/ScrollReveal.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Candidate selector list is internal to `ScrollReveal.astro`.
- Enhanced elements receive `data-reveal-ready` and later `data-reveal-visible`.

- [ ] Add a progressive-enhancement script using one `IntersectionObserver` and a conservative
  candidate selector list.
- [ ] Apply a capped per-group stagger to cards and related grid children.
- [ ] Add 10-pixel/420-millisecond reveal styles with no transform or transition for reduced-motion
  users.
- [ ] Import the component once in `Base.astro` after the page content exists.
- [ ] Verify content remains visible with JavaScript disabled and animation is absent under reduced
  motion.

### Task 5: Correct repository documentation and email

**Files:**
- Modify: `README.md`
- Modify: `HANDOFF.md`
- Create: `EMAIL_TO_YASH.md`

**Interfaces:**
- README is developer-facing truth.
- HANDOFF is the operational launch sequence.
- EMAIL_TO_YASH is a draft only and must not be sent automatically.

- [ ] Label `yash-piratla.vercel.app` as the live preview and `yash.piratla.com` as the planned
  canonical production domain.
- [ ] Correct Node requirements and document explicit `sections` metadata.
- [ ] Put GitHub repository transfer before Vercel import and describe Vercel project transfer as an
  alternative, not a simultaneous path.
- [ ] Replace generic CNAME values with instructions to copy exact Vercel-provided values; document
  removal of conflicting `A yash → 50.63.8.181`, old apex/www website records, and preservation of
  MX/TXT records.
- [ ] State that DNS propagation can take longer than a few minutes and provide verification steps.
- [ ] Write the unsent email with accurate preview scope, no 15-minute promise, the resume glyph and
  12-inch/30-inch discrepancy, Johaan's promise to update the file after Yash responds, and the
  remaining asset requests.
- [ ] Confirm no research claim was changed and the resume hash matches the pre-change value.

### Task 6: Final release verification

**Files:**
- Verify all modified files; no new production interface.

**Interfaces:**
- Consumes all prior task outputs.
- Produces a verified handoff report.

- [ ] Run `npm run check` and confirm zero errors.
- [ ] Run `npm run test:site` and confirm all static assertions pass.
- [ ] Run `npm audit --omit=dev` and record the vulnerability count.
- [ ] Run desktop and 390-pixel browser checks for layout, navigation, subnav, lightbox, and motion.
- [ ] Verify reduced-motion behavior and browser console output.
- [ ] Verify `git diff --check`, inspect `git diff`, and confirm the resume hash and research prose
  exclusions.
