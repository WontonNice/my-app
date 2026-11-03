import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const atDusk20252026FormBPassageText = "At first I think she is calling a child,\nmy neighbor, leaning through her doorway\nat dusk, street lamps just starting to hum\nthe backdrop of evening. Then I hear\nthe high-pitched wheedling we send out\nto animals who know only sound, not\nthe meanings of our words—here here—\nnor how they sometimes fall short.\nIn another yard, beyond my neighbor’s\nsight, the cat lifts her ears, turns first\ntoward the voice, then back\nto the constellation of fireflies flickering\nnear her head. It’s as if she can’t decide\nwhether to leap over the low hedge,\nthe neat row of flowers, and bound\nonto the porch, into the steady circle\nof light, or stay where she is: luminous\npossibility—all that would keep her\naway from home—flitting before her.\nI listen as my neighbor’s voice trails off.\nShe’s given up calling for now, left me\nto imagine her inside the house waiting,\nperhaps in a chair in front of the TV,\nor walking around, doing small tasks;\nleft me to wonder that I too might lift\nmy voice, sure of someone out there,\nsend it over the lines stitching here\nto there, certain the sounds I make\nare enough to call someone home.";

const atDusk20252026FormBQuestions: ExamQuestion[] = [
  {
    "id": "at-dusk-2025-2026-form-b-1",
    "points": 1,
    "prompt": "Which lines from the poem best support the idea that the neighbor’s efforts to call the cat home directly affect the speaker?",
    "promptHtml": "Which&nbsp;lines from the&nbsp;poem&nbsp;<strong>best</strong>&nbsp;support&nbsp;the idea that the neighbor’s efforts to call the cat home directly affect the speaker?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“At first I think she is calling a&nbsp;child, /&nbsp;my neighbor”&nbsp;(lines 1–2)",
        "text": "“At first I think she is calling a child, / my neighbor” (lines 1–2)"
      },
      {
        "id": "B",
        "html": "“the high-pitched wheedling we send&nbsp;out /&nbsp;to animals who know only sound”&nbsp;(lines 5–6)",
        "text": "“the high-pitched wheedling we send out / to animals who know only sound” (lines 5–6)"
      },
      {
        "id": "C",
        "html": "“I listen as my neighbor’s voice trails&nbsp;off. /&nbsp;She’s given up calling for now”&nbsp;(lines 20–21)",
        "text": "“I listen as my neighbor’s voice trails off. / She’s given up calling for now” (lines 20–21)"
      },
      {
        "id": "D",
        "html": "“left me to wonder that I too might&nbsp;lift /&nbsp;my voice, sure of someone out there”&nbsp;(lines 25–26)",
        "text": "“left me to wonder that I too might lift / my voice, sure of someone out there” (lines 25–26)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-3",
    "points": 1,
    "prompt": "The isolation of the words “—here here—” in line 7 contributes to the meaning of the poem mainly by",
    "promptHtml": "The isolation of the&nbsp;words&nbsp;“—<em>here</em>&nbsp;<em>here</em>—” in&nbsp;line 7&nbsp;contributes to the meaning of the&nbsp;poem&nbsp;<strong>mainly</strong>&nbsp;by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "demonstrating&nbsp;how&nbsp;people try to communicate in familiar ways but are still sometimes misunderstood.",
        "text": "demonstrating how people try to communicate in familiar ways but are still sometimes misunderstood."
      },
      {
        "id": "B",
        "html": "showing&nbsp;how&nbsp;people can feel desperate to connect&nbsp;with&nbsp;others but give up quickly&nbsp;when&nbsp;their first attempts are ignored.",
        "text": "showing how people can feel desperate to connect with others but give up quickly when their first attempts are ignored."
      },
      {
        "id": "C",
        "html": "using&nbsp;the unspoken bond between the neighbor and her cat to highlight the&nbsp;understanding&nbsp;people have&nbsp;with&nbsp;their pets.",
        "text": "using the unspoken bond between the neighbor and her cat to highlight the understanding people have with their pets."
      },
      {
        "id": "D",
        "html": "illustrating the&nbsp;use&nbsp;of a simple expression to call home those&nbsp;who&nbsp;are loved and missed.",
        "text": "illustrating the use of a simple expression to call home those who are loved and missed."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-4",
    "points": 1,
    "prompt": "The details in lines 10–17 about the cat convey a central idea of the poem by",
    "promptHtml": "The&nbsp;details&nbsp;in lines 10–17 about the cat convey a central idea of the&nbsp;poem&nbsp;by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "showing that returning home after experiencing independence is challenging.",
        "text": "showing that returning home after experiencing independence is challenging."
      },
      {
        "id": "B",
        "html": "suggesting that caring for others means allowing them to grow and to roam freely.",
        "text": "suggesting that caring for others means allowing them to grow and to roam freely."
      },
      {
        "id": "C",
        "html": "implying that expecting to feel at home in the natural world leads to disappointment.",
        "text": "implying that expecting to feel at home in the natural world leads to disappointment."
      },
      {
        "id": "D",
        "html": "emphasizing the conflicting desires to return to the familiar and to explore the unknown.",
        "text": "emphasizing the conflicting desires to return to the familiar and to explore the unknown."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-5",
    "points": 1,
    "prompt": "The phrases “luminous possibility” and “all that would keep her / away from home” (lines 17–19) affect the poem by",
    "promptHtml": "The&nbsp;phrases&nbsp;“luminous possibility” and “all that would keep&nbsp;her /&nbsp;away from home”&nbsp;(lines 17–19)&nbsp;affect the&nbsp;poem&nbsp;by",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "highlighting the cat’s lack of concern for the neighbor.",
        "text": "highlighting the cat’s lack of concern for the neighbor."
      },
      {
        "id": "B",
        "html": "implying that the speaker finds the cat’s current situation interesting.",
        "text": "implying that the speaker finds the cat’s current situation interesting."
      },
      {
        "id": "C",
        "html": "suggesting that the cat is compelled by its sense of wonder to remain outdoors.",
        "text": "suggesting that the cat is compelled by its sense of wonder to remain outdoors."
      },
      {
        "id": "D",
        "html": "indicating that the speaker&nbsp;supports&nbsp;the cat’s decision to ignore the neighbor.",
        "text": "indicating that the speaker supports the cat’s decision to ignore the neighbor."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-6",
    "points": 1,
    "prompt": "Read lines 11–13 from the poem.\n\ntoward the voice, then back\nto the constellation of fireflies flickering\nnear her head\n\nWhich idea from the poem does the imagery in these lines help convey?",
    "promptHtml": "<p>Read lines 11–13 from the poem.</p><blockquote><strong><strong>toward the voice, then back</strong><br><strong>to the constellation of fireflies flickering</strong><br><strong>near her head</strong></strong></blockquote><p>Which idea from the poem does the imagery in these lines help convey?</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "html": "The cat lacks a preference for going in or staying out.",
        "text": "The cat lacks a preference for going in or staying out."
      },
      {
        "id": "B",
        "html": "The cat is eager to see&nbsp;what&nbsp;will&nbsp;happen&nbsp;next.",
        "text": "The cat is eager to see what will happen next."
      },
      {
        "id": "C",
        "html": "The cat wants to understand the unpredictable behavior of the fireflies.",
        "text": "The cat wants to understand the unpredictable behavior of the fireflies."
      },
      {
        "id": "D",
        "html": "The cat is fascinated by the natural world and finds the indoors unremarkable.",
        "text": "The cat is fascinated by the natural world and finds the indoors unremarkable."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-7",
    "points": 1,
    "prompt": "How does the setting affect the events of the poem?",
    "promptHtml": "How&nbsp;does the&nbsp;setting&nbsp;affect the&nbsp;events&nbsp;of the&nbsp;poem?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "It enables the speaker to regularly overhear the neighbor calling for her cat at dusk.",
        "text": "It enables the speaker to regularly overhear the neighbor calling for her cat at dusk."
      },
      {
        "id": "B",
        "html": "It allows the speaker to observe the neighbor quietly&nbsp;without&nbsp;interacting&nbsp;with&nbsp;her.",
        "text": "It allows the speaker to observe the neighbor quietly without interacting with her."
      },
      {
        "id": "C",
        "html": "It&nbsp;shows&nbsp;how&nbsp;living in close proximity&nbsp;helps&nbsp;the speaker feel connected to the neighbor.",
        "text": "It shows how living in close proximity helps the speaker feel connected to the neighbor."
      },
      {
        "id": "D",
        "html": "It&nbsp;shows&nbsp;how&nbsp;feeling isolated&nbsp;causes&nbsp;the speaker to imagine interactions&nbsp;with&nbsp;the neighbor.",
        "text": "It shows how feeling isolated causes the speaker to imagine interactions with the neighbor."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2025-2026-form-b-8",
    "points": 1,
    "prompt": "The poet develops a theme about making connections with others mainly through the",
    "promptHtml": "The poet develops a&nbsp;theme&nbsp;about making connections&nbsp;with&nbsp;others&nbsp;<strong>mainly</strong>&nbsp;through&nbsp;the",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "exploration of the desires of the speaker and the neighbor.",
        "text": "exploration of the desires of the speaker and the neighbor."
      },
      {
        "id": "B",
        "html": "speaker’s observations of the sights and sounds in the neighborhood.",
        "text": "speaker’s observations of the sights and sounds in the neighborhood."
      },
      {
        "id": "C",
        "html": "speculations the speaker makes about&nbsp;what&nbsp;the neighbor does inside her house.",
        "text": "speculations the speaker makes about what the neighbor does inside her house."
      },
      {
        "id": "D",
        "html": "speaker’s explanation of the cat’s thoughts and&nbsp;actions.",
        "text": "speaker’s explanation of the cat’s thoughts and actions."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const atDusk20252026FormBPassageSet: ExamPassageSet = {
  id: "ela-at-dusk-2025-2026-form-b",
  versionLabels: ["2025-2026 Form B"],
  section: "reading",
  questionCount: atDusk20252026FormBQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createSourcePassage({
    id: "at-dusk-2025-2026-form-b",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    title: "At Dusk",
    author: "Natasha Trethewey",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<div data-poetry-line=\"true\">At first I think she is calling a child,</div><div data-poetry-line=\"true\">my neighbor, leaning through her doorway</div><div data-poetry-line=\"true\">at dusk, street lamps just starting to hum</div><div data-poetry-line=\"true\">the backdrop of evening. Then I hear</div><div data-poetry-line=\"true\">the high-pitched <span data-glossary-definition=\"speaking in a flattering manner\" role=\"link\" tabindex=\"0\">wheedling</span> we send out</div><div data-poetry-line=\"true\">to animals who know only sound, not</div><div data-poetry-line=\"true\">the meanings of our words—<em>here here</em>—</div><div data-poetry-line=\"true\">nor how they sometimes fall short.</div><div data-poetry-line=\"true\">In another yard, beyond my neighbor’s</div><div data-poetry-line=\"true\">sight, the cat lifts her ears, turns first</div><div data-poetry-line=\"true\">toward the voice, then back</div><div data-poetry-line=\"true\">to the constellation of fireflies flickering</div><div data-poetry-line=\"true\">near her head. It’s as if she can’t decide</div><div data-poetry-line=\"true\">whether to leap over the low hedge,</div><div data-poetry-line=\"true\">the neat row of flowers, and bound</div><div data-poetry-line=\"true\">onto the porch, into the steady circle</div><div data-poetry-line=\"true\">of light, or stay where she is: luminous</div><div data-poetry-line=\"true\">possibility—all that would keep her</div><div data-poetry-line=\"true\">away from home—flitting before her.</div><div data-poetry-line=\"true\">I listen as my neighbor’s voice trails off.</div><div data-poetry-line=\"true\">She’s given up calling for now, left me</div><div data-poetry-line=\"true\">to imagine her inside the house waiting,</div><div data-poetry-line=\"true\">perhaps in a chair in front of the TV,</div><div data-poetry-line=\"true\">or walking around, doing small tasks;</div><div data-poetry-line=\"true\">left me to wonder that I too might lift</div><div data-poetry-line=\"true\">my voice, sure of someone out there,</div><div data-poetry-line=\"true\">send it over the lines stitching here</div><div data-poetry-line=\"true\">to there, certain the sounds I make</div><div data-poetry-line=\"true\">are enough to call someone home.</div>",
    sourceNote: "“At Dusk” from NATIVE GUARD by Natasha Trethewey, published by Houghton Mifflin Company. Copyright © 2006 by Natasha Trethewey. All rights reserved.",
    text: atDusk20252026FormBPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: atDusk20252026FormBQuestions,
};
