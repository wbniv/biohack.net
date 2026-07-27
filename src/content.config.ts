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
    pageTitle: z.string(),      // <title> / og:title
    pageDesc: z.string(),       // meta description
    heading: z.string(),        // h1 inner HTML
    lede: z.string(),           // hero paragraph inner HTML
    keysHtml: z.array(z.string()), // key-help line(s) under the player, inner HTML
    doc: z.string(),            // the whole notes section inner HTML
  }),
});

export const collections = { snes };
