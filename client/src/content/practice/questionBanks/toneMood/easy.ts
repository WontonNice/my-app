import type { PracticeQuestion } from "../../types";

export const toneMoodEasyQuestions: PracticeQuestion[] = [
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
];
