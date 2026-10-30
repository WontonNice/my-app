import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const wolvesOfTheSea20262027FormDPassageText = "The cool and misty landscape of the Great Bear Rainforest can be found along the coast of British Columbia, Canada, and its nearby islands, from Vancouver Island to the Alaskan border. Within this protected area, wolves roam the forests, islands, and beaches. When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves. He spoke with Chester Starr, an elder of the Heiltsuk Nation that has occupied the Great Bear Rainforest for thousands of years. What Starr had to say about the wolves changed Darimont’s perception of the animals.\nStarr asked Darimont which wolves he and his team were going to study—the timber wolves (mainland wolves) or the coastal wolves on the islands. The question took Darimont by surprise. Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland. Darimont was intrigued by Starr’s classification of the wolves as two different groups. At first, he was hesitant to accept the idea. The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland? To find out, Darimont and his research team studied the wolves on the islands and in the densely forested territory of the Great Bear Rainforest for ten years.\nThroughout the study, Darimont recorded several significant, observable differences between the “sea wolves,” as they are nicknamed, and the mainland wolves. Compared with the mainland wolves, the sea wolves are smaller in size and are strong swimmers. In 1996 sea wolves were spotted on an island nearly eight miles from any other land formation. While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish. Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water. Some salmon-eating mainland wolves come and go from the islands with the fish-spawning season, but the sea wolves are full-time island residents. Darimont suspects that some sea wolves live their entire life on the islands.\nThe sea wolves displayed not only physical and behavioral differences but also genetic variations from the mainland wolves. After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves. A genetic marker is a variation in a DNA sequence that can be used to identify individuals or a species because it is passed down to offspring. Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves. Many years ago, loss of habitat and food sources forced some mainland wolves out to the islands. They learned to eat everything from kelp and fish eggs to the remains of sea creatures that washed up on the beach. Wolves living on the islands and mainland wolves became more isolated and rarely mated with each other. Over time the two types of wolves became more distinct.\nIt turned out that Chester Starr was right all along. “It sounded totally bizarre at first,” admits Darimont, “that there could be two versions of the species.” But he now realizes that this skepticism “definitely reflected my ignorance of indigenous knowledge at the time.” Learning to trust the wisdom of the Heiltsuk people opened Darimont up to knowledge accumulated over millennia and positioned him so that he could gather new scientific evidence about one of British Columbia’s most elusive species, the sea wolf.";

