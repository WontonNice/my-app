const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const bank = require('./part-b-bank.cjs');
const question = (id, extra = {}) => ({ id, type: 'multiple_choice', prompt: 'Which edit corrects the sentence?', stimulus: 'In 1962 the agile athletic player scored 100 points.', stimulusHtml: 'In 1962 the <u>agile</u> athletic player scored 100 points.', choices: [{ id: 'A', text: 'Insert a comma after agile' }, { id: 'B', text: 'Insert a comma after player.' }], correctChoiceId: 'A', points: 1, ...extra });

test('source tags accept legacy labels, preserve order and deduplicate without preventing removal of the last tag', () => {
  assert.deepEqual(bank.labels({ versionLabel: ' 2020-2021 Form A ' }), ['2020-2021 Form A']);
  assert.deepEqual(bank.labels({ versionLabels: [' Form A ', 'form a', '', 'Form B', null] }), ['Form A', 'Form B']);
  assert.deepEqual(bank.withLabels({ versionLabel: 'Old' }, []), { versionLabel: '', versionLabels: [] });
});

test('repeat detection handles source formatting and missing terminal punctuation in comma-edit labels', () => {
  const a = question('a'), b = question('b', { versionLabels: ['Another test'], stimulusHtml: `<p>${a.stimulusHtml}</p>`, explanation: 'Source explanation', topic: 'Punctuation' });
  b.choices = [{ id: 'E', html: 'Insert a comma after <strong><em>agile</em></strong>.', text: 'Insert a comma after agile.' }, { id: 'F', text: 'Insert a comma after player.' }]; b.correctChoiceId = 'E';
  assert.equal(bank.match(a, b).canCombine, true);
  assert.equal(bank.pairs([a, b]).length, 1);
});

test('generic prompts, changed tasks, conflicting keys, missing keys, emphasis targets and meaningful punctuation cannot auto-combine', () => {
  const a = question('a');
  assert.equal(bank.match(a, question('b', { stimulus: 'Unrelated sentence.', stimulusHtml: '' })), null);
  assert.equal(bank.match(a, question('b', { prompt: 'What does this sentence mean?' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { correctChoiceId: 'B' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { correctChoiceId: '' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { stimulusHtml: 'In 1962 the agile <u>athletic</u> player scored 100 points.' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { stimulusHtml: a.stimulusHtml + '<img src="/exam-images/a.png">' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { points: 2 })).canCombine, false);
  assert.equal(bank.match(question('a', { choices: [{ id: 'A', text: 'Stop.' }] }), question('b', { choices: [{ id: 'A', text: 'Stop' }] })).canCombine, false);
  assert.equal(bank.match(question('a', { stimulus: '', stimulusHtml: '' }), question('b', { stimulus: '', stimulusHtml: '' })), null);
});

test('combining produces one bank question with both source tags while preserving source versions and test references', () => {
  const a = question('old', { versionLabel: '2020-2021 Form A' });
  const b = question('new', { versionLabel: '2022-2023 Form A', explanation: 'Supplied explanation.', explanationHtml: '<strong>Supplied</strong> explanation.' });
  const original = structuredClone([a, b]);
  const items = bank.combine([a, b], b.id, a.id);
  assert.deepEqual([a, b], original);
  assert.deepEqual(items.find(q => q.id === a.id), { ...a, duplicateOf: b.id });
  const primary = items.find(q => !q.duplicateOf);
  assert.deepEqual(primary.versionLabels, ['2022-2023 Form A', '2020-2021 Form A']);
  assert.equal(primary.explanationHtml, b.explanationHtml);
  assert.equal(bank.pairs(items).length, 0);
  assert.deepEqual(bank.usage(primary, items, [{ assessmentId: 'a', title: 'Actual exam', standaloneItemIds: ['old'] }, { assessmentId: 'b', title: 'Tag only', standaloneItemIds: [] }]), [{ id: 'a', title: 'Actual exam' }]);
  assert.equal(bank.versions(primary, items).length, 2);
  assert.throws(() => bank.combine(items, a.id, b.id), /current bank/);
  assert.throws(() => bank.combine([a, question('conflict', { correctChoiceId: 'B' })], a.id, 'conflict'), /differ/);
});

test('Wilt Chamberlain has one primary record and two source tags; student lookups retain both source IDs without teacher metadata', () => {
  const source = fs.readFileSync(path.join(__dirname, '../client/src/content/exams/standaloneItems.ts'), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {}; vm.runInNewContext(output, { exports });
  const copies = exports.standaloneItems.filter(q => q.stimulus.includes('Wilt Chamberlain'));
  assert.equal(copies.length, 2); assert.equal(copies.filter(q => !q.duplicateOf).length, 1);
  assert.deepEqual(Array.from(bank.labels(copies.find(q => !q.duplicateOf))).sort(), ['2020-2021 Form A', '2022-2023 Form A']);
  const students = exports.getStandaloneItemsById(copies.map(q => q.id));
  for (const [i, q] of students.entries()) {
    assert.equal(q.id, copies[i].id); assert.equal(q.correctChoiceId, 'A');
    assert.equal(q.stimulusHtml, copies[i].stimulusHtml); assert.equal(q.choices[0].html, copies[i].choices[0].html);
    assert.equal(q.versionLabels, undefined); assert.equal(q.versionLabel, undefined); assert.equal(q.duplicateOf, undefined);
  }
});

test('tag edits and failed combines preserve question content, dirty edits and editor usability', async () => {
  const source = fs.readFileSync(path.join(__dirname, 'content-studio-part-b-tools.js'), 'utf8');
  const original = question('q1'), editor = { inert: false, querySelector: () => ({ textContent: '' }) };
  const app = { standaloneDraft: original, standaloneDirty: false, state: { standaloneSourceHash: 'current' } };
  let calls = 0;
  const ui = vm.runInNewContext(source + '\nPartBTools;', { app, PartBBank: bank, document: { getElementById: () => editor }, markStandaloneDirty() { app.standaloneDirty = true; }, window: { confirm: () => true }, studioUI: { syncSaveState() {} }, api: async (url, options) => { calls++; assert.equal(url, '/api/standalone-items/combine'); assert.equal(JSON.parse(options.body).sourceHash, 'current'); throw new Error('Bank changed'); } });
  ui.renderTags = () => {}; ui.renderSummary = () => {};
  ui.setTags(['Form A', 'Form B']);
  assert.equal(app.standaloneDraft.correctChoiceId, 'A'); assert.equal(app.standaloneDraft.stimulusHtml, original.stimulusHtml); assert.equal(app.standaloneDirty, true);
  await ui.combine(original, question('q2')); assert.equal(calls, 0);
  app.standaloneDirty = false;
  await ui.combine(original, question('q2')); assert.equal(calls, 1);
  assert.equal(app.standaloneDraft, original); assert.equal(editor.inert, false); assert.equal(app.saving, false);
});
