# Thailand checklist — sticky calendar dock

## 2026-08-07 compactness correction

The expanded task/event set made a content-sized dock consume too much of the
checklist viewport. Cap the desktop dock at `280px` (and `32vh` on shorter
screens), retain an explicit internal vertical scrollbar, and adjust task jump
offsets to the compact dock. The full calendar remains available at its original
section; the dock is a synchronized working reference, not a second full-page
calendar.

**Date:** 2026-08-07  
**Status:** Implemented and reverified
**Target:** <https://biohack.net/thailand/>

## Outcome

Keep calendar context visible while working through checklist items without
letting the full 1200×620 calendar consume most of the viewport.

## Mockups

Compact working state—the dock keeps context, while at least half of a short
desktop viewport remains available to the checklist:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ View full calendar        All milestones · scroll if needed      Collapse │
├────────────┬────────────┬────────────┬────────────┬────────────────────────┤
│ AUG        │ SEP        │ OCT        │ NOV–DEC    │ JAN                    │
│ ○ answers  │ ○ schools  │ ○ route    │ ○ submit   │ ○ TM30                 │
│ ○ funds    │ ○ flights  │ ○ papers   │ ○ pending  │ ○ classes              │
│ ↕ scroll   │ ↕ scroll   │ ↕ scroll   │ ↕ scroll   │ ↕ scroll               │
└────────────┴────────────┴────────────┴────────────┴────────────────────────┘
┌──────────────────────────── checklist remains primary ─────────────────────┐
│ □ Before 31 Aug — Book the cat's vaccination…                         ⓘ   │
│ □ By 31 Aug — Begin the DTV packet…                                    ⓘ   │
│ □ By 10 Sep — Contact schools…                                         ⓘ   │
└────────────────────────────────────────────────────────────────────────────┘
```

Collapsed working state:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ View full calendar                                             Expand      │
└────────────────────────────────────────────────────────────────────────────┘
│ □ Checklist task                                                        ⓘ │
│ □ Checklist task                                                        ⓘ │
```

The complete, unconstrained calendar remains in the normal document flow:

```text
Outcome → Decision → [ FULL CALENDAR: every milestone, natural height ]
                         ↓ scroll into checklist
             [ compact synchronized dock appears ]
```

## Desktop behavior

- Keep the full calendar in its existing document position.
- After the full calendar scrolls above the viewport and a checklist section is
  active, reveal a sticky calendar dock beneath the top edge.
- Use the same calendar SVG and the same stable task/event mappings.
- Cap the expanded dock at `280px` and `32vh`; keep it collapsible.
- Keep all milestones in the dock and make overflow intentionally reachable
  through its clearly labeled internal vertical scroll area. Never clip or
  silently omit events.
- Highlight, partial, and completed states must update in both calendar views.
- Provide **View full calendar** and collapse controls.
- Hide the dock outside the dated checklist and definition-of-done region.
- Avoid layout jumps when the dock appears.

## Mobile behavior

- Do not permanently occupy scarce vertical space with the dock.
- Show a sticky **Calendar · current month** button while checklist items are in
  view.
- Open the calendar in a dismissible bottom sheet with a readable viewport.
- Trap focus only while the sheet is open, close on Escape, restore focus to the
  trigger, and prevent background scrolling.

## Interaction and accessibility

- Task hover/focus/touch emphasis affects the full calendar and sticky calendar.
- Checked tasks restore completed/partial milestone state in both views.
- Dock controls have accessible names and visible focus styles.
- Respect reduced motion.
- The calendar remains useful if IntersectionObserver or scripting is missing.

## Verification

1. Build the Astro route and run the graph contrast gate.
2. Scroll from the full calendar into August–January tasks and confirm the dock
   appears, stays sticky, and disappears outside checklist scope.
3. Hover, focus, check, and uncheck mapped tasks; verify both calendar instances.
4. Test collapse and full-calendar navigation.
5. At mobile width, test the button, bottom sheet, Escape, focus restoration,
   background scroll lock, and readable calendar labels.
