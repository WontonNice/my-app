const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Render loaded result rows, using the real corrections URL and preview helpers.
function render(attempts, { teacher = false, search = '' } = {}) {
  const slots = [attempts, '', 0];
  const window = { location: { search, origin: 'http://localhost:5174' } };
  const stubs = {
    react: { ...React, useState: () => [slots.shift(), () => {}], useEffect: () => {} },
    '../lib/api': {},
    '../lib/studentMaterials': {
      getEnglishLibraryMaterial: id => id === 'old-version' ? { href: '/study-hall/shsat/library/book-combined' } : undefined,
      advancedPassageMaterials: [{ id: 'passage-advanced-story', href: '/advanced-practice/advanced-story' }],
    },
    '../styles/library-book-settings.css': {},
  };
  function load(relative) {
    const code = ts.transpileModule(readFileSync(resolve(__dirname, '../client/src', relative), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const module = { exports: {} };
    runInNewContext(code, { module, exports: module.exports, window, URL, URLSearchParams, require: id => {
      if (id in stubs) return stubs[id];
      if (id.endsWith('/correctionNavigation')) return load('lib/correctionNavigation.ts');
      if (id.endsWith('/studentPreview')) return load('lib/studentPreview.ts');
      return require(id);
    } });
    return module.exports;
  }
  const { LibraryProgress } = load('components/LibraryProgress.tsx');
  return renderToStaticMarkup(LibraryProgress({ accessToken: 'fixture', teacher }));
}

const attempt = (bookId, score = 2, attemptNumber = 1) => ({
  id: `${bookId}-${attemptNumber}`, bookId, title: bookId, score, totalQuestions: 3,
  attemptNumber, completedAt: '2026-11-10T15:00:00Z',
});

test('Results offers corrections immediately after one missed attempt without reopening the passage', () => {
  const html = render([attempt('book-story')]);
  assert.match(html, /href="\/study-hall\/shsat\/library\/book-story\/corrections"/);
  assert.match(html, />Corrections<\/a>/);
  assert.match(html, /You do not need to redo the passage/);
});

test('corrections eligibility uses the first attempt even when a perfect retake is listed first', () => {
  const html = render([attempt('book-story', 3, 2), attempt('book-story', 2, 1), attempt('perfect', 3)]);
  assert.equal((html.match(/>Corrections<\/a>/g) || []).length, 2);
  assert.match(html, /No corrections needed/);
  assert.doesNotMatch(html, /href="[^\"]*perfect\/corrections/);
});

test('correction links preserve legacy attempt IDs, advanced routes, and selected-student previews', () => {
  const html = render([attempt('old-version'), attempt('advanced-story')], {
    search: '?preview=student&teacherTools=1&studentId=selected-student&returnTo=%2Fteacher',
  });
  assert.match(html, /href="\/study-hall\/shsat\/library\/old-version\/corrections\?[^\"]*studentId=selected-student/);
  assert.match(html, /href="\/advanced-practice\/advanced-story\/corrections\?/);
  assert.doesNotMatch(html, /book-combined\/corrections/);
});

test('teacher results retain the teacher book link without student correction controls', () => {
  const html = render([attempt('book-story')], { teacher: true });
  assert.match(html, /href="\/teacher\/library\/book-story"/);
  assert.doesNotMatch(html, /\/corrections|>Review<|redo the passage/);
});
