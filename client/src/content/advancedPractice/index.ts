
import { theCatSTable } from "./passageSets/the-cat-s-table";
export type { AdvancedPracticePassage } from "./types";

export const advancedPracticePassages = [
  theCatSTable,
];

export function getAdvancedPracticePassage(passageId: string) {
  return advancedPracticePassages.find((passage) => passage.id === passageId);
}
