const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { build } = require('esbuild');

const renderer = build({
  stdin: { contents: `
    import { renderToStaticMarkup } from 'react-dom/server';
    import { StudentRecordFilterContext } from './client/src/lib/studentRecordFilters';
    import { StudentPassageProgress } from './client/src/components/StudentPassageInventory';
    import { StudentAnalysisDetails } from './client/src/components/StudentAnalysisDetails';
    export function passages(inventory, values) {
      return renderToStaticMarkup(<StudentRecordFilterContext.Provider value={{values, setValues:()=>{}}}>
        <StudentPassageProgress inventory={inventory} completion="not_completed" onCompletionChange={()=>{}} />
      </StudentRecordFilterContext.Provider>);
    }
    export function emptyAnalysis(values) {
      return renderToStaticMarkup(<StudentRecordFilterContext.Provider value={{values, setValues:()=>{}}}>
        <StudentAnalysisDetails evidence={[]} exams={[]} basis="all" inspect={()=>{}} />
      </StudentRecordFilterContext.Provider>);
    }
  `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' },
  platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic',
}).then(result => {
  const module = { exports: {} };
  require('node:vm').runInNewContext(result.outputFiles[0].text, {
    module, exports: module.exports, require, process, console, TextEncoder, TextDecoder, Buffer,
    setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController,
    ReadableStream, WritableStream, TransformStream,
  });
  return module.exports;
});

const row = (id, section, category, hasCompleted = false) => ({
  content: { id, title: id, kind: 'passage', subject: 'English', passageSection: section,
    passageCategory: category, skills: [], aliases: [id] },
  status: hasCompleted ? 'Completed' : 'Never assigned', hasCompleted, priorCount: 0,
});

test('shared passage filters apply to the next student using only that student’s completion data', async () => {
  const { passages } = await renderer;
  const filters = { 'PassageInventory.section': 'revising_editing_a', 'PassageInventory.category': 'official_handbook', 'PassageInventory.order': 'title' };
  const first = passages([
    row('First student unfinished', 'revising_editing_a', 'official_handbook'),
    row('Reading excluded', 'reading', 'official_handbook'),
    row('Prestige excluded', 'revising_editing_a', 'prestige'),
  ], filters);
  const second = passages([
    row('First student unfinished', 'revising_editing_a', 'official_handbook', true),
    row('Second student unfinished', 'revising_editing_a', 'official_handbook'),
    row('Reading excluded', 'reading', 'official_handbook'),
  ], filters);
  assert.match(first, /<strong>First student unfinished<\/strong>/);
  assert.doesNotMatch(second, /<strong>First student unfinished<\/strong>/);
  assert.match(second, /<strong>Second student unfinished<\/strong>/);
  for (const html of [first, second]) {
    assert.match(html, /value="revising_editing_a" selected=""/);
    assert.match(html, /value="official_handbook" selected=""/);
    assert.match(html, /value="title" selected=""/);
    assert.doesNotMatch(html, /<strong>(Reading|Prestige) excluded<\/strong>/);
  }
});

test('analysis retains selected area, source and skill even when the next student has no evidence', async () => {
  const { emptyAnalysis } = await renderer;
  const html = emptyAnalysis({
    'AnalysisDetails.area': 'editing', 'AnalysisDetails.category': 'prestige',
    'AnalysisDetails.topic': 'Sentence Structure', 'AnalysisDetails.activity': 'exam',
  });
  assert.match(html, /aria-pressed="true">Revising/);
  assert.match(html, /value="prestige" selected=""/);
  assert.match(html, /<option selected="">Sentence Structure<\/option>/);
  assert.match(html, /No verified responses match/);
});
