const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { createPlainTextPassage, createProsePassage, createSentenceNumberedPassage, createSourcePassage } = require('../../client/src/content/exams/formatters.ts');
const { buildStudentAnalytics, groupResponseEvidence, sortResponseGroups } = require('../../client/src/lib/studentAnalytics.ts');
const { filterContentInventory, categoryInventory, passageCompletionDate, passageSource } = require('../../client/src/lib/passageOrganization.ts');
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

test('completion filters retain earlier completed work during repeat assignments and include planned/unstarted versions as not done', () => {
  const versions = [
    item('source-a', 'official_handbook', 'Assigned', { hasCompleted: true }),
    item('source-b', 'official_handbook', 'Planned', { hasCompleted: false }),
    item('source-c', 'miscellaneous', 'Completed', { lastCompletedAt: null }),
    item('source-d', 'miscellaneous', 'Never assigned'),
  ];
  assert.deepEqual(filterContentInventory(versions, { ...filters, completion: 'completed' }).map(row => row.content.id), ['source-a', 'source-c']);
  assert.deepEqual(filterContentInventory(versions, { ...filters, completion: 'not_completed' }).map(row => row.content.id), ['source-b', 'source-d']);
  assert.equal(passageSource({ ...versions[0].content, versionLabel: '2020-2021 Form B' }), '2020-2021 Form B');
  assert.equal(passageSource({ ...versions[0].content, versionLabel: 'source-a' }), 'No Data');
  for (const value of [null, undefined, '', 'broken', '2026-02-30']) assert.equal(passageCompletionDate(value), 'No Data');
  assert.equal(passageCompletionDate('2026-10-10'), '2026-10-10');
  assert.equal(passageCompletionDate('2026-10-10T01:00:00Z'), 'Oct 9, 2026');
});

test('completion dates use actual completed records, never assignment/update dates, and tolerate undated history', () => {
  const passage = items[0].content;
  const completed = { id: 'done', contentId: passage.id, kind: 'passage', status: 'completed', createdAt: '2026-09-01', completedAt: '2026-09-03T14:00:00Z' };
  const repeat = { ...completed, id: 'repeat', status: 'assigned', completedAt: null, createdAt: '2026-10-01', assignedAt: '2026-10-01', updatedAt: '2026-10-05' };
  const row = inventory([passage], [completed, repeat], [{ contentId: passage.id, at: '2026-09-08T14:00:00Z', source: 'Saved attempt' }])[0];
  assert.equal(row.status, 'Assigned'); assert.equal(row.hasCompleted, true);
  assert.equal(row.lastCompletedAt, '2026-09-08T14:00:00Z');
  assert.equal(inventory([passage], [repeat], [])[0].lastCompletedAt, null);
  const undated = inventory([passage], [], [{ contentId: passage.id, at: null, source: 'Legacy completion' }])[0];
  assert.equal(undated.hasCompleted, true); assert.equal(undated.lastCompletedAt, null);
});

test('explicit numbering controls skip subheadings and unnumbered paragraphs, and can number a bold body paragraph', () => {
  const richText = '<p>First body paragraph.</p><p data-numbered="false"><strong>Unnumbered caption.</strong></p><h2>E-books can reduce reading comprehension.</h2><p data-numbered="true"><strong>Bold body</strong></p><p>Last body paragraph.</p>';
  for (const formatter of [createSourcePassage, createProsePassage]) {
    const passage = formatter({ id: 'number-control', title: 'Fixture', text: 'Source text', richText, format: 'prose' });
    assert.deepEqual(passage.lines.filter(line => line.lineNumber).map(line => [line.lineNumber, line.text]), [['1', 'First body paragraph.'], ['2', 'Bold body'], ['3', 'Last body paragraph.']]);
    assert.equal(passage.lines.find(line => line.text === 'Unnumbered caption.').lineNumber, undefined);
    assert.equal(passage.lines.find(line => line.text === 'E-books can reduce reading comprehension.').kind, 'heading');
  }
});

test('source paragraph labels do not duplicate number badges, while stored text and meaningful numbers remain intact', () => {
  const passage = createSourcePassage({ id: 'printed-labels', title: 'Fixture', format: 'prose', text: 'Source text', richText: '<p>In 1926 the story begins.</p><h2>Subheading.</h2><p>2 Second paragraph.</p><p>3 Last paragraph.</p>' });
  assert.deepEqual(passage.lines.filter(line => line.lineNumber).map(line => line.lineNumber), ['1', '2', '3']);
  assert.equal(passage.lines.find(line => line.lineNumber === '1').html, 'In 1926 the story begins.');
  const second = passage.lines.find(line => line.lineNumber === '2');
  assert.equal(second.text, '2 Second paragraph.'); assert.equal(second.html, 'Second paragraph.');
});
