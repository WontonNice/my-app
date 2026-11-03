const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {groupPassageBooks,gradeLibraryBook,verifiedLibraryVersions}=require('../src/shared/libraryBooks.ts');
const {inventory}=require('../src/shared/learningPlan.ts');
const {isFullExamResult,examScopeLabel}=require('../src/shared/examCompletion.ts');
const {buildStudentAnalytics,progression,mergeAnalyticsInputs}=require('../../client/src/lib/studentAnalytics.ts');
const {evidenceSummary}=require('../../client/src/lib/analyticsDetails.ts');
const {passageFamilies}=require('../../client/src/lib/passageFamilies.ts');
const {reviewPriorities}=require('../../client/src/lib/sessionPreparation.ts');
const q=(id,prompt=id)=>({id,type:'multiple_choice',topic:'Inference',prompt,choices:[{id:'A',text:'Yes'},{id:'B',text:'No'}],correctChoiceId:'A'});
const set=(id,questions,text='The same underlying passage.')=>({id,passage:{id,title:'Shared title',lines:[{text}],versionLabel:id},questions,questionCount:questions.length,directions:{body:'Read',title:'Reading',subject:'English'}});
const content=id=>({id,kind:'passage',title:'Shared title',subject:'English',aliases:[id,'book-a'],skills:[],questionCount:2});

test('authored catalog cache refreshes on export and cannot be mutated by a caller', () => {
 const {getExamContent}=require('../src/lib/examContent.ts'),fs=require('node:fs');
 const read=fs.readFileSync,stat=fs.statSync; let revision=1,reads=0;
 const target=value=>String(value).replaceAll('\\','/').endsWith('/data/exam-content.json');
 fs.statSync=(file,...args)=>target(file)?{mtimeMs:revision,size:100}:stat(file,...args);
 fs.readFileSync=(file,...args)=>{if(!target(file))return read(file,...args);reads++;return JSON.stringify({fixture:{assessmentId:'fixture',title:'Revision '+revision,passageSets:[]}});};
 try {const first=getExamContent('fixture');first.title='Local mutation';assert.equal(getExamContent('fixture').title,'Revision 1');assert.equal(reads,1);revision=2;assert.equal(getExamContent('fixture').title,'Revision 2');assert.equal(reads,2);assert.equal(getExamContent('missing'),null);} finally {fs.readFileSync=read;fs.statSync=stat;}
});

