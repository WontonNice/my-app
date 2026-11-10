const {build}=require('esbuild'),{createServer}=require('node:http'),{resolve,basename,sep,extname}=require('node:path'),{existsSync,readFileSync}=require('node:fs');
require('ts-node').register({transpileOnly:true,project:resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {defaultPracticeCatalog,validatePracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
const {withPracticeSources}=require('../server/src/shared/practiceSources.ts');
const {readMathCommandCatalog}=require('../server/src/lib/mathCommandCatalogStore.ts');
const {createExamResult}=require('../server/src/shared/examGrading.ts');
const {reviewQuestions}=require('../server/src/shared/examCorrections.ts');
const taxonomy=require('./math-topics.json').categories;
const checkpoints=new Map();
const bookSettings={};
let catalog=withPracticeSources(defaultPracticeCatalog(),readMathCommandCatalog()),revision=1;
const source=catalog.generators[0];
catalog.generators.push({...source,id:'qa-prestige',title:'Fictional Prestige variation',sourcePublishers:['Prestige']});
catalog.modules.push({id:'qa-prestige-module',title:'QA source filter',description:'Fictional QA module',category:source.category,topic:source.topic,published:true,includeAll:false,generatorIds:['qa-prestige']});
const q={id:'qa-math',type:'multiple_choice',topic:'Algebra',subtopic:'Inequalities',prompt:'What is the value of 2 + 3?',choices:[{id:'A',text:'4'},{id:'B',text:'5'}],correctChoiceId:'B',explanation:'Adding 3 to 2 gives 5.'};
const content={assessmentId:'qa-worksheet',title:'QA worksheet with a skipped answer',passageSets:[],mathSection:{id:'qa-math',label:'Math',questions:[q,{...q,id:'qa-skipped',prompt:'What is the value of 3 + 2?'}]}};
const result=createExamResult(content,{'qa-math':'A'},['math']);
const view={result,questions:reviewQuestions(content,result),resultVersion:'qa-v1',submission:null,isWorksheet:true};
(async()=>{
 const built=await build({entryPoints:[resolve(__dirname,'learning-management-preview.tsx')],bundle:true,write:false,outdir:resolve(__dirname,'.learning-preview'),format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}','__QA_TEI__':JSON.stringify(require('./tei-fixtures.cjs').fixtures)},plugins:[{name:'fictional-account',setup(plugin){
  plugin.onLoad({filter:/useStudentPortalAccess\.ts$/},()=>({loader:'ts',contents:`export function useStudentPortalAccess(){return {accessToken:'qa',isCheckingSession:false,isSupabaseConfigured:true,studentName:'QA Student',previewContext:{isPreview:false,mode:'',query:'',studentId:'',studentName:'QA Student',returnHref:'/'}};}`}));
  plugin.onLoad({filter:/[\\/]lib[\\/]sessionCache\.ts$/},()=>({loader:'ts',contents:`const session={access_token:'qa',user:{id:'qa-user',app_metadata:{role:'student'},user_metadata:{full_name:'QA Student'}}};export const getActiveSession=async()=>session;export const peekActiveSession=()=>session;export const cacheActiveSession=()=>{};export const cacheStudentClasses=()=>{};export const getCachedStudentClasses=()=>null;export const cacheStudentDashboard=()=>{};export const getCachedStudentDashboard=()=>null;export const cacheTeacherDashboard=()=>{};export const getCachedTeacherDashboard=()=>null;`}));
  plugin.onLoad({filter:/features[\\/]account[\\/]account\.tsx$/},()=>({loader:'tsx',contents:`export function useAccountProfile(){return {profile:{id:'qa-user',name:'QA Student'},error:''};} export function AccountDialog(){return null;} export function ProfilePhoto(){return null;} export function ProfileAvatar(){return null;}`}));
 }}]});
 const files=new Map(built.outputFiles.map(file=>['/'+basename(file.path),file.contents]));
 const port=Number(process.argv.find(value=>value.startsWith('--port='))?.slice(7))||4348;
 createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');res.setHeader('Cache-Control','no-store');
  if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');
   if(url.pathname==='/api/library/book-settings'){res.end(JSON.stringify({settings:bookSettings}));return;}
   const bookSave=url.pathname.match(/^\/api\/library\/teacher\/books\/([^/]+)\/settings$/);
   if(bookSave && req.method==='PUT'){let raw='';for await(const chunk of req)raw+=chunk;const saved={...JSON.parse(raw),reviewedAt:new Date().toISOString()};bookSettings[decodeURIComponent(bookSave[1])]=saved;res.end(JSON.stringify({settings:saved}));return;}
   if(url.pathname==='/api/infinite-practice/catalog'){
    if(req.method==='PUT'){let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);catalog=validatePracticeCatalog(body.catalog);revision++;}
    res.end(JSON.stringify({catalog,revision,taxonomy,classificationSkills:[]}));return;
   }
   if(url.pathname==='/api/exam-review/student/qa-worksheet'){res.end(JSON.stringify(view));return;}
   if(url.pathname==='/api/infinite-practice/progress'){if(req.method==='PUT'){let raw='';for await(const chunk of req)raw+=chunk;const row=JSON.parse(raw);checkpoints.set(row.moduleId,row);res.end(JSON.stringify(row));}else res.end(JSON.stringify([...checkpoints.values()]));return;}
   res.end(JSON.stringify({profile:{id:'qa-user',name:'QA Student'},skills:[],categories:taxonomy,revision:'1'}));return;
  }
  const file=files.get(url.pathname);if(file){res.setHeader('Content-Type',url.pathname.endsWith('.css')?'text/css':'text/javascript');res.end(file);return;}
  if(url.pathname.startsWith('/exam-images/')){
   const publicRoot=resolve(__dirname,'../client/public'),asset=resolve(publicRoot,'.'+decodeURIComponent(url.pathname));
   if(asset.startsWith(publicRoot+sep)&&existsSync(asset)){res.setHeader('Content-Type',({'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'})[extname(asset)]||'application/octet-stream');res.end(readFileSync(asset));}else{res.statusCode=404;res.end('Image not found');}return;
  }
  res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/learning-management-preview.css"></head><body style="background:#f5f7f9;color:#263747"><div id="root"></div><script type="module" src="/learning-management-preview.js"></script></body></html>');
 }).listen(port,'127.0.0.1',()=>console.log(`Learning management preview: http://127.0.0.1:${port}`));
})();
