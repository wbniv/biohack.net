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

    ```
    [build] 118 page(s) built — dist/snes: 114 demo pages (113 dynamic + lzss-gallery static) + index
    ```
    PASS (2026-07-27; the count moved from "115 slugs" to "113 dynamic + 1 static page" when the
    post-merge design kept lzss-gallery as a catalog-driven .astro page — see plan note below)

2. Prose-fidelity diff: old dist vs new dist title/meta/h1/lede/keys/doc regions, whitespace-normalized.

    ```
    prose fidelity: 114/114 clean
    ```
    PASS (after fixing a numeric-entity double-escape on fenwick/ulam meta descriptions)

3. Selfcheck-override audit before deleting the 41 inline `BJG_SELFCHECK` blocks.

    ```
    pages with inline BJG_SELFCHECK: 41 — deployed app.js contains no BJG_SELFCHECK reference:
    the overrides were dead code (manifest already authoritative); 40 were stale vs the manifest.
    ```
    PASS — zero behavior change from deletion.

4. Selfcheck + touch nav on the migrated build.

    ```
    mandel-display: ✓ FIDELITY 0x204F == gate (5800 frames)          [headless ?verify=1]
    blossom:        ✓ FIDELITY 0x9047 == gate (3000 frames)          [headless ?verify=1]
    lzss-gallery:   {"right":true,"centerInert":true,"left":true,
                     "verifyLabel":"Verify benchmark","galleryCards":62}   [live Chrome]
    ```
    PASS. (lzss's 200000-frame benchmark selfcheck is impractical headless; its Verify button ships
    user-facing with the 0x5CF0 oracle from commit 304c27b.)

5. Deploy via tag (`v1.0.307`); re-check against production. — recorded in Done/TODO once the run is green.

**Post-merge design note:** master's catalog-driven lzss-gallery (62 works from
`src/data/lzss-gallery-catalog.json`, commit 304c27b) stays a real `.astro` page on `<SnesPlayer/>`;
its collection entry is gallery-only (prose fields now optional in the schema) and the page asserts
the entry's baked artwork count against the catalog at build time.
