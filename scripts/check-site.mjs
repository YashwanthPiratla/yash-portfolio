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
  'projects/three-stage-cascading-elevator/index.html',
  'research/wearable-health-ml/index.html',
];

for (const relative of publishedCases) {
  const html = await readFile(path.join(dist, relative), 'utf8');
  if (!/class=["'][^"']*\bsubnav\b/.test(html)) fail(`/${relative.replace('index.html', '')}: missing case-study subnavigation`);
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

const homeSource = await readFile(path.join(root, 'src/pages/index.astro'), 'utf8');
if (homeSource.includes("img('elevator/robot-full-extension.png')")) {
  fail('/: homepage still imports the large elevator hero');
}
if (!homeSource.includes('class="hero-portrait"')) {
  fail('/: compact hero portrait is missing');
}
const heroOpen = homeSource.indexOf('<section class="hero">');
const heroClose = homeSource.indexOf('</section>', heroOpen);
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
  if (!html.includes('View Case Study →')) {
    fail(`/${relative === 'index.html' ? '' : 'projects/'}: FPV card is missing View Case Study CTA`);
  }
}

const projectsIndex = await readFile(path.join(dist, 'projects/index.html'), 'utf8');
if (projectsIndex.includes('Things I designed, built, broke, and fixed')) {
  fail('/projects/: contains collective solo-attribution heading');
}

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

if (failures.length > 0) {
  console.error(`Site audit failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} HTML files and ${sitemapFiles.length} sitemap files checked.`);
