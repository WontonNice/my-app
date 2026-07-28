import { createSentenceNumberedPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const indoorPlantsPassageText = "(1) In an age of endless media content, it is easy to see why people might prefer to stay inside.  (2) According to a study sponsored by the Environmental Protection Agency, Americans spend an average of 87 percent of their time indoors.  (3) Scientists say that this separation between people and nature puts people at risk for physical and psychological issues.\n\n(4) During the process of photosynthesis, plants convert carbon dioxide into oxygen and remove many harmful toxins from the air.  (5) Spending prolonged periods of time indoors, away from plants, deprives people of these benefits.  (6) Air that is not regularly detoxified can lead to a condition known as sick building syndrome.  (7) This disorder first came to light in the 1970s when many office workers in the United States began to complain of unexplained flu-like symptoms.  (8) Researchers determined the cause to be volatile organic compounds, or VOCs.  (9) VOCs are harmful chemicals that are emitted by everyday objects such as carpet, furniture, cleaning products, and computers.  (10) The NASA Clean Air Study found a simple way to remove a significant number of VOCs within a 24-hour period: add plants to indoor spaces.\n\n(11) Adding plants to indoor spaces has psychological benefits too.  (12) Research has long linked time spent in natural environments with increased energy and feelings of contentment.  (13) While being outdoors is an excellent option for improving a person’s mental health, recent research has indicated that encountering natural elements while indoors can also help.  (14) To experience the maximum benefit of natural elements, experts suggest placing at least one live plant per 100 square, feet of home or office space.\n\n(15) Connecting with nature, even just by being near an indoor plant, is a significant factor in a person’s well-being.  (16) Sitting in front of an electronic screen all day isn’t natural, and today’s workers need to get up and get outdoors.  (17) Richard Ryan, a psychology professor at the University of Rochester, puts it this way: “Nature is something within which we flourish, so having it be more a part of our lives is critical, especially when we live and work in built environments.”";

const indoorPlantsQuestions: ExamQuestion[] = [
  {
    "id": "indoor-plants-1",
    "points": 1,
    "prompt": "Which sentence should follow sentence 3 to best introduce the topic of the passage?",
    "promptHtml": "Which sentence should follow sentence 3 to <strong>best</strong> introduce the topic of the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Placing plants in homes and offices can provide a healthy bridge between nature and the indoors.",
        "text": "Placing plants in homes and offices can provide a healthy bridge between nature and the indoors."
      },
      {
        "id": "B",
        "html": "It is important for people to realize that they need to spend more time near plants, whether indoors or out in nature.",
        "text": "It is important for people to realize that they need to spend more time near plants, whether indoors or out in nature."
      },
      {
        "id": "C",
        "html": "For their personal health and well-being, people need to spend more time outdoors or bring the outdoors in.",
        "text": "For their personal health and well-being, people need to spend more time outdoors or bring the outdoors in."
      },
      {
        "id": "D",
        "html": "Individuals with little connection to nature can experience illness, depression, and higher levels of stress.",
        "text": "Individuals with little connection to nature can experience illness, depression, and higher levels of stress."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "indoor-plants-2",
    "points": 1,
    "prompt": "Which transition word or phrase should be added to the beginning of sentence 5 to emphasize the relationship between sentences 4 and 5?",
    "topic": "Transitions & Organization",
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
    "instructions": "Move the correct answer to the box.",
    "transitionBlankAfter": "spending prolonged periods of time indoors, away from plants, deprives people of these benefits.",
    "transitionBlankBefore": "",
    "transitionSentenceNumber": "(5)",
    "type": "transition_drop"
  },
  {
    "id": "indoor-plants-3",
    "points": 1,
    "prompt": "Which sentence could best follow sentence 13 to support the ideas in the third paragraph (sentences 11–14)?",
    "promptHtml": "Which sentence could <strong>best</strong> follow sentence 13 to support the ideas in the third paragraph (sentences 11–14)?",
    "topic": "Supporting Evidence",
    "choices": [
      {
        "id": "A",
        "html": "A global study of 7,600 workers from sixteen countries revealed that employees who worked in spaces with natural elements, such as indoor plants, were more creative and productive than employees who worked in spaces without natural elements.",
        "text": "A global study of 7,600 workers from sixteen countries revealed that employees who worked in spaces with natural elements, such as indoor plants, were more creative and productive than employees who worked in spaces without natural elements."
      },
      {
        "id": "B",
        "html": "Specifically, a study suggests that one well-known hotel is popular among guests because its owners have made a significant investment in landscaping and indoor plants known to have a relaxing effect.",
        "text": "Specifically, a study suggests that one well-known hotel is popular among guests because its owners have made a significant investment in landscaping and indoor plants known to have a relaxing effect."
      },
      {
        "id": "C",
        "html": "In fact, one recent study suggested that people who are routinely exposed to natural elements seem to increase their compassion for others, perhaps because that exposure generates compassion for the environment in which they live.",
        "text": "In fact, one recent study suggested that people who are routinely exposed to natural elements seem to increase their compassion for others, perhaps because that exposure generates compassion for the environment in which they live."
      },
      {
        "id": "D",
        "html": "According to a study that was conducted in 2003, plants can reduce the amount of noise that people perceive in indoor spaces with hard surfaces, just as adding carpet can make a room seem quieter.",
        "text": "According to a study that was conducted in 2003, plants can reduce the amount of noise that people perceive in indoor spaces with hard surfaces, just as adding carpet can make a room seem quieter."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "indoor-plants-4",
    "points": 1,
    "prompt": "Which sentence presents ideas irrelevant to the topic of the passage and should be deleted?",
    "promptHtml": "Which sentence presents ideas irrelevant to the topic of the passage and should be deleted?",
    "topic": "Revising & Editing",
    "choices": [
      {
        "id": "A",
        "html": "sentence 11",
        "text": "sentence 11"
      },
      {
        "id": "B",
        "html": "sentence 14",
        "text": "sentence 14"
      },
      {
        "id": "C",
        "html": "sentence 15",
        "text": "sentence 15"
      },
      {
        "id": "D",
        "html": "sentence 16",
        "text": "sentence 16"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "indoor-plants-5",
    "points": 1,
    "prompt": "Which concluding sentence should follow sentence 17 to best support the information presented in the passage?",
    "promptHtml": "Which concluding sentence should follow sentence 17 to <strong>best</strong> support the information presented in the passage?",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "Because indoor plants absorb the carbon dioxide in our air and release the oxygen we need to breathe, they are vital to our wholeness and wellness.",
        "text": "Because indoor plants absorb the carbon dioxide in our air and release the oxygen we need to breathe, they are vital to our wholeness and wellness."
      },
      {
        "id": "B",
        "html": "Experts say that adding a Boston fern, a spider plant, or an aloe vera plant is a good place to start if you want to begin to incorporate nature into your home or office.",
        "text": "Experts say that adding a Boston fern, a spider plant, or an aloe vera plant is a good place to start if you want to begin to incorporate nature into your home or office."
      },
      {
        "id": "C",
        "html": "More people should consider bringing natural elements inside to improve general wellness and reverse some of the negative effects of an indoor-centered society.",
        "text": "More people should consider bringing natural elements inside to improve general wellness and reverse some of the negative effects of an indoor-centered society."
      },
      {
        "id": "D",
        "html": "As one study has confirmed, houseplants are a wise investment because they can remove almost 90 percent of the toxins in the air within the span of 24 hours.",
        "text": "As one study has confirmed, houseplants are a wise investment because they can remove almost 90 percent of the toxins in the air within the span of 24 hours."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const indoorPlantsPassageSet: ExamPassageSet = {
  id: "ela-passage-set-3",
  questionCount: indoorPlantsQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "body": "Read the text or texts that follow and answer the related questions. You will be asked to improve the writing quality of each text and to correct errors so that each text follows the conventions of standard written English. You should reread relevant parts of each text, while being mindful of time, before selecting the best answer for each question."
},
  passage: createSentenceNumberedPassage({
    id: "indoor-plants",
    title: "The Benefits of Indoor Plants",
    richText: "<p>(1) In an age of endless media content, it is easy to see why people might prefer to stay inside.  (2) According to a study sponsored by the Environmental Protection Agency, Americans spend an average of 87 percent of their time indoors.  (3) Scientists say that this separation between people and nature puts people at risk for physical and psychological issues.</p><p>(4) During the process of photosynthesis, plants convert carbon dioxide into oxygen and remove many harmful toxins from the air.  (5) Spending prolonged periods of time indoors, away from plants, deprives people of these benefits.  (6) Air that is not regularly detoxified can lead to a condition known as sick building syndrome.  (7) This disorder first came to light in the 1970s when many office workers in the United States began to complain of unexplained flu-like symptoms.  (8) Researchers determined the cause to be volatile organic compounds, or VOCs.  (9) VOCs are harmful chemicals that are emitted by everyday objects such as carpet, furniture, cleaning products, and computers.  (10) The NASA Clean Air Study found a simple way to remove a significant number of VOCs within a 24-hour period: add plants to indoor spaces.</p><p>(11) Adding plants to indoor spaces has psychological benefits too.  (12) Research has long linked time spent in natural environments with increased energy and feelings of contentment.  (13) While being outdoors is an excellent option for improving a person’s mental health, recent research has indicated that encountering natural elements while indoors can also help.  (14) To experience the maximum benefit of natural elements, experts suggest placing at least one live plant per 100 square, feet of home or office space.</p><p>(15) Connecting with nature, even just by being near an indoor plant, is a significant factor in a person’s well-being.  (16) Sitting in front of an electronic screen all day isn’t natural, and today’s workers need to get up and get outdoors.  (17) Richard Ryan, a psychology professor at the University of Rochester, puts it this way: “Nature is something within which we flourish, so having it be more a part of our lives is critical, especially when we live and work in built environments.”</p>",
    text: indoorPlantsPassageText,
  }),
  questions: indoorPlantsQuestions,
};
