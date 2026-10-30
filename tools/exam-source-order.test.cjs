const {test,before}=require('node:test');
const assert=require('node:assert/strict');
const {build}=require('esbuild');
const {runInNewContext}=require('node:vm');
const path=require('node:path');
let api;
before(async()=>{
  const result=await build({stdin:{contents:`export * from './server/src/shared/examQuestionOrder'; export * from './server/src/shared/examGrading'; export * from './client/src/lib/examSessionProgress';`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',write:false});
  const module={exports:{}};runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,Date,URLSearchParams});api=module.exports;
});
const question=id=>({id,type:'multiple_choice',prompt:id,topic:'',points:1,choices:[{id:'A',text:'Yes'},{id:'B',text:'No'}],correctChoiceId:'A'});
const content={assessmentId:'ordered',title:'Source order',passageSets:[{id:'p1',label:'Passage',passage:{title:'Passage 1'},questions:['q5','q6'].map(question)},{id:'p2',label:'Passage',passage:{title:'Passage 2'},questions:['q7','q8'].map(question)}],standaloneSection:{questions:['q1','q2','q3','q4'].map(question)},mathSection:{questions:['m1','m2'].map(question)}};
const plain=value=>JSON.parse(JSON.stringify(value));
const progress=(answers,navigation)=>({answers,navigation,completedSections:[],status:'in_progress',updatedAt:'2026-10-29'});
test('official source starts with independent1–4 and then reaches every passage question before Math',()=>{
  const exam={...content,questionOrder:['q1','q2','q3','q4','q5','q6','q7','q8','m1','m2']};
  const segments=api.orderedEnglishSegments(exam);
  assert.deepEqual(plain(segments.map(s=>({kind:s.kind,ids:s.questions.map(q=>q.question.id)}))),[{kind:'standalone',ids:['q1','q2','q3','q4']},{kind:'passage',ids:['q5','q6']},{kind:'passage',ids:['q7','q8']}]);
  assert.deepEqual(plain(api.getAllExamQuestions(exam).map(q=>q.id)),exam.questionOrder);
  assert.deepEqual(plain(api.getExamSectionQuestionIds(exam).english),exam.questionOrder.slice(0,8));
  assert.equal(api.createExamResult(exam,Object.fromEntries(exam.questionOrder.map(id=>[id,'A']))).correct,10);
});
test('explicit order can revisit a passage and reorder within a segment without losing questions',()=>{
  const exam={...content,questionOrder:['q6','q1','q5','q2','q4','q3','q8','q7']};
  const segments=api.orderedEnglishSegments(exam);
  assert.deepEqual(plain(segments.map(s=>s.questions.map(q=>q.question.id))),[['q6'],['q1'],['q5'],['q2','q4','q3'],['q8','q7']]);
  assert.equal(segments[0].questions[0].questionIndex,1);assert.equal(segments[2].passageIndex,0);
});
test('unknown and duplicate source IDs are ignored while added questions append in legacy order',()=>{
  const exam={...content,questionOrder:['removed','q3','q3','q6']};
  assert.deepEqual(plain(api.getExamSectionQuestionIds(exam).english),['q3','q6','q5','q7','q8','q1','q2','q4']);
});
test('legacy resume without navigation selects first blank in source order; exact saved IDs still win',()=>{
  const exam={...content,questionOrder:['q1','q2','q3','q4','q5','q6','q7','q8']};
  assert.deepEqual(plain(api.getExamResumePosition(exam,'english',progress({q1:'A'}))),{screen:'standaloneQuestion',passageIndex:0,questionIndex:1});
  assert.deepEqual(plain(api.getExamResumePosition(exam,'english',progress({q1:'A',q2:'A',q3:'A',q4:'A'}))),{screen:'passage',passageIndex:0,questionIndex:0});
  const saved=progress({q1:'A'},{subject:'english',english:{screen:'passage',passageSetId:'p2',questionId:'q8'}});
  assert.deepEqual(plain(api.getExamResumePosition(exam,'english',saved)),{screen:'passage',passageIndex:1,questionIndex:1});
  assert.deepEqual(saved.answers,{q1:'A'});
});
test('historical exams without questionOrder retain original passage-first sequencing and saved directions',()=>{
  assert.deepEqual(plain(api.getExamSectionQuestionIds(content).english),['q5','q6','q7','q8','q1','q2','q3','q4']);
  assert.equal(api.getExamResumePosition(content,'english',null).screen,'directions');
  const saved=progress({q5:'A'},{subject:'english',english:{screen:'standaloneDirections',questionId:'q3'}});
  assert.deepEqual(plain(api.getExamResumePosition(content,'english',saved)),{screen:'standaloneDirections',passageIndex:0,questionIndex:2});
});
