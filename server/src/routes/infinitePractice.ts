import { practiceProgressRouter } from './practiceProgress';
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { getAuthenticatedUser, getEnrolledClassIds } from '../lib/auth';
import { mathCommandRoot, readMathCommandState, readMathCommandTaxonomy } from '../lib/mathCommandCatalogStore';
import { withMathCommandPersistence } from '../lib/mathCommandPersistence';
import { defaultPracticeCatalog, reconcilePracticeSkilled, reconcilePracticeTaxonomy, studentPracticeCatalog, validatePracticeCatalog,reviewPracticePublication } from '../shared/practiceCatalog';

export const infinitePracticeRouter=Router();
const storageMessage='Practice studio storage is unavailable. Apply migration 202610260004_practice_catalog.sql and check the database connection.';
infinitePracticeRouter.use(async(request,response,next)=>{
  const {user,error}=await getAuthenticatedUser(request.headers.authorization);
  if(!user){response.status(401).json({message:error});return;}
  const teacher=['teacher','admin'].includes(String(user.app_metadata.role));
  if(!teacher&&!getEnrolledClassIds(user.app_metadata).includes('shsat')){response.status(403).json({message:'Active SHSAT enrollment is required.'});return;}
  response.locals.teacher=teacher;response.locals.user=user;response.setHeader('Cache-Control','no-store');next();
});
infinitePracticeRouter.use('/progress', practiceProgressRouter);
infinitePracticeRouter.get('/evidence/:studentId',async(request,response)=>{
  const studentId=request.params.studentId==='me'?response.locals.user.id:request.params.studentId;
  if(studentId!==response.locals.user.id&&!response.locals.teacher){response.status(403).json({message:'You can only view your own practice responses.'});return;}
  const page=Number(request.query.page??0);
  if(!Number.isSafeInteger(page)||page<0||page>10000){response.status(400).json({message:'Invalid evidence page.'});return;}
  const result=await supabase.from('math_practice_checkpoints').select('session').eq('user_id',studentId).gte('module_id','__response__:').lt('module_id','__response__;').order('module_id',{ascending:false}).range(page*50,page*50+49);
  if(result.error){response.status(503).json({message:'Practice responses could not be loaded. Try again.'});return;}
  response.json({responses:(result.data??[]).map(row=>row.session),hasMore:result.data?.length===50});
});
infinitePracticeRouter.use((request,response,next)=>{
  if((request.method!=='GET'||request.query.manage==='1')&&!response.locals.teacher){response.status(403).json({message:'Teacher access is required.'});return;}
  next();
});
infinitePracticeRouter.get('/catalog',async(request,response)=>withMathCommandPersistence(mathCommandRoot,async()=>{
  const stored=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
  if(stored.error){response.status(503).json({message:storageMessage});return;}
  const taxonomy=readMathCommandTaxonomy();
  let catalog;
  try{catalog=validatePracticeCatalog(reconcilePracticeSkilled(reconcilePracticeTaxonomy(stored.data?.catalog??defaultPracticeCatalog(),taxonomy,readMathCommandState().taxonomyTopicRenames),taxonomy.classificationSkills??[]),taxonomy);}
  catch(error){if((error as {status?:number}).status!==400)throw error;response.status(409).json({message:`Practice resources need an update before the studio can open: ${(error as Error).message}`,requestId:response.locals.requestId});return;}
  const manage=request.query.manage==='1'&&response.locals.teacher;
  response.json({catalog:manage?catalog:studentPracticeCatalog(catalog),revision:stored.data?.revision??0,taxonomy:taxonomy.categories.map(({label,topics})=>({label,topics})),classificationSkills:taxonomy.classificationSkills??[]});
}));
infinitePracticeRouter.put('/catalog',async(request,response)=>withMathCommandPersistence(mathCommandRoot,async()=>{
  const revision=request.body?.revision;
  if(!Number.isSafeInteger(revision)||revision<0){response.status(400).json({message:'Reload the studio before saving.'});return;}
  const previous=await supabase.from('infinite_practice_catalog').select('catalog,revision').eq('id','main').maybeSingle();
  if(previous.error){response.status(503).json({message:storageMessage});return;}
  if((previous.data?.revision??0)!==revision){response.status(409).json({message:'Another window saved changes. Reload before saving.'});return;}
  let catalog;try{const taxonomy=readMathCommandTaxonomy();catalog=validatePracticeCatalog(reconcilePracticeSkilled(reconcilePracticeTaxonomy(request.body.catalog,taxonomy,readMathCommandState().taxonomyTopicRenames),taxonomy.classificationSkills??[]),taxonomy);}catch(error){response.status(400).json({message:(error as Error).message});return;}
  try{catalog=reviewPracticePublication(previous.data?.catalog??defaultPracticeCatalog(),catalog);}catch(error){response.status(400).json({message:(error as Error).message});return;}
  const row={id:'main',catalog,revision:revision+1,updated_at:new Date().toISOString(),updated_by:response.locals.user.id};
  const saved=revision===0?await supabase.from('infinite_practice_catalog').insert(row).select('revision').maybeSingle():await supabase.from('infinite_practice_catalog').update(row).eq('id','main').eq('revision',revision).select('revision').maybeSingle();
  if(saved.error?.code==='23505'||!saved.error&&!saved.data){response.status(409).json({message:'Another window saved changes. Reload the latest catalog before saving.'});return;}
  if(saved.error){response.status(503).json({message:storageMessage});return;}
  response.json({catalog,revision:revision+1});
}));
