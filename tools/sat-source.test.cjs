const {test}=require('node:test');
const assert=require('node:assert/strict');
const {ela,math}=require('./sat-crash-course-import.cjs');
const rich=require('../extensions/sat-crash-course-reader/rich-text.js');
const {parse}=require('../extensions/sat-crash-course-reader/dom-fixture.cjs');
const {normalize}=require('./sat-source-normalize.cjs');
const source={url:'https://tutor.thesatcrashcourse.com/tests/fixture',label:'Fixture source'};
const q=(number,extra={})=>({number,total:50,sourceNumber:number,prompt:'Choose the answer.',promptHtml:'Choose the <strong>answer</strong>.',choices:[{label:'A',text:'One',html:'One',isCorrect:true},{label:'B',text:'Two',html:'Two'}],correctAnswer:{label:'A',text:'One'},explanation:'Source explanation.',explanationHtml:'Source <em>explanation</em>.',...extra});
const reader=questions=>({source,testPreview:{testTitle:'Fixture source',module:'English Language Arts',questions,capture:{mode:'ela-all',warnings:[]}}});
test('full ELA preserves source grouping, rich passage, native inline selections and every blank',async()=>{
  const passage={id:'p-1',text:'First paragraph. Second paragraph.',html:'<p>First <strong>paragraph</strong>.</p><p>Second paragraph.</p>'};
  const data=reader([q(1,{passage}),q(2,{passage}),q(3,{choices:[],interaction:{type:'hot_text',text:'Fix this word.',contentHtml:'Fix <span data-source-option="word-1">this</span> <span data-source-option="word-2">word</span>.',options:[{id:'word-1',text:'this',html:'this',isCorrect:false},{id:'word-2',text:'word',html:'<u>word</u>',isCorrect:true}]}}),q(4,{choices:[],interaction:{type:'sentence_blank',contentHtml:'A {{blank-1}} and B {{blank-2}}.',options:[{id:'x',text:'first',html:'<em>first</em>'},{id:'y',text:'second',html:'second'}],slots:[{id:'blank-1',answer:'second'},{id:'blank-2',answer:'first'}]}})]);
  const result=await ela(data);
  assert.equal(result.source.sourceFamily,'sat_crash_course');assert.equal(result.source.playerProfile,'sat_crash_course');
  assert.equal(result.passages.length,2);assert.deepEqual(result.passages.map(p=>p.questions.length),[2,2]);assert.equal(result.passages[0].richText,passage.html);
  const [hot,blank]=result.passages[1].questions;assert.equal(hot.correctChoiceId,'B');assert.equal(hot.selectionHtml,'Fix <span data-choice-id="A">this</span> <span data-choice-id="B">word</span>.');
  assert.equal(blank.type,'transition_drop');assert.deepEqual(blank.dragDropSlots.map(s=>s.correctItemId),['y','x']);assert.equal(blank.sourceInteraction.type,'sentence_blank');
});
test('rich HTML preserves tables, links and figure position without event handlers',()=>{
  const html=rich.fromElement(parse('<p>Before<img src="https://thesatcrashcourse.s3.amazonaws.com/media/a.png" alt="Figure" onerror="bad()">After</p><table><tr><th colspan="2">Heading</th></tr><tr><td>1</td><td>2</td></tr></table><a href="https://example.com">Credit</a>'),n=>n.style);
  assert.match(html,/Before<img[^>]+>After/);assert.match(html,/<table><tr><th colspan="2">Heading/);assert.match(html,/<a href="https:\/\/example.com">Credit/);assert.doesNotMatch(html,/onerror|bad/);
});
test('Math assets are localized once in their original position, including explanations',async()=>{
  const url='https://thesatcrashcourse.s3.amazonaws.com/media/figure.png';const data=reader([q(1,{sourceNumber:51,promptHtml:`Before<img src="${url}" alt="Figure">After`,media:[{url,alt:'Figure'}],explanationHtml:`Why<img src="${url}">`,explanationMedia:[{url}]})]);data.testPreview.module='Mathematics';
  const result=await math(data,async()=>({src:'/exam-images/test.png'})), item=result.mathQuestions[0];
  assert.equal((item.promptHtml.match(/<img/g)||[]).length,1);assert.match(item.promptHtml,/Before<img src="\/exam-images\/test.png" alt="Figure">After/);assert.match(item.explanationHtml,/src="\/exam-images\/test.png"/);assert.equal(item.source.sourceQuestionNumber,51);assert.equal(result.source.sourceFamily,'sat_crash_course');
});
test('rendered DOM archive is inert and normalizes through the shared reader',()=>{
  const e=(tag,attrs,children)=>({tag,attrs,children}),t=text=>({text});
  const snapshot={tree:e('div',{class:'testSHSATPreview'},[e('button',{class:'testSHSATPreview__moduleSelect'},[t('Mathematics')]),e('button',{class:'testSHSATPreview__navigatorToggle'},[t('Question 1/50')]),e('div',{class:'testSHSATPreview__question'},[e('p',{class:'testSHSATPreview__questionNumber'},[t('51')]),e('span',{class:'testSHSATPreview__questionQuestion'},[t('Find the answer.')]),e('button',{},[t('Hide answer')]),e('div',{class:'testSHSATPreview__questionChoiceWrapper'},[e('span',{class:'testSHSATPreview__choiceText'},[t('A')]),e('span',{class:'testSHSATPreview__questionChoiceText'},[t('Two')]),e('span',{class:'testSHSATPreview__radioButton--selected'},[])]),e('div',{class:'testSHSATPreview__explanationBox'},[t('Because it is two.')])])])};
  const result=normalize({source,module:'math',capturedAt:'2026-10-29',records:[{unkeyed:snapshot,keyed:snapshot}]});
  const item=result.testPreview.questions[0];assert.equal(item.correctAnswer.label,'A');assert.equal(item.sourceNumber,51);assert.equal(item.explanation,'Because it is two.');assert.equal(result.testPreview.capture.complete,false);assert.equal(result.testPreview.capture.missingNumbers.length,49);
});

