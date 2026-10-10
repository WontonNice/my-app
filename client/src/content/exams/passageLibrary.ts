import { aMiracleMilePassageSet } from "./passageSets/a-miracle-mile";
import { getBankSet } from "../questionBank";
import { dothemnoharmPassageSet } from "./passageSets/dothemnoharm";
import { formARavenPlansPassageSet } from "./passageSets/formARavenPlans";
import { indoorPlantsPassageSet } from "./passageSets/indoorPlants";
import { massachusettsPassageSet } from "./passageSets/massachusetts";
import { scribeLikeAnEgyptianPassageSet } from "./passageSets/scribe-like-an-egyptian";
import { SnowyMountainsPassageSet } from "./passageSets/Snowy Mountains";
import { spiritOfTheHerdPassageSet } from "./passageSets/spiritOfTheHerd";
import { winterWheatPassageSet } from "./passageSets/winter-wheat";
import type { ExamPassage, ExamPassageSet } from "./types";
import { groupPassageBooks } from "../../../../server/src/shared/libraryBooks";
import { excerptFromTheFixItSaturdaysPassageSet } from "./passageSets/excerpt-from-the-fix-it-saturdays";
import { excerptFromTheRoadNotTakenPassageSet } from "./passageSets/excerpt-from-the-road-not-taken";
import { excerptFromThePuzzleOfTheRiderlessBicyclePassageSet } from "./passageSets/excerpt-from-the-puzzle-of-the-riderless-bicycle";
import { excerptFromTheLastMulePassageSet } from "./passageSets/excerpt-from-the-last-mule";
import { excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageSet } from "./passageSets/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil";
import { excerptFromInSearchOfTheUnknownPassageSet } from "./passageSets/excerpt-from-in-search-of-the-unknown";
import { aMiracleMileVersion2PassageSet } from "./passageSets/a-miracle-mile-version-2";
import { atDusk20252026FormBPassageSet } from "./passageSets/at-dusk-2025-2026-form-b";
import { usingFireToKeepAPrairieHealthyPassageSet } from "./passageSets/using-fire-to-keep-a-prairie-healthy";
import { letterFromBrooklyn20252026FormBPassageSet } from "./passageSets/letter-from-brooklyn-2025-2026-form-b";
import { theEndOfAnEraPassageSet } from "./passageSets/the-end-of-an-era";
import { excerptFromImpressionsOfAnIndianChildhood20242025FormAPassageSet } from "./passageSets/excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a";
import { atDusk20242025FormAPassageSet } from "./passageSets/at-dusk-2024-2025-form-a";
import { championOfTheChannelPassageSet } from "./passageSets/champion-of-the-channel";
import { massachusettsLowellNationalHistoricalPark20202021FormBPassageSet } from "./passageSets/massachusetts-lowell-national-historical-park-2020-2021-form-b";
import { excerptFromATrampAbroad20202021ShsatSampleTestFormBPassageSet } from "./passageSets/excerpt-from-a-tramp-abroad-2020-2021-shsat-sample-test-form-b";
import { excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet } from "./passageSets/excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b";
import { excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet } from "./passageSets/excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b";
import { crossPurposesFormBPassageSet } from "./passageSets/cross-purposes-form-b";
import { usingFireToKeepAPrairieHealthy20202021FormBPassageSet } from "./passageSets/using-fire-to-keep-a-prairie-healthy-2020-2021-form-b";
import { excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageSet } from "./passageSets/excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1";
import { championOfTheChannel20202021FormAPassageSet } from "./passageSets/champion-of-the-channel-2020-2021-form-a";
import { content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAPassageSet } from "./passageSets/5-reasons-physical-books-might-be-better-than-e-books-2020-2021-form-a";
import { snowyMountainsVersion2PassageSet } from "./passageSets/snowy-mountains-version-2";
import { excerptFromAVoiceInTheWilderness20202021FormAPassageSet } from "./passageSets/excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a";
import { inventionOfTheTelegraph20202021FormAPassageSet } from "./passageSets/invention-of-the-telegraph-2020-2021-form-a";
import { theBenefitsOfIndoorPlants20202021FormAPassageSet } from "./passageSets/the-benefits-of-indoor-plants-2020-2021-form-a";

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
  excerptFromTheFixItSaturdaysPassageSet,
  excerptFromTheRoadNotTakenPassageSet,
  excerptFromThePuzzleOfTheRiderlessBicyclePassageSet,
  excerptFromTheLastMulePassageSet,
  excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageSet,
  excerptFromInSearchOfTheUnknownPassageSet,
  aMiracleMileVersion2PassageSet,
  atDusk20252026FormBPassageSet,
  usingFireToKeepAPrairieHealthyPassageSet,
  letterFromBrooklyn20252026FormBPassageSet,
  theEndOfAnEraPassageSet,
  excerptFromImpressionsOfAnIndianChildhood20242025FormAPassageSet,
  atDusk20242025FormAPassageSet,
  championOfTheChannelPassageSet,
  massachusettsLowellNationalHistoricalPark20202021FormBPassageSet,
  excerptFromATrampAbroad20202021ShsatSampleTestFormBPassageSet,
  excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet,
  excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet,
  crossPurposesFormBPassageSet,
  usingFireToKeepAPrairieHealthy20202021FormBPassageSet,
  excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageSet,
  championOfTheChannel20202021FormAPassageSet,
  content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAPassageSet,
  snowyMountainsVersion2PassageSet,
  excerptFromAVoiceInTheWilderness20202021FormAPassageSet,
  inventionOfTheTelegraph20202021FormAPassageSet,
  theBenefitsOfIndoorPlants20202021FormAPassageSet,
];

export const examLibraryBooks = groupPassageBooks(examPassageLibrary);
export function getExamLibraryPassage(passageId: string) {
  const book = examLibraryBooks.find(book => book.id === passageId && book.versions.length > 1);
  if (book) return { ...book, isCombined: true };
  const passageSet = examPassageLibrary.find((entry) => entry.passage.id === passageId) ?? getBankSet(passageId);
  return passageSet ? { id: passageSet.passage.id, passageSet, isCombined: false, versions: [], questionPassages: {} as Record<string, ExamPassage> } : undefined;
}
