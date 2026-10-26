import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const crackingTheCode20222023FormAPassageText = "(1) Computer code is part of every electronic interaction, from video games to home thermostats to vehicle GPS systems. (2) Code is a language that computers can interpret, and programmers use it to instruct computers to perform different tasks, such as finding, sorting, or calculating data. (3) People who code have to learn this language. (4) They can construct programs that will perform detailed tasks. (5) The programs can also perform complex tasks.\n\n(6) A coding language uses letters, numbers, and symbols that are arranged in a way that makes sense to a computer. (7) The code that makes up a program tells a computer how to process information. (8) Studying a coding language involves learning the rules for combining phrases and instructions so that they are recognizable to the computer. (9) Once a person understands coding rules, the possibilities for applying them are infinite.\n\n(10) Coding skills are becoming important in many occupational fields. (11) For example, code can be used to create programs to track, analyze, and predict changes in the stock market. (12) Code can also be designed to help doctors track and monitor a patient’s health. (13) Jobs that require coding skills are typically higher paying, offering salaries that are up to as much as $22,000 a year more than jobs that do not require coding knowledge.\n\n(14) People have a variety of opportunities to learn how to code. (15) In some schools, young people can study computer science and coding just as they study foreign languages. (16) Computer science teachers can use websites and apps that employ games designed to help everyone understand how code works. (17) Even high school students who do not take computer science can learn coding by attending coding workshops and online classes or by watching tutorials online. (18) After studying the basics of coding, some students may become interested in learning how to create programs, such as games and apps.\n\n(19) The late Steve Jobs, a pioneer in computer technology, once said, “Everybody in this country should learn how to program a computer . . . because it teaches you how to think.” (20) Learning to code can seem challenging, but one does not need to become an expert programmer to reap the benefits of understanding this language.";

