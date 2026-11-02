import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const wolvesOfTheSea20232024FormAPassageText = "1 The cool and misty landscape of the Great Bear Rainforest can be found along the coast of British Columbia, Canada, and its nearby islands, from Vancouver Island to the Alaskan border. Within this protected area, wolves roam the forests, islands, and beaches. When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves. He spoke with Chester Starr, an elder of the Heiltsuk Nation that has occupied the Great Bear Rainforest for thousands of years. What Starr had to say about the wolves changed Darimont’s perception of the animals.\n\n2 Starr asked Darimont which wolves he and his team were going to study—the timber wolves (mainland wolves) or the coastal wolves on the islands. The question took Darimont by surprise. Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland. Darimont was intrigued by Starr’s classification of the wolves as two different groups. At first, he was hesitant to accept the idea. The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland? To find out, Darimont and his research team studied the wolves on the islands and in the densely forested territory of the Great Bear Rainforest for ten years.\n\n3 Throughout the study, Darimont recorded several significant, observable differences between the “sea wolves,” as they are nicknamed, and the mainland wolves. Compared with the mainland wolves, the sea wolves are smaller in size and are strong swimmers. In 1996 sea wolves were spotted on an island nearly eight miles from any other land formation. While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish. Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water. Some salmon-eating mainland wolves come and go from the islands with the fish-spawning season, but the sea wolves are full-time island residents. Darimont suspects that some sea wolves live their entire life on the islands.\n\n4 The sea wolves displayed not only physical and behavioral differences but also genetic variations from the mainland wolves. After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves. A genetic marker is a variation in a DNA sequence that can be used to identify individuals or a species because it is passed down to offspring. Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves. Many years ago, loss of habitat and food sources forced some mainland wolves out to the islands. They learned to eat everything from kelp and fish eggs to the remains of sea creatures that washed up on the beach. Wolves living on the islands and mainland wolves became more isolated and rarely mated with each other. Over time the two types of wolves became more distinct.\n\n5 It turned out that Chester Starr was right all along. “It sounded totally bizarre at first,” admits Darimont, “that there could be two versions of the species.” But he now realizes that this skepticism “definitely reflected my ignorance of indigenous knowledge at the time.” Learning to trust the wisdom of the Heiltsuk people opened Darimont up to knowledge accumulated over millennia and positioned him so that he could gather new scientific evidence about one of British Columbia’s most elusive species, the sea wolf.";

