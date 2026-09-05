# Stacy Part 3 Yash Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Stacy's Part 3 portfolio corrections, add a concise and technically accurate NOD case study, and make the homepage navigation track and control the section currently in view.

**Architecture:** Keep the existing Astro 7 content-collection architecture. Represent NOD as one new project MDX file plus a deduplicated local CAD asset set, extend the shared case hero with reusable external resource links, and keep homepage scroll-state behavior inside the existing navigation component. Extend the existing generated-site audit instead of adding a new test framework.

**Tech Stack:** Astro 7, MDX, TypeScript, Astro Assets, CSS, browser `IntersectionObserver`, Node.js static-site audit, Vercel

**Spec:** `/Users/johaanmannanal/Downloads/Stacy Directions Part 3.pdf` and `/Users/johaanmannanal/Downloads/NOD - Human Computer Lab.pdf`

## Global Constraints

- Preserve the site's existing typography, spacing system, dark/light themes, lightbox, scroll reveals, case-study hierarchy, and restrained technical aesthetic.
- Change the first two project positions without changing their card copy or media.
- Keep NOD concise enough to scan as a portfolio case study; the 26-page engineering document remains the detailed source of truth.
- Distinguish completed CAD, kinematic verification, and first-principles analysis from future physical validation. Do not claim that planned cycle, electronics, or manufacturing tests have already passed.
- Use only CAD images embedded in the supplied NOD engineering document. Do not generate replacement engineering media.
- Do not repeat an image within the NOD case-study page. A project-card thumbnail may also serve as its case-study hero, consistent with the existing repository rule.
- Preserve all existing project content except the elevator layout/media placement corrections and the specified experience-card revenue/link changes.
- Preserve the protected research source and resume PDF byte-for-byte.
- External links must open in a new tab with `rel="noopener noreferrer"`.
- Keep all body images lazy-loaded; only the case-study hero remains eager.
- Required release commands remain `npm run check` and `npm run test:site`.

---

## Confirmed Current State

- `main` is clean and matches `origin/main` at planning time.
- Baseline verification passes: Astro reports 0 diagnostics and the site audit passes for 12 generated pages.
- The homepage currently orders Elevator first and Climber second.
- Homepage sections have no IDs, and top-navigation links route to separate pages rather than homepage anchors.
- `Home` remains the only active top-navigation item while scrolling the homepage.
- The existing Experience / Leadership section is the natural target for the homepage `Resume` navigation item; the footer is the natural `Contact` target. This avoids adding duplicate homepage sections or changing the visible layout.
- The elevator comparison is rendered as `After` then `Before`, and the belt-tensioner close-up is inside Problems rather than Manufacturing.
- The NOD PDF contains 15 embedded raster images on pages 1, 9-13, and 24-26. The implementation will import 11 distinct views and leave near-duplicates unused.

---

## File Structure

**Create:**

- `src/assets/img/nod/final-assembled-cad.png` - NOD hero and card thumbnail.
- `src/assets/img/nod/head-angle-profile.png` - 0-degree/25-degree head-mechanism view.
- `src/assets/img/nod/rear-time-knob.png` - rear alarm-time input view.
- `src/assets/img/nod/latch-closeup.png` - striker and passive latch detail.
- `src/assets/img/nod/servo-linkage-locked.png` - first servo/linkage operating state.
- `src/assets/img/nod/servo-linkage-released.png` - second servo/linkage operating state.
- `src/assets/img/nod/arm-microswitch.png` - microswitch interface.
- `src/assets/img/nod/arm-pivot.png` - articulated arm and spring-return geometry.
- `src/assets/img/nod/split-body-assembly.png` - housing split and internal component placement.
- `src/assets/img/nod/arms-raised.png` - final alarm-state CAD.
- `src/assets/img/nod/exploded-assembly.png` - serviceable exploded assembly.
- `src/content/projects/nod-mullet-alarm-clock.mdx` - condensed NOD engineering case study.

**Modify:**

- `src/content.config.ts` - adds typed case-study resource links.
- `src/components/CaseHero.astro` - renders prominent resource buttons near the title.
- `src/components/CaseLayout.astro` - passes resource links to the hero.
- `src/pages/projects/[...slug].astro` - forwards resource-link frontmatter.
- `src/content/projects/deployable-climbing-mechanism.mdx` - changes only `order` from 2 to 1.
- `src/content/projects/three-stage-cascading-elevator.mdx` - changes `order`, corrects overview/comparison placement, and moves the belt-tensioner image.
- `src/content/projects/mk4-swerve-drivebase.mdx` - changes only `order` from 3 to 4.
- `src/content/projects/fpv-drone.mdx` - changes only `order` from 4 to 5.
- `src/pages/index.astro` - assigns homepage section IDs and navigation markers.
- `src/components/ExperienceStrip.astro` - becomes the `Resume` scroll target, updates Evergreen revenue, and adds supplied business links.
- `src/components/Footer.astro` - becomes the homepage `Contact` scroll target.
- `src/components/Nav.astro` - uses homepage anchors and updates active state while scrolling.
- `src/styles/global.css` - adds minimal comparison/resource-link/scroll-target rules.
- `scripts/check-site.mjs` - protects ordering, NOD accuracy, links, media uniqueness, elevator placement, and homepage anchors.
- `README.md` - documents `resourceLinks` for future case studies.

---

### Task 1: Correct project order and experience-card facts

**Files:**

- Modify: `scripts/check-site.mjs`
- Modify: `src/content/projects/deployable-climbing-mechanism.mdx:7`
- Modify: `src/content/projects/three-stage-cascading-elevator.mdx:7`
- Modify: `src/content/projects/mk4-swerve-drivebase.mdx:7`
- Modify: `src/content/projects/fpv-drone.mdx:7`
- Modify: `src/components/ExperienceStrip.astro:2-35`

