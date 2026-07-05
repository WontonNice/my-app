import type { PracticeQuestion } from "../../types";

export const wordPhraseMeaningEasyQuestions: PracticeQuestion[] = [
  {
    id: "words-easy-1", difficulty: "easy",
    stimulus: "The puppy was reluctant to step into the rain, pausing beneath the doorway until its owner called.",
    prompt: "As used in the sentence, reluctant most nearly means",
    choices: [{ id: "A", text: "eager" }, { id: "B", text: "unwilling" }, { id: "C", text: "unable" }, { id: "D", text: "excited" }],
    correctChoiceId: "B", explanation: "The puppy pauses and needs encouragement, showing that it is unwilling or hesitant.",
  },
  {
    id: "words-easy-2", difficulty: "easy",
    stimulus: "After hours of debate, the committee reached a unanimous decision; every member voted yes.",
    prompt: "What does unanimous mean in this context?",
    choices: [{ id: "A", text: "Made quickly" }, { id: "B", text: "Kept secret" }, { id: "C", text: "Agreed upon by everyone" }, { id: "D", text: "Likely to change" }],
    correctChoiceId: "C", explanation: "The clue 'every member voted yes' shows complete agreement.",
  },
];
