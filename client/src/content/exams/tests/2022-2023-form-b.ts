import { excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet } from "../passageSets/excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b";
import { excerptFromTheHighestTide20222023FormBPassageSet } from "../passageSets/excerpt-from-the-highest-tide-2022-2023-form-b";
import { goingSolarInChina20222023FormBPassageSet } from "../passageSets/going-solar-in-china-2022-2023-form-b";
import { excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet } from "../passageSets/excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b";
import { lookingForTheSmallestSparkOfEverything2023FormBPassageSet } from "../passageSets/looking-for-the-smallest-spark-of-everything-2023-form-b";
import { excerptFromImpressionsOfAnIndianChildhood20222023FormBPassageSet } from "../passageSets/excerpt-from-impressions-of-an-indian-childhood-2022-2023-form-b";
import { movingThroughMountains20222023FormBPassageSet } from "../passageSets/moving-through-mountains-2022-2023-form-b";
import { content20222023FormBMathSection } from "../mathSets/2022-2023-form-bMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-404ef8a6deeb-1222d1bf",
  "part-b-import-2306e0b898d5-ae910e11",
  "part-b-import-f2325dca51de-51707498",
  "part-b-import-7651e03756f2-ba433486"
]);

export const content20222023FormBContent: ExamContent = {
  assessmentId: "2022-2023-form-b",
  title: "2022-2023 Form B",
  mathSection: content20222023FormBMathSection,
  passageSections: {
  "excerpt-from-the-world-has-an-e-waste-problem-2022-2023-form-b": "reading",
  "excerpt-from-the-highest-tide-2022-2023-form-b": "reading",
  "going-solar-in-china-2022-2023-form-b": "reading",
  "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b": "reading",
  "looking-for-the-smallest-spark-of-everything-2023-form-b": "reading",
  "excerpt-from-impressions-of-an-indian-childhood-2022-2023-form-b": "reading",
  "moving-through-mountains-2022-2023-form-b": "revising_editing_a"
},
  passageSets: [
    excerptFromTheWorldHasAnEWasteProblem20222023FormBPassageSet,
    excerptFromTheHighestTide20222023FormBPassageSet,
    goingSolarInChina20222023FormBPassageSet,
    excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet,
    lookingForTheSmallestSparkOfEverything2023FormBPassageSet,
    excerptFromImpressionsOfAnIndianChildhood20222023FormBPassageSet,
    movingThroughMountains20222023FormBPassageSet,
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
