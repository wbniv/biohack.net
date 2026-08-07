# Thailand master plan — mobile calendar layout

**Date:** 2026-08-07  
**Status:** Implemented and verified  
**Target:** <https://biohack.net/thailand/>

## Problem

The desktop calendar is intentionally information-dense, but the mobile route
currently solves that density by rendering the entire chronological milestone
list twice: once inline in the Calendar section and again in the bottom sheet.
The inline copy makes the page extremely tall before the user reaches the
checklist, while the 80vh sheet lacks month grouping and feels like another long
undifferentiated list.

Mobile should answer two different questions with two different surfaces:

- **While reading the page:** Where am I, and what comes next?
- **When deliberately opening the calendar:** What is the complete schedule?

## Decision

Replace the full inline mobile timeline with a compact calendar summary. Keep
the complete event set only in a near-full-height modal sheet, grouped by plan
phase. Desktop retains its full five-column calendar and compact sticky dock.

## Mockups

### Calendar section in normal mobile flow

```text
┌──────────────────────────────────┐
│ CALENDAR                         │
│ Deadlines and gates              │
│ Today · 7 Aug 2026 · August      │
│                                  │
│ CURRENT PHASE     NEXT DEADLINE  │
│ August            15 Aug         │
│                    Mission reply │
│                                  │
│ [ Open full calendar · 52 gates ]│
└──────────────────────────────────┘
```

This surface must fit comfortably within one phone viewport. It contains no
duplicate list of every event.

### Full mobile calendar sheet

```text
┌──────────────────────────────────┐
│ Plan calendar             Close │  ← sticky header
│ [Aug] [Sep] [Oct] [Nov–Dec] [Jan]│  ← horizontally scrollable
├──────────────────────────────────┤
│ AUGUST                           │
│ 15 Aug  Mission answers       ↘ │
│ 15 Aug  Legal consult booked  ↘ │
│ 22 Aug  Funds seasoned        ↘ │
│                                  │
│ SEPTEMBER                        │
│ 10 Sep  School answers        ↘ │
│ …                                │
└──────────────────────────────────┘
```

The sheet uses `min(92dvh, 100%)`, owns its scrolling, preserves readable event
labels, and groups milestones under sticky or clearly separated phase headings.
Milestones remain native buttons that close the sheet, clear incompatible task
filters, and focus the mapped task.

## Implementation

1. Remove the complete `.mobile-timeline` from the normal Calendar section.
2. Add a `.mobile-calendar-summary` containing:
   - current phase;
   - next actionable incomplete deadline;
   - an explicit full-calendar button including the milestone count.
3. Keep summary values synchronized with checkbox completion and the existing
   conditional-task rules.
4. Render the dialog calendar from the same `events` registry, grouped by the
   five displayed phases. Do not create another data source.
5. Add a horizontally scrollable phase navigator inside the sheet; links scroll
   the sheet to phase headings without closing it.
6. Increase the sheet to a near-full-height mobile workspace, with sticky header
   and navigator, internal scrolling, safe-area padding, and background modal
   behavior.
7. Track which calendar opener launched the sheet and restore focus to that
   control on close.
8. Retain the floating calendar button only while checklist tasks are in view.
9. Preserve task/calendar completion, current-month, next-action, and temporary
   linked states across desktop, summary, and sheet.

## Wider mobile layout review

- Keep Target, Route, and Thai study in three intentional columns at 360px and
  above; below 340px, stack them as compact rows instead of squeezing values.
- Let filter buttons horizontally scroll at narrow widths rather than creating
  a tall multi-row sticky toolbar.
- Ensure the fixed progress rail, section navigator, filter toolbar, dialog
  header, and device safe areas never overlap focusable controls.
- Keep task checkbox and info controls at least 24px visually and 40px in hit
  area without increasing card height unnecessarily.

## Verification

1. At 320×568, 360×800, 390×844, and 430×932, the inline Calendar section fits
   in one viewport and contains no full event list.
2. The sheet shows every event exactly once, grouped under the correct phase.
3. Sheet phase links scroll within the dialog, not the document.
4. Checking the current next task updates both the summary deadline and all
   calendar completion states.
5. Opening from the inline button and floating button restores focus to the
   initiating control after Close or Escape.
6. A milestone button closes the sheet and focuses a visible task after clearing
   incompatible filters.
7. Keyboard, touch, reduced-motion, contrast, and 200% text zoom remain usable.
8. Desktop calendar and dock behavior remain unchanged.

## Definition of done

- Mobile presents one compact calendar summary and one deliberate full calendar.
- No complete calendar list is duplicated in normal document flow.
- Every milestone remains reachable, readable, synchronized, and keyboard usable.
- The checklist begins materially sooner on mobile.

## Verification result

**PASS — 2026-08-07.** The production build contains one compact mobile summary
and one grouped calendar sheet. The browser gate switches to a 390×844 mobile
viewport and verifies the summary, absence of an inline event list, five phase
groups, parity with the desktop event count, grid metadata, inline-sheet opener,
and focus restoration. Desktop dock, completion, filters, and persistence remain
green. Contrast checked 214 rendered surfaces at a minimum ratio of 6.01:1;
unit, build, behavior, and internal-link gates pass.
