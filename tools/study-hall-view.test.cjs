const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {build}=require('esbuild');

test('English Study Hall renders eight reading topics, separate editing topics, and grouped library books with library-local filters',async()=>{
 const entry=resolve(__dirname,'../client/src/pages/StudentMaterialsPage.tsx');
 const result=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {StudentMaterialsPage} from ${JSON.stringify(entry)};globalThis.window={location:{pathname:'/study-hall/shsat/materials',search:'?subject=english',origin:'http://qa.test'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}};console.log(renderToStaticMarkup(React.createElement(StudentMaterialsPage)));`,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-view-session',setup(plugin){plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(){return{accessToken:'',isCheckingSession:false,isSupabaseConfigured:true,studentName:'QA Student',previewContext:{isPreview:true,mode:'student',query:'?preview=student&teacherTools=1',returnHref:'/teacher',studentId:'',studentName:'QA Student'}};}` }));}}]});
 const vm=require('node:vm'), output=[];
 vm.runInNewContext(result.outputFiles[0].text,{require,console:{log:value=>output.push(value)},process,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream},{filename:'study-hall-render.cjs'});
 const html=output.join('');
 const reading=html.match(/<section class="study-hall-topic-catalog" aria-labelledby="study-hall-topic-title">([\s\S]*?)<\/section>/)?.[1];
 const editing=html.match(/<section class="study-hall-topic-catalog" aria-labelledby="editing-topic-title">([\s\S]*?)<\/section>/)?.[1];
 const library=html.match(/<section class="study-hall-library"([\s\S]*?)<\/section>/)?.[1];
 assert.ok(reading&&editing&&library,'All three sections must render');
 assert.equal((reading.match(/class="study-hall-topic-card"/g)||[]).length,8);
 assert.equal((editing.match(/class="study-hall-topic-card"/g)||[]).length,8);
 assert.doesNotMatch(reading,/>test</i);assert.match(editing,/Revising &amp; Editing/);
 assert.match(library,/Passage category/);assert.match(library,/Sort passages/);assert.match(library,/library-passage-filters/);
 assert.equal((library.match(/href="[^"]*\/library\/book-a-miracle-mile(?:\?|"|&)/g)||[]).length,1);
 assert.doesNotMatch(library,/href="[^"]*\/library\/a-miracle-mile-version-2/);
});
