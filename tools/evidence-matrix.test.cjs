const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const vm=require('node:vm');
const contract=require('./document-import.cjs');
const raw=require('./fixtures/evidence-matrix-question.json');
require(require.resolve('ts-node',{paths:[path.resolve(__dirname,'../server')]})).register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');

test('new evidence question imports as a styled matrix and never guesses source answers',()=>{
 const [entry]=contract.parse({format:contract.format,passage:{id:'evidence-fixture',title:'Evidence fixture',text:'Test passage.',section:'reading',questions:[raw]}});
 const question=entry.content.questions[0];
 assert.equal(question.type,'matrix_choice');
 assert.equal(question.matrixStyle,'evidence');
 assert.deepEqual(question.categories,raw.categories);
 assert.deepEqual(question.items,raw.items);
 assert.deepEqual(question.correctPlacements,{});
 assert.equal(isExamQuestionCorrect(question,{}),false);
 assert.ok(contract.issues(entry,{reading:['Evidence & Support']}).some(issue=>issue.code==='ANSWER_KEY_MISSING'));
 assert.equal(contract.normalizeChoiceLabels(raw).matrixStyle,'evidence');
 assert.equal(contract.normalizeChoiceLabels({type:'matrix_choice'}).matrixStyle,undefined);
});

test('evidence matrix grading requires every row and rejects wrong, missing or additional placements',()=>{
 // A synthetic key exercises grading; the screenshot does not provide a source key.
 const correct={ 'row-1':'table','row-2':'passage','row-3':'both','row-4':'passage' };
 const question={...raw,type:'matrix_choice',matrixStyle:'evidence',correctPlacements:correct};
 assert.equal(isExamQuestionCorrect(question,correct),true);
 assert.equal(isExamQuestionCorrect(question,{'row-1':'table'}),false);
 assert.equal(isExamQuestionCorrect(question,{...correct,'row-3':'passage'}),false);
 assert.equal(isExamQuestionCorrect(question,{...correct,'extra':'both'}),false);
});

test('the editor offers a separate evidence type with three columns and editable source statements',()=>{
 const html=fs.readFileSync(path.join(__dirname,'content-studio.html'),'utf8');
 const extract=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
 const app={passageDraft:{id:'fixture',questions:[{id:'q',type:'multiple_choice',prompt:raw.prompt,choices:raw.items.map((item,i)=>({id:String.fromCharCode(65+i),text:item.text})),correctChoiceId:'A'}]}};
 const change=vm.runInNewContext(extract('    function defaultMatrixChoiceQuestion(', '    function defaultPassage(')+extract('    function choiceArrayFromQuestion(', '    function changeQuestionType(')+extract('    function changeQuestionType(', '    function choiceAction(')+'\nchangeQuestionType;', {app,clone:value=>JSON.parse(JSON.stringify(value)),markDirty(){},renderQuestionsV2(){}});
 change(0,'evidence_matrix');
 const question=app.passageDraft.questions[0];
 assert.equal(question.type,'matrix_choice');
 assert.equal(question.matrixStyle,'evidence');
 assert.deepEqual(Array.from(question.categories,category=>category.title),['Passage only','Table only','Both passage and table']);
 assert.deepEqual(Array.from(question.items,item=>item.text),raw.items.map(item=>item.text));
 assert.equal(Object.keys(question.correctPlacements).length,0);
 assert.equal(question.prompt,raw.prompt);
 change(0,'matrix_choice');
 assert.equal(app.passageDraft.questions[0].matrixStyle,undefined);
 assert.equal(app.passageDraft.questions[0].items.length,4);
});

test('SAT Crash Course structured captures keep evidence rows, headings and missing answers',()=>{
 const workspace=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'content-studio-workspace.js'),'utf8')+'\nstudioUI;', {URL});
 const converted=workspace.convertSatCrashCourseImport(JSON.stringify({source:{url:'https://tutor.thesatcrashcourse.com/tests/fixture'},testPreview:{testTitle:'Evidence fixture',questions:[{...raw,number:31,passage:{id:'p',title:'Source passage',text:'A complete test fixture passage.'}}]}}));
 const question=converted.passage.questions[0];
 assert.equal(question.type,'matrix_choice');
 assert.equal(question.matrixStyle,'evidence');
 assert.deepEqual(JSON.parse(JSON.stringify(question.items)),raw.items);
 assert.equal(Object.keys(question.correctPlacements).length,0);
 assert.ok(question.review.warnings.some(w=>w.code==='ANSWER_KEY_MISSING'));
 assert.equal(question.review.warnings.some(w=>w.code==='LOW_CONFIDENCE_QUESTION_TYPE'),false);
});
