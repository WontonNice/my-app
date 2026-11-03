import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const martialArtsForTheMindAndBody20192020FormBPassageText = "(1) The martial arts blend a series of physical movements with strategic mental discipline so that practitioners can defend themselves, physically defeat an opponent, or both. (2) Historians are unsure of exactly when and where martial arts were first used. (3) Martial arts have been practiced by several different societies for many centuries. (4) Martial arts such as karate, kung fu, tae kwon do, and judo are still taught and practiced as methods of self-defense, but they offer students more than that. (5) The study of martial arts can provide students with a way to enhance their mental discipline as well as their physical fitness.\n\n(6) Discipline, focus, and respect are important qualities for everyone to have. (7) However, for most people these qualities are not innate; they must be learned and practiced. (8) The study of martial arts can provide an opportunity to develop these skills. (9) Students are rewarded for their dedication by passing tests and advancing to higher levels. (10) For example, in a typical tae kwon do class, students learn discipline by diligently practicing moves, improve focus by listening carefully, and demonstrate respect by bowing to the instructor and following directions.\n\n(11) For teenagers, martial arts classes provide a safe and structured environment for gaining physical skills, building confidence, and enjoying a sense of community. (12) A lot of teens go through hard situations as they try to do well in school and in life. (13) A karate class can provide teens with a physical outlet for stress while also challenging them mentally. (14) Participating in a martial arts program also helps children and teens focus on self-improvement rather than on competition. (15) Progressing through levels of achievement involves mastering more physically demanding techniques. (16) It requires students to take responsibility and be accountable for achieving set goals. (17) Students gain confidence and experience companionship with other students who are progressing through the ranks.\n\n(18) Adults who practice martial arts can experience many of the same benefits that younger people do, but perhaps the greatest of these is health and fitness. (19) Adult martial arts students often see changes in their body within weeks of beginning a program.\n\n(20) For people interested in studying a martial art, there are many ways to learn and practice. (21) In addition to private studios, community recreation centers often offer low-cost or free martial arts classes. (22) There are even online videos that introduce students to the basic concepts. (23) People should study martial arts.";

