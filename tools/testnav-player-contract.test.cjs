/** Offline integration checks against a complete captured A–D package. No browser or content writes. */
const {test,before}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {build}=require('esbuild');
const {runInNewContext}=require('node:vm');
const {load}=require('cheerio');
const importer=require('./document-import.cjs');
const root=process.env.TESTNAV_SOURCE_ROOT;
const options={skip:!root?'Set TESTNAV_SOURCE_ROOT to the captured TestNav A–D packages.':false};
let api,packages=[],remapPresentationQuestion,readerBundle,componentApi,React,renderToStaticMarkup;
const domRoot=process.env.TESTNAV_DOM_ROOT;
const domOptions={skip:!root||!domRoot?'Set TESTNAV_SOURCE_ROOT and TESTNAV_DOM_ROOT (scratch package containing linkedom) for actual component rendering.':false};
const localValues=new Map(),window={location:{search:''},localStorage:{getItem:key=>localValues.get(key)||null,setItem:(key,value)=>localValues.set(key,value),removeItem:key=>localValues.delete(key)},sessionStorage:{getItem:()=>null}};
const plain=value=>JSON.parse(JSON.stringify(value));
const text=html=>{const $=load(html||'',null,false);$('p,div,blockquote,h2,h3,li,tr,td,th,caption,br').append(' ');return $.root().text().replace(/\s+/g,' ').trim();};
const images=html=>{const $=load(html||'',null,false);return $('img').map((_,el)=>$(el).attr('src')).get();};
function canonicalExam(form){
 const id=`2026-2027-form-${form.toLowerCase()}`,content=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../server/data/exam-content.json')))[id];
 const raw=fs.readFileSync(path.resolve(__dirname,`../client/src/content/exams/mathSets/${id}Math.ts`),'utf8');
 const questions=JSON.parse(raw.slice(raw.indexOf('questions: [')+11,raw.lastIndexOf('],')+1));
 return {...content,mathSection:{...content.mathSection,questions}};
}
before(async()=>{
 if(!root)return;
 const bundle=await build({stdin:{contents:`export * from './client/src/content/exams/formatters'; export * from './server/src/shared/examGrading'; export * from './server/src/shared/examPresentation'; export * from './client/src/lib/inlineDropdownTemplate'; export * from './client/src/lib/examSessionProgress';`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',write:false});
 const module={exports:{}};runInNewContext(bundle.outputFiles[0].text,{module,exports:module.exports,Date,URLSearchParams,window});api=module.exports;
 readerBundle=(await build({entryPoints:[path.resolve(__dirname,'../server/src/lib/examContent.ts')],bundle:true,platform:'node',format:'cjs',write:false})).outputFiles[0].text;
 ({remapPresentationQuestion}=await import('./source-exam-transfer.mjs'));
 for(const form of ['A','B','C','D']){
  const folder=path.join(root,`testnav-${form}`),raw=JSON.parse(fs.readFileSync(path.join(folder,'import.json'))),entries=importer.parse(JSON.stringify(raw));
  packages.push({form,folder,raw,entries,questions:entries.flatMap(e=>e.content.questions),inventory:JSON.parse(fs.readFileSync(path.join(folder,'inventory.json')))});
 }
 if(domRoot){
  const {DOMParser:SourceDOMParser,Node,parseHTML}=require(path.resolve(domRoot,'node_modules/linkedom'));
  class DOMParser extends SourceDOMParser {parseFromString(html,type){return super.parseFromString(type==='text/html'&&!/<html\b/i.test(html)?`<html><head></head><body>${html}</body></html>`:html,type)}}
  const {document}=parseHTML('<!DOCTYPE html><html><head></head><body></body></html>');Object.defineProperty(document,'compatMode',{value:'CSS1Compat'});
  React=require('react');({renderToStaticMarkup}=require('react-dom/server'));
  const components=await build({stdin:{contents:`export * from './client/src/components/InlineTextSelection'; export * from './client/src/components/ExamMathQuestion'; export * from './client/src/components/ExamReviewQuestion'; export * from './client/src/lib/examReviewAnswer';`,resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',loader:{'.css':'empty'},external:['react','react/jsx-runtime','mathlive']});
  const module={exports:{}};
  // MathLive's custom keyboard is outside this server-render contract. All
  // imported graph, matrix, choice, rich-layout and review components are real.
  runInNewContext(components.outputFiles[0].text,{module,exports:module.exports,require:name=>name==='mathlive'?{MathfieldElement:class {}}:name.endsWith('.css')?{}:require(name),DOMParser,Node,NodeFilter:{SHOW_TEXT:4},document,console});componentApi=module.exports;
 }
});
function correctAnswer(q){
 if(q.type==='multiple_choice')return q.correctChoiceId;
 if(q.type==='multi_select')return q.correctChoiceIds;
 if(q.type==='graph_point_select')return q.correctPointIds;
 if(q.correctTextAnswers)return q.correctTextAnswers[0];
 if(q.type==='inline_dropdown')return Object.fromEntries(q.dropdowns.map(d=>[d.id,d.correctChoiceId]));
 if(q.type==='math_drag_drop')return Object.fromEntries(q.dragDropSlots.map(d=>[d.id,d.correctItemId]));
 if(q.type==='number_line_response')return {value:String(q.numberLineResponse.correctValue),endpoint:q.numberLineResponse.correctEndpoint,direction:q.numberLineResponse.correctDirection};
 return q.correctPlacements;
}
test('all 400 normalized source questions retain a playable grading contract, including ELA gap-match',options,()=>{
 let count=0,elaGap=0;
 for(const p of packages)for(const q of p.questions){
  assert.equal(api.isExamQuestionCorrect(q,correctAnswer(q)),true,q.id);
  assert.equal(api.isExamQuestionCorrect(q,undefined),false,`${q.id} must not grade blank correct`);
  if(q.type==='math_drag_drop'&&Number(q.sourceQuestion)<=50)elaGap++;
  count++;
 }
 assert.equal(count,400);assert.ok(elaGap>0);
});
test('all source selection phrases and live rich-template placeholders retain their ordered IDs',options,()=>{
 for(const p of packages)for(const q of p.questions){
  if(q.selectionHtml){const $=load(q.selectionHtml,null,false);assert.deepEqual($('[data-choice-id]').map((_,el)=>$(el).attr('data-choice-id')).get(),q.choices.map(c=>c.id),q.id);}
  for(const [field,controls] of [['dragDropContentHtml',q.dragDropSlots],['dropdownContentHtml',q.dropdowns]])if(q[field]){
   const $=load(q[field],null,false),ids=[];
   function visit(node){if(node.type==='text')ids.push(...api.parseInlineDropdownTemplate(node.data).filter(p=>p.kind==='dropdown').map(p=>p.value));for(const child of node.children||[])visit(child);}
   visit($.root()[0]);assert.deepEqual(ids,controls.map(c=>c.id),`${q.id}.${field}`);
  }
 }
});
test('all 28 source passage bodies preserve visible wording, inline markup, and image order through formatters',options,()=>{
 let count=0;
 for(const p of packages)for(const entry of p.entries.filter(e=>e.kind==='passage'&&e.content.text)){
  const source=entry.content,passage=api.createSourcePassage({...source,id:'test'}),body=passage.lines.filter(l=>!['intro','title','byline'].includes(l.kind));
  assert.equal(text(body.map(l=>l.html||l.text).join(' ')),text(source.richText),`${p.form} ${source.title} wording`);
  assert.deepEqual(plain(body.flatMap(l=>l.image?[l.image.src]:images(l.html))),images(source.richText),`${p.form} ${source.title} images`);
  const expected=load(source.richText,null,false),rendered=load(body.map(l=>l.html).join(''),null,false);
  assert.equal(rendered('[data-glossary-definition]').length,expected('[data-glossary-definition]').length,source.title);
  count++;
 }
 assert.equal(count,28);
});
test('explicit source verse lines survive sanitization and original printed line labels stay aligned',options,()=>{
 let poems=0;
 for(const p of packages)for(const raw of p.raw.passages.filter(x=>x.format==='poem')){
  const entry=p.entries.find(e=>e.content.title===raw.title),first=p.inventory.items.find(i=>String(i.number)===raw.questions[0].sourceQuestion);
  const source=JSON.parse(fs.readFileSync(path.join(p.folder,first.file))),$=load(source.itemBodyHtml,null,false),expected=[];
  $('.stimulus .passageContent [class^="count_"]').each((_,el)=>{const number=$(el).attr('class').match(/count_(\d+)/)?.[1];if(number)expected.push([number,$(el).text().replace(/\s+/g,' ').trim()]);});
  assert.equal((entry.content.richText.match(/data-poetry-line=/g)||[]).length,(raw.richText.match(/data-poetry-line=/g)||[]).length,`${raw.title}: verse metadata lost`);
  const passage=api.createSourcePassage({...entry.content,id:'test'});
  assert.deepEqual(plain(passage.lines.filter(l=>l.lineNumber).map(l=>[l.lineNumber,l.text.replace(/\s+/g,' ').trim()])),expected,`${raw.title}: source line numbers`);
  poems++;
 }
 assert.equal(poems,6);
});
test('Serpent Mound keeps distinct source indentation depths on explicit verse lines',options,()=>{
 const p=packages.find(p=>p.form==='C'),source=p.entries.find(e=>e.content.title==='Serpent Mound').content;
 const original=p.raw.passages.find(e=>e.title==='Serpent Mound');
 const $=load(original.richText,null,false),line=$('[data-poetry-line]').toArray().find(el=>/underbrush/.test($(el).text())),expected=$(line).text();
 const rendered=api.createSourcePassage({...source,id:'test'}).lines.find(l=>/underbrush/.test(l.text));
 assert.equal(rendered.text.match(/^\s*/)[0].length,expected.match(/^\s*/)[0].length,'Source nested indentation must not collapse to one generic indent.');
});
test('reused A/D presentation keeps every canonical answer/control ID and accepted key',options,()=>{
 for(const form of ['A','D']){
  const content=canonicalExam(form),incoming=packages.find(p=>p.form===form).raw.mathQuestions;
  for(let i=0;i<50;i++){
   const base=content.mathSection.questions[i],question=remapPresentationQuestion(incoming[i],base);
   const shown=api.applyExamPresentation({...content,presentationOverrides:{questions:{[base.id]:{base,question}}}}).mathSection.questions[i];
   assert.equal(shown.id,base.id);assert.equal(shown.type,base.type);
   for(const answer of base.correctTextAnswers||[correctAnswer(base)])assert.equal(api.isExamQuestionCorrect(shown,answer),true,`${base.id} old answer compatibility`);
   for(const field of ['dropdowns','dragDropSlots','choices','items'])if(base[field])assert.deepEqual(plain(shown[field].map(c=>c.id)),base[field].map(c=>c.id),`${base.id}.${field}`);
  }
 }
});
test('source presentation retains later canonical topic and subtopic classifications',options,()=>{
 const content=canonicalExam('A'),base=content.mathSection.questions[0];
 const incoming=remapPresentationQuestion(packages[0].raw.mathQuestions[0],base),current={...base,topic:'Teacher category',subtopic:'Teacher specific topic',skilled:true};
 const shown=api.applyExamPresentation({...content,mathSection:{...content.mathSection,questions:[current]},presentationOverrides:{questions:{[base.id]:{base,question:incoming}}}}).mathSection.questions[0];
 assert.equal(shown.topic,current.topic);assert.equal(shown.subtopic,current.subtopic);assert.equal(shown.skilled,true);
});
test('later teacher explanation edits invalidate the older source display explanation',options,()=>{
 const content=canonicalExam('D'),base=content.mathSection.questions[0];
 const incoming=remapPresentationQuestion(packages.find(p=>p.form==='D').raw.mathQuestions[0],base),current={...base,explanation:'Teacher revised reasoning',explanationHtml:'<p>Teacher revised reasoning</p>'};
 const shown=api.applyExamPresentation({...content,mathSection:{...content.mathSection,questions:[current]},presentationOverrides:{questions:{[base.id]:{base,question:incoming}}}}).mathSection.questions[0];
 assert.equal(shown.explanation,current.explanation);assert.equal(shown.explanationHtml,current.explanationHtml);
});
test('shared sanitizer removes executable attributes while retaining controlled source attributes',options,()=>{
 const attacks=['<img src="/exam-images/x.png" onerror="alert(1)">','<p onclick="alert(1)">Visible</p><script>alert(1)</script>','<a href="javascript:alert(1)">Unsafe</a>','<iframe srcdoc="<script>alert(1)</script>"></iframe>','<svg><a href="javascript:alert(1)">SVG</a></svg>'];
 for(const attack of attacks){const $=load(importer.sanitizeRichText(attack),null,false);assert.equal($('script,iframe,svg,object,embed').length,0);$('*').each((_,el)=>{for(const [k,v]of Object.entries(el.attribs))assert.ok(!/^on/i.test(k)&&!/^javascript:/i.test(v),`${k}=${v}`)});}
});

test('real exporter and server reader retain assessment-specific source appearances, snapshots and isolated resume for one shared passage',options,()=>{
 const scratch=path.dirname(path.resolve(root));
 const fixture=fs.mkdtempSync(path.join(scratch,'testnav-player-history-'));
 try{
  const source=packages[0].raw.passages[0],question={...source.questions[0],id:'shared-question'};
  const passage=plain(api.createSourcePassage({...source,id:'shared-passage'}));
  const make=(assessmentId,tag)=>{
   const display=structuredClone(passage),line=display.lines.find(line=>!line.kind&&line.text.trim());line.html=`<${tag}>${line.html||line.text}</${tag}>`;
   return {assessmentId,title:assessmentId,passageSets:[{id:'shared-set',label:'Shared source',passage,questions:[question]}],
    presentationOverrides:{passages:{[passage.id]:{baseLines:structuredClone(passage.lines),passage:display}}}};
  };
  const canonical={first:make('first','strong'),second:make('second','em')};
  fs.mkdirSync(path.join(fixture,'client/src/content/exams'),{recursive:true});fs.mkdirSync(path.join(fixture,'server/data'),{recursive:true});
  fs.writeFileSync(path.join(fixture,'server/data/assessments.json'),JSON.stringify([{id:'first'},{id:'second'}]));
  const presentationPath=path.resolve(__dirname,'../server/src/shared/examPresentation.ts').replaceAll('\\','/');
  fs.writeFileSync(path.join(fixture,'client/src/content/exams/index.ts'),`import {applyExamPresentation} from ${JSON.stringify(presentationPath)}; const exams=${JSON.stringify(canonical)}; export const resolveExamContent=(assessment:any)=>applyExamPresentation(exams[assessment.id]);`);
  require('./export-exam-content.cjs').exportExamContent(fixture);
  const module={exports:{}};runInNewContext(readerBundle,{module,exports:module.exports,require,__dirname:path.join(fixture,'server/src/lib')});
  const first=module.exports.getExamContent('first'),second=module.exports.getExamContent('second');
  const body=content=>content.passageSets[0].passage.lines.find(line=>!line.kind&&line.text.trim()).html;
  assert.match(body(first),/^<strong>/);assert.match(body(second),/^<em>/);
  assert.equal(first.passageSets[0].passage.id,second.passageSets[0].passage.id);assert.equal(first.passageSets[0].questions[0].id,second.passageSets[0].questions[0].id);
  const original=body(first),result=api.createExamResult(first,{'shared-question':correctAnswer(question)},['english']);
  first.passageSets[0].passage.lines.find(line=>!line.kind&&line.text.trim()).html='A later source edit';
  assert.equal(body(result.analysisContent),original);assert.equal(result.assessmentId,'first');assert.equal(result.correct,1);
  api.saveLocalExamSession('fixture-user','first',{'shared-question':'A'},[], 'in_progress',{}, {subject:'english',english:{screen:'passage',passageSetId:'shared-set',questionId:'shared-question'}});
  api.saveLocalExamSession('fixture-user','second',{'shared-question':'B'},[], 'in_progress');
  assert.equal(api.loadLocalExamSession('fixture-user','first').answers['shared-question'],'A');assert.equal(api.loadLocalExamSession('fixture-user','second').answers['shared-question'],'B');
  assert.deepEqual(plain(api.getExamResumePosition(second,'english',api.loadLocalExamSession('fixture-user','second'))),{screen:'endSection',passageIndex:0,questionIndex:0});
  assert.equal(canonical.first.passageSets[0].passage,canonical.second.passageSets[0].passage);
 }finally{
  const resolved=path.resolve(fixture),parent=path.resolve(scratch);
  assert.ok(resolved.startsWith(parent+path.sep)&&path.basename(resolved).startsWith('testnav-player-history-'));
  fs.rmSync(resolved,{recursive:true,force:true});
 }
});

test('actual active components render 396 source questions with every image and live control in place',domOptions,()=>{
 let count=0;
 for(const p of packages)for(const q of p.questions){
  if(q.type==='category_sort')continue; // Four ELA category-sort screens live in ExamSessionPage, outside this component.
  const markup=renderToStaticMarkup(React.createElement(q.selectionHtml?componentApi.InlineTextSelection:componentApi.ExamMathQuestion,{question:q,onChange(){},responseOnly:q.type==='math_drag_drop'&&Number(q.sourceQuestion)<=50})), $=load(markup,null,false);
  const expectedImages=['promptHtml','stimulusHtml','dropdownContentHtml','dragDropContentHtml'].flatMap(f=>q.type==='math_drag_drop'&&Number(q.sourceQuestion)<=50&&['promptHtml','stimulusHtml'].includes(f)?[]:images(q[f])).concat((q.choices||[]).flatMap(c=>images(c.html)));
  const renderedImages=$('img').map((_,el)=>$(el).attr('src')).get();for(const src of expectedImages)assert.ok(renderedImages.includes(src),`${q.id}: image ${src}`);
  if(q.selectionHtml)assert.equal($('[role="checkbox"][data-choice-id]').length,q.choices.length,q.id);
  if(q.type==='math_drag_drop')assert.equal($('[data-answer-slot]').length,q.dragDropSlots.length,q.id);
  if(q.type==='inline_dropdown')assert.equal($('select').length,q.dropdowns.length,q.id);
  if(q.type==='graph_point_select')assert.equal($('.exam-source-hotspot').length,q.graph.points.length,q.id);
  if(q.type==='matrix_choice')assert.equal($('input[type=radio]').length,q.items.length*q.categories.length,q.id);
  assert.equal($('.katex-error').length,0,q.id);assert.doesNotMatch(markup,/This math question type is not ready/,q.id);count++;
 }
 assert.equal(count,396);
});

test('all 400 correction components retain source graphs, interaction tables and complete choice banks',domOptions,()=>{
 let count=0;
 for(const p of packages)for(const q of p.questions){
  const markup=renderToStaticMarkup(React.createElement(componentApi.ExamReviewQuestion,{item:{question:q,submittedAnswer:componentApi.correctExamAnswer(q),isCorrect:true},showAnswers:true})), $=load(markup,null,false),renderedImages=$('img').map((_,el)=>$(el).attr('src')).get();
  if(q.graph?.sourceImage)assert.ok(renderedImages.includes(q.graph.sourceImage.src),`${q.id}: source graph`);
  if(/<table\b/.test(q.dragDropContentHtml||q.dropdownContentHtml||''))assert.ok($('table').length,`${q.id}: source interaction table`);
  if(['category_sort','math_drag_drop'].includes(q.type))for(const item of q.items){
   const pictures=images(item.html);if(pictures.length)for(const src of pictures)assert.ok(renderedImages.includes(src),`${q.id}: image choice ${item.id}`);
   else assert.ok(text(markup).includes(item.text.replace(/\s+/g,' ').trim()),`${q.id}: source choice ${item.id}`);
  }
  assert.equal($('.katex-error').length,0,q.id);count++;
 }
 assert.equal(count,400);
});

test('Form B hot text keeps its source box, wrapping spans, answer IDs and correction states',domOptions,()=>{
 const saved=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../server/data/exam-content.json')));
 const q=saved['2026-2027-form-b'].standaloneSection.questions[0];
 const render=props=>load(renderToStaticMarkup(React.createElement(componentApi.InlineTextSelection,{question:q,...props})),null,false);
 const active=render({answer:'B',onChange(){}});
 assert.equal(active('[data-boxed="true"]').length,1);
 assert.deepEqual(active('[data-choice-id]').toArray().map(el=>[el.name,active(el).attr('data-choice-id'),active(el).text()]),
  [['span','A','Institution, the'],['span','B','year. The'],['span','C','objects, including'],['span','D','Proclamation, written']]);
 assert.equal(active('[role="checkbox"][tabindex="0"]').length,4);
 assert.equal(active('[aria-checked="true"]').attr('data-choice-id'),'B');
 const review=render({answer:'B',correctIds:['A']});
 assert.equal(review('[aria-disabled="true"][tabindex="-1"]').length,4);
 assert.equal(review('.is-selected').attr('data-choice-id'),'B');
 assert.equal(review('.is-correct-answer').attr('data-choice-id'),'A');
 assert.equal(review('button').length,0,'Atomic buttons cannot wrap hot text across source lines');
});

test('Liam stamps dropdowns retain inline controls, source widths and equation groups without whitespace br tags',domOptions,()=>{
 const saved=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../server/data/exam-content.json')));
 const q=saved['2026-2027-form-a'].mathSection.questions[7];
 const markup=renderToStaticMarkup(React.createElement(componentApi.ExamMathQuestion,{question:q,onChange(){}})), $=load(markup,null,false);
 assert.equal($('select').length,3);
 assert.equal($('.exam-rich-response-template br').length,0);
 assert.deepEqual($('[data-dropdown-width]').map((_,e)=>$(e).attr('data-dropdown-width')).get(),['60','90','60']);
 assert.equal($('[data-no-break="true"]').length,2);
 assert.deepEqual(plain(q.dropdowns.map(d=>d.id)),['answer-1','answer-2','answer-3']);
 assert.deepEqual(plain(q.dropdowns.map(d=>d.correctChoiceId)),['option-2','option-3','option-3']);
 const fixture={...q,dropdownContentHtml:'<p>One\n<span>\n{{answer-1}}\n</span><br>Two</p>'};
 const actual=load(renderToStaticMarkup(React.createElement(componentApi.ExamMathQuestion,{question:fixture,onChange(){}})),null,false);
 assert.equal(actual('.exam-rich-response-template br').length,1,'Authored br stays, HTML whitespace does not become br');
});
