import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const odeToFireworks20262027FormDPassageText = "In autumn my mother drove us to the edge of the field\nwhere the fair was set up year after year:\nthe carousel, the bumper cars, the long, low sheds\nfilled with prizewinning animals.\nWe—my sister, my cousin, and I—were ready for bed,\nalready in our pajamas. This was a treat we waited\nall year for. We waited in the darkness\nfor the first low, dull thwumps, like someone\nbeating an old, filthy rug hung on a wash line.\nThen we counted the seconds between the lightning\nand thunder, as we also used to do, until the sky\nlit up: red, blue, green, gold. In my mind’s eye\nI can still see the straggly, ancient oak whose branches\nreached up past the exhibition halls, silhouetted\nagainst the spectrum of stars that cascaded behind it.\n\nIt was one thing to look up into the sky\nand imagine yourself in it or to make out pictures\namong the clouds, which my sister liked to do.\nNo, I would tell her, that cloud\ndoes not look like an elephant, a hat, an umbrella.\nBut it was another thing to see\nthe sky at night written upon\nwith those jewels. (We lived in the country:\nnight was night.) All around us, crickets\nstridulated in the stubble of what had been\nsomebody’s cornfield, their song rising and falling.\nYou could smell winter on the air’s edge.\n\nNow, in the city, when the sky dips into shadow\nat New Year’s or on the Fourth of July, I find myself\ncraning my neck upward at odd moments.\nThe city sky is always lit up. This is where we live now,\nand it is how we live now, awash in light\nof every hue. Everything is a constant celebration:\npicking up washing at the cleaner’s or stopping by\nthe corner market for a loaf of heavy bread.\nAnd the music around me is the music of people,\ntheir voices rising and falling in a hundred languages.\nBut beneath the yellowish glow deep in the sky\nof all our city lights pelting out into the universe,\nI remember the feel of the pickup truck bumping\nacross the ridged field, as I kept waiting for those\nchildhood bursts, watching as they escorted us home.";

