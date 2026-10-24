const { test } = require('node:test');
const assert = require('node:assert/strict');
const { create, editorOrigin } = require('./editor-sync.js');
const { fixture } = require('./automation-fixture.cjs');
const { createHash } = require('node:crypto');
const fingerprint = async question => createHash('sha256').update(JSON.stringify(question)).digest('hex');
const question = number => { const page = fixture({ number, revealed: true, expanded: true }); return page.reader.read(page.document, page.state.url); };
async function setup(options = {}) {
  const { importCaptures } = await import('../../tools/question-bank.mjs');
  const stored = { elaSyncEnabled: true, elaQueue: [question(1), question(2)], ...options.stored };
  let bank = { revision: 0, questions: [], sets: [] }, posts = 0;
  const storage = { get: async () => structuredClone(stored), set: async value => { Object.assign(stored, structuredClone(value)); } };
  const fetch = async (path, request = {}) => {
    const reply = (data, ok = true) => ({ ok, json: async () => data });
    if (path === '/api/state') return reply({ editToken: 'local-token', assessments: [] });
    if (path === '/api/question-bank') return reply(bank);
    assert.equal(path, '/api/question-bank/import'); posts++;
    if (options.offline?.()) return reply({ error: 'Editor offline' }, false);
    if (options.staleOnce && posts === 1) return reply({ error: 'The question bank changed in another window. Reload it before saving.' }, false);
    const body = JSON.parse(request.body);
    assert.equal(request.headers['x-editor-token'], 'local-token'); assert.equal(body.revision, bank.revision);
    const imported = importCaptures(bank, body.capture); bank = imported.bank; bank.revision++;
    options.afterPost?.(stored);
    return reply({ bank, summary: { added: imported.added, duplicates: imported.duplicates, enriched: imported.enriched } });
  };
  const engine = create({ storage, fetch, fingerprint, origin: options.origin || 'http://127.0.0.1:4319' });
  return { engine, stored, get bank() { return bank; }, get posts() { return posts; } };
}
test('automatic local sync writes editable drafts and acknowledges only durable imports', async () => {
  const page = await setup(); await page.engine.sync();
  assert.equal(page.bank.questions.length, 2); assert.ok(page.bank.questions.every(q => q.status === 'draft' && q.explanation));
  assert.equal(Object.keys(page.stored.elaSynced).length, 2); assert.equal(page.stored.elaEditorSync.imported, 2);
  await page.engine.sync(); assert.equal(page.posts, 2); assert.equal(page.bank.sets.length, 0);
});
test('offline imports retain the queue and retry without acknowledging missing writes', async () => {
  let offline = true; const page = await setup({ offline: () => offline }); await page.engine.sync();
  assert.equal(page.bank.questions.length, 0); assert.equal(page.stored.elaSynced, undefined); assert.equal(page.stored.elaQueue.length, 2);
  assert.equal(page.stored.elaEditorSync.status, 'error'); offline = false; await page.engine.sync(); assert.equal(page.bank.questions.length, 2);
});
test('stale bank revisions retry against the current bank', async () => {
  const page = await setup({ staleOnce: true }); await page.engine.sync(); assert.equal(page.posts, 3); assert.equal(page.bank.questions.length, 2);
});
test('sync is opt-in and accepts only the local Content Editor origin', async () => {
  for (const origin of ['https://www.shsatlab.com', 'http://localhost:5173', 'http://example.com:4319']) {
    const page = await setup({ origin }); await page.engine.sync(); assert.equal(page.posts, 0);
  }
  const disabled = await setup({ stored: { elaSyncEnabled: false } }); await disabled.engine.sync(); assert.equal(disabled.posts, 0);
  assert.equal(editorOrigin('http://localhost:4319'), true);
});
test('turning sync off stops before importing another queued question', async () => {
  const page = await setup({ afterPost: stored => { stored.elaSyncEnabled = false; } });
  await page.engine.sync(); assert.equal(page.posts, 1); assert.equal(page.stored.elaQueue.length, 2);
});
