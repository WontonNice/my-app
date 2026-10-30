import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromRoomToRoamDigitalShsatPracticeTest5PassageText = "For decades, the stretch of the Trans-Canada Highway running through Banff National Park in Alberta was one of the deadliest roads in North America for wildlife. Elk, deer, and the occasional grizzly bear wandered onto the pavement at dusk, when headlights caught them too late for cars to stop. Collisions were common enough that highway crews kept a running count, and biologists worried that busy roads were quietly cutting large mammal populations into isolated, shrinking pockets, cut off from mates and food sources on the other side of the asphalt.\n\nIn 1996, Parks Canada tried something that had barely been attempted anywhere in the world at that scale: it began building bridges meant for animals, not cars. The structures, called wildlife overpasses, span the highway at points where animal trails already crossed, and each one is planted with the same grasses, shrubs, and soil found in the surrounding forest, so that from an animal’s point of view, the highway seems to disappear beneath a strip of ordinary hillside. Beneath the road, engineers added dozens of smaller underpasses, culverts and tunnels sized for foxes, badgers, and other animals that prefer not to climb.\n\nThe results surprised even the biologists who had proposed the project. Camera traps installed at the crossings recorded more than eleven species using them within the first few years, including grizzly and black bears, wolves, cougars, moose, and lynx. Collisions between vehicles and large mammals in the park dropped by more than eighty percent in the areas where crossings were built, and highway planners in other mountainous regions began studying the Banff data as a model for their own roads.\n\nNot every animal adjusted at the same pace. Wolves and elk began using the new overpasses within months, but researchers found that grizzly bears, more cautious by nature, sometimes avoided a crossing for several years before an individual bear finally used it, after which the behavior seemed to spread through the local population, as though one animal’s confidence became a kind of instruction to the others. Biologists tracking bear movements with radio collars later confirmed something else the crossings were doing quietly, out of sight of the highway cameras: bears from populations on opposite sides of the road had begun to interbreed again after decades of separation, a change that geneticists could read directly in the cubs born in the years that followed.\n\nThat genetic detail turned out to matter more than the collision numbers alone. A road wide and busy enough to stop animals from crossing does not just separate two groups of the same species for a season; over enough generations, it can split one healthy, genetically diverse population into two smaller, more vulnerable ones, each with a shrinking pool of possible mates. Wildlife biologists call this fragmentation, and reversing it, rather than merely reducing roadkill, is now considered the deeper purpose of a well-placed crossing.\n\nBuilding a single overpass is not cheap: current estimates run well into the millions of dollars once fencing, plantings, and monitoring equipment are included, and long stretches of fencing on either side of the road are needed to funnel animals toward the crossing rather than the traffic lanes. Supporters argue that the cost compares favorably to the price of vehicle collisions, medical claims, and highway repairs the crossings prevent, along with a harder cost to calculate: keeping large, wide-ranging animals from being cut off from one another by a river of traffic they cannot cross.\n\nEngineers elsewhere have adapted the idea to local terrain: rope bridges strung through the forest canopy for tree-dwelling species in Australia, tunnels built specifically for salamanders in the northeastern United States, and even a much-photographed overpass in the Netherlands that carries wild boar and deer over a highway on a landscaped bridge nearly a thousand feet long. Not every wildlife crossing succeeds right away, and researchers caution that a poorly placed overpass, built where animals rarely traveled in the first place, can waste millions of dollars while doing little to reduce collisions. The Banff crossings work partly because biologists spent years studying existing animal trails before choosing where to build, rather than simply placing structures wherever construction was cheapest. That lesson, planners say, has become as important to export as the concrete and soil themselves: a wildlife crossing is only as good as the science that decided where to put it.";

