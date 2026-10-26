import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromTheFoodBusinessIncubator2023FormAPassageText = "“La Cocina” means “the kitchen” in Spanish. It’s also the name of a business incubator based in San Francisco’s Mission District. Since it began in 2005, it’s been helping local food entrepreneurs, many of whom are low-income immigrant women, develop their small businesses.\n\nOver the years, many of its alumni have found success: more than 50 chefs in its program have become self-sufficient business owners, and many of them have opened their own brick-and-mortar restaurants. Two alumnae of its culinary program . . . were even recognized as semi-finalists for prestigious James Beard awards.\n\nA new cookbook, We Are La Cocina: Recipes in Pursuit of the American Dream, tells some of their stories.\n\nExecutive director Caleb Zigas says the nonprofit La Cocina grew out of two grassroots economic development organizations who found many people cooking at their homes and selling food on the streets. The vendors needed an affordable commercial kitchen space and technical assistance in order for their businesses to be legally viable. La Cocina provided just such a space, in addition to helping them develop business plans, pull city permits and more.\n\nZigas says as many as eight businesses can work in the kitchen space at La Cocina at any one time. Some can prep for a farmers’ market sale, corporate catering gigs or weddings, while others might be making and packaging their food products.\n\n“It’s just an incredible and exciting range of techniques, flavors, perspectives, age, language. And that’s a really beautiful thing,” he says. . . .\n\nTwice a year, La Cocina hosts “F&B: Voices from the Kitchen,” a storytelling project where their chefs can tell their own stories, as they do in the new cookbook. Some of the chefs will be on tour to promote the book, whose proceeds will go to support La Cocina entrepreneurs.\n\nNPR caught up with . . . La Cocina chefs, who shared their stories:\n\nMariko Grady, Aedan Fermented Foods\n\nAt La Cocina, you can often hear Mariko Grady singing or humming as she prepares miso, koji, and amasake. Her fermented products come in four different flavors, including mushroom and chicken, to be used in soups and sauces. She originally brought the fermenting rice and barley koji seeds from Japan, where she had a 30-year career as a singer and dancer with the prestigious modern theatrical dance group she founded, Pappa Tarahumara. They performed around the world, and 16 years ago, had a one-night show in San Francisco. The man who would become her husband was in the audience. She soon joined him in San Francisco, often returning to Tokyo to rehearse. But after the earthquake and tsunami hit Japan in 2011, her company disbanded. . . . Grady focused on nourishing her family and creating a line of fermented products that she sells online, at local Bay Area stores and at the Ferry Plaza Farmers Market. She began at La Cocina in 2012 and named her business after her son, Aedan. (Written in Kanji characters, the name means “wisdom” and “handed down from generation to generation.”) . . . Her fermented products are “also full of wisdom about how to relate to nature and how to create a healthy life,” she says. . . .\n\nShani Jones, Peaches Patties\n\nShani Jones is a native San Franciscan. Her father was born in New Orleans, her mother, in Jamaica. She says their home was always filled with a variety of spices and dishes like jerk chicken and Jamaican patties—savory pastries filled with beef or chicken. Jones says she learned to cook from her mother, whose nickname was Peaches. After returning from college in Atlanta, Jones worked on her doctorate in organizational leadership and management while driving a Lyft car. She often told passengers about her idea of opening a catering company with her mom’s recipes. They steered her to La Cocina, where she developed her own business, named after her mother. Five years later, she caters and runs a kiosk at a small food cooperative in Bernal Heights, where some of her handmade patties have an Ethiopian twist, “because my husband is Ethiopian.” Jones has big aspirations for Peaches Patties: “The ultimate goal,” she says, “is to be the patty kingpin of the West Coast.”";