**Interfaces:**

- Consumes: content-collection sorting by numeric `order`.
- Produces: the shared order `Climber -> Elevator -> NOD -> Drivebase -> FPV` on the homepage, projects index, case pager, and generated static paths.

- [ ] **Step 1: Add failing generated-site checks for order, revenue, and business links**

Add after `const home = ...` in `scripts/check-site.mjs`:

```js
for (const relative of ['index.html', 'projects/index.html']) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  const climberPosition = html.indexOf('Deployable Multi-Level Climbing Mechanism');
  const elevatorPosition = html.indexOf('Three-Stage Cascading Elevator');
  if (climberPosition === -1 || elevatorPosition === -1 || climberPosition > elevatorPosition) {
    fail(`/${relative === 'index.html' ? '' : 'projects/'}: Climber is not before Elevator`);
  }
}

if (!home.includes('~$28K revenue')) fail('/: Evergreen Code Camp revenue is not updated');
for (const href of ['https://evergreencodecamp.com/', 'https://praevius.co/']) {
  if (!home.includes(`href="${href}"`)) fail(`/: missing experience link ${href}`);
}
```

- [ ] **Step 2: Run the audit and verify the intended failure**

Run:

```bash
npm run test:site
```

Expected: FAIL because NOD is missing, the first two cards are reversed, Evergreen still says `~$20K revenue`, and the two supplied business links are absent.

- [ ] **Step 3: Reserve the final five-project ordering**

Set only the `order` values:

```yaml
# deployable-climbing-mechanism.mdx
order: 1

# three-stage-cascading-elevator.mdx
order: 2

# nod-mullet-alarm-clock.mdx (created in Task 4)
order: 3

# mk4-swerve-drivebase.mdx
order: 4

# fpv-drone.mdx
order: 5
```

- [ ] **Step 4: Update and link the two experience cards without changing the grid**

Extend the two relevant data entries:

```ts
{
  title: 'Praevius — Partner',
  url: 'https://praevius.co/',
  copy: 'Led social media and used Stable Diffusion, video editing, and four AI outreach systems in work associated with ~$200K lifetime revenue.',
},
{
  title: 'Evergreen Code Camp — Co-founder',
  url: 'https://evergreencodecamp.com/',
  copy: 'Created Python and Scratch curriculum, taught online and in person, and supported 40+ signups and ~$28K revenue.',
},
```

Render optional linked headings as:

```astro
<h3>
  {experience.url
    ? <a href={experience.url} target="_blank" rel="noopener noreferrer">{experience.title} ↗</a>
    : experience.title}
</h3>
```

Do not change the FRC or VTseva cards.

- [ ] **Step 5: Run the focused checks**

Run:

```bash
npm run check
npm run test:site
```

Expected: both commands pass.

- [ ] **Step 6: Commit the independently reviewable corrections**

```bash
git add scripts/check-site.mjs src/components/ExperienceStrip.astro src/content/projects/deployable-climbing-mechanism.mdx src/content/projects/three-stage-cascading-elevator.mdx src/content/projects/mk4-swerve-drivebase.mdx src/content/projects/fpv-drone.mdx
git commit -m "fix: apply Stacy homepage ordering and links"
```

---

### Task 2: Repair the elevator case-study layout and media story

**Files:**

- Create: `src/assets/img/elevator/cad-iso-tight.png`
- Create: `src/assets/img/elevator/reinforced-pulley-cad-tight.png`
- Modify: `src/content/projects/three-stage-cascading-elevator.mdx:48-60,134-202`
- Modify: `src/styles/global.css:102-120`
- Modify: `scripts/check-site.mjs`

**Interfaces:**

- Consumes: existing `Fig`, `.split`, and `.grid.two` presentation patterns.
- Produces: a top-aligned overview CAD figure, one explicit `Before -> After` comparison, and a Manufacturing section that owns the installed tensioner photo.

- [ ] **Step 1: Add failing source-structure checks**

After loading the elevator source in `scripts/check-site.mjs`, add:

```js
const elevatorSource = await readFile(
  path.join(root, 'src/content/projects/three-stage-cascading-elevator.mdx'),
  'utf8',
);
const elevatorProblems = elevatorSource.match(/<section id="problems">([\s\S]*?)<\/section>/)?.[1] ?? '';
const elevatorManufacturing = elevatorSource.match(/<section id="manufacturing">([\s\S]*?)<\/section>/)?.[1] ?? '';
const beforePosition = elevatorProblems.indexOf('label="Before"');
const afterPosition = elevatorProblems.indexOf('label="After"');

if (beforePosition === -1 || afterPosition === -1 || beforePosition > afterPosition) {
  fail('three-stage-cascading-elevator.mdx: comparison is not Before then After');
}
if (elevatorProblems.includes('belt-tensioner-closeup.png')) {
  fail('three-stage-cascading-elevator.mdx: tensioner photo remains in Problems');
}
if (!elevatorManufacturing.includes('belt-tensioner-closeup.png')) {
  fail('three-stage-cascading-elevator.mdx: tensioner photo is missing from Manufacturing');
}
if (!elevatorProblems.includes('class="comparison"')) {
  fail('three-stage-cascading-elevator.mdx: explicit comparison wrapper is missing');
}
```

- [ ] **Step 2: Confirm the existing page fails the new checks**

Run:

```bash
npm run test:site
```

Expected: FAIL for reversed comparison order and incorrect tensioner placement.

- [ ] **Step 3: Create tightly bounded CAD derivatives while preserving card media**

