import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const excerptFromLittleWomenDigitalShsatPracticeTest2PassageText = "\"Christmas won't be Christmas without any presents,\" grumbled Jo, lying on the rug.\n\n\"It's so dreadful to be poor!\" sighed Meg, looking down at her old dress.\n\n\"I don't think it's fair for some girls to have plenty of pretty things, and other girls nothing at all,\" added little Amy, with an injured sniff.\n\n\"We've got father and mother and each other,\" said Beth contentedly, from her corner.\n\nThe four young faces on which the firelight shone brightened at the cheerful words, but darkened again as Jo said sadly,--\n\n\"We haven't got father, and shall not have him for a long time.\" She didn't say \"perhaps never,\" but each silently added it, thinking of father far away, where the fighting was.\n\nNobody spoke for a minute; then Meg said in an altered tone,--\n\n\"You know the reason mother proposed not having any presents this Christmas was because it is going to be a hard winter for every one; and she thinks we ought not to spend money for pleasure, when our men are suffering so in the army. We can't do much, but we can make our little sacrifices, and ought to do it gladly. But I am afraid I don't;\" and Meg shook her head, as she thought regretfully of all the pretty things she wanted.\n\n\"But I don't think the little we should spend would do any good. We've each got a dollar, and the army wouldn't be much helped by our giving that. I agree not to expect anything from mother or you, but I do want to buy Undine and Sintram for myself; I've wanted it so long,\" said Jo, who was a bookworm.\n\n\"I planned to spend mine in new music,\" said Beth, with a little sigh, which no one heard but the hearth-brush and kettle-holder.\n\n\"I shall get a nice box of Faber's drawing-pencils; I really need them,\" said Amy decidedly.\n\n\"Mother didn't say anything about our money, and she won't wish us to give up everything. Let's each buy what we want, and have a little fun; I'm sure we work hard enough to earn it,\" cried Jo, examining the heels of her shoes in a gentlemanly manner.\n\n\"I know I do,--teaching those tiresome children nearly all day, when I'm longing to enjoy myself at home,\" began Meg, in the complaining tone again.\n\n\"You don't have half such a hard time as I do,\" said Jo. \"How would you like to be shut up for hours with a nervous, fussy old lady, who keeps you trotting, is never satisfied, and worries you till you're ready to fly out of the window or cry?\"\n\n\"It's naughty to fret; but I do think washing dishes and keeping things tidy is the worst work in the world. It makes me cross; and my hands get so stiff, I can't practise well at all;\" and Beth looked at her rough hands with a sigh that any one could hear that time.\n\n\"I don't believe any of you suffer as I do,\" cried Amy; \"for you don't have to go to school with impertinent girls, who plague you if you don't know your lessons, and laugh at your dresses, and label your father if he isn't rich, and insult you when your nose isn't nice.\"\n\n\"If you mean libel, I'd say so, and not talk about labels, as if papa was a pickle-bottle,\" advised Jo, laughing.\n\n\"I know what I mean, and you needn't be statirical about it. It's proper to use good words, and improve your vocabilary,\" returned Amy, with dignity.\n\n\"Don't peck at one another, children. Don't you wish we had the money papa lost when we were little, Jo? Dear me! how happy and good we'd be, if we had no worries!\" said Meg, who could remember better times.\n\n\"You said the other day, you thought we were a deal happier than the King children, for they were fighting and fretting all the time, in spite of their money.\"\n\n\"So I did, Beth. Well, I think we are; for, though we do have to work, we make fun for ourselves, and are a pretty jolly set, as Jo would say.\"\n\n\"Jo does use such slang words!\" observed Amy, with a reproving look at the long figure stretched on the rug. Jo immediately sat up, put her hands in her pockets, and began to whistle.\n\n\"Don't, Jo; it's so boyish!\"\n\n\"That's why I do it.\"\n\n\"I detest rude, unlady-like girls!\"\n\n\"I hate affected, niminy-piminy chits!\"\n\n\"'Birds in their little nests agree,'\" sang Beth, the peace-maker, with such a funny face that both sharp voices softened to a laugh, and the \"pecking\" ended for that time.\n\n\"Really, girls, you are both to be blamed,\" said Meg, beginning to lecture in her elder-sisterly fashion. \"You are old enough to leave off boyish tricks, and to behave better, Josephine. It didn't matter so much when you were a little girl; but now you are so tall, and turn up your hair, you should remember that you are a young lady.\"\n\n\"I'm not! and if turning up my hair makes me one, I'll wear it in two tails till I'm twenty,\" cried Jo, pulling off her net, and shaking down a chestnut mane. \"I hate to think I've got to grow up, and be Miss March, and wear long gowns, and look as prim as a China-aster! It's bad enough to be a girl, anyway, when I like boys' games and work and manners! I can't get over my disappointment in not being a boy; and it's worse than ever now, for I'm dying to go and fight with papa, and I can only stay at home and knit, like a poky old woman!\" And Jo shook the blue army-sock till the needles rattled like castanets, and her ball bounded across the room.\n\n\"Poor Jo! It's too bad, but it can't be helped; so you must try to be contented with making your name boyish, and playing brother to us girls,\" said Beth, stroking the rough head at her knee with a hand that all the dish-washing and dusting in the world could not make ungentle in its touch.";

