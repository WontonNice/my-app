import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage320172018FormAPassageText = "When you eat an orange, your experience of its flavor comes from the combination of its aroma and its taste. Taste buds, the sensory receptors on the tongue, convey information to the brain about chemicals in food while the food dissolves in saliva. The sense of smell comes into play when the olfactory nerve in the nasal passages senses even very low concentrations of food chemicals in gaseous form. The sense of smell has a larger role in tasting flavors than most people realize— that is, until they have a stuffy nose and nothing tastes good.\n\nIf taste and smell depend on our detection of food chemicals, one might expect that chemists would be able to duplicate the flavors of foods. In fact, a surprising number of popular food flavors can now be reproduced in the laboratory, and even more are on the way. Orange, perhaps the most popular flavor worldwide, has been reproduced successfully. So have some national favorites, including cashew (Latin America), paprika (Hungary), and fruit-flavored Jamaica (Mexico). Synthetic flavors are not limited to flavoring food; they are also added to mouthwashes, toothpastes, beverages, and other consumer products.\n\nOnly a small proportion of the chemical components occurring naturally in foods actually contributes to their flavor. To identify these critical components, scientists use a gas chromatograph to separate a food into its basic chemical constituents. Flavor experts, called flavorists, then attempt to isolate those chemicals that are essential to the distinctive flavor of a food. Mechanical techniques have been developed to capture the aromas of food as it is being prepared— such as the smell of baking bread—and distill the essential chemicals from these essences. Flavorists use their highly developed senses of taste and smell to attempt to produce acceptable flavorings that are chemically identical to, but purer than, flavors that are naturally present in unprocessed food.\n\nAlthough American consumers claim to want “natural” flavors in their food, taste tests demonstrate that they often prefer their synthetically produced counterparts. Artificial flavors tend to be stronger and less subtle than natural flavors. For example, many Americans prefer a soft drink created with artificial flavors, such as orange soda, over an “all-natural” soda flavored with real oranges, which may taste weak in comparison. In fact, some flavorists worry that consumers will develop such a strong taste for artificial flavors that natural flavorings, usually more expensive than their artificial counterparts, will become scarce.\n\nResearchers have not always been successful in their efforts to duplicate natural flavors. Some popular flavors, such as coffee, strawberry, and chocolate, have proven virtually impossible to reproduce. The difficulty in creating a flavor like chocolate, experts say, is its complexity—a mysterious combination of sweet and bitter that excites the taste buds in an unusual and satisfying way.";

