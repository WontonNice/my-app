const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { buildStudentAnalytics, groupResponseEvidence, progression, responseIsBlank } = require('../../client/src/lib/studentAnalytics.ts');
const { createExamResult } = require('../src/shared/examGrading.ts');
const question = (id, type = 'multiple_choice') => ({ id, type, topic: 'Evidence & Support', points: 1, prompt: 'Read carefully.', choices: [{ id: 'A', text: 'Correct' }, { id: 'B', text: 'Wrong' }], correctChoiceId: 'A', correctTextAnswers: ['1/2'] });
const content = { assessmentId: 'fixture', title: 'Practice', passageSets: [{ id: 'set', label: 'Reading', passage: { id: 'p', title: 'Passage', lines: [] }, questions: [question('a'), question('b'), question('c')] }], mathSection: { id: 'math', questions: [question('m', 'numeric_entry')] } };
const input = (answers, date = '2026-09-01T12:00:00Z', sections = ['english', 'math']) => {
  const result = { ...createExamResult(content, answers, sections), completedAt: date };
  return { result, content, subjects: result.subjects, passages: result.passages };
};

test('exact responses, missing answers, numeric grading, and section-only submissions stay distinct', () => {
  const data = buildStudentAnalytics([input({ a: 'A', b: 'B', m: '1/2' })]);
  assert.deepEqual(data.evidence.map(row => row.status), ['Correct', 'Incorrect', 'Unanswered', 'Correct']);
  assert.equal(data.evidence[3].submittedAnswer, '1/2');
  assert.equal(data.evidence[1].submittedAnswer, 'B');
  assert.equal(data.skills[0].incorrect, 1);
  assert.equal(data.skills[0].unanswered, 1);
  const partial = buildStudentAnalytics([input({ a: 'A' }, undefined, ['english'])]);
  assert.equal(partial.exams[0].overall, null);
  assert.equal(partial.exams[0].math, null);
  assert.equal(partial.evidence.length, 3);
});

test('summary-only paper results never become invented incorrect or unanswered responses', () => {
  const paper = input({});
  paper.result.source = 'manual';
  const data = buildStudentAnalytics([paper]);
  assert.equal(data.evidence.length, 0);
  assert.equal(data.skills[0].incorrect, null);
  assert.equal(data.skills[0].unanswered, null);
  const granular = input({ a: 'B' }); granular.result.source = 'manual';
  assert.equal(buildStudentAnalytics([granular]).evidence[0].source, 'Paper');
});

test('zero, one, two, many, and incompatible assessments produce honest progression', () => {
  assert.equal(progression([], 'overall').change, null);
  assert.equal(progression(buildStudentAnalytics([input({ a: 'A' })]).exams, 'overall').change, null);
  const two = buildStudentAnalytics([input({ a: 'A' }), input({ a: 'A', b: 'A', c: 'A', m: '1/2' }, '2026-09-08T12:00:00Z')]);
  assert.equal(progression(two.exams, 'overall').change, 75);
  const incompatible = { ...two.exams[1], comparableKey: '114:57:57', total: 114 };
  assert.equal(progression([two.exams[0], incompatible], 'overall').change, null);
  const six = buildStudentAnalytics(Array.from({ length: 6 }, (_, index) => input(index < 3 ? {} : { a: 'A', b: 'A', c: 'A', m: '1/2' }, `2026-09-${String(index + 1).padStart(2, '0')}T12:00:00Z`)));
  assert.equal(progression(six.exams, 'overall').recentChange, 100);
  assert.equal(six.skills[0].change, 100);
});

test('missing dates and section values do not become zero scores or fictional trends', () => {
  const entry = input({ a: 'A' }); entry.result.completedAt = 'invalid'; entry.subjects = [];
  const data = buildStudentAnalytics([entry]);
  assert.equal(data.exams[0].date, null);
  assert.equal(data.exams[0].math, null);
  assert.equal(progression(data.exams, 'overall').latest, undefined);
  assert.equal(responseIsBlank({ first: '', second: '' }), true);
  assert.equal(responseIsBlank({ first: '', second: 'A' }), false);
});

