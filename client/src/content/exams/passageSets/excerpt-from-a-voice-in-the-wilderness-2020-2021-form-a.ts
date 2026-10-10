import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromAVoiceInTheWilderness20202021FormAPassageText = "With a lurch the train came to a dead stop and Margaret Earle, hastily gathering up her belongings, hurried down the aisle and got out into the night.\n\nIt occurred to her, as she swung her heavy suit-case down the rather long step to the ground, and then carefully swung herself after it, that it was strange that neither conductor, brakeman, nor porter had come to help her off the train, when all three had taken the trouble to tell her that hers was the next station; but she could hear voices up ahead. Perhaps something was the matter with the engine that detained them and they had forgotten her for the moment.\n\nThe ground was rough where she stood, and there seemed no sign of a platform. Did they not have platforms in this wild Western land, or was the train so long that her car had stopped before reaching it?\n\nShe strained her eyes into the darkness, and tried to make out things from the two or three specks of light that danced about like fireflies in the distance. She could dimly see moving figures away up near the engine, and each one evidently carried a lantern. The train was tremendously long. A sudden feeling of isolation took possession of her. Perhaps she ought not to have got out until some one came to help her. Perhaps the train had not pulled into the station yet and she ought to get back on it and wait. Yet if the train started before she found the conductor she might be carried on somewhere and he justly blame her for a fool.\n\nThere did not seem to be any building on that side of the track. It was probably on the other, but she was standing too near the cars to see over. She tried to move back to look, but the ground sloped and she slipped and fell in the cinders, bruising her knee and cutting her wrist.\n\nIn sudden panic she arose. She would get back into the train, no matter what the consequences. They had no right to put her out here, away off from the station, at night, in a strange country. If the train started before she could find the conductor she would tell him that he must back it up again and let her off. He certainly could not expect her to get out like this.\n\nShe lifted the heavy suit-case up the high step that was even farther from the ground than it had been when she came down, because her fall had loosened some of the earth and caused it to slide away from the track. Then, reaching to the rail of the step, she tried to pull herself up, but as she did so the engine gave a long snort and the whole train, as if it were in league against her, lurched forward crazily, shaking off her hold. She slipped to her knees again, the suit-case, toppled from the lower step, descending upon her, and together they slid and rolled down the short bank, while the train . . . ran giddily off into the night.\n\nThe horror of being deserted helped the girl to rise in spite of bruises and shock. She lifted imploring hands to the unresponsive cars as they hurried by her—one, two, three, with bright windows, each showing a passenger, comfortable and safe inside, unconscious of her need.\n\nA moment of useless screaming, running, trying to attract some one’s attention, a sickening sense of terror and failure, and the last car slatted itself past with a mocking clatter, as if it enjoyed her discomfort.\n\nMargaret stood dazed, reaching out helpless hands, then dropped them at her sides and gazed after the fast-retreating train, the light on its last car swinging tauntingly, blinking now and then with a leer in its eye, rapidly vanishing from her sight into the depth of the night.\n\nShe gasped and looked about her for the station that but a short moment before had been so real to her mind; and, lo! on this side and on that there was none!\n\nThe night was wide like a great floor shut in by a low, vast dome of curving blue set with the largest, most wonderful stars she had ever seen. Heavy shadows of purple-green, smoke-like, hovered over earth darker and more intense than the unfathomable blue of the night sky. It seemed like the secret nesting-place of mysteries wherein no human foot might dare intrude. It was incredible that such could be but common sage-brush, sand, and greasewood wrapped about with the beauty of the lonely night.\n\nNo building broke the inky outlines of the plain, nor friendly light streamed out to cheer her heart. Not even a tree was in sight, except on the far horizon, where a heavy line of deeper darkness might mean a forest. Nothing, absolutely nothing, in the blue, deep, starry dome above and the bluer darkness of the earth below save one sharp shaft ahead like a black mast throwing out a dark arm across the track.\n\nAs soon as she sighted it she picked up her baggage and made her painful way toward it, for her knees and wrist were bruised and her baggage was heavy.\n\nA soft drip, drip greeted her as she drew nearer; something plashing down among the cinders by the track. Then she saw the tall column with its arm outstretched, and looming darker among the sage-brush the outlines of a water-tank. It was so she recognized the engine’s drinking-tank, and knew that she had mistaken a pause to water the engine for a regular stop at a station.";

