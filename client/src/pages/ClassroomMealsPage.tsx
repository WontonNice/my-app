import { useCallback, useEffect, useState } from 'react';
import { Minus, Plus, RefreshCw, Utensils } from 'lucide-react';
import { mealMoney, quoteMeal, type StudentMeals } from '../../../server/src/shared/classroomMeals';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { AppLink } from '../components/AppLink';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { createAuthHeaders, requestApi } from '../lib/api';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import '../styles/classroom-meals.css';

export function ClassroomMealsPage() {
  const { accessToken, previewContext, studentName, isCheckingSession } = useStudentPortalAccess();
  const [data, setData] = useState<StudentMeals | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const reload = useCallback(async () => {
    if (!accessToken) return;
    setBusy(true); setError('');
    try {
      const next = await requestApi<StudentMeals>('/api/classroom-meals/student', { headers: createAuthHeaders(accessToken) });
      setData(next);
      setQuantities(Object.fromEntries((next.order?.status !== 'cancelled' ? next.order?.data.quote.items : [])?.map(item => [item.id, item.quantity]) ?? []));
      setNotes(next.order?.data.notes ?? '');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load the menu.'); }
    finally { setBusy(false); }
  }, [accessToken]);
  useEffect(() => {
    // Reload starts an external request; its busy state also serves explicit refreshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);
  const session = data?.session;
  const selections = Object.entries(quantities).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({ id, quantity }));
  let quote = null;
  try { if (session && selections.length) quote = quoteMeal(session.menu, selections); } catch { /* A saved selection may have been removed from the menu. */ }
  const locked = !session?.open || data?.order?.status === 'ordered' || previewContext.isPreview;
  async function submit(cancel = false) {
    if (!session || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const saved = await requestApi<Pick<StudentMeals, 'order'>>('/api/classroom-meals/student/orders', {
        method: 'POST', headers: createAuthHeaders(accessToken), body: JSON.stringify({ sessionId: session.id, menuRevision: session.revision, orderRevision: data?.order?.revision ?? 0, selections, notes, cancel }),
      });
      setData({ session, order: saved.order });
      setMessage(cancel ? 'Your meal request was cancelled.' : 'Your teacher has your meal request. You can update it while ordering is open.');
      if (cancel) setQuantities({});
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Your request was not saved. Try again.'); }
    finally { setBusy(false); }
  }
  return <StudentPortalShell activeId="home" previewContext={previewContext} studentName={studentName} onSignOut={() => void signOutCurrentAccount().then(() => window.location.assign('/'))}>
    <div className="meals-page">
      <AppLink href="/study-hall/shsat">Back to overview</AppLink>
      <header className="meals-heading"><div><h1>Lunch with Wonton</h1><p>Choose your meal. Your teacher takes care of ordering.</p></div><img src="/images/wontonrobot.png" alt="Wonton, your classroom companion" width="84" height="84" /></header>
      <div className="meals-toolbar"><h2>{session?.title ?? 'Classroom meals'}</h2><button type="button" disabled={busy} onClick={() => void reload()}><RefreshCw size={16} /> Refresh menu</button></div>
      {error && <p className="meals-notice" role="alert">{error} Refresh the menu to load the latest saved request.</p>}
      {message && <p className="meals-notice" role="status">{message}</p>}
      {(isCheckingSession || (!data && busy)) && <p role="status">Loading today’s menu…</p>}
      {data && !session && <div className="meals-empty"><Utensils size={32} /><h2>No meal session yet</h2><p>Your teacher will open a menu when it’s time to order.</p></div>}
      {session && <>
        <p className="meals-notice">{data?.order?.status === 'ordered' ? 'Your teacher marked this meal as ordered.' : session.open ? 'Ordering is open.' : 'Ordering is closed.'} {previewContext.isPreview && 'Student preview cannot submit requests.'}</p>
        {data?.order && data.order.status !== 'cancelled' && <section className="meal-saved" aria-label="Saved meal request"><h3>Your saved request</h3><p>{data.order.data.quote.items.map(item => `${item.quantity} × ${item.name}`).join(' · ')}</p><p>{mealMoney(data.order.data.quote.totalCents)} estimated · {data.order.status === 'ordered' ? 'Ordered by teacher' : 'Sent to teacher'}</p>{data.order.data.notes && <p>{data.order.data.notes}</p>}</section>}
        <div className="meals-layout"><section className="meals-menu" aria-label="Meal menu"><h2>{session.menu.restaurant || 'Menu coming soon'}</h2><a href={session.menu.restaurantUrl} target="_blank" rel="noreferrer">View restaurant on Uber Eats</a>
          {session.menu.items.filter(item => item.available).map(item => <article className="meal-menu-item" key={item.id}><div><h3>{item.name}</h3>{item.description && <p>{item.description}</p>}<strong>{mealMoney(item.priceCents)}</strong></div><div className="meal-quantity"><button type="button" aria-label={`Remove one ${item.name}`} disabled={locked || busy || !quantities[item.id]} onClick={() => setQuantities(current => ({ ...current, [item.id]: Math.max(0, (current[item.id] ?? 0) - 1) }))}><Minus size={16} /></button><output aria-label={`${item.name} quantity`}>{quantities[item.id] ?? 0}</output><button type="button" aria-label={`Add one ${item.name}`} disabled={locked || busy || quantities[item.id] >= 10} onClick={() => setQuantities(current => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }))}><Plus size={16} /></button></div></article>)}
          {!session.menu.items.some(item => item.available) && <p>No items are available yet.</p>}
        </section><aside className="meal-summary"><h2>Your selection</h2>{quote ? <><ul>{quote.items.map(item => <li key={item.id}><span>{item.quantity} × {item.name}</span><strong>{mealMoney(item.totalCents)}</strong></li>)}</ul><dl><div><dt>Subtotal</dt><dd>{mealMoney(quote.subtotalCents)}</dd></div><div><dt>Estimated tax ({session.menu.taxBasisPoints / 100}%)</dt><dd>{mealMoney(quote.taxCents)}</dd></div><div><dt>Estimated fees</dt><dd>{mealMoney(quote.feeCents)}</dd></div><div className="meal-total"><dt>Estimated total</dt><dd>{mealMoney(quote.totalCents)}</dd></div></dl></> : <p>{selections.length ? 'The menu changed. Clear your selection and choose available items.' : 'Add something from the menu to get started.'}</p>}
          <p className="meal-fineprint">Prices, tax, and fees are set by your teacher. The final Uber Eats checkout total may differ. Submitting sends a request to your teacher.</p>
          <label>Notes for your teacher<textarea maxLength={1000} value={notes} disabled={locked || busy} onChange={event => setNotes(event.target.value)} placeholder="Changes, preferences, or dietary needs" /></label>
          <button className="meal-primary" type="button" disabled={locked || busy || !quote} onClick={() => void submit()}>{busy ? 'Saving…' : data?.order && data.order.status !== 'cancelled' ? 'Update meal request' : 'Send to teacher'}</button>
          <button type="button" disabled={locked || busy || !selections.length} onClick={() => setQuantities({})}>Clear selection</button>
          {data?.order?.status === 'submitted' && <button type="button" disabled={locked || busy} onClick={() => void submit(true)}>Cancel saved request</button>}
        </aside></div>
      </>}
    </div>
  </StudentPortalShell>;
}
