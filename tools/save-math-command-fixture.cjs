// Preserve synthetic browser-test work across fixture restarts. No real data is read.
const fs=require('node:fs'),path=require('node:path');
const url=process.argv[2]||'http://127.0.0.1:4328',root=path.resolve(process.argv[3]);
(async()=>{
  let tables;
  const exported=await fetch(url+'/__qa/export');
  if(exported.headers.get('content-type')?.includes('json')){const value=await exported.json();if(!value.fixture)throw new Error('Not a QA fixture');tables=value.tables;}
  else {
    // Compatibility with the initial fixture version, which exposed saved student views.
    const state=await (await fetch(url+'/__qa/state')).json();if(!state.fixture)throw new Error('Not a QA fixture');
    const content=Object.values(JSON.parse(fs.readFileSync(path.join(root,'server/data/exam-content.json'),'utf8')))[0];
    tables=require('./math-command-fixture.cjs').database({content,questions:content.mathSection.questions}).tables;
    tables.student_assignments=state.assignments;
    for(const task of state.assignments){
      const response=await fetch(url+'/api/math-command/student/assignments/'+task.id,{headers:{authorization:'Bearer student'}});
      if(!response.ok)throw new Error('Cannot preserve assignment '+task.id);
      const view=await response.json();
      if(!view.result?.analysisContent)throw new Error('Initial fixture backup requires submitted practice');
      tables.student_practice_progress.push({user_id:task.student_id,topic_slug:task.content_id,updated_at:view.savedAt,progress:{revision:view.revision,startedAt:view.startedAt,savedAt:view.savedAt,status:view.status,answers:view.answers,content:view.result.analysisContent,result:view.result}});
      tables.student_exam_results.push({user_id:task.student_id,assessment_id:view.result.assessmentId,result:view.result,completed_at:view.result.completedAt,updated_at:view.savedAt});
    }
  }
  fs.writeFileSync(path.join(root,'qa-tables.json'),JSON.stringify(tables));
  console.log(`Preserved ${tables.student_assignments.length} synthetic assignments and ${tables.student_exam_results.length} synthetic result rows.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
