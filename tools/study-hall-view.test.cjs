const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {build}=require('esbuild');
const vm=require('node:vm');
const root=resolve(__dirname,'..');

test('Study Hall separates three entries while preserving libraries, category practice, worksheets and teacher context',async()=>{
 const result=await build({alias:require('./react-build-aliases.cjs')(root),stdin:{contents:`
 import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server';
 import {StudentMaterialsPage} from './client/src/pages/StudentMaterialsPage';
 import {StudentTopicHubPage} from './client/src/pages/StudentTopicHubPage';
 import {advancedPracticePassages} from './client/src/content/advancedPractice';
 globalThis.window={location:{pathname:'/study-hall/shsat/materials',search:'',origin:'http://qa.test'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}};
 const render=(search,teacher=false)=>{window.location.search=search;window.location.pathname='/study-hall/shsat/materials';return renderToStaticMarkup(<StudentMaterialsPage teacherWorkspace={teacher}/>);};
 const output={standalone:render('?entry=standalone'),standaloneWorksheets:render('?entry=standalone&section=worksheets'),library:render('?subject=english'),reading:render('?entry=reading&section=categories'),editing:render('?entry=editing'),worksheets:render('?entry=editing&section=worksheets'),advanced:render('?section=advanced&preview=student'),math:render('?subject=math'),recommended:render('?subject=math&section=recommended'),teacher:render('?section=categories',true),search:render('?q=2027%20mile%202026'),empty:render('?q=zzzyyyxxx'),advancedIds:advancedPracticePassages.map(p=>p.id)};
 window.location.pathname='/study-hall/shsat/topics/central-idea-theme';window.location.search='?preview=student';output.topic=renderToStaticMarkup(<StudentTopicHubPage/>);
 window.location.pathname='/study-hall/shsat/topics/pronouns';output.editingTopic=renderToStaticMarkup(<StudentTopicHubPage/>);
 console.log(JSON.stringify(output));
 `,resolveDir:root,loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'},plugins:[{name:'fixture-session',setup(plugin){
 plugin.onLoad({filter:/usePracticeCatalog\.ts$/},()=>({loader:'ts',contents:`import {defaultPracticeCatalog} from ${JSON.stringify(resolve(root,'server/src/shared/practiceCatalog.ts'))}; export function usePracticeCatalog(){return {catalog:defaultPracticeCatalog(),taxonomy:${JSON.stringify(require('./math-topics.json').categories)},error:'',loading:false,reload:async()=>{}};}`}));
 plugin.onLoad({filter:/InequalityPractice\.tsx$/},()=>({loader:'tsx',contents:'export function InequalityPractice(){return null;}'}));
 plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(teacher=false){const mode=teacher?'teacher':window.location.search.includes('preview=student')?'student':'';return{accessToken:'',isCheckingSession:false,isSupabaseConfigured:true,studentName:'QA Student',previewContext:{isPreview:!!mode,mode,query:mode?'?preview='+mode+'&teacherTools=1':'',returnHref:'/teacher',studentId:'',studentName:'QA Student'}};}`}));
 }}]});
 let output;
 vm.runInNewContext(result.outputFiles[0].text,{require,console:{log:value=>output=JSON.parse(value)},process,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream});
 for(const page of ['library','reading','editing','math']) {
  assert.match(output[page],/aria-label="Study Hall entries"/);
  assert.match(output[page],/>Reading Comprehension</);assert.match(output[page],/>Revising\/Editing</);assert.match(output[page],/>Math</);
  assert.doesNotMatch(output[page],/Teacher Study Hall tools|teacherTools|preview=teacher/);
 }
 const {load}=require('cheerio');
 for(const name of ['editing','standalone','worksheets','standaloneWorksheets']) {
  const page=load(output[name]);
  assert.equal(page('[aria-label="Study Hall entries"] a').length,3);
  assert.equal(page('[aria-label="Study Hall entries"] [aria-current="page"]').text(),'Revising/Editing');
  const types=page('[aria-label="Revising/Editing practice types"]');
  assert.equal(types.find('a').length,2);
  assert.equal(types.find('[aria-current="page"]').text(),name.startsWith('standalone')?'Stand Alone Items':'Revising/Editing A');
  assert.match(types.find('a').last().attr('href'),/entry=standalone/);
  if(name.toLowerCase().includes('worksheets')) assert.match(types.find('a').first().attr('href'),/section=worksheets/);
 }
 assert.match(output.teacher,/Teacher Study Hall tools/);
 assert.match(output.teacher,/\/topics\/central-idea-theme\?[^" ]*preview=teacher/);
 for(const page of ['reading','editing']) assert.equal((output[page].match(/href="[^"]*\/topics\//g)||[]).length,8);
 assert.doesNotMatch(output.reading,/\/topics\/pronouns/);assert.doesNotMatch(output.editing,/\/topics\/central-idea-theme/);
 assert.match(output.worksheets,/editing-worksheets/);assert.doesNotMatch(output.worksheets,/\/library\/book-a-miracle-mile/);
 assert.match(output.library,/Reading skill/);assert.match(output.library,/All sources/);
 assert.equal((output.library.match(/<h4><a href="[^" ]*\/library\/book-a-miracle-mile(?:\?|"|&)/g)||[]).length,1);
 assert.doesNotMatch(output.library,/Long reading|study-hall-book-scroll/);
 assert.match(output.library,/Appears in/);
 assert.match(output.search,/book-a-miracle-mile/);assert.doesNotMatch(output.search,/book-snowy-mountains/);
 assert.match(output.empty,/No matching resources/);
 for(const id of output.advancedIds) assert.ok(output.advanced.includes('/advanced-practice/'+id+'?preview=student'));
 assert.match(output.advanced,/advanced-worksheets/);assert.doesNotMatch(output.library,/\/advanced-practice\//);
 assert.match(output.math,/Choose a main category/);assert.doesNotMatch(output.math,/id="recommended-heading"/);
 assert.match(output.recommended,/id="recommended-heading"/);
 assert.match(output.topic,/Passage Practice/);assert.match(output.topic,/topic-worksheets/);assert.match(output.topic,/\/practice\/central-idea-theme\?preview=student/);assert.match(output.topic,/topic-assignments/);
 assert.match(output.editingTopic,/Revising\/Editing A categories/);assert.match(output.editingTopic,/topic-worksheets/);
});
