// One-time, revision-checked classification correction explicitly requested for this batch.
require('./register-practice-generator.cjs');
require('dotenv').config({path:['server/.env','.env'],quiet:true});
const fs=require('node:fs'),assert=require('node:assert/strict');
const {supabase}=require('../server/src/lib/supabase.ts');
const {createMathCommandPersistence}=require('../server/src/lib/mathCommandPersistence.ts');
const {mathCommandRoot,readMathCommandTaxonomy}=require('../server/src/lib/mathCommandCatalogStore.ts');
const {validatePracticeCatalog,studentPracticeCatalog,managedGeneratorIds,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {templates}=require('./register-algebra-planner.cjs');
const {createPracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
(async()=>createMathCommandPersistence(supabase).run(mathCommandRoot,async()=>{
 const {data,error}=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').single();if(error)throw error;
 const next=structuredClone(data.catalog),ids=['evaluating-substituting-55e91aa0','ca02b8f6-c345-4113-8249-87ec13615831'];
 for(const id of ids){const module=next.modules.find(m=>m.id===id);assert.ok(module);module.skilled='TBD';module.titleMode='custom';}
 validatePracticeCatalog(next,readMathCommandTaxonomy());
 const students=studentPracticeCatalog(next);
 for(const t of templates){const m=students.modules.find(m=>m.id===t.moduleId),g=students.generators.find(g=>g.id===t.id);assert.ok(m&&g?.enabled);assert.ok(managedGeneratorIds(m,students).includes(t.id));assert.ok(generateCatalogQuestion(g,0,'verify',3));assert.ok(createPracticeState(m.id,'verify',students));}
 const changed=JSON.stringify(data.catalog)!==JSON.stringify(next),apply=process.argv.includes('--apply');
 if(apply&&changed){const saved=await supabase.from('infinite_practice_catalog').update({catalog:next,revision:data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',data.revision).select('revision').maybeSingle();if(saved.error||!saved.data)throw new Error(saved.error?.message??'Catalog changed concurrently. Read it again.');}
 const revision=data.revision+Number(apply&&changed);
 fs.writeFileSync('artifacts/algebra-batch/catalog-after.json',JSON.stringify({revision,catalog:apply?next:data.catalog},null,2));
 console.log(JSON.stringify({changed,saved:apply&&changed,revision,studentGeneratorChecks:templates.length,changes:ids.map(id=>({id,title:next.modules.find(m=>m.id===id).title,skilled:'TBD'}))},null,2));
}))().catch(error=>{console.error(error.message);process.exitCode=1;});
