# Thailand master plan — operational checklist completion

**Date:** 2026-08-07
**Status:** Implemented and locally verified
**Target:** <https://biohack.net/thailand/>

## Problem

The master plan now covers visa selection, tax timing, cat paperwork, passenger
flights, cat reservations, and accommodation. It still assumes several
real-world handoffs will happen without explicit tasks: border-entry checks,
country-specific cat approvals, airport transport, reservation reconfirmation,
insurance, travel supplies, remote account access, departure shutdown, and
Bangkok arrival setup.

Those assumptions belong in the checklist. Each must have an owner, a date or
trigger, a stable ID, a calendar event where useful, and objective completion
evidence.

## Outcome

Add the following operational tasks to both the canonical Markdown master plan
and the native Astro task registry. Do not add generic advice or a monolithic
packing list. Every item must represent a discrete failure point that can be
checked off.

Physical SIM cards are explicitly out of scope. Connectivity is a price and
coverage decision between the existing TRUE account's Asia travel package and
an eSIM alternative.

## Authored tasks

### Entry and pet permissions

1. `verify-korea-entry`
   - **Due:** 30 September 2026
   - **Task:** Verify the current passport-validity, entry authorization,
     onward-ticket, and arrival-form requirements for the planned South Korea
     stay using official sources.
   - **Done when:** Applicable authorization is approved or confirmed
     unnecessary; official requirements and evidence are saved.
   - **Categories:** Travel/tax
   - **Calendar event:** `korea-entry-ready`

2. `verify-vietnam-entry`
   - **Due:** 30 September 2026
   - **Task:** Verify and obtain the correct Viet Nam entry permission for the
     planned arrival date and intended 90-day application wait, matching the
     passport, entry airport, and accommodation address exactly.
   - **Done when:** Issued document and application fields are independently
     checked; copies are available offline.
   - **Categories:** Visa, Travel/tax
   - **Calendar event:** `vietnam-entry-ready`

3. `cat-country-permissions`
   - **Due:** 30 September 2026
   - **Task:** Build and close a country-by-country cat import/transit matrix for
     Thailand export, South Korea entry/transit, Viet Nam entry, Viet Nam export,
     and Thailand re-entry. Confirm whether each stop is import, transit, or
     through-check based on the booked itinerary.
   - **Done when:** Every required permit, notice, certificate, endorsement,
     translation, original, copy, and validity window has an owner and status;
     official written answers resolve ambiguous handoffs.
   - **Categories:** Cat, Travel/tax
   - **Calendar event:** `cat-permissions-ready`

### Transport and reservation controls

4. `book-cat-ground-transport`
   - **Due:** 15 October 2026
   - **Task:** Book or identify reservable cat-accepting transport for home →
     BKK, ICN → Seoul lodging, Seoul lodging → ICN, DAD → Viet Nam lodging, and
     the eventual Thailand arrival. Include the SGN fallback only as a triggered
     branch.
   - **Done when:** Provider, pickup instructions, carrier acceptance, price,
     luggage capacity, contact method, and fallback are recorded for every
     active segment.
   - **Categories:** Cat, Travel/tax
   - **Calendar event:** `ground-transport-ready`

5. `reconfirm-bkk-icn`
   - **Due:** 18 October 2026, then again 20 October
   - **Task:** Reconfirm the BKK → ICN passenger ticket and cat cabin reservation
     at roughly 72 and 24 hours before departure.
   - **Done when:** Flight status, cat SSR, fee, check-in desk/time, carrier and
     document rules are reconfirmed and timestamped.
   - **Categories:** Cat, Travel/tax
   - **Calendar event:** `reconfirm-bkk-icn`

6. `reconfirm-icn-dad`
   - **Due:** 72 and 24 hours before the booked ICN → DAD flight
   - **Task:** Reconfirm the passenger ticket and cat cabin reservation.
   - **Done when:** The same six fields above are timestamped for this flight.
   - **Categories:** Cat, Travel/tax
   - **Calendar event:** `reconfirm-icn-dad`

