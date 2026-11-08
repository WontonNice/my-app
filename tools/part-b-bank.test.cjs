const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const bank = require('./part-b-bank.cjs');
const question = (id, extra = {}) => ({ id, type: 'multiple_choice', prompt: 'Which edit corrects the sentence?', stimulus: 'In 1962 the agile athletic player scored 100 points.', stimulusHtml: 'In 1962 the <u>agile</u> athletic player scored 100 points.', choices: [{ id: 'A', text: 'Insert a comma after agile' }, { id: 'B', text: 'Insert a comma after player.' }], correctChoiceId: 'A', points: 1, ...extra });

test('combining repeats keeps topic consistent across retained exam versions', () => {
  const a=question('a',{topic:'Punctuation'}), b=question('b',{topic:'Sentence Structure'});
  const combined=bank.combine([a,b],'a','b',{additionalLabels:[]});
  assert.equal(combined.find(q=>q.id==='b').topic,'Punctuation');
  assert.deepEqual(combined.find(q=>q.id==='b'),{...b,topic:'Punctuation',duplicateOf:'a'});
});

test('source tags accept legacy labels, preserve order and deduplicate without preventing removal of the last tag', () => {
  assert.deepEqual(bank.labels({ versionLabel: ' 2020-2021 Form A ' }), ['2020-2021 Form A']);
  assert.deepEqual(bank.labels({ versionLabels: [' Form A ', 'form a', '', 'Form B', null] }), ['Form A', 'Form B']);
  assert.deepEqual(bank.withLabels({ versionLabel: 'Old' }, []), { versionLabel: '', versionLabels: [] });
});

test('repeat detection handles source formatting and missing terminal punctuation in comma-edit labels', () => {
  const a = question('a'), b = question('b', { versionLabels: ['Another test'], stimulusHtml: `<p>${a.stimulusHtml}</p>`, explanation: 'Source explanation', topic: 'Punctuation' });
  b.choices = [{ id: 'E', html: 'Insert a comma after <strong><em>agile</em></strong>.', text: 'Insert a comma after agile.' }, { id: 'F', text: 'Insert a comma after player.' }]; b.correctChoiceId = 'E';
  assert.equal(bank.match(a, b).canCombine, true);
  assert.equal(bank.pairs([a, b]).length, 1);
});

