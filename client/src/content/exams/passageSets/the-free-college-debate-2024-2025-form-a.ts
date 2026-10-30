import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const theFreeCollegeDebate20242025FormAPassageText = "(1) A college degree has become an essential tool in an increasingly competitive job market. (2) Yet the price of higher education, at both private and public universities, continues to rise. (3) Helping students cover the cost of attending college is an important issue.\n\n(4) Many people agree that a college education should be a financially realistic option for those who aspire to obtain a degree. (5) For example, in 2017, the New York State legislature passed a bill creating a program to cover the tuition costs for nearly one million students. (6) The state of Tennessee also has a program that offers all students scholarships and mentoring services if they attend one of the state’s community colleges. (7) Proponents generally believe that these programs are a step in the right direction for making college affordable for students who would have had to take out loans or who would have decided not to pursue higher education at all.\n\n(8) On the other hand, some people oppose bills like the ones in New York and Tennessee because they believe “free” college programs are unsustainable. (9) In order to implement these types of programs, a state pays the college on behalf of the students using funds from the state’s budget, which primarily comes from state taxes. (10) As more students choose to attend college, more funds will be needed to cover the costs. (11) Additionally, many students do not finish college within four years because they switch majors or because they have to work. (12) Critics believe that these circumstances will inevitably lead to an increase in taxes, a decline in the quality of the education offered by the schools, or both. (13) They think narrower college-affordability efforts that target the students who need the most support, such as first-generation college students, may be more effective and viable solutions.\n\n(14) Faculty and students at higher-education institutions can work to keep costs down. (15) In light of increased access to computers, mobile devices, and the Internet, there are more opportunities for students to take courses online, thus reducing the need for and cost of maintaining physical classrooms. (16) Additionally, colleges should account for experience by allowing students to demonstrate their knowledge in order to avoid having to pay to sit through classes on subjects they have already mastered. (17) Similarly, college-bound high school students need to be prepared for college-level work so that they do not have to spend money on remedial classes.\n\n(18) The solutions to the problems associated with rising college costs are not simple. (19) Passing legislation that boosts college affordability will take time, input from experts with different ideas, and careful planning.";

