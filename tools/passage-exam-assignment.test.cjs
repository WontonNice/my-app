const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assignment=require('./passage-exam-assignment.cjs');
const passages=[{id:'old',title:'Shared passage'},{id:'other',title:'Other'},{id:'new',title:'Shared passage',section:'reading'}];

test('passage saves distinguish existing-version collisions and still reject later source changes',async()=>{
 const server=fs.readFileSync(path.join(__dirname,'content-studio.mjs'),'utf8');
 let current='loaded-revision',written;
 const save=vm.runInNewContext(server.slice(server.indexOf('async function savePassage(input)'),server.indexOf('async function publishPassage(input)'))+'\nsavePassage;',{
  verifyDocumentPublication:async content=>({content}),normalizePassage:value=>({...value,images:[]}),join:path.join,passageSetsRoot:'passages',
  readFile:async()=>current,hashSource:value=>value,writeFile:async(_file,value)=>{written=value;},buildPassageSource:value=>value.text,
  parsePassageFile:async()=>({id:'existing',sourceHash:'saved'}),ensureExamPassageRegistration:async()=>{},EditorError:class extends Error{constructor(status,message){super(message);this.status=status;}},
 });
 const draft={id:'existing',fileName:'existing.ts',text:'Reviewed edits'};
 await assert.rejects(save(draft),/saved passage already uses this version/);
 await save({...draft,sourceHash:'loaded-revision'}); assert.equal(written,'Reviewed edits');
 current='newer-external-edit';written=undefined;
 await assert.rejects(save({...draft,sourceHash:'loaded-revision'}),/changed after it was loaded/);
 assert.equal(written,undefined,'newer work must never be overwritten');
});

test('publish-to-exam assignment preserves other sections and distinct question versions, and never adds duplicates',()=>{
 const draft={assessmentId:'exam',readingPassageIds:['old','other'],revisingEditingPartAPassageIds:['part-a'],standaloneItemIds:['part-b'],sourceHash:'hash'};
 const next=assignment.assign(draft,passages[2],passages);
 assert.deepEqual(next.readingPassageIds,['old','other','new']);
 assert.deepEqual(next.revisingEditingPartAPassageIds,['part-a']);
 assert.deepEqual(next.standaloneItemIds,['part-b']);
 assert.deepEqual(draft.readingPassageIds,['old','other']);
 assert.deepEqual(assignment.assign(next,passages[2],passages),next);
 const moved=assignment.assign(next,{...passages[2],section:'revising_editing_a'},passages);
 assert.deepEqual(moved.readingPassageIds,['old','other']);
 assert.deepEqual(moved.revisingEditingPartAPassageIds,['part-a','new']);
});

test('publication keeps unsaved builder changes and advances its saved source hash',()=>{
 const app={state:{passages,tests:[{assessmentId:'exam',sourceHash:'after',readingPassageIds:['new'],revisingEditingPartAPassageIds:[],standaloneItemIds:[]}]},testDraft:{assessmentId:'exam',sourceHash:'before',readingPassageIds:['old','unsaved'],revisingEditingPartAPassageIds:['unsaved-a'],standaloneItemIds:['unsaved-b']},testDirty:true};
 const ui=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'content-studio-workspace.js'),'utf8')+'\nstudioUI;',{app,URL,PassageExamAssignment:assignment});
 ui.publishExamTargets.set('draft-id','exam');
 const result={passage:passages[2],examAssignment:{assessmentId:'exam',assessmentTitle:'Existing exam',added:true}};
 assert.match(ui.completePassagePublication(result,'draft-id'),/added to Existing exam/);
 assert.deepEqual(app.testDraft.readingPassageIds,['old','unsaved','new']);
 assert.deepEqual(app.testDraft.revisingEditingPartAPassageIds,['unsaved-a']);
 assert.deepEqual(app.testDraft.standaloneItemIds,['unsaved-b']);
 assert.equal(app.testDirty,true); assert.equal(app.testDraft.sourceHash,'after');
 assert.equal(ui.publishExamTargets.has('draft-id'),false);
 const failed={...result,examAssignment:{...result.examAssignment,error:'Conflicting question ID'}};
 assert.match(ui.completePassagePublication(failed,'draft-id'),/was published, but could not be added/);
 assert.equal(ui.publishExamTargets.get('new'),'exam');
});
