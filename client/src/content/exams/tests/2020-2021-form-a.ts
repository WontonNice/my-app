import { championOfTheChannel20202021FormAPassageSet } from "../passageSets/champion-of-the-channel-2020-2021-form-a";
import { content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAPassageSet } from "../passageSets/5-reasons-physical-books-might-be-better-than-e-books-2020-2021-form-a";
import { snowyMountainsVersion2PassageSet } from "../passageSets/snowy-mountains-version-2";
import { excerptFromAVoiceInTheWilderness20202021FormAPassageSet } from "../passageSets/excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a";
import { inventionOfTheTelegraph20202021FormAPassageSet } from "../passageSets/invention-of-the-telegraph-2020-2021-form-a";
import { theBenefitsOfIndoorPlants20202021FormAPassageSet } from "../passageSets/the-benefits-of-indoor-plants-2020-2021-form-a";

import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-question-8",
  "part-b-question-9",
  "part-b-question-10"
]);

export const content20202021FormAContent: ExamContent = {
  assessmentId: "2020-2021-form-a",
  title: "2020-2021 Form A",
  passageSections: {
  "champion-of-the-channel-2020-2021-form-a": "reading",
  "5-reasons-physical-books-might-be-better-than-e-books-2020-2021-form-a": "reading",
  "snowy-mountains-version-2": "reading",
  "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a": "reading",
  "invention-of-the-telegraph-2020-2021-form-a": "reading",
  "the-benefits-of-indoor-plants-2020-2021-form-a": "reading"
},
  passageSets: [
    championOfTheChannel20202021FormAPassageSet,
    content5ReasonsPhysicalBooksMightBeBetterThanEBooks20202021FormAPassageSet,
    snowyMountainsVersion2PassageSet,
    excerptFromAVoiceInTheWilderness20202021FormAPassageSet,
    inventionOfTheTelegraph20202021FormAPassageSet,
    theBenefitsOfIndoorPlants20202021FormAPassageSet,
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
