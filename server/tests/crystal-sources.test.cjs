const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });

const multiple = (id, topic = 'Algebra', subtopic) => ({
  id, type: 'multiple_choice', topic, ...(subtopic ? { subtopic } : {}), prompt: 'Solve the sample question.',
  choices: [{ id: 'A', text: '12' }, { id: 'B', text: '18' }], correctChoiceId: 'A', explanation: 'Private answer explanation.',
});
let exams, assessments, bank;
function stub(relative, exports) {
  const id = require.resolve(relative); require.cache[id] = { id, filename: id, loaded: true, exports };
}
stub('../src/config/assessments.ts', { listTeacherAssessments: () => assessments });
stub('../src/lib/examContent.ts', { getExamContent: id => exams[id] ?? null });
stub('../src/lib/questionBank.ts', { readQuestionBank: () => bank });
const { crystalCatalog, loadCrystalQuestions, generateCrystalPractice, crystalPracticeGeneratorIds } = require('../src/lib/crystalSources.ts');
const { isExamQuestionCorrect } = require('../src/shared/examGrading.ts');

beforeEach(() => {
  assessments = [{ id: 'exam-a', title: 'Exam A' }, { id: 'exam-b', title: 'Exam B' }, { id: 'empty', title: 'No math' }];
  exams = {
    'exam-a': { passageSets: [{ questions: [multiple('english-exam-question')] }], mathSection: { questions: [
      multiple('equation', 'Algebra', 'Equations & Systems'), multiple('legacy', 'Algebra'),
      multiple('geometry', 'Geometry', 'Shapes & Angles'),
      { id: 'numeric', type: 'numeric_entry', topic: 'Arithmetic & Number Sense', subtopic: 'Fractions & Decimals', prompt: 'Enter one half.', correctTextAnswers: ['0.5'] },
      { ...multiple('unanswerable'), correctChoiceId: 'C' }, { ...multiple('missing-key'), correctChoiceId: undefined },
      { ...multiple('essay'), type: 'essay' },
    ] } },
    'exam-b': { passageSets: [], mathSection: { questions: [multiple('equation', 'Algebra', 'Equations & Systems'), multiple('functions', 'Algebra', 'Functions & Graphs')] } },
    empty: { passageSets: [] },
  };
  const reading = (id, topic) => ({ ...multiple(id, topic), subject: 'English', source: 'SHSAT Lab', status: 'published', passage: null });
  bank = { revision: 1, sets: [], questions: [
    { ...reading('evidence', 'Supporting Evidence'), passage: { title: 'A small discovery', text: 'First paragraph.\n\nSecond paragraph.', format: 'prose' }, visualImage: { src: '/sample-figure.png', alt: 'A sample chart' } },
    reading('word-meaning', 'Vocabulary in Context'),
    { ...reading('draft', 'Inference'), status: 'draft' },
    { ...reading('other-source', 'Inference'), source: 'Another bank' },
    { ...reading('bank-math', 'Algebra'), subject: 'Math' },
    { ...reading('bad-reading-key', 'Inference'), correctChoiceId: 'missing' },
  ] };
});

test('catalog exposes finite, deduplicated math topic counts and reading topics without question keys', () => {
  const catalog = crystalCatalog();
  assert.equal(catalog.infiniteAvailable, true);
  assert.deepEqual(catalog.assessments.map(item => [item.id, item.mathCount]), [['all', 5], ['exam-a', 4], ['exam-b', 2]]);
  const algebra = catalog.assessments[0].topics.find(item => item.topic === 'Algebra');
  assert.equal(algebra.count, 3);
  assert.deepEqual(algebra.subtopics, [{ name: 'Equations & Systems', count: 1 }, { name: 'Functions & Graphs', count: 1 }, { name: 'Unclassified', count: 1 }]);
  assert.deepEqual(catalog.readingTopics, [{ topic: 'Evidence & Support', count: 1 }, { topic: 'Word & Phrase Meaning', count: 1 }]);
  assert.doesNotMatch(JSON.stringify(catalog), /correct|explanation|prompt|Private answer|sample question/);
});

test('exam source filtering preserves only selected math questions and handles unclassified legacy questions', () => {
  const all = loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'all' });
  assert.equal(all.questions.length, 5);
  assert.equal(new Set(all.questions.map(item => item.question.id)).size, 5);
  assert.ok(all.questions.every(item => item.subject === 'Math' && !item.passage));
  assert.deepEqual(loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'exam-a', topic: 'Algebra', subtopic: 'Equations & Systems' }).questions.map(item => item.question.id), ['equation']);
  assert.deepEqual(loadCrystalQuestions({ kind: 'exam-math', topic: 'Algebra', subtopic: 'Unclassified' }).questions.map(item => item.question.id), ['legacy']);
  assert.deepEqual(loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'exam-b' }).questions.map(item => item.question.id), ['equation', 'functions']);
  const numeric = all.questions.find(item => item.question.id === 'numeric').question;
  assert.equal(isExamQuestionCorrect(numeric, '0.5'), true);
  assert.match(all.sourceTitle, /All exams/);
});

