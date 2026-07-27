#!/usr/bin/env node
// ONE-OFF migration extractor (delete after the snes-package-migration lands).
//
// Source of truth = the BUILT site (dist/snes/<slug>/index.html), not the .astro
// sources: the prose there is fully rendered (no JSX interpolations left), so
// extraction is exact by construction. Emits one JSON content entry per demo:
//   src/content/snes/<slug>.json
//     { order, slug, title, desc, keys, category, displayMode?,
//       pageTitle, pageDesc, heading, lede, keysHtml[], doc }
// plus a union stylesheet src/styles/snes-page.css (majority body per selector).
//
// Run from the repo root AFTER a fresh `astro build` of the OLD pages:
//   node scripts/extract-snes-pages.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const OUT = 'src/content/snes';
mkdirSync(OUT, { recursive: true });

// --- demos registry (order + gallery metadata) -------------------------------
const ts = readFileSync('src/data/snes-demos.ts', 'utf8');
const arrText = ts.split('export const demos: Demo[] = ')[1].split('\n];')[0] + '\n]';
const demos = (0, eval)(arrText); // trusted site source
console.log(`demos registry: ${demos.length} entries`);

// --- helpers ------------------------------------------------------------------
const stripCid = (h) => h
  .replace(/\s+data-astro-cid-[a-z0-9]+(="[^"]*")?/g, '')
  .replace(/\s+class=""/g, '');

function inner(html, re, what, slug) {
  const m = html.match(re);
  if (!m) { problems.push(`${slug}: no ${what}`); return null; }
  return stripCid(m[1]).trim();
}

const decode = (s) => s
  .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const problems = [];

// --- per-page extraction --------------------------------------------------------
demos.forEach((d, i) => {
  const path = `dist/snes/${d.slug}/index.html`;
  let html;
  try { html = readFileSync(path, 'utf8'); } catch { problems.push(`${d.slug}: ${path} missing`); return; }

  const pageTitle = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim());
  const pageDesc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]);

  const heading = inner(html, /<h1 class="rp-title"[^>]*>([\s\S]*?)<\/h1>/, 'h1.rp-title', d.slug);
  const lede = inner(html, /<p class="rp-lede"[^>]*>([\s\S]*?)<\/p>/, 'p.rp-lede', d.slug);

  // every <p class="rp-keys"> inside the embed section (1 for all, 2 for lzss-gallery)
  const keysHtml = [...html.matchAll(/<p class="rp-keys"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => stripCid(m[1]).trim());
  if (!keysHtml.length) problems.push(`${d.slug}: no rp-keys`);

  // the doc section: from its opening tag to the </section> that precedes </main>
  const docM = html.match(/<section class="rp-doc"[^>]*>([\s\S]*?)<\/section>\s*<\/main>/);
  const doc = docM ? stripCid(docM[1]).trim() : null;
  if (!doc) problems.push(`${d.slug}: no rp-doc`);

  const entry = {
    order: i,
    slug: d.slug,
    title: d.title,
    desc: d.desc,
    keys: d.keys,
    category: d.category,
    ...(d.displayMode !== undefined && { displayMode: d.displayMode }),
    pageTitle,
    pageDesc,
    heading,
    lede,
    keysHtml,
    doc,
  };
  writeFileSync(`${OUT}/${d.slug}.json`, JSON.stringify(entry, null, 2) + '\n');
});

// --- union stylesheet -----------------------------------------------------------
// Majority body wins per selector (the minority copies are pre-rebrand template
// stragglers); :global(...) unwraps (the file is plain global CSS); @media blocks
// (lzss-gallery only) are appended verbatim.
const pageDir = 'src/pages/snes';
const ruleVotes = new Map();
const mediaBlocks = new Set();
for (const f of readdirSync(pageDir)) {
  if (!f.endsWith('.astro') || f === 'index.astro' || f === '[slug].astro') continue;
  const src = readFileSync(`${pageDir}/${f}`, 'utf8');
  const styleM = src.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleM) continue;
  let css = styleM[1].replace(/\/\*[\s\S]*?\*\//g, '');
  // pull out @media blocks whole
  css = css.replace(/@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, (b) => { mediaBlocks.add(b.trim()); return ''; });
  for (const rm of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = rm[1].trim().replace(/\s+/g, ' ').replace(/:global\(([^)]*)\)/g, '$1');
    const body = rm[2].trim().replace(/\s+/g, ' ');
    if (!ruleVotes.has(sel)) ruleVotes.set(sel, new Map());
    const v = ruleVotes.get(sel);
    v.set(body, (v.get(body) || 0) + 1);
  }
}
let out = `/* snes-page.css — union of the 114 per-page style blocks (majority body per\n * selector; the few minority variants were pre-rebrand template stragglers).\n * Generated once by scripts/extract-snes-pages.mjs; hand-edit freely from here.\n * Player-block styles (.rp-player/.rp-screen/...) intentionally override the\n * package defaults from @wbniv/bsnes-jg-player/css with the site branding. */\n\n`;
for (const [sel, v] of ruleVotes) {
  const [body] = [...v.entries()].sort((a, b) => b[1] - a[1])[0];
  out += `${sel} { ${body} }\n`;
}
out += '\n' + [...mediaBlocks].join('\n\n') + '\n';
writeFileSync('src/styles/snes-page.css', out);
console.log(`snes-page.css: ${ruleVotes.size} selectors, ${mediaBlocks.size} @media blocks`);

console.log(`\n${demos.length - problems.length}/${demos.length} extracted clean`);
if (problems.length) { console.log('MANUAL LIST:'); problems.forEach((p) => console.log('  ' + p)); process.exit(2); }
