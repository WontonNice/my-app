import type { PracticeQuestion } from "../types";

export const inferenceQuestions: PracticeQuestion[] = [
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
  {
    id: "inference-medium-1", difficulty: "medium", stimulus: "When the principal announced a surprise assembly, Nia slipped the folded speech deeper into her backpack and smiled at her friend.",
    prompt: "What is most likely true?",
    choices: [{ id: "A", text: "Nia may already know why the assembly was called." }, { id: "B", text: "Nia wants to avoid her friend." }, { id: "C", text: "The principal lost a speech." }, { id: "D", text: "Nia plans to skip the assembly." }],
    correctChoiceId: "A", explanation: "Her prepared speech and knowing smile suggest prior knowledge of the assembly.",
  },
  {
    id: "inference-medium-2", difficulty: "medium", stimulus: "The cafe owner replaced the large communal tables with smaller ones after noticing that customers often worked alone on laptops.",
    prompt: "What can be inferred about the owner's decision?",
    choices: [{ id: "A", text: "It responds to how customers use the space." }, { id: "B", text: "It is intended to stop customers from working." }, { id: "C", text: "It will reduce the number of menu items." }, { id: "D", text: "It was required by law." }],
    correctChoiceId: "A", explanation: "The change follows the owner's observation that many customers sit and work individually.",
  },
  {
    id: "inference-hard-1", difficulty: "hard", stimulus: "For years, the shopkeeper displayed the faded map behind glass. On the morning the hikers disappeared, the case stood open and the map was gone.",
    prompt: "Which inference is best supported?",
    choices: [{ id: "A", text: "The map may be connected to the hikers' route." }, { id: "B", text: "The shopkeeper sold the map years earlier." }, { id: "C", text: "The hikers broke every display case." }, { id: "D", text: "The map had no practical value." }],
    correctChoiceId: "A", explanation: "The timing of the missing map and hikers suggests a possible connection without proving who took it.",
  },
  {
    id: "inference-elite-1", difficulty: "elite", stimulus: "The council member praised the proposal's ambition, then spent the remainder of her remarks asking who would fund it and maintain it after the first year.",
    prompt: "What can be inferred about her position?",
    choices: [{ id: "A", text: "She supports every detail without reservation." }, { id: "B", text: "She is interested but concerned about long-term feasibility." }, { id: "C", text: "She has not read the proposal." }, { id: "D", text: "She objects only to its goals." }],
    correctChoiceId: "B", explanation: "Her praise signals interest, while her sustained questions reveal practical concerns.",
  },
];
