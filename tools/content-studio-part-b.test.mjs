import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, basename } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import PartBBank from './part-b-bank.cjs';
import { documentDraftStore } from './document-drafts.mjs';

const source = await readFile(new URL('./content-studio-part-b.js', import.meta.url), 'utf8');
const documents = await readFile(new URL('./content-studio-documents.js', import.meta.url), 'utf8');
const fixture = () => ({ revision: 8, entries: [{
  id: 'import-prestige', kind: 'standalone', status: 'draft',
  content: { title: 'Independent English questions', source: { sourceFamily: 'sat_crash_course', label: 'Digital SHSAT Practice Test Adaptive 10' }, questions: [
    { id: 'q47', type: 'transition_drop', prompt: 'Correct the comma splice.', dragDropContent: ['The bus arrived ', { slotId: 'slot-1' }, ' we left.'], dragDropSlots: [{ id: 'slot-1', correctItemId: 'A' }], choices: [{ id: 'A', text: 'and' }], source: { sourceQuestion: '47' } },
    { id: 'q49', type: 'inline_dropdown', prompt: 'Correct the verb tense.', dropdowns: [{ id: 'blank-1', correctChoiceId: 'B', choices: [{ id: 'B', text: 'went' }] }], source: { sourceQuestion: '49' } },
  ] },
}] });
function setup(state = fixture()) {
  const app = { state: { assessments: [{ title: 'Digital SHSAT Practice Test Adaptive 10 (Hard)', examLabel: 'Prestige' }], standaloneItems: [] }, standaloneDirty: false };
  const messages = [], dialog = { open: false, showModal() { this.open = true; } };
  const context = vm.createContext({ app, PartBBank, studioUI: { syncSaveState() {} }, clone: structuredClone, api: async () => structuredClone(state), confirmStandaloneDiscard: () => true, renderStandaloneList() {}, renderStandaloneEditor() {}, setStatus: message => messages.push(message), document: { querySelector: () => dialog } });
  const partB = vm.runInContext(source + '\nPartBImport;', context);
  const studio = vm.runInContext(documents + '\nDocumentStudio;', context);
  studio.render = () => {};
  return { partB, workspace: vm.runInContext('PartBWorkspace', context), studio, app, context, messages, dialog };
}

test('document-import stand-alone drafts appear individually with source and Prestige search labels without copying storage', async () => {
  const state = fixture();
  state.entries.push({ ...structuredClone(state.entries[0]), id: 'published', status: 'published' });
  state.entries.push({ ...structuredClone(state.entries[0]), id: 'passage', kind: 'passage' });
  const before = JSON.stringify(state);
  const { partB } = setup(state);
  await partB.refreshDocuments();
  const records = partB.documentRecords();
  assert.equal(records.length, 2);
  assert.deepEqual(Array.from(records, q => q.id), ['q47', 'q49']);
  assert.deepEqual(Array.from(partB.sourceLabels(records[0])), ['Digital SHSAT Practice Test Adaptive 10', 'Prestige', 'SAT Crash Course']);
  assert.equal(records[0].documentDraftId, 'import-prestige');
  assert.equal(records[0].dragDropSlots[0].correctItemId, 'A');
  assert.equal(records[1].dropdowns[0].correctChoiceId, 'B');
  assert.equal(JSON.stringify(state), before);
});

test('Part B opens the selected TEI in the review editor using the current revision and preserves all sibling questions', async () => {
  const { partB, app, dialog } = setup();
  await partB.selectDocument('import-prestige', 'q49');
  const studio = partB.documentBase;
  assert.equal(app.standaloneDraft.type, 'inline_dropdown');
  assert.equal(app.standaloneDraft.documentDraftId, 'import-prestige');
  assert.equal(app.standaloneDraft.id, 'q49');
  assert.equal(studio.revision, 8);
  assert.equal(studio.entry.content.questions.length, 2);
  assert.equal(dialog.open, false);
  assert.equal(app.standaloneDirty, false);
});

test('saving a document draft refreshes Part B without changing TEI data or writing to the published bank', async () => {
  const root = await mkdtemp(join(tmpdir(), 'part-b-documents-'));
  try {
    const store = documentDraftStore(root);
    const state = fixture();
    // Seed the actual draft store with a non-publishing write.
    const { mkdir, writeFile } = await import('node:fs/promises');
    await mkdir(join(root, 'tools', '.content-drafts'), { recursive: true });
    await writeFile(join(root, 'tools', '.content-drafts', 'document-imports.json'), JSON.stringify(state));
    const { partB, workspace, app, context } = setup(state);
    await partB.selectDocument('import-prestige', 'q49');
    const studio = partB.documentBase;
    const original = structuredClone(studio.entry.content.questions[0]);
    app.standaloneDraft.prompt = 'Reviewed verb tense prompt.';
    app.passageDraft = { partBEditor: true, questions: [app.standaloneDraft], text: 'Own paragraph.', richText: '<p>Own paragraph.</p>' };
    context.api = async (path, options) => { assert.equal(path, '/api/document-drafts'); return store.save(JSON.parse(options.body)); };
    await workspace.save();
    const saved = await store.read();
    assert.equal(saved.revision, 9);
    assert.equal(app.standaloneDraft.prompt, 'Reviewed verb tense prompt.');
    assert.deepEqual(saved.entries[0].content.questions[0], original);
    assert.equal(saved.entries[0].content.questions[1].dropdowns[0].correctChoiceId, 'B');
    assert.equal(saved.entries[0].status, 'draft');
    assert.equal(app.state.standaloneItems.length, 0);
    await assert.rejects(store.save({ revision: 8, entry: studio.entry }), /changed/);
  } finally {
    assert.equal(dirname(root), tmpdir());
    assert.ok(basename(root).startsWith('part-b-documents-'));
    await rm(root, { recursive: true, force: true });
  }
});

test('a failed draft load retains the last good library and exposes an error instead of pretending there are no drafts', async () => {
  const { partB, context } = setup();
  await partB.refreshDocuments();
  context.api = async () => { throw new Error('Network unavailable'); };
  await partB.refreshDocuments();
  assert.equal(partB.documentRecords().length, 2);
  assert.match(partB.documentError, /Network unavailable/);
});
