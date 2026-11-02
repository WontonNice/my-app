const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const runtime='C:/Users/Nathan Im/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {createWorker,OEM}=require(runtime+'tesseract.js');
const langPath=__dirname;
const root=__dirname;
const specs=[['a','20212022_form_a.pdf',53],['b','20212022_form_b.pdf',54],['a-answers','20212022_form_a_-_answers.pdf',46],['b-answers','20212022_form_b_-_answers.pdf',50]];
const queue=[];
for(const [key,file,count] of specs){
 const folder=path.join(root,key);fs.mkdirSync(folder,{recursive:true});
 for(let p=1;p<=count;p++)queue.push({key,file,page:p,image:path.join(folder,`page-${String(p).padStart(2,'0')}.png`),output:path.join(folder,`${p}.json`)});
}
let next=0,done=0;
(async()=>{await Promise.all(Array.from({length:4},async()=>{
 const worker=await createWorker('eng',OEM.LSTM_ONLY,{langPath,cachePath:root,gzip:false});
 await worker.setParameters({preserve_interword_spaces:'1'});
 while(next<queue.length){
  const item=queue[next++];
  if(!fs.existsSync(item.output)){
   if(!fs.existsSync(item.image))execFileSync('pdftoppm',['-f',String(item.page),'-l',String(item.page),'-r','150','-singlefile','-png','C:/Users/Nathan Im/Downloads/'+item.file,item.image.slice(0,-4)],{stdio:'ignore'});
   const {data}=await worker.recognize(item.image,{}, {text:true,blocks:true});
   fs.writeFileSync(item.output,JSON.stringify({...item,text:data.text,confidence:data.confidence,blocks:data.blocks}));
  }
  done++;if(done%5===0)console.log('OCR',done,'/',queue.length,item.key,item.page);
 }
 await worker.terminate();
}));
for(const [key,file,count] of specs){const pages=Array.from({length:count},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,key,`${i+1}.json`))));fs.writeFileSync(path.join(root,key+'.txt'),pages.map(p=>'=== PDF PAGE '+p.page+' ===\n'+p.text).join('\n\n'));}
console.log('OCR finished');})().catch(e=>{console.error(e);process.exit(1)});
