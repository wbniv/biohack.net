# Thailand master plan — three-month mobile calendar carousel

**Date:** 2026-08-07
**Status:** Approved for implementation
**Target:** <https://biohack.net/thailand/>
**Builds on:** [Inline mobile milestone calendar](2026-08-07-thailand-mobile-horizontal-calendar.md)

## Problem

The inline mobile calendar removed the modal and hidden horizontal content, but
showing all five month sections creates a long calendar before the checklist.
The page needs a compact calendar that remains immediately visible without
requiring a separate “open calendar” action.

## Decision

On mobile, show a three-month-wide window into the five-month timeline. Each of
the three columns is a complete month/phase column containing its milestone
list. Explicit previous/next controls scroll the calendar window horizontally;
the page itself does not scroll sideways and no separate surface opens.

Desktop retains the existing five-column calendar and sticky calendar dock.

## Mockups

### Standard phone

```text
┌──────────────────────────────────────┐
│ ‹       AUG — SEP — OCT          › │
├────────────┬────────────┬────────────┤
│ AUGUST     │ SEPTEMBER  │ OCTOBER    │
│            │            │            │
│ 15 Mission │ 7 Choose   │ 1 Chula    │
│ answers    │ visa route │ calendar   │
│            │            │            │
│ 22 Funds   │ 18 Confirm │ 6 AQS      │
│ seasoned   │ bookings   │ confirmed  │
│ …          │ …          │ …          │
└────────────┴────────────┴────────────┘
```

Each milestone inside a month begins with `{day} {description}` on the same
line. The description may wrap inside its month column; the date never receives
a dedicated line.

### Window navigation

```text
┌──────────────────────────────────────┐
│ ‹       AUG — SEP — OCT          › │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ‹       SEP — OCT — VIET NAM       › │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ‹       OCT — VIET NAM — JAN         │
└──────────────────────────────────────┘
```

## Interaction

- Default to the three-month window containing the current plan phase. Before
  the plan, show August–October; after the plan, show October–January.
- Previous and next buttons move the window exactly one phase at a time:
  August/September/October → September/October/Viet Nam →
  October/Viet Nam/January.
- Use real `<button>` elements with accessible names such as “Previous month”
  and “Next month.” Disable the unavailable direction at either boundary.
- Update the visible month heading and grid without changing page scroll.
- Keep only the three visible months exposed to assistive technology; the other
  two must be hidden, not merely visually moved offscreen.
- Milestones remain buttons that focus their mapped checklist task.
- Completion, partial completion, next-action, current-month, and linked-task
  states continue to derive from the shared stable IDs.
- Do not add swipe-only navigation, a dialog, a floating calendar button, or
  nested horizontal scrolling.

## Layout

- Use `grid-template-columns: repeat(3, minmax(0, 1fr))` for three equal-width
  month columns at mobile widths.
- Within each month, milestones remain a single vertical list.
- Allow descriptions to wrap normally; never clip or ellipsize task meaning.
- Retain day-only labels in single-month phases. The combined Viet Nam phase
  keeps `Nov` or `Dec` where required to disambiguate the date.
- At extremely narrow widths, preserve three columns as requested while
  reducing gaps and padding—not font size below the established readable floor.
- The selected month heading and arrow controls must remain usable at 200% zoom.

## State and URL behavior

- The pager selection is temporary presentation state and does not need local
  persistence.
- A calendar section link should reveal the default/current three-month window.
- Task completion remains persisted under existing stable checklist IDs and
  immediately updates milestone styling in every calendar presentation.

## Verification

1. At 320, 360, 390, and 430px, exactly three month columns are visible.
2. No horizontal page or calendar overflow occurs.
3. Previous/next controls visit all three valid windows in chronological order.
4. Boundary controls are disabled correctly and expose accessible names.
5. Exactly three phase panels are visible and exposed to accessibility APIs.
6. Each phase contains every event mapped to it, exactly once.
7. Calendar dates begin inline with descriptions and omit redundant month names.
8. Checking a task updates the corresponding milestone in the selected month.
9. Activating a milestone focuses its mapped task without opening or closing a
   separate surface.
10. Unit, production build, browser interaction, contrast, zoom, reduced-motion,
    and internal-link checks pass.

## Definition of done

- The mobile calendar is visible without an opener.
- It occupies the height of the tallest month in the visible window.
- Three month columns appear across the phone viewport.
- Explicit arrow controls replace horizontal scrolling.
- Calendar/task synchronization and accessibility remain intact.
