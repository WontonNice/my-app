import fs from 'node:fs/promises';
const url='http://127.0.0.1:4319',base=new URL('./',import.meta.url);
const titles=JSON.parse(await fs.readFile(new URL('source-title-formatting.json',base),'utf8'));
const receipts=JSON.parse(await fs.readFile(new URL('import-receipts.json',base),'utf8'));
for(const f of ['a','b'])for(let i=0;i<7;i++){
 const html=titles[f][i].replace(/^<p>|<\/p>$/g,'');if(!html.includes('<em>'))continue;
 const state=await fetch(url+'/api/state').then(r=>r.json()),p=state.passages.find(p=>p.id===receipts[f].passages[i].id);
 if(p.titleHtml===html)continue;
 const r=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...p,titleHtml:html,preserveSourceLayout:true,publishNow:true})});
 const d=await r.json();if(!r.ok)throw Error(d.message);console.log('Retained source title italics:',p.title);
}