test('ELA keeps independent stimuli separate, table/category controls and verified blank IDs through import normalization',async()=>{
  const passage={id:'p1',title:'Source title',author:'Source author',byline:'by Source author',blurb:'Source introduction',text:'Body.',html:'<p><em>Body.</em></p>'};
  const interaction={type:'matrix_choice',items:[{id:'r1',text:'First row',html:'<u>First</u> row'}],categories:[{id:'yes',title:'Supported'},{id:'no',title:'Not supported'}],correctPlacements:{r1:'yes'}};
  const data=reader([q(1,{passage,choices:[],interaction}),q(2,{passage:{id:'part-b',section:'revising_editing_b',text:'(1) Independent.',html:'<p>(1) <strong>Independent.</strong></p>'},choices:[],interaction:{...interaction,type:'category_sort'}}),q(3,{passage,choices:[],interaction:{type:'sentence_blank',contentHtml:'<p><strong>Keep</strong> {{blank-1}}.</p>',options:[{id:'word-x',text:'One',html:'<em>One</em>'},{id:'word-y',text:'Two',html:'Two'}],slots:[{id:'blank-1',answer:'Two'}]}})]);
  const result=await ela(data);assert.equal(result.passages.length,1);assert.equal(result.englishQuestions.length,1);
  assert.equal(result.passages[0].title,passage.title);assert.equal(result.passages[0].byline,passage.byline);assert.equal(result.passages[0].blurb,passage.blurb);
  const independent=result.englishQuestions[0];assert.equal(independent.stimulusHtml,data.testPreview.questions[1].passage.html);assert.equal(independent.type,'category_sort');assert.deepEqual(independent.correctPlacements,{r1:'yes'});assert.equal(independent.promptHtml,'Choose the <strong>answer</strong>.');
  const matrix=result.passages[0].questions[0];assert.equal(matrix.type,'matrix_choice');assert.equal(matrix.items[0].html,'<u>First</u> row');assert.equal(matrix.requiredPlacements,1);
  const blank=require('./document-import.cjs').normalizeChoiceLabels(result.passages[0].questions[1]);assert.deepEqual(blank.choices.map(c=>c.id),['A','B']);assert.equal(blank.dragDropSlots[0].correctItemId,'B');assert.match(blank.dragDropContentHtml,/<strong>Keep<\/strong>/);
  assert.deepEqual(result.questionOrder,[1,2,3].map(n=>`${result.source.sourceId}-ela-${n}`));
});

test('print adapter joins continuing pages, removes confirmed margin labels and preserves verse stanzas and emphasis',()=>{
  const {passageBody}=require('./sat-source-print.cjs');
  const glyphs=(value,top,x=45,fontname='TimesNewRomanPSMT')=>Array.from(value,(text,i)=>({text,top,bottom:top+10,x0:x+i*5,x1:x+(i+1)*5,size:10.5,fontname}));
  const pages=[{chars:[...glyphs('1 First half-',30),...glyphs('wrapped line',46),...glyphs('continues',62,45,'TimesNewRomanPS-BoldMT')],lines:[]},{chars:[...glyphs('on next page.',25),...glyphs('2 New paragraph.',57)],lines:[]}];
  const body=passageBody(pages,{page:1,top:0},{page:2,top:100},{numbered:true});
  assert.equal(body.text,'First half-wrapped line continues on next page.\n\nNew paragraph.');assert.equal((body.html.match(/<p>/g)||[]).length,2);assert.match(body.html,/<strong>continues<\/strong>/);
  const poem=passageBody([{chars:[...glyphs('First line',30,71),...glyphs('5',46,55),...glyphs('Second line',46,71),...glyphs('New stanza',78,71)],lines:[]}],{page:1,top:0},{page:1,top:100},{format:'poem'});
  assert.equal(poem.text,'First line\nSecond line\n\nNew stanza');assert.equal(poem.html,'<div>First line<br>Second line</div><div>New stanza</div>');
});

test('print/browser reconciliation restores only the source-marked glossary occurrence with an exact safe popup',()=>{
  const {annotateGlossary}=require('./sat-source-print.cjs');
  const html=annotateGlossary('<p>A doublet; two doublets; another doublet.</p>',[{term:'doublet',definition:'a man\'s "jacket" & belt'}]);
  assert.equal((html.match(/data-glossary-definition=/g)||[]).length,1);
  assert.match(html,/data-glossary-definition="a man's &quot;jacket&quot; &amp; belt" role="link" tabindex="0">doublet<\/span>/);
  assert.match(html,/two doublets; another doublet/);
  assert.throws(()=>annotateGlossary('<p>Unrelated.</p>',[{term:'doublet',definition:'jacket'}]),/missing from passage/);
});
