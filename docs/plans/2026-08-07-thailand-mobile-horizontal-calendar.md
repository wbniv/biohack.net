# Thailand master plan — mobile horizontal calendar

**Date:** 2026-08-07  
**Status:** Implemented and verified  
**Target:** <https://biohack.net/thailand/>  
**Builds on:** [Mobile calendar layout](2026-08-07-thailand-mobile-calendar-layout.md)

## Problem

The compact mobile summary successfully removes the enormous duplicate event
list from normal page flow. However, the full calendar sheet became a vertical
agenda. It is readable, but it no longer communicates the plan's most important
calendar relationship: time progresses from August through January on the
horizontal axis.

A conventional month-grid calendar would imply daily appointments and waste
space on empty days. This plan is a milestone roadmap. Restore the horizontal
time axis without shrinking desktop content until labels become illegible.

## Decision

Keep the compact inline summary. Replace the sheet's vertical grouped timeline
with a horizontally pannable sequence of month/phase columns. Each column is
roughly one phone viewport wide, scroll-snaps into place, and contains its full
readable milestone stack.

## Mockup

```text
┌──────────────────────────────────────┐
│ Plan calendar                 Close │
│ [Aug] [Sep] [Oct] [Nov–Dec] [Jan]  │
├──────────────────────────────────────┤
│ AUGUST                         →     │
│                                      │
│ 15  Mission answers              ↘  │
│ 15  Legal consult booked         ↘  │
│ 22  Funds seasoned               ↘  │
│ 31  Rabies #2                    ↘  │
│                                      │
│         swipe horizontally →         │
└──────────────────────────────────────┘

               horizontal scroll / snap

┌──────────────────────────────────────┐
│ OCTOBER                       ←  →  │
│ 1   Chula calendar              ↘  │
│ 6   AQS confirmed               ↘  │
│ …                                    │
└──────────────────────────────────────┘
```

## Interaction

- Time runs left to right; columns remain in chronological phase order.
- Within a single-month column, milestone labels show the day only because the
  sticky column heading already supplies the month. Retain descriptive values
  such as `ASAP`, `Arrival`, `Within 48h`, and `Day 45`; use a month abbreviation
  only when a phase spans multiple months and omission would be ambiguous.
- Column width is `min(82vw, 320px)` with a narrow visible glimpse of the next
  column to advertise horizontal movement.
- Use CSS `scroll-snap-type: x mandatory` and `scroll-snap-align: start`.
- Opening the sheet positions the current phase at the leading edge.
- Phase navigation moves horizontally inside the sheet without closing it.
- Milestones remain native task-opening buttons with completion, partial,
  current, next, and linked states from the shared event registry.
- The calendar surface supports horizontal and vertical overflow independently;
  no labels are scaled down to fit all months simultaneously.
- Preserve reduced-motion behavior and keyboard-accessible phase links.

## Responsive rules

- At 320–430px widths, show one primary column plus a glimpse of the next.
- On landscape phones and small tablets, permit wider columns up to 320px and
  show more than one when space allows.
- Desktop continues using the five-column full calendar and sticky dock; the
  dialog implementation is mobile-only.
- Keep safe-area padding and the fixed progress rail offsets.

## Verification

1. At 320, 360, 390, and 430px widths, the sheet has horizontal overflow and
   no milestone label is clipped horizontally.
2. Phase columns are ordered August → September → October → Viet Nam → January.
3. The sheet opens at the current phase and phase navigation changes horizontal
   scroll position.
4. Scroll snapping is enabled and each phase is a snap target.
5. Every event appears exactly once and retains its task mapping/state.
6. Milestone activation closes the sheet and focuses the mapped task.
7. Keyboard, touch, 200% zoom, reduced motion, and contrast gates pass.
8. The normal mobile page still contains only the compact calendar summary.

## Definition of done

- The full mobile calendar visibly reads as time moving left to right.
- Labels remain readable without shrinking the entire desktop calendar.
- Horizontal navigation is obvious, direct, and synchronized with task state.
- Redundant month names do not consume milestone-card space.

## Implementation result

- **PASS — 2026-08-07.**
- The mobile sheet now presents August through January as chronological,
  horizontally pannable phase columns with snap alignment.
- Opening the sheet and using its phase navigation position the selected phase
  at the leading edge while preserving readable milestone cards.
- The compact in-page summary remains unchanged; desktop retains its full
  five-column calendar and sticky calendar dock.
- Verification passed: 22 unit/contract tests, production Astro build, all 214
  Thailand contrast surfaces at 6.01:1 or better, the full browser interaction
  suite (including mobile event parity and task focus), and internal link checks.
