# Thailand master plan — dark biohack.net visual redesign

**Date:** 2026-08-07  
**Status:** Ready for implementation  
**Page:** <https://biohack.net/thailand/>  
**Predecessor:** [Publish the Thailand master plan at `/thailand/`](2026-08-06-thailand-master-plan-page.md)

## Problem

The current `/thailand/` page is a self-contained export from the Markdown
preview tool. It publishes the content and persistent checklist successfully,
but visually reads as an imported document rather than part of biohack.net. Its
wide document furniture, revision gutter, table styling, diagram treatment, and
mixed light/dark assumptions do not match the site's designed pages.

## Outcome

Replace the exported HTML with a first-class Astro page that:

- uses a deliberate dark theme;
- matches biohack.net's existing color palette and typography;
- makes the plan feel calm, legible, and operational rather than dense;
- preserves every approved fact, branch, deadline, map, calendar, and task;
- keeps interactive checkbox state in browser `localStorage`;
- remains excellent on phones, tablets, and desktop screens.

## Mockups

**[Open the responsive dark-theme HTML mockup](2026-08-07-thailand-master-plan-visual-redesign/mockup.html).**

The mockup demonstrates the intended desktop and mobile composition: hero and
status chips, five-card summary, three-outcome decision path, route/calendar
pairing, progress meter, native checklist cards, reset control, and local-only
persistence note. It is a visual design reference rather than production code;
the implementation still uses the real map, calendar, complete task set, stable
IDs, and accessible interaction behavior specified below.

## Files

- Create `src/pages/thailand.astro` as the canonical public implementation.
- Create `src/data/thailand-plan.ts` for typed sections and stable task IDs, if
  keeping all content directly in the page would make review difficult.
- Keep approved visual assets under `public/thailand/`:
  - `asia-route-map.svg`
  - `2027-return-calendar.svg`
- Remove `public/thailand/index.html` after the Astro route builds successfully;
  two competing `/thailand/` outputs must never coexist.
- Add or extend tests under `tests/` for route generation, checklist IDs,
  persistence hooks, content invariants, and asset references.
- Add `/thailand/` to the Lighthouse URL list in `Taskfile.yml`.

## Visual direction

### Palette

Start from biohack.net's existing identity rather than introducing a separate
Thailand microsite palette:

- page background: near-black navy/charcoal;
- raised surfaces: slightly lighter blue-charcoal;
- primary text: warm off-white;
- secondary text: muted stone;
- borders: quiet slate with enough contrast to define cards;
- primary accent: biohack terracotta (`#C96442` family);
- route/status accent: restrained teal, already present in the plan graphics;
- warning/conditional accent: muted amber;
- study accent: softened violet, used sparingly.

Define colors as page-scoped custom properties. Verify normal text and controls
meet WCAG AA contrast. Avoid pure black, pure white, neon colors, heavy glows,
and gradients that reduce legibility.

### Typography

Use the same font stack and hierarchy as the better-designed biohack.net pages:

- compact display treatment for the page title and section eyebrows;
- Inter/system sans-serif for prose and tasks;
- monospace only for identifiers or literal form names;
- comfortable body line height and a readable maximum text measure;
- tabular numerals for dates where available.

The page should not inherit the Markdown preview's revision markers, blame
highlights, metadata card, document-export footer, or vertical history spine.
No decorative or revision line may run through the reading column; any future
timeline treatment must sit fully outside the text measure or be omitted.

### Layout

Use a centered content canvas around 900–1000 px, with prose constrained more
narrowly inside it.

1. **Hero:** back link, title, one-sentence outcome, current status chips, and a
   small “local checklist” privacy note.
2. **Decision path:** compact responsive cards connected by subtle rules; use
   semantic HTML/CSS or a dedicated accessible SVG, not Mermaid at runtime.
3. **At a glance:** five concise status cards instead of a wide table.
4. **Route and calendar:** large visual cards with proper captions; stack on
   small screens.
5. **Checklist:** chronological sections with sticky or clearly visible month
   headers, roomy task cards, due/owner metadata, and collapsible rationale.
6. **Fallback and branch rules:** visually distinct conditional cards, not mixed
   into the primary checklist.
7. **Definition of done:** strong closing checklist and progress summary.

Use spacing, borders, and surface contrast for hierarchy. Avoid decorative
boxes around every paragraph.

## Checklist interaction

Preserve the existing browser-local model while improving clarity:

- Every task uses an explicit stable ID, never a hash of mutable task prose.
- Namespace storage as `biohack.thailand.v2.<task-id>`.
- Render enabled native checkboxes with associated labels and generous hit
  targets.
- Restore state before or immediately after hydration without visible flicker.
- Update local storage on change; degrade gracefully if storage is unavailable.
- Show completed count and total count for the current browser.
- Style completed tasks with reduced emphasis but keep their text readable.
- Include “Reset local progress” behind a confirmation step.
- Explain that progress is stored only in this browser and is not synchronized
  or written back to Git.

If migration from the current prose-hash keys is practical and unambiguous,
migrate once. Otherwise start the explicit-ID `v2` namespace cleanly and state
that the redesign resets local progress.

### Checklist ↔ calendar highlighting

Checklist cards and calendar milestones are linked views of the same plan. When
a user hovers over or keyboard-focuses a checklist card, highlight its
corresponding item in the calendar view.

- Give every plotted calendar milestone an explicit stable event ID such as
  `dtv-questions-august`.
