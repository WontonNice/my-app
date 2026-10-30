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
import { atDusk20242025FormAPassageSet } from "./passageSets/at-dusk-2024-2025-form-a";
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
import { whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageSet } from "./passageSets/what-the-cube-taught-me-digital-shsat-practice-test-3";
import { crackingTheCode20192020FormAPassageSet } from "./passageSets/cracking-the-code-2019-2020-form-a";
import { aMiracleMile20192020FormAPassageSet } from "./passageSets/a-miracle-mile-2019-2020-form-a";
import { odeToFireworks20192020FormAPassageSet } from "./passageSets/ode-to-fireworks-2019-2020-form-a";
import { excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet } from "./passageSets/excerpt-from-how-we-made-the-first-flight-2019-2020-form-a";
import { excerptFromInSearchOfTheUnknown20192020FormAPassageSet } from "./passageSets/excerpt-from-in-search-of-the-unknown-2019-2020-form-a";
import { isItTimeForTermLimits20192020FormAPassageSet } from "./passageSets/is-it-time-for-term-limits-2019-2020-form-a";
import { excerptFromResearchRiddleResolved20192020FormAPassageSet } from "./passageSets/excerpt-from-research-riddle-resolved-2019-2020-form-a";
import { theFreeCollegeDebate20242025FormAPassageSet } from "./passageSets/the-free-college-debate-2024-2025-form-a";
import { excerptFromImpressionsOfAnIndianChildhood20242025FormAVersion2PassageSet } from "./passageSets/excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a-version-2";
import { atDusk2024FormAPassageSet } from "./passageSets/at-dusk-2024-form-a";
import { championOfTheChannel20242025FormAPassageSet } from "./passageSets/champion-of-the-channel-2024-2025-form-a";
import { content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAPassageSet } from "./passageSets/5-reasons-physical-books-might-be-better-than-e-books-2024-2025-form-a";
import { excerptFromTheHighestTide2024FormAPassageSet } from "./passageSets/excerpt-from-the-highest-tide-2024-form-a";
import { excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20242025FormAPassageSet } from "./passageSets/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2024-2025-form-a";
import { snowyMountains20262027FormAPassageSet } from "./passageSets/snowy-mountains-2026-2027-form-a";
import { theBestLaidPlansOfRavens20262027FormAPassageSet } from "./passageSets/the-best-laid-plans-of-ravens-2026-2027-form-a";
import { excerptFromAVoiceInTheWilderness20262027FormAPassageSet } from "./passageSets/excerpt-from-a-voice-in-the-wilderness-2026-2027-form-a";
import { championOfTheChannel20262027FormAPassageSet } from "./passageSets/champion-of-the-channel-2026-2027-form-a";
import { excerptFromTheSpiritOfTheHerd20262027FormAPassageSet } from "./passageSets/excerpt-from-the-spirit-of-the-herd-2026-2027-form-a";
import { theBenefitsOfIndoorPlants20262027FormAPassageSet } from "./passageSets/the-benefits-of-indoor-plants-2026-2027-form-a";
import { excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20262027FormBPassageSet } from "./passageSets/excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2026-2027-form-b";
import { aMiracleMile20262027FormBPassageSet } from "./passageSets/a-miracle-mile-2026-2027-form-b";
import { excerptFromInSearchOfTheUnknown20262027FormBPassageSet } from "./passageSets/excerpt-from-in-search-of-the-unknown-2026-2027-form-b";
import { lookingForTheSmallestSparkOfEverything20262027FormBPassageSet } from "./passageSets/looking-for-the-smallest-spark-of-everything-2026-2027-form-b";
import { usingFireToKeepAPrairieHealthy20262027FormBPassageSet } from "./passageSets/using-fire-to-keep-a-prairie-healthy-2026-2027-form-b";
import { letterFromBrooklyn20262027FormBPassageSet } from "./passageSets/letter-from-brooklyn-2026-2027-form-b";
import { theEndOfAnEra20262027FormBPassageSet } from "./passageSets/the-end-of-an-era-2026-2027-form-b";
import { inventionOfTheTelegraph20262027FormCPassageSet } from "./passageSets/invention-of-the-telegraph-2026-2027-form-c";
import { excerptFromNiagaraFalls20262027FormCPassageSet } from "./passageSets/excerpt-from-niagara-falls-2026-2027-form-c";
import { excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageSet } from "./passageSets/excerpt-from-impressions-of-an-indian-childhood-2026-2027-form-c";
import { birdTalk20262027FormCPassageSet } from "./passageSets/bird-talk-2026-2027-form-c";
import { serpentMound20262027FormCPassageSet } from "./passageSets/serpent-mound-2026-2027-form-c";
import { excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageSet } from "./passageSets/excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c";
import { newYorkCityAndTheHudsonValleyBrickmakingIndustry20262027FormCPassageSet } from "./passageSets/new-york-city-and-the-hudson-valley-brickmaking-industry-2026-2027-form-c";
import { aMemoryRevolution20262027FormDPassageSet } from "./passageSets/a-memory-revolution-2026-2027-form-d";
import { excerptFromHowWeMadeTheFirstFlight20262027FormDPassageSet } from "./passageSets/excerpt-from-how-we-made-the-first-flight-2026-2027-form-d";
import { wolvesOfTheSea20262027FormDPassageSet } from "./passageSets/wolves-of-the-sea-2026-2027-form-d";
import { odeToFireworks20262027FormDPassageSet } from "./passageSets/ode-to-fireworks-2026-2027-form-d";
import { excerptFromTheHighestTide20262027FormDPassageSet } from "./passageSets/excerpt-from-the-highest-tide-2026-2027-form-d";
import { movingThroughMountains20262027FormDPassageSet } from "./passageSets/moving-through-mountains-2026-2027-form-d";
import { findTimeToVolunteer20242025FormBPassageSet } from "./passageSets/find-time-to-volunteer-2024-2025-form-b";
import { excerptFromHowExerciseCouldHelpYouLearnANewLanguage20242025FormBPassageSet } from "./passageSets/excerpt-from-how-exercise-could-help-you-learn-a-new-language-2024-2025-form-b";
import { inventionOfTheTelegraph20242025FormBPassageSet } from "./passageSets/invention-of-the-telegraph-2024-2025-form-b";
import { snowyMountains20242025FormBPassageSet } from "./passageSets/snowy-mountains-2024-2025-form-b";
import { excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20242025FormBPassageSet } from "./passageSets/excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2024-2025-form-b";
import { excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageSet } from "./passageSets/excerpt-from-rip-van-winkle-digital-shsat-practice-test-5";
import { excerptFromRoomToRoamDigitalShsatPracticeTest5PassageSet } from "./passageSets/excerpt-from-room-to-roam-digital-shsat-practice-test-5";
import { excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageSet } from "./passageSets/excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5";
import { excerptFromFirstIceDigitalShsatPracticeTest5PassageSet } from "./passageSets/excerpt-from-first-ice-digital-shsat-practice-test-5";
import { howAMountainBecomesAVolcanoDigitalShsatPracticeTest5PassageSet } from "./passageSets/how-a-mountain-becomes-a-volcano-digital-shsat-practice-test-5";
import { excerptFromToAutumnDigitalShsatPracticeTest5PassageSet } from "./passageSets/excerpt-from-to-autumn-digital-shsat-practice-test-5";
import { theScienceOfSourdoughDigitalShsatPracticeTest5PassageSet } from "./passageSets/the-science-of-sourdough-digital-shsat-practice-test-5";

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
  atDusk20242025FormAPassageSet,
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
  whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageSet,
  crackingTheCode20192020FormAPassageSet,
  aMiracleMile20192020FormAPassageSet,
  odeToFireworks20192020FormAPassageSet,
  excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet,
  excerptFromInSearchOfTheUnknown20192020FormAPassageSet,
  isItTimeForTermLimits20192020FormAPassageSet,
  excerptFromResearchRiddleResolved20192020FormAPassageSet,
  theFreeCollegeDebate20242025FormAPassageSet,
  excerptFromImpressionsOfAnIndianChildhood20242025FormAVersion2PassageSet,
  atDusk2024FormAPassageSet,
  championOfTheChannel20242025FormAPassageSet,
  content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAPassageSet,
  excerptFromTheHighestTide2024FormAPassageSet,
  excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20242025FormAPassageSet,
  snowyMountains20262027FormAPassageSet,
  theBestLaidPlansOfRavens20262027FormAPassageSet,
  excerptFromAVoiceInTheWilderness20262027FormAPassageSet,
  championOfTheChannel20262027FormAPassageSet,
  excerptFromTheSpiritOfTheHerd20262027FormAPassageSet,
  theBenefitsOfIndoorPlants20262027FormAPassageSet,
  excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20262027FormBPassageSet,
  aMiracleMile20262027FormBPassageSet,
  excerptFromInSearchOfTheUnknown20262027FormBPassageSet,
  lookingForTheSmallestSparkOfEverything20262027FormBPassageSet,
  usingFireToKeepAPrairieHealthy20262027FormBPassageSet,
  letterFromBrooklyn20262027FormBPassageSet,
  theEndOfAnEra20262027FormBPassageSet,
  inventionOfTheTelegraph20262027FormCPassageSet,
  excerptFromNiagaraFalls20262027FormCPassageSet,
  excerptFromImpressionsOfAnIndianChildhood20262027FormCPassageSet,
  birdTalk20262027FormCPassageSet,
  serpentMound20262027FormCPassageSet,
  excerptFromGrowingPeppersOnTheIssIsJustTheStartOfSpaceFarming20262027FormCPassageSet,
  newYorkCityAndTheHudsonValleyBrickmakingIndustry20262027FormCPassageSet,
  aMemoryRevolution20262027FormDPassageSet,
  excerptFromHowWeMadeTheFirstFlight20262027FormDPassageSet,
  wolvesOfTheSea20262027FormDPassageSet,
  odeToFireworks20262027FormDPassageSet,
  excerptFromTheHighestTide20262027FormDPassageSet,
  movingThroughMountains20262027FormDPassageSet,
  findTimeToVolunteer20242025FormBPassageSet,
  excerptFromHowExerciseCouldHelpYouLearnANewLanguage20242025FormBPassageSet,
  inventionOfTheTelegraph20242025FormBPassageSet,
  snowyMountains20242025FormBPassageSet,
  excerptFromThePastAndTheFutureOfTheEarthSOldestTrees20242025FormBPassageSet,
  excerptFromRipVanWinkleDigitalShsatPracticeTest5PassageSet,
  excerptFromRoomToRoamDigitalShsatPracticeTest5PassageSet,
  excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageSet,
  excerptFromFirstIceDigitalShsatPracticeTest5PassageSet,
  howAMountainBecomesAVolcanoDigitalShsatPracticeTest5PassageSet,
  excerptFromToAutumnDigitalShsatPracticeTest5PassageSet,
  theScienceOfSourdoughDigitalShsatPracticeTest5PassageSet,
];

export const examLibraryBooks = groupPassageBooks(examPassageLibrary);
export function getExamLibraryPassage(passageId: string) {
  const book = examLibraryBooks.find(book => book.id === passageId && book.versions.length > 1);
  if (book) return { ...book, isCombined: true };
  const passageSet = examPassageLibrary.find((entry) => entry.passage.id === passageId) ?? getBankSet(passageId);
  return passageSet ? { id: passageSet.passage.id, passageSet, isCombined: false, versions: [], questionPassages: {} as Record<string, ExamPassage> } : undefined;
}
