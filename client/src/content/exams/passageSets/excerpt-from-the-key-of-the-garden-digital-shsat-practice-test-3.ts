import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageText = "Two days after this, when Mary opened her eyes she sat upright in bed immediately and called to Martha. \"Look at the moor! Look at the moor!\" The rain-storm had ended, and the gray mist and clouds had been swept away in the night by the wind. A brilliant, deep blue sky arched high over the moorland. Never had Mary dreamed of a sky so blue. In India the skies were hot and blazing; this was a deep, cool blue that almost seemed to sparkle like the waters of some lovely, bottomless lake, and here and there, high in the arched blueness, floated small clouds of snow-white fleece.\n\n\"Aye,\" said Martha with a cheerful grin. \"Th' storm's over for a bit. It goes off in a night like it was pretendin' it had never been here an' never meant to come again. That's because th' springtime's on its way.\" Mary had begun, without quite knowing it, to look forward to Martha's morning talk. Everything Martha told her about the moor and the cottage and her mother and the twelve brothers and sisters who had to be fed on fourteen shillings a week had a rough charm that was new to her. She had never before been interested in any person not her own, because no one had ever made her feel that she ought to be.\n\n\"Could I ever get there?\" Mary asked, looking through her window at the far-off blue. It was so new and big and wonderful, and such a heavenly color.\n\n\"I don't know,\" Martha answered. \"Tha's never used tha' legs since tha' was born, it seems to me. Tha' couldn't walk five mile.\" She went away in high spirits soon after, for it was her day out, and she meant to walk the five miles home across the moor to help her mother with the week's washing.\n\nMary felt lonelier than ever when she knew Martha was gone. She went out into the garden as quickly as possible and ran round and round the fountain flower garden ten times, counting carefully, and when she had finished she felt in better spirits. She went into the first kitchen-garden and found Ben Weatherstaff working there with two other gardeners. The change in the weather seemed to have done him good, and he spoke to her of his own accord.\n\n\"Springtime's comin',\" he said. \"Cannot tha' smell it?\" Mary sniffed and thought she could. \"That's th' good rich earth,\" he answered, digging away. \"It's in a good humor makin' ready to grow things. You'll see bits o' green spikes stickin' out o' th' black earth after a bit.\" \"What will they be?\" asked Mary. \"Crocuses an' snowdrops an' daffydowndillys. Has tha' never seen them?\" \"No. Everything is hot and wet and green after the rains in India,\" said Mary, \"and I think things grow up in a night.\" \"These won't grow up in a night,\" said Weatherstaff, surly again now that the talk had turned from earth to India. \"Tha'll have to wait for 'em.\"\n\nVery soon she heard the soft rustling flight of wings again, and she knew the robin had come. He hopped about close to her feet and put his head on one side and looked at her so slyly that she asked Ben Weatherstaff a question. \"Do you think he remembers me?\" \"Remembers thee!\" said Weatherstaff, almost offended at the suggestion. \"He knows every cabbage stump in th' gardens, let alone th' people.\" \"Are things stirring down below in the dark in that garden where he lives?\" Mary inquired. \"What garden?\" grunted Weatherstaff, turning surly again. \"The one where the old rose-trees are,\" she said, unable to keep from asking, because she wanted so much to know. \"Are all the flowers dead, or do some of them come again in the summer?\" \"Ask him,\" said Ben Weatherstaff, hunching his shoulders toward the robin. \"He's the only one as knows. No one else has seen inside it for ten year'.\"\n\nTen years was a long time, Mary thought. She had been born ten years ago. She walked away, slowly thinking. She had begun to like the garden, just as she had begun to like the robin and Dickon and Martha's mother — a good many people to like, when you were not used to liking. She went to walk outside the long, ivy-covered wall, and the second time she walked up and down, the most interesting and exciting thing happened to her, all through Ben Weatherstaff's robin.\n\nShe heard a chirp and a twitter, and when she looked at the bare flower-bed at her left side, there he was, hopping about and pretending to peck at the earth to persuade her that he had not followed her. But she knew he had followed her, and the surprise filled her with such delight that she almost trembled. \"You do remember me!\" she cried out. \"You are prettier than anything else in the world!\" His red waistcoat was like satin, and he puffed his tiny breast out so finely that it was really as if he were showing her how important a robin could be.\n\nThe flower-bed was not quite bare. The perennial plants had been cut down for their winter rest, but tall shrubs grew together at the back of the bed, and as the robin hopped about beneath them she saw him hop over a small pile of freshly turned earth. He stopped on it to look for a worm. A dog had been trying to dig out a mole there and had scratched quite a deep hole. Mary looked at it, not really knowing why the hole was there, and as she looked she saw something almost buried in the newly turned soil. It was a ring of rusty iron or brass, and when the robin flew up into a tree nearby she put out her hand and picked it up. It was more than a ring, however; it was an old key that looked as if it had been buried a long time.\n\nMistress Mary stood up and looked at it with an almost frightened face as it hung from her finger. \"Perhaps it has been buried for ten years,\" she said in a whisper. \"Perhaps it is the key to the garden!\" She looked at the key for a long time, turning it over and over. She was not a child who had been trained to ask permission or consult her elders about things, and all she thought was that if it was the key to the closed garden, she could find the door and see what was inside the walls, and what had happened to the old rose-trees. It seemed as if the garden must be different from other places, since it had been shut up so long. She put the key in her pocket and made up her mind that she would always carry it with her, so that if she ever should find the hidden door, she would be ready.";

const excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-1",
    "explanation": "The simile likens the sky's blue to a lake with no visible bottom, a comparison whose main effect is to convey just how deep and seemingly limitless the color appears to Mary, especially set against her memory of the hot, blazing skies of India.",
    "explanationHtml": "<p>The simile likens the sky's blue to a lake with no visible bottom, a comparison whose main effect is to convey just how deep and seemingly limitless the color appears to Mary, especially set against her memory of the hot, blazing skies of India.</p>",
    "points": 1,
    "prompt": "The comparison of the sky to \"the waters of some lovely, bottomless lake\" in paragraph 1 is used mainly to",
    "promptHtml": "The comparison of the sky to &quot;the waters of some lovely, bottomless lake&quot; in paragraph 1 is used mainly to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "emphasize how deep and endless the blue sky appears to Mary after the storm.",
        "text": "emphasize how deep and endless the blue sky appears to Mary after the storm."
      },
      {
        "id": "B",
        "html": "suggest that Mary is afraid of the vastness of the moor surrounding the house.",
        "text": "suggest that Mary is afraid of the vastness of the moor surrounding the house."
      },
      {
        "id": "C",
        "html": "contrast the sky's color with the drab gray of Mrs. Medlock's household rules.",
        "text": "contrast the sky's color with the drab gray of Mrs. Medlock's household rules."
      },
      {
        "id": "D",
        "html": "foreshadow that Mary will soon discover a hidden lake somewhere on the grounds.",
        "text": "foreshadow that Mary will soon discover a hidden lake somewhere on the grounds."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-2",
    "explanation": "Both times the word describes Weatherstaff's tone shifting away from his earlier openness — first when the topic turns to India, then when Mary asks about the closed garden — and in each case he answers shortly or grunts rather than continuing the friendly conversation, an abrupt shift in manner rather than exhaustion, confusion, or hidden eagerness.",
    "explanationHtml": "<p>Both times the word describes Weatherstaff's tone shifting away from his earlier openness — first when the topic turns to India, then when Mary asks about the closed garden — and in each case he answers shortly or grunts rather than continuing the friendly conversation, an abrupt shift in manner rather than exhaustion, confusion, or hidden eagerness.</p>",
    "points": 1,
    "prompt": "The author's choice of the word \"surly\" to describe Ben Weatherstaff's manner in paragraphs 6 and 7 is most likely intended to",
    "promptHtml": "The author's choice of the word &quot;surly&quot; to describe Ben Weatherstaff's manner in paragraphs 6 and 7 is most likely intended to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "emphasize how abruptly Weatherstaff's tone turns short and unwelcoming on certain topics.",
        "text": "emphasize how abruptly Weatherstaff's tone turns short and unwelcoming on certain topics."
      },
      {
        "id": "B",
        "html": "suggest that Weatherstaff is too physically exhausted after a morning of garden work to keep talking.",
        "text": "suggest that Weatherstaff is too physically exhausted after a morning of garden work to keep talking."
      },
      {
        "id": "C",
        "html": "imply that Weatherstaff is genuinely confused by Mary's unfamiliar questions about India and the garden.",
        "text": "imply that Weatherstaff is genuinely confused by Mary's unfamiliar questions about India and the garden."
      },
      {
        "id": "D",
        "html": "hint that Weatherstaff is secretly eager to keep talking with Mary despite what he says.",
        "text": "hint that Weatherstaff is secretly eager to keep talking with Mary despite what he says."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-3",
    "explanation": "This line directly names the fact that Mary is now counting several people and the robin among those she likes, and marks it as new and remarkable for a girl who was not used to liking anyone, which is the clearest textual support for her growing attachments; the other choices describe the weather or the setting rather than her relationships.",
    "explanationHtml": "<p>This line directly names the fact that Mary is now counting several people and the robin among those she likes, and marks it as new and remarkable for a girl who was not used to liking anyone, which is the clearest textual support for her growing attachments; the other choices describe the weather or the setting rather than her relationships.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that Mary has begun to form real attachments to the people and animals around her?",
    "promptHtml": "Which sentence from the passage best supports the idea that Mary has begun to form real attachments to the people and animals around her?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "&quot;That seemed a good many people to like, when you were not used to liking.&quot; (paragraph 8)",
        "text": "\"That seemed a good many people to like, when you were not used to liking.\" (paragraph 8)"
      },
      {
        "id": "B",
        "html": "&quot;The flower-bed was not quite bare. The perennial plants had been cut down for their winter rest.&quot; (paragraph 10)",
        "text": "\"The flower-bed was not quite bare. The perennial plants had been cut down for their winter rest.\" (paragraph 10)"
      },
      {
        "id": "C",
        "html": "&quot;Ten years was a long time, Mary thought. She had been born ten years ago.&quot; (paragraph 8)",
        "text": "\"Ten years was a long time, Mary thought. She had been born ten years ago.\" (paragraph 8)"
      },
      {
        "id": "D",
        "html": "&quot;Never had Mary dreamed of a sky so blue...this was a deep, cool blue that almost seemed to sparkle.&quot; (paragraph 1)",
        "text": "\"Never had Mary dreamed of a sky so blue...this was a deep, cool blue that almost seemed to sparkle.\" (paragraph 1)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-4",
    "explanation": "Across the excerpt, the new sky, Martha's talk, Ben Weatherstaff's garden, and the robin all work together to draw Mary — established elsewhere as closed-off and contrary — into caring about something outside herself, culminating in her finding the key, which best supports a theme about a changed environment slowly opening someone up rather than any single character's kindness or a general claim about the countryside.",
    "explanationHtml": "<p>Across the excerpt, the new sky, Martha's talk, Ben Weatherstaff's garden, and the robin all work together to draw Mary — established elsewhere as closed-off and contrary — into caring about something outside herself, culminating in her finding the key, which best supports a theme about a changed environment slowly opening someone up rather than any single character's kindness or a general claim about the countryside.</p>",
    "points": 1,
    "prompt": "Which statement best expresses a theme developed over the course of the excerpt?",
    "promptHtml": "Which statement best expresses a theme developed over the course of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Gardens will always hold onto their oldest secrets far longer than any person is willing to wait for them.",
        "text": "Gardens will always hold onto their oldest secrets far longer than any person is willing to wait for them."
      },
      {
        "id": "B",
        "html": "Kindness shown by a single caring adult is the only thing that can cure a lonely child's bad temper.",
        "text": "Kindness shown by a single caring adult is the only thing that can cure a lonely child's bad temper."
      },
      {
        "id": "C",
        "html": "Children raised in cities are usually happier once they finally move out to the countryside.",
        "text": "Children raised in cities are usually happier once they finally move out to the countryside."
      },
      {
        "id": "D",
        "html": "A change in surroundings can slowly awaken curiosity and connection in someone who has shut both out.",
        "text": "A change in surroundings can slowly awaken curiosity and connection in someone who has shut both out."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-5",
    "explanation": "Weatherstaff's description of things \"stirrin' down below in th' dark\" before any green shoot is visible sets up, in miniature, the larger idea the chapter is building toward — that something long dormant, like the shut garden itself, may already be quietly alive and ready to grow, which the key discovery immediately reinforces.",
    "explanationHtml": "<p>Weatherstaff's description of things &quot;stirrin' down below in th' dark&quot; before any green shoot is visible sets up, in miniature, the larger idea the chapter is building toward — that something long dormant, like the shut garden itself, may already be quietly alive and ready to grow, which the key discovery immediately reinforces.</p>",
    "points": 1,
    "prompt": "The author most likely includes Ben Weatherstaff's remarks about the crocuses and snowdrops in paragraph 6 in order to",
    "promptHtml": "The author most likely includes Ben Weatherstaff's remarks about the crocuses and snowdrops in paragraph 6 in order to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "criticize Mary directly for being unfamiliar with basic plants that most English children would already know.",
        "text": "criticize Mary directly for being unfamiliar with basic plants that most English children would already know."
      },
      {
        "id": "B",
        "html": "prove that Ben Weatherstaff is more knowledgeable about gardening than Mary's own parents were.",
        "text": "prove that Ben Weatherstaff is more knowledgeable about gardening than Mary's own parents were."
      },
      {
        "id": "C",
        "html": "explain why the estate's gardeners are permitted to plant new flowers each and every spring.",
        "text": "explain why the estate's gardeners are permitted to plant new flowers each and every spring."
      },
      {
        "id": "D",
        "html": "introduce the idea that things long hidden underground can still be quietly preparing to grow.",
        "text": "introduce the idea that things long hidden underground can still be quietly preparing to grow."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-6",
    "explanation": "Words like \"delight,\" \"trembled,\" and \"cried out\" are emotionally heightened for such a small event — a bird staying near her — and that intensity conveys how overwhelmingly joyful the moment feels to a girl unused to anyone, human or animal, choosing to stay close to her.",
    "explanationHtml": "<p>Words like &quot;delight,&quot; &quot;trembled,&quot; and &quot;cried out&quot; are emotionally heightened for such a small event — a bird staying near her — and that intensity conveys how overwhelmingly joyful the moment feels to a girl unused to anyone, human or animal, choosing to stay close to her.</p>",
    "points": 1,
    "prompt": "How does the word choice in paragraph 9 (\"delight,\" \"trembled,\" \"cried out\") affect the tone of Mary's encounter with the robin?",
    "promptHtml": "How does the word choice in paragraph 9 (&quot;delight,&quot; &quot;trembled,&quot; &quot;cried out&quot;) affect the tone of Mary's encounter with the robin?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It creates a tone of quiet, lingering suspicion, as if Mary does not fully trust the bird's sudden return.",
        "text": "It creates a tone of quiet, lingering suspicion, as if Mary does not fully trust the bird's sudden return."
      },
      {
        "id": "B",
        "html": "It creates a tone of overwhelming joy, capturing how rare and intense this small moment feels to her.",
        "text": "It creates a tone of overwhelming joy, capturing how rare and intense this small moment feels to her."
      },
      {
        "id": "C",
        "html": "It creates a tone of restrained sadness, suggesting that Mary already expects to be disappointed again.",
        "text": "It creates a tone of restrained sadness, suggesting that Mary already expects to be disappointed again."
      },
      {
        "id": "D",
        "html": "It creates a tone of gentle comic exaggeration, poking fun at how seriously Mary takes a small bird.",
        "text": "It creates a tone of gentle comic exaggeration, poking fun at how seriously Mary takes a small bird."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3-passage-7",
    "explanation": "Deciding to always carry the key \"so that\" she will be ready shows Mary quietly committing to a goal and preparing for it in advance, a shift from the passive, waiting attitude she showed earlier in the excerpt toward one where she is actively working toward something she wants.",
    "explanationHtml": "<p>Deciding to always carry the key &quot;so that&quot; she will be ready shows Mary quietly committing to a goal and preparing for it in advance, a shift from the passive, waiting attitude she showed earlier in the excerpt toward one where she is actively working toward something she wants.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 11: \"She put the key in her pocket and made up her mind that she would always carry it with her, so that if she ever should find the hidden door, she would be ready.\" What does this sentence reveal about Mary?",
    "promptHtml": "Read this sentence from paragraph 11: &quot;She put the key in her pocket and made up her mind that she would always carry it with her, so that if she ever should find the hidden door, she would be ready.&quot; What does this sentence reveal about Mary?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It shows that Mary regrets picking up the rusted key without asking Mrs. Medlock for permission first.",
        "text": "It shows that Mary regrets picking up the rusted key without asking Mrs. Medlock for permission first."
      },
      {
        "id": "B",
        "html": "It implies that Mary suspects Ben Weatherstaff already secretly knows where the hidden door is located.",
        "text": "It implies that Mary suspects Ben Weatherstaff already secretly knows where the hidden door is located."
      },
      {
        "id": "C",
        "html": "It reveals that Mary is forming a private plan instead of simply waiting for something to happen.",
        "text": "It reveals that Mary is forming a private plan instead of simply waiting for something to happen."
      },
      {
        "id": "D",
        "html": "It suggests that Mary worries the robin will lead someone else straight to the door before she can find it.",
        "text": "It suggests that Mary worries the robin will lead someone else straight to the door before she can find it."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-key-of-the-garden-digital-shsat-practice-test-3",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"The Key of the Garden\"",
    author: "Frances Hodgson Burnett",
    blurb: "The following is adapted from Frances Hodgson Burnett’s 1911 novel The Secret Garden. A lonely young girl named Mary Lennox has recently arrived at her uncle’s isolated English estate after the death of her parents in India.",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>Two days after this, when Mary opened her eyes she sat upright in bed immediately and called to Martha. &quot;Look at the moor! Look at the moor!&quot; The rain-storm had ended, and the gray mist and clouds had been swept away in the night by the wind. A brilliant, deep blue sky arched high over the moorland. Never had Mary dreamed of a sky so blue. In India the skies were hot and blazing; this was a deep, cool blue that almost seemed to sparkle like the waters of some lovely, bottomless lake, and here and there, high in the arched blueness, floated small clouds of snow-white fleece.</p><p>&quot;Aye,&quot; said Martha with a cheerful grin. &quot;Th' storm's over for a bit. It goes off in a night like it was pretendin' it had never been here an' never meant to come again. That's because th' springtime's on its way.&quot; Mary had begun, without quite knowing it, to look forward to Martha's morning talk. Everything Martha told her about the moor and the cottage and her mother and the twelve brothers and sisters who had to be fed on fourteen shillings a week had a rough charm that was new to her. She had never before been interested in any person not her own, because no one had ever made her feel that she ought to be.</p><p>&quot;Could I ever get there?&quot; Mary asked, looking through her window at the far-off blue. It was so new and big and wonderful, and such a heavenly color.</p><p>&quot;I don't know,&quot; Martha answered. &quot;Tha's never used tha' legs since tha' was born, it seems to me. Tha' couldn't walk five mile.&quot; She went away in high spirits soon after, for it was her day out, and she meant to walk the five miles home across the moor to help her mother with the week's washing.</p><p>Mary felt lonelier than ever when she knew Martha was gone. She went out into the garden as quickly as possible and ran round and round the fountain flower garden ten times, counting carefully, and when she had finished she felt in better spirits. She went into the first kitchen-garden and found Ben Weatherstaff working there with two other gardeners. The change in the weather seemed to have done him good, and he spoke to her of his own accord.</p><p>&quot;Springtime's comin',&quot; he said. &quot;Cannot tha' smell it?&quot; Mary sniffed and thought she could. &quot;That's th' good rich earth,&quot; he answered, digging away. &quot;It's in a good humor makin' ready to grow things. You'll see bits o' green spikes stickin' out o' th' black earth after a bit.&quot; &quot;What will they be?&quot; asked Mary. &quot;Crocuses an' snowdrops an' daffydowndillys. Has tha' never seen them?&quot; &quot;No. Everything is hot and wet and green after the rains in India,&quot; said Mary, &quot;and I think things grow up in a night.&quot; &quot;These won't grow up in a night,&quot; said Weatherstaff, surly again now that the talk had turned from earth to India. &quot;Tha'll have to wait for 'em.&quot;</p><p>Very soon she heard the soft rustling flight of wings again, and she knew the robin had come. He hopped about close to her feet and put his head on one side and looked at her so slyly that she asked Ben Weatherstaff a question. &quot;Do you think he remembers me?&quot; &quot;Remembers thee!&quot; said Weatherstaff, almost offended at the suggestion. &quot;He knows every cabbage stump in th' gardens, let alone th' people.&quot; &quot;Are things stirring down below in the dark in that garden where he lives?&quot; Mary inquired. &quot;What garden?&quot; grunted Weatherstaff, turning surly again. &quot;The one where the old rose-trees are,&quot; she said, unable to keep from asking, because she wanted so much to know. &quot;Are all the flowers dead, or do some of them come again in the summer?&quot; &quot;Ask him,&quot; said Ben Weatherstaff, hunching his shoulders toward the robin. &quot;He's the only one as knows. No one else has seen inside it for ten year'.&quot;</p><p>Ten years was a long time, Mary thought. She had been born ten years ago. She walked away, slowly thinking. She had begun to like the garden, just as she had begun to like the robin and Dickon and Martha's mother — a good many people to like, when you were not used to liking. She went to walk outside the long, ivy-covered wall, and the second time she walked up and down, the most interesting and exciting thing happened to her, all through Ben Weatherstaff's robin.</p><p>She heard a chirp and a twitter, and when she looked at the bare flower-bed at her left side, there he was, hopping about and pretending to peck at the earth to persuade her that he had not followed her. But she knew he had followed her, and the surprise filled her with such delight that she almost trembled. &quot;You do remember me!&quot; she cried out. &quot;You are prettier than anything else in the world!&quot; His red waistcoat was like satin, and he puffed his tiny breast out so finely that it was really as if he were showing her how important a robin could be.</p><p>The flower-bed was not quite bare. The perennial plants had been cut down for their winter rest, but tall shrubs grew together at the back of the bed, and as the robin hopped about beneath them she saw him hop over a small pile of freshly turned earth. He stopped on it to look for a worm. A dog had been trying to dig out a mole there and had scratched quite a deep hole. Mary looked at it, not really knowing why the hole was there, and as she looked she saw something almost buried in the newly turned soil. It was a ring of rusty iron or brass, and when the robin flew up into a tree nearby she put out her hand and picked it up. It was more than a ring, however; it was an old key that looked as if it had been buried a long time.</p><p>Mistress Mary stood up and looked at it with an almost frightened face as it hung from her finger. &quot;Perhaps it has been buried for ten years,&quot; she said in a whisper. &quot;Perhaps it is the key to the garden!&quot; She looked at the key for a long time, turning it over and over. She was not a child who had been trained to ask permission or consult her elders about things, and all she thought was that if it was the key to the closed garden, she could find the door and see what was inside the walls, and what had happened to the old rose-trees. It seemed as if the garden must be different from other places, since it had been shut up so long. She put the key in her pocket and made up her mind that she would always carry it with her, so that if she ever should find the hidden door, she would be ready.</p>",
    text: excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3PassageText,
    versionLabel: "Digital SHSAT Practice Test 3",
  }),
  questions: excerptFromTheKeyOfTheGardenDigitalShsatPracticeTest3Questions,
};
