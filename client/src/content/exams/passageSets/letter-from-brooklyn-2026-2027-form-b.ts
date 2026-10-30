import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const letterFromBrooklyn20262027FormBPassageText = "I can already see how this will end.\nHow I will grow tired of the bridge’s\nsteep incline, and the absent-minded tourists\nwandering into the bicycle path.\nThe weather will turn cold.\nBut that all happens later.\nFor now it is the early edge of fall,\nleaves green still while the air narrows,\nis slightly crisp, almost grazing\nthe hair of my arm like a passing stranger,\nas though the air has been forced into intimacy\nby the brevity of daylight.\nBut when it starts darkening at 4,\nthis closeness, I know, will be a felt distance,\nlike someone drawing your attention\nto their lack of intimacy.\nThese days I am still walking at a cathedral pace\nbeneath the branches bending across avenues,\nbrownstones like rows of lived-in chapels,\nlike a pop-up picture book I could have had as a child,\nbut didn’t. How Brooklyn makes me nostalgic\nfor the moment I am walking inside of.\nThese late afternoons filled\nwith a loneliness that makes me feel\ndistinctly myself, and an awareness\nof how rare that is.";

const letterFromBrooklyn20262027FormBQuestions: ExamQuestion[] = [
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-35",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "35"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-c3ca88ac386fef988115.png\" alt=\"Official explanation for question 35\">",
    "points": 1,
    "prompt": "How does the structure of the poem affect the poem’s meaning?",
    "promptHtml": "<p><span>How</span> does the structure of the <span>poem</span> affect the poem’s meaning?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The lack of a rhyming pattern suggests that the beauty of each passing day is unique.</p>",
        "text": "The lack of a rhyming pattern suggests that the beauty of each passing day is unique."
      },
      {
        "id": "B",
        "html": "<p>The lengths of the <span>sentences</span> represent the complexity of the thoughts being represented.</p>",
        "text": "The lengths of the sentences represent the complexity of the thoughts being represented."
      },
      {
        "id": "C",
        "html": "<p>The <span>use</span> of complete <span>sentences</span> implies the speaker’s appreciation for the clear <span>beginning</span> and ending of each season.</p>",
        "text": "The use of complete sentences implies the speaker’s appreciation for the clear beginning and ending of each season."
      },
      {
        "id": "D",
        "html": "<p>The single long <span>stanza</span> reflects the continuous flow of the speaker’s thoughts.</p>",
        "text": "The single long stanza reflects the continuous flow of the speaker’s thoughts."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-36",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "36"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-6ee79ebb500dd95f7c96.png\" alt=\"Official explanation for question 36\">",
    "points": 1,
    "prompt": "Which lines support the idea that a change in the weather will lessen the speaker’s appreciation for the city?",
    "promptHtml": "<p><span>Which</span> lines <span>support</span> the idea that a change in the weather will lessen the speaker’s appreciation for the city?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“as though the air has been forced into intimacy / by the brevity of daylight.” <span>(lines 11–12)</span></p>",
        "text": "“as though the air has been forced into intimacy / by the brevity of daylight.” (lines 11–12)"
      },
      {
        "id": "B",
        "html": "<p>“But when it starts darkening at 4, / this closeness, I know, will be a felt distance,” <span>(lines 13–14)</span></p>",
        "text": "“But when it starts darkening at 4, / this closeness, I know, will be a felt distance,” (lines 13–14)"
      },
      {
        "id": "C",
        "html": "<p>“like someone drawing your attention / to their lack of intimacy.” <span>(lines 15–16)</span></p>",
        "text": "“like someone drawing your attention / to their lack of intimacy.” (lines 15–16)"
      },
      {
        "id": "D",
        "html": "<p>“These days I am still walking . . . / beneath the branches bending across avenues,” <span>(lines 17–18)</span></p>",
        "text": "“These days I am still walking . . . / beneath the branches bending across avenues,” (lines 17–18)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-37",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "37"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-6c1ee915f6afb6e6467f.png\" alt=\"Official explanation for question 37\">",
    "points": 1,
    "prompt": "Read lines 5–6 from the poem.\nThe weather will turn cold.\nBut that all happens later.\nHow do the lines develop a central theme of the poem?",
    "promptHtml": "<p><span>Read</span> lines 5–6 from the <span>poem</span>.</p> <p data-align=\"indent\"><strong>The weather will turn cold.</strong><br><strong>But that all happens later.</strong></p> <p><span>How</span> do the lines develop a central <span>theme</span> of the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They highlight a <span>contrast</span> between the different seasons.</p>",
        "text": "They highlight a contrast between the different seasons."
      },
      {
        "id": "B",
        "html": "<p>They <span>show</span> the <span>sequence</span> of the changes that are expected to occur.</p>",
        "text": "They show the sequence of the changes that are expected to occur."
      },
      {
        "id": "C",
        "html": "<p>They warn about a <span>problem</span> that requires thoughtful preparation.</p>",
        "text": "They warn about a problem that requires thoughtful preparation."
      },
      {
        "id": "D",
        "html": "<p>They emphasize the importance of valuing the present.</p>",
        "text": "They emphasize the importance of valuing the present."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-38",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "38"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-e84ce5039f2324a44c74.png\" alt=\"Official explanation for question 38\">",
    "points": 1,
    "prompt": "Read lines 7–9 from the poem.\nFor now it is the early edge of fall,\nleaves green still while the air narrows,\nis slightly crisp,\nThe word choice in the lines helps convey the speaker’s belief that",
    "promptHtml": "<p><span>Read</span> lines 7–9 from the <span>poem</span>.</p> <p data-align=\"indent\"><strong>For now it is the early edge of fall,</strong><br><strong>leaves green still while the air narrows,</strong><br><strong>is slightly crisp,</strong></p> <p>The <span>word</span> choice in the lines <span>helps</span> convey the speaker’s belief that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the beauty of the current season should still be appreciated.</p>",
        "text": "the beauty of the current season should still be appreciated."
      },
      {
        "id": "B",
        "html": "<p>the changes in the weather signify the <span>end</span> of the <span>most</span> pleasant season.</p>",
        "text": "the changes in the weather signify the end of the most pleasant season."
      },
      {
        "id": "C",
        "html": "<p>the <span>transition</span> from one season to <span>another</span> <span>happens</span> swiftly and <span>without</span> warning.</p>",
        "text": "the transition from one season to another happens swiftly and without warning."
      },
      {
        "id": "D",
        "html": "<p>the change in the weather is so subtle that people rarely observe or feel it.</p>",
        "text": "the change in the weather is so subtle that people rarely observe or feel it."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-39",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "39"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-e617c981d9ec4baca9fc.png\" alt=\"Official explanation for question 39\">",
    "points": 1,
    "prompt": "Which idea does the comparison of the brownstone houses to “a pop-up picture book I could have had as a child, / but didn’t” in lines 20–21 convey?",
    "promptHtml": "<p><span>Which</span> idea does the comparison of the brownstone houses to “a pop-up picture book I could have had as a <span>child, /</span> but didn’t” in <span>lines 20–21</span> convey?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It reveals that some people are still influenced by powerful images from childhood.</p>",
        "text": "It reveals that some people are still influenced by powerful images from childhood."
      },
      {
        "id": "B",
        "html": "<p>It indicates that the neighborhood the speaker is walking <span>through</span> is charming and appealing.</p>",
        "text": "It indicates that the neighborhood the speaker is walking through is charming and appealing."
      },
      {
        "id": "C",
        "html": "<p>It suggests that the speaker has wanted to live in the neighborhood since childhood.</p>",
        "text": "It suggests that the speaker has wanted to live in the neighborhood since childhood."
      },
      {
        "id": "D",
        "html": "<p>It suggests that people <span>often</span> experience lingering regret from their past.</p>",
        "text": "It suggests that people often experience lingering regret from their past."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-40",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "40"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-ebb64fdd2a5e038a1b71.png\" alt=\"Official explanation for question 40\">",
    "points": 1,
    "prompt": "Read these lines from the poem.\nI can already see how this will end. (line 1)\nHow Brooklyn makes me nostalgic\nfor the moment I am walking inside of. (lines 21–22)\nThe lines develop a central idea of the poem by",
    "promptHtml": "<p><span>Read</span> these lines from the <span>poem</span>.</p> <p data-align=\"indent\"><strong>I can already see how this will end.</strong> (line 1)</p> <p data-align=\"indent\"><strong>How Brooklyn makes me&nbsp;nostalgic</strong><br><strong>for the moment I am walking inside of.</strong> (lines 21–22)</p> <p>The lines develop a central idea of the poem by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting the speaker’s desire to find a way to break free from the repetitive pattern of daily life.</p>",
        "text": "suggesting the speaker’s desire to find a way to break free from the repetitive pattern of daily life."
      },
      {
        "id": "B",
        "html": "<p>revealing the speaker’s feelings of disappointment over the predictable change in season.</p>",
        "text": "revealing the speaker’s feelings of disappointment over the predictable change in season."
      },
      {
        "id": "C",
        "html": "<p>emphasizing the speaker’s awareness of the future <span>significance</span> of the present moment in the <span>setting</span>.</p>",
        "text": "emphasizing the speaker’s awareness of the future significance of the present moment in the setting."
      },
      {
        "id": "D",
        "html": "<p>showing the speaker’s anticipation of specific emotions caused by an intimate <span>knowledge</span> of the <span>setting</span>.</p>",
        "text": "showing the speaker’s anticipation of specific emotions caused by an intimate knowledge of the setting."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "letter-from-brooklyn-2026-2027-form-b-official-shsat-2026-b-41",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Passage Set 6 of 7",
      "sourceQuestion": "41"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-9cb983ce5098c708457e.png\" alt=\"Official explanation for question 41\">",
    "points": 1,
    "prompt": "The speaker’s thoughts throughout the poem develop a theme by showing that",
    "promptHtml": "<p>The speaker’s thoughts throughout the <span>poem</span> develop a <span>theme</span> by showing that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>although people may hold expectations for the future, some people long for present experiences while they are still happening.</p>",
        "text": "although people may hold expectations for the future, some people long for present experiences while they are still happening."
      },
      {
        "id": "B",
        "html": "<p>though people come from different places, <span>most</span> people feel drawn to the special charm a city holds.</p>",
        "text": "though people come from different places, most people feel drawn to the special charm a city holds."
      },
      {
        "id": "C",
        "html": "<p>although people can make decisions about their life, there will always be some things beyond their control.</p>",
        "text": "although people can make decisions about their life, there will always be some things beyond their control."
      },
      {
        "id": "D",
        "html": "<p>though general expectations exist, people have no way of knowing <span>what</span> a given day will actually bring.</p>",
        "text": "though general expectations exist, people have no way of knowing what a given day will actually bring."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const letterFromBrooklyn20262027FormBPassageSet: ExamPassageSet = {
  id: "ela-letter-from-brooklyn-2026-2027-form-b",
  versionLabels: ["2026-2027 Form B"],
  section: "reading",
  questionCount: letterFromBrooklyn20262027FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "letter-from-brooklyn-2026-2027-form-b",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    titleHtml: "Letter from Brooklyn",
    bylineHtml: "by Jacob Scheier",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"B","section":"ELA - Passage Set 6 of 7","packageId":"e8299922599e8f0be3a87b5efc7c2a5452140bb8dbe168544f86d5d48220557f"},
    title: "Letter from Brooklyn",
    author: "Jacob Scheier",
    byline: "by Jacob Scheier",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<div data-poetry-line=\"true\">I can already see how this will end.</div> <div data-poetry-line=\"true\">How I will grow tired of the bridge’s</div> <div data-poetry-line=\"true\">steep incline, and the absent-minded tourists</div> <div data-poetry-line=\"true\">wandering into the bicycle path.</div> <div data-poetry-line=\"true\">The weather will turn cold.</div> <div data-poetry-line=\"true\">But that all happens later.</div> <div data-poetry-line=\"true\">For now it is the early edge of fall,</div> <div data-poetry-line=\"true\">leaves green still while the air narrows,</div> <div data-poetry-line=\"true\">is slightly crisp, almost grazing</div> <div data-poetry-line=\"true\">the hair of my arm like a passing stranger,</div> <div data-poetry-line=\"true\">as though the air has been forced into intimacy</div> <div data-poetry-line=\"true\">by the brevity&nbsp;of daylight.</div> <div data-poetry-line=\"true\">But when it starts darkening at 4,</div> <div data-poetry-line=\"true\">this closeness, I know, will be a felt distance,</div> <div data-poetry-line=\"true\">like someone drawing your attention</div> <div data-poetry-line=\"true\">to their lack of intimacy.</div> <div data-poetry-line=\"true\">These days I am still walking at a <span data-glossary-definition=\"meditative\" role=\"link\" tabindex=\"0\">cathedral</span> pace</div> <div data-poetry-line=\"true\">beneath the branches bending across avenues,</div> <div data-poetry-line=\"true\">brownstones like rows of lived-in <span data-glossary-definition=\"private places of prayer or worship\" role=\"link\" tabindex=\"0\">chapels,</span></div> <div data-poetry-line=\"true\">like a pop-up picture book I could have had as a child,</div> <div data-poetry-line=\"true\">but didn’t. How Brooklyn makes me <span data-glossary-definition=\"yearning for the past\" role=\"link\" tabindex=\"0\">nostalgic</span></div> <div data-poetry-line=\"true\">for the moment I am walking inside of.</div> <div data-poetry-line=\"true\">These late afternoons filled</div> <div data-poetry-line=\"true\">with a loneliness that makes me feel</div> <div data-poetry-line=\"true\">distinctly myself, and an awareness</div> <div data-poetry-line=\"true\">of how rare that is.</div>",
    sourceNote: "“Letter from Brooklyn” from LETTER FROM BROOKLYN: POEMS by Jacob Scheier, published by ECW Press. Copyright © 2013 by Jacob Scheier. All rights reserved.",
    text: letterFromBrooklyn20262027FormBPassageText,
    versionLabel: "2026-2027 Form B",
  }),
  questions: letterFromBrooklyn20262027FormBQuestions,
};
