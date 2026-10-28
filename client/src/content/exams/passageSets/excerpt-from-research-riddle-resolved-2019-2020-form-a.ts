import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromResearchRiddleResolved20192020FormAPassageText = "Hundreds of years after the first sightings of the platypus, the animal still captures our imagination anew and irresistibly attracts the attention of science writers everywhere. The May 2008 Nature report detailing the DNA insides of the duck-billed platypus invited colorful tales from just about every mainstream media outlet.\n\nBut cuteness and weirdness aside, the platypus research results are a gold mine for medical researchers. The findings cement what may have seemed totally obvious but turned out to be a bit of a scientific surprise: platypus DNA is a patchwork of genes from reptiles, birds, and mammals.\n\nEvolution Fusion\n\nIn other words, the platypus heritage is laid out in an evolutionary DNA tapestry that marks the time, hundreds of millions of years ago, when reptiles and mammals branched off the evolutionary tree.\n\nSo what? The platypus is nothing like a human, so what can its DNA tell us about people and the diseases we get?\n\nPlenty, says an international team of scientists who did this work.\n\nThe platypus genome results are far more than confirmation of a scientific oddity. They provide researchers a window into a time in history when mammals became unique—gaining the ability to bear live young, produce milk for them, and grow a warm, furry coat.\n\nThat’s important because our own, modern-day genomes are still a big mystery and researchers need much more information to be able to translate our genetic language into useful health knowledge.\n\nOne of the ways scientists can decipher meaning from within our 3 billion DNA “letters,” or nucleotides, is to compare human genes with those from animals, to see what has been kept the same and what has evolved to be different. . . .\n\nSame and Different\n\nIn an approach called comparative genomics, scientists compare the genome sequences of several species: human, mouse, and a wide variety of other organisms from single-celled fungi to elephants and, now, the platypus.\n\nThe goal of this research is to find regions of similarity and difference in order to better understand the structure and function of human genes.\n\nComparative genomics is directly related to evolution because all living things share a common ancestor. By using computer tools to examine genes that have been kept the same in many organisms over millions of years, researchers can locate signals that control how genes work. This information may translate into ways to understand, treat, and prevent human diseases. . . .\n\nChicken or Egg?\n\nWhen researchers analyzed platypus DNA and compared it to that of chickens, snakes, and lizards, the findings traced the evolutionary path from birds and reptiles to mammals. They learned that the platypus lost most of its genetic ability to produce egg yolk—as compared to chicken genes. This suggests its departure from “chicken-ness.”\n\nBut, through evolutionary change, the platypus gained the ability to make milk that is rich in nutrients. Platypuses have genes that make the milk protein casein: just like we do.\n\nA male platypus can, like its ancestral snake and lizard cousins, produce venom. The platypus ejects this venom through special glands in its back legs. The evolutionary reason for maintaining such molecular weaponry isn’t yet clear, but what is fascinating is that it appears nature mixed and matched together DNA pieces separately to create the venom genes in reptiles and monotremes like the platypus.\n\nThe scientific value of pinning genetics to physiological function—like milk production—is high. Such investigations may help medical researchers understand health issues related to reproduction and lactation. Although lactation is an ancient reproductive trait, mammals—including the platypus—are unique in their ability to produce milk that is extraordinarily nutritious, containing a rich blend of sugars, fats, and proteins.\n\nMore generally, though, studying how nature cuts and pastes gene modules gives scientists an inside scoop on how genetic changes relate to health and disease risk.\n\nOne thing is clear—the stunning blend of reptile, bird, and mammal puts the platypus in a class of its own, and it gives researchers much more: information about how mammals like us came about.\n\n[Scientists’] genetic sleuthing of platypuses, chimps, fish, sunflowers—you name it—continues to teach scientists how millions of years of evolution progressed. This provides vital information to understanding the role of genes in the health and disease of mammals like us and our pets, and can also help preserve our rich and diverse planet.";

