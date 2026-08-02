// Content collections. `snes` is the demo registry + per-page prose, one JSON
// entry per ROM (src/content/snes/<slug>.json) — the single source of truth for
// the /snes/ gallery, the homepage count, and each /snes/<slug>/ page (rendered
// by src/pages/snes/[slug].astro). The prose fields (lede/keysHtml/doc) are
// rendered HTML strings (set:html) — they were extracted verbatim from the old
// hand-written pages, whose bodies were HTML-authored anyway.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categoryIds } from './data/snes-categories';

const snes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/snes' }),
  schema: z.object({
    order: z.number(),          // gallery position (the old snes-demos.ts array order)
    slug: z.string(),
    title: z.string(),          // gallery card title
    desc: z.string(),           // gallery card description
    keys: z.string(),           // gallery card key summary
    category: z.enum(categoryIds),
    displayMode: z.number().optional(),
    // Prose fields — present for every entry rendered by [slug].astro. An entry
    // MAY omit them when the demo keeps its own hand-written page (lzss-gallery:
    // its gallery/counts derive from src/data/lzss-gallery-catalog.json at build
    // time); such entries only feed the /snes/ gallery card + the count guard.
    pageTitle: z.string().optional(),   // <title> / og:title
    pageDesc: z.string().optional(),    // meta description
    heading: z.string().optional(),     // h1 inner HTML
    lede: z.string().optional(),        // hero paragraph inner HTML
    keysHtml: z.array(z.string()).optional(), // key-help line(s) under the player, inner HTML
    doc: z.string().optional(),         // the whole notes section inner HTML
    technical: z.object({
      artifactSha256: z.string().regex(/^[0-9a-f]{64}$/),
      artifactLabel: z.string(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })),
      codecs: z.array(z.object({
        name: z.string(), size: z.string(), ratio: z.string(), rate: z.string(), selected: z.boolean().optional(),
      })),
      phases: z.array(z.object({ name: z.string(), p50: z.number(), p99: z.number(), maximum: z.number() })),
      intervalDots: z.number().positive(),
    }).optional(),
  }),
});

export const collections = { snes };
