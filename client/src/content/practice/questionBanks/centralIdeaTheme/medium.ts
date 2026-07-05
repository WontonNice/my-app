import type { PracticeQuestion } from "../../types";

export const centralIdeaThemeMediumQuestions: PracticeQuestion[] = [
  {
    id: "central-medium-1",
    difficulty: "medium",
    stimulus: "Although the old clock had not worked for years, Grandfather refused to throw it away. He spent winter evenings cleaning its gears. When it finally chimed, he smiled not at the sound, but at the memory of his father winding it each Sunday.",
    prompt: "Which theme is developed most clearly?",
    choices: [
      { id: "A", text: "Old objects are usually more valuable than new ones." },
      { id: "B", text: "Repairing machines requires professional training." },
      { id: "C", text: "Objects can matter because of the memories they carry." },
      { id: "D", text: "Winter is the best season for difficult projects." },
    ],
    correctChoiceId: "C",
    explanation: "The clock's importance comes from its connection to Grandfather's father, not its practical use.",
  },
  {
    id: "central-medium-2",
    difficulty: "medium",
    stimulus: "A town planned to cut down a grove to create more parking. Students documented the birds nesting there and proposed a smaller lot beside an unused warehouse. The council adopted their plan.",
    prompt: "Which sentence best summarizes the passage?",
    choices: [
      { id: "A", text: "Students stopped all construction in their town." },
      { id: "B", text: "Careful research helped students offer a solution that protected wildlife." },
      { id: "C", text: "The council wanted to build a warehouse near a grove." },
      { id: "D", text: "Birds often build nests near public parking lots." },
    ],
    correctChoiceId: "B",
    explanation: "This choice includes the problem, the students' research, and the successful compromise.",
  },
];
