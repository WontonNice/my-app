import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const findTimeToVolunteer20242025FormBPassageText = "(1) Many people believe that they gain a greater sense of purpose by giving their time to serve others. (2) These are the people who spend their free time volunteering at various places within the community. (3) Those who are served benefit from the work of these volunteers. (4) However, research shows that those who volunteer also receive benefits.\n\n(5) For many students, this proposition may sound impossible. (6) Schoolwork can require hours of study each week. (7) Volunteering at a retirement center or homeless shelter requires both time and energy. (8) Extracurricular activities fill up after-school time. (9) Family obligations and part- time jobs often have to be worked into the schedule, too. (10) However, if students can find time to volunteer, even for a few hours a month, they may find that the benefits outweigh the scheduling difficulties.\n\n(11) To begin with, students who engage in volunteer activities acquire valuable skills and experience, which can help them focus on potential fields of study and career options. (12) Furthermore, when students list volunteer work on college applications, admissions counselors see applicants who care about making their community and college campus a better place.\n\n(13) Volunteerism benefits more than students applying to college. (14) This type of experience is equally important for students moving directly into the workforce after high school. (15) Volunteering demonstrates initiative, dedication, and a strong work ethic, qualities that companies value in a potential employee. (16) In a CareerBuilder study, 60 percent of managers regarded volunteerism as a significant asset when considering applicants.\n\n(17) Students who volunteer undoubtedly make a positive investment in their future, but they also affect their present quality of life. (18) Studies have shown that volunteering is good for both the mind and the body. (19) Volunteering can boost mood levels and reduce anxiety. (20) According to the Mayo Clinic, the feeling of doing something meaningful and the appreciation received from that action can reduce stress.\n\n(21) Even the busiest of students can find a way to donate some time to a worthy cause. (22) Though managing different commitments may seem overwhelming at times, students are sure to feel a sense of fulfillment in volunteerism.";

