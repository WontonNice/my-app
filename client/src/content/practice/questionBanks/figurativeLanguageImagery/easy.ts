import type { PracticeQuestion } from "../../types";

export const figurativeLanguageImageryEasyQuestions: PracticeQuestion[] = [
  {
    id: "figurative-easy-1", difficulty: "easy", stimulus: "The moon was a silver coin resting on the dark table of the sky.",
    prompt: "Which literary device is used?",
    choices: [{ id: "A", text: "Metaphor" }, { id: "B", text: "Alliteration" }, { id: "C", text: "Hyperbole" }, { id: "D", text: "Onomatopoeia" }],
    correctChoiceId: "A", explanation: "The moon is directly compared to a silver coin without using like or as.",
  },
  {
    id: "figurative-easy-2", difficulty: "easy", stimulus: "The tired floorboards groaned beneath our feet.",
    prompt: "The sentence uses personification by describing the floorboards as",
    choices: [{ id: "A", text: "old" }, { id: "B", text: "wooden" }, { id: "C", text: "able to groan from tiredness" }, { id: "D", text: "located beneath feet" }],
    correctChoiceId: "C", explanation: "Tiredness and groaning are human qualities given to the floorboards.",
  },
];
