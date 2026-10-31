const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const {parse,Element}=require('./dom-fixture.cjs');
const rich=require('./rich-text.js');
const importer=require('../../tools/sat-crash-course-import.cjs');
const contract=require('../../tools/document-import.cjs');

test('source definitions and emphasis survive passage, prompt, answer and explanation import sanitization',async()=>{
  const html=rich.fromElement(parse('<p><strong>Bold</strong> <em>italic</em> <u>underlined</u> <sup>2</sup> <sub>n</sub> <del>removed</del> <mark class="testSHSATPreview__definitionMark" data-definition="Exact &quot;source&quot; &amp; definition"><em>term</em></mark></p>').children[0]);
  const input={source:{url:'https://tutor.thesatcrashcourse.com/tests/fixture'},testPreview:{module:'English Language Arts',questions:[{number:1,total:50,passage:{id:'p',html,glossaryTerms:['term','missing']},promptHtml:html,choices:[{label:'A',html},{label:'B',html:'Other'}],correctAnswer:{label:'A'},explanationHtml:html}]}};
  const converted=await importer.ela(input),p=converted.passages[0],q=p.questions[0];
  for(const field of [p.richText,q.promptHtml,q.choices[0].html,q.explanationHtml]){
    const clean=contract.sanitizeRichText(field);
    for(const tag of ['strong','em','u','sup','sub','s'])assert.match(clean,new RegExp(`<${tag}>`));
    assert.match(clean,/data-glossary-definition="Exact &quot;source&quot; &amp; definition" role="link" tabindex="0"><em>term<\/em>/);
  }
  assert.match(p.review.warnings[0].message,/missing/);
  assert.doesNotMatch(p.review.warnings[0].message,/for term,/,'one successful definition does not conceal another missing definition');
  assert.equal(q.correctChoiceId,'A');
});

function popupFixture({missing=false,alreadyOpen=false}={}){
  const root=parse('<div class="testSHSATPreview"><mark class="testSHSATPreview__definitionMark">term</mark><div id="definitionDrag" class="testSHSATPreview__popup--hidden"><span class="testSHSATPreview__popupHeaderCloseBig"></span><div class="testSHSATPreview__popupDefinition"></div></div></div>');
  const preview=root.children[0],mark=preview.querySelector('mark'),popup=preview.querySelector('#definitionDrag'),body=preview.querySelector('.testSHSATPreview__popupDefinition');
  let clock=0,clicks=0;class Clock extends Date{static now(){return clock;}}
  mark.click=()=>{clicks++;if(!missing){popup.attributes.class='testSHSATPreview__popup';body.childNodes=[{nodeType:3,textContent:'Exact source definition.'}];}};
  preview.querySelector('.testSHSATPreview__popupHeaderCloseBig').dispatchEvent=()=>{popup.attributes.class='testSHSATPreview__popup--hidden';};
  if(alreadyOpen){popup.attributes.class='testSHSATPreview__popup';body.childNodes=[{nodeType:3,textContent:'Previous definition'}];}
  const context={module:{exports:{}},document:{querySelector:s=>root.querySelector(s)},HTMLElement:Element,NathanSatRichText:rich,Date:Clock,MouseEvent:class{},getComputedStyle:()=>({display:'block',visibility:'visible'}),setTimeout:fn=>{clock+=100;queueMicrotask(fn);},chrome:{runtime:{onMessage:{addListener(){}}}}};
  vm.runInNewContext(fs.readFileSync(require.resolve('./content.js'),'utf8'),context);
  return {capture:context.module.exports.captureDefinitions,mark,popup,clicks:()=>clicks};
}
test('popup capture reads the source text and restores a closed panel',async()=>{
  const f=popupFixture(),warnings=[];await f.capture(warnings,1);
  assert.deepEqual(warnings,[]);assert.equal(rich.definitionFor(f.mark),'Exact source definition.');
  assert.match(rich.fromElement(f.mark),/data-glossary-definition="Exact source definition\."/);
  assert.match(f.popup.className,/--hidden/);
});
test('unavailable definitions remain flagged and an already open glossary is preserved',async()=>{
  for(const options of [{missing:true},{alreadyOpen:true}]){
    const f=popupFixture(options),warnings=[];await f.capture(warnings,2);
    assert.equal(warnings.length,1);assert.equal(rich.definitionFor(f.mark),'');
    if(options.alreadyOpen){assert.equal(f.clicks(),0);assert.doesNotMatch(f.popup.className,/--hidden/);}
  }
});

test('question capture uses the annotated definition layer and retains styling in all text fields',()=>{
  const document=parse('<main><div class="testSHSATPreview"><button class="testSHSATPreview__navigatorToggle">Question 1/50</button><div class="testSHSATPreview__passageTextPassage" id="passage p"><p>Plain copy</p></div><div class="testSHSATPreview__Definition" id="definition p"><p><em>Styled</em> <mark class="testSHSATPreview__definitionMark" data-definition="Exact definition">term</mark></p></div><div class="testSHSATPreview__question"><span class="testSHSATPreview__questionQuestion">Choose the <strong>best</strong> answer.</span><div class="testSHSATPreview__questionChoiceWrapper"><p class="testSHSATPreview__choiceText">A</p><p class="testSHSATPreview__questionChoiceText"><u>Underlined</u> answer</p></div></div></div></main>');
  const context={module:{exports:{}},document,HTMLElement:Element,NathanSatRichText:rich,getComputedStyle:()=>({display:'block',visibility:'visible'}),chrome:{runtime:{onMessage:{addListener(){}}}}};
  vm.runInNewContext(fs.readFileSync(require.resolve('./content.js'),'utf8'),context);
  const q=context.module.exports.readCurrentPreviewQuestion();
  assert.equal(q.passage.id,'p');assert.match(q.passage.html,/<em>Styled<\/em>/);
  assert.match(q.passage.html,/data-glossary-definition="Exact definition"/);
  assert.doesNotMatch(q.passage.html,/Plain copy/);
  assert.match(q.promptHtml,/<strong>best<\/strong>/);
  assert.match(q.choices[0].html,/<u>Underlined<\/u>/);
});
