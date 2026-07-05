import type { PracticeQuestion } from "../../types";

export const wordPhraseMeaningEliteQuestions: PracticeQuestion[] = [
  {
    id: "words-elite-1", difficulty: "elite",
    stimulus: "Her account of the expedition is spare, but its restraint makes each sudden danger more vivid.",
    prompt: "In this context, spare most nearly describes writing that is",
    choices: [{ id: "A", text: "generous with praise" }, { id: "B", text: "brief and without excess" }, { id: "C", text: "careless and unfinished" }, { id: "D", text: "fictional rather than factual" }],
    correctChoiceId: "B", explanation: "The reference to restraint shows that the account uses few, carefully chosen details.",
  },
];