const wolvesOfTheSea20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-15",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "15"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-04b9a1ac4c6508f85427.png\" alt=\"Official explanation for question 15\">",
    "points": 1,
    "prompt": "The details in paragraph 1 contribute to a central idea of the passage by showing that Darimont",
    "promptHtml": "<p>The details in paragraph 1 contribute to a central idea of the passage by showing that Darimont</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>believed the Great Bear Rainforest was an ideal location to study wolves in their natural habitat because it is a protected area.</p>",
        "text": "believed the Great Bear Rainforest was an ideal location to study wolves in their natural habitat because it is a protected area."
      },
      {
        "id": "B",
        "html": "<p>values different perspectives, because the information that Starr provided influenced the focus of Darimont’s research.</p>",
        "text": "values different perspectives, because the information that Starr provided influenced the focus of Darimont’s research."
      },
      {
        "id": "C",
        "html": "<p>thought the Great Bear Rainforest would provide opportunities to study different groups of wolves because the area includes forests and islands.</p>",
        "text": "thought the Great Bear Rainforest would provide opportunities to study different groups of wolves because the area includes forests and islands."
      },
      {
        "id": "D",
        "html": "<p>understands the importance of respecting local community members, because Darimont sought permission from an elder of the Heiltsuk Nation before starting his research.</p>",
        "text": "understands the importance of respecting local community members, because Darimont sought permission from an elder of the Heiltsuk Nation before starting his research."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-16",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "16"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-14c1886c426dd16be9e7.png\" alt=\"Official explanation for question 16\">",
    "points": 1,
    "prompt": "Why does the author include details about the conversation between Starr and Darimont in paragraph 2?",
    "promptHtml": "<p>Why does the author include details about the conversation between Starr and Darimont in <span>paragraph 2?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>to explain why Starr had closely observed the relationship between the two groups of wolves Darimont wanted to study</p>",
        "text": "to explain why Starr had closely observed the relationship between the two groups of wolves Darimont wanted to study"
      },
      {
        "id": "B",
        "html": "<p>to show that Darimont was hoping to work with Starr and to study both groups of wolves in the area</p>",
        "text": "to show that Darimont was hoping to work with Starr and to study both groups of wolves in the area"
      },
      {
        "id": "C",
        "html": "<p>to highlight that Darimont was unfamiliar with the area and expected Starr to help him find wolves to study</p>",
        "text": "to highlight that Darimont was unfamiliar with the area and expected Starr to help him find wolves to study"
      },
      {
        "id": "D",
        "html": "<p>to emphasize that the question asked by Starr caused Darimont to review his initial assumption about the wolves</p>",
        "text": "to emphasize that the question asked by Starr caused Darimont to review his initial assumption about the wolves"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-17",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "17"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-735bc63b35d881fd02bc.png\" alt=\"Official explanation for question 17\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\nAfter collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves.\nThe phrase “hard biological evidence” conveys that the goal of the research team was to",
    "promptHtml": "<p>Read this sentence from <span>paragraph 4.</span></p> <p data-align=\"indent\"><strong>After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves.</strong></p> <p>The phrase “hard biological evidence” conveys that the goal of the research team was to</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>develop a procedure in order to ensure their study yielded plentiful data about the wolves.</p>",
        "text": "develop a procedure in order to ensure their study yielded plentiful data about the wolves."
      },
      {
        "id": "B",
        "html": "<p>seek definitive scientific proof of the number of wolf species present in the area of the study.</p>",
        "text": "seek definitive scientific proof of the number of wolf species present in the area of the study."
      },
      {
        "id": "C",
        "html": "<p>conduct a study to evaluate multiple theories about the diets of different wolf species.</p>",
        "text": "conduct a study to evaluate multiple theories about the diets of different wolf species."
      },
      {
        "id": "D",
        "html": "<p>discover if the new data would provide information different from that of previous studies.</p>",
        "text": "discover if the new data would provide information different from that of previous studies."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-18",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "18"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3eb4706d2a76cb669825.png\" alt=\"Official explanation for question 18\">",
    "points": 1,
    "prompt": "The author uses the word “admits” in paragraph 5 most likely to",
    "promptHtml": "<p>The author uses the word “admits” in <span>paragraph 5</span> <strong>most likely</strong> to</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>note that Darimont’s genetic research verified a theory based solely on field observations.</p>",
        "text": "note that Darimont’s genetic research verified a theory based solely on field observations."
      },
      {
        "id": "B",
        "html": "<p>imply that Darimont’s study was disappointing because the conclusion that he reached was not original.</p>",
        "text": "imply that Darimont’s study was disappointing because the conclusion that he reached was not original."
      },
      {
        "id": "C",
        "html": "<p>emphasize that Darimont’s study ultimately confirmed an idea that he had initially doubted.</p>",
        "text": "emphasize that Darimont’s study ultimately confirmed an idea that he had initially doubted."
      },
      {
        "id": "D",
        "html": "<p>highlight that Darimont’s results led him to draw a conclusion from his research that his team did not agree with.</p>",
        "text": "highlight that Darimont’s results led him to draw a conclusion from his research that his team did not agree with."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-19",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "19"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-b5d77c0de144012288c7.png\" alt=\"Official explanation for question 19\">",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that sea wolves had successfully adapted to living on the islands?",
    "promptHtml": "<p>Which sentence from the passage <strong>best</strong> supports the idea that sea wolves had successfully adapted to living on the islands?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as <span>90 percent</span> of their nutrition from the sea and teach their young to dig for clams and to catch fish.” <span>(paragraph 3)</span></p>",
        "text": "“While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish.” (paragraph 3)"
      },
      {
        "id": "B",
        "html": "<p>“Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water.” <span>(paragraph 3)</span></p>",
        "text": "“Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water.” (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>“Darimont suspects that some sea wolves live their entire life on the islands.” <span>(paragraph 3)</span></p>",
        "text": "“Darimont suspects that some sea wolves live their entire life on the islands.” (paragraph 3)"
      },
      {
        "id": "D",
        "html": "<p>“Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves.” <span>(paragraph 4)</span></p>",
        "text": "“Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2026-2027-form-d-official-shsat-2026-d-20",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 3 of 7",
      "sourceQuestion": "20"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3c584a05350cd314b44f.png\" alt=\"Official explanation for question 20\">",
    "points": 1,
    "prompt": "How did a change in habitat most affect the wolf population of the Great Bear Rainforest over time?",
    "promptHtml": "<p>How did a change in habitat <strong>most</strong> affect the wolf population of the Great Bear Rainforest over time?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It caused some of the wolves to learn new hunting techniques in order to catch increasingly scarce prey.</p>",
        "text": "It caused some of the wolves to learn new hunting techniques in order to catch increasingly scarce prey."
      },
      {
        "id": "B",
        "html": "<p>It caused the wolves to form smaller packs and eventually separate, establishing distinct territories.</p>",
        "text": "It caused the wolves to form smaller packs and eventually separate, establishing distinct territories."
      },
      {
        "id": "C",
        "html": "<p>It caused some of the wolves to gradually become a new, genetically distinct species as they adapted behaviorally.</p>",
        "text": "It caused some of the wolves to gradually become a new, genetically distinct species as they adapted behaviorally."
      },
      {
        "id": "D",
        "html": "<p>It caused the wolves to adapt their diet as different food sources became available in the area.</p>",
        "text": "It caused the wolves to adapt their diet as different food sources became available in the area."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const wolvesOfTheSea20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-wolves-of-the-sea-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D"],
  section: "reading",
  questionCount: wolvesOfTheSea20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "wolves-of-the-sea-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Wolves of the Sea",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 3 of 7","packageId":"25fff1f00c4f97942b9ba832efe777389905f948a2ece67515637abc13cb3192"},
    title: "Wolves of the Sea",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\"> The cool and misty landscape of the Great Bear Rainforest can be found along the coast of British Columbia, Canada, and its nearby islands, from Vancouver Island to the Alaskan border. Within this protected area, wolves roam the forests, islands, and beaches. When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves. He spoke with Chester Starr, an elder of the Heiltsuk Nation that has occupied the Great Bear Rainforest for thousands of years. What Starr had to say about the wolves changed Darimont’s perception of&nbsp;the animals.</p> <p data-numbered=\"true\"> Starr asked Darimont which wolves he and his team were going to <span>study—</span>the timber wolves (mainland wolves) or the coastal wolves on the islands. The question took Darimont by surprise. Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland. Darimont was intrigued by Starr’s classification of the wolves as two different groups. At first, he was hesitant to accept the idea. The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland? To find out, Darimont and his research team studied the wolves on the islands and in the densely forested territory of the Great Bear Rainforest for <span>ten years.</span></p> <p data-numbered=\"true\"> Throughout the study, Darimont recorded several significant, observable differences between the “sea wolves,” as they are nicknamed, and the mainland wolves. Compared with the mainland wolves, the sea wolves are smaller in size and are strong swimmers. In 1996 sea wolves were spotted on an island nearly eight miles from any other land formation. While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as <span>90 percent</span> of their nutrition from the sea and teach their young to dig for clams and to catch fish. Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water. Some salmon-eating mainland wolves come and go from the islands with the fish-spawning season, but the sea wolves are full-time island residents. Darimont suspects that some sea wolves live their entire life on the islands.</p> <p data-numbered=\"true\"> The sea wolves displayed not only physical and behavioral differences but also genetic variations from the mainland wolves. After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves. A genetic marker is a variation in a DNA sequence that can be used to identify individuals or a species because it is passed down to offspring. Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves. Many years ago, loss of habitat and food sources forced some mainland wolves out to the islands. They learned to eat everything from kelp and fish eggs to the remains of sea creatures that washed up on the beach. Wolves living on the islands and mainland wolves became more isolated and rarely mated with each other. Over time the two types of wolves became more distinct.</p> <p data-numbered=\"true\"> It turned out that Chester Starr was right all along. “It sounded totally bizarre at first,” admits Darimont, “that there could be two versions of the species.” But he now realizes that this skepticism “definitely reflected my ignorance of indigenous knowledge at the time.” Learning to trust the wisdom of the Heiltsuk people opened Darimont up to knowledge accumulated over millennia and positioned him so that he could gather new scientific evidence about one of British Columbia’s most elusive species, the sea wolf.</p>",
    text: wolvesOfTheSea20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: wolvesOfTheSea20262027FormDQuestions,
};
