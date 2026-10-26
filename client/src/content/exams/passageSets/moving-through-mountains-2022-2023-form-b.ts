import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const movingThroughMountains20222023FormBPassageText = "(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming. (5) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.\n\n(6) Construction of the high-speed railway tunnel began in 1996. (7) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. (8) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (9) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid of Giza five times. (10) This massive construction project is reported to have cost $12 billion. (11) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.\n\n(12) In a few years, the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to 125 miles per hour. (13) It will be faster for people to travel between northern and southern Europe. (14) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (15) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (16) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.\n\n(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. (18) There is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.";

const movingThroughMountains20222023FormBQuestions: ExamQuestion[] = [
  {
    "id": "moving-through-mountains-2022-2023-form-b-1",
    "explanation": "The question asks which sentence should be added to the end of the first paragraph in order to introduce the topic of the passage, which is the description, construction, and use of the Gotthard Base Tunnel.\n\nA. Incorrect. The option is incorrect because it offers information about the funding used to build the Gotthard Base Tunnel but does not provide a description of the tunnel.\n\nB. Incorrect. The option is incorrect because it gives details about the opening ceremony of the tunnel but does not provide a description of the tunnel.\n\nC. CORRECT. The option correctly presents and describes the Gotthard Base Tunnel.\n\nD. Incorrect. The option is incorrect because it offers a result of completing the Gotthard Base Tunnel rather than offering an introductory statement presenting and describing the tunnel.",
    "points": 1,
    "prompt": "Which sentence should be added after sentence 5 to introduce the main topic of the passage?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "The construction of the Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans."
      },
      {
        "id": "B",
        "text": "Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel, a Swiss tunnel."
      },
      {
        "id": "C",
        "text": "The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps."
      },
      {
        "id": "D",
        "text": "The Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways in the Swiss Alps."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2022-2023-form-b-2",
    "explanation": "|The question asks for a sentence that provides additional details about the tunnel-boring machines used to build the Gotthard Base Tunnel in order to support the description of the machines in sentence 7.\n\nA. Incorrect. The option is incorrect because it offers information about how tunnel-boring machines were an improvement over previous methods but does not include information about how the machines work.\n\nB. CORRECT. The option is correct because it offers specific details about how tunnel-boring machines, such as the ones used to create the Gotthard Base Tunnel, drill through rock.\n\nC. Incorrect. The option is incorrect because it presents the idea that the tunnel could not be built until advances were made in tunnel-boring machine technology and does not describe how the machines function.\n\nD. Incorrect. The option is incorrect because, though it explains that there are different types of cutter heads used for different geologies, the geology of the tunnel area is not discussed in sentence 7 or in the rest of the paragraph.",
    "points": 1,
    "prompt": "Which sentence should be added to follow and support sentence 7?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite."
      },
      {
        "id": "B",
        "text": "These enormous tunnel-boring machines function somewhat like a cheese grater, with the cutter head grinding slowly through rock and stone."
      },
      {
        "id": "C",
        "text": "Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines."
      },
      {
        "id": "D",
        "text": "Different types of cutter heads are used with tunnel-boring machines depending on the geology of the area where the tunnel is being created."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2022-2023-form-b-3",
    "explanation": "| The question asks where sentence 11, which completes the detailed steps of how the tunnel was built, should be moved within the second paragraph in order to improve the organization of the paragraph.\n\nA. Incorrect. The option, placing the sentence at the beginning of the paragraph (before sentence 6), is incorrect because it would not make sense since the process of building the tunnel has not yet been introduced.\n\nB. Incorrect. The option is incorrect because placing the sentence after sentence 6 would not make sense given that adding concrete would have to happen after the rock was broken down and removed from the tunnel.\n\nC. Incorrect. The option, placing the sentence between sentences 8 and 9, would be incorrect because the use of concrete did not take place before the removal of “28 million tons of rock” (sentence 9).\n\nD. CORRECT. The option, placing the sentence between sentences 9 and 10, is correct because placing the sentence there helps the reader understand the full sequence of steps performed in constructing the tunnel before the cost of the project is introduced.",
    "points": 1,
    "prompt": "Where should sentence 11 be moved in order to improve the organization of the second paragraph (sentences 6-11)?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "to the beginning of the paragraph (before sentence 6)"
      },
      {
        "id": "B",
        "text": "between sentences 6 and 7"
      },
      {
        "id": "C",
        "text": "between sentences 8 and 9"
      },
      {
        "id": "D",
        "text": "between sentences 9 and 10"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2022-2023-form-b-4",
    "explanation": "|The question asks which sentence should be removed because it presents an idea that shifts away from the main idea of the third paragraph, which is about the transportation benefits of the Gotthard Base Tunnel.\n\nA. Incorrect. The option (sentence 13) is incorrect because the idea of faster travel times is important to the development of the main idea of the paragraph.\n\nB. Incorrect. The option (sentence 14) is incorrect because the sentence provides a specific example of decreased travel time between two cities when traveling through the Gotthard Base Tunnel, supporting the development of ideas in the paragraph.\n\nC. Incorrect. The option (sentence 15) is incorrect because the sentence compares the Gotthard Base Tunnel to another tunnel that provides an important connection between places; thus, the sentence supports the idea that transportation innovations are beneficial.\n\nD. CORRECT. The option (sentence 16) is the correct response because, even though the sentence provides additional information about the Channel Tunnel, it does not help the reader understand the benefits of the Gotthard Base Tunnel.",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the main topic of the third paragraph (sentences 12-16) and should be removed?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "sentence 13"
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
    "id": "moving-through-mountains-2022-2023-form-b-5",
    "explanation": "The question asks for a transition that bridges the ideas between sentences 17 and 18 and accurately presents the relationship.\n\nA. Incorrect. The option is incorrect because the use of the word “although” and the mention of freight trains suggest that sentence 18 will be about other types of vehicles that use the Gotthard Base Tunnel, and the transition phrase does not logically precede the sentence.\n\nB. Incorrect. The option is incorrect because the reference to the amount of time it took to build the tunnel does not help lead into the idea presented in sentence 18.\n\nC. CORRECT. The option is correct because it bridges the sentences by referring to the Gotthard Base Tunnel as a solution to the problems described in sentence 17 and logically introduces sentence 18.\n\nD. Incorrect. The option is incorrect because it suggests that sentence 18 is related to the increasing number of trains using the Gotthard Base Tunnel, which is not accurate.",
    "points": 1,
    "prompt": "Which transition phrase should be added to the beginning of sentence 18?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Although the Gotthard Base Tunnel is mainly for freight trains,"
      },
      {
        "id": "B",
        "text": "With the Gotthard Base Tunnel taking ten years to complete,"
      },
      {
        "id": "C",
        "text": "Because of the successful completion of the Gotthard Base Tunnel,"
      },
      {
        "id": "D",
        "text": "As the number of trains using the Gotthard Base Tunnel increases,"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2022-2023-form-b-6",
    "explanation": "The question asks for a concluding sentence that supports key ideas about the topic developed earlier in the passage.\n\nA. Incorrect. The option is incorrect because the economies of surrounding areas are never mentioned in the passage.\n\nB. CORRECT. The option is correct because it supports the points made in the introductory paragraph by affirming the idea that the Gotthard Base Tunnel is an example of a way people have improved life by overcoming obstacles.\n\nC. Incorrect. The option is incorrect because, although the construction of the Gotthard Base Tunnel appears to have required many people to work together, the passage does not explicitly mention people or groups working together.\n\nD. Incorrect. The option is incorrect because it focuses on the cost of the Gotthard Base Tunnel, which is referred to only in sentence 10 of the passage. Excerpt from \"The World Has an E-Waste Problem\"",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 18 to support the topic presented in the passage?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "There is proof that underground tunnels such as the Gotthard Base Tunnel are beneficial to the economy of the surrounding area."
      },
      {
        "id": "B",
        "text": "The Gotthard Base Tunnel is an extraordinary example of how human ingenuity and persistence can overcome great obstacles."
      },
      {
        "id": "C",
        "text": "The completion of the Gotthard Base Tunnel shows that people can work together to achieve important goals."
      },
      {
        "id": "D",
        "text": "The Swiss government is confident that the economic impact of the Gotthard Base Tunnel will be worth its construction cost."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const movingThroughMountains20222023FormBPassageSet: ExamPassageSet = {
  id: "ela-moving-through-mountains-2022-2023-form-b",
  label: "2023 Form B",
  section: "revising_editing_a",
  questionCount: movingThroughMountains20222023FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "moving-through-mountains-2022-2023-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    title: "Moving through Mountains",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming. (5) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.</p><p data-numbered=\"false\">(6) Construction of the high-speed railway tunnel began in 1996. (7) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. (8) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (9) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid of Giza five times. (10) This massive construction project is reported to have cost $12 billion. (11) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.</p><p data-numbered=\"false\">(12) In a few years, the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to 125 miles per hour. (13) It will be faster for people to travel between northern and southern Europe. (14) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (15) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (16) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.</p><p data-numbered=\"false\">(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. (18) There is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.</p>",
    text: movingThroughMountains20222023FormBPassageText,
    versionLabel: "2022-2023 Form B",
  }),
  questions: movingThroughMountains20222023FormBQuestions,
};
