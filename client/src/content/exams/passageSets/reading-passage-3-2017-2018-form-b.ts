import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage320172018FormBPassageText = "One of the books that has done the most to alert the world to the dangers of environmental degradation was George Perkins Marsh’s Man and Nature. Its message—that Western society was in the process of causing irreparable harm to the environment—greatly influenced ecologists during the beginning of the modern environmentalist movement in the 1960s. Marsh was not, however, part of this movement. Surprisingly, Man and Nature was first published in 1864.\n\nMarsh first observed the environmentally destructive effects of human activities while growing up in Vermont in the early nineteenth century. The heavy demand for firewood had depleted the forests, and extensive sheep grazing had stripped the land. The result was flooding and soil erosion. Furthermore, streams were fouled by wastes dumped from numerous mills and dye houses.\n\nMuch later in his life, after careers in law, business, farming, and politics, Marsh served as ambassador to Italy. There he noticed land abuse similar to what he had seen in Vermont. Overgrazing and forest mismanagement had rendered desolate areas that had been productive farmland since the days of the Roman Empire. Marsh attributed this to what he called “man’s ignorant disregard for the laws of nature.”\n\nIn Italy, Marsh began to organize his observations and theories. He wrote in a way intended to educate readers about the impact of industrial and agricultural practices on the environment. In Man and Nature, he evaluated the important relationships between animals and plants, discussed forestry practices in great detail, and analyzed the ways natural water supplies are affected by human use.\n\nMan and Nature challenged the popular belief that nature could heal any damage that people inflict upon it. Marsh argued that people may use and enjoy, but not destroy, the riches of the earth.\n\nFurthermore, he asserted that everything in nature is significant and that even the tiniest organism affects the fragile environmental balance. His belief that drastic alteration of this balance would be dangerous is now accepted as a fundamental principle of modern environmental science.\n\nAlthough he pointed out environmental damage caused by irresponsible human activities, Marsh did not oppose every human alteration to the environment. To him, the goal was proper management, not a return to wilderness conditions. People should consider the consequences of their actions, he wrote, and become “co-worker[s] with nature.” Marsh praised the Suez Canal, the human- made waterway between the Mediterranean Sea and the Gulf of Aden, as “the greatest and most truly cosmopolite physical improvement ever undertaken by man.” He believed that the advantages of the canal— improved transportation and commerce— would outweigh any environmental damage. Yet he also warned of possible unintended consequences, such as destructive plants and animals spreading from one body of water to the other.\n\nMarsh was considered a radical thinker during his lifetime. By the late nineteenth century, however, his writings, along with those of John Muir, Henry David Thoreau, and others, had inspired what became known as the conservation movement. The conservationists of that time sought to educate the public that wilderness areas were worth preserving, and they were responsible for creating the National Park Service and the National Forest Service.";

