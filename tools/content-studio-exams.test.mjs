import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

test('new exams are locked, registered, editable, unique, and protected by editor authorization', async () => {
  const toolsRoot = dirname(fileURLToPath(import.meta.url));
  const root = resolve(toolsRoot, '..');
  // Keep generated copies out of watched content folders while the real editor
  // and development servers are running in the same working tree.
  const fixtureRoot = join(toolsRoot, '.content-drafts');
  await mkdir(fixtureRoot, { recursive: true });
  const fixture = await mkdtemp(join(fixtureRoot, 'exam-test-'));
  const modulePath = join(toolsRoot, `.exam-create-test-${Date.now()}.mjs`);
  let server;
  try {
    await mkdir(join(fixture, 'client/src'), { recursive: true });
    await mkdir(join(fixture, 'server/data'), { recursive: true });
    await mkdir(join(fixture, 'tools'), { recursive: true });
    await cp(join(root, 'client/src/content'), join(fixture, 'client/src/content'), { recursive: true });
    await cp(join(root, 'server/src/shared'), join(fixture, 'server/src/shared'), { recursive: true });
    await mkdir(join(fixture, 'client/src/lib'), { recursive: true });
    await cp(join(root, 'client/src/lib/studentMaterials.ts'), join(fixture, 'client/src/lib/studentMaterials.ts'));
    await cp(join(root, 'server/data/assessments.json'), join(fixture, 'server/data/assessments.json'));
    await writeFile(join(fixture, 'server/data/question-bank.json'), JSON.stringify({ revision: 0, questions: [], sets: [] }));
    await cp(join(toolsRoot, 'practice-topics.json'), join(fixture, 'tools/practice-topics.json'));
    await cp(join(toolsRoot, 'content-topics.json'), join(fixture, 'tools/content-topics.json'));
    await cp(join(toolsRoot, 'math-topics.json'), join(fixture, 'tools/math-topics.json'));
    await cp(join(toolsRoot, 'content-studio-glossary.js'), join(fixture, 'tools/content-studio-glossary.js'));
    await cp(join(toolsRoot, 'poem-layout.js'), join(fixture, 'tools/poem-layout.js'));
    const source = (await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8'))
      .replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(fixture)};`)
      .split('if (process.argv.includes("--validate"))')[0] + '\nexport { bulkPassageCategory, deletePassage, handleRequest, getState, previewPassageImport, savePassage, saveAdvancedPassage, saveStandaloneItem, saveTest };\n';
    await writeFile(modulePath, source);
    const studio = await import(pathToFileURL(modulePath).href);
    server = createServer(studio.handleRequest);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/exams`;
    const state = await studio.getState();
    // A missing workspace asset reports failure without crashing the local server.
    const missingAsset = await fetch(`http://127.0.0.1:${server.address().port}/content-studio-workspace.css`);
    assert.equal(missingAsset.status, 500);
    assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/api/state`)).status, 200);
    const bankUrl = `http://127.0.0.1:${server.address().port}/api/question-bank`;
    const postBank = (path, body, token = state.editToken) => fetch(bankUrl + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
    const captured = { subject: 'English', source: 'SHSAT Lab', sourceUrl: 'https://www.shsatlab.com/units/unit-7/practice', sourceUnit: 7, sourceTopic: 'Evidence & Support', difficulty: 'easy', prompt: 'Synthetic fixture: which evidence supports the claim?', choices: ['A','B','C','D'].map(id => ({ id, text: `Choice ${id}` })), correctChoiceId: 'A', explanation: 'A supports the claim.', passage: { title: 'Synthetic fixture', text: 'A first paragraph.\n\nA second paragraph.', format: 'prose' } };
    const captureBody = { revision: 0, capture: { format: 'nathan-tutors-shsatlab-ela-v1', questions: [captured] } };
    assert.equal((await postBank('/import', captureBody, 'invalid')).status, 403);
    const imported = await postBank('/import', captureBody); assert.equal(imported.status, 201);
    const importedBank = (await imported.json()).bank; assert.equal(importedBank.questions[0].status, 'draft');
    assert.equal((await postBank('/import', captureBody)).status, 400); // Stale revision.
    assert.equal((await postBank('/publish', { revision: 1, id: importedBank.questions[0].id, question: captured })).status, 400);
    const published = await postBank('/publish', { revision: 1, id: importedBank.questions[0].id, question: captured, verified: true }); assert.equal(published.status, 201);
    const publishedBank = (await published.json()).bank;
    assert.equal((await postBank('/sets', { revision: 2, title: 'Fixture set', questionIds: [publishedBank.questions[0].id] })).status, 201);
    assert.equal((await fetch(bankUrl).then(r => r.json())).sets.length, 1);
    // Bulk publication uses a single revision, preserves published sets, and keeps
    // incomplete / missing-visual items as drafts rather than inventing content.
    const beforeBulk = await fetch(bankUrl).then(r => r.json());
    const bulkCaptures = [
      { ...captured, prompt: 'Bulk ready one' },
      { ...captured, prompt: 'Bulk no explanation', explanation: '' },
      { ...captured, prompt: 'Bulk unknown level', difficulty: 'unknown' },
      { ...captured, prompt: 'Bulk missing visual file', visuals: ['Required figure'], visualImage: { src: '/exam-images/bulk-missing.png', alt: 'Required figure' } },
      { ...captured, prompt: 'Bulk ready visual', visuals: ['Required figure'], visualImage: { src: '/exam-images/bulk-present.svg', alt: 'Required figure' } },
    ];
    await mkdir(join(fixture, 'client/public/exam-images'), { recursive: true });
    await writeFile(join(fixture, 'client/public/exam-images/bulk-present.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="3"/></svg>');
    const bulkImport = await postBank('/import', { revision: beforeBulk.revision, capture: { format: 'nathan-tutors-shsatlab-ela-v1', questions: bulkCaptures } });
    assert.equal(bulkImport.status, 201); const bulkBank = (await bulkImport.json()).bank;
    const bulkBody = { revision: bulkBank.revision, questionIds: bulkBank.questions.filter(q => q.status === 'draft').map(q => q.id), verified: true };
    assert.equal((await postBank('/publish-all', bulkBody, 'invalid')).status, 403);
    assert.equal((await fetch(bankUrl + '/publish-all', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': state.editToken, origin: 'https://untrusted.example' }, body: JSON.stringify(bulkBody) })).status, 403);
    assert.equal((await postBank('/publish-all', { ...bulkBody, verified: false })).status, 400);
    assert.equal((await postBank('/publish-all', { ...bulkBody, revision: bulkBank.revision - 1 })).status, 400);
    assert.equal((await postBank('/publish-all', { ...bulkBody, questionIds: [publishedBank.questions[0].id, bulkBody.questionIds[0]] })).status, 400);
    const bulkResponse = await postBank('/publish-all', bulkBody); assert.equal(bulkResponse.status, 201);
    const bulkResult = await bulkResponse.json(); assert.equal(bulkResult.summary.published, 2); assert.equal(bulkResult.summary.skipped.length, 3);
    assert.ok(bulkResult.summary.skipped.some(item => /file not found/.test(item.reason)));
    assert.equal(bulkResult.bank.revision, bulkBank.revision + 1);
    assert.deepEqual(bulkResult.bank.sets, beforeBulk.sets); assert.deepEqual(bulkResult.bank.questions[0], beforeBulk.questions[0]);
    assert.equal(bulkResult.bank.questions.find(q => q.prompt === 'Bulk no explanation').status, 'draft');
    assert.equal(bulkResult.bank.questions.find(q => q.prompt === 'Bulk ready visual').status, 'published');
    // The guided import previews without writing and commits import, publication
    // and fixed-set creation together only for the exact previewed revision.
    const quickCapture = [{ name: 'one.json', text: JSON.stringify({ ...captured, prompt: 'Quick import ready' }) }, { name: 'visual.json', text: JSON.stringify({ ...captured, prompt: 'Quick import missing image', visuals: ['Figure'], visualImage: { src: '/exam-images/quick-missing.png', alt: 'Required figure' } }) }];
    const previewBody = { revision: bulkResult.bank.revision, capture: quickCapture };
    assert.equal((await postBank('/import-preview', previewBody, 'invalid')).status, 403);
    const previewResponse = await postBank('/import-preview', previewBody); assert.equal(previewResponse.status, 200);
    const preview = await previewResponse.json(); assert.equal(preview.summary.added, 2); assert.equal(preview.summary.ready, 1); assert.equal(preview.summary.needsReview, 1); assert.match(preview.rows[1].issue, /file not found/);
    assert.equal((await fetch(bankUrl).then(r => r.json())).revision, bulkResult.bank.revision);
    const quickBody = { ...previewBody, previewToken: preview.previewToken, publishReady: true, verified: true, createSet: true, setTitle: 'Quick batch practice' };
    assert.equal((await postBank('/import-batch', { ...quickBody, previewToken: 'changed' })).status, 400);
    assert.equal((await postBank('/import-batch', { ...quickBody, verified: false })).status, 400);
    assert.equal((await fetch(bankUrl).then(r => r.json())).revision, bulkResult.bank.revision);
    const quickResponse = await postBank('/import-batch', quickBody); assert.equal(quickResponse.status, 201);
    const quickResult = await quickResponse.json(); assert.equal(quickResult.bank.revision, bulkResult.bank.revision + 1); assert.equal(quickResult.summary.published, 1); assert.equal(quickResult.summary.set.questionIds.length, 1); assert.equal(quickResult.summary.skipped.length, 1);
    assert.equal((await postBank('/import-batch', quickBody)).status, 400);
    assert.deepEqual(state.passageCategories.map(category => category.value), ['official_handbook', 'prestige', 'miscellaneous']);
    assert.ok(state.passages.every(passage => state.passageCategories.some(category => category.value === passage.passageCategory)));
    for (const passage of state.passages) {
      const authored = await readFile(join(fixture, 'client/src/content/exams/passageSets', passage.fileName), 'utf8');
      const category = authored.match(/passageCategory:\s*["']([^"']+)["']/)?.[1];
      assert.equal(passage.passageCategory, category || 'miscellaneous');
    }
    const categoryTargets = state.passages.slice(0, 2);
    const categoryItems = categoryTargets.map(passage => ({ id: passage.id, sourceHash: passage.sourceHash }));
    const originalSources = await Promise.all(categoryTargets.map(passage => readFile(join(fixture, 'client/src/content/exams/passageSets', passage.fileName), 'utf8')));
    await assert.rejects(studio.bulkPassageCategory({ mode: 'exam', passageCategory: 'prestige', items: [categoryItems[0], { ...categoryItems[1], sourceHash: 'stale' }] }), /changed/);
    assert.deepEqual(await Promise.all(categoryTargets.map(passage => readFile(join(fixture, 'client/src/content/exams/passageSets', passage.fileName), 'utf8'))), originalSources);
    const categoryUrl = `http://127.0.0.1:${server.address().port}/api/passages/category`;
    assert.equal((await fetch(categoryUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': 'invalid' }, body: '{}' })).status, 403);
    await studio.bulkPassageCategory({ mode: 'exam', passageCategory: 'official_handbook', items: categoryItems });
    const afterBulk = await studio.getState();
    for (const original of categoryTargets) {
      const reopened = afterBulk.passages.find(passage => passage.id === original.id);
      assert.equal(reopened.passageCategory, 'official_handbook');
      assert.equal(reopened.text, original.text);
      assert.deepEqual(reopened.questions, original.questions);
    }
    const advancedBefore = afterBulk.advancedPassages[0];
    const advancedSaved = await studio.saveAdvancedPassage({ ...advancedBefore, passageCategory: 'prestige' });
    assert.equal(advancedSaved.passageCategory, 'prestige');
    const afterAdvanced = await studio.getState();
    assert.equal(afterAdvanced.advancedPassages.find(passage => passage.id === advancedBefore.id).passageCategory, 'prestige');
    const exportedCatalog = JSON.parse(await readFile(join(fixture, 'server/data/learning-catalog.json'), 'utf8'));
    assert.equal(exportedCatalog.find(content => content.aliases.includes(advancedBefore.id)).passageCategory, 'prestige');
    await assert.rejects(studio.savePassage({ ...categoryTargets[0], passageCategory: 'poetry' }), /valid Passage Category/);
    const originalPartBItem = state.standaloneItems[0];
    const partBVersionLabel = `Part B Form ${Date.now()}`;
    const savedPartBItem = await studio.saveStandaloneItem({
      item: { ...originalPartBItem, versionLabel: partBVersionLabel, explanation: 'The pronoun must identify its subject.', explanationHtml: 'The <strong>pronoun</strong> must identify its <em>subject</em>.', instructions: 'Choose one answer.' },
      originalId: originalPartBItem.id,
      sourceHash: state.standaloneSourceHash,
    });
    assert.equal(savedPartBItem.item.versionLabel, partBVersionLabel);
    assert.equal(savedPartBItem.item.explanation, 'The pronoun must identify its subject.');
    assert.equal(savedPartBItem.item.explanationHtml, 'The <strong>pronoun</strong> must identify its <em>subject</em>.');
    assert.equal(savedPartBItem.item.instructions, 'Choose one answer.');
    const reopenedPartB = (await studio.getState()).standaloneItems.find(item => item.id === originalPartBItem.id);
    assert.deepEqual(reopenedPartB, savedPartBItem.item);
    const dragPartB = state.standaloneItems.find(item => item.type === 'category_sort');
    const savedDragPartB = await studio.saveStandaloneItem({ item: { ...dragPartB, explanation: 'This sentence has an unclear pronoun.', explanationHtml: 'This sentence has an <u>unclear pronoun</u>.' }, originalId: dragPartB.id, sourceHash: savedPartBItem.sourceHash });
    const reopenedDragPartB = (await studio.getState()).standaloneItems.find(item => item.id === dragPartB.id);
    assert.equal(reopenedDragPartB.explanationHtml, savedDragPartB.item.explanationHtml);
    assert.deepEqual(reopenedDragPartB.correctPlacements, dragPartB.correctPlacements);
    // Part B imports stay out of student content until the teacher completes them.
    const partBUrl = `http://127.0.0.1:${server.address().port}`;
    const partBRequest = async (path, body, method = 'POST', token = state.editToken) => {
      const response = await fetch(partBUrl + path, { method, headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
      return { status: response.status, data: await response.json() };
    };
    const promptResponse = await fetch(partBUrl + '/api/standalone-import/prompt');
    assert.equal(promptResponse.status, 200);
    const partBPrompt = (await promptResponse.json()).prompt;
    assert.match(partBPrompt, /nathan-tutors-part-b-v1/); assert.match(partBPrompt, /NEVER solve or guess/); assert.match(partBPrompt, /underlining, bold and italics/);
    const incoming = { type: 'multiple_choice', prompt: 'Which revision fixes the pronoun?', promptHtml: 'Which <strong>revision</strong> fixes the pronoun?<script>alert(1)</script>', stimulus: '(1) Alex and Jo went home. (2) She called later.', stimulusHtml: '(1) Alex and Jo went home. (2) <u onclick="bad()">She</u> called later.', choices: ['E','F','G'].map(id => ({id, text:`Answer ${id}`, html:`<em>Answer ${id}</em>`})), correctChoiceId:'', topic:'', explanation:'', sourceQuestion:'9' };
    assert.equal((await partBRequest('/api/standalone-import', {source:JSON.stringify(incoming)}, 'POST', 'bad-token')).status, 403);
    const importedPartB = await partBRequest('/api/standalone-import', {sources:[JSON.stringify({format:'nathan-tutors-part-b-v1', questions:[incoming]})]});
    assert.equal(importedPartB.status, 200, JSON.stringify(importedPartB.data)); assert.equal(importedPartB.data.added.length, 1);
    let entry = importedPartB.data.drafts.find(entry => entry.id === importedPartB.data.added[0]);
    assert.equal(entry.original.choices.length, 3); assert.equal(entry.question.choices.length, 4); assert.equal(entry.question.choices[3].text, ''); assert.equal(entry.question.correctChoiceId, '');
    assert.equal(entry.question.choices[0].id, 'A'); assert.match(entry.question.stimulusHtml, /<u>She<\/u>/); assert.doesNotMatch(entry.question.promptHtml, /script|alert/); assert.doesNotMatch(entry.question.stimulusHtml, /onclick/);
    assert.equal((await studio.getState()).standaloneItems.some(item => item.id === entry.question.id), false);
    assert.equal((await partBRequest('/api/standalone-drafts/publish', {id:entry.id,version:entry.version,question:entry.question,sourceHash:savedDragPartB.sourceHash})).status, 400);
    assert.equal((await partBRequest('/api/standalone-drafts', {id:entry.id,version:0,question:entry.question}, 'PUT')).status, 409);
    const edited = { ...entry.question, prompt: 'Teacher edited prompt', promptHtml:'Teacher <strong>edited</strong> prompt' };
    const savedDraft = await partBRequest('/api/standalone-drafts', {id:entry.id,version:entry.version,question:edited}, 'PUT');
    assert.equal(savedDraft.status, 200); entry = savedDraft.data.entry;
    const repeated = await partBRequest('/api/standalone-import', {source:JSON.stringify(incoming)});
    assert.equal(repeated.data.added.length, 0); assert.equal(repeated.data.existing[0], entry.id); assert.equal(repeated.data.drafts.find(item => item.id === entry.id).question.prompt, 'Teacher edited prompt');
    const beforeInvalid = (await studio.getState()).standaloneImportDrafts.length;
    assert.equal((await partBRequest('/api/standalone-import', {sources:[JSON.stringify({...incoming,prompt:'Must not partially save'}),'{bad json']})).status, 400);
    assert.equal((await studio.getState()).standaloneImportDrafts.length, beforeInvalid);
    const completed = { ...entry.question, topic:'Pronouns', correctChoiceId:'B', choices:entry.question.choices.map((choice,i)=>({...choice,text:choice.text || 'Fourth source choice',html:i === 3 ? 'Fourth source choice' : choice.html})), explanation:'The pronoun has no clear antecedent.', explanationHtml:'The <em>pronoun</em> has no clear antecedent.' };
    const publishedPartB = await partBRequest('/api/standalone-drafts/publish', {id:entry.id,version:entry.version,question:completed,sourceHash:savedDragPartB.sourceHash});
    assert.equal(publishedPartB.status, 200, JSON.stringify(publishedPartB.data));
    const publishedState = await studio.getState();
    assert.equal(publishedState.standaloneImportDrafts.some(item => item.id === entry.id), false);
    const publishedQuestion = publishedState.standaloneItems.find(item => item.id === publishedPartB.data.id);
    assert.equal(publishedQuestion.correctChoiceId, 'B'); assert.equal(publishedQuestion.explanationHtml, completed.explanationHtml); assert.equal(publishedQuestion.importDraftId, undefined);
    const repeatPublished = await partBRequest('/api/standalone-import', {source:JSON.stringify(incoming)});
    assert.equal(repeatPublished.data.added.length, 0); assert.equal(repeatPublished.data.published[0], publishedQuestion.id);
    const otherImports = await Promise.all([
      partBRequest('/api/standalone-import', {source:JSON.stringify({...dragPartB,id:'source-drag-import',correctPlacements:{},prompt:'Incomplete drag source'})}),
      partBRequest('/api/standalone-import', {source:JSON.stringify({...incoming,type:'unsupported-interaction',prompt:'Unusual source'})}),
    ]);
    for (const response of otherImports) assert.equal(response.status, 200, JSON.stringify(response.data));
    const remainingDrafts = (await studio.getState()).standaloneImportDrafts;
    assert.equal(remainingDrafts.length, 2);
    assert.deepEqual(remainingDrafts.find(entry=>entry.question.type === 'category_sort').question.correctPlacements, {});
    assert.ok(remainingDrafts.find(entry=>entry.original.type === 'unsupported-interaction').notes.some(note=>note.includes('manual setup')));
    const deleteTarget = remainingDrafts[0];
    const deleteRequest = {id:deleteTarget.id, version:deleteTarget.version};
    const bankBeforeDelete = await readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8');
    assert.equal((await partBRequest('/api/standalone-drafts', deleteRequest, 'DELETE', 'bad-token')).status, 403);
    assert.equal((await partBRequest('/api/standalone-drafts', {...deleteRequest,version:0}, 'DELETE')).status, 409);
    assert.equal((await partBRequest('/api/standalone-drafts', {id:entry.id,version:entry.version}, 'DELETE')).status, 409, 'Published questions cannot be deleted through draft deletion');
    const deletedPartB = await partBRequest('/api/standalone-drafts', deleteRequest, 'DELETE');
    assert.equal(deletedPartB.status, 200, JSON.stringify(deletedPartB.data));
    assert.equal(deletedPartB.data.deleted, deleteTarget.id);
    assert.equal(deletedPartB.data.drafts.length, 1);
    assert.equal(deletedPartB.data.drafts[0].id, remainingDrafts[1].id);
    assert.equal((await studio.getState()).standaloneImportDrafts.some(item=>item.id === deleteTarget.id), false);
    assert.equal((await partBRequest('/api/standalone-drafts', deleteRequest, 'DELETE')).status, 404);
    assert.equal(await readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8'), bankBeforeDelete);
    const reimportedPartB = await partBRequest('/api/standalone-import', {source:JSON.stringify(deleteTarget.original)});
    assert.equal(reimportedPartB.status, 200); assert.equal(reimportedPartB.data.added.length, 1);
    assert.notEqual(reimportedPartB.data.added[0], deleteTarget.id, 'Reimports receive a fresh ID so a stale editor cannot modify or delete them');
    assert.equal((await partBRequest('/api/standalone-drafts', deleteRequest, 'DELETE')).status, 404);
    assert.equal((await partBRequest('/api/standalone-drafts', {...deleteRequest,question:deleteTarget.question}, 'PUT')).status, 404);
    const standaloneSource = await readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8');
    assert.match(standaloneSource, /versionLabel\?: string/);
    assert.match(standaloneSource, new RegExp(`"versionLabel": "${partBVersionLabel}"`));
    assert.match(standaloneSource, /delete \(studentQuestion as ExamQuestion & \{ versionLabel\?: string \}\)\.versionLabel/);
    // Multiple source tags survive saves and a repeat import reuses one active
    // bank question while retaining the imported content for older references.
    const repeatState = await studio.getState();
    const repeat = { ...publishedQuestion, id: 'test-repeat-source', versionLabels: ['Repeat Form A', 'Repeat Form B'] };
    const repeatImport = await partBRequest('/api/standalone-import', { source: JSON.stringify(repeat) });
    const repeatEntry = repeatImport.data.drafts.find(entry => repeatImport.data.added.includes(entry.id));
    assert.deepEqual(repeatEntry.question.versionLabels, ['Repeat Form A', 'Repeat Form B']);
    const repeatPublishedResult = await partBRequest('/api/standalone-drafts/publish', { id: repeatEntry.id, version: repeatEntry.version, question: repeatEntry.question, sourceHash: repeatState.standaloneSourceHash });
    assert.equal(repeatPublishedResult.status, 200, JSON.stringify(repeatPublishedResult.data));
    assert.equal(repeatPublishedResult.data.reused, true); assert.equal(repeatPublishedResult.data.id, publishedQuestion.id);
    const afterRepeat = await studio.getState();
    assert.deepEqual(afterRepeat.standaloneItems.find(q => q.id === publishedQuestion.id).versionLabels, ['Repeat Form A', 'Repeat Form B']);
    assert.equal(afterRepeat.standaloneItems.find(q => q.id === repeatEntry.question.id).duplicateOf, publishedQuestion.id);
    assert.equal(afterRepeat.standaloneImportDrafts.some(entry => entry.id === repeatEntry.id), false);
    assert.equal(afterRepeat.standaloneItems.filter(q => !q.duplicateOf && q.prompt === publishedQuestion.prompt).length, 1);
    // Seed two pre-existing copies to exercise the explicit comparison action.
    const beforeCombineSource = await readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8');
    const arrayStart = beforeCombineSource.indexOf(' = ') + 3;
    const arrayEnd = beforeCombineSource.indexOf(';\n\nexport function');
    const copies = ['left', 'right'].map(side => ({ ...publishedQuestion, id: `manual-repeat-${side}`, prompt: 'Manual repeat fixture', promptHtml: 'Manual repeat fixture', versionLabels: [`Source ${side}`], points: side === 'left' ? 2 : 1 }));
    const seeded = [...JSON.parse(beforeCombineSource.slice(arrayStart, arrayEnd)), ...copies];
    await writeFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), beforeCombineSource.slice(0, arrayStart) + JSON.stringify(seeded, null, 2) + beforeCombineSource.slice(arrayEnd));
    const combineState = await studio.getState();
    const combineBody = { keepId: copies[1].id, removeId: copies[0].id, sourceHash: combineState.standaloneSourceHash };
    assert.equal((await partBRequest('/api/standalone-items/combine', combineBody, 'POST', 'bad')).status, 403);
    assert.equal((await partBRequest('/api/standalone-items/combine', { ...combineBody, sourceHash: 'stale' })).status, 409);
    assert.equal((await partBRequest('/api/standalone-items/combine', combineBody)).status, 400);
    const combined = await partBRequest('/api/standalone-items/combine', { ...combineBody, verifiedSameQuestion: true });
    assert.equal(combined.status, 200, JSON.stringify(combined.data));
    assert.deepEqual(combined.data.item.versionLabels, ['Source right', 'Source left']);
    const reloadedCombined = (await studio.getState()).standaloneItems.filter(q => q.id.startsWith('manual-repeat-'));
    assert.equal(reloadedCombined.filter(q => !q.duplicateOf).length, 1);
    assert.deepEqual(reloadedCombined.find(q => !q.duplicateOf).versionLabels, ['Source right', 'Source left']);
    const retained = combined.data.items.find(q => q.id === copies[0].id);
    assert.deepEqual(retained, { ...copies[0], duplicateOf: copies[1].id });
    assert.equal((await partBRequest('/api/standalone-items', { item: copies[0], originalId: copies[0].id, sourceHash: combined.data.sourceHash })).status, 409);
    const clearedTags = await partBRequest('/api/standalone-items', { item: { ...combined.data.item, versionLabels: [] }, originalId: copies[1].id, sourceHash: combined.data.sourceHash });
    assert.equal(clearedTags.status, 201, JSON.stringify(clearedTags.data));
    assert.deepEqual(clearedTags.data.standalone.item.versionLabels, []);
    assert.equal(clearedTags.data.standalone.item.versionLabel, undefined);
    assert.equal((await studio.getState()).standaloneItems.find(q => q.id === copies[0].id).duplicateOf, copies[1].id);
    // An imported repeat can be verified directly, without first publishing a
    // conflicting second bank question. Its source is archived after success.
    const directImport = await partBRequest('/api/standalone-import', { source: JSON.stringify({ ...combined.data.item, id: 'direct-repeat-import', points: 2, versionLabels: ['Imported Form'] }) });
    const directEntry = directImport.data.drafts.find(entry => directImport.data.added.includes(entry.id));
    const directBody = { keepId: copies[1].id, removeId: directEntry.question.id, drafts: [{ id: directEntry.id, version: directEntry.version }], verifiedSameQuestion: true, sourceHash: (await studio.getState()).standaloneSourceHash };
    assert.equal((await partBRequest('/api/standalone-items/combine', directBody, 'POST', 'invalid')).status, 403);
    assert.equal((await partBRequest('/api/standalone-items/combine', { ...directBody, verifiedSameQuestion: false })).status, 400);
    assert.equal((await partBRequest('/api/standalone-items/combine', { ...directBody, drafts: [{ id: directEntry.id, version: 0 }] })).status, 409);
    assert.equal((await partBRequest('/api/standalone-items/combine', { ...directBody, sourceHash: 'stale' })).status, 409);
    assert.ok((await studio.getState()).standaloneImportDrafts.some(entry => entry.id === directEntry.id));
    const directCombined = await partBRequest('/api/standalone-items/combine', directBody);
    assert.equal(directCombined.status, 200, JSON.stringify(directCombined.data));
    assert.deepEqual(directCombined.data.item.versionLabels, ['Imported Form']);
    assert.equal(directCombined.data.item.points, 1, 'The selected bank copy keeps its grading');
    assert.equal(directCombined.data.items.some(item => item.id === directEntry.question.id), false, 'An unpublished duplicate needs no exported bank alias');
    assert.equal(directCombined.data.drafts.some(entry => entry.id === directEntry.id), false);
    const directReload = await studio.getState();
    assert.equal(directReload.standaloneImportDrafts.some(entry => entry.id === directEntry.id), false);
    assert.deepEqual(directReload.standaloneItems.find(item => item.id === copies[1].id).versionLabels, ['Imported Form']);
    assert.equal((await partBRequest('/api/standalone-import', { source: JSON.stringify(directEntry.original) })).data.published[0], copies[1].id);
    const keepDraftImport = await partBRequest('/api/standalone-import', { source: JSON.stringify({ ...combined.data.item, points: 2, versionLabels: ['New Form'] }) });
    const keepDraftEntry = keepDraftImport.data.drafts.find(entry => keepDraftImport.data.added.includes(entry.id));
    const keepDraftBody = { keepId: keepDraftEntry.question.id, removeId: copies[1].id, verifiedSameQuestion: true, sourceHash: directReload.standaloneSourceHash, drafts: [{ id: keepDraftEntry.id, version: keepDraftEntry.version, question: { ...keepDraftEntry.question, points: 3 } }] };
    const invalidKeepDraft = await partBRequest('/api/standalone-items/combine', { ...keepDraftBody, drafts: [{ ...keepDraftBody.drafts[0], question: { ...keepDraftBody.drafts[0].question, topic: '' } }] });
    assert.equal(invalidKeepDraft.status, 400, JSON.stringify(invalidKeepDraft.data));
    assert.ok((await studio.getState()).standaloneImportDrafts.some(entry => entry.id === keepDraftEntry.id));
    const keptDraft = await partBRequest('/api/standalone-items/combine', keepDraftBody);
    assert.equal(keptDraft.status, 200, JSON.stringify(keptDraft.data));
    assert.equal(keptDraft.data.item.id, keepDraftEntry.question.id);
    assert.equal(keptDraft.data.item.points, 3, 'Verification includes current draft edits');
    assert.deepEqual(keptDraft.data.item.versionLabels, ['New Form', 'Source left', 'Imported Form']);
    assert.equal(keptDraft.data.items.find(item => item.id === copies[1].id).duplicateOf, keptDraft.data.item.id);
    assert.equal(keptDraft.data.items.find(item => item.id === copies[0].id).duplicateOf, keptDraft.data.item.id);
    assert.equal((await studio.getState()).standaloneImportDrafts.some(entry => entry.id === keepDraftEntry.id), false);
    const send = (body, token = state.editToken, origin = '') => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-editor-token': token, ...(origin ? { origin } : {}) },
      body: JSON.stringify(body),
    });
    assert.equal((await send({ title: 'New example' }, 'invalid')).status, 403);
    assert.equal((await send({ title: 'New example' }, state.editToken, 'https://untrusted.example')).status, 403);
    assert.equal((await send({ title: ' ' }, 'stale-token', new URL(url).origin)).status, 400);
    assert.equal((await send({ title: ' ', durationMinutes: 180 })).status, 400);
    assert.equal((await send({ title: 'Example test', durationMinutes: 0 })).status, 400);
    const created = await send({ title: 'Example new exam', examLabel: 'Mock exams', durationMinutes: 90, description: 'A past paper test.' });
    const payload = await created.json();
    assert.equal(created.status, 201, JSON.stringify(payload));
    assert.equal(payload.assessment.examLabel, 'Mock exams');
    const labelUrl = `${url}/${payload.assessment.id}/label`;
    const relabel = (value, token = state.editToken) => fetch(labelUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify({ examLabel: value }) });
    assert.equal((await relabel('Official practice', 'invalid')).status, 403);
    assert.equal((await relabel('x'.repeat(61))).status, 400);
    assert.equal((await relabel('Publisher collection')).status, 200);
    const labeled = (await studio.getState()).assessments.find(item => item.id === payload.assessment.id);
    assert.equal(labeled.examLabel, 'Publisher collection'); assert.equal(labeled.status, 'locked');
    assert.deepEqual(labeled.questions, payload.assessment.questions);
    const createLabel = (label, token = state.editToken) => fetch(new URL('/api/exam-labels', url), { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify({ label }) });
    assert.equal((await createLabel('Weekly quizzes', 'invalid')).status, 403);
    assert.equal((await createLabel(' ')).status, 400);
    assert.equal((await createLabel('x'.repeat(61))).status, 400);
    assert.equal((await createLabel('Weekly quizzes')).status, 201);
    assert.equal((await createLabel('WEEKLY QUIZZES')).status, 409);
    assert.equal((await createLabel('Publisher collection')).status, 409);
    const labelState = await studio.getState();
    assert.ok(labelState.examLabels.includes('Weekly quizzes'));
    assert.ok(!labelState.assessments.some(item => item.examLabel === 'Weekly quizzes'));
    assert.deepEqual(JSON.parse(await readFile(join(fixture, 'tools/exam-labels.json'), 'utf8')), labelState.examLabels);

    assert.equal(payload.assessment.correctionsOpen, false);
    assert.deepEqual(payload.assessment.sectionAccess, { english: false, math: false });
    assert.equal(payload.assessment.status, 'locked');
    assert.equal((await send({ title: 'Example new exam' })).status, 409);
    const refreshed = await studio.getState();
    const exam = refreshed.tests.find(test => test.assessmentId === payload.assessment.id);
    assert.ok(exam); assert.equal(exam.passageIds.length, 0);
    const passageImportDocument = {
      format: 'nathan-tutors-official-passage-v1',
      passage: {
        title: 'Importer Fixture Passage',
        author: 'Test Author',
        blurb: '',
        format: 'prose',
        passageType: 'informational',
        section: 'reading',
        label: 'ELA - Reading Comprehension',
        sourceNote: '',
        teacherSource: 'Official fixture PDF, printed pages 10-12, questions 1-2',
        versionLabel: '2020-2021 Form B',
        text: 'First paragraph.\n\nSecond paragraph.',
        questions: [{
          id: 'passage-1',
          type: 'multiple_choice',
          topic: 'Central Idea & Theme',
          points: 1,
          prompt: 'What is the central idea?',
          choices: ['First', 'Second', 'Third', 'Fourth'].map((text, index) => ({ id: String.fromCharCode(65 + index), text })),
          correctChoiceId: 'B',
          explanation: 'B is correct because the second paragraph states the controlling idea. A, C, and D are contradicted by the passage.',
        }],
      },
      reviewNotes: ['Question 1 answer was inferred because the PDF had no answer key.'],
      visuals: [{ scope: 'Passage', description: 'A map appears above the text.' }],
    };
    const passageImport = await studio.previewPassageImport({ source: `\`\`\`json\n${JSON.stringify(passageImportDocument)}\n\`\`\`` });
    const workspaceCode = await readFile(join(toolsRoot, 'content-studio-workspace.js'), 'utf8');
    const ui = vm.runInNewContext(`${workspaceCode}\nstudioUI;`, { URL });
    const readerDocument = {
      schemaVersion: 3,
      source: { url: 'https://tutor.thesatcrashcourse.com/tests/digital-shsat/fixture' },
      testPreview: {
        testTitle: 'SAT Reader Integration Fixture', module: 'English Language Arts',
        capture: { mode: 'passage-all', warnings: [], restoredStartingQuestion: true },
        questions: Array.from({ length: 7 }, (_, index) => ({
          number: index + 10, passage: { id: 'reader-fixture-p1', text: 'First paragraph.\n\nSecond paragraph.' },
          prompt: `Reader prompt ${index + 10}`, explanation: `Reader explanation ${index + 10}`,
          choices: ['A', 'B', 'C', 'D'].map(label => ({ label, text: `Reader choice ${label}`, isCorrect: label === 'D' })),
          correctAnswer: { label: 'D', text: 'Reader choice D' },
        })),
      },
    };
    const converted = ui.convertSatCrashCourseImport(JSON.stringify(readerDocument));
    const readerPreview = await studio.previewPassageImport({ source: JSON.stringify(converted) });
    assert.equal(readerPreview.passage.questions.length, 7);
    assert.equal(readerPreview.passage.questions[6].correctChoiceId, 'D');
    assert.equal(readerPreview.passage.questions[6].explanation, 'Reader explanation 16');
    assert.match(readerPreview.passage.teacherSource, /original questions 10, 11, 12, 13, 14, 15, 16/);
    assert.match(readerPreview.warnings.join('\n'), /Verify the complete source transcription/);
    assert.doesNotMatch(readerPreview.warnings.join('\n'), /ChatGPT may have solved/);
    assert.equal(passageImport.format, 'nathan-tutors-official-passage-v1');
    assert.equal(passageImport.passage.id, 'importer-fixture-passage-2020-2021-form-b');
    assert.equal(passageImport.passage.questions[0].id, 'passage-1');
    assert.match(passageImport.passage.questions[0].explanation, /B is correct/);
    assert.doesNotMatch(passageImport.warnings.join('\n'), /no answer explanation/);
    assert.match(passageImport.warnings.join('\n'), /inferred because the PDF had no answer key/);
    assert.match(passageImport.warnings.join('\n'), /map appears above the text/);
    const missingExplanationImport = await studio.previewPassageImport({
      source: JSON.stringify({
        ...passageImportDocument,
        passage: {
          ...passageImportDocument.passage,
          title: 'Importer Fixture Without Explanation',
          questions: passageImportDocument.passage.questions.map(({ explanation, ...question }) => question),
        },
      }),
    });
    assert.match(missingExplanationImport.warnings.join('\n'), /No source explanation supplied/);
    const unknownTopic = await studio.previewPassageImport({ source: JSON.stringify({ ...passageImportDocument, passage: { ...passageImportDocument.passage, questions: passageImportDocument.passage.questions.map(q => ({ ...q, topic: "Invented Topic" })) } }) });
    assert.match(unknownTopic.warnings.join('\n'), /Choose a supported topic/);
    const revisingImportDocument = {
      ...passageImportDocument,
      passage: {
        ...passageImportDocument.passage,
        label: 'ELA - Revising/Editing Part A',
        section: 'revising_editing_a',
        title: 'Revising Importer Fixture Passage',
        questions: passageImportDocument.passage.questions.map(question => ({
          ...question,
          topic: 'Sentence Structure',
        })),
      },
    };
    const revisingPassageImport = await studio.previewPassageImport({
      source: JSON.stringify(revisingImportDocument),
    });
    assert.equal(revisingPassageImport.passage.section, 'revising_editing_a');
    assert.equal(revisingPassageImport.passage.questions[0].topic, 'Sentence Structure');
    const crossSection = await studio.previewPassageImport({ source: JSON.stringify({ ...revisingImportDocument, passage: { ...revisingImportDocument.passage, questions: revisingImportDocument.passage.questions.map(q => ({ ...q, topic: "Inference" })) } }) });
    assert.match(crossSection.warnings.join('\n'), /Choose a supported topic/);
    const exported = JSON.parse(await readFile(join(fixture, 'server/data/exam-content.json'), 'utf8'));
    assert.equal(exported[payload.assessment.id].passageSets.length, 0);
    const originalPassage = refreshed.passages.find(passage => passage.title === 'A Miracle Mile') || refreshed.passages[0];
    await assert.rejects(
      studio.savePassage({ ...originalPassage, passageType: '', section: 'reading' }),
      /Library passage type/,
    );
    await assert.rejects(
      studio.savePassage({ ...originalPassage, section: '' }),
      /Exam section/,
    );
    const versionLabel = `Automated Test ${Date.now()}`;
    const version = await studio.savePassage({
      ...originalPassage,
      text: 'First serial.\n\nSecond serial.',
      richText: '<p>First <span data-glossary-definition="A &quot;story&quot; &amp; &lt;series&gt;." onclick="alert(1)" style="color:red">serial</span>.</p><p>Second serial.</p>',
      directions: undefined,
      exportName: '',
      fileName: '',
      id: '',
      passageSetId: '',
      questions: originalPassage.questions.map((question, index) => ({
        ...question,
        ...(index === 0 ? {
          explanation: 'The keyed answer is supported by the passage.',
          explanationHtml: '<p>The keyed answer is <strong>supported</strong> by the passage.</p>',
          instructions: 'Choose the best answer.',
          instructionsHtml: 'Choose the <strong>best</strong> answer.',
        } : {}),
        id: `passage-${index + 1}`,
        topic: 'Sentence Structure',
      })),
      section: 'revising_editing_a',
      passageCategory: 'prestige',
      sourceHash: '',
      teacherSource: 'Teacher archive, practice set 4, page 18',
      versionLabel,
    });
    assert.match(version.id, /^a-miracle-mile-automated-test-\d+$/);
    assert.equal(version.versionLabel, versionLabel);
    assert.equal(version.teacherSource, 'Teacher archive, practice set 4, page 18');
    assert.equal(version.section, 'revising_editing_a');
    assert.equal(version.questions[0].explanation, 'The keyed answer is supported by the passage.');
    assert.equal(version.questions[0].explanationHtml, '<p>The keyed answer is <strong>supported</strong> by the passage.</p>');
    assert.equal(version.questions[0].instructionsHtml, 'Choose the <strong>best</strong> answer.');
    assert.equal(version.directions.title, 'REVISING/EDITING PART A');
    const glossaryHtml = '<p>First <span data-glossary-definition="A &quot;story&quot; &amp; &lt;series&gt;." role="link" tabindex="0">serial</span>.</p><p>Second serial.</p>';
    assert.equal(version.richText, glossaryHtml);
    const reopenedVersion = (await studio.getState()).passages.find(passage => passage.id === version.id);
    assert.equal(reopenedVersion.richText, glossaryHtml);
    assert.equal(reopenedVersion.text, 'First serial.\n\nSecond serial.');
    assert.equal(reopenedVersion.passageCategory, 'prestige');
    assert.equal(reopenedVersion.questions[0].instructionsHtml, 'Choose the <strong>best</strong> answer.');
    reopenedVersion.questions[0].instructions = '';
    reopenedVersion.questions[0].instructionsHtml = '';
    const editedVersion = await studio.savePassage({ ...reopenedVersion, passageCategory: 'official_handbook' });
    assert.equal(editedVersion.questions[0].instructions, undefined);
    assert.equal(editedVersion.questions[0].instructionsHtml, undefined);
    assert.equal(editedVersion.passageCategory, 'official_handbook');
    assert.equal((await studio.getState()).passages.find(passage => passage.id === version.id).passageCategory, 'official_handbook');
    assert.equal((reopenedVersion.richText.match(/data-glossary-definition/g) || []).length, 1);
    const seededWinterWheat = refreshed.passages.find(passage => passage.id === 'winter-wheat');
    assert.match(seededWinterWheat.richText, /data-glossary-definition="story published in short segments at regular intervals"/);
    assert.match(seededWinterWheat.richText, /data-glossary-definition="small gulch or ravine"/);
    assert.ok(version.questions.every(question => question.id.startsWith(`${version.id}-`)));
    const versionSource = await readFile(
      join(fixture, 'client/src/content/exams/passageSets', version.fileName),
      'utf8',
    );
    assert.match(versionSource, /teacherSource: "Teacher archive, practice set 4, page 18"/);
    assert.match(versionSource, /section: "revising_editing_a"/);
    assert.match(versionSource, /versionLabel: "Automated Test \d+"/);

    const deletionVersionLabel = `Delete Fixture ${Date.now()}`;
    const deletionFixture = await studio.savePassage({
      ...originalPassage,
      directions: undefined,
      exportName: '',
      fileName: '',
      id: '',
      passageSetId: '',
      questions: originalPassage.questions.map((question, index) => ({
        ...question,
        id: `passage-${index + 1}`,
      })),
      sourceHash: '',
      versionLabel: deletionVersionLabel,
    });
    const deleted = await studio.deletePassage({ id: deletionFixture.id, sourceHash: deletionFixture.sourceHash });
    assert.equal(deleted.id, deletionFixture.id);
    await assert.rejects(
      readFile(join(fixture, 'client/src/content/exams/passageSets', deletionFixture.fileName), 'utf8'),
      error => error?.code === 'ENOENT',
    );
    const passageLibraryAfterDelete = await readFile(join(fixture, 'client/src/content/exams/passageLibrary.ts'), 'utf8');
    assert.doesNotMatch(passageLibraryAfterDelete, new RegExp(`\\b${deletionFixture.exportName}\\b`));

    await studio.saveTest({ assessmentId: payload.assessment.id, readingPassageIds: [originalPassage.id], sourceHash: exam.sourceHash });
    let saved = await studio.getState();
    assert.equal(saved.assessments.find(item => item.id === payload.assessment.id).questions.length, originalPassage.questions.length);
    assert.deepEqual(saved.tests.find(item => item.assessmentId === payload.assessment.id).readingPassageIds, [originalPassage.id]);
    await assert.rejects(
      studio.saveTest({
        assessmentId: payload.assessment.id,
        readingPassageIds: [originalPassage.id, version.id],
        sourceHash: saved.tests.find(item => item.assessmentId === payload.assessment.id).sourceHash,
      }),
      /Choose only one version/,
    );
    await studio.saveTest({
      assessmentId: payload.assessment.id,
      readingPassageIds: [version.id],
      sourceHash: saved.tests.find(item => item.assessmentId === payload.assessment.id).sourceHash,
    });
    saved = await studio.getState();
    assert.deepEqual(saved.tests.find(item => item.assessmentId === payload.assessment.id).readingPassageIds, [version.id]);
    assert.equal(saved.assessments.find(item => item.id === payload.assessment.id).passages[0].versionLabel, versionLabel);
    await assert.rejects(
      studio.deletePassage({ id: version.id, sourceHash: editedVersion.sourceHash }),
      /Remove it from that exam before deleting it/,
    );

    const mathUrl = url.replace('/exams', '/math'), taxonomyUrl = url.replace('/exams', '/math-topics');
    const taxonomy = await (await fetch(taxonomyUrl)).json();
    const taxonomyDraft = { revision: taxonomy.revision, categories: taxonomy.categories.map(category => ({ ...category, original: category.label, topics: category.topics.map(topic => ({ ...topic, original: topic.label })) })) };
    const sourceCategory = taxonomy.categories.find(category => category.topics.length);
    const sourceTopic = sourceCategory.topics[0].label;
    const mathQuestion = { id: 'qa-two-topic-math', type: 'short_response', prompt: 'Solve x + 1 = 3.', topic: sourceCategory.label, subtopic: sourceTopic, correctTextAnswers: ['2'] };
    const mathRequest = { assessmentId: payload.assessment.id, questions: [mathQuestion] };
    const putTaxonomy = (body, token = state.editToken) => fetch(taxonomyUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-editor-token': token }, body: JSON.stringify(body) });
    const postMath = body => fetch(mathUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': state.editToken }, body: JSON.stringify(body) });
    assert.equal((await putTaxonomy(taxonomyDraft, 'wrong')).status, 403);
    assert.equal((await postMath({ ...mathRequest, questions: [{ ...mathQuestion, subtopic: '' }] })).status, 400);
    assert.equal((await postMath({ ...mathRequest, questions: [{ ...mathQuestion, subtopic: 'Triangles' }] })).status, 400);
    assert.equal((await postMath(mathRequest)).status, 201);
    const withMath = await studio.getState();
    assert.equal(withMath.assessments.find(item => item.id === payload.assessment.id).questions.find(item => item.id === mathQuestion.id).subtopic, sourceTopic);
    assert.equal((await putTaxonomy(taxonomyDraft)).status, 409);
    const currentTaxonomy = await (await fetch(taxonomyUrl)).json();
    const renameDraft = { revision: currentTaxonomy.revision, categories: currentTaxonomy.categories.map(category => ({ ...category, original: category.label, topics: category.topics.map(topic => ({ ...topic, original: topic.label, label: topic.label === sourceTopic ? 'One-variable equations' : topic.label })) })) };
    assert.equal((await putTaxonomy(renameDraft)).status, 200);
    const renamedMath = await studio.getState();
    assert.equal(renamedMath.assessments.find(item => item.id === payload.assessment.id).questions.find(item => item.id === mathQuestion.id).subtopic, 'One-variable equations');
    { const post = async (path, body) => {
      const response = await fetch(url.replace('/api/exams', path), {method:'POST',headers:{'Content-Type':'application/json','x-editor-token':state.editToken},body:JSON.stringify(body)});
      const data = await response.json(); return {status:response.status,data};
    };
    const image = await post('/api/math-images',{assessmentId:payload.assessment.id,questionId:mathQuestion.id,inline:true,mimeType:'image/png',fileName:'clipboard.png',dataUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN7sAAAAASUVORK5CYII='});
    assert.equal(image.status,201,JSON.stringify(image.data));
    const inline = `<p>Before.</p><img src="${image.data.image.src}" alt="Triangle" width="280" onerror="alert(1)"><p>After.</p><img src="https://example.invalid/tracker.png"><script>alert(1)</script>`;
    const updated = {...renamedMath.mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)),assessmentId:payload.assessment.id};
    updated.questions=[{...mathQuestion,subtopic:'One-variable equations',type:'numeric_entry',prompt:'Before. After.',promptHtml:inline,entryLayout:'x_equals',entryVariable:' w '}];
    const calculatorSaved = await post('/api/math',updated); assert.equal(calculatorSaved.status,201,JSON.stringify(calculatorSaved.data));
    const calculatorSection=(await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id));
    const calculatorRoundtrip=calculatorSection.questions[0]; updated.sourceHash = calculatorSection.sourceHash;
    assert.equal(calculatorRoundtrip.entryVariable,'w'); assert.equal(calculatorRoundtrip.entryLayout,'x_equals');
    assert.deepEqual(calculatorRoundtrip.correctTextAnswers,['2']);
    updated.questions[0].entryVariable = 'w=';
    const invalidVariable = await post('/api/math',updated); assert.equal(invalidVariable.status,400); assert.match(JSON.stringify(invalidVariable.data),/one letter/);
    updated.questions[0].entryVariable = 'θ';
    assert.equal((await post('/api/math',updated)).status,201);
    updated.sourceHash = (await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)).sourceHash;
    delete updated.questions[0].entryVariable;
    assert.equal((await post('/api/math',updated)).status,201);
    const defaultVariableSection=(await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id));
    assert.equal(defaultVariableSection.questions[0].entryVariable,undefined); updated.sourceHash = defaultVariableSection.sourceHash;
    updated.questions[0] = {...updated.questions[0],type:'short_answer',entryLayout:'fraction',entryVariable:'w'};
    const saved = await post('/api/math',updated); assert.equal(saved.status,201,JSON.stringify(saved.data));
    const roundtrip=(await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)).questions[0];
    assert.equal(roundtrip.type,'short_response'); assert.equal(roundtrip.entryLayout,undefined);
    assert.equal(roundtrip.entryVariable,undefined);
    assert.deepEqual(roundtrip.correctTextAnswers,['2']);
    assert.equal(roundtrip.promptHtml,`<p>Before.</p><img src="${image.data.image.src}" alt="Triangle" width="280"><p>After.</p>`);
    // Both drag styles must survive save/reload independently of answer reuse.
    const dragQuestion = { ...mathQuestion, subtopic:'One-variable equations', type: 'math_drag_drop', items: [{id:'one',text:'1'},{id:'two',text:'2'}], dragDropContent: ['\\(x+{{box}}=3\\)'], dragDropSlots: [{id:'box',correctItemId:'two'}] };
    for (const [dragDropStyle, allowReuse] of [['outlined', true], ['compact', false], [undefined, true]]) {
      updated.sourceHash = (await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)).sourceHash;
      updated.questions = [{...dragQuestion, dragDropStyle, allowReuse}];
      const dragSaved = await post('/api/math', updated); assert.equal(dragSaved.status,201,JSON.stringify(dragSaved.data));
      const reopened = (await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)).questions[0];
      assert.equal(reopened.dragDropStyle,dragDropStyle); assert.equal(reopened.allowReuse,allowReuse);
      assert.deepEqual(reopened.dragDropContent,dragQuestion.dragDropContent);
      assert.deepEqual(reopened.dragDropSlots,dragQuestion.dragDropSlots);
    }
    updated.sourceHash = (await studio.getState()).mathSections.find(section=>section.questions.some(question=>question.id===mathQuestion.id)).sourceHash;
    updated.questions[0].dragDropStyle = 'unsupported';
    assert.equal((await post('/api/math',updated)).status,400);
    const imported = await post('/api/math/import-preview',{assessmentId:payload.assessment.id,source:JSON.stringify({format:'nathan-tutors-math-question-v1',question:{...mathQuestion,id:'qa-dropdown-import',type:'inline_dropdown',dropdownContent:['{{a}} + {{b}}'],dropdowns:['a','b'].map(id=>({id,options:[{id:'one',text:'1'},{id:'two',text:'2'}],correctChoiceId:'two'}))}})});
    assert.equal(imported.status,200,JSON.stringify(imported.data)); assert.deepEqual(imported.data.question.dropdownContent,['{{a}} + {{b}}']);
    }
    {
      const current = (await studio.getState()).passages[0];
      const question = { id: 'sentence-blanks-qa', type: 'transition_drop', topic: 'Tone & Mood', points: 1, prompt: 'Complete both blanks.', choices: ['frustrated','restless','grateful','indifferent'].map((text,i)=>({id:String.fromCharCode(65+i),text})), dragDropContent: ['A tone that is {{blank-1}} and {{blank-2}}.'], dragDropSlots: [{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:'B'}], allowReuse:false };
      const saved = await studio.savePassage({...current, section:'reading', preserveSourceLayout:false, questions:[question]});
      const reopened = (await studio.getState()).passages.find(passage=>passage.id === saved.id);
      assert.deepEqual(reopened.questions[0].dragDropContent,question.dragDropContent);
      assert.deepEqual(reopened.questions[0].dragDropSlots,question.dragDropSlots);
      assert.equal(reopened.questions[0].allowReuse,false); assert.equal(reopened.questions[0].correctChoiceId,undefined);
      for (const invalid of [{...question,dragDropSlots:[{id:'blank-1',correctItemId:'A'}]}, {...question,dragDropSlots:[{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:''}]}, {...question,dragDropContent:['{{blank-1}} {{blank-1}}']}, {...question,dragDropSlots:[{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:'A'}]}]) {
        await assert.rejects(()=>studio.savePassage({...reopened,preserveSourceLayout:false,questions:[invalid]}),/blank|word/i);
      }
    }
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(modulePath, { force: true });
    if (dirname(resolve(fixture)) === resolve(fixtureRoot) && fixture.startsWith(join(fixtureRoot, 'exam-test-'))) {
      await rm(fixture, { recursive: true, force: true });
    } else throw new Error('Test cleanup path was outside the isolated fixture directory.');
  }
});
