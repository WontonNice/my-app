// Real command-center UI/routes with temporary content and synthetic students.
// Run: node tools/preview-math-command.cjs [--port=4328]
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const express=require(require.resolve('express',{paths:[path.join(__dirname,'../server')]})),esbuild=require('esbuild');
const repo=path.resolve(__dirname,'..'),fixtures=path.join(__dirname,'.content-drafts');
fs.mkdirSync(fixtures,{recursive:true});const reuse=process.argv.find(arg=>arg.startsWith('--root='))?.slice(7),root=reuse?path.resolve(reuse):fs.mkdtempSync(path.join(fixtures,'math-command-qa-'));
const fixture=require('./math-command-fixture.cjs').install(root,{reuse:Boolean(reuse)});
const {mathCommandRouter}=require('../server/src/routes/mathCommand.ts');
const app=express();app.use(express.json({limit:'1mb'}));app.use('/api/math-command',mathCommandRouter);
// Explicit fixture-only help makes assignment selection verifiable without private data.
app.get('/__qa/state',(_request,response)=>response.json({fixture:true,studentId:fixture.studentId,assignments:fixture.db.tables.student_assignments,results:fixture.db.tables.student_exam_results.map(row=>({studentId:row.user_id,assessmentId:row.assessment_id,correct:row.result.correct,total:row.result.total}))}));
app.get('/__qa/export',(_request,response)=>response.json({fixture:true,tables:fixture.db.tables}));
(async()=>{
  let files=new Map();
  const context=await esbuild.context({entryPoints:[path.join(__dirname,'math-command-preview.tsx')],bundle:true,write:false,outdir:path.join(root,'build'),format:'esm',jsx:'automatic',loader:{'.woff':'file','.woff2':'file','.ttf':'file'},define:{'import.meta.env':'{}'},plugins:[{name:'math-command-fixture-auth',setup(build){
    build.onEnd(result=>{if(!result.errors.length)files=new Map(result.outputFiles.map(file=>['/'+path.basename(file.path),file.contents]));});
    build.onResolve({filter:/\/supabase$/},args=>args.importer.includes('client')?{path:'fixture-auth',namespace:'qa'}:undefined);
    build.onLoad({filter:/.*/,namespace:'qa'},()=>({contents:`
      export const isSupabaseConfigured=true;
      const student=location.pathname.startsWith('/math-practice/');
      const session={access_token:student?'student':'teacher',user:student?${JSON.stringify(fixture.users.student)}:${JSON.stringify(fixture.users.teacher)}};
      export const getSupabaseClient=()=>({auth:{
        getSession:async()=>({data:{session}}),
        refreshSession:async()=>({data:{session}}),
        onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
      }});
    `}));
  }}]});
  await context.watch();await context.rebuild();
  app.use((request,response,next)=>{const file=files.get(request.path);if(!file)return next();response.type(request.path.endsWith('.js')?'text/javascript':request.path.endsWith('.css')?'text/css':'application/octet-stream').send(Buffer.from(file));});
  app.use(express.static(path.join(repo,'client/public')));
  app.get(/.*/,(_request,response)=>response.type('html').send('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Math Command Center · isolated QA</title><link rel="stylesheet" href="/math-command-preview.css"></head><body><div id="root"></div><script type="module" src="/math-command-preview.js"></script></body></html>'));
  const port=Number(process.argv.find(arg=>arg.startsWith('--port='))?.slice(7)||4328);
  const server=http.createServer(app).listen(port,'127.0.0.1',()=>console.log(`Math Command Center QA: http://127.0.0.1:${port}/teacher/math-command\nSynthetic student: ${fixture.studentId}\nTemporary content: ${root}\nNo production database or content writes.`));
  process.on('SIGINT',()=>{fs.writeFileSync(path.join(root,'qa-tables.json'),JSON.stringify(fixture.db.tables));server.close();context.dispose().then(()=>process.exit(0));});
})();
