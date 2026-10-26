const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly:true, project:path.resolve(__dirname,'../server/tsconfig.json'), compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'} });
const { parseInlineDropdownTemplate } = require('../client/src/lib/inlineDropdownTemplate.ts');
const { content20262027FormAMathSection } = require('../client/src/content/exams/mathSets/2026-2027-form-aMath.ts');
const { isExamQuestionCorrect } = require('../server/src/shared/examGrading.ts');
const { teacherNavItems, teacherStudyPreview } = require('../client/src/lib/teacherNavigation.ts');
const q = content20262027FormAMathSection.questions.find(q=>q.id==='2026-2027-form-a-math-item-8');
test('question 8 exposes every dropdown even inside inline math and keeps the equation fragments',()=>{
 const parts=q.dropdownContent.flatMap(parseInlineDropdownTemplate);
 assert.deepEqual(parts.filter(p=>p.kind==='dropdown').map(p=>p.value),q.dropdowns.map(d=>d.id));
 assert.deepEqual(parts.filter(p=>p.kind==='math').map(p=>p.value),['L=','K','L-8=']);
 assert.ok(!parts.filter(p=>p.kind==='math').some(p=>p.value.includes('{{')));
 const answer=Object.fromEntries(q.dropdowns.map(d=>[d.id,d.correctChoiceId]));
 assert.equal(isExamQuestionCorrect(q,answer),true);
 for(const d of q.dropdowns){ const missing={...answer};delete missing[d.id];assert.equal(isExamQuestionCorrect(q,missing),false); assert.equal(isExamQuestionCorrect(q,{...answer,[d.id]:d.options.find(o=>o.id!==d.correctChoiceId).id}),false); }
});
test('plain dropdowns, adjacent slots and ordinary math remain intact',()=>{
 assert.deepEqual(parseInlineDropdownTemplate('A {{one}}{{two}} B').filter(p=>p.kind==='dropdown').map(p=>p.value),['one','two']);
 assert.deepEqual(parseInlineDropdownTemplate('\\(\\frac{1}{2}\\)')[0],{kind:'math',value:'\\frac{1}{2}',display:false});
 assert.deepEqual(parseInlineDropdownTemplate('\\[x={{one}}\\]').map(p=>p.kind),['math','dropdown']);
});
test('teacher navigation includes stable study hall and math entry points with authorized preview context',()=>{
 assert.equal(new Set(teacherNavItems.map(n=>n.id)).size,teacherNavItems.length);
 assert.equal(teacherNavItems.find(n=>n.id==='study-hall').href,'/teacher/study-hall');
 assert.equal(teacherNavItems.find(n=>n.id==='math').href,'/teacher/math-command');
 const url=new URL(teacherStudyPreview('/study-hall/shsat/materials?subject=math'),'https://example.test');
 assert.equal(url.searchParams.get('subject'),'math');assert.equal(url.searchParams.get('preview'),'teacher');assert.equal(url.searchParams.get('teacherTools'),'1');assert.equal(url.searchParams.get('returnTo'),'/teacher/study-hall');
});
