import type { PracticeQuestion } from "../../types";

export const authorsPointOfViewEasyQuestions: PracticeQuestion[] = [
  {
    id: "pov-easy-1",
    difficulty: "easy",
    stimulus: "Our city should add protected bike lanes. They make streets safer for riders and encourage people to choose a cleaner form of transportation.",
    prompt: "What is the author's point of view?",
    choices: [
      { id: "A", text: "Bike lanes are too expensive to maintain." },
      { id: "B", text: "Protected bike lanes would benefit the city." },
      { id: "C", text: "Cars should be removed from every street." },
      { id: "D", text: "Most people dislike riding bicycles." },
    ],
    correctChoiceId: "B",
    explanation: "The author directly argues that protected bike lanes improve safety and transportation.",
  },
  {
    id: "pov-easy-2",
    difficulty: "easy",
    stimulus: "The new playground may be smaller, but its shaded benches, accessible ramps, and imaginative climbing wall make it a welcome improvement.",
    prompt: "How does the author view the new playground?",
    choices: [
      { id: "A", text: "Mostly positively" },
      { id: "B", text: "Completely negatively" },
      { id: "C", text: "With confusion" },
      { id: "D", text: "With no clear opinion" },
    ],
    correctChoiceId: "A",
    explanation: "The phrase 'welcome improvement' and the list of benefits reveal a positive view.",
  },
];
