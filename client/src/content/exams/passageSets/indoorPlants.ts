import { createSentenceNumberedPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const indoorPlantsPassageText = `
In an age of endless media content, it is easy to see why people might prefer to stay inside. Many students and adults spend long hours studying, working, and relaxing indoors. However, scientists say that this separation between people and nature can affect both mood and physical comfort.

During photosynthesis, plants convert carbon dioxide into oxygen and remove some harmful particles from the air. Spending prolonged periods of time indoors, away from plants, deprives people of these benefits. Air that is not regularly refreshed can make a room feel stale and uncomfortable. Researchers have found that indoor plants can help improve air quality in small spaces.

Indoor plants may also support emotional well-being. Caring for a plant gives people a simple routine and a visible sign of growth. Even a small plant near a desk can make a room feel calmer and more inviting. For people who spend much of the day inside, adding plants can be an easy way to bring a little of the outdoors closer.
`;

const indoorPlantsQuestions: ExamQuestion[] = [
  {
    id: "indoor-plants-1",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which sentence best states the central idea of the passage?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "People should spend all of their time outdoors instead of studying indoors." },
      { id: "B", text: "Indoor plants are difficult to care for but are useful in large buildings." },
      { id: "C", text: "Adding indoor plants can improve indoor spaces and benefit people's well-being." },
      { id: "D", text: "Scientists disagree about whether plants release oxygen during photosynthesis." },
    ],
  },
  {
    id: "indoor-plants-2",
    topic: "Transitions & Organization",
    type: "transition_drop",
    prompt:
      "Which transition word or phrase should be added to the beginning of sentence 5 to emphasize the relationship between sentences 4 and 5?",
    instructions: "Move the correct answer to the box.",
    correctChoiceId: "A",
    points: 1,
    transitionSentenceNumber: "(5)",
    transitionBlankBefore: "",
    transitionBlankAfter:
      "spending prolonged periods of time indoors, away from plants, deprives people of these benefits.",
    choices: [
      { id: "A", text: "As a result," },
      { id: "B", text: "Primarily," },
      { id: "C", text: "In contrast," },
      { id: "D", text: "Unfortunately," },
    ],
  },
  {
    id: "indoor-plants-3",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt: "Which detail best supports the idea that plants can affect the physical environment indoors?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "Many students spend long hours studying indoors." },
      { id: "B", text: "Plants convert carbon dioxide into oxygen and remove some harmful particles." },
      { id: "C", text: "A plant can give people a simple routine." },
      { id: "D", text: "A small plant can make a room feel calmer and more inviting." },
    ],
  },
  {
    id: "indoor-plants-4",
    topic: "Revising & Editing",
    type: "multiple_choice",
    prompt: "Which sentence would best follow the final sentence of the passage?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "For this reason, people should avoid using desks near windows." },
      { id: "B", text: "This shows that all plants need the exact same amount of sunlight." },
      { id: "C", text: "Still, some rooms are too bright for people to work comfortably." },
      { id: "D", text: "A plant on a windowsill or shelf can be a small but meaningful improvement." },
    ],
  },
  {
    id: "indoor-plants-5",
    topic: "Tone & Mood",
    type: "multiple_choice",
    prompt: "The author's tone toward indoor plants is best described as",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "supportive and practical." },
      { id: "B", text: "uncertain and worried." },
      { id: "C", text: "humorous and doubtful." },
      { id: "D", text: "formal and critical." },
    ],
  },
];

export const indoorPlantsPassageSet: ExamPassageSet = {
  id: "ela-passage-set-3",
  questionCount: indoorPlantsQuestions.length,
  showDirectionsBefore: true,
  directions: {
    subject: "English Language Arts",
    title: "REVISING/EDITING PART A",
    breadcrumbLabel: "ELA REV/EDIT A DIRECTIONS",
    body:
      "Read the text or texts that follow and answer the related questions. You will be asked to improve the writing quality of each text and to correct errors so that each text follows the conventions of standard written English. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question.",
  },
  passage: createSentenceNumberedPassage({
    id: "indoor-plants",
    title: "The Benefits of Indoor Plants",
    sourceNote: "\"The Benefits of Indoor Plants\" by Nathan Tutors",
    text: indoorPlantsPassageText,
  }),
  questions: indoorPlantsQuestions,
};
