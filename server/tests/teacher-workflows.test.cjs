const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const vm=require('node:vm');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {parseAnswerCell,formatAnswerCell,pasteAnswerCells}=require('../../client/src/lib/answerEntry.ts');
const choices=[{id:'A',text:'First'},{id:'B',text:'Second'},{id:'C',text:'Third'}];
const choice={id:'mc',type:'multiple_choice',choices};
const short={id:'short',type:'numeric_entry'};
test('spreadsheet cells round-trip scalar, multi-select and every structured response without guessing keys',()=>{
 const fixtures=[
  [choice,'b','B'],[short,'-0.5','-0.5'],[{...choice,type:'multi_select'},'C, A',['C','A']],
  [{type:'graph_point_select',graph:{points:[{id:'p1'},{id:'p2'}]}},'p2',['p2']],
  [{type:'inline_dropdown',dropdowns:[{id:'drop',options:choices}]},'drop=b',{drop:'B'}],
  [{type:'math_drag_drop',dragDropSlots:[{id:'slot'}],items:[{id:'i1'}]},'slot=i1',{slot:'i1'}],
  ...['category_sort','matrix_choice','table_match'].map(type=>[{type,items:[{id:'row'}],categories:[{id:'cat'}]},'row=cat',{row:'cat'}]),
  [{type:'number_line_response'},'value=0; direction=left; endpoint=open',{value:'0',direction:'left',endpoint:'open'}],
 ];
 fixtures.forEach(([question,raw,expected])=>{assert.deepEqual(parseAnswerCell(question,raw),expected);assert.deepEqual(parseAnswerCell(question,formatAnswerCell(expected)),expected);});
 assert.throws(()=>parseAnswerCell(choice,'D'));assert.throws(()=>parseAnswerCell({...choice,type:'multi_select'},'A, A'));
 assert.throws(()=>parseAnswerCell(fixtures[4][0],'unknown=B'));assert.throws(()=>parseAnswerCell(fixtures[4][0],'drop=A; drop=B'));
 assert.deepEqual(parseAnswerCell(fixtures.at(-1)[0],'—'),{});
});
test('spreadsheet paste preserves blanks, handles numbered and horizontal cells, and rejects overflow or bad rows atomically',()=>{
 const items=[choice,{...choice,id:'mc2'},short].map((question,index)=>({question,section:'math',number:index+1}));
 assert.deepEqual(pasteAnswerCells(items,0,'B\r\n\r\n-0.5\r\n'),{mc:'B',mc2:'',short:'-0.5'});
 assert.deepEqual(pasteAnswerCells(items,0,'1\tA\n2\tB\n3\t5\n'),{mc:'A',mc2:'B',short:'5'});
 assert.deepEqual(pasteAnswerCells(items,0,'A\tB\t5'),{mc:'A',mc2:'B',short:'5'});
 assert.throws(()=>pasteAnswerCells(items,1,'A\nB\n5'),/last question/);
 assert.throws(()=>pasteAnswerCells(items,0,'A\nD\n5'),/question 2/);
 assert.throws(()=>pasteAnswerCells(items,0,'2\tA'),/does not match/);
 assert.throws(()=>pasteAnswerCells(items,0,'A\tB\nC\tA'),/one answer column/);
});
test('teacher answer entry normalizes paper E/F/G/H choices in single cells and spreadsheet pastes',()=>{
 const question={...choice,choices:[...choices,{id:'D',text:'Fourth'}]};
 const items=Array.from({length:4},(_,index)=>({question:{...question,id:`q${index+1}`},section:'english',number:index+1}));
 const expected={q1:'A',q2:'B',q3:'C',q4:'D'};
 assert.deepEqual(pasteAnswerCells(items,0,' E \r\nf\r\nG\r\nh\r\n'),expected);
 assert.deepEqual(pasteAnswerCells(items,0,'1\tE\n2\tf\n3\tG\n4\th\n'),expected);
 assert.deepEqual(pasteAnswerCells(items,0,'E\tf\tG\th'),expected);
 assert.deepEqual(pasteAnswerCells(items,1,'F\nG\nH'),{q2:'B',q3:'C',q4:'D'});
 assert.deepEqual(pasteAnswerCells(items,0,'A\nf\nC\nh'),expected);
 assert.deepEqual(pasteAnswerCells(items,0,'E\n\nG\nH'),{...expected,q2:''});
 assert.equal(parseAnswerCell(question,' h '),'D');
 assert.equal(parseAnswerCell({...question,type:'transition_drop'},'f'),'B');
 assert.deepEqual(parseAnswerCell({...question,type:'multi_select'},'e, G'),['A','C']);
 assert.throws(()=>parseAnswerCell({...question,type:'multi_select'},'A, E'),/each selection once/);
 assert.throws(()=>pasteAnswerCells(items,0,'E\nF\nI\nH'),/English question 3/);
 assert.throws(()=>parseAnswerCell(choice,'H'),/Use A, B, C/);
 for(const type of ['numeric_entry','grid_in','short_response','essay']) assert.equal(parseAnswerCell({type},'EFGH'),'EFGH');
 assert.throws(()=>parseAnswerCell({type:'graph_point_select',graph:{points:[{id:'A'}]}},'E'));
 assert.throws(()=>parseAnswerCell({type:'inline_dropdown',dropdowns:[{id:'drop',options:question.choices}]},'drop=E'));
 assert.equal(parseAnswerCell({...question,choices:[...question.choices,{id:'E',text:'Fifth'}]},'e'),'E');
});
test('teacher test Review spans every passage and subject on any screen; student and student-preview menus retain their limits',()=>{
 const source=fs.readFileSync(path.resolve(__dirname,'../../client/src/pages/ExamSessionPage.tsx'),'utf8');
 const block=source.slice(source.indexOf('  const reviewItems: ReviewItem[] = [];'),source.indexOf('  const unansweredCount = accessibleQuestions.filter('));
 const js=require('typescript').transpileModule(`function build({teacher=false,mode='',screen='passage'}) {
 const isTeacherPreviewSession=teacher,getStudentPreviewContext=()=>({mode}),sessionScreen=screen;
 const selectedAnswers={},bookmarkedQuestionIds=[],isQuestionAnswered=()=>false;
 const examContent={passageSets:[{questions:[{id:'p1'},{id:'p2'}],passage:{title:'First'}},{questions:[{id:'p3'}],passage:{title:'Second'}}]};
 const activePassageSetIndex=0,activePassageSet={...examContent.passageSets[0],directions:{}},shouldShowPassageDirections=true;
 const standaloneSection={questions:[{id:'s1'}],directions:{}},activeStandaloneQuestion=standaloneSection.questions[0];
 const mathQuestions=[{id:'m1'},{id:'m2'}],activeMathQuestion=mathQuestions[0],mathSection={directions:{}};
 ${block}
 return reviewItems;
 } build;`,{compilerOptions:{target:99}}).outputText;
 const build=vm.runInNewContext(js);
 for(const screen of ['directions','mathIntro','passage','mathQuestion','endSection','testOver']){
  const items=build({teacher:true,mode:'teacher',screen});
  assert.equal(items.length,6,screen);assert.equal(items[2].target.passageSetIndex,1);
  assert.equal(items[3].label,'English 4 · Revising / editing');assert.equal(items[5].target.kind,'math');
 }
 for(const context of [{teacher:false,mode:'teacher'},{teacher:true,mode:'student'},{}]){
  const items=build(context);assert.equal(items.filter(item=>item.kind==='question').length,2);
  assert.ok(items.every(item=>item.target?.kind!=='math'));
 }
});
