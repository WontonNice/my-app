import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const odeToFireworks20192020FormAPassageText = "In autumn my mother drove us to the edge of the field\nwhere the fair was set up year after year:\nthe carousel, the bumper cars, the long, low sheds\nfilled with prizewinning animals.\nWe—my sister, my cousin, and I—were ready for bed,\nalready in our pajamas. This was a treat we waited\nall year for. We waited in the darkness\nfor the first low, dull thwumps, like someone\nbeating an old, filthy rug hung on a wash line.\nThen we counted the seconds between the lightning\nand thunder, as we also used to do, until the sky\nlit up: red, blue, green, gold. In my mind’s eye\nI can still see the straggly, ancient oak whose branches\nreached up past the exhibition halls, silhouetted\nagainst the spectrum of stars that cascaded behind it.\n\nIt was one thing to look up into the sky\nand imagine yourself in it or to make out pictures\namong the clouds, which my sister liked to do.\nNo, I would tell her, that cloud\ndoes not look like an elephant, a hat, an umbrella.\nBut it was another thing to see\nthe sky at night written upon\nwith those jewels. (We lived in the country:\nnight was night.) All around us, crickets\nstridulated in the stubble of what had been\nsomebody’s cornfield, their song rising and falling.\nYou could smell winter on the air’s edge.\n\nNow, in the city, when the sky dips into shadow\nat New Year’s or on the Fourth of July, I find myself\ncraning my neck upward at odd moments.\nThe city sky is always lit up. This is where we live now,\nand it is how we live now, awash in light\nof every hue. Everything is a constant celebration:\npicking up washing at the cleaner’s or stopping by\nthe corner market for a loaf of heavy bread.\nAnd the music around me is the music of people,\ntheir voices rising and falling in a hundred languages.\nBut beneath the yellowish glow deep in the sky\nof all our city lights pelting out into the universe,\nI remember the feel of the pickup truck bumping\nacross the ridged field, as I kept waiting for those\nchildhood bursts, watching as they escorted us home.";

