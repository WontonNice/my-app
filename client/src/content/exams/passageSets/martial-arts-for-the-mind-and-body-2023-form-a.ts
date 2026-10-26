import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const martialArtsForTheMindAndBody2023FormAPassageText = "(1) The martial arts blend a series of physical movements with strategic mental discipline so that practitioners can defend themselves, physically defeat an opponent, or both. (2) Historians are unsure of exactly when and where martial arts were first used. (3) Martial arts have been practiced by several different societies for many centuries. (4) Martial arts such as karate, kung fu, tae kwon do, and judo are still taught and practiced as methods of self-defense, but they offer students more than that. (5) The study of martial arts can provide students with a way to enhance their mental discipline as well as their physical fitness.\n\n(6) Discipline, focus, and respect are important qualities for everyone to have. (7) However, for most people these qualities are not innate; they must be learned and practiced. (8) The study of martial arts can provide an opportunity to develop these skills. (9) Students are rewarded for their dedication by passing tests and advancing to higher ranks or levels. (10) For example, in a typical tae kwon do class, students learn discipline by diligently practicing moves, improve focus by listening carefully, and demonstrate respect by bowing to the instructor and following directions.\n\n(11) For teenagers, martial arts classes provide a safe and structured environment for gaining physical skills, building confidence, and enjoying a sense of community. (12) A lot of teens go through hard situations as they try to do well in school and in life. (13) A martial arts class can provide teens with a physical outlet for stress while also challenging them mentally. (14) Participating in a martial arts program also helps children and teens focus on self-improvement rather than on competition. (15) Progressing through levels of achievement involves mastering more physically demanding techniques. (16) It requires students to take responsibility and be accountable for achieving set goals. (17) Students gain confidence and experience companionship with other students who are progressing through the ranks.\n\n(18) Adults who practice martial arts can experience many of the same benefits that younger people do, but perhaps the greatest of these is health and fitness. (19) Adult martial arts students often see changes in their body within weeks of beginning a program.\n\n(20) For people interested in studying a martial art, there are many ways to learn and practice. (21) In addition to private studios, community recreation centers often offer low-cost or free martial arts classes. (22) There are even online videos that introduce students to the basic concepts. (23) People should study martial arts.";

