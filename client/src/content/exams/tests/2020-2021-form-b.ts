import { massachusettsLowellNationalHistoricalPark20202021FormBPassageSet } from "../passageSets/massachusetts-lowell-national-historical-park-2020-2021-form-b";
import { excerptFromATrampAbroad20202021ShsatSampleTestFormBPassageSet } from "../passageSets/excerpt-from-a-tramp-abroad-2020-2021-shsat-sample-test-form-b";
import { usingFireToKeepAPrairieHealthy20202021FormBPassageSet } from "../passageSets/using-fire-to-keep-a-prairie-healthy-2020-2021-form-b";
import { crossPurposesFormBPassageSet } from "../passageSets/cross-purposes-form-b";
import { excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet } from "../passageSets/excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b";
import { excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet } from "../passageSets/excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b";
import { theFreeCollegeDebate20202021FormBPassageSet } from "../passageSets/the-free-college-debate-2020-2021-form-b";
import { content20202021FormBMathSection } from "../mathSets/2020-2021-form-bMath";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-4918f97e972b-078ff032",
  "part-b-import-9c2f067e7c86-17e7d0e4",
  "part-b-import-2462ba9281da-812fa1d4",
  "part-b-import-a90ecb961d8a-f9bf88c1"
]);

export const content20202021FormBContent: ExamContent = {
  assessmentId: "2020-2021-form-b",
  title: "2020-2021 Form B",
  mathSection: content20202021FormBMathSection,
  passageSections: {
  "massachusetts-lowell-national-historical-park-2020-2021-form-b": "reading",
  "excerpt-from-a-tramp-abroad-2020-2021-shsat-sample-test-form-b": "reading",
  "using-fire-to-keep-a-prairie-healthy-2020-2021-form-b": "reading",
  "cross-purposes-form-b": "reading",
  "excerpt-from-impressions-of-an-indian-childhood-2020-2021-shsat-sample-test-form-b": "reading",
  "excerpt-from-niagara-falls-2020-2021-shsat-sample-test-form-b": "reading",
  "the-free-college-debate-2020-2021-form-b": "revising_editing_a"
},
  passageSets: [
    massachusettsLowellNationalHistoricalPark20202021FormBPassageSet,
    excerptFromATrampAbroad20202021ShsatSampleTestFormBPassageSet,
    usingFireToKeepAPrairieHealthy20202021FormBPassageSet,
    crossPurposesFormBPassageSet,
    excerptFromImpressionsOfAnIndianChildhood20202021ShsatSampleTestFormBPassageSet,
    excerptFromNiagaraFalls20202021ShsatSampleTestFormBPassageSet,
    theFreeCollegeDebate20202021FormBPassageSet,
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
