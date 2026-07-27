import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const dothemnoharmPassageText = "In the moon of Ta-Yum, the hottest days of summer, when salmon spawn in the little streams and huckleberries ripen in the high mountains, people from many villages of the Chopunnish Nation gathered in the Oyaip Prairie for the work and festivities of their annual camas harvest.\n\nFrom far and near The People came. . . .\n\nShould a stranger enter their homeland and ask, “Where are you from?” the reply was always, “We are Nee-mee-poo, The People who live here in this place.”\n\nIt was a time of Lawtiwa-mah-ton—a time of being friends together—when The People came for this last chance to enjoy being together before the Cold Moons kept them close to their fires. The visiting and trading, the foot racing and horse racing, and the gambling and stick games would be remembered and talked about long after they had forgotten the drudgery of digging and roasting camas, picking berries, or drying meat and fish. Lawtiwa-mah-ton! It was good to be friends together.\n\nAs was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them. Red Bear’s people, from Kamiah, made their camp near the trail that came out of the mountains. Their neighbors in Kamiah Valley, The People from Tee-e-lap-a-lo, had their camp close by. Across the wide meadow, by the great roasting pits, the camps of the Te-wap-poo and Ask-kah-poo were located. The tepees and ish-nash, brush shelters, of other groups nestled in their accustomed areas in and among the pines in such numbers that they encircled the entire meadow land.\n\nRed Bear’s people had traveled all summer with neighboring bands, gathering and preparing roots, picking and drying berries, drying and smoking meat and fish for their winter food supply. Now they were at the Oyaip camp. The women worked hard to dig and cure as many bags of roots as they could during the warm, sunny days, for the sharp night air brought warnings that WARM was going and COLD was coming.\n\nEveryone helped in some way. Most of the men fished or hunted for meat. While many of the women dug and roasted camas, other women and older children picked and dried berries.\n\nAnd the younger children played. They played at hunting. They played with the babies. They played with their horses and puppies. They learned how to live through their play.\n\nThis sun, happiness, peace, and quiet blessed the Red Bear camp. All were busy with their daily tasks, until sudden cries came from the children playing by the trail.\n\n“People coming! People coming! People coming on the trail from the high mountains!” they called as they ran to their elders, who looked sharply at the figures of approaching horsemen.\n\nWere they friends or enemies? Did they bring good news or bad?\n\n“Who can it be? What brings them here?” were the questions in every mind.\n\n“Could they be the four hunters who had gone to Buffalo Country two summers past? Would they have news of the families who had gone long ago to Buffalo Country and never returned?”\n\nIt was customary for a hunting party to be gone for more than one season.\n\n“Looks like hunters,” the older men agreed. “Looks like they had good hunting. Maybe our four hunters. [They have] been gone many moons.”\n\n“Looks like five people—not four,” others observed.\n\nExcitement grew as the riders came close enough to be recognized.\n\n“A-a-a-a-a, they are our four hunters! But who is the fifth person?” they asked.\n\n“Looks like a woman. Who is she?”\n\nThe hunters rode up to the welcoming crowd, proud to show off the loads of meat, hides, and other trophies of their hunt. They paraded around the encampment for all to see how strong their Hunting Power had been—what great hunters they, themselves, were.\n\nRed Bear’s people rejoiced at their hunters’ success. Good hunters brought good to everybody. The meat meant plenty of food and the hides meant soft-tanned robes to give comfort through the Cold Moons. But it was the sight of the frail figure of the woman that aroused their curiosity. Who was she? Where had she come from? . . .\n\n“Belongs to Red Bear people. Gone then come back,” the hunters said, as they dismounted and unloaded their packs. . . .\n\nNow they could see! She was the daughter of the family gone so long ago! The girl-child who had left came back now—a grown woman.\n\n“Wat-ku-ese!” the women cried. “Gone-from-Home-then-Come-Back. Wat-ku-ese!” And Wat-ku-ese was her name from that time on.\n\nGentle arms lifted Wat-ku-ese from her horse. The women brought her food and made a place for her to rest. For many suns they cared for her until she became stronger.\n\nOne evening Wat-ku-ese told her story for all to hear.";

