import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theLocalLibrary20182019FormBPassageText = "(1) According to a 2015 survey, more than two-thirds of Americans own a smartphone, which means that obtaining information or communicating with people is easier than ever before. (2) With the swipe of a finger, the tap of an icon, or a verbal command, people have instant access to articles, blogs, news, and social networking websites. (3) Even with all these immediately available sources of information, one of the best resources for many members of the community also happens to be one of the oldest. (4) The public library is a great place for people to get information.\n\n(5) The public library serves a truly critical role in promoting community. (6) With the explosion of digital media in recent years, people in different locations can now communicate almost instantaneously. (7) And yet many people complain of feeling more isolated and alone than ever before. (8) The library stands in a rare position to help community members meet this universal need for human connection and companionship.\n\n(9) Furthermore, libraries provide certain amenities, such as access to the Internet, for free to all people. (10) A student who does not have a computer at home can research and type a paper for school. (11) Similarly, an unemployed adult without access to the Internet can make use of library resources to find job opportunities. (12) The free items that are found at the library can help people get a lot done.\n\n(13) Public libraries also offer a variety of resources to community members. (14) One important resource is the local librarian, who does far more than check out books and collect fines. (15) Other library resources include free or low-cost tutoring and training programs. (16) Additionally, lectures, book groups, and town meetings promote critical thinking and community engagement. (17) A typical librarian holds a master’s degree and can help library patrons navigate through the flood of information available in print and on the Internet.\n\n(18) The hallmark of a public library is that its materials and services are accessible to all. (19) The library connects people to a network of information and resources and is an important part of a community.";

