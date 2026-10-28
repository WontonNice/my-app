const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const { perfectMathProgress, perfectEnglishProgress, weeklyLoginProgress, defaultAchievementDesign, defaultEnglishAchievementDesign, defaultLoginAchievementDesign, validateAchievementDesign } = require('../src/shared/achievements.ts');
const { classroomRemaining, formatClassroomTime, readClassroomTimer } = require('../../client/src/lib/classroomTimer.ts');
const result = (id, correct, total, extra = {}) => ({ assessmentId: id, attemptId: 'first', completedAt: '2026-10-24T12:00:00Z', title: id, completedSections: ['math'], subjects: [{ subject: 'Mathematics', correct, total }], ...extra });
const englishResult = (id, correct = 57, total = 57, extra = {}) => result(id, correct, total, { completedSections: ['english'], subjects: [{ subject: 'English Language Arts', correct, total }], ...extra });
const englishTotals = new Map([['2025-2026-form-a', 57], ['2025-2026-form-b', 57], ['2022-2023-form-a', 57], ['digital-shsat-practice-test-1', 57], ['custom-official-test', 57]]);

test('login badge requires seven consecutive days and preserves an earned badge after the streak breaks', () => {
  const now = new Date('2026-10-28T12:00:00Z');
  const profile = { login_streak: 6, login_best: 6, login_last_day: '2026-10-28', login_week_earned_at: null };
  const six = weeklyLoginProgress(profile, now);
  assert.equal(six.correct, 6); assert.equal(six.total, 7); assert.equal(six.currentStreak, 6); assert.equal(six.earnedAt, null); assert.ok(six.percentage < 100);
  const award = '2026-10-28T05:00:00Z';
  const seven = weeklyLoginProgress({ ...profile, login_streak: 7, login_best: 7, login_week_earned_at: award }, now);
  assert.equal(seven.percentage, 100); assert.equal(seven.earnedAt, award);
  const broken = weeklyLoginProgress({ ...profile, login_best: 12, login_last_day: '2026-10-20', login_week_earned_at: award }, now);
  assert.equal(broken.currentStreak, 0); assert.equal(broken.bestStreak, 12); assert.equal(broken.correct, 7); assert.equal(broken.earnedAt, award);
  assert.equal(weeklyLoginProgress(null, now).correct, 0);
  assert.equal(weeklyLoginProgress({ ...profile, login_week_earned_at: award }, now).earnedAt, null);
  assert.deepEqual(validateAchievementDesign(defaultLoginAchievementDesign), defaultLoginAchievementDesign);
});

test('login badge follows New York day boundaries and retains progress across yesterday', () => {
  const profile = { login_streak: 4, login_best: 6, login_last_day: '2026-11-01' };
  assert.equal(weeklyLoginProgress(profile, new Date('2026-11-03T04:59:59Z')).currentStreak, 4);
  assert.equal(weeklyLoginProgress(profile, new Date('2026-11-03T05:00:00Z')).currentStreak, 0);
  assert.equal(weeklyLoginProgress(profile, new Date('2026-11-03T05:00:00Z')).correct, 6);
});

test('English badge counts complete official English sections independently of Math', () => {
  const official = englishResult('2025-2026-form-a');
  const progress = perfectEnglishProgress([official, { ...official }], englishTotals);
  assert.equal(progress.id, 'perfect-english');
  assert.equal(progress.percentage, 100); assert.equal(progress.attempts, 1);
  assert.equal(progress.earnedAt, official.completedAt);
  assert.equal(perfectMathProgress([official]).attempts, 0);
  const nearly = perfectEnglishProgress([englishResult('2025-2026-form-a', 56)], englishTotals);
  assert.ok(nearly.percentage < 100); assert.equal(nearly.earnedAt, null);
  assert.deepEqual(validateAchievementDesign(defaultEnglishAchievementDesign), defaultEnglishAchievementDesign);
});

test('Prestige, spoofed official titles, sheets, unsubmitted English and partial sections never count', () => {
  const excluded = [
    englishResult('digital-shsat-practice-test-1', 57, 57, { title: 'Official SHSAT practice test' }),
    englishResult('custom-official-test', 57, 57, { title: '2025-2026 Form A' }),
    englishResult('manual-official', 57, 57, { source: 'manual', title: '2025-2026 Form A' }),
    englishResult('2025-2026-form-a', 57, 57, { source: 'answer_sheet' }),
    englishResult('2025-2026-form-a', 57, 57, { completedSections: ['math'] }),
    englishResult('2025-2026-form-a', 3, 3),
    englishResult('2025-2026-form-a', 58),
    englishResult('2025-2026-form-a', 0, 0),
    englishResult('2025-2026-form-a', 57.5),
    englishResult('2025-2026-form-a', 57, 57, { analysisContent: { passageSets: [{ questions: new Array(30) }] } }),
  ];
  assert.equal(perfectEnglishProgress(excluded, englishTotals).attempts, 0);
  assert.equal(perfectEnglishProgress([englishResult('2025-2026-form-a')], new Map()).attempts, 0);
});

