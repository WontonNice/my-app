// Fictional local preview of the real student page. Never connects to Supabase.
const path=require('node:path'),{createServer}=require('node:http');
const esbuild=require(require.resolve('esbuild',{paths:[path.resolve(__dirname,'../client')]}));
const exams=require('../server/data/assessments.json').map((item,index)=>({
 id:item.id,title:item.title,description:item.description,classId:'shsat',durationMinutes:180,questionCount:index%2?114:97,passageCount:6,questionTypes:[],split:false,allowCompletedAccess:false,
 status:index===0||index===1||index===5?'open':'locked',sectionAccess:{english:index===0||index===5,math:index===0||index===1},
 ...(index===1?{reentry:{remainingSections:['math']}}:{})
}));
(async()=>{
 const entry="import {createRoot} from 'react-dom/client';import {StudentAssessmentsPage} from './client/src/pages/StudentAssessmentsPage';import './client/src/styles/global.css';createRoot(document.getElementById('root')).render(<StudentAssessmentsPage/>);";
 const result=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:path.resolve(__dirname,'..')},bundle:true,write:false,outdir:path.resolve(__dirname,'.student-exams-preview'),format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-student',setup(build){
  build.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:"export function useStudentPortalAccess(){return {accessToken:'fictional',isCheckingSession:false,isSupabaseConfigured:true,studentName:'Maya Chen',previewContext:{isPreview:false,mode:'',query:'',returnHref:'/teacher',studentId:'',studentName:''}};}"}));
 }}]});
 const files=new Map(result.outputFiles.map(file=>['/'+path.basename(file.path),file.contents]));
 createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/assessments/student'){const referer=new URL(req.headers.referer||'http://localhost');const state=referer.searchParams.get('state');res.setHeader('Content-Type','application/json');if(state==='error'){res.statusCode=503;res.end('{"message":"Fictional unavailable service"}');return;}res.end(JSON.stringify({assessments:state==='empty'?[]:state==='locked'?exams.map(item=>({...item,status:'locked',sectionAccess:{english:false,math:false},reentry:undefined})):exams}));return;}
  if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end('{}');return;}
  if(url.pathname==='/qa/mobile'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body style="margin:0;background:#eee;display:flex;justify-content:center"><iframe title="390px student exams" src="/" style="border:0;width:390px;height:900px"></iframe></body></html>');return;}
  const file=files.get(url.pathname);res.setHeader('Content-Type',file?url.pathname.endsWith('.js')?'text/javascript':url.pathname.endsWith('.css')?'text/css':'application/octet-stream':'text/html');
  res.end(file||'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Student exam library · fictional QA</title><link rel="stylesheet" href="/stdin.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>');
 }).listen(4342,'127.0.0.1',()=>console.log('Fictional student exam library: http://127.0.0.1:4342/'));
})().catch(error=>{console.error(error);process.exitCode=1;});

