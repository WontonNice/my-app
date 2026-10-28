// Local-only fictional catalog. Never reads env files or connects to Supabase.
const {createServer}=require('node:http'),{resolve,basename}=require('node:path'),{build}=require('esbuild');
require(require.resolve('ts-node',{paths:[resolve(__dirname,'../server')]})).register({transpileOnly:true,project:resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {defaultPracticeCatalog,validatePracticeCatalog,studentPracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
const {mealFixture}=require('./classroom-updates-fixture.cjs');
const taxonomy=require('./math-topics.json');let catalog=defaultPracticeCatalog(taxonomy),revision=0;
(async()=>{
 const result=await build({entryPoints:[resolve(__dirname,'classroom-updates-preview.tsx')],bundle:true,write:false,outdir:resolve(__dirname,'.classroom-updates-preview'),external:['/landing/*','/images/*'],format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-study-hall-session',setup(plugin){
  plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(teacher=false){const params=new URLSearchParams(location.search),mode=teacher?'teacher':params.get('preview')||'';const isPreview=teacher||Boolean(mode&&params.get('teacherTools')==='1');return {accessToken:'fictional',isCheckingSession:false,isSupabaseConfigured:true,studentName:mode==='teacher'?'QA Teacher':'QA Student',previewContext:{isPreview,mode,query:isPreview?'?preview='+mode+'&teacherTools=1&returnTo=%2Fteacher':'',returnHref:'/teacher',studentId:'',studentName:''}};}`}));
  plugin.onLoad({filter:/[\\/]lib[\\/]sessionCache\.ts$/},()=>({loader:'ts',contents:`const session={access_token:'fictional',user:{id:'fictional',app_metadata:{role:'teacher'},user_metadata:{full_name:'QA Teacher'}}};export const getActiveSession=async()=>session;export const peekActiveSession=()=>session;export const cacheActiveSession=()=>{};export const cacheStudentClasses=()=>{};export const getCachedStudentClasses=()=>null;export const cacheStudentDashboard=()=>{};export const getCachedStudentDashboard=()=>null;export const cacheTeacherDashboard=()=>{};export const getCachedTeacherDashboard=()=>null;`}));
 }}]});
 const files=new Map(result.outputFiles.map(file=>['/'+basename(file.path),file.contents]));
 const port=Number(process.argv.find(value=>value.startsWith('--port='))?.slice(7))||4336;
 createServer(async(request,response)=>{
  const url=new URL(request.url,'http://localhost'),name=url.pathname;
  if(await mealFixture(request,response,url))return;
  if(name.startsWith('/images/')||name.startsWith('/auth/')||name.startsWith('/landing/')){const file=resolve(__dirname,'../client/public','.'+name);const base=resolve(__dirname,'../client/public');if(file.startsWith(base+require('node:path').sep)){try{response.setHeader('Content-Type',name.endsWith('.woff2')?'font/woff2':name.endsWith('.webp')?'image/webp':'image/png');response.end(require('node:fs').readFileSync(file));return;}catch{}}}
  if(name==='/api/infinite-practice/catalog'){
   response.setHeader('Content-Type','application/json');
   if(request.method==='PUT'){let raw='';for await(const chunk of request)raw+=chunk;try{const body=JSON.parse(raw);if(body.revision!==revision){response.statusCode=409;response.end('{"message":"Another window saved changes. Reload the latest catalog before saving."}');return;}catalog=validatePracticeCatalog(body.catalog,taxonomy);revision++;}catch(error){response.statusCode=400;response.end(JSON.stringify({message:error.message}));return;}}
   response.end(JSON.stringify({revision,catalog:request.method==='PUT'||url.searchParams.get('manage')==='1'?catalog:studentPracticeCatalog(catalog),taxonomy:taxonomy.categories}));return;
  }
  if(name==='/api/assessments/student'){response.setHeader('Content-Type','application/json');response.end('{"assessments":[]}');return;}
  if(name.includes('/learning-plan/')&&name.endsWith('/assignments')){response.setHeader('Content-Type','application/json');response.end('{"assignments":[],"total":0}');return;}
  if(name.includes('/learning-plan/')){response.setHeader('Content-Type','application/json');response.end('{"summary":{"planned":0,"assigned":0,"inProgress":0,"review":0,"completed":0,"overdue":0}}');return;}
  if(name.includes('/answer-sheets/')){response.setHeader('Content-Type','application/json');response.end('{"assignments":[]}');return;}
  if(name.startsWith('/api/')){response.setHeader('Content-Type','application/json');response.end('{}');return;}
  if(name==='/qa/mobile'){const page=url.searchParams.get('page')||'/teacher/practice-studio';response.setHeader('Content-Type','text/html');response.end('<html><body style="margin:0;display:flex;justify-content:center;background:#ddd"><iframe title="Mobile Study Hall" style="width:390px;height:900px;border:0" src="'+page.replaceAll('"','&quot;')+'"></iframe></body></html>');return;}
  const file=files.get(name);response.setHeader('Content-Type',file?name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'application/octet-stream':'text/html');response.end(file||'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Study Hall studio · fictional QA</title><link rel="stylesheet" href="/classroom-updates-preview.css"><div id="root"></div><script type="module" src="/classroom-updates-preview.js"></script></html>');
 }).listen(port,'127.0.0.1',()=>console.log(`Fictional Study Hall studio: http://127.0.0.1:${port}/teacher/practice-studio`));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
