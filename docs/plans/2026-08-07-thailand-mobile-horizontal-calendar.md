# Thailand master plan — inline mobile milestone calendar

**Date:** 2026-08-07  
**Status:** Revised, implemented, and verified
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

## Revised decision

Remove the compact summary, open-calendar button, modal sheet, floating calendar
button, and horizontal paging. Render the complete mobile milestone calendar
directly in normal page flow as compact month sections. Scrolling the page is the
only navigation required.

This deliberately favors immediate visibility over preserving a literal x-axis
on a narrow screen. Desktop retains its five-column left-to-right calendar.

## Mockup

```text
┌──────────────────────────────────────┐
│ AUGUST                              │
│                                      │
│ 15  Mission answers              ↘  │
│ 15  Legal consult booked         ↘  │
│ 22  Funds seasoned               ↘  │
│ 31  Rabies #2                    ↘  │
├──────────────────────────────────────┤
│ SEPTEMBER                           │
│ …                                    │
├──────────────────────────────────────┤
│ OCTOBER                             │
│ 1   Chula calendar              ↘  │
│ 6   AQS confirmed               ↘  │
│ …                                    │
└──────────────────────────────────────┘
```

## Interaction

- Mobile time runs top to bottom in chronological phase order; the entire
  calendar is visible inline without opening another surface.
- Within a single-month column, milestone labels show the day only because the
  sticky column heading already supplies the month. Retain descriptive values
  such as `ASAP`, `Arrival`, `Within 48h`, and `Day 45`; use a month abbreviation
  only when a phase spans multiple months and omission would be ambiguous.
- Month sections use the full available width and dense two-column milestone
  rows: a narrow date column and a flexible task label.
- Milestones remain native task-opening buttons with completion, partial,
  current, next, and linked states from the shared event registry.
- Do not introduce nested scrolling, dialogs, or disclosure controls.
- Preserve keyboard-accessible task navigation from each milestone.

## Responsive rules

- At 320–430px widths, show every month as a full-width stacked section.
- Keep rows compact, but allow long labels to wrap rather than clip.
- Desktop continues using the five-column full calendar and sticky dock; the
  dialog implementation is mobile-only.
- Keep safe-area padding and the fixed progress rail offsets.

## Verification

1. At 320, 360, 390, and 430px widths, the inline calendar has no horizontal
   overflow and no milestone label is clipped.
2. Month sections are ordered August → September → October → Viet Nam → January.
3. No calendar-opening button, modal, floating action button, or horizontal
   calendar scroll remains on mobile.
4. The current phase and next actionable milestone remain visually distinct.
5. Every event appears exactly once and retains its task mapping/state.
6. Milestone activation focuses the mapped task directly.
7. Keyboard, touch, 200% zoom, reduced motion, and contrast gates pass.
8. The mobile calendar is present directly in the normal page flow.

## Definition of done

- The full mobile calendar is visible immediately in normal page flow.
- Labels remain readable without shrinking the entire desktop calendar.
- Navigation is ordinary vertical page scrolling and remains synchronized with
  task state.
- Redundant month names do not consume milestone-card space.

## Implementation result

- **PASS — 2026-08-07.**
- The mobile page now presents August through January directly as five compact,
  vertically stacked month sections.
- The summary, modal sheet, floating calendar button, and horizontal snap
  scrolling were removed.
- Single-month sections render day-only dates; the two-month Viet Nam section
  retains month context where needed.
- Desktop retains its full five-column calendar and sticky calendar dock.
- Verification passed: 21 unit/contract tests, production Astro build, all 214
  Thailand contrast surfaces at 6.01:1 or better, the full browser interaction
  suite (including mobile event parity, no horizontal overflow, and task-state
  synchronization), and internal link checks.
