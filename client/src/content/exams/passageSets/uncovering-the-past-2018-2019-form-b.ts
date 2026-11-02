import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const uncoveringThePast20182019FormBPassageText = "Archaeology as a distinct branch of science is only about two centuries old. The first archaeological activities focused largely on the search for clues about earlier human societies. In the nineteenth century, most archaeologists were amateurs trained in ancient languages and history. Many were art historians whose interest lay in the artwork and monuments of ancient civilizations. For the most part, their excavations were aimed at uncovering and removing priceless artwork and other valuable artifacts for museum display. Collectively, these early archaeologists are now considered traditional archaeologists.\n\nToday, however, there is a different approach to archaeology, one that tries to reconstruct the everyday life of people in ancient times by applying the scientific methods of a range of specialized fields. Modern archaeologists take full advantage of available technology. Laptop computers enable digging teams to record their finds at each level of an excavation. With sketchpad computer software, archaeologists can draw their finds in the field. Three-dimensional computer modeling enables researchers to create floor plans and elevations for the structures they uncover. Archaeologists can also use remote sensing technologies such as radar and lidar, which is similar to radar but it uses laser light instead of radio waves. These technologies enable scientists to detect traces of early settlements that are not visible to the human eye.\n\nThe excavations at Kourion, a Roman port city on the island of Cyprus in the Mediterranean Sea, serve as an example of the modern approach. Portions of Kourion had been unexpectedly buried by a massive earthquake in the fourth century A.D. Traditional archaeologists were interested primarily in the remains of Kourion’s theater, temple, and classical monuments. They also collected precious objects, such as jewelry, found in nearby tombs. Modern archaeologists, however, have focused their studies and excavations on the settlement itself. This preserved seaport has proved to be a gold mine of important information about everyday life sixteen centuries ago.\n\nDuring one excavation of a house at Kourion, for example, forensic anthropologists were able to reconstruct the skeleton of a young girl, whom they called Camelia. On the basis of her teeth, they determined her age to be about thirteen, although measurement of her skeleton showed that she was only the size of a modern eleven-year-old. The study of the teeth also confirmed her sex and pointed to her excellent health; Camelia had no cavities. Even after centuries, the forensic scientists could study the physical evidence in ways similar to those used in criminal investigations to determine the circumstances of Camelia’s death.\n\nOther specialists on this excavation included a zooarchaeologist, who identified animal remains, including the skeleton of a mule found near Camelia. Another specialist, a paleobotanist, studied the contents of a bake oven at the site and identified four domesticated grains among the charred crumbs—evidence of a kind of ancient multigrain bread.\n\nAlthough the archaeologists at this site unearthed a few beautiful items, the excavation did not uncover any priceless artwork for museums. Nonetheless, the archaeological processes used in Kourion have given us a valuable insight into everyday life in a Roman city.";

