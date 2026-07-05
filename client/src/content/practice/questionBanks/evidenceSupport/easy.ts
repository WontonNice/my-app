import type { PracticeQuestion } from "../../types";

export const evidenceSupportEasyQuestions: PracticeQuestion[] = [
  {
    id: "evidence-easy-1", difficulty: "easy", stimulus: "Bees communicate the location of flowers through movements called waggle dances.",
    prompt: "Which detail best supports the claim that bees share useful information?",
    choices: [{ id: "A", text: "Bees have six legs." }, { id: "B", text: "A dance can show other bees the direction and distance to food." }, { id: "C", text: "Many flowers bloom in spring." }, { id: "D", text: "Beehives contain wax." }],
    correctChoiceId: "B", explanation: "The detail directly explains what useful location information the dance provides.",
  },
  {
    id: "evidence-easy-2", difficulty: "easy", stimulus: "Luis became more confident as the season continued.",
    prompt: "Which detail would best support the statement?",
    choices: [{ id: "A", text: "He practiced on Tuesdays." }, { id: "B", text: "He volunteered to take the final shot in the championship game." }, { id: "C", text: "His uniform was blue." }, { id: "D", text: "The team traveled by bus." }],
    correctChoiceId: "B", explanation: "Volunteering for a high-pressure shot is clear evidence of increased confidence.",
  },
];
