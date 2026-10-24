const { test } = require('node:test');
const assert = require('node:assert/strict');
const { create } = require('./bulk.js');
const { identity } = require('./queue.js');
const { fixture } = require('./automation-fixture.cjs');
function setup(options = {}) {
  const page = fixture(options); let job;
  const engine = create({ controller: page.controller, reader: page.reader, identity, getUrl: () => page.state.url,
    readJob: async () => job, writeJob: async value => { job = structuredClone(value); options.onJob?.(job, page.state); },
    wait: async ms => { page.state.time += ms; }, now: () => page.state.time, newId: () => 'bulk-test' });
  const done = async () => { for (let i = 0; i < 1000 && engine.active; i++) await new Promise(resolve => setImmediate(resolve)); assert.equal(engine.active, false); return job; };
  return { ...page, engine, done, get job() { return job; }, stop() { job.status = 'stopped'; } };
}
test('AFK run captures the requested count, saves before Next, and needs no popup', async () => {
  const page = setup();
  const started = await page.engine.start({ count: 3, allowSubmit: true });
  assert.equal(started.status, 'running');
  const job = await page.done();
  assert.equal(job.status, 'complete'); assert.equal(job.captured, 3); assert.equal(page.state.queue.length, 3);
  assert.equal(page.state.events.filter(event => event === 'submit').length, 3);
  assert.equal(page.state.events.filter(event => event === 'next').length, 2);
  assert.equal(page.state.number, 3);
  for (let i = 0; i < page.state.events.length; i++) if (page.state.events[i] === 'next') assert.ok(page.state.events.slice(0, i).includes('save'));
});
test('Stop after durable capture prevents further submissions or Next clicks', async () => {
  const page = setup({ onJob: job => { if (job.captured === 1) job.status = 'stopped'; } });
  await page.engine.start({ count: 10, allowSubmit: true });
  const job = await page.done(); assert.equal(job.status, 'stopped'); assert.equal(job.captured, 1);
  assert.equal(page.state.events.filter(event => event === 'submit').length, 1); assert.ok(!page.state.events.includes('next'));
});
test('failed durable save stops without Next and keeps recovery content', async () => {
  const page = setup({ failSave: true }); await page.engine.start({ count: 4, allowSubmit: true });
  const job = await page.done(); assert.equal(job.status, 'error'); assert.equal(job.captured, 0);
  assert.ok(job.recovery?.prompt); assert.ok(!page.state.events.includes('next'));
});
test('AFK guard rejects Math, missing consent, invalid limits, and concurrent starts', async () => {
  const page = setup();
  await assert.rejects(page.engine.start({ count: 3 }), /consent/);
  await assert.rejects(page.engine.start({ count: 501, allowSubmit: true }), /1–500/);
  assert.equal(page.state.events.length, 0);
  page.state.url = 'https://www.shsatlab.com/units/unit-17/practice';
  await assert.rejects(page.engine.start({ count: 3, allowSubmit: true }), /English/);
  page.state.url = 'https://www.shsatlab.com/units/unit-1/practice';
  await page.engine.start({ count: 3, allowSubmit: true });
  await assert.rejects(page.engine.start({ count: 2, allowSubmit: true }), /already active/);
  await page.done();
});
test('unavailable Next retains captured work and stops the batch', async () => {
  const page = setup({ noNext: true }); await page.engine.start({ count: 3, allowSubmit: true });
  const job = await page.done(); assert.equal(job.status, 'error'); assert.equal(job.captured, 1); assert.equal(page.state.queue.length, 1);
});
test('same-unit query changes work, while a source-unit change ends the run', async () => {
  const page = setup({ onNext: state => { state.url = 'https://www.shsatlab.com/units/unit-1/practice?q=next'; } });
  await page.engine.start({ count: 2, allowSubmit: true }); assert.equal((await page.done()).status, 'complete');
  const changed = setup({ onJob: (job, state) => { if (job.captured === 1) state.url = 'https://www.shsatlab.com/units/unit-2/practice'; } });
  await changed.engine.start({ count: 3, allowSubmit: true }); assert.equal((await changed.done()).status, 'error'); assert.equal(changed.state.queue.length, 1);
});
