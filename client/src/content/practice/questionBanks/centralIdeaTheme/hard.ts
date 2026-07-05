import type { PracticeQuestion } from "../../types";

export const centralIdeaThemeHardQuestions: PracticeQuestion[] = [
  {
    id: "central-hard-1",
    difficulty: "hard",
    stimulus: "Nora had crossed the footbridge daily without noticing the names carved into its railing. After the bridge was damaged, she joined the restoration team and learned that each name belonged to a worker who had built it a century earlier.",
    prompt: "Which idea is most fully developed?",
    choices: [
      { id: "A", text: "Familiar places can contain histories people overlook." },
      { id: "B", text: "Modern bridges are safer than historic bridges." },
      { id: "C", text: "Restoration work should only be done by experts." },
      { id: "D", text: "People carve names because they want attention." },
    ],
    correctChoiceId: "A",
    explanation: "Nora discovers hidden history in an ordinary place only after becoming involved in preserving it.",
  },
];
