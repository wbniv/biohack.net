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
  for (const marker of ['biohack.thailand.v2.','<details>','data-filter="due-soon"','calendar-dock','calendar-sheet','data-section-link','is-complete','is-partial','is-next']) assert.ok(page.includes(marker), marker);
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
