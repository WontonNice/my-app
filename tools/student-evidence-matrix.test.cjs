const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { build } = require('esbuild');

async function render(evidence, exams, section, dimension = 'skill') {
  const result = await build({
    stdin: { contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { StudentEvidenceMatrix } from './client/src/components/StudentEvidenceMatrix';
      import { detailedGroups } from './client/src/lib/analyticsDetails';
      console.log(renderToStaticMarkup(<StudentEvidenceMatrix section={${JSON.stringify(section)}} groups={detailedGroups(${JSON.stringify(evidence)}, ${JSON.stringify(dimension)})} exams={${JSON.stringify(exams)}} dimension={${JSON.stringify(dimension)}} inspect={()=>{}} />));
    `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' },
    platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic',
  });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, console: { log: value => output.push(value) }, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream });
  return output.join('');
}

const row = (section, examKey, topic, status = 'Correct') => ({ section, examKey, question: { topic, type: 'multiple_choice' }, kind: 'exam', identity: `${section}:${examKey}:${topic}`, status, date: '2026-10-01' });
const exam = (key, title) => ({ key, title, date: '2026-10-01', scope: 'Section' });

test('subject matrices isolate shared skills and full-exam responses and omit unrelated assessments', async () => {
  const evidence = [row('english', 'ela', 'Shared skill'), row('english', 'full', 'Shared skill', 'Incorrect'), row('math', 'math', 'Shared skill'), row('math', 'full', 'Shared skill')];
  const exams = [exam('ela', 'Reading assessment'), exam('math', 'Math assessment'), exam('full', 'Full assessment'), exam('paper', 'Summary only')];
  const english = await render(evidence, exams, 'english');
  assert.match(english, /English · Assessment × skill evidence matrix/);
  assert.match(english, /Reading assessment/);
  assert.match(english, /Full assessment/);
  assert.match(english, /0% correct, 0 of 1 responses/);
  assert.doesNotMatch(english, /Math assessment|Math · Shared skill|Summary only/);
  const math = await render(evidence, exams, 'math');
  assert.match(math, /Math · Assessment × skill evidence matrix/);
  assert.match(math, /Math assessment/);
  assert.match(math, /Full assessment/);
  assert.doesNotMatch(math, /Reading assessment|English · Shared skill|0% correct, 0 of 1 responses/);
});

test('each subject gets its own first group page and only its matching assessment pages', async () => {
  const evidence = [...Array.from({ length: 26 }, (_, i) => row('english', 'ela', `Reading ${i}`)), ...Array.from({ length: 9 }, (_, i) => row('math', `math-${i}`, 'Algebra'))];
  const exams = [exam('ela', 'Reading assessment'), ...Array.from({ length: 9 }, (_, i) => exam(`math-${i}`, `Math assessment ${i}`))];
  const english = await render(evidence, exams, 'english');
  const math = await render(evidence, exams, 'math');
  assert.match(english, /26 groups · Page 1\/2/);
  assert.doesNotMatch(english, /English · Reading 25/);
  assert.match(english, /Records 1–1 of 1/);
  assert.match(math, /Math · Algebra/);
  assert.match(math, /Records 1–8 of 9/);
  assert.doesNotMatch(math, /Math assessment 8|Reading assessment/);
});

test('missing subject evidence renders an honest empty state without a blank matrix', async () => {
  const html = await render([row('english', 'ela', 'Reading')], [exam('ela', 'Reading assessment')], 'math');
  assert.match(html, /No verified Math responses match/);
  assert.doesNotMatch(html, /<table|0%/);
});