test('English includes standalone questions and keeps the earliest perfect section evidence from history', () => {
  const first = englishResult('2025-2026-form-a', 57, 57, { completedAt: '2026-10-25T12:00:00Z', sectionCompletedAt: { english: '2026-10-20T12:00:00Z', math: '2026-10-25T12:00:00Z' }, analysisContent: { passageSets: [{ questions: new Array(48) }], standaloneSection: { questions: new Array(9) } } });
  const later = englishResult('2025-2026-form-b', 57, 57, { completedAt: '2026-10-21T12:00:00Z' });
  const progress = perfectEnglishProgress([later, first, englishResult('2022-2023-form-a', 30)], englishTotals);
  assert.equal(progress.earnedAt, '2026-10-20T12:00:00Z');
  assert.equal(progress.examTitle, first.title); assert.equal(progress.correct, 57); assert.equal(progress.total, 57); assert.equal(progress.attempts, 3);
  assert.equal(perfectEnglishProgress([englishResult('2025-2026-form-a', 57, 57, { completedAt: 'invalid' })], englishTotals).earnedAt, null);
});

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
stub('../src/routes/progress.ts', { getDatabaseProgress: async () => ({ examResults: [result('math', 7, 10), englishResult('digital-shsat-practice-test-1')], examHistory: [result('older', 10, 10), englishResult('2025-2026-form-a')] }) });
stub('../src/lib/examContent.ts', { getExamContent: id => englishTotals.has(id) ? { passageSets: [{ questions: new Array(48) }], standaloneSection: { questions: new Array(9) } } : null });
const stored = new Map();
let loginError = false;
const loginCalls = [];
stub('../src/lib/supabase.ts', { supabase: { async rpc(name, args) { loginCalls.push({ name, args }); return { data: { login_best: 8, login_streak: 1, login_last_day: require('../src/shared/accountPreferences.ts').accountDay(), login_week_earned_at: '2026-10-20T12:00:00Z' }, error: loginError ? { message: 'unavailable' } : null }; }, from() { let mutation, id, filters = []; return { select() { return this; }, eq(k, v) { if (k === 'id') id = v; filters.push(row => row[k] === v); return this; }, insert(row) { id = row.id; mutation = { insert: row }; return this; }, update(row) { mutation = { update: row }; return this; }, async maybeSingle() { if (mutation?.insert) { if (stored.has(id)) return { data: null, error: { code: '23505' } }; stored.set(id, mutation.insert); } if (mutation?.update) { if (!stored.has(id) || !filters.every(filter => filter(stored.get(id)))) return { data: null, error: null }; stored.set(id, mutation.update); } return { data: stored.get(id) ?? null, error: null }; } }; } } });
let server, url;
before(async () => { const app = require('express')(); app.use(require('express').json()); app.use('/api/achievements', require('../src/routes/achievements.ts').achievementsRouter); server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); }); url = `http://127.0.0.1:${server.address().port}/api/achievements`; });
after(async () => { await new Promise(resolve => server.close(resolve)); });
async function call(token, body, id = 'perfect-math') { const response = await fetch(url + (body ? `/${id}/design` : ''), { method: body ? 'PUT' : 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) }); return { status: response.status, data: await response.json() }; }
test('achievement API protects design editing and uses server student history', async () => {
  assert.equal((await call('missing')).status, 401); assert.equal((await call('outsider')).status, 403);
  assert.equal((await call('student', { design: defaultAchievementDesign, revision: 0 })).status, 403);
  const student = await call('student'); assert.equal(student.status, 200); assert.equal(student.data.progress.percentage, 100);
  const save = await call('teacher', { design: { ...defaultAchievementDesign, title: 'Math master' }, revision: 0 }); assert.equal(save.status, 200); assert.equal(save.data.revision, 1);
  assert.equal((await call('teacher', { design: defaultAchievementDesign, revision: 0 })).status, 409);
  assert.equal((await call('teacher', { design: defaultAchievementDesign, revision: 1 })).status, 200);
});

test('English API awards server history, excludes Prestige and stores each design with independent revisions', async () => {
  const student = await call('student');
  assert.equal(student.data.achievements.length, 3);
  const english = student.data.achievements.find(item => item.id === 'perfect-english');
  assert.equal(english.progress.percentage, 100); assert.equal(english.progress.attempts, 1); assert.equal(english.progress.examTitle, '2025-2026-form-a');
  assert.equal((await call('student', { design: defaultEnglishAchievementDesign, revision: 0 }, 'perfect-english')).status, 403);
  assert.equal((await call('teacher', { design: defaultEnglishAchievementDesign, revision: 0 }, 'unknown')).status, 404);
  const save = await call('teacher', { design: { ...defaultEnglishAchievementDesign, title: 'English master' }, revision: 0 }, 'perfect-english');
  assert.equal(save.status, 200); assert.equal(save.data.revision, 1);
  assert.equal((await call('teacher', { design: defaultEnglishAchievementDesign, revision: 0 }, 'perfect-english')).status, 409);
  const teacher = await call('teacher');
  assert.equal(teacher.data.achievements[1].design.title, 'English master');
  assert.equal(teacher.data.achievements[1].progress, undefined);
  assert.equal(teacher.data.achievements[0].design.title, defaultAchievementDesign.title);
  assert.equal(teacher.data.achievements[0].revision, 2);
});

test('login badge uses the authenticated account check-in and saves its own design', async () => {
  const student = await call('student');
  const login = student.data.achievements.find(item => item.id === 'login-week');
  assert.equal(login.progress.earnedAt, '2026-10-20T12:00:00Z'); assert.equal(login.progress.currentStreak, 1); assert.equal(login.progress.bestStreak, 8);
  assert.deepEqual(loginCalls.at(-1), { name: 'record_account_login', args: { p_user_id: 'student' } });
  assert.equal((await call('student', { design: defaultLoginAchievementDesign, revision: 0 }, 'login-week')).status, 403);
  const save = await call('teacher', { design: defaultLoginAchievementDesign, revision: 0 }, 'login-week');
  assert.equal(save.status, 200); assert.equal(save.data.revision, 1);
  assert.equal((await call('teacher', { design: defaultLoginAchievementDesign, revision: 0 }, 'login-week')).status, 409);
  loginError = true;
  try { assert.equal((await call('student')).status, 503); } finally { loginError = false; }
});