test('combined attempts freeze exact membership and compute different version scores without alias fan-out',()=>{
 const book=groupPassageBooks([set('a',[q('one'),q('two')]),set('b',[q('copy','one'),q('three'),q('four')])])[0];
 const stats=gradeLibraryBook(book,book.passageSet.questions.map(question=>({questionId:question.id,selectedAnswerId:question.id==='one'?'B':'A'})));
 const scores=verifiedLibraryVersions(stats);assert.deepEqual(scores.map(({contentId,correct,total})=>({contentId,correct,total})),[{contentId:'a',correct:1,total:2},{contentId:'b',correct:2,total:3}]);
 book.passageSet.questions[0].prompt='Edited after submission';assert.equal(stats[0].questionSnapshot.prompt,'one');
 assert.deepEqual(verifiedLibraryVersions(stats.map(({questionSnapshot,passageSnapshot,versionCoverage,...legacy})=>legacy)),[]);
 assert.deepEqual(verifiedLibraryVersions(stats.slice(1)),[]);
});
test('deduplicated questions cannot certify exposure to a revised passage that was never displayed',()=>{
 const book=groupPassageBooks([set('a',[q('one')]),set('b',[q('copy','one')],'A different revision.')])[0];
 const stats=gradeLibraryBook(book,[{questionId:'one',selectedAnswerId:'A'}]);assert.deepEqual(verifiedLibraryVersions(stats).map(item=>item.contentId),['a']);
});
test('legacy related exposure does not copy scores, completion, or invented assignment dates',()=>{
 const rows=inventory([content('a'),content('b')],[],['a','b'].map(contentId=>({contentId,at:'2026-10-01',coverage:'related',correct:8,total:11,source:'Saved library attempt',reference:'combined'})));
 for(const row of rows){assert.equal(row.hasCompleted,false);assert.equal(row.latestScore,null);assert.equal(row.lastCompletedAt,null);assert.equal(row.hasBeenAssigned,false);assert.equal(row.status,'Completion unverified');}
 const old={id:'task',studentId:'student',kind:'passage',contentId:'a',status:'completed',assignedAt:'2026-09-01',createdAt:'2026-09-01',completedAt:'2026-10-01',completion:{source:'library',at:'2026-10-01',reference:'combined',correct:8,total:11}};
 assert.equal(inventory([content('a')],[old],rows[0].evidence)[0].hasCompleted,false);assert.equal(old.status,'completed');
 assert.equal(inventory([content('untouched')],[],[],false)[0].status,'History unavailable');
});
test('passage families without a library book require text identity or explicit confirmation',()=>{
 const rows=['a','b','c'].map(id=>({content:{...content(id),aliases:[id],passageTextKey:id==='c'?'revised':'exact'},hasCompleted:id==='a',status:id==='a'?'Completed':'Never assigned',historyComplete:true}));
 assert.equal(passageFamilies(rows).length,2);assert.equal(passageFamilies(rows)[0].completed.length,1);assert.equal(rows[1].hasCompleted,false);
 assert.equal(passageFamilies(rows,[{a:'b',b:'c',relation:'revised'}]).length,1);
 assert.equal(passageFamilies(rows.map(row=>({...row,content:{...row.content,passageTextKey:undefined}}))).length,3);
});
test('full-exam classification needs both scored subjects and respects frozen exam membership',()=>{
 const english={subject:'English Language Arts',correct:30,total:40,topics:[]},math={subject:'Mathematics',correct:29,total:50,topics:[]};
 const result={completionStatus:'complete',completedSections:['english','math'],correct:59,total:90,subjects:[english,math]};
 assert.equal(isFullExamResult(result),true);assert.equal(isFullExamResult({...result,subjects:[english]}),false);assert.equal(examScopeLabel({...result,subjects:[english]}),'English only');
 assert.equal(isFullExamResult({...result,analysisContent:{passageSets:[{questions:[q('one')]}],mathSection:{questions:[q('two')]}}}),false);
 assert.equal(isFullExamResult({...result,source:'answer_sheet'}),false);
 assert.equal(isFullExamResult({...result,source:'answer_sheet',assessmentPurpose:'full_exam'}),true);
});
test('points, fully-correct questions and pending grading stay distinct in analytics',()=>{
 const subjects=[{subject:'English Language Arts',correct:1,total:2,topics:[]},{subject:'Mathematics',correct:1,total:2,topics:[]}];
 const grade={earned:5,possible:8,pending:0,items:[{itemId:'a',status:'correct',earned:2,possible:2},{itemId:'b',status:'incorrect',earned:1,possible:2},{itemId:'c',status:'correct',earned:2,possible:2},{itemId:'d',status:'unanswered',earned:0,possible:2}]};
 const input={subjects,passages:[],result:{source:'answer_sheet',assessmentPurpose:'full_exam',completedSections:['english','math'],completionStatus:'complete',correct:2,total:4,percentage:63,subjects,answerSheet:{grade,sections:[{id:"writing",title:"Revising and Editing",itemIds:["a"]},{id:"reading",title:"Reading Comprehension",itemIds:["b"]},{id:"math",title:"Mathematics",itemIds:["c","d"]}]}}};
 const exam=buildStudentAnalytics([input]).exams[0];assert.equal(exam.overall,50);assert.equal(exam.points.earned,5);assert.equal(exam.recordedCounts.partial,1);assert.equal(exam.recordedCounts.unanswered,1);assert.deepEqual(exam.sheetSections.map(section=>[section.title,section.correct,section.total,section.earned]),[["Revising and Editing",1,1,2],["Reading Comprehension",0,1,1],["Mathematics",1,2,2]]);
 const pending=buildStudentAnalytics([{...input,result:{...input.result,answerSheet:{grade:{...grade,pending:1,earned:null}}}}]).exams[0];assert.equal(pending.overall,null);assert.equal(pending.english,null);
 const stats=evidenceSummary([{status:'Pending',identity:'a'},{status:'Correct',identity:'b'}]);assert.equal(stats.accuracy,100);assert.equal(stats.pending,1);assert.equal(stats.total,1);
});
test('section recency uses section submission dates and one result never creates a trend',()=>{
 const inputs=['one','two'].map((id,index)=>({subjects:[{subject:'English Language Arts',correct:index+1,total:2,topics:[]}],passages:[],result:{assessmentId:id,completedAt:index?'2026-10-01':'2026-11-01',sectionCompletedAt:{english:index?'2026-10-01':'2026-09-01'},completedSections:['english'],completionStatus:'english_complete'}}));
 const exams=buildStudentAnalytics(inputs).exams;assert.equal(progression(exams,'english').latest.result.assessmentId,'two');assert.equal(progression(exams.slice(0,1),'english').change,null);
});
test('review-next priorities favor recent repeated evidence over stale or tiny samples',()=>{
 const now=Date.parse('2026-11-03');const skill=(key,date,questions,attempts)=>({key,label:key,history:Array.from({length:attempts},()=>({date,total:questions,correct:0})),evidence:Array.from({length:questions},(_,index)=>({identity:key+index,date,status:'Incorrect'}))});
 const priorities=reviewPriorities([skill('old','2026-07-01',10,3),skill('tiny','2026-10-30',2,1),skill('recurring','2026-10-10',8,3)],now);
 assert.equal(priorities[0].skill.key,'recurring');assert.equal(priorities[0].qualified,true);assert.equal(priorities[1].qualified,false);assert.equal(priorities.some(item=>item.skill.key==='old'),false);
});


