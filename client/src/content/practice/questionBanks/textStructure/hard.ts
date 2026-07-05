import type { PracticeQuestion } from "../../types";

export const textStructureHardQuestions: PracticeQuestion[] = [
  {
    id: "structure-hard-1", difficulty: "hard", stimulus: "The article begins with one family's crowded commute, then presents citywide transit data, and concludes with proposed schedule changes.",
    prompt: "Why does the author most likely begin with the family's experience?",
    choices: [{ id: "A", text: "To replace the need for factual evidence" }, { id: "B", text: "To give a human example of the broader issue" }, { id: "C", text: "To prove the family caused the problem" }, { id: "D", text: "To explain how schedules are printed" }],
    correctChoiceId: "B", explanation: "The individual example makes the larger data-based problem concrete and relatable.",
  },
];
