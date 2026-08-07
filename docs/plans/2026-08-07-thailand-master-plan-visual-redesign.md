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

## Next implementation phase

These are required structural improvements, in priority order:

### 1. Replace the generated export with native Astro

Replace `public/thailand/index.html` with `src/pages/thailand.astro` and structured
plan data. Remove all Markdown-preview artifacts: embedded renderer CSS,
revision/history scripts, generated attribution spans, Mermaid export markup,
and prose-hash task discovery. The build must produce exactly one
`dist/thailand/index.html`, owned by Astro.

**Implementation note (2026-08-07):** the route is now owned by
`src/pages/thailand.astro`; the former public-path collision has been removed.
The initial migration deliberately preserves the verified page body as imported
HTML under `src/content/thailand/`. Follow-up work should progressively replace
that compatibility source with typed Astro components and structured plan data.

### 2. Replace the tall flowchart with a compact decision panel

Remove the disproportionately tall Mermaid graph. Render a compact responsive
decision summary with three primary outcome columns:

- **Issued:** return to Bangkok on the issued status.
- **Pending:** remain in Viet Nam under the 90-day visa and wait.
- **Refused:** return visa-exempt and activate the prepared TM.87 fallback.

Keep the three candidate evidence routes and counsel-selection step as concise
context above the outcomes, not another full-height flowchart. Stack the three
outcomes on narrow screens.

### 3. Add a live progress header

At the top of the operational section, show:

- completed count and total, for example **7 of 32 completed**;
- a progress bar with an accessible text equivalent;
- the current phase derived from today's date;
- the next incomplete deadline;
- a **Reset local progress** control with confirmation.

Counts and next deadline update immediately when a task is checked. Conditional
tasks remain in the total but are identified as conditional; do not claim they
are overdue before their trigger occurs.

### 4. Collapse task details for scanning

Show each task's checkbox, due date, owner, and action by default. Put **Why**
and **Done when** inside an accessible disclosure that is collapsed initially.
The disclosure must use a native `<details>`/`<summary>` or an equivalent button
with correct `aria-expanded` behavior. Checkbox toggling and disclosure toggling
must not interfere with each other.

### 5. Add task filters

Add a keyboard-accessible filter bar with:

- **Due soon**
- **Visa**
- **Cat**
- **Thai study**
- **Travel/tax**
- **Completed**

Default view shows all incomplete tasks plus any explicitly selected completed
filter behavior. Filters may combine where useful, show the visible-result
count, preserve checkbox state, and never alter the canonical task data. When a
filter hides the task currently linked to a highlighted calendar milestone,
clear that highlight.

### 6. Show temporal context without interaction

The calendar must answer “where am I now?” at a glance. Highlight the current
month and the next actionable incomplete milestone on initial render. Include a
small “Today” marker when today's date lies within the displayed range. If the
plan is viewed before or after that range, state that clearly rather than
pinning the marker misleadingly to an endpoint.

The passive current/next treatment must remain distinguishable from the
stronger temporary highlight created by task hover or focus.

### 7. Replace prose-derived hashes with explicit stable IDs

Give every task and calendar milestone an authored stable ID in shared plan
data. Use those IDs for DOM identity, `localStorage`, task/calendar mappings,
tests, URL fragments, and analytics-free interaction state. Editing visible
wording must neither reset checkbox progress nor break a calendar association.

Provide a deliberate one-time migration table from the existing hash keys where
the mapping is reliable. Document any progress reset that cannot be migrated.

### 8. Add reverse calendar interaction and navigation

Hovering, focusing, or touch-selecting a calendar milestone must emphasize all
of its mapped task cards. Provide an explicit **Jump to task** action for each
mapped task; activating it clears incompatible filters, scrolls to the card,
moves keyboard focus there, and briefly emphasizes it. Merely hovering never
force-scrolls the page.

### 9. Give mobile a purpose-built calendar view

Do not shrink the 1200 px desktop SVG until its labels become unreadable. At
mobile widths, provide either:

- a horizontally pannable/zoomable calendar with obvious affordances and a
  sensible initial viewport; or
- a compact vertical chronological timeline using the same event data.

Prefer the vertical timeline if it provides clearer labels and simpler keyboard
navigation. Desktop and mobile views must share event IDs, task mappings,
current-period state, and highlight behavior.

### 10. Add a sticky section navigator

Add a compact sticky navigator with links to:

**Outcome · Decision · Calendar · August · September · October · Viet Nam ·
January · Done**

Indicate the active section as the user scrolls. Preserve visible keyboard
focus, account for the sticky header in anchor positioning, allow horizontal
scrolling on narrow screens, and avoid covering page content. Respect reduced
motion for section scrolling.

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

### Completed tasks reflected in the calendar

When a mapped task is checked, its calendar milestone must adopt a persistent
completed visual state distinct from hover/focus highlighting. Use a combination
of fill, stroke, opacity, and a completion mark; do not rely on color alone.

- Restore completed milestone states from the same persisted task state on load.
- Update the milestone immediately when its checkbox changes.
- If several tasks share a milestone, mark it complete only when every mapped
  task is complete; otherwise show a partial state.
- If one task maps to several milestones, update the full mapped set together.
- Hover/focus emphasis temporarily strengthens a completed marker without
  erasing its completed meaning, then returns it to the completed style.
- Expose completion in the SVG/accessibility label so it is not merely visual.
- The current/next milestone calculation must skip completed milestones.

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
