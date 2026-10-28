const {test,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
require('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../tsconfig.json')});
const rows=new Map();let failing=false;
const db={from(table){assert.equal(table,'assessment_access');return{select(){return this;},in(_key,ids){return Promise.resolve({data:ids.map(id=>rows.get(id)).filter(Boolean),error:failing?{message:'offline'}:null});}};},async rpc(name,args){assert.equal(name,'set_assessment_access');if(failing)return{data:null,error:{message:'offline'}};const row={...args.p_initial,...rows.get(args.p_assessment_id),...args.p_patch,assessment_id:args.p_assessment_id};rows.set(args.p_assessment_id,structuredClone(row));return{data:structuredClone(row),error:null};}};
const dbId=require.resolve('../src/lib/supabase.ts');require.cache[dbId]={id:dbId,filename:dbId,loaded:true,exports:{supabase:db}};
function restartedStore(){delete require.cache[require.resolve('../src/lib/assessmentAccess.ts')];return require('../src/lib/assessmentAccess.ts');}
const base=()=>({id:'exam',classId:'shsat',status:'locked',sectionAccess:{english:false,math:false},allowCompletedAccess:false,correctionsOpen:false});
beforeEach(()=>{rows.clear();failing=false;});
test('opening remains open after process reload and replacement with a locked catalog',async()=>{
 let store=restartedStore();await store.setPersistentAssessmentAccess(base(),{english_open:true,math_open:true});
 store=restartedStore();let value=await store.resolveAssessmentAccess(base());assert.equal(value.status,'open');assert.deepEqual(value.sectionAccess,{english:true,math:true});
 await store.setPersistentAssessmentAccess(base(),{english_open:false});value=await restartedStore().resolveAssessmentAccess(base());assert.equal(value.status,'open');assert.deepEqual(value.sectionAccess,{english:false,math:true});
 await store.setPersistentAssessmentAccess(base(),{math_open:false});value=await restartedStore().resolveAssessmentAccess({...base(),status:'open',sectionAccess:{english:true,math:true}});assert.equal(value.status,'locked');
});
test('independent simultaneous section/correction changes do not overwrite each other',async()=>{
 const store=restartedStore();await Promise.all([store.setPersistentAssessmentAccess(base(),{english_open:true}),store.setPersistentAssessmentAccess(base(),{math_open:true}),store.setPersistentAssessmentAccess(base(),{corrections_open:true}),store.setPersistentAssessmentAccess(base(),{allow_completed_access:true})]);
 const value=await restartedStore().resolveAssessmentAccess(base());assert.deepEqual(value.sectionAccess,{english:true,math:true});assert.equal(value.correctionsOpen,true);assert.equal(value.allowCompletedAccess,true);
});
test('first saved change snapshots the other existing settings',async()=>{
 const current={...base(),status:'open',sectionAccess:{english:true,math:true}};await restartedStore().setPersistentAssessmentAccess(current,{corrections_open:true});
 const value=await restartedStore().resolveAssessmentAccess(base());assert.deepEqual(value.sectionAccess,{english:true,math:true});assert.equal(value.correctionsOpen,true);
});
test('lists apply overrides only to catalog exams and leave new exams at their configured defaults',async()=>{
 const store=restartedStore();await store.setPersistentAssessmentAccess(base(),{english_open:true});await store.setPersistentAssessmentAccess({...base(),id:'deleted-exam'},{math_open:true});
 const list=await store.resolveAssessmentAccessList([base(),{...base(),id:'new-exam'}]);assert.equal(list.length,2);assert.equal(list[0].status,'open');assert.equal(list[1].status,'locked');assert.equal(await store.resolveAssessmentAccess(undefined),undefined);
});
test('read/write failures surface an error and do not replace the persisted open state',async()=>{
 const store=restartedStore();await store.setPersistentAssessmentAccess(base(),{english_open:true});failing=true;
 await assert.rejects(store.resolveAssessmentAccess(base()),error=>error.status===503);
 await assert.rejects(store.setPersistentAssessmentAccess(base(),{english_open:false}),error=>error.status===503);
 failing=false;assert.equal((await restartedStore().resolveAssessmentAccess(base())).sectionAccess.english,true);
});
test('the real teacher access setters persist to the database without rewriting the deployment catalog',async()=>{
 const fs=require('node:fs'),read=fs.readFileSync,write=fs.writeFileSync,exists=fs.existsSync;
 const isCatalog=file=>typeof file==='string'&&file.replaceAll('\\','/').endsWith('/data/assessments.json');
 fs.existsSync=file=>isCatalog(file)||exists(file);
 fs.readFileSync=(file,...args)=>isCatalog(file)?JSON.stringify([{...base(),forms:[],passages:[],questions:[]}]):read(file,...args);
 fs.writeFileSync=(file,...args)=>{if(isCatalog(file))throw new Error('Access must not rewrite catalog');return write(file,...args);};
 try {
  const config=require('../src/config/assessments.ts');
  assert.equal((await config.updateAssessmentStatus('exam','open')).status,'open');
  await config.updateAssessmentCompletedAccess('exam',true);await config.updateAssessmentCorrectionsAccess('exam',true);
  await config.updateAssessmentSectionAccess('exam','english',false);
  const value=await restartedStore().resolveAssessmentAccess(base());assert.deepEqual(value.sectionAccess,{english:false,math:true});assert.equal(value.allowCompletedAccess,true);assert.equal(value.correctionsOpen,true);
  await config.updateAssessmentStatus('exam','locked');assert.equal((await restartedStore().resolveAssessmentAccess(base())).status,'locked');
  assert.equal(await config.updateAssessmentStatus('unknown','open'),null);
 } finally {fs.readFileSync=read;fs.writeFileSync=write;fs.existsSync=exists;}
});