const martialArtsForTheMindAndBody2023FormAQuestions: ExamQuestion[] = [
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q11",
    "explanation": "The question asks for the best way to combine sentences 2 and 3.\n\nA. Incorrect. This way of combining sentences 2 and 3 places unnecessary emphasis on characterizing historians, and it does not clearly show the contrasting relationship between the idea from sentence 2 that historians do not know the exact origins of martial arts and the idea in sentence 3 that historians know that martial arts have a long history.\n\nB. CORRECT. This option is correct because the word “while” at the beginning of the sentence best indicates the contrast between the ideas in sentences 2 and 3. Sentence 2 states that historians do not know the exact origins of martial arts (“unsure of exactly when and where”). Sentence 3 describes what historians do know about these origins (“practiced by several different societies for many centuries”). This combination indicates that historians have a general understanding about the origins of martial arts even though they cannot confirm the exact details.\n\nC. Incorrect. Starting this sentence with the word “because” indicates a cause-and-effect relationship that does not exist between the ideas in the original sentences. The idea from sentence 3, that historians know that martial arts have been practiced for many years, did not cause the idea in sentence 2, that historians do not know exact details about the origins of martial arts.\n\nD. Incorrect. The conjunction (connecting word) “and” does not clearly show how the ideas in sentences 2 and 3 are related. While “and” can be used to combine related sentences, it does not demonstrate the contrast between the idea in sentence 2, that historians do not know the exact origins of martial arts, and the idea in sentence 3, that historians know that martial arts have a long history.",
    "points": 1,
    "prompt": "What is the best way to combine sentences 2 and 3?",
    "promptHtml": "What is the <strong>best</strong> way to combine sentences 2 and 3?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "text": "Historians, who are unsure of exactly when and where martial arts were first used, know that martial arts have been practiced by several different societies for many centuries."
      },
      {
        "id": "B",
        "text": "While historians are unsure of exactly when and where martial arts were first used, they do know that martial arts have been practiced by several different societies for many centuries."
      },
      {
        "id": "C",
        "text": "Because historians know that martial arts have been practiced by several different societies for many centuries, they are unsure of exactly when and where martial arts were first used."
      },
      {
        "id": "D",
        "text": "Martial arts have been practiced by several different societies for many centuries, and historians are unsure of exactly when and where martial arts were first used."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q12",
    "explanation": "The question asks where sentence 10 should be moved to improve the organization of the second paragraph.\n\nA. Incorrect. Starting this paragraph with sentence 10 would weaken the paragraph’s organization because it would place a supporting detail sentence (sentence 10) before the topic sentence (sentence 6). Sentence 6 belongs at the beginning of the paragraph because it introduces the topic—the qualities of discipline, focus, and respect. Sentence 10 supports the key idea of the paragraph, that these qualities can be developed through the study of martial arts. If sentence 10 preceded sentence 6, the transitional phrase “for example” would refer to an unspecified topic and idea.\n\nB. Incorrect. Sentence 6 presents the idea that “discipline, focus, and respect are important qualities for everyone to have,” but the example in sentence 10 does not directly relate to this idea. Sentence 10 explains how martial arts develop these qualities, not why they are important qualities to have. Because sentence 10 is not directly related to the idea in sentence 6 (the qualities are important), it should not follow sentence 6.\n\nC. Incorrect. Sentences 7 and 8 should not be separated, because the idea presented in sentence 8—that “the study of martial arts can provide an opportunity to develop these skills”—is directly related to the idea from sentence 7—that the skills of discipline, focus, and respect “are not innate; they must be learned and practiced.” Sentence 10 supports the idea from sentence 8 by describing an example from a typical martial arts class, so sentence 10 should not precede sentence 8.\n\nD. CORRECT. This option is correct because sentence 10 logically follows and supports the idea in sentence 8 that “the study of martial arts can provide an opportunity to develop” the qualities of discipline, focus, and respect. Sentence 10 explains this idea with examples, describing three specific ways that students in a typical tae kwon do class develop discipline, focus, and respect—by “diligently practicing,” “listening carefully,” and “bowing to the instructor and following directions.”",
    "points": 1,
    "prompt": "Where should sentence 10 be moved to improve the organization of the second paragraph (sentences 6–10)?",
    "promptHtml": "Where should sentence 10 be moved to improve the organization of the second paragraph (sentences 6–10)?",
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
        "text": "between sentences 7 and 8"
      },
      {
        "id": "D",
        "text": "between sentences 8 and 9"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q13",
    "explanation": "The question asks for the revision of sentence 12 that best maintains the formal style established in the passage.\n\nA. Incorrect. The phrases “A lot,” “put up with,” “difficult things,” and “do well in school” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage.\n\nB. Incorrect. The phrases “deal with,” “tough situations,” “stay on top of,” and “do well in life” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage.\n\nC. CORRECT. This option is correct because it uses clear and scholarly wording throughout the whole sentence. The phrases “many teenagers,” “encounter challenges,” and “succeed both academically and personally” make the sentence’s style more consistently formal than the other options.\n\nD. Incorrect. The phrases “A lot,” “face problems,” and “keep up with” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage.",
    "points": 1,
    "prompt": "Which revision of sentence 12 best maintains the formal style established in the passage?",
    "promptHtml": "Which revision of sentence 12 <strong>best</strong> maintains the formal style established in the passage?",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "text": "A lot of teens have to put up with difficult things while trying to do well in school and in life."
      },
      {
        "id": "B",
        "text": "Many teenagers deal with tough situations as they try to stay on top of their studies and do well in life."
      },
      {
        "id": "C",
        "text": "Many teenagers encounter challenges as they work to succeed both academically and personally."
      },
      {
        "id": "D",
        "text": "A lot of teens face problems as they work to keep up with their schoolwork and find personal success."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q14",
    "explanation": "The question asks for the transitional phrase that should be added to the beginning of sentence 17.\n\nA. CORRECT. This option is correct because it best shows the chronological progression between the ideas in sentence 16—progressing through levels of achievement “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks.” The transitional phrase “over time” shows the gradual nature of the relationship between the cause in sentence 16 and the effect in sentence 17.\n\nB. Incorrect. Though the ideas in sentences 16 and 17 are related, “in fact” does not show the correct relationship between the ideas. The transitional phrase “in fact” emphasizes an idea by giving a detail or example of greater intensity, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks”—are related by cause and effect rather than by (degree of) intensity.\n\nC. Incorrect. The transitional phrase “even so” is used to connect opposing ideas, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—does not contrast with the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks.”\n\nD. Incorrect. Although the transitional phrase “for instance” connects an idea with a related example, it does not show the cause-and-effect relationship between the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks.”",
    "points": 1,
    "prompt": "Which transitional phrase should be added to the beginning of sentence 17?",
    "promptHtml": "Which transitional phrase should be added to the beginning of sentence 17?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "text": "Over time,"
      },
      {
        "id": "B",
        "text": "In fact,"
      },
      {
        "id": "C",
        "text": "Even so,"
      },
      {
        "id": "D",
        "text": "For instance,"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q15",
    "explanation": "The question asks for the sentence that would best follow and support sentence 18.\n\nA. Incorrect. Though the idea of advancing one’s career is certainly appealing for adults, this benefit is not directly tied to “health and fitness” and, therefore, does not support sentence 18.\n\nB. Incorrect. While the passage does discuss potential benefits related to discipline, focus, and confidence (sentences 6 and 11), sentence 18 is solely related to health and fitness benefits and should not be followed by a description of “other skills.”\n\nC. CORRECT. This option is correct because sentence 18 conveys that the greatest benefit of practicing martial arts is “health and fitness,” and the sentence illustrates some specific ways that martial arts training helps improve physical fitness—“strengthen their heart, boost endurance, improve balance, and develop muscle tone.”\n\nD. Incorrect. Some readers may choose this option because sentence 5, sentence 15, and sentence 18 discuss the physical aspects of practicing martial arts, but the idea that people who practice martial arts are concerned about their overall health does not provide further details about the connection between training and health.",
    "points": 1,
    "prompt": "Which sentence would best follow and support sentence 18?",
    "promptHtml": "Which sentence would <strong>best</strong> follow and support sentence 18?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "Adult students gain discipline, focus, self-control, and respect, which are qualities that help them advance in their careers."
      },
      {
        "id": "B",
        "text": "Many adults initially train in a martial art simply to get exercise without realizing that the training also helps develop other skills."
      },
      {
        "id": "C",
        "text": "The exercise involved in training helps people strengthen their heart, boost endurance, improve balance, and develop muscle tone."
      },
      {
        "id": "D",
        "text": "People who commit to training in the martial arts are usually concerned about improving their overall physical health."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2023-form-a-2023-form-a-q16",
    "explanation": "The question asks for the concluding sentence that best replaces sentence 23 and supports the topic presented in the passage.\n\nA. Incorrect. The phrase “the skills needed to progress in rank” is vague, and progressing in rank is not related to the overall topic of the passage, which is the benefits of studying martial arts. The topic of the passage is not the “many ways to begin studying martial arts” or how “people can easily discover” the benefits of martial arts.\n\nB. CORRECT. This option is correct because it best supports the topic of the passage—the benefits of studying martial arts—by stating two reasons why people should study martial arts: to “experience the satisfaction of achieving goals while also improving themselves.”\n\nC. Incorrect. Some readers may choose this option because it refers to the benefits of martial arts, but the word “because” and the detail that “enrollment in martial arts courses has increased” make this sentence unrelated to the overall topic of the passage, which is about the benefits of studying martial arts, not the number of people who participate.\n\nD. Incorrect. Although the benefits of studying martial arts are described for both teens (in the third paragraph) and adults (in the fourth paragraph), the topic of the passage is the overall benefits of studying martial arts, which include mental discipline (discussed in the first, second, and third paragraphs) in addition to health benefits. Furthermore, the passage does not compare the health effects of studying martial arts across age groups.",
    "points": 1,
    "prompt": "Which concluding sentence should replace sentence 23 to best support the topic presented in the passage?",
    "promptHtml": "Which concluding sentence should replace sentence 23 to <strong>best</strong> support the topic presented in the passage?",
    "topic": "Relevance & Conclusion",
    "choices": [
      {
        "id": "A",
        "text": "With so many ways to begin studying martial arts, people can easily discover how the skills needed to progress in rank may help them in life."
      },
      {
        "id": "B",
        "text": "By taking advantage of opportunities to practice martial arts, people can experience the satisfaction of achieving goals while also improving themselves."
      },
      {
        "id": "C",
        "text": "Because people are eager to reap the mental and physical benefits of studying martial arts, enrollment in martial arts courses has increased."
      },
      {
        "id": "D",
        "text": "While taking martial arts classes can improve health for both young people and adults, the effects are clearly more immediate for adults."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const martialArtsForTheMindAndBody2023FormAPassageSet: ExamPassageSet = {
  id: "ela-martial-arts-for-the-mind-and-body-2023-form-a",
  section: "revising_editing_a",
  questionCount: martialArtsForTheMindAndBody2023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "martial-arts-for-the-mind-and-body-2023-form-a",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    title: "Martial Arts for the Mind and Body",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">(1) The martial arts blend a series of physical movements with strategic mental discipline so that practitioners can defend themselves, physically defeat an opponent, or both. (2) Historians are unsure of exactly when and where martial arts were first used. (3) Martial arts have been practiced by several different societies for many centuries. (4) Martial arts such as karate, kung fu, tae kwon do, and judo are still taught and practiced as methods of self-defense, but they offer students more than that. (5) The study of martial arts can provide students with a way to enhance their mental discipline as well as their physical fitness.</p><p data-numbered=\"false\">(6) Discipline, focus, and respect are important qualities for everyone to have. (7) However, for most people these qualities are not innate; they must be learned and practiced. (8) The study of martial arts can provide an opportunity to develop these skills. (9) Students are rewarded for their dedication by passing tests and advancing to higher ranks or levels. (10) For example, in a typical tae kwon do class, students learn discipline by diligently practicing moves, improve focus by listening carefully, and demonstrate respect by bowing to the instructor and following directions.</p><p data-numbered=\"false\">(11) For teenagers, martial arts classes provide a safe and structured environment for gaining physical skills, building confidence, and enjoying a sense of community. (12) A lot of teens go through hard situations as they try to do well in school and in life. (13) A martial arts class can provide teens with a physical outlet for stress while also challenging them mentally. (14) Participating in a martial arts program also helps children and teens focus on self-improvement rather than on competition. (15) Progressing through levels of achievement involves mastering more physically demanding techniques. (16) It requires students to take responsibility and be accountable for achieving set goals. (17) Students gain confidence and experience companionship with other students who are progressing through the ranks.</p><p data-numbered=\"false\">(18) Adults who practice martial arts can experience many of the same benefits that younger people do, but perhaps the greatest of these is health and fitness. (19) Adult martial arts students often see changes in their body within weeks of beginning a program.</p><p data-numbered=\"false\">(20) For people interested in studying a martial art, there are many ways to learn and practice. (21) In addition to private studios, community recreation centers often offer low-cost or free martial arts classes. (22) There are even online videos that introduce students to the basic concepts. (23) People should study martial arts.</p>",
    text: martialArtsForTheMindAndBody2023FormAPassageText,
    versionLabel: "2022-2023 Form A",
  }),
  questions: martialArtsForTheMindAndBody2023FormAQuestions,
};
