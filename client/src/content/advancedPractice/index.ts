import { clockmakersWindow } from "./passageSets/clockmakersWindow";
import { groupsChangeTheirMinds } from "./passageSets/groupsChangeTheirMinds";
import { mapsBeneathTheCity } from "./passageSets/mapsBeneathTheCity";
import { signalsInTheFog } from "./passageSets/signalsInTheFog";

export type { AdvancedPracticePassage } from "./types";

export const advancedPracticePassages = [
  signalsInTheFog,
  clockmakersWindow,
  mapsBeneathTheCity,
  groupsChangeTheirMinds,
];

export function getAdvancedPracticePassage(passageId: string) {
  return advancedPracticePassages.find((passage) => passage.id === passageId);
}