Use ImageMagick only to remove transparent canvas, retaining a small consistent border:

```bash
magick src/assets/img/elevator/cad-iso.png -trim -bordercolor none -border 36 src/assets/img/elevator/cad-iso-tight.png
magick src/assets/img/elevator/reinforced-pulley-cad.png -trim -bordercolor none -border 36 src/assets/img/elevator/reinforced-pulley-cad-tight.png
```

Keep `thumbnail: elevator/cad-iso.png` unchanged so the card does not change. Use `cad-iso-tight.png` only in the overview figure. Verify each derivative still has an alpha channel and that no mechanism pixels were clipped:

```bash
magick identify -format '%f %wx%h %[channels]\n' src/assets/img/elevator/*tight.png
```

- [ ] **Step 4: Replace the overview figure with the tight derivative**

Change only the `src` of the overview figure:

```mdx
<Fig src={img('elevator/cad-iso-tight.png')} alt="CAD isometric view of the three-stage cascading elevator assembly" contain
     label="CAD" caption="The elevator assembly: aluminum V-slot extrusion stages, belt rigging, and the single drive motor at the base." />
```

The existing `.split { align-items: start; }` remains the alignment contract; the tight image removes the perceived whitespace inside the image itself.

- [ ] **Step 5: Rebuild the comparison in the required semantic order**

Replace the current two-figure grid with:

```mdx
<div class="comparison" aria-label="Before and after custom pulley redesign">
  <Fig src={img('elevator/original-printed-pulley.png')} alt="Earlier 3D-printed elevator pulley body before the reinforced redesign"
       label="Before" caption="The earlier printed pulley body before the geometry and material were strengthened for the belt load." />
  <Fig src={img('elevator/reinforced-pulley-cad-tight.png')} alt="CAD close-up of the reinforced custom elevator pulley with internal support structure" contain
       label="After" caption="The reinforced custom-pulley design, with additional structure around the toothed pulley and bearing interface." />
</div>
```

Add the smallest dedicated layout rule:

```css
.comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; margin: 1.5rem 0; }
@media (max-width: 760px) { .comparison { grid-template-columns: 1fr; } }
```

There must be exactly two children and no empty spacer node.

- [ ] **Step 6: Move the installed tensioner photo to Manufacturing**

Remove the figure from the opening Problems split, leaving the existing Problems introduction as normal prose. In Manufacturing, wrap the existing manufacturing copy and the photo in:

```mdx
<div class="split">
  <div class="txt">
    <p>The elevator's aluminum plates were plasma cut, and many components were then machined on a
    mill for precise holes, mounting features, and interfaces.</p>
    <p>Several components used hybrid manufacturing. The belt clamps, for example, combined a
    3D-printed component with integrated belt teeth and a plasma-cut aluminum plate: the printed
    part provided the required geometry while the aluminum provided structural support.</p>
    <p>Combining additive and subtractive manufacturing let components be iterated quickly without
    standing up an entirely new manufacturing process for every revision.</p>
    <p class="small muted">I performed the design, CAD, assembly, and testing; other team members
    assisted with manufacturing.</p>
  </div>
  <Fig src={img('elevator/belt-tensioner-closeup.png')} alt="Close-up of the elevator belt tensioner, drive pulleys, and toothed belts on the assembled mechanism"
       label="Manufacturing detail" caption="The installed belt hardware combines printed tensioning components, toothed pulleys, and paired belt runs on the lower stage." />
</div>
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm run check
npm run test:site
```

Expected: both commands pass; the elevator checks pass and its generated page still contains nine project images.

```bash
git add scripts/check-site.mjs src/styles/global.css src/content/projects/three-stage-cascading-elevator.mdx src/assets/img/elevator/cad-iso-tight.png src/assets/img/elevator/reinforced-pulley-cad-tight.png
git commit -m "fix: repair elevator comparison and media placement"
```

---

### Task 3: Extract and verify the NOD CAD asset set

**Files:**

- Create: all eleven files under `src/assets/img/nod/` listed in File Structure.

**Interfaces:**

- Consumes: embedded image numbers from `/Users/johaanmannanal/Downloads/NOD - Human Computer Lab.pdf`.
- Produces: stable local image paths consumed by `nod-mullet-alarm-clock.mdx` in Task 4.

- [ ] **Step 1: Extract embedded images losslessly into temporary storage**

```bash
mkdir -p /private/tmp/yash-nod-assets
pdfimages -png "/Users/johaanmannanal/Downloads/NOD - Human Computer Lab.pdf" /private/tmp/yash-nod-assets/nod
mkdir -p src/assets/img/nod
```

Expected: outputs `nod-000.png` through `nod-014.png` corresponding to the 15 images reported by `pdfimages -list`.

- [ ] **Step 2: Copy only the approved unique views**

```bash
cp /private/tmp/yash-nod-assets/nod-010.png src/assets/img/nod/final-assembled-cad.png
cp /private/tmp/yash-nod-assets/nod-002.png src/assets/img/nod/head-angle-profile.png
cp /private/tmp/yash-nod-assets/nod-003.png src/assets/img/nod/rear-time-knob.png
cp /private/tmp/yash-nod-assets/nod-004.png src/assets/img/nod/latch-closeup.png
cp /private/tmp/yash-nod-assets/nod-005.png src/assets/img/nod/servo-linkage-locked.png
cp /private/tmp/yash-nod-assets/nod-006.png src/assets/img/nod/servo-linkage-released.png
cp /private/tmp/yash-nod-assets/nod-007.png src/assets/img/nod/arm-microswitch.png
cp /private/tmp/yash-nod-assets/nod-008.png src/assets/img/nod/arm-pivot.png
cp /private/tmp/yash-nod-assets/nod-009.png src/assets/img/nod/split-body-assembly.png
cp /private/tmp/yash-nod-assets/nod-013.png src/assets/img/nod/arms-raised.png
cp /private/tmp/yash-nod-assets/nod-014.png src/assets/img/nod/exploded-assembly.png
```

