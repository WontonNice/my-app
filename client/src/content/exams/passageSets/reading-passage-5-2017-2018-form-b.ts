import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage520172018FormBPassageText = "Archaeologists first succeeded in using tree-ring dating while excavating ancient Pueblo Native American villages in the southwestern United States during the 1920s. At that time, no one knew when the villages had been occupied, or for how long, but the logs used in the buildings provided a clue. Scientists had long known that trees add a new growth ring to their circumferences during each growing season. Drought or early frost results in little growth and narrow rings. Good growing years result in wide rings. Archaeologists knew that by matching identical patterns of wide and narrow rings in sections of two different logs, they could determine which log was older. For example, a log with a certain pattern of rings near its outside edge would indicate a specific series of good and bad growing seasons. This log would have been cut down before a log of comparable size that shows the identical pattern near its center.\n\nBut how could these ring patterns help determine the actual dates for the abandoned Pueblo villages? Archaeologists had already used the ring patterns of trees with overlapping lifetimes to establish a tree-ring chronology for the southwestern United States that went back to . . 1260. That work had been done in a Hopi village called Oraibi. Oraibi had been continuously inhabited since before the arrival of the first Spanish explorers in 1540.\n\nThat same team of archaeologists also developed a relative, or floating, chronology for the abandoned Pueblo villages by matching up the ring patterns of the various logs used in the buildings. With this floating chronology, the archaeologists could tell which logs were older and which were more recent. None could be precisely dated, since no log had a pattern of tree rings that matched any part of the established chronology. It was clear from this evidence, however, that the buildings must have been constructed before 1260.\n\nFinally, continued excavations turned up a “key” beam. The outer ring pattern of the key beam overlapped the earliest rings in the established chronology. Furthermore, its inner ring pattern matched the pattern formed by the most recent rings of the floating chronology. Thus, the chronology for the abandoned Pueblo villages could be known with certainty. Counting backward from the present, the archaeologists estimated that the villages had been occupied between 900 and 1300.\n\nThe tree rings also suggested why the villages had been abandoned. The rings for the years 1276 to 1299 were very thin, indicating a severe drought that lasted for twenty-three years. Most likely the villagers had left their homes to search for a more hospitable climate.";

