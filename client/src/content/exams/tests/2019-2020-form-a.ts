import { aMiracleMile20192020FormAPassageSet } from "../passageSets/a-miracle-mile-2019-2020-form-a";
import { odeToFireworks20192020FormAPassageSet } from "../passageSets/ode-to-fireworks-2019-2020-form-a";
import { excerptFromResearchRiddleResolved20192020FormAPassageSet } from "../passageSets/excerpt-from-research-riddle-resolved-2019-2020-form-a";
import { excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet } from "../passageSets/excerpt-from-how-we-made-the-first-flight-2019-2020-form-a";
import { excerptFromInSearchOfTheUnknown20192020FormAPassageSet } from "../passageSets/excerpt-from-in-search-of-the-unknown-2019-2020-form-a";
import { isItTimeForTermLimits20192020FormAPassageSet } from "../passageSets/is-it-time-for-term-limits-2019-2020-form-a";
import { crackingTheCode20192020FormAPassageSet } from "../passageSets/cracking-the-code-2019-2020-form-a";
import { content20192020FormAMathSection } from "../mathSets/2019-2020-form-aMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-question-7",
  "part-b-import-be14ccff9e7a-6d3f6f8f",
  "part-b-import-7651e03756f2-ba433486",
  "part-b-question-5"
]);

export const content20192020FormAContent: ExamContent = {
  assessmentId: "2019-2020-form-a",
  title: "2019-2020 Form A",
  mathSection: content20192020FormAMathSection,
  passageSections: {
  "a-miracle-mile-2019-2020-form-a": "reading",
  "ode-to-fireworks-2019-2020-form-a": "reading",
  "excerpt-from-research-riddle-resolved-2019-2020-form-a": "reading",
  "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a": "reading",
  "excerpt-from-in-search-of-the-unknown-2019-2020-form-a": "reading",
  "is-it-time-for-term-limits-2019-2020-form-a": "reading",
  "cracking-the-code-2019-2020-form-a": "revising_editing_a"
},
  passageSets: [
    aMiracleMile20192020FormAPassageSet,
    odeToFireworks20192020FormAPassageSet,
    excerptFromResearchRiddleResolved20192020FormAPassageSet,
    excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet,
    excerptFromInSearchOfTheUnknown20192020FormAPassageSet,
    isItTimeForTermLimits20192020FormAPassageSet,
    crackingTheCode20192020FormAPassageSet,
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
