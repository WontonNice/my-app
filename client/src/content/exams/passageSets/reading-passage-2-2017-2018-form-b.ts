import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const readingPassage220172018FormBPassageText = "If you have ever watched someone fall on the ice, you’ve seen slipperiness at work. But have you wondered what makes ice slippery, or why skates or skis glide across ice so easily? The answer might seem obvious: ice is smooth. Yet smoothness in itself does not explain slipperiness. Imagine, for example, skating on a smooth surface of glass or sheet metal.\n\nSurprisingly, scientists do not fully understand why ice is slippery. Past explanations of slipperiness have focused on friction and pressure. According to the friction theory, a skate blade rubs across the ice, causing friction. The friction produces heat, melting the ice and creating a slippery, microscopically thin layer of water for the skate to glide on. The friction theory, however, cannot explain why ice is slippery even when someone stands completely motionless, creating no friction.\n\nThe pressure theory claims that pressure from a skate blade melts the ice surface, creating a slippery layer of water. The water refreezes when the pressure is lifted. Science textbooks typically cite this explanation, but many scientists disagree, claiming that the pressure effect is not great enough to melt the ice. Nor can the pressure theory explain why someone wearing flat-bottomed shoes— which have a greater surface area than skate blades and thus exert less pressure per square inch—can glide across the ice or even go sprawling.\n\nDuring the 1990s, another theory found acceptance: the thin top layer of ice is liquid, or liquid-like, regardless of friction or pressure. This notion was first proposed more than 150 years ago by physicist Michael Faraday. Faraday’s simple experiment illustrates this property: two ice cubes held against each other will fuse together. This happens, Faraday explained, because liquid on the cubes’ surfaces freezes solid when the surfaces make contact.\n\nFaraday’s hypothesis was overlooked, in part because scientists did not have the means to detect molecular structures. However, technological advances during recent decades have allowed scientists to measure the thin layer on the surface of ice. For example, in 1996, a chemist at Lawrence Berkeley Laboratory shot electrons at an ice surface and recorded how they rebounded. The data suggested that the ice surface remained liquid-like, even at temperatures far below freezing. Scientists speculate that water molecules on the ice surface are always in motion because there is nothing above them to hold them in place. The vibration creates a slippery layer of molecules. According to this interpretation of the Lawrence Berkeley Laboratory experiments, the molecules move only up and down; if they also moved side to side, they would constitute a true liquid. Thus it could be said that people are skating on wildly vibrating molecules!\n\nThe phenomenon of a slippery, liquid-like surface is not limited to ice, although ice is the most common example. Lead crystals and even diamond crystals, which are made of carbon, also show this property under certain temperature and pressure conditions.";

