import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { getAuthenticatedUser, getEnrolledClassIds } from '../lib/auth';
import { readMathCommandTaxonomy } from '../lib/mathCommandCatalogStore';
import { defaultPracticeCatalog, studentPracticeCatalog, validatePracticeCatalog } from '../shared/practiceCatalog';

export const infinitePracticeRouter=Router();
const storageMessage='Practice studio storage is unavailable. Apply migration 202610260004_practice_catalog.sql and check the database connection.';
infinitePracticeRouter.use(async(request,response,next)=>{
  const {user,error}=await getAuthenticatedUser(request.headers.authorization);
  if(!user){response.status(401).json({message:error});return;}
  const teacher=['teacher','admin'].includes(String(user.app_metadata.role));
  if(!teacher&&!getEnrolledClassIds(user.app_metadata).includes('shsat')){response.status(403).json({message:'Active SHSAT enrollment is required.'});return;}
  if((request.method!=='GET'||request.query.manage==='1')&&!teacher){response.status(403).json({message:'Teacher access is required.'});return;}
  response.locals.teacher=teacher;response.locals.user=user;response.setHeader('Cache-Control','no-store');next();
});
infinitePracticeRouter.get('/catalog',async(request,response)=>{
  const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
  if(stored.error){response.status(503).json({message:storageMessage});return;}
  const catalog=stored.data?validatePracticeCatalog(stored.data.catalog):defaultPracticeCatalog();
  const manage=request.query.manage==='1'&&response.locals.teacher;
  response.json({catalog:manage?catalog:studentPracticeCatalog(catalog),revision:stored.data?.revision??0,...(manage?{taxonomy:readMathCommandTaxonomy().categories.map(({label,topics})=>({label,topics}))}:{})});
});
infinitePracticeRouter.put('/catalog',async(request,response)=>{
  const revision=request.body?.revision;
  if(!Number.isSafeInteger(revision)||revision<0){response.status(400).json({message:'Reload the studio before saving.'});return;}
  let catalog;try{catalog=validatePracticeCatalog(request.body.catalog,readMathCommandTaxonomy());}catch(error){response.status(400).json({message:(error as Error).message});return;}
  const row={id:'main',catalog,revision:revision+1,updated_at:new Date().toISOString(),updated_by:response.locals.user.id};
  const saved=revision===0?await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle():await supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',revision).select('revision').maybeSingle();
  if(saved.error?.code==='23505'||!saved.error&&!saved.data){response.status(409).json({message:'Another window saved changes. Reload the latest catalog before saving.'});return;}
  if(saved.error){response.status(503).json({message:storageMessage});return;}
  response.json({catalog,revision:revision+1});
});
