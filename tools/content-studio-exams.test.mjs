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
  const fixture = await mkdtemp(join(toolsRoot, '.exam-create-test-'));
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
    await cp(join(toolsRoot, 'content-studio-glossary.js'), join(fixture, 'tools/content-studio-glossary.js'));
    const source = (await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8'))
      .replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(fixture)};`)
      .split('if (process.argv.includes("--validate"))')[0] + '\nexport { bulkPassageCategory, deletePassage, handleRequest, getState, previewPassageImport, savePassage, saveAdvancedPassage, saveStandaloneItem, saveTest };\n';
    await writeFile(modulePath, source);
    const studio = await import(pathToFileURL(modulePath).href);
    server = createServer(studio.handleRequest);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/exams`;
    const state = await studio.getState();
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
      item: { ...originalPartBItem, versionLabel: partBVersionLabel },
      originalId: originalPartBItem.id,
      sourceHash: state.standaloneSourceHash,
    });
    assert.equal(savedPartBItem.item.versionLabel, partBVersionLabel);
    const standaloneSource = await readFile(join(fixture, 'client/src/content/exams/standaloneItems.ts'), 'utf8');
    assert.match(standaloneSource, /versionLabel\?: string/);
    assert.match(standaloneSource, new RegExp(`"versionLabel": "${partBVersionLabel}"`));
    assert.match(standaloneSource, /delete \(studentQuestion as ExamQuestion & \{ versionLabel\?: string \}\)\.versionLabel/);
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
    const created = await send({ title: 'Example new exam', durationMinutes: 90, description: 'A past paper test.' });
    const payload = await created.json();
    assert.equal(created.status, 201, JSON.stringify(payload));
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
    assert.equal(version.directions.title, 'REVISING/EDITING PART A');
    const glossaryHtml = '<p>First <span data-glossary-definition="A &quot;story&quot; &amp; &lt;series&gt;." role="link" tabindex="0">serial</span>.</p><p>Second serial.</p>';
    assert.equal(version.richText, glossaryHtml);
    const reopenedVersion = (await studio.getState()).passages.find(passage => passage.id === version.id);
    assert.equal(reopenedVersion.richText, glossaryHtml);
    assert.equal(reopenedVersion.text, 'First serial.\n\nSecond serial.');
    assert.equal(reopenedVersion.passageCategory, 'prestige');
    const editedVersion = await studio.savePassage({ ...reopenedVersion, passageCategory: 'official_handbook' });
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
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await rm(modulePath, { force: true });
    if (resolve(fixture).startsWith(resolve(toolsRoot) + '\\') || resolve(fixture).startsWith(resolve(toolsRoot) + '/')) {
      await rm(fixture, { recursive: true, force: true });
    } else throw new Error('Test cleanup path was outside tools.');
  }
});