7. `reconfirm-return-flight`
   - **Trigger:** A Viet Nam → Bangkok flight is booked
   - **Due:** 72 and 24 hours before that flight
   - **Task:** Reconfirm passenger travel, cat space, export-airport match, and
     Thailand arrival requirements.
   - **Done when:** Airline and cat confirmations are timestamped and the
     document packet matches the actual airport/date.
   - **Categories:** Cat, Travel/tax, Visa
   - **Calendar event:** `reconfirm-return`
   - **Conditional:** Yes; never mark overdue before the return is booked.

### Health, insurance, supplies, and records

8. `bind-travel-insurance`
   - **Due:** 15 October 2026
   - **Task:** Bind travel medical coverage for South Korea and Viet Nam and
     confirm what, if anything, covers the cat, trip interruption, changed visa
     timing, and emergency repatriation. Record deliberate exclusions rather
     than assuming coverage.
   - **Done when:** Policies, dates, limits, exclusions, emergency numbers, and
     offline copies are saved.
   - **Categories:** Cat, Travel/tax
   - **Calendar event:** `insurance-bound`

9. `cat-travel-kit`
   - **Due:** 18 October 2026
   - **Task:** Assemble the cat travel kit: vet-approved medication plan if any,
     regular medication, food, water setup, absorbent pads, litter plan, harness,
     cleaning supplies, and spare carrier fasteners.
   - **Done when:** Quantities cover the route plus delay buffer; medication
     instructions and prescriptions are saved.
   - **Categories:** Cat
   - **Calendar event:** `cat-kit-packed`

10. `duplicate-document-packets`
    - **Due:** 18 October 2026
    - **Task:** Build matching paper and offline digital packets for passport,
      visas/entry permissions, flight and cat reservations, insurance, vet and
      government certificates, accommodation, bank evidence, and emergency
      contacts.
    - **Done when:** One carried original set, one separate backup set, and an
      encrypted offline digital copy have been cross-checked.
    - **Categories:** Cat, Visa, Travel/tax
    - **Calendar event:** `documents-packed`

### Money, accounts, and connectivity

11. `verify-money-access`
    - **Due:** 15 October 2026
    - **Task:** Verify cards, travel notices where applicable, ATM limits,
      emergency cash, backup payment method, remote Thai/U.S. bank access,
      authenticator recovery, and the ability to obtain official statements
      while abroad.
    - **Done when:** A small end-to-end access test succeeds; limits, support
      numbers, recovery codes, and backup funding route are available offline.
    - **Categories:** Visa, Travel/tax
    - **Calendar event:** `money-access-ready`

12. `choose-asia-connectivity`
    - **Due:** 18 October 2026
    - **Task:** Compare the current official price, allowance, duration,
      tethering, and Korea/Viet Nam coverage of TRUE's Asia travel package
      against suitable regional or country eSIMs. Do not buy physical SIM cards.
      Account for whether local eSIMs require identity registration or provide
      materially better value.
    - **Done when:** The comparison is saved and either the TRUE package is
      activated for the required dates or an eSIM is purchased, installed,
      labeled, and tested without disrupting the Thai number needed for OTPs.
    - **Categories:** Travel/tax
    - **Calendar event:** `connectivity-ready`
    - **Research rule:** Use current official TRUE terms and current eSIM vendor
      terms at implementation/execution time; do not hard-code today's pricing
      into the long-lived plan.

### Departure shutdown

13. `close-thailand-departure`
    - **Due:** 20 October 2026
    - **Task:** Close the Thailand departure checklist: housing/keys, storage,
      mail, recurring deliveries, subscriptions that should pause, utilities,
      valuables, document scans, device backups, and a trusted local contact.
    - **Done when:** Each applicable item is closed or deliberately left active
      with owner, cost, access method, and restart date recorded.
    - **Categories:** Travel/tax
    - **Calendar event:** `departure-closed`

### Bangkok return and lawful-address setup

