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
    "type": "multiple_choice"
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
    "type": "multiple_choice"
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
