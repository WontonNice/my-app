export type MealItem = { id: string; name: string; description: string; priceCents: number; available: boolean; image?: string; buyOneGetOne?: boolean; estimatedTotalCents?: number | null };
export type MealRestaurant = { id: string; name: string; url: string; image: string; rating: number | null; reviewCount: number | null; items: MealItem[] };
export type MealMenu = { restaurant: string; restaurantUrl: string; taxBasisPoints: number; feeCents: number; items: MealItem[]; restaurants?: MealRestaurant[] };
export type MealSession = { id: string; title: string; menu: MealMenu; open: boolean; revision: number; created_at: string };
export type MealQuote = { items: { id: string; name: string; quantity: number; unitCents: number; totalCents: number; restaurant?: string; buyOneGetOne?: boolean; estimatedTotalCents?: number | null }[]; subtotalCents: number; taxCents: number; feeCents: number; totalCents: number; currency: 'USD'; pricing: 'teacher_estimate' };
export type MealOrder = { session_id: string; student_id: string; revision: number; status: 'submitted' | 'ordered' | 'cancelled'; updated_at: string; data: { studentName: string; notes: string; quote: MealQuote; menuRevision: number } };
export type StudentMeals = { session: MealSession | null; order: MealOrder | null };
export type TeacherMeals = { sessions: MealSession[]; session: MealSession | null; orders: MealOrder[] };
export const emptyMealMenu = (): MealMenu => ({ restaurant: '', restaurantUrl: 'https://www.ubereats.com/feed?diningMode=DELIVERY', taxBasisPoints: 0, feeCents: 0, items: [] });
const fail = (message: string) => { throw Object.assign(new Error(message), { status: 400 }); };
function integer(value: unknown, max: number, label: string) { if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > max) fail(`Enter a valid ${label}.`); return Number(value); }
export function mealRestaurants(menu: MealMenu): MealRestaurant[] {
  return menu.restaurants ?? (menu.restaurant || menu.items.length ? [{ id: 'legacy', name: menu.restaurant, url: menu.restaurantUrl, image: '', rating: null, reviewCount: null, items: menu.items }] : []);
}
function mealImage(value: unknown): string {
  if (value === undefined || value === '') return '';
  if (typeof value !== 'string' || value.length > 180000 || !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) return fail('Use an uploaded or pasted JPG, PNG, or WebP image under 130 KB after resizing.');
  const valid = value.startsWith('data:image/jpeg;base64,/9j/') || value.startsWith('data:image/png;base64,iVBORw0KGgo') || value.startsWith('data:image/webp;base64,UklGR');
  if (!valid) return fail('This image format does not match its contents. Choose another image.');
  return value;
}
function restaurantUrl(value: string): string {
  let url: URL; try { url = new URL(value); } catch { return fail('Enter an Uber Eats restaurant link.'); }
  if (url.protocol !== 'https:' || !['ubereats.com', 'www.ubereats.com'].includes(url.hostname) || url.username || url.password) return fail('Use an https://www.ubereats.com restaurant link.');
  return url.href;
}
export function validateMealMenu(input: unknown): MealMenu {
  if (!input || typeof input !== 'object') return fail('Enter menu details.');
  const menu = input as MealMenu;
  if (typeof menu.restaurant !== 'string' || menu.restaurant.trim().length > 120) fail('Keep the restaurant name under 120 characters.');
  const url = restaurantUrl(menu.restaurantUrl);
  if (!Array.isArray(menu.items) || menu.items.length > 100) fail('Use up to 100 menu items.');
  const items = menu.items.map(item => {
    if (!item || typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 150 || typeof item.description !== 'string' || item.description.length > 1000 || typeof item.available !== 'boolean') return fail('Each item needs a name, a valid ID, and a description under 1,000 characters.');
    if (item.buyOneGetOne !== undefined && typeof item.buyOneGetOne !== 'boolean') return fail('Choose a valid offer tag.');
    return { id: item.id, name: item.name.trim(), description: item.description.trim(), available: item.available, priceCents: integer(item.priceCents, 100000, 'item price'), image: mealImage(item.image), buyOneGetOne: item.buyOneGetOne ?? false, estimatedTotalCents: item.estimatedTotalCents == null ? null : integer(item.estimatedTotalCents, 1000000, 'estimated item total up to $10,000') };
  });
  if (new Set(items.map(item => item.id)).size !== items.length) fail('Menu item IDs must be unique.');
  if (typeof menu.taxBasisPoints !== 'number' || !Number.isFinite(menu.taxBasisPoints) || menu.taxBasisPoints < 0 || menu.taxBasisPoints > 2500) fail('Enter a tax rate from 0% to 25%.');
  let restaurants: MealRestaurant[] | undefined;
  if (menu.restaurants !== undefined) {
    if (!Array.isArray(menu.restaurants) || menu.restaurants.length > 20) return fail('Use up to 20 restaurants per session.');
    restaurants = menu.restaurants.map(restaurant => {
      if (!restaurant || typeof restaurant.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(restaurant.id) || typeof restaurant.name !== 'string' || !restaurant.name.trim() || restaurant.name.length > 120) return fail('Each restaurant needs a name and a valid ID.');
      if (restaurant.rating !== null && (typeof restaurant.rating !== 'number' || !Number.isFinite(restaurant.rating) || restaurant.rating < 0 || restaurant.rating > 5)) return fail('Enter a star rating from 0 to 5, or leave it blank.');
      const validated = validateMealMenu({ restaurant: restaurant.name, restaurantUrl: restaurant.url, taxBasisPoints: 0, feeCents: 0, items: restaurant.items });
      return { id: restaurant.id, name: validated.restaurant, url: validated.restaurantUrl, image: mealImage(restaurant.image), rating: restaurant.rating, reviewCount: restaurant.reviewCount === null ? null : integer(restaurant.reviewCount, 10000000, 'review count'), items: validated.items };
    });
    const allItems = restaurants.flatMap(restaurant => restaurant.items);
    if (new Set(restaurants.map(restaurant => restaurant.id)).size !== restaurants.length || new Set(allItems.map(item => item.id)).size !== allItems.length || allItems.length > 100) return fail('Use unique restaurant and item IDs, with up to 100 items in total.');
  }
  const result = { restaurant: menu.restaurant.trim(), restaurantUrl: url, taxBasisPoints: menu.taxBasisPoints, feeCents: integer(menu.feeCents, 10000, 'fee up to $100'), items, ...(restaurants ? { restaurants } : {}) };
  if (JSON.stringify(result).length > 8000000) return fail('This menu has too many images. Remove some images or split it into separate sessions.');
  return result;
}
export function quoteMeal(menu: MealMenu, selections: unknown): MealQuote {
  if (!Array.isArray(selections) || !selections.length || selections.length > 30) return fail('Choose at least one menu item.');
  const seen = new Set<string>();
  const items = selections.map(selection => {
    const restaurant = mealRestaurants(menu).find(restaurant => restaurant.items.some(candidate => candidate.id === selection?.id && candidate.available));
    const item = restaurant?.items.find(candidate => candidate.id === selection?.id && candidate.available);
    if (!item || seen.has(item.id)) return fail('A selected item is unavailable. Reload the menu.');
    seen.add(item.id);
    const quantity = integer(selection.quantity, 10, 'quantity from 1 to 10');
    if (!quantity) return fail('Quantity must be at least 1.');
    return { id: item.id, name: item.name, quantity, unitCents: item.priceCents, totalCents: item.priceCents * quantity, restaurant: restaurant?.name, buyOneGetOne: item.buyOneGetOne ?? false, estimatedTotalCents: item.estimatedTotalCents ?? null };
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.totalCents, 0);
  const taxCents = Math.round(subtotalCents * menu.taxBasisPoints / 10000), feeCents = menu.feeCents;
  return { items, subtotalCents, taxCents, feeCents, totalCents: subtotalCents + taxCents + feeCents, currency: 'USD', pricing: 'teacher_estimate' };
}
export const mealMoney = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
