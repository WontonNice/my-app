import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {disposableCopy,loadEditorService,typecheckAuthoredContent} from './source-exam-transfer.mjs';
import practiceCatalogService from './practice-catalog-service.cjs';

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

test('standalone English supports individual review, publication, retry, editable tags, and conflict protection', {timeout:600000}, async t=>{
  const sharedContext = practiceCatalogService.withSharedMathContext;
  practiceCatalogService.withSharedMathContext = async (_root, operation) => operation();
  t.after(() => { practiceCatalogService.withSharedMathContext = sharedContext; });
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
  const titles=['Standalone upload route one','Kaplan worksheet publication fixture'];
  const placement={subject:'english',category:'Revising/Editing'};
  await service.createExam({title:titles[0],examLabel:'Other exams',durationMinutes:30,description:'Disposable publication verification.'});
  await assert.rejects(service.createExam({title:titles[1],studyHallWorksheet:{subject:'english',category:''}}),/Study Hall category/);
  await service.createExam({title:titles[1],examLabel:'Kaplan',studyHallWorksheet:placement});
  let app=await service.getState();
  const exams=titles.map(title=>app.assessments.find(a=>a.title===title));
  assert.ok(exams.every(Boolean));
  assert.equal(exams[0].studyHallWorksheet,undefined);
  assert.deepEqual(exams[1].studyHallWorksheet,placement);
  assert.equal(exams[1].durationMinutes,30);
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
  assert.deepEqual(item.versionLabels,[], 'Exam membership must not create teacher tags.');
  for(const exam of exams)assert.deepEqual(app.assessments.find(a=>a.id===exam.id).questions.map(q=>q.id),[item.id]);
  const canonicalBefore=structuredClone(item),bankBeforeConflict=await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8');
  const changed=structuredClone(payload);changed.englishQuestions[0].prompt='Different wording with the same source ID.';changed.englishQuestions[0].promptHtml='<p>Different wording with the same source ID.</p>';
  drafts=await service.documentDrafts.import(changed,drafts.revision);
  const changedEntryId=drafts.lastImport.entryIds[0];assert.notEqual(changedEntryId,entryId);
  await reviewed(changedEntryId);
  await assert.rejects(service.publishDocumentStandalone({entryId:changedEntryId,assessmentId:exams[1].id,revision:drafts.revision}),/already has different content/);
  app=await service.getState();assert.deepEqual(app.standaloneItems.find(q=>q.id===item.id),canonicalBefore);
  assert.equal(await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8'),bankBeforeConflict);
  const selective = structuredClone(payload);
  selective.source.sourceId = 'part-b-selective';
  selective.englishQuestions = [0,1].map(index => ({...structuredClone(payload.englishQuestions[0]),id:`selective-${index}`,prompt:`Choose punctuation for selected question ${index}.`,promptHtml:'',versionLabels:['My editable tag'],correctChoiceId:index === 0?'B':''}));
  drafts = await service.documentDrafts.import(selective);
  const selectedEntryId = drafts.lastImport.entryIds[0];
  let entry = structuredClone(drafts.entries.find(e=>e.id===selectedEntryId));
  const sibling = structuredClone(entry.content.questions[1]);
  entry.content.questions[0].stimulus = 'Reviewed and edited sentence.';
  entry.content.questions[0].topic = 'Verbs';
  entry.content.questions[0].versionLabels = [];
  entry.content.questions[0].versionLabel = '';
  entry.content.questions[0].source = {...entry.content.questions[0].source,collection:'prestige',label:'Teacher-corrected source'};
  drafts = await service.documentDrafts.save({revision:drafts.revision,entry});
  assert.notEqual(drafts.entries.find(e=>e.id===selectedEntryId).content.questions[0].review.sourceReviewed,true);
  drafts = await service.publishDocumentStandalone({entryId:selectedEntryId,assessmentId:exams[0].id,questionIds:['selective-0'],confirmReview:true,revision:drafts.revision});
  entry = drafts.entries.find(e=>e.id===selectedEntryId);
  assert.equal(entry.status,'draft');
  assert.deepEqual(entry.publishedQuestionIds,['selective-0']);
  assert.equal(entry.content.questions[0].review.sourceReviewed,true,'Publish records the teacher review without a separate checkbox.');
  assert.deepEqual(entry.content.questions[1],sibling,'Publishing one question must not edit or publish its unfinished sibling.');
  app = await service.getState();
  assert.ok(app.standaloneItems.some(q=>q.id==='selective-0'));
  assert.ok(!app.standaloneItems.some(q=>q.id==='selective-1'));
  assert.deepEqual(app.standaloneItems.find(q=>q.id==='selective-0').versionLabels,[],'Removed tags must stay removed after publishing.');
  assert.equal(app.standaloneItems.find(q=>q.id==='selective-0').source.collection,'prestige');
  assert.equal(app.standaloneItems.find(q=>q.id==='selective-0').topic,'Verbs','The selected stand-alone grammar topic survives saving and publication.');
  assert.equal(app.standaloneItems.find(q=>q.id==='selective-0').source.label,'Teacher-corrected source');
  const bankBeforeRetry=await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8');
  drafts=await service.publishDocumentStandalone({entryId:selectedEntryId,assessmentId:exams[0].id,questionIds:['selective-0'],revision:drafts.revision});
  assert.equal(await readFile(join(root,'client/src/content/exams/standaloneItems.ts'),'utf8'),bankBeforeRetry);
  await assert.rejects(service.publishDocumentStandalone({entryId:selectedEntryId,assessmentId:exams[0].id,questionIds:['selective-1'],confirmReview:true,revision:drafts.revision}),/answer/i);
  await assert.rejects(service.publishDocumentStandalone({entryId:selectedEntryId,assessmentId:exams[0].id,questionIds:['unknown'],revision:drafts.revision}),/existing Part B/);
  // Single answer box with unused distractors is a supported TestNav drag/drop.
  const drag={...structuredClone(payload),source:{sourceFamily:'kaplan',sourceFormat:'pdf',sourceId:'kaplan-drag-fixture'}};
  drag.englishQuestions=[{id:'kaplan-drag-fixture',type:'category_sort',topic:'Sentence Structure',prompt:'Move the sentence with an error into the box.',stimulus:'Fixture paragraph.',items:[{id:'s1',text:'First sentence.'},{id:'s2',text:'Second sentence.'}],categories:[{id:'answer',title:'Sentence with an error'}],categoryCapacity:1,requiredPlacements:1,correctPlacements:{s2:'answer'},explanation:'The supplied key identifies sentence two.',source:{collection:'kaplan'},review:{classificationReviewed:true}}];
  drafts=await service.documentDrafts.import(drag,drafts.revision);
  const dragEntry=drafts.lastImport.entryIds[0];
  drafts=await service.publishDocumentStandalone({entryId:dragEntry,assessmentId:exams[1].id,questionIds:['kaplan-drag-fixture'],confirmReview:true,revision:drafts.revision});
  app=await service.getState();
  const publishedDrag=app.standaloneItems.find(q=>q.id==='kaplan-drag-fixture');
  assert.equal(publishedDrag.categories.length,1);assert.equal(publishedDrag.categoryCapacity,1);assert.deepEqual(publishedDrag.correctPlacements,{s2:'answer'});assert.equal(publishedDrag.source.collection,'kaplan');
  const partA=app.passages.find(p=>p.section==='revising_editing_a'||p.format==='sentence_prose');assert.ok(partA);
  const worksheetTest=app.tests.find(t=>t.assessmentId===exams[1].id);
  await service.saveTest({...worksheetTest,revisingEditingPartAPassageIds:[partA.id]});
  app=await service.getState();
  const savedWorksheet=app.assessments.find(a=>a.id===exams[1].id);
  assert.deepEqual(savedWorksheet.studyHallWorksheet,placement,'Publishing and assembling do not turn a worksheet into an assessment.');
  assert.ok(savedWorksheet.questions.some(q=>q.id==='kaplan-drag-fixture'));
  assert.ok(app.tests.find(t=>t.assessmentId===exams[1].id).revisingEditingPartAPassageIds.includes(partA.id));
  const typecheck=typecheckAuthoredContent(root);assert.deepEqual(typecheck.errors,[]);
  const evidence={scope:'Disposable copy; synthetic reviewed JSON upload; no student records read or written.',reviewGate:true,publishedQuestionIds:first.questionIds,exactRetryReused:true,secondExamSharedCanonicalId:true,examMembership:titles,individualPublicationPreservesSibling:true,removedTagsStayRemoved:true,changedContentSameIdRejected:true,sourceProfilePreserved:true,richFormattingPreserved:true,typecheckPassed:true,liveAuthoredContentUnchanged:true};
  await mkdir(join(chat,'outputs'),{recursive:true});await writeFile(join(chat,'outputs','document-standalone-publication-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  completed=true;
});
