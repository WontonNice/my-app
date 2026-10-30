import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {disposableCopy,loadEditorService,typecheckAuthoredContent} from './source-exam-transfer.mjs';

const repository=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const chat=resolve(process.env.EDITOR_RECOVERY_CHAT_ROOT||join(repository,'..','2026-10-29','exams-couldn-t-be-loaded-try'));
const scratch=join(chat,'work','standalone-publication-integration');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function authoredSnapshot(root) {
  const files={};
  async function visit(directory) {for(const entry of await readdir(directory,{withFileTypes:true})) {const path=join(directory,entry.name);if(entry.isDirectory())await visit(path);else files[path.slice(root.length+1)]=digest(await readFile(path));}}
  await visit(join(root,'client/src/content'));
  files['server/data/assessments.json']=digest(await readFile(join(root,'server/data/assessments.json')));
  return files;
}

test('uploaded standalone English follows review, publication, retry, shared tags, and conflict protection', {timeout:600000}, async t=>{
  const liveBefore=await authoredSnapshot(repository);
  await mkdir(scratch,{recursive:true});
  const root=await disposableCopy(repository,scratch);
  let completed=false;
  t.after(async()=>{
    assert.deepEqual(await authoredSnapshot(repository),liveBefore,'Synthetic publication must not alter live authored content or assessments.');
    assert.equal(dirname(resolve(root)),resolve(scratch));
    if(completed)await rm(root,{recursive:true,force:true});
    else t.diagnostic('Failed disposable fixture retained for inspection: '+root);
  });
  const service=await loadEditorService(root,join(scratch,'service'));
  const titles=['Standalone upload route one','Standalone upload route two'];
  for(const title of titles)await service.createExam({title,examLabel:'Other exams',durationMinutes:30,description:'Disposable publication verification.'});
  let app=await service.getState();
  const exams=titles.map(title=>app.assessments.find(a=>a.title===title));
  assert.ok(exams.every(Boolean));
  const payload={
    format:'nathan-tutors-official-passage-v1',
    source:{sourceFamily:'sat_crash_course',sourceFormat:'web',playerProfile:'sat_crash_course',sourceId:'standalone-route-fixture'},
    englishQuestions:[{id:'standalone-route-fixture-47',type:'multiple_choice',topic:'Punctuation',prompt:'Which punctuation is correct?',promptHtml:'<p>Which punctuation is <strong>correct</strong>?</p>',stimulus:'A synthetic complete sentence.',stimulusHtml:'<p>A <em>synthetic</em> complete sentence.</p>',choices:[{id:'A',text:':'},{id:'B',text:';'},{id:'C',text:','},{id:'D',text:'—'}],correctChoiceId:'B',explanation:'The supplied fixture key is B.',review:{sourceQuestion:'47',classificationReviewed:false,expectedChoiceCount:4,warnings:[]}}],
    review:{sourceReviewed:false,completenessReviewed:false,expectedQuestionCount:1,warnings:[]},
  };
  let drafts=await service.documentDrafts.import(payload);
  const entryId=drafts.lastImport.entryIds[0];
  assert.equal(drafts.entries.find(e=>e.id===entryId).kind,'standalone');
  await assert.rejects(service.publishDocumentStandalone({entryId,assessmentId:exams[0].id,revision:drafts.revision}),/Verify the complete source transcription|Confirm all requested pages/);
  async function reviewed(id) {
    drafts=await service.documentDrafts.read();
    const entry=structuredClone(drafts.entries.find(e=>e.id===id));
    entry.content.review={...entry.content.review,sourceReviewed:true,completenessReviewed:true};
    entry.content.questions.forEach(q=>q.review={...q.review,classificationReviewed:true});
    drafts=await service.documentDrafts.save({revision:drafts.revision,entry});
  }
  await reviewed(entryId);
  drafts=await service.publishDocumentStandalone({entryId,assessmentId:exams[0].id,revision:drafts.revision});
  const first=drafts.entries.find(e=>e.id===entryId).publications[exams[0].id];
  assert.deepEqual(first.questionIds,['standalone-route-fixture-47']);
  app=await service.getState();
  let item=app.standaloneItems.find(q=>q.id===first.questionIds[0]);
  assert.match(item.promptHtml,/<strong>correct<\/strong>/);assert.match(item.stimulusHtml,/<em>synthetic<\/em>/);
  assert.equal(item.correctChoiceId,'B');assert.equal(item.source.playerProfile,'sat_crash_course');
  const bankAfterFirst=await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8');
  drafts=await service.publishDocumentStandalone({entryId,assessmentId:exams[0].id,revision:drafts.revision});
  assert.equal(await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8'),bankAfterFirst,'Exact retry must not duplicate or rewrite the canonical item.');
  drafts=await service.publishDocumentStandalone({entryId,assessmentId:exams[1].id,revision:drafts.revision});
  app=await service.getState();item=app.standaloneItems.find(q=>q.id===first.questionIds[0]);
  assert.equal(app.standaloneItems.filter(q=>q.id===item.id).length,1);
  assert.ok(titles.every(title=>item.versionLabels.includes(title)));
  for(const exam of exams)assert.deepEqual(app.assessments.find(a=>a.id===exam.id).questions.map(q=>q.id),[item.id]);
  const canonicalBefore=structuredClone(item),bankBeforeConflict=await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8');
  const changed=structuredClone(payload);changed.englishQuestions[0].prompt='Different wording with the same source ID.';changed.englishQuestions[0].promptHtml='<p>Different wording with the same source ID.</p>';
  drafts=await service.documentDrafts.import(changed,drafts.revision);
  const changedEntryId=drafts.lastImport.entryIds[0];assert.notEqual(changedEntryId,entryId);
  await reviewed(changedEntryId);
  await assert.rejects(service.publishDocumentStandalone({entryId:changedEntryId,assessmentId:exams[1].id,revision:drafts.revision}),/already has different content/);
  app=await service.getState();assert.deepEqual(app.standaloneItems.find(q=>q.id===item.id),canonicalBefore);
  assert.equal(await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8'),bankBeforeConflict);
  const typecheck=typecheckAuthoredContent(root);assert.deepEqual(typecheck.errors,[]);
  const evidence={scope:'Disposable copy; synthetic reviewed JSON upload; no student records read or written.',reviewGate:true,publishedQuestionIds:first.questionIds,exactRetryReused:true,secondExamSharedCanonicalId:true,multipleTags:titles,changedContentSameIdRejected:true,sourceProfilePreserved:true,richFormattingPreserved:true,typecheckPassed:true,liveAuthoredContentUnchanged:true};
  await mkdir(join(chat,'outputs'),{recursive:true});await writeFile(join(chat,'outputs','document-standalone-publication-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  completed=true;
});
