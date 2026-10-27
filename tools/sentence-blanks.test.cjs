const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
require(require.resolve('ts-node',{paths:[path.resolve(__dirname,'../server')]})).register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {libraryQuestionAnswered,gradeLibraryBook}=require('../server/src/shared/libraryBooks.ts');
const {parseAnswerCell,answerCellHint}=require('../client/src/lib/answerEntry.ts');
const {playtestAnswer}=require('../server/src/lib/gameAnswerKey.ts');
const contract=require('./document-import.cjs');
const question=()=>({id:'two-blanks',type:'transition_drop',topic:'Tone & Mood',prompt:'Complete the sentence.',choices:['frustrated','restless','grateful','indifferent'].map((text,i)=>({id:String.fromCharCode(65+i),text})),dragDropContent:['Both {{blank-1}} and {{blank-2}}.'],dragDropSlots:[{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:'B'}],allowReuse:false});
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function studio(){const app={state:{assessments:[],examLabels:['Prestige']}};return {app,ui:vm.runInNewContext(fs.readFileSync(path.join(__dirname,'content-studio-workspace.js'),'utf8')+'\nstudioUI;',{app,escapeHtml})};}

test('every sentence blank is independently graded and partial, swapped, duplicate, and extra answers fail',()=>{
  const q=question(),correct={'blank-1':'A','blank-2':'B'};
  assert.equal(isExamQuestionCorrect(q,correct),true);
  assert.deepEqual(playtestAnswer(q,true),correct);
  for(const answer of ['A',{'blank-1':'A'},{'blank-1':'B','blank-2':'A'},{'blank-1':'A','blank-2':'A'},{...correct,extra:'C'}])assert.equal(isExamQuestionCorrect(q,answer),false);
  assert.equal(libraryQuestionAnswered(q,JSON.stringify({'blank-1':'A'})),false);
  const result=gradeLibraryBook({passageSet:{questions:[q]}},[{questionId:q.id,selectedAnswerId:JSON.stringify(correct)}]);
  assert.equal(result[0].isCorrect,true);assert.deepEqual(JSON.parse(result[0].correctAnswerId),correct);
  assert.throws(()=>gradeLibraryBook({passageSet:{questions:[q]}},[{questionId:q.id,selectedAnswerId:'{"blank-1":"A","blank-2":"A"}'}]),/included word/);
  const reused={...q,allowReuse:true,dragDropSlots:q.dragDropSlots.map(slot=>({...slot,correctItemId:'A'}))};
  assert.equal(isExamQuestionCorrect(reused,{'blank-1':'A','blank-2':'A'}),true);
  assert.equal(isExamQuestionCorrect({type:'transition_drop',correctChoiceId:'B'},'B'),true);
});

test('paper answer entry parses one answer per blank and source choice labels map to every keyed blank',()=>{
  const q=question();assert.deepEqual(parseAnswerCell(q,'blank-1=a; blank-2=b'),{'blank-1':'A','blank-2':'B'});
  assert.match(answerCellHint(q),/blank-1=A\/B\/C\/D/);
  assert.throws(()=>parseAnswerCell(q,'A'),/blank-1/);
  const mapped=contract.normalizeChoiceLabels({...q,choices:q.choices.map((choice,i)=>({...choice,id:['E','F','G','H'][i]})),dragDropSlots:[{id:'blank-1',correctItemId:'E'},{id:'blank-2',correctItemId:'F'}]});
  assert.deepEqual(mapped.dragDropSlots,q.dragDropSlots);
});

test('sentence authoring migrates old single blanks and resets keys when blank positions change',()=>{
  const {ui}=studio();const q={type:'transition_drop',transitionBlankBefore:'Before',transitionBlankAfter:'after.',correctChoiceId:'B',choices:question().choices};
  assert.equal(ui.transitionSentence(q),'Before [blank] after.');
  ui.setTransitionSentence(q,'Before [blank] after.');assert.equal(q.dragDropSlots[0].correctItemId,'B');assert.equal(q.correctChoiceId,undefined);
  ui.setTransitionSentence(q,'Both [blank] and [blank].');assert.equal(q.dragDropSlots.length,2);assert.ok(q.dragDropSlots.every(slot=>!slot.correctItemId));
  q.dragDropSlots[0].correctItemId='A';q.dragDropSlots[1].correctItemId='B';
  ui.setTransitionSentence(q,'Still [blank] and [blank].');assert.equal(q.dragDropSlots[1].correctItemId,'B');
  assert.equal((ui.transitionSentenceMarkup(q).match(/data-preview-transition-target=/g)||[]).length,2);
  assert.equal((ui.transitionKeyFields(q).match(/<select /g)||[]).length,2);
  assert.match(ui.exportCorrectAnswer(q),/Blank 1: A.*Blank 2: B/);
});

