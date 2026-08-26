import { aMiracleMilePassageSet } from "./passageSets/a-miracle-mile";
import { dothemnoharmPassageSet } from "./passageSets/dothemnoharm";
import { formARavenPlansPassageSet } from "./passageSets/formARavenPlans";
import { indoorPlantsPassageSet } from "./passageSets/indoorPlants";
import { massachusettsPassageSet } from "./passageSets/massachusetts";
import { scribeLikeAnEgyptianPassageSet } from "./passageSets/scribe-like-an-egyptian";
import { SnowyMountainsPassageSet } from "./passageSets/Snowy Mountains";
import { spiritOfTheHerdPassageSet } from "./passageSets/spiritOfTheHerd";
import { winterWheatPassageSet } from "./passageSets/winter-wheat";
import type { ExamPassageSet } from "./types";

export const examPassageLibrary: ExamPassageSet[] = [
  aMiracleMilePassageSet,
  dothemnoharmPassageSet,
  formARavenPlansPassageSet,
  indoorPlantsPassageSet,
  massachusettsPassageSet,
  scribeLikeAnEgyptianPassageSet,
  SnowyMountainsPassageSet,
  spiritOfTheHerdPassageSet,
  winterWheatPassageSet,
];

export function getExamLibraryPassage(passageId: string) {
  const passageSet = examPassageLibrary.find((entry) => entry.passage.id === passageId);
  return passageSet ? { id: passageSet.passage.id, passageSet } : undefined;
}
