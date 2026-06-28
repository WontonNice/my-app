import type { PracticeQuestion } from "../types";

export const figurativeLanguageImageryQuestions: PracticeQuestion[] = [
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
  {
    id: "figurative-medium-1", difficulty: "medium", stimulus: "Wind combed the wheat field, drawing long golden waves toward the road.",
    prompt: "What effect does the imagery create?",
    choices: [{ id: "A", text: "It makes the field seem orderly and gently moving." }, { id: "B", text: "It shows that the field has been damaged." }, { id: "C", text: "It explains how wheat is harvested." }, { id: "D", text: "It emphasizes the road's rough surface." }],
    correctChoiceId: "A", explanation: "The images of combing and waves create smooth, controlled movement.",
  },
  {
    id: "figurative-medium-2", difficulty: "medium", stimulus: "His apology arrived like an umbrella after the storm had passed.",
    prompt: "The simile suggests that the apology was",
    choices: [{ id: "A", text: "comforting and timely" }, { id: "B", text: "offered too late to help" }, { id: "C", text: "difficult to understand" }, { id: "D", text: "accepted immediately" }],
    correctChoiceId: "B", explanation: "An umbrella is no longer useful after the storm, just as the apology came too late.",
  },
  {
    id: "figurative-hard-1", difficulty: "hard", stimulus: "At dawn, the city shook sleep from its windows, one light at a time.",
    prompt: "How does the personification contribute to the sentence?",
    choices: [{ id: "A", text: "It presents the city as gradually waking." }, { id: "B", text: "It proves that an earthquake occurred." }, { id: "C", text: "It criticizes people who sleep late." }, { id: "D", text: "It compares windows to clocks." }],
    correctChoiceId: "A", explanation: "The city is given the human action of waking as lights appear gradually.",
  },
  {
    id: "figurative-elite-1", difficulty: "elite", stimulus: "The silence between them was not empty; it was a locked room, crowded with everything neither would say.",
    prompt: "The metaphor primarily emphasizes",
    choices: [{ id: "A", text: "their preference for quiet rooms." }, { id: "B", text: "the emotional weight of unspoken thoughts." }, { id: "C", text: "their inability to hear each other." }, { id: "D", text: "the physical distance between them." }],
    correctChoiceId: "B", explanation: "The crowded locked room represents many important feelings that remain unspoken.",
  },
];

