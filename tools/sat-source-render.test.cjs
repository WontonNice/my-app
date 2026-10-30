const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {build}=require('esbuild');
const {parse}=require('../extensions/sat-crash-course-reader/dom-fixture.cjs');
const aliases=require('./react-build-aliases.cjs');

// Inert fixture DOM supports template traversal. Browser sanitization is covered separately.
class FixtureDOMParser {
  parseFromString(html) {
    const body=parse(html);body.innerHTML=html;body.querySelectorAll=()=>[];
    Object.defineProperty(body,'textContent',{set(value){body.innerHTML=String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}});
    return {body,createTreeWalker:()=>({nextNode:()=>false})};
  }
}
test('sentence drag/drop preserves rich source layout around live answer slots and legacy plain layouts',async()=>{
  const result=await build({alias:aliases(resolve(__dirname,'..')),stdin:{contents:`
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import {SentenceDragDrop} from './client/src/components/SentenceDragDrop';
    const base={id:'rich',type:'transition_drop',choices:[{id:'A',text:'one'},{id:'B',text:'two'}],dragDropSlots:[{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:'B'}],dragDropContent:['Plain fallback {{blank-1}} {{blank-2}}'],dragDropContentHtml:'<p><strong>Source emphasis</strong></p><table><tr><td>{{blank-1}}</td><td><em>{{blank-2}}</em></td></tr></table>'};
    console.log(renderToStaticMarkup(<SentenceDragDrop question={base} answer={{'blank-1':'A'}} onChange={()=>{}}/>));
    console.log(renderToStaticMarkup(<SentenceDragDrop question={{id:'old',type:'transition_drop',choices:base.choices,transitionBlankBefore:'Legacy before',transitionBlankAfter:'Legacy after',correctChoiceId:'B'}} answer="B" onChange={()=>{}}/>));
  `,resolveDir:resolve(__dirname,'..'),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'}});
  const output=[];
  require('node:vm').runInNewContext(result.outputFiles[0].text,{require,console:{log:v=>output.push(v)},DOMParser:FixtureDOMParser,Node:{TEXT_NODE:3,ELEMENT_NODE:1},NodeFilter:{SHOW_TEXT:4},process,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream});
  assert.match(output[0],/<strong><span[^>]*>Source emphasis<\/span><\/strong>/);assert.match(output[0],/<table><tr><td>[\s\S]*?<button/);assert.match(output[0],/<td><em>[\s\S]*?<button/);assert.equal((output[0].match(/aria-label="Blank /g)||[]).length,2);assert.match(output[0],/aria-label="Blank 1: one. Click to clear"/);assert.doesNotMatch(output[0],/Plain fallback|\{\{blank/);
  assert.match(output[1],/Legacy before/);assert.match(output[1],/Legacy after/);assert.match(output[1],/aria-label="Blank 1: two. Click to clear"/);
});