const findTimeToVolunteer20242025FormBQuestions: ExamQuestion[] = [
  {
    "id": "find-time-to-volunteer-2024-2025-form-b-pdf-shsat-2024-2025-b-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        8
      ]
    },
    "explanation": "The question asks which revision of sentence 2 uses the most precise language.\n\nA. CORRECT. In sentence 2, the author states that people who volunteer in their free time do so “at various places.” The revision to sentence 2 provides the most precise language because it references three specific places (animal shelters, community centers, and parks) where people often volunteer. B. Incorrect. Although this sentence mentions “a variety of places, events, or organizations” at which people volunteer, the revision does not use the most precise language, because it does not list specific places, events, or organizations. C. Incorrect. Although this sentence mentions “local establishments that help people, animals, or other groups,” the revision does not use the most precise language, because it does not name the specific types of establishments at which people can volunteer. D. Incorrect. Although this sentence mentions “places where [volunteers] can help people in many ways,” the revision does not use the most precise language, because it does not provide specific examples of where people can volunteer.",
    "explanationHtml": "<p><strong>5. </strong>The question asks which revision of sentence 2 uses the <strong>most </strong>precise language.</p><p><strong>A. CORRECT. </strong>In sentence 2, the author states that people who volunteer in their free time do so “at various places.” The revision to sentence 2 provides the most precise language because it references three specific places (animal shelters, community centers, and parks) where people often volunteer. <strong>B. </strong>Incorrect. Although this sentence mentions “a variety of places, events, or organizations” at which people volunteer, the revision does not use the most precise language, because it does not list specific places, events, or organizations. <strong>C. </strong>Incorrect. Although this sentence mentions “local establishments that help people, animals, or other groups,” the revision does not use the most precise language, because it does not name the specific types of establishments at which people can volunteer. <strong>D. </strong>Incorrect. Although this sentence mentions “places where [volunteers] can help people in many ways,” the revision does not use the most precise language, because it does not provide specific examples of where people can volunteer.</p>",
    "points": 1,
    "prompt": "Which revision of sentence 2 uses the most precise language?",
    "promptHtml": "<p>Which revision of sentence 2 uses the <strong>most </strong>precise language?</p>",
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
    "id": "find-time-to-volunteer-2024-2025-form-b-pdf-shsat-2024-2025-b-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "6",
      "pages": [
        8
      ]
    },
    "explanation": "The question asks which sentence should follow sentence 4 to introduce the main claim of\n\nthe passage.\n\nA. CORRECT. Sentence 4 states that “research shows that those who volunteer also receive benefits.” The sentence in the option logically follows the ideas in sentence 4 and provides the best thesis statement for the passage because it introduces the main claim that high school students should consider the benefits of volunteerism. B. Incorrect. While the sentence refers to the “benefits” mentioned in sentence 4, it erroneously asserts that “immediate and long-term results” are “guaranteed.” In addition, the sentence does not introduce the main claim of the passage that volunteering is beneficial for high school students. C. Incorrect. Although the sentence states that “volunteerism can be beneficial for students,” it introduces the idea that “the family, and the community” benefit as well, which is not part of the main argument. Therefore, this sentence should not follow sentence 4 to introduce the main claim of the passage. D. Incorrect. Although the sentence introduces the claim that “high school students should learn about” volunteering, it focuses on the idea that volunteering strengthens the community, which is not the main claim. This sentence does not accurately introduce the claim that volunteering is beneficial for high school students and thus should not follow sentence 4.",
    "explanationHtml": "<p><strong>6. </strong>The question asks which sentence should follow sentence 4 to introduce the main claim of</p><p>the passage.</p><p><strong>A. CORRECT. </strong>Sentence 4 states that “research shows that those who volunteer also receive benefits.” The sentence in the option logically follows the ideas in sentence 4 and provides the best thesis statement for the passage because it introduces the main claim that high school students should consider the benefits of volunteerism. <strong>B. </strong>Incorrect. While the sentence refers to the “benefits” mentioned in sentence 4, it erroneously asserts that “immediate and long-term results” are “guaranteed.” In addition, the sentence does not introduce the main claim of the passage that volunteering is beneficial for high school students. <strong>C. </strong>Incorrect. Although the sentence states that “volunteerism can be beneficial for students,” it introduces the idea that “the family, and the community” benefit as well, which is not part of the main argument. Therefore, this sentence should not follow sentence 4 to introduce the main claim of the passage. <strong>D. </strong>Incorrect. Although the sentence introduces the claim that “high school students should learn about” volunteering, it focuses on the idea that volunteering strengthens the community, which is not the main claim. This sentence does not accurately introduce the claim that volunteering is beneficial for high school students and thus should not follow sentence 4.</p>",
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
    "id": "find-time-to-volunteer-2024-2025-form-b-pdf-shsat-2024-2025-b-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "7",
      "pages": [
        8
      ]
    },
    "explanation": "The question asks which sentence is least relevant to the ideas presented in the second\n\nparagraph (sentences 5–10) and should be deleted.\n\nA. Incorrect. Sentence 5 introduces the topic of the second paragraph, which is that finding time to volunteer “may sound impossible” for many students. Sentence 6 logically follows this idea because it provides one reason why students might hesitate or be unable to volunteer. Therefore, sentence 6 is relevant to the ideas presented in the second paragraph and should not be deleted. B. CORRECT. Sentence 7 states that “time and energy” are required for volunteering, which partially addresses the topic of the second paragraph about the various commitments that fill high school students’ schedules. However, sentence 7 interrupts the flow of the paragraph by interjecting specific examples (“volunteering at a retirement center or homeless shelter”) into a general list of activities and commitments. Thus, the sentence is the least relevant to the paragraph and should be deleted. C. Incorrect. In the second paragraph, the author discusses why some high school students may hesitate to volunteer. In sentences 6 and 9, the author points out that “schoolwork” and “family obligations and part-time jobs” are activities that require students’ time and may cause them to hesitate taking on any additional activities. Sentence 8 contributes to this idea by stating that “extracurricular activities” also require a time commitment from students. As a result, sentence 8 contributes to the ideas in the second paragraph and should not be deleted. D. Incorrect. In the second paragraph, the author acknowledges that some high school students may hesitate to volunteer because of “schoolwork” and “extracurricular activities.” Sentence 9 contributes to this idea by stating that “family obligations and part-time jobs” also require a time commitment and may cause students to hesitate to volunteer. Therefore, sentence 9 contributes to the ideas in the second paragraph and should not be deleted.",
    "explanationHtml": "<p><strong>7. </strong>The question asks which sentence is least relevant to the ideas presented in the second</p><p>paragraph (sentences 5–10) and should be deleted.</p><p><strong>A. </strong>Incorrect. Sentence 5 introduces the topic of the second paragraph, which is that finding time to volunteer “may sound impossible” for many students. Sentence 6 logically follows this idea because it provides one reason why students might hesitate or be unable to volunteer. Therefore, sentence 6 is relevant to the ideas presented in the second paragraph and should not be deleted. <strong>B. CORRECT. </strong>Sentence 7 states that “time and energy” are required for volunteering, which partially addresses the topic of the second paragraph about the various commitments that fill high school students’ schedules. However, sentence 7 interrupts the flow of the paragraph by interjecting specific examples (“volunteering at a retirement center or homeless shelter”) into a general list of activities and commitments. Thus, the sentence is the least relevant to the paragraph and should be deleted. <strong>C. </strong>Incorrect. In the second paragraph, the author discusses why some high school students may hesitate to volunteer. In sentences 6 and 9, the author points out that “schoolwork” and “family obligations and part-time jobs” are activities that require students’ time and may cause them to hesitate taking on any additional activities. Sentence 8 contributes to this idea by stating that “extracurricular activities” also require a time commitment from students. As a result, sentence 8 contributes to the ideas in the second paragraph and should not be deleted. <strong>D. </strong>Incorrect. In the second paragraph, the author acknowledges that some high school students may hesitate to volunteer because of “schoolwork” and “extracurricular activities.” Sentence 9 contributes to this idea by stating that “family obligations and part-time jobs” also require a time commitment and may cause students to hesitate to volunteer. Therefore, sentence 9 contributes to the ideas in the second paragraph and should not be deleted.</p>",
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
    "id": "find-time-to-volunteer-2024-2025-form-b-pdf-shsat-2024-2025-b-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "8",
      "pages": [
        9
      ]
    },
    "explanation": "The question asks which option would best follow sentence 12 to support the ideas presented\n\nin the third paragraph (sentences 11–12).\n\nA. Incorrect. The subject of the main clause in sentence 12 is “admissions counselors.” Although the second sentence in the option mentions “admissions counselors,” it does not support the ideas in the paragraph, because the statement that “admissions counselors know that character traits like these will benefit the applicants” focuses on how students benefit, while sentence 12 focuses on how these traits benefit the community. B. Incorrect. While sentence 11 discusses the potential academic and professional connections that can be made through volunteering, sentence 12 moves on to the topic of college admissions. Since the sentences in the option revert back to the topic of connections, they do not support and logically follow a sentence about how college admissions counselors view students with volunteering experience. C. Incorrect. Although the sentence in the option continues on the subject of admissions counselors and follows the idea in sentence 12 that these counselors tend to favor students who “care about making their community and college campus a better place,” the sentence focuses on what students will do while in college rather than on how volunteering helps them get into college. Therefore, the sentence does not best follow sentence 12 and support the ideas presented in the third paragraph. D. CORRECT. In sentence 12, the author states that college admissions counselors view students who list volunteer work on admissions applications as “applicants who care about making their community and college campus a better place.” The sentence in the option best follows sentence 12 and supports the ideas in the third paragraph because it provides additional details about why admissions counselors look beyond academics when considering students for admissions and the positive qualities assigned to those who have volunteering experience.",
    "explanationHtml": "<p><strong>8. </strong>The question asks which option would <strong>best </strong>follow sentence 12 to support the ideas presented</p><p>in the third paragraph (sentences 11–12).</p><p><strong>A. </strong>Incorrect. The subject of the main clause in sentence 12 is “admissions counselors.” Although the second sentence in the option mentions “admissions counselors,” it does not support the ideas in the paragraph, because the statement that “admissions counselors know that character traits like these will benefit the applicants” focuses on how students benefit, while sentence 12 focuses on how these traits benefit the community. <strong>B. </strong>Incorrect. While sentence 11 discusses the potential academic and professional connections that can be made through volunteering, sentence 12 moves on to the topic of college admissions. Since the sentences in the option revert back to the topic of connections, they do not support and logically follow a sentence about how college admissions counselors view students with volunteering experience. <strong>C. </strong>Incorrect. Although the sentence in the option continues on the subject of admissions counselors and follows the idea in sentence 12 that these counselors tend to favor students who “care about making their community and college campus a better place,” the sentence focuses on what students will do while in college rather than on how volunteering helps them get into college. Therefore, the sentence does not best follow sentence 12 and support the ideas presented in the third paragraph. <strong>D. CORRECT. </strong>In sentence 12, the author states that college admissions counselors view students who list volunteer work on admissions applications as “applicants who care about making their community and college campus a better place.” The sentence in the option best follows sentence 12 and supports the ideas in the third paragraph because it provides additional details about why admissions counselors look beyond academics when considering students for admissions and the positive qualities assigned to those who have volunteering experience.</p>",
    "points": 1,
    "prompt": "Which of these would best follow sentence 12 and support the ideas presented in the third paragraph (sentences 11–12)?",
    "promptHtml": "<p>Which of these would <strong>best </strong>follow sentence 12 and support the ideas presented in the third paragraph (sentences 11–12)?</p>",
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
    "id": "find-time-to-volunteer-2024-2025-form-b-pdf-shsat-2024-2025-b-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "9",
      "pages": [
        9
      ]
    },
    "explanation": "The question asks which concluding sentence should replace sentence 22 to provide the best\n\nsupport for the argument presented in the passage.\n\nA. Incorrect. Although the sentence lists examples of organizations that depend on “hardworking young people” as volunteers, it should not replace sentence 22, because its use of specific examples does not provide a strong conclusion to the main idea in the passage, and it does not best support the main argument that students benefit themselves and their community when volunteering. B. Incorrect. While the sentence supports the argument that students “will experience a host of benefits” through volunteerism, it should not replace sentence 22 as a concluding sentence, because it does not best support the main argument that volunteerism benefits both the students and their community. C. Incorrect. Although the sentence emphasizes the importance of prioritizing volunteerism, it should not replace sentence 22, because it focuses on the main idea in the second paragraph (“For many students, this proposition may sound impossible.”), rather than the main argument that volunteerism benefits both students and their community. This sentence introduces the idea that student volunteers “are soon encouraging their peers” to volunteer, which does not best support the argument presented in the passage. D. CORRECT. This sentence should replace sentence 22 to conclude the passage because it lists specific reasons for volunteering (“Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress”) and best supports the main argument that volunteering not only helps students but can also help their community (“high school students who volunteer can help themselves as much as they help others”).",
    "explanationHtml": "<p><strong>9. </strong>The question asks which concluding sentence should replace sentence 22 to provide the <strong>best</strong></p><p>support for the argument presented in the passage.</p><p><strong>A. </strong>Incorrect. Although the sentence lists examples of organizations that depend on “hardworking young people” as volunteers, it should not replace sentence 22, because its use of specific examples does not provide a strong conclusion to the main idea in the passage, and it does not best support the main argument that students benefit themselves and their community when volunteering. <strong>B. </strong>Incorrect. While the sentence supports the argument that students “will experience a host of benefits” through volunteerism, it should not replace sentence 22 as a concluding sentence, because it does not best support the main argument that volunteerism benefits both the students and their community. <strong>C. </strong>Incorrect. Although the sentence emphasizes the importance of prioritizing volunteerism, it should not replace sentence 22, because it focuses on the main idea in the second paragraph (“For many students, this proposition may sound impossible.”), rather than the main argument that volunteerism benefits both students and their community. This sentence introduces the idea that student volunteers “are soon encouraging their peers” to volunteer, which does not best support the argument presented in the passage. <strong>D. CORRECT. </strong>This sentence should replace sentence 22 to conclude the passage because it lists specific reasons for volunteering (“Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress”) and best supports the main argument that volunteering not only helps students but can also help their community (“high school students who volunteer can help themselves as much as they help others”).</p>",
    "points": 1,
    "prompt": "Which concluding sentence should replace sentence 22 to provide the best support for the argument presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should replace sentence 22 to provide the <strong>best </strong>support for the argument presented in the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>In every city, there are homeless shelters, food pantries, youth centers, and political campaigns that depend on the support and commitment of hardworking young people.</p>",
        "text": "In every city, there are homeless shelters, food pantries, youth centers, and political campaigns that depend on the support and commitment of hardworking young people."
      },
      {
        "id": "B",
        "html": "<p>Clearly, students who volunteer will experience a host of benefits, such as learning new skills, meeting interesting people, opening up opportunities for the future, and gaining a sense of satisfaction.</p>",
        "text": "Clearly, students who volunteer will experience a host of benefits, such as learning new skills, meeting interesting people, opening up opportunities for the future, and gaining a sense of satisfaction."
      },
      {
        "id": "C",
        "html": "<p>When students carefully evaluate their activities and prioritize volunteerism, they find a way to work it into their schedule and are soon encouraging their peers to do the same.</p>",
        "text": "When students carefully evaluate their activities and prioritize volunteerism, they find a way to work it into their schedule and are soon encouraging their peers to do the same."
      },
      {
        "id": "D",
        "html": "<p>Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress, high school students who volunteer can help themselves as much as they help others.</p>",
        "text": "Whether they are seeking admission to college, preparing to enter the workforce, or simply looking to reduce stress, high school students who volunteer can help themselves as much as they help others."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const findTimeToVolunteer20242025FormBPassageSet: ExamPassageSet = {
  id: "ela-find-time-to-volunteer-2024-2025-form-b",
  versionLabels: ["2024-2025 Form B"],
  label: "2024-2025 Form B",
  section: "revising_editing_a",
  questionCount: findTimeToVolunteer20242025FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "find-time-to-volunteer-2024-2025-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "Find Time to Volunteer",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2024-2025-form-b","label":"2024-2025 Form B","year":"2024-2025","form":"B","packageId":"16802b072766789d59cac828b1edb8452a5b8f3de851a03854e00d40cab40365"},
    title: "Find Time to Volunteer",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) Many people believe that they gain a greater sense of purpose by giving their time to serve others. (2) These are the people who spend their free time volunteering at various places within the community. (3) Those who are served benefit from the work of these volunteers. (4) However, research shows that those who volunteer also receive benefits.</p><p>(5) For many students, this proposition may sound impossible. (6) Schoolwork can require hours of study each week. (7) Volunteering at a retirement center or homeless shelter requires both time and energy. (8) Extracurricular activities fill up after-school time. (9) Family obligations and part- time jobs often have to be worked into the schedule, too. (10) However, if students can find time to volunteer, even for a few hours a month, they may find that the benefits outweigh the scheduling difficulties.</p><p>(11) To begin with, students who engage in volunteer activities acquire valuable skills and experience, which can help them focus on potential fields of study and career options. (12) Furthermore, when students list volunteer work on college applications, admissions counselors see applicants who care about making their community and college campus a better place.</p><p>(13) Volunteerism benefits more than students applying to college. (14) This type of experience is equally important for students moving directly into the workforce after high school. (15) Volunteering demonstrates initiative, dedication, and a strong work ethic, qualities that companies value in a potential employee. (16) In a CareerBuilder study, 60 percent of managers regarded volunteerism as a significant asset when considering applicants.</p><p>(17) Students who volunteer undoubtedly make a positive investment in their future, but they also affect their present quality of life. (18) Studies have shown that volunteering is good for both the mind and the body. (19) Volunteering can boost mood levels and reduce anxiety. (20) According to the <span data-glossary-definition=\"a nonprofit medical organization dedicated to treatment and research\" role=\"link\" tabindex=\"0\">Mayo Clinic</span>, the feeling of doing something meaningful and the appreciation received from that action can reduce stress.</p><p>(21) Even the busiest of students can find a way to donate some time to a worthy cause. (22) Though managing different commitments may seem overwhelming at times, students are sure to feel a sense of fulfillment in volunteerism.</p>",
    text: findTimeToVolunteer20242025FormBPassageText,
    versionLabel: "2024-2025 Form B",
  }),
  questions: findTimeToVolunteer20242025FormBQuestions,
};
