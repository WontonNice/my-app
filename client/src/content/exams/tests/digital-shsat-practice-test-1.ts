import { excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageSet } from "../passageSets/excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1";
import { excerptFromTheFixItSaturdaysPassageSet } from "../passageSets/excerpt-from-the-fix-it-saturdays";
import { excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageSet } from "../passageSets/excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1";

import type { ExamContent } from "../types";

export const digitalShsatPracticeTest1Content: ExamContent = {
  assessmentId: "digital-shsat-practice-test-1",
  title: "Digital SHSAT Practice Test 1",
  passageSections: {
  "excerpt-from-the-call-of-the-wild-digital-shsat-practice-test-1": "reading",
  "excerpt-from-the-fix-it-saturdays": "reading",
  "excerpt-from-narrative-of-the-life-of-frederick-douglass-digital-shsat-practice-test-1": "reading"
},
  passageSets: [
    excerptFromTheCallOfTheWildDigitalShsatPracticeTest1PassageSet,
    excerptFromTheFixItSaturdaysPassageSet,
    excerptFromNarrativeOfTheLifeOfFrederickDouglassDigitalShsatPracticeTest1PassageSet,
  ],
};
