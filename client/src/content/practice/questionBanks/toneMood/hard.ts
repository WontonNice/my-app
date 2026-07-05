import type { PracticeQuestion } from "../../types";

export const toneMoodHardQuestions: PracticeQuestion[] = [
  {
    id: "tone-hard-1", difficulty: "hard", stimulus: "The report describes the river as 'technically usable,' a phrase that offers little comfort to families who once swam there.",
    prompt: "The author's tone toward the report is",
    choices: [{ id: "A", text: "approving" }, { id: "B", text: "skeptical" }, { id: "C", text: "indifferent" }, { id: "D", text: "playful" }],
    correctChoiceId: "B", explanation: "The author questions whether the report's cautious language reflects the river's real condition.",
  },
];
