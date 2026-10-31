import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4PassageText = "A gecko can sprint up a pane of window glass, cross onto the ceiling, and hang there by a single toe, upside down, without ever slowing to find a grip. For a long time this seemed to demand some kind of trick: a sticky secretion, perhaps, left behind wherever the foot touched, or thousands of microscopic suction cups pressed flat against the glass. Both explanations turn out to be wrong. Wipe a gecko's foot clean and press it to glass and it grips exactly as well as before, which rules out any residue. Place it in a sealed chamber with the air pumped out, removing any possibility of suction, and the grip holds just as strongly. The real explanation is stranger than either guess, since it depends on a force so weak that a single instance of it could not hold up a grain of sand, let alone a lizard.\nThe gecko's foot is covered in ridges of hair-like structures called setae, each thinner than a human hair and packed so densely that a single toe carries roughly half a million of them. Under a microscope, every seta splits at its tip into hundreds of even finer branches, called spatulae, each one flattened like a tiny paddle only a few hundred nanometers across. It is at this scale, far below anything the unaided eye could resolve, that the actual grip takes place. When a spatula presses close enough to a surface, the electrons orbiting its atoms and the electrons in the surface's atoms begin to tug at one another, forming a weak attraction known as a van der Waals force. No glue, no moisture, and no muscular clamping are involved at all; the same attraction exists, faintly, between almost any two surfaces brought close enough together, whether or not either one is alive.\nA single van der Waals attraction is almost nothing, far too faint to notice in ordinary life. What makes the gecko's grip strong is sheer number. Multiplied across hundreds of millions of spatulae spread over all four feet, these countless weak pulls add up to an adhesive force many times the gecko's own body weight, more than enough to let it hang from a single toe. Researchers who have measured this directly, by attaching tiny force sensors to a gecko's foot as it clings to a glass plate and gently pulling until the grip releases, have recorded forces strong enough that a sheet of spatulae the size of a human hand, if such a thing existed, could theoretically support the weight of an adult person.\nThe gecko does not simply mash its foot against a surface and stay stuck forever, which would make climbing impossible rather than easy. Instead it engages and releases its grip with each step, angling its toes to bring the spatulae into close contact on the way down and peeling them away, a fraction of a degree at a time, on the way up. That peeling angle turns out to matter enormously: press a seta straight down against a surface and it grips fiercely, but tilt it back past a certain point, roughly thirty degrees in most studies, and the same structure releases almost instantly, with barely any effort at all. A gecko crossing a ceiling is, in effect, constantly attaching and detaching millions of microscopic hooks in a single fluid motion, fast enough that the whole process looks, to a human eye, like nothing more than an ordinary walk.\nNot every surface cooperates equally well. Setae grip smooth glass or polished stone with ease, since the spatulae can settle into close, uninterrupted contact across a wide area. On loosely packed sand or fine dust, by contrast, even a gecko's remarkable foot struggles, because the surface itself keeps shifting and breaking the contact before the van der Waals force has a chance to build. This limitation offers a kind of confirmation of the whole explanation: a sticky secretion would work about as well on either surface, and a suction cup would fail on both, but a force that depends on extremely close, stable contact would behave exactly as the gecko's grip actually does, strong on glass and weak on sand.\nUnderstanding this mechanism has done more than settle an old question about lizards. Engineers have already built experimental adhesive tape and robot footpads modeled on the same branching, angle-dependent structure, aiming for a grip that holds firmly under load yet releases cleanly and leaves no residue behind, unlike ordinary tape or glue. None of these materials yet matches what evolution produced in a gecko's toe, but each attempt starts from the same discovery: a force too weak to matter on its own can become one of the strongest grips in nature, once it is divided finely enough and multiplied often enough.";

const excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-27",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "27",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: A\n\n\nExplanation: Paragraph 1 sets up the mystery by calling the true cause \"stranger than either guess,\" and paragraphs 2 and 3 reveal that a single van der Waals attraction is almost nothing on its own but becomes powerful once it is repeated across hundreds of millions of spatulae, which is exactly the surprising pattern the earlier phrase prepares readers to expect.\n\n\nA. Correct: The individually faint van der Waals attraction becomes powerful once multiplied across hundreds of millions of spatulae, matching the \"stranger than either guess\" setup.\n\n\nB. Incorrect: The passage explicitly rules out a bonding substance as the explanation.\n\n\nC. Incorrect: The passage rules out air pressure and suction as the explanation earlier in the passage.\n\n\nD. Incorrect: The passage doesn't describe muscles operating tiny suction cups; that is one of the incorrect guesses being ruled out.",
    "explanationHtml": "<p>Correct Answer: A\n<br>\nExplanation: Paragraph 1 sets up the mystery by calling the true cause &quot;stranger than either guess,&quot; and paragraphs 2 and 3 reveal that a single van der Waals attraction is almost nothing on its own but becomes powerful once it is repeated across hundreds of millions of spatulae, which is exactly the surprising pattern the earlier phrase prepares readers to expect.\n<br>\nA. Correct: The individually faint van der Waals attraction becomes powerful once multiplied across hundreds of millions of spatulae, matching the &quot;stranger than either guess&quot; setup.\n<br>\nB. Incorrect: The passage explicitly rules out a bonding substance as the explanation.\n<br>\nC. Incorrect: The passage rules out air pressure and suction as the explanation earlier in the passage.\n<br>\nD. Incorrect: The passage doesn't describe muscles operating tiny suction cups; that is one of the incorrect guesses being ruled out.</p>",
    "points": 1,
    "prompt": "The author describes the true explanation for the gecko's grip as “stranger than either guess” in paragraph 1. Given what paragraphs 2 and 3 reveal about the explanation, this description most likely prepares readers for the idea that",
    "promptHtml": "The author describes the true explanation for the gecko's grip as “stranger than either guess” in paragraph 1. Given what paragraphs 2 and 3 reveal about the explanation, this description <strong>most likely</strong> prepares readers for the idea that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>a force too faint to matter alone becomes powerful once it multiplies on an enormous scale.</p>",
        "text": "a force too faint to matter alone becomes powerful once it multiplies on an enormous scale."
      },
      {
        "id": "B",
        "html": "<p>a substance produced by geckos allows their feet to bond briefly with glass.</p>",
        "text": "a substance produced by geckos allows their feet to bond briefly with glass."
      },
      {
        "id": "C",
        "html": "<p>air pressure inside a sealed chamber pushes each toe pad flat against a surface.</p>",
        "text": "air pressure inside a sealed chamber pushes each toe pad flat against a surface."
      },
      {
        "id": "D",
        "html": "<p>specialized muscles inside each toe tighten and loosen thousands of tiny suction cups.</p>",
        "text": "specialized muscles inside each toe tighten and loosen thousands of tiny suction cups."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-28",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "28",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: B\n\n\nExplanation: Paragraph 5 explains that sand's shifting surface keeps breaking contact before a van der Waals attraction can fully develop, so a force sensor pulling on a foot gripping sand, unlike the strong pull recorded on glass in paragraph 3, would most likely register a noticeably weaker force before the foot released.\n\n\nA. Incorrect: This contradicts paragraph 5, which says sand's shifting surface weakens the grip rather than matching glass's strong hold.\n\n\nB. Correct: Since sand's shifting surface keeps breaking contact before the van der Waals force can build, the sensors would likely register a much weaker force before the grip gave way.\n\n\nC. Incorrect: The passage doesn't suggest the grip produces literally zero measurable force on sand, only a weaker one.\n\n\nD. Incorrect: The passage indicates surface texture does affect the grip's strength, since stable contact is required for the attraction to build.",
    "explanationHtml": "<p>Correct Answer: B\n<br>\nExplanation: Paragraph 5 explains that sand's shifting surface keeps breaking contact before a van der Waals attraction can fully develop, so a force sensor pulling on a foot gripping sand, unlike the strong pull recorded on glass in paragraph 3, would <strong>most likely</strong> register a noticeably weaker force before the foot released.\n<br>\nA. Incorrect: This contradicts paragraph 5, which says sand's shifting surface weakens the grip rather than matching glass's strong hold.\n<br>\nB. Correct: Since sand's shifting surface keeps breaking contact before the van der Waals force can build, the sensors would likely register a much weaker force before the grip gave way.\n<br>\nC. Incorrect: The passage doesn't suggest the grip produces literally zero measurable force on sand, only a weaker one.\n<br>\nD. Incorrect: The passage indicates surface texture does affect the grip's strength, since stable contact is required for the attraction to build.</p>",
    "points": 1,
    "prompt": "The passage explains in paragraph 5 that loosely packed sand keeps “shifting and breaking the contact before the van der Waals force has a chance to build.” Considering this together with the force-sensor experiment described in paragraph 3, what can be reasonably inferred about a gecko's foot pulled by force sensors while gripping sand instead of glass?",
    "promptHtml": "The passage explains in paragraph 5 that loosely packed sand keeps “shifting and breaking the contact before the van der Waals force has a chance to build.” Considering this together with the force-sensor experiment described in paragraph 3, what can be reasonably inferred about a gecko's foot pulled by force sensors while gripping sand instead of glass?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>The sensors would register forces exceeding the gecko's body weight, matching the results measured on glass.</p>",
        "text": "The sensors would register forces exceeding the gecko's body weight, matching the results measured on glass."
      },
      {
        "id": "B",
        "html": "<p>The sensors would likely register a much weaker pulling force before the grip gave way.</p>",
        "text": "The sensors would likely register a much weaker pulling force before the grip gave way."
      },
      {
        "id": "C",
        "html": "<p>The sensors would record no measurable force, since sand offers nothing for the foot to grip.</p>",
        "text": "The sensors would record no measurable force, since sand offers nothing for the foot to grip."
      },
      {
        "id": "D",
        "html": "<p>The sensors would show identical readings, since spatulae respond to electron activity rather than surface texture.</p>",
        "text": "The sensors would show identical readings, since spatulae respond to electron activity rather than surface texture."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-29",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "29",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: C\n\n\nExplanation: Paragraph 1 rules out glue and suction, paragraphs 2 and 3 show how an individually weak attraction multiplies across enormous numbers of spatulae into a strong hold, and paragraph 4 describes how that hold is precisely engaged and released with each step, together building toward the idea that a weak force becomes a powerful, controllable grip once spread across countless microscopic structures.\n\n\nA. Incorrect: The passage doesn't attribute the evolution of gecko feet to the weight of glue or suction mechanisms.\n\n\nB. Incorrect: The passage doesn't claim engineers have already surpassed nature's design.\n\n\nC. Correct: The passage traces how an individually weak force becomes powerful and controllable once multiplied across countless spatulae and precisely engaged with each step, which is its central point.\n\n\nD. Incorrect: The passage doesn't focus on a \"recent confirmation\" framing; it explains an established mechanism.",
    "explanationHtml": "<p>Correct Answer: C\n<br>\nExplanation: Paragraph 1 rules out glue and suction, paragraphs 2 and 3 show how an individually weak attraction multiplies across enormous numbers of spatulae into a strong hold, and paragraph 4 describes how that hold is precisely engaged and released with each step, together building toward the idea that a weak force becomes a powerful, controllable grip once spread across countless microscopic structures.\n<br>\nA. Incorrect: The passage doesn't attribute the evolution of gecko feet to the weight of glue or suction mechanisms.\n<br>\nB. Incorrect: The passage doesn't claim engineers have already surpassed nature's design.\n<br>\nC. Correct: The passage traces how an individually weak force becomes powerful and controllable once multiplied across countless spatulae and precisely engaged with each step, which is its central point.\n<br>\nD. Incorrect: The passage doesn't focus on a &quot;recent confirmation&quot; framing; it explains an established mechanism.</p>",
    "points": 1,
    "prompt": "Across the passage as a whole, the author's central point about the gecko's grip is that",
    "promptHtml": "Across the passage as a whole, the author's central point about the gecko's grip is that",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>geckos evolved specialized foot structures because glue and suction proved too heavy for climbing lizards.</p>",
        "text": "geckos evolved specialized foot structures because glue and suction proved too heavy for climbing lizards."
      },
      {
        "id": "B",
        "html": "<p>engineers have already surpassed nature by building adhesives that outperform a gecko's own foot.</p>",
        "text": "engineers have already surpassed nature by building adhesives that outperform a gecko's own foot."
      },
      {
        "id": "C",
        "html": "<p>an extremely weak force becomes powerful and controllable once multiplied across countless structures and precisely engaged.</p>",
        "text": "an extremely weak force becomes powerful and controllable once multiplied across countless structures and precisely engaged."
      },
      {
        "id": "D",
        "html": "<p>researchers recently confirmed that gecko feet secrete no residue and require no air pressure to grip.</p>",
        "text": "researchers recently confirmed that gecko feet secrete no residue and require no air pressure to grip."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-30",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "30",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: D\n\n\nExplanation: Paragraph 5 states directly that the sand-versus-glass contrast \"offers a kind of confirmation of the whole explanation,\" since a van der Waals-based grip should behave exactly this way, weakening wherever stable, close contact cannot form, which is the point the paragraph is included to demonstrate.\n\n\nA. Incorrect: The passage doesn't claim geckos struggle to survive in sandy habitats generally.\n\n\nB. Incorrect: The paragraph doesn't compare the gecko's grip to manufactured tape or robot footpads.\n\n\nC. Incorrect: The sand comparison isn't given to explain why researchers used a sealed, airless chamber; that experiment appears elsewhere in the passage.\n\n\nD. Correct: The passage states the sand comparison \"offers a kind of confirmation of the whole explanation,\" since a van der Waals-based grip should weaken exactly where stable contact cannot form.",
    "explanationHtml": "<p>Correct Answer: D\n<br>\nExplanation: Paragraph 5 states directly that the sand-versus-glass contrast &quot;offers a kind of confirmation of the whole explanation,&quot; since a van der Waals-based grip should behave exactly this way, weakening wherever stable, close contact cannot form, which is the point the paragraph is included to demonstrate.\n<br>\nA. Incorrect: The passage doesn't claim geckos struggle to survive in sandy habitats generally.\n<br>\nB. Incorrect: The paragraph doesn't compare the gecko's grip to manufactured tape or robot footpads.\n<br>\nC. Incorrect: The sand comparison isn't given to explain why researchers used a sealed, airless chamber; that experiment appears elsewhere in the passage.\n<br>\nD. Correct: The passage states the sand comparison &quot;offers a kind of confirmation of the whole explanation,&quot; since a van der Waals-based grip should weaken exactly where stable contact cannot form.</p>",
    "points": 1,
    "prompt": "The author most likely includes the discussion of sand and loose dust in paragraph 5 primarily to",
    "promptHtml": "The author <strong>most likely</strong> includes the discussion of sand and loose dust in paragraph 5 primarily to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggest that geckos struggle to survive in habitats covered mostly in sand and dust.</p>",
        "text": "suggest that geckos struggle to survive in habitats covered mostly in sand and dust."
      },
      {
        "id": "B",
        "html": "<p>compare the strength of a gecko's grip to that of manufactured tape and robot footpads.</p>",
        "text": "compare the strength of a gecko's grip to that of manufactured tape and robot footpads."
      },
      {
        "id": "C",
        "html": "<p>explain why researchers had earlier tested gecko feet inside a sealed, airless chamber.</p>",
        "text": "explain why researchers had earlier tested gecko feet inside a sealed, airless chamber."
      },
      {
        "id": "D",
        "html": "<p>show that the van der Waals explanation predicts exactly where the gecko's grip should weaken.</p>",
        "text": "show that the van der Waals explanation predicts exactly where the gecko's grip should weaken."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-31",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "31",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: B\n\n\nExplanation: Paragraph 1 rules out glue and suction after testing them against direct evidence, and paragraph 5 shows the van der Waals explanation surviving a further test on sand, together illustrating that a sound explanation is one whose predictions continue to hold up even in situations the original evidence never directly examined.\n\n\nA. Incorrect: The passage doesn't claim explanations involving weak or small forces are inherently more reliable than visible mechanisms.\n\n\nB. Correct: The van der Waals explanation survives a further test on sand it wasn't originally designed to address, illustrating that a strong explanation makes predictions that hold up in new situations.\n\n\nC. Incorrect: The passage doesn't argue that the simplest explanation is usually correct despite contradicting evidence.\n\n\nD. Incorrect: The passage doesn't frame trustworthiness as requiring comparison against several alternatives; it emphasizes predictive success.",
    "explanationHtml": "<p>Correct Answer: B\n<br>\nExplanation: Paragraph 1 rules out glue and suction after testing them against direct evidence, and paragraph 5 shows the van der Waals explanation surviving a further test on sand, together illustrating that a sound explanation is one whose predictions continue to hold up even in situations the original evidence never directly examined.\n<br>\nA. Incorrect: The passage doesn't claim explanations involving weak or small forces are inherently more reliable than visible mechanisms.\n<br>\nB. Correct: The van der Waals explanation survives a further test on sand it wasn't originally designed to address, illustrating that a strong explanation makes predictions that hold up in new situations.\n<br>\nC. Incorrect: The passage doesn't argue that the simplest explanation is usually correct despite contradicting evidence.\n<br>\nD. Incorrect: The passage doesn't frame trustworthiness as requiring comparison against several alternatives; it emphasizes predictive success.</p>",
    "points": 1,
    "prompt": "Considering the experiments in paragraph 1 that rule out glue and suction, together with the sand-versus-glass comparison in paragraph 5, what broader theme about scientific explanations does the passage develop?",
    "promptHtml": "Considering the experiments in paragraph 1 that rule out glue and suction, together with the sand-versus-glass comparison in paragraph 5, what broader theme about scientific explanations does the passage develop?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Explanations involving very weak or very small forces are inherently more reliable than visible mechanisms.</p>",
        "text": "Explanations involving very weak or very small forces are inherently more reliable than visible mechanisms."
      },
      {
        "id": "B",
        "html": "<p>A strong explanation should make predictions that hold up even in new, untested situations.</p>",
        "text": "A strong explanation should make predictions that hold up even in new, untested situations."
      },
      {
        "id": "C",
        "html": "<p>The simplest explanation for a phenomenon is usually correct, even when early evidence seems to contradict it.</p>",
        "text": "The simplest explanation for a phenomenon is usually correct, even when early evidence seems to contradict it."
      },
      {
        "id": "D",
        "html": "<p>Explanations become trustworthy once they are checked against several different alternatives and situations.</p>",
        "text": "Explanations become trustworthy once they are checked against several different alternatives and situations."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-32",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "32",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: C\n\n\nExplanation: Paragraph 2 makes clear that the grip comes from electron-level attraction rather than any literal hooks, so the \"hooks\" language in paragraph 4 works figuratively, giving readers a vivid sense of the repeated attach-and-release motion without suggesting that a gecko's toes contain actual physical hooks.\n\n\nA. Incorrect: The \"hooks\" language doesn't correct an earlier claim; the passage already established the electron-based explanation.\n\n\nB. Incorrect: The passage doesn't suggest setae function as literal claws puncturing the surface.\n\n\nC. Correct: Since paragraph 2 already establishes the true electron-based mechanism, the \"hooks\" language in paragraph 4 works figuratively, helping readers picture the repeated action without implying literal hooks.\n\n\nD. Incorrect: The figurative language doesn't signal that the electron-based explanation needed an additional physical mechanism.",
    "explanationHtml": "<p>Correct Answer: C\n<br>\nExplanation: Paragraph 2 makes clear that the grip comes from electron-level attraction rather than any literal hooks, so the &quot;hooks&quot; language in paragraph 4 works figuratively, giving readers a vivid sense of the repeated attach-and-release motion without suggesting that a gecko's toes contain actual physical hooks.\n<br>\nA. Incorrect: The &quot;hooks&quot; language doesn't correct an earlier claim; the passage already established the electron-based explanation.\n<br>\nB. Incorrect: The passage doesn't suggest setae function as literal claws puncturing the surface.\n<br>\nC. Correct: Since paragraph 2 already establishes the true electron-based mechanism, the &quot;hooks&quot; language in paragraph 4 works figuratively, helping readers picture the repeated action without implying literal hooks.\n<br>\nD. Incorrect: The figurative language doesn't signal that the electron-based explanation needed an additional physical mechanism.</p>",
    "points": 1,
    "prompt": "In paragraph 4, the author describes the gecko as “attaching and detaching millions of microscopic hooks” with every step. Given that paragraph 2 explains the grip actually depends on van der Waals attraction rather than physical hooks, what effect does this figurative description most likely have on readers?",
    "promptHtml": "In paragraph 4, the author describes the gecko as “attaching and detaching millions of microscopic hooks” with every step. Given that paragraph 2 explains the grip actually depends on van der Waals attraction rather than physical hooks, what effect does this figurative description <strong>most likely</strong> have on readers?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>It corrects an earlier claim in the passage that no physical structures are involved in the grip.</p>",
        "text": "It corrects an earlier claim in the passage that no physical structures are involved in the grip."
      },
      {
        "id": "B",
        "html": "<p>It suggests that setae function as tiny claws that puncture the surface with each step.</p>",
        "text": "It suggests that setae function as tiny claws that puncture the surface with each step."
      },
      {
        "id": "C",
        "html": "<p>It helps readers picture a repeated, mechanical action without implying that the gecko's toes contain literal hooks.</p>",
        "text": "It helps readers picture a repeated, mechanical action without implying that the gecko's toes contain literal hooks."
      },
      {
        "id": "D",
        "html": "<p>It signals that the electron-based explanation given earlier needed an additional physical mechanism.</p>",
        "text": "It signals that the electron-based explanation given earlier needed an additional physical mechanism."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-33",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "33",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "The two tests in paragraph 1 rule out sticky residue and suction as explanations; the electron-level attraction described in paragraph 2 and the release triggered by tilting a seta past about thirty degrees in paragraph 4 explain steps in how the grip physically works; and the two details from paragraph 5 about sand and dust show situations where that grip is noticeably less effective.",
    "explanationHtml": "<p>The two tests in paragraph 1 rule out sticky residue and suction as explanations; the electron-level attraction described in paragraph 2 and the release triggered by tilting a seta past about thirty degrees in paragraph 4 explain steps in how the grip physically works; and the two details from paragraph 5 about sand and dust show situations where that grip is noticeably less effective.</p>",
    "points": 1,
    "prompt": "Each row below restates a detail from the passage. For each one, identify whether it primarily rules out an incorrect explanation for the gecko's grip, explains a step in how the grip physically works, or shows a situation where the grip is less effective.",
    "promptHtml": "Each row below restates a detail from the passage. For each one, identify whether it primarily rules out an incorrect explanation for the gecko's grip, explains a step in how the grip physically works, or shows a situation where the grip is less effective.",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "column-1",
        "title": "Rules out an incorrect explanation for the gecko's grip"
      },
      {
        "id": "column-2",
        "title": "Explains a step in how the grip physically works"
      },
      {
        "id": "column-3",
        "title": "Shows a situation where the grip does not work as well"
      }
    ],
    "correctPlacements": {
      "row-1": "column-1",
      "row-2": "column-2",
      "row-3": "column-3",
      "row-4": "column-2",
      "row-5": "column-1",
      "row-6": "column-3"
    },
    "instructions": "Select one answer in each row.",
    "items": [
      {
        "html": "<p>Pressing a clean, residue-free foot to glass produces the same strong grip as before.</p>",
        "id": "row-1",
        "text": "Pressing a clean, residue-free foot to glass produces the same strong grip as before."
      },
      {
        "html": "<p>Electrons in a spatula and electrons in a surface tug at one another once they are close enough to touch.</p>",
        "id": "row-2",
        "text": "Electrons in a spatula and electrons in a surface tug at one another once they are close enough to touch."
      },
      {
        "html": "<p>A shifting, loosely packed surface keeps breaking contact before a strong hold can form.</p>",
        "id": "row-3",
        "text": "A shifting, loosely packed surface keeps breaking contact before a strong hold can form."
      },
      {
        "html": "<p>Tilting a seta backward past roughly thirty degrees causes it to release almost instantly.</p>",
        "id": "row-4",
        "text": "Tilting a seta backward past roughly thirty degrees causes it to release almost instantly."
      },
      {
        "html": "<p>Removing the air from a sealed chamber around a gripping gecko does not weaken its hold.</p>",
        "id": "row-5",
        "text": "Removing the air from a sealed chamber around a gripping gecko does not weaken its hold."
      },
      {
        "html": "<p>Even a capable gecko foot has trouble gripping fine dust or loose sand.</p>",
        "id": "row-6",
        "text": "Even a capable gecko foot has trouble gripping fine dust or loose sand."
      }
    ],
    "requiredPlacements": 6,
    "tableHeaders": {
      "answer": "Answer",
      "row": "Statement"
    },
    "type": "matrix_choice"
  },
  {
    "id": "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-34",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "34",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: D\n\n\nExplanation: The sentence about sand's shifting surface breaking contact \"before the van der Waals force has a chance to build\" directly links the same close-contact requirement to both outcomes, while the other quoted sentences describe the grip's strength or its electron-level cause without addressing why sand behaves differently from glass.\n\n\nA. Incorrect: This sentence describes the grip's strength on glass, not why sand behaves differently.\n\n\nB. Incorrect: This sentence explains the electron-level cause of the attraction generally, not why sand specifically differs from glass.\n\n\nC. Incorrect: This sentence describes success on glass but doesn't explain the shared underlying requirement that also explains failure on sand.\n\n\nD. Correct: This sentence directly explains that sand's shifting surface prevents the same close, stable contact that glass allows, linking both outcomes to the same requirement.",
    "explanationHtml": "<p>Correct Answer: D\n<br>\nExplanation: The sentence about sand's shifting surface breaking contact &quot;before the van der Waals force has a chance to build&quot; directly links the same close-contact requirement to both outcomes, while the other quoted sentences describe the grip's strength or its electron-level cause without addressing why sand behaves differently from glass.\n<br>\nA. Incorrect: This sentence describes the grip's strength on glass, not why sand behaves differently.\n<br>\nB. Incorrect: This sentence explains the electron-level cause of the attraction generally, not why sand specifically differs from glass.\n<br>\nC. Incorrect: This sentence describes success on glass but doesn't explain the shared underlying requirement that also explains failure on sand.\n<br>\nD. Correct: This sentence directly explains that sand's shifting surface prevents the same close, stable contact that glass allows, linking both outcomes to the same requirement.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that the same need for close, stable contact explains both why a gecko grips glass well and why it struggles on sand?",
    "promptHtml": "Which sentence from the passage <strong>best</strong> supports the idea that the same need for close, stable contact explains both why a gecko grips glass well and why it struggles on sand?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>“these countless weak pulls add up to an adhesive force many times the gecko's body weight” (paragraph 3).</p>",
        "text": "“these countless weak pulls add up to an adhesive force many times the gecko's body weight” (paragraph 3)."
      },
      {
        "id": "B",
        "html": "<p>“the electrons orbiting its atoms and the electrons in the surface's atoms begin to tug at one another” (paragraph 2).</p>",
        "text": "“the electrons orbiting its atoms and the electrons in the surface's atoms begin to tug at one another” (paragraph 2)."
      },
      {
        "id": "C",
        "html": "<p>“Setae grip smooth glass with ease since spatulae can settle into close, uninterrupted contact” (paragraph 5).</p>",
        "text": "“Setae grip smooth glass with ease since spatulae can settle into close, uninterrupted contact” (paragraph 5)."
      },
      {
        "id": "D",
        "html": "<p>“the surface keeps shifting and breaking contact before the van der Waals force can build” (paragraph 5).</p>",
        "text": "“the surface keeps shifting and breaking contact before the van der Waals force can build” (paragraph 5)."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4",
  versionLabels: ["Digital SHSAT Practice Test 4"],
  section: "reading",
  questionCount: excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-grip-that-shouldn-t-work-digital-shsat-practice-test-4",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from &quot;The Grip That Shouldn’t Work&quot;",
    blurbHtml: "<p><em>Simone Nakamura is a science writer who covers biomechanics and materials science. The following is adapted from her article on how geckos climb smooth vertical surfaces.</em></p>",
    bylineHtml: "by Simone Nakamura",
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-66050f1c9020a8c9d047","label":"Digital SHSAT Practice Test 4","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2","packageId":"3cc3d599a78595e5bfd2c1d8123f21799bd0d3a7fb628ccee02161f56820902d","originalPackageId":"e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"},
    title: "Excerpt from \"The Grip That Shouldn’t Work\"",
    author: "Simone Nakamura",
    byline: "by Simone Nakamura",
    blurb: "Simone Nakamura is a science writer who covers biomechanics and materials science. The following is adapted from her article on how geckos climb smooth vertical surfaces.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>A gecko can sprint up a pane of window glass, cross onto the ceiling, and hang there by a single toe, upside down, without ever slowing to find a grip. For a long time this seemed to demand some kind of trick: a sticky secretion, perhaps, left behind wherever the foot touched, or thousands of microscopic suction cups pressed flat against the glass. Both explanations turn out to be wrong. Wipe a gecko's foot clean and press it to glass and it grips exactly as well as before, which rules out any residue. Place it in a sealed chamber with the air pumped out, removing any possibility of suction, and the grip holds just as strongly. The real explanation is stranger than either guess, since it depends on a force so weak that a single instance of it could not hold up a grain of sand, let alone a lizard.</p><p>The gecko's foot is covered in ridges of hair-like structures called setae, each thinner than a human hair and packed so densely that a single toe carries roughly half a million of them. Under a microscope, every seta splits at its tip into hundreds of even finer branches, called spatulae, each one flattened like a tiny paddle only a few hundred nanometers across. It is at this scale, far below anything the unaided eye could resolve, that the actual grip takes place. When a spatula presses close enough to a surface, the electrons orbiting its atoms and the electrons in the surface's atoms begin to tug at one another, forming a weak attraction known as a van der Waals force. No glue, no moisture, and no muscular clamping are involved at all; the same attraction exists, faintly, between almost any two surfaces brought close enough together, whether or not either one is alive.</p><p>A single van der Waals attraction is almost nothing, far too faint to notice in ordinary life. What makes the gecko's grip strong is sheer number. Multiplied across hundreds of millions of spatulae spread over all four feet, these countless weak pulls add up to an adhesive force many times the gecko's own body weight, more than enough to let it hang from a single toe. Researchers who have measured this directly, by attaching tiny force sensors to a gecko's foot as it clings to a glass plate and gently pulling until the grip releases, have recorded forces strong enough that a sheet of spatulae the size of a human hand, if such a thing existed, could theoretically support the weight of an adult person.</p><p>The gecko does not simply mash its foot against a surface and stay stuck forever, which would make climbing impossible rather than easy. Instead it engages and releases its grip with each step, angling its toes to bring the spatulae into close contact on the way down and peeling them away, a fraction of a degree at a time, on the way up. That peeling angle turns out to matter enormously: press a seta straight down against a surface and it grips fiercely, but tilt it back past a certain point, roughly thirty degrees in most studies, and the same structure releases almost instantly, with barely any effort at all. A gecko crossing a ceiling is, in effect, constantly attaching and detaching millions of microscopic hooks in a single fluid motion, fast enough that the whole process looks, to a human eye, like nothing more than an ordinary walk.</p><p>Not every surface cooperates equally well. Setae grip smooth glass or polished stone with ease, since the spatulae can settle into close, uninterrupted contact across a wide area. On loosely packed sand or fine dust, by contrast, even a gecko's remarkable foot struggles, because the surface itself keeps shifting and breaking the contact before the van der Waals force has a chance to build. This limitation offers a kind of confirmation of the whole explanation: a sticky secretion would work about as well on either surface, and a suction cup would fail on both, but a force that depends on extremely close, stable contact would behave exactly as the gecko's grip actually does, strong on glass and weak on sand.</p><p>Understanding this mechanism has done more than settle an old question about lizards. Engineers have already built experimental adhesive tape and robot footpads modeled on the same branching, angle-dependent structure, aiming for a grip that holds firmly under load yet releases cleanly and leaves no residue behind, unlike ordinary tape or glue. None of these materials yet matches what evolution produced in a gecko's toe, but each attempt starts from the same discovery: a force too weak to matter on its own can become one of the strongest grips in nature, once it is divided finely enough and multiplied often enough.</p>",
    text: excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4PassageText,
    versionLabel: "Digital SHSAT Practice Test 4",
  }),
  questions: excerptFromTheGripThatShouldnTWorkDigitalShsatPracticeTest4Questions,
};
