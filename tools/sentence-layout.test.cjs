const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const {build} = require('esbuild');
const {load} = require('cheerio');

test('sentence blanks use inline text flow for modern, legacy and multiple blanks without changing math layouts', async () => {
  const result = await build({
    alias: require('./react-build-aliases.cjs')(resolve(__dirname, '..')),
    stdin: {contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import {SentenceDragDrop} from './client/src/components/SentenceDragDrop';
      import {MathDragDropResponse} from './client/src/components/ExamMathQuestion';
      export function render(question, answer = {}, math = false) {
        return renderToStaticMarkup(math ? <MathDragDropResponse question={question} answer={answer} onChange={()=>{}} /> : <SentenceDragDrop question={question} answer={answer} onChange={()=>{}} />);
      }
    `, resolveDir:resolve(__dirname, '..'), loader:'tsx'},
    platform:'node', format:'cjs', bundle:true, write:false, jsx:'automatic', loader:{'.css':'empty'},
    plugins:[{name:'browser-mathfield',setup(plugin) {
      plugin.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'stub'}));
      plugin.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export class MathfieldElement {}'}));
    }}],
  });
  const module = {exports:{}};
  require('node:vm').runInNewContext(result.outputFiles[0].text, {module, exports:module.exports, require, console, process, TextEncoder, TextDecoder, Buffer, setTimeout, clearTimeout, queueMicrotask, setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream});
  const {render} = module.exports;
  const choices = [{id:'A',text:'Moreover,'},{id:'B',text:'Thus,'}];
  const base = {id:'sentence',type:'transition_drop',choices,dragDropSlots:[{id:'blank-1',correctItemId:'B'}],dragDropContent:['(12) {{blank-1}} an archerfish looking up at insects on a branch will not see them where they actually are.']};
  for (const question of [base, {...base,dragDropSlots:undefined,transitionSentenceNumber:'(12)',transitionBlankAfter:'an archerfish looking up at insects on a branch will not see them where they actually are.',correctChoiceId:'B'}, {...base,dragDropContent:['Both {{blank-1}} and {{blank-2}}.'],dragDropSlots:[...base.dragDropSlots,{id:'blank-2',correctItemId:'A'}]}]) {
    const $ = load(render(question));
    assert.equal($('.exam-sentence-response .exam-math-drag-line').length, 1);
    assert.equal($('.exam-math-drag-line br').length, 0);
    assert.equal($('[data-answer-slot]').length, question.dragDropSlots?.length || 1);
    assert.equal($('.exam-math-drag-bank button').length, 2);
  }
  const filled = load(render(base, {'blank-1':'B'}));
  assert.equal(filled('[data-answer-slot]').text(), 'Thus,');
  assert.equal(filled('.exam-math-drag-bank button').length, 1);
  const math = load(render({...base,type:'math_drag_drop',items:choices}, {}, true));
  assert.equal(math('.exam-sentence-response').length, 0);
  const css = readFileSync(resolve(__dirname,'../client/src/styles/global.css'),'utf8');
  assert.match(css, /\.exam-sentence-response \.exam-math-drag-line\s*\{[^}]*display:\s*block\s*;/);
});
