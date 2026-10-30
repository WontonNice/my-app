import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createWorker, OEM } from 'tesseract.js';
const require=createRequire(import.meta.url);
const langPath=path.dirname(require.resolve('@tesseract.js-data/eng/package.json'))+'/4.0.0_best_int';
const root=path.resolve(process.argv[2]);
const queue=[];
for(const form of ['A','B','C','D']) {
 const folder=path.join(root,`testnav-${form}`),inv=JSON.parse(await fs.readFile(path.join(folder,'inventory.json'),'utf8'));
 for(const item of inv.items.filter(i=>i.question)) {
  const image=inv.assets.find(a=>a.url===item.exhibit);
  if(!image)throw new Error(`Missing official exhibit: ${form} ${item.number}`);
  queue.push({form,itemId:item.itemId,number:item.number,exhibit:item.exhibit,image:path.join(folder,image.file),output:path.join(folder,'ocr',`${item.number}.json`)});
 }
}
let next=0,complete=0;
await Promise.all(Array.from({length:3},async()=>{
 const worker=await createWorker('eng',OEM.LSTM_ONLY,{langPath,cachePath:path.join(root,'ocr-cache')});
 await worker.setParameters({preserve_interword_spaces:'1'});
 while(next<queue.length) {
  const item=queue[next++];
  try{await fs.access(item.output);complete++;continue}catch{}
  const {data}=await worker.recognize(item.image,{}, {text:true,blocks:true});
  await fs.mkdir(path.dirname(item.output),{recursive:true});
  await fs.writeFile(item.output,JSON.stringify({...item,text:data.text,confidence:data.confidence,blocks:data.blocks},null,2));
  complete++;if(complete%25===0)console.log('OCR',complete,'/',queue.length);
 }
 await worker.terminate();
}));
console.log('OCR complete',complete);
