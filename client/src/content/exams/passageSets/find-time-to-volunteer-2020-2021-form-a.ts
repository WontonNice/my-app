import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const findTimeToVolunteer20202021FormAPassageText = "(1) Many people believe that they gain a greater sense of purpose by giving their time to serve others. (2) These are the people who spend their free time volunteering at various places within the community. (3) Those who are served benefit from the work of these volunteers. (4) However, research shows that those who volunteer also receive benefits.\n\n(5) For many students, this proposition may sound impossible. (6) Schoolwork can require hours of study each week. (7) Volunteering at a retirement center or homeless shelter requires both time and energy. (8) Extracurricular activities fill up after-school time. (9) Family obligations and part-time jobs often have to be worked into the schedule, too. (10) However, if students can find time to volunteer, even for a few hours a month, they may find that the benefits outweigh the scheduling difficulties.\n\n(11) To begin with, students who engage in volunteer activities acquire valuable skills and experience, which can help them focus on potential fields of study and career options. (12) Furthermore, when students list volunteer work on college applications, admissions counselors see applicants who care about making their community and college campus a better place.\n\n(13) Volunteerism benefits more than students applying to college. (14) This type of experience is equally important for students moving directly into the workforce after high school. (15) Volunteering demonstrates initiative, dedication, and a strong work ethic, qualities that companies value in a potential employee. (16) In a CareerBuilder study, 60 percent of managers regarded volunteerism as a significant asset when considering applicants.\n\n(17) Students who volunteer undoubtedly make a positive investment in their future, but they also affect their present quality of life. (18) Studies have shown that volunteering is good for both the mind and the body. (19) Volunteering can boost mood levels and reduce anxiety. (20) According to the Mayo Clinic,1 the feeling of doing something meaningful and the appreciation received from that action can reduce stress.\n\n(21) Even the busiest of students can find a way to donate some time to a worthy cause. (22) Though managing different commitments may seem overwhelming at times, students are sure to feel a sense of fulfillment in volunteerism.";

