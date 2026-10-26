const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { generateWritingInequality, writingInequalitiesTemplate } = require('../server/src/shared/writingInequalities.ts');
const { isExamQuestionCorrect } = require('../server/src/shared/examGrading.ts');
const { mathAnswerFromLatex } = require('../server/src/shared/mathAnswer.ts');

test('Writing Inequalities visits every stem and includes the original Form D item 26', () => {
  const stems = new Set();
  let source;
  const { content20262027FormDMathSection } = require('../client/src/content/exams/mathSets/2026-2027-form-dMath.ts');
  const original = content20262027FormDMathSection.questions.find(q => q.id === writingInequalitiesTemplate.sourceId);
  for (let index = 0; index < writingInequalitiesTemplate.distinctCount; index++) {
    const item = generateWritingInequality(index, 'complete-cycle'), q = item.question;
    stems.add(q.prompt);
    assert.equal(q.type, 'expression_entry');assert.equal(q.entryVariable, 'x');
    const [, budget, rate, fee] = q.prompt.match(/budget of \$(\d+).*charges \$(\d+).*fee of \$(\d+)/);
    assert.equal(Number(fee) + Number(rate) * item.hours, Number(budget));
    assert.equal(q.correctTextAnswers[0], `${fee}+${rate}x\\le ${budget}`);
    assert.ok(item.budget <= 300 && item.fee > 0 && item.rate > 0);
    if (q.prompt === original.prompt) source = q;
  }
  assert.equal(stems.size, writingInequalitiesTemplate.distinctCount);
  assert.ok(source, 'The generator reproduces the source word problem');
  for (const answer of original.correctTextAnswers) assert.ok(isExamQuestionCorrect(source, answer), answer);
});

test('typed budgets accept both orientations, term orders and notation, and reject modelling errors', () => {
  for (let index = 0; index < 80; index++) {
    const { question: q, rate, fee, budget, hours } = generateWritingInequality(index, 'grading');
    for (const answer of q.correctTextAnswers) assert.ok(isExamQuestionCorrect(q, answer), answer);
    for (const answer of [`${rate}x+${fee}\\leq ${budget}`, `${budget}\\geq ${fee}+${rate}x`, `${fee} + ${rate} x \\le ${budget}`]) {
      assert.ok(isExamQuestionCorrect(q, mathAnswerFromLatex(answer)), answer);
    }
    for (const wrong of ['', `${fee}+${rate}x<${budget}`, `${fee}+${rate}x>=${budget}`, `${fee}+${rate}x=${budget}`, `${rate}x<=${budget}`, `${rate}+${fee}x<=${budget + 1}`, `${fee}+${rate}x\\le\\placeholder{}`]) {
      assert.equal(isExamQuestionCorrect(q, wrong), false, wrong);
    }
    assert.equal(fee + rate * hours, budget);
    assert.ok(fee + rate * (hours - .5) < budget);
    assert.ok(fee + rate * (hours + .5) > budget);
    assert.match(q.explanation, /Equality is allowed/);
  }
});

test('Writing Inequalities sequences are reproducible, cycle explicitly, and validate indices', () => {
  assert.deepEqual(generateWritingInequality(8, 'same'), generateWritingInequality(8, 'same'));
  const first = generateWritingInequality(0, 'same').question;
  const repeated = generateWritingInequality(writingInequalitiesTemplate.distinctCount, 'same').question;
  assert.equal(first.prompt, repeated.prompt);assert.notEqual(first.id, repeated.id);
  assert.notEqual(first.prompt, generateWritingInequality(0, 'different').question.prompt);
  for (const index of [-1, .5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => generateWritingInequality(index));
});

test('Writing Inequalities registers in saved catalogs without changing nesting or existing resources', () => {
  const { defaultPracticeCatalog, removePracticeGenerator, movePracticeModule, generateCatalogQuestion } = require('../server/src/shared/practiceCatalog.ts');
  const { createPracticeState, parsePracticeState } = require('../client/src/features/math-command/inequalitySession.ts');
  const { addWritingInequalities } = require('./register-writing-inequalities.cjs');
  let old = removePracticeGenerator(defaultPracticeCatalog(), writingInequalitiesTemplate.id);
  old.modules = old.modules.filter(m => m.id !== writingInequalitiesTemplate.sourceId);
  old = movePracticeModule(old, 'inequalities', 'foundation');
  const before = structuredClone(old), catalog = addWritingInequalities(old);
  assert.deepEqual(old, before);assert.deepEqual(catalog.modules.slice(0, -1), old.modules);
  assert.deepEqual(catalog.generators.slice(0, -1), old.generators);
  assert.deepEqual(addWritingInequalities(catalog), catalog);
  const module = catalog.modules.at(-1);
  assert.equal(module.title, 'Writing Inequalities');assert.equal(module.topic, 'Inequalities');assert.equal(module.category, 'Algebra');
  const state = createPracticeState(module.id, 'saved-session', catalog);
  assert.deepEqual(state.generatorIds, [writingInequalitiesTemplate.id]);
  assert.deepEqual(parsePracticeState(JSON.stringify(state)), state);
  const q = generateCatalogQuestion(state.generatorDefinitions[0], 0, state.seed);
  assert.equal(q.type, 'expression_entry');
});
