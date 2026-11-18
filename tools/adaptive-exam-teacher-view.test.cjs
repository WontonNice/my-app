// The teacher's read-only Adaptive Math Exam view, end to end: the real client loader and report
// components call the real route, with a mocked database and fictional people.
const { test } = require('node:test'), assert = require('node:assert/strict'), { resolve } = require('node:path');
const { build } = require('esbuild'), { load } = require('cheerio');
require('./register-practice-generator.cjs'); // registers ts-node for the server TypeScript modules
const express = require(require.resolve('express', { paths: [resolve(__dirname, '../server')] }));
const engine = require('../server/src/shared/adaptiveMath/engine.ts');
const root = resolve(__dirname, '..'), examModule = '__adaptive__:math-v1';
const alice = '11111111-1111-4111-8111-111111111111', bob = '22222222-2222-4222-8222-222222222222', dana = '44444444-4444-4444-8444-444444444444', teacher = '99999999-9999-4999-8999-999999999999';

/** A fictional exam: every third answer is missed, and one of the misses is a skip. */
function sampleExam(seed, count) {
  let state = engine.createAdaptiveState(seed, Date.UTC(2026, 10, 3, 15), 'exam');
  for (let step = 0; step < count; step++) {
    const question = engine.adaptiveQuestion(state), right = step % 3 !== 0;
    const answer = right ? question.correctChoiceId ?? question.correctTextAnswers[0] : question.choices ? question.choices.find(choice => choice.id !== question.correctChoiceId).id : '0.5';
    state = engine.advanceAdaptive(engine.submitAdaptiveAnswer(engine.addAdaptiveTime(engine.selectAdaptiveAnswer(state, answer), 20000), Date.UTC(2026, 10, 12, 15) + step * 1000, step === 6));
  }
  return engine.finishAdaptive(state, Date.UTC(2026, 10, 12, 16));
}

