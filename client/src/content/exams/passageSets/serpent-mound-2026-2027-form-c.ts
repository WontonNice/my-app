import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const serpentMound20262027FormCPassageText = "Ohio, 1846\nBrush Creek stood low when the museum men came\nwith their measuring tapes and sketchbooks.\nIt was winter. Fringed with ice,\nthe creek doubled back on itself\nas if it had forgotten something.\nPa was in Cincinnati, or else on his way home,\nso Ma told me to lead the men\ninto the marshy low grounds. It being winter,\nthere was little underbrush to speak of—\nin the summer there would have been\nbriars, poison ivy, biting flies. I listened\nfor the swish of a beaver’s heavy tail,\nthe chitter of a chickadee, or the cry of a hawk,\nbut the winter silence of the creek pressed\ndown on all of us like a weight.\nThe humps in the ground were all but\ninvisible until you were right up on them. The figure\nwas even less obvious: the sinuous body,\nthe tail coiled three times around,\nand at the other end, the mouth wide open.\nIn the summer the creek bottom was crowded\nwith so much life that you could trip over\nthe ridges of earth before you saw\nanything at all. In winter you could climb\na tree and get some idea of the whole thing:\nthe serpent’s body undulating, slithering\nsilently across the ancient\nearth. At the mouth end, there was an oval mound\nas if the snake were about to swallow an egg—\nas snakes sometimes did in our rickety\nhenhouse—my Pa always said, or\nas if swallowing the sun, one of the museum\nmen suggested, taking notes with his quill pen,\nan old-style inkhorn slung at his side.\nI liked that: swallowing the sun,\njust the sort of thing a snake might do,\nmight want to do. When, later, I told my sister Ruth,\nshe disagreed. It is singing to the sun,\nshe insisted. That is why its mouth\nis wide open. She said, “Sometimes I think\nI hear it on summer nights. Not swallowing, singing.”";

