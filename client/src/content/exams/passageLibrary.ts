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
import { excerptFromTheCallOfTheWildPassageSet } from "./passageSets/excerpt-from-the-call-of-the-wild";
import { excerptFromTheFixItSaturdaysPassageSet } from "./passageSets/excerpt-from-the-fix-it-saturdays";
import { excerptFromTheRoadNotTakenPassageSet } from "./passageSets/excerpt-from-the-road-not-taken";
import { excerptFromThePuzzleOfTheRiderlessBicyclePassageSet } from "./passageSets/excerpt-from-the-puzzle-of-the-riderless-bicycle";
import { excerptFromTheLastMulePassageSet } from "./passageSets/excerpt-from-the-last-mule";

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
  excerptFromTheCallOfTheWildPassageSet,
  excerptFromTheFixItSaturdaysPassageSet,
  excerptFromTheRoadNotTakenPassageSet,
  excerptFromThePuzzleOfTheRiderlessBicyclePassageSet,
  excerptFromTheLastMulePassageSet,
];

export function getExamLibraryPassage(passageId: string) {
  const passageSet = examPassageLibrary.find((entry) => entry.passage.id === passageId);
  return passageSet ? { id: passageSet.passage.id, passageSet } : undefined;
}
