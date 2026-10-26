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
import { excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageSet } from "./passageSets/excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1";
import { excerptFromLittleWomenDigitalShsatPracticeTest2PassageSet } from "./passageSets/excerpt-from-little-women-digital-shsat-practice-test-2";
import { excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2PassageSet } from "./passageSets/excerpt-from-the-story-of-my-life-digital-shsat-practice-test-2";
import { excerptFromTheCartThatChangedTheSupermarketDigitalShsatPracticeTest2PassageSet } from "./passageSets/excerpt-from-the-cart-that-changed-the-supermarket-digital-shsat-practice-test-2";
import { excerptFromOCaptainMyCaptainDigitalShsatPracticeTest2PassageSet } from "./passageSets/excerpt-from-o-captain-my-captain-digital-shsat-practice-test-2";
import { excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2PassageSet } from "./passageSets/excerpt-from-the-neighborhood-next-door-is-hotter-than-yours-digital-shsat-practice-test-2";
import { excerptFromScribeLikeAnEgyptian2023FormAPassageSet } from "./passageSets/excerpt-from-scribe-like-an-egyptian-2023-form-a";
import { excerptFromDoThemNoHarm2023FormAPassageSet } from "./passageSets/excerpt-from-do-them-no-harm-2023-form-a";
import { excerptFromTheFoodBusinessIncubator2023FormAPassageSet } from "./passageSets/excerpt-from-the-food-business-incubator-2023-form-a";
import { birdTalk2023FormAPassageSet } from "./passageSets/bird-talk-2023-form-a";
import { excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAPassageSet } from "./passageSets/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2022-2023-form-a";
import { crackingTheCode20222023FormAPassageSet } from "./passageSets/cracking-the-code-2022-2023-form-a";
import { martialArtsForTheMindAndBody2023FormAPassageSet } from "./passageSets/martial-arts-for-the-mind-and-body-2023-form-a";
import { excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet } from "./passageSets/excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a";
import { movingThroughMountains20222023FormBPassageSet } from "./passageSets/moving-through-mountains-2022-2023-form-b";
import { excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet } from "./passageSets/excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b";
import { excerptFromTheHighestTide20222023FormBPassageSet } from "./passageSets/excerpt-from-the-highest-tide-2022-2023-form-b";
import { goingSolarInChina20222023FormBPassageSet } from "./passageSets/going-solar-in-china-2022-2023-form-b";
import { excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet } from "./passageSets/excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b";
import { lookingForTheSmallestSparkOfEverything2023FormBPassageSet } from "./passageSets/looking-for-the-smallest-spark-of-everything-2023-form-b";
import { excerptFromImpressionsOfAnIndianChildhood20222023FormBPassageSet } from "./passageSets/excerpt-from-impressions-of-an-indian-childhood-2022-2023-form-b";
import { excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet } from "./passageSets/excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3";
import { theReturnOfTheFerryDigitalShsatPracticeTest3PassageSet } from "./passageSets/the-return-of-the-ferry-digital-shsat-practice-test-3";
import { excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet } from "./passageSets/excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3";
import { theOrchardKeepsALedgerDigitalShsatPracticeTest3PassageSet } from "./passageSets/the-orchard-keeps-a-ledger-digital-shsat-practice-test-3";
import { sixtySummersOnKestrelGlacierDigitalShsatPracticeTest3PassageSet } from "./passageSets/sixty-summers-on-kestrel-glacier-digital-shsat-practice-test-3";
import { doverBeachDigitalShsatPracticeTest3PassageSet } from "./passageSets/dover-beach-digital-shsat-practice-test-3";

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
  excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageSet,
  excerptFromLittleWomenDigitalShsatPracticeTest2PassageSet,
  excerptFromTheStoryOfMyLifeDigitalShsatPracticeTest2PassageSet,
  excerptFromTheCartThatChangedTheSupermarketDigitalShsatPracticeTest2PassageSet,
  excerptFromOCaptainMyCaptainDigitalShsatPracticeTest2PassageSet,
  excerptFromTheNeighborhoodNextDoorIsHotterThanYoursDigitalShsatPracticeTest2PassageSet,
  excerptFromScribeLikeAnEgyptian2023FormAPassageSet,
  excerptFromDoThemNoHarm2023FormAPassageSet,
  excerptFromTheFoodBusinessIncubator2023FormAPassageSet,
  birdTalk2023FormAPassageSet,
  excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAPassageSet,
  crackingTheCode20222023FormAPassageSet,
  martialArtsForTheMindAndBody2023FormAPassageSet,
  excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet,
  movingThroughMountains20222023FormBPassageSet,
  excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet,
  excerptFromTheHighestTide20222023FormBPassageSet,
  goingSolarInChina20222023FormBPassageSet,
  excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet,
  lookingForTheSmallestSparkOfEverything2023FormBPassageSet,
  excerptFromImpressionsOfAnIndianChildhood20222023FormBPassageSet,
  excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet,
  theReturnOfTheFerryDigitalShsatPracticeTest3PassageSet,
  excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet,
  theOrchardKeepsALedgerDigitalShsatPracticeTest3PassageSet,
  sixtySummersOnKestrelGlacierDigitalShsatPracticeTest3PassageSet,
  doverBeachDigitalShsatPracticeTest3PassageSet,
];

export const examLibraryBooks = groupPassageBooks(examPassageLibrary);
export function getExamLibraryPassage(passageId: string) {
  const book = examLibraryBooks.find(book => book.id === passageId && book.versions.length > 1);
  if (book) return { ...book, isCombined: true };
  const passageSet = examPassageLibrary.find((entry) => entry.passage.id === passageId) ?? getBankSet(passageId);
  return passageSet ? { id: passageSet.passage.id, passageSet, isCombined: false, versions: [], questionPassages: {} as Record<string, ExamPassage> } : undefined;
}