const theFreeCollegeDebate20242025FormAQuestions: ExamQuestion[] = [
  {
    "id": "the-free-college-debate-2024-2025-form-a-1",
    "explanation": "5.   The question asks which sentence should replace sentence 3 to best state the topic of the passage.\n\nA: Incorrect. Although this sentence mentions that “several states have implemented scholarship programs,” it does not clearly introduce the topic of the passage, which is differing opinions about and approaches to solving the problem of the cost of college.\n\nB: Correct. This sentence best replaces sentence 3 because it clearly states the topic of “determining the most effective way to make college affordable.” It also provides an introduction to the “differing opinions” of proponents, who believe that states should provide low-cost or free tuition, and opponents, who believe that such state programs are “unsustainable” (sentence 8).\n\nC: Incorrect. This sentence mentions the role of higher-education institutions in helping “reduce the cost of a college education” for students, which is a idea discussed in sentences 14 and 15 in the passage. Although the sentence provides details to support the topic of the passage by referring to “ways to help students avoid paying for unnecessary classes and materials,” it does not state the topic, which is differing opinions about and approaches to solving the problem of the cost of college.\n\nD: Incorrect. Even though this sentence mentions “college affordability,” it is primarily focused on a problem that is related to, but different from, the issue discussed in the passage. The passage is concerned with “the price of higher education” (sentence 2), not how tuition rates “affect the quality of the education [students] receive.”",
    "points": 1,
    "prompt": "Which sentence should replace sentence 3 to best state the topic of the passage?",
    "promptHtml": "<p>Which sentence should replace sentence 3 to <strong>best </strong>state the topic of the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Several states have implemented scholarship programs that allow students to attend public universities and community colleges at a very low tuition rate or for free."
      },
      {
        "id": "B",
        "text": "Determining the most effective way to make college affordable is a complex issue, and there are differing opinions about how to approach the problem."
      },
      {
        "id": "C",
        "text": "Higher-education institutions should reduce the cost of a college education by finding ways to help students avoid paying for unnecessary classes and materials."
      },
      {
        "id": "D",
        "text": "The main concern related to the issue of college affordability is that helping students cover tuition could affect the quality of the education they receive."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2024-2025-form-a-2",
    "explanation": "6.   The question asks where the sentence should be added to best support the ideas in the second paragraph (sentences 4–7).\n\nE: Incorrect. Sentence 4 introduces the main idea of the second paragraph (making college “a financially realistic option for those who aspire to obtain a degree”) and should not be preceded by the added sentence, which focuses more narrowly on the specific ways that some states are implementing that idea.\n\nF: Correct. The added sentence provides a proposed solution to the issue stated in sentence 4, that “a college education should be a financially realistic option.” Sentence 5 is an example of the programs discussed in the added sentence.\n\nG: Incorrect. Sentences 5 and 6 offer examples of state governments providing “low-cost or free” tuition. The added sentence introduces this idea in the second paragraph and should come before these specific examples are provided as evidence.\n\nH: Incorrect. Sentence 6 provides an example of the state government of Tennessee providing “low-cost or free” tuition, and sentence 7 further explains the opinion of those in favor of such programs (“a step in the right direction for making college affordable”). However, the ideas in sentences 6 and 7 follow from and support the idea in the added sentence. Therefore, the added sentence should be placed before sentences 6 and 7, which help elaborate its idea.",
    "points": 1,
    "prompt": "Read this sentence.\n\nSome note that several states have made their community or state colleges low-cost or free for students with limited resources.\n\nWhere should the sentence be added to best support the ideas in the second paragraph (sentences 4–7)?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\">Some note that several states have made their community or state colleges low-cost or free for students with limited resources.</blockquote><p>Where should the sentence be added to <strong>best</strong> support the ideas in the second paragraph (sentences 4–7)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "at the beginning of the paragraph (before sentence 4)"
      },
      {
        "id": "B",
        "text": "between sentences 4 and 5"
      },
      {
        "id": "C",
        "text": "between sentences 5 and 6"
      },
      {
        "id": "D",
        "text": "between sentences 6 and 7"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2024-2025-form-a-3",
    "explanation": "7.   The question asks which sentence presents information that shifts away from the topic of the third paragraph (sentences 8–13) and should be deleted.\n\nA: Incorrect. Sentence 9 explains that scholarship funding comes “from the state’s budget, which primarily comes from state taxes.” Sentence 10 logically follows the idea in sentence 9 by explaining that “as more students choose to attend college, more funds will be needed to cover the costs.” Therefore, sentence 10 should not be deleted, because it does not shift away from the topic of the paragraph.\n\nB: Correct. Sentence 10 makes the claim that “as more students choose to attend college, more funds will be needed to cover the costs.” Sentence 11 shifts away from this topic by focusing on how switching majors or working affects students’ ability to finish college, rather than on the additional funds that will be needed for scholarship programs. Therefore, sentence 11 should be deleted.\n\nC: Incorrect. Sentence 9 states that scholarship program funding comes “from the state’s budget, which primarily comes from state taxes.” Sentence 10 points out that “as more students choose to attend college, more funds will be needed to cover the costs.” Sentence 12 elaborates on the critics’ opinions discussed in sentences 8–10. It reflects the belief that the “circumstances” described in sentences 9 and 10 “will inevitably lead to an increase in taxes, a decline in the quality of the education offered by the schools, or both.” Thus, sentence 12 should not be deleted, because it does not shift away from the topic of the paragraph.\n\nD: Incorrect. Sentence 13 refers back to the “critics” mentioned in sentence 12 and expands on the critics’ concern about increased taxes mentioned in sentence 12 by stating that “narrower college-affordability efforts... may be more effective and viable solutions.” Therefore, sentence 13 should not be deleted because it logically follows the ideas in sentence 12 and serves as a concluding sentence for the paragraph.",
    "points": 1,
    "prompt": "Which sentence presents information that shifts away from the topic of the third paragraph (sentences 8–13) and should be deleted?",
    "promptHtml": "<p>Which sentence presents information that shifts away from the topic of the third paragraph (sentences 8–13) and should be deleted?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "sentence 10"
      },
      {
        "id": "B",
        "text": "sentence 11"
      },
      {
        "id": "C",
        "text": "sentence 12"
      },
      {
        "id": "D",
        "text": "sentence 13"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2024-2025-form-a-4",
    "explanation": "8.   The question asks which phrase should be added before sentence 14 to best transition to the ideas in the fourth paragraph (sentences 14–17).\n\nE: Incorrect. Sentence 13 summarizes the viewpoint of opponents, who believe that targeted approaches to funding education “may be more effective and viable solutions,” and sentence 14 serves to introduce how “faculty and students at higher-education institutions can work to keep costs down.” Affordability is “a complicated issue,” but the use of the word “Because” suggests that the ideas that follow in sentences 14–17 will explain a cause-and-effect relationship. However, sentences 14–17 discuss ways faculty and students should work together to keep the cost of college down while waiting for a long-term solution to the problem, not a causal relationship.\n\nF: Incorrect. Sentences 4–13 provide information about the viewpoint of proponents, who believe that “a college education should be a financially realistic option for those who aspire to obtain a degree” (sentence 4), and opponents, who believe free college programs are “unsustainable” (sentence 8). Although the phrase in this option mentions “opinions,” it indicates that the fourth paragraph will discuss why the number of opinions makes affordability a debatable issue. Instead, the fourth paragraph discusses ways faculty and students can help keep costs down until a solution is reached.\n\nG: Correct. Sentence 13 summarizes the viewpoint of opponents, who believe that targeted approaches to funding education “may be more effective and viable solutions,” while proponents “generally believe that these [government] programs are a step in the right direction for making college affordable” (sentence 7). However, sentences 14–17 offer three possible solutions that could alleviate the problem in the meantime. Therefore, the phrase in this option should be added before sentence 14 to best transition to the ideas in the fourth paragraph because it suggests that until the issue of affordability is resolved, alternatives are available to help make a college education more affordable.\n\nH: Incorrect. This phrase mentions “college affordability,” a topic discussed in the fourth paragraph. However, the ideas introduced in the phrase do not logically lead into the ideas discussed in sentences 14–17, because the phrase mentions “programs [that] have been successful,” whereas the paragraph states that “faculty and students at higher-education institutions can work to keep costs down” (sentence 14) and that colleges “should account for experience by allowing students to demonstrate their knowledge in order to avoid having to pay to sit through classes on subjects they have already mastered” (sentence 16). Use of the words “can” and “should” in these sentences indicates that the actions or programs mentioned in the paragraph have not been completed.",
    "points": 1,
    "prompt": "Which phrase should be added before sentence 14 to best transition to the ideas in the fourth paragraph (sentences 14–17)?",
    "promptHtml": "<p>Which phrase should be added before sentence 14 to best transition to the ideas in the fourth paragraph (sentences 14–17)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Because college affordability is a complicated issue,"
      },
      {
        "id": "B",
        "text": "With so many opinions about how to make college affordable,"
      },
      {
        "id": "C",
        "text": "Until college becomes more affordable,"
      },
      {
        "id": "D",
        "text": "Although some college affordability programs have been successful,"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "the-free-college-debate-2024-2025-form-a-5",
    "explanation": "9.   The question asks which concluding sentence should be added after sentence 19 to support the topic of the passage.\n\nA: Incorrect. Although sentence 15 cites “increased access to computers, mobile devices, and the Internet” and states that “there are more opportunities for students to take courses online, thus reducing the need for and cost of maintaining physical classrooms,” the primary topic discussed throughout the passage is that state and federal governments, not faculty and students, must resolve the issue of college affordability. Therefore, the sentence should not be added after sentence 19, because it does not support the topic.\n\nB: Incorrect. Sentence 5 presents the example of the New York State legislature, which “passed a bill creating a program to cover the tuition costs for nearly one million students.” Sentence 12 states that critics of this type of program believe that certain circumstances “will inevitably lead to an increase in taxes” or other issues such as low-quality education. However, the idea that these types of programs may lead to new problems is not thoroughly discussed in the passage. Therefore, the sentence should not be added after sentence 19, because it does not support the topic.\n\nC: Incorrect. Although sentence 7 states that scholarship programs are helpful “for students who would have had to take out loans or who would have decided not to pursue higher education at all,” the passage does not state that many students will stop pursuing higher education until the affordability issues are solved. In fact, sentence 14 states that there are ways faculty and students can “work to keep costs down.” Therefore, the sentence should not be added after sentence 19, because it does not support the topic.\n\nD: Correct. The sentence in this option should be added after sentence 19 to support the topic because it acknowledges that the issue of college affordability discussed throughout the passage is not “resolved” but that when it is, students will be able to make decisions about attending college without concerns about cost. Sentence 18 states that “the solutions to the problems associated with rising college costs are not simple,” and sentence 19 adds that “passing legislation that boosts college affordability will take time,” ideas, and planning.",
    "points": 1,
    "prompt": "Which concluding sentence should be added after sentence 19 to support the topic of the passage?",
    "promptHtml": "<p>Which concluding sentence should be added after sentence 19 to support the topic of the passage?</p>",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "The increasing use of technology in college classrooms and the financial support from tuition scholarship programs will make colleges more affordable for many students."
      },
      {
        "id": "B",
        "text": "Statewide tuition scholarship programs will make college more affordable for many students, but these programs may lead to new problems."
      },
      {
        "id": "C",
        "text": "Until the problems associated with the rising cost of college are solved, many students will pursue other options after graduating high school."
      },
      {
        "id": "D",
        "text": "When the issue of college affordability is resolved, students will be able to make decisions about pursuing higher education without cost being the deciding factor."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const theFreeCollegeDebate20242025FormAPassageSet: ExamPassageSet = {
  id: "ela-the-free-college-debate-2024-2025-form-a",
  section: "revising_editing_a",
  questionCount: theFreeCollegeDebate20242025FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "the-free-college-debate-2024-2025-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    title: "The Free College Debate",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">(1) A college degree has become an essential tool in an increasingly competitive job market. (2) Yet the price of higher education, at both private and public universities, continues to rise. (3) Helping students cover the cost of attending college is an important issue.</p><p data-numbered=\"false\">(4) Many people agree that a college education should be a financially realistic option for those who aspire to obtain a degree. (5) For example, in 2017, the New York State legislature passed a bill creating a program to cover the tuition costs for nearly one million students. (6) The state of Tennessee also has a program that offers all students scholarships and mentoring services if they attend one of the state’s community colleges. (7) Proponents generally believe that these programs are a step in the right direction for making college affordable for students who would have had to take out loans or who would have decided not to pursue higher education at all.</p><p data-numbered=\"false\">(8) On the other hand, some people oppose bills like the ones in New York and Tennessee because they believe “free” college programs are unsustainable. (9) In order to implement these types of programs, a state pays the college on behalf of the students using funds from the state’s budget, which primarily comes from state taxes. (10) As more students choose to attend college, more funds will be needed to cover the costs. (11) Additionally, many students do not finish college within four years because they switch majors or because they have to work. (12) Critics believe that these circumstances will inevitably lead to an increase in taxes, a decline in the quality of the education offered by the schools, or both. (13) They think narrower college-affordability efforts that target the students who need the most support, such as first-generation college students, may be more effective and viable solutions.</p><p data-numbered=\"false\">(14) Faculty and students at higher-education institutions can work to keep costs down. (15) In light of increased access to computers, mobile devices, and the Internet, there are more opportunities for students to take courses online, thus reducing the need for and cost of maintaining physical classrooms. (16) Additionally, colleges should account for experience by allowing students to demonstrate their knowledge in order to avoid having to pay to sit through classes on subjects they have already mastered. (17) Similarly, college-bound high school students need to be prepared for college-level work so that they do not have to spend money on remedial classes.</p><p data-numbered=\"false\">(18) The solutions to the problems associated with rising college costs are not simple. (19) Passing legislation that boosts college affordability will take time, input from experts with different ideas, and careful planning.</p>",
    text: theFreeCollegeDebate20242025FormAPassageText,
    versionLabel: "2024-2025 Form A",
  }),
  questions: theFreeCollegeDebate20242025FormAQuestions,
};
