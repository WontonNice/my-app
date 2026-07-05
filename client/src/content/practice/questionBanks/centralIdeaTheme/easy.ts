import type { PracticeQuestion } from "../../types";

export const centralIdeaThemeEasyQuestions: PracticeQuestion[] = [
  {
    id: "central-easy-1",
    difficulty: "easy",
    stimulus: "Maya planted three tomato seedlings behind her apartment. She watered them each morning and checked their growth after school. By August, she had enough tomatoes to share with every family on her floor.",
    prompt: "Which statement best expresses the central idea?",
    choices: [
      { id: "A", text: "Tomatoes only grow well near apartment buildings." },
      { id: "B", text: "Patient care can produce something worth sharing." },
      { id: "C", text: "Maya preferred gardening to attending school." },
      { id: "D", text: "Every family should grow its own vegetables." },
    ],
    correctChoiceId: "B",
    explanation: "The passage focuses on Maya's steady care and the useful result she shares with others.",
  },
  {
    id: "central-easy-2",
    difficulty: "easy",
    stimulus: "The library's roof leaked whenever it rained. Neighbors held a weekend book sale, local businesses donated supplies, and volunteers repaired the roof together.",
    prompt: "Which theme is best supported by the passage?",
    choices: [
      { id: "A", text: "Community cooperation can solve a shared problem." },
      { id: "B", text: "Libraries should never sell their books." },
      { id: "C", text: "Rain causes more harm than people expect." },
      { id: "D", text: "Businesses are responsible for public buildings." },
    ],
    correctChoiceId: "A",
    explanation: "Several parts of the community contribute to one successful repair effort.",
  },
];
