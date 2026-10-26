import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

test('returning to Exam Builder indexes newly published Prestige passages without resetting an unsaved exam or search', async () => {
  const draft = { assessmentId: 'exam', readingPassageIds: ['existing', 'unsaved-choice'], revisingEditingPartAPassageIds: [], standaloneItemIds: [], sourceHash: 'original-source' };
  const app = { testDraft: draft, testDirty: true, selectedAssessmentId: 'exam', state: { assessments: [{id: 'exam'}], passages: [{id: 'existing', title: 'Existing passage'}] } };
  const renders = [], selections = [];
  const workspace = vm.runInNewContext(`${await readFile(new URL('./content-studio-workspace.js', import.meta.url), 'utf8')}\nstudioUI;`, {
    app, URL,
    document: { querySelectorAll: () => [], body: {dataset: {}, classList: {remove() {}}}, getElementById: () => null },
    setStatus() {},
    renderTestBuilder: () => renders.push(app.state.passages.map(p => ({...p}))),
    selectAssessment: id => selections.push(id),
  });
  workspace.syncSaveState = () => {};
  workspace.filters.set('test-passages', 'New Prestige');
  workspace.testSection = '1';
  workspace.activateWorkspace('tests');
  workspace.activateWorkspace('passages');
  // Publication calls reloadState: the destination list is replaced, rather than mutated.
  app.state = { ...app.state, passages: [...app.state.passages, {id: 'new-prestige', title: 'New Prestige passage', passageCategory: 'prestige'}] };
  workspace.activateWorkspace('tests');
  assert.equal(renders.length, 2);
  assert.equal(renders[0].some(p => p.id === 'new-prestige'), false);
  assert.equal(renders[1].find(p => p.id === 'new-prestige').passageCategory, 'prestige');
  assert.equal(app.testDraft, draft);
  assert.deepEqual(app.testDraft.readingPassageIds, ['existing', 'unsaved-choice']);
  assert.equal(app.testDirty, true);
  assert.equal(app.selectedAssessmentId, 'exam');
  assert.equal(workspace.filters.get('test-passages'), 'New Prestige');
  assert.equal(workspace.testSection, '1');
  assert.deepEqual(selections, []);
  // The original first-entry selection still runs when no exam has been opened.
  app.testDraft = null;
  workspace.readPreference = () => 'exam';
  workspace.activateWorkspace('tests');
  assert.deepEqual(selections, ['exam']);
});