const excerptFromAVoiceInTheWilderness20202021FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-41",
    "explanation": "41. The question asks how the phrase from paragraph 2 affects the tone in the first part of the excerpt.\n\nA. Incorrect. When Margaret recalls the interaction, there is no indication that she blames the men for her current problem.\n\nB. Incorrect. While the description of how Margaret “hastily [gathers] up her belongings” and “[hurries] down the aisle” (paragraph 1) may give the appearance of being defiant, there is no evidence that she intentionally put herself in this vulnerable position just to make a point.\n\nC. CORRECT. The phrase includes the words “all three” and “taken the trouble,” emphasizing Margaret’s early frustration as she recalls with some confused irritation that the men thought she needed an abundance of help earlier, but none of them is around to help when the train stops.\n\nD. Incorrect. While the conductor, brakeman, and porter have all looked after Margaret by alerting her that her station was next, it is unclear whether Margaret appreciates this excess of attention. The phrase instead conveys Margaret’s annoyance about a situation in which assistance from the railroad employees would have been welcome but is not provided.",
    "points": 1,
    "prompt": "In paragraph 2, how does the phrase “when all three had taken the trouble to tell her” affect the tone in the first part of the excerpt?",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "text": "It creates an accusatory tone by suggesting that Margaret believes that others are responsible for her problem."
      },
      {
        "id": "B",
        "text": "It introduces a defiant tone by suggesting that Margaret left the train early to prove a point."
      },
      {
        "id": "C",
        "text": "It suggests a frustrated tone by showing that Margaret feels confused by the inconsistent help offered by the railroad employees."
      },
      {
        "id": "D",
        "text": "It establishes an appreciative tone by showing that Margaret feels cared for by the railroad employees."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-42",
    "explanation": "42. The question asks for evidence from the excerpt that best supports the idea that Margaret is unfamiliar with traveling to new places by train.\n\nE. Incorrect. Margaret’s actions in the sentence from paragraph 1 are decisive as she gathers her belongings to exit the train; she is familiar with rail travel.\n\nF. Incorrect. In the sentence from paragraph 2, Margaret is using her knowledge about trains to attempt to interpret the actions of others; she is familiar with trains, even if a particular destination has not been mentioned.\n\nG. CORRECT. If Margaret has never traveled to this region by train before, she must guess or attempt to interpret what she sees. This idea is best represented in the sentence in paragraph 3 where she questions whether the stations in the West have platforms.\n\nH. Incorrect. While the sentence from paragraph 4 shows that Margaret is trying to better understand her situation in the darkness, her ability to identify the train’s engine and the figures carrying lanterns indicates some familiarity with her mode of travel.",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that Margaret is unaccustomed to traveling to new places by train?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“With a lurch the train came to a dead stop and Margaret Earle, hastily gathering up her belongings, hurried down the aisle and got out into the night.” (paragraph 1)"
      },
      {
        "id": "B",
        "text": "“Perhaps something was the matter with the engine that detained them and they had forgotten her for the moment.” (paragraph 2)"
      },
      {
        "id": "C",
        "text": "“Did they not have platforms in this wild Western land, or was the train so long that her car had stopped before reaching it?” (paragraph 3)"
      },
      {
        "id": "D",
        "text": "“She could dimly see moving figures away up near the engine, and each one evidently carried a lantern.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-43",
    "explanation": "43. The question asks how the simile in the sentence from paragraph 4 affects the tone of the paragraph.\n\nA. Incorrect. Margaret is confused and indecisive, showing her discomfort with her situation.\n\nB. CORRECT. The image of two or three fireflies creating small specks of light in the darkness creates a sense of isolation or loneliness in Margaret, as shown in the sentence “A sudden feeling of isolation took possession of her” (paragraph 4).\n\nC. Incorrect. Margaret is not tranquil; rather, she expresses distress, questions her decisions, and worries about being labeled a “fool” (paragraph 4).\n\nD. Incorrect. Margaret experiences feelings of isolation and begins to question her decision in paragraph 4, but these feelings do not become extreme until paragraph 9, where she feels “a sickening sense of terror and failure” as the train pulls away.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nShe strained her eyes into the darkness, and tried to make out things from the two or three specks of light that danced about like fireflies in the distance.\n\nThe simile used in the sentence affects the tone of the paragraph by emphasizing a",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "feeling of comfort as Margaret connects her unfamiliar surroundings with familiar images."
      },
      {
        "id": "B",
        "text": "sense of lonesomeness as Margaret realizes that she is on her own in the wilderness."
      },
      {
        "id": "C",
        "text": "sense of tranquility as Margaret is distracted from the urgency of her situation by the beauty of the night."
      },
      {
        "id": "D",
        "text": "feeling of dread as Margaret regards the desolation of the land that surrounds her."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-44",
    "explanation": "44. The question asks how Margaret’s earlier interactions with the conductor, brakeman, and porter affect the plot.\n\nE. CORRECT. Because the conductor, brakeman, and porter have all “taken the trouble to tell her that hers was the next station” (paragraph 2), Margaret assumes that the next time the train stops, she will have reached her station. This assumption causes Margaret to get off the train at the next stop without waiting for help or confirmation, but the stop turns out to be just “a pause to water the engine” (paragraph 15). This mistaken assumption creates the main problem that Margaret confronts in the passage.\n\nF. Incorrect. Although Margaret’s earlier interactions with the three railroad employees cause her to think that she knows when to get off the train, it is clear from paragraph 4 that Margaret is deeply confused and does not know what to do once she has exited the train car. She muses uneasily, “Perhaps she ought not to have got out until some one came to help her. Perhaps the train had not pulled into the station yet and she ought to get back on it and wait” (paragraph 4).\n\nG. Incorrect. Margaret wonders in paragraph 3 whether the train is “so long that her car had stopped before reaching [the station]” and speculates in paragraph 4 that “the train had not pulled into the station yet.” These thoughts reflect her assumption (based on her interactions with the three railroad employees) that the next stop is her station. However, Margaret’s speculation that the train has not fully pulled into the station does not significantly affect the plot.\n\nH. Incorrect. Margaret wonders in paragraph 3 whether they “have platforms in this wild Western land” and is expecting to see a platform because her interactions with the three railroad employees have led her to believe that she has reached a station. However, it is unclear whether Margaret really believes that rural stations all lack platforms, and her speculation on this point is not further developed in the passage and does not affect the plot.",
    "points": 1,
    "prompt": "How do Margaret’s earlier interactions with the conductor, brakeman, and porter affect the plot?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They prompt Margaret to get off the train without further assistance."
      },
      {
        "id": "B",
        "text": "They cause Margaret to think that she knows what to do once she gets off the train."
      },
      {
        "id": "C",
        "text": "They compel Margaret to wonder whether the train has not pulled all the way into the station."
      },
      {
        "id": "D",
        "text": "They lead Margaret to believe that train stations in rural areas lack platforms."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-45",
    "explanation": "45. The question asks for an explanation of what the imagery in the sentence from paragraph 9 conveys.\n\nA. Incorrect. Margaret’s “sickening sense of terror” indicates that she is extremely afraid of being left behind rather than increasingly irritated with the other passengers.\n\nB. Incorrect. Although Margaret is “screaming, running, trying to attract some one’s attention” in an effort to be noticed so that the train will stop, she is not attempting to keep up with the train. This option omits consideration of the “mocking clatter” of the train, which emphasizes Margaret’s helplessness rather than her physical efforts.\n\nC. Incorrect. While Margret’s screaming and running could easily suggest feelings of anger, the description of her “sickening sense of terror and failure” indicates otherwise.\n\nD. CORRECT. The words “useless” and “failure” in the sentence indicate that Margaret’s best efforts do not help her. The phrase “the last car slatted itself past” shows that Margaret is helpless to stop the train from departing, which leaves her completely vulnerable.",
    "points": 1,
    "prompt": "Read paragraph 9 from the excerpt.\n\nA moment of useless screaming, running, trying to attract some one’s attention, a sickening sense of terror and failure, and the last car slatted itself past with a mocking clatter, as if it enjoyed her discomfort.\n\nThe imagery in this sentence conveys the",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "growing irritation Margaret feels as she is ignored by people on the train."
      },
      {
        "id": "B",
        "text": "effort Margaret is making despite being physically unable to keep up with the train."
      },
      {
        "id": "C",
        "text": "anger that Margaret is experiencing as she watches the train leave without her."
      },
      {
        "id": "D",
        "text": "vulnerability Margaret feels as the train leaves her behind."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-46",
    "explanation": "46. The question asks about the relationship between the theme and paragraph 9, where Margaret desperately tries to get someone on the train to notice her.\n\nE. CORRECT. One important theme of this excerpt concerns Margaret’s willingness to take action to ensure that she reaches her destination. This determination, described in Option A, is why she gathers her belongings together without help, gets off the train without being assisted by employees, and then attempts to climb back on while the train employees are busy examining the engine.\n\nF. Incorrect. While the narrator describes her screaming as useless, she does not feel that her efforts overall are useless, and she does not give up until paragraph 10.\n\nG. Incorrect. While Margaret is feeling a sense of “failure” in paragraph 9, she does not condemn herself as the train moves away.\n\nH. Incorrect. Margaret expresses “terror” in paragraph 9 over being unable to catch someone’s attention, not frustration about her lack of control over her surroundings.",
    "points": 1,
    "prompt": "How does Margaret’s experience in paragraph 9 emphasize a theme of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "It confirms Margaret’s understanding that she cannot rely on help from anyone else."
      },
      {
        "id": "B",
        "text": "It leads Margaret to realize that her desire to change her situation is impractical."
      },
      {
        "id": "C",
        "text": "It causes Margaret to believe that her own actions led to an unfavorable outcome."
      },
      {
        "id": "D",
        "text": "It reinforces Margaret’s frustration about her lack of control over her surroundings."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-47",
    "explanation": "47. The question asks what the figurative language emphasizes in the sentence from paragraph 10.\n\nA. Incorrect. While the image of Margaret’s hands dropping at her sides could suggest a sense of doubt, the figurative language in the sentence emphasizes a different feeling about her situation and does not indicate her intentions.\n\nB. Incorrect. While the figurative language suggests that the train is mocking Margaret, this language is not referring to the people onboard, who are described in paragraph 8 as “comfortable and safe inside, unconscious of her need.”\n\nC. Incorrect. While Margaret is worried in paragraph 4 about embarrassing herself, she now feels “dazed” because she is overwhelmed with the seriousness of what has just happened.\n\nD. CORRECT. As Margaret stands and reaches out “helpless hands,” the language used to describe the train as “swinging tauntingly” and having “a leer in its eye” underscores Margaret’s fears of being left alone and being vulnerable; there is nothing she can do to change the situation at this point.",
    "points": 1,
    "prompt": "Read paragraph 10 from the excerpt.\n\nMargaret stood dazed, reaching out helpless hands, then dropped them at her sides and gazed after the fast-retreating train, the light on its last car swinging tauntingly, blinking now and then with a leer in its eye, rapidly vanishing from her sight into the depth of the night.\n\nWhat does the figurative language in this sentence emphasize?",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "the sense of doubt that Margaret experiences when she is deciding what to do next"
      },
      {
        "id": "B",
        "text": "the anger that Margaret feels toward the people on the train who she expected to help her"
      },
      {
        "id": "C",
        "text": "the embarrassment that Margaret feels when she imagines what others will think of her"
      },
      {
        "id": "D",
        "text": "the hopelessness that Margaret feels when she accepts that the train is continuing on"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a-voice-in-the-wilderness-48",
    "explanation": "48. The question asks how paragraph 11 contributes to the plot of the excerpt.\n\nE. CORRECT. In paragraph 5, Margaret assumes there is a station (“It was probably on the other [side], but she was standing too near the cars to see”), but in paragraph 11, the station that had been “so real” in Margaret’s mind actually does not exist.\n\nF. Incorrect. Margaret’s main problem is not that her imagination has led her astray but rather that her inexperience with this train route has caused her to misinterpret the events that have occurred. Paragraph 11 reveals that she has been acting on faulty assumptions; however, her assumptions are somewhat justified by the events that have occurred.\n\nG. Incorrect. While Margaret seems somewhat in awe of her surroundings in paragraph 12 and she “gasped” in paragraph 11, her exclamation is one of shock at the discovery, not surprise over an unexpected adventure.\n\nH. Incorrect. While paragraph 11 describes how Margaret responds to the distressing situation that her actions and decisions have created, the paragraph does not offer insight into how Margaret generally responds to problems or conflicts.",
    "points": 1,
    "prompt": "How does paragraph 11 contribute to the plot of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It reveals that the reality of the situation is different from Margaret’s assumptions."
      },
      {
        "id": "B",
        "text": "It illustrates that Margaret’s main problem is her own imagination."
      },
      {
        "id": "C",
        "text": "It shows that Margaret is surprised by the unexpected adventure she is about to undertake."
      },
      {
        "id": "D",
        "text": "It provides insight into how Margaret reacts to stressful situations."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const excerptFromAVoiceInTheWilderness20202021FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a",
  label: "Reading Comprehension",
  section: "reading",
  questionCount: excerptFromAVoiceInTheWilderness20202021FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-a-voice-in-the-wilderness-2020-2021-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from A Voice in the Wilderness",
    author: "Grace Livingston Hill",
    byline: "by Grace Livingston Hill",
    passageType: "literary",
    passageCategory: "official_handbook",
    richText: "<p>With a lurch the train came to a dead stop and Margaret Earle, hastily gathering up her belongings, hurried down the aisle and got out into the night.</p><p>It occurred to her, as she swung her heavy suit-case down the rather long step to the ground, and then carefully swung herself after it, that it was strange that neither conductor, brakeman, nor porter had come to help her off the train, when all three had taken the trouble to tell her that hers was the next station; but she could hear voices up ahead. Perhaps something was the matter with the engine that detained them and they had forgotten her for the moment.</p><p>The ground was rough where she stood, and there seemed no sign of a platform. Did they not have platforms in this wild Western land, or was the train so long that her car had stopped before reaching it?</p><p>She strained her eyes into the darkness, and tried to make out things from the two or three specks of light that danced about like fireflies in the distance. She could dimly see moving figures away up near the engine, and each one evidently carried a lantern. The train was tremendously long. A sudden feeling of isolation took possession of her. Perhaps she ought not to have got out until some one came to help her. Perhaps the train had not pulled into the station yet and she ought to get back on it and wait. Yet if the train started before she found the conductor she might be carried on somewhere and he justly blame her for a fool.</p><p>There did not seem to be any building on that side of the track. It was probably on the other, but she was standing too near the cars to see over. She tried to move back to look, but the ground sloped and she slipped and fell in the <span data-glossary-definition=\"track bed made from the residue of burnt coal\" role=\"link\" tabindex=\"0\">cinders</span>, bruising her knee and cutting her wrist.</p><p>In sudden panic she arose. She would get back into the train, no matter what the consequences. They had no right to put her out here, away off from the station, at night, in a strange country. If the train started before she could find the conductor she would tell him that he must back it up again and let her off. He certainly could not expect her to get out like this.</p><p>She lifted the heavy suit-case up the high step that was even farther from the ground than it had been when she came down, because her fall had loosened some of the earth and caused it to slide away from the track. Then, reaching to the rail of the step, she tried to pull herself up, but as she did so the engine gave a long snort and the whole train, as if it were in league against her, lurched forward crazily, shaking off her hold. She slipped to her knees again, the suit-case, toppled from the lower step, descending upon her, and together they slid and rolled down the short bank, while the train . . . ran giddily off into the night.</p><p>The horror of being deserted helped the girl to rise in spite of bruises and shock. She lifted imploring hands to the unresponsive cars as they hurried by her—one, two, three, with bright windows, each showing a passenger, comfortable and safe inside, unconscious of her need.</p><p>A moment of useless screaming, running, trying to attract some one’s attention, a sickening sense of terror and failure, and the last car slatted itself past with a mocking clatter, as if it enjoyed her discomfort.</p><p>Margaret stood dazed, reaching out helpless hands, then dropped them at her sides and gazed after the fast-retreating train, the light on its last car swinging tauntingly, blinking now and then with a leer in its eye, rapidly vanishing from her sight into the depth of the night.</p><p>She gasped and looked about her for the station that but a short moment before had been so real to her mind; and, lo! on this side and on that there was none!</p><p>The night was wide like a great floor shut in by a low, vast dome of curving blue set with the largest, most wonderful stars she had ever seen. Heavy shadows of purple-green, smoke-like, hovered over earth darker and more intense than the unfathomable blue of the night sky. It seemed like the secret nesting-place of mysteries wherein no human foot might dare intrude. It was incredible that such could be but common sage-brush, sand, and greasewood wrapped about with the beauty of the lonely night.</p><p>No building broke the inky outlines of the plain, nor friendly light streamed out to cheer her heart. Not even a tree was in sight, except on the far horizon, where a heavy line of deeper darkness might mean a forest. Nothing, absolutely nothing, in the blue, deep, starry dome above and the bluer darkness of the earth below save one sharp shaft ahead like a black mast throwing out a dark arm across the track.</p><p>As soon as she sighted it she picked up her baggage and made her painful way toward it, for her knees and wrist were bruised and her baggage was heavy.</p><p>A soft drip, drip greeted her as she drew nearer; something plashing down among the cinders by the track. Then she saw the tall column with its arm outstretched, and looming darker among the sage-brush the outlines of a water-tank. It was so she recognized the engine’s drinking-tank, and knew that she had mistaken a pause to water the engine for a regular stop at a station.</p>",
    sourceNote: "From A VOICE IN THE WILDERNESS by Grace Livingston Hill—Public Domain",
    text: excerptFromAVoiceInTheWilderness20202021FormAPassageText,
    versionLabel: "2020–2021 Form A",
  }),
  questions: excerptFromAVoiceInTheWilderness20202021FormAQuestions,
};
