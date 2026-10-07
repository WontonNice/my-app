import categories from "./passage-category-options.json";

export type PassageCategory = "official_handbook" | "prestige" | "miscellaneous";
export const PASSAGE_CATEGORIES = categories as { value: PassageCategory; label: string }[];
/** Old content is valid. Unknown sources are never guessed from titles/genres. */
export function passageCategory(value: unknown): PassageCategory {
  return PASSAGE_CATEGORIES.some(category => category.value === value) ? value as PassageCategory : "miscellaneous";
}
export function passageCategoryLabel(value: unknown) {
  return PASSAGE_CATEGORIES.find(category => category.value === passageCategory(value))!.label;
}
