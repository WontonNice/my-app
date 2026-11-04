// Targeted repair of the saved, empty Simplifying Expressions module.
require('../../tools/register-practice-generator.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {validatePracticeCatalog,studentPracticeCatalog,managedGeneratorIds}=require('../../server/src/shared/practiceCatalog.ts');
const {foundationOptions,foundationSelection}=require('../../client/src/features/math-command/foundationPreferences.ts');
const before=JSON.parse(fs.readFileSync(__dirname+'/settings-catalog-before.json','utf8'));
const catalog=structuredClone(before.catalog);
const moduleId='ed43bc4b-77e7-42c2-b0fa-f677efd08459';
const generatorId='algebra-distribute-negative-v1';
const parentId='foundation-algebra-algebraic-expressions-rj42ee';
const moduleRow=catalog.modules.find(m=>m.id===moduleId);
assert.equal(moduleRow.skilled,'9abd5350-a5f2-4fad-9822-c1e064977942');
assert.deepEqual(moduleRow.generatorIds,[]);
assert.equal(moduleRow.published,false);
const generator=catalog.generators.find(g=>g.id===generatorId);
assert.equal(generator.title,'Simplifying Expressions');
assert.equal(generator.enabled,true);
assert.equal(generator.category,moduleRow.category);assert.equal(generator.topic,moduleRow.topic);
Object.assign(moduleRow,{title:'Simplifying Expressions',titleMode:'skill',parentId,published:true,generatorIds:[generatorId]});
validatePracticeCatalog(catalog);
const students=studentPracticeCatalog(catalog),parent=students.modules.find(m=>m.id===parentId);
const options=foundationOptions(parent,students);
assert.deepEqual(options.modules.map(m=>m.title),['Simplifying Expressions']);
assert.deepEqual(options.unassigned,['symbolic-fraction-division-v1']);
const selected=foundationSelection(parent,students,{excludedModuleIds:[moduleId],includeUnassigned:true});
assert.deepEqual(managedGeneratorIds(parent,students,selected),['symbolic-fraction-division-v1']);
assert.deepEqual(catalog.generators,before.catalog.generators);
assert.deepEqual(catalog.modules.filter(m=>m.id!==moduleId),before.catalog.modules.filter(m=>m.id!==moduleId));
assert.deepEqual(catalog.videos,before.catalog.videos);
fs.writeFileSync(__dirname+'/settings-catalog-preview.json',JSON.stringify({revision:before.revision,catalog},null,2));
async function main(){
 if(!process.argv.includes('--apply')){console.log(JSON.stringify({verified:true,revision:before.revision,module:moduleRow,unassigned:options.unassigned},null,2));return;}
 require('dotenv').config({path:['server/.env','.env'],quiet:true});
 const {supabase}=require('../../server/src/lib/supabase.ts');
 const result=await supabase.from('infinite_practice_catalog').update({catalog,revision:before.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',before.revision).select('revision,catalog').maybeSingle();
 if(result.error||!result.data)throw Error(result.error?.message||'Catalog changed concurrently; no repair was applied.');
 const saved=await supabase.from('infinite_practice_catalog').select('revision,catalog').eq('id','main').single();
 if(saved.error)throw Error(saved.error.message);
 assert.deepEqual(saved.data.catalog,catalog);
 fs.writeFileSync(__dirname+'/settings-catalog-after.json',JSON.stringify(saved.data,null,2));
 console.log(JSON.stringify({saved:true,revision:saved.data.revision,moduleTitle:moduleRow.title,generatorIds:moduleRow.generatorIds}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