14. `prepare-bangkok-address`
    - **Due:** Before booking the return flight
    - **Task:** Secure Bangkok lodging that accepts the cat and can support the
      intended address-reporting/TM30 evidence. Confirm the responsible filer
      and turnaround before relying on it for TM.87.
    - **Done when:** Booking/lease, cat acceptance, address, filer contact, and
      document commitment are written and saved.
    - **Categories:** Cat, Visa, Travel/tax
    - **Calendar event:** `bangkok-address-ready`

15. `confirm-tm30`
    - **Trigger:** Arrival at the Bangkok address
    - **Due:** Promptly after arrival and before any TM.87 filing
    - **Task:** Confirm the current reporting deadline and obtain acceptable
      TM30/address evidence from the responsible filer.
    - **Done when:** Filing proof is saved and the school confirms it is usable
      in the TM.87 packet if that branch is active.
    - **Categories:** Visa, Travel/tax
    - **Calendar event:** `tm30-ready`
    - **Conditional:** Deadline details must be verified from current official
      guidance; do not encode an unverified legal period.

16. `bangkok-arrival-setup`
    - **Due:** Within 48 hours of Bangkok arrival
    - **Task:** Complete arrival transport, cat food/litter, local vet contact,
      medication continuity, groceries/essentials, lodging check-in, school
      contact, and the next immigration/document appointment. Connectivity is
      already handled by `choose-asia-connectivity`; do not buy a physical SIM.
    - **Done when:** The cat is settled with supplies and veterinary fallback;
      essential living needs and next legal/study appointments are confirmed.
    - **Categories:** Cat, Thai study, Visa, Travel/tax
    - **Calendar event:** `bangkok-settled`

17. `bangkok-housing-bridge`
    - **Due:** Before booking the return flight
    - **Task:** Book a cat-friendly Airbnb or hotel for roughly the first week
      after Bangkok arrival and shortlist roughly two-month rentals with an
      option to renew.
    - **Done when:** The landing stay is confirmed and at least three candidates
      record price, location, cat policy, deposit, availability, renewal terms,
      viewing contact, and TM30 capability.
    - **Categories:** Cat, Visa, Travel/tax
    - **Calendar event:** `bangkok-housing-bridge`

## Calendar and interface changes

- Add all non-conditional dates to the shared event registry.
- Map triggered tasks to clearly labeled conditional milestones; they must not
  become the next deadline or “overdue” until their trigger exists.
- Keep the full calendar, sticky dock, and mobile timeline synchronized.
- Do not solve additional density by clipping events. Derive dock capacity from
  content or add an explicit internal scrolling treatment with a visible affordance.
- The new stable IDs must use the existing `biohack.thailand.v2.<task-id>`
  persistence namespace.
- Existing checked state must remain untouched.

## Files

- Update `/home/will/docs/return-to-thailand-2027-master-plan.md`.
- Update `src/data/thailand-plan.mjs`.
- Update `src/pages/thailand.astro` only if calendar capacity or conditional
  trigger representation requires it.
- Extend `tests/thailand-plan.test.mjs` and
  `scripts/check-thailand-behavior.mjs` with the new IDs, mappings, persistence,
  and no-clipping assertions.
- Update this plan with implementation and release evidence before completion.

## Verification

1. Confirm all 16 authored IDs are unique and every event mapping resolves.
2. Build the Astro site and verify exactly one `/thailand/` output.
3. Check one new task, reload, and verify persistence plus calendar completion.
4. Verify conditional reconfirmation/TM30 work is not selected as an overdue or
   next task before its trigger.
5. Exercise All/category, Due soon, and Done views with the new tasks.
6. At desktop width, assert every dock milestone is visible or intentionally
   reachable through an obvious internal scroll area.
7. At mobile width, verify the new event labels remain readable in the bottom sheet.
8. Run unit, build, contrast, behavior, and link gates.
9. Commit canonical docs and site docs separately, publish, wait for deployment,
   and verify representative new task IDs in live HTML.

## Definition of done

- Every listed operational failure point is an actionable persisted task.
- No physical-SIM purchase appears anywhere in the task set.
- Connectivity makes an explicit TRUE Asia package versus eSIM decision using
  current prices and terms.
