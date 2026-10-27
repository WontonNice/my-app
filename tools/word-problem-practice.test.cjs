const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {wordProblemPractice,generateSurveyTotals,generateRemainingReading,generateMixtureRatios}=require('../server/src/shared/practiceWordProblems.ts');
const fs=require('node:fs');
const sourceBank=JSON.parse(fs.readFileSync(require('node:path').resolve(__dirname,'../server/data/exam-content.json'),'utf8'));
function source(id){for(const assessment of Object.values(sourceBank)){const question=assessment.mathSection?.questions.find(q=>q.id===id);if(question)return question;}throw Error('Missing source '+id);}
function choiceMinutes(text){const match=text.match(/^(?:(\d+) )?(\d+)\/(\d+) hr$|^(\d+) hr$/);assert.ok(match,text);return match[4]?Number(match[4])*60:((Number(match[1]||0)+Number(match[2])/Number(match[3]))*60);}
function verifyCycle(template,verify){
 const visited=new Uint8Array(template.distinctCount),originalPrompt=source(template.sourceId).prompt;let original;
 for(let index=0;index<template.distinctCount;index++){
  const item=template.generate(index,'complete-bank');assert.equal(visited[item.variant],0);visited[item.variant]=1;
  const q=item.question;assert.equal(q.topic,template.category);assert.equal(q.subtopic,template.topic);
  verify(item);
  if(q.prompt===originalPrompt)original=q;
 }
 assert.ok(original,'Includes the source stem: '+template.sourceId);return original;
}
test('all survey total stems subtract overlap once and include neither, including zero-size cells',()=>{
 const original=verifyCycle(wordProblemPractice[0],item=>{
  const [a,b,both,neither]=item.question.prompt.match(/\d+/g).map(Number);
  assert.ok(a>=both&&b>=both&&both>=0&&neither>=0);
  const total=a+b-both+neither;assert.equal(item.question.correctTextAnswers[0],String(total));
  assert.ok(total>=a&&total>=b);assert.equal(item.total,total);
 });assert.deepEqual(original.correctTextAnswers,['45']);assert.match(original.explanation,/20\+23-3\+5=45/);
});
test('every remaining-reading stem asks for additional time and has one exact hours answer',()=>{
 const letters=new Set();
 const original=verifyCycle(wordProblemPractice[1],item=>{
  const q=item.question,[total,elapsed,completed]=q.prompt.match(/\d+/g).map(Number);
  assert.ok(total>completed&&completed>0&&elapsed>0);
  const answer=(total-completed)*elapsed/completed;
  assert.ok(Number.isInteger(answer));assert.equal(item.additionalMinutes,answer);
  const values=q.choices.map(c=>Math.round(choiceMinutes(c.text)*1000000)/1000000);
  assert.equal(new Set(values).size,4);assert.equal(values.filter(v=>v===answer).length,1);
  assert.equal(values[q.choices.findIndex(c=>c.id===q.correctChoiceId)],answer);letters.add(q.correctChoiceId);
 });assert.equal(choiceMinutes(original.choices.find(c=>c.id===original.correctChoiceId).text),195);assert.equal(letters.size,4);
});
test('every mixture stem uses all ratio parts and all projects with one correct choice',()=>{
 const letters=new Set();
 const original=verifyCycle(wordProblemPractice[2],item=>{
  const q=item.question,numbers=q.prompt.match(/\d+/g).map(Number),parts=numbers.slice(0,4),perProject=numbers[4],projects=numbers[5];
  assert.ok(parts.every(part=>part>0)&&projects>=2);
  const answer=perProject*projects*parts[2]/parts.reduce((a,b)=>a+b,0);
  assert.ok(Number.isInteger(answer));assert.equal(item.answer,answer);
  const values=q.choices.map(c=>Number(c.text));assert.equal(new Set(values).size,4);
  assert.equal(values.filter(v=>v===answer).length,1);assert.equal(values[q.choices.findIndex(c=>c.id===q.correctChoiceId)],answer);letters.add(q.correctChoiceId);
 });assert.equal(original.choices.find(c=>c.id===original.correctChoiceId).text,'24');assert.equal(letters.size,4);
});
test('new word-problem sequences reproduce, cycle explicitly, and reject invalid indices',()=>{
 for(const template of wordProblemPractice){
  assert.deepEqual(template.generate(12,'same'),template.generate(12,'same'));
  const first=template.generate(0,'same').question,next=template.generate(template.distinctCount,'same').question;
  assert.equal(first.prompt,next.prompt);assert.notEqual(first.id,next.id);
  assert.notEqual(first.prompt,template.generate(0,'different').question.prompt);
  assert.doesNotThrow(()=>template.generate(Number.MAX_SAFE_INTEGER));
  for(const index of [-1,.5,Infinity,NaN,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>template.generate(index));
 }
});
test('batch registration preserves teacher resources and snapshots all three generators in their own topics',()=>{
 const {defaultPracticeCatalog,validatePracticeCatalog,managedGeneratorIds,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
 const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
 const {addBuiltinPractice}=require('./register-practice-generator.cjs'),taxonomy=require('./math-topics.json');
 const original=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy);original.modules=original.modules.filter(m=>!wordProblemPractice.some(t=>(t.moduleId??t.sourceId)===m.id));original.generators=original.generators.filter(g=>!wordProblemPractice.some(t=>t.id===g.id));
 original.modules[0].title='Curated foundation';const before=structuredClone(original);
 const catalog=validatePracticeCatalog(wordProblemPractice.reduce(addBuiltinPractice,original),taxonomy);
 assert.deepEqual(original,before);assert.deepEqual(wordProblemPractice.reduce(addBuiltinPractice,catalog),catalog);
 assert.deepEqual(catalog.modules.slice(0,before.modules.length),before.modules);
 for(const template of wordProblemPractice){
  const module=catalog.modules.find(m=>m.id===(template.moduleId??template.sourceId)),general=catalog.modules.find(m=>m.defaultType==='general'&&m.category===template.category&&m.topic===template.topic);
  assert.equal(module.title,template.moduleId?'Overlapping Groups':template.title);assert.ok(managedGeneratorIds(general,catalog).includes(template.id));
  assert.ok(!managedGeneratorIds(catalog.modules.find(m=>m.id==='all'),catalog).includes(template.id));
  const state=createPracticeState(module.id,'batch',catalog);assert.ok(state.generatorIds.includes(template.id));assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
  assert.deepEqual(generateCatalogQuestion(state.generatorDefinitions.find(g=>g.id===template.id),4,state.seed),template.generate(4,state.seed).question);
 }
 assert.equal(generateSurveyTotals(0).question.type,'short_response');assert.equal(generateRemainingReading(0).question.type,'multiple_choice');assert.equal(generateMixtureRatios(0).question.type,'multiple_choice');
});
