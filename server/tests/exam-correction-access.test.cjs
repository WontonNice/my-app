const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const {createExamResult} = require('../src/shared/examGrading.ts');
const {hasFullyAnsweredExam} = require('../src/shared/examCorrectionAccess.ts');
const english = {id:'ela',type:'multiple_choice',choices:[{id:'A'},{id:'B'}],correctChoiceId:'B'};
const examFor = question => ({assessmentId:'exam',title:'Exam',passageSets:[{id:'passage',passage:{id:'p',lines:[]},questions:[english]}],mathSection:{questions:[question]}});

test('automatic corrections require a full submitted attempt and complete answers, regardless of score', () => {
  const exam=examFor({id:'math',type:'numeric_entry',correctTextAnswers:['5']});
  const full=createExamResult(exam,{ela:'A',math:'4'});
  assert.equal(full.correct,0);
  assert.equal(hasFullyAnsweredExam(full),true);
  for(const result of [createExamResult(exam,{ela:'A'},['english']),createExamResult(exam,{ela:'A',math:''}),{...full,answers:{...full.answers,math:' '}},{...full,answers:{}},{...full,total:3},{...full,source:'manual'},{...full,source:'answer_sheet'}]) assert.equal(hasFullyAnsweredExam(result),false);
  assert.equal(hasFullyAnsweredExam({...full,analysisContent:undefined}),false);
  assert.equal(hasFullyAnsweredExam({...full,analysisContent:undefined},exam),true);
});

test('each part of multi-part answers must be filled; invalid extra IDs do not unlock corrections', () => {
  const cases=[
    [{type:'multi_select',choices:[{id:'a'},{id:'b'},{id:'c'}],requiredSelections:2},['a','c'],['a']],
    [{type:'graph_point_select',graph:{points:[{id:'a'},{id:'b'}]},requiredSelections:2},['a','b'],['a','unknown']],
    [{type:'inline_dropdown',dropdowns:[{id:'one',options:[{id:'a'}]},{id:'two',options:[{id:'b'}]}]}, {one:'a',two:'b'},{one:'a',unknown:'b'}],
    [{type:'math_drag_drop',items:[{id:'a'},{id:'b'}],dragDropSlots:[{id:'one'},{id:'two'}]}, {one:'a',two:'b'},{one:'a',two:''}],
    [{type:'matrix_choice',items:[{id:'one'},{id:'two'}],categories:[{id:'a'},{id:'b'}]}, {one:'a',two:'b'},{one:'a',unknown:'b'}],
    [{type:'category_sort',requiredPlacements:1,items:[{id:'one'},{id:'two'}],categories:[{id:'a'}]}, {two:'a'},{one:''}],
    [{type:'number_line_response'}, {value:'0',direction:'left',endpoint:'open'},{value:'',direction:'left',endpoint:'open'}],
    [{type:'expression_entry'}, '3/4','\\frac{3}{}'],
  ];
  for(const [config,complete,incomplete] of cases){
    const exam=examFor({...config,id:'math'});
    // Completion is deliberately independent of answer-key correctness.
    const result={analysisContent:exam,answers:{ela:'A',math:complete},total:2,completedSections:['english','math'],completionStatus:'complete'};
    assert.equal(hasFullyAnsweredExam(result),true,config.type);
    assert.equal(hasFullyAnsweredExam({...result,answers:{ela:'A',math:incomplete}}),false,config.type);
  }
});
