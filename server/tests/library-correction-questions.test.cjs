const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { libraryCorrectionQuestions } = require('../../client/src/lib/libraryCorrectionQuestions.ts');
const question = id => ({ id, type: 'multiple_choice', prompt: id, correctChoiceId: 'B' });
const passage = { id: 'base', title: 'Current passage', lines: [] };
const set = { passage, questions: [question('q1'), question('q2'), question('q3')] };
const stat = (id, number) => ({ questionId: id, questionNumber: number, selectedAnswerId: 'A', isCorrect: false });

test('corrections use submitted membership and order with frozen passage and question content', () => {
  const frozen = { id: 'old', title: 'Original version', lines: [{ text: 'Original passage text' }] };
  const saved = { ...question('q3'), prompt: 'Original question' };
  const result = libraryCorrectionQuestions({ questions: [{ ...stat('q3', 1), questionSnapshot: saved, passageSnapshot: frozen }, stat('q1', 2)] }, set);
  assert.deepEqual(result.map(item => item.question.id), ['q3', 'q1']);
  assert.equal(result[0].passage, frozen);
  assert.equal(result[0].question, saved);
  assert.equal(result[0].submittedAnswer, 'A');
  assert.equal(result[1].number, 2);
});

test('legacy attempts resolve each question to its own passage version and decode structured answers', () => {
  const version = { id: 'version-two', title: 'Second version', lines: [] };
  const result = libraryCorrectionQuestions({ questions: [{ ...stat('q2', 1), selectedAnswerId: '["A","C"]' }] }, set, { q2: version });
  assert.equal(result[0].passage, version);
  assert.deepEqual(result[0].submittedAnswer, ['A', 'C']);
});

test('missing original questions are not replaced with an unrelated question at the same position', () => {
  assert.deepEqual(libraryCorrectionQuestions({ questions: [stat('removed-question', 1)] }, set), []);
});
