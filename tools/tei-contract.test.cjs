const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {fixtures,legacy,sentence}=require('./tei-fixtures.cjs');
const contract=require('./document-import.cjs');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {playtestAnswer}=require('../server/src/lib/gameAnswerKey.ts');

test('drag/drop publication accepts unused distractors and still requires a complete, valid key',()=>{
  const q={id:'one-box',type:'category_sort',topic:'Sentence Structure',prompt:'Move the answer.',items:[{id:'a',text:'First'},{id:'b',text:'Second'}],categories:[{id:'box',title:'Answer'}],categoryCapacity:1,requiredPlacements:1,correctPlacements:{b:'box'}};
  const keyIssues=question=>contract.issues({kind:'standalone',content:{questions:[question]}},{revising_editing_b:['Sentence Structure']}).filter(issue=>issue.code==='ANSWER_KEY_MISSING');
  assert.deepEqual(keyIssues(q),[]);
  for(const correctPlacements of [{},{a:'box',b:'box'},{b:'missing'},{unknown:'box'}]) assert.ok(keyIssues({...q,correctPlacements}).length,JSON.stringify(correctPlacements));
  assert.deepEqual(keyIssues({...q,categoryCapacity:undefined,requiredPlacements:2,correctPlacements:{a:'box',b:'box'}}),[]);
  assert.ok(keyIssues({...q,type:'matrix_choice',categories:[{id:'yes',title:'Yes'},{id:'no',title:'No'}],correctPlacements:{b:'yes'}}).length);
  assert.deepEqual(keyIssues({...q,type:'matrix_choice',categoryCapacity:undefined,categories:[{id:'yes',title:'Yes'},{id:'no',title:'No'}],correctPlacements:{a:'yes',b:'yes'}}),[]);
});

test('format map covers the persisted type union and all supported renderer families have fixtures',()=>{
  const types=fs.readFileSync('server/src/shared/examTypes.ts','utf8').split('export type ExamPassageSection')[0];
  assert.deepEqual([...types.matchAll(/\| "([^"]+)"/g)].map(m=>m[1]).sort(),Object.keys(contract.formatRegistry.formats).sort());
  for(const [type,format] of Object.entries(contract.formatRegistry.formats)) if(format.publishable) assert.ok(fixtures.some(q=>q.type===type),`Missing ${type} fixture`);
});

test('saved answers retain grading across serialization for every supported format',()=>{
  for(const q of fixtures){
    const answer=q.type==='coordinate_response' ? require('../server/src/shared/coordinateResponse.ts').correctCoordinateAnswer(q) : playtestAnswer(q,true);
    assert.equal(isExamQuestionCorrect(q,answer),true,`${q.id}: ${q.type}`);
    const saved=JSON.parse(JSON.stringify({question:q,answer}));
    assert.equal(isExamQuestionCorrect(saved.question,saved.answer),true,q.id);
    assert.deepEqual(saved.question,q);
  }
  assert.equal(isExamQuestionCorrect(legacy,'B'),true);
  assert.equal(isExamQuestionCorrect({...sentence,dragDropSlots:[sentence.dragDropSlots[0]],dragDropContent:['{{blank-1}}']},'A'),true);
  assert.equal(isExamQuestionCorrect(sentence,{'blank-1':'A'}),false);
});

test('invalid rich response mappings remain drafts with specific blocking issues',()=>{
  const cases=[
    {...sentence,dragDropContentHtml:'<p>{{missing}}</p>'},
    {...sentence,choices:[...sentence.choices,sentence.choices[0]]},
    {...legacy,type:'multiple_choice',selectionHtml:'<p><span data-choice-id="missing">First</span></p>'},
    {...legacy,type:'multiple_choice',hotSpot:true,image:{src:'/exam-images/diagram.svg',alt:'diagram'},choices:[{id:'A',text:'A',hotSpotRegion:{x:95,y:0,width:20,height:20}},{id:'B',text:'B'}]},
  ];
  for(const q of cases){
    const before=JSON.stringify(q);
    const issues=contract.issues({kind:'standalone',content:{questions:[q]}},{revising_editing_b:['Algebra']});
    assert.ok(issues.some(issue=>/same response IDs|unique IDs|selectable phrase|target regions/.test(issue.message)),q.id);
    assert.equal(JSON.stringify(q),before);
  }
});
