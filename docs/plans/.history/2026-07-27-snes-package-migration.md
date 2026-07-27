| Date | Change |
|------|--------|
| [2026-07-27](https://github.com/wbniv/biohack.net/commit/3aeb92d) | snes: consume @wbniv/bsnes-jg-player; 114 pages -> content collection + [slug] route |

<!--history-meta v1
3aeb92d	author	Will Norris
3aeb92d	added	20
3aeb92d	deleted	0
3aeb92d	files	1
3aeb92d	body	Phase B of bsnes-jg-wasm/docs/plans/2026-07-27-npm-player-package.md\n(see docs/plans/2026-07-27-snes-package-migration.md).\n\n- Engine vendored from the package (pnpm sync-engine; ENGINE_VERSION stamp;\n  deploy.yml gains 'bsnes-jg-player sync --check' + a page-count gate).\n  Dep is github:wbniv/bsnes-jg-wasm#npm-package until the first npm publish.\n- The 114 hand-written src/pages/snes/*.astro collapse into\n  src/pages/snes/[slug].astro over the 'snes' content collection\n  (src/content/snes/<slug>.json — prose extracted verbatim from the built\n  HTML by the one-off scripts/extract-snes-pages.mjs). Union stylesheet\n  src/styles/snes-page.css (majority-wins across the old per-page blocks).\n- snes-demos.ts retired: gallery + homepage query the collection;\n  categories -> src/data/snes-categories.ts; count guard lives in\n  getStaticPaths.\n- The 41 inline BJG_SELFCHECK overrides die: audited pre-delete — the\n  deployed app.js NEVER read them (manifest has been authoritative all\n  along), so zero behavior change despite 40 being stale.\n- lzss-gallery chevrons now via manifest touchNav (the merged app.js is\n  slug-agnostic).\n\nVerified: build green, 115 routes; rendered title/meta/h1/lede/keys/doc\nregions identical (after entity normalization) on 114/114 pages vs the\npre-migration build; lzss chevron hit-test + fullscreen + verify wiring\nlive-tested in Chrome.\n\nNOTE: master's in-flight lzss-gallery curation edits touch files this\nbranch deletes/regenerates (lzss-gallery.astro, roms/manifest.json) —\nexpect a deliberate merge, not a clean fast-forward.\n\nNOTE: the snes-rom-page skill's scaffold flow targets the old layout and\nis broken until Phase C updates it.\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_011DEG8ouwAWtqeWtcvZSysz
-->
