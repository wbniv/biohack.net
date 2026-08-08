import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tasks, events, eventSortKey, ladder, closedDays } from '../src/data/thailand-plan.mjs';

const page = await readFile(new URL('../src/pages/thailand.astro', import.meta.url), 'utf8');

test('task and event IDs are explicit and unique', () => {
  assert.equal(new Set(tasks.map(t => t.id)).size, tasks.length);
  assert.equal(new Set(events.map(e => e.id)).size, events.length);
  assert.ok(tasks.length >= 32);
  for (const task of tasks) assert.match(task.id, /^[a-z0-9-]+$/);
});

test('every calendar mapping resolves to a task and event', () => {
  const eventIds = new Set(events.map(e => e.id));
  for (const task of tasks) for (const id of task.events) assert.ok(eventIds.has(id), `${task.id} -> ${id}`);
  for (const event of events) assert.ok(tasks.some(t => t.events.includes(event.id)), event.id);
});

test('native Astro page contains the planned interaction hooks', () => {
  assert.doesNotMatch(page, /\?raw|set:html|mermaid/i);
  for (const marker of ['biohack.thailand.v2.','<details>','data-filter="due-soon"','calendar-dock','mobile-inline-calendar','data-section-link','is-complete','is-partial','is-next']) assert.ok(page.includes(marker), marker);
  for (const outcome of ['Issued','Pending','Refused']) assert.ok(page.includes(outcome));
});

test('read-only hero parameters are semantic metadata, not filter chips', () => {
  assert.match(page, /<dl class="status-row" aria-label="Plan parameters">/);
  assert.doesNotMatch(page, /<div class="status-row"><span>/);
});

test('affordances distinguish metadata, completion, navigation, and disclosure', () => {
  assert.match(page, /class="candidate-context"/);
  assert.match(page, /class="checkbox-control"/);
  assert.match(page, /class="task-copy"/);
  assert.match(page, /aria-controls="sticky-calendar-board"/);
  assert.match(page, /dockToggle\.textContent=collapsed\?'Expand':'Collapse'/);
  assert.doesNotMatch(page, /aria-hidden="true">ⓘ/);
  assert.match(page, /\.task-card \.checkmark\{display:block\}/);
  assert.doesNotMatch(page, />Jump to task<\/a>/);
  assert.match(page, /class="milestone-checkbox" type="checkbox" data-calendar-checkbox/);
  assert.match(page, /class="milestone-jump" data-jump-task/);
});

