import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const serpentMound20212022FormBVersion2PassageText = "Ohio, 1846\n\nBrush Creek stood low when the museum men came\nwith their measuring tapes and sketchbooks.\n   It was winter. Fringed with ice,\n   the creek doubled back on itself\n   as if it had forgotten something.\n   Pa was in Cincinnati, or else on his way home,\n      so Ma told me to lead the men\n      into the marshy low grounds. It being winter,\n         there was little underbrush to speak of—\n         in the summer there would have been\n      briars, poison ivy, biting flies. I listened\n      for the swish of a beaver’s heavy tail,\n   the chitter of a chickadee, or the cry of a hawk,\n   but the winter silence of the creek pressed\n   down on all of us like a weight.\nThe humps in the ground were all but\ninvisible until you were right up on them. The figure\n   was even less obvious: the sinuous body,\n   the tail coiled three times around,\n   and at the other end, the mouth wide open.\n      In the summer the creek bottom was crowded\n      with so much life that you could trip over\n         the ridges of earth before you saw\n         anything at all. In winter you could climb\n         a tree and get some idea of the whole thing:\n      the serpent’s body undulating, slithering\n      silently across the ancient\n   earth. At the mouth end, there was an oval mound\n   as if the snake were about to swallow an egg—\nas snakes sometimes did in our rickety\nhenhouse—my Pa always said, or\nas if swallowing the sun, one of the museum\n   men suggested, taking notes with his quill pen,\n   an old-style inkhorn slung at his side.\n   I liked that: swallowing the sun,\n      just the sort of thing a snake might do,\n      might want to do. When, later, I told my sister Ruth,\n         she disagreed. It is singing to the sun,\n         she insisted. That is why its mouth\n      is wide open. She said, “Sometimes I think\n   I hear it on summer nights. Not swallowing, singing.”";

