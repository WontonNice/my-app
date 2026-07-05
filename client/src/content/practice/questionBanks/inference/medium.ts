import type { PracticeQuestion } from "../../types";

export const inferenceMediumQuestions: PracticeQuestion[] = [
  {
    id: "inference-medium-1", difficulty: "medium", stimulus: "When the principal announced a surprise assembly, Nia slipped the folded speech deeper into her backpack and smiled at her friend.",
    prompt: "What is most likely true?",
    choices: [{ id: "A", text: "Nia may already know why the assembly was called." }, { id: "B", text: "Nia wants to avoid her friend." }, { id: "C", text: "The principal lost a speech." }, { id: "D", text: "Nia plans to skip the assembly." }],
    correctChoiceId: "A", explanation: "Her prepared speech and knowing smile suggest prior knowledge of the assembly.",
  },
  {
    id: "inference-medium-2", difficulty: "medium", stimulus: "The cafe owner replaced the large communal tables with smaller ones after noticing that customers often worked alone on laptops.",
    prompt: "What can be inferred about the owner's decision?",
    choices: [{ id: "A", text: "It responds to how customers use the space." }, { id: "B", text: "It is intended to stop customers from working." }, { id: "C", text: "It will reduce the number of menu items." }, { id: "D", text: "It was required by law." }],
    correctChoiceId: "A", explanation: "The change follows the owner's observation that many customers sit and work individually.",
  },
];
