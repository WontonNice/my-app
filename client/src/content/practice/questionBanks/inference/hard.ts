import type { PracticeQuestion } from "../../types";

export const inferenceHardQuestions: PracticeQuestion[] = [
  {
    id: "inference-hard-1", difficulty: "hard", stimulus: "For years, the shopkeeper displayed the faded map behind glass. On the morning the hikers disappeared, the case stood open and the map was gone.",
    prompt: "Which inference is best supported?",
    choices: [{ id: "A", text: "The map may be connected to the hikers' route." }, { id: "B", text: "The shopkeeper sold the map years earlier." }, { id: "C", text: "The hikers broke every display case." }, { id: "D", text: "The map had no practical value." }],
    correctChoiceId: "A", explanation: "The timing of the missing map and hikers suggests a possible connection without proving who took it.",
  },
];
