import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, basename } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import PartBBank from './part-b-bank.cjs';
import { documentDraftStore } from './document-drafts.mjs';

const source = await readFile(new URL('./content-studio-part-b.js', import.meta.url), 'utf8');
const documents = await readFile(new URL('./content-studio-documents.js', import.meta.url), 'utf8');
const fixture = () => ({ revision: 8, entries: [{
  id: 'import-prestige', kind: 'standalone', status: 'draft',
  content: { title: 'Independent English questions', source: { sourceFamily: 'sat_crash_course', label: 'Digital SHSAT Practice Test Adaptive 10' }, questions: [
    { id: 'q47', type: 'transition_drop', prompt: 'Correct the comma splice.', dragDropContent: ['The bus arrived ', { slotId: 'slot-1' }, ' we left.'], dragDropSlots: [{ id: 'slot-1', correctItemId: 'A' }], choices: [{ id: 'A', text: 'and' }], source: { sourceQuestion: '47' } },
    { id: 'q49', type: 'inline_dropdown', prompt: 'Correct the verb tense.', dropdowns: [{ id: 'blank-1', correctChoiceId: 'B', choices: [{ id: 'B', text: 'went' }] }], source: { sourceQuestion: '49' } },
  ] },
}] });
function setup(state = fixture()) {
  const app = { state: { assessments: [{ title: 'Digital SHSAT Practice Test Adaptive 10 (Hard)', examLabel: 'Prestige' }], standaloneItems: [] }, standaloneDirty: false };
  const messages = [], dialog = { open: false, showModal() { this.open = true; } };
  const context = vm.createContext({ app, PartBBank, studioUI: { syncSaveState() {} }, clone: structuredClone, api: async () => structuredClone(state), confirmStandaloneDiscard: () => true, renderStandaloneList() {}, renderStandaloneEditor() {}, setStatus: message => messages.push(message), document: { querySelector: () => dialog } });
  const partB = vm.runInContext(source + '\nPartBImport;', context);
  const studio = vm.runInContext(documents + '\nDocumentStudio;', context);
  studio.render = () => {};
  return { partB, workspace: vm.runInContext('PartBWorkspace', context), studio, app, context, messages, dialog };
}

test('document-import stand-alone drafts appear individually with source and Prestige search labels without copying storage', async () => {
  const state = fixture();
  state.entries.push({ ...structuredClone(state.entries[0]), id: 'published', status: 'published' });
  state.entries.push({ ...structuredClone(state.entries[0]), id: 'passage', kind: 'passage' });
  const before = JSON.stringify(state);
  const { partB } = setup(state);
  await partB.refreshDocuments();
  const records = partB.documentRecords();
  assert.equal(records.length, 2);
  assert.deepEqual(Array.from(records, q => q.id), ['q47', 'q49']);
  assert.deepEqual(Array.from(partB.sourceLabels(records[0])), ['Digital SHSAT Practice Test Adaptive 10', 'Prestige', 'SAT Crash Course']);
  assert.equal(records[0].documentDraftId, 'import-prestige');
  assert.equal(records[0].dragDropSlots[0].correctItemId, 'A');
  assert.equal(records[1].dropdowns[0].correctChoiceId, 'B');
  assert.equal(JSON.stringify(state), before);
});

test('Part B opens the selected TEI in the review editor using the current revision and preserves all sibling questions', async () => {
  const { partB, app, dialog } = setup();
  await partB.selectDocument('import-prestige', 'q49');
  const studio = partB.documentBase;
  assert.equal(app.standaloneDraft.type, 'inline_dropdown');
  assert.equal(app.standaloneDraft.documentDraftId, 'import-prestige');
  assert.equal(app.standaloneDraft.id, 'q49');
  assert.equal(studio.revision, 8);
  assert.equal(studio.entry.content.questions.length, 2);
  assert.equal(dialog.open, false);
  assert.equal(app.standaloneDirty, false);
});

test('saving a document draft refreshes Part B without changing TEI data or writing to the published bank', async () => {
  const root = await mkdtemp(join(tmpdir(), 'part-b-documents-'));
  try {
    const store = documentDraftStore(root);
    const state = fixture();
    // Seed the actual draft store with a non-publishing write.
    const { mkdir, writeFile } = await import('node:fs/promises');
    await mkdir(join(root, 'tools', '.content-drafts'), { recursive: true });
    await writeFile(join(root, 'tools', '.content-drafts', 'document-imports.json'), JSON.stringify(state));
    const { partB, workspace, app, context } = setup(state);
    await partB.selectDocument('import-prestige', 'q49');
    const studio = partB.documentBase;
    const original = structuredClone(studio.entry.content.questions[0]);
    app.standaloneDraft.prompt = 'Reviewed verb tense prompt.';
    app.passageDraft = { partBEditor: true, questions: [app.standaloneDraft], text: 'Own paragraph.', richText: '<p>Own paragraph.</p>' };
    context.api = async (path, options) => { assert.equal(path, '/api/document-drafts'); return store.save(JSON.parse(options.body)); };
    await workspace.save();
    const saved = await store.read();
    assert.equal(saved.revision, 9);
    assert.equal(app.standaloneDraft.prompt, 'Reviewed verb tense prompt.');
    assert.deepEqual(saved.entries[0].content.questions[0], original);
    assert.equal(saved.entries[0].content.questions[1].dropdowns[0].correctChoiceId, 'B');
    assert.equal(saved.entries[0].status, 'draft');
    assert.equal(app.state.standaloneItems.length, 0);
    await assert.rejects(store.save({ revision: 8, entry: studio.entry }), /changed/);
  } finally {
    assert.equal(dirname(root), tmpdir());
    assert.ok(basename(root).startsWith('part-b-documents-'));
    await rm(root, { recursive: true, force: true });
  }
});

