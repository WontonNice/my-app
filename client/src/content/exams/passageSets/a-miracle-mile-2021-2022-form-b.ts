import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const aMiracleMile20212022FormBPassageText = "In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.\n\n\nRoger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier.\n\n\nBannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.\n\n\nBy early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.\n\n\nAs a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”\n\n\nIn track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.\n\n\nPropelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace, completing the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of the back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”\n\n\nSoon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.";

const aMiracleMile20212022FormBQuestions: ExamQuestion[] = [
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "34",
      "pages": [
        26
      ]
    },
    "explanation": "The question asks how the words “feat,” “humanly impossible,” and “impenetrable barrier” in\nparagraph 1 affect the tone of the paragraph.\nE. Incorrect. Although paragraph 1 states that “several elite runners aimed to break that\nsupposedly impenetrable barrier,” the words “feat,” “humanly impossible,” and “impenetrable\nbarrier” suggest that the goal was unattainable even for the most skilled runners.\nF. CORRECT. No one had ever been able to run a mile in less than four minutes, and the words\n“feat,” “humanly impossible,” and “impenetrable barrier” imply that the goal seemed\nunattainable. These words also reinforce the comparison of running a four-minute mile to\n“scaling Mount Everest” (paragraph 1).\nG. Incorrect. The words “feat,” “humanly impossible,” and “impenetrable barrier” describe how\nchallenging and almost impossible running a four-minute mile seemed, and while other elite\nrunners “aimed to break that supposedly impenetrable barrier” (paragraph 1), the paragraph\nfocuses on Roger Bannister, not the competition among elite runners seeking to break the\nrecord.\nH. Incorrect. Bannister’s training program is described in paragraphs 3 and 4, and the words\n“feat,” “humanly impossible,” and “impenetrable barrier” are used in paragraph 1 to describe\nthe magnitude of Bannister’s goal to run a four-minute mile. Though his training program\nwas intense, these words relate to the intensity of the goal itself, not to the intensity of\nhis training.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q034-explanation-1.png\" alt=\"Official explanation for source question 34; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph because they",
    "promptHtml": "<p>The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph because they</p>",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "highlight the idea that only the most skilled runners would be able to run a four-minute mile.",
        "text": "highlight the idea that only the most skilled runners would be able to run a four-minute mile."
      },
      {
        "id": "B",
        "html": "emphasize the idea that running a mile in less than four minutes was a seemingly unattainable goal.",
        "text": "emphasize the idea that running a mile in less than four minutes was a seemingly unattainable goal."
      },
      {
        "id": "C",
        "html": "convey the competitiveness among elite runners to consistently set and break speed records.",
        "text": "convey the competitiveness among elite runners to consistently set and break speed records."
      },
      {
        "id": "D",
        "html": "show the intensity of the training programs athletes endure in order to achieve their goals.",
        "text": "show the intensity of the training programs athletes endure in order to achieve their goals."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "35",
      "pages": [
        26
      ]
    },
    "explanation": "The question asks which sentence best supports the idea that Bannister needed an alternative to\n“logical planning” (paragraph 3) in order to accomplish his goal.\nA. Incorrect. The outcome of the 1952 Olympics, referenced in the sentence from paragraph 2,\nis what prompted Bannister to seek a new goal: “Determined to redeem himself,\nBannister . . . focused on the ultimate prize—breaking the four-minute-mile barrier”\n(paragraph 2).\nB. Incorrect. The sentence from paragraph 3 does not show an alternative to Bannister’s\ntraining plan to “develop endurance and speed” (paragraph 3) and his focus on using logical\nplanning in order to accomplish his goal.\nC. Incorrect. The sentence from paragraph 4 focuses on details of his training plan, explaining\nthe “intensive interval training” (paragraph 3) that Bannister used to build his endurance and\nspeed, not an alternative form of preparation.\nD. CORRECT. The sentence from paragraph 4 explains that Bannister reached a point where he\ncould not improve his time despite the strict training plan he had created. Taking a break\nfrom his training to spend time mountain climbing “permitted his muscles to recuperate and\nleft him feeling refreshed” (paragraph 4).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q035-explanation-1.png\" alt=\"Official explanation for source question 35; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Bannister needed an alternative to “logical planning” (paragraph 3) in order to accomplish his goal?",
    "promptHtml": "<p>Which sentence best supports the idea that Bannister needed an alternative to “logical planning” (paragraph 3) in order to accomplish his goal?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“Bannister’s performance was a disappointment for him and his country, Great Britain.” <span>(<span>paragraph</span> 2)</span></p>",
        "text": "“Bannister’s performance was a disappointment for him and his country, Great Britain.” (paragraph 2)"
      },
      {
        "id": "B",
        "html": "<p>“The amateur athlete decided to use intensive interval training to develop endurance and speed.” <span>(<span>paragraph</span> 3)</span></p>",
        "text": "“The amateur athlete decided to use intensive interval training to develop endurance and speed.” (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>“For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap.” <span>(<span>paragraph</span> 3)</span></p>",
        "text": "“For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap.” (paragraph 3)"
      },
      {
        "id": "D",
        "html": "<p>“Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days.” <span>(<span>paragraph</span> 4)</span></p>",
        "text": "“Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q036",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "36",
      "pages": [
        26
      ]
    },
    "explanation": "The question asks how the sentences from paragraph 7 contribute to the development of ideas in\nthe passage.\nE. CORRECT. The sentences from paragraph 7 show that toward the end of the race, Bannister\nknew that the goal of breaking the four-minute-mile barrier was within his grasp and that he\nhad the focus necessary to achieve it. The sentence following Bannister’s quotation states\nthat he did indeed meet his goal, crossing “the finish line in 3 minutes 59.4 seconds”\n(paragraph 7).\nF. Incorrect. The feelings Bannister expressed in the sentences from paragraph 7 did not erase\nthose feelings related to his loss at the 1952 Olympics, which were what drove him to the\nachievement he was about to make.\nG. Incorrect. While the quotation states that Bannister felt “unity,” this pertains to his running,\nnot to his work with the team. The sentences from paragraph 7 capture Bannister’s focus on\nhis chance to break the barrier and what he was feeling at that moment.\nH. Incorrect. The sentences from paragraph 7 express Bannister’s realization that he was on the\nverge of reaching a goal. The sentences show that in the seconds before crossing the finish\nline, Bannister was fully focused on the end goal and was not thinking about his training or\nhis running technique.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q036-explanation-1.png\" alt=\"Official explanation for source question 36; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Read these sentences from paragraph 7.\n\nBannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”\n\nThe sentences contribute to the development of ideas in the passage by showing that Bannister",
    "promptHtml": "<p>Read these sentences from paragraph 7.</p><blockquote><strong>Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”</strong></blockquote><p>The sentences contribute to the development of ideas in the passage by showing that Bannister</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "knew that he was about to achieve the goal he had worked toward.",
        "text": "knew that he was about to achieve the goal he had worked toward."
      },
      {
        "id": "B",
        "html": "was no longer experiencing personal disappointment from his past failure in the Olympics.",
        "text": "was no longer experiencing personal disappointment from his past failure in the Olympics."
      },
      {
        "id": "C",
        "html": "felt grateful to his teammates for helping him take the lead.",
        "text": "felt grateful to his teammates for helping him take the lead."
      },
      {
        "id": "D",
        "html": "was satisfied that his training had helped him perfect his running technique.",
        "text": "was satisfied that his training had helped him perfect his running technique."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q037",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "37",
      "pages": [
        27
      ]
    },
    "explanation": "The question asks what idea is conveyed by the phrase “a new mindset had taken root” in\nparagraph 8.\nA. CORRECT. After Bannister ran the mile in under four minutes, it became clear to other\nrunners that this goal was within the realm of human ability, and “soon after Bannister’s\nachievement, four other athletes matched his performance” (paragraph 8).\nB. Incorrect. While the passage states that runners broke the four-minute-mile barrier after\nBannister initially broke it (‘Soon after Bannister’s achievement, four other athletes matched\nhis performance” [paragraph 8]), running a four-minute mile is still impressive and a\nchallenge for elite runners.\nC. Incorrect. Although runners most likely knew that the training needed in order to break the\nfour-minute-mile barrier was difficult and intensive, the phrase “a new mindset had taken\nroot” focuses on their belief in the possibility of breaking the four-minute-mile barrier, which\nhad been viewed as a “supposedly impenetrable barrier” (paragraph 1), not the idea that the\ntraining was difficult.\nD. Incorrect. Even though “four other athletes matched his performance” and “the record\ncontinued to fall” (paragraph 8), the phrase “a new mindset had taken root” does not refer to\nthe idea that there was an increase in the number of runners entering races just to try\nbreaking the four-minute-mile barrier.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q037-explanation-1.png\" alt=\"Official explanation for source question 37; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "The phrase “a new mindset had taken root” in paragraph 8 conveys the idea that",
    "promptHtml": "<p>The phrase “a new mindset had taken root” in paragraph 8 conveys the idea that</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "runners recognized that running a mile in under four minutes was physically possible.",
        "text": "runners recognized that running a mile in under four minutes was physically possible."
      },
      {
        "id": "B",
        "html": "breaking the four-minute-mile barrier was no longer considered an impressive feat for elite runners.",
        "text": "breaking the four-minute-mile barrier was no longer considered an impressive feat for elite runners."
      },
      {
        "id": "C",
        "html": "runners understood how hard they would have to train in order to run a mile in under four minutes.",
        "text": "runners understood how hard they would have to train in order to run a mile in under four minutes."
      },
      {
        "id": "D",
        "html": "elite runners entered races in an attempt to break the four-minute-mile barrier.",
        "text": "elite runners entered races in an attempt to break the four-minute-mile barrier."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q038",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "38",
      "pages": [
        27
      ]
    },
    "explanation": "The question asks which sentence indicates that Bannister nearly made a mistake that would\nhave cost him the world record.\nE. Incorrect. The sentence from paragraph 4 describes a challenge Bannister faced during his\ntraining period, when he used “intensive interval training to develop endurance and speed”\n(paragraph 3). Bannister ran laps on a “quarter-mile track” (paragraph 3) and was able to\ncontrol his pace at this time—unlike during the actual race to break the record.\nF. Incorrect. The sentence from paragraph 6 describes the start of the race and Brasher’s role\nas “first rabbit” for Bannister. Bannister was behind Brasher, following their plan for breaking\nthe record.\nG. CORRECT. If Bannister had begun running faster than the “steady but grueling pace”\n(paragraph 7) set by his “rabbit,” he would likely not have had enough energy to finish the\nrace. As paragraph 6 notes, “the runner conserves about 15 percent of his or her effort” by\nallowing the rabbit to set the pace. Bannister had \"lost his instinctive feel for his pace\"\n(paragraph 7) in the excitement of the race. If he had given in to his impulse to run faster\nand bypassed the rabbit at that point in the race, it would have cost him energy, and, in turn,\nthe record.\nH. Incorrect. The sentence from paragraph 7 describes how Bannister leaped ahead of\nChataway, his second “rabbit,” at the appropriate time in the effort to break the record.\nChataway had “surged forward, leading Bannister at this same punishing rate for another lap\nand a half” (paragraph 7) before Bannister moved past him.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q038-explanation-1.png\" alt=\"Official explanation for source question 38; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?",
    "promptHtml": "<p>Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target.” (paragraph 4)",
        "text": "“By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target.” (paragraph 4)"
      },
      {
        "id": "B",
        "html": "“When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.” (paragraph 6)",
        "text": "“When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.” (paragraph 6)"
      },
      {
        "id": "C",
        "html": "“Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted ‘Faster!’ at Brasher.” (paragraph 7)",
        "text": "“Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted ‘Faster!’ at Brasher.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "“At the beginning of the back straightaway of the track, Bannister bolted past Chataway.” (paragraph 7)",
        "text": "“At the beginning of the back straightaway of the track, Bannister bolted past Chataway.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q039",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "39",
      "pages": [
        27
      ]
    },
    "explanation": "The question asks how Bannister’s loss in the 1952 Olympics influenced his decision to pursue\nbreaking the four-minute-mile barrier.\nA. Incorrect. While Bannister recognized the weaknesses that led to his poor performance in the\nOlympics and worked “to develop endurance and speed” (paragraph 3), the loss made him\n“determined to redeem himself” (paragraph 2). The desire for redemption influenced\nBannister to focus specifically on running a mile in under four minutes, rather than on\nwinning other races or training for other distances.\nB. Incorrect. Although Bannister developed an “intensive interval training” plan to improve his\n“endurance and speed” (paragraph 3), he applied a different approach only after his progress\ntoward a four-minute mile reached a “plateau” (paragraph 4) in 1954. It was his desire to\n“shave off at least one more second in order to reach his target” (paragraph 4) that\nprompted him to take a break from interval training and go mountain climbing for three days.\nC. CORRECT. Bannister sought to redeem himself after “he finished in a dismal fourth place” at\nthe Olympics (paragraph 2). He thought that his performance “was a disappointment for him\nand his country, Great Britain,” and he responded by setting a goal to successfully conquer\nthe four-minute mile, which was considered the “ultimate prize” (paragraph 2).\nD. Incorrect. Bannister’s loss at the 1952 Olympics motivated him to change his training focus\nto reaching the “ultimate prize” (paragraph 2) of breaking the four-minute-mile barrier, which\nno other runner had accomplished. His loss at the Olympics did not present him with a\nspecific opportunity to reach this goal.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q039-explanation-1.png\" alt=\"Official explanation for source question 39; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minute-mile barrier by",
    "promptHtml": "<p>Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minute-mile barrier by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "allowing him to recognize his weaknesses and improve his running ability.",
        "text": "allowing him to recognize his weaknesses and improve his running ability."
      },
      {
        "id": "B",
        "html": "prompting him to take a different approach to his regular training.",
        "text": "prompting him to take a different approach to his regular training."
      },
      {
        "id": "C",
        "html": "motivating him to prove to himself that he could set and achieve a goal.",
        "text": "motivating him to prove to himself that he could set and achieve a goal."
      },
      {
        "id": "D",
        "html": "giving him the opportunity to reach a goal no runner had ever accomplished.",
        "text": "giving him the opportunity to reach a goal no runner had ever accomplished."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q040",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "40",
      "pages": [
        28
      ]
    },
    "explanation": "The question asks how interval training affected Bannister’s performance.\nE. Incorrect. The moderation of his pace was achieved through the use of “rabbits,” described in\nparagraph 6, more than through his method of interval training.\nF. Incorrect. Bannister worked individually during the interval training period and then paced\nhimself with a two-person team of “rabbits,” which were introduced in paragraph 5 and\nexplained in paragraph 6. It was the use of “rabbits” during the race that helped him\nconserve some of his effort, not the interval training.\nG. CORRECT. As paragraph 3 states, the goal of Bannister’s training program was to “develop\nendurance and speed,” which are synonyms of the words “stamina” and “pace.”\nH. Incorrect. Although Bannister “let his body recover for two minutes” (paragraph 3) during\ninterval training, this was not the primary effect of the training on Bannister’s performance.\nInstead, interval training allowed him to develop greater endurance and speed.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q040-explanation-1.png\" alt=\"Official explanation for source question 40; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "How did interval training affect Bannister’s performance?",
    "promptHtml": "<p>How did interval training affect Bannister’s performance?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "It helped him learn how to moderate his pace while running.",
        "text": "It helped him learn how to moderate his pace while running."
      },
      {
        "id": "B",
        "html": "It helped him conserve effort when running with teammates.",
        "text": "It helped him conserve effort when running with teammates."
      },
      {
        "id": "C",
        "html": "It helped him improve his pace and stamina while running.",
        "text": "It helped him improve his pace and stamina while running."
      },
      {
        "id": "D",
        "html": "It helped him decrease his recovery time after an intense run.",
        "text": "It helped him decrease his recovery time after an intense run."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-2021-2022-form-b-pdf-shsat-2021-2022-b-q041",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "41",
      "pages": [
        28
      ]
    },
    "explanation": "The question asks how the author's use of chronological structure contributes to the\ndevelopment of ideas in the passage.\nA. Incorrect. While paragraph 4 mentions the “plateau” Bannister dealt with and the break that\n“permitted his muscles to recuperate,” the chronological structure of the passage focuses\nmainly on the progression of Bannister’s process over time.\nB. Incorrect. Even though the passage suggests that Bannister’s ability to break the four-\nminute-mile barrier improved and that he felt “prepared to attempt to break the world\nrecord” (paragraph 4), the chronological structure of the passage primarily serves to show\nhow Bannister’s progress over time led to his success.\nCc. Incorrect. The chronological structure of the passage begins with an acknowledgment that\nBannister was inspired to break the four-minute-mile barrier by his loss at the 1952 Olympics\n(paragraph 2); however, the overall organization of the passage highlights his dedicated\nefforts over time to break the four-minute-mile barrier.\nD. CORRECT. The chronological structure of the passage follows the progression of Bannister’s\ntraining from his loss at the 1952 Olympics to the race where he ran the first sub-four-minute\nmile on May 6, 1954 (paragraph 5).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q041-explanation-1.png\" alt=\"Official explanation for source question 41; original printed answer labels retained.\" width=\"693\"></p>",
    "points": 1,
    "prompt": "How does the author’s use of chronological structure contribute to the development of ideas in the passage?",
    "promptHtml": "<p>How does the author’s use of chronological structure contribute to the development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "It presents the increasing physical effects of Bannister’s intense training methods as he prepared to break the four-minute-mile barrier.",
        "text": "It presents the increasing physical effects of Bannister’s intense training methods as he prepared to break the four-minute-mile barrier."
      },
      {
        "id": "B",
        "html": "It shows the increase in Bannister’s confidence in his ability to break the four-minute-mile barrier.",
        "text": "It shows the increase in Bannister’s confidence in his ability to break the four-minute-mile barrier."
      },
      {
        "id": "C",
        "html": "It emphasizes the key events in Bannister’s life that inspired him to break the four-minute-mile barrier.",
        "text": "It emphasizes the key events in Bannister’s life that inspired him to break the four-minute-mile barrier."
      },
      {
        "id": "D",
        "html": "It highlights the progression of Bannister’s training and details about his successful attempt to break the four-minute-mile barrier.",
        "text": "It highlights the progression of Bannister’s training and details about his successful attempt to break the four-minute-mile barrier."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const aMiracleMile20212022FormBPassageSet: ExamPassageSet = {
  id: "ela-a-miracle-mile-2021-2022-form-b",
  versionLabels: ["2021-2022 Form B"],
  label: "2021-2022 Form B",
  section: "reading",
  questionCount: aMiracleMile20212022FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "a-miracle-mile-2021-2022-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2021-2022-form-b","label":"2021-2022 Form B","year":"2021-2022","form":"B","packageId":"6248d78c0e22a3960fbca838c5f1494de00c969a089f4c878b37ea53f6d173cb"},
    title: "A Miracle Mile",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.</p>\n<p data-numbered=\"true\">Roger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier.</p>\n<p data-numbered=\"true\">Bannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.</p>\n<p data-numbered=\"true\">By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.</p>\n<p data-numbered=\"true\">As a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”</p>\n<p data-numbered=\"true\">In track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.</p>\n<p data-numbered=\"true\">Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace, completing the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of the back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”</p>\n<p data-numbered=\"true\">Soon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.</p>",
    text: aMiracleMile20212022FormBPassageText,
    versionLabel: "2021-2022 Form B",
  }),
  questions: aMiracleMile20212022FormBQuestions,
};
