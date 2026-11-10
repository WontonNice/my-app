const {test}=require('node:test'),assert=require('node:assert/strict'),{resolve}=require('node:path'),{build}=require('esbuild');
const {fixtures}=require('./tei-fixtures.cjs');
const {parse}=require('../extensions/sat-crash-course-reader/dom-fixture.cjs');
// Inert authored-content DOM for SSR. Actual hot-text selection and sanitization
// run in the browser preview; this check covers response structure and keys.
class FixtureDOMParser {
 parseFromString(html){
  const body=parse(html);body.innerHTML=html;body.querySelectorAll=()=>[];
  Object.defineProperty(body,'textContent',{set(value){body.innerHTML=String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}});
  return {body,createTreeWalker:()=>({nextNode:()=>false})};
 }
}

async function renderPreview(questions,showAnswers,together=false){
 const built=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {TeacherQuestionPreview} from './client/src/components/TeacherQuestionReview';const questions=${JSON.stringify(questions)};const elements=questions.map((question,index)=><TeacherQuestionPreview key={index} question={question} number={index+1} showAnswers={${showAnswers}}/>);console.log(${together}?[renderToStaticMarkup(<>{elements}</>)]:elements.map(element=>renderToStaticMarkup(element)));`,resolveDir:resolve(__dirname,'..'),loader:'tsx'},alias:require('./react-build-aliases.cjs')(resolve(__dirname,'..')),plugins:[{name:'browser-only-mathfield',setup(plugin){plugin.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'stub'}));plugin.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export class MathfieldElement {}',loader:'js'}));}}],platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'}});
 let output;
 require('node:vm').runInNewContext(built.outputFiles[0].text,{require,console:{...console,log:value=>{output=value;}},document:{compatMode:'CSS1Compat',createElement:()=>({innerHTML:''}),createTreeWalker:()=>({nextNode:()=>false})},DOMParser:FixtureDOMParser,Node:{TEXT_NODE:3,ELEMENT_NODE:1},NodeFilter:{SHOW_TEXT:4},process,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream});
 return output;
}

test('teacher previews render authored TEI interactions and human-readable keys, with answer visibility respected',async()=>{
 const shown=await renderPreview(fixtures,true),hidden=await renderPreview(fixtures,false);
 for(let index=0;index<fixtures.length;index++){
  const question=fixtures[index];
  assert.match(shown[index],/Correct answer/,question.id);
  assert.doesNotMatch(shown[index],/\[object Object\]/,question.id);
  assert.doesNotMatch(shown[index],/not ready in the player/,question.id);
  assert.match(shown[index],/<fieldset disabled/,question.id);
  assert.doesNotMatch(hidden[index],/teacher-question-key/,question.id);
  if(['matrix_choice','table_match'].includes(question.type))assert.match(shown[index],/<table/,question.id);
  if(question.type==='inline_dropdown')assert.match(shown[index],/<select/,question.id);
  if(question.type==='graph_point_select'||question.hotSpot)assert.match(shown[index],/<svg|<img/,question.id);
  if(question.selectionHtml)assert.match(shown[index],/exam-inline-selection/,question.id);
  if(question.type==='transition_drop')assert.match(shown[index],/exam-sentence-response/,question.id);
 }
});

test('the same question in a comparison and list has independent radio groups and accessible labels',async()=>{
 const question=fixtures.find(question=>question.type==='multiple_choice'&&!question.hotSpot&&!question.selectionHtml);
 const [html]=await renderPreview([question,question],true,true);
 const names=[...html.matchAll(/<input[^>]*name="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(names).size,2);
 const ids=[...html.matchAll(/<h4 id="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(ids).size,2);
});
