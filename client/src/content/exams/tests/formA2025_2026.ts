import { content20252026FormAMathSection } from "../mathSets/2025-2026-form-aMath";
import { SnowyMountainsPassageSet } from "../passageSets/Snowy Mountains";
import { scribeLikeAnEgyptianPassageSet } from "../passageSets/scribe-like-an-egyptian";
import { winterWheatPassageSet } from "../passageSets/winter-wheat";
import { dothemnoharmPassageSet } from "../passageSets/dothemnoharm";
import { spiritOfTheHerdPassageSet } from "../passageSets/spiritOfTheHerd";
import { massachusettsPassageSet } from "../passageSets/massachusetts";
import { indoorPlantsPassageSet } from "../passageSets/indoorPlants";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "standalone-vague-pronoun-1",
  "standalone-pangaea-sentence-structure-1",
  "standalone-pancakes-1",
  "standalone-blobfish-construction-1"
]);

export const formA2025_2026Content: ExamContent = {
  assessmentId: "2025-2026-form-a",
  title: "2025-2026 Form A",
  mathSection: content20252026FormAMathSection,
  passageSections: {
  "snowy-mountains": "reading",
  "scribe-like-an-egyptian": "reading",
  "winter-wheat": "reading",
  "dothemnoharm": "reading",
  "spirit-of-the-herd": "reading",
  "massachusetts": "reading",
  "indoor-plants": "revising_editing_a"
},
  passageSets: [
    SnowyMountainsPassageSet,
    scribeLikeAnEgyptianPassageSet,
    winterWheatPassageSet,
    dothemnoharmPassageSet,
    spiritOfTheHerdPassageSet,
    massachusettsPassageSet,
    indoorPlantsPassageSet,
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