const serpentMound20212022FormBVersion2Questions: ExamQuestion[] = [
  {
    "id": "serpent-mound-2021-2022-form-b-version-2-1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "42",
      "pages": [
        30
      ]
    },
    "explanation": "The question asks how the poem’s form contributes to the poem’s meaning.\nE. CORRECT. The poem is structured as one long stanza. The line lengths throughout the poem\nand the line indents (such as those in lines 7-10) create a visual effect so that the poem\nitself mimics the shape of the Serpent Mound.\nF. Incorrect. The uneven line lengths in the poem do not indicate the different interpretations of\nthe mound; separate stanzas or other stopping points would more effectively point to\ncontrasting ideas.\nG. Incorrect. The dashes in the poem lead to further explanation of a thought, not a change of\nthought.\nH. Incorrect. The lack of regular rhyme and meter is intended to create a conversational tone\nrather than show the speaker's struggle to grasp how large the mound is.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q042-explanation-1.png\" alt=\"Official explanation for source question 42; original printed answer labels retained.\" width=\"691\"></p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-2",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "43",
      "pages": [
        30
      ]
    },
    "explanation": "The question asks which lines reveal how the setting affects the speaker and the men from\nthe museum.\nA. Incorrect. The words “being winter” (line 8) work to establish the setting, but lines 8 and 9\ndo not describe the effect the winter setting has on the speaker and the men.\nB. CORRECT. The imagery in lines 14 and 15 describes how the winter silence makes the\nspeaker and the men feel emotional heaviness: it “pressed / down on all of us like a weight.”\nC. Incorrect. Although the words “the humps in the ground were all but / invisible” describe how\nthe setting appears to the speaker and the men, lines 16 and 17 do not describe how the\nsetting affects them.\nD. Incorrect. Although lines 21 and 22 do describe the setting, the lines do not describe how the\nsetting affects the speaker and the men. The lines describe the setting in the summer, which\nis before the men from the museum show up.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q043-explanation-1.png\" alt=\"Official explanation for source question 43; original printed answer labels retained.\" width=\"691\"></p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-3",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "44",
      "pages": [
        30
      ]
    },
    "explanation": "The question asks how lines 1-2 contribute to the development of ideas in the poem.\nE. Incorrect. The idea that the men are too busy with their work to talk to the speaker is not\nconveyed in the poem, and, in fact, one of the museum men discusses the oval mound with\nthe speaker (“as if swallowing the sun, one of the museum / men suggested” [lines 32-33]).\nF. CORRECT. The lines, with their mention of measuring tapes and sketchbooks, indicate that\nthe reasons the museum men came were to measure the mound and to draw sketches of it.\nG. Incorrect. There is little indication in the poem that the museum men have a hidden motive\nfor studying the mound. Lines 1-2 present a straightforward description of the men and their\nequipment, which emphasizes the men’s academic interest in studying the mound.\nH. Incorrect. While the speaker displays some curiosity about the work the museum men are\ndoing (“one of the museum / men suggested, taking notes with his quill pen, / an old-style\ninkhorn slung at his side. / I liked that” [lines 32—35]), lines 1-2 focus on introducing the\nidea that the mound is a formation that is worth formal study and examination by experts.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q044-explanation-1.png\" alt=\"Official explanation for source question 44; original printed answer labels retained.\" width=\"690\"></p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-4",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "45",
      "pages": [
        30
      ]
    },
    "explanation": "The question asks how line 28 contributes to the development of ideas in the poem.\nA. Incorrect. Although the museum men are documenting the shape of the mound in line 33,\nlines 29-32 and 35-41 focus on what the oval mound represents as interpreted by the\nmuseum men, the speaker, and the speaker's sister.\nB. Incorrect. While the lines preceding line 28 describe the body of the snake in detail (“you\ncould climb / a tree and get some idea of the whole thing: / the serpent’s body undulating,\nslithering / silently across the ancient / earth” [lines 24-28]), the purpose of line 28 is to\nbegin the development of the ideas about the oval shape at the end of the mound: the\nserpent’s mouth.\nCc. CORRECT. Line 28 introduces the presence of the oval mound at the mouth of the snake.\nThe meaning of this oval is of great interest to the museum men and the speaker. Line 28\nleads to the idea that there is speculation about the oval mound (“as if the snake were about\nto swallow an egg” [line 29], “as if swallowing the sun” [line 32], and “It is singing to the\nsun” [line 38]).\nD. Incorrect. The speaker does not say that the oval shape near the end of the mound is difficult\nto see. Earlier, the speaker says that the ridges of earth are difficult to see unless you are\nnear them, but the speaker does not say this about the oval shape.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q045-explanation-1.png\" alt=\"Official explanation for source question 45; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Read line 28 from the poem.\n\nAt the mouth end, there was an oval mound\n\nHow does the line contribute to the development of ideas in the poem?",
    "promptHtml": "<p>Read line 28 from the poem.</p><blockquote><strong>At the mouth end, there was an oval mound</strong></blockquote><p>How does the line contribute to the development of ideas in the poem?</p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-5",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "46",
      "pages": [
        31
      ]
    },
    "explanation": "The question asks what impact the phrases “all but / invisible” and “even less obvious” in\nlines 16-18 have on the meaning of the poem.\nE. CORRECT. The words “all but / invisible” indicate that a person must be close to see the\nhumps in the ground, while the phrase “even less obvious” indicates that a person must be\nfar away to see the overall snake shape of the mound.\nF. Incorrect. While the speaker has to lead the museum men to the mound because they did\nnot know the exact location, the words in lines 16-18 are related to the difficulty in viewing\nthe mound from the immediate surrounding area.\nG. Incorrect. The speaker is willing to take the museum men out to study the mound, so there is\nno indication in the poem that the speaker wants the location of the mound to remain a\nsecret. The words in lines 16-18 convey the idea that the mound is difficult to see.\nH. Incorrect. While the speaker contemplates the significance of certain elements of the mound,\nthe phrases in lines 16-18 relate to a viewer’s ability to see the physical shape of the mound,\nnot its deeper meaning.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q046-explanation-1.png\" alt=\"Official explanation for source question 46; original printed answer labels retained.\" width=\"693\"></p>",
    "points": 1,
    "prompt": "What impact do the phrases “all but / invisible” and “even less obvious” in lines 16–18 have on the meaning of the poem?",
    "promptHtml": "<p>What impact do the phrases “all but / invisible” and “even less obvious” in lines 16–18 have on the meaning of the poem?</p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-6",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "47",
      "pages": [
        31
      ]
    },
    "explanation": "The question asks what impact the words “swish,” “chitter,” and “cry” in lines 12-13 have in\nthe poem.\nA. CORRECT. The words highlight the sounds of the animals that visit the mound in the\nsummer: the “swish of a beaver’s heavy tail” (line 12), the “chitter of a chickadee” (line 13),\nand the “cry of a hawk” (line 13). These words help contrast the quiet stillness of the setting\naround the mound in the winter.\nB. Incorrect. While the words in lines 12-13 convey the sounds certain animals make in the\nsummer, the sounds of the animals that live near the mound are a natural part of life in the\narea, not a disruption.\nC. Incorrect. The speaker is contrasting the sounds of the animals around the mound during\nthe rest of the year with the silence of the winter months, not merely indicating the variety\nof wildlife.\nD. Incorrect. The speaker expresses the idea that the mound is more visible in the winter\nbecause of the lack of brush (“It being winter, / there was little underbrush to speak of”\n[lines 8-9]). Then lines 12-13 describe sounds, not the appearance of the mound in winter.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q047-explanation-1.png\" alt=\"Official explanation for source question 47; original printed answer labels retained.\" width=\"684\"></p>",
    "points": 1,
    "prompt": "What impact do the words “swish,” “chitter,” and “cry” in lines 12–13 have in the poem?",
    "promptHtml": "<p>What impact do the words “swish,” “chitter,” and “cry” in lines 12–13 have in the poem?</p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-7",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "48",
      "pages": [
        31
      ]
    },
    "explanation": "The question asks how the interaction between the speaker and Ruth in lines 37-41 conveys a\ncentral idea of the poem.\nE. Incorrect. While there are many different interpretations of the mound’s meaning, there is no\nway to determine which of the interpretations is most accurate, and there is no way to know\nthe mound’s true purpose.\nF. CORRECT. The interaction references Ruth’s interpretation of the open-mouth shape as a\nserpent singing to the sun. This interpretation creates a joyful mood. The speaker contrasts\nthis perspective with the idea that the mound is swallowing the sun, which creates a more\naggressive feeling. These various interpretations of a physical shape arise out of what the\nindividuals feel when they look at the mound.\nG. Incorrect. The speaker does not describe any benefit to considering what different people\nimagine when they see the mound. Instead, the speaker is simply describing different\ninterpretations,\nH. Incorrect. Ruth’s interpretation of the mound’s shape is fanciful and symbolic. It is unlikely\nthat scientific study would change the minds of people such as Ruth about the meaning of\nthe mound.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q048-explanation-1.png\" alt=\"Official explanation for source question 48; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "How does the speaker’s interaction with Ruth in lines 37–41 convey a central idea of the poem?",
    "promptHtml": "<p>How does the speaker’s interaction with Ruth in lines 37–41 convey a central idea of the poem?</p>",
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
    "id": "serpent-mound-2021-2022-form-b-version-2-8",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "49",
      "pages": [
        31
      ]
    },
    "explanation": "The question asks how the poet uses dialogue to contrast the points of view of the speaker and\nRuth regarding the mound.\nA. Incorrect. The interpretation Ruth offers of the mound as a snake singing is abstract, but\nRuth does not seem concerned that it is an overly metaphorical or figurative interpretation.\nThe dialogue serves to highlight that Ruth is firm in her belief.\nB. Incorrect. There is no indication that the museum men are considering Ruth’s interpretation\nof the mound or that Ruth wants them to share her interpretation. Ruth’s interpretation is\nmeant to convey an abstract idea, while the museum men would be looking for a firm\nacademic explanation of the mound. Ruth is persistent in her belief, and the dialogue does\nnot suggest that she is concerned with the museum men’s interpretation or findings.\nC. Incorrect. Ruth merely states her interpretation and says that she thinks she hears the\nD. CORRECT. Beginning in line 37, after the speaker suggests the mound is swallowing the sun,\nRuth disagrees. The poet uses the word “insisted” in line 39 to show that Ruth firmly believes\nin her own interpretation of the mound.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q049-explanation-1.png\" alt=\"Official explanation for source question 49; original printed answer labels retained.\" width=\"691\"></p>",
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
        "html": "<p>indicate that Ruth hopes her interpretation of the mound will be shared by the men from the museum.</p>",
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

