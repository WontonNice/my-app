const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});

function database(){
  const db={row:null,error:null,writes:0,from(table){assert.equal(table,'math_command_metadata');const filters=[];let operation='select',value;
    return {select(){return this;},eq(key,expected){filters.push(row=>row[key]===expected);return this;},insert(input){operation='insert';value=input;return this;},update(input){operation='update';value=input;return this;},async maybeSingle(){
      if(db.error)return {data:null,error:db.error};
      if(operation==='insert'){if(db.row)return {data:null,error:{code:'23505'}};db.row=structuredClone(value);db.writes++;}
      else if(operation==='update'){if(!db.row||!filters.every(fn=>fn(db.row)))return {data:null,error:null};db.row=structuredClone(value);db.writes++;return {data:structuredClone(db.row),error:null};}
      const row=db.row&&filters.every(fn=>fn(db.row))?db.row:null;return {data:structuredClone(row),error:null};
    }};
  }};return db;
}
const defaultDb=database(),supabasePath=require.resolve('../src/lib/supabase.ts');
require.cache[supabasePath]={id:supabasePath,filename:supabasePath,loaded:true,exports:{supabase:defaultDb}};
const store=require('../src/lib/mathCommandCatalogStore.ts');
const persistence=require('../src/lib/mathCommandPersistence.ts');
const service=require('../src/lib/mathCommandCatalogService.ts');

function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'math-command-durable-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'server/data'),{recursive:true});fs.mkdirSync(path.join(root,'tools'),{recursive:true});
  fs.copyFileSync(path.resolve(__dirname,'../../tools/math-topics.json'),path.join(root,'tools/math-topics.json'));
  const q={id:'question-1',type:'multiple_choice',topic:'Algebra',subtopic:'Equations & Systems',prompt:'Solve x + 3 = 8.',choices:[{id:'A',text:'5'},{id:'B',text:'6'}],correctChoiceId:'A',explanation:'Subtract three from each side.'};
  const content={exam:{assessmentId:'exam',title:'2026-2027 Form D',passageSets:[],mathSection:{questions:[q]}}};
  fs.writeFileSync(path.join(root,'server/data/exam-content.json'),JSON.stringify(content));
  const initial=store.readMathCommandState(root);initial.metadata[q.id]={difficulty:'easy',reviewStatus:'reviewed'};
  fs.writeFileSync(path.join(root,'server/data/math-command.json'),JSON.stringify(initial));
  return {root,file:path.join(root,'server/data/math-command.json'),contentFile:path.join(root,'server/data/exam-content.json')};
}
const change=(root,difficulty)=>{
  const preview=store.previewMathMetadata(root,{revision:store.readMathCommandState(root).revision,questionIds:['question-1'],patch:{difficulty}},'teacher');
  return store.applyMathMetadata(root,preview.token,'teacher');
};

test('durable metadata survives a new adapter and never rewrites local source or sidecar',async t=>{
  const f=fixture(t),db=database(),adapter=persistence.createMathCommandPersistence(db),before=fs.readFileSync(f.file),content=fs.readFileSync(f.contentFile);
  await adapter.run(f.root,async()=>{assert.equal(store.readMathCommandState(f.root).metadata['question-1'].difficulty,'easy');change(f.root,'hard');assert.equal(db.row,null,'no unconfirmed write before persistence');await adapter.persist(f.root);});
  assert.equal(db.row.state.metadata['question-1'].difficulty,'hard');assert.equal(db.writes,1);
  assert.deepEqual(fs.readFileSync(f.file),before);assert.deepEqual(fs.readFileSync(f.contentFile),content);
  const replaced=JSON.parse(fs.readFileSync(f.file,'utf8'));replaced.metadata['question-1'].difficulty='medium';fs.writeFileSync(f.file,JSON.stringify(replaced));
  await persistence.createMathCommandPersistence(db).run(f.root,()=>assert.equal(store.readMathCommandState(f.root).metadata['question-1'].difficulty,'hard','restart/redeploy cannot replace durable state from local files'));
  assert.equal(db.writes,1);
});

test('concurrent remote commits use compare-and-swap and preserve the winning edit',async t=>{
  const f=fixture(t),db=database(),adapter=persistence.createMathCommandPersistence(db);await adapter.seed(f.root,true);
  let release,loaded;const ready=new Promise(resolve=>loaded=resolve),gate=new Promise(resolve=>release=resolve);
  const first=adapter.run(f.root,async()=>{change(f.root,'hard');loaded();await gate;await adapter.persist(f.root);});
  await ready;await adapter.run(f.root,async()=>{change(f.root,'medium');await adapter.persist(f.root);});release();
  await assert.rejects(first,error=>error.status===409&&/another window/.test(error.message));
  assert.equal(db.row.state.metadata['question-1'].difficulty,'medium');
});

