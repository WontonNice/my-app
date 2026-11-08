import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./content-studio-workspace.js', import.meta.url), 'utf8');
const worksheet = (id, overrides = {}) => ({id, title:`Worksheet ${id}`, examLabel:'Kaplan', studyHallWorksheet:{subject:'english', category:'Revising/Editing'}, ...overrides});
function setup(assessments, globals = {}) {
  const app = {state:{assessments, examLabels:['Official practice','Kaplan']}, builderKind:'tests'};
  const ui = vm.runInNewContext(source + '\nstudioUI;', {app, document:{getElementById:()=>null}, escapeHtml:value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;'), ...globals});
  return {app, ui};
}
test('hundreds of worksheets do not populate Exams and worksheet filters precede pagination', () => {
  const {app, ui} = setup([{id:'exam', title:'Official exam'}, ...Array.from({length:350}, (_,i)=>worksheet(String(i))), worksheet('math',{studyHallWorksheet:{subject:'math', category:'Algebra'}})]);
  assert.deepEqual(Array.from(ui.builderLibraryPage().items, item=>item.id), ['exam']);
  app.builderKind='worksheets';
  let page=ui.builderLibraryPage(); assert.equal(page.total,351); assert.equal(page.items.length,30); assert.equal(page.pages,12);
  const first=new Set(page.items.map(item=>item.id)); ui.builderFilters().page=1;
  assert.ok(ui.builderLibraryPage().items.every(item=>!first.has(item.id)));
  Object.assign(ui.builderFilters(), {subject:'math', category:'Algebra', query:'math', page:11});
  page=ui.builderLibraryPage(); assert.equal(page.page,0); assert.equal(page.total,1); assert.equal(page.items[0].id,'math');
  ui.builderFilters().source='Prestige'; assert.equal(ui.builderLibraryPage().total,0);
});

test('All worksheets clears library filters and opens the list without losing unsaved edits', () => {
  let renders = 0, pinned = false, focused = false;
  const {app, ui} = setup([worksheet('sheet')], {renderAssessmentList:()=>renders++, document:{getElementById:id=>id === 'assessment-list-search' ? {focus:()=>focused=true} : null}});
  app.builderKind = 'worksheets'; app.testDraft = {title:'Unsaved title'}; app.testDirty = true;
  const draft = app.testDraft;
  Object.assign(ui.builderFilters(), {query:'missing', subject:'math', category:'Algebra', source:'Prestige', page:8});
  ui.configureBuilderLibrary = () => {}; ui.setLibraryPinned = value => pinned=value;
  ui.openBuilderLibrary();
  assert.equal(ui.builderLibraryPage().total, 1);
  assert.equal(ui.builderFilters().page, 0);
  assert.equal(renders, 1); assert.equal(pinned, true); assert.equal(focused, true);
  assert.equal(app.testDraft, draft); assert.equal(app.testDirty, true);
});
test('switching between Exams and Worksheets preserves independent unsaved drafts and filters', () => {
  const {app,ui}=setup([{id:'exam',title:'Exam'},worksheet('sheet')]);
  const examDraft={assessmentId:'exam',standaloneItemIds:['existing']};
  Object.assign(app,{selectedAssessmentId:'exam',testDraft:examDraft,testDirty:true});
  ui.builderFilters().query='Official'; ui.testSection='2'; ui.prepareBuilderWorkspace('worksheets');
  assert.equal(app.testDirty,false); assert.equal(app.testDraft,null); assert.equal(ui.builderFilters().query,'');
  const worksheetDraft={assessmentId:'sheet',standaloneItemIds:['new']};
  Object.assign(app,{selectedAssessmentId:'sheet',testDraft:worksheetDraft,testDirty:true}); ui.builderFilters().query='Kaplan';
  ui.prepareBuilderWorkspace('tests'); assert.equal(app.testDraft,examDraft); assert.equal(app.testDirty,true); assert.equal(ui.testSection,'2'); assert.equal(ui.builderFilters().query,'Official');
  ui.prepareBuilderWorkspace('worksheets'); assert.equal(app.testDraft,worksheetDraft); assert.equal(app.testDirty,true); assert.equal(ui.builderFilters().query,'Kaplan');
});
test('publication destinations stay separate and older Grade 9 worksheets keep their placement', () => {
  const {ui}=setup([{id:'exam',title:'Full assessment'},worksheet('sheet'),{id:'legacy',title:'Grade 9',examLabel:'Grade 9 Mathematics Sample Questions'},{id:'moved',title:'Converted exam',examLabel:'Grade 9 Mathematics Sample Questions',studyHallWorksheet:null}]);
  assert.match(ui.publishTargetOptions('tests'), /Full assessment/); assert.doesNotMatch(ui.publishTargetOptions('tests'), /Worksheet sheet|value="legacy"/);
  assert.match(ui.publishTargetOptions('worksheets'), /Worksheet sheet/); assert.match(ui.publishTargetOptions('worksheets'), /value="legacy"/); assert.doesNotMatch(ui.publishTargetOptions('worksheets'), /Full assessment|value="moved"/);
});