const dothemnoharmQuestions: ExamQuestion[] = [
  {
    "id": "dothemnoharm-1",
    "points": 1,
    "prompt": "Paragraph 1 contributes to the setting of the excerpt by establishing that",
    "promptHtml": "Paragraph 1 contributes to the setting of the excerpt by establishing that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "the story’s location is a plentiful place that allows The People to enjoy a comfortable gathering.",
        "text": "the story’s location is a plentiful place that allows The People to enjoy a comfortable gathering."
      },
      {
        "id": "B",
        "html": "the events in the story occurred in the past and are being remembered by The People.",
        "text": "the events in the story occurred in the past and are being remembered by The People."
      },
      {
        "id": "C",
        "html": "the camp in the story is changing and that the changes are causing problems for The People.",
        "text": "the camp in the story is changing and that the changes are causing problems for The People."
      },
      {
        "id": "D",
        "html": "the story’s plot begins as The People are observing their land and what it offers them.",
        "text": "the story’s plot begins as The People are observing their land and what it offers them."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-2",
    "points": 1,
    "prompt": "In paragraphs 4 and 6, the beginning of the change in seasons affects the characters mainly by",
    "promptHtml": "In paragraphs 4 and 6, the beginning of the change in seasons affects the characters <strong>mainly</strong> by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "causing them to collect their bounty and feel eager to celebrate before it becomes cold.",
        "text": "causing them to collect their bounty and feel eager to celebrate before it becomes cold."
      },
      {
        "id": "B",
        "html": "making them want to rest and relax before the challenging work of the harvest begins.",
        "text": "making them want to rest and relax before the challenging work of the harvest begins."
      },
      {
        "id": "C",
        "html": "forcing them to give up leisure time to prepare their camp for the coming winter.",
        "text": "forcing them to give up leisure time to prepare their camp for the coming winter."
      },
      {
        "id": "D",
        "html": "allowing them to trade the goods they have prepared during the warm months.",
        "text": "allowing them to trade the goods they have prepared during the warm months."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-3",
    "points": 1,
    "prompt": "How do paragraphs 7 and 9 convey a central idea of the excerpt?",
    "promptHtml": "How do paragraphs 7 and 9 convey a central idea of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "by explaining that The People often explore different areas, which shows the value of trying new things",
        "text": "by explaining that The People often explore different areas, which shows the value of trying new things"
      },
      {
        "id": "B",
        "html": "by revealing that The People must complete many tasks, which shows the necessity of being organized",
        "text": "by revealing that The People must complete many tasks, which shows the necessity of being organized"
      },
      {
        "id": "C",
        "html": "by suggesting that The People are influenced by the weather, which shows their close relationship with nature",
        "text": "by suggesting that The People are influenced by the weather, which shows their close relationship with nature"
      },
      {
        "id": "D",
        "html": "by demonstrating that The People work together, which shows the importance of contributing to the community",
        "text": "by demonstrating that The People work together, which shows the importance of contributing to the community"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-4",
    "points": 1,
    "prompt": "In paragraph 8, the author repeats the word “played” most likely to",
    "promptHtml": "In paragraph 8, the author repeats the word “played” <strong>most likely</strong> to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "emphasize how much the adults enjoy observing the children.",
        "text": "emphasize how much the adults enjoy observing the children."
      },
      {
        "id": "B",
        "html": "show how everyone finds a way to enjoy being at the gathering.",
        "text": "show how everyone finds a way to enjoy being at the gathering."
      },
      {
        "id": "C",
        "html": "indicate the variety of activities available at the gathering.",
        "text": "indicate the variety of activities available at the gathering."
      },
      {
        "id": "D",
        "html": "characterize the manner in which the children master the work of adults.",
        "text": "characterize the manner in which the children master the work of adults."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-5",
    "points": 1,
    "prompt": "How do paragraphs 11–13 affect the plot of the excerpt?",
    "promptHtml": "How do paragraphs 11–13 affect the plot of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "They establish a feeling of mystery by presenting different points of view about the arriving people.",
        "text": "They establish a feeling of mystery by presenting different points of view about the arriving people."
      },
      {
        "id": "B",
        "html": "They contribute to the rising action by developing the idea that the arriving people could present a problem.",
        "text": "They contribute to the rising action by developing the idea that the arriving people could present a problem."
      },
      {
        "id": "C",
        "html": "They lead to a turning point by describing the moment that the crowd realizes why the strangers have come.",
        "text": "They lead to a turning point by describing the moment that the crowd realizes why the strangers have come."
      },
      {
        "id": "D",
        "html": "They explain the cause of the main conflict by providing background information about the strangers.",
        "text": "They explain the cause of the main conflict by providing background information about the strangers."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-6",
    "points": 1,
    "prompt": "In paragraph 20, the phrases “trophies of their hunt” and “paraded around” affect the paragraph by",
    "promptHtml": "In paragraph 20, the phrases “trophies of their hunt” and “paraded around” affect the paragraph by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggesting that the hunters are rewarded for their leadership.",
        "text": "suggesting that the hunters are rewarded for their leadership."
      },
      {
        "id": "B",
        "html": "emphasizing that The People are dependent on the hunters for food.",
        "text": "emphasizing that The People are dependent on the hunters for food."
      },
      {
        "id": "C",
        "html": "revealing that the hunters are pleased with their success.",
        "text": "revealing that the hunters are pleased with their success."
      },
      {
        "id": "D",
        "html": "indicating that The People have gathered specifically to welcome the hunters.",
        "text": "indicating that The People have gathered specifically to welcome the hunters."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-7",
    "points": 1,
    "prompt": "Which quotation from the excerpt best supports the idea that The People feel a connection to members of their group in spite of distance?",
    "promptHtml": "Which quotation from the excerpt <strong>best</strong> supports the idea that The People feel a connection to members of their group in spite of distance?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them.” (paragraph 5)",
        "text": "“As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them.” (paragraph 5)"
      },
      {
        "id": "B",
        "html": "“ ‘Would they have news of the families who had gone long ago to Buffalo Country and never returned?’ ” (paragraph 13)",
        "text": "“ ‘Would they have news of the families who had gone long ago to Buffalo Country and never returned?’ ” (paragraph 13)"
      },
      {
        "id": "C",
        "html": "“ ‘Looks like hunters,’ the older men agreed. ‘Looks like they had good hunting.’ ” (paragraph 15)",
        "text": "“ ‘Looks like hunters,’ the older men agreed. ‘Looks like they had good hunting.’ ” (paragraph 15)"
      },
      {
        "id": "D",
        "html": "“But it was the sight of the frail figure of the woman that aroused their curiosity.” (paragraph 21)",
        "text": "“But it was the sight of the frail figure of the woman that aroused their curiosity.” (paragraph 21)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-8",
    "points": 1,
    "prompt": "Read these sentences from paragraph 22.\n\n“Belongs to Red Bear people. Gone then come back.”\n\nHow does this statement affect the villagers in the excerpt?",
    "promptHtml": "Read these sentences from paragraph 22.<br><strong>“Belongs to Red Bear people. Gone then come back.”</strong><br>How does this statement affect the villagers in the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It increases their concern about why the woman is in their camp.",
        "text": "It increases their concern about why the woman is in their camp."
      },
      {
        "id": "B",
        "html": "It makes them hopeful that more lost members will return before the winter.",
        "text": "It makes them hopeful that more lost members will return before the winter."
      },
      {
        "id": "C",
        "html": "It causes shock, leading them to grieve for the loss of the woman and her family.",
        "text": "It causes shock, leading them to grieve for the loss of the woman and her family."
      },
      {
        "id": "D",
        "html": "It inspires amazement, making them want to reconnect with their returned family member.",
        "text": "It inspires amazement, making them want to reconnect with their returned family member."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "dothemnoharm-9",
    "points": 1,
    "prompt": "The details in paragraph 5 about the locations of the camps and the details in paragraphs 23–24 about the reaction to the woman convey a theme of the excerpt by",
    "promptHtml": "The details in paragraph 5 about the locations of the camps and the details in paragraphs 23–24 about the reaction to the woman convey a theme of the excerpt by",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "revealing the difficulties posed by moving often each year.",
        "text": "revealing the difficulties posed by moving often each year."
      },
      {
        "id": "B",
        "html": "showing the connectedness among The People through the years.",
        "text": "showing the connectedness among The People through the years."
      },
      {
        "id": "C",
        "html": "indicating the value to The People of retelling stories about the past.",
        "text": "indicating the value to The People of retelling stories about the past."
      },
      {
        "id": "D",
        "html": "demonstrating the importance of choosing appropriate names.",
        "text": "demonstrating the importance of choosing appropriate names."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const dothemnoharmPassageSet: ExamPassageSet = {
  id: "ela-dothemnoharm",
  questionCount: dothemnoharmQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "dothemnoharm",
    title: "Excerpt from Do Them No Harm!",
    author: "Zoa L. Swayne",
    blurb: "This narrative is about the Nez Perce, an American Indian tribe, in what is now northern Idaho. The tribe is preparing for a gathering before the coming winter.",
    richText: "<p>In the moon of Ta-Yum, the hottest days of summer, when salmon spawn in the little streams and huckleberries ripen in the high mountains, people from many villages of the Chopunnish Nation gathered in the Oyaip Prairie for the work and festivities of their annual camas harvest.</p><p>From far and near The People came. . . .</p><p>Should a stranger enter their homeland and ask, “Where are you from?” the reply was always, “We are Nee-mee-poo, The People who live here in this place.”</p><p>It was a time of Lawtiwa-mah-ton—a time of being friends together—when The People came for this last chance to enjoy being together before the Cold Moons kept them close to their fires. The visiting and trading, the foot racing and horse racing, and the gambling and stick games would be remembered and talked about long after they had forgotten the drudgery of digging and roasting camas, picking berries, or drying meat and fish. Lawtiwa-mah-ton! It was good to be friends together.</p><p>As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them. Red Bear’s people, from Kamiah, made their camp near the trail that came out of the mountains. Their neighbors in Kamiah Valley, The People from Tee-e-lap-a-lo, had their camp close by. Across the wide meadow, by the great roasting pits, the camps of the Te-wap-poo and Ask-kah-poo were located. The tepees and ish-nash, brush shelters, of other groups nestled in their accustomed areas in and among the pines in such numbers that they encircled the entire meadow land.</p><p>Red Bear’s people had traveled all summer with neighboring bands, gathering and preparing roots, picking and drying berries, drying and smoking meat and fish for their winter food supply. Now they were at the Oyaip camp. The women worked hard to dig and cure as many bags of roots as they could during the warm, sunny days, for the sharp night air brought warnings that WARM was going and COLD was coming.</p><p>Everyone helped in some way. Most of the men fished or hunted for meat. While many of the women dug and roasted camas, other women and older children picked and dried berries.</p><p>And the younger children played. They played at hunting. They played with the babies. They played with their horses and puppies. They learned how to live through their play.</p><p>This sun, happiness, peace, and quiet blessed the Red Bear camp. All were busy with their daily tasks, until sudden cries came from the children playing by the trail.</p><p>“People coming! People coming! People coming on the trail from the high mountains!” they called as they ran to their elders, who looked sharply at the figures of approaching horsemen.</p><p>Were they friends or enemies? Did they bring good news or bad?</p><p>“Who can it be? What brings them here?” were the questions in every mind.</p><p>“Could they be the four hunters who had gone to Buffalo Country two summers past? Would they have news of the families who had gone long ago to Buffalo Country and never returned?”</p><p>It was customary for a hunting party to be gone for more than one season.</p><p>“Looks like hunters,” the older men agreed. “Looks like they had good hunting. Maybe our four hunters. [They have] been gone many moons.”</p><p>“Looks like five people—not four,” others observed.</p><p>Excitement grew as the riders came close enough to be recognized.</p><p>“A-a-a-a-a, they are our four hunters! But who is the fifth person?” they asked.</p><p>“Looks like a woman. Who is she?”</p><p>The hunters rode up to the welcoming crowd, proud to show off the loads of meat, hides, and other trophies of their hunt. They paraded around the encampment for all to see how strong their Hunting Power had been—what great hunters they, themselves, were.</p><p>Red Bear’s people rejoiced at their hunters’ success. Good hunters brought good to everybody. The meat meant plenty of food and the hides meant soft-tanned robes to give comfort through the Cold Moons. But it was the sight of the frail figure of the woman that aroused their curiosity. Who was she? Where had she come from? . . .</p><p>“Belongs to Red Bear people. Gone then come back,” the hunters said, as they dismounted and unloaded their packs. . . .</p><p>Now they could see! She was the daughter of the family gone so long ago! The girl-child who had left came back now—a grown woman.</p><p>“Wat-ku-ese!” the women cried. “Gone-from-Home-then-Come-Back. Wat-ku-ese!” And Wat-ku-ese was her name from that time on.</p><p>Gentle arms lifted Wat-ku-ese from her horse. The women brought her food and made a place for her to rest. For many suns they cared for her until she became stronger.</p><p>One evening Wat-ku-ese told her story for all to hear.</p>",
    sourceNote: "From DO THEM NO HARM!: Lewis and Clark Among the Nez Perce by Zoa L. Swayne. Published by Caxton Press. Copyright © 1990 by Zoa L. Swayne. Orofino, Idaho and Legacy House, Inc. Orofino, Idaho. All rights reserved.",
    text: dothemnoharmPassageText,
  }),
  questions: dothemnoharmQuestions,
};
