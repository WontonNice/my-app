import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theYearWithoutASummer20182019FormAPassageText = "The eruption of the Philippine volcano Mount Pinatubo in June 1991 sent a huge cloud of gas and du encircling the globe. The dust and ash from Mount Pinatubo was blamed for a two-year decrease in global temperature, changes in weather patterns, and damage to the ozone layer. The situation bring to mind a time now remembered as “The Year without a Summer,” a meteorological event that occurred 175 years earlier. At that time, harsh weather conditions plagued much of eastern North America and, to a lesser extent, northern Europe.\n\nApril 1816 brought typical spring weather to upstate New York and New England; trees budded, and farmers prepared to plow and plant. In May, however, the expected warm temperatures failed to arrive. Most people remained optimistic, waiting for the summer that was “just around the corner.” They waited in vain. During the first week of June, ten inches of snow fell on New England. Throughout the month, temperatures rarely rose above the 30s. Many farmers replanted crops sever times, only to see them stunted or destroyed by sleet, hail, and icy winds. July and August brought little improvement. During most days the temperature stayed in the 40s. Farmers’ diaries document the farmers’ daily struggles with near-freezing temperatures, failing crops, and dying farm animals. The few crops that managed to survive were killed by frost in mid-September. Winter came early in New England and was unusually severe. Even the South was affected; on July 4, the high temperatur for Savannah, Georgia, was only 46 degrees Fahrenheit!\n\nSome religious leaders warned their congregations that the unusual weather meant that the end of the world was drawing near. Other leaders attributed the cool weather to unusual sunspot activity. The proliferation of the newly invented lightning rod was also blamed as some people believed that lightning rods had interrupted the natural temperature balance of Earth, causing the cooler temperatures.\n\nIt was not until October that the first plausible explanation for “The Year without a Summer” was suggested. Friedrich Bessel, a German astronomer, reported seeing thick clouds of dust in the upper atmosphere. He theorized that these dust particles screened portions of Earth from the warming rays of the sun. It was discovered that in April 1815, Mount Tambora, an Indonesian volcano, had erupted with such force that it had sent an estimated 100 cubic miles of fine dust into the atmosphere. Witnesses to the eruption reported that the sky remained dark for two days. The dust then rose high into the stratosphere, where it encircled the world for several years to come.\n\nSkeptics in 1816 doubted that a faraway volcano could steal their summer. However, most present-da researchers believe Bessel’s explanation to be generally correct, demonstrating the global nature of weather. The dust in the atmosphere eventually settled, and the spring of 1817 was back to normal.";

