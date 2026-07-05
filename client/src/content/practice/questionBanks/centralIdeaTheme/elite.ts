import type { PracticeQuestion } from "../../types";

export const centralIdeaThemeEliteQuestions: PracticeQuestion[] = [
  {
    id: "central-elite-1",
    difficulty: "elite",
    stimulus: "The inventor's first seven prototypes failed publicly. Each time, newspapers mocked the machine, yet each failure revealed a weakness she could correct. Her eighth model crossed the harbor without stopping.",
    prompt: "Which theme is conveyed through the structure of the passage?",
    choices: [
      { id: "A", text: "Public praise is necessary for invention." },
      { id: "B", text: "Repeated failure can provide information needed for success." },
      { id: "C", text: "Newspapers rarely understand scientific work." },
      { id: "D", text: "The simplest machines are the most dependable." },
    ],
    correctChoiceId: "B",
    explanation: "The sequence of failures followed by success shows how each setback contributed to improvement.",
  },
];
