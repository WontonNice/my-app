const test = require('node:test');
const assert = require('node:assert/strict');
require.extensions['.ts'] = require('./content-transpile-cache.cjs').compileContentModule;
const { examPassageLibrary } = require('../client/src/content/exams/passageLibrary.ts');
const { studentLibraryBooks, materialMatchesQuery } = require('../client/src/lib/studentMaterials.ts');
const { studyHallLocation, worksheetArea, worksheetMatchesTopic } = require('../client/src/lib/studyHallNavigation.ts');
test('exam excerpts stay passages, not full-length books', () => {
  assert.deepEqual(examPassageLibrary.filter(set => set.passage.passageType === 'long_reading').map(set => set.passage.id), []);
  assert.equal(studentLibraryBooks.find(item => item.title.includes('Library of Congress')).readingFormat, 'Informational');
  assert.equal(studentLibraryBooks.find(item => item.title.includes('Rip Van Winkle')).readingFormat, 'Literary');
});

test('every Part A library book is Revising/Editing and Long reading is no longer a type', () => {
  const partA = studentLibraryBooks.filter(item => item.examSections?.includes('revising_editing_a'));
  assert.ok(partA.length > 10);
  for (const item of partA) {
    assert.equal(item.readingFormat, 'Revising/Editing', item.title);
    assert.equal(item.questionType, 'Revising/Editing', item.title);
    assert.ok(materialMatchesQuery(item, 'Revising/Editing'), item.title);
  }
  assert.ok(studentLibraryBooks.every(item => item.readingFormat !== 'Long reading' && item.kind !== 'Long reading'));
});
test('library search finds grouped versions, sources, authors, and passage body in any word order', () => {
  const miracle = studentLibraryBooks.find(item => item.href.endsWith('/book-a-miracle-mile'));
  assert.ok(miracle.versionCount > 1);
  assert.ok(materialMatchesQuery(miracle, '2026 mile 2027'));
  assert.ok(materialMatchesQuery(miracle, 'official Bannister'));
  assert.ok(!materialMatchesQuery(miracle, 'nonexistentword'));
});
test('legacy links and worksheet category ownership remain supported', () => {
  assert.deepEqual(studyHallLocation('?subject=english'), {entry:'reading',section:'library'});
  assert.deepEqual(studyHallLocation('?subject=math&category=Algebra&topic=Inequalities'), {entry:'math',section:'categories'});
  assert.deepEqual(studyHallLocation('?entry=editing'), {entry:'editing',section:'categories'});
  assert.equal(worksheetArea({subject:'english',category:'Revising & Editing',topic:'Pronouns'}), 'editing');
  assert.equal(worksheetArea({subject:'english',category:'Advanced Readings'}), 'advanced');
  assert.ok(worksheetMatchesTopic({subject:'english',category:'Reading',topic:'authors-point-of-view'}, ["Author’s Point of View"]));
});
