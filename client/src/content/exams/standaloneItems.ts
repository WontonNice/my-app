import type { ExamQuestion } from "./types";

export const standaloneItems: (ExamQuestion & { versionLabel?: string; versionLabels?: string[]; duplicateOf?: string })[] = [
  {
    "id": "standalone-vague-pronoun-1",
    "topic": "Pronouns",
    "type": "multiple_choice",
    "prompt": "Which sentence of the paragraph should be revised to correct a vague pronoun?",
    "stimulus": "(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade.  (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events.  (3) Outside of school, she also sings in a choir made up of young and old members of her community.  (4) Both girls hope that they will be able to continue singing for many more years.",
    "correctChoiceId": "C",
    "points": 1,
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
    ]
  },
  {
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Delete the comma after&nbsp;<strong><em>Yalina</em></strong>, AND change&nbsp;<em><strong>their</strong></em>&nbsp;to&nbsp;<strong>her</strong>.",
        "text": "Sentence 1: Delete the comma after \nYalina\n, AND change \ntheir\n to \nher\n."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change&nbsp;<em><strong>is</strong></em>&nbsp;to&nbsp;<strong>are</strong>, AND delete the comma after&nbsp;<em><strong>bowl</strong></em>.",
        "text": "Sentence 2: Change \nis\n to \nare\n, AND delete the comma after \nbowl\n."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change&nbsp;<em><strong>it&nbsp;is</strong></em>&nbsp;to&nbsp;<strong>they&nbsp;are</strong>, AND delete the comma after&nbsp;<em><strong>smooth</strong></em>.",
        "text": "Sentence 3: Change \nit \nis\n to \nthey \nare\n, AND delete the comma after \nsmooth\n."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change&nbsp;<em><strong>they&nbsp;start</strong></em>&nbsp;to&nbsp;<strong>it&nbsp;starts</strong>, AND insert a comma after&nbsp;<em><strong>sweet</strong></em>.",
        "text": "Sentence 4: Change \nthey \nstart\n to \nit \nstarts\n, AND insert a comma after \nsweet\n."
      }
    ],
    "correctChoiceId": "D",
    "id": "standalone-pancakes-1",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?",
    "stimulus": "(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings.  (2) Yalina's job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries.  (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time.  (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "stimulusHtml": "(1) <u>Yalina,</u> Michael, and Malcolm love making pancakes with <u>their</u> granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a <u>bowl,</u> slowly adding water, eggs, melted butter, <u>and</u> blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is <u>smooth,</u> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when <u>they start</u> to bubble, while all three siblings get the table ready for a <u>sweet</u> delicious breakfast.",
    "topic": "Pronouns",
    "type": "multiple_choice"
  },
  {
    "id": "standalone-pangaea-sentence-structure-1",
    "topic": "Sentence Structure",
    "type": "multiple_choice",
    "prompt": "Which revision corrects the error in sentence structure in the paragraph?",
    "stimulus": "The land on Earth has not always been separated into the seven continents, at one time a massive supercontinent, known as Pangaea, covered one-third of Earth's surface. Additionally, the supercontinent was surrounded by ocean waters called Panthalassa, much of which were in Earth's Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth's crust. In fact, experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "stimulusHtml": "The land on Earth has not always been separated into the seven <u>continents, at</u> one time a massive supercontinent, known as Pangaea, covered one-third of Earth’s <u>surface. Additionally,</u> the supercontinent was surrounded by ocean waters called <u>Panthalassa, much</u> of which were in Earth’s Southern Hemisphere. Geologists believe that the supercontinent split apart over millions of years because of the movement of the tectonic plates that form Earth’s <u>crust. In fact,</u> experts predict that over the next 250 million years the movement of the plates will cause the seven continents to merge into a supercontinent again.",
    "correctChoiceId": "A",
    "points": 1,
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
    ]
  },
  {
    "id": "standalone-blobfish-construction-1",
    "topic": "Pronouns",
    "type": "category_sort",
    "prompt": "Which sentence in the paragraph contains an error in construction?",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh.  (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor.  (3) It must wait patiently for whatever edible matter might float by its mouth.  (4) The blobfish's downturned mouth, slimy skin, and pale coloring caused them to be voted the World's Ugliest Animal in 2013.",
    "instructions": "Move the answer to the box. There is only one error in construction.",
    "correctPlacements": {
      "sentence-4": "construction-error"
    },
    "points": 1,
    "requiredPlacements": 1,
    "categories": [
      {
        "id": "construction-error",
        "title": "Contains an error in construction"
      }
    ],
    "items": [
      {
        "id": "sentence-1",
        "text": "Sentence 1"
      },
      {
        "id": "sentence-2",
        "text": "Sentence 2"
      },
      {
        "id": "sentence-3",
        "text": "Sentence 3"
      },
      {
        "id": "sentence-4",
        "text": "Sentence 4"
      }
    ]
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
        "html": "Although&nbsp;there&nbsp;have&nbsp;been&nbsp;flyby&nbsp;missions&nbsp;near&nbsp;Jupiter&nbsp;since&nbsp;1973,&nbsp;they&nbsp;have&nbsp;allowed&nbsp;scientists&nbsp;to&nbsp;collect&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons.",
        "text": "Although there have been flyby missions near Jupiter since 1973, they have allowed scientists to collect data about the planet and its moons."
      },
      {
        "id": "C",
        "html": "Flyby&nbsp;missions&nbsp;near&nbsp;Jupiter,&nbsp;which&nbsp;allow&nbsp;scientists&nbsp;to&nbsp;collect&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons,&nbsp;have&nbsp;been&nbsp;happening&nbsp;since&nbsp;1973.",
        "text": "Flyby missions near Jupiter, which allow scientists to collect data about the planet and its moons, have been happening since 1973."
      },
      {
        "id": "D",
        "html": "Flyby&nbsp;missions&nbsp;have&nbsp;been&nbsp;happening&nbsp;near&nbsp;Jupiter,&nbsp;but&nbsp;scientists&nbsp;have&nbsp;been&nbsp;collecting&nbsp;data&nbsp;about&nbsp;the&nbsp;planet&nbsp;and&nbsp;its&nbsp;moons&nbsp;since&nbsp;1973.",
        "text": "Flyby missions have been happening near Jupiter, but scientists have been collecting data about the planet and its moons since 1973."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "part-b-question-6",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?",
    "promptHtml": "Which&nbsp;sentence&nbsp;in&nbsp;the&nbsp;paragraph&nbsp;contains&nbsp;an&nbsp;error&nbsp;in&nbsp;construction&nbsp;and&nbsp;should&nbsp;be&nbsp;revised?",
    "stimulus": "(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City.  (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work.  (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day!  (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.",
    "stimulusHtml": "(1)&nbsp;On&nbsp;the&nbsp;evening&nbsp;of&nbsp;July&nbsp;13,&nbsp;2019,&nbsp;a&nbsp;major&nbsp;power&nbsp;outage&nbsp;affected&nbsp;the&nbsp;Upper&nbsp;West&nbsp;Side&nbsp;of&nbsp;Manhattan&nbsp;in&nbsp;New&nbsp;York&nbsp;City. &nbsp;(2)&nbsp;Leaving&nbsp;approximately&nbsp;73,000&nbsp;residents&nbsp;without&nbsp;electricity&nbsp;for&nbsp;three&nbsp;long&nbsp;hours,&nbsp;lights&nbsp;did&nbsp;not&nbsp;function,&nbsp;refrigerators&nbsp;did&nbsp;not&nbsp;stay&nbsp;cold,&nbsp;and&nbsp;air&nbsp;conditioners&nbsp;did&nbsp;not&nbsp;work. &nbsp;(3)&nbsp;Longtime&nbsp;city&nbsp;residents&nbsp;were&nbsp;particularly&nbsp;confused&nbsp;because&nbsp;an&nbsp;eerily&nbsp;similar&nbsp;event&nbsp;had&nbsp;occurred&nbsp;years&nbsp;earlier—on&nbsp;the&nbsp;exact&nbsp;same&nbsp;day! &nbsp;(4)&nbsp;The&nbsp;famous&nbsp;New&nbsp;York&nbsp;City&nbsp;Blackout&nbsp;of&nbsp;1977,&nbsp;which&nbsp;lasted&nbsp;for&nbsp;25&nbsp;hours,&nbsp;also&nbsp;happened&nbsp;on&nbsp;July&nbsp;13,&nbsp;an&nbsp;odd&nbsp;coincidence&nbsp;to&nbsp;say&nbsp;the&nbsp;least.",
    "topic": "Modifiers",
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
    "type": "category_sort"
  },
  {
    "id": "part-b-question-7",
    "points": 1,
    "prompt": "How should the paragraph be revised?",
    "promptHtml": "How&nbsp;should&nbsp;the&nbsp;paragraph&nbsp;be&nbsp;revised?",
    "stimulus": "(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "stimulusHtml": "(1)&nbsp;Danielle&nbsp;<u>spent</u>&nbsp;several&nbsp;hours&nbsp;preparing&nbsp;for&nbsp;an&nbsp;upcoming&nbsp;audition&nbsp;for&nbsp;a&nbsp;<u>play</u>&nbsp;at&nbsp;the&nbsp;community&nbsp;theater. (2)&nbsp;First&nbsp;she&nbsp;<u>did</u>&nbsp;vocal&nbsp;exercises&nbsp;to&nbsp;practice&nbsp;her&nbsp;diction&nbsp;and&nbsp;<u>projection</u>&nbsp;so&nbsp;that&nbsp;her&nbsp;words&nbsp;would&nbsp;carry&nbsp;clearly&nbsp;throughout&nbsp;the&nbsp;large&nbsp;auditorium. (3)&nbsp;Then&nbsp;she&nbsp;<u>studies</u>&nbsp;the&nbsp;text&nbsp;of&nbsp;the&nbsp;monologue&nbsp;to&nbsp;better&nbsp;understand&nbsp;the&nbsp;<u>emotions,</u>&nbsp;and&nbsp;motivations&nbsp;of&nbsp;the&nbsp;character&nbsp;she&nbsp;plans&nbsp;to&nbsp;portray. (4)&nbsp;Finally&nbsp;she&nbsp;<u>recited</u>&nbsp;her&nbsp;monologue&nbsp;in&nbsp;front&nbsp;of&nbsp;a&nbsp;mirror&nbsp;many&nbsp;<u>times,</u>&nbsp;making&nbsp;slight&nbsp;adjustments&nbsp;and&nbsp;improvements&nbsp;to&nbsp;her&nbsp;performance&nbsp;each&nbsp;time.",
    "topic": "Verbs",
    "versionLabel": "2025-2026 Form B",
    "choices": [
      {
        "id": "A",
        "html": "Sentence&nbsp;1:&nbsp;Change&nbsp;<em><strong>spent</strong></em>&nbsp;to&nbsp;<strong>had&nbsp;spent</strong>,&nbsp;AND&nbsp;insert&nbsp;a&nbsp;comma&nbsp;after&nbsp;<em><strong>play</strong></em>.",
        "text": "Sentence 1: Change \nspent\n to \nhad spent\n, AND insert a comma after \nplay\n."
      },
      {
        "id": "B",
        "html": "Sentence&nbsp;2:&nbsp;Change&nbsp;<em><strong>did</strong></em>&nbsp;to&nbsp;<strong>does</strong>,&nbsp;AND&nbsp;insert&nbsp;a&nbsp;comma&nbsp;after&nbsp;<em><strong>projection</strong></em>.",
        "text": "Sentence 2: Change \ndid\n to \ndoes\n, AND insert a comma after \nprojection\n."
      },
      {
        "id": "C",
        "html": "Sentence&nbsp;3:&nbsp;Change&nbsp;<em><strong>studies</strong></em>&nbsp;to&nbsp;<strong>studied</strong>,&nbsp;AND&nbsp;delete&nbsp;the&nbsp;comma&nbsp;after&nbsp;<em><strong>emotions</strong></em>.",
        "text": "Sentence 3: Change \nstudies\n to \nstudied\n, AND delete the comma after \nemotions\n."
      },
      {
        "id": "D",
        "html": "Sentence&nbsp;4:&nbsp;Change&nbsp;<em><strong>recited</strong></em>&nbsp;to&nbsp;<strong>recites</strong>,&nbsp;AND&nbsp;delete&nbsp;the&nbsp;comma&nbsp;after&nbsp;<em><strong>times</strong></em>.",
        "text": "Sentence 4: Change \nrecited\n to \nrecites\n, AND delete the comma after \ntimes\n."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice",
    "versionLabels": [
      "2025-2026 Form B",
      "2019-2020 Form A"
    ]
  },
  {
    "id": "part-b-question-8",
    "points": 1,
    "prompt": "Which revision of the sentence uses the most precise language?",
    "promptHtml": "Which revision of the sentence uses the most precise language?",
    "stimulus": "The Appalachian Trail is a really long trail that a lot of people do each yea",
    "stimulusHtml": "The Appalachian Trail is a really long trail that a lot of people do each yea",
    "topic": "Sentence Structure",
    "versionLabel": "2020-2021 Form A",
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
    "type": "multiple_choice"
  },
  {
    "id": "part-b-question-9",
    "duplicateOf": "part-b-import-a014b48d8124-92d0f942",
    "points": 1,
    "prompt": "Which edit should be made to correct this sentence?",
    "promptHtml": "Which edit should be made to correct this sentence?",
    "stimulus": "In 1962 the agile athletic Wilt Chamberlain became the first and only professional basketball player in the United States to score 100 points in a single game.",
    "stimulusHtml": "In 1962 the <u>agile</u> athletic Wilt Chamberlain became the <u>first</u> and <u>only</u> professional basketball player in the United <u>States</u> to score 100 points in a single game.",
    "topic": "Sentence Structure",
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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
    ]
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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
    "topic": "Pronouns",
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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
  },
  {
    "id": "part-b-import-f2325dca51de-51707498",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?",
    "promptHtml": "Which sentence contains an error in its construction and should be revised?",
    "stimulus": "(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.",
    "stimulusHtml": "<p>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</p>",
    "explanation": "The question asks for the identification of the sentence that contains an error in its construction and should be revised.\n\nA. Incorrect. There are no errors in sentence 1. The singular pronoun “its” matches the number of the word it refers to, the singular noun “blobfish.” Additionally, the clause “a creature that certainly resembles its name” is correctly set off by commas to provide an additional, but not essential, detail about the blobfish. The comma separating “pink” and “gelatinous” is correct because these are coordinate adjectives.\n\nB. Incorrect. There are no errors in sentence 2. The singular pronouns “it” and “its” match the number of the word they refer to, the singular noun “blobfish.” Additionally, the structure of the sentence correctly shows that the clause “Because it has very few muscles and its density is close to that of water” modifies the words “the blobfish.”\n\nC. Incorrect. There are no errors in sentence 3. The “it” and “its” in the sentence refer to “the blobfish” mentioned in the previous sentence. The use of singular pronouns in sentence 3 is consistent with the rest of the paragraph.\n\nD. CORRECT. Sentence 4 contains an error because the sentence uses the plural pronoun “them” to refer to “The blobfish’s,” which is singular in number. The word “them” should be changed to “it.” The paragraph refers to the blobfish as a singular species in each of the four sentences, and sentence 4 should be revised to match.",
    "explanationHtml": "The question asks for the identification of the sentence that contains an error in its construction and should be revised.<br><strong>A.</strong> Incorrect. There are no errors in sentence 1. The singular pronoun “its” matches the number of the word it refers to, the singular noun “blobfish.” Additionally, the clause “a creature that certainly resembles its name” is correctly set off by commas to provide an additional, but not essential, detail about the blobfish. The comma separating “pink” and “gelatinous” is correct because these are coordinate adjectives.<br><strong>B.</strong> Incorrect. There are no errors in sentence 2. The singular pronouns “it” and “its” match the number of the word they refer to, the singular noun “blobfish.” Additionally, the structure of the sentence correctly shows that the clause “Because it has very few muscles and its density is close to that of water” modifies the words “the blobfish.”<br><strong>C.</strong> Incorrect. There are no errors in sentence 3. The “it” and “its” in the sentence refer to “the blobfish” mentioned in the previous sentence. The use of singular pronouns in sentence 3 is consistent with the rest of the paragraph.<br><strong>D.</strong> <strong>CORRECT.</strong> Sentence 4 contains an error because the sentence uses the plural pronoun “them” to refer to “The blobfish’s,” which is singular in number. The word “them” should be changed to “it.” The paragraph refers to the blobfish as a singular species in each of the four sentences, and sentence 4 should be revised to match.",
    "topic": "Pronouns",
    "versionLabels": [
      "2022-2023 Form B"
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
    "correctChoiceId": "D",
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
    "stimulusHtml": "<p>(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.</p>",
    "topic": "Sentence Structure",
    "versionLabels": [],
    "choices": [
      {
        "id": "A",
        "html": "Sentence 1: Change <strong><em>spent</em></strong> to <strong>had spent</strong>, AND insert a comma after <strong><em>play</em></strong>.",
        "text": "Sentence 1: Change spent to had spent, AND insert a comma after play."
      },
      {
        "id": "B",
        "html": "Sentence 2: Change <strong><em>did</em></strong> to <strong>does</strong>, AND insert a comma after <strong><em>projection</em></strong>.",
        "text": "Sentence 2: Change did to does, AND insert a comma after projection."
      },
      {
        "id": "C",
        "html": "Sentence 3: Change <strong><em>studies</em></strong> to <strong>studied</strong>, AND delete the comma after <strong><em>emotions</em></strong>.",
        "text": "Sentence 3: Change studies to studied, AND delete the comma after emotions."
      },
      {
        "id": "D",
        "html": "Sentence 4: Change <strong><em>recited</em></strong> to <strong>recites</strong>, AND delete the comma after <strong><em>times</em></strong>.",
        "text": "Sentence 4: Change recited to recites, AND delete the comma after times."
      }
    ],
    "correctChoiceId": "C",
    "instructions": "Read this paragraph.",
    "type": "multiple_choice",
    "duplicateOf": "part-b-question-7"
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
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-92d4945b7be3ff3372c6.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Which sentence of the paragraph should be revised to correct a vague pronoun?\n(1) Eliza and Brianna have been singing in their school chorus since they were in fourth grade. (2) The girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. (3) Outside of school, she also sings in a choir made up of young and old members of her community. (4) Both girls hope that they will be able to continue singing for many more years.",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> of the <span>paragraph</span> should be revised to correct a vague pronoun?</span></p> <blockquote data-boxed=\"true\"><span><span>(1) Eliza</span> and Brianna have been singing in their school chorus since they were in fourth grade. &nbsp;<span>(2) The</span> girls always sing a duet at the school talent show, and they take turns singing the national anthem before school sporting events. &nbsp;<span>(3) Outside</span> of school, she also sings in a choir made up of young and old members of her community. &nbsp;<span>(4) Both</span> girls hope that they will be able to continue singing for many more years.</span></blockquote>",
    "topic": "",
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
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-f7a2663845793eb48cdd.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Which pair of revisions is needed to correct the errors in the paragraph?\n(1) Yalina, Michael, and Malcolm love making pancakes with their granddad on Saturday mornings. (2) Yalina’s job is to open the box and pour the pancake mix into a bowl, slowly adding water, eggs, melted butter, and blueberries. (3) Michael uses a wooden spoon to vigorously stir the mixture until it is smooth, and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time. (4) Granddad turns each pancake when they start to bubble, while all three siblings get the table ready for a sweet delicious breakfast.",
    "promptHtml": "<p><span><span>Which</span> pair of revisions is needed to correct the errors in the <span>paragraph</span>?</span></p> <blockquote data-boxed=\"true\"><span>(1) <span><u>Yalina,</u></span> Michael, and Malcolm love making pancakes with <span><u>their</u></span> granddad on Saturday mornings.&nbsp; <span>(2) Yalina’s</span> job <span><u>is</u></span> to open the box and pour the pancake mix into a <span><u>bowl,</u></span> slowly adding water, eggs, melted butter, and blueberries.&nbsp; <span>(3) Michael</span> uses a wooden spoon to vigorously stir the mixture until <span><u>it is</u></span> <span><u>smooth,</u></span> and Malcolm helps Granddad carefully pour the batter onto a griddle one-fourth cup at a time.&nbsp; <span>(4) Granddad</span> turns each pancake when <span><u>they start</u></span> to bubble, while all three siblings get the table ready for a <span><u>sweet</u></span> delicious breakfast.</span></blockquote>",
    "topic": "",
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
      "packageId": "76fee9b98b5287a323dc4cd289be8f2dbbf515ff712be6756ebc6db349edb9dc"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-a-9a1d5b75473231601302.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction?\n(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh. (2) Because it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. (3) It must wait patiently for whatever edible matter might float by its mouth. (4) The blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.\nMove the answer to the box. There is only one error in construction.",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> in the <span>paragraph</span> contains an error in construction?</span></p> <blockquote data-boxed=\"true\"><span>(1) The blobfish, a creature that certainly resembles its name, is an unusual fish whose body is mostly composed of pink, gelatinous flesh.&nbsp; <span>(2) Because</span> it has very few muscles and its density is close to that of water, the blobfish spends its life floating slightly above the ocean floor. &nbsp;<span>(3) It</span> must wait patiently for whatever edible matter might float by its mouth. &nbsp;<span>(4) The</span> blobfish’s downturned mouth, slimy skin, and pale coloring caused them to be voted the World’s Ugliest Animal in 2013.</span></blockquote> <p><span>Move the <span>answer</span> to the box. There is only one error in construction.</span></p>",
    "topic": "",
    "categories": [
      {
        "id": "category-1",
        "title": "Contains an error in construction"
      }
    ],
    "correctPlacements": {
      "item-4": "category-1"
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
      "2026-2027 Form A"
    ],
    "versionLabel": "2026-2027 Form A"
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
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-1d0e191a1f44b2abc36f.png\" alt=\"Official explanation for question 47\">",
    "points": 1,
    "prompt": "Which part of the paragraph contains an error in sentence structure?\nSelect the one error.",
    "promptHtml": "<p><span><span>Which</span> part of the <span>paragraph</span> contains an error in <span>sentence</span> structure?</span></p> <p><span>Select the one error.</span></p>",
    "selectionHtml": "<blockquote data-boxed=\"true\"><span>In September 2016 the National Museum of African American History and Culture opened as part of the Smithsonian&nbsp;</span><span data-choice-id=\"A\"><span>Institution, the</span></span><span> museum is already the Smithsonian’s third most popular site. Experts say that they expect this newest Smithsonian facility to welcome nearly 4 million visitors a </span><span data-choice-id=\"B\"><span>year. The</span></span><span> museum features more than 30,000 </span><span data-choice-id=\"C\"><span>objects, including</span></span><span> Muhammad Ali’s boxing gloves and a dress sewn by Rosa Parks. A commemorative copy of the Emancipation </span><span data-choice-id=\"D\"><span>Proclamation, written</span></span><span> in </span><span>1863</span><span> during the presidency of Abraham Lincoln, is also on display at the museum.</span></blockquote>",
    "topic": "",
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
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-c1b6f7a1858869678ce9.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Read these sentences.\n(1) Flyby missions near Jupiter have been happening since 1973.\n(2) Flyby missions allow scientists to collect data about Jupiter and its moons.\n\nWhat is the best way to combine the sentences to clarify the relationship between the ideas?",
    "promptHtml": "<p><span><span>Read</span> these <span>sentences</span>.</span></p> <blockquote data-boxed=\"true\"> <p><span>(1) Flyby missions near Jupiter have been happening since&nbsp;</span><span>1973.</span></p> <p><span>(2) Flyby missions allow scientists to collect data about Jupiter and its moons.</span></p> </blockquote> <p>&nbsp;<span><br><span>What</span> is the <span>best</span> way to combine the sentences to clarify the relationship between the ideas?</span></p>",
    "topic": "",
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
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-ef3122c6fbb3d75307c8.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Which sentence in the paragraph contains an error in construction and should be revised?\n(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City. (2) Leaving approximately 73,000 residents without electricity for three long hours, lights did not function, refrigerators did not stay cold, and air conditioners did not work. (3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier—on the exact same day! (4) The famous New York City Blackout of 1977, which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.\nMove the answer to the box. There is only one error in construction.",
    "promptHtml": "<p><span><span>Which</span> <span>sentence</span> in the <span>paragraph</span> contains an error in construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) On the evening of July 13, 2019, a major power outage affected the Upper West Side of Manhattan in New York City. &nbsp;(2) Leaving approximately 73,000 residents without electricity for three long </span><span>hours,</span><span> lights did not function, refrigerators did not stay cold, and air conditioners did not work. &nbsp;(3) Longtime city residents were particularly confused because an eerily similar event had occurred years earlier</span><span>—</span><span>on the exact same day! &nbsp;(4) The famous New York City Blackout of </span><span>1977,</span><span> which lasted for 25 hours, also happened on July 13, an odd coincidence to say the least.</span></blockquote> <p><span>Move the <span>answer</span> to the box. There is only one error in construction.</span></p>",
    "topic": "",
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
      "packageId": "3ef2ecb7f99ed0aa245fb8a7fdab4a86cabf4579d29860c10ac8f9a8d03da78a"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-b-5b84eeef78e9a3179cba.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "How should the paragraph be revised?\n(1) Danielle spent several hours preparing for an upcoming audition for a play at the community theater. (2) First she did vocal exercises to practice her diction and projection so that her words would carry clearly throughout the large auditorium. (3) Then she studies the text of the monologue to better understand the emotions, and motivations of the character she plans to portray. (4) Finally she recited her monologue in front of a mirror many times, making slight adjustments and improvements to her performance each time.",
    "promptHtml": "<p><span><span>How</span> should the <span>paragraph</span> be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) Danielle <span><u>spent</u></span> several hours preparing for an upcoming audition for a <span><u>play</u></span> at the community theater. &nbsp;<span>(2) First</span> she <span><u>did</u></span> vocal exercises to practice her diction and <span><u>projection</u></span> so that her words would carry clearly throughout the large auditorium. &nbsp;<span>(3) Then</span> she <span><u>studies</u></span> the text of the monologue to better understand the <span><u>emotions,</u></span> and motivations of the character she plans to portray. &nbsp;<span>(4) Finally</span> she <span><u>recited</u></span> her monologue in front of a mirror many <span><u>times,</u></span> making slight adjustments and improvements to her performance each time.</span></blockquote>",
    "topic": "",
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
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-c16127e3dff0b706195d.png\" alt=\"Official explanation for question 48\">",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "promptHtml": "<p><span>Which sentence contains an error in its construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span>(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time.&nbsp; <span>(2) The</span> owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons.&nbsp; <span>(3) The</span> New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals.&nbsp; <span>(4) In</span> 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</span></blockquote>",
    "topic": "",
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
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-950629d02746d145b9a3.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Read these sentences.\n(1) Jordan rehearsed his role for weeks.\n(2) He delivered his lines with ease.\n(3) His performance was met with a burst of applause from the audience.\nWhat is the best way to combine the sentences to clarify the relationship between ideas?",
    "promptHtml": "<p><span>Read these sentences.</span></p> <blockquote data-boxed=\"true\"><span>(1) Jordan rehearsed his role for weeks.<br>(2) He delivered his lines with ease.<br>(3) His performance was met with a burst of applause from the audience. &nbsp;&nbsp;</span></blockquote> <p><span>What is the best way to combine the sentences to clarify the relationship between ideas?&nbsp;</span></p>",
    "topic": "",
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
      "packageId": "1d3aab9b1274d11ac80b939c0963aefd68b31d07458185d7f9af34cebce34ced"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-c-1562ed08d04a78a50e68.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people wonder: what is the difference between the two? (2) To start with, the butterfat content is much higher in ice cream than it is in gelato, making the Italian treat a wiser decision for people looking to make healthier choices. (3) Additionally, the mixing process, which adds less air to the frozen treat, makes gelato denser than ice cream. (4) Finally, gelato is served 10 to 15 degrees warmer than ice cream, which enhances the texture and flavor of the gelato, and allow it to melt more quickly.",
    "promptHtml": "<p><span>Which pair of revisions need to be made in this paragraph?</span></p> <blockquote data-boxed=\"true\"><span>(1) Both Italian gelato and American ice cream are delightful treats to have on a hot summer day, but many people <span><u>wonder:</u></span> what <span><u>is</u></span> the difference between the two?&nbsp; <span>(2) To</span> start <span><u>with,</u></span> the butterfat content is much higher in ice cream than <span><u>it is</u></span> in gelato, making the Italian treat a wiser decision for people looking to make healthier choices.&nbsp; <span>(3) Additionally,</span> the mixing <span><u>process,</u></span> which adds less air to the frozen treat, <span><u>makes</u></span> gelato denser than ice cream.&nbsp; <span>(4) Finally,</span> gelato is served 10 to <span>15 degrees</span> warmer than ice cream, which enhances the texture and flavor of the <span><u>gelato,</u></span> and <span><u>allow</u></span> it to melt more quickly.</span></blockquote>",
    "topic": "",
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
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-60df9044c8390c0d9b6f.png\" alt=\"Official explanation for question 47\">",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n(1) Walking dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the pet-adoption process, the animal shelter is looking for volunteers to help with a variety of tasks. (2) Working at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. (3) In addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. (4) Caring for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings of others.",
    "promptHtml": "<p><span>Which sentence contains an error in its construction and should be revised?</span></p> <blockquote data-boxed=\"true\"><span><span>(1) Walking</span> dogs, cleaning kennels, hand-feeding newborn kittens, and supporting the </span><span>pet-adoption</span><span> process, the animal shelter is looking for volunteers to help with a variety of tasks. &nbsp;<span>(2) Working</span> at the animal shelter is a great way for young people, especially those who aspire to care for and protect animals, to gain valuable work experience. &nbsp;<span>(3) In</span> addition to hands-on training with animal care, volunteers will learn important job skills, such as punctuality, responsibility, and personal initiative. &nbsp;<span>(4) Caring</span> for animals can also help volunteers develop empathy, which is the awareness and understanding of the feelings&nbsp;of others.</span></blockquote>",
    "topic": "",
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
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-4722231079614280b539.png\" alt=\"Official explanation for question 48\">",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Read this sentence.\nIn the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways send the sound through the environment.\nWhich revision to the words send the sound through the environment uses the most precise language?\nDrag the correct phrase into the box.",
    "promptHtml": "<p><span>Read this sentence.</span></p> <blockquote data-boxed=\"true\"><span>In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways <span><u>send the sound through the environment</u></span>.</span></blockquote> <p><span>Which revision to the words <em><strong>send the sound through the environment</strong></em> uses the most precise language?</span></p><p><span>Drag the correct phrase into the box.&nbsp;</span></p>",
    "dragDropContentHtml": "<p><span>In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways </span>{{slot-1}}<span>.</span></p>",
    "topic": "Uncategorized",
    "allowReuse": false,
    "dragDropStyle": "outlined",
    "dragDropContent": [
      "In the Whispering Gallery of Grand Central Terminal, people whispering a message in one corner can be clearly heard in the opposite corner, regardless of surrounding noise, because the tiled archways {{slot-1}}."
    ],
    "dragDropSlots": [
      {
        "correctItemId": "item-3",
        "id": "slot-1"
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
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-615120363a49890347b5.png\" alt=\"Official explanation for question 49\">",
    "points": 1,
    "prompt": "Read this sentence.\nRobert Cornelius is credited with taking the first, official selfie as a daguerreotype, an image recorded on a copper plate coated in silver, using a process that was more complicated than photos of today which are digitized or printed from film and do not require subjects to sit for nearly fifteen minutes to avoid blurring the image.\nWhich two edits should be made to correct the sentence?\nSelect the two correct answers.",
    "promptHtml": "<p><span>Read this sentence.</span></p> <blockquote data-boxed=\"true\"><span>Robert Cornelius is credited with taking the <span><u>first</u></span>, official selfie as a <span><u>daguerreotype</u></span>, an image recorded on a copper plate coated in&nbsp;<span><u>silver</u></span>, using a process that was more complicated than photos of&nbsp;<span><u>today</u></span> which are digitized or printed from <span><u>film</u></span> and do not require subjects to sit for nearly fifteen minutes to avoid blurring the image. &nbsp;</span></blockquote> <p><span>Which <strong>two</strong> edits should be made to correct the sentence?&nbsp;</span></p><p><span>Select the <strong>two</strong> correct answers.&nbsp;</span></p>",
    "topic": "",
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
      "packageId": "6381201a9e7f6d4c4f526c78e047b0a19fe2852a98a1518bd61ca3594b7470d9"
    },
    "explanationHtml": "<img src=\"/exam-images/official-shsat-2026-d-c3147b4fd6b842e90797.png\" alt=\"Official explanation for question 50\">",
    "points": 1,
    "prompt": "What is the best way to combine the sentences?\n(1) Scientists now believe that Jupiter may have as many as seventy-nine moons.\n(2) One of Jupiter’s moons is named Io.\n(3) Io has the greatest number of active volcanoes in the solar system.",
    "promptHtml": "<p><span>What is the <strong>best</strong> way to combine the sentences?</span></p> <blockquote data-boxed=\"true\"> <p><span>(1) Scientists now believe that Jupiter may have as many as <span>seventy-nine</span> moons.</span></p> <p><span>(2) One of Jupiter’s moons is named Io.</span></p> <p><span>(3) Io has the greatest number of active volcanoes in the solar system.</span></p> </blockquote>",
    "topic": "",
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
      ]
    },
    "explanation": "The question asks for the best way to combine the sentences.\n\nA. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nB. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.\n\nC. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.\n\nD. Incorrect. The combination of the sentences creates an illogical relationship between ideas with the statement that tourists will be allowed to visit the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.",
    "explanationHtml": "<p>The question asks for the best way to combine the sentences.</p><p>A. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. The sentence incorrectly uses “but tourists,” and “which cost” modifies “the space station” but does not modify the trip. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.</p><p>B. CORRECT. The option uses a complex sentence to present ideas clearly and precisely, and it shows the relationship between the ideas in the original sentences. In the first part of the sentence, the conjunction “and” correctly joins the first and second sentences by indicating a relationship, rather than a contrast, between the two. In the second part of the sentence, the conjunction “but” adds additional emphasis to the fact that while tourists will be allowed to visit the space station, the cost of the trip will likely prohibit most people from visiting.</p><p>C. Incorrect. Although the option combines the sentences in a way that accurately reflects the meaning of each individual sentence, the combined sentence is a string of clauses that do not effectively cohere. Because it is poorly structured, the combined sentence does not clarify the relationship of ideas as effectively as the correct response does. Compared with the correct response, the combined sentence in this option is also imprecise and unnecessarily wordy.</p><p>D. Incorrect. The combination of the sentences creates an illogical relationship between ideas with the statement that tourists will be allowed to visit the space station because the cost is $52–$58 million round trip. The connection between the idea that “tourists will soon be allowed to pay for visits” and the subsequent “therefore few people will be able to take advantage of the opportunity” is also illogical.</p>",
    "points": 1,
    "prompt": "What is the best way to combine these sentences to clarify the relationship between ideas?\n\n(1) The International Space Station has been inhabited by crew members since 2000. (2) Tourists will soon be allowed to pay for visits to the space station. (3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.",
    "promptHtml": "<p>What is the <strong>best </strong>way to combine these sentences to clarify the relationship between ideas?</p><blockquote data-boxed=\"true\">(1) The International Space Station has been inhabited by crew members since 2000.<br>(2) Tourists will soon be allowed to pay for visits to the space station.<br>(3) Because the cost is $52–$58 million round trip, few people will be able to take advantage of the opportunity to have a vacation in outer space.</blockquote>",
    "topic": "",
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
      ]
    },
    "explanation": "The question asks for the identification of the sentence that has an error in its construction and\n\nshould be revised.\n\nA. Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things. B. CORRECT. Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.” C. Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence. D. Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.",
    "explanationHtml": "<p><strong>2. </strong>The question asks for the identification of the sentence that has an error in its construction and</p><p>should be revised.</p><p><strong>A. </strong>Incorrect. There are no errors in the structure of sentence 1. The clause “who played in the Long Island area at the time” correctly modifies the noun “New York Nets.” “Who” is the correct relative pronoun to serve as the subject of the modifying clause because it refers to people rather than objects or things. <strong>B. CORRECT. </strong>Sentence 2 contains a structural error. The current placement of the clause “where the team played for thirty-five seasons” suggests that the clause is modifying the term “financial troubles,” which is illogical. The clause “where the team played for thirty-five seasons” should immediately follow the location, “New Jersey.” A revised version of the sentence might read, “After the team had financial troubles, the owner of the Nets decided to take the team to New Jersey, where the team played for thirty-five seasons.” <strong>C. </strong>Incorrect. There are no errors in the structure of sentence 3. The phrase “including two appearances in the NBA finals” is a nonrestrictive phrase that provides further detail about the team’s “sixteen playoff appearances.” The phrase is set off by a comma because it is not essential to understanding the meaning of the sentence. <strong>D. </strong>Incorrect. There are no errors in the structure of sentence 4. The clause “where the team now plays under the name the Brooklyn Nets” is a nonrestrictive clause that provides further detail about the team after its move back to New York in 2012. The clause is set off by a comma because it is not essential to understanding the meaning of the sentence.</p>",
    "points": 1,
    "prompt": "Which sentence contains an error in its construction and should be revised?\n\n(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time. (2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons. (3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals. (4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.",
    "promptHtml": "<p>Which sentence contains an error in its construction and should be revised?</p><blockquote data-boxed=\"true\">(1) In 1976, the National Basketball Association (NBA) absorbed several teams of the American Basketball Association (ABA), including the New York Nets, who played in the Long Island area at the time.<br>(2) The owner of the Nets decided to take the team to New Jersey after the team had financial troubles, where the team played for thirty-five seasons.<br>(3) The New Jersey Nets had sixteen playoff appearances, including two appearances in the NBA finals.<br>(4) In 2012, the team changed ownership and returned to New York, where the team now plays under the name the Brooklyn Nets.</blockquote>",
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
      ]
    },
    "explanation": "The question asks for the revision of the sentence that uses the most precise language.\n\nA. Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking). B. Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million). C. CORRECT. The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence. D. Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).",
    "explanationHtml": "<p><strong>3. </strong>The question asks for the revision of the sentence that uses the <strong>most </strong>precise language.</p><p><strong>A. </strong>Incorrect. The word “extremely” does not specify the precise length of the trail (2,200 miles); “millions” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking). <strong>B. </strong>Incorrect. While the revision specifies the precise length of the trail and the verb “hike” precisely describes the purpose of visiting the trail, “more than a million” is less precise than the specific number of people who hike the trail each year (two million). <strong>C. CORRECT. </strong>The length of the trail (2,200 miles), the specific number of people who hike the trail each year (two million), and the action of the visitors (hiking) are clear and precise in this revision of the sentence. <strong>D. </strong>Incorrect. The word “lengthy” is less precise than specifying the actual length of the trail (2,200 miles); “a couple million” is less precise than the specific number of people who hike the trail each year (two million); and the verb “do” imprecisely describes the purpose of visiting the trail (hiking).</p>",
    "points": 1,
    "prompt": "Read this sentence.\n\nThe Appalachian Trail is a really long trail that a lot of people do each year.\n\nWhich revision of the sentence uses the most precise language?",
    "promptHtml": "<p>Read this sentence.</p><blockquote data-boxed=\"true\">The Appalachian Trail is a really long trail that a lot of people do each year.</blockquote><p>Which revision of the sentence uses the <strong>most </strong>precise language?</p>",
    "topic": "",
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
      ]
    },
    "explanation": "The question asks for the pair of revisions needed to correct the errors in the paragraph, which\n\nappear in sentence 2 and sentence 3.\n\nA. Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. The only edit needed in this pair is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” B. Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.” C. CORRECT. This option is the only choice that revises the errors in both sentence 2 and sentence 3. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” A comma is necessary because the phrase is a nonrestrictive clause: the phrase provides extra information about Cleo and Noah McVicker’s line of work, but the phrase is not necessary in order to understand the meaning of the sentence. The second error is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” D. Incorrect. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.”",
    "explanationHtml": "<p><strong>4. </strong>The question asks for the pair of revisions needed to correct the errors in the paragraph, which</p><p>appear in sentence 2 and sentence 3.</p><p><strong>A. </strong>Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. The only edit needed in this pair is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” <strong>B. </strong>Incorrect. The comma after the word “homes” in sentence 1 is necessary for separating the subordinate clause “When coal was used to heat homes” from the main clause. In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.” <strong>C. CORRECT. </strong>This option is the only choice that revises the errors in both sentence 2 and sentence 3. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” A comma is necessary because the phrase is a nonrestrictive clause: the phrase provides extra information about Cleo and Noah McVicker’s line of work, but the phrase is not necessary in order to understand the meaning of the sentence. The second error is in sentence 3, which incorrectly shifts the verb into the present tense. The clause “as natural gas becomes more common” should be “as natural gas became more common.” <strong>D. </strong>Incorrect. In sentence 2, a comma needs to follow the word “company” to set off the phrase “who owned a cleaning product company.” In sentence 4, the word “remarketed” is in the past tense established in the paragraph and should not change to the past perfect tense “had remarketed.”</p>",
    "points": 1,
    "prompt": "Which pair of revisions need to be made in this paragraph?\n\n(1) When coal was used to heat homes, it frequently left soot stains on the walls. (2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot. (3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business. (4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.",
    "promptHtml": "<p>Which pair of revisions need to be made in this paragraph?</p><blockquote data-boxed=\"true\">(1) When coal was used to heat homes, it frequently left soot stains on the walls.<br>(2) Brothers Cleo and Noah McVicker, who owned a cleaning product company created a doughy substance to help people remove this soot.<br>(3) Over time, as natural gas becomes more common, people had little need for soot cleansers, and the McVickers’ family company struggled to stay in business.<br>(4) Then one day Joe McVicker, Cleo’s son, learned that his sister-in-law had been using the substance for art projects in her classroom, so he remarketed the product as the toy known today as Play-Doh.</blockquote>",
    "topic": "",
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
    return studentQuestion;
  });
}