const readingPassage220172018FormBQuestions: ExamQuestion[] = [
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q027",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "27",
      "pages": [
        13
      ]
    },
    "explanation": "27. (B) The passage begins by asking why ice is slippery (lines 2–5) and then reviews several theories of slipperiness: smoothness, friction, pressure, and Faraday’s theory. Option B best states the topic of the passage. The circumstances that allow ice to melt (Option A), the discoveries of Michael Faraday (Option C), and the processes of freezing and melting (Option D) are details related to the theories of ice slipperiness, but they do not express the main idea of the passage.",
    "explanationHtml": "<p>27. (B) The passage begins by asking why ice is slippery (lines 2–5) and then reviews several theories of slipperiness: smoothness, friction, pressure, and Faraday’s theory. Option B best states the topic of the passage. The circumstances that allow ice to melt (Option A), the discoveries of Michael Faraday (Option C), and the processes of freezing and melting (Option D) are details related to the theories of ice slipperiness, but they do not express the main idea of the passage.</p>",
    "points": 1,
    "prompt": "Which of the following best tells what this passage is about?",
    "promptHtml": "<p>Which of the following best tells what this passage is about?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>the circumstances that allow ice to melt</p>",
        "text": "the circumstances that allow ice to melt"
      },
      {
        "id": "B",
        "html": "<p>the theories behind what makes ice slippery</p>",
        "text": "the theories behind what makes ice slippery"
      },
      {
        "id": "C",
        "html": "<p>the discoveries of Michael Faraday</p>",
        "text": "the discoveries of Michael Faraday"
      },
      {
        "id": "D",
        "html": "<p>the processes of freezing and melting</p>",
        "text": "the processes of freezing and melting"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q028",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "28",
      "pages": [
        13
      ]
    },
    "explanation": "28. (E) The most likely reason that the author mentions lead and diamond crystals (lines 70–71) is to illustrate that solids other than ice have slippery surfaces and indicate that other substances can contain this property under the right circumstances (lines 72−73). This is best stated in Option E. Option F cannot be correct, because these crystals are not made of frozen water. The properties of lead and diamond crystals are not related to Faraday’s theory, ruling out Option G. While lead and diamond crystals may demonstrate the slipperiness property under certain temperature and pressure conditions (Option H), the author does not list these substances in order to show the effects of temperature and pressure on their slipperiness.",
    "explanationHtml": "<p>28. (E) The most likely reason that the author mentions lead and diamond crystals (lines 70–71) is to illustrate that solids other than ice have slippery surfaces and indicate that other substances can contain this property under the right circumstances (lines 72−73). This is best stated in Option E. Option F cannot be correct, because these crystals are not made of frozen water. The properties of lead and diamond crystals are not related to Faraday’s theory, ruling out Option G. While lead and diamond crystals may demonstrate the slipperiness property under certain temperature and pressure conditions (Option H), the author does not list these substances in order to show the effects of temperature and pressure on their slipperiness.</p>",
    "points": 1,
    "prompt": "What is the most likely reason that the author mentions lead and diamond crystals in the last paragraph?",
    "promptHtml": "<p>What is the most likely reason that the author mentions lead and diamond crystals in the last paragraph?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to point out that solids other than ice have slippery surfaces</p>",
        "text": "to point out that solids other than ice have slippery surfaces"
      },
      {
        "id": "B",
        "html": "<p>to suggest that ice, lead, and diamonds are composed of the same materials</p>",
        "text": "to suggest that ice, lead, and diamonds are composed of the same materials"
      },
      {
        "id": "C",
        "html": "<p>to cast doubt on Faraday’s theory of slipperiness</p>",
        "text": "to cast doubt on Faraday’s theory of slipperiness"
      },
      {
        "id": "D",
        "html": "<p>to illustrate the effects of temperature and pressure on slipperiness</p>",
        "text": "to illustrate the effects of temperature and pressure on slipperiness"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q029",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "29",
      "pages": [
        13
      ]
    },
    "explanation": "29. (C) According to Faraday, the liquid on the ice cubes’ surfaces freezes solid when the surfaces make contact (lines 42–45). This information is restated in Option C. Option A is incorrect because Faraday’s explanation does not include the concept of friction. Neither the pressure theory, described in the third paragraph, nor Faraday’s theory, described in lines 35–42, support the idea that applied pressure forces ice cubes to stick together, ruling out Option B. Smoothness (Option D) was a discredited explanation for slipperiness, not for why two ice cubes fuse when held together.",
    "explanationHtml": "<p>29. (C) According to Faraday, the liquid on the ice cubes’ surfaces freezes solid when the surfaces make contact (lines 42–45). This information is restated in Option C. Option A is incorrect because Faraday’s explanation does not include the concept of friction. Neither the pressure theory, described in the third paragraph, nor Faraday’s theory, described in lines 35–42, support the idea that applied pressure forces ice cubes to stick together, ruling out Option B. Smoothness (Option D) was a discredited explanation for slipperiness, not for why two ice cubes fuse when held together.</p>",
    "points": 1,
    "prompt": "According to Faraday, why do two ice cubes fuse when held together?",
    "promptHtml": "<p>According to Faraday, why do two ice cubes fuse when held together?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>Friction causes the surfaces of the ice to melt and refreeze.</p>",
        "text": "Friction causes the surfaces of the ice to melt and refreeze."
      },
      {
        "id": "B",
        "html": "<p>The applied pressure forces the surfaces of the cubes to stick to each other.</p>",
        "text": "The applied pressure forces the surfaces of the cubes to stick to each other."
      },
      {
        "id": "C",
        "html": "<p>Liquid layers on the surfaces freeze together when the surfaces make contact.</p>",
        "text": "Liquid layers on the surfaces freeze together when the surfaces make contact."
      },
      {
        "id": "D",
        "html": "<p>The liquid layers on the surfaces of the ice are perfectly smooth.</p>",
        "text": "The liquid layers on the surfaces of the ice are perfectly smooth."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q030",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "30",
      "pages": [
        13
      ]
    },
    "explanation": "30. (E) The experiment at Lawrence Berkeley Laboratory is mentioned in lines 51–57. The author most likely mentions the experiment because the data provide evidence that the ice surface remains liquid-like, creating a slippery layer of molecules on the ice surface (Option E). In the past, studying ice molecules was impossible (lines 46−48), but the experiment at Lawrence Berkeley Laboratory does not indicate the difficulty of studying ice molecules presently, ruling out Option F. Option G is incorrect because the experiment described in the fifth paragraph did lead to the conclusion that the molecules vibrated only up and down (lines 63−64). Ice cubes freezing together refers to Faraday’s observations in lines 41−42 (Option H), but the experiment at the lab in 1996 is included to present observations about ice on a molecular level.",
    "explanationHtml": "<p>30. (E) The experiment at Lawrence Berkeley Laboratory is mentioned in lines 51–57. The author most likely mentions the experiment because the data provide evidence that the ice surface remains liquid-like, creating a slippery layer of molecules on the ice surface (Option E). In the past, studying ice molecules was impossible (lines 46−48), but the experiment at Lawrence Berkeley Laboratory does not indicate the difficulty of studying ice molecules presently, ruling out Option F. Option G is incorrect because the experiment described in the fifth paragraph did lead to the conclusion that the molecules vibrated only up and down (lines 63−64). Ice cubes freezing together refers to Faraday’s observations in lines 41−42 (Option H), but the experiment at the lab in 1996 is included to present observations about ice on a molecular level.</p>",
    "points": 1,
    "prompt": "What is the most likely reason that the author mentions the 1996 experiment at Lawrence Berkeley Laboratory?",
    "promptHtml": "<p>What is the most likely reason that the author mentions the 1996 experiment at Lawrence Berkeley Laboratory?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>to provide evidence about the surface of ice</p>",
        "text": "to provide evidence about the surface of ice"
      },
      {
        "id": "B",
        "html": "<p>to illustrate that studying ice molecules is difficult</p>",
        "text": "to illustrate that studying ice molecules is difficult"
      },
      {
        "id": "C",
        "html": "<p>to show how experiments on ice are inconclusive</p>",
        "text": "to show how experiments on ice are inconclusive"
      },
      {
        "id": "D",
        "html": "<p>to explain why ice cubes freeze together</p>",
        "text": "to explain why ice cubes freeze together"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q031",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "31",
      "pages": [
        13
      ]
    },
    "explanation": "31. (B) The distinction between the two terms is made in lines 63–65. The surface of ice is liquid-like because the surface molecules move only up and down, which is Option B. Option A describes the results of the experiment, not the ice surface itself. The passage does not state that the liquid-like state is related to temperature (Option C) or pressure (Option D).",
    "explanationHtml": "<p>31. (B) The distinction between the two terms is made in lines 63–65. The surface of ice is liquid-like because the surface molecules move only up and down, which is Option B. Option A describes the results of the experiment, not the ice surface itself. The passage does not state that the liquid-like state is related to temperature (Option C) or pressure (Option D).</p>",
    "points": 1,
    "prompt": "According to researchers at the Lawrence Berkeley Laboratory, why is the surface of ice liquid-like rather than a true liquid?",
    "promptHtml": "<p>According to researchers at the Lawrence Berkeley Laboratory, why is the surface of ice liquid-like rather than a true liquid?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>because electrons rebound from the ice surface</p>",
        "text": "because electrons rebound from the ice surface"
      },
      {
        "id": "B",
        "html": "<p>because the ice surface molecules vibrate only up and down</p>",
        "text": "because the ice surface molecules vibrate only up and down"
      },
      {
        "id": "C",
        "html": "<p>because the ice surface is a different temperature</p>",
        "text": "because the ice surface is a different temperature"
      },
      {
        "id": "D",
        "html": "<p>because the ice surface is under pressure</p>",
        "text": "because the ice surface is under pressure"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q032",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "32",
      "pages": [
        13
      ]
    },
    "explanation": "32. (H) The friction theory of slipperiness is explained in the second paragraph, which concludes that the theory cannot explain why ice is slippery for someone who stands motionless, essentially creating no friction. Something that a theory cannot explain can be said to weaken, or undermine, the theory. Option H, “a person slipping while standing immobile on an icy surface,” is the best answer. Option E undermines the pressure theory, not the friction theory. Option F and Option G neither support nor undermine the friction theory.",
    "explanationHtml": "<p>32. (H) The friction theory of slipperiness is explained in the second paragraph, which concludes that the theory cannot explain why ice is slippery for someone who stands motionless, essentially creating no friction. Something that a theory cannot explain can be said to weaken, or undermine, the theory. Option H, “a person slipping while standing immobile on an icy surface,” is the best answer. Option E undermines the pressure theory, not the friction theory. Option F and Option G neither support nor undermine the friction theory.</p>",
    "points": 1,
    "prompt": "According to the passage, which of the following undermines the friction theory of slipperiness?",
    "promptHtml": "<p>According to the passage, which of the following undermines the friction theory of slipperiness?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>a person wearing flat-bottomed shoes gliding across an icy surface</p>",
        "text": "a person wearing flat-bottomed shoes gliding across an icy surface"
      },
      {
        "id": "B",
        "html": "<p>two ice cubes fusing together</p>",
        "text": "two ice cubes fusing together"
      },
      {
        "id": "C",
        "html": "<p>electrons bouncing off the surface of ice</p>",
        "text": "electrons bouncing off the surface of ice"
      },
      {
        "id": "D",
        "html": "<p>a person sliding while standing immobile on an icy surface</p>",
        "text": "a person sliding while standing immobile on an icy surface"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "reading-passage-2-2017-2018-form-b-pdf-shsat-2017-2018-b-q033",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2017-2018-form-b",
      "label": "2017-2018 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf",
      "year": "2017-2018",
      "form": "B",
      "sourceQuestion": "33",
      "pages": [
        13
      ]
    },
    "explanation": "33. (A) The author includes the information about the pressure theory to highlight that there are different perspectives on the validity of the pressure theory between what is presented in textbooks and what researchers believe to be true (lines 25−29). This is best stated in Option A. Option B is incorrect because the liquid-like theory, not the pressure theory, has gained more acceptance recently. Even if scientists have tested the pressure theory (Option C), the pressure theory still raises questions about why ice is still slippery when less pressure is applied (lines 29−34). There is scientific support for a plausible theory (Option D), but that support is for Faraday’s theory, not the pressure theory.",
    "explanationHtml": "<p>33. (A) The author includes the information about the pressure theory to highlight that there are different perspectives on the validity of the pressure theory between what is presented in textbooks and what researchers believe to be true (lines 25−29). This is best stated in Option A. Option B is incorrect because the liquid-like theory, not the pressure theory, has gained more acceptance recently. Even if scientists have tested the pressure theory (Option C), the pressure theory still raises questions about why ice is still slippery when less pressure is applied (lines 29−34). There is scientific support for a plausible theory (Option D), but that support is for Faraday’s theory, not the pressure theory.</p>",
    "points": 1,
    "prompt": "The author includes details about the pressure theory in the third paragraph in order to",
    "promptHtml": "<p>The author includes details about the pressure theory in the third paragraph in order to</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>highlight that there are different ideas regarding this theory about the slipperiness of ice.</p>",
        "text": "highlight that there are different ideas regarding this theory about the slipperiness of ice."
      },
      {
        "id": "B",
        "html": "<p>describe the most recently accepted theory for the slipperiness of ice.</p>",
        "text": "describe the most recently accepted theory for the slipperiness of ice."
      },
      {
        "id": "C",
        "html": "<p>emphasize that this theory has been tested by scientists who study the slipperiness of ice.</p>",
        "text": "emphasize that this theory has been tested by scientists who study the slipperiness of ice."
      },
      {
        "id": "D",
        "html": "<p>show that there is scientific support for a plausible theory about the slipperiness of ice.</p>",
        "text": "show that there is scientific support for a plausible theory about the slipperiness of ice."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  }
];

