import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageText = "Friends and fellow citizens: I stand before you tonight under indictment for the alleged crime of having voted at the last presidential election, without having a lawful right to vote. It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights, guaranteed to me and all United States citizens by the National Constitution, beyond the power of any state to deny.\n\nThe preamble of the Federal Constitution says: “We, the people of the United States, in order to form a more perfect union, establish justice, insure domestic tranquillity, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution for the United States of America.”\n\nIt was we, the people; not we, the white male citizens; nor yet we, the male citizens; but we, the whole people, who formed the Union. And we formed it, not to give the blessings of liberty, but to secure them; not to the half of ourselves and the half of our posterity, but to the whole people — women as well as men. And it is a downright mockery to talk to women of their enjoyment of the blessings of liberty while they are denied the use of the only means of securing them provided by this democratic-republican government — the ballot.\n\nFor any state to make sex a qualification that must ever result in the disfranchisement of one entire half of the people, is to pass a bill of attainder, or, an ex post facto law, and is therefore a violation of the supreme law of the land. By it the blessings of liberty are forever withheld from women and their female posterity.\n\nTo them this government has no just powers derived from the consent of the governed. To them this government is not a democracy. It is not a republic. It is an odious aristocracy; a hateful oligarchy of sex; the most hateful aristocracy ever established on the face of the globe; an oligarchy of wealth, where the rich govern the poor. An oligarchy of learning, where the educated govern the ignorant, or even an oligarchy of race, where the Saxon rules the African, might be endured; but this oligarchy of sex, which makes father, brothers, husband, sons, the oligarchs over the mother and sisters, the wife and daughters, of every household — which ordains all men sovereigns, all women subjects, carries dissension, discord, and rebellion into every home of the nation.\n\nWebster, Worcester, and Bouvier all define a citizen to be a person in the United States, entitled to vote and hold office.\n\nThe only question left to be settled now is: Are women persons? And I hardly believe any of our opponents will have the hardihood to say they are not. Being persons, then, women are citizens; and no state has a right to make any law, or to enforce any old law, that shall abridge their privileges or immunities. Hence, every discrimination against women in the constitutions and laws of the several states is today null and void, precisely as is every one against Negroes.";

const excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-1",
    "explanation": "The speech's central argument, developed through the preamble's own words and the citizen-persons-voters chain of reasoning, is that the Constitution already secures the vote to women as citizens and that state laws denying it are therefore invalid, not merely that the speaker's arrest was a technical error or a claim about dictionaries or state governments generally.",
    "explanationHtml": "<p>The speech's central argument, developed through the preamble's own words and the citizen-persons-voters chain of reasoning, is that the Constitution already secures the vote to women as citizens and that state laws denying it are therefore invalid, not merely that the speaker's arrest was a technical error or a claim about dictionaries or state governments generally.</p>",
    "points": 1,
    "prompt": "Which statement best expresses the central idea of the speech?",
    "promptHtml": "Which statement best expresses the central idea of the speech?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Dictionaries have never agreed on a single definition of the word &quot;citizen.&quot;",
        "text": "Dictionaries have never agreed on a single definition of the word \"citizen.\""
      },
      {
        "id": "B",
        "html": "The Constitution's own language already grants women, as citizens, the right to vote.",
        "text": "The Constitution's own language already grants women, as citizens, the right to vote."
      },
      {
        "id": "C",
        "html": "State governments have historically been more supportive of women's rights than the federal government.",
        "text": "State governments have historically been more supportive of women's rights than the federal government."
      },
      {
        "id": "D",
        "html": "The speaker was wrongly punished for a minor legal misunderstanding that could easily be corrected.",
        "text": "The speaker was wrongly punished for a minor legal misunderstanding that could easily be corrected."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-2",
    "explanation": "This sentence directly and explicitly denies that only white or male citizens formed the Union and asserts that \"the whole people\" did, which is the clearest textual support for the specific claim about who established the Constitution; the other choices concern the speaker's legal case or the definition of citizenship rather than who formed the Union.",
    "explanationHtml": "<p>This sentence directly and explicitly denies that only white or male citizens formed the Union and asserts that &quot;the whole people&quot; did, which is the clearest textual support for the specific claim about who established the Constitution; the other choices concern the speaker's legal case or the definition of citizenship rather than who formed the Union.</p>",
    "points": 1,
    "prompt": "Which sentence from the speech best supports the claim that the Constitution was established by all of the people, not only men?",
    "promptHtml": "Which sentence from the speech best supports the claim that the Constitution was established by all of the people, not only men?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "&quot;Being persons, then, women are citizens; and no state has a right to make any law...that shall abridge their privileges.&quot; (paragraph 7)",
        "text": "\"Being persons, then, women are citizens; and no state has a right to make any law...that shall abridge their privileges.\" (paragraph 7)"
      },
      {
        "id": "B",
        "html": "&quot;It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights.&quot; (paragraph 1)",
        "text": "\"It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights.\" (paragraph 1)"
      },
      {
        "id": "C",
        "html": "&quot;It was we, the people...but we, the whole people, who formed the Union.&quot; (paragraph 3)",
        "text": "\"It was we, the people...but we, the whole people, who formed the Union.\" (paragraph 3)"
      },
      {
        "id": "D",
        "html": "&quot;Webster, Worcester, and Bouvier all define a citizen to be a person in the United States, entitled to vote and hold office.&quot; (paragraph 6)",
        "text": "\"Webster, Worcester, and Bouvier all define a citizen to be a person in the United States, entitled to vote and hold office.\" (paragraph 6)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-3",
    "explanation": "The sentence describes a state qualification that results in disfranchisement of \"one entire half of the people,\" naming the removal of voting rights in stark terms that underscore how serious and unjust that loss is, rather than signaling the speaker's own uncertainty, minimizing how many women are affected, or softening her argument with neutral language.",
    "explanationHtml": "<p>The sentence describes a state qualification that results in disfranchisement of &quot;one entire half of the people,&quot; naming the removal of voting rights in stark terms that underscore how serious and unjust that loss is, rather than signaling the speaker's own uncertainty, minimizing how many women are affected, or softening her argument with neutral language.</p>",
    "points": 1,
    "prompt": "The speaker's use of the word \"disfranchisement\"¹ in paragraph 4 is most likely intended to",
    "promptHtml": "The speaker's use of the word &quot;disfranchisement&quot;¹ in paragraph 4 is most likely intended to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggest that the speaker herself does not fully understand the legal term she is using.",
        "text": "suggest that the speaker herself does not fully understand the legal term she is using."
      },
      {
        "id": "B",
        "html": "imply that only a small handful of women have ever actually been denied the ballot.",
        "text": "imply that only a small handful of women have ever actually been denied the ballot."
      },
      {
        "id": "C",
        "html": "soften the speech's argument by using a more neutral, technical-sounding term.",
        "text": "soften the speech's argument by using a more neutral, technical-sounding term."
      },
      {
        "id": "D",
        "html": "underscore how serious and unjust the loss of voting rights is for the women affected.",
        "text": "underscore how serious and unjust the loss of voting rights is for the women affected."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-4",
    "explanation": "The definitions of \"citizen\" and the bill-of-attainder comparison both rest on legal reasoning and cited authorities, while the \"odious aristocracy\" and \"downright mockery\" language relies on emotionally charged word choice rather than legal citation, so the first and third excerpts sort into the reasoned-argument bucket and the second and fourth sort into the emotional-appeal bucket.",
    "explanationHtml": "<p>The definitions of &quot;citizen&quot; and the bill-of-attainder comparison both rest on legal reasoning and cited authorities, while the &quot;odious aristocracy&quot; and &quot;downright mockery&quot; language relies on emotionally charged word choice rather than legal citation, so the first and third excerpts sort into the reasoned-argument bucket and the second and fourth sort into the emotional-appeal bucket.</p>",
    "points": 1,
    "prompt": "Drag each excerpt from the speech into the bucket that best names the persuasive appeal it primarily relies on.",
    "instructions": "Move each answer to the correct box.",
    "promptHtml": "Drag each excerpt from the speech into the bucket that best names the persuasive appeal it primarily relies on.",
    "topic": "Central Idea & Theme",
    "categories": [
      {
        "id": "category-1",
        "title": "Appeal grounded in reasoned legal argument"
      },
      {
        "id": "category-2",
        "title": "Appeal grounded in strong emotional language"
      }
    ],
    "correctPlacements": {
      "item-1": "category-1",
      "item-2": "category-2",
      "item-3": "category-1",
      "item-4": "category-2"
    },
    "items": [
      {
        "html": "1. \"Webster, Worcester, and Bouvier all define a citizen to be a person...entitled to vote and hold office.\"",
        "id": "item-1",
        "text": "1. \"Webster, Worcester, and Bouvier all define a citizen to be a person...entitled to vote and hold office.\""
      },
      {
        "html": "2. \"It is an odious aristocracy; a hateful oligarchy of sex...the most hateful aristocracy ever established on the face of the globe.\"",
        "id": "item-2",
        "text": "2. \"It is an odious aristocracy; a hateful oligarchy of sex...the most hateful aristocracy ever established on the face of the globe.\""
      },
      {
        "html": "3. \"For any state to make sex a qualification...is to pass a bill of attainder, or, an ex post facto law.\"",
        "id": "item-3",
        "text": "3. \"For any state to make sex a qualification...is to pass a bill of attainder, or, an ex post facto law.\""
      },
      {
        "html": "4. \"It is a downright mockery to talk to women of their enjoyment of the blessings of liberty.\"",
        "id": "item-4",
        "text": "4. \"It is a downright mockery to talk to women of their enjoyment of the blessings of liberty.\""
      }
    ],
    "requiredPlacements": 4,
    "type": "category_sort"
  },
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-5",
    "explanation": "The speaker states directly that \"every discrimination against women in the constitutions and laws of the several states is today null and void,\" a claim that treats unconstitutional laws as already invalid the instant they conflict with the Constitution, not as binding until formally struck down, tolerable until opinion shifts, or a lesser concern next to economic policy.",
    "explanationHtml": "<p>The speaker states directly that &quot;every discrimination against women in the constitutions and laws of the several states is today null and void,&quot; a claim that treats unconstitutional laws as already invalid the instant they conflict with the Constitution, not as binding until formally struck down, tolerable until opinion shifts, or a lesser concern next to economic policy.</p>",
    "points": 1,
    "prompt": "With which statement about laws that conflict with the Constitution would the speaker most likely agree?",
    "promptHtml": "With which statement about laws that conflict with the Constitution would the speaker most likely agree?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Such laws should stay in effect until a broader public consensus forms against them.",
        "text": "Such laws should stay in effect until a broader public consensus forms against them."
      },
      {
        "id": "B",
        "html": "Such laws remain legally binding until a court or legislature formally repeals them.",
        "text": "Such laws remain legally binding until a court or legislature formally repeals them."
      },
      {
        "id": "C",
        "html": "Such laws matter less to her than the era's economic policy debates and disputes.",
        "text": "Such laws matter less to her than the era's economic policy debates and disputes."
      },
      {
        "id": "D",
        "html": "Such laws are already invalid the instant they conflict with the Constitution, repeal or not.",
        "text": "Such laws are already invalid the instant they conflict with the Constitution, repeal or not."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3-passage-6",
    "explanation": "Naming three respected dictionary and legal authorities right before asking \"Are women persons?\" gives her key premise — that a citizen is defined as a person entitled to vote — independent, authoritative backing, which she then uses to build her next step of reasoning, rather than serving as entertainment, an apology, or evidence against her.",
    "explanationHtml": "<p>Naming three respected dictionary and legal authorities right before asking &quot;Are women persons?&quot; gives her key premise — that a citizen is defined as a person entitled to vote — independent, authoritative backing, which she then uses to build her next step of reasoning, rather than serving as entertainment, an apology, or evidence against her.</p>",
    "points": 1,
    "prompt": "The speaker most likely cites Webster, Worcester, and Bouvier in paragraph 6 in order to",
    "promptHtml": "The speaker most likely cites Webster, Worcester, and Bouvier in paragraph 6 in order to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "apologize in advance to the audience for using a legal term they might not fully understand.",
        "text": "apologize in advance to the audience for using a legal term they might not fully understand."
      },
      {
        "id": "B",
        "html": "entertain the audience with a list of well-known reference books published earlier that era.",
        "text": "entertain the audience with a list of well-known reference books published earlier that era."
      },
      {
        "id": "C",
        "html": "lend independent, authoritative support to her definition of &quot;citizen&quot; before her next claim.",
        "text": "lend independent, authoritative support to her definition of \"citizen\" before her next claim."
      },
      {
        "id": "D",
        "html": "suggest, somewhat surprisingly, that these dictionary writers disagree with her own position.",
        "text": "suggest, somewhat surprisingly, that these dictionary writers disagree with her own position."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-on-women-s-right-to-vote-digital-shsat-practice-test-3",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"On Women’s Right to Vote\"",
    author: "Susan B. Anthony",
    blurb: "The following is adapted from a speech Susan B. Anthony delivered in 1873, arguing that the Constitution already guaranteed women the right to vote, after her arrest for casting a ballot in a presidential election.",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>Friends and fellow citizens: I stand before you tonight under indictment for the alleged crime of having voted at the last presidential election, without having a lawful right to vote. It shall be my work this evening to prove to you that in thus voting, I not only committed no crime, but, instead, simply exercised my citizen's rights, guaranteed to me and all United States citizens by the National Constitution, beyond the power of any state to deny.</p><p>The preamble of the Federal Constitution says: “We, the people of the United States, in order to form a more perfect union, establish justice, insure domestic tranquillity, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution for the United States of America.”</p><p>It was we, the people; not we, the white male citizens; nor yet we, the male citizens; but we, the whole people, who formed the Union. And we formed it, not to give the blessings of liberty, but to secure them; not to the half of ourselves and the half of our posterity, but to the whole people — women as well as men. And it is a downright mockery to talk to women of their enjoyment of the blessings of liberty while they are denied the use of the only means of securing them provided by this democratic-republican government — the ballot.</p><p>For any state to make sex a qualification that must ever result in the disfranchisement of one entire half of the people, is to pass a bill of attainder, or, an ex post facto law, and is therefore a violation of the supreme law of the land. By it the blessings of liberty are forever withheld from women and their female posterity.</p><p>To them this government has no just powers derived from the consent of the governed. To them this government is not a democracy. It is not a republic. It is an odious aristocracy; a hateful oligarchy of sex; the most hateful aristocracy ever established on the face of the globe; an oligarchy of wealth, where the rich govern the poor. An oligarchy of learning, where the educated govern the ignorant, or even an oligarchy of race, where the Saxon rules the African, might be endured; but this oligarchy of sex, which makes father, brothers, husband, sons, the oligarchs over the mother and sisters, the wife and daughters, of every household — which ordains all men sovereigns, all women subjects, carries dissension, discord, and rebellion into every home of the nation.</p><p>Webster, Worcester, and Bouvier all define a citizen to be a person in the United States, entitled to vote and hold office.</p><p>The only question left to be settled now is: Are women persons? And I hardly believe any of our opponents will have the hardihood to say they are not. Being persons, then, women are citizens; and no state has a right to make any law, or to enforce any old law, that shall abridge their privileges or immunities. Hence, every discrimination against women in the constitutions and laws of the several states is today null and void, precisely as is every one against Negroes.</p>",
    text: excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3PassageText,
    versionLabel: "Digital SHSAT Practice Test 3",
  }),
  questions: excerptFromOnWomenSRightToVoteDigitalShsatPracticeTest3Questions,
};
