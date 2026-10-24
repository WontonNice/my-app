const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { perfectMathProgress, defaultAchievementDesign, validateAchievementDesign } = require('../src/shared/achievements.ts');
const { classroomRemaining, formatClassroomTime, readClassroomTimer } = require('../../client/src/lib/classroomTimer.ts');
const result = (id, correct, total, extra = {}) => ({ assessmentId: id, attemptId: 'first', completedAt: '2026-10-24T12:00:00Z', title: id, completedSections: ['math'], subjects: [{ subject: 'Mathematics', correct, total }], ...extra });

test('achievement follows best submitted Math and retains earlier perfect attempts', () => {
  const perfect = result('first-test', 57, 57);
  const next = result('second-test', 35, 57);
  const progress = perfectMathProgress([next, perfect, { ...perfect }]);
  assert.equal(progress.percentage, 100); assert.equal(progress.attempts, 2); assert.equal(progress.earnedAt, perfect.completedAt); assert.equal(progress.examTitle, 'first-test');
});
test('unsubmitted Math, sheet results, invalid totals and incomplete section scopes never unlock', () => {
  const results = [result('english', 57, 57, { completedSections: ['english'] }), result('sheet', 57, 57, { source: 'answer_sheet' }), result('bad', 58, 57), result('empty', 0, 0), result('subset', 3, 3, { analysisContent: { mathSection: { questions: new Array(57) } } })];
  assert.equal(perfectMathProgress(results).attempts, 0);
  assert.equal(perfectMathProgress([result('nearly', 56, 57)]).earnedAt, null);
  assert.ok(perfectMathProgress([result('nearly', 56, 57)]).percentage < 100);
});

test('award date and evidence match the earliest perfect Math section even when English is submitted later', () => {
  const firstMath = result('earliest-math', 10, 10, { completedAt: '2026-10-24T12:00:00Z', sectionCompletedAt: { math: '2026-10-20T15:00:00Z', english: '2026-10-24T12:00:00Z' } });
  const laterMath = result('later-math', 57, 57, { completedAt: '2026-10-21T12:00:00Z' });
  const progress = perfectMathProgress([laterMath, firstMath]);
  assert.equal(progress.earnedAt, '2026-10-20T15:00:00Z');
  assert.equal(progress.examTitle, 'earliest-math');
  assert.equal(progress.correct, 10); assert.equal(progress.total, 10);
  assert.equal(perfectMathProgress([result('legacy', 5, 5, { sectionCompletedAt: { math: 'invalid' } })]).earnedAt, '2026-10-24T12:00:00Z');
});
test('teacher-recorded paper Math tests count and title/design input is bounded', () => {
  assert.equal(perfectMathProgress([result('paper', 10, 10, { source: 'manual' })]).percentage, 100);
  assert.deepEqual(validateAchievementDesign(defaultAchievementDesign), defaultAchievementDesign);
  for (const changes of [{ image: 'javascript:alert(1)' }, { image: 'data:image/svg+xml;base64,PHN2Zz4=' }, { accent: 'red' }, { title: '' }, { frame: 'unknown' }]) assert.throws(() => validateAchievementDesign({ ...defaultAchievementDesign, ...changes }));
});
test('class timer survives refresh, pause/resume and clock expiry without negative time', () => {
  const state = readClassroomTimer(JSON.stringify({ durationMs: 180000, remainingMs: 120000, endsAt: 300000 }));
  assert.equal(classroomRemaining(state, 200000), 100000);
  assert.equal(classroomRemaining(state, 400000), 0);
  assert.equal(classroomRemaining({ ...state, endsAt: null }, 400000), 120000);
  assert.equal(formatClassroomTime(999), '00:00:01'); assert.equal(formatClassroomTime(10800000), '03:00:00');
  assert.equal(readClassroomTimer('{bad').durationMs, 10800000);
});

const users = { teacher: { id: 'teacher', app_metadata: { role: 'teacher' } }, student: { id: 'student', app_metadata: { role: 'student', class_ids: ['shsat'] } }, outsider: { id: 'outsider', app_metadata: { role: 'student', class_ids: [] } } };
const stub = (file, exports) => { const id = require.resolve(file); require.cache[id] = { id, filename: id, loaded: true, exports }; };
stub('../src/lib/auth.ts', { getAuthenticatedUser: async header => ({ user: users[header?.replace('Bearer ', '')], error: 'Sign in required' }), getUserRole: user => user.app_metadata.role, getEnrolledClassIds: data => data.class_ids ?? [] });
stub('../src/routes/progress.ts', { getDatabaseProgress: async () => ({ examResults: [result('math', 7, 10)], examHistory: [result('older', 10, 10)] }) });
let stored = null;
stub('../src/lib/supabase.ts', { supabase: { from() { let mutation, filters = []; return { select() { return this; }, eq(k, v) { filters.push(row => row[k] === v); return this; }, insert(row) { mutation = { insert: row }; return this; }, update(row) { mutation = { update: row }; return this; }, async maybeSingle() { if (mutation?.insert) { if (stored) return { data: null, error: { code: '23505' } }; stored = mutation.insert; } if (mutation?.update) { if (!stored || !filters.every(filter => filter(stored))) return { data: null, error: null }; stored = mutation.update; } return { data: stored, error: null }; } }; } } });
let server, url;
before(async () => { const app = require('express')(); app.use(require('express').json()); app.use('/api/achievements', require('../src/routes/achievements.ts').achievementsRouter); server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); }); url = `http://127.0.0.1:${server.address().port}/api/achievements`; });
after(async () => { await new Promise(resolve => server.close(resolve)); });
async function call(token, body) { const response = await fetch(url + (body ? '/perfect-math/design' : ''), { method: body ? 'PUT' : 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: response.status, data: await response.json() }; }
test('achievement API protects design editing and uses server student history', async () => {
  assert.equal((await call('missing')).status, 401); assert.equal((await call('outsider')).status, 403);
  assert.equal((await call('student', { design: defaultAchievementDesign, revision: 0 })).status, 403);
  const student = await call('student'); assert.equal(student.status, 200); assert.equal(student.data.progress.percentage, 100);
  const save = await call('teacher', { design: { ...defaultAchievementDesign, title: 'Math master' }, revision: 0 }); assert.equal(save.status, 200); assert.equal(save.data.revision, 1);
  assert.equal((await call('teacher', { design: defaultAchievementDesign, revision: 0 })).status, 409);
  assert.equal((await call('teacher', { design: defaultAchievementDesign, revision: 1 })).status, 200);
});