const excerptFromRoomToRoamDigitalShsatPracticeTest5Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-8",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "8"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks for the best overall summary of the Banff account\nA. Incorrect: The Netherlands crossing is described as a highway overpass for wild animals, not an amusement-park feature, and this choice misrepresents the passage's account.\nB. Correct: The passage moves from the collision-reduction data in paragraph 3 to the deeper genetic point in paragraphs 4 and 5, which it explicitly calls more important than the collision numbers.\nC. Incorrect: The passage discusses cost only as a counterargument to critics, not as the crossings' original motivation, which was animal safety and population health.\nD. Incorrect: The passage reports specific, measured effects, such as an eighty percent drop in collisions and documented interbreeding between once-separated bear populations.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks for the <strong>best</strong> overall summary of the Banff account</p><p>A. Incorrect: The Netherlands crossing is described as a highway overpass for wild animals, not an amusement-park feature, and this choice misrepresents the passage's account.</p><p>B. Correct: The passage moves from the collision-reduction data in paragraph 3 to the deeper genetic point in paragraphs 4 and 5, which it explicitly calls more important than the collision numbers.</p><p>C. Incorrect: The passage discusses cost only as a counterargument to critics, not as the crossings' original motivation, which was animal safety and population health.</p><p>D. Incorrect: The passage reports specific, measured effects, such as an eighty percent drop in collisions and documented interbreeding between once-separated bear populations.</p>",
    "points": 1,
    "prompt": "What is the best summary of the passage's account of Banff's wildlife crossings?",
    "promptHtml": "<p>What is the <strong>best</strong> summary of the passage's account of Banff's wildlife crossings?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Wildlife overpasses were first tested in Banff National Park and later copied by an amusement park in the Netherlands.</p>",
        "text": "Wildlife overpasses were first tested in Banff National Park and later copied by an amusement park in the Netherlands."
      },
      {
        "id": "B",
        "html": "<p>Building wildlife crossings in Banff has cut collisions dramatically and has begun reversing the genetic isolation the highway once caused.</p>",
        "text": "Building wildlife crossings in Banff has cut collisions dramatically and has begun reversing the genetic isolation the highway once caused."
      },
      {
        "id": "C",
        "html": "<p>Parks Canada built wildlife crossings mainly to reduce the cost of repairing damaged guardrails and highway pavement.</p>",
        "text": "Parks Canada built wildlife crossings mainly to reduce the cost of repairing damaged guardrails and highway pavement."
      },
      {
        "id": "D",
        "html": "<p>Scientists in Banff are still uncertain whether wildlife crossings have had any measurable effect on animal behavior.</p>",
        "text": "Scientists in Banff are still uncertain whether wildlife crossings have had any measurable effect on animal behavior."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-9",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "9"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks for the sentence that best supports the importance of crossing placement\nA. Incorrect: This sentence addresses cost, not the importance of choosing the right location.\nB. Incorrect: This sentence reports a result of the crossings' use, not a reason their locations were chosen carefully.\nC. Correct: This sentence directly credits the crossings' success to the careful selection of their location, not just their design.\nD. Incorrect: This sentence describes the variety of underpass designs built for different animals; it says nothing about how their locations were chosen.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks for the sentence that <strong>best</strong> supports the importance of crossing placement</p><p>A. Incorrect: This sentence addresses cost, not the importance of choosing the right location.</p><p>B. Incorrect: This sentence reports a result of the crossings' use, not a reason their locations were chosen carefully.</p><p>C. Correct: This sentence directly credits the crossings' success to the careful selection of their location, not just their design.</p><p>D. Incorrect: This sentence describes the variety of underpass designs built for different animals; it says nothing about how their locations were chosen.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that a wildlife crossing's location matters as much as its design?",
    "promptHtml": "<p>Which sentence from the passage <strong>best</strong> supports the idea that a wildlife crossing's location matters as much as its design?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>&quot;Building a single overpass is not cheap: current estimates run well into the millions of dollars once fencing, plantings, and monitoring equipment are included.&quot; (paragraph 6)</p>",
        "text": "\"Building a single overpass is not cheap: current estimates run well into the millions of dollars once fencing, plantings, and monitoring equipment are included.\" (paragraph 6)"
      },
      {
        "id": "B",
        "html": "<p>&quot;Camera traps installed at the crossings recorded more than eleven species using them within the first few years.&quot; (paragraph 3)</p>",
        "text": "\"Camera traps installed at the crossings recorded more than eleven species using them within the first few years.\" (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>&quot;The Banff crossings work partly because biologists spent years studying existing animal trails before choosing where to build, rather than simply placing structures wherever construction was cheapest.&quot; (paragraph 7)</p>",
        "text": "\"The Banff crossings work partly because biologists spent years studying existing animal trails before choosing where to build, rather than simply placing structures wherever construction was cheapest.\" (paragraph 7)"
      },
      {
        "id": "D",
        "html": "<p>&quot;Beneath the road, engineers added dozens of smaller underpasses, culverts and tunnels sized for foxes, badgers, and other animals that prefer not to climb.&quot; (paragraph 2)</p>",
        "text": "\"Beneath the road, engineers added dozens of smaller underpasses, culverts and tunnels sized for foxes, badgers, and other animals that prefer not to climb.\" (paragraph 2)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-10",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "10"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks what the phrase about a shrinking mate pool mainly conveys\nA. Incorrect: Radio collars are mentioned elsewhere as a tracking tool, but this particular sentence is about the biological risk of a shrinking mate pool, not tracking difficulty.\nB. Correct: The phrase describes a consequence that builds \"over enough generations,\" emphasizing a slow, serious biological risk to the population's health.\nC. Incorrect: This sentence is about the danger of separation, not about how quickly animals adopted the crossings, which is discussed elsewhere in the passage.\nD. Incorrect: The phrase concerns genetic isolation among animals, not the financial cost of building a crossing.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks what the phrase about a shrinking mate pool <strong>mainly</strong> conveys</p><p>A. Incorrect: Radio collars are mentioned elsewhere as a tracking tool, but this particular sentence is about the biological risk of a shrinking mate pool, not tracking difficulty.</p><p>B. Correct: The phrase describes a consequence that builds &quot;over enough generations,&quot; emphasizing a slow, serious biological risk to the population's health.</p><p>C. Incorrect: This sentence is about the danger of separation, not about how quickly animals adopted the crossings, which is discussed elsewhere in the passage.</p><p>D. Incorrect: The phrase concerns genetic isolation among animals, not the financial cost of building a crossing.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5:\n“A road wide and busy enough to stop animals from crossing does not just separate two groups of the same species for a season; over enough generations, it can split one healthy, genetically diverse population into two smaller, more vulnerable ones, each with a shrinking pool of possible mates.”\nThe phrase “shrinking pool of possible mates” mainly conveys",
    "promptHtml": "<p>Read this sentence from paragraph 5:</p><p><strong>“A road wide and busy enough to stop animals from crossing does not just separate two</strong> <strong>groups of the same species for a season; over enough generations, it can split one healthy,</strong> <strong>genetically diverse population into two smaller, more vulnerable ones, each with a</strong> <strong>shrinking pool of possible mates.”</strong></p><p>The phrase “shrinking pool of possible mates” <strong>mainly</strong> conveys</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the difficulty biologists faced in tracking individual animals with radio collars.</p>",
        "text": "the difficulty biologists faced in tracking individual animals with radio collars."
      },
      {
        "id": "B",
        "html": "<p>the long-term biological risk that isolation poses to a wildlife population.</p>",
        "text": "the long-term biological risk that isolation poses to a wildlife population."
      },
      {
        "id": "C",
        "html": "<p>the researchers' surprise at how quickly animals used the new crossings.</p>",
        "text": "the researchers' surprise at how quickly animals used the new crossings."
      },
      {
        "id": "D",
        "html": "<p>the financial risk that an unsuccessful crossing poses to taxpayers.</p>",
        "text": "the financial risk that an unsuccessful crossing poses to taxpayers."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-11",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "11"
    },
    "explanation": "Correct Answer: D\nExplanation: the stem asks how paragraph 5 develops the passage's ideas\nA. Incorrect: Examples from outside Banff, such as the Netherlands overpass, appear in paragraph 7, not paragraph 5.\nB. Incorrect: Paragraph 5 does not dispute the collision reduction; it adds a further, longer-term reason the crossings matter.\nC. Incorrect: The cost of building a crossing is discussed in paragraph 6, not paragraph 5.\nD. Correct: Paragraph 5 moves beyond the collision statistics of paragraph 3 to explain the slower genetic process of fragmentation, which the passage treats as the deeper purpose behind the crossings.",
    "explanationHtml": "<p>Correct Answer: D</p><p>Explanation: the stem asks how paragraph 5 develops the passage's ideas</p><p>A. Incorrect: Examples from outside Banff, such as the Netherlands overpass, appear in paragraph 7, not paragraph 5.</p><p>B. Incorrect: Paragraph 5 does not dispute the collision reduction; it adds a further, longer-term reason the crossings matter.</p><p>C. Incorrect: The cost of building a crossing is discussed in paragraph 6, not paragraph 5.</p><p>D. Correct: Paragraph 5 moves beyond the collision statistics of paragraph 3 to explain the slower genetic process of fragmentation, which the passage treats as the deeper purpose behind the crossings.</p>",
    "points": 1,
    "prompt": "How does paragraph 5 contribute to the development of the passage's ideas?",
    "promptHtml": "<p>How does paragraph 5 contribute to the development of the passage's ideas?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It introduces a brand new example of a wildlife crossing built outside of Banff.</p>",
        "text": "It introduces a brand new example of a wildlife crossing built outside of Banff."
      },
      {
        "id": "B",
        "html": "<p>It contradicts the earlier claim from paragraph 3 that the crossings reduced animal deaths.</p>",
        "text": "It contradicts the earlier claim from paragraph 3 that the crossings reduced animal deaths."
      },
      {
        "id": "C",
        "html": "<p>It summarizes the total financial cost of building and maintaining a highway crossing.</p>",
        "text": "It summarizes the total financial cost of building and maintaining a highway crossing."
      },
      {
        "id": "D",
        "html": "<p>It shifts the focus from fewer collisions to the deeper, genetic reason the crossings matter.</p>",
        "text": "It shifts the focus from fewer collisions to the deeper, genetic reason the crossings matter."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-12",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "12"
    },
    "explanation": "Correct Answer: C\nExplanation: the stem asks the purpose of the Netherlands detail\nA. Incorrect: The passage does not compare the danger posed by different animal species; the Netherlands example is about the crossing's design, not driver danger.\nB. Incorrect: The sentence about the Netherlands overpass does not mention cost at all; cost is discussed separately in paragraph 6.\nC. Correct: The Netherlands example is one of several adaptations listed in paragraph 7 that demonstrate the idea's success in other countries and for other species.\nD. Incorrect: The passage never compares the engineering skill of different countries; it simply lists examples of the idea being adapted elsewhere.",
    "explanationHtml": "<p>Correct Answer: C</p><p>Explanation: the stem asks the purpose of the Netherlands detail</p><p>A. Incorrect: The passage does not compare the danger posed by different animal species; the Netherlands example is about the crossing's design, not driver danger.</p><p>B. Incorrect: The sentence about the Netherlands overpass does not mention cost at all; cost is discussed separately in paragraph 6.</p><p>C. Correct: The Netherlands example is one of several adaptations listed in paragraph 7 that demonstrate the idea's success in other countries and for other species.</p><p>D. Incorrect: The passage never compares the engineering skill of different countries; it simply lists examples of the idea being adapted elsewhere.</p>",
    "points": 1,
    "prompt": "The author includes the detail about the \"much-photographed overpass in the Netherlands\" in paragraph 7  mainly to",
    "promptHtml": "<p>The author includes the detail about the &quot;much-photographed overpass in the Netherlands&quot; in paragraph 7  <strong>mainly to</strong></p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggest that wild boar are more dangerous to drivers than elk or deer.</p>",
        "text": "suggest that wild boar are more dangerous to drivers than elk or deer."
      },
      {
        "id": "B",
        "html": "<p>criticize the cost of building crossings in densely populated countries.</p>",
        "text": "criticize the cost of building crossings in densely populated countries."
      },
      {
        "id": "C",
        "html": "<p>show that the wildlife-crossing concept has been adapted successfully well beyond Banff.</p>",
        "text": "show that the wildlife-crossing concept has been adapted successfully well beyond Banff."
      },
      {
        "id": "D",
        "html": "<p>argue that European countries have more advanced engineering than Canada.</p>",
        "text": "argue that European countries have more advanced engineering than Canada."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-13",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "13"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks for a broader lesson the Banff account suggests\nA. Incorrect: The passage explicitly treats the genetic reunification of bear populations, not just collision prevention, as a further measure of success.\nB. Correct: The passage credits Banff's success to years of studying animal trails before building, and warns that crossings placed \"wherever construction was cheapest\" can fail, supporting this broader lesson.\nC. Incorrect: The passage describes the genetic reunification of bear populations as a benefit that surprised even the biologists who proposed the project, contradicting this statement.\nD. Incorrect: The passage notes that grizzly bears, a large mammal, were especially slow and cautious to adopt the crossings, so this overgeneralization is not supported.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks for a broader lesson the Banff account suggests</p><p>A. Incorrect: The passage explicitly treats the genetic reunification of bear populations, not just collision prevention, as a further measure of success.</p><p>B. Correct: The passage credits Banff's success to years of studying animal trails before building, and warns that crossings placed &quot;wherever construction was cheapest&quot; can fail, supporting this broader lesson.</p><p>C. Incorrect: The passage describes the genetic reunification of bear populations as a benefit that surprised even the biologists who proposed the project, contradicting this statement.</p><p>D. Incorrect: The passage notes that grizzly bears, a large mammal, were especially slow and cautious to adopt the crossings, so this overgeneralization is not supported.</p>",
    "points": 1,
    "prompt": "Which statement best expresses a lesson the passage's account of Banff's wildlife crossings suggests about solving environmental problems generally?",
    "promptHtml": "<p>Which statement <strong>best</strong> expresses a lesson the passage's account of Banff's wildlife crossings suggests about solving environmental problems generally?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Preventing collisions is the only way to measure whether a conservation project has succeeded.</p>",
        "text": "Preventing collisions is the only way to measure whether a conservation project has succeeded."
      },
      {
        "id": "B",
        "html": "<p>Careful, patient research into a problem's causes leads to solutions that last longer than a quick fix.</p>",
        "text": "Careful, patient research into a problem's causes leads to solutions that last longer than a quick fix."
      },
      {
        "id": "C",
        "html": "<p>Environmental projects rarely, if ever, produce benefits that scientists did not originally plan for.</p>",
        "text": "Environmental projects rarely, if ever, produce benefits that scientists did not originally plan for."
      },
      {
        "id": "D",
        "html": "<p>Large mammals generally adapt to new human-built structures more quickly than small animals do.</p>",
        "text": "Large mammals generally adapt to new human-built structures more quickly than small animals do."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-room-to-roam-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-14",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "14"
    },
    "explanation": "Correct Answer: D\nExplanation: the stem asks what the instruction comparison mainly suggests\nA. Incorrect: The passage attributes the spread of the behavior to the bears themselves, not to any training program run by biologists.\nB. Incorrect: The sentence describes the behavior spreading gradually \"after\" one bear's confidence, not multiple bears discovering the crossing independently and simultaneously.\nC. Incorrect: The sentence makes no comparison between bears and wolves or their methods of communication.\nD. Correct: Comparing one bear's confidence to \"a kind of instruction to the others\" suggests that later bears learned to use the crossing by following the example of the first.",
    "explanationHtml": "<p>Correct Answer: D</p><p>Explanation: the stem asks what the instruction comparison <strong>mainly</strong> suggests</p><p>A. Incorrect: The passage attributes the spread of the behavior to the bears themselves, not to any training program run by biologists.</p><p>B. Incorrect: The sentence describes the behavior spreading gradually &quot;after&quot; one bear's confidence, not multiple bears discovering the crossing independently and simultaneously.</p><p>C. Incorrect: The sentence makes no comparison between bears and wolves or their methods of communication.</p><p>D. Correct: Comparing one bear's confidence to &quot;a kind of instruction to the others&quot; suggests that later bears learned to use the crossing by following the example of the first.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4:\n“...after which the behavior seemed to spread through the local population, as though one animal’s confidence became a kind of instruction to the others.”\nThis comparison suggests that",
    "promptHtml": "<p>Read this sentence from paragraph 4:</p><p><strong>“...after which the behavior seemed to spread through the local population, as though one</strong> <strong>animal’s confidence became a kind of instruction to the others.”</strong></p><p>This comparison suggests that</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>the bears were formally trained by biologists to use the new crossings.</p>",
        "text": "the bears were formally trained by biologists to use the new crossings."
      },
      {
        "id": "B",
        "html": "<p>each bear discovered the crossings independently and at the same time.</p>",
        "text": "each bear discovered the crossings independently and at the same time."
      },
      {
        "id": "C",
        "html": "<p>the bears communicate with each other using the same signals as wolves.</p>",
        "text": "the bears communicate with each other using the same signals as wolves."
      },
      {
        "id": "D",
        "html": "<p>the bears learned to use the crossings partly by observing and following one another's behavior.</p>",
        "text": "the bears learned to use the crossings partly by observing and following one another's behavior."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromRoomToRoamDigitalShsatPracticeTest5PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-room-to-roam-digital-shsat-practice-test-5",
  versionLabels: ["Digital SHSAT Practice Test 5"],
  label: "Excerpt from “Room to Roam”",
  section: "reading",
  questionCount: excerptFromRoomToRoamDigitalShsatPracticeTest5Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-room-to-roam-digital-shsat-practice-test-5",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-digital-shsat-practice-test-5-v2","label":"Digital SHSAT Practice Test 5","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2","form":"5 v2","packageId":"b2517f297fcb124c4c5c24f7fcd4098fa50fe28edb74c2ec110a329f5aec9443"},
    title: "Excerpt from “Room to Roam”",
    author: "Priyanka Deol",
    byline: "by Priyanka Deol",
    blurb: "The following is adapted from an article by Priyanka Deol in the outdoors and infrastructure magazine Trailhead & Transit.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>For decades, the stretch of the Trans-Canada Highway running through Banff National Park in Alberta was one of the deadliest roads in North America for wildlife. Elk, deer, and the occasional grizzly bear wandered onto the pavement at dusk, when headlights caught them too late for cars to stop. Collisions were common enough that highway crews kept a running count, and biologists worried that busy roads were quietly cutting large mammal populations into isolated, shrinking pockets, cut off from mates and food sources on the other side of the asphalt.</p><p>In 1996, Parks Canada tried something that had barely been attempted anywhere in the world at that scale: it began building bridges meant for animals, not cars. The structures, called wildlife overpasses, span the highway at points where animal trails already crossed, and each one is planted with the same grasses, shrubs, and soil found in the surrounding forest, so that from an animal’s point of view, the highway seems to disappear beneath a strip of ordinary hillside. Beneath the road, engineers added dozens of smaller underpasses, <span data-glossary-definition=\"drainage tunnels or pipes that run beneath a road\" role=\"link\" tabindex=\"0\">culverts</span> and tunnels sized for foxes, badgers, and other animals that prefer not to climb.</p><p>The results surprised even the biologists who had proposed the project. <span data-glossary-definition=\"cameras triggered automatically by motion or heat, used to photograph wildlife unseen\" role=\"link\" tabindex=\"0\">Camera traps</span> installed at the crossings recorded more than eleven species using them within the first few years, including grizzly and black bears, wolves, cougars, moose, and lynx. Collisions between vehicles and large mammals in the park dropped by more than eighty percent in the areas where crossings were built, and highway planners in other mountainous regions began studying the Banff data as a model for their own roads.</p><p>Not every animal adjusted at the same pace. Wolves and elk began using the new overpasses within months, but researchers found that grizzly bears, more cautious by nature, sometimes avoided a crossing for several years before an individual bear finally used it, after which the behavior seemed to spread through the local population, as though one animal’s confidence became a kind of instruction to the others. Biologists tracking bear movements with radio collars later confirmed something else the crossings were doing quietly, out of sight of the highway cameras: bears from populations on opposite sides of the road had begun to interbreed again after decades of separation, a change that geneticists could read directly in the cubs born in the years that followed.</p><p>That genetic detail turned out to matter more than the collision numbers alone. A road wide and busy enough to stop animals from crossing does not just separate two groups of the same species for a season; over enough generations, it can split one healthy, genetically diverse population into two smaller, more vulnerable ones, each with a shrinking pool of possible mates. Wildlife biologists call this fragmentation, and reversing it, rather than merely reducing roadkill, is now considered the deeper purpose of a well-placed crossing.</p><p>Building a single overpass is not cheap: current estimates run well into the millions of dollars once fencing, plantings, and monitoring equipment are included, and long stretches of fencing on either side of the road are needed to funnel animals toward the crossing rather than the traffic lanes. Supporters argue that the cost compares favorably to the price of vehicle collisions, medical claims, and highway repairs the crossings prevent, along with a harder cost to calculate: keeping large, wide-ranging animals from being cut off from one another by a river of traffic they cannot cross.</p><p>Engineers elsewhere have adapted the idea to local terrain: rope bridges strung through the forest canopy for tree-dwelling species in Australia, tunnels built specifically for salamanders in the northeastern United States, and even a much-photographed overpass in the Netherlands that carries wild boar and deer over a highway on a landscaped bridge nearly a thousand feet long. Not every wildlife crossing succeeds right away, and researchers caution that a poorly placed overpass, built where animals rarely traveled in the first place, can waste millions of dollars while doing little to reduce collisions. The Banff crossings work partly because biologists spent years studying existing animal trails before choosing where to build, rather than simply placing structures wherever construction was cheapest. That lesson, planners say, has become as important to export as the concrete and soil themselves: a wildlife crossing is only as good as the science that decided where to put it.</p>",
    text: excerptFromRoomToRoamDigitalShsatPracticeTest5PassageText,
    versionLabel: "Digital SHSAT Practice Test 5",
  }),
  questions: excerptFromRoomToRoamDigitalShsatPracticeTest5Questions,
};
