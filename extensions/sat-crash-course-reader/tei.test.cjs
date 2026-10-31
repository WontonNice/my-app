const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {parse,Element}=require('./dom-fixture.cjs');
const rich=require('./rich-text.js');
const importer=require('../../tools/sat-crash-course-import.cjs');
const batches=require('../../tools/math-import-batch.cjs');
const code=readFileSync(join(__dirname,'content.js'),'utf8');
const h=(cls,body,tag='p')=>`<${tag} class="${cls}">${body}</${tag}>`;
function question(n, shown) {
  const prompt=h('testSHSATPreview__questionQuestion',n===47?'Select two statements that are true.':`Question ${n}`,'span');
  const helper=body=>h('testSHSATPreview__questionHelperText',body);
  if([3,13,45].includes(n)) return helper(`Find the value. ${shown ? h('testSHSATPreview__questionHelperFBBox',h('testSHSATPreview__fbCorrectAnswer',n===3?'1.25':n===13?'1':'60','span'),'span') : '<input class="testSHSATPreview__questionHelperFB" data-index="0" value="999">'}`);
  if(n===22) return prompt+h('digitalSHSATPreview__blankItems',(shown?['14','22']:['21','33','14','22']).map(s=>h('digitalSHSATPreview__blankItem',s)).join(''),'div')+h('digitalSHSATPreview__blankQuestionHelperText',`Length <div data-index="1" class="digitalSHSATPreview__blankQuestionHelperBox${shown?'Filled--correct':''}">${shown?'21':''}</div> and width <div data-index="2" class="digitalSHSATPreview__blankQuestionHelperBox${shown?'Filled--correct':''}">${shown?'33':''}</div>.`);
  if(n===41) return prompt+helper(`Rate ${[[9,27,30],[162,405,450]].map((a,i)=>h('testSHSATPreview__questionHelperIC',a.map((v,j)=>`<span value="${v}" class="${shown&&j===2?'testSHSATPreview__fbCorrectAnswer':''}">${v}</span>`).join(', '),'span')).join(' and distance ')}.`);
  if(n===48) return prompt+h('testSHSATPreview__eeContainer','<math-field></math-field>','div');
  return prompt+['A','B','C','D'].map(label=>h('testSHSATPreview__questionChoiceWrapper',h('testSHSATPreview__choiceText',label)+h('testSHSATPreview__questionChoiceText',`Choice ${label}`)+h(shown&&(label==='B'||n===47&&label==='A')?'testSHSATPreview__radioButton--selected':'testSHSATPreview__radioButton','','div'),'div')).join('');
}
function fixture({start=1,visible=false,render=question,stuckAt=0,expression='30x+45,45+30x,15(2x+3),15(3+2x)'}={}) {
  const state={number:start,visible,clock:0,explanation:false}; let listener;
  function dom() {
    const root=parse(`<main><h1>Test</h1><div class="testSHSATPreview"><button class="testSHSATPreview__moduleSelect">Mathematics</button><button class="testSHSATPreview__navigatorToggle">Question ${state.number}/50</button><div class="testSHSATPreview__question"><p class="testSHSATPreview__questionNumber">${state.number+50}</p>${render(state.number,state.visible)}<button>${state.visible?'Hide answer':'Show answer'}</button><button>Explanation</button></div><button ${state.number===1?'disabled':''}>BACK</button><button ${state.number===50?'disabled':''}>NEXT</button>${state.explanation?'<div class="testSHSATPreview__popup--explanation"><div class="testSHSATPreview__explanationBox">Source explanation '+state.number+'</div></div>':''}</div></main>`);
    const field=root.querySelector('math-field'); if(field)field.shadowRoot=parse(h('ML__content',state.visible?expression:'999','span'));
    for(const button of root.querySelectorAll('button')) button.click=()=>{const label=button.innerText;if(label==='BACK')state.number--;else if(label==='NEXT'){if(state.number!==stuckAt)state.number++;}else if(label==='Explanation')state.explanation=!state.explanation;else if(/answer/.test(label))state.visible=!state.visible;};
    return root;
  }
  const document={title:'Test preview',body:new Element(),querySelector:s=>dom().querySelector(s),querySelectorAll:s=>dom().querySelectorAll(s)};
  class Clock extends Date {static now(){return state.clock;}}
  vm.runInNewContext(code,{document,HTMLElement:Element,Date:Clock,URL,NathanSatRichText:rich,location:{href:'https://tutor.thesatcrashcourse.com/tests/fixture',origin:'https://tutor.thesatcrashcourse.com',pathname:'/tests/fixture'},getComputedStyle:n=>({display:'block',visibility:'visible',...n.style}),setTimeout:(fn,ms)=>{state.clock+=ms;queueMicrotask(fn);},chrome:{runtime:{onMessage:{addListener:fn=>listener=fn}}}});
  return {state,scan:options=>new Promise(resolve=>listener({type:'SAT_READER_SCAN',options},{},resolve))};
}
test('all 50 questions include helper-only short answers, multi-slot TEIs and expression entry; restore start',async()=>{
  const f=fixture({start:17,visible:true});
  const result=await f.scan({captureMode:'math-all',includeAnswer:true});
  assert.equal(result.ok,true);const p=result.data.testPreview;
  assert.equal(p.questions.length,50);assert.equal(p.capture.complete,true);assert.deepEqual(Array.from(p.capture.warnings),[]);
  assert.equal(f.state.number,17);assert.equal(f.state.visible,true);assert.equal(f.state.explanation,false);
  assert.equal(p.questions[2].correctAnswer.text,'1.25');assert.doesNotMatch(p.questions[2].promptHtml,/1\.25|999|input/);
  assert.equal(p.questions[21].interaction.options.length,4);assert.equal(p.questions[21].interaction.slots.length,2);
  const imported=await importer.math(JSON.parse(JSON.stringify(result.data)),async()=>{throw Error('Unexpected image');});
  assert.equal(imported.mathQuestions.length,50);
  assert.equal(imported.mathQuestions[2].type,'short_response');assert.deepEqual(imported.mathQuestions[2].correctTextAnswers,['1.25']);
  assert.equal(imported.mathQuestions[21].type,'math_drag_drop');assert.deepEqual(imported.mathQuestions[21].dragDropSlots.map(s=>s.correctItemId),['option-1','option-2']);
  assert.deepEqual(imported.mathQuestions[40].dropdowns.map(m=>m.correctChoiceId),['option-3','option-3']);
  assert.deepEqual(imported.mathQuestions[47].correctTextAnswers,['30x+45','45+30x','15(2x+3)','15(3+2x)']);
  assert.equal(imported.mathQuestions[46].type,'multi_select');assert.deepEqual(imported.mathQuestions[46].correctChoiceIds,['A','B']);
  const parsed=batches.parse(imported); assert.equal(parsed[0].batch.items.length,50); assert.ok(parsed[0].batch.items.every(i=>!i.error));
  // Follow the same durable draft/publication/normalization path as Math import,
  // using an isolated directory rather than the teacher's real exam data.
  const {documentDraftStore,publicationContent}=await import('../../tools/document-drafts.mjs');
  const fs=await import('node:fs/promises'),os=require('node:os');
  const directory=await fs.mkdtemp(join(os.tmpdir(),'sat-reader-tei-'));
  try {
    const store=documentDraftStore(directory);
    await store.import(imported,undefined,[],'exam',{captureFailures:true,directImport:true});
    const stored=(await store.read()).entries[0];
    const published=publicationContent(stored,{allowUnresolved:true});
    const server=readFileSync(join(__dirname,'../../tools/content-studio.mjs'),'utf8');
    const section=(start,end)=>server.slice(server.indexOf(start),server.indexOf(end));
    const normalize=vm.runInNewContext(`class EditorError extends Error {constructor(status,message){super(message);this.status=status;}}\n${section('function slugify(','function identifierFrom(')}\n${section('function requiredText(','function propertyName(')}\n${section('function normalizeMathImage(','function parseMathImportSource(')}\nnormalizeMathQuestion;`,{documentImport:require('../../tools/document-import.cjs')});
    const saved=published.questions.map((q,i)=>normalize(q,'fixture',i,{allowIncomplete:true}));
    assert.equal(saved.length,50);
    assert.equal(saved[2].correctTextAnswers[0],'1.25');
    assert.equal(saved[21].dragDropSlots[1].correctItemId,'option-2');
    assert.equal(saved[40].dropdowns[1].correctChoiceId,'option-3');
    assert.equal(saved[47].correctTextAnswers.length,4);
  } finally {if(require('node:path').dirname(directory)===os.tmpdir() && require('node:path').basename(directory).startsWith('sat-reader-tei-'))await fs.rm(directory,{recursive:true,force:true});}
});
test('answer opt-out exports no teacher-entered values or revealed TEI keys',async()=>{
  const f=fixture({start:3,visible:true}); const result=await f.scan({captureMode:'math-all',includeAnswer:false,includeExplanations:false});
  assert.equal(result.data.testPreview.questions.length,50);
  assert.ok(result.data.testPreview.questions.every(q=>q.correctAnswer===null));
  const imported=await importer.math(JSON.parse(JSON.stringify(result.data)),async()=>{});
  assert.deepEqual(imported.mathQuestions[2].correctTextAnswers,[]);
  assert.deepEqual(imported.mathQuestions[47].correctTextAnswers,[]);
  assert.equal(imported.mathQuestions[46].type,'multi_select');assert.deepEqual(imported.mathQuestions[46].correctChoiceIds,[]);assert.equal(imported.mathQuestions[46].requiredSelections,2);
  assert.ok(imported.mathQuestions[40].dropdowns.every(m=>m.correctChoiceId===''));
  assert.ok(imported.mathQuestions[21].dragDropSlots.every(s=>s.correctItemId===''));
  assert.equal(f.state.visible,true);
});
test('actual navigation failures still produce partial output and missing inventory',async()=>{
  const f=fixture({stuckAt:2}); const result=await f.scan({captureMode:'math-all',includeAnswer:true,includeExplanations:false});
  assert.equal(result.data.testPreview.questions.length,2);assert.equal(result.data.testPreview.capture.complete,false);assert.equal(result.data.testPreview.capture.missingNumbers.length,48);assert.equal(f.state.number,1);
});
test('unrecognized response does not block the rest of the section',async()=>{
  const f=fixture({render:(n,shown)=>n===3?h('testSHSATPreview__questionQuestion','A future TEI prompt.','span'):question(n,shown)});
  const result=await f.scan({captureMode:'math-all',includeAnswer:true,includeExplanations:false});
  assert.equal(result.data.testPreview.questions.length,50);
  assert.match(result.data.testPreview.capture.warnings.join(' '),/Question 3: Unrecognized/);
  const imported=await importer.math(JSON.parse(JSON.stringify(result.data)),async()=>{});
  assert.equal(imported.mathQuestions[2].type,'short_response');assert.deepEqual(imported.mathQuestions[2].correctTextAnswers,[]);
  assert.equal(imported.mathQuestions[2].review.warnings[0].code,'UNSUPPORTED_RESPONSE_TYPE');
});
test('positioned MathLive answers remain blank instead of flattening a fraction or exponent',()=>{
  assert.equal(rich.expressionAnswer(parse('<span class="ML__vlist">21</span>')),'');
  assert.equal(rich.expressionAnswer(parse('<span>30x+45,45+30x</span>')),'30x+45,45+30x');
});
module.exports={fixture};

