const {test}=require('node:test'),assert=require('node:assert/strict'),{resolve}=require('node:path'),{build}=require('esbuild');
// Minimal inert DOM for the plain-text answer fixtures; browser verification covers the player.
class FixtureDOMParser {
 parseFromString(html){
  const body={innerHTML:html,querySelectorAll:()=>[]};
  Object.defineProperty(body,'textContent',{set(value){body.innerHTML=String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}});
  return {body,createTreeWalker:()=>({nextNode:()=>false})};
 }
}
async function render(readOnly=false){
 const page=resolve(__dirname,'../client/src/components/LibraryCorrectionsWorkspace.tsx');
 const question={id:'qa-q',type:'multiple_choice',topic:'Inference',prompt:'Which detail supports this idea?',choices:[{id:'A',text:'One'},{id:'B',text:'Two'}],correctChoiceId:'B'};
 const props={collectionLabel:'Passage',passageSet:{id:'qa-book',passage:{id:'qa-book',title:'Fictional passage',format:'prose',lines:[{text:'The original passage stays visible beside the question.'}]},questions:[question],questionCount:1},studentName:'QA Student',view:{attempt:{id:'qa-first',bookId:'qa-book',attemptNumber:1,score:0,totalQuestions:1,totalTimeSeconds:10,completedAt:'2026-10-07T12:00:00Z',questions:[{questionId:'qa-q',questionNumber:1,selectedAnswerId:'A',correctAnswerId:'B',isCorrect:false,timeSpentSeconds:10}]},correction:null},correctionDraft:{},correctionError:'',isLoading:false,isSubmitting:false,readOnly};
 const result=await build({alias:require('./react-build-aliases.cjs')(resolve(__dirname,'..')),plugins:[{name:'browser-only-mathfield',setup(plugin){plugin.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'stub'}));plugin.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export class MathfieldElement {}',loader:'js'}));}}],stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {LibraryCorrectionsWorkspace} from ${JSON.stringify(page)};const props=${JSON.stringify(props)};console.log(renderToStaticMarkup(React.createElement(LibraryCorrectionsWorkspace,{...props,onBack:()=>{},onDraftChange:()=>{},onRetry:()=>{},onSubmit:()=>{}})));`,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'}});
 const output=[];require('node:vm').runInNewContext(result.outputFiles[0].text,{require,DOMParser:FixtureDOMParser,NodeFilter:{SHOW_TEXT:4},crypto:require('node:crypto').webcrypto,window:{location:{pathname:'/study-hall/shsat/library/qa-book/corrections',search:'',origin:'http://qa.test'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}},console:{log:value=>output.push(value)},process,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream});return output.join('');
}
test('the dedicated passage correction workspace renders question navigation, required type selection, and explanations',async()=>{
 const html=await render();assert.match(html,/Correction question navigation/);assert.match(html,/Question type/);assert.match(html,/Choose a question type/);assert.match(html,/<select required=""/);assert.match(html,/Inference/);assert.match(html,/Submit all corrections/);assert.match(html,/Back to passage/);assert.match(html,/The original passage stays visible beside the question/);assert.match(html,/Exam question player/);assert.match(html,/Your submitted answer/);assert.match(html,/Show answer/);assert.match(html,/Previous question/);assert.match(html,/Next question/);
});
test('read-only student preview does not render submission controls or an editable question-type selector',async()=>{
 const html=await render(true);assert.match(html,/Student preview/);assert.doesNotMatch(html,/Submit all corrections/);assert.doesNotMatch(html,/Choose a question type/);assert.match(html,/readonly=""/i);
});