export const readingPassage220172018FormBPassageSet: ExamPassageSet = {
  id: "ela-reading-passage-2-2017-2018-form-b",
  versionLabels: ["2017-2018 Form B"],
  label: "2017-2018 Form B",
  section: "reading",
  questionCount: readingPassage220172018FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "reading-passage-2-2017-2018-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Reading Passage 2",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2017-2018-form-b","label":"2017-2018 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20172018_form_b.pdf","year":"2017-2018","form":"B","packageId":"7a2d7d6a39d44530af4a2496c5862d1dc01b2a3c74dd33b4699a5e02d444e0a3"},
    title: "Reading Passage 2",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"false\">If you have ever watched someone fall on the ice, you’ve seen slipperiness at work. But have you wondered what makes ice slippery, or why skates or skis glide across ice so <sup>5</sup> easily? The answer might seem obvious: ice is smooth. Yet smoothness in itself does not explain slipperiness. Imagine, for example, skating on a smooth surface of glass or sheet metal.</p><p data-numbered=\"false\"><sup>10</sup> Surprisingly, scientists do not fully understand why ice is slippery. Past explanations of slipperiness have focused on friction and pressure. According to the friction theory, a skate blade rubs across the <sup>15</sup> ice, causing friction. The friction produces heat, melting the ice and creating a slippery, microscopically thin layer of water for the skate to glide on. The friction theory, however, cannot explain why ice is slippery even when <sup>20</sup> someone stands completely motionless, creating no friction.</p><p data-numbered=\"false\">The pressure theory claims that pressure from a skate blade melts the ice surface, creating a slippery layer of water. The water <sup>25</sup> refreezes when the pressure is lifted. Science textbooks typically cite this explanation, but many scientists disagree, claiming that the pressure effect is not great enough to melt the ice. Nor can the pressure theory explain <sup>30</sup> why someone wearing flat-bottomed shoes— which have a greater surface area than skate blades and thus exert less pressure per square inch—can glide across the ice or even go sprawling.</p><p data-numbered=\"false\"><sup>35</sup> During the 1990s, another theory found acceptance: the thin top layer of ice is liquid, or liquid-like, regardless of friction or pressure. This notion was first proposed more than 150 years ago by physicist Michael <sup>40</sup> Faraday. Faraday’s simple experiment illustrates this property: two ice cubes held against each other will fuse together. This happens, Faraday explained, because liquid on the cubes’ surfaces freezes solid when the <sup>45</sup> surfaces make contact.</p><p data-numbered=\"false\">Faraday’s hypothesis was overlooked, in part because scientists did not have the means to detect molecular structures. However, technological advances during recent decades <sup>50</sup> have allowed scientists to measure the thin layer on the surface of ice. For example, in 1996, a chemist at Lawrence Berkeley Laboratory shot electrons at an ice surface and recorded how they rebounded. The data <sup>55</sup> suggested that the ice surface remained liquid-like, even at temperatures far below freezing. Scientists speculate that water molecules on the ice surface are always in motion because there is nothing above them <sup>60</sup> to hold them in place. The vibration creates a slippery layer of molecules. According to this interpretation of the Lawrence Berkeley Laboratory experiments, the molecules move only up and down; if they also moved side to <sup>65</sup> side, they would constitute a true liquid. Thus it could be said that people are skating on wildly vibrating molecules!</p><p data-numbered=\"false\">The phenomenon of a slippery, liquid-like surface is not limited to ice, although ice is <sup>70</sup> the most common example. Lead crystals and even diamond crystals, which are made of carbon, also show this property under certain temperature and pressure conditions.</p>",
    text: readingPassage220172018FormBPassageText,
    versionLabel: "2017-2018 Form B",
  }),
  questions: readingPassage220172018FormBQuestions,
};
