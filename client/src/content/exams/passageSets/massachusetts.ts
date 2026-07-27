import { createProsePassage } from "../formatters";
import type { ExamPassageSet, ExamQuestion } from "../types";

const massachusettsPassageText = "During the first half of the 19th century, Lowell, Massachusetts, quickly transformed itself from a farm town to a bustling industrial city. In time, Lowell became a model of industry, gaining global recognition for its state-of-the-art technology, innovative canal and dam system, mill architecture, boardinghouses, churches, and ethnic neighborhoods. Young Yankee women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills, or visit the industrious city that was becoming a popular tourist destination. As one Scottish traveler observed during his visit to America, “Niagara and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.” Today, Lowell National Historical Park welcomes visitors to enjoy the sights of Lowell and learn about the history of one of America’s most significant industrial cities.\n\nThe Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls. Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five- and six-story brick buildings dominated the city’s landscape. . . . The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838. By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river. . . .\n\nThe city’s female workforce was significant in the history of Lowell. From the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life. Most were young single Yankee girls, who were tired of the limited opportunities offered by their domestic work. Women found that Lowell’s mills offered monthly wages for their services and provided them room and board. Although these women gained economic independence in Lowell, the mill boardinghouse keepers constantly supervised their social activities, for which they hardly had any time, considering their daily 12- to 14-hour work schedules. At the end of the day, the factory bell signaled the “mill girls” to return to their boardinghouses. They were expected to adhere to the strict code of conduct respecting curfew and attending church.\n\nYankee “mill girls” continued to dominate the Lowell workforce until the 1840s, when the city began to find it difficult to compete with the growing industrial development in other New England communities. As profits fell, the mill industry cut wages. These wage cuts, deteriorating working conditions, and long workdays led the “mill girls” to protest and organize strikes. When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce. Despite the low wages and unhealthy work conditions, immigrants were eager to\nfind work.\n\nThe immigrants replacing the Yankee “mill girls” during the 1840s were predominantly Irish Catholics, who traveled to America during the Great Potato Famine. Although Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses. Initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared. Irish immigrants dominated the industrial scene until the Civil War, when other immigrant groups began to work in the city mills.\n\nLike the Irish, the French-Canadians, Greeks, Poles, Portuguese, Russian Jews, and Armenians who came to work in Lowell’s mills faced long work hours, low wages, and poor living conditions in the city’s crowded tenements. By the time Lowell’s industry declined, the city had become an ethnic melting pot, where each group claimed its own distinct neighborhood, like the Irish immigrants’ “New Dublin” or “Acre,” and the French-Canadians’ “Little Canada.” The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-of-the-art cotton mills in other communities and working conditions continued to decline as Lowell’s companies stopped reinvesting in their mills. . . . Despite a brief resurgence during World War II, the city shut down its last surviving mill by the mid-1950s.";

