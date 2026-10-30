// Contract rehearsal only: current authored passages plus entirely synthetic
// attempts. This is not a database migration and never reads student records.
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { buildStudentAnalytics } = require('../client/src/lib/studentAnalytics.ts');
const { createExamResult } = require('../server/src/shared/examGrading.ts');
const versions = require('./passage-versions.cjs');
const evidence = [];
const passage = file => {
  const exports = require(path.resolve(__dirname, '../client/src/content/exams/passageSets', file));
  const selected = Object.values(exports).find(value => value?.passage && Array.isArray(value.questions));
  assert.ok(selected, `Current passage ${file} must load`);
  return structuredClone(selected);
};
const sourceA = passage('at-dusk-2024-form-a.ts');
const sourceB = passage('at-dusk-2025-2026-form-b.ts');
function attempt(set, assessmentId, date, correct) {
  const content = { assessmentId, title: `Synthetic ${assessmentId}`, passageSets: [structuredClone(set)] };
  const answers = Object.fromEntries(set.questions.map((q, index) => [q.id, index === 1 ? '' : correct ? q.correctChoiceId : q.choices.find(c => c.id !== q.correctChoiceId).id]));
  const questionTimes = Object.fromEntries(set.questions.map((q, i) => [q.id, 10 + i]));
  const result = { ...createExamResult(content, answers, ['english']), attemptId: 'synthetic-shared-session', completedAt: date, questionTimes };
  return { result, content, subjects: result.subjects, passages: result.passages, corrections: [{ questionId: set.questions[0].id, note: 'Synthetic teacher correction retained' }] };
}
function comparable(data) {
  return {
    exams: data.exams.map(e => ({ key: e.key, date: e.date, english: e.english, correct: e.correct, total: e.total })),
    evidence: data.evidence.map(e => ({ key: e.key, number: e.number, question: e.question, answer: e.submittedAnswer, status: e.status, seconds: e.seconds, correction: e.correction, date: e.date })),
  };
}
function renamedCatalog(input) {
  const current = structuredClone(input.content);
  current.passageSets = [{ ...structuredClone(sourceA), id: 'canonical-passage-set', passage: { ...structuredClone(sourceA.passage), id: 'canonical-passage' }, questions: sourceA.questions.map((q, index) => ({ ...q, id: `canonical-question-${index + 1}` })) }];
  // An alias object alone is hypothetical metadata; current analytics does not
  // read it. The rehearsal deliberately does not invent a migration resolver.
  current.aliases = { [input.content.passageSets[0].id]: 'canonical-passage-set' };
  return current;
}

test('history contract: immutable snapshots preserve current-content question evidence across catalog alias replacement', () => {
  const inputs = [attempt(sourceA, 'source-a', '2026-10-01T12:00:00Z', false), attempt(sourceB, 'source-b', '2026-10-08T12:00:00Z', true)];
  const storedBefore = JSON.stringify(inputs.map(i => i.result));
  const before = comparable(buildStudentAnalytics(inputs));
  const replaced = inputs.map(input => ({ ...structuredClone(input), content: renamedCatalog(input) }));
  const after = comparable(buildStudentAnalytics(replaced));
  assert.deepEqual(after, before);
  assert.equal(JSON.stringify(inputs.map(i => i.result)), storedBefore);
  assert.equal(after.exams.length, 2, 'Same attempt ID in two exams must remain two attempts');
  assert.equal(after.evidence.length, sourceA.questions.length + sourceB.questions.length);
  assert.ok(after.evidence.some(row => row.status === 'Unanswered'));
  assert.ok(after.evidence.some(row => row.correction));
  evidence.push({ check: 'snapshot-backed-alias-contract', passed: true, attempts: after.exams.length, questionEvidenceRows: after.evidence.length, preserved: ['scores', 'dates', 'question IDs and wording', 'answers', 'blank vs wrong', 'question order', 'timings', 'corrections'] });
});

