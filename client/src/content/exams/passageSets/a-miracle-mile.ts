import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const aMiracleMilePassageText = "In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.\n\n\nRoger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier. \n\n\n\n\nBannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.\n\n\nBy early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.\n\n\nAs a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”\n\n\nIn track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.\n\n\nPropelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace,\ncompleting the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of\nthe back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”\n\n\nSoon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.";

const aMiracleMileQuestions: ExamQuestion[] = [
  {
    "id": "passage-1",
    "points": 1,
    "prompt": "The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph 1 affect the tone of the paragraph because they",
    "promptHtml": "The words “feat,” “humanly impossible,” and “impenetrable barrier” in paragraph&nbsp;1 affect the tone of the paragraph because they",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "highlight the idea that only the most skilled runners would be able to run a four-minute mile",
        "text": "highlight the idea that only the most skilled runners would be able to run a four-minute mile"
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
    "id": "a-miracle-mile-2",
    "points": 1,
    "prompt": "How did interval training affect Bannister’s performance?",
    "promptHtml": "How did interval training affect Bannister’s performance?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It helped him learn how to moderate his pace while running.",
        "text": "It helped him learn how to moderate his pace while running."
      },
      {
        "id": "B",
        "html": "It helped him understand the importance of running with a team.",
        "text": "It helped him understand the importance of running with a team."
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
    "id": "a-miracle-mile-3",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Bannister needed an alternative to “logical planning” in order to accomplish his goal?",
    "promptHtml": "Which sentence best supports the idea that Bannister needed an alternative to “logical planning” in order to accomplish his goal?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“Bannister’s performance was a disappointment for him and his country, Great Britain.” (paragraph&nbsp;2)",
        "text": "“Bannister’s performance was a disappointment for him and his country, Great Britain.” (paragraph 2)"
      },
      {
        "id": "B",
        "html": "“The amateur athlete decided to use intensive interval training to develop endurance and speed.” (paragraph&nbsp;3)",
        "text": "“The amateur athlete decided to use intensive interval training to develop endurance and speed.” (paragraph 3)"
      },
      {
        "id": "C",
        "html": "“For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap.” (paragraph&nbsp;3)",
        "text": "“For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap.” (paragraph 3)"
      },
      {
        "id": "D",
        "html": "“Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days.” (paragraph&nbsp;4)",
        "text": "“Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-4",
    "points": 1,
    "prompt": "Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?",
    "promptHtml": "Which sentence from the passage indicates that Bannister nearly made a mistake that would have cost him the world record?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target.” (paragraph&nbsp;4)",
        "text": "“By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target.” (paragraph 4)"
      },
      {
        "id": "B",
        "html": "“When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.” (paragraph&nbsp;6)",
        "text": "“When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.” (paragraph 6)"
      },
      {
        "id": "C",
        "html": "“Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted ‘Faster!’ at Brasher.” (paragraph&nbsp;7)",
        "text": "“Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted ‘Faster!’ at Brasher.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "“At the beginning of the back straightaway of the track, Bannister bolted past Chataway.” (paragraph&nbsp;7)",
        "text": "“At the beginning of the back straightaway of the track, Bannister bolted past Chataway.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-5",
    "points": 1,
    "prompt": "The phrase “a new mindset had taken root” in paragraph 8 conveys the idea that",
    "promptHtml": "The phrase “a new mindset had taken root” in paragraph&nbsp;8 conveys the idea that",
    "topic": "Central Idea & Theme",
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
        "html": "entering races in an attempt to break the four-minute-mile barrier became commonplace for elite runners.",
        "text": "entering races in an attempt to break the four-minute-mile barrier became commonplace for elite runners."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-6",
    "points": 1,
    "prompt": "Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minutemile barrier by",
    "promptHtml": "Bannister’s loss in the 1952 Olympics influenced his decision to pursue breaking the four-minutemile barrier by",
    "topic": "Central Idea & Theme",
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
    "id": "a-miracle-mile-7",
    "points": 1,
    "prompt": "How does the author’s use of chronological structure contribute to the development of ideas in the passage?",
    "promptHtml": "How does the author’s use of chronological structure contribute to the development of ideas in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It presents the increasing physical effects of Bannister’s intense training methods as he prepared to break the four-minute-mile barrier.",
        "text": "It presents the increasing physical effects of Bannister’s intense training methods as he prepared to break the four-minute-mile barrier."
      },
      {
        "id": "B",
        "html": "It shows the increase in Bannister’s confidence in his ability to break the four-minutemile barrier",
        "text": "It shows the increase in Bannister’s confidence in his ability to break the four-minutemile barrier"
      },
      {
        "id": "C",
        "html": "It emphasizes the key events in Bannister’s life that inspired him to break the four-minutemile barrier",
        "text": "It emphasizes the key events in Bannister’s life that inspired him to break the four-minutemile barrier"
      },
      {
        "id": "D",
        "html": "It highlights the progression of Bannister’s training and details about his successful attempt to break the four-minute-mile barrier.",
        "text": "It highlights the progression of Bannister’s training and details about his successful attempt to break the four-minute-mile barrier."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "a-miracle-mile-8",
    "points": 1,
    "prompt": "Read these sentences from paragraph 7.\n\nBannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”\n\nThe sentences contribute to the development of ideas in the passage by showing that Bannister",
    "promptHtml": "Read these sentences from paragraph&nbsp;7.<br>\n<strong>Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.”</strong><br>\nThe sentences contribute to the development of ideas in the passage by showing that Bannister",
    "topic": "Central Idea & Theme",
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
  }
];