Do not import image 000, because it is a near-duplicate assembled view. Do not import images 001, 011, or 012 because their subjects are already represented by higher-value views in the selected set.

- [ ] **Step 3: Verify identity, dimensions, and visual integrity**

```bash
find src/assets/img/nod -type f -print0 | xargs -0 shasum -a 256
magick identify -format '%f %wx%h %[channels]\n' src/assets/img/nod/*.png
```

Expected: 11 files, 11 distinct SHA-256 values, nonzero dimensions, and RGB/RGBA channels. Render a contact sheet and visually confirm that filenames match their mechanisms, no report text was baked into the extracted images, and no view is clipped.

- [ ] **Step 4: Commit the source-faithful asset set**

```bash
git add src/assets/img/nod
git commit -m "feat: import NOD engineering CAD media"
```

---

### Task 4: Add reusable hero resource links and the NOD case study

**Files:**

- Modify: `src/content.config.ts:7-24`
- Modify: `src/components/CaseHero.astro:1-38`
- Modify: `src/components/CaseLayout.astro:4-16`
- Modify: `src/pages/projects/[...slug].astro:20-33`
- Modify: `src/styles/global.css`
- Create: `src/content/projects/nod-mullet-alarm-clock.mdx`
- Modify: `scripts/check-site.mjs:70-103,218-236`
- Modify: `README.md`

**Interfaces:**

- Consumes: `resourceLinks: Array<{ label: string; url: string; primary: boolean }>` from project frontmatter.
- Produces: reusable prominent case-hero buttons and the published `/projects/nod-mullet-alarm-clock/` route.

- [ ] **Step 1: Add failing NOD route, link, calculation, and media checks**

Add NOD to `publishedCases`, `expectedEngineeringMediaCounts`, and `engineeringSources`:

```js
'projects/nod-mullet-alarm-clock/index.html'
```

Use `11` as its expected main-image count. Add:

```js
const expectedProjectOrder = [
  'Deployable Multi-Level Climbing Mechanism',
  'Three-Stage Cascading Elevator',
  "NOD — World’s First Mullet Alarm Clock",
  'MK4 Swerve Drivebase & Robot Architecture',
  '5&quot; FPV Drone',
];

for (const relative of ['index.html', 'projects/index.html']) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  const positions = expectedProjectOrder.map((title) => html.indexOf(title));
  if (positions.some((position) => position === -1)) {
    fail(`/${relative === 'index.html' ? '' : 'projects/'}: expected project card is missing`);
  } else if (!positions.every((position, index) => index === 0 || position > positions[index - 1])) {
    fail(`/${relative === 'index.html' ? '' : 'projects/'}: engineering project cards are out of order`);
  }
}

const nodRelative = 'projects/nod-mullet-alarm-clock/index.html';
const nodHtml = await readFile(path.join(dist, nodRelative), 'utf8');
for (const required of [
  'https://cad.onshape.com/documents/3cc67d834625abdaba8a0714/w/8c1d8e43e3b261aa53b61765/e/8846a2ffcb85cf3baeb6b24f?explodedView=MARk7wZDxoNfkNJaE&amp;renderMode=0&amp;rightPanel=explodedViewPanel&amp;uiState=6a9ab5d1dd3da2fde127e88d',
  'https://docs.google.com/document/d/1hI7eHdzWl168FjE_l6W464brnZpxeCyjNLBIWV2eo8g/edit?usp=sharing',
  'View CAD on Onshape',
  'View Full Engineering Documentation',
  '0.481 lbf·in',
  '0.664 lbf',
  '0.318 lbf·in',
  '1.74–1.91 lbf·in',
]) {
  if (!nodHtml.includes(required)) fail(`/projects/nod-mullet-alarm-clock/: missing ${required}`);
}

const nodExternalLinks = [...nodHtml.matchAll(/<a\b([^>]*)>/g)]
  .map((match) => match[1])
  .filter((attrs) => attrs.includes('cad.onshape.com') || attrs.includes('docs.google.com'));
if (nodExternalLinks.length !== 2 || nodExternalLinks.some((attrs) =>
  !attrs.includes('target="_blank"') || !attrs.includes('rel="noopener noreferrer"')
)) {
  fail('/projects/nod-mullet-alarm-clock/: resource links are not safe new-tab links');
}
```

Run `npm run test:site`; expected failure is a missing NOD route.

- [ ] **Step 2: Add typed resource-link frontmatter**

Add to the shared `base` schema in `src/content.config.ts`:

```ts
resourceLinks: z.array(z.object({
  label: z.string(),
  url: z.url(),
  primary: z.boolean().default(false),
})).default([]),
```

Document the same structure in the README project example.

- [ ] **Step 3: Thread the resource links through the case components**

Use this shared TypeScript shape in `CaseHero.astro` and `CaseLayout.astro`:

```ts
interface ResourceLink {
  label: string;
  url: string;
  primary?: boolean;
}
```

Add `resourceLinks?: ResourceLink[]` to both props, default it to `[]`, pass it from `CaseLayout` to `CaseHero`, and pass `resourceLinks={d.resourceLinks}` from the project route.

Render links in `CaseHero.astro` immediately after the subtitle and before the hero image:

