import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageText = "Beneath the streets of Manhattan and Brooklyn, between 1897 and 1953, the United States Post Office ran a mail system that never touched a single delivery truck. Letters, driven by nothing but compressed air, shot through a network of iron pipes at speeds that could carry a bundle of mail from one end of the city to the other faster than a horse-drawn wagon could cross a single avenue.\n\nThe idea was not new when New York adopted it. European cities had experimented with pneumatic tube systems for telegrams decades earlier, and by the 1890s, engineers had scaled the technology up to carry heavier loads. Postal officials in New York, faced with a booming population and streets already clogged with delivery wagons, saw an opportunity: a network buried below the traffic, immune to weather, congestion, and the horse. Private companies won the early contracts, since the Post Office itself was reluctant to spend federal money on unproven equipment, and city officials only agreed to let crews dig up the streets after engineers demonstrated the system with a public test run watched by newspaper reporters.\n\nAt its largest, the New York system stretched across roughly twenty-seven miles of pipe connecting more than twenty post offices in Manhattan and Brooklyn. Cylindrical steel cartridges, each about two feet long and packed with as many as six hundred letters, were loaded at one station and pushed through the tubes by air pressure generated at powerful pumping plants along the route. A cartridge that might have taken an hour by wagon crossed Manhattan in under thirty minutes, and workers at each station could hear an incoming cartridge coming seconds before it arrived, giving them just enough time to catch it in a padded receiving box, sort its contents by hand, and route the letters onward to carriers waiting outside.\n\nThe system became something of a public spectacle. Newspapers described the sound of a cartridge arriving at a station, and postal workers occasionally sent small items along with the mail; a photograph exists of a live cat, reportedly mailed as a publicity stunt, having survived a short trip through the tubes. Politicians and journalists were invited to watch cartridges launched on ceremonial first runs whenever a new stretch of tube opened, and for a brief stretch of the early twentieth century, a ride through the tubes was treated less like ordinary mail service and more like a demonstration of what the new century’s engineering could do.\n\nThe tubes could not, however, keep pace with a changing city forever. Trucks became faster and more reliable, tunnel maintenance grew expensive as the iron pipes aged, and postal budgets tightened after two world wars. Critics inside the Post Office also pointed out that a single tube blockage could delay mail across an entire route at once, a risk that a fleet of trucks, able to take different streets, did not share. In 1953, the Post Office shut down the last of the pneumatic mail routes, and trucks took over the job the tubes had done for more than fifty years.\n\nNew York was not the only American city to try the idea. Philadelphia, Boston, Chicago, and St. Louis each built their own pneumatic networks around the same period, moving mail between downtown post offices and outlying stations. None, however, matched New York’s system in scale or in the length of time it stayed in operation, and by the 1920s several of the smaller networks had already been abandoned in favor of trucks. New York’s tubes lasted decades longer partly because the city’s dense, traffic-choked streets made the underground alternative more valuable there than almost anywhere else in the country.\n\nMost of the tunnels remain underground today, sealed and forgotten beneath sidewalks and subway lines, a reminder that fast mail delivery has meant different things in different centuries, and that for one stretch of the twentieth century, the fastest way to send a letter across New York was to fire it through a pipe.";

const excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-15",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "15"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks the purpose of the live-cat detail\nA. Correct: The cat anecdote appears alongside other details about newspapers and ceremonial first runs, together showing that the tubes became \"something of a public spectacle\" beyond their practical use.\nB. Incorrect: The passage does not use the cat as evidence of the tubes' size capacity; it presents the incident as a publicity stunt, not an engineering demonstration.\nC. Incorrect: The passage describes the incident neutrally, as a curiosity, without criticizing the workers involved.\nD. Incorrect: The reasons for the system's 1953 shutdown, given in paragraph 5, involve cost and reliability, not the earlier publicity stunt.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks the purpose of the live-cat detail</p><p>A. Correct: The cat anecdote appears alongside other details about newspapers and ceremonial first runs, together showing that the tubes became &quot;something of a public spectacle&quot; beyond their practical use.</p><p>B. Incorrect: The passage does not use the cat as evidence of the tubes' size capacity; it presents the incident as a publicity stunt, not an engineering demonstration.</p><p>C. Incorrect: The passage describes the incident neutrally, as a curiosity, without criticizing the workers involved.</p><p>D. Incorrect: The reasons for the system's 1953 shutdown, given in paragraph 5, involve cost and reliability, not the earlier publicity stunt.</p>",
    "points": 1,
    "prompt": "The author most likely includes the detail about the live cat mailed as a publicity stunt in order to",
    "promptHtml": "<p>The author <strong>most likely</strong> includes the detail about the live cat mailed as a publicity stunt in order to</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>illustrate how the tube system captured the public's fascination as a novelty, not just a service.</p>",
        "text": "illustrate how the tube system captured the public's fascination as a novelty, not just a service."
      },
      {
        "id": "B",
        "html": "<p>prove that the tubes were large enough to safely transport any kind of small animal.</p>",
        "text": "prove that the tubes were large enough to safely transport any kind of small animal."
      },
      {
        "id": "C",
        "html": "<p>criticize postal workers for treating valuable government mail property with obvious carelessness.</p>",
        "text": "criticize postal workers for treating valuable government mail property with obvious carelessness."
      },
      {
        "id": "D",
        "html": "<p>explain in detail why the Post Office eventually shut the entire tube system down.</p>",
        "text": "explain in detail why the Post Office eventually shut the entire tube system down."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-16",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "16"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks what the word ceremonial mainly conveys\nA. Incorrect: The sentence shows journalists being invited to celebratory demonstrations, not expressing doubt about the system's function.\nB. Correct: \"Ceremonial\" paired with invited politicians and journalists shows that a new tube opening was treated as a special occasion rather than routine maintenance.\nC. Incorrect: Nothing in the sentence suggests resentment; officials are shown inviting guests to a celebratory event.\nD. Incorrect: The sentence instead describes the tube rides as \"a demonstration of what the new century's engineering could do,\" presenting the technology as impressive, not outdated.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks what the word ceremonial <strong>mainly</strong> conveys</p><p>A. Incorrect: The sentence shows journalists being invited to celebratory demonstrations, not expressing doubt about the system's function.</p><p>B. Correct: &quot;Ceremonial&quot; paired with invited politicians and journalists shows that a new tube opening was treated as a special occasion rather than routine maintenance.</p><p>C. Incorrect: Nothing in the sentence suggests resentment; officials are shown inviting guests to a celebratory event.</p><p>D. Incorrect: The sentence instead describes the tube rides as &quot;a demonstration of what the new century's engineering could do,&quot; presenting the technology as impressive, not outdated.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4:\n“Politicians and journalists were invited to watch cartridges launched on ceremonial first runs whenever a new stretch of tube opened, and for a brief stretch of the early twentieth century, a ride through the tubes was treated less like ordinary mail service and more like a demonstration of what the new century’s engineering could do.”\nThe word “ceremonial” mainly conveys",
    "promptHtml": "<p>Read this sentence from paragraph 4:</p><p><strong>“Politicians and journalists were invited to watch cartridges launched on ceremonial first</strong> <strong>runs whenever a new stretch of tube opened, and for a brief stretch of the early twentieth</strong> <strong>century, a ride through the tubes was treated less like ordinary mail service and more like</strong> <strong>a demonstration of what the new century’s engineering could do.”</strong></p><p>The word “ceremonial” <strong>mainly</strong> conveys</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>that journalists doubted whether the new tube routes would actually work.</p>",
        "text": "that journalists doubted whether the new tube routes would actually work."
      },
      {
        "id": "B",
        "html": "<p>that opening a new stretch of tube was treated as a celebration, not a routine event.</p>",
        "text": "that opening a new stretch of tube was treated as a celebration, not a routine event."
      },
      {
        "id": "C",
        "html": "<p>that postal officials resented the extra work these public events required.</p>",
        "text": "that postal officials resented the extra work these public events required."
      },
      {
        "id": "D",
        "html": "<p>that the tube system's engineering was considered outdated by this point.</p>",
        "text": "that the tube system's engineering was considered outdated by this point."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-17",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "17"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks how paragraph 6 develops the passage's ideas\nA. Incorrect: Those maintenance problems are mentioned in paragraph 5, not paragraph 6, which instead compares New York to other cities.\nB. Correct: Paragraph 6 widens the scope to other American cities and explains that their systems were smaller and abandoned earlier, adding context to New York's unusual scale and longevity.\nC. Incorrect: The reasons for the 1953 shutdown are given in paragraph 5, before paragraph 6 turns to other cities.\nD. Incorrect: Paragraph 6 supports, rather than contradicts, that claim by showing that other cities' systems were smaller and shorter-lived.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks how paragraph 6 develops the passage's ideas</p><p>A. Incorrect: Those maintenance problems are mentioned in paragraph 5, not paragraph 6, which instead compares New York to other cities.</p><p>B. Correct: Paragraph 6 widens the scope to other American cities and explains that their systems were smaller and abandoned earlier, adding context to New York's unusual scale and longevity.</p><p>C. Incorrect: The reasons for the 1953 shutdown are given in paragraph 5, before paragraph 6 turns to other cities.</p><p>D. Incorrect: Paragraph 6 supports, rather than contradicts, that claim by showing that other cities' systems were smaller and shorter-lived.</p>",
    "points": 1,
    "prompt": "How does paragraph 6 contribute to the development of ideas in the passage?",
    "promptHtml": "<p>How does paragraph 6 contribute to the development of ideas in the passage?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>It describes the specific engineering problems that caused the iron tunnels to require repair.</p>",
        "text": "It describes the specific engineering problems that caused the iron tunnels to require repair."
      },
      {
        "id": "B",
        "html": "<p>It broadens the passage's focus beyond New York to show how the idea fared elsewhere.</p>",
        "text": "It broadens the passage's focus beyond New York to show how the idea fared elsewhere."
      },
      {
        "id": "C",
        "html": "<p>It introduces the reason the Post Office finally shut the New York system down in 1953.</p>",
        "text": "It introduces the reason the Post Office finally shut the New York system down in 1953."
      },
      {
        "id": "D",
        "html": "<p>It contradicts the earlier claim that New York's system was unusually large and long-lasting.</p>",
        "text": "It contradicts the earlier claim that New York's system was unusually large and long-lasting."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-18",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "18"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks for the sentence that best supports the structural-weakness idea\nA. Correct: This sentence directly names the structural weakness, a single blockage disrupting an entire route, and explicitly contrasts it with trucks, which do not share that risk.\nB. Incorrect: This sentence lists general economic and reliability trends, not the specific structural weakness of a single blockage disrupting the whole route.\nC. Incorrect: This sentence is about the tube system's speed advantage, not any structural weakness.\nD. Incorrect: This sentence states the outcome of the shutdown but does not identify the specific structural risk that trucks avoided.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks for the sentence that <strong>best</strong> supports the structural-weakness idea</p><p>A. Correct: This sentence directly names the structural weakness, a single blockage disrupting an entire route, and explicitly contrasts it with trucks, which do not share that risk.</p><p>B. Incorrect: This sentence lists general economic and reliability trends, not the specific structural weakness of a single blockage disrupting the whole route.</p><p>C. Incorrect: This sentence is about the tube system's speed advantage, not any structural weakness.</p><p>D. Incorrect: This sentence states the outcome of the shutdown but does not identify the specific structural risk that trucks avoided.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that the pneumatic tube system had a structural weakness that a fleet of trucks did not share?",
    "promptHtml": "<p>Which sentence from the passage <strong>best</strong> supports the idea that the pneumatic tube system had a structural weakness that a fleet of trucks did not share?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>&quot;Critics inside the Post Office also pointed out that a single tube blockage could delay mail across an entire route at once, a risk that a fleet of trucks, able to take different streets, did not share.&quot; (paragraph 5)</p>",
        "text": "\"Critics inside the Post Office also pointed out that a single tube blockage could delay mail across an entire route at once, a risk that a fleet of trucks, able to take different streets, did not share.\" (paragraph 5)"
      },
      {
        "id": "B",
        "html": "<p>&quot;Trucks became faster and more reliable, tunnel maintenance grew expensive as the iron pipes aged, and postal budgets tightened after two world wars.&quot; (paragraph 5)</p>",
        "text": "\"Trucks became faster and more reliable, tunnel maintenance grew expensive as the iron pipes aged, and postal budgets tightened after two world wars.\" (paragraph 5)"
      },
      {
        "id": "C",
        "html": "<p>&quot;A cartridge that might have taken an hour by wagon crossed Manhattan in under thirty minutes.&quot; (paragraph 3)</p>",
        "text": "\"A cartridge that might have taken an hour by wagon crossed Manhattan in under thirty minutes.\" (paragraph 3)"
      },
      {
        "id": "D",
        "html": "<p>&quot;In 1953, the Post Office shut down the last of the pneumatic mail routes, and trucks took over the job the tubes had done for more than fifty years.&quot; (paragraph 5)</p>",
        "text": "\"In 1953, the Post Office shut down the last of the pneumatic mail routes, and trucks took over the job the tubes had done for more than fifty years.\" (paragraph 5)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-19",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "19"
    },
    "explanation": "Correct Answer: B\nExplanation: the stem asks for the best overall summary of the passage\nA. Incorrect: The passage describes trucks eventually replacing tubes everywhere, including in New York, because they proved more reliable in the long run.\nB. Correct: This choice reflects the passage's full arc: the tubes' speed and spectacle in paragraphs 1 through 4, and the cost and risk that led to their 1953 shutdown in paragraph 5.\nC. Incorrect: The passage introduces the tubes as a practical solution to slow, congested mail delivery; the public spectacle is described as something the system \"became,\" not its original purpose.\nD. Incorrect: Paragraph 6 states that Philadelphia, Boston, Chicago, and St. Louis also built pneumatic networks, so New York was not the only city to attempt one.",
    "explanationHtml": "<p>Correct Answer: B</p><p>Explanation: the stem asks for the <strong>best</strong> overall summary of the passage</p><p>A. Incorrect: The passage describes trucks eventually replacing tubes everywhere, including in New York, because they proved more reliable in the long run.</p><p>B. Correct: This choice reflects the passage's full arc: the tubes' speed and spectacle in paragraphs 1 through 4, and the cost and risk that led to their 1953 shutdown in paragraph 5.</p><p>C. Incorrect: The passage introduces the tubes as a practical solution to slow, congested mail delivery; the public spectacle is described as something the system &quot;became,&quot; not its original purpose.</p><p>D. Incorrect: Paragraph 6 states that Philadelphia, Boston, Chicago, and St. Louis also built pneumatic networks, so New York was not the only city to attempt one.</p>",
    "points": 1,
    "prompt": "What is the best summary of the passage's account of New York's pneumatic mail tubes?",
    "promptHtml": "<p>What is the <strong>best</strong> summary of the passage's account of New York's pneumatic mail tubes?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>Pneumatic tube mail delivery proved far more reliable than trucks in every American city that tried it.</p>",
        "text": "Pneumatic tube mail delivery proved far more reliable than trucks in every American city that tried it."
      },
      {
        "id": "B",
        "html": "<p>New York's pneumatic tubes moved mail quickly and delighted the public, until costs and risks grew too great.</p>",
        "text": "New York's pneumatic tubes moved mail quickly and delighted the public, until costs and risks grew too great."
      },
      {
        "id": "C",
        "html": "<p>New York's pneumatic tube system was built mainly to entertain the public rather than to speed up mail delivery.</p>",
        "text": "New York's pneumatic tube system was built mainly to entertain the public rather than to speed up mail delivery."
      },
      {
        "id": "D",
        "html": "<p>New York was the only American city ever ambitious enough to attempt an underground pneumatic network.</p>",
        "text": "New York was the only American city ever ambitious enough to attempt an underground pneumatic network."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5-satcc-digital-shsat-practice-test-5-v2-ela-20",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "ela",
      "sourceQuestion": "20"
    },
    "explanation": "The first statement is supported: paragraph 1 says the tubes were faster than a horse-drawn wagon, and paragraph 3 gives the specific comparison of under thirty minutes versus an hour. The second statement is not supported: paragraph 2 states that European cities had pneumatic tube systems for telegrams decades before New York adopted the idea. The third statement is supported directly by the critics' point in paragraph 5 that a single blockage could delay an entire route. The fourth statement is not supported: paragraph 2 explains that private companies, not the federal Post Office, won the early contracts because the Post Office was reluctant to spend federal money on unproven equipment.",
    "explanationHtml": "<p>The first statement is supported: paragraph 1 says the tubes were faster than a horse-drawn wagon, and paragraph 3 gives the specific comparison of under thirty minutes versus an hour. The second statement is not supported: paragraph 2 states that European cities had pneumatic tube systems for telegrams decades before New York adopted the idea. The third statement is supported directly by the critics' point in paragraph 5 that a single blockage could delay an entire route. The fourth statement is not supported: paragraph 2 explains that private companies, not the federal Post Office, won the early contracts because the Post Office was reluctant to spend federal money on unproven equipment.</p>",
    "points": 1,
    "prompt": "Sort each statement below into the category that reflects whether it is supported by the passage.",
    "promptHtml": "<p>Sort each statement below into the category that reflects whether it is supported by the passage.</p>",
    "topic": "",
    "categories": [
      {
        "id": "supported",
        "title": "Supported by the Passage"
      },
      {
        "id": "not-supported",
        "title": "Not Supported by the Passage"
      }
    ],
    "correctPlacements": {
      "row-1": "supported",
      "row-2": "not-supported",
      "row-3": "supported",
      "row-4": "not-supported"
    },
    "instructions": "Select one answer in each row.",
    "items": [
      {
        "id": "row-1",
        "text": "The pneumatic tube system could move a cartridge across Manhattan in less time than a horse-drawn wagon."
      },
      {
        "id": "row-2",
        "text": "New York's pneumatic mail network was the first of its kind attempted anywhere in the world."
      },
      {
        "id": "row-3",
        "text": "A blocked tube could interrupt mail delivery across its entire route at once."
      },
      {
        "id": "row-4",
        "text": "The federal Post Office itself paid for and built the very first stretches of tube in New York."
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

export const excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5",
  versionLabels: ["Digital SHSAT Practice Test 5"],
  label: "Excerpt from “Message at the Speed of Air”",
  section: "reading",
  questionCount: excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-message-at-the-speed-of-air-digital-shsat-practice-test-5",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-digital-shsat-practice-test-5-v2","label":"Digital SHSAT Practice Test 5","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2","form":"5 v2","packageId":"17597d143069cb1c24b796b535297d529580094dc7e8783ce0116edaa0056b9c"},
    title: "Excerpt from “Message at the Speed of Air”",
    author: "Marcus Delfino",
    byline: "by Marcus Delfino",
    blurb: "The following is adapted from a local-history piece by Marcus Delfino for a New York City heritage newsletter.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>Beneath the streets of Manhattan and Brooklyn, between 1897 and 1953, the United States Post Office ran a mail system that never touched a single delivery truck. Letters, driven by nothing but compressed air, shot through a network of iron pipes at speeds that could carry a bundle of mail from one end of the city to the other faster than a horse-drawn wagon could cross a single avenue.</p><p>The idea was not new when New York adopted it. European cities had experimented with <span data-glossary-definition=\"operated by air pressure\" role=\"link\" tabindex=\"0\">pneumatic</span> tube systems for telegrams decades earlier, and by the 1890s, engineers had scaled the technology up to carry heavier loads. Postal officials in New York, faced with a booming population and streets already clogged with delivery wagons, saw an opportunity: a network buried below the traffic, immune to weather, congestion, and the horse. Private companies won the early contracts, since the Post Office itself was reluctant to spend federal money on unproven equipment, and city officials only agreed to let crews dig up the streets after engineers demonstrated the system with a public test run watched by newspaper reporters.</p><p>At its largest, the New York system stretched across roughly twenty-seven miles of pipe connecting more than twenty post offices in Manhattan and Brooklyn. Cylindrical steel <span data-glossary-definition=\"sealed cylindrical containers used to carry letters through the tubes\" role=\"link\" tabindex=\"0\">cartridges</span>, each about two feet long and packed with as many as six hundred letters, were loaded at one station and pushed through the tubes by air pressure generated at powerful pumping plants along the route. A cartridge that might have taken an hour by wagon crossed Manhattan in under thirty minutes, and workers at each station could hear an incoming cartridge coming seconds before it arrived, giving them just enough time to catch it in a padded receiving box, sort its contents by hand, and route the letters onward to carriers waiting outside.</p><p>The system became something of a public spectacle. Newspapers described the sound of a cartridge arriving at a station, and postal workers occasionally sent small items along with the mail; a photograph exists of a live cat, reportedly mailed as a publicity stunt, having survived a short trip through the tubes. Politicians and journalists were invited to watch cartridges launched on ceremonial first runs whenever a new stretch of tube opened, and for a brief stretch of the early twentieth century, a ride through the tubes was treated less like ordinary mail service and more like a demonstration of what the new century’s engineering could do.</p><p>The tubes could not, however, keep pace with a changing city forever. Trucks became faster and more reliable, tunnel maintenance grew expensive as the iron pipes aged, and postal budgets tightened after two world wars. Critics inside the Post Office also pointed out that a single tube blockage could delay mail across an entire route at once, a risk that a fleet of trucks, able to take different streets, did not share. In 1953, the Post Office shut down the last of the pneumatic mail routes, and trucks took over the job the tubes had done for more than fifty years.</p><p>New York was not the only American city to try the idea. Philadelphia, Boston, Chicago, and St. Louis each built their own pneumatic networks around the same period, moving mail between downtown post offices and outlying stations. None, however, matched New York’s system in scale or in the length of time it stayed in operation, and by the 1920s several of the smaller networks had already been abandoned in favor of trucks. New York’s tubes lasted decades longer partly because the city’s dense, traffic-choked streets made the underground alternative more valuable there than almost anywhere else in the country.</p><p>Most of the tunnels remain underground today, sealed and forgotten beneath sidewalks and subway lines, a reminder that fast mail delivery has meant different things in different centuries, and that for one stretch of the twentieth century, the fastest way to send a letter across New York was to fire it through a pipe.</p>",
    text: excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5PassageText,
    versionLabel: "Digital SHSAT Practice Test 5",
  }),
  questions: excerptFromMessageAtTheSpeedOfAirDigitalShsatPracticeTest5Questions,
};
