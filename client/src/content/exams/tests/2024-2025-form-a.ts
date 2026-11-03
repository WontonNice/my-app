import { excerptFromImpressionsOfAnIndianChildhood20242025FormAVersion2PassageSet } from "../passageSets/excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a-version-2";
import { atDusk2024FormAPassageSet } from "../passageSets/at-dusk-2024-form-a";
import { championOfTheChannel20242025FormAPassageSet } from "../passageSets/champion-of-the-channel-2024-2025-form-a";
import { content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAPassageSet } from "../passageSets/5-reasons-physical-books-might-be-better-than-e-books-2024-2025-form-a";
import { excerptFromTheHighestTide2024FormAPassageSet } from "../passageSets/excerpt-from-the-highest-tide-2024-form-a";
import { excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20242025FormAPassageSet } from "../passageSets/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2024-2025-form-a";
import { theFreeCollegeDebate20242025FormAPassageSet } from "../passageSets/the-free-college-debate-2024-2025-form-a";
import { content20242025FormAMathSection } from "../mathSets/2024-2025-form-aMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-a230dac54eb9-0577ee73",
  "part-b-import-6e34e1a52059-024cf95e",
  "part-b-import-30519d115cab-1f91a2d7",
  "part-b-import-383f7188a8c8-b7196781"
]);

export const content20242025FormAContent: ExamContent = {
  assessmentId: "2024-2025-form-a",
  title: "2024-2025 Form A",
  mathSection: content20242025FormAMathSection,
  passageSections: {
  "excerpt-from-impressions-of-an-indian-childhood-2024-2025-form-a-version-2": "reading",
  "at-dusk-2024-form-a": "reading",
  "champion-of-the-channel-2024-2025-form-a": "reading",
  "5-reasons-physical-books-might-be-better-than-e-books-2024-2025-form-a": "reading",
  "excerpt-from-the-highest-tide-2024-form-a": "reading",
  "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2024-2025-form-a": "reading",
  "the-free-college-debate-2024-2025-form-a": "revising_editing_a"
},
  passageSets: [
    excerptFromImpressionsOfAnIndianChildhood20242025FormAVersion2PassageSet,
    atDusk2024FormAPassageSet,
    championOfTheChannel20242025FormAPassageSet,
    content5ReasonsPhysicalBooksMightBeBetterThanEBooks20242025FormAPassageSet,
    excerptFromTheHighestTide2024FormAPassageSet,
    excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvil20242025FormAPassageSet,
    theFreeCollegeDebate20242025FormAPassageSet,
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
