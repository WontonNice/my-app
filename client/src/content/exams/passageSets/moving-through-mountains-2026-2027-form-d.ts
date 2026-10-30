import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const movingThroughMountains20262027FormDPassageText = "(1) An age-old proverb says that necessity is the mother of invention. (2) Centuries of human ingenuity in the face of obstacles prove this to be true. (3) For many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. (4) Roads and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time-consuming. (5) In 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.\n(6) Construction of the high-speed railway tunnel began in 1996. (7) The tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. (8) Each of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. (9) During the seventeen-year construction period, 28 million tons of rock were removed, enough to rebuild the Great Pyramid of Giza five times. (10) This massive construction project is reported to have cost $12 billion. (11) After that, 4 million cubic meters of concrete, or enough concrete to build eighty-four Empire State Buildings, were used to construct and support the tunnel.\n(12) In a few years, the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to 125 miles per hour. (13) It will be faster for people to travel between northern and southern Europe. (14) The travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. (15) Many European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a 33-mile underwater tunnel that connects the United Kingdom and France. (16) While there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.\n(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. (18) There is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.";

const movingThroughMountains20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-41",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "41"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-d6d4bf4f3a48765e7502.png\" alt=\"Official explanation for question 41\">",
    "points": 1,
    "prompt": "Which sentence should be added after sentence 5 to introduce the main topic of the passage?",
    "promptHtml": "<p><span>Which sentence should be added after <span>sentence 5</span> to introduce the main topic of the passage?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>The construction of the Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans.</span></p>",
        "text": "The construction of the Gotthard Base Tunnel was approved by Swiss voters in 1992 and was funded by tolls, fuel taxes, and government loans."
      },
      {
        "id": "B",
        "html": "<p><span>Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel, a Swiss tunnel.</span></p>",
        "text": "Leaders from several European countries attended the opening ceremonies for the Gotthard Base Tunnel, a Swiss tunnel."
      },
      {
        "id": "C",
        "html": "<p><span>The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching <span>35.5 miles</span> straight through the base of the Swiss Alps.</span></p>",
        "text": "The Gotthard Base Tunnel is the world’s longest and deepest railway tunnel, stretching 35.5 miles straight through the base of the Swiss Alps."
      },
      {
        "id": "D",
        "html": "<p><span>The Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways in the Swiss Alps.</span></p>",
        "text": "The Gotthard Base Tunnel continues to help reduce the number of freight trucks on the roadways in the Swiss Alps."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-42",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "42"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-8fb376f248eb2626c27f.png\" alt=\"Official explanation for question 42\">",
    "points": 1,
    "prompt": "Which sentence should be added to follow and support sentence 7?",
    "promptHtml": "<p><span>Which sentence should be added to follow and support <span>sentence 7?</span></span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite.</span></p>",
        "text": "The tunnel-boring machine is helpful to tunnel builders in the modern era and has been an improvement over dynamite."
      },
      {
        "id": "B",
        "html": "<p><span>These enormous tunnel-boring machines function somewhat like a cheese grater, with the cutter head grinding slowly through rock and stone.</span></p>",
        "text": "These enormous tunnel-boring machines function somewhat like a cheese grater, with the cutter head grinding slowly through rock and stone."
      },
      {
        "id": "C",
        "html": "<p><span>Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines.</span></p>",
        "text": "Engineers had considered making a tunnel under the mountains for many years, but it was impossible to do without modern tunnel-boring machines."
      },
      {
        "id": "D",
        "html": "<p><span>Different types of cutter heads are used with tunnel-boring machines depending on the geology of the area where the tunnel is being created.</span></p>",
        "text": "Different types of cutter heads are used with tunnel-boring machines depending on the geology of the area where the tunnel is being created."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-43",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "43"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-c028f4f8fc73e0fed41b.png\" alt=\"Official explanation for question 43\">",
    "points": 1,
    "prompt": "Where should sentence 11 be moved in order to improve the organization of the second paragraph (sentences 6–11)?",
    "promptHtml": "<p><span>Where should sentence 11 be moved in order to improve the organization of the second paragraph </span><span><span>(sentences </span><span>6–11)</span><span>?</span></span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>to the beginning of the paragraph (before <span>sentence 6)</span></span></p>",
        "text": "to the beginning of the paragraph (before sentence 6)"
      },
      {
        "id": "B",
        "html": "<p><span>between sentences 6 and 7</span></p>",
        "text": "between sentences 6 and 7"
      },
      {
        "id": "C",
        "html": "<p><span>between sentences 8 and 9</span></p>",
        "text": "between sentences 8 and 9"
      },
      {
        "id": "D",
        "html": "<p><span>between sentences 9 and 10</span></p>",
        "text": "between sentences 9 and 10"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-44",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "44"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3a987710e7bc07517b59.png\" alt=\"Official explanation for question 44\">",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the main topic of the third paragraph (sentences 12–16) and should be removed?",
    "promptHtml": "<p><span>Which sentence </span><span>presents</span><span> information that shifts away from the main topic of the third paragraph </span><span><span>(sentences </span><span>12–16)</span></span><span> and should be </span><span>removed?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>sentence 13</span></p>",
        "text": "sentence 13"
      },
      {
        "id": "B",
        "html": "<p><span>sentence 14</span></p>",
        "text": "sentence 14"
      },
      {
        "id": "C",
        "html": "<p><span>sentence 15</span></p>",
        "text": "sentence 15"
      },
      {
        "id": "D",
        "html": "<p><span>sentence 16</span></p>",
        "text": "sentence 16"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-45",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "45"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-7052a5dee7d1f53d4a09.png\" alt=\"Official explanation for question 45\">",
    "points": 1,
    "prompt": "Which transition phrase should be added to the beginning of sentence 18?",
    "promptHtml": "<p><span>Which transition phrase should be added to the beginning of <span>sentence 18?</span></span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Although the Gotthard Base Tunnel is mainly for freight trains,</span></p>",
        "text": "Although the Gotthard Base Tunnel is mainly for freight trains,"
      },
      {
        "id": "B",
        "html": "<p><span>With the Gotthard Base Tunnel taking ten years to complete,</span></p>",
        "text": "With the Gotthard Base Tunnel taking ten years to complete,"
      },
      {
        "id": "C",
        "html": "<p><span>Because of the successful completion of the Gotthard Base Tunnel,</span></p>",
        "text": "Because of the successful completion of the Gotthard Base Tunnel,"
      },
      {
        "id": "D",
        "html": "<p><span>As the number of trains using the Gotthard Base Tunnel increases,</span></p>",
        "text": "As the number of trains using the Gotthard Base Tunnel increases,"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "moving-through-mountains-2026-2027-form-d-official-shsat-2026-d-46",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 7 of 7",
      "sourceQuestion": "46"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-1832c02ad6e65cf0fa49.png\" alt=\"Official explanation for question 46\">",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 18 to support the topic presented in the passage?",
    "promptHtml": "<p><span>Which concluding sentence should be added after <span>sentence 18</span> to support the topic presented in the passage?</span></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>There is proof that underground tunnels such as the Gotthard Base Tunnel are beneficial to the economy of the surrounding area.</span></p>",
        "text": "There is proof that underground tunnels such as the Gotthard Base Tunnel are beneficial to the economy of the surrounding area."
      },
      {
        "id": "B",
        "html": "<p><span>The Gotthard Base Tunnel is an extraordinary example of how human ingenuity and persistence can overcome great obstacles.</span></p>",
        "text": "The Gotthard Base Tunnel is an extraordinary example of how human ingenuity and persistence can overcome great obstacles."
      },
      {
        "id": "C",
        "html": "<p><span>The completion of the Gotthard Base Tunnel shows that people can work together to achieve important goals.</span></p>",
        "text": "The completion of the Gotthard Base Tunnel shows that people can work together to achieve important goals."
      },
      {
        "id": "D",
        "html": "<p><span>The Swiss government is confident that the economic impact of the Gotthard Base Tunnel will be worth its construction cost.</span></p>",
        "text": "The Swiss government is confident that the economic impact of the Gotthard Base Tunnel will be worth its construction cost."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const movingThroughMountains20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-moving-through-mountains-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D","2024-2025 Form B"],
  section: "revising_editing_a",
  questionCount: movingThroughMountains20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "moving-through-mountains-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "<span>Moving through Mountains</span>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 7 of 7","packageId":"35564bc7342d8dea9824d32548334eecfa4ea1a18e54a037e8179f841864bbd0"},
    title: "Moving through Mountains",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><span>(1) An age-old proverb says that necessity is the mother of invention. &nbsp;<span>(2) Centuries</span> of human ingenuity in the face of obstacles prove this to be true. &nbsp;<span>(3) For</span> many years the Swiss Alps, a mountain range spanning southern Switzerland and northern Italy, were such an obstacle. &nbsp;<span>(4) Roads</span> and railways had to navigate around the mountains or through winding tunnels inside the mountains, making the transportation of people and goods difficult and time-consuming. &nbsp;<span>(5) In</span> 2016 these burdens were eased with the completion of the Gotthard Base Tunnel.</span></p> <p><span>(6) Construction of the high-speed railway tunnel began in 1996. &nbsp;<span>(7) The</span> tunnel was created through the use of tunnel-boring machines, which are giant drills with a flat rotating head called a cutter head. &nbsp;<span>(8) Each</span> of the tunnel-boring machines used during the construction of the tunnel was about the length of four football fields arranged end-to-end. &nbsp;<span>(9) During</span> the seventeen-year construction period, <span>28 million</span> tons of rock were removed, enough to rebuild the Great Pyramid of </span><span>Giza</span><span> five times. &nbsp;<span>(10) This</span> massive construction project is reported to have cost <span>$12 billion.</span> &nbsp;<span>(11) After</span> that, <span>4 million</span> cubic meters</span><span> of concrete,</span> <span>or enough concrete to build</span> <span><span>eighty-four</span> Empire State Buildings, were used to construct and support the tunnel.</span></p> <p><span>(12) In a few years, the high-speed railway will carry more than 250 freight trains and 55 passenger trains a day, with most traveling at speeds of around 100 to <span>125 miles</span> per hour. &nbsp;<span>(13) It</span> will be faster for people to travel between northern and southern Europe. &nbsp;<span>(14) The</span> travel time between the European cities of Zurich, Switzerland, and Milan, Italy, will be reduced by an hour. &nbsp;<span>(15) Many</span> European leaders compare the Gotthard Base Tunnel to the Channel Tunnel, a </span><span><span>33-<span></span>mile</span></span><span> underwater tunnel that connects the United Kingdom and France. &nbsp;<span>(16) While</span> there is no roadway in the Channel Tunnel, people can drive their cars onto special trains that will carry vehicles through to the other side.</span></p> <p><span>(17) Just as traffic congestion in major cities led to the construction of underground local transportation, natural formations, such as mountain ranges, have also sent people underground for faster, easier, and cheaper methods of transportation across larger areas. &nbsp;<span>(18) There</span> is renewed interest in constructing innovative methods of transportation that will help eliminate problems associated with traveling to and from certain areas.</span></p>",
    text: movingThroughMountains20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: movingThroughMountains20262027FormDQuestions,
};
