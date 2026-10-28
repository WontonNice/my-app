const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { performance } = require('node:perf_hooks');
require('ts-node').register({ transpileOnly:true, project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'} });
const { buildMathCommandCatalog, queryMathCommandCatalog, summarizeMathCommandCatalog, findMathDuplicates, reviewMathQuestion, mathAnswerStatus, effectiveMathQuestion, normalizeMathDuplicateText, mathCatalogCsv } = require('../src/shared/mathCommandCatalog.ts');
const { defaultMathDiagnosticSkills, validateMathDiagnosticSkills, mathStandardsReferences } = require('../src/shared/mathCommandTaxonomy.ts');
const taxonomy = {...JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../tools/math-topics.json'),'utf8')),skills:defaultMathDiagnosticSkills};
function record(id, overrides={}) {
  return {id,question:{id,type:'multiple_choice',topic:'Algebra',subtopic:'Equations & Systems',prompt:`Solve the linear equation ${id}: 2x + 3 = 13.`,choices:[{id:'A',text:'5'},{id:'B',text:'10'}],correctChoiceId:'A',explanation:'Subtract 3 and divide both sides by 2.'},sources:[{assessmentId:'2026-2027-form-d',title:'2026–2027 Form D',number:5,year:'2026-2027',form:'D',source:'Official'}],metadata:{difficulty:'medium',diagnosticSkill:'linear-equations',reviewStatus:'reviewed'},...overrides};
}

test('combined medium/hard linear-equation filters preserve source, readiness, standard verification and sort',()=>{
  const rows=[record('q1'),record('q2',{metadata:{difficulty:'hard',diagnosticSkill:'linear-equations',reviewStatus:'reviewed',standards:[{code:'NY-8.EE.7',verified:true}]}}),record('q3',{metadata:{difficulty:'easy',diagnosticSkill:'linear-equations'}}),record('q4',{metadata:{difficulty:'hard',diagnosticSkill:'systems-equations'}})];
  const catalog=buildMathCommandCatalog(rows,taxonomy);
  const result=queryMathCommandCatalog(catalog,{category:['Algebra'],subcategory:['Equations & Systems'],diagnosticSkill:['linear-equations'],difficulty:['medium','hard'],year:['2026-2027'],form:['D'],status:'ready',sort:'difficulty',direction:'desc'});
  assert.deepEqual(result.items.map(r=>r.id),['q2','q1']);
  assert.equal(queryMathCommandCatalog(catalog,{standard:['NY-8.EE.7']}).total,1);
  rows[1].metadata.standards[0].verified=false;
  assert.equal(queryMathCommandCatalog(buildMathCommandCatalog(rows,taxonomy),{standard:['NY-8.EE.7']}).total,0);
});

test('bulk metadata overlays 30 questions without changing canonical wording, answers or sources',()=>{
  const records=Array.from({length:30},(_,i)=>record(`q${i}`));
  const before=JSON.stringify(records.map(r=>({question:r.question,sources:r.sources})));
  records.forEach(r=>{r.metadata={...r.metadata,category:'Geometry',subcategory:'Area & Perimeter',diagnosticSkill:'area-perimeter',difficulty:'hard'};});
  const catalog=buildMathCommandCatalog(records,taxonomy);
  assert.equal(queryMathCommandCatalog(catalog,{category:['Geometry'],subcategory:['Area & Perimeter'],difficulty:['hard']}).total,30);
  assert.equal(JSON.stringify(records.map(r=>({question:r.question,sources:r.sources}))),before);
  assert.equal(effectiveMathQuestion(records[0]).topic,'Geometry');
  assert.equal(records[0].question.topic,'Algebra');
});

test('coverage counts include zero inventory and report teacher-defined difficulty shortages',()=>{
  const records=[record('q1'),record('q2',{metadata:{difficulty:'hard',reviewStatus:'reviewed'}}),record('q3',{metadata:{}})];
  const summary=summarizeMathCommandCatalog(buildMathCommandCatalog(records,taxonomy),taxonomy,{defaultPerDifficulty:2,overrides:[{category:'Algebra',subcategory:'Equations & Systems',difficulty:'hard',minimum:4}]});
  assert.equal(summary.total,3);assert.equal(summary.ready,2);assert.equal(summary.needsReview,1);
  assert.equal(summary.categories,taxonomy.categories.length);assert.equal(summary.subcategories,taxonomy.categories.reduce((sum,category)=>sum+category.topics.length,0));
  const row=summary.coverage.find(r=>r.category==='Algebra'&&r.subcategory==='Equations & Systems');
  assert.deepEqual(row.difficulties,{easy:0,medium:1,hard:1,expert:0,unclassified:1});
  assert.deepEqual(row.gaps.find(g=>g.difficulty==='hard'),{difficulty:'hard',available:1,target:4,shortage:3});
  assert.equal(summary.coverage.find(r=>r.subcategory==='Pythagorean Theorem').total,0);
});

test('review queue distinguishes absent metadata, answer errors, explicitly required diagrams and unsafe formatting',()=>{
  const r=record('q1',{sources:[],metadata:{requiresDiagram:true},question:{id:'q1',topic:'',subtopic:'',type:'multiple_choice',prompt:'What is shown?',choices:[{id:'A',text:'1'},{id:'B',text:'2'}],correctChoiceId:'C'}});
  const issues=reviewMathQuestion(r,taxonomy);
  for(const expected of ['missing_category','missing_subcategory','missing_difficulty','missing_source','missing_explanation','missing_diagram','invalid_answer'])assert.ok(issues.includes(expected),expected);
  assert.ok(!issues.includes('missing_answer'));
  r.question.correctChoiceId='';assert.ok(reviewMathQuestion(r,taxonomy).includes('missing_answer'));
  r.question.promptHtml='<p onclick="bad()">Question</p>';assert.ok(reviewMathQuestion(r,taxonomy).includes('invalid_formatting'));
  r.question.image={src:'/exam-images/a.png',alt:'A figure'};assert.ok(!reviewMathQuestion(r,taxonomy).includes('missing_diagram'));
});

test('math keys reject impossible configurations and numeric duplicate choices without solving symbolic questions',()=>{
  const q=record('q').question;q.choices=[{id:'A',text:'0.5'},{id:'B',text:'1/2'}];
  const numeric=mathAnswerStatus(q);assert.equal(numeric.valid,false);assert.match(numeric.signals[0],/same numeric value/);
  q.choices=[{id:'A',text:'9007199254740992'},{id:'B',text:'9007199254740993'}];assert.equal(mathAnswerStatus(q).valid,true);
  q.choices=[{id:'A',text:'1/3'},{id:'B',text:'0.3333333333333333'}];assert.equal(mathAnswerStatus(q).valid,true);
  q.choices=[{id:'A',math:'x+x',text:''},{id:'B',math:'2x',text:''}];assert.equal(mathAnswerStatus(q).valid,true);
  const graph={...q,type:'graph_point_select',graph:{points:[{id:'p1',x:0,y:0}]},correctPointIds:['p2']};assert.equal(mathAnswerStatus(graph).valid,false);
  assert.equal(mathAnswerStatus({...q,type:'expression_entry',correctTextAnswers:[String.raw`\frac{1}{\placeholder{}}`]}).valid,false);
  assert.equal(mathAnswerStatus({...q,type:'expression_entry',correctTextAnswers:[String.raw`\frac{1}{25}\cdot\frac{1}{100}`]}).valid,true);
});

test('duplicate detection separates exact repeats, numeric templates, source conflicts and preserves inequalities',()=>{
  const a=record('a');a.question.prompt='A classroom has 25 students and 5 tables. How many students sit at each table?';
  const b=structuredClone(a);b.id='b';b.question.id='b';b.sources[0].assessmentId='other-test';b.question.promptHtml='<p>A classroom has 25 students and 5 tables. How many students sit at each table?</p>';
  const c=structuredClone(a);c.id='c';c.question.id='c';c.question.prompt='A classroom has 30 students and 5 tables. How many students sit at each table?';
  const d=record('d');d.metadata={source:'Official',sourceQuestionId:'item-x'};
  const e=record('e');e.metadata={source:'Official',sourceQuestionId:'item-x'};e.question.prompt='A different question entirely.';
  const result=findMathDuplicates([a,b,c,d,e]);
  assert.ok(result.groups.some(g=>g.kind==='exact'&&g.questionIds.join(',')==='a,b'));
  assert.ok(result.groups.some(g=>g.kind==='template'&&g.questionIds.includes('c')));
  assert.ok(result.groups.some(g=>g.kind==='possible'&&g.reason.startsWith('Same teacher-entered')));
  assert.notEqual(normalizeMathDuplicateText('x < 5 and x > 2'),normalizeMathDuplicateText('x > 5 and x < 2'));
  assert.notEqual(normalizeMathDuplicateText('Solve X=2'),normalizeMathDuplicateText('Solve x=2'));
});

test('unknown performance is not mistaken for zero attempts or never assigned; null sorts last both ways',()=>{
  const records=[record('a'),record('b'),record('c')];
  const performance={b:{attempts:0,uniqueStudents:0,correct:0,incorrect:0,unanswered:0,accuracy:null,firstAttemptAccuracy:null,assignmentCount:0},c:{attempts:10,uniqueStudents:6,correct:4,incorrect:5,unanswered:1,accuracy:40,firstAttemptAccuracy:50,assignmentCount:2}};
  const catalog=buildMathCommandCatalog(records,taxonomy,{performance});
  assert.deepEqual(queryMathCommandCatalog(catalog,{status:'never_assigned'}).items.map(r=>r.id),['b']);
  assert.deepEqual(queryMathCommandCatalog(catalog,{status:'previously_assigned'}).items.map(r=>r.id),['c']);
  for(const direction of ['asc','desc'])assert.equal(queryMathCommandCatalog(catalog,{sort:'accuracy',direction}).items[0].id,'c');
  assert.equal(catalog.rows.find(r=>r.id==='a').performance,null);
});

test('collections and unseen exclusions use stable existing IDs, and CSV is spreadsheet-safe',()=>{
  const rows=[record('q1'),record('q2'),record('q3')];rows[0].metadata.source='=HYPERLINK("bad")';
  const catalog=buildMathCommandCatalog(rows,taxonomy);
  assert.deepEqual(queryMathCommandCatalog(catalog,{collectionQuestionIds:['q1','q2'],excludeQuestionIds:['q2']}).items.map(r=>r.id),['q1']);
  const csv=mathCatalogCsv(catalog.rows);assert.match(csv,/question_id/);assert.match(csv,/'=HYPERLINK/);assert.match(csv,/q1/);
});

test('diagnostic skill defaults preserve existing taxonomy and prerequisites cannot contain cycles',()=>{
  assert.equal(validateMathDiagnosticSkills(defaultMathDiagnosticSkills,taxonomy).length,41);
  assert.equal(mathStandardsReferences.length,10);
  assert.ok(defaultMathDiagnosticSkills.every(s=>s.standardReferences.length===0));
  const skills=structuredClone(defaultMathDiagnosticSkills);
  skills.find(s=>s.id==='integer-operations').prerequisiteIds=['linear-equations'];
  assert.throws(()=>validateMathDiagnosticSkills(skills,taxonomy),/cycle/);
  assert.throws(()=>validateMathDiagnosticSkills([{...skills[0],prerequisiteIds:['missing']}],taxonomy),/Unknown prerequisite/);
});

test('5,000-question catalog uses bounded candidate comparisons and paginated results',()=>{
  const rows=Array.from({length:5000},(_,i)=>record(`q${i}`,{question:{...record(`q${i}`).question,prompt:`Item ${i}: Which value solves the equation x + 7 = ${i+20}?`}}));
  const started=performance.now();
  const catalog=buildMathCommandCatalog(rows,taxonomy);
  const page=queryMathCommandCatalog(catalog,{difficulty:['medium'],page:25,pageSize:100,sort:'id'});
  assert.equal(page.items.length,100);assert.equal(page.total,5000);assert.equal(page.pages,50);
  assert.ok(catalog.duplicateSearch.comparedPairs<5000*100,JSON.stringify(catalog.duplicateSearch));
  assert.ok(performance.now()-started<10000,`Catalog took ${performance.now()-started} ms`);
});
