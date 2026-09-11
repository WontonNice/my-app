import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilPassageText = "Invasive species are scary. It was ecologist Charles Elton, back in the 1950s, who introduced the militaristic “invasion” metaphor to describe exotic plants and animals—but there’s no question some can be extremely destructive.\n\nThe brown tree snake has eaten a dozen kinds of forest birds in Guam to extinction; zebra mussels clog pipes around the Great Lakes; the common house cat turns out to be, in Australia, a mercilessly effective killer of cute, fluffy marsupials like the bilby and the numbat.\n\nAs scientists have sounded the alarm about these pests, the public has gotten the message. Citizen groups rip out non-native plants. Native gardens have become increasingly popular, both as ways to celebrate the unique flora of each region and as tiny hot spots of diversity. Native trees provide food for native bugs, which feed native birds. Food chains developed over thousands of years of co-evolution unfold in our backyards. . . .\n\nSo we’ve learned, scientists and laypeople alike, that native species are good and non-natives are bad.\n\nJulian Olden, a biologist at the University of Washington, Seattle, who co-organized the symposium, recently polled nearly 2,000 ecologists. Among his findings: a substantial number of them said they would immediately eradicate a hypothetical non-native forest plant, even if it were shown to have no effect on the forest. Olden calls this the “guilty even when proven innocent” approach.\n\nThat kind of approach is not very useful on a rapidly changing planet.\n\nExotics Are Everywhere\n\nClimate change is making it harder even to decide who the invaders are.\n\nHow, scientists at the symposium wondered, do you define “native” on a warming planet, when plants and animals are already moving toward the poles or up mountainsides in search of climate conditions they can tolerate? Should we consider them “invasive” in their new homes? Regardless of what we label them, conservationists will be reluctant to remove them from their new environs—to do so would stymie their chances of adapting to the warmer future we’re creating.\n\nAnd then there are the non-natives that we actually like. Most domestic crops are exotic in most of the places they’re grown, but there are even wild exotics that “do good,” forming useful relationships with native species.\n\nEdwin Grosholz of the University of California, Davis, told the recent symposium about one such relationship. On beaches in his state, non-native spartina grass has become important habitat for the endangered California clapper rail, a plump shorebird with a downward curving bill more at home on land than in the air. A project to rip out and poison the spartina—which grows in dense swaths that exclude many other shorebirds—saw clapper rail numbers go tumbling downward.\n\nThere are other examples like that. The endangered southwestern willow flycatcher nests in “invasive” tamarisk shrubs. Many native (and beautiful) Hawaiian flowers are now pollinated by the Japanese white-eye bird—because the native pollinators have been driven extinct by other non-native species.\n\nShould we impose further risk on already endangered natives by severing these relationships? Or should we admire the resilience of nature and let such “well-behaved” exotics stay? . . .\n\nLeave them alone, more and more conservationists are arguing, and stop focusing obsessively on categorizing species as native or non-native. Mark Davis, an ecologist at Macalester College in St. Paul, Minnesota, once considered himself an “invasion biologist”—but not anymore. “I am actively trying to get the field to retire the invader narrative,” he said in Missoula.\n\nA Good Thing, Not the Only Thing\n\nAfter all, nativeness is just one environmental value, and arguably not as important as preventing extinctions and preserving biodiversity. In some cases we can best serve biodiversity by leaving the non-natives alone or even—brace yourself, now—introducing them on purpose.\n\nThis is the thinking behind, for example, installing the Aldabra tortoise on the islands of Mauritius. The islands lost their own large tortoises, and the fruiting plants that formerly had their seeds moved around by these fruit-loving reptiles have been on the decline. A tortoise that’s related to the island’s large tortoises—a non-native from the Seychelles in the Indian Ocean that was intentionally introduced in 2004—is now handling some of that work.\n\nMost of the time, for the time being, conserving species still means focusing on supporting them in their historical habitats, planting natives and removing non-natives. We can and should do that in places where it is feasible and important to us.";

const excerptFromItSTimeToStopThinkingThatAllNonNativeSpeciesAreEvilQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-it-s-time-to-stop-thinking-that-all-non-native-species-are-evil-1",
    "points": 1,
    "prompt": "Which sentence from the excerpt supports the conclusion that Elton’s “militaristic ‘invasion’ metaphor” (paragraph 1) has influenced scientific understanding of non-native species?",
    "promptHtml": "Which&nbsp;sentence&nbsp;from the excerpt&nbsp;supports&nbsp;the conclusion that Elton’s “militaristic ‘invasion’ metaphor”&nbsp;(paragraph&nbsp;1)&nbsp;has influenced scientific&nbsp;understanding&nbsp;of non-native species?",
    "topic": "Central Idea & Theme",
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
    "topic": "Central Idea & Theme",
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
