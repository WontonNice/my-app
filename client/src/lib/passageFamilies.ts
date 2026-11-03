import { contentHasCompleted, type ContentInventory } from "./passageOrganization";
import type { PassageRelation } from "./learningPlan";
/** Display the library's book families; completion remains attached to each source version. */
export function passageFamilies(rows: ContentInventory, relations: PassageRelation[] = []) {
  const parent = new Map(rows.map(row => [row.content.id, row.content.id]));
  const root = (id: string): string => parent.get(id) === id ? id : root(parent.get(id)!);
  const different = relations.filter(relation => !relation.stale && relation.relation === "different");
  const join = (a: string, b: string) => {
    if (!parent.has(a) || !parent.has(b)) return;
    const left = root(a), right = root(b);
    if (different.some(relation => parent.has(relation.a) && parent.has(relation.b) &&
      (root(relation.a) === left && root(relation.b) === right || root(relation.a) === right && root(relation.b) === left))) return;
    parent.set(right, left);
  };
  const books = new Map<string, string>();
  for (const row of rows) for (const book of row.content.aliases?.filter(id => id.startsWith("book-")) ?? []) {
    const first = books.get(book);
    if (first) join(first, row.content.id); else books.set(book, row.content.id);
  }
  const fingerprints = new Map<string, string>();
  for (const row of rows) if (row.content.passageTextKey) { const first = fingerprints.get(row.content.passageTextKey); if (first) join(first, row.content.id); else fingerprints.set(row.content.passageTextKey, row.content.id); }
  for (const relation of relations) if (!relation.stale && relation.relation !== "different") join(relation.a, relation.b);
  const groups = new Map<string, ContentInventory>();
  for (const row of rows) { const id = root(row.content.id); groups.set(id, [...(groups.get(id) ?? []), row]); }
  return [...groups].map(([id, versions]) => ({ id, versions, completed: versions.filter(contentHasCompleted), encountered: versions.some(row => contentHasCompleted(row) || !!row.evidence?.length || ["In progress", "Awaiting review"].includes(row.status)), historyComplete: versions.every(row => row.historyComplete !== false) }));
}
