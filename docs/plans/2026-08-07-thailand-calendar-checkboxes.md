# Thailand master plan — calendar checkboxes

**Date:** 2026-08-07
**Status:** Implemented and verified
**Target:** <https://biohack.net/thailand/>

## Goal

Make the calendar a complete actionable schedule rather than a read-only view.
Every calendar milestone receives a real checkbox synchronized with the detailed
checklist. Task filters continue to affect only the detailed list below; the
calendar always shows every milestone in the selected month window.

## Mockup

```text
┌──────────────┬──────────────┬──────────────┐
│ AUGUST       │ SEPTEMBER    │ OCTOBER      │
│ ☐ 15 Mission│ ☑ 7 Choose   │ ☐ 1 Chula   │
│   answers    │   visa route │   calendar   │
│ ◩ 22 Funds  │ ☐ 18 Confirm │ ☐ 6 AQS     │
│   seasoned   │   bookings   │   confirmed │
└──────────────┴──────────────┴──────────────┘
```

## Behavior

- Use native checkbox inputs, not decorative checkmark characters.
- A milestone linked to one task directly controls that task.
- A milestone linked to multiple tasks is checked only when all are complete,
  indeterminate when some are complete, and unchecked when none are complete.
- Checking an aggregate milestone completes every linked task; unchecking it
  reopens every linked task.
- Calendar changes use the same stable task IDs and local-storage keys as the
  detailed checklist, so both views update immediately and persist together.
- Milestone text remains a separate button that focuses the first mapped task;
  clicking text must not toggle completion.
- Hover/focus linking, current month, next action, partial state, and completed
  styling remain synchronized across desktop, sticky dock, and mobile.
- Filters (`Due soon`, category filters, and `Done`) apply only to task cards.
  They must never hide or remove calendar months or milestones.
- The calendar continues to show all six months and all registered events.

## Accessibility

- Each checkbox receives a label containing its milestone description.
- Indeterminate state is represented through the native checkbox property and
  existing partial-completion styling.
- Checkbox and milestone-text button are separate keyboard stops.
- Focus indicators remain visible at 200% zoom and on narrow mobile columns.
- Disabled month navigation behavior is unchanged.

## Verification

1. Every rendered milestone in all three calendar presentations has a checkbox.
2. Checking a single-task calendar milestone updates its task card, progress,
   every duplicate milestone, and local storage.
3. Checking a multi-task milestone updates all linked tasks; partial completion
   sets every duplicate calendar checkbox to indeterminate.
4. Clicking milestone text focuses its task without changing completion.
5. Applying every task filter leaves calendar event counts unchanged.
6. Mobile still shows three month columns and all four navigation windows with
   no horizontal overflow.
7. Unit, production build, browser behavior, contrast, links, and accessibility
   checks pass.

## Definition of done

- Calendar milestones can be completed directly with native checkboxes.
- Calendar and detailed checklist never disagree about completion.
- The calendar remains complete regardless of checklist filters.

## Implementation result

- **PASS — 2026-08-07.**
- Every desktop, sticky-dock, and mobile milestone now contains a native
  checkbox plus a separate task-navigation button.
- Single-task and aggregate milestones synchronize through the existing stable
  task IDs; aggregate checkboxes expose checked, unchecked, and indeterminate
  states.
- Task filters affect only the detailed checklist and leave all calendar events
  in place.
- Verification passed: 21 unit/contract tests, production Astro build, all 215
  tested Thailand contrast surfaces at 6.01:1 or better, browser checks for
  bidirectional checkbox synchronization, persistence, filter isolation, all
  mobile month windows, zero overflow, and internal links.
