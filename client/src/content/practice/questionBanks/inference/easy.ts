import type { PracticeQuestion } from "../../types";

export const inferenceEasyQuestions: PracticeQuestion[] = [
  {
    id: "inference-easy-1", difficulty: "easy", stimulus: "Jada entered the kitchen, saw flour on every counter, and heard the smoke alarm chirping. Her brother stood beside a lopsided cake.",
    prompt: "What can the reader infer?",
    choices: [{ id: "A", text: "Jada's brother has been baking." }, { id: "B", text: "The family is moving." }, { id: "C", text: "Jada dislikes cake." }, { id: "D", text: "The kitchen was recently painted." }],
    correctChoiceId: "A", explanation: "The flour, alarm, and cake together imply that her brother has been baking.",
  },
  {
    id: "inference-easy-2", difficulty: "easy", stimulus: "Omar checked the clock twice, packed his notes, and chose a seat near the door before the bell rang.",
    prompt: "The reader can infer that Omar",
    choices: [{ id: "A", text: "plans to leave quickly." }, { id: "B", text: "forgot where class meets." }, { id: "C", text: "does not own a clock." }, { id: "D", text: "wants to sit near the teacher." }],
    correctChoiceId: "A", explanation: "Watching the time, packing early, and sitting by the door suggest he expects to leave quickly.",
  },
];