test('a failed draft load retains the last good library and exposes an error instead of pretending there are no drafts', async () => {
  const { partB, context } = setup();
  await partB.refreshDocuments();
  context.api = async () => { throw new Error('Network unavailable'); };
  await partB.refreshDocuments();
  assert.equal(partB.documentRecords().length, 2);
  assert.match(partB.documentError, /Network unavailable/);
});

test('Part B controls share the normalized question instance after the shared editor mounts', () => {
  const {workspace,app,context} = setup();
  const node = {textContent:'',setAttribute(){},removeEventListener(){},append(){}};
  const host = {replaceChildren(editor){editor.parentNode=this;}};
  const editor = {parentNode:{},querySelector:selector=>selector==='.studio-publish-destination'?null:node,querySelectorAll:()=>[]};
  context.document = {getElementById:id=>id==='passage-editor'?editor:host};
  context.defaultPassage = () => ({questions:[]});
  context.renderPassageEditor = () => { app.passageDraft.questions=app.passageDraft.questions.map(q=>structuredClone(q)); };
  context.openStandaloneStudentPreview=()=>{}; context.openStudentPreview=()=>{};
  context.studioUI.element=()=>({...node});
  workspace.mountMetadata=()=>{};
  app.standaloneDraft={id:'q',prompt:'Keep text',versionLabels:['Original'],stimulus:'Own paragraph.'};
  workspace.mount();
  assert.equal(app.passageDraft.section,'revising_editing_b');
  assert.equal(app.standaloneDraft,app.passageDraft.questions[0]);
  Object.assign(app.standaloneDraft,PartBBank.withLabels(app.standaloneDraft,['My tag']));
  workspace.sync();
  assert.deepEqual(app.standaloneDraft.versionLabels,['My tag']);
});

test('partially published imports show only remaining drafts and retain search provenance without inventing tags', async () => {
  const state=fixture(); state.entries[0].publishedQuestionIds=['q47'];
  const {partB}=setup(state); await partB.refreshDocuments();
  assert.deepEqual(Array.from(partB.documentRecords(),q=>q.id),['q49']);
  assert.deepEqual(Array.from(partB.documentRecords()[0].versionLabels),[]);
  assert.ok(partB.sourceLabels(partB.documentRecords()[0]).includes('Prestige'));
});

test('Saved import drafts opens Part B in the shared editor instead of the document popup', async () => {
  const {studio,partB,context,dialog,app}=setup();
  await partB.refreshDocuments(); studio.state=partB.documentState;
  let activeTab; context.switchTab=tab=>{activeTab=tab;}; dialog.close=()=>{dialog.open=false;}; dialog.open=true;
  await studio.open('import-prestige','q49');
  assert.equal(activeTab,'standalone'); assert.equal(app.standaloneDraft.id,'q49'); assert.equal(dialog.open,false);
});

test('Part B shows source collection separately from editable tags and honors teacher corrections', async () => {
  const {workspace,partB,app}=setup();
  await partB.refreshDocuments();
  const imported=partB.documentRecords()[0];
  assert.equal(workspace.collection(imported),'prestige');
  assert.equal(workspace.sourceInfo(imported).label,'Digital SHSAT Practice Test Adaptive 10');
  assert.deepEqual(Array.from(PartBBank.labels(imported)),[]);
  const official={...imported,source:{sourceFamily:'official_shsat'}};
  assert.equal(workspace.collection(official),'official_handbook');
  const corrected={...official,source:{...official.source,collection:'miscellaneous',label:'Teacher source'}};
  assert.equal(workspace.collection(corrected),'miscellaneous');
  assert.equal(workspace.sourceInfo(corrected).label,'Teacher source');
  const legacy={id:'legacy-official',prompt:'Original question'};
  app.state.standaloneItems.push(legacy);
  app.state.tests=[{assessmentId:'2025-2026-form-a',title:'2025-2026 Form A',standaloneItemIds:['legacy-official']}];
  assert.equal(workspace.collection(legacy),'official_handbook','Older questions inherit the source of their saved exam when provenance is absent.');
  assert.equal(app.standaloneDirty,false);
});

