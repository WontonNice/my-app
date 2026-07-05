import type { PracticeQuestion } from "../../types";

export const toneMoodEliteQuestions: PracticeQuestion[] = [
  {
    id: "tone-elite-1", difficulty: "elite", stimulus: "The mansion still displayed its chandeliers, though dust had softened their brilliance and vines had begun their patient climb across the doors.",
    prompt: "The mood is primarily",
    choices: [{ id: "A", text: "triumphant" }, { id: "B", text: "melancholy" }, { id: "C", text: "frantic" }, { id: "D", text: "comic" }],
    correctChoiceId: "B", explanation: "Former grandeur fading beneath dust and vines creates a melancholy mood.",
  },
];
