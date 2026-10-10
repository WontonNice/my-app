import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const championOfTheChannel20202021FormAPassageText = "In 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.\n\nCrossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.\n\nFor decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.\n\nTo prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.\n\nOn August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.\n\nThroughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.\n\nFor hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory.\n\nAfter fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.\n\nWhen Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but she also inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.";

const championOfTheChannel20202021FormAQuestions: ExamQuestion[] = [
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q16",
    "explanation": "16. The question asks what the newspaper editor’s comments in paragraph 1 reveal about Ederle’s challenges leading up to her attempt to swim across the channel.\n\nE. Incorrect. The idea that Ederle was at a disadvantage because she was American rather than English, and thus less familiar with the channel, was not the basis for the newspaper editor’s comments about the outcome of her swim.\n\nF. Incorrect. The passage establishes that Ederle was a highly accomplished swimmer who had won major world competitions (“Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals” [paragraph 1]).\n\nG. Incorrect. The newspaper editor’s point was that Ederle would be unsuccessful in her attempt to complete the swim because she was a woman, not that people were uncomfortable with the idea since no woman had attempted it before.\n\nH. CORRECT. The comments reveal a lack of social support since many people believed that a woman, no matter how skilled a swimmer, did not have the strength to overcome the physical challenges that the dangerous channel waters presented (“He claimed that ‘even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.’ ” [paragraph 1]).",
    "points": 1,
    "prompt": "What do the newspaper editor’s comments in paragraph 1 reveal about the challenges Ederle faced in attempting her feat?",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "Regardless of her ability, being an American put Ederle at a serious disadvantage over a Londoner, who would be more familiar with the English Channel."
      },
      {
        "id": "B",
        "text": "At the time, Ederle still needed more training in order to succeed in the daunting task of swimming the English Channel."
      },
      {
        "id": "C",
        "text": "While Ederle could participate in athletic competition, some people were not comfortable with her attempt to swim the channel because no woman had ever attempted it before."
      },
      {
        "id": "D",
        "text": "In spite of her previous achievements, Ederle still experienced social as well as physical obstacles in attempting to swim the channel."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q17",
    "explanation": "17. The question asks for the best summary of Ederle’s steps to prepare for her second attempt to swim across the English Channel.\n\nA. CORRECT. Ederle’s preparation is outlined in paragraph 4. This option is correct because it acknowledges the idea that Ederle involved her sister in this process, and it details the efforts the two took to improve Ederle’s equipment, including sealing her goggles with wax and designing a better swimsuit.\n\nB. Incorrect. The option focuses on Ederle’s actions in the moments before her swim (covering her body with grease for insulation) and during her swim (finding her “sphere”), not her overall preparation methods.\n\nC. Incorrect. The option refers to a way that Ederle’s coach helped Ederle keep her strokes in rhythm during her swim. While this option suggests that Ederle and her coach had made thoughtful preparations, it does not address the many other steps that Ederle took to prepare for the swim.\n\nD. Incorrect. The option does not refer to the series of steps that Ederle took to prepare for her swim, but rather to just one of the efforts made (improving equipment), without acknowledging her sister’s contributions.",
    "points": 1,
    "prompt": "Which sentence is the best summary of the steps that Ederle took to prepare for her second attempt to swim across the English Channel?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Working with her sister, Ederle waterproofed her goggles using melted candle wax to seal the edges and designed a two-piece silk bathing suit that was lightweight and would not stretch out during the long swim."
      },
      {
        "id": "B",
        "text": "Ederle covered her body in numerous layers of grease for insulation and focused on finding her “sphere” during her swim."
      },
      {
        "id": "C",
        "text": "Ederle began training with her coach, who played music while she swam to help her time her strokes to the music."
      },
      {
        "id": "D",
        "text": "Ederle focused on developing better equipment than the standard swimsuit that proved cumbersome during her first attempt to cross the channel."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q18",
    "explanation": "18. The question asks about the effect of the word “insurmountable,” which means “incapable of being overcome,” in paragraph 4.\n\nE. Incorrect. Ederle did not complete her first swim because she became ill (“Just six miles short of finishing, she became ill, and her coach had to haul her out of the water.” [paragraph 3]), not because the suit made it impossible for Ederle to complete her swim.\n\nF. Incorrect. The author uses the word “insurmountable” to draw attention to the increased difficulty caused by the swimsuit, not to draw attention to the sisters’ creativity in solving the problem.\n\nG. CORRECT. The suit Ederle wore during her first attempt to swim the channel “stretched out, filling with water and creating drag” (paragraph 4), which likely contributed to her failed attempt to swim across the channel.\n\nH. Incorrect. The passage does not address whether the original swimsuit was custom made, simply that the swimsuit created additional difficulties for Ederle in a situation that was already difficult.",
    "points": 1,
    "prompt": "The word “insurmountable” is used to highlight",
    "instructions": "Read this sentence from paragraph 4.",
    "stimulus": "During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable.",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "how the bathing suit made it impossible for Ederle to make it across the channel."
      },
      {
        "id": "B",
        "text": "how Ederle and her sister decided to improve Ederle’s swimming equipment in a creative way."
      },
      {
        "id": "C",
        "text": "that the flaws in Ederle’s bathing suit made a difficult task even more complicated."
      },
      {
        "id": "D",
        "text": "that the swimming equipment Ederle used needed to be custom made for her attempt."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q19",
    "explanation": "19. The question asks how a problem-and-solution structure in paragraph 5 contributes to the ideas presented in the passage.\n\nA. Incorrect. The details in paragraph 5 do not provide a connection between the cold temperature of the water and the effectiveness of Ederle’s training.\n\nB. Incorrect. The difficulties Ederle encountered were only partially relieved by her team, and her team’s efforts to ensure Ederle’s safety are not explained in the passage.\n\nC. Incorrect. The paragraph does not focus on the relationship between the problems Ederle encountered at the start of her swim and the problems she encountered during or near the end of her swim.\n\nD. CORRECT. The paragraph describes how the water’s temperature made Ederle uncomfortable and made it difficult for her to regulate her stroke. The paragraph continues with the explanation of how she overcame these issues by focusing her mind on the sea and tuning out the distractions in her surroundings (“the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away.” [paragraph 5]).",
    "points": 1,
    "prompt": "Which statement describes how the author’s use of a problem-and-solution structure in paragraph 5 contributes to the development of ideas in the passage?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "Detailing the challenges presented by the cold channel waters highlights the effectiveness of Ederle’s training."
      },
      {
        "id": "B",
        "text": "Describing Ederle’s physical difficulties during her swim provides evidence of the team effort required to ensure her safety."
      },
      {
        "id": "C",
        "text": "Explaining the difficulties that arose early in the effort helps predict the additional obstacles that occurred during Ederle’s attempt."
      },
      {
        "id": "D",
        "text": "Illustrating Ederle’s process of blocking out her discomfort shows that swimming the channel was both a mental and a physical challenge."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q20",
    "explanation": "20. The question asks for the best support for the idea that Ederle’s swim across the channel was successful because of her innovative approach to the challenge.\n\nE. Incorrect. The sentence from paragraph 1 shows that Ederle’s performance was groundbreaking but not necessarily innovative.\n\nF. Incorrect. The layers of grease mentioned in the sentence from paragraph 5 primarily served to insulate (keep Ederle warm) by helping her maintain her body temperature in the cold water; neither the sentence in paragraph 5 nor surrounding text evidence establish that this was an innovative practice.\n\nG. CORRECT. The sentence from paragraph 5 explains that Ederle employed a newly developed, or innovative, type of stroke that allowed her to maintain her pace through the rough water.\n\nH. Incorrect. While the sentence from paragraph 7 relates to a small component of Ederle’s success (the storm calming and the tide shifting), those changes were not a result of Ederle employing innovative techniques.",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Ederle succeeded in swimming across the channel because of her innovative approach to the challenge?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours.” (paragraph 1)"
      },
      {
        "id": "B",
        "text": "“At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation.” (paragraph 5)"
      },
      {
        "id": "C",
        "text": "“Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.” (paragraph 5)"
      },
      {
        "id": "D",
        "text": "“No longer fighting against her, the sea pushed her toward the shore and victory.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q21",
    "explanation": "21. The question asks for an explanation of how paragraph 7 contributes to the development of a central idea of the passage.\n\nA. Incorrect. Although Ederle needed to remain focused on her goal, the idea that her physical strength and mental fortitude allowed her to maintain this focus is not illustrated in paragraph 7. Paragraph 7 instead contributes to the development of a central idea by emphasizing Ederle’s emotional responses over the course of her swim.\n\nB. Incorrect. While paragraph 7 describes some of the physical challenges that Ederle faced (“The salty water caused her tongue to swell and inflamed her ears.”), the statement that she “pushed herself to the edge of her physical capabilities” is not the most accurate way to describe the focus of this paragraph. This option is incorrect because it omits the paragraph’s focus on Ederle’s emotional responses to the challenging circumstances of her swim.\n\nC. Incorrect. While paragraph 7 describes Ederle’s feelings of happiness and amusement during her swim, these feelings were caused by her anticipation and excitement as she approached achieving her goal, not by the severe weather.\n\nD. CORRECT. Paragraph 7 contributes to the development of a central idea by describing Ederle’s emotional state over the course of her swim. A central idea of the passage is that Ederle’s passion and determination allowed her to accomplish her goal of being the first woman to cross the English Channel. Paragraph 7 shows her passion and determination by emphasizing the positive emotions Ederle felt as she progressed during her swim, despite the unfavorable conditions (“For hours Ederle swam, dodging debris with an amused smile” and “Yet Ederle felt indescribably happy as she churned through the sea”).",
    "points": 1,
    "prompt": "Paragraph 7 contributes to the development of a central idea of the passage by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "illustrating that Ederle’s physical strength and mental fortitude allowed her to stay focused on her goal."
      },
      {
        "id": "B",
        "text": "conveying that Ederle pushed herself to the edge of her physical capabilities in order to complete the swim."
      },
      {
        "id": "C",
        "text": "highlighting the impact the severe weather had on Ederle’s emotions during her swim."
      },
      {
        "id": "D",
        "text": "emphasizing the surge of emotions Ederle felt as she came closer to achieving a personal goal."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q22",
    "explanation": "22. The question asks how the idea that many people were interested in Ederle’s attempt to swim the channel is mainly illustrated in the passage.\n\nE. Incorrect. While paragraph 3 states that “a rival female swimmer was preparing to make her second attempt at the crossing as well,” which suggests that Ederle’s competitor was interested in Ederle’s attempt to swim the channel, this information does not establish that many people were interested in Ederle’s attempt.\n\nF. CORRECT. Paragraph 6 includes the detail that newspaper reporters followed Ederle on a tugboat and “wired dispatches of her progress to shore,” which suggests that an audience was waiting for news about Ederle’s progress. Paragraph 8 states that when Ederle reached shore, “the waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky.” Further, paragraph 9 states that when Ederle returned to New York, “thousands of people” attended a parade in her honor. These details describing the celebration of Ederle’s feat further illustrate the idea that many people were interested in what she had accomplished.\n\nG. Incorrect. While paragraph 9 states that “more than 60,000 people credited [Ederle] with motivating them to earn their American Red Cross swimming certificates,” this detail describes how Ederle’s historic swim influenced people after the fact but does not illustrate the level of public interest during the attempt itself.\n\nH. Incorrect. Paragraph 6 provides details about how Ederle’s “coach, family, and friends” displayed signs, played songs, and “passed her baby bottles of broth” to help her maintain her motivation and stamina. However, these resources do not suggest the idea that people beyond Ederle’s immediate support team were interested in her attempt to swim the channel.",
    "points": 1,
    "prompt": "The idea that many people were interested in Ederle’s attempt to swim the channel is illustrated in the passage mainly through the",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "information about Ederle’s competition with another female swimmer who was also attempting to cross the channel."
      },
      {
        "id": "B",
        "text": "details about the reports of Ederle’s progress during the swim and the celebration of her successful completion of the swim."
      },
      {
        "id": "C",
        "text": "details about how Ederle’s historic swim contributed to an increase in the number of people learning how to swim."
      },
      {
        "id": "D",
        "text": "information about the resources Ederle used throughout her swim to maintain her motivation and stamina."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q23",
    "explanation": "23. The question asks for the sentence from the passage that best conveys the author’s perspective about the impact of Ederle’s swim.\n\nA. Incorrect. Although this option shows Ederle’s determination to accomplish her goal, it does not convey the author’s perspective. Rather, the option reinforces Ederle’s own perspective about the challenge that she was facing.\n\nB. Incorrect. The sentence presented in this option is incorrect because it relates to Ederle’s state of mind as she came closer to achieving her goal and does not provide details about the author’s opinion of the impact of Ederle’s accomplishment.\n\nC. Incorrect. The sentence presented in this option is incorrect because it simply presents Ederle’s emotional state as she nears her goal and does not provide information about the author’s perspective.\n\nD. CORRECT. This option is correct because, throughout the passage, the author emphasizes that Ederle’s accomplishment was memorable and great, which is best stated in the sentence from paragraph 8.",
    "points": 1,
    "prompt": "Which sentence from the passage best conveys the author’s perspective regarding the impact of Ederle’s accomplishment?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "“Undeterred, Ederle decided to try again.” (paragraph 3)"
      },
      {
        "id": "B",
        "text": "“For hours Ederle swam, dodging debris with an amused smile.” (paragraph 7)"
      },
      {
        "id": "C",
        "text": "“Yet Ederle felt indescribably happy as she churned through the sea.” (paragraph 7)"
      },
      {
        "id": "D",
        "text": "“Ederle had swum into history.” (paragraph 8)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2020-2021-form-a-champion-of-the-channel-q24",
    "explanation": "24. The question asks how the table supports the information in paragraph 9.\n\nE. CORRECT. The table supports the information in paragraph 9 by showing that people have continued to swim the channel and have improved upon past records. The information in the table about records set by those who came after Ederle builds upon the idea that “Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals” (paragraph 9).\n\nF. Incorrect. Even though paragraph 9 states that Ederle “inspired [everyday American citizens] to be more active” and the table presents the time for the current female record holder, there is no indication in paragraph 9 or in the table that the record holder was inspired by Ederle.\n\nG. Incorrect. Although paragraph 3 mentions that Ederle had a female rival and the table includes the speed records of other female swimmers, paragraph 9 focuses on the impact Ederle’s swim had on average Americans (“inspired them to be more active” and “motivating them to earn their American Red Cross swimming certificates”) and does not provide information about other female swimmers competing with Ederle to set the channel-swim record.\n\nH. Incorrect. Although paragraph 1 mentions that Ederle “broke the men’s record by two hours” and the table allows for comparisons between the earliest speed records and those of the present day, there is no mention in paragraph 9 of past, present, or future channel-swim records.",
    "points": 1,
    "prompt": "The table supports the information in paragraph 9 mainly by",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "emphasizing that people have continued to swim across the channel and have significantly reduced the speed record."
      },
      {
        "id": "B",
        "text": "suggesting that Ederle inspired women to swim across the channel in an attempt to break the current speed record."
      },
      {
        "id": "C",
        "text": "revealing that other women competed with Ederle to set a record time for swimming across the English Channel."
      },
      {
        "id": "D",
        "text": "providing a comparison between the earliest channel-swimming records and the current record times."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const championOfTheChannel20202021FormAPassageSet: ExamPassageSet = {
  id: "ela-champion-of-the-channel-2020-2021-form-a",
  label: "2020–2021 Form A, Questions 16–24",
  section: "reading",
  questionCount: championOfTheChannel20202021FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "champion-of-the-channel-2020-2021-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Champion of the Channel",
    image: {"alt":"Champion of the Channel illustration","src":"/exam-images/champion-of-the-channel-2020-2021-form-a-passage.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>In 1926 an editor at the <em>London Daily News</em> predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.</p><p>Crossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.</p><p>For decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.</p><p>To prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.</p><p>On August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.</p><p>Throughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.</p><p>For hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory.</p><p>After fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.</p><p>When Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but she also inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.</p>",
    text: championOfTheChannel20202021FormAPassageText,
    versionLabel: "2020–2021 Form A",
  }),
  questions: championOfTheChannel20202021FormAQuestions,
};
