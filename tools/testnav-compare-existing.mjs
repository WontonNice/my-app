/** Read-only identity comparison. Writes evidence only; never rewrites authored questions. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
import katex from 'katex';
import {auditQuestionFingerprint} from './source-exam-transfer.mjs';
const repo=fileURLToPath(new URL('..',import.meta.url));
const input=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
function text(value) {
 let raw=String(value||'');
 raw=raw.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,(_,a,b)=>math(a||b));
 const $=load(raw,null,false);$('br,p,li,tr').append(' ');return $.root().text();
}
function math(value){try{const $=load(katex.renderToString(value,{output:'mathml',throwOnError:true}),null,false);$('annotation').remove();return $.root().text()}catch{return value}}
function normalize(value){return text(value).normalize('NFKC').replace(/[−–]/g,'-').replace(/[’‘]/g,"'").replace(/\\(?:times|cdot)|[×⋅·]/g,'*').replace(/\\left|\\right|\\[,!; ]|[{}]/g,'').replace(/\s+/g,'').toLowerCase()}
function choice(c){return normalize(c.math?math(c.math):text(c.html).trim()?c.html:c.text)}
function key(q){
 if(q.correctChoiceId)return {choice:q.correctChoiceId};
 if(q.correctChoiceIds)return {choices:[...q.correctChoiceIds].sort()};
 if(q.correctTextAnswers)return {text:q.correctTextAnswers.map(normalize)};
 if(q.dropdowns)return {dropdowns:q.dropdowns.map(d=>normalize(d.options.find(o=>o.id===d.correctChoiceId)?.text))};
 if(q.dragDropSlots)return {slots:q.dragDropSlots.map(d=>choice(q.items.find(o=>o.id===d.correctItemId)||{}))};
 if(q.correctPointIds)return {points:q.correctPointIds.map(id=>{const p=q.graph.points.find(p=>p.id===id);return [p.x,p.y]})};
 if(q.numberLineResponse){const n=q.numberLineResponse;return {ray:[n.correctValue,n.correctDirection,n.correctEndpoint]}}
 return {};
}
const report={scope:'Read-only comparison of all existing Form A/D Math items against the official TestNav capture. No content or student records modified.',forms:[]};
for(const form of ['A','D']){
 const file=path.join(repo,`client/src/content/exams/mathSets/2026-2027-form-${form.toLowerCase()}Math.ts`),raw=await fs.readFile(file,'utf8');
 const start=raw.indexOf('questions: ['),end=raw.lastIndexOf('],');
 if(start<0||end<start)throw Error(`Unrecognized static content shape: ${file}`);
 const incomingRaw=await fs.readFile(path.join(input,`testnav-${form}/import.json`),'utf8');
 const existing=JSON.parse(raw.slice(start+11,end+1)),incoming=JSON.parse(incomingRaw).mathQuestions;
 const cached=JSON.parse(await fs.readFile(path.join(repo,'server/data/exam-content.json'),'utf8'))[`2026-2027-form-${form.toLowerCase()}`].mathSection.questions;
 if(existing.length!==50||incoming.length!==50)throw Error('Expected exactly 50 Math questions in each source');
 const rows=existing.map((e,i)=>{const n=incoming[i],ek=key(e),nk=key(n);return {mathNumber:i+1,sourceNumber:i+51,existingId:e.id,incomingId:n.id,existingQuestionSha256:auditQuestionFingerprint(e),sourceQuestionSha256:auditQuestionFingerprint(n),existingType:e.type,incomingType:n.type,typeEqual:e.type===n.type,
  keyEqual:JSON.stringify(ek)===JSON.stringify(nk),existingKey:ek,incomingKey:nk,
  promptEqual:normalize(e.prompt)===normalize(n.prompt),existingPrompt:e.prompt,incomingPrompt:n.prompt||text(n.dropdownContentHtml),
  choicesEqual:JSON.stringify(e.choices?.map(choice))===JSON.stringify(n.choices?.map(choice)),existingChoices:e.choices?.map(c=>({id:c.id,text:c.text,html:c.html,math:c.math})),incomingChoices:n.choices,
  existingDropdowns:e.dropdowns,incomingDropdowns:n.dropdowns,
  existingItems:e.items,incomingItems:n.items};});
 report.forms.push({form,assessmentId:`2026-2027-form-${form.toLowerCase()}`,sourcePackageSha256:createHash('sha256').update(incomingRaw).digest('hex'),cachedContentExactlyMatchesAuthored:JSON.stringify(existing)===JSON.stringify(cached),existingFile:file,questions:50,typeDifferences:rows.filter(r=>!r.typeEqual).map(r=>r.mathNumber),keyDifferences:rows.filter(r=>!r.keyEqual).map(r=>r.mathNumber),choiceDifferences:rows.filter(r=>!r.choicesEqual).map(r=>r.mathNumber),rows});
}
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));
console.log(JSON.stringify(report.forms.map(({rows,...f})=>f),null,2));
