import type { ImageMetadata } from 'astro';
// Eagerly import every image under src/assets/img so content frontmatter can
// reference them by relative path (e.g. "elevator/cad-iso.png").
const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/img/**/*.{png,jpg,jpeg,webp}', { eager: true });
export function img(rel: string): ImageMetadata {
  const key = `/src/assets/img/${rel}`;
  const m = all[key];
  if (!m) throw new Error(`Image not found: ${key}. Available: ${Object.keys(all).join(', ')}`);
  return m.default;
}
export const images = all;
