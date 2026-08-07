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

**PASS — 2026-08-07; reverified with the native Astro replacement.**

- The desktop dock is a compact native calendar generated from the same event
  records as the full calendar; it has no SVG aspect-ratio gutters and does not
  clip or horizontally discard milestones.
- It appears only after the full calendar and only inside the task register,
  supports full-calendar navigation and collapse, and shares completion,
  partial, next-action, and temporary linked states.
- Mobile uses a task-register-only floating control and modal bottom sheet with
  readable vertical events, native modal focus containment, Escape dismissal,
  background inertness, and focus restoration.
- The headless browser gate verifies persistence, progress, closed disclosures,
  filters, synchronized completion, and dialog behavior. Contrast is checked
  across all native decision, task, and calendar surfaces.
