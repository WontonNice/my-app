import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theFreeCollegeDebate20202021FormBPassageText = "(1) A college degree has become an essential tool in an increasingly competitive job market. (2) Yet, the price of higher education, at both private and public universities, continues to rise. (3) Helping students cover the cost of attending college is an important issue.\n\n(4) Many people agree that a college education should be a financially realistic option for those who aspire to obtain a degree. (5) For example, in 2017, the New York State legislature passed a bill creating a program to cover the tuition costs for nearly one million students. (6) The state of Tennessee also has a program that offers all students scholarships and mentoring services if they attend one of the state’s community colleges. (7) Proponents generally believe that these programs are a step in the right direction for making college affordable for students who would have had to take out loans or who would have decided not to pursue higher education at all.\n\n(8) On the other hand, some people oppose bills like the ones in New York and Tennessee because they believe “free” college programs are unsustainable. (9) In order to implement these types of programs, a state pays the college on behalf of the students using funds from the state’s budget, which primarily comes from state taxes. (10) As more students choose to attend college, more funds will be needed to cover the costs. (11) Additionally, many students do not finish college within four years because they switch majors or because they have to work. (12) Critics believe that these circumstances will inevitably lead to an increase in taxes, a decline in the quality of the education offered by the schools, or both. (13) They think narrower college-affordability efforts that target the students who need the most support, such as first-generation college students, may be more effective and viable solutions.\n\n(14) Faculty and students at higher-education institutions can work to keep costs down. (15) In light of increased access to computers, mobile devices, and the Internet, there are more opportunities for students to take courses online, thus reducing the need for and cost of maintaining physical classrooms. (16) Additionally, colleges should account for experience by allowing students to demonstrate their knowledge in order to avoid having to pay to sit through classes on subjects they have already mastered. (17) Similarly, college-bound high school students need to be prepared for college-level work so that they do not have to spend money on remedial classes.\n\n(18) The solutions to the problems associated with rising college costs are not simple. (19) Passing legislation that boosts college affordability will take time, input from experts with different ideas, and careful planning.";

