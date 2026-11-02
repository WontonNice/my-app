import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const championOfTheChannel20182019FormAPassageText = "In 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.\n\nCrossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.\n\nFor decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.\n\nTo prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.\n\nOn August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.\n\nThroughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.\n\nFor hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory. After fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.\n\nWhen Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but she also inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.";

const championOfTheChannel20182019FormAQuestions: ExamQuestion[] = [
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q016",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "16",
      "pages": [
        12
      ]
    },
    "explanation": "16. (H) The question asks what the sentence reveals about Ederle’s challenges leading up to her attempt to swim across the channel. Option H is correct because the sentence implies a lack of social support since many people believed that a woman, no matter how skilled a swimmer, did not have the strength to overcome the physical challenges that the dangerous channel waters presented (paragraph 1: “He claimed that ‘even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.’”). Option E is incorrect because the idea that Ederle was at a disadvantage because she was American rather than English, and thus less familiar with the channel, was not the basis for the newspaper editor’s\n\nprediction about the outcome of her swim. Option F is incorrect because the passage establishes that Ederle was a highly accomplished swimmer who had won major world competitions (paragraph 1: “. . . Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals . . .”). Option G is incorrect; the newspaper editor’s point was that it would be impossible for Ederle to complete the swim because she was a woman, not because people were uncomfortable with the idea since no woman had attempted it before.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q016-explanation-1.png\" alt=\"Supplied Form A explanation for question 16\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q016-explanation-2.png\" alt=\"Supplied Form A explanation for question 16\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 1.\n\nIn 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel.\n\nWhat does the editor’s comment reveal about the challenges Ederle faced in attempting her feat?",
    "promptHtml": "<p>Read this sentence from paragraph 1.</p><blockquote><strong>In 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel.</strong></blockquote><p>What does the editor’s comment reveal about the challenges Ederle faced in attempting her feat?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Regardless of her ability, being an American put Ederle at a serious disadvantage over a Londoner, who would be more familiar with the English Channel.</p>",
        "text": "Regardless of her ability, being an American put Ederle at a serious disadvantage over a Londoner, who would be more familiar with the English Channel."
      },
      {
        "id": "B",
        "html": "<p>At the time, Ederle still needed more training in order to succeed in the daunting task of swimming the English Channel.</p>",
        "text": "At the time, Ederle still needed more training in order to succeed in the daunting task of swimming the English Channel."
      },
      {
        "id": "C",
        "html": "<p>While Ederle could participate in athletic competition, some people were not comfortable with her attempt to swim the channel because no woman had ever attempted it before.</p>",
        "text": "While Ederle could participate in athletic competition, some people were not comfortable with her attempt to swim the channel because no woman had ever attempted it before."
      },
      {
        "id": "D",
        "html": "<p>In spite of her previous achievements, Ederle still experienced social as well as physical obstacles in attempting to swim the channel.</p>",
        "text": "In spite of her previous achievements, Ederle still experienced social as well as physical obstacles in attempting to swim the channel."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q017",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "17",
      "pages": [
        13
      ]
    },
    "explanation": "17. (A) The question asks for the best summary of Ederle’s steps to prepare for her second attempt to swim across the English Channel. Ederle’s preparation is outlined in paragraph 4. Option A is correct because it acknowledges the idea that Ederle involved her sister in this process, and it details the efforts the two took to improve Ederle’s equipment, including waxing her goggles and designing a better swimsuit. Option B is incorrect because it focuses on Ederle’s actions in the moments before (covering her body with grease for insulation) and during her swim (finding her “sphere”), not her overall preparation methods. Option C is incorrect because it refers to a practice that was employed to help Ederle keep her strokes in rhythm during her swim. Option D is incorrect because it does not refer to the series of steps that Ederle took to prepare for her swim but rather to just one of the efforts made (improving equipment) without acknowledging her sister’s contributions.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q017-explanation-1.png\" alt=\"Supplied Form A explanation for question 17\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which sentence is the best summary of the steps that Ederle took to prepare for her second attempt to swim across the English Channel?",
    "promptHtml": "<p>Which sentence is the best summary of the steps that Ederle took to prepare for her second attempt to swim across the English Channel?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Working with her sister, Ederle waterproofed her goggles using melted candle wax to seal the edges and designed a two-piece silk bathing suit that was lightweight and would not stretch out during the long swim.</p>",
        "text": "Working with her sister, Ederle waterproofed her goggles using melted candle wax to seal the edges and designed a two-piece silk bathing suit that was lightweight and would not stretch out during the long swim."
      },
      {
        "id": "B",
        "html": "<p>Ederle covered her body in numerous layers of grease for insulation and focused on finding her “sphere” during her swim.</p>",
        "text": "Ederle covered her body in numerous layers of grease for insulation and focused on finding her “sphere” during her swim."
      },
      {
        "id": "C",
        "html": "<p>Ederle began training with her coach, who played music while she swam to help her time her strokes to the music.</p>",
        "text": "Ederle began training with her coach, who played music while she swam to help her time her strokes to the music."
      },
      {
        "id": "D",
        "html": "<p>Ederle focused on developing better equipment than the standard swimsuit that proved cumbersome during her first attempt to cross the channel.</p>",
        "text": "Ederle focused on developing better equipment than the standard swimsuit that proved cumbersome during her first attempt to cross the channel."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q018",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "18",
      "pages": [
        13
      ]
    },
    "explanation": "18. (G) The question asks how the sentence from paragraph 3 fits into the overall structure of the passage. Option G is correct because it explains that Ederle’s awareness of another female swimmer preparing to make an attempt to swim the channel directly influenced Ederle’s decision to make her second attempt as quickly as possible. Ederle wanted to be the first woman to successfully swim across the channel. Option E is incorrect because the passage does not provide information about other female swimmers who were inspired by Ederle to swim across the channel. Option F is incorrect because, although Ederle did rethink her methods between her first and second attempts, the sentence does not show any sort of realization nor does it address her reasoning for rethinking her methods. Option H is incorrect because the sentence is not related to Ederle’s process for learning from her mistakes.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q018-explanation-1.png\" alt=\"Supplied Form A explanation for question 18\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nEderle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.\n\nHow does this sentence fit into the overall structure of the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.</strong></blockquote><p>How does this sentence fit into the overall structure of the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It emphasizes that Ederle’s attempt to swim across the channel led other female swimmers to attempt the challenge.</p>",
        "text": "It emphasizes that Ederle’s attempt to swim across the channel led other female swimmers to attempt the challenge."
      },
      {
        "id": "B",
        "html": "<p>It presents the reason why Ederle prepared to cross the channel again immediately after her initial failure.</p>",
        "text": "It presents the reason why Ederle prepared to cross the channel again immediately after her initial failure."
      },
      {
        "id": "C",
        "html": "<p>It shows Ederle’s realization that she had to rethink her methods if she wanted to be the first woman to cross the channel.</p>",
        "text": "It shows Ederle’s realization that she had to rethink her methods if she wanted to be the first woman to cross the channel."
      },
      {
        "id": "D",
        "html": "<p>It indicates that Ederle had learned from her mistakes and was working to fix them before her next attempt.</p>",
        "text": "It indicates that Ederle had learned from her mistakes and was working to fix them before her next attempt."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q019",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "19",
      "pages": [
        13
      ]
    },
    "explanation": "19. (C) The question asks for the best support for the idea that Ederle’s swim across the channel was successful because of her innovative approach to the\n\nchallenge. Option C is correct because the sentence from paragraph 5 explains that Ederle employed a newly developed type of stroke that allowed her to maintain her pace through the rough water. Option A is incorrect because the sentence from paragraph 1 shows that her performance was groundbreaking but not necessarily creative. Option B is incorrect because the layers of grease primarily served to help maintain Ederle’s body temperature in the water, and there is nothing in the passage to suggest that this was an innovative practice. Option D is incorrect because the sentence from paragraph 6 simply states that Ederle fought against the waves and completed her swim, and it does not describe how Ederle employed innovative techniques.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q019-explanation-1.png\" alt=\"Supplied Form A explanation for question 19\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q019-explanation-2.png\" alt=\"Supplied Form A explanation for question 19\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence best supports the idea that Ederle succeeded in swimming across the channel because of her innovative approach to the challenge?",
    "promptHtml": "<p>Which sentence best supports the idea that Ederle succeeded in swimming across the channel because of her innovative approach to the challenge?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours.” (paragraph 1)</p>",
        "text": "“Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation.” (paragraph 5)</p>",
        "text": "“At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation.” (paragraph 5)"
      },
      {
        "id": "C",
        "html": "<p>“Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.” (paragraph 5)</p>",
        "text": "“Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.” (paragraph 5)"
      },
      {
        "id": "D",
        "html": "<p>“No longer fighting against her, the sea pushed her toward the shore and victory.” (paragraph 7)</p>",
        "text": "“No longer fighting against her, the sea pushed her toward the shore and victory.” (paragraph 7)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q020",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "20",
      "pages": [
        14
      ]
    },
    "explanation": "20. (G) The question asks about the effect of the word “insurmountable,” which means “incapable of being overcome,” in paragraph 4. Option G is correct because the suit Ederle wore during her first attempt to swim the channel “stretched out, filling with water and creating drag” (paragraph 4), which likely contributed to her failed attempt to swim across the channel. Option E is incorrect; Ederle did not complete her first swim because she became ill (paragraph 3: “Just six miles short of finishing, she became ill, and her coach had to haul her out of the water.”), not because the suit made it impossible for Ederle to complete her swim. Option F is incorrect because the author uses the word “insurmountable” to draw attention to the increased difficulty caused by the swimsuit, not to draw attention to the sisters’ creativity in solving the problem. Option H is incorrect because the passage does not address whether the original swimsuit was custom made, simply that the swimsuit created additional difficulties for Ederle in a situation that was already difficult.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q020-explanation-1.png\" alt=\"Supplied Form A explanation for question 20\" width=\"348\"></p>",
    "points": 1,
    "prompt": "In paragraph 4, the word “insurmountable” is used to highlight",
    "promptHtml": "<p>In paragraph 4, the word “insurmountable” is used to highlight</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>how the bathing suit made it impossible for Ederle to make it across the channel.</p>",
        "text": "how the bathing suit made it impossible for Ederle to make it across the channel."
      },
      {
        "id": "B",
        "html": "<p>how Ederle and her sister decided to improve Ederle’s swimming equipment in a creative way.</p>",
        "text": "how Ederle and her sister decided to improve Ederle’s swimming equipment in a creative way."
      },
      {
        "id": "C",
        "html": "<p>that the flaws in Ederle’s bathing suit made a difficult task even more complicated.</p>",
        "text": "that the flaws in Ederle’s bathing suit made a difficult task even more complicated."
      },
      {
        "id": "D",
        "html": "<p>that the swimming equipment Ederle used needed to be custom made for her attempt.</p>",
        "text": "that the swimming equipment Ederle used needed to be custom made for her attempt."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q021",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "21",
      "pages": [
        14
      ]
    },
    "explanation": "21. (D) The question asks how a problem-and-solution structure in paragraph 5 contributes to the ideas presented in the passage. Option D is correct because the paragraph describes how the water’s temperature made Ederle uncomfortable and made it difficult for her to regulate her stroke. The paragraph continues with the explanation of how she overcame these issues by focusing her mind on the sea and tuning out the distractions in her surroundings (paragraph 5: “. . . the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away.”). Option A is incorrect because the details in paragraph 5 do not provide a connection between the cold temperature of the water and the effectiveness of Ederle’s training. Option B is incorrect because the difficulties Ederle encountered were only partially relieved by her team, and her team’s efforts to ensure Ederle’s safety is not explained in the\n\npassage. Option C is incorrect because the paragraph does not focus on the relationship between the problems Ederle encountered at the start of her swim and the problems she encountered during or near the end of her swim.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q021-explanation-1.png\" alt=\"Supplied Form A explanation for question 21\" width=\"348\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q021-explanation-2.png\" alt=\"Supplied Form A explanation for question 21\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Which statement describes how the author’s use of problem-and-solution in paragraph 5 contributes to the development of ideas in the passage?",
    "promptHtml": "<p>Which statement describes how the author’s use of problem-and-solution in paragraph 5 contributes to the development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>Detailing the challenges that the cold channel waters presented highlights how effective Ederle’s training was.</p>",
        "text": "Detailing the challenges that the cold channel waters presented highlights how effective Ederle’s training was."
      },
      {
        "id": "B",
        "html": "<p>Describing Ederle’s physical difficulties during her swim provides evidence of the team effort required in order to ensure her safety.</p>",
        "text": "Describing Ederle’s physical difficulties during her swim provides evidence of the team effort required in order to ensure her safety."
      },
      {
        "id": "C",
        "html": "<p>Explaining the difficulties that arose early in the effort helps predict the additional problems that occurred during Ederle’s attempt.</p>",
        "text": "Explaining the difficulties that arose early in the effort helps predict the additional problems that occurred during Ederle’s attempt."
      },
      {
        "id": "D",
        "html": "<p>Illustrating Ederle’s process of blocking out her discomfort shows that swimming the channel was both a mental and a physical challenge.</p>",
        "text": "Illustrating Ederle’s process of blocking out her discomfort shows that swimming the channel was both a mental and a physical challenge."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q022",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "22",
      "pages": [
        14
      ]
    },
    "explanation": "22. (H) The question asks for an explanation of how paragraph 7 contributes to the development of a central idea of the passage. Paragraph 7 is mainly about Ederle’s physical and emotional state as she pushed through a difficult portion of her swim and realized her goal was in sight. A central idea of the passage is that Ederle’s passion and determination allowed her to accomplish her goal of being the first woman to cross the English Channel. Option H is correct because it emphasizes her passion by referring to the overwhelming emotions Ederle felt as she progressed during her swim, despite the unfavorable conditions (paragraph 7: “For hours Ederle swam, dodging debris with an amused smile” and “Yet Ederle felt indescribably happy as she churned through the sea.”). Option E is incorrect because, although Ederle needed physical strength and mental fortitude to complete the swim, the paragraph contributes to a central idea because it highlights her emotion as she swam, not her physical strength or mental fortitude. Option F is incorrect because the paragraph focuses on Ederle’s emotional response to the challenging circumstances and not the idea that Ederle was at the “edge of her physical capabilities.” Option G is incorrect because Ederle’s feelings of happiness and amusement were caused by her anticipation and excitement as she approached achieving her goal, not by the severe weather.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q022-explanation-1.png\" alt=\"Supplied Form A explanation for question 22\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Paragraph 7 contributes to the development of the central idea of the passage by",
    "promptHtml": "<p>Paragraph 7 contributes to the development of the central idea of the passage by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>illustrating that Ederle’s physical strength and mental fortitude allowed her to stay focused on her goal.</p>",
        "text": "illustrating that Ederle’s physical strength and mental fortitude allowed her to stay focused on her goal."
      },
      {
        "id": "B",
        "html": "<p>conveying that Ederle pushed herself to the edge of her physical capabilities in order to complete the swim.</p>",
        "text": "conveying that Ederle pushed herself to the edge of her physical capabilities in order to complete the swim."
      },
      {
        "id": "C",
        "html": "<p>highlighting the impact the severe weather had on Ederle’s emotions during her swim.</p>",
        "text": "highlighting the impact the severe weather had on Ederle’s emotions during her swim."
      },
      {
        "id": "D",
        "html": "<p>emphasizing the surge of emotions Ederle felt as she came closer to achieving a personal goal.</p>",
        "text": "emphasizing the surge of emotions Ederle felt as she came closer to achieving a personal goal."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q023",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "23",
      "pages": [
        14
      ]
    },
    "explanation": "23. (A) The question asks for an explanation of how Ederle’s successful swim across the channel affected American attitudes. Option A is correct because the passage indicates that there was a large increase in the number of American men and women who became physically active and who obtained swimming certificates shortly after Ederle’s swim (paragraph 9: “Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates.”). Option B is incorrect because, although there was an increase in the number of people learning to swim, the passage does not provide details about people who were inspired by Ederle to take on extreme challenges such as swimming across the channel. Option C is incorrect because, although Ederle did, in fact, surpass the men’s time for the swim by two hours, the passage does not provide information about how this achievement affected the American people’s perception of the capabilities of men and women.\n\nOption D is incorrect because, although the passage does explain how Ederle’s determination and perseverance led to her eventual success, it does not demonstrate how this affected American attitudes toward overcoming failures.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q023-explanation-1.png\" alt=\"Supplied Form A explanation for question 23\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q023-explanation-2.png\" alt=\"Supplied Form A explanation for question 23\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Ederle’s victorious swim across the English Channel influenced American attitudes mainly by",
    "promptHtml": "<p>Ederle’s victorious swim across the English Channel influenced American attitudes mainly by</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>sparking interest in physical activity and in seeking swimming certification.</p>",
        "text": "sparking interest in physical activity and in seeking swimming certification."
      },
      {
        "id": "B",
        "html": "<p>encouraging other swimmers to seek out and achieve challenging feats.</p>",
        "text": "encouraging other swimmers to seek out and achieve challenging feats."
      },
      {
        "id": "C",
        "html": "<p>demonstrating that women could achieve and even surpass feats accomplished by men.</p>",
        "text": "demonstrating that women could achieve and even surpass feats accomplished by men."
      },
      {
        "id": "D",
        "html": "<p>showing that determination and perseverance are necessary to overcome previous failures.</p>",
        "text": "showing that determination and perseverance are necessary to overcome previous failures."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q024",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "24",
      "pages": [
        15
      ]
    },
    "explanation": "24. (H) The question asks for the sentence from the passage that best conveys the author’s perspective about the impact of Ederle’s swim. Option H is correct because, throughout the passage, the author emphasizes that Ederle’s accomplishment was memorable and great, which is best stated in the sentence from paragraph 8. The sentence presented in Option E is incorrect because it focuses on Ederle’s personal attributes that allowed her to successfully complete her swim, not the author’s perspective about the impact of her achievement. The sentence presented in Option F is incorrect because the details in the sentence relate to Ederle’s state of mind as she came closer to achieving her goal and does not provide details about the author’s opinion of the impact of Ederle’s accomplishment. The sentence presented in Option G is incorrect because it simply presents Ederle’s emotional state as she nears her goal and does not provide information about the author’s perspective.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q024-explanation-1.png\" alt=\"Supplied Form A explanation for question 24\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Which sentence from the passage best conveys the author’s perspective regarding the impact of Ederle’s accomplishment?",
    "promptHtml": "<p>Which sentence from the passage best conveys the author’s perspective regarding the impact of Ederle’s accomplishment?</p>",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "html": "<p>“Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.” (paragraph 1)</p>",
        "text": "“Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“For hours Ederle swam, dodging debris with an amused smile.” (paragraph 7)</p>",
        "text": "“For hours Ederle swam, dodging debris with an amused smile.” (paragraph 7)"
      },
      {
        "id": "C",
        "html": "<p>“Yet Ederle felt indescribably happy as she churned through the sea.” (paragraph 7)</p>",
        "text": "“Yet Ederle felt indescribably happy as she churned through the sea.” (paragraph 7)"
      },
      {
        "id": "D",
        "html": "<p>“Ederle had swum into history.” (paragraph 8)</p>",
        "text": "“Ederle had swum into history.” (paragraph 8)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "champion-of-the-channel-2018-2019-form-a-pdf-shsat-2018-2019-a-q025",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "25",
      "pages": [
        15
      ]
    },
    "explanation": "25. (A) The question asks for an explanation of how the table at the end of the passage contributes to the development of the topic of the passage. The table provides information about the earliest speed records set for crossing the channel, including Ederle’s, and information about present-day records, which are much faster. Option A is correct because the information in the table develops the topic of Ederle’s historic swim across the channel by indicating that people have continued to swim the channel and have found new ways to set speed records over time. Option B is incorrect because, even though the table presents the time for the current female record holder, there is no indication in the passage or in the table that the record holder was inspired by Ederle. Option C is incorrect because the passage does not provide information about other female swimmers’ successful swims across the channel. Option D is incorrect because, although the table allows for the comparison of times, the topic of the passage is related to Ederle’s record in comparison with other swimmers of her time, not present-day swimmers.\n\nExcerpt from A Tramp Abroad",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q025-explanation-1.png\" alt=\"Supplied Form A explanation for question 25\" width=\"348\"></p>",
    "points": 1,
    "prompt": "The table contributes to the development of the topic of the passage mainly by",
    "promptHtml": "<p>The table contributes to the development of the topic of the passage mainly by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>emphasizing that people have continued to swim across the channel and have significantly reduced the speed record.</p>",
        "text": "emphasizing that people have continued to swim across the channel and have significantly reduced the speed record."
      },
      {
        "id": "B",
        "html": "<p>suggesting that Ederle inspired women to swim across the channel in an attempt to break the current speed record.</p>",
        "text": "suggesting that Ederle inspired women to swim across the channel in an attempt to break the current speed record."
      },
      {
        "id": "C",
        "html": "<p>revealing that Ederle is not the only woman who has set a record time for swimming across the English Channel.</p>",
        "text": "revealing that Ederle is not the only woman who has set a record time for swimming across the English Channel."
      },
      {
        "id": "D",
        "html": "<p>providing a comparison between channel-swimming records of the early twentieth century and current records.</p>",
        "text": "providing a comparison between channel-swimming records of the early twentieth century and current records."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const championOfTheChannel20182019FormAPassageSet: ExamPassageSet = {
  id: "ela-champion-of-the-channel-2018-2019-form-a",
  versionLabels: ["2018-2019 Form A"],
  label: "2018-2019 Form A",
  section: "reading",
  questionCount: championOfTheChannel20182019FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "champion-of-the-channel-2018-2019-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Champion of the Channel",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","label":"2018-2019 Form A","year":"2018-2019","form":"A","packageId":"62c32b0be11d7e87c41a85210539247ebd09577385a479a3bff2c1df4b4c718e"},
    title: "Champion of the Channel",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>In 1926 an editor at the London Daily News predicted that Gertrude Ederle, an American swimmer with eighteen world records and three Olympic medals, would fail in her attempt to swim across the English Channel. He claimed that “even the most uncompromising champion of the rights and capacities of women must admit that in contests of physical skill, speed and endurance they must remain forever the weaker sex.” Yet, at only nineteen years old, Ederle not only became the first woman to accomplish this feat, she also broke the men’s record by two hours. Gertrude Ederle’s triumphant swim across the English Channel was a testimony to her determination, innovative spirit, and passion for swimming.</p><p>Crossing the English Channel is a daunting task for any swimmer. At its narrowest point, the channel measures twenty-one miles across. Its icy waters hover around sixty degrees Fahrenheit, and its unruly tides and currents toss swimmers about like bobbing corks. Stinging jellyfish, seaweed, and floating debris from shipwrecks and lost cargoes present added hazards.</p><p>For decades the channel’s perils have defeated countless swimmers. Ederle, too, failed in her first attempt to cross the channel in 1925. Just six miles short of finishing, she became ill, and her coach had to haul her out of the water. Undeterred, Ederle decided to try again. Ederle knew that if she did not complete the challenge this time, she might never get the opportunity to set this record, because a rival female swimmer was preparing to make her second attempt at the crossing as well.</p><p>To prepare for the marathon swim, Ederle found ways to improve her equipment. She and her sister Meg discovered that melted candle wax perfectly sealed goggle edges, effectively waterproofing Ederle’s goggles against hammering waves. The sisters also designed a two-piece silk swimsuit for Ederle. During her first channel-crossing attempt she had worn a standard one-piece swimsuit that, after the lengthy hours of swimming across the channel, had stretched out, filling with water and creating drag, making an already challenging task almost insurmountable. Unlike the cumbersome typical bathing suit, this silk invention weighed little and allowed for easy movement.</p><p>On August 6, 1926, Ederle waded into the channel near Cape Gris-Nez, France. At first she shivered in the bone-chilling water even though she had covered her body in eight layers of grease for insulation. Her limbs felt stiff. Her strokes were irregular. Driving forward, she fought to clear her mind and find what she called her “sphere,” a place where the sea became her only companion and the shrieks of gulls and the humming of boat engines faded away. Using a new overhand stroke called the American crawl, Ederle eventually settled into a steady pace, briskly breaking through waves.</p><p>Throughout Ederle’s swim, two tugboats accompanied her. One carried newspaper reporters who wired dispatches of her progress to shore. The other, displaying a sign that read “This way, ole kid!” with an arrow pointing forward, transported her coach, family, and friends. Her coach played songs, such as “Yes, We Have No Bananas,” on a phonograph so that Ederle could time her strokes to the rhythm. Using a net, her coach also passed her baby bottles of broth for nourishment.</p><p>For hours Ederle swam, dodging debris with an amused smile. However, as she neared the English shore, a sudden fierce storm erupted. The tides and waves forced Ederle backward, and she fought the stubborn swells for several hours. The salty water caused her tongue to swell and inflamed her ears. Yet Ederle felt indescribably happy as she churned through the sea. Finally, as she neared the English shore, the storm abated, and the tide turned. No longer fighting against her, the sea pushed her toward the shore and victory. After fourteen hours and thirty-one minutes, Ederle, on wobbly legs, stepped onto the English shore. The waiting crowd roared, honked their automobile horns, blasted their tugboat whistles, and set off flares that flashed in the sky. Ederle had swum into history.</p><p>When Ederle returned to New York, she received a parade, where thousands of people shouted “Trudy!” Not only were everyday American citizens proud of Ederle, but she also inspired them to be more active. Over the next few years, more than 60,000 people credited her with motivating them to earn their American Red Cross swimming certificates. Gertrude Ederle’s accomplishment proved to the world that with determination and passion, it was possible for a person to achieve his or her goals.</p><p data-numbered=\"false\"><img src=\"/exam-images/pdf-2018-2019-a-passage-1-figure-1.png\" alt=\"Solo Swims Across the English Channel: Earliest Speed Records\" width=\"645\"></p>",
    text: championOfTheChannel20182019FormAPassageText,
    versionLabel: "2018-2019 Form A",
  }),
  questions: championOfTheChannel20182019FormAQuestions,
};
