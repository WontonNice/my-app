// Isolated preview: fake session and in-memory data; no real emails or accounts.
const path=require('node:path'),{createServer}=require('node:http');
const esbuild=require(require.resolve('esbuild',{paths:[path.resolve(__dirname,'../client')]}));
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const days=Array.from({length:4},(_,i)=>new Date(Date.parse(today+'T12:00:00Z')-i*86400000).toISOString().slice(0,10));
const profile={id:'fictional',name:'Maya Chen',username:'maya',avatar:null,email:'maya@example.test',verifiedAt:today,pendingEmail:null,emailDeliveryReady:true,themeColor:'forest',streak:{current:4,best:9,lastDay:today,today,days,timeZone:'America/New_York'}};
(async()=>{
 const entry=`import {createRoot} from 'react-dom/client';import {AccountProvider} from './client/src/features/account/account';import {ProfileSettingsPage,AccountEmailPage} from './client/src/pages/ProfileSettingsPage';import {AuthPage} from './client/src/pages/AuthPage';import {StudentPortalShell} from './client/src/components/StudentPortalShell';import {LoginStreak} from './client/src/features/account/LoginStreak';import './client/src/styles/global.css';const page=location.pathname;createRoot(document.getElementById('root')).render(<AccountProvider>{page==='/login'?<AuthPage mode="login"/>:page==='/forgot-password'?<AccountEmailPage mode="forgot"/>:page==='/portal'?<StudentPortalShell activeId="home" onSignOut={()=>{}} studentName="Maya Chen" previewContext={{isPreview:false}}><h1>Your next steps</h1><LoginStreak/><a href="/profile">Profile settings</a></StudentPortalShell>:<ProfileSettingsPage/>}</AccountProvider>);`;
 const result=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:path.resolve(__dirname,'..')},bundle:true,write:false,outdir:path.resolve(__dirname,'.account-preview'),format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}'},plugins:[{name:'fictional-account',setup(build){build.onLoad({filter:/[\\/]lib[\\/]supabase\.ts$/},()=>({loader:'ts',contents:`const session=location.pathname==='/login'||location.pathname==='/forgot-password'?null:{access_token:'fictional',user:{id:'fictional',app_metadata:{role:'student'},user_metadata:{username:'maya',full_name:'Maya Chen'}}};export const isSupabaseConfigured=true;export const supabase={auth:{getSession:async()=>({data:{session}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}};export const getSupabaseClient=()=>supabase;`}));}}]});
 const files=new Map(result.outputFiles.map(file=>['/'+path.basename(file.path),file.contents]));
 createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')){
   let body='';for await(const chunk of req)body+=chunk;const input=body?JSON.parse(body):{};res.setHeader('Content-Type','application/json');
   if(url.pathname==='/api/account/preferences'){profile.themeColor=input.themeColor;res.end(JSON.stringify(profile));return;}
   if(url.pathname==='/api/account/profile'){res.end(JSON.stringify(profile));return;}
   if(url.pathname==='/api/account/check-in'){res.end(JSON.stringify({streak:profile.streak}));return;}
   if(url.pathname==='/api/account/forgot-password'){res.statusCode=input.email==='maya@example.test'?200:404;res.end(JSON.stringify({message:res.statusCode===200?'Password-reset email sent. Check your inbox and spam folder.':'Email not found. Enter an email verified in Profile settings.'}));return;}
   res.end('{}');return;
  }
  if(url.pathname==='/qa/mobile'){res.setHeader('Content-Type','text/html');res.end('<html><body style="margin:0;background:#ddd;display:flex;justify-content:center"><iframe title="Mobile account preview" src="'+(url.searchParams.get('page')||'/profile')+'" style="border:0;width:390px;height:900px"></iframe></body></html>');return;}
  const file=files.get(url.pathname);res.setHeader('Content-Type',file?url.pathname.endsWith('.js')?'text/javascript':url.pathname.endsWith('.css')?'text/css':'application/octet-stream':'text/html');res.end(file||'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Account settings · fictional QA</title><link rel="stylesheet" href="/stdin.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>');
 }).listen(4346,'127.0.0.1',()=>console.log('Fictional account preview: http://127.0.0.1:4346/profile'));
})().catch(error=>{console.error(error);process.exitCode=1;});
