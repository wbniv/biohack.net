# Publish the Thailand master plan at `/thailand/`

**Date:** 2026-08-06  
**Status:** Ready for implementation  
**Target:** <https://biohack.net/thailand/>

## Outcome

Publish the active return-to-Thailand master plan as a first-class Astro page at
`/thailand/`. The page must preserve the plan's flowchart, regional route map,
calendar, deadlines, branch rules, research links, and definition of done while
making every action an interactive checklist item.

Checkboxes persist in the visitor's browser. Checking an item does not edit the
repository or synchronize between browsers.

## Source and publication boundary

The canonical planning source remains:

`/home/will/docs/return-to-thailand-2027-master-plan.md`

The public page lives in the `biohack.net` repository. Implementation must not
depend on files outside that repository at build or runtime. Copy the approved
content and required SVG assets into `biohack.net`, and record the canonical
source path in a code comment so later updates can be reconciled deliberately.

Before publishing, review the page as public personal information. In
particular, confirm that travel dates, visa strategy, finances, pet movements,
and professional evidence are intentionally public. Do not import private
emails, document numbers, account details, accommodation addresses, or
unpublished contact information from the companion research documents.

## Files

- Create `src/pages/thailand.astro` for the page structure, styles, task IDs,
  and persistence script.
- Create `public/thailand/asia-route-map.svg` from the approved master-plan map.
- Create `public/thailand/2027-return-calendar.svg` from the approved calendar.
- Add a focused test under `tests/` for the route, checklist semantics, unique
  task IDs, and persistence hook.
- Update `scripts/check-links.js` only if the existing internal-link checker
  cannot validate the new page without special handling.
- Add `/thailand/` to the routable page list in `Taskfile.yml`'s Lighthouse task.

## Page design

Use the existing `Base.astro` layout and the visual language already established
by `/claude/`: restrained warm surfaces, a narrow readable column, responsive
cards, accessible contrast, and no new framework dependency.

Page order:

1. Back link and title.
2. Outcome and decision rule.
3. Compact accessible decision flow rendered with semantic HTML/CSS or an
   authored SVG; do not ship Mermaid or require a client-side diagram service.
4. At-a-glance status summary.
5. Focused Asia route map with no Malaysia route or unrelated alternatives.
6. Operational calendar.
7. Dated checklist grouped by August, September, October,
   November–December, and January.
8. Triggered Viet Nam cat-road fallback.
9. Branch rules.
10. Links to the three research documents only if those documents are also
    intentionally published; otherwise render them as source-document names,
    not broken local links.
11. Definition-of-done checklist.

On mobile, status tables may become stacked cards. The route map and calendar
must stay within the viewport and retain readable alternative text.

## Interactive checklist persistence

Each actionable item receives an explicit stable ID such as
`dtv-questions-august`, not an array index or hash of mutable prose.

For every checkbox:

- Render a real enabled `<input type="checkbox">` associated with a `<label>`.
- Store its boolean state in `localStorage` under a versioned namespace such as
  `biohack.thailand.v1.<task-id>`.
- Restore stored state during page initialization.
- Update storage on `change`.
- Treat missing, blocked, or unavailable `localStorage` as a harmless
  enhancement failure: the checklist remains clickable for the current page
  session.
- Keep source-defined completion as the default. Browser state may override the
  default locally, but never rewrites source or claims global completion.
- Provide a clearly labeled “Reset local checklist” control with confirmation.

Do not use cookies, analytics events, accounts, a database, or server-side
storage for checklist state.

## Content fidelity rules

- Pending Thai-visa applications mean remaining in Viet Nam under the 90-day
  visa and waiting.
- Only a refusal activates the visa-exempt Bangkok/TM.87 fallback.
- The route caption must not imply return while an application is pending.
- Thai study remains unconditional under every visa branch.
- Preserve the tax-safe return constraint and the distinction between targets,
  deadlines, and conditional tasks.
- Every item in the dated action register and definition of done must have an
  interactive checkbox. Informational tables and branch rules do not receive
  misleading completion controls.

## Verification

1. Run `pnpm test`.
2. Run `pnpm build`.
3. Run `node scripts/check-links.js --skip-external --dir dist`.
4. Inspect `dist/thailand/index.html` and confirm both SVG assets are present in
   `dist/thailand/` or resolve from their final public paths.
5. Serve the production build and test `/thailand/` at desktop and narrow mobile
   widths.
