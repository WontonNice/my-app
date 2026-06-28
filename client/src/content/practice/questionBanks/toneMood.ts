import type { PracticeQuestion } from "../types";

export const toneMoodQuestions: PracticeQuestion[] = [
  {
    id: "tone-easy-1", difficulty: "easy", stimulus: "At last, the doors opened, and sunlight poured across the stage as the audience rose cheering.",
    prompt: "Which mood does the sentence create?",
    choices: [{ id: "A", text: "Joyful" }, { id: "B", text: "Threatening" }, { id: "C", text: "Lonely" }, { id: "D", text: "Confused" }],
    correctChoiceId: "A", explanation: "Sunlight, cheering, and a standing audience create a joyful mood.",
  },
  {
    id: "tone-easy-2", difficulty: "easy", stimulus: "The author calls the tiny robot 'a clever helper that never complains.'",
    prompt: "The author's tone is best described as",
    choices: [{ id: "A", text: "admiring" }, { id: "B", text: "angry" }, { id: "C", text: "fearful" }, { id: "D", text: "formal" }],
    correctChoiceId: "A", explanation: "The positive words 'clever helper' reveal admiration.",
  },
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
  {
    id: "tone-hard-1", difficulty: "hard", stimulus: "The report describes the river as 'technically usable,' a phrase that offers little comfort to families who once swam there.",
    prompt: "The author's tone toward the report is",
    choices: [{ id: "A", text: "approving" }, { id: "B", text: "skeptical" }, { id: "C", text: "indifferent" }, { id: "D", text: "playful" }],
    correctChoiceId: "B", explanation: "The author questions whether the report's cautious language reflects the river's real condition.",
  },
  {
    id: "tone-elite-1", difficulty: "elite", stimulus: "The mansion still displayed its chandeliers, though dust had softened their brilliance and vines had begun their patient climb across the doors.",
    prompt: "The mood is primarily",
    choices: [{ id: "A", text: "triumphant" }, { id: "B", text: "melancholy" }, { id: "C", text: "frantic" }, { id: "D", text: "comic" }],
    correctChoiceId: "B", explanation: "Former grandeur fading beneath dust and vines creates a melancholy mood.",
  },
];
