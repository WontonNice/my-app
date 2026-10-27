const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require(require.resolve('ts-node',{paths:[path.resolve(__dirname,'../server')]})).register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {generateOverlappingGroups,overlappingGroupsTemplate}=require('../server/src/shared/overlappingGroups.ts');

test('every overlapping-groups variant has a valid population, distinct stem and exactly one correct choice',()=>{
 const signatures=new Set(),letters=new Set(),contexts=new Set();let source;
 const {content20212022FormAMathSection}=require('../client/src/content/exams/mathSets/2021-2022-form-aMath.ts');
 const original=content20212022FormAMathSection.questions.find(q=>q.id===overlappingGroupsTemplate.sourceId);
 for(let index=0;index<overlappingGroupsTemplate.distinctCount;index++){
  const item=generateOverlappingGroups(index,'complete-bank'),q=item.question;
  const [a,b,both]=[...q.prompt.matchAll(/(\d+)%/g)].map(match=>Number(match[1]));
  const cells=[both,a-both,b-both,100-a-b+both];
  assert.ok(cells.every(value=>Number.isInteger(value)&&value>=5&&value<=85));
  assert.equal(cells.reduce((sum,value)=>sum+value,0),100);
  assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(choice=>choice.text)).size,4);
  const matches=q.choices.filter(choice=>parseInt(choice.text,10)===cells[3]);
  assert.equal(matches.length,1);assert.equal(matches[0].id,q.correctChoiceId);
  assert.ok(q.choices.every(choice=>/^\d+%$/.test(choice.text)&&parseInt(choice.text,10)<=100));
  signatures.add(`${item.contextIndex}:${a}:${b}:${both}`);letters.add(q.correctChoiceId);contexts.add(item.contextIndex);
  if(q.prompt===original.prompt)source=q;
 }
 assert.equal(signatures.size,overlappingGroupsTemplate.distinctCount);assert.equal(letters.size,4);assert.equal(contexts.size,3);
 assert.ok(source,'Source question 76 is included in the generated bank');
 assert.equal(source.choices.find(choice=>choice.id===source.correctChoiceId).text,'16%');
 assert.deepEqual(source.choices.map(choice=>choice.text).sort(),original.choices.map(choice=>choice.text).sort());
 assert.match(source.explanation,/45\+60-21=84/);assert.match(source.explanation,/100-84=16/);
});

test('overlapping-group sequences are deterministic, cycle explicitly and validate indices',()=>{
 assert.deepEqual(generateOverlappingGroups(9,'same'),generateOverlappingGroups(9,'same'));
 const first=generateOverlappingGroups(0,'same').question,repeated=generateOverlappingGroups(overlappingGroupsTemplate.distinctCount,'same').question;
 assert.equal(first.prompt,repeated.prompt);assert.notEqual(first.id,repeated.id);
 assert.notEqual(first.prompt,generateOverlappingGroups(0,'different').question.prompt);
 assert.doesNotThrow(()=>generateOverlappingGroups(Number.MAX_SAFE_INTEGER));
 for(const index of [-1,.5,Infinity,NaN,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>generateOverlappingGroups(index));
});

test('Overlapping Groups is a statistics topic and catalog registration preserves existing resources',()=>{
 const {defaultPracticeCatalog,validatePracticeCatalog,managedGeneratorIds,generateCatalogQuestion,removePracticeGenerator}=require('../server/src/shared/practiceCatalog.ts');
 const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
 const {addOverlappingGroups}=require('./register-overlapping-groups.cjs');
 const taxonomy=require('./math-topics.json');
 assert.ok(taxonomy.categories.find(c=>c.label==='Statistics and Probability').topics.includes('Overlapping Groups'));
 let old=removePracticeGenerator(defaultPracticeCatalog(),overlappingGroupsTemplate.id);
 old.modules=old.modules.filter(module=>module.id!==overlappingGroupsTemplate.sourceId);
 old.modules[0].title='Teacher collection';const before=structuredClone(old);
 const catalog=validatePracticeCatalog(addOverlappingGroups(old),taxonomy);
 assert.deepEqual(old,before);assert.deepEqual(addOverlappingGroups(catalog),catalog);
 assert.equal(catalog.modules[0].title,'Teacher collection');
 const module=catalog.modules.find(module=>module.id===overlappingGroupsTemplate.sourceId),generator=catalog.generators.find(generator=>generator.id===overlappingGroupsTemplate.id);
 assert.equal(module.category,'Statistics and Probability');assert.equal(module.topic,'Overlapping Groups');
 assert.equal(generator.category,module.category);assert.equal(generator.topic,module.topic);
 const state=createPracticeState(module.id,'saved',catalog);
 assert.deepEqual(state.generatorIds,managedGeneratorIds(module,catalog));assert.equal(state.generatorIds.length,2);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);
 const q=generateCatalogQuestion(state.generatorDefinitions[0],2,state.seed);
 assert.equal(q.topic,module.category);assert.equal(q.subtopic,module.topic);
 const general=catalog.modules.find(module=>module.defaultType==='general'&&module.topic==='Overlapping Groups');
 assert.ok(managedGeneratorIds(general,catalog).includes(generator.id));
 assert.ok(!managedGeneratorIds(catalog.modules.find(module=>module.id==='foundation'),catalog).includes(generator.id),'Existing inequality foundation does not silently gain a different topic');
 const filtered=createPracticeState(general.id,'topic-filter',catalog,{topics:['Statistics and Probability / Overlapping Groups']});
 assert.deepEqual(filtered.generatorIds,managedGeneratorIds(general,catalog));
});
