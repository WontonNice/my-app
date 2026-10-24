const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const { webcrypto } = require('node:crypto');
const { build } = require('esbuild');

let renderer;
async function loadRenderer() {
  if (!renderer) renderer = (async () => {
    const result = await build({
      stdin: {
        contents: `
          import React from 'react';
          import { renderToStaticMarkup } from 'react-dom/server';
          import { ExamSessionPage } from './client/src/pages/ExamSessionPage';
          import { resolveExamContent } from './client/src/content/exams';
          export { getExamSectionAccess, getOpenExamSubject } from './client/src/lib/examSessionProgress';
          export { createAssessmentSectionLines } from './client/src/lib/exam';
          export { resolveExamContent };
          import assessments from './server/data/assessments.json';
          export { assessments };
          export function renderExam(id, screen, transform = content => content) {
            const assessment = { ...assessments.find(item => item.id === id), sectionAccess: { english: true, math: true } };
            const content = transform(resolveExamContent(assessment));
            return renderToStaticMarkup(<ExamSessionPage gameSession={{
              assessment, content, screen, studentName: 'QA Student', answers: {},
              onAnswersChange() {}, onSubmit: async () => true,
              timerText: '3:00:00', subjectPosition: { current: 1, total: 57 },
            }} />);
          }
        `,
        resolveDir: resolve(__dirname, '..'), loader: 'tsx',
      },
      platform: 'node', format: 'cjs', bundle: true, write: false,
      jsx: 'automatic', loader: { '.css': 'empty' }, define: { 'import.meta.env': '{}' },
      plugins: [{ name: 'browser-only-mathfield', setup(plugin) {
        plugin.onResolve({ filter: /^mathlive$/ }, () => ({ path: 'mathlive', namespace: 'mathfield-stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'mathfield-stub' }, () => ({
          contents: 'export class MathfieldElement {}', loader: 'js',
        }));
      } }],
    });
    const module = { exports: {} };
    runInNewContext(result.outputFiles[0].text, {
      module, exports: module.exports, require, console, process, crypto: webcrypto,
      URL, URLSearchParams, setTimeout, clearTimeout, TextEncoder, TextDecoder,
      Buffer, queueMicrotask, setImmediate, clearImmediate, AbortController,
      ReadableStream, WritableStream, TransformStream,
      window: { location: { pathname: '/exam/2021-2022-form-a/session', search: '', origin: 'http://qa.test' },
        localStorage: { getItem: () => null }, sessionStorage: { getItem: () => null } },
    }, { filename: 'exam-session-render.cjs' });
    return module.exports;
  })();
  return renderer;
}

test('2021–2022 Form A renders a math question with no English passages', async () => {
  const { renderExam } = await loadRenderer();
  // Use the plain-text question here; diagram HTML is exercised in browser QA.
  const html = renderExam('2021-2022-form-a', 'mathQuestion', content => ({
    ...content, mathSection: { ...content.mathSection, questions: content.mathSection.questions.slice(1) },
  }));
  assert.match(html, /2021-2022 FORM A/);
  assert.match(html, /owner of a tree farm/);
  assert.match(html, /2021-2022-form-a-q59/);
});

test('a math-only exam selects math and still respects teacher locks', async () => {
  const { assessments, resolveExamContent, getExamSectionAccess, getOpenExamSubject } = await loadRenderer();
  const content = resolveExamContent(assessments.find(item => item.id === '2021-2022-form-a'));
  const access = getExamSectionAccess(content, { english: true, math: true });
  assert.equal(access.english, false);
  assert.equal(access.math, true);
  assert.equal(getOpenExamSubject('english', access), 'math');
  assert.equal(getOpenExamSubject('english', getExamSectionAccess(content, { english: true, math: false })), null);
});

test('launch summary reflects the actual math-only exam content', async () => {
  const { assessments, createAssessmentSectionLines } = await loadRenderer();
  const sections = createAssessmentSectionLines(assessments.find(item => item.id === '2021-2022-form-a'));
  assert.equal(sections.length, 2);
  assert.equal(sections[1].label, 'Math');
  assert.equal(sections[1].questionCount, 57);
});

test('registered exams render their available section introductions', async () => {
  const { assessments, resolveExamContent, renderExam } = await loadRenderer();
  for (const assessment of assessments) {
    const content = resolveExamContent(assessment);
    if (content.mathSection?.questions.length) assert.doesNotThrow(() => renderExam(assessment.id, 'mathIntro'), assessment.id);
    if (content.passageSets.length) assert.doesNotThrow(() => renderExam(assessment.id, 'passageIntro'), assessment.id);
  }
});
