const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const { createExamResult, isExamQuestionCorrect } = require('../src/shared/examGrading.ts');
const { reviewQuestions, validateCorrections } = require('../src/shared/examCorrections.ts');

const english = { id: 'ela-1', type: 'multiple_choice', topic: 'Inference', prompt: 'Which claim is supported?', choices: [{ id: 'A', text: 'First claim' }, { id: 'B', text: 'Supported claim' }], correctChoiceId: 'B' };
const math = { id: 'math-1', type: 'numeric_entry', topic: 'Algebra', prompt: '2 + 3', correctTextAnswers: ['5'] };
const content = { assessmentId: 'test-exam', title: 'Test exam', passageSets: [{ id: 'passage-1', passage: { id: 'passage-1', title: 'Passage', lines: [{ text: 'Evidence.' }] }, questions: [english] }], mathSection: { questions: [math] } };
const result = createExamResult(content, { 'ela-1': 'A', 'math-1': '4' });
const completeResponses = [
  { questionId: 'ela-1', whyChosenIncorrect: 'It is not supported by the text.', whyCorrectAnswerCorrect: 'The passage gives evidence for B.', understanding: 4 },
  { questionId: 'math-1', whyChosenIncorrect: '', whyCorrectAnswerCorrect: 'Adding three to two gives five.', understanding: 5 },
];

test('English requires both explanations, Math requires only correct reasoning, all require integer ratings', () => {
  const questions = reviewQuestions(content, result);
  assert.equal(validateCorrections(questions, completeResponses).length, 2);
  for (const change of [{ whyChosenIncorrect: ' ' }, { whyCorrectAnswerCorrect: '' }, { understanding: 0 }, { understanding: 6 }, { understanding: 2.5 }, { understanding: '4' }]) {
    assert.throws(() => validateCorrections(questions, [{ ...completeResponses[0], ...change }, completeResponses[1]]));
  }
  assert.throws(() => validateCorrections(questions, [completeResponses[0], completeResponses[0]]));
  assert.throws(() => validateCorrections(questions, [completeResponses[0]]));
  assert.throws(() => validateCorrections(questions, [undefined, undefined]));
});

test('corrections include only completed sections; unanswered questions count as incorrect', () => {
  const partial = createExamResult(content, {}, ['math']);
  assert.deepEqual(reviewQuestions(content, partial).map(item => [item.section, item.number, item.isCorrect]), [['math', 1, false]]);
  const correct = createExamResult(content, { 'ela-1': 'B', 'math-1': '5' });
  assert.deepEqual(validateCorrections(reviewQuestions(content, correct), []), []);
});

test('grading supports every automatically scored interaction and rejects an empty number-line boundary', () => {
  const fixtures = [
    [english, 'B'], [math, '5'],
    [{ type: 'transition_drop', correctChoiceId: 'B' }, 'B'],
    [{ type: 'multi_select', correctChoiceIds: ['A', 'C'] }, ['C', 'A']],
    [{ type: 'graph_point_select', correctPointIds: ['p'] }, ['p']],
    [{ type: 'math_drag_drop', dragDropSlots: [{ id: 'slot', correctItemId: 'item' }] }, { slot: 'item' }],
    [{ type: 'inline_dropdown', dropdowns: [{ id: 'drop', correctChoiceId: 'A' }] }, { drop: 'A' }],
    [{ type: 'category_sort', correctPlacements: { item: 'target' } }, { item: 'target' }],
    [{ type: 'matrix_choice', correctPlacements: { sentence1: 'claim', sentence2: 'evidence' }, requiredPlacements: 2 }, { sentence1: 'claim', sentence2: 'evidence' }],
    [{ type: 'table_match', correctPlacements: { item: 'target' } }, { item: 'target' }],
    [{ type: 'number_line_response', numberLineResponse: { correctValue: 0, correctDirection: 'left', correctEndpoint: 'open' } }, { value: '0', direction: 'left', endpoint: 'open' }],
    [{ type: 'grid_in', correctTextAnswers: ['1/2', '0.5'] }, '0.5'],
    [{ type: 'short_response', correctTextAnswers: ['some words'] }, ' Some   Words '],
  ];
  fixtures.forEach(([question, answer]) => { assert.equal(isExamQuestionCorrect(question, answer), true, question.type); assert.equal(isExamQuestionCorrect(question, undefined), false, question.type); });
  assert.equal(isExamQuestionCorrect(fixtures[10][0], { value: '', direction: 'left', endpoint: 'open' }), false);
  assert.equal(isExamQuestionCorrect(fixtures[8][0], { sentence1: 'claim' }), false);
});

