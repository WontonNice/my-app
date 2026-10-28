import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, RefreshCw, Search, Star, Utensils } from 'lucide-react';
import { mealEstimate, mealMoney, mealRestaurants, quoteMeal, type MealItem, type StudentMeals } from '../../../server/src/shared/classroomMeals';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { AppLink } from '../components/AppLink';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { createAuthHeaders, requestApi } from '../lib/api';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { MealCustomizationDialog } from '../components/MealCustomizationDialog';
import { MealPhoto } from '../components/MealPhoto';
import { MealRequestStatus } from '../components/MealRequestStatus';
import { MealOrderHistory } from '../components/MealOrderHistory';
import { WontonSprite } from '../components/WontonSprite';
import '../styles/classroom-meals.css';

export function ClassroomMealsPage() {
  const { accessToken, previewContext, studentName, isCheckingSession } = useStudentPortalAccess();
  const [data, setData] = useState<StudentMeals | null>(null);
  const [newRequestRevision, setNewRequestRevision] = useState<number | null>(null);
  const startingAnother = data?.order?.status === 'ordered' && newRequestRevision === data.order.revision;
  const requestLocked = (data?.order?.status === 'ordered' && !startingAnother) || data?.order?.data.teacherDecision === 'denied';
  const [draftQuantities, setQuantities] = useState<Record<string, number>>({});
  const quantities = requestLocked && data?.order
    ? Object.fromEntries(data.order.data.quote.items.map(item => [item.id, item.quantity])) : draftQuantities;
  const [choices, setChoices] = useState<Record<string, Record<string, string[]>>>({});
  const [customizing, setCustomizing] = useState<{ item: MealItem; add: boolean } | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [search, setSearch] = useState('');
  const sessionId = data?.session?.id;
  const heading = useRef<HTMLHeadingElement>(null);
  const reload = useCallback(async () => {
    if (!accessToken) return;
    setBusy(true); setError('');
    try {
      const next = await requestApi<StudentMeals>('/api/classroom-meals/student', { headers: createAuthHeaders(accessToken) });
      setData(next);
      setNewRequestRevision(null);
      setQuantities(Object.fromEntries((next.order?.status === 'submitted' ? next.order.data.quote.items : [])?.map(item => [item.id, item.quantity]) ?? []));
      setNotes(next.order?.data.notes ?? '');
      setChoices(Object.fromEntries((next.order?.status !== 'cancelled' ? next.order?.data.quote.items : [])?.map(item => [item.id, item.choices ?? {}]) ?? []));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load the menu.'); }
    finally { setBusy(false); }
  }, [accessToken]);
  useEffect(() => {
    // Reload starts an external request; its busy state also serves explicit refreshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);
  useEffect(() => {
    if (!accessToken || !sessionId || busy) return;
    let active = true;
    let refreshing = false;
    const refreshStatus = async () => {
      if (refreshing || document.visibilityState === 'hidden') return;
      refreshing = true;
      try {
        const next = await requestApi<StudentMeals>('/api/classroom-meals/student', { headers: createAuthHeaders(accessToken) });
        if (active && next.session?.id === sessionId) {
          if (!next.session.open || (next.order?.status === 'ordered' && next.order.revision !== newRequestRevision) || next.order?.data.teacherDecision === 'denied') setCustomizing(null);
          setData(current => {
            if (!current || (next.order?.revision ?? 0) < (current.order?.revision ?? 0)) return current;
            return next.order?.revision !== current.order?.revision || next.session?.revision !== current.session?.revision || next.orderedHistory?.length !== current.orderedHistory?.length ? next : current;
          });
        }
      } catch { /* Keep the saved status and unsent selection; manual refresh can show connection errors. */ }
      finally { refreshing = false; }
    };
    const interval = window.setInterval(() => void refreshStatus(), 15_000);
    const onVisible = () => { if (document.visibilityState === 'visible') void refreshStatus(); };
    const onFocus = () => void refreshStatus();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', onFocus); };
  }, [accessToken, busy, sessionId, newRequestRevision]);
  const session = data?.session;
  const selections = Object.entries(quantities).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({ id, quantity, choices: choices[id] ?? {} }));
  let quote = null;
  try { if (session && selections.length) quote = quoteMeal(session.menu, selections); } catch { /* A saved selection may have been removed from the menu. */ }
  // Show the request the teacher acted on, even if an unsent edit was open.
  if (requestLocked && data?.order) quote = data.order.data.quote;
  const locked = !session?.open || requestLocked || previewContext.isPreview;
  async function submit(cancel = false) {
    if (!session || busy) return;
    setBusy(true); setError('');
    try {
      const saved = await requestApi<Pick<StudentMeals, 'order' | 'orderedHistory'>>('/api/classroom-meals/student/orders', {
        method: 'POST', headers: createAuthHeaders(accessToken), body: JSON.stringify({ sessionId: session.id, menuRevision: session.revision, orderRevision: data?.order?.revision ?? 0, selections, notes, cancel, newRequest: startingAnother }),
      });
      setData({ session, order: saved.order, orderedHistory: saved.orderedHistory ?? data?.orderedHistory ?? [] });
      setNewRequestRevision(null);
      if (cancel) setQuantities({});
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Your request was not saved. Try again.'); }
    finally { setBusy(false); }
  }

  function startAnotherRequest() {
    if (!session?.open || data?.order?.status !== 'ordered' || busy || previewContext.isPreview) return;
    setNewRequestRevision(data.order.revision);
    setQuantities({}); setChoices({}); setNotes(''); setCustomizing(null); setError('');
  }

  const restaurants = session ? mealRestaurants(session.menu) : [];
  const restaurant = restaurants.find(entry => entry.id === restaurantId);
  const showRestaurant = (id: string) => { setRestaurantId(id); setSearch(''); requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }); };
  const matching = restaurants.filter(entry => entry.name.toLowerCase().includes(search.toLowerCase()));
  const items = restaurant?.items.filter(item => item.available && (item.name + ' ' + item.description).toLowerCase().includes(search.toLowerCase())) ?? [];
  const changeQuantity = (id: string, amount: number) => setQuantities(current => ({ ...current, [id]: Math.max(0, Math.min(10, (current[id] ?? 0) + amount)) }));
  return <StudentPortalShell activeId="home" previewContext={previewContext} studentName={studentName} onSignOut={() => void signOutCurrentAccount().then(() => window.location.assign('/'))}>
    <div className="meals-page meal-storefront">
      <AppLink href="/study-hall/shsat">Back to overview</AppLink>
      <header className="meals-heading"><div><h1>Lunch with Wonton</h1><p>A little break. Something delicious.</p></div><WontonSprite mood="idle" /></header>
      {error && <p className="meals-notice" role="alert">{error} Refresh the menu to load the latest saved request.</p>}
      {(isCheckingSession || (!data && busy)) && <p role="status">Loading today’s menu…</p>}
      {data && !session && <div className="meals-empty"><Utensils size={32} /><h2>No meal session yet</h2><p>Your teacher will open a menu when it’s time to order.</p></div>}
      {session && <>
        <div className="meal-store-status"><span><strong>{session.title}</strong> · {session.open ? 'Ordering open' : 'Ordering closed'}</span><button type="button" disabled={busy} onClick={() => void reload()}><RefreshCw size={16} />Refresh</button></div>
        {data?.order && <MealRequestStatus order={data.order} orderingOpen={session.open} startingAnother={startingAnother} onStartAnother={busy || previewContext.isPreview ? undefined : startAnotherRequest} onCancelAnother={() => { setNewRequestRevision(null); setCustomizing(null); }} />}
        <MealOrderHistory orders={data?.orderedHistory ?? []} />
        {previewContext.isPreview && <p className="meals-notice">Student preview cannot submit requests.</p>}
        <div className="meals-layout"><section className="meals-menu" aria-label="Meal menu">
          {restaurant ? <>
            <button type="button" className="meal-back" onClick={() => showRestaurant('')}><ArrowLeft size={17} />All restaurants</button>
            <div className="meal-restaurant-hero"><MealPhoto image={restaurant.image} name={restaurant.name} /></div>
            <div className="meal-restaurant-title"><h2 ref={heading} tabIndex={-1}>{restaurant.name}</h2><p className="meal-rating">{restaurant.rating !== null && <><strong>{restaurant.rating.toFixed(1)}</strong><Star size={14} fill="currentColor" /></>}{restaurant.reviewCount !== null && <span>({restaurant.reviewCount.toLocaleString()} reviews)</span>}</p><a href={restaurant.url} target="_blank" rel="noreferrer">View on Uber Eats</a></div>
          </> : <h2 ref={heading} tabIndex={-1}>Choose a restaurant</h2>}
          <label className="meal-search"><Search size={19} /><span className="meal-sr-only">{restaurant ? 'Search menu items' : 'Search restaurants'}</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={restaurant ? 'Search this menu' : 'What sounds good?'} /></label>
          {!restaurant ? <div className="meal-restaurants">{matching.map(entry => <button className="meal-restaurant-card" type="button" key={entry.id} onClick={() => showRestaurant(entry.id)}><div className="meal-cover"><MealPhoto image={entry.image} name={entry.name} />{entry.items.some(item => item.available && item.buyOneGetOne) && <span className="meal-offer">Buy 1, get 1 free</span>}</div><div className="meal-card-info"><h3>{entry.name}</h3><span className="meal-rating">{entry.rating !== null && <><strong>{entry.rating.toFixed(1)}</strong><Star size={13} fill="currentColor" /></>}{entry.reviewCount !== null && <span>({entry.reviewCount.toLocaleString()} reviews)</span>}</span><small>{entry.items.filter(item => item.available).length} items available</small></div></button>)}{!matching.length && <p>{restaurants.length ? 'No restaurants match your search.' : 'Your teacher is preparing the restaurants. Check back soon.'}</p>}</div> : <>
            <h3 className="meal-items-heading">On the menu</h3><div className="meal-product-grid">{items.map(item => <article className="meal-product" key={item.id}>
              <div className="meal-product-photo"><MealPhoto image={item.image} name={item.name} /><div className="meal-product-controls">{quantities[item.id] > 0 && <><button type="button" aria-label={'Remove one ' + item.name} disabled={locked || busy} onClick={() => changeQuantity(item.id, -1)}><Minus size={17} /></button><output aria-label={item.name + ' quantity'}>{quantities[item.id]}</output></>}<button type="button" aria-label={'Add one ' + item.name} disabled={locked || busy || quantities[item.id] >= 10} onClick={() => item.optionGroups?.length ? setCustomizing({ item, add: true }) : changeQuantity(item.id, 1)}><Plus size={19} /></button></div></div>
              <h4>{item.name}</h4>{!!item.optionGroups?.length && <button type="button" disabled={locked || busy} onClick={() => setCustomizing({ item, add: !quantities[item.id] })}>Customize {item.name}</button>}<p className="meal-product-price">{mealMoney(item.priceCents)}</p><p className="meal-product-description">After taxes &amp; fees: <strong>{item.estimatedTotalCents == null ? 'N/A' : mealMoney(item.estimatedTotalCents)}</strong> per item</p>{item.buyOneGetOne && <span className="meal-offer">Buy 1, get 1 free</span>}{item.description && <p className="meal-product-description">{item.description}</p>}
            </article>)}</div>{!items.length && <p>{search ? 'No items match your search.' : 'No items are available at this restaurant yet.'}</p>}
          </>}
        </section>{(restaurant || selections.length > 0 || data?.order) && <aside className="meal-summary"><h2>Your selection <span>{selections.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>{quote ? <><ul>{quote.items.map(item => <li key={item.id}><div><span>{item.name}</span>{item.restaurant && <small>{item.restaurant}</small>}<small>Fixed after taxes &amp; fees per item: {item.estimatedTotalCents == null ? 'N/A' : mealMoney(item.estimatedTotalCents)}</small>{item.customizations?.map((choice, index) => <small key={index}>{choice.group}: {choice.option} · {choice.extraCents ? '+' + mealMoney(choice.extraCents) : 'Included'}</small>)}{item.customizations?.length ? <button type="button" disabled={locked || busy} onClick={() => { const found = restaurants.flatMap(restaurant => restaurant.items).find(entry => entry.id === item.id); if (found) setCustomizing({ item: found, add: false }); }}>Edit choices</button> : null}<div className="meal-quantity"><button type="button" aria-label={'Decrease ' + item.name + ' in selection'} disabled={locked || busy} onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button><output>{item.quantity}</output><button type="button" aria-label={'Increase ' + item.name + ' in selection'} disabled={locked || busy || item.quantity >= 10} onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button></div></div><strong>{item.estimatedTotalCents == null ? 'N/A' : mealMoney(item.estimatedTotalCents * item.quantity)}</strong></li>)}</ul><dl><div className="meal-total"><dt>Estimate after taxes &amp; fees</dt><dd>{mealEstimate(quote)}</dd></div></dl></> : <p>{selections.length ? 'The menu changed. Clear your selection and choose available items.' : 'Find your next favorite. Add items from any restaurant.'}</p>}
          <p className="meal-fineprint">Your teacher’s fixed after-tax-and-fee item estimate stays the same for all customization choices. Only quantity changes the total. N/A means an item estimate is missing. Offer tags are labels only; they do not add free items or change the total.</p>
          <label>Notes for your teacher<textarea maxLength={1000} value={requestLocked && data?.order ? data.order.data.notes : notes} disabled={locked || busy} onChange={event => setNotes(event.target.value)} placeholder="Changes, preferences, or dietary needs" /></label>
          <button className="meal-primary" type="button" disabled={locked || busy || !quote} onClick={() => void submit()}>{busy ? 'Saving…' : startingAnother ? 'Send another request' : data?.order?.status === 'ordered' ? 'Ordered by your teacher' : data?.order?.data.teacherDecision === 'denied' ? 'Ask your teacher to restore' : data?.order && data.order.status !== 'cancelled' ? 'Update meal request' : 'Send to teacher'}</button>
          <p className="meal-fineprint">Your teacher places the order. The final Uber Eats checkout total may differ.</p>
          {selections.length > 0 && <button type="button" disabled={locked || busy} onClick={() => setQuantities({})}>Clear selection</button>}
          {data?.order?.status === 'submitted' && <button type="button" disabled={locked || busy} onClick={() => void submit(true)}>Cancel saved request</button>}
        </aside>}</div>
      </>}
      {customizing && <MealCustomizationDialog key={customizing.item.id} item={customizing.item} initial={choices[customizing.item.id] ?? {}} onClose={() => setCustomizing(null)} onConfirm={selected => { setChoices(current => ({ ...current, [customizing.item.id]: selected })); if (customizing.add) changeQuantity(customizing.item.id, 1); setCustomizing(null); }} />}
    </div>
  </StudentPortalShell>;
}
