import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10PassageText = "Antarctica in the depths of winter is a place that seems designed to end life rather than sustain it. The sun disappears for weeks, winds scour the ice at speeds that can knock a person flat, and temperatures drop to levels that would freeze exposed skin in minutes. Yet in this environment, emperor penguins not only survive but also raise the next generation of chicks. Understanding how they manage this feat requires looking at behavior, physiology, and the unexpected ways a group of animals can function almost like a single organism.\nEmperor penguins are the largest of all penguin species, and their size is one of their first defenses against the cold. A larger body holds more heat relative to the surface area that loses it. But size alone would not be enough. Beneath the skin, emperor penguins carry a thick layer of fat that acts as insulation, slowing the rate at which warmth escapes into the frigid air. Unlike most birds, they also have four overlapping layers of short, densely packed feathers that trap a film of still air next to the skin. That trapped air is an effective barrier, much the way a down jacket works by holding warmth close to the body rather than letting it circulate away.\nFeathers and fat take a penguin only so far, however. The real marvel of winter survival for emperor penguins is a behavior called huddling. When temperatures fall and winds pick up, hundreds or even thousands of penguins press together in a dense cluster, forming what researchers sometimes call a huddle or a turtle formation. The birds on the outer edge of the huddle face inward, shielding those at the center while slowly cycling through the formation so that no individual spends too long in the coldest position. The result is that the average temperature inside a large huddle is dramatically warmer than the surrounding air — warm enough, in some documented cases, that the penguins at the core must periodically move to the outside to avoid overheating.\nWhat makes the huddle so effective is collective heat production. Each penguin generates warmth through its own metabolism, and when thousands of bodies are pressed together, that warmth accumulates. Researchers who have studied huddle dynamics describe the cluster as a slow-moving, self-regulating system: as birds on the cold edge move inward and warm birds cycle outward, the entire formation drifts gradually across the ice over the course of hours. The movement is not random. It follows a pattern driven by the penguin's natural tendency to move toward warmth while the outer birds lean inward against the wind. The huddle is not organized by any single leader; it emerges from individual responses to temperature and crowding.\nWhile the female emperor penguin feeds at sea during the Antarctic winter, the male is responsible for incubating the single egg the pair has produced. He balances the egg on the tops of his feet and draws a fold of warm belly skin, called a brood pouch, down over it. This keeps the egg several degrees warmer than the surrounding air. The male does not eat for the entire incubation period, which lasts roughly two months. He relies instead on the fat reserves he built up before winter began. By the time the egg hatches, a male emperor penguin may have lost a large share of his body weight. Figure 1 shows the approximate mass of one male as the fast goes on. The huddle allows him to spend far less energy fighting the cold, which means his fat reserves last long enough for the chick to hatch safely.\nThe timing of emperor penguin reproduction may seem counterintuitive — why breed in the worst possible season rather than the warmer months? The answer lies in the chick's development. By the time the egg hatches and the chick grows large enough to survive independently, it will be summer on the Antarctic coast, and the sea will be close, full of fish and squid. If the penguins waited for warmer weather to begin breeding, the chick would not be ready to feed at sea until the following winter. The harsh breeding season is, in a sense, a calculated trade-off that gives the chick the best possible start in the most productive season.\nThe female returns from the sea right around the time the egg hatches, carrying a stomach full of partially digested food she regurgitates to feed the newborn chick. The male, by this point lean and depleted, makes his way to the sea for his first meal in two months. The transition is precise: the chick is too fragile to survive without food for long, and the female's return is timed, through what scientists believe is a combination of internal biological rhythms and environmental cues, to match the hatching almost exactly. If she is delayed and the male's energy runs out before she arrives, the male may abandon the chick to feed, and the chick will not survive. The system works because it usually works — but it leaves little margin for error.\nEmperor penguin chicks grow rapidly through the spring, sheltered in huddles of their own. Juvenile penguins cluster together in groups called crèches while both parents make trips to and from the sea. By midsummer the chicks have replaced their gray downy feathers with the waterproof adult plumage they need to enter the ocean. At that point the young penguins are on their own, and they find their way to the water with no guidance from their parents. The instinct to do so appears to be innate, emerging without being taught.\nWhat makes the emperor penguin's story remarkable is that none of its individual adaptations — the fat, the feathers, the huddling, the timing of the breeding cycle — would be sufficient in isolation. It is the combination of all of them, working together across months of unrelenting cold, that allows the species to occupy a niche that no other bird on earth has claimed. Scientists who study polar biology often describe the emperor penguin as a particularly clear example of how multiple layers of adaptation can solve a problem that appears, at first glance, to be entirely unsolvable.";

const excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-27",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "27",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: C \n Figure 1 shows the male falling from about 38 kilograms to about 23 kilograms, a loss of about 15 kilograms, which is about two-fifths of his starting mass, and paragraph 5 says he does not eat and relies on fat reserves he built before winter. Choice B overstates the loss, choice A is wrong because the loss slows from about 6 kilograms to 5 and then 4 in each later period, and choice D is wrong because only about 6 of the 15 kilograms were lost in the first twenty days.",
    "explanationHtml": "<p>Correct Answer: C <br> Figure 1 shows the male falling from about 38 kilograms to about 23 kilograms, a loss of about 15 kilograms, which is about two-fifths of his starting mass, and paragraph 5 says he does not eat and relies on fat reserves he built before winter. Choice B overstates the loss, choice A is wrong because the loss slows from about 6 kilograms to 5 and then 4 in each later period, and choice D is wrong because only about 6 of the 15 kilograms were lost in the first twenty days.</p>",
    "points": 1,
    "prompt": "Which conclusion about the male emperor penguin is best supported by combining Figure 1 with the information in paragraph 5?",
    "promptHtml": "Which conclusion about the male emperor penguin is <strong>best</strong> supported by combining Figure 1 with the information in paragraph 5?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>He loses mass faster as the fast continues, so his fat runs out before the egg hatches.</p>",
        "text": "He loses mass faster as the fast continues, so his fat runs out before the egg hatches."
      },
      {
        "id": "B",
        "html": "<p>He loses about half of his starting mass by the end of the fast, so his fat reserves are nearly exhausted at hatching, as Figure 1 shows.</p>",
        "text": "He loses about half of his starting mass by the end of the fast, so his fat reserves are nearly exhausted at hatching, as Figure 1 shows."
      },
      {
        "id": "C",
        "html": "<p>He loses about two-fifths of his starting mass by the end of the fast, which fits the statement that he lives on stored fat.</p>",
        "text": "He loses about two-fifths of his starting mass by the end of the fast, which fits the statement that he lives on stored fat."
      },
      {
        "id": "D",
        "html": "<p>He loses most of his mass in the first twenty days and almost none after that.</p>",
        "text": "He loses most of his mass in the first twenty days and almost none after that."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-28",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "28",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: C \n Paragraph 4 calls the huddle a self-regulating system that drifts as a whole yet is 'not organized by any single leader' and 'emerges from individual responses,' which is why paragraph 1 says the group functions 'almost' like one organism. A is contradicted by paragraph 3's cycling, which keeps any bird from staying too long in the cold; B is contradicted by the absence of a leader; D is contradicted by paragraph 3, where core birds overheat and must move outward.",
    "explanationHtml": "<p>Correct Answer: C <br> Paragraph 4 calls the huddle a self-regulating system that drifts as a whole yet is 'not organized by any single leader' and 'emerges from individual responses,' which is why paragraph 1 says the group functions 'almost' like one organism. A is contradicted by paragraph 3's cycling, which keeps any bird from staying too long in the cold; B is contradicted by the absence of a leader; D is contradicted by paragraph 3, where core birds overheat and must move outward.</p>",
    "points": 1,
    "prompt": "Considered alongside paragraphs 3 and 4, the comparison of a group of penguins to \"a single organism\" in paragraph 1 suggests that",
    "promptHtml": "Considered alongside paragraphs 3 and 4, the comparison of a group of penguins to &quot;a single organism&quot; in paragraph 1 suggests that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the penguins in a huddle give up their own comfort so that a few birds at the center survive the coldest nights.</p>",
        "text": "the penguins in a huddle give up their own comfort so that a few birds at the center survive the coldest nights."
      },
      {
        "id": "B",
        "html": "<p>the huddle depends on a few experienced birds that direct how the rest of the group moves.</p>",
        "text": "the huddle depends on a few experienced birds that direct how the rest of the group moves."
      },
      {
        "id": "C",
        "html": "<p>the huddle acts as one coordinated body even though it emerges only from individual birds' responses.</p>",
        "text": "the huddle acts as one coordinated body even though it emerges only from individual birds' responses."
      },
      {
        "id": "D",
        "html": "<p>the huddle holds every bird at one steady temperature, the way a healthy body regulates itself.</p>",
        "text": "the huddle holds every bird at one steady temperature, the way a healthy body regulates itself."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-29",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "29",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: A \n Paragraph 6 steps away from the incubation sequence in paragraphs 5 and 7 to explain that winter breeding is \"a calculated trade-off\" for the chick. Paragraph 9 then lists \"the timing of the breeding cycle\" as one of the combined adaptations. C correctly notes the break in chronology but wrongly says the conclusion does not use this idea. B misreads the paragraph's question as a counterargument, since the author answers it. D confuses this paragraph's explanation of timing with paragraph 8's account of the chick's growth.",
    "explanationHtml": "<p>Correct Answer: A <br> Paragraph 6 steps away from the incubation sequence in paragraphs 5 and 7 to explain that winter breeding is &quot;a calculated trade-off&quot; for the chick. Paragraph 9 then lists &quot;the timing of the breeding cycle&quot; as one of the combined adaptations. C correctly notes the break in chronology but wrongly says the conclusion does not use this idea. B misreads the paragraph's question as a counterargument, since the author answers it. D confuses this paragraph's explanation of timing with paragraph 8's account of the chick's growth.</p>",
    "points": 1,
    "prompt": "What role does paragraph 6 play in the passage's explanation of the breeding cycle?",
    "promptHtml": "What role does paragraph 6 play in the passage's explanation of the breeding cycle?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It pauses the account of incubation to explain why winter breeding helps the chick, an adaptation the conclusion names.</p>",
        "text": "It pauses the account of incubation to explain why winter breeding helps the chick, an adaptation the conclusion names."
      },
      {
        "id": "B",
        "html": "<p>It raises a counterargument suggesting that winter breeding is a mistake the species has not yet corrected.</p>",
        "text": "It raises a counterargument suggesting that winter breeding is a mistake the species has not yet corrected."
      },
      {
        "id": "C",
        "html": "<p>It interrupts the chronological account of the breeding cycle with background that the conclusion does not use.</p>",
        "text": "It interrupts the chronological account of the breeding cycle with background that the conclusion does not use."
      },
      {
        "id": "D",
        "html": "<p>It describes the chick's growth after hatching, preparing readers for the account of crèches in paragraph 8.</p>",
        "text": "It describes the chick's growth after hatching, preparing readers for the account of crèches in paragraph 8."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-30",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "30",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: C \n Paragraph 5 says the huddle saves the fasting male enough energy for his fat to last until hatching, and paragraph 7 says a male whose energy runs out before the female arrives may abandon the chick, so a male outside the huddle faces that risk sooner. A is contradicted by paragraph 6, which explains that summer breeding would leave chicks unready to feed until the next winter; B ignores paragraph 5, which says the huddle is what lets his fat last until hatching, and paragraph 9, which says no single adaptation is enough on its own; D contradicts paragraph 7, which calls the chick too fragile to survive long without food.",
    "explanationHtml": "<p>Correct Answer: C <br> Paragraph 5 says the huddle saves the fasting male enough energy for his fat to last until hatching, and paragraph 7 says a male whose energy runs out before the female arrives may abandon the chick, so a male outside the huddle faces that risk sooner. A is contradicted by paragraph 6, which explains that summer breeding would leave chicks unready to feed until the next winter; B ignores paragraph 5, which says the huddle is what lets his fat last until hatching, and paragraph 9, which says no single adaptation is enough on its own; D contradicts paragraph 7, which calls the chick too fragile to survive long without food.</p>",
    "points": 1,
    "prompt": "Which prediction about the penguins is most consistent with the information in the passage?",
    "promptHtml": "Which prediction about the penguins is <strong>most</strong> consistent with the information in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Breeding during the summer would spare males the long fast and give chicks a better chance of surviving.</p>",
        "text": "Breeding during the summer would spare males the long fast and give chicks a better chance of surviving."
      },
      {
        "id": "B",
        "html": "<p>A male's fat reserves would carry him through incubation even if he never joined a huddle.</p>",
        "text": "A male's fat reserves would carry him through incubation even if he never joined a huddle."
      },
      {
        "id": "C",
        "html": "<p>A male unable to join a huddle would more likely abandon his chick before the female returns.</p>",
        "text": "A male unable to join a huddle would more likely abandon his chick before the female returns."
      },
      {
        "id": "D",
        "html": "<p>The chick's survival depends mainly on the male, since it can wait for food until the female returns.</p>",
        "text": "The chick's survival depends mainly on the male, since it can wait for food until the female returns."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-31",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "31",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: D \n Saying the winter \"seems designed to end life\" treats the cold as if it were built to kill, a dramatic exaggeration that sets up the paragraph's turn: \"Yet in this environment, emperor penguins not only survive but also raise the next generation of chicks.\" Choice A mistakes a figurative phrase for measurement. Choice B is contradicted by that next sentence. Choice C misreads \"seems,\" which softens the figure of speech rather than doubting the danger.",
    "explanationHtml": "<p>Correct Answer: D <br> Saying the winter &quot;seems designed to end life&quot; treats the cold as if it were built to kill, a dramatic exaggeration that sets up the paragraph's turn: &quot;Yet in this environment, emperor penguins not only survive but also raise the next generation of chicks.&quot; Choice A mistakes a figurative phrase for measurement. Choice B is contradicted by that next sentence. Choice C misreads &quot;seems,&quot; which softens the figure of speech rather than doubting the danger.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 1: \n\"Antarctica in the depths of winter is a place that seems designed to end life rather than sustain it.\" \nHow does the word choice in this sentence affect the tone of the passage's opening?",
    "promptHtml": "Read this sentence from paragraph 1: <br><strong>&quot;Antarctica in the depths of winter is a place that seems designed to end life rather than sustain it.&quot;</strong> <br>How does the word choice in this sentence affect the tone of the passage's opening?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Words like &quot;designed&quot; and &quot;sustain&quot; create a scientific tone, suggesting that researchers have measured exactly how deadly the winter is for the whole colony.</p>",
        "text": "Words like \"designed\" and \"sustain\" create a scientific tone, suggesting that researchers have measured exactly how deadly the winter is for the whole colony."
      },
      {
        "id": "B",
        "html": "<p>Words like &quot;depths&quot; and &quot;end life&quot; create a hopeless tone, suggesting that few emperor penguins manage to survive the winter.</p>",
        "text": "Words like \"depths\" and \"end life\" create a hopeless tone, suggesting that few emperor penguins manage to survive the winter."
      },
      {
        "id": "C",
        "html": "<p>Words like &quot;seems&quot; and &quot;rather than&quot; create an uncertain tone, suggesting that the author doubts the winter is truly dangerous.</p>",
        "text": "Words like \"seems\" and \"rather than\" create an uncertain tone, suggesting that the author doubts the winter is truly dangerous."
      },
      {
        "id": "D",
        "html": "<p>Words like &quot;designed&quot; and &quot;end life&quot; make the cold seem almost deliberately hostile, creating a dramatic tone that makes survival seem remarkable.</p>",
        "text": "Words like \"designed\" and \"end life\" make the cold seem almost deliberately hostile, creating a dramatic tone that makes survival seem remarkable."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-32",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "32",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: A \n The paragraph moves from chicks sheltered in crèches while both parents bring food to young penguins that are \"on their own\" and reach the water \"with no guidance from their parents,\" by an instinct that emerges \"without being taught.\" Choice B contradicts that instinct. Choice C overstates huddling, which paragraph 9 says is not sufficient alone. Choice D turns one detail into the main idea and adds a cause the paragraph never states.",
    "explanationHtml": "<p>Correct Answer: A <br> The paragraph moves from chicks sheltered in crèches while both parents bring food to young penguins that are &quot;on their own&quot; and reach the water &quot;with no guidance from their parents,&quot; by an instinct that emerges &quot;without being taught.&quot; Choice B contradicts that instinct. Choice C overstates huddling, which paragraph 9 says is not sufficient alone. Choice D turns one detail into the main idea and adds a cause the paragraph never states.</p>",
    "points": 1,
    "prompt": "Which statement best summarizes the central idea of paragraph 8?",
    "promptHtml": "Which statement <strong>best</strong> summarizes the central idea of paragraph 8?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>After a period of shared care, the chicks become fully independent, relying on instinct rather than instruction to reach the sea.</p>",
        "text": "After a period of shared care, the chicks become fully independent, relying on instinct rather than instruction to reach the sea."
      },
      {
        "id": "B",
        "html": "<p>Chicks depend on both parents until midsummer, which shows that emperor penguins learn their survival skills from the adults.</p>",
        "text": "Chicks depend on both parents until midsummer, which shows that emperor penguins learn their survival skills from the adults."
      },
      {
        "id": "C",
        "html": "<p>Crèches let chicks huddle like adults, which proves that huddling is the single most important adaptation of the species.</p>",
        "text": "Crèches let chicks huddle like adults, which proves that huddling is the single most important adaptation of the species."
      },
      {
        "id": "D",
        "html": "<p>The change to waterproof feathers is the chief event of the chick's first year, because it decides when the parents stop feeding it.</p>",
        "text": "The change to waterproof feathers is the chief event of the chick's first year, because it decides when the parents stop feeding it."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-33",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "33",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: B \n Paragraph 3 says the inside of a huddle is \"dramatically warmer\" than the air and ends with the core birds having to move out to avoid overheating, a vivid proof of how much heat the huddle holds in a place where exposed skin can freeze in minutes. Choice A misreads a sign of success as a flaw. Choice C is unsupported because all birds cycle through the formation. Choice D relates to paragraph 5 and the female's feeding, not to this detail.",
    "explanationHtml": "<p>Correct Answer: B <br> Paragraph 3 says the inside of a huddle is &quot;dramatically warmer&quot; than the air and ends with the core birds having to move out to avoid overheating, a vivid proof of how much heat the huddle holds in a place where exposed skin can freeze in minutes. Choice A misreads a sign of success as a flaw. Choice C is unsupported because all birds cycle through the formation. Choice D relates to paragraph 5 and the female's feeding, not to this detail.</p>",
    "points": 1,
    "prompt": "Why does the author end paragraph 3 with the detail that penguins at the core must sometimes move outward \"to avoid overheating\"?",
    "promptHtml": "Why does the author end paragraph 3 with the detail that penguins at the core must sometimes move outward &quot;to avoid overheating&quot;?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>to show that huddling is a flaw in the penguins' behavior that scientists are still trying to explain</p>",
        "text": "to show that huddling is a flaw in the penguins' behavior that scientists are still trying to explain"
      },
      {
        "id": "B",
        "html": "<p>to give a surprising, concrete sign of how well the huddle works, since a group in deadly cold can grow too warm inside</p>",
        "text": "to give a surprising, concrete sign of how well the huddle works, since a group in deadly cold can grow too warm inside"
      },
      {
        "id": "C",
        "html": "<p>to suggest that the penguins at the center are weaker than the birds that stand on the outer edge of the huddle in the wind</p>",
        "text": "to suggest that the penguins at the center are weaker than the birds that stand on the outer edge of the huddle in the wind"
      },
      {
        "id": "D",
        "html": "<p>to explain why the female must leave the huddle to feed at sea during the long Antarctic winter</p>",
        "text": "to explain why the female must leave the huddle to feed at sea during the long Antarctic winter"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10-satcc-9cc827afe5f992f7af37-ela-34",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "ela",
      "sourceQuestion": "34",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: B \n Paragraph 2 describes size, fat, and feathers as defenses against the cold; \"only so far, however\" admits that these are not enough on their own, and the next sentence introduces huddling. Choice A is wrong because the sentence limits these defenses rather than calling them harmful. Choice C is tempting because the next sentence calls huddling \"the real marvel,\" but paragraph 9 says no adaptation would be sufficient in isolation. Choice D is wrong because chicks are not discussed until later.",
    "explanationHtml": "<p>Correct Answer: B <br> Paragraph 2 describes size, fat, and feathers as defenses against the cold; &quot;only so far, however&quot; admits that these are not enough on their own, and the next sentence introduces huddling. Choice A is wrong because the sentence limits these defenses rather than calling them harmful. Choice C is tempting because the next sentence calls huddling &quot;the real marvel,&quot; but paragraph 9 says no adaptation would be sufficient in isolation. Choice D is wrong because chicks are not discussed until later.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3: \n\"Feathers and fat take a penguin only so far, however.\" \nHow does this sentence contribute to the development of ideas in the passage?",
    "promptHtml": "Read this sentence from paragraph 3: <br><strong>&quot;Feathers and fat take a penguin only so far, however.&quot;</strong> <br>How does this sentence contribute to the development of ideas in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It corrects paragraph 2 by revealing that the penguins' fat and feathers actually work against them in extreme cold.</p>",
        "text": "It corrects paragraph 2 by revealing that the penguins' fat and feathers actually work against them in extreme cold."
      },
      {
        "id": "B",
        "html": "<p>It marks the limit of the physical defenses described in paragraph 2, turning the passage toward a behavior that adds to them.</p>",
        "text": "It marks the limit of the physical defenses described in paragraph 2, turning the passage toward a behavior that adds to them."
      },
      {
        "id": "C",
        "html": "<p>It ranks huddling above all of the penguins' other adaptations, a claim the rest of the passage then sets out to prove.</p>",
        "text": "It ranks huddling above all of the penguins' other adaptations, a claim the rest of the passage then sets out to prove."
      },
      {
        "id": "D",
        "html": "<p>It shifts from describing adult penguins to describing chicks, whose feathers and fat have not yet developed enough to resist the cold.</p>",
        "text": "It shifts from describing adult penguins to describing chicks, whose feathers and fat have not yet developed enough to resist the cold."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  }
];

