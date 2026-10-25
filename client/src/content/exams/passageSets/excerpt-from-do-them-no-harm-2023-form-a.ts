import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromDoThemNoHarm2023FormAPassageText = "1 In the moon of Ta-Yum, the hottest days of summer, when salmon spawn in the little streams and huckleberries ripen in the high mountains, people from many villages of the Chopunnish Nation gathered in the Oyaip Prairie for the work and festivities of their annual camas harvest.\n\n2 From far and near The People came. . . .\n\n3 Should a stranger enter their homeland and ask, “Where are you from?” the reply was always, “We are Nee-mee-poo, The People who live here in this place.”\n\n4 It was a time of Lawtiwa-mah-ton—a time of being friends together—when The People came for this last chance to enjoy being together before the Cold Moons kept them close to their fires. The visiting and trading, the foot racing and horse racing, and the gambling and stick games would be remembered and talked about long after they had forgotten the drudgery of digging and roasting camas, picking berries, or drying meat and fish. Lawtiwa-mah-ton! It was good to be friends together.\n\n5 As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them. Red Bear’s people, from Kamiah, made their camp near the trail that came out of the mountains. Their neighbors in Kamiah Valley, The People from Tee-e-lap-a-lo, had their camp close by. Across the wide meadow, by the great roasting pits, the camps of the Te-wap-poo and Ask-kah-poo were located. The tepees and ish-nash, brush shelters, of other groups nestled in their accustomed areas in and among the pines in such numbers that they encircled the entire meadow land.\n\n6 Red Bear’s people had traveled all summer with neighboring bands, gathering and preparing roots, picking and drying berries, drying and smoking meat and fish for their winter food supply. Now they were at the Oyaip camp. The women worked hard to dig and cure as many bags of roots as they could during the warm, sunny days, for the sharp night air brought warnings that WARM was going and COLD was coming.\n\n7 Everyone helped in some way. Most of the men fished or hunted for meat. While many of the women dug and roasted camas, other women and older children picked and dried berries.\n\n8 And the younger children played. They played at hunting. They played with the babies. They played with their horses and puppies. They learned how to live through their play.\n\n9 This sun, happiness, peace, and quiet blessed the Red Bear camp. All were busy with their daily tasks, until sudden cries came from the children playing by the trail.\n\n10 “People coming! People coming! People coming on the trail from the high mountains!” they called as they ran to their elders, who looked sharply at the figures of approaching horsemen.\n\n11 Were they friends or enemies? Did they bring good news or bad?\n\n12 “Who can it be? What brings them here?” were the questions in every mind.\n\n13 “Could they be the four hunters who had gone to Buffalo Country two summers past? Would they have news of the families who had gone long ago to Buffalo Country and never returned?”\n\n14 It was customary for a hunting party to be gone for more than one season.\n\n15 “Looks like hunters,” the older men agreed. “Looks like they had good hunting. Maybe our four hunters. [They have] been gone many moons.”\n\n16 “Looks like five people—not four,” others observed.\n\n17 Excitement grew as the riders came close enough to be recognized.\n\n18 “A-a-a-a-a, they are our four hunters! But who is the fifth person?” they asked.\n\n19 “Looks like a woman. Who is she?”\n\n20 The hunters rode up to the welcoming crowd, proud to show off the loads of meat, hides, and other trophies of their hunt. They paraded around the encampment for all to see how strong their Hunting Power had been—what great hunters they, themselves, were.\n\n21 Red Bear’s people rejoiced at their hunters’ success. Good hunters brought good to everybody. The meat meant plenty of food and the hides meant soft-tanned robes to give comfort through the Cold Moons. But it was the sight of the frail figure of the woman that aroused their curiosity. Who was she? Where had she come from? . . .\n\n22 “Belongs to Red Bear people. Gone then come back,” the hunters said, as they dismounted and unloaded their packs. . . .\n\n23 Now they could see! She was the daughter of the family gone so long ago! The girl-child who had left came back now—a grown woman.\n\n24 “Wat-ku-ese!” the women cried. “Gone-from-Home-then-Come-Back. Wat-ku-ese!” And Wat-ku-ese was her name from that time on.\n\n25 Gentle arms lifted Wat-ku-ese from her horse. The women brought her food and made a place for her to rest. For many suns they cared for her until she became stronger.\n\n26 One evening Wat-ku-ese told her story for all to hear.";

