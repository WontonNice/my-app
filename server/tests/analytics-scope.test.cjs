const {test}=require('node:test'), assert=require('node:assert/strict'), path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {contentScope,evidenceArea,matchesContentSource}=require('../../client/src/lib/analyticsScope.ts');
const {detailedGroups}=require('../../client/src/lib/analyticsDetails.ts');
const {buildStudentAnalytics}=require('../../client/src/lib/studentAnalytics.ts');
const {createExamResult}=require('../src/shared/examGrading.ts');
const q=(id,topic='Inference',source)=>({id,topic,source,type:'multiple_choice',prompt:'Question',choices:[{id:'A',text:'Answer'}],correctChoiceId:'A'});
const set=(id,category,section='reading')=>({id,section,passage:{id,title:id,passageCategory:category,lines:[{text:'Text'}]},questions:[q(id)],questionCount:1,directions:{title:'Read'}});
const base={assessmentId:'test',title:'Test',passageSets:[set('official','official_handbook'),set('prestige','prestige')],standaloneSection:{id:'edit',label:'Revising / editing',directions:{title:'Revise'},questions:[q('edit','Punctuation')]}};

test('source filters include exact Official / Prestige union and keep mixed-exam standalone source unknown',()=>{
  const scope=contentScope(base);
  const rows=[...base.passageSets.flatMap(set=>set.questions.map(question=>({question,passage:set.passage}))),{question:base.standaloneSection.questions[0]}].map(row=>({...row,contentSource:scope.source(row)}));
  assert.deepEqual(rows.map(row=>row.contentSource),['official','prestige','unknown']);
  assert.deepEqual(rows.filter(row=>matchesContentSource(row,'official')).map(row=>row.question.id),['official']);
  assert.deepEqual(rows.filter(row=>matchesContentSource(row,'prestige')).map(row=>row.question.id),['prestige']);
  assert.equal(rows.filter(row=>matchesContentSource(row,'official_prestige')).length,2);
  assert.equal(rows.filter(row=>matchesContentSource(row,'unknown')).length,1);
});
test('standalone editing inherits consistently tagged exam source, while explicit question provenance takes priority',()=>{
  const content={...base,passageSets:[base.passageSets[1]]}, scope=contentScope(content);
  assert.equal(scope.source({question:q('edit','Punctuation')}),'prestige');
  assert.equal(scope.source({question:q('edit','Punctuation',{sourceFamily:'official_shsat'})}),'official');
  assert.equal(contentScope().source({question:q('unknown')}),'unknown');
});
test('recorded snapshot carries source and section into evidence without merging same-named reading and editing skills',()=>{
  const content={...base,passageSets:[set('reading','official_handbook'),set('editing','prestige','revising_editing_a')]};
  const result={...createExamResult(content,{reading:'A',editing:'A',edit:'A'},['english']),completedAt:'2026-10-01T12:00:00Z'};
  const data=buildStudentAnalytics([{result,content:{...content,passageSets:[]},subjects:result.subjects,passages:result.passages}]);
  assert.deepEqual(data.evidence.map(evidenceArea).sort(),['editing','editing','reading']);
  assert.equal(data.evidence.find(row=>row.question.id==='reading').contentSource,'official');
  assert.equal(detailedGroups(data.evidence,'skill').filter(group=>group.label.includes('Inference')).length,2);
  assert.equal(data.skills.filter(skill=>skill.label==='Inference').length,2);
});
test('practice without an editing section uses its named skill and retains unclassified topics',()=>{
  assert.equal(contentScope({passageSets:[],standaloneSection:{label:'Practice',directions:{title:'Practice'},questions:[q('a')]}}).areas.has('a'),false);
  assert.equal(evidenceArea({section:'english',question:q('a')}),'reading');
  assert.equal(evidenceArea({section:'english',question:q('a','Punctuation')}),'editing');
  assert.equal(evidenceArea({section:'math',question:q('a','Algebra')}),'math');
  assert.equal(evidenceArea({section:'english',question:q('a','New custom skill')}),'unclassified');
});
