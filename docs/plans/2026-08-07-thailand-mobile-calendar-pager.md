# Thailand master plan — three-column mobile calendar pager

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

On mobile, show one selected month at a time. Arrange that month’s milestones in
a three-column grid and provide explicit previous/next controls in the month
header. Navigation changes the selected month in place; it does not horizontally
scroll the page or open another surface.

Desktop retains the existing five-column calendar and sticky calendar dock.

## Mockups

### Standard phone

```text
┌──────────────────────────────────────┐
│ ‹          AUGUST 2026            › │
├────────────┬────────────┬────────────┤
│ 15 Mission │ 15 Legal   │ 22 Funds  │
│ answers    │ consult    │ seasoned  │
├────────────┼────────────┼────────────┤
│ 31 Rabies  │ ASAP Work- │ 31 Cooking│
│ #2         │ cation     │ packet    │
├────────────┼────────────┼────────────┤
│ …          │ …          │ …          │
└────────────┴────────────┴────────────┘
```

Each cell begins with `{day} {description}` on the same line. The description
may wrap inside its cell; the date never receives a dedicated line.

### First and last month

```text
┌──────────────────────────────────────┐
│            AUGUST 2026            › │  previous disabled
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ‹          JANUARY 2027              │  next disabled
└──────────────────────────────────────┘
```

## Interaction

- Default to the current plan month; before the plan, default to August, and
  after the plan, default to January.
- Previous and next buttons move exactly one phase in chronological order:
  August → September → October → Viet Nam → January.
- Use real `<button>` elements with accessible names such as “Previous month”
  and “Next month.” Disable the unavailable direction at either boundary.
- Update the visible month heading and grid without changing page scroll.
- Keep only the selected month exposed to assistive technology; inactive months
  must be hidden, not merely visually moved offscreen.
- Milestones remain buttons that focus their mapped checklist task.
- Completion, partial completion, next-action, current-month, and linked-task
  states continue to derive from the shared stable IDs.
- Do not add swipe-only navigation, a dialog, a floating calendar button, or
  nested horizontal scrolling.

## Layout

- Use `grid-template-columns: repeat(3, minmax(0, 1fr))` at mobile widths.
- Keep a consistent small gap and equal-width cells.
- Allow descriptions to wrap normally; never clip or ellipsize task meaning.
- Retain day-only labels in single-month phases. The combined Viet Nam phase
  keeps `Nov` or `Dec` where required to disambiguate the date.
- At extremely narrow widths, preserve three columns as requested while
  reducing gaps and padding—not font size below the established readable floor.
- The selected month heading and arrow controls must remain usable at 200% zoom.

## State and URL behavior

- The pager selection is temporary presentation state and does not need local
  persistence.
- A calendar section link should reveal the calendar with the default/current
  month selected.
- Task completion remains persisted under existing stable checklist IDs and
  immediately updates milestone styling in every calendar presentation.

## Verification

1. At 320, 360, 390, and 430px, exactly three milestone columns are rendered.
2. No horizontal page or calendar overflow occurs.
3. Previous/next controls visit all five phases in chronological order.
4. Boundary controls are disabled correctly and expose accessible names.
5. Exactly one phase panel is visible and exposed to accessibility APIs.
6. Each phase contains every event mapped to it, exactly once.
7. Calendar dates begin inline with descriptions and omit redundant month names.
8. Checking a task updates the corresponding milestone in the selected month.
9. Activating a milestone focuses its mapped task without opening or closing a
   separate surface.
10. Unit, production build, browser interaction, contrast, zoom, reduced-motion,
    and internal-link checks pass.

## Definition of done

- The mobile calendar is visible without an opener.
- It occupies only one month panel’s height at a time.
- Three milestone cells appear across the phone viewport.
- Explicit arrow controls replace horizontal scrolling.
- Calendar/task synchronization and accessibility remain intact.

