const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {probabilityPractice,probabilityModule}=require('../server/src/shared/probabilityPractice.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const parse=text=>{const match=text.match(/^\\frac\{(\d+)\}\{(\d+)\}$/);if(match)return [+match[1],+match[2]];if(/^\d+$/.test(text))return [+text,1];throw Error('Invalid displayed probability: '+text);};
const equal=(a,b)=>a[0]*b[1]===b[0]*a[1];
function verifyProbability(q,expected){
 const options=q.choices.map(c=>parse(c.math));
 assert.equal(options.filter(value=>equal(value,expected)).length,1,q.prompt);
 assert.ok(options.every(([n,d])=>d>0&&n>=0&&n<=d));
 for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert.ok(!equal(options[a],options[b]));
 const correct=q.choices.findIndex(c=>c.id===q.correctChoiceId);assert.ok(equal(options[correct],expected));
 assert.equal(isExamQuestionCorrect(q,q.correctChoiceId),true);
}
const sources=[
 {match:p=>p.firstStart===1&&p.secondStart===1&&p.target===6,answer:[5,1]},
 {match:p=>p.parts.join(':')==='2:5:3'&&p.total===30&&p.removed===1,answer:[8,27]},
 {match:p=>p.name==='Chris'&&p.red===1&&p.white===2&&p.black===3,answer:[1,10]},
 {match:p=>p.red===4&&p.blue===6,answer:[2,15]},
 {match:p=>p.name==='Sarah'&&p.red===4&&p.blue===11,answer:[16,225]},
 {match:p=>p.name==='Karl'&&p.sections===4&&p.product===4,answer:[3,16]},
 {match:p=>p.name==='Melissa'&&p.counts.join(',')==='3,3,2'&&p.letters.join('')==='RGW',answer:'RR, RG, RW, GG, GW, WW'},
 {match:p=>p.people===20&&p.viruses===200&&p.virus===144,answer:[1,4000]},
];
const verify=[
 q=>{
  const n=q.prompt.match(/\d+/g).map(Number),a=n[0],b=n.length===3?a:n[2],target=n.at(-1);let answer=0;
  for(let first=a;first<a+6;first++)for(let second=b;second<b+6;second++)if(first+second===target)answer++;
  assert.equal(+q.correctTextAnswers[0],answer);assert.equal(isExamQuestionCorrect(q,String(answer)),true);assert.equal(isExamQuestionCorrect(q,String(answer+1)),false);
 },
 q=>{
  const [total,r,w,b]=q.prompt.match(/\d+/g).map(Number),removed=q.prompt.includes('one paper clip')?1:+q.prompt.match(/(\d+) paper clips of each/)[1];
  const counts=[r,w,b].map(part=>part*total/(r+w+b));assert.ok(counts.every(c=>Number.isInteger(c)&&c>removed));
  verifyProbability(q,[counts[2]-removed,total-3*removed]);
 },
 q=>{
  const [red,white,black]=q.prompt.match(/\d+/g).map(Number),items=[...Array(red).fill('R'),...Array(white).fill('W'),...Array(black).fill('B')];let favorable=0;
  for(let first=0;first<items.length;first++)for(let second=0;second<items.length;second++)if(first!==second&&items[first]==='B'&&items[second]==='R')favorable++;
  verifyProbability(q,[favorable,items.length*(items.length-1)]);
 },
 q=>{const [total,red,blue]=q.prompt.match(/\d+/g).map(Number);assert.equal(total,red+blue);verifyProbability(q,[red*(red-1)/2,total*(total-1)/2]);},
 q=>{const [total,blue,red]=q.prompt.match(/\d+/g).map(Number);assert.equal(total,blue+red);assert.match(q.prompt,/returns it to the bag/);verifyProbability(q,[red**2,total**2]);},
 q=>{
  const [sections,,last,product]=q.prompt.match(/\d+/g).map(Number);assert.equal(sections,last);let favorable=0;
  for(let red=1;red<=sections;red++)for(let blue=1;blue<=sections;blue++)if(red*blue===product)favorable++;
  verifyProbability(q,[favorable,sections**2]);
 },
 q=>{
  const counts=q.prompt.match(/\d+/g).map(Number),letters=[...q.prompt.matchAll(/\(([A-Z])\)/g)].map(m=>m[1]);
  const bag=counts.flatMap((count,at)=>Array(count).fill(at)),expected=new Set();
  for(let a=0;a<bag.length;a++)for(let b=a+1;b<bag.length;b++)expected.add(letters[Math.min(bag[a],bag[b])]+letters[Math.max(bag[a],bag[b])]);
  const valid=q.choices.filter(choice=>{
   const list=choice.text.split(', ');if(!list.every(item=>item.length===2&&[...item].every(ch=>letters.includes(ch))))return false;
   const normalized=list.map(pair=>letters.indexOf(pair[0])<=letters.indexOf(pair[1])?pair:pair[1]+pair[0]);
   return new Set(normalized).size===list.length&&list.length===expected.size&&normalized.every(pair=>expected.has(pair));
  });
  assert.equal(valid.length,1,q.prompt);assert.equal(valid[0].id,q.correctChoiceId);assert.match(q.prompt,/unordered pair listed exactly once/);
 },
 q=>{const [people,viruses,virus]=q.prompt.match(/\d+/g).map(Number);assert.ok(virus>=1&&virus<=viruses);verifyProbability(q,[1,people*viruses]);},
];
for(const [at,template] of probabilityPractice.entries())test(template.title+': every stem is valid, unique, and includes its source example',()=>{
 const stems=new Set(),variants=new Uint8Array(template.distinctCount),letters=new Set();let original;
 for(let index=0;index<template.distinctCount;index++){
  const item=template.generate(index,'complete-bank'),q=item.question;
  assert.equal(variants[item.variant],0);variants[item.variant]=1;
  assert.equal(q.topic,probabilityModule.category);assert.equal(q.subtopic,probabilityModule.topic);
  assert.ok(!stems.has(q.prompt),'Repeated stem: '+template.sourceId);stems.add(q.prompt);
  verify[at](q);if(q.choices){assert.equal(q.choices.length,4);letters.add(q.correctChoiceId);}
  if(sources[at].match(item))original=q;
 }
 assert.equal(stems.size,template.distinctCount);assert.ok(original,'Original numerical example: '+template.sourceId);
 if(at===0)assert.equal(+original.correctTextAnswers[0],5);
 else if(at===6)assert.equal(original.choices.find(c=>c.id===original.correctChoiceId).text,sources[at].answer);
 else verifyProbability(original,sources[at].answer);
 if(original.choices)assert.equal(letters.size,4);
});

test('all eight probability sequences reproduce, complete explicit cycles and validate safe indices',()=>{
 for(const template of probabilityPractice){
  assert.deepEqual(template.generate(12,'same'),template.generate(12,'same'));
  const first=template.generate(0,'same').question,next=template.generate(template.distinctCount,'same').question;
  assert.equal(first.prompt,next.prompt);assert.notEqual(first.id,next.id);assert.notEqual(first.prompt,template.generate(0,'different').question.prompt);
  assert.doesNotThrow(()=>template.generate(Number.MAX_SAFE_INTEGER));
  for(const index of [-1,.5,Infinity,NaN,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>template.generate(index));
 }
});

test('Probability uses five focused Foundation Building children with eight generators, preserving other topics and snapshots',()=>{
 const {defaultPracticeCatalog,validatePracticeCatalog,managedGeneratorIds,practiceModuleKind,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
 const {addBuiltinPractice}=require('./register-practice-generator.cjs');
 const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
 const taxonomy=require('./math-topics.json'),fresh=defaultPracticeCatalog(taxonomy),ids=probabilityPractice.map(t=>t.id);
 let old={...fresh,modules:fresh.modules.filter(m=>m.topic!=='Probability'||practiceModuleKind(m)),generators:fresh.generators.filter(g=>!ids.includes(g.id))};
 old.modules[0].title='Keep curated foundation';old.videos.push({id:'keep-video',title:'Keep lesson',description:'',category:'Algebra',topic:'Inequalities',published:false,url:''});
 const before=structuredClone(old),next=validatePracticeCatalog(probabilityPractice.reduce(addBuiltinPractice,old),taxonomy);
 assert.deepEqual(old,before);assert.deepEqual(next.generators.slice(0,before.generators.length),before.generators);assert.deepEqual(next.videos,before.videos);
 assert.deepEqual(probabilityPractice.reduce(addBuiltinPractice,next),next);
 const module=next.modules.find(m=>m.id===probabilityModule.id),parent=next.modules.find(m=>m.id===module.parentId);
 assert.equal(module.title,'Listing Outcomes');assert.equal(practiceModuleKind(parent),'foundation');assert.equal(parent.topic,'Probability');
 assert.deepEqual(new Set(managedGeneratorIds(parent,next)),new Set(ids));
 assert.deepEqual(managedGeneratorIds(parent,next,{childModuleIds:[]}),[]);
 assert.equal(next.modules.filter(m=>!practiceModuleKind(m)&&m.topic==='Probability').length,5);
 assert.ok(!managedGeneratorIds(next.modules.find(m=>m.id==='foundation'),next).some(id=>ids.includes(id)));
 const state=createPracticeState(parent.id,'foundation',next);assert.deepEqual(state.generatorIds,ids);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
 for(const definition of state.generatorDefinitions){const q=generateCatalogQuestion(definition,0,state.seed);assert.equal(q.subtopic,'Probability');assert.equal(isExamQuestionCorrect(q,q.correctChoiceId??q.correctTextAnswers[0]),true);}
 assert.deepEqual(next.modules.filter(m=>m.topic!=='Probability'),before.modules.filter(m=>m.topic!=='Probability'));
});
