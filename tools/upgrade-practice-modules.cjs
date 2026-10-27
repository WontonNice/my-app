// One revision-checked migration for existing catalogs; --apply saves the preview.
require('./register-practice-generator.cjs');
const path=require('node:path');
const {isDeepStrictEqual}=require('node:util');
const serverRequire=require('node:module').createRequire(path.resolve(__dirname,'../server/package.json'));
const {defaultPracticeCatalog,validatePracticeCatalog,practiceModuleKind,reconcilePracticeTaxonomy}=require('../server/src/shared/practiceCatalog.ts');
async function main(){
 serverRequire('dotenv').config({path:[path.resolve(__dirname,'../server/.env'),path.resolve(__dirname,'../.env')],quiet:true});
 const {supabase}=require('../server/src/lib/supabase.ts');
 const {mathCommandRoot,readMathCommandState,readMathCommandTaxonomy}=require('../server/src/lib/mathCommandCatalogStore.ts');
 const {withMathCommandPersistence}=require('../server/src/lib/mathCommandPersistence.ts');
 return withMathCommandPersistence(mathCommandRoot,async()=>{
 const taxonomy=readMathCommandTaxonomy(),renames=readMathCommandState().taxonomyTopicRenames;
 const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
 if(stored.error)throw new Error(stored.error.message);
 const catalog=validatePracticeCatalog(reconcilePracticeTaxonomy(stored.data?.catalog??defaultPracticeCatalog(),taxonomy,renames),taxonomy);
 const revision=stored.data?.revision??0,changed=!stored.data||!isDeepStrictEqual(catalog,stored.data.catalog),apply=process.argv.includes('--apply');
 if(apply&&changed){
  const row={id:'main',catalog,revision:revision+1,updated_at:new Date().toISOString()};
  const saved=!stored.data?await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle():await supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',revision).select('revision').maybeSingle();
  if(saved.error||!saved.data)throw new Error(saved.error?.message??'Catalog changed in another window. Retry using the latest revision.');
 }
 console.log(JSON.stringify({mode:apply?'apply':'read-only-preview',changed,saved:apply&&changed,revision:revision+Number(apply&&changed),topics:taxonomy.categories.reduce((sum,c)=>sum+c.topics.length,0),defaultModules:catalog.modules.filter(m=>practiceModuleKind(m)).length,nestedModules:catalog.modules.filter(m=>m.parentId).length,standaloneModules:catalog.modules.filter(m=>!practiceModuleKind(m)&&!m.parentId).length},null,2));
 });
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
