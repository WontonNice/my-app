import { toneMoodEasyQuestions } from "./easy";
import { toneMoodEliteQuestions } from "./elite";
import { toneMoodHardQuestions } from "./hard";
import { toneMoodMediumQuestions } from "./medium";

export const toneMoodQuestions = [
  ...toneMoodEasyQuestions,
  ...toneMoodMediumQuestions,
  ...toneMoodHardQuestions,
  ...toneMoodEliteQuestions,
];
