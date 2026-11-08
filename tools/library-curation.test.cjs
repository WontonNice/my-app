const test = require('node:test');
const assert = require('node:assert/strict');
require.extensions['.ts'] = require('./content-transpile-cache.cjs').compileContentModule;
const { examLibraryBooks, getExamLibraryPassage } = require('../client/src/content/exams/passageLibrary.ts');
const { studentLibraryBooks } = require('../client/src/lib/studentMaterials.ts');
const { curateLibraryBook, libraryBookFingerprint, libraryBookNeedsReview, gradeLibraryBook } = require('../server/src/shared/libraryBooks.ts');

test('catalog never turns a passage illustration into a book cover', () => {
  const book = examLibraryBooks.find(b => !b.passageSet.passage.coverImage && Object.values(b.questionPassages).some(p => p.lines.some(l => l.image)));
  assert.ok(book);
  assert.equal(studentLibraryBooks.find(m => m.href.endsWith('/' + book.id)).coverImage, undefined);
});
test('curation flags changed versions and selects questions only for the library', () => {
  const book = examLibraryBooks.find(b => b.versions.length > 1 && b.passageSet.questions.length > 2);
  const original = JSON.stringify(book);
  const settings = { fingerprint: libraryBookFingerprint(book), questionIds: [book.passageSet.questions[1].id], reviewedAt: '2026-11-06T00:00:00Z' };
  assert.equal(libraryBookNeedsReview(book), true);
  assert.equal(libraryBookNeedsReview(book, settings), false);
  const selected = curateLibraryBook(book, settings);
  assert.equal(selected.passageSet.questions.length, 1);
  assert.equal(selected.passageSet.questionCount, 1);
  assert.equal(JSON.stringify(book), original);
  assert.throws(() => curateLibraryBook(book, { ...settings, questionIds: [] }));
  assert.throws(() => curateLibraryBook(book, { ...settings, questionIds: ['unknown'] }));
  assert.equal(libraryBookNeedsReview({ ...book, versions: [...book.versions, { id: 'new', label: 'New version' }] }, settings), true);
  const question = selected.passageSet.questions[0];
  assert.throws(() => gradeLibraryBook(selected, []));
  assert.ok(question);
});
test('teacher settings and server grading use the same content fingerprint for single and combined books', () => {
  const serverBooks = require('../server/data/library-books.json');
  for (const book of serverBooks) assert.equal(libraryBookFingerprint(getExamLibraryPassage(book.id)), libraryBookFingerprint(book), book.id);
  const book = structuredClone(examLibraryBooks.find(b => b.versions.length > 1));
  const fingerprint = libraryBookFingerprint(book);
  Object.values(book.questionPassages).forEach(p => { p.coverImage = { src: '/exam-images/uploaded-cover.png', alt: 'Uploaded cover' }; });
  assert.equal(libraryBookFingerprint(book), fingerprint, 'Cover changes do not invalidate question reviews');
});
