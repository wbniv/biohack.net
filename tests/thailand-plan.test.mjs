import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tasks, events } from '../src/data/thailand-plan.mjs';

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
    'verify-korea-entry', 'verify-vietnam-entry', 'cat-country-permissions',
    'book-cat-ground-transport', 'reconfirm-bkk-icn', 'reconfirm-icn-dad',
    'reconfirm-return-flight', 'bind-travel-insurance', 'cat-travel-kit',
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
  const korea = tasks.find(item => item.id === 'verify-korea-entry');
  assert.match(korea.action, /visa-free tourist entry/i);
  assert.match(korea.why, /31 December 2026/);

  const vietnam = tasks.find(item => item.id === 'verify-vietnam-entry');
  assert.match(vietnam.action, /evisa\.gov\.vn/);
  assert.match(vietnam.action, /90-day single-entry/);
  assert.match(vietnam.action, /Da Nang International Airport/);
  assert.match(vietnam.action, /six months/);

  const koreaArrival = tasks.find(item => item.id === 'korea-e-arrival-card');
  assert.equal(koreaArrival.due, '2026-10-18');
  assert.deepEqual(koreaArrival.events, ['korea-e-arrival']);
  assert.match(koreaArrival.action, /e-arrivalcard\.go\.kr/);

  const vietnamArrival = tasks.find(item => item.id === 'vietnam-pre-arrival');
  assert.equal(vietnamArrival.due, '2026-11-12');
  assert.deepEqual(vietnamArrival.events, ['vietnam-pre-arrival']);
  assert.match(vietnamArrival.action, /prearrival\.immigration\.gov\.vn/);
});

test('tax filing task states the verified extension deadline and caveat', () => {
  const tax = tasks.find(item => item.id === 'us-tax-filing');
  assert.equal(tax.due, '2026-10-15');
  assert.match(tax.action, /15 October 2026/);
  assert.match(tax.action, /Form 4868/);
  assert.match(tax.action, /Form 2350/);
  assert.match(tax.why, /does not extend the tax-payment deadline/i);
});
