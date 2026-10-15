import { createProsePassage } from "../../exams/formatters";
import type { ExamQuestion } from "../../exams/types";
import type { AdvancedPracticePassage } from "../types";

const theCatSTablePassageText = "His name was Mr. Fonseka and he was travelling to England to be a teacher. I would visit him every few days. He knew passages from all kinds of books he could recite by heart, and he sat at his desk all day wondering about them, thinking what he could say about them. I knew scarcely athing about the world of literature, but he welcomed me with unusual and interesting stories, stopping abruptly in mid-taleand saying that someday I should find out what happened after that. “You will like it, I think. Perhaps he will find the eagle.” Or, “They will escape the maze with the help of someone they are about to meet. . . .” Often, during the night, while stalking the ship with Ramadhin and Cassius, I’d attempt to add to the bare bones of an adventure Mr.Fonseka had left unfinished.\n\n\n\n\nHe was gracious, with his quietness. When he spoke, he was tentative and languid. Even then I understood his rareness by the pace of his gestures. He stood up only when it was essential, as if he were a sick cat. He was not used to public effort, even though he was now going to be a part of a public world as a teacher of literature and history in England.";

const theCatSTableQuestions: ExamQuestion[] = [
  {
    "id": "the-cat-s-table-1",
    "points": 1,
    "prompt": "Over the course of the passage, the narrator’s focus shifts from",
    "promptHtml": "Over the course of the passage, the narrator’s focus shifts from",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "a description of the internal world of a character to an expression of sympathy for that character.",
        "text": "a description of the internal world of a character to an expression of sympathy for that character."
      },
      {
        "id": "B",
        "html": "a recollection of interactions with a character to speculation about that character’s life.",
        "text": "a recollection of interactions with a character to speculation about that character’s life."
      },
      {
        "id": "C",
        "html": "the discussion of a character’s history to a recounting of an important turning point.",
        "text": "the discussion of a character’s history to a recounting of an important turning point."
      },
      {
        "id": "D",
        "html": "the narration of a childhood experience to that event’s impact on the narrator’s life.",
        "text": "the narration of a childhood experience to that event’s impact on the narrator’s life."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const theCatSTable: AdvancedPracticePassage = {
  id: "the-cat-s-table",
  genre: "Fiction",
  excerpt: "?",
  thumbnailAlt: "?",
  tone: "blue",
  passageSet: {
    id: "advanced-the-cat-s-table",
    questionCount: theCatSTableQuestions.length,
    directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
    passage: createProsePassage({
      id: "the-cat-s-table",
      title: "The Cat’s Table",
      author: "Michael Ondaatje",
      blurb: "This passage is adapted from Michael Ondaatje, The Cat’s Table. ©2011 by Michael Ondaatje. The novel’s narrator reflects on hisjourney as a young boy traveling by ship from the former Britishcolony Ceylon—now Sri Lanka—to England during the 1950s.Ramadhin and Cassius are friends he made during the journey.",
      passageType: "poem",
      passageCategory: "miscellaneous",
      richText: "<p>His name was Mr. Fonseka and he was travelling to England to be a teacher. I would visit him every few days. He knew passages from all kinds of books he could recite by heart, and he sat at his desk all day wondering about them, thinking what he could say about them. I knew scarcely athing about the world of literature, but he welcomed me with unusual and interesting stories, stopping abruptly in mid-taleand saying that someday I should find out what happened after that. “You will like it, I think. Perhaps he will find the eagle.” Or, “They will escape the maze with the help of someone they are about to meet. . . .” Often, during the night, while stalking the ship with Ramadhin and Cassius, I’d attempt to add to the bare bones of an adventure Mr.Fonseka had left unfinished.</p><p><br></p><p>He was gracious, with his quietness. When he spoke, he was tentative and languid. Even then I understood his rareness by the pace of his gestures. He stood up only when it was essential, as if he were a sick cat. He was not used to public effort, even though he was now going to be a part of a public world as a teacher of literature and history in England.</p>",
      text: theCatSTablePassageText,
    }),
    questions: theCatSTableQuestions,
  },
};
