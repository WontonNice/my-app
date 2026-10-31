import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4PassageText = "In 1886 the newly built Whitcombe Assembly Hall opened in a resort town tucked into the mountains, meant to give summer visitors an elegant place to hear touring orchestras during the warm months when the rest of the season's entertainment moved indoors. Its architects had studied the great concert halls of Europe and copied their proportions closely: a long rectangular room, a high coffered ceiling, and rows of hard wooden benches facing a modest stage framed by carved pillars. On opening night the orchestra played to a full house, and for the first several minutes the audience seemed delighted simply to be there, in a room built for exactly this purpose. But by the second movement, listeners in the rear third of the hall were leaning forward, straining to separate one instrument from another. The sound that reached them arrived blurred, as though several performances were overlapping in the air above their heads, each note still ringing when the next one began.\nThe hall's manager, uncertain what had gone wrong, called in carpenters and upholsterers rather than scientists, since no formal science of architectural acoustics yet existed to consult. Reverberation, the way sound persists and piles up as it bounces repeatedly off hard, flat surfaces, would not be measured and explained mathematically for another decade. What the Whitcombe's builders had instead was patience and a willingness to guess, test, and guess again. Over one off-season they hung heavy curtains along the side walls, laid a thick carpet runner down the center aisle, and replaced a stretch of the rear wall's smooth plaster with a shallow, ridged wooden panel meant to scatter sound in many directions rather than throw it directly back toward the stage in a single hard reflection.\nTo judge whether the changes had worked, the hall's resident engineer returned each evening for two weeks with a stopwatch and an assistant stationed at the stage with a small hand bell. From five fixed seats spread around the hall, she timed how long a single sharp ring remained faintly audible before it dropped below hearing, a rough but workable stand-in for what acousticians would later call reverberation time. Her nightly measurements, recorded seat by seat, are collected in the table accompanying this article. They show clear improvement almost everywhere, though not evenly: the orchestra floor, close to the stage and already surrounded by absorbent bench cushions, had never lingered long to begin with, while the rear balcony and the seats tucked beneath its overhang stayed noticeably livelier than the rest of the hall even after every fix on the list had been tried.\nThe pattern in the numbers matched what the ushers had been hearing all along from patrons on their way out, and it pointed the renovation crew toward the one area still unaddressed: the curved plaster ceiling above the rear overhang, which had been throwing sound back down onto the seats below almost undiminished, adding an extra half second or more of lingering echo exactly where listeners could least afford it. A final round of work hung absorbent panels along that curve, and by the hall's third season, letters from subscribers no longer mentioned muddiness at all, only the ordinary complaints of ticket prices and drafty doors.\nNone of this required the mathematics that would later let architects predict a room's reverberation time before a single wall was built, using nothing more than a floor plan and a list of the materials to be used. It required only careful listening, a willingness to test one change at a time instead of several at once, and a record kept honestly enough to show which fixes had actually worked and which had simply felt like they should. Sabine's formula, when it finally arrived, would let architects design a concert hall's proportions and materials on paper and know in advance roughly how long a handclap would ring in the finished room.\nWhat is striking, looking back at the Whitcombe's log book today, is how closely its conclusions anticipated that later science. Enclosed, overhung spaces trap sound longer than open ones; soft, irregular surfaces calm a room that hard, flat ones stir into confusion. The hall's engineer had no equation for any of this. She had only a stopwatch, a bell, and the discipline to write down what she actually heard rather than what the architects had promised her she would hear.";

const excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-1",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "8",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "The passage centers on how the Whitcombe's staff solved a real acoustic problem through careful testing and measurement rather than any untested theory, since the formal science of acoustics did not yet exist; paragraphs 2 through 4 describe systematic trial-and-error changes, and paragraph 6 credits \"a stopwatch, a bell, and the discipline to write down what she actually heard.\"",
    "explanationHtml": "<p>The passage centers on how the Whitcombe's staff solved a real acoustic problem through careful testing and measurement rather than any untested theory, since the formal science of acoustics did not yet exist; paragraphs 2 through 4 describe systematic trial-and-error changes, and paragraph 6 credits &quot;a stopwatch, a bell, and the discipline to write down what she actually heard.&quot;</p>",
    "points": 1,
    "prompt": "Complete the sentence below so that it correctly states the passage's central idea. Drag two words or phrases from the word bank into the blanks.",
    "promptHtml": "Complete the sentence below so that it correctly states the passage's central idea. Drag two words or phrases from the word bank into the blanks.",
    "dragDropContentHtml": "<p>Long before the mathematics of acoustics existed, the people who solved the Whitcombe's echo problem relied on {{blank-1}} rather than {{blank-2}}, testing one change at a time and recording what they actually heard.</p>",
    "topic": "Central Idea & Theme",
    "type": "transition_drop",
    "choices": [
      {
        "id": "A",
        "html": "<p><strong>expensive imported materials</strong></p>",
        "text": "expensive imported materials"
      },
      {
        "id": "B",
        "html": "<p><strong>careful testing and measurement</strong></p>",
        "text": "careful testing and measurement"
      },
      {
        "id": "C",
        "html": "<p><strong>guidance from European architects</strong></p>",
        "text": "guidance from European architects"
      },
      {
        "id": "D",
        "html": "<p><strong>untested theory</strong></p>",
        "text": "untested theory"
      },
      {
        "id": "E",
        "html": "<p><strong>the orchestra's advice</strong></p>",
        "text": "the orchestra's advice"
      },
      {
        "id": "F",
        "html": "<p><strong>sheer luck</strong></p>",
        "text": "sheer luck"
      }
    ],
    "dragDropContent": [
      "Long before the mathematics of acoustics existed, the people who solved the Whitcombe's echo problem relied on {{blank-1}} rather than {{blank-2}}, testing one change at a time and recording what they actually heard."
    ],
    "dragDropSlots": [
      {
        "id": "blank-1",
        "correctItemId": "B"
      },
      {
        "id": "blank-2",
        "correctItemId": "D"
      }
    ],
    "allowReuse": false,
    "instructions": "Move a word into each blank."
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-2",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "9",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: C\n\n\nExplanation: Paragraph 3 states that the rear balcony and the seats beneath the overhang \"stayed noticeably livelier than the rest of the hall even after every fix on the list had been tried,\" which is exactly what the table's highest reading, 2.8 seconds for the seats under the overhang, illustrates.\n\n\nA. Incorrect: The passage does not describe a carpet runner improving conditions under the overhang; the fixes discussed target other parts of the hall.\n\n\nB. Incorrect: The overhang seats are described as the worst in the hall, not as matching the orchestra floor's earlier reverberation time.\n\n\nC. Correct: Paragraph 3 explicitly says the area under the overhang remained livelier than the rest of the hall even after every fix had been tried, matching its highest reading in the table.\n\n\nD. Incorrect: The ridged panel is described as helping elsewhere in the hall, not as specifically benefiting the seats under the overhang.",
    "explanationHtml": "<p>Correct Answer: C\n<br>\nExplanation: Paragraph 3 states that the rear balcony and the seats beneath the overhang &quot;stayed noticeably livelier than the rest of the hall even after every fix on the list had been tried,&quot; which is exactly what the table's highest reading, 2.8 seconds for the seats under the overhang, illustrates.\n<br>\nA. Incorrect: The passage does not describe a carpet runner improving conditions under the overhang; the fixes discussed target other parts of the hall.\n<br>\nB. Incorrect: The overhang seats are described as the worst in the hall, not as matching the orchestra floor's earlier reverberation time.\n<br>\nC. Correct: Paragraph 3 explicitly says the area under the overhang remained livelier than the rest of the hall even after every fix had been tried, matching its highest reading in the table.\n<br>\nD. Incorrect: The ridged panel is described as helping elsewhere in the hall, not as specifically benefiting the seats under the overhang.</p>",
    "points": 1,
    "prompt": "The table records a reverberation time of 2.8 seconds for the seats under the overhang, longer than any other section — a number that best confirms the passage's description of that area as",
    "promptHtml": "The table records a reverberation time of 2.8 seconds for the seats under the overhang, longer than any other section — a number that best confirms the passage's description of that area as",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>improving steadily only after the carpet runner was laid down the center aisle that season.</p>",
        "text": "improving steadily only after the carpet runner was laid down the center aisle that season."
      },
      {
        "id": "B",
        "html": "<p>matching almost exactly the reverberation time recorded on the orchestra floor before any renovations began.</p>",
        "text": "matching almost exactly the reverberation time recorded on the orchestra floor before any renovations began."
      },
      {
        "id": "C",
        "html": "<p>remaining livelier than the rest of the hall even after every fix had been tried.</p>",
        "text": "remaining livelier than the rest of the hall even after every fix had been tried."
      },
      {
        "id": "D",
        "html": "<p>benefiting most directly from the ridged wooden panel installed along the hall's rear wall.</p>",
        "text": "benefiting most directly from the ridged wooden panel installed along the hall's rear wall."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-3",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "10",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: D\n\n\nExplanation: Paragraph 5 explains that the renovation required only careful listening, one change tested at a time, and \"a record kept honestly enough to show which fixes had actually worked,\" and paragraph 6 credits the engineer's stopwatch, bell, and discipline rather than any equation, showing that meaningful understanding grew out of patient observation rather than formal theory.\n\n\nA. Incorrect: The passage credits patient listening and record-keeping, not expensive specialized equipment or trained engineers.\n\n\nB. Incorrect: The renovation involved departing from the European models the architects had copied, not strictly following them.\n\n\nC. Incorrect: The passage credits a deliberate, repeatable method of testing and recording, not luck.\n\n\nD. Correct: Paragraphs 5 and 6 credit patient observation, honest record-keeping, and simple tools like a stopwatch and bell, rather than any guiding theory, matching this choice exactly.",
    "explanationHtml": "<p>Correct Answer: D\n<br>\nExplanation: Paragraph 5 explains that the renovation required only careful listening, one change tested at a time, and &quot;a record kept honestly enough to show which fixes had actually worked,&quot; and paragraph 6 credits the engineer's stopwatch, bell, and discipline rather than any equation, showing that meaningful understanding grew out of patient observation rather than formal theory.\n<br>\nA. Incorrect: The passage credits patient listening and record-keeping, not expensive specialized equipment or trained engineers.\n<br>\nB. Incorrect: The renovation involved departing from the European models the architects had copied, not strictly following them.\n<br>\nC. Incorrect: The passage credits a deliberate, repeatable method of testing and recording, not luck.\n<br>\nD. Correct: Paragraphs 5 and 6 credit patient observation, honest record-keeping, and simple tools like a stopwatch and bell, rather than any guiding theory, matching this choice exactly.</p>",
    "points": 1,
    "prompt": "What does the passage suggest about how meaningful scientific understanding can sometimes be achieved?",
    "promptHtml": "What does the passage suggest about how meaningful scientific understanding can sometimes be achieved?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It can be achieved by adopting expensive, specialized equipment that only trained engineers may operate.</p>",
        "text": "It can be achieved by adopting expensive, specialized equipment that only trained engineers may operate."
      },
      {
        "id": "B",
        "html": "<p>It can be achieved by strictly following architectural traditions passed down from earlier centuries in Europe.</p>",
        "text": "It can be achieved by strictly following architectural traditions passed down from earlier centuries in Europe."
      },
      {
        "id": "C",
        "html": "<p>It can be achieved by relying on plain luck rather than any deliberate, repeatable method.</p>",
        "text": "It can be achieved by relying on plain luck rather than any deliberate, repeatable method."
      },
      {
        "id": "D",
        "html": "<p>It can be achieved through patient observation and honest record-keeping, without a guiding theory.</p>",
        "text": "It can be achieved through patient observation and honest record-keeping, without a guiding theory."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-4",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "11",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: A\n\n\nExplanation: The passage traces how the hall's staff gradually adjusted materials and tested results until the echo problem eased, so describing the building itself as having \"learned to listen\" figuratively captures that ongoing, responsive process of trial, measurement, and correction.\n\n\nA. Correct: The gradual process of testing materials and adjusting based on results is figuratively described as the building itself \"learning to listen.\"\n\n\nB. Incorrect: The passage doesn't compare the engineer's listening skill to the architects'; the phrase describes the building's own responsive process.\n\n\nC. Incorrect: The phrase describes the hall's internal renovation process, not touring orchestras adjusting their performances.\n\n\nD. Incorrect: The passage doesn't suggest the original architects ignored audience complaints; it focuses on the later renovation effort.",
    "explanationHtml": "<p>Correct Answer: A\n<br>\nExplanation: The passage traces how the hall's staff gradually adjusted materials and tested results until the echo problem eased, so describing the building itself as having &quot;learned to listen&quot; figuratively captures that ongoing, responsive process of trial, measurement, and correction.\n<br>\nA. Correct: The gradual process of testing materials and adjusting based on results is figuratively described as the building itself &quot;learning to listen.&quot;\n<br>\nB. Incorrect: The passage doesn't compare the engineer's listening skill to the architects'; the phrase describes the building's own responsive process.\n<br>\nC. Incorrect: The phrase describes the hall's internal renovation process, not touring orchestras adjusting their performances.\n<br>\nD. Incorrect: The passage doesn't suggest the original architects ignored audience complaints; it focuses on the later renovation effort.</p>",
    "points": 1,
    "prompt": "In the title, the hall is described as one that 'learned to listen.' What does this phrase best convey?",
    "promptHtml": "In the title, the hall is described as one that 'learned to listen.' What does this phrase best convey?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>The renovation process itself became a kind of careful, responsive listening on the building's part.</p>",
        "text": "The renovation process itself became a kind of careful, responsive listening on the building's part."
      },
      {
        "id": "B",
        "html": "<p>The hall's engineer was more skilled at listening than the architects who designed the building.</p>",
        "text": "The hall's engineer was more skilled at listening than the architects who designed the building."
      },
      {
        "id": "C",
        "html": "<p>The touring orchestras adjusted their performances once they learned how the hall's acoustics behaved.</p>",
        "text": "The touring orchestras adjusted their performances once they learned how the hall's acoustics behaved."
      },
      {
        "id": "D",
        "html": "<p>The hall's original architects had ignored complaints from audience members during the opening season.</p>",
        "text": "The hall's original architects had ignored complaints from audience members during the opening season."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-5",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "12",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: C\n\n\nExplanation: Paragraph 5 introduces Sabine's formula only to note that not one of the Whitcombe's fixes had required it, a contrast that highlights how much the hall's staff achieved through patient observation and honest record-keeping alone, before such mathematics existed.\n\n\nA. Incorrect: The passage doesn't criticize the engineer for failing to use more advanced methods; Sabine's formula didn't exist yet.\n\n\nB. Incorrect: The renovations are described as succeeding, not failing, so this choice misreads the passage.\n\n\nC. Correct: Mentioning that the formula wasn't available emphasizes how much the staff accomplished through patient observation and honest records alone.\n\n\nD. Incorrect: The passage doesn't suggest later architects viewed the fixes as crude; it presents the achievement positively.",
    "explanationHtml": "<p>Correct Answer: C\n<br>\nExplanation: Paragraph 5 introduces Sabine's formula only to note that not one of the Whitcombe's fixes had required it, a contrast that highlights how much the hall's staff achieved through patient observation and honest record-keeping alone, before such mathematics existed.\n<br>\nA. Incorrect: The passage doesn't criticize the engineer for failing to use more advanced methods; Sabine's formula didn't exist yet.\n<br>\nB. Incorrect: The renovations are described as succeeding, not failing, so this choice misreads the passage.\n<br>\nC. Correct: Mentioning that the formula wasn't available emphasizes how much the staff accomplished through patient observation and honest records alone.\n<br>\nD. Incorrect: The passage doesn't suggest later architects viewed the fixes as crude; it presents the achievement positively.</p>",
    "points": 1,
    "prompt": "Why does the author most likely mention Sabine's formula, a tool that did not exist during the Whitcombe's renovation?",
    "promptHtml": "Why does the author most likely mention Sabine's formula, a tool that did not exist during the Whitcombe's renovation?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>The author wants to criticize the hall's engineer for not adopting more advanced methods sooner.</p>",
        "text": "The author wants to criticize the hall's engineer for not adopting more advanced methods sooner."
      },
      {
        "id": "B",
        "html": "<p>The author wants to explain why the renovations described earlier in the passage ultimately failed.</p>",
        "text": "The author wants to explain why the renovations described earlier in the passage ultimately failed."
      },
      {
        "id": "C",
        "html": "<p>The author wants to emphasize how much the staff accomplished using only patient observation and honest records.</p>",
        "text": "The author wants to emphasize how much the staff accomplished using only patient observation and honest records."
      },
      {
        "id": "D",
        "html": "<p>The author wants to suggest that later architects viewed the Whitcombe's acoustic fixes as crude and unnecessary.</p>",
        "text": "The author wants to suggest that later architects viewed the Whitcombe's acoustic fixes as crude and unnecessary."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-6",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "13",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: A\n\n\nExplanation: The architects had faithfully copied the proportions of European concert halls, yet the acoustic problems persisted until curtains, carpet, and ridged panels changed the room's surfaces, indicating that the materials lining a space affect its sound more than its shape and proportions do.\n\n\nA. Correct: The renovations changed the room's surfaces (curtains, carpet, panels) rather than its shape, and this finally solved the problem, suggesting materials mattered more than proportions.\n\n\nB. Incorrect: The passage doesn't suggest the European models should have been abandoned entirely; the proportions weren't the core issue.\n\n\nC. Incorrect: Nothing indicates the architects deliberately ignored acoustic needs to save money.\n\n\nD. Incorrect: The passage doesn't compare carpenters' and architects' understanding of acoustics in the 1880s.",
    "explanationHtml": "<p>Correct Answer: A\n<br>\nExplanation: The architects had faithfully copied the proportions of European concert halls, yet the acoustic problems persisted until curtains, carpet, and ridged panels changed the room's surfaces, indicating that the materials lining a space affect its sound more than its shape and proportions do.\n<br>\nA. Correct: The renovations changed the room's surfaces (curtains, carpet, panels) rather than its shape, and this finally solved the problem, suggesting materials mattered more than proportions.\n<br>\nB. Incorrect: The passage doesn't suggest the European models should have been abandoned entirely; the proportions weren't the core issue.\n<br>\nC. Incorrect: Nothing indicates the architects deliberately ignored acoustic needs to save money.\n<br>\nD. Incorrect: The passage doesn't compare carpenters' and architects' understanding of acoustics in the 1880s.</p>",
    "points": 1,
    "prompt": "The contrast between what the Whitcombe's original architects copied from European halls and what the later renovations actually changed most likely suggests that",
    "promptHtml": "The contrast between what the Whitcombe's original architects copied from European halls and what the later renovations actually changed most likely suggests that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>a room's shape and proportions matter less to its sound than the materials lining its surfaces.</p>",
        "text": "a room's shape and proportions matter less to its sound than the materials lining its surfaces."
      },
      {
        "id": "B",
        "html": "<p>the European models the architects copied were a poor fit and should have been abandoned entirely.</p>",
        "text": "the European models the architects copied were a poor fit and should have been abandoned entirely."
      },
      {
        "id": "C",
        "html": "<p>the Whitcombe's architects deliberately ignored the acoustic needs of the audience to save money.</p>",
        "text": "the Whitcombe's architects deliberately ignored the acoustic needs of the audience to save money."
      },
      {
        "id": "D",
        "html": "<p>carpenters and upholsterers understood acoustics better than trained architects did in the 1880s.</p>",
        "text": "carpenters and upholsterers understood acoustics better than trained architects did in the 1880s."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4-7",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "14",
      "originalPackageId": "70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"
    },
    "explanation": "Correct Answer: B\n\n\nExplanation: Paragraph 5 briefly steps outside the chronological account of the renovation to note that none of it required the mathematics that Sabine's formula would later provide, setting up paragraph 6's reflection on how closely the hall's hands-on methods anticipated that later science.\n\n\nA. Incorrect: Paragraph 5 doesn't introduce an unnoticed new problem; it reflects on the renovation methods already described.\n\n\nB. Correct: Paragraph 5 steps back from the chronological renovation account to contrast the hands-on methods used with the formal science that arrived later.\n\n\nC. Incorrect: The paragraph doesn't simply restate the earlier renovation steps in order; it adds a reflective contrast.\n\n\nD. Incorrect: The paragraph stays focused on the Whitcombe, not other halls built in other decades.",
    "explanationHtml": "<p>Correct Answer: B\n<br>\nExplanation: Paragraph 5 briefly steps outside the chronological account of the renovation to note that none of it required the mathematics that Sabine's formula would later provide, setting up paragraph 6's reflection on how closely the hall's hands-on methods anticipated that later science.\n<br>\nA. Incorrect: Paragraph 5 doesn't introduce an unnoticed new problem; it reflects on the renovation methods already described.\n<br>\nB. Correct: Paragraph 5 steps back from the chronological renovation account to contrast the hands-on methods used with the formal science that arrived later.\n<br>\nC. Incorrect: The paragraph doesn't simply restate the earlier renovation steps in order; it adds a reflective contrast.\n<br>\nD. Incorrect: The paragraph stays focused on the Whitcombe, not other halls built in other decades.</p>",
    "points": 1,
    "prompt": "What is the primary function of paragraph 5 within the passage as a whole?",
    "promptHtml": "What is the primary function of paragraph 5 within the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It introduces a brand-new problem that the hall's staff had not yet noticed or attempted to fix.</p>",
        "text": "It introduces a brand-new problem that the hall's staff had not yet noticed or attempted to fix."
      },
      {
        "id": "B",
        "html": "<p>It pauses the narrative to contrast the Whitcombe's hands-on methods with the formal science that arrived later.</p>",
        "text": "It pauses the narrative to contrast the Whitcombe's hands-on methods with the formal science that arrived later."
      },
      {
        "id": "C",
        "html": "<p>It summarizes every renovation step described in paragraphs two through four in chronological order again.</p>",
        "text": "It summarizes every renovation step described in paragraphs two through four in chronological order again."
      },
      {
        "id": "D",
        "html": "<p>It shifts the passage's focus away from the Whitcombe toward concert halls built in other decades.</p>",
        "text": "It shifts the passage's focus away from the Whitcombe toward concert halls built in other decades."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4",
  versionLabels: ["Digital SHSAT Practice Test 4"],
  section: "reading",
  questionCount: excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-hall-that-learned-to-listen-digital-shsat-practice-test-4",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    blurbHtml: "<p>Eleanor Voss writes about the history of architecture and engineering for a regional heritage magazine. The following is adapted from her article on an early concert hall renovation.</p>",
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-66050f1c9020a8c9d047","label":"Digital SHSAT Practice Test 4","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2","packageId":"f64f6b2aec84964d273f6f2401f85e7555a3845f184df96bb72d9ad765cf2035","originalPackageId":"70e593e27bbdc631151bd1ac4d6d1a97d6f6e0e18ca0846dbd9c29dd387e00a5"},
    title: "Excerpt from \"The Hall That Learned to Listen\"",
    author: "Eleanor Voss",
    byline: "by Eleanor Voss",
    blurb: "Eleanor Voss writes about the history of architecture and engineering for a regional heritage magazine. The following is adapted from her article on an early concert hall renovation.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>In 1886 the newly built Whitcombe Assembly Hall opened in a resort town tucked into the mountains, meant to give summer visitors an elegant place to hear touring orchestras during the warm months when the rest of the season's entertainment moved indoors. Its architects had studied the great concert halls of Europe and copied their proportions closely: a long rectangular room, a high coffered ceiling, and rows of hard wooden benches facing a modest stage framed by carved pillars. On opening night the orchestra played to a full house, and for the first several minutes the audience seemed delighted simply to be there, in a room built for exactly this purpose. But by the second movement, listeners in the rear third of the hall were leaning forward, straining to separate one instrument from another. The sound that reached them arrived blurred, as though several performances were overlapping in the air above their heads, each note still ringing when the next one began.</p><p>The hall's manager, uncertain what had gone wrong, called in carpenters and upholsterers rather than scientists, since no formal science of architectural acoustics yet existed to consult. Reverberation, the way sound persists and piles up as it bounces repeatedly off hard, flat surfaces, would not be measured and explained mathematically for another decade. What the Whitcombe's builders had instead was patience and a willingness to guess, test, and guess again. Over one off-season they hung heavy curtains along the side walls, laid a thick carpet runner down the center aisle, and replaced a stretch of the rear wall's smooth plaster with a shallow, ridged wooden panel meant to scatter sound in many directions rather than throw it directly back toward the stage in a single hard reflection.</p><p>To judge whether the changes had worked, the hall's resident engineer returned each evening for two weeks with a stopwatch and an assistant stationed at the stage with a small hand bell. From five fixed seats spread around the hall, she timed how long a single sharp ring remained faintly audible before it dropped below hearing, a rough but workable stand-in for what acousticians would later call reverberation time. Her nightly measurements, recorded seat by seat, are collected in the table accompanying this article. They show clear improvement almost everywhere, though not evenly: the orchestra floor, close to the stage and already surrounded by absorbent bench cushions, had never lingered long to begin with, while the rear balcony and the seats tucked beneath its overhang stayed noticeably livelier than the rest of the hall even after every fix on the list had been tried.</p><p>The pattern in the numbers matched what the ushers had been hearing all along from patrons on their way out, and it pointed the renovation crew toward the one area still unaddressed: the curved plaster ceiling above the rear overhang, which had been throwing sound back down onto the seats below almost undiminished, adding an extra half second or more of lingering echo exactly where listeners could least afford it. A final round of work hung absorbent panels along that curve, and by the hall's third season, letters from subscribers no longer mentioned muddiness at all, only the ordinary complaints of ticket prices and drafty doors.</p><p>None of this required the mathematics that would later let architects predict a room's reverberation time before a single wall was built, using nothing more than a floor plan and a list of the materials to be used. It required only careful listening, a willingness to test one change at a time instead of several at once, and a record kept honestly enough to show which fixes had actually worked and which had simply felt like they should. Sabine's formula, when it finally arrived, would let architects design a concert hall's proportions and materials on paper and know in advance roughly how long a handclap would ring in the finished room.</p><p>What is striking, looking back at the Whitcombe's log book today, is how closely its conclusions anticipated that later science. Enclosed, overhung spaces trap sound longer than open ones; soft, irregular surfaces calm a room that hard, flat ones stir into confusion. The hall's engineer had no equation for any of this. She had only a stopwatch, a bell, and the discipline to write down what she actually heard rather than what the architects had promised her she would hear.</p><p data-numbered=\"false\"><img src=\"/exam-images/satcc-5e57d5bea7cacf919ce5b4d5150dbd6ef3705d861137378ee2f94ea4e84ecc97.png\" alt=\"figure\" width=\"694\"></p>",
    text: excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4PassageText,
    versionLabel: "Digital SHSAT Practice Test 4",
  }),
  questions: excerptFromTheHallThatLearnedToListenDigitalShsatPracticeTest4Questions,
};
