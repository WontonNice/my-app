import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromHowWeMadeTheFirstFlight20262027FormDPassageText = "In 1903 brothers Wilbur and Orville Wright conducted experiments related to flying machines. These experiments would eventually lead to air travel becoming a reliable form of transportation.\nDuring the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the Life Saving Station. We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.\nFinal Preparations\nWe laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large carbide can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the Kill Devil Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from Nags Head, had arrived.\nWe had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .\nAudacity—and Calculation\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.\nFlight\nThe course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.";

const excerptFromHowWeMadeTheFirstFlight20262027FormDQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-8",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "8"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-9b6e83cd5010212e89d2.png\" alt=\"Official explanation for question 8\">",
    "points": 1,
    "prompt": "How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?",
    "promptHtml": "<p>How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>through the mention of a signal to notify lifesaving experts that the flight attempt was about to begin</p>",
        "text": "through the mention of a signal to notify lifesaving experts that the flight attempt was about to begin"
      },
      {
        "id": "B",
        "html": "<p>by providing specific details about the speed of the wind and the Wright brothers’ response to the windy conditions</p>",
        "text": "by providing specific details about the speed of the wind and the Wright brothers’ response to the windy conditions"
      },
      {
        "id": "C",
        "html": "<p>by suggesting that a slower landing would be necessary at the end of the flight in order to maintain safety</p>",
        "text": "by suggesting that a slower landing would be necessary at the end of the flight in order to maintain safety"
      },
      {
        "id": "D",
        "html": "<p>through the indication that the Wright brothers waited indoors for most of the morning because of the poor weather</p>",
        "text": "through the indication that the Wright brothers waited indoors for most of the morning because of the poor weather"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-9",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-4b494d866a57897eed9f.png\" alt=\"Official explanation for question 9\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.\n\nThe sentence contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong><strong>Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.</strong></strong></blockquote><p>The sentence contributes to the development of ideas in the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>demonstrating the challenge of the extreme winter conditions during the flight.</p>",
        "text": "demonstrating the challenge of the extreme winter conditions during the flight."
      },
      {
        "id": "B",
        "html": "<p>revealing how many tries it took for Wilbur Wright to finally get the machine to take flight.</p>",
        "text": "revealing how many tries it took for Wilbur Wright to finally get the machine to take flight."
      },
      {
        "id": "C",
        "html": "<p>demonstrating that both Orville and Wilbur Wright were eager to pilot what could potentially be the first flight.</p>",
        "text": "demonstrating that both Orville and Wilbur Wright were eager to pilot what could potentially be the first flight."
      },
      {
        "id": "D",
        "html": "<p>suggesting a sense that both brothers felt confident they would soon succeed in completing the first flight.</p>",
        "text": "suggesting a sense that both brothers felt confident they would soon succeed in completing the first flight."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-10",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "10"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-193109ae60765909cb72.png\" alt=\"Official explanation for question 10\">",
    "points": 1,
    "prompt": "The photograph mentioned in paragraph 4 is significant because it",
    "promptHtml": "<p>The photograph mentioned in <span>paragraph 4</span> is significant because it</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>documents that the machine rose into the air as soon as the tethering wire was released.</p>",
        "text": "documents that the machine rose into the air as soon as the tethering wire was released."
      },
      {
        "id": "B",
        "html": "<p>provides proof of the critical moment the machine took flight.</p>",
        "text": "provides proof of the critical moment the machine took flight."
      },
      {
        "id": "C",
        "html": "<p>documents that the wind reduced the speed of the plane at the start of the flight.</p>",
        "text": "documents that the wind reduced the speed of the plane at the start of the flight."
      },
      {
        "id": "D",
        "html": "<p>provides proof that the pilot had to gradually increase the height of the plane in the air.</p>",
        "text": "provides proof that the pilot had to gradually increase the height of the plane in the air."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-11",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "11"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-3a37bb96f5fb9ca25a8e.png\" alt=\"Official explanation for question 11\">",
    "points": 1,
    "prompt": "How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?",
    "promptHtml": "<p>How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>by explaining how the flawed design of the machine caused it to turn unpredictably in the air and brought the first flight by a person to an abrupt end</p>",
        "text": "by explaining how the flawed design of the machine caused it to turn unpredictably in the air and brought the first flight by a person to an abrupt end"
      },
      {
        "id": "B",
        "html": "<p>by indicating that the difficulty in controlling the flight was caused by the rudimentary instruments of the machine and the inexperience of the pilot</p>",
        "text": "by indicating that the difficulty in controlling the flight was caused by the rudimentary instruments of the machine and the inexperience of the pilot"
      },
      {
        "id": "C",
        "html": "<p>by explaining how the pilot and the plane overcame adverse conditions in order to complete the first piloted flight</p>",
        "text": "by explaining how the pilot and the plane overcame adverse conditions in order to complete the first piloted flight"
      },
      {
        "id": "D",
        "html": "<p>by indicating that the gradual change in wind velocity created an extreme environment in which to maneuver the plane and maintain its flight</p>",
        "text": "by indicating that the gradual change in wind velocity created an extreme environment in which to maneuver the plane and maintain its flight"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-12",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "12"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-978ac9de0ef7fd8d68b7.png\" alt=\"Official explanation for question 12\">",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\nAs the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.\nHow does the sentence help convey Orville Wright’s perspective about this first flight?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p> <p data-align=\"indent\"><strong>As the velocity of the wind was over <span>35 feet</span> per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over <span>45 feet</span> per second, and the length of the flight was equivalent to a flight of <span>540 feet</span> made in calm air.</strong></p> <p>How does the sentence help convey Orville Wright’s perspective about this first flight?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It suggests that he was frustrated by the poor flying conditions on the day of the flight.</p>",
        "text": "It suggests that he was frustrated by the poor flying conditions on the day of the flight."
      },
      {
        "id": "B",
        "html": "<p>It emphasizes that he believed the flight was successful despite its short distance.</p>",
        "text": "It emphasizes that he believed the flight was successful despite its short distance."
      },
      {
        "id": "C",
        "html": "<p>It provides a comparison between flight distances under calm and high wind conditions.</p>",
        "text": "It provides a comparison between flight distances under calm and high wind conditions."
      },
      {
        "id": "D",
        "html": "<p>It highlights the importance of such calculations in the success of future flights.</p>",
        "text": "It highlights the importance of such calculations in the success of future flights."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-13",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "13"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-b6b143effd78563ab26c.png\" alt=\"Official explanation for question 13\">",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?",
    "promptHtml": "<p>Which sentence from the excerpt <strong>best</strong> supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>“When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice.” <span>(paragraph 1)</span></p>",
        "text": "“When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.” <span>(paragraph 1)</span></p>",
        "text": "“We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.” (paragraph 1)"
      },
      {
        "id": "C",
        "html": "<p>“After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind.” <span>(paragraph 4)</span></p>",
        "text": "“After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind.” (paragraph 4)"
      },
      {
        "id": "D",
        "html": "<p>“The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine.” <span>(paragraph 5)</span></p>",
        "text": "“The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine.” (paragraph 5)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d-official-shsat-2026-d-14",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Passage Set 2 of 7",
      "sourceQuestion": "14"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-02e0f69efe8f9e037e8f.png\" alt=\"Official explanation for question 14\">",
    "points": 1,
    "prompt": "The use of chronological structure contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>The use of chronological structure contributes to the development of ideas in the excerpt by</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>outlining the actions that the Wright brothers took to prepare for and successfully complete the first flight.</p>",
        "text": "outlining the actions that the Wright brothers took to prepare for and successfully complete the first flight."
      },
      {
        "id": "B",
        "html": "<p>identifying the primary factors that allowed the Wright brothers to overcome obstacles and achieve the first flight.</p>",
        "text": "identifying the primary factors that allowed the Wright brothers to overcome obstacles and achieve the first flight."
      },
      {
        "id": "C",
        "html": "<p>showing how the Wright brothers applied lessons learned from their previous flight attempts to accomplish the first flight.</p>",
        "text": "showing how the Wright brothers applied lessons learned from their previous flight attempts to accomplish the first flight."
      },
      {
        "id": "D",
        "html": "<p>demonstrating how the Wright brothers analyzed the impact of wind velocity to identify the ideal conditions for the first flight.</p>",
        "text": "demonstrating how the Wright brothers analyzed the impact of wind velocity to identify the ideal conditions for the first flight."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromHowWeMadeTheFirstFlight20262027FormDPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-how-we-made-the-first-flight-2026-2027-form-d",
  versionLabels: ["2026-2027 Form D"],
  section: "reading",
  questionCount: excerptFromHowWeMadeTheFirstFlight20262027FormDQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-how-we-made-the-first-flight-2026-2027-form-d",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “How We Made the First Flight”",
    bylineHtml: "by Orville Wright",
    source: {"sourceFamily":"official_shsat","sourceFormat":"testnav","playerProfile":"testnav","year":"2026","form":"D","section":"ELA - Passage Set 2 of 7","packageId":"c30d6ae5eae6c7e05483949182746cd0014d97421810145420d2bf35cd001c85"},
    title: "Excerpt from “How We Made the First Flight”",
    author: "Orville Wright",
    byline: "by Orville Wright",
    passageType: "long_reading",
    passageCategory: "official_handbook",
    richText: "<p><em>In 1903 brothers Wilbur and Orville Wright conducted experiments related to flying machines. These experiments would eventually lead to air travel becoming a reliable form of transportation.</em></p> <p data-numbered=\"true\"> During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to <span>12 meters</span> per second (22 to <span>27 miles</span> an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the <span data-glossary-definition=\"one of the rescue stations along the Atlantic coastline that provided assistance to mariners in distress\" role=\"link\" tabindex=\"0\">Life Saving Station.</span> We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.</p> <h3>Final Preparations</h3> <p data-numbered=\"true\"> We laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large <span data-glossary-definition=\"a very hard material composed of carbon and other heavy metals\" role=\"link\" tabindex=\"0\">carbide</span> can. By the time all was ready, <span>J. T.</span> Daniels, <span>W. S.</span> Dough and <span>A. D.</span> Etheridge, members of the <span data-glossary-definition=\"the town of Kill Devil Hills in eastern North Carolina\" role=\"link\" tabindex=\"0\">Kill Devil</span> Life Saving Station; <span>W. C.</span> Brinkley of Manteo, and Johnny Moore, a boy from <span data-glossary-definition=\"a town in eastern North Carolina\" role=\"link\" tabindex=\"0\">Nags Head,</span> had arrived.</p> <p data-numbered=\"true\"> We had a “Richard” hand anemometer&nbsp;with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to <span>12 meters</span> per second, or 24 to <span>27 miles</span> per <span>hour. . . .</span></p> <h3>Audacity—and Calculation</h3> <p data-numbered=\"true\"> Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a <span>27-mile</span> wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.</p> <h3>Flight</h3> <p data-numbered=\"true\"> The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over <span>120 feet</span> from the point at which it rose into the air, ended the flight. As the velocity of the wind was over <span>35 feet</span> per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over <span>45 feet</span> per second, and the length of the flight was equivalent to a flight of <span>540 feet</span> made in calm air. This flight lasted only <span>12 seconds,</span> but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</p>",
    sourceNote: "From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration",
    text: excerptFromHowWeMadeTheFirstFlight20262027FormDPassageText,
    versionLabel: "2026-2027 Form D",
  }),
  questions: excerptFromHowWeMadeTheFirstFlight20262027FormDQuestions,
};