```astro
{resourceLinks.length > 0 && (
  <nav class="case-actions" aria-label="Project resources">
    {resourceLinks.map((resource) => (
      <a class:list={['btn', { primary: resource.primary }]} href={resource.url}
         target="_blank" rel="noopener noreferrer">
        {resource.label} ↗
      </a>
    ))}
  </nav>
)}
```

Add component-local styling:

```css
.case-actions { display: flex; flex-wrap: wrap; gap: 0.65rem; margin: -0.6rem 0 1.5rem; }
```

- [ ] **Step 4: Create the NOD frontmatter and section contract**

Start `nod-mullet-alarm-clock.mdx` with:

```mdx
---
title: NOD — World’s First Mullet Alarm Clock
subtitle: Mechanical Design · CAD · Kinematics · Electronics Integration · DFM
summary: A character-driven mechanical alarm clock whose spring-return head, passive latch, servo linkage, articulated controls, and OLED turn the alarm sequence into a physical interaction.
disciplines: ['Mechanical Design', 'CAD', 'Kinematics', 'Electronics Integration', 'DFM']
kind: mechanical
order: 3
status: published
hero: nod/final-assembled-cad.png
heroContain: true
thumbnail: nod/final-assembled-cad.png
stats:
  - { value: '25°', label: 'Head travel' }
  - { value: '0.318 lbf·in', label: 'Required servo torque' }
  - { value: '1.74–1.91 lbf·in', label: 'Servo capability' }
  - { value: 'PETG', label: 'Prototype material' }
resourceLinks:
  - label: View CAD on Onshape
    url: https://cad.onshape.com/documents/3cc67d834625abdaba8a0714/w/8c1d8e43e3b261aa53b61765/e/8846a2ffcb85cf3baeb6b24f?explodedView=MARk7wZDxoNfkNJaE&renderMode=0&rightPanel=explodedViewPanel&uiState=6a9ab5d1dd3da2fde127e88d
    primary: true
  - label: View Full Engineering Documentation
    url: https://docs.google.com/document/d/1hI7eHdzWl168FjE_l6W464brnZpxeCyjNLBIWV2eo8g/edit?usp=sharing
sections:
  - { id: overview, label: Overview }
  - { id: interaction, label: Interaction }
  - { id: architecture, label: Architecture }
  - { id: decisions, label: Decisions }
  - { id: analysis, label: Analysis }
  - { id: manufacturing, label: Manufacturing }
  - { id: testing, label: Testing }
  - { id: final, label: Final design }
---
import Fig from '../../components/Fig.astro';
import { img } from '../../lib/images';
```

- [ ] **Step 5: Write the eight-section condensed engineering story**

Append this exact body after the imports:

