import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageText = "Many scientists suspect that exercise alters the biology of the brain in ways that make it more malleable and receptive to new information, a process that scientists refer to as plasticity.\n\nBut many questions have remained unanswered about movement and learning, including whether exercise is most beneficial before, during or after instruction and how much and what types of exercise might be best.\n\nSo for a new study, which was published recently in PLOS One, researchers in China and Italy decided to home in on language learning and the adult brain.\n\nLanguage learning is interesting. As young children, almost all of us picked up our first language easily. We didn’t have to be formally taught; we simply absorbed words and concepts.\n\nBut by early adulthood, the brain generally begins to lose some of its innate language capability. It displays less plasticity in areas of the brain related to language. As a result, for most of us, it becomes harder to learn a second language after childhood.\n\nTo see what effects exercise might have on this process, the researchers first recruited 40 college-age Chinese men and women who were trying to learn English. The students had some facility with this second language but were far from proficient.\n\nThe researchers then divided the students into two groups. Those in one group would continue to learn English as they had before, primarily while seated in rote vocabulary-memorization sessions.\n\nThe others would supplement these sessions with exercise.\n\nSpecifically, the students would ride exercise bikes at a gentle pace (about 60 percent of their maximum aerobic capacity) beginning 20 minutes before the start of the lessons and continuing throughout the 15 minutes or so of instruction.\n\nBoth groups learned their new vocabulary by watching words projected onto large screens, together with comparable pictures, such as “apple” and a Red Delicious. They were shown 40 words per session, with the sequence repeated several times.\n\nAfterward, the students all rested briefly and then completed a vocabulary quiz, using computer keys to note as quickly as possible whether a word was with its correct picture. They also responded to sentences using the new words, marking whether the sentences were accurate or, in the case of “The apple is a dentist,” nonsensical. Most linguists1 feel that understanding sentences shows greater mastery of a new language than does simple vocabulary improvement.\n\nThe students completed eight vocabulary sessions over the course of two months.\n\nAnd at the endof each lesson, the students who had ridden bikes performed better on the subsequent vocabulary tests than did the students who sat still.\n\nThey also became more proficient at recognizing proper sentences than the sedentary students, although that difference did not emerge until after several weeks of instruction.\n\nPerhaps most interesting, the gains in vocabulary and comprehension lingered longest for the cyclists. When the researchers asked the students to return to the lab for a final round of testing a month after the lessons—without practicing in the meantime—the cyclists remembered words and understood them in sentences more accurately than did the students who had not moved.\n\n“The results suggest that physical activity during learning improves that learning,” says Simone Sulpizio, a professor of psychology and linguistics at the University Vita-Salute San Raffaele in Milan, Italy, and a study co-author.\n\nThese improvements extend beyond simply aiding in memorization, she added. The exercise also deepened language learners’ grasp of how to use their newly acquired words.\n\nThis study involved college students performing relatively light exercise, though, and cannot tell us whether other people completing other types of exercise would achieve the same results.\n\nIt also offers no clues about what is occurring inside the brain that might be contributing to the benefits of the exercise. But many past studies have shown that exercise prompts the release of multiple neurochemicals in the brain that increase the number of new brain cells and the connections between neurons, Dr. Sulpizio says. These effects improve the brain’s plasticity and augment the ability to learn.\n\nFrom a real-world standpoint, the study’s implications might seem at first to be impractical. Few classrooms are equipped with stationary bicycles. But specialized equipment is probably unnecessary, Dr. Sulpizio says.\n\n“We are not suggesting that schools or teachers buy lots of bicycles,” she says. “A simpler take-home message may be that instruction should be flanked by physical activity.”";

const excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q33",
    "explanation": "The question asks how the author’s use of comparison in paragraphs 4 and 5 contributes to the development of ideas in the excerpt.\n\nA. Incorrect. Paragraph 5 does not claim that adults are never able to learn a second language, only that “it becomes harder to learn a second language after childhood.”\n\nB. Incorrect. The issue of physical activity is never addressed in these paragraphs. They compare the relative ease with which children and adults learn languages.\n\nC. Incorrect. Paragraph 4 does not claim that more is known about language learning in children; in fact, it says that children simply absorb language easily and does not attempt to explain how.\n\nD. CORRECT. Because adult brains lose the “innate language capability” of children and have less plasticity when it comes to language learning, the study chose to focus on adults and how exercise might help them learn new languages.",
    "points": 1,
    "prompt": "How does the author’s use of comparison in paragraphs 4 and 5 contribute to the development of ideas in the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It identifies why many adults are never able to learn a second language."
      },
      {
        "id": "B",
        "text": "It demonstrates why the study of adult language learning tries to include physical activity."
      },
      {
        "id": "C",
        "text": "It highlights why more is known about language learning in children than about language learning in adults."
      },
      {
        "id": "D",
        "text": "It explains why adults were the subjects of the study rather than children."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q34",
    "explanation": "The question asks how the first sentence from paragraph 6 functions in the overall structure of the excerpt.\n\nA. Incorrect. While paragraph 6 begins to describe how the study was carried out, the results of the study have not yet been discussed in previous paragraphs.\n\nB. Incorrect. The population used for the study is an important detail that helps describe who participated in the study, as well as an ideal situation (college-age people trying to learn a new language), but this is not critical information used to determine the results.\n\nC. CORRECT. While paragraphs 4 and 5 address why the study focuses on adult language learning, the first sentence of paragraph 6 begins to give details about how the study was conducted, including describing the population being studied: “40 college-age Chinese men and women who were trying to learn English.”\n\nD. Incorrect. The sentence from paragraph 6 does not include examples or discuss questions for further research; it simply introduces the subjects recruited for the study.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 6.\n\nTo see what effects exercise might have on this process, the researchers first recruited 40 college-age Chinese men and women who were trying to learn English.\n\nWhich statement describes the function of the sentence in the overall structure of the excerpt?",
    "promptHtml": "<p>Read this sentence from paragraph 6.</p><blockquote><strong>To see what effects exercise might have on this process, the researchers first recruited 40 college-age Chinese men and women who were trying to learn English.</strong></blockquote><p>Which statement describes the function of the sentence in the overall structure of the excerpt?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It indicates a shift from describing the results of the study to describing the process."
      },
      {
        "id": "B",
        "text": "It introduces the aspect of the research that was most critical to determining the results."
      },
      {
        "id": "C",
        "text": "It marks the change from explaining why the study was conducted to explaining how the study was conducted."
      },
      {
        "id": "D",
        "text": "It shows how questions were raised that could be addressed in further research."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q35",
    "explanation": "The question asks why the researchers in the excerpt asked the English learners to assess whether the new words made sense in the context of actual sentences.\n\nA. CORRECT. As stated in paragraph 11, “Most linguists feel that understanding sentences shows greater mastery of a new language” than mere memorization of new words, so the researchers realized that asking learners to assess words in context would be a better measure of how well they learned the new words.\n\nB. Incorrect. The excerpt never addresses how earlier research on adult language learners was conducted.\n\nC. Incorrect. Having learners respond to the new words in context was used not as a teaching tool but rather to assess learners’ mastery (paragraph 11).\n\nD. Incorrect. The excerpt describes how proficiency at assessing words in context began to emerge “after several weeks of instruction” (paragraph 14) and never suggests that the task became more difficult after an extended period of time.",
    "points": 1,
    "prompt": "In the study described in the excerpt, researchers asked English learners to assess the sense of words in context because that task is",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "better at determining the capability learners have of language than simple vocabulary recall."
      },
      {
        "id": "B",
        "text": "consistent with the way earlier research was conducted on adult language learners."
      },
      {
        "id": "C",
        "text": "a better way for learners to absorb the meaning of individual vocabulary words."
      },
      {
        "id": "D",
        "text": "more difficult for learners to perform after an extended period of time has passed."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q36",
    "explanation": "The question asks which evidence from the excerpt is most relevant to the author’s claim that there are many unanswered questions about the relationship between movement and learning.\n\nA. CORRECT. While the study revealed that the college students who used exercise bikes did better in their language learning, paragraph 18 indicates that we cannot know “whether other people completing other types of exercise would achieve the same results,” suggesting that there are many unknowns about the relationship between movement and learning.\n\nB. Incorrect. Rather than supporting the claim that there are many unanswered questions about the relationship between movement and learning, this statement offers a possible explanation as to why exercise might help learning.\n\nC. Incorrect. The finding that exercise helps people retain their language learning longer (paragraph 15) adds to our understanding of the relationship between movement and learning rather than supporting the claim that there are still many unanswered questions.\n\nD. Incorrect. Dr. Sulpizio’s statement that the study suggests that ” ‘instruction should be flanked by physical activity’ ” (paragraph 21) does not in any way address the issue of unanswered questions about movement and learning.",
    "points": 1,
    "prompt": "Which evidence from the excerpt is most relevant to the author's claim that there are many unanswered questions about the relationship between movement and learning?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "the method of the study using one type of exercise and people from one age group"
      },
      {
        "id": "B",
        "text": "the statement from Dr. Sulpizio explaining past studies on neurochemicals in the brain"
      },
      {
        "id": "C",
        "text": "the finding of the study that exercise helps people recall information over a long period of time"
      },
      {
        "id": "D",
        "text": "the statement from Dr. Sulpizio describing how the results of the study can be applied"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q37",
    "explanation": "The question asks which sentence from the excerpt best supports Dr. Sulpizio’s assertion in paragraph 17 that exercise went beyond helping with memorization to deepen the language learners’ ability to use new vocabulary.\n\nA. Incorrect. This sentence merely describes what the language-learning sessions were like without making any claims about how the exercise affected the subjects’ understanding of how to use new words.\n\nB. Incorrect. While this sentence does address the fact that learners were required to think about how the new words should be used rather than just memorizing the words, it does not discuss results such as how the exercise affected their ability to do this.\n\nC. Incorrect. This sentence establishes only that exercise helped with the memorization of new words, not that exercise deepened learners’ grasp of how to use the new words.\n\nD. CORRECT. The fact that learners who exercised were better at identifying when the new words were used correctly in sentences directly supports Dr. Sulpizio’s assertion that the exercise deepened their grasp of how to use the new words.",
    "points": 1,
    "prompt": "Read these sentences from paragraph 17.\n\nThese improvements extend beyond simply aiding in memorization, she added. The exercise also deepened language learners’ grasp of how to use their newly acquired words.\n\nWhich sentence from the excerpt best explains why Dr. Sulpizio feels confident in the conclusion stated in these sentences?",
    "promptHtml": "<p>Read these sentences from paragraph 17.</p><blockquote><strong>These improvements extend beyond simply aiding in memorization, she added. The exercise also deepened language learners’ grasp of how to use their newly acquired words.</strong></blockquote><p>Which sentence from the excerpt best explains why Dr. Sulpizio feels confident in the conclusion stated in these sentences?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“They were shown 40 words per session, with the sequence repeated several times.” (paragraph 10)"
      },
      {
        "id": "B",
        "text": "“They also responded to sentences using the new words, marking whether the sentences were accurate or, in the case of ‘The apple is a dentist,’ nonsensical.” (paragraph 11)"
      },
      {
        "id": "C",
        "text": "“And at the end of each lesson, the students who had ridden bikes performed better on the subsequent vocabulary tests than did the students who sat still.” (paragraph 13)"
      },
      {
        "id": "D",
        "text": "“They also became more proficient at recognizing proper sentences than the sedentary students, although that difference did not emerge until after several weeks of instruction.” (paragraph 14)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q38",
    "explanation": "The question asks what paragraph 18 reveals about the author’s perspective toward the study in the excerpt.\n\nA. CORRECT. As paragraph 18 says, the study cannot address “whether other people completing other types of exercise would achieve the same results” as college students riding bikes.\n\nB. Incorrect. While paragraph 18 mentions that the students performed “relatively light exercise,” it never suggests that more rigorous exercise should have been studied, only that it is still unknown what the impact on language learning would be for other populations doing other types of exercise.\n\nC. Incorrect. Paragraph 18 points out only that the study’s results cannot be generalized to other populations performing other types of exercise and never speculates on whether the study's results could be duplicated.\n\nD. Incorrect. Far from claiming that the study’s results could be applied more broadly to learning in general, paragraph 18 points out the ways in which the study’s results cannot be applied more broadly.",
    "points": 1,
    "prompt": "Paragraph 18 shows that the author’s perspective toward the study described in the excerpt is that",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "though the study allowed some conclusions to be drawn, these conclusions are limited."
      },
      {
        "id": "B",
        "text": "while the study focused on moderate exercise, it would have been better to focus on difficult exercise."
      },
      {
        "id": "C",
        "text": "while the study was performed appropriately, it is doubtful the results can be duplicated."
      },
      {
        "id": "D",
        "text": "though the study was about learning language, its conclusions can be applied to learning in general."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b-2023-form-b-q39",
    "explanation": "The question asks for the best summary of the research procedure used in the study in the excerpt.\n\nA. Incorrect. This summary says that students learned new words by matching words and images and “also by analyzing words in context,” but this last method was how the researchers assessed students, not how the students learned words; the summary is therefore inaccurate.\n\nB. CORRECT. The summary includes the most important information, which is that one group of non-English-speaking students exercised before and during the English lessons, while the other group did not, and that the students’ learning was assessed afterward.\n\nC. Incorrect. This summary is incomplete because it never mentions the control group—that is, the students who studied English without exercising—which was essential to the study so that results could be compared.\n\nD. Incorrect. This summary includes unnecessary details, such as that students were assessed after a short break and also assessed after a month of no studying; it also neglects to mention important points: that one group exercised both before and during learning, while the other group did not exercise at all. Looking for the Smallest Spark in Everything",
    "points": 1,
    "prompt": "Which sentence is the best summary of the research procedure used in the study in the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "Researchers had a group of non-English-speaking students learn new English vocabulary by matching words and images on a computer screen, and also by analyzing words in context; some students exercised and some students sat still while learning."
      },
      {
        "id": "B",
        "text": "Researchers first divided non-English-speaking students into two groups with one group exercising before and while studying English and the other group studying English without exercising; then, after instruction, student learning was assessed."
      },
      {
        "id": "C",
        "text": "Researchers first had non-English-speaking students sit on stationary bikes and pedal for 20 minutes before instruction and 15 minutes during instruction; then, after a rest period, students indicated whether English sentences made sense."
      },
      {
        "id": "D",
        "text": "Researchers asked non-English-speaking students to study English while sitting or biking; then the students’ vocabulary skills were assessed after a short break period and also after a break of a full month without their having studied any of the materials."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b",
  label: "2023 Form B",
  section: "reading",
  questionCount: excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-how-exercise-could-help-you-learn-a-new-language-2023-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “How Exercise Could Help You Learn a New Language”",
    author: "Gretchen Reynolds",
    byline: "by Gretchen Reynolds",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">Many scientists suspect that exercise alters the biology of the brain in ways that make it more malleable and receptive to new information, a process that scientists refer to as plasticity.</p><p data-numbered=\"true\">But many questions have remained unanswered about movement and learning, including whether exercise is most beneficial before, during or after instruction and how much and what types of exercise might be best.</p><p data-numbered=\"true\">So for a new study, which was published recently in PLOS One, researchers in China and Italy decided to home in on language learning and the adult brain.</p><p data-numbered=\"true\">Language learning is interesting. As young children, almost all of us picked up our first language easily. We didn’t have to be formally taught; we simply absorbed words and concepts.</p><p data-numbered=\"true\">But by early adulthood, the brain generally begins to lose some of its innate language capability. It displays less plasticity in areas of the brain related to language. As a result, for most of us, it becomes harder to learn a second language after childhood.</p><p data-numbered=\"true\">To see what effects exercise might have on this process, the researchers first recruited 40 college-age Chinese men and women who were trying to learn English. The students had some facility with this second language but were far from proficient.</p><p data-numbered=\"true\">The researchers then divided the students into two groups. Those in one group would continue to learn English as they had before, primarily while seated in rote vocabulary-memorization sessions.</p><p data-numbered=\"true\">The others would supplement these sessions with exercise.</p><p data-numbered=\"true\">Specifically, the students would ride exercise bikes at a gentle pace (about 60 percent of their maximum aerobic capacity) beginning 20 minutes before the start of the lessons and continuing throughout the 15 minutes or so of instruction.</p><p data-numbered=\"true\">Both groups learned their new vocabulary by watching words projected onto large screens, together with comparable pictures, such as “apple” and a Red Delicious. They were shown 40 words per session, with the sequence repeated several times.</p><p data-numbered=\"true\">Afterward, the students all rested briefly and then completed a vocabulary quiz, using computer keys to note as quickly as possible whether a word was with its correct picture. They also responded to sentences using the new words, marking whether the sentences were accurate or, in the case of “The apple is a dentist,” nonsensical. Most <span data-glossary-definition=\"scientists who study language\" role=\"link\" tabindex=\"0\">linguists</span><sup>1</sup> feel that understanding sentences shows greater mastery of a new language than does simple vocabulary improvement.</p><p data-numbered=\"true\">The students completed eight vocabulary sessions over the course of two months.</p><p data-numbered=\"true\">And at the endof each lesson, the students who had ridden bikes performed better on the subsequent vocabulary tests than did the students who sat still.</p><p data-numbered=\"true\">They also became more proficient at recognizing proper sentences than the sedentary students, although that difference did not emerge until after several weeks of instruction.</p><p data-numbered=\"true\">Perhaps most interesting, the gains in vocabulary and comprehension lingered longest for the cyclists. When the researchers asked the students to return to the lab for a final round of testing a month after the lessons—without practicing in the meantime—the cyclists remembered words and understood them in sentences more accurately than did the students who had not moved.</p><p data-numbered=\"true\">“The results suggest that physical activity during learning improves that learning,” says Simone Sulpizio, a professor of psychology and linguistics at the University Vita-Salute San Raffaele in Milan, Italy, and a study co-author.</p><p data-numbered=\"true\">These improvements extend beyond simply aiding in memorization, she added. The exercise also deepened language learners’ grasp of how to use their newly acquired words.</p><p data-numbered=\"true\">This study involved college students performing relatively light exercise, though, and cannot tell us whether other people completing other types of exercise would achieve the same results.</p><p data-numbered=\"true\">It also offers no clues about what is occurring inside the brain that might be contributing to the benefits of the exercise. But many past studies have shown that exercise prompts the release of multiple neurochemicals in the brain that increase the number of new brain cells and the connections between neurons, Dr. Sulpizio says. These effects improve the brain’s plasticity and augment the ability to learn.</p><p data-numbered=\"true\">From a real-world standpoint, the study’s implications might seem at first to be impractical. Few classrooms are equipped with stationary bicycles. But specialized equipment is probably unnecessary, Dr. Sulpizio says.</p><p data-numbered=\"true\">“We are not suggesting that schools or teachers buy lots of bicycles,” she says. “A simpler take-home message may be that instruction should be flanked by physical activity.”</p>",
    sourceNote: "From “How Exercise Could Help You Learn a New Language” by Gretchen Reynolds from THE NEW YORK TIMES, August 16, 2017. Copyright © 2017 The New York Times Company.",
    text: excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBPassageText,
    versionLabel: "2023 Form B",
  }),
  questions: excerptFromHowExerciseCouldHelpYouLearnANewLanguage2023FormBQuestions,
};
