import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import { examVerificationStore } from './exam-verification.mjs';

test('manual verification survives reopening and independent concurrent updates; unchecking persists', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'exam-verification-'));
  try {
    const path = join(dir, 'metadata.json'), store = examVerificationStore(path);
    assert.deepEqual(await store.read(), {});
    await Promise.all([store.set('form-a', true), store.set('form-b', true)]);
    const reopened = examVerificationStore(path);
    assert.equal((await reopened.read())['form-a'].verified, true);
    assert.equal((await reopened.read())['form-b'].verified, true);
    await assert.rejects(reopened.set('form-a', 'false'), /true or false/);
    await reopened.set('form-a', false);
    const saved = await examVerificationStore(path).read();
    assert.equal(saved['form-a'].verified, false);
    assert.equal(saved['form-b'].verified, true);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

const source = await readFile(new URL('./content-studio-workspace.js', import.meta.url), 'utf8');
test('verification saves independently of drafts and restores the checkbox on failure', async () => {
  for (const fails of [false, true]) {
    for (const previous of [false, true]) {
      const draft = { title: 'Unsaved edits' };
      const app = { state: { examVerification: { exam: { verified: previous } } }, testDraft: draft, testDirty: true };
      const checkbox = { checked: !previous }, status = {};
      let rendered = false;
      const ui = vm.runInNewContext(`${source}\nstudioUI;`, {
        app,
        api: async (path, options) => {
          assert.equal(path, '/api/exams/exam/verification');
          assert.equal(checkbox.disabled, true);
          assert.equal(JSON.parse(options.body).verified, !previous);
          if (fails) throw new Error('Disk unavailable');
          return { verification: { verified: !previous } };
        },
        renderAssessmentList: () => { rendered = true; },
      });
      await ui.saveExamVerification('exam', checkbox, status);
      assert.equal(checkbox.disabled, false);
      assert.equal(checkbox.checked, fails ? previous : !previous);
      assert.equal(app.state.examVerification.exam.verified, checkbox.checked);
      assert.equal(rendered, !fails);
      assert.match(status.textContent, fails ? /Not saved: Disk unavailable/ : /Saved/);
      assert.equal(app.testDraft, draft);
      assert.equal(app.testDirty, true);
    }
  }
});
