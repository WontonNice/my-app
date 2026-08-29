import { createProsePassage } from "../../exams/formatters";
import type { ExamQuestion } from "../../exams/types";
import type { AdvancedPracticePassage } from "../types";

const passageText = `
Groups are often formed because no single person has all the knowledge needed to solve a problem. A committee may include people with different experiences, technical skills, and priorities. In theory, combining those perspectives should improve the final decision.

In practice, group members do not always share what they know. People tend to repeat facts that everyone already accepts because agreement feels productive. Unfamiliar evidence may receive less attention, especially when presenting it could slow the discussion or challenge a popular proposal.

Researchers have found that a simple procedural change can help. Before discussion begins, each member writes down the most important information they possess. The group then reviews those notes one at a time. This method does not guarantee agreement, but it makes unique evidence harder to ignore.

The value of the procedure lies in its sequence. Members record their ideas before hearing the group's dominant opinion, so their first judgments are less likely to be shaped by social pressure. The group may still choose the original proposal, but it does so after examining a wider range of evidence.

Good group decisions, then, depend on more than gathering capable people in one room. They depend on creating conditions in which disagreement can contribute information rather than merely create friction.
`;

const questions: ExamQuestion[] = [
  {
    id: "group-minds-1",
    topic: "Central Idea & Theme",
    type: "multiple_choice",
    prompt: "Which statement best expresses the central idea of the passage?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "Groups make better decisions whenever every member agrees." },
      { id: "B", text: "Technical knowledge is more useful than personal experience." },
      { id: "C", text: "Popular proposals should be accepted before discussion begins." },
      { id: "D", text: "Groups make stronger decisions when their process encourages members to share unique evidence." },
    ],
  },
  {
    id: "group-minds-2",
    topic: "Evidence & Support",
    type: "multiple_choice",
    prompt: "Which detail best supports the idea that agreement can sometimes weaken a discussion?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "Members often repeat accepted facts while unfamiliar evidence receives less attention." },
      { id: "B", text: "A committee may include people with technical skills." },
      { id: "C", text: "The group reviews written notes one at a time." },
      { id: "D", text: "The group may still choose the original proposal." },
    ],
  },
  {
    id: "group-minds-3",
    topic: "Vocabulary in Context",
    type: "multiple_choice",
    prompt: "As used in paragraph 3, the word *procedural* most nearly means",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "accidental." },
      { id: "B", text: "related to a method or set of steps." },
      { id: "C", text: "based on a personal friendship." },
      { id: "D", text: "difficult to understand." },
    ],
  },
  {
    id: "group-minds-4",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "How does the author develop the passage's main idea?",
    correctChoiceId: "C",
    points: 1,
    choices: [
      { id: "A", text: "By listing several famous committees in chronological order" },
      { id: "B", text: "By comparing the technical skills of individual group members" },
      { id: "C", text: "By presenting a problem in group discussion, a possible solution, and why the solution works" },
      { id: "D", text: "By arguing that disagreement should be eliminated from meetings" },
    ],
  },
  {
    id: "group-minds-5",
    topic: "Inference",
    type: "multiple_choice",
    prompt: "Why do members write their ideas before the discussion begins?",
    correctChoiceId: "A",
    points: 1,
    choices: [
      { id: "A", text: "To preserve independent judgments before a dominant opinion can influence them" },
      { id: "B", text: "To ensure that every member reaches the same conclusion" },
      { id: "C", text: "To shorten the meeting by avoiding all disagreement" },
      { id: "D", text: "To identify which member has the most technical experience" },
    ],
  },
  {
    id: "group-minds-6",
    topic: "Author's Point of View",
    type: "multiple_choice",
    prompt: "With which statement would the author most likely agree?",
    correctChoiceId: "B",
    points: 1,
    choices: [
      { id: "A", text: "Capable people will naturally share all relevant information without guidance." },
      { id: "B", text: "The structure of a discussion can affect the quality of the evidence a group considers." },
      { id: "C", text: "A successful group must reject its original proposal." },
      { id: "D", text: "Social pressure improves the independence of group members." },
    ],
  },
  {
    id: "group-minds-7",
    topic: "Text Structure & Purpose",
    type: "multiple_choice",
    prompt: "How does the final paragraph contribute to the passage?",
    correctChoiceId: "D",
    points: 1,
    choices: [
      { id: "A", text: "It introduces a new problem unrelated to group decisions." },
      { id: "B", text: "It proves that disagreement always creates friction." },
      { id: "C", text: "It summarizes the steps for selecting committee members." },
      { id: "D", text: "It broadens the discussion into a conclusion about the conditions needed for good decisions." },
    ],
  },
];

export const groupsChangeTheirMinds: AdvancedPracticePassage = {
  id: "why-groups-change-their-minds",
  genre: "Social Science",
  excerpt:
    "A group can collect more information than one person, but more information does not automatically produce a better decision.",
  thumbnailAlt: "Students comparing notes during a focused group discussion",
  tone: "emerald",
  passageSet: {
    id: "advanced-groups-change-their-minds",
    questionCount: questions.length,
    directions: {
      subject: "English Language Arts",
      title: "READING COMPREHENSION",
      breadcrumbLabel: "ELA RDG COMP DIRECTIONS",
      body: "Read the text and answer the related questions. Base your answers only on the content within the text.",
    },
    passage: createProsePassage({
      id: "groups-change-their-minds",
      title: "Why Groups Change Their Minds",
      author: "Nathan Tutors Editorial",
      sourceNote: '"Why Groups Change Their Minds" by Nathan Tutors Editorial',
      text: passageText,
    }),
    questions,
  },
};
