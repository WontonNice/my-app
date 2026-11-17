const { test } = require('node:test'), assert = require('node:assert/strict');
require('./register-practice-generator.cjs'); // registers ts-node for the server TypeScript modules
const { adaptiveTopics, adaptiveCategories } = require('../server/src/shared/adaptiveMath/topics.ts');
const engine = require('../server/src/shared/adaptiveMath/engine.ts');
const { isExamQuestionCorrect } = require('../server/src/shared/examGrading.ts');
const taxonomy = require('./math-topics.json');
const katex = require('katex');

const renderMath = text => { for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) katex.renderToString(match[1] ?? match[2], { throwOnError: true, strict: 'error' }); };
const correctAnswer = question => question.correctChoiceId ?? question.correctTextAnswers[0];
const wrongAnswer = question => question.choices ? question.choices.find(choice => choice.id !== question.correctChoiceId).id : 'not-a-number';

test('Topics cover the shared math taxonomy with every difficulty level', () => {
  const expected = taxonomy.categories.flatMap(category => category.topics.map(topic => `${category.label} / ${topic}`)).sort();
  assert.deepEqual(adaptiveTopics.map(topic => `${topic.category} / ${topic.label}`).sort(), expected);
  assert.equal(new Set(adaptiveTopics.map(topic => topic.id)).size, adaptiveTopics.length);
  assert.equal(new Set(adaptiveTopics.flatMap(topic => topic.families.map(family => family.id))).size, adaptiveTopics.flatMap(topic => topic.families).length);
  for (const topic of adaptiveTopics) {
    assert.ok(adaptiveCategories.includes(topic.category));
    assert.ok(topic.families.length >= 5, `${topic.label} needs several question types`);
    // Like the SHSAT, the exam uses only multiple-choice and typed-number questions.
    for (const family of topic.families) assert.ok(['multiple_choice', 'short_response'].includes(family.generate(0, 'types').type), family.id);
    for (const level of [1, 2, 3]) assert.ok(topic.families.some(family => family.level === level), `${topic.label} needs a level ${level} question type`);
  }
});

