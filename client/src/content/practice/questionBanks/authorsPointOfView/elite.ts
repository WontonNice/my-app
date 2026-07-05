import type { PracticeQuestion } from "../../types";

export const authorsPointOfViewEliteQuestions: PracticeQuestion[] = [
  {
    id: "pov-elite-1",
    difficulty: "elite",
    stimulus: "To dismiss the mural as decoration is to ignore the hands that painted it and the stories those hands preserved. Its colors are not an escape from history; they are an argument about who belongs in it.",
    prompt: "Which claim would the author most likely support?",
    choices: [
      { id: "A", text: "Public art can preserve and challenge historical narratives." },
      { id: "B", text: "Murals should use only historically accurate colors." },
      { id: "C", text: "Decoration has no place in serious artwork." },
      { id: "D", text: "Artists should avoid political subjects." },
    ],
    correctChoiceId: "A",
    explanation: "The author treats the mural as both preservation and an argument about inclusion in history.",
  },
];
