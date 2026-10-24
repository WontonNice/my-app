const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { fixture } = require('./automation-fixture.cjs');
const reader = require('./reader.js');
const queueApi = require('./queue.js');

async function popup({ url = 'https://www.shsatlab.com/units/unit-1/practice', result, savedQueue = [] } = {}) {
  const elements = Object.fromEntries(['page', 'capture', 'count', 'ready', 'download', 'copy', 'copy-open', 'clear', 'automation', 'allow-submit', 'reveal', 'capture-next', 'all-queue', 'status', 'bulk-start', 'bulk-stop', 'bulk-count', 'bulk-delay', 'bulk-sync', 'bulk-progress', 'sync-progress'].map(id => [id, { checked: ['all-queue', 'bulk-sync'].includes(id), disabled: true, value: id === 'bulk-count' ? '50' : id === 'bulk-delay' ? '1.5' : '', listeners: {}, addEventListener(event, fn) { this.listeners[event] = fn; }, focus() {}, select() {} }]));
  const state = { queue: savedQueue, messages: [], clipboard: '', opened: [], stored: {} };
  const context = { document: { getElementById: id => elements[id] }, NathanLabElaReader: reader, NathanLabElaQueue: queueApi,
    chrome: { tabs: { create: async input => state.opened.push(input), query: async () => [{ id: 4, url }], sendMessage: async (_id, message) => { state.messages.push(message); if (result?.saved) state.queue = [result.question]; if (result?.job) state.stored.elaBulkJob = result.job; return result; } }, storage: { local: { get: async () => ({ elaQueue: state.queue, ...state.stored }), set: async values => { Object.assign(state.stored, values); if ('elaQueue' in values) state.queue = values.elaQueue; } }, onChanged: { addListener() {} } } },
    navigator: { clipboard: { writeText: async text => { state.clipboard = text; } } }, confirm: () => true, setTimeout, URL, Blob
  };
  vm.runInNewContext(fs.readFileSync(`${__dirname}/popup.js`, 'utf8'), context);
  await new Promise(resolve => setImmediate(resolve));
  const click = async id => { if (!elements[id].disabled) await elements[id].listeners.click(); };
  const consent = async () => { elements['allow-submit'].checked = true; await elements['allow-submit'].listeners.change(); };
  return { elements, state, click, consent };
}
test('popup consent defaults off; ready JSON updates and retains captured item after Next', async () => {
  const { reader, document } = fixture({ revealed: true, expanded: true }); const question = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice');
  const { elements, state, click, consent } = await popup({ result: { question, saved: true, advanced: true } });
  assert.equal(elements['allow-submit'].checked, false); assert.equal(elements['capture-next'].disabled, true);
  await consent(); await click('capture-next');
  assert.equal(state.messages[0].allowSubmit, true); assert.equal(state.messages[0].advance, true);
  const json = JSON.parse(elements.ready.value); assert.equal(json.format, 'nathan-tutors-shsatlab-ela-v1'); assert.equal(json.questions[0].correctChoiceId, 'B'); assert.match(elements.status.textContent, /Next question is ready/);
  await click('copy'); assert.equal(state.clipboard, elements.ready.value);
});
test('Math popup hides auto-controls and never sends capture messages; saved ELA can still be copied', async () => {
  const { reader, document } = fixture({ revealed: true, expanded: true }); const question = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice');
  const { elements, state, click } = await popup({ url: 'https://www.shsatlab.com/units/unit-17/practice', savedQueue: [question] });
  assert.equal(elements.automation.hidden, true); assert.equal(elements.capture.disabled, true);
  await click('capture'); assert.equal(state.messages.length, 0); assert.equal(elements.copy.disabled, false);
});
test('save failure exposes recovery item in ready text without pretending it is in saved queue', async () => {
  const { reader, document } = fixture({ revealed: true, expanded: true }); const question = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice');
  const { elements, state, click, consent } = await popup({ result: { question, error: 'Storage failed; source NOT advanced.', saved: false } });
  await consent(); await click('capture-next');
  assert.equal(state.queue.length, 0); assert.equal(JSON.parse(elements.ready.value).questions[0].correctChoiceId, 'B'); assert.match(elements.count.textContent, /0 saved/); assert.equal(elements.copy.disabled, false); assert.equal(elements.download.disabled, true);
});
test('manual capture does not grant submission consent and latest-only text remains valid JSON', async () => {
  const { reader, document } = fixture(); const question = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice');
  const { elements, state, click } = await popup({ result: { question, saved: true } });
  await click('capture'); assert.equal(state.messages[0].allowSubmit, false); assert.equal(state.messages[0].reveal, false);
  elements['all-queue'].checked = false; elements['all-queue'].listeners.change();
  assert.equal(JSON.parse(elements.ready.value).questions.length, 1); assert.match(elements.status.textContent, /draft/);
});
test('copy and open transfers the selected queue through clipboard, never the URL or a remote request', async () => {
  const { reader, document } = fixture({ revealed: true, expanded: true }); const question = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice');
  const { elements, state, click } = await popup({ savedQueue: [question] });
  await click('copy-open');
  assert.equal(JSON.parse(state.clipboard).questions.length, 1); assert.equal(state.opened[0].url, 'http://127.0.0.1:4319/?bankImport=1#question-bank'); assert.equal(state.messages.length, 0); assert.match(elements.status.textContent, /Paste from clipboard/);
});

test('AFK Start requires consent, opens the local editor, and Stop disables further capture', async () => {
  const job = { id: 'job', status: 'running', captured: 0, target: 50, newQuestions: 0, duplicates: 0, message: 'Starting capture' };
  const { elements, state, click, consent } = await popup({ result: { job } });
  await click('bulk-start'); assert.equal(state.messages.length, 0);
  await consent(); await click('bulk-start');
  assert.equal(state.messages[0].type, 'NATHAN_START_ELA_BULK'); assert.equal(state.messages[0].allowSubmit, true);
  assert.equal(state.messages[0].count, 50); assert.equal(state.messages[0].delayMs, 1500);
  assert.equal(state.opened[0].url, 'http://127.0.0.1:4319/#question-bank'); assert.equal(state.opened[0].active, false);
  assert.equal(elements['capture-next'].disabled, true); assert.equal(elements['bulk-stop'].disabled, false);
  await click('bulk-stop'); assert.equal(state.stored.elaBulkJob.status, 'stopped');
  assert.equal(elements['bulk-stop'].disabled, true);
});
test('invalid AFK limits do not open an editor tab or start source actions', async () => {
  const { elements, state, click, consent } = await popup(); await consent();
  elements['bulk-count'].value = '501'; await click('bulk-start');
  assert.equal(state.messages.length, 0); assert.equal(state.opened.length, 0); assert.match(elements.status.textContent, /1–500/);
});
