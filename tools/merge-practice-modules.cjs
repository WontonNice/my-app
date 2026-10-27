require('./register-practice-generator.cjs');
const path=require('node:path'),{isDeepStrictEqual}=require('node:util');
const serverRequire=require('node:module').createRequire(path.resolve(__dirname,'../server/package.json'));
async function main(){
 serverRequire('dotenv').config({path:[path.resolve(__dirname,'../server/.env'),path.resolve(__dirname,'../.env')],quiet:true});
 const {supabase}=require('../server/src/lib/supabase.ts'),store=require('../server/src/lib/mathCommandCatalogStore.ts');
 const {withMathCommandPersistence}=require('../server/src/lib/mathCommandPersistence.ts');
 const {mergePracticeModules,reconcilePracticeTaxonomy,validatePracticeCatalog}=require('../server/src/shared/practiceCatalog.ts');
 const args=Object.fromEntries(process.argv.slice(2).filter(arg=>arg.startsWith('--')&&arg.includes('=')).map(arg=>{const at=arg.indexOf('=');return[arg.slice(2,at),arg.slice(at+1)];}));
 if(!args.into||!args.from||args.into===args.from)throw Error('Use --into=<module-id> --from=<module-id> [--description=...] [--apply].');
 return withMathCommandPersistence(store.mathCommandRoot,async()=>{
  const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').single();if(stored.error)throw Error(stored.error.message);
  const taxonomy=store.readMathCommandTaxonomy();
  let catalog=validatePracticeCatalog(reconcilePracticeTaxonomy(stored.data.catalog,taxonomy,store.readMathCommandState().taxonomyTopicRenames),taxonomy);
  if(!catalog.modules.some(module=>module.id===args.into))throw Error('The destination module does not exist.');
  if(catalog.modules.some(module=>module.id===args.from))catalog=mergePracticeModules(catalog,args.into,args.from);
  if(args.description!==undefined)catalog={...catalog,modules:catalog.modules.map(module=>module.id===args.into?{...module,description:args.description}:module)};
  catalog=validatePracticeCatalog(catalog,taxonomy);
  const changed=!isDeepStrictEqual(catalog,stored.data.catalog),apply=process.argv.includes('--apply');
  if(apply&&changed){const saved=await supabase.from('infinite_practice_catalog').update({catalog,revision:stored.data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',stored.data.revision).select('revision').maybeSingle();if(saved.error||!saved.data)throw Error(saved.error?.message??'Catalog changed in another window. Retry with the latest revision.');}
  const module=catalog.modules.find(module=>module.id===args.into);
  console.log(JSON.stringify({mode:apply?'apply':'read-only-preview',changed,saved:apply&&changed,revision:stored.data.revision+Number(apply&&changed),module:{id:module.id,title:module.title,topic:module.topic,parentId:module.parentId,generatorIds:module.generatorIds},removedModule:args.from},null,2));
 });
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
