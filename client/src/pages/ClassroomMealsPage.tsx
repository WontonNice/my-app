import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, RefreshCw, Search, Star, Utensils } from 'lucide-react';
import { mealMoney, mealRestaurants, quoteMeal, type StudentMeals } from '../../../server/src/shared/classroomMeals';
import { StudentPortalShell } from '../components/StudentPortalShell';
import { AppLink } from '../components/AppLink';
import { useStudentPortalAccess } from '../hooks/useStudentPortalAccess';
import { createAuthHeaders, requestApi } from '../lib/api';
import { signOutCurrentAccount } from '../lib/accountSwitching';
import { MealPhoto } from '../components/MealPhoto';
import { WontonSprite } from '../components/WontonSprite';
import '../styles/classroom-meals.css';

export function ClassroomMealsPage() {
  const { accessToken, previewContext, studentName, isCheckingSession } = useStudentPortalAccess();
  const [data, setData] = useState<StudentMeals | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [search, setSearch] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
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
      {message && <p className="meals-notice" role="status">{message}</p>}
      {(isCheckingSession || (!data && busy)) && <p role="status">Loading today’s menu…</p>}
      {data && !session && <div className="meals-empty"><Utensils size={32} /><h2>No meal session yet</h2><p>Your teacher will open a menu when it’s time to order.</p></div>}
      {session && <>
        <div className="meal-store-status"><span><strong>{session.title}</strong> · {data?.order?.status === 'ordered' ? 'Marked ordered' : session.open ? 'Ordering open' : 'Ordering closed'}</span><button type="button" disabled={busy} onClick={() => void reload()}><RefreshCw size={16} />Refresh</button></div>
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
              <div className="meal-product-photo"><MealPhoto image={item.image} name={item.name} /><div className="meal-product-controls">{quantities[item.id] > 0 && <><button type="button" aria-label={'Remove one ' + item.name} disabled={locked || busy} onClick={() => changeQuantity(item.id, -1)}><Minus size={17} /></button><output aria-label={item.name + ' quantity'}>{quantities[item.id]}</output></>}<button type="button" aria-label={'Add one ' + item.name} disabled={locked || busy || quantities[item.id] >= 10} onClick={() => changeQuantity(item.id, 1)}><Plus size={19} /></button></div></div>
              <h4>{item.name}</h4><p className="meal-product-price">{mealMoney(item.priceCents)}</p>{item.buyOneGetOne && <span className="meal-offer">Buy 1, get 1 free</span>}{item.description && <p className="meal-product-description">{item.description}</p>}
            </article>)}</div>{!items.length && <p>{search ? 'No items match your search.' : 'No items are available at this restaurant yet.'}</p>}
          </>}
        </section>{(restaurant || selections.length > 0 || data?.order) && <aside className="meal-summary"><h2>Your selection <span>{selections.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>{quote ? <><ul>{quote.items.map(item => <li key={item.id}><div><span>{item.name}</span>{item.restaurant && <small>{item.restaurant}</small>}<div className="meal-quantity"><button type="button" aria-label={'Decrease ' + item.name + ' in selection'} disabled={locked || busy} onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button><output>{item.quantity}</output><button type="button" aria-label={'Increase ' + item.name + ' in selection'} disabled={locked || busy || item.quantity >= 10} onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button></div></div><strong>{mealMoney(item.totalCents)}</strong></li>)}</ul><dl><div><dt>Subtotal</dt><dd>{mealMoney(quote.subtotalCents)}</dd></div><div><dt>Estimated tax ({session.menu.taxBasisPoints / 100}%)</dt><dd>{mealMoney(quote.taxCents)}</dd></div><div><dt>Estimated fees</dt><dd>{mealMoney(quote.feeCents)}</dd></div><div className="meal-total"><dt>Estimated total</dt><dd>{mealMoney(quote.totalCents)}</dd></div></dl></> : <p>{selections.length ? 'The menu changed. Clear your selection and choose available items.' : 'Find your next favorite. Add items from any restaurant.'}</p>}
          <p className="meal-fineprint">Teacher-entered prices, tax, and fees. Offer tags are labels only; they do not add free items or change the total.</p>
          <label>Notes for your teacher<textarea maxLength={1000} value={notes} disabled={locked || busy} onChange={event => setNotes(event.target.value)} placeholder="Changes, preferences, or dietary needs" /></label>
          <button className="meal-primary" type="button" disabled={locked || busy || !quote} onClick={() => void submit()}>{busy ? 'Saving…' : data?.order && data.order.status !== 'cancelled' ? 'Update meal request' : 'Send to teacher'}</button>
          <p className="meal-fineprint">Your teacher places the order. The final Uber Eats checkout total may differ.</p>
          {selections.length > 0 && <button type="button" disabled={locked || busy} onClick={() => setQuantities({})}>Clear selection</button>}
          {data?.order?.status === 'submitted' && <button type="button" disabled={locked || busy} onClick={() => void submit(true)}>Cancel saved request</button>}
          {data?.order && data.order.status !== 'cancelled' && <section className="meal-saved" aria-label="Saved meal request"><h3>Saved with your teacher</h3><p>{data.order.data.quote.items.map(item => item.quantity + ' × ' + item.name).join(' · ')}</p><p>{mealMoney(data.order.data.quote.totalCents)} estimated · {data.order.status === 'ordered' ? 'Ordered by teacher' : 'Sent to teacher'}</p>{data.order.data.notes && <p>{data.order.data.notes}</p>}</section>}
        </aside>}</div>
      </>}
    </div>
  </StudentPortalShell>;
}
