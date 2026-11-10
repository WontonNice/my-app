const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {createExamResult}=require('../src/shared/examGrading.ts');
const {canReviewSubmittedActivity}=require('../src/shared/examCorrectionAccess.ts');
const {questionDuplicateCandidates}=require('../src/shared/questionDuplicateCandidates.ts');
const {withPracticeSources,practiceMix}=require('../src/shared/practiceSources.ts');
const {defaultGeneratorSettings,validateGenerator,generateCatalogQuestion,studentPracticeCatalog}=require('../src/shared/practiceCatalog.ts');
const {createPracticeState,parsePracticeState}=require('../../client/src/features/math-command/inequalitySession.ts');
const q={id:'q1',type:'multiple_choice',topic:'Inference',prompt:'Which detail in the passage best supports the inventor’s determination?',choices:[{id:'A',text:'He continued his experiments.'},{id:'B',text:'He traveled home.'}],correctChoiceId:'A'};

test('submitted worksheets open review with skipped questions and one subject, while exams retain their release gate',()=>{
 const content={assessmentId:'sheet',title:'Worksheet',passageSets:[{id:'p',passage:{id:'p',title:'Passage',lines:[]},questions:[q,{...q,id:'q2'}]}]};
 const result=createExamResult(content,{q1:'B'},['english']);
 const worksheet={id:'sheet',studyHallWorksheet:{subject:'english',category:'Reading'}};
 assert.equal(canReviewSubmittedActivity(worksheet,result),true);
 assert.equal(canReviewSubmittedActivity({id:'sheet'},result),false);
 assert.equal(canReviewSubmittedActivity({...worksheet,id:'another'},result),false);
 assert.equal(canReviewSubmittedActivity(worksheet,null),false);
 assert.equal(canReviewSubmittedActivity(worksheet,{...result,answers:undefined}),false);
 assert.equal(canReviewSubmittedActivity(worksheet,{...result,completionStatus:'in_progress'}),false);
 assert.equal(canReviewSubmittedActivity(worksheet,{...result,source:'answer_sheet'}),false);
});

test('duplicate suggestions distinguish reordered MC choices, answer-key conflicts, TEI differences, and unrelated questions',()=>{
 const reordered={...q,id:'q2',choices:[{id:'C',text:'He traveled home.'},{id:'D',text:'He continued his experiments.'}],correctChoiceId:'D'};
 assert.equal(questionDuplicateCandidates([q,reordered])[0].kind,'exact');
 assert.equal(questionDuplicateCandidates([q,{...q,id:'q3',correctChoiceId:'B'}])[0].kind,'likely');
 const matrix={id:'m1',type:'matrix_choice',prompt:q.prompt,items:[{id:'row',text:'The inventor continued his experiments.'}],categories:[{id:'yes',title:'Supported'},{id:'no',title:'Not supported'}],correctPlacements:{row:'yes'}};
 assert.equal(questionDuplicateCandidates([matrix,{...matrix,id:'m2'}])[0].kind,'exact');
 assert.equal(questionDuplicateCandidates([matrix,{...matrix,id:'m3',correctPlacements:{row:'no'}}])[0].kind,'likely');
 assert.equal(questionDuplicateCandidates([matrix,{...matrix,id:'m4',categories:[...matrix.categories,{id:'maybe',title:'Not enough information'}]}])[0]?.kind,'likely');
 assert.equal(questionDuplicateCandidates([q,{...q,id:'other',prompt:'What is the area of a square whose sides measure four centimeters?',choices:[]}]).length,0);
 assert.equal(questionDuplicateCandidates([{...q,image:{src:'/a.png',alt:'Diagram'}},{...q,id:'image',image:{src:'/b.png',alt:'Diagram'}}])[0].kind,'likely');
 assert.deepEqual(questionDuplicateCandidates([q,q]),[]);
 const passages={q1:{id:'p1',title:'Passage',lines:[{text:'First edition'}]},q2:{id:'p2',title:'Passage',lines:[{text:'Changed evidence'}]}};
 assert.equal(questionDuplicateCandidates([q,reordered],passages)[0].kind,'likely');
});

