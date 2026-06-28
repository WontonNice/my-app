import type { PracticeQuestion } from "../types";

export const wordPhraseMeaningQuestions: PracticeQuestion[] = [
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
  {
    id: "words-hard-1", difficulty: "hard",
    stimulus: "The scientist offered a qualified endorsement, praising the early results while warning that more trials were needed.",
    prompt: "The phrase qualified endorsement suggests approval that is",
    choices: [{ id: "A", text: "enthusiastic and complete" }, { id: "B", text: "limited by conditions" }, { id: "C", text: "unrelated to evidence" }, { id: "D", text: "intended as criticism" }],
    correctChoiceId: "B", explanation: "The praise is limited by a warning that more evidence is still needed.",
  },
  {
    id: "words-elite-1", difficulty: "elite",
    stimulus: "Her account of the expedition is spare, but its restraint makes each sudden danger more vivid.",
    prompt: "In this context, spare most nearly describes writing that is",
    choices: [{ id: "A", text: "generous with praise" }, { id: "B", text: "brief and without excess" }, { id: "C", text: "careless and unfinished" }, { id: "D", text: "fictional rather than factual" }],
    correctChoiceId: "B", explanation: "The reference to restraint shows that the account uses few, carefully chosen details.",
  },
];