const theLocalLibrary20182019FormBQuestions: ExamQuestion[] = [
  {
    "id": "the-local-library-2018-2019-form-b-pdf-shsat-2018-2019-b-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        6
      ]
    },
    "explanation": "5. (A) The question asks for a sentence that should replace sentence 4 to introduce the main claim of the passage. Option A is correct because it best presents the main claim that the public library is a valuable resource and should be used by community members. Option B is incorrect because it states that going to the library can be a learning experience. This idea is implied in sentences 17 and 18, but it is not the main claim of the passage. Option C is incorrect because it states the idea that the library is useful for students, which would be supporting evidence rather than an introductory statement expressing the main claim. Option D is incorrect because it states that local libraries provide services to help improve communities, which is explained in sentences 15–18, but it does not present the main claim.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q005-explanation-1.png\" alt=\"Supplied Form B explanation for question 5\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence should replace sentence 4 to best introduce the main claim of the passage?",
    "promptHtml": "<p>Which sentence should replace sentence 4 to best introduce the main claim of the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>In this age of smartphones and search engines, the public library is a valuable resource that all members of a community should use.</p>",
        "text": "In this age of smartphones and search engines, the public library is a valuable resource that all members of a community should use."
      },
      {
        "id": "B",
        "html": "<p>Finding information is easier than ever, but going to the public library is still a valuable learning experience.</p>",
        "text": "Finding information is easier than ever, but going to the public library is still a valuable learning experience."
      },
      {
        "id": "C",
        "html": "<p>Though today’s computers are highly advanced, the resources available at a public library are more useful for students.</p>",
        "text": "Though today’s computers are highly advanced, the resources available at a public library are more useful for students."
      },
      {
        "id": "D",
        "html": "<p>Despite the proliferation of social networking sites, a public library is a great place for people who are interested in improving their community.</p>",
        "text": "Despite the proliferation of social networking sites, a public library is a great place for people who are interested in improving their community."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-local-library-2018-2019-form-b-pdf-shsat-2018-2019-b-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "6",
      "pages": [
        6
      ]
    },
    "explanation": "6. (H) The question asks which option would provide the best support for sentence 8. Sentence 8 expresses the idea that the library helps community members meet their need for human connection and companionship. Option H is correct because it provides support for sentence 8 and strengthens the connection between the\n\ninformation in sentence 8 and the main claim of the passage by listing examples of how people can connect at the library. Option E is incorrect because it references the history of the library, which does not support the idea in sentence 8 or the main claim of the passage. Option F is incorrect because, although it introduces the idea of community meetings, it does not support the idea in sentence 8. Option G is incorrect because it mentions expectations by the community members and brings up a new idea that is unrelated to the main claim of the passage and that does not provide support for sentence 8.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q006-explanation-1.png\" alt=\"Supplied Form B explanation for question 6\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q006-explanation-2.png\" alt=\"Supplied Form B explanation for question 6\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which sentence would best follow and support sentence 8?",
    "promptHtml": "<p>Which sentence would best follow and support sentence 8?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Libraries, which have been around for centuries and are found throughout the world today, help preserve the history of a community.</p>",
        "text": "Libraries, which have been around for centuries and are found throughout the world today, help preserve the history of a community."
      },
      {
        "id": "B",
        "html": "<p>The public library is often used as a place for community leaders and organizers to host community events, such as hearings or town halls.</p>",
        "text": "The public library is often used as a place for community leaders and organizers to host community events, such as hearings or town halls."
      },
      {
        "id": "C",
        "html": "<p>Libraries rely on a combination of local, state, and federal dollars to provide the kinds of services and programs that community members have come to expect.</p>",
        "text": "Libraries rely on a combination of local, state, and federal dollars to provide the kinds of services and programs that community members have come to expect."
      },
      {
        "id": "D",
        "html": "<p>At a public library, people can interact with others through a variety of programs, including teen book clubs, toddler story times, and senior-citizen exercise classes.</p>",
        "text": "At a public library, people can interact with others through a variety of programs, including teen book clubs, toddler story times, and senior-citizen exercise classes."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "the-local-library-2018-2019-form-b-pdf-shsat-2018-2019-b-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "7",
      "pages": [
        6
      ]
    },
    "explanation": "7. (A) The question asks for the revision of sentence 12 that best maintains the formal style established in the passage. Option A correctly maintains the formal style by using “people” instead of “you” and the more formal language “resources available” and “accomplish many tasks.” Option B is incorrect because it uses second person, directly addressing the reader, which is informal. Option C is incorrect because, even though it does not use second person, it uses informal language like “work on” and “things.” Option D is incorrect because it uses the informal phrase “whatever you need to do” in addition to informally addressing the reader through the use of second person.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q007-explanation-1.png\" alt=\"Supplied Form B explanation for question 7\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which revision of sentence 12 best maintains the formal style established in the passage?",
    "promptHtml": "<p>Which revision of sentence 12 best maintains the formal style established in the passage?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>The free resources available at the library can help people accomplish many tasks.</p>",
        "text": "The free resources available at the library can help people accomplish many tasks."
      },
      {
        "id": "B",
        "html": "<p>All the free materials you can get at the library can help you do many different tasks.</p>",
        "text": "All the free materials you can get at the library can help you do many different tasks."
      },
      {
        "id": "C",
        "html": "<p>Everything that is free at the library can help people work on a lot of different things.</p>",
        "text": "Everything that is free at the library can help people work on a lot of different things."
      },
      {
        "id": "D",
        "html": "<p>The free resources you can find at the library can help you do whatever you need to do.</p>",
        "text": "The free resources you can find at the library can help you do whatever you need to do."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "the-local-library-2018-2019-form-b-pdf-shsat-2018-2019-b-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "8",
      "pages": [
        7
      ]
    },
    "explanation": "8. (G) The question asks where sentence 17 should be moved in order to improve the organization of the fourth paragraph. Sentence 17 describes a typical librarian and the assistance he or she provides in the library. Option G correctly places sentence 17, an example of what else the librarian does, after the librarian is introduced in sentence 14. Option E is incorrect because it places the sentence before the main idea of the paragraph, which states that public libraries offer a variety of resources. Sentence 17 is an example of one of the resources, so it would not be placed at the beginning of the paragraph before the main idea. Option F is incorrect because it moves the sentence to before the librarian is introduced in the paragraph. Option H is incorrect because sentences 15 and 16 have shifted away from the topic of the librarian, so the details in sentence 17 would not logically fit between them.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q008-explanation-1.png\" alt=\"Supplied Form B explanation for question 8\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Where should sentence 17 be moved in order to improve the organization of the fourth paragraph (sentences 13–17)?",
    "promptHtml": "<p>Where should sentence 17 be moved in order to improve the organization of the fourth paragraph (sentences 13–17)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>to the beginning of the paragraph (before sentence 13)</p>",
        "text": "to the beginning of the paragraph (before sentence 13)"
      },
      {
        "id": "B",
        "html": "<p>between sentences 13 and 14</p>",
        "text": "between sentences 13 and 14"
      },
      {
        "id": "C",
        "html": "<p>between sentences 14 and 15</p>",
        "text": "between sentences 14 and 15"
      },
      {
        "id": "D",
        "html": "<p>between sentences 15 and 16</p>",
        "text": "between sentences 15 and 16"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-local-library-2018-2019-form-b-pdf-shsat-2018-2019-b-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "9",
      "pages": [
        7
      ]
    },
    "explanation": "9. (B) The question asks for a concluding sentence that would follow sentence 19 and support the argument presented in the passage. Option B is correct because it logically follows sentence 19 and supports the argument that the public library facilitates connections within a community and provides valuable services—some at no cost—by urging community members to use, maintain, and support their local public library. Option A is\n\nincorrect because it does not provide a logical conclusion that fully supports the argument in the passage; the sentence addresses only one benefit of having a public library, ignoring the valuable services and resources it provides. Option C is incorrect because it presents the idea that the library has been in existence since 1833, which does not logically provide a conclusion for the passage or support the argument developed in the passage. Option D is incorrect because it presents a new claim—community leaders must work together to support library events—instead of a conclusion that supports the argument presented in the passage.\n\nREADING COMPREHENSION\n\nThe Tunguska Fireball",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q009-explanation-1.png\" alt=\"Supplied Form B explanation for question 9\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-b-answers-q009-explanation-2.png\" alt=\"Supplied Form B explanation for question 9\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 19 to support the argument presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 19 to support the argument presented in the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Therefore, patrons of the public library can grow in both their social life and their level of community engagement.</p>",
        "text": "Therefore, patrons of the public library can grow in both their social life and their level of community engagement."
      },
      {
        "id": "B",
        "html": "<p>Clearly, it is in the best interest of community members to maintain, support, and use their public library.</p>",
        "text": "Clearly, it is in the best interest of community members to maintain, support, and use their public library."
      },
      {
        "id": "C",
        "html": "<p>After all, the public library has been a part of American communities since the first library was founded in 1833.</p>",
        "text": "After all, the public library has been a part of American communities since the first library was founded in 1833."
      },
      {
        "id": "D",
        "html": "<p>In fact, community leaders must work together to find ways to generate more involvement in events at the public library.</p>",
        "text": "In fact, community leaders must work together to find ways to generate more involvement in events at the public library."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const theLocalLibrary20182019FormBPassageSet: ExamPassageSet = {
  id: "ela-the-local-library-2018-2019-form-b",
  versionLabels: ["2018-2019 Form B"],
  label: "2018-2019 Form B",
  section: "revising_editing_a",
  questionCount: theLocalLibrary20182019FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-local-library-2018-2019-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "The Local Library",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form B","year":"2018-2019","form":"B","packageId":"82a187b0503bd94c3897cb85ef0ea56f4ef9ff2b46d9dc07d03468ab84cbff9a"},
    title: "The Local Library",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) According to a 2015 survey, more than two-thirds of Americans own a smartphone, which means that obtaining information or communicating with people is easier than ever before. (2) With the swipe of a finger, the tap of an icon, or a verbal command, people have instant access to articles, blogs, news, and social networking websites. (3) Even with all these immediately available sources of information, one of the best resources for many members of the community also happens to be one of the oldest. (4) The public library is a great place for people to get information.</p><p>(5) The public library serves a truly critical role in promoting community. (6) With the explosion of digital media in recent years, people in different locations can now communicate almost instantaneously. (7) And yet many people complain of feeling more isolated and alone than ever before. (8) The library stands in a rare position to help community members meet this universal need for human connection and companionship.</p><p>(9) Furthermore, libraries provide certain amenities, such as access to the Internet, for free to all people. (10) A student who does not have a computer at home can research and type a paper for school. (11) Similarly, an unemployed adult without access to the Internet can make use of library resources to find job opportunities. (12) The free items that are found at the library can help people get a lot done.</p><p>(13) Public libraries also offer a variety of resources to community members. (14) One important resource is the local librarian, who does far more than check out books and collect fines. (15) Other library resources include free or low-cost tutoring and training programs. (16) Additionally, lectures, book groups, and town meetings promote critical thinking and community engagement. (17) A typical librarian holds a master’s degree and can help library patrons navigate through the flood of information available in print and on the Internet.</p><p>(18) The hallmark of a public library is that its materials and services are accessible to all. (19) The library connects people to a network of information and resources and is an important part of a community.</p>",
    text: theLocalLibrary20182019FormBPassageText,
    versionLabel: "2018-2019 Form B",
  }),
  questions: theLocalLibrary20182019FormBQuestions,
};
