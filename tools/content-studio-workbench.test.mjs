import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('./content-studio-workspace.js', import.meta.url), 'utf8');
function fixture() {
  const title = { textContent: '' }, attributes = new Map();
  const button = { setAttribute: (key,value) => attributes.set(key,value) };
  const toggle = { hidden: false, disabled: false, getAttribute: key => ({'aria-expanded':'true','aria-controls':'library-math'})[key] };
  const app = { saving: false };
  const document = { getElementById: id => ({'studio-workspace-title':title,'studio-open-library':button,'studio-library-toggle':toggle})[id] };
  const ui = vm.runInNewContext(`${source}\nstudioUI;`, { app, document });
  ui.workbenchLabels = { math: 'Math questions', 'english-review': 'English center' };
  return { ui, app, title, button, toggle, attributes };
}
test('the workbench library button follows the active library and its expanded state', () => {
  const f = fixture(); f.ui.syncWorkbench('math');
  assert.equal(f.title.textContent, 'Math questions');
  assert.equal(f.button.hidden, false); assert.equal(f.button.disabled, false);
  assert.equal(f.attributes.get('aria-controls'), 'library-math');
  assert.equal(f.attributes.get('aria-expanded'), 'true');
  f.toggle.getAttribute = key => key === 'aria-expanded' ? 'false' : 'library-reading';
  f.ui.syncWorkbench('passages');
  assert.equal(f.attributes.get('aria-expanded'), 'false');
  assert.equal(f.attributes.get('aria-controls'), 'library-reading');
});
test('review screens hide the library control and saving disables it without losing its state', () => {
  const f = fixture(); f.toggle.hidden = true; f.toggle.disabled = true;
  f.ui.syncWorkbench('english-review');
  assert.equal(f.title.textContent, 'English center'); assert.equal(f.button.hidden, true);
  f.toggle.hidden = false; f.toggle.disabled = false; f.app.saving = true; f.ui.syncWorkbench('math');
  assert.equal(f.button.disabled, true);
  f.app.saving = false; f.ui.syncWorkbench('math'); assert.equal(f.button.disabled, false);
});
test('workspace activation remains safe before the workbench DOM has mounted', () => {
  const ui = vm.runInNewContext(`${source}\nstudioUI;`, { app: {}, document: {getElementById: () => null} });
  assert.doesNotThrow(() => ui.syncWorkbench('passages'));
});
test('assessment previews choose their actual sections, including math-only exams', () => {
  const {ui}=fixture();
  assert.equal(JSON.stringify(ui.activityPreviewSubjects({mathSection:{questions:[{}]},passageSets:[]})), '["math"]');
  assert.equal(JSON.stringify(ui.activityPreviewSubjects({passageSets:[{questions:[{}]}],mathSection:{questions:[{}]}})), '["english","math"]');
  assert.equal(JSON.stringify(ui.activityPreviewSubjects({standaloneSection:{questions:[{}]}})), '["english"]');
});
test('exam publication guidance points to assessments instead of Study Hall', () => {
  const {ui}=fixture();
  const exam={studyHallWorksheet:null,assembly:{draftQuestionIds:['q'],reviewed:false}};
  assert.match(ui.publicationStatus(exam).detail,/exam/);
  assert.doesNotMatch(ui.publicationStatus(exam).detail,/worksheet|Study Hall/);
  exam.assembly.publishedReleaseId='release';exam.assembly.reviewed=true;
  assert.match(ui.publicationStatus(exam).summary,/teacher dashboard/);
});
