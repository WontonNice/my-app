import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const atDusk2024FormAPassageText = "At first I think she is calling a child,\nmy neighbor, leaning through her doorway\nat dusk, street lamps just starting to hum\nthe backdrop of evening. Then I hear\nthe high-pitched wheedling¹ we send out\nto animals who know only sound, not\nthe meanings of our words—here here—\nnor how they sometimes fall short.\nIn another yard, beyond my neighbor’s\nsight, the cat lifts her ears, turns first\ntoward the voice, then back\nto the constellation of fireflies flickering\nnear her head. It’s as if she can’t decide\nwhether to leap over the low hedge,\nthe neat row of flowers, and bound\nonto the porch, into the steady circle\nof light, or stay where she is: luminous\npossibility—all that would keep her\naway from home—flitting before her.\nI listen as my neighbor’s voice trails off.\nShe’s given up calling for now, left me\nto imagine her inside the house waiting,\nperhaps in a chair in front of the TV,\nor walking around, doing small tasks;\nleft me to wonder that I too might lift\nmy voice, sure of someone out there,\nsend it over the lines stitching here\nto there, certain the sounds I make\nare enough to call someone home.";

const atDusk2024FormAQuestions: ExamQuestion[] = [
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q19",
    "explanation": "19.   The question asks for the best textual support for the idea that the neighbor’s actions in calling the cat directly affect the speaker of the poem.\n\nA: Incorrect. Lines 1–2 show that the speaker has noticed the neighbor’s calling and guessed the reason for it. The speaker at first believes that the neighbor is “calling a child,” but then the speaker notices a sound associated with the time of day—the “street lamps just starting to hum / the backdrop of evening” (lines 3–4). However, the poem does not describe any direct effects on the speaker’s own opinions or behavior caused by these aspects of the surroundings.\n\nB: Incorrect. The “high-pitched wheedling” sound the speaker mentions in line 5 might be assumed to have an annoying effect. However, the poem includes no indication that the sound has any direct effect on the speaker or that the speaker has any personal reaction to the sound. Instead, in lines 6–7, the speaker concentrates on explaining the reason people make the sound: to communicate with “animals who know only sound, not / the meanings of our words.”\n\nC: Incorrect. In lines 20–21, the speaker actively listens “as my neighbor’s voice trails off,” which could be interpreted as an effect of the neighbor’s call. However, the speaker’s listening soon comes to an end because the neighbor has “given up calling for now,” and the poem does not describe any direct effects on the speaker’s own opinions or behavior caused by listening. Therefore, lines 20–21 do not best support the idea that the neighbor’s actions directly affect the speaker of the poem.\n\nD: Correct. In lines 25–26, after observing the neighbor calling the cat, the speaker begins to reflect on the speaker’s own behavior and motivations, wondering if, like the neighbor, the speaker “might lift” the speaker’s voice to call someone who is surely “out there.” The speaker’s description of being left “to wonder” indicates that the speaker’s thoughts are a direct effect of observing the neighbor’s efforts to call the cat.",
    "points": 1,
    "prompt": "Which lines from the poem best support the idea that the neighbor’s efforts to call the cat home directly affect the speaker?",
    "promptHtml": "<p>Which lines from the poem <strong>best</strong> support the idea that the neighbor’s efforts to call the cat home directly affect the speaker?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“At first I think she is calling a child, / my neighbor” (lines 1–2)"
      },
      {
        "id": "B",
        "text": "“the high-pitched wheedling we send out / to animals who know only sound” (lines 5–6)"
      },
      {
        "id": "C",
        "text": "“I listen as my neighbor’s voice trails off. / She’s given up calling for now” (lines 20–21)"
      },
      {
        "id": "D",
        "text": "“left me to wonder that I too might lift / my voice, sure of someone out there” (lines 25–26)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q20",
    "explanation": "20.   The question asks how the isolation of the words “—here here—” in line 7 mainly contributes to the meaning of the poem.\n\nE: Incorrect. The words “—here here—” do interrupt the speaker’s observation in lines 7–8 that “our words... /... sometimes fall short.” However, in lines 5–7, the speaker observes that the neighbor accompanies her words with a “high-pitched wheedling” that people “send out” because they are aware that animals “know only sound, not / the meanings of our words,” indicating that the neighbor does not actually expect her words to be understood. The description of the cat’s response in lines 10–11 (“the cat lifts her ears, turns first / toward the voice, then back”) does not suggest that the neighbor’s message is misunderstood but rather suggests that the cat prefers not to respond to it.\n\nF: Incorrect. In lines 20–21, the “neighbor’s voice trails off,” and she does give up calling the cat. However, rather than any desperation to connect, the neighbor’s use of a “high-pitched wheedling” (line 5) simply indicates her understanding that the cat, like other animals, understands “only sound, not / the meanings of our words” (lines 6–7) such as “here here.” Furthermore, the neighbor does not give up quickly. In lines 21–22, the speaker says the neighbor has “given up calling for now” but is still “waiting” for the cat.\n\nG: Incorrect. In lines 4–7, the speaker describes the neighbor calling to the cat with a “high-pitched wheedling.” The sound may indicate a bond between the neighbor and the cat because the neighbor does understand that animals “know only sound, not / the meanings of our words” (lines 6–7). However, the use of the words “here here” in line 7 do not indicate that bond, because they are used as an example of the type of words that animals do not understand.\n\nH: Correct. The speaker’s initial thought in line 1 that the neighbor is calling a child, rather than a cat, suggests that the neighbor loves and misses the cat. Lines 4–7 then present the speaker’s observation that the neighbor uses a “high-pitched wheedling,” to emphasize the simple words of her call, “—here here—.” The idea that the words are an example of a simple expression used to call home a missed loved one is reinforced in lines 25–29, when the speaker is “left... to wonder” whether the speaker, too, “might lift / [his or her] voice” and be able “to call someone home.”",
    "points": 1,
    "prompt": "The isolation of the words “—here here—” in line 7 contributes to the meaning of the poem mainly by",
    "promptHtml": "<p>The isolation of the words “—here here—” in line 7 contributes to the meaning of the poem <strong>mainly</strong> by</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "demonstrating how people try to communicate in familiar ways but are still sometimes misunderstood."
      },
      {
        "id": "B",
        "text": "showing how people can feel desperate to connect with others but give up quickly when their first attempts are ignored."
      },
      {
        "id": "C",
        "text": "using the unspoken bond between the neighbor and her cat to highlight the understanding people have with their pets."
      },
      {
        "id": "D",
        "text": "illustrating the use of a simple expression to call home those who are loved and missed."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q21",
    "explanation": "21.   The question asks how the details in lines 10–17 convey a central idea of the poem.\n\nA: Incorrect. In lines 10–17, the speaker says that the cat’s actions—she “turns first / toward the voice, then back”—makes the cat seem “as if she can’t decide” whether to return home or to explore “the constellation of fireflies flickering / near her head.” However, while the cat is indecisive, it is not the experience of independence that causes this conflict for the cat but rather the “luminous / possibility... flitting before her” (lines 17–19).\n\nB: Incorrect. The neighbor’s calling of the cat indicates that she does allow it to roam outside regularly. However, the details in these lines focus not on whether allowing the cat to roam is an expression of caring but on the cat’s reaction to the neighbor’s calls, “as if she can’t decide” (line 13) whether to return home “into the steady circle / of light” (lines 16–17) or stay and enjoy the “luminous / possibility” (lines 17–18) that the night offers. Furthermore, the neighbor’s “wheedling” (line 5) and the timing of her call, “at dusk” (line 3), introduce the possibility that encouraging others to come home expresses more caring than allowing them to roam freely.\n\nC: Incorrect. Lines 10–17 describe the reactions of the cat, who is exploring the natural world, including a “constellation of fireflies flickering / near her head,” when the neighbor calls to her. The poet describes the cat’s conflict by saying that “It’s as if she can’t decide” whether to stay outdoors or return “into the steady circle / of light” at home with the neighbor. However, the cat’s indecision demonstrates that, rather than being a disappointment, the natural world is as appealing as home.\n\nD: Correct. Lines 10–11 describe how the cat “turns first / toward the voice, then back,” indicating that the cat is experiencing a conflict. To the speaker, the cat seems “as if she can’t decide” (line 13) between exploring “the constellation of fireflies” (line 12) outdoors and returning to the familiar “steady circle / of light” (lines 16–17) indoors. This central idea that someone might experience a conflict between exploring and returning to the familiar is suggested again in lines 28–29 when the speaker wonders whether “the sounds I make / are enough to call someone home.”",
    "points": 1,
    "prompt": "The details in lines 10–17 about the cat convey a central idea of the poem by",
    "promptHtml": "<p>The details in lines 10–17 about the cat convey a central idea of the poem by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "showing that returning home after experiencing independence is challenging."
      },
      {
        "id": "B",
        "text": "suggesting that caring for others means allowing them to grow and to roam freely."
      },
      {
        "id": "C",
        "text": "implying that expecting to feel at home in the natural world leads to disappointment."
      },
      {
        "id": "D",
        "text": "emphasizing the conflicting desires to return to the familiar and to explore the unknown."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q22",
    "explanation": "22.   The question asks how the phrases “luminous possibility” and “all that would keep her / away from home” (lines 17–19) affect the poem.\n\nE: Incorrect. In lines 20–21, the neighbor’s voice “trails off,” and the speaker states that “she’s given up calling for now,” which could be interpreted as a lack of concern. However, these lines describe the neighbor rather than the cat. The phrases from lines 17–19 are used to explain that what keeps the cat from returning home is the allure of “luminous possibility.” The use of the phrase “all that would keep her” suggests that the cat would likely return home to the security of “the steady circle / of light” (lines 16–17) if not for the possibilities offered by the night, implying that the cat usually prefers to be at home with the neighbor. The phrases do not highlight a lack of concern for the neighbor on the part of the cat.\n\nF: Incorrect. While the phrase “luminous possibility” does convey a high degree of interest, it is used to describe why being outside at night appeals to the cat. It does not describe the speaker’s interest in the cat. The speaker observes the cat as it tries to decide between returning home and staying out and then concludes that it is only “luminous / possibility... that would keep [the cat] / away from home.”\n\nG: Correct. The phrases are used to explain that the cat, though tempted to return home, is also tempted or compelled by “luminous possibility” to remain outdoors. The phrases convey a sense of wonder about what the night may offer, and it is the powerful effect of this sense of wonder (“all that would keep her / away from home”) that ultimately tempts the cat to remain outdoors rather than return to the comforts of home.\n\nH: Incorrect. Lines 17–19 present the speaker’s observations about the cat as it tries to decide whether to stay where it is or return home. The speaker explains that it is only “luminous possibility” that can convince the cat to stay rather than return to the comforts of home. While the speaker then imagines the neighbor indoors, there is no indication that the speaker supports the cat’s decision. The speaker merely notes that the neighbor stops calling to the cat “for now” (line 21), and then the speaker reflects on the possible results of calling someone home.",
    "points": 1,
    "prompt": "The phrases “luminous possibility” and “all that would keep her / away from home” (lines 17–19) affect the poem by",
    "promptHtml": "<p>The phrases “luminous possibility” and “all that would keep her / away from home” (lines 17–19) affect the poem by</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "highlighting the cat’s lack of concern for the neighbor."
      },
      {
        "id": "B",
        "text": "implying that the speaker finds the cat’s current situation interesting."
      },
      {
        "id": "C",
        "text": "suggesting that the cat is compelled by its sense of wonder to remain outdoors."
      },
      {
        "id": "D",
        "text": "indicating that the speaker supports the cat’s decision to ignore the neighbor."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q23",
    "explanation": "23.   The question asks which idea the imagery in lines 11–13 helps convey.\n\nA: Incorrect. Line 13 includes the speaker’s observation that the cat seems “as if she can’t decide” whether to stay outside or go to the neighbor. However, the imagery of the “constellation of fireflies flickering” in line 12 suggests that the cat does have a preference for exploring the more exciting “luminous / possibility” (lines 17–18) of the outdoors.\n\nB: Incorrect. The imagery in lines 10–11 of the cat turning “first / toward the voice, then back” might seem to suggest that the cat is eagerly watching both the neighbor and the fireflies to see what will happen next. However, line 13, in which the cat seems “as if she can’t decide,” indicates that what will happen next is actually under the cat’s control.\n\nC: Incorrect. The imagery in lines 12–13 of the “fireflies flickering / near her head” does indicate the fireflies’ unpredictable behavior. However, the imagery in lines 10–11 of the cat turning “first / toward the voice, then back” establishes that the cat’s attention is split between the fireflies and the “high-pitched wheedling” (line 5) of the neighbor’s voice, rather than being fully captured by wanting to understand the fireflies.\n\nD: Correct. The imagery in line 12 of “the constellation of fireflies flickering” suggests that the outdoors holds fascinating attractions, an idea supported by the description in lines 17–18 of the cat’s current location outdoors as one filled with “luminous / possibility.” The imagery in lines 10–11 of the cat turning “first / toward the voice, then back” indicates that the cat has considered but rejected the option of returning indoors, and the description in lines 16–17 of the indoors as offering only a “steady circle / of light” suggests that the indoors seems unremarkable to the cat in comparison to the outdoors.",
    "points": 1,
    "prompt": "Read lines 11–13 from the poem.\n\ntoward the voice, then back\n\nto the constellation of fireflies flickering\n\nnear her head\n\nWhich idea from the poem does the imagery in these lines help convey?",
    "promptHtml": "<p>Read lines 11–13 from the poem.</p><blockquote><p><strong>toward the voice, then back</strong></p><p><strong>to the constellation of fireflies flickering</strong></p><p><strong>near her head</strong></p></blockquote><p>Which idea from the poem does the imagery in these lines help convey?</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "The cat lacks a preference for going in or staying out."
      },
      {
        "id": "B",
        "text": "The cat is eager to see what will happen next."
      },
      {
        "id": "C",
        "text": "The cat wants to understand the unpredictable behavior of the fireflies."
      },
      {
        "id": "D",
        "text": "The cat is fascinated by the natural world and finds the indoors unremarkable."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q24",
    "explanation": "24.   The question asks how the setting affects the events discussed in the poem.\n\nE: Incorrect. In line 2, the speaker refers to the woman calling for her cat as “my neighbor,” which clearly suggests that the speaker lives next door to the woman. However, although the two live next door to each other, line 1 suggests that perhaps the speaker does not regularly overhear the neighbor because the speaker initially thinks that the neighbor is “calling a child” and only later realizes the neighbor is calling to a cat. Although the setting places the speaker and the neighbor in close proximity, the poem does not indicate the frequency or regularity with which the speaker overhears the neighbor.\n\nF: Correct. In the first four lines, the speaker observes the actions of the neighbor as the neighbor leans out to call for the cat at dusk. Despite the speaker’s observation of the neighbor, there is no indication that the neighbor notices the speaker. The reader can conclude that because of the time of day and the speaker being in the house next door, the speaker can observe the neighbor without being observed by her or having to interact with her.\n\nG: Incorrect. The setting of the poem is a neighborhood at nightfall, as indicated by “at dusk” in line 3, the reference to “another yard” in line 9, and the flickering fireflies in line 12. However, while the speaker is close enough to the neighbor to overhear her calling to the cat, there is no indication that the speaker feels connected to the neighbor. Instead, the speaker expresses curiosity about the neighbor after the neighbor goes inside, and the speaker is “left... / to imagine her inside the house waiting” (lines 21–22). The fact the speaker initially thought that the neighbor was calling a child indicates that the speaker is not familiar with the neighbor and her habits, and there is no indication that the speaker feels connected to the neighbor.\n\nH: Incorrect. In lines 22–24, the speaker imagines what the neighbor may be doing while the neighbor is waiting inside for the cat to return, but the speaker is imagining the neighbor’s solitary experience after the neighbor has momentarily “given up” on calling to the cat (line 21). The speaker does not imagine personally interacting with the neighbor but rather briefly imagines what the neighbor is doing at home while the cat is away.",
    "points": 1,
    "prompt": "How does the setting affect the events of the poem?",
    "promptHtml": "<p>How does the setting affect the events of the poem?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It enables the speaker to regularly overhear the neighbor calling for her cat at dusk."
      },
      {
        "id": "B",
        "text": "It allows the speaker to observe the neighbor quietly without interacting with her."
      },
      {
        "id": "C",
        "text": "It shows how living in close proximity helps the speaker feel connected to the neighbor."
      },
      {
        "id": "D",
        "text": "It shows how feeling isolated causes the speaker to imagine interactions with the neighbor."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "at-dusk-2024-form-a-2024-form-a-ela-q25",
    "explanation": "25.   The question asks for an explanation of how the poet develops a theme about making connections with others.\n\nA: Correct. The speaker first describes the neighbor calling the cat in a “high-pitched wheedling” (line 5) voice before giving up and returning indoors. The neighbor’s desire to have the cat return home prompts the speaker to wonder whether the speaker could call out and be “certain the sounds... / are enough to call someone home” (lines 28–29). These final lines most develop the theme of connection by conveying a desire to be able to prompt someone’s return.\n\nB: Incorrect. Line 1, in which the speaker at first thinks the sound in the neighborhood is the neighbor “calling a child,” might be assumed to introduce a theme of making connections with others. However, other descriptions of the sights and sounds of the neighborhood, including the time of day—“at dusk, street lamps just starting to hum / the backdrop of evening” (lines 3–4) and “constellation of fireflies flickering” (line 12) near the cat—have no relationship to a theme of connection.\n\nC: Incorrect. In lines 22–24, the speaker imagines the neighbor’s activities inside her house: “perhaps in a chair in front of the TV, / or walking around, doing small tasks.” Although the speaker does imagine the neighbor is doing these things to pass time while “waiting” (line 22) for the cat, the neighbor’s actions—and even the speaker’s imagining—are carried out alone, so they do not develop a theme of connection.\n\nD: Incorrect. Lines 10–19 present the speaker’s observations of the cat, which “turns first / toward the voice, then back” when the neighbor calls, then appears “as if she can’t decide” whether to return to the neighbor or stay outside. Although the cat’s indecision about whether to heed the neighbor’s call might seem to develop a theme about making connections, lines 10–19 focus more on the relative appeal of the cat’s two options—returning to “the steady circle / of light” at home or pursuing the “luminous / possibility... flitting before her”—than on any connection between the cat and its owner or between the speaker and the neighbor.",
    "points": 1,
    "prompt": "The poet develops a theme about making connections with others mainly through the",
    "promptHtml": "<p>The poet develops a theme about making connections with others <strong>mainly</strong> through the</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "exploration of the desires of the speaker and the neighbor."
      },
      {
        "id": "B",
        "text": "speaker’s observations of the sights and sounds in the neighborhood."
      },
      {
        "id": "C",
        "text": "speculations the speaker makes about what the neighbor does inside her house."
      },
      {
        "id": "D",
        "text": "speaker’s explanation of the cat’s thoughts and actions."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const atDusk2024FormAPassageSet: ExamPassageSet = {
  id: "ela-at-dusk-2024-form-a",
  versionLabels: ["2024-2025 Form A"],
  section: "reading",
  questionCount: atDusk2024FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "at-dusk-2024-form-a",
    preserveSourceLayout: true,
    format: "poem",
    images: [],
    title: "At Dusk",
    author: "Natasha Trethewey",
    byline: "by Natasha Trethewey",
    passageType: "poem",
    passageCategory: "official_handbook",
    richText: "<div>At first I think she is calling a child,</div><div>my neighbor, leaning through her doorway</div><div>at dusk, street lamps just starting to hum</div><div>the backdrop of evening. Then I hear</div><div>the high-pitched <span data-glossary-definition=\"speaking in a flattering manner\" role=\"link\" tabindex=\"0\">wheedling</span><sup>1</sup> we send out</div><div>to animals who know only sound, not</div><div>the meanings of our words—<em>here here</em>—</div><div>nor how they sometimes fall short.</div><div>In another yard, beyond my neighbor’s</div><div>sight, the cat lifts her ears, turns first</div><div>toward the voice, then back</div><div>to the constellation of fireflies flickering</div><div>near her head. It’s as if she can’t decide</div><div>whether to leap over the low hedge,</div><div>the neat row of flowers, and bound</div><div>onto the porch, into the steady circle</div><div>of light, or stay where she is: luminous</div><div>possibility—all that would keep her</div><div>away from home—flitting before her.</div><div>I listen as my neighbor’s voice trails off.</div><div>She’s given up calling for now, left me</div><div>to imagine her inside the house waiting,</div><div>perhaps in a chair in front of the TV,</div><div>or walking around, doing small tasks;</div><div>left me to wonder that I too might lift</div><div>my voice, sure of someone out there,</div><div>send it over the lines stitching here</div><div>to there, certain the sounds I make</div><div>are enough to call someone home.</div>",
    sourceNote: "“At Dusk” from NATIVE GUARD by Natasha Trethewey, published by Houghton Mifflin Company. Copyright © 2006 by Natasha Trethewey. All rights reserved.",
    text: atDusk2024FormAPassageText,
    versionLabel: "2024-2025 Form A",
  }),
  questions: atDusk2024FormAQuestions,
};
