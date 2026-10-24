const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { build } = require('esbuild');
const fixture = require('./fixtures/document-import/expected-import.json');

test('shared math renderer preserves emphasis, formulas, short answers and interaction state', async () => {
  const result = await build({ stdin: { contents: `
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import {ExamMathQuestion} from './client/src/components/ExamMathQuestion';
    const base = {id:'qa',topic:'Algebra',prompt:'First line\\nSelect **two** and *only* two.',points:1,explanation:''};
    console.log(renderToStaticMarkup(<ExamMathQuestion question={{...base,type:'short_response',correctTextAnswers:['-4'],stimulus:'\\\\(4w=2w-8\\\\)'}} answer="-4" onChange={()=>{}}/>));
    console.log(renderToStaticMarkup(<ExamMathQuestion question={{...base,type:'inline_dropdown',dropdownContent:['Choose {{a}} then {{b}}.'],dropdowns:[{id:'a',options:[{id:'one',text:'One'}]},{id:'b',options:[{id:'two',text:'Two'}]}]}} answer={{a:'one',b:'two'}} onChange={()=>{}}/>));
    console.log(renderToStaticMarkup(<ExamMathQuestion question={{...base,type:'number_line_response',numberLineResponse:{min:0,max:5,tickStep:0}}} onChange={()=>{}}/>));
    for (const entryVariable of ['w', 'W', 'θ', undefined, 'w=']) console.log(renderToStaticMarkup(<ExamMathQuestion question={{...base,type:'numeric_entry',entryLayout:'x_equals',entryVariable,correctTextAnswers:['-4']}} answer="-4" onChange={()=>{}}/>));
  `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic', loader: {'.css':'empty'}, plugins: [{name:'non-keypad-ssr',setup(build) {
    // MathLive mounts its browser-only custom element in an effect. SSR verifies
    // the real question/prefix rendering; interactive behavior is checked in Chrome.
    build.onResolve({filter:/^mathlive$/}, () => ({path:'mathlive',namespace:'non-keypad'}));
    build.onLoad({filter:/.*/,namespace:'non-keypad'}, () => ({contents:'export class MathfieldElement {}'}));
  }}] });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, console: { log: text => output.push(text) }, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream });
  assert.match(output[0], /<strong>two<\/strong>/); assert.match(output[0], /<em>only<\/em>/);
  assert.match(output[0], /First line\n/); assert.match(output[0], /class="katex"/);
  assert.match(output[0], /value="-4"/); assert.doesNotMatch(output[0], /math-field|\*\*two\*\*/);
  assert.equal((output[1].match(/<select/g) || []).length, 2);
  assert.match(output[1], /value="one" selected=""/); assert.match(output[1], /value="two" selected=""/);
  assert.match(output[2], /Set valid number-line bounds/);
  for (const [i, variable] of ['w', 'W', 'θ', 'x', 'x'].entries()) {
    assert.match(output[i + 3], /exam-math-entry-prefix/);
    assert.ok(output[i + 3].includes(`<mi>${variable}</mi>`), `Expected ${variable} prefix`);
    assert.match(output[i + 3], /Math answer keypad/);
  }
});
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
    import contract from './tools/document-import.cjs';
    const fixtures = ${JSON.stringify(fixture.passages)};
    for (const p of fixtures) console.log(renderToStaticMarkup(<ExamReviewPassage passage={createSourcePassage({...p,id:'qa',images:[{src:'/exam-images/fixture.png',alt:'Source table'}]})}/>));
    console.log(renderToStaticMarkup(<ExamReviewPassage passage={createSourcePassage({id:'headings',title:'Headings',text:'Source',richText:'<p>First body.</p><h2>E-books can reduce reading comprehension.</h2><p>Second body.</p>'})}/>));
    for (const p of fixtures) for (const q of p.questions) console.log(renderToStaticMarkup(<LibraryQuestionResponse question={contract.normalizeChoiceLabels(q)} value="" onChange={()=>{}}/>));
    `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' }, platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic', loader: { '.css': 'empty' } });
  const output = [];
  require('node:vm').runInNewContext(result.outputFiles[0].text, { require, console: { log: text => output.push(text) }, DOMParser: FixtureDOMParser, NodeFilter: { SHOW_TEXT: 4 }, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream });
  const html = output.join('\n');
  assert.equal((html.match(/type="radio"/g) || []).length, 28);
  assert.equal((html.match(/alt="Source table"/g) || []).length, 3);
  assert.match(html, /The Seed Ledger/); assert.match(html, /by Mira Vale/);
  assert.match(html, /7 \+ 5 = 12/); assert.match(html, /the rain came through;/);
  assert.match(html, /Day \| Rain \(mm\)<br\/?>(?:Mon \| 2)<br\/?>Tue \| 5/);
  assert.match(html, />A\.</); assert.match(html, />D\.</);
  assert.match(html, /class="exam-paragraph-number">1<\/span>/);
  assert.match(html, /class="exam-prose-line is-heading"><span class="exam-review-text"><strong>E-books can reduce reading comprehension\.<\/strong><\/span>/);
  assert.match(html, /class="exam-paragraph-number">2<\/span><span class="exam-review-text">Second body\.<\/span>/);
  assert.doesNotMatch(html, /questions\.pdf|topicConfidence|sourceReviewed/);
});
