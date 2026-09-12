import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const usingFireToKeepAPrairieHealthyPassageText = "Inside the 40,000-acre Joseph H. Williams Tallgrass Prairie Preserve in northern Oklahoma, herds of bison roam on the scenic land that is home to hundreds of different species of plants and animals. While one of the greatest threats to the prairie is wildfire, the use of controlled fires is actually an effective way to protect this idyllic landscape.\n\nFires that are started by lightning or other natural circumstances are inevitable, and the results can be disastrous. However, hundreds of years ago the American Indian people who inhabited the Great Plains area between Minnesota and Texas realized that these fires could also be helpful. The bison in the area seemed to prefer grazing on tender new grass on the recently burned land rather than on grass in the unburned areas. The American Indian people began to deliberately burn areas of land for bison to graze on, which enticed the herds away from the people’s crops.\n\nToday conservationists at the Tallgrass Prairie Preserve and farmers in the Great Plains continue to use controlled burns for land management. Intentionally burning a portion of land can dramatically improve the quality of the vegetation that regrows there. The fires burn away weedy undergrowth and help limit the overcrowding of shrubs and trees in the burn area, creating less competition for water and nutrients. Additionally, the process of burning excess plant matter adds nitrogen, an essential element for plant growth, to the soil.\n\nOne common target of controlled burns at the preserve and the surrounding area is the invasive red cedar tree. A single red cedar tree can consume up to 40 gallons of water per day, taking this vital resource away from other plant life. These tall trees also cast shade that prevents sunlight from reaching the plants beneath them. The fast-growing red cedar trees tend to crowd out prairie grasses, the primary food source for wild and domestic animals that make the prairie their home. An imbalance in one component of the prairie’s ecosystem affects the entire web of life. Controlled burns help maintain this ecosystem’s delicate balance.\n\nOf course, these controlled fires are intended to burn only a portion of an area. A total burn, which is a risk with an uncontrolled wildfire, would destroy all wildlife as well as the crops farmers plant for income. The key to using controlled fires is knowing which areas of land to burn and when. Conservation experts at the preserve employ the “patch-burn” approach, meaning they rotate which portion of land is burned each year. They study the land to find out which areas would most benefit from being burned, and then they arrange about a dozen burns over one-third of the land. This patch burning contains the fire within a specific area and allows animals in the burn area to safely relocate. The following year, conservationists will burn a different section of the preserve, while the land burned the previous year regrows healthier than before.\n\nResearchers have tracked and studied the variety of plant species and animals that live on the preserve, and their studies show that the patch-burn approach has restored biodiversity to the area by promoting the growth of species that were at risk of being crowded out. The patch-burn system is so successful that the conservationists at the preserve provide training to prairie farmers about conducting controlled burns on their own land. Burning land to make it healthy may seem counterintuitive, but strategic controlled fires have helped the prairie sustain life for hundreds of years and, with careful management, will continue to do so.";

