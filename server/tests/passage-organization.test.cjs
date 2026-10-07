const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { createPlainTextPassage, createProsePassage, createSentenceNumberedPassage } = require('../../client/src/content/exams/formatters.ts');
const { buildStudentAnalytics, groupResponseEvidence, sortResponseGroups } = require('../../client/src/lib/studentAnalytics.ts');
const { filterContentInventory, categoryInventory } = require('../../client/src/lib/passageOrganization.ts');
const { inventory } = require('../src/shared/learningPlan.ts');

test('all passage formats preserve source category and version without changing lines', () => {
  for (const formatter of [createPlainTextPassage, createProsePassage, createSentenceNumberedPassage]) {
    const input = { id: 'fixture', title: 'Fixture', text: 'First line.\n    Indented line.\n\nLast paragraph.', passageType: 'poem' };
    const old = formatter(input), classified = formatter({ ...input, passageCategory: 'official_handbook', versionLabel: '2020-2021 Form B' });
    assert.equal(old.passageCategory, 'miscellaneous');
    assert.equal(classified.passageCategory, 'official_handbook');
    assert.equal(classified.versionLabel, '2020-2021 Form B');
    assert.deepEqual(old.lines, classified.lines);
  }
});
const content = (id, category, title = id) => ({ id, title, passageCategory: category, kind: 'passage', subject: 'English', category: 'Poem', skills: ['Inference'], aliases: [id], questionCount: 3, href: '/' });
const item = (id, category, status, extra = {}) => ({ content: content(id, category), status, lastActivity: null, dueDate: null, plannedDate: null, assignmentCount: 0, priorCount: 0, ...extra });
const items = [item('Fire A', 'official_handbook', 'Never assigned'), item('Fire B', 'official_handbook', 'Completed'), item('Fire C', 'prestige', 'Never assigned'), item('Snow', 'miscellaneous', 'Completed')];
const filters = { kind: 'passage', category: '', genre: '', subject: '', skill: '', search: '', status: '', sort: 'title', direction: 'asc' };
test('source, genre, subject, status, skill and search filters combine per student', () => {
  assert.deepEqual(filterContentInventory(items, { ...filters, subject: 'English', category: 'official_handbook', genre: 'Poem', status: 'Never assigned', search: 'fire', skill: 'Inference' }).map(row => row.content.id), ['Fire A']);
  assert.deepEqual(filterContentInventory(items, { ...filters, category: 'prestige', status: 'Never assigned' }).map(row => row.content.id), ['Fire C']);
  assert.deepEqual(filterContentInventory(items, { ...filters, category: 'miscellaneous', status: 'Completed' }).map(row => row.content.id), ['Snow']);
  assert.equal(filterContentInventory(items, { ...filters, category: 'prestige', status: 'Completed' }).length, 0);
  assert.deepEqual(filterContentInventory(items, { ...filters, direction: 'desc' }).map(row => row.content.id), ['Snow', 'Fire C', 'Fire B', 'Fire A']);
});
test('inventory counts distinct sources and historical completion independently of repeat state', () => {
  const counts = categoryInventory([...items, item('Repeat', 'official_handbook', 'Assigned', { hasCompleted: true, hasBeenAssigned: true }), item('Reserve', 'prestige', 'Planned', { hasCompleted: false, hasBeenAssigned: false })]);
  assert.deepEqual(counts.map(row => [row.value, row.remaining, row.completed, row.used, row.planned]), [['official_handbook', 1, 2, 2, 0], ['prestige', 1, 0, 0, 1], ['miscellaneous', 0, 1, 1, 0]]);
  const completed = { id: 'task', contentId: 'Fire A', kind: 'passage', assignedAt: '2026-09-01', completedAt: '2026-09-02', createdAt: '2026-09-01', updatedAt: '2026-09-02', status: 'completed' };
  const original = inventory([items[0].content], [completed], [])[0];
  const anotherStudent = inventory([items[0].content], [], [])[0];
  assert.equal(original.status, 'Completed'); assert.equal(original.hasCompleted, true);
  assert.equal(anotherStudent.status, 'Never assigned'); assert.equal(anotherStudent.content.passageCategory, original.content.passageCategory);
});
function evidence(id, category, status, examKey, date = null, section = 'english') {
  return { passage: id ? { id, title: id.startsWith('same') ? 'Same title' : id, passageCategory: category } : undefined, question: { type: 'multiple_choice', topic: 'Inference' }, status, section, date, examKey };
}
const responses = [evidence('same-a', 'official_handbook', 'Correct', 'exam1', '2026-09-01'), evidence('same-a', 'official_handbook', 'Incorrect', 'exam2', '2026-09-02'), evidence('same-b', 'prestige', 'Unanswered', 'exam1'), evidence('same-b', 'prestige', 'Incorrect', 'exam1'), evidence('other', 'miscellaneous', 'Correct', 'exam3', '2026-09-03'), evidence(null, null, 'Incorrect', 'exam3', null, 'math')];
test('category aggregation retains exact metrics, distinct IDs, dates and assessment sets', () => {
  const passages = groupResponseEvidence(responses, 'passage');
  assert.equal(passages.length, 3);
  const official = groupResponseEvidence(responses, 'category').find(row => row.key === 'official_handbook');
  assert.deepEqual([official.correct, official.total, official.incorrect, official.unanswered, official.assessments.size, official.lastAttempt], [1, 2, 1, 0, 2, '2026-09-02']);
  assert.equal(groupResponseEvidence(responses, 'type')[0].total, 6);
  assert.equal(groupResponseEvidence(responses, 'skill').length, 2);
});
test('all pattern sort fields support both directions with deterministic ties and missing dates last', () => {
  const groups = groupResponseEvidence(responses, 'passage');
  for (const field of ['accuracy', 'correct', 'total', 'incorrect', 'unanswered', 'assessments', 'title', 'category', 'lastAttempt']) {
    const asc = sortResponseGroups(groups, field, 'asc'), desc = sortResponseGroups(groups, field, 'desc');
    assert.equal(asc.length, 3); assert.equal(desc.length, 3);
    assert.deepEqual(asc.map(row => row.key).sort(), ['other', 'same-a', 'same-b']);
  }
  assert.equal(sortResponseGroups(groups, 'accuracy', 'asc')[0].key, 'same-b');
  assert.equal(sortResponseGroups(groups, 'accuracy', 'desc')[0].key, 'other');
  assert.equal(sortResponseGroups(groups, 'unanswered', 'desc')[0].key, 'same-b');
  assert.equal(sortResponseGroups(groups, 'assessments', 'desc')[0].key, 'same-a');
  assert.equal(sortResponseGroups(groups, 'lastAttempt', 'asc').at(-1).key, 'same-b');
  assert.equal(sortResponseGroups(groups, 'lastAttempt', 'desc').at(-1).key, 'same-b');
  for (const field of ['correct', 'total', 'incorrect', 'unanswered', 'assessments']) {
    for (const direction of ['asc', 'desc']) {
      const sorted = sortResponseGroups(groups, field, direction);
      const values = sorted.map(group => field === 'assessments' ? group.assessments.size : group[field]);
      for (let i = 1; i < values.length; i++) assert.ok(direction === 'asc' ? values[i - 1] <= values[i] : values[i - 1] >= values[i], `${field} ${direction}`);
    }
  }
});
test('summary-only assessments never invent passage or category response performance', () => {
  const data = buildStudentAnalytics([{ result: { source: 'manual', answers: {}, correct: 8, total: 10 }, subjects: [], passages: [] }]);
  assert.equal(groupResponseEvidence(data.evidence, 'category').length, 0);
});
