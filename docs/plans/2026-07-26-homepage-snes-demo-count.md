# Homepage SNES demo count — derive at build time

## Context

The homepage of biohack.net says "**eight** playable SNES demos" (`src/pages/index.astro:379`) while the gallery it links to (`/snes/`) actually holds **114** demos. The word was hand-edited once ("five" → "eight", per `docs/plans/2026-06-27-snes-demos-under-snes-prefix.md`) and has drifted ever since — 106 demos behind. The user explicitly does **not** want another hand edit: the number must update itself whenever a demo is published. The site is Astro 5 static, rebuilt on every tag-driven deploy, so a build-time-derived value is automatically fresh on every publish.

## Approach

Single source of truth: the gallery's `demos` array — the hand-curated list that actually renders `/snes/` — moves to a shared data module. Both pages import it; the homepage renders `demos.length`. The homepage count then *provably* equals the count on the page it links to, forever.

(The alternative — reading `public/play/roms/manifest.json` — needs no refactor, but counts ROM binaries rather than gallery entries, so the homepage could disagree with `/snes/`. Rejected; the manifest is instead used as a cross-check, below.)

## Changes

### 1. New: `src/data/snes-demos.ts`

- Move `categories` (currently `src/pages/snes/index.astro:15–26`) and the full `demos` array (lines 28–836) here verbatim; `export` both, plus a `Demo` interface (`slug`, `title`, `desc`, `keys`, `category`, optional `displayMode`).
- **Build-time cross-check (regression guard):** at module top level, `readFileSync('public/play/roms/manifest.json')` (same cwd-relative pattern as `previewV` in the gallery frontmatter, `src/pages/snes/index.astro:10–13`) and `throw` if `roms.length !== demos.length`. `scaffold.sh` updates the manifest automatically at publish; the gallery entry is manual — so publishing a ROM and forgetting its gallery entry now fails the build instead of silently shipping a wrong count.

### 2. `src/pages/snes/index.astro`

- Replace the inline `categories`/`demos` definitions with `import { categories, demos } from '../../data/snes-demos';`.
- `previewV` and `byCategory` (lines 838–841) stay in the page — presentation concerns.
- No rendered-output change: the four existing `demos.length` usages (lines 844, 851, 858, 864) keep working.

### 3. `src/pages/index.astro`

- Frontmatter: add `import { demos } from '../data/snes-demos';`.
- Line 379: `<a href="/snes/">eight playable SNES demos</a>` → `<a href="/snes/">{demos.length} playable SNES demos</a>`.

### 4. Skill doc: `~/.claude/skills/snes-rom-page/SKILL.md`

The skill drives every publish but predates the gallery — it never mentions adding a gallery entry, which is exactly how the drift recurs. In the **Per-site → biohack.net** section, add one step: append the demo's entry to the `demos` array in `src/data/snes-demos.ts` (the homepage and gallery counts derive from it; the build fails if the manifest and array counts diverge). Also note pages live at `src/pages/snes/<slug>.astro` on this site.

### 5. Repo housekeeping

- Copy this plan to `docs/plans/2026-07-26-homepage-snes-demo-count.md`; add a `TODO.md` entry (tier `T2` — bounded, single-module extraction with a settled spec), moved to `## Done` on completion.

## Visible surface

One word in an existing sentence: "eight playable SNES demos" → "114 playable SNES demos". No layout, style, or structural change — no mockup bundle warranted.

## Verification

1. Build succeeds:
   ```sh
   cd ~/biohack.net && task build
   ```

   Run 2026-07-26 as `node_modules/.bin/astro build` (pnpm is absent from this machine's PATH; CI installs its own — `task build` is a thin wrapper over the same command):

   ```
   21:09:26 [build] 118 page(s) built in 3.46s
   21:09:26 [build] Complete!
   ```
   **PASS**

2. Homepage shows the derived count:
   ```sh
   grep -o '[0-9]\+ playable SNES demos' dist/index.html   # expect: 114 playable SNES demos
   ```

   ```
   114 playable SNES demos
   ```
   **PASS**

3. Gallery unchanged and consistent:
   ```sh
   grep -c '114' dist/snes/index.html   # lede + counter still render 114
   ```

   ```
         1 114 demos
         1 114 Super Nintendo programs
         1 data-total="114"
   ```
   **PASS** — all three rendered count sites (lede, mode-filter counter, `data-total`) agree.

4. Regression guard fires: temporarily delete one entry from the `demos` array, run `task build`, confirm it **fails** with the count-mismatch error; restore.

   ```
   SNES demo count mismatch: manifest.json has 114 ROMs but src/data/snes-demos.ts lists 113 demos — add the missing gallery entry.
   ```
   **PASS** — build aborted on the mismatch; after restoring the entry, rebuild completed clean.

5. Link check as CI would run it:
   ```sh
   node scripts/check-links.js --skip-external --dir dist
   ```

   ```
   ### All links OK
   exit=0
   ```
   **PASS**

6. Commit; deploy via `task bump` (auto-bump patch tag → GitHub Actions → Cloudflare Pages). After deploy, confirm the live homepage at [https://biohack.net/](https://biohack.net/) says 114.
