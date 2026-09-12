import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageText = "Invasive species are scary. It was ecologist Charles Elton, back in the 1950s, who introduced the militaristic “invasion” metaphor to describe exotic plants and animals—but there’s no question some can be extremely destructive.\n\nThe brown tree snake has eaten a dozen kinds of forest birds in Guam to extinction; zebra mussels clog pipes around the Great Lakes; the common house cat turns out to be, in Australia, a mercilessly effective killer of cute, fluffy marsupials like the bilby and the numbat.\n\nAs scientists have sounded the alarm about these pests, the public has gotten the message. Citizen groups rip out non-native plants. Native gardens have become increasingly popular, both as ways to celebrate the unique flora of each region and as tiny hot spots of diversity. Native trees provide food for native bugs, which feed native birds. Food chains developed over thousands of years of co-evolution unfold in our backyards. . . .\n\nSo we’ve learned, scientists and laypeople alike, that native species are good and non-natives are bad.\n\nJulian Olden, a biologist at the University of Washington, Seattle, who co-organized the symposium, recently polled nearly 2,000 ecologists. Among his findings: a substantial number of them said they would immediately eradicate a hypothetical non-native forest plant, even if it were shown to have no effect on the forest. Olden calls this the “guilty even when proven innocent” approach.\n\nThat kind of approach is not very useful on a rapidly changing planet.\n\nExotics Are Everywhere\n\nClimate change is making it harder even to decide who the invaders are.\n\nHow, scientists at the symposium wondered, do you define “native” on a warming planet, when plants and animals are already moving toward the poles or up mountainsides in search of climate conditions they can tolerate? Should we consider them “invasive” in their new homes? Regardless of what we label them, conservationists will be reluctant to remove them from their new environs—to do so would stymie their chances of adapting to the warmer future we’re creating.\n\nAnd then there are the non-natives that we actually like. Most domestic crops are exotic in most of the places they’re grown, but there are even wild exotics that “do good,” forming useful relationships with native species.\n\nEdwin Grosholz of the University of California, Davis, told the recent symposium about one such relationship. On beaches in his state, non-native spartina grass has become important habitat for the endangered California clapper rail, a plump shorebird with a downward curving bill more at home on land than in the air. A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.\n\nThere are other examples like that. The endangered southwestern willow flycatcher nests in “invasive” tamarisk shrubs. Many native (and beautiful) Hawaiian flowers are now pollinated by the Japanese white-eye bird—because the native pollinators have been driven extinct by other non-native species.\n\nShould we impose further risk on already endangered natives by severing these relationships? Or should we admire the resilience of nature and let such “well-behaved” exotics stay? . . .\n\nLeave them alone, more and more conservationists are arguing, and stop focusing obsessively on categorizing species as native or non-native. Mark Davis, an ecologist at Macalester College in St. Paul, Minnesota, once considered himself an “invasion biologist”—but not anymore. “I am actively trying to get the field to retire the invader narrative,” he said in Missoula.\n\nA Good Thing, Not the Only Thing\n\nAfter all, nativeness is just one environmental value, and arguably not as important as preventing extinctions and preserving biodiversity. In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.\n\nThis is the thinking behind, for example, installing the Aldabra tortoise on the islands of Mauritius. The islands lost their own large tortoises, and the fruiting plants that formerly had their seeds moved around by these fruit-loving reptiles have been on the decline. A tortoise that’s related to the island’s large tortoises—a non-native from the Seychelles in the Indian Ocean that was intentionally introduced in 2004—is now handling some of that work.\n\nMost of the time, for the time being, conserving species still means focusing on supporting them in their historical habitats, planting natives and removing non-natives. We can and should do that in places where it is feasible and important to us.";

const excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-1",
    "points": 1,
    "prompt": "Which sentence from the excerpt supports the conclusion that Elton’s “militaristic ‘invasion’ metaphor” (paragraph 1) has influenced scientific understanding of non-native species?",
    "promptHtml": "Which&nbsp;sentence&nbsp;from the excerpt&nbsp;supports&nbsp;the conclusion that Elton’s “militaristic ‘invasion’ metaphor”&nbsp;(paragraph&nbsp;1)&nbsp;has influenced scientific&nbsp;understanding&nbsp;of non-native species?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“Among [Olden’s] findings: a substantial number of them said they would immediately eradicate a hypothetical non-native forest plant, even if it were shown to have no effect on the forest.”&nbsp;(paragraph&nbsp;5)",
        "text": "“Among [Olden’s] findings: a substantial number of them said they would immediately eradicate a hypothetical non-native forest plant, even if it were shown to have no effect on the forest.” (paragraph 5)"
      },
      {
        "id": "B",
        "html": "“Regardless of what we label them, conservationists will be reluctant to remove them from their new environs—to do so would stymie their chances of adapting to the warmer future we’re creating.”&nbsp;(paragraph&nbsp;8)",
        "text": "“Regardless of what we label them, conservationists will be reluctant to remove them from their new environs—to do so would stymie their chances of adapting to the warmer future we’re creating.” (paragraph 8)"
      },
      {
        "id": "C",
        "html": "“A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.”&nbsp;(paragraph&nbsp;10)",
        "text": "“A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.” (paragraph 10)"
      },
      {
        "id": "D",
        "html": "“In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.”&nbsp;(paragraph&nbsp;14)",
        "text": "“In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.” (paragraph 14)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-2",
    "points": 1,
    "prompt": "Which detail provides the most relevant support for the claim that “climate change is making it harder even to decide who the invaders are” (paragraph 7)?",
    "promptHtml": "Which&nbsp;detail&nbsp;provides the&nbsp;<strong>most</strong>&nbsp;relevant&nbsp;support&nbsp;for the&nbsp;claim&nbsp;that “climate change is making it harder even to decide who the invaders are”&nbsp;(paragraph&nbsp;7)?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "the mention in&nbsp;paragraph&nbsp;8&nbsp;of non-native species that are forced to seek new habitats",
        "text": "the mention in paragraph 8 of non-native species that are forced to seek new habitats"
      },
      {
        "id": "B",
        "html": "the acknowledgment in&nbsp;paragraph&nbsp;9&nbsp;that non-native species include many domestic crops",
        "text": "the acknowledgment in paragraph 9 that non-native species include many domestic crops"
      },
      {
        "id": "C",
        "html": "the&nbsp;description&nbsp;in&nbsp;paragraph&nbsp;11&nbsp;of the interactions between native and non-native species",
        "text": "the description in paragraph 11 of the interactions between native and non-native species"
      },
      {
        "id": "D",
        "html": "the&nbsp;account&nbsp;in&nbsp;paragraph&nbsp;13&nbsp;of an ecologist&nbsp;who&nbsp;changed his beliefs about non-native species",
        "text": "the account in paragraph 13 of an ecologist who changed his beliefs about non-native species"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-3",
    "points": 1,
    "prompt": "Which two phrases from paragraph 3 most affect the tone of the excerpt?",
    "promptHtml": "Which&nbsp;<strong>two</strong>&nbsp;phrases&nbsp;from&nbsp;paragraph&nbsp;3&nbsp;<strong>most</strong>&nbsp;affect the&nbsp;tone&nbsp;of the excerpt?",
    "topic": "Tone & Mood",
    "categories": [
      {
        "id": "category-1",
        "title": "Phrases That Most Affect the Tone of the Excerpt"
      }
    ],
    "correctPlacements": {
      "item-1": "category-1",
      "item-3": "category-1"
    },
    "instructions": "Move the two correct answers to the box.",
    "items": [
      {
        "html": "<strong>“sounded the alarm”</strong>",
        "id": "item-1",
        "text": "“sounded the alarm”"
      },
      {
        "html": "<strong>“gotten the message”</strong>",
        "id": "item-2",
        "text": "“gotten the message”"
      },
      {
        "html": "<strong>“rip out”</strong>",
        "id": "item-3",
        "text": "“rip out”"
      },
      {
        "html": "<strong>“become increasingly popular”</strong>",
        "id": "item-4",
        "text": "“become increasingly popular”"
      },
      {
        "html": "<strong>“provide food”</strong>",
        "id": "item-5",
        "text": "“provide food”"
      }
    ],
    "requiredPlacements": 2,
    "type": "category_sort"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-4",
    "points": 1,
    "prompt": "Which sentence from the excerpt supports the idea that some species are able to adjust to change?",
    "promptHtml": "Which&nbsp;sentence&nbsp;from the excerpt&nbsp;supports&nbsp;the idea that some species are able to adjust to change?",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "“Native gardens have become increasingly popular, both as ways to celebrate the unique flora of each region and as tiny hot spots of diversity.”&nbsp;(paragraph&nbsp;3)",
        "text": "“Native gardens have become increasingly popular, both as ways to celebrate the unique flora of each region and as tiny hot spots of diversity.” (paragraph 3)"
      },
      {
        "id": "B",
        "html": "“Many native (and beautiful) Hawaiian flowers are now pollinated by the Japanese white-eye bird—because the native pollinators have been driven extinct by other non-native species.”&nbsp;(paragraph&nbsp;11)",
        "text": "“Many native (and beautiful) Hawaiian flowers are now pollinated by the Japanese white-eye bird—because the native pollinators have been driven extinct by other non-native species.” (paragraph 11)"
      },
      {
        "id": "C",
        "html": "“After all, nativeness is just one environmental value, and arguably not as important as preventing extinctions and preserving biodiversity.”&nbsp;(paragraph&nbsp;14)",
        "text": "“After all, nativeness is just one environmental value, and arguably not as important as preventing extinctions and preserving biodiversity.” (paragraph 14)"
      },
      {
        "id": "D",
        "html": "“The islands lost their own large tortoises, and the fruiting plants that formerly had their seeds moved around by these fruit-loving reptiles have been on the decline.”&nbsp;(paragraph&nbsp;15)",
        "text": "“The islands lost their own large tortoises, and the fruiting plants that formerly had their seeds moved around by these fruit-loving reptiles have been on the decline.” (paragraph 15)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-5",
    "points": 1,
    "prompt": "The details in the section “A Good Thing, Not the Only Thing” convey a central idea of the excerpt by suggesting that",
    "promptHtml": "The&nbsp;details&nbsp;in the section “A Good Thing, Not the Only Thing” convey a central idea of the excerpt by suggesting that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "some non-native species can replace native species that are unable to survive on their own.",
        "text": "some non-native species can replace native species that are unable to survive on their own."
      },
      {
        "id": "B",
        "html": "decisions about whether to keep non-native species should be considered on an individual basis.",
        "text": "decisions about whether to keep non-native species should be considered on an individual basis."
      },
      {
        "id": "C",
        "html": "the scientists&nbsp;who&nbsp;study rapidly changing ecosystems agree that non-native species enhance biodiversity.",
        "text": "the scientists who study rapidly changing ecosystems agree that non-native species enhance biodiversity."
      },
      {
        "id": "D",
        "html": "a natural habitat that is healthy should be able to&nbsp;support&nbsp;a blend of native and non-native species.",
        "text": "a natural habitat that is healthy should be able to support a blend of native and non-native species."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-6",
    "points": 1,
    "prompt": "Climate change has affected efforts to manage invasive species mainly by causing ecologists to",
    "promptHtml": "Climate change has affected efforts to manage invasive species&nbsp;<strong>mainly</strong>&nbsp;by causing ecologists to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "call upon the public to be more tolerant of the presence of non-native species.",
        "text": "call upon the public to be more tolerant of the presence of non-native species."
      },
      {
        "id": "B",
        "html": "admit that past attempts to eliminate non-native species have damaged the environment.",
        "text": "admit that past attempts to eliminate non-native species have damaged the environment."
      },
      {
        "id": "C",
        "html": "find ways of ensuring that native species are not harmed by the arrival of new species.",
        "text": "find ways of ensuring that native species are not harmed by the arrival of new species."
      },
      {
        "id": "D",
        "html": "acknowledge that it is not realistic for some species to remain in their native habitats.",
        "text": "acknowledge that it is not realistic for some species to remain in their native habitats."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-7",
    "points": 1,
    "prompt": "How does the chart provide additional support for a central idea of the excerpt?",
    "promptHtml": "How&nbsp;does the&nbsp;chart&nbsp;provide additional&nbsp;support&nbsp;for a central idea of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "by implying that the public becomes aware of non-native species only after removal is impossible",
        "text": "by implying that the public becomes aware of non-native species only after removal is impossible"
      },
      {
        "id": "B",
        "html": "by showing that the complete removal of non-native species is usually not achievable after a certain period of time",
        "text": "by showing that the complete removal of non-native species is usually not achievable after a certain period of time"
      },
      {
        "id": "C",
        "html": "by demonstrating&nbsp;why&nbsp;non-native species can be destructive if they are not removed from an area immediately",
        "text": "by demonstrating why non-native species can be destructive if they are not removed from an area immediately"
      },
      {
        "id": "D",
        "html": "by explaining&nbsp;how&nbsp;some conservation groups have approached the removal of non-native species",
        "text": "by explaining how some conservation groups have approached the removal of non-native species"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-8",
    "points": 1,
    "prompt": "Determine whether each sentence from the excerpt presents a claim or presents evidence to support a claim.",
    "promptHtml": "Determine whether each&nbsp;sentence&nbsp;from the excerpt presents a&nbsp;claim&nbsp;or presents&nbsp;evidence&nbsp;to&nbsp;support&nbsp;a claim.",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "column-1",
        "title": "Presents a Claim"
      },
      {
        "id": "column-2",
        "title": "Presents Evidence"
      }
    ],
    "correctPlacements": {
      "item-1": "column-1",
      "item-2": "column-2",
      "item-3": "column-1",
      "item-4": "column-2"
    },
    "instructions": "Select all the correct answers.",
    "items": [
      {
        "html": "“That kind of approach is not very useful on a rapidly changing planet.”&nbsp;(paragraph 6)",
        "id": "item-1",
        "text": "“That kind of approach is not very useful on a rapidly changing planet.” (paragraph 6)"
      },
      {
        "html": "“A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.”&nbsp;(paragraph 10)",
        "id": "item-2",
        "text": "“A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.” (paragraph 10)"
      },
      {
        "html": "“In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.”&nbsp;(paragraph 14)",
        "id": "item-3",
        "text": "“In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.” (paragraph 14)"
      },
      {
        "html": "“A tortoise that’s related to the island’s large tortoises—a non-native from the Seychelles in the Indian Ocean that was intentionally introduced in 2004—is now handling some of that work.”&nbsp;(paragraph 15)",
        "id": "item-4",
        "text": "“A tortoise that’s related to the island’s large tortoises—a non-native from the Seychelles in the Indian Ocean that was intentionally introduced in 2004—is now handling some of that work.” (paragraph 15)"
      }
    ],
    "requiredPlacements": 4,
    "tableHeaders": {
      "answer": "Answer",
      "row": "Sentence"
    },
    "type": "matrix_choice"
  }
];

