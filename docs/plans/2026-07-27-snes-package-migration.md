# snes-package-migration — biohack.net consumes @wbniv/bsnes-jg-player

**Canonical plan (Phase B of):** [~/bsnes-jg-wasm/docs/plans/2026-07-27-npm-player-package.md](../../../bsnes-jg-wasm/docs/plans/2026-07-27-npm-player-package.md) — this stub exists so this repo's changes trace to it.

What lands here:

1. **B1** — engine vendored from the package (`pnpm add github:wbniv/bsnes-jg-wasm#npm-package` until the npm publish, then the npm version), `sync-engine` script, `public/play/ENGINE_VERSION` stamp, `touchNav` for lzss-gallery in `roms/manifest.json` (the chevron hit-test is manifest-driven now).
2. **B2–B4** — the 114 hand-written `src/pages/snes/<slug>.astro` pages collapse into one `src/pages/snes/[slug].astro` over the `snes` content collection (`src/content/snes/<slug>.json`; prose extracted verbatim from the built HTML by the one-off `scripts/extract-snes-pages.mjs`). Per-page `BJG_SELFCHECK` overrides die — `roms/manifest.json` is authoritative (pre-delete comparison in the verification log below). Union stylesheet `src/styles/snes-page.css`.
3. **B5** — `src/data/snes-demos.ts` retired: gallery + homepage query the collection; categories move to `src/data/snes-categories.ts`; the count guard (collection length == manifest ROMs) lives in the route's `getStaticPaths`.
4. **B7** — `deploy.yml` gains `bsnes-jg-player sync --check public/play` (anti-drift) + a page-count assertion.

Mockups: see the canonical plan's bundle ([rendered page + drift-error states](../../../bsnes-jg-wasm/docs/plans/2026-07-27-npm-player-package/)).

## Verification (B8)

1. `pnpm build` green; `ls dist/snes/*/index.html | wc -l` == 115.
2. Prose-fidelity diff: old dist vs new dist `.rp-hero`/`.rp-doc` regions, whitespace-normalized — clean.
3. Selfcheck-override audit: every legacy inline `BJG_SELFCHECK` == its manifest entry before deletion.
4. Headless selfcheck sample PASS (mandel-display, blossom, lzss-gallery, 3d-wireframe + one per category); lzss chevron tap works (manifest touchNav).
5. Deploy via tag; re-run the headless sample against production.
