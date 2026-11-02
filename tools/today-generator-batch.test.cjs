const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {templates}=require('./register-today-generator-batch.cjs');
const {generateRepeatingDecimalDigit:decimal}=require('../server/src/shared/repeatingDecimalDigits.ts');
const {generateRectangleAreaPercent:area}=require('../server/src/shared/rectangleAreaPercent.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {defaultPracticeCatalog,validatePracticeCatalog,managedGeneratorIds,generateCatalogQuestion,studentPracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
const {addBuiltinPractice,enableBuiltinPractices}=require('./register-practice-generator.cjs');
const {generatorPreviewCatalog}=require('../client/src/features/math-command/generatorPreview.ts');
const {createPracticeState,parsePracticeState,checkPracticeAnswer,nextPracticeQuestion}=require('../client/src/features/math-command/inequalitySession.ts');
const katex=require('katex');
const taxonomy=require('./math-topics.json');
const functions=[decimal,area];
const gcd=(a,b)=>b?gcd(b,a%b):a;
const source=id=>Object.values(require('../server/data/exam-content.json')).flatMap(a=>a.mathSection?.questions??[]).find(q=>q.id===id);
function grading(q,answer){
  assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(c=>c.text)).size,4);
  assert.deepEqual(q.choices.map(c=>c.id),['A','B','C','D']);
  const correct=q.choices.filter(c=>c.text===String(answer));assert.equal(correct.length,1,q.prompt);assert.equal(q.correctChoiceId,correct[0].id);
  for(const choice of q.choices)assert.equal(isExamQuestionCorrect(q,choice.id),choice===correct[0]);
  assert.equal(isExamQuestionCorrect(q,''),false);assert.equal(isExamQuestionCorrect(q,'E'),false);assert.equal(isExamQuestionCorrect(q,[correct[0].id]),false);
}
const ordinal=n=>n%100>=11&&n%100<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th';
function parseDecimal(q){
  const match=q.prompt.match(/\\frac\{(\d+)\}\{(\d+)\}=0\.\\overline\{(\d+)\}/);assert.ok(match);
  const position=q.prompt.match(/What is the \\\((\d+)\\\)(st|nd|rd|th) digit/);assert.ok(position);
  return {n:+match[1],d:+match[2],block:match[3],position:+position[1],suffix:position[2]};
}

test('all decimal stems: independent long division, primitive blocks, exact cycles, distinct choices and grading',()=>{
  const template=templates[0],seen=new Set(),fractions=new Map(),lengths=new Set(),letters=new Set();let endpoints=0,zeroEndpoints=0,leadingZero=0,previous;
  for(let i=0;i<template.distinctCount;i++){
    const q=decimal(i,'').question,{n,d,block,position,suffix}=parseDecimal(q);
    assert.ok(n>0&&n<d);assert.equal(gcd(n,d),1);assert.ok(position>=100&&position<=999);assert.equal(suffix,ordinal(position));
    const key=`${n}/${d}`;
    if(previous){assert.notEqual(key,previous.key,'adjacent questions change fraction');assert.notEqual(position,previous.position,'adjacent questions change digit position');}
    previous={key,position};
    if(!fractions.has(key)){
      // Independent decimal expansion, with visited remainders to find the true period.
      let remainder=n,digits='';const remainders=new Map();
      while(!remainders.has(remainder)){remainders.set(remainder,digits.length);remainder*=10;digits+=Math.floor(remainder/d);remainder%=d;assert.notEqual(remainder,0);}
      assert.equal(remainders.get(remainder),0,'no non-repeating prefix');assert.equal(digits,block);
      assert.equal(BigInt(n)*(10n**BigInt(block.length)-1n),BigInt(d)*BigInt(block));
      fractions.set(key,{digits:digits.repeat(Math.ceil(999/digits.length)),positions:new Set()});
    }
    const expansion=fractions.get(key);expansion.positions.add(position);
    const expected=expansion.digits[position-1];grading(q,expected);
    assert.ok(!seen.has(q.prompt));seen.add(q.prompt);lengths.add(block.length);letters.add(q.correctChoiceId);
    assert.equal(q.topic,template.category);assert.equal(q.subtopic,template.topic);assert.equal(q.skilled,'TBD');assert.equal(q.type,'multiple_choice');assert.equal(q.points,1);assert.equal(q.image,undefined);
    assert.ok(q.choices.every(c=>/^\d$/.test(c.text)&&c.math===c.text));
    const division=q.explanation.match(/\\\[(\d+)=(\d+)\\times (\d+)\+(\d+)\./);assert.ok(division);
    const [,target,period,whole,remainder]=division.map(Number);assert.equal(target,position);assert.equal(period,block.length);assert.equal(period*whole+remainder,position);assert.ok(remainder>=0&&remainder<period);
    assert.ok(q.explanation.endsWith(`the ${position}${suffix} digit is ${expected}.`));
    if(remainder===0){endpoints++;assert.match(q.explanation,/last position/);if(expected==='0')zeroEndpoints++;}
    if(block[0]==='0'){leadingZero++;assert.match(q.explanation,/initial zero counts/);}
    if(i%997===0)for(const match of q.prompt.matchAll(/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g))assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{throwOnError:true}));
  }
  assert.equal(seen.size,template.distinctCount);assert.equal(fractions.size,template.fractionCount);
  for(const fraction of fractions.values())assert.equal(fraction.positions.size,900);
  assert.deepEqual([...lengths].sort(),[3,4,6]);assert.equal(letters.size,4);assert.ok(endpoints>0&&zeroEndpoints>0&&leadingZero>0);
});

