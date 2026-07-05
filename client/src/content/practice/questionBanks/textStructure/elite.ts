import type { PracticeQuestion } from "../../types";

export const textStructureEliteQuestions: PracticeQuestion[] = [
  {
    id: "structure-elite-1", difficulty: "elite", stimulus: "After presenting the strongest argument against the policy, the writer examines its evidence and then identifies assumptions the argument cannot support.",
    prompt: "How does this structure strengthen the writer's position?",
    choices: [{ id: "A", text: "It avoids acknowledging opposing views." }, { id: "B", text: "It shows the writer can answer a serious counterargument." }, { id: "C", text: "It places all evidence in chronological order." }, { id: "D", text: "It proves assumptions are always incorrect." }],
    correctChoiceId: "B", explanation: "Addressing the strongest opposing view makes the response more credible and thorough.",
  },
];
