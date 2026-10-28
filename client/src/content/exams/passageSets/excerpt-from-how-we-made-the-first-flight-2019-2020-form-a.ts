import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromHowWeMadeTheFirstFlight20192020FormAPassageText = "During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the Life Saving Station.1 We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.\n\nFinal Preparations\n\nWe laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large carbide2 can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the Kill Devil3 Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from Nags Head,4 had arrived.\n\nWe had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .\n\nAudacity—and Calculation\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.\n\nFlight\n\nThe course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.";

const excerptFromHowWeMadeTheFirstFlight20192020FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q33",
    "skilled": "TBD",
    "explanation": "The question asks how paragraph 1 introduces the idea that the Wright brothers knew that their flight attempt was risky.\n\nA: Correct. Paragraph 1 describes the Wright brothers sending “the signal” to notify the lifesaving crew to stand by as they attempted flight; the need for lifesaving experts to be available in case of an accident introduces the idea that the attempted flight might crash.\n\nB: Incorrect. By themselves, the specifics on the speed of the wind do not emphasize the danger of the flight. And while the brothers admitted that the strong wind posed certain risks, they also noted that the windy conditions might make landing safer (“estimated that the added dangers in flight would be partly compensated for by the slower speed in landing” [paragraph 1]).\n\nC: Incorrect. The slower landing was expected as a result of the windy conditions, but it was not part of a plan to increase the safety of the flight.\n\nD: Incorrect. While the Wright brothers’ initial decision to wait to see if the wind would die down does suggest they were concerned about the safety of the flight, the explanation of their decision to proceed with the flight shows that they expected one benefit from the poor weather: “the slower speed in landing” (paragraph 1).",
    "points": 1,
    "prompt": "How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?",
    "promptHtml": "<p>How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "through the mention of a signal to notify lifesaving experts that the flight attempt was about to begin"
      },
      {
        "id": "B",
        "text": "by providing specific details about the speed of the wind and the Wright brothers’ response to the windy conditions"
      },
      {
        "id": "C",
        "text": "by suggesting that a slower landing would be necessary at the end of the flight in order to maintain safety"
      },
      {
        "id": "D",
        "text": "through the indication that the Wright brothers waited indoors for most of the morning because of the poor weather"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q34",
    "skilled": "TBD",
    "explanation": "The question asks how the sentence from paragraph 4 contributes to the development of ideas in the excerpt.\n\nG: Correct. The sentence from paragraph 4 indicates that the Wright brothers had agreed to take turns attempting to achieve the first flight, which suggests their eagerness to each be the first to successfully fly the machine.\n\nE: Incorrect. The sentence from paragraph 4 does not refer to the challenge of the winter conditions during the flight attempt.\n\nF: Incorrect. While the sentence from paragraph 4 specifically references a previous flight several days earlier, it does not state how many attempts came before Wilbur’s attempt on December 14th.\n\nH: Incorrect. Orville’s trial came about merely as a result of turn-taking, which would suggest that there was no greater likelihood of success or reason to be more confident than there had been for previous attempts.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.\n\nThe sentence contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong>Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.</strong></blockquote><p>The sentence contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "demonstrating the challenge of the extreme winter conditions during the flight."
      },
      {
        "id": "B",
        "text": "revealing how many tries it took for Wilbur Wright to finally get the machine to take flight."
      },
      {
        "id": "C",
        "text": "demonstrating that both Orville and Wilbur Wright were eager to pilot what could potentially be the first flight."
      },
      {
        "id": "D",
        "text": "suggesting a sense that both brothers felt confident they would soon succeed in completing the first flight."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q35",
    "skilled": "TBD",
    "explanation": "The question asks what idea is most clearly conveyed by the words “only,” “nevertheless,” and “finally” in the sentence from paragraph 5.\n\nD: Correct. The words in the sentence from paragraph 5 suggest that, though the first flight may not have lasted very long or taken the pilot very far, the Wright brothers accomplished something no one had been able to do before: successfully pilot an airplane in flight.\n\nA: Incorrect. Although the duration of the flight was short, and a successful flight had taken a long time to achieve, the words in the sentence from paragraph 5 are used to emphasize the remarkable nature of the flight, not the length of time it had taken the Wright brothers to finally be successful.\n\nB: Incorrect. While the hope for longer flights is easy to imagine, the words in the sentence from paragraph 5 do not relate directly to this sentiment; instead, they describe the groundbreaking success of the Wright brothers’ flight.\n\nC: Incorrect. While the capabilities of the aircraft were demonstrated during the flight, the words in the sentence from paragraph 5 do not apply solely to the machine but also to the efforts of the people who designed it, built it, and actually made it fly.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nThis flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.\n\nThe words “only,” “nevertheless,” and “finally” most clearly convey the idea that",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</strong></blockquote><p>The words “only,” “nevertheless,” and “finally” most clearly convey the idea that</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "even a flight of such minor duration had taken a long time to achieve."
      },
      {
        "id": "B",
        "text": "the short flight gave the Wright brothers hope for longer ones in the future."
      },
      {
        "id": "C",
        "text": "the flight proved that the machine was, at last, capable of becoming airborne."
      },
      {
        "id": "D",
        "text": "although it was brief, the flight was a remarkable accomplishment."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q36",
    "skilled": "TBD",
    "explanation": "The question asks how the sentence from paragraph 5 helps convey Orville Wright’s perspective about the first flight.\n\nF: Correct. In the sentence from paragraph 5, Orville uses the wind velocity and the machine speed to highlight the distance that the plane covered while in the air and to determine the distance that it would have flown on a day with calm winds, which emphasizes the magnitude of the accomplishment.\n\nE: Incorrect. Since there is no indication in the sentence from paragraph 5 that Orville took these measurements while he was flying the plane, the idea that he maintained a scientific approach when attempting flight is an assumption rather than fact. It also does not account for the equivalent distance of the flight in calm air, which emphasizes the importance of the accomplishment.\n\nG: Incorrect. Since Orville does not suggest in the sentence from paragraph 5 how far the plane traveled under the actual conditions of high winds, the comparison is incomplete. Additionally, this statement does not address the reason that he would make such a comparison, which allowed him to describe the flight in more impressive terms (540 feet versus 120 feet).\n\nH: Incorrect. Unlike the wind velocity calculations made in preparation for the flight, which along with pilot experience might help in determining the success of future flights, the calculations that Orville provides in the sentence from paragraph 5 interpret the results of the first flight and communicate its success.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nAs the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.\n\nHow does the sentence help convey Orville Wright’s perspective about this first flight?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.</strong></blockquote><p>How does the sentence help convey Orville Wright’s perspective about this first flight?</p>",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "It provides evidence that he maintained a scientific approach when attempting flight."
      },
      {
        "id": "B",
        "text": "It emphasizes that he believed the flight was successful despite its short distance."
      },
      {
        "id": "C",
        "text": "It provides a comparison between flight distances under calm and high wind conditions."
      },
      {
        "id": "D",
        "text": "It highlights the importance of such calculations in the success of future flights."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q37",
    "skilled": "TBD",
    "explanation": "The question asks how the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt.\n\nC: Correct. The details in paragraph 5 describe the difficulties that the weather conditions and mechanical issues presented and how Orville’s flight was successful despite the issues. The ability of the Wright brothers to overcome difficult circumstances and complete the first flight is a central idea of the excerpt.\n\nA: Incorrect. Paragraph 5 explains that the rudder was unbalanced and the effect that this issue had on the flight, but the rudder was only part of the reason for the short flight. The length of the flight is not a central idea of the excerpt.\n\nB: Incorrect. Although paragraph 5 does explain that the equipment contributed to the difficulty of controlling the plane’s flight, the lack of control over the flight is not a central idea of the excerpt, which is the fact that the Wright brothers achieved a successful flight in spite of the challenges involved.\n\nD: Incorrect. While paragraph 5 does emphasize the difficulty caused by the wind, it does not describe a “gradual change” in the wind, only that it was “irregular. ”",
    "points": 1,
    "prompt": "How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?",
    "promptHtml": "<p>How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "by explaining how the flawed design of the machine caused it to turn unpredictably in the air and brought the first flight by a person to an abrupt end"
      },
      {
        "id": "B",
        "text": "by indicating that the difficulty in controlling the flight was caused by the rudimentary instruments of the machine and the inexperience of the pilot"
      },
      {
        "id": "C",
        "text": "by explaining how the pilot and the plane overcame adverse conditions in order to complete the first piloted flight"
      },
      {
        "id": "D",
        "text": "by indicating that the gradual change in wind velocity created an extreme environment in which to maneuver the plane and maintain its flight"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q38",
    "skilled": "TBD",
    "explanation": "The question asks which sentence from the excerpt supports the idea that the Wright brothers had to adapt their flight plans to accommodate weather conditions.\n\nF: Correct. The sentence from paragraph 1 reveals that the Wright brothers adapted by making a risk calculation, based on the wind speed, before the flight. The high speed of the wind could cause difficulties in flight while simultaneously allowing for a slower, more controlled landing.\n\nE: Incorrect. Although the sentence from paragraph 1 mentions the rainy weather and frozen puddles, it does not specifically explain how these weather conditions forced the brothers to adapt their plans for the flight.\n\nG: Incorrect. The sentence from paragraph 4 does mention wind, but it describes what Wilbur was doing during the attempted flight, not the factors he considered before the flight in order to adapt the plan.\n\nH: Incorrect. Although the sentence mentions the “irregularity of the air” during the flight, the sentence from paragraph 5 does not describe how the brothers adapted their flight plans based on the weather.",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their flight plans to accommodate the weather conditions?",
    "promptHtml": "<p>Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their flight plans to accommodate the weather conditions?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice.” (paragraph 1)"
      },
      {
        "id": "B",
        "text": "“We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.” (paragraph 1)"
      },
      {
        "id": "C",
        "text": "“After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind.” (paragraph 4)"
      },
      {
        "id": "D",
        "text": "“The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine.” (paragraph 5)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a-2019-form-a-ela-q39",
    "skilled": "TBD",
    "explanation": "The question asks how the use of chronological structure contributes to the development of ideas in the excerpt.\n\nA: Correct. Through the chronological structure, Orville addresses all stages of the flight in a way that builds from flight concerns and preparations for takeoff to his experiences during the flight and while accomplishing the successful landing.\n\nB: Incorrect. While obstacles are presented within the excerpt, the chronological structure emphasizes the events that ended in the successful achievement of flight on that day rather than how the Wright brothers overcame obstacles.\n\nC: Incorrect. The chronological structure of the excerpt does not show that the Wright brothers applied lessons learned from their previous attempts at flight; instead, the structure describes Orville’s December 17th attempt.\n\nD: Incorrect. While Orville’s narrative certainly shows a strong need to analyze wind speed, this idea is not conveyed through the chronological structure of the excerpt. Additionally, the description of the first flight on December 17th indicates that it did not take place in ideal conditions (“We realized the difficulties of flying in so high a wind” [paragraph 1] and “The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air” [paragraph 5]).",
    "points": 1,
    "prompt": "The use of chronological structure contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>The use of chronological structure contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "outlining the actions that the Wright brothers took to prepare for and successfully complete the first flight."
      },
      {
        "id": "B",
        "text": "identifying the primary factors that allowed the Wright brothers to overcome obstacles and achieve the first flight."
      },
      {
        "id": "C",
        "text": "showing how the Wright brothers applied lessons learned from their previous flight attempts to accomplish the first flight."
      },
      {
        "id": "D",
        "text": "demonstrating how the Wright brothers analyzed the impact of wind velocity to identify the ideal conditions for the first flight."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromHowWeMadeTheFirstFlight20192020FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-how-we-made-the-first-flight-2019-2020-form-a",
  label: "2019–2020 Grade 8 Form A",
  section: "reading",
  questionCount: excerptFromHowWeMadeTheFirstFlight20192020FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-how-we-made-the-first-flight-2019-2020-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “How We Made the First Flight”",
    author: "Orville Wright",
    byline: "by Orville Wright",
    blurb: "In 1903 brothers Wilbur and Orville Wright conducted various experiments related to flying machines. These experiments would eventually lead to air travel becoming a reliable form of transportation.",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the <span data-glossary-definition=\"one of the rescue stations along the Atlantic coastline that provided assistance to mariners in distress\" role=\"link\" tabindex=\"0\">Life Saving Station</span>.<sup>1</sup> We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.</p>\n<h2>Final Preparations</h2>\n<p data-numbered=\"true\">We laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large <span data-glossary-definition=\"a very hard material composed of carbon and other heavy metals\" role=\"link\" tabindex=\"0\">carbide</span><sup>2</sup> can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the <span data-glossary-definition=\"the town of Kill Devil Hills in eastern North Carolina\" role=\"link\" tabindex=\"0\">Kill Devil</span><sup>3</sup> Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from <span data-glossary-definition=\"a town in eastern North Carolina\" role=\"link\" tabindex=\"0\">Nags Head</span>,<sup>4</sup> had arrived.</p>\n<p data-numbered=\"true\">We had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .</p>\n<h2>Audacity—and Calculation</h2>\n<p data-numbered=\"true\">Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.</p>\n<h2>Flight</h2>\n<p data-numbered=\"true\">The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</p>",
    sourceNote: "From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration",
    text: excerptFromHowWeMadeTheFirstFlight20192020FormAPassageText,
    versionLabel: "2019–2020 Form A",
  }),
  questions: excerptFromHowWeMadeTheFirstFlight20192020FormAQuestions,
};
