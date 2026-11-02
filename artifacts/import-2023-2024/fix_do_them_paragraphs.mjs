import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319';
const state=await fetch(url+'/api/state').then(r=>r.json());
const passage=state.passages.find(p=>p.id==='excerpt-from-do-them-no-harm-2023-2024-form-a');
const text=passage.text.replace('little streams\n\nand huckleberries','little streams and huckleberries');
const richText=passage.richText.replace('little streams</p><p>and huckleberries','little streams and huckleberries');
assert.notEqual(text,passage.text);assert.notEqual(richText,passage.richText);
assert.equal(text.replace(/\s+/g,' '),passage.text.replace(/\s+/g,' '));
assert.deepEqual([...richText.matchAll(/<p>(\d+)\s/g)].map(m=>Number(m[1])),Array.from({length:26},(_,i)=>i+1));
const response=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,text,richText,preserveSourceLayout:true,publishNow:true})});
const saved=await response.json();if(!response.ok)throw Error(saved.message);
const after=await fetch(url+'/api/state').then(r=>r.json());
const current=after.passages.find(p=>p.id===passage.id);
assert.deepEqual({...current,text:undefined,richText:undefined,sourceHash:undefined},{...passage,text:undefined,richText:undefined,sourceHash:undefined});
for(const test of state.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')))assert.deepEqual(after.tests.find(t=>t.assessmentId===test.assessmentId).questionOrder,test.questionOrder);
for(const file of ['form-a-import.json','form-a-english.json','form-a-raw-capture.json']){
 const path=new URL(file,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 const p=data.passages.find(p=>p.title==='Excerpt from Do Them No Harm!');
 p.text=text;p.richText=richText;await fs.writeFile(path,JSON.stringify(data,null,2));
}
const exported=JSON.parse(await fs.readFile(new URL('../../server/data/exam-content.json',base),'utf8'));
for(const form of ['a','b'])for(const set of exported[`2023-2024-form-${form}`].passageSets){
 if(set.passage.format!=='prose')continue;
 for(const line of set.passage.lines.filter(l=>l.lineNumber)){
  const printed=/^(\d+)\s/.exec(line.text);
  if(printed)assert.equal(printed[1],line.lineNumber,set.passage.title+' numbering');
 }
}
const lines=exported['2023-2024-form-a'].passageSets.find(p=>p.passage.id===passage.id).passage.lines.filter(l=>l.lineNumber);
assert.equal(lines.length,26);assert.match(lines[0].html,/little streams and huckleberries/);
for(const line of lines)assert(!/^\d+\s/.test(line.html),'Printed number must not duplicate its badge');
console.log('Restored 26 complete source paragraphs with one correct badge each. All numbered prose passages in both forms now pass the numbering check.');
