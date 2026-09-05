import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const failures = [];

const fail = (message) => failures.push(message);

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  }));
  return files.flat();
}

function routeFor(file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -10)}`;
  return `/${relative}`;
}

async function targetExists(href) {
  const clean = decodeURIComponent(href.split(/[?#]/, 1)[0]);
  if (!clean || clean === '/') return exists(path.join(dist, 'index.html'));

  const relative = clean.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    path.join(dist, relative),
    path.join(dist, relative, 'index.html'),
    path.join(dist, `${relative}.html`),
  ];
  const results = await Promise.all(candidates.map(exists));
  return results.some(Boolean);
}

if (!(await exists(dist))) {
  console.error('Site audit requires a built dist/ directory. Run npm run build first.');
  process.exit(1);
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeFor(file);
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const href of hrefs) {
    if (/^(?:[a-z]+:|#|\/\/)/i.test(href)) continue;
    const target = href.startsWith('/') ? href : new URL(href, `https://audit.invalid${route}`).pathname;
    if (!(await targetExists(target))) fail(`${route}: internal link target is missing: ${href}`);
  }
}

const publishedCases = [
  'projects/deployable-climbing-mechanism/index.html',
  'projects/mk4-swerve-drivebase/index.html',
  'projects/nod-mullet-alarm-clock/index.html',
  'projects/three-stage-cascading-elevator/index.html',
  'research/wearable-health-ml/index.html',
];

for (const relative of publishedCases) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  if (!/class=["'][^"']*\bsubnav\b/.test(html)) fail(`/${relative.replace('index.html', '')}: missing case-study subnavigation`);
}

const expectedEngineeringMediaCounts = new Map([
  ['projects/three-stage-cascading-elevator/index.html', 9],
  ['projects/deployable-climbing-mechanism/index.html', 7],
  ['projects/mk4-swerve-drivebase/index.html', 4],
  ['projects/nod-mullet-alarm-clock/index.html', 11],
]);

for (const [relative, expectedCount] of expectedEngineeringMediaCounts) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const actualCount = [...main.matchAll(/<img\b/g)].length;
  if (actualCount !== expectedCount) {
    fail(`/${relative.replace('index.html', '')}: expected ${expectedCount} supplied project images, found ${actualCount}`);
  }
}

for (const relative of [
  'projects/deployable-climbing-mechanism/index.html',
  'projects/mk4-swerve-drivebase/index.html',
]) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  if (!/class=["'][^"']*\bshot\b[^"']*\bcontain\b/.test(html)) fail(`/${relative.replace('index.html', '')}: CAD hero is not using contain sizing`);
}

