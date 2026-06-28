import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const ravenPlansPassageText = `
In Edgar Allan Poe's poem "The Raven," a raven visits a lonely man's home and responds to the man's questions with only the word "nevermore." The poem's narrator treats the bird as a mysterious messenger, but ravens are more than symbols in literature. Some researchers argue that ravens can remember past events, solve unfamiliar problems, and even prepare for situations that have not happened yet.

It can be difficult to test an animal's ability to plan because human observers must be careful not to mistake instinctual behavior for intentional planning. Many animals store food or build shelters, but those actions may be driven by immediate needs or inherited patterns. To show planning, an experiment has to give an animal a new problem and then measure whether the animal saves a useful tool for later.

Researchers at Lund University in Sweden designed one such experiment with ravens. First, the birds learned that dropping a stone into a small box caused the box to release a treat. After the ravens learned the behavior, the researchers removed the box and presented the birds with several objects. Only one object, a stone, would be useful later.

The next step tested whether the ravens could think ahead. A researcher would trade the ravens a large treat for a bottle cap, while the stone was useful only with the box. Later, the researchers presented the ravens with a group of items, including small treats and the bottle cap. The ravens often chose the tool or token instead of the immediate treat and waited until the original researcher or the box returned.

The results do not prove that ravens think exactly the way humans do. Still, the experiment suggests that ravens can sometimes give up an instant reward in order to gain a better one later. That ability is important because it shows that planning may not belong only to humans and a few close animal relatives.

Scientists continue to debate what the findings mean. Some argue that the ravens were using learned behavior rather than true planning. Others point out that the birds had to choose an item, keep it, and use it after a delay. Either way, the research encourages scientists to ask more careful questions about intelligence in animals.
`;

const ravenPlansQuestions: ExamQuestion[] = [
  {
    id: "raven-plans-1",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt:
      "Read this sentence from paragraph 1.\n\n**At Lund University in Sweden, researchers argue that ravens may be able to think ahead and even plan for the future.**\n\nWhich sentence from paragraph 4 provides support for this argument?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      {
        id: "A",
        text: "\"The next step tested whether the ravens could think ahead.\"",
      },
      {
        id: "B",
        text: "\"A researcher would trade the ravens a large treat for a bottle cap, while the stone was useful only with the box.\"",
      },
      {
        id: "C",
        text: "\"Later, the researchers presented the ravens with a group of items, including small treats and the bottle cap.\"",
      },
      {
        id: "D",
        text: "\"The ravens often chose the tool or token instead of the immediate treat and waited until the original researcher or the box returned.\"",
      },
    ],
  },
  {
    id: "raven-plans-2",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "Which statement best explains why paragraph 2 is important to the passage?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "It describes the exact location where the raven study was conducted." },
      { id: "B", text: "It explains why testing animal planning is complicated." },
      { id: "C", text: "It proves that instinct and planning are the same behavior." },
      { id: "D", text: "It shows that most animals are unable to learn from experiments." },
    ],
  },
  {
    id: "raven-plans-3",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in paragraph 3, the word unfamiliar most nearly means",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "dangerous." },
      { id: "B", text: "ordinary." },
      { id: "C", text: "new." },
      { id: "D", text: "hidden." },
    ],
  },
  {
    id: "raven-plans-4",
    topic: "Supporting Evidence",
    type: "multiple_choice",
    prompt: "Which detail from the passage best supports the idea that the ravens could delay a reward?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "The ravens chose a useful item instead of taking small treats right away." },
      { id: "B", text: "The ravens appeared in a famous poem about a lonely man." },
      { id: "C", text: "The researchers removed the box after the birds learned to use it." },
      { id: "D", text: "Some scientists continued to debate the meaning of the experiment." },
    ],
  },
  {
    id: "raven-plans-5",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which sentence best states the main idea of the passage?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "Ravens are mainly important because they appear in poems and stories." },
      { id: "B", text: "Scientists have completely proven that ravens think exactly like humans." },
      { id: "C", text: "Experiments suggest ravens may be capable of planning for future events." },
      { id: "D", text: "Animals should always choose immediate rewards when given a choice." },
    ],
  },
  {
    id: "raven-plans-6",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "With which statement would the author of the passage most likely agree?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      {
        id: "A",
        text: "Scientists are unlikely to be able to conduct an experiment that can genuinely distinguish between instinctual and learned behaviors in animals.",
      },
      {
        id: "B",
        text: "Scientists should continue researching to determine whether or not animals can demonstrate advanced intelligence.",
      },
      {
        id: "C",
        text: "Scientists should avoid making conclusions about animal intelligence based on experiments that rely on training animals.",
      },
      {
        id: "D",
        text: "Scientists can confirm data on whether animals have the ability to plan by performing experiments on one additional species.",
      },
    ],
  },
];

export const test: ExamPassageSet = {
  id: "ela-passage-set-2",
  questionCount: ravenPlansQuestions.length,
  directions: {
    subject: "English Language Arts",
    title: "READING COMPREHENSION",
    breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
    body:
      "Read each text and answer the related questions. As needed, you may use the online notepad tool or write on scrap paper to take notes. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question. Base your answers only on the content within the text.",
  },
  passage: createProsePassage({
    id: "raven-plans",
    title: "The Best Laid Plans of Ravens",
    sourceNote: "\"The Best Laid Plans of Ravens\" by Nathan Tutors",
    text: ravenPlansPassageText,
  }),
  questions: ravenPlansQuestions,
};
