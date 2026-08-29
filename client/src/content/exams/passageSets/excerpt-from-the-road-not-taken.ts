import { createPlainTextPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheRoadNotTakenPassageText = "Two roads diverged in a yellow wood,\n\nAnd sorry I could not travel both\n\nAnd be one traveler, long I stood\n\nAnd looked down one as far as I could\n\nTo where it bent in the undergrowth;\n\n\n\n\nThen took the other, as just as fair,\n\nAnd having perhaps the better claim,\n\nBecause it was grassy and wanted wear;\n\nThough as for that the passing there\n\nHad worn them really about the same,\n\n\n\n\nAnd both that morning equally lay\n\nIn leaves no step had trodden black.\n\nOh, I kept the first for another day!\n\nYet knowing how way leads on to way,\n\nI doubted if I should ever come back.\n\n\n\n\nI shall be telling this with a sigh\n\nSomewhere ages and ages hence:\n\nTwo roads diverged in a wood, and I—\n\nI took the one less traveled by,\n\nAnd that has made all the difference.​";

const excerptFromTheRoadNotTakenQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "The contrast between the speaker's admission in the second stanza that the two roads were worn 'really about the same' and his claim in the final stanza that he took 'the one less traveled by' most strongly suggests that",
    "promptHtml": "The contrast between the speaker's admission in the second stanza that the two roads were worn 'really about the same' and his claim in the final stanza that he took 'the one less traveled by'&nbsp;<strong>most strongly</strong>&nbsp;suggests that",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "the speaker changed which road he was walking on partway through the journey.",
        "text": "the speaker changed which road he was walking on partway through the journey."
      },
      {
        "id": "B",
        "html": "the two roads actually led to the same final destination.",
        "text": "the two roads actually led to the same final destination."
      },
      {
        "id": "C",
        "html": "the speaker regrets never having brought a map on his walk.",
        "text": "the speaker regrets never having brought a map on his walk."
      },
      {
        "id": "D",
        "html": "the speaker is retelling the event somewhat inaccurately, since people simplify choices.",
        "text": "the speaker is retelling the event somewhat inaccurately, since people simplify choices."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-road-not-taken-2",
    "points": 1,
    "prompt": "The final stanza shifts from the past-tense description of the moment of choosing, used in the first three stanzas, into the future tense of 'I shall be telling this with a sigh / Somewhere ages and ages hence.' This structural shift most clearly emphasizes",
    "promptHtml": "The final stanza shifts from the past-tense description of the moment of choosing, used in the first three stanzas, into the future tense of 'I shall be telling this with a sigh / Somewhere ages and ages hence.' This structural shift&nbsp;<strong>most clearly</strong>&nbsp;emphasizes",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "how the speaker will retell this moment long afterward",
        "text": "how the speaker will retell this moment long afterward"
      },
      {
        "id": "B",
        "html": "that the speaker has not yet made his choice of road",
        "text": "that the speaker has not yet made his choice of road"
      },
      {
        "id": "C",
        "html": "that the entire poem takes place within an extended dream sequence",
        "text": "that the entire poem takes place within an extended dream sequence"
      },
      {
        "id": "D",
        "html": "the physical distance separating the two roads from one another entirely",
        "text": "the physical distance separating the two roads from one another entirely"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-road-not-taken-3",
    "points": 1,
    "prompt": "Which choice best states a theme that the poem develops through the speaker's account of choosing between two paths?",
    "promptHtml": "Which choice&nbsp;<strong>best</strong>&nbsp;states a theme that the poem develops through the speaker's account of choosing between two paths?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "A single small choice can shape a life in unclear ways.",
        "text": "A single small choice can shape a life in unclear ways."
      },
      {
        "id": "B",
        "html": "Every choice a person makes can later be reversed if they come to regret it.",
        "text": "Every choice a person makes can later be reversed if they come to regret it."
      },
      {
        "id": "C",
        "html": "Yellow leaves on the ground always mean that autumn has just begun.",
        "text": "Yellow leaves on the ground always mean that autumn has just begun."
      },
      {
        "id": "D",
        "html": "Traveling alone through a forest is always more dangerous than traveling with others.",
        "text": "Traveling alone through a forest is always more dangerous than traveling with others."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-road-not-taken-4",
    "points": 1,
    "prompt": "The phrase 'way leads on to way' is best understood to mean that",
    "promptHtml": "The phrase 'way leads on to way' is&nbsp;<strong>best</strong>&nbsp;understood to mean that",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "one physical road literally connects to another road further down the path.",
        "text": "one physical road literally connects to another road further down the path."
      },
      {
        "id": "B",
        "html": "the speaker became lost in the woods and had to backtrack.",
        "text": "the speaker became lost in the woods and had to backtrack."
      },
      {
        "id": "C",
        "html": "each choice leads to further choices, making it unlikely one returns to reconsider.",
        "text": "each choice leads to further choices, making it unlikely one returns to reconsider."
      },
      {
        "id": "D",
        "html": "the woods contained many roads that were clearly marked with signs.",
        "text": "the woods contained many roads that were clearly marked with signs."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-road-not-taken-5",
    "points": 1,
    "prompt": "Word choices such as 'sorry,' 'sigh,' and 'doubted,' which recur across the poem, most strongly establish a tone that is",
    "promptHtml": "Word choices such as 'sorry,' 'sigh,' and 'doubted,' which recur across the poem,&nbsp;<strong>most strongly</strong>&nbsp;establish a tone that is",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "wistful and uncertain, rather than simply celebratory of the choice made",
        "text": "wistful and uncertain, rather than simply celebratory of the choice made"
      },
      {
        "id": "B",
        "html": "triumphantly confident and proud of the road chosen",
        "text": "triumphantly confident and proud of the road chosen"
      },
      {
        "id": "C",
        "html": "angry and resentful toward the road that was not chosen",
        "text": "angry and resentful toward the road that was not chosen"
      },
      {
        "id": "D",
        "html": "comic and lighthearted throughout, never taking the choice seriously",
        "text": "comic and lighthearted throughout, never taking the choice seriously"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromTheRoadNotTakenPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-road-not-taken",
  questionCount: excerptFromTheRoadNotTakenQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createPlainTextPassage({
    id: "excerpt-from-the-road-not-taken",
    title: "Excerpt from \"The Road Not Taken\"",
    author: "Robert Frost",
    blurb: "Robert Frost (1874-1963) was an American poet. \"The Road Not Taken\" was first published in his 1916 collection Mountain Interval.",
    passageType: "poem",
    richText: "<p>Two roads diverged in a yellow wood,</p><p>And sorry I could not travel both</p><p>And be one traveler, long I stood</p><p>And looked down one as far as I could</p><p>To where it bent in the undergrowth;</p><p><br></p><p>Then took the other, as just as fair,</p><p>And having perhaps the better claim,</p><p>Because it was grassy and wanted wear;</p><p>Though as for that the passing there</p><p>Had worn them really about the same,</p><p><br></p><p>And both that morning equally lay</p><p>In leaves no step had trodden black.</p><p>Oh, I kept the first for another day!</p><p>Yet knowing how way leads on to way,</p><p>I doubted if I should ever come back.</p><p><br></p><p>I shall be telling this with a sigh</p><p>Somewhere ages and ages hence:</p><p>Two roads diverged in a wood, and I—</p><p>I took the one less traveled by,</p><p>And that has made all the difference.​</p><p></p><p></p><p></p><p><br>\n\n</p>",
    text: excerptFromTheRoadNotTakenPassageText,
  }),
  questions: excerptFromTheRoadNotTakenQuestions,
};
