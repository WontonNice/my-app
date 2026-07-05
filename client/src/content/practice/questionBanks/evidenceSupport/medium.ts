import type { PracticeQuestion } from "../../types";

export const evidenceSupportMediumQuestions: PracticeQuestion[] = [
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
];