const excerptFromResearchRiddleResolved20192020FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q25",
    "skilled": "TBD",
    "explanation": "The question asks how the sentence from paragraph 2 contributes to the overall structure of the excerpt.\n\nD: Correct. The sentence from paragraph 2 serves as a transition from the introductory idea of “the animal still captures our imagination anew and irresistibly attracts the attention of science writers everywhere” (paragraph 1) to the central idea that the platypus has great scientific significance.\n\nA: Incorrect. While the sentence from paragraph 2 does mention the platypus’s unique appearance, the remainder of the excerpt does not focus on the physiology of the platypus but instead focuses on the significance of scientists’ platypus research and what it can “tell us about people” (paragraph 4).\n\nB: Incorrect. Paragraph 1 discusses the platypus as the “duck-billed” animal that “still captures our imagination anew and irresistibly attracts the attention of science writers everywhere,” but highlighting the idea that the platypus’s unusual appearance has attracted scientist’s attention is not how the sentence from paragraph 2 fits into the overall structure of the excerpt.\n\nC: Incorrect. Paragraph 1 states that “the May 2008 Nature report detailing the DNA insides of the duck-billed platypus invited colorful tales from just about every mainstream media outlet,” but it does not discuss current ideas in the field. Paragraph 2 focuses on the “scientific surprise” of the platypus.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\n\nBut cuteness and weirdness aside, the platypus research results are a gold mine for medical researchers.\n\nThe sentence contributes to the overall structure of the excerpt by",
    "promptHtml": "<p>Read this sentence from paragraph 2.</p><blockquote><strong>But cuteness and weirdness aside, the platypus research results are a gold mine for medical researchers.</strong></blockquote><p>The sentence contributes to the overall structure of the excerpt by</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "shifting the focus of the excerpt from the platypus’s unique appearance to its physiology."
      },
      {
        "id": "B",
        "text": "highlighting how the platypus’s unusual appearance has attracted scientists’ attention."
      },
      {
        "id": "C",
        "text": "revealing current ideas about the genetic background of the platypus."
      },
      {
        "id": "D",
        "text": "introducing the platypus’s scientific significance that the rest of the excerpt develops."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q26",
    "skilled": "TBD",
    "explanation": "The question asks what the phrase “evolutionary DNA tapestry” in paragraph 3 conveys about the platypus.\n\nE: Correct. In the excerpt, the term “tapestry” conveys the sense of a rich history; the “platypus heritage” described in paragraph 3 is woven together with “threads” from mammals, birds, and reptiles in its genetic background.\n\nF: Incorrect. While paragraph 3 does mention mammals and reptiles, it does not discuss when the platypus developed traits from those classifications. Rather, it refers in general to “hundreds of millions of years ago, when reptiles and mammals branched off the evolutionary tree. ”\n\nG: Incorrect. The excerpt never claims that, compared with other animals, the platypus is the best resource for studying the evolution of animal genomes. The excerpt indicates that the platypus’s status as a “scientific oddity” provides “a window into a time in history when mammals became unique—gaining the ability to bear live young, produce milk for them, and grow a warm, furry coat” (paragraph 6).\n\nH: Incorrect. The excerpt states that the platypus genome is a “scientific oddity” (paragraph 6) that is useful to researchers, but the reason it is useful is because of DNA evidence that shows “a window into a time in history when mammals became unique” (paragraph 6), not because its genes have never been altered.",
    "points": 1,
    "prompt": "The phrase “evolutionary DNA tapestry” in paragraph 3 conveys the idea that the platypus",
    "promptHtml": "<p>The phrase “evolutionary DNA tapestry” in paragraph 3 conveys the idea that the platypus</p>",
    "topic": "Figurative Language & Imagery",
    "choices": [
      {
        "id": "A",
        "text": "has a rich and diverse genetic history linked to reptiles, birds, and other mammals."
      },
      {
        "id": "B",
        "text": "was able to develop its mammalian and reptilian traits at different points in time."
      },
      {
        "id": "C",
        "text": "continues to be the best resource for studying the evolution of animal genomes."
      },
      {
        "id": "D",
        "text": "is especially useful to researchers because its genes have never been altered."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q27",
    "skilled": "TBD",
    "explanation": "The question asks how paragraph 8 fits into the overall structure of the excerpt.\n\nA: Correct. Paragraph 8 acts as a transition from the discussion of how “our own, modern-day genomes are still a big mystery” (paragraph 7) to the discussion of how scientists use comparative genomics to compare “human genes with those from animals” (paragraph 8).\n\nB: Incorrect. Paragraph 8 introduces the practice of comparing “human genes with those from animals,” but it does not clarify or provide details about how scientists solved the problem of studying complex human genomes using comparative genomics.\n\nC: Incorrect. Rather than contrasting the effort of the study of the human genome with the effort of a separate study of animal genomes, paragraph 8 discusses a study that is comparing human and animal genomes in order “to see what has been kept the same and what has evolved to be different. ”\n\nD: Incorrect. While the mention in paragraph 8 of “3 billion DNA ‘letters’ ” certainly highlights the enormous challenge of fully analyzing the human genome, the point of paragraph 8 is to transition the excerpt to the topic of how comparative genomics can shed light on the human genome.",
    "points": 1,
    "prompt": "How does paragraph 8 fit into the overall structure of the excerpt?",
    "promptHtml": "<p>How does paragraph 8 fit into the overall structure of the excerpt?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "It provides a transition from the discussion of the platypus genome to a discussion on comparative genomics."
      },
      {
        "id": "B",
        "text": "It introduces the way that scientists solved the problem of how to study complex human genomes through comparative genomics."
      },
      {
        "id": "C",
        "text": "It contrasts the efforts made to study the different parts of the human genome with the efforts made to study certain animal genomes."
      },
      {
        "id": "D",
        "text": "It elaborates on the idea that deciphering genetic signals is a rigorous research challenge."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q28",
    "skilled": "TBD",
    "explanation": "The question asks for the best summary of the section “Same and Different” (paragraphs 9–11).\n\nG: Correct. This sentence describes the most important idea of the section: the discovery of genes that humans have in common with other species that can yield information about human disease. As stated in paragraph 10, “The goal of this research is to find regions of similarity and difference in order to better understand the structure and function of human genes. ”\n\nE: Incorrect. The fact that the platypus is the latest species whose genome is being compared with the human genome is just a detail of this section. The focus of the section is on the fact that comparing genomes can teach us about human disease. Paragraph 9 reveals this when it states that “scientists compare the genome sequences of several species: human, mouse, and a wide variety of other organisms from single-celled fungi to elephants and, now, the platypus. ”\n\nF: Incorrect. While comparative genomics is a way to examine many different species, this detail is not the main point of this section. Paragraph 10 notes that the “goal of this research” focuses on the fact that comparing genomes can teach us about human disease.\n\nH: Incorrect. While this section does mention the use of computers in comparative genomics, this information is a detail about how the research is carried out; the computers are a tool in discovering whether “this information may translate into ways to understand, treat, and prevent human diseases” (paragraph 11).",
    "points": 1,
    "prompt": "Which sentence gives the best summary of the section “Same and Different” (paragraphs 9–11)?",
    "promptHtml": "<p>Which sentence gives the best summary of the section “Same and Different” (paragraphs 9–11)?</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "The platypus is the most recent of several species whose genomes have been compared with the human genome."
      },
      {
        "id": "B",
        "text": "Comparative genomics is an effective way to examine a variety of different species, from single-celled organisms to large mammals."
      },
      {
        "id": "C",
        "text": "Comparing human genes with the genes of other animals and studying which genes are the same across species yield valuable information that may lead to a greater understanding of human disease."
      },
      {
        "id": "D",
        "text": "Scientists are able to use computers in order to compare and examine evolutionary changes in genes across a number of species, including humans."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q29",
    "skilled": "TBD",
    "explanation": "The question asks how the details in paragraphs 12–14 about the platypus’s different abilities convey a central idea of the excerpt.\n\nD: Correct. In describing the platypus’s different abilities, paragraph 12 states that “the findings traced the evolutionary path from birds and reptiles to mammals. ” Paragraphs 12–14 elaborate on the findings to support a central idea of the excerpt, which is that the platypus is rare in having bird, reptile, and mammal DNA.\n\nA: Incorrect. The fact that “platypuses have genes that make the milk protein casein: \"(paragraph 13) just like humans do is an important supporting detail, but it is not a central idea of the excerpt.\n\nB: Incorrect. While paragraph 14 explains that the platypus produces venom “like its ancestral snake and lizard cousins,” which suggests the platypus has the ability to defend itself, this information is a supporting detail and not a central idea of the excerpt.\n\nC: Incorrect. Paragraphs 12–14 do state that the platypus has lost some of its “chicken-ness” (paragraph 12) while gaining traits in common with mammals and reptiles, but this information is a supporting detail and not a central idea of the excerpt.",
    "points": 1,
    "prompt": "The details in paragraphs 12–14 about the platypus’s different abilities convey a central idea of the excerpt by",
    "promptHtml": "<p>The details in paragraphs 12–14 about the platypus’s different abilities convey a central idea of the excerpt by</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "showing that the platypus has a gene that allows it to produce nutrient-rich milk, as humans do."
      },
      {
        "id": "B",
        "text": "proving that the platypus, whose DNA is made up of DNA from several other species, has developed venom to defend itself."
      },
      {
        "id": "C",
        "text": "suggesting that the platypus, while gaining traits in common with mammals and reptiles, has lost some bird-like traits."
      },
      {
        "id": "D",
        "text": "demonstrating that the platypus has a rare evolutionary background that includes bird, reptile, and mammal DNA."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q30",
    "skilled": "TBD",
    "explanation": "The question asks how the author elaborates on the idea that creating a full analysis of platypus DNA was an important scientific endeavor.\n\nE: Correct. The importance of the research into platypus DNA is explained in the excerpt through descriptions of what this research can teach us about human genetics and disease. The question is raised directly in paragraph 4 and begins to be answered in paragraph 6 (“The platypus genome results . provide\n\nresearchers a window into a time in history when mammals became unique—gaining the ability to bear live young, produce milk for them, and grow a warm, furry coat”). This importance is also addressed in the “Same and Different” section (paragraphs 9–11) and in paragraphs 15 and 16.\n\nF: Incorrect. The comparison of the platypus with its bird and reptile relatives in paragraphs 12–15 is important to locating the platypus on its evolutionary family tree and in showing the connection between DNA and functionality. This comparison does not, however, explain the excerpt’s main reason for asserting that the analysis of platypus DNA was an important scientific endeavor.\n\nG: Incorrect. The excerpt begins with a description of the platypus’s appeal because of its “cuteness and weirdness” (paragraph 2) and goes on to explain the genetic reason for the animal’s “patchwork of genes” (paragraph 2). However, this information does not address the reason why the analysis of platypus DNA is considered an important scientific endeavor.\n\nH: Incorrect. Understanding how genetics can be aligned to physiological function is important to understanding why such research can reveal information about human health and disease, which is the real importance of this scientific endeavor, rather than the discussion of physiological function itself.",
    "points": 1,
    "prompt": "The author elaborates on the idea that creating a full analysis of platypus DNA was an important scientific endeavor mainly through",
    "promptHtml": "<p>The author elaborates on the idea that creating a full analysis of platypus DNA was an important scientific endeavor mainly through</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "a description of the type of information about human genetics that specialized research can yield."
      },
      {
        "id": "B",
        "text": "a comparison of the platypus with its closest bird and reptile relatives on the evolutionary tree."
      },
      {
        "id": "C",
        "text": "the discussion of how unusual the platypus genome is in the animal kingdom."
      },
      {
        "id": "D",
        "text": "the explanation of how genetics can be aligned to physiological function."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q31",
    "skilled": "TBD",
    "explanation": "The question asks how researching the genomes of other animals can inform scientists’ understanding of human health and disease.\n\nB: Correct. Paragraph 11 explains that finding ways that animal genomes are similar to the human genome helps researchers “locate signals that control how genes work. ”\n\nA: Incorrect. Although tracking how other animals evolved helps researchers better understand our “rich and diverse planet” (paragraph 18) through understanding genes, the potential benefits to human health will not necessarily preserve or sustain nature.\n\nC: Incorrect. While paragraph 11 does point out that all living things share an ancestor, the idea that they, therefore, share genetic traits is only implied. This idea does not contribute to the main focus of the research.\n\nD: Incorrect. The statement that “understanding how other animals are similar to one another helps researchers find new ways to understand the human genome” is too general to provide support for the main focus of the genetic research described in the excerpt. To learn more about human health and disease, scientists need to understand the similarities between the genetic material of animal species, not the similarities between the animals themselves.",
    "points": 1,
    "prompt": "How can researching the genomes of other animals inform scientists’ understanding of human health and disease?",
    "promptHtml": "<p>How can researching the genomes of other animals inform scientists’ understanding of human health and disease?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "Tracking how other animals evolved over millions of years helps researchers preserve and sustain nature."
      },
      {
        "id": "B",
        "text": "Finding ways that animal genomes are similar to the human genome helps researchers find signals that control genes."
      },
      {
        "id": "C",
        "text": "Observing that all living things evolved from a common ancestor helps researchers pinpoint certain genetic traits."
      },
      {
        "id": "D",
        "text": "Understanding how other animals are similar to one another helps researchers find new ways to understand the human genome."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-research-riddle-resolved-2019-2020-form-a-2019-form-a-ela-q32",
    "skilled": "TBD",
    "explanation": "The question asks which sentence from the excerpt best supports the idea that the same DNA material results in the same traits even in different classes of animals.\n\nH: Correct. The sentence from paragraph 14 describes two different classes of animals—reptiles and monotremes—that have the ability to create venom, a trait that resulted from the same DNA material “mixed and matched together. ”\n\nE: Incorrect. The sentence from paragraph 2 describes the combination of DNA material from several classes of animals that makes up platypus DNA; however, the sentence does not address whether any of those different animals share traits or whether they share some of the same DNA.\n\nF: Incorrect. The sentence from paragraph 3 emphasizes the relationship between two different classes of animals—reptiles and mammals—by discussing when they branched off the same evolutionary tree. However, the sentence does not address whether those classes of animals share any traits.\n\nG: Incorrect. The sentence from paragraph 4 questions whether platypus DNA can teach us something about humans and human disease, which implies that there must be something in common between these two animals. However, it does not state that these two animals actually share traits or DNA.",
    "points": 1,
    "prompt": "Which sentence from the excerpt best supports the idea that the same DNA material results in the same traits even in different classes of animals?",
    "promptHtml": "<p>Which sentence from the excerpt best supports the idea that the same DNA material results in the same traits even in different classes of animals?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "“The findings cement what may have seemed totally obvious but turned out to be a bit of a scientific surprise: platypus DNA is a patchwork of genes from reptiles, birds, and mammals.” (paragraph 2)"
      },
      {
        "id": "B",
        "text": "“In other words, the platypus heritage is laid out in an evolutionary DNA tapestry that marks the time, hundreds of millions of years ago, when reptiles and mammals branched off the evolutionary tree.” (paragraph 3)"
      },
      {
        "id": "C",
        "text": "“The platypus is nothing like a human, so what can its DNA tell us about people and the diseases we get?” (paragraph 4)"
      },
      {
        "id": "D",
        "text": "“The evolutionary reason for maintaining such molecular weaponry isn’t yet clear, but what is fascinating is that it appears nature mixed and matched together DNA pieces separately to create the venom genes in reptiles and monotremes like the platypus.” (paragraph 14)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromResearchRiddleResolved20192020FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-research-riddle-resolved-2019-2020-form-a",
  label: "2019–2020 Form A",
  section: "reading",
  questionCount: excerptFromResearchRiddleResolved20192020FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-research-riddle-resolved-2019-2020-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “Research Riddle Resolved”",
    blurb: "For centuries, scientists were confounded by an animal that seemed to look and act like a combination of a bird, a reptile, and a mammal. It has a bill like a duck and lays eggs but produces milk for its young. It lives in a burrow, has fur, and can make venom. We now know that this animal is called a duck-billed platypus. A platypus is a monotreme, a type of egg-laying mammal.",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">Hundreds of years after the first sightings of the platypus, the animal still captures our imagination anew and irresistibly attracts the attention of science writers everywhere. The May 2008 Nature report detailing the DNA insides of the duck-billed platypus invited colorful tales from just about every mainstream media outlet.</p>\n<p data-numbered=\"true\">But cuteness and weirdness aside, the platypus research results are a gold mine for medical researchers. The findings cement what may have seemed totally obvious but turned out to be a bit of a scientific surprise: platypus DNA is a patchwork of genes from reptiles, birds, and mammals.</p>\n<h2>Evolution Fusion</h2>\n<p data-numbered=\"true\">In other words, the platypus heritage is laid out in an evolutionary DNA tapestry that marks the time, hundreds of millions of years ago, when reptiles and mammals branched off the evolutionary tree.</p>\n<p data-numbered=\"true\">So what? The platypus is nothing like a human, so what can its DNA tell us about people and the diseases we get?</p>\n<p data-numbered=\"true\">Plenty, says an international team of scientists who did this work.</p>\n<p data-numbered=\"true\">The platypus genome results are far more than confirmation of a scientific oddity. They provide researchers a window into a time in history when mammals became unique—gaining the ability to bear live young, produce milk for them, and grow a warm, furry coat.</p>\n<p data-numbered=\"true\">That’s important because our own, modern-day genomes are still a big mystery and researchers need much more information to be able to translate our genetic language into useful health knowledge.</p>\n<p data-numbered=\"true\">One of the ways scientists can decipher meaning from within our 3 billion DNA “letters,” or nucleotides, is to compare human genes with those from animals, to see what has been kept the same and what has evolved to be different. . . .</p>\n<h2>Same and Different</h2>\n<p data-numbered=\"true\">In an approach called comparative genomics, scientists compare the genome sequences of several species: human, mouse, and a wide variety of other organisms from single-celled fungi to elephants and, now, the platypus.</p>\n<p data-numbered=\"true\">The goal of this research is to find regions of similarity and difference in order to better understand the structure and function of human genes.</p>\n<p data-numbered=\"true\">Comparative genomics is directly related to evolution because all living things share a common ancestor. By using computer tools to examine genes that have been kept the same in many organisms over millions of years, researchers can locate signals that control how genes work. This information may translate into ways to understand, treat, and prevent human diseases. . . .</p>\n<h2>Chicken or Egg?</h2>\n<p data-numbered=\"true\">When researchers analyzed platypus DNA and compared it to that of chickens, snakes, and lizards, the findings traced the evolutionary path from birds and reptiles to mammals. They learned that the platypus lost most of its genetic ability to produce egg yolk—as compared to chicken genes. This suggests its departure from “chicken-ness.”</p>\n<p data-numbered=\"true\">But, through evolutionary change, the platypus gained the ability to make milk that is rich in nutrients. Platypuses have genes that make the milk protein casein: just like we do.</p>\n<p data-numbered=\"true\">A male platypus can, like its ancestral snake and lizard cousins, produce venom. The platypus ejects this venom through special glands in its back legs. The evolutionary reason for maintaining such molecular weaponry isn’t yet clear, but what is fascinating is that it appears nature mixed and matched together DNA pieces separately to create the venom genes in reptiles and monotremes like the platypus.</p>\n<p data-numbered=\"true\">The scientific value of pinning genetics to physiological function—like milk production—is high. Such investigations may help medical researchers understand health issues related to reproduction and lactation. Although lactation is an ancient reproductive trait, mammals—including the platypus—are unique in their ability to produce milk that is extraordinarily nutritious, containing a rich blend of sugars, fats, and proteins.</p>\n<p data-numbered=\"true\">More generally, though, studying how nature cuts and pastes gene modules gives scientists an inside scoop on how genetic changes relate to health and disease risk.</p>\n<p data-numbered=\"true\">One thing is clear—the stunning blend of reptile, bird, and mammal puts the platypus in a class of its own, and it gives researchers much more: information about how mammals like us came about.</p>\n<p data-numbered=\"true\">[Scientists’] genetic sleuthing of platypuses, chimps, fish, sunflowers—you name it—continues to teach scientists how millions of years of evolution progressed. This provides vital information to understanding the role of genes in the health and disease of mammals like us and our pets, and can also help preserve our rich and diverse planet.</p>",
    sourceNote: "From “Research Riddle Resolved”—Public Domain/National Institutes of Health",
    text: excerptFromResearchRiddleResolved20192020FormAPassageText,
    versionLabel: "2019–2020 Form A",
  }),
  questions: excerptFromResearchRiddleResolved20192020FormAQuestions,
};
