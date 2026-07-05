import { wordPhraseMeaningEasyQuestions } from "./easy";
import { wordPhraseMeaningEliteQuestions } from "./elite";
import { wordPhraseMeaningHardQuestions } from "./hard";
import { wordPhraseMeaningMediumQuestions } from "./medium";

export const wordPhraseMeaningQuestions = [
  ...wordPhraseMeaningEasyQuestions,
  ...wordPhraseMeaningMediumQuestions,
  ...wordPhraseMeaningHardQuestions,
  ...wordPhraseMeaningEliteQuestions,
];
