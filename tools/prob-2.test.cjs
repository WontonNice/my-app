const {test}=require('node:test'),assert=require('node:assert/strict');
const {addBuiltinPractice,enableBuiltinPractices,publishBuiltinDestinations}=require('./register-practice-generator.cjs');
const {prob2Practice:templates}=require('../server/src/shared/prob2Practice.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {defaultPracticeCatalog,managedGeneratorIds,studentPracticeCatalog,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {practiceQuestion}=require('../client/src/features/math-command/practicePreview.ts');
const frac=s=>{const m=s.match(/^\\frac\{(\d+)\}\{(\d+)\}$/);return m?[+m[1],+m[2]]:[+s,1];};
const equal=(a,b)=>a[0]*b[1]===b[0]*a[1];
const polynomial=s=>{const m=s.match(/^([\d.]+)x([+-][\d.]+)?$/);assert.ok(m,s);return [+m[1],+(m[2]||0)];};
function check(q,correct){assert.equal(q.choices.filter(correct).length,1,q.prompt);assert.ok(correct(q.choices.find(c=>c.id===q.correctChoiceId)),q.prompt);for(const c of q.choices)assert.equal(isExamQuestionCorrect(q,c.id),correct(c));}
const sources=new Set();
for(const [family,t] of templates.entries())test(`${t.title}: exhaust domain, derive keys from displayed inputs, check source and distractors`,()=>{
  const items=new Set(),stems=new Set(),letters=new Set();let signPlus=false,signMinus=false,zeroConstant=false;
  for(let i=0;i<t.distinctCount;i++){
    const q=t.generate(i,'exhaust').question,values=q.choices.map(c=>c.math??c.text);
    const key=q.prompt+'|'+values.slice().sort().join('|');assert.ok(!items.has(key),key);items.add(key);stems.add(q.prompt);
    assert.equal(new Set(values).size,4);assert.equal(q.topic,t.category);assert.equal(q.subtopic,t.topic);assert.equal(q.type,'multiple_choice');
    assert.ok(q.explanation.length>100);assert.ok(!/NaN|undefined|Infinity/.test(q.prompt+q.explanation));letters.add(q.correctChoiceId);
    if(family<2){
      let expected;
      if(family===0){const m=q.prompt.match(/contains (\d+) green candies, (\d+) yellow candies[\s\S]*is (twice|\d+ times) as great/);const g=+m[1],y=+m[2],ratio=m[3]==='twice'?2:parseInt(m[3]);let r=0;while(r*ratio<g)r++;assert.equal(r*ratio,g);expected=[y,g+y+r];if(g===12&&y===4&&ratio===2){sources.add(family);assert.ok(equal(expected,[2,11]));}}
      else{const m=q.prompt.match(/Q contains (\d+) balls, and Jar R contains (\d+) balls[\s\S]*?\\frac\{(\d+)\}\{(\d+)\}[\s\S]*?\\frac\{(\d+)\}\{(\d+)\}/);assert.ok(m);const [nq,nr,a,b,c,d]=m.slice(1).map(Number);const yellowQ=nq/b*a,yellowR=nr/d*c;assert.ok(Number.isInteger(yellowQ)&&Number.isInteger(yellowR));expected=[yellowQ+yellowR,nq+nr];assert.notEqual(nq,nr);if(nq===12&&nr===8&&a===1&&b===3&&c===3&&d===4){sources.add(family);assert.ok(equal(expected,[1,2]));}}
      const f=values.map(frac);for(let a=0;a<4;a++){assert.ok(f[a][0]>=0&&f[a][0]<=f[a][1]);for(let b=a+1;b<4;b++)assert.ok(!equal(f[a],f[b]));}check(q,c=>equal(frac(c.math),expected));
      assert.ok(q.explanation.includes(`=${q.choices.find(c=>c.id===q.correctChoiceId).math}`));
    }else if(family===2){
      const m=q.prompt.match(/(\d+)x-\((\d+)([+-][\d.]+)x\)([+-]\d+)/);assert.ok(m);const [a,b,c,d]=m.slice(1).map(Number);
      // Evaluate the original and each proposed expression at several x values.
      check(q,choice=>{const [e,f]=polynomial(choice.math);return [-3,0,1,4].every(x=>a*x-(b+c*x)+d===e*x+f);});
      assert.match(q.explanation,/every term inside/);const [e,f]=polynomial(q.choices.find(c=>c.id===q.correctChoiceId).math);assert.ok(q.explanation.includes(`=${q.choices.find(c=>c.id===q.correctChoiceId).math}`));signPlus ||= c>0;signMinus ||= c<0;zeroConstant ||= f===0;
      if(a===8&&b===7&&c===2.5&&d===2){sources.add(family);assert.deepEqual([e,f],[5.5,-5]);}
    }else if(family===3){
      const [net,tax]=q.prompt.match(/\$[\d.]+/g).map(s=>Math.round(Number(s.slice(1))*100)),hours=+q.prompt.match(/working (\d+) hours/)[1];
      check(q,c=>Math.round(Number(c.text.slice(1))*100)*hours===net+tax);assert.ok(net>0&&tax>0);assert.ok(q.explanation.includes(q.choices.find(c=>c.id===q.correctChoiceId).text+' per hour'));
      if(net===21300&&tax===3200&&hours===20){sources.add(family);assert.equal(q.choices.find(c=>c.id===q.correctChoiceId).text,'$12.25');}
    }else if(family===4){
      const total=+q.prompt.match(/factors of (\d+)/)[1];const divisors=new Set();for(let d=1;d<=total;d++)if(total%d===0)divisors.add(d);const valid=[...divisors].filter(n=>divisors.has(n-1)&&divisors.has(n+1));const greatest=Math.max(...valid);check(q,c=>Number(c.text)===greatest);assert.ok(q.explanation.includes(`greatest is ${greatest}`));if(total===168){sources.add(family);assert.equal(greatest,7);}
    }else{
      const total=+q.prompt.match(/of \\\((\d+)\\\)/)[1];let smallest=2;while(total%smallest)smallest++;check(q,c=>Number(c.text)%smallest===0);assert.ok(q.explanation.includes(`smallest factor greater than 1 is ${smallest}`));
      if(total===91&&values.includes('35')&&values.includes('30')&&values.includes('39')&&values.includes('44'))sources.add(family);
    }
  }
  assert.ok(sources.has(family));assert.equal(items.size,t.distinctCount);assert.equal(letters.size,4);
  if(family===5)assert.equal(stems.size,22);else assert.equal(stems.size,t.distinctCount);
  if(family===2){assert.ok(signPlus&&signMinus&&zeroConstant);}
});

test('seeds, cycles and invalid indices are deterministic and safe',()=>{
  for(const t of templates){assert.deepEqual(t.generate(3,'saved'),t.generate(3,'saved'));assert.notDeepEqual(t.generate(0,'a').question,t.generate(0,'b').question);const a=t.generate(0,'cycle').question,b=t.generate(t.distinctCount,'cycle').question;assert.equal(a.prompt,b.prompt);assert.deepEqual(a.choices,b.choices);assert.notEqual(a.id,b.id);for(const n of [-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>t.generate(n));assert.ok(t.generate(Number.MAX_SAFE_INTEGER,'max').question);}
});

function fixture(){
  const catalog=defaultPracticeCatalog(require('./math-topics.json'));const ids=new Set(templates.map(t=>t.id));catalog.generators=catalog.generators.filter(g=>!ids.has(g.id));
  for(const t of templates)if(t.destination.parentId&&!catalog.modules.some(m=>m.id===t.destination.parentId)){const parent=catalog.modules.find(m=>m.category===t.category&&m.topic===t.topic&&m.defaultType===t.destination.groupType);assert.ok(parent);const oldId=parent.id;parent.id=t.destination.parentId;for(const child of catalog.modules)if(child.parentId===oldId)child.parentId=parent.id;}
  const t=templates[0];catalog.modules.push({id:t.moduleId,title:'Teacher title',description:'Keep description',category:t.category,topic:t.topic,parentId:t.destination.parentId,published:false,includeAll:false,generatorIds:[]});
  return catalog;
}
test('mixed batch preserves catalog, shares factors module, publishes exact groups, starts student sessions, and is idempotent',()=>{
  const before=fixture(),snapshot=structuredClone(before);const registered=templates.reduce((c,t)=>addBuiltinPractice(c,t),before),enabled=enableBuiltinPractices(registered,templates),after=publishBuiltinDestinations(enabled,templates),student=studentPracticeCatalog(after);
  assert.deepEqual(before,snapshot);assert.deepEqual(after.videos,before.videos);assert.deepEqual(after.generators.slice(0,before.generators.length),before.generators);
  const touched=new Set(templates.flatMap(t=>[t.moduleId,t.destination.parentId]));for(const old of before.modules){const next=after.modules.find(m=>m.id===old.id);if(!touched.has(old.id))assert.deepEqual(next,old);else{assert.equal(next.title,old.title);assert.equal(next.includeAll,old.includeAll);assert.equal(next.description,old.description);assert.ok(old.generatorIds.every(id=>next.generatorIds.includes(id)));}}
  assert.equal(after.modules.filter(m=>m.id===templates[4].moduleId).length,1);
  for(const t of templates){const m=student.modules.find(m=>m.id===t.moduleId);assert.ok(m);assert.ok(managedGeneratorIds(m,student).includes(t.id));const definition=student.generators.find(g=>g.id===t.id);assert.equal(definition.reviewStatus,'unreviewed');const q=generateCatalogQuestion(definition,0,'start',3);assert.ok(isExamQuestionCorrect(q,q.correctChoiceId));const state=createPracticeState(m.id,'snapshot',student),restored=parsePracticeState(JSON.stringify(state));assert.deepEqual(restored,state);assert.deepEqual(practiceQuestion(restored),practiceQuestion(state));if(m.parentId)assert.ok(managedGeneratorIds(student.modules.find(p=>p.id===m.parentId),student).includes(t.id));}
  assert.deepEqual(publishBuiltinDestinations(enableBuiltinPractices(templates.reduce((c,t)=>addBuiltinPractice(c,t),after),templates),templates),after);
  assert.deepEqual(publishBuiltinDestinations(enabled,templates.map(t=>({...t,publishAfterValidation:false}))),enabled);
  const old=createPracticeState('inequalities','existing',before);assert.deepEqual(practiceQuestion(parsePracticeState(JSON.stringify(old))),practiceQuestion(old));
});
test('stale topic-group destinations and unpublished generators cannot be published',()=>{
  const c=fixture(),t=templates[2],snapshot=structuredClone(c);
  assert.throws(()=>addBuiltinPractice(c,{...t,destination:{...t.destination,moduleId:'missing',create:true}}),/Missing exact/);
  assert.throws(()=>addBuiltinPractice(c,{...t,destination:{...t.destination,groupType:'foundation'}}),/Stale exact/);
  assert.throws(()=>publishBuiltinDestinations(c,templates),/unavailable/);assert.deepEqual(c,snapshot);
});