test('initial publication is previewable and never overwrites existing durable metadata',async t=>{
  const f=fixture(t),db=database(),adapter=persistence.createMathCommandPersistence(db);
  assert.deepEqual(await adapter.seed(f.root,false),{created:false,exists:false,revision:store.readMathCommandState(f.root).revision,questionMetadataCount:1});assert.equal(db.writes,0);
  assert.equal((await adapter.seed(f.root,true)).created,true);const previous=structuredClone(db.row);
  assert.equal((await adapter.seed(f.root,true)).created,false);assert.deepEqual(db.row,previous);assert.equal(db.writes,1);
});

test('remote state controls catalog caches and analytics-compatible synchronous reads',async t=>{
  const f=fixture(t),db=database(),adapter=persistence.createMathCommandPersistence(db);
  assert.equal(service.mathCatalogSnapshot(f.root).catalog.rows[0].difficulty,'easy');
  await adapter.run(f.root,async()=>{change(f.root,'expert');await adapter.persist(f.root);assert.equal(service.mathCatalogSnapshot(f.root).catalog.rows[0].difficulty,'expert');assert.equal(store.readMathCommandTaxonomy(f.root).skills.length,41);});
  assert.equal(service.mathCatalogSnapshot(f.root).catalog.rows[0].difficulty,'easy','remote caches do not leak into local authoring');
});

test('missing migration and storage failures fail closed without modifying files',async t=>{
  const f=fixture(t),db=database(),adapter=persistence.createMathCommandPersistence(db),before=fs.readFileSync(f.file);
  db.error={code:'42P01'};await assert.rejects(adapter.run(f.root,()=>change(f.root,'hard')),error=>error.status===503&&/202610260001/.test(error.message));
  db.error={code:'network'};await assert.rejects(adapter.run(f.root,()=>change(f.root,'hard')),/No local fallback|no local fallback/);
  assert.deepEqual(fs.readFileSync(f.file),before);assert.equal(db.writes,0);
});

test('production always selects durable storage; local dev opts in explicitly',()=>{
  const previous={node:process.env.NODE_ENV,storage:process.env.MATH_COMMAND_STORAGE};
  try{delete process.env.NODE_ENV;delete process.env.MATH_COMMAND_STORAGE;assert.equal(persistence.usesRemoteMathCommandStorage(),false);process.env.MATH_COMMAND_STORAGE='supabase';assert.equal(persistence.usesRemoteMathCommandStorage(),true);process.env.MATH_COMMAND_STORAGE='file';process.env.NODE_ENV='production';assert.equal(persistence.usesRemoteMathCommandStorage(),true);}
  finally{for(const [key,value]of [['NODE_ENV',previous.node],['MATH_COMMAND_STORAGE',previous.storage]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});

test('deployed import review manifest survives without private drafts; local explicit status has precedence',t=>{
  const f=fixture(t),manifest=path.join(f.root,'server/data/math-import-review.json');
  fs.writeFileSync(manifest,JSON.stringify({schemaVersion:1,needsEditingQuestionIds:['question-1']}));
  assert.ok(service.mathCatalogSnapshot(f.root).catalog.rows[0].issues.includes('teacher_review'));
  fs.mkdirSync(path.join(f.root,'tools/.content-drafts'),{recursive:true});const statusFile=path.join(f.root,'tools/.content-drafts/math-import-status.json');
  fs.writeFileSync(statusFile,JSON.stringify({[JSON.stringify(['exam','question-1'])]:{needsEditing:false}}));
  assert.ok(!service.mathCatalogSnapshot(f.root).catalog.rows[0].issues.includes('teacher_review'));
  const content=JSON.parse(fs.readFileSync(f.contentFile,'utf8'));content['another-exam']={...content.exam,assessmentId:'another-exam'};fs.writeFileSync(f.contentFile,JSON.stringify(content));
  fs.writeFileSync(statusFile,JSON.stringify({[JSON.stringify(['exam','question-1'])]:{needsEditing:false},[JSON.stringify(['another-exam','question-1'])]:{needsEditing:true}}));
  assert.ok(service.mathCatalogSnapshot(f.root).catalog.rows[0].issues.includes('teacher_review'));
});