const odeToFireworks20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-21",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "21"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-7dabd0453abe5f7f9a75.png\" alt=\"Official explanation for question 21\">",
    "points": 1,
    "prompt": "The comparison in lines 8–9 of the poem is used to convey",
    "promptHtml": "<p>The comparison in <span>lines 8–9</span> of the poem is used to convey</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the muffled pounding of explosions in the distance.</p>",
        "text": "the muffled pounding of explosions in the distance."
      },
      {
        "id": "B",
        "html": "<p>the way lightning streaks through the clouds.</p>",
        "text": "the way lightning streaks through the clouds."
      },
      {
        "id": "C",
        "html": "<p>the echoes of thunder on an autumn night.</p>",
        "text": "the echoes of thunder on an autumn night."
      },
      {
        "id": "D",
        "html": "<p>the glow of sparks falling from the sky.</p>",
        "text": "the glow of sparks falling from the sky."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-22",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "22"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-7b6c6b236612c4bbe76a.png\" alt=\"Official explanation for question 22\">",
    "points": 1,
    "prompt": "Read lines 22–23 from the poem.\n\nthe sky at night written upon\nwith those jewels.\n\nWhat does the word choice in these lines convey about the speaker?",
    "promptHtml": "<p>Read lines 22–23 from the poem.</p><blockquote><strong><strong>the sky at night written upon<br></strong><strong>with those jewels.</strong></strong></blockquote><p>What does the word choice in these lines convey about the speaker?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The speaker values material possessions.</p>",
        "text": "The speaker values material possessions."
      },
      {
        "id": "B",
        "html": "<p>The speaker imagines that the fireworks are magical.</p>",
        "text": "The speaker imagines that the fireworks are magical."
      },
      {
        "id": "C",
        "html": "<p>The speaker believes that the country setting is distinctive.</p>",
        "text": "The speaker believes that the country setting is distinctive."
      },
      {
        "id": "D",
        "html": "<p>The speaker cherishes the memory of seeing fireworks as a child.</p>",
        "text": "The speaker cherishes the memory of seeing fireworks as a child."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-23",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "23"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-8f72a49a53f29f321296.png\" alt=\"Official explanation for question 23\">",
    "points": 1,
    "prompt": "The use of italics on the word “night” in line 24 is most likely intended to emphasize the",
    "promptHtml": "<p>The use of italics on the word <em>“night”</em> in <span>line 24</span> is most likely intended to emphasize the</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sense of mystery in the darkness.</p>",
        "text": "sense of mystery in the darkness."
      },
      {
        "id": "B",
        "html": "<p>sense of absolute darkness.</p>",
        "text": "sense of absolute darkness."
      },
      {
        "id": "C",
        "html": "<p>speaker’s fear of night.</p>",
        "text": "speaker’s fear of night."
      },
      {
        "id": "D",
        "html": "<p>speaker’s certainty about that night.</p>",
        "text": "speaker’s certainty about that night."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-24",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "24"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-adb0ba13a3c5b92328cc.png\" alt=\"Official explanation for question 24\">",
    "points": 1,
    "prompt": "What is the purpose of the repeated words “rising and falling” in lines 26 and 37?",
    "promptHtml": "<p>What is the purpose of the repeated words “rising and falling” in <span>lines 26</span> and 37?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>to create a distinction between solitude and meaningful interaction</p>",
        "text": "to create a distinction between solitude and meaningful interaction"
      },
      {
        "id": "B",
        "html": "<p>to demonstrate a connection between the speaker’s past and present</p>",
        "text": "to demonstrate a connection between the speaker’s past and present"
      },
      {
        "id": "C",
        "html": "<p>to emphasize the speaker’s attention to the surrounding sounds</p>",
        "text": "to emphasize the speaker’s attention to the surrounding sounds"
      },
      {
        "id": "D",
        "html": "<p>to compare the fireworks to common sights and sounds</p>",
        "text": "to compare the fireworks to common sights and sounds"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-25",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "25"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-863c73aac38cc64658a2.png\" alt=\"Official explanation for question 25\">",
    "points": 1,
    "prompt": "Read lines 41–42 from the poem.\nI kept waiting for those\nchildhood bursts, watching as they escorted us home.\nHow does this memory affect the speaker?",
    "promptHtml": "<p>Read <span>lines 41–42</span> from the poem.</p> <p data-align=\"indent\"><strong>I kept waiting for those<br>childhood bursts, watching as they escorted us home.</strong></p> <p>How does this memory affect the speaker?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The speaker believes it is impossible to ever return to a place in the past.</p>",
        "text": "The speaker believes it is impossible to ever return to a place in the past."
      },
      {
        "id": "B",
        "html": "<p>The speaker is still amused by the impatience felt during fireworks displays.</p>",
        "text": "The speaker is still amused by the impatience felt during fireworks displays."
      },
      {
        "id": "C",
        "html": "<p>The speaker now regrets abandoning the rural way of life.</p>",
        "text": "The speaker now regrets abandoning the rural way of life."
      },
      {
        "id": "D",
        "html": "<p>The speaker feels a sense of comfort when reflecting on the past.</p>",
        "text": "The speaker feels a sense of comfort when reflecting on the past."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2026-2027-form-d-official-shsat-2026-d-26",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 4 of 7",
      "sourceQuestion": "26"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-d7e1aea143c8c793c2e0.png\" alt=\"Official explanation for question 26\">",
    "points": 1,
    "prompt": "The fireworks in the poem represent the speaker’s",
    "promptHtml": "<p>The fireworks in the poem represent the speaker’s</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>wish to return to a simpler way of living.</p>",
        "text": "wish to return to a simpler way of living."
      },
      {
        "id": "B",
        "html": "<p>bittersweet feelings about leaving the past behind.</p>",
        "text": "bittersweet feelings about leaving the past behind."
      },
      {
        "id": "C",
        "html": "<p>high expectations for everyday life.</p>",
        "text": "high expectations for everyday life."
      },
      {
        "id": "D",
        "html": "<p>reflections on past interactions with relatives.</p>",
        "text": "reflections on past interactions with relatives."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const odeToFireworks20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-ode-to-fireworks-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D"],
  section: "reading",
  questionCount: odeToFireworks20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "ode-to-fireworks-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    titleHtml: "Ode to Fireworks",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 4 of 7","packageId":"1fb4766ff1be112907339844ddcabe378593a753c36e84ec601ef465df47df1f"},
    title: "Ode to Fireworks",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<div data-poetry-line=\"true\">In autumn my mother drove us to the edge of the field</div> <div data-poetry-line=\"true\">where the fair was set up year after year:</div> <div data-poetry-line=\"true\">the carousel, the bumper cars, the long, low sheds</div> <div data-poetry-line=\"true\">filled with prizewinning animals.</div> <div data-poetry-line=\"true\">We—my sister, my cousin, and I—were ready for bed,</div> <div data-poetry-line=\"true\">already in our pajamas. This was a treat we waited</div> <div data-poetry-line=\"true\">all year for. We waited in the darkness</div> <div data-poetry-line=\"true\">for the first low, dull <em>thwumps</em>, like someone</div> <div data-poetry-line=\"true\">beating an old, filthy rug hung on a wash line.</div> <div data-poetry-line=\"true\">Then we counted the seconds between the lightning</div> <div data-poetry-line=\"true\">and thunder, as we also used to do, until the sky</div> <div data-poetry-line=\"true\">lit up: red, blue, green, gold. In my mind’s eye</div> <div data-poetry-line=\"true\">I can still see the straggly, ancient oak whose branches</div> <div data-poetry-line=\"true\">reached up past the exhibition halls, silhouetted</div> <div data-poetry-line=\"true\">against the spectrum of stars that cascaded behind it.<br><br></div> <div data-poetry-line=\"true\">It was one thing to look up into the sky</div> <div data-poetry-line=\"true\">and imagine yourself in it or to make out pictures</div> <div data-poetry-line=\"true\">among the clouds, which my sister liked to do.</div> <div data-poetry-line=\"true\">No, I would tell her, that cloud</div> <div data-poetry-line=\"true\">does <em>not</em> look like an elephant, a hat, an umbrella.</div> <div data-poetry-line=\"true\">But it was another thing to see</div> <div data-poetry-line=\"true\">the sky at night written upon</div> <div data-poetry-line=\"true\">with those jewels. (We lived in the country:</div> <div data-poetry-line=\"true\">night was <em>night</em>.) All around us, crickets</div> <div data-poetry-line=\"true\">stridulated in the stubble of what had been</div> <div data-poetry-line=\"true\">somebody’s cornfield, their song rising and falling.</div> <div data-poetry-line=\"true\">You could smell winter on the air’s edge.<br><br></div> <div data-poetry-line=\"true\">Now, in the city, when the sky dips into shadow</div> <div data-poetry-line=\"true\">at New Year’s or on the Fourth of July, I find myself</div> <div data-poetry-line=\"true\">craning my neck upward at odd moments.</div> <div data-poetry-line=\"true\">The city sky is always lit up. This is where we live now,</div> <div data-poetry-line=\"true\">and it is how we live now, awash in light</div> <div data-poetry-line=\"true\">of every hue. Everything is a constant celebration:</div> <div data-poetry-line=\"true\">picking up washing at the cleaner’s or stopping by</div> <div data-poetry-line=\"true\">the corner market for a loaf of heavy bread.</div> <div data-poetry-line=\"true\">And the music around me is the music of people,</div> <div data-poetry-line=\"true\">their voices rising and falling in a hundred languages.</div> <div data-poetry-line=\"true\">But beneath the yellowish glow deep in the sky</div> <div data-poetry-line=\"true\">of all our city lights pelting out into the universe,</div> <div data-poetry-line=\"true\">I remember the feel of the pickup truck bumping</div> <div data-poetry-line=\"true\">across the ridged field, as I kept waiting for those</div> <div data-poetry-line=\"true\">childhood bursts, watching as they escorted us home.</div>",
    text: odeToFireworks20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: odeToFireworks20262027FormDQuestions,
};
