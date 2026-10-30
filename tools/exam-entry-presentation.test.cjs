const {test,before}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {build}=require('esbuild');
const {runInNewContext}=require('node:vm');
const aliases=require('./react-build-aliases.cjs');
let api;
before(async()=>{
 const bundle=await build({alias:aliases(path.resolve(__dirname,'..')),stdin:{contents:`
   import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
   import {ExamMathQuestion} from './client/src/components/ExamMathQuestion';
   export * from './server/src/shared/examPresentation'; export * from './server/src/shared/examGrading';
   export const render=(question,answer='')=>renderToStaticMarkup(<ExamMathQuestion question={question} answer={answer} onChange={()=>{}}/>);
 `,resolveDir:path.resolve(__dirname,'..'),loader:'tsx'},bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',loader:{'.css':'empty'},plugins:[{name:'ssr-mathfield',setup(build){build.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'ssr-mathfield'}));build.onLoad({filter:/.*/,namespace:'ssr-mathfield'},()=>({contents:'export class MathfieldElement {}'}));}}]});
 const module={exports:{}};runInNewContext(bundle.outputFiles[0].text,{module,exports:module.exports,require,console,process,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream});api=module.exports;
});
const base=(type,extra={})=>({id:'existing-question',type,prompt:'Existing prompt',topic:'Algebra',points:2,...extra});
function show(current,source,storedBase=current){
 const content={assessmentId:'existing-exam',title:'Exam',passageSets:[],mathSection:{id:'math',title:'Math',questions:[current]},presentationOverrides:{questions:{[current.id]:{base:storedBase,question:source}}}};
 return api.applyExamPresentation(content).mathSection.questions[0];
}
test('source expression controls preserve canonical numeric/text grading and old string answers',()=>{
 for(const type of ['numeric_entry','short_response']){
  const canonical=base(type,{correctTextAnswers:['3'],textMatchMode:'exact'}),source={...canonical,type:'expression_entry',correctTextAnswers:['99'],textMatchMode:'normalized',points:7};
  const shown=show(canonical,source);
  assert.equal(shown.type,type);assert.equal(shown.id,canonical.id);assert.equal(shown.entryControl,'expression');assert.equal(shown.points,2);assert.deepEqual(shown.correctTextAnswers,['3']);assert.equal(shown.textMatchMode,'exact');
  for(const answer of ['3',' 3 ','99','3.0',''])assert.equal(api.isExamQuestionCorrect(shown,answer),api.isExamQuestionCorrect(canonical,answer),`${type}: ${JSON.stringify(answer)}`);
  const html=api.render(shown,'3');assert.match(html,/exam-math-entry-response is-advanced/);assert.match(html,/Math answer keypad/);assert.doesNotMatch(html,/is-short-response/);
 }
});
test('text controls can vary only for compatible entries, and later canonical edits win',()=>{
 const canonical=base('numeric_entry',{correctTextAnswers:['3']});
 const shown=show(canonical,{...canonical,type:'short_response'});assert.equal(shown.type,'numeric_entry');assert.equal(shown.entryControl,'text');assert.match(api.render(shown,'3'),/is-short-response/);assert.doesNotMatch(api.render(shown),/Math answer keypad/);
 const legacy=api.render(canonical);assert.match(legacy,/Math answer keypad/);assert.doesNotMatch(legacy,/is-advanced/);
 const edited={...canonical,prompt:'Teacher updated prompt'};assert.equal(show(edited,{...canonical,type:'expression_entry'},canonical),edited);
 const choice=base('multiple_choice',{choices:[{id:'A',text:'A'},{id:'B',text:'B'}],correctChoiceId:'A'});assert.equal(show(choice,{...choice,type:'expression_entry',entryControl:'expression'}).entryControl,undefined);
});
test('number-line source bounds, ticks and label spacing render while canonical endpoint grading stays unchanged',()=>{
 const canonical=base('number_line_response',{numberLineResponse:{min:-10,max:10,tickStep:1,labelStep:1,correctValue:2,correctEndpoint:'closed',correctDirection:'right'}});
 const source={...canonical,numberLineResponse:{min:-5,max:5,tickStep:.5,labelStep:5,correctValue:-2,correctEndpoint:'open',correctDirection:'left'}};
 const shown=show(canonical,source);assert.deepEqual(JSON.parse(JSON.stringify(shown.numberLineResponse)),{min:-5,max:5,tickStep:.5,labelStep:5,correctValue:2,correctEndpoint:'closed',correctDirection:'right'});
 assert.equal(api.isExamQuestionCorrect(shown,{value:'2',endpoint:'closed',direction:'right'}),true);assert.equal(api.isExamQuestionCorrect(shown,{value:'-2',endpoint:'open',direction:'left'}),false);
 const html=api.render(shown);assert.match(html,/>-5<\/text>/);assert.match(html,/>0<\/text>/);assert.match(html,/>5<\/text>/);assert.doesNotMatch(html,/>-4<\/text>|>4<\/text>/);
});