export const aMiracleMilePassageSet: ExamPassageSet = {
  id: "ela-a-miracle-mile",
  questionCount: aMiracleMileQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "a-miracle-mile",
    passageType: "informational",
    title: "A Miracle Mile",
    richText: "<p>In the 1950s people compared running one mile in four minutes to scaling Mount Everest and nicknamed the feat a “dream mile.” Although such an accomplishment was considered humanly impossible, several elite runners aimed to break that supposedly impenetrable barrier. One of them was a twenty-five-year-old medical student named Roger Bannister.</p><p><br>Roger Bannister had tasted failure during the 1952 Olympics. There, he was favored to win the 1,500-meter competition, a distance slightly shorter than a mile, but he finished in a dismal fourth place instead. Bannister’s performance was a disappointment for him and his country, Great Britain. Determined to redeem himself, Bannister postponed his plans to retire from racing and focused on the ultimate prize—breaking the four-minute-mile barrier. </p><p><br></p><p>Bannister attacked the elusive milestone with a positive attitude and logical planning. The amateur athlete decided to use intensive interval training to develop endurance and speed. For these workouts, Bannister ran an interval of ten consecutive laps on a quarter-mile track, aiming for sixty seconds each lap. In between intervals, he let his body recover for two minutes.</p><p><br>By early 1954, Bannister had succeeded in lowering his quarter-mile pace to sixty-one seconds, but he had to shave off at least one more second in order to reach his target. Frustrated by the plateau he had reached, Bannister took a break from training and went mountain climbing for three days. The rest from running permitted his muscles to recuperate and left him feeling refreshed. When Bannister returned to the track, he completed ten quarter-mile-long intervals at fifty-nine seconds each. He finally felt prepared to attempt to break the world record.</p><p><br>As a member of the Amateur Athletic Association (AAA), Bannister joined the AAA team for a track meet against Oxford University. The event took place on a cinder track in Oxford on May 6, 1954. Bannister and his two AAA teammates, Chris Chataway and Chris Brasher, were close friends and frequent running partners. Chataway and Brasher agreed to help Bannister accomplish his goal by being his “rabbits.”</p><p><br>In track and field, rabbits are runners who enter the race solely to pace a teammate for a segment of the course. Typically, a runner settles in behind the rabbit and allows the rabbit to set an appropriate tempo. Additionally, by running behind the rabbit, the runner conserves about 15 percent of his or her effort. When the starting pistol fired, Brasher pounced into the lead, and Bannister followed behind his first rabbit.</p><p><br>Propelled by the excitement, Bannister lost his instinctive feel for his pace and shouted “Faster!” at Brasher. Brasher, however, remained composed and maintained his current steady but grueling pace,<br>completing the first two laps in a desirable one minute and fifty-eight seconds. Then Chataway surged forward, leading Bannister at this same punishing rate for another lap and a half. At the beginning of<br>the back straightaway of the track, Bannister bolted past Chataway. Bannister said, “I felt that the moment of a lifetime had come. There was no pain, only a great unity of movement and aim.” Bannister crossed the finish line in 3 minutes 59.4 seconds. The ecstatic crowd erupted the moment the timekeeper announced the word “three.”</p><p><br>Soon after Bannister’s achievement, four other athletes matched his performance. A new mindset had taken root among runners. Over the years, the record continued to fall. However, the current record, 3 minutes 43.13 seconds, has stood unbroken since 1999. Some question whether this record represents the limits of human ability. But perhaps there is another Bannister, an athlete who, with willpower and dedication, will accomplish the miraculous.</p>",
    text: aMiracleMilePassageText,
  }),
  questions: aMiracleMileQuestions,
};
