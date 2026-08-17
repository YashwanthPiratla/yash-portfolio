import { readdir, readFile, stat } from 'node:fs/promises';
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

const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(file));
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  if (xml.includes('/projects/fpv-drone/')) fail(`${path.basename(file)}: draft FPV route is exposed in the sitemap`);
}

if (failures.length > 0) {
  console.error(`Site audit failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} HTML files and ${sitemapFiles.length} sitemap files checked.`);
