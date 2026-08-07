# Thailand checklist — sticky calendar dock

**Date:** 2026-08-07  
**Status:** Ready for implementation  
**Target:** <https://biohack.net/thailand/>

## Outcome

Keep calendar context visible while working through checklist items without
letting the full 1200×620 calendar consume most of the viewport.

## Desktop behavior

- Keep the full calendar in its existing document position.
- After the full calendar scrolls above the viewport and a checklist section is
  active, reveal a sticky calendar dock beneath the top edge.
- Use the same calendar SVG and the same stable task/event mappings.
- Limit the dock to roughly 160–190 px high and make it collapsible.
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

## Definition of done

- Calendar context remains available throughout checklist work.
- The dock never obscures task controls or dominates the viewport.
- Both calendar instances remain synchronized with task interaction and state.
- Desktop and mobile use layouts appropriate to their available space.

## Verification result

**PASS — 2026-08-07, release `v1.0.396`.**

- Astro production build passed.
- The headless-Chrome graph contrast gate passed.
- GitHub deployment run `31154772192` completed successfully.
- Cloudflare production HTML contains `calendar-dock`,
  `thailand-calendar-dock`, and `task-complete` markers.
- Live endpoint returned the deployed sticky-calendar implementation at
  <https://biohack.net/thailand/>.
