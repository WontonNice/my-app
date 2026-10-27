// Explicit repair for a rename made before taxonomy rename tracking existed.
require('./register-practice-generator.cjs');
const path=require('node:path'),{isDeepStrictEqual}=require('node:util');
const serverRequire=require('node:module').createRequire(path.resolve(__dirname,'../server/package.json'));
async function main(){
 serverRequire('dotenv').config({path:[path.resolve(__dirname,'../server/.env'),path.resolve(__dirname,'../.env')],quiet:true});
 const {supabase}=require('../server/src/lib/supabase.ts');
 const store=require('../server/src/lib/mathCommandCatalogStore.ts');
 const {withMathCommandPersistence,persistMathCommandContext}=require('../server/src/lib/mathCommandPersistence.ts');
 const {validatePracticeCatalog,reconcilePracticeTaxonomy}=require('../server/src/shared/practiceCatalog.ts');
 const args=Object.fromEntries(process.argv.slice(2).filter(arg=>arg.startsWith('--')&&arg.includes('=')).map(arg=>{const at=arg.indexOf('=');return[arg.slice(2,at),arg.slice(at+1)];}));
 if(!args.category||!args.from||!args.to)throw Error('Use --category=... --from=... --to=... [--apply].');
 return withMathCommandPersistence(store.mathCommandRoot,async()=>{
  const taxonomy=store.readMathCommandTaxonomy(),state=store.readMathCommandState(),category=taxonomy.categories.find(c=>c.label===args.category);
  if(!category||category.topics.includes(args.from)||!category.topics.includes(args.to))throw Error('The old subcategory must be absent and the new subcategory must exist in the active taxonomy.');
  const rename={category:args.category,from:args.from,to:args.to},renames=state.taxonomyTopicRenames??[];
  const mappingChanged=!renames.some(r=>isDeepStrictEqual(r,rename)),nextRenames=mappingChanged?[...renames,rename]:renames;
  const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').single();
  if(stored.error)throw Error(stored.error.message);
  const catalog=validatePracticeCatalog(reconcilePracticeTaxonomy(stored.data.catalog,taxonomy,nextRenames),taxonomy),catalogChanged=!isDeepStrictEqual(catalog,stored.data.catalog),apply=process.argv.includes('--apply');
  if(apply&&mappingChanged){store.commitMathCommandState(store.mathCommandRoot,state.revision,{...state,taxonomyTopicRenames:nextRenames});await persistMathCommandContext();}
  if(apply&&catalogChanged){
   const saved=await supabase.from('infinite_practice_catalog').update({catalog,revision:stored.data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',stored.data.revision).select('revision').maybeSingle();
   if(saved.error||!saved.data)throw Error(saved.error?.message??'Catalog changed. Retry using the latest revision; the saved rename mapping keeps reads consistent.');
  }
  console.log(JSON.stringify({mode:apply?'apply':'read-only-preview',rename,mappingChanged,catalogChanged,saved:apply&&(mappingChanged||catalogChanged),revision:stored.data.revision+Number(apply&&catalogChanged)},null,2));
 });
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
