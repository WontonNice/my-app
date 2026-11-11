const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const timer=require('../../client/src/lib/examTimer.ts');
const reset={id:'fresh-reset',resetTimer:true,sections:['english','math'],remainingSections:['english','math'],timerState:{startedAt:1000,pausedAt:1000,totalPausedMs:0}};
const oldResult={timerState:{startedAt:1000,pausedAt:1000+170*60000,totalPausedMs:0}};

test('student preview shows the reset three hours instead of an older result or browser timer',()=>{
  global.window={localStorage:{getItem(){throw new Error('Preview must not read a device timer');},setItem(){throw new Error('Preview must not change a device timer');}}};
  try {
    const preview=timer.createExamPreviewTimer(reset,oldResult,20000000);
    assert.equal(timer.getExamTimerDisplay(preview,30000000).text,'3:00:00');
    const resumed=timer.resumeExamTimer(preview,20000000);
    assert.equal(timer.getExamTimerDisplay(resumed,20060000).text,'2:59:00');
    assert.equal(reset.timerState.pausedAt,1000);
    assert.equal(timer.getExamTimerDisplay(oldResult.timerState).text,'0:10:00');
  } finally {delete global.window;}
});

test('preview uses the latest matching submission timer and isolates students, consumed grants and revocations',()=>{
  const latest={...oldResult,reentryGrantId:reset.id};
  assert.equal(timer.getExamTimerDisplay(timer.createExamPreviewTimer(reset,latest)).text,'0:10:00');
  assert.equal(timer.getExamTimerDisplay(timer.createExamPreviewTimer({...reset,remainingSections:[]},oldResult)).text,'0:10:00');
  assert.equal(timer.getExamTimerDisplay(timer.createExamPreviewTimer({...reset,revokedAt:'2026-11-11'},oldResult)).text,'0:10:00');
  assert.equal(timer.getExamTimerDisplay(timer.createExamPreviewTimer(undefined,null)).text,'3:00:00');
  assert.equal(timer.getExamTimerDisplay(timer.createExamPreviewTimer(undefined,{timerState:{startedAt:null}})).text,'3:00:00');
});

const apiId=require.resolve('../../client/src/lib/api.ts');
const calls=[];
let grant=reset;
require.cache[apiId]={id:apiId,filename:apiId,loaded:true,exports:{
  getStudentAssessment:async(token,id)=>({id,status:'open',canEditSubmittedSections:true,sectionAccess:{english:true,math:true}}),
  getTeacherExamReentry:async(...args)=>{calls.push(args);return {grant};},
}};
const {getExamAssessmentForView}=require('../../client/src/lib/examAssessmentView.ts');
test('account preview loads the selected student grant while actual student access uses its normal endpoint',async()=>{
  const preview=await getExamAssessmentForView('teacher-token','exam','selected-student');
  assert.deepEqual(calls,[['teacher-token','exam','selected-student']]);
  assert.equal(preview.reentry,reset);
  assert.equal(preview.canEditSubmittedSections,false);
  const student=await getExamAssessmentForView('student-token','exam');
  assert.equal(student.reentry,undefined);
  assert.equal(calls.length,1);
  grant={...reset,revokedAt:'2026-11-11'};
  assert.equal((await getExamAssessmentForView('teacher-token','exam','selected-student')).reentry,undefined);
});
