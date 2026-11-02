const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {symbolicFractionDivisionTemplate:template,generateSymbolicFractionDivision:generate}=require('../server/src/shared/symbolicFractionDivision.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {defaultPracticeCatalog,validatePracticeCatalog,managedGeneratorIds,generateCatalogQuestion,studentPracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
const {addBuiltinPractice}=require('./register-practice-generator.cjs');
const {createPracticeState,parsePracticeState,checkPracticeAnswer,nextPracticeQuestion}=require('../client/src/features/math-command/inequalitySession.ts');
const {generatorPreviewCatalog}=require('../client/src/features/math-command/generatorPreview.ts');
const taxonomy=require('./math-topics.json');
const symbols=['w','x','y','z'];
// Independent symbolic algebra: a rational monomial is its four signed exponents.
function vector(latex){
 const match=latex.match(/^\\frac\{([wxyz]+)\}\{([wxyz]+)\}$/);assert.ok(match,latex);
 return symbols.map(s=>[...match[1]].filter(c=>c===s).length-[...match[2]].filter(c=>c===s).length);
}
function displayed(q){
 const definitions=[...q.prompt.matchAll(/([MN])=(\\frac\{[wxyz]\}\{[wxyz]\})/g)];
 assert.equal(definitions.length,2);
 const ratios=Object.fromEntries(definitions.map(([,name,latex])=>[name,vector(latex)]));
 const [,top,bottom]=q.prompt.match(/What is \\\(\\frac\{([MN])\}\{([MN])\}/);
 const expected=ratios[top].map((power,i)=>power-ratios[bottom][i]);
 return {definitions,top,bottom,expected};
}
const values=v=>symbols.map((_,i)=>v[i]);
function evaluateVector(vector,assignment){return vector.reduce((n,power,i)=>n*assignment[i]**power,1);}
function evaluateFraction(latex,assignment){const [,top,bottom]=latex.match(/\\frac\{([wxyz]+)\}\{([wxyz]+)\}/);const multiply=text=>[...text].reduce((n,c)=>n*assignment[symbols.indexOf(c)],1);return multiply(top)/multiply(bottom);}

test('all 48 stems: independent symbolic key, four distinct traps, explanations, and grading',()=>{
 const stems=new Set(),letters=new Set(),directions=new Set();
 for(let index=0;index<template.distinctCount;index++){
  const q=generate(index,'').question,{definitions,top,bottom,expected}=displayed(q);
  assert.ok(!stems.has(q.prompt));stems.add(q.prompt);directions.add(top+bottom);
  assert.equal(q.type,'multiple_choice');assert.equal(q.points,1);assert.equal(q.skilled,'TBD');
  assert.equal(q.topic,'Algebra');assert.equal(q.subtopic,'Algebraic Expressions');
  assert.match(q.prompt,/and \\\(w\\\), \\\(x\\\), \\\(y\\\), and \\\(z\\\) do not equal 0/);
  assert.doesNotMatch(q.prompt,/\$|hours|cm|meters|%/);assert.equal(q.image,undefined);
  assert.equal(q.choices.length,4);assert.deepEqual(q.choices.map(c=>c.id),['A','B','C','D']);
  const vectors=q.choices.map(c=>vector(c.math));assert.equal(new Set(vectors.map(v=>v.join(','))).size,4);
  const correct=q.choices.filter((c,i)=>vectors[i].every((v,j)=>v===expected[j]));assert.equal(correct.length,1);
  assert.equal(q.correctChoiceId,correct[0].id);letters.add(q.correctChoiceId);
  for(const choice of q.choices){assert.equal(choice.text,choice.math);assert.equal(isExamQuestionCorrect(q,choice.id),choice.id===correct[0].id);}
  assert.equal(isExamQuestionCorrect(q,''),false);assert.equal(isExamQuestionCorrect(q,'E'),false);
  assert.equal(isExamQuestionCorrect(q,[correct[0].id]),false);
  // Parse the displayed explanation, verifying the operands, reciprocal, and result independently.
  const steps=[...q.explanation.matchAll(/\\frac\{([wxyz]+)\}\{([wxyz]+)\}/g)].map(m=>m[0]);
  assert.equal(steps.length,5);const named=Object.fromEntries(definitions.map(([,name,latex])=>[name,latex]));
  assert.equal(steps[0],named[top]);assert.equal(steps[1],named[bottom]);assert.equal(steps[2],named[top]);
  assert.deepEqual(vector(steps[3]),vector(named[bottom]).map(n=>n===0?0:-n));assert.deepEqual(vector(steps[4]),expected);
  assert.match(q.explanation,/reciprocal/);assert.match(q.explanation,/nonzero/);
  // All 625 assignments cover every sign pattern, units +/-1, and equal/opposite values.
  // Numerical coincidences between distractors are allowed: the question asks for an identity.
  for(const w of [-3,-1,1,2,5])for(const x of [-3,-1,1,2,5])for(const y of [-3,-1,1,2,5])for(const z of [-3,-1,1,2,5]){
   const assignment=values([w,x,y,z]);
   const answer=evaluateFraction(named[top],assignment)/evaluateFraction(named[bottom],assignment);
   assert.ok(Math.abs(evaluateFraction(correct[0].math,assignment)-answer)<1e-10);
   assert.ok(Number.isFinite(answer));
  }
  // Noninteger and near-zero nonzero values are valid; zero itself is explicitly excluded.
  for(const assignment of [[0.001,-0.25,2.5,1],[-1000,0.5,-0.001,2]]){
   const answer=evaluateFraction(named[top],assignment)/evaluateFraction(named[bottom],assignment);
   assert.ok(Math.abs(evaluateVector(expected,assignment)-answer)<=Math.max(1,Math.abs(answer))*1e-12);
  }
 }
 assert.equal(stems.size,48);assert.equal(letters.size,4);assert.equal(directions.size,2);
});

test('source example, all seed offsets, repeat cycle, determinism, and safe indices',()=>{
 const bank=require('../server/data/exam-content.json');
 const source=Object.values(bank).flatMap(a=>a.mathSection?.questions??[]).find(q=>q.id===template.sourceId);
 const original=generate(0,'').question;assert.equal(original.prompt,source.prompt);assert.deepEqual(original.choices,source.choices);assert.equal(original.correctChoiceId,source.correctChoiceId);
 const base=new Set(Array.from({length:48},(_,i)=>generate(i,'').question.prompt));
 // Single-character seeds 0..47 exercise every hash offset modulo 48.
 for(let code=0;code<48;code++){
  const seed=String.fromCharCode(code),seen=new Set();
  for(let i=0;i<48;i++){const a=generate(i,seed),b=generate(i+48,seed);assert.deepEqual(a,generate(i,seed));assert.deepEqual({...a.question,id:''},{...b.question,id:''});assert.notEqual(a.question.id,b.question.id);seen.add(a.question.prompt);}
  assert.deepEqual(seen,base);
 }
 assert.notEqual(generate(0,'one').question.prompt,generate(0,'two').question.prompt);
 assert.deepEqual({...generate(Number.MAX_SAFE_INTEGER,'edge').question,id:''},{...generate(Number.MAX_SAFE_INTEGER%48,'edge').question,id:''});
 for(const index of [-1,0.5,NaN,Infinity,-Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>generate(index),/nonnegative safe integer/);
});

test('exact existing module registration preserves all resources and stays disabled and unreviewed',()=>{
 const original=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy);
 original.generators=original.generators.filter(g=>g.id!==template.id);
 const target=original.modules.find(m=>m.id===template.moduleId);
 target.title='My algebra collection';target.titleMode='custom';target.published=false;
 const before=structuredClone(original),next=addBuiltinPractice(original,template);
 assert.deepEqual(original,before);assert.deepEqual(next.modules,before.modules);assert.deepEqual(next.videos,before.videos);
 assert.deepEqual(next.generators.slice(0,-1),before.generators);
 const generator=next.generators.at(-1);assert.equal(generator.enabled,false);assert.equal(generator.reviewStatus,'unreviewed');assert.equal(generator.skilled,'TBD');assert.deepEqual(generator.sourceQuestionIds,[template.sourceId]);
 assert.deepEqual(addBuiltinPractice(next,template),next);
 assert.ok(!managedGeneratorIds(target,next).includes(template.id));assert.ok(!studentPracticeCatalog(next).generators.some(g=>g.id===template.id));
 const approved=structuredClone(next);Object.assign(approved.generators.at(-1),{enabled:true,reviewStatus:'approved',title:'Teacher title'});assert.deepEqual(addBuiltinPractice(approved,template),approved);
 assert.throws(()=>addBuiltinPractice(original,{...template,moduleId:'stale-id'}),/exact existing module/);
 const misplaced=structuredClone(original);misplaced.modules.find(m=>m.id===template.moduleId).topic='Inequalities';assert.throws(()=>addBuiltinPractice(misplaced,template),/current category and topic/);
});

test('draft previews and saved sessions retain definitions and the existing grading contract',()=>{
 const catalog=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy),definition=catalog.generators.find(g=>g.id===template.id);
 assert.equal(definition.enabled,false);assert.equal(definition.reviewStatus,'unreviewed');
 const legacy=createPracticeState('all','existing');assert.ok(!legacy.generatorIds.includes(template.id));assert.deepEqual(parsePracticeState(JSON.stringify(legacy)),legacy);
 const before=structuredClone(catalog),preview=generatorPreviewCatalog(definition);assert.deepEqual(catalog,before);
 let state=createPracticeState('generator-preview','saved',preview);
 const q=generateCatalogQuestion(state.generatorDefinitions[0],state.index,state.seed);
 assert.deepEqual(q,generate(0,'saved').question);
 state=checkPracticeAnswer({...state,answer:q.correctChoiceId},isExamQuestionCorrect(q,q.correctChoiceId));
 assert.equal(state.correct,1);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
 preview.generators=[];catalog.generators=[];
 const restored=parsePracticeState(JSON.stringify(state));assert.deepEqual(generateCatalogQuestion(restored.generatorDefinitions[0],restored.index,restored.seed),q);
 const next=nextPracticeQuestion(restored);const q2=generateCatalogQuestion(next.generatorDefinitions[0],next.index,next.seed);
 const wrong=q2.choices.find(c=>c.id!==q2.correctChoiceId).id;
 assert.equal(checkPracticeAnswer({...next,answer:wrong},isExamQuestionCorrect(q2,wrong)).streak,0);
 assert.deepEqual(parsePracticeState(JSON.stringify(legacy)),legacy);
});
