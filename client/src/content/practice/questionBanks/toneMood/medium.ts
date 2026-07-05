import type { PracticeQuestion } from "../../types";

export const toneMoodMediumQuestions: PracticeQuestion[] = [
  {
    id: "tone-medium-1", difficulty: "medium", stimulus: "The sign promised a scenic shortcut. Two hours and three muddy hills later, we began to question its definition of scenic.",
    prompt: "The tone is best described as",
    choices: [{ id: "A", text: "solemn" }, { id: "B", text: "gently sarcastic" }, { id: "C", text: "deeply frightened" }, { id: "D", text: "scientific" }],
    correctChoiceId: "B", explanation: "The final comment humorously questions the misleading sign.",
  },
  {
    id: "tone-medium-2", difficulty: "medium", stimulus: "One by one, the hallway lights clicked off behind Mina. The elevator button refused to glow.",
    prompt: "Which mood is created?",
    choices: [{ id: "A", text: "Suspenseful" }, { id: "B", text: "Celebratory" }, { id: "C", text: "Peaceful" }, { id: "D", text: "Nostalgic" }],
    correctChoiceId: "A", explanation: "Darkening lights and a failed elevator create uncertainty and suspense.",
  },
];