test('source matrix tables retain every row, column and revealed key; attempted checks are never imported as keys',async()=>{
  const columns=['Rules out an explanation','Explains a mechanism','Shows a limitation'];
  const keys=[0,1,2,1,0,2];
  const render=(n,shown)=>h('testSHSATPreview__questionQuestion','Classify each statement.','span')+`<table class="digitalSHSATReview__tableGrid${shown?'ShowAnswer':''}"><tbody><tr><th></th>${columns.map(c=>`<th>${c}</th>`).join('')}</tr>${keys.map((key,i)=>`<tr><th><p><em>Statement ${i+1}</em></p></th>${columns.map((_,j)=>`<td><input type="checkbox" ${j===(shown?key:2)?'checked':''}></td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const f=fixture({render});
  const captured=await f.scan({includeAnswer:true,includeExplanations:false,includePassageQuestions:false});
  const q=captured.data.testPreview.question;
  assert.equal(q.interaction.type,'matrix_choice');
  assert.equal(q.interaction.items.length,6);assert.equal(q.interaction.categories.length,3);
  assert.match(q.interaction.items[0].html,/<em>Statement 1<\/em>/);assert.doesNotMatch(q.interaction.items[0].html,/<th>/);
  assert.deepEqual(Object.values(q.interaction.correctPlacements),keys.map(i=>`column-${i+1}`));
  const imported=await importer.math({...captured.data,testPreview:{...captured.data.testPreview,questions:[q]}},async()=>{});
  assert.equal(imported.mathQuestions[0].type,'matrix_choice');
  assert.deepEqual(imported.mathQuestions[0].correctPlacements,JSON.parse(JSON.stringify(q.interaction.correctPlacements)));
  const unkeyed=await fixture({render}).scan({includeAnswer:false,includeExplanations:false,includePassageQuestions:false});
  assert.deepEqual(Object.keys(unkeyed.data.testPreview.question.interaction.correctPlacements),[]);
});
