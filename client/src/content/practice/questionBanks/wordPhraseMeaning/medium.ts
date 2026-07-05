import type { PracticeQuestion } from "../../types";

export const wordPhraseMeaningMediumQuestions: PracticeQuestion[] = [
  {
    id: "words-medium-1", difficulty: "medium",
    stimulus: "The coach's brief compliment buoyed Lena through the difficult final lap.",
    prompt: "The word buoyed most nearly means",
    choices: [{ id: "A", text: "distracted" }, { id: "B", text: "encouraged" }, { id: "C", text: "confused" }, { id: "D", text: "slowed" }],
    correctChoiceId: "B", explanation: "The compliment helps Lena continue through difficulty, so it encouraged her.",
  },
  {
    id: "words-medium-2", difficulty: "medium",
    stimulus: "The mayor called the repairs a temporary remedy, not a permanent solution to the flooding.",
    prompt: "As used here, remedy refers to",
    choices: [{ id: "A", text: "a proposed law" }, { id: "B", text: "a cause of damage" }, { id: "C", text: "a way of correcting a problem" }, { id: "D", text: "a public complaint" }],
    correctChoiceId: "C", explanation: "The repairs address the flooding problem, although only temporarily.",
  },
];