const usingFireToKeepAPrairieHealthyQuestions: ExamQuestion[] = [
  {
    "id": "using-fire-to-keep-a-prairie-healthy-1",
    "points": 1,
    "prompt": "According to the passage, how did fires started by natural causes prompt American Indians to begin practicing controlled burns?",
    "promptHtml": "According to the&nbsp;passage,&nbsp;how&nbsp;did fires started by natural&nbsp;causes&nbsp;prompt American Indians to begin practicing controlled burns?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "by drawing animals in to the area to feed on the new growth sprouting from the burned land",
        "text": "by drawing animals in to the area to feed on the new growth sprouting from the burned land"
      },
      {
        "id": "B",
        "html": "by destroying tall trees and reducing the shade that had hindered the growth of planted crops",
        "text": "by destroying tall trees and reducing the shade that had hindered the growth of planted crops"
      },
      {
        "id": "C",
        "html": "by burning off excess vegetation and increasing the availability of nutrients for the remaining plants",
        "text": "by burning off excess vegetation and increasing the availability of nutrients for the remaining plants"
      },
      {
        "id": "D",
        "html": "by&nbsp;causing&nbsp;changes to the bison’s migration habits as bison herds fled from the wildfires on the prairie",
        "text": "by causing changes to the bison’s migration habits as bison herds fled from the wildfires on the prairie"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-2",
    "points": 1,
    "prompt": "Targeting red cedar trees in controlled burns affects the animals that live on the prairie mostly by",
    "promptHtml": "Targeting red cedar trees in controlled burns affects the animals that live on the prairie&nbsp;mostly&nbsp;by",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "ensuring that the animals’&nbsp;main&nbsp;food&nbsp;source&nbsp;has the conditions needed for it to thrive.",
        "text": "ensuring that the animals’ main food source has the conditions needed for it to thrive."
      },
      {
        "id": "B",
        "html": "endangering the animals that live near the trees scheduled for removal.",
        "text": "endangering the animals that live near the trees scheduled for removal."
      },
      {
        "id": "C",
        "html": "making sure that the water supply for the animals is sufficient.",
        "text": "making sure that the water supply for the animals is sufficient."
      },
      {
        "id": "D",
        "html": "reducing the animals’ natural&nbsp;source&nbsp;of shade and protection from the elements.",
        "text": "reducing the animals’ natural source of shade and protection from the elements."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-3",
    "points": 1,
    "prompt": "Read this sentence from paragraph 6.\nThe patch-burn system is so successful that the conservationists at the preserve provide training to prairie farmers about conducting controlled burns on their own land.\nThe author includes this sentence to show that",
    "promptHtml": "Read&nbsp;this&nbsp;sentence&nbsp;from&nbsp;paragraph&nbsp;6.<br><strong>The patch-burn system is so successful that the conservationists at the preserve provide training to prairie farmers about conducting controlled burns on their own land.</strong><br>The&nbsp;author&nbsp;includes this sentence to&nbsp;show&nbsp;that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "the conservationists are better qualified to lead preservation efforts than farmers are.",
        "text": "the conservationists are better qualified to lead preservation efforts than farmers are."
      },
      {
        "id": "B",
        "html": "the conservationists are eager to involve others in the preservation of the prairie.",
        "text": "the conservationists are eager to involve others in the preservation of the prairie."
      },
      {
        "id": "C",
        "html": "the conservationists’ efforts will restore the original beauty and biodiversity of the region.",
        "text": "the conservationists’ efforts will restore the original beauty and biodiversity of the region."
      },
      {
        "id": "D",
        "html": "the conservationists’ training program should serve as a model for other conservation organizations.",
        "text": "the conservationists’ training program should serve as a model for other conservation organizations."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-4",
    "points": 1,
    "prompt": "Which details from the passage best convey the central idea that using the patch-burn method is an effective way to protect and manage prairie land?",
    "promptHtml": "Which&nbsp;details&nbsp;from the&nbsp;passage&nbsp;<strong>best</strong>&nbsp;convey the central idea that using the patch-burn method is an effective way to protect and manage prairie land?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "the explanation that conservationists&nbsp;use&nbsp;the alternating burn pattern of the patch-burn method in order to allow the animals in the area to avoid the fire",
        "text": "the explanation that conservationists use the alternating burn pattern of the patch-burn method in order to allow the animals in the area to avoid the fire"
      },
      {
        "id": "B",
        "html": "the information that conservationists evaluate&nbsp;which&nbsp;land would&nbsp;most&nbsp;benefit from a controlled burn&nbsp;before&nbsp;applying the patch-burn method",
        "text": "the information that conservationists evaluate which land would most benefit from a controlled burn before applying the patch-burn method"
      },
      {
        "id": "C",
        "html": "the information that conservationists have determined that the patch-burn method has promoted the growth of species that were at risk of being crowded out",
        "text": "the information that conservationists have determined that the patch-burn method has promoted the growth of species that were at risk of being crowded out"
      },
      {
        "id": "D",
        "html": "the explanation that conservationists are able to control the fire in the patch-burn method by arranging separate burns across the designated portion of land",
        "text": "the explanation that conservationists are able to control the fire in the patch-burn method by arranging separate burns across the designated portion of land"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-5",
    "points": 1,
    "prompt": "Which sentence supports the idea that farmers and people who manage land may be concerned about using fire as a way to benefit the land?",
    "promptHtml": "Which&nbsp;sentence&nbsp;supports&nbsp;the idea that farmers and people&nbsp;who&nbsp;manage land may be concerned about&nbsp;using&nbsp;fire as a way to benefit the land?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“While one of the greatest threats to the prairie is wildfire, the use of controlled fires is actually an effective way to protect this idyllic landscape.”&nbsp;(paragraph&nbsp;1)",
        "text": "“While one of the greatest threats to the prairie is wildfire, the use of controlled fires is actually an effective way to protect this idyllic landscape.” (paragraph 1)"
      },
      {
        "id": "B",
        "html": "“The American Indian people began to deliberately burn areas of land for bison to graze on, which enticed the herds away from the people’s crops.”&nbsp;(paragraph&nbsp;2)",
        "text": "“The American Indian people began to deliberately burn areas of land for bison to graze on, which enticed the herds away from the people’s crops.” (paragraph 2)"
      },
      {
        "id": "C",
        "html": "“This patch burning contains the fire within a specific area and allows animals in the burn area to safely relocate.”&nbsp;(paragraph&nbsp;5)",
        "text": "“This patch burning contains the fire within a specific area and allows animals in the burn area to safely relocate.” (paragraph 5)"
      },
      {
        "id": "D",
        "html": "“The following year, conservationists will burn a different section of the preserve, while the land burned the previous year regrows healthier than before.”&nbsp;(paragraph&nbsp;5)",
        "text": "“The following year, conservationists will burn a different section of the preserve, while the land burned the previous year regrows healthier than before.” (paragraph 5)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-6",
    "points": 1,
    "prompt": "Read this sentence from paragraph 6.\nBurning land to make it healthy may seem counterintuitive, but strategic controlled fires have helped the prairie sustain life for hundreds of years and, with careful management, will continue to do so.\nThe words “counterintuitive” and “strategic” in the sentence convey the idea that",
    "promptHtml": "Read&nbsp;this&nbsp;sentence&nbsp;from&nbsp;paragraph&nbsp;6.<br><strong>Burning land to make it healthy may seem counterintuitive, but strategic controlled fires have helped the prairie sustain life for hundreds of years and, with careful management, will continue to do so.</strong><br>The&nbsp;words&nbsp;“counterintuitive” and “strategic” in the sentence convey the idea that",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "the safest methods are sometimes the least effective at solving complex challenges.",
        "text": "the safest methods are sometimes the least effective at solving complex challenges."
      },
      {
        "id": "B",
        "html": "thorough investigation of uncommon methodologies can lead to beneficial results.",
        "text": "thorough investigation of uncommon methodologies can lead to beneficial results."
      },
      {
        "id": "C",
        "html": "detailed&nbsp;planning&nbsp;can ensure that a potentially destructive&nbsp;action&nbsp;has a positive impact.",
        "text": "detailed planning can ensure that a potentially destructive action has a positive impact."
      },
      {
        "id": "D",
        "html": "plans&nbsp;that entail a certain amount of risk almost always result in success.",
        "text": "plans that entail a certain amount of risk almost always result in success."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-7",
    "points": 1,
    "prompt": "With which statement would the author most likely agree?",
    "promptHtml": "With&nbsp;which&nbsp;statement&nbsp;would the&nbsp;author&nbsp;<strong>most likely</strong>&nbsp;agree?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "html": "It is important to&nbsp;explain&nbsp;the purposes and the risks of controlled burns to the people living near a proposed burn area.",
        "text": "It is important to explain the purposes and the risks of controlled burns to the people living near a proposed burn area."
      },
      {
        "id": "B",
        "html": "It is necessary to thoroughly examine a particular region in order to&nbsp;plan&nbsp;and execute a successful controlled burn.",
        "text": "It is necessary to thoroughly examine a particular region in order to plan and execute a successful controlled burn."
      },
      {
        "id": "C",
        "html": "Monitoring animals’ reactions after a controlled burn on the prairie is a minor part of scientists’&nbsp;research.",
        "text": "Monitoring animals’ reactions after a controlled burn on the prairie is a minor part of scientists’ research."
      },
      {
        "id": "D",
        "html": "Conservationists should consider the helpful aspects of invasive species&nbsp;before&nbsp;executing a controlled burn.",
        "text": "Conservationists should consider the helpful aspects of invasive species before executing a controlled burn."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "using-fire-to-keep-a-prairie-healthy-8",
    "points": 1,
    "prompt": "How do the diagram and its text provide additional support for the topic presented in the passage?",
    "promptHtml": "How&nbsp;do the diagram and its&nbsp;text&nbsp;provide additional&nbsp;support&nbsp;for the&nbsp;topic&nbsp;presented in the&nbsp;passage?",
    "topic": "Tone & Mood",
    "choices": [
      {
        "id": "A",
        "html": "by depicting&nbsp;how&nbsp;the landscape in a given area changes as the patch-burn method is applied",
        "text": "by depicting how the landscape in a given area changes as the patch-burn method is applied"
      },
      {
        "id": "B",
        "html": "by indicating that patch-burn fires are&nbsp;best&nbsp;suited for&nbsp;use&nbsp;in areas&nbsp;with&nbsp;certain features",
        "text": "by indicating that patch-burn fires are best suited for use in areas with certain features"
      },
      {
        "id": "C",
        "html": "by revealing that the patch-burn method is&nbsp;used&nbsp;primarily on uninhabited areas of land",
        "text": "by revealing that the patch-burn method is used primarily on uninhabited areas of land"
      },
      {
        "id": "D",
        "html": "by comparing the size of the area burned by the patch-burn method&nbsp;with&nbsp;that of unburned areas",
        "text": "by comparing the size of the area burned by the patch-burn method with that of unburned areas"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const usingFireToKeepAPrairieHealthyPassageSet: ExamPassageSet = {
  id: "ela-using-fire-to-keep-a-prairie-healthy",
  questionCount: usingFireToKeepAPrairieHealthyQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "using-fire-to-keep-a-prairie-healthy",
    title: "Using Fire to Keep a Prairie Healthy",
    image: {"alt":"Using Fire to Keep a Prairie Healthy illustration","src":"/exam-images/using-fire-to-keep-a-prairie-healthy-passage.svgz"},
    passageType: "informational",
    richText: "<p>Inside the&nbsp;40,000-acre&nbsp;Joseph H. Williams Tallgrass Prairie Preserve in northern Oklahoma, herds of bison roam on the scenic land that is home to hundreds of different species of plants and animals. While one of the greatest threats to the prairie is wildfire, the use of controlled fires is actually an effective way to protect this idyllic landscape.</p><p>Fires that are started by lightning or other natural circumstances are inevitable, and the results can be disastrous. However, hundreds of years ago the American Indian people who inhabited the Great Plains area between Minnesota and Texas realized that these fires could also be helpful. The bison in the area seemed to prefer grazing on tender new grass on the recently burned land rather than on grass in the unburned areas. The American Indian people began to deliberately burn areas of land for bison to graze on, which enticed the herds away from the people’s crops.</p><p><strong>T</strong>oday conservationists at the Tallgrass Prairie Preserve and farmers in the Great Plains continue to use controlled burns for land management. Intentionally burning a portion of land can dramatically improve the quality of the vegetation that regrows there. The fires burn away weedy undergrowth and help limit the overcrowding of shrubs and trees in the burn area, creating less competition for water and nutrients. Additionally, the process of burning excess plant matter adds nitrogen, an essential element for plant growth, to the soil.</p><p>One common target of controlled burns at the preserve and the surrounding area is the invasive red cedar tree. A single red cedar tree can consume up to&nbsp;40 gallons&nbsp;of water per day, taking this vital resource away from other plant life. These tall trees also cast shade that prevents sunlight from reaching the plants beneath them. The fast-growing red cedar trees tend to crowd out prairie grasses, the primary food source for wild and domestic animals that make the prairie their home. An imbalance in one component of the prairie’s ecosystem affects the entire web of life. Controlled burns help maintain this ecosystem’s delicate balance.</p><p>Of course, these controlled fires are intended to burn only a portion of an area. A total burn, which is a risk with an uncontrolled wildfire, would destroy all wildlife as well as the crops farmers plant for income. The key to using controlled fires is knowing which areas of land to burn and when. Conservation experts at the preserve employ the “patch-burn” approach, meaning they rotate which portion of land is burned each year. They study the land to find out which areas would most benefit from being burned, and then they arrange about a dozen burns over&nbsp;one-third&nbsp;of the land. This patch burning contains the fire within a specific area and allows animals in the burn area to safely relocate. The following year, conservationists will burn a different section of the preserve, while the land burned the previous year regrows healthier than before.</p><p>Researchers have tracked and studied the variety of plant species and animals that live on the preserve, and their studies show that the patch-burn approach has restored biodiversity to the area by promoting the growth of species that were at risk of being crowded out. The patch-burn system is so successful that the conservationists at the preserve provide training to prairie farmers about conducting controlled burns on their own land. Burning land to make it healthy may seem counterintuitive, but strategic controlled fires have helped the prairie sustain life for hundreds of years and, with careful management, will continue to do so.</p><p>\n\n</p>",
    text: usingFireToKeepAPrairieHealthyPassageText,
    versionLabel: "2025-2026 Form B",
  }),
  questions: usingFireToKeepAPrairieHealthyQuestions,
};
