const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'math-workflow-'));
const fixture = require('../../tools/math-command-fixture.cjs').install(root);
after(() => fs.rmSync(root, { recursive: true, force: true }));
const { defaultPracticeCatalog, managedGeneratorIds } = require('../src/shared/practiceCatalog.ts');
const { practiceHomeworkContents } = require('../src/lib/infiniteHomeworkCatalog.ts');
const { readGeneratorPlanner, saveGeneratorPlanner } = require('../src/lib/generatorPlanner.ts');
const { generatorBatchExport, plannerEntryIssue } = require('../../client/src/features/math-command/generatorBatchExport.ts');
const { relatedGenerators } = require('../../client/src/features/math-command/relatedGenerators.ts');
const { infiniteAssignmentHref, readInfiniteAssignmentIntent } = require('../../client/src/features/math-command/infiniteAssignmentLink.ts');
const { mathEvidenceFromResults } = require('../src/shared/mathCommandAnalytics.ts');
const { mathStudentInsights, loadMathStudent } = require('../src/lib/mathCommandAnalytics.ts');

test('homework previews describe the published effective mix and exclude hidden or disabled content', () => {
  const catalog = defaultPracticeCatalog();
  catalog.generators[0].enabled = false;
  catalog.modules.push({ ...catalog.modules[0], id: 'hidden-copy', published: false });
  const contents = practiceHomeworkContents(catalog);
  assert.ok(contents.length);
  assert.ok(!contents.some(item => item.id.endsWith('hidden-copy')));
  for (const content of contents) {
    const module = catalog.modules.find(item => `infinite-practice:${item.id}` === content.id);
    assert.equal(content.practiceMode, 'infinite');
    assert.ok(content.generators.length);
    assert.ok(content.generators.every(generator => generator.enabled));
    assert.equal(content.description, module.description);
    assert.deepEqual(content.generators.map(item => item.id), managedGeneratorIds(module, catalog));
  }
});

test('private teaching context persists, is owner-scoped, and never enters the build export', () => {
  const actor = 'context-test', sourceId = fixture.data.questions[0].id;
  let state = readGeneratorPlanner(root, actor);
  const mutate = input => state = saveGeneratorPlanner(root, actor, { ...input, revision: state.revision });
  mutate({ action: 'create', name: 'Generator work' });
  const batchId = state.activeBatchId;
  const context = { rationale: 'PRIVATE_RATIONALE', studentId: 'PRIVATE_STUDENT', evidenceId: 'PRIVATE_RESPONSE', assessment: 'Saved exam', answer: 'B', correctAnswer: 'A' };
  mutate({ action: 'add', batchId, questionIds: [sourceId], contexts: { [sourceId]: context } });
  let batch = state.batches[0];
  assert.deepEqual(batch.entries[0].context, context);
  assert.equal(readGeneratorPlanner(root, 'someone-else').batches.length, 0);
  const catalog = defaultPracticeCatalog(), destination = catalog.modules.find(item => item.category === 'Algebra' && item.topic === 'Inequalities');
  mutate({ action: 'update', batchId, name: batch.name, notes: '', entries: batch.entries.map(entry => ({ ...entry, notes: 'Target sign reversals', destination: { category: destination.category, topic: destination.topic, moduleId: destination.id, moduleTitle: destination.title, group: 'general' } })) });
  batch = state.batches[0];
  const output = generatorBatchExport(batch, batch.entries, catalog, [{ label: 'Algebra', topics: ['Inequalities'] }]);
  for (const value of ['PRIVATE_RATIONALE', 'PRIVATE_STUDENT', 'PRIVATE_RESPONSE', '"context"']) assert.ok(!output.prompt.includes(value));
  assert.match(output.prompt, /Target sign reversals/);
  const before = structuredClone(state);
  assert.throws(() => mutate({ action: 'update', batchId, name: batch.name, notes: '', entries: batch.entries.map(entry => ({ ...entry, context: { rationale: 'x'.repeat(6001) } })) }), /at most/);
  assert.deepEqual(readGeneratorPlanner(root, actor), before);
});

test('planner readiness points to the incomplete field and reuse distinguishes source matches from topic candidates', () => {
  const catalog = defaultPracticeCatalog();
  const exact = catalog.generators[0];
  exact.sourceQuestionIds = ['source-id'];
  const entry = { source: { id: 'source-id', category: exact.category, subcategory: exact.topic }, destination: { category: exact.category, topic: exact.topic, moduleId: '', moduleTitle: '', group: 'general' } };
  const taxonomy = [{ label: exact.category, topics: [exact.topic] }];
  assert.equal(plannerEntryIssue(entry, catalog, taxonomy).field, 'title');
  entry.destination.moduleTitle = 'Focused skill';
  assert.equal(plannerEntryIssue(entry, catalog, taxonomy), null);
  entry.destination.moduleId = 'removed-module';
  assert.equal(plannerEntryIssue(entry, catalog, taxonomy).field, 'module');
  const suggestions = relatedGenerators(entry, catalog);
  assert.equal(suggestions[0].generator.id, exact.id);
  assert.equal(suggestions[0].exact, true);
  assert.ok(suggestions.some(item => !item.exact));
  assert.ok(suggestions.every(item => item.exact || item.generator.topic === exact.topic));
});

test('evidence reports recorded timing only and classification review retains exact source IDs', async () => {
  const result = structuredClone(fixture.db.tables.student_exam_results[0].result);
  result.questionTimes = { [fixture.data.questions[0].id]: 47, [fixture.data.questions[1].id]: -1 };
  const rows = mathEvidenceFromResults(fixture.studentId, [result], [], () => null);
  assert.equal(rows[0].timeSeconds, 47);
  assert.equal(rows[1].timeSeconds, null);
  const data = await loadMathStudent(fixture.users.student);
  data.evidence[0].category = ''; data.evidence[0].subcategory = 'Unclassified';
  const before = structuredClone(data.evidence);
  const insights = mathStudentInsights(fixture.users.student, data);
  assert.equal(insights.classification.responses, 1);
  assert.deepEqual(insights.classification.questionIds, [data.evidence[0].questionId]);
  assert.deepEqual(data.evidence, before);
  assert.equal(insights.student.insightsHref, `/teacher/students?student=${fixture.studentId}`);
});

test('assignment navigation carries student, source and exact module without creating an assignment', () => {
  const intent = { studentId: fixture.studentId, category: 'Arithmetic & Number Sense', topic: 'Fractions & Decimals', moduleId: 'focused-module', generatorId: 'family', questionId: 'source & 1' };
  const href = infiniteAssignmentHref(intent), query = new URL(href, 'http://localhost').search;
  assert.deepEqual(readInfiniteAssignmentIntent(query), intent);
  assert.equal(readInfiniteAssignmentIntent('?workspace=content'), undefined);
  assert.equal(fixture.db.tables.student_assignments.length, 0);
});
