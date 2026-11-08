const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {syncLearningTaxonomy}=require('./learning-taxonomy.cjs');
const {assembleActivity,publishActivity,publicationIssues}=require('./learning-assemblies.cjs');
const {activityStore,withTypeScript}=require('./exam-catalog.cjs');
const {questionCatalog,selectCatalog}=require('./question-catalog.cjs');
const question={id:'canonical-q',type:'multiple_choice',prompt:'Choose the correct sentence.',topic:'Modifiers',choices:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctChoiceId:'A',points:1,source:{publisher:'Kaplan'}};
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'learning-workflow-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,'server/data'),{recursive:true});fs.writeFileSync(path.join(root,'server/data/activity-releases.json'),'{}');return root;}

test('taxonomy renames preserve identity and aliases across distinct ELA areas',t=>{
  const root=fixture(t),config={english:{reading:['Inference'],revising_editing_a:['Modifiers'],revising_editing_b:['Modifiers','TBD']},math:{categories:[{label:'Algebra',topics:['Inequalities']}]}};
  const before=syncLearningTaxonomy(root,[],config);
  const id=before.categories.find(item=>item.area==='revising_editing_a').id;
  const next=syncLearningTaxonomy(root,[{area:'revising_editing_a',from:'Modifiers',to:'Clear Modifiers'}],{...config,english:{...config.english,revising_editing_a:['Clear Modifiers']}});
  assert.equal(next.categories.find(item=>item.area==='revising_editing_a').id,id);
  assert.deepEqual(next.categories.find(item=>item.id===id).aliases,['Modifiers']);
  assert.notEqual(id,next.categories.find(item=>item.area==='revising_editing_b').id);
  assert.equal(next.categories.some(item=>item.label==='TBD'),false);
});
test('individual passage selection retains stimulus without selecting sibling questions',()=>{
  const set={id:'set',section:'revising_editing_a',label:'Passage',passage:{id:'passage',title:'Sample',lines:[{text:'The complete required stimulus.'}]},questions:[question,{...question,id:'other'}],questionCount:2,directions:{title:'Read',body:'Read.',subject:'English'}};
  const activity={id:'sheet',title:'Modifiers',studyHallWorksheet:{subject:'english',area:'revising_editing_a',scope:'focused',category:'Modifiers',categoryId:'revising_editing_a:modifiers'},assembly:{draftQuestionIds:['canonical-q'],reviewed:true}};
  const content=assembleActivity(activity,new Map([[question.id,{question,passageSet:set,area:'revising_editing_a'}]]));
  assert.equal(content.passageSets[0].questions.length,1);
  assert.equal(content.passageSets[0].passage.lines[0].text,set.passage.lines[0].text);
  assert.deepEqual(publicationIssues(activity,content),[]);
  assert.equal(set.questions.length,2);
});
test('publication pins immutable content and keeps a draft edit out of the published version',t=>{
  const root=fixture(t),activity={id:'sheet',title:'Standalone modifiers',studyHallWorksheet:{subject:'english',area:'revising_editing_b',category:'Modifiers',scope:'focused'},assembly:{draftQuestionIds:[question.id],reviewed:true}};
  const store=activityStore(path.join(root,'server/data'));store.write([activity]);
  const entries=new Map([[question.id,{question,area:'revising_editing_b'}]]),first=assembleActivity(activity,entries);
  const release=publishActivity(root,activity,first);
  entries.get(question.id).question={...question,correctChoiceId:'B'};
  const newer=assembleActivity(activity,entries);
  assert.notEqual(newer.standaloneSection.questions[0].correctChoiceId,first.standaloneSection.questions[0].correctChoiceId);
  const saved=JSON.parse(fs.readFileSync(path.join(root,'server/data/activity-releases.json')))[release.releaseId];
  assert.equal(saved.content.standaloneSection.questions[0].correctChoiceId,'A');
  const {resumeExamContent}=withTypeScript(()=>require('../server/src/shared/examResume.ts'));
  assert.equal(resumeExamContent({...newer,releaseId:'next'},saved.content),saved.content,'An active attempt keeps its original version.');
  assert.equal(store.read()[0].assembly.publishedReleaseId,release.releaseId);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'server/data/assessments.json'))),[]);
});
test('one bank question has typed worksheet and assessment usage',()=>{
  const inventory={passages:[],mathSections:[],standaloneItems:[question],tests:[{assessmentId:'sheet',passageIds:[],standaloneItemIds:[question.id]},{assessmentId:'exam',passageIds:[],standaloneItemIds:[question.id]}]};
  const content=id=>({assessmentId:id,title:id,passageSets:[],standaloneSection:{questions:[question]}});
  const catalog={registeredIds:new Set(['sheet','exam']),assessments:[{id:'sheet',studyHallWorksheet:{subject:'english',category:'Modifiers'}},{id:'exam'}],content:{sheet:content('sheet'),exam:content('exam')}};
  const result=questionCatalog(inventory,catalog);
  assert.deepEqual(result.issues,[]);assert.equal(result.entries.length,1);
  assert.deepEqual(result.entries[0].usages.map(item=>item.kind),['worksheet','assessment']);
  assert.equal(selectCatalog(result.entries,{usage:'worksheet',bankId:'revising_editing_b',publisher:'Kaplan'}).length,1);
  assert.equal(selectCatalog(result.entries,{usage:'unused'}).length,0);
});
test('new generators require review while the saved legacy catalog keeps access',()=>{
  const {defaultPracticeCatalog,reviewPracticePublication,studentPracticeCatalog}=withTypeScript(()=>require('../server/src/shared/practiceCatalog.ts'));
  const previous=defaultPracticeCatalog(),next=structuredClone(previous);
  next.generators.push({...next.generators[0],id:'new-unreviewed',reviewStatus:'unreviewed',enabled:true});
  assert.throws(()=>reviewPracticePublication(previous,next),/review and approve/);
  next.generators.at(-1).enabled=false;
  assert.equal(reviewPracticePublication(previous,next).generators.at(-1).reviewRequired,true);
  assert.ok(studentPracticeCatalog(previous).modules.length);
});

test('material generator edits require a fresh approval of the edited version',()=>{
  const {defaultPracticeCatalog,reviewPracticePublication,generatorReviewSignature,reviewedGeneratorChange}=withTypeScript(()=>require('../server/src/shared/practiceCatalog.ts'));
  const previous=defaultPracticeCatalog(),next=structuredClone(previous),generator=next.generators[0];
  generator.kind='two-step';generator.settings={minCoefficient:2,maxCoefficient:4,minBoundary:1,maxBoundary:3,minOffset:1,maxOffset:4,negativeCoefficients:false,inclusive:false};generator.reviewRequired=true;generator.reviewStatus='approved';generator.reviewedSignature='old';
  assert.throws(()=>reviewPracticePublication(previous,next),/review and approve/);
  generator.reviewedSignature=generatorReviewSignature(generator);
  assert.equal(reviewPracticePublication(previous,next).generators[0].enabled,true);
  const edited=reviewedGeneratorChange(generator,{...generator,settings:{...generator.settings,maxOffset:6}});
  assert.equal(edited.reviewStatus,'unreviewed');assert.equal(edited.enabled,false);
});
