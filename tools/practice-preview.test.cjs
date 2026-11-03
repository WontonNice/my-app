const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {createPracticeState,parsePracticeState,currentPracticeGeneratorId,hidePracticeGenerator}=require('../client/src/features/math-command/inequalitySession.ts');
const {practiceQuestion,previewCorrectAnswer,browsePreviewGeneration,simulatePreviewAnswers}=require('../client/src/features/math-command/practicePreview.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
test('preview answer uses one accepted entry and preserves structured answer keys',()=>{
 const question={id:'numeric',type:'numeric_entry',correctTextAnswers:['1','1.0']};
 assert.equal(isExamQuestionCorrect(question,previewCorrectAnswer(question)),true);
 const dropdown={id:'dropdown',type:'inline_dropdown',dropdowns:[{id:'slot',correctChoiceId:'choice'}]};
 assert.deepEqual(previewCorrectAnswer(dropdown),{slot:'choice'});
});
test('browse moves deterministically backward and forward without scoring skipped generations',()=>{
 const original=createPracticeState('inequalities','preview-test');
 const next=browsePreviewGeneration(original,1),previous=browsePreviewGeneration(next,0);
 assert.notEqual(practiceQuestion(original).id,practiceQuestion(next).id);
 assert.deepEqual(practiceQuestion(original),practiceQuestion(previous));
 assert.equal(next.checked,0);assert.ok(parsePracticeState(JSON.stringify(next)));
});
test('preview simulations use real streak unlocks, correct answer keys and reset behavior',()=>{
 let state=createPracticeState('inequalities','preview-test');
 state=simulatePreviewAnswers(state,10,true);
 assert.equal(state.streak,10);assert.equal(state.correct,10);assert.equal(state.checked,10);
 assert.equal(isExamQuestionCorrect(practiceQuestion(state),state.answer),true);
 assert.ok(state.unlockedGeneratorIds.includes(currentPracticeGeneratorId(state)));
 assert.ok(parsePracticeState(JSON.stringify(state)));
 assert.equal(hidePracticeGenerator(state,currentPracticeGeneratorId(state)).finished,true);
 state=simulatePreviewAnswers(state,1,false);
 assert.equal(state.streak,0);assert.equal(state.longestStreak,10);assert.equal(state.checked,11);
 assert.equal(isExamQuestionCorrect(practiceQuestion(state),state.answer),false);
 const reset=browsePreviewGeneration(state,0);
 assert.equal(reset.checked,0);assert.deepEqual(reset.unlockedGeneratorIds,[]);assert.deepEqual(reset.hiddenGeneratorIds,[]);
});