const excerptFromLittleWomenDigitalShsatPracticeTest2Questions: ExamQuestion[] = [
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-1",
    "explanation": "Correct Answer: A\nExplanation: The passage opens with the sisters' grumbling before sentence 5 explains that the father is away at war, so the reader shares their mood before learning its cause.\nA. Correct: The complaints come first and their cause is revealed only afterward, so readers share the sisters' mood before understanding it.\nB. Incorrect: The passage does not follow strict chronological order from the father's departure; it opens in the present with the sisters' complaints before any background is given.\nC. Incorrect: The passage is narrated from a single perspective describing all four sisters together, not alternating between the narrator and the mother.\nD. Incorrect: There is no flashback to an earlier, wealthier period; the passage stays in the present conversation by the fire throughout.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: The passage opens with the sisters' grumbling before sentence 5 explains that the father is away at war, so the reader shares their mood before learning its cause. <br><br>\nA. Correct: The complaints come first and their cause is revealed only afterward, so readers share the sisters' mood before understanding it. <br><br>\nB. Incorrect: The passage does not follow strict chronological order from the father's departure; it opens in the present with the sisters' complaints before any background is given. <br><br>\nC. Incorrect: The passage is narrated from a single perspective describing all four sisters together, not alternating between the narrator and the mother. <br><br>\nD. Incorrect: There is no flashback to an earlier, wealthier period; the passage stays in the present conversation by the fire throughout.</p>",
    "points": 1,
    "prompt": "How does the passage's structure most directly shape the reader's understanding of the sisters' financial situation?",
    "promptHtml": "How does the passage's structure <strong>most directly</strong> shape the reader's understanding of the sisters' financial situation?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It opens with the sisters' complaints and only gradually reveals their cause, so readers share the mood first and understand it later.",
        "text": "It opens with the sisters' complaints and only gradually reveals their cause, so readers share the mood first and understand it later."
      },
      {
        "id": "B",
        "html": "It presents the family's financial history in strict chronological order, beginning with their father's departure for the war and ending with the present moment by the fire.",
        "text": "It presents the family's financial history in strict chronological order, beginning with their father's departure for the war and ending with the present moment by the fire."
      },
      {
        "id": "C",
        "html": "It alternates between the perspective of the narrator and the perspective of the mother, contrasting their different attitudes toward the family's poverty and toward each other.",
        "text": "It alternates between the perspective of the narrator and the perspective of the mother, contrasting their different attitudes toward the family's poverty and toward each other."
      },
      {
        "id": "D",
        "html": "It uses a flashback to an earlier, wealthier period in the family's life before returning abruptly to the present conversation taking place by the fire.",
        "text": "It uses a flashback to an earlier, wealthier period in the family's life before returning abruptly to the present conversation taking place by the fire."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-2",
    "explanation": "Correct Answer: B\nExplanation: Meg says the family ought to make sacrifices gladly but admits, \"I am afraid I don't,\" showing she feels guilty about still wanting pretty things.\nA. Incorrect: Meg does not suggest complaining is pointless; her comment is about her own mixed feelings, not the family's prospects.\nB. Correct: Meg admits she does not gladly make sacrifices as she believes she should, showing guilt about still wanting nice things.\nC. Incorrect: Meg criticizes her own wish for pretty things, not her mother's suggestion, and shows no resentment toward her mother.\nD. Incorrect: Meg's comment is about her own guilt over wanting things, not about her sisters' behavior.",
    "explanationHtml": "<p>Correct Answer: B <br><br>\nExplanation: Meg says the family ought to make sacrifices gladly but admits, &quot;I am afraid I don't,&quot; showing she feels guilty about still wanting pretty things. <br><br>\nA. Incorrect: Meg does not suggest complaining is pointless; her comment is about her own mixed feelings, not the family's prospects. <br><br>\nB. Correct: Meg admits she does not gladly make sacrifices as she believes she should, showing guilt about still wanting nice things. <br><br>\nC. Incorrect: Meg criticizes her own wish for pretty things, not her mother's suggestion, and shows no resentment toward her mother. <br><br>\nD. Incorrect: Meg's comment is about her own guilt over wanting things, not about her sisters' behavior.</p>",
    "points": 1,
    "prompt": "What can be inferred about Meg's feelings toward her own complaints about money?",
    "promptHtml": "What can be inferred about Meg's feelings toward her own complaints about money?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "She believes complaining is pointless because their situation will never improve no matter what anyone does.",
        "text": "She believes complaining is pointless because their situation will never improve no matter what anyone does."
      },
      {
        "id": "B",
        "html": "She feels some guilt about still wanting nice things even though she believes the family should make sacrifices.",
        "text": "She feels some guilt about still wanting nice things even though she believes the family should make sacrifices."
      },
      {
        "id": "C",
        "html": "She resents her mother for suggesting that the family give up giving each other holiday presents again this year.",
        "text": "She resents her mother for suggesting that the family give up giving each other holiday presents again this year."
      },
      {
        "id": "D",
        "html": "She is more concerned with her sisters' bickering and behavior than with the family's actual day-to-day finances.",
        "text": "She is more concerned with her sisters' bickering and behavior than with the family's actual day-to-day finances."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-3",
    "explanation": "Correct Answer: A\nExplanation: Beth's line that they \"have got father and mother and each other\" and the sisters' later agreement that they are happier than richer, unhappier families both point to contentment despite hardship.\nA. Correct: Beth's and the other sisters' comments show they find contentment in their family bond even though money is scarce.\nB. Incorrect: The sisters are clearly aware of and openly discuss their financial struggles throughout the passage.\nC. Incorrect: The sisters' closeness is shown despite their poverty, not because wealth determines it.\nD. Incorrect: The sisters resolve their own disagreement themselves, through Beth's song, without any outside intervention.",
    "explanationHtml": "<p>Correct Answer: A <br><br>\nExplanation: Beth's line that they &quot;have got father and mother and each other&quot; and the sisters' later agreement that they are happier than richer, unhappier families both point to contentment despite hardship. <br><br>\nA. Correct: Beth's and the other sisters' comments show they find contentment in their family bond even though money is scarce. <br><br>\nB. Incorrect: The sisters are clearly aware of and openly discuss their financial struggles throughout the passage. <br><br>\nC. Incorrect: The sisters' closeness is shown despite their poverty, not because wealth determines it. <br><br>\nD. Incorrect: The sisters resolve their own disagreement themselves, through Beth's song, without any outside intervention.</p>",
    "points": 1,
    "prompt": "Which statement best expresses a theme developed through the sisters' conversation?",
    "promptHtml": "Which statement <strong>best</strong> expresses a theme developed through the sisters' conversation?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Even amid real hardship, a family can find contentment in what they still have.",
        "text": "Even amid real hardship, a family can find contentment in what they still have."
      },
      {
        "id": "B",
        "html": "Children are rarely fully aware of the financial struggles that their parents quietly face at home.",
        "text": "Children are rarely fully aware of the financial struggles that their parents quietly face at home."
      },
      {
        "id": "C",
        "html": "Wealth is what most determines how close a family's members truly feel to one another over time.",
        "text": "Wealth is what most determines how close a family's members truly feel to one another over time."
      },
      {
        "id": "D",
        "html": "Disagreements among siblings are usually resolved only through some kind of outside intervention or authority.",
        "text": "Disagreements among siblings are usually resolved only through some kind of outside intervention or authority."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-4",
    "explanation": "Correct Answer: C\nExplanation: Beth sings the peacemaking line specifically to defuse the sharp exchange between Amy and Jo, and the passage notes it makes both of them laugh instead of continuing to argue.\nA. Incorrect: Amy's comment about Jo's slang is what starts the disagreement, not an attempt to comfort her.\nB. Incorrect: Jo's wish to fight alongside her father expresses her own restlessness, not an attempt to comfort a sister.\nC. Correct: Beth's song directly softens the sharp exchange between Amy and Jo, turning their argument into laughter.\nD. Incorrect: Meg's comment describes the sisters' general outlook, not a specific act of comforting one another in the moment.",
    "explanationHtml": "<p>Correct Answer: C <br><br>\nExplanation: Beth sings the peacemaking line specifically to defuse the sharp exchange between Amy and Jo, and the passage notes it makes both of them laugh instead of continuing to argue. <br><br>\nA. Incorrect: Amy's comment about Jo's slang is what starts the disagreement, not an attempt to comfort her. <br><br>\nB. Incorrect: Jo's wish to fight alongside her father expresses her own restlessness, not an attempt to comfort a sister. <br><br>\nC. Correct: Beth's song directly softens the sharp exchange between Amy and Jo, turning their argument into laughter. <br><br>\nD. Incorrect: Meg's comment describes the sisters' general outlook, not a specific act of comforting one another in the moment.</p>",
    "points": 1,
    "prompt": "Which detail from the passage best supports the idea that the sisters try to comfort one another despite their disagreements?",
    "promptHtml": "Which detail from the passage <strong>best</strong> supports the idea that the sisters try to comfort one another despite their disagreements?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Amy's brief comment that Jo often uses slang words her sisters consider unladylike and improper.",
        "text": "Amy's brief comment that Jo often uses slang words her sisters consider unladylike and improper."
      },
      {
        "id": "B",
        "html": "Jo's wish that she could fight alongside her father instead of staying home.",
        "text": "Jo's wish that she could fight alongside her father instead of staying home."
      },
      {
        "id": "C",
        "html": "Beth singing a line about birds agreeing in their nests to soften Amy and Jo's argument.",
        "text": "Beth singing a line about birds agreeing in their nests to soften Amy and Jo's argument."
      },
      {
        "id": "D",
        "html": "Meg's description of the sisters as a jolly set despite having to work.",
        "text": "Meg's description of the sisters as a jolly set despite having to work."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-5",
    "explanation": "Jo's rapid list of complaints and her physical shaking of the sock convey both frustration at her limits and a restless wish for a different kind of life.",
    "explanationHtml": "<p>Jo's rapid list of complaints and her physical shaking of the sock convey both frustration at her limits and a restless wish for a different kind of life.</p>",
    "points": 1,
    "prompt": "Complete the sentence describing the tone of Jo's outburst about wanting to be a boy.",
    "instructions": "Move a word into each blank.",
    "promptHtml": "Complete the sentence describing the tone of Jo's outburst about wanting to be a boy.",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "frustrated",
        "text": "frustrated"
      },
      {
        "id": "B",
        "html": "restless",
        "text": "restless"
      },
      {
        "id": "C",
        "html": "grateful",
        "text": "grateful"
      },
      {
        "id": "D",
        "html": "indifferent",
        "text": "indifferent"
      }
    ],
    "dragDropContent": ["Jo's speech about wishing she were a boy reveals a tone that is both {{blank-1}} with her limited role at home and {{blank-2}} for a more active life she cannot yet have."],
    "dragDropSlots": [{ "id": "blank-1", "correctItemId": "A" }, { "id": "blank-2", "correctItemId": "B" }],
    "allowReuse": false,
    "type": "transition_drop"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-6",
    "explanation": "Correct Answer: D\nExplanation: The passage centers on the sisters airing complaints about poverty and their absent father, then arriving, through their exchange, at mutual comfort rather than resolution of the money question itself.\nA. Incorrect: The passage emphasizes the sisters' closeness and shared comfort more than rivalry or contrasting personalities.\nB. Incorrect: The sisters' conversation is not mainly about deciding how to spend money on gifts; it centers on their complaints and eventual comfort in each other.\nC. Incorrect: The mother does not appear teaching this lesson directly in the passage; the sisters work through the theme themselves.\nD. Correct: The sisters air their complaints about money and their absent father, then find comfort in one another by the passage's end.",
    "explanationHtml": "<p>Correct Answer: D <br><br>\nExplanation: The passage centers on the sisters airing complaints about poverty and their absent father, then arriving, through their exchange, at mutual comfort rather than resolution of the money question itself. <br><br>\nA. Incorrect: The passage emphasizes the sisters' closeness and shared comfort more than rivalry or contrasting personalities. <br><br>\nB. Incorrect: The sisters' conversation is not <strong>mainly about</strong> deciding how to spend money on gifts; it centers on their complaints and eventual comfort in each other. <br><br>\nC. Incorrect: The mother does not appear teaching this lesson directly in the passage; the sisters work through the theme themselves. <br><br>\nD. Correct: The sisters air their complaints about money and their absent father, then find comfort in one another by the passage's end.</p>",
    "points": 1,
    "prompt": "Which sentence best states the central idea of the passage as a whole?",
    "promptHtml": "Which sentence <strong>best</strong> states the central idea of the passage as a whole?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "Sibling rivalry among four very different sisters reveals the distinct personalities and quirks within one busy household.",
        "text": "Sibling rivalry among four very different sisters reveals the distinct personalities and quirks within one busy household."
      },
      {
        "id": "B",
        "html": "A family debates for some time how best to spend their limited holiday money on gifts meant only for themselves.",
        "text": "A family debates for some time how best to spend their limited holiday money on gifts meant only for themselves."
      },
      {
        "id": "C",
        "html": "A mother visits her daughters to remind them of the importance of sacrificing personal wants during wartime.",
        "text": "A mother visits her daughters to remind them of the importance of sacrificing personal wants during wartime."
      },
      {
        "id": "D",
        "html": "Four sisters, missing their father and short on money, work through their frustrations together on Christmas Eve and find comfort in each other.",
        "text": "Four sisters, missing their father and short on money, work through their frustrations together on Christmas Eve and find comfort in each other."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "excerpt-from-little-women-digital-shsat-practice-test-2-passage-7",
    "explanation": "Correct Answer: C\nExplanation: A China-aster is a neat, orderly garden flower valued for its looks. Jo pairs it with \"prim\" and with long gowns and the title \"Miss March,\" then says she likes \"boys' games and work and manners\" and is \"dying to go and fight.\" The comparison shows she views ladylike adulthood as stiff and merely ornamental, at odds with her active nature.\nA. Incorrect: Jo uses the flower image to mock primness, not to praise beauty or charm.\nB. Incorrect: Nothing in the comparison concerns fragility or being hurt by criticism; her objection is to stiffness and restriction.\nC. Correct: \"Prim\" and the decorative flower capture the rigid, ornamental role Jo rejects in favor of action.\nD. Incorrect: The comparison is about what a lady looks like and how she must behave, not about the gradual process of growing up.",
    "explanationHtml": "<p>Correct Answer: C <br><br>\nExplanation: A China-aster is a neat, orderly garden flower valued for its looks. Jo pairs it with &quot;prim&quot; and with long gowns and the title &quot;Miss March,&quot; then says she likes &quot;boys' games and work and manners&quot; and is &quot;dying to go and fight.&quot; The comparison shows she views ladylike adulthood as stiff and merely ornamental, at odds with her active nature. <br><br>\nA. Incorrect: Jo uses the flower image to mock primness, not to praise beauty or charm. <br><br>\nB. Incorrect: Nothing in the comparison concerns fragility or being hurt by criticism; her objection is to stiffness and restriction. <br><br>\nC. Correct: &quot;Prim&quot; and the decorative flower capture the rigid, ornamental role Jo rejects in favor of action. <br><br>\nD. Incorrect: The comparison is about what a lady looks like and how she must behave, not about the gradual process of growing up.</p>",
    "points": 1,
    "prompt": "In paragraph 29, what does Jo's comparison of a proper young lady to \"a China-aster\" most likely suggest about how she views growing up?",
    "promptHtml": "In paragraph 29, what does Jo's comparison of a proper young lady to &quot;a China-aster&quot; <strong>most likely</strong> suggest about how she views growing up?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "She believes grown women are admired mainly for their natural beauty and delicate charm.",
        "text": "She believes grown women are admired mainly for their natural beauty and delicate charm."
      },
      {
        "id": "B",
        "html": "She fears that growing up will make her fragile and easily hurt by the criticism of others.",
        "text": "She fears that growing up will make her fragile and easily hurt by the criticism of others."
      },
      {
        "id": "C",
        "html": "She sees it as a stiff, decorative existence that would leave no room for her energetic nature.",
        "text": "She sees it as a stiff, decorative existence that would leave no room for her energetic nature."
      },
      {
        "id": "D",
        "html": "She thinks growing up happens slowly and naturally, the way a flower gradually blooms.",
        "text": "She thinks growing up happens slowly and naturally, the way a flower gradually blooms."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const excerptFromLittleWomenDigitalShsatPracticeTest2PassageSet: ExamPassageSet = {
  id: "ela-excerpt-from-little-women-digital-shsat-practice-test-2",
  label: "ELA - Reading Comprehension",
  section: "reading",
  questionCount: excerptFromLittleWomenDigitalShsatPracticeTest2Questions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "excerpt-from-little-women-digital-shsat-practice-test-2",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    title: "Excerpt from \"Little Women\"",
    author: "Louisa May Alcott",
    blurb: "Louisa May Alcott (1832-1888) was an American novelist. The following is adapted from Chapter 1, \"Playing Pilgrims,\" of her 1868 novel Little Women, set during the American Civil War, in which four sisters – Meg, Jo, Beth, and Amy March – talk on Christmas Eve about their family’s straitened finances while their father is away serving as an army chaplain.",
    passageType: "informational",
    passageCategory: "prestige",
    richText: "<p>&quot;Christmas won't be Christmas without any presents,&quot; grumbled Jo, lying on the rug.</p><p>&quot;It's so dreadful to be poor!&quot; sighed Meg, looking down at her old dress.</p><p>&quot;I don't think it's fair for some girls to have plenty of pretty things, and other girls nothing at all,&quot; added little Amy, with an injured sniff.</p><p>&quot;We've got father and mother and each other,&quot; said Beth contentedly, from her corner.</p><p>The four young faces on which the firelight shone brightened at the cheerful words, but darkened again as Jo said sadly,--</p><p>&quot;We haven't got father, and shall not have him for a long time.&quot; She didn't say &quot;perhaps never,&quot; but each silently added it, thinking of father far away, where the fighting was.</p><p>Nobody spoke for a minute; then Meg said in an altered tone,--</p><p>&quot;You know the reason mother proposed not having any presents this Christmas was because it is going to be a hard winter for every one; and she thinks we ought not to spend money for pleasure, when our men are suffering so in the army. We can't do much, but we can make our little sacrifices, and ought to do it gladly. But I am afraid I don't;&quot; and Meg shook her head, as she thought regretfully of all the pretty things she wanted.</p><p>&quot;But I don't think the little we should spend would do any good. We've each got a dollar, and the army wouldn't be much helped by our giving that. I agree not to expect anything from mother or you, but I do want to buy Undine and Sintram for myself; I've wanted it so long,&quot; said Jo, who was a bookworm.</p><p>&quot;I planned to spend mine in new music,&quot; said Beth, with a little sigh, which no one heard but the hearth-brush and kettle-holder.</p><p>&quot;I shall get a nice box of Faber's drawing-pencils; I really need them,&quot; said Amy decidedly.</p><p>&quot;Mother didn't say anything about our money, and she won't wish us to give up everything. Let's each buy what we want, and have a little fun; I'm sure we work hard enough to earn it,&quot; cried Jo, examining the heels of her shoes in a gentlemanly manner.</p><p>&quot;I know I do,--teaching those tiresome children nearly all day, when I'm longing to enjoy myself at home,&quot; began Meg, in the complaining tone again.</p><p>&quot;You don't have half such a hard time as I do,&quot; said Jo. &quot;How would you like to be shut up for hours with a nervous, fussy old lady, who keeps you trotting, is never satisfied, and worries you till you're ready to fly out of the window or cry?&quot;</p><p>&quot;It's naughty to fret; but I do think washing dishes and keeping things tidy is the worst work in the world. It makes me cross; and my hands get so stiff, I can't practise well at all;&quot; and Beth looked at her rough hands with a sigh that any one could hear that time.</p><p>&quot;I don't believe any of you suffer as I do,&quot; cried Amy; &quot;for you don't have to go to school with impertinent girls, who plague you if you don't know your lessons, and laugh at your dresses, and label your father if he isn't rich, and insult you when your nose isn't nice.&quot;</p><p>&quot;If you mean libel, I'd say so, and not talk about labels, as if papa was a pickle-bottle,&quot; advised Jo, laughing.</p><p>&quot;I know what I mean, and you needn't be statirical about it. It's proper to use good words, and improve your vocabilary,&quot; returned Amy, with dignity.</p><p>&quot;Don't peck at one another, children. Don't you wish we had the money papa lost when we were little, Jo? Dear me! how happy and good we'd be, if we had no worries!&quot; said Meg, who could remember better times.</p><p>&quot;You said the other day, you thought we were a deal happier than the King children, for they were fighting and fretting all the time, in spite of their money.&quot;</p><p>&quot;So I did, Beth. Well, I think we are; for, though we do have to work, we make fun for ourselves, and are a pretty jolly set, as Jo would say.&quot;</p><p>&quot;Jo does use such slang words!&quot; observed Amy, with a reproving look at the long figure stretched on the rug. Jo immediately sat up, put her hands in her pockets, and began to whistle.</p><p>&quot;Don't, Jo; it's so boyish!&quot;</p><p>&quot;That's why I do it.&quot;</p><p>&quot;I detest rude, unlady-like girls!&quot;</p><p>&quot;I hate affected, niminy-piminy chits!&quot;</p><p>&quot;'Birds in their little nests agree,'&quot; sang Beth, the peace-maker, with such a funny face that both sharp voices softened to a laugh, and the &quot;pecking&quot; ended for that time.</p><p>&quot;Really, girls, you are both to be blamed,&quot; said Meg, beginning to lecture in her elder-sisterly fashion. &quot;You are old enough to leave off boyish tricks, and to behave better, Josephine. It didn't matter so much when you were a little girl; but now you are so tall, and turn up your hair, you should remember that you are a young lady.&quot;</p><p>&quot;I'm not! and if turning up my hair makes me one, I'll wear it in two tails till I'm twenty,&quot; cried Jo, pulling off her net, and shaking down a chestnut mane. &quot;I hate to think I've got to grow up, and be Miss March, and wear long gowns, and look as prim as a China-aster! It's bad enough to be a girl, anyway, when I like boys' games and work and manners! I can't get over my disappointment in not being a boy; and it's worse than ever now, for I'm dying to go and fight with papa, and I can only stay at home and knit, like a poky old woman!&quot; And Jo shook the blue army-sock till the needles rattled like castanets, and her ball bounded across the room.</p><p>&quot;Poor Jo! It's too bad, but it can't be helped; so you must try to be contented with making your name boyish, and playing brother to us girls,&quot; said Beth, stroking the rough head at her knee with a hand that all the dish-washing and dusting in the world could not make ungentle in its touch.</p>",
    text: excerptFromLittleWomenDigitalShsatPracticeTest2PassageText,
    versionLabel: "Digital SHSAT Practice Test 2",
  }),
  questions: excerptFromLittleWomenDigitalShsatPracticeTest2Questions,
};