const theYearWithoutASummer20182019FormAQuestions: ExamQuestion[] = [
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q051",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "51",
      "pages": [
        31
      ]
    },
    "explanation": "51. (B) The question asks for the best summary sentence for the passage. The passage is mostly about the strange, cold summer of 1816 and speculation around its cause, which is best stated in Option B. Option A is incorrect because it is a detail in paragraph 3 about one theory regarding the cause of the weather. Option C is incorrect because the passage is about more than agriculture in New England (paragraphs 1 and 2). Option D is incorrect because it is a detail in the passage mentioned only in paragraph 1.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q051-explanation-1.png\" alt=\"Supplied Form A explanation for question 51\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the belief of some religious leaders that the end of the world was coming in 1816</p>",
        "text": "the belief of some religious leaders that the end of the world was coming in 1816"
      },
      {
        "id": "B",
        "html": "<p>a summer of strange weather and its probable cause</p>",
        "text": "a summer of strange weather and its probable cause"
      },
      {
        "id": "C",
        "html": "<p>the importance of summer weather to agriculture in New England</p>",
        "text": "the importance of summer weather to agriculture in New England"
      },
      {
        "id": "D",
        "html": "<p>a comparison of the weather of 1816 and 1991</p>",
        "text": "a comparison of the weather of 1816 and 1991"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q052",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "52",
      "pages": [
        32
      ]
    },
    "explanation": "52. (E) The question asks for the sentence that provides the best reason for the farmers replanting their crops. Paragraph 2 states that “farmers prepared to plow and plant” because they “expected warm temperatures” and were “optimistic.” This suggests that the farmers kept replanting their crops because they expected the weather to return to normal, which is reflected in Option E. Option F is incorrect because the cold weather and the snow actually worsened growing conditions (paragraph 2). Option G is incorrect because, while “July and August brought little improvement” (paragraph 2), it is throughout the month of June that farmers replanted crops. Option H is incorrect because, while the farmers kept replanting their crops with the expectation of normal\n\nweather to return, the passage does not state that was because the farmers thought the snow would provide moisture.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q052-explanation-1.png\" alt=\"Supplied Form A explanation for question 52\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q052-explanation-2.png\" alt=\"Supplied Form A explanation for question 52\" width=\"348\"></p>",
    "points": 1,
    "prompt": "What is the most likely reason farmers persisted in replanting their crops?",
    "promptHtml": "<p>What is the most likely reason farmers persisted in replanting their crops?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>They believed that the cold weather could not continue all summer long.</p>",
        "text": "They believed that the cold weather could not continue all summer long."
      },
      {
        "id": "B",
        "html": "<p>They thought that crops would be able to survive even though the weather remained cold.</p>",
        "text": "They thought that crops would be able to survive even though the weather remained cold."
      },
      {
        "id": "C",
        "html": "<p>They believed that the improved weather conditions of July would last.</p>",
        "text": "They believed that the improved weather conditions of July would last."
      },
      {
        "id": "D",
        "html": "<p>They thought the June snowfalls would provide needed moisture.</p>",
        "text": "They thought the June snowfalls would provide needed moisture."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q053",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "53",
      "pages": [
        32
      ]
    },
    "explanation": "53. (C) The question asks for the outcome that is best implied by the situation the New Englanders faced in 1816. Option C is the correct answer because, with many crops “stunted or destroyed” (paragraph 2) in the summer of 1816, one would expect food shortages the following winter. Option A is incorrect because cold weather was familiar to the population in New England, just not for such an extended period of time. Option B is incorrect because there is no evidence in the passage that people experienced warmer temperatures. Option D is incorrect because, although some famers did replant their crops, there is no evidence in the passage that they struggled to adjust to a different timeline for farming.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q053-explanation-1.png\" alt=\"Supplied Form A explanation for question 53\" width=\"348\"></p>",
    "points": 1,
    "prompt": "In the winter that followed the summer of 1816, New Englanders most likely experienced",
    "promptHtml": "<p>In the winter that followed the summer of 1816, New Englanders most likely experienced</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>new weather events that they had not encountered before.</p>",
        "text": "new weather events that they had not encountered before."
      },
      {
        "id": "B",
        "html": "<p>temperatures that were warmer than usual for that time of year.</p>",
        "text": "temperatures that were warmer than usual for that time of year."
      },
      {
        "id": "C",
        "html": "<p>shortages of fruits, vegetables, and other essential crops.</p>",
        "text": "shortages of fruits, vegetables, and other essential crops."
      },
      {
        "id": "D",
        "html": "<p>difficulty adjusting to a different timeline for planting crops.</p>",
        "text": "difficulty adjusting to a different timeline for planting crops."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q054",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "54",
      "pages": [
        32
      ]
    },
    "explanation": "54. (F) The question asks for the purpose and importance of paragraph 3 to the passage. Paragraph 3 describes how nineteenth-century religious and other leaders tried to account for the cooler weather in 1816. Some leaders thought it was “the end of the world,” “sunspot activity,” or the proliferation of a new invention. How this information contributed to the passage is stated in Option F. Option E is incorrect because the causes described in paragraph 3 were not the most probable cause, as “the first plausible explanation”—Bessel’s—is described later in the passage. Option G is incorrect because more than one theory is presented in paragraph 3. Option H is incorrect because the ideas described are not included in paragraph 3.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q054-explanation-1.png\" alt=\"Supplied Form A explanation for question 54\" width=\"348\"></p>",
    "points": 1,
    "prompt": "How does paragraph 3 contribute to the passage?",
    "promptHtml": "<p>How does paragraph 3 contribute to the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It presents the most probable cause of the 1816 weather.</p>",
        "text": "It presents the most probable cause of the 1816 weather."
      },
      {
        "id": "B",
        "html": "<p>It shows how nineteenth-century people explained the 1816 weather.</p>",
        "text": "It shows how nineteenth-century people explained the 1816 weather."
      },
      {
        "id": "C",
        "html": "<p>It presents a theory about the 1816 weather that some skeptics doubted.</p>",
        "text": "It presents a theory about the 1816 weather that some skeptics doubted."
      },
      {
        "id": "D",
        "html": "<p>It includes eyewitness reports to describe the source of the 1816 weather.</p>",
        "text": "It includes eyewitness reports to describe the source of the 1816 weather."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q055",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "55",
      "pages": [
        32
      ]
    },
    "explanation": "55. (B) The question asks why the details about the eruption of Mount Tambora are included in the passage. The details in paragraph 4 about the eruption highlight the severity of the eruption and how it clouded the atmosphere and eventually encircled the world, making Option B the correct answer. Option A is incorrect because the passage does not support the idea that the effects are still present today. Option C is incorrect because the details may include information about what happens during an eruption, but the author is specifically describing the event at Mount Tambora as the inception of weather issues all over the world. Option D is incorrect because, while it is possible that people perceive natural events in various parts of the world differently, the specific details about the force and magnitude of the eruption do not emphasize this idea.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q055-explanation-1.png\" alt=\"Supplied Form A explanation for question 55\" width=\"348\"></p>",
    "points": 1,
    "prompt": "The author includes the details in paragraph 4 about the eruption of Mount Tambora in order to",
    "promptHtml": "<p>The author includes the details in paragraph 4 about the eruption of Mount Tambora in order to</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggest that the aftermath of the eruption still affects the environment today.</p>",
        "text": "suggest that the aftermath of the eruption still affects the environment today."
      },
      {
        "id": "B",
        "html": "<p>highlight the severe impact that the eruption had on the atmosphere.</p>",
        "text": "highlight the severe impact that the eruption had on the atmosphere."
      },
      {
        "id": "C",
        "html": "<p>provide a description of what happens during a volcanic eruption.</p>",
        "text": "provide a description of what happens during a volcanic eruption."
      },
      {
        "id": "D",
        "html": "<p>emphasize how differently people perceive natural events in various parts of the world.</p>",
        "text": "emphasize how differently people perceive natural events in various parts of the world."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q056",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "56",
      "pages": [
        33
      ]
    },
    "explanation": "56. (H) The question asks for the implied meaning behind the phrase “the global nature of weather”\n\n(paragraph 5). This phrase refers to how conditions in one part of the world can affect weather in another part of the world. Option H is correct because it clarifies “global” by explaining the relationship between weather and conditions all over the world. Option E is incorrect because the phrase in paragraph 5 is about the effects of weather conditions around the world, not about making weather predictions. Option F is incorrect because it discusses the lasting impact on specific geographical areas, while the phrase “the global nature of weather” refers to events that affect the entire world. Option G is incorrect because, while weather events (the unusually cold summer in New England in 1816) can be related to natural disasters (a volcano eruption), there is no support in the passage for the idea that natural disasters tend to occur at the same time.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q056-explanation-1.png\" alt=\"Supplied Form A explanation for question 56\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q056-explanation-2.png\" alt=\"Supplied Form A explanation for question 56\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which of the following is implied by the phrase “the global nature of weather” (paragraph 5)?",
    "promptHtml": "<p>Which of the following is implied by the phrase “the global nature of weather” (paragraph 5)?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>Understanding weather events around the world is important for making weather predictions.</p>",
        "text": "Understanding weather events around the world is important for making weather predictions."
      },
      {
        "id": "B",
        "html": "<p>Extreme weather conditions in some parts of the world can have a lasting impact on a geographical area.</p>",
        "text": "Extreme weather conditions in some parts of the world can have a lasting impact on a geographical area."
      },
      {
        "id": "C",
        "html": "<p>Natural disasters tend to occur in different parts of the world at the same time.</p>",
        "text": "Natural disasters tend to occur in different parts of the world at the same time."
      },
      {
        "id": "D",
        "html": "<p>Conditions in one part of the world can affect weather in another part of the world.</p>",
        "text": "Conditions in one part of the world can affect weather in another part of the world."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-year-without-a-summer-2018-2019-form-a-pdf-shsat-2018-2019-a-q057",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "57",
      "pages": [
        33
      ]
    },
    "explanation": "57. (D) The question asks for the likely cause of the cold summer of 1816, based on the reason given in the passage. Researchers today believe that Bessel’s theory that “dust particles screened portions of Earth from the warming rays of the sun” is the most logical and probable (paragraph 5). His ideas are summarized in paragraph 4, and Option D restates his theory, making Option D the correct answer. Option A is incorrect because this was a possibility considered by some leaders, but there is no evidence in the passage that this theory was supported by thorough scientific research. Option B is incorrect because this theory was thought to be a possible cause by some people, but Bessel’s theory is the most probable. Option C explains damage that was caused by the Mount Pinatubo eruption in 1991 (paragraph 1), but that damage is not the cause of the cold summer of 1816.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q057-explanation-1.png\" alt=\"Supplied Form A explanation for question 57\" width=\"351\"></p>",
    "points": 1,
    "prompt": "The cold summer of 1816 was most likely caused by",
    "promptHtml": "<p>The cold summer of 1816 was most likely caused by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>unusual sunspot activity.</p>",
        "text": "unusual sunspot activity."
      },
      {
        "id": "B",
        "html": "<p>the excessive use of lightning rods.</p>",
        "text": "the excessive use of lightning rods."
      },
      {
        "id": "C",
        "html": "<p>damage to the ozone layer.</p>",
        "text": "damage to the ozone layer."
      },
      {
        "id": "D",
        "html": "<p>an increase of dust in the atmosphere.</p>",
        "text": "an increase of dust in the atmosphere."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const theYearWithoutASummer20182019FormAPassageSet: ExamPassageSet = {
  id: "ela-the-year-without-a-summer-2018-2019-form-a",
  versionLabels: ["2018-2019 Form A"],
  label: "2018-2019 Form A",
  section: "reading",
  questionCount: theYearWithoutASummer20182019FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "the-year-without-a-summer-2018-2019-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "The Year without a Summer",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form A","year":"2018-2019","form":"A","packageId":"62c32b0be11d7e87c41a85210539247ebd09577385a479a3bff2c1df4b4c718e"},
    title: "The Year without a Summer",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>The eruption of the Philippine volcano Mount Pinatubo in June 1991 sent a huge cloud of gas and du encircling the globe. The dust and ash from Mount Pinatubo was blamed for a two-year decrease in global temperature, changes in weather patterns, and damage to the ozone layer. The situation bring to mind a time now remembered as “The Year without a Summer,” a meteorological event that occurred 175 years earlier. At that time, harsh weather conditions plagued much of eastern North America and, to a lesser extent, northern Europe.</p><p>April 1816 brought typical spring weather to upstate New York and New England; trees budded, and farmers prepared to plow and plant. In May, however, the expected warm temperatures failed to arrive. Most people remained optimistic, waiting for the summer that was “just around the corner.” They waited in vain. During the first week of June, ten inches of snow fell on New England. Throughout the month, temperatures rarely rose above the 30s. Many farmers replanted crops sever times, only to see them stunted or destroyed by sleet, hail, and icy winds. July and August brought little improvement. During most days the temperature stayed in the 40s. Farmers’ diaries document the farmers’ daily struggles with near-freezing temperatures, failing crops, and dying farm animals. The few crops that managed to survive were killed by frost in mid-September. Winter came early in New England and was unusually severe. Even the South was affected; on July 4, the high temperatur for Savannah, Georgia, was only 46 degrees Fahrenheit!</p><p>Some religious leaders warned their congregations that the unusual weather meant that the end of the world was drawing near. Other leaders attributed the cool weather to unusual sunspot activity. The proliferation of the newly invented lightning rod was also blamed as some people believed that lightning rods had interrupted the natural temperature balance of Earth, causing the cooler temperatures.</p><p>It was not until October that the first plausible explanation for “The Year without a Summer” was suggested. Friedrich Bessel, a German astronomer, reported seeing thick clouds of dust in the upper atmosphere. He theorized that these dust particles screened portions of Earth from the warming rays of the sun. It was discovered that in April 1815, Mount Tambora, an Indonesian volcano, had erupted with such force that it had sent an estimated 100 cubic miles of fine dust into the atmosphere. Witnesses to the eruption reported that the sky remained dark for two days. The dust then rose high into the stratosphere, where it encircled the world for several years to come.</p><p>Skeptics in 1816 doubted that a faraway volcano could steal their summer. However, most present-da researchers believe Bessel’s explanation to be generally correct, demonstrating the global nature of weather. The dust in the atmosphere eventually settled, and the spring of 1817 was back to normal.</p>",
    text: theYearWithoutASummer20182019FormAPassageText,
    versionLabel: "2018-2019 Form A",
  }),
  questions: theYearWithoutASummer20182019FormAQuestions,
};