```mdx
<section id="overview">
<span class="eyebrow">01 — Project overview</span>
<h2>An alarm clock that moves as part of the interface</h2>

NOD is a character-driven mechanical alarm clock that combines **mechanical motion,
electronics, and physical interaction**. The goal was not to hide a conventional digital alarm
inside a robot-shaped enclosure. The head, latch, arms, OLED, and time-selection knob all take part
in setting, activating, snoozing, and stopping the alarm.

The project brings together CAD, mechanical architecture, kinematic verification,
first-principles force and torque analysis, FDM prototype planning, electronics integration, and a
path toward production manufacturing.

<div class="note">
<b>This page is the condensed engineering story.</b> The resource links above provide the complete
26-page technical documentation and the live Onshape assembly.
</div>
</section>

<section id="interaction">
<span class="eyebrow">02 — User interaction</span>
<h2>The character is the control surface</h2>

<ol>
  <li>Rotate the rear knob to select the alarm time.</li>
  <li>Read the selected time on the OLED.</li>
  <li>Push the head downward to confirm the time.</li>
  <li>The head stops and latches at 25°.</li>
  <li>At the selected time, the alarm activates and the latch releases the head.</li>
  <li>Press one articulated arm for a 10-minute snooze or the other arm to stop the alarm.</li>
</ol>

<div class="grid two">
  <Fig src={img('nod/head-angle-profile.png')} alt="Side CAD view of the NOD head mechanism at its defined upright and 25-degree lowered positions" contain
       label="Head motion" caption="Mechanical geometry defines the 0° upright position and the 25° lowered alarm-setting state." />
  <Fig src={img('nod/rear-time-knob.png')} alt="Rear CAD view of NOD showing the rotary knob used to select the alarm time" contain
       label="Time selection" caption="The rear rotary input selects the time shown on the OLED before the user pushes the head down to confirm." />
</div>
</section>

<section id="architecture">
<span class="eyebrow">03 — Mechanical architecture</span>
<h2>One expressive motion, built from compact mechanisms</h2>

<div class="split">
  <div class="txt">
    <h3>Spring-return head and passive latch</h3>
    <p>The head rotates through 25° about a fixed pivot. Pushing it down loads a return spring while a
    striker moves past the latch. The latch then returns to its locking position and retains the head
    without continuous actuator torque.</p>
    <p>A mechanical backstop defines the upright position, while the striker-and-latch interface
    defines the lowered position.</p>
  </div>
  <Fig src={img('nod/latch-closeup.png')} alt="Close CAD view of the NOD head striker captured by the passive latch" contain
       label="Passive retention" caption="The striker gives the latch a dedicated capture surface instead of loading a thin housing edge." />
</div>

<h3>Micro servo and printed linkage</h3>

The MG90S-class metal-gear micro servo rotates the latch through a short printed linkage. This
uses fewer components than a gear train, stays compact, and can be revised quickly during
prototyping.

<div class="grid two">
  <Fig src={img('nod/servo-linkage-locked.png')} alt="Transparent CAD view of the NOD servo and printed linkage with the latch engaged" contain
       label="Locked state" caption="The linkage leaves the passive latch engaged while the head is held at 25°." />
  <Fig src={img('nod/servo-linkage-released.png')} alt="Front CAD view of the NOD servo and printed linkage rotating the latch clear of the striker" contain
       label="Released state" caption="Servo rotation pulls the latch clear so the stored spring force can return the head upright." />
</div>

<h3>Articulated arm controls</h3>

Both arms use the same pivot and spring-return architecture. Pressing an arm rotates it against its
spring and actuates a microswitch; releasing it returns the arm to its resting position. The arms
therefore serve as both character expression and snooze/stop inputs.

<div class="grid two">
  <Fig src={img('nod/arm-microswitch.png')} alt="CAD close-up of a NOD arm contacting its internal microswitch" contain
       label="Switch interface" caption="Arm travel is converted directly into a discrete electrical input." />
  <Fig src={img('nod/arm-pivot.png')} alt="Transparent CAD view of the NOD articulated arm pivot and spring-return geometry" contain
       label="Arm pivot" caption="Identical left and right assemblies reduce part variation and simplify replacement." />
</div>

<div class="split">
  <div class="txt">
    <h3>Split housing and moving display</h3>
    <p>The left/right body halves use M3 fasteners and heat-set inserts so the enclosure can be opened
    repeatedly for assembly, testing, and component replacement.</p>
    <p>The servo and control electronics stay in the stationary body to minimize moving mass. Only
    the OLED and its required wiring move with the head, using a dedicated internal wire channel to
    avoid the mechanism.</p>
  </div>
  <Fig src={img('nod/split-body-assembly.png')} alt="Exploded side CAD view of NOD's split housing, internal electronics, and fastener layout" contain
       label="Internal packaging" caption="The split enclosure exposes the stationary electronics while preserving a controlled wiring path into the moving head." />
</div>
</section>

<section id="decisions">
<span class="eyebrow">04 — Design decisions</span>
<h2>Architecture selected around reliability and interaction</h2>

<div class="role">
  <div><span class="eyebrow">Passive latch</span>Holds the head without asking the servo to sustain torque between setting and release.</div>
  <div><span class="eyebrow">Printed linkage</span>Provides the required latch travel with fewer parts and faster prototype iteration than a gear train.</div>
  <div><span class="eyebrow">Split housing</span>Improves print orientation, internal access, assembly, service, and mechanism-level iteration.</div>
  <div><span class="eyebrow">Stationary electronics</span>Keeps moving mass and head wiring to a minimum while the OLED moves with the character.</div>
  <div><span class="eyebrow">Arm-mounted controls</span>Make snooze and stop part of the character instead of adding unrelated buttons.</div>
  <div><span class="eyebrow">Mechanical stops</span>Define the 0° and 25° endpoints through geometry rather than depending on servo positioning.</div>
</div>
</section>

<section id="analysis">
<span class="eyebrow">05 — Engineering analysis</span>
<h2>Verifying motion and sizing the actuator</h2>

A master mechanism sketch established the fixed servo and latch pivots, the locked 25° state,
and the released 0° state. The fixed-length linkage was checked through both positions for full
latch engagement, sufficient release travel, and interference with the striker, body, and servo.

<div class="table-wrap">
<table class="spec-table">
  <thead><tr><th>Result</th><th>Engineering meaning</th></tr></thead>
  <tbody>
    <tr><td>0.481 lbf·in</td><td>Maximum gravitational torque at 25°; the head-return spring must provide at least this restoring torque.</td></tr>
    <tr><td>0.664 lbf</td><td>Estimated striker force at the latch; this is the design load for the latch, pivot, and adjacent body ears.</td></tr>
    <tr><td>0.318 lbf·in</td><td>Calculated servo torque required through the measured latch and horn geometry.</td></tr>
    <tr><td>1.74–1.91 lbf·in</td><td>Approximate capability of the selected MG90S-class servo, providing substantial static torque margin.</td></tr>
  </tbody>
</table>
</div>

<div class="note">
These are simplified static calculations. Friction, latch contact behavior, spring tolerances, and
dynamic loads remain part of physical validation.
</div>
</section>

<section id="manufacturing">
<span class="eyebrow">06 — Structure, materials, and manufacturing</span>
<h2>Designed to iterate now and manufacture later</h2>

Concentrated loads occur around the latch, M3 latch pivot, body ears, striker, and linkage. The
design adds material around the pivot, uses filleted transitions, gives the latch a dedicated
striker, defines travel with mechanical stops, and keeps the linkage short to limit bending.

PETG is specified for the FDM prototype because it offers more toughness and repeated-load
resistance than PLA while remaining practical to print. Separate head, body, latch, arm, and
linkage parts allow one mechanism to be revised or replaced without rebuilding the full product.
M3 fasteners and heat-set inserts support repeatable assembly and servicing.

For production, the proposed architecture transitions the primary housing to injection-molded
PC-ABS and the repeatedly loaded latch to PA Nylon. Production refinement would add controlled
wall thicknesses, draft, fillets, and a defined parting line before tooling.

<Fig src={img('nod/exploded-assembly.png')} alt="Exploded CAD assembly of NOD showing the split body, head, arms, mechanisms, and fasteners" contain
     label="Modular assembly" caption="Separate mechanical modules and standardized hardware support independent assembly, testing, replacement, and manufacturing refinement." />
</section>

<section id="testing">
<span class="eyebrow">07 — Testing and development</span>
<h2>Validation required before design freeze</h2>

The CAD and calculations establish the intended architecture; the following physical validation
work remains before production:

- Confirm repeatable head travel, latch engagement, and latch release between 0° and 25°.
- Select and cycle-test the head and arm return springs.
- Validate servo travel, linkage motion, torque margin, friction, and contact behavior.
- Confirm both arm-mounted microswitches actuate and reset reliably.
- Integrate the OLED, microcontroller, knob, switches, servo, power, and alarm-control software.
- Check that the OLED wiring clears every moving mechanism throughout head travel.
- Run repeated operating cycles to identify wear, loosening, or loss of function.
- Validate prototype tolerances, assembly time, and production-critical interfaces before tooling.

Each mechanical, electrical, system, reliability, and manufacturing gate must pass before design
freeze.
</section>

<section id="final">
<span class="eyebrow">08 — Final design</span>
<h2>Mechanical engineering expressed as product behavior</h2>

NOD combines a spring-return head, passive striker-and-latch retention, servo-operated linkage,
articulated arm controls, OLED feedback, and a modular split housing into one character-driven
alarm interaction. The result is a product concept in which mechanical engineering, electronics,
assembly, and personality support the same user experience.

<Fig src={img('nod/arms-raised.png')} alt="Final NOD CAD view with both articulated arms raised in the alarm state" contain
     label="Alarm state" caption="The head, OLED, and articulated controls work together as the visible and physical expression of the alarm." />
</section>
```