test('a teacher reads a student’s adaptive exam report from the dashboard; nobody else can, and nothing is written', async t => {
  const records = new Map(), writes = [];
  function from(table) {
    assert.equal(table, 'math_practice_checkpoints');
    const filters = {};
    const matching = () => [...records.values()].filter(row => Object.entries(filters).every(([key, value]) => row[key] === value));
    return {
      select() { return this; }, eq(key, value) { filters[key] = value; return this; },
      insert(row) { writes.push(['insert', row]); return this; }, update(row) { writes.push(['update', row]); return this; },
      maybeSingle() { return { data: matching()[0] ?? null, error: null }; },
      then(done) { done({ data: matching(), error: null }); },
    };
  }
  const db = require.resolve('../server/src/lib/supabase.ts');
  require.cache[db] = { id: db, filename: db, loaded: true, exports: { supabase: { from } } };
  const auth = require.resolve('../server/src/lib/auth.ts');
  require.cache[auth] = { id: auth, filename: auth, loaded: true, exports: {
    // A signed-out browser sends an empty token.
    getAuthenticatedUser: async header => { const id = String(header ?? '').replace(/^Bearer ?/, ''); return { user: id && { id, app_metadata: { role: id === teacher ? 'teacher' : 'student' } }, error: 'Sign in again.' }; },
    getEnrolledClassIds: () => ['shsat'],
  } };
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/infinite-practice', require('../server/src/routes/infinitePractice.ts').infinitePracticeRouter);
  const server = await new Promise(done => { const s = app.listen(0, '127.0.0.1', () => done(s)); });
  t.after(() => new Promise(done => server.close(done)));

  const exam = sampleExam('alice-exam-1', 45), summary = engine.adaptiveSummary(exam), opened = engine.createAdaptiveState('dana-exam-1', Date.UTC(2026, 10, 9, 15), 'exam');
  records.set(alice, { user_id: alice, module_id: examModule, best: summary.mastered, session: exam, revision: 'r1' });
  records.set(dana, { user_id: dana, module_id: examModule, best: 0, session: opened, revision: 'r2' });
  assert.ok(summary.weak > 0 && exam.responses.some(row => row.skipped), 'the sample exam has topics that need practice and a skipped question');

  // Bundle the client code the dashboard uses. Only the math typesetting is replaced, because it needs a browser.
  const bundle = await build({ alias: require('./react-build-aliases.cjs')(root), stdin: { resolveDir: root, loader: 'tsx', contents: `
    import { renderToStaticMarkup } from 'react-dom/server';
    import { loadStudentAdaptiveExam, loadAdaptiveRoster } from './client/src/features/adaptive-math/adaptiveExamResults';
    import { StudentAdaptiveExamReportView } from './client/src/features/adaptive-math/StudentAdaptiveExamReport';
    import { AdaptiveReport, AdaptiveStats } from './client/src/features/adaptive-math/AdaptiveReport';
    import { StudentProgressRoster } from './client/src/components/StudentProgressRoster';
    import { adaptiveSummary } from './server/src/shared/adaptiveMath/engine';
    export async function report(token, studentId, studentName) {
      let load;
      try { load = { status: 'ready', state: await loadStudentAdaptiveExam(token, studentId) }; } catch (error) { load = { status: 'error', message: error.message }; }
      return { status: load.status, html: renderToStaticMarkup(<StudentAdaptiveExamReportView studentName={studentName} load={load} />) };
    }
    export const studentReport = state => renderToStaticMarkup(<><AdaptiveStats state={state} summary={adaptiveSummary(state)} /><AdaptiveReport state={state} summary={adaptiveSummary(state)} reader="student" /></>);
    export async function roster(token, students) {
      let adaptive;
      try { adaptive = await loadAdaptiveRoster(token); } catch (error) { return { error: error.message }; }
      return { adaptive, html: renderToStaticMarkup(<StudentProgressRoster students={students} inputsFor={() => []} onSelect={() => {}} adaptive={adaptive} onOpenAdaptive={() => {}} />) };
    }
  ` }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic', loader: { '.css': 'empty' }, define: { 'import.meta.env': '{}' }, plugins: [{ name: 'plain-math-text', setup(plugin) {
    plugin.onLoad({ filter: /[\\/]components[\\/]ExamReviewQuestion\.tsx$/ }, () => ({ loader: 'tsx', contents: `export function ExamText({ text = '' }) { return <span>{text}</span>; } export function ExamAnswer({ answer }) { return <span className="qa-answer">{typeof answer === 'string' ? answer : JSON.stringify(answer ?? null)}</span>; }` }));
  } }] });
  const requests = [], realFetch = globalThis.fetch;
  // The browser calls the API on its own origin; here that origin is the test server.
  globalThis.fetch = (url, init = {}) => { requests.push(`${init.method ?? 'GET'} ${url}`); return realFetch('http://127.0.0.1:' + server.address().port + url, init); };
  t.after(() => { globalThis.fetch = realFetch; });
  const client = { exports: {} };
  new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, client, client.exports);
  const view = client.exports;

  // A teacher sees the same report the student sees, worded for a teacher.
  const seen = await view.report(teacher, alice, 'Alice Example'), page = load(seen.html);
  assert.equal(seen.status, 'ready');
  const stats = Object.fromEntries(page('.am-stats div').toArray().map(item => [page(item).find('dt').text(), page(item).find('dd').text()]));
  assert.deepEqual(stats, { 'Questions answered': '45', Correct: `${Math.round(100 * exam.correct / 45)}%${exam.correct} of 45`, 'Topics mastered': `${summary.mastered}of ${summary.total}`, 'Time spent': '15m 0s' });
  assert.equal(summary.total, 26);
  assert.match(page('.am-teacher-heading p').text(), /Started Nov 3, 2026 · Last activity Nov 12, 2026 · Exam mode/);
  assert.deepEqual(page('.am-focus li').toArray().map(item => page(item).clone().children('small').remove().end().text()).sort(), summary.topics.filter(topic => topic.status === 'weak').map(topic => topic.label).sort());
  assert.equal(page('#am-focus-title').text(), 'Needs practice');
  assert.equal(page('.am-topics tbody tr').length, 26, 'every topic has a row');
  for (const topic of summary.topics) {
    const row = page('.am-topics tbody tr').filter((_, item) => page(item).find('th').text() === topic.label);
    assert.equal(row.length, 1, topic.label);
    assert.equal(row.find('.am-status').text(), { mastered: 'Mastered', learning: 'Building', weak: 'Needs practice', new: 'Not tested yet' }[topic.status]);
    assert.equal(row.find('.am-score').text(), topic.attempts ? `${topic.correct} of ${topic.attempts} correct` : '—');
    if (topic.attempts) assert.equal(row.find('.am-meter').attr('aria-label'), `Estimated mastery ${Math.round(topic.mastery * 100)}%`);
  }
  const missed = exam.responses.filter(row => !row.correct).slice(-20).reverse();
  assert.equal(page('.am-missed details').length, missed.length);
  assert.equal(page('#am-missed-title').text(), 'Recent missed questions');
  missed.forEach((row, index) => {
    const item = page('.am-missed details').eq(index), question = engine.adaptiveQuestionFor(exam.seed, row);
    assert.match(item.find('summary').text(), new RegExp(`^Question ${row.n + 1}`));
    assert.equal(item.find('.am-missed-prompt').text(), question.prompt);
    assert.deepEqual(item.find('dt').toArray().map(term => page(term).text()), ['Student’s answer', 'Correct answer']);
    assert.equal(item.find('dd').eq(0).text(), row.skipped ? 'Skipped' : String(row.answer));
    assert.equal(item.find('dd').eq(1).text(), String(question.correctTextAnswers?.[0] ?? question.correctChoiceId));
    assert.equal(item.find('.am-missed-why span').text(), question.explanation);
  });
  // Read-only: no controls that start, continue, restart or change the exam.
  assert.equal(page('button, input, select, textarea, a, form').length, 0);
  assert.doesNotMatch(seen.html, /Start exam|Continue exam|Keep practicing|Start over|Exam mode<|Practice mode</);

  // The student's own page is built from the same components, worded for the student.
  const own = load(view.studentReport(exam));
  assert.equal(own('#am-focus-title').text(), 'Focus on these next');
  assert.equal(own('.am-missed dt').first().text(), 'Your answer');
  assert.equal(own('.am-topics').html(), page('.am-topics').html());
  assert.equal(own('.am-stats').html(), page('.am-stats').html());

  // A student who has not started, or has only opened the exam, is described plainly.
  const none = await view.report(teacher, bob, 'Bob Example');
  assert.equal(load(none.html)('.am-teacher-empty').text(), 'Bob Example has not started the Adaptive Math Exam.');
  assert.equal(load(none.html)('.am-stats, .am-topics, .am-missed').length, 0);
  const justOpened = await view.report(teacher, dana, 'Dana Example');
  assert.equal(load(justOpened.html)('.am-teacher-empty').text(), 'Dana Example opened the Adaptive Math Exam on Nov 9, 2026 but has not answered a question yet.');

  // A student or a signed-out visitor gets no report, even with the right student ID.
  const asStudent = await view.report(bob, alice, 'Alice Example');
  assert.equal(asStudent.status, 'error');
  assert.equal(load(asStudent.html)('[role="alert"]').text(), 'You can only view your own adaptive exam.');
  assert.equal(load(asStudent.html)('.am-stats, .am-topics, .am-missed').length, 0);
  const signedOut = await view.report('', alice, 'Alice Example');
  assert.equal(signedOut.status, 'error');
  assert.equal(load(signedOut.html)('[role="alert"]').text(), 'Sign in again.');
  assert.equal(load(signedOut.html)('.am-stats, .am-topics, .am-missed').length, 0);

  // The class roster shows topics mastered and opens the report; it is closed to students too.
  const people = [[alice, 'Alice Example'], [bob, 'Bob Example'], [dana, 'Dana Example']].map(([id, fullName]) => ({ id, fullName, username: fullName.split(' ')[0].toLowerCase(), lastLoginAt: null, progress: { examResults: [], practice: {} }, examSessions: {} }));
  const classView = await view.roster(teacher, people), table = load(classView.html);
  assert.deepEqual(classView.adaptive, { total: 26, students: { [alice]: summary.mastered, [dana]: 0 } });
  const column = table('thead th').toArray().findIndex(cell => table(cell).text() === 'Adaptive math exam');
  assert.ok(column > 0);
  const cells = Object.fromEntries(table('tbody tr').toArray().map(row => [table(row).find('td').first().find('button').text(), table(row).find('td').eq(column)]));
  assert.equal(cells['Alice Example'].find('button').text(), `${summary.mastered} of 26`);
  assert.equal(cells['Alice Example'].find('small').text(), 'topics mastered');
  assert.equal(cells['Bob Example'].text(), 'Not started');
  assert.equal(cells['Dana Example'].find('button').text(), '0 of 26');
  assert.deepEqual(await view.roster(bob, people), { error: 'Teacher access is required.' });
  assert.deepEqual(await view.roster('', people), { error: 'Sign in again.' });

  // Everything above was read with GET requests, and the database was never written.
  assert.ok(requests.length >= 8);
  for (const request of requests) assert.match(request, /^GET \/api\/infinite-practice\/adaptive-exam(\?studentId=[0-9a-f-]{36}|\/roster)$/);
  assert.deepEqual(writes, []);
  assert.deepEqual(records.get(alice).session, exam);
});
