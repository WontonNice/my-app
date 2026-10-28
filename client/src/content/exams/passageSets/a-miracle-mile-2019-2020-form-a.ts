import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const aMiracleMile20192020FormAPassageText = "In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.\n\nRoger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier.\n\nBannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.\n\nBy early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.\n\nAs a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”\n\nIn track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.\n\nPropelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace, completing the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of the back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”\n\nSoon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.";

const aMiracleMile20192020FormAQuestions: ExamQuestion[] = [
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q10",
    "explanation": "The question asks how the words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph.\n\nF: Correct. No one had ever been able to run a mile in less than four minutes, and the words “feat,” “impossible,” and “impenetrable” imply that the goal seemed unattainable. These words also reinforce the comparison of running a four-minute mile to “scaling Mount Everest” (paragraph 1).\n\nE: Incorrect. Although paragraph 1 states that “several elite runners aimed to break that supposedly impenetrable barrier,” the words “feat,” “humanly impossible,” and “impenetrable barrier” suggest that the goal was unattainable even for the most skilled runners.\n\nG: Incorrect. The words “feat,” “humanly impossible,” and “impenetrable barrier” describe how challenging and almost impossible running a four-minute mile seemed, and while other elite runners “aimed to break that supposedly impenetrable barrier” (paragraph 1), the paragraph focuses on Roger Bannister, not the competition among elite runners seeking to break the record.\n\nH: Incorrect. Bannister’s training program is described in paragraphs 3 and 4, and the words “feat,” “impossible,” and “impenetrable” are used in paragraph 1 to describe the magnitude of Bannister’s goal to run a four-minute mile. Though his training program was intense, these words relate to the intensity of the goal itself, not to the intensity of his training.",
    "points": 1,
    "prompt": "The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph because they",
    "promptHtml": "<p>The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph because they</p>",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "highlight the idea that only the most skilled runners would be able to run a four-minute mile."
      },
      {
        "id": "B",
        "text": "emphasize the idea that running a mile in less than four minutes was a seemingly unattainable goal."
      },
      {
        "id": "C",
        "text": "convey the competitiveness among elite runners to consistently set and break speed records."
      },
      {
        "id": "D",
        "text": "show the intensity of the training programs athletes endure in order to achieve their goals."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q11",
    "explanation": "The question asks how interval training affected Bannister’s performance.\n\nC: Correct. As paragraph 3 states, the goal of Bannister’s training program was to “develop endurance and speed,” which are synonyms of the words “stamina” and “pace. ”\n\nA: Incorrect. The moderation of his pace was achieved through the use of “rabbits,” described in paragraph 6, more than through his method of interval training.\n\nB: Incorrect. Bannister worked individually during the interval training period and then paced himself with a two-person team of “rabbits,” which were introduced in paragraph 5 and explained in paragraph 6. It was the use of “rabbits” during the race that helped him conserve some of his effort, not the interval training.\n\nD: Incorrect. During the interval-training process, Bannister “let his body recover for two minutes” (paragraph 3).",
    "points": 1,
    "prompt": "How did interval training affect Bannister’s performance?",
    "promptHtml": "<p>How did interval training affect Bannister’s performance?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "It helped him learn how to moderate his pace while running."
      },
      {
        "id": "B",
        "text": "It helped him understand the importance of running with a team."
      },
      {
        "id": "C",
        "text": "It helped him improve his pace and stamina while running."
      },
      {
        "id": "D",
        "text": "It helped him decrease his recovery time after an intense run."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q12",
    "explanation": "The question asks which sentence best supports the idea that Bannister needed an alternative to “logical planning” in order to accomplish his goal.\n\nH: Correct. The sentence from paragraph 4 explains that Bannister reached a point where he could not improve his time despite the strict training plan he had created. Taking a break from his training to spend time mountain climbing “permitted his muscles to recuperate and left him feeling refreshed” (paragraph 4).\n\nE: Incorrect. The outcome of the 1952 Olympics, referenced in the sentence from paragraph 2, is what prompted Bannister to seek a new goal: “Determined to redeem himself, Bannister . focused on the ultimate prize—breaking the four-minute-mile barrier” (paragraph 2).\n\nF: Incorrect. The sentence from paragraph 3 does not show an alternative to Bannister’s training plan to “develop endurance and speed” (paragraph 3) and his focus on using logical planning in order to accomplish his goal.\n\nG: Incorrect. The sentence from paragraph 4 focuses on details of his training plan, explaining the “intensive interval training” (paragraph 3) that Bannister used to build his endurance and speed, not an alternative form of preparation.",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Bannister needed an alternative to “logical planning” in order to accomplish his goal?",
    "promptHtml": "<p>Which sentence best supports the idea that Bannister needed an alternative to “logical planning” in order to accomplish his goal?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“Bannister’s performance was a disappointment for him and his country, Great Britain.” (paragraph 2)"
      },
      {
        "id": "B",
        "text": "“The amateur athlete decided to use intensive interval training to develop endurance and speed.” (paragraph 3)"
      },
      {
        "id": "C",
        "text": "“For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap.” (paragraph 3)"
      },
      {
        "id": "D",
        "text": "“Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q13",
    "explanation": "The question asks which sentence indicates that Bannister nearly made a mistake that would have cost him the world record.\n\nC: Correct. If Bannister had begun running faster than the “steady but grueling pace” (paragraph 7) set by his “rabbit,” he would likely not have had enough energy to finish the race. As paragraph 6 notes, “the runner conserves about 15 percent of his or her effort” by allowing the “rabbit” to set the pace. Bypassing the “rabbit” at that point in the race could have cost Bannister energy and, in turn, the record.\n\nA: Incorrect. The sentence from paragraph 4 describes a challenge Bannister faced during his training period, when he used “intensive interval training to develop endurance and speed” (paragraph 3). Bannister ran laps on a “quarter-mile track” (paragraph 3) and was able to control his pace at this time―unlike during the actual race to break the record.\n\nB: Incorrect. The sentence from paragraph 6 describes the start of the race and Brasher’s role as “first rabbit” for Bannister. Bannister was behind Brasher, following their plan for breaking the record.\n\nD: Incorrect. The sentence from paragraph 7 describes how Bannister leaped ahead of Chataway, his second “rabbit,” at the appropriate time in the effort to break the record. Chataway had “surged forward, leading Bannister at this same punishing rate for another lap and a half” (paragraph 7) before Bannister moved past him.",
    "points": 1,
    "prompt": "Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?",
    "promptHtml": "<p>Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target.” (paragraph 4)"
      },
      {
        "id": "B",
        "text": "“When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.” (paragraph 6)"
      },
      {
        "id": "C",
        "text": "“Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted ‘Faster!’ at Brasher.” (paragraph 7)"
      },
      {
        "id": "D",
        "text": "“At the beginning of the back straightaway of the track, Bannister bolted past Chataway.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q14",
    "explanation": "The question asks what idea is conveyed by the phrase “a new mindset had taken root” in paragraph 8.\n\nE: Correct. After Bannister ran the mile in under four minutes, it became clear to other runners that this goal was within the realm of human ability, and “soon after Bannister’s achievement, four other athletes matched his performance” (paragraph 8).\n\nF: Incorrect. While the passage states that runners broke the four-minute-mile barrier after Bannister initially broke it (“Soon after Bannister’s achievement, four other athletes matched his performance” [paragraph 8]), running a four-minute mile is still impressive and a challenge for elite runners.\n\nG: Incorrect. Although runners most likely knew that the training needed in order to break the four-minute-mile barrier was difficult and intensive, the phrase “a new mindset had taken root” focuses on their belief in the possibility of breaking the four-minute-mile barrier, which had been viewed as a “supposedly impenetrable barrier” (paragraph 1), not the idea that the training was difficult.\n\nH: Incorrect. Even though “four other athletes matched his performance” and “the record continued to fall” (paragraph 8), the phrase “a new mindset had taken root” does not refer to the idea that there was an increase in the number of runners entering races just to try breaking the four-minute-mile barrier.",
    "points": 1,
    "prompt": "The phrase “a new mindset had taken root” in paragraph 8 conveys the idea that",
    "promptHtml": "<p>The phrase “a new mindset had taken root” in paragraph 8 conveys the idea that</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "runners recognized that running a mile in under four minutes was physically possible."
      },
      {
        "id": "B",
        "text": "breaking the four-minute-mile barrier was no longer considered an impressive feat for elite runners."
      },
      {
        "id": "C",
        "text": "runners understood how hard they would have to train in order to run a mile in under four minutes."
      },
      {
        "id": "D",
        "text": "entering races in an attempt to break the four-minute-mile barrier became commonplace for elite runners."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q15",
    "explanation": "The question asks how Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minute-mile barrier.\n\nC: Correct. Bannister sought to redeem himself after “he finished in a dismal fourth place” at the Olympics (paragraph 2). He thought that his performance “was a disappointment for him and his country, Great Britain,” and he responded by setting a goal to successfully conquer the four-minute mile, which was considered the “ultimate prize” (paragraph 2).\n\nA: Incorrect. While Bannister recognized the weaknesses that led to his poor performance in the Olympics and worked “to develop endurance and speed” (paragraph 3), the loss made him “determined to redeem himself” (paragraph 2). The desire for redemption influenced Bannister to focus specifically on running a mile in under four minutes, rather than on winning other races or training for other distances.\n\nB: Incorrect. Although Bannister developed an “intensive interval training” plan to improve his “endurance and speed” (paragraph 3), he applied a different approach only after his progress toward a four-minute mile reached a “plateau” (paragraph 4) in 1954. It was his desire to “shave off at least one more second in order to reach his target” (paragraph 4) that prompted him to take a break from interval training and go mountain climbing for three days.\n\nD: Incorrect. Bannister’s loss at the 1952 Olympics motivated him to change his training focus to reaching the “ultimate prize” (paragraph 2) of breaking the four-minute-mile barrier, which no other runner had accomplished. His loss at the Olympics did not present him with a specific opportunity to reach this goal.",
    "points": 1,
    "prompt": "Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minute-mile barrier by",
    "promptHtml": "<p>Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minute-mile barrier by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "allowing him to recognize his weaknesses and improve his running ability."
      },
      {
        "id": "B",
        "text": "prompting him to take a different approach to his regular training."
      },
      {
        "id": "C",
        "text": "motivating him to prove to himself that he could set and achieve a goal."
      },
      {
        "id": "D",
        "text": "giving him the opportunity to reach a goal no runner had ever accomplished."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q16",
    "explanation": "The question asks how the author’s use of chronological structure contributes to the development of ideas in the passage.\n\nH: Correct. The chronological structure of the passage follows the progression of Bannister’s training from his loss at the 1952 Olympics to the race where he ran the first sub–four-minute mile on May 6, 1954 (paragraph 5).\n\nE: Incorrect. While paragraph 4 mentions the “plateau” Bannister dealt with and the break that “permitted his muscles to recuperate,” the chronological structure of the passage focuses mainly on the progression of Bannister’s process over time.\n\nF: Incorrect. Even though the passage suggests that Bannister's ability to break the four-minute-mile barrier improved and that he felt \"prepared to attempt to break the world record\" (paragraph 4), the chronological structure of the passage primarily serves to show how Bannister's progress over time led to his success.\n\nG: Incorrect. The chronological structure of the passage begins with an acknowledgement that Bannister was inspired to break the four-minute-mile barrier by his loss at the 1952 Olympics (paragraph 1); however, the overall organization of the passage highlights his dedicated efforts over time to break the four-minute-mile barrier.",
    "points": 1,
    "prompt": "How does the author’s use of chronological structure contribute to the development of ideas in the passage?",
    "promptHtml": "<p>How does the author’s use of chronological structure contribute to the development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It presents the increasing physical effects of Bannister’s intense training methods as he prepared to break the four-minute-mile barrier."
      },
      {
        "id": "B",
        "text": "It shows the increase in Bannister’s confidence in his ability to break the four-minute-mile barrier."
      },
      {
        "id": "C",
        "text": "It emphasizes the key events in Bannister’s life that inspired him to break the four-minute-mile barrier."
      },
      {
        "id": "D",
        "text": "It highlights the progression of Bannister’s training and details about his successful attempt to break the four-minute-mile barrier."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2019-2020-form-a-2019-form-a-ela-q17",
    "explanation": "The question asks how the sentences from paragraph 7 contribute to the development of ideas in the passage.\n\nA: Correct. The sentences from paragraph 7 show that toward the end of the race, Bannister knew that the goal of breaking the four-minute-mile barrier was within his grasp and that he had the focus necessary to achieve it. The sentence following Bannister’s quotation states that he did indeed meet his goal, crossing “the finish line in 3 minutes 59. 4 seconds” (paragraph 7).\n\nB: Incorrect. The feelings Bannister expressed in the sentences from paragraph 7 did not erase those related to his loss at the 1952 Olympics, which were what drove him to the achievement he was about to make.\n\nC: Incorrect. While the quotation states Bannister felt “unity,” the sentences from paragraph 7 capture Bannister’s focus on his chance to break the barrier and what he was feeling at that moment.\n\nD: Incorrect. The sentences from paragraph 7 express a feeling of realization that Bannister was on the verge of reaching a goal. The sentences show that in the seconds before crossing the finish line, Bannister was fully focused on the end goal and was not thinking about his training or his running technique.",
    "points": 1,
    "prompt": "Read these sentences from paragraph 7.\n\nBannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”\n\nThe sentences contribute to the development of ideas in the passage by showing that Bannister",
    "promptHtml": "<p>Read these sentences from paragraph 7.</p><blockquote><strong>Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”</strong></blockquote><p>The sentences contribute to the development of ideas in the passage by showing that Bannister</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "knew that he was about to achieve the goal he had worked toward."
      },
      {
        "id": "B",
        "text": "was no longer experiencing personal disappointment from his past failure in the Olympics."
      },
      {
        "id": "C",
        "text": "felt grateful to his teammates for helping him take the lead."
      },
      {
        "id": "D",
        "text": "was satisfied that his training had helped him perfect his running technique."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const aMiracleMile20192020FormAPassageSet: ExamPassageSet = {
  id: "ela-a-miracle-mile-2019-2020-form-a",
  label: "2019–2020 Grade 8 Form A",
  section: "reading",
  questionCount: aMiracleMile20192020FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "a-miracle-mile-2019-2020-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "A Miracle Mile",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.</p>\n<p data-numbered=\"true\">Roger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier.</p>\n<p data-numbered=\"true\">Bannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.</p>\n<p data-numbered=\"true\">By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.</p>\n<p data-numbered=\"true\">As a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”</p>\n<p data-numbered=\"true\">In track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.</p>\n<p data-numbered=\"true\">Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace, completing the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of the back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”</p>\n<p data-numbered=\"true\">Soon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.</p>",
    text: aMiracleMile20192020FormAPassageText,
    versionLabel: "2019–2020 Form A",
  }),
  questions: aMiracleMile20192020FormAQuestions,
};
