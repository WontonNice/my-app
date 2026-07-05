import { authorsPointOfViewEasyQuestions } from "./easy";
import { authorsPointOfViewEliteQuestions } from "./elite";
import { authorsPointOfViewHardQuestions } from "./hard";
import { authorsPointOfViewMediumQuestions } from "./medium";

export const authorsPointOfViewQuestions = [
  ...authorsPointOfViewEasyQuestions,
  ...authorsPointOfViewMediumQuestions,
  ...authorsPointOfViewHardQuestions,
  ...authorsPointOfViewEliteQuestions,
];
