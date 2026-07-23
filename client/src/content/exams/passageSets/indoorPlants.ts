import { createSentenceNumberedPassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const indoorPlantsPassageText = "\nIn an age of endless media content, it is easy to see why people might prefer to stay inside. Many students and adults spend long hours studying, working, and relaxing indoors. However, scientists say that this separation between people and nature can affect both mood and physical comfort.\n\nDuring photosynthesis, plants convert carbon dioxide into oxygen and remove some harmful particles from the air. Spending prolonged periods of time indoors, away from plants, deprives people of these benefits. Air that is not regularly refreshed can make a room feel stale and uncomfortable. Researchers have found that indoor plants can help improve air quality in small spaces.\n\nIndoor plants may also support emotional well-being. Caring for a plant gives people a simple routine and a visible sign of growth. Even a small plant near a desk can make a room feel calmer and more inviting. For people who spend much of the day inside, adding plants can be an easy way to bring a little of the outdoors closer.\n";

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
    sourceNote: "\"The Benefits of Indoor Plants\" by Nathan Tutors",
    text: indoorPlantsPassageText,
  }),
  questions: indoorPlantsQuestions,
};
