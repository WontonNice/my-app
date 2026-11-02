import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import contract from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319',id='cross-purposes-2023-2024-form-b';
const state=await fetch(url+'/api/state').then(r=>r.json()),passage=state.passages.find(p=>p.id===id);
assert(passage);
const original=await fs.readFile(new URL('cross-purposes-before-fix.json',base),'utf8').then(JSON.parse).catch(error=>{if(error.code==='ENOENT')return passage;throw error;});
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const preserved=digest({...passage,richText:undefined,text:undefined,sourceHash:undefined});
const otherPassages=state.passages.filter(p=>p.id!==id).map(p=>[p.id,digest(p)]);
const orders=state.tests.map(t=>[t.assessmentId,t.questionOrder]);
const lines=Array.from(original.richText.matchAll(/<div data-poetry-line="true">([\s\S]*?)<\/div>/g),m=>m[1].replace(/^(?:&nbsp;|\s)+/,''));
assert.equal(lines.length,42);
const textLines=original.text.split('\n').filter(line=>line.trim());assert.equal(textLines.length,42);
const stanzas=Array.from({length:6},(_,i)=>lines.slice(i*7,i*7+7));
// Explicit verse preserves its authored spaces in the existing renderer. The
// generic indent class squeezes long lines; this poem needs its source offset.
const richText=contract.sanitizeRichText(stanzas.map((stanza,i)=>stanza.map(html=>`<div data-poetry-line="true">${i%2?'&nbsp;'.repeat(18):''}${html}</div>`).join('')).join('<div></div>'));
const text=Array.from({length:6},(_,i)=>textLines.slice(i*7,i*7+7).join('\n')).join('\n\n');
assert.deepEqual(text.split('\n').filter(line=>line.trim()),textLines,'source words, indentation and verse breaks stay intact');
assert.equal((richText.match(/(?:&nbsp;){18}/g)||[]).length,21);
assert.equal((richText.match(/data-glossary-definition=/g)||[]).length,1);
await fs.writeFile(new URL('cross-purposes-before-fix.json',base),JSON.stringify(original,null,2));
const response=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,richText,text,preserveSourceLayout:true,publishNow:true})});
const saved=await response.json();if(!response.ok)throw Error(saved.message);
const after=await fetch(url+'/api/state').then(r=>r.json()),current=after.passages.find(p=>p.id===id);
assert.equal(current.richText,richText);assert.equal(current.text,text);
assert.equal(digest({...current,richText:undefined,text:undefined,sourceHash:undefined}),preserved,'questions, keys, glossary and metadata preserved');
for(const [otherId,hash] of otherPassages)assert.equal(digest(after.passages.find(p=>p.id===otherId)),hash,'other passages untouched');
for(const [assessmentId,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===assessmentId).questionOrder,order,'exam question order preserved');
for(const file of ['form-b-import.json','form-b-english.json','form-b-raw-capture.json']){
 const path=new URL(file,base),data=JSON.parse(await fs.readFile(path,'utf8')),poem=data.passages.find(p=>p.title==='Cross-Purposes');
 assert(poem);poem.richText=richText;poem.text=text;await fs.writeFile(path,JSON.stringify(data,null,2));
}
const exported=JSON.parse(await fs.readFile(new URL('../../server/data/exam-content.json',base),'utf8'));
const poem=exported['2023-2024-form-b'].passageSets.find(p=>p.passage.id===id).passage;
const verse=poem.lines.filter(line=>line.poetryLine===true);
assert.equal(verse.length,42);assert.equal(verse.filter(line=>/^ {18}\S/.test(line.text)).length,21);
assert.deepEqual(verse.map(line=>line.text.trimStart()),textLines.map(line=>line.trimStart()));
assert.deepEqual(verse.filter(line=>line.lineNumber).map(line=>[line.lineNumber,line.text.trimStart()]),[
 ['5','cars, trucks, people, even trains'],['10','built me. I am gravity’s best friend; I pool'],
 ['15','What you are is an accident,'],['20','of small towns, into the cities, to the sea.'],
 ['25','nourishes grasses, permits empires to rise.'],['30','a friend of time, does it not? And it means'],
 ['35','We bind you up. We sew you.'],['40','I am listening to the bright hum'],
]);
await fs.writeFile(new URL('cross-purposes-after-fix.json',base),JSON.stringify(current,null,2));
console.log('Cross-Purposes saved: 42 verse lines, six seven-line stanzas, alternating 21 indented lines and correct gutter labels. Other passages and all question orders unchanged.');