const findTimeToVolunteer20202021FormAQuestions: ExamQuestion[] = [
  {
    "id": "find-time-to-volunteer-2020-2021-form-a-20202021-form-a-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "6",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q6-1-png-passage.png\" alt=\"Supplied explanation for question 6\"></p>",
    "points": 1,
    "prompt": "Which revision of sentence 2 uses the most precise language?",
    "promptHtml": "<p>Which revision of sentence 2 uses the most precise language?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>These are the people who spend their free time volunteering at animal shelters, helping with activities in community centers, or cleaning up parks.</p>",
        "text": "These are the people who spend their free time volunteering at animal shelters, helping with activities in community centers, or cleaning up parks."
      },
      {
        "id": "B",
        "html": "<p>These are the people who spend their free time helping others in numerous ways at a variety of places, events, or organizations that need support.</p>",
        "text": "These are the people who spend their free time helping others in numerous ways at a variety of places, events, or organizations that need support."
      },
      {
        "id": "C",
        "html": "<p>These are the people who spend their free time working at local establishments that help people, animals, or other groups in need of assistance.</p>",
        "text": "These are the people who spend their free time working at local establishments that help people, animals, or other groups in need of assistance."
      },
      {
        "id": "D",
        "html": "<p>These are the people who spend a lot of time volunteering at places where they can help people in many ways.</p>",
        "text": "These are the people who spend a lot of time volunteering at places where they can help people in many ways."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "find-time-to-volunteer-2020-2021-form-a-20202021-form-a-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "7",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q7-1-png-passage.png\" alt=\"Supplied explanation for question 7\"></p>",
    "points": 1,
    "prompt": "Which sentence should follow sentence 4 to introduce the main claim of the passage?",
    "promptHtml": "<p>Which sentence should follow sentence 4 to introduce the main claim of the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>With that in mind, high school students should consider engaging in some form of regular volunteerism.</p>",
        "text": "With that in mind, high school students should consider engaging in some form of regular volunteerism."
      },
      {
        "id": "B",
        "html": "<p>Fortunately for students, these benefits are guaranteed to produce both immediate and long-term results.</p>",
        "text": "Fortunately for students, these benefits are guaranteed to produce both immediate and long-term results."
      },
      {
        "id": "C",
        "html": "<p>In fact, studies have confirmed that volunteerism can be beneficial for students, the family, and the community.</p>",
        "text": "In fact, studies have confirmed that volunteerism can be beneficial for students, the family, and the community."
      },
      {
        "id": "D",
        "html": "<p>For this reason, high school students should learn about how helping others can strengthen their communities.</p>",
        "text": "For this reason, high school students should learn about how helping others can strengthen their communities."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "find-time-to-volunteer-2020-2021-form-a-20202021-form-a-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "8",
      "pages": [
        6
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q8-1-png-passage.png\" alt=\"Supplied explanation for question 8\"></p>",
    "points": 1,
    "prompt": "Which sentence is least relevant to the ideas presented in the second paragraph (sentences 5–10) and should be deleted?",
    "promptHtml": "<p>Which sentence is least relevant to the ideas presented in the second paragraph (sentences 5–10) and should be deleted?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 6</p>",
        "text": "sentence 6"
      },
      {
        "id": "B",
        "html": "<p>sentence 7</p>",
        "text": "sentence 7"
      },
      {
        "id": "C",
        "html": "<p>sentence 8</p>",
        "text": "sentence 8"
      },
      {
        "id": "D",
        "html": "<p>sentence 9</p>",
        "text": "sentence 9"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "find-time-to-volunteer-2020-2021-form-a-20202021-form-a-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "9",
      "pages": [
        7
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q9-1-png-passage.png\" alt=\"Supplied explanation for question 9\"></p>",
    "points": 1,
    "prompt": "Which of these would best follow sentence 12 and support the ideas presented in the third paragraph (sentences 11–12)?",
    "promptHtml": "<p>Which of these would best follow sentence 12 and support the ideas presented in the third paragraph (sentences 11–12)?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>These students show that they are likely to be responsible, reliable, and helpful young adults. Admissions counselors know that character traits like these will benefit the applicants as well as whomever they interact with.</p>",
        "text": "These students show that they are likely to be responsible, reliable, and helpful young adults. Admissions counselors know that character traits like these will benefit the applicants as well as whomever they interact with."
      },
      {
        "id": "B",
        "html": "<p>Volunteering can help students meet new people who can provide references and advice to the students when they are applying to colleges. It can also be an invaluable opportunity for students to meet possible future employers.</p>",
        "text": "Volunteering can help students meet new people who can provide references and advice to the students when they are applying to colleges. It can also be an invaluable opportunity for students to meet possible future employers."
      },
      {
        "id": "C",
        "html": "<p>The counselors hope that young adults who demonstrate this behavior will go on to volunteer during their college years, working on campus in student government and leadership programs or serving in the community at hospitals, schools, and homeless shelters.</p>",
        "text": "The counselors hope that young adults who demonstrate this behavior will go on to volunteer during their college years, working on campus in student government and leadership programs or serving in the community at hospitals, schools, and homeless shelters."
      },
      {
        "id": "D",
        "html": "<p>Many colleges are looking for students who are not just academically successful but who also work well with others and care about improving and serving surrounding communities.</p>",
        "text": "Many colleges are looking for students who are not just academically successful but who also work well with others and care about improving and serving surrounding communities."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "find-time-to-volunteer-2020-2021-form-a-20202021-form-a-q010",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "10",
      "pages": [
        7
      ]
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q10-1-png-passage.png\" alt=\"Supplied explanation for question 10\"></p>",
    "points": 1,
    "prompt": "Which concluding sentence should replace sentence 22 to provide the best support for the argument presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should replace sentence 22 to provide the best support for the argument presented in the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>In every city, there are homeless shelters, food pantries, youth centers, and political campaigns that depend on the support and commitment of hardworking young people.</p>",
        "text": "In every city, there are homeless shelters, food pantries, youth centers, and political campaigns that depend on the support and commitment of hardworking young people."
      },
      {
        "id": "B",
        "html": "<p>Clearly, students who volunteer will experience a host of benefits, such as learning new skills meeting interesting people, opening up opportunities for the future, and gaining a sense of satisfaction.</p>",
        "text": "Clearly, students who volunteer will experience a host of benefits, such as learning new skills meeting interesting people, opening up opportunities for the future, and gaining a sense of satisfaction."
      },
      {
        "id": "C",
        "html": "<p>When students carefully evaluate their activities and prioritize volunteerism, they find a way to work it into their schedule and are soon encouraging their peers to do the same.</p>",
        "text": "When students carefully evaluate their activities and prioritize volunteerism, they find a way to work it into their schedule and are soon encouraging their peers to do the same."
      },
      {
        "id": "D",
        "html": "<p>Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress, high school students who volunteer can help themselves as much a they help others.</p>",
        "text": "Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress, high school students who volunteer can help themselves as much a they help others."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const findTimeToVolunteer20202021FormAPassageSet: ExamPassageSet = {
  id: "ela-find-time-to-volunteer-2020-2021-form-a",
  versionLabels: ["2020-2021 Form A"],
  label: "2020-2021 Form A",
  section: "revising_editing_a",
  questionCount: findTimeToVolunteer20202021FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "find-time-to-volunteer-2020-2021-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2020-2021 Form A","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf","year":"2020-2021","form":"A","packageId":"17875cc8349f1a636d061bcc2a290d1c13061207fdc0cf39d0249d065432786f"},
    title: "Find Time to Volunteer",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) Many people believe that they gain a greater sense of purpose by giving their time to serve others. (2) These are the people who spend their free time volunteering at various places within the community. (3) Those who are served benefit from the work of these volunteers. (4) However, research shows that those who volunteer also receive benefits.</p><p>(5) For many students, this proposition may sound impossible. (6) Schoolwork can require hours of study each week. (7) Volunteering at a retirement center or homeless shelter requires both time and energy. (8) Extracurricular activities fill up after-school time. (9) Family obligations and part-time jobs often have to be worked into the schedule, too. (10) However, if students can find time to volunteer, even for a few hours a month, they may find that the benefits outweigh the scheduling difficulties.</p><p>(11) To begin with, students who engage in volunteer activities acquire valuable skills and experience, which can help them focus on potential fields of study and career options. (12) Furthermore, when students list volunteer work on college applications, admissions counselors see applicants who care about making their community and college campus a better place.</p><p>(13) Volunteerism benefits more than students applying to college. (14) This type of experience is equally important for students moving directly into the workforce after high school. (15) Volunteering demonstrates initiative, dedication, and a strong work ethic, qualities that companies value in a potential employee. (16) In a CareerBuilder study, 60 percent of managers regarded volunteerism as a significant asset when considering applicants.</p><p>(17) Students who volunteer undoubtedly make a positive investment in their future, but they also affect their present quality of life. (18) Studies have shown that volunteering is good for both the mind and the body. (19) Volunteering can boost mood levels and reduce anxiety. (20) According to the <span data-glossary-definition=\"a nonprofit medical organization dedicated to treatment and research\" role=\"link\" tabindex=\"0\">Mayo Clinic</span>,<sup><strong>1</strong></sup> the feeling of doing something meaningful and the appreciation received from that action can reduce stress.</p><p>(21) Even the busiest of students can find a way to donate some time to a worthy cause. (22) Though managing different commitments may seem overwhelming at times, students are sure to feel a sense of fulfillment in volunteerism.</p>",
    text: findTimeToVolunteer20202021FormAPassageText,
    versionLabel: "2020-2021 Form A",
  }),
  questions: findTimeToVolunteer20202021FormAQuestions,
};
