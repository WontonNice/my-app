const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { build } = require('esbuild');
const fixture = require('./fixtures/document-import/expected-import.json');
// This fixture contains only plain source text and <br>/entities. Supply the DOM
// surface needed by ExamText for Node SSR; browser sanitization is not mocked as tested.
class FixtureDOMParser {
  parseFromString(html) {
    const body = { innerHTML: html, querySelectorAll: () => [] };
    Object.defineProperty(body, 'textContent', { set(text) { body.innerHTML = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); } });
    return { body, createTreeWalker: () => ({ nextNode: () => false }) };
  }
}

test('actual student passage/answer components render source structure, every choice and visual without teacher metadata', async () => {
  const result = await build({ stdin: { contents: `
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import {createSourcePassage} from './client/src/content/exams/formatters';
    import {ExamReviewPassage} from './client/src/components/ExamReviewQuestion';
    import {LibraryQuestionResponse} from './client/src/components/LibraryQuestionResponse';
    const fixtures = ${JSON.stringify(fixture.passages)};
    for (const p of fixtures) console.log(renderToStaticMarkup(<ExamReviewPassage passage={createSourcePassage({...p,id:'qa',images:[{src:'/exam-images/fixture.png',alt:'Source table'}]})}/>));
    for (const p of fixtures) for (const q of p.questions) console.log(renderToStaticMarkup(<LibraryQuestionResponse question={q} value="" onChange={()=>{}}/>));
    `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic', loader: { '.css': 'empty' } });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, console: { log: text => output.push(text) }, DOMParser: FixtureDOMParser, NodeFilter: { SHOW_TEXT: 4 }, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream });
  const html = output.join('\n');
  assert.equal((html.match(/type="radio"/g) || []).length, 28);
  assert.equal((html.match(/alt="Source table"/g) || []).length, 3);
  assert.match(html, /The Seed Ledger/); assert.match(html, /by Mira Vale/);
  assert.match(html, /7 \+ 5 = 12/); assert.match(html, /the rain came through;/);
  assert.match(html, /Day \| Rain \(mm\)<br\/?>(?:Mon \| 2)<br\/?>Tue \| 5/);
  assert.match(html, />E\.</); assert.match(html, />H\.</);
  assert.doesNotMatch(html, /questions\.pdf|topicConfidence|sourceReviewed/);
});