const excerptFromDoThemNoHarm2023FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q24",
    "explanation": "The question asks how paragraph 1 contributes to the setting of the excerpt.\n\nA. CORRECT. Paragraph 1 describes summer “when salmon spawn,” “huckleberries ripen,” and The People gather for “their annual camas harvest.” These descriptions show the abundance of food in the place where the excerpt occurs.\n\nB. Incorrect. Although the setting refers to past events, the narration is not by The People. In addition, the voice narrating the excerpt is not an element of the setting.\n\nC. Incorrect. Nothing in paragraph 1 suggests that the camp is changing in any way. The People gather annually in this place. In addition, the language used to describe the setting does not suggest any problems.\n\nD. Incorrect. The People are not making observations about the setting in paragraph 1. They are described as performing actions, such as gathering “for the work and festivities of their annual... harvest.”",
    "points": 1,
    "prompt": "Paragraph 1 contributes to the setting of the excerpt by establishing that",
    "promptHtml": "Paragraph 1 contributes to the setting of the excerpt by establishing that",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "the story’s location is a plentiful place that allows The People to enjoy a comfortable gathering."
      },
      {
        "id": "B",
        "text": "the events in the story occurred in the past and are being remembered by The People."
      },
      {
        "id": "C",
        "text": "the camp in the story is changing and that the changes are causing problems for The People."
      },
      {
        "id": "D",
        "text": "the story’s plot begins as The People are observing their land and what it offers them."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q25",
    "explanation": "The question asks how the beginning of the change of seasons mainly affects the characters.\n\nA. CORRECT. Paragraph 4 describes the time as the last chance for The People to be together “before the Cold Moons kept them close to their fires.” Paragraph 6 tells about how the women were working hard to dig and cure roots, because “WARM was going and COLD was coming.” These paragraphs describe both celebration and preparation before the winter comes.\n\nB. Incorrect. Paragraphs 4 and 6 describe the characters working hard, but there is no discussion of them wanting to rest and relax.\n\nC. Incorrect. While both paragraphs describe some of the work involved in the harvest, paragraph 4 also lists a number of leisure activities, such as visiting, foot racing, horse racing, gambling, and stick games. The characters are still taking the time to relax.\n\nD. Incorrect. While paragraph 4 mentions trading in a list of activities that the characters are doing, this is just one of many activities. Allowing the characters to trade goods is not the way the change in seasons mainly affects them.",
    "points": 1,
    "prompt": "In paragraphs 4 and 6, the beginning of the change in seasons affects the characters mainly by",
    "promptHtml": "In paragraphs 4 and 6, the beginning of the change in seasons affects the characters mainly by",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "text": "causing them to collect their bounty and feel eager to celebrate before it becomes cold."
      },
      {
        "id": "B",
        "text": "making them want to rest and relax before the challenging work of the harvest begins."
      },
      {
        "id": "C",
        "text": "forcing them to give up leisure time to prepare their camp for the coming winter."
      },
      {
        "id": "D",
        "text": "allowing them to trade the goods they have prepared during the warm months."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q26",
    "explanation": "The question asks how paragraphs 7 and 9 convey a central idea of the excerpt.\n\nA. Incorrect. Paragraphs 7 and 9 describe activities that The People do at the Red Bear camp. They do not describe The People exploring new areas.\n\nB. Incorrect. While paragraph 7 lists some of the activities that The People did to help, neither paragraph emphasizes that The People need to be organized.\n\nC. Incorrect. Paragraph 9 mentions how the sun blessed the Red Bear camp. However, these paragraphs do not otherwise mention weather.\n\nD. CORRECT. Paragraph 7 lists activities that The People do with one another. Paragraph 9 states that “all were busy with their daily tasks.” Everyone is contributing to the community in their preparation for winter.",
    "points": 1,
    "prompt": "How do paragraphs 7 and 9 convey a central idea of the excerpt?",
    "promptHtml": "How do paragraphs 7 and 9 convey a central idea of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "by explaining that The People often explore different areas, which shows the value of trying new things"
      },
      {
        "id": "B",
        "text": "by revealing that The People must complete many tasks, which shows the necessity of being organized"
      },
      {
        "id": "C",
        "text": "by suggesting that The People are influenced by the weather, which shows their close relationship with nature"
      },
      {
        "id": "D",
        "text": "by demonstrating that The People work together, which shows the importance of contributing to the community"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q27",
    "explanation": "The question asks what is the most likely reason that the author repeats the word “played” in paragraph 8.\n\nA. Incorrect. Paragraph 7 describes the different tasks that the adults were doing at this time. They were not watching the children play, because they were busy working.\n\nB. Incorrect. While everyone enjoys being at the gathering, the word “played” does not describe the activities of the adults. As described in paragraph 7, the adults are working together at various tasks.\n\nC. Incorrect. The word “played” is used before phrases describing what the children did. It is not used to list activities available for all at the gathering.\n\nD. CORRECT. The word “played” appears before different activities that the children did, such as pretending to hunt, take care of the babies, and take care of the animals. They played by pretending to do adult activities. The last sentence states that the children “learned how to live through their play.”",
    "points": 1,
    "prompt": "In paragraph 8, the author repeats the word “played” most likely to",
    "promptHtml": "In paragraph 8, the author repeats the word “played” <strong>most likely</strong> to",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "emphasize how much the adults enjoy observing the children."
      },
      {
        "id": "B",
        "text": "show how everyone finds a way to enjoy being at the gathering."
      },
      {
        "id": "C",
        "text": "indicate the variety of activities available at the gathering."
      },
      {
        "id": "D",
        "text": "characterize the manner in which the children master the work of adults."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q28",
    "explanation": "The question asks how paragraphs 11-13 affect the plot of the excerpt.\n\nA. Incorrect. The paragraphs contain questions about the arriving people. They do not present differing points of view.\n\nB. CORRECT. The paragraphs ask questions in which the characters wonder whether the arriving people are friends or enemies, or whether they might be bringing good news or bad news. By suggesting that the arriving people could present problems such as these, the paragraphs contribute to the rising action.\n\nC. Incorrect. The paragraphs do not lead to a turning point. Instead, they lead to the climax—the moment the characters discover who the visitors are. This means the paragraphs contribute to the rising action.\n\nD. Incorrect. Paragraphs 11-13 ask questions. They do not provide background information about the strangers; instead, they ask for it.",
    "points": 1,
    "prompt": "How do paragraphs 11–13 affect the plot of the excerpt?",
    "promptHtml": "How do paragraphs 11–13 affect the plot of the excerpt?",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "They establish a feeling of mystery by presenting different points of view about the arriving people."
      },
      {
        "id": "B",
        "text": "They contribute to the rising action by developing the idea that the arriving people could present a problem."
      },
      {
        "id": "C",
        "text": "They lead to a turning point by describing the moment that the crowd realizes why the strangers have come."
      },
      {
        "id": "D",
        "text": "They explain the cause of the main conflict by providing background information about the strangers."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q29",
    "explanation": "The question asks how the phrases “trophies of their hunt” and “paraded around” affect paragraph 20.\n\nA. Incorrect. The phrase “trophies of their hunt” describes the animals that the hunters have successfully found. They have already received their rewards (the animals) and are showing them to The People.\n\nB. Incorrect. The excerpt describes many ways that The People find and prepare their own food. While they appreciate the extra food, they are not dependent on the hunters.\n\nC. CORRECT. The hunters “parade around” because they are proud of the animals they have been able to get while hunting. Since a trophy is a recognition of success, they consider these animals their trophies.\n\nD. Incorrect. The phrases show the pride the hunters feel. As paragraph 20 says, the hunters want “all to see how strong their Hunting Power had been.” The phrases are focused on the hunters rather than on those who have gathered around them.",
    "points": 1,
    "prompt": "In paragraph 20, the phrases “trophies of their hunt” and “paraded around” affect the paragraph by",
    "promptHtml": "In paragraph 20, the phrases “trophies of their hunt” and “paraded around” affect the paragraph by",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "suggesting that the hunters are rewarded for their leadership."
      },
      {
        "id": "B",
        "text": "emphasizing that The People are dependent on the hunters for food."
      },
      {
        "id": "C",
        "text": "revealing that the hunters are pleased with their success."
      },
      {
        "id": "D",
        "text": "indicating that The People have gathered specifically to welcome the hunters."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-do-them-no-harm-2023-form-a-2023-form-a-q30",
    "explanation": "The question asks which quotation from the excerpt best supports the idea that The People maintain a connection to members of their group in spite of distance.\n\nA. Incorrect. This quotation describes the fact that The People always return to the same camp to perform the same traditional tasks and enjoy the same festivities as their ancestors. This quotation highlights the customs The People continue from their ancestors, but it does not focus on their present personal connections.\n\nB. CORRECT. This quotation alludes to The People’s eagerness to hear about the families who had traveled away from their group. This eagerness shows that they still feel a connection to these families, even though they are far apart.\n\nC. Incorrect. This quotation describes The People’s analysis of the visitors—that they may be hunters. It does not show a connection to the visitors.\n\nD. Incorrect. This quotation shows that The People are curious about a stranger who has come into their camp. It does not show closeness to distant members of the group.",
    "points": 1,
    "prompt": "Which quotation from the excerpt best supports the idea that The People maintain a connection to members of their group in spite of distance?",
    "promptHtml": "Which quotation from the excerpt <strong>best</strong> supports the idea that The People maintain a connection to members of their group in spite of distance?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them.” (paragraph 5)"
      },
      {
        "id": "B",
        "text": "“ ‘Would they have news of the families who had gone long ago to Buffalo Country and never returned?’ ” (paragraph 13)"
      },
      {
        "id": "C",
        "text": "“ ‘Looks like hunters,’ the older men agreed. ‘Looks like they had good hunting.’ ” (paragraph 15)"
      },
      {
        "id": "D",
        "text": "“But it was the sight of the frail figure of the woman that aroused their curiosity.” (paragraph 21)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromDoThemNoHarm2023FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-do-them-no-harm-2023-form-a",
  section: "reading",
  questionCount: excerptFromDoThemNoHarm2023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-do-them-no-harm-2023-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from Do Them No Harm!",
    author: "Zoa L. Swayne",
    byline: "by Zoa L. Swayne",
    blurb: "This narrative is about the Nez Perce, an American Indian tribe, in what is now northern Idaho. The tribe is preparing for a gathering before the coming winter.",
    passageType: "literary",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">In the moon of Ta-Yum, the hottest days of summer, when salmon spawn in the little streams and huckleberries ripen in the high mountains, people from many villages of the Chopunnish Nation gathered in the Oyaip Prairie for the work and festivities of their annual <span data-glossary-definition=\"a wild, edible plant\" role=\"link\" tabindex=\"0\">camas</span> harvest.</p>\n<p data-numbered=\"true\">From far and near The People came. . . .</p>\n<p data-numbered=\"true\">Should a stranger enter their homeland and ask, “Where are you from?” the reply was always, “We are Nee-mee-poo, The People who live here in this place.”</p>\n<p data-numbered=\"true\">It was a time of Lawtiwa-mah-ton—a time of being friends together—when The People came for this last chance to enjoy being together before the Cold Moons kept them close to their fires. The visiting and trading, the foot racing and horse racing, and the gambling and stick games would be remembered and talked about long after they had forgotten the drudgery of digging and roasting camas, picking berries, or drying meat and fish. Lawtiwa-mah-ton! It was good to be friends together.</p>\n<p data-numbered=\"true\">As was their custom since wahk-kee-ma, a time far back beyond the memory of man, they set up their camps in the same locations their parents and grandparents had occupied before them. Red Bear’s people, from Kamiah, made their camp near the trail that came out of the mountains. Their neighbors in Kamiah Valley, The People from Tee-e-lap-a-lo, had their camp close by. Across the wide meadow, by the great roasting pits, the camps of the Te-wap-poo and Ask-kah-poo were located. The tepees and ish-nash, brush shelters, of other groups nestled in their accustomed areas in and among the pines in such numbers that they encircled the entire meadow land.</p>\n<p data-numbered=\"true\">Red Bear’s people had traveled all summer with neighboring bands, gathering and preparing roots, picking and drying berries, drying and smoking meat and fish for their winter food supply. Now they were at the Oyaip camp. The women worked hard to dig and cure as many bags of roots as they could during the warm, sunny days, for the sharp night air brought warnings that WARM was going and COLD was coming.</p>\n<p data-numbered=\"true\">Everyone helped in some way. Most of the men fished or hunted for meat. While many of the women dug and roasted camas, other women and older children picked and dried berries.</p>\n<p data-numbered=\"true\">And the younger children played. They played at hunting. They played with the babies. They played with their horses and puppies. They learned how to live through their play.</p>\n<p data-numbered=\"true\">This sun, happiness, peace, and quiet blessed the Red Bear camp. All were busy with their daily tasks, until sudden cries came from the children playing by the trail.</p>\n<p data-numbered=\"true\">“People coming! People coming! People coming on the trail from the high mountains!” they called as they ran to their elders, who looked sharply at the figures of approaching horsemen.</p>\n<p data-numbered=\"true\">Were they friends or enemies? Did they bring good news or bad?</p>\n<p data-numbered=\"true\">“Who can it be? What brings them here?” were the questions in every mind.</p>\n<p data-numbered=\"true\">“Could they be the four hunters who had gone to Buffalo Country two summers past? Would they have news of the families who had gone long ago to Buffalo Country and never returned?”</p>\n<p data-numbered=\"true\">It was customary for a hunting party to be gone for more than one season.</p>\n<p data-numbered=\"true\">“Looks like hunters,” the older men agreed. “Looks like they had good hunting. Maybe our four hunters. [They have] been gone many moons.”</p>\n<p data-numbered=\"true\">“Looks like five people—not four,” others observed.</p>\n<p data-numbered=\"true\">Excitement grew as the riders came close enough to be recognized.</p>\n<p data-numbered=\"true\">“A-a-a-a-a, they are our four hunters! But who is the fifth person?” they asked.</p>\n<p data-numbered=\"true\">“Looks like a woman. Who is she?”</p>\n<p data-numbered=\"true\">The hunters rode up to the welcoming crowd, proud to show off the loads of meat, hides, and other trophies of their hunt. They paraded around the encampment for all to see how strong their Hunting Power had been—what great hunters they, themselves, were.</p>\n<p data-numbered=\"true\">Red Bear’s people rejoiced at their hunters’ success. Good hunters brought good to everybody. The meat meant plenty of food and the hides meant soft-tanned robes to give comfort through the Cold Moons. But it was the sight of the frail figure of the woman that aroused their curiosity. Who was she? Where had she come from? . . .</p>\n<p data-numbered=\"true\">“Belongs to Red Bear people. Gone then come back,” the hunters said, as they dismounted and unloaded their packs. . . .</p>\n<p data-numbered=\"true\">Now they could see! She was the daughter of the family gone so long ago! The girl-child who had left came back now—a grown woman.</p>\n<p data-numbered=\"true\">“Wat-ku-ese!” the women cried. “Gone-from-Home-then-Come-Back. Wat-ku-ese!” And Wat-ku-ese was her name from that time on.</p>\n<p data-numbered=\"true\">Gentle arms lifted Wat-ku-ese from her horse. The women brought her food and made a place for her to rest. For many suns they cared for her until she became stronger.</p>\n<p data-numbered=\"true\">One evening Wat-ku-ese told her story for all to hear.</p>",
    sourceNote: "From DO THEM NO HARM!: Lewis and Clark Among the Nez Perce by Zoa L. Swayne. Published by Caxton Press. Copyright © 1990 by Zoa L. Swayne Orofino, Idaho and Legacy House, Inc. Orofino, Idaho. All rights reserved.",
    text: excerptFromDoThemNoHarm2023FormAPassageText,
    versionLabel: "2022-2023 Form A",
  }),
  questions: excerptFromDoThemNoHarm2023FormAQuestions,
};
