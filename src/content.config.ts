import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared schema so mechanical, robotics, software, electrical and research
// projects all render through the same templates. Add a new project by
// dropping a Markdown file into src/content/projects or src/content/research.
const base = {
  title: z.string(),
  subtitle: z.string(),               // e.g. "Mechanical Design · CAD · Manufacturing · FRC"
  summary: z.string(),                // one-paragraph card description
  disciplines: z.array(z.string()),
  order: z.number().default(99),
  status: z.enum(['published', 'coming-soon']).default('published'),
  hero: z.string().optional(),        // path under src/assets/img/, e.g. "elevator/cad-iso.png"
  thumbnail: z.string().optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  season: z.string().optional(),      // e.g. "2025 FRC Reefscape"
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({ ...base, kind: z.enum(['mechanical', 'robotics', 'electrical', 'software']).default('mechanical') }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({ ...base, kind: z.literal('research').default('research'), collaborators: z.array(z.object({ name: z.string(), url: z.string(), role: z.string() })).default([]) }),
});

export const collections = { projects, research };
