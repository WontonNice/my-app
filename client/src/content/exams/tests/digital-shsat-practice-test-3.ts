import { digitalShsatPracticeTest3MathSection } from "../mathSets/digital-shsat-practice-test-3Math";
import { excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet } from "../passageSets/excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3";
import { theReturnOfTheFerryDigitalShsatPracticeTest3PassageSet } from "../passageSets/the-return-of-the-ferry-digital-shsat-practice-test-3";
import { excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet } from "../passageSets/excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3";
import { theOrchardKeepsALedgerDigitalShsatPracticeTest3PassageSet } from "../passageSets/the-orchard-keeps-a-ledger-digital-shsat-practice-test-3";
import { sixtySummersOnKestrelGlacierDigitalShsatPracticeTest3PassageSet } from "../passageSets/sixty-summers-on-kestrel-glacier-digital-shsat-practice-test-3";
import { doverBeachDigitalShsatPracticeTest3PassageSet } from "../passageSets/dover-beach-digital-shsat-practice-test-3";
import { whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageSet } from "../passageSets/what-the-cube-taught-me-digital-shsat-practice-test-3";
import { getStandaloneItemsById } from "../standaloneItems";
import type { ExamContent } from "../types";

const selectedStandaloneItems = getStandaloneItemsById([
  "part-b-import-b44dc5773be7-9c6e5dcf",
  "part-b-import-06cbf355559e-5c52b8eb",
  "part-b-import-cc7d82dcf786-61f08277"
]);

export const digitalShsatPracticeTest3Content: ExamContent = {
  assessmentId: "digital-shsat-practice-test-3",
  title: "Digital SHSAT Practice Test 3",
  mathSection: digitalShsatPracticeTest3MathSection,
  passageSections: {
  "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3": "reading",
  "the-return-of-the-ferry-digital-shsat-practice-test-3": "reading",
  "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3": "reading",
  "the-orchard-keeps-a-ledger-digital-shsat-practice-test-3": "reading",
  "sixty-summers-on-kestrel-glacier-digital-shsat-practice-test-3": "reading",
  "dover-beach-digital-shsat-practice-test-3": "reading",
  "what-the-cube-taught-me-digital-shsat-practice-test-3": "revising_editing_a"
},
  passageSets: [
    excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet,
    theReturnOfTheFerryDigitalShsatPracticeTest3PassageSet,
    excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet,
    theOrchardKeepsALedgerDigitalShsatPracticeTest3PassageSet,
    sixtySummersOnKestrelGlacierDigitalShsatPracticeTest3PassageSet,
    doverBeachDigitalShsatPracticeTest3PassageSet,
    whatTheCubeTaughtMeDigitalShsatPracticeTest3PassageSet,
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
