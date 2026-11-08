const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { activityStore } = require('../../tools/exam-catalog.cjs');

test('migration separates worksheets, preserves identities, and moves atomically', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'shsat-activity-'));
  t.after(() => fs.rmSync(directory, {recursive:true, force:true}));
  const legacy = [{id:'exam',questions:[{id:'same'}]}, {id:'worksheet',studyHallWorksheet:{subject:'english',category:'Revising/Editing'},questions:[{id:'same'}]}];
  fs.writeFileSync(path.join(directory,'assessments.json'),JSON.stringify(legacy));
  const store = activityStore(directory);
  assert.deepEqual(store.read(), legacy);
  store.update(items => items);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory,'assessments.json'))).map(x=>x.id), ['exam']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory,'worksheets.json'))).map(x=>x.id), ['worksheet']);
  const revision = store.revision();
  store.update(items => items.map(item=>item.id==='exam'?{...item,studyHallWorksheet:{subject:'math',category:'Algebra',topic:'Inequalities',scope:'focused'}}:item));
  assert.throws(()=>store.write(legacy,revision),/changed/);
  assert.equal(store.read().length,2);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory,'assessments.json'))), []);
});

test('readers use committed journal during interrupted projection writes', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'shsat-activity-'));
  t.after(() => fs.rmSync(directory,{recursive:true,force:true}));
  fs.writeFileSync(path.join(directory,'assessments.json'),'[]');
  fs.writeFileSync(path.join(directory,'activity-catalog-transaction.json'),JSON.stringify({version:1,assessments:[{id:'exam'}],worksheets:[{id:'sheet',studyHallWorksheet:{subject:'math',category:'Geometry'}}]}));
  const store=activityStore(directory);
  assert.deepEqual(store.read().map(x=>x.id),['exam','sheet']);
  store.update(items=>items);
  assert.equal(fs.existsSync(path.join(directory,'activity-catalog-transaction.json')),false);
  assert.deepEqual(store.read().map(x=>x.id),['exam','sheet']);
  assert.throws(()=>store.write([{id:'same'},{id:'same'}]),/duplicate/);
  assert.equal(store.read().length,2);
});
