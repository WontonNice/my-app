const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {applyExamPresentation}=require('../src/shared/examPresentation.ts');
const {isExamQuestionCorrect}=require('../src/shared/examGrading.ts');
const base={id:'shared-q',type:'multiple_choice',prompt:'Which is best?',choices:[{id:'A',text:'2 1/2 hr'},{id:'B',text:'3 hr'}],correctChoiceId:'B',topic:'Rate'};
const canonical={assessmentId:'source-a',title:'Form A',passageSets:[],mathSection:{id:'math',label:'Math',directions:{},questionCount:1,questions:[base]}};
test('source display corrections preserve the canonical record, IDs, grading and historical snapshots',()=>{
  const snapshot=structuredClone(canonical),incoming={...structuredClone(base),promptHtml:'Which is <strong>best</strong>?',choices:[{id:'A',text:'2 1/6 hr',html:'2 \\(\\frac{1}{6}\\) hr'},{id:'B',text:'3 hr'}],correctChoiceId:'A'};
  const rendered=applyExamPresentation({...canonical,presentationOverrides:{questions:{'shared-q':{base:structuredClone(base),question:incoming}}}});
  const q=rendered.mathSection.questions[0];
  assert.equal(q.choices[0].text,'2 1/6 hr');assert.match(q.promptHtml,/<strong>best<\/strong>/);
  assert.equal(q.correctChoiceId,'B');assert.equal(q.id,'shared-q');
  assert.equal(isExamQuestionCorrect(q,'B'),true);assert.equal(isExamQuestionCorrect(q,'A'),false);
  assert.deepEqual(canonical,snapshot);
});
test('a later canonical content edit invalidates the source display snapshot; classification edits do not',()=>{
  const overrides={questions:{'shared-q':{base:structuredClone(base),question:{...base,promptHtml:'Source <em>best</em>'}}}};
  const edited={...canonical,mathSection:{...canonical.mathSection,questions:[{...base,prompt:'Revised wording'}]},presentationOverrides:overrides};
  assert.equal(applyExamPresentation(edited).mathSection.questions[0].prompt,'Revised wording');
  assert.equal(applyExamPresentation(edited).mathSection.questions[0].promptHtml,undefined);
  const classified={...canonical,mathSection:{...canonical.mathSection,questions:[{...base,topic:'New skill'}]},presentationOverrides:overrides};
  assert.equal(applyExamPresentation(classified).mathSection.questions[0].topic,'New skill');
  assert.ok(applyExamPresentation(classified).mathSection.questions[0].promptHtml);
});
test('passage appearances preserve the shared library and invalidate on later passage edits',()=>{
  const passage={id:'shared',title:'Poem',lines:[{text:'First line'},{text:'Second line'}]};
  const c={...canonical,passageSets:[{id:'set',passage,questions:[base]}],presentationOverrides:{passages:{shared:{baseLines:structuredClone(passage.lines),passage:{...passage,lines:[{text:'First line',html:'<em>First line</em>'},{text:'Second line',align:'indent'}]}}}}};
  assert.equal(applyExamPresentation(c).passageSets[0].passage.lines[1].align,'indent');
  assert.equal(passage.lines[1].align,undefined);
  passage.lines[0].text='Edited line';
  assert.equal(applyExamPresentation(c).passageSets[0].passage.lines[0].text,'Edited line');
});
