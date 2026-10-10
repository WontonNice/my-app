import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theBenefitsOfIndoorPlants20202021FormAPassageText = "(1) In an age of endless media content, it is easy to see why people might prefer to stay inside. (2) According to a study sponsored by the Environmental Protection Agency, Americans spend an average of 87 percent of their time indoors. (3) Scientists say that this separation between people and nature puts people at risk for physical and psychological issues.\n\n(4) During the process of photosynthesis, plants convert carbon dioxide into oxygen and remove many harmful toxins from the air. (5) Spending prolonged periods of time indoors, away from plants, deprives people of these benefits. (6) Air that is not regularly detoxified can lead to a condition known as sick building syndrome. (7) This disorder first came to light in the 1970s when many office workers in the United States began to complain of unexplained flu-like symptoms. (8) Researchers determined the cause to be volatile organic compounds, or VOCs. (9) VOCs are harmful chemicals that are emitted by everyday objects such as carpet, furniture, cleaning products, and computers. (10) The NASA Clean Air Study found a simple way to remove a significant number of VOCs within a 24-hour period: add plants to indoor spaces.\n\n(11) Adding plants to indoor spaces has psychological benefits too. (12) Research has long linked time spent in natural environments with increased energy and feelings of contentment. (13) While being outdoors is an excellent option for improving a person’s mental health, recent research has indicated that encountering natural elements while indoors can also help. (14) To experience the maximum benefit of natural elements, experts suggest placing at least one live plant per 100 square feet of home or office space.\n\n(15) Connecting with nature, even just by being near an indoor plant, is a significant factor in a person’s well-being. (16) Sitting in front of an electronic screen all day isn’t natural, and today’s workers need to get up and get outdoors. (17) Richard Ryan, a psychology professor at the University of Rochester, puts it this way: “Nature is something within which we flourish, so having it be more a part of our lives is critical, especially when we live and work in built environments.”";

