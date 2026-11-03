import { PASSAGE_CATEGORIES, passageCategory, passageCategoryLabel } from "../../../server/src/shared/passageCategories";
import type { PlanOverview } from "./learningPlan";
import { validDate } from "./learningPlan";

export type ContentInventory = NonNullable<PlanOverview["inventory"]>;
export type PassageCompletionFilter = "" | "completed" | "not_completed";
export const contentHasCompleted = (row: ContentInventory[number]) => row.hasCompleted ?? row.status === "Completed";
export function passageCompletionDate(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return "No Data";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return validDate(value) ? value : "No Data";
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
export function passageSource(content: ContentInventory[number]["content"]) {
  return [content.contentSource, content.versionLabel && content.versionLabel !== content.id ? content.versionLabel : ""].filter((value, index, values) => value && values.indexOf(value) === index).join(" · ") || "No Data";
}
export function categoryInventory(inventory: ContentInventory) {
  const counts = new Map(PASSAGE_CATEGORIES.map(category => [category.value, { ...category, total: 0, remaining: 0, used: 0, completed: 0, assigned: 0, planned: 0 }]));
  for (const row of inventory) {
    if (row.content.kind !== "passage") continue;
    const count = counts.get(passageCategory(row.content.passageCategory))!;
    count.total++;
    count.remaining += Number(row.status === "Never assigned");
    count.completed += Number(contentHasCompleted(row));
    count.assigned += Number(["Assigned", "In progress", "Awaiting review"].includes(row.status));
    count.planned += Number(row.status === "Planned");
    count.used += Number(row.hasBeenAssigned || contentHasCompleted(row) || ["Assigned", "In progress", "Awaiting review", "Previously assigned"].includes(row.status));
  }
  return [...counts.values()];
}
export function filterContentInventory(inventory: ContentInventory, filters: { kind: string; status: string; genre: string; category: string; source?: string; score?:string; completion?: PassageCompletionFilter; subject: string; skill: string; search: string; sort: string; direction: "asc" | "desc" }) {
  const query = filters.search.trim().toLowerCase();
  return inventory.filter(row => (!filters.score || (filters.score==='unscored'? !row.latestScore : !!row.latestScore && (filters.score==='below70'? row.latestScore.correct/row.latestScore.total<0.7 : row.latestScore.correct/row.latestScore.total>=0.7))) && (!filters.completion || contentHasCompleted(row) === (filters.completion === "completed")) && (!filters.kind || row.content.kind === filters.kind) && (!filters.status || row.status === filters.status) && (!filters.genre || row.content.category === filters.genre) && (!filters.category || row.content.kind === "passage" && passageCategory(row.content.passageCategory) === filters.category) && (!filters.source || row.content.contentSource === filters.source) && (!filters.subject || row.content.subject === filters.subject) && (!filters.skill || row.content.skills.includes(filters.skill)) && (!query || `${row.content.title} ${row.content.description ?? ""} ${row.content.generators?.map(generator => generator.title + " " + generator.description).join(" ") ?? ""} ${row.content.skills.join(" ")} ${row.content.contentSource ?? ""} ${row.content.versionLabel ?? ""} ${row.content.kind === "passage" ? passageCategoryLabel(row.content.passageCategory) : ""}`.toLowerCase().includes(query))).sort((a, b) => {
    const value = (row: ContentInventory[number]) => {
      if (filters.sort === "score") return row.latestScore ? row.latestScore.correct / row.latestScore.total : null;
      if (filters.sort === "completed") {
        const date = Date.parse(row.lastCompletedAt ?? "");
        return Number.isFinite(date) ? date : null;
      }
      return filters.sort === "activity" ? row.lastActivity : filters.sort === "questions" ? row.content.practiceMode === "infinite" ? row.content.generators?.length ?? 0 : row.content.questionCount : filters.sort === "unassigned" ? Number(row.status === "Never assigned") : filters.sort === "category" ? row.content.kind === "passage" ? passageCategoryLabel(row.content.passageCategory) : row.content.category : row.content.title;
    };
    const left = value(a), right = value(b);
    if (left === null || right === null) return left === right ? a.content.id.localeCompare(b.content.id) : left === null ? 1 : -1;
    const difference = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
    return difference * (filters.direction === "asc" ? 1 : -1) || a.content.title.localeCompare(b.content.title) || a.content.id.localeCompare(b.content.id);
  });
}
