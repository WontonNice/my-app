const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
function stub(relative, exports) { const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports }; }
stub('../src/lib/supabase.ts', { supabase: {} });
stub('../src/lib/questionBank.ts', { readQuestionBank: () => ({ questions: [], sets: [] }) });
const assessments = require('../data/assessments.json');
stub('../src/config/assessments.ts', { listTeacherAssessments: () => assessments });
const { learningCatalog } = require('../src/lib/learningPlanStore.ts');
const { inventory } = require('../src/shared/learningPlan.ts');
const { filterContentInventory } = require('../../client/src/lib/passageOrganization.ts');
const { passageFamilies } = require('../../client/src/lib/passageFamilies.ts');
const exams = require('../data/exam-content.json');
const filters = { kind: 'passage', category: '', genre: '', subject: 'English', skill: '', search: '', status: '', sort: 'title', direction: 'asc' };
const catalog = learningCatalog();
const rows = inventory(catalog, [], []);
const find = search => filterContentInventory(rows, { ...filters, search });

test('2020-2021 Form A returns all seven passages, including both English section types', () => {
  for (const search of ['2020-2021 form a', '2020–2021 Form A', '2020 — 2021 FORM A']) {
    const found = find(search);
    assert.equal(found.length, 7);
    assert.equal(passageFamilies(found).length, 7);
    for (const set of exams['2020-2021-form-a'].passageSets) {
      assert.ok(found.some(row => row.content.aliases.includes(set.id)), `Missing ${set.passage.title}`);
    }
    assert.deepEqual([...new Set(found.map(row => row.content.passageSection))].sort(), ['reading', 'revising_editing_a']);
  }
});

test('searching each configured exam finds every passage actually assigned to it', () => {
  let checkedExams = 0, checkedPassages = 0;
  for (const exam of assessments) {
    const sets = exams[exam.id]?.passageSets ?? [];
    if (!sets.length) continue;
    checkedExams++;
    const found = find(exam.title);
    for (const set of sets) {
      checkedPassages++;
      assert.ok(found.some(row => row.content.aliases.includes(set.id) || row.content.id === set.passage.id), `${exam.title}: missing ${set.passage.title}`);
    }
  }
  assert.ok(checkedExams > 20);
  console.log(`Audited ${checkedPassages} passage placements across ${checkedExams} exams.`);
});

test('exam membership stays exact for reused passages and never fans out to sibling versions', () => {
  for (const item of catalog.filter(item => item.kind === 'passage')) {
    const expected = assessments.filter(exam => (exams[exam.id]?.passageSets ?? []).some(set => item.id === set.passage.id || item.aliases.includes(set.id) || item.aliases.includes(set.passage.id))).map(exam => exam.title);
    assert.deepEqual(item.examLabels, [...new Set(expected)], item.id);
  }
  const reused = catalog.find(item => item.id === 'massachusetts');
  assert.ok(reused.examLabels.includes('2021-2022 Form A'));
  assert.equal(reused.versionLabel, '2025-2026 Form A');
  assert.equal(filterContentInventory(rows, { ...filters, search: '2020-2021 form a', completion: 'completed' }).length, 0, 'Search must still respect other filters');
});
