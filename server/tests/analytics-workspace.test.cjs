const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {createExamResult}=require('../src/shared/examGrading.ts');
const {buildStudentAnalytics}=require('../../client/src/lib/studentAnalytics.ts');
const {filterAnalysisInputs,defaultAnalysisFilters,evidenceSummary,detailedGroups,rosterAnalysis,analysisDay,analyticsCsv}=require('../../client/src/lib/analyticsDetails.ts');
const completion=require('../src/shared/examCompletion.ts');
const sessions=require('../../client/src/lib/examSessionProgress.ts'),timer=require('../../client/src/lib/examTimer.ts');
const q=(id,topic='Inference')=>({id,type:'multiple_choice',topic,prompt:'Which claim is supported?',choices:[{id:'A',text:'Supported'},{id:'B',text:'Unsupported'}],correctChoiceId:'A'});
const content={assessmentId:'analytical-exam',title:'Analytical exam',passageSets:[{id:'p',directions:{title:'Read',subject:'English',body:''},questionCount:2,passage:{id:'p',title:'Passage',lines:[{text:'Evidence.'}]},questions:[q('e1'),q('e2')]}],mathSection:{id:'math',questions:[q('m1','Algebra'),q('m2','Geometry')]}};
const entry=(answers,sections=['english','math'],date='2026-10-01T12:00:00Z',attemptId)=>{const result={...createExamResult(content,answers,sections),completedAt:date,...(attemptId?{attemptId}:{})};return{result,content,subjects:result.subjects,passages:result.passages};};

test('Math can be submitted with verified blanks while English drafts remain pending, then English completes the same exam',()=>{
 const math=sessions.prepareSectionSubmission(content,{m1:'A',e1:'B'},[],'math');
 assert.equal(math.answers.m2,'');assert.equal(Object.hasOwn(math.answers,'e2'),false);assert.equal(math.answers.e1,'B');
 const partial=entry(math.answers,math.completedSections);assert.equal(partial.result.correct,1);assert.equal(partial.result.total,2);
 assert.equal(completion.isFullExamResult(partial.result),false);assert.equal(completion.examScopeLabel(partial.result),'Math only');
 assert.deepEqual(sessions.getCurrentCompletedSections(content,math),['math']);assert.equal(sessions.getNextExamSubject('math',math.completedSections),'english');
 const analysis=buildStudentAnalytics([partial]);assert.equal(analysis.exams[0].english,null);assert.equal(analysis.exams[0].math,50);assert.equal(analysis.evidence.some(row=>row.section==='english'),false);
 const full=sessions.prepareSectionSubmission(content,{...math.answers,e2:'A'},math.completedSections,'english');
 assert.equal(full.answers.m1,'A');assert.equal(full.answers.m2,'');assert.equal(completion.isFullExamResult(entry(full.answers,full.completedSections).result),true);
});

test('a class break consumes none of the shared three-hour budget',()=>{
 const start=timer.createExamTimerState(1_000),pause=timer.pauseExamTimer(start,3_601_000),resume=timer.resumeExamTimer(pause,90_001_000);
 assert.equal(timer.getExamTimerDisplay(pause,90_001_000).text,'2:00:00');
 assert.equal(timer.getExamTimerDisplay(resume,92_701_000).text,'1:15:00');
 assert.equal(timer.getExamElapsedMs(resume,92_701_000),105*60*1000);
});

test('frozen result content prevents later edits from reinterpreting earlier answers',()=>{
 const saved=entry({e1:'A',m1:'A'});const changed=structuredClone(content);changed.passageSets[0].questions[0].correctChoiceId='B';changed.passageSets[0].questions.push(q('new-question'));
 const data=buildStudentAnalytics([{...saved,content:changed}]);assert.equal(data.evidence.find(row=>row.question.id==='e1').status,'Correct');assert.equal(data.evidence.some(row=>row.question.id==='new-question'),false);assert.equal(data.evidence[0].provenance,'Stored content snapshot');
});

