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
2. `task dev` — `/snes` renders a 2×2 card grid with correct preview images and links.
3. Each card click navigates to the correct demo page and the emulator boots.
4. `/` homepage shows the new 65816 project item with correct link.
5. Mobile (≤520 px): `/snes` grid collapses to 1 column.
