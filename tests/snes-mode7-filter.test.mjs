// tests/snes-mode7-filter.test.mjs — the Mode 7 gallery filter's data contract.
//
// Specified by llvm-mos-65816 docs/plans/2026-07-26-123-mode7-gallery-filter.md ("Files expected to
// change" names this exact path). Added 2026-08-04: the plan's 2026-08-03 verification found this
// file had never been written on either site, which is why commits cdaa6f4 (svx2-fastrom-video) and
// ad87374 (apollo-daylight) drifted the badge/filter set from 9 to 11 in silence.
//
// Run: node --test tests/            (no dependencies — node:test + node:assert only)
//
// The Mode 7 count is DERIVED from the demo registry everywhere in here. The only committed list is
// EXPECTED_MODE7_SLUGS in src/data/mode7-contract.mjs, whose whole job is to make a count change a
// reviewed change rather than a silent one.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  EXPECTED_MODE7_SLUGS,
  MODE7_PARITY_DIGEST,
  mode7Digest,
  mode7SlugsOf,
  assertMode7Contract,
} from '../src/data/mode7-contract.mjs';

const CONTENT_DIR = 'src/content/snes';
const GALLERY = 'src/pages/snes/index.astro';

/** The demo registry, read the way the `snes` content collection reads it: one JSON per ROM. */
function loadRegistry() {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(CONTENT_DIR, f), 'utf8')))
    .sort((a, b) => b.order - a.order);
}

/** Every card src/pages/snes/index.astro emits, "Newest Releases" duplicates included. */
function renderedRecords(demos) {
  const cats = [...new Set(demos.map((d) => d.category))];
  return [...demos.slice(0, 8), ...cats.flatMap((c) => demos.filter((d) => d.category === c))];
}

const gallerySrc = () => readFileSync(GALLERY, 'utf8');

// --- the contract itself -----------------------------------------------------------------------

test('the live registry satisfies the Mode 7 data contract', () => {
  const demos = loadRegistry();
  const result = assertMode7Contract({
    site: 'biohack.net',
    demos,
    renderedRecords: renderedRecords(demos),
  });
  assert.equal(result.count, result.slugs.length);
  assert.deepEqual(result.slugs, [...EXPECTED_MODE7_SLUGS]);
});

test('the badge/filter count is derived from the registry, not stored', () => {
  const demos = loadRegistry();
  const derived = mode7SlugsOf(demos);
  // Two independent derivations of the same number: the contract helper, and a raw scan of the
  // registry files. Neither one reads a stored total.
  const raw = demos.filter((d) => d.displayMode === 7).map((d) => d.slug).sort();
  assert.deepEqual(derived, raw);
  assert.equal(derived.length, EXPECTED_MODE7_SLUGS.length);
});

test('the committed ledger is sorted, unique and non-empty', () => {
  const l = [...EXPECTED_MODE7_SLUGS];
  assert.ok(l.length > 0, 'ledger must not be empty');
  assert.deepEqual(l, [...new Set(l)].sort(), 'ledger must be sorted and free of duplicates');
});

test('MODE7_PARITY_DIGEST matches the ledger (the cross-site parity token)', () => {
  // Both sites ship a byte-identical src/data/mode7-contract.mjs. This token is what makes
  // "the two sites use the same expected set" checkable from inside a single-repo CI checkout:
  // if the two ledgers ever differ, the two digests differ.
  assert.equal(mode7Digest(EXPECTED_MODE7_SLUGS), MODE7_PARITY_DIGEST);
});

// --- regression guard: the exact drift that went unnoticed on 2026-08-03 -------------------------

test('adding a Mode 7 demo without updating the ledger fails the build', () => {
  const demos = loadRegistry();
  const drifted = [...demos, { slug: 'not-in-the-ledger', displayMode: 7, category: 'fractals', order: 9999 }];
  assert.throws(
    () => assertMode7Contract({ site: 'biohack.net', demos: drifted, renderedRecords: drifted }),
    /not-in-the-ledger/,
    'this is the cdaa6f4 / ad87374 case — it must fail loudly, not drift'
  );
});

test('removing a Mode 7 demo without updating the ledger fails the build', () => {
  const demos = loadRegistry().filter((d) => d.slug !== EXPECTED_MODE7_SLUGS[0]);
  assert.throws(
    () => assertMode7Contract({ site: 'biohack.net', demos, renderedRecords: demos }),
    new RegExp(EXPECTED_MODE7_SLUGS[0])
  );
});

test('a Mode 7 demo that renders no card fails the build', () => {
  const demos = loadRegistry();
  const dropped = EXPECTED_MODE7_SLUGS[0];
  assert.throws(
    () =>
      assertMode7Contract({
        site: 'biohack.net',
        demos,
        renderedRecords: renderedRecords(demos).filter((d) => d.slug !== dropped),
      }),
    /render no card/
  );
});

// --- the gallery template and its shipped filter script -----------------------------------------

test('the gallery calls the build-time assertion', () => {
  const src = gallerySrc();
  assert.match(src, /assertMode7Contract\(/, 'index.astro must run the contract at build time');
  assert.match(src, /from ['"]\.\.\/\.\.\/data\/mode7-contract\.mjs['"]/);
});

test('the hook and the badge are emitted from the same displayMode field', () => {
  const src = gallerySrc();
  // Both the machine-readable filter hook and the human-visible badge come off `displayMode`, so a
  // card can never carry one without the other.
  assert.match(src, /data-display-mode=\{displayMode\}/);
  assert.match(src, /displayMode === 7 &&[\s\S]{0,120}gl-mode7-badge/);
});

test('the runtime filter reads the data attribute, not a slug list', () => {
  const src = gallerySrc();
  assert.match(src, /dataset\.displayMode === '7'/);
  // The plan: "Do not introduce another hard-coded slug list in browser JavaScript." No Mode 7 slug
  // may appear literally anywhere in the gallery page.
  for (const slug of EXPECTED_MODE7_SLUGS) {
    assert.ok(!src.includes(`'${slug}'`) && !src.includes(`"${slug}"`), `${slug} is hardcoded in ${GALLERY}`);
  }
});

test('the rendered Mode 7 count comes from the contract result', () => {
  assert.match(gallerySrc(), /data-mode7-count=\{mode7\.count\}/);
});
