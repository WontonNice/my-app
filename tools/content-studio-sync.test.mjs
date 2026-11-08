import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { focusStudioFixture, isolateStudioPersistence } from './content-studio-test-context.mjs';

const toolsRoot = dirname(fileURLToPath(import.meta.url)), root = resolve(toolsRoot, '..');
const hash = source => createHash('sha256').update(source).digest('hex');

test('editor create, edit, search and exam assignment stay synchronized before any browser reload', { timeout: 120000 }, async t => {
  isolateStudioPersistence(t);
  const fixtureBase = join(toolsRoot, '.content-drafts');
  await mkdir(fixtureBase, { recursive: true });
  const fixture = await mkdtemp(join(fixtureBase, 'question-sync-test-'));
  const modulePath = join(toolsRoot, `.question-sync-test-${process.pid}.mjs`);
  t.after(async () => {
    // Both paths are created above, inside this repository's test scratch folder.
    await rm(modulePath, { force: true });
    await rm(fixture, { recursive: true, force: true });
  });
  for (const directory of ['client/src', 'server/data', 'tools']) await mkdir(join(fixture, directory), { recursive: true });
  await cp(join(root, 'client/src/content'), join(fixture, 'client/src/content'), { recursive: true });
  await cp(join(root, 'server/src/shared'), join(fixture, 'server/src/shared'), { recursive: true });
  await mkdir(join(fixture, 'client/src/lib'), { recursive: true });
  for (const file of ['studentMaterials.ts', 'studyHallNavigation.ts']) await cp(join(root, 'client/src/lib', file), join(fixture, 'client/src/lib', file));
  await cp(join(root, 'server/data/assessments.json'), join(fixture, 'server/data/assessments.json'));
  await writeFile(join(fixture, 'server/data/question-bank.json'), JSON.stringify({ revision: 0, questions: [], sets: [] }));
  for (const file of ['practice-topics.json', 'content-topics.json', 'math-topics.json', 'content-studio-glossary.js', 'poem-layout.js']) await cp(join(toolsRoot, file), join(fixture, 'tools', file));
  await focusStudioFixture(fixture);
  // Isolate external persistence only. All authoring, parsing, export and indexing
  // below run the production code against real source modules in the fixture.
  const source = (await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8'))
    .replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(fixture)};`)
    .split('if (process.argv.includes("--validate"))')[0]
    + '\nexport { handleRequest, getState, saveStandaloneItem, savePassage, saveMath, saveTest, readQuestionCatalog, listStandaloneItems };\n';
  await writeFile(modulePath, source);
  const studio = await import(pathToFileURL(modulePath).href);
  const read = async file => JSON.parse(await readFile(join(fixture, 'server/data', file), 'utf8'));
  const standaloneSource = () => readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8');
  const state = await studio.getState();
  // studentMaterials.ts also imports this form for its library catalog.
  const exam = state.tests.find(exam => exam.fileName === 'formA2025_2026.ts');
  assert.ok(exam);
  const server = createServer(studio.handleRequest);
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  t.after(() => new Promise(done => { server.close(done); server.closeAllConnections(); }));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const item = { id: 'sync-integration-question', type: 'multiple_choice', prompt: 'Which verb agrees with the subject?', stimulus: 'The unique audit bird flies over a quiet field.', topic: 'Verbs', choices: [{ id: 'A', text: 'flies' }, { id: 'B', text: 'fly' }, { id: 'C', text: 'flying' }, { id: 'D', text: 'flown' }], correctChoiceId: 'A', explanation: 'A singular subject takes flies.' };
  await studio.saveStandaloneItem({ item, originalId: '', sourceHash: hash(await standaloneSource()) });
  const lookup = await fetch(`${origin}/api/question-catalog?id=${item.id}`);
  assert.equal(lookup.status, 200);
  let found = await lookup.json();
  assert.equal(found.questions.length, 1);
  assert.equal(found.questions[0].exams.length, 0);
  await studio.saveTest({ ...exam, standaloneItemIds: [...exam.standaloneItemIds, item.id] });
  const summary = () => read('assessments.json').then(all => all.find(a => a.id === exam.assessmentId));
  assert.ok((await summary()).questions.some(q => q.id === item.id), 'assignment updates summaries immediately');
  assert.ok((await read('exam-content.json'))[exam.assessmentId].standaloneSection.questions.some(q => q.id === item.id), 'assignment updates grading content immediately');
  await assert.rejects(studio.saveTest({ ...exam, standaloneItemIds: exam.standaloneItemIds }), /exam changed/);
  found = await studio.readQuestionCatalog({ assessmentId: exam.assessmentId, type: 'multiple_choice', search: item.id });
  assert.equal(found.questions.length, 1);
  assert.equal(found.questions[0].exams[0].assessmentId, exam.assessmentId);

  const edited = { ...(await studio.listStandaloneItems()).find(q => q.id === item.id), prompt: 'Revised question: choose the agreeing verb.', correctChoiceId: 'B' };
  const history = JSON.stringify({ answers: { [item.id]: 'A' }, analysisContent: (await read('exam-content.json'))[exam.assessmentId] });
  await writeFile(join(fixture, 'server/data/attempt-sentinel.json'), history);
  await studio.saveStandaloneItem({ item: edited, originalId: item.id, sourceHash: hash(await standaloneSource()) });
  assert.equal((await summary()).questions.find(q => q.id === item.id).answer, 'B');
  assert.equal((await read('exam-content.json'))[exam.assessmentId].standaloneSection.questions.find(q => q.id === item.id).prompt, edited.prompt);
  assert.equal((await studio.readQuestionCatalog({ search: item.id })).questions[0].question.correctChoiceId, 'B');
  const beforeRejectedEdit = await standaloneSource();
  await assert.rejects(studio.saveStandaloneItem({ item: { ...edited, id: 'renamed-used-question' }, originalId: item.id, sourceHash: hash(beforeRejectedEdit) }), /Keep the ID/);
  await assert.rejects(studio.saveStandaloneItem({ item: edited, originalId: item.id, sourceHash: 'stale' }), /changed/);
  const occupiedId = state.mathSections[0].questions[0].id;
  await assert.rejects(studio.saveStandaloneItem({ item: { ...edited, id: occupiedId, stimulus: 'A distinct fixture sentence prevents repeat matching.' }, originalId: '', sourceHash: hash(beforeRejectedEdit) }), /exactly one bank record/);
  assert.equal(await standaloneSource(), beforeRejectedEdit);

  let current = await studio.getState();
  const math = current.mathSections.find(section => section.fileName === exam.mathSectionFileName);
  const mathQuestion = math.questions.find(q => q.type === 'multiple_choice');
  await studio.saveMath({ ...math, assessmentId: exam.assessmentId, questions: math.questions.map(q => q.id === mathQuestion.id ? { ...q, explanation: 'Updated math reasoning for the synchronization test.' } : q) });
  assert.equal((await read('exam-content.json'))[exam.assessmentId].mathSection.questions.find(q => q.id === mathQuestion.id).explanation, 'Updated math reasoning for the synchronization test.');
  current = await studio.getState();
  const passage = current.passages.find(p => exam.passageIds.includes(p.id) && p.questions.every(q => q.type === 'multiple_choice'));
  assert.ok(passage);
  const updatedPrompt = 'Synchronization fixture: ' + passage.questions[0].prompt;
  const savedPassage = await studio.savePassage({ ...passage, questions: passage.questions.map((q, i) => i === 0 ? { ...q, prompt: updatedPrompt } : q) });
  assert.equal((await summary()).questions.find(q => q.id === passage.questions[0].id).prompt, updatedPrompt);
  const category = passage.passageCategory === 'prestige' ? 'miscellaneous' : 'prestige';
  const categorized = await fetch(`${origin}/api/passages/category`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-editor-token': state.editToken },
    body: JSON.stringify({ mode: 'exam', passageCategory: category, items: [{ id: savedPassage.id, sourceHash: savedPassage.sourceHash }] }),
  });
  assert.equal(categorized.status, 200, await categorized.text());
  assert.equal((await read('exam-content.json'))[exam.assessmentId].passageSets.find(set => set.passage.id === passage.id).passage.passageCategory, category, 'bulk categorization publishes before a refresh');
  assert.equal((await read('learning-catalog.json')).find(entry => entry.id === passage.id).passageCategory, category);
  assert.equal(await readFile(join(fixture, 'server/data/attempt-sentinel.json'), 'utf8'), history);
  const auditResponse = await fetch(`${origin}/api/question-sync`);
  assert.equal(auditResponse.status, 200);
  const audit = await auditResponse.json();
  assert.equal(audit.ok, true, JSON.stringify(audit.issues));
  let english = await (await fetch(origin+'/api/english-review')).json();
  let row = english.rows.find(r=>r.key==='standalone:'+item.id);
  assert.equal(row.status,'needs-review');
  const mark = (body, token = state.editToken) => fetch(origin+'/api/english-review',{method:'POST',headers:{'Content-Type':'application/json','x-editor-token':token},body:JSON.stringify(body)});
  const request = {revision:english.revision,items:[{key:row.key,hash:row.hash}],finished:true};
  assert.equal((await mark(request,'wrong')).status,403);
  assert.equal((await mark(request)).status,200);
  assert.equal((await mark(request)).status,409);
  english = await (await fetch(origin+'/api/english-review')).json();
  assert.equal(english.rows.find(r=>r.key===row.key).status,'finished');
  assert.equal((await mark({...request,revision:english.revision,items:[{key:row.key,hash:'stale'}]})).status,409);
  await studio.saveStandaloneItem({item:{...edited,prompt:'New content requires another review.'},originalId:item.id,sourceHash:hash(await standaloneSource())});
  english = await (await fetch(origin+'/api/english-review')).json();
  assert.equal(english.rows.find(r=>r.key===row.key).status,'needs-review');
  assert.equal(await readFile(join(fixture,'server/data/attempt-sentinel.json'),'utf8'),history);

  // Choosing a conflicting copy replaces live content behind both exam IDs.
  const chosen = {...edited,id:'sync-chosen-copy',prompt:'Chosen authoritative question.',correctChoiceId:'D',explanation:''};
  await studio.saveStandaloneItem({item:chosen,originalId:'',sourceHash:hash(await standaloneSource())});
  const latestExam=(await studio.getState()).tests.find(q=>q.assessmentId===exam.assessmentId);
  await studio.saveTest({...latestExam,standaloneItemIds:[...latestExam.standaloneItemIds,chosen.id]});
  const beforeCombine=await standaloneSource();
  const combineBody={keepId:chosen.id,removeId:item.id,sourceHash:hash(beforeCombine),verifiedSameQuestion:true,replaceOtherContent:true};
  const postCombine=body=>fetch(origin+'/api/standalone-items/combine',{method:'POST',headers:{'Content-Type':'application/json','x-editor-token':state.editToken},body:JSON.stringify(body)});
  assert.equal((await postCombine({...combineBody,sourceHash:'stale'})).status,409);
  const combined=await postCombine(combineBody);
  assert.equal(combined.status,200,await combined.text());
  const verifyCopies=async prompt=>{
    const exported=(await read('exam-content.json'))[exam.assessmentId].standaloneSection.questions;
    for(const id of [item.id,chosen.id]) {
      const q=exported.find(q=>q.id===id); assert.ok(q);
      assert.equal(q.prompt,prompt); assert.equal(q.correctChoiceId,'D');
      assert.equal(q.duplicateOf,undefined); assert.equal(q.canonicalContent,undefined);
      assert.equal((await summary()).questions.find(q=>q.id===id).answer,'D');
    }
  };
  await verifyCopies(chosen.prompt);
  const backupDir=join(fixture,'tools/.content-drafts/combined-standalone');
  const backups=await readdir(backupDir); assert.equal(backups.length,1);
  assert.equal(await readFile(join(backupDir,backups[0]),'utf8'),beforeCombine);
  await studio.saveStandaloneItem({item:{...chosen,prompt:'Later shared edit'},originalId:chosen.id,sourceHash:hash(await standaloneSource())});
  await verifyCopies('Later shared edit');
  assert.equal(await readFile(join(fixture,'server/data/attempt-sentinel.json'),'utf8'),history);

});