test('short practice sessions mix fractions and denominators, including across the cycle boundary',()=>{
  for(const seed of ['','one','saved-session',...Array.from({length:32},(_,i)=>`practice-${i}`)]){
    for(const start of [0,templates[0].distinctCount-76]){
      const rows=Array.from({length:152},(_,i)=>parseDecimal(decimal(start+i,seed).question));
      assert.equal(new Set(rows.map(q=>`${q.n}/${q.d}`)).size,152);
      assert.deepEqual([...new Set(rows.map(q=>q.d))].sort((a,b)=>a-b),[7,13,27,37,101]);
      for(let i=1;i<rows.length;i++)assert.notEqual(rows[i].position,rows[i-1].position);
    }
  }
});

test('legacy questions keep their exact content and grading; advancing adopts the mixed sequence',()=>{
  const digests={'':'89d4d21846b7b29dd6f5a6a2fe37c595c03eb6b7f3657f7ebfd9a8843f9ee249','saved-session':'80303215ac5d266b08b02cf97aa937809df903a2f9f09e5953388ca2cb88d169','one':'078eb3b3f9cd61013f83287aaa5d000b65879292075dd4e8bfe0b7bdf6814343'};
  for(const [seed,digest]of Object.entries(digests))assert.equal(createHash('sha256').update(JSON.stringify([0,1,8,9,17,100,136799,Number.MAX_SAFE_INTEGER].map(i=>decimal(i,seed,1).question))).digest('hex'),digest);
  const catalog=defaultPracticeCatalog(taxonomy),preview=generatorPreviewCatalog(catalog.generators.find(g=>g.id===templates[0].id));
  const old=createPracticeState('generator-preview','saved-session',preview);delete old.generationVersion;
  const definition=old.generatorDefinitions[0],original=decimal(0,old.seed,1).question;
  old.answer=original.correctChoiceId;
  const restored=parsePracticeState(JSON.stringify(old));assert.deepEqual(restored,old);
  assert.deepEqual(generateCatalogQuestion(definition,0,old.seed),original);
  const checked=checkPracticeAnswer(restored,isExamQuestionCorrect(original,restored.answer));assert.equal(checked.correct,1);assert.equal(checked.generationVersion,undefined);
  const next=nextPracticeQuestion(checked);assert.equal(next.generationVersion,2);assert.equal(next.answer,'');assert.equal(next.correct,1);
  const mixed=generateCatalogQuestion(definition,next.index,next.seed,next.generationVersion);assert.deepEqual(mixed,decimal(next.index,next.seed).question);
  const resumed=parsePracticeState(JSON.stringify(next));assert.deepEqual(generateCatalogQuestion(definition,resumed.index,resumed.seed,resumed.generationVersion),mixed);
  for(const generationVersion of [0,3,'2',null])assert.equal(parsePracticeState(JSON.stringify({...next,generationVersion})),null);
});