const excerptFromTheFoodBusinessIncubator2023FormAQuestions: ExamQuestion[] = [
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q31",
    "explanation": "The question asks what the words “recognized” and “prestigious” convey about La Cocina.\n\nA. Incorrect. While later information indicates that La Cocina bases its choices on the work ethic of entrepreneurs as well as their financial needs, the use of the words “recognized” and “prestigious” in the context of the sentence is not related to the work ethic of the chefs.\n\nB. CORRECT. The fact that alumni of the La Cocina program have received recognition as semi-finalists for prestigious awards shows that La Cocina has helped members of its program achieve at the highest level.\n\nC. Incorrect. As paragraph 1 indicates, La Cocina focuses on helping local food entrepreneurs develop their small businesses. While some participants in the program have earned official recognition, La Cocina is not primarily focused on establishing entrepreneurs as celebrated professionals.\n\nD. Incorrect. La Cocina assists chefs with the development of their small businesses, not necessarily with their development of specific products.",
    "points": 1,
    "prompt": "Read this sentence from paragraph 2.\n\nTwo alumnae of its culinary program . . . were even recognized as semi-finalists for prestigious James Beard awards.\n\nThe words “recognized” and “prestigious” in the sentence convey that La Cocina",
    "promptHtml": "<p>Read this sentence from paragraph 2.</p><blockquote><strong><strong>Two alumnae of its culinary program . . . were even recognized as semi-finalists for prestigious James Beard awards.</strong></strong></blockquote><p>The words “recognized” and “prestigious” in the sentence convey that La Cocina</p>",
    "topic": "Word & Phrase Meaning",
    "choices": [
      {
        "id": "A",
        "text": "makes an effort to identify chefs who have a strong entrepreneurial work ethic."
      },
      {
        "id": "B",
        "text": "has the ability to mentor chefs to reach the highest levels of achievement in their craft."
      },
      {
        "id": "C",
        "text": "is focused on establishing local food entrepreneurs as celebrated professionals in their industry."
      },
      {
        "id": "D",
        "text": "is dedicated to assisting chefs in developing new and innovative products."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q32",
    "explanation": "The question asks how paragraph 4 contributes to the development of ideas about La Cocina in paragraph 1.\n\nA. CORRECT. Paragraph 4 lists ways that La Cocina provides support to local food entrepreneurs. This supports the statement in paragraph 1 that La Cocina has been “helping local food entrepreneurs, many of whom are low-income immigrant women, develop their small businesses.”\n\nB. Incorrect. Paragraph 1 simply states that La Cocina tries to help local food entrepreneurs develop their businesses, but neither paragraph describes or mentions any goals that La Cocina sets for local food entrepreneurs.\n\nC. Incorrect. While paragraph 4 mentions some background information on where local food entrepreneurs were found, these details do not directly support any ideas in paragraph 1.\n\nD. Incorrect. The description of the process by which Caleb Zigas realized there was a need for La Cocina provides background for the organization, but it does not directly support any ideas in paragraph 1.",
    "points": 1,
    "prompt": "Paragraph 4 contributes to the development of ideas about La Cocina in paragraph 1 by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "specifying how La Cocina helps local food entrepreneurs become successful."
      },
      {
        "id": "B",
        "text": "explaining what kind of goals La Cocina tries to set for local food entrepreneurs."
      },
      {
        "id": "C",
        "text": "providing background information about local food entrepreneurs in San Francisco."
      },
      {
        "id": "D",
        "text": "describing how Caleb Zigas discovered the need to provide assistance to local food entrepreneurs."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q33",
    "explanation": "The question asks how the description of Mariko Grady’s background in paragraph 9 contributes to a central idea in the excerpt.\n\nA. Incorrect. The paragraph about Mariko Grady describes her earlier success in the field of theatrical dance and how she later started her own small cooking business. It does not describe what she was looking for when she came to La Cocina.\n\nB. Incorrect. The excerpt does not argue that La Cocina is the best option for people starting out in the food business, and the description in paragraph 9 does not support that idea.\n\nC. CORRECT. The detailed background story of Mariko Grady describes that Grady started a small food business after working as “a singer and dancer with the prestigious modern theatrical dance group she founded” and then, after that ended, created a fermented food product line. This information contributes to a central idea in the excerpt that many of the people working with La Cocina, like Grady, “needed an affordable commercial kitchen space and technical assistance in order for their businesses to be legally viable. La Cocina provided just such a space, in addition to helping them develop business plans, pull city permits and more” (paragraph 4).\n\nD. Incorrect. While Mariko Grady is now a food business owner that La Cocina has helped since 2012, Grady’s story does more to illustrate how people from non-business backgrounds can receive special support from La Cocina in order to do more with their business.",
    "points": 1,
    "prompt": "The description of Mariko Grady’s background in paragraph 9 contributes to a central idea in the excerpt by",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "text": "demonstrating what people are looking for when they come to La Cocina."
      },
      {
        "id": "B",
        "text": "explaining why La Cocina is the best option for people starting out in the food business."
      },
      {
        "id": "C",
        "text": "showing how La Cocina can help people find success in the food business even though they have a background in something different."
      },
      {
        "id": "D",
        "text": "confirming that La Cocina was originally established for small business owners who are looking to expand their services."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q34",
    "explanation": "The question asks with which statement the author would most likely agree.\n\nA. Incorrect. The author does not suggest at any point that La Cocina would like to expand its work and mission to other cities.\n\nB. Incorrect. While the author describes some of the work of talented chefs from La Cocina, at no point does the author imply that the many food choices that exist in San Francisco are because of La Cocina.\n\nC. Incorrect. While the author does describe how La Cocina can help entrepreneurs find success, at no point does the author suggest that La Cocina can guarantee success.\n\nD. CORRECT. The descriptions of the income requirements as well as the information that some of the chefs are James Beard award recipients and others have achieved success with their businesses all help show that the author admires the work of La Cocina in helping chefs who have few resources.",
    "points": 1,
    "prompt": "Which statement would the author most likely agree with?",
    "promptHtml": "Which statement would the author <strong>most likely</strong> agree with?",
    "topic": "Author's Point of View",
    "choices": [
      {
        "id": "A",
        "text": "The publicity efforts La Cocina engages in will help its business design spread to other cities."
      },
      {
        "id": "B",
        "text": "The variety of exciting food available in San Francisco is due to the work of La Cocina."
      },
      {
        "id": "C",
        "text": "La Cocina offers a method that will guarantee business ownership for qualified entrepreneurs."
      },
      {
        "id": "D",
        "text": "La Cocina does admirable work in supporting the efforts of ambitious cooks who may have few resources."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q35",
    "explanation": "The question asks which detail would be most important to include in a summary of the excerpt.\n\nA. Incorrect. The detail about the cookbook that includes members’ stories is mentioned briefly but not developed and should not be included in a summary.\n\nB. CORRECT. The fact that La Cocina provides legal and technical assistance is a key factor in the success of the chefs who participate. Paragraph 4 explains that La Cocina provides technical and legal assistance by helping businesses navigate city permits and meet other challenges. This detail supports the central idea by sharing how La Cocina helps food entrepreneurs expand their businesses.\n\nC. Incorrect. The specific requirements for chefs to be accepted at La Cocina are lesser details and should not be included in a summary.\n\nD. Incorrect. Paragraph 5 indicates that vendors from La Cocina sell their food at various venues, including farmers’ markets or corporate events. However, this is a detail that is not developed at any length and should not be included in a summary.",
    "points": 1,
    "prompt": "Which detail would be most important to include in a summary of the excerpt?",
    "promptHtml": "Which detail would be <strong>most</strong> important to include in a summary of the excerpt?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "text": "La Cocina produced a cookbook that includes some members’ stories."
      },
      {
        "id": "B",
        "text": "La Cocina provides legal and technical assistance to its members."
      },
      {
        "id": "C",
        "text": "Potential vendors need a market for their food before considering La Cocina."
      },
      {
        "id": "D",
        "text": "There are different types of venues that food vendors from La Cocina use."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-the-food-business-incubator-2023-form-a-2023-form-a-q36",
    "explanation": "The question asks how the table provides additional support for a central idea of the excerpt.\n\nA. Incorrect. The table describes the requirements that allow food entrepreneurs to qualify to participate in La Cocina. While the table does mention that applicants without a business plan must contact one of La Cocina’s partner organizations, it does not specifically explain how La Cocina works with these partner organizations to help educate successful applicants.\n\nB. Incorrect. The table describes the ways entrepreneur chefs must qualify in order to be accepted into La Cocina, not how their businesses can be successful after they leave.\n\nC. Incorrect. While the table mentions community spirit, this is in reference to the type of energy La Cocina wishes to establish within its group kitchen space. The excerpt and table do not discuss providing food to different communities within or outside San Francisco as specific goals of La Cocina.\n\nD. CORRECT. A central idea of the excerpt is that La Cocina helps local food entrepreneurs develop their businesses. The table lists requirements for people who want to participate in La Cocina. They must be willing to work hard to promote their own businesses as they use the resources that La Cocina provides.",
    "points": 1,
    "prompt": "The table provides additional support for a central idea of the excerpt by",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "text": "showing how La Cocina works with partner organizations to further educate and advance successful applicants within the food industry."
      },
      {
        "id": "B",
        "text": "explaining how applicants are prepared to develop their own businesses once they leave La Cocina."
      },
      {
        "id": "C",
        "text": "establishing that La Cocina is dedicated to its mission to provide delicious food to different communities."
      },
      {
        "id": "D",
        "text": "emphasizing that applicants must be willing to dedicate time to promoting and developing their business with La Cocina."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  }
];

export const excerptFromTheFoodBusinessIncubator2023FormAPassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-the-food-business-incubator-2023-form-a",
  section: "reading",
  questionCount: excerptFromTheFoodBusinessIncubator2023FormAQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-the-food-business-incubator-2023-form-a",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from “The Food Business Incubator”",
    author: "Mandalit Del Barco",
    byline: "by Mandalit Del Barco",
    image: {"alt":"Excerpt from “The Food Business Incubator” illustration","src":"/exam-images/excerpt-from-the-food-business-incubator-2023-form-a-passage.png"},
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p data-numbered=\"true\">“La Cocina” means “the kitchen” in Spanish. It’s also the name of a <span data-glossary-definition=\"company that helps new and startup companies develop by providing services such as management training and office space\" role=\"link\" tabindex=\"0\">business incubator</span> based in San Francisco’s Mission District. Since it began in 2005, it’s been helping local food entrepreneurs, many of whom are low-income immigrant women, develop their small businesses.</p><p data-numbered=\"true\">Over the years, many of its alumni have found success: more than 50 chefs in its program have become self-sufficient business owners, and many of them have opened their own brick-and-mortar restaurants. Two alumnae of its culinary program . . . were even recognized as semi-finalists for prestigious <span data-glossary-definition=\"an award named after American cook and author James Beard, considered one of the highest honors in the culinary industry\" role=\"link\" tabindex=\"0\">James Beard awards</span>.</p><p data-numbered=\"true\">A new cookbook, <em>We Are La Cocina: Recipes in Pursuit of the American Dream</em>, tells some of their stories.</p><p data-numbered=\"true\">Executive director Caleb Zigas says the nonprofit La Cocina grew out of two grassroots <span data-glossary-definition=\"organizations whose mission is to promote economic improvement within a specific geographical area\" role=\"link\" tabindex=\"0\">economic development organizations</span> who found many people cooking at their homes and selling food on the streets. The vendors needed an affordable commercial kitchen space and technical assistance in order for their businesses to be legally viable. La Cocina provided just such a space, in addition to helping them develop business plans, pull city permits and more.</p><p data-numbered=\"true\">Zigas says as many as eight businesses can work in the kitchen space at La Cocina at any one time. Some can prep for a farmers’ market sale, corporate catering gigs or weddings, while others might be making and packaging their food products.</p><p data-numbered=\"true\">“It’s just an incredible and exciting range of techniques, flavors, perspectives, age, language. And that’s a really beautiful thing,” he says. . . .</p><p data-numbered=\"true\">Twice a year, La Cocina hosts “F&amp;B: Voices from the Kitchen,” a storytelling project where their chefs can tell their own stories, as they do in the new cookbook. Some of the chefs will be on tour to promote the book, whose proceeds will go to support La Cocina entrepreneurs.</p><p data-numbered=\"true\"><span data-glossary-definition=\"National Public Radio, a nonprofit media organization that produces and distributes news and cultural programming\" role=\"link\" tabindex=\"0\">NPR</span> caught up with . . . La Cocina chefs, who shared their stories:</p><h3>Mariko Grady, Aedan Fermented Foods</h3><p data-numbered=\"true\">At La Cocina, you can often hear Mariko Grady singing or humming as she prepares miso, <em>koji</em>, and <em>amasake</em>. Her fermented products come in four different flavors, including mushroom and chicken, to be used in soups and sauces. She originally brought the fermenting rice and barley <em>koji</em> seeds from Japan, where she had a 30-year career as a singer and dancer with the prestigious modern theatrical dance group she founded, Pappa Tarahumara. They performed around the world, and 16 years ago, had a one-night show in San Francisco. The man who would become her husband was in the audience. She soon joined him in San Francisco, often returning to Tokyo to rehearse. But after the earthquake and tsunami hit Japan in 2011, her company disbanded. . . . Grady focused on nourishing her family and creating a line of fermented products that she sells online, at local Bay Area stores and at the Ferry Plaza Farmers Market. She began at La Cocina in 2012 and named her business after her son, Aedan. (Written in Kanji characters, the name means “wisdom” and “handed down from generation to generation.”) . . . Her fermented products are “also full of wisdom about how to relate to nature and how to create a healthy life,” she says. . . .</p><h3>Shani Jones, Peaches Patties</h3><p data-numbered=\"true\">Shani Jones is a native San Franciscan. Her father was born in New Orleans, her mother, in Jamaica. She says their home was always filled with a variety of spices and dishes like jerk chicken and Jamaican patties—savory pastries filled with beef or chicken. Jones says she learned to cook from her mother, whose nickname was Peaches. After returning from college in Atlanta, Jones worked on her doctorate in organizational leadership and management while driving a <span data-glossary-definition=\"ride-sharing company where people use their own cars to provide rides to customers\" role=\"link\" tabindex=\"0\">Lyft</span> car. She often told passengers about her idea of opening a catering company with her mom’s recipes. They steered her to La Cocina, where she developed her own business, named after her mother. Five years later, she caters and runs a <span data-glossary-definition=\"cart or small structure with one or more open sides that is used to vend merchandise or services\" role=\"link\" tabindex=\"0\">kiosk</span> at a small food cooperative in Bernal Heights, where some of her handmade patties have an Ethiopian twist, “because my husband is Ethiopian.” Jones has big aspirations for Peaches Patties: “The ultimate goal,” she says, “is to be the patty <span data-glossary-definition=\"the leader in a group or undertaking\" role=\"link\" tabindex=\"0\">kingpin</span> of the West Coast.”</p>",
    sourceNote: "From “The Food Business Incubator That Helps Immigrant Women Pursue The American Dream” by Mandalit Del Barco from WEEKEND EDITION SUNDAY, June 19, 2019. Copyright © 2019 NPR.\n\nSource: La Cocina",
    text: excerptFromTheFoodBusinessIncubator2023FormAPassageText,
    versionLabel: "2023 Form A",
  }),
  questions: excerptFromTheFoodBusinessIncubator2023FormAQuestions,
};
