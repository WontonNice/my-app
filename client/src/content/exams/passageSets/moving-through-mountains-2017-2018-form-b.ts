import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const movingThroughMountains20172018FormBPassageText = "(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains. (5) Transportation of people and goods was difficult and time consuming. (6) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.\n\n(7) Construction of the high-speed railway tunnel began in 1996. (8) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a rotating head. (9) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (10) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid at Giza five times. (11) This massive construction project is reported to have cost $12 billion. (12) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.\n\n(13) By 2020 the high-speed railway will carry more than 250 freight trains and fifty-five passenger trains a day, with most traveling at speeds of around 100 to 125 miles an hour. (14) It will be faster for people to travel between northern and southern Europe. (15) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (16) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (17) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.\n\n(18) The Gotthard Base Tunnel project was successful, so now there is renewed interest in solving other problems associated with traveling to and from certain places. (19) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas.";

const movingThroughMountains20172018FormBQuestions: ExamQuestion[] = [
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q014",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "14",
      "pages": [
        7
      ]
    },
    "explanation": "14. (E) Sentence 4 is the reason for the situation described in sentence 5. In Option F, the phrase “even though” changes the relationship between ideas so that the sentence illogically implies that needing to navigate around and through the mountains should have made transportation easy. Option G is incorrect because it states that traveling around the mountains or through winding tunnels emphasized that transporting people and goods was difficult rather than clarifying that this difficulty was an effect of having to travel around the mountains or through winding tunnels. Option H reverses the relationship between the ideas. Only Option E makes it clear that the transportation of people and goods was difficult because roads and railways had to navigate around and through the mountains.",
    "explanationHtml": "<p>14. (E) Sentence 4 is the reason for the situation described in sentence 5. In Option F, the phrase “even though” changes the relationship between ideas so that the sentence illogically implies that needing to navigate around and through the mountains should have made transportation easy. Option G is incorrect because it states that traveling around the mountains or through winding tunnels emphasized that transporting people and goods was difficult rather than clarifying that this difficulty was an effect of having to travel around the mountains or through winding tunnels. Option H reverses the relationship between the ideas. Only Option E makes it clear that the transportation of people and goods was difficult because roads and railways had to navigate around and through the mountains.</p>",
    "points": 1,
    "prompt": "What is the best way to combine sentences 4 and 5 to clarify the relationship between ideas?",
    "promptHtml": "<p>What is the best way to combine sentences 4 and 5 to clarify the relationship between ideas?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming.</p>",
        "text": "Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time consuming."
      },
      {
        "id": "B",
        "html": "<p>Even though roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, the transportation of people and goods was difficult and time consuming.</p>",
        "text": "Even though roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, the transportation of people and goods was difficult and time consuming."
      },
      {
        "id": "C",
        "html": "<p>Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, emphasizing that the transportation of people and goods was difficult and time consuming.</p>",
        "text": "Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, emphasizing that the transportation of people and goods was difficult and time consuming."
      },
      {
        "id": "D",
        "html": "<p>Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, since the transportation of people and goods was difficult and time consuming.</p>",
        "text": "Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, since the transportation of people and goods was difficult and time consuming."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q015",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "15",
      "pages": [
        8
      ]
    },
    "explanation": "15. (C) The correct answer should state the main topic of the passage. Option A offers overly detailed information about the funding to build the Gotthard Base Tunnel, but it does not explain what or where it is. Option B gives details about the opening of the tunnel but does not provide a description of the tunnel. Option D offers a result of the Gotthard Base Tunnel, rather than a description of what and where it is. Only Option C specifically states and clarifies the Gotthard Base Tunnel as the main topic.",
    "explanationHtml": "<p>15. (C) The correct answer should state the main topic of the passage. Option A offers overly detailed information about the funding to build the Gotthard Base Tunnel, but it does not explain what or where it is. Option B gives details about the opening of the tunnel but does not provide a description of the tunnel. Option D offers a result of the Gotthard Base Tunnel, rather than a description of what and where it is. Only Option C specifically states and clarifies the Gotthard Base Tunnel as the main topic.</p>",
    "points": 1,
    "prompt": "Which sentence should follow sentence 6 to most clearly introduce the topic of the passage?",
    "promptHtml": "<p>Which sentence should follow sentence 6 to most clearly introduce the topic of the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>The Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans.</p>",
        "text": "The Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans."
      },
      {
        "id": "B",
        "html": "<p>Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel.</p>",
        "text": "Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel."
      },
      {
        "id": "C",
        "html": "<p>The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps.</p>",
        "text": "The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps."
      },
      {
        "id": "D",
        "html": "<p>The construction of the Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways.</p>",
        "text": "The construction of the Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q016",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "16",
      "pages": [
        8
      ]
    },
    "explanation": "16. (F) The correct answer needs to provide details about the tunnel-boring machines used to build the Gotthard Base Tunnel to supplement the general description of the machines in sentence 8. Option E offers information about how tunnel-boring machines were an improvement, which does not explain how the machines work. Option G is incorrect because it describes how the tunnel could not be completed until advances were made in tunnel-boring machine technology and does not describe the machines used for this tunnel. Option H explains that there are different types of machines for different geologies, but the geology of the tunnel area is not discussed in sentence 8 or the rest of the paragraph and the sentence does not explain how the machines work. Only Option F gives specific details about the tunnel-boring machines used to create the Gotthard Base Tunnel.",
    "explanationHtml": "<p>16. (F) The correct answer needs to provide details about the tunnel-boring machines used to build the Gotthard Base Tunnel to supplement the general description of the machines in sentence 8. Option E offers information about how tunnel-boring machines were an improvement, which does not explain how the machines work. Option G is incorrect because it describes how the tunnel could not be completed until advances were made in tunnel-boring machine technology and does not describe the machines used for this tunnel. Option H explains that there are different types of machines for different geologies, but the geology of the tunnel area is not discussed in sentence 8 or the rest of the paragraph and the sentence does not explain how the machines work. Only Option F gives specific details about the tunnel-boring machines used to create the Gotthard Base Tunnel.</p>",
    "points": 1,
    "prompt": "Which sentence could be added to follow and support sentence 8?",
    "promptHtml": "<p>Which sentence could be added to follow and support sentence 8?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite.</p>",
        "text": "The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite."
      },
      {
        "id": "B",
        "html": "<p>These enormous tunnel-boring machines function somewhat like a cheese grater, grinding slowly through rock and stone.</p>",
        "text": "These enormous tunnel-boring machines function somewhat like a cheese grater, grinding slowly through rock and stone."
      },
      {
        "id": "C",
        "html": "<p>Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines.</p>",
        "text": "Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines."
      },
      {
        "id": "D",
        "html": "<p>Different types of tunnel-boring machines are used depending on the geology of the area where the tunnel is being created.</p>",
        "text": "Different types of tunnel-boring machines are used depending on the geology of the area where the tunnel is being created."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q017",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "17",
      "pages": [
        8
      ]
    },
    "explanation": "17. (D) The correct answer must be a location in which the sentence completes the detailed steps of how the tunnel was built. Option A, placing the sentence at the beginning of the paragraph (before sentence 7), would not make sense because the topic has not been introduced. Similarly, Option B, placing the sentence after sentence 7, would not make sense because adding concrete would have to happen after the rock was broken down and removed from the tunnel. Similarly, Option C, placing the sentence between sentences 9 and 10, would not make sense because the use of concrete did not take place before the removal of “28 million tons of rock.” Option D, placing the sentence between sentences 10 and 11, is correct because placing the sentence there helps the reader understand the full sequence of steps in constructing the tunnel before the cost of the project is introduced.",
    "explanationHtml": "<p>17. (D) The correct answer must be a location in which the sentence completes the detailed steps of how the tunnel was built. Option A, placing the sentence at the beginning of the paragraph (before sentence 7), would not make sense because the topic has not been introduced. Similarly, Option B, placing the sentence after sentence 7, would not make sense because adding concrete would have to happen after the rock was broken down and removed from the tunnel. Similarly, Option C, placing the sentence between sentences 9 and 10, would not make sense because the use of concrete did not take place before the removal of “28 million tons of rock.” Option D, placing the sentence between sentences 10 and 11, is correct because placing the sentence there helps the reader understand the full sequence of steps in constructing the tunnel before the cost of the project is introduced.</p>",
    "points": 1,
    "prompt": "Where should sentence 12 be moved to improve the organization of the second paragraph (sentences 7–12)?",
    "promptHtml": "<p>Where should sentence 12 be moved to improve the organization of the second paragraph (sentences 7–12)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>to the beginning of the paragraph (before sentence 7)</p>",
        "text": "to the beginning of the paragraph (before sentence 7)"
      },
      {
        "id": "B",
        "html": "<p>between sentences 7 and 8</p>",
        "text": "between sentences 7 and 8"
      },
      {
        "id": "C",
        "html": "<p>between sentences 9 and 10</p>",
        "text": "between sentences 9 and 10"
      },
      {
        "id": "D",
        "html": "<p>between sentences 10 and 11</p>",
        "text": "between sentences 10 and 11"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q018",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "18",
      "pages": [
        8
      ]
    },
    "explanation": "18. (G) The correct answer must be a transition that clarifies the relationship between the ideas in sentences 14 and 15. Option E, “even so,” suggests that travel between Zurich and Milan would not be affected by the tunnel. Option F may seem attractive because “additionally” is used to show that sentence 15 gives a new idea related to the earlier one in sentence 14. However, sentence 15 doesn’t add an idea related to faster travel time. Option H, “therefore,” is used to show that one idea or event is the result of another. However, the one-hour reduction in travel time from Zurich to Milan mentioned in sentence 15 is not a result of travel being faster from northern to southern Europe but a detail to show one trip that will be faster. Only Option G, “for example,” correctly shows that the reduced travel time from Zurich to Milan is an example of faster travel between northern and southern Europe.",
    "explanationHtml": "<p>18. (G) The correct answer must be a transition that clarifies the relationship between the ideas in sentences 14 and 15. Option E, “even so,” suggests that travel between Zurich and Milan would not be affected by the tunnel. Option F may seem attractive because “additionally” is used to show that sentence 15 gives a new idea related to the earlier one in sentence 14. However, sentence 15 doesn’t add an idea related to faster travel time. Option H, “therefore,” is used to show that one idea or event is the result of another. However, the one-hour reduction in travel time from Zurich to Milan mentioned in sentence 15 is not a result of travel being faster from northern to southern Europe but a detail to show one trip that will be faster. Only Option G, “for example,” correctly shows that the reduced travel time from Zurich to Milan is an example of faster travel between northern and southern Europe.</p>",
    "points": 1,
    "prompt": "Which transition word or phrase should be added to the beginning of sentence 15?",
    "promptHtml": "<p>Which transition word or phrase should be added to the beginning of sentence 15?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Even so</p>",
        "text": "Even so"
      },
      {
        "id": "B",
        "html": "<p>Additionally</p>",
        "text": "Additionally"
      },
      {
        "id": "C",
        "html": "<p>For example</p>",
        "text": "For example"
      },
      {
        "id": "D",
        "html": "<p>Therefore</p>",
        "text": "Therefore"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q019",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "19",
      "pages": [
        9
      ]
    },
    "explanation": "19. (D) The correct answer must be a sentence that is irrelevant to the topic. Sentence 3 (Option A) introduces the obstacle that the Gotthard Base Tunnel was built to overcome, so sentence 3 should not be removed. Sentence 11 (Option B) should not be removed because the sentence helps the reader understand that building the tunnel was a massive job. Sentence 13 (Option C) helps the reader understand how the tunnel will improve transportation through the Alps, so it should not be removed. However, the information about the Channel Tunnel in sentence 17 (Option D) does not help the reader understand the Gotthard Base Tunnel, so sentence 17 should be removed.",
    "explanationHtml": "<p>19. (D) The correct answer must be a sentence that is irrelevant to the topic. Sentence 3 (Option A) introduces the obstacle that the Gotthard Base Tunnel was built to overcome, so sentence 3 should not be removed. Sentence 11 (Option B) should not be removed because the sentence helps the reader understand that building the tunnel was a massive job. Sentence 13 (Option C) helps the reader understand how the tunnel will improve transportation through the Alps, so it should not be removed. However, the information about the Channel Tunnel in sentence 17 (Option D) does not help the reader understand the Gotthard Base Tunnel, so sentence 17 should be removed.</p>",
    "points": 1,
    "prompt": "Which sentence is irrelevant to the topic presented in the passage and should be removed?",
    "promptHtml": "<p>Which sentence is irrelevant to the topic presented in the passage and should be removed?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "B",
        "html": "<p>sentence 11</p>",
        "text": "sentence 11"
      },
      {
        "id": "C",
        "html": "<p>sentence 13</p>",
        "text": "sentence 13"
      },
      {
        "id": "D",
        "html": "<p>sentence 17</p>",
        "text": "sentence 17"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2017-2018-form-b-pdf-shsat-2017-2018-b-q020",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "20",
      "pages": [
        9
      ]
    },
    "explanation": "20. (F) The correct answer needs to support key points from earlier in the passage. Option E would not be an effective concluding sentence because the economies of surrounding areas were never mentioned in the passage. Option G might seem attractive because building the Gotthard Base Tunnel appears to have required many people to work together. However, the passage does not explicitly mention people or groups working together. Option H would not be an effective concluding sentence because it focuses on the cost of the Gotthard Base Tunnel, which is referred to in only sentence 11 of the passage. Only Option F, which supports key elements from the introductory paragraph, would make an effective concluding sentence.",
    "explanationHtml": "<p>20. (F) The correct answer needs to support key points from earlier in the passage. Option E would not be an effective concluding sentence because the economies of surrounding areas were never mentioned in the passage. Option G might seem attractive because building the Gotthard Base Tunnel appears to have required many people to work together. However, the passage does not explicitly mention people or groups working together. Option H would not be an effective concluding sentence because it focuses on the cost of the Gotthard Base Tunnel, which is referred to in only sentence 11 of the passage. Only Option F, which supports key elements from the introductory paragraph, would make an effective concluding sentence.</p>",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 19 to support the topic presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 19 to support the topic presented in the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>There is proof that underground tunnels like the Gotthard Base Tunnel are beneficial to the economy of the surrounding areas.</p>",
        "text": "There is proof that underground tunnels like the Gotthard Base Tunnel are beneficial to the economy of the surrounding areas."
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

