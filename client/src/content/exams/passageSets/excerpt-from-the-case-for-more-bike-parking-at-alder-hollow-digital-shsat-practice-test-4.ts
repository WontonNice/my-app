import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4PassageText = "(1) Every morning, dozens of students at Alder Hollow Middle School arrive on bicycles, and most of them end up leaning their bikes against the fence by the gym doors because there is nowhere else to put them. (2) When the parent group first raised the idea of a real bike rack two years ago, they spoke with the office staff about the fence, and they never got a clear answer about whether the request was even being considered. (3) The gym doors themselves are painted dark green to match the school's colors. (4) Last spring, three bikes were stolen from the fence in a single week. (5) Two more bikes were knocked over and damaged during a windstorm the same month.\n(6) A covered bike rack near the main entrance would solve both problems at once. (7) The rack would give students a sturdy metal frame to lock their bikes to. (8) A simple roof would keep seats and gears dry during rainy mornings. (9) Riverbend Elementary, a school in our own district, installed a covered rack two years ago, and bike ridership there have nearly doubled since, according to a count the front office took each September.\n(10) Some administrators worry that a bike rack is an expense the school cannot justify right now. (11) The district's own facilities office estimates the cost of a twenty-space covered rack at under two thousand dollars, less than the school spends on hallway floor wax in a single year. (12) That is a small price for a change that could get more students moving safely under their own power instead of adding to the carpool line outside the office every morning. (13) A parent-teacher group has even offered to cover part of the cost through a fall fundraiser if the school commits to the project this year.\n(14) Other students point out that biking is not for everyone, students living far from school or on busy roads may reasonably prefer the bus or a ride from a parent. (15) No one is proposing that biking replace those options. (16) The goal is simply to make biking safe and practical for the students who already choose it, rather than leaving them to guess where an unwatched bike might still be standing at the end of the day. (17) A covered rack costs little, solves a problem families have raised for two years, and rewards students who are already doing exactly what the school claims to want: getting to school under their own power.";

const excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-41",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "41",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: B\n\n\nExplanation: The second \"they\" in sentence (2) could point to either the parent group or the office staff, since both are plural nouns nearby; replacing it with \"the parent group\" makes clear that the parents, not the staff, were the ones left without an answer, which fits the paragraph's complaint about being ignored for two years.\n\n\nA. Incorrect: Repeating \"the office staff\" twice removes the ambiguity but wrongly implies the staff themselves never got an answer, when the paragraph's complaint is about the parent group being left without one.\n\n\nB. Correct: Replacing the ambiguous \"they\" with \"the parent group\" makes clear that the parents, not the staff, were the ones left without an answer, matching the paragraph's complaint.\n\n\nC. Incorrect: This still leaves an ambiguous \"they\" that could point to either \"the group\" or \"the office staff.\"\n\n\nD. Incorrect: Renaming \"office staff\" to \"staff members\" doesn't resolve the ambiguity, since the sentence still ends with an unclear \"they.\"",
    "explanationHtml": "<p>Correct Answer: B\n<br>\nExplanation: The second &quot;they&quot; in sentence (2) could point to either the parent group or the office staff, since both are plural nouns nearby; replacing it with &quot;the parent group&quot; makes clear that the parents, not the staff, were the ones left without an answer, which fits the paragraph's complaint about being ignored for two years.\n<br>\nA. Incorrect: Repeating &quot;the office staff&quot; twice removes the ambiguity but wrongly implies the staff themselves never got an answer, when the paragraph's complaint is about the parent group being left without one.\n<br>\nB. Correct: Replacing the ambiguous &quot;they&quot; with &quot;the parent group&quot; makes clear that the parents, not the staff, were the ones left without an answer, matching the paragraph's complaint.\n<br>\nC. Incorrect: This still leaves an ambiguous &quot;they&quot; that could point to either &quot;the group&quot; or &quot;the office staff.&quot;\n<br>\nD. Incorrect: Renaming &quot;office staff&quot; to &quot;staff members&quot; doesn't resolve the ambiguity, since the sentence still ends with an unclear &quot;they.&quot;</p>",
    "points": 1,
    "prompt": "In sentence (2), the pronoun they appears twice, and its second use could refer to either the parent group or the office staff. Which revision best fixes this unclear pronoun reference?",
    "promptHtml": "In sentence (2), the pronoun <em>they</em> appears twice, and its second use could refer to either the parent group or the office staff. Which revision <strong>best</strong> fixes this unclear pronoun reference?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>They spoke with the office staff about the fence, and the office staff never got a clear answer.</p>",
        "text": "They spoke with the office staff about the fence, and the office staff never got a clear answer."
      },
      {
        "id": "B",
        "html": "<p>They spoke with the office staff about the fence, and the parent group never got a clear answer.</p>",
        "text": "They spoke with the office staff about the fence, and the parent group never got a clear answer."
      },
      {
        "id": "C",
        "html": "<p>The group spoke with the office staff about the fence, and they never got a clear answer.</p>",
        "text": "The group spoke with the office staff about the fence, and they never got a clear answer."
      },
      {
        "id": "D",
        "html": "<p>They spoke with the staff members about the fence, and they never got a clear answer.</p>",
        "text": "They spoke with the staff members about the fence, and they never got a clear answer."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-42",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "42",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Sentences (7) and (8) describe two separate, complementary benefits of the same rack — a frame to lock bikes to and a roof that keeps gear dry — so the coordinating conjunction \"and\" joins them correctly as parallel ideas, while \"but\" wrongly suggests a contrast, \"which\" would misleadingly attach to \"bikes\" rather than start a new independent clause, and \"so\" incorrectly implies that the frame causes the roof to keep things dry.",
    "explanationHtml": "<p>Sentences (7) and (8) describe two separate, complementary benefits of the same rack — a frame to lock bikes to and a roof that keeps gear dry — so the coordinating conjunction &quot;and&quot; joins them correctly as parallel ideas, while &quot;but&quot; wrongly suggests a contrast, &quot;which&quot; would misleadingly attach to &quot;bikes&quot; rather than start a new independent clause, and &quot;so&quot; incorrectly implies that the frame causes the roof to keep things dry.</p>",
    "points": 1,
    "prompt": "Sentences (7) and (8) can be combined into a single, smoother sentence. Click the word that best joins the two ideas without changing their meaning.",
    "promptHtml": "Sentences (7) and (8) can be combined into a single, smoother sentence. Click the word that <strong>best</strong> joins the two ideas without changing their meaning.",
    "selectionHtml": "<p>The rack would give students a sturdy metal frame to lock their bikes to, <span data-choice-id=\"A\"><p><strong>and</strong></p></span> <span data-choice-id=\"B\"><p><strong>but</strong></p></span> <span data-choice-id=\"C\"><p><strong>which</strong></p></span> <span data-choice-id=\"D\"><p><strong>so</strong></p></span> a simple roof would keep seats and gears dry during rainy mornings.</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p><strong>and</strong></p>",
        "text": "and"
      },
      {
        "id": "B",
        "html": "<p><strong>but</strong></p>",
        "text": "but"
      },
      {
        "id": "C",
        "html": "<p><strong>which</strong></p>",
        "text": "which"
      },
      {
        "id": "D",
        "html": "<p><strong>so</strong></p>",
        "text": "so"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-43",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "43",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: C\n\n\nExplanation: The subject of the clause is the singular noun \"ridership,\" so it needs the singular verb \"has\" rather than the plural \"have\"; leaving \"have\" in place, turning the verb into the fragment \"having,\" or switching the subject to the plural \"riders\" either fails to fix the error or changes what the sentence is actually claiming.\n\n\nA. Incorrect: This keeps \"have,\" leaving the subject-verb agreement error uncorrected, and also changes \"nearly\" to \"already.\"\n\n\nB. Incorrect: Turning the verb into \"having\" removes the main verb entirely, creating a fragment rather than fixing the agreement error.\n\n\nC. Correct: \"Ridership\" is a singular noun, so it requires the singular verb \"has\" rather than the plural \"have.\"\n\n\nD. Incorrect: Changing \"ridership\" to \"riders\" fixes the agreement by altering the subject rather than correcting the verb, and it changes what the sentence is actually claiming.",
    "explanationHtml": "<p>Correct Answer: C\n<br>\nExplanation: The subject of the clause is the singular noun &quot;ridership,&quot; so it needs the singular verb &quot;has&quot; rather than the plural &quot;have&quot;; leaving &quot;have&quot; in place, turning the verb into the fragment &quot;having,&quot; or switching the subject to the plural &quot;riders&quot; either fails to fix the error or changes what the sentence is actually claiming.\n<br>\nA. Incorrect: This keeps &quot;have,&quot; leaving the subject-verb agreement error uncorrected, and also changes &quot;nearly&quot; to &quot;already.&quot;\n<br>\nB. Incorrect: Turning the verb into &quot;having&quot; removes the main verb entirely, creating a fragment rather than fixing the agreement error.\n<br>\nC. Correct: &quot;Ridership&quot; is a singular noun, so it requires the singular verb &quot;has&quot; rather than the plural &quot;have.&quot;\n<br>\nD. Incorrect: Changing &quot;ridership&quot; to &quot;riders&quot; fixes the agreement by altering the subject rather than correcting the verb, and it changes what the sentence is actually claiming.</p>",
    "points": 1,
    "prompt": "In sentence (9), which revision corrects the subject-verb agreement error in the phrase bike ridership there have nearly doubled?",
    "promptHtml": "In sentence (9), which revision corrects the subject-verb agreement error in the phrase <em>bike ridership there have nearly doubled</em>?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>bike ridership there have already doubled since</p>",
        "text": "bike ridership there have already doubled since"
      },
      {
        "id": "B",
        "html": "<p>bike ridership there having nearly doubled since</p>",
        "text": "bike ridership there having nearly doubled since"
      },
      {
        "id": "C",
        "html": "<p>bike ridership there has nearly doubled since</p>",
        "text": "bike ridership there has nearly doubled since"
      },
      {
        "id": "D",
        "html": "<p>bike riders there have nearly doubled since</p>",
        "text": "bike riders there have nearly doubled since"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-44",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "44",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: D\n\n\nExplanation: The clause \"biking is not for everyone\" and the clause about students preferring the bus are both complete sentences, so joining them with only a comma creates a comma splice; a semicolon correctly separates the two independent clauses, while dropping the comma, adding \"however\" after a comma, or doubling the comma all leave the clauses improperly joined.\n\n\nA. Incorrect: Removing all punctuation between the two independent clauses creates a run-on sentence.\n\n\nB. Incorrect: Adding \"however\" after only a comma still leaves two independent clauses joined by nothing stronger than a comma, so the splice remains.\n\n\nC. Incorrect: Doubling the comma with \"and,\" still doesn't correctly join the two independent clauses.\n\n\nD. Correct: A semicolon correctly joins the two independent clauses without creating a splice or a run-on.",
    "explanationHtml": "<p>Correct Answer: D\n<br>\nExplanation: The clause &quot;biking is not for everyone&quot; and the clause about students preferring the bus are both complete sentences, so joining them with only a comma creates a comma splice; a semicolon correctly separates the two independent clauses, while dropping the comma, adding &quot;however&quot; after a comma, or doubling the comma all leave the clauses improperly joined.\n<br>\nA. Incorrect: Removing all punctuation between the two independent clauses creates a run-on sentence.\n<br>\nB. Incorrect: Adding &quot;however&quot; after only a comma still leaves two independent clauses joined by nothing stronger than a comma, so the splice remains.\n<br>\nC. Incorrect: Doubling the comma with &quot;and,&quot; still doesn't correctly join the two independent clauses.\n<br>\nD. Correct: A semicolon correctly joins the two independent clauses without creating a splice or a run-on.</p>",
    "points": 1,
    "prompt": "Which revision best corrects the comma splice in sentence (14)?",
    "promptHtml": "Which revision <strong>best</strong> corrects the comma splice in sentence (14)?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>Other students point out that biking is not for everyone students living far from school or on busy roads may reasonably prefer the bus.</p>",
        "text": "Other students point out that biking is not for everyone students living far from school or on busy roads may reasonably prefer the bus."
      },
      {
        "id": "B",
        "html": "<p>Other students point out that biking is not for everyone, however students living far from school or on busy roads may reasonably prefer the bus.</p>",
        "text": "Other students point out that biking is not for everyone, however students living far from school or on busy roads may reasonably prefer the bus."
      },
      {
        "id": "C",
        "html": "<p>Other students point out that biking is not for everyone, and, students living far from school or on busy roads may reasonably prefer the bus.</p>",
        "text": "Other students point out that biking is not for everyone, and, students living far from school or on busy roads may reasonably prefer the bus."
      },
      {
        "id": "D",
        "html": "<p>Other students point out that biking is not for everyone; students living far from school or on busy roads may reasonably prefer the bus.</p>",
        "text": "Other students point out that biking is not for everyone; students living far from school or on busy roads may reasonably prefer the bus."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-45",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "45",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: A\n\n\nExplanation: Paragraph 1 builds its case around bikes being stolen and damaged at the unguarded fence, but the detail about the gym doors being painted to match the school's colors has nothing to do with theft, damage, or the lack of proper parking, so it does not support the paragraph's point and should be cut.\n\n\nA. Correct: The detail about the gym doors' color has nothing to do with bike theft, damage, or parking, so it doesn't support the paragraph's focus.\n\n\nB. Incorrect: This detail directly supports the paragraph's point about the lack of proper parking.\n\n\nC. Incorrect: This detail supports the paragraph's broader complaint about the issue being ignored.\n\n\nD. Incorrect: This detail is a direct example of the bike damage the paragraph is describing.",
    "explanationHtml": "<p>Correct Answer: A\n<br>\nExplanation: Paragraph 1 builds its case around bikes being stolen and damaged at the unguarded fence, but the detail about the gym doors being painted to match the school's colors has nothing to do with theft, damage, or the lack of proper parking, so it does not support the paragraph's point and should be cut.\n<br>\nA. Correct: The detail about the gym doors' color has nothing to do with bike theft, damage, or parking, so it doesn't support the paragraph's focus.\n<br>\nB. Incorrect: This detail directly supports the paragraph's point about the lack of proper parking.\n<br>\nC. Incorrect: This detail supports the paragraph's broader complaint about the issue being ignored.\n<br>\nD. Incorrect: This detail is a direct example of the bike damage the paragraph is describing.</p>",
    "points": 1,
    "prompt": "The sentence that should be deleted from paragraph 1 because it does not support the paragraph's focus on bike theft and damage is",
    "promptHtml": "The sentence that should be deleted from paragraph 1 because it does not support the paragraph's focus on bike theft and damage is",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the gym doors themselves are painted dark green to match the school's colors.</p>",
        "text": "the gym doors themselves are painted dark green to match the school's colors."
      },
      {
        "id": "B",
        "html": "<p>leaning their bikes against the fence because there is nowhere else to put them.</p>",
        "text": "leaning their bikes against the fence because there is nowhere else to put them."
      },
      {
        "id": "C",
        "html": "<p>they never got a clear answer about whether the request was even being considered.</p>",
        "text": "they never got a clear answer about whether the request was even being considered."
      },
      {
        "id": "D",
        "html": "<p>two more bikes were knocked over and damaged during a windstorm the same month.</p>",
        "text": "two more bikes were knocked over and damaged during a windstorm the same month."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4-satcc-66050f1c9020a8c9d047-ela-46",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-66050f1c9020a8c9d047",
      "label": "Digital SHSAT Practice Test 4",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2",
      "section": "ela",
      "sourceQuestion": "46",
      "originalPackageId": "e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"
    },
    "explanation": "Correct Answer: D\n\n\nExplanation: \"However\" is the connective that signals a genuine turn from Riverbend's success story to the cost concern raised in the sentences that follow, matching the contrastive relationship between the two ideas.\n\n\nA. Incorrect: \"For example\" would suggest the administrators' concern is an illustration of Riverbend's success, not a shift away from it.\n\n\nB. Incorrect: \"In fact\" suggests agreement or continuation with the previous point rather than a contrasting concern.\n\n\nC. Incorrect: \"Similarly\" implies the concern parallels Riverbend's success rather than contrasting with it.\n\n\nD. Correct: \"However\" clearly signals the shift from Riverbend's positive example to the contrasting concern about cost that follows.",
    "explanationHtml": "<p>Correct Answer: D\n<br>\nExplanation: &quot;However&quot; is the connective that signals a genuine turn from Riverbend's success story to the cost concern raised in the sentences that follow, matching the contrastive relationship between the two ideas.\n<br>\nA. Incorrect: &quot;For example&quot; would suggest the administrators' concern is an illustration of Riverbend's success, not a shift away from it.\n<br>\nB. Incorrect: &quot;In fact&quot; suggests agreement or continuation with the previous point rather than a contrasting concern.\n<br>\nC. Incorrect: &quot;Similarly&quot; implies the concern parallels Riverbend's success rather than contrasting with it.\n<br>\nD. Correct: &quot;However&quot; clearly signals the shift from Riverbend's positive example to the contrasting concern about cost that follows.</p>",
    "points": 1,
    "prompt": "Which transition, added to the beginning of sentence (10), would most clearly signal the shift from Riverbend Elementary's success to the concern raised in the sentences that follow?",
    "promptHtml": "Which transition, added to the beginning of sentence (10), would <strong>most clearly</strong> signal the shift from Riverbend Elementary's success to the concern raised in the sentences that follow?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>For example, some administrators worry that a bike rack is an expense the school cannot justify right now.</p>",
        "text": "For example, some administrators worry that a bike rack is an expense the school cannot justify right now."
      },
      {
        "id": "B",
        "html": "<p>In fact, some administrators worry that a bike rack is an expense the school cannot justify right now.</p>",
        "text": "In fact, some administrators worry that a bike rack is an expense the school cannot justify right now."
      },
      {
        "id": "C",
        "html": "<p>Similarly, some administrators worry that a bike rack is an expense the school cannot justify right now.</p>",
        "text": "Similarly, some administrators worry that a bike rack is an expense the school cannot justify right now."
      },
      {
        "id": "D",
        "html": "<p>However, some administrators worry that a bike rack is an expense the school cannot justify right now.</p>",
        "text": "However, some administrators worry that a bike rack is an expense the school cannot justify right now."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4",
  versionLabels: ["Digital SHSAT Practice Test 4"],
  section: "reading",
  questionCount: excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-case-for-more-bike-parking-at-alder-hollow-digital-shsat-practice-test-4",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Excerpt from &quot;The Case for More Bike Parking at Alder Hollow&quot;",
    blurbHtml: "<p><em>The following is a draft essay written by a student for the school newspaper’s opinion column. Some sentences may contain errors.</em></p>",
    bylineHtml: "by Student Author",
    source: {"sourceFamily":"sat_crash_course","sourceFormat":"web","playerProfile":"sat_crash_course","sourceId":"satcc-66050f1c9020a8c9d047","label":"Digital SHSAT Practice Test 4","url":"https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%204%20v2","packageId":"3cc3d599a78595e5bfd2c1d8123f21799bd0d3a7fb628ccee02161f56820902d","originalPackageId":"e079fb2c7ea4db9052ede318e1b6b8d6648eef4016e17c0f77927142d0a805a9"},
    title: "Excerpt from \"The Case for More Bike Parking at Alder Hollow\"",
    author: "Student Author",
    byline: "by Student Author",
    blurb: "The following is a draft essay written by a student for the school newspaper’s opinion column. Some sentences may contain errors.",
    passageType: "long_reading",
    passageCategory: "prestige",
    richText: "<p>(1) Every morning, dozens of students at Alder Hollow Middle School arrive on bicycles, and most of them end up leaning their bikes against the fence by the gym doors because there is nowhere else to put them. (2) When the parent group first raised the idea of a real bike rack two years ago, they spoke with the office staff about the fence, and they never got a clear answer about whether the request was even being considered. (3) The gym doors themselves are painted dark green to match the school's colors. (4) Last spring, three bikes were stolen from the fence in a single week. (5) Two more bikes were knocked over and damaged during a windstorm the same month.</p><p>(6) A covered bike rack near the main entrance would solve both problems at once. (7) The rack would give students a sturdy metal frame to lock their bikes to. (8) A simple roof would keep seats and gears dry during rainy mornings. (9) Riverbend Elementary, a school in our own district, installed a covered rack two years ago, and bike ridership there have nearly doubled since, according to a count the front office took each September.</p><p>(10) Some administrators worry that a bike rack is an expense the school cannot justify right now. (11) The district's own facilities office estimates the cost of a twenty-space covered rack at under two thousand dollars, less than the school spends on hallway floor wax in a single year. (12) That is a small price for a change that could get more students moving safely under their own power instead of adding to the carpool line outside the office every morning. (13) A parent-teacher group has even offered to cover part of the cost through a fall fundraiser if the school commits to the project this year.</p><p>(14) Other students point out that biking is not for everyone, students living far from school or on busy roads may reasonably prefer the bus or a ride from a parent. (15) No one is proposing that biking replace those options. (16) The goal is simply to make biking safe and practical for the students who already choose it, rather than leaving them to guess where an unwatched bike might still be standing at the end of the day. (17) A covered rack costs little, solves a problem families have raised for two years, and rewards students who are already doing exactly what the school claims to want: getting to school under their own power.</p>",
    text: excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4PassageText,
    versionLabel: "Digital SHSAT Practice Test 4",
  }),
  questions: excerptFromTheCaseForMoreBikeParkingAtAlderHollowDigitalShsatPracticeTest4Questions,
};
