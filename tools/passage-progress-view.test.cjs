const { test } = require('node:test'), assert = require('node:assert/strict'), { resolve } = require('node:path'), { build } = require('esbuild');
async function render(inventory, completion = 'not_completed') {
  const page = resolve(__dirname, '../client/src/components/StudentPassageProgress.tsx');
  const result = await build({ stdin: { contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {StudentPassageProgress} from ${JSON.stringify(page)};console.log(renderToStaticMarkup(React.createElement(StudentPassageProgress,{inventory:${JSON.stringify(inventory)},completion:${JSON.stringify(completion)},onCompletionChange:()=>{}})));`, resolveDir: resolve(__dirname, '..'), loader: 'tsx' }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic' });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, console: { log: value => output.push(value) }, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream });
  return output.join('');
}
test('student progress renders distinct source versions, completed dates, No Data and both completion filter choices', async () => {
  const row = (id, versionLabel, lastCompletedAt, hasCompleted = true) => ({ content: { id, kind: 'passage', title: 'Same passage', subject: 'English', passageCategory: 'official_handbook', versionLabel, skills: [], aliases: [id], questionCount: 4, category: 'Poem' }, status: hasCompleted ? 'Assigned' : 'Planned', hasCompleted, lastCompletedAt, priorCount: 0 });
  const html = await render([row('a', '2020-2021 Form B', '2026-10-10T15:00:00Z'), row('b', '2024-2025 Form A', null), row('c', 'Untaken source', null, false)], 'completed');
  assert.match(html, /2020-2021 Form B/); assert.match(html, /2024-2025 Form A/);
  assert.equal((html.match(/Same passage/g) || []).length, 2);
  assert.match(html, /Oct 10, 2026/); assert.match(html, /<td>No Data<\/td>/);
  assert.match(html, /Not yet completed/); assert.match(html, /All passages/);
  assert.doesNotMatch(html, /Untaken source/);
});
test('unavailable inventory does not claim that all passages are not completed', async () => {
  const html = await render(undefined);
  assert.match(html, /Passage history is not available yet/);
  assert.doesNotMatch(html, /All available passages have a recorded completion|Not yet completed \(0\)/);
});

test('unfinished checklist includes never assigned and in-progress passages but excludes completed reassignments', async () => {
  const row = (id, status, hasCompleted = false) => ({ content: { id, kind: 'passage', title: id, subject: 'English', skills: [], aliases: [id] }, status, hasCompleted, priorCount: 0 });
  const html = await render([row('Untouched passage', 'Never assigned'), row('Partly read passage', 'In progress'), row('Completed then reassigned', 'Assigned', true)]);
  assert.match(html, /<td>Untouched passage/);
  assert.match(html, /<td>Partly read passage/);
  assert.doesNotMatch(html, /<td>Completed then reassigned/);
  assert.match(html, /aria-pressed="true">Not yet completed \(2\)/);
  assert.match(html, /Completed \(1\)/);
  assert.match(html, /All passages \(3\)/);
  assert.match(html, /Assessment filters above do not limit this checklist/);
});

test('empty library and fully completed library have distinct messages', async () => {
  const empty = await render([]);
  assert.match(empty, /No English passages are available/);
  assert.doesNotMatch(empty, /All available passages have a recorded completion/);
  const completed = await render([{ content: { id: 'done', kind: 'passage', title: 'Done', subject: 'English', skills: [] }, status: 'Completed', priorCount: 1 }]);
  assert.match(completed, /All available passages have a recorded completion/);
});