export const movingThroughMountains20172018FormBPassageSet: ExamPassageSet = {
  id: "ela-moving-through-mountains-2017-2018-form-b",
  versionLabels: ["2017-2018 Form B"],
  label: "2017-2018 Form B",
  section: "revising_editing_a",
  questionCount: movingThroughMountains20172018FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "moving-through-mountains-2017-2018-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "Moving Through Mountains",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-b","label":"2017-2018 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf","year":"2017-2018","form":"B","packageId":"7a2d7d6a39d44530af4a2496c5862d1dc01b2a3c74dd33b4699a5e02d444e0a3"},
    title: "Moving Through Mountains",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains. (5) Transportation of people and goods was difficult and time consuming. (6) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.</p><p>(7) Construction of the high-speed railway tunnel began in 1996. (8) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a rotating head. (9) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (10) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid at Giza five times. (11) This massive construction project is reported to have cost $12 billion. (12) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.</p><p>(13) By 2020 the high-speed railway will carry more than 250 freight trains and fifty-five passenger trains a day, with most traveling at speeds of around 100 to 125 miles an hour. (14) It will be faster for people to travel between northern and southern Europe. (15) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (16) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (17) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.</p><p>(18) The Gotthard Base Tunnel project was successful, so now there is renewed interest in solving other problems associated with traveling to and from certain places. (19) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas.</p>",
    text: movingThroughMountains20172018FormBPassageText,
    versionLabel: "2017-2018 Form B",
  }),
  questions: movingThroughMountains20172018FormBQuestions,
};
