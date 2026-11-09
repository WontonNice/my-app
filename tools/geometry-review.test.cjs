const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {geometryReviewTemplates,generateGeometryReview}=require('../server/src/shared/geometryReviewPractice.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const numeric=text=>{text=text.replace('π','');return text.includes('/')?Number(text.split('/')[0])/Number(text.split('/')[1]):Number(text);};
const numbers=prompt=>[...prompt.replace(/\\frac\{(-?[\d.]+)\}\{([\d.]+)\}/g,(_,n,d)=>String(Number(n)/Number(d))).matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));
// Solve from the displayed stem, independently of the generator's answer/parameters.
function solve(key,q){const n=numbers(q.prompt);switch(key){
 case 'wheel-revolutions':return n[0]/(2*22/7*(q.prompt.includes('diameter')?n[2]/2:n[2]));
 case 'fractional-number-line':return n[0]-n[1]+n[2]-n[3];
 case 'parallelogram-angles':return 90+n[0];
 case 'scale-perimeter':return (2*(n[0]+n[1])+(q.prompt.includes('U-shaped')?2*n[3]:0))*n[4];
 case 'cube-building':return Math.cbrt(n[0])*n[1];
 case 'floor-tiles':return (n[0]*n[1]-(q.prompt.includes('L-shaped')?n[2]*n[3]:0))/n.at(-1)**2;
 case 'circle-area-difference':return (n[0]**2-n[1]**2)/(q.prompt.includes('diameters')?4:1);
 case 'cube-volume-edge':return Math.cbrt(n[0]);
 case 'box-surface-area':return 2*(n[0]*n[1]+n[0]*n[2]+n[1]*n[2]);
 case 'rectangle-transversal':return 270-n[0];
 case 'similar-rectangle-area':return n[0]*n[2]**2/(n[1]/2-n[0]);
 case 'mixed-unit-volume':return n[0]*n[1]*n[2]/12;
 case 'perpendicular-transversal':return 90-n[0];
 case 'intersecting-lines':return n[0]-n[1];
 case 'number-line-ratio':return n[0]+(n[1]-n[0])*n[2]/(1+n[2]);
 case 'prism-cross-section':return 2*(n[2]+1)*Math.sqrt(n[0]/(n[1]*n[2]));
 default:throw Error(key);
}}
const signature=q=>JSON.stringify([q.prompt,q.image.src]);
for(const template of geometryReviewTemplates)test(`${template.title}: every variant has a consistent figure, independently verified key and unique problem`,()=>{
 const unique=new Set();
 for(let i=0;i<template.distinctCount;i++){
  const {question:q}=generateGeometryReview(template.id,i,'');
  const expected=solve(template.key,q),key=q.correctTextAnswers?.[0]??q.choices.find(c=>c.id===q.correctChoiceId).text;
  assert.ok(Math.abs(numeric(key)-expected)<1e-8,`${template.id} ${i}: ${key} versus ${expected}`);
  assert.ok(Number.isFinite(expected));
  const svg=decodeURIComponent(q.image.src.split(',')[1]);
  assert.match(svg,/<svg[^>]*viewBox="0 0 520 280"/);assert.match(svg,/<title>.+<\/title>/);
  assert.doesNotMatch(svg,/NaN|Infinity|<script|onload=|href=/);
  assert.ok(q.image.alt.length>20);assert.ok(q.explanation.length>60);
  assert.equal(unique.has(signature(q)),false,`${template.id}: repeated domain member ${i}`);unique.add(signature(q));
  if(q.choices){
   assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(c=>numeric(c.text))).size,4);
   assert.equal(q.choices.filter(c=>Math.abs(numeric(c.text)-expected)<1e-8).length,1);
   for(const choice of q.choices)assert.equal(isExamQuestionCorrect(q,choice.id),choice.id===q.correctChoiceId);
  }else{assert.equal(isExamQuestionCorrect(q,key),true);assert.equal(isExamQuestionCorrect(q,String(expected+1)),false);}
 }
 assert.equal(unique.size,template.distinctCount);
 for(const seed of ['', 'geometry-review', 'another student']){
  assert.equal(signature(generateGeometryReview(template.id,0,seed).question),signature(generateGeometryReview(template.id,template.distinctCount,seed).question));
  assert.deepEqual(generateGeometryReview(template.id,23,seed),generateGeometryReview(template.id,23,seed));
 }
 for(const bad of [-1,.5,Infinity,NaN,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>generateGeometryReview(template.id,bad,''));
});

