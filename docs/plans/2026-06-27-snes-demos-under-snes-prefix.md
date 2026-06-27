# Move SNES demos under /snes/{demo}

## Context

All seven SNES demo pages currently live at `/{slug}/` (e.g. `/blossom/`, `/double-pendulum/`). The gallery index is at `/snes/`. Moving demos under `/snes/{slug}/` groups them logically, keeps the gallery at the same URL, and frees the flat namespace.

---

## What changes

### 1. Convert `snes.astro` → `snes/index.astro`

`src/pages/snes.astro` → `src/pages/snes/index.astro`

- URL stays `/snes/` — no external link breaks.
- Update `import Base` path: `../layouts/Base.astro` → `../../layouts/Base.astro`
- Update every card `href` in the demos array: `/${slug}/` → `/snes/${slug}/`

### 2. Move all 7 demo pages into `src/pages/snes/`

Files to move (keep filenames identical):

```
src/pages/1d-ca.astro           → src/pages/snes/1d-ca.astro
src/pages/3d-wireframe.astro    → src/pages/snes/3d-wireframe.astro
src/pages/blossom.astro         → src/pages/snes/blossom.astro
src/pages/double-pendulum.astro → src/pages/snes/double-pendulum.astro
src/pages/space-invaders.astro  → src/pages/snes/space-invaders.astro
src/pages/spigot.astro          → src/pages/snes/spigot.astro
src/pages/spirograph.astro      → src/pages/snes/spirograph.astro
```

Per-file changes:
- `import Base from '../layouts/Base.astro'` → `'../../layouts/Base.astro'`
- `const PLAY = 'public/play'` — **no change** (resolved from CWD at build time, not from source file location)
- All `/play/…` URLs are site-root-relative — no change needed

### 3. Add redirects for old URLs in `astro.config.mjs`

Astro's built-in `redirects` config handles permanent redirects with no extra packages:

```js
export default defineConfig({
  output: 'static',
  redirects: {
    '/1d-ca':            '/snes/1d-ca',
    '/1d-ca/':           '/snes/1d-ca/',
    '/3d-wireframe':     '/snes/3d-wireframe',
    '/3d-wireframe/':    '/snes/3d-wireframe/',
    '/blossom':          '/snes/blossom',
    '/blossom/':         '/snes/blossom/',
    '/double-pendulum':  '/snes/double-pendulum',
    '/double-pendulum/': '/snes/double-pendulum/',
    '/space-invaders':   '/snes/space-invaders',
    '/space-invaders/':  '/snes/space-invaders/',
    '/spigot':           '/snes/spigot',
    '/spigot/':          '/snes/spigot/',
    '/spirograph':       '/snes/spirograph',
    '/spirograph/':      '/snes/spirograph/',
  },
  vite: { plugins: [tailwindcss()] },
});
```

### 4. No change needed in `index.astro`

The single reference at line 379 (`href="/snes/"`) already points to the gallery — still correct.

---

## Files modified

| File | Change |
|---|---|
| `src/pages/snes.astro` | Delete (content moved to `snes/index.astro`) |
| `src/pages/snes/index.astro` | New (moved from snes.astro; update import + card hrefs) |
| `src/pages/snes/{slug}.astro` ×7 | New (moved from pages/; update import path) |
| `src/pages/{slug}.astro` ×7 | Delete (replaced by above) |
| `astro.config.mjs` | Add `redirects` block |

---

## Verification

1. `task build` — must complete with no errors
2. `task preview` then visit:
   - [http://localhost:4321/snes/](http://localhost:4321/snes/) — gallery loads, all 7 cards visible
   - [http://localhost:4321/snes/double-pendulum/](http://localhost:4321/snes/double-pendulum/) — emulator page loads and boots ROM
   - [http://localhost:4321/double-pendulum/](http://localhost:4321/double-pendulum/) — redirects to `/snes/double-pendulum/`
3. `task check-links` — no broken internal links
