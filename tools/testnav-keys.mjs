import fs from 'node:fs/promises';
import path from 'node:path';
import {responseSchema} from './testnav-adapter.mjs';
const overrides=JSON.parse(await fs.readFile(new URL('./testnav-key-overrides.json',import.meta.url),'utf8'));
const root=path.resolve(process.argv[2]);
for(const form of ['A','B','C','D']) {
 const folder=path.join(root,`testnav-${form}`),inv=JSON.parse(await fs.readFile(path.join(folder,'inventory.json'),'utf8')),keys={};
 for(const item of inv.items.filter(i=>i.question)) {
  const ocr=JSON.parse(await fs.readFile(path.join(folder,'ocr',`${item.number}.json`),'utf8'));
  const data=JSON.parse(await fs.readFile(path.join(folder,item.file),'utf8')),sc=responseSchema(data);
  const manual=overrides[form]?.[item.number];
  if(manual) keys[item.number]={...manual,evidence:{kind:manual.visualVerified?'official-exhibit-visual':'official-exhibit-reviewed-text',imageUrl:item.exhibit,ocrConfidence:ocr.confidence}};
  else if(sc[0].interactionType==='CHOICEINTERACTION'&&sc[0].cardinality==='single') {
   const matches=[...ocr.text.matchAll(/(?:^|\n)[O0©]?\s*([A-H])\.\s*CORRECT\b/g)];
   const prefix=ocr.text.match(/^\(?([A-H])\)\s*/);
   if(matches.length===1||prefix)keys[item.number]={correctChoiceId:matches[0]?.[1]||prefix[1],evidence:{kind:'official-exhibit-explicit-key-ocr',imageUrl:item.exhibit,ocrConfidence:ocr.confidence}};
  }
  if(!keys[item.number])throw new Error(`Unverified key: ${form} ${item.number}`);
 }
 await fs.writeFile(path.join(folder,'verified-keys.json'),JSON.stringify(keys,null,2));
 console.log(form,Object.keys(keys).length,'keys');
}
