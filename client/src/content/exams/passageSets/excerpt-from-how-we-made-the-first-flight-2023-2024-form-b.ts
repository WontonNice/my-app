import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromHowWeMadeTheFirstFlight20232024FormBPassageText = "1 During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the Life Saving Station. We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.\n\nFinal Preparations\n\n2 We laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large carbide can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the Kill Devil Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from Nags Head, had arrived.\n\n3 We had a “Richard” hand anemometer with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .\n\nAudacity—and Calculation\n\n4 Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.\n\nFlight\n\n5 The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.";

const excerptFromHowWeMadeTheFirstFlight20232024FormBQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q027",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "27",
      "pages": [
        21
      ]
    },
    "explanation": "The question asks how paragraph 1 introduces the idea that the Wright brothers knew that their\n\nflight attempt was risky.\n\nA. CORRECT. Paragraph 1 describes the Wright brothers hanging out “the signal” to notify the lifesaving crew to stand by as they attempted flight; the need for lifesaving experts to be available in case of an accident introduces the idea that the attempted flight might crash. B. Incorrect. The specifics on the speed of the wind by themselves do not emphasize the danger of the flight. While the brothers admitted that the strong wind posed certain risks, they also noted that the windy conditions might make landing safer (“estimated that the added dangers in flight would be partly compensated for by the slower speed in landing” [paragraph 1]). C. Incorrect. A slower landing was expected as a result of the windy conditions, but it was not part of a plan to increase the safety of the flight. D. Incorrect. While the Wright brothers’ initial decision to wait to see whether the wind would die down does suggest they were concerned about the safety of the flight, the explanation of their decision to proceed with the flight shows that they expected one benefit from the poor weather: “the slower speed in landing” (paragraph 1).",
    "explanationHtml": "<p>The question asks how paragraph 1 introduces the idea that the Wright brothers knew that their</p><p>flight attempt was risky.</p><p><strong>A. CORRECT. </strong>Paragraph 1 describes the Wright brothers hanging out “the signal” to notify the lifesaving crew to stand by as they attempted flight; the need for lifesaving experts to be available in case of an accident introduces the idea that the attempted flight might crash. <strong>B. </strong>Incorrect. The specifics on the speed of the wind by themselves do not emphasize the danger of the flight. While the brothers admitted that the strong wind posed certain risks, they also noted that the windy conditions might make landing safer (“estimated that the added dangers in flight would be partly compensated for by the slower speed in landing” [paragraph 1]). <strong>C. </strong>Incorrect. A slower landing was expected as a result of the windy conditions, but it was not part of a plan to increase the safety of the flight. <strong>D. </strong>Incorrect. While the Wright brothers’ initial decision to wait to see whether the wind would die down does suggest they were concerned about the safety of the flight, the explanation of their decision to proceed with the flight shows that they expected one benefit from the poor weather: “the slower speed in landing” (paragraph 1).</p>",
    "points": 1,
    "prompt": "How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?",
    "promptHtml": "<p>How does paragraph 1 introduce the idea that the Wright brothers knew that their flight attempt was risky?</p>",
    "topic": "Inference",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q028",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "28",
      "pages": [
        22
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 4 contributes to the development of ideas\n\nin the excerpt.\n\nE. Incorrect. The sentence from paragraph 4 does not refer to the challenge of the winter conditions during the flight attempt. F. Incorrect. While the sentence from paragraph 4 specifically references a previous flight several days earlier, it does not state how many attempts came before Wilbur’s attempt on December 14. G. CORRECT. The sentence from paragraph 4 indicates that the Wright brothers had agreed to take turns attempting to achieve the first flight, which suggests their eagerness to each be the first to successfully fly the machine. H. Incorrect. Orville’s trial came about simply because the brothers took turns, which would suggest that there was no greater likelihood of success or reason to be more confident at that moment than there had been for previous attempts.",
    "explanationHtml": "<p>The question asks how the sentence from paragraph 4 contributes to the development of ideas</p><p>in the excerpt.</p><p><strong>E. </strong>Incorrect. The sentence from paragraph 4 does not refer to the challenge of the winter conditions during the flight attempt. <strong>F. </strong>Incorrect. While the sentence from paragraph 4 specifically references a previous flight several days earlier, it does not state how many attempts came before Wilbur’s attempt on December 14. <strong>G. CORRECT. </strong>The sentence from paragraph 4 indicates that the Wright brothers had agreed to take turns attempting to achieve the first flight, which suggests their eagerness to each be the first to successfully fly the machine. <strong>H. </strong>Incorrect. Orville’s trial came about simply because the brothers took turns, which would suggest that there was no greater likelihood of success or reason to be more confident at that moment than there had been for previous attempts.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nWilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me.\n\nThe sentence contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong>Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to</strong> <strong>the first trial now belonged to me.</strong></blockquote><p>The sentence contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q029",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "29",
      "pages": [
        22
      ]
    },
    "explanation": "The question asks why the photograph mentioned in paragraph 4 is significant.\n\nA. Incorrect. According to paragraph 4, the photograph was not taken immediately after the tethering wire was released but rather after an intervening period during which “Wilbur ran at the side of the machine, holding the wing to balance it on the track.” The picture was not taken until “the machine had reached the end of the track,” which occurred after a “forty-foot run” (paragraph 4). B. CORRECT. The photograph mentioned in paragraph 4 is significant because it provides proof that the machine did, in fact, take flight: “One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.” C. Incorrect. The photograph mentioned in paragraph 4 is described as showing the plane moving forward through the air at a height of two feet, but while the effect of the wind may be visible, it is not why the photo is significant. Instead, the photograph provides proof that the plane is, in fact, moving through the air (“One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude”). D. Incorrect. Although the plane is shown at a height of two feet in the photograph mentioned in paragraph 4, the picture documents only one moment of the plane’s flight and does not provide proof that the pilot had to gradually increase the height of the plane in the air.",
    "explanationHtml": "<p>The question asks why the photograph mentioned in paragraph 4 is significant.</p><p><strong>A. </strong>Incorrect. According to paragraph 4, the photograph was not taken immediately after the tethering wire was released but rather after an intervening period during which “Wilbur ran at the side of the machine, holding the wing to balance it on the track.” The picture was not taken until “the machine had reached the end of the track,” which occurred after a “forty-foot run” (paragraph 4). <strong>B. CORRECT. </strong>The photograph mentioned in paragraph 4 is significant because it provides proof that the machine did, in fact, take flight: “One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.” <strong>C. </strong>Incorrect. The photograph mentioned in paragraph 4 is described as showing the plane moving forward through the air at a height of two feet, but while the effect of the wind may be visible, it is not why the photo is significant. Instead, the photograph provides proof that the plane is, in fact, moving through the air (“One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude”). <strong>D. </strong>Incorrect. Although the plane is shown at a height of two feet in the photograph mentioned in paragraph 4, the picture documents only one moment of the plane’s flight and does not provide proof that the pilot had to gradually increase the height of the plane in the air.</p>",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q030",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "30",
      "pages": [
        22
      ]
    },
    "explanation": "The question asks how the details in paragraph 5 about the uneven nature of the flight convey\n\na central idea of the excerpt.\n\nE. Incorrect. Paragraph 5 explains that the rudder was unbalanced and the effect that this issue had on the flight, but the rudder was only part of the reason for the short flight. The length of the flight is not a central idea of the excerpt. F. Incorrect. Although paragraph 5 does explain that the equipment contributed to the difficulty of controlling the plane’s flight, the lack of control over the flight is not a central idea of the excerpt, which focuses instead on the Wright brothers’ achievement of a successful flight despite the challenges involved. G. CORRECT. The details in paragraph 5 describe the difficulties that the weather conditions and mechanical issues presented and how Orville’s flight was successful despite those problems. The Wright brothers’ ability to overcome difficult circumstances and complete the first flight is a central idea of the excerpt. H. Incorrect. While paragraph 5 does emphasize the difficulty caused by the wind, it does not describe a “gradual change” in the wind, only that it was irregular.",
    "explanationHtml": "<p>The question asks how the details in paragraph 5 about the uneven nature of the flight convey</p><p>a central idea of the excerpt.</p><p><strong>E. </strong>Incorrect. Paragraph 5 explains that the rudder was unbalanced and the effect that this issue had on the flight, but the rudder was only part of the reason for the short flight. The length of the flight is not a central idea of the excerpt. <strong>F. </strong>Incorrect. Although paragraph 5 does explain that the equipment contributed to the difficulty of controlling the plane’s flight, the lack of control over the flight is not a central idea of the excerpt, which focuses instead on the Wright brothers’ achievement of a successful flight despite the challenges involved. <strong>G. CORRECT. </strong>The details in paragraph 5 describe the difficulties that the weather conditions and mechanical issues presented and how Orville’s flight was successful despite those problems. The Wright brothers’ ability to overcome difficult circumstances and complete the first flight is a central idea of the excerpt. <strong>H. </strong>Incorrect. While paragraph 5 does emphasize the difficulty caused by the wind, it does not describe a “gradual change” in the wind, only that it was irregular.</p>",
    "points": 1,
    "prompt": "How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?",
    "promptHtml": "<p>How do the details in paragraph 5 about the uneven nature of the flight convey a central idea of the excerpt?</p>",
    "topic": "Central Idea & Theme",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q031",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "31",
      "pages": [
        23
      ]
    },
    "explanation": "The question asks how the sentence from paragraph 5 helps convey Orville Wright’s perspective\n\nabout the first flight.\n\nA. Incorrect. Although the sentence from paragraph 5 refers to the velocity of the wind during the flight, there is no indication that Orville felt a sense of frustration with the windy conditions. Instead, the sentence emphasizes the “speed of the machine relative to the air” and presents the equivalent flight length if the machine had flown through calm air (“the length of the flight was equivalent to a flight of 540 feet made in calm air”), details that emphasize the importance of the Wrights’ accomplishment. B. CORRECT. In the sentence from paragraph 5, Orville uses the wind velocity and the machine speed to highlight the distance that the plane covered while in the air and to determine the distance that it would have flown on a day with calm winds, which emphasizes the magnitude of the accomplishment. C. Incorrect. Since Orville does not suggest in the sentence from paragraph 5 how far the plane traveled under the actual conditions of high winds, the comparison is incomplete. Additionally, this statement does not address the reason that he would make such a comparison, which allowed him to describe the flight in more impressive terms (540 feet versus 120 feet). D. Incorrect. Unlike the wind velocity calculations made in preparation for the flight, which might help in determining the success of future flights, the comparative calculations that Orville provides in the sentence from paragraph 5 help interpret the results of the first flight (by describing how fast and far the machine flew relative to the flying conditions) and thereby communicate its success. The calculations of the first flight’s relative speed and equivalent distance would not affect the success of future flights, but the information does provide context for understanding the Wright brothers’ accomplishment.",
    "explanationHtml": "<p>The question asks how the sentence from paragraph 5 helps convey Orville Wright’s perspective</p><p>about the first flight.</p><p><strong>A. </strong>Incorrect. Although the sentence from paragraph 5 refers to the velocity of the wind during the flight, there is no indication that Orville felt a sense of frustration with the windy conditions. Instead, the sentence emphasizes the “speed of the machine relative to the air” and presents the equivalent flight length if the machine had flown through calm air (“the length of the flight was equivalent to a flight of 540 feet made in calm air”), details that emphasize the importance of the Wrights’ accomplishment. <strong>B. CORRECT. </strong>In the sentence from paragraph 5, Orville uses the wind velocity and the machine speed to highlight the distance that the plane covered while in the air and to determine the distance that it would have flown on a day with calm winds, which emphasizes the magnitude of the accomplishment. <strong>C. </strong>Incorrect. Since Orville does not suggest in the sentence from paragraph 5 how far the plane traveled under the actual conditions of high winds, the comparison is incomplete. Additionally, this statement does not address the reason that he would make such a comparison, which allowed him to describe the flight in more impressive terms (540 feet versus 120 feet). <strong>D. </strong>Incorrect. Unlike the wind velocity calculations made in preparation for the flight, which might help in determining the success of future flights, the comparative calculations that Orville provides in the sentence from paragraph 5 help interpret the results of the first flight (by describing how fast and far the machine flew relative to the flying conditions) and thereby communicate its success. The calculations of the first flight’s relative speed and equivalent distance would not affect the success of future flights, but the information does provide context for understanding the Wright brothers’ accomplishment.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nAs the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air.\n\nHow does the sentence help convey Orville Wright’s perspective about this first flight?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>As the velocity of the wind was over 35 feet per second and the speed of the</strong> <strong>machine over the ground against this wind ten feet per second, the speed of the</strong> <strong>machine relative to the air was over 45 feet per second, and the length of the</strong> <strong>flight was equivalent to a flight of 540 feet made in calm air.</strong></blockquote><p>How does the sentence help convey Orville Wright’s perspective about this first flight?</p>",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "32",
      "pages": [
        23
      ]
    },
    "explanation": "The question asks how the sentence contributes to paragraph 5.\n\nE. Incorrect. The sentence focuses on the “sudden dart” of the plane, which ended the flight. According to the paragraph, this sudden dart was caused by the difficulty of controlling the front rudder “on account of its being balanced too near the center.” The sentence does not detail the need for the pilot to have quick reflexes. F. CORRECT. The sentence presents the idea that the difficulty of operating the machine brought the flight to a quicker end than it might otherwise have had. According to paragraph 5, “control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started.” These sentences show that one such “dart” shortened the flight. G. Incorrect. Although it describes the abrupt end of the flight, the sentence does not describe the shift in wind speed. The word “dart” refers instead to a change in the height, or altitude, of the machine. H. Incorrect. Although it includes the detail that the flight ended “a little over 120 feet from the point at which it rose into the air,” the sentence does not provide an overview of the entire flight’s progression. The sentence from paragraph 5 omits the flight’s takeoff and only describes its rather abrupt ending.",
    "explanationHtml": "<p>The question asks how the sentence contributes to paragraph 5.</p><p><strong>E. </strong>Incorrect. The sentence focuses on the “sudden dart” of the plane, which ended the flight. According to the paragraph, this sudden dart was caused by the difficulty of controlling the front rudder “on account of its being balanced too near the center.” The sentence does not detail the need for the pilot to have quick reflexes. <strong>F. CORRECT. </strong>The sentence presents the idea that the difficulty of operating the machine brought the flight to a quicker end than it might otherwise have had. According to paragraph 5, “control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started.” These sentences show that one such “dart” shortened the flight. <strong>G. </strong>Incorrect. Although it describes the abrupt end of the flight, the sentence does not describe the shift in wind speed. The word “dart” refers instead to a change in the height, or altitude, of the machine. <strong>H. </strong>Incorrect. Although it includes the detail that the flight ended “a little over 120 feet from the point at which it rose into the air,” the sentence does not provide an overview of the entire flight’s progression. The sentence from paragraph 5 omits the flight’s takeoff and only describes its rather abrupt ending.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nA sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight.\n\nHow does the sentence contribute to the paragraph?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>A sudden dart when a little over a hundred feet from the end of the track, or a</strong> <strong>little over 120 feet from the point at which it rose into the air, ended the flight.</strong></blockquote><p>How does the sentence contribute to the paragraph?</p>",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q033",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "33",
      "pages": [
        24
      ]
    },
    "explanation": "The question asks what idea is most clearly conveyed by the words “only,” “nevertheless,” and\n\n“finally” in the sentence from paragraph 5.\n\nA. Incorrect. Although the duration of the flight was short and a successful flight had taken a long time to achieve, the words in the sentence from paragraph 5 are used to emphasize the remarkable nature of the flight, not the length of time it had taken the Wright brothers to be successful. B. Incorrect. While it is easy to imagine that the Wright brothers had hope for longer flights, the words in the sentence from paragraph 5 do not relate directly to this sentiment; instead, they describe the groundbreaking success of their flight. C. Incorrect. While the capabilities of the aircraft were demonstrated during the flight, the words in the sentence from paragraph 5 apply not only to the machine but also to the efforts of the people who designed it, built it, and actually made it fly. D. CORRECT. The words in the sentence from paragraph 5 suggest that, though the first flight may not have lasted very long or taken the pilot very far, the Wright brothers accomplished something no one had been able to do before: successfully pilot an airplane in flight.",
    "explanationHtml": "<p>The question asks what idea is <strong>most </strong>clearly conveyed by the words “only,” “nevertheless,” and</p><p>“finally” in the sentence from paragraph 5.</p><p><strong>A. </strong>Incorrect. Although the duration of the flight was short and a successful flight had taken a long time to achieve, the words in the sentence from paragraph 5 are used to emphasize the remarkable nature of the flight, not the length of time it had taken the Wright brothers to be successful. <strong>B. </strong>Incorrect. While it is easy to imagine that the Wright brothers had hope for longer flights, the words in the sentence from paragraph 5 do not relate directly to this sentiment; instead, they describe the groundbreaking success of their flight. <strong>C. </strong>Incorrect. While the capabilities of the aircraft were demonstrated during the flight, the words in the sentence from paragraph 5 apply not only to the machine but also to the efforts of the people who designed it, built it, and actually made it fly. <strong>D. CORRECT. </strong>The words in the sentence from paragraph 5 suggest that, though the first flight may not have lasted very long or taken the pilot very far, the Wright brothers accomplished something no one had been able to do before: successfully pilot an airplane in flight.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nThis flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.\n\nThe words “only,” “nevertheless,” and “finally” most clearly convey the idea that",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>This flight lasted only 12 seconds, but it was nevertheless the first in the history</strong> <strong>of the world in which a machine carrying a man had raised itself by its own power</strong> <strong>into the air in full flight, had sailed forward without reduction of speed and had</strong> <strong>finally landed at a point as high as that from which it started.</strong></blockquote><p>The words “only,” “nevertheless,” and “finally” <strong>most </strong>clearly convey the idea that</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>even a flight of such minor duration had taken a long time to achieve.</p>",
        "text": "even a flight of such minor duration had taken a long time to achieve."
      },
      {
        "id": "B",
        "html": "<p>the short flight gave the Wright brothers hope for longer ones in the future.</p>",
        "text": "the short flight gave the Wright brothers hope for longer ones in the future."
      },
      {
        "id": "C",
        "html": "<p>the flight proved that the machine was, at last, capable of becoming airborne.</p>",
        "text": "the flight proved that the machine was, at last, capable of becoming airborne."
      },
      {
        "id": "D",
        "html": "<p>although it was brief, the flight was a remarkable accomplishment.</p>",
        "text": "although it was brief, the flight was a remarkable accomplishment."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "34",
      "pages": [
        24
      ]
    },
    "explanation": "The question asks which sentence from the excerpt best supports the idea that the Wright\n\nbrothers had to adapt their plans for the flight in order to accommodate weather conditions.\n\nE. Incorrect. Although the sentence from paragraph 1 mentions the rainy weather and frozen puddles, it does not specifically explain how these weather conditions forced the brothers to adapt their plans for the flight. F. CORRECT. The sentence from paragraph 1 reveals that the Wright brothers adapted by making a risk calculation, based on the wind speed, before the flight. The high speed of the wind could cause difficulties in flight while simultaneously allowing for a slower, more controlled landing. G. Incorrect. The sentence from paragraph 4 does mention wind, but it describes what Orville was doing during the attempted flight, not the factors he considered before the flight in order to adapt the plan. H. Incorrect. Although the sentence from paragraph 5 mentions the “irregularity of the air” during the flight, the sentence does not describe how the brothers adapted their plans for the flight based on the weather.",
    "explanationHtml": "<p>The question asks which sentence from the excerpt <strong>best </strong>supports the idea that the Wright</p><p>brothers had to adapt their plans for the flight in order to accommodate weather conditions.</p><p><strong>E. </strong>Incorrect. Although the sentence from paragraph 1 mentions the rainy weather and frozen puddles, it does not specifically explain how these weather conditions forced the brothers to adapt their plans for the flight. <strong>F. CORRECT. </strong>The sentence from paragraph 1 reveals that the Wright brothers adapted by making a risk calculation, based on the wind speed, before the flight. The high speed of the wind could cause difficulties in flight while simultaneously allowing for a slower, more controlled landing. <strong>G. </strong>Incorrect. The sentence from paragraph 4 does mention wind, but it describes what Orville was doing during the attempted flight, not the factors he considered before the flight in order to adapt the plan. <strong>H. </strong>Incorrect. Although the sentence from paragraph 5 mentions the “irregularity of the air” during the flight, the sentence does not describe how the brothers adapted their plans for the flight based on the weather.</p>",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?",
    "promptHtml": "<p>Which sentence from the excerpt <strong>best </strong>supports the idea that the Wright brothers had to adapt their plans for the flight in order to accommodate the weather conditions?</p>",
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
    "id": "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b-pdf-shsat-2023-2024-b-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "35",
      "pages": [
        24
      ]
    },
    "explanation": "The question asks how the use of chronological structure contributes to the development of\n\nideas in the excerpt.\n\nA. CORRECT. Through the chronological structure, Orville addresses all stages of the flight in a way that builds from flight concerns and preparations for takeoff to his experiences during the flight and his successful landing. B. Incorrect. While obstacles are presented within the excerpt, the chronological structure emphasizes the events that ended in the successful achievement of flight on that day rather than how the Wright brothers overcame obstacles. C. Incorrect. The chronological structure of the excerpt does not show that the Wright brothers applied lessons learned from their previous attempts at flight; instead, the structure describes Orville’s December 17 attempt. D. Incorrect. While Orville’s narrative certainly shows a strong need to analyze wind speed, this idea is not conveyed through the chronological structure of the excerpt. Additionally, the description of the first flight on December 17 indicates that it did not take place in ideal conditions (“We realized the difficulties of flying in so high a wind” [paragraph 1] and “The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air” [paragraph 5]).",
    "explanationHtml": "<p>The question asks how the use of chronological structure contributes to the development of</p><p>ideas in the excerpt.</p><p><strong>A. CORRECT. </strong>Through the chronological structure, Orville addresses all stages of the flight in a way that builds from flight concerns and preparations for takeoff to his experiences during the flight and his successful landing. <strong>B. </strong>Incorrect. While obstacles are presented within the excerpt, the chronological structure emphasizes the events that ended in the successful achievement of flight on that day rather than how the Wright brothers overcame obstacles. <strong>C. </strong>Incorrect. The chronological structure of the excerpt does not show that the Wright brothers applied lessons learned from their previous attempts at flight; instead, the structure describes Orville’s December 17 attempt. <strong>D. </strong>Incorrect. While Orville’s narrative certainly shows a strong need to analyze wind speed, this idea is not conveyed through the chronological structure of the excerpt. Additionally, the description of the first flight on December 17 indicates that it did not take place in ideal conditions (“We realized the difficulties of flying in so high a wind” [paragraph 1] and “The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air” [paragraph 5]).</p>",
    "points": 1,
    "prompt": "The use of chronological structure contributes to the development of ideas in the excerpt by",
    "promptHtml": "<p>The use of chronological structure contributes to the development of ideas in the excerpt by</p>",
    "topic": "Text Structure & Purpose",
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

