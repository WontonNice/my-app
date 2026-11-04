const {test}=require('node:test'),assert=require('node:assert/strict');
const {addBuiltinPractice,enableBuiltinPractices,publishBuiltinDestinations}=require('./register-practice-generator.cjs');
const {probabilityBatchPractice:templates}=require('../server/src/shared/probabilityBatchPractice.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {defaultPracticeCatalog,managedGeneratorIds,studentPracticeCatalog,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {practiceQuestion}=require('../client/src/features/math-command/practicePreview.ts');
const numberFraction=text=>{const m=text.match(/^\\frac\{(\d+)\}\{(\d+)\}$/);return m?[+m[1],+m[2]]:[+text,1];};
const eq=(a,b)=>a[0]*b[1]===b[0]*a[1];
function verifyChoices(q,expected,probability=true){
  assert.equal(q.choices.length,4);
  const values=q.choices.map(c=>numberFraction(c.math));
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)assert.ok(!eq(values[i],values[j]),q.prompt);
  if(probability)assert.ok(values.every(([n,d])=>n>=0&&d>0&&n<=d));
  assert.equal(values.filter(v=>eq(v,expected)).length,1,q.prompt);
  assert.ok(eq(values[q.choices.findIndex(c=>c.id===q.correctChoiceId)],expected),q.prompt);
  for(const choice of q.choices)assert.equal(isExamQuestionCorrect(q,choice.id),choice.id===q.correctChoiceId);
}
const sourceSeen=new Set();
for(const [family,t] of templates.entries())test(`${t.title}: exhaust finite domain, independently solve displayed inputs, retain source and validate grading`,()=>{
  const stems=new Set(),letters=new Set();let zero=false,one=false;
  for(let index=0;index<t.distinctCount;index++){
    const q=t.generate(index,'exhaust').question;
    assert.ok(!stems.has(q.prompt),q.prompt);stems.add(q.prompt);
    assert.equal(q.type,family===0?'expression_entry':'multiple_choice');assert.equal(q.topic,t.category);assert.equal(q.subtopic,t.topic);
    assert.ok(q.explanation.length>100);assert.ok(!/undefined|NaN|Infinity/.test(q.prompt+q.explanation));
    if(family===0){
      const [,win,cards,card]=q.prompt.match(/every (\d+) students[\s\S]*set of (\d+)[\s\S]*receives Card C(\d+)/).map(Number);
      assert.ok(card>=1&&card<=cards);assert.ok(win>=5&&win<=40);
      // Cartesian sample space: exactly one winning outcome and one specified card.
      const accepted=[`(1/${win})*(1/${cards})`,`\\frac{1}{${win}}\\times\\frac{1}{${cards}}`,`\\(\\left(\\frac{1}{${cards}}\\right)\\cdot\\left(\\frac{1}{${win}}\\right)\\)`];
      for(const answer of accepted)assert.equal(isExamQuestionCorrect(q,answer),true,answer);
      for(const wrong of [`1/${win*cards}`,String(1/(win*cards)),`1/(${win*cards})`,`1/(${win}*${cards})`,`\\frac{1}{${win*cards}}`,`1/${win}`,`1/${cards}`,`1/${win+cards}`,`1/${win}+1/${cards}`,'','1/'])assert.equal(isExamQuestionCorrect(q,wrong),false,wrong);
      assert.ok(q.explanation.includes(`1/${win}`)&&q.explanation.includes(`1/${cards}`));
      assert.equal(q.correctTextAnswers[0],`\\(\\frac{1}{${win}}\\cdot\\frac{1}{${cards}}\\)`);
      assert.match(q.instructions,/Do not multiply or simplify/);
      assert.equal(isExamQuestionCorrect(q,`(\\frac{1}{${win}}\\cdot\\frac{1}{${cards}})`),true);
      if(win===25&&cards===100&&card===17)sourceSeen.add(family);
    } else if(family===1){
      const [,s,b,o,excluded]=q.prompt.match(/contains (\d+) strawberry[\s\S]*, (\d+) banana[\s\S]*, and (\d+) orange[\s\S]*not (\w+)\?/);
      const bag=[...Array(+s).fill('strawberry'),...Array(+b).fill('banana'),...Array(+o).fill('orange')];let good=0,all=0;
      for(let a=0;a<bag.length;a++)for(let b=a+1;b<bag.length;b++){all++;if(bag[a]!==excluded&&bag[b]!==excluded)good++;}
      verifyChoices(q,[good,all]);assert.match(q.explanation,/do not have to be the same flavor/);
      if(+s===5&&+b===3&&+o===2&&excluded==='banana'){verifyChoices(q,[7,15]);sourceSeen.add(family);}
    } else if(family===2){
      const colors=+q.prompt.match(/There are (\d+) different/)[1],parts=+q.prompt.match(/these (\d+) parts/)[1];let count=0;
      function assign(chosen){if(chosen.length===parts){count++;return;}for(let c=0;c<colors;c++)if(!chosen.includes(c))assign([...chosen,c]);}assign([]);
      verifyChoices(q,[count,1],false);if(colors===3&&parts===3){assert.equal(count,6);sourceSeen.add(family);}
    } else if(family===3){
      const decimals=q.prompt.match(/0\.\d+/g),threshold=decimals.pop();const scaled=s=>BigInt(s.replace('.','').padEnd(8,'0'));let good=0;
      for(const value of decimals)if(scaled(value)<scaled(threshold))good++;
      verifyChoices(q,[good,decimals.length]);zero ||= good===0;one ||= good===decimals.length;
      if(decimals.join(',')==='0.1,0.01,0.001,0.0001,0.00001'&&threshold==='0.005'){assert.equal(good,3);sourceSeen.add(family);}
    } else {
      const n=+q.prompt.match(/There are (\d+)/)[1],pairs=new Set();for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(a!==b)pairs.add([a,b].sort((a,b)=>a-b).join(','));
      verifyChoices(q,[pairs.size,1],false);if(n===6){assert.equal(pairs.size,15);sourceSeen.add(family);}
    }
    if(q.correctChoiceId)letters.add(q.correctChoiceId);
  }
  assert.ok(sourceSeen.has(family));assert.equal(stems.size,t.distinctCount);if(family)assert.equal(letters.size,4);if(family===3){assert.ok(zero);assert.ok(one);}
});

