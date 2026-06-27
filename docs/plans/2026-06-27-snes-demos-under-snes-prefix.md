# Move SNES demos under /snes/{demo}

## Context

All eight SNES demo pages previously lived at `/{slug}/` (e.g. `/blossom/`, `/double-pendulum/`). The gallery index is at `/snes/`. Moving demos under `/snes/{slug}/` groups them logically, keeps the gallery at the same URL, and frees the flat namespace.

---

## What changes

### 1. Convert `snes.astro` → `snes/index.astro`

`src/pages/snes.astro` → `src/pages/snes/index.astro`

- URL stays `/snes/` — no external link breaks.
- Update `import Base` path: `../layouts/Base.astro` → `../../layouts/Base.astro`
- Update every card `href` in the demos array: `/${slug}/` → `/snes/${slug}/`

### 2. Move all 8 demo pages into `src/pages/snes/`

Files to move (keep filenames identical):

```
src/pages/1d-ca.astro           → src/pages/snes/1d-ca.astro
src/pages/3d-wireframe.astro    → src/pages/snes/3d-wireframe.astro
src/pages/blossom.astro         → src/pages/snes/blossom.astro
src/pages/double-pendulum.astro → src/pages/snes/double-pendulum.astro
src/pages/n-body.astro          → src/pages/snes/n-body.astro
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
    '/1d-ca/':           '/snes/1d-ca/',
    '/3d-wireframe/':    '/snes/3d-wireframe/',
    '/blossom/':         '/snes/blossom/',
    '/double-pendulum/': '/snes/double-pendulum/',
    '/nbody/':           '/snes/n-body/',
    '/space-invaders/':  '/snes/space-invaders/',
    '/spigot/':          '/snes/spigot/',
    '/spirograph/':      '/snes/spirograph/',
  },
  vite: { plugins: [tailwindcss()] },
});
```

Trailing-slash-only: Astro static output generates one `index.html` per redirect; dual slash+non-slash pairs collide on the same output file. Cloudflare Pages normalises non-trailing-slash requests automatically.

### 4. No change needed in `index.astro`

The single reference at line 379 (`href="/snes/"`) already points to the gallery — still correct.

---

## Files modified

| File | Change |
|---|---|
| `src/pages/snes.astro` | Delete (content moved to `snes/index.astro`) |
| `src/pages/snes/index.astro` | New (moved from snes.astro; update import + card hrefs) |
| `src/pages/snes/{slug}.astro` ×8 | New (moved from pages/; update import path) |
| `src/pages/{slug}.astro` ×8 | Delete (replaced by above) |
| `astro.config.mjs` | Add `redirects` block (8 entries, trailing-slash only) |
| `src/pages/index.astro` | Update demo count: "five" → "eight" |

---

## Verification

1. `task build` — must complete with no errors

```
generating static routes
▶ src/pages/snes/1d-ca.astro       → /snes/1d-ca/index.html
▶ src/pages/snes/3d-wireframe.astro → /snes/3d-wireframe/index.html
▶ src/pages/snes/blossom.astro     → /snes/blossom/index.html
▶ src/pages/snes/double-pendulum.astro → /snes/double-pendulum/index.html
▶ src/pages/snes/n-body.astro      → /snes/n-body/index.html
▶ src/pages/snes/space-invaders.astro → /snes/space-invaders/index.html
▶ src/pages/snes/spigot.astro      → /snes/spigot/index.html
▶ src/pages/snes/spirograph.astro  → /snes/spirograph/index.html
▶ src/pages/snes/index.astro       → /snes/index.html
▶ /1d-ca/ … /spirograph/ … /nbody/ (8 redirect pages)
[build] 12 page(s) built in 1.37s
[build] Complete!
```

PASS — clean build, no warnings.

2. `task preview` then visit:
   - [http://localhost:4321/snes/](http://localhost:4321/snes/) — gallery loads, all 8 cards visible
   - [http://localhost:4321/snes/double-pendulum/](http://localhost:4321/snes/double-pendulum/) — emulator page loads and boots ROM
   - [http://localhost:4321/double-pendulum/](http://localhost:4321/double-pendulum/) — redirects to `/snes/double-pendulum/`

**Deployed** — v1.0.93 → [biohack.net/snes/](https://biohack.net/snes/) (commit `2be28fb`).

3. `task check-links` — no broken internal links
