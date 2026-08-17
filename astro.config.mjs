import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yash.piratla.com',
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/projects/fpv-drone') }),
  ],
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
