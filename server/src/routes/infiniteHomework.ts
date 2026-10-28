import { Router, type ErrorRequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { assignmentDetail, updateAssignment } from '../lib/learningPlanStore';
import { publishedPracticeCatalog } from '../lib/infiniteHomeworkCatalog';
import { managedGeneratorIds } from '../shared/practiceCatalog';
import { activeStatuses, type PlanAssignment } from '../shared/learningPlan';
import { gradeHomework, homeworkQuestion, publicHomeworkQuestion, validHomeworkAnswer, type HomeworkState, type HomeworkView } from '../shared/infiniteHomework';

export const infiniteHomeworkRouter = Router();
const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const storage = (error: unknown) => { if (error) throw fail('Homework progress could not be saved. Please retry. The infinite homework migration must be installed.', 503); };
type SessionRow = { state: HomeworkState; revision: number };
async function readSession(studentId: string, id: string): Promise<SessionRow | null> {
  const result = await supabase.from('infinite_homework_sessions').select('state,revision').eq('student_id', studentId).eq('assignment_id', id).maybeSingle();
  storage(result.error); return result.data;
}
async function reconcile(task: PlanAssignment, state: HomeworkState) {
  if (activeStatuses.includes(task.status) && state.bestStreak >= task.streakTarget!) {
    return updateAssignment(task, { status: 'completed', completedAt: state.last!.at, completion: { source: 'practice', at: state.last!.at, reference: task.id, correct: state.correct, total: state.index } }, 'system', `Required streak of ${task.streakTarget} reached`);
  }
  return task;
}
function view(assignment: PlanAssignment, row: SessionRow): HomeworkView {
  const { state, revision } = row;
  const { events: _events, ...publicAssignment } = assignment;
  return { assignment: publicAssignment, revision, streak: state.streak, bestStreak: state.bestStreak, answered: state.index, correct: state.correct,
    question: assignment.status === 'completed' ? null : publicHomeworkQuestion(homeworkQuestion(state)), feedback: state.last ?? null };
}
infiniteHomeworkRouter.use(async (request, response, next) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  if (getUserRole(user) !== 'student' || isStudentArchived(user) || !getEnrolledClassIds(user.app_metadata).includes('shsat')) throw fail('Sign in with your enrolled student account.', 403);
  response.locals.studentId = user.id; response.setHeader('Cache-Control', 'no-store'); next();
});
infiniteHomeworkRouter.use('/:id', async (request, response, next) => {
  if (!/^[a-f0-9-]{36}$/i.test(request.params.id)) throw fail('Invalid assignment.', 404);
  const task = await assignmentDetail(response.locals.studentId, request.params.id);
  if (!task?.assignedAt || !task.streakTarget || !task.contentId?.startsWith('infinite-practice:') || ![...activeStatuses, 'completed'].includes(task.status)) throw fail('This homework is unavailable. Return to your assignments.', 404);
  response.locals.task = task; next();
});
infiniteHomeworkRouter.get('/:id', async (request, response) => {
  let task = response.locals.task as PlanAssignment;
  let row = await readSession(task.studentId, task.id);
  if (!row) {
    const catalog = await publishedPracticeCatalog(), module = catalog.modules.find(item => `infinite-practice:${item.id}` === task.contentId);
    if (!module) throw fail('This module is unavailable. Ask your teacher to publish it.', 409);
    const ids = managedGeneratorIds(module, catalog);
    if (!ids.length) throw fail('This module has no available questions.', 409);
    const state: HomeworkState = { seed: randomUUID(), generators: catalog.generators.filter(item => ids.includes(item.id)), index: 0, streak: 0, bestStreak: 0, correct: 0 };
    const created = await supabase.from('infinite_homework_sessions').upsert({ assignment_id: task.id, student_id: task.studentId, state, revision: 0 }, { onConflict: 'assignment_id', ignoreDuplicates: true });
    storage(created.error); row = await readSession(task.studentId, task.id);
    if (!row) throw fail('Could not start homework. Please retry.', 503);
  }
  task = await reconcile(task, row.state);
  response.json(view(task, row));
});
infiniteHomeworkRouter.post('/:id/answers', async (request, response) => {
  let task = response.locals.task as PlanAssignment;
  const row = await readSession(task.studentId, task.id);
  if (!row) throw fail('Open the homework before answering.', 409);
  const { revision, questionId, answer } = request.body ?? {};
  if (!Number.isSafeInteger(revision) || revision < 0 || !validHomeworkAnswer(answer)) throw fail('Enter an answer before checking.');
  // A retry of the same answer returns its durable feedback without advancing twice.
  if (row.state.last && row.state.last.revision === revision && row.state.last.question.id === questionId && JSON.stringify(row.state.last.answer) === JSON.stringify(answer)) {
    response.json(view(await reconcile(task, row.state), row)); return;
  }
  if (task.status === 'completed') throw fail('This homework is already complete.', 409);
  if (revision !== row.revision || questionId !== homeworkQuestion(row.state).id) throw fail('Your progress changed in another tab. Reload this homework to continue.', 409);
  const state = gradeHomework(row.state, revision, answer);
  const saved = await supabase.from('infinite_homework_sessions').update({ state, revision: revision + 1, updated_at: state.last!.at }).eq('assignment_id', task.id).eq('student_id', task.studentId).eq('revision', revision).select('revision').maybeSingle();
  storage(saved.error);
  if (!saved.data) throw fail('Your progress changed in another tab. Reload to continue.', 409);
  task = await reconcile(task, state);
  if (task.status === 'assigned') task = await updateAssignment(task, { status: 'in_progress' }, task.studentId, 'Started infinite homework');
  response.json(view(task, { state, revision: revision + 1 }));
});
infiniteHomeworkRouter.use(((error, _request, response, _next) => response.status((error as { status?: number }).status ?? 500).json({ message: error.message || 'Homework could not be loaded. Please retry.' })) as ErrorRequestHandler);