for (const topic of adaptiveTopics) test(`${topic.label}: every question type builds valid, gradable, endless questions`, () => {
  const distinct = new Set();
  for (const family of topic.families) {
    for (let index = 0; index < 250; index++) {
      const question = family.generate(index, 'exhaust'), label = `${family.id} #${index}`;
      assert.equal(question.topic, topic.category, label); assert.equal(question.subtopic, topic.label, label);
      assert.doesNotMatch(question.prompt + question.explanation + JSON.stringify(question.choices ?? []), /undefined|NaN|Infinity|\[object|null/, label);
      assert.doesNotMatch(question.prompt + question.explanation, /\+-|--\d|\d\.\d{7,}/, label);
      assert.ok(question.explanation.length >= 60, label);
      renderMath(question.prompt); renderMath(question.explanation);
      if (question.type === 'multiple_choice') {
        assert.equal(question.choices.length, 4, label);
        assert.equal(new Set(question.choices.map(choice => choice.text)).size, 4, label);
        assert.equal(new Set(question.choices.map(choice => choice.math ?? choice.text)).size, 4, label);
        for (const choice of question.choices) { if (choice.math) katex.renderToString(choice.math, { throwOnError: true, strict: 'error' }); assert.equal(isExamQuestionCorrect(question, choice.id), choice.id === question.correctChoiceId, label); }
      } else {
        assert.equal(question.type, 'short_response', label);
        assert.ok(question.correctTextAnswers.length, label);
        for (const accepted of question.correctTextAnswers) assert.equal(isExamQuestionCorrect(question, accepted), true, label);
        for (const rejected of ['', 'abc', `${question.correctTextAnswers[0]}1`]) assert.equal(isExamQuestionCorrect(question, rejected), false, label);
      }
      distinct.add(question.prompt + JSON.stringify(question.choices ?? question.correctTextAnswers) + (question.image?.src.length ?? ''));
      // The same seed and index always rebuild the same question, so a saved exam can resume and be reviewed.
      if (index < 3) assert.deepEqual(family.generate(index, 'exhaust'), question, label);
    }
    // The stream has no end.
    assert.ok(family.generate(123456, 'far').prompt);
  }
  assert.ok(distinct.size >= 300, `${topic.label} has only ${distinct.size} distinct questions`);
});

function play(seed, knows, count, mode = 'exam') {
  let state = engine.createAdaptiveState(seed, 1000, mode), now = 1000; const asked = [];
  for (let step = 0; step < count; step++) {
    if (engine.adaptiveSummary(state).complete) break;
    const question = engine.adaptiveQuestion(state), topicId = state.current.topicId;
    asked.push({ topicId, level: state.current.level, reason: state.current.reason, key: question.prompt + JSON.stringify(question.choices ?? '') + (question.image?.src.length ?? '') });
    state = engine.selectAdaptiveAnswer(state, knows(topicId, step, state.current.level) ? correctAnswer(question) : wrongAnswer(question));
    state = engine.submitAdaptiveAnswer(state, now += 30000);
    if (mode === 'practice') { assert.equal(state.submitted, true); state = engine.advanceAdaptive(state); }
  }
  return { state, asked };
}

test('A student who knows everything finishes in about one SHSAT math section', () => {
  for (const seed of ['alpha-1', 'beta-22', 'gamma-333']) {
    const { state, asked } = play(seed, () => true, 400), summary = engine.adaptiveSummary(state);
    assert.equal(summary.complete, true); assert.equal(summary.mastered, adaptiveTopics.length);
    // Two correct answers, the second one harder, settle each topic; a few spot checks may be mixed in near the end.
    assert.ok(asked.length >= 2 * adaptiveTopics.length && asked.length <= 2 * adaptiveTopics.length + 8, `${asked.length} questions`);
    for (const topic of adaptiveTopics) assert.ok(asked.filter(item => item.topicId === topic.id && item.reason !== 'review').length === 2, topic.label);
    assert.equal(state.correct, state.asked);
  }
});

test('Missed topics keep coming back while understood topics are left alone', () => {
  const weak = new Set(['percentages', 'triangles', 'probability']);
  const { state, asked } = play('mixed-seed', topicId => !weak.has(topicId), 220), summary = engine.adaptiveSummary(state);
  for (const topic of summary.topics) {
    if (weak.has(topic.id)) { assert.equal(topic.status, 'weak', topic.label); assert.ok(topic.attempts >= 30, `${topic.label} was only asked ${topic.attempts} times`); }
    else { assert.equal(topic.status, 'mastered', topic.label); assert.ok(topic.attempts <= 4, `${topic.label} was asked ${topic.attempts} times after being understood`); }
  }
  // Once the strong topics are settled, nearly every question targets a weak topic.
  const late = asked.slice(-100);
  assert.ok(late.filter(item => weak.has(item.topicId)).length >= 90);
  // Never more than two questions in a row on one topic, even a weak one.
  for (let i = 2; i < asked.length; i++) assert.ok(!(asked[i].topicId === asked[i - 1].topicId && asked[i].topicId === asked[i - 2].topicId), `three in a row at ${i}`);
  // A missed question is followed by an easier one on the same topic.
  const firstMiss = asked.findIndex(item => weak.has(item.topicId));
  assert.equal(asked[firstMiss + 1].topicId, asked[firstMiss].topicId); assert.equal(asked[firstMiss + 1].reason, 'follow-up');
  assert.ok(asked[firstMiss + 1].level < asked[firstMiss].level);
});

test('A student who misses everything is still shown every topic and no immediate repeats', () => {
  const { state, asked } = play('struggling', () => false, 300), summary = engine.adaptiveSummary(state);
  assert.equal(summary.mastered, 0); assert.equal(summary.untested, 0);
  for (const topic of summary.topics) assert.ok(topic.attempts >= 6, `${topic.label}: ${topic.attempts}`);
  for (let i = 1; i < asked.length; i++) assert.notEqual(asked[i].key, asked[i - 1].key, `repeat at ${i}`);
  // Within one weak topic, a long run of questions stays varied.
  const one = asked.filter(item => item.topicId === 'percentages').map(item => item.key);
  assert.ok(new Set(one).size >= one.length - 1, 'percent questions repeated');
  assert.ok(asked.slice(-100).every(item => item.level === 1), 'a struggling student is kept at the foundation level');
  // The first pass reaches every topic within about two SHSAT math sections, even with a follow-up after each miss.
  assert.equal(new Set(asked.slice(0, 115).map(item => item.topicId)).size, adaptiveTopics.length);
});

test('A student who recovers on a topic can still master it', () => {
  // Misses the first two questions on every topic, then answers correctly.
  const seen = new Map();
  const { state } = play('recover', topicId => { const count = (seen.get(topicId) ?? 0) + 1; seen.set(topicId, count); return count > 2; }, 600);
  assert.equal(engine.adaptiveSummary(state).complete, true);
  for (const topic of engine.adaptiveSummary(state).topics) assert.ok(topic.attempts <= 7, `${topic.label} took ${topic.attempts} questions`);
});

test('Lucky guesses on easy questions do not count as mastery', () => {
  let progress = { attempts: 0, correct: 0, mastery: engine.adaptivePrior, level: 2, streak: 0, missStreak: 0, lastAsked: -1, status: 'new', used: {} };
  progress = engine.updatedProgress(progress, 2, false, true, 'exam', 0); assert.equal(progress.status, 'weak'); assert.equal(progress.level, 1);
  progress = engine.updatedProgress(progress, 1, true, true, 'exam', 1); assert.notEqual(progress.status, 'mastered');
  progress = engine.updatedProgress(progress, 2, true, true, 'exam', 2); assert.notEqual(progress.status, 'mastered');
  progress = engine.updatedProgress(progress, 3, true, true, 'exam', 3); assert.equal(progress.status, 'mastered');
  // A typed-in answer is stronger evidence than a multiple-choice answer.
  const start = { attempts: 0, correct: 0, mastery: engine.adaptivePrior, level: 2, streak: 0, missStreak: 0, lastAsked: -1, status: 'new', used: {} };
  assert.ok(engine.updatedProgress(start, 2, true, false, 'exam', 0).mastery > engine.updatedProgress(start, 2, true, true, 'exam', 0).mastery);
  // A mastered topic that is missed on a later spot check is reopened.
  const mastered = { ...start, attempts: 2, correct: 2, mastery: 0.9, level: 3, streak: 2, status: 'mastered' };
  assert.notEqual(engine.updatedProgress(mastered, 3, false, true, 'exam', 40).status, 'mastered');
});

test('Practice mode shows feedback before moving on; exam mode moves straight on', () => {
  let state = engine.createAdaptiveState('modes-1', 5, 'practice');
  const first = engine.adaptiveQuestion(state);
  assert.equal(engine.submitAdaptiveAnswer(state, 10), state, 'nothing is graded until an answer is chosen');
  state = engine.submitAdaptiveAnswer(engine.selectAdaptiveAnswer(state, wrongAnswer(first)), 10);
  assert.equal(state.submitted, true); assert.equal(state.lastCorrect, false); assert.equal(state.asked, 1);
  assert.deepEqual(engine.adaptiveQuestion(state), first, 'the checked question stays on screen');
  assert.equal(engine.selectAdaptiveAnswer(state, correctAnswer(first)).answer, state.answer, 'a checked answer is locked');
  state = engine.advanceAdaptive(state);
  assert.equal(state.submitted, false); assert.equal(state.answer, '');
  // Switching modes mid-exam applies from the next answer.
  state = engine.setAdaptiveMode(state, 'exam');
  const second = engine.adaptiveQuestion(state);
  state = engine.submitAdaptiveAnswer(engine.selectAdaptiveAnswer(state, correctAnswer(second)), 20);
  assert.equal(state.submitted, false); assert.equal(state.asked, 2); assert.notDeepEqual(engine.adaptiveQuestion(state), second);
  assert.deepEqual(state.responses.map(row => [row.correct, row.mode]), [[false, 'practice'], [true, 'exam']]);
  // "I don't know" counts as a miss.
  const skipped = engine.submitAdaptiveAnswer(state, 30, true);
  assert.equal(skipped.responses.at(-1).skipped, true); assert.equal(skipped.responses.at(-1).correct, false);
});

test('A saved exam restores exactly, rejects tampering, and resumes after the report', () => {
  const { state } = play('persist-1', (topicId, step) => step % 3 !== 0, 40);
  const restored = engine.parseAdaptiveState(JSON.stringify(state));
  assert.deepEqual(restored, state);
  assert.deepEqual(engine.adaptiveQuestion(restored), engine.adaptiveQuestion(state));
  // Every logged response can be rebuilt for review.
  for (const row of restored.responses) assert.ok(engine.adaptiveQuestionFor(restored.seed, row).prompt);
  for (const broken of [null, 'not json', { ...state, version: 2 }, { ...state, correct: state.asked + 1 }, { ...state, seed: '../x' }, { ...state, mode: 'cheat' },
    { ...state, current: 'x' }, { ...state, topics: { ...state.topics, percentages: { ...state.topics.percentages, mastery: 2 } } }, { ...state, responses: Array(301).fill(state.responses[0]) }])
    assert.equal(engine.parseAdaptiveState(typeof broken === 'string' ? broken : JSON.stringify(broken)), null);
  // A question type retired in a later release never costs the student their progress: a new question is chosen.
  const retired = engine.parseAdaptiveState(JSON.stringify({ ...state, current: { ...state.current, familyId: 'retired-question-type' }, answer: 'B' }));
  assert.equal(retired.asked, state.asked); assert.deepEqual(retired.topics.percentages.attempts, state.topics.percentages.attempts);
  assert.ok(engine.adaptiveQuestion(retired).prompt); assert.equal(retired.answer, '');
  const retiredResponse = engine.parseAdaptiveState(JSON.stringify({ ...state, responses: [{ ...state.responses[0], familyId: 'retired-question-type' }, ...state.responses.slice(1)] }));
  assert.equal(retiredResponse.responses.length, state.responses.length - 1);
  // A topic added in a later release starts as untested instead of invalidating saved exams.
  const { percentages, ...olderTopics } = state.topics;
  assert.equal(engine.parseAdaptiveState(JSON.stringify({ ...state, topics: olderTopics })).topics.percentages.status, 'new');
  const finished = engine.finishAdaptive(state, 99999);
  assert.equal(finished.finished, true); assert.equal(engine.submitAdaptiveAnswer(finished, 1), finished);
  const resumed = engine.continueAdaptive(finished, 100000);
  assert.equal(resumed.finished, false); assert.deepEqual(engine.adaptiveQuestion(resumed), engine.adaptiveQuestion(state));
  // The copy with more answers wins a sync; a restarted exam replaces the old one.
  assert.ok(engine.compareAdaptiveStates(state, play('persist-1', (topicId, step) => step % 3 !== 0, 20).state) > 0);
  assert.ok(engine.compareAdaptiveStates(engine.createAdaptiveState('fresh-1', state.startedAt + 1), state) > 0);
  assert.ok(engine.compareAdaptiveStates(state, null) > 0);
  // In practice mode, pressing Next after the feedback must never be undone by the copy saved a moment earlier.
  let practice = engine.createAdaptiveState('order-1', 50, 'practice');
  const checked = engine.submitAdaptiveAnswer(engine.selectAdaptiveAnswer(practice, wrongAnswer(engine.adaptiveQuestion(practice))), 60), moved = engine.advanceAdaptive(checked);
  assert.ok(engine.compareAdaptiveStates(checked, practice) > 0); assert.ok(engine.compareAdaptiveStates(moved, checked) > 0); assert.ok(engine.compareAdaptiveStates(checked, moved) < 0);
  practice = engine.submitAdaptiveAnswer(engine.selectAdaptiveAnswer(moved, correctAnswer(engine.adaptiveQuestion(moved))), 70);
  assert.ok(engine.compareAdaptiveStates(practice, moved) > 0);
});

test('Two students get different questions, and one student gets the same exam back', () => {
  const a = play('student-a', () => true, 20).asked.map(item => item.key), again = play('student-a', () => true, 20).asked.map(item => item.key), b = play('student-b', () => true, 20).asked.map(item => item.key);
  assert.deepEqual(a, again); assert.notDeepEqual(a, b);
});
