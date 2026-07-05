import { textStructureEasyQuestions } from "./easy";
import { textStructureEliteQuestions } from "./elite";
import { textStructureHardQuestions } from "./hard";
import { textStructureMediumQuestions } from "./medium";

export const textStructureQuestions = [
  ...textStructureEasyQuestions,
  ...textStructureMediumQuestions,
  ...textStructureHardQuestions,
  ...textStructureEliteQuestions,
];