test('single-category sort accepts several correct cards and rejects distractors', () => {
  const question = {
    type: 'category_sort',
    categories: [{ id: 'tone', title: 'Phrases That Most Affect the Tone' }],
    correctPlacements: { alarm: 'tone', popular: 'tone' },
    requiredPlacements: 2,
  };
  assert.equal(isExamQuestionCorrect(question, { alarm: 'tone', popular: 'tone' }), true);
  assert.equal(isExamQuestionCorrect(question, { alarm: 'tone' }), false);
  assert.equal(isExamQuestionCorrect(question, { alarm: 'tone', message: 'tone' }), false);
  assert.equal(isExamQuestionCorrect(question, { alarm: 'tone', popular: 'tone', message: 'tone' }), false);
});

const rows = [];
const assessment = { id: 'test-exam', title: 'Test exam', classId: 'shsat', correctionsOpen: false, forms: [], formAssignments: {} };
const users = Object.fromEntries(['student', 'other', 'teacher', 'outsider'].map(id => [id, { id, app_metadata: { role: id === 'teacher' ? 'teacher' : 'student', class_ids: id === 'outsider' ? [] : ['shsat'] }, user_metadata: {} }]));
function stub(relative, exports) { const filename = require.resolve(relative); require.cache[filename] = { id: filename, filename, loaded: true, exports }; }
stub('../src/lib/auth.ts', { getAuthenticatedUser: async header => ({ user: users[header?.replace('Bearer ', '')] ?? null, error: 'Unauthorized' }), getUserRole: user => user.app_metadata.role, getEnrolledClassIds: metadata => metadata.class_ids });
stub('../src/config/assessments.ts', {
  findAssessmentForStudent: (id, classes) => id === assessment.id && classes.includes('shsat') ? assessment : undefined,
  listTeacherAssessments: () => [assessment],
  updateAssessmentCorrectionsAccess: (id, open) => { if (id !== assessment.id) return null; assessment.correctionsOpen = open; return assessment; },
});
stub('../src/lib/examContent.ts', { getExamContent: id => id === content.assessmentId ? content : null });
stub('../src/routes/progress.ts', { getDatabaseProgress: async user => ({ examResults: user.id === 'student' ? [result] : rows.filter(row => row.user_id === user.id && !row.assessment_id.startsWith('__')).map(row => row.result), practice: {} }) });
stub('../src/lib/supabase.ts', { supabase: {
  auth: { admin: { getUserById: async id => ({ data: { user: users[id] } }) } },
  from: () => {
    let filters = [];
    const query = {
      select() { return query; }, eq(key, value) { filters.push(row => row[key] === value); return query; },
      like(key, value) { filters.push(row => row[key].startsWith(value.replace(/%$/, ''))); return query; },
      maybeSingle() { return Promise.resolve({ data: rows.find(row => filters.every(filter => filter(row))) ?? null }); },
      insert(row) {
        if (rows.some(item => item.user_id === row.user_id && item.assessment_id === row.assessment_id)) return Promise.resolve({ error: { code: '23505' } });
        rows.push(row); return Promise.resolve({ error: null });
      },
      then(resolve) { return Promise.resolve({ data: rows.filter(row => filters.every(filter => filter(row))), error: null }).then(resolve); },
    }; return query;
  },
} });
let server, base;
before(async () => {
  const express = require('express');
  const app = express(); app.use(express.json()); app.use('/api/exam-review', require('../src/routes/examReview.ts').examReviewRouter);
  server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  base = `http://127.0.0.1:${server.address().port}/api/exam-review`;
});
after(async () => { if (server) await new Promise(resolve => server.close(resolve)); });
async function request(user, url, method = 'GET', body) {
  const response = await fetch(base + url, { method, headers: { Authorization: `Bearer ${user}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, data: await response.json() };
}

test('API enforces teacher-only unlocking, student ownership, locked GET/POST, validation and single submission', async () => {
  assert.equal((await request('none', '/student/test-exam')).status, 401);
  assert.equal((await request('student', '/teacher/test-exam/access', 'PATCH', { open: true })).status, 403);
  assert.equal((await request('student', '/student/test-exam')).status, 403);
  assert.equal((await request('student', '/student/test-exam', 'POST', {})).status, 403);
  assert.equal((await request('teacher', '/teacher/test-exam/access', 'PATCH', { open: true })).status, 200);
  assert.equal((await request('outsider', '/student/test-exam')).status, 404);
  assert.equal((await request('other', '/student/test-exam')).status, 409);
  const view = await request('student', '/student/test-exam');
  assert.equal(view.status, 200); assert.equal(view.data.questions[0].submittedAnswer, 'A');
  assert.equal((await request('student', '/student/test-exam', 'POST', { resultVersion: 'old', responses: completeResponses })).status, 409);
  assert.equal((await request('student', '/student/test-exam', 'POST', { resultVersion: view.data.resultVersion, responses: [completeResponses[0]] })).status, 400);
  assert.equal((await request('student', '/student/test-exam', 'POST', { resultVersion: view.data.resultVersion, responses: completeResponses })).status, 201);
  assert.equal((await request('student', '/student/test-exam', 'POST', { resultVersion: view.data.resultVersion, responses: completeResponses })).status, 409);
  assert.equal((await request('student', '/teacher/test-exam/submissions')).status, 403);
  const submissions = await request('teacher', '/teacher/test-exam/submissions');
  assert.equal(submissions.data.submissions[0].responses[1].understanding, 5);
  await request('teacher', '/teacher/test-exam/access', 'PATCH', { open: false });
  assert.equal((await request('student', '/student/test-exam')).status, 403);
  assert.equal((await request('student', '/student/test-exam', 'POST', { resultVersion: view.data.resultVersion, responses: completeResponses })).status, 403);
});

test('paper-answer API grades on the server, validates dates, and protects existing results', async () => {
  const input = { answers: { 'ela-1': 'B', 'math-1': '5' }, completedDate: '2026-09-01', completedSections: ['english', 'math'], correct: 999 };
  assert.equal((await request('student', '/teacher/test-exam/answers/other', 'POST', input)).status, 403);
  assert.equal((await request('teacher', '/teacher/test-exam/answers/outsider', 'POST', input)).status, 404);
  assert.equal((await request('teacher', '/teacher/test-exam/answers/other', 'POST', { ...input, completedDate: '2026-02-30' })).status, 400);
  assert.equal((await request('teacher', '/teacher/test-exam/answers/other', 'POST', { ...input, answers: { unknown: 'A' } })).status, 400);
  const saved = await request('teacher', '/teacher/test-exam/answers/other', 'POST', input);
  assert.equal(saved.status, 201); assert.equal(saved.data.result.correct, 2); assert.equal(saved.data.result.source, 'manual');
  assert.equal((await request('teacher', '/teacher/test-exam/answers/other', 'POST', input)).status, 409);
  assert.equal((await request('teacher', '/teacher/test-exam/answers/student', 'POST', input)).status, 409);
});
