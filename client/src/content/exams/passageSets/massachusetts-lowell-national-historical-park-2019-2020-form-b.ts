import { createSourcePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const massachusettsLowellNationalHistoricalPark20192020FormBPassageText = "During the first half of the 19th century, Lowell, Massachusetts, quickly transformed itself from a farm town to a bustling industrial city. In time, Lowell became a model of industry, gaining global recognition for its state-of-the-art technology, innovative canal and dam system, mill architecture, boardinghouses, churches, and ethnic neighborhoods. Young Yankee1 women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills, or visit the industrious city that was becoming a popular tourist destination. As one Scottish traveler observed during his visit to America, “Niagara2 and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.” Today, Lowell National Historical Park welcomes visitors to enjoy the sights of Lowell and learn about the history of one of America’s most significant industrial cities.\n\nThe Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls. Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five-and six-story brick buildings dominated the city’s landscape. . . . The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838. By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river. . . .\n\nThe city’s female workforce was significant in the history of Lowell. From the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life. Most were young single Yankee girls, who were tired of the limited opportunities offered by their domestic work.3 Women found that Lowell’s mills offered monthly wages for their services and provided them room and board. Although these women gained economic independence in Lowell, the mill boardinghouse keepers constantly supervised their social activities, for which they hardly had any time, considering their daily 12-to 14-hour work schedules. At the end of the day, the factory bell signaled the “mill girls” to return to their boardinghouses. They were expected to adhere to the strict code of conduct respecting curfew and attending church.\n\nYankee “mill girls” continued to dominate the Lowell workforce until the 1840s, when the city began to find it difficult to compete with the growing industrial development in other New England communities. As profits fell, the mill industry cut wages. These wage cuts, deteriorating working conditions, and long workdays led the “mill girls” to protest and organize strikes. When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce. Despite the low wages and unhealthy work conditions, immigrants were eager to find work.\n\nThe immigrants replacing the Yankee “mill girls” during the 1840s were predominantly Irish Catholics, who traveled to America during the Great Potato Famine. Although Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses. Initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared. Irish immigrants dominated the industrial scene until the Civil War, when other immigrant groups began to work in the city mills.\n\nLike the Irish, the French-Canadians, Greeks, Poles, Portuguese, Russian Jews, and Armenians who came to work in Lowell’s mills faced long work hours, low wages, and poor living conditions in the city’s crowded tenements. By the time Lowell’s industry declined, the city had become an ethnic melting pot, where each group claimed its own distinct neighborhood, like the Irish immigrants’ “New Dublin” or “Acre,” and the French-Canadians’ “Little Canada.” The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-of-the-art cotton mills in other communities and working conditions continued to decline as Lowell’s companies stopped reinvesting in their mills. . . . Despite a brief resurgence during World War II, the city shut down its last surviving mill by the mid-1950s.";

const massachusettsLowellNationalHistoricalPark20192020FormBQuestions: ExamQuestion[] = [
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q051",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "51",
      "pages": [
        30
      ]
    },
    "explanation": "51 . The question asks why the author includes the quotation from the Scottish traveler in the passage .\n\nC: Correct . The quotation emphasizes the idea that the United States offers different attractions . The Scottish traveler highlights the two places in the United States that he will most remember . First, the beautiful natural formation of Niagara Falls (“ ‘the glory of American scenery’ ”) and, second, the industrial city of Lowell (“ ‘the glory  .  .  . of American industry’ ”) .\n\nA: Incorrect . While it is likely that people outside the United States recognized that both the natural landscape and the bustling industry were significant, the quotation from the Scottish traveler is meant to convey the variety of the types of attractions in the US, not to make a general statement about their contribution .\n\nB: Incorrect . The Scottish traveler mentions both “American scenery” and “American industry” in the quotation, but the intent is to highlight that they are each points of interest . The quotation does not provide a comparison of the two attractions .\n\nD: Incorrect . The Scottish traveler mentions both “American scenery” and “American industry” in the quotation but does not imply that the natural resources contributed to the development of industry .",
    "explanationHtml": "<p><strong>51 .</strong> The question asks why the author includes the quotation from the Scottish traveler in the passage .</p><p><strong>C: Correct .</strong> The quotation emphasizes the idea that the United States offers different attractions . The Scottish traveler highlights the two places in the United States that he will most remember . First, the beautiful natural formation of Niagara Falls (“ ‘the glory of American scenery’ ”) and, second, the industrial city of Lowell (“ ‘the glory  .  .  . of American industry’ ”) .</p><p><strong>A:</strong> Incorrect . While it is likely that people outside the United States recognized that both the natural landscape and the bustling industry were significant, the quotation from the Scottish traveler is meant to convey the variety of the types of attractions in the US, not to make a general statement about their contribution .</p><p><strong>B:</strong> Incorrect . The Scottish traveler mentions both “American scenery” and “American industry” in the quotation, but the intent is to highlight that they are each points of interest . The quotation does not provide a comparison of the two attractions .</p><p><strong>D:</strong> Incorrect . The Scottish traveler mentions both “American scenery” and “American industry” in the quotation but does not imply that the natural resources contributed to the development of industry .</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 1.\n\nAs one Scottish traveler observed during his visit to America, “Niagara and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.”\n\nThe author most likely includes the quotation from the Scottish traveler in order to",
    "promptHtml": "<p>Read this sentence from paragraph 1.</p><blockquote><strong>As one Scottish traveler observed during his visit to America, “Niagara and Lowell</strong> <strong>are the two objects I will longest remember in my American journey, the one the</strong> <strong>glory of American scenery, the other of American industry.”</strong></blockquote><p>The author most likely includes the quotation from the Scottish traveler in order to</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>suggest that people around the world saw the direct contribution of nature and industry to the United States.</p>",
        "text": "suggest that people around the world saw the direct contribution of nature and industry to the United States."
      },
      {
        "id": "B",
        "html": "<p>compare the natural and industrial attractions in the United States at that time.</p>",
        "text": "compare the natural and industrial attractions in the United States at that time."
      },
      {
        "id": "C",
        "html": "<p>convey the idea that the United States offered both natural and industrial attractions.</p>",
        "text": "convey the idea that the United States offered both natural and industrial attractions."
      },
      {
        "id": "D",
        "html": "<p>imply that the natural resources in the United States contributed to the development of industry.</p>",
        "text": "imply that the natural resources in the United States contributed to the development of industry."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q052",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "52",
      "pages": [
        30
      ]
    },
    "explanation": "52 . The question asks for the sentence in paragraph 2 that best supports the idea that Lowell became “a bustling industrial city” (paragraph 1) .\n\nH: Correct . This sentence supports the idea that, within a few decades, the city’s mills employed “over 10,000 workers” in a mile-long stretch along the river . This sentence shows that the city was “bustling” and populated .\n\nE: Incorrect . This sentence provides details on when the town of Lowell was founded and on the natural features of the area, but it does not support the idea that the city became “a bustling industrial city” (paragraph 1) .\n\nF: Incorrect . This sentence provides specific details about the how the mills worked and indicates that the mill buildings were a noticeable feature of the city . It does not refer to Lowell becoming “a bustling industrial city” (paragraph 1) .\n\nG: Incorrect . This sentence lists some recognizable mill buildings along the river and notes when their associated businesses were established . It does not refer to Lowell becoming “a bustling industrial city” (paragraph 1) .",
    "explanationHtml": "<p><strong>52 .</strong> The question asks for the sentence in paragraph 2 that best supports the idea that Lowell became “a bustling industrial city” (paragraph 1) .</p><p><strong>H: Correct .</strong> This sentence supports the idea that, within a few decades, the city’s mills employed “over 10,000 workers” in a mile-long stretch along the river . This sentence shows that the city was “bustling” and populated .</p><p><strong>E:</strong> Incorrect . This sentence provides details on when the town of Lowell was founded and on the natural features of the area, but it does not support the idea that the city became “a bustling industrial city” (paragraph 1) .</p><p><strong>F:</strong> Incorrect . This sentence provides specific details about the how the mills worked and indicates that the mill buildings were a noticeable feature of the city . It does not refer to Lowell becoming “a bustling industrial city” (paragraph 1) .</p><p><strong>G:</strong> Incorrect . This sentence lists some recognizable mill buildings along the river and notes when their associated businesses were established . It does not refer to Lowell becoming “a bustling industrial city” (paragraph 1) .</p>",
    "points": 1,
    "prompt": "Which sentence from paragraph 2 best supports the idea that Lowell became “a bustling industrial city” (paragraph 1)?",
    "promptHtml": "<p>Which sentence from paragraph 2 best supports the idea that Lowell became “a bustling industrial city” (paragraph 1)?</p>",
    "topic": "Evidence & Support",
    "choices": [
      {
        "id": "A",
        "html": "<p>“The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls.”</p>",
        "text": "“The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls.”"
      },
      {
        "id": "B",
        "html": "<p>“Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five-and six-story brick buildings dominated the city’s landscape.”</p>",
        "text": "“Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five-and six-story brick buildings dominated the city’s landscape.”"
      },
      {
        "id": "C",
        "html": "<p>“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838.”</p>",
        "text": "“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838.”"
      },
      {
        "id": "D",
        "html": "<p>“By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river.”</p>",
        "text": "“By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river.”"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q053",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "53",
      "pages": [
        31
      ]
    },
    "explanation": "53 . The question asks which statement best describes how the sentence in paragraph 3 fits into the overall structure of the passage .\n\nA: Correct . The sentence in paragraph 3 provides a transition from the overall description of the city and the mills to a description of the women who made up the workforce in the mills . The idea that women left domestic life in favor of working in the mills is important in the passage, and the sentence serves to connect that idea to the previous discussion about the mills .\n\nB: Incorrect . While the mill girls’ dissatisfaction with their working conditions is addressed later in the passage (“These wage cuts, deteriorating working conditions, and long workdays led the ‘mill girls’ to protest and organize strikes” [paragraph 4]), the sentence in paragraph 3 does not indicate a shift in tone from positive to negative . The sentence provides a transition to the discussion of the women who worked in the mills .\n\nC: Incorrect . Although the sentence in paragraph 3 mentions that women became interested in working in the mills because of the “constricted lifestyle of small rural towns,” structurally this sentence serves to provide a connection between the previous discussion of the mills and the women who made up the mill workforce . The sentence “Most were young single Yankee girls, who were tired of the limited opportunities offered by their domestic work” (paragraph 3) provides more detail about the circumstances that prompted women to leave their hometown .\n\nD: Incorrect . The sentence in paragraph 3 focuses on the choices women made to leave rural towns to work in the city in the early to mid-1800s, not the mid-1800s to the late 1800s . The sentence does not create a comparison between the workforce in the mid-1800s and that in the late 1800s .",
    "explanationHtml": "<p><strong>53 .</strong> The question asks which statement best describes how the sentence in paragraph 3 fits into the overall structure of the passage .</p><p><strong>A: Correct .</strong> The sentence in paragraph 3 provides a transition from the overall description of the city and the mills to a description of the women who made up the workforce in the mills . The idea that women left domestic life in favor of working in the mills is important in the passage, and the sentence serves to connect that idea to the previous discussion about the mills .</p><p><strong>B:</strong> Incorrect . While the mill girls’ dissatisfaction with their working conditions is addressed later in the passage (“These wage cuts, deteriorating working conditions, and long workdays led the ‘mill girls’ to protest and organize strikes” [paragraph 4]), the sentence in paragraph 3 does not indicate a shift in tone from positive to negative . The sentence provides a transition to the discussion of the women who worked in the mills .</p><p><strong>C:</strong> Incorrect . Although the sentence in paragraph 3 mentions that women became interested in working in the mills because of the “constricted lifestyle of small rural towns,” structurally this sentence serves to provide a connection between the previous discussion of the mills and the women who made up the mill workforce . The sentence “Most were young single Yankee girls, who were tired of the limited opportunities offered by their domestic work” (paragraph 3) provides more detail about the circumstances that prompted women to leave their hometown .</p><p><strong>D:</strong> Incorrect . The sentence in paragraph 3 focuses on the choices women made to leave rural towns to work in the city in the early to mid-1800s, not the mid-1800s to the late 1800s . The sentence does not create a comparison between the workforce in the mid-1800s and that in the late 1800s .</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nFrom the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life.\n\nWhich statement best describes how the sentence fits into the overall structure of the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 3.</p><blockquote><strong>From the early to mid-1800s, women left the constricted lifestyle of small rural towns</strong> <strong>and rural areas for independent industrial city life.</strong></blockquote><p>Which statement best describes how the sentence fits into the overall structure of the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It provides a transition from a description of the mills to a description of the workforce in those mills.</p>",
        "text": "It provides a transition from a description of the mills to a description of the workforce in those mills."
      },
      {
        "id": "B",
        "html": "<p>It indicates a shift in tone from positive and hopeful to negative and dissatisfied with working conditions at the mill.</p>",
        "text": "It indicates a shift in tone from positive and hopeful to negative and dissatisfied with working conditions at the mill."
      },
      {
        "id": "C",
        "html": "<p>It presents the circumstances that led many women to leave their hometown and move to the city for work.</p>",
        "text": "It presents the circumstances that led many women to leave their hometown and move to the city for work."
      },
      {
        "id": "D",
        "html": "<p>It begins a comparison of the mill workforce between the mid-1800s and the late 1800s.</p>",
        "text": "It begins a comparison of the mill workforce between the mid-1800s and the late 1800s."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q054",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "54",
      "pages": [
        31
      ]
    },
    "explanation": "54 . The question asks for the sentence that best summarizes the mill girls’ time as the dominant workforce in Lowell .\n\nH: Correct . The details about the mill girls’ time as the primary workforce in Lowell is outlined in paragraphs 3 and 4 . These paragraphs explain how women initially were excited by the opportunity to live independently (“Women found that Lowell’s mills offered monthly wages for their services and provided them room and board” [paragraph 3]) . Over time, however, the working conditions changed and became unfavorable, leading the women to leave the industry when their calls for change were not addressed by mill owners (“When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce” [paragraph 4]) .\n\nE: Incorrect . While the passage explains that mill girls were initially eager to leave the domestic duties of life in rural areas, the summary sentence does not address the details about the mill girls’ time working in the mills or the changes that led the mill girls to leave the industry .\n\nF: Incorrect . Mill girls initially found satisfaction in the mill work and lifestyle, and when they did leave, immigrants filled the empty jobs . This summary sentence, however, does not address the details about the mill girls’ time as the primary workforce in Lowell or the circumstances that led them to leave their jobs in the mid-1800s .\n\nG: Incorrect . Mill girls did leave home to work in the Lowell mills, and they did grow dissatisfied over time, but this summary sentence does not include details about the mill girls’ actions to improve the working conditions, and it incorrectly emphasizes the rigid boardinghouse rules as a key reason the mill girls were unhappy with their working conditions .",
    "explanationHtml": "<p><strong>54 .</strong> The question asks for the sentence that best summarizes the mill girls’ time as the dominant workforce in Lowell .</p><p><strong>H: Correct .</strong> The details about the mill girls’ time as the primary workforce in Lowell is outlined in paragraphs 3 and 4 . These paragraphs explain how women initially were excited by the opportunity to live independently (“Women found that Lowell’s mills offered monthly wages for their services and provided them room and board” [paragraph 3]) . Over time, however, the working conditions changed and became unfavorable, leading the women to leave the industry when their calls for change were not addressed by mill owners (“When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce” [paragraph 4]) .</p><p><strong>E:</strong> Incorrect . While the passage explains that mill girls were initially eager to leave the domestic duties of life in rural areas, the summary sentence does not address the details about the mill girls’ time working in the mills or the changes that led the mill girls to leave the industry .</p><p><strong>F:</strong> Incorrect . Mill girls initially found satisfaction in the mill work and lifestyle, and when they did leave, immigrants filled the empty jobs . This summary sentence, however, does not address the details about the mill girls’ time as the primary workforce in Lowell or the circumstances that led them to leave their jobs in the mid-1800s .</p><p><strong>G:</strong> Incorrect . Mill girls did leave home to work in the Lowell mills, and they did grow dissatisfied over time, but this summary sentence does not include details about the mill girls’ actions to improve the working conditions, and it incorrectly emphasizes the rigid boardinghouse rules as a key reason the mill girls were unhappy with their working conditions .</p>",
    "points": 1,
    "prompt": "Which sentence best summarizes the mill girls’ time as the dominant workforce in Lowell?",
    "promptHtml": "<p>Which sentence best summarizes the mill girls’ time as the dominant workforce in Lowell?</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>The mill girls were eager to leave their domestic duties and small towns behind, so they went to work in the mills of Lowell.</p>",
        "text": "The mill girls were eager to leave their domestic duties and small towns behind, so they went to work in the mills of Lowell."
      },
      {
        "id": "B",
        "html": "<p>Originally, the mill girls were satisfied to work in Lowell, but as they left their jobs at the Lowell mills, immigrants arrived to fill the empty positions.</p>",
        "text": "Originally, the mill girls were satisfied to work in Lowell, but as they left their jobs at the Lowell mills, immigrants arrived to fill the empty positions."
      },
      {
        "id": "C",
        "html": "<p>Young women left home to work in the Lowell mills, but the mill girls soon became dissatisfied with the working conditions and rigid boardinghouse rules.</p>",
        "text": "Young women left home to work in the Lowell mills, but the mill girls soon became dissatisfied with the working conditions and rigid boardinghouse rules."
      },
      {
        "id": "D",
        "html": "<p>The mill girls embraced city life when they came to work in Lowell’s mills, but when the working conditions became unfavorable and the mill girls’ protests went unanswered, they left.</p>",
        "text": "The mill girls embraced city life when they came to work in Lowell’s mills, but when the working conditions became unfavorable and the mill girls’ protests went unanswered, they left."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q055",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "55",
      "pages": [
        31
      ]
    },
    "explanation": "55 . The question asks how in the sentence in paragraph 5 contributes to the development of ideas in the passage .\n\nB: Correct . The sentence from paragraph 5 shows that early Irish immigrants were critical to the success of Lowell as an industrial city . This information supports the development of the idea that the work of Irish immigrants and immigrants from other places is an important element in the historical significance of industry in Lowell .\n\nA: Incorrect . The sentence from paragraph 5 does not imply that Lowell was founded by early Irish immigrants . The sentence explains how Irish immigrants had been settling in Lowell since the city was established and that they contributed to the construction of the city, which allowed it to become an industrial center several decades later .\n\nC: Incorrect . The sentence from paragraph 5 does not suggest that new Irish immigrants were readily accepted into the community . Paragraph 5 states that “initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared .”\n\nD: Incorrect . The sentence from paragraph 5 does not highlight the relationship between the mill girls and the new Irish immigrants . Paragraph 4 explains how the mill girls left Lowell, and paragraph 5 states that the mill girls were replaced by “predominantly Irish Catholics, who traveled to America during the Great Potato Famine” but does not discuss a relationship between them .",
    "explanationHtml": "<p><strong>55 .</strong> The question asks how in the sentence in paragraph 5 contributes to the development of ideas in the passage .</p><p><strong>B: Correct .</strong> The sentence from paragraph 5 shows that early Irish immigrants were critical to the success of Lowell as an industrial city . This information supports the development of the idea that the work of Irish immigrants and immigrants from other places is an important element in the historical significance of industry in Lowell .</p><p><strong>A:</strong> Incorrect . The sentence from paragraph 5 does not imply that Lowell was founded by early Irish immigrants . The sentence explains how Irish immigrants had been settling in Lowell since the city was established and that they contributed to the construction of the city, which allowed it to become an industrial center several decades later .</p><p><strong>C:</strong> Incorrect . The sentence from paragraph 5 does not suggest that new Irish immigrants were readily accepted into the community . Paragraph 5 states that “initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared .”</p><p><strong>D:</strong> Incorrect . The sentence from paragraph 5 does not highlight the relationship between the mill girls and the new Irish immigrants . Paragraph 4 explains how the mill girls left Lowell, and paragraph 5 states that the mill girls were replaced by “predominantly Irish Catholics, who traveled to America during the Great Potato Famine” but does not discuss a relationship between them .</p>",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nAlthough Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses.\n\nHow does this sentence contribute to the development of ideas in the passage?",
    "promptHtml": "<p>Read this sentence from paragraph 5.</p><blockquote><strong>Although Lowell received an influx of Irish families during this time, the Irish were</strong> <strong>a part of the city’s history from its birth, and before the “mill girls” arrived, they</strong> <strong>built Lowell’s historic canals, mills, and boardinghouses.</strong></blockquote><p>How does this sentence contribute to the development of ideas in the passage?</p>",
    "topic": "Text Structure & Purpose",
    "choices": [
      {
        "id": "A",
        "html": "<p>It implies that Lowell was founded by early Irish immigrants.</p>",
        "text": "It implies that Lowell was founded by early Irish immigrants."
      },
      {
        "id": "B",
        "html": "<p>It emphasizes the important role Irish immigrants played in Lowell’s history.</p>",
        "text": "It emphasizes the important role Irish immigrants played in Lowell’s history."
      },
      {
        "id": "C",
        "html": "<p>It suggests that the new Irish immigrants were readily accepted into the community.</p>",
        "text": "It suggests that the new Irish immigrants were readily accepted into the community."
      },
      {
        "id": "D",
        "html": "<p>It highlights the working relationship between the mill girls and the new Irish immigrants.</p>",
        "text": "It highlights the working relationship between the mill girls and the new Irish immigrants."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q056",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "56",
      "pages": [
        32
      ]
    },
    "explanation": "56 . The question asks which description conveys the central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) .\n\nG: Correct . The details throughout the passage about the development of the mills and the people who worked in them conveys the significance of Lowell in early American industry . Paragraph 2 shares details about the businesses that started in the early 1800s and contributed to the development of industry in the region (“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838”) . Then paragraphs 3–6 provide specific details about the people who worked in the mills at different points in time .\n\nE: Incorrect . While the passage does state that the city’s canals, mills, and boardinghouses were built by early immigrants from Ireland, these details do not contribute to the development of the overall idea that Lowell was a significant industrial city .\n\nF: Incorrect . The details about the women and immigrants who worked in the mills is important to the passage, but these details alone do not show that Lowell was a significant industrial city .\n\nH: Incorrect . Although the passage references Lowell’s culturally diverse community (“Young Yankee women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills” [paragraph 1]), these groups are not what marked Lowell as a significant industrial city .",
    "explanationHtml": "<p><strong>56 .</strong> The question asks which description conveys the central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) .</p><p><strong>G: Correct .</strong> The details throughout the passage about the development of the mills and the people who worked in them conveys the significance of Lowell in early American industry . Paragraph 2 shares details about the businesses that started in the early 1800s and contributed to the development of industry in the region (“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838”) . Then paragraphs 3–6 provide specific details about the people who worked in the mills at different points in time .</p><p><strong>E:</strong> Incorrect . While the passage does state that the city’s canals, mills, and boardinghouses were built by early immigrants from Ireland, these details do not contribute to the development of the overall idea that Lowell was a significant industrial city .</p><p><strong>F:</strong> Incorrect . The details about the women and immigrants who worked in the mills is important to the passage, but these details alone do not show that Lowell was a significant industrial city .</p><p><strong>H:</strong> Incorrect . Although the passage references Lowell’s culturally diverse community (“Young Yankee women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills” [paragraph 1]), these groups are not what marked Lowell as a significant industrial city .</p>",
    "points": 1,
    "prompt": "A central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) is conveyed in the passage primarily through a description of the",
    "promptHtml": "<p>A central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) is conveyed in the passage primarily through a description of the</p>",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "<p>canals, mills, and boardinghouses that were built by immigrants.</p>",
        "text": "canals, mills, and boardinghouses that were built by immigrants."
      },
      {
        "id": "B",
        "html": "<p>mill girls and immigrants who comprised Lowell’s workforce.</p>",
        "text": "mill girls and immigrants who comprised Lowell’s workforce."
      },
      {
        "id": "C",
        "html": "<p>development of the mills and the workforce established to support them.</p>",
        "text": "development of the mills and the workforce established to support them."
      },
      {
        "id": "D",
        "html": "<p>cultural diversity of the people who lived in the area.</p>",
        "text": "cultural diversity of the people who lived in the area."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-lowell-national-historical-park-2019-2020-form-b-pdf-shsat-2019-2020-b-q057",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "pdf",
      "playerProfile": "testnav",
      "sourceId": "official-shsat-2019-2020-form-b",
      "label": "2019-2020 Form B",
      "url": "https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf",
      "year": "2019-2020",
      "form": "B",
      "sourceQuestion": "57",
      "pages": [
        32
      ]
    },
    "explanation": "57 . The question asks for the reason that best illustrates why Lowell lost its status as an industrial leader .\n\nC: Correct . When Lowell was initially established, the mills in the city thrived because of their use of state-of-the-art manufacturing methods . However, manufacturing technology changed and improved over time . New manufacturing methods were more efficient, and many mill owners chose to close the mills rather than modernize them, and Lowell lost its status as a model of industry (“The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-companies stopped reinvesting in their mills” [paragraph 6]) .\n\nA: Incorrect . While the passage discusses the poor living and working conditions, these details highlight that mill workers had a difficult life and that mill work was no longer seen as a better job than farmwork or domestic duties . This is not the reason Lowell is no longer a “model of industry .”\n\nB: Incorrect . Paragraph 5 in the passage acknowledges that there was some tension between the different ethnic and religious groups in Lowell, but this idea is not what led to Lowell’s decline as a “model of industry .”\n\nD: Incorrect . The details about the temporary revival of the mills during World War II do not show why Lowell is no longer considered a “model of industry .” The mills were used briefly during wartime because of an increased need for supplies, but this use of the mills was short-lived .",
    "explanationHtml": "<p><strong>57 .</strong> The question asks for the reason that best illustrates why Lowell lost its status as an industrial leader .</p><p><strong>C: Correct .</strong> When Lowell was initially established, the mills in the city thrived because of their use of state-of-the-art manufacturing methods . However, manufacturing technology changed and improved over time . New manufacturing methods were more efficient, and many mill owners chose to close the mills rather than modernize them, and Lowell lost its status as a model of industry (“The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-</p><p>companies stopped reinvesting in their mills” [paragraph 6]) .</p><p><strong>A:</strong> Incorrect . While the passage discusses the poor living and working conditions, these details highlight that mill workers had a difficult life and that mill work was no longer seen as a better job than farmwork or domestic duties . This is not the reason Lowell is no longer a “model of industry .”</p><p><strong>B:</strong> Incorrect . Paragraph 5 in the passage acknowledges that there was some tension between the different ethnic and religious groups in Lowell, but this idea is not what led to Lowell’s decline as a “model of industry .”</p><p><strong>D:</strong> Incorrect . The details about the temporary revival of the mills during World War II do not show why Lowell is no longer considered a “model of industry .” The mills were used briefly during wartime because of an increased need for supplies, but this use of the mills was short-lived .</p>",
    "points": 1,
    "prompt": "The reason Lowell lost its status as an industrial leader is best illustrated through the",
    "promptHtml": "<p>The reason Lowell lost its status as an industrial leader is best illustrated through the</p>",
    "topic": "Inference",
    "choices": [
      {
        "id": "A",
        "html": "<p>description of poor living and working conditions.</p>",
        "text": "description of poor living and working conditions."
      },
      {
        "id": "B",
        "html": "<p>explanation for why some immigrant groups struggled to live together.</p>",
        "text": "explanation for why some immigrant groups struggled to live together."
      },
      {
        "id": "C",
        "html": "<p>comparison with other mills that used modern methods.</p>",
        "text": "comparison with other mills that used modern methods."
      },
      {
        "id": "D",
        "html": "<p>information about the mills opening temporarily during World War II.</p>",
        "text": "information about the mills opening temporarily during World War II."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const massachusettsLowellNationalHistoricalPark20192020FormBPassageSet: ExamPassageSet = {
  id: "ela-massachusetts-lowell-national-historical-park-2019-2020-form-b",
  versionLabels: ["2019-2020 Form B"],
  label: "2019-2020 Form B",
  section: "reading",
  questionCount: massachusettsLowellNationalHistoricalPark20192020FormBQuestions.length,
  directions: {
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text.",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION"
},
  passage: createSourcePassage({
    id: "massachusetts-lowell-national-historical-park-2019-2020-form-b",
    preserveSourceLayout: true,
    format: "prose",
    images: [],
    titleHtml: "Massachusetts: Lowell National Historical Park",
    sourceNoteHtml: "<p>From “Massachusetts: Lowell National Historical Park”—Public Domain/National Park Service</p>",
    source: {"sourceFamily":"official_shsat","sourceFormat":"pdf","playerProfile":"testnav","sourceId":"official-shsat-2019-2020-form-b","label":"2019-2020 Form B","url":"https://www.stuyprep.nyc/uploads/1/2/4/0/124057757/20192020_form_b.pdf","year":"2019-2020","form":"B","packageId":"5e586d94840a95d9ffd3e5613451e65e8abc6db9424d47cf1969f9e17f543e7c"},
    title: "Massachusetts: Lowell National Historical Park",
    passageType: "informational",
    passageCategory: "official_handbook",
    richText: "<p>During the first half of the 19th century, Lowell, Massachusetts, quickly transformed itself from a farm town to a bustling industrial city. In time, Lowell became a model of industry, gaining global recognition for its state-of-the-art technology, innovative canal and dam system, mill architecture, boardinghouses, churches, and ethnic neighborhoods. Young <span data-glossary-definition=\"native to New England\" role=\"link\" tabindex=\"0\">Yankee</span><sup>1</sup> women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills, or visit the industrious city that was becoming a popular tourist destination. As one Scottish traveler observed during his visit to America, “<span data-glossary-definition=\"a town in northwestern New York State well known as the location of Niagara Falls, a series of waterfalls on the Canadian border\" role=\"link\" tabindex=\"0\">Niagara</span><sup>2</sup> and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.” Today, Lowell National Historical Park welcomes visitors to enjoy the sights of Lowell and learn about the history of one of America’s most significant industrial cities.</p><p>The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls. Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five-and six-story brick buildings dominated the city’s landscape. . . . The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838. By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river. . . .</p><p>The city’s female workforce was significant in the history of Lowell. From the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life. Most were young single Yankee girls, who were tired of the limited opportunities offered by their <span data-glossary-definition=\"household duties like cooking and cleaning\" role=\"link\" tabindex=\"0\">domestic work</span>.<sup>3</sup> Women found that Lowell’s mills offered monthly wages for their services and provided them room and board. Although these women gained economic independence in Lowell, the mill boardinghouse keepers constantly supervised their social activities, for which they hardly had any time, considering their daily 12-to 14-hour work schedules. At the end of the day, the factory bell signaled the “mill girls” to return to their boardinghouses. They were expected to adhere to the strict code of conduct respecting curfew and attending church.</p><p>Yankee “mill girls” continued to dominate the Lowell workforce until the 1840s, when the city began to find it difficult to compete with the growing industrial development in other New England communities. As profits fell, the mill industry cut wages. These wage cuts, deteriorating working conditions, and long workdays led the “mill girls” to protest and organize strikes. When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce. Despite the low wages and unhealthy work conditions, immigrants were eager to find work.</p><p>The immigrants replacing the Yankee “mill girls” during the 1840s were predominantly Irish Catholics, who traveled to America during the Great Potato Famine. Although Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses. Initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared. Irish immigrants dominated the industrial scene until the Civil War, when other immigrant groups began to work in the city mills.</p><p>Like the Irish, the French-Canadians, Greeks, Poles, Portuguese, Russian Jews, and Armenians who came to work in Lowell’s mills faced long work hours, low wages, and poor living conditions in the city’s crowded tenements. By the time Lowell’s industry declined, the city had become an ethnic melting pot, where each group claimed its own distinct neighborhood, like the Irish immigrants’ “New Dublin” or “Acre,” and the French-Canadians’ “Little Canada.” The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-of-the-art cotton mills in other communities and working conditions continued to decline as Lowell’s companies stopped reinvesting in their mills. . . . Despite a brief resurgence during World War II, the city shut down its last surviving mill by the mid-1950s.</p>",
    sourceNote: "From “Massachusetts: Lowell National Historical Park”—Public Domain/National Park Service",
    text: massachusettsLowellNationalHistoricalPark20192020FormBPassageText,
    versionLabel: "2019-2020 Form B",
  }),
  questions: massachusettsLowellNationalHistoricalPark20192020FormBQuestions,
};
