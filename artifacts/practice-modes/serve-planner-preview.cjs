const {build}=require('esbuild'),{createServer}=require('node:http'),path=require('node:path');
(async()=>{
 const result=await build({entryPoints:[path.join(__dirname,'planner-preview.tsx')],bundle:true,write:false,outdir:path.join(__dirname,'planner-preview'),format:'esm',jsx:'automatic',define:{'import.meta.env':'{}'},loader:{'.woff':'file','.woff2':'file','.ttf':'file'},external:['/images/*']});
 const files=new Map(result.outputFiles.map(file=>['/'+path.basename(file.path),file.contents]));
 createServer((request,response)=>{const file=files.get(request.url);response.setHeader('Content-Type',file?request.url.endsWith('.css')?'text/css':'text/javascript':'text/html');response.end(file??'<!doctype html><meta charset="utf-8"><title>Planner destination verification</title><link rel="stylesheet" href="/planner-preview.css"><div id="root"></div><script type="module" src="/planner-preview.js"></script>');}).listen(4360,'127.0.0.1',()=>console.log('Planner verification: http://127.0.0.1:4360'));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
