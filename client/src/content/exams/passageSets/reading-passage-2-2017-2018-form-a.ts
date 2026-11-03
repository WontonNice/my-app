import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage220172018FormAPassageText = "The British novelist Charles Dickens is well known for the colorful and eccentric characters he created in his many novels. But one of his books, David Copperfield, seems to have a great deal to do with fact as well as fiction. After attempting to write his autobiography, Dickens abandoned the project and began to work on a novel, the plot of which was loosely based on his own boyhood experiences. Apparently, it was easier for him to weave the events of his own life into the fiction of David Copperfield than to write about them in nonfiction.\n\nSome of Dickens’s most troubling memories involved a job he held in 1824 as a 12-year- old child. Because his family was deeply in debt, he was forced to quit school and go to work in a London factory, pasting labels on pots of shoe polish. Dickens lived in a boardinghouse, using his meager wages to support himself and to help pay his family’s debts. He worked in the dreary, run-down factory six days a week from 8:00 a.m. to 8:00 p.m. Such long hours were not unusual at the time, for children or adults, but Dickens was miserable during the entire four months he spent working at the factory.\n\nEven when the family finances improved, Dickens continued to work at the factory until his father quarreled with Dickens’s boss, who promptly dismissed the son. Dickens was upset at being fired but relieved to be out of the factory. Thus he felt betrayed when his mother, anxious for the boy’s weekly wage, succeeded in making peace and getting Dickens’s job back for him. The father, however, now sided with his son, and the boy was sent back to school. “I know how these things have worked together to make me what I am,” Dickens later wrote, but he never forgot that his mother was eager for him to return to work.\n\nAs an adult, Dickens always remembered the shame and humiliation he felt during those months at the factory. For years afterward, whenever in London, he could not go near the sites of the factory and boardinghouse, going out of his way to avoid those painful reminders of his past. In fact, Dickens never told his wife and children about his childhood work experience. It was only after his death that they heard of it from a family friend whom Dickens had confided in.\n\nInstead, Dickens expressed his feelings by giving his fictional “other self,” David Copperfield, a job similar to the one he had so hated. In the novel, ten-year-old David is forced by his harsh stepfather to work as a bottle washer in a factory. Young David, who “suffered exquisitely” as a child manual laborer, was apparently Dickens’s way of dealing with his own past. David Copperfield was to become Dickens’s most popular novel, and Dickens himself called it his “favorite child.”";