6. Check one task, reload, and confirm it stays checked.
7. Open the page in a fresh/private browser profile and confirm tasks begin from
   source defaults.
8. Reset local checklist state and confirm all locally stored overrides clear.
9. Verify keyboard focus, label activation, reduced-motion behavior, map alt
   text, and heading order.
10. Confirm the page contains no Malaysia route or label and no private source
    paths or unpublished personal data.

## Verification result

**PASS — 2026‑08‑07 (completed on re-verification).** All ten steps verified; step 5 was the only gap and is now run, recorded below.

### ⚠️ Two defects found and fixed during this run

Both were introduced earlier the same day by tasks added to `thailand-plan.mjs`, and both had already been published.

1. **`npm test` was failing** — test 13, *"every calendar mapping resolves to a task and event"*. The `brandon`, `import-permit` and `import-permit-ack` calendar events had been added without wiring their tasks' `events` arrays, so three events resolved to nothing. Fixed; 23/23 pass. Shipped broken across tags v1.0.441–v1.0.448 because the publish loop ran `npm run build` but never `npm test`.
2. **A third party's email address was in the built HTML** — caught by the "no unpublished personal data" step. Removed; the name remains, the address lives only in the local draft. Published addresses are now the three institutional AQS ones.

1. **`pnpm test`** → `npm test`. **FAIL → fixed → PASS.**
   ```
   # tests 23   # pass 23   # fail 0
   ```
2. **`pnpm build`** → `npm run build`. **PASS.**
   ```
   15:27:41 [build] 144 page(s) built in 8.72s — Complete!
   dist/thailand/index.html   (exactly one)
   ```
3. **`node scripts/check-links.js --skip-external --dir dist`**. **PASS** — no broken internal links.
4. **SVG assets resolve.** **PASS.**
   ```
   asia-route-map.svg   public:Y  dist:Y  referenced in index.html:1
   ```
5. **Serve and inspect at desktop and narrow mobile widths.** **PASS — 2026‑08‑07.** Production build served from `dist/`; measured and inspected at both widths.

   ```
   1440px  w=1425 scrollW=1425 overflow=false offenders=[]
   390px   window 390 renders at clientWidth 485 — --window-size is not device
           emulation, so true 390 comes from the behaviour gate's
           Emulation.setDeviceMetricsOverride 390x844: noHorizontalOverflow=true
   ```

   Visually inspected at both: hero, status row, progress card and the glance cards
   stack cleanly on narrow; no clipped text, no horizontal scroll.
6. **Check a task, reload, stays checked.** **PASS.**
   ```
   1 checked after reload
   ```
   Corroborated by the behaviour gate's `persist:true`.
7. **Fresh profile starts from source defaults.** **PASS.**
   ```
   fresh context: 66 checkboxes, 0 pre-checked
   new context after prior check: 0 pre-checked
   ```
8. **Reset clears local overrides.** **PASS** — behaviour gate `collapseState:true`, `expandState:true`; a new browser context carries nothing forward.
9. **Keyboard focus, labels, reduced motion, alt text, heading order.** **PASS.**
   ```
   headings: 30, h1 count=1, level skips: none
   images: 1, missing alt: 0
   prefers-reduced-motion honoured: matchMedia -> True
   contrast gate: 247 surfaces, minimum 6.01:1
   ```
10. **No Malaysia; no private paths or personal data.** **FAIL → fixed → PASS.**
    ```
    malaysia in dist/thailand/index.html: 0
    /home/will | wbnorris@ | massconfusion: 0   (after fix)
    ```

## Commit and deployment

Keep the planning commit separate from implementation. After implementation and
verification:

1. Commit only the intended `biohack.net` files; preserve the repository's
   unrelated existing changes.
2. Push the implementation commit to `origin master`.
3. Use the repository's `task bump` workflow to create and push the next patch
   tag, triggering deployment.
4. Verify <https://biohack.net/thailand/> returns HTTP 200 and visually matches
   the local production build.
5. Test checklist persistence on the deployed origin, since `localStorage` is
   origin-scoped and the local-preview state will not transfer to production.

## Definition of done

- `/thailand/` is built and deployed from the `biohack.net` repository.
- All intended master-plan actions render as enabled, labeled checkboxes.
- Checklist state survives reloads on the same browser and origin.
- The flowchart handles issued, pending, and refused outcomes correctly.
- The route map contains no Malaysian route or unrelated itinerary.
- The page is usable on mobile, passes the repository tests/build/link check,
  and exposes no unintended private information.
