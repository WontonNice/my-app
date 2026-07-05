import type { PracticeQuestion } from "../../types";

export const wordPhraseMeaningHardQuestions: PracticeQuestion[] = [
  {
    id: "words-hard-1", difficulty: "hard",
    stimulus: "The scientist offered a qualified endorsement, praising the early results while warning that more trials were needed.",
    prompt: "The phrase qualified endorsement suggests approval that is",
    choices: [{ id: "A", text: "enthusiastic and complete" }, { id: "B", text: "limited by conditions" }, { id: "C", text: "unrelated to evidence" }, { id: "D", text: "intended as criticism" }],
    correctChoiceId: "B", explanation: "The praise is limited by a warning that more evidence is still needed.",
  },
];