export const excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10",
  versionLabels: ["Digital SHSAT Practice Test Adaptive 10"],
  label: "Excerpt from \"The Huddle and the Cold\"",
  section: "reading",
  questionCount: excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-huddle-and-the-cold-digital-shsat-practice-test-adaptive-10",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from &quot;The Huddle and the Cold&quot;",
    blurbHtml: "<p><em>Margot Pelling is a science writer whose work appears in natural-history publications for general audiences. The following is adapted from her essay in Polar Margins Quarterly.</em></p>",
    bylineHtml: "by Margot Pelling",
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-9cc827afe5f992f7af37","label":"Digital SHSAT Practice Test Adaptive 10","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010","packageId":"8e1f5cde3b0abfa6dbe343a28fbb16562b07b7bfd715cd8f81386b3d05729707","originalPackageId":"2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"},
    title: "Excerpt from \"The Huddle and the Cold\"",
    author: "Margot Pelling",
    byline: "by Margot Pelling",
    blurb: "Margot Pelling is a science writer whose work appears in natural-history publications for general audiences. The following is adapted from her essay in Polar Margins Quarterly.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>Antarctica in the depths of winter is a place that seems designed to end life rather than sustain it. The sun disappears for weeks, winds scour the ice at speeds that can knock a person flat, and temperatures drop to levels that would freeze exposed skin in minutes. Yet in this environment, emperor penguins not only survive but also raise the next generation of chicks. Understanding how they manage this feat requires looking at behavior, physiology, and the unexpected ways a group of animals can function almost like a single organism.</p><p>Emperor penguins are the largest of all penguin species, and their size is one of their first defenses against the cold. A larger body holds more heat relative to the surface area that loses it. But size alone would not be enough. Beneath the skin, emperor penguins carry a thick layer of fat that acts as insulation, slowing the rate at which warmth escapes into the frigid air. Unlike most birds, they also have four overlapping layers of short, densely packed feathers that trap a film of still air next to the skin. That trapped air is an effective barrier, much the way a down jacket works by holding warmth close to the body rather than letting it circulate away.</p><p>Feathers and fat take a penguin only so far, however. The real marvel of winter survival for emperor penguins is a behavior called huddling. When temperatures fall and winds pick up, hundreds or even thousands of penguins press together in a dense cluster, forming what researchers sometimes call a huddle or a turtle formation. The birds on the outer edge of the huddle face inward, shielding those at the center while slowly cycling through the formation so that no individual spends too long in the coldest position. The result is that the average temperature inside a large huddle is dramatically warmer than the surrounding air — warm enough, in some documented cases, that the penguins at the core must periodically move to the outside to avoid overheating.</p><p>What makes the huddle so effective is collective heat production. Each penguin generates warmth through its own metabolism, and when thousands of bodies are pressed together, that warmth accumulates. Researchers who have studied huddle dynamics describe the cluster as a slow-moving, self-regulating system: as birds on the cold edge move inward and warm birds cycle outward, the entire formation drifts gradually across the ice over the course of hours. The movement is not random. It follows a pattern driven by the penguin's natural tendency to move toward warmth while the outer birds lean inward against the wind. The huddle is not organized by any single leader; it emerges from individual responses to temperature and crowding.</p><p>While the female emperor penguin feeds at sea during the Antarctic winter, the male is responsible for incubating the single egg the pair has produced. He balances the egg on the tops of his feet and draws a fold of warm belly skin, called a brood pouch, down over it. This keeps the egg several degrees warmer than the surrounding air. The male does not eat for the entire incubation period, which lasts roughly two months. He relies instead on the fat reserves he built up before winter began. By the time the egg hatches, a male emperor penguin may have lost a large share of his body weight. Figure 1 shows the approximate mass of one male as the fast goes on. The huddle allows him to spend far less energy fighting the cold, which means his fat reserves last long enough for the chick to hatch safely.</p><p>The timing of emperor penguin reproduction may seem counterintuitive — why breed in the worst possible season rather than the warmer months? The answer lies in the chick's development. By the time the egg hatches and the chick grows large enough to survive independently, it will be summer on the Antarctic coast, and the sea will be close, full of fish and squid. If the penguins waited for warmer weather to begin breeding, the chick would not be ready to feed at sea until the following winter. The harsh breeding season is, in a sense, a calculated trade-off that gives the chick the best possible start in the most productive season.</p><p>The female returns from the sea right around the time the egg hatches, carrying a stomach full of partially digested food she regurgitates to feed the newborn chick. The male, by this point lean and depleted, makes his way to the sea for his first meal in two months. The transition is precise: the chick is too fragile to survive without food for long, and the female's return is timed, through what scientists believe is a combination of internal biological rhythms and environmental cues, to match the hatching almost exactly. If she is delayed and the male's energy runs out before she arrives, the male may abandon the chick to feed, and the chick will not survive. The system works because it usually works — but it leaves little margin for error.</p><p>Emperor penguin chicks grow rapidly through the spring, sheltered in huddles of their own. Juvenile penguins cluster together in groups called crèches while both parents make trips to and from the sea. By midsummer the chicks have replaced their gray downy feathers with the waterproof adult plumage they need to enter the ocean. At that point the young penguins are on their own, and they find their way to the water with no guidance from their parents. The instinct to do so appears to be innate, emerging without being taught.</p><p>What makes the emperor penguin's story remarkable is that none of its individual adaptations — the fat, the feathers, the huddling, the timing of the breeding cycle — would be sufficient in isolation. It is the combination of all of them, working together across months of unrelenting cold, that allows the species to occupy a <span data-glossary-definition=\"the role or place that a species fills in its environment\" role=\"link\" tabindex=\"0\">niche</span> that no other bird on earth has claimed. Scientists who study polar biology often describe the emperor penguin as a particularly clear example of how multiple layers of adaptation can solve a problem that appears, at first glance, to be entirely unsolvable.</p><p data-numbered=\"false\"><img src=\"/exam-images/satcc-b2df7fde447be3719ef528aff368a94a9fb58c11524d74e758b924ad7fe66a57.png\" alt=\"figure\" width=\"501\"></p>",
    text: excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10PassageText,
    versionLabel: "Digital SHSAT Practice Test Adaptive 10",
  }),
  questions: excerptFromTheHuddleAndTheColdDigitalShsatPracticeTestAdaptive10Questions,
};
