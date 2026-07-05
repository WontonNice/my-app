import type { PracticeQuestion } from "../../types";

export const authorsPointOfViewHardQuestions: PracticeQuestion[] = [
  {
    id: "pov-hard-1",
    difficulty: "hard",
    stimulus: "The proposal is described as efficient because it shortens meetings. Efficiency, though, is a poor bargain if residents lose the chance to question decisions that affect their neighborhoods.",
    prompt: "What concern shapes the author's argument?",
    choices: [
      { id: "A", text: "Short meetings are difficult to schedule." },
      { id: "B", text: "Efficiency may be valued at the expense of public participation." },
      { id: "C", text: "Residents ask too many unrelated questions." },
      { id: "D", text: "Neighborhood decisions should be made privately." },
    ],
    correctChoiceId: "B",
    explanation: "The author questions a gain in speed when it reduces residents' ability to participate.",
  },
];
