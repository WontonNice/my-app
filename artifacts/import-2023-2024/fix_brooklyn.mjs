import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const state=await fetch(url+'/api/state').then(r=>r.json());
const passage=state.passages.find(p=>p.id==='letter-from-brooklyn-2023-2024-form-a');
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const preserved=digest({...passage,richText:undefined,sourceHash:undefined});
const orders=new Map(state.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,JSON.stringify(t.questionOrder)]));
const verse=[...passage.richText.matchAll(/<div data-poetry-line="true">([\s\S]*?)<\/div>/g)].map(m=>m[0]);
assert.equal(verse.length,26);
const richText=verse.join('');
const response=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,richText,preserveSourceLayout:true,publishNow:true})});
const saved=await response.json();if(!response.ok)throw Error(saved.message);
const after=await fetch(url+'/api/state').then(r=>r.json());
const current=after.passages.find(p=>p.id===passage.id);
assert.equal(digest({...current,richText:undefined,sourceHash:undefined}),preserved);
for(const [id,order] of orders)assert.equal(JSON.stringify(after.tests.find(t=>t.assessmentId===id).questionOrder),order);
// Correct the downloadable capture as well, so a later import cannot restore
// the malformed nested stanza wrapper. Keep the original source text intact.
for(const file of ['form-a-import.json','form-a-english.json','form-a-raw-capture.json']){
 const path=new URL(file,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 const poem=data.passages.find(p=>p.title==='Letter from Brooklyn');
 poem.richText=richText;await fs.writeFile(path,JSON.stringify(data,null,2));
}
const exported=JSON.parse(await fs.readFile(new URL('../../server/data/exam-content.json',base),'utf8'));
const poem=exported['2023-2024-form-a'].passageSets.find(p=>p.passage.id===passage.id).passage;
const lines=poem.lines.filter(line=>line.poetryLine===true);
assert.equal(lines.length,26);
assert.deepEqual(lines.map(line=>line.text),passage.text.split('\n'));
assert.deepEqual(lines.filter(line=>line.lineNumber).map(line=>[line.lineNumber,line.text]),[
 ['5','The weather will turn cold.'],['10','the hair of my arm like a passing stranger,'],['15','like someone drawing your attention'],['20','like a pop-up picture book I could have had as a child,'],['25','distinctly myself, and an awareness'],
]);
console.log('Saved 26 top-level verse lines; all five numbered gutter labels are correct. Text, glossary, questions and English display order are unchanged.');