test('authoritative current and archived history replace roster mirrors without duplicating attempts', () => {
  const item = (id, attemptId, origin) => ({ result: { assessmentId: id, attemptId }, origin, subjects: [], passages: [] });
  const initial = [item('exam', 'old'), item('offline', 'paper')];
  const current = item('exam', 'new', 'current'), archive = item('exam', 'old', 'archive');
  assert.deepEqual(mergeAnalyticsInputs(initial, [current, archive]), [initial[1], current, archive]);
  assert.deepEqual(mergeAnalyticsInputs([initial[0]], [archive]), [archive]);
});

test('inventory groups the reported passage versions by existing library membership',()=>{
 const catalog=require('../data/learning-catalog.json');
 for(const title of ['Find Time to Volunteer','Martial Arts for the Mind and Body','Moving through Mountains','Excerpt from “Scribe Like an Egyptian”']){
  const versions=catalog.filter(item=>item.title.toLowerCase()===title.toLowerCase());
  assert.ok(versions.length>=2,title);
  const rows=versions.map((content,index)=>({content,hasCompleted:index===0,status:index===0?'Completed':'Never assigned',historyComplete:true}));
  const families=passageFamilies(rows);
  assert.equal(families.length,1,title);
  assert.equal(families[0].versions.length,versions.length);
  assert.equal(families[0].completed.length,1);
  assert.equal(rows[1].hasCompleted,false);
 }
});
test('teacher-confirmed different passages override book grouping, including transitive joins',()=>{
 const rows=['a','b','c'].map(id=>({content:{...content(id),passageTextKey:id},hasCompleted:false,status:'Never assigned'}));
 const groups=passageFamilies(rows,[{a:'a',b:'b',relation:'different'}]);
 assert.equal(groups.length,2);
 assert.ok(groups.every(group=>!(group.versions.some(row=>row.content.id==='a')&&group.versions.some(row=>row.content.id==='b'))));
});