- [ ] **Step 6: Complete the NOD and project-order audit**

Add `nod-mullet-alarm-clock.mdx` to the duplicate-media source list. Ensure the project-order check from Task 1 now passes on both card grids. Verify NOD is included in the sitemap because its status is `published`.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm run check
npm run test:site
```

Expected: both pass; 13 HTML pages are generated; NOD has a subnavigation, 11 unique images in `<main>`, both resource links, all four analysis values, and no duplicate media URL.

```bash
git add README.md scripts/check-site.mjs src/content.config.ts src/components/CaseHero.astro src/components/CaseLayout.astro 'src/pages/projects/[...slug].astro' src/styles/global.css src/content/projects/nod-mullet-alarm-clock.mdx
git commit -m "feat: add NOD engineering case study"
```

---

### Task 5: Synchronize homepage sections with top navigation

**Files:**

- Modify: `src/pages/index.astro:12-99`
- Modify: `src/components/ExperienceStrip.astro:22`
- Modify: `src/components/Footer.astro:1-20`
- Modify: `src/components/Nav.astro:1-83`
- Modify: `src/styles/global.css:30-31`
- Modify: `scripts/check-site.mjs`

**Interfaces:**

- Consumes: homepage elements marked `data-nav-section` with IDs `home`, `projects`, `research`, `resume`, `about`, and `contact`.
- Produces: same-page anchor navigation and `aria-current="location"` for the section currently in view; non-home routes retain their existing page links and `aria-current="page"` behavior.

- [ ] **Step 1: Add failing homepage anchor-contract checks**

Add:

```js
for (const section of ['home', 'projects', 'research', 'resume', 'about', 'contact']) {
  if (!home.includes(`id="${section}"`)) fail(`/: missing #${section} scroll target`);
  if (!home.includes(`href="#${section}"`)) fail(`/: missing #${section} navigation link`);
}
if (!home.includes('data-home-section="projects"')) fail('/: navigation lacks section-state markers');
```

Also load `dist/about/index.html` and assert it still contains `href="/projects"`, `href="/research"`, `href="/resume"`, `href="/about"`, and `href="/contact"`. This protects separate-page navigation outside the homepage.

Run `npm run test:site`; expected failure is missing homepage IDs/anchors.

- [ ] **Step 2: Mark the six existing targets without adding visible sections**

Use these exact mappings:

```text
Home                 -> hero section             -> #home
Engineering Projects -> engineering card section -> #projects
Research             -> research card section    -> #research
Resume               -> Experience / Leadership -> #resume
About                -> existing About section   -> #about
Contact              -> existing site footer     -> #contact
```

Add `id` and `data-nav-section` to the five homepage sections. In `ExperienceStrip.astro`, render:

```astro
<section id="resume" class="section experience" data-nav-section aria-labelledby="experience-heading">
```

In `Footer.astro`, derive `const isHome = Astro.url.pathname === '/'` and render `id={isHome ? 'contact' : undefined}` plus `data-nav-section={isHome ? '' : undefined}` on the footer.

- [ ] **Step 3: Make Nav destinations context-aware**

Represent the six internal links as:

```ts
const links = [
  { route: '/', section: 'home', label: 'Home' },
  { route: '/projects', section: 'projects', label: 'Engineering Projects' },
  { route: '/research', section: 'research', label: 'Research' },
  { route: '/resume', section: 'resume', label: 'Resume' },
  { route: '/about', section: 'about', label: 'About' },
  { route: '/contact', section: 'contact', label: 'Contact' },
];
const path = Astro.url.pathname.replace(/\/$/, '') || '/';
const isHome = path === '/';
```

Render each link with `href={isHome ? `#${link.section}` : link.route}` and `data-home-section={isHome ? link.section : undefined}`. Preserve the current route-based `aria-current="page"` behavior off the homepage. On the homepage, initialize Home with `aria-current="location"`.

- [ ] **Step 4: Add section-state tracking to the existing Nav script**

After the mobile-menu logic, add one homepage-only observer:

```ts
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-home-section]')];
const sectionTargets = sectionLinks
  .map((link) => document.getElementById(link.dataset.homeSection ?? ''))
  .filter((section): section is HTMLElement => Boolean(section));