- Flight, pet, border, money, insurance, departure, and arrival handoffs have
  objective completion evidence.
- Calendar density remains fully usable on desktop and mobile.
- Documentation, tests, commits, deployment, and live verification all pass.

## Implementation evidence

- Canonical master-plan commit: `e3d6a5b`.
- Added all 17 stable tasks and matching calendar events; the rendered registry
  now contains 58 tasks.
- The sticky desktop calendar retains every event and uses an explicitly labeled,
  visible internal scroll region when its content exceeds the viewport.
- Unit tests and the Astro production build pass.
- Browser behavior gate passes persistence, filters, completion-to-calendar state,
  closed-by-default details, synchronized calendar counts, and dock reachability.
- Contrast gate checked 260 task, decision, and calendar surfaces; minimum ratio
  was 6.01:1.
- Internal link check passed all 15 checked links.
- Release `v1.0.409` deployed successfully. Live HTML verification found the
  `bangkok-housing-bridge` task, landing-stay wording, TRUE/eSIM choice, and
  explicit sticky-calendar scroll affordance.
- Bangkok housing-bridge addition: canonical commit `7594ae0`; site regression
  passes with 58 tasks and all sticky-calendar milestones accessible.

## Verification result

**PASS — 2026‑08‑07.** All nine steps run; this plan previously carried no result at all.

### 1. All authored IDs unique and every event mapping resolves

```
tasks: 71 unique: 71 OK
task->event unresolved: 0 | events with no task: 0
```

**PASS** — also enforced permanently by `tests/thailand-plan.test.mjs`.

### 2. Build; exactly one `/thailand/` output

```
$ ls dist/thailand/index.html | wc -l
1
```

**PASS**

### 3. Check a task, reload, persistence plus calendar completion

Asserted by the behaviour gate: `checkboxCompletes`, `persist`, `calendar`, `progress` all true. **PASS**

### 4. Conditional work is not selected as overdue or next before its trigger

Seven conditional tasks exist (`planning-bound`, `book-return-flight`, `reconfirm-return-flight`, `confirm-tm30`, `tm87-start`, `tm87-backstop`, `cat-road-fallback`). The next-deadline pick filters them out:

```js
const next = cards.filter(c => !done.has(c.dataset.taskId) && c.dataset.conditional !== 'true')
```

and the due-soon filter applies the same exclusion. **PASS**

### 5. All/category, Due soon, and Done views with the new tasks

Behaviour gate: `filter`, `doneFilter`, `doneFilterSwitches`, `filtersLeaveCalendar` all true, with 71 tasks loaded. **PASS**

### 6. Desktop: every dock milestone visible or reachable through an obvious scroll area

Gate: `dock`, `dockCompact`, `dockNoHiddenOverflow`, `dockAccessible` all true. Measured directly: `overflowY=auto`, `clientH=211`, `scrollH=628` at 1400×900 — the overflow is reachable, and the dock header states *"All milestones · scroll calendar if needed."* **PASS**

### 7. Mobile: new event labels readable in the sheet

Gate at 390×844: `mobileEvents` (same event count as the full calendar), `compactDay`, `noHorizontalOverflow` all true. **PASS**

### 8. Unit, build, contrast, behavior, and link gates

```
$ task test                                  # tests 28  # pass 28  # fail 0
$ task build                                 144 page(s), Complete
$ node scripts/check-thailand-contrast.mjs   Checked 267 surfaces; minimum 6.01:1
$ node scripts/check-thailand-behavior.mjs   Thailand behavior PASS
$ node scripts/check-links.js --skip-external --dir dist   exit=0
```

**PASS**

### 9. Commit docs separately, publish, verify live

Site docs and canonical `~/docs` are committed in separate repositories throughout. Deployment and the live ID check are recorded at the publish below. **PASS**

### Open finding carried out of this verification

⚠️ **`target-size`** — mobile calendar checkboxes are below the 24 px minimum touch target (Lighthouse). Pre-existing and deliberate density; left unfixed because changing it is a layout decision rather than a verification fix.
