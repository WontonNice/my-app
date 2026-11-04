const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
require('../../tools/register-practice-generator.cjs');
const store = require('../src/lib/mathCommandCatalogStore.ts');
const { buildMathCommandCatalog, queryMathCommandCatalog } = require('../src/shared/mathCommandCatalog.ts');
const { currentMathClassification } = require('../src/shared/mathClassificationReview.ts');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'classification-review-'));
  t.after(() => fs.rmSync(root, {recursive:true,force:true}));
  fs.mkdirSync(path.join(root, 'server/data'), {recursive:true}); fs.mkdirSync(path.join(root, 'tools'));
  const taxonomy = {categories:[{label:'Algebra',topics:['Equations & Systems','Inequalities']}]};
  const question = {id:'q1',type:'multiple_choice',topic:'Algebra',subtopic:'Equations & Systems',prompt:'Solve x + 1 = 3.',choices:[{id:'A',text:'2'}],correctChoiceId:'A'};
  fs.writeFileSync(path.join(root,'tools/math-topics.json'), JSON.stringify(taxonomy));
  fs.writeFileSync(path.join(root,'server/data/exam-content.json'), JSON.stringify({exam:{assessmentId:'exam',title:'Exam',mathSection:{questions:[question]}}}));
  const state = store.readMathCommandState(root);
  state.metadata.q1 = {classification:{source:'ai',status:'needs_review',category:question.topic,subcategory:question.subtopic,at:'2026-11-04T00:00:00Z',actor:'codex',reason:'Reviewed content'}};
  store.commitMathCommandState(root,state.revision,state);
  const apply = patch => {
    const preview = store.previewMathMetadata(root,{questionIds:['q1'],patch,revision:store.readMathCommandState(root).revision},'teacher-a');
    return store.applyMathMetadata(root,preview.token,'teacher-a');
  };
  return {root,question,taxonomy,apply,metadata:()=>store.readMathCommandState(root).metadata.q1};
}
test('approval keeps AI origin, records teacher, and undo restores pending status', t => {
  const f=fixture(t), saved=f.apply({approveClassification:true});
  const value=f.metadata().classification;
  assert.equal(value.source,'ai'); assert.equal(value.status,'approved'); assert.equal(value.approvedBy,'teacher-a'); assert.ok(value.approvedAt);
  assert.equal(f.metadata().approveClassification,undefined);
  store.undoMathMetadata(f.root,saved.undoToken,'teacher-a'); assert.equal(f.metadata().classification.status,'needs_review');
});
test('category edit is teacher categorized; unrelated review does not approve', t => {
  const f=fixture(t); f.apply({difficulty:'easy',reviewStatus:'reviewed'});
  assert.equal(f.metadata().classification.status,'needs_review');
  f.apply({subcategory:'Inequalities'});
  assert.equal(f.metadata().classification.source,'teacher'); assert.equal(f.metadata().classification.subcategory,'Inequalities');
  assert.equal(currentMathClassification(f.metadata(),'Algebra','Equations & Systems'),undefined);
});
test('approval cannot spoof authorship, approve incomplete taxonomy, or apply stale preview', t => {
  const f=fixture(t);
  for(const patch of [{classification:{source:'teacher'}},{approveClassification:false},{category:'',subcategory:'',approveClassification:true}])assert.throws(()=>f.apply(patch));
  const preview=store.previewMathMetadata(f.root,{questionIds:['q1'],patch:{approveClassification:true},revision:store.readMathCommandState(f.root).revision},'teacher-a');
  f.apply({subcategory:'Inequalities'});
  assert.throws(()=>store.applyMathMetadata(f.root,preview.token,'teacher-a'),/changed/);
});
test('legacy classifications remain unknown until explicitly approved', t => {
  const f=fixture(t), state=store.readMathCommandState(f.root); delete state.metadata.q1.classification;store.commitMathCommandState(f.root,state.revision,state);
  f.apply({notes:'Reviewed wording only'});assert.equal(f.metadata().classification,undefined);
  f.apply({approveClassification:true});assert.equal(f.metadata().classification.source,'unknown');assert.equal(f.metadata().classification.status,'approved');
});
test('native editor only stamps actual category changes and preserves concurrent edits', t => {
  const f=fixture(t), edit={previousQuestions:[f.question],actor:'local-teacher'};
  store.syncMathNativeClassifications(f.root,[f.question],store.mathClassificationRevision(f.root),edit);
  assert.equal(f.metadata().classification.source,'ai');
  const stale=store.mathClassificationRevision(f.root);f.apply({notes:'another edit'});
  store.syncMathNativeClassifications(f.root,[{...f.question,subtopic:'Inequalities'}],stale,edit);
  assert.equal(f.metadata().classification.source,'ai');
  store.syncMathNativeClassifications(f.root,[{...f.question,subtopic:'Inequalities'}],store.mathClassificationRevision(f.root),edit);
  assert.equal(f.metadata().classification.source,'teacher');assert.equal(f.metadata().classification.actor,'local-teacher');
});
test('catalog projects current provenance and filters AI, approved, teacher and unknown', t => {
  const f=fixture(t);const catalog=()=>buildMathCommandCatalog(store.readMathCommandCatalog(f.root),f.taxonomy,{includeDuplicates:false});
  // Use the exported catalog filter with the same inputs as the route.
  assert.equal(catalog().rows[0].classification.source,'ai');
  assert.equal(queryMathCommandCatalog(catalog(),{classification:'ai'}).total,1);
  f.apply({approveClassification:true});
  assert.equal(queryMathCommandCatalog(catalog(),{classification:'ai'}).total,0);
  assert.equal(queryMathCommandCatalog(catalog(),{classification:'approved'}).total,1);
  f.apply({subcategory:'Inequalities'});assert.equal(queryMathCommandCatalog(catalog(),{classification:'teacher'}).total,1);
  const state=store.readMathCommandState(f.root);state.metadata.q1.subcategory='Equations & Systems';store.commitMathCommandState(f.root,state.revision,state);
  assert.equal(queryMathCommandCatalog(catalog(),{classification:'unverified'}).total,1);
});
