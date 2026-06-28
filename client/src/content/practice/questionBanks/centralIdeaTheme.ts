import type { PracticeQuestion } from "../types";

export const centralIdeaThemeQuestions: PracticeQuestion[] = [
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

