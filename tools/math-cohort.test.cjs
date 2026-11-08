const test = require('node:test');
const assert = require('node:assert/strict');
const { withTypeScript } = require('./exam-catalog.cjs');
const { readCohortEvidence, cohortQuestions, cohortTopics } = withTypeScript(() => require('../client/src/features/math-command/mathCohort.ts'));
const response = (studentId, id, questionId, status) => ({ id, studentId, questionId, status, answer: status === 'unanswered' ? null : 'A', at: '2026-11-01', question: {}, assessmentId: 'exam' });

test('cohort pagination retains per-student attempts and counts shared sources only once', async () => {
  const records = [response('a','a-1','powers','correct'),response('a','a-2','roots','correct'),response('b','b-1','powers','incorrect'),response('b','b-2','roots','unanswered'),response('b','b-3','powers','pending')];
  const paths = [];
  const rows = await readCohortEvidence(async path => {
    paths.push(path); const url = new URL(path,'http://fixture'), student = url.pathname.split('/')[2];
    const own = records.filter(row => row.studentId === student), page = Number(url.searchParams.get('page'));
    assert.equal(url.searchParams.get('subcategory'), 'Exponents, Roots & Scientific Notation');
    return { items: own.slice(page * 2, page * 2 + 2), total: own.length };
  }, ['a','b'], { category:'Arithmetic & Number Sense', subcategory:'Exponents, Roots & Scientific Notation' });
  assert.equal(paths.length,3); assert.equal(rows.length,5);
  const questions = cohortQuestions(rows); assert.equal(questions.length,2);
  const powers = questions.find(row => row.id === 'powers').metrics;
  assert.equal(powers.accuracy,50); assert.equal(powers.pending,1); assert.equal(powers.uniqueStudents,2);
  assert.equal(questions.find(row => row.id === 'roots').metrics.unanswered,1);
});

test('denied student evidence rejects the comparison and cancellation stops pagination', async () => {
  await assert.rejects(() => readCohortEvidence(async path => { if(path.includes('/denied/')) throw new Error('Access denied'); return { items:[],total:0 }; }, ['a','denied'],{}), /Access denied/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(() => readCohortEvidence(async () => { throw new Error('must not request'); }, ['a'],{},controller.signal), {name:'AbortError'});
});

test('topics are a union so a student with no matching records is not treated as incorrect', () => {
  const topic = { id:'algebra:exponents',level:'subcategory',category:'Algebra',subcategory:'Exponents' };
  assert.deepEqual(cohortTopics([{skills:[topic]},{skills:[]},{skills:[topic,{...topic,id:'arithmetic:exponents',category:'Arithmetic'}]}]).map(item=>item.category), ['Algebra','Arithmetic']);
  assert.deepEqual(cohortQuestions([]),[]);
});
