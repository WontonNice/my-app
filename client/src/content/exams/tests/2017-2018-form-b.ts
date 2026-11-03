import { content20172018FormBMathSection } from "../mathSets/2017-2018-form-bMath";
import { readingPassage120172018FormBPassageSet } from "../passageSets/reading-passage-1-2017-2018-form-b";
import { readingPassage220172018FormBPassageSet } from "../passageSets/reading-passage-2-2017-2018-form-b";
import { readingPassage320172018FormBPassageSet } from "../passageSets/reading-passage-3-2017-2018-form-b";
import { readingPassage420172018FormBPassageSet } from "../passageSets/reading-passage-4-2017-2018-form-b";
import { readingPassage520172018FormBPassageSet } from "../passageSets/reading-passage-5-2017-2018-form-b";
import { readingPassage620172018FormBPassageSet } from "../passageSets/reading-passage-6-2017-2018-form-b";
import { theLocalLibrary20172018FormBPassageSet } from "../passageSets/the-local-library-2017-2018-form-b";
import { movingThroughMountains20172018FormBPassageSet } from "../passageSets/moving-through-mountains-2017-2018-form-b";

import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-d51ef5a4da25-097e5f95",
  "part-b-import-98dc205aa3e8-2094d5e0",
  "part-b-import-54658f33bda8-f23b8b56",
  "part-b-import-5491bf3aee6b-dca7c6a1",
  "part-b-import-113c673c387b-c66e9563"
]);

export const content20172018FormBContent: ExamContent = {
  mathSection: content20172018FormBMathSection,
  assessmentId: "2017-2018-form-b",
  title: "2017-2018 Form B",
  passageSections: {
  "reading-passage-1-2017-2018-form-b": "reading",
  "reading-passage-2-2017-2018-form-b": "reading",
  "reading-passage-3-2017-2018-form-b": "reading",
  "reading-passage-4-2017-2018-form-b": "reading",
  "reading-passage-5-2017-2018-form-b": "reading",
  "reading-passage-6-2017-2018-form-b": "reading",
  "the-local-library-2017-2018-form-b": "revising_editing_a",
  "moving-through-mountains-2017-2018-form-b": "revising_editing_a"
},
  passageSets: [
    readingPassage120172018FormBPassageSet,
    readingPassage220172018FormBPassageSet,
    readingPassage320172018FormBPassageSet,
    readingPassage420172018FormBPassageSet,
    readingPassage520172018FormBPassageSet,
    readingPassage620172018FormBPassageSet,
    theLocalLibrary20172018FormBPassageSet,
    movingThroughMountains20172018FormBPassageSet,
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
