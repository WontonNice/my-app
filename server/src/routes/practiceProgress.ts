import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { mergePracticeCheckpoint, parsePracticeState, type PracticeCheckpoint } from '../shared/practiceCheckpoint';

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
    .eq('user_id', res.locals.user.id).order('module_id').range(page * 50, page * 50 + 49);
  if (error) { res.status(503).json({ message: unavailable }); return; }
  res.json(data);
});

practiceProgressRouter.put('/', async (req, res) => {
  const { moduleId, best, session } = req.body ?? {};
  const parsed = session && parsePracticeState(JSON.stringify(session));
  if (typeof moduleId !== 'string' || !moduleId.trim() || moduleId.length > 250 ||
      !Number.isSafeInteger(best) || best < 0 || (session !== null && (!parsed || parsed.moduleId !== moduleId))) {
    res.status(400).json({ message: 'Invalid practice checkpoint.' });
    return;
  }
  const incoming: PracticeCheckpoint = { moduleId, best, session: parsed };
  const userId = res.locals.user.id;
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
