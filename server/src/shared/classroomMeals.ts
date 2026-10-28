export type MealItem = { id: string; name: string; description: string; priceCents: number; available: boolean };
export type MealMenu = { restaurant: string; restaurantUrl: string; taxBasisPoints: number; feeCents: number; items: MealItem[] };
export type MealSession = { id: string; title: string; menu: MealMenu; open: boolean; revision: number; created_at: string };
export type MealQuote = { items: { id: string; name: string; quantity: number; unitCents: number; totalCents: number }[]; subtotalCents: number; taxCents: number; feeCents: number; totalCents: number; currency: 'USD'; pricing: 'teacher_estimate' };
export type MealOrder = { session_id: string; student_id: string; revision: number; status: 'submitted' | 'ordered' | 'cancelled'; updated_at: string; data: { studentName: string; notes: string; quote: MealQuote; menuRevision: number } };
export type StudentMeals = { session: MealSession | null; order: MealOrder | null };
export type TeacherMeals = { sessions: MealSession[]; session: MealSession | null; orders: MealOrder[] };
export const emptyMealMenu = (): MealMenu => ({ restaurant: '', restaurantUrl: 'https://www.ubereats.com/feed?diningMode=DELIVERY', taxBasisPoints: 0, feeCents: 0, items: [] });
const fail = (message: string) => { throw Object.assign(new Error(message), { status: 400 }); };
function integer(value: unknown, max: number, label: string) { if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > max) fail(`Enter a valid ${label}.`); return Number(value); }
export function validateMealMenu(input: unknown): MealMenu {
  if (!input || typeof input !== 'object') return fail('Enter menu details.');
  const menu = input as MealMenu;
  if (typeof menu.restaurant !== 'string' || menu.restaurant.trim().length > 120) fail('Keep the restaurant name under 120 characters.');
  let url: URL; try { url = new URL(menu.restaurantUrl); } catch { return fail('Enter an Uber Eats restaurant link.'); }
  if (url.protocol !== 'https:' || !['ubereats.com', 'www.ubereats.com'].includes(url.hostname) || url.username || url.password) fail('Use an https://www.ubereats.com restaurant link.');
  if (!Array.isArray(menu.items) || menu.items.length > 100) fail('Use up to 100 menu items.');
  const items = menu.items.map(item => {
    if (!item || typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 150 || typeof item.description !== 'string' || item.description.length > 1000 || typeof item.available !== 'boolean') return fail('Each item needs a name, a valid ID, and a description under 1,000 characters.');
    return { id: item.id, name: item.name.trim(), description: item.description.trim(), available: item.available, priceCents: integer(item.priceCents, 100000, 'item price') };
  });
  if (new Set(items.map(item => item.id)).size !== items.length) fail('Menu item IDs must be unique.');
  if (typeof menu.taxBasisPoints !== 'number' || !Number.isFinite(menu.taxBasisPoints) || menu.taxBasisPoints < 0 || menu.taxBasisPoints > 2500) fail('Enter a tax rate from 0% to 25%.');
  return { restaurant: menu.restaurant.trim(), restaurantUrl: url.href, taxBasisPoints: menu.taxBasisPoints, feeCents: integer(menu.feeCents, 10000, 'fee up to $100'), items };
}
export function quoteMeal(menu: MealMenu, selections: unknown): MealQuote {
  if (!Array.isArray(selections) || !selections.length || selections.length > 30) return fail('Choose at least one menu item.');
  const seen = new Set<string>();
  const items = selections.map(selection => {
    const item = menu.items.find(candidate => candidate.id === selection?.id && candidate.available);
    if (!item || seen.has(item.id)) return fail('A selected item is unavailable. Reload the menu.');
    seen.add(item.id);
    const quantity = integer(selection.quantity, 10, 'quantity from 1 to 10');
    if (!quantity) return fail('Quantity must be at least 1.');
    return { id: item.id, name: item.name, quantity, unitCents: item.priceCents, totalCents: item.priceCents * quantity };
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.totalCents, 0);
  const taxCents = Math.round(subtotalCents * menu.taxBasisPoints / 10000), feeCents = menu.feeCents;
  return { items, subtotalCents, taxCents, feeCents, totalCents: subtotalCents + taxCents + feeCents, currency: 'USD', pricing: 'teacher_estimate' };
}
export const mealMoney = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