test('seeds, safe indices and explicit repeat cycles preserve stable question identities',()=>{
  for(const t of templates){
    assert.deepEqual(t.generate(7,'replay'),t.generate(7,'replay'));
    const a=t.generate(0,'replay').question,b=t.generate(t.distinctCount,'replay').question;
    assert.equal(a.prompt,b.prompt);assert.notEqual(a.id,b.id);assert.notEqual(a.prompt,t.generate(0,'another').question.prompt);
    assert.doesNotThrow(()=>t.generate(Number.MAX_SAFE_INTEGER));
    for(const bad of [-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>t.generate(bad));
  }
});

function fixture(){
  const catalog=defaultPracticeCatalog(require('./math-topics.json'));const ids=new Set(templates.map(t=>t.id));catalog.generators=catalog.generators.filter(g=>!ids.has(g.id));
  for(const t of templates){const d=t.destination;
    let parent=catalog.modules.find(m=>m.id===d.parentId);
    if(!parent){parent={id:d.parentId,title:'Keep parent',description:'',category:t.category,topic:t.topic,defaultType:d.groupType,parentId:null,published:false,includeAll:false,generatorIds:[]};catalog.modules.push(parent);}
    if(!d.create){let m=catalog.modules.find(m=>m.id===d.moduleId);if(!m){m={id:d.moduleId,title:'Teacher custom '+d.moduleTitle,description:'Keep this',category:t.category,topic:t.topic,parentId:d.parentId,published:false,includeAll:false,generatorIds:[]};catalog.modules.push(m);}Object.assign(m,{category:t.category,topic:t.topic,parentId:d.parentId,skillId:'duplicate-teacher-skill'});}
  }
  catalog.videos.push({id:'preserve-video',title:'Keep video',description:'',category:'Algebra',topic:'Inequalities',published:false,url:''});
  return catalog;
}
test('one batch targets exact IDs, preserves customization, publishes only authorized destinations, and is idempotent',()=>{
  const before=fixture(),snapshot=structuredClone(before);
  const registered=templates.reduce((catalog,t)=>addBuiltinPractice(catalog,t),before);
  const draft=registered.modules.find(m=>m.id===templates[2].moduleId);assert.equal(draft.published,false);
  const enabled=enableBuiltinPractices(registered,templates),published=publishBuiltinDestinations(enabled,templates),student=studentPracticeCatalog(published);
  assert.deepEqual(before,snapshot);assert.deepEqual(published.videos,before.videos);assert.deepEqual(published.generators.slice(0,before.generators.length),before.generators);
  const changedIds=new Set(templates.flatMap(t=>[t.moduleId,t.destination.parentId]));
  for(const original of before.modules){const after=published.modules.find(m=>m.id===original.id);if(!changedIds.has(original.id))assert.deepEqual(after,original);else{assert.equal(after.title,original.title);assert.equal(after.description,original.description);assert.equal(after.includeAll,original.includeAll);assert.ok(original.generatorIds.every(id=>after.generatorIds.includes(id)));}}
  for(const t of templates){
    const module=student.modules.find(m=>m.id===t.moduleId);assert.ok(module);assert.ok(managedGeneratorIds(module,student).includes(t.id));assert.equal(published.generators.find(g=>g.id===t.id).reviewStatus,'unreviewed');
    const parent=student.modules.find(m=>m.id===module.parentId);assert.ok(managedGeneratorIds(parent,student).includes(t.id));
    const state=createPracticeState(module.id,'saved-batch',student),restored=parsePracticeState(JSON.stringify(state));assert.deepEqual(restored,state);
    const q=generateCatalogQuestion(student.generators.find(g=>g.id===t.id),0,'start',3);assert.ok(isExamQuestionCorrect(q,q.correctChoiceId??q.correctTextAnswers[0]));
  }
  const again=publishBuiltinDestinations(enableBuiltinPractices(templates.reduce((c,t)=>addBuiltinPractice(c,t),published),templates),templates);assert.deepEqual(again,published);
  const untouched=templates.map(t=>({...t,publishAfterValidation:false}));assert.deepEqual(publishBuiltinDestinations(enabled,untouched),enabled);
  const oldState=createPracticeState('inequalities','old',before),oldQuestion=practiceQuestion(oldState);assert.deepEqual(practiceQuestion(parsePracticeState(JSON.stringify(oldState))),oldQuestion);
});
test('stale exact destinations and conflicting IDs fail without modifying inputs',()=>{
  const catalog=fixture(),t=templates[0],before=structuredClone(catalog);
  assert.throws(()=>addBuiltinPractice(catalog,{...t,destination:{...t.destination,moduleId:'missing'}}),/Missing exact destination/);
  assert.throws(()=>addBuiltinPractice(catalog,{...t,destination:{...t.destination,parentId:'missing'}}),/Stale destination/);
  assert.throws(()=>publishBuiltinDestinations(catalog,templates),/unavailable/);
  assert.deepEqual(catalog,before);
});