const martialArtsForTheMindAndBody20192020FormBQuestions: ExamQuestion[] = [
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q004",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        4
      ]
    },
    "explanation": "4 . The question asks for the best way to combine sentences 2 and 3 .\n\nF: Correct . Option F is correct because the word “while” at the beginning of the sentence best indicates the contrast between the ideas in sentences 2 and 3 . Sentence 2 states that historians do not know the exact origins of martial arts (“unsure of exactly when and where”) . Sentence 3 describes what historians do know about these origins (“practiced by several different societies for many centuries”) . This combination indicates that historians have a general understanding about the origins of martial arts even though they cannot confirm the exact details .\n\nE: Incorrect . This way of combining sentences 2 and 3 places unnecessary emphasis on characterizing historians, and it does not clearly show the contrasting relationship between the idea from sentence 2 that historians do not know the exact origins of martial arts and the idea in sentence 3 that historians know that martial arts have a long history .\n\nG: Incorrect . Starting this sentence with the word “because” indicates a cause-and-effect relationship that does not exist between the ideas in the original sentences . The idea from sentence 3, that historians know that martial arts have been practiced for many years, did not cause the idea in sentence 2, that historians do not know exact details about the origins of martial arts .\n\nH: Incorrect . The conjunction (connecting word) “and” does not clearly show how the ideas in sentences 2 and 3 are related . While “and” can be used to combine related sentences, it does not demonstrate the contrast between the idea in sentence 2, that historians do not know the exact origins of martial arts, and the idea in sentence 3, that historians know that martial arts have a long history .",
    "explanationHtml": "<p><strong>4 .</strong> The question asks for the best way to combine sentences 2 and 3 .</p><p><strong>F: Correct .</strong> Option F is correct because the word “while” at the beginning of the sentence best indicates the contrast between the ideas in sentences 2 and 3 . Sentence 2 states that historians do not know the exact origins of martial arts (“unsure of exactly when and where”) . Sentence 3 describes what historians do know about these origins (“practiced by several different societies for many centuries”) . This combination indicates that historians have a general understanding about the origins of martial arts even though they cannot confirm the exact details .</p><p><strong>E:</strong> Incorrect . This way of combining sentences 2 and 3 places unnecessary emphasis on characterizing historians, and it does not clearly show the contrasting relationship between the idea from sentence 2 that historians do not know the exact origins of martial arts and the idea in sentence 3 that historians know that martial arts have a long history .</p><p><strong>G:</strong> Incorrect . Starting this sentence with the word “because” indicates a cause-and-effect relationship that does not exist between the ideas in the original sentences . The idea from sentence 3, that historians know that martial arts have been practiced for many years, did not cause the idea in sentence 2, that historians do not know exact details about the origins of martial arts .</p><p><strong>H:</strong> Incorrect . The conjunction (connecting word) “and” does not clearly show how the ideas in sentences 2 and 3 are related . While “and” can be used to combine related sentences, it does not demonstrate the contrast between the idea in sentence 2, that historians do not know the exact origins of martial arts, and the idea in sentence 3, that historians know that martial arts have a long history .</p>",
    "points": 1,
    "prompt": "What is the best way to combine sentences 2 and 3?",
    "promptHtml": "<p>What is the best way to combine sentences 2 and 3?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Historians, who are unsure of exactly when and where martial arts were first used, know that martial arts have been practiced by several different societies for many centuries.</p>",
        "text": "Historians, who are unsure of exactly when and where martial arts were first used, know that martial arts have been practiced by several different societies for many centuries."
      },
      {
        "id": "B",
        "html": "<p>While historians are unsure of exactly when and where martial arts were first used, they do know that martial arts have been practiced by several different societies for many centuries.</p>",
        "text": "While historians are unsure of exactly when and where martial arts were first used, they do know that martial arts have been practiced by several different societies for many centuries."
      },
      {
        "id": "C",
        "html": "<p>Because historians know that martial arts have been practiced by several different societies for many centuries, they are unsure of exactly when and where martial arts were first used.</p>",
        "text": "Because historians know that martial arts have been practiced by several different societies for many centuries, they are unsure of exactly when and where martial arts were first used."
      },
      {
        "id": "D",
        "html": "<p>Martial arts have been practiced by several different societies for many centuries, and historians are unsure of exactly when and where martial arts were first used.</p>",
        "text": "Martial arts have been practiced by several different societies for many centuries, and historians are unsure of exactly when and where martial arts were first used."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q005",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        4
      ]
    },
    "explanation": "5 . The question asks where sentence 10 should be moved to improve the organization of the second paragraph .\n\nD: Correct . Option D is correct because sentence 10 logically follows and supports the idea in sentence 8 that “the study of martial arts can provide an opportunity to develop” the qualities of discipline, focus, and respect . Sentence 10 explains this idea with examples, describing three specific ways that students in a typical tae kwon do class develop discipline, focus, and respect—by “diligently practicing,” “listening carefully,” and “bowing to the instructor and following directions .”\n\nA: Incorrect . Starting this paragraph with sentence 10 would weaken the paragraph’s organization because it would place a supporting detail sentence (sentence 10) before the topic sentence (sentence 6) . Sentence 6 belongs at the beginning of the paragraph because it introduces the topic—the qualities of discipline, focus, and respect . Sentence 10 supports the key idea of the paragraph, that these qualities can be developed through the study of martial arts . If sentence 10 preceded sentence 6, the transitional phrase “for example” would refer to an unspecified topic and idea .\n\nB: Incorrect . Sentence 6 presents the idea that “discipline, focus, and respect are important qualities for everyone to have,” but the example in sentence 10 does not directly relate to this idea . Sentence 10 explains how martial arts develop these qualities, not why they are important qualities to have . Because sentence 10 is not directly related to the idea in sentence 6 (the qualities are important), it should not follow sentence 6 .\n\nC: Incorrect . Sentences 7 and 8 should not be separated, because the idea presented in sentence 8—that “the study of martial arts can provide an opportunity to develop these skills”—is directly related to the idea from sentence 7—that the skills of discipline, focus, and respect “are not innate; they must be learned and practiced .” Sentence 10 supports the idea from sentence 8 that martial arts “can provide an opportunity to develop these skills” by describing an example from a typical martial arts class, so sentence 10 should not precede sentence 8 .",
    "explanationHtml": "<p><strong>5 .</strong> The question asks where sentence 10 should be moved to improve the organization of the second paragraph .</p><p><strong>D: Correct .</strong> Option D is correct because sentence 10 logically follows and supports the idea in sentence 8 that “the study of martial arts can provide an opportunity to develop” the qualities of discipline, focus, and respect . Sentence 10 explains this idea with examples, describing three specific ways that students in a typical tae kwon do class develop discipline, focus, and respect—by “diligently practicing,” “listening carefully,” and “bowing to the instructor and following directions .”</p><p><strong>A:</strong> Incorrect . Starting this paragraph with sentence 10 would weaken the paragraph’s organization because it would place a supporting detail sentence (sentence 10) before the topic sentence (sentence 6) . Sentence 6 belongs at the beginning of the paragraph because it introduces the topic—the qualities of discipline, focus, and respect . Sentence 10 supports the key idea of the paragraph, that these qualities can be developed through the study of martial arts . If sentence 10 preceded sentence 6, the transitional phrase “for example” would refer to an unspecified topic and idea .</p><p><strong>B:</strong> Incorrect . Sentence 6 presents the idea that “discipline, focus, and respect are important qualities for everyone to have,” but the example in sentence 10 does not directly relate to this idea . Sentence 10 explains how martial arts develop these qualities, not why they are important qualities to have . Because sentence 10 is not directly related to the idea in sentence 6 (the qualities are important), it should not follow sentence 6 .</p><p><strong>C:</strong> Incorrect . Sentences 7 and 8 should not be separated, because the idea presented in sentence 8—that “the study of martial arts can provide an opportunity to develop these skills”—is directly related to the idea from sentence 7—that the skills of discipline, focus, and respect “are not innate; they must be learned and practiced .” Sentence 10 supports the idea from sentence 8 that martial arts “can provide an opportunity to develop these skills” by describing an example from a typical martial arts class, so sentence 10 should not precede sentence 8 .</p>",
    "points": 1,
    "prompt": "Where should sentence 10 be moved to improve the organization of the second paragraph (sentences 6–10)?",
    "promptHtml": "<p>Where should sentence 10 be moved to improve the organization of the second paragraph (sentences 6–10)?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>to the beginning of the paragraph (before sentence 6)</p>",
        "text": "to the beginning of the paragraph (before sentence 6)"
      },
      {
        "id": "B",
        "html": "<p>between sentences 6 and 7</p>",
        "text": "between sentences 6 and 7"
      },
      {
        "id": "C",
        "html": "<p>between sentences 7 and 8</p>",
        "text": "between sentences 7 and 8"
      },
      {
        "id": "D",
        "html": "<p>between sentences 8 and 9</p>",
        "text": "between sentences 8 and 9"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q006",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "6",
      "pages": [
        4
      ]
    },
    "explanation": "6 . The question asks for the revision of sentence 12 that best maintains the formal style established in the passage .\n\nG: Correct . Option G is correct because it uses serious and academic wording throughout the whole sentence . The phrases “many teenagers,” “encounter challenges,” and “succeed both academically and personally” make the sentence’s style more consistently formal than the other options .\n\nE: Incorrect . The phrases “A lot,” “put up with,” “difficult things,” and “do well in school” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .\n\nF: Incorrect . The phrases “deal with,” “tough situations,” “stay on top of,” and “do well in life” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .\n\nH: Incorrect . The phrases “A lot,” “face problems,” and “keep up with” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .",
    "explanationHtml": "<p><strong>6 .</strong> The question asks for the revision of sentence 12 that best maintains the formal style established in the passage .</p><p><strong>G: Correct .</strong> Option G is correct because it uses serious and academic wording throughout the whole sentence . The phrases “many teenagers,” “encounter challenges,” and “succeed both academically and personally” make the sentence’s style more consistently formal than the other options .</p><p><strong>E:</strong> Incorrect . The phrases “A lot,” “put up with,” “difficult things,” and “do well in school” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .</p><p><strong>F:</strong> Incorrect . The phrases “deal with,” “tough situations,” “stay on top of,” and “do well in life” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .</p><p><strong>H:</strong> Incorrect . The phrases “A lot,” “face problems,” and “keep up with” are worded informally; therefore, this sentence does not consistently maintain the formal style established in the passage .</p>",
    "points": 1,
    "prompt": "Which revision of sentence 12 best maintains the formal style established in the passage?",
    "promptHtml": "<p>Which revision of sentence 12 best maintains the formal style established in the passage?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>A lot of teens have to put up with difficult things while trying to do well in school and in life.</p>",
        "text": "A lot of teens have to put up with difficult things while trying to do well in school and in life."
      },
      {
        "id": "B",
        "html": "<p>Many teenagers deal with tough situations as they try to stay on top of their studies and do well in life.</p>",
        "text": "Many teenagers deal with tough situations as they try to stay on top of their studies and do well in life."
      },
      {
        "id": "C",
        "html": "<p>Many teenagers encounter challenges as they work to succeed both academically and personally.</p>",
        "text": "Many teenagers encounter challenges as they work to succeed both academically and personally."
      },
      {
        "id": "D",
        "html": "<p>A lot of teens face problems as they work to keep up with their schoolwork and find personal success.</p>",
        "text": "A lot of teens face problems as they work to keep up with their schoolwork and find personal success."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q007",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "7",
      "pages": [
        4
      ]
    },
    "explanation": "7 . The question asks for the transitional phrase that should be added to the beginning of sentence 17 .\n\nA: Correct . Option A is correct because it best shows the chronological progression between the ideas in sentence 16—progressing through levels of achievement “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .” The transitional phrase “over time” shows the gradual nature of the relationship between the cause in sentence 16 and the effect in sentence 17 .\n\nB: Incorrect . Though the ideas in sentences 16 and 17 are related, “in fact” does not show the correct relationship between the ideas . The transitional phrase “in fact” emphasizes an idea by giving a detail or example of greater intensity, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks”—are related by cause-and-effect rather than by (degree of) intensity .\n\nC: Incorrect . The transitional phrase “even so” is used to connect opposing ideas, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—does not contrast with the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .”\n\nD: Incorrect . Although the transitional phrase “for instance” connects an idea with a related example, it does not show the cause-and-effect relationship between the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .”",
    "explanationHtml": "<p><strong>7 .</strong> The question asks for the transitional phrase that should be added to the beginning of sentence 17 .</p><p><strong>A: Correct .</strong> Option A is correct because it best shows the chronological progression between the ideas in sentence 16—progressing through levels of achievement “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .” The transitional phrase “over time” shows the gradual nature of the relationship between the cause in sentence 16 and the effect in sentence 17 .</p><p><strong>B:</strong> Incorrect . Though the ideas in sentences 16 and 17 are related, “in fact” does not show the correct relationship between the ideas . The transitional phrase “in fact” emphasizes an idea by giving a detail or example of greater intensity, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks”—are related by cause-and-effect rather than by (degree of) intensity .</p><p><strong>C:</strong> Incorrect . The transitional phrase “even so” is used to connect opposing ideas, but the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—does not contrast with the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .”</p><p><strong>D:</strong> Incorrect . Although the transitional phrase “for instance” connects an idea with a related example, it does not show the cause-and-effect relationship between the ideas in sentence 16—progressing through levels “requires students to take responsibility and be accountable for achieving set goals”—and the ideas in sentence 17—“students gain confidence and experience companionship with other students who are progressing through the ranks .”</p>",
    "points": 1,
    "prompt": "Which transitional phrase should be added to the beginning of sentence 17?",
    "promptHtml": "<p>Which transitional phrase should be added to the beginning of sentence 17?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Over time</p>",
        "text": "Over time"
      },
      {
        "id": "B",
        "html": "<p>In fact</p>",
        "text": "In fact"
      },
      {
        "id": "C",
        "html": "<p>Even so</p>",
        "text": "Even so"
      },
      {
        "id": "D",
        "html": "<p>For instance</p>",
        "text": "For instance"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q008",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "8",
      "pages": [
        5
      ]
    },
    "explanation": "8 . The question asks for the sentence that would best follow and support sentence 18 .\n\nG: Correct . Option G is correct because sentence 18 conveys that the greatest benefit of practicing martial arts is “health and fitness,” and Option G illustrates some specific ways that martial arts training helps improve physical fitness—“strengthen their heart, boost endurance, improve balance, and develop muscle tone .”\n\nE: Incorrect . Though the idea of advancing one’s career is certainly appealing for adults, this benefit is not directly tied to “health and fitness” and, therefore, does not support sentence 18 .\n\nF: Incorrect . While the passage does discuss potential benefits related to discipline, focus, and confidence (sentences 6 and 11), sentence 18 is solely related to health and fitness benefits and should not be followed by a description of “other skills .”\n\nH: Incorrect . Some readers may choose this option because sentence 5, sentence 15, and sentence 18 discuss the physical aspects of practicing martial arts, but the idea that people who practice martial arts are concerned about their overall health does not provide further details about the connection between training and health .",
    "explanationHtml": "<p><strong>8 .</strong> The question asks for the sentence that would best follow and support sentence 18 .</p><p><strong>G: Correct .</strong> Option G is correct because sentence 18 conveys that the greatest benefit of practicing martial arts is “health and fitness,” and Option G illustrates some specific ways that martial arts training helps improve physical fitness—“strengthen their heart, boost endurance, improve balance, and develop muscle tone .”</p><p><strong>E:</strong> Incorrect . Though the idea of advancing one’s career is certainly appealing for adults, this benefit is not directly tied to “health and fitness” and, therefore, does not support sentence 18 .</p><p><strong>F:</strong> Incorrect . While the passage does discuss potential benefits related to discipline, focus, and confidence (sentences 6 and 11), sentence 18 is solely related to health and fitness benefits and should not be followed by a description of “other skills .”</p><p><strong>H:</strong> Incorrect . Some readers may choose this option because sentence 5, sentence 15, and sentence 18 discuss the physical aspects of practicing martial arts, but the idea that people who practice martial arts are concerned about their overall health does not provide further details about the connection between training and health .</p>",
    "points": 1,
    "prompt": "Which sentence would best follow and support sentence 18?",
    "promptHtml": "<p>Which sentence would best follow and support sentence 18?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>Adult students gain discipline, focus, self-control, and respect, which are qualities that help them advance in their careers.</p>",
        "text": "Adult students gain discipline, focus, self-control, and respect, which are qualities that help them advance in their careers."
      },
      {
        "id": "B",
        "html": "<p>Many adults initially train in a martial art simply to get exercise without realizing that the training also helps develop other skills.</p>",
        "text": "Many adults initially train in a martial art simply to get exercise without realizing that the training also helps develop other skills."
      },
      {
        "id": "C",
        "html": "<p>The exercise involved in training helps people strengthen their heart, boost endurance, improve balance, and develop muscle tone.</p>",
        "text": "The exercise involved in training helps people strengthen their heart, boost endurance, improve balance, and develop muscle tone."
      },
      {
        "id": "D",
        "html": "<p>People who commit to training in the martial arts are usually concerned about improving their overall physical health.</p>",
        "text": "People who commit to training in the martial arts are usually concerned about improving their overall physical health."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "martial-arts-for-the-mind-and-body-2019-2020-form-b-pdf-shsat-2019-2020-b-q009",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "9",
      "pages": [
        5
      ]
    },
    "explanation": "9 . The question asks for the concluding sentence that best replaces sentence 23 and supports the topic presented in the passage .\n\nB: Correct . Option B is correct because it best supports the topic of the passage—the benefits of studying martial arts—by stating two reasons why people should study martial arts: to “experience the satisfaction of achieving goals while also improving themselves .”\n\nA: Incorrect . The phrase “the skills needed to progress in rank” is vague, and progressing in rank is not related to the overall topic of the passage, which is the benefits of studying martial arts . The topic of the passage is not the “many ways to begin studying martial arts” or how “people can easily discover” the benefits of martial arts .\n\nC: Incorrect . Some readers may choose this option because it refers to the benefits of martial arts, but the word “because” and the detail that “enrollment in martial arts courses has increased” make this sentence unrelated to the overall topic of the passage, which is about the benefits of studying martial arts, not the number of people who participate .\n\nD: Incorrect . Although the benefits of studying martial arts are described for both teens (in the third paragraph) and adults (in the fourth paragraph), the topic of the passage is the overall benefits of studying martial arts, which include mental discipline (discussed in the first, second, and third paragraphs) in addition to health benefits . Furthermore, the passage does not compare the health effects of studying martial arts across age groups .\n\nThe Best Laid Plans of Ravens",
    "explanationHtml": "<p><strong>9 .</strong> The question asks for the concluding sentence that best replaces sentence 23 and supports the topic presented in the passage .</p><p><strong>B: Correct .</strong> Option B is correct because it best supports the topic of the passage—the benefits of studying martial arts—by stating two reasons why people should study martial arts: to “experience the satisfaction of achieving goals while also improving themselves .”</p><p><strong>A:</strong> Incorrect . The phrase “the skills needed to progress in rank” is vague, and progressing in rank is not related to the overall topic of the passage, which is the benefits of studying martial arts . The topic of the passage is not the “many ways to begin studying martial arts” or how “people can easily discover” the benefits of martial arts .</p><p><strong>C:</strong> Incorrect . Some readers may choose this option because it refers to the benefits of martial arts, but the word “because” and the detail that “enrollment in martial arts courses has increased” make this sentence unrelated to the overall topic of the passage, which is about the benefits of studying martial arts, not the number of people who participate .</p><p><strong>D:</strong> Incorrect . Although the benefits of studying martial arts are described for both teens (in the third paragraph) and adults (in the fourth paragraph), the topic of the passage is the overall benefits of studying martial arts, which include mental discipline (discussed in the first, second, and third paragraphs) in addition to health benefits . Furthermore, the passage does not compare the health effects of studying martial arts across age groups .</p><h3>The Best Laid Plans of Ravens</h3>",
    "points": 1,
    "prompt": "Which concluding sentence should replace sentence 23 to best support the topic presented in the passage?",
    "promptHtml": "<p>Which concluding sentence should replace sentence 23 to best support the topic presented in the passage?</p>",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>With so many ways to begin studying martial arts, people can easily discover how the skills needed to progress in rank may help them in life.</p>",
        "text": "With so many ways to begin studying martial arts, people can easily discover how the skills needed to progress in rank may help them in life."
      },
      {
        "id": "B",
        "html": "<p>By taking advantage of opportunities to practice martial arts, people can experience the satisfaction of achieving goals while also improving themselves.</p>",
        "text": "By taking advantage of opportunities to practice martial arts, people can experience the satisfaction of achieving goals while also improving themselves."
      },
      {
        "id": "C",
        "html": "<p>Because people are eager to reap the mental and physical benefits of studying martial arts, enrollment in martial arts courses has increased.</p>",
        "text": "Because people are eager to reap the mental and physical benefits of studying martial arts, enrollment in martial arts courses has increased."
      },
      {
        "id": "D",
        "html": "<p>While taking martial arts classes can improve health for both young people and adults, the effects are clearly more immediate for adults.</p>",
        "text": "While taking martial arts classes can improve health for both young people and adults, the effects are clearly more immediate for adults."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const martialArtsForTheMindAndBody20192020FormBPassageSet: ExamPassageSet = {
  id: "ela-martial-arts-for-the-mind-and-body-2019-2020-form-b",
  versionLabels: ["2019-2020 Form B"],
  label: "2019-2020 Form B",
  section: "revising_editing_a",
  questionCount: martialArtsForTheMindAndBody20192020FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. You will be asked to recognize and correct errors so that the text follows the conventions of standard written English.",
  "breadcrumbLabel": "ELA REV/EDIT A DIRECTIONS",
  "subject": "English Language Arts",
  "title": "REVISING/EDITING PART A"
},
  passage: createSourcePassage({
    id: "martial-arts-for-the-mind-and-body-2019-2020-form-b",
    preserveSourceLayout: true,
    format: "sentence_prose",
    images: [],
    titleHtml: "Martial Arts for the Mind and Body",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2019-2020-form-b","label":"2019-2020 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf","year":"2019-2020","form":"B","packageId":"5e586d94840a95d9ffd3e5613451e65e8abc6db9424d47cf1969f9e17f543e7c"},
    title: "Martial Arts for the Mind and Body",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>(1) The martial arts blend a series of physical movements with strategic mental discipline so that practitioners can defend themselves, physically defeat an opponent, or both. (2) Historians are unsure of exactly when and where martial arts were first used. (3) Martial arts have been practiced by several different societies for many centuries. (4) Martial arts such as karate, kung fu, tae kwon do, and judo are still taught and practiced as methods of self-defense, but they offer students more than that. (5) The study of martial arts can provide students with a way to enhance their mental discipline as well as their physical fitness.</p><p>(6) Discipline, focus, and respect are important qualities for everyone to have. (7) However, for most people these qualities are not innate; they must be learned and practiced. (8) The study of martial arts can provide an opportunity to develop these skills. (9) Students are rewarded for their dedication by passing tests and advancing to higher levels. (10) For example, in a typical tae kwon do class, students learn discipline by diligently practicing moves, improve focus by listening carefully, and demonstrate respect by bowing to the instructor and following directions.</p><p>(11) For teenagers, martial arts classes provide a safe and structured environment for gaining physical skills, building confidence, and enjoying a sense of community. (12) A lot of teens go through hard situations as they try to do well in school and in life. (13) A karate class can provide teens with a physical outlet for stress while also challenging them mentally. (14) Participating in a martial arts program also helps children and teens focus on self-improvement rather than on competition. (15) Progressing through levels of achievement involves mastering more physically demanding techniques. (16) It requires students to take responsibility and be accountable for achieving set goals. (17) Students gain confidence and experience companionship with other students who are progressing through the ranks.</p><p>(18) Adults who practice martial arts can experience many of the same benefits that younger people do, but perhaps the greatest of these is health and fitness. (19) Adult martial arts students often see changes in their body within weeks of beginning a program.</p><p>(20) For people interested in studying a martial art, there are many ways to learn and practice. (21) In addition to private studios, community recreation centers often offer low-cost or free martial arts classes. (22) There are even online videos that introduce students to the basic concepts. (23) People should study martial arts.</p>",
    text: martialArtsForTheMindAndBody20192020FormBPassageText,
    versionLabel: "2019-2020 Form B",
  }),
  questions: martialArtsForTheMindAndBody20192020FormBQuestions,
};
