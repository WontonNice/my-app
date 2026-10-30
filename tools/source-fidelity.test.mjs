import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import contract from './document-import.cjs';
import {documentDraftStore} from './document-drafts.mjs';
import versions from './passage-versions.cjs';
import batches from './math-import-batch.cjs';

const passage = {title:'Source',text:'Original paragraph.',format:'prose',section:'reading',questions:[{id:'q1',type:'multiple_choice',prompt:'Which is best?',promptHtml:'Which is <strong>best</strong>?',choices:[{id:'A',text:'One'},{id:'B',text:'Two'}],correctChoiceId:'A'}]};
test('mixed JSON retains standalone English independently of passage and Math batches',()=>{
  const english = {...structuredClone(passage.questions[0]),id:'independent-47',stimulus:'Read this paragraph.',stimulusHtml:'<p>Read <u>this</u> paragraph.</p>'};
  const math = {...structuredClone(passage.questions[0]),id:'math-51',topic:'Algebra'};
  const payload={format:contract.format,passages:[passage],englishQuestions:[english],mathQuestions:[math]};
  for (const parse of [contract.parse,batches.parse]) {
    const entries=parse(payload);
    assert.deepEqual(entries.map(e=>e.kind),['passage','standalone','math']);
    assert.deepEqual(entries.flatMap(e=>e.content.questions.map(q=>q.id)),['q1','independent-47','math-51']);
    assert.match(entries[1].content.questions[0].stimulusHtml,/<u>this<\/u>/);
    assert.equal(entries[2].content.questions[0].prompt,'Which is best?');
  }
  assert.equal(contract.parse({englishQuestions:[english]})[0].kind,'standalone');
  assert.throws(()=>contract.parse({englishQuestions:{}}),/must be an array/);
});
test('independent English publication rejects stale drafts and can recover after an interrupted write',async()=>{
  const root=await mkdtemp(new URL('./.standalone-recovery-',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
  try {
    const store=documentDraftStore(root);
    let state=await store.import({format:contract.format,englishQuestions:[passage.questions[0]]});
    const input={entryId:state.entries[0].id,revision:state.revision,assessmentId:'exam-one'};
    await assert.rejects(store.publishStandalone(input,async()=>{throw Error('Interrupted source write');}),/Interrupted/);
    state=await store.read();assert.equal(state.entries[0].status,'draft');
    state=await store.publishStandalone(input,async()=>({questionIds:['q1']}));
    assert.equal(state.entries[0].status,'published');
    assert.deepEqual(state.entries[0].publications['exam-one'].questionIds,['q1']);
    await assert.rejects(store.publishStandalone(input,async()=>{throw Error('Should not be called');}),/changed|revision/i);
  } finally { await rm(root,{recursive:true,force:true}); }
});
test('safe source markup preserves editable layout, emphasis, links, cells and positioned images',()=>{
  const html = contract.sanitizeRichText('<p style="text-align:center"><span style="font-weight:700;font-style:italic">Title</span></p><p>First.</p><figure><img src="/exam-images/chart.png" width="350" alt="Chart"><figcaption>Caption</figcaption></figure><table><caption>Data</caption><tr><th scope="col" colspan="2">Value</th></tr><tr><td>1/4</td><td>2</td></tr></table><p><a href="https://example.com/source">Source</a><a href="javascript:alert(1)">Unsafe</a></p><script>alert(1)</script>');
  assert.match(html, /data-align="center"/);
  assert.match(html, /<strong><em>Title<\/em><\/strong>/);
  assert.match(html, /<figure><img src="\/exam-images\/chart.png"/);
  assert.match(html, /<th colspan="2" scope="col">/);
  assert.match(html, /href="https:\/\/example.com\/source"/);
  assert.doesNotMatch(html, /javascript|script|style=/);
  assert.ok(html.indexOf('<figure>') < html.indexOf('<table>'));
});
test('source formats do not split an official exam, but question order, underlined targets and poem lines do',()=>{
  const a={...passage,source:{sourceFamily:'official_shsat',sourceFormat:'pdf'}},b={...structuredClone(passage),source:{sourceFamily:'official_shsat',sourceFormat:'testnav'}};
  assert.equal(versions.identical(a,b),true);
  b.questions[0].promptHtml='Which is <u>best</u>?';assert.equal(versions.identical(a,b),false);
  assert.equal(versions.identical({...a,format:'poem',text:'First\nSecond'}, {...a,format:'poem',text:'First Second'}),false);
  assert.equal(versions.identical(a,{...a,source:{sourceFamily:'sat_crash_course'}}),false);
});
test('changed keys, emphasis and response controls never vanish as an exact retry',()=>{
  const base={kind:'passage',content:passage};
  for(const change of [q=>q.correctChoiceId='B',q=>q.promptHtml='Which is best?',q=>q.selectionHtml='<span data-choice-id="A">One</span> Two']) {
    const next=structuredClone(base);change(next.content.questions[0]);assert.notEqual(contract.fingerprint(base),contract.fingerprint(next));
  }
});
test('source choice labels remap selectable phrases together with their keyed answers',()=>{
  const question=contract.normalizeChoiceLabels({type:'multiple_choice',choices:[{id:'E',text:'First'},{id:'F',text:'Second'}],correctChoiceId:'F',selectionHtml:'<p><span data-choice-id="E">First</span> or <span data-choice-id="F">Second</span>.</p>'});
  assert.equal(question.correctChoiceId,'B');
  assert.match(question.selectionHtml,/data-choice-id="A">First/);
  assert.match(question.selectionHtml,/data-choice-id="B">Second/);
});
test('original uploads are immutable, retries reuse drafts, and edits invalidate source approval',async()=>{
  const root=await mkdtemp(new URL('./.source-fidelity-',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
  try {
    const store=documentDraftStore(root);
    const raw=JSON.stringify({format:contract.format,source:{sourceFamily:'official_shsat',sourceFormat:'pdf',year:'2024-2025',form:'B'},passage},null,4);
    let state=await store.import(raw);
    const first=state.entries[0],id=first.sourcePackages[0];
    assert.equal(await readFile(join(root,'tools','.content-drafts','source-packages',id,'original.json'),'utf8'),raw);
    assert.equal(first.content.source.year,'2024-2025');
    state=await store.import(raw,state.revision);assert.equal(state.entries.length,1);
    const entry=structuredClone(state.entries[0]);entry.content.review.sourceReviewed=true;
    state=await store.save({revision:state.revision,entry});
    const edited=structuredClone(state.entries[0]);edited.content.questions[0].correctChoiceId='B';
    state=await store.save({revision:state.revision,entry:edited});
    assert.equal(state.entries[0].content.review.sourceReviewed,false);
    assert.equal(await readFile(join(root,'tools','.content-drafts','source-packages',id,'original.json'),'utf8'),raw);
  } finally { await rm(root,{recursive:true,force:true}); }
});