test('all area stems: derive the change from displayed dimensions, validate explanations, units and distractors',()=>{
  const template=templates[1],seen=new Set(),letters=new Set();let fractional=0,coincidentTraps=0;
  for(let i=0;i<template.distinctCount;i++){
    const q=area(i,'').question,[length,width,p,delta]=q.prompt.match(/\d+/g).map(Number);
    assert.ok(length>width&&width>0&&p>0&&delta>0);
    const newLength=length*(100+p)/100,newWidth=width+delta,oldArea=length*width,newArea=newLength*newWidth,increase=newArea-oldArea;
    assert.ok(Number.isInteger(newLength)&&Number.isInteger(newWidth));assert.ok(newArea>oldArea);
    const expected=increase*100/oldArea;assert.ok(Math.abs(expected*10-Math.round(expected*10))<1e-8);
    grading(q,`${Math.round(expected*10)/10}%`);if(!Number.isInteger(expected))fractional++;
    assert.ok(q.choices.every(c=>/^\d+(\.\d)?%$/.test(c.text)));
    // Every distractor matches a plausible error, derived independently from the prompt.
    const mistakes=[((100+p)*(100+delta)-10000)/100,p+delta*100/width,((length+p)*newWidth-oldArea)*100/oldArea,delta*100/width,p,p+delta*100/width+2*p*delta/width];
    for(const choice of q.choices.filter(c=>c.id!==q.correctChoiceId))assert.ok(mistakes.some(v=>Math.abs(v-parseFloat(choice.text))<1e-8),choice.text);
    if(length===100||width===100)coincidentTraps++;
    assert.equal(q.topic,template.category);assert.equal(q.subtopic,template.topic);assert.equal(q.type,'multiple_choice');assert.equal(q.points,1);assert.equal(q.skilled,'TBD');assert.equal(q.image,undefined);
    assert.ok(!seen.has(q.prompt));seen.add(q.prompt);letters.add(q.correctChoiceId);
    assert.match(q.explanation,new RegExp(`${length}\\\\times ${width}=${oldArea}`));
    assert.ok(q.explanation.includes(`${newLength}\\times ${newWidth}=${newArea}`));assert.ok(q.explanation.includes(`${newArea}-${oldArea}=${increase}`));
    assert.ok(q.explanation.includes(`\\frac{${increase}}{${oldArea}}\\times100\\%=${Math.round(expected*10)/10}\\%`));assert.match(q.explanation,/ORIGINAL area/);assert.match(q.explanation,/square meters/);
    if(i%17===0)for(const match of q.explanation.matchAll(/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g))assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{throwOnError:true}));
  }
  assert.equal(seen.size,template.distinctCount);assert.equal(letters.size,4);assert.ok(fractional>0&&coincidentTraps>0);
});

test('original keyed examples, deterministic seed permutations, repeat cycles and invalid indices',()=>{
  for(const [at,template]of templates.entries()){
    const generate=functions[at],q=generate(0,'').question,original=source(template.sourceId);
    assert.ok(original);assert.equal(q.prompt,original.prompt);assert.deepEqual(q.choices,original.choices);assert.equal(q.correctChoiceId,original.correctChoiceId);
    assert.equal(gcd(template.stride,template.distinctCount),1);
    for(const seed of ['','one','two','🧮 batch','0'.repeat(1000)])for(const i of [0,1,2,3,97,template.distinctCount-1,template.distinctCount,Number.MAX_SAFE_INTEGER]){
      const result=generate(i,seed);assert.deepEqual(result,generate(i,seed));
      const wrapped=generate(i%template.distinctCount,seed);assert.deepEqual({...result.question,id:''},{...wrapped.question,id:''});
      if(i<template.distinctCount){const next=generate(i+template.distinctCount,seed);assert.deepEqual({...result.question,id:''},{...next.question,id:''});assert.notEqual(result.question.id,next.question.id);}
    }
    assert.notEqual(generate(0,'one').question.prompt,generate(0,'two').question.prompt);
    for(const index of [-1,0.5,NaN,Infinity,-Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>generate(index),/nonnegative safe integer/);
  }
});

test('batch registration respects both exact groups, keeps every existing resource and is idempotent',()=>{
  const catalog=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy);
  catalog.generators=catalog.generators.filter(g=>!templates.some(t=>t.id===g.id));
  for(const template of templates){const module=catalog.modules.find(m=>m.id===template.moduleId);assert.ok(module);module.title=`Custom ${template.groupType}`;module.titleMode='custom';module.published=false;}
  const before=structuredClone(catalog),next=templates.reduce((current,t)=>addBuiltinPractice(current,t),catalog);
  assert.deepEqual(catalog,before);assert.deepEqual(next.modules,before.modules);assert.deepEqual(next.videos,before.videos);assert.deepEqual(next.generators.slice(0,-2),before.generators);
  for(const template of templates){const generator=next.generators.find(g=>g.id===template.id);assert.equal(generator.enabled,false);assert.equal(generator.reviewStatus,'unreviewed');assert.deepEqual(generator.sourceQuestionIds,[template.sourceId]);
    assert.ok(!managedGeneratorIds(next.modules.find(m=>m.id===template.moduleId),next).includes(template.id));assert.ok(!studentPracticeCatalog(next).generators.some(g=>g.id===template.id));
    assert.throws(()=>addBuiltinPractice(before,{...template,moduleId:'missing'}),/exact existing module/);
    assert.throws(()=>addBuiltinPractice(before,{...template,groupType:template.groupType==='general'?'foundation':'general'}),/requested practice group/);
  }
  assert.deepEqual(templates.reduce((current,t)=>addBuiltinPractice(current,t),next),next);
  const curated=structuredClone(before);curated.modules.find(m=>m.id===templates[0].moduleId).includeAll=false;assert.throws(()=>addBuiltinPractice(curated,templates[0]),/curated selection/);
  const moved=structuredClone(before);moved.modules.find(m=>m.id===templates[1].moduleId).topic='Rates & Unit Rates';assert.throws(()=>addBuiltinPractice(moved,templates[1]),/current category and topic/);
  const approved=structuredClone(next);Object.assign(approved.generators.at(-1),{enabled:true,reviewStatus:'approved',title:'Teacher edit'});assert.deepEqual(addBuiltinPractice(approved,templates[1]),approved);
});

