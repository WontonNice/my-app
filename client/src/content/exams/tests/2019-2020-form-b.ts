import { content20192020FormBMathSection } from "../mathSets/2019-2020-form-bMath";
import { theBestLaidPlansOfRavens20192020FormBPassageSet } from "../passageSets/the-best-laid-plans-of-ravens-2019-2020-form-b";
import { lookingForTheSmallestSparkOfEverything20192020FormBPassageSet } from "../passageSets/looking-for-the-smallest-spark-of-everything-2019-2020-form-b";
import { excerptFromTheSpiritOfTheHerd20192020FormBPassageSet } from "../passageSets/excerpt-from-the-spirit-of-the-herd-2019-2020-form-b";
import { aMemoryRevolution20192020FormBPassageSet } from "../passageSets/a-memory-revolution-2019-2020-form-b";
import { serpentMound20192020FormBPassageSet } from "../passageSets/serpent-mound-2019-2020-form-b";
import { massachusettsLowellNationalHistoricalPark20192020FormBPassageSet } from "../passageSets/massachusetts-lowell-national-historical-park-2019-2020-form-b";
import { martialArtsForTheMindAndBody20192020FormBPassageSet } from "../passageSets/martial-arts-for-the-mind-and-body-2019-2020-form-b";

import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-9d14715150af-39798b2c",
  "part-b-import-a6c479c6476d-70d39721",
  "part-b-import-bbccdcd22a0c-c496117b"
]);

export const content20192020FormBContent: ExamContent = {
  mathSection: content20192020FormBMathSection,
  assessmentId: "2019-2020-form-b",
  title: "2019-2020 Form B",
  passageSections: {
  "the-best-laid-plans-of-ravens-2019-2020-form-b": "reading",
  "looking-for-the-smallest-spark-of-everything-2019-2020-form-b": "reading",
  "excerpt-from-the-spirit-of-the-herd-2019-2020-form-b": "reading",
  "a-memory-revolution-2019-2020-form-b": "reading",
  "serpent-mound-2019-2020-form-b": "reading",
  "massachusetts-lowell-national-historical-park-2019-2020-form-b": "reading",
  "martial-arts-for-the-mind-and-body-2019-2020-form-b": "revising_editing_a"
},
  passageSets: [
    theBestLaidPlansOfRavens20192020FormBPassageSet,
    lookingForTheSmallestSparkOfEverything20192020FormBPassageSet,
    excerptFromTheSpiritOfTheHerd20192020FormBPassageSet,
    aMemoryRevolution20192020FormBPassageSet,
    serpentMound20192020FormBPassageSet,
    massachusettsLowellNationalHistoricalPark20192020FormBPassageSet,
    martialArtsForTheMindAndBody20192020FormBPassageSet,
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
