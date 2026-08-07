# Departure ladder on the Thailand page

Put the A/B/C departure ladder — its timeline, dependencies and contingencies — onto [biohack.net/thailand](https://biohack.net/thailand/), so the contingency structure is visible on the page that is actually consulted rather than only in `~/docs/cat-relocation-5hr-radius-bangkok.md`.

## Why

The page today shows a **flat list of milestones**. Every card is equally weighted and unconditional, which cannot express the three things that actually govern departure week:

1. **Timeline** — the AQS is open Mon–Fri only, and **2026‑10‑23 is Chulalongkorn Day**, so the station is shut on the tax-line date itself. Three of departure week's seven days are unusable.
2. **Dependencies** — everything downstream hangs on one walk-in (**R9, Mon 10‑19**), and whether the AQS will issue **two permits from one examination** decides whether a failed test is free.
3. **Contingencies** — A falls back to B falls back to C, and **C has no successor** because Cambodia's border closed in June 2025.

A checklist cannot say "if this is refused, do that instead by Thursday." That is the gap.

## Source of truth

`~/docs/cat-relocation-5hr-radius-bangkok.md` → **🪜 The departure ladder** and **Verify before booking**. This page must not restate the reasoning — it renders the ladder and links out. Duplicating that analysis is how it goes stale.

## Scope

| In | Out |
|---|---|
| A/B/C ladder as a visual block in the calendar section | Re-deriving any of the reasoning on the page |
| The three closed AQS days marked on the calendar | Changing the existing milestone/task model |
| Contingency edges (A→B→C, C→dead end) | A general-purpose dependency engine |
| New tasks for the airline call, the two-permit question, the bridge question | Anything about the Vietnam or Korea legs beyond arrival |

## Data changes — `src/data/thailand-plan.mjs`

New tasks, all October phase:

| id | date | what |
|---|---|---|
| `vz-cabin-call` | 2026‑10‑06 | Call Thai Vietjet **+66 1900‑1886**: cabin pets on BKK–DAD, up to what weight, slots left (cap 3) |
| `aqs-two-permits` | 2026‑10‑06 | Ask Suvarnabhumi AQS whether **one examination can yield two export permits** (Vietnam + Korea) |
| `nong-khai-bridge` | 2026‑10‑06 | Confirm with **Nong Khai AQS** that Friendship Bridge I accepts pet imports — this is what makes Plan C exist |
| `ke-pet-slot` | 2026‑10‑19 | Korean Air pet request — **≥ 48 h** ahead, so the fallback exists before it is needed |
| `plan-a-attempt` | 2026‑10‑20 | Attempt the direct hop, with Wed and Thu still open for a corrected R9 |

Events gain a `contingency` field (`null` \| `'fallback'` \| `'dead-end'`) and an optional `fallbackOf` id, so the renderer can draw the ladder without hard-coding it.

## Visible surface

Mockups belong in `2026-08-07-departure-ladder-on-the-thailand-page/`:

- `ladder-desktop.html` — the ladder block under the calendar, A/B/C as three rungs with the closed days struck through
- `ladder-mobile.html` — the same at 390 px, where the three rungs stack
- `calendar-closed-days.html` — the calendar with 10‑17, 10‑18 and 10‑23 marked unusable
- `ladder-dead-end.html` — the C→no-successor state, which is the one people misread

Each with a same-basename `.png`, 1440×900 canvas, inline CSS only.

## Verification

1. `task build` completes with no new warnings.
2. The ladder block renders at 1440, 1024 and 390 px with no overlap — screenshot each.
3. The three closed AQS days are visually distinct from open days, and distinct from "complete".
4. Hovering a ladder rung highlights its milestone in the calendar, consistent with the legend-hover behaviour added in `b40030e`.
5. `node --test tests/thailand-plan.test.mjs` passes, extended to assert every `fallbackOf` points at a real event id and that no event is its own fallback.
6. Contrast check via `scripts/check-thailand-contrast.mjs` for the new states.
7. Live check after `task bump`: the ladder is present at [biohack.net/thailand](https://biohack.net/thailand/).

## Risks

- **Duplication drift** — the page and the cat doc disagreeing after a later edit. Mitigate by rendering only dates and outcomes here, never the reasoning, and linking out for the why.
- **Chulalongkorn Day is hardcoded.** It is 23 October annually, but the plan should not grow a Thai holiday calendar for one date; note the assumption inline.
- The two-permit answer may arrive **after** this ships and flip a cost annotation. Keep that string in one place.
