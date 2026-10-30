import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {load} from 'cheerio';
import katex from 'katex';
const require=createRequire(import.meta.url),documentImport=require('./document-import.cjs');
const root=path.resolve(process.argv[2]),report={forms:[],questions:0,assets:0,mathExpressions:0,errors:[]};
for(const form of ['A','B','C','D']) {
 const folder=path.join(root,`testnav-${form}`),data=JSON.parse(await fs.readFile(path.join(folder,'import.json'),'utf8'));
 const raw=[...data.passages.flatMap(p=>p.questions),...data.mathQuestions];
 const parsed=documentImport.parse(JSON.stringify(data));
 const normalized=parsed.flatMap(e=>e.content.questions);
 assert.equal(raw.length,100);assert.equal(normalized.length,100);assert.equal(data.mathQuestions.length,50);
 assert.deepEqual(raw.map(q=>Number(q.sourceQuestion)),Array.from({length:100},(_,i)=>i+1));
 const files=new Set(data.source.assets.map(a=>a.destination));
 const checkRich=(html,context)=>{
  if(!html)return;
  const $=load(html,null,false);
  $('img').each((_,el)=>assert.ok(files.has($(el).attr('src')),`${context}: unknown image ${$(el).attr('src')}`));
  assert.equal($('script,iframe,object,foreignObject').length,0,`${context}: executable markup`);
  for(const match of $.root().text().matchAll(/\\\(([\s\S]*?)\\\)/g)) {
   try{katex.renderToString(match[1],{throwOnError:true,strict:'error'});report.mathExpressions++}catch(error){report.errors.push(`${context}: ${match[1]} — ${error.message}`)}
  }
 };
 for(const a of data.source.assets) {
  const bytes=await fs.readFile(a.localPath);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);
  if(a.file.endsWith('.svg'))assert.ok(!/<script|<foreignObject|\son\w+\s*=|(?:href|xlink:href)\s*=\s*['"](?:https?:|\/\/)|url\(['"]?(?:https?:|\/\/)/i.test(bytes.toString('utf8')),`Unsafe SVG ${a.file}`);
  report.assets++;
 }
 for(const p of data.passages) {checkRich(p.richText,`${form} ${p.title}`);if(p.text)assert.ok(p.richText);}
 for(const q of raw) {
  const n=normalized.find(n=>n.id===q.id);assert.ok(n,`Question lost: ${q.id}`);assert.equal(n.type,q.type,`Type changed: ${q.id}`);
  assert.ok(q.source.keyEvidence,`Key provenance missing: ${q.id}`);
  for(const field of ['promptHtml','stimulusHtml','selectionHtml','explanationHtml','dragDropContentHtml','dropdownContentHtml']) {
   checkRich(q[field],`${q.id}.${field}`);
   if(q[field])assert.ok(n[field],`Importer lost ${q.id}.${field}`);
  }
  if(q.choices){assert.ok(q.choices.length>=2);for(const c of q.choices){assert.ok(c.html||c.text);checkRich(c.html,`${q.id} choice${c.id}`)}}
  const choiceIds=new Set(q.choices?.map(c=>c.id));
  if(q.type==='multiple_choice')assert.ok(choiceIds.has(q.correctChoiceId),`Bad key ${q.id}`);
  if(q.type==='multi_select'){assert.ok(q.correctChoiceIds.length>1);q.correctChoiceIds.forEach(id=>assert.ok(choiceIds.has(id)));}
  if(['short_response','expression_entry','numeric_entry'].includes(q.type))assert.ok(q.correctTextAnswers.length>0);
  if(q.type==='math_drag_drop'){const ids=new Set(q.items.map(i=>i.id));assert.ok(q.dragDropSlots.length);q.dragDropSlots.forEach(s=>assert.ok(ids.has(s.correctItemId),`Bad slot key ${q.id}`));}
  if(q.type==='inline_dropdown')q.dropdowns.forEach(d=>assert.ok(d.options.some(o=>o.id===d.correctChoiceId)));
  if(['matrix_choice','category_sort'].includes(q.type)){assert.equal(Object.keys(q.correctPlacements).length,q.requiredPlacements);const ids=new Set(q.categories.map(c=>c.id));Object.values(q.correctPlacements).forEach(v=>assert.ok(ids.has(v)));}
  if(q.type==='graph_point_select'){assert.ok(q.graph.sourceImage.width>0&&q.graph.sourceImage.height>0);q.correctPointIds.forEach(id=>assert.ok(q.graph.points.some(p=>p.id===id)));}
  if(q.type==='number_line_response')assert.equal(typeof q.numberLineResponse.correctValue,'number');
  report.questions++;
 }
 report.forms.push({form,questions:raw.length,ela:50,math:50,passages:7,standaloneQuestions:data.passages.at(-1).questions.length,assets:data.source.assets.length});
}
report.passed=report.errors.length===0;
await fs.writeFile(path.join(root,'validation.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