const taxonomy=[{label:'Algebra',topics:['Inequalities','Equations']},{label:'Geometry',topics:['Area']}];
const generator=(id,extra={})=>({id,title:id,description:'QA generator',kind:'one-step',enabled:true,category:'Algebra',topic:'Inequalities',settings:{...defaultGeneratorSettings},sourceQuestionIds:[id+'-source'],...extra});
const moduleFor=(id,ids,published=true)=>({id,title:id,description:'',category:'Algebra',topic:'Inequalities',includeAll:false,published,generatorIds:ids});
const catalog={generators:[generator('official'),generator('prestige'),generator('unknown'),generator('hidden'),generator('disabled',{enabled:false}),generator('unreviewed',{reviewRequired:true,reviewStatus:'unreviewed'})],modules:[moduleFor('public',['official','prestige','unknown','disabled','unreviewed']),moduleFor('draft',['hidden'],false)],videos:[]};
const records=[{id:'official-source',question:{...q,source:{publisher:'Official Handbook'}},sources:[]},{id:'prestige-source',question:{...q,source:{publisher:'Prestige'}},sources:[]}];

test('source inheritance resolves publishers without guessing from names or accepting stale source labels',()=>{
 const next=withPracticeSources(catalog,records);
 assert.deepEqual(next.generators[0].sourcePublishers,['Official Handbook']);
 assert.deepEqual(next.generators[1].sourcePublishers,['Prestige']);
 assert.deepEqual(next.generators[2].sourcePublishers,['Unspecified']);
 const forged={...catalog,generators:[{...catalog.generators[2],sourcePublishers:['Official Handbook']}]};
 assert.deepEqual(withPracticeSources(forged,records).generators[0].sourcePublishers,['Unspecified']);
 assert.deepEqual(validateGenerator(next.generators[0]).sourcePublishers,['Official Handbook']);
 assert.equal(catalog.generators[0].sourcePublishers,undefined);
 assert.deepEqual(withPracticeSources(catalog,[{...records[0],question:{...q,source:{sourceFamily:'official_shsat'}}}]).generators[0].sourcePublishers,['Official Handbook']);
 assert.deepEqual(withPracticeSources(catalog,[{...records[1],question:{...q,source:{publisher:'Prestige Prep'}}}]).generators[1].sourcePublishers,['Prestige']);
});

test('mixed practice respects publication, multiple source toggles, coverage, snapshot resume, and an empty selection',()=>{
 const next=withPracticeSources(catalog,records),all=practiceMix(next,taxonomy);
 assert.deepEqual(all.generators.map(g=>g.id),['official','prestige','unknown']);
 assert.deepEqual(all.coverage.map(c=>c.count),[3,0,0]);
 const official=practiceMix(next,taxonomy,{category:'Algebra',publishers:['Official Handbook']});
 assert.deepEqual(official.generators.map(g=>g.id),['official']);
 assert.equal(official.coverage.length,2);
 assert.equal(practiceMix(next,taxonomy,{publishers:[]}).generators.length,0);
 assert.equal(practiceMix(next,taxonomy,{category:'Geometry'}).generators.length,0);
 const two=practiceMix(next,taxonomy,{publishers:['Prestige','Official Handbook']});
 assert.equal(two.id,practiceMix(next,taxonomy,{publishers:['Official Handbook','Prestige']}).id);
 assert.notEqual(two.id,official.id);
 const session=createPracticeState(official.id,'sources',official.catalog);
 assert.deepEqual(parsePracticeState(JSON.stringify(session)),session);
 assert.equal(session.generatorDefinitions[0].sourcePublishers[0],'Official Handbook');
 const question=generateCatalogQuestion(session.generatorDefinitions[0],0,session.seed);
 assert.equal(question.topic,'Algebra');
 assert.equal(question.subtopic,'Inequalities');
 assert.deepEqual(practiceMix({...next,generators:[]},taxonomy).generators,[]);
});

test('recommended-only published generators remain available when mixing an already filtered student catalog',()=>{
 const next={...withPracticeSources(catalog,records),recommended:[{id:'recommended',title:'Recommended',modules:[{id:'recommended-mix',title:'Recommended mix',published:true,generatorIds:['hidden']}]}]};
 const publicCatalog=studentPracticeCatalog(next);
 assert.ok(!publicCatalog.generators.some(g=>g.id==='hidden'));
 assert.ok(publicCatalog.recommendedGenerators.some(g=>g.id==='hidden'));
 assert.ok(practiceMix(publicCatalog,taxonomy).generators.some(g=>g.id==='hidden'));
});
