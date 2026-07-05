import type { PracticeQuestion } from "../../types";

export const figurativeLanguageImageryHardQuestions: PracticeQuestion[] = [
  {
    id: "figurative-hard-1", difficulty: "hard", stimulus: "At dawn, the city shook sleep from its windows, one light at a time.",
    prompt: "How does the personification contribute to the sentence?",
    choices: [{ id: "A", text: "It presents the city as gradually waking." }, { id: "B", text: "It proves that an earthquake occurred." }, { id: "C", text: "It criticizes people who sleep late." }, { id: "D", text: "It compares windows to clocks." }],
    correctChoiceId: "A", explanation: "The city is given the human action of waking as lights appear gradually.",
  },
];