const crackingTheCode20222023FormAQuestions: ExamQuestion[] = [
  {
    "id": "cracking-the-code-2022-2023-form-a-1",
    "explanation": "The question asks for the best way to combine sentences 3 through 5 to clarify the relationship between ideas.\n\nA. Incorrect. While this sentence shows a relationship between the ideas, it does not clarify the relationship accurately. Learning the language of code does not depend on people’s previous ability to construct programs that will perform detailed and complex tasks. The word \"because\" incorrectly indicates that people can already construct complex programs prior to learning the coding language that would allow them to do so.\n\nB. CORRECT. This sentence accurately shows the relationship between the ideas of the sentences. Before people can construct programs that will perform detailed and complex tasks, they have to learn a coding language. Knowing that language will, in turn, allow them to build programs that can perform detailed and complex tasks.\n\nC. Incorrect. This sentence does not accurately express the relationship between ideas because the sentence implies that some people who code do not have to learn the language to perform their job functions. The passage clearly states that “computer code is part of every electronic interaction” (sentence 1) and that “programmers use it to instruct computers to perform different tasks” (sentence 2).\n\nD. Incorrect. The conditional (If . . . then) construction of the sentence in Option D does not convey the intended relationship of the ideas in the sentences. The “then” statement (“they can construct programs that will perform detailed as well as complex tasks”) does not follow the condition of the “if” statement (“people who code have to learn this language”).",
    "points": 1,
    "prompt": "What is the best way to combine sentences 3 through 5 to clarify the relationship between ideas?",
    "promptHtml": "What is the <strong>best</strong> way to combine sentences 3 through 5 to clarify the relationship between ideas?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "text": "People who code have to learn this language because they can construct programs that will perform detailed and complex tasks."
      },
      {
        "id": "B",
        "text": "People who code have to learn this language so they can construct programs that will perform detailed or complex tasks."
      },
      {
        "id": "C",
        "text": "When people who code have to learn this language, it is so they can construct programs that will perform detailed and complex tasks."
      },
      {
        "id": "D",
        "text": "If people who code have to learn this language, then they can construct programs that will perform detailed as well as complex tasks."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "cracking-the-code-2022-2023-form-a-2",
    "explanation": "The question asks for the sentence that should follow sentence 5 to best state the main claim in the passage.\n\nA. CORRECT. This sentence logically follows sentence 5 and introduces the main idea of the passage: that due to the high demand for coding skills across a wide range of industries and disciplines, learning basic coding skills can provide a range of opportunities for personal growth.\n\nB. Incorrect. While this sentence incorporates a point made in the passage about how coding can benefit many occupational fields (sentence 10), this idea alone does not address the entire argument in the passage. This sentence does not capture the passage’s emphasis on the variety of ways people can learn how to code (sentence 14).\n\nC. Incorrect. While this sentence incorporates ideas about opportunities to learn coding skills in school (fourth paragraph), the larger claim presented in the passage is not about opportunities schools should offer in order to help students learn to code. The passage primarily focuses on the opportunities offered to people who take on the challenge of learning to code.\n\nD. Incorrect. Although the passage discusses the opportunities that are available to some students to learn coding skills in school (sentences 15-16), this point is a supporting detail of the passage, not the main claim of the passage.",
    "points": 1,
    "prompt": "Which sentence should follow sentence 5 to best state the main claim in the passage?",
    "promptHtml": "Which sentence should follow sentence 5 to <strong>best</strong> state the main claim in the passage?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "People should take advantage of opportunities to study and learn basic coding because of its many valuable benefits."
      },
      {
        "id": "B",
        "text": "People should attempt to understand how code can be used to design programs that are beneficial for a variety of industries and businesses."
      },
      {
        "id": "C",
        "text": "Schools should offer coding classes because knowing how to code will help students succeed in many types of businesses."
      },
      {
        "id": "D",
        "text": "Students should prepare for the future job market by studying code and learning how to code programs."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "cracking-the-code-2022-2023-form-a-3",
    "explanation": "The question asks for the best revision of sentence 10 to provide a transition to the argument in the third paragraph.\n\nA. Incorrect. Some readers may choose this option because the second paragraph does discuss the complexities of coding; however, it does not discuss the difficulties of learning coding. The third paragraph demonstrates some of the complex ways coding is used in specific fields but does not illustrate how difficult learning coding may be.\n\nB. CORRECT. This sentence provides the best revision of the transition sentence. The second paragraph ends with “the possibilities for applying them are infinite” (sentence 9), which supports the idea that people in “many occupational fields” (sentence 10) can benefit from having coding skills. The third paragraph illustrates this idea by providing specific examples of occupations that benefit from coding (stock market traders and doctors).\n\nC. Incorrect. While sentence 13 suggests that employers recognize the value of coding skills, sentences 11 and 12 give examples of different industries that employ people who know how to code. The transition sentence should introduce the idea that coding skills are valuable to potential employees.\n\nD. Incorrect. Some readers may choose this option because the second paragraph provides a brief definition of coding—“A coding language uses letters, numbers, and symbols that are arranged in a way that makes sense to a computer” (sentence 6)—which shows how this element of programming works, but the second paragraph does not specifically discuss what makes the field of computer programming unique. The third paragraph discusses how coding can be used in a variety of occupational fields (sentence 10).",
    "points": 1,
    "prompt": "Which revision of sentence 10 provides the best transition to the argument in the third paragraph (sentences 10–13)?",
    "promptHtml": "Which revision of sentence 10 provides the <strong>best</strong> transition to the argument in the third paragraph (sentences 10–13)?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Learning a coding language may be difficult, but coding skills are becoming important in many occupational fields."
      },
      {
        "id": "B",
        "text": "Learning a coding language is useful because coding skills are becoming important in many occupational fields."
      },
      {
        "id": "C",
        "text": "Employers in most industries realize that people with coding skills can demand higher salaries in many occupational fields."
      },
      {
        "id": "D",
        "text": "Even though programming is its own unique field, coding skills are becoming important in many occupational fields."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "cracking-the-code-2022-2023-form-a-4",
    "explanation": "The question asks which sentence would best follow sentence 13 and support the ideas in the third paragraph.\n\nA. Incorrect. While this sentence provides an example of a high salary, which is mentioned in the paragraph (sentence 13), the reference to “Experienced programmers, software engineers, and system administrators at large companies” focuses on specific occupations that may use coding, as opposed to the range of diverse occupations discussed in the third paragraph.\n\nB. Incorrect. While sentence 12 does mention coding skills in the medical field as an example, the information provided in this answer supports only that idea and not the other ideas expressed in the third paragraph.\n\nC. Incorrect. This sentence generally discusses employers looking for two things: “experience in a specific industry” and “knowledge of basic coding.” The third paragraph, however, discusses the possibilities of using coding skills in a variety of occupations. The words “experience in a specific industry” do not connect to the idea the paragraph develops.\n\nD. CORRECT. This sentence provides specific evidence of the job market favoring potential employees who have coding ability. It supports what is stated in sentence 13, that “jobs that require coding skills are typically higher paying.”",
    "points": 1,
    "prompt": "Which sentence would best follow sentence 13 and support the ideas in the third paragraph (sentences 10–13)?",
    "promptHtml": "Which sentence would <strong>best</strong> follow sentence 13 and support the ideas in the third paragraph (sentences 10–13)?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "Experienced programmers, software engineers, and system administrators at large companies can earn well over $100,000 a year."
      },
      {
        "id": "B",
        "text": "Hospitals, physicians’ offices, and pharmaceutical companies are frequently looking to hire people who code to help with a variety of tasks."
      },
      {
        "id": "C",
        "text": "Many companies are eager to hire employees who have experience in a specific industry as well as knowledge of basic coding."
      },
      {
        "id": "D",
        "text": "According to a report from a job market analytics firm, almost half of today’s jobs paying more than $58,000 a year call for some level of coding ability."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "cracking-the-code-2022-2023-form-a-5",
    "explanation": "The question asks which concluding sentence would best follow sentence 20 and support the argument presented in the passage.\n\nA. Incorrect. While the passage does state that “jobs that require coding skills are typically higher paying” (sentence 13), it does not say or imply that coding skills are needed for most high-paying jobs.\n\nB. CORRECT. The sentence successfully summarizes the main argument of the passage, which is that coding is involved in all electronic interaction (sentence 1) and is a useful skill to master, especially in many occupational fields (sentence 10).\n\nC. Incorrect. In the fourth paragraph, the passage does promote students taking advantage of opportunities to learn coding; however, this information is a supporting detail and would not serve as a strong conclusion to the argument presented in the passage.\n\nD. Incorrect. Some readers may choose this sentence because the fourth paragraph discusses how “some students may become interested in learning how to create programs, such as games and apps” (sentence 18), but this detail is only one part of the overall argument in the passage.",
    "points": 1,
    "prompt": "Which concluding sentence would best follow sentence 20 and support the argument presented in the passage?",
    "promptHtml": "Which concluding sentence would <strong>best</strong> follow sentence 20 and support the argument presented in the passage?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "People should understand that knowing how to code is becoming an essential requirement for most high-paying jobs."
      },
      {
        "id": "B",
        "text": "By understanding basic coding concepts, people can participate in an increasingly digital job market."
      },
      {
        "id": "C",
        "text": "Students who want to secure a high-paying job in the technology industry should become proficient in coding."
      },
      {
        "id": "D",
        "text": "Since coding is a valuable marketplace skill, today’s students should begin to write their own computer programs."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const crackingTheCode20222023FormAPassageSet: ExamPassageSet = {
  id: "ela-cracking-the-code-2022-2023-form-a",
  section: "revising_editing_a",
  questionCount: crackingTheCode20222023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "cracking-the-code-2022-2023-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    title: "Cracking the Code",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">(1) Computer code is part of every electronic interaction, from video games to home thermostats to vehicle GPS systems. (2) Code is a language that computers can interpret, and programmers use it to instruct computers to perform different tasks, such as finding, sorting, or calculating data. (3) People who code have to learn this language. (4) They can construct programs that will perform detailed tasks. (5) The programs can also perform complex tasks.</p><p data-numbered=\"false\">(6) A coding language uses letters, numbers, and symbols that are arranged in a way that makes sense to a computer. (7) The code that makes up a program tells a computer how to process information. (8) Studying a coding language involves learning the rules for combining phrases and instructions so that they are recognizable to the computer. (9) Once a person understands coding rules, the possibilities for applying them are infinite.</p><p data-numbered=\"false\">(10) Coding skills are becoming important in many occupational fields. (11) For example, code can be used to create programs to track, analyze, and predict changes in the stock market. (12) Code can also be designed to help doctors track and monitor a patient’s health. (13) Jobs that require coding skills are typically higher paying, offering salaries that are up to as much as $22,000 a year more than jobs that do not require coding knowledge.</p><p data-numbered=\"false\">(14) People have a variety of opportunities to learn how to code. (15) In some schools, young people can study computer science and coding just as they study foreign languages. (16) Computer science teachers can use websites and apps that employ games designed to help everyone understand how code works. (17) Even high school students who do not take computer science can learn coding by attending coding workshops and online classes or by watching tutorials online. (18) After studying the basics of coding, some students may become interested in learning how to create programs, such as games and apps.</p><p data-numbered=\"false\">(19) The late Steve Jobs, a pioneer in computer technology, once said, “Everybody in this country should learn how to program a computer . . . because it teaches you how to think.” (20) Learning to code can seem challenging, but one does not need to become an expert programmer to reap the benefits of understanding this language.</p>",
    text: crackingTheCode20222023FormAPassageText,
    versionLabel: "2022-2023 Form A",
  }),
  questions: crackingTheCode20222023FormAQuestions,
};
