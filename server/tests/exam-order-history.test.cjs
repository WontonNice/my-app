const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {preserveSubmittedSections} = require('../src/shared/examResume.ts');
const {orderedEnglishQuestions,orderByQuestionIds} = require('../src/shared/examQuestionOrder.ts');
const {createExamResult} = require('../src/shared/examGrading.ts');
const q = id => ({id,topic:'Fixture',type:'multiple_choice',prompt:id,choices:[{id:'A',text:'Yes'},{id:'B',text:'No'}],correctChoiceId:'A'});
const saved = {assessmentId:'exam-a',title:'Exam A',passageSets:[{id:'shared-passage',passage:{id:'shared-passage',title:'Shared',lines:[{text:'Saved source text'}]},questions:[q('p1'),q('p2')],questionCount:2}],standaloneSection:{id:'standalone',questions:[q('s1')],questionCount:1},mathSection:{id:'math',questions:[q('m1'),q('m2')],questionCount:2},questionOrder:['s1','p2','p1','m2','m1']};
const current = {...structuredClone(saved),questionOrder:['p1','s1','p2','m1','m2']};
current.passageSets[0].passage.lines[0].text='Current source text';
current.mathSection.questions[0].prompt='Current math wording';
const englishIds = content => orderedEnglishQuestions(content).map(location=>location.question.id);
const mathIds = content => orderByQuestionIds(content.mathSection.questions,content.questionOrder).map(question=>question.id);

test('submitting Math retains the submitted English source order and snapshot',()=>{
  const before = JSON.stringify({current,saved});
  const merged = preserveSubmittedSections(current,saved,['english']);
  assert.deepEqual(englishIds(merged),['s1','p2','p1']);
  assert.deepEqual(mathIds(merged),['m1','m2']);
  assert.equal(merged.passageSets[0].passage.lines[0].text,'Saved source text');
  assert.equal(merged.mathSection.questions[0].prompt,'Current math wording');
  const result = createExamResult(merged,{s1:'A',p2:'A',p1:'A',m1:'A',m2:'A'},['english','math']);
  assert.equal(result.correct,5);
  assert.deepEqual(englishIds(result.analysisContent),['s1','p2','p1']);
  assert.notEqual(result.analysisContent,merged);
  assert.equal(JSON.stringify({current,saved}),before);
});

test('submitted Math retains its order while English uses the current source order',()=>{
  const merged = preserveSubmittedSections(current,saved,['math']);
  assert.deepEqual(englishIds(merged),['p1','s1','p2']);
  assert.deepEqual(mathIds(merged),['m2','m1']);
  assert.deepEqual(englishIds(preserveSubmittedSections(current,saved,['english','math'])),englishIds(saved));
  assert.deepEqual(mathIds(preserveSubmittedSections(current,saved,['english','math'])),mathIds(saved));
});

test('legacy snapshots use their own natural order and another assessment cannot supply history',()=>{
  const legacy = structuredClone(saved); delete legacy.questionOrder;
  assert.deepEqual(englishIds(preserveSubmittedSections(current,legacy,['english'])),['p1','p2','s1']);
  assert.equal(preserveSubmittedSections(current,{...saved,assessmentId:'exam-b'},['english']),current);
  assert.equal(preserveSubmittedSections(current,undefined,['english']),current);
});
