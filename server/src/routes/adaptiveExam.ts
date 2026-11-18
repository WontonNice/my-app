import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { adaptiveSummary, compareAdaptiveStates, parseAdaptiveState, type AdaptiveState } from '../shared/adaptiveMath/engine';
import { adaptiveTopics } from '../shared/adaptiveMath/topics';

// Account copy of a student's adaptive math exam. Mounted after SHSAT authentication.
// It shares the practice checkpoint table under a reserved module ID, so no new table is needed.
export const adaptiveExamRouter = Router();
export const adaptiveExamModuleId = '__adaptive__:math-v1';
const table = 'math_practice_checkpoints';
const unavailable = 'Account storage for the adaptive exam is unavailable. Your browser copy is kept.';

async function read(userId: string) {
  const { data, error } = await supabase.from(table).select('session,revision').eq('user_id', userId).eq('module_id', adaptiveExamModuleId).maybeSingle();
  return { error, revision: data?.revision as string | undefined, state: data ? parseAdaptiveState(data.session) : null };
}

adaptiveExamRouter.get('/', async (request, response) => {
  const requested = typeof request.query.studentId === 'string' && request.query.studentId ? request.query.studentId : response.locals.user.id;
  if (requested !== response.locals.user.id && !response.locals.teacher) { response.status(403).json({ message: 'You can only view your own adaptive exam.' }); return; }
  if (!/^[0-9a-fA-F-]{36}$/.test(requested)) { response.status(400).json({ message: 'Invalid student.' }); return; }
  const saved = await read(requested);
  if (saved.error) { response.status(503).json({ message: unavailable }); return; }
  response.json({ state: saved.state, summary: saved.state ? adaptiveSummary(saved.state) : null });
});

// Class view for teachers: topics mastered by every student who has started the exam, read in one query.
// The `best` column is rewritten with the current mastered count on every save, so no exam needs to be opened here.
adaptiveExamRouter.get('/roster', async (_request, response) => {
  if (!response.locals.teacher) { response.status(403).json({ message: 'Teacher access is required.' }); return; }
  const { data, error } = await supabase.from(table).select('user_id,best').eq('module_id', adaptiveExamModuleId);
  if (error) { response.status(503).json({ message: 'Adaptive exam results are unavailable right now.' }); return; }
  const students: Record<string, number> = {};
  for (const row of data ?? []) students[String(row.user_id)] = Number(row.best) || 0;
  response.json({ total: adaptiveTopics.length, students });
});

adaptiveExamRouter.put('/', async (request, response) => {
  // A browser may refresh its access token under another account while a save is pending.
  if (request.get('X-Practice-Owner') !== response.locals.user.id) { response.status(403).json({ message: 'The signed-in account changed.' }); return; }
  const incoming = parseAdaptiveState(request.body?.state);
  if (!incoming) { response.status(400).json({ message: 'Invalid adaptive exam progress.' }); return; }
  const userId = response.locals.user.id;
  for (let attempt = 0; attempt < 4; attempt++) {
    const saved = await read(userId);
    if (saved.error) break;
    // A delayed save can never rewind a copy with more answers, and a restarted exam replaces the old one.
    // An identical copy is not written again; only a changed exam/practice mode counts as a change on its own.
    const order = compareAdaptiveStates(incoming, saved.state);
    const next: AdaptiveState = !saved.state || order > 0 || order === 0 && incoming.mode !== saved.state.mode ? incoming : saved.state;
    if (next === saved.state) { response.json({ state: next }); return; }
    const values = { best: adaptiveSummary(next).mastered, session: next, revision: randomUUID() };
    const write = saved.revision
      ? await supabase.from(table).update(values).eq('user_id', userId).eq('module_id', adaptiveExamModuleId).eq('revision', saved.revision).select('revision').maybeSingle()
      : await supabase.from(table).insert({ user_id: userId, module_id: adaptiveExamModuleId, ...values }).select('revision').maybeSingle();
    if (write.data && !write.error) { response.json({ state: next }); return; }
    if (write.error && write.error.code !== '23505') break;
  }
  response.status(503).json({ message: unavailable });
});
