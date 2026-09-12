import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const atDusk20252026FormBPassageText = "At first I think she is calling a child,\n\nmy neighbor, leaning through her doorway\n\nat dusk, street lamps just starting to hum\n\nthe backdrop of evening. Then I hear\n\nthe high-pitched wheedling we send out\n\nto animals who know only sound, not\n\nthe meanings of our words—here here—\n\nnor how they sometimes fall short.\n\nIn another yard, beyond my neighbor’s\n\nsight, the cat lifts her ears, turns first\n\ntoward the voice, then back\n\nto the constellation of fireflies flickering\n\nnear her head. It’s as if she can’t decide\n\nwhether to leap over the low hedge,\n\nthe neat row of flowers, and bound\n\nonto the porch, into the steady circle\n\nof light, or stay where she is: luminous\n\npossibility—all that would keep her\n\naway from home—flitting before her.\n\nI listen as my neighbor’s voice trails off.\n\nShe’s given up calling for now, left me\n\nto imagine her inside the house waiting,\n\nperhaps in a chair in front of the TV,\n\nor walking around, doing small tasks;\n\nleft me to wonder that I too might lift\n\nmy voice, sure of someone out there,\n\nsend it over the lines stitching here\n\nto there, certain the sounds I make\n\nare enough to call someone home.";

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
    "prompt": "Read lines 11–13 from the poem.\ntoward the voice, then back\nto the constellation of fireflies flickering\nnear her head\nWhich idea from the poem does the imagery in these lines help convey?",
    "promptHtml": "Read&nbsp;lines 11–13 from the&nbsp;poem.<br><strong>toward the voice, then back</strong><br><strong>to the constellation of fireflies flickering</strong><br><strong>near her head</strong><br>Which&nbsp;idea from the poem does the imagery in these lines&nbsp;help&nbsp;convey?",
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
  questionCount: atDusk20252026FormBQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "at-dusk-2025-2026-form-b",
    title: "At Dusk",
    author: "Natasha Trethewey",
    passageType: "poem",
    richText: "<p>At first I think she is calling a child,</p><p>my neighbor, leaning through her doorway</p><p>at dusk, street lamps just starting to hum</p><p>the backdrop of evening. Then I hear</p><p>the high-pitched&nbsp;wheedling&nbsp;we send out</p><p>to animals who know only sound, not</p><p>the meanings of our words—<em>here here</em>—</p><p>nor how they sometimes fall short.</p><p>In another yard, beyond my neighbor’s</p><p>sight, the cat lifts her ears, turns first</p><p>toward the voice, then back</p><p>to the constellation of fireflies flickering</p><p>near her head. It’s as if she can’t decide</p><p>whether to leap over the low hedge,</p><p>the neat row of flowers, and bound</p><p>onto the porch, into the steady circle</p><p>of light, or stay where she is: luminous</p><p>possibility—all that would keep her</p><p>away from home—flitting before her.</p><p>I listen as my neighbor’s voice trails off.</p><p>She’s given up calling for now, left me</p><p>to imagine her inside the house waiting,</p><p>perhaps in a chair in front of the TV,</p><p>or walking around, doing small tasks;</p><p>left me to wonder that I too might lift</p><p>my voice, sure of someone out there,</p><p>send it over the lines stitching here</p><p>to there, certain the sounds I make</p><p>are enough to call someone home.</p><p>\n\n</p>",
    sourceNote: "“At Dusk” from NATIVE GUARD by Natasha Trethewey, published by Houghton Mifflin Company. Copyright © 2006 by Natasha Trethewey. All rights reserved.",
    text: atDusk20252026FormBPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: atDusk20252026FormBQuestions,
};