test('question numbering follows saved passage order and excludes pending sections', () => {
  const extra = { ...content, passageSets: [content.passageSets[0], { id: 'other', passage: { id: 'p2', title: 'Other passage', lines: [] }, questions: [question('z')] }] };
  const result = { ...createExamResult(extra, { z: 'B' }, ['english']), passages: [{ id: 'other' }, { id: 'set' }] };
  const data = buildStudentAnalytics([{ result, content: extra, subjects: result.subjects, passages: result.passages }]);
  assert.equal(data.evidence[0].question.id, 'z');
  assert.equal(data.evidence[0].number, 1);
  assert.equal(data.evidence.at(-1).number, 4);
  assert.equal(data.evidence.some(row => row.section === 'math'), false);
});

test('passage and question-type patterns drill down to response evidence only', () => {
  const paper = input({}); paper.result.source = 'manual';
  const data = buildStudentAnalytics([input({ a: 'A', b: 'B', m: '1/2' }), paper]);
  const passages = groupResponseEvidence(data.evidence, 'passage');
  assert.equal(passages.length, 1);
  assert.equal(passages[0].total, 3);
  assert.equal(passages[0].correct, 1);
  assert.equal(passages[0].incorrect, 1);
  assert.equal(passages[0].unanswered, 1);
  assert.equal(passages[0].assessments.size, 1);
  const types = groupResponseEvidence(data.evidence, 'type');
  assert.equal(types.find(item => item.key === 'numeric_entry').correct, 1);
  assert.equal(types.reduce((sum, item) => sum + item.total, 0), 4);
});

test('changed exam membership cannot invent historical unanswered questions', () => {
  const entry = input({ a: 'A', b: 'B' });
  entry.content = { ...content, passageSets: [{ ...content.passageSets[0], questions: [...content.passageSets[0].questions, question('added-later')] }] };
  const data = buildStudentAnalytics([entry]);
  assert.equal(data.evidence.some(row => row.question.id === 'added-later'), false);
  assert.equal(data.evidence.some(row => row.question.id === 'c'), false);
  assert.equal(data.evidence.some(row => row.question.id === 'm'), true);
  assert.equal(data.exams[0].total, 4);
  assert.equal(data.exams[0].overall, 25);
});

test('TEI maps and multi-select arrays retain exact saved responses without normalization', () => {
  const tei = { ...question('tei', 'inline_dropdown'), dropdowns: [{ id: 'blank', correctChoiceId: 'A', options: [{ id: 'A', text: 'Correct' }, { id: 'B', text: 'Wrong' }] }] };
  const multi = { ...question('multi', 'multi_select'), correctChoiceIds: ['A', 'B'], requiredSelections: 2 };
  const fixture = { ...content, mathSection: { id: 'math', questions: [tei, multi] } };
  const answers = { tei: { blank: 'B' }, multi: ['B', 'A'] };
  const result = createExamResult(fixture, answers, ['math']);
  const data = buildStudentAnalytics([{ result, content: fixture, subjects: result.subjects, passages: result.passages }]);
  assert.deepEqual(data.evidence.map(row => row.submittedAnswer), [answers.tei, answers.multi]);
  assert.deepEqual(data.evidence.map(row => row.status), ['Incorrect', 'Correct']);
});

test('missing granular metadata stays empty and repeated timestamps retain distinct evidence', () => {
  const summary = input({}); summary.result.source = 'manual'; summary.result.topics = [];
  summary.subjects = summary.subjects.map(subject => ({ ...subject, topics: [] }));
  assert.equal(buildStudentAnalytics([summary]).skills.length, 0);
  const data = buildStudentAnalytics(Array.from({ length: 100 }, () => input({ a: 'A' })));
  assert.equal(data.evidence.length, 400);
  assert.equal(new Set(data.evidence.map(row => row.key)).size, 400);
});
