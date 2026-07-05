import type { PracticeQuestion } from "../../types";

export const inferenceEliteQuestions: PracticeQuestion[] = [
  {
    id: "inference-elite-1", difficulty: "elite", stimulus: "The council member praised the proposal's ambition, then spent the remainder of her remarks asking who would fund it and maintain it after the first year.",
    prompt: "What can be inferred about her position?",
    choices: [{ id: "A", text: "She supports every detail without reservation." }, { id: "B", text: "She is interested but concerned about long-term feasibility." }, { id: "C", text: "She has not read the proposal." }, { id: "D", text: "She objects only to its goals." }],
    correctChoiceId: "B", explanation: "Her praise signals interest, while her sustained questions reveal practical concerns.",
  },
];