const theBenefitsOfIndoorPlants20202021FormAQuestions: ExamQuestion[] = [
  {
    "id": "the-benefits-of-indoor-plants-2020-2021-form-a-benefits-of-indoor-plants-11",
    "explanation": "11. The question asks which sentence should follow sentence 3 to best introduce the topic of the passage.\n\nA. CORRECT. The sentence introduces the overall topic by previewing the main ideas in the passage. It introduces the connection between natural elements and well-being (“a healthy bridge”) and sets up the main argument of the passage (“Placing plants in homes and offices” can increase people’s well-being).\n\nB. Incorrect. Although sentence 3 mentions the connection between “people and nature,” this sentence references the importance of spending time near plants while both indoors and outdoors. However, the passage focuses specifically on the benefits of having indoor plants.\n\nC. Incorrect: Though the sentence describes a reason why indoor plants are important (“For [people’s] personal health and well-being”), the topic of the passage is related to the need for indoor plants, not the need for people to spend more time outdoors.\n\nD. Incorrect. While the sentence refers to how time away from nature can affect health and well-being, the vague wording (“little connection to nature”) makes this sentence too broad to introduce the topic of the passage, and thus, it should not follow sentence 3.",
    "points": 1,
    "prompt": "Which sentence should follow sentence 3 to best introduce the topic of the passage?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Placing plants in homes and offices can provide a healthy bridge between nature and the indoors."
      },
      {
        "id": "B",
        "text": "It is important for people to realize that they need to spend more time near plants, whether indoors or out in nature."
      },
      {
        "id": "C",
        "text": "For their personal health and well-being, people need to spend more time outdoors or bring the outdoors in."
      },
      {
        "id": "D",
        "text": "Individuals with little connection to nature can experience illness, depression, and higher levels of stress."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-benefits-of-indoor-plants-2020-2021-form-a-benefits-of-indoor-plants-12",
    "explanation": "12. The question asks for the transition word or phrase that should be added to the beginning of sentence 5.\n\nE. Incorrect. The transition phrase “As a result” conveys a cause-and-effect relationship that does not exist between the ideas in sentence 4 and sentence 5. Although the plants’ conversion of carbon dioxide into oxygen removes harmful toxins from the air, the process of photosynthesis (sentence 4) does not deprive people of the plants’ benefits (sentence 5).\n\nF. Incorrect. Although the passage describes why people should spend time in close proximity to plants, the idea in sentence 5 is actually in opposition to the idea in sentence 4 rather than an elaboration of it. The transition word “Primarily” incorrectly suggests that the sentences describe the same idea.\n\nG. Incorrect. Although sentence 4 describes a positive idea (plants are beneficial) and sentence 5 describes a negative idea (deprivation), the transition phrase “In contrast” conveys an inaccurate relationship between the ideas in the sentences. Sentence 5 is not arguing against the beneficial effect of plants and should not begin with a transition that implies opposition.\n\nH. CORRECT. The relationship between the ideas in the sentences is correctly conveyed with the transition word “Unfortunately,” which signals the shift from the positive effect described in sentence 4 (plants are helpful) to the emphasis in sentence 5 that the positive effect is dependent on proximity to plants.",
    "points": 1,
    "prompt": "Which transition word or phrase should be added to the beginning of sentence 5?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "As a result,"
      },
      {
        "id": "B",
        "text": "Primarily,"
      },
      {
        "id": "C",
        "text": "In contrast,"
      },
      {
        "id": "D",
        "text": "Unfortunately,"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-benefits-of-indoor-plants-2020-2021-form-a-benefits-of-indoor-plants-13",
    "explanation": "13. The question asks for the sentence that could best follow sentence 13 to support the ideas in the third paragraph (sentences 11–14).\n\nA. CORRECT. The sentence could best follow sentence 13 because it directly supports the main idea of the third paragraph that indoor plants provide “psychological benefits” (sentence 11) by presenting the findings of a relevant research study. The details about the study provide a concrete example of the mental benefits of indoor plants: the employees in the study who worked near plants “were more creative” and accomplished more than those who worked in spaces without plants.\n\nB. Incorrect. Although the sentence describes a study in which indoor plants were found to have a positive effect, it does not clearly support the ideas in sentences 11–14, because the sentence focuses on the popularity of the hotel rather than psychological benefits. Therefore, this sentence does not best follow sentence 13 to support the ideas in the third paragraph.\n\nC. Incorrect. Although the sentence suggests that being “routinely exposed to natural elements” can increase the positive emotion of compassion, it could not best follow sentence 13, because the reference to “natural elements” is too vague to sufficiently support the ideas in the third paragraph. The sentence does not logically follow the idea from sentence 13, which refers specifically to “encountering natural elements while indoors.”\n\nD. Incorrect. The sentence develops the idea that indoor plants are helpful by comparing them to carpeting and stating that they can reduce the amount of noise that people perceive. Noise cancellation, though convenient, is irrelevant to the topic of the third paragraph, which is specific to the psychological benefits of indoor plants. Therefore, this sentence does not best follow sentence 13 to support the ideas in the third paragraph.",
    "points": 1,
    "prompt": "Which sentence could best follow sentence 13 to support the ideas in the third paragraph (sentences 11–14)?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "A global study of 7,600 workers from sixteen countries revealed that employees who worked in spaces with natural elements, such as indoor plants, were more creative and productive than employees who worked in spaces without natural elements."
      },
      {
        "id": "B",
        "text": "Specifically, a study suggests that one well-known hotel is popular among guests because its owners have made a significant investment in landscaping and indoor plants known to have a relaxing effect."
      },
      {
        "id": "C",
        "text": "In fact, one recent study suggested that people who are routinely exposed to natural elements seem to increase their compassion for others, perhaps because that exposure generates compassion for the environment in which they live."
      },
      {
        "id": "D",
        "text": "According to a study that was conducted in 2003, plants can reduce the amount of noise that people perceive in indoor spaces with hard surfaces, just as adding carpet can make a room seem quieter."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-benefits-of-indoor-plants-2020-2021-form-a-benefits-of-indoor-plants-14",
    "explanation": "14. The question asks for the sentence that presents ideas irrelevant to the topic of the passage and should be deleted.\n\nE. Incorrect. Sentence 11 presents one of the key reasons why plants are so important in indoor spaces: they have a positive effect on mental health. The idea that plants provide psychological benefits is relevant to the topic of the passage, and the sentence should not be deleted.\n\nF. Incorrect. Sentence 14 is relevant to the topic because it explains how many plants a person should add to a space in order to experience “the maximum benefit of natural elements.” This idea addresses the main topic of the passage, and the sentence should not be deleted.\n\nG. Incorrect. Although “connecting with nature” is somewhat broader than the topic of the passage, sentence 15 is relevant and belongs in the passage because it specifically refers to using indoor plants as one way to connect with nature (“even just by being near an indoor plant”). Therefore, the sentence should not be deleted.\n\nH. CORRECT. While the topic of the passage is the harm caused by the “separation between people and nature” (sentence 3), the reference in sentence 16 to “an electronic screen” is irrelevant to the topic of the passage. The idea that “today’s workers need to get up and get outdoors” (sentence 16) is, in fact, the opposite of what the passage argues, and the sentence should be deleted.",
    "points": 1,
    "prompt": "Which sentence presents ideas irrelevant to the topic of the passage and should be deleted?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "sentence 11"
      },
      {
        "id": "B",
        "text": "sentence 14"
      },
      {
        "id": "C",
        "text": "sentence 15"
      },
      {
        "id": "D",
        "text": "sentence 16"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-benefits-of-indoor-plants-2020-2021-form-a-benefits-of-indoor-plants-15",
    "explanation": "15. The question asks for the concluding sentence that should follow sentence 17 to best support the information presented in the passage.\n\nA. Incorrect. Although the sentence describes plants as “vital to our wholeness and wellness,” the detail about the absorption of carbon dioxide from the air is overly specific and does not capture the broader argument presented in the passage (that placing plants indoors “is a significant factor in a person’s well-being” [sentence 15]).\n\nB. Incorrect. The sentence’s reference to particular types of plants suitable for indoor spaces supports the idea of incorporating nature into a home or office, but the sentence does not address the benefits people can experience for doing so and thus does not present a logical conclusion for the information in the passage.\n\nC. CORRECT. The sentence directly presents the argument of the passage (“More people should consider bringing natural elements inside”) and supports the central ideas in the second and third paragraphs relating to the health and psychological benefits of having indoor plants.\n\nD. Incorrect. Although the sentence notes the positive impact that houseplants can have on air quality, the sentence does not logically follow the preceding information about the overall benefits to a person’s health and well-being.",
    "points": 1,
    "prompt": "Which concluding sentence should follow sentence 17 to best support the information presented in the passage?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "Because indoor plants absorb the carbon dioxide in our air and release the oxygen we need to breathe, they are vital to our wholeness and wellness."
      },
      {
        "id": "B",
        "text": "Experts say that adding a Boston fern, a spider plant, or an aloe vera plant is a good place to start if you want to begin to incorporate nature into your home or office."
      },
      {
        "id": "C",
        "text": "More people should consider bringing natural elements inside to improve general wellness and reverse some of the negative effects of an indoor-centered society."
      },
      {
        "id": "D",
        "text": "As one study has confirmed, houseplants are a wise investment because they can remove almost 90 percent of the toxins in the air within the span of 24 hours."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const theBenefitsOfIndoorPlants20202021FormAPassageSet: ExamPassageSet = {
  id: "ela-the-benefits-of-indoor-plants-2020-2021-form-a",
  label: "Revising/Editing Part A",
  section: "revising_editing_a",
  questionCount: theBenefitsOfIndoorPlants20202021FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-benefits-of-indoor-plants-2020-2021-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    title: "The Benefits of Indoor Plants",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) In an age of endless media content, it is easy to see why people might prefer to stay inside. (2) According to a study sponsored by the Environmental Protection Agency, Americans spend an average of 87 percent of their time indoors. (3) Scientists say that this separation between people and nature puts people at risk for physical and psychological issues.</p><p>(4) During the process of photosynthesis, plants convert carbon dioxide into oxygen and remove many harmful toxins from the air. (5) Spending prolonged periods of time indoors, away from plants, deprives people of these benefits. (6) Air that is not regularly detoxified can lead to a condition known as sick building syndrome. (7) This disorder first came to light in the 1970s when many office workers in the United States began to complain of unexplained flu-like symptoms. (8) Researchers determined the cause to be volatile organic compounds, or VOCs. (9) VOCs are harmful chemicals that are emitted by everyday objects such as carpet, furniture, cleaning products, and computers. (10) The NASA Clean Air Study found a simple way to remove a significant number of VOCs within a 24-hour period: add plants to indoor spaces.</p><p>(11) Adding plants to indoor spaces has psychological benefits too. (12) Research has long linked time spent in natural environments with increased energy and feelings of contentment. (13) While being outdoors is an excellent option for improving a person’s mental health, recent research has indicated that encountering natural elements while indoors can also help. (14) To experience the maximum benefit of natural elements, experts suggest placing at least one live plant per 100 square feet of home or office space.</p><p>(15) Connecting with nature, even just by being near an indoor plant, is a significant factor in a person’s well-being. (16) Sitting in front of an electronic screen all day isn’t natural, and today’s workers need to get up and get outdoors. (17) Richard Ryan, a psychology professor at the University of Rochester, puts it this way: “Nature is something within which we flourish, so having it be more a part of our lives is critical, especially when we live and work in built environments.”</p>",
    text: theBenefitsOfIndoorPlants20202021FormAPassageText,
    versionLabel: "2020–2021 Form A",
  }),
  questions: theBenefitsOfIndoorPlants20202021FormAQuestions,
};
