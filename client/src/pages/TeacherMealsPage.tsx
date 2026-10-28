import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { emptyMealMenu, mealEstimate, mealMoney, mealRestaurants, type MealRestaurant, type MealOrder, type MealSession, type TeacherMeals } from '../../../server/src/shared/classroomMeals';
import { CorporateDashboardShell } from '../components/CorporateDashboardShell';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { createAuthHeaders, requestApi } from '../lib/api';
import { teacherNavItems } from '../lib/teacherNavigation';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { MealImageField } from '../components/MealImageField';
import { MealCustomizationEditor } from '../components/MealCustomizationEditor';
import { MealPhoto } from '../components/MealPhoto';
import '../styles/classroom-meals.css';

function firstMealDraft(): MealSession {
  return { id: crypto.randomUUID(), title: 'Classroom meals', open: false, revision: 1, created_at: new Date().toISOString(),
    menu: { ...emptyMealMenu(), restaurants: [{ id: crypto.randomUUID(), name: '', url: 'https://www.ubereats.com/feed?diningMode=DELIVERY', image: '', rating: null, reviewCount: null, items: [] }] } };
}

export function TeacherMealsPage() {
  const { accessToken, studentName } = useStudentPortalAccess(true);
  const [data, setData] = useState<TeacherMeals | null>(null);
  const [draft, setDraft] = useState<MealSession | null>(null);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [restaurantId, setRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const createId = useRef<string | null>(null);
  const call = <T,>(path: string, method = 'GET', body?: unknown) => requestApi<T>('/api/classroom-meals/teacher' + path, { method, headers: createAuthHeaders(accessToken), ...(body ? { body: JSON.stringify(body) } : {}) });
  const reload = useCallback(async () => {
    if (!accessToken) return;
    setBusy(true); setError('');
    try {
      const next = await requestApi<TeacherMeals>('/api/classroom-meals/teacher' + (selected ? `?sessionId=${encodeURIComponent(selected)}` : ''), { headers: createAuthHeaders(accessToken) });
      setData(next); setDraft(next.session ?? firstMealDraft());
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
    if (!draft || imageBusy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (!data?.sessions.some(session => session.id === draft.id)) {
        await call('/sessions', 'POST', { id: draft.id, title: draft.title });
      }
      const next = await call<{ session: MealSession }>(`/sessions/${draft.id}`, 'PUT', { ...draft, open });
      setDraft(next.session); setData(current => current && ({ ...current, session: next.session, sessions: current.sessions.some(session => session.id === next.session.id) ? current.sessions.map(session => session.id === next.session.id ? next.session : session) : [next.session, ...current.sessions] }));
      setMessage(open ? 'Menu saved. Students can send their requests.' : 'Menu saved. Ordering is closed.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save the menu.'); }
    finally { setBusy(false); }
  }
  async function mark(order: MealOrder, status: 'ordered' | 'submitted' | 'denied' | 'removed' | 'restore') {
    setBusy(true); setError(''); setMessage('');
    try {
      const next = await call<{ order: MealOrder }>(`/orders/${order.session_id}/${order.student_id}`, 'PATCH', { revision: order.revision, status });
      setData(current => current && ({ ...current, orders: current.orders.map(item => item.student_id === next.order.student_id ? next.order : item) }));
      setMessage(status === 'ordered' ? 'Request marked ordered. This student can no longer edit it.' : status === 'submitted' ? 'Ordered status undone.' : status === 'denied' ? 'Request denied. The student must ask you to restore it before sending again.' : status === 'removed' ? 'Request removed. You can restore it below.' : 'Request restored.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not update this request.'); }
    finally { setBusy(false); }
  }

  const orders = data?.orders.filter(order => order.status !== 'cancelled') ?? [];
  const inactiveOrders = data?.orders.filter(order => order.data.teacherDecision) ?? [];
  const totals = orders.some(order => order.data.quote.afterFeesTotalCents == null) ? null : orders.reduce((sum, order) => sum + (order.data.quote.afterFeesTotalCents ?? 0), 0);
  const restaurants = draft ? mealRestaurants(draft.menu) : [];
  const restaurant = restaurants.find(entry => entry.id === restaurantId) ?? restaurants[0];
  const disabled = busy || imageBusy;
  const dirty = JSON.stringify(draft) !== JSON.stringify(data?.session ?? null);
  const discard = () => !dirty || window.confirm('Discard your unsaved menu changes?');
  const setMenu = (changes: Partial<MealSession['menu']>) => setDraft(current => current && ({ ...current, menu: { ...current.menu, ...changes } }));
  const changeRestaurant = (changes: Partial<MealRestaurant>) => setDraft(current => current && ({ ...current, menu: { ...current.menu, items: [], restaurant: '', restaurants: mealRestaurants(current.menu).map(entry => entry.id === restaurant?.id ? { ...entry, ...changes } : entry) } }));
  function addRestaurant() {
    const id = crypto.randomUUID();
    setMenu({ restaurant: '', items: [], restaurants: [...restaurants, { id, name: '', url: 'https://www.ubereats.com/feed?diningMode=DELIVERY', image: '', rating: null, reviewCount: null, items: [] }] });
    setRestaurantId(id);
  }
  return <CorporateDashboardShell activeId="meals" profileName={studentName} profileRole="Teacher" navItems={teacherNavItems} onSignOut={() => void signOutCurrentAccount().then(() => window.location.assign('/'))}>
    <div className="meals-page teacher-meals"><header className="meals-heading"><div><h1>Classroom meals</h1><p>Your restaurants, your menu. Collect everyone’s choices in one place.</p></div><button type="button" disabled={disabled} onClick={() => { if (discard()) void reload(); }}><RefreshCw size={16} /> Refresh saved menu & requests</button></header>
      {error && <p role="alert" className="meals-notice">{error} Refresh to recover the latest saved version.</p>}{message && <p role="status" className="meals-notice">{message}</p>}
      <form className="meals-toolbar" onSubmit={event => { event.preventDefault(); if (discard()) void create(); }}><label>New meal session<input required maxLength={120} placeholder="Friday lunch" disabled={disabled} value={title} onChange={event => { setTitle(event.target.value); createId.current = null; }} /></label><button type="submit" disabled={disabled || !title.trim()}><Plus size={16} /> Create session</button></form>
      {data?.sessions.length ? <label className="meal-session-select">View session<select value={draft?.id ?? ''} disabled={disabled} onChange={event => { if (discard()) { setSelected(event.target.value); setMessage(''); setRestaurantId(''); } }}>{data.sessions.map(session => <option key={session.id} value={session.id}>{session.title} · {session.open ? 'Open' : 'Closed'}</option>)}</select></label> : data && <p className="meals-notice">Build your first restaurant below. Add its photo and details, then click Save menu. Open ordering when you’re ready for students.</p>}
      {draft && <><form className="meal-editor" onSubmit={event => { event.preventDefault(); void save(); }}><fieldset disabled={disabled}>
        <div className="meal-session-settings"><label>Session title<input required maxLength={120} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label><label>Estimated tax on extras (%)<input type="number" min="0" max="25" step="0.001" required value={draft.menu.taxBasisPoints / 100} onChange={event => setMenu({ taxBasisPoints: Number(event.target.value) * 100 })} /></label></div>
        <p className="meal-fineprint">Enter each item’s base estimate including taxes and fees below. This tax rate applies only to paid customization extras.</p>
        <div className="meals-toolbar"><h2>Restaurants ({restaurants.length})</h2><button type="button" disabled={restaurants.length >= 20} onClick={addRestaurant}><Plus size={16} /> Add restaurant</button></div>
        <div className="meal-restaurant-picker" aria-label="Choose restaurant to edit">{restaurants.map(entry => <button key={entry.id} type="button" className={entry.id === restaurant?.id ? 'selected' : ''} aria-pressed={entry.id === restaurant?.id} onClick={() => setRestaurantId(entry.id)}><MealPhoto image={entry.image} name={entry.name || 'New restaurant'} /><span><strong>{entry.name || 'New restaurant'}</strong><small>{entry.items.length} menu items</small></span></button>)}</div>
        {!restaurant && <div className="meals-empty"><h3>Build your restaurant gallery</h3><p>Add a restaurant, paste a cover photo, then fill its menu.</p></div>}
        {restaurant && <section className="meal-restaurant-editor" aria-label="Restaurant editor" key={restaurant.id}>
          <div className="meals-toolbar"><h2>{restaurant.name || 'New restaurant'}</h2><button type="button" onClick={() => { if (window.confirm('Remove this restaurant and its menu from the draft? Saved requests will stay unchanged.')) { setMenu({ restaurant: '', items: [], restaurants: restaurants.filter(entry => entry.id !== restaurant.id) }); setRestaurantId(''); } }}><Trash2 size={16} /> Remove restaurant</button></div>
          <div className="meal-restaurant-fields"><MealImageField label="Restaurant cover image" value={restaurant.image} onChange={image => changeRestaurant({ image })} onBusyChange={setImageBusy} /><div className="meal-fields">
            <label>Restaurant name<input required maxLength={120} value={restaurant.name} placeholder="Restaurant name" onChange={event => changeRestaurant({ name: event.target.value })} /></label>
            <label>Uber Eats link<input type="url" required value={restaurant.url} onChange={event => changeRestaurant({ url: event.target.value })} /></label>
            <label>Star rating<input type="number" min="0" max="5" step="0.1" placeholder="e.g. 4.7" value={restaurant.rating ?? ''} onChange={event => changeRestaurant({ rating: event.target.value === '' ? null : Number(event.target.value) })} /></label>
            <label>Review count<input type="number" min="0" max="10000000" step="1" placeholder="e.g. 320" value={restaurant.reviewCount ?? ''} onChange={event => changeRestaurant({ reviewCount: event.target.value === '' ? null : Number(event.target.value) })} /></label>
          </div></div>
          <div className="meals-toolbar"><h2>Menu items</h2><span>{restaurant.items.length} items</span></div>
          {restaurant.items.map((item, index) => { const change = (fields: Partial<typeof item>) => changeRestaurant({ items: restaurant.items.map(entry => entry.id === item.id ? { ...entry, ...fields } : entry) }); return <div className="meal-item-editor" key={item.id}>
            <MealImageField label={'Item ' + (index + 1) + ' image'} value={item.image ?? ''} onChange={image => change({ image })} onBusyChange={setImageBusy} />
            <div className="meal-item-fields"><label>Item name<input required maxLength={150} value={item.name} onChange={event => change({ name: event.target.value })} /></label><label>Price ($)<input required type="number" min="0" max="1000" step="0.01" value={item.priceCents / 100} onChange={event => change({ priceCents: Math.round(Number(event.target.value) * 100) })} /></label><label className="meal-description-field">Estimated total after taxes &amp; fees ($)<input type="number" min="0" max="10000" step="0.01" placeholder="N/A" value={item.estimatedTotalCents == null ? '' : item.estimatedTotalCents / 100} onChange={event => change({ estimatedTotalCents: event.target.value === '' ? null : Math.round(Number(event.target.value) * 100) })} /><small>Per item. Leave blank for N/A; entered manually, used as the base for the cart estimate after taxes and fees.</small></label><label className="meal-description-field">Description<input maxLength={1000} value={item.description} onChange={event => change({ description: event.target.value })} /></label><label className="meal-checkbox"><input type="checkbox" checked={item.available} onChange={event => change({ available: event.target.checked })} /> Available</label><label className="meal-checkbox"><input type="checkbox" checked={item.buyOneGetOne ?? false} onChange={event => change({ buyOneGetOne: event.target.checked })} /> Buy 1, get 1 free tag</label><small className="meal-description-field">Offer label only. Quantities and prices are unchanged.</small><MealCustomizationEditor groups={item.optionGroups ?? []} onChange={optionGroups => change({ optionGroups })} /></div>
            <button type="button" aria-label={'Remove ' + (item.name || 'item ' + (index + 1))} onClick={() => changeRestaurant({ items: restaurant.items.filter(entry => entry.id !== item.id) })}><Trash2 size={17} /></button>
          </div>; })}
          <button type="button" disabled={restaurants.reduce((sum, entry) => sum + entry.items.length, 0) >= 100} onClick={() => changeRestaurant({ items: [...restaurant.items, { id: crypto.randomUUID(), name: '', description: '', priceCents: 0, available: true, image: '', buyOneGetOne: false, estimatedTotalCents: null }] })}><Plus size={16} /> Add menu item</button>
        </section>}
        <div className="meal-actions meal-publish"><span role="status">{dirty ? 'Unsaved changes' : 'All changes saved'} · {data?.session?.open ? 'Ordering open' : 'Ordering closed'}</span><button className="meal-primary" type="submit">{busy ? 'Saving…' : 'Save menu'}</button><button type="button" onClick={event => { if (event.currentTarget.form?.reportValidity()) void save(!draft.open); }}>{draft.open ? 'Save & close ordering' : 'Save & open ordering'}</button></div>
      </fieldset></form>
      <section className="meal-requests"><div className="meals-toolbar"><h2>Student requests ({orders.length})</h2><strong>{totals == null ? 'N/A' : mealMoney(totals)} estimated combined total</strong></div><p>Mark ordered after placing a request on Uber Eats. Deny blocks further student submissions until restored. Remove hides the request; the student may send a fresh request while ordering is open.</p>{!orders.length && <p>No requests for this session yet.</p>}{orders.map(order => <article className="meal-order" key={order.student_id}><div className="meals-toolbar"><h3>{order.data.studentName}</h3><strong>{mealEstimate(order.data.quote)} estimated</strong></div><ul>{order.data.quote.items.map(item => <li key={item.id}>{item.quantity} × {item.name} — {mealMoney(item.totalCents)}{item.restaurant && <span> · {item.restaurant}</span>}<small className="meal-fineprint"> · After taxes &amp; fees per item: {item.estimatedTotalCents == null ? 'N/A' : mealMoney(item.estimatedTotalCents)}</small>{item.customizations?.map((choice, index) => <small className="meal-fineprint" key={index}> · {choice.group}: {choice.option} ({choice.extraCents ? '+' + mealMoney(choice.extraCents) : 'Included'})</small>)}{item.buyOneGetOne && <span className="meal-offer">Buy 1, get 1 free</span>}</li>)}</ul>{order.data.notes && <p><strong>Note:</strong> {order.data.notes}</p>}<p className="meal-fineprint">Menu subtotal with extras {mealMoney(order.data.quote.subtotalCents)} · Estimate after taxes &amp; fees {mealEstimate(order.data.quote)} · Updated {new Date(order.updated_at).toLocaleString()}</p><div className="meal-actions"><button type="button" disabled={disabled} onClick={() => void mark(order, order.status === 'ordered' ? 'submitted' : 'ordered')}>{order.status === 'ordered' ? 'Ordered · Undo' : 'Mark ordered on Uber Eats'}</button>{order.status === 'submitted' && <button type="button" disabled={disabled} onClick={() => void mark(order, 'denied')}>Deny request</button>}<button type="button" disabled={disabled} onClick={() => void mark(order, 'removed')}>Remove request</button></div></article>)}</section><details className="meal-requests"><summary>Denied / removed requests ({inactiveOrders.length})</summary>{!inactiveOrders.length && <p>No denied or removed requests.</p>}{inactiveOrders.map(order => <article className="meal-order" key={order.student_id}><h3>{order.data.studentName}</h3><p>{order.data.teacherDecision === 'denied' ? 'Denied — student submissions blocked' : 'Removed from active requests'}</p><p>{order.data.quote.items.map(item => item.quantity + ' × ' + item.name).join(' · ')}</p><button type="button" disabled={disabled} onClick={() => void mark(order, 'restore')}>Restore request</button></article>)}</details></>}
    </div>
  </CorporateDashboardShell>;
}