test('roster and detail use the same completeness rule and retain independent Math results',()=>{
 const english=entry({e1:'A'},['english']),math=entry({m1:'A',m2:'A'},['math']),full=entry({e1:'A',e2:'A',m1:'B',m2:'B'});
 const misleading={...english,result:{...english.result,completionStatus:'complete'}};
 assert.equal(completion.isFullExamResult(misleading.result),false);
 const roster=rosterAnalysis([misleading,math,full]);assert.equal(roster.average,50);assert.equal(roster.full.length,1);
 assert.equal(rosterAnalysis([math]).average,null);assert.equal(rosterAnalysis([math]).math.math,100);
});

test('date and section filters reconcile numerators; missing dates are not assigned to a window',()=>{
 const full=entry({e1:'A',e2:'A',m1:'A'},undefined,'2026-10-10T12:00:00Z');full.result.sectionCompletedAt={math:'2026-09-01T12:00:00Z',english:'2026-10-10T12:00:00Z'};
 const filtered=filterAnalysisInputs([full],{...defaultAnalysisFilters,from:'2026-09-01',to:'2026-09-30'});assert.equal(filtered[0].result.correct,1);assert.equal(filtered[0].result.total,2);assert.deepEqual(filtered[0].result.completedSections,['math']);
 assert.equal(buildStudentAnalytics(filtered).evidence.length,2);assert.equal(analysisDay('2026-10-02T01:00:00Z'),'2026-10-01');assert.equal(analysisDay('2026-10-02'),'2026-10-02');
 const unknown=entry({});unknown.result.completedAt='bad';assert.equal(filterAnalysisInputs([unknown],{...defaultAnalysisFilters,from:'2026-09-01'}).length,0);
 const scopeUnknown={result:{assessmentId:'legacy',correct:4,total:10,completedAt:'2026-09-10'},subjects:[],passages:[]};
 assert.equal(filterAnalysisInputs([scopeUnknown],defaultAnalysisFilters).length,1);assert.equal(completion.examScopeLabel(scopeUnknown.result),'Scope unknown');
 assert.equal(filterAnalysisInputs([scopeUnknown],{...defaultAnalysisFilters,section:'math'}).length,0);
});

test('stable attempt IDs remove mirrors, prefer granular evidence and preserve genuine repeated attempts',()=>{
 const first=entry({e1:'B'},['english'],'2026-10-01T12:00:00Z','first'),later=entry({e1:'A'},['english'],'2026-10-08T12:00:00Z','later');
 const summary={...first,result:{...first.result,answers:undefined}};
 const all=buildStudentAnalytics([summary,first,structuredClone(first),later]);assert.equal(all.exams.length,2);assert.equal(all.evidence.length,4);
 assert.equal(buildStudentAnalytics([first,later],'first').evidence.filter(row=>row.question.id==='e1')[0].status,'Incorrect');
 assert.equal(buildStudentAnalytics([first,later],'latest').evidence.filter(row=>row.question.id==='e1')[0].status,'Correct');
 assert.equal(buildStudentAnalytics([first,later],'repeats').evidence.length,2);
});

test('activity types, recorded grades, small samples and timing coverage remain distinguishable',()=>{
 const exam=entry({e1:'A',e2:'B'},['english'],'2026-10-01T12:00:00Z','exam');
 const practice={...exam,kind:'practice',sourceLabel:'Question-bank practice',result:{...exam.result,attemptId:'practice'},responses:[{questionId:'e1',selectedAnswerId:'A',correctAnswerId:'B',isCorrect:false,timeSpentSeconds:0},{questionId:'e2',selectedAnswerId:'B',correctAnswerId:'A',isCorrect:false,timeSpentSeconds:14}]};
 const data=buildStudentAnalytics([exam,practice]),groups=detailedGroups(data.evidence,'skill');assert.equal(groups.length,2);assert.equal(groups.find(group=>group.kind==='practice').correct,0);
 const stats=evidenceSummary(data.evidence);assert.equal(stats.timed,1);assert.equal(stats.median,14);assert.equal(stats.unique,2);assert.equal(stats.total,4);assert.equal(stats.attemptedAccuracy,25);
});

test('CSV export quotes raw structured responses and prevents spreadsheet formula execution',()=>{
 const csv=analyticsCsv(['Answer','Raw'],[['=HYPERLINK("x")',{slot:'A'}],['line\nquote"',null]]);assert.match(csv,/'=HYPERLINK/);assert.match(csv,/""slot""/);assert.match(csv,/line\nquote""/);
});
