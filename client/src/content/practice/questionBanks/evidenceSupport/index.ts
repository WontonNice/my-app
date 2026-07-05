import { evidenceSupportEasyQuestions } from "./easy";
import { evidenceSupportEliteQuestions } from "./elite";
import { evidenceSupportHardQuestions } from "./hard";
import { evidenceSupportMediumQuestions } from "./medium";

export const evidenceSupportQuestions = [
  ...evidenceSupportEasyQuestions,
  ...evidenceSupportMediumQuestions,
  ...evidenceSupportHardQuestions,
  ...evidenceSupportEliteQuestions,
];
