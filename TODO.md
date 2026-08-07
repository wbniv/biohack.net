# TODO — biohack.net

**Status markers:** `[ ]` open · `[wip]` in progress · `[verify]` implemented, verification
not yet run+recorded · `[x]` done (`## Done` only). The bracket also carries a delegation
tier, tier last — `[T4]`, `[wip T2]`, `[verify T3]`. See `~/CLAUDE.md` — Delegation.

<!-- todo-lint: disable=open-rank -->
⏸️ **Ranking paused 2026‑08‑07 — new items land unranked and dispatch at the T3 default.**
Only Fable may add a tier (`rank-requires-fable`), and Fable's weekly tokens are spent, so
requiring one would block every new item outright. **Re-rank the unranked items and delete
the `todo-lint: disable=open-rank` line above once the weekly allowance resets.**

## Open

### Thailand plan

- [ ] [departure-ladder] Render the A/B/C departure ladder — timeline, dependencies, contingencies — on the Thailand page, with the three closed AQS days (10‑17, 10‑18, 10‑23) marked and the C→no-successor state visible. See [plan](docs/plans/2026-08-07-departure-ladder-on-the-thailand-page.md).
- [ ] [thailand-calendar-svg] Decide the orphaned `public/thailand/calendar.svg` — it is referenced nowhere in `src/` or `dist/`, and is the stale pre-fix copy. Either wire it into the page or delete it.

### Languages

- [verify T3] [cast-receiver-phase2] CAF receiver + Thai Android Chrome sender implemented for application `27730439`; deploy and verify the full flow on registered Chromecast hardware. See [plan](../spanish/docs/plans/2026-08-01-thai-flashcards-google-cast.md).

### Housekeeping

## Watch

_Nothing being watched._

## Parked

_Nothing parked._

## Done

- [x] 2026-08-01 — [cast-receiver-phase1] Language-neutral Cast receiver simulator + protocol, verified 720p–4K. See [plan](../spanish/docs/plans/2026-08-01-thai-flashcards-google-cast.md).
- [x] 2026-07-27 — [drdevtools-github] Homepage drdevtools link now points at github.com/developer-resources-co/drdevtools (was SourceForge).
- [x] 2026-07-26 — [homepage-demo-count] Homepage SNES count derives from shared `src/data/snes-demos.ts`; build fails on manifest drift. See [plan](docs/plans/2026-07-26-homepage-snes-demo-count.md).
- [x] 2026-06-27 — [snes-url-prefix] Moved SNES demos from `/{slug}/` to `/snes/{slug}/`; old URLs 301-redirect. See [plan](docs/plans/2026-06-27-snes-demos-under-snes-prefix.md).
- [x] 2026-06-13 — [willnorris-redirect] willnorris.me → biohack.net/cv/ 301, live and verified, via the new `cloudflare-redirect` skill. See [plan](docs/plans/2026-06-13-cloudflare-redirect-skill-willnorris-me-biohack-ne.md).

## Inbox — auto-captured plan deferrals

_Auto-added from plan "Out of scope"/"Deferred" sections at commit time. Triage each into M1/M2/etc. and delete it here — it will not come back._

<!-- BEGIN auto-captured-deferrals (managed by audit-plan-deferrals.sh — triage these into the curated sections above; the fingerprint ledger means a deleted item is NOT re-added) -->
<!-- triaged 2026-06-27: all 5 steps verified PASS in same session, evidence recorded in plan fp:9ef5db85609d76c0 -->
<!-- triaged 2026-06-27: snes-demos-under-snes-prefix — build PASS, deployed v1.0.93, redirects live fp:2fb39bf06fc0414d -->
- [verify] **2026-08-06-thailand-master-plan-page** — Verification section present but no PASS recorded — run + record the steps. _from [2026-08-06-thailand-master-plan-page.md](docs/plans/2026-08-06-thailand-master-plan-page.md)_  <!-- fp:00943c6527dc667b -->
- [verify] **2026-08-07-thailand-master-plan-visual-redesign** — Verification section present but no PASS recorded — run + record the steps. _from [2026-08-07-thailand-master-plan-visual-redesign.md](docs/plans/2026-08-07-thailand-master-plan-visual-redesign.md)_  <!-- fp:09e0e6b2b2132d5e -->
- [verify] **2026-08-07-thailand-sticky-calendar-dock** — Verification section present but no PASS recorded — run + record the steps. _from [2026-08-07-thailand-sticky-calendar-dock.md](docs/plans/2026-08-07-thailand-sticky-calendar-dock.md)_  <!-- fp:d1be94dfb9d64640 -->
- [verify] **2026-08-07-thailand-operational-checklist-completion** — Verification section present but no PASS recorded — run + record the steps. _from [2026-08-07-thailand-operational-checklist-completion.md](docs/plans/2026-08-07-thailand-operational-checklist-completion.md)_  <!-- fp:f9ca162d1ee36491 -->
- [verify] **2026-08-07-departure-ladder-on-the-thailand-page** — Verification section present but no PASS recorded — run + record the steps. _from [2026-08-07-departure-ladder-on-the-thailand-page.md](docs/plans/2026-08-07-departure-ladder-on-the-thailand-page.md)_  <!-- fp:306189bf0ea18e8a -->
<!-- END auto-captured-deferrals -->