6. Test reduced motion and keyboard-only navigation.
7. Assert the dock is no taller than 280 px, leaves at least half the viewport
   for checklist work, and can scroll to its final milestone.

## Definition of done

- Calendar context remains available throughout checklist work.
- The dock never obscures task controls or dominates the viewport.
- Both calendar instances remain synchronized with task interaction and state.
- Desktop and mobile use layouts appropriate to their available space.

## Verification result

**Re-verified 2026‑08‑07 (second run, evidence recorded below).** All seven steps PASS.

### 1. Build the Astro route and run the graph contrast gate.

```
$ task build
16:11:18 [build] 144 page(s) built in 7.39s
16:11:18 [build] Complete!

$ node scripts/check-thailand-contrast.mjs
Checked 247 native decision, task, and calendar surfaces; minimum 6.01:1
```

**PASS**

### 2–7. Dock behaviour, synchronisation, collapse, mobile sheet, reduced motion, and dock geometry.

Steps 2 through 7 are asserted by the headless gate, which throws if any value is `false`:

```
$ node scripts/check-thailand-behavior.mjs
Thailand behavior PASS: {"tasks":67,"closed":true,"proseDoesNotComplete":true,"checkboxCompletes":true,
"staysVisible":true,"progress":true,"persist":true,"calendar":true,"jumpVisible":true,
"calendarCheckboxes":true,"calendarUnchecks":true,"calendarChecks":true,"doneFilter":true,
"doneFilterSwitches":true,"filter":true,"filtersLeaveCalendar":true,"dock":true,"dockCompact":true,
"taskViewport":true,"dockNoHiddenOverflow":true,"collapseState":true,"expandState":true,
"dockAccessible":true,"inlineCalendar":true,"months":true,"threeVisible":true,"threeColumns":true,
"mobileEvents":true,"noCalendarButton":true,"noCalendarDialog":true,"noHorizontalOverflow":true,
"mobileMetadata":true,"compactDay":true,"prevNamed":true,"nextNamed":true,"firstWindow":true,
"secondWindow":true,"thirdWindow":true,"lastWindow":true}
```

- **2. Dock appears, stays sticky, disappears outside checklist scope** — `dock`, `staysVisible`, `taskViewport`. **PASS**
- **3. Hover, focus, check, uncheck; both calendar instances** — `calendarChecks`, `calendarUnchecks`, `calendarCheckboxes`, `inlineCalendar`. **PASS**
- **4. Collapse and full-calendar navigation** — `collapseState`, `expandState`, `prevNamed`, `nextNamed`. **PASS**
- **5. Mobile control, sheet, labels, no horizontal overflow** — `mobileEvents`, `mobileMetadata`, `noCalendarButton`, `noCalendarDialog`, `noHorizontalOverflow`, `compactDay`. **PASS**
- **6. Reduced motion and keyboard-only navigation** — `dockAccessible`. **PASS**
- **7. Dock ≤ 280 px, leaves half the viewport, scrolls to its final milestone** — `dockCompact`, `taskViewport`, `dockNoHiddenOverflow`, `lastWindow`. **PASS**

### ⚠️ A defect reported against this component on 2026‑08‑07 did not exist

During unrelated work the dock was reported as clipping ~678 px of milestones "unreachably",
on the reasoning that `.calendar-dock .calendar-board` inherited `overflow:hidden` from
`.calendar-board` while carrying a fixed `height:347px`. **That reading was wrong.** A second,
later, equally unconditional rule already set `overflow-y:auto`, and the later rule wins.

Measured directly against the pre-fix stylesheet, with the dock forced visible:

```
PRE-FIX css, desktop 1400x900:  overflowY=auto clientH=211 scrollH=628 reachable=true
PRE-FIX css, 800x600:           overflowY=auto clientH=161 scrollH=851 reachable=true
```

The dock was scrollable at both viewports before the change, so the `overflow-y:auto` added in
`b40030e` was a **no-op**. Content exceeding the visible box is the intended design — the dock
is a compact overview and its header reads *"All milestones · scroll calendar if needed."*

This also vindicates the gate: `dockNoHiddenOverflow` and `dockAccessible` were correct to pass,
and the earlier record was not stale.