test('the original sixteen examples remain in the domain with their original answers',()=>{
 const answers=[700,5.5,162,95,5,160,45,8,7600,140,16/3,120,55,35,0,36];
 assert.equal(geometryReviewTemplates.length,16);assert.equal(new Set(geometryReviewTemplates.map(t=>t.sourceId)).size,16);
 geometryReviewTemplates.forEach((t,i)=>assert.ok(Math.abs(solve(t.key,generateGeometryReview(t.id,0,'').question)-answers[i])<1e-8,t.sourceId));
});

test('generated L, T and U boundaries match independently measured perimeters and orthogonal edges',()=>{
 const t=geometryReviewTemplates.find(t=>t.key==='scale-perimeter');
 const shapes=new Set();
 for(let i=0;i<t.distinctCount;i++){
  const {question:q,parameters:p}=generateGeometryReview(t.id,i,'');shapes.add(p.shape);
  const svg=decodeURIComponent(q.image.src.split(',')[1]);
  const points=svg.match(/<polygon points="([^"]+)"/)[1].split(' ').map(p=>p.split(',').map(Number));
  let boundary=0;for(let j=0;j<points.length;j++){const a=points[j],b=points[(j+1)%points.length];assert.ok(a[0]===b[0]||a[1]===b[1]);boundary+=Math.hypot(a[0]-b[0],a[1]-b[1]);}
  const s=Math.min(320/p.w,150/p.h);assert.ok(Math.abs(boundary/s*p.scale-solve(t.key,q))<.03);
 }
 assert.deepEqual([...shapes].sort(),[0,1,2]);
});

test('catalog integration, source provenance, immutable question snapshots and additive registration',()=>{
 const {defaultPracticeCatalog,generateCatalogQuestion,managedGeneratorIds}=require('../server/src/shared/practiceCatalog.ts');
 const {addBuiltinPractice}=require('./register-practice-generator.cjs');
 const full=defaultPracticeCatalog();
 const ids=new Set(geometryReviewTemplates.map(t=>t.id)),modules=new Set(geometryReviewTemplates.map(t=>t.moduleId));
 let existing={...full,generators:full.generators.filter(g=>!ids.has(g.id)),modules:full.modules.filter(m=>!modules.has(m.id))};
 const before=JSON.stringify(existing);
 for(const t of geometryReviewTemplates){
  const def=full.generators.find(g=>g.id===t.id);assert.deepEqual(def.sourceQuestionIds,[t.sourceId]);
  assert.equal(def.category,'Geometry');assert.equal(def.topic,t.topic);
  const q=generateCatalogQuestion(def,2,'snapshot'),saved=structuredClone(q);generateCatalogQuestion(def,3,'snapshot');assert.deepEqual(q,saved);
  const module=full.modules.find(m=>m.id===t.moduleId),parent=full.modules.find(m=>m.id===module.parentId);assert.equal(parent.defaultType,'foundation');
  const general=full.modules.find(m=>m.defaultType==='general'&&m.category==='Geometry'&&m.topic===t.topic);assert.ok(managedGeneratorIds(general,full).includes(t.id));
 }
 let registered=existing;for(const t of geometryReviewTemplates)registered=addBuiltinPractice(registered,t);
 assert.equal(JSON.stringify(existing),before);
 assert.deepEqual(registered.generators.filter(g=>!ids.has(g.id)),existing.generators);
 for(const t of geometryReviewTemplates)assert.deepEqual(addBuiltinPractice(registered,t),registered);
});

test('mixed review registration preserves existing recommendations and refuses conflicting edits',()=>{
 const {defaultPracticeCatalog,recommendedPracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
 const {addRecommendedPractice}=require('./register-practice-generator.cjs');
 const catalog={...defaultPracticeCatalog(),recommended:[{id:'existing',title:'Existing',modules:[{id:'existing-module',title:'Keep me',generatorIds:['one-step-inequalities-v1'],published:true}]}]};
 const before=JSON.stringify(catalog),request={id:'geometry-review',title:'Geometry Review',module:{id:'geometry-figures-mixed-review',title:'Geometry: Mixed Figure Practice',generatorIds:geometryReviewTemplates.map(t=>t.id),published:true}};
 const next=addRecommendedPractice(catalog,request);
 assert.equal(JSON.stringify(catalog),before);assert.deepEqual(next.recommended[0],catalog.recommended[0]);
 assert.deepEqual(addRecommendedPractice(next,request),next);
 assert.throws(()=>addRecommendedPractice(next,{...request,module:{...request.module,generatorIds:[]}}),/different saved selections/);
 assert.throws(()=>addRecommendedPractice(catalog,{...request,module:{...request.module,generatorIds:['missing']}}),/unregistered/);
 const mixed=recommendedPracticeCatalog(next,request.module.id);assert.equal(mixed.generators.length,16);
});
