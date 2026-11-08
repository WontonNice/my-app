import { excerptFromTheAdventuresOfTomSawyerDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/excerpt-from-the-adventures-of-tom-sawyer-digital-shsat-practice-test-adaptive-10";
import { fromASmallShelfToAGiantCollectionTheLibraryOfCongressDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/from-a-small-shelf-to-a-giant-collection-the-library-of-congress-digital-shsat-practice-test-adaptive-10";
import { whereJazzBeganTheMusicOfEarlyNewOrleansDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/where-jazz-began-the-music-of-early-new-orleans-digital-shsat-practice-test-adaptive-10";
import { aBirdCameDownTheWalkDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/a-bird-came-down-the-walk-digital-shsat-practice-test-adaptive-10";
import { excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10";
import { theWearyBluesDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/the-weary-blues-digital-shsat-practice-test-adaptive-10";
import { excerptFromGettingKiteMakingRightDigitalShsatPracticeTestAdaptive10PassageSet } from "../passageSets/excerpt-from-getting-kite-making-right-digital-shsat-practice-test-adaptive-10";
import { digitalShsatPracticeTestAdaptive10HardMathSection } from "../mathSets/digital-shsat-practice-test-adaptive-10-hardMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "satcc-9cc827afe5f992f7af37-ela-47",
  "satcc-9cc827afe5f992f7af37-ela-48",
  "satcc-9cc827afe5f992f7af37-ela-50",
  "satcc-9cc827afe5f992f7af37-ela-49"
]);

export const digitalShsatPracticeTestAdaptive10HardContent: ExamContent = {
  assessmentId: "digital-shsat-practice-test-adaptive-10-hard",
  title: "Digital SHSAT Practice Test Adaptive 10 (Hard)",
  mathSection: digitalShsatPracticeTestAdaptive10HardMathSection,
  passageSections: {
  "excerpt-from-the-adventures-of-tom-sawyer-digital-shsat-practice-test-adaptive-10": "reading",
  "from-a-small-shelf-to-a-giant-collection-the-library-of-congress-digital-shsat-practice-test-adaptive-10": "reading",
  "where-jazz-began-the-music-of-early-new-orleans-digital-shsat-practice-test-adaptive-10": "reading",
  "a-bird-came-down-the-walk-digital-shsat-practice-test-adaptive-10": "reading",
  "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10": "reading",
  "the-weary-blues-digital-shsat-practice-test-adaptive-10": "reading",
  "excerpt-from-getting-kite-making-right-digital-shsat-practice-test-adaptive-10": "revising_editing_a"
},
  passageSets: [
    excerptFromTheAdventuresOfTomSawyerDigitalShsatPracticeTestAdaptive10PassageSet,
    fromASmallShelfToAGiantCollectionTheLibraryOfCongressDigitalShsatPracticeTestAdaptive10PassageSet,
    whereJazzBeganTheMusicOfEarlyNewOrleansDigitalShsatPracticeTestAdaptive10PassageSet,
    aBirdCameDownTheWalkDigitalShsatPracticeTestAdaptive10PassageSet,
    excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10PassageSet,
    theWearyBluesDigitalShsatPracticeTestAdaptive10PassageSet,
    excerptFromGettingKiteMakingRightDigitalShsatPracticeTestAdaptive10PassageSet,
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
