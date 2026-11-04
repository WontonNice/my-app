import { practiceSkillSnapshot, withPracticeSkillSnapshot } from './practiceSkillContext';
import { defaultPracticeCatalog, reconcilePracticeTaxonomy } from '../shared/practiceCatalog';
import { readMathCommandTaxonomy } from './mathCommandCatalogStore';
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { currentMathCommandStateContext, mathCommandRoot, readMathCommandState, runMathCommandStateContext, type MathManagementState } from "./mathCommandCatalogStore";

const table="math_command_metadata",singleton="main";
export const mathCommandMigration="supabase/migrations/202610260001_math_command_metadata.sql";
const fail=(message:string,status=503)=>Object.assign(new Error(message),{status});
function storageError(error:unknown):never {
  const code=(error as {code?:string}|null)?.code;
  if(["42P01","PGRST205","42703"].includes(code||""))throw fail(`Math Command Center durable storage is not installed. Apply ${mathCommandMigration} before using the hosted workspace. No local fallback was used.`);
  throw fail("Math Command Center durable metadata storage could not be loaded or saved. Retry; no local fallback was used.");
}
export function usesRemoteMathCommandStorage(){return process.env.NODE_ENV==="production"||process.env.MATH_COMMAND_STORAGE!=="file";}

/** A request-scoped adapter: canonical questions stay in their existing stores. */
export function createMathCommandPersistence(client:SupabaseClient) {
  async function read(root:string) {
    const result=await client.from(table).select("revision,state").eq("id",singleton).maybeSingle();
    if(result.error)storageError(result.error);
    const saved=result.data as {revision:string;state:MathManagementState}|null;
    if(saved&&(!saved.revision||!saved.state||typeof saved.state!=="object"||Array.isArray(saved.state)||!saved.state.metadata))throw fail("Math Command Center metadata has an invalid saved shape. Restore the metadata backup before continuing.");
    // First use may seed the published metadata sidecar. Once present, the
    // durable record is authoritative and a redeploy cannot overwrite it.
    return {root,state:saved?{...saved.state,revision:saved.revision}:readMathCommandState(root),originalRevision:saved?.revision??null,dirty:false};
  }
  return {
    async run<T>(root:string,operation:()=>T|Promise<T>):Promise<T>{return runMathCommandStateContext(await read(root),operation);},
    async persist(root=mathCommandRoot) {
      const context=currentMathCommandStateContext(root);if(!context?.dirty)return;
      const row={id:singleton,revision:context.state.revision,state:context.state,updated_at:new Date().toISOString()};
      if(context.originalRevision===null){
        const result=await client.from(table).insert(row).select("revision").maybeSingle();
        if(result.error){if(result.error.code==="23505")throw fail("Math management changed in another window. Reload and review a fresh preview.",409);storageError(result.error);}
        if(!result.data)throw fail("Math metadata was not confirmed saved. Reload before retrying.",409);
      }else{
        const result=await client.from(table).update(row).eq("id",singleton).eq("revision",context.originalRevision).select("revision").maybeSingle();
        if(result.error)storageError(result.error);
        if(!result.data)throw fail("Math management changed in another window. Reload and review a fresh preview.",409);
      }
      context.originalRevision=context.state.revision;context.dirty=false;
    },
    async seed(root:string,apply=false){
      const context=await read(root);
      if(context.originalRevision!==null)return {created:false,exists:true,revision:context.originalRevision,questionMetadataCount:Object.keys(context.state.metadata).length};
      if(!apply)return {created:false,exists:false,revision:context.state.revision,questionMetadataCount:Object.keys(context.state.metadata).length};
      context.dirty=true;
      await runMathCommandStateContext(context,()=>this.persist(root));
      return {created:true,exists:true,revision:context.state.revision,questionMetadataCount:Object.keys(context.state.metadata).length};
    },
  };
}
const persistence=createMathCommandPersistence(supabase);
export async function withMathCommandPersistence<T>(root:string,operation:()=>T|Promise<T>):Promise<T>{
  if(currentMathCommandStateContext(root)&&practiceSkillSnapshot(root))return operation();
  const run=async()=>{
    const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
    if(stored.error)throw fail('The shared skill/module catalog could not be loaded. Retry; no partial skill list was used.');
    const taxonomy=readMathCommandTaxonomy(root);
    const catalog=reconcilePracticeTaxonomy(stored.data?.catalog??defaultPracticeCatalog(),taxonomy,readMathCommandState(root).taxonomyTopicRenames);
    return withPracticeSkillSnapshot(root,catalog.modules,stored.data?.revision??0,operation);
  };
  return usesRemoteMathCommandStorage()?persistence.run(root,run):operation();
}
export async function persistMathCommandContext(root=mathCommandRoot){
  const snapshot=practiceSkillSnapshot(root);
  if(snapshot&&currentMathCommandStateContext(root)?.dirty){
    const current=await supabase.from('infinite_practice_catalog').select('revision').eq('id','main').maybeSingle();
    if(current.error)throw fail('The skill/module catalog could not be checked before saving. Retry.');
    if((current.data?.revision??0)!==snapshot.revision)throw fail('Practice modules changed while saving skills. Reload and review the latest list.',409);
  }
  await persistence.persist(root);
}
export const seedMathCommandMetadata=(root=mathCommandRoot,apply=false)=>persistence.seed(root,apply);