test('reading uses only published SHSAT Lab English questions and keeps passage, figure, and canonical topic', () => {
  const result = loadCrystalQuestions({ kind: 'lab-reading' });
  assert.deepEqual(result.questions.map(item => item.question.id), ['evidence', 'word-meaning']);
  const evidence = loadCrystalQuestions({ kind: 'lab-reading', topic: 'Evidence & Support' }).questions[0];
  assert.equal(evidence.subject, 'English');
  assert.equal(evidence.question.topic, 'Evidence & Support');
  assert.equal(evidence.passage.title, 'A small discovery');
  assert.deepEqual(evidence.passage.lines.map(line => line.text), ['First paragraph.', 'Second paragraph.']);
  assert.equal(evidence.question.image.src, '/sample-figure.png');
  assert.equal(isExamQuestionCorrect(evidence.question, 'A'), true);
  assert.deepEqual(loadCrystalQuestions({ kind: 'lab-reading', topic: 'Vocabulary in Context' }).questions.map(item => item.question.id), ['word-meaning']);
});

test('invalid or empty source filters fail; infinite practice works without published exam content', () => {
  for (const source of [null, [], {}, { kind: 'unknown' }, { kind: 'exam-math', assessmentId: 'private-or-missing' },
    { kind: 'exam-math', topic: 'Missing' }, { kind: 'exam-math', topic: 'Algebra', subtopic: 'Shapes & Angles' },
    { kind: 'exam-math', topic: [] }, { kind: 'exam-math', subtopic: ' ' },
    { kind: 'lab-reading', assessmentId: 'exam-a' }, { kind: 'lab-reading', subtopic: 'Algebra' },
    { kind: 'lab-reading', topic: 'Inference' }, { kind: 'infinite-math', moduleId: 'missing' },
    { kind: 'infinite-math', moduleId: [] }, { kind: 'infinite-math', topic: 'Geometry' },
    { kind: 'infinite-math', subtopic: 'Missing' }, { kind: 'infinite-math', assessmentId: 'exam-a' }]) {
    assert.throws(() => loadCrystalQuestions(source), error => error.status === 400);
  }
  assessments = []; bank.questions = [];
  const catalog = crystalCatalog();
  assert.deepEqual(catalog.assessments, [{ id: 'all', title: 'All exams', mathCount: 0, topics: [] }]);
  assert.deepEqual(catalog.readingTopics, []); assert.equal(catalog.infiniteAvailable, true);
  assert.equal(loadCrystalQuestions({ kind: 'infinite-math' }).questions.length, 1);
  assert.throws(() => loadCrystalQuestions({ kind: 'exam-math' }), /No published/);
  assert.throws(() => loadCrystalQuestions({ kind: 'lab-reading' }), /No published/);
});

test('infinite practice uses the shared modules, categories, and deterministic gradable variations', () => {
  const modules = crystalCatalog().infiniteModules;
  assert.deepEqual(modules.map(item => item.id), ['foundation', 'all', 'inequalities']);
  assert.deepEqual(modules.map(item => item.topics[0].count), [1, 2, 1]);
  for (const module of modules) {
    const topic = module.topics[0], source = { kind: 'infinite-math', moduleId: module.id, topic: topic.topic, subtopic: topic.subtopics[0].name };
    const configured = loadCrystalQuestions(source);
    assert.match(configured.sourceTitle, /Infinite math/); assert.ok(configured.sourceTitle.includes(module.title));
    const generated = Array.from({ length: 24 }, (_, index) => generateCrystalPractice(source, index, 'test-expedition'));
    assert.equal(new Set(generated.map(item => item.question.id)).size, 24);
    assert.ok(new Set(generated.map(item => item.question.prompt)).size > 8);
    for (const item of generated) {
      assert.equal(item.subject, 'Math'); assert.equal(item.question.topic, topic.topic); assert.equal(item.question.subtopic, source.subtopic);
      assert.equal(isExamQuestionCorrect(item.question, item.question.correctChoiceId), true);
      assert.equal(isExamQuestionCorrect(item.question, item.question.choices.find(choice => choice.id !== item.question.correctChoiceId).id), false);
    }
    assert.deepEqual(generated[5], generateCrystalPractice(source, 5, 'test-expedition'));
    assert.notEqual(generated[5].question.id, generateCrystalPractice(source, 5, 'another-expedition').question.id);
  }
  assert.deepEqual(crystalPracticeGeneratorIds({ kind: 'infinite-math', moduleId: 'foundation' }), ['inequalities-foundation-v1']);
  assert.deepEqual(crystalPracticeGeneratorIds({ kind: 'infinite-math', moduleId: 'inequalities' }), ['one-step-inequalities-v1']);
});

test('returned game question pool is independent of its source content', () => {
  const pool = loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'exam-a' }).questions;
  pool[0].question.correctChoiceId = 'B'; pool[0].question.choices[0].text = 'Changed';
  const fresh = loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'exam-a' }).questions;
  assert.equal(fresh[0].question.correctChoiceId, 'A'); assert.equal(fresh[0].question.choices[0].text, '12');
});

test('supported interactive formats require visible answer targets before entering the pool', () => {
  const interactive = { id: 'dropdown', type: 'inline_dropdown', topic: 'Algebra', prompt: 'Choose.', dropdowns: [{ id: 'menu', options: [{ id: 'yes', text: 'Yes' }], correctChoiceId: 'yes' }] };
  exams['exam-a'].mathSection.questions = [interactive, { ...interactive, id: 'hidden-dropdown-key', dropdowns: [{ id: 'menu', options: [{ id: 'yes', text: 'Yes' }], correctChoiceId: 'no' }] }];
  const pool = loadCrystalQuestions({ kind: 'exam-math', assessmentId: 'exam-a' }).questions;
  assert.deepEqual(pool.map(item => item.question.id), ['dropdown']);
  assert.equal(isExamQuestionCorrect(pool[0].question, { menu: 'yes' }), true);
});