const theFreeCollegeDebate20202021FormBQuestions: ExamQuestion[] = [
  {
    "id": "the-free-college-debate-2020-2021-form-b-20202021-form-b-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q5-1-png-passage.png\" alt=\"Supplied explanation for question 5\"></p>",
    "points": 1,
    "prompt": "Which sentence should replace sentence 3 to best state the topic of the passage?",
    "promptHtml": "<p>Which sentence should replace sentence 3 to best state the topic of the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Several states have implemented scholarship programs that allow students to attend public universities and community colleges at a very low tuition rate or for free.</p>",
        "text": "Several states have implemented scholarship programs that allow students to attend public universities and community colleges at a very low tuition rate or for free."
      },
      {
        "id": "B",
        "html": "<p>Determining the most effective way to make college affordable is a complex issue, and there are differing opinions about how to approach the problem.</p>",
        "text": "Determining the most effective way to make college affordable is a complex issue, and there are differing opinions about how to approach the problem."
      },
      {
        "id": "C",
        "html": "<p>Higher-education institutions should reduce the cost of a college education by finding ways to help students avoid paying for unnecessary classes and materials.</p>",
        "text": "Higher-education institutions should reduce the cost of a college education by finding ways to help students avoid paying for unnecessary classes and materials."
      },
      {
        "id": "D",
        "html": "<p>The main concern related to the issue of college affordability is that helping students cover tuition could affect the quality of the education they receive.</p>",
        "text": "The main concern related to the issue of college affordability is that helping students cover tuition could affect the quality of the education they receive."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2020-2021-form-b-20202021-form-b-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "6",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q6-1-png-passage.png\" alt=\"Supplied explanation for question 6\"></p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nSome note that several states have made their community or state colleges low-cost or free for students with limited resources.\n\nWhere should the sentence be added to best support the ideas in the second paragraph (sentences 4–7)?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\">Some note that several states have made their community or state colleges low-cost or free for students with limited resources.</blockquote><p>Where should the sentence be added to best support the ideas in the second paragraph (sentences 4–7)?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>at the beginning of the paragraph (before sentence 4)</p>",
        "text": "at the beginning of the paragraph (before sentence 4)"
      },
      {
        "id": "B",
        "html": "<p>between sentences 4 and 5</p>",
        "text": "between sentences 4 and 5"
      },
      {
        "id": "C",
        "html": "<p>between sentences 5 and 6</p>",
        "text": "between sentences 5 and 6"
      },
      {
        "id": "D",
        "html": "<p>between sentences 6 and 7</p>",
        "text": "between sentences 6 and 7"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2020-2021-form-b-20202021-form-b-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "7",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q7-1-png-passage.png\" alt=\"Supplied explanation for question 7\"></p>",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the topic of the third paragraph (sentences 8–13) and should be deleted?",
    "promptHtml": "<p>Which sentence presents information that shifts away from the topic of the third paragraph (sentences 8–13) and should be deleted?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 10</p>",
        "text": "sentence 10"
      },
      {
        "id": "B",
        "html": "<p>sentence 11</p>",
        "text": "sentence 11"
      },
      {
        "id": "C",
        "html": "<p>sentence 12</p>",
        "text": "sentence 12"
      },
      {
        "id": "D",
        "html": "<p>sentence 13</p>",
        "text": "sentence 13"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2020-2021-form-b-20202021-form-b-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "8",
      "pages": [
        7
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q8-1-png-passage.png\" alt=\"Supplied explanation for question 8\"></p>",
    "points": 1,
    "prompt": "Which phrase should be added before sentence 14 to best transition to the ideas in the fourth paragraph (sentences 14–17)?",
    "promptHtml": "<p>Which phrase should be added before sentence 14 to best transition to the ideas in the fourth paragraph (sentences 14–17)?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Because college affordability is a complicated issue,</p>",
        "text": "Because college affordability is a complicated issue,"
      },
      {
        "id": "B",
        "html": "<p>With so many opinions about how to make college affordable,</p>",
        "text": "With so many opinions about how to make college affordable,"
      },
      {
        "id": "C",
        "html": "<p>Until college becomes more affordable,</p>",
        "text": "Until college becomes more affordable,"
      },
      {
        "id": "D",
        "html": "<p>Although some college affordability programs have been successful,</p>",
        "text": "Although some college affordability programs have been successful,"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2020-2021-form-b-20202021-form-b-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "9",
      "pages": [
        7
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q9-1-png-passage.png\" alt=\"Supplied explanation for question 9\"></p><p><img src=\"/exam-images/restore-20202021-form-b-answers-q9-2-png-passage.png\" alt=\"Supplied explanation for question 9\"></p>",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 19 to support the topic of the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 19 to support the topic of the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The increasing use of technology in college classrooms and the financial support from tuition scholarship programs will make colleges more affordable for many students.</p>",
        "text": "The increasing use of technology in college classrooms and the financial support from tuition scholarship programs will make colleges more affordable for many students."
      },
      {
        "id": "B",
        "html": "<p>Statewide tuition scholarship programs will make college more affordable for many students, but these programs may lead to new problems.</p>",
        "text": "Statewide tuition scholarship programs will make college more affordable for many students, but these programs may lead to new problems."
      },
      {
        "id": "C",
        "html": "<p>Until the problems associated with the rising cost of college are solved, many students will pursue other options after graduating high school.</p>",
        "text": "Until the problems associated with the rising cost of college are solved, many students will pursue other options after graduating high school."
      },
      {
        "id": "D",
        "html": "<p>When the issue of college affordability is resolved, students will be able to make decisions about pursuing higher education without cost being the deciding factor.</p>",
        "text": "When the issue of college affordability is resolved, students will be able to make decisions about pursuing higher education without cost being the deciding factor."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const theFreeCollegeDebate20202021FormBPassageSet: ExamPassageSet = {
  id: "ela-the-free-college-debate-2020-2021-form-b",
  versionLabels: ["2020-2021 Form B"],
  label: "2020-2021 Form B",
  section: "revising_editing_a",
  questionCount: theFreeCollegeDebate20202021FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-free-college-debate-2020-2021-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2020-2021 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf","year":"2020-2021","form":"B","packageId":"0d3d849367f028d04470eb9fe8cc796013daa6f435c528294ffea62e0969dddc"},
    title: "The Free College Debate",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) A college degree has become an essential tool in an increasingly competitive job market. (2) Yet, the price of higher education, at both private and public universities, continues to rise. (3) Helping students cover the cost of attending college is an important issue.</p><p>(4) Many people agree that a college education should be a financially realistic option for those who aspire to obtain a degree. (5) For example, in 2017, the New York State legislature passed a bill creating a program to cover the tuition costs for nearly one million students. (6) The state of Tennessee also has a program that offers all students scholarships and mentoring services if they attend one of the state’s community colleges. (7) Proponents generally believe that these programs are a step in the right direction for making college affordable for students who would have had to take out loans or who would have decided not to pursue higher education at all.</p><p>(8) On the other hand, some people oppose bills like the ones in New York and Tennessee because they believe “free” college programs are unsustainable. (9) In order to implement these types of programs, a state pays the college on behalf of the students using funds from the state’s budget, which primarily comes from state taxes. (10) As more students choose to attend college, more funds will be needed to cover the costs. (11) Additionally, many students do not finish college within four years because they switch majors or because they have to work. (12) Critics believe that these circumstances will inevitably lead to an increase in taxes, a decline in the quality of the education offered by the schools, or both. (13) They think narrower college-affordability efforts that target the students who need the most support, such as first-generation college students, may be more effective and viable solutions.</p><p>(14) Faculty and students at higher-education institutions can work to keep costs down. (15) In light of increased access to computers, mobile devices, and the Internet, there are more opportunities for students to take courses online, thus reducing the need for and cost of maintaining physical classrooms. (16) Additionally, colleges should account for experience by allowing students to demonstrate their knowledge in order to avoid having to pay to sit through classes on subjects they have already mastered. (17) Similarly, college-bound high school students need to be prepared for college-level work so that they do not have to spend money on remedial classes.</p><p>(18) The solutions to the problems associated with rising college costs are not simple. (19) Passing legislation that boosts college affordability will take time, input from experts with different ideas, and careful planning.</p>",
    text: theFreeCollegeDebate20202021FormBPassageText,
    versionLabel: "2020-2021 Form B",
  }),
  questions: theFreeCollegeDebate20202021FormBQuestions,
};
