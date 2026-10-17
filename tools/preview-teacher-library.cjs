// Fictional teacher/student sessions and in-memory grants. Never contacts Supabase.
const { createServer } = require('node:http');
const { resolve, basename } = require('node:path');
const { build } = require('esbuild');
(async () => {
 const entry = `import React from 'react'; import {createRoot} from 'react-dom/client'; import {TeacherLibraryPage} from './client/src/pages/TeacherLibraryPage'; import {AdvancedPassagePage} from './client/src/pages/AdvancedPassagePage'; import './client/src/styles/global.css'; const root=createRoot(document.getElementById('root')); function render(){root.render(location.pathname.startsWith('/teacher')?<TeacherLibraryPage key={location.pathname}/>:<AdvancedPassagePage key={location.pathname}/>);} window.addEventListener('popstate',render);render();`;
 const session = `const session={access_token:'fictional-qa-only',user:{id:'qa-teacher',email:'teacher@example.test',app_metadata:{role:'teacher'},user_metadata:{full_name:'Preview Teacher'}}}; export const peekActiveSession=()=>session; export const getActiveSession=async()=>session;`;
 const api = `import {examLibraryBooks} from ${JSON.stringify(resolve(__dirname,'../client/src/content/exams/passageLibrary.ts'))};
 const enabled=new Map([['qa-jordan',true],['qa-maya',false],['qa-sam',false]]);
 function students(book){const q=book.passageSet.questions[0];return [{id:'qa-maya',name:'Maya Chen',username:'maya.chen',email:'maya@example.test',attempts:[]},{id:'qa-jordan',name:'Jordan Lee',username:'jordan.lee',email:'jordan@example.test',attempts:[{id:'qa-attempt',bookId:book.versions[0].id,attemptNumber:1,completedAt:'2026-10-16T15:00:00Z',startedAt:'2026-10-16T14:55:00Z',score:1,totalQuestions:1,totalTimeSeconds:300,correction:null,questions:[{questionId:q.id,questionNumber:1,isCorrect:true,correctAnswerId:q.correctChoiceId,selectedAnswerId:q.correctChoiceId,timeSpentSeconds:300}]}]},{id:'qa-sam',name:'Sam Rivera',username:'sam.rivera',email:'sam@example.test',attempts:[]}].map(student=>({...student,access:{unlocked:enabled.get(student.id),unlockedAt:null}}));}
 export async function getTeacherLibraryBook(token,id){const book=examLibraryBooks.find(b=>b.id===id)||examLibraryBooks[0];return{book:{bookId:book.id,title:book.passageSet.passage.title},students:students(book)};}
 export async function setTeacherLibraryStudentAccess(token,bookId,studentId,granted){enabled.set(studentId,granted);return{bookId,studentId,access:{unlocked:granted,unlockedAt:granted?new Date().toISOString():null}};}
 export async function getStudentLibraryBookAccess(){return{unlocked:enabled.get('qa-maya'),unlockedAt:null};}
 export async function getStudentLibraryAttempts(){return[];}
 export async function saveStudentLibraryAttempt(){throw Error('Submissions are disabled in this fictional preview.');}`;
 const result = await build({stdin:{contents:entry,resolveDir:resolve(__dirname,'..'),loader:'tsx',sourcefile:'teacher-library-preview.tsx'},bundle:true,write:false,outdir:resolve(__dirname,'.teacher-library-preview'),format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-library-session',setup(plugin){
  plugin.onLoad({filter:/lib[\\/]sessionCache\.ts$/},()=>({loader:'ts',contents:session}));
  plugin.onLoad({filter:/lib[\\/]supabase\.ts$/},()=>({loader:'ts',contents:'export const isSupabaseConfigured=true; export const getSupabaseClient=()=>null;'}));
  plugin.onLoad({filter:/lib[\\/]accountSwitching\.ts$/},()=>({loader:'ts',contents:'export const getSavedAccounts=()=>[]; export const rememberCurrentAccount=async()=>{}; export const removeSavedAccount=()=>{}; export const signInAndSaveAccount=async()=>{}; export const switchToSavedAccount=async()=>{}; export const signOutCurrentAccount=async()=>{};'}));
  plugin.onLoad({filter:/lib[\\/]api\.ts$/},()=>({loader:'ts',contents:api}));
  plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(){return{accessToken:'fictional-qa-only',isCheckingSession:false,isSupabaseConfigured:true,studentName:'Maya Chen',previewContext:{isPreview:false,mode:'student',query:'',returnHref:'',studentId:'',studentName:''}};}`}));
 }}]});
 const files=new Map(result.outputFiles.map(file=>['/'+basename(file.path),file.contents]));
 const port=Number(process.argv.find(value=>value.startsWith('--port='))?.slice(7))||4334;
 createServer((request,response)=>{const name=request.url.split('?')[0],file=files.get(name);response.setHeader('Content-Type',file?name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'application/octet-stream':'text/html');response.end(file||'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>English library · fictional QA</title><link rel="stylesheet" href="/stdin.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>');}).listen(port,'127.0.0.1',()=>console.log(`Isolated teacher library: http://127.0.0.1:${port}/teacher/library`));
})().catch(error=>{console.error(error);process.exitCode=1;});
