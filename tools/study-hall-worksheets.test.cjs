const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const { build } = require('esbuild');
const { resolve } = require('node:path');
let api;
before(async () => {
  const result = await build({ stdin: { contents: `
    import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
    import {WorksheetProgress} from './client/src/components/WorksheetProgress';
    export * from './server/src/shared/studyHallWorksheets';
    export {buildStudentAnalytics} from './client/src/lib/studentAnalytics';
    export {createExamResult} from './server/src/shared/examGrading';
    export const render = props => renderToStaticMarkup(<WorksheetProgress {...props}/>);
  `, resolveDir:resolve(__dirname,'..'),loader:'tsx' }, platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',external:['react','react-dom','react/jsx-runtime','react-dom/server'],loader:{'.css':'empty'},define:{'import.meta.env':'{}'},plugins:[{name:'ssr-mathfield',setup(build){build.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'ssr-mathfield'}));build.onLoad({filter:/.*/,namespace:'ssr-mathfield'},()=>({contents:'export class MathfieldElement {}'}));}}] });
  const module = {exports:{}};
  require('node:vm').runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,require,console,process,URL,URLSearchParams,TextEncoder,TextDecoder,Buffer,setTimeout,clearTimeout,queueMicrotask,window:{location:{origin:'http://localhost:5173'}}}); api=module.exports;
});
const placement = {subject:'math',category:'Algebra',topic:'Inequalities'};
const sheet = {id:'worksheet-qa',title:'Inequalities worksheet',studyHallWorksheet:placement};
const exam = {id:'exam-qa',title:'Full exam'};
const previewContext = {isPreview:true,mode:'teacher',query:'?preview=teacher&teacherTools=1',returnHref:'/teacher'};
test('classification and category links use placement, never exam length or title', () => {
  assert.equal(api.isStudyHallWorksheet(sheet),true);
  assert.equal(api.isStudyHallWorksheet({...exam,title:'Short worksheet',durationMinutes:10}),false);
  assert.equal(api.isStudyHallWorksheet({...sheet,studyHallWorksheet:null}),false);
  const link = new URL(api.worksheetLibraryHref(placement),'https://example.test');
  assert.equal(link.pathname,'/study-hall/shsat/worksheets');
  assert.equal(link.searchParams.get('category'),'Algebra');
  assert.equal(link.searchParams.get('topic'),'Inequalities');
  assert.deepEqual([...api.worksheetIds([sheet,exam])],['worksheet-qa']);
});
test('worksheet progress shows category, saved progress and scores without pulling in exams', () => {
  const html = api.render({assessments:[sheet,exam],results:[{assessmentId:sheet.id,title:sheet.title,correct:2,total:3,percentage:67,completedAt:'2026-11-06T12:00:00Z'}],sessions:{[sheet.id]:{answers:{q:'B'},status:'in_progress',updatedAt:'2026-11-06T13:00:00Z'}},teacher:true,previewContext});
  assert.match(html,/Study Hall Worksheets/);assert.match(html,/Inequalities worksheet/);assert.match(html,/Algebra/);assert.match(html,/2 \/ 3 · 67%/);assert.match(html,/In progress/);assert.match(html,/1 answers saved/);
  assert.doesNotMatch(html,/>Full exam</);assert.doesNotMatch(html,/"q":/);
});

test('collection links include worksheets from different categories and scopes', () => {
  const collection='Grade 9 Mathematics Sample Questions';
  const mixed=api.worksheetLibraryHref({subject:'math',area:'math',category:'Math',scope:'mixed',collection});
  const focused=api.worksheetLibraryHref({...placement,scope:'focused',collection});
  assert.equal(mixed,focused);
  const params=new URL(mixed,'https://example.test').searchParams;
  assert.equal(params.get('collection'),collection);
  assert.equal(params.get('category'),null);
  assert.equal(params.get('scope'),null);
  const alias={subject:'math',category:'Math',collection:'SHSAT 9 · Official Handbook'};
  assert.equal(api.worksheetLibraryHref(alias),mixed);
  assert.equal(api.worksheetPlacement({id:'alias',studyHallWorksheet:alias}).collection,collection);
});
test('worksheet grading reuses the existing grader and retains response identity without a full-exam average', () => {
  const question={id:'same-question',type:'multiple_choice',prompt:'Choose one',topic:'Algebra',choices:[{id:'A',text:'1'},{id:'B',text:'2'}],correctChoiceId:'B'};
  const content={assessmentId:sheet.id,title:sheet.title,passageSets:[],mathSection:{id:'math',title:'Math',questions:[question]}};
  const result=api.createExamResult(content,{'same-question':'B'},['math']);
  assert.equal(result.correct,1);assert.equal(result.total,1);assert.equal(result.answers['same-question'],'B');
  const input={result,content,subjects:result.subjects,passages:result.passages};
  const regular=api.buildStudentAnalytics([input]);
  const worksheet=api.buildStudentAnalytics([{...input,kind:'practice',sourceLabel:'Study Hall worksheet'}]);
  assert.equal(worksheet.exams[0].complete,false);
  assert.equal(worksheet.evidence[0].identity,regular.evidence[0].identity);
  assert.equal(worksheet.evidence[0].isCorrect,true);
  const blankResult=api.createExamResult(content,{},['math']);
  const blank=api.buildStudentAnalytics([{result:blankResult,content,subjects:blankResult.subjects,passages:blankResult.passages,kind:'practice',sourceLabel:'Study Hall worksheet'}]);
  assert.equal(blank.evidence.length,1);assert.equal(blank.evidence[0].status,'Unanswered');
});
test('Grade 9 migration preserves its existing content and access', () => {
  const fs=require('node:fs');const saved=JSON.parse(fs.readFileSync(resolve(__dirname,'../server/data/worksheets.json'),'utf8')).find(item=>item.id==='grade-9-2018-2019');
  assert.equal(saved.questions.length,13);assert.equal(api.worksheetPlacement(saved).collection,'Grade 9 Mathematics Sample Questions');
  // Placement does not modify the authored source question set.
  assert.equal(new Set(saved.questions.map(q=>q.id)).size,13);
});
