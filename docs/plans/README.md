# Plans — biohack.net

*Index of the plans in this directory — one row per `*.md`, oldest → newest by the commit that first
introduced it, with a one-sentence summary, the commit(s) that touched it, and a category. Summaries are
**auto-generated** (Sonnet) — refine as needed; the shared `check-plan-index.sh` drift hook flags missing
rows on commit.*

**Categories:** `Feature` · `Fix` · `Investigation` · `Tooling` · `Docs` · `Infra` · `Platform`.

| Plan | Summary | Commit(s) | Category |
|---|---|---|---|
| [Copy `wn@biohack.net:~` → `~/SRC/biohack.net/from-dreamhost`](2026-04-23-rsync-dreamhost-mirror.md) | Mirror 35 GB DreamHost home directory locally via rsync with resume support | [`4f20fa9`](https://github.com/wbniv/biohack.net/commit/4f20fa9) | Tooling |
| [Review of `/home/will/SRC/biohack.net/from-dreamhost/err`](2026-04-23-rsync-error-log-review.md) | Triage 2,600 rsync permission errors from DreamHost import; conclude all are ignorable | [`4f20fa9`](https://github.com/wbniv/biohack.net/commit/4f20fa9) | Investigation |
| [Plan — Cloudflare Pages hosting for biohack.net](2026-05-23-cloudflare-pages-hosting.md) | Deploy biohack.net static site to Cloudflare Pages with GitHub Actions tag-driven deploys | [`4f20fa9`](https://github.com/wbniv/biohack.net/commit/4f20fa9) | Infra |
| [Plan: `cloudflare-redirect` skill + willnorris.me → biohack.net/cv/](2026-06-13-cloudflare-redirect-skill-willnorris-me-biohack-ne.md) | Build reusable cloudflare-redirect skill and redirect willnorris.me to biohack.net/cv/ | [`cf44ec0`](https://github.com/wbniv/biohack.net/commit/cf44ec0) | Tooling |
| [SNES Gallery Page + 65816 Compiler Project Entry](2026-06-27-snes-gallery-and-65816-project.md) | Add /snes gallery landing page for all four SNES demos and llvm-mos-65816 to the homepage Highlighted Projects | [`3b33de1`](https://github.com/wbniv/biohack.net/commit/3b33de1) | Feature |
| [#14 — SNES Double Pendulum (Chaos)](2026-06-27-14-snes-double-pendulum.md) | Two double pendulums with near-identical initial angles trace diverging chaos paths in a BitmapCanvas — compiler stress-test #14 (ω² __mulsi3 + D __divsi3 + rep/sep), 5-way gate PASS, published at /double-pendulum/ | [`af84a51`](https://github.com/wbniv/biohack.net/commit/af84a51) | Feature |
| [Move SNES demos under /snes/{demo}](2026-06-27-snes-demos-under-snes-prefix.md) | Relocate all SNES demo pages from `/{slug}/` to `/snes/{slug}/` with redirects for old URLs | [`2be28fb`](https://github.com/wbniv/biohack.net/commit/2be28fb) | Feature |
| [Homepage SNES demo count — derive at build time](2026-07-26-homepage-snes-demo-count.md) | Extract the gallery's demos array to a shared module so the homepage count (stale "eight" → 114) derives at build time, with a build-failing manifest cross-check | [`deca076`](https://github.com/wbniv/biohack.net/commit/deca076) | Fix |
| [snes-package-migration — biohack.net consumes @wbniv/bsnes-jg-player](2026-07-27-snes-package-migration.md) | Vendor the SNES player engine from the @wbniv/bsnes-jg-player npm package and collapse the 114 hand-written demo pages into one [slug].astro route over a content collection, with CI drift + page-count gates | [`3aeb92d`](https://github.com/wbniv/biohack.net/commit/3aeb92d) | Platform |
| [Publish the Thailand master plan at `/thailand/`](2026-08-06-thailand-master-plan-page.md) | Publish the return-to-Thailand plan as a responsive Astro page with browser-persistent checklists, focused maps, and explicit privacy review | [`ead6e89`](https://github.com/wbniv/biohack.net/commit/ead6e89) | Feature |
| [Thailand master plan — dark biohack.net visual redesign](2026-08-07-thailand-master-plan-visual-redesign.md) | Replace the imported document preview with a native dark Astro page matching biohack.net while preserving the plan and persistent checklist | [`ec76e71`](https://github.com/wbniv/biohack.net/commit/ec76e71) | Feature |
| [Thailand checklist — sticky calendar dock](2026-08-07-thailand-sticky-calendar-dock.md) | Keep synchronized calendar context visible while working through checklist tasks with a desktop dock and mobile calendar sheet | [`19970c8`](https://github.com/wbniv/biohack.net/commit/19970c8) | Feature |
| [Thailand master plan — operational checklist completion](2026-08-07-thailand-operational-checklist-completion.md) | Add the missing border, pet, transport, insurance, supplies, money, connectivity, shutdown, and Bangkok-arrival tasks with stable IDs and calendar gates | Planning | Feature |
| [Thailand master plan — mobile calendar layout](2026-08-07-thailand-mobile-calendar-layout.md) | Replace the duplicated inline mobile milestone list with a compact live summary and a grouped near-full-height calendar sheet | Planning | Feature |
| [Thailand master plan — mobile horizontal calendar](2026-08-07-thailand-mobile-horizontal-calendar.md) | Restore time to the x-axis in the mobile calendar sheet using readable, horizontally pannable, snap-aligned phase columns | Planning | Feature |
| [Thailand master plan — three-month mobile calendar carousel](2026-08-07-thailand-mobile-calendar-pager.md) | Show three mobile month columns at once with explicit previous/next window navigation | Planning | Feature |

---

## How this index was derived

- **Order** = each plan's *creation* commit (oldest commit that touched the file), by committer date.
- **Commit(s)** = the full `git log --follow` set per plan, oldest → newest.
- **Summaries / categories** auto-generated from each plan's TL;DR (Sonnet, medium effort) — refine as needed.
- **Generated** 2026-06-27 for 7 plan(s); last updated 2026-08-07 for 12 plan(s).
