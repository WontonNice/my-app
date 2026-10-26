const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { exportExamContent } = require('./export-exam-content.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nathan-math-export-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ['client/src/content/exams', 'server/data', 'tools/.content-drafts']) fs.mkdirSync(path.join(root, directory), { recursive: true });
  const question = { id: 'canonical-math-1', type: 'multiple_choice', prompt: 'What is 2 + 3?', correctChoiceId: 'A', choices: [{ id: 'A', text: '5' }, { id: 'B', text: '6' }], explanation: 'Add the two quantities.' };
  fs.writeFileSync(path.join(root, 'client/src/content/exams/index.ts'), `export function resolveExamContent() { return ${JSON.stringify({ passageSets: [], mathSection: { questions: [question] } })}; }`);
  fs.writeFileSync(path.join(root, 'server/data/assessments.json'), JSON.stringify([{ id: 'exam-a' }, { id: 'exam-b' }]));
  const statusPath = path.join(root, 'tools/.content-drafts/math-import-status.json');
  const read = name => JSON.parse(fs.readFileSync(path.join(root, 'server/data', name), 'utf8'));
  const writeStatus = value => fs.writeFileSync(statusPath, JSON.stringify(value));
  return { root, question, statusPath, read, writeStatus };
}

test('content export publishes only canonical needs-editing IDs and preserves authored questions', t => {
  const f = fixture(t);
  f.writeStatus({
    [JSON.stringify(['exam-a', f.question.id])]: { needsEditing: true, source: 'Private source', notes: ['Private draft notes'], entryId: 'private-import' },
    [JSON.stringify(['exam-b', f.question.id])]: { needsEditing: false },
    [JSON.stringify(['missing-exam', 'stale-question'])]: { needsEditing: true },
    [JSON.stringify(['exam-a', 'unpublished-draft'])]: { needsEditing: true },
  });
  exportExamContent(f.root);
  assert.deepEqual(f.read('math-import-review.json'), { schemaVersion: 1, needsEditingQuestionIds: [f.question.id] });
  assert.deepEqual(f.read('exam-content.json')['exam-a'].mathSection.questions, [f.question]);
  const raw = fs.readFileSync(path.join(f.root, 'server/data/math-import-review.json'), 'utf8');
  assert.doesNotMatch(raw, /Private|notes|entryId|unpublished|prompt|choices/);
});

test('production re-export without private drafts retains status; explicit local resolution clears it', t => {
  const f = fixture(t);
  f.writeStatus({ [JSON.stringify(['exam-a', f.question.id])]: { needsEditing: true } });
  exportExamContent(f.root);
  fs.unlinkSync(f.statusPath);
  exportExamContent(f.root);
  assert.deepEqual(f.read('math-import-review.json').needsEditingQuestionIds, [f.question.id]);
  f.writeStatus({ [JSON.stringify(['exam-a', f.question.id])]: { needsEditing: false } });
  exportExamContent(f.root);
  assert.deepEqual(f.read('math-import-review.json').needsEditingQuestionIds, []);
});

test('malformed local status prevents export from silently dropping existing review flags', t => {
  const f = fixture(t);
  f.writeStatus({ [JSON.stringify(['exam-a', f.question.id])]: { needsEditing: true } });
  exportExamContent(f.root);
  const before = fs.readFileSync(path.join(f.root, 'server/data/exam-content.json'), 'utf8');
  fs.writeFileSync(f.statusPath, '{ invalid');
  assert.throws(() => exportExamContent(f.root), SyntaxError);
  assert.deepEqual(f.read('math-import-review.json').needsEditingQuestionIds, [f.question.id]);
  assert.equal(fs.readFileSync(path.join(f.root, 'server/data/exam-content.json'), 'utf8'), before);
});