const home = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!/<dialog\b[^>]*\bid=["']lightbox["']/.test(home)) fail('/: lightbox is not implemented as a native dialog');

const homepageSections = ['home', 'projects', 'research', 'resume', 'about', 'contact'];
for (const section of homepageSections) {
  if (!new RegExp(`<[^>]+id=["']${section}["'][^>]+data-nav-section`).test(home)) {
    fail(`/: missing navigation section #${section}`);
  }
  if (!home.includes(`href="#${section}" data-nav-link="${section}"`)) {
    fail(`/: primary navigation does not link to #${section}`);
  }
}

const projectDetail = await readFile(path.join(dist, 'projects/deployable-climbing-mechanism/index.html'), 'utf8');
for (const [label, href] of [
  ['Home', '/'],
  ['Engineering Projects', '/projects'],
  ['Research', '/research'],
  ['Resume', '/resume'],
  ['About', '/about'],
  ['Contact', '/contact'],
]) {
  if (!projectDetail.includes(`href="${href}" data-nav-link`)) {
    fail(`/projects/deployable-climbing-mechanism/: ${label} navigation route changed unexpectedly`);
  }
}

const navSource = await readFile(path.join(root, 'src/components/Nav.astro'), 'utf8');
if (!navSource.includes('IntersectionObserver')) fail('Nav.astro: section-aware active-state observer is missing');
if (!navSource.includes("aria-current', 'location'")) fail('Nav.astro: section links do not expose their active location');
if (!navSource.includes("window.addEventListener('scroll', queueActiveSectionUpdate")) {
  fail('Nav.astro: active state is not synchronized through smooth scrolling');
}
if (!/\.menu-btn\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/.test(navSource)) {
  fail('Nav.astro: mobile menu control is smaller than 44px');
}

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

const homeSource = await readFile(path.join(root, 'src/pages/index.astro'), 'utf8');
if (homeSource.includes("img('elevator/robot-full-extension.png')")) {
  fail('/: homepage still imports the large elevator hero');
}
if (!homeSource.includes('class="hero-portrait"')) {
  fail('/: compact hero portrait is missing');
}
const heroOpen = homeSource.indexOf('<section class="hero"');
const heroClose = homeSource.indexOf('</section>', heroOpen);
const heroSource = homeSource.slice(heroOpen, heroClose);
const approvedLinkedInUrl = 'https://www.linkedin.com/in/yashwanth-piratla-5115b826a/';
const obsoleteLinkedInUrl = 'https://www.linkedin.com/in/yashwanth-piratla-5115b826/';
if (heroSource.includes(obsoleteLinkedInUrl)) {
  fail('/: compact hero contains the obsolete LinkedIn profile URL');
}
if (!heroSource.includes(approvedLinkedInUrl)) {
  fail('/: compact hero is missing the approved LinkedIn profile URL');
}
const nextSectionOpen = homeSource.indexOf('<section', heroClose);
const nextSectionClose = homeSource.indexOf('</section>', nextSectionOpen);
const nextSection = homeSource.slice(nextSectionOpen, nextSectionClose);
if (heroOpen === -1 || heroClose === -1 || nextSectionOpen === -1 || nextSectionClose === -1 || !nextSection.includes('Mechanical design, built and tested')) {
  fail('/: Engineering Projects is not immediately after the hero');
}
if (/(?:^|\n)\s*\.cta\s*\{/.test(homeSource)) {
  fail('/: homepage CTA styles are not scoped to the hero');
}
if (!/\.hero\s+\.cta\s*\{/.test(homeSource)) {
  fail('/: compact hero CTA styles are missing');
}
if (!/\.about\s+\.cta\s*\{[^}]*margin:\s*1\.5rem 0 1rem;/.test(homeSource)) {
  fail('/: About CTA does not preserve its prior spacing');
}

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

const expectedProjectOrder = [
  'Deployable Multi-Level Climbing Mechanism',
  'Three-Stage Cascading Elevator',
  'NOD — World’s First Mullet Alarm Clock',
  'MK4 Swerve Drivebase &amp; Robot Architecture',
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
const nodPath = path.join(dist, nodRelative);
if (!(await exists(nodPath))) {
  fail('/projects/nod-mullet-alarm-clock/: route is missing');
} else {
  const nodHtml = await readFile(nodPath, 'utf8');
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
}

const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(file));
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  if (xml.includes('/projects/fpv-drone/')) fail(`${path.basename(file)}: draft FPV route is exposed in the sitemap`);
}

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
  const route = `/${relative === 'index.html' ? '' : 'projects/'}`;
  const articles = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((match) => match[0]);
  const fpvCards = articles.filter((article) => /<h3[^>]*>[\s\S]*?5(?:&quot;|") FPV Drone/.test(article));
  if (fpvCards.length === 0) {
    fail(`${route}: FPV card is missing`);
  } else if (fpvCards.length > 1) {
    fail(`${route}: expected exactly one FPV card, found ${fpvCards.length}`);
  } else {
    const [fpvCard] = fpvCards;
    if (!fpvCard.includes('View Case Study →')) {
      fail(`${route}: FPV card is missing View Case Study CTA`);
    }
    if (!fpvCard.includes('Final link pending')) {
      fail(`${route}: FPV card is missing its URL-only placeholder`);
    }
    if (fpvCard.includes('Photos coming soon')) {
      fail(`${route}: FPV card still requests photos`);
    }
  }
}

const readmeSource = await readFile(path.join(root, 'README.md'), 'utf8');
const correctiveEmailPath = 'docs/communications/yash-pt2-follow-up-email.md';
if (!readmeSource.includes(`](${correctiveEmailPath})`)) {
  fail('README.md: primary email documentation does not point to the corrective unsent draft');
}
if (/Unsent handoff email draft:\s*\[`EMAIL_TO_YASH\.md`\]/.test(readmeSource)) {
  fail('README.md: superseded EMAIL_TO_YASH.md is still labeled as the unsent handoff email');
}

const historicalEmailSource = await readFile(path.join(root, 'EMAIL_TO_YASH.md'), 'utf8');
if (!historicalEmailSource.startsWith('# Historical — sent and superseded')) {
  fail('EMAIL_TO_YASH.md: missing sent-and-superseded historical status');
}
if (!historicalEmailSource.includes('Do not send or reuse this message.')) {
  fail('EMAIL_TO_YASH.md: missing do-not-send warning');
}
if (!historicalEmailSource.includes(`](${correctiveEmailPath})`)) {
  fail('EMAIL_TO_YASH.md: missing link to the corrective unsent draft');
}

const projectsIndex = await readFile(path.join(dist, 'projects/index.html'), 'utf8');
if (projectsIndex.includes('Things I designed, built, broke, and fixed')) {
  fail('/projects/: contains collective solo-attribution heading');
}

const engineeringSources = [
  'three-stage-cascading-elevator.mdx',
  'deployable-climbing-mechanism.mdx',
  'mk4-swerve-drivebase.mdx',
  'nod-mullet-alarm-clock.mdx',
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
const drivebaseVideo = drivebaseSource.match(/<video\b([^>]*)>([\s\S]*?)<\/video>/);
if (!drivebaseVideo) {
  fail('/projects/mk4-swerve-drivebase/: supplied video is not embedded as a native video');
} else {
  const [, videoAttributes, videoContents] = drivebaseVideo;
  if (!/(?:^|\s)controls(?=\s|=|$)/.test(videoAttributes)) {
    fail('/projects/mk4-swerve-drivebase/: supplied video must enable controls');
  }
  if (!/(?:^|\s)preload\s*=\s*["']metadata["'](?=\s|$)/.test(videoAttributes)) {
    fail('/projects/mk4-swerve-drivebase/: supplied video must preload metadata');
  }
  if (/(?:^|\s)autoplay(?=\s|=|$)/.test(videoAttributes)) {
    fail('/projects/mk4-swerve-drivebase/: supplied video must not autoplay');
  }
  const drivebaseVideoSource = videoContents.match(/<source\b([^>]*)>/);
  if (!drivebaseVideoSource || !/(?:^|\s)src\s*=\s*["']\/media\/drivebase-moving\.mp4["'](?=\s|$)/.test(drivebaseVideoSource[1])) {
    fail('/projects/mk4-swerve-drivebase/: supplied video source must be nested in the native video');
  }
}
const drivebaseVideoPath = path.join(root, 'public/media/drivebase-moving.mp4');
const expectedDrivebaseVideoHash = 'af9b170cbfad71f8f1b95a8719a00b1334d267e1ad61a28797b8bd7007ca2e71';
if (!(await exists(drivebaseVideoPath))) {
  fail('/projects/mk4-swerve-drivebase/: supplied video file is missing');
} else {
  const actualDrivebaseVideoHash = createHash('sha256').update(await readFile(drivebaseVideoPath)).digest('hex');
  if (actualDrivebaseVideoHash !== expectedDrivebaseVideoHash) {
    fail('/projects/mk4-swerve-drivebase/: supplied video checksum does not match');
  }
}

const immutableFiles = new Map([
  ['src/content/research/wearable-health-ml.mdx', '9bbf34e834d25a10b1033cd11de85e0d74215623e389336b8da7ebb9a89537ef'],
  ['public/Yash_Piratla_Resume.pdf', '67051606f0fbd1740fce95bd7e3992acb4d43db2aa42637f87d9078d769fb9ff'],
]);

for (const [relative, expectedDigest] of immutableFiles) {
  const contents = await readFile(path.join(root, relative));
  const digest = createHash('sha256').update(contents).digest('hex');
  if (digest !== expectedDigest) fail(`${relative}: protected content changed`);
}

if (failures.length > 0) {
  console.error(`Site audit failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} HTML files and ${sitemapFiles.length} sitemap files checked.`);