const serpentMound20262027FormCQuestions: ExamQuestion[] = [
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-26",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "26"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-6b14ff205c4b3f9e0dab.png\" alt=\"Official explanation for question 26\">",
    "points": 1,
    "prompt": "How does the poem’s form contribute to the poem’s meaning?",
    "promptHtml": "<p>How does the poem’s form contribute to the poem’s meaning?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The use of one continuous stanza and the pattern of the lines mimic the long and winding shape of the mound.</p>",
        "text": "The use of one continuous stanza and the pattern of the lines mimic the long and winding shape of the mound."
      },
      {
        "id": "B",
        "html": "<p>The uneven line lengths emphasize the variety of ways people interpret the meaning of <span>the mound.</span></p>",
        "text": "The uneven line lengths emphasize the variety of ways people interpret the meaning of the mound."
      },
      {
        "id": "C",
        "html": "<p>The dashes throughout the poem highlight the speaker’s changing thoughts about the significance of the mound.</p>",
        "text": "The dashes throughout the poem highlight the speaker’s changing thoughts about the significance of the mound."
      },
      {
        "id": "D",
        "html": "<p>The lack of a regular rhyme scheme and meter convey that the speaker struggles to comprehend the vastness of the mound.</p>",
        "text": "The lack of a regular rhyme scheme and meter convey that the speaker struggles to comprehend the vastness of the mound."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-27",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "27"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-1298fdaabcfe1dda8a8c.png\" alt=\"Official explanation for question 27\">",
    "points": 1,
    "prompt": "Which lines reveal how the setting affects the speaker and the men from the museum?",
    "promptHtml": "<p>Which lines reveal how the setting affects the speaker and the men from the museum?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“It being winter, / there was little underbrush to speak <span>of—”</span> <span>(lines 8–9)</span></p>",
        "text": "“It being winter, / there was little underbrush to speak of—” (lines 8–9)"
      },
      {
        "id": "B",
        "html": "<p>“but the winter silence of the creek <span>pressed /</span> down on all of us like a weight.” <span>(lines 14–15)</span></p>",
        "text": "“but the winter silence of the creek pressed / down on all of us like a weight.” (lines 14–15)"
      },
      {
        "id": "C",
        "html": "<p>“The humps in the ground were all <span>but /</span> invisible until you were right up on <span>them.”</span> <span>(lines 16–17)</span></p>",
        "text": "“The humps in the ground were all but / invisible until you were right up on them.” (lines 16–17)"
      },
      {
        "id": "D",
        "html": "<p>“In the summer the creek bottom was <span>crowded /</span> with so much life that you could <span>trip”</span> <span>(lines 21–22)</span></p>",
        "text": "“In the summer the creek bottom was crowded / with so much life that you could trip” (lines 21–22)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-28",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "28"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-cc16f32ad5af5cf125ff.png\" alt=\"Official explanation for question 28\">",
    "points": 1,
    "prompt": "Lines 1–2 contribute to the development of ideas in the poem by",
    "promptHtml": "<p>Lines 1–2 contribute to the development of ideas in the poem by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggesting that the men are too busy with their work to talk to the speaker.</p>",
        "text": "suggesting that the men are too busy with their work to talk to the speaker."
      },
      {
        "id": "B",
        "html": "<p>helping establish the reason for the men’s visit and purposeful behavior.</p>",
        "text": "helping establish the reason for the men’s visit and purposeful behavior."
      },
      {
        "id": "C",
        "html": "<p>hinting that the men have hidden motives for studying the mound.</p>",
        "text": "hinting that the men have hidden motives for studying the mound."
      },
      {
        "id": "D",
        "html": "<p>indicating why the speaker is fascinated by the men and wants to help them.</p>",
        "text": "indicating why the speaker is fascinated by the men and wants to help them."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-29",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "29"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-eec48cd409978a9ca447.png\" alt=\"Official explanation for question 29\">",
    "points": 1,
    "prompt": "Read line 28 from the poem.\n\nAt the mouth end, there was an oval mound\n\nHow does the line contribute to the development of ideas in the poem?",
    "promptHtml": "<p>Read line 28 from the poem.</p><blockquote><strong><strong>At the mouth end, there was an oval mound</strong></strong></blockquote><p>How does the line contribute to the development of ideas in the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It describes a feature of the mound that the men from the museum need to document.</p>",
        "text": "It describes a feature of the mound that the men from the museum need to document."
      },
      {
        "id": "B",
        "html": "<p>It introduces a comparison of the body of the mound with the head of the mound.</p>",
        "text": "It introduces a comparison of the body of the mound with the head of the mound."
      },
      {
        "id": "C",
        "html": "<p>It introduces a feature of the mound that has a different meaning to different people.</p>",
        "text": "It introduces a feature of the mound that has a different meaning to different people."
      },
      {
        "id": "D",
        "html": "<p>It describes a part of the mound that is difficult to see from far away.</p>",
        "text": "It describes a part of the mound that is difficult to see from far away."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-30",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "30"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-a6e5bfc95339bd6ea186.png\" alt=\"Official explanation for question 30\">",
    "points": 1,
    "prompt": "What impact do the phrases “all but / invisible” and “even less obvious” in lines 16–18 have on the meaning of the poem?",
    "promptHtml": "<p>What impact do the phrases “all but / invisible” and “even less obvious” in <span>lines 16–18</span> have on the meaning of the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They indicate that viewing the full size and shape of the mound is difficult.</p>",
        "text": "They indicate that viewing the full size and shape of the mound is difficult."
      },
      {
        "id": "B",
        "html": "<p>They suggest that the location of the mound is unknown to most people.</p>",
        "text": "They suggest that the location of the mound is unknown to most people."
      },
      {
        "id": "C",
        "html": "<p>They imply that the speaker wants the location of the mound to remain a secret.</p>",
        "text": "They imply that the speaker wants the location of the mound to remain a secret."
      },
      {
        "id": "D",
        "html": "<p>They reveal that the speaker is unfamiliar with the significance of the mound.</p>",
        "text": "They reveal that the speaker is unfamiliar with the significance of the mound."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-31",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "31"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-ad6fb3bde131fb9767dc.png\" alt=\"Official explanation for question 31\">",
    "points": 1,
    "prompt": "What impact do the words “swish,” “chitter,” and “cry” in lines 12–13 have in the poem?",
    "promptHtml": "<p>What impact do the words “<em>swish</em>,” “chitter,” and “cry” in <span>lines 12–13</span> have in the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>They illustrate how lively the mound’s surroundings are during the summer.</p>",
        "text": "They illustrate how lively the mound’s surroundings are during the summer."
      },
      {
        "id": "B",
        "html": "<p>They show how the mound disrupts natural life in the marsh.</p>",
        "text": "They show how the mound disrupts natural life in the marsh."
      },
      {
        "id": "C",
        "html": "<p>They indicate the variety of wildlife found in the area around the mound.</p>",
        "text": "They indicate the variety of wildlife found in the area around the mound."
      },
      {
        "id": "D",
        "html": "<p>They suggest that the speaker prefers the mound’s appearance in winter.</p>",
        "text": "They suggest that the speaker prefers the mound’s appearance in winter."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-32",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "32"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-fcb21c6858939cecdd26.png\" alt=\"Official explanation for question 32\">",
    "points": 1,
    "prompt": "How does the speaker’s interaction with Ruth in lines 37–41 convey a central idea of the poem?",
    "promptHtml": "<p>How does the speaker’s interaction with Ruth in <span>lines 37–41</span> convey a central idea of the poem?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It suggests that the most accurate interpretations of the mound come from knowing the purpose of the mound.</p>",
        "text": "It suggests that the most accurate interpretations of the mound come from knowing the purpose of the mound."
      },
      {
        "id": "B",
        "html": "<p>It emphasizes that there are multiple interpretations of the mound based on feelings and experiences.</p>",
        "text": "It emphasizes that there are multiple interpretations of the mound based on feelings and experiences."
      },
      {
        "id": "C",
        "html": "<p>It reveals the benefit of considering different interpretations of the mound’s significance.</p>",
        "text": "It reveals the benefit of considering different interpretations of the mound’s significance."
      },
      {
        "id": "D",
        "html": "<p>It implies that scientific study of the mound’s purpose will affect what the mound symbolizes <span>to people.</span></p>",
        "text": "It implies that scientific study of the mound’s purpose will affect what the mound symbolizes to people."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "serpent-mound-2026-2027-form-c-official-shsat-2026-c-33",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Passage Set 5 of 7",
      "sourceQuestion": "33"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-5e5241dfa9c1baad380d.png\" alt=\"Official explanation for question 33\">",
    "points": 1,
    "prompt": "The poet contrasts the speaker’s and Ruth’s points of view regarding the mound by using dialogue to",
    "promptHtml": "<p>The poet contrasts the speaker’s and Ruth’s points of view regarding the mound by using dialogue to</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>imply that Ruth is worried that her interpretation of the mound will be seen as too abstract.</p>",
        "text": "imply that Ruth is worried that her interpretation of the mound will be seen as too abstract."
      },
      {
        "id": "B",
        "html": "<p>indicate that Ruth hopes her interpretation of the mound will be shared by the men from&nbsp;the museum.</p>",
        "text": "indicate that Ruth hopes her interpretation of the mound will be shared by the men from the museum."
      },
      {
        "id": "C",
        "html": "<p>suggest that Ruth wants the speaker to agree with her interpretation of the mound.</p>",
        "text": "suggest that Ruth wants the speaker to agree with her interpretation of the mound."
      },
      {
        "id": "D",
        "html": "<p>show that Ruth has already decided on her interpretation of the mound.</p>",
        "text": "show that Ruth has already decided on her interpretation of the mound."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const serpentMound20262027FormCPassageSet: ExamPassageSet = {
  id: "ela-serpent-mound-2026-2027-form-c",
  versionLabels: ["2026-2027 Form C"],
  section: "reading",
  questionCount: serpentMound20262027FormCQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "serpent-mound-2026-2027-form-c",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    titleHtml: "Serpent Mound",
    blurbHtml: "<em>The Great Serpent Mound, located in Adams County, Ohio, is a human-made mound of earth that researchers believe was created between <span>300 <span data-small-caps=\"true\">B.C.</span></span> and <span><span data-small-caps=\"true\">A.D.</span> 1100</span> by an indigenous culture.</em>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"C","section":"ELA - Passage Set 5 of 7","packageId":"46282f8cc3e21fc29c3a6d24510f47fce1a61c1986f9443876f78eaf4e2a9da3"},
    title: "Serpent Mound",
    blurb: "The Great Serpent Mound, located in Adams County, Ohio, is a human-made mound of earth that researchers believe was created between 300 B.C. and A.D. 1100 by an indigenous culture.",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<p>Ohio, 1846</p><div data-poetry-line=\"true\">Brush Creek stood low when the museum men came</div> <div data-poetry-line=\"true\">with their measuring tapes and sketchbooks.</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; It was winter. Fringed with ice,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; the creek doubled back on itself</div> <div data-poetry-line=\"true\">as if it had forgotten something.</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; Pa was in Cincinnati, or else on his way home,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; so Ma told me to lead the men</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; into the marshy low grounds. It being winter,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; there was little underbrush to speak of—</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; in the summer there would have been</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; briars, poison ivy, biting flies. I listened</div> <div data-poetry-line=\"true\">for the <em>swish</em> of a beaver’s heavy tail,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; the chitter of a chickadee, or the cry of a hawk,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; but the winter silence of the creek pressed</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; down on all of us like a weight.</div> <div data-poetry-line=\"true\">The humps in the ground were all but</div> <div data-poetry-line=\"true\">invisible until you were right up on them. The figure</div> <div data-poetry-line=\"true\">was even less obvious: the sinuous body,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; the tail coiled three times around,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; and at the other end, the mouth wide open.</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; In the summer the creek bottom was crowded</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; with so much life that you could trip over</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; the ridges of earth before you saw</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; anything at all. In winter you could climb</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; a tree and get some idea of the whole thing:</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; the serpent’s body undulating, slithering</div> <div data-poetry-line=\"true\">silently across the ancient</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; earth. At the mouth end, there was an oval mound</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; as if the snake were about to swallow an egg—</div> <div data-poetry-line=\"true\">as snakes sometimes did in our rickety</div> <div data-poetry-line=\"true\">henhouse—my Pa always said, or</div> <div data-poetry-line=\"true\">as if swallowing the sun, one of the museum</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; men suggested, taking notes with his quill pen,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; an old-style inkhorn slung at his side.</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; I liked that: swallowing the sun,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; just the sort of thing a snake might do,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; might want to do. When, later, I told my sister Ruth,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; she disagreed. It is singing to the sun,</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; she insisted. That is why its mouth</div> <div data-poetry-line=\"true\">&nbsp; &nbsp; &nbsp; &nbsp; is wide open. She said, “Sometimes I think</div> <div data-poetry-line=\"true\">I hear it on summer nights. Not swallowing, singing.”</div>",
    text: serpentMound20262027FormCPassageText,
    versionLabel: "2026-2027 Form C",
  }),
  questions: serpentMound20262027FormCQuestions,
};