const readingPassage520172018FormBQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q046",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "46",
      "pages": [
        20
      ]
    },
    "explanation": "46. (H) Option E cannot be the topic of the passage because only the first paragraph discusses how weather conditions affect tree growth. Option F is too broad to be a good statement of the topic. The reason for the abandonment of the Pueblo villages (Option G) is mentioned only in the last paragraph, so it is not the main topic. Option H offers the best statement of the topic of the passage.",
    "explanationHtml": "<p>46. (H) Option E cannot be the topic of the passage because only the first paragraph discusses how weather conditions affect tree growth. Option F is too broad to be a good statement of the topic. The reason for the abandonment of the Pueblo villages (Option G) is mentioned only in the last paragraph, so it is not the main topic. Option H offers the best statement of the topic of the passage.</p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>how variations in weather conditions affect tree growth</p>",
        "text": "how variations in weather conditions affect tree growth"
      },
      {
        "id": "B",
        "html": "<p>recent breakthroughs in understanding Native American cultures</p>",
        "text": "recent breakthroughs in understanding Native American cultures"
      },
      {
        "id": "C",
        "html": "<p>why the Pueblo villages were abandoned</p>",
        "text": "why the Pueblo villages were abandoned"
      },
      {
        "id": "D",
        "html": "<p>how tree-ring dating can establish the age of archaeological findings</p>",
        "text": "how tree-ring dating can establish the age of archaeological findings"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q047",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "47",
      "pages": [
        20
      ]
    },
    "explanation": "47. (D) Option A is true but can be proved without a key beam. Option B is not related to the key beam. Option C misrepresents the importance of the key beam. Option D is correct. The key beam, with its overlapping ring patterns from the established and floating chronologies, allowed archaeologists to connect the two chronologies.",
    "explanationHtml": "<p>47. (D) Option A is true but can be proved without a key beam. Option B is not related to the key beam. Option C misrepresents the importance of the key beam. Option D is correct. The key beam, with its overlapping ring patterns from the established and floating chronologies, allowed archaeologists to connect the two chronologies.</p>",
    "points": 1,
    "prompt": "What was the importance of the key beam described in the fourth paragraph?",
    "promptHtml": "<p>What was the importance of the key beam described in the fourth paragraph?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>It proved that trees of the same age would have identical tree-ring patterns.</p>",
        "text": "It proved that trees of the same age would have identical tree-ring patterns."
      },
      {
        "id": "B",
        "html": "<p>It helped archaeologists determine why the villages had been built at that time.</p>",
        "text": "It helped archaeologists determine why the villages had been built at that time."
      },
      {
        "id": "C",
        "html": "<p>It revealed a new floating chronology for archaeologists to investigate.</p>",
        "text": "It revealed a new floating chronology for archaeologists to investigate."
      },
      {
        "id": "D",
        "html": "<p>It connected the floating chronology to the established chronology.</p>",
        "text": "It connected the floating chronology to the established chronology."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q048",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "48",
      "pages": [
        20
      ]
    },
    "explanation": "48. (F) The size of the tree rings provides information about the health of the tree and insight about environmental factors and weather patterns (Option F). The fact that archaeologists rely on tree-ring dating suggests that it is accurate (Option E), but this does not explain why the author describes ring widths. Option G is incorrect because the passage explains that trees that live in a specific place at the same time will have the same tree-ring pattern. Option H is incorrect because it does not offer an explanation about the conclusions that can be made from the size of tree rings.",
    "explanationHtml": "<p>48. (F) The size of the tree rings provides information about the health of the tree and insight about environmental factors and weather patterns (Option F). The fact that archaeologists rely on tree-ring dating suggests that it is accurate (Option E), but this does not explain why the author describes ring widths. Option G is incorrect because the passage explains that trees that live in a specific place at the same time will have the same tree-ring pattern. Option H is incorrect because it does not offer an explanation about the conclusions that can be made from the size of tree rings.</p>",
    "points": 1,
    "prompt": "The author explains the causes of wide and narrow tree rings in lines 8–13 in order to",
    "promptHtml": "<p>The author explains the causes of wide and narrow tree rings in lines 8–13 in order to</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>emphasize that tree-ring dating is highly accurate.</p>",
        "text": "emphasize that tree-ring dating is highly accurate."
      },
      {
        "id": "B",
        "html": "<p>highlight how tree rings help determine past weather patterns.</p>",
        "text": "highlight how tree rings help determine past weather patterns."
      },
      {
        "id": "C",
        "html": "<p>emphasize that a tree’s ring patterns grow in a unique way.</p>",
        "text": "emphasize that a tree’s ring patterns grow in a unique way."
      },
      {
        "id": "D",
        "html": "<p>highlight the importance of studying tree rings.</p>",
        "text": "highlight the importance of studying tree rings."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q049",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "49",
      "pages": [
        20
      ]
    },
    "explanation": "49. (B) Tree-ring dating helped reveal that the Pueblo villages were likely abandoned during a long drought (Option B). Option C first led archaeologists to realize that the villages had been abandoned. Option A and Option D contributed to establishing the chronology but do not explain why the villages were abandoned.",
    "explanationHtml": "<p>49. (B) Tree-ring dating helped reveal that the Pueblo villages were likely abandoned during a long drought (Option B). Option C first led archaeologists to realize that the villages had been abandoned. Option A and Option D contributed to establishing the chronology but do not explain why the villages were abandoned.</p>",
    "points": 1,
    "prompt": "Which evidence best supports the idea that tree-ring dating helped archaeologists understand why the Pueblo villages were abandoned?",
    "promptHtml": "<p>Which evidence best supports the idea that tree-ring dating helped archaeologists understand why the Pueblo villages were abandoned?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>the details about the Hopi village Oraibi</p>",
        "text": "the details about the Hopi village Oraibi"
      },
      {
        "id": "B",
        "html": "<p>the details about the twenty-three-year drought</p>",
        "text": "the details about the twenty-three-year drought"
      },
      {
        "id": "C",
        "html": "<p>the details about the discovery of the Pueblo villages</p>",
        "text": "the details about the discovery of the Pueblo villages"
      },
      {
        "id": "D",
        "html": "<p>the details about the floating chronology</p>",
        "text": "the details about the floating chronology"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q050",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "50",
      "pages": [
        20
      ]
    },
    "explanation": "50. (E) The third paragraph describes the development of a floating chronology that did not overlap the established chronology that went back to 1260. This implies that the years of the floating chronology preceded the years of the established chronology, which is stated in Option E. Option F is incorrect because the pattern of tree-rings in the logs reveals more about the chronology than the number of tree-rings does. Archaeologists knew that the Pueblo villages were abandoned before the Hopi villages were established because the Hopi villages had been continuously inhabited (lines 31–33), ruling out Option G. Option H is incorrect because the size of the logs does not provide information about their connection to the established chronology.",
    "explanationHtml": "<p>50. (E) The third paragraph describes the development of a floating chronology that did not overlap the established chronology that went back to 1260. This implies that the years of the floating chronology preceded the years of the established chronology, which is stated in Option E. Option F is incorrect because the pattern of tree-rings in the logs reveals more about the chronology than the number of tree-rings does. Archaeologists knew that the Pueblo villages were abandoned before the Hopi villages were established because the Hopi villages had been continuously inhabited (lines 31–33), ruling out Option G. Option H is incorrect because the size of the logs does not provide information about their connection to the established chronology.</p>",
    "points": 1,
    "prompt": "Why did the archaeologists conclude that the buildings in the abandoned Pueblo villages were constructed before A.D. 1260?",
    "promptHtml": "<p>Why did the archaeologists conclude that the buildings in the abandoned Pueblo villages were constructed before A.D. 1260?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>The logs in the Pueblo buildings did not share any ring patterns with the established chronology from the Hopi village.</p>",
        "text": "The logs in the Pueblo buildings did not share any ring patterns with the established chronology from the Hopi village."
      },
      {
        "id": "B",
        "html": "<p>The logs in the Pueblo buildings had fewer rings than the logs from the buildings in the Hopi village.</p>",
        "text": "The logs in the Pueblo buildings had fewer rings than the logs from the buildings in the Hopi village."
      },
      {
        "id": "C",
        "html": "<p>The Pueblo villages were abandoned before the Hopi village was established.</p>",
        "text": "The Pueblo villages were abandoned before the Hopi village was established."
      },
      {
        "id": "D",
        "html": "<p>The Pueblo villages and the Hopi village were constructed from logs of similar size.</p>",
        "text": "The Pueblo villages and the Hopi village were constructed from logs of similar size."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-5-2017-2018-form-b-pdf-shsat-2017-2018-b-q051",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "51",
      "pages": [
        20
      ]
    },
    "explanation": "51. (C) Lines 41–44 suggest that archaeologists compared samples from both villages in hopes of finding a beam where the patterns matched (Option C). The discovery of the key beam is described later in the passage. Option A, Option B, and Option D are related to information that can be gathered from examining the logs, but the options do not accurately explain the archaeologists’ purpose of finding a key beam.",
    "explanationHtml": "<p>51. (C) Lines 41–44 suggest that archaeologists compared samples from both villages in hopes of finding a beam where the patterns matched (Option C). The discovery of the key beam is described later in the passage. Option A, Option B, and Option D are related to information that can be gathered from examining the logs, but the options do not accurately explain the archaeologists’ purpose of finding a key beam.</p>",
    "points": 1,
    "prompt": "Why did archaeologists compare the logs from buildings in the abandoned Pueblo villages with logs from the Hopi village?",
    "promptHtml": "<p>Why did archaeologists compare the logs from buildings in the abandoned Pueblo villages with logs from the Hopi village?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to find the oldest and most recent logs used in the Pueblo villages</p>",
        "text": "to find the oldest and most recent logs used in the Pueblo villages"
      },
      {
        "id": "B",
        "html": "<p>to find evidence that would help explain what caused people to leave the Pueblo villages</p>",
        "text": "to find evidence that would help explain what caused people to leave the Pueblo villages"
      },
      {
        "id": "C",
        "html": "<p>to find a log from the Pueblo villages that had tree rings that matched logs from the Hopi village</p>",
        "text": "to find a log from the Pueblo villages that had tree rings that matched logs from the Hopi village"
      },
      {
        "id": "D",
        "html": "<p>to find evidence that the Pueblo villages were constructed before the Hopi village</p>",
        "text": "to find evidence that the Pueblo villages were constructed before the Hopi village"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const readingPassage520172018FormBPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-5-2017-2018-form-b",
  versionLabels: ["2017-2018 Form B"],
  label: "2017-2018 Form B",
  section: "reading",
  questionCount: readingPassage520172018FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-5-2017-2018-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 5",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-b","label":"2017-2018 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf","year":"2017-2018","form":"B","packageId":"7a2d7d6a39d44530af4a2496c5862d1dc01b2a3c74dd33b4699a5e02d444e0a3"},
    title: "Reading Passage 5",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">Archaeologists first succeeded in using tree-ring dating while excavating ancient Pueblo Native American villages in the southwestern United States during the <sup>5</sup> 1920s. At that time, no one knew when the villages had been occupied, or for how long, but the logs used in the buildings provided a clue. Scientists had long known that trees add a new growth ring to their <sup>10</sup> circumferences during each growing season. Drought or early frost results in little growth and narrow rings. Good growing years result in wide rings. Archaeologists knew that by matching identical patterns of wide and <sup>15</sup> narrow rings in sections of two different logs, they could determine which log was older. For example, a log with a certain pattern of rings near its outside edge would indicate a specific series of good and bad growing seasons. This <sup>20</sup> log would have been cut down before a log of comparable size that shows the identical pattern near its center.</p><p data-numbered=\"false\">But how could these ring patterns help determine the actual dates for the abandoned <sup>25</sup> Pueblo villages? Archaeologists had already used the ring patterns of trees with overlapping lifetimes to establish a tree-ring chronology for the southwestern United States that went back to . . 1260. That work <sup>30</sup> had been done in a Hopi village called Oraibi. Oraibi had been continuously inhabited since before the arrival of the first Spanish explorers in 1540.</p><p data-numbered=\"false\">That same team of archaeologists also <sup>35</sup> developed a relative, or floating, chronology for the abandoned Pueblo villages by matching up the ring patterns of the various logs used in the buildings. With this floating chronology, the archaeologists could tell <sup>40</sup> which logs were older and which were more recent. None could be precisely dated, since no log had a pattern of tree rings that matched any part of the established chronology. It was clear from this evidence, <sup>45</sup> however, that the buildings must have been constructed before 1260.</p><p data-numbered=\"false\">Finally, continued excavations turned up a “key” beam. The outer ring pattern of the key beam overlapped the earliest rings in the <sup>50</sup> established chronology. Furthermore, its inner ring pattern matched the pattern formed by the most recent rings of the floating chronology. Thus, the chronology for the abandoned Pueblo villages could be <sup>55</sup> known with certainty. Counting backward from the present, the archaeologists estimated that the villages had been occupied between 900 and 1300.</p><p data-numbered=\"false\">The tree rings also suggested why the <sup>60</sup> villages had been abandoned. The rings for the years 1276 to 1299 were very thin, indicating a severe drought that lasted for twenty-three years. Most likely the villagers had left their homes to search for a more <sup>65</sup> hospitable climate.</p>",
    text: readingPassage520172018FormBPassageText,
    versionLabel: "2017-2018 Form B",
  }),
  questions: readingPassage520172018FormBQuestions,
};
