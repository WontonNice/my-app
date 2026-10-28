import { Router, type ErrorRequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { emptyMealMenu, quoteMeal, validateMealMenu, type MealSession } from '../shared/classroomMeals';

export const classroomMealsRouter = Router();
const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const check = (error: unknown) => { if (error) throw fail('Classroom meals are unavailable. Retry, or ask your teacher to check the classroom meals database setup.', 503); };
const columns = 'id,title,menu,open,revision,created_at';
const uuid = /^[a-f0-9-]{36}$/i;
classroomMealsRouter.use(async (request, response, next) => {
  const { user, error } = await getAuthenticatedUser(request.headers.authorization);
  if (!user) { response.status(401).json({ message: error }); return; }
  const teacher = ['teacher', 'admin'].includes(getUserRole(user));
  if (!teacher && (getUserRole(user) !== 'student' || isStudentArchived(user) || !getEnrolledClassIds(user.app_metadata).includes('shsat'))) throw fail('Active student enrollment is required.', 403);
  if (request.path.startsWith('/teacher') && !teacher) throw fail('Teacher access is required.', 403);
  if (request.path.startsWith('/student') && teacher && request.method !== 'GET') throw fail('Use a student account to submit a meal selection.', 403);
  response.locals.user = user; response.locals.teacher = teacher; response.setHeader('Cache-Control', 'no-store'); next();
});
classroomMealsRouter.get('/student', async (_request, response) => {
  const found = await supabase.from('classroom_meal_sessions').select(columns).eq('class_id', 'shsat').order('created_at', { ascending: false }).limit(1);
  check(found.error); const session = found.data?.[0] ?? null;
  const order = session ? await supabase.from('classroom_meal_orders').select('*').eq('session_id', session.id).eq('student_id', response.locals.user.id).maybeSingle() : null;
  check(order?.error); response.json({ session, order: order?.data ?? null });
});
classroomMealsRouter.post('/student/orders', async (request, response) => {
  const { sessionId, menuRevision, orderRevision, selections, notes = '', cancel = false } = request.body ?? {};
  if (typeof sessionId !== 'string' || !uuid.test(sessionId) || !Number.isSafeInteger(menuRevision) || menuRevision < 1 || !Number.isSafeInteger(orderRevision) || orderRevision < 0 || typeof cancel !== 'boolean' || typeof notes !== 'string' || notes.length > 1000) throw fail('Reload the menu and enter a note under 1,000 characters.');
  const found = await supabase.from('classroom_meal_sessions').select(columns).eq('class_id', 'shsat').eq('id', sessionId).maybeSingle(); check(found.error);
  const session = found.data as MealSession | null;
  if (!session || !session.open || session.revision !== menuRevision) throw fail('The menu changed or ordering closed. Reload before submitting.', 409);
  const user = response.locals.user;
  const data = cancel ? {} : { quote: quoteMeal(session.menu, selections), notes: notes.trim(), menuRevision,
    studentName: String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student').slice(0, 150) };
  const saved = await supabase.rpc('save_classroom_meal_order', { p_session_id: sessionId, p_student_id: user.id, p_menu_revision: menuRevision, p_order_revision: orderRevision, p_data: data, p_cancel: cancel });
  if (saved.error?.code === 'P0001') throw fail(saved.error.message, 409);
  check(saved.error); response.json({ order: saved.data });
});
classroomMealsRouter.get('/teacher', async (request, response) => {
  const found = await supabase.from('classroom_meal_sessions').select(columns).eq('class_id', 'shsat').order('created_at', { ascending: false }).limit(50); check(found.error);
  const sessions = found.data ?? [], session = sessions.find(item => item.id === request.query.sessionId) ?? sessions[0] ?? null;
  const orders = session ? await supabase.from('classroom_meal_orders').select('*').eq('session_id', session.id).order('updated_at').limit(1000) : null; check(orders?.error);
  response.json({ sessions, session, orders: orders?.data ?? [] });
});
classroomMealsRouter.post('/teacher/sessions', async (request, response) => {
  const { id, title } = request.body ?? {};
  if (id !== undefined && (typeof id !== 'string' || !uuid.test(id))) throw fail('Invalid meal session ID.');
  if (typeof title !== 'string' || !title.trim() || title.length > 120) throw fail('Enter a title under 120 characters.');
  const saved = await supabase.from('classroom_meal_sessions').upsert({ id: id ?? randomUUID(), title: title.trim(), menu: emptyMealMenu(), open: false, created_by: response.locals.user.id }, { onConflict: 'id', ignoreDuplicates: true }).select(columns).maybeSingle();
  check(saved.error); response.status(201).json({ session: saved.data });
});
classroomMealsRouter.put('/teacher/sessions/:id', async (request, response) => {
  const { revision, title, open, menu: input } = request.body ?? {};
  if (!uuid.test(request.params.id) || !Number.isSafeInteger(revision) || revision < 1 || typeof title !== 'string' || !title.trim() || title.length > 120 || typeof open !== 'boolean') throw fail('Reload and enter valid meal session details.');
  const menu = validateMealMenu(input);
  if (open && (!menu.restaurant || !menu.items.some(item => item.available))) throw fail('Add a restaurant and at least one available menu item before opening orders.');
  const saved = await supabase.from('classroom_meal_sessions').update({ title: title.trim(), menu, open, revision: revision + 1, updated_at: new Date().toISOString() }).eq('id', request.params.id).eq('class_id', 'shsat').eq('revision', revision).select(columns).maybeSingle();
  check(saved.error); if (!saved.data) throw fail('This menu changed in another window. Reload before saving.', 409);
  response.json({ session: saved.data });
});
classroomMealsRouter.patch('/teacher/orders/:sessionId/:studentId', async (request, response) => {
  const { revision, status } = request.body ?? {};
  if (![request.params.sessionId, request.params.studentId].every(value => uuid.test(value)) || !Number.isSafeInteger(revision) || !['ordered', 'submitted'].includes(status)) throw fail('Choose a valid order and status.');
  const session = await supabase.from('classroom_meal_sessions').select('open').eq('id', request.params.sessionId).eq('class_id', 'shsat').maybeSingle(); check(session.error);
  if (!session.data) throw fail('Meal session not found.', 404);
  if (session.data.open) throw fail('Close ordering before marking meals as ordered. This keeps student edits from racing with checkout.', 409);
  const saved = await supabase.from('classroom_meal_orders').update({ status, revision: revision + 1, updated_at: new Date().toISOString() }).eq('session_id', request.params.sessionId).eq('student_id', request.params.studentId).eq('revision', revision).neq('status', 'cancelled').select('*').maybeSingle();
  check(saved.error); if (!saved.data) throw fail('This order changed. Reload before updating it.', 409);
  response.json({ order: saved.data });
});
classroomMealsRouter.use(((error, _request, response, _next) => response.status((error as { status?: number }).status ?? 500).json({ message: error.message || 'Could not load classroom meals.' })) as ErrorRequestHandler);