test('explicit activation includes both generators while preserving review, modules, unrelated resources and saved sessions',()=>{
  const catalog=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy),before=structuredClone(catalog);
  const legacy=createPracticeState('all','before-activation',catalog),saved=JSON.stringify(legacy);
  const enabled=enableBuiltinPractices(catalog,templates);
  assert.deepEqual(catalog,before);
  assert.deepEqual(enabled.modules,before.modules);assert.deepEqual(enabled.videos,before.videos);
  assert.deepEqual(enabled.generators,before.generators.map(g=>templates.some(t=>t.id===g.id)?{...g,enabled:true}:g));
  for(const template of templates){
    const module=enabled.modules.find(m=>m.id===template.moduleId);
    assert.ok(managedGeneratorIds(module,enabled).includes(template.id));
    assert.ok(studentPracticeCatalog(enabled).generators.some(g=>g.id===template.id));
    assert.ok(createPracticeState(module.id,'after-activation',enabled).generatorIds.includes(template.id));
    assert.equal(enabled.generators.find(g=>g.id===template.id).reviewStatus,'unreviewed');
  }
  assert.deepEqual(enableBuiltinPractices(enabled,templates),enabled);
  assert.deepEqual(parsePracticeState(saved),legacy);
  assert.throws(()=>enableBuiltinPractices({...catalog,generators:catalog.generators.filter(g=>g.id!==templates[0].id)},templates),/missing generator/);
  const curated=structuredClone(catalog);curated.modules.find(m=>m.id===templates[0].moduleId).includeAll=false;
  assert.throws(()=>enableBuiltinPractices(curated,templates),/destination does not include/);
});

test('draft preview grading and saved sessions remain independent of later catalog edits',()=>{
  const catalog=validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy),legacy=createPracticeState('all','already-running');
  assert.ok(templates.every(t=>!legacy.generatorIds.includes(t.id)));assert.deepEqual(parsePracticeState(JSON.stringify(legacy)),legacy);
  for(const [at,template]of templates.entries()){
    const before=structuredClone(catalog),preview=generatorPreviewCatalog(catalog.generators.find(g=>g.id===template.id));assert.deepEqual(catalog,before);
    let state=createPracticeState('generator-preview','preview',preview);
    const q=generateCatalogQuestion(state.generatorDefinitions[0],state.index,state.seed,state.generationVersion);assert.deepEqual(q,functions[at](0,'preview').question);
    state=checkPracticeAnswer({...state,answer:q.correctChoiceId},isExamQuestionCorrect(q,q.correctChoiceId));assert.equal(state.correct,1);
    const stored=JSON.stringify(state);preview.generators=[];
    const restored=parsePracticeState(stored);assert.deepEqual(restored,state);assert.deepEqual(generateCatalogQuestion(restored.generatorDefinitions[0],restored.index,restored.seed,restored.generationVersion),q);
    const next=nextPracticeQuestion(restored),q2=generateCatalogQuestion(next.generatorDefinitions[0],next.index,next.seed,next.generationVersion),wrong=q2.choices.find(c=>c.id!==q2.correctChoiceId).id;
    assert.equal(checkPracticeAnswer({...next,answer:wrong},isExamQuestionCorrect(q2,wrong)).streak,0);
  }
  assert.deepEqual(parsePracticeState(JSON.stringify(legacy)),legacy);
});
