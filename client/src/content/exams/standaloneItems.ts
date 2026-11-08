import type { ExamQuestion } from "./types";

export const standaloneItems: (ExamQuestion & { versionLabel?: string; versionLabels?: string[]; duplicateOf?: string; canonicalContent?: boolean })[] = [
  {
    "id": "standalone-vague-pronoun-1",
    "points": 1,
    "prompt": "Which sentence should be revised to correct a vague pronoun?",
    "promptHtml": "<p>Which sentence should be revised to correct a vague pronoun?</p>",
    "stimulus": "(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade.  (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events.  (3) Outside of school, she also sings in a choir made up of young and old members of her community.  (4) Both girls hope that they will be able to continue singing for many more years.",
    "topic": "Pronouns",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "choices": [
      {
        "id": "A",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "versionLabel": "2017-2018 Form A",
    "explanation": "5. (C) The question asks the student to identify a vague pronoun in a sentence in the box. Sentence 1 (Option A) correctly uses the plural pronouns “their”/”they” to refer to both Eliza and Brianna. Sentence 2 (Option B)\n\nuses the pronoun “they” to correctly refer to both girls again. Sentence 4 (Option D) uses the pronoun “they” to correctly refer to “both girls.” Sentence 3 (Option C) is the only sentence where the pronoun is vague. The sentence uses the pronoun “she” near the beginning, but whether “she” refers to Eliza or Brianna is unclear.",
    "explanationHtml": "<p>5. (C) The question asks the student to identify a vague pronoun in a sentence in the box. Sentence 1 (Option A) correctly uses the plural pronouns “their”/”they” to refer to both Eliza and Brianna. Sentence 2 (Option B)</p><p>uses the pronoun “they” to correctly refer to both girls again. Sentence 4 (Option D) uses the pronoun “they” to correctly refer to “both girls.” Sentence 3 (Option C) is the only sentence where the pronoun is vague. The sentence uses the pronoun “she” near the beginning, but whether “she” refers to Eliza or Brianna is unclear.</p>"
  },
  {
    "id": "standalone-pancakes-1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "collection": "official_handbook",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        3
      ]
    },
    "explanation": "The question asks which two revisions are needed to correct the paragraph.\n\nA. Incorrect. The comma is needed after “Yalina” to separate the first and second names in the series of three names (Yalina, Michael, and Malcolm). The possessive determiner “their” is also correct as written because it refers back to “Yalina, Michael, and Malcolm,” a plural group of people. B. Incorrect. Changing “is” to “are” would introduce an error in subject-verb agreement into the sentence; the singular subject “Yalina’s job” requires the singular verb “is.” The comma after “bowl” is required because it separates the phrase “slowly adding water, eggs, melted butter, and blueberries,” which modifies how Yalina prepares the batter, from the remainder of the sentence. C. Incorrect. “It is” refers to the singular noun “mixture,” so this singular pronoun and verb form is correct. The comma after “smooth” is necessary because this is a compound sentence where two independent clauses (“Michael uses a wooden spoon to vigorously stir the mixture until it is smooth” and “Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time”) are joined using a coordinating conjunction, which requires a comma. D. CORRECT. The plural pronoun “they” refers incorrectly to a singular antecedent, “each pancake.” The pronoun should be changed to a singular one to match its antecedent. A comma is needed between two adjectives of equal importance that modify the noun “breakfast.” Because “sweet” and “delicious” could be written as “sweet and delicious,” they are of equal importance, and a comma is needed.",
    "explanationHtml": "<p>The question asks which two revisions are needed to correct the paragraph.</p><p><strong>A. </strong>Incorrect. The comma is needed after “Yalina” to separate the first and second names in the series of three names (Yalina, Michael, and Malcolm). The possessive determiner “their” is also correct as written because it refers back to “Yalina, Michael, and Malcolm,” a plural group of people. <strong>B. </strong>Incorrect. Changing “is” to “are” would introduce an error in subject-verb agreement into the sentence; the singular subject “Yalina’s job” requires the singular verb “is.” The comma after “bowl” is required because it separates the phrase “slowly adding water, eggs, melted butter, and blueberries,” which modifies how Yalina prepares the batter, from the remainder of the sentence. <strong>C. </strong>Incorrect. “It is” refers to the singular noun “mixture,” so this singular pronoun and verb form is correct. The comma after “smooth” is necessary because this is a compound sentence where two independent clauses (“Michael uses a wooden spoon to vigorously stir the mixture until it is smooth” and “Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time”) are joined using a coordinating conjunction, which requires a comma. <strong>D. CORRECT. </strong>The plural pronoun “they” refers incorrectly to a singular antecedent, “each pancake.” The pronoun should be changed to a singular one to match its antecedent. A comma is needed between two adjectives of equal importance that modify the noun “breakfast.” Because “sweet” and “delicious” could be written as “sweet and delicious,” they are of equal importance, and a comma is needed.</p>",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "stimulus": "(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "stimulusHtml": "<p>(1) <u>Yalina,</u> Michael, and Malcolm love making pancakes with <u>their</u> granddad on Saturday mornings. (2) Yalina’s job <u>is</u> to open the box and pour the pancake mix into a <u>bowl,</u> slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until <u>it is smooth,</u> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when <u>they start</u> to bubble, while all three siblings get the table ready for a <u>sweet</u> delicious breakfast.</p>",
    "promptHtml": "<p>Which pair of revisions is needed to correct the errors in the paragraph?</p>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>Yalina</strong></em>, AND change <em><strong>their </strong></em>to <strong>her</strong>.</p>",
        "text": "Sentence 1: Delete the comma after Yalina, AND change their to her."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Change <em><strong>is </strong></em>to <strong>are</strong>, AND delete the comma after <em><strong>bowl</strong></em>.</p>",
        "text": "Sentence 2: Change is to are, AND delete the comma after bowl."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Change <em><strong>it is </strong></em>to <strong>they are</strong>, AND delete the comma after <em><strong>smooth</strong></em>.</p>",
        "text": "Sentence 3: Change it is to they are, AND delete the comma after smooth."
      },
      {
        "id": "D",
        "html": "<p>Sentence 4: Change <em><strong>they start </strong></em>to <strong>it starts</strong>, AND insert a comma after <em><strong>sweet</strong></em>.</p>",
        "text": "Sentence 4: Change they start to it starts, AND insert a comma after sweet."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [],
    "versionLabel": "",
    "duplicateOf": "part-b-import-53426367cca3-283c4ade",
    "canonicalContent": true
  },
  {
    "id": "standalone-pangaea-sentence-structure-1",
    "source": {
      "label": "2025-2026 Form A",
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "The land on Earth has not always been separated into the seven continents, at one time a massive supercontinent, known as Pangaea, covered one-third of Earth's surface. Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth's Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth's crust. In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "stimulusHtml": "The land on Earth has not always been separated into the seven <u>continents, at</u> one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s <u>surface. Additionally,</u> the supercontinent was surrounded by ocean waters called <u>Panthalassa, much</u> of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s <u>crust. In fact,</u> experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "text": "continents. At"
      },
      {
        "id": "B",
        "text": "surface; additionally,"
      },
      {
        "id": "C",
        "text": "Panthalassa. Much"
      },
      {
        "id": "D",
        "text": "crust, in fact,"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2022-2023 Form A",
      "2019-2020 Form A"
    ],
    "versionLabel": "2022-2023 Form A",
    "explanation": "The question asks for the revision that corrects the error in sentence structure in the paragraph.\n\nA. CORRECT. The first sentence of the paragraph is a run-on because both clauses—“The land on Earth has not always been separated into the seven continents” and “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface”—are independent clauses. Independent clauses are complete sentences, and two complete sentences should not be combined with just a comma. The revision is correct because it separates the two sentences by placing a period where it is needed after “continents” and by capitalizing the word “At.”\n\nB. Incorrect. While adding a semicolon after “surface” can be considered a correct way to separate the independent clauses “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface” and “Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere,” this change does not address the sentence structure error in the paragraph (the run-on sentence). The use of a period separating the independent clauses (complete sentences) is correct as is.\n\nC. Incorrect. Adding a period after “Panthalassa” would separate the dependent clause “much of which were in Earth’s Southern Hemisphere” from its subject: “ocean waters called Panthalassa.” The dependent clause cannot stand on its own, because it shares elements with the main clause. A dependent clause is not a complete sentence and must be joined with an independent clause. The clause beginning with “much of which” is an adjective for “ocean waters.” Changing the comma to a period creates a new error (a sentence fragment) and does not address the existing sentence structure error at the beginning of the paragraph (the run-on sentence).\n\nD. Incorrect. Removing the period after “crust” would create a run-on sentence because the period is needed to separate two complete sentences—“Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust” and “In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.” A comma after “crust” would combine these sentences into a run-on, creating a new error in the sentence without fixing the existing sentence structure error (the run-on sentence) at the beginning of the paragraph.",
    "explanationHtml": "The question asks for the revision that corrects the error in sentence structure in the paragraph.<br><strong>A. CORRECT.</strong> The first sentence of the paragraph is a run-on because both clauses—“The land on Earth has not always been separated into the seven continents” and “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface”—are independent clauses. Independent clauses are complete sentences, and two complete sentences should not be combined with just a comma. The revision is correct because it separates the two sentences by placing a period where it is needed after “continents” and by capitalizing the word “At.”<br><strong>B.</strong> Incorrect. While adding a semicolon after “surface” can be considered a correct way to separate the independent clauses “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface” and “Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere,” this change does not address the sentence structure error in the paragraph (the run-on sentence). The use of a period separating the independent clauses (complete sentences) is correct as is.<br><strong>C.</strong> Incorrect. Adding a period after “Panthalassa” would separate the dependent clause “much of which were in Earth’s Southern Hemisphere” from its subject: “ocean waters called Panthalassa.” The dependent clause cannot stand on its own, because it shares elements with the main clause. A dependent clause is not a complete sentence and must be joined with an independent clause. The clause beginning with “much of which” is an adjective for “ocean waters.” Changing the comma to a period creates a new error (a sentence fragment) and does not address the existing sentence structure error at the beginning of the paragraph (the run-on sentence).<br><strong>D.</strong> Incorrect. Removing the period after “crust” would create a run-on sentence because the period is needed to separate two complete sentences—“Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust” and “In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.” A comma after “crust” would combine these sentences into a run-on, creating a new error in the sentence without fixing the existing sentence structure error (the run-on sentence) at the beginning of the paragraph."
  },
  {
    "id": "standalone-blobfish-construction-1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-9a1d5b75473231601302.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction?",
    "promptHtml": "<p>Which sentence in the paragraph contains an error in construction?</p>",
    "topic": "Pronouns",
    "categories": [
      {
        "id": "category-1",
        "title": "Contains an error in construction"
      }
    ],
    "correctPlacements": {
      "item-4": "category-1"
    },
    "instructions": "Move the answer to the box. There is only one error in construction.",
    "items": [
      {
        "html": "<p><span>Sentence 1</span></p>",
        "id": "item-1",
        "text": "Sentence 1"
      },
      {
        "html": "<p><span>Sentence 2</span></p>",
        "id": "item-2",
        "text": "Sentence 2"
      },
      {
        "html": "<p><span>Sentence 3</span></p>",
        "id": "item-3",
        "text": "Sentence 3"
      },
      {
        "html": "<p><span>Sentence 4</span></p>",
        "id": "item-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "versionLabels": [
      "2022-2023 Form B"
    ],
    "versionLabel": "2022-2023 Form B",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>",
    "duplicateOf": "official-shsat-2026-a-50",
    "canonicalContent": true
  },
  {
    "id": "part-b-question-5",
    "points": 1,
    "prompt": "Read these sentences.\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "promptHtml": "Read these sentences.\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "stimulus": "(1) Flyby missions near Jupiter have been happening since 1973.\n\n\n\n(2) Flyby missions allow scientists to collect data about Jupiter and its moons.",
    "stimulusHtml": "(1) Flyby missions near Jupiter have been happening since 1973.\n<br>\n<br>(2) Flyby missions allow scientists to collect data about Jupiter and its moons.",
    "topic": "Sentence Structure",
    "versionLabels": [
      "2025-2026 Form B",
      "2019-2020 Form A"
    ],
    "versionLabel": "2025-2026 Form B",
    "choices": [
      {
        "id": "A",
        "html": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons.",
        "text": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons."
      },
      {
        "id": "B",
        "html": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons.",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973.",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "D",
        "html": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973.",
        "text": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-question-6",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "promptHtml": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "stimulus": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "stimulusHtml": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "topic": "Modifiers",
    "versionLabels": [
      "2025-2026 Form B",
      "2023-2024 Form B"
    ],
    "versionLabel": "2025-2026 Form B",
    "categories": [
      {
        "id": "answer-box",
        "title": "Contains an error in construction"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "answer-card-2": "answer-box"
    },
    "instructions": "Move the answer to the box. There is only one correct answer.",
    "items": [
      {
        "id": "answer-card-1",
        "text": "Sentence 1"
      },
      {
        "id": "answer-card-2",
        "text": "Sentence 2"
      },
      {
        "id": "answer-card-3",
        "text": "Sentence 3"
      },
      {
        "id": "answer-card-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-question-7",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How should the paragraph be revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1) Danielle <u>spent</u> several hours preparing for an upcoming audition for a <u>play</u> at the community theater. (2) First she <u>did</u> vocal exercises to practice her diction and <u>projection</u> so that her words would carry clearly throughout the large auditorium. (3) Then she <u>studies</u> the text of the monologue to better understand the <u>emotions,</u> and motivations of the character she plans to portray. (4) Finally she <u>recited</u> her monologue in front of a mirror many <u>times,</u> making slight adjustments and improvements to her performance each time.",
    "topic": "Verbs",
    "versionLabels": [
      "2025-2026 Form B",
      "2019-2020 Form A",
      "2023-2024 Form A",
      "2021-2022 Form B"
    ],
    "versionLabel": "2025-2026 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change <em><strong>spent</strong></em> to <strong>had spent</strong>, AND insert a comma after <em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change <em><strong>did</strong></em> to <strong>does</strong>, AND insert a comma after <em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change <em><strong>studies</strong></em> to <strong>studied</strong>, AND delete the comma after <em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change <em><strong>recited</strong></em> to <strong>recites</strong>, AND delete the comma after <em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "explanation": "The question asks how the paragraph should be revised.\n\nE. Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. F. Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. G. CORRECT. Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. H. Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.",
    "explanationHtml": "<p>The question asks how the paragraph should be revised.</p><p><strong>E. </strong>Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. <strong>F. </strong>Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. <strong>G. CORRECT. </strong>Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. <strong>H. </strong>Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.</p>"
  },
  {
    "id": "part-b-question-8",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "points": 1,
    "prompt": "Which revision of the sentence uses the most precise language?",
    "stimulus": "The Appalachian Trail is a really long trail that a lot of people do each year.r.",
    "stimulusHtml": "<p>The Appalachian Trail is a really long trail that a lot of people do each year.</p>",
    "promptHtml": "Which revision of the sentence uses the most precise language?",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "The Appalachian Trail is an extremely long trail that millions of people do each year",
        "text": "The Appalachian Trail is an extremely long trail that millions of people do each year"
      },
      {
        "id": "B",
        "html": "The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year",
        "text": "The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year"
      },
      {
        "id": "C",
        "html": "The Appalachian Trail is a 2,200-mile trail that two million people hike each year",
        "text": "The Appalachian Trail is a 2,200-mile trail that two million people hike each year"
      },
      {
        "id": "D",
        "html": "The Appalachian Trail is a lengthy trail that a couple million people do each year.",
        "text": "The Appalachian Trail is a lengthy trail that a couple million people do each year."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form A"
    ],
    "versionLabel": "2020-2021 Form A"
  },
  {
    "id": "part-b-question-9",
    "duplicateOf": "part-b-import-a014b48d8124-92d0f942",
    "points": 1,
    "prompt": "Which edit should be made to correct this sentence?",
    "promptHtml": "Which edit should be made to correct this sentence?",
    "stimulus": "In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.",
    "stimulusHtml": "In 1962 the <u>agile</u> athletic Wilt Chamberlain became the <u>first</u> and <u>only</u> professional basketball player in the United <u>States</u> to score 100 points in a single game.",
    "topic": "Punctuation",
    "versionLabel": "2020-2021 Form A",
    "choices": [
      {
        "id": "A",
        "html": "Insert a comma after agile",
        "text": "Insert a comma after agile"
      },
      {
        "id": "B",
        "html": "Insert a comma after first.",
        "text": "Insert a comma after first."
      },
      {
        "id": "C",
        "html": "Insert a comma after only",
        "text": "Insert a comma after only"
      },
      {
        "id": "D",
        "html": "Insert a comma after States.",
        "text": "Insert a comma after States."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-question-10",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "promptHtml": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution, the museum is already the Smithsonian’s third most\npopular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a year. The museum features more than 30,000 objects, including\nMuhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation Proclamation, written in 1863 during the presidency of Abraham Lincoln, is\nalso on display at the museum.",
    "stimulusHtml": "In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian <u>Institution, the</u> museum is already the Smithsonian’s third most\npopular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a <u>year. The</u> museum features more than 30,000 <u>objects, including</u>\nMuhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation <u>Proclamation, written</u> in 1863 during the presidency of Abraham Lincoln, is\nalso on display at the museum.",
    "topic": "Sentence Structure",
    "versionLabel": "2020-2021 Form A",
    "choices": [
      {
        "id": "A",
        "html": "Institution, and the",
        "text": "Institution, and the"
      },
      {
        "id": "B",
        "html": "year, and the",
        "text": "year, and the"
      },
      {
        "id": "C",
        "html": "objects, which include",
        "text": "objects, which include"
      },
      {
        "id": "D",
        "html": "Proclamation, which was written",
        "text": "Proclamation, which was written"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "duplicateOf": "part-b-import-63ff15016dc9-8d09d754"
  },
  {
    "id": "part-b-import-be14ccff9e7a-6d3f6f8f",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "promptHtml": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "The land on Earth has not always been separated into the seven continents, at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface. Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust. In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "stimulusHtml": "<p>The land on Earth has not always been separated into the seven <u>continents, at</u> one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s <u>surface. Additionally,</u> the supercontinent was surrounded by ocean waters called <u>Panthalassa, much</u> of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s <u>crust. In fact,</u> experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.</p>",
    "explanation": "The question asks for the revision that corrects the error in sentence structure in the paragraph.\n\nA. CORRECT. The first sentence of the paragraph is a run-on because both clauses—“The land on Earth has not always been separated into the seven continents” and “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface”—are independent clauses. Independent clauses are complete sentences, and two complete sentences should not be combined with just a comma. The revision is correct because it separates the two sentences by placing a period where it is needed after “continents” and by capitalizing the word “At.”\n\nB. Incorrect. While adding a semicolon after “surface” can be considered a correct way to separate the independent clauses “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface” and “Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere,” this change does not address the sentence structure error in the paragraph (the run-on sentence). The use of a period separating the independent clauses (complete sentences) is correct as is.\n\nC. Incorrect. Adding a period after “Panthalassa” would separate the dependent clause “much of which were in Earth’s Southern Hemisphere” from its subject: “ocean waters called Panthalassa.” The dependent clause cannot stand on its own, because it shares elements with the main clause. A dependent clause is not a complete sentence and must be joined with an independent clause. The clause beginning with “much of which” is an adjective for “ocean waters.” Changing the comma to a period creates a new error (a sentence fragment) and does not address the existing sentence structure error at the beginning of the paragraph (the run-on sentence).\n\nD. Incorrect. Removing the period after “crust” would create a run-on sentence because the period is needed to separate two complete sentences—“Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust” and “In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.” A comma after “crust” would combine these sentences into a run-on, creating a new error in the sentence without fixing the existing sentence structure error (the run-on sentence) at the beginning of the paragraph.",
    "explanationHtml": "The question asks for the revision that corrects the error in sentence structure in the paragraph.<br><strong>A. CORRECT.</strong> The first sentence of the paragraph is a run-on because both clauses—“The land on Earth has not always been separated into the seven continents” and “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface”—are independent clauses. Independent clauses are complete sentences, and two complete sentences should not be combined with just a comma. The revision is correct because it separates the two sentences by placing a period where it is needed after “continents” and by capitalizing the word “At.”<br><strong>B.</strong> Incorrect. While adding a semicolon after “surface” can be considered a correct way to separate the independent clauses “at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface” and “Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere,” this change does not address the sentence structure error in the paragraph (the run-on sentence). The use of a period separating the independent clauses (complete sentences) is correct as is.<br><strong>C.</strong> Incorrect. Adding a period after “Panthalassa” would separate the dependent clause “much of which were in Earth’s Southern Hemisphere” from its subject: “ocean waters called Panthalassa.” The dependent clause cannot stand on its own, because it shares elements with the main clause. A dependent clause is not a complete sentence and must be joined with an independent clause. The clause beginning with “much of which” is an adjective for “ocean waters.” Changing the comma to a period creates a new error (a sentence fragment) and does not address the existing sentence structure error at the beginning of the paragraph (the run-on sentence).<br><strong>D.</strong> Incorrect. Removing the period after “crust” would create a run-on sentence because the period is needed to separate two complete sentences—“Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust” and “In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.” A comma after “crust” would combine these sentences into a run-on, creating a new error in the sentence without fixing the existing sentence structure error (the run-on sentence) at the beginning of the paragraph.",
    "topic": "Sentence Structure",
    "versionLabel": "2022-2023 Form A",
    "choices": [
      {
        "id": "A",
        "html": "continents. At",
        "text": "continents. At"
      },
      {
        "id": "B",
        "html": "surface; additionally,",
        "text": "surface; additionally,"
      },
      {
        "id": "C",
        "html": "Panthalassa. Much",
        "text": "Panthalassa. Much"
      },
      {
        "id": "D",
        "html": "crust, in fact,",
        "text": "crust, in fact,"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2022-2023 Form A",
      "2019-2020 Form A"
    ],
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "duplicateOf": "standalone-pangaea-sentence-structure-1"
  },
  {
    "id": "part-b-import-6ac23baedc82-90db8349",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhich revision of the sentence uses the most precise language?",
    "promptHtml": "Read this sentence.<br>Which revision of the sentence uses the <strong>most</strong> precise language?",
    "stimulus": "The Appalachian Trail is a really long trail that a lot of people do each year.",
    "stimulusHtml": "<p>The Appalachian Trail is a really long trail that a lot of people do each year.</p>",
    "explanation": "The question asks for the revision of the sentence that uses the most precise language.\n\nE. Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).\n\nF. Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million).\n\nG. CORRECT. The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence.\n\nH. Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).",
    "explanationHtml": "The question asks for the revision of the sentence that uses the <strong>most</strong> precise language.<br><strong>E.</strong> Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).<br><strong>F.</strong> Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million).<br><strong>G. CORRECT.</strong> The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence.<br><strong>H.</strong> Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).",
    "topic": "Word Choice & Precision",
    "versionLabel": "2022-2023 Form A",
    "choices": [
      {
        "id": "A",
        "html": "The Appalachian Trail is an extremely long trail that millions of people do each year.",
        "text": "The Appalachian Trail is an extremely long trail that millions of people do each year."
      },
      {
        "id": "B",
        "html": "The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year.",
        "text": "The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year."
      },
      {
        "id": "C",
        "html": "The Appalachian Trail is a 2,200-mile trail that two million people hike each year.",
        "text": "The Appalachian Trail is a 2,200-mile trail that two million people hike each year."
      },
      {
        "id": "D",
        "html": "The Appalachian Trail is a lengthy trail that a couple million people do each year.",
        "text": "The Appalachian Trail is a lengthy trail that a couple million people do each year."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-ba9708d4a08f-39a88e57",
    "points": 1,
    "prompt": "What is the best way to combine these sentences to clarify the relationship between ideas?",
    "promptHtml": "What is the <strong>best</strong> way to combine these sentences to clarify the relationship between ideas?",
    "stimulus": "(1) The International Space Station has been inhabited by crew members since 2000.\n(2) Tourists will soon be allowed to pay for visits to the space station.\n(3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.",
    "stimulusHtml": "<p>(1) The International Space Station has been inhabited by crew members since 2000.<br>(2) Tourists will soon be allowed to pay for visits to the space station.<br>(3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.</p>",
    "explanation": "The question asks for the best way to combine the sentences.\n\nA. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nB. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.\n\nC. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is so poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nD. Incorrect. The combination of the sentences contains an illogical relationship between ideas with the statement that tourists will be allowed to pay for visits to the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.",
    "explanationHtml": "The question asks for the <strong>best</strong> way to combine the sentences.<br><strong>A.</strong> Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.<br><strong>B. CORRECT.</strong> The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.<br><strong>C.</strong> Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is so poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.<br><strong>D.</strong> Incorrect. The combination of the sentences contains an illogical relationship between ideas with the statement that tourists will be allowed to pay for visits to the space station <em>because</em> the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.",
    "topic": "Sentence Structure",
    "versionLabel": "2022-2023 Form A",
    "choices": [
      {
        "id": "A",
        "html": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, which cost $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space.",
        "text": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, which cost $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "B",
        "html": "The International Space Station has been inhabited by crew members since 2000 and will soon allow tourists to pay for visits, but because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.",
        "text": "The International Space Station has been inhabited by crew members since 2000 and will soon allow tourists to pay for visits, but because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "C",
        "html": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, though the cost is $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space.",
        "text": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, though the cost is $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "D",
        "html": "The International Space Station has been inhabited by crew members since 2000, and tourists will soon be allowed to pay for visits to the space station because the cost is $52–$58 million round trip, therefore few people will be able to take advantage of the opportunity to have a vacation in outer space.",
        "text": "The International Space Station has been inhabited by crew members since 2000, and tourists will soon be allowed to pay for visits to the space station because the cost is $52–$58 million round trip, therefore few people will be able to take advantage of the opportunity to have a vacation in outer space."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-a014b48d8124-92d0f942",
    "versionLabels": [
      "2022-2023 Form A",
      "2020-2021 Form A"
    ],
    "points": 1,
    "prompt": "Which edit should be made to correct this sentence?",
    "promptHtml": "Which edit should be made to correct this sentence?",
    "stimulus": "In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.",
    "stimulusHtml": "<p>In 1962 the <u>agile</u> athletic Wilt Chamberlain became the <u>first</u> and <u>only</u> professional basketball player in the United <u>States</u> to score 100 points in a single game.</p>",
    "explanation": "The question asks which edit should be made to correct the sentence.\n\nE. CORRECT. The sentence in the box needs a comma to separate the coordinate adjectives. Coordinate adjectives describe characteristics of the same noun or subject and are connected with a comma or “and.” This option is the only one that places a comma where it is needed, between the coordinate adjectives “agile” and “athletic.”\n\nF. Incorrect. The option incorrectly adds a comma in the middle of the phrase “first and only,” which modifies, or gives additional information about, “professional basketball player.”\n\nG. Incorrect. The option incorrectly adds a comma between two adjectives that are not coordinate adjectives. “Only” is part of the phrase “first and only” and is modifying “professional basketball player.”\n\nH. Incorrect. The option is incorrect because a comma is not needed to set off the phrase “to score 100 points in a single game.”",
    "explanationHtml": "The question asks which edit should be made to correct the sentence.<br><strong>E. CORRECT.</strong> The sentence in the box needs a comma to separate the coordinate adjectives. Coordinate adjectives describe characteristics of the same noun or subject and are connected with a comma or “and.” This option is the only one that places a comma where it is needed, between the coordinate adjectives “agile” and “athletic.”<br><strong>F.</strong> Incorrect. The option incorrectly adds a comma in the middle of the phrase “first and only,” which modifies, or gives additional information about, “professional basketball player.”<br><strong>G.</strong> Incorrect. The option incorrectly adds a comma between two adjectives that are not coordinate adjectives. “Only” is part of the phrase “first and only” and is modifying “professional basketball player.”<br><strong>H.</strong> Incorrect. The option is incorrect because a comma is not needed to set off the phrase “to score 100 points in a single game.”",
    "topic": "Punctuation",
    "versionLabel": "2022-2023 Form A",
    "choices": [
      {
        "id": "A",
        "html": "Insert a comma after <strong><em>agile</em></strong>.",
        "text": "Insert a comma after agile."
      },
      {
        "id": "B",
        "html": "Insert a comma after <strong><em>first</em></strong>.",
        "text": "Insert a comma after first."
      },
      {
        "id": "C",
        "html": "Insert a comma after <strong><em>only</em></strong>.",
        "text": "Insert a comma after only."
      },
      {
        "id": "D",
        "html": "Insert a comma after <strong><em>States</em></strong>.",
        "text": "Insert a comma after States."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-f1c057628986-c19ffcec",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "promptHtml": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name, at that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the race, they made efforts to remove her from the competition. Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number 261, the same number she had worn in that first run in 1967.",
    "stimulusHtml": "<p>In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full <u>name, at</u> that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the <u>race, they</u> made efforts to remove her from the competition. Switzer prevailed and finished in just over four <u>hours, paving</u> the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number <u>261, the</u> same number she had worn in that first run in 1967.</p>",
    "explanation": "The question asks for the revision that corrects the error in sentence structure in the paragraph.\n\nA. CORRECT. As written, the first sentence (“In 1967 Katherine Switzer . . . legendary race.”) is a run-on sentence because a comma is used to combine two independent clauses. Independent clauses are complete sentences with a subject and a verb. The clauses—“In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name” and “at that time, only men were permitted to officially register and receive a number for the legendary race”—should be separated with a period instead. This revision correctly places a period after the word “name” and capitalizes the word “At” to separate the two independent clauses into two sentences.\n\nB. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. The clause “Once officials realized a woman was attempting to run in the race” is a dependent clause functioning as an adverb of the independent clause that follows it. Changing the comma after the word “race” to a period would incorrectly separate the adverbial dependent clause from the independent clause.\n\nC. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. The sentence “Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women” is a complex sentence, which combines an independent clause (“Switzer prevailed and finished in just over four hours”) and a dependent clause (“paving the way for the official rule change that allowed for the inclusion of women”). The clause “paving the way for the official rule change that allowed for the inclusion of women” is not a complete sentence and must stay connected to the first part of the sentence. Changing the comma after “hours” to a period would incorrectly separate the dependent clause from the independent clause.\n\nD. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. Changing the comma after “261” to a period would incorrectly separate the modifying clause “the same number she had worn in that first run in 1967” from the words it describes (“number 261”). Additionally, the clause “the same number she had worn in that first run in 1967” is not a complete sentence.",
    "explanationHtml": "The question asks for the revision that corrects the error in sentence structure in the paragraph.<br><strong>A. CORRECT.</strong> As written, the first sentence (“In 1967 Katherine Switzer . . . legendary race.”) is a run-on sentence because a comma is used to combine two independent clauses. Independent clauses are complete sentences with a subject and a verb. The clauses—“In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name” and “at that time, only men were permitted to officially register and receive a number for the legendary race”—should be separated with a period instead. This revision correctly places a period after the word “name” and capitalizes the word “At” to separate the two independent clauses into two sentences.<br><strong>B.</strong> Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. The clause “Once officials realized a woman was attempting to run in the race” is a dependent clause functioning as an adverb of the independent clause that follows it. Changing the comma after the word “race” to a period would incorrectly separate the adverbial dependent clause from the independent clause.<br><strong>C.</strong> Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. The sentence “Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women” is a complex sentence, which combines an independent clause (“Switzer prevailed and finished in just over four hours”) and a dependent clause (“paving the way for the official rule change that allowed for the inclusion of women”). The clause “paving the way for the official rule change that allowed for the inclusion of women” is not a complete sentence and must stay connected to the first part of the sentence. Changing the comma after “hours” to a period would incorrectly separate the dependent clause from the independent clause.<br><strong>D.</strong> Incorrect. The revision introduces an error into the paragraph and does not revise the run-on in the first sentence. Changing the comma after “261” to a period would incorrectly separate the modifying clause “the same number she had worn in that first run in 1967” from the words it describes (“number 261”). Additionally, the clause “the same number she had worn in that first run in 1967” is not a complete sentence.",
    "topic": "Sentence Structure",
    "versionLabels": [
      "2022-2023 Form A"
    ],
    "versionLabel": "2022-2023 Form A",
    "choices": [
      {
        "id": "A",
        "html": "name. At",
        "text": "name. At"
      },
      {
        "id": "B",
        "html": "race. They",
        "text": "race. They"
      },
      {
        "id": "C",
        "html": "hours. Paving",
        "text": "hours. Paving"
      },
      {
        "id": "D",
        "html": "261. The",
        "text": "261. The"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-404ef8a6deeb-1222d1bf",
    "points": 1,
    "prompt": "Which pair of revisions needs to be made in this paragraph?",
    "promptHtml": "Which pair of revisions needs to be made in this paragraph?",
    "stimulus": "(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "stimulusHtml": "<p>(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people <u>wonder</u>: what <u>is</u> the difference between the two? (2) To start <u>with,</u> the butterfat content is much higher in ice cream than <u>it is</u> in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing <u>process,</u> which adds less air to the frozen treat, <u>makes</u> gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the <u>gelato,</u> and <u>allow</u> it to melt more quickly.</p>",
    "explanation": "The question asks for the revisions that are needed to correct errors in the paragraph.\n\nA. Incorrect. The revisions introduce new errors. The colon after “wonder” is needed to set off the question “what is the difference between the two?” from the rest of the sentence. In addition, changing the verb “is” to “are” would be incorrect with the use of the singular noun “difference,” which is the subject of the question.\n\nB. Incorrect. The revisions introduce new errors. The comma following the introductory phrase “To start with” helps with clarity and is needed to separate the phrase from the rest of the sentence. Changing “it is” to “they are” would be incorrect with the use of the singular noun “butterfat content,” which is what the words “it is” refer to in the sentence.\n\nC. Incorrect. The revisions introduce new errors. The comma following “process” is necessary to set off the nonrestrictive clause “which adds less air to the frozen treat” from the rest of the sentence. This clause is considered a nonrestrictive clause because it provides additional, but not essential, information about the mixing process. Changing the verb “makes” to “make” would be incorrect with the use of the singular noun “mixing process,” which is the subject of the sentence.\n\nD. CORRECT. Deleting the comma after “gelato” would include the clause “and allow it to melt more quickly” with the first part of the clause “which enhances the texture and flavor of the gelato.” The word “and” between the two verb phrases (“enhances the texture and flavor of the gelato” and “allow it to melt more quickly”) indicates that the two verb phrases share a subject, “which” (referring to the act of serving gelato 10 to 15 degrees warmer than ice cream). The two ideas should not be separated by a comma within the clause. The entire clause “which enhances the texture and flavor of the gelato and allow it to melt more quickly” should be separated from the main clause only by the comma after “cream” because the entire clause is a nonrestrictive clause. This clause provides additional, but not essential, information about the purpose of serving gelato at a warmer temperature than ice cream. Changing the verb “allow” to “allows” is also necessary to match the use of the singular pronoun “which.”",
    "explanationHtml": "The question asks for the revisions that are needed to correct errors in the paragraph.<br><strong>A.</strong> Incorrect. The revisions introduce new errors. The colon after “wonder” is needed to set off the question “what is the difference between the two?” from the rest of the sentence. In addition, changing the verb “is” to “are” would be incorrect with the use of the singular noun “difference,” which is the subject of the question.<br><strong>B.</strong> Incorrect. The revisions introduce new errors. The comma following the introductory phrase “To start with” helps with clarity and is needed to separate the phrase from the rest of the sentence. Changing “it is” to “they are” would be incorrect with the use of the singular noun “butterfat content,” which is what the words “it is” refer to in the sentence.<br><strong>C.</strong> Incorrect. The revisions introduce new errors. The comma following “process” is necessary to set off the nonrestrictive clause “which adds less air to the frozen treat” from the rest of the sentence. This clause is considered a nonrestrictive clause because it provides additional, but not essential, information about the mixing process. Changing the verb “makes” to “make” would be incorrect with the use of the singular noun “mixing process,” which is the subject of the sentence.<br><strong>D.</strong> <strong>CORRECT.</strong> Deleting the comma after “gelato” would include the clause “and allow it to melt more quickly” with the first part of the clause “which enhances the texture and flavor of the gelato.” The word “and” between the two verb phrases (“enhances the texture and flavor of the gelato” and “allow it to melt more quickly”) indicates that the two verb phrases share a subject, “which” (referring to the act of serving gelato 10 to 15 degrees warmer than ice cream). The two ideas should not be separated by a comma within the clause. The entire clause “which enhances the texture and flavor of the gelato and allow it to melt more quickly” should be separated from the main clause only by the comma after “cream” because the entire clause is a nonrestrictive clause. This clause provides additional, but not essential, information about the purpose of serving gelato at a warmer temperature than ice cream. Changing the verb “allow” to “allows” is also necessary to match the use of the singular pronoun “which.”",
    "topic": "Verbs",
    "versionLabels": [
      "2022-2023 Form B"
    ],
    "versionLabel": "2022-2023 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Delete the colon after <strong><em>wonder</em></strong> AND change <strong><em>is</em></strong> to <strong><em>are</em></strong>.",
        "text": "Sentence 1: Delete the colon after wonder AND change is to are."
      },
      {
        "id": "B",
        "html": "Sentence 2: Delete the comma after <strong><em>with</em></strong> AND change <strong><em>it is</em></strong> to <strong><em>they are</em></strong>.",
        "text": "Sentence 2: Delete the comma after with AND change it is to they are."
      },
      {
        "id": "C",
        "html": "Sentence 3: Delete the comma after <strong><em>process</em></strong> AND change <strong><em>makes</em></strong> to <strong><em>make</em></strong>.",
        "text": "Sentence 3: Delete the comma after process AND change makes to make."
      },
      {
        "id": "D",
        "html": "Sentence 4: Delete the comma after <strong><em>gelato</em></strong> AND change <strong><em>allow</em></strong> to <strong><em>allows</em></strong>.",
        "text": "Sentence 4: Delete the comma after gelato AND change allow to allows."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-2306e0b898d5-ae910e11",
    "points": 1,
    "prompt": "What is the best way to combine the sentences?",
    "promptHtml": "What is the <strong>best</strong> way to combine the sentences?",
    "stimulus": "(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.\n(2) One of Jupiter’s moons is named Io.\n(3) Io has the greatest number of active volcanoes in the solar system.",
    "stimulusHtml": "<p>(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.<br>(2) One of Jupiter’s moons is named Io.<br>(3) Io has the greatest number of active volcanoes in the solar system.</p>",
    "explanation": "The question asks for the best way to combine the sentences.\n\nE. Incorrect. Although the sentence incorporates the ideas presented in the three original sentences, it is incorrect because the combination suggests an incorrect relationship between the ideas. By beginning with “Io,” the sentence places emphasis on the moon and the detail about the number of active volcanoes rather than the key idea that “scientists now believe that Jupiter may have as many as seventy-nine moons.” Since Io is an example of one of Jupiter’s moons, the details about Io should follow and be subordinate to the main clause, which provides new information about the number of Jupiter’s moons in general.\n\nF. Incorrect. Although the sentence incorporates all three ideas from the original sentences and correctly places the detail about the number of active volcanoes on Io in a dependent clause, this option is incorrect because it presents an imprecise relationship between the ideas. By using the conjunction (connecting word) “and,” the sentence construction suggests that scientists “now believe” that “Jupiter may have as many as seventy-nine moons” and that “one of them is named Io,” instead of presenting Io as an example of one of Jupiter’s moons.\n\nG. CORRECT. This sentence is the best way to combine the original sentences because it uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. The sentence starts by stating the number of moons scientists now believe Jupiter may have and then specifies that one of those moons is named Io. The dependent clause “which has the greatest number of active volcanoes in the solar system” immediately follows the word “Io” to provide additional information about the moon. A dependent clause contains a subject (“which,” referring to Io) and a verb (“has”) but is not a complete sentence on its own.\n\nH. Incorrect. The sentence incorporates the key ideas from the original sentences, but its structure does not accurately present the relationship between these ideas. The beginning of the sentence includes the detail about Io having “the greatest number of active volcanoes in the solar system” before specifying that Io is one of the seventy-nine moons of Jupiter. The presentation of the details about Io at the beginning lessens the emphasis of the key idea that “scientists now believe that Jupiter may have as many as seventy-nine moons.”",
    "explanationHtml": "The question asks for the <strong>best</strong> way to combine the sentences.<br><strong>E.</strong> Incorrect. Although the sentence incorporates the ideas presented in the three original sentences, it is incorrect because the combination suggests an incorrect relationship between the ideas. By beginning with “Io,” the sentence places emphasis on the moon and the detail about the number of active volcanoes rather than the key idea that “scientists now believe that Jupiter may have as many as seventy-nine moons.” Since Io is an example of one of Jupiter’s moons, the details about Io should follow and be subordinate to the main clause, which provides new information about the number of Jupiter’s moons in general.<br><strong>F.</strong> Incorrect. Although the sentence incorporates all three ideas from the original sentences and correctly places the detail about the number of active volcanoes on Io in a dependent clause, this option is incorrect because it presents an imprecise relationship between the ideas. By using the conjunction (connecting word) “and,” the sentence construction suggests that scientists “now believe” that “Jupiter may have as many as seventy-nine moons” and that “one of them is named Io,” instead of presenting Io as an example of one of Jupiter’s moons.<br><strong>G.</strong> <strong>CORRECT.</strong> This sentence is the best way to combine the original sentences because it uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. The sentence starts by stating the number of moons scientists now believe Jupiter may have and then specifies that one of those moons is named Io. The dependent clause “which has the greatest number of active volcanoes in the solar system” immediately follows the word “Io” to provide additional information about the moon. A dependent clause contains a subject (“which,” referring to Io) and a verb (“has”) but is not a complete sentence on its own.<br><strong>H.</strong> Incorrect. The sentence incorporates the key ideas from the original sentences, but its structure does not accurately present the relationship between these ideas. The beginning of the sentence includes the detail about Io having “the greatest number of active volcanoes in the solar system” before specifying that Io is one of the seventy-nine moons of Jupiter. The presentation of the details about Io at the beginning lessens the emphasis of the key idea that “scientists now believe that Jupiter may have as many as seventy-nine moons.”",
    "topic": "Sentence Structure",
    "versionLabels": [
      "2022-2023 Form B"
    ],
    "versionLabel": "2022-2023 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as seventy-nine moons.",
        "text": "Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      },
      {
        "id": "B",
        "html": "Scientists now believe that Jupiter may have as many as seventy-nine moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system.",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "C",
        "html": "Scientists now believe that Jupiter may have as many as seventy-nine moons, including one named Io, which has the greatest number of active volcanoes in the solar system.",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, including one named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "D",
        "html": "Io, a moon with the greatest number of active volcanoes in the solar system, is one of Jupiter’s moons, and scientists now believe that Jupiter may have as many as seventy-nine moons.",
        "text": "Io, a moon with the greatest number of active volcanoes in the solar system, is one of Jupiter’s moons, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-f2325dca51de-51707498",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-9a1d5b75473231601302.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction?",
    "promptHtml": "<p>Which sentence in the paragraph contains an error in construction?</p>",
    "topic": "Pronouns",
    "categories": [
      {
        "id": "category-1",
        "title": "Contains an error in construction"
      }
    ],
    "correctPlacements": {
      "item-4": "category-1"
    },
    "instructions": "Move the answer to the box. There is only one error in construction.",
    "items": [
      {
        "html": "<p><span>Sentence 1</span></p>",
        "id": "item-1",
        "text": "Sentence 1"
      },
      {
        "html": "<p><span>Sentence 2</span></p>",
        "id": "item-2",
        "text": "Sentence 2"
      },
      {
        "html": "<p><span>Sentence 3</span></p>",
        "id": "item-3",
        "text": "Sentence 3"
      },
      {
        "html": "<p><span>Sentence 4</span></p>",
        "id": "item-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "versionLabels": [
      "2022-2023 Form B"
    ],
    "versionLabel": "2022-2023 Form B",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>",
    "duplicateOf": "official-shsat-2026-a-50",
    "canonicalContent": true
  },
  {
    "id": "part-b-import-7651e03756f2-ba433486",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "stimulus": "(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "stimulusHtml": "<p>(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</p>",
    "explanation": "The question asks for the identification of the sentence that has an error in its construction and should be revised.\n\nE. Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things.\n\nF. CORRECT. Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.”\n\nG. Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence.\n\nH. Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.",
    "explanationHtml": "The question asks for the identification of the sentence that has an error in its construction and should be revised.<br><strong>E.</strong> Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things.<br><strong>F.</strong> <strong>CORRECT.</strong> Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.”<br><strong>G.</strong> Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence.<br><strong>H.</strong> Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.",
    "topic": "Modifiers",
    "versionLabels": [
      "2022-2023 Form B",
      "2019-2020 Form A"
    ],
    "versionLabel": "2022-2023 Form B",
    "choices": [
      {
        "id": "A",
        "html": "sentence 1",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "sentence 2",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "sentence 3",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "sentence 4",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    }
  },
  {
    "id": "part-b-import-b44dc5773be7-9c6e5dcf",
    "points": 1,
    "prompt": "Select the word in the paragraph that is a vague pronoun with no single clear noun it refers to.",
    "promptHtml": "Select the word in the paragraph that is a vague pronoun with no single clear noun it refers to.",
    "stimulus": "(1) The seventh-grade garden club spent Saturday morning planting native wildflowers along the fence behind the cafeteria. (2) Ms. Ferro, the club's advisor, had ordered seed packets of black-eyed Susan, milkweed, and purple coneflower over the winter, and she kept a written log of which varieties still needed to arrive. (3) When the shipment finally arrived in April, it had already begun to sprout inside the box, so the club decided to plant them the same afternoon. (4) The members, who had checked the mailroom every day that week, were thrilled to see the seedlings.",
    "stimulusHtml": "<p>(1) The seventh-grade garden club spent Saturday morning planting native wildflowers along the fence behind the cafeteria. (2) Ms. Ferro, the club's advisor, had ordered seed packets of black-eyed Susan, milkweed, and purple coneflower over the winter, and <u>she</u> kept a written log of which varieties still needed to arrive. (3) When the shipment finally arrived in April, <u>it</u> had already begun to sprout inside the box, so the club decided to plant <u>them</u> the same afternoon. (4) The members, <u>who</u> had checked the mailroom every day that week, were thrilled to see the seedlings.</p>",
    "explanation": "\"Them\" has no single clear plural noun to attach to — the sentence names only the singular \"shipment\" and \"box,\" so a reader cannot tell for certain whether \"them\" refers to the seed packets or to the seedlings that had already sprouted inside. \"She\" clearly refers back to the singular \"Ms. Ferro,\" \"it\" clearly refers back to the singular \"shipment,\" and \"who\" clearly introduces a relative clause describing \"the members\" — none of those three pronouns leaves any doubt about its antecedent.",
    "explanationHtml": "&quot;Them&quot; has no single clear plural noun to attach to — the sentence names only the singular &quot;shipment&quot; and &quot;box,&quot; so a reader cannot tell for certain whether &quot;them&quot; refers to the seed packets or to the seedlings that had already sprouted inside. &quot;She&quot; clearly refers back to the singular &quot;Ms. Ferro,&quot; &quot;it&quot; clearly refers back to the singular &quot;shipment,&quot; and &quot;who&quot; clearly introduces a relative clause describing &quot;the members&quot; — none of those three pronouns leaves any doubt about its antecedent.",
    "topic": "Pronouns",
    "versionLabels": [
      "Digital SHSAT Practice Test 3"
    ],
    "versionLabel": "Digital SHSAT Practice Test 3",
    "choices": [
      {
        "id": "A",
        "html": "<strong>she</strong>",
        "text": "she"
      },
      {
        "id": "B",
        "html": "<strong>it</strong>",
        "text": "it"
      },
      {
        "id": "C",
        "html": "<strong>them</strong>",
        "text": "them"
      },
      {
        "id": "D",
        "html": "<strong>who</strong>",
        "text": "who"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-import-06cbf355559e-5c52b8eb",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "stimulus": "(1) After an overnight storm left the outdoor field soaked, the gym teacher moved the sixth-grade kickball tournament indoors at the last minute. (2) Dribbling across the hallway tile, the janitor mopped up puddles near the gym doors before the first game could begin. (3) Several teams complained that the indoor court felt cramped compared to the outdoor field they had practiced on all season. (4) By the third inning, most players agreed the switch had been the right call, since lightning was still visible over the football field outside.",
    "stimulusHtml": "<p>(1) After an overnight storm left the outdoor field soaked, the gym teacher moved the sixth-grade kickball tournament indoors at the last minute. (2) Dribbling across the hallway tile, the janitor mopped up puddles near the gym doors before the first game could begin. (3) Several teams complained that the indoor court felt cramped compared to the outdoor field they had practiced on all season. (4) By the third inning, most players agreed the switch had been the right call, since lightning was still visible over the football field outside.</p>",
    "explanation": "Sentence 2 opens with the modifying phrase \"Dribbling across the hallway tile,\" which as written describes the janitor rather than the water being mopped up, creating an illogical, misplaced modifier; sentences 1, 3, and 4 are each constructed correctly.",
    "explanationHtml": "Sentence 2 opens with the modifying phrase &quot;Dribbling across the hallway tile,&quot; which as written describes the janitor rather than the water being mopped up, creating an illogical, misplaced modifier; sentences 1, 3, and 4 are each constructed correctly.",
    "topic": "Sentence Structure",
    "versionLabels": [
      "Digital SHSAT Practice Test 3"
    ],
    "versionLabel": "Digital SHSAT Practice Test 3",
    "choices": [
      {
        "id": "A",
        "html": "sentence 2",
        "text": "sentence 2"
      },
      {
        "id": "B",
        "html": "sentence 3",
        "text": "sentence 3"
      },
      {
        "id": "C",
        "html": "sentence 1",
        "text": "sentence 1"
      },
      {
        "id": "D",
        "html": "sentence 4",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-import-cc7d82dcf786-61f08277",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "promptHtml": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "stimulus": "(1) On Tuesday, the eighth-grade science classes traveled downtown for a field trip to the planetarium. (2) Ms. Okafor, the trip coordinator, and her co-teacher was in charge of counting students onto each bus. (3) Each student was given a booklet listing all of the shows and told to circle the ones they most wanted to see. (4) When a student asked the astronomer a question about the moon's orbit, they answered so thoroughly that the whole auditorium burst into applause.",
    "stimulusHtml": "<p>(1) On Tuesday, the eighth-grade science classes traveled downtown for a field trip to the planetarium. (2) Ms. Okafor, the trip coordinator, and her co-teacher was in charge of counting students onto each bus. (3) Each student was given a booklet listing all of the shows and told to circle the ones they most wanted to see. (4) When a student asked the astronomer a question about the moon's orbit, they answered so thoroughly that the whole auditorium burst into applause.</p>",
    "explanation": "In sentence 2, the compound subject \"Ms. Okafor...and her co-teacher,\" joined by *and*, requires the plural verb *were* rather than *was*, and in sentence 4 the pronoun *they* has two possible singular antecedents — *a student* and *the astronomer* — so replacing it with the noun *the astronomer* corrects the vague reference. Choice A proposes changes to sentence 1, which contains no error: *traveled* correctly agrees with the plural subject and *classes* is correctly plural. Choice C proposes changes to sentence 3, which is also error-free: *was* correctly agrees with the singular *each student*, and *listing* is a correctly formed participle. Choice D correctly flags sentence 4 but misidentifies the fix: changing *they* to *he or she* still fails to specify which singular antecedent is meant, and changing *answered* to *answers* would wrongly break the paragraph's consistent past-tense narration.",
    "explanationHtml": "In sentence 2, the compound subject &quot;Ms. Okafor...and her co-teacher,&quot; joined by *and*, requires the plural verb *were* rather than *was*, and in sentence 4 the pronoun *they* has two possible singular antecedents — *a student* and *the astronomer* — so replacing it with the noun *the astronomer* corrects the vague reference. Choice A proposes changes to sentence 1, which contains no error: *traveled* correctly agrees with the plural subject and *classes* is correctly plural. Choice C proposes changes to sentence 3, which is also error-free: *was* correctly agrees with the singular *each student*, and *listing* is a correctly formed participle. Choice D correctly flags sentence 4 but misidentifies the fix: changing *they* to *he or she* still fails to specify which singular antecedent is meant, and changing *answered* to *answers* would wrongly break the paragraph's consistent past-tense narration.",
    "topic": "Sentence Structure",
    "versionLabels": [
      "Digital SHSAT Practice Test 3"
    ],
    "versionLabel": "Digital SHSAT Practice Test 3",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change *<em>traveled</em>* to *travels*, AND also change *classes* to *class* throughout.",
        "text": "Sentence 1: Change *traveled* to *travels*, AND also change *classes* to *class* throughout."
      },
      {
        "id": "B",
        "html": "Sentence 4: Change *they* to *he or she*, AND also change *answered* to *answers* accordingly.",
        "text": "Sentence 4: Change *they* to *he or she*, AND also change *answered* to *answers* accordingly."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change *was* to *were*, AND also change *listing* to *listed*.",
        "text": "Sentence 3: Change *was* to *were*, AND also change *listing* to *listed*."
      },
      {
        "id": "D",
        "html": "Sentence 2: Change *was* to *were*, AND change *they* in sentence 4 to *the astronomer*.",
        "text": "Sentence 2: Change *was* to *were*, AND change *they* in sentence 4 to *the astronomer*."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-import-ae2365ec0e7f-bdcbc920",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How should the paragraph be revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1) Danielle <u>spent</u> several hours preparing for an upcoming audition for a <u>play</u> at the community theater. (2) First she <u>did</u> vocal exercises to practice her diction and <u>projection</u> so that her words would carry clearly throughout the large auditorium. (3) Then she <u>studies</u> the text of the monologue to better understand the <u>emotions,</u> and motivations of the character she plans to portray. (4) Finally she <u>recited</u> her monologue in front of a mirror many <u>times,</u> making slight adjustments and improvements to her performance each time.",
    "topic": "Verbs",
    "versionLabels": [],
    "versionLabel": "",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change <em><strong>spent</strong></em> to <strong>had spent</strong>, AND insert a comma after <em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change <em><strong>did</strong></em> to <strong>does</strong>, AND insert a comma after <em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change <em><strong>studies</strong></em> to <strong>studied</strong>, AND delete the comma after <em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change <em><strong>recited</strong></em> to <strong>recites</strong>, AND delete the comma after <em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "explanation": "The question asks how the paragraph should be revised.\n\nE. Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. F. Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. G. CORRECT. Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. H. Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.",
    "explanationHtml": "<p>The question asks how the paragraph should be revised.</p><p><strong>E. </strong>Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. <strong>F. </strong>Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. <strong>G. CORRECT. </strong>Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. <strong>H. </strong>Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.</p>",
    "duplicateOf": "part-b-question-7",
    "canonicalContent": true
  },
  {
    "id": "part-b-import-08648a835822-af09c10f",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "stimulus": "(1) In 1976 the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the Nets played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) Then in 2012, after a change in ownership, the team returned to New York and began playing under the name the Brooklyn Nets.",
    "stimulusHtml": "<p>(1) In 1976 the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the Nets played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) Then in 2012, after a change in ownership, the team returned to New York and began playing under the name the Brooklyn Nets.</p>",
    "topic": "Modifiers",
    "versionLabels": [],
    "choices": [
      {
        "id": "A",
        "html": "sentence 1",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "sentence 2",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "sentence 3",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "sentence 4",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "B",
    "instructions": "Read this paragraph.",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-import-11fdbe8f497f-4770de9a",
    "points": 1,
    "prompt": "What is the most precise revision for the words The engineers tried some other things?",
    "promptHtml": "What is the <strong>most</strong> precise revision for the words <strong><em>The engineers tried some other things</em></strong>?",
    "stimulus": "The engineers tried some other things in the hope of finding a more effective insulation for the compartment.",
    "stimulusHtml": "<p><u>The engineers tried some other things</u> in the hope of finding a more effective insulation for the compartment.</p>",
    "topic": "Word Choice & Precision",
    "versionLabels": [],
    "choices": [
      {
        "id": "A",
        "html": "The engineers did experiments with several new materials",
        "text": "The engineers did experiments with several new materials"
      },
      {
        "id": "B",
        "html": "The engineers tested foam and fiberglass",
        "text": "The engineers tested foam and fiberglass"
      },
      {
        "id": "C",
        "html": "The engineers examined two new materials",
        "text": "The engineers examined two new materials"
      },
      {
        "id": "D",
        "html": "The engineers worked with foam and fiberglass",
        "text": "The engineers worked with foam and fiberglass"
      }
    ],
    "correctChoiceId": "B",
    "instructions": "Read this sentence.",
    "type": "multiple_choice"
  },
  {
    "id": "official-shsat-2026-a-48",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "48",
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-92d4945b7be3ff3372c6.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Which sentence of the paragraph should be revised to correct a vague pronoun?\n(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade. (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. (3) Outside of school, she also sings in a choir made up of young and old members of her community. (4) Both girls hope that they will be able to continue singing for many more years.",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> of the <span>paragraph</span> should be revised to correct a vague pronoun?</span></p> <blockquote data-boxed=\"true\"><span><span>(1) Eliza</span> and Brianna have been singing in their school chorus since they were in fourth grade. &nbsp;<span>(2) The</span> girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. &nbsp;<span>(3) Outside</span> of school, she also sings in a choir made up of young and old members of her community. &nbsp;<span>(4) Both</span> girls hope that they will be able to continue singing for many more years.</span></blockquote>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>sentence</span> 1</span></p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p><span><span>sentence</span> 2</span></p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p><span><span>sentence</span> 3</span></p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p><span><span>sentence</span> 4</span></p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form A"
    ],
    "versionLabel": "2026-2027 Form A"
  },
  {
    "id": "official-shsat-2026-a-49",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "49",
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-f7a2663845793eb48cdd.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?\n(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "promptHtml": "<p><span><span>Which</span> pair of revisions is needed to correct the errors in the <span>paragraph</span>?</span></p> <blockquote data-boxed=\"true\"><span>(1) <span><u>Yalina,</u></span> Michael, and Malcolm love making pancakes with <span><u>their</u></span> granddad on Saturday mornings.&nbsp; <span>(2) Yalina’s</span> job <span><u>is</u></span> to open the box and pour the pancake mix into a <span><u>bowl,</u></span> slowly adding water, eggs, melted butter, and blueberries.&nbsp; <span>(3) Michael</span> uses a wooden spoon to vigorously stir the mixture until <span><u>it is</u></span> <span><u>smooth,</u></span> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time.&nbsp; <span>(4) Granddad</span> turns each pancake when <span><u>they start</u></span> to bubble, while all three siblings get the table ready for a <span><u>sweet</u></span> delicious breakfast.</span></blockquote>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>Sentence</span> 1: Delete the <span>comma</span> after <strong><em>Yalina</em></strong>, AND change <em><strong>their</strong></em> to <strong>her</strong>.</span></p>",
        "text": "Sentence 1: Delete the comma after Yalina, AND change their to her."
      },
      {
        "id": "B",
        "html": "<p><span><span>Sentence</span> 2: Change <em><strong>is</strong></em> to <strong>are</strong>, AND delete the <span>comma</span> after&nbsp;<em><strong>bowl</strong></em>.</span></p>",
        "text": "Sentence 2: Change is to are, AND delete the comma after bowl."
      },
      {
        "id": "C",
        "html": "<p><span><span>Sentence</span> 3: Change <em><strong>it is</strong></em> to <strong>they are</strong>, AND delete the <span>comma</span> after <em><strong>smooth</strong></em>.</span></p>",
        "text": "Sentence 3: Change it is to they are, AND delete the comma after smooth."
      },
      {
        "id": "D",
        "html": "<p><span><span>Sentence</span> 4: Change <em><strong>they start</strong></em> to <strong>it starts</strong>, AND insert a <span>comma</span> after <em><strong>sweet</strong></em>.</span></p>",
        "text": "Sentence 4: Change they start to it starts, AND insert a comma after sweet."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form A"
    ],
    "versionLabel": "2026-2027 Form A"
  },
  {
    "id": "official-shsat-2026-a-50",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "A",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-9a1d5b75473231601302.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction?",
    "promptHtml": "<p>Which sentence in the paragraph contains an error in construction?</p>",
    "topic": "Pronouns",
    "categories": [
      {
        "id": "category-1",
        "title": "Contains an error in construction"
      }
    ],
    "correctPlacements": {
      "item-4": "category-1"
    },
    "instructions": "Move the answer to the box. There is only one error in construction.",
    "items": [
      {
        "html": "<p><span>Sentence 1</span></p>",
        "id": "item-1",
        "text": "Sentence 1"
      },
      {
        "html": "<p><span>Sentence 2</span></p>",
        "id": "item-2",
        "text": "Sentence 2"
      },
      {
        "html": "<p><span>Sentence 3</span></p>",
        "id": "item-3",
        "text": "Sentence 3"
      },
      {
        "html": "<p><span>Sentence 4</span></p>",
        "id": "item-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "versionLabels": [
      "2026-2027 Form A",
      "2022-2023 Form B"
    ],
    "versionLabel": "2026-2027 Form A",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>"
  },
  {
    "id": "official-shsat-2026-b-47",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "47",
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-1d0e191a1f44b2abc36f.png\" alt=\"Official explanation for question 47\">",
    "points": 1,
    "prompt": "Which part of the paragraph contains an error in sentence structure?\nSelect the one error.",
    "promptHtml": "<p><span><span>Which</span> part of the <span>paragraph</span> contains an error in <span>sentence</span> structure?</span></p> <p><span>Select the one error.</span></p>",
    "selectionHtml": "<blockquote data-boxed=\"true\"><span>In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian&nbsp;</span><span data-choice-id=\"A\"><span>Institution, the</span></span><span> museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a </span><span data-choice-id=\"B\"><span>year. The</span></span><span> museum features more than 30,000 </span><span data-choice-id=\"C\"><span>objects, including</span></span><span> Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation </span><span data-choice-id=\"D\"><span>Proclamation, written</span></span><span> in </span><span>1863</span><span> during the presidency of Abraham Lincoln, is also on display at the museum.</span></blockquote>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<span>Institution, the</span>",
        "text": "Institution, the"
      },
      {
        "id": "B",
        "html": "<span>year. The</span>",
        "text": "year. The"
      },
      {
        "id": "C",
        "html": "<span>objects, including</span>",
        "text": "objects, including"
      },
      {
        "id": "D",
        "html": "<span>Proclamation, written</span>",
        "text": "Proclamation, written"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form B"
    ],
    "versionLabel": "2026-2027 Form B"
  },
  {
    "id": "official-shsat-2026-b-48",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "48",
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-c1b6f7a1858869678ce9.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Read these sentences.\n(1) Flyby missions near Jupiter have been happening since 1973.\n(2) Flyby missions allow scientists to collect data about Jupiter and its moons.\n\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "promptHtml": "<p><span><span>Read</span> these <span>sentences</span>.</span></p> <blockquote data-boxed=\"true\"> <p><span>(1) Flyby missions near Jupiter have been happening since&nbsp;</span><span>1973.</span></p> <p><span>(2) Flyby missions allow scientists to collect data about Jupiter and its moons.</span></p> </blockquote> <p>&nbsp;<span><br><span>What</span> is the <span>best</span> way to combine the sentences to clarify the relationship between the ideas?</span></p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>While flyby missions near Jupiter have been happening since </span><span>1973,</span><span> scientists collect data about the planet and its moons.</span></p>",
        "text": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons."
      },
      {
        "id": "B",
        "html": "<p><span>Although there have been flyby missions near Jupiter since </span><span>1973,</span><span> they have allowed scientists to collect data about the planet and its moons.</span></p>",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "<p><span>Flyby missions near Jupiter, <span>which</span> allow scientists to collect data about the planet and its moons, have been happening since </span><span>1973.</span></p>",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "D",
        "html": "<p><span>Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since </span><span>1973.</span></p>",
        "text": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form B"
    ],
    "versionLabel": "2026-2027 Form B"
  },
  {
    "id": "official-shsat-2026-b-49",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "49",
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-ef3122c6fbb3d75307c8.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?\n(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City. (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work. (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day! (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.\nMove the answer to the box. There is only one error in construction.",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> in the <span>paragraph</span> contains an error in construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City. &nbsp;(2) Leaving approximately 73,000 residents without electricity for three long </span><span>hours,</span><span> lights did not function, refrigerators did not stay cold, and air conditioners did not work. &nbsp;(3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier</span><span>—</span><span>on the exact same day! &nbsp;(4) The famous New York City Blackout of </span><span>1977,</span><span> which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.</span></blockquote> <p><span>Move the <span>answer</span> to the box. There is only one error in construction.</span></p>",
    "topic": "Modifiers",
    "categories": [
      {
        "id": "category-1",
        "title": "Contains an error in construction"
      }
    ],
    "correctPlacements": {
      "item-2": "category-1"
    },
    "instructions": "Move the correct answers to the box.",
    "items": [
      {
        "html": "<p><span>Sentence 1</span></p>",
        "id": "item-1",
        "text": "Sentence 1"
      },
      {
        "html": "<p><span>Sentence 2</span></p>",
        "id": "item-2",
        "text": "Sentence 2"
      },
      {
        "html": "<p><span>Sentence 3</span></p>",
        "id": "item-3",
        "text": "Sentence 3"
      },
      {
        "html": "<p><span>Sentence 4</span></p>",
        "id": "item-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "versionLabels": [
      "2026-2027 Form B"
    ],
    "versionLabel": "2026-2027 Form B"
  },
  {
    "id": "official-shsat-2026-b-50",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "B",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-5b84eeef78e9a3179cba.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "How should the paragraph be revised?\n(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "promptHtml": "<p><span><span>How</span> should the <span>paragraph</span> be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) Danielle <span><u>spent</u></span> several hours preparing for an upcoming audition for a <span><u>play</u></span> at the community theater. &nbsp;<span>(2) First</span> she <span><u>did</u></span> vocal exercises to practice her diction and <span><u>projection</u></span> so that her words would carry clearly throughout the large auditorium. &nbsp;<span>(3) Then</span> she <span><u>studies</u></span> the text of the monologue to better understand the <span><u>emotions,</u></span> and motivations of the character she plans to portray. &nbsp;<span>(4) Finally</span> she <span><u>recited</u></span> her monologue in front of a mirror many <span><u>times,</u></span> making slight adjustments and improvements to her performance each time.</span></blockquote>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>Sentence</span> 1: Change <em><strong>spent</strong></em> to <strong>had spent</strong>, AND insert a comma after <em><strong>play</strong></em>.</span></p>",
        "text": "Sentence 1: Change spent to had spent, AND insert a comma after play."
      },
      {
        "id": "B",
        "html": "<p><span><span>Sentence</span> 2: Change <em><strong>did</strong></em> to <strong>does</strong>, AND insert a <span>comma</span> after <em><strong>projection</strong></em>.</span></p>",
        "text": "Sentence 2: Change did to does, AND insert a comma after projection."
      },
      {
        "id": "C",
        "html": "<p><span><span>Sentence</span> 3: Change <em><strong>studies</strong></em> to <strong>studied</strong>, AND delete the <span>comma</span> after <em><strong>emotions</strong></em>.</span></p>",
        "text": "Sentence 3: Change studies to studied, AND delete the comma after emotions."
      },
      {
        "id": "D",
        "html": "<p><span><span>Sentence</span> 4: Change <em><strong>recited</strong></em> to <strong>recites</strong>, AND delete the <span>comma</span> after <em><strong>times</strong></em>.</span></p>",
        "text": "Sentence 4: Change recited to recites, AND delete the comma after times."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form B"
    ],
    "versionLabel": "2026-2027 Form B"
  },
  {
    "id": "official-shsat-2026-c-48",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "48",
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-c16127e3dff0b706195d.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "promptHtml": "<p><span>Which sentence contains an error in its construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time.&nbsp; <span>(2) The</span> owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons.&nbsp; <span>(3) The</span> New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals.&nbsp; <span>(4) In</span> 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</span></blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>sentence 1</span></p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p><span>sentence 2</span></p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p><span>sentence 3</span></p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p><span>sentence 4</span></p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form C"
    ],
    "versionLabel": "2026-2027 Form C"
  },
  {
    "id": "official-shsat-2026-c-49",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "49",
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-950629d02746d145b9a3.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Read these sentences.\n(1) Jordan rehearsed his role for weeks.\n(2) He delivered his lines with ease.\n(3) His performance was met with a burst of applause from the audience.\nWhat is the best way to combine the sentences to clarify the relationship between ideas?",
    "promptHtml": "<p><span>Read these sentences.</span></p> <blockquote data-boxed=\"true\"><span>(1) Jordan rehearsed his role for weeks.<br>(2) He delivered his lines with ease.<br>(3) His performance was met with a burst of applause from the audience. &nbsp;&nbsp;</span></blockquote> <p><span>What is the best way to combine the sentences to clarify the relationship between ideas?&nbsp;</span></p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Though Jordan had rehearsed his role for weeks, when he delivered his lines with ease, his performance was met with a burst of applause from the audience.</span></p>",
        "text": "Though Jordan had rehearsed his role for weeks, when he delivered his lines with ease, his performance was met with a burst of applause from the audience."
      },
      {
        "id": "B",
        "html": "<p><span>Jordan had rehearsed his role for weeks, yet he delivered his lines with ease, so his performance was met with a burst of applause from the audience.</span></p>",
        "text": "Jordan had rehearsed his role for weeks, yet he delivered his lines with ease, so his performance was met with a burst of applause from the audience."
      },
      {
        "id": "C",
        "html": "<p><span>Because Jordan had rehearsed his role for weeks, he delivered his lines with ease, and his performance was met with a burst of applause from the audience.</span></p>",
        "text": "Because Jordan had rehearsed his role for weeks, he delivered his lines with ease, and his performance was met with a burst of applause from the audience."
      },
      {
        "id": "D",
        "html": "<p><span>Jordan had rehearsed his role for weeks, so he delivered his lines with ease, but his performance was met with a burst of applause from the audience.</span></p>",
        "text": "Jordan had rehearsed his role for weeks, so he delivered his lines with ease, but his performance was met with a burst of applause from the audience."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form C"
    ],
    "versionLabel": "2026-2027 Form C"
  },
  {
    "id": "official-shsat-2026-c-50",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "C",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-1562ed08d04a78a50e68.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "promptHtml": "<p><span>Which pair of revisions need to be made in this paragraph?</span></p> <blockquote data-boxed=\"true\"><span>(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people <span><u>wonder:</u></span> what <span><u>is</u></span> the difference between the two?&nbsp; <span>(2) To</span> start <span><u>with,</u></span> the butterfat content is much higher in ice cream than <span><u>it is</u></span> in gelato, making the Italian treat a wiser decision for people looking to make healthier choices.&nbsp; <span>(3) Additionally,</span> the mixing <span><u>process,</u></span> which adds less air to the frozen treat, <span><u>makes</u></span> gelato denser than ice cream.&nbsp; <span>(4) Finally,</span> gelato is served 10 to <span>15 degrees</span> warmer than ice cream, which enhances the texture and flavor of the <span><u>gelato,</u></span> and <span><u>allow</u></span> it to melt more quickly.</span></blockquote>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Sentence 1: Delete the colon after <em><strong>wonder</strong> </em>AND change <strong><em>is</em></strong> to <strong>are</strong>.</span></p>",
        "text": "Sentence 1: Delete the colon after wonder AND change is to are."
      },
      {
        "id": "B",
        "html": "<p><span>Sentence 2: Delete the comma after <em><strong>with</strong></em> AND change <strong><em>it is</em></strong> to <strong>they are</strong>.</span></p>",
        "text": "Sentence 2: Delete the comma after with AND change it is to they are."
      },
      {
        "id": "C",
        "html": "<p><span>Sentence 3: Delete the comma after <em><strong>process</strong></em> AND change <strong><em>makes</em></strong> to <strong>make</strong>.</span></p>",
        "text": "Sentence 3: Delete the comma after process AND change makes to make."
      },
      {
        "id": "D",
        "html": "<p><span>Sentence 4: Delete the comma after <em><strong>gelato</strong></em> AND change <em><strong>allow</strong></em> to <strong>allows</strong>.</span></p>",
        "text": "Sentence 4: Delete the comma after gelato AND change allow to allows."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form C"
    ],
    "versionLabel": "2026-2027 Form C"
  },
  {
    "id": "official-shsat-2026-d-47",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "47",
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-60df9044c8390c0d9b6f.png\" alt=\"Official explanation for question 47\">",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.",
    "promptHtml": "<p><span>Which sentence contains an error in its construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span><span>(1) Walking</span> dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the </span><span>pet-adoption</span><span> process, the animal shelter is looking for volunteers to help with a variety of tasks. &nbsp;<span>(2) Working</span> at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. &nbsp;<span>(3) In</span> addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. &nbsp;<span>(4) Caring</span> for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings&nbsp;of others.</span></blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>sentence 1</span></p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p><span>sentence 2</span></p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p><span>sentence 3</span></p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p><span>sentence 4</span></p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form D"
    ],
    "versionLabel": "2026-2027 Form D"
  },
  {
    "id": "official-shsat-2026-d-48",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "48",
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-4722231079614280b539.png\" alt=\"Official explanation for question 48\">",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Read this sentence.\nIn the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways send the sound through the environment.\nWhich revision to the words send the sound through the environment uses the most precise language?\nDrag the correct phrase into the box.",
    "promptHtml": "<p><span>Read this sentence.</span></p> <blockquote data-boxed=\"true\"><span>In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways <span><u>send the sound through the environment</u></span>.</span></blockquote> <p><span>Which revision to the words <em><strong>send the sound through the environment</strong></em> uses the most precise language?</span></p><p><span>Drag the correct phrase into the box.&nbsp;</span></p>",
    "dragDropContentHtml": "<p><span>In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways </span>{{slot-1}}<span>.</span></p>",
    "topic": "Word Choice & Precision",
    "allowReuse": false,
    "dragDropStyle": "outlined",
    "dragDropContent": [
      "In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways {{slot-1}}."
    ],
    "dragDropSlots": [
      {
        "correctItemId": "item-3",
        "id": "slot-1",
        "width": 475
      }
    ],
    "items": [
      {
        "id": "item-1",
        "text": "guide the sound waves in a specific direction"
      },
      {
        "id": "item-2",
        "text": "focus the sound waves to travel through the space"
      },
      {
        "id": "item-3",
        "text": "direct the sound waves to move along the curves of the arches"
      },
      {
        "id": "item-4",
        "text": "transfer the sound waves to a variety of different locations"
      }
    ],
    "type": "math_drag_drop",
    "versionLabels": [
      "2026-2027 Form D"
    ],
    "versionLabel": "2026-2027 Form D"
  },
  {
    "id": "official-shsat-2026-d-49",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "49",
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-615120363a49890347b5.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Read this sentence.\nRobert Cornelius is credited with taking the first, official selfie as a daguerreotype, an image recorded on a copper plate coated in silver, using a process that was more complicated than photos of today which are digitized or printed from film and do not require subjects to sit for nearly fifteen minutes to avoid blurring the image.\nWhich two edits should be made to correct the sentence?\nSelect the two correct answers.",
    "promptHtml": "<p><span>Read this sentence.</span></p> <blockquote data-boxed=\"true\"><span>Robert Cornelius is credited with taking the <span><u>first</u></span>, official selfie as a <span><u>daguerreotype</u></span>, an image recorded on a copper plate coated in&nbsp;<span><u>silver</u></span>, using a process that was more complicated than photos of&nbsp;<span><u>today</u></span> which are digitized or printed from <span><u>film</u></span> and do not require subjects to sit for nearly fifteen minutes to avoid blurring the image. &nbsp;</span></blockquote> <p><span>Which <strong>two</strong> edits should be made to correct the sentence?&nbsp;</span></p><p><span>Select the <strong>two</strong> correct answers.&nbsp;</span></p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Delete the comma after <strong><em>first</em></strong>.</span></p>",
        "text": "Delete the comma after first."
      },
      {
        "id": "B",
        "html": "<p><span>Delete the comma after <em><strong>daguerreotype</strong></em>.</span></p>",
        "text": "Delete the comma after daguerreotype."
      },
      {
        "id": "C",
        "html": "<p><span>Delete the comma after <strong><em>silver</em></strong>.</span></p>",
        "text": "Delete the comma after silver."
      },
      {
        "id": "D",
        "html": "<p><span>Add a comma after <em><strong>today</strong></em>.</span></p>",
        "text": "Add a comma after today."
      },
      {
        "id": "E",
        "html": "<p><span>Add a comma after <em><strong>film</strong></em>.&nbsp;</span></p>",
        "text": "Add a comma after film."
      }
    ],
    "correctChoiceIds": [
      "A",
      "D"
    ],
    "requiredSelections": 2,
    "type": "multi_select",
    "versionLabels": [
      "2026-2027 Form D"
    ],
    "versionLabel": "2026-2027 Form D"
  },
  {
    "id": "official-shsat-2026-d-50",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "year": "2026",
      "form": "D",
      "section": "ELA - Stand alone items",
      "sourceQuestion": "50",
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9",
      "collection": "official_handbook"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-c3147b4fd6b842e90797.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "What is the best way to combine the sentences?\n(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.\n(2) One of Jupiter’s moons is named Io.\n(3) Io has the greatest number of active volcanoes in the solar system.",
    "promptHtml": "<p><span>What is the <strong>best</strong> way to combine the sentences?</span></p> <blockquote data-boxed=\"true\"> <p><span>(1) Scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons.</span></p> <p><span>(2) One of Jupiter’s moons is named Io.</span></p> <p><span>(3) Io has the greatest number of active volcanoes in the solar system.</span></p> </blockquote>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons.</span></p>",
        "text": "Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      },
      {
        "id": "B",
        "html": "<p><span>Scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system.</span></p>",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "C",
        "html": "<p><span>Scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons, including one named Io, which has the greatest number of active volcanoes in the solar system.</span></p>",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, including one named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "D",
        "html": "<p><span>Io, a moon with the greatest number of active volcanoes in the solar system, is one&nbsp;of Jupiter’s moons, and scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons.</span></p>",
        "text": "Io, a moon with the greatest number of active volcanoes in the solar system, is one of Jupiter’s moons, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2026-2027 Form D"
    ],
    "versionLabel": "2026-2027 Form D"
  },
  {
    "id": "pdf-shsat-2024-2025-b-q001",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "1",
      "packageId": "0db5163b54b18f0ba34f108d400ce64e5641ece9d2b287117493ae2eea27aa6e",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the best way to combine the sentences.\n\nA. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nB. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.\n\nC. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nD. Incorrect. The combination of the sentences creates an illogical relationship between ideas with the statement that tourists will be allowed to visit the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.",
    "explanationHtml": "<p>The question asks for the best way to combine the sentences.</p><p>A. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.</p><p>B. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.</p><p>C. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.</p><p>D. Incorrect. The combination of the sentences creates an illogical relationship between ideas with the statement that tourists will be allowed to visit the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.</p>",
    "points": 1,
    "prompt": "What is the best way to combine these sentences to clarify the relationship between ideas?\n\n(1) The International Space Station has been inhabited by crew members since 2000. (2) Tourists will soon be allowed to pay for visits to the space station. (3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.",
    "promptHtml": "<p>What is the <strong>best </strong>way to combine these sentences to clarify the relationship between ideas?</p><blockquote data-boxed=\"true\">(1) The International Space Station has been inhabited by crew members since 2000.<br>(2) Tourists will soon be allowed to pay for visits to the space station.<br>(3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.</blockquote>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, which cost $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space.</p>",
        "text": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, which cost $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "B",
        "html": "<p>The International Space Station has been inhabited by crew members since 2000 and will soon allow tourists to pay for visits, but because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.</p>",
        "text": "The International Space Station has been inhabited by crew members since 2000 and will soon allow tourists to pay for visits, but because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "C",
        "html": "<p>The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, though the cost is $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space.</p>",
        "text": "The International Space Station has been inhabited by crew members since 2000, but tourists will soon be allowed to pay for visits to the space station, though the cost is $52–$58 million round trip, so few people will be able to take advantage of the opportunity to have a vacation in outer space."
      },
      {
        "id": "D",
        "html": "<p>The International Space Station has been inhabited by crew members since 2000, and tourists will soon be allowed to pay for visits to the space station because the cost is $52–$58 million round trip, therefore few people will be able to take advantage of the opportunity to have a vacation in outer space.</p>",
        "text": "The International Space Station has been inhabited by crew members since 2000, and tourists will soon be allowed to pay for visits to the space station because the cost is $52–$58 million round trip, therefore few people will be able to take advantage of the opportunity to have a vacation in outer space."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form B"
    ],
    "versionLabel": "2024-2025 Form B"
  },
  {
    "id": "pdf-shsat-2024-2025-b-q002",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "2",
      "packageId": "0db5163b54b18f0ba34f108d400ce64e5641ece9d2b287117493ae2eea27aa6e",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the identification of the sentence that has an error in its construction and\n\nshould be revised.\n\nA. Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things. B. CORRECT. Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.” C. Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence. D. Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.",
    "explanationHtml": "<p><strong>2. </strong>The question asks for the identification of the sentence that has an error in its construction and</p><p>should be revised.</p><p><strong>A. </strong>Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things. <strong>B. CORRECT. </strong>Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.” <strong>C. </strong>Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence. <strong>D. </strong>Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.</p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n\n(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "promptHtml": "<p>Which sentence contains an error in its construction and should be revised?</p><blockquote data-boxed=\"true\">(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time.<br>(2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons.<br>(3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals.<br>(4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form B"
    ],
    "versionLabel": "2024-2025 Form B"
  },
  {
    "id": "pdf-shsat-2024-2025-b-q003",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "3",
      "packageId": "0db5163b54b18f0ba34f108d400ce64e5641ece9d2b287117493ae2eea27aa6e",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the revision of the sentence that uses the most precise language.\n\nA. Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking). B. Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million). C. CORRECT. The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence. D. Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).",
    "explanationHtml": "<p><strong>3. </strong>The question asks for the revision of the sentence that uses the <strong>most </strong>precise language.</p><p><strong>A. </strong>Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking). <strong>B. </strong>Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million). <strong>C. CORRECT. </strong>The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence. <strong>D. </strong>Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nThe Appalachian Trail is a really long trail that a lot of people do each year.\n\nWhich revision of the sentence uses the most precise language?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\">The Appalachian Trail is a really long trail that a lot of people do each year.</blockquote><p>Which revision of the sentence uses the <strong>most </strong>precise language?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>The Appalachian Trail is an extremely long trail that millions of people do each year.</p>",
        "text": "The Appalachian Trail is an extremely long trail that millions of people do each year."
      },
      {
        "id": "B",
        "html": "<p>The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year.</p>",
        "text": "The Appalachian Trail is a 2,200-mile trail that more than a million people hike each year."
      },
      {
        "id": "C",
        "html": "<p>The Appalachian Trail is a 2,200-mile trail that two million people hike each year.</p>",
        "text": "The Appalachian Trail is a 2,200-mile trail that two million people hike each year."
      },
      {
        "id": "D",
        "html": "<p>The Appalachian Trail is a lengthy trail that a couple million people do each year.</p>",
        "text": "The Appalachian Trail is a lengthy trail that a couple million people do each year."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form B"
    ],
    "versionLabel": "2024-2025 Form B"
  },
  {
    "id": "pdf-shsat-2024-2025-b-q004",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2024-2025-form-b",
      "label": "2024-2025 Form B",
      "year": "2024-2025",
      "form": "B",
      "sourceQuestion": "4",
      "packageId": "0db5163b54b18f0ba34f108d400ce64e5641ece9d2b287117493ae2eea27aa6e",
      "pages": [
        5
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the pair of revisions needed to correct the errors in the paragraph, which\n\nappear in sentence 2 and sentence 3.\n\nA. Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. The only edit needed in this pair is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” B. Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.” C. CORRECT. This option is the only choice that revises the errors in both sentence 2 and sentence 3. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” A comma is necessary because the phrase is a nonrestrictive clause: the phrase provides extra information about Cleo and Noah McVicker’s line of work, but the phrase is not necessary in order to understand the meaning of the sentence. The second error is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” D. Incorrect. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.”",
    "explanationHtml": "<p><strong>4. </strong>The question asks for the pair of revisions needed to correct the errors in the paragraph, which</p><p>appear in sentence 2 and sentence 3.</p><p><strong>A. </strong>Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. The only edit needed in this pair is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” <strong>B. </strong>Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.” <strong>C. CORRECT. </strong>This option is the only choice that revises the errors in both sentence 2 and sentence 3. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” A comma is necessary because the phrase is a nonrestrictive clause: the phrase provides extra information about Cleo and Noah McVicker’s line of work, but the phrase is not necessary in order to understand the meaning of the sentence. The second error is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” <strong>D. </strong>Incorrect. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.”</p>",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n\n(1) When coal was used to heat homes, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.",
    "promptHtml": "<p>Which pair of revisions need to be made in this paragraph?</p><blockquote data-boxed=\"true\">(1) When coal was used to heat homes, it frequently left soot stains on the walls.<br>(2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot.<br>(3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business.<br>(4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.</blockquote>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>homes</strong></em>. Sentence 3: Change <em><strong>becomes </strong></em>to <strong>became</strong>.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 3: Change becomes to became."
      },
      {
        "id": "B",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>homes</strong></em>. Sentence 4: Change <em><strong>remarketed </strong></em>to <strong>had remarketed</strong>.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 4: Change remarketed to had remarketed."
      },
      {
        "id": "C",
        "html": "<p>Sentence 2: Insert a comma after <em><strong>company</strong></em>. Sentence 3: Change <em><strong>becomes </strong></em>to <strong>became</strong>.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 3: Change becomes to became."
      },
      {
        "id": "D",
        "html": "<p>Sentence 2: Insert a comma after <em><strong>company</strong></em>. Sentence 4: Change <em><strong>remarketed </strong></em>to <strong>had remarketed</strong>.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 4: Change remarketed to had remarketed."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form B"
    ],
    "versionLabel": "2024-2025 Form B"
  },
  {
    "id": "satcc-digital-shsat-practice-test-5-v2-ela-47",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "revising_editing_b",
      "sourceQuestion": "47",
      "packageId": "45089cf14eeaf7319d3d5fe8d1ede638ce65bc38d8d6bcb05369a6c828850d14"
    },
    "explanation": "Correct Answer: D\nExplanation: the stem asks which sentence contains a construction error\nA. Incorrect: Sentence 3 is a complete sentence describing Coach Ibarra splitting the runners into two lines.\nB. Incorrect: Sentence 4 is a complete sentence describing the rule for advancing to the second round.\nC. Incorrect: Sentence 1 is a complete compound sentence correctly joined with \"and.\"\nD. Correct: Sentence 2 begins with \"Because\" and never completes an independent clause, leaving it a sentence fragment attached to no main clause.",
    "explanationHtml": "<p>Correct Answer: D</p><p>Explanation: the stem asks which sentence contains a construction error</p><p>A. Incorrect: Sentence 3 is a complete sentence describing Coach Ibarra splitting the runners into two lines.</p><p>B. Incorrect: Sentence 4 is a complete sentence describing the rule for advancing to the second round.</p><p>C. Incorrect: Sentence 1 is a complete compound sentence correctly joined with &quot;and.&quot;</p><p>D. Correct: Sentence 2 begins with &quot;Because&quot; and never completes an independent clause, leaving it a sentence fragment attached to no main clause.</p>",
    "points": 1,
    "prompt": "Which sentence of the paragraph contains an error in its construction and should be revised?",
    "stimulus": "(1) The tryouts for the winter track team started on a Tuesday, and almost forty students showed up before the gym doors even opened. (2) Because the gym had only one working clock, and the assistant coaches needed a second one to keep both lines moving on schedule. (3) Coach Ibarra split the runners into two lines, one for sprinters and one for distance athletes, and reminded everyone to stretch first. (4) Anyone who finished in the top fifteen would be invited back for a second round of drills the following week, along with a short conditioning test.",
    "stimulusHtml": "<p>(1) The tryouts for the winter track team started on a Tuesday, and almost forty students showed up before the gym doors even opened. (2) Because the gym had only one working clock, and the assistant coaches needed a second one to keep both lines moving on schedule. (3) Coach Ibarra split the runners into two lines, one for sprinters and one for distance athletes, and reminded everyone to stretch first. (4) Anyone who finished in the top fifteen would be invited back for a second round of drills the following week, along with a short conditioning test.</p>",
    "promptHtml": "<p>Which sentence of the paragraph contains an error in its construction and should be revised?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "B",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      },
      {
        "id": "C",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "D",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "Digital SHSAT Practice Test 5"
    ],
    "versionLabel": "Digital SHSAT Practice Test 5"
  },
  {
    "id": "satcc-digital-shsat-practice-test-5-v2-ela-48",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "revising_editing_b",
      "sourceQuestion": "48",
      "packageId": "45089cf14eeaf7319d3d5fe8d1ede638ce65bc38d8d6bcb05369a6c828850d14"
    },
    "explanation": "Correct Answers: A, D\nExplanation: the stem asks which two sentences contain a comma splice\nA. Correct: Sentence 1 joins two independent clauses, \"used to be a storage closet\" and \"the custodians cleared it out,\" with only a comma.\nB. Incorrect: Sentence 2 opens with an introductory phrase followed by a single independent clause; the comma after the introductory phrase is grammatically correct.\nC. Incorrect: Sentence 3 properly joins its clauses using the coordinating conjunctions \"so\" and \"and,\" not a bare comma.\nD. Correct: Sentence 4 joins two independent clauses, \"Practice usually runs an hour\" and \"some weeks it stretches closer to ninety minutes,\" with only a comma.\nE. Incorrect: Sentence 5 opens with a subordinate clause correctly separated by a comma from the single independent clause that follows.",
    "explanationHtml": "<p>Correct Answers: A, D</p><p>Explanation: the stem asks which two sentences contain a comma splice</p><p>A. Correct: Sentence 1 joins two independent clauses, &quot;used to be a storage closet&quot; and &quot;the custodians cleared it out,&quot; with only a comma.</p><p>B. Incorrect: Sentence 2 opens with an introductory phrase followed by a single independent clause; the comma after the introductory phrase is grammatically correct.</p><p>C. Incorrect: Sentence 3 properly joins its clauses using the coordinating conjunctions &quot;so&quot; and &quot;and,&quot; not a bare comma.</p><p>D. Correct: Sentence 4 joins two independent clauses, &quot;Practice usually runs an hour&quot; and &quot;some weeks it stretches closer to ninety minutes,&quot; with only a comma.</p><p>E. Incorrect: Sentence 5 opens with a subordinate clause correctly separated by a comma from the single independent clause that follows.</p>",
    "points": 1,
    "prompt": "Select the two sentences that contain a comma splice.",
    "stimulus": "(1) The debate team’s new practice room used to be a storage closet, the custodians cleared it out and added folding chairs over winter break. (2) Every Thursday afternoon, four students meet there to run through timed rebuttals against a stopwatch app on someone’s phone. (3) The room has no windows, so somebody always brings a desk lamp for extra light, and the door stays propped open for ventilation. (4) Practice usually runs an hour, some weeks it stretches closer to ninety minutes depending on how contentious that week’s topic turns out to be. (5) By the time state qualifiers arrive each spring, the team has usually logged well over sixty hours inside that converted closet.",
    "stimulusHtml": "<p>(1) The debate team’s new practice room used to be a storage closet, the custodians cleared it out and added folding chairs over winter break. (2) Every Thursday afternoon, four students meet there to run through timed rebuttals against a stopwatch app on someone’s phone. (3) The room has no windows, so somebody always brings a desk lamp for extra light, and the door stays propped open for ventilation. (4) Practice usually runs an hour, some weeks it stretches closer to ninety minutes depending on how contentious that week’s topic turns out to be. (5) By the time state qualifiers arrive each spring, the team has usually logged well over sixty hours inside that converted closet.</p>",
    "promptHtml": "<p>Select the two sentences that contain a comma splice.</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      },
      {
        "id": "E",
        "html": "<p>sentence 5</p>",
        "text": "sentence 5"
      }
    ],
    "correctChoiceIds": [
      "A",
      "D"
    ],
    "requiredSelections": 2,
    "type": "multi_select",
    "versionLabels": [
      "Digital SHSAT Practice Test 5"
    ],
    "versionLabel": "Digital SHSAT Practice Test 5"
  },
  {
    "id": "satcc-digital-shsat-practice-test-5-v2-ela-49",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "revising_editing_b",
      "sourceQuestion": "49",
      "packageId": "45089cf14eeaf7319d3d5fe8d1ede638ce65bc38d8d6bcb05369a6c828850d14"
    },
    "explanation": "Correct Answer: A\nExplanation: the stem asks for the best combination of sentences 1 and 2\nA. Correct: The participial phrase \"wanting at least one picture\" clearly shows that collecting photos was done in pursuit of that goal, without adding any illogical connector.\nB. Incorrect: \"But\" wrongly implies a contrast between collecting photos and wanting a complete set, when the two ideas are entirely compatible.\nC. Incorrect: \"Or\" wrongly presents the two ideas as alternatives, when the second describes the purpose of the first.\nD. Incorrect: Adding \"before that\" after \"since\" creates a confusing, illogical time relationship between the two ideas.",
    "explanationHtml": "<p>Correct Answer: A</p><p>Explanation: the stem asks for the <strong>best</strong> combination of sentences 1 and 2</p><p>A. Correct: The participial phrase &quot;wanting at least one picture&quot; clearly shows that collecting photos was done in pursuit of that goal, without adding any illogical connector.</p><p>B. Incorrect: &quot;But&quot; wrongly implies a contrast between collecting photos and wanting a complete set, when the two ideas are entirely compatible.</p><p>C. Incorrect: &quot;Or&quot; wrongly presents the two ideas as alternatives, when the second describes the purpose of the first.</p><p>D. Incorrect: Adding &quot;before that&quot; after &quot;since&quot; creates a confusing, illogical time relationship between the two ideas.</p>",
    "points": 1,
    "prompt": "What is the best way to combine sentences 1 and 2 to clarify the relationship between the ideas?",
    "stimulus": "(1) The yearbook committee spent three weeks collecting photos from every club. (2) They wanted at least one picture of every student by the deadline. (3) Some students never submitted a photo despite repeated reminders sent through homeroom announcements and email. (4) The committee used old ID photos instead, even though a few of those images were several years out of date and barely recognizable. (5) Next year’s editors have already discussed moving the deadline earlier to avoid the same last-minute scramble.",
    "stimulusHtml": "<p>(1) The yearbook committee spent three weeks collecting photos from every club. (2) They wanted at least one picture of every student by the deadline. (3) Some students never submitted a photo despite repeated reminders sent through homeroom announcements and email. (4) The committee used old ID photos instead, even though a few of those images were several years out of date and barely recognizable. (5) Next year’s editors have already discussed moving the deadline earlier to avoid the same last-minute scramble.</p>",
    "promptHtml": "<p>What is the <strong>best</strong> way to combine sentences 1 and 2 to clarify the relationship between the ideas?</p>",
    "topic": "",
    "choices": [
      {
        "id": "A",
        "html": "<p>The yearbook committee spent three weeks collecting photos from every club, wanting at least one picture of every student by the deadline.</p>",
        "text": "The yearbook committee spent three weeks collecting photos from every club, wanting at least one picture of every student by the deadline."
      },
      {
        "id": "B",
        "html": "<p>The yearbook committee spent three weeks collecting photos from every club, but they wanted at least one picture of every student by the deadline.</p>",
        "text": "The yearbook committee spent three weeks collecting photos from every club, but they wanted at least one picture of every student by the deadline."
      },
      {
        "id": "C",
        "html": "<p>The yearbook committee spent three weeks collecting photos from every club, or they wanted at least one picture of every student by the deadline.</p>",
        "text": "The yearbook committee spent three weeks collecting photos from every club, or they wanted at least one picture of every student by the deadline."
      },
      {
        "id": "D",
        "html": "<p>The yearbook committee spent three weeks collecting photos from every club, since they wanted at least one picture of every student by the deadline before that.</p>",
        "text": "The yearbook committee spent three weeks collecting photos from every club, since they wanted at least one picture of every student by the deadline before that."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "Digital SHSAT Practice Test 5"
    ],
    "versionLabel": "Digital SHSAT Practice Test 5"
  },
  {
    "id": "satcc-digital-shsat-practice-test-5-v2-ela-50",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-digital-shsat-practice-test-5-v2",
      "label": "Digital SHSAT Practice Test 5",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%205%20v2",
      "form": "5 v2",
      "section": "revising_editing_b",
      "sourceQuestion": "50",
      "packageId": "45089cf14eeaf7319d3d5fe8d1ede638ce65bc38d8d6bcb05369a6c828850d14"
    },
    "explanation": "Sentences 1, 2, and 4 all describe the garden club itself: its schedule, what members grow, and where the produce goes. Sentence 3 shifts to an unrelated fact about the cafeteria's lunch shifts and should be deleted as off-topic.",
    "explanationHtml": "<p>Sentences 1, 2, and 4 all describe the garden club itself: its schedule, what members grow, and where the produce goes. Sentence 3 shifts to an unrelated fact about the cafeteria's lunch shifts and should be deleted as off-topic.</p>",
    "points": 1,
    "prompt": "Sort each sentence of the paragraph into the correct category based on whether it belongs in the paragraph about the garden club or should be deleted as off-topic.",
    "stimulus": "(1) The school’s new garden club meets behind the cafeteria every Wednesday after last period, rain or shine. (2) Members have planted three raised beds of vegetables, including tomatoes, peppers, and lettuce, along with a small herb border. (3) The cafeteria serves lunch in two separate shifts because the room is too small for the whole school to eat at once. (4) Whatever the beds produce gets donated to the school’s weekly food pantry drive, along with any extra seedlings members grow at home.",
    "stimulusHtml": "<p>(1) The school’s new garden club meets behind the cafeteria every Wednesday after last period, rain or shine. (2) Members have planted three raised beds of vegetables, including tomatoes, peppers, and lettuce, along with a small herb border. (3) The cafeteria serves lunch in two separate shifts because the room is too small for the whole school to eat at once. (4) Whatever the beds produce gets donated to the school’s weekly food pantry drive, along with any extra seedlings members grow at home.</p>",
    "promptHtml": "<p>Sort each sentence of the paragraph into the correct category based on whether it belongs in the paragraph about the garden club or should be deleted as off-topic.</p>",
    "topic": "",
    "categories": [
      {
        "id": "belongs",
        "title": "Belongs in the paragraph"
      },
      {
        "id": "off-topic",
        "title": "Should be deleted as off-topic"
      }
    ],
    "correctPlacements": {
      "sentence-1": "belongs",
      "sentence-2": "belongs",
      "sentence-3": "off-topic",
      "sentence-4": "belongs"
    },
    "instructions": "Move each answer to the correct box.",
    "items": [
      {
        "id": "sentence-1",
        "text": "1. The school's new garden club meets behind the cafeteria every Wednesday after last period, rain or shine."
      },
      {
        "id": "sentence-2",
        "text": "2. Members have planted three raised beds of vegetables, including tomatoes, peppers, and lettuce, along with a small herb border."
      },
      {
        "id": "sentence-3",
        "text": "3. The cafeteria serves lunch in two separate shifts because the room is too small for the whole school to eat at once."
      },
      {
        "id": "sentence-4",
        "text": "4. Whatever the beds produce gets donated to the school's weekly food pantry drive, along with any extra seedlings members grow at home."
      }
    ],
    "requiredPlacements": 4,
    "type": "category_sort",
    "versionLabels": [
      "Digital SHSAT Practice Test 5"
    ],
    "versionLabel": "Digital SHSAT Practice Test 5"
  },
  {
    "id": "part-b-import-82a8231a8843-a770392e",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks which edit should be made to correct the sentence.\n\nA. Incorrect. This edit incorrectly deletes the comma that is necessary to set off the year in a date from the remainder of the sentence. B. Incorrect. This edit introduces an unnecessary comma into the sentence by needlessly separating the adjective phrase “Boston University student” from the noun it modifies, “Zach Prescott.” C. Incorrect. This edit would delete the comma needed to separate the participle phrase “breaking the 32-year-old world record in joggling” and its companion appositive “a sport that combines jogging and juggling” from the rest of the sentence. This complete element is nonessential, which means it requires separation from the rest of the sentence with a comma because its removal would not fundamentally change the meaning of the sentence. D. CORRECT. The appositive “a sport that combines jogging and juggling” further describes the word “joggling.” An appositive requires separation with a comma because it is nonessential, meaning that its removal would not change the overall meaning of the sentence.",
    "explanationHtml": "<p>The question asks which edit should be made to correct the sentence.</p><p><strong>A. </strong>Incorrect. This edit incorrectly deletes the comma that is necessary to set off the year in a date from the remainder of the sentence. <strong>B. </strong>Incorrect. This edit introduces an unnecessary comma into the sentence by needlessly separating the adjective phrase “Boston University student” from the noun it modifies, “Zach Prescott.” <strong>C. </strong>Incorrect. This edit would delete the comma needed to separate the participle phrase “breaking the 32-year-old world record in joggling” and its companion appositive “a sport that combines jogging and juggling” from the rest of the sentence. This complete element is nonessential, which means it requires separation from the rest of the sentence with a comma because its removal would not fundamentally change the meaning of the sentence. <strong>D. CORRECT. </strong>The appositive “a sport that combines jogging and juggling” further describes the word “joggling.” An appositive requires separation with a comma because it is nonessential, meaning that its removal would not change the overall meaning of the sentence.</p>",
    "points": 1,
    "prompt": "Which edit should be made in the sentence?",
    "stimulus": "On May 8, 2018, Boston University student Zach Prescott ran a mile in 4 minutes 43.2 seconds while juggling three lacrosse balls, breaking the 32-year-old world record in joggling a sport that combines jogging and juggling.",
    "stimulusHtml": "<p>On May 8, <u>2018,</u> Boston University <u>student</u> Zach Prescott ran a mile in 4 minutes 43.2 seconds while juggling three <u>lacrosse balls,</u> breaking the 32-year-old world record in <u>joggling</u> a sport that combines jogging and juggling.</p>",
    "promptHtml": "<p>Which edit should be made in the sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>Delete the comma after <em><strong>2018</strong></em>.</p>",
        "text": "Delete the comma after 2018."
      },
      {
        "id": "B",
        "html": "<p>Insert a comma after <em><strong>student</strong></em>.</p>",
        "text": "Insert a comma after student."
      },
      {
        "id": "C",
        "html": "<p>Delete the comma after <em><strong>lacrosse balls</strong></em>.</p>",
        "text": "Delete the comma after lacrosse balls."
      },
      {
        "id": "D",
        "html": "<p>Insert a comma after <em><strong>joggling</strong></em>.</p>",
        "text": "Insert a comma after joggling."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2023-2024 Form A"
    ],
    "versionLabel": "2023-2024 Form A"
  },
  {
    "id": "part-b-import-103e98885c3f-1ea2b49a",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How should the paragraph be revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1) Danielle <u>spent</u> several hours preparing for an upcoming audition for a <u>play</u> at the community theater. (2) First she <u>did</u> vocal exercises to practice her diction and <u>projection</u> so that her words would carry clearly throughout the large auditorium. (3) Then she <u>studies</u> the text of the monologue to better understand the <u>emotions,</u> and motivations of the character she plans to portray. (4) Finally she <u>recited</u> her monologue in front of a mirror many <u>times,</u> making slight adjustments and improvements to her performance each time.",
    "topic": "Verbs",
    "versionLabels": [
      "2023-2024 Form A"
    ],
    "versionLabel": "2023-2024 Form A",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change <em><strong>spent</strong></em> to <strong>had spent</strong>, AND insert a comma after <em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change <em><strong>did</strong></em> to <strong>does</strong>, AND insert a comma after <em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change <em><strong>studies</strong></em> to <strong>studied</strong>, AND delete the comma after <em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change <em><strong>recited</strong></em> to <strong>recites</strong>, AND delete the comma after <em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "explanation": "The question asks how the paragraph should be revised.\n\nE. Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. F. Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. G. CORRECT. Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. H. Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.",
    "explanationHtml": "<p>The question asks how the paragraph should be revised.</p><p><strong>E. </strong>Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. <strong>F. </strong>Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. <strong>G. CORRECT. </strong>Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. <strong>H. </strong>Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.</p>",
    "duplicateOf": "part-b-question-7",
    "canonicalContent": true
  },
  {
    "id": "part-b-import-89aa1af30631-fdac2918",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "3",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the correct revision of the sentence in the box.\n\nA. Incorrect. The revisions do not fix the error that “to promote their club” modifies “a bake sale.” B. Incorrect. The revisions do not fix the error that “to promote their club” modifies “a bake sale.” C. CORRECT. The revision is correct because it includes the phrase “to promote their club” clearly modifying “members of the debate team.” D. Incorrect. While the revision clarifies that “to promote their club” relates to the “members of the debate team,” the rest of the sentence is poorly written because the insertion of “on Wednesday to promote their club” in the middle of the sentence interrupts the main clause, “Members of the debate team will sponsor a bake sale.”",
    "explanationHtml": "<p>The question asks for the correct revision of the sentence in the box.</p><p><strong>A. </strong>Incorrect. The revisions do not fix the error that “to promote their club” modifies “a bake sale.” <strong>B. </strong>Incorrect. The revisions do not fix the error that “to promote their club” modifies “a bake sale.” <strong>C. CORRECT. </strong>The revision is correct because it includes the phrase “to promote their club” clearly modifying “members of the debate team.” <strong>D. </strong>Incorrect. While the revision clarifies that “to promote their club” relates to the “members of the debate team,” the rest of the sentence is poorly written because the insertion of “on Wednesday to promote their club” in the middle of the sentence interrupts the main clause, “Members of the debate team will sponsor a bake sale.”</p>",
    "points": 1,
    "prompt": "How should this sentence be revised?",
    "stimulus": "To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.",
    "stimulusHtml": "<p>To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.</p>",
    "promptHtml": "<p>How should this sentence be revised?</p>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team.</p>",
        "text": "To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "B",
        "html": "<p>On Wednesday, to promote their club, a bake sale will be sponsored by members of the debate team.</p>",
        "text": "On Wednesday, to promote their club, a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "C",
        "html": "<p>To promote their club, members of the debate team will sponsor a bake sale on Wednesday.</p>",
        "text": "To promote their club, members of the debate team will sponsor a bake sale on Wednesday."
      },
      {
        "id": "D",
        "html": "<p>Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale.</p>",
        "text": "Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2023-2024 Form A"
    ],
    "versionLabel": "2023-2024 Form A"
  },
  {
    "id": "part-b-import-63ff15016dc9-8d09d754",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "4",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the correction of an error in sentence structure in the paragraph.\n\nE. CORRECT. The first sentence is a run-on sentence because both clauses—“In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution” and “the museum is already the Smithsonian’s third most popular site”—are independent clauses, and independent clauses should not be combined without the use of a conjunction and a comma. The revision in this option adds the word “and” before the comma, which corrects the run-on. F. Incorrect. The revision does not correct an error in sentence structure, since there are independent clauses on both sides of the period. G. Incorrect. Adding the words “which include” rather than the word “including” after the comma does not correct an error in sentence structure. The sentence is correct as written. H. Incorrect. Revising the wording in the underlined portion of the sentence to “which was written” from “written” does not correct a structural error. No edits are needed to correct the wording in the sentence.",
    "explanationHtml": "<p>The question asks for the correction of an error in sentence structure in the paragraph.</p><p><strong>E. CORRECT. </strong>The first sentence is a run-on sentence because both clauses—“In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution” and “the museum is already the Smithsonian’s third most popular site”—are independent clauses, and independent clauses should not be combined without the use of a conjunction and a comma. The revision in this option adds the word “and” before the comma, which corrects the run-on. <strong>F. </strong>Incorrect. The revision does not correct an error in sentence structure, since there are independent clauses on both sides of the period. <strong>G. </strong>Incorrect. Adding the words “which include” rather than the word “including” after the comma does not correct an error in sentence structure. The sentence is correct as written. <strong>H. </strong>Incorrect. Revising the wording in the underlined portion of the sentence to “which was written” from “written” does not correct a structural error. No edits are needed to correct the wording in the sentence.</p>",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution, the museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a year. The museum features more than 30,000 objects, including Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation Proclamation, written in 1863 during the presidency of Abraham Lincoln, is also on display at the museum.",
    "stimulusHtml": "<p>In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian <u>Institution, the</u> museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a <u>year. The</u> museum features more than 30,000 <u>objects, including</u> Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation <u>Proclamation, written</u> in 1863 during the presidency of Abraham Lincoln, is also on display at the museum.</p>",
    "promptHtml": "<p>Which revision corrects the error in sentence structure in the paragraph?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Institution, and the</p>",
        "text": "Institution, and the"
      },
      {
        "id": "B",
        "html": "<p>year, and the</p>",
        "text": "year, and the"
      },
      {
        "id": "C",
        "html": "<p>objects, which include</p>",
        "text": "objects, which include"
      },
      {
        "id": "D",
        "html": "<p>Proclamation, which was written</p>",
        "text": "Proclamation, which was written"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2023-2024 Form A",
      "2020-2021 Form A"
    ],
    "versionLabel": "2023-2024 Form A"
  },
  {
    "id": "part-b-import-dad09a690e8f-b7c76e75",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks which edit should be made to correct the sentence.\n\nA. Incorrect. A comma is needed to separate the introductory infinitive phrase “to surprise her dad for his birthday on Friday,” which modifies Yolanda’s action, from the remainder of the sentence. B. CORRECT. A comma is needed between two adjectives of equal importance preceding a noun. In this case, the adjectives “tempting” and “savory” are of equal importance, modifying the noun “sandwiches.” Their equal importance can be determined by inserting the word “and” between them (“tempting and savory sandwiches”). C. Incorrect. This edit would introduce an error into the sentence by needlessly breaking up the two prepositional phrases “from a deli” and “in her neighborhood” with a comma. No comma is needed when prepositional phrases are joined together in this way to indicate a singular idea. In this sentence, these two phrases work together to show where the sandwiches are from. D. Incorrect. Deleting this comma would introduce an error into the sentence. A comma is needed to separate the first and second items in the series of three actions Yolanda undertook: “ordered tempting savory sandwiches from a deli in her neighborhood,” “prepared his favorite chocolate cake,” and “invited his best friends over for the evening.”",
    "explanationHtml": "<p>The question asks which edit should be made to correct the sentence.</p><p><strong>A. </strong>Incorrect. A comma is needed to separate the introductory infinitive phrase “to surprise her dad for his birthday on Friday,” which modifies Yolanda’s action, from the remainder of the sentence. <strong>B. CORRECT. </strong>A comma is needed between two adjectives of equal importance preceding a noun. In this case, the adjectives “tempting” and “savory” are of equal importance, modifying the noun “sandwiches.” Their equal importance can be determined by inserting the word “and” between them (“tempting and savory sandwiches”). <strong>C. </strong>Incorrect. This edit would introduce an error into the sentence by needlessly breaking up the two prepositional phrases “from a deli” and “in her neighborhood” with a comma. No comma is needed when prepositional phrases are joined together in this way to indicate a singular idea. In this sentence, these two phrases work together to show where the sandwiches are from. <strong>D. </strong>Incorrect. Deleting this comma would introduce an error into the sentence. A comma is needed to separate the first and second items in the series of three actions Yolanda undertook: “ordered tempting savory sandwiches from a deli in her neighborhood,” “prepared his favorite chocolate cake,” and “invited his best friends over for the evening.”</p>",
    "points": 1,
    "prompt": "Which revision should be made to correct the sentence?",
    "stimulus": "To surprise her dad for his birthday on Friday, Yolanda ordered tempting savory sandwiches from a deli in her neighborhood, prepared his favorite chocolate cake, and invited his best friends over for the evening.",
    "stimulusHtml": "<p>To surprise her dad for his birthday on <u>Friday,</u> Yolanda ordered <u>tempting</u> savory sandwiches from a <u>deli</u> in her <u>neighborhood,</u> prepared his favorite chocolate cake, and invited his best friends over for the evening.</p>",
    "promptHtml": "<p>Which revision should be made to correct the sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>Delete the comma after <em><strong>Friday</strong></em>.</p>",
        "text": "Delete the comma after Friday."
      },
      {
        "id": "B",
        "html": "<p>Insert a comma after <em><strong>tempting</strong></em>.</p>",
        "text": "Insert a comma after tempting."
      },
      {
        "id": "C",
        "html": "<p>Insert a comma after <em><strong>deli</strong></em>.</p>",
        "text": "Insert a comma after deli."
      },
      {
        "id": "D",
        "html": "<p>Delete the comma after <em><strong>neighborhood</strong>.</em></p>",
        "text": "Delete the comma after neighborhood."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2023-2024 Form B"
    ],
    "versionLabel": "2023-2024 Form B"
  },
  {
    "id": "part-b-import-5e1ca048df26-de426469",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "promptHtml": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "stimulus": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "stimulusHtml": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "topic": "Modifiers",
    "versionLabels": [
      "2023-2024 Form B"
    ],
    "versionLabel": "2023-2024 Form B",
    "categories": [
      {
        "id": "answer-box",
        "title": "Contains an error in construction"
      }
    ],
    "categoryCapacity": 1,
    "correctPlacements": {
      "answer-card-2": "answer-box"
    },
    "instructions": "Move the answer to the box. There is only one correct answer.",
    "items": [
      {
        "id": "answer-card-1",
        "text": "Sentence 1"
      },
      {
        "id": "answer-card-2",
        "text": "Sentence 2"
      },
      {
        "id": "answer-card-3",
        "text": "Sentence 3"
      },
      {
        "id": "answer-card-4",
        "text": "Sentence 4"
      }
    ],
    "requiredPlacements": 1,
    "type": "category_sort",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "duplicateOf": "part-b-question-6",
    "canonicalContent": true
  },
  {
    "id": "part-b-import-53426367cca3-283c4ade",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-b",
      "collection": "official_handbook",
      "label": "2023-2024 Form B",
      "year": "2023-2024",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        3
      ]
    },
    "explanation": "The question asks which two revisions are needed to correct the paragraph.\n\nA. Incorrect. The comma is needed after “Yalina” to separate the first and second names in the series of three names (Yalina, Michael, and Malcolm). The possessive determiner “their” is also correct as written because it refers back to “Yalina, Michael, and Malcolm,” a plural group of people. B. Incorrect. Changing “is” to “are” would introduce an error in subject-verb agreement into the sentence; the singular subject “Yalina’s job” requires the singular verb “is.” The comma after “bowl” is required because it separates the phrase “slowly adding water, eggs, melted butter, and blueberries,” which modifies how Yalina prepares the batter, from the remainder of the sentence. C. Incorrect. “It is” refers to the singular noun “mixture,” so this singular pronoun and verb form is correct. The comma after “smooth” is necessary because this is a compound sentence where two independent clauses (“Michael uses a wooden spoon to vigorously stir the mixture until it is smooth” and “Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time”) are joined using a coordinating conjunction, which requires a comma. D. CORRECT. The plural pronoun “they” refers incorrectly to a singular antecedent, “each pancake.” The pronoun should be changed to a singular one to match its antecedent. A comma is needed between two adjectives of equal importance that modify the noun “breakfast.” Because “sweet” and “delicious” could be written as “sweet and delicious,” they are of equal importance, and a comma is needed.",
    "explanationHtml": "<p>The question asks which two revisions are needed to correct the paragraph.</p><p><strong>A. </strong>Incorrect. The comma is needed after “Yalina” to separate the first and second names in the series of three names (Yalina, Michael, and Malcolm). The possessive determiner “their” is also correct as written because it refers back to “Yalina, Michael, and Malcolm,” a plural group of people. <strong>B. </strong>Incorrect. Changing “is” to “are” would introduce an error in subject-verb agreement into the sentence; the singular subject “Yalina’s job” requires the singular verb “is.” The comma after “bowl” is required because it separates the phrase “slowly adding water, eggs, melted butter, and blueberries,” which modifies how Yalina prepares the batter, from the remainder of the sentence. <strong>C. </strong>Incorrect. “It is” refers to the singular noun “mixture,” so this singular pronoun and verb form is correct. The comma after “smooth” is necessary because this is a compound sentence where two independent clauses (“Michael uses a wooden spoon to vigorously stir the mixture until it is smooth” and “Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time”) are joined using a coordinating conjunction, which requires a comma. <strong>D. CORRECT. </strong>The plural pronoun “they” refers incorrectly to a singular antecedent, “each pancake.” The pronoun should be changed to a singular one to match its antecedent. A comma is needed between two adjectives of equal importance that modify the noun “breakfast.” Because “sweet” and “delicious” could be written as “sweet and delicious,” they are of equal importance, and a comma is needed.</p>",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "stimulus": "(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "stimulusHtml": "<p>(1) <u>Yalina,</u> Michael, and Malcolm love making pancakes with <u>their</u> granddad on Saturday mornings. (2) Yalina’s job <u>is</u> to open the box and pour the pancake mix into a <u>bowl,</u> slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until <u>it is smooth,</u> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when <u>they start</u> to bubble, while all three siblings get the table ready for a <u>sweet</u> delicious breakfast.</p>",
    "promptHtml": "<p>Which pair of revisions is needed to correct the errors in the paragraph?</p>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>Yalina</strong></em>, AND change <em><strong>their </strong></em>to <strong>her</strong>.</p>",
        "text": "Sentence 1: Delete the comma after Yalina, AND change their to her."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Change <em><strong>is </strong></em>to <strong>are</strong>, AND delete the comma after <em><strong>bowl</strong></em>.</p>",
        "text": "Sentence 2: Change is to are, AND delete the comma after bowl."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Change <em><strong>it is </strong></em>to <strong>they are</strong>, AND delete the comma after <em><strong>smooth</strong></em>.</p>",
        "text": "Sentence 3: Change it is to they are, AND delete the comma after smooth."
      },
      {
        "id": "D",
        "html": "<p>Sentence 4: Change <em><strong>they start </strong></em>to <strong>it starts</strong>, AND insert a comma after <em><strong>sweet</strong></em>.</p>",
        "text": "Sentence 4: Change they start to it starts, AND insert a comma after sweet."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2023-2024 Form B"
    ],
    "versionLabel": "2023-2024 Form B"
  },
  {
    "id": "part-b-import-6821270b0d81-84bcb37c",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks which edit should be made to correct the sentence.\nA. CORRECT. The sentence in the box needs a comma to separate the coordinate adjectives.\nCoordinate adjectives describe characteristics of the same noun or subject and are connected\nwith a comma or “and.” This option is the only one that places a comma where it is needed,\nbetween the coordinate adjectives “agile” and “athletic.”\nB. Incorrect. The option incorrectly adds a comma in the middle of the phrase “first and only,”\nwhich modifies, or gives additional information about, “professional basketball player.”\nC. Incorrect. The option incorrectly adds a comma between two adjectives that are not\ncoordinate adjectives. “Only” is part of the phrase “first and only” and is modifying\n“professional basketball player.”\nD. Incorrect. The option is incorrect because a comma is not needed to set off the phrase “to\nscore 100 points in a single game.”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q001-explanation-1.png\" alt=\"Official explanation for source question 1; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "Which edit should be made to correct this sentence?",
    "instructions": "Read this sentence.",
    "instructionsHtml": "<p>Read this sentence.</p>",
    "stimulus": "In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.",
    "stimulusHtml": "In 1962 the <u>agile</u> athletic Wilt Chamberlain became the <u>first</u> and <u>only</u> professional basketball player in the United <u>States</u> to score 100 points in a single game.",
    "promptHtml": "Which edit should be made to correct this sentence?",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "Insert a comma after <strong><em>agile</em></strong>.",
        "text": "Insert a comma after agile."
      },
      {
        "id": "B",
        "html": "Insert a comma after <strong><em>first</em></strong>.",
        "text": "Insert a comma after first."
      },
      {
        "id": "C",
        "html": "Insert a comma after <strong><em>only</em></strong>.",
        "text": "Insert a comma after only."
      },
      {
        "id": "D",
        "html": "Insert a comma after <strong><em>States</em></strong>.",
        "text": "Insert a comma after States."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form A"
    ],
    "versionLabel": "2021-2022 Form A"
  },
  {
    "id": "part-b-import-685e4caef796-3cbc3b40",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "2",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the most precise revision for the words “The engineers tried some\nother things.”\nE. Incorrect. This revision uses the word “materials” rather than precisely identifying what the\nengineers used.\nF. CORRECT. This option revises the words to be more precise by using the specific words\n“tested” for the verb and “foam and fiberglass” for the materials.\nG. Incorrect. This revision uses the word “examined” rather than a word indicating a process of\nexperimental trial and error. The sentence also uses the word “materials” rather than\nprecisely identifying what the engineers used.\nH. Incorrect. This revision identifies the materials, but the imprecise verb “worked with” does\nnot specify what the engineers were doing.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q002-explanation-1.png\" alt=\"Official explanation for source question 2; original printed answer labels retained.\" width=\"684\"></p>",
    "points": 1,
    "prompt": "What is the most precise revision for the words The engineers tried some other things?",
    "instructions": "Read this sentence.",
    "instructionsHtml": "<p>Read this sentence.</p>",
    "stimulus": "The engineers tried some other things in the hope of finding a more effective insulation for the compartment.",
    "stimulusHtml": "<p><u>The engineers tried some other things</u> in the hope of finding a more effective insulation for the compartment.</p>",
    "promptHtml": "<p>What is the most precise revision for the words <strong><em>The engineers tried some other things</em></strong>?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "The engineers did experiments with several new materials",
        "text": "The engineers did experiments with several new materials"
      },
      {
        "id": "B",
        "html": "The engineers tested foam and fiberglass",
        "text": "The engineers tested foam and fiberglass"
      },
      {
        "id": "C",
        "html": "The engineers examined two new materials",
        "text": "The engineers examined two new materials"
      },
      {
        "id": "D",
        "html": "The engineers worked with foam and fiberglass",
        "text": "The engineers worked with foam and fiberglass"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form A"
    ],
    "versionLabel": "2021-2022 Form A"
  },
  {
    "id": "part-b-import-e9507c2137e0-26757058",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the revision that corrects the error in sentence structure in the paragraph.\nA. CORRECT. As written, the first sentence (“In 1967 Katherine Switzer . . . legendary race.”) is\na run-on sentence because a comma is used to combine two independent clauses.\nIndependent clauses are complete sentences with a subject and a verb. The clauses—“In\n1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials\ninstead of her full name” and “at that time, only men were permitted to officially register and\nreceive a number for the legendary race”—should be separated with a period instead. This\nrevision correctly places a period after the word “name” and capitalizes the word “At” to\nseparate the two independent clauses into two sentences.\nB. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on\nin the first sentence. The clause “Once officials realized a woman was attempting to run in\nthe race” is a dependent clause functioning as an adverb of the independent clause that\nfollows it. Changing the comma after the word “race” to a period would incorrectly separate\nthe adverbial dependent clause from the independent clause.\nC. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on\nin the first sentence. The sentence “Switzer prevailed and finished in just over four hours,\npaving the way for the official rule change that allowed for the inclusion of women” is a\ncomplex sentence, which combines an independent clause (“Switzer prevailed and finished in\njust over four hours”) and a dependent clause (“paving the way for the official rule change\nthat allowed for the inclusion of women”). The clause “paving the way for the official rule\nchange that allowed for the inclusion of women” is not a complete sentence and must stay\nconnected to the first part of the sentence. Changing the comma after “hours” to a period\nwould incorrectly separate the dependent clause from the independent clause.\nD. Incorrect. The revision introduces an error into the paragraph and does not revise the run-on\nin the first sentence. Changing the comma after “261” to a period would incorrectly separate\nthe modifying clause “the same number she had worn in that first run in 1967” from the\nwords it describes (“number 261”). Additionally, the clause “the same number she had worn\nin that first run in 1967” is not a complete sentence.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q003-explanation-1.png\" alt=\"Official explanation for source question 3; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "instructions": "Read this paragraph.",
    "instructionsHtml": "<p>Read this paragraph.</p>",
    "stimulus": "In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name, at that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the race, they made efforts to remove her from the competition. Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number 261, the same number she had worn in that first run in 1967.",
    "stimulusHtml": "<p>In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full <u>name, at</u> that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the <u>race, they</u> made efforts to remove her from the competition. Switzer prevailed and finished in just over four <u>hours, paving</u> the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number <u>261, the</u> same number she had worn in that first run in 1967.</p>",
    "promptHtml": "Which revision corrects the error in sentence structure in the paragraph?",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "name. At",
        "text": "name. At"
      },
      {
        "id": "B",
        "html": "race. They",
        "text": "race. They"
      },
      {
        "id": "C",
        "html": "hours. Paving",
        "text": "hours. Paving"
      },
      {
        "id": "D",
        "html": "261. The",
        "text": "261. The"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form A"
    ],
    "versionLabel": "2021-2022 Form A"
  },
  {
    "id": "part-b-import-e09cf6171e3b-9c9ff219",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-a",
      "label": "2021-2022 Form A",
      "year": "2021-2022",
      "form": "A",
      "sourceQuestion": "4",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the identification of the sentence that contains an error in its construction\nand should be revised.\nE. Incorrect. There are no errors in sentence 1. The singular pronoun “its” matches the number\nof the word it refers to, the singular noun “blobfish.” Additionally, the clause “a creature that\ncertainly resembles its name” is correctly set off by commas to provide an additional, but not\nessential, detail about the blobfish. The comma separating “pink” and “gelatinous” is correct\nbecause these are coordinate adjectives.\nF. Incorrect. There are no errors in sentence 2. The singular pronouns “it” and “its” match the\nnumber of the word they refer to, the singular noun “blobfish.” Additionally, the structure of\nthe sentence correctly shows that the clause “Because it has very few muscles and its density\nis close to that of water” modifies the words “the blobfish.”\nG. Incorrect. There are no errors in sentence 3. The “it” and “its” in the sentence refer to “the\nblobfish” mentioned in the previous sentence. The use of singular pronouns in sentence 3 is\nconsistent with the rest of the paragraph.\nH. CORRECT. Sentence 4 contains an error because the sentence uses the plural pronoun\n“them” to refer to “The blobfish’s,” which is singular in number. The word “them” should be\nchanged to “it.” The paragraph refers to the blobfish as a singular species in each of the four\nsentences, and sentence 4 should be revised to match.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-a-q004-explanation-1.png\" alt=\"Official explanation for source question 4; original printed answer labels retained.\" width=\"692\"></p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "instructions": "Read this paragraph.",
    "instructionsHtml": "<p>Read this paragraph.</p>",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "sentence 1",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "sentence 2",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "sentence 3",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "sentence 4",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form A"
    ],
    "versionLabel": "2021-2022 Form A"
  },
  {
    "id": "part-b-import-7226c5623b47-9e4b96da",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the best way to combine the sentences to clarify the relationship between\nthe ideas.\nA. Incorrect. Even though the two ideas from the original sentences are incorporated into the\ncombined sentence, the use of the conjunction “while” in the first part of the sentence\nsuggests that there is a simultaneous but unrelated relationship between the two ideas,\nwhich is incorrect.\nB. Incorrect. The combined sentence incorporates the ideas from both sentences, but the\nconjunction “although” suggests that scientists were allowed to collect data even though\nthere were flyby missions, which is an inaccurate way to express the relationship between\nthe ideas.\nC. CORRECT. This sentence is the best way to combine the sentences because it accurately\nreflects the relationship between the ideas by using the nonrestrictive clause “which allow\nscientists to collect data about the planet and its moons” to describe the purpose of the flyby\nmissions. (Nonrestrictive clauses are adjective clauses that give additional information about\na word or phrase. They sometimes begin with the relative pronoun “which” and are set off by\ncommas.) The idea that the missions “have been happening since 1973” follows the\nnonrestrictive clause.\nD. Incorrect. The combined sentence uses the conjunction “but” to connect the ideas in the two\noriginal sentences. This suggests an adverse relationship between ideas, which is an\ninaccurate way to connect the ideas expressed in the original sentences.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q001-explanation-1.png\" alt=\"Official explanation for source question 1; original printed answer labels retained.\" width=\"689\"></p>",
    "points": 1,
    "prompt": "Read these sentences.\n(1) Flyby missions near Jupiter have been happening since 1973.\n(2) Flyby missions allow scientists to collect data about Jupiter and its moons.\n\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "instructions": "Read these sentences.",
    "instructionsHtml": "<p>Read these sentences.</p>",
    "promptHtml": "<p><span><span>Read</span> these <span>sentences</span>.</span></p> <blockquote data-boxed=\"true\"> <p><span>(1) Flyby missions near Jupiter have been happening since </span><span>1973.</span></p> <p><span>(2) Flyby missions allow scientists to collect data about Jupiter and its moons.</span></p> </blockquote> <p> <span><br><span>What</span> is the <span>best</span> way to combine the sentences to clarify the relationship between the ideas?</span></p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>While flyby missions near Jupiter have been happening since </span><span>1973,</span><span> scientists collect data about the planet and its moons.</span></p>",
        "text": "While flyby missions near Jupiter have been happening since 1973, scientists collect data about the planet and its moons."
      },
      {
        "id": "B",
        "html": "<p><span>Although there have been flyby missions near Jupiter since </span><span>1973,</span><span> they have allowed scientists to collect data about the planet and its moons.</span></p>",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "<p><span>Flyby missions near Jupiter, <span>which</span> allow scientists to collect data about the planet and its moons, have been happening since </span><span>1973.</span></p>",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "D",
        "html": "<p><span>Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since </span><span>1973.</span></p>",
        "text": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form B"
    ],
    "versionLabel": "2021-2022 Form B"
  },
  {
    "id": "part-b-import-25cc3a4331f5-4a886a73",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the identification of the sentence that has an error in its construction and\nshould be revised.\n—. Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the\nLong Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the\ncorrect relative pronoun to serve as the subject of the modifying clause because it refers to\npeople rather than objects or things.\nF. CORRECT. Sentence 2 contains a structural error. The current placement of the clause\n“where the Nets played for thirty-five seasons” suggests the clause is modifying the term\n“financial troubles,” which is illogical. The clause “where the Nets played for thirty-five\nseasons” should immediately follow the location, “New Jersey.” A revised version of the\nsentence might read, “After the team had financial troubles, the owner of the Nets decided to\ntake the team to New Jersey, where the Nets played for thirty-five seasons.”\nG. Incorrect. There are no errors in the structure of sentence 3. The phrase “including two\nappearances in the NBA finals” is a nonrestrictive phrase that provides further detail about\nthe team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not\nessential to understanding the meaning of the sentence.\nH. Incorrect. There are no errors in the structure of sentence 4. The clause “where the team\nnow plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further\ndetail about the team after its move back to New York in 2012. The phrase is set off by a\ncomma because it is not essential to understanding the meaning of the sentence.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q002-explanation-1.png\" alt=\"Official explanation for source question 2; original printed answer labels retained.\" width=\"691\"></p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "instructions": "Read this paragraph.",
    "instructionsHtml": "<p>Read this paragraph.</p>",
    "stimulus": "(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "stimulusHtml": "<p>(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</p>",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "sentence 1",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "sentence 2",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "sentence 3",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "sentence 4",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form B"
    ],
    "versionLabel": "2021-2022 Form B"
  },
  {
    "id": "part-b-import-cc5a1f42770d-2c348204",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How should the paragraph be revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1) Danielle <u>spent</u> several hours preparing for an upcoming audition for a <u>play</u> at the community theater. (2) First she <u>did</u> vocal exercises to practice her diction and <u>projection</u> so that her words would carry clearly throughout the large auditorium. (3) Then she <u>studies</u> the text of the monologue to better understand the <u>emotions,</u> and motivations of the character she plans to portray. (4) Finally she <u>recited</u> her monologue in front of a mirror many <u>times,</u> making slight adjustments and improvements to her performance each time.",
    "topic": "Verbs",
    "versionLabels": [
      "2021-2022 Form B"
    ],
    "versionLabel": "2021-2022 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change <em><strong>spent</strong></em> to <strong>had spent</strong>, AND insert a comma after <em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change <em><strong>did</strong></em> to <strong>does</strong>, AND insert a comma after <em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change <em><strong>studies</strong></em> to <strong>studied</strong>, AND delete the comma after <em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change <em><strong>recited</strong></em> to <strong>recites</strong>, AND delete the comma after <em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "source": {
      "sourceFamily": "official_shsat",
      "collection": "official_handbook"
    },
    "explanation": "The question asks how the paragraph should be revised.\n\nE. Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. F. Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. G. CORRECT. Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. H. Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.",
    "explanationHtml": "<p>The question asks how the paragraph should be revised.</p><p><strong>E. </strong>Incorrect. The revisions in this option introduce new errors. The word “spent” is correct in the simple past tense because it encompasses the actions described throughout the rest of the paragraph, all of which happened during those “several hours.” Additionally, adding a comma after the word “play” would be incorrect because it would unnecessarily separate the prepositional phrase “at the community theater” from the rest of the sentence. <strong>F. </strong>Incorrect. The revisions in this option introduce new errors. The word “did” is correct as written in the past tense because the past tense is used throughout the paragraph. There is no comma needed after the word “projection” because “so” is functioning not as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. <strong>G. CORRECT. </strong>Changing the word “studies” from the present tense to the past tense “studied” is necessary to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. <strong>H. </strong>Incorrect. The revisions in this option introduce new errors. The word “recited” is correct as written in the past tense because the past tense is used throughout the paragraph. Also, removing the comma after “times” is incorrect because the comma is needed in order to separate the modifying phrase “making slight adjustments and improvements to her performance each time” from the main clause.</p>",
    "duplicateOf": "part-b-question-7",
    "canonicalContent": true
  },
  {
    "id": "part-b-import-fe5c3b88f8ad-7aa424b9",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2021-2022-form-b",
      "label": "2021-2022 Form B",
      "year": "2021-2022",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "The question asks for the revisions that are needed to correct errors in the paragraph.\nE. Incorrect. The revisions introduce new errors. The colon after “wonder” is needed to set off\nthe question “what is the difference between the two?” from the rest of the sentence. In\naddition, changing the verb “is” to “are” would be incorrect with the use of the singular noun\n“difference,” which is the subject in the question.\nF. Incorrect. The revisions introduce new errors. The comma following the introductory phrase\n“To start with” helps with clarity and is needed to separate the phrase from the rest of the\nsentence. Changing “it is” to “they are” would be incorrect with the use of the singular noun\n“butterfat content,” which is what the words “it is” refer to in the sentence.\nG. Incorrect. The revisions introduce new errors. The comma following “process” is necessary to\nset off the nonrestrictive clause “which adds less air to the frozen treat” from the rest of the\nsentence. This clause is considered a nonrestrictive clause because it provides additional, but\nnot essential, information about the mixing process. Changing the verb “makes” to “make”\nwould be incorrect with the use of the singular noun “mixing process,” which is the subject of\nthe sentence.\nH. CORRECT. Deleting the comma after “gelato” would include the clause “and allow it to melt\nmore quickly” with the first part of the clause “which enhances the texture and flavor of the\ngelato.” The word “and” between the two verb phrases (“enhances the texture and flavor of\nthe gelato” and “allow it to melt more quickly”) indicates that the two verb phrases share a\nsubject, “which” (referring to the act of serving gelato 10 to 15 degrees warmer than ice\ncream). The two ideas should not be separated by a comma within the clause. The entire\nclause “which enhances the texture and flavor of the gelato and allow it to melt more quickly”\nshould be separated from the main clause only by the comma after “cream” because the\nentire clause is a nonrestrictive clause. This clause provides additional, but not essential,\ninformation about the purpose of serving gelato at a warmer temperature than when serving\nice cream. Changing the verb “allow” to “allows” is also necessary to match the use of the\nsingular noun “gelato,” which is the subject of the sentence.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2021-2022-b-q004-explanation-1.png\" alt=\"Official explanation for source question 4; original printed answer labels retained.\" width=\"694\"></p>",
    "points": 1,
    "prompt": "Which pair of revisions needs to be made in this paragraph?",
    "instructions": "Read this paragraph.",
    "instructionsHtml": "<p>Read this paragraph.</p>",
    "stimulus": "(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "stimulusHtml": "<p>(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people <u>wonder:</u> what <u>is</u> the difference between the two? (2) To start <u>with,</u> the butterfat content is much higher in ice cream than <u>it is</u> in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing <u>process,</u> which adds less air to the frozen treat, <u>makes</u> gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the <u>gelato,</u> and <u>allow</u> it to melt more quickly.</p>",
    "promptHtml": "Which pair of revisions needs to be made in this paragraph?",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Delete the colon after <strong><em>wonder</em></strong> AND change <strong><em>is</em></strong> to <strong>are</strong>.",
        "text": "Sentence 1: Delete the colon after wonder AND change is to are."
      },
      {
        "id": "B",
        "html": "Sentence 2: Delete the comma after <strong><em>with</em></strong> AND change <strong><em>it is</em></strong> to <strong>they are</strong>.",
        "text": "Sentence 2: Delete the comma after with AND change it is to they are."
      },
      {
        "id": "C",
        "html": "Sentence 3: Delete the comma after <strong><em>process</em></strong> AND change <strong><em>makes</em></strong> to <strong>make</strong>.",
        "text": "Sentence 3: Delete the comma after process AND change makes to make."
      },
      {
        "id": "D",
        "html": "Sentence 4: Delete the comma after <strong><em>gelato</em></strong> AND change <strong><em>allow</em></strong> to <strong>allows</strong>.",
        "text": "Sentence 4: Delete the comma after gelato AND change allow to allows."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2021-2022 Form B"
    ],
    "versionLabel": "2021-2022 Form B"
  },
  {
    "id": "part-b-import-3cbd8c08e674-296b74d3",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "1. (D) The question asks for the most precise revision for the words “talked to some people who did the best in the contest.” Option D is the correct response because the revision precisely states both the reporter’s action (“interviewed”) and whom the reporter interviewed (“the top three contestants”). Option A is an incorrect response because the revision does not provide precise information about the number of people interviewed. Option B is an incorrect response because the revision uses the imprecise phrase “who did well.” Option C is an incorrect response because the revision does not provide precise information about the number of people interviewed.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q001-explanation-1.png\" alt=\"Supplied Form A explanation for question 1\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nDuring a nightly news segment about a cooking contest, a reporter talked to some people who did the best in the contest.\n\nWhich revision uses the most precise language for the words talked to some people who did the best in the contest?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\"><p>During a nightly news segment about a cooking contest, a reporter talked to some people who did the best in the contest.</p></blockquote><p>Which revision uses the most precise language for the words talked to some people who did the best in the contest?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>conversed with some of the people who won the contest</p>",
        "text": "conversed with some of the people who won the contest"
      },
      {
        "id": "B",
        "html": "<p>spoke to the three contestants who did well</p>",
        "text": "spoke to the three contestants who did well"
      },
      {
        "id": "C",
        "html": "<p>discussed the contest with some of the winners</p>",
        "text": "discussed the contest with some of the winners"
      },
      {
        "id": "D",
        "html": "<p>interviewed the top three contestants</p>",
        "text": "interviewed the top three contestants"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form A"
    ],
    "versionLabel": "2018-2019 Form A"
  },
  {
    "id": "part-b-import-473bc215a86a-5af09018",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "2. (G) The question asks for the pair of revisions needed to correct the errors in the paragraph, which appear in sentence 2 and sentence 3. Option G is correct because it is the only choice that revises the errors in both sentence 2 and sentence 3. In sentence 2 (Option G and Option H), a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” A comma is necessary because the phrase is a nonrestrictive clause: the phrase provides extra information about Cleo and Noah McVicker’s line of work, but the phrase is not necessary in order to understand the meaning of the sentence. The second error is in sentence 3 (Option E and Option G), which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” The comma after the word “homes” in sentence 1 (Option E and Option F) is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. In sentence 4 (Option F and Option H), the word “remarketed” is in the past tense established in the rest of the paragraph and should not change to the past perfect tense “had remarketed.”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q002-explanation-1.png\" alt=\"Supplied Form A explanation for question 2\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\n(1) When coal was used to heat homes, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.\n\nWhich pair of revisions need to be made in the paragraph?",
    "promptHtml": "<p>Read this paragraph.</p><blockquote data-boxed=\"true\"><p>(1) When coal was used to heat homes, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.</p></blockquote><p>Which pair of revisions need to be made in the paragraph?</p>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the comma after homes. Sentence 3: Change becomes to became.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 3: Change becomes to became."
      },
      {
        "id": "B",
        "html": "<p>Sentence 1: Delete the comma after homes. Sentence 4: Change remarketed to had remarketed.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 4: Change remarketed to had remarketed."
      },
      {
        "id": "C",
        "html": "<p>Sentence 2: Insert a comma after company. Sentence 3: Change becomes to became.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 3: Change becomes to became."
      },
      {
        "id": "D",
        "html": "<p>Sentence 2: Insert a comma after company. Sentence 4: Change remarketed to had remarketed.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 4: Change remarketed to had remarketed."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form A"
    ],
    "versionLabel": "2018-2019 Form A"
  },
  {
    "id": "part-b-import-17a36c202bfd-480b2997",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form A",
      "year": "2018-2019",
      "form": "A",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "3. (A) The question asks for the identification of the sentence in the paragraph that has an error in its construction and should be revised. Option A (sentence 1) is the correct response because sentence 1 contains a structural error. The sentence begins with a list of modifying phrases: “Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process.” As written, this list modifies the closest noun phrase, “the animal shelter,” which is illogical because the list describes tasks at the animal shelter, not the shelter itself. The list should follow the word “tasks” at the end of the sentence, so that it is closer to the word that it modifies. Option B, Option C,\n\nand Option D are incorrect responses because sentence 2, sentence 3, and sentence 4 do not contain structural errors. For Option B, the phrase “especially those who aspire to care for and protect animals” in sentence 2 correctly modifies “young people.” For Option C, the structure of sentence 3 allows the words “In addition to hands-on training with animal care” to correctly modify “volunteers will learn.” For Option D, the phrase “which is the awareness and understanding of the feelings of others” in sentence 4 correctly modifies the word “empathy.”\n\nREVISING/EDITING PART B\n\nMoving through Mountains",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-a-answers-q003-explanation-1.png\" alt=\"Supplied Form A explanation for question 3\" width=\"351\"></p><p><img src=\"/exam-images/pdf-2018-2019-a-answers-q003-explanation-2.png\" alt=\"Supplied Form A explanation for question 3\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\n(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.\n\nWhich sentence contains an error in its construction and should be revised?",
    "promptHtml": "<p>Read this paragraph.</p><blockquote data-boxed=\"true\"><p>(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.</p></blockquote><p>Which sentence contains an error in its construction and should be revised?</p>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form A"
    ],
    "versionLabel": "2018-2019 Form A"
  },
  {
    "id": "part-b-import-5ce9007a70b7-82667959",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "1. (B) The question asks for the correction needed for an error in the sentence. The sentence needs a comma to set off the clause “which is considered one of the ‘new’ Seven Wonders of the World,” because the clause is not essential to the meaning of the sentence (nonrestrictive clause). Option B is correct because it places a comma where it is needed, after “Italy,” to set off the nonrestrictive clause that follows. Option A is incorrect because when a name has more than one element, a comma is used to separate the elements for clarity. Option C is incorrect because it would remove the comma at the end of the nonrestrictive clause, which should be set off by commas at the beginning and the end. Option D is incorrect because a comma after “built” would separate the phrase “could hold more than 50,000 spectators,” which is a dependent clause that uses the subject from the main clause and so needs to stay connected to the rest of the sentence.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q001-explanation-1.png\" alt=\"Supplied Form B explanation for question 1\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nThe Colosseum in Rome, Italy which is considered one of the “new” Seven Wonders of the World, is the largest amphitheater ever built and could hold more than 50,000 spectators.\n\nWhich edit should be made to correct the sentence?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\"><p>The Colosseum in Rome, Italy which is considered one of the “new” Seven Wonders of the World, is the largest amphitheater ever built and could hold more than 50,000 spectators.</p></blockquote><p>Which edit should be made to correct the sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>Delete the comma after Rome.</p>",
        "text": "Delete the comma after Rome."
      },
      {
        "id": "B",
        "html": "<p>Insert a comma after Italy.</p>",
        "text": "Insert a comma after Italy."
      },
      {
        "id": "C",
        "html": "<p>Delete the comma after World.</p>",
        "text": "Delete the comma after World."
      },
      {
        "id": "D",
        "html": "<p>Insert a comma after built.</p>",
        "text": "Insert a comma after built."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form B"
    ],
    "versionLabel": "2018-2019 Form B"
  },
  {
    "id": "part-b-import-09119fae8b50-506b3190",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "2. (E) The question asks for the correction of an error in sentence structure in the paragraph. The first sentence is a run-on sentence because both clauses—“In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution” and “the museum is already the Smithsonian’s third most popular site”—are independent clauses, and independent clauses should not be combined without the use of a conjunction and a comma. The revision in Option E adds the word “and” before the comma, which corrects the run-on. Option F, Option G, Option H are incorrect responses because the corresponding underlined portions in the paragraph are not structural errors. No edits are needed to correct those portions of the text.",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q002-explanation-1.png\" alt=\"Supplied Form B explanation for question 2\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nIn September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian Institution, the museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a year. The museum features more than 30,000 objects, including Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation Proclamation, written in 1863 during the presidency of Abraham Lincoln, is also on display at the museum.\n\nWhich revision corrects the error in sentence structure in the paragraph?",
    "promptHtml": "<p>Read this paragraph.</p><blockquote data-boxed=\"true\"><p>In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian <u>Institution, the</u> museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a <u>year. The</u> museum features more than 30,000 <u>objects, including</u> Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation <u>Proclamation, written</u> in 1863 during the presidency of Abraham Lincoln, is also on display at the museum.</p></blockquote><p>Which revision corrects the error in sentence structure in the paragraph?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Institution, and the</p>",
        "text": "Institution, and the"
      },
      {
        "id": "B",
        "html": "<p>year, and the</p>",
        "text": "year, and the"
      },
      {
        "id": "C",
        "html": "<p>objects, which include</p>",
        "text": "objects, which include"
      },
      {
        "id": "D",
        "html": "<p>Proclamation, which was written</p>",
        "text": "Proclamation, which was written"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form B"
    ],
    "versionLabel": "2018-2019 Form B"
  },
  {
    "id": "part-b-import-8f756ef5b720-d07b4e8f",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "3. (C) The question asks for the correct revision of the sentence in the box. The sentence is incorrect because, as written, the phrase “to promote their club” refers to the closest noun to the phrase, which is “a bake sale,” and that does not match logically. Option C is correct because the revision has the phrase “to promote their club” clearly modifying “members of the debate team” and adds the idea that the bake sale is on Wednesday to the end of the sentence. Option A and Option B are incorrect because the revisions do not fix the error that “to promote their club” modifies “a bake sale.” Option D is incorrect; while the revision clarifies that “to promote their club” relates to the “members of the debate team,” the rest of the sentence is poorly written because the insertion of “on Wednesday to promote their club” in the middle of the sentence interrupts the main clause, “Members of the debate team will sponsor a bake sale.”",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q003-explanation-1.png\" alt=\"Supplied Form B explanation for question 3\" width=\"351\"></p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nTo promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.\n\nHow should the sentence be revised?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\"><p>To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.</p></blockquote><p>How should the sentence be revised?</p>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team.</p>",
        "text": "To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "B",
        "html": "<p>On Wednesday to promote their club, a bake sale will be sponsored by members of the debate team.</p>",
        "text": "On Wednesday to promote their club, a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "C",
        "html": "<p>To promote their club, members of the debate team will sponsor a bake sale on Wednesday.</p>",
        "text": "To promote their club, members of the debate team will sponsor a bake sale on Wednesday."
      },
      {
        "id": "D",
        "html": "<p>Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale.</p>",
        "text": "Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form B"
    ],
    "versionLabel": "2018-2019 Form B"
  },
  {
    "id": "part-b-import-be9fbdda08ee-cb4b54d9",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2018-2019 Form B",
      "year": "2018-2019",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "4. (G) The question asks for the necessary revisions to the paragraph. Option G is correct because the errors appear in sentence 3 of the paragraph. The word “studies” is in the present tense, but it should be changed to “studied” to match the past tense established in the paragraph (“spent,” “recited”). Additionally, the comma after the word “emotions” needs to be removed because the words “emotions and motivations” are part of a group (series) of two elements, and when there are only two elements in a series, a comma is not used. Option E is incorrect because sentence 1 does not need to be revised. The word “spent” is correct in the past tense, and there is no need to insert a comma after the word “play.” Option F is incorrect because sentence 2 does not need to be revised. The word “did” is correct as written in the past tense, and there is no comma needed after the word “projection” because “so” is not functioning as a conjunction but rather as part of the conjunction phrase “so that,” which does not take a comma. Option H is incorrect because sentence 4 does not need to be revised. The word “recited” is correct as written in the past tense, and the comma after “times” is needed in order to separate the modifying phrase “making slight adjustments and improvements to his performance each time” from the main clause.\n\nREVISING/EDITING PART B\n\nThe Local Library",
    "explanationHtml": "<p><img src=\"/exam-images/pdf-2018-2019-b-answers-q004-explanation-1.png\" alt=\"Supplied Form B explanation for question 4\" width=\"348\"></p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\n(1) Devon spent several hours preparing for an upcoming audition for a play at the community theater. (2) First he did vocal exercises to practice his diction and projection so that his words would carry clearly throughout the large auditorium. (3) Then he studies the text of the monologue to better understand the emotions, and motivations of the character he plans to portray. (4) Finally he recited his monologue in front of a mirror many times, making slight adjustments and improvements to his performance each time.\n\nHow should the paragraph be revised?",
    "promptHtml": "<p>Read this paragraph.</p><blockquote data-boxed=\"true\"><p>(1) Devon spent several hours preparing for an upcoming audition for a play at the community theater. (2) First he did vocal exercises to practice his diction and projection so that his words would carry clearly throughout the large auditorium. (3) Then he studies the text of the monologue to better understand the emotions, and motivations of the character he plans to portray. (4) Finally he recited his monologue in front of a mirror many times, making slight adjustments and improvements to his performance each time.</p></blockquote><p>How should the paragraph be revised?</p>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Change spent to had spent, AND insert a comma after play.</p>",
        "text": "Sentence 1: Change spent to had spent, AND insert a comma after play."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Change did to does, AND insert a comma after projection.</p>",
        "text": "Sentence 2: Change did to does, AND insert a comma after projection."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Change studies to studied, AND delete the comma after emotions.</p>",
        "text": "Sentence 3: Change studies to studied, AND delete the comma after emotions."
      },
      {
        "id": "D",
        "html": "<p>Sentence 4: Change recited to recites, AND delete the comma after times.</p>",
        "text": "Sentence 4: Change recited to recites, AND delete the comma after times."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2018-2019 Form B"
    ],
    "versionLabel": "2018-2019 Form B"
  },
  {
    "id": "part-b-import-0ea66e24a5c0-72af5644",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "1. (D) The question asks for the most precise revision for the words talked to some people who did the best in the contest. Option A and Option C do not precisely state how many people the reporter interviewed. Option B specifies the number of people interviewed but uses the imprecise phrase “who did well.” Option D is the only option that precisely states the reporter’s action (“interviewed”) as well as who exactly the reporter interviewed (“the top three contestants”).",
    "explanationHtml": "<p>1. (D) The question asks for the most precise revision for the words talked to some people who did the best in the contest. Option A and Option C do not precisely state how many people the reporter interviewed. Option B specifies the number of people interviewed but uses the imprecise phrase “who did well.” Option D is the only option that precisely states the reporter’s action (“interviewed”) as well as who exactly the reporter interviewed (“the top three contestants”).</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhich of these is the most precise revision for the words talked to some people who did the best in the contest?",
    "stimulus": "During a nightly-news segment about a cooking contest, a reporter talked to some people who did the best in the contest.",
    "stimulusHtml": "<p>During a nightly-news segment about a cooking contest, a reporter talked to some people who did the best in the contest.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>Which of these is the most precise revision for the words <strong><em>talked to some people who did the best in the contest</em></strong>?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>conversed with some of the people who won the contest</p>",
        "text": "conversed with some of the people who won the contest"
      },
      {
        "id": "B",
        "html": "<p>spoke to the three contestants who did well</p>",
        "text": "spoke to the three contestants who did well"
      },
      {
        "id": "C",
        "html": "<p>discussed the contest with some of the winners</p>",
        "text": "discussed the contest with some of the winners"
      },
      {
        "id": "D",
        "html": "<p>interviewed the top three contestants</p>",
        "text": "interviewed the top three contestants"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A"
  },
  {
    "id": "part-b-import-55ca9287c304-58585284",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "2. (G) The question asks for the identification of a sentence with an inappropriate shift in verb tense. Option E, Option F, and Option H identify sentences that use past tense. Sentence 3 (Option C) demonstrates an incorrect shift into the present tense with the clause “as natural gas becomes more common,” which should be “as natural gas became more common.”",
    "explanationHtml": "<p>2. (G) The question asks for the identification of a sentence with an inappropriate shift in verb tense. Option E, Option F, and Option H identify sentences that use past tense. Sentence 3 (Option C) demonstrates an incorrect shift into the present tense with the clause “as natural gas becomes more common,” which should be “as natural gas became more common.”</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich sentence should be revised to correct an inappropriate shift in verb tense?",
    "stimulus": "(1) When coal was used to heat homes, it frequently left a soot stain on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company, created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day, Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.",
    "stimulusHtml": "<p>(1) When coal was used to heat homes, it frequently left a soot stain on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company, created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day, Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which sentence should be revised to correct an inappropriate shift in verb tense?</p>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A"
  },
  {
    "id": "part-b-import-be10ff9dae9c-bd9b9422",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "3. (C) The sentence in the box needs a comma to separate items in a series. Option A would remove the necessary comma before the nonrestrictive clause “which is located on Midway Street.” Option B is incorrect because while the phrase that ends with the word “volunteer” can stand on its own as an independent clause, a comma is not needed before the explanation of what the volunteers would help do. Option D would delete a necessary comma between two items in a series. Option C is the only option that would place a necessary comma to separate items “walking dogs” and “cleaning kennels” in the series.",
    "explanationHtml": "<p>3. (C) The sentence in the box needs a comma to separate items in a series. Option A would remove the necessary comma before the nonrestrictive clause “which is located on Midway Street.” Option B is incorrect because while the phrase that ends with the word “volunteer” can stand on its own as an independent clause, a comma is not needed before the explanation of what the volunteers would help do. Option D would delete a necessary comma between two items in a series. Option C is the only option that would place a necessary comma to separate items “walking dogs” and “cleaning kennels” in the series.</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhich edit should be made in this sentence?",
    "stimulus": "The animal shelter, which is located on Midway Street, is looking for volunteers to help with a variety of tasks, such as walking dogs cleaning kennels, hand-feeding newborn kittens, and supporting the pet adoption process.",
    "stimulusHtml": "<p>The animal shelter, which is located on Midway Street, is looking for volunteers to help with a variety of tasks, such as walking dogs cleaning kennels, hand-feeding newborn kittens, and supporting the pet adoption process.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>Which edit should be made in this sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>delete the comma after <strong><em>shelter</em></strong></p>",
        "text": "delete the comma after shelter"
      },
      {
        "id": "B",
        "html": "<p>insert a comma after <strong><em>volunteers</em></strong></p>",
        "text": "insert a comma after volunteers"
      },
      {
        "id": "C",
        "html": "<p>insert a comma after <strong><em>dogs</em></strong></p>",
        "text": "insert a comma after dogs"
      },
      {
        "id": "D",
        "html": "<p>delete the comma after <strong><em>kennels</em></strong></p>",
        "text": "delete the comma after kennels"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A"
  },
  {
    "id": "part-b-import-4669ed81b4aa-903f4032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "4",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "4. (E) The question asks for the best way to combine the sentences to clarify the relationship between the ideas. Option F is incorrect because the conjunction “although” suggests that scientists were allowed to collect data even though there were flyby missions, which is inaccurate. In Option G, the phrase “which have been happening since 1973” is incorrectly modifying “the planet and its moons.” In Option H, the conjunction “but” suggests an adverse relationship between ideas, which is also incorrect. Option E is the only option that accurately reflects the relationship between the ideas by using the nonrestrictive phrase “which allow scientists to collect data about the planet and its moons” to describe the purpose of the flyby missions.",
    "explanationHtml": "<p>4. (E) The question asks for the best way to combine the sentences to clarify the relationship between the ideas. Option F is incorrect because the conjunction “although” suggests that scientists were allowed to collect data even though there were flyby missions, which is inaccurate. In Option G, the phrase “which have been happening since 1973” is incorrectly modifying “the planet and its moons.” In Option H, the conjunction “but” suggests an adverse relationship between ideas, which is also incorrect. Option E is the only option that accurately reflects the relationship between the ideas by using the nonrestrictive phrase “which allow scientists to collect data about the planet and its moons” to describe the purpose of the flyby missions.</p>",
    "points": 1,
    "prompt": "Read these sentences.(2) Flyby missions allow scientists to collect data about Jupiter and its moons.What is the best way to combine these sentences to clarify the relationship between the ideas?",
    "stimulus": "(1) Flyby missions near Jupiter have been happening since 1973.",
    "stimulusHtml": "<p>(1) Flyby missions near Jupiter have been happening since 1973.</p>",
    "promptHtml": "<p>Read these sentences.</p><blockquote data-boxed=\"true\">(2) Flyby missions allow scientists to collect data about Jupiter and its moons.</blockquote><p>What is the best way to combine these sentences to clarify the relationship between the ideas?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973.</p>",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "B",
        "html": "<p>Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons.</p>",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "<p>Flyby missions near Jupiter allow scientists to collect data about the planet and its moons, which have been happening since 1973.</p>",
        "text": "Flyby missions near Jupiter allow scientists to collect data about the planet and its moons, which have been happening since 1973."
      },
      {
        "id": "D",
        "html": "<p>Since 1973 flyby missions have been happening near Jupiter, but they allow scientists to collect data about the planet and its moons.</p>",
        "text": "Since 1973 flyby missions have been happening near Jupiter, but they allow scientists to collect data about the planet and its moons."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A"
  },
  {
    "id": "part-b-import-1bc95d788614-c76e5943",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "5",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "5. (C) The question asks the student to identify a vague pronoun in a sentence in the box. Sentence 1 (Option A) correctly uses the plural pronouns “their”/”they” to refer to both Eliza and Brianna. Sentence 2 (Option B)\n\nuses the pronoun “they” to correctly refer to both girls again. Sentence 4 (Option D) uses the pronoun “they” to correctly refer to “both girls.” Sentence 3 (Option C) is the only sentence where the pronoun is vague. The sentence uses the pronoun “she” near the beginning, but whether “she” refers to Eliza or Brianna is unclear.",
    "explanationHtml": "<p>5. (C) The question asks the student to identify a vague pronoun in a sentence in the box. Sentence 1 (Option A) correctly uses the plural pronouns “their”/”they” to refer to both Eliza and Brianna. Sentence 2 (Option B)</p><p>uses the pronoun “they” to correctly refer to both girls again. Sentence 4 (Option D) uses the pronoun “they” to correctly refer to “both girls.” Sentence 3 (Option C) is the only sentence where the pronoun is vague. The sentence uses the pronoun “she” near the beginning, but whether “she” refers to Eliza or Brianna is unclear.</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich sentence should be revised to correct a vague pronoun?",
    "stimulus": "(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade. (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. (3) Outside of school, she also sings in a choir made up of young and old members of her community. (4) Both girls hope that they will be able to continue singing for many more years.",
    "stimulusHtml": "<p>(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade. (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. (3) Outside of school, she also sings in a choir made up of young and old members of her community. (4) Both girls hope that they will be able to continue singing for many more years.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which sentence should be revised to correct a vague pronoun?</p>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A",
    "duplicateOf": "standalone-vague-pronoun-1"
  },
  {
    "id": "part-b-import-58cd1c48131d-1dd438a6",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "6",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "6. (E) The sentence in the box needs a comma to separate coordinate adjectives. Option F incorrectly adds a comma between the subject and the verb. Option G incorrectly adds a comma between two adjectives, but they are not coordinate adjectives. Option H is incorrect because a comma is not needed to set off the phrase “to score 100 points in a single game.” Option E is the only option that places a comma where it is needed, between the coordinate adjectives “agile” and “athletic.”",
    "explanationHtml": "<p>6. (E) The sentence in the box needs a comma to separate coordinate adjectives. Option F incorrectly adds a comma between the subject and the verb. Option G incorrectly adds a comma between two adjectives, but they are not coordinate adjectives. Option H is incorrect because a comma is not needed to set off the phrase “to score 100 points in a single game.” Option E is the only option that places a comma where it is needed, between the coordinate adjectives “agile” and “athletic.”</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhich edit should be made to correct this sentence?",
    "stimulus": "In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.",
    "stimulusHtml": "<p>In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>Which edit should be made to correct this sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>insert a comma after <strong><em>agile</em></strong></p>",
        "text": "insert a comma after agile"
      },
      {
        "id": "B",
        "html": "<p>insert a comma after <strong><em>Chamberlain</em></strong></p>",
        "text": "insert a comma after Chamberlain"
      },
      {
        "id": "C",
        "html": "<p>insert a comma after <strong><em>only</em></strong></p>",
        "text": "insert a comma after only"
      },
      {
        "id": "D",
        "html": "<p>insert a comma after <strong><em>States</em></strong></p>",
        "text": "insert a comma after States"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form A"
    ],
    "versionLabel": "2017-2018 Form A"
  },
  {
    "id": "part-b-import-d51ef5a4da25-097e5f95",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "1. (A) The question asks for the identification of a run-on sentence that needs to be corrected. Option B, Option C, and Option D identify complete sentences that are not run-ons. Option A identifies a sentence made up of two independent clauses that need to be more definitively separated between “opened” and “as,” using either a semicolon or a period.",
    "explanationHtml": "<p>1. (A) The question asks for the identification of a run-on sentence that needs to be corrected. Option B, Option C, and Option D identify complete sentences that are not run-ons. Option A identifies a sentence made up of two independent clauses that need to be more definitively separated between “opened” and “as,” using either a semicolon or a period.</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich sentence should be revised to correct a run-on?",
    "stimulus": "(1) In September 2016, the National Museum of African American History and Culture opened, as part of the Smithsonian Institution, the museum is already the Smithsonian’s third most popular site. (2) Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a year. (3) The museum features more than 30,000 objects, including Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. (4) A commemorative copy of the Emancipation Proclamation, which was written in 1863 during the presidency of Abraham Lincoln, is also available for viewing at the museum.",
    "stimulusHtml": "<p>(1) In September 2016, the National Museum of African American History and Culture opened, as part of the Smithsonian Institution, the museum is already the Smithsonian’s third most popular site. (2) Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a year. (3) The museum features more than 30,000 objects, including Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. (4) A commemorative copy of the Emancipation Proclamation, which was written in 1863 during the presidency of Abraham Lincoln, is also available for viewing at the museum.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which sentence should be revised to correct a run-on?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form B"
    ],
    "versionLabel": "2017-2018 Form B"
  },
  {
    "id": "part-b-import-98dc205aa3e8-2094d5e0",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "2. (G) The sentence in the box demonstrates the use of a misplaced modifier. In Option E and Option F, the phrase “to promote their club” incorrectly modifies “a bake sale.” While Option H makes it clearer that “to promote their club” refers to the “members of the debate team,” the rest of the sentence is poorly written. Option G is the only option in which the phrase “to promote their club” clearly modifies “members of the debate team” and that clarifies that the bake sale is on Wednesday.",
    "explanationHtml": "<p>2. (G) The sentence in the box demonstrates the use of a misplaced modifier. In Option E and Option F, the phrase “to promote their club” incorrectly modifies “a bake sale.” While Option H makes it clearer that “to promote their club” refers to the “members of the debate team,” the rest of the sentence is poorly written. Option G is the only option in which the phrase “to promote their club” clearly modifies “members of the debate team” and that clarifies that the bake sale is on Wednesday.</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nHow should this sentence be revised?",
    "stimulus": "To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.",
    "stimulusHtml": "<p>To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>How should this sentence be revised?</p>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team.</p>",
        "text": "To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "B",
        "html": "<p>On Wednesday to promote their club, a bake sale will be sponsored by members of the debate team.</p>",
        "text": "On Wednesday to promote their club, a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "C",
        "html": "<p>To promote their club, members of the debate team will sponsor a bake sale on Wednesday.</p>",
        "text": "To promote their club, members of the debate team will sponsor a bake sale on Wednesday."
      },
      {
        "id": "D",
        "html": "<p>Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale.</p>",
        "text": "Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form B"
    ],
    "versionLabel": "2017-2018 Form B"
  },
  {
    "id": "part-b-import-54658f33bda8-f23b8b56",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "3. (C) All the sentences should have a main verb in the past tense. For Option A (sentence 1), Option B (sentence 2), and Option D (sentence 4), the main verbs in the sentences are in the past tense (“spent,” “did,” “recited”). For Option C (sentence 3), the main verb in the sentence inappropriately shifts to the present tense (“studies”) and should be revised to the past tense (“studied”).",
    "explanationHtml": "<p>3. (C) All the sentences should have a main verb in the past tense. For Option A (sentence 1), Option B (sentence 2), and Option D (sentence 4), the main verbs in the sentences are in the past tense (“spent,” “did,” “recited”). For Option C (sentence 3), the main verb in the sentence inappropriately shifts to the present tense (“studies”) and should be revised to the past tense (“studied”).</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich sentence should be revised to correct an inappropriate shift in verb tense?",
    "stimulus": "(1) Devon spent several hours preparing for an upcoming audition. (2) First, he did vocal exercises to practice his diction and projection. (3) Then, he studies the text of the monologue to better understand the emotions and motivations of the character he plans to portray. (4) Finally, he recited his monologue in front of a mirror many times, making slight adjustments and improvements to his performance each time.",
    "stimulusHtml": "<p>(1) Devon spent several hours preparing for an upcoming audition. (2) First, he did vocal exercises to practice his diction and projection. (3) Then, he studies the text of the monologue to better understand the emotions and motivations of the character he plans to portray. (4) Finally, he recited his monologue in front of a mirror many times, making slight adjustments and improvements to his performance each time.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which sentence should be revised to correct an inappropriate shift in verb tense?</p>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form B"
    ],
    "versionLabel": "2017-2018 Form B"
  },
  {
    "id": "part-b-import-5491bf3aee6b-dca7c6a1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "4. (F) The sentence in the box needs a comma to set off the nonrestrictive clause “which is considered one of the New Seven Wonders of the World.” Option E would remove the comma between a city and country, which would be incorrect. Option G would incorrectly remove the comma at the end of a nonrestrictive clause, which is set off by commas at the beginning and the end. Option H is incorrect because a comma is not necessary before the conjunction “and” to connect a dependent clause. Option F is the only option that places a comma where it is needed, after “Italy,” to set off the nonrestrictive clause that follows.",
    "explanationHtml": "<p>4. (F) The sentence in the box needs a comma to set off the nonrestrictive clause “which is considered one of the New Seven Wonders of the World.” Option E would remove the comma between a city and country, which would be incorrect. Option G would incorrectly remove the comma at the end of a nonrestrictive clause, which is set off by commas at the beginning and the end. Option H is incorrect because a comma is not necessary before the conjunction “and” to connect a dependent clause. Option F is the only option that places a comma where it is needed, after “Italy,” to set off the nonrestrictive clause that follows.</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhich edit should be made to correct this sentence?",
    "stimulus": "The Colosseum in Rome, Italy which is considered one of the New Seven Wonders of the World, is the largest amphitheater ever built and could hold more than 50,000 spectators.",
    "stimulusHtml": "<p>The Colosseum in Rome, Italy which is considered one of the New Seven Wonders of the World, is the largest amphitheater ever built and could hold more than 50,000 spectators.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>Which edit should be made to correct this sentence?</p>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>delete the comma after <strong><em>Rome</em></strong></p>",
        "text": "delete the comma after Rome"
      },
      {
        "id": "B",
        "html": "<p>insert a comma after <strong><em>Italy</em></strong></p>",
        "text": "insert a comma after Italy"
      },
      {
        "id": "C",
        "html": "<p>delete the comma after <strong><em>World</em></strong></p>",
        "text": "delete the comma after World"
      },
      {
        "id": "D",
        "html": "<p>insert a comma after <strong><em>built</em></strong></p>",
        "text": "insert a comma after built"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form B"
    ],
    "versionLabel": "2017-2018 Form B"
  },
  {
    "id": "part-b-import-113c673c387b-c66e9563",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "5",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanation": "5. (B) The question asks for the most precise revision for the words The engineers tried some other things. Option A and Option C use the word “materials” rather than precisely identifying what the engineers used. Option D identifies the materials, but the imprecise verb “worked with” does not specify what the engineers were doing. Option B is the only option that revises the words to be precise by using the specific words “tested” for the verb and “foam and fiberglass” for the materials.",
    "explanationHtml": "<p>5. (B) The question asks for the most precise revision for the words The engineers tried some other things. Option A and Option C use the word “materials” rather than precisely identifying what the engineers used. Option D identifies the materials, but the imprecise verb “worked with” does not specify what the engineers were doing. Option B is the only option that revises the words to be precise by using the specific words “tested” for the verb and “foam and fiberglass” for the materials.</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nWhat is the most precise revision for the words The engineers tried some other things?",
    "stimulus": "The engineers tried some other things in the hope of finding a more effective insulation for the compartment.",
    "stimulusHtml": "<p>The engineers tried some other things in the hope of finding a more effective insulation for the compartment.</p>",
    "promptHtml": "<p>Read this sentence.</p><p>What is the most precise revision for the words <strong><em>The engineers tried some other things</em></strong>?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>The engineers did experiments with several new materials</p>",
        "text": "The engineers did experiments with several new materials"
      },
      {
        "id": "B",
        "html": "<p>The engineers tested foam and fiberglass</p>",
        "text": "The engineers tested foam and fiberglass"
      },
      {
        "id": "C",
        "html": "<p>The engineers did tests with two new materials</p>",
        "text": "The engineers did tests with two new materials"
      },
      {
        "id": "D",
        "html": "<p>The engineers worked with foam and fiberglass</p>",
        "text": "The engineers worked with foam and fiberglass"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2017-2018 Form B"
    ],
    "versionLabel": "2017-2018 Form B"
  },
  {
    "id": "part-b-import-9d14715150af-39798b2c",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanation": "1 . The question asks for the identification of the sentence that contains an error in its construction and should be revised .\n\nD: Correct . Sentence 4 contains an error because the sentence uses the plural pronoun “them” to refer to “The blobfish’s,” which is singular in number . The word “them” should be changed to “it .” The paragraph refers to the blobfish as a singular species in each of its four sentences, and sentence 4 should be revised to match .\n\nA: Incorrect . There are no errors in sentence 1 . The singular pronoun “its” matches the number of the word it refers to, the singular noun ”blobfish .” Additionally, the clause “a creature that certainly resembles its name,” is correctly set off by commas to provide an additional, but not essential, detail about the blobfish .\n\nB: Incorrect . There are no errors in sentence 2 . The singular pronoun “its” matches the number of the word it refers to, the singular noun ”blobfish .” Additionally, the structure of the sentence correctly shows that the clause “Because it has very few muscles and its density is close to that of water” modifies the words “the blobfish .”\n\nC: Incorrect . There are no errors in sentence 3 . The “it” in the sentences refers to “the blobfish” mentioned in the previous sentence . The use of singular pronouns in sentence 3 is consistent with the rest of the paragraph .",
    "explanationHtml": "<p><strong>1 .</strong> The question asks for the identification of the sentence that contains an error in its construction and should be revised .</p><p><strong>D: Correct .</strong> Sentence 4 contains an error because the sentence uses the plural pronoun “them” to refer to “The blobfish’s,” which is singular in number . The word “them” should be changed to “it .” The paragraph refers to the blobfish as a singular species in each of its four sentences, and sentence 4 should be revised to match .</p><p><strong>A:</strong> Incorrect . There are no errors in sentence 1 . The singular pronoun “its” matches the number of the word it refers to, the singular noun ”blobfish .” Additionally, the clause “a creature that certainly resembles its name,” is correctly set off by commas to provide an additional, but not essential, detail about the blobfish .</p><p><strong>B:</strong> Incorrect . There are no errors in sentence 2 . The singular pronoun “its” matches the number of the word it refers to, the singular noun ”blobfish .” Additionally, the structure of the sentence correctly shows that the clause “Because it has very few muscles and its density is close to that of water” modifies the words “the blobfish .”</p><p><strong>C:</strong> Incorrect . There are no errors in sentence 3 . The “it” in the sentences refers to “the blobfish” mentioned in the previous sentence . The use of singular pronouns in sentence 3 is consistent with the rest of the paragraph .</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich sentence contains an error in its construction and should be revised?",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which sentence contains an error in its construction and should be revised?</p>",
    "topic": "Pronouns",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2019-2020 Form B"
    ],
    "versionLabel": "2019-2020 Form B"
  },
  {
    "id": "part-b-import-a6c479c6476d-70d39721",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "2 . The question asks for the revisions that are needed to correct errors in the paragraph .\n\nH: Correct . Deleting the comma after “gelato” would include the clause “and allow it to melt more quickly” with the first part of the clause “which enhances the texture and flavor of the gelato .” In this clause, the word “and” indicates that the two verb phrases (“enhances the texture and flavor of gelato” and “allow it to melt more quickly”) share a subject, “which” (referring to the act of serving gelato 10 to 15 degrees warmer than ice cream) . The two ideas should not be separated by a comma within the clause . The entire clause “which enhances the texture and flavor of the gelato and allow it to melt more quickly” should be separated from the main clause only by the comma after “cream” because the entire clause is a nonrestrictive clause . This clause provides additional, but not essential, information about the purpose of serving gelato at a warmer temperature than when serving ice cream . Changing the verb “allow” to “allows” is also necessary to match the use of the singular noun “gelato,” which is the subject of the sentence .\n\nE: Incorrect . The revisions in Option E introduce new errors . The colon after “wonder” is needed to set off the question “what is the difference between the two?” from the rest of the sentence . In addition, changing the verb “is” to “are” would be incorrect with the use of the singular noun “difference,” which is the subject of the question, “what is the difference between the two?”\n\nF: Incorrect . The revisions in Option F introduce new errors . The comma following the introductory phrase “To start with” helps with clarity and is needed to separate the phrase from the rest of the sentence . Changing “it is” to “they are” would be incorrect with the use of the singular noun “butterfat content,” which is what the words “it is” refer to in the sentence .\n\nG: Incorrect . The revisions in Option G introduce new errors . The comma following “process” is necessary to set off the nonrestrictive clause “which adds less air to the frozen treat” from the rest of the sentence . This\n\nclause is considered a nonrestrictive clause because it provides additional, but not essential, information about the mixing process . Changing the verb “makes” to “make” would be incorrect with the use of the singular noun “mixing process,” which is the subject of the sentence .",
    "explanationHtml": "<p><strong>2 .</strong> The question asks for the revisions that are needed to correct errors in the paragraph .</p><p><strong>H: Correct .</strong> Deleting the comma after “gelato” would include the clause “and allow it to melt more quickly” with the first part of the clause “which enhances the texture and flavor of the gelato .” In this clause, the word “and” indicates that the two verb phrases (“enhances the texture and flavor of gelato” and “allow it to melt more quickly”) share a subject, “which” (referring to the act of serving gelato 10 to 15 degrees warmer than ice cream) . The two ideas should not be separated by a comma within the clause . The entire clause “which enhances the texture and flavor of the gelato and allow it to melt more quickly” should be separated from the main clause only by the comma after “cream” because the entire clause is a nonrestrictive clause . This clause provides additional, but not essential, information about the purpose of serving gelato at a warmer temperature than when serving ice cream . Changing the verb “allow” to “allows” is also necessary to match the use of the singular noun “gelato,” which is the subject of the sentence .</p><p><strong>E:</strong> Incorrect . The revisions in Option E introduce new errors . The colon after “wonder” is needed to set off the question “what is the difference between the two?” from the rest of the sentence . In addition, changing the verb “is” to “are” would be incorrect with the use of the singular noun “difference,” which is the subject of the question, “what is the difference between the two?”</p><p><strong>F:</strong> Incorrect . The revisions in Option F introduce new errors . The comma following the introductory phrase “To start with” helps with clarity and is needed to separate the phrase from the rest of the sentence . Changing “it is” to “they are” would be incorrect with the use of the singular noun “butterfat content,” which is what the words “it is” refer to in the sentence .</p><p><strong>G:</strong> Incorrect . The revisions in Option G introduce new errors . The comma following “process” is necessary to set off the nonrestrictive clause “which adds less air to the frozen treat” from the rest of the sentence . This</p><p>clause is considered a nonrestrictive clause because it provides additional, but not essential, information about the mixing process . Changing the verb “makes” to “make” would be incorrect with the use of the singular noun “mixing process,” which is the subject of the sentence .</p>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich revisions correct the errors in the paragraph?",
    "stimulus": "(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "stimulusHtml": "<p>(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which revisions correct the errors in the paragraph?</p>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the colon after <strong><em>wonder</em></strong> AND change <strong><em>is</em></strong> to <strong>are</strong>.</p>",
        "text": "Sentence 1: Delete the colon after wonder AND change is to are."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Delete the comma after <strong><em>with</em></strong> AND change <strong><em>it is</em></strong> to <strong>they are</strong>.</p>",
        "text": "Sentence 2: Delete the comma after with AND change it is to they are."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Delete the comma after <strong><em>process</em></strong> AND change <strong><em>makes</em></strong> to <strong>make</strong>.</p>",
        "text": "Sentence 3: Delete the comma after process AND change makes to make."
      },
      {
        "id": "D",
        "html": "<p>Sentence 4: Delete the comma after <strong><em>gelato</em></strong> AND change <strong><em>allow</em></strong> to <strong>allows</strong>.</p>",
        "text": "Sentence 4: Delete the comma after gelato AND change allow to allows."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2019-2020 Form B"
    ],
    "versionLabel": "2019-2020 Form B"
  },
  {
    "id": "part-b-import-bbccdcd22a0c-c496117b",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanation": "3 . The question asks for the revision that corrects the error in sentence structure in the paragraph .\n\nA: Correct . As written, the first sentence (“In 1967 Katherine Switzer  .  .  . legendary race .”) is a run-on sentence because a comma is used to combine two independent clauses . Independent clauses are complete sentences with a subject and a verb . The clauses—“In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name” and “at that time, only men were permitted to officially register and receive a number for the legendary race”—should be separated with a period instead . The revision in Option A correctly places a period after the word “name” and capitalizes the word “At” to separate the two independent clauses into two sentences .\n\nB: Incorrect . The revision in Option B introduces an error into the paragraph and does not revise the run-on in the first sentence . The clause “Once officials realized a woman was attempting to run in the race” is a modifying phrase that provides information about “they” (which refers to the “officials”) . The phrase cannot stand alone without the rest of the sentence . Changing the comma after the word “race” to a period would incorrectly separate the phrase from the rest of the sentence .\n\nC: Incorrect . The revision in Option C introduces an error into the paragraph and does not revise the run-on in the first sentence . The sentence “Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women” is a complex sentence, which combines an independent clause (“Switzer prevailed and finished in just over four hours”) and a dependent clause (“paving the way for the official rule change that allowed for the inclusion of women”) . The clause “paving the way for the official rule change that allowed for the inclusion of women” is not a complete sentence and must stay connected to the first part of the sentence . Changing the comma after “hours” to a period would incorrectly separate the dependent clause from the rest of the sentence .\n\nD: Incorrect . The revision in Option D introduces an error into the paragraph and does not revise the run-on in the first sentence . Changing the comma after “261” to a period would incorrectly separate the modifying clause “the same number she had worn in that first run in 1967” from the words it describes (“number 261”) . Additionally, the clause “the same number she had worn in that first run in 1967” is not a complete sentence .\n\nMartial Arts for the Mind and Body",
    "explanationHtml": "<p><strong>3 .</strong> The question asks for the revision that corrects the error in sentence structure in the paragraph .</p><p><strong>A: Correct .</strong> As written, the first sentence (“In 1967 Katherine Switzer  .  .  . legendary race .”) is a run-on sentence because a comma is used to combine two independent clauses . Independent clauses are complete sentences with a subject and a verb . The clauses—“In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name” and “at that time, only men were permitted to officially register and receive a number for the legendary race”—should be separated with a period instead . The revision in Option A correctly places a period after the word “name” and capitalizes the word “At” to separate the two independent clauses into two sentences .</p><p><strong>B:</strong> Incorrect . The revision in Option B introduces an error into the paragraph and does not revise the run-on in the first sentence . The clause “Once officials realized a woman was attempting to run in the race” is a modifying phrase that provides information about “they” (which refers to the “officials”) . The phrase cannot stand alone without the rest of the sentence . Changing the comma after the word “race” to a period would incorrectly separate the phrase from the rest of the sentence .</p><p><strong>C:</strong> Incorrect . The revision in Option C introduces an error into the paragraph and does not revise the run-on in the first sentence . The sentence “Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women” is a complex sentence, which combines an independent clause (“Switzer prevailed and finished in just over four hours”) and a dependent clause (“paving the way for the official rule change that allowed for the inclusion of women”) . The clause “paving the way for the official rule change that allowed for the inclusion of women” is not a complete sentence and must stay connected to the first part of the sentence . Changing the comma after “hours” to a period would incorrectly separate the dependent clause from the rest of the sentence .</p><p><strong>D:</strong> Incorrect . The revision in Option D introduces an error into the paragraph and does not revise the run-on in the first sentence . Changing the comma after “261” to a period would incorrectly separate the modifying clause “the same number she had worn in that first run in 1967” from the words it describes (“number 261”) . Additionally, the clause “the same number she had worn in that first run in 1967” is not a complete sentence .</p><h3>Martial Arts for the Mind and Body</h3>",
    "points": 1,
    "prompt": "Read this paragraph.\n\nWhich revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name, at that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the race, they made efforts to remove her from the competition. Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number 261, the same number she had worn in that first run in 1967.",
    "stimulusHtml": "<p>In 1967 Katherine Switzer signed up for the Boston Marathon using her first and middle initials instead of her full name, at that time, only men were permitted to officially register and receive a number for the legendary race. Once officials realized a woman was attempting to run in the race, they made efforts to remove her from the competition. Switzer prevailed and finished in just over four hours, paving the way for the official rule change that allowed for the inclusion of women. In 2017, to mark the fiftieth anniversary of this pioneering event, a seventy-year-old Switzer repeated her run, wearing the number 261, the same number she had worn in that first run in 1967.</p>",
    "promptHtml": "<p>Read this paragraph.</p><p>Which revision corrects the error in sentence structure in the paragraph?</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>name. At</p>",
        "text": "name. At"
      },
      {
        "id": "B",
        "html": "<p>race. They</p>",
        "text": "race. They"
      },
      {
        "id": "C",
        "html": "<p>hours. Paving</p>",
        "text": "hours. Paving"
      },
      {
        "id": "D",
        "html": "<p>261. The</p>",
        "text": "261. The"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2019-2020 Form B"
    ],
    "versionLabel": "2019-2020 Form B"
  },
  {
    "id": "part-b-import-aae3824ad548-4d372338",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q1-1-png-passage.png\" alt=\"Supplied explanation for question 1\"></p>",
    "points": 1,
    "prompt": "What is the best way to combine the sentences?\n\n(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.\n\n(2) One of Jupiter’s moons is named Io.\n\n(3) Io has the greatest number of active volcanoes in the solar system.",
    "promptHtml": "<p>What is the best way to combine the sentences?</p><blockquote data-boxed=\"true\">(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.<br>(2) One of Jupiter’s moons is named Io.<br>(3) Io has the greatest number of active volcanoes in the solar system.</blockquote>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as seventy-nine moons.</p>",
        "text": "Io, which is one of Jupiter’s moons, has the greatest number of active volcanoes in the solar system, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      },
      {
        "id": "B",
        "html": "<p>Scientists now believe that Jupiter may have as many as seventy-nine moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system.</p>",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, and one of them is named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "C",
        "html": "<p>Scientists now believe that Jupiter may have as many as seventy-nine moons, including one named Io, which has the greatest number of active volcanoes in the solar system.</p>",
        "text": "Scientists now believe that Jupiter may have as many as seventy-nine moons, including one named Io, which has the greatest number of active volcanoes in the solar system."
      },
      {
        "id": "D",
        "html": "<p>Io, a moon with the greatest number of active volcanoes in the solar system, is one of Jupiter’s moons, and scientists now believe that Jupiter may have as many as seventy-nine moons.</p>",
        "text": "Io, a moon with the greatest number of active volcanoes in the solar system, is one of Jupiter’s moons, and scientists now believe that Jupiter may have as many as seventy-nine moons."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form A"
    ],
    "versionLabel": "2020-2021 Form A"
  },
  {
    "id": "part-b-import-d7cf6fc5ab7b-dd9ab404",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_a.pdf",
      "year": "2020-2021",
      "form": "A",
      "sourceQuestion": "5",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-a-answers-q5-1-png-passage.png\" alt=\"Supplied explanation for question 5\"></p><p><img src=\"/exam-images/restore-20202021-form-a-answers-q5-2-png-passage.png\" alt=\"Supplied explanation for question 5\"></p>",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n\n(1) When coal was used to heat homes, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.",
    "promptHtml": "<p>Which pair of revisions need to be made in this paragraph?</p><blockquote data-boxed=\"true\">(1) When coal was used to heat <u>homes</u>, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product <u>company</u> created a doughy substance to help people remove this soot. (3) Over time, as natural gas <u>becomes</u> more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he <u>remarketed</u> the product as the toy known today as Play-Doh.</blockquote>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>homes</strong></em>. Sentence 3: Change <em><strong>becomes</strong></em> to <strong>became</strong>.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 3: Change becomes to became."
      },
      {
        "id": "B",
        "html": "<p>Sentence 1: Delete the comma after <em><strong>homes</strong></em>. Sentence 4: Change <em><strong>remarketed</strong></em> to <strong>had remarketed</strong>.</p>",
        "text": "Sentence 1: Delete the comma after homes. Sentence 4: Change remarketed to had remarketed."
      },
      {
        "id": "C",
        "html": "<p>Sentence 2: Insert a comma after <em><strong>company</strong></em>. Sentence 3: Change <em><strong>becomes</strong></em> to <strong>became</strong>.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 3: Change becomes to became."
      },
      {
        "id": "D",
        "html": "<p>Sentence 2: Insert a comma after <em><strong>company</strong></em>. Sentence 4: Change <em><strong>remarketed</strong></em> to <strong>had remarketed</strong>.</p>",
        "text": "Sentence 2: Insert a comma after company. Sentence 4: Change remarketed to had remarketed."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form A"
    ],
    "versionLabel": "2020-2021 Form A"
  },
  {
    "id": "part-b-import-4918f97e972b-078ff032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "1",
      "pages": [
        1
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q1-1-png-passage.png\" alt=\"Supplied explanation for question 1\"></p>",
    "points": 1,
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?\n\nThe land on Earth has not always been separated into the seven continents, at one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s surface. Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s crust. In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "promptHtml": "<p>Which revision corrects the error in sentence structure in the paragraph?</p><blockquote data-boxed=\"true\">The land on Earth has not always been separated into the seven <u>continents, at</u> one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s <u>surface. Additionally,</u> the supercontinent was surrounded by ocean waters called <u>Panthalassa, much</u> of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s <u>crust. In fact,</u> experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.</blockquote>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "<p>continents. At</p>",
        "text": "continents. At"
      },
      {
        "id": "B",
        "html": "<p>surface; additionally,</p>",
        "text": "surface; additionally,"
      },
      {
        "id": "C",
        "html": "<p>Panthalassa. Much</p>",
        "text": "Panthalassa. Much"
      },
      {
        "id": "D",
        "html": "<p>crust, in fact,</p>",
        "text": "crust, in fact,"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form B"
    ],
    "versionLabel": "2020-2021 Form B"
  },
  {
    "id": "part-b-import-9c2f067e7c86-17e7d0e4",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "2",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q2-1-png-passage.png\" alt=\"Supplied explanation for question 2\"></p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n\n(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.",
    "promptHtml": "<p>Which sentence contains an error in its construction and should be revised?</p><blockquote data-boxed=\"true\">(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.</blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form B"
    ],
    "versionLabel": "2020-2021 Form B"
  },
  {
    "id": "part-b-import-2462ba9281da-812fa1d4",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "3",
      "pages": [
        2
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q3-1-png-passage.png\" alt=\"Supplied explanation for question 3\"></p>",
    "points": 1,
    "prompt": "Which edit should be made to correct the sentence?\n\nThe Colosseum in Rome, Italy which is considered one of the “new” Seven Wonders of the World, is the largest amphitheater ever built and once could hold up to 50,000 spectators.",
    "promptHtml": "<p>Which edit should be made to correct the sentence?</p><blockquote data-boxed=\"true\">The Colosseum in <u>Rome,</u> <u>Italy</u> which is considered one of the “new” Seven Wonders of the <u>World,</u> is the largest amphitheater ever <u>built</u> and once could hold up to 50,000 spectators.</blockquote>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>Delete the comma after <em><strong>Rome</strong></em>.</p>",
        "text": "Delete the comma after Rome."
      },
      {
        "id": "B",
        "html": "<p>Insert a comma after <em><strong>Italy</strong></em>.</p>",
        "text": "Insert a comma after Italy."
      },
      {
        "id": "C",
        "html": "<p>Delete the comma after <em><strong>World</strong></em>.</p>",
        "text": "Delete the comma after World."
      },
      {
        "id": "D",
        "html": "<p>Insert a comma after <em><strong>built</strong></em>.</p>",
        "text": "Insert a comma after built."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form B"
    ],
    "versionLabel": "2020-2021 Form B"
  },
  {
    "id": "part-b-import-a90ecb961d8a-f9bf88c1",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2020-2021 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20202021_form_b.pdf",
      "year": "2020-2021",
      "form": "B",
      "sourceQuestion": "4",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20202021-form-b-answers-q4-1-png-passage.png\" alt=\"Supplied explanation for question 4\"></p><p><img src=\"/exam-images/restore-20202021-form-b-answers-q4-2-png-passage.png\" alt=\"Supplied explanation for question 4\"></p>",
    "points": 1,
    "prompt": "How should this sentence be revised?\n\nTo promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.",
    "promptHtml": "<p>How should this sentence be revised?</p><blockquote data-boxed=\"true\">To promote their club, a bake sale will be sponsored by members of the debate team on Wednesday.</blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team.</p>",
        "text": "To promote their club, on Wednesday a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "B",
        "html": "<p>On Wednesday, to promote their club, a bake sale will be sponsored by members of the debate team.</p>",
        "text": "On Wednesday, to promote their club, a bake sale will be sponsored by members of the debate team."
      },
      {
        "id": "C",
        "html": "<p>To promote their club, members of the debate team will sponsor a bake sale on Wednesday.</p>",
        "text": "To promote their club, members of the debate team will sponsor a bake sale on Wednesday."
      },
      {
        "id": "D",
        "html": "<p>Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale.</p>",
        "text": "Members of the debate team, on Wednesday to promote their club, will sponsor a bake sale."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2020-2021 Form B"
    ],
    "versionLabel": "2020-2021 Form B"
  },
  {
    "id": "part-b-import-a230dac54eb9-0577ee73",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2024-2025 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20242025_form_a.pdf",
      "year": "2024-2025",
      "form": "A",
      "sourceQuestion": "1",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20242025-form-a-answers-q1-1-png-passage.png\" alt=\"Supplied explanation for question 1\"></p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nThe engineers tried some other things in the hope of finding a more effective insulation for the compartment.\n\nWhat is the most precise revision for the words The engineers tried some other things?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\"><u>The engineers tried some other things</u> in the hope of finding a more effective insulation for the compartment.</blockquote><p>What is the <strong>most</strong> precise revision for the words <em><strong>The engineers tried some other things</strong></em>?</p>",
    "topic": "Word Choice & Precision",
    "choices": [
      {
        "id": "A",
        "html": "<p>The engineers did experiments with several new materials</p>",
        "text": "The engineers did experiments with several new materials"
      },
      {
        "id": "B",
        "html": "<p>The engineers tested foam and fiberglass</p>",
        "text": "The engineers tested foam and fiberglass"
      },
      {
        "id": "C",
        "html": "<p>The engineers examined two new materials</p>",
        "text": "The engineers examined two new materials"
      },
      {
        "id": "D",
        "html": "<p>The engineers worked with foam and fiberglass</p>",
        "text": "The engineers worked with foam and fiberglass"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form A"
    ],
    "versionLabel": "2024-2025 Form A"
  },
  {
    "id": "part-b-import-6e34e1a52059-024cf95e",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2024-2025 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20242025_form_a.pdf",
      "year": "2024-2025",
      "form": "A",
      "sourceQuestion": "2",
      "pages": [
        3
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20242025-form-a-answers-q2-1-png-passage.png\" alt=\"Supplied explanation for question 2\"></p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n\n(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.",
    "promptHtml": "<p>Which sentence contains an error in its construction and should be revised?</p><blockquote data-boxed=\"true\">(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.</blockquote>",
    "topic": "Modifiers",
    "choices": [
      {
        "id": "A",
        "html": "<p>sentence 1</p>",
        "text": "sentence 1"
      },
      {
        "id": "B",
        "html": "<p>sentence 2</p>",
        "text": "sentence 2"
      },
      {
        "id": "C",
        "html": "<p>sentence 3</p>",
        "text": "sentence 3"
      },
      {
        "id": "D",
        "html": "<p>sentence 4</p>",
        "text": "sentence 4"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form A"
    ],
    "versionLabel": "2024-2025 Form A"
  },
  {
    "id": "part-b-import-30519d115cab-1f91a2d7",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2024-2025 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20242025_form_a.pdf",
      "year": "2024-2025",
      "form": "A",
      "sourceQuestion": "3",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20242025-form-a-answers-q3-1-png-passage.png\" alt=\"Supplied explanation for question 3\"></p>",
    "points": 1,
    "prompt": "Which edit should be made to correct the sentence?\n\nThe Colosseum in Rome, Italy which is considered one of the “new” Seven Wonders of the World, is the largest amphitheater ever built and once could hold up to 50,000 spectators.",
    "promptHtml": "<p>Which edit should be made to correct the sentence?</p><blockquote data-boxed=\"true\">The Colosseum in <u>Rome,</u> <u>Italy</u> which is considered one of the “new” Seven Wonders of the <u>World,</u> is the largest amphitheater ever <u>built</u> and once could hold up to 50,000 spectators.</blockquote>",
    "topic": "Punctuation",
    "choices": [
      {
        "id": "A",
        "html": "<p>Delete the comma after <em><strong>Rome</strong></em>.</p>",
        "text": "Delete the comma after Rome."
      },
      {
        "id": "B",
        "html": "<p>Insert a comma after <em><strong>Italy</strong></em>.</p>",
        "text": "Insert a comma after Italy."
      },
      {
        "id": "C",
        "html": "<p>Delete the comma after <em><strong>World</strong></em>.</p>",
        "text": "Delete the comma after World."
      },
      {
        "id": "D",
        "html": "<p>Insert a comma after <em><strong>built</strong></em>.</p>",
        "text": "Insert a comma after built."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form A"
    ],
    "versionLabel": "2024-2025 Form A"
  },
  {
    "id": "part-b-import-383f7188a8c8-b7196781",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "label": "2024-2025 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20242025_form_a.pdf",
      "year": "2024-2025",
      "form": "A",
      "sourceQuestion": "4",
      "pages": [
        4
      ],
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20242025-form-a-answers-q4-1-png-passage.png\" alt=\"Supplied explanation for question 4\"></p><p><img src=\"/exam-images/restore-20242025-form-a-answers-q4-2-png-passage.png\" alt=\"Supplied explanation for question 4\"></p>",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n\n(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "promptHtml": "<p>Which pair of revisions need to be made in this paragraph?</p><blockquote data-boxed=\"true\">(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people <u>wonder:</u> what <u>is</u> the difference between the two? (2) To start <u>with,</u> the butterfat content is much higher in ice cream than <u>it is</u> in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing <u>process,</u> which adds less air to the frozen treat, <u>makes</u> gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the <u>gelato,</u> and <u>allow</u> it to melt more quickly.</blockquote>",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 1: Delete the colon after <em><strong>wonder</strong></em> AND change <em><strong>is</strong></em> to <strong>are</strong>.</p>",
        "text": "Sentence 1: Delete the colon after wonder AND change is to are."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Delete the comma after <em><strong>with</strong></em> AND change <em><strong>it is</strong></em> to <strong>they are</strong>.</p>",
        "text": "Sentence 2: Delete the comma after with AND change it is to they are."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Delete the comma after <em><strong>process</strong></em> AND change <em><strong>makes</strong></em> to <strong>make</strong>.</p>",
        "text": "Sentence 3: Delete the comma after process AND change makes to make."
      },
      {
        "id": "D",
        "html": "<p>Sentence 4: Delete the comma after <em><strong>gelato</strong></em> AND change <em><strong>allow</strong></em> to <strong>allows</strong>.</p>",
        "text": "Sentence 4: Delete the comma after gelato AND change allow to allows."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "2024-2025 Form A"
    ],
    "versionLabel": "2024-2025 Form A"
  },
  {
    "id": "part-b-import-69ac133f53cf-d313d3e2",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://adam.testnav.com/client/index.html",
      "year": "2025-2026",
      "form": "B",
      "section": "English",
      "sourceQuestion": "54",
      "collection": "official_handbook"
    },
    "explanationHtml": "<p><img src=\"/exam-images/2025-2026-form-b-q54-explanation-passage.png\" alt=\"Official TestNav explanation for question 54\"></p>",
    "points": 1,
    "prompt": "Which part of the paragraph contains an error in sentence structure?",
    "instructions": "Select the one error.",
    "promptHtml": "Which part of the paragraph contains an error in sentence structure?",
    "selectionHtml": "<p>In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian <span data-choice-id=\"A\">Institution, the</span> museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a <span data-choice-id=\"B\">year. The</span> museum features more than 30,000 <span data-choice-id=\"C\">objects, including</span> Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation <span data-choice-id=\"D\">Proclamation, written</span> in 1863 during the presidency of Abraham Lincoln, is also on display at the museum.</p>",
    "topic": "Sentence Structure",
    "choices": [
      {
        "id": "A",
        "html": "Institution, the",
        "text": "Institution, the"
      },
      {
        "id": "B",
        "html": "year. The",
        "text": "year. The"
      },
      {
        "id": "C",
        "html": "objects, including",
        "text": "objects, including"
      },
      {
        "id": "D",
        "html": "Proclamation, written",
        "text": "Proclamation, written"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "2025-2026 Form B"
    ],
    "versionLabel": "2025-2026 Form B"
  },
  {
    "id": "satcc-9cc827afe5f992f7af37-ela-47",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "revising_editing_a",
      "sourceQuestion": "47",
      "packageId": "8e1f5cde3b0abfa6dbe343a28fbb16562b07b7bfd715cd8f81386b3d05729707",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Sentence 3 joins two independent clauses with only a comma. The second clause tells what happens during the three weekends, so \"; in that time,\" supplies both the semicolon and that time relationship. \", in that time,\" is still a comma splice, because a phrase set off by commas cannot join two independent clauses. \"; however,\" and \", although\" signal a contrast that the ideas do not have.",
    "explanationHtml": "<p>Sentence 3 joins two independent clauses with only a comma. The second clause tells what happens during the three weekends, so &quot;; in that time,&quot; supplies both the semicolon and that time relationship. &quot;, in that time,&quot; is still a comma splice, because a phrase set off by commas cannot join two independent clauses. &quot;; however,&quot; and &quot;, although&quot; signal a contrast that the ideas do not have.</p>",
    "points": 1,
    "prompt": "One sentence of the paragraph should be revised to correct a comma splice. Drag the word or phrase into the blank that corrects the error and best shows the relationship between the ideas in that sentence.",
    "instructions": "Move a word into each blank.",
    "stimulus": "(1) Every autumn, the Delmore Neighborhood Association holds a cider-pressing festival in the orchard behind the old grain cooperative. (2) Volunteers haul wooden crates of apples from several nearby farms, sorting them by variety before the pressing begins. (3) The pressing lasts three consecutive weekends, in that time the volunteers produce nearly four hundred gallons of cider. (4) Families from across the county arrive early for samples, and younger children are given small cups so they can taste the difference between tart and sweet varieties. (5) Leftover pulp from the pressing is composted on site and returned to the orchard soil the following spring.",
    "stimulusHtml": "<p>(1) Every autumn, the Delmore Neighborhood Association holds a cider-pressing festival in the orchard behind the old grain cooperative. (2) Volunteers haul wooden crates of apples from several nearby farms, sorting them by variety before the pressing begins. (3) The pressing lasts three consecutive weekends, in that time the volunteers produce nearly four hundred gallons of cider. (4) Families from across the county arrive early for samples, and younger children are given small cups so they can taste the difference between tart and sweet varieties. (5) Leftover pulp from the pressing is composted on site and returned to the orchard soil the following spring.</p>",
    "promptHtml": "One sentence of the paragraph should be revised to correct a comma splice. Drag the word or phrase into the blank that corrects the error and <strong>best</strong> shows the relationship between the ideas in that sentence.",
    "topic": "Punctuation",
    "type": "transition_drop",
    "dragDropStyle": "outlined",
    "choices": [
      {
        "id": "A",
        "html": "<p><strong>, in that time,</strong></p>",
        "text": ", in that time,"
      },
      {
        "id": "B",
        "html": "<p><strong>; in that time,</strong></p>",
        "text": "; in that time,"
      },
      {
        "id": "C",
        "html": "<p><strong>; however,</strong></p>",
        "text": "; however,"
      },
      {
        "id": "D",
        "html": "<p><strong>, although</strong></p>",
        "text": ", although"
      }
    ],
    "dragDropContent": [
      "The pressing lasts three consecutive weekends {{blank-1}} the volunteers produce nearly four hundred gallons of cider."
    ],
    "dragDropSlots": [
      {
        "id": "blank-1",
        "correctItemId": "B"
      }
    ],
    "allowReuse": false,
    "versionLabels": [
      "Digital SHSAT Practice Test Adaptive 10 (Hard)"
    ],
    "versionLabel": "Digital SHSAT Practice Test Adaptive 10 (Hard)"
  },
  {
    "id": "satcc-9cc827afe5f992f7af37-ela-48",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "revising_editing_a",
      "sourceQuestion": "48",
      "packageId": "8e1f5cde3b0abfa6dbe343a28fbb16562b07b7bfd715cd8f81386b3d05729707",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: D \n In sentence 2 the subject \"Each session\" is singular, so it needs \"is.\" In sentence 3 the relative pronoun \"who\" refers to the plural \"Participants,\" so the verb must be \"sign.\" Choice A wrongly makes the main verb agree with \"signs\" rather than with \"Participants.\" Choice B changes \"have,\" which correctly agrees with \"adults.\" Choice C breaks the agreement of \"includes\" with the singular \"kit\" and leaves sentence 2 uncorrected.",
    "explanationHtml": "<p>Correct Answer: D <br> In sentence 2 the subject &quot;Each session&quot; is singular, so it needs &quot;is.&quot; In sentence 3 the relative pronoun &quot;who&quot; refers to the plural &quot;Participants,&quot; so the verb must be &quot;sign.&quot; Choice A wrongly makes the main verb agree with &quot;signs&quot; rather than with &quot;Participants.&quot; Choice B changes &quot;have,&quot; which correctly agrees with &quot;adults.&quot; Choice C breaks the agreement of &quot;includes&quot; with the singular &quot;kit&quot; and leaves sentence 2 uncorrected.</p>",
    "points": 1,
    "prompt": "Two verbs in the paragraph do not agree with their subjects. Which pair of revisions corrects both errors without creating a new one?",
    "stimulus": "(1) The Alderton Public Library recently began offering a series of free workshops on hand-lettering and calligraphy. (2) Each session are limited to twelve participants so that the instructor can give individual attention to everyone who attends. (3) Participants who signs up early receive a starter kit that includes three different nib sizes, a small bottle of ink, and several practice sheets printed on heavyweight paper. (4) The library director hopes the workshops will draw adults who have never thought of themselves as artistic, as well as older students looking for a creative outlet outside of school. (5) Registration opens the first Monday of each month and fills within a few hours every time.",
    "stimulusHtml": "<p>(1) The Alderton Public Library recently began offering a series of free workshops on hand-lettering and calligraphy. (2) Each session are limited to twelve participants so that the instructor can give individual attention to everyone who attends. (3) Participants who signs up early receive a starter kit that includes three different nib sizes, a small bottle of ink, and several practice sheets printed on heavyweight paper. (4) The library director hopes the workshops will draw adults who have never thought of themselves as artistic, as well as older students looking for a creative outlet outside of school. (5) Registration opens the first Monday of each month and fills within a few hours every time.</p>",
    "promptHtml": "Two verbs in the paragraph do not agree with their subjects. Which pair of revisions corrects both errors without creating a new one?",
    "topic": "Verbs",
    "choices": [
      {
        "id": "A",
        "html": "<p>Sentence 2: Change <em>are</em> to <em>is</em>, AND sentence 3: change <em>receive</em> to <em>receives</em>.</p>",
        "text": "Sentence 2: Change are to is, AND sentence 3: change receive to receives."
      },
      {
        "id": "B",
        "html": "<p>Sentence 2: Change <em>are</em> to <em>is</em>, AND sentence 4: change <em>have</em> to <em>has</em>.</p>",
        "text": "Sentence 2: Change are to is, AND sentence 4: change have to has."
      },
      {
        "id": "C",
        "html": "<p>Sentence 3: Change <em>signs</em> to <em>sign</em>, AND change <em>includes</em> to <em>include</em>.</p>",
        "text": "Sentence 3: Change signs to sign, AND change includes to include."
      },
      {
        "id": "D",
        "html": "<p>Sentence 2: Change <em>are</em> to <em>is</em>, AND sentence 3: change <em>signs</em> to <em>sign</em>.</p>",
        "text": "Sentence 2: Change are to is, AND sentence 3: change signs to sign."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice",
    "versionLabels": [
      "Digital SHSAT Practice Test Adaptive 10"
    ],
    "versionLabel": "Digital SHSAT Practice Test Adaptive 10"
  },
  {
    "id": "satcc-9cc827afe5f992f7af37-ela-50",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "revising_editing_a",
      "sourceQuestion": "50",
      "packageId": "8e1f5cde3b0abfa6dbe343a28fbb16562b07b7bfd715cd8f81386b3d05729707",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanation": "Correct Answer: A \n \"When compiling the final report\" must describe whoever did the compiling, so the subject of the main clause must be the students. Choice B changes the verb but leaves \"the data\" as the subject, so the modifier still dangles. Choice C adds the students only in a phrase after the verb, so the modifier still describes the data. Choice D removes the main clause and leaves a fragment.",
    "explanationHtml": "<p>Correct Answer: A <br> &quot;When compiling the final report&quot; must describe whoever did the compiling, so the subject of the main clause must be the students. Choice B changes the verb but leaves &quot;the data&quot; as the subject, so the modifier still dangles. Choice C adds the students only in a phrase after the verb, so the modifier still describes the data. Choice D removes the main clause and leaves a fragment.</p>",
    "points": 1,
    "prompt": "Which revision of sentence 3 corrects the error in its construction?",
    "stimulus": "(1) The Westgate Middle School gardening club decided to map every tree on the school grounds as a spring project. (2) Working in pairs, students measured trunk circumference, estimated height, and recorded the species of each tree using a pocket field guide. (3) When compiling the final report, the data was organized by tree size and then by location on the property. (4) The completed map was laminated and posted near the main entrance, where it has become a small point of pride for students and teachers alike. (5) The club plans to update the map each spring to track how the trees change as the years go by.",
    "stimulusHtml": "<p>(1) The Westgate Middle School gardening club decided to map every tree on the school grounds as a spring project. (2) Working in pairs, students measured trunk circumference, estimated height, and recorded the species of each tree using a pocket field guide. (3) When compiling the final report, the data was organized by tree size and then by location on the property. (4) The completed map was laminated and posted near the main entrance, where it has become a small point of pride for students and teachers alike. (5) The club plans to update the map each spring to track how the trees change as the years go by.</p>",
    "promptHtml": "Which revision of sentence 3 corrects the error in its construction?",
    "topic": "Topic & Transitions",
    "choices": [
      {
        "id": "A",
        "html": "<p>When compiling the final report, the students organized the data by tree size and then by location on the property.</p>",
        "text": "When compiling the final report, the students organized the data by tree size and then by location on the property."
      },
      {
        "id": "B",
        "html": "<p>When compiling the final report, the data were organized by tree size and then by location on the property.</p>",
        "text": "When compiling the final report, the data were organized by tree size and then by location on the property."
      },
      {
        "id": "C",
        "html": "<p>Compiling the final report, the data was organized by the students by tree size and then by location on the property.</p>",
        "text": "Compiling the final report, the data was organized by the students by tree size and then by location on the property."
      },
      {
        "id": "D",
        "html": "<p>When compiling the final report, organizing the data by tree size and then by location on the property.</p>",
        "text": "When compiling the final report, organizing the data by tree size and then by location on the property."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice",
    "versionLabels": [
      "Digital SHSAT Practice Test Adaptive 10"
    ],
    "versionLabel": "Digital SHSAT Practice Test Adaptive 10"
  },
  {
    "id": "satcc-9cc827afe5f992f7af37-ela-49",
    "source": {
      "sourceFamily": "sat_crash_course",
      "sourceFormat": "web",
      "playerProfile": "sat_crash_course",
      "sourceId": "satcc-9cc827afe5f992f7af37",
      "label": "Digital SHSAT Practice Test Adaptive 10",
      "url": "https://tutor.thesatcrashcourse.com/tests/digital-shsat/digital-Digital%20SHSAT%20Practice%20Test%20Adaptive%2010",
      "section": "revising_editing_a",
      "sourceQuestion": "49",
      "packageId": "8e1f5cde3b0abfa6dbe343a28fbb16562b07b7bfd715cd8f81386b3d05729707",
      "originalPackageId": "2fdc8b06a5ce6df8c79ef34a923e4aa5ff4e2ae8da1afd68f88c8157b8130238"
    },
    "explanationHtml": "<p>In sentence 5, &quot;leads&quot; and &quot;begins&quot; describe a habit in the present tense, so &quot;stepped&quot; should be &quot;step.&quot; &quot;Began&quot; (sentence 2) and &quot;launched&quot; (sentence 4) correctly describe past events, and &quot;has grown&quot; (sentence 6) correctly describes growth that continues to the present. &quot;Steps&quot; does not agree with &quot;they,&quot; &quot;would step&quot; adds a conditional meaning, and &quot;had stepped&quot; wrongly makes the stepping happen before the teaching.</p>",
    "skilled": "TBD",
    "explanation": "In sentence 5, \"leads\" and \"begins\" describe a habit in the present tense, so \"stepped\" should be \"step.\" \"Began\" (sentence 2) and \"launched\" (sentence 4) correctly describe past events, and \"has grown\" (sentence 6) correctly describes growth that continues to the present. \"Steps\" does not agree with \"they,\" \"would step\" adds a conditional meaning, and \"had stepped\" wrongly makes the stepping happen before the teaching.",
    "points": 1,
    "prompt": "The paragraph contains one error in verb tense. Select the correct answer from each drop-down menu to complete the statement.",
    "promptHtml": "The paragraph contains one error in verb tense. Select the correct answer from each drop-down menu to complete the statement.",
    "dropdownContentHtml": "<p>The verb that should be revised is {{dropdown-1}}, and it should be changed to {{dropdown-2}}.</p>",
    "stimulus": "(1) Last spring, the Copperhill Skate Collective finished building a concrete half-pipe at Dunmore Park, and the new ramp quickly became the most popular feature on the property. (2) Before construction began, the collective spent months raising funds and consulting with experienced skaters about the ideal dimensions. (3) Once the ramp opened, the collective posted a rules sign at the entrance listing safety requirements for all riders. (4) The following autumn, the collective also launched a free youth clinic on Saturday mornings, and more than forty beginners signed up for the first session. (5) Instructor Priya Sutton leads each clinic, and she always begins by teaching participants how to fall safely before they ever stepped onto the ramp. (6) Attendance has grown steadily every week since the program started.",
    "stimulusHtml": "<p>(1) Last spring, the Copperhill Skate Collective finished building a concrete half-pipe at Dunmore Park, and the new ramp quickly became the most popular feature on the property. (2) Before construction began, the collective spent months raising funds and consulting with experienced skaters about the ideal dimensions. (3) Once the ramp opened, the collective posted a rules sign at the entrance listing safety requirements for all riders. (4) The following autumn, the collective also launched a free youth clinic on Saturday mornings, and more than forty beginners signed up for the first session. (5) Instructor Priya Sutton leads each clinic, and she always begins by teaching participants how to fall safely before they ever stepped onto the ramp. (6) Attendance has grown steadily every week since the program started.</p>",
    "topic": "TBD",
    "dropdownContent": [
      "The verb that should be revised is {{dropdown-1}}, and it should be changed to {{dropdown-2}}."
    ],
    "dropdowns": [
      {
        "correctChoiceId": "option-3",
        "id": "dropdown-1",
        "options": [
          {
            "id": "option-1",
            "text": "began"
          },
          {
            "id": "option-2",
            "text": "launched"
          },
          {
            "id": "option-3",
            "text": "stepped"
          },
          {
            "id": "option-4",
            "text": "has grown"
          }
        ]
      },
      {
        "correctChoiceId": "option-1",
        "id": "dropdown-2",
        "options": [
          {
            "id": "option-1",
            "text": "step"
          },
          {
            "id": "option-2",
            "text": "had stepped"
          },
          {
            "id": "option-3",
            "text": "would step"
          },
          {
            "id": "option-4",
            "text": "steps"
          }
        ]
      }
    ],
    "type": "inline_dropdown",
    "versionLabels": [
      "Digital SHSAT Practice Test Adaptive 10"
    ],
    "versionLabel": "Digital SHSAT Practice Test Adaptive 10"
  }
];

export function getStandaloneItemsById(ids: string[]) {
  return ids.map((id) => {
    const item = standaloneItems.find((candidate) => candidate.id === id);

    if (!item) {
      throw new Error(`Unknown standalone item: ${id}`);
    }

    const studentQuestion: ExamQuestion = { ...item };
    delete (studentQuestion as ExamQuestion & { versionLabel?: string }).versionLabel;
    delete (studentQuestion as ExamQuestion & { versionLabels?: string[] }).versionLabels;
    delete (studentQuestion as ExamQuestion & { duplicateOf?: string }).duplicateOf;
    delete (studentQuestion as ExamQuestion & { canonicalContent?: boolean }).canonicalContent;
    return studentQuestion;
  });
}
