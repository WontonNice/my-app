import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const championOfTheChannel20242025FormAPassageText = "In 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.\n\nCrossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.\n\nFor decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.\n\nTo prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.\n\nOn August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.\n\nThroughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.\n\nFor hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory.\n\nAfter fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.\n\nWhen Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but also she inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.";

const championOfTheChannel20242025FormAQuestions: ExamQuestion[] = [
  {
    "id": "champion-of-the-channel-2024-2025-form-a-1",
    "explanation": "26.   The question asks what the newspaper editor’s comments in paragraph 1 reveal about Ederle’s challenges leading up to her attempt to swim across the channel.\n\nE: Incorrect. The idea that Ederle was at a disadvantage because she was American rather than English, and thus less familiar with the channel, was not the basis for the newspaper editor’s comments about the outcome of her swim.\n\nF: Incorrect. The passage establishes that Ederle was a highly accomplished swimmer who had won major world competitions (“Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals” [paragraph 1]).\n\nG: Incorrect. The newspaper editor’s point was that Ederle would be unsuccessful in her attempt to complete the swim because she was a woman, not that people were uncomfortable with the idea since no woman had attempted it before.\n\nH: Correct. The comments reveal a lack of social support since many people believed that a woman, no matter how skilled a swimmer, did not have the strength to overcome the physical challenges that the dangerous channel waters presented (“He claimed that ‘even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.’ ” [paragraph 1]).",
    "points": 1,
    "prompt": "What do the newspaper editor’s comments in paragraph 1 reveal about the challenges Ederle faced in attempting her feat?",
    "promptHtml": "<p>What do the newspaper editor’s comments in paragraph 1 reveal about the challenges Ederle faced in attempting her feat?</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-2",
    "explanation": "27.   The question asks about the effect of the word “insurmountable,” which means “incapable of being overcome,” in paragraph 4.\n\nA: Incorrect. Ederle did not complete her first swim because she became ill (“Just six miles short of finishing, she became ill, and her coach had to haul her out of the water.” [paragraph 3]), not because the suit made it impossible for Ederle to complete her swim.\n\nB: Incorrect. The author uses the word “insurmountable” to draw attention to the increased difficulty caused by the suit, not to draw attention to the sisters’ creativity in solving the problem.\n\nC: Correct. The suit Ederle wore during her first attempt to swim the channel “stretched out, filling with water and creating drag” (paragraph 4), which likely contributed to her failed attempt to swim across the channel.\n\nD: Incorrect. The passage does not address whether the original suit was custom made, simply that the suit created additional difficulties for Ederle in a situation that was already difficult.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nDuring her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable.\n\nThe word “insurmountable” is used to highlight",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><p><strong>During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable.</strong></p></blockquote><p>The word “insurmountable” is used to highlight</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-3",
    "explanation": "28.   The question asks how a problem-and-solution structure in paragraph 5 contributes to the ideas presented in the passage.\n\nE: Incorrect. The details in paragraph 5 do not provide a connection between the cold temperature of the water and the effectiveness of Ederle’s training.\n\nF: Incorrect. The difficulties Ederle encountered were only partially relieved by her team, and her team’s efforts to ensure Ederle’s safety are not explained in the passage.\n\nG: Incorrect. The paragraph does not focus on the relationship between the problems Ederle encountered at the start of her swim and the problems she encountered during or near the end of her swim.\n\nH: Correct. The paragraph describes how the water’s temperature made Ederle uncomfortable and made it difficult for her to regulate her stroke. The paragraph continues with the explanation of how she overcame these issues by focusing her mind on the sea and tuning out the distractions in her surroundings (“the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away” [paragraph 5]).",
    "points": 1,
    "prompt": "Which statement describes how the author’s use of a problem-and-solution structure in paragraph 5 contributes to the development of ideas in the passage?",
    "promptHtml": "<p>Which statement describes how the author’s use of a problem-and-solution structure in paragraph 5 contributes to the development of ideas in the passage?</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-4",
    "explanation": "29.   The question asks for the best support for the idea that Ederle’s swim across the channel was successful because of her innovative approach to the challenge.\n\nA: Incorrect. The sentence from paragraph 1 shows that Ederle’s performance was groundbreaking but not necessarily innovative.\n\nB: Incorrect. The layers of grease mentioned in the sentence from paragraph 5 primarily served to insulate Ederle (keep her warm) by helping her maintain her body temperature in the cold water; neither the sentence in paragraph 5 nor the surrounding text evidence establishes that this was an innovative practice. Furthermore, the sentence does not show that she succeeded as a result of this approach.\n\nC: Correct. The sentence from paragraph 5 explains that Ederle employed a newly developed, or innovative, type of stroke that allowed her to maintain her pace through the rough water.\n\nD: Incorrect. The tugboat carrying Ederle’s supporters referenced in the sentence from paragraph 6 likely provided encouragement during Ederle's swim, but the sentence does not show that this approach was innovative or that it enabled Ederle's success.",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Ederle succeeded in swimming across the channel because of her innovative approach to the challenge?",
    "promptHtml": "<p>Which sentence <strong>best</strong> supports the idea that Ederle succeeded in swimming across the channel because of her innovative approach to the challenge?</p>",
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
        "text": "“The other [tugboat], displaying a sign that read ‘This way, ole kid!’ with an arrow pointing forward, transported her coach, family, and friends.” (paragraph 6)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2024-2025-form-a-5",
    "explanation": "30.   The question asks for an explanation of how paragraph 7 contributes to the development of a central idea of the passage.\n\nE: Incorrect. Although Ederle needed to remain focused on her goal, the idea that her physical strength and mental fortitude allowed her to maintain this focus is not illustrated in paragraph 7. Paragraph 7 instead contributes to the development of a central idea by emphasizing Ederle’s emotional responses over the course of her swim.\n\nF: Incorrect. While paragraph 7 describes some of the physical challenges that Ederle faced (“The salty water caused her tongue to swell and inflamed her ears”), the statement that she “pushed herself to the edge of her physical capabilities” is not the most accurate way to describe the focus of this paragraph. This option is incorrect because it omits the paragraph’s focus on Ederle’s emotional responses to the challenging circumstances of her swim.\n\nG: Incorrect. While paragraph 7 describes Ederle’s feelings of happiness and amusement during her swim, these feelings were caused by her anticipation and excitement as she approached achieving her goal, not by the severe weather.\n\nH: Correct. Paragraph 7 contributes to the development of a central idea by describing Ederle’s emotional state over the course of her swim. A central idea of the passage is that Ederle’s passion and determination allowed her to accomplish her goal of being the first woman to cross the English Channel. Paragraph 7 shows her passion and determination by emphasizing the positive emotions Ederle felt as she progressed during her swim, despite the unfavorable conditions (“For hours Ederle swam, dodging debris with an amused smile” and “Yet Ederle felt indescribably happy as she churned through the sea”).",
    "points": 1,
    "prompt": "Paragraph 7 contributes to the development of a central idea of the passage by",
    "promptHtml": "<p>Paragraph 7 contributes to the development of a central idea of the passage by</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-6",
    "explanation": "31.   The question asks for the sentence from the passage that best conveys the author’s perspective about the impact of Ederle’s swim.\n\nA: Incorrect. Although this option shows Ederle’s determination to accomplish her goal, it does not convey the author’s perspective. Rather, the option reinforces Ederle’s own perspective about the challenge that she was facing.\n\nB: Incorrect. The sentence presented in this option is incorrect because it relates to Ederle’s state of mind as she came closer to achieving her goal and does not provide details about the author’s opinion of the impact of Ederle’s accomplishment.\n\nC: Incorrect. The sentence presented in this option is incorrect because it simply presents Ederle’s emotional state as she nears her goal and does not provide information about the author’s perspective.\n\nD: Correct. This option is correct because, throughout the passage, the author emphasizes that Ederle’s accomplishment was memorable and great, which is best stated in the sentence from paragraph 8.",
    "points": 1,
    "prompt": "Which sentence from the passage best conveys the author’s perspective regarding the impact of Ederle’s accomplishment?",
    "promptHtml": "<p>Which sentence from the passage <strong>best</strong> conveys the author’s perspective regarding the impact of Ederle’s accomplishment?</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-7",
    "explanation": "32.   The question asks for the best summary of Ederle’s steps to prepare for her second attempt to swim across the English Channel.\n\nE: Correct. Ederle’s preparation is outlined in paragraph 4. This option is correct because it acknowledges the idea that Ederle involved her sister in this process, and it details the efforts the two took to improve Ederle’s equipment, including sealing her goggles with wax and designing a better swimsuit.\n\nF: Incorrect. The option focuses on Ederle’s actions in the moments before her swim (covering her body with grease for insulation) and during her swim (finding her “sphere”), not her overall preparation methods.\n\nG: Incorrect. The option refers to a way that Ederle’s coach helped Ederle keep her strokes in rhythm during her swim. While this option suggests that Ederle and her coach had made thoughtful preparations, it does not address the many other steps that Ederle took to prepare for the swim.\n\nH: Incorrect. The option does not refer to the series of steps that Ederle took to prepare for her swim, but rather to just one of the efforts made (improving equipment), without acknowledging her sister’s contributions.",
    "points": 1,
    "prompt": "Which sentence is the best summary of the steps that Ederle took to prepare for her second attempt to swim across the English Channel?",
    "promptHtml": "<p>Which sentence is the <strong>best</strong> summary of the steps that Ederle took to prepare for her second attempt to swim across the English Channel?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "Working with her sister, Ederle waterproofed her goggles using melted candle wax to seal the edges and designed a two-piece silk swimsuit that was lightweight and would not stretch out during the long swim."
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
        "text": "Ederle focused on developing better equipment than the standard bathing suit that proved cumbersome during her first attempt to cross the channel."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2024-2025-form-a-8",
    "explanation": "33.   The question asks how the idea that many people were interested in Ederle’s attempt to swim the channel is mainly illustrated in the passage.\n\nA: Incorrect. While paragraph 3 states that “a rival female swimmer was preparing to make her second attempt at the crossing as well,” which suggests that Ederle’s competitor was interested in Ederle’s attempt to swim the channel, this information does not establish that many people were interested in Ederle’s attempt.\n\nB: Correct. Paragraph 6 includes the detail that newspaper reporters followed Ederle on a tugboat and “wired dispatches of her progress to shore,” which suggests that an audience was waiting for news about Ederle’s progress. Paragraph 8 states that when Ederle reached the shore, “the waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky.” Further, paragraph 9 states that when Ederle returned to New York, “thousands of people” attended a parade in her honor. These details describing the celebration of Ederle’s feat further illustrate the idea that many people were interested in what she had accomplished.\n\nC: Incorrect. While paragraph 9 states that “more than 60,000 people credited [Ederle] with motivating them to earn their American Red Cross swimming certificates,” this detail describes how Ederle’s historic swim influenced people after the fact but does not illustrate the level of public interest during the attempt itself.\n\nD: Incorrect. Paragraph 6 provides details about how Ederle’s “coach, family, and friends” displayed signs, played songs, and “passed her baby bottles of broth” to help her maintain her motivation and stamina. However, these resources do not suggest the idea that people beyond Ederle’s immediate support team were interested in her attempt to swim the channel.",
    "points": 1,
    "prompt": "The idea that many people were interested in Ederle’s attempt to swim the channel is illustrated in the passage mainly through the",
    "promptHtml": "<p>The idea that many people were interested in Ederle’s attempt to swim the channel is illustrated in the passage <strong>mainly</strong> through the</p>",
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
    "id": "champion-of-the-channel-2024-2025-form-a-9",
    "explanation": "34.   The question asks how the table mainly builds on the information in the passage.\n\nE: Correct. The table supports the information in the passage by showing that people have continued to swim the channel and have significantly improved on past records. The information in the table about records set by those who came after Ederle builds on the idea that “Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals” (paragraph 9).\n\nF: Incorrect. Even though paragraph 9 states that Ederle “inspired [everyday American citizens] to be more active” and the table presents the time for the current female record holder, there is no indication in the passage or in the table that the subsequent female record holders were inspired to swim across the channel by Ederle.\n\nG: Incorrect. Although paragraph 3 mentions that Ederle had a female rival and the table includes the speed record of another female swimmer, the passage does not provide information about other female swimmers competing with Ederle to set the channel-swim record.\n\nH: Incorrect. Although paragraph 1 mentions that Ederle “broke the men’s record by two hours” and the table allows for comparisons between the earliest speed records and those of the present day, there is no mention in the passage of past, present, or future channel-swim records. The table allows for comparison, but this aspect of the table does not build on the information presented in the passage.",
    "points": 1,
    "prompt": "The table builds on the information in the passage mainly by",
    "promptHtml": "<p>The table builds on the information in the passage <strong>mainly</strong> by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "emphasizing that people have continued to swim across the channel and have significantly improved the speed record."
      },
      {
        "id": "B",
        "text": "suggesting that Ederle inspired many women to swim across the channel to attempt to break the current speed record."
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

export const championOfTheChannel20242025FormAPassageSet: ExamPassageSet = {
  id: "ela-champion-of-the-channel-2024-2025-form-a",
  versionLabels: ["2024-2025 Form A"],
  section: "reading",
  questionCount: championOfTheChannel20242025FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "champion-of-the-channel-2024-2025-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Champion of the Channel",
    image: {"alt":"Champion of the Channel illustration","src":"/exam-images/champion-of-the-channel-2024-form-a-passage.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">In 1926 an editor at the <em>London Daily News</em> predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.</p><p data-numbered=\"true\">Crossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.</p><p data-numbered=\"true\">For decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.</p><p data-numbered=\"true\">To prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.</p><p data-numbered=\"true\">On August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.</p><p data-numbered=\"true\">Throughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.</p><p data-numbered=\"true\">For hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory.</p><p data-numbered=\"true\">After fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.</p><p data-numbered=\"true\">When Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but also she inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.</p>",
    text: championOfTheChannel20242025FormAPassageText,
    versionLabel: "2024-2025 Form A",
  }),
  questions: championOfTheChannel20242025FormAQuestions,
};