const readingPassage220172018FormAQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q028",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "28",
      "pages": [
        13
      ]
    },
    "explanation": "28. (G) The issues presented in Option E and Option H are only briefly mentioned or hinted at in the passage. Option F states an important detail about Dickens’s childhood, but it is not a main topic. Option G correctly combines the information in the passage about Dickens’s childhood and the novel David Copperfield.",
    "explanationHtml": "<p>28. (G) The issues presented in Option E and Option H are only briefly mentioned or hinted at in the passage. Option F states an important detail about Dickens’s childhood, but it is not a main topic. Option G correctly combines the information in the passage about Dickens’s childhood and the novel David Copperfield.</p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Dickens’s motivations for becoming a writer</p>",
        "text": "Dickens’s motivations for becoming a writer"
      },
      {
        "id": "B",
        "html": "<p>Dickens’s childhood relationship with his parents</p>",
        "text": "Dickens’s childhood relationship with his parents"
      },
      {
        "id": "C",
        "html": "<p>the autobiographical basis for Dickens’s <em>David Copperfield</em></p>",
        "text": "the autobiographical basis for Dickens’s David Copperfield"
      },
      {
        "id": "D",
        "html": "<p>the characters created by Dickens for <em>David Copperfield</em></p>",
        "text": "the characters created by Dickens for David Copperfield"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q029",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "29",
      "pages": [
        13
      ]
    },
    "explanation": "29. (A) The author includes the details about Dickens’s experiences as an adult in the fourth paragraph in order\n\nto influence him as an adult, as evidenced in lines 43–44 (“As an adult, Dickens always remembered the shame and humiliation”), lines 46–47 (“he could not go near the sites of the factory and boardinghouse”), and lines 49–53 (“Dickens never told his wife and children about his childhood work experience”). This purpose is best stated in Option A. While Dickens was “miserable during the entire four months he spent working at the factory” (lines 26-27) and likely did not want to work in a factory ever again, the author does not include the details in the fourth paragraph to emphasize this idea, ruling out Option B. Option C is incorrect because the detail that Dickens did not share information about his childhood with others is used as a supporting sentence for the idea that childhood experiences affected his adult life. It is also reasonable to infer that Dickens did not want his children to suffer the way that he did, but the details in the fourth paragraph do not emphasize or support this inference, ruling out Option D.",
    "explanationHtml": "<p>29. (A) The author includes the details about Dickens’s experiences as an adult in the fourth paragraph in order</p><p>to influence him as an adult, as evidenced in lines 43–44 (“As an adult, Dickens always remembered the shame and humiliation”), lines 46–47 (“he could not go near the sites of the factory and boardinghouse”), and lines 49–53 (“Dickens never told his wife and children about his childhood work experience”). This purpose is best stated in Option A. While Dickens was “miserable during the entire four months he spent working at the factory” (lines 26-27) and likely did not want to work in a factory ever again, the author does not include the details in the fourth paragraph to emphasize this idea, ruling out Option B. Option C is incorrect because the detail that Dickens did not share information about his childhood with others is used as a supporting sentence for the idea that childhood experiences affected his adult life. It is also reasonable to infer that Dickens did not want his children to suffer the way that he did, but the details in the fourth paragraph do not emphasize or support this inference, ruling out Option D.</p>",
    "points": 1,
    "prompt": "In the fourth paragraph, the author includes details about Dickens’s experiences as an adult in order to",
    "promptHtml": "<p>In the fourth paragraph, the author includes details about Dickens’s experiences as an adult in order to</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>highlight that the time Dickens spent working in the factory affected him throughout his life.</p>",
        "text": "highlight that the time Dickens spent working in the factory affected him throughout his life."
      },
      {
        "id": "B",
        "html": "<p>emphasize that Dickens made sure he would never have to work in a factory again.</p>",
        "text": "emphasize that Dickens made sure he would never have to work in a factory again."
      },
      {
        "id": "C",
        "html": "<p>highlight that Dickens did not readily share details about his childhood with others.</p>",
        "text": "highlight that Dickens did not readily share details about his childhood with others."
      },
      {
        "id": "D",
        "html": "<p>emphasize that Dickens did not want his own children to experience hardships.</p>",
        "text": "emphasize that Dickens did not want his own children to experience hardships."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q030",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "30",
      "pages": [
        13
      ]
    },
    "explanation": "30. (H) Although Dickens disliked his job, there is no reason to think he could not perform his duties (Option E). Option F and Option G might be true, but the details presented in the second and third paragraphs primarily support Option H, the idea that Dickens disliked working in the factory and preferred attending school (“forced to quit school,” “relieved to be out of the factory,” “The father, however, now sided with his son, and the boy was sent back to school”).",
    "explanationHtml": "<p>30. (H) Although Dickens disliked his job, there is no reason to think he could not perform his duties (Option E). Option F and Option G might be true, but the details presented in the second and third paragraphs primarily support Option H, the idea that Dickens disliked working in the factory and preferred attending school (“forced to quit school,” “relieved to be out of the factory,” “The father, however, now sided with his son, and the boy was sent back to school”).</p>",
    "points": 1,
    "prompt": "The details in the second and third paragraphs suggest that young Dickens",
    "promptHtml": "<p>The details in the second and third paragraphs suggest that young Dickens</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>struggled to perform his job in the factory.</p>",
        "text": "struggled to perform his job in the factory."
      },
      {
        "id": "B",
        "html": "<p>worried about the financial situation of his family.</p>",
        "text": "worried about the financial situation of his family."
      },
      {
        "id": "C",
        "html": "<p>wished he had a better relationship with his parents.</p>",
        "text": "wished he had a better relationship with his parents."
      },
      {
        "id": "D",
        "html": "<p>preferred attending school to working in a factory.</p>",
        "text": "preferred attending school to working in a factory."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q031",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "31",
      "pages": [
        13
      ]
    },
    "explanation": "31. (B) The correct answer is found in lines 10–13 and in the fifth paragraph. Dickens wrote David Copperfield because he was unable to complete his autobiography and writing the novel helped him deal with difficult childhood memories (Option B). Dickens’s writings as an adult would not have helped pay his family’s\n\ndebts (Option A). While it may be true that Dickens avoided telling his children about his job at the factory (Option C), that is not the reason Dickens wrote David Copperfield. Option D is incorrect because Dickens did not intend to share information about his own experiences.",
    "explanationHtml": "<p>31. (B) The correct answer is found in lines 10–13 and in the fifth paragraph. Dickens wrote David Copperfield because he was unable to complete his autobiography and writing the novel helped him deal with difficult childhood memories (Option B). Dickens’s writings as an adult would not have helped pay his family’s</p><p>debts (Option A). While it may be true that Dickens avoided telling his children about his job at the factory (Option C), that is not the reason Dickens wrote David Copperfield. Option D is incorrect because Dickens did not intend to share information about his own experiences.</p>",
    "points": 1,
    "prompt": "Which of the following is the most likely reason that Dickens wrote David Copperfield?",
    "promptHtml": "<p>Which of the following is the most likely reason that Dickens wrote <em>David Copperfield</em>?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>He needed money from the novel to help pay his family’s debts.</p>",
        "text": "He needed money from the novel to help pay his family’s debts."
      },
      {
        "id": "B",
        "html": "<p>He needed a way to cope with the difficulties of his childhood.</p>",
        "text": "He needed a way to cope with the difficulties of his childhood."
      },
      {
        "id": "C",
        "html": "<p>He wanted to avoid telling his children about his experiences in the factory.</p>",
        "text": "He wanted to avoid telling his children about his experiences in the factory."
      },
      {
        "id": "D",
        "html": "<p>He wanted to explain how his childhood had influenced his adult life.</p>",
        "text": "He wanted to explain how his childhood had influenced his adult life."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "32",
      "pages": [
        13
      ]
    },
    "explanation": "32. (F) The passage says little about the relationship between Dickens and his mother, only that Dickens felt betrayed when his mother, anxious for the boy’s wages, got his job back for him (lines 33–36). Option F best expresses this information. Option E suggests that they did not have a positive relationship, but there is no evidence in the passage to support this inference. Dickens may have hoped his mother would understand why he wanted to go to school (Option G), but this idea is not clearly expressed in the passage. Dickens’s mother did negotiate with the factory boss on his behalf (Option H), but this action does not describe their relationship.",
    "explanationHtml": "<p>32. (F) The passage says little about the relationship between Dickens and his mother, only that Dickens felt betrayed when his mother, anxious for the boy’s wages, got his job back for him (lines 33–36). Option F best expresses this information. Option E suggests that they did not have a positive relationship, but there is no evidence in the passage to support this inference. Dickens may have hoped his mother would understand why he wanted to go to school (Option G), but this idea is not clearly expressed in the passage. Dickens’s mother did negotiate with the factory boss on his behalf (Option H), but this action does not describe their relationship.</p>",
    "points": 1,
    "prompt": "Based on the details in the third paragraph, what can be concluded about the relationship between Dickens and his mother?",
    "promptHtml": "<p>Based on the details in the third paragraph, what can be concluded about the relationship between Dickens and his mother?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>He avoided her after he was allowed to return to school.</p>",
        "text": "He avoided her after he was allowed to return to school."
      },
      {
        "id": "B",
        "html": "<p>He resented her for putting the need for his wages above his happiness.</p>",
        "text": "He resented her for putting the need for his wages above his happiness."
      },
      {
        "id": "C",
        "html": "<p>He hoped she would understand why attending school was important to him.</p>",
        "text": "He hoped she would understand why attending school was important to him."
      },
      {
        "id": "D",
        "html": "<p>He recognized that she had the authority to negotiate on his behalf.</p>",
        "text": "He recognized that she had the authority to negotiate on his behalf."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-a-pdf-shsat-2017-2018-a-q033",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "33",
      "pages": [
        13
      ]
    },
    "explanation": "33. (D) The passage states, “The father, however, now sided with his son, and the boy was sent back to school” (lines 36–38). In other words, Dickens was able to return to school because his father supported the idea (Option D). The discussion between his mother and his boss (Option A) led to Dickens getting his factory job back. The argument between his father and his boss (Option B) led to Dickens’s dismissal from his job, not his return to school. Getting fired from the factory (Option C) occurred before Dickens returned to school but was not the direct reason for it.",
    "explanationHtml": "<p>33. (D) The passage states, “The father, however, now sided with his son, and the boy was sent back to school” (lines 36–38). In other words, Dickens was able to return to school because his father supported the idea (Option D). The discussion between his mother and his boss (Option A) led to Dickens getting his factory job back. The argument between his father and his boss (Option B) led to Dickens’s dismissal from his job, not his return to school. Getting fired from the factory (Option C) occurred before Dickens returned to school but was not the direct reason for it.</p>",
    "points": 1,
    "prompt": "What most directly enabled Charles Dickens to return to school?",
    "promptHtml": "<p>What most directly enabled Charles Dickens to return to school?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>the discussion between his mother and his boss</p>",
        "text": "the discussion between his mother and his boss"
      },
      {
        "id": "B",
        "html": "<p>the argument between his father and his boss</p>",
        "text": "the argument between his father and his boss"
      },
      {
        "id": "C",
        "html": "<p>getting fired from the factory</p>",
        "text": "getting fired from the factory"
      },
      {
        "id": "D",
        "html": "<p>getting support from his father</p>",
        "text": "getting support from his father"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const readingPassage220172018FormAPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-2-2017-2018-form-a",
  versionLabels: ["2017-2018 Form A"],
  label: "2017-2018 Form A",
  section: "reading",
  questionCount: readingPassage220172018FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-2-2017-2018-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 2",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-a","label":"2017-2018 Form A","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf","year":"2017-2018","form":"A","packageId":"c0a54dc58dec79dd9b6d1651e86056e9e8f83bd6f03529e747c79d3391bed025"},
    title: "Reading Passage 2",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">The British novelist Charles Dickens is well known for the colorful and eccentric characters he created in his many novels. But one of his books, <em>David Copperfield</em>, seems to <sup>5</sup> have a great deal to do with fact as well as fiction. After attempting to write his autobiography, Dickens abandoned the project and began to work on a novel, the plot of which was loosely based on his own <sup>10</sup> boyhood experiences. Apparently, it was easier for him to weave the events of his own life into the fiction of <em>David Copperfield</em> than to write about them in nonfiction.</p><p data-numbered=\"false\">Some of Dickens’s most troubling memories <sup>15</sup> involved a job he held in 1824 as a 12-year- old child. Because his family was deeply in debt, he was forced to quit school and go to work in a London factory, pasting labels on pots of shoe polish. Dickens lived in a <sup>20</sup> boardinghouse, using his meager wages to support himself and to help pay his family’s debts. He worked in the dreary, run-down factory six days a week from 8:00 a.m. to 8:00 p.m. Such long hours were not unusual <sup>25</sup> at the time, for children or adults, but Dickens was miserable during the entire four months he spent working at the factory.</p><p data-numbered=\"false\">Even when the family finances improved, Dickens continued to work at the factory <sup>30</sup> until his father quarreled with Dickens’s boss, who promptly dismissed the son. Dickens was upset at being fired but relieved to be out of the factory. Thus he felt betrayed when his mother, anxious for the boy’s weekly <sup>35</sup> wage, succeeded in making peace and getting Dickens’s job back for him. The father, however, now sided with his son, and the boy was sent back to school. “I know how these things have worked together to make me <sup>40</sup> what I am,” Dickens later wrote, but he never forgot that his mother was eager for him to return to work.</p><p data-numbered=\"false\">As an adult, Dickens always remembered the shame and humiliation he felt during those <sup>45</sup> months at the factory. For years afterward, whenever in London, he could not go near the sites of the factory and boardinghouse, going out of his way to avoid those painful reminders of his past. In fact, Dickens never <sup>50</sup> told his wife and children about his childhood work experience. It was only after his death that they heard of it from a family friend whom Dickens had confided in.</p><p data-numbered=\"false\">Instead, Dickens expressed his feelings by <sup>55</sup> giving his fictional “other self,” <em>David Copperfield</em>, a job similar to the one he had so hated. In the novel, ten-year-old David is forced by his harsh stepfather to work as a bottle washer in a factory. Young David, who <sup>60</sup> “suffered exquisitely” as a child manual laborer, was apparently Dickens’s way of dealing with his own past. <em>David Copperfield</em> was to become Dickens’s most popular novel, and Dickens himself called it his “favorite <sup>65</sup> child.”</p>",
    text: readingPassage220172018FormAPassageText,
    versionLabel: "2017-2018 Form A",
  }),
  questions: readingPassage220172018FormAQuestions,
};