const readingPassage320172018FormAQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q034",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "34",
      "pages": [
        15
      ]
    },
    "explanation": "34. (G) Option E and Option F are too specific: the passage mentions some scientific aspects of taste and smell, but it concentrates on the development of flavors. Option H is mentioned in only the last paragraph. Option G is a good summary of the passage. It incorporates the main topics—the scientific analysis of flavors and how flavors are created.",
    "explanationHtml": "<p>34. (G) Option E and Option F are too specific: the passage mentions some scientific aspects of taste and smell, but it concentrates on the development of flavors. Option H is mentioned in only the last paragraph. Option G is a good summary of the passage. It incorporates the main topics—the scientific analysis of flavors and how flavors are created.</p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the relationship between smell and taste</p>",
        "text": "the relationship between smell and taste"
      },
      {
        "id": "B",
        "html": "<p>the science of how taste buds work</p>",
        "text": "the science of how taste buds work"
      },
      {
        "id": "C",
        "html": "<p>the analysis and creation of flavors</p>",
        "text": "the analysis and creation of flavors"
      },
      {
        "id": "D",
        "html": "<p>the difficulty of producing artificial flavors</p>",
        "text": "the difficulty of producing artificial flavors"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q035",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "35",
      "pages": [
        15
      ]
    },
    "explanation": "35. (C) The third paragraph describes a technique for separating a food into its basic chemical constituents. Option C best summarizes the goal of this research. Option A and Option D are not supported by the passage as goals of the research. Option B is incorrect because the goal of the research is to capture and reproduce the flavor, not to develop food.",
    "explanationHtml": "<p>35. (C) The third paragraph describes a technique for separating a food into its basic chemical constituents. Option C best summarizes the goal of this research. Option A and Option D are not supported by the passage as goals of the research. Option B is incorrect because the goal of the research is to capture and reproduce the flavor, not to develop food.</p>",
    "points": 1,
    "prompt": "What is the principal goal of the scientific research described in the third paragraph?",
    "promptHtml": "<p>What is the principal goal of the scientific research described in the third paragraph?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to predict consumer taste preferences in food</p>",
        "text": "to predict consumer taste preferences in food"
      },
      {
        "id": "B",
        "html": "<p>to develop food with strong flavors</p>",
        "text": "to develop food with strong flavors"
      },
      {
        "id": "C",
        "html": "<p>to produce synthetic equivalents of natural food flavors</p>",
        "text": "to produce synthetic equivalents of natural food flavors"
      },
      {
        "id": "D",
        "html": "<p>to improve the natural flavors in unprocessed food</p>",
        "text": "to improve the natural flavors in unprocessed food"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q036",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "36",
      "pages": [
        15
      ]
    },
    "explanation": "36. (F) The process of collecting aromas during food preparation is described in the third paragraph. Option E is not supported because the process of capturing aromas has been successful and only certain flavors present difficulties. The idea that most people cannot tell the difference between natural and synthetic flavors (Option G) is not a conclusion that can be made from the collection of aromas during food preparation. Option H is incorrect because aromas are collected during the cooking process to isolate essential chemicals that make up flavor (lines 35–37), not to enhance the natural flavor. Option F is the best answer: the aroma of food as it is being prepared can be captured and distilled to synthesize the food’s flavor (lines 35–41).",
    "explanationHtml": "<p>36. (F) The process of collecting aromas during food preparation is described in the third paragraph. Option E is not supported because the process of capturing aromas has been successful and only certain flavors present difficulties. The idea that most people cannot tell the difference between natural and synthetic flavors (Option G) is not a conclusion that can be made from the collection of aromas during food preparation. Option H is incorrect because aromas are collected during the cooking process to isolate essential chemicals that make up flavor (lines 35–37), not to enhance the natural flavor. Option F is the best answer: the aroma of food as it is being prepared can be captured and distilled to synthesize the food’s flavor (lines 35–41).</p>",
    "points": 1,
    "prompt": "Which of the following can be concluded from the collection of aromas during food preparation?",
    "promptHtml": "<p>Which of the following can be concluded from the collection of aromas during food preparation?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Creating artificial flavors from captured aromas is a difficult process.</p>",
        "text": "Creating artificial flavors from captured aromas is a difficult process."
      },
      {
        "id": "B",
        "html": "<p>Certain chemical components of a food’s flavor are present in its aroma.</p>",
        "text": "Certain chemical components of a food’s flavor are present in its aroma."
      },
      {
        "id": "C",
        "html": "<p>Most people cannot tell the difference between natural flavors and artificial flavors.</p>",
        "text": "Most people cannot tell the difference between natural flavors and artificial flavors."
      },
      {
        "id": "D",
        "html": "<p>The natural flavor of a food is usually enhanced during the cooking process.</p>",
        "text": "The natural flavor of a food is usually enhanced during the cooking process."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q037",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "37",
      "pages": [
        15
      ]
    },
    "explanation": "37. (C) Orange soda is mentioned in lines 52–57 to provide an example of a product that uses a synthetic flavor that some consumers prefer to its natural counterpart (Option C). The idea that consumer preferences for artificial or natural flavors vary could be true, but this is not suggested by the author’s discussion of one flavor (orange soda), ruling out Option A. Option B is incorrect because even though the passage states that natural flavors may be more expensive than artificial flavors, the author does not use the details about orange soda to make this point. The author states that some natural flavors may become scarce in the future (lines 59–61), but this is not exemplified by the discussion of orange soda in lines 52–57, ruling out Option D.",
    "explanationHtml": "<p>37. (C) Orange soda is mentioned in lines 52–57 to provide an example of a product that uses a synthetic flavor that some consumers prefer to its natural counterpart (Option C). The idea that consumer preferences for artificial or natural flavors vary could be true, but this is not suggested by the author’s discussion of one flavor (orange soda), ruling out Option A. Option B is incorrect because even though the passage states that natural flavors may be more expensive than artificial flavors, the author does not use the details about orange soda to make this point. The author states that some natural flavors may become scarce in the future (lines 59–61), but this is not exemplified by the discussion of orange soda in lines 52–57, ruling out Option D.</p>",
    "points": 1,
    "prompt": "Why does the author mention orange soda in the fourth paragraph?",
    "promptHtml": "<p>Why does the author mention orange soda in the fourth paragraph?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to suggest that consumer preferences for natural or artificial flavors vary</p>",
        "text": "to suggest that consumer preferences for natural or artificial flavors vary"
      },
      {
        "id": "B",
        "html": "<p>to explain why natural flavors are more expensive than artificial substitutes</p>",
        "text": "to explain why natural flavors are more expensive than artificial substitutes"
      },
      {
        "id": "C",
        "html": "<p>to demonstrate that consumers sometimes prefer artificial flavors to natural flavors</p>",
        "text": "to demonstrate that consumers sometimes prefer artificial flavors to natural flavors"
      },
      {
        "id": "D",
        "html": "<p>to give an example of a natural flavor that may become difficult to find in the future</p>",
        "text": "to give an example of a natural flavor that may become difficult to find in the future"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q038",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "38",
      "pages": [
        15
      ]
    },
    "explanation": "38. (F) The author describes the role of the sense of smell to highlight that the aroma of a flavor, in addition to its taste, influences how a person experiences a flavor, as evidenced in lines 10–11 (“The sense of smell has a larger role in tasting flavors than most people realize”). This is best stated in Option F. Option E reflects the idea in lines 8–10, but the idea that it is easier for people to smell an aroma than to taste its flavor is not why the author includes the description about how smell impacts taste. Option G and Option H present inaccurate ideas regarding synthetic flavors and fail to explain why the author describes the role of the sense of smell at the beginning of the passage.",
    "explanationHtml": "<p>38. (F) The author describes the role of the sense of smell to highlight that the aroma of a flavor, in addition to its taste, influences how a person experiences a flavor, as evidenced in lines 10–11 (“The sense of smell has a larger role in tasting flavors than most people realize”). This is best stated in Option F. Option E reflects the idea in lines 8–10, but the idea that it is easier for people to smell an aroma than to taste its flavor is not why the author includes the description about how smell impacts taste. Option G and Option H present inaccurate ideas regarding synthetic flavors and fail to explain why the author describes the role of the sense of smell at the beginning of the passage.</p>",
    "points": 1,
    "prompt": "The author describes the role that the sense of smell plays when experiencing a flavor (lines 6–13) in order to",
    "promptHtml": "<p>The author describes the role that the sense of smell plays when experiencing a flavor (lines 6–13) in order to</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>emphasize that it is easier for a person to sense the aroma of a flavor than its taste.</p>",
        "text": "emphasize that it is easier for a person to sense the aroma of a flavor than its taste."
      },
      {
        "id": "B",
        "html": "<p>highlight that the aroma of a flavor influences how a person perceives its taste.</p>",
        "text": "highlight that the aroma of a flavor influences how a person perceives its taste."
      },
      {
        "id": "C",
        "html": "<p>emphasize that synthetic flavors need to have both an aroma and a taste.</p>",
        "text": "emphasize that synthetic flavors need to have both an aroma and a taste."
      },
      {
        "id": "D",
        "html": "<p>highlight that synthetic flavors tend to have a stronger aroma than taste.</p>",
        "text": "highlight that synthetic flavors tend to have a stronger aroma than taste."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-3-2017-2018-form-a-pdf-shsat-2017-2018-a-q039",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-a",
      "label": "2017-2018 Form A",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf",
      "year": "2017-2018",
      "form": "A",
      "sourceQuestion": "39",
      "pages": [
        15
      ]
    },
    "explanation": "39. (D) The author describes the uses of synthetic flavors in items such as “mouthwashes, toothpastes, beverages” (lines 26–27) to demonstrate that synthetic flavors are found in many everyday household products. This is best stated in Option D. Option A may seem like an attractive option because the list of everyday items with synthetic flavors could give the impression that creating synthetic flavors is easy; however, while some synthetic flavors have\n\nbeen successfully created (lines 17–20), efforts to duplicate other flavors have been unsuccessful (lines 62–71), ruling out Option A. The idea that the same synthetic flavor is used in many items (Option B) and the idea that synthetic flavors are healthier than natural flavors (Option C) cannot be concluded from the list of common products that use synthetic flavors in lines 26–28.",
    "explanationHtml": "<p>39. (D) The author describes the uses of synthetic flavors in items such as “mouthwashes, toothpastes, beverages” (lines 26–27) to demonstrate that synthetic flavors are found in many everyday household products. This is best stated in Option D. Option A may seem like an attractive option because the list of everyday items with synthetic flavors could give the impression that creating synthetic flavors is easy; however, while some synthetic flavors have</p><p>been successfully created (lines 17–20), efforts to duplicate other flavors have been unsuccessful (lines 62–71), ruling out Option A. The idea that the same synthetic flavor is used in many items (Option B) and the idea that synthetic flavors are healthier than natural flavors (Option C) cannot be concluded from the list of common products that use synthetic flavors in lines 26–28.</p>",
    "points": 1,
    "prompt": "The author includes details about the uses for synthetic flavors in lines 25–28 in order to",
    "promptHtml": "<p>The author includes details about the uses for synthetic flavors in lines 25–28 in order to</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>show that synthetic flavors are easy to create.</p>",
        "text": "show that synthetic flavors are easy to create."
      },
      {
        "id": "B",
        "html": "<p>demonstrate that many items are made with the same synthetic flavor.</p>",
        "text": "demonstrate that many items are made with the same synthetic flavor."
      },
      {
        "id": "C",
        "html": "<p>suggest that synthetic flavors are healthier than natural flavors.</p>",
        "text": "suggest that synthetic flavors are healthier than natural flavors."
      },
      {
        "id": "D",
        "html": "<p>highlight that synthetic flavors are found in a variety of everyday items.</p>",
        "text": "highlight that synthetic flavors are found in a variety of everyday items."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const readingPassage320172018FormAPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-3-2017-2018-form-a",
  versionLabels: ["2017-2018 Form A"],
  label: "2017-2018 Form A",
  section: "reading",
  questionCount: readingPassage320172018FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-3-2017-2018-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 3",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-a","label":"2017-2018 Form A","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_a.pdf","year":"2017-2018","form":"A","packageId":"c0a54dc58dec79dd9b6d1651e86056e9e8f83bd6f03529e747c79d3391bed025"},
    title: "Reading Passage 3",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">When you eat an orange, your experience of its flavor comes from the combination of its aroma and its taste. Taste buds, the sensory receptors on the tongue, convey information <sup>5</sup> to the brain about chemicals in food while the food dissolves in saliva. The sense of smell comes into play when the olfactory nerve in the nasal passages senses even very low concentrations of food chemicals in gaseous <sup>10</sup> form. The sense of smell has a larger role in tasting flavors than most people realize— that is, until they have a stuffy nose and nothing tastes good.</p><p data-numbered=\"false\">If taste and smell depend on our detection of <sup>15</sup> food chemicals, one might expect that chemists would be able to duplicate the flavors of foods. In fact, a surprising number of popular food flavors can now be reproduced in the laboratory, and even more are on the <sup>20</sup> way. Orange, perhaps the most popular flavor worldwide, has been reproduced successfully. So have some national favorites, including cashew (Latin America), paprika (Hungary), and fruit-flavored Jamaica (Mexico). <sup>25</sup> Synthetic flavors are not limited to flavoring food; they are also added to mouthwashes, toothpastes, beverages, and other consumer products.</p><p data-numbered=\"false\">Only a small proportion of the chemical <sup>30</sup> components occurring naturally in foods actually contributes to their flavor. To identify these critical components, scientists use a gas chromatograph to separate a food into its basic chemical constituents. Flavor <sup>35</sup> experts, called flavorists, then attempt to isolate those chemicals that are essential to the distinctive flavor of a food. Mechanical techniques have been developed to capture the aromas of food as it is being prepared— <sup>40</sup> such as the smell of baking bread—and distill the essential chemicals from these essences. Flavorists use their highly developed senses of taste and smell to attempt to produce acceptable flavorings that are chemically <sup>45</sup> identical to, but purer than, flavors that are naturally present in unprocessed food.</p><p data-numbered=\"false\">Although American consumers claim to want “natural” flavors in their food, taste tests demonstrate that they often prefer their <sup>50</sup> synthetically produced counterparts. Artificial flavors tend to be stronger and less subtle than natural flavors. For example, many Americans prefer a soft drink created with artificial flavors, such as orange soda, <sup>55</sup> over an “all-natural” soda flavored with real oranges, which may taste weak in comparison. In fact, some flavorists worry that consumers will develop such a strong taste for artificial flavors that natural <sup>60</sup> flavorings, usually more expensive than their artificial counterparts, will become scarce.</p><p data-numbered=\"false\">Researchers have not always been successful in their efforts to duplicate natural flavors. Some popular flavors, such as coffee, <sup>65</sup> strawberry, and chocolate, have proven virtually impossible to reproduce. The difficulty in creating a flavor like chocolate, experts say, is its complexity—a mysterious combination of sweet and bitter that excites <sup>70</sup> the taste buds in an unusual and satisfying way.</p>",
    text: readingPassage320172018FormAPassageText,
    versionLabel: "2017-2018 Form A",
  }),
  questions: readingPassage320172018FormAQuestions,
};
