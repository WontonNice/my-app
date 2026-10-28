// Preview first; --apply performs one optimistic-concurrency checked catalog write.
require('./register-practice-generator.cjs');
const path=require('node:path'),fs=require('node:fs'),{isDeepStrictEqual}=require('node:util');
const serverRequire=require('node:module').createRequire(path.resolve(__dirname,'../server/package.json'));
const {defaultPracticeCatalog,validatePracticeCatalog,reconcilePracticeTaxonomy,practiceModuleKind}=require('../server/src/shared/practiceCatalog.ts');
const {organizePracticeCatalog}=require('../server/src/shared/practiceOrganization.ts');

async function main(){
  serverRequire('dotenv').config({path:[path.resolve(__dirname,'../server/.env'),path.resolve(__dirname,'../.env')],quiet:true});
  const {supabase}=require('../server/src/lib/supabase.ts');
  const {mathCommandRoot,readMathCommandTaxonomy,readMathCommandState}=require('../server/src/lib/mathCommandCatalogStore.ts');
  const {withMathCommandPersistence}=require('../server/src/lib/mathCommandPersistence.ts');
  return withMathCommandPersistence(mathCommandRoot,async()=>{
    const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
    if(stored.error)throw Error(`Cannot read the practice catalog: ${stored.error.message}`);
    const taxonomy=readMathCommandTaxonomy(),previous=stored.data?.catalog??defaultPracticeCatalog();
    const current=validatePracticeCatalog(reconcilePracticeTaxonomy(previous,taxonomy,readMathCommandState().taxonomyTopicRenames),taxonomy);
    const catalog=validatePracticeCatalog(organizePracticeCatalog(current),taxonomy);
    const changed=!stored.data||!isDeepStrictEqual(previous,catalog),apply=process.argv.includes('--apply'),revision=stored.data?.revision??0;
    let backup;
    if(apply&&changed){
      backup=path.resolve(__dirname,`../artifacts/practice-organization-backup-revision-${revision}.json`);
      fs.mkdirSync(path.dirname(backup),{recursive:true});
      if(!fs.existsSync(backup))fs.writeFileSync(backup,JSON.stringify({revision,catalog:stored.data?.catalog??null},null,2),{flag:'wx'});
      const row={id:'main',catalog,revision:revision+1,updated_at:new Date().toISOString()};
      const saved=stored.data?await supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',revision).select('revision').maybeSingle():await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle();
      if(saved.error||!saved.data)throw Error(saved.error?.message??'Another window saved changes. Preview the latest catalog before trying again.');
    }
    console.log(JSON.stringify({mode:apply?'apply':'read-only-preview',changed,saved:apply&&changed,revision:revision+Number(apply&&changed),backup,
      generators:catalog.generators.length,renamedGenerators:catalog.generators.filter(item=>previous.generators.find(old=>old.id===item.id)?.title!==item.title).map(item=>({id:item.id,title:item.title})),
      probabilityModules:catalog.modules.filter(item=>item.topic==='Probability'&&!practiceModuleKind(item)).map(item=>({id:item.id,title:item.title,published:item.published,generators:item.generatorIds.length,parentId:item.parentId}))},null,2));
  });
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
