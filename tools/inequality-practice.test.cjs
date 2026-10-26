const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { generateInequality, inequalityTemplate, generateVariablesBothSidesInequality, variablesBothSidesTemplate } = require('../server/src/shared/inequalityPractice.ts');
const { loginDestination } = require('../client/src/lib/loginDestination.ts');

test('all 1,056 stems are distinct, calculator-free, and have exactly one equivalent answer', () => {
  const stems = new Set(), letters = new Set();
  for (let i = 0; i < inequalityTemplate.distinctCount; i++) {
    const item = generateInequality(i, 'test'), q = item.question;
    stems.add(q.prompt); letters.add(q.correctChoiceId);
    assert.ok(Math.abs(item.constant) <= 144);
    assert.equal(Math.abs(item.constant % item.coefficient), 0);
    assert.equal(new Set(q.choices.map(c => c.math)).size, 4);
    const matching = q.choices.filter(choice => {
      const [, op, endpoint] = choice.math.match(/^x([<>])(-?\d+)$/);
      // Independent truth-set comparison covers every threshold and strict endpoint.
      for (let x = -30; x <= 30; x += 0.5) {
        const original = item.relation === '<' ? item.constant < item.coefficient * x : item.constant > item.coefficient * x;
        const answer = op === '<' ? x < Number(endpoint) : x > Number(endpoint);
        if (answer !== original) return false;
      }
      return true;
    });
    assert.equal(matching.length, 1);
    assert.equal(matching[0].id, q.correctChoiceId);
    assert.ok(q.explanation.includes(item.coefficient < 0 ? 'reverses' : 'keeps'));
  }
  assert.equal(stems.size, 1056); assert.equal(letters.size, 4);
  assert.ok([...stems].some(prompt => prompt.startsWith('\\[-12>6x\\]')));
});

test('a seed reproduces a question, cycles are explicit, and invalid indices fail', () => {
  assert.deepEqual(generateInequality(91, 'same'), generateInequality(91, 'same'));
  assert.equal(generateInequality(0, 'same').question.prompt, generateInequality(1056, 'same').question.prompt);
  assert.notEqual(generateInequality(0, 'same').question.id, generateInequality(1056, 'same').question.id);
  for (const value of [-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => generateInequality(value));
});

test('Q70 generates distinct variables-on-both-sides stems with exactly one correct answer throughout its cycle', () => {
  const stems = new Set(), letters = new Set(), branches = new Set();
  let source;
  for (let index = 0; index < variablesBothSidesTemplate.distinctCount; index++) {
    const item = generateVariablesBothSidesInequality(index, 'q70-test'), q = item.question;
    stems.add(q.prompt); letters.add(q.correctChoiceId); branches.add(`${item.relation}:${Math.sign(item.coefficient)}`);
    assert.notEqual(item.leftCoefficient, item.rightCoefficient);
    assert.ok(Math.abs(item.rightConstant) <= 114);
    assert.ok(Number.isInteger(item.boundary));
    assert.equal(new Set(q.choices.map(choice => choice.math)).size, 4);
    const endpoints = q.choices.map(choice => Number(choice.math.match(/^x[<>](-?\d+)$/)[1]));
    const samples = [...new Set([item.boundary, ...endpoints])].flatMap(x => [x - .5, x, x + .5]);
    const matching = q.choices.filter(choice => {
      const [, op, endpoint] = choice.math.match(/^x([<>])(-?\d+)$/);
      return samples.every(x => {
        const left = item.leftCoefficient * x + item.leftConstant, right = item.rightCoefficient * x + item.rightConstant;
        return (item.relation === '<' ? left < right : left > right) === (op === '<' ? x < Number(endpoint) : x > Number(endpoint));
      });
    });
    assert.equal(matching.length, 1);
    assert.equal(matching[0].id, q.correctChoiceId);
    assert.match(q.explanation, item.coefficient < 0 ? /reverses/ : /keeps/);
    assert.ok(q.explanation.includes(`\\[x${item.solution}${item.boundary}\\]`));
    assert.doesNotMatch(q.prompt, /[+-]0(?:[<>]|\\\])/);
    if (q.prompt.startsWith('\\[2x+11>3x+9\\]')) source = q;
  }
  assert.equal(stems.size, variablesBothSidesTemplate.distinctCount);
  assert.equal(letters.size, 4); assert.equal(branches.size, 4);
  const { content20222023FormBMathSection } = require('../client/src/content/exams/mathSets/2022-2023-form-bMath.ts');
  const original = content20222023FormBMathSection.questions.find(q => q.id === variablesBothSidesTemplate.sourceId);
  assert.equal(source.prompt, original.prompt);
  assert.deepEqual(source.choices.map(c => c.math).sort(), original.choices.map(c => c.math).sort());
  assert.equal(source.choices.find(c => c.id === source.correctChoiceId).math, 'x<2');
});