- Map each checklist task to zero, one, or several event IDs through authored
  data; do not infer mappings from prose, dates, DOM order, or fuzzy matching.
- Put the mapping in the shared plan data so the checklist and calendar cannot
  silently drift apart.
- On task-card `pointerenter` or `focusin`, add a strong but tasteful highlight
  to the corresponding calendar marker, label, and date lane. Dim unrelated
  calendar events slightly rather than hiding them.
- On `pointerleave` or when focus leaves the entire task card, restore the
  calendar's normal state.
- Make the association bidirectional: hovering or focusing a calendar event
  should emphasize the corresponding checklist card when it is currently in or
  near the viewport. Do not force-scroll on hover.
- If several tasks map to one milestone, highlight that milestone for each task.
  If one task spans several milestones, highlight the full set together.
- Tasks without a meaningful plotted calendar event remain fully usable and do
  not trigger a blank or misleading highlight.
- The interaction must work with keyboard focus and touch selection, not hover
  alone. On touch, tapping a task may toggle its calendar emphasis without
  toggling the checkbox unless the checkbox or its label was the target.
- Expose the relationship programmatically with stable element IDs and
  `aria-describedby` or equivalent accessible text. The visual highlight is a
  progressive enhancement, not the only expression of the date.
- Respect `prefers-reduced-motion`; use color, border, contrast, and modest scale
  rather than sweeping animation.

Example mapping:

`dtv-questions-august` links the checklist task “Send the prepared DTV questions
to Hanoi and Seoul” to its August calendar milestone. Hovering or focusing the
task card highlights that milestone; leaving the card restores the calendar.

## Diagram and map treatment

- Rebuild the decision flow so the three application outcomes remain exact:
  issued returns on the issued status; pending remains in Viet Nam under the
  90-day visa; refused activates the visa-exempt/TM.87 fallback.
- Apply explicit dark-theme fills, strokes, text, arrowheads, and edge-label
  backgrounds to the decision graph; never rely on light Mermaid defaults under
  globally light text.
- Give route-map labels dark-theme halos matching the map background, not pale
  outlines that look double-printed.
- Keep unrelated Malaysia routes and labels absent.
- Preserve the distinction between the working air route and the triggered-only
  Viet Nam cat-export road fallback.
- Place detailed dates in the calendar and task cards, not inside the map.
- Give both SVGs responsive dimensions, descriptive alt text, and captions.

## Responsive and accessible behavior

- Design at 360 px, 768 px, and desktop widths.
- Never require horizontal scrolling for tasks, status, diagrams, or captions.
- Maintain visible keyboard focus on links, checkboxes, disclosure controls, and
  reset controls.
- Make checkbox/label hit areas at least 44 px high where practical.
- Respect `prefers-reduced-motion`; interaction does not depend on animation.
- Preserve logical heading order and landmark structure.
- Ensure information encoded by color is also expressed in labels or shape.
- Print styles should produce a clean checklist without dark ink-heavy page
  backgrounds.

## Content rules

- Treat the existing public page's approved content as the migration source,
  while checking it against
  `/home/will/docs/return-to-thailand-2027-master-plan.md` during implementation.
- Do not publish local paths, private correspondence, document numbers, account
  details, accommodation addresses, or unpublished personal contacts.
- Do not alter deadlines or visa logic as part of the visual redesign.
- External research links must be intentional; local-only companion links must
  be omitted, summarized, or published separately rather than left broken.

## Verification

1. Run `pnpm test`.
2. Run `pnpm build` and confirm exactly one `dist/thailand/index.html` exists.
3. Run the internal link checker.
4. Verify every intended task has one unique stable ID and enabled checkbox.
5. Check tasks, reload, navigate away/back, and confirm persistence.
6. Test the reset flow and unavailable-storage fallback.
7. For every authored task-to-calendar mapping, hover and keyboard-focus the
   task and confirm the correct milestone highlights and then resets.
8. Test shared milestones, multi-event tasks, unmapped tasks, touch selection,
   and calendar-to-task reverse emphasis.
9. Compare issued, pending, and refused decision branches against the source.
10. Inspect route map and calendar in dark mode at desktop and mobile widths.
11. Run Lighthouse for `/thailand/`, including accessibility.
12. Check keyboard-only navigation, focus visibility, contrast, reduced motion,
    and print preview.
13. Confirm no Malaysia route or label appears.
14. Confirm no local filesystem paths or unintended private information appear
    in the built HTML.

## Deployment

1. Commit the Astro route, data, assets, tests, and removal of the exported HTML
   as one reviewed implementation change.
2. Push `master` and run `task bump` to trigger the tag deployment.
3. Wait for the deployment action to succeed.
4. Verify <https://biohack.net/thailand/> returns HTTP 200 and contains the new
   Astro markup and `biohack.thailand.v2` persistence namespace.
5. Visually inspect the production page in dark mode on desktop and mobile.

## Definition of done

- `/thailand/` is a native Astro page that visibly belongs to biohack.net.
- The page has a polished dark palette, readable hierarchy, and responsive
  layout.
- All plan logic and approved content remain accurate.
- Every task is clickable and persists locally through stable explicit IDs.
- Hovering, focusing, or touch-selecting a mapped task highlights the correct
  calendar milestone, and calendar events can emphasize their mapped tasks.
- The map, calendar, and decision flow are clear and uncluttered.
- Tests, build, link checks, accessibility checks, and production verification
  pass.