const readingPassage320172018FormBQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "34",
      "pages": [
        15
      ]
    },
    "explanation": "34. (H) The second through fifth paragraphs of the passage primarily describe Marsh’s personal experiences and his ideas about nature, and the final paragraph explains how his ideas are the basis for the conservation movement. This is best stated in Option H. Option E focuses mainly on Marsh’s early life and does not address his influence. Option F describes specific details about Marsh’s beliefs but does not explain who he was or how he affected the conservation movement. Option G emphasizes that Marsh’s ideas were radical and influential but does not provide any information about what Marsh’s beliefs were.",
    "explanationHtml": "<p>34. (H) The second through fifth paragraphs of the passage primarily describe Marsh’s personal experiences and his ideas about nature, and the final paragraph explains how his ideas are the basis for the conservation movement. This is best stated in Option H. Option E focuses mainly on Marsh’s early life and does not address his influence. Option F describes specific details about Marsh’s beliefs but does not explain who he was or how he affected the conservation movement. Option G emphasizes that Marsh’s ideas were radical and influential but does not provide any information about what Marsh’s beliefs were.</p>",
    "points": 1,
    "prompt": "Which statement best describes the central idea of the passage?",
    "promptHtml": "<p>Which statement best describes the central idea of the passage?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Marsh’s experience growing up on a farm allowed him to witness firsthand how human demands on nature can lead to problems, and as an adult he wrote one of the first books about conservation.</p>",
        "text": "Marsh’s experience growing up on a farm allowed him to witness firsthand how human demands on nature can lead to problems, and as an adult he wrote one of the first books about conservation."
      },
      {
        "id": "B",
        "html": "<p>Marsh challenged the notion that nature could repair the damage people cause to it, but he also supported human-made modifications to nature that improve transportation and commerce.</p>",
        "text": "Marsh challenged the notion that nature could repair the damage people cause to it, but he also supported human-made modifications to nature that improve transportation and commerce."
      },
      {
        "id": "C",
        "html": "<p>Marsh’s ideas about the environment were considered radical in his lifetime, but they later gained popularity during the environmental movement in the twentieth century.</p>",
        "text": "Marsh’s ideas about the environment were considered radical in his lifetime, but they later gained popularity during the environmental movement in the twentieth century."
      },
      {
        "id": "D",
        "html": "<p>Marsh was a radical thinker who believed that people’s actions could dramatically affect nature, and his writings are considered foundational to the conservation movement.</p>",
        "text": "Marsh was a radical thinker who believed that people’s actions could dramatically affect nature, and his writings are considered foundational to the conservation movement."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "35",
      "pages": [
        15
      ]
    },
    "explanation": "35. (D) Marsh attributed people’s practices to “the popular belief that nature could heal any damage that people inflict upon it” (lines 43–45), which suggests a lack of understanding, or ignorance, of nature (lines 31–32). This is best stated in Option D. Although future generations are working to solve environmental problems, there is no indication in the passage that Marsh believed that people in his time expected future generations to solve environmental problems, ruling out Option A. While the people of Marsh’s time made advances in industry, Marsh did not indicate that he believed that people thought industrial progress outweighed efforts to protect the environment (Option B). Option C is incorrect because there is also no evidence in the passage to suggest that Marsh believed that people were unwilling to change their practices.",
    "explanationHtml": "<p>35. (D) Marsh attributed people’s practices to “the popular belief that nature could heal any damage that people inflict upon it” (lines 43–45), which suggests a lack of understanding, or ignorance, of nature (lines 31–32). This is best stated in Option D. Although future generations are working to solve environmental problems, there is no indication in the passage that Marsh believed that people in his time expected future generations to solve environmental problems, ruling out Option A. While the people of Marsh’s time made advances in industry, Marsh did not indicate that he believed that people thought industrial progress outweighed efforts to protect the environment (Option B). Option C is incorrect because there is also no evidence in the passage to suggest that Marsh believed that people were unwilling to change their practices.</p>",
    "points": 1,
    "prompt": "Marsh believed that the people of his time caused harm to the environment mostly because",
    "promptHtml": "<p>Marsh believed that the people of his time caused harm to the environment mostly because</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>they assumed future generations would solve any environmental problems.</p>",
        "text": "they assumed future generations would solve any environmental problems."
      },
      {
        "id": "B",
        "html": "<p>they thought industrial progress was more important than protecting nature.</p>",
        "text": "they thought industrial progress was more important than protecting nature."
      },
      {
        "id": "C",
        "html": "<p>they were unwilling to change farming and waste-disposal practices.</p>",
        "text": "they were unwilling to change farming and waste-disposal practices."
      },
      {
        "id": "D",
        "html": "<p>they lacked knowledge of nature and natural processes.</p>",
        "text": "they lacked knowledge of nature and natural processes."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q036",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "36",
      "pages": [
        15
      ]
    },
    "explanation": "36. (F) Lines 1–9 lead the reader to expect that Marsh was part of the modern environmental movement that began in the 1960s. Therefore, the fact that Marsh’s influential book was published 100 years earlier is surprising (Option F). While Marsh’s ideas have had a resurgence in popularity since the 1960s (lines 7–9), Marsh’s observations about deforestation in Vermont (lines 16–19) and land mismanagement in Italy (lines 25–30) indicate that his ideas were just as applicable in his time as they are today, ruling out Option E. While Marsh could not have been aware that his ideas would lead to the start of a conservation movement (Option G), line 12 indicates that the surprising part is that Marsh had these ideas 100 years before the conservation movement became popular. While it’s possible a greater awareness of human impact on the environment during Marsh’s time could have prevented certain environmental issues today (Option H), this is conjecture and does not explain the author’s purpose for using the word “surprisingly.”",
    "explanationHtml": "<p>36. (F) Lines 1–9 lead the reader to expect that Marsh was part of the modern environmental movement that began in the 1960s. Therefore, the fact that Marsh’s influential book was published 100 years earlier is surprising (Option F). While Marsh’s ideas have had a resurgence in popularity since the 1960s (lines 7–9), Marsh’s observations about deforestation in Vermont (lines 16–19) and land mismanagement in Italy (lines 25–30) indicate that his ideas were just as applicable in his time as they are today, ruling out Option E. While Marsh could not have been aware that his ideas would lead to the start of a conservation movement (Option G), line 12 indicates that the surprising part is that Marsh had these ideas 100 years before the conservation movement became popular. While it’s possible a greater awareness of human impact on the environment during Marsh’s time could have prevented certain environmental issues today (Option H), this is conjecture and does not explain the author’s purpose for using the word “surprisingly.”</p>",
    "points": 1,
    "prompt": "What is the most likely reason the author uses the word “surprisingly” in line 11?",
    "promptHtml": "<p>What is the most likely reason the author uses the word “surprisingly” in line 11?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>to argue that Marsh’s ideas are more applicable in the present than they were during his lifetime</p>",
        "text": "to argue that Marsh’s ideas are more applicable in the present than they were during his lifetime"
      },
      {
        "id": "B",
        "html": "<p>to show that Marsh introduced ideas a century before they became widely accepted</p>",
        "text": "to show that Marsh introduced ideas a century before they became widely accepted"
      },
      {
        "id": "C",
        "html": "<p>to emphasize that Marsh was unaware that his ideas would help begin a conservation movement</p>",
        "text": "to emphasize that Marsh was unaware that his ideas would help begin a conservation movement"
      },
      {
        "id": "D",
        "html": "<p>to prove that there would be fewer issues with the environment today if people had accepted Marsh’s ideas earlier</p>",
        "text": "to prove that there would be fewer issues with the environment today if people had accepted Marsh’s ideas earlier"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q037",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "37",
      "pages": [
        15
      ]
    },
    "explanation": "37. (C) The concept that Marsh’s theories about nature were accurate is best supported by the statement that ideas from his book are now considered basic knowledge in the field of environmental science (lines 51–54), which is Option C. While Marsh made observations of environmental degradation (lines 13–22, lines 25–27), this does not provide evidence that his theories were accurate, ruling out Option A. While Marsh’s writing did inspire a conservation movement (lines 77–80), these details do not call attention to the accuracy of his ideas, which rules out Option B. Option D is incorrect because it refers to personal opinions (lines 58–59, lines 67–70), not his theories, which are considered true today.",
    "explanationHtml": "<p>37. (C) The concept that Marsh’s theories about nature were accurate is best supported by the statement that ideas from his book are now considered basic knowledge in the field of environmental science (lines 51–54), which is Option C. While Marsh made observations of environmental degradation (lines 13–22, lines 25–27), this does not provide evidence that his theories were accurate, ruling out Option A. While Marsh’s writing did inspire a conservation movement (lines 77–80), these details do not call attention to the accuracy of his ideas, which rules out Option B. Option D is incorrect because it refers to personal opinions (lines 58–59, lines 67–70), not his theories, which are considered true today.</p>",
    "points": 1,
    "prompt": "Which evidence supports the idea that Marsh’s theories about nature were accurate?",
    "promptHtml": "<p>Which evidence supports the idea that Marsh’s theories about nature were accurate?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>the details about Marsh’s observations of environmental degradation</p>",
        "text": "the details about Marsh’s observations of environmental degradation"
      },
      {
        "id": "B",
        "html": "<p>the details about how Marsh’s writing inspired a conservation movement</p>",
        "text": "the details about how Marsh’s writing inspired a conservation movement"
      },
      {
        "id": "C",
        "html": "<p>the details about how Marsh’s ideas are essential to modern environmental science</p>",
        "text": "the details about how Marsh’s ideas are essential to modern environmental science"
      },
      {
        "id": "D",
        "html": "<p>the details about Marsh’s opinion on human alterations to the environment</p>",
        "text": "the details about Marsh’s opinion on human alterations to the environment"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q038",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "38",
      "pages": [
        16
      ]
    },
    "explanation": "38. (H) Details about Marsh’s approval of the Suez Canal (lines 63–67) show that Marsh did not oppose certain human activates because the advantages—improved transportation and commerce—improved human life and outweighed negative environmental damage (lines 67–70). Option H best summarizes that idea. Option E is not relevant to the statement in question. Option F acknowledges Marsh’s contributions to the environmental movement but does not relate to his attitudes about certain alterations to the environment. Option G is incorrect because it relates to a time when Marsh observed environmental degradation in a foreign country.",
    "explanationHtml": "<p>38. (H) Details about Marsh’s approval of the Suez Canal (lines 63–67) show that Marsh did not oppose certain human activates because the advantages—improved transportation and commerce—improved human life and outweighed negative environmental damage (lines 67–70). Option H best summarizes that idea. Option E is not relevant to the statement in question. Option F acknowledges Marsh’s contributions to the environmental movement but does not relate to his attitudes about certain alterations to the environment. Option G is incorrect because it relates to a time when Marsh observed environmental degradation in a foreign country.</p>",
    "points": 1,
    "prompt": "Which detail about Marsh provides support for the author’s statement in lines 55–58?",
    "promptHtml": "<p>Which detail about Marsh provides support for the author’s statement in lines 55–58?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>his reputation as a radical thinker</p>",
        "text": "his reputation as a radical thinker"
      },
      {
        "id": "B",
        "html": "<p>his contribution to the conservation movement</p>",
        "text": "his contribution to the conservation movement"
      },
      {
        "id": "C",
        "html": "<p>his experience working as an ambassador</p>",
        "text": "his experience working as an ambassador"
      },
      {
        "id": "D",
        "html": "<p>his approval of beneficial human-made projects in nature</p>",
        "text": "his approval of beneficial human-made projects in nature"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-b-pdf-shsat-2017-2018-b-q039",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "39",
      "pages": [
        16
      ]
    },
    "explanation": "39. (C) Marsh’s main contribution to the modern environmental movement is given in lines 5–7—the idea that Western society was causing irreparable harm to the environment. Option C restates that idea. While Marsh did believe that some human alterations to the environment are necessary (lines 67–70; Option A), that people lacked an understanding of nature (lines 30–32; Option B), and that environmental degradation had been occurring for many years (lines 27–30; Option D), it is clear from the information in the first paragraph that the impact of human activity was his most influential idea.",
    "explanationHtml": "<p>39. (C) Marsh’s main contribution to the modern environmental movement is given in lines 5–7—the idea that Western society was causing irreparable harm to the environment. Option C restates that idea. While Marsh did believe that some human alterations to the environment are necessary (lines 67–70; Option A), that people lacked an understanding of nature (lines 30–32; Option B), and that environmental degradation had been occurring for many years (lines 27–30; Option D), it is clear from the information in the first paragraph that the impact of human activity was his most influential idea.</p>",
    "points": 1,
    "prompt": "Which of Marsh’s ideas most influenced the environmental movement of the 1960s?",
    "promptHtml": "<p>Which of Marsh’s ideas most influenced the environmental movement of the 1960s?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Some human alterations to the environment are necessary.</p>",
        "text": "Some human alterations to the environment are necessary."
      },
      {
        "id": "B",
        "html": "<p>People lack an understanding of the environment.</p>",
        "text": "People lack an understanding of the environment."
      },
      {
        "id": "C",
        "html": "<p>Human activities could damage the environment.</p>",
        "text": "Human activities could damage the environment."
      },
      {
        "id": "D",
        "html": "<p>Environmental degradation has been occurring for many years.</p>",
        "text": "Environmental degradation has been occurring for many years."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const readingPassage320172018FormBPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-3-2017-2018-form-b",
  versionLabels: ["2017-2018 Form B"],
  label: "2017-2018 Form B",
  section: "reading",
  questionCount: readingPassage320172018FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-3-2017-2018-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 3",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-b","label":"2017-2018 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf","year":"2017-2018","form":"B","packageId":"7a2d7d6a39d44530af4a2496c5862d1dc01b2a3c74dd33b4699a5e02d444e0a3"},
    title: "Reading Passage 3",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">One of the books that has done the most to alert the world to the dangers of environmental degradation was George Perkins Marsh’s <em>Man and Nature</em>. Its <sup>5</sup> message—that Western society was in the process of causing irreparable harm to the environment—greatly influenced ecologists during the beginning of the modern environmentalist movement in the 1960s. <sup>10</sup> Marsh was not, however, part of this movement. Surprisingly, <em>Man and Nature</em> was first published in 1864.</p><p data-numbered=\"false\">Marsh first observed the environmentally destructive effects of human activities while <sup>15</sup> growing up in Vermont in the early nineteenth century. The heavy demand for firewood had depleted the forests, and extensive sheep grazing had stripped the land. The result was flooding and soil erosion. <sup>20</sup> Furthermore, streams were fouled by wastes dumped from numerous mills and dye houses.</p><p data-numbered=\"false\">Much later in his life, after careers in law, business, farming, and politics, Marsh served <sup>25</sup> as ambassador to Italy. There he noticed land abuse similar to what he had seen in Vermont. Overgrazing and forest mismanagement had rendered desolate areas that had been productive farmland since the <sup>30</sup> days of the Roman Empire. Marsh attributed this to what he called “man’s ignorant disregard for the laws of nature.”</p><p data-numbered=\"false\">In Italy, Marsh began to organize his observations and theories. He wrote in a way <sup>35</sup> intended to educate readers about the impact of industrial and agricultural practices on the environment. In <em>Man and Nature</em>, he evaluated the important relationships between animals and plants, discussed <sup>40</sup> forestry practices in great detail, and analyzed the ways natural water supplies are affected by human use.</p><p data-numbered=\"false\"><em>Man and Nature</em> challenged the popular belief that nature could heal any damage <sup>45</sup> that people inflict upon it. Marsh argued that people may use and enjoy, but not destroy, the riches of the earth.</p><p data-numbered=\"false\">Furthermore, he asserted that everything in nature is significant and that even the tiniest <sup>50</sup> organism affects the fragile environmental balance. His belief that drastic alteration of this balance would be dangerous is now accepted as a fundamental principle of modern environmental science.</p><p data-numbered=\"false\"><sup>55</sup> Although he pointed out environmental damage caused by irresponsible human activities, Marsh did not oppose every human alteration to the environment. To him, the goal was proper management, not a return to <sup>60</sup> wilderness conditions. People should consider the consequences of their actions, he wrote, and become “co-worker[s] with nature.” Marsh praised the Suez Canal, the human- made waterway between the Mediterranean <sup>65</sup> Sea and the Gulf of Aden, as “the greatest and most truly cosmopolite physical improvement ever undertaken by man.” He believed that the advantages of the canal— improved transportation and commerce— <sup>70</sup> would outweigh any environmental damage. Yet he also warned of possible unintended consequences, such as destructive plants and animals spreading from one body of water to the other.</p><p data-numbered=\"false\"><sup>75</sup> Marsh was considered a radical thinker during his lifetime. By the late nineteenth century, however, his writings, along with those of John Muir, Henry David Thoreau, and others, had inspired what became known <sup>80</sup> as the conservation movement. The conservationists of that time sought to educate the public that wilderness areas were worth preserving, and they were responsible for creating the National Park <sup>85</sup> Service and the National Forest Service.</p>",
    text: readingPassage320172018FormBPassageText,
    versionLabel: "2017-2018 Form B",
  }),
  questions: readingPassage320172018FormBQuestions,
};
