import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {documentDraftStore} from './document-drafts.mjs';
import fixtureData from './tei-fixtures.cjs';

test('all response formats survive editor draft save/reopen, preserving IDs, keys and sibling questions',async()=>{
  const root=await mkdtemp(join(tmpdir(),'tei-drafts-'));
  try {
    const questions=structuredClone(fixtureData.fixtures);
    // Fixture IDs may repeat across equation-editor variants; give each its own draft.
    const entries=questions.map((q,i)=>({id:`fixture-${i}`,kind:'standalone',status:'draft',content:{title:'Compatibility',questions:[q]}}));
    await mkdir(join(root,'tools/.content-drafts'),{recursive:true});
    await writeFile(join(root,'tools/.content-drafts/document-imports.json'),JSON.stringify({revision:1,entries}));
    const store=documentDraftStore(root);
    for(let i=0;i<entries.length;i++){
      const before=await store.read(),entry=structuredClone(before.entries[i]);
      entry.content.questions[0].explanation='Teacher reviewed explanation.';
      await store.save({revision:before.revision,entry});
      const reopened=await documentDraftStore(root).read();
      const {review: savedReview, ...savedQuestion}=reopened.entries[i].content.questions[0];
      const {review: priorReview, ...priorQuestion}=questions[i];
      assert.deepEqual(savedQuestion,{...priorQuestion,explanation:'Teacher reviewed explanation.'});
      assert.equal(savedReview.completenessReviewed,false);
      assert.equal(reopened.entries[i].status,'draft');
      for(let j=0;j<entries.length;j++)if(i!==j)assert.deepEqual(reopened.entries[j],before.entries[j]);
      await assert.rejects(store.save({revision:before.revision,entry}),/changed/);
    }
  } finally {await rm(root,{recursive:true,force:true});}
});
