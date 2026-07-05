import type { PracticeQuestion } from "../../types";

export const figurativeLanguageImageryMediumQuestions: PracticeQuestion[] = [
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
];
