const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {build}=require('esbuild');

test('English Study Hall renders eight reading topics, separate editing topics, and grouped library books with library-local filters',async()=>{
 const entry=resolve(__dirname,'../client/src/pages/StudentMaterialsPage.tsx');
 const advancedEntry=resolve(__dirname,'../client/src/content/advancedPractice/index.ts');
 const result=await build({stdin:{contents:`import {StudentDashboardPage} from ${JSON.stringify(resolve(__dirname,"../client/src/pages/StudentDashboardPage.tsx"))};import {advancedPracticePassages} from ${JSON.stringify(advancedEntry)};import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {StudentMaterialsPage} from ${JSON.stringify(entry)};globalThis.window={location:{pathname:'/study-hall/shsat/materials',search:'?subject=english&preview=student&teacherTools=1',origin:'http://qa.test'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}};console.log(renderToStaticMarkup(React.createElement(StudentMaterialsPage)));console.log(JSON.stringify(advancedPracticePassages.map(p=>p.id)));window.location.search="?subject=english";console.log(renderToStaticMarkup(<StudentMaterialsPage/>));console.log(renderToStaticMarkup(<StudentMaterialsPage teacherWorkspace/>));window.location.search="?subject=math";console.log(renderToStaticMarkup(<StudentMaterialsPage/>));console.log(renderToStaticMarkup(<StudentDashboardPage/>));`,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-view-session',setup(plugin){plugin.onLoad({filter:/usePracticeCatalog\.ts$/},()=>({loader:'ts',contents:'import {defaultPracticeCatalog} from '+JSON.stringify(resolve(__dirname,'../server/src/shared/practiceCatalog.ts'))+'; export function usePracticeCatalog(){return {catalog:defaultPracticeCatalog(),error:"",loading:false,reload:async()=>{}};}'}));plugin.onLoad({filter:/InequalityPractice\.tsx$/},()=>({loader:'tsx',contents:'export function InequalityPractice(){return null;}'}));plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(teacher=false){const mode=teacher?'teacher':window.location.search.includes('preview=student')?'student':'';return{accessToken:'',isCheckingSession:false,isSupabaseConfigured:true,studentName:'QA Student',previewContext:{isPreview:!!mode,mode,query:mode?'?preview='+mode+'&teacherTools=1':'',returnHref:'/teacher',studentId:'',studentName:'QA Student'}};}` }));}}]});
 const vm=require('node:vm'), output=[];
 vm.runInNewContext(result.outputFiles[0].text,{require,console:{log:value=>output.push(value)},process,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream},{filename:'study-hall-render.cjs'});
 const html=output[0], advancedIds=JSON.parse(output[1]);
 const studentEnglish=output[2],teacher=output[3],studentMath=output[4],dashboard=output[5];
 assert.match(dashboard,/dashboard-practice-title/);assert.match(dashboard,/Start Foundation Building/);assert.match(dashboard,/All Question Types settings/);assert.ok(dashboard.indexOf('dashboard-practice-title')<dashboard.indexOf('shsat-countdown-title'),'Practice is visible above the countdown on the student home');
 for(const student of [studentEnglish,studentMath]){
  assert.doesNotMatch(student,/href="\/math-practice\/infinite"/,'Practice stays within its topic box');
  assert.doesNotMatch(student,/study-hall-practice-link/,'No duplicate practice banner');
  assert.doesNotMatch(student,/Teacher Study Hall tools|preview=teacher|teacherTools/);
 }
 assert.match(teacher,/student-portal-shell/,'Teacher Study Hall shares the student shell');
 assert.match(teacher,/Teacher Study Hall tools/);assert.match(teacher,/href="\/teacher\/math-command"/);
 assert.match(teacher,/\/topics\/central-idea-theme\?preview=teacher/,'Teacher context survives entering a topic');
 const reading=html.match(/<section class="study-hall-topic-catalog" aria-labelledby="study-hall-topic-title">([\s\S]*?)<\/section>/)?.[1];
 const editing=html.match(/<section class="study-hall-topic-catalog" aria-labelledby="editing-topic-title">([\s\S]*?)<\/section>/)?.[1];
 const library=html.match(/<section class="study-hall-library"([\s\S]*?)<\/section>/)?.[1];
 const advanced=html.match(/<section class="study-hall-library study-hall-advanced-readings"([\s\S]*?)<\/section>/)?.[1];
 assert.ok(reading&&editing&&library,'All three sections must render');
 assert.equal((reading.match(/class="study-hall-topic-card"/g)||[]).length,8);
 assert.equal((editing.match(/class="study-hall-topic-card"/g)||[]).length,8);
 assert.doesNotMatch(reading,/>test</i);assert.match(editing,/Revising &amp; Editing/);
 assert.match(library,/Passage category/);assert.match(library,/Sort passages/);assert.match(library,/library-passage-filters/);
 assert.equal((library.match(/href="[^"]*\/library\/book-a-miracle-mile(?:\?|"|&)/g)||[]).length,1);
 assert.doesNotMatch(library,/href="[^"]*\/library\/a-miracle-mile-version-2/);
 assert.ok(advanced, 'Advanced readings has its own English shelf');
 assert.match(advanced, /Advanced readings/); assert.match(advanced, /Reading genre/); assert.match(advanced, /Sort advanced readings/);
 assert.equal((advanced.match(/href="[^"]*\/advanced-practice\//g)||[]).length,advancedIds.length);
 for(const id of advancedIds) assert.ok(advanced.includes('/advanced-practice/'+id+'?preview=student'), 'Every current advanced passage appears once');
 assert.match(advanced,/\/advanced-practice\/[^" ]+\?preview=student/);
 assert.doesNotMatch(library,/\/advanced-practice\//);
 assert.match(html,/aria-label="English Study Hall sections"/);
 assert.match(html,/href="#advanced-readings"/);
});