test('history contract: legacy attempts require preserved identities or pre-migration snapshots before alias replacement', {
  todo: 'No production identity migration implemented; requires verified historical snapshot/ID mapping.',
}, () => {
  const input = attempt(sourceB, 'legacy-form', '2026-09-01T12:00:00Z', true);
  delete input.result.analysisContent;
  const before = comparable(buildStudentAnalytics([input]));
  const after = comparable(buildStudentAnalytics([{ ...structuredClone(input), content: renamedCatalog(input) }]));
  const beforeIds = before.evidence.map(row => row.question.id);
  const afterIds = after.evidence.map(row => row.question.id);
  evidence.push({ check: 'legacy-alias-replacement-without-snapshot', verificationStatus: 'pending migration contract: no production identity migration implemented; requires verified historical snapshot/ID mapping', passed: JSON.stringify(before) === JSON.stringify(after), beforeEvidenceRows: before.evidence.length, afterEvidenceRows: after.evidence.length, originalIdsRetained: beforeIds.filter(id => afterIds.includes(id)).length, scoresRetained: JSON.stringify(before.exams) === JSON.stringify(after.exams), beforeStatuses: before.evidence.map(row => row.status), afterStatuses: after.evidence.map(row => row.status) });
  assert.equal(JSON.stringify(after) === JSON.stringify(before), true, 'Direct catalog alias replacement must not lose or reinterpret legacy question evidence');
});

test('history contract: snapshotting known pre-change content preserves legacy evidence before synthetic alias replacement', () => {
  const input = attempt(sourceB, 'legacy-snapshot-rehearsal', '2026-09-02T12:00:00Z', false);
  delete input.result.analysisContent;
  const before = comparable(buildStudentAnalytics([input]));
  // The trustworthy pre-change content is known in this synthetic rehearsal.
  // A real migration must prove that its recovered content is historically exact.
  const prepared = structuredClone(input);
  prepared.result.analysisContent = structuredClone(input.content);
  prepared.content = renamedCatalog(input);
  assert.deepEqual(comparable(buildStudentAnalytics([prepared])), before);
  evidence.push({ check: 'legacy-known-snapshot-contract', passed: true, caveat: 'Real legacy content provenance must be established; current content is not automatically historical truth.' });
});

test('dedup contract: changed keys, question order and superscripts cannot combine even with matching source aliases', () => {
  const authored = { section: 'reading', text: sourceA.passage.lines.map(line => line.text).join('\n'), questions: sourceA.questions };
  const same = structuredClone(authored); same.id = 'other-source'; same.versionLabels = ['Other form'];
  assert.equal(versions.identical(authored, same), true);
  for (const mutate of [p => p.questions.reverse(), p => { p.questions[0].correctChoiceId = p.questions[0].choices.find(c => c.id !== p.questions[0].correctChoiceId).id; }, p => { p.questions[0].promptHtml = `${p.questions[0].promptHtml || p.questions[0].prompt}<sup>2</sup>`; }]) {
    const changed = structuredClone(same); mutate(changed);
    assert.equal(versions.identical(authored, changed), false);
  }
});

after(() => {
  if (!process.env.EDITOR_RECOVERY_EVIDENCE_DIR) return;
  fs.mkdirSync(process.env.EDITOR_RECOVERY_EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(path.join(process.env.EDITOR_RECOVERY_EVIDENCE_DIR, 'editor-recovery-history-observations.json'), JSON.stringify({
    scope: 'In-memory contract rehearsal; two current At Dusk source passages and synthetic attempts only. No database read or write.',
    verification: 'Three active current-contract tests; one executed TODO counterexample for a pending migration contract. TODO is not a passing migration check.',
    productionMigrationCertified: false,
    realMigrationStillNeeds: ['approved identity/alias mapping', 'durable pre-migration snapshot', 'historical-content provenance for legacy attempts', 'transaction/rollback design', 'dry-run counts and per-attempt reconciliation'],
    observations: evidence,
  }, null, 2));
});
