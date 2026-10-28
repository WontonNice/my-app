// Content Studio edits the same durable catalog as the authenticated teacher app.
// Credentials stay on the local server; the browser receives only catalog data.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
let runtime;
function loadRuntime(root){
  if(runtime)return runtime;
  const serverRequire=require('node:module').createRequire(path.join(root,'server/package.json'));
  serverRequire('dotenv').config({path:[path.join(root,'server/.env'),path.join(root,'.env')],quiet:true});
  const previous=require.extensions['.ts'];
  require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
  try{runtime={...require(path.join(root,'server/src/shared/practiceCatalog.ts')),...require(path.join(root,'server/src/lib/mathCommandCatalogStore.ts')),...require(path.join(root,'server/src/lib/mathCommandPersistence.ts')),...require(path.join(root,'server/src/lib/supabase.ts'))};}
  finally{if(previous)require.extensions['.ts']=previous;else delete require.extensions['.ts'];}
  return runtime;
}
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
async function handlePracticeCatalogRequest({method,body,root},injected){
  let r;try{r=injected??loadRuntime(root);}catch{fail(503,'The shared practice catalog is unavailable. Configure the Content Studio server with the same Supabase project as the teacher app.');}
  return r.withMathCommandPersistence(root,async()=>{
    const taxonomy=r.readMathCommandTaxonomy(root),renames=r.readMathCommandState(root).taxonomyTopicRenames;
    if(method==='PUT'){
      if(!Number.isSafeInteger(body?.revision)||body.revision<0)fail(400,'Reload the studio before saving.');
      if(!body.catalog||typeof body.catalog!=='object'||!Array.isArray(body.catalog.generators)||!Array.isArray(body.catalog.modules)||!Array.isArray(body.catalog.videos))fail(400,'Provide a complete practice catalog.');
      const catalog=r.validatePracticeCatalog(r.reconcilePracticeTaxonomy(body.catalog,taxonomy,renames),taxonomy);
      const row={id:'main',catalog,revision:body.revision+1,updated_at:new Date().toISOString()};
      const saved=body.revision===0?await r.supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle():await r.supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',body.revision).select('revision').maybeSingle();
      if(saved.error?.code==='23505'||!saved.error&&!saved.data)fail(409,'Another window saved changes. Reload the latest catalog before saving.');
      if(saved.error)fail(503,'The shared practice catalog could not be saved. Check the database connection and practice catalog migration.');
      return {catalog,revision:body.revision+1};
    }
    if(method!=='GET')fail(405,'Use GET or PUT for the practice catalog.');
    const stored=await r.supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
    if(stored.error)fail(503,'The shared practice catalog could not be loaded. Check the database connection and practice catalog migration.');
    let catalog;try{catalog=r.validatePracticeCatalog(r.reconcilePracticeSkilled(r.reconcilePracticeTaxonomy(stored.data?.catalog??r.defaultPracticeCatalog(),taxonomy,renames),taxonomy.classificationSkills??[]),taxonomy);}catch(error){fail(409,`Practice resources need an update: ${error.message}`);}
    return {catalog,revision:stored.data?.revision??0,taxonomy:taxonomy.categories,classificationSkills:taxonomy.classificationSkills??[]};
  });
}
module.exports={handlePracticeCatalogRequest};