test('global progress is persistent, display-only, and clears sticky layers', () => {
  assert.match(page, /class="progress-track global-progress"/);
  assert.match(page, /\.global-progress\{position:fixed/);
  assert.match(page, /height:10px/);
  assert.match(page, /linear-gradient\(90deg,#ff6847 0%,#ffb248 48%,#43c6a4 100%\)/);
  assert.match(page, /<dt>Thai study<\/dt><dd>Every visa route<\/dd>/);
});

test('mobile calendar is an inline three-month pager', () => {
  assert.match(page, /class="mobile-calendar-pager"/);
  assert.match(page, /id="calendar-prev" aria-label="Previous months"/);
  assert.match(page, /id="calendar-next" aria-label="Next months"/);
  assert.match(page, /class="mobile-inline-calendar" data-calendar/);
  assert.match(page, /class="mobile-calendar-month"/);
  assert.match(page, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(page, /grid-template-columns:repeat\(6,1fr\)/);
  assert.match(page, /id:'november', label:'November'/);
  assert.match(page, /id:'december', label:'December'/);
  assert.match(page, /index>=windowStart&&index<windowStart\+3/);
  assert.match(page, /box\.indeterminate=partial/);
  assert.match(page, /calendarChecks\.forEach/);
  assert.match(page, /mobileDate\(e\.date, phase\.id\)/);
  assert.equal(page.match(/mobileDate\(e\.date, phase\.id\)/g)?.length, 3);
  assert.doesNotMatch(page, /calendar-sheet|open-calendar|scroll-snap-type:x|mobile-horizontal-calendar/);
});

test('route copy describes the active route without historical exclusions', () => {
  assert.doesNotMatch(page, /Malaysia is not part of this plan/);
});

test('conditional work cannot be reported overdue', () => {
  assert.ok(tasks.filter(t => t.conditional).length >= 3);
  assert.ok(page.includes("c.dataset.conditional!=='true'"));
});

test('operational checklist is complete and avoids physical SIM purchases', () => {
  const ids = [
    'verify-vietnam-entry', 'vietnam-exit-chain',
    'book-cat-ground-transport', 'reconfirm-vn626',
    'reconfirm-return-flight', 'final-return-check', 'bind-travel-insurance', 'cat-travel-kit',
    'duplicate-document-packets', 'verify-money-access', 'choose-asia-connectivity',
    'close-thailand-departure', 'prepare-bangkok-address', 'confirm-tm30',
    'bangkok-arrival-setup'
  ];
  for (const id of ids) {
    const task = tasks.find(item => item.id === id);
    assert.ok(task, id);
    assert.ok(task.events.length, `${id} needs a calendar mapping`);
  }
  const connectivity = tasks.find(item => item.id === 'choose-asia-connectivity');
  assert.match(connectivity.action, /TRUE/i);
  assert.match(connectivity.action, /eSIM/i);
  assert.doesNotMatch(tasks.map(item => item.action).join('\n'), /buy (?:a )?physical SIM/i);
  const housing = tasks.find(item => item.id === 'bangkok-housing-bridge');
  assert.ok(housing);
  assert.match(housing.action, /first week/i);
  assert.match(housing.action, /two months/i);
  assert.match(housing.done, /option|renewal/i);
});

test('border tasks contain the verified official requirements', () => {
  const vietnam = tasks.find(item => item.id === 'verify-vietnam-entry');
  assert.match(vietnam.action, /evisa\.gov\.vn/);
  assert.match(vietnam.action, /90-day single-entry/);
  assert.match(vietnam.action, /Da Nang International Airport/);
  assert.match(vietnam.action, /six months/);

  const quarantine = tasks.find(item => item.id === 'vietnam-exit-chain');
  assert.match(quarantine.action, /RAHO IV/);
  assert.match(quarantine.action, /19:45 arrival/);
  assert.match(quarantine.action, /24 December/);
});

test('tax filing task states the verified extension deadline and caveat', () => {
  const ready = tasks.find(item => item.id === 'us-tax-internal-deadline');
  assert.equal(ready.due, '2026-10-01');
  assert.deepEqual(ready.events, ['us-tax-ready']);
  assert.match(ready.action, /ready to file/i);
  assert.match(ready.action, /Form 4868/);

  const tax = tasks.find(item => item.id === 'us-tax-filing');
  assert.equal(tax.due, '2026-10-15');
  assert.match(tax.action, /15 October 2026/);
  assert.match(tax.action, /Form 2350/);
  assert.match(tax.why, /does not extend the tax-payment deadline/i);
});

test('calendar events run in date order within each phase', () => {
  // Regression: August rendered 15, 15, 10, 21 and Viet Nam put 24 and 26 Nov
  // after the December entries, so the cards could not be read as a sequence.
  for (const phase of new Set(events.map(e => e.phase))) {
    const keys = events.filter(e => e.phase === phase).map(e => eventSortKey(e.date)).filter(k => k !== null);
    const sorted = [...keys].sort((a, b) => a - b);
    assert.deepEqual(keys, sorted, `${phase} is out of date order: ${keys.join(', ')}`);
  }
});

test('eventSortKey parses dated labels and refuses relative ones', () => {
  assert.equal(eventSortKey('15 Aug'), 815);
  assert.equal(eventSortKey('~24 Aug'), 824);
  assert.equal(eventSortKey('1 Nov'), 1101);
  for (const relative of ['Arrival', 'Within 48h', 'Day 45', 'Decision', 'Trigger', 'Last week Dec'])
    assert.equal(eventSortKey(relative), null, relative);
});

test('the fixed December return milestones stay in order', () => {
  const vn = events.filter(e => e.phase === 'vietnam').map(e => e.date);
  assert.ok(vn.indexOf('10 Dec') < vn.indexOf('21 Dec'), 'booking should precede 72-hour check');
  assert.ok(vn.indexOf('21 Dec') < vn.indexOf('23 Dec'), '72-hour check should precede 24-hour check');
  assert.ok(vn.indexOf('23 Dec') < vn.indexOf('24 Dec'), '24-hour check should precede return');
});

test('the departure comparison contains the direct plan and optional Korea route', () => {
  const ids = new Set(ladder.map(r => r.id));
  const eventIds = new Set(events.map(e => e.id));
  for (const rung of ladder) {
    assert.notEqual(rung.fallbackOf, rung.id, `${rung.id} is its own fallback`);
    if (rung.fallbackOf !== null) assert.ok(ids.has(rung.fallbackOf), `${rung.id} -> unknown rung ${rung.fallbackOf}`);
    if (rung.event) assert.ok(eventIds.has(rung.event), `${rung.id} -> unknown event ${rung.event}`);
  }
  assert.deepEqual(ladder.map(r => r.id), ['direct-vietnam', 'korea-option']);
  assert.equal(ladder[0].event, 'depart');
  assert.equal(ladder[1].contingency, 'fallback');
  assert.equal(ladder.some(r => r.contingency === 'dead-end'), false);
});

test('closed AQS days are real dates inside departure week', () => {
  assert.ok(closedDays.length >= 3);
  for (const d of closedDays) {
    assert.match(d.date, /^2026-10-\d{2}$/, d.date);
    assert.ok(d.why && d.label, `${d.date} needs a label and a reason`);
  }
  // the tax line itself must be listed, since it is the one people assume is usable
  assert.ok(closedDays.some(d => d.date === '2026-10-23'), '23 Oct (Chulalongkorn Day) missing');
});
