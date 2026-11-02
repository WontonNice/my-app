import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromHowWeMadeTheFirstFlight20212022FormBPassageText = "During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the Life Saving Station. We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.\n\nFinal Preparations\n\nWe laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large carbide can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the Kill Devil Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from Nags Head, had arrived.\n\nWe had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .\n\nAudacity—and Calculation\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.\n\nFlight\n\nThe course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.";

const excerptFromHowWeMadeTheFirstFlight20212022FormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q017",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "17",
      "pages": [
        14
      ]
    },
    "explanation": "The question asks how paragraph 1 introduces the idea that the Wright brothers knew that their\nflight attempt was risky.\nA. CORRECT. Paragraph 1 describes the Wright brothers hanging out “the signal” to notify the\nlifesaving crew to stand by as they attempted flight; the need for lifesaving experts to be\navailable in case of an accident introduces the idea that the attempted flight might crash.\nB. Incorrect. The specifics on the speed of the wind by themselves do not emphasize the danger\nof the flight. While the brothers admitted that the strong wind posed certain risks, they also\nnoted that the windy conditions might make landing safer (“estimated that the added\ndangers in flight would be partly compensated for by the slower speed in landing”\n[paragraph 1]).\nC. Incorrect. A slower landing was expected as a result of the windy conditions, but it was not\npart of a plan to increase the safety of the flight.\nD. Incorrect. While the Wright brothers’ initial decision to wait to see whether the wind would\ndie down does suggest they were concerned about the safety of the flight, the explanation of\ntheir decision to proceed with the flight shows that they expected one benefit from the poor\nweather: “the slower speed in landing” (paragraph 1).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q017-explanation-1.png\" alt=\"Official explanation for source question 17; original printed answer labels retained.\" width=\"690\"></p>",
    "points": 1,
    "prompt": "How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?",
    "promptHtml": "<p>How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "through the mention of a signal to notify lifesaving experts that the flight attempt was about to begin",
        "text": "through the mention of a signal to notify lifesaving experts that the flight attempt was about to begin"
      },
      {
        "id": "B",
        "html": "by providing specific details about the speed of the wind and the Wright brothers’ response to the windy conditions",
        "text": "by providing specific details about the speed of the wind and the Wright brothers’ response to the windy conditions"
      },
      {
        "id": "C",
        "html": "by suggesting that a slower landing would be necessary at the end of the flight in order to maintain safety",
        "text": "by suggesting that a slower landing would be necessary at the end of the flight in order to maintain safety"
      },
      {
        "id": "D",
        "html": "through the indication that the Wright brothers waited indoors for most of the morning because of the poor weather",
        "text": "through the indication that the Wright brothers waited indoors for most of the morning because of the poor weather"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q018",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "18",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 4 contributes to the development of ideas in\nthe excerpt.\nE. Incorrect. The sentence from paragraph 4 does not refer to the challenge of the winter\nconditions during the flight attempt.\nF. Incorrect. While the sentence from paragraph 4 specifically references a previous flight\nseveral days earlier, it does not state how many attempts came before Wilbur’s attempt on\nDecember 14.\nG. CORRECT. The sentence from paragraph 4 indicates that the Wright brothers had agreed to\ntake turns attempting to achieve the first flight, which suggests their eagerness to each be\nthe first to successfully fly the machine.\nH. Incorrect. Orville’s trial came about simply because the brothers took turns, which would\nsuggest that there was no greater likelihood of success or reason to be more confident at\nthat moment than there had been for previous attempts.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q018-explanation-1.png\" alt=\"Official explanation for source question 18; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.\n\nThe sentence contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong>Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.</strong></blockquote><p>The sentence contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "demonstrating the challenge of the extreme winter conditions during the flight.",
        "text": "demonstrating the challenge of the extreme winter conditions during the flight."
      },
      {
        "id": "B",
        "html": "revealing how many tries it took for Wilbur Wright to finally get the machine to take flight.",
        "text": "revealing how many tries it took for Wilbur Wright to finally get the machine to take flight."
      },
      {
        "id": "C",
        "html": "demonstrating that both Orville and Wilbur Wright were eager to pilot what could potentially be the first flight.",
        "text": "demonstrating that both Orville and Wilbur Wright were eager to pilot what could potentially be the first flight."
      },
      {
        "id": "D",
        "html": "suggesting a sense that both brothers felt confident they would soon succeed in completing the first flight.",
        "text": "suggesting a sense that both brothers felt confident they would soon succeed in completing the first flight."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q019",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "19",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks why the photograph mentioned in paragraph 4 is significant.\nA. Incorrect. According to paragraph 4, the photograph was not taken immediately after the\ntethering wire was released but rather after an intervening period during which “Wilbur ran at\nthe side of the machine, holding the wing to balance it on the track.” The picture was not\ntaken until “the machine had reached the end of the track,” which occurred after a “forty-foot\nrun” (paragraph 4).\nB. CORRECT. The photograph mentioned in paragraph 4 is significant because it provides proof\nthat the machine did, in fact, take flight: “One of the Life Saving men snapped the camera\nfor us, taking a picture just as the machine had reached the end of the track and had risen\nto a height of about two feet. The slow forward speed of the machine over the ground is\nclearly shown in the picture by Wilbur's attitude. He stayed along beside the machine without\nany effort.”\nC. Incorrect. The photograph mentioned in paragraph 4 is described as showing the plane\nmoving forward through the air at a height of two feet, but while the effect of the wind may\nbe visible, it is not why the photo is significant. Instead, the photograph provides proof that\nthe plane is, in fact, moving through the air (“One of the Life Saving men snapped the\ncamera for us, taking a picture just as the machine had reached the end of the track and had\nrisen to a height of about two feet. The slow forward speed of the machine over the ground is\nclearly shown in the picture by Wilbur's attitude”).\nD. Incorrect. Although the plane is shown at a height of two feet in the photograph mentioned in\nparagraph 4, the picture documents only one moment of the plane's flight and does not\nprovide proof that the pilot had to gradually increase the height of the plane in the air.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q019-explanation-1.png\" alt=\"Official explanation for source question 19; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "The photograph mentioned in paragraph 4 is significant because it",
    "promptHtml": "<p>The photograph mentioned in paragraph 4 is significant because it</p>",
    "topic": "Inference",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q020",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "20",
      "pages": [
        15
      ]
    },
    "explanation": "The question asks how the details in paragraph 5 about the uneven nature of the flight convey a\ncentral idea of the excerpt.\nE. Incorrect. Paragraph 5 explains that the rudder was unbalanced and the effect that this issue\nhad on the flight, but the rudder was only part of the reason for the short flight. The length\nof the flight is not a central idea of the excerpt.\nF. Incorrect. Although paragraph 5 does explain that the equipment contributed to the difficulty\nof controlling the plane’s flight, the lack of control over the flight is not a central idea of the\nexcerpt, which is the fact that the Wright brothers achieved a successful flight in spite of the\nchallenges involved.\nG. CORRECT. The details in paragraph 5 describe the difficulties that the weather conditions\nand mechanical issues presented and how Orville’s flight was successful despite the issues.\nThe ability of the Wright brothers to overcome difficult circumstances and complete the first\nflight is a central idea of the excerpt.\nH. Incorrect. While paragraph 5 does emphasize the difficulty caused by the wind, it does not\ndescribe a “gradual change” in the wind, only that it was “irregular.”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q020-explanation-1.png\" alt=\"Official explanation for source question 20; original printed answer labels retained.\" width=\"687\"></p>",
    "points": 1,
    "prompt": "How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?",
    "promptHtml": "<p>How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "by explaining how the flawed design of the machine caused it to turn unpredictably in the air and brought the first flight by a person to an abrupt end",
        "text": "by explaining how the flawed design of the machine caused it to turn unpredictably in the air and brought the first flight by a person to an abrupt end"
      },
      {
        "id": "B",
        "html": "by indicating that the difficulty in controlling the flight was caused by the rudimentary instruments of the machine and the inexperience of the pilot",
        "text": "by indicating that the difficulty in controlling the flight was caused by the rudimentary instruments of the machine and the inexperience of the pilot"
      },
      {
        "id": "C",
        "html": "by explaining how the pilot and the plane overcame adverse conditions in order to complete the first piloted flight",
        "text": "by explaining how the pilot and the plane overcame adverse conditions in order to complete the first piloted flight"
      },
      {
        "id": "D",
        "html": "by indicating that the gradual change in wind velocity created an extreme environment in which to maneuver the plane and maintain its flight",
        "text": "by indicating that the gradual change in wind velocity created an extreme environment in which to maneuver the plane and maintain its flight"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q021",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "21",
      "pages": [
        16
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 5 helps convey Orville Wright’s perspective\nabout the first flight.\nA. Incorrect. Although the sentence from paragraph 5 refers to the velocity of the wind during\nthe flight, there is no indication that Orville felt a sense of frustration with the windy\nconditions. Instead, the sentence emphasizes the “speed of the machine relative to the air”\nand presents the equivalent flight length if the machine had flown through calm air (“the\nlength of the flight was equivalent to a flight of 540 feet made in calm air”), details that\nemphasize the importance of the Wrights’ accomplishment.\nB. CORRECT. In the sentence from paragraph 5, Orville uses the wind velocity and the machine\nspeed to highlight the distance that the plane covered while in the air and to determine the\ndistance that it would have flown on a day with calm winds, which emphasizes the magnitude\nof the accomplishment.\nC. Incorrect. Since Orville does not suggest in the sentence from paragraph 5 how far the plane\ntraveled under the actual conditions of high winds, the comparison is incomplete.\nAdditionally, this statement does not address the reason that he would make such a\ncomparison, which allowed him to describe the flight in more impressive terms (540 feet\nversus 120 feet).\nD. Incorrect. Unlike the wind velocity calculations made in preparation for the flight, which\nmight help in determining the success of future flights, the comparative calculations that\nOrville provides in the sentence from paragraph 5 help interpret the results of the first flight\n(by describing how fast and far the machine flew relative to the flying conditions) and\nthereby communicate its success. The calculations of the first flight's relative speed and\nequivalent distance would not affect the success of future flights, but the information does\nprovide context for understanding the Wright brothers' accomplishment.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q021-explanation-1.png\" alt=\"Official explanation for source question 21; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nAs the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.\n\nHow does the sentence help convey Orville Wright’s perspective about this first flight?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.</strong></blockquote><p>How does the sentence help convey Orville Wright’s perspective about this first flight?</p>",
    "topic": "Inference",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q022",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "22",
      "pages": [
        16
      ]
    },
    "explanation": "The question asks how the sentence contributes to paragraph 5.\nE. Incorrect. The sentence focuses on the “sudden dart” of the plane, which ended the flight.\nAccording to the paragraph, this sudden dart was caused by the difficulty of controlling the\nfront rudder “on account of its being balanced too near the center.” The sentence does not\ndetail the need for the pilot to have quick reflexes.\nF. CORRECT. The sentence presents the idea that the difficulty of operating the machine\nbrought the flight to a quicker end than it might otherwise have had. According to\nparagraph 5, “control of the front rudder was difficult on account of its being balanced too\nnear the center. This gave it a tendency to turn itself when started.” These sentences show\nthat one such “dart” shortened the flight.\nG. Incorrect. Although it describes the abrupt end of the flight, the sentence does not describe\nthe shift in wind speed. The word “dart” refers instead to a change in the height, or altitude,\nof the machine.\nH. Incorrect. Although it includes the detail that the flight ended “a little over 120 feet from the\npoint at which it rose into the air,” the sentence does not provide an overview of the entire\nflight's progression. The sentence from paragraph 5 omits the flight’s takeoff and only\ndescribes its rather abrupt ending.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q022-explanation-1.png\" alt=\"Official explanation for source question 22; original printed answer labels retained.\" width=\"684\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nA sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight.\n\nHow does the sentence contribute to the paragraph?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight.</strong></blockquote><p>How does the sentence contribute to the paragraph?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It details the need for the pilot to have quick reflexes while flying the machine.</p>",
        "text": "It details the need for the pilot to have quick reflexes while flying the machine."
      },
      {
        "id": "B",
        "html": "<p>It presents the idea that the difficulty of operating the machine shortened the flight.</p>",
        "text": "It presents the idea that the difficulty of operating the machine shortened the flight."
      },
      {
        "id": "C",
        "html": "<p>It describes the shift in wind speed that made flying nearly impossible.</p>",
        "text": "It describes the shift in wind speed that made flying nearly impossible."
      },
      {
        "id": "D",
        "html": "<p>It provides an overview of the flight’s progression from takeoff to landing.</p>",
        "text": "It provides an overview of the flight’s progression from takeoff to landing."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q023",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "23",
      "pages": [
        16
      ]
    },
    "explanation": "The question asks what idea is most clearly conveyed by the words “only,” “nevertheless,” and\n“finally” in the sentence from paragraph 5.\nA. Incorrect. Although the duration of the flight was short and a successful flight had taken a\nlong time to achieve, the words in the sentence from paragraph 5 are used to emphasize the\nremarkable nature of the flight, not the length of time it had taken the Wright brothers to be\nsuccessful.\nB. Incorrect. While it is easy to imagine that the Wright brothers had hope for longer flights, the\nwords in the sentence from paragraph 5 do not relate directly to this sentiment; instead, they\ndescribe the groundbreaking success of their flight.\nC. Incorrect. While the capabilities of the aircraft were demonstrated during the flight, the words\nin the sentence from paragraph 5 apply not only to the machine but also to the efforts of the\npeople who designed it, built it, and actually made it fly.\nD. CORRECT. The words in the sentence from paragraph 5 suggest that, though the first flight\nmay not have lasted very long or taken the pilot very far, the Wright brothers accomplished\nsomething no one had been able to do before: successfully pilot an airplane in flight.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q023-explanation-1.png\" alt=\"Official explanation for source question 23; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nThis flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.\n\nThe words “only,” “nevertheless,” and “finally” most clearly convey the idea that",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</strong></blockquote><p>The words “only,” “nevertheless,” and “finally” most clearly convey the idea that</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "even a flight of such minor duration had taken a long time to achieve.",
        "text": "even a flight of such minor duration had taken a long time to achieve."
      },
      {
        "id": "B",
        "html": "the short flight gave the Wright brothers hope for longer ones in the future.",
        "text": "the short flight gave the Wright brothers hope for longer ones in the future."
      },
      {
        "id": "C",
        "html": "the flight proved that the machine was, at last, capable of becoming airborne.",
        "text": "the flight proved that the machine was, at last, capable of becoming airborne."
      },
      {
        "id": "D",
        "html": "although it was brief, the flight was a remarkable accomplishment.",
        "text": "although it was brief, the flight was a remarkable accomplishment."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q024",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "24",
      "pages": [
        17
      ]
    },
    "explanation": "The question asks which sentence from the excerpt best supports the idea that the Wright\nbrothers had to adapt their plans for the flight in order to accommodate weather conditions.\nE. Incorrect. Although the sentence from paragraph 1 mentions the rainy weather and frozen\npuddles, it does not specifically explain how these weather conditions forced the brothers to\nadapt their plans for the flight.\nF. CORRECT. The sentence from paragraph 1 reveals that the Wright brothers adapted by\nmaking a risk calculation, based on the wind speed, before the flight. The high speed of the\nwind could cause difficulties in flight while simultaneously allowing for a slower, more\ncontrolled landing.\nG. Incorrect. The sentence from paragraph 4 does mention wind, but it describes what Orville\nwas doing during the attempted flight, not the factors he considered before the flight in order\nto adapt the plan.\nH. Incorrect. Although the sentence from paragraph 5 mentions the “irregularity of the air”\nduring the flight, the sentence does not describe how the brothers adapted their plans for the\nflight based on the weather.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q024-explanation-1.png\" alt=\"Official explanation for source question 24; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?",
    "promptHtml": "<p>Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice.” (paragraph 1)</p>",
        "text": "“When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "<p>“We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.” (paragraph 1)</p>",
        "text": "“We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.” (paragraph 1)"
      },
      {
        "id": "C",
        "html": "<p>“After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind.” (paragraph 4)</p>",
        "text": "“After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind.” (paragraph 4)"
      },
      {
        "id": "D",
        "html": "<p>“The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine.” (paragraph 5)</p>",
        "text": "“The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine.” (paragraph 5)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b-pdf-shsat-2021-2022-b-q025",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "25",
      "pages": [
        17
      ]
    },
    "explanation": "The question asks how the use of chronological structure contributes to the development of ideas\nin the excerpt.\nA. CORRECT. Through the chronological structure, Orville addresses all stages of the flight in a\nway that builds from flight concerns and preparations for takeoff to his experiences during\nthe flight and his successful landing.\nB. Incorrect. While obstacles are presented within the excerpt, the chronological structure\nemphasizes the events that ended in the successful achievement of flight on that day rather\nthan how the Wright brothers overcame obstacles.\nC. Incorrect. The chronological structure of the excerpt does not show that the Wright brothers\napplied lessons learned from their previous attempts at flight; instead, the structure\ndescribes Orville’s December 17 attempt.\nD. Incorrect. While Orville’s narrative certainly shows a strong need to analyze wind speed, this\nidea is not conveyed through the chronological structure of the excerpt. Additionally, the\ndescription of the first flight on December 17 indicates that it did not take place in ideal\nconditions (“We realized the difficulties of flying in so high a wind” [paragraph 1] and “The\ncourse of the flight up and down was exceedingly erratic, partly due to the irregularity of the\nair” [paragraph 5]).",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q025-explanation-1.png\" alt=\"Official explanation for source question 25; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "The use of chronological structure contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>The use of chronological structure contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "outlining the actions that the Wright brothers took to prepare for and successfully complete the first flight.",
        "text": "outlining the actions that the Wright brothers took to prepare for and successfully complete the first flight."
      },
      {
        "id": "B",
        "html": "identifying the primary factors that allowed the Wright brothers to overcome obstacles and achieve the first flight.",
        "text": "identifying the primary factors that allowed the Wright brothers to overcome obstacles and achieve the first flight."
      },
      {
        "id": "C",
        "html": "showing how the Wright brothers applied lessons learned from their previous flight attempts to accomplish the first flight.",
        "text": "showing how the Wright brothers applied lessons learned from their previous flight attempts to accomplish the first flight."
      },
      {
        "id": "D",
        "html": "demonstrating how the Wright brothers analyzed the impact of wind velocity to identify the ideal conditions for the first flight.",
        "text": "demonstrating how the Wright brothers analyzed the impact of wind velocity to identify the ideal conditions for the first flight."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromHowWeMadeTheFirstFlight20212022FormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-how-we-made-the-first-flight-2021-2022-form-b",
  versionLabels: ["2021-2022 Form B"],
  label: "2021-2022 Form B",
  section: "reading",
  questionCount: excerptFromHowWeMadeTheFirstFlight20212022FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-how-we-made-the-first-flight-2021-2022-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “How We Made the First Flight”",
    blurbHtml: "<p><em>In 1903 brothers Wilbur and Orville Wright conducted various experiments related to flying machines.</em> <em>These experiments would eventually lead to air travel becoming a reliable form of transportation.</em></p>",
    sourceNoteHtml: "<p>From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2021-2022-form-b","label":"2021-2022 Form B","year":"2021-2022","form":"B","packageId":"6248d78c0e22a3960fbca838c5f1494de00c969a089f4c878b37ea53f6d173cb"},
    title: "Excerpt from “How We Made the First Flight”",
    author: "Orville Wright",
    byline: "by Orville Wright",
    blurb: "In 1903 brothers Wilbur and Orville Wright conducted various experiments related to flying machines. These experiments would eventually lead to air travel becoming a reliable form of transportation.",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the <span data-glossary-definition=\"one of the rescue stations along the Atlantic coastline that provided assistance to mariners in distress\" role=\"link\" tabindex=\"0\">Life Saving Station</span>. We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.</p><h3>Final Preparations</h3><p data-numbered=\"true\">We laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large <span data-glossary-definition=\"a very hard material composed of carbon and other heavy metals\" role=\"link\" tabindex=\"0\">carbide</span> can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the <span data-glossary-definition=\"the town of Kill Devil Hills in eastern North Carolina\" role=\"link\" tabindex=\"0\">Kill Devil</span> Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from <span data-glossary-definition=\"a town in eastern North Carolina\" role=\"link\" tabindex=\"0\">Nags Head</span>, had arrived.</p><p data-numbered=\"true\">We had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .</p><h3>Audacity—and Calculation</h3><p data-numbered=\"true\">Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.</p><h3>Flight</h3><p data-numbered=\"true\">The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</p>",
    sourceNote: "From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration",
    text: excerptFromHowWeMadeTheFirstFlight20212022FormBPassageText,
    versionLabel: "2021-2022 Form B",
  }),
  questions: excerptFromHowWeMadeTheFirstFlight20212022FormBQuestions,
};