test('the real question editor binds sentence controls once per card, excluding nested indexed word fields',()=>{
  const html=fs.readFileSync(path.join(__dirname,'content-studio.html'),'utf8');
  const start=html.indexOf('    function renderQuestionsV2() {'),end=html.indexOf('    function choiceArrayFromQuestion(',start);
  assert.ok(start>0&&end>start);
  const {ui}=studio(),q=question(),app={passageDraft:{questions:[q]}};
  const node=(dataset={})=>({dataset,value:'',innerHTML:'',textContent:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}});
  const sentence=node(),keys=node(),notice=node(),insert=node(),add=node(),remove=node(),reuse=node();
  sentence.value=ui.transitionSentence(q);
  const keySelects=q.dragDropSlots.map((slot,i)=>({...node({transitionSlot:String(i)}),value:slot.correctItemId}));
  const fields=new Map([['[data-transition-sentence]',sentence],['[data-transition-keys]',keys],['[data-transition-key-note]',notice],['[data-transition-insert]',insert],['[data-transition-add-word]',add],['[data-transition-remove-word]',remove],['[data-transition-reuse]',reuse]]);
  const nestedWordFields=q.choices.map((choice,i)=>({...node({questionIndex:'0',choiceIndex:String(i),richKind:'choice'}),querySelector(){return null;},querySelectorAll(){return [];}}));
  const card={...node({questionIndex:'0'}),querySelector:selector=>fields.get(selector)||null,querySelectorAll:selector=>selector==='[data-transition-slot]'?keySelects:selector==='[data-rich-kind="choice"]'?nestedWordFields:[]};
  const container=node();let dirty=0,canvasUpdates=0;
  Object.assign(ui,{ensureQuestionSelection(){},selectedQuestionId:q.id,mountQuestions(){},updateCanvasAnswerKey(){canvasUpdates++;}});
  const render=vm.runInNewContext(html.slice(start,end)+'\nrenderQuestionsV2;',{
    app,studioUI:ui,escapeHtml,inlineRichValue:(_html,text)=>text||'',richToolbarHtml:()=>'',topicOptions:()=>'',currentPassageQuestionSection:()=> 'reading',
    $:(selector,root)=>root?root.querySelector(selector):container,
    $$:(selector,root)=>{
      if(root===container&&selector==='[data-question-index]')return [card,...nestedWordFields];
      if(root===container&&selector==='.question-card[data-question-index]')return [card];
      return [];
    },bindRichEditors(){},markDirty(){dirty++;},queueMicrotask:fn=>fn(),
  });
  assert.doesNotThrow(render);
  assert.match(container.innerHTML,/data-transition-sentence/);
  assert.match(container.innerHTML,/Word 4/);
  assert.equal(typeof sentence.oninput,'function');
  assert.ok(nestedWordFields.every(word=>typeof word.handlers.input==='function'));
  keySelects[1].value='C';keySelects[1].onchange();
  assert.equal(q.dragDropSlots[0].correctItemId,'A');assert.equal(q.dragDropSlots[1].correctItemId,'C');assert.equal(canvasUpdates,1);
  sentence.value='First [blank], then [blank], finally [blank].';sentence.oninput();
  assert.equal(q.dragDropSlots.length,3);assert.ok(q.dragDropSlots.every(slot=>!slot.correctItemId));
  assert.match(keys.innerHTML,/Blank 3 correct word/);assert.match(notice.textContent,/Blank positions changed/);
  assert.equal(dirty,2);
  add.onclick();assert.equal(q.choices.length,5);assert.match(container.innerHTML,/Word 5/);
  remove.onclick();assert.equal(q.choices.length,4);
});

test('exam lists sort official years newest first, forms alphabetically, and Prestige tests numerically without mutating input',()=>{
  const {ui}=studio();const exams=[{id:'2024-2025-form-b',title:'2024–2025 Form B'},{id:'2025-2026-form-b',title:'2025–2026 Form B'},{id:'2025-2026-form-a',title:'2025–2026 Form A'},...['10','2','1'].map(n=>({id:'prestige-'+n,title:'Digital SHSAT Practice Test '+n,examLabel:'Prestige'}))];
  const before=JSON.stringify(exams),groups=ui.assessmentGroups(exams);
  assert.deepEqual(Array.from(groups.find(g=>g.label==='Official practice').items,item=>item.id),['2025-2026-form-a','2025-2026-form-b','2024-2025-form-b']);
  assert.deepEqual(Array.from(groups.find(g=>g.label==='Prestige').items,item=>item.id),['prestige-1','prestige-2','prestige-10']);
  assert.equal(JSON.stringify(exams),before);
});

test('student preview lets two cards fill separate blanks, move between blanks, and return to the bank',()=>{
  const html=fs.readFileSync(path.join(__dirname,'content-studio.html'),'utf8');
  const a=html.indexOf('            var transitionTargets ='),b=html.indexOf('          <\\/script>',a);
  assert.ok(a>0&&b>a);
  const node=dataset=>({dataset,hidden:false,innerHTML:'',textContent:'',handlers:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(type,fn){this.handlers[type]=fn;}});
  const choices=['A','B','C','D'].map(id=>({...node({previewTransitionChoice:id}),innerHTML:id}));
  const targets=[node({previewTransitionTarget:'blank-1'}),node({previewTransitionTarget:'blank-2'})],bank=node({});
  const document={querySelectorAll:selector=>selector==='[data-preview-transition-target]'?targets:choices,querySelector:selector=>selector==='[data-preview-transition-bank]'?bank:{dataset:{transitionReuse:'false'}}};
  vm.runInNewContext(html.slice(a,b),{document});
  choices[0].handlers.click();targets[0].handlers.click();choices[1].handlers.click();targets[1].handlers.click();
  assert.deepEqual(targets.map(target=>target.dataset.placedChoice),['A','B']);
  const drop=id=>({preventDefault(){},dataTransfer:{getData:()=>id}});
  targets[0].handlers.drop(drop('B'));assert.equal(targets[0].dataset.placedChoice,'B');assert.equal(targets[1].dataset.placedChoice,undefined);assert.equal(choices[0].hidden,false);
  bank.handlers.drop(drop('B'));assert.equal(targets[0].dataset.placedChoice,undefined);assert.equal(choices[1].hidden,false);
});
