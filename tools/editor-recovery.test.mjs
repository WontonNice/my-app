// Recovery verification only. No production editor or student-record writes.
// Failure injection and all publication operations are confined to disposable roots.
import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { documentDraftStore } from './document-drafts.mjs';

const require = createRequire(import.meta.url);
const fs = require('node:fs');
const { writeExportFile } = require('./write-export-file.cjs');
const toolsRoot = dirname(fileURLToPath(import.meta.url));
const repo = resolve(toolsRoot, '..');
const chatRoot = resolve(process.env.EDITOR_RECOVERY_CHAT_ROOT || join(repo, '..', '2026-10-29', 'exams-couldn-t-be-loaded-try'));
const scratch = join(chatRoot, 'work', 'editor-recovery');
const evidenceDir = process.env.EDITOR_RECOVERY_EVIDENCE_DIR;
const evidence = [];
const fixture = JSON.parse(await readFile(join(toolsRoot, 'fixtures/document-import/expected-import.json'), 'utf8'));
await mkdir(scratch, { recursive: true });
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
async function manifest(directory) {
  const result = {};
  async function visit(path) {
    for (const item of await readdir(path, { withFileTypes: true })) {
      const child = join(path, item.name);
      if (item.isDirectory()) await visit(child);
      else if (item.isFile()) result[child.slice(directory.length + 1)] = digest(await readFile(child));
    }
  }
  await visit(directory);
  return result;
}
const protectedBefore = await manifest(join(repo, 'client/src/content'));
const assessmentsBefore = digest(await readFile(join(repo, 'server/data/assessments.json')));
after(async () => {
  assert.deepEqual(await manifest(join(repo, 'client/src/content')), protectedBefore, 'Live authored content must remain byte-identical');
  assert.equal(digest(await readFile(join(repo, 'server/data/assessments.json'))), assessmentsBefore, 'Live assessment definitions must remain byte-identical');
  if (evidenceDir) {
    await mkdir(evidenceDir, { recursive: true });
    await writeFile(join(evidenceDir, 'editor-recovery-observations.json'), JSON.stringify({
      scope: 'Disposable copied current authored content; synthetic drafts; controlled failure injection. No student databases accessed.',
      protectedContentFiles: Object.keys(protectedBefore).length,
      liveContentUnchanged: true,
      observations: evidence,
    }, null, 2));
  }
});
async function rootFor(t, prefix) {
  const root = await mkdtemp(join(scratch, prefix));
  t.after(async () => {
    assert.equal(dirname(resolve(root)), resolve(scratch));
    await rm(root, { recursive: true, force: true });
  });
  return root;
}
async function storedDraft(t) {
  const root = await rootFor(t, 'draft-');
  const store = documentDraftStore(root);
  const state = await store.import({ format: fixture.format, passage: fixture.passages[0] });
  return { root, store, state, entry: structuredClone(state.entries[0]) };
}
async function uiFor(app, store, extra = {}) {
  const source = await readFile(join(toolsRoot, 'content-studio-documents.js'), 'utf8');
  const statuses = [];
  const ui = vm.runInNewContext(`${source}\nDocumentStudio;`, {
    app, clone: structuredClone,
    api: async (path, options) => options ? store.save(JSON.parse(options.body)) : store.read(),
    setStatus: (...args) => statuses.push(args),
    studioUI: { updatePassageSummary() {}, passageLibrarySection: () => 'reading', preparePassage() {}, passageLibraryTab: () => 'passages', showSupportPanel() {} },
    document: { querySelector: () => ({ close() {} }) },
    updatePassageWorkspaceLabels() {}, renderPassageList() {}, renderPassageEditor() {}, switchTab() {},
    ...extra,
  });
  return { ui, statuses };
}
async function studioFor(t) {
  const root = await rootFor(t, 'publication-');
  for (const path of ['client/src/lib', 'server/data', 'tools']) await mkdir(join(root, path), { recursive: true });
  // Allowlisted authored content/configuration only: never copy server/data wholesale.
  for (const path of ['client/src/content', 'server/src/shared']) await cp(join(repo, path), join(root, path), { recursive: true });
  for (const path of ['client/src/lib/studentMaterials.ts', 'server/data/assessments.json', 'tools/content-topics.json', 'tools/math-topics.json', 'tools/practice-topics.json', 'tools/content-studio-glossary.js', 'tools/poem-layout.js']) await cp(join(repo, path), join(root, path));
  await writeFile(join(root, 'server/data/question-bank.json'), '{"revision":0,"questions":[],"sets":[]}');
  let source = await readFile(join(toolsRoot, 'content-studio.mjs'), 'utf8');
  const boundary = 'if (process.argv.includes("--validate"))';
  assert.ok(source.includes(boundary));
  source = source.split(boundary)[0]; // Remove all CLI/service startup.
  source = source.replace('const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");', `const workspaceRoot = ${JSON.stringify(root)};`);
  assert.ok(source.includes(`const workspaceRoot = ${JSON.stringify(root)};`));
  source = source.replace(/from (["'])(\.\/[^"']+)\1/g, (_, quote, path) => `from ${JSON.stringify(pathToFileURL(resolve(toolsRoot, path)).href)}`);
  source = source.replace('from "typescript"', `from ${JSON.stringify(pathToFileURL(require.resolve('typescript')).href)}`);
  source = source.replace('rm, writeFile } from "node:fs/promises"', 'rm, writeFile as actualWriteFile } from "node:fs/promises"');
  assert.ok(source.includes('writeFile as actualWriteFile'));
  const injection = `
    const recovery = { failExport: false };
    async function writeFile(path, data, options) {
      if (!resolve(String(path)).startsWith(workspaceRoot + ${JSON.stringify(sep)})) throw new Error('Fixture write escaped its root');
      return actualWriteFile(path, data, options);
    }
  `;
  source = source.replace('const passageSetsRoot =', `${injection}\nconst passageSetsRoot =`);
  source = source.replace('examExporter.exportExamContent(workspaceRoot);', `if (recovery.failExport) { recovery.failExport = false; throw new Error('Injected export interruption'); }\n  examExporter.exportExamContent(workspaceRoot);`);
  const modulePath = join(root, 'fixture-studio.mjs');
  await writeFile(modulePath, `${source}\nexport { recovery, getState, savePassage, publishPassage, listPassages, documentDrafts };`);
  const studio = await import(pathToFileURL(modulePath).href);
  return { root, studio };
}

test('store rejects a stale draft revision and preserves the winning edit across reopen', async t => {
  const { root, store, state, entry } = await storedDraft(t);
  const winner = structuredClone(entry); winner.content.blurb = 'Newer teacher edit';
  await store.save({ revision: state.revision, entry: winner });
  await assert.rejects(store.save({ revision: state.revision, entry }), /changed/);
  assert.equal((await documentDraftStore(root).read()).entries[0].content.blurb, winner.content.blurb);
});

test('open-editor draft save must not overwrite a newer saved draft', async t => {
  const { store, state, entry } = await storedDraft(t);
  const app = { saving: false, passageDirty: true, passageDraft: structuredClone(entry.content) };
  const { ui } = await uiFor(app, store); ui.state = structuredClone(state); ui.entry = structuredClone(entry);
  ui.openPassageDraft(entry);
  app.passageDirty = true; app.passageDraft.blurb = 'Older open-tab edit';
  const winner = structuredClone(entry); winner.content.blurb = 'Newer saved edit';
  await store.save({ revision: state.revision, entry: winner });
  ui.state = await store.read(); // A library refresh must not update the open editor's baseline.
  const accepted = await ui.saveCurrentPassage();
  const retained = (await store.read()).entries[0].content.blurb === winner.content.blurb;
  evidence.push({ check: 'stale-open-editor-save', accepted, newerSavedEditRetained: retained, localDirtyAfterSave: app.passageDirty });
  assert.equal(retained, true, 'Saving an older open editor must preserve the newer persisted edit');
  assert.equal(accepted, false);
  assert.equal(app.passageDirty, true);
  assert.equal(app.passageDraft.blurb, 'Older open-tab edit');
});

test('failed draft request retains editable unsaved content and clears busy state', async t => {
  const { store, state, entry } = await storedDraft(t);
  const app = { saving: false, passageDirty: true, passageDraft: structuredClone(entry.content) };
  const { ui, statuses } = await uiFor(app, store, { api: async (path, options) => {
    if (options) throw new Error('Injected interrupted request');
    return store.read();
  } });
  ui.state = structuredClone(state); ui.openPassageDraft(entry);
  app.passageDraft.blurb = 'Unsaved recovery evidence'; app.passageDirty = true;
  const before = structuredClone(app.passageDraft);
  assert.equal(await ui.saveCurrentPassage(), false);
  assert.deepEqual(app.passageDraft, before);
  assert.equal(app.passageDirty, true); assert.equal(app.saving, false);
  assert.match(statuses.at(-1)[0], /interrupted request/);
  assert.notEqual((await store.read()).entries[0].content.blurb, before.blurb);
});

test('successive open-editor saves advance their captured revision without a reload', async t => {
  const { store, state, entry } = await storedDraft(t);
  const app = { saving: false };
  const { ui } = await uiFor(app, store); ui.state = structuredClone(state); ui.openPassageDraft(entry);
  for (const blurb of ['First edit', 'Second edit']) {
    app.passageDraft.blurb = blurb; app.passageDirty = true;
    assert.equal(await ui.saveCurrentPassage(), true);
    assert.equal((await store.read()).entries[0].content.blurb, blurb);
    assert.equal(app.passageDirty, false); assert.equal(app.saving, false);
  }
});

test('draft temporary-write failure keeps the prior durable JSON and permits retry', async t => {
  const { root, store, state, entry } = await storedDraft(t);
  const path = join(root, 'tools/.content-drafts/document-imports.json');
  const before = await readFile(path, 'utf8');
  entry.content.blurb = 'Retried teacher edit';
  const write = fs.writeFileSync;
  fs.writeFileSync = (target,...args) => {
    if (String(target).startsWith(path + '.') && String(target).endsWith('.tmp')) throw Object.assign(new Error('Injected draft write failure'),{code:'EIO'});
    return write(target,...args);
  };
  try { await assert.rejects(store.save({ revision: state.revision, entry }),/Injected draft write failure/); }
  finally { fs.writeFileSync = write; }
  assert.equal(await readFile(path, 'utf8'), before);
  await store.save({ revision: state.revision, entry });
  assert.equal((await store.read()).entries[0].content.blurb, entry.content.blurb);
});

test('workspace export retries transient replacement locks without changing the original until commit', async t => {
  const root = await rootFor(t, 'export-transient-');
  const target = join(root, 'export.json');
  await writeFile(target, '{"old":true}\n');
  const rename = fs.renameSync;
  let attempts = 0;
  t.mock.method(fs, 'renameSync', (temporary, output) => {
    assert.equal(output, target);
    assert.equal(fs.readFileSync(target, 'utf8'), '{"old":true}\n');
    if (attempts++ < 3) throw Object.assign(new Error('Injected transient lock'), { code: ['EPERM', 'EBUSY', 'EACCES'][attempts - 1] });
    return rename(temporary, output);
  });
  assert.equal(writeExportFile(target, '{"new":true}\n'), true);
  assert.equal(attempts, 4);
  assert.equal(await readFile(target, 'utf8'), '{"new":true}\n');
  assert.deepEqual(await readdir(root), ['export.json']);
  evidence.push({ check: 'workspace-export-transient-lock', passed: true, attempts });
});

test('workspace export persistent lock preserves old JSON and removes its temporary file', async t => {
  const root = await rootFor(t, 'export-lock-');
  const target = join(root, 'export.json');
  await writeFile(target, '{"old":true}\n');
  const rename = t.mock.method(fs, 'renameSync', () => { throw Object.assign(new Error('Injected persistent lock'), { code: 'EPERM' }); });
  assert.throws(() => writeExportFile(target, '{"new":true}\n'), /existing file was kept.*Retry/);
  assert.equal(rename.mock.callCount(), 8);
  assert.equal(await readFile(target, 'utf8'), '{"old":true}\n');
  assert.deepEqual(await readdir(root), ['export.json']);
});

test('workspace export partial temporary-file write preserves old JSON and cleans the incomplete file', async t => {
  const root = await rootFor(t, 'export-space-');
  const target = join(root, 'export.json');
  await writeFile(target, '{"old":true}\n');
  const actualWrite = fs.writeFileSync;
  t.mock.method(fs, 'writeFileSync', (temporary, data, options) => {
    assert.equal(dirname(temporary), root);
    assert.notEqual(temporary, target);
    actualWrite(temporary, String(data).slice(0, 3), options);
    throw Object.assign(new Error('Injected ENOSPC during temporary write'), { code: 'ENOSPC' });
  });
  assert.throws(() => writeExportFile(target, '{"new":true}\n'), { code: 'ENOSPC' });
  assert.equal(await readFile(target, 'utf8'), '{"old":true}\n');
  assert.deepEqual(await readdir(root), ['export.json']);
});

test('interrupted passage source write must preserve the last complete source', async t => {
  const { root, studio } = await studioFor(t);
  const original = (await studio.listPassages()).passages.find(p => p.id === 'at-dusk-2024-form-a');
  assert.ok(original);
  const path = join(root, 'client/src/content/exams/passageSets', original.fileName);
  const before = await readFile(path, 'utf8');
  const actualWrite = fs.writeFileSync;
  let fail = true;
  t.mock.method(fs, 'writeFileSync', (temporary, data, options) => {
    if (fail && String(temporary).startsWith(path + '.')) {
      fail = false; actualWrite(temporary, String(data).slice(0, 64), options);
      throw Object.assign(new Error('Injected ENOSPC in fixture'), { code: 'ENOSPC' });
    }
    return actualWrite(temporary, data, options);
  });
  await assert.rejects(studio.savePassage({ ...original, blurb: 'Synthetic unsaved blurb' }), /Injected ENOSPC/);
  const after = await readFile(path, 'utf8');
  evidence.push({ check: 'partial-source-write', priorBytes: Buffer.byteLength(before), survivingBytes: Buffer.byteLength(after), priorSourcePreserved: after === before });
  assert.equal(after === before, true, 'A failed writer must not truncate the previously saved passage');
  assert.equal((await readdir(dirname(path))).some(name => name.startsWith(original.fileName + '.')), false);
  const retried = await studio.savePassage({ ...original, blurb: 'Synthetic unsaved blurb' });
  assert.equal(retried.blurb, 'Synthetic unsaved blurb');
  const committed = await readFile(path, 'utf8');
  await assert.rejects(studio.savePassage({ ...original, blurb: 'Stale writer' }), /changed after it was loaded/);
  assert.equal(await readFile(path, 'utf8'), committed, 'Atomic writes must retain the existing source-hash conflict guard');
});

test('identical-import source-tag update is atomic and retries without changing saved questions', async t => {
  const { root, studio } = await studioFor(t);
  const passage = { ...fixture.passages[0], title: 'Recovery source tags fixture', versionLabel: 'Source one' };
  let imported = await studio.documentDrafts.import({ format: fixture.format, passage });
  const initial = await studio.savePassage({ ...imported.entries[0].content, publishNow: true });
  const target = join(root, 'client/src/content/exams/passageSets', initial.fileName);
  const before = await readFile(target, 'utf8');
  imported = await studio.documentDrafts.read();
  const second = structuredClone(imported.entries[0]);
  second.content = { ...initial, sourceHash: '', fileName: '', exportName: '', versionLabel: 'Source two', versionLabels: [], importDraftId: second.id };
  await studio.documentDrafts.save({ revision: imported.revision, entry: second });
  const actualWrite = fs.writeFileSync;
  let fail = true;
  t.mock.method(fs, 'writeFileSync', (temporary, data, options) => {
    if (fail && String(temporary).startsWith(target + '.')) {
      fail = false; actualWrite(temporary, String(data).slice(0, 64), options);
      throw Object.assign(new Error('Injected tag-write interruption'), { code: 'ENOSPC' });
    }
    return actualWrite(temporary, data, options);
  });
  const input = { ...second.content, publishNow: true };
  await assert.rejects(studio.savePassage(input), /tag-write interruption/);
  assert.equal(await readFile(target, 'utf8'), before);
  assert.equal((await studio.documentDrafts.read()).entries.find(entry => entry.id === second.id).status, 'draft');
  const retried = await studio.savePassage(input);
  assert.equal(retried.id, initial.id);
  assert.ok(retried.versionLabels.includes('Source two'));
  assert.deepEqual(retried.questions, initial.questions);
  evidence.push({ check: 'identical-import-tags-atomic-retry', passed: true, priorSourcePreserved: true, savedQuestionsUnchanged: true });
});

test('retry after source-written/registry-failed publication must restore registration', async t => {
  const { root, studio } = await studioFor(t);
  const imported = await studio.documentDrafts.import({ format: fixture.format, passage: { ...fixture.passages[0], title: 'Recovery registry fixture' } });
  const input = { ...imported.entries[0].content, publishNow: true };
  const registry = join(root, 'client/src/content/exams/passageLibrary.ts');
  const registryBefore = await readFile(registry, 'utf8');
  const actualRename = fs.renameSync;
  let failures = 2;
  t.mock.method(fs, 'renameSync', (temporary, target) => {
    if (failures > 0 && target === registry) { failures--; throw Object.assign(new Error('Injected registry interruption'), { code: 'EIO' }); }
    return actualRename(temporary, target);
  });
  await assert.rejects(studio.savePassage(input), /Injected registry interruption/);
  assert.equal(await readFile(registry, 'utf8'), registryBefore);
  assert.equal((await studio.documentDrafts.read()).entries[0].status, 'draft');
  await assert.rejects(studio.savePassage(input), /Injected registry interruption/);
  assert.equal((await studio.documentDrafts.read()).entries[0].status, 'draft', 'A failed repair must not mark the draft published');
  const retry = await studio.savePassage(input);
  const registered = (await readFile(registry, 'utf8')).includes(retry.exportName);
  const draft = (await studio.documentDrafts.read()).entries[0];
  evidence.push({ check: 'publication-registration-retry', retryReturnedSuccess: true, registered, draftStatus: draft.status });
  assert.equal(registered, true, 'A successful retry must repair the registry before marking the draft published');
  assert.equal(draft.status, 'published');
  const registryAfter = await readFile(registry, 'utf8');
  await studio.savePassage(input);
  assert.equal(await readFile(registry, 'utf8'), registryAfter, 'Further retries must not duplicate registration');
});

test('export interruption after source publication returns retry information and exam assignment recovers once', async t => {
  const { root, studio } = await studioFor(t);
  const state = await studio.getState();
  const destination = state.tests.find(test => test.mathSectionFileName);
  assert.ok(destination);
  const mathPath = join(root, 'client/src/content/exams/mathSets', destination.mathSectionFileName);
  const mathBefore = await readFile(mathPath, 'utf8');
  const imported = await studio.documentDrafts.import({ format: fixture.format, passage: { ...fixture.passages[0], title: 'Recovery exam-assignment fixture' } });
  const input = { ...imported.entries[0].content, publishNow: true, publishToExamId: destination.assessmentId };
  studio.recovery.failExport = true;
  const partial = await studio.publishPassage(input);
  assert.match(partial.examAssignment.error, /export interruption/);
  assert.ok(partial.passage.sourceHash);
  const retry = await studio.publishPassage({ ...partial.passage, publishToExamId: destination.assessmentId });
  assert.equal(retry.examAssignment.error, undefined);
  const repeated = await studio.publishPassage({ ...retry.passage, publishToExamId: destination.assessmentId });
  assert.equal(repeated.examAssignment.added, false);
  const final = (await studio.getState()).tests.find(test => test.assessmentId === destination.assessmentId);
  assert.equal(final.readingPassageIds.filter(id => id === retry.passage.id).length, 1);
  assert.deepEqual(final.revisingEditingPartAPassageIds, destination.revisingEditingPartAPassageIds);
  assert.deepEqual(final.standaloneItemIds, destination.standaloneItemIds);
  assert.equal(await readFile(mathPath, 'utf8'), mathBefore);
  evidence.push({ check: 'publication-exam-assignment-retry', success: true, duplicateAssignments: 0, otherSectionsPreserved: true });
});