const massachusettsQuestions: ExamQuestion[] = [
  {
    "id": "massachusetts-1",
    "points": 1,
    "prompt": "Read this sentence from paragraph 1.\n\nAs one Scottish traveler observed during his visit to America, “Niagara and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.”\n\nThe author most likely includes the quotation from the Scottish traveler in order to",
    "promptHtml": "Read this sentence from paragraph 1.<br><strong>As one Scottish traveler observed during his visit to America, “Niagara and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.”</strong><br>The author <strong>most likely</strong> includes the quotation from the Scottish traveler in order to",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "suggest that people around the world saw the direct contribution of nature and industry to the United States.",
        "text": "suggest that people around the world saw the direct contribution of nature and industry to the United States."
      },
      {
        "id": "B",
        "html": "compare the natural and industrial attractions in the United States at that time.",
        "text": "compare the natural and industrial attractions in the United States at that time."
      },
      {
        "id": "C",
        "html": "convey the idea that the United States offered both natural and industrial attractions.",
        "text": "convey the idea that the United States offered both natural and industrial attractions."
      },
      {
        "id": "D",
        "html": "imply that the natural resources in the United States contributed to the development of industry.",
        "text": "imply that the natural resources in the United States contributed to the development of industry."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-2",
    "points": 1,
    "prompt": "A central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) is conveyed in the passage primarily through a description of the",
    "promptHtml": "A central idea that Lowell was “one of America’s most significant industrial cities” (paragraph 1) is conveyed in the passage primarily through a description of the",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "canals, mills, and boardinghouses that were built by immigrants.",
        "text": "canals, mills, and boardinghouses that were built by immigrants."
      },
      {
        "id": "B",
        "html": "mill girls and immigrants who comprised Lowell’s workforce.",
        "text": "mill girls and immigrants who comprised Lowell’s workforce."
      },
      {
        "id": "C",
        "html": "development of the mills and the workforce established to support them.",
        "text": "development of the mills and the workforce established to support them."
      },
      {
        "id": "D",
        "html": "cultural diversity of the people who lived in the area.",
        "text": "cultural diversity of the people who lived in the area."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-3",
    "points": 1,
    "prompt": "Which sentence from paragraph 2 best supports the idea that Lowell became “a bustling industrial city” (paragraph 1) in a short period of time?",
    "promptHtml": "Which sentence from paragraph 2 <strong>best</strong> supports the idea that Lowell became “a bustling industrial city” (paragraph 1) in a short period of time?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "“The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls.”",
        "text": "“The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls.”"
      },
      {
        "id": "B",
        "html": "“Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five- and six-story brick buildings dominated the city’s landscape.”",
        "text": "“Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five- and six-story brick buildings dominated the city’s landscape.”"
      },
      {
        "id": "C",
        "html": "“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838.”",
        "text": "“The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838.”"
      },
      {
        "id": "D",
        "html": "“By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river.”",
        "text": "“By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river.”"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-4",
    "points": 1,
    "prompt": "Read this sentence from paragraph 3.\n\nFrom the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life.\n\nWhich statement best describes how the sentence fits into the overall structure of the passage?",
    "promptHtml": "Read this sentence from paragraph 3.<br><strong>From the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life.</strong><br>Which statement <strong>best </strong>describes how the sentence fits into the overall structure of the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It provides a transition from a description of the mills to a description of the workforce in those mills.",
        "text": "It provides a transition from a description of the mills to a description of the workforce in those mills."
      },
      {
        "id": "B",
        "html": "It indicates a shift in tone from positive and hopeful to negative and dissatisfied with working conditions at the mill.",
        "text": "It indicates a shift in tone from positive and hopeful to negative and dissatisfied with working conditions at the mill."
      },
      {
        "id": "C",
        "html": "It summarizes a challenge that led many women to leave their hometown and seek work in urban areas.",
        "text": "It summarizes a challenge that led many women to leave their hometown and seek work in urban areas."
      },
      {
        "id": "D",
        "html": "It begins a comparison of the mill workforce between the mid-1800s and the late 1800s.",
        "text": "It begins a comparison of the mill workforce between the mid-1800s and the late 1800s."
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-5",
    "points": 1,
    "prompt": "Read this sentence from paragraph 5.\n\nAlthough Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses.\n\nHow does this sentence contribute to the development of ideas in the passage?",
    "promptHtml": "Read this sentence from paragraph 5.<br><strong>Although Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses.</strong><br>How does this sentence contribute to the development of ideas in the passage?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "It implies that Lowell was founded by early Irish immigrants.",
        "text": "It implies that Lowell was founded by early Irish immigrants."
      },
      {
        "id": "B",
        "html": "It emphasizes the important role Irish immigrants played in Lowell’s history.",
        "text": "It emphasizes the important role Irish immigrants played in Lowell’s history."
      },
      {
        "id": "C",
        "html": "It suggests that the new Irish immigrants were readily accepted into the community.",
        "text": "It suggests that the new Irish immigrants were readily accepted into the community."
      },
      {
        "id": "D",
        "html": "It highlights the working relationship between the mill girls and the new Irish immigrants.",
        "text": "It highlights the working relationship between the mill girls and the new Irish immigrants."
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-6",
    "points": 1,
    "prompt": "Which sentence best summarizes the mill girls’ experience as the dominant workforce in Lowell?",
    "promptHtml": "Which sentence <strong>best</strong> summarizes the mill girls’ experience as the dominant workforce in Lowell?",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "The mill girls were eager to leave their domestic duties and small towns behind, so they went to work in the mills of Lowell.",
        "text": "The mill girls were eager to leave their domestic duties and small towns behind, so they went to work in the mills of Lowell."
      },
      {
        "id": "B",
        "html": "Originally, the mill girls were satisfied to work in Lowell, but as they left their jobs at the Lowell mills, immigrants arrived to fill the empty positions.",
        "text": "Originally, the mill girls were satisfied to work in Lowell, but as they left their jobs at the Lowell mills, immigrants arrived to fill the empty positions."
      },
      {
        "id": "C",
        "html": "Young women left home to work in the Lowell mills, but the mill girls soon became dissatisfied with the working conditions and rigid boardinghouse rules.",
        "text": "Young women left home to work in the Lowell mills, but the mill girls soon became dissatisfied with the working conditions and rigid boardinghouse rules."
      },
      {
        "id": "D",
        "html": "The mill girls embraced city life when they came to work in Lowell’s mills, but when their protests about unfavorable working conditions went unanswered, they left.",
        "text": "The mill girls embraced city life when they came to work in Lowell’s mills, but when their protests about unfavorable working conditions went unanswered, they left."
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "massachusetts-7",
    "points": 1,
    "prompt": "The reason Lowell lost its status as an industrial leader is best illustrated through the",
    "promptHtml": "The reason Lowell lost its status as an industrial leader is <strong>best</strong> illustrated through the",
    "topic": "Central Idea & Theme",
    "choices": [
      {
        "id": "A",
        "html": "description of poor living and working conditions.",
        "text": "description of poor living and working conditions."
      },
      {
        "id": "B",
        "html": "explanation for why some immigrant groups struggled to live together.",
        "text": "explanation for why some immigrant groups struggled to live together."
      },
      {
        "id": "C",
        "html": "comparison with other mills that used modern methods.",
        "text": "comparison with other mills that used modern methods."
      },
      {
        "id": "D",
        "html": "information about the mills opening temporarily during World War II.",
        "text": "information about the mills opening temporarily during World War II."
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
];

export const massachusettsPassageSet: ExamPassageSet = {
  id: "ela-massachusetts",
  questionCount: massachusettsQuestions.length,
  directions: {
  "subject": "English Language Arts",
  "title": "READING COMPREHENSION",
  "breadcrumbLabel": "ELA RDG COMP DIRECTIONS",
  "body": "Read each text and answer the related questions. Base your answers only on the content within the text."
},
  passage: createProsePassage({
    id: "massachusetts",
    title: "Massachusetts: Lowell National Historical Park",
    richText: "<p>During the first half of the 19th century, Lowell, Massachusetts, quickly transformed itself from a farm town to a bustling industrial city. In time, Lowell became a model of industry, gaining global recognition for its state-of-the-art technology, innovative canal and dam system, mill architecture, boardinghouses, churches, and ethnic neighborhoods. Young Yankee women, immigrant families, and European tourists all flocked to Lowell to find work at one of the many textile mills, or visit the industrious city that was becoming a popular tourist destination. As one Scottish traveler observed during his visit to America, “Niagara and Lowell are the two objects I will longest remember in my American journey, the one the glory of American scenery, the other of American industry.” Today, Lowell National Historical Park welcomes visitors to enjoy the sights of Lowell and learn about the history of one of America’s most significant industrial cities.</p><p>The Boston merchants who founded Lowell in 1821 and named it after Francis Cabot Lowell chose to locate the town along Massachusetts’s Merrimack River to take advantage of the kinetic energy offered by the Pawtucket waterfalls. Over six miles of canals powered the waterwheels of Lowell’s mills, whose massive five- and six-story brick buildings dominated the city’s landscape. . . . The most recognized of these buildings are the Lowell Manufacturing Company chartered in 1821, the Suffolk or Wannalancit Mill completed around the 1880s, the Boott Mill Company established in 1835, and the Boott Mill Boardinghouse that opened in 1838. By the 1850s, 40 textile mills employing over 10,000 workers stretched for about a mile along the river. . . .</p><p>The city’s female workforce was significant in the history of Lowell. From the early to mid-1800s, women left the constricted lifestyle of small rural towns and rural areas for independent industrial city life. Most were young single Yankee girls, who were tired of the limited opportunities offered by their domestic work. Women found that Lowell’s mills offered monthly wages for their services and provided them room and board. Although these women gained economic independence in Lowell, the mill boardinghouse keepers constantly supervised their social activities, for which they hardly had any time, considering their daily 12- to 14-hour work schedules. At the end of the day, the factory bell signaled the “mill girls” to return to their boardinghouses. They were expected to adhere to the strict code of conduct respecting curfew and attending church.</p><p>Yankee “mill girls” continued to dominate the Lowell workforce until the 1840s, when the city began to find it difficult to compete with the growing industrial development in other New England communities. As profits fell, the mill industry cut wages. These wage cuts, deteriorating working conditions, and long workdays led the “mill girls” to protest and organize strikes. When their demands went unheard, the women left Lowell, and immigrant groups replaced them in the workforce. Despite the low wages and unhealthy work conditions, immigrants were eager to<br>find work.</p><p>The immigrants replacing the Yankee “mill girls” during the 1840s were predominantly Irish Catholics, who traveled to America during the Great Potato Famine. Although Lowell received an influx of Irish families during this time, the Irish were a part of the city’s history from its birth, and before the “mill girls” arrived, they built Lowell’s historic canals, mills, and boardinghouses. Initially, Lowell’s Protestant community was slow to welcome Irish immigrants, but the hostility between Yankee Protestants and Irish Catholics eventually disappeared. Irish immigrants dominated the industrial scene until the Civil War, when other immigrant groups began to work in the city mills.</p><p>Like the Irish, the French-Canadians, Greeks, Poles, Portuguese, Russian Jews, and Armenians who came to work in Lowell’s mills faced long work hours, low wages, and poor living conditions in the city’s crowded tenements. By the time Lowell’s industry declined, the city had become an ethnic melting pot, where each group claimed its own distinct neighborhood, like the Irish immigrants’ “New Dublin” or “Acre,” and the French-Canadians’ “Little Canada.” The city officially began to close down its mills in the 1920s and ’30s after Lowell’s outdated mills could no longer compete against the state-of-the-art cotton mills in other communities and working conditions continued to decline as Lowell’s companies stopped reinvesting in their mills. . . . Despite a brief resurgence during World War II, the city shut down its last surviving mill by the mid-1950s.</p>",
    sourceNote: "From “Massachusetts: Lowell National Historical Park”—Public Domain/National Park Service",
    text: massachusettsPassageText,
  }),
  questions: massachusettsQuestions,
};
