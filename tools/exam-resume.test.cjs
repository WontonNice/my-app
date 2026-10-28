const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { build } = require('esbuild');
const { runInNewContext } = require('node:vm');
let api;
before(async () => {
  const result = await build({ entryPoints: [path.resolve(__dirname, '../client/src/lib/examSessionProgress.ts')], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const module = { exports: {} }, storage = new Map();
  runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, console, URLSearchParams,
    window: { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) } },
  });
  api = module.exports;
});
const content = { passageSets: [
  { id: 'p1', questions: [{ id: 'e1' }, { id: 'e2' }] },
  { id: 'p2', questions: [{ id: 'e3' }, { id: 'e4' }] },
], standaloneSection: { questions: [{ id: 's1' }, { id: 's2' }] }, mathSection: { questions: [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }] } };
const progress = (answers = {}, navigation) => ({ answers, completedSections: [], status: 'in_progress', updatedAt: '2026-10-28T12:00:00Z', navigation });
const plain = value => JSON.parse(JSON.stringify(value));

test('English returns to the exact passage/question even when an earlier question is blank', () => {
  const saved = progress({ e1: 'A' }, { subject: 'english', english: { screen: 'passage', passageSetId: 'p2', questionId: 'e4' } });
  assert.deepEqual(plain(api.getExamResumePosition(content, 'english', saved)), { screen: 'passage', passageIndex: 1, questionIndex: 1 });
  const reordered = { ...content, passageSets: [content.passageSets[1], content.passageSets[0]] };
  assert.equal(api.getExamResumePosition(reordered, 'english', saved).passageIndex, 0);
});
test('standalone and Math keep separate exact positions, including answered review questions', () => {
  const saved = progress({ m1: '1', m2: '2', m3: '3' }, { subject: 'math', english: { screen: 'standaloneQuestion', questionId: 's2' }, math: { screen: 'mathQuestion', questionId: 'm2' } });
  assert.equal(api.getExamResumePosition(content, 'english', saved).questionIndex, 1);
  assert.equal(api.getExamResumePosition(content, 'math', saved).questionIndex, 1);
});
test('fresh attempts keep introductions; legacy drafts resume the first blank across English passages and standalone questions', () => {
  assert.equal(api.getExamResumePosition(content, 'english', null).screen, 'directions');
  assert.equal(api.getExamResumePosition(content, 'math', null).screen, 'mathIntro');
  let saved = progress({ e1: 'A', e2: 'B', e3: 'C' });
  assert.deepEqual(plain(api.getExamResumePosition(content, 'english', saved)), { screen: 'passage', passageIndex: 1, questionIndex: 1 });
  saved = progress({ e1: 'A', e2: 'B', e3: 'C', e4: 'D', s1: 'A', s2: '' });
  assert.equal(api.getExamResumePosition(content, 'english', saved).screen, 'standaloneQuestion');
  assert.equal(api.getExamResumePosition(content, 'english', saved).questionIndex, 1);
  assert.equal(api.getExamResumePosition(content, 'math', progress({ m1: '1' })).questionIndex, 1);
});
test('removed questions and malformed saved positions safely fall back without changing answers', () => {
  const saved = progress({ m1: '1' }, { subject: 'math', math: { screen: 'mathQuestion', questionId: 'removed' } });
  assert.equal(api.getExamResumePosition(content, 'math', saved).questionIndex, 1);
  saved.navigation.math = { screen: 'testOver', questionId: 'm3' };
  assert.equal(api.getExamResumePosition(content, 'math', saved).screen, 'mathQuestion');
  assert.deepEqual(saved.answers, { m1: '1' });
});
test('device save/reload preserves location without answers and isolates users and exams', () => {
  const navigation = { subject: 'english', english: { screen: 'passage', passageSetId: 'p2', questionId: 'e4' } };
  api.saveLocalExamSession('student1', 'exam1', {}, [], 'in_progress', {}, navigation);
  const saved = api.loadLocalExamSession('student1', 'exam1');
  assert.deepEqual(plain(saved.navigation), navigation);
  assert.equal(api.getExamResumePosition(content, 'english', saved).questionIndex, 1);
  api.saveLocalExamSession('student1', 'exam1', { e4: 'B' }, []);
  assert.deepEqual(plain(api.loadLocalExamSession('student1', 'exam1').navigation), navigation);
  assert.equal(api.loadLocalExamSession('student2', 'exam1'), null);
  assert.equal(api.loadLocalExamSession('student1', 'exam2'), null);
});
test('directions and section review screens are restored when still valid', () => {
  for (const screen of ['directions', 'readingDirections', 'passageEnd', 'endSection', 'standaloneDirections']) {
    const saved = progress({}, { subject: 'english', english: { screen, ...(['readingDirections', 'passageEnd'].includes(screen) ? { passageSetId: 'p2' } : {}) } });
    assert.equal(api.getExamResumePosition(content, 'english', saved).screen, screen);
  }
});
