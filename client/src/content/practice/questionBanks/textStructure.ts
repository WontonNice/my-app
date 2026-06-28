import type { PracticeQuestion } from "../types";

export const textStructureQuestions: PracticeQuestion[] = [
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
  {
    id: "structure-hard-1", difficulty: "hard", stimulus: "The article begins with one family's crowded commute, then presents citywide transit data, and concludes with proposed schedule changes.",
    prompt: "Why does the author most likely begin with the family's experience?",
    choices: [{ id: "A", text: "To replace the need for factual evidence" }, { id: "B", text: "To give a human example of the broader issue" }, { id: "C", text: "To prove the family caused the problem" }, { id: "D", text: "To explain how schedules are printed" }],
    correctChoiceId: "B", explanation: "The individual example makes the larger data-based problem concrete and relatable.",
  },
  {
    id: "structure-elite-1", difficulty: "elite", stimulus: "After presenting the strongest argument against the policy, the writer examines its evidence and then identifies assumptions the argument cannot support.",
    prompt: "How does this structure strengthen the writer's position?",
    choices: [{ id: "A", text: "It avoids acknowledging opposing views." }, { id: "B", text: "It shows the writer can answer a serious counterargument." }, { id: "C", text: "It places all evidence in chronological order." }, { id: "D", text: "It proves assumptions are always incorrect." }],
    correctChoiceId: "B", explanation: "Addressing the strongest opposing view makes the response more credible and thorough.",
  },
];