test('generic prompts, changed tasks, conflicting keys, missing keys, emphasis targets and meaningful punctuation cannot auto-combine', () => {
  const a = question('a');
  assert.equal(bank.match(a, question('b', { stimulus: 'Unrelated sentence.', stimulusHtml: '' })), null);
  assert.equal(bank.match(a, question('b', { prompt: 'What does this sentence mean?' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { correctChoiceId: 'B' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { correctChoiceId: '' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { stimulusHtml: 'In 1962 the agile <u>athletic</u> player scored 100 points.' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { stimulusHtml: a.stimulusHtml + '<img src="/exam-images/a.png">' })).canCombine, false);
  assert.equal(bank.match(a, question('b', { points: 2 })).canCombine, false);
  assert.equal(bank.match(question('a', { choices: [{ id: 'A', text: 'Stop.' }] }), question('b', { choices: [{ id: 'A', text: 'Stop' }] })).canCombine, false);
  assert.equal(bank.match(question('a', { stimulus: '', stimulusHtml: '' }), question('b', { stimulus: '', stimulusHtml: '' })), null);
});

test('generic reading directions do not split identical questions, while meaningful directions remain distinct', () => {
  const a = question('a');
  assert.equal(bank.match(a, question('b', { instructionsHtml: '<p>Read this paragraph.</p>' })).canCombine, true);
  assert.equal(bank.match(a, question('b', { instructions: 'Read the sentence' })).canCombine, true);
  assert.equal(bank.match(a, question('b', { instructions: 'Select two answers.' })).canCombine, false);
});

test('teacher verification combines a compatible pair once, persists all source tags and preserves the chosen question', () => {
  const a = question('a', { versionLabels: ['Form A'], points: 2 });
  const b = question('b', { versionLabels: ['Form B'] });
  const original = structuredClone([a, b]);
  assert.equal(bank.match(a, b).canVerify, true);
  assert.throws(() => bank.combine([a, b], 'b', 'a'), /explicitly verify/);
  assert.throws(() => bank.combine([a, b], 'b', 'a', { verifiedSameQuestion: 'true' }), /explicitly verify/);
  const items = bank.combine([a, b], 'b', 'a', { verifiedSameQuestion: true, additionalLabels: ['form a', 'Form C'] });
  assert.deepEqual(items.filter(q => !q.duplicateOf), [bank.withLabels(b, ['Form B', 'Form A', 'Form C'])]);
  assert.deepEqual(items.find(q => q.id === 'a'), { ...a, duplicateOf: 'b' });
  assert.deepEqual([a, b], original);
  assert.equal(bank.pairs(items).length, 0);
  assert.throws(() => bank.combine([a, b], 'b', 'a', { verifiedSameQuestion: true, additionalLabels: 'Form C' }), /array/);
});

test('manual verification supports reordered choices but cannot bypass conflicting keys, source text or edit targets', () => {
  const a = question('a'), b = question('b', { choices: [...a.choices].reverse() });
  assert.equal(bank.match(a, b).canCombine, false);
  assert.equal(bank.match(a, b).canVerify, true);
  for (const other of [question('b', { correctChoiceId: 'B' }), question('b', { correctChoiceId: '' }), question('b', { stimulus: 'Other text.', stimulusHtml: '' }), question('b', { stimulusHtml: 'In 1962 the agile <u>athletic</u> player scored 100 points.' })]) {
    assert.throws(() => bank.combine([a, other], 'a', 'b', { verifiedSameQuestion: true }), /differ/);
  }
});

test('a copy that lost all underlining requires teacher verification and keeps the formatted copy', () => {
  const source = question('source', { versionLabels: ['Form A'] });
  const imported = question('import', { stimulusHtml: `<p>${source.stimulus}</p>`, instructions: 'Read this paragraph.', versionLabels: ['Form B'] });
  assert.equal(bank.match(source, imported).canCombine, false);
  assert.equal(bank.match(source, imported).canVerify, true);
  const items = bank.combine([source, imported], source.id, imported.id, { verifiedSameQuestion: true });
  assert.equal(items.find(q => !q.duplicateOf).stimulusHtml, source.stimulusHtml);
  assert.deepEqual(items.find(q => !q.duplicateOf).versionLabels, ['Form A', 'Form B']);
});

test('combining produces one bank question with both source tags while preserving source versions and test references', () => {
  const a = question('old', { versionLabel: '2020-2021 Form A' });
  const b = question('new', { versionLabel: '2022-2023 Form A', explanation: 'Supplied explanation.', explanationHtml: '<strong>Supplied</strong> explanation.' });
  const original = structuredClone([a, b]);
  const items = bank.combine([a, b], b.id, a.id);
  assert.deepEqual([a, b], original);
  assert.deepEqual(items.find(q => q.id === a.id), { ...a, duplicateOf: b.id });
  const primary = items.find(q => !q.duplicateOf);
  assert.deepEqual(primary.versionLabels, ['2022-2023 Form A', '2020-2021 Form A']);
  assert.equal(primary.explanationHtml, b.explanationHtml);
  assert.equal(bank.pairs(items).length, 0);
  assert.deepEqual(bank.usage(primary, items, [{ assessmentId: 'a', title: 'Actual exam', standaloneItemIds: ['old'] }, { assessmentId: 'b', title: 'Tag only', standaloneItemIds: [] }]), [{ id: 'a', title: 'Actual exam' }]);
  assert.equal(bank.versions(primary, items).length, 2);
  assert.throws(() => bank.combine(items, a.id, b.id), /current bank/);
  assert.throws(() => bank.combine([a, question('conflict', { correctChoiceId: 'B' })], a.id, 'conflict'), /differ/);
});

test('combining again does not resurrect teacher tags removed from the current question', () => {
  const original = question('original', { versionLabels: ['Removed tag'] });
  const primary = question('primary', { versionLabels: ['Current tag'] });
  const combined = bank.combine([original, primary], primary.id, original.id);
  const edited = combined.map(q => q.id === primary.id ? bank.withLabels(q, []) : q);
  const imported = question('imported', { versionLabels: ['Imported tag'] });
  const next = bank.combine([...edited, imported], primary.id, imported.id);
  assert.deepEqual(next.find(q => q.id === primary.id).versionLabels, ['Imported tag']);
  assert.deepEqual(bank.usage(next[1], next, [{assessmentId:'exam', title:'Original exam', standaloneItemIds:['original']}]), [{id:'exam', title:'Original exam'}]);
});

test('retained Wilt Chamberlain versions keep their source IDs without teacher metadata in student lookups', () => {
  const source = fs.readFileSync(path.join(__dirname, '../client/src/content/exams/standaloneItems.ts'), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {}; vm.runInNewContext(output, { exports });
  const copies = exports.standaloneItems.filter(q => ['part-b-question-9','part-b-import-a014b48d8124-92d0f942'].includes(q.id));
  assert.equal(copies.length, 2); assert.equal(copies.filter(q => !q.duplicateOf).length, 1);
  const students = exports.getStandaloneItemsById(copies.map(q => q.id));
  for (const [i, q] of students.entries()) {
    assert.equal(q.id, copies[i].id); assert.equal(q.correctChoiceId, 'A');
    assert.equal(q.stimulusHtml, copies[i].stimulusHtml); assert.equal(q.choices[0].html, copies[i].choices[0].html);
    assert.equal(q.versionLabels, undefined); assert.equal(q.versionLabel, undefined); assert.equal(q.duplicateOf, undefined);
  }
});

test('the editor save propagates topic changes through retained versions while preserving their content', async () => {
  const source = fs.readFileSync(path.join(__dirname,'content-studio.mjs'),'utf8');
  const start = source.indexOf('async function saveStandaloneItemNow(');
  const end = source.indexOf('\nfunction ',start);
  const original = [question('a',{topic:'Sentence Structure'}),question('b',{topic:'Sentence Structure',duplicateOf:'a',source:{label:'Old exam'}}),question('c',{topic:'Verbs'})];
  let written;
  const save = vm.runInNewContext(source.slice(start,end)+'\nsaveStandaloneItemNow;', {
    readFile:async()=> 'source',standaloneItemsPath:'bank.ts',hashSource:()=> 'hash',
    normalizeStandaloneItem:q=>q,listStandaloneItems:async()=>structuredClone(original),partBBank:bank,
    writeStandaloneItems:async items=>{written=items;return 'next';},relativePath:p=>p,EditorError:Error,
  });
  await save({sourceHash:'hash',originalId:'a',item:{...original[0],topic:'Punctuation'}});
  assert.deepEqual(JSON.parse(JSON.stringify(written)),original.map(q=>q.id==='c'?q:{...q,topic:'Punctuation'}));
});

test('tag edits and failed combines preserve question content, dirty edits and editor usability', async () => {
  const source = fs.readFileSync(path.join(__dirname, 'content-studio-part-b-tools.js'), 'utf8');
  const original = question('q1'), editor = { inert: false, querySelector: () => ({ textContent: '' }) };
  const app = { standaloneDraft: original, standaloneDirty: false, state: { standaloneSourceHash: 'current' } };
  let calls = 0;
  const ui = vm.runInNewContext(source + '\nPartBTools;', { app, PartBBank: bank, document: { getElementById: () => editor }, markStandaloneDirty() { app.standaloneDirty = true; }, window: { confirm: () => true }, studioUI: { syncSaveState() {} }, api: async (url, options) => { calls++; assert.equal(url, '/api/standalone-items/combine'); assert.equal(JSON.parse(options.body).sourceHash, 'current'); throw new Error('Bank changed'); } });
  ui.renderTags = () => {}; ui.renderSummary = () => {};
  ui.setTags(['Form A', 'Form B']);
  assert.equal(app.standaloneDraft.correctChoiceId, 'A'); assert.equal(app.standaloneDraft.stimulusHtml, original.stimulusHtml); assert.equal(app.standaloneDirty, true);
  await ui.combine(original, question('q2')); assert.equal(calls, 0);
  app.standaloneDirty = false;
  await ui.combine(original, question('q2')); assert.equal(calls, 1);
  assert.equal(app.standaloneDraft, original); assert.equal(editor.inert, false); assert.equal(app.saving, false);
});

test('verified save updates the visible bank to one question, closes comparison and retains both tags', async () => {
  const source = fs.readFileSync(path.join(__dirname, 'content-studio-part-b-tools.js'), 'utf8');
  const left = question('left', { versionLabels: ['Form A'] }), right = question('right', { versionLabels: ['Form B'] });
  const app = { standaloneDirty: false, state: { standaloneItems: [left, right], standaloneSourceHash: 'before' } };
  let closed = false, status = '', renders = 0;
  const dialog = { inert: false, close() { closed = true; } };
  const ui = vm.runInNewContext(source + '\nPartBTools;', {
    app, PartBBank: bank, document: { getElementById: () => dialog }, clone: structuredClone,
    renderStandaloneList() { renders++; }, renderStandaloneEditor() { renders++; },
    setStatus(value) { status = value; }, studioUI: { syncSaveState() {} },
    api: async (url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.verifiedSameQuestion, true);
      assert.deepEqual(body.additionalLabels, ['Form A']);
      const items = bank.combine([left, right], body.keepId, body.removeId, body);
      return { items, item: items.find(q => q.id === body.keepId), sourceHash: 'after' };
    },
  });
  await ui.combine(left, right, { verifiedSameQuestion: true, additionalLabels: ['Form A'] });
  assert.equal(app.state.standaloneItems.filter(q => !q.duplicateOf).length, 1);
  assert.deepEqual(app.standaloneDraft.versionLabels, ['Form A', 'Form B']);
  assert.equal(app.state.standaloneSourceHash, 'after'); assert.equal(app.selectedStandaloneItemId, left.id);
  assert.equal(closed, true); assert.equal(renders, 2); assert.equal(dialog.inert, false); assert.equal(app.saving, false);
  assert.equal(status, 'Saved one bank question with 2 source tags.');
});

test('imported repeats offer verification immediately and submit unsaved draft edits with the draft version', async () => {
  const source = fs.readFileSync(path.join(__dirname, 'content-studio-part-b-tools.js'), 'utf8');
  const saved = question('saved', { versionLabels: ['Form A'] });
  const draft = question('imported', { versionLabels: ['Form B'], importDraftId: 'draft', importVersion: 3, unsaved: true });
  const app = { standaloneDirty: true, standaloneDraft: draft, state: { standaloneItems: [saved], standaloneImportDrafts: [{ id: 'draft', version: 3, question: draft }], standaloneSourceHash: 'current' } };
  let submitted;
  const dialog = { inert: false, querySelector: () => ({ textContent: '' }) };
  const ui = vm.runInNewContext(source + '\nPartBTools;', {
    app, PartBBank: bank, escapeHtml: value => String(value), document: { getElementById: () => dialog }, studioUI: { syncSaveState() {} },
    api: async (url, options) => { submitted = JSON.parse(options.body); throw Error('Write failed'); },
  });
  const actions = ui.mergeActions({ left: saved, right: draft, canVerify: false, canCombine: false }, 0);
  assert.doesNotMatch(actions, /Finish & save|disabled/);
  assert.match(actions, /Verify same · keep left/); assert.match(actions, /Verify same · keep right/);
  await ui.combine(saved, draft, { verifiedSameQuestion: true });
  assert.deepEqual(submitted.drafts, [{ id: 'draft', version: 3, question: draft }]);
  assert.equal(submitted.verifiedSameQuestion, true); assert.equal(submitted.replaceOtherContent, true);
  assert.equal(app.standaloneDraft, draft); assert.equal(app.standaloneDirty, true);
  assert.equal(app.state.standaloneImportDrafts.length, 1); assert.equal(app.saving, false); assert.equal(dialog.inert, false);
  const records = ui.records();
  assert.equal(records.find(item => item.id === draft.id).importVersion, 3);
});


test('explicit chosen-copy replacement overrides conflicts and updates every retained ID', () => {
  const a = question('a', { topic:'Pronouns', versionLabels:['Form A'], explanation:'Old explanation', image:'old.png', correctChoiceId:'B' });
  const b = question('b', { topic:'Verbs', versionLabels:['Form B'], prompt:'Use this chosen wording.', stimulusHtml:'In 1962 the agile <u>athletic</u> player scored 100 points.' });
  const oldA = {...a,id:'old-a',duplicateOf:'a'}, oldB = {...b,id:'old-b',duplicateOf:'b'};
  const unrelated = question('unrelated',{stimulus:'Different paragraph',stimulusHtml:''});
  const input = [a,b,oldA,oldB,unrelated], before = structuredClone(input);
  assert.throws(()=>bank.combine(input,'b','a',{verifiedSameQuestion:true}),/differ/);
  const combined = bank.combine(input,'b','a',{verifiedSameQuestion:true,replaceOtherContent:true});
  for (const id of ['a','old-a','old-b']) {
    const q=combined.find(q=>q.id===id);
    assert.equal(q.duplicateOf,'b'); assert.equal(q.canonicalContent,true);
    assert.equal(q.prompt,b.prompt); assert.equal(q.correctChoiceId,b.correctChoiceId);
    assert.equal(q.stimulusHtml,b.stimulusHtml); assert.equal(q.topic,b.topic);
    assert.equal(q.image,undefined); assert.equal(q.explanation,undefined);
  }
  assert.deepEqual(bank.labels(combined.find(q=>q.id==='b')),['Form B','Form A']);
  assert.deepEqual(input,before); assert.equal(combined.at(-1),unrelated);
  const changed=combined.map(q=>q.id==='b'?{...q,prompt:'Later edit',correctChoiceId:'B'}:q);
  const synced=bank.withSharedTopic(changed,'b','TBD');
  assert.equal(synced.find(q=>q.id==='old-a').prompt,'Later edit');
  assert.equal(synced.find(q=>q.id==='a').correctChoiceId,'B');
});

test('replacement requires explicit boolean verification and a usable chosen answer', () => {
  const a=question('a'),b=question('b',{correctChoiceId:'B'});
  for(const flags of [{replaceOtherContent:true},{verifiedSameQuestion:true,replaceOtherContent:'true'},{verifiedSameQuestion:'true',replaceOtherContent:true}])
    assert.throws(()=>bank.combine([a,b],'a','b',flags),/differ/);
  assert.throws(()=>bank.combine([a,{...b,correctChoiceId:''}],'b','a',{verifiedSameQuestion:true,replaceOtherContent:true}),/chosen copy/);
});

test('repeat cards preserve TEI interactions and send each copy to its own student player', () => {
  const source = fs.readFileSync(path.join(__dirname, 'content-studio-part-b-tools.js'), 'utf8');
  const left = question('mc', { versionLabels: ['Older form'] });
  const right = {id:'tei',type:'category_sort',prompt:left.prompt,stimulus:left.stimulus,instructions:'Drag one sentence into the box.',items:[{id:'s1',text:'Sentence 1'},{id:'s2',text:'Sentence 2'}],categories:[{id:'answer',title:'Sentence with an error'}],correctPlacements:{s2:'answer'},requiredPlacements:1,versionLabels:['Newer form']};
  const app = { state: {standaloneItems:[left,right],tests:[]}, standaloneDraft:left };
  const ui = vm.runInNewContext(source+'\nPartBTools;', {app,PartBBank:bank,escapeHtml:String,structuredClone});
  const a=ui.card(left),b=ui.card(right);
  assert.match(a, /Multiple choice/);assert.match(b,/TEI · Drag and drop/);
  assert.match(a, /<iframe/);assert.match(b, /<iframe/);
  assert.doesNotMatch(b, /<ol|<li>/, 'TEI items must never be flattened into a multiple-choice list');
  assert.match(ui.mergeActions({left,right},0),/Different interaction types/);
  const html=fs.readFileSync(path.join(__dirname,'content-studio.html'),'utf8');
  const start=html.indexOf('    function sendMathPreview(frame) {'),end=html.indexOf("    window.addEventListener('message'",start);
  const send=vm.runInNewContext(html.slice(start,end)+'\nsendMathPreview;', {app,PartBTools:ui,clone:structuredClone,location:{origin:'http://localhost'}});
  const payloads=[];
  for (const markup of [a,b]) {
    const key=markup.match(/data-math-student-preview="([^"]+)"/)[1];
    send({dataset:{mathStudentPreview:key},contentWindow:{postMessage:value=>payloads.push(value)}});
  }
  assert.deepEqual(payloads.map(p=>p.preview.question.id),['mc','tei']);
  assert.equal(payloads[1].preview.question.type,'category_sort');
  assert.deepEqual(payloads[1].preview.question.categories,right.categories);
  assert.deepEqual(payloads[1].preview.question.correctPlacements,right.correctPlacements);
  assert.equal(payloads[1].preview.question.instructions,right.instructions);
  assert.equal(payloads[1].preview.subject,'english');
  right.items[0].text='Changed after rendering';
  assert.equal(payloads[1].preview.question.items[0].text,'Sentence 1');
  const hot={...left,id:'hot',selectionHtml:'<p><span data-choice-id="A">Sentence 1</span></p>'};
  assert.match(ui.card(hot),/TEI · Hot text/);
});