const wolvesOfTheSea20232024FormAQuestions: ExamQuestion[] = [
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q052",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "52",
      "pages": [
        38
      ]
    },
    "explanation": "The question asks how the details about Darimont in paragraph 1 contribute to a central idea of\n\nthe passage.\n\nE. Incorrect. Although paragraph 1 includes the detail that the Great Bear Rainforest is a protected area, finding an ideal location to study wolves is not a central idea of the passage. Additionally, the paragraph does not describe Darimont’s beliefs about the Great Bear Rainforest. F. CORRECT. Paragraph 1 explains why Darimont wanted to consult with Chester Starr, an elder of the Heiltsuk Nation: “When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves.” The details in paragraph 1 show that Darimont valued Starr’s perspective (“What Starr had to say about the wolves changed Darimont’s perception of the animals”), even though it was different from Darimont’s own perspective at that time. G. Incorrect. Paragraphs 1 and 2 show that Darimont did not initially believe that the mainland wolves and the coastal wolves were different groups. Therefore, the details in paragraph 1 do not provide evidence that Darimont chose Great Bear Rainforest because of an expectation that there were separate groups of island wolves and timber wolves. Instead, he chose the Great Bear Rainforest for the opportunity to study what he had presumed to be one group of wolves. H. Incorrect. Although Darimont sought out Chester Starr, an elder of the Heiltsuk Nation, before beginning his research, Darimont’s purpose in doing so was not to request Starr’s permission to study the wolves but to learn from Starr’s expert knowledge of the area and its wolves (“When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves” [paragraph 1]).",
    "explanationHtml": "<p>The question asks how the details about Darimont in paragraph 1 contribute to a central idea of</p><p>the passage.</p><p><strong>E. </strong>Incorrect. Although paragraph 1 includes the detail that the Great Bear Rainforest is a protected area, finding an ideal location to study wolves is not a central idea of the passage. Additionally, the paragraph does not describe Darimont’s beliefs about the Great Bear Rainforest. <strong>F. CORRECT. </strong>Paragraph 1 explains why Darimont wanted to consult with Chester Starr, an elder of the Heiltsuk Nation: “When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves.” The details in paragraph 1 show that Darimont valued Starr’s perspective (“What Starr had to say about the wolves changed Darimont’s perception of the animals”), even though it was different from Darimont’s own perspective at that time. <strong>G. </strong>Incorrect. Paragraphs 1 and 2 show that Darimont did not initially believe that the mainland wolves and the coastal wolves were different groups. Therefore, the details in paragraph 1 do not provide evidence that Darimont chose Great Bear Rainforest because of an expectation that there were separate groups of island wolves and timber wolves. Instead, he chose the Great Bear Rainforest for the opportunity to study what he had presumed to be one group of wolves. <strong>H. </strong>Incorrect. Although Darimont sought out Chester Starr, an elder of the Heiltsuk Nation, before beginning his research, Darimont’s purpose in doing so was not to request Starr’s permission to study the wolves but to learn from Starr’s expert knowledge of the area and its wolves (“When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves” [paragraph 1]).</p>",
    "points": 1,
    "prompt": "The details in paragraph 1 contribute to a central idea of the passage by showing that Darimont",
    "promptHtml": "<p>The details in paragraph 1 contribute to a central idea of the passage by showing that Darimont</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>believed the Great Bear Rainforest was an ideal location to study wolves in their natural habitat because it is a protected area.</p>",
        "text": "believed the Great Bear Rainforest was an ideal location to study wolves in their natural habitat because it is a protected area."
      },
      {
        "id": "B",
        "html": "<p>values different perspectives, because the information that Starr provided influenced the focus of Darimont’s research.</p>",
        "text": "values different perspectives, because the information that Starr provided influenced the focus of Darimont’s research."
      },
      {
        "id": "C",
        "html": "<p>thought the Great Bear Rainforest would provide opportunities to study different groups of wolves because the area includes forests and islands.</p>",
        "text": "thought the Great Bear Rainforest would provide opportunities to study different groups of wolves because the area includes forests and islands."
      },
      {
        "id": "D",
        "html": "<p>understands the importance of respecting local community members, because Darimont sought permission from an elder of the Heiltsuk Nation before starting his research.</p>",
        "text": "understands the importance of respecting local community members, because Darimont sought permission from an elder of the Heiltsuk Nation before starting his research."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q053",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "53",
      "pages": [
        38
      ]
    },
    "explanation": "The question asks why the author includes details about the conversation between Starr and\n\nDarimont in paragraph 2.\n\nA. Incorrect. The details in paragraph 2 do not explain why Starr had closely observed the two groups of wolves. Instead, they convey that Starr believed the wolves to be separate groups (“Starr asked Darimont which wolves he and his team were going to study—the timber wolves (mainland wolves) or the coastal wolves on the islands”), a supposition that intrigued Darimont and ultimately changed the course of his research study. B. Incorrect. Although paragraph 1 indicates that Darimont did hope to work with Starr (“he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves”), Darimont did not initially plan to study both groups of wolves in the area because, as the conversation in paragraph 2 indicates, he did not initially know they were two distinct groups of wolves. C. Incorrect. The details about the conversation in paragraph 2 highlight that Darimont was eager to learn from Starr’s knowledge of the wolves (“Darimont was intrigued by Starr's classification of the wolves as two different groups”), but they do not indicate that Darimont expected Starr’s help to find the wolves. D. CORRECT. According to paragraph 2, Starr wanted to know which group of wolves Darimont planned to study—“the timber wolves (mainland wolves) or the coastal wolves on the islands.” The author states that the question “took Darimont by surprise,” adding that “Darimont was intrigued by Starr’s classification of the wolves as two different groups.” The author adds that Darimont was initially “hesitant to accept the idea” that the wolves were separate groups but ultimately spent years studying the two groups of wolves. These details indicate that the question Starr posed to Darimont forced Darimont to reevaluate his initial assumption “that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland” and investigate Starr’s observation that the wolves had separated into two distinct groups.",
    "explanationHtml": "<p>The question asks why the author includes details about the conversation between Starr and</p><p>Darimont in paragraph 2.</p><p><strong>A. </strong>Incorrect. The details in paragraph 2 do not explain why Starr had closely observed the two groups of wolves. Instead, they convey that Starr believed the wolves to be separate groups (“Starr asked Darimont which wolves he and his team were going to study—the timber wolves (mainland wolves) or the coastal wolves on the islands”), a supposition that intrigued Darimont and ultimately changed the course of his research study. <strong>B. </strong>Incorrect. Although paragraph 1 indicates that Darimont did hope to work with Starr (“he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves”), Darimont did not initially plan to study both groups of wolves in the area because, as the conversation in paragraph 2 indicates, he did not initially know they were two distinct groups of wolves. <strong>C. </strong>Incorrect. The details about the conversation in paragraph 2 highlight that Darimont was eager to learn from Starr’s knowledge of the wolves (“Darimont was intrigued by Starr&#x27;s classification of the wolves as two different groups”), but they do not indicate that Darimont expected Starr’s help to find the wolves. <strong>D. CORRECT. </strong>According to paragraph 2, Starr wanted to know which group of wolves Darimont planned to study—“the timber wolves (mainland wolves) or the coastal wolves on the islands.” The author states that the question “took Darimont by surprise,” adding that “Darimont was intrigued by Starr’s classification of the wolves as two different groups.” The author adds that Darimont was initially “hesitant to accept the idea” that the wolves were separate groups but ultimately spent years studying the two groups of wolves. These details indicate that the question Starr posed to Darimont forced Darimont to reevaluate his initial assumption “that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland” and investigate Starr’s observation that the wolves had separated into two distinct groups.</p>",
    "points": 1,
    "prompt": "Why does the author include details about the conversation between Starr and Darimont in paragraph 2?",
    "promptHtml": "<p>Why does the author include details about the conversation between Starr and Darimont in paragraph 2?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>to explain why Starr had closely observed the relationship between the two groups of wolves Darimont wanted to study</p>",
        "text": "to explain why Starr had closely observed the relationship between the two groups of wolves Darimont wanted to study"
      },
      {
        "id": "B",
        "html": "<p>to show that Darimont was hoping to work with Starr and to study both groups of wolves in the area</p>",
        "text": "to show that Darimont was hoping to work with Starr and to study both groups of wolves in the area"
      },
      {
        "id": "C",
        "html": "<p>to highlight that Darimont was unfamiliar with the area and expected Starr to help him find wolves to study</p>",
        "text": "to highlight that Darimont was unfamiliar with the area and expected Starr to help him find wolves to study"
      },
      {
        "id": "D",
        "html": "<p>to emphasize that the question asked by Starr caused Darimont to review his initial assumption about the wolves</p>",
        "text": "to emphasize that the question asked by Starr caused Darimont to review his initial assumption about the wolves"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q054",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "54",
      "pages": [
        39
      ]
    },
    "explanation": "The question asks what the phrase “hard biological evidence” in the sentence from paragraph 4\n\nconveys about the goal of the research team.\n\nE. Incorrect. Although the research team followed a labor-intensive procedure, the phrase “hard biological evidence” refers to the product of their scientific research (the genetic markers revealed within the DNA samples), not the process by which they collected it. Their goal was not to develop a procedure for data collection but to determine precisely how many species of wolf were present in the area. F. CORRECT. The research team wanted to prove or disprove the theory that two separate groups of wolves were present in the area, an idea that was already supported by the observations of scientists and local indigenous people. The phrase “hard biological evidence” conveys that the scientists wanted to bolster their observations of the wolves with concrete scientific data about the wolves’ biological makeup. The goal of the researchers was to use the data to prove how many species of wolf were present in the area of the study. G. Incorrect. The research team gathered extensive data during their study (“After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste” [paragraph 4]), and their goal in doing so was to evaluate a single theory about the wolves: that the wolves had evolved into two separate and genetically distinct species. The research team did not conduct the study in order to evaluate multiple theories about the diets of the wolves. H. Incorrect. The phrase “hard biological evidence” does not suggest that the research team was hoping to discover if the new data would provide information that was different from previous studies. In fact, the goal of the research team was to use the genetic data to supplement their initial sources of information about the wolves and their own observations from the field.",
    "explanationHtml": "<p>The question asks what the phrase “hard biological evidence” in the sentence from paragraph 4</p><p>conveys about the goal of the research team.</p><p><strong>E. </strong>Incorrect. Although the research team followed a labor-intensive procedure, the phrase “hard biological evidence” refers to the product of their scientific research (the genetic markers revealed within the DNA samples), not the process by which they collected it. Their goal was not to develop a procedure for data collection but to determine precisely how many species of wolf were present in the area. <strong>F. CORRECT. </strong>The research team wanted to prove or disprove the theory that two separate groups of wolves were present in the area, an idea that was already supported by the observations of scientists and local indigenous people. The phrase “hard biological evidence” conveys that the scientists wanted to bolster their observations of the wolves with concrete scientific data about the wolves’ biological makeup. The goal of the researchers was to use the data to prove how many species of wolf were present in the area of the study. <strong>G. </strong>Incorrect. The research team gathered extensive data during their study (“After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste” [paragraph 4]), and their goal in doing so was to evaluate a single theory about the wolves: that the wolves had evolved into two separate and genetically distinct species. The research team did not conduct the study in order to evaluate multiple theories about the diets of the wolves. <strong>H. </strong>Incorrect. The phrase “hard biological evidence” does not suggest that the research team was hoping to discover if the new data would provide information that was different from previous studies. In fact, the goal of the research team was to use the genetic data to supplement their initial sources of information about the wolves and their own observations from the field.</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 4.\n\nAfter collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves.\n\nThe phrase “hard biological evidence” conveys that the goal of the research team was to",
    "promptHtml": "<p>Read this sentence from paragraph 4.</p><blockquote><strong>After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste,</strong> <strong>researchers could produce hard biological evidence that sea wolves had genetic</strong> <strong>markers that made them distinct from the mainland wolves.</strong></blockquote><p>The phrase “hard biological evidence” conveys that the goal of the research team was to</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>develop a procedure in order to ensure their study yielded plentiful data about the wolves.</p>",
        "text": "develop a procedure in order to ensure their study yielded plentiful data about the wolves."
      },
      {
        "id": "B",
        "html": "<p>seek definitive scientific proof of the number of wolf species present in the area of the study.</p>",
        "text": "seek definitive scientific proof of the number of wolf species present in the area of the study."
      },
      {
        "id": "C",
        "html": "<p>conduct a study to evaluate multiple theories about the diets of different wolf species.</p>",
        "text": "conduct a study to evaluate multiple theories about the diets of different wolf species."
      },
      {
        "id": "D",
        "html": "<p>discover if the new data would provide information different from that of previous studies.</p>",
        "text": "discover if the new data would provide information different from that of previous studies."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q055",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "55",
      "pages": [
        39
      ]
    },
    "explanation": "The question asks for the most likely reason why the author uses the word “admits” in\n\nparagraph 5.\n\nA. Incorrect. The word “admits” highlights the surprising difference between Darimont’s initial idea and the conclusion he ultimately drew from the results of the study. Though Darimont’s genetic research did, in fact, verify the field observations of the wolves, this does not explain the author’s use of the word “admits” in paragraph 5. B. Incorrect. The conclusion that Darimont reached was actually quite original, since biologists widely believed the two separate groups of wolves to be one (“Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland,” [paragraph 2]). The author uses the word “admits” in paragraph 5 to emphasize how unexpected Darimont found the conclusion to be (“The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland?” [paragraph 2]), not to indicate that the study was a disappointment. C. CORRECT. The use of “admits” emphasizes that Darimont found the idea of two species of wolves “ ‘totally bizarre at first’ ” (paragraph 5) but ultimately proved it to be correct. Paragraph 2 suggests that Darimont, like other scientists, “had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland.” Therefore, the results of the study were likely to strike biologists as bizarre, and the use of the word “admits” in paragraph 5 highlights Darimont’s shift from doubt to confirmation. D. Incorrect. Darimont’s team conducted the research that helped him confirm Starr’s idea and draw the conclusion that the wolves were separate species (“After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves” [paragraph 4]). However, the opinions of Darimont’s research team are not described in the passage, and the word “admits” does not indicate that they disagreed with his conclusion.",
    "explanationHtml": "<p>The question asks for the <strong>most likely </strong>reason why the author uses the word “admits” in</p><p>paragraph 5.</p><p><strong>A. </strong>Incorrect. The word “admits” highlights the surprising difference between Darimont’s initial idea and the conclusion he ultimately drew from the results of the study. Though Darimont’s genetic research did, in fact, verify the field observations of the wolves, this does not explain the author’s use of the word “admits” in paragraph 5. <strong>B. </strong>Incorrect. The conclusion that Darimont reached was actually quite original, since biologists widely believed the two separate groups of wolves to be one (“Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland,” [paragraph 2]). The author uses the word “admits” in paragraph 5 to emphasize how unexpected Darimont found the conclusion to be (“The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland?” [paragraph 2]), not to indicate that the study was a disappointment. <strong>C. CORRECT. </strong>The use of “admits” emphasizes that Darimont found the idea of two species of wolves “ ‘totally bizarre at first’ ” (paragraph 5) but ultimately proved it to be correct. Paragraph 2 suggests that Darimont, like other scientists, “had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland.” Therefore, the results of the study were likely to strike biologists as bizarre, and the use of the word “admits” in paragraph 5 highlights Darimont’s shift from doubt to confirmation. <strong>D. </strong>Incorrect. Darimont’s team conducted the research that helped him confirm Starr’s idea and draw the conclusion that the wolves were separate species (“After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves” [paragraph 4]). However, the opinions of Darimont’s research team are not described in the passage, and the word “admits” does not indicate that they disagreed with his conclusion.</p>",
    "points": 1,
    "prompt": "The author uses the word “admits” in paragraph 5 most likely to",
    "promptHtml": "<p>The author uses the word “admits” in paragraph 5 <strong>most likely </strong>to</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "html": "<p>note that Darimont’s genetic research verified a theory based solely on field observations.</p>",
        "text": "note that Darimont’s genetic research verified a theory based solely on field observations."
      },
      {
        "id": "B",
        "html": "<p>imply that Darimont’s study was disappointing because the conclusion that he reached was not original.</p>",
        "text": "imply that Darimont’s study was disappointing because the conclusion that he reached was not original."
      },
      {
        "id": "C",
        "html": "<p>emphasize that Darimont’s study ultimately confirmed an idea that he had initially doubted.</p>",
        "text": "emphasize that Darimont’s study ultimately confirmed an idea that he had initially doubted."
      },
      {
        "id": "D",
        "html": "<p>highlight that Darimont’s results led him to draw a conclusion from his research that his team did not agree with.</p>",
        "text": "highlight that Darimont’s results led him to draw a conclusion from his research that his team did not agree with."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q056",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "56",
      "pages": [
        40
      ]
    },
    "explanation": "The question asks for the sentence from the passage that best supports the idea that sea\n\nwolves had successfully adapted to living on the islands.\n\nE. CORRECT. This sentence from paragraph 3 describes a significant difference in the diets of the mainland and sea wolves: the mainland wolves “almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals,” whereas the sea wolves had adapted to the point where they derive “as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish.” This sentence emphasizes the dietary difference between the two groups of wolves and best supports the idea that sea wolves had successfully adapted to living on the islands. F. Incorrect. Although this sentence from paragraph 3 describes one technique that the sea wolves used to hunt, it does not offer evidence as strong as that provided by the preceding sentence, which explains that sea wolves were able to derive “as much as 90 percent” (paragraph 3) of their sustenance from the sea alone (versus the mainland wolves, which “almost exclusively eat meat” from land animals [paragraph 3]). G. Incorrect. Although this sentence from paragraph 3 states that “some sea wolves live their entire life on the islands,” it does not provide strong evidence of the necessary adaptations—namely, how these wolves were able to successfully live their whole lives on the islands. Living on the islands was not necessarily an adaptation in and of itself; the adaptation was the sea-based diet that enabled the sea wolves to live on the islands without access to land animals. H. Incorrect. Although this sentence from paragraph 4 presents Darimont’s hypothesis that “a change in habitat led to the eventual genetic differences” between the wolves, the sentence does not describe any of the sea wolves’ adaptations nor best support the idea that the sea wolves successfully adapted to living on the islands.",
    "explanationHtml": "<p>The question asks for the sentence from the passage that <strong>best </strong>supports the idea that sea</p><p>wolves had successfully adapted to living on the islands.</p><p><strong>E. CORRECT. </strong>This sentence from paragraph 3 describes a significant difference in the diets of the mainland and sea wolves: the mainland wolves “almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals,” whereas the sea wolves had adapted to the point where they derive “as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish.” This sentence emphasizes the dietary difference between the two groups of wolves and best supports the idea that sea wolves had successfully adapted to living on the islands. <strong>F. </strong>Incorrect. Although this sentence from paragraph 3 describes one technique that the sea wolves used to hunt, it does not offer evidence as strong as that provided by the preceding sentence, which explains that sea wolves were able to derive “as much as 90 percent” (paragraph 3) of their sustenance from the sea alone (versus the mainland wolves, which “almost exclusively eat meat” from land animals [paragraph 3]). <strong>G. </strong>Incorrect. Although this sentence from paragraph 3 states that “some sea wolves live their entire life on the islands,” it does not provide strong evidence of the necessary adaptations—namely, how these wolves were able to successfully live their whole lives on the islands. Living on the islands was not necessarily an adaptation in and of itself; the adaptation was the sea-based diet that enabled the sea wolves to live on the islands without access to land animals. <strong>H. </strong>Incorrect. Although this sentence from paragraph 4 presents Darimont’s hypothesis that “a change in habitat led to the eventual genetic differences” between the wolves, the sentence does not describe any of the sea wolves’ adaptations nor best support the idea that the sea wolves successfully adapted to living on the islands.</p>",
    "points": 1,
    "prompt": "Which sentence from the passage best supports the idea that sea wolves had successfully adapted to living on the islands?",
    "promptHtml": "<p>Which sentence from the passage <strong>best </strong>supports the idea that sea wolves had successfully adapted to living on the islands?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish.” (paragraph 3)</p>",
        "text": "“While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish.” (paragraph 3)"
      },
      {
        "id": "B",
        "html": "<p>“Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water.” (paragraph 3)</p>",
        "text": "“Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water.” (paragraph 3)"
      },
      {
        "id": "C",
        "html": "<p>“Darimont suspects that some sea wolves live their entire life on the islands.” (paragraph 3)</p>",
        "text": "“Darimont suspects that some sea wolves live their entire life on the islands.” (paragraph 3)"
      },
      {
        "id": "D",
        "html": "<p>“Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves.” (paragraph 4)</p>",
        "text": "“Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves.” (paragraph 4)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "wolves-of-the-sea-2023-2024-form-a-pdf-shsat-2023-2024-a-q057",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2023-2024-form-a",
      "label": "2023-2024 Form A",
      "year": "2023-2024",
      "form": "A",
      "sourceQuestion": "57",
      "pages": [
        40
      ]
    },
    "explanation": "The question asks how a change in habitat most affected the wolf population of the Great Bear\n\nRainforest over time.\n\nA. Incorrect. Although the island wolves learned new hunting techniques (“dig for clams and to catch fish,” “sneak up on a seal sunning itself on a rock and make a leaping attack from the water” [paragraph 3]), there is no evidence in the passage that these hunting techniques were developed in response to scarcity of prey. The most significant effect of the change in habitat was not an influence on hunting techniques but the behavior differences that evolved because of the isolation of the groups of wolves from each other. B. Incorrect. The change in habitat did not cause the wolves to form smaller packs but rather served to create distinctive behaviors because of the isolation of one pack from another, eventually causing the groups of wolves to became distinct species. C. CORRECT. The change in habitat caused the wolves to gradually become two distinct species. Though the “sea wolves regularly swim between islands” and “some salmon-eating mainland wolves come and go from the islands,” the “sea wolves are full-time island residents” (paragraph 3). This behavioral adaptation to their environment caused the sea wolves to “became more isolated” from the mainland wolves; as a result, the two groups “rarely mated with each other,” and “over time the two types of wolves became more distinct” (paragraph 4). D. Incorrect. Only the sea wolves adapted their diet. They did this not because different food sources became available in the area but because they were in an entirely different area from the mainland wolves.",
    "explanationHtml": "<p>The question asks how a change in habitat <strong>most </strong>affected the wolf population of the Great Bear</p><p>Rainforest over time.</p><p><strong>A. </strong>Incorrect. Although the island wolves learned new hunting techniques (“dig for clams and to catch fish,” “sneak up on a seal sunning itself on a rock and make a leaping attack from the water” [paragraph 3]), there is no evidence in the passage that these hunting techniques were developed in response to scarcity of prey. The most significant effect of the change in habitat was not an influence on hunting techniques but the behavior differences that evolved because of the isolation of the groups of wolves from each other. <strong>B. </strong>Incorrect. The change in habitat did not cause the wolves to form smaller packs but rather served to create distinctive behaviors because of the isolation of one pack from another, eventually causing the groups of wolves to became distinct species. <strong>C. CORRECT. </strong>The change in habitat caused the wolves to gradually become two distinct species. Though the “sea wolves regularly swim between islands” and “some salmon-eating mainland wolves come and go from the islands,” the “sea wolves are full-time island residents” (paragraph 3). This behavioral adaptation to their environment caused the sea wolves to “became more isolated” from the mainland wolves; as a result, the two groups “rarely mated with each other,” and “over time the two types of wolves became more distinct” (paragraph 4). <strong>D. </strong>Incorrect. Only the sea wolves adapted their diet. They did this not because different food sources became available in the area but because they were in an entirely different area from the mainland wolves.</p>",
    "points": 1,
    "prompt": "How did a change in habitat most affect the wolf population of the Great Bear Rainforest over time?",
    "promptHtml": "<p>How did a change in habitat <strong>most </strong>affect the wolf population of the Great Bear Rainforest over time?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>It caused some of the wolves to learn new hunting techniques in order to catch increasingly scarce prey.</p>",
        "text": "It caused some of the wolves to learn new hunting techniques in order to catch increasingly scarce prey."
      },
      {
        "id": "B",
        "html": "<p>It caused the wolves to form smaller packs and eventually separate, establishing distinct territories.</p>",
        "text": "It caused the wolves to form smaller packs and eventually separate, establishing distinct territories."
      },
      {
        "id": "C",
        "html": "<p>It caused some of the wolves to gradually become a new, genetically distinct species as they adapted behaviorally.</p>",
        "text": "It caused some of the wolves to gradually become a new, genetically distinct species as they adapted behaviorally."
      },
      {
        "id": "D",
        "html": "<p>It caused the wolves to adapt their diet as different food sources became available in the area.</p>",
        "text": "It caused the wolves to adapt their diet as different food sources became available in the area."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const wolvesOfTheSea20232024FormAPassageSet: ExamPassageSet = {
  id: "ela-wolves-of-the-sea-2023-2024-form-a",
  versionLabels: ["2023-2024 Form A"],
  label: "2023-2024 Form A",
  section: "reading",
  questionCount: wolvesOfTheSea20232024FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "wolves-of-the-sea-2023-2024-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Wolves of the Sea",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2023-2024-form-a","label":"2023-2024 Form A","year":"2023-2024","form":"A","packageId":"5c1555aae90261238f39dba81634818add7c23a76df51dbe5c19d560b50cddb2"},
    title: "Wolves of the Sea",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>1 The cool and misty landscape of the Great Bear Rainforest can be found along the coast of British Columbia, Canada, and its nearby islands, from Vancouver Island to the Alaskan border. Within this protected area, wolves roam the forests, islands, and beaches. When biologist Chris Darimont began to study these wolves, he wanted to confer with local First Nations groups, as aboriginal Canadians are known, in order to learn what they knew about these wolves. He spoke with Chester Starr, an elder of the Heiltsuk Nation that has occupied the Great Bear Rainforest for thousands of years. What Starr had to say about the wolves changed Darimont’s perception of the animals.</p><p>2 Starr asked Darimont which wolves he and his team were going to study—the timber wolves (mainland wolves) or the coastal wolves on the islands. The question took Darimont by surprise. Biologists had always believed that the wolves that are sometimes spotted swimming between islands and eating salmon are the same wolves that live on the mainland. Darimont was intrigued by Starr’s classification of the wolves as two different groups. At first, he was hesitant to accept the idea. The distances between the mainland and the islands are small, less than a mile. Why would the wolves on the islands be any different from the wolves on the mainland? To find out, Darimont and his research team studied the wolves on the islands and in the densely forested territory of the Great Bear Rainforest for ten years.</p><p>3 Throughout the study, Darimont recorded several significant, observable differences between the “sea wolves,” as they are nicknamed, and the mainland wolves. Compared with the mainland wolves, the sea wolves are smaller in size and are strong swimmers. In 1996 sea wolves were spotted on an island nearly eight miles from any other land formation. While mainland wolves almost exclusively eat meat, such as deer and elk, and teach their young to hunt for land animals, sea wolves get as much as 90 percent of their nutrition from the sea and teach their young to dig for clams and to catch fish. Sea wolves regularly swim between islands and have been known to sneak up on a seal sunning itself on a rock and make a leaping attack from the water. Some salmon-eating mainland wolves come and go from the islands with the fish-spawning season, but the sea wolves are full-time island residents. Darimont suspects that some sea wolves live their entire life on the islands.</p><p>4 The sea wolves displayed not only physical and behavioral differences but also genetic variations from the mainland wolves. After collecting and analyzing the DNA in 800 samples of gray fur and wolf waste, researchers could produce hard biological evidence that sea wolves had genetic markers that made them distinct from the mainland wolves. A genetic marker is a variation in a DNA sequence that can be used to identify individuals or a species because it is passed down to offspring. Darimont hypothesizes that a change in habitat led to the eventual genetic differences between sea wolves and mainland wolves. Many years ago, loss of habitat and food sources forced some mainland wolves out to the islands. They learned to eat everything from kelp and fish eggs to the remains of sea creatures that washed up on the beach. Wolves living on the islands and mainland wolves became more isolated and rarely mated with each other. Over time the two types of wolves became more distinct.</p><p>5 It turned out that Chester Starr was right all along. “It sounded totally bizarre at first,” admits Darimont, “that there could be two versions of the species.” But he now realizes that this skepticism “definitely reflected my ignorance of indigenous knowledge at the time.” Learning to trust the wisdom of the Heiltsuk people opened Darimont up to knowledge accumulated over millennia and positioned him so that he could gather new scientific evidence about one of British Columbia’s most elusive species, the sea wolf.</p>",
    text: wolvesOfTheSea20232024FormAPassageText,
    versionLabel: "2023-2024 Form A",
  }),
  questions: wolvesOfTheSea20232024FormAQuestions,
};
