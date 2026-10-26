import { excerptFromScribeLikeAnEgyptian2023FormAPassageSet } from "../passageSets/excerpt-from-scribe-like-an-egyptian-2023-form-a";
import { excerptFromDoThemNoHarm2023FormAPassageSet } from "../passageSets/excerpt-from-do-them-no-harm-2023-form-a";
import { excerptFromTheFoodBusinessIncubator2023FormAPassageSet } from "../passageSets/excerpt-from-the-food-business-incubator-2023-form-a";
import { excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet } from "../passageSets/excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a";
import { birdTalk2023FormAPassageSet } from "../passageSets/bird-talk-2023-form-a";
import { excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAPassageSet } from "../passageSets/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2022-2023-form-a";
import { crackingTheCode20222023FormAPassageSet } from "../passageSets/cracking-the-code-2022-2023-form-a";
import { martialArtsForTheMindAndBody2023FormAPassageSet } from "../passageSets/martial-arts-for-the-mind-and-body-2023-form-a";
import { content20222023FormAMathSection } from "../mathSets/2022-2023-form-aMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-be14ccff9e7a-6d3f6f8f",
  "part-b-import-6ac23baedc82-90db8349",
  "part-b-import-ba9708d4a08f-39a88e57",
  "part-b-import-a014b48d8124-92d0f942",
  "part-b-import-f1c057628986-c19ffcec"
]);

export const content20222023FormAContent: ExamContent = {
  assessmentId: "2022-2023-form-a",
  title: "2022-2023 Form A",
  mathSection: content20222023FormAMathSection,
  passageSections: {
  "excerpt-from-scribe-like-an-egyptian-2023-form-a": "reading",
  "excerpt-from-do-them-no-harm-2023-form-a": "reading",
  "excerpt-from-the-food-business-incubator-2023-form-a": "reading",
  "excerpt-from-the-past-and-the-future-of-the-earth-s-oldest-trees-2023-form-a": "reading",
  "bird-talk-2023-form-a": "reading",
  "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2022-2023-form-a": "reading",
  "cracking-the-code-2022-2023-form-a": "revising_editing_a",
  "martial-arts-for-the-mind-and-body-2023-form-a": "revising_editing_a"
},
  passageSets: [
    excerptFromScribeLikeAnEgyptian2023FormAPassageSet,
    excerptFromDoThemNoHarm2023FormAPassageSet,
    excerptFromTheFoodBusinessIncubator2023FormAPassageSet,
    excerptFromThePastAndTheFutureOfTheEarthSOldestTrees2023FormAPassageSet,
    birdTalk2023FormAPassageSet,
    excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20222023FormAPassageSet,
    crackingTheCode20222023FormAPassageSet,
    martialArtsForTheMindAndBody2023FormAPassageSet,
  ],
  standaloneSection: {
    id: "ela-revising-editing-part-b",
    label: "ELA - Revising/Editing Part B",
    questionCount: selectedStandaloneItems.length,
    directions: {
      subject: "English Language Arts",
      title: "REVISING/EDITING PART B",
      breadcrumbLabel: "ELA REV/EDIT B DIRECTIONS",
      body:
        "Read and answer the following stand-alone questions. You will be asked to recognize and correct errors so that the sentences or short paragraphs follow the conventions of standard written English. Reread each sentence or paragraph as needed before selecting the best answer.",
    },
    questions: selectedStandaloneItems,
  },
};
