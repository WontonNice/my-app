import { content20172018FormAMathSection } from "../mathSets/2017-2018-form-aMath";
import { readingPassage120172018FormAPassageSet } from "../passageSets/reading-passage-1-2017-2018-form-a";
import { readingPassage220172018FormAPassageSet } from "../passageSets/reading-passage-2-2017-2018-form-a";
import { readingPassage320172018FormAPassageSet } from "../passageSets/reading-passage-3-2017-2018-form-a";
import { readingPassage420172018FormAPassageSet } from "../passageSets/reading-passage-4-2017-2018-form-a";
import { readingPassage520172018FormAPassageSet } from "../passageSets/reading-passage-5-2017-2018-form-a";
import { readingPassage620172018FormAPassageSet } from "../passageSets/reading-passage-6-2017-2018-form-a";
import { unlockRideReturn20172018FormAPassageSet } from "../passageSets/unlock-ride-return-2017-2018-form-a";
import { pursuingAHobby20172018FormAPassageSet } from "../passageSets/pursuing-a-hobby-2017-2018-form-a";

import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-0ea66e24a5c0-72af5644",
  "part-b-import-55ca9287c304-58585284",
  "part-b-import-be10ff9dae9c-bd9b9422",
  "part-b-import-4669ed81b4aa-903f4032",
  "part-b-import-1bc95d788614-c76e5943",
  "part-b-import-58cd1c48131d-1dd438a6"
]);

export const content20172018FormAContent: ExamContent = {
  mathSection: content20172018FormAMathSection,
  assessmentId: "2017-2018-form-a",
  title: "2017-2018 Form A",
  passageSections: {
  "reading-passage-1-2017-2018-form-a": "reading",
  "reading-passage-2-2017-2018-form-a": "reading",
  "reading-passage-3-2017-2018-form-a": "reading",
  "reading-passage-4-2017-2018-form-a": "reading",
  "reading-passage-5-2017-2018-form-a": "reading",
  "reading-passage-6-2017-2018-form-a": "reading",
  "unlock-ride-return-2017-2018-form-a": "revising_editing_a",
  "pursuing-a-hobby-2017-2018-form-a": "revising_editing_a"
},
  passageSets: [
    readingPassage120172018FormAPassageSet,
    readingPassage220172018FormAPassageSet,
    readingPassage320172018FormAPassageSet,
    readingPassage420172018FormAPassageSet,
    readingPassage520172018FormAPassageSet,
    readingPassage620172018FormAPassageSet,
    unlockRideReturn20172018FormAPassageSet,
    pursuingAHobby20172018FormAPassageSet,
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
