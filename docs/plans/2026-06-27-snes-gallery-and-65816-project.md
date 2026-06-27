# SNES Gallery Page + 65816 Compiler Project Entry

**Date:** 2026-06-27  
**Scope:** biohack.net

## Goals

1. Add `llvm-mos-65816` to the homepage Highlighted Projects list.
2. Create `/snes` — a gallery landing page linking to all four in-browser SNES demos.

## Implementation

### 1. `src/pages/index.astro` — homepage

- Add new `<li>` in `#projects ul` for the 65816 compiler, linking to `https://indri.studio/apps/llvm-mos-65816/`.
- Mention the SNES demos gallery (`/snes`) inline in the same entry.
- Add `nth-child(9)` animation delay entries to the CSS (animation + orbit bullet).

### 2. `src/pages/snes.astro` — new page

- Header: Dune Rise "SNES Demos" title + intro paragraph referencing the 65816 toolchain.
- 2-up card grid (1-up on mobile ≤520 px) with:
  - Preview screenshot from `public/play/preview/<slug>.png`
  - Title, description, key-hint line
  - Full-card `<a>` link to the demo page
  - Hover: accent border glow + ▶ overlay
- Footer note about bsnes-jg WASM + fidelity verify.
- Back link to `/`.

### Demos covered

| Slug | Title |
|---|---|
| `blossom` | Blossom |
| `space-invaders` | Space Invaders |
| `spirograph` | Spirograph |
| `3d-wireframe` | Wireframe 3-D Solid |

## Verification

1. `task build` exits 0.

   ```
   09:39:11 ✓ Completed in 59ms.
   09:39:11 [build] 8 page(s) built in 1.26s
   09:39:11 [build] Complete!
   ```
   PASS

2. `/snes` renders a 2×2 card grid with correct preview images and links.

   Verified via headless screenshot at 1000 px — 2-column card grid, all four preview
   images populated (Blossom / Space Invaders / Spirograph / Wireframe 3-D Solid),
   titles and descriptions present, `← biohack.net` back-link visible.
   PASS

3. Each card click navigates to the correct demo page and the emulator boots.

   Links verified in built HTML: `/blossom/`, `/space-invaders/`, `/spirograph/`,
   `/3d-wireframe/` — all resolved to existing pages in the build. Emulator boot
   confirmed in prior per-page test cycles; card links use the same `/<slug>/` pattern.
   PASS

4. `/` homepage shows the new 65816 project item with correct link.

   Verified via headless screenshot — 9th bullet reads "llvm-mos-65816 — open-source
   optimizing C compiler for the WDC 65816 & Super Nintendo, via LLVM; four playable
   SNES demos" with both links rendered in accent orange.
   PASS

5. Mobile (≤520 px): `/snes` grid collapses to 1 column.

   Verified via headless screenshot at 480 px width — single-column layout, cards
   full-width, Blossom card visible at top.
   PASS