test('Publish itself confirms review for only the selected Part B question', async () => {
  const {workspace,partB,app,context}=setup();
  await partB.selectDocument('import-prestige','q49');
  const host={inert:false};
  app.standaloneDraft.topic='Verbs';
  context.questionTopicsForSection=()=>['Verbs'];
  context.document={querySelector:()=>({value:'exam-1'}),getElementById:()=>host};
  let saved=false,payload;
  workspace.save=async()=>{saved=true;return true;};
  context.api=async(path,options)=>{assert.ok(saved);payload=JSON.parse(options.body);return fixture();};
  context.reloadState=async()=>{};
  await workspace.publish();
  assert.equal(payload.confirmReview,true);
  assert.deepEqual(payload.questionIds,['q49']);
  assert.equal(payload.assessmentId,'exam-1');
  assert.equal(host.inert,false);
  assert.equal(app.saving,false);
});

test('publishing an unclassified question opens its topic field without attempting publication', async()=>{
  const {workspace,partB,app,context,messages}=setup();
  await partB.selectDocument('import-prestige','q49');
  let focused=false,panel;
  context.document={querySelector:selector=>selector.includes('Publish destination')?{value:'exam-1'}:{focus(){focused=true;}}};
  context.questionTopicsForSection=()=>['Verbs'];
  context.studioUI.showSupportPanel=value=>{panel=value;};
  workspace.save=async()=>{assert.fail('Do not attempt publication before a topic is selected.');};
  await workspace.publish();
  assert.equal(panel,'question'); assert.equal(focused,true);
  assert.match(messages.at(-1),/Choose a topic in Question options/);
  assert.equal(app.standaloneDraft.topic,undefined);
});

test('exam appearances include every linked source version once per exam, independently of tags', () => {
  const items=[{id:'shared',versionLabels:['Not an assigned exam']},{id:'form-a-copy',duplicateOf:'shared'},{id:'older-copy',duplicateOf:'form-a-copy'},{id:'different-question'}];
  const tests=[
    {assessmentId:'form-a',title:'2025-2026 Form A',standaloneItemIds:['form-a-copy']},
    {assessmentId:'form-b',title:'2026-2027 Form B',standaloneItemIds:['shared','older-copy']},
    {assessmentId:'other',title:'Different exam',standaloneItemIds:['different-question']},
  ];
  const expected=[{id:'form-a',title:'2025-2026 Form A'},{id:'form-b',title:'2026-2027 Form B'}];
  assert.deepEqual(PartBBank.usage(items[0],items,tests),expected);
  assert.deepEqual(PartBBank.usage(items[2],items,tests),expected);
  assert.deepEqual(PartBBank.usage({id:'unpublished',versionLabels:['2025-2026 Form A']},items,tests),[]);
});

test('Part B deletion clears the shared editor after success and preserves it after failure', async () => {
  const {workspace,app,context,partB,messages}=setup();
  const editor={inert:false};context.document={getElementById:()=>editor};
  context.window={confirm:()=>true};context.reloadState=async()=>{};
  app.standaloneDraft={id:'q47',documentDraftId:'import-prestige'};
  partB.documentBase={entry:{id:'import-prestige'},revision:8};
  let request;
  context.api=async(url,options)=>{request={url,...JSON.parse(options.body)};throw new Error('Draft changed');};
  await workspace.deleteCurrent();
  assert.equal(app.standaloneDraft.id,'q47');assert.equal(editor.inert,false);assert.equal(app.saving,false);
  assert.equal(messages.at(-1),'Draft changed');
  context.api=async()=>({revision:9,entries:[]});
  workspace.leave=()=>{app.standaloneDraft={id:'q47'};}; // Leaving synchronizes the old shared question.
  await workspace.deleteCurrent();
  assert.equal(request.questionId,'q47');assert.equal(request.revision,8);
  assert.equal(app.standaloneDraft,null);assert.equal(app.selectedStandaloneItemId,'');
  assert.equal(partB.documentState.entries.length,0);
});

test('deleting a used bank question explains all exam appearances without discarding edits',async()=>{
  const {workspace,app,context,messages}=setup();
  const q={id:'q',topic:'Pronouns'};app.standaloneDraft=q;app.standaloneDirty=true;
  app.state.standaloneItems=[q,{id:'alias',duplicateOf:'q'}];
  app.state.tests=[{assessmentId:'a',title:'Form A',standaloneItemIds:['q']},{assessmentId:'b',title:'Form B',standaloneItemIds:['alias']}];
  let calls=0;context.api=async()=>{calls++;};context.studioUI.showSupportPanel=()=>{};
  await workspace.deleteCurrent();
  assert.equal(calls,0);assert.equal(app.standaloneDirty,true);
  assert.match(messages.at(-1),/Form A, Form B/);
});