const uncoveringThePast20182019FormBQuestions: ExamQuestion[] = [
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "32",
      "pages": [
        24
      ]
    },
    "explanation": "32. (E) The question asks for a summary of what the goal of modern archaeology is in general. The passage is\n\nmostly about how archaeology has evolved from efforts to discover ancient artwork and museum pieces to using technology to piece together a sense of life in early civilizations, which is best described in Option E. Option F is incorrect because it states the goal of archaeology in the past, not in modern times. Option G is incorrect because finding settlements is not the goal but just the first step in the modern archaeological process. Option H is incorrect because it states the goal of traditional, rather than modern, archaeology.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q032-explanation-1.png\" alt=\"Supplied Form B explanation for question 32\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q032-explanation-2.png\" alt=\"Supplied Form B explanation for question 32\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which of the following best describes the goal of modern archaeology?",
    "promptHtml": "<p>Which of the following best describes the goal of modern archaeology?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to use science to learn how people lived in the past</p>",
        "text": "to use science to learn how people lived in the past"
      },
      {
        "id": "B",
        "html": "<p>to find artwork from ancient civilizations</p>",
        "text": "to find artwork from ancient civilizations"
      },
      {
        "id": "C",
        "html": "<p>to search for evidence of ancient settlements</p>",
        "text": "to search for evidence of ancient settlements"
      },
      {
        "id": "D",
        "html": "<p>to uncover precious objects for display in museums</p>",
        "text": "to uncover precious objects for display in museums"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q033",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "33",
      "pages": [
        24
      ]
    },
    "explanation": "33. (B) The question asks what artifacts a traditional archaeologist would be interested in finding based on the material in the passage. The passage explains that, unlike modern archaeologists, traditional archaeologists are interested in valuable items from the past rather than learning about the people from the past and their lifestyles. Jewelry and ceramics are examples of valuable items, which makes Option B correct. Option A is incorrect because human skeletons would be valuable to modern archaeologists, not traditional archaeologists. Option C is incorrect because it is a detail that relates to modern archaeologists’ efforts to study people, not just valuable items. Option D is incorrect because the remains of animals would also advance the goals of modern, rather than traditional, archaeologists.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q033-explanation-1.png\" alt=\"Supplied Form B explanation for question 33\" width=\"348\"></p>",
    "points": 1,
    "prompt": "What would a traditional archaeologist be most interested in finding at a site like Kourion?",
    "promptHtml": "<p>What would a traditional archaeologist be most interested in finding at a site like Kourion?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>a human skeleton</p>",
        "text": "a human skeleton"
      },
      {
        "id": "B",
        "html": "<p>beautiful jewelry or ceramics</p>",
        "text": "beautiful jewelry or ceramics"
      },
      {
        "id": "C",
        "html": "<p>evidence of foods eaten</p>",
        "text": "evidence of foods eaten"
      },
      {
        "id": "D",
        "html": "<p>the remains of animals</p>",
        "text": "the remains of animals"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "34",
      "pages": [
        24
      ]
    },
    "explanation": "34. (E) The question asks how paragraph 2 supports the structure of the passage. The first paragraph provides history on the field of archaeology, specifically what has come to be known as traditional archaeology. Paragraph 2 describes how modern archaeology differs from traditional archaeology, which is detailed in Option E. Option F is incorrect because paragraph 2 provides no support for paragraph 1. Option G is incorrect because paragraph 2 provides facts about modern archaeology and does not introduce a theory. The remainder of the passage describes how modern archaeology was used at one specific dig, which is not mentioned in paragraph 2, making Option H incorrect.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q034-explanation-1.png\" alt=\"Supplied Form B explanation for question 34\" width=\"348\"></p>",
    "points": 1,
    "prompt": "What role does paragraph 2 play in the structure of the passage?",
    "promptHtml": "<p>What role does paragraph 2 play in the structure of the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It provides a contrast to the topic discussed in the first paragraph.</p>",
        "text": "It provides a contrast to the topic discussed in the first paragraph."
      },
      {
        "id": "B",
        "html": "<p>It details examples that support the central idea of the first paragraph.</p>",
        "text": "It details examples that support the central idea of the first paragraph."
      },
      {
        "id": "C",
        "html": "<p>It states a theory that will be explained further in the third paragraph.</p>",
        "text": "It states a theory that will be explained further in the third paragraph."
      },
      {
        "id": "D",
        "html": "<p>It summarizes the information found in the rest of the passage.</p>",
        "text": "It summarizes the information found in the rest of the passage."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "35",
      "pages": [
        24
      ]
    },
    "explanation": "35. (B) The question asks for the concluding sentence that best summarizes the information from paragraph 4. Paragraph 4 explains that Camelia’s age was determined through an examination of her teeth, which makes the conclusion in Option B the correct answer. Option A is incorrect because the excavation discussed in the paragraph is at a house, not a theater or temple. Option C is incorrect because, although Camelia’s body was smaller than a thirteen-year-old’s would be expected to be, the passage does not go into enough detail to suggest that all people from the past were smaller than people\n\nare today. Option D is also incorrect because there is no evidence in the passage of Camelia’s death being the result of a crime.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q035-explanation-1.png\" alt=\"Supplied Form B explanation for question 35\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q035-explanation-2.png\" alt=\"Supplied Form B explanation for question 35\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which conclusion is best supported by the information in paragraph 4?",
    "promptHtml": "<p>Which conclusion is best supported by the information in paragraph 4?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>Forensic anthropologists specialize in the excavation of ancient theaters and temples.</p>",
        "text": "Forensic anthropologists specialize in the excavation of ancient theaters and temples."
      },
      {
        "id": "B",
        "html": "<p>Forensic anthropologists can obtain a variety of information by examining teeth.</p>",
        "text": "Forensic anthropologists can obtain a variety of information by examining teeth."
      },
      {
        "id": "C",
        "html": "<p>Forensic anthropologists believe that people in the past were smaller than people are today.</p>",
        "text": "Forensic anthropologists believe that people in the past were smaller than people are today."
      },
      {
        "id": "D",
        "html": "<p>Forensic anthropologists primarily investigate ancient crimes.</p>",
        "text": "Forensic anthropologists primarily investigate ancient crimes."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q036",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "36",
      "pages": [
        25
      ]
    },
    "explanation": "36. (H) The question asks what archaeologists learned about the ancient culture based on the evidence found in paragraphs 4–5. Paragraph 5 states that a paleobotanist identified four domesticated grains within a bake oven at the site, which supports Option H. Option E is incorrect because there is not enough evidence in either paragraph to support the broad assumption that people in Kourion had a better diet than people today. Option F is incorrect because the passage mentions the discovery of the remains of only one domesticated animal, which does not support the idea that Kourion people kept a wide variety of domesticated animals. Option G is incorrect because paragraph 4 states that Camelia’s age was determined to be about thirteen at the time of her death, but since her death was likely caused by a natural disaster, the suggestion that all Kourion people had a shorter life expectancy than people today is not supported.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q036-explanation-1.png\" alt=\"Supplied Form B explanation for question 36\" width=\"351\"></p>",
    "points": 1,
    "prompt": "As described in paragraphs 4–5, what did the archaeological team learn about life in Kourion?",
    "promptHtml": "<p>As described in paragraphs 4–5, what did the archaeological team learn about life in Kourion?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>People in Kourion had a better diet than people have today.</p>",
        "text": "People in Kourion had a better diet than people have today."
      },
      {
        "id": "B",
        "html": "<p>People in Kourion kept a wide variety of domesticated animals.</p>",
        "text": "People in Kourion kept a wide variety of domesticated animals."
      },
      {
        "id": "C",
        "html": "<p>People in Kourion had a shorter life expectancy than people have today.</p>",
        "text": "People in Kourion had a shorter life expectancy than people have today."
      },
      {
        "id": "D",
        "html": "<p>People in Kourion made bread from various domesticated grains.</p>",
        "text": "People in Kourion made bread from various domesticated grains."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "uncovering-the-past-2018-2019-form-b-pdf-shsat-2018-2019-b-q037",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "37",
      "pages": [
        25
      ]
    },
    "explanation": "37. (D) The question asks for the strongest reason for the author mentioning the zooarchaeologist in the passage. The primary purpose of the passage is to explain and describe modern archaeology, the technology it employs, and various aspects of the field. Zooarchaeology is a specialty within the field, which is stated in Option D. Option A is incorrect because other artifacts found near Camelia could have been introduced without mentioning the zooarchaeologist. Option B is incorrect because the text does not state any comparisons between zooarchaeologists and paleoarchaeologists. Option C is incorrect because the passage does not provide a list of archaeological specialists.\n\nSnowy Mountains",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q037-explanation-1.png\" alt=\"Supplied Form B explanation for question 37\" width=\"351\"></p>",
    "points": 1,
    "prompt": "What is the most likely reason the author mentions the zooarchaeologist (paragraph 5)?",
    "promptHtml": "<p>What is the most likely reason the author mentions the zooarchaeologist (paragraph 5)?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to introduce the topic of other artifacts discovered near Camelia</p>",
        "text": "to introduce the topic of other artifacts discovered near Camelia"
      },
      {
        "id": "B",
        "html": "<p>to contrast this position with that of the paleobotanist</p>",
        "text": "to contrast this position with that of the paleobotanist"
      },
      {
        "id": "C",
        "html": "<p>to complete the list of archaeological specialists</p>",
        "text": "to complete the list of archaeological specialists"
      },
      {
        "id": "D",
        "html": "<p>to provide an example of a particular field in modern archaeology</p>",
        "text": "to provide an example of a particular field in modern archaeology"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const uncoveringThePast20182019FormBPassageSet: ExamPassageSet = {
  id: "ela-uncovering-the-past-2018-2019-form-b",
  versionLabels: ["2018-2019 Form B"],
  label: "2018-2019 Form B",
  section: "reading",
  questionCount: uncoveringThePast20182019FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "uncovering-the-past-2018-2019-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Uncovering the Past",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form B","year":"2018-2019","form":"B","packageId":"82a187b0503bd94c3897cb85ef0ea56f4ef9ff2b46d9dc07d03468ab84cbff9a"},
    title: "Uncovering the Past",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>Archaeology as a distinct branch of science is only about two centuries old. The first archaeological activities focused largely on the search for clues about earlier human societies. In the nineteenth century, most archaeologists were amateurs trained in ancient languages and history. Many were art historians whose interest lay in the artwork and monuments of ancient civilizations. For the most part, their excavations were aimed at uncovering and removing priceless artwork and other valuable artifacts for museum display. Collectively, these early archaeologists are now considered traditional archaeologists.</p><p>Today, however, there is a different approach to archaeology, one that tries to reconstruct the everyday life of people in ancient times by applying the scientific methods of a range of specialized fields. Modern archaeologists take full advantage of available technology. Laptop computers enable digging teams to record their finds at each level of an excavation. With sketchpad computer software, archaeologists can draw their finds in the field. Three-dimensional computer modeling enables researchers to create floor plans and elevations for the structures they uncover. Archaeologists can also use remote sensing technologies such as radar and lidar, which is similar to radar but it uses laser light instead of radio waves. These technologies enable scientists to detect traces of early settlements that are not visible to the human eye.</p><p>The excavations at Kourion, a Roman port city on the island of Cyprus in the Mediterranean Sea, serve as an example of the modern approach. Portions of Kourion had been unexpectedly buried by a massive earthquake in the fourth century A.D. Traditional archaeologists were interested primarily in the remains of Kourion’s theater, temple, and classical monuments. They also collected precious objects, such as jewelry, found in nearby tombs. Modern archaeologists, however, have focused their studies and excavations on the settlement itself. This preserved seaport has proved to be a gold mine of important information about everyday life sixteen centuries ago.</p><p>During one excavation of a house at Kourion, for example, forensic anthropologists were able to reconstruct the skeleton of a young girl, whom they called Camelia. On the basis of her teeth, they determined her age to be about thirteen, although measurement of her skeleton showed that she was only the size of a modern eleven-year-old. The study of the teeth also confirmed her sex and pointed to her excellent health; Camelia had no cavities. Even after centuries, the forensic scientists could study the physical evidence in ways similar to those used in criminal investigations to determine the circumstances of Camelia’s death.</p><p>Other specialists on this excavation included a zooarchaeologist, who identified animal remains, including the skeleton of a mule found near Camelia. Another specialist, a paleobotanist, studied the contents of a bake oven at the site and identified four domesticated grains among the charred crumbs—evidence of a kind of ancient multigrain bread.</p><p>Although the archaeologists at this site unearthed a few beautiful items, the excavation did not uncover any priceless artwork for museums. Nonetheless, the archaeological processes used in Kourion have given us a valuable insight into everyday life in a Roman city.</p>",
    text: uncoveringThePast20182019FormBPassageText,
    versionLabel: "2018-2019 Form B",
  }),
  questions: uncoveringThePast20182019FormBQuestions,
};
