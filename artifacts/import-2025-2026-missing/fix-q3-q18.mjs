import fs from 'node:fs/promises';import {isDeepStrictEqual} from 'node:util';
const dir=new URL('./',import.meta.url),base='http://127.0.0.1:4319';const state=await fetch(base+'/api/state').then(r=>r.json());
async function post(route,body){const r=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(JSON.stringify(d));return d;}
const section=state.mathSections.find(s=>s.fileName==='2025-2026-form-bMath.ts'),before=structuredClone(section),q3=section.questions[2],q18=section.questions[17];
if(!q3.id.endsWith('-60')||!q18.id.endsWith('-75'))throw Error('Unexpected question order');
q3.dragDropContent=['There were {{slot-1}} students surveyed, and {{slot-2}} students like only soccer.'];
q3.dragDropContentHtml='<p>There were {{slot-1}} students surveyed, and {{slot-2}} students like only soccer.</p>';
q18.hideChoiceLabels=true;
const rects=JSON.parse(await fs.readFile(new URL('q18-source-tables.json',dir),'utf8'));
for(const [i,c]of q18.choices.entries()){
 const fileName=`q18-source-table-${i+1}.png`,bytes=await fs.readFile(new URL(fileName,dir));const d=await post('/api/images',{passageId:`2025-2026-form-b-q18-choice-${c.id.toLowerCase()}-testnav`,fileName,mimeType:'image/png',dataUrl:'data:image/png;base64,'+bytes.toString('base64')});
 const alt=rects[i].text.replace(/\t/g,', ').replace(/\n/g,'; ');c.html=`<img src="${d.image.src}" alt="${alt}" width="${Math.ceil(rects[i].width)}">`;
}
await fs.writeFile(new URL('fix-q3-q18-payload.json',dir),JSON.stringify({before,after:section},null,2));
await post('/api/math',{...section,assessmentId:'2025-2026-form-b'});
const now=await fetch(base+'/api/state').then(r=>r.json()),saved=now.mathSections.find(s=>s.fileName===section.fileName);const changes=before.questions.map((q,i)=>isDeepStrictEqual(q,saved.questions[i])?null:i+1).filter(Boolean);
if(JSON.stringify(changes)!=='[3,18]')throw Error('Unexpected changed questions: '+changes);
await fs.writeFile(new URL('fix-q3-q18-receipt.json',dir),JSON.stringify({changedQuestions:changes,count:saved.questions.length,q3:saved.questions[2],q18:saved.questions[17]},null,2));console.log('Saved questions',changes,'of',saved.questions.length);