export const excerptFromHowWeMadeTheFirstFlight20232024FormBPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-how-we-made-the-first-flight-2023-2024-form-b",
  versionLabels: ["2023-2024 Form B"],
  label: "2023-2024 Form B",
  section: "reading",
  questionCount: excerptFromHowWeMadeTheFirstFlight20232024FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-how-we-made-the-first-flight-2023-2024-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from “How We Made the First Flight”",
    blurbHtml: "<p><em>In 1903 brothers Wilbur and Orville Wright conducted experiments related to flying machines.</em> <em>These experiments would eventually lead to air travel becoming a reliable form of transportation.</em></p>",
    sourceNoteHtml: "<p>From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2023-2024-form-b","label":"2023-2024 Form B","year":"2023-2024","form":"B","packageId":"99cf8d7dae0050ba0dfbeca7ab7aa1503ec479b8058672391d419347a4594ac2"},
    title: "Excerpt from “How We Made the First Flight”",
    author: "Orville Wright",
    byline: "by Orville Wright",
    blurb: "In 1903 brothers Wilbur and Orville Wright conducted experiments related to flying machines. These experiments would eventually lead to air travel becoming a reliable form of transportation.",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>1 During the night of December 16, 1903, a strong cold wind blew from the north. When we arose on the morning of the 17th, the puddles of water, which had been standing about camp since the recent rains, were covered with ice. The wind had a velocity of 10 to 12 meters per second (22 to 27 miles an hour). We thought it would die down before long, and so remained indoors the early part of the morning. But when ten o’clock arrived, and the wind was as brisk as ever, we decided that we had better get the machine out and attempt a flight. We hung out the signal for the men of the <span data-glossary-definition=\"one of the rescue stations along the Atlantic coastline that provided assistance to mariners in distress\" role=\"link\" tabindex=\"0\">Life Saving Station</span>. We thought that by facing the flyer into a strong wind, there ought to be no trouble in launching it from the level ground about camp. We realized the difficulties of flying in so high a wind, but estimated that the added dangers in flight would be partly compensated for by the slower speed in landing.</p><h3>Final Preparations</h3><p>2 We laid the track on a smooth stretch of ground about one hundred feet north of the new building. The biting cold wind made work difficult, and we had to warm up frequently in our living room, where we had a good fire in an improvised stove made of a large <span data-glossary-definition=\"a very hard material composed of carbon and other heavy metals\" role=\"link\" tabindex=\"0\">carbide</span> can. By the time all was ready, J. T. Daniels, W. S. Dough and A. D. Etheridge, members of the <span data-glossary-definition=\"the town of Kill Devil Hills in eastern North Carolina\" role=\"link\" tabindex=\"0\">Kill Devil</span> Life Saving Station; W. C. Brinkley of Manteo, and Johnny Moore, a boy from <span data-glossary-definition=\"a town in eastern North Carolina\" role=\"link\" tabindex=\"0\">Nags Head</span>, had arrived.</p><p>3 We had a <span data-glossary-definition=\"the type of anemometer produced by Jules Richard, a French manufacturer of scientific instruments\" role=\"link\" tabindex=\"0\">“Richard” hand anemometer</span> with which we measured the velocity of the wind. Measurements made just before starting the first flight showed velocities of 11 to 12 meters per second, or 24 to 27 miles per hour. . . .</p><h3>Audacity—and Calculation</h3><p>4 Wilbur having used his turn in the unsuccessful attempt on the 14th, the right to the first trial now belonged to me. After running the motor a few minutes to heat it up, I released the wire that held the machine to the track, and the machine started forward in the wind. Wilbur ran at the side of the machine, holding the wing to balance it on the track. Unlike the start on the 14th, made in a calm, the machine, facing a 27-mile wind, started very slowly. Wilbur was able to stay with it till it lifted from the track after a forty-foot run. One of the Life Saving men snapped the camera for us, taking a picture just as the machine had reached the end of the track and had risen to a height of about two feet. The slow forward speed of the machine over the ground is clearly shown in the picture by Wilbur’s attitude. He stayed along beside the machine without any effort.</p><h3>Flight</h3><p>5 The course of the flight up and down was exceedingly erratic, partly due to the irregularity of the air, and partly to lack of experience in handling this machine. The control of the front rudder was difficult on account of its being balanced too near the center. This gave it a tendency to turn itself when started; so that it turned too far on one side and then too far on the other. As a result the machine would rise suddenly to about ten feet, and then as suddenly dart for the ground. A sudden dart when a little over a hundred feet from the end of the track, or a little over 120 feet from the point at which it rose into the air, ended the flight. As the velocity of the wind was over 35 feet per second and the speed of the machine over the ground against this wind ten feet per second, the speed of the machine relative to the air was over 45 feet per second, and the length of the flight was equivalent to a flight of 540 feet made in calm air. This flight lasted only 12 seconds, but it was nevertheless the first in the history of the world in which a machine carrying a man had raised itself by its own power into the air in full flight, had sailed forward without reduction of speed and had finally landed at a point as high as that from which it started.</p>",
    sourceNote: "From “How We Made the First Flight” by Orville Wright—Public Domain/Federal Aviation Administration",
    text: excerptFromHowWeMadeTheFirstFlight20232024FormBPassageText,
    versionLabel: "2023-2024 Form B",
  }),
  questions: excerptFromHowWeMadeTheFirstFlight20232024FormBQuestions,
};
