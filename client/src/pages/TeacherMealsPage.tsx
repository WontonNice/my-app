import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { mealMoney, type MealOrder, type MealSession, type TeacherMeals } from '../../../server/src/shared/classroomMeals';
import { CorporateDashboardShell } from '../components/CorporateDashboardShell';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { createAuthHeaders, requestApi } from '../lib/api';
import { teacherNavItems } from '../lib/teacherNavigation';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import '../styles/classroom-meals.css';

export function TeacherMealsPage() {
  const { accessToken, studentName } = useStudentPortalAccess(true);
  const [data, setData] = useState<TeacherMeals | null>(null);
  const [draft, setDraft] = useState<MealSession | null>(null);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const createId = useRef<string | null>(null);
  const call = <T,>(path: string, method = 'GET', body?: unknown) => requestApi<T>('/api/classroom-meals/teacher' + path, { method, headers: createAuthHeaders(accessToken), ...(body ? { body: JSON.stringify(body) } : {}) });
  const reload = useCallback(async () => {
    if (!accessToken) return;
    setBusy(true); setError('');
    try {
      const next = await requestApi<TeacherMeals>('/api/classroom-meals/teacher' + (selected ? `?sessionId=${encodeURIComponent(selected)}` : ''), { headers: createAuthHeaders(accessToken) });
      setData(next); setDraft(next.session);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load classroom meals.'); }
    finally { setBusy(false); }
  }, [accessToken, selected]);
  useEffect(() => {
    // Reload starts an external request; its busy state also serves explicit refreshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);
  async function create() {
    setBusy(true); setError(''); setMessage('');
    try {
      createId.current ??= crypto.randomUUID();
      await call('/sessions', 'POST', { id: createId.current, title });
      const createdId = createId.current; createId.current = null; setTitle(''); if (selected === createdId) await reload(); else setSelected(createdId);
      setMessage('Meal session created. Add the menu, then open ordering.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create a session.'); }
    finally { setBusy(false); }
  }
  async function save(open = draft?.open ?? false) {
    if (!draft) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const next = await call<{ session: MealSession }>(`/sessions/${draft.id}`, 'PUT', { ...draft, open });
      setDraft(next.session); setData(current => current && ({ ...current, session: next.session, sessions: current.sessions.map(session => session.id === next.session.id ? next.session : session) }));
      setMessage(open ? 'Menu saved. Students can send their requests.' : 'Menu saved. Ordering is closed.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save the menu.'); }
    finally { setBusy(false); }
  }
  async function mark(order: MealOrder) {
    setBusy(true); setError('');
    try {
      const next = await call<{ order: MealOrder }>(`/orders/${order.session_id}/${order.student_id}`, 'PATCH', { revision: order.revision, status: order.status === 'ordered' ? 'submitted' : 'ordered' });
      setData(current => current && ({ ...current, orders: current.orders.map(item => item.student_id === next.order.student_id ? next.order : item) }));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not update this request.'); }
    finally { setBusy(false); }
  }
  const orders = data?.orders.filter(order => order.status !== 'cancelled') ?? [];
  const totals = orders.reduce((sum, order) => sum + order.data.quote.totalCents, 0);
  const setMenu = (changes: Partial<MealSession['menu']>) => setDraft(current => current && ({ ...current, menu: { ...current.menu, ...changes } }));
  return <CorporateDashboardShell activeId="meals" profileName={studentName} profileRole="Teacher" navItems={teacherNavItems} onSignOut={() => void signOutCurrentAccount().then(() => window.location.assign('/'))}>
    <div className="meals-page teacher-meals"><header className="meals-heading"><div><h1>Classroom meals</h1><p>Publish a menu, collect everyone’s choices, then place the order on Uber Eats.</p></div><button type="button" disabled={busy} onClick={() => void reload()}><RefreshCw size={16} /> Refresh saved menu & requests</button></header>
      <p className="meals-notice">Enter menu prices from Uber Eats and your estimated tax and fees. Students see these as estimates.</p>
      {error && <p role="alert" className="meals-notice">{error} Refresh to recover the latest saved version.</p>}{message && <p role="status" className="meals-notice">{message}</p>}
      <form className="meals-toolbar" onSubmit={event => { event.preventDefault(); void create(); }}><label>New meal session<input required maxLength={120} placeholder="Wednesday lunch" value={title} onChange={event => { setTitle(event.target.value); createId.current = null; }} /></label><button type="submit" disabled={busy || !title.trim()}><Plus size={16} /> Create session</button></form>
      {data?.sessions.length ? <label className="meal-session-select">View session<select value={draft?.id ?? ''} disabled={busy} onChange={event => { setSelected(event.target.value); setMessage(''); }}>{data.sessions.map(session => <option key={session.id} value={session.id}>{session.title} · {session.open ? 'Open' : 'Closed'}</option>)}</select></label> : !busy && <p>No meal sessions yet. Create one to get started.</p>}
      {draft && <><form className="meal-editor" onSubmit={event => { event.preventDefault(); void save(); }}><div className="meals-toolbar"><h2>Menu & pricing</h2><strong>{data?.session?.open ? 'Ordering open' : 'Ordering closed'}</strong></div><fieldset disabled={busy}><div className="meal-fields"><label>Session title<input required maxLength={120} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label><label>Restaurant<input maxLength={120} value={draft.menu.restaurant} onChange={event => setMenu({ restaurant: event.target.value })} /></label><label>Uber Eats restaurant link<input type="url" required value={draft.menu.restaurantUrl} onChange={event => setMenu({ restaurantUrl: event.target.value })} /></label><label>Estimated tax (%)<input type="number" min="0" max="25" step="0.001" required value={draft.menu.taxBasisPoints / 100} onChange={event => setMenu({ taxBasisPoints: Number(event.target.value) * 100 })} /></label><label>Estimated fees per student ($)<input type="number" min="0" max="100" step="0.01" required value={draft.menu.feeCents / 100} onChange={event => setMenu({ feeCents: Math.round(Number(event.target.value) * 100) })} /></label></div>
        <p className="meal-fineprint">Divide shared delivery and service fees across students. Tax is calculated on the food subtotal. Saved requests keep the prices shown when submitted.</p>
        {draft.menu.items.map((item, index) => { const change = (fields: Partial<typeof item>) => setMenu({ items: draft.menu.items.map(entry => entry.id === item.id ? { ...entry, ...fields } : entry) }); return <div className="meal-item-editor" key={item.id}><label>Item {index + 1}<input required maxLength={150} value={item.name} onChange={event => change({ name: event.target.value })} /></label><label>Price ($)<input required type="number" min="0" max="1000" step="0.01" value={item.priceCents / 100} onChange={event => change({ priceCents: Math.round(Number(event.target.value) * 100) })} /></label><label>Description<input maxLength={1000} value={item.description} onChange={event => change({ description: event.target.value })} /></label><label className="meal-checkbox"><input type="checkbox" checked={item.available} onChange={event => change({ available: event.target.checked })} /> Available</label><button type="button" aria-label={`Remove ${item.name || `item ${index + 1}`}`} onClick={() => setMenu({ items: draft.menu.items.filter(entry => entry.id !== item.id) })}><Trash2 size={17} /></button></div>; })}
        <button type="button" disabled={draft.menu.items.length >= 100} onClick={() => setMenu({ items: [...draft.menu.items, { id: crypto.randomUUID(), name: '', description: '', priceCents: 0, available: true }] })}><Plus size={16} /> Add menu item</button>
        <div className="meal-actions"><button className="meal-primary" type="submit">Save menu</button><button type="button" onClick={() => void save(!draft.open)}>{draft.open ? 'Save & close ordering' : 'Save & open ordering'}</button><a href={draft.menu.restaurantUrl} target="_blank" rel="noreferrer">Open Uber Eats</a></div>
      </fieldset></form>
      <section className="meal-requests"><div className="meals-toolbar"><h2>Student requests ({orders.length})</h2><strong>{mealMoney(totals)} estimated combined total</strong></div><p>Close ordering before you place the order on your phone. Refresh to collect the latest requests.</p>{!orders.length && <p>No requests for this session yet.</p>}{orders.map(order => <article className="meal-order" key={order.student_id}><div className="meals-toolbar"><h3>{order.data.studentName}</h3><strong>{mealMoney(order.data.quote.totalCents)} estimated</strong></div><ul>{order.data.quote.items.map(item => <li key={item.id}>{item.quantity} × {item.name} — {mealMoney(item.totalCents)}</li>)}</ul>{order.data.notes && <p><strong>Note:</strong> {order.data.notes}</p>}<p className="meal-fineprint">Food {mealMoney(order.data.quote.subtotalCents)} · Tax {mealMoney(order.data.quote.taxCents)} · Fees {mealMoney(order.data.quote.feeCents)} · Updated {new Date(order.updated_at).toLocaleString()}</p><button type="button" disabled={busy || data?.session?.open} onClick={() => void mark(order)}>{order.status === 'ordered' ? 'Ordered · Undo' : 'Mark ordered on Uber Eats'}</button></article>)}</section></>}
    </div>
  </CorporateDashboardShell>;
}