export const passageserpentMound20212022FormBVersion2Set: ExamPassageSet = {
  id: "ela-serpent-mound-2021-2022-form-b-version-2",
  versionLabels: ["2021-2022 Form B"],
  label: "2021-2022 Form B",
  section: "reading",
  questionCount: serpentMound20212022FormBVersion2Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "serpent-mound-2021-2022-form-b-version-2",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    titleHtml: "Serpent Mound",
    blurbHtml: "<em>The Great Serpent Mound, located in Adams County, Ohio, is a human-made mound of earth that researchers believe was created between <span>300 <span data-small-caps=\"true\">B.C.</span></span> and <span><span data-small-caps=\"true\">A.D.</span> 1100</span> by an indigenous culture.</em>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2021-2022-form-b","label":"2021-2022 Form B","year":"2021-2022","form":"B","packageId":"29eaaef0fb12e52c61891e5eda276d39910bba65ac378b2ac9334a787c4b8df1"},
    title: "Serpent Mound",
    blurb: "The Great Serpent Mound, located in Adams County, Ohio, is a human-made mound of earth that researchers believe was created between 300 B.C. and A.D. 1100 by an indigenous culture.",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">Ohio, 1846</p><div data-poetry-line=\"true\">Brush Creek stood low when the museum men came</div><div data-poetry-line=\"true\">with their measuring tapes and sketchbooks.</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;It was winter. Fringed with ice,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;the creek doubled back on itself</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;as if it had forgotten something.</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;Pa was in Cincinnati, or else on his way home,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;so Ma told me to lead the men</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;into the marshy low grounds. It being winter,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;there was little underbrush to speak of—</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in the summer there would have been</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;briars, poison ivy, biting flies. I listened</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for the <em>swish</em> of a beaver’s heavy tail,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;the chitter of a chickadee, or the cry of a hawk,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;but the winter silence of the creek pressed</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;down on all of us like a weight.</div><div data-poetry-line=\"true\">The humps in the ground were all but</div><div data-poetry-line=\"true\">invisible until you were right up on them. The figure</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;was even less obvious: the sinuous body,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;the tail coiled three times around,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;and at the other end, the mouth wide open.</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the summer the creek bottom was crowded</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with so much life that you could trip over</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the ridges of earth before you saw</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anything at all. In winter you could climb</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a tree and get some idea of the whole thing:</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the serpent’s body undulating, slithering</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;silently across the ancient</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;earth. At the mouth end, there was an oval mound</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;as if the snake were about to swallow an egg—</div><div data-poetry-line=\"true\">as snakes sometimes did in our rickety</div><div data-poetry-line=\"true\">henhouse—my Pa always said, or</div><div data-poetry-line=\"true\">as if swallowing the sun, one of the museum</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;men suggested, taking notes with his quill pen,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;an old-style inkhorn slung at his side.</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;I liked that: swallowing the sun,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;just the sort of thing a snake might do,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;might want to do. When, later, I told my sister Ruth,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;she disagreed. It is singing to the sun,</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;she insisted. That is why its mouth</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;is wide open. She said, “Sometimes I think</div><div data-poetry-line=\"true\">&nbsp;&nbsp;&nbsp;I hear it on summer nights. Not swallowing, singing.”</div>",
    text: serpentMound20212022FormBVersion2PassageText,
    versionLabel: "2021-2022 Form B",
  }),
  questions: serpentMound20212022FormBVersion2Questions,
};
