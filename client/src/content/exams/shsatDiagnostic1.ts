import { SnowyMountainsPassageSet } from "./passageSets/Snowy Mountains";
import { indoorPlantsPassageSet } from "./passageSets/indoorPlants";
import { shsatDiagnostic1MathSection } from "./mathSets/shsatDiagnostic1Math";
import { ravenPlansPassageSet } from "./passageSets/ravenPlans";
import { spiritOfTheHerdPassageSet } from "./passageSets/spiritOfTheHerd";
import { getStandaloneItemsById } from "./standaloneItems";
import type { ExamContent } from "./types";

const selectedStandaloneItems = getStandaloneItemsById([
  "standalone-vague-pronoun-1",
  "standalone-pancakes-1",
  "standalone-blobfish-construction-1",
]);

export const shsatDiagnostic1Content: ExamContent = {
  assessmentId: "shsat-diagnostic-1",
  title: "SHSAT Diagnostic 1",
  mathSection: shsatDiagnostic1MathSection,
  passageSets: [
    SnowyMountainsPassageSet,
    ravenPlansPassageSet,
    spiritOfTheHerdPassageSet,
    indoorPlantsPassageSet,
  ],
  standaloneSection: {
    id: "ela-standalone-items",
    label: "ELA - Stand alone items",
    questionCount: selectedStandaloneItems.length,
    directions: {
      subject: "English Language Arts",
      title: "REVISING/EDITING PART B",
      breadcrumbLabel: "ELA REV/EDIT B DIRECTIONS",
      body:
        "Read and answer the following questions. You will be asked to recognize and correct errors so that the sentences or short paragraphs follow the conventions of standard written English. As needed, you may use the notepad tool or write on the scrap paper given to you to take notes. You should reread relevant parts of the sentences or paragraphs, while being mindful of time, before selecting the best answer for each question.",
    },
    questions: selectedStandaloneItems,
  },
};
