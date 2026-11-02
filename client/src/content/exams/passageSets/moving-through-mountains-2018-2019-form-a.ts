import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const movingThroughMountains20182019FormAPassageText = "(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming. (5) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.\n\n(6) Construction of the high-speed railway tunnel began in 1996. (7) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. (8) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (9) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid of Giza five times. (10) This massive construction project is reported to have cost $12 billion. (11) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.\n\n(12) By 2020 the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to 125 miles per hour. (13) It will be faster for people to travel between northern and southern Europe. (14) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (15) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (16) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.\n\n(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. (18) There is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.";

const movingThroughMountains20182019FormAQuestions: ExamQuestion[] = [
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q004",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "4",
      "pages": [
        4
      ]
    },
    "explanation": "4. (G) The question asks which sentence should be added to the end of the first paragraph in order to introduce the topic of the passage, which is the description, construction, and use of the Gotthard Base Tunnel. Option G correctly presents and describes the Gotthard Base Tunnel. Option E is incorrect because it offers overly detailed information about the funding used to build the Gotthard Base Tunnel, and it does not provide a description of the tunnel. Option F is incorrect because it gives details about the opening ceremony of the tunnel, and it does not provide a description of the tunnel. Option H is incorrect because it offers a result of completing the Gotthard Base Tunnel, rather than offering an introductory statement presenting and describing the tunnel.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q004-explanation-1.png\" alt=\"Supplied Form A explanation for question 4\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence should be added after sentence 5 to introduce the main topic of the passage?",
    "promptHtml": "<p>Which sentence should be added after sentence 5 to introduce the main topic of the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>The construction of the Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans.</p>",
        "text": "The construction of the Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans."
      },
      {
        "id": "B",
        "html": "<p>Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel, a Swiss tunnel.</p>",
        "text": "Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel, a Swiss tunnel."
      },
      {
        "id": "C",
        "html": "<p>The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps.</p>",
        "text": "The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps."
      },
      {
        "id": "D",
        "html": "<p>The Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways in the Swiss Alps.</p>",
        "text": "The Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways in the Swiss Alps."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "5",
      "pages": [
        4
      ]
    },
    "explanation": "5. (B) The question asks for a sentence that provides additional details about the tunnel-boring machines used to build the Gotthard Base Tunnel in order to support the description of the machines in sentence 7. Option B is correct because it offers specific details about how tunnel-boring machines, such as the ones used to create the Gotthard Base Tunnel, drill through rock. Option A is incorrect because it offers information about how tunnel-boring machines were an improvement over previous methods but does not include information about how the machines work. Option C is incorrect because it presents the idea that the tunnel could not be built until advances were made in tunnel-boring machine technology and does not describe how the machines function. Option D is incorrect because, though it explains that there are different types of cutter heads used for different geologies, the geology of the tunnel area is not discussed in sentence 7, nor in the rest of the paragraph.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q005-explanation-1.png\" alt=\"Supplied Form A explanation for question 5\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence should be added to follow and support sentence 7?",
    "promptHtml": "<p>Which sentence should be added to follow and support sentence 7?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite.</p>",
        "text": "The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite."
      },
      {
        "id": "B",
        "html": "<p>These enormous tunnel-boring machines function somewhat like a cheese grater, with the cutter head grinding slowly through rock and stone.</p>",
        "text": "These enormous tunnel-boring machines function somewhat like a cheese grater, with the cutter head grinding slowly through rock and stone."
      },
      {
        "id": "C",
        "html": "<p>Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines.</p>",
        "text": "Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines."
      },
      {
        "id": "D",
        "html": "<p>Different types of cutter heads are used with tunnel-boring machines depending on the geology of the area where the tunnel is being created.</p>",
        "text": "Different types of cutter heads are used with tunnel-boring machines depending on the geology of the area where the tunnel is being created."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "6",
      "pages": [
        4
      ]
    },
    "explanation": "6. (H) The question asks where sentence 11, which completes the detailed steps of how the tunnel was\n\nbuilt, should be moved within the second paragraph in order to improve the organization of the paragraph. Option H, placing the sentence between sentences 9 and 10, is correct because placing the sentence there helps the reader understand the full sequence of steps performed in constructing the tunnel before the cost of the project is introduced. Option E, placing the sentence at the beginning of the paragraph (before sentence 6), is incorrect because it would not make sense since the process of building the tunnel has not yet been introduced. Similarly, Option F is incorrect because placing the sentence after sentence 6 would not make sense given that adding concrete would have to happen after the rock was broken down and removed from the tunnel. Option G, placing the sentence between sentences 8 and 9, would also be incorrect because the use of concrete did not take place before the removal of “28 million tons of rock” (sentence 9).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q006-explanation-1.png\" alt=\"Supplied Form A explanation for question 6\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q006-explanation-2.png\" alt=\"Supplied Form A explanation for question 6\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Where should sentence 11 be moved in order to improve the organization of the second paragraph (sentences 6–11)?",
    "promptHtml": "<p>Where should sentence 11 be moved in order to improve the organization of the second paragraph (sentences 6–11)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>to the beginning of the paragraph (before sentence 6)</p>",
        "text": "to the beginning of the paragraph (before sentence 6)"
      },
      {
        "id": "B",
        "html": "<p>between sentences 6 and 7</p>",
        "text": "between sentences 6 and 7"
      },
      {
        "id": "C",
        "html": "<p>between sentences 8 and 9</p>",
        "text": "between sentences 8 and 9"
      },
      {
        "id": "D",
        "html": "<p>between sentences 9 and 10</p>",
        "text": "between sentences 9 and 10"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "7",
      "pages": [
        4
      ]
    },
    "explanation": "7. (D) The question asks which sentence should be removed because it presents an idea that shifts away from the main idea of the third paragraph, which is about the transportation benefits of the Gotthard Base Tunnel. Option D (sentence 16) is the correct response because, even though the sentence provides additional information about the Channel Tunnel, it does not help the reader understand the benefits of the Gotthard Base Tunnel, so it should be removed. Option A (sentence 13) is incorrect because the idea of faster travel times is important to the development of the main idea of the paragraph. Option B (sentence 14) is incorrect because the sentence provides a specific example of decreased travel time between two cities when traveling through the Gotthard Base Tunnel, supporting the development of ideas in the paragraph. Option C (sentence 15) is incorrect because the sentence compares the Gotthard Base Tunnel to another tunnel that provides an important connection between places, and the sentence supports the idea that transportation innovations are beneficial.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q007-explanation-1.png\" alt=\"Supplied Form A explanation for question 7\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the main topic of the third paragraph (sentences 12–16) and should be removed?",
    "promptHtml": "<p>Which sentence presents information that shifts away from the main topic of the third paragraph (sentences 12–16) and should be removed?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 13</p>",
        "text": "sentence 13"
      },
      {
        "id": "B",
        "html": "<p>sentence 14</p>",
        "text": "sentence 14"
      },
      {
        "id": "C",
        "html": "<p>sentence 15</p>",
        "text": "sentence 15"
      },
      {
        "id": "D",
        "html": "<p>sentence 16</p><p>FORM A 5 CONTINUE ON TO THE NEXT PAGE c</p>",
        "text": "sentence 16\n\nFORM A 5 CONTINUE ON TO THE NEXT PAGE c"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "8",
      "pages": [
        5
      ]
    },
    "explanation": "8. (G) The question asks for a transition that bridges the ideas between sentences 17 and 18 and accurately presents the relationship. Option G is correct because it bridges the sentences by referring to the Gotthard Base Tunnel as a solution to the problems described in sentence 17 and logically introducing sentence 18. Option E is incorrect because the use of the word “although” and the mention of freight trains suggest that sentence 18 will be about other types of vehicles that use the Gotthard Base Tunnel, and the transition phrase does not logically precede the sentence. Option F is incorrect because the reference to the amount of time it took\n\nto build the tunnel does not help lead into the idea presented in sentence 18. Option H is incorrect because it suggests that sentence 18 is related to the increasing number of trains using the Gotthard Base Tunnel, which is not accurate.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q008-explanation-1.png\" alt=\"Supplied Form A explanation for question 8\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q008-explanation-2.png\" alt=\"Supplied Form A explanation for question 8\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which transition phrase should be added to the beginning of sentence 18?",
    "promptHtml": "<p>Which transition phrase should be added to the beginning of sentence 18?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Although the Gotthard Base Tunnel is mainly for freight trains</p>",
        "text": "Although the Gotthard Base Tunnel is mainly for freight trains"
      },
      {
        "id": "B",
        "html": "<p>With the Gotthard Base Tunnel taking ten years to complete</p>",
        "text": "With the Gotthard Base Tunnel taking ten years to complete"
      },
      {
        "id": "C",
        "html": "<p>Because of the successful completion of the Gotthard Base Tunnel</p>",
        "text": "Because of the successful completion of the Gotthard Base Tunnel"
      },
      {
        "id": "D",
        "html": "<p>As the number of trains using the Gotthard Base Tunnel increases</p>",
        "text": "As the number of trains using the Gotthard Base Tunnel increases"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2018-2019-form-a-pdf-shsat-2018-2019-a-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "9",
      "pages": [
        5
      ]
    },
    "explanation": "9. (B) The question asks for a concluding sentence that supports key ideas about the topic developed earlier in the passage. Option B is correct because it supports the points made in the introductory paragraph by affirming the idea that the Gotthard Base Tunnel is an example of a way people have improved life by overcoming obstacles. Option A is incorrect because the economies of surrounding areas were never mentioned in the passage. Option C is incorrect because, although the construction of the Gotthard Base Tunnel appears to have required many people to work together, the passage does not explicitly mention people or groups working together. Option D is incorrect because it focuses on the cost of the Gotthard Base Tunnel, which is referred to only in sentence 10 of the passage.\n\nREADING COMPREHENSION\n\nAn Early Warning",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q009-explanation-1.png\" alt=\"Supplied Form A explanation for question 9\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 18 to support the topic presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 18 to support the topic presented in the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>There is proof that underground tunnels such as the Gotthard Base Tunnel are beneficial to the economy of the surrounding area.</p>",
        "text": "There is proof that underground tunnels such as the Gotthard Base Tunnel are beneficial to the economy of the surrounding area."
      },
      {
        "id": "B",
        "html": "<p>The Gotthard Base Tunnel is an extraordinary example of how human ingenuity and persistence can overcome great obstacles.</p>",
        "text": "The Gotthard Base Tunnel is an extraordinary example of how human ingenuity and persistence can overcome great obstacles."
      },
      {
        "id": "C",
        "html": "<p>The completion of the Gotthard Base Tunnel shows that people can work together to achieve important goals.</p>",
        "text": "The completion of the Gotthard Base Tunnel shows that people can work together to achieve important goals."
      },
      {
        "id": "D",
        "html": "<p>The Swiss government is confident that the economic impact of the Gotthard Base Tunnel will be worth its construction cost.</p>",
        "text": "The Swiss government is confident that the economic impact of the Gotthard Base Tunnel will be worth its construction cost."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const movingThroughMountains20182019FormAPassageSet: ExamPassageSet = {
  id: "ela-moving-through-mountains-2018-2019-form-a",
  versionLabels: ["2018-2019 Form A"],
  label: "2018-2019 Form A",
  section: "revising_editing_a",
  questionCount: movingThroughMountains20182019FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "moving-through-mountains-2018-2019-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "Moving through Mountains",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form A","year":"2018-2019","form":"A","packageId":"62c32b0be11d7e87c41a85210539247ebd09577385a479a3bff2c1df4b4c718e"},
    title: "Moving through Mountains",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming. (5) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.</p><p>(6) Construction of the high-speed railway tunnel began in 1996. (7) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. (8) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (9) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid of Giza five times. (10) This massive construction project is reported to have cost $12 billion. (11) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.</p><p>(12) By 2020 the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to 125 miles per hour. (13) It will be faster for people to travel between northern and southern Europe. (14) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (15) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (16) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.</p><p>(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. (18) There is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.</p>",
    text: movingThroughMountains20182019FormAPassageText,
    versionLabel: "2018-2019 Form A",
  }),
  questions: movingThroughMountains20182019FormAQuestions,
};