export const excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil",
  questionCount: excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil",
    title: "Excerpt from “It’s Time to Stop Thinking That All Non-Native Species Are Evil”",
    author: "Emma Marris",
    blurb: "The author of this opinion article attended a symposium, or conference, in Missoula, Montana, at which biologists and other scientists discussed species of plants and animals that are not native to the areas in which they live.",
    image: {"alt":"Excerpt from “It’s Time to Stop Thinking That All Non-Native Species Are Evil” illustration","src":"/exam-images/excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-passage.svgz"},
    passageType: "informational",
    richText: "<p>Invasive species are scary. It was ecologist Charles Elton, back in the 1950s, who introduced the militaristic “invasion” metaphor to describe exotic plants and animals—but there’s no question some can be extremely destructive.</p><p>The brown tree snake has eaten a dozen kinds of forest birds in Guam to extinction; zebra mussels clog pipes around the Great Lakes; the common house cat turns out to be, in Australia, a mercilessly effective killer of cute, fluffy marsupials like the bilby and the numbat.</p><p>As scientists have sounded the alarm about these pests, the public has gotten the message. Citizen groups rip out non-native plants. Native gardens have become increasingly popular, both as ways to celebrate the unique flora of each region and as tiny hot spots of diversity. Native trees provide food for native bugs, which feed native birds. Food chains developed over thousands of years of&nbsp;co-evolution&nbsp;unfold in our&nbsp;backyards. . . .</p><p>So we’ve learned, scientists and laypeople alike, that native species are good and non-natives are bad.</p><p>Julian Olden, a biologist at the University of Washington, Seattle, who&nbsp;co-organized&nbsp;the symposium, recently polled nearly 2,000 ecologists. Among his findings: a substantial number of them said they would immediately eradicate a hypothetical non-native forest plant, even if it were shown to have no effect on the forest. Olden calls this the “guilty even when proven innocent” approach.</p><p>That kind of approach is not very useful on a rapidly changing planet.</p><p><strong>Exotics Are Everywhere</strong></p><p>Climate change is making it harder even to decide who the invaders are.</p><p>How, scientists at the symposium wondered, do you define “native” on a warming planet, when plants and animals are already moving toward the poles or up mountainsides in search of climate conditions they can tolerate? Should we consider them “invasive” in their new homes? Regardless of what we label them, conservationists will be reluctant to remove them from their new environs—to do so would&nbsp;stymie&nbsp;their chances of adapting to the warmer future we’re creating.</p><p>And then there are the non-natives that we actually like. Most domestic crops are exotic in most of the places they’re grown, but there are even wild exotics that “do good,” forming useful relationships with native species.</p><p>Edwin Grosholz of the University of California, Davis, told the recent symposium about one such relationship. On beaches in his state, non-native spartina grass has become important habitat for the endangered California clapper rail, a plump shorebird with a downward curving bill more at home on land than in the air. A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.</p><p>There are other examples like that. The endangered southwestern willow flycatcher nests in “invasive” tamarisk shrubs. Many native (and beautiful) Hawaiian flowers are now pollinated by the Japanese white-eye bird—because the native pollinators have been driven extinct by other non-native species.</p><p>Should we impose further risk on already endangered natives by severing these relationships? Or should we admire the resilience of nature and let such “well-behaved” exotics&nbsp;stay? . . .</p><p>Leave them alone, more and more conservationists are arguing, and stop focusing obsessively on categorizing species as native or non-native. Mark Davis, an ecologist at Macalester College in&nbsp;St. Paul,&nbsp;Minnesota, once considered himself an “invasion biologist”—but not anymore. “I am actively trying to get the field to retire the invader narrative,” he said in Missoula.</p><p><strong>A Good Thing, Not the Only Thing</strong></p><p>After all, nativeness is just one environmental value, and arguably not as important as preventing extinctions and preserving biodiversity. In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.</p><p>This is the thinking behind, for example, installing the Aldabra tortoise on the islands of Mauritius. The islands lost their own large tortoises, and the fruiting plants that formerly had their seeds moved around by these fruit-loving reptiles have been on the decline. A tortoise that’s related to the island’s large tortoises—a non-native from the Seychelles in the Indian Ocean that was intentionally introduced in 2004—is now handling some of that work.</p><p>Most of the time, for the time being, conserving species still means focusing on supporting them in their historical habitats, planting natives and removing non-natives. We can and should do that in places where it is feasible and important to us.</p><p>\n\n</p>",
    sourceNote: "From “It’s Time to Stop Thinking That All Non-Native Species Are Evil” by Emma Marris from NATIONAL GEOGRAPHIC MAGAZINE, July 24, 2014. Copyright © 2014 by National Geographic Society.",
    text: excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageText,
  }),
  questions: excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilQuestions,
};
