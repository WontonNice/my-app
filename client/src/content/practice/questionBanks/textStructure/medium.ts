import type { PracticeQuestion } from "../../types";

export const textStructureMediumQuestions: PracticeQuestion[] = [
  {
    id: "structure-medium-1", difficulty: "medium", stimulus: "The school garden dried out over long weekends. Students solved the problem by building a slow-drip watering system from reused bottles.",
    prompt: "How is the passage organized?",
    choices: [{ id: "A", text: "A claim followed by a counterclaim" }, { id: "B", text: "A problem followed by its solution" }, { id: "C", text: "Events in order of importance" }, { id: "D", text: "Two objects compared" }],
    correctChoiceId: "B", explanation: "The dry garden is the problem and the watering system is the solution.",
  },
  {
    id: "structure-medium-2", difficulty: "medium", stimulus: "Warm ocean water adds energy to a hurricane. As a result, storms can strengthen rapidly before reaching land.",
    prompt: "What relationship does the structure emphasize?",
    choices: [{ id: "A", text: "Cause and effect" }, { id: "B", text: "Similarity" }, { id: "C", text: "A series of instructions" }, { id: "D", text: "A question with several answers" }],
    correctChoiceId: "A", explanation: "Warm water is presented as a cause of rapid storm strengthening.",
  },
];
