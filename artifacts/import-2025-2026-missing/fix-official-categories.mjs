import fs from 'node:fs/promises';import {isDeepStrictEqual} from 'node:util';
const base='http://127.0.0.1:4319',state=()=>fetch(base+'/api/state').then(r=>r.json()),s=await state();
const official=s.tests.filter(t=>/^20\d\d-20\d\d-form-[a-d]$/.test(t.assessmentId)||s.assessments.some(a=>a.id===t.assessmentId&&/^official[ -]practice$/i.test(a.examLabel||'')));
const ids=new Set(official.flatMap(t=>t.passageIds));
for(const p of s.passages)if(p.versionLabels?.some(l=>/^20\d\d-20\d\d Form [A-D]$/.test(l)))ids.add(p.id);
const prestigeIds=new Set(s.tests.filter(t=>s.assessments.some(a=>a.id===t.assessmentId&&a.examLabel?.toLowerCase()==='prestige')).flatMap(t=>t.passageIds));
if([...ids].some(id=>prestigeIds.has(id)))throw Error('Shared official and Prestige assignment needs inspection');
const targets=s.passages.filter(p=>ids.has(p.id)&&p.passageCategory!=='official_handbook');
const dir='artifacts/import-2025-2026-missing/';await fs.writeFile(dir+'official-category-before.json',JSON.stringify(s.passages,null,2));
const r=await fetch(base+'/api/passages/category',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':s.editToken},body:JSON.stringify({mode:'exam',passageCategory:'official_handbook',items:targets.map(p=>({id:p.id,sourceHash:p.sourceHash}))})});if(!r.ok)throw Error(await r.text());
const after=await state();const incorrect=after.passages.filter(p=>ids.has(p.id)&&p.passageCategory!=='official_handbook');if(incorrect.length)throw Error('Incorrect categories remain');
const strip=p=>Object.fromEntries(Object.entries(p).filter(([k])=>!['sourceHash','passageCategory'].includes(k)));
for(const old of s.passages){const now=after.passages.find(p=>p.id===old.id);if(!isDeepStrictEqual(strip(old),strip(now)))throw Error('Content changed '+old.id);if(!ids.has(old.id)&&old.passageCategory!==now.passageCategory)throw Error('Unrelated category changed');}
const report={officialExams:official.length,officialPassages:ids.size,assignedPassages:new Set(official.flatMap(t=>t.passageIds)).size,corrected:targets.map(p=>({id:p.id,title:p.title,before:p.passageCategory,after:'official_handbook'})),remainingMislabeled:incorrect.length,prestigePassagesUnchanged:prestigeIds.size,contentUnchanged:true};await fs.writeFile(dir+'official-category-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
