export type PracticeDifficulty = "easy" | "medium" | "hard" | "elite";

export type PracticeChoice = {
  id: string;
  text: string;
};

export type PracticeQuestion = {
  choices: PracticeChoice[];
  correctChoiceId: string;
  difficulty: PracticeDifficulty;
  explanation: string;
  id: string;
  prompt: string;
  stimulus?: string;
};

export type PracticeTopic = {
  description: string;
  key: string;
  questionBank: PracticeQuestion[];
  slug: string;
  title: string;
};