test('Q70 seeds reproduce questions, repeat only after a complete cycle, and reject invalid indices', () => {
  assert.deepEqual(generateVariablesBothSidesInequality(91, 'same'), generateVariablesBothSidesInequality(91, 'same'));
  const first = generateVariablesBothSidesInequality(0, 'same').question;
  const repeated = generateVariablesBothSidesInequality(variablesBothSidesTemplate.distinctCount, 'same').question;
  assert.equal(first.prompt, repeated.prompt); assert.notEqual(first.id, repeated.id);
  assert.notEqual(first.prompt, generateVariablesBothSidesInequality(0, 'different').question.prompt);
  assert.doesNotThrow(() => generateVariablesBothSidesInequality(Number.MAX_SAFE_INTEGER));
  for (const value of [-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => generateVariablesBothSidesInequality(value));
});

test('teacher login returns to its same-origin destination and rejects external redirects', () => {
  assert.equal(loginDestination('?next=%2Fteacher%2Fmath-command%3Ftab%3Dstudents', '/teacher'), '/teacher/math-command?tab=students');
  for (const next of ['https://example.com', '//example.com', '/\\example.com', '/\n/evil']) assert.equal(loginDestination('?next=' + encodeURIComponent(next), '/teacher'), '/teacher');
});

test('teacher launcher preserves a local or configured origin and fixes the destination path', async () => {
  const { teacherDestination } = await import('./teacher-workspace.mjs');
  assert.equal(teacherDestination('http://localhost:5175', 'tab=students'), 'http://localhost:5175/teacher/math-command?tab=students');
  assert.equal(teacherDestination('https://www.nathantutors.com/old'), 'https://www.nathantutors.com/teacher/math-command');
  assert.throws(() => teacherDestination('javascript:alert(1)'));
  assert.throws(() => teacherDestination('https://user:password@example.com'));
});

const { createPracticeState, parsePracticeState, addPracticeTime, checkPracticeAnswer, nextPracticeQuestion, practiceAccuracy, practiceSummary } = require('../client/src/features/math-command/inequalitySession.ts');
const { practiceModules, practiceGenerators, moduleGeneratorIds, generatePracticeQuestion } = require('../server/src/shared/infinitePractice.ts');

test('teacher previews snapshot unsaved and disabled generators without changing their catalog', () => {
  const { generatorPreviewCatalog } = require('../client/src/features/math-command/generatorPreview.ts');
  const { defaultGeneratorSettings, generateCatalogQuestion } = require('../server/src/shared/practiceCatalog.ts');
  const draft = { id:'unsaved-template',title:'Unsaved draft',description:'Preview only',kind:'two-step',enabled:false,settings:{...defaultGeneratorSettings} };
  const original = structuredClone(draft), catalog = generatorPreviewCatalog(draft);
  assert.deepEqual(draft, original);
  assert.equal(catalog.generators[0].enabled, true);
  const state = createPracticeState('generator-preview','draft-seed',catalog);
  const question = generateCatalogQuestion(state.generatorDefinitions[0],0,state.seed);
  draft.settings.maxBoundary=2;
  assert.deepEqual(generateCatalogQuestion(state.generatorDefinitions[0],0,state.seed),question);
  assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
  assert.throws(()=>generatorPreviewCatalog({...draft,settings:{...draft.settings,minCoefficient:0}}));
});
test('modules expose all registered types, foundation stays easy, and targeted practice stays focused', () => {
  const all = moduleGeneratorIds(practiceModules.find(m => m.id === 'all'));
  assert.deepEqual(all, practiceGenerators.map(g => g.id));
  const seen = new Set();
  for (let i = 0; i < 128; i++) {
    const q = generatePracticeQuestion(all, i, 'test'); seen.add(q.id.split(':')[0]);
    assert.deepEqual(q, generatePracticeQuestion(all, i, 'test'));
    const foundation = generatePracticeQuestion(moduleGeneratorIds(practiceModules[0]), i, 'test');
    const [, b, relation, a] = foundation.prompt.match(/\\\[(\d+)([<>])(\d+)x/);
    assert.ok(Number(a) >= 2 && Number(a) <= 5); assert.ok(Number(b) <= 40); assert.equal(Number(b) % Number(a), 0);
    const key = foundation.choices.find(c => c.id === foundation.correctChoiceId).math;
    assert.equal(key, `x${relation === '>' ? '<' : '>'}${Number(b) / Number(a)}`);
    assert.equal(new Set(foundation.choices.map(c => c.math)).size, 4);
  }
  assert.equal(seen.size, all.length);
  assert.deepEqual(moduleGeneratorIds(practiceModules.find(m => m.id === 'inequalities')), ['one-step-inequalities-v1']);
  const q70 = practiceModules.find(m => m.id === variablesBothSidesTemplate.sourceId);
  assert.deepEqual(moduleGeneratorIds(q70), [variablesBothSidesTemplate.id]);
  assert.equal(generatePracticeQuestion(moduleGeneratorIds(q70), 5, 'module').id, `${variablesBothSidesTemplate.id}:module:5`);
  assert.throws(() => generatePracticeQuestion([], 0, 'test'));
});
test('session metrics distinguish answering, feedback, unfinished questions and longest streak', () => {
  let state = createPracticeState('all', 'test');
  assert.equal(practiceAccuracy(state), '—'); assert.equal(practiceSummary(state).averageMs, null);
  assert.equal(checkPracticeAnswer(state, 'C'), state); assert.equal(nextPracticeQuestion(state), state);
  for (const [answer, streak, accuracy] of [['C',1,'100%'],['C',2,'100%'],['A',0,'67%'],['C',1,'75%']]) {
    state = addPracticeTime({ ...state, answer }, 10000);
    state = checkPracticeAnswer(state, 'C');
    assert.equal(state.streak, streak); assert.equal(practiceAccuracy(state), accuracy);
    assert.equal(checkPracticeAnswer(state, 'C'), state);
    state = addPracticeTime(state, 5000); // Feedback counts only toward total time.
    assert.deepEqual(parsePracticeState(JSON.stringify(state)), state);
    state = nextPracticeQuestion(state);
  }
  state = addPracticeTime(state, 3000); // Unfinished question excluded from the average.
  state = { ...state, finished: true };
  assert.deepEqual(practiceSummary(state), {accuracy:'75%',longestStreak:2,averageMs:10000,totalMs:63000});
  assert.equal(addPracticeTime(state, 99999), state); assert.equal(nextPracticeQuestion(state), state);
  assert.equal(checkPracticeAnswer(state, 'C'), state);
  assert.deepEqual(parsePracticeState(JSON.stringify(state)), state);
  assert.equal(parsePracticeState(JSON.stringify({ ...state, longestStreak:99 })), null);
  assert.equal(parsePracticeState(JSON.stringify({ ...state, generatorIds:['missing'] })), null);
  assert.equal(parsePracticeState(JSON.stringify({ ...state, totalMs:-1 })), null);
  assert.equal(createPracticeState('foundation','new').checked, 0);
});
test('module generator selection is snapshotted for a running session', () => {
  const state = createPracticeState('all','test');
  const q = generatePracticeQuestion(state.generatorIds, 3, state.seed);
  practiceGenerators.push({id:'temporary-type',title:'Test only',foundation:false,generate:()=>q});
  try {
    assert.ok(moduleGeneratorIds(practiceModules.find(m=>m.id==='all')).includes('temporary-type'));
    assert.ok(!state.generatorIds.includes('temporary-type'));
    assert.deepEqual(generatePracticeQuestion(state.generatorIds, 3, state.seed), q);
  } finally { practiceGenerators.pop(); }
});
test('session storage preserves typed and structured responses for future generators', () => {
  for (const answer of ['-3/4', ['A','C'], {slot1:'item2',slot2:'item1'}]) {
    let state = { ...createPracticeState('all','test'), answer };
    state = checkPracticeAnswer(addPracticeTime(state, 2500), true);
    assert.equal(state.correct, 1);
    assert.deepEqual(parsePracticeState(JSON.stringify(state)), state);
  }
});