const setCurrentSection = (id: string) => {
  sectionLinks.forEach((link) => {
    const current = link.dataset.homeSection === id;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

if (sectionLinks.length === 6 && sectionTargets.length === 6 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (current?.target.id) setCurrentSection(current.target.id);
  }, { rootMargin: '-57px 0px -65% 0px', threshold: 0 });

  sectionTargets.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      setCurrentSection('contact');
    }
  }, { passive: true });
}
```

The browser's native hash navigation plus the existing `html { scroll-behavior: smooth; }` performs scrolling. The existing reduced-motion media query continues to switch it to `auto`.

- [ ] **Step 5: Style both page-current and section-current states identically**

Change the active selector in `Nav.astro` to:

```css
li a[aria-current="page"], li a[aria-current="location"], li a.active {
  color: var(--ink);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 var(--accent);
  border-radius: 0;
}
```

Add:

```css
[data-nav-section] { scroll-margin-top: 64px; }
```

- [ ] **Step 6: Verify static output and interactive behavior**

Run:

```bash
npm run check
npm run test:site
npm run preview -- --host 127.0.0.1
```

In the browser, verify at desktop and mobile widths:

1. Each homepage nav item scrolls to its mapped target.
2. The active underline advances in order: Home, Engineering Projects, Research, Resume, About, Contact.
3. Contact activates at the bottom of the page.
4. The mobile menu closes after selecting a section.
5. Keyboard activation works and focus remains visible.
6. With reduced motion enabled, navigation jumps without animation.
7. On `/about/`, the same nav items still open their standalone routes rather than homepage hashes.

- [ ] **Step 7: Commit the navigation behavior**

```bash
git add scripts/check-site.mjs src/pages/index.astro src/components/ExperienceStrip.astro src/components/Footer.astro src/components/Nav.astro src/styles/global.css
git commit -m "feat: synchronize homepage navigation with scroll"
```

---

### Task 6: Final release-quality verification

**Files:**

- Verify all files changed in Tasks 1-5.
- Modify only if a verification failure identifies a scoped defect.

**Interfaces:**

- Consumes: complete Stacy Part 3 implementation.
- Produces: a reviewable branch with automated and visual evidence; no production publish without separate authorization.

- [ ] **Step 1: Run clean automated verification**

```bash
npm run check
npm run test:site
git diff --check
git status --short
```

Expected: 0 Astro diagnostics, passing site audit, no whitespace errors, and only intentional tracked changes if a final fix remains uncommitted.

- [ ] **Step 2: Recheck protected artifacts**

```bash
git diff --exit-code -- src/content/research/wearable-health-ml.mdx public/Yash_Piratla_Resume.pdf
```

Expected: no diff.

- [ ] **Step 3: Inspect generated routes and external-link safety**

Verify:

```bash
rg -n "NOD|View CAD on Onshape|View Full Engineering Documentation|noopener noreferrer" dist/projects/nod-mullet-alarm-clock/index.html
rg -n "href=\"#(home|projects|research|resume|about|contact)\"" dist/index.html
```

Expected: both NOD resource links and all six homepage anchors are present.

- [ ] **Step 4: Perform responsive visual QA**

Review the homepage, elevator case study, and NOD case study at 1440x900, 390x844, and 320x568. Confirm:

- no horizontal overflow or clipped sticky navigation;
- Climber, Elevator, NOD, Drivebase, and FPV order is consistent;
- elevator CAD begins level with overview copy, comparison reads Before then After, and there is no empty white panel;
- belt-tensioner hardware appears in Manufacturing only;
- NOD resource buttons are prominent near the title and wrap cleanly on mobile;
- NOD images are sharp, unique, correctly captioned, and distributed without large accidental blank areas;
- analysis values and units are readable and explained;
- dark mode, lightbox, keyboard focus, reduced motion, and lazy-loaded body media still work;
- browser console contains no errors.

- [ ] **Step 5: Finalize commits and prepare preview handoff**

If verification required fixes, rerun Steps 1-4 and commit only the affected paths:

```bash
git add README.md scripts/check-site.mjs src/content.config.ts src/components/CaseHero.astro src/components/CaseLayout.astro src/components/ExperienceStrip.astro src/components/Footer.astro src/components/Nav.astro src/pages/index.astro 'src/pages/projects/[...slug].astro' src/styles/global.css src/content/projects/deployable-climbing-mechanism.mdx src/content/projects/three-stage-cascading-elevator.mdx src/content/projects/nod-mullet-alarm-clock.mdx src/content/projects/mk4-swerve-drivebase.mdx src/content/projects/fpv-drone.mdx src/assets/img/elevator/cad-iso-tight.png src/assets/img/elevator/reinforced-pulley-cad-tight.png src/assets/img/nod
git commit -m "fix: address Stacy Part 3 review findings"
```

Do not use `git add .`. Do not push, open a pull request, deploy, or modify production DNS without the user's explicit authorization. When authorized, use a feature branch and Vercel preview for stakeholder review before merging to `main`.

---

## Plan Self-Review

- **Spec coverage:** All Stacy requests map to Tasks 1, 2, 4, or 5. All required NOD content areas, calculations, images, links, and manufacturing/testing distinctions map to Task 4.
- **Scope:** No unrelated redesign, dependency upgrade, research edit, resume edit, domain change, or publishing action is included.
- **Type consistency:** `resourceLinks` uses the same `{ label, url, primary }` shape in the schema, route, layout, and hero.
- **Media consistency:** NOD imports 11 distinct source images and the audit expects 11; Elevator replaces two visual paths but retains its nine-image page count.
- **Navigation consistency:** The six nav labels map one-to-one to six existing homepage regions; standalone route behavior remains available away from `/`.
- **Accuracy:** The plan preserves the report's simplified-static-analysis caveat and labels uncompleted validation as future work.
