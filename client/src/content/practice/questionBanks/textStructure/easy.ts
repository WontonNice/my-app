import type { PracticeQuestion } from "../../types";

export const textStructureEasyQuestions: PracticeQuestion[] = [
  {
    id: "structure-easy-1", difficulty: "easy", stimulus: "First, rinse the rice. Next, add it to boiling water. Finally, lower the heat and cover the pot.",
    prompt: "Which structure organizes the text?",
    choices: [{ id: "A", text: "Sequence" }, { id: "B", text: "Cause and effect" }, { id: "C", text: "Compare and contrast" }, { id: "D", text: "Problem and solution" }],
    correctChoiceId: "A", explanation: "Signal words such as first, next, and finally arrange steps in order.",
  },
  {
    id: "structure-easy-2", difficulty: "easy", stimulus: "Unlike frogs, which have smooth skin, toads usually have dry, bumpy skin. Both animals, however, are amphibians.",
    prompt: "Which text structure is used?",
    choices: [{ id: "A", text: "Description" }, { id: "B", text: "Compare and contrast" }, { id: "C", text: "Chronological order" }, { id: "D", text: "Question and answer" }],
    correctChoiceId: "B", explanation: "The text explains a difference and a similarity between frogs and toads.",
  },
];
