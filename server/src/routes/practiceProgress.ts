import { randomUUID,createHash } from 'node:crypto';
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { mergePracticeCheckpoint, parsePracticeState, type PracticeCheckpoint } from '../shared/practiceCheckpoint';
import {validatePracticeEvidence,type SavedPracticeEvidence} from '../shared/practiceEvidence';

export const practiceProgressRouter = Router();
const table = 'math_practice_checkpoints';
const columns = 'moduleId:module_id,best,session,revision';
const unavailable = 'Account practice storage is unavailable. Your browser copy is kept.';

// Mounted after SHSAT authentication. Check identity again because a browser
// may refresh its access token under another account while a save is pending.
practiceProgressRouter.use((req, res, next) => {
  if (req.get('X-Practice-Owner') !== res.locals.user.id) {
    res.status(403).json({ message: 'The signed-in practice account changed.' });
    return;
  }
  next();
});

practiceProgressRouter.get('/', async (req, res) => {
  const page = Number(req.query.page ?? 0);
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) {
    res.status(400).json({ message: 'Invalid progress page.' });
    return;
  }
  const { data, error } = await supabase.from(table).select(columns)
    .eq('user_id', res.locals.user.id).not('module_id','like','\\_\\_response\\_\\_:%').order('module_id').range(page * 50, page * 50 + 49);
  if (error) { res.status(503).json({ message: unavailable }); return; }
  res.json((data??[]).filter(row=>!row.moduleId.startsWith('__response__:')));
});

practiceProgressRouter.put('/', async (req, res) => {
  const { moduleId, best, session } = req.body ?? {};
  const parsed = session ? parsePracticeState(JSON.stringify(session)) : null;
  if (typeof moduleId !== 'string' || !moduleId.trim() || moduleId.startsWith('__') || moduleId.length > 250 ||
      !Number.isSafeInteger(best) || best < 0 || (session !== null && (!parsed || parsed.moduleId !== moduleId))) {
    res.status(400).json({ message: 'Invalid practice checkpoint.' });
    return;
  }
  const incoming: PracticeCheckpoint = { moduleId, best, session: parsed };
  if(parsed)delete parsed.evidenceThrough;
  const userId = res.locals.user.id;
  if(parsed?.responses?.length){
    const baseline=await supabase.from(table).select(columns).eq('user_id',userId).eq('module_id',moduleId).maybeSingle();
    if(baseline.error){res.status(503).json({message:unavailable});return;}
    const original=baseline.data?.session?.seed===parsed.seed&&baseline.data?.session?.startedAt===parsed.startedAt?baseline.data.session as NonNullable<PracticeCheckpoint['session']>:null;
    const recordedByIndex=new Map((original?.responses??[]).map(row=>[row.index,row]));
    if(parsed.responses.some(row=>recordedByIndex.has(row.index)&&JSON.stringify(recordedByIndex.get(row.index)!.answer)!==JSON.stringify(row.answer))){res.status(409).json({message:'A checked answer has already been saved. Reload the session before continuing.'});return;}
    let evidence;
    try{evidence=validatePracticeEvidence({...parsed,responses:parsed.responses.filter(row=>!recordedByIndex.has(row.index))});}catch(error){res.status(409).json({message:(error as Error).message});return;}
    parsed.responses=parsed.responses.map(row=>recordedByIndex.get(row.index)??evidence.find(item=>item.index===row.index)!);
    for(const row of evidence){
      const key='__response__:'+String(parsed.startedAt??0).padStart(13,'0')+':'+String(row.index).padStart(6,'0')+':'+createHash('sha256').update(JSON.stringify([moduleId,parsed.seed,parsed.startedAt,row.index])).digest('hex').slice(0,24);
      const previous=await supabase.from(table).select('session').eq('user_id',userId).eq('module_id',key).maybeSingle();
      if(previous.error){res.status(503).json({message:unavailable});return;}
      if(previous.data){if(JSON.stringify(previous.data.session.answer)!==JSON.stringify(row.answer)){res.status(409).json({message:'This question already has a different saved first response. Reload your account progress before continuing.'});return;}continue;}
      const saved:SavedPracticeEvidence={...row,moduleId,moduleTitle:parsed.moduleTitle??moduleId,seed:parsed.seed,startedAt:parsed.startedAt??0,generationVersion:parsed.generationVersion??1,sourceQuestionIds:parsed.generatorDefinitions?.find(generator=>generator.id===row.generatorId)?.sourceQuestionIds??[]};
      const recorded=await supabase.from(table).insert({user_id:userId,module_id:key,best:0,session:saved,revision:randomUUID()}).select('revision').maybeSingle();
      if(recorded.error&&recorded.error.code!=='23505'){res.status(503).json({message:unavailable});return;}
      if(recorded.error?.code==='23505'){
        const raced=await supabase.from(table).select('session').eq('user_id',userId).eq('module_id',key).maybeSingle();
        if(raced.error||!raced.data){res.status(503).json({message:unavailable});return;}
        if(JSON.stringify(raced.data.session.answer)!==JSON.stringify(row.answer)){res.status(409).json({message:'This question already has a different saved response. Reload your account progress.'});return;}
      }
    }
    parsed.evidenceThrough=Math.max(original?.evidenceThrough??-1,...parsed.responses.map(row=>row.index));
    parsed.responses=[];
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const read = await supabase.from(table).select(columns).eq('user_id', userId).eq('module_id', moduleId).maybeSingle();
    if (read.error) break;
    const current = read.data;
    const next = mergePracticeCheckpoint(current ?? { moduleId, best: 0, session: null }, incoming);
    if (current && current.best === next.best && current.session === next.session) { res.json(next); return; }
    const values = { best: next.best, session: next.session, revision: randomUUID() };
    const write = current
      ? await supabase.from(table).update(values).eq('user_id', userId).eq('module_id', moduleId).eq('revision', current.revision).select('revision').maybeSingle()
      : await supabase.from(table).insert({ user_id: userId, module_id: moduleId, ...values }).select('revision').maybeSingle();
    if (write.data && !write.error) { res.json(next); return; }
    if (write.error && write.error.code !== '23505') break;
  }
  res.status(503).json({ message: unavailable });
});