const odeToFireworks20192020FormAQuestions: ExamQuestion[] = [
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q18",
    "skilled": "TBD",
    "explanation": "The question asks what the fireworks in the poem represent about the speaker.\n\nF: Correct. The speaker misses the experience of watching the fireworks display with family and friends but understands that time has progressed and that life is now different. The lines “This was a treat we waited / all year for” (lines 6–7) highlight the significance of the memory of waiting for and watching the fireworks. In the speaker’s present, the lines “I remember the feel of the pickup truck bumping / across the ridged field” (lines 40–41) emphasize the key details from the experience that stand out in the speaker’s mind when something in the current environment reminds the speaker of the past.\n\nE: Incorrect. While the speaker misses elements of the past, the speaker is also positive about the present, with comparisons to a “constant celebration” (line 33) and descriptions of “the music of people” (line 36). The speaker does not indicate a desire to return to a simpler way of living.\n\nG: Incorrect. While the speaker does share details about the present and the tone is generally positive, the fireworks do not suggest that the speaker has high expectations for how everyday life should be. The third stanza (lines 28–42) describes some of the speaker’s imaginings about the aspects of going about one’s daily life, but the speaker does not form expectations from these fantasies.\n\nH: Incorrect. While the speaker does mention discussing cloud shapes with a family member in lines 19–20, the fireworks serve as a more general reminder of the speaker’s past life. Viewing the bright lights of the city makes the speaker recall memories of the speaker’s past and the feelings of anticipation before the fireworks show.",
    "points": 1,
    "prompt": "The fireworks in the poem represent the speaker’s",
    "promptHtml": "<p>The fireworks in the poem represent the speaker’s</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "wish to return to a simpler way of living."
      },
      {
        "id": "B",
        "text": "bittersweet feelings about leaving the past behind."
      },
      {
        "id": "C",
        "text": "high expectations for everyday life."
      },
      {
        "id": "D",
        "text": "reflections on past interactions with relatives."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q19",
    "skilled": "TBD",
    "explanation": "The question asks what the comparison in lines 8–9 of the poem is used to convey.\n\nA: Correct. In lines 8–9 the speaker compares the deep thumping noises at the start of a fireworks show to the muffled thumping sound made when beating a rug to clean it. The imagery of “low, dull thwumps” (line 8) (onomatopoeia) describes a sound that is not clear or powerful. To the speaker, these low, distant explosions are the signal that the fireworks display is starting and that the loud, cracking sound of fireworks will be heard soon (“Then we counted the seconds between the lightning / and thunder” [lines 10–11]).\n\nB: Incorrect. The comparison in lines 8–9 deals with the low sound of the first fireworks shooting off rather than the streaks of light they emit. To the speaker, the low “thwumps” (onomatopoeia) are the signal that fireworks are about to explode overhead, much like the way a streak of lightning during a storm indicates that a crash of thunder will follow in a few seconds.\n\nC: Incorrect. The thwump (onomatopoeia) sounds are the start of the fireworks show, not thunder. As a comparison, the speaker says the initial “thwumps” of the fireworks signal anticipation for the full explosion that will come, much like the way the speaker would watch for lightning and count the seconds before an impending thunderclap (lines 10–11).\n\nD: Incorrect. The muffled thwump (onomatopoeia) sounds occur before the dazzling explosion of lights and before sparks start to fall from the sky. The comparison focuses on the sounds of the experience, not the sight of the experience.",
    "points": 1,
    "prompt": "The comparison in lines 8–9 of the poem is used to convey",
    "promptHtml": "<p>The comparison in lines 8–9 of the poem is used to convey</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the muffled pounding of explosions in the distance."
      },
      {
        "id": "B",
        "text": "the way lightning streaks through the clouds."
      },
      {
        "id": "C",
        "text": "the echoes of thunder on an autumn night."
      },
      {
        "id": "D",
        "text": "the glow of sparks falling from the sky."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q20",
    "skilled": "TBD",
    "explanation": "The question asks what the word choice in lines 22–23 of the poem conveys about the speaker.\n\nH: Correct. The word “jewels” creates a picture of watching shining and sparkling explosions in the night sky and suggests that this experience holds sentimental and emotional value for the speaker. The speaker cherishes the memory of the experience.\n\nE: Incorrect. The word “jewels” is used figuratively to indicate the sentimental value that the experience of watching the fireworks holds for the speaker. There is no indication in the poem that the speaker values material possessions.\n\nF: Incorrect. The use of the word “jewels” highlights the importance of the memory in the speaker’s mind. The imagery in the words “written upon” expresses the way the bright streaks of light curve and fly across the night sky, not that the speaker views the fireworks display as “magical. ”\n\nG: Incorrect. The speaker describes the elements of the fireworks display that stand out most clearly. The view of the bright, colorful fireworks streaking across the sky is distinct, but it is not unique to the country setting.",
    "points": 1,
    "prompt": "Read lines 22–23 from the poem.\n\nthe sky at night written upon\nwith those jewels.\n\nWhat does the word choice in these lines convey about the speaker?",
    "promptHtml": "<p>Read lines 22–23 from the poem.</p><blockquote><strong>the sky at night written upon<br>with those jewels.</strong></blockquote><p>What does the word choice in these lines convey about the speaker?</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "The speaker values material possessions."
      },
      {
        "id": "B",
        "text": "The speaker imagines that the fireworks are magical."
      },
      {
        "id": "C",
        "text": "The speaker believes that the country setting is distinctive."
      },
      {
        "id": "D",
        "text": "The speaker cherishes the memory of seeing fireworks as a child."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q21",
    "skilled": "TBD",
    "explanation": "The question asks what the use of italics on the word “night” in line 24 is most likely intended to emphasize.\n\nB: Correct. The italics are intended to place emphasis on one key aspect of nighttime—total darkness. The speaker is making a point that night in the country was truly dark, unlike the night the speaker currently experiences in a city, where light emitted from buildings and vehicles prevents complete darkness.\n\nA: Incorrect. The purpose of italicizing the word “night” is not to convey mystery. While the speaker refers to not knowing the exact location where the firework viewing took place (“in the stubble of what had been / somebody’s cornfield” [lines 25–26]), the emphasis on “night” is meant to highlight the darkness and contrast the bright light from the fireworks soaring across the sky.\n\nC: Incorrect. The tone in the second stanza is positive, showing admiration for the beauty visible in true darkness rather than fear: “But it was another thing to see / the sky at night written upon / with those jewels” (lines 21–23).\n\nD: Incorrect. The speaker is talking about the general experience of watching fireworks on several occasions, not focusing on the events of a specific night. The use of italics on the word “night” emphasizes the speaker’s memory of the persistent darkness.",
    "points": 1,
    "prompt": "The use of italics on the word “night” in line 24 is most likely intended to emphasize the",
    "promptHtml": "<p>The use of italics on the word “night” in line 24 is most likely intended to emphasize the</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "sense of mystery in the darkness."
      },
      {
        "id": "B",
        "text": "sense of absolute darkness."
      },
      {
        "id": "C",
        "text": "speaker’s fear of night."
      },
      {
        "id": "D",
        "text": "speaker’s certainty about that night."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q22",
    "skilled": "TBD",
    "explanation": "The question asks what the purpose is of the repeated words “rising and falling” in lines 26 and 37.\n\nF: Correct. The first mention of these words occurs during a recollection of the speaker’s past, and the second takes place during a description of the speaker’s present. The speaker looks to the connections between the country setting (“All around us, crickets / stridulated in the stubble of what had been / somebody’s cornfield, their song rising and falling” [lines 24–26]) and the city setting (“And the music around me is the music of people, / their voices rising and falling in a hundred languages” [lines 36–37]) as a source of comfort.\n\nE: Incorrect. These lines do not provide insight into the speaker’s interactions or feelings of solitude. The speaker mentions the emptiness of the country and the crowds in the city, but these repeated words are meant to draw a connection between the locations rather than show differences between them.\n\nG: Incorrect. Even though the lines call out specific sounds, the purpose of the repetition of the words in the two parts of the poem is to show how the speaker connects the two settings. The “rising and falling” of the sounds are one detail the speaker highlights.\n\nH: Incorrect. The repetition of the words “rising and falling” is used to compare the different locations in the speaker’s life, not to compare fireworks to the sounds of crickets in the country or to the sounds of people moving and talking in the city.",
    "points": 1,
    "prompt": "What is the purpose of the repeated words “rising and falling” in lines 26 and 37?",
    "promptHtml": "<p>What is the purpose of the repeated words “rising and falling” in lines 26 and 37?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "to create a distinction between solitude and meaningful interaction"
      },
      {
        "id": "B",
        "text": "to demonstrate a connection between the speaker’s past and present"
      },
      {
        "id": "C",
        "text": "to emphasize the speaker’s attention to the surrounding sounds"
      },
      {
        "id": "D",
        "text": "to compare the fireworks to common sights and sounds"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q23",
    "skilled": "TBD",
    "explanation": "The question asks what impact the phrase “Everything is a constant celebration” (line 33) has in the poem.\n\nC: Correct. From the speaker’s perspective, the constant light (“awash in light” [line 32]) contributes to the speaker’s feeling that, in the city, celebratory fireworks are ever-present. In comparison, fireworks lit up the country sky only for celebratory occasions or annual events (“In autumn my mother drove us to the edge of the field / where the fair was set up year after year” [lines 1–2]).\n\nA: Incorrect. The speaker describes a sense of happiness and contentment in both the city and the country and does not indicate that one setting is more pleasurable than the other.\n\nB: Incorrect. The word “celebration” has a positive association and does not imply that the speaker is overwhelmed in the city. Throughout the third stanza (lines 28–42), the speaker conveys appreciation for the elements of the city that make it different from the country (“And the music around me is the music of people, / their voices rising and falling in a hundred languages” [lines 36–37]).\n\nD: Incorrect. While the speaker observes many things going on in the city at a given moment, the “constant celebration” in line 33 is intended to convey a comparison to the speaker’s previous experience in the country rather than emphasize the hectic pace of life in the city. The continual light and sounds in the city remind the speaker of lights and sounds experienced only on occasion in the country.",
    "points": 1,
    "prompt": "What impact does the phrase “Everything is a constant celebration” (line 33) have in the poem?",
    "promptHtml": "<p>What impact does the phrase “Everything is a constant celebration” (line 33) have in the poem?</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "It reveals that the speaker finds the city more pleasurable than the country."
      },
      {
        "id": "B",
        "text": "It suggests that the persistent brightness of the city can be overwhelming to the speaker."
      },
      {
        "id": "C",
        "text": "It implies that what is normal in the city was unusual in the country."
      },
      {
        "id": "D",
        "text": "It emphasizes the hectic pace of daily life in the city."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "ode-to-fireworks-2019-2020-form-a-2019-form-a-ela-q24",
    "skilled": "TBD",
    "explanation": "The question asks how the memory in lines 41–42 affects the speaker.\n\nH: Correct. The memory of watching the fireworks on the way home creates a sense of comfort that stays with the speaker (“escorted us home”). The speaker looks forward to moments when the youthful experience (“childhood bursts”) of being excited by something like a fireworks display can be a source of happiness.\n\nE: Incorrect. The speaker does not express concern in these lines about the impossibility of returning to childhood or the past. For the speaker, the past and the memories associated with it are a source of comfort and a way to remember simpler times (“I remember the feel of the pickup truck bumping / across the ridged field” [lines 40–41]).\n\nF: Incorrect. While the speaker recalls anticipation before the start of a fireworks display, there is no hint that the speaker is impatient. Particularly in lines 41–42, the speaker is reminded of the expectation of hearing and seeing fireworks and the sense of simple contentment felt in the experience (“I find myself / craning my neck upward at odd moments” [lines 29–30]).\n\nG: Incorrect. The speaker is reflecting on past experiences and pointing out the elements of the city that remind the speaker of these past experiences. The speaker acknowledges the differences between the country and city settings but does not convey regret for leaving the rural area (“This is where we live now, / and it is how we live now, awash in light / of every hue” [lines 31–33]).",
    "points": 1,
    "prompt": "Read lines 41–42 from the poem.\n\nI kept waiting for those\nchildhood bursts, watching as they escorted us home.\n\nHow does this memory affect the speaker?",
    "promptHtml": "<p>Read lines 41–42 from the poem.</p><blockquote><strong>I kept waiting for those<br>childhood bursts, watching as they escorted us home.</strong></blockquote><p>How does this memory affect the speaker?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "The speaker believes it is impossible to ever return to a place in the past."
      },
      {
        "id": "B",
        "text": "The speaker is still amused by the impatience felt during fireworks displays."
      },
      {
        "id": "C",
        "text": "The speaker now regrets abandoning the rural way of life."
      },
      {
        "id": "D",
        "text": "The speaker feels a sense of comfort when reflecting on the past."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const odeToFireworks20192020FormAPassageSet: ExamPassageSet = {
  id: "ela-ode-to-fireworks-2019-2020-form-a",
  label: "2019–2020 Form A",
  section: "reading",
  questionCount: odeToFireworks20192020FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "ode-to-fireworks-2019-2020-form-a",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    title: "Ode to Fireworks",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<p>In autumn my mother drove us to the edge of the field</p><p>where the fair was set up year after year:</p><p>the carousel, the bumper cars, the long, low sheds</p><p>filled with prizewinning animals.</p><p>We—my sister, my cousin, and I—were ready for bed,</p><p>already in our pajamas. This was a treat we waited</p><p>all year for. We waited in the darkness</p><p>for the first low, dull <em>thwumps</em>, like someone</p><p>beating an old, filthy rug hung on a wash line.</p><p>Then we counted the seconds between the lightning</p><p>and thunder, as we also used to do, until the sky</p><p>lit up: red, blue, green, gold. In my mind’s eye</p><p>I can still see the straggly, ancient oak whose branches</p><p>reached up past the exhibition halls, silhouetted</p><p>against the spectrum of stars that cascaded behind it.</p><p></p><p>It was one thing to look up into the sky</p><p>and imagine yourself in it or to make out pictures</p><p>among the clouds, which my sister liked to do.</p><p>No, I would tell her, that cloud</p><p>does <em>not </em>look like an elephant, a hat, an umbrella.</p><p>But it was another thing to see</p><p>the sky at night written upon</p><p>with those jewels. (We lived in the country:</p><p>night was <em>night</em>.) All around us, crickets</p><p>stridulated in the stubble of what had been</p><p>somebody’s cornfield, their song rising and falling.</p><p>You could smell winter on the air’s edge.</p><p></p><p>Now, in the city, when the sky dips into shadow</p><p>at New Year’s or on the Fourth of July, I find myself</p><p>craning my neck upward at odd moments.</p><p>The city sky is always lit up. This is where we live now,</p><p>and it is how we live now, awash in light</p><p>of every hue. Everything is a constant celebration:</p><p>picking up washing at the cleaner’s or stopping by</p><p>the corner market for a loaf of heavy bread.</p><p>And the music around me is the music of people,</p><p>their voices rising and falling in a hundred languages.</p><p>But beneath the yellowish glow deep in the sky</p><p>of all our city lights pelting out into the universe,</p><p>I remember the feel of the pickup truck bumping</p><p>across the ridged field, as I kept waiting for those</p><p>childhood bursts, watching as they escorted us home.</p>",
    text: odeToFireworks20192020FormAPassageText,
    versionLabel: "2019–2020 Form A",
  }),
  questions: odeToFireworks20192020FormAQuestions,
};
