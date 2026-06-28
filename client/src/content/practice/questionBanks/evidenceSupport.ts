import type { PracticeQuestion } from "../types";

export const evidenceSupportQuestions: PracticeQuestion[] = [
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
  {
    id: "evidence-medium-1", difficulty: "medium", stimulus: "The town's tree-planting program reduced summer heat on several blocks.",
    prompt: "Which evidence would most strongly support the claim?",
    choices: [{ id: "A", text: "Residents like the color green." }, { id: "B", text: "Average sidewalk temperatures fell six degrees where tree cover increased." }, { id: "C", text: "The program began in April." }, { id: "D", text: "Some trees were taller than others." }],
    correctChoiceId: "B", explanation: "Measured temperature change directly supports the claim about reduced heat.",
  },
  {
    id: "evidence-medium-2", difficulty: "medium", stimulus: "A historian argues that the market served as a social center, not only a place to buy goods.",
    prompt: "Which source would best support the historian's argument?",
    choices: [{ id: "A", text: "A list of vegetable prices" }, { id: "B", text: "A diary describing public speeches and celebrations held at the market" }, { id: "C", text: "A map showing farms outside town" }, { id: "D", text: "A recipe using food sold at the market" }],
    correctChoiceId: "B", explanation: "Speeches and celebrations show the market's broader social function.",
  },
  {
    id: "evidence-hard-1", difficulty: "hard", stimulus: "The researcher claims the birds adjusted their behavior based on changing conditions rather than repeating a memorized action.",
    prompt: "Which result best supports the claim?",
    choices: [{ id: "A", text: "The birds repeated one action after receiving food." }, { id: "B", text: "The birds chose different tools when the opening changed size." }, { id: "C", text: "The birds were tested in the morning." }, { id: "D", text: "Several birds had similar markings." }],
    correctChoiceId: "B", explanation: "Changing tools in response to a new opening shows flexible adjustment.",
  },
  {
    id: "evidence-elite-1", difficulty: "elite", stimulus: "An editorial argues that extending library hours improves academic access for students with after-school responsibilities.",
    prompt: "Which evidence is most relevant and sufficient?",
    choices: [{ id: "A", text: "A librarian says evenings are quiet." }, { id: "B", text: "Attendance records show heavy evening use, and surveys identify work and caregiving as reasons students cannot visit earlier." }, { id: "C", text: "The library purchased new chairs last year." }, { id: "D", text: "Several nearby stores remain open late." }],
    correctChoiceId: "B", explanation: "It combines usage data with evidence connecting late visits to students' responsibilities.",
  },
];

