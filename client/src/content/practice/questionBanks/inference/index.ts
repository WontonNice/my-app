import { inferenceEasyQuestions } from "./easy";
import { inferenceEliteQuestions } from "./elite";
import { inferenceHardQuestions } from "./hard";
import { inferenceMediumQuestions } from "./medium";

export const inferenceQuestions = [
  ...inferenceEasyQuestions,
  ...inferenceMediumQuestions,
  ...inferenceHardQuestions,
  ...inferenceEliteQuestions,
];
