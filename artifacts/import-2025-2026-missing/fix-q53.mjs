import fs from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const base='http://127.0.0.1:4319';
const state=await fetch(base+'/api/state').then(r=>r.json());
const section=state.mathSections.find(s=>s.fileName==='2025-2026-form-bMath.ts');
const before=structuredClone(section), q=section.questions[52];
if(!q.id.endsWith('-110') || !q.prompt.includes('Amiya')) throw Error('Unexpected question');
q.entryVariable='x, y';
q.entryLayout='plain';
// The old prefixed response stored only the right-hand side. The source asks
// for the complete equation, so retain the same key with its authored label.
q.correctTextAnswers=q.correctTextAnswers.map(a=>a.includes('=')?a:`${q.entryPrefixVariable}=${a}`);
delete q.entryPrefixVariable;
await fs.writeFile(new URL('fix-q53-before.json',import.meta.url),JSON.stringify(before,null,2));
const res=await fetch(base+'/api/math',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...section,assessmentId:'2025-2026-form-b'})});
if(!res.ok)throw Error(await res.text());
const saved=(await fetch(base+'/api/state').then(r=>r.json())).mathSections.find(s=>s.fileName===section.fileName);
const changed=before.questions.flatMap((q,i)=>isDeepStrictEqual(q,saved.questions[i])?[]:[i+1]);
if(JSON.stringify(changed)!=='[53]')throw Error('Unexpected changes: '+changed);
await fs.writeFile(new URL('fix-q53-receipt.json',import.meta.url),JSON.stringify({changedQuestions:changed,question:saved.questions[52]},null,2));
console.log('Saved Q53 with',saved.questions[52].entryVariable,'and key',saved.questions[52].correctTextAnswers);
