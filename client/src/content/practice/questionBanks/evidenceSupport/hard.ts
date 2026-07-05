import type { PracticeQuestion } from "../../types";

export const evidenceSupportHardQuestions: PracticeQuestion[] = [
  {
    id: "evidence-hard-1", difficulty: "hard", stimulus: "The researcher claims the birds adjusted their behavior based on changing conditions rather than repeating a memorized action.",
    prompt: "Which result best supports the claim?",
    choices: [{ id: "A", text: "The birds repeated one action after receiving food." }, { id: "B", text: "The birds chose different tools when the opening changed size." }, { id: "C", text: "The birds were tested in the morning." }, { id: "D", text: "Several birds had similar markings." }],
    correctChoiceId: "B", explanation: "Changing tools in response to a new opening shows flexible adjustment.",
  },
];
