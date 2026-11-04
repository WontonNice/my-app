import type { ExamMathSection } from "../types";

export const content20252026FormBMathSection: ExamMathSection = {
  directions: {
  "body": "Solve each problem. Select the answer from the choices given or enter your answer in the space provided.",
  "breadcrumbLabel": "MATH DIRECTIONS",
  "notes": [
    "Formulas and definitions of mathematical terms and symbols are not provided.",
    "Diagrams other than graphs are not necessarily drawn to scale."
  ],
  "subject": "MATHEMATICS",
  "title": "IMPORTANT NOTES"
},
  id: "2025-2026-form-b-math",
  label: "Math",
  questionCount: 57,
  questions: [
  {
    "id": "2025-2026-form-b-math-1",
    "skilled": "TBD",
    "points": 1,
    "prompt": "If \\(x = 9\\)  and \\(y=−7\\) , what is the value of \\(x(x − 2y)?\\)",
    "promptHtml": "If&nbsp;\\(x&nbsp;=&nbsp;9\\) &nbsp;and&nbsp;\\(y=−7\\) ,&nbsp;what&nbsp;is&nbsp;the&nbsp;value&nbsp;of&nbsp;\\(x(x&nbsp;−&nbsp;2y)?\\)",
    "topic": "Algebra",
    "subtopic": "Algebraic Expressions",
    "choices": [
      {
        "id": "A",
        "html": "\\(18\\)",
        "text": "\\(18\\)"
      },
      {
        "id": "B",
        "html": "\\(45\\)",
        "text": "\\(45\\)"
      },
      {
        "id": "C",
        "html": "\\(144\\)",
        "text": "\\(144\\)"
      },
      {
        "id": "D",
        "html": "\\(207\\)",
        "text": "\\(207\\)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-math-3",
    "skilled": "TBD",
    "points": 1,
    "prompt": "The decimal 0.06 can be written as the fraction \\(\\frac{x}{50}\\) . What is the value of \\(x\\) ?",
    "promptHtml": "The&nbsp;decimal&nbsp;0.06&nbsp;can&nbsp;be&nbsp;written&nbsp;as&nbsp;the&nbsp;fraction&nbsp;\\(\\frac{x}{50}\\) .&nbsp;What&nbsp;is&nbsp;the&nbsp;value&nbsp;of&nbsp;\\(x\\) ?&nbsp;&nbsp;",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Fractions & Decimals",
    "choices": [
      {
        "id": "A",
        "html": "\\(3\\)",
        "text": "\\(3\\)"
      },
      {
        "id": "B",
        "html": "\\(6\\)",
        "text": "\\(6\\)"
      },
      {
        "id": "C",
        "html": "\\(12\\)",
        "text": "\\(12\\)"
      },
      {
        "id": "D",
        "html": "\\(30\\)",
        "text": "\\(30\\)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-60",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "60"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q60-1-png-passage.png\" alt=\"Supplied explanation for question 60\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "The list shows the results of a survey. A survey was taken to see whether students like basketball, soccer, both, or neither. These were the results:\n25 students like basketball.\n19 students like soccer.\n7 students like both basketball and soccer.\n10 students don’t like either basketball or soccer.\nUse the information provided to determine how many students were surveyed and how many like only soccer.\nMove the correct answer to each box.",
    "promptHtml": "<p><span><span>The </span><span>list </span><span>shows </span><span>the </span><span>results</span><span> of </span><span>a </span><span>survey</span><span>. </span><span>A </span><span>survey </span><span>was </span><span>taken </span><span>to </span><span>see </span><span>whether </span><span>students </span><span>like </span><span>basketball, </span><span>soccer, </span><span>both, </span><span>or </span><span>neither. </span><span>These </span><span>were </span><span>the </span><span>results:</span></span></p> <ul><li><span>25 students like basketball.</span></li><li><span>19 students like soccer.</span></li><li><span>7 students like both basketball and soccer.</span></li><li><span>10 students don’t like either basketball or soccer.</span></li></ul> <p><span><span>Use </span><span>the </span><span>information </span><span>provided </span><span>to </span><span>determine </span><span>how </span><span>many </span><span>students </span><span>were </span><span>surveyed </span><span>and </span><span>how </span><span>many </span><span>like </span><span>only</span><span> soccer.</span></span></p> <p><span><span>Move </span><span>the </span><span>correct </span><span>answer </span><span>to </span><span>each</span><span> box.</span></span></p>",
    "dragDropContentHtml": "<p>There were {{slot-1}} students surveyed, and {{slot-2}} students like only soccer.</p>",
    "topic": "Statistics and Probability",
    "subtopic": "Counting & Sets",
    "allowReuse": false,
    "dragDropStyle": "outlined",
    "dragDropContent": [
      "There were {{slot-1}} students surveyed, and {{slot-2}} students like only soccer."
    ],
    "dragDropSlots": [
      {
        "correctItemId": "item-5",
        "id": "slot-1",
        "width": 50
      },
      {
        "correctItemId": "item-1",
        "id": "slot-2",
        "width": 50
      }
    ],
    "items": [
      {
        "id": "item-1",
        "text": "12"
      },
      {
        "id": "item-2",
        "text": "19"
      },
      {
        "id": "item-3",
        "text": "26"
      },
      {
        "id": "item-4",
        "text": "3"
      },
      {
        "id": "item-5",
        "text": "47"
      },
      {
        "id": "item-6",
        "text": "54"
      }
    ],
    "type": "math_drag_drop"
  },
  {
    "id": "2025-2026-form-b-math-2",
    "skilled": "TBD",
    "points": 1,
    "prompt": "At a diner, 18 dozen buns were used yesterday for 150 lunch customers. Today, there were 250 lunch customers. Assuming that the bun usage rate is the same for both days, which proportions can be used to determine how many dozen buns are needed for 250 lunch customers?\n\nSelect the three correct answers.",
    "promptHtml": "<p></p><p>At&nbsp;a&nbsp;diner,&nbsp;18&nbsp;dozen&nbsp;buns&nbsp;were&nbsp;used&nbsp;yesterday&nbsp;for&nbsp;150&nbsp;lunch&nbsp;customers.&nbsp;Today,&nbsp;there&nbsp;were&nbsp;250&nbsp;lunch&nbsp;customers.&nbsp;Assuming&nbsp;that&nbsp;the&nbsp;bun&nbsp;usage&nbsp;rate&nbsp;is&nbsp;the&nbsp;same&nbsp;for&nbsp;both&nbsp;days,&nbsp;which&nbsp;proportions&nbsp;can be&nbsp;used&nbsp;to&nbsp;determine&nbsp;how&nbsp;many&nbsp;dozen&nbsp;buns&nbsp;are&nbsp;needed&nbsp;for&nbsp;250&nbsp;lunch&nbsp;customers?</p><p></p><p></p><p>Select&nbsp;the&nbsp;<strong>three</strong>&nbsp;correct&nbsp;answers.</p><p></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "\\(\\frac{18}{150}=\\frac{x}{250}\\)",
        "math": "\\frac{18}{150}=\\frac{x}{250}",
        "text": "\\(\\frac{18}{150}=\\frac{x}{250}\\)"
      },
      {
        "id": "B",
        "html": "\\(\\)",
        "math": "\\frac{18}{250}=\\frac{x}{150}",
        "text": "\\(\\)"
      },
      {
        "id": "C",
        "html": "\\(\\)",
        "math": "\\frac{150}{18}=\\frac{250}{x}",
        "text": "\\(\\)"
      },
      {
        "id": "D",
        "html": "\\(30\\)",
        "math": "\\frac{x}{18}=\\frac{250}{150}",
        "text": "\\(30\\)"
      },
      {
        "id": "E",
        "math": "\\frac{x}{150}=\\frac{18}{250}",
        "text": "\\frac{18}{150}=\\frac{x}{250}"
      }
    ],
    "correctChoiceIds": [
      "A",
      "C",
      "D"
    ],
    "requiredSelections": 3,
    "type": "multi_select"
  },
  {
    "id": "2025-2026-form-b-math-4",
    "skilled": "TBD",
    "points": 1,
    "prompt": "Maria is playing a game in which players earn points called minks, zogs, and barts.\n\\(1\\)  mink = \\(3\\)  zogs\n\\(1\\)  mink =\\(\\frac14\\)  bart\nMaria has 60 zogs and 24 barts. She wants to exchange her zogs and barts for minks.\nHow many minks will Maria receive from the exchange?\n\nEnter your answer in the space.",
    "promptHtml": "<p></p><p>Maria&nbsp;is&nbsp;playing&nbsp;a&nbsp;game&nbsp;in&nbsp;which&nbsp;players&nbsp;earn&nbsp;points&nbsp;called&nbsp;minks,&nbsp;zogs,&nbsp;and&nbsp;barts.</p><p>\\(1\\) &nbsp;mink&nbsp;= \\(3\\) &nbsp;zogs<br>\\(1\\) &nbsp;mink&nbsp;=\\(\\frac14\\) &nbsp;bart</p><p>Maria&nbsp;has&nbsp;60&nbsp;zogs&nbsp;and&nbsp;24&nbsp;barts.&nbsp;She&nbsp;wants&nbsp;to&nbsp;exchange&nbsp;her&nbsp;zogs&nbsp;and&nbsp;barts&nbsp;for&nbsp;minks.</p><p>How&nbsp;many&nbsp;minks&nbsp;will&nbsp;Maria&nbsp;receive&nbsp;from&nbsp;the&nbsp;exchange?</p><p></p><p></p><p>Enter&nbsp;your&nbsp;answer&nbsp;in&nbsp;the&nbsp;space.</p><p></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Units & Conversions",
    "correctTextAnswers": [
      "116"
    ],
    "type": "short_response"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-63",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "63"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q63-1-png-passage.png\" alt=\"Supplied explanation for question 63\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "How many 5-digit numbers can be created using the digits 2, 3, 5, 7, and 8 without repeating any digits within that 5-digit number?\nEnter your answer in the space.",
    "promptHtml": "<p><span>How many </span><span>5-</span><span><span>digit</span> <span>numbers</span><span> can </span><span>be </span><span>created </span><span>using </span><span>the </span><span>digits </span><span>2, </span><span>3, </span><span>5, </span><span>7, </span><span>and </span><span>8 </span><span>without </span><span>repeating </span><span>any </span><span>digits </span><span>within </span><span>that </span></span><span><span><span data-no-break=\"true\">5-digit</span></span></span><span> number?</span></p><p><span>Enter your answer in the space.</span></p><div><p>\n</p>\n\n<p></p></div>",
    "topic": "Statistics and Probability",
    "subtopic": "Counting & Sets",
    "correctTextAnswers": [
      "120"
    ],
    "type": "short_response"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-64",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "64"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q64-1-png-passage.png\" alt=\"Supplied explanation for question 64\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "In the figure above, \\(\\text{PQRS}\\) is a parallelogram. The measure of \\(∠\\text{PQT}\\) is \\(50^{\\circ}\\), and the measure of \\(∠\\text{PTQ}\\) is \\(70^{\\circ}\\). What is the measure of \\(∠\\text{QRS?}\\)",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm04-201-1-svgz-passage.svgz\" alt=\"Figure PQRS is a parallelogram. Point T is between Point P and Point S. A straight line connects point T at the bottom of the parallelogram to point Q at the top.  \" width=\"270\"></span></p><p><span><span>In </span><span>the </span><span>figure</span><span> above, </span></span><span><span>\\(\\text{PQRS}\\)</span></span><span><span> is </span><span>a </span><span>parallelogram</span><span>. </span><span>The </span><span>measure</span><span> of </span></span><span><span>\\(∠\\text{PQT}\\)</span></span><span> is </span><span><span>\\(50^{\\circ}\\)</span></span><span>,</span><span> and the measure of </span><span><span>\\(∠\\text{PTQ}\\)</span></span><span> is </span><span><span>\\(70^{\\circ}\\)</span></span><span>.</span><span> What is the measure of </span><span><span>\\(∠\\text{QRS?}\\)</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Quadrilaterals & Polygons",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(60^{\\circ}\\)</span></span></p>",
        "text": "\\(60^{\\circ}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(70^{\\circ}\\)</span></span></p>",
        "text": "\\(70^{\\circ}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(80^{\\circ}\\)</span></span></p>",
        "text": "\\(80^{\\circ}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(120^{\\circ}\\)</span></span></p>",
        "text": "\\(120^{\\circ}\\)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-65",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "65"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q65-1-png-passage.png\" alt=\"Supplied explanation for question 65\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "\\(M=3N=\\frac{P}{4}=Q+5=\\frac{R}{7}>0\\)\nBased on the statement above, which variable has the greatest value?",
    "promptHtml": "<p data-align=\"center\"><span><span>\\(M=3N=\\frac{P}{4}=Q+5=\\frac{R}{7}&gt;0\\)</span></span></p> <p><span><span>Based </span><span>on </span><span>the </span><span>statement </span><span>above, </span><span>which </span><span>variable</span><span> has </span><span>the </span><strong>greatest</strong> <span>value</span><span>?</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(M\\)</span></span></p>",
        "text": "\\(M\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(N\\)</span></span></p>",
        "text": "\\(N\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(P\\)</span></span></p>",
        "text": "\\(P\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(R\\)</span></span></p>",
        "text": "\\(R\\)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-66",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "66"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q66-1-png-passage.png\" alt=\"Supplied explanation for question 66\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A roofing contractor uses shingles at a rate of 3 bundles for every 96 square feet of roof covered. At this rate, how many bundles of shingles will he need in order to cover a roof that is 416 square feet?",
    "promptHtml": "<p><span><span>A </span><span>roofing </span><span>contractor </span><span>uses </span><span>shingles </span><span>at </span><span>a </span><span>rate</span><span> of </span><span>3 </span><span>bundles </span><span>for </span><span>every </span></span><span><span data-no-break=\"true\">96 <span>square feet</span> </span></span> <span><span>of </span><span>roof </span><span>covered. </span><span>At </span><span>this </span><span>rate, </span><span>how </span><span>many </span><span>bundles </span><span>of </span><span>shingles </span><span>will </span><span>he </span><span>need </span><span>in </span><span>order</span><span> to </span><span>cover </span><span>a </span><span>roof </span><span>that </span><span>is </span><span data-no-break=\"true\">416 square</span><span> feet?</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Rates & Unit Rates",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>5</span></p>",
        "text": "5"
      },
      {
        "id": "B",
        "html": "<p><span>12</span></p>",
        "text": "12"
      },
      {
        "id": "C",
        "html": "<p><span>13</span></p>",
        "text": "13"
      },
      {
        "id": "D",
        "html": "<p><span>14</span></p>",
        "text": "14"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-67",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "67"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q67-1-png-passage.png\" alt=\"Supplied explanation for question 67\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "To make party invitations, Macie could buy a package of paper for $10.50, or she could buy \\(x\\) individual sheets of the same paper for $0.15 each. What is the largest value of \\(x\\) that would make buying the individual sheets less expensive than buying the package?",
    "promptHtml": "<p><span>To make party invitations, Macie could buy a package of paper for $10.50, or she could buy </span><span><span>\\(x\\)</span></span><span><span> individual </span><span>sheets </span><span>of </span><span>the </span><span>same </span><span>paper </span><span>for </span><span>$0.15 </span><span>each</span><span>. </span><span>What </span><span>is </span><span>the </span><span>largest </span><span>value</span><span> of </span></span><span><span>\\(x\\)</span></span><span><span> that </span><span>would </span><span>make </span><span>buying </span><span>the </span><span>individual </span><span>sheets </span><span><strong>less</strong></span><span> expensive </span><span>than </span><span>buying </span><span>the </span><span>package?</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Inequalities",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>60</span></p>",
        "text": "60"
      },
      {
        "id": "B",
        "html": "<p><span>65</span></p>",
        "text": "65"
      },
      {
        "id": "C",
        "html": "<p><span>69</span></p>",
        "text": "69"
      },
      {
        "id": "D",
        "html": "<p><span>70</span></p>",
        "text": "70"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-68",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "68"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q68-1-png-passage.png\" alt=\"Supplied explanation for question 68\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "At 1:00 p.m. one day, the temperature was 8 degrees above zero. During the rest of the day, the temperature fell 3 degrees per hour. What was the temperature at 7:00 p.m. that day?",
    "promptHtml": "<p><span><span>At </span><span>1:00 </span><span>p.m. </span><span>one </span><span>day, </span><span>the </span><span>temperature</span><span> was </span><span data-no-break=\"true\">8 degrees</span><span> above </span><span>zero. </span><span>During </span><span>the </span><span>rest </span><span>of </span><span>the </span><span>day, </span><span>the </span><span>temperature </span><span>fell </span><span data-no-break=\"true\">3 degrees</span> <span>per</span> <span>hour</span><span>. </span><span>What </span><span>was </span><span>the </span><span>temperature </span><span>at </span><span data-no-break=\"true\">7:00 p.m.</span><span> that </span><span>day?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Integers & Absolute Value",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(-13^{\\circ}\\)</span></span></p>",
        "text": "\\(-13^{\\circ}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(-10^{\\circ}\\)</span></span></p>",
        "text": "\\(-10^{\\circ}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(-7^{\\circ}\\)</span></span></p>",
        "text": "\\(-7^{\\circ}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(5^{\\circ}\\)</span></span></p>",
        "text": "\\(5^{\\circ}\\)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-69",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "69"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q69-1-png-passage.png\" alt=\"Supplied explanation for question 69\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A bag contains 75 marbles that are red, blue, or green. The ratio of red to blue marbles is 15:7, and the ratio of blue to green marbles is 7:3. If 2 blue marbles are removed and replaced with 2 green marbles, what will be the new ratio of red to green marbles?",
    "promptHtml": "<p><span><span>A </span><span>bag </span><span>contains </span><span>75 </span><span>marbles </span><span>that </span><span>are </span><span>red, </span><span>blue, </span><span>or </span><span>green. </span><span>The </span><span>ratio</span><span> of </span><span>red </span><span>to </span><span>blue </span><span>marbles </span><span>is </span></span><span><span>15:7,</span></span><span> and the ratio of blue to green marbles is </span><span><span>7:3.</span></span><span> If 2 blue marbles are removed and replaced with 2 green marbles, what will be the new ratio of red to green marbles?</span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>3:1</span></span></p>",
        "text": "3:1"
      },
      {
        "id": "B",
        "html": "<p><span><span>5:1</span></span></p>",
        "text": "5:1"
      },
      {
        "id": "C",
        "html": "<p><span><span>15:3</span></span></p>",
        "text": "15:3"
      },
      {
        "id": "D",
        "html": "<p><span>45:11</span></p>",
        "text": "45:11"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-70",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "70"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q70-1-png-passage.png\" alt=\"Supplied explanation for question 70\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "DESSERT CHOICESDessert Number of Times Ordered\nCookies 42\nPie 23\nCake 47\nIce Cream 48\n\nThe table above shows the number of times that different desserts were ordered at a restaurant. Based on this information, what is the probability of a customer ordering ice cream as a dessert?",
    "promptHtml": "<table data-table-style=\"compact\"><caption><span>DESSERT CHOICES</span></caption><tbody><tr><th scope=\"col\"><span>Dessert</span></th><th scope=\"col\"><span>Number of Times Ordered</span></th></tr><tr><td><span>Cookies</span></td><td data-align=\"center\"><span>42</span></td></tr><tr><td><span>Pie</span></td><td data-align=\"center\"><span>23</span></td></tr><tr><td><span>Cake</span></td><td data-align=\"center\"><span>47</span></td></tr><tr><td><span>Ice Cream</span></td><td data-align=\"center\"><span>48</span></td></tr></tbody></table> <p>&nbsp;</p><p><span><span>The </span><span>table </span><span>above </span><span>shows </span><span>the </span><span>number</span><span> of </span><span>times</span><span> that </span><span>different </span><span>desserts </span><span>were </span><span>ordered </span><span>at </span><span>a </span><span>restaurant. </span><span>Based </span><span>on </span><span>this </span><span>information, </span><span>what </span><span>is </span><span>the </span><span>probability</span><span> of </span><span>a </span><span>customer </span><span>ordering </span><span>ice </span><span>cream </span><span>as </span><span>a </span><span>dessert?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>25%</span></p>",
        "text": "25%"
      },
      {
        "id": "B",
        "html": "<p><span>30%</span></p>",
        "text": "30%"
      },
      {
        "id": "C",
        "html": "<p><span>40%</span></p>",
        "text": "40%"
      },
      {
        "id": "D",
        "html": "<p><span>48%</span></p>",
        "text": "48%"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-71",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "71"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q71-1-png-passage.png\" alt=\"Supplied explanation for question 71\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "What is the least common multiple of 24, 6, and 18?",
    "promptHtml": "<p><span><span>What </span><span>is </span><span>the </span><span>least </span><span>common </span><span>multiple of</span><span> 24, </span><span>6, </span><span>and </span><span>18?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Number Types & Properties",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>36</span></p>",
        "text": "36"
      },
      {
        "id": "B",
        "html": "<p><span>48</span></p>",
        "text": "48"
      },
      {
        "id": "C",
        "html": "<p><span>72</span></p>",
        "text": "72"
      },
      {
        "id": "D",
        "html": "<p><span>144</span></p>",
        "text": "144"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-72",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "72"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q72-1-png-passage.png\" alt=\"Supplied explanation for question 72\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A basket contains 3 apples, 4 oranges, 5 bananas, and 8 pears.\nIf one piece of fruit is randomly pulled from the basket, what is the probability that it will be a pear?\nSelect the place on the number line to plot the point.",
    "promptHtml": "<p><span>A basket contains 3 apples, 4 oranges, 5 bananas, and 8 pears.</span></p> <p><span><span>If </span><span>one </span><span>piece </span><span>of </span><span>fruit </span><span>is </span><span>randomly </span><span>pulled </span><span>from </span><span>the </span><span>basket, </span><span>what </span><span>is </span><span>the </span><span>probability</span><span> that </span><span>it </span><span>will </span><span>be </span><span>a </span><span>pear?</span></span></p><p><span><span>Select </span><span>the </span><span>place </span><span>on </span><span>the </span><span>number line</span><span> to </span><span>plot</span><span> the </span><span>point</span><span>.</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "correctPointIds": [
      "point-5"
    ],
    "graph": {
      "points": [
        {
          "id": "point-1",
          "x": 0,
          "y": 0,
          "sourceX": 29,
          "sourceY": 13
        },
        {
          "id": "point-2",
          "x": 0.1,
          "y": 0,
          "sourceX": 59,
          "sourceY": 13
        },
        {
          "id": "point-3",
          "x": 0.2,
          "y": 0,
          "sourceX": 89,
          "sourceY": 13
        },
        {
          "id": "point-4",
          "x": 0.3,
          "y": 0,
          "sourceX": 119,
          "sourceY": 13
        },
        {
          "id": "point-5",
          "x": 0.4,
          "y": 0,
          "sourceX": 149,
          "sourceY": 13
        },
        {
          "id": "point-6",
          "x": 0.5,
          "y": 0,
          "sourceX": 179,
          "sourceY": 13
        },
        {
          "id": "point-7",
          "x": 0.6,
          "y": 0,
          "sourceX": 209,
          "sourceY": 13
        },
        {
          "id": "point-8",
          "x": 0.7,
          "y": 0,
          "sourceX": 239,
          "sourceY": 13
        },
        {
          "id": "point-9",
          "x": 0.8,
          "y": 0,
          "sourceX": 269,
          "sourceY": 13
        },
        {
          "id": "point-10",
          "x": 0.9,
          "y": 0,
          "sourceX": 299,
          "sourceY": 13
        },
        {
          "id": "point-11",
          "x": 1,
          "y": 0,
          "sourceX": 329,
          "sourceY": 13
        }
      ],
      "sourceImage": {
        "alt": "A number line ranges from 0 to 1, with intervals of one tenth.",
        "src": "/exam-images/restore-shb25-008-1-svgz-passage.svgz",
        "width": 358,
        "height": 46
      },
      "xLabel": "x",
      "xMax": 1,
      "xMin": 0,
      "xStep": 1,
      "yLabel": "y",
      "yMax": 1,
      "yMin": 0,
      "yStep": 1
    },
    "requiredSelections": 1,
    "type": "graph_point_select"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-73",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "73"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q73-1-png-passage.png\" alt=\"Supplied explanation for question 73\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A cooler contains three types of beverages: 5 bottles of apple juice, 3 bottles of grape juice, and 6 bottles of orange juice. What is the probability that a bottle chosen at random from this cooler is not apple juice?",
    "promptHtml": "<p><span><span>A </span><span>cooler </span><span>contains </span><span>three </span><span>types </span><span>of </span><span>beverages: </span><span>5 </span><span>bottles </span><span>of </span><span>apple </span><span>juice, </span><span>3 </span><span>bottles </span><span>of </span><span>grape </span><span>juice, </span><span>and </span><span>6 </span><span>bottles </span><span>of </span><span>orange </span><span>juice. </span><span>What </span><span>is </span><span>the </span><span>probability</span><span> that </span><span>a </span><span>bottle </span><span>chosen </span><span>at </span><span>random</span><span> from </span><span>this </span><span>cooler </span><span>is </span><span><strong>not</strong></span><span> apple </span><span>juice?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{1}{9}\\)</span></span></p>",
        "text": "\\(\\frac{1}{9}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(\\frac{5}{14}\\)</span></span></p>",
        "text": "\\(\\frac{5}{14}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{9}{14}\\)</span></span></p>",
        "text": "\\(\\frac{9}{14}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\frac{2}{3}\\)</span></span></p>",
        "text": "\\(\\frac{2}{3}\\)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-74",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "74"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q74-1-png-passage.png\" alt=\"Supplied explanation for question 74\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A large circular dinner plate has a radius of 20 centimeters. A smaller circular plate with a circumference of \\(20\\pi \\) centimeters is placed in the center of the larger dinner plate. What is the area of the part of the larger dinner plate that is not covered by the smaller plate?",
    "promptHtml": "<p><span><span>A </span><span>large</span> <span>circular</span><span> dinner </span><span>plate </span><span>has </span><span>a </span><span>radius</span><span> of </span></span><span data-no-break=\"true\"><span><span>20 </span><span>centimeters</span><span>.</span></span></span><span><span> A </span><span>smaller </span><span>circular </span><span>plate </span><span>with </span><span>a </span><span>circumference</span><span> of </span></span><span data-no-break=\"true\"><span><span>\\(20\\pi \\)</span></span><span> centimeters</span></span><span><span> is </span><span>placed </span><span>in </span><span>the </span><span>center</span><span> of </span><span>the </span><span>larger </span><span>dinner </span><span>plate. </span><span>What </span><span>is </span><span>the </span><span>area</span><span> of </span><span>the </span><span>part </span><span>of </span><span>the </span><span>larger </span><span>dinner </span><span>plate </span><span>that </span><span>is </span><span><strong>not</strong></span><span> covered </span><span>by </span><span>the </span><span>smaller </span><span>plate?</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Circles",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(20\\pi \\)</span></span><span><span> sq cm</span></span></p>",
        "text": "\\(20\\pi \\) sq cm"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(100\\pi \\)</span></span><span><span> sq cm</span></span></p>",
        "text": "\\(100\\pi \\) sq cm"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(200\\pi \\)</span></span><span><span> sq cm</span></span></p>",
        "text": "\\(200\\pi \\) sq cm"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(300\\pi \\)</span></span><span><span> sq cm</span></span></p>",
        "text": "\\(300\\pi \\) sq cm"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-75",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "75"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q75-1-png-passage.png\" alt=\"Supplied explanation for question 75\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Which tables represent a proportional relationship between the number of books purchased and the total cost?\nSelect the two correct answers.",
    "promptHtml": "<p><span><span>Which </span><span>tables </span><span>represent </span><span>a </span><span>proportional</span><span> relationship </span><span>between</span><span> the </span><span>number</span><span> of </span><span>books </span><span>purchased </span><span>and </span><span>the </span><span>total</span><span> cost?</span></span></p><p><span><span>Select </span><span>the </span><strong>two</strong><span> correct </span><span>answers.</span></span></p>",
    "hideChoiceLabels": true,
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "<img src=\"/exam-images/2025-2026-form-b-q18-choice-a-testnav-passage.png\" alt=\"Number of Books Purchased, 10, 15, 20, 25; Total Cost ($), 40, 60, 80, 100\" width=\"386\">",
        "text": "Number of Books Purchased 10 15 20 25\nTotal Cost ($) 40 60 80 100"
      },
      {
        "id": "B",
        "html": "<img src=\"/exam-images/2025-2026-form-b-q18-choice-b-testnav-passage.png\" alt=\"Number of Books Purchased, 10, 15, 20, 25; Total Cost ($), 70, 110, 150, 250\" width=\"403\">",
        "text": "Number of Books Purchased 10 15 20 25\nTotal Cost ($) 70 110 150 250"
      },
      {
        "id": "C",
        "html": "<img src=\"/exam-images/2025-2026-form-b-q18-choice-c-testnav-passage.png\" alt=\"Number of Books Purchased, 10, 15, 20, 25; Total Cost ($), 80, 120, 160, 200\" width=\"404\">",
        "text": "Number of Books Purchased 10 15 20 25\nTotal Cost ($) 80 120 160 200"
      },
      {
        "id": "D",
        "html": "<img src=\"/exam-images/2025-2026-form-b-q18-choice-d-testnav-passage.png\" alt=\"Number of Books Purchased, 10, 15, 20, 25; Total Cost ($), 90, 130, 170, 210\" width=\"404\">",
        "text": "Number of Books Purchased 10 15 20 25\nTotal Cost ($) 90 130 170 210"
      },
      {
        "id": "E",
        "html": "<img src=\"/exam-images/2025-2026-form-b-q18-choice-e-testnav-passage.png\" alt=\"Number of Books Purchased, 10, 15, 20, 25; Total Cost ($), 100, 100, 100, 100\" width=\"413\">",
        "text": "Number of Books Purchased 10 15 20 25\nTotal Cost ($) 100 100 100 100"
      }
    ],
    "correctChoiceIds": [
      "A",
      "C"
    ],
    "requiredSelections": 2,
    "type": "multi_select"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-76",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "76"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q76-1-png-passage.png\" alt=\"Supplied explanation for question 76\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "How many positive integers satisfy the inequality \\(x+7<23\\text{?}\\)\nEnter your answer in the space.",
    "promptHtml": "<p><span><span>How </span><span>many </span><span>positive</span> <span>integers</span><span> satisfy </span><span>the </span><span>inequality</span> </span><span><span>\\(x+7&lt;23\\text{?}\\)</span></span></p><p><span>Enter your answer in the space.</span></p><div><p>\n</p>\n\n <p></p></div>",
    "topic": "Algebra",
    "subtopic": "Inequalities",
    "correctTextAnswers": [
      "15"
    ],
    "type": "short_response"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-77",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "77"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q77-1-png-passage.png\" alt=\"Supplied explanation for question 77\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "If \\(\\frac{36}{y}=4x,\\) what is the value of \\(x\\) when \\(y=3?\\)",
    "promptHtml": "<p><span>If </span><span><span>\\(\\frac{36}{y}=4x,\\)</span></span><span><span> what </span><span>is </span><span>the </span><span>value</span><span> of </span></span><span><span>\\(x\\)</span></span><span> when </span><span><span>\\(y=3?\\)</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>3</span></p>",
        "text": "3"
      },
      {
        "id": "B",
        "html": "<p><span>4</span></p>",
        "text": "4"
      },
      {
        "id": "C",
        "html": "<p><span>9</span></p>",
        "text": "9"
      },
      {
        "id": "D",
        "html": "<p><span>12</span></p>",
        "text": "12"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-78",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "78"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q78-1-png-passage.png\" alt=\"Supplied explanation for question 78\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Points \\(\\text{X, Y,}\\) and \\(\\text{Z}\\) are on a straight line, and \\(\\text{Y}\\) is between \\(\\text{X}\\) and \\(\\text{Z.}\\) Length \\(\\overline{\\text{YZ}}=\\frac{3}{5}\\overline{\\text{XY}}\\text{,}\\) and length \\(\\overline{\\text{XY}}=20\\text{ centimeters.}\\) What is the length of \\(\\overline{\\text{XZ}}\\text{?}\\)",
    "promptHtml": "<p><span><span>Points</span> </span><span><span>\\(\\text{X, Y,}\\)</span></span><span> and </span><span><span>\\(\\text{Z}\\)</span></span><span><span> are </span><span>on </span><span>a </span><span>straight</span> <span>line</span><span>, </span><span>and </span></span><span><span>\\(\\text{Y}\\)</span></span><span><span> is </span><span>between</span> </span><span><span>\\(\\text{X}\\)</span></span><span> and </span><span><span>\\(\\text{Z.}\\)</span></span> <span><span>Length</span> </span><span><span>\\(\\overline{\\text{YZ}}=\\frac{3}{5}\\overline{\\text{XY}}\\text{,}\\)</span></span><span> and length </span><span><span>\\(\\overline{\\text{XY}}=20\\text{ centimeters.}\\)</span></span><span> What is the length of </span><span><span>\\(\\overline{\\text{XZ}}\\text{?}\\)</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Coordinate Geometry & Transformations",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>12 cm</span></span></p>",
        "text": "12 cm"
      },
      {
        "id": "B",
        "html": "<p><span><span>24 cm</span></span></p>",
        "text": "24 cm"
      },
      {
        "id": "C",
        "html": "<p><span><span>30 cm</span></span></p>",
        "text": "30 cm"
      },
      {
        "id": "D",
        "html": "<p><span><span>32 cm</span></span></p>",
        "text": "32 cm"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-79",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "79"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q79-1-png-passage.png\" alt=\"Supplied explanation for question 79\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Bryana bought \\(1\\frac{3}{4}\\) yards of cloth at $8.00 per yard. If there was an 8% sales tax, what was the total cost of the cloth?",
    "promptHtml": "<p><span>Bryana bought </span><span data-no-break=\"true\"><span><span>\\(1\\frac{3}{4}\\)</span></span> <span><span>yards</span></span></span><span><span> of </span><span>cloth </span><span>at </span><span>$8.00 </span><span>per</span><span> yard. </span><span>If </span><span>there </span><span>was </span><span>an </span><span>8% </span><span>sales</span> <span>tax</span><span>, </span><span>what </span><span>was </span><span>the </span><span>total</span><span> cost </span><span>of </span><span>the </span><span>cloth?</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Percentages",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>$12.96</span></p>",
        "text": "$12.96"
      },
      {
        "id": "B",
        "html": "<p><span>$14.08</span></p>",
        "text": "$14.08"
      },
      {
        "id": "C",
        "html": "<p><span>$15.12</span></p>",
        "text": "$15.12"
      },
      {
        "id": "D",
        "html": "<p><span>$16.08</span></p>",
        "text": "$16.08"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-80",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "80"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q80-1-png-passage.png\" alt=\"Supplied explanation for question 80\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "On the number line above, \\(\\text{MN}=5\\frac{5}{6}.\\) What is the position of point \\(\\text{M?}\\)",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm11-089-1-svgz-passage.svgz\" alt=\"A number line with points M and N. N is marked as 1 and 1 third \" width=\"264\"></span></p><p><span><span>On </span><span>the </span><span>number line</span><span> above, </span></span><span><span>\\(\\text{MN}=5\\frac{5}{6}.\\)</span></span><span> What is the position of </span><span data-no-break=\"true\"><span><span>point</span> </span><span><span>\\(\\text{M?}\\)</span></span></span></p>",
    "topic": "Geometry",
    "subtopic": "Coordinate Geometry & Transformations",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(-7\\frac{1}{6}\\)</span></span></p>",
        "text": "\\(-7\\frac{1}{6}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(-4\\frac{1}{2}\\)</span></span></p>",
        "text": "\\(-4\\frac{1}{2}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(4\\frac{1}{2}\\)</span></span></p>",
        "text": "\\(4\\frac{1}{2}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(7\\frac{1}{6}\\)</span></span></p>",
        "text": "\\(7\\frac{1}{6}\\)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-81",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "81"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q81-1-png-passage.png\" alt=\"Supplied explanation for question 81\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A United States presidential coin is made from an alloy of four metals—copper, zinc, manganese, and nickel—with weights in the ratio of 177:12:7:4, respectively. The coin weighs a total of 8 grams. What is the weight of the zinc in this coin?",
    "promptHtml": "<p><span>A United States presidential coin is made from an alloy of four metals</span><span>—</span><span><span>copper, </span><span>zinc, </span><span>manganese, </span><span>and </span><span>nickel</span></span><span>—</span><span><span>with </span><span>weights </span><span>in </span><span>the </span><span>ratio</span><span> of </span></span><span>177:12:7:4,</span><span><span> respectively. </span><span>The </span><span>coin </span><span>weighs </span><span>a </span><span>total</span><span> of </span></span><span data-no-break=\"true\"><span><span>8 </span><span>grams</span><span>.</span></span></span><span> What is the weight of the zinc in this coin?</span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>0.28 gram</span></p>",
        "text": "0.28 gram"
      },
      {
        "id": "B",
        "html": "<p><span>0.48 gram</span></p>",
        "text": "0.48 gram"
      },
      {
        "id": "C",
        "html": "<p><span>0.96 gram</span></p>",
        "text": "0.96 gram"
      },
      {
        "id": "D",
        "html": "<p><span>48 grams</span></p>",
        "text": "48 grams"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-82",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "82"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q82-1-png-passage.png\" alt=\"Supplied explanation for question 82\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Jack scored a mean of 15 points per game in his first 3 basketball games. In his 4th game, he scored 27 points. What is his mean score for the first 4 games?",
    "promptHtml": "<p><span><span>Jack </span><span>scored </span><span>a </span><span>mean</span><span> of </span></span><span data-no-break=\"true\"><span><span>15 </span><span>points</span></span></span> <span><span>per</span><span> game </span><span>in </span><span>his </span><span>first</span><span> 3 </span><span>basketball </span><span>games. </span><span>In </span><span>his </span><span>4th </span><span>game, </span><span>he </span><span>scored </span><span data-no-break=\"true\">27 points.</span><span> What </span><span>is </span><span>his </span><span>mean </span><span>score </span><span>for </span><span>the </span><span>first </span><span>4 </span><span>games?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Averages & Spread",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>15</span></p>",
        "text": "15"
      },
      {
        "id": "B",
        "html": "<p><span>17</span></p>",
        "text": "17"
      },
      {
        "id": "C",
        "html": "<p><span>18</span></p>",
        "text": "18"
      },
      {
        "id": "D",
        "html": "<p><span>21</span></p>",
        "text": "21"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-83",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "83"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q83-1-png-passage.png\" alt=\"Supplied explanation for question 83\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A cylindrical oil drum can hold 4,320 liters when it is completely full. Currently, the drum is \\(\\frac{1}{3}\\) full of oil. How many kiloliters of oil need to be added in order to fill the drum completely?",
    "promptHtml": "<p><span>A cylindrical oil drum can hold </span><span data-no-break=\"true\"><span><span>4,320 </span><span>liters</span></span></span><span> when it is completely full. Currently, the drum is </span><span><span>\\(\\frac{1}{3}\\)</span></span><span><span> full </span><span>of </span><span>oil. </span><span>How </span><span>many </span><strong>kiloliters</strong><span> of </span><span>oil </span><span>need </span><span>to </span><span>be </span><span>added </span><span>in </span><span>order</span><span> to </span><span>fill </span><span>the </span><span>drum </span><span>completely?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Units & Conversions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>1.44</span></p>",
        "text": "1.44"
      },
      {
        "id": "B",
        "html": "<p><span>2.88</span></p>",
        "text": "2.88"
      },
      {
        "id": "C",
        "html": "<p><span>4.32</span></p>",
        "text": "4.32"
      },
      {
        "id": "D",
        "html": "<p><span>14.10</span></p>",
        "text": "14.10"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-84",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "84"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q84-1-png-passage.png\" alt=\"Supplied explanation for question 84\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Nicole’s age now is three times Carmen’s age. If Carmen will be 17 in 2 years, how old was Nicole 5 years ago?",
    "promptHtml": "<p><span><span>Nicole’s </span><span>age </span><span>now </span><span>is </span><span>three </span><span>times</span><span> Carmen’s </span><span>age. </span><span>If </span><span>Carmen </span><span>will </span><span>be </span><span>17 </span><span>in </span><span data-no-break=\"true\">2 years,</span><span> how </span><span>old </span><span>was </span><span>Nicole </span><span data-no-break=\"true\">5 years</span><span> ago?</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>38 yr</span></span></p>",
        "text": "38 yr"
      },
      {
        "id": "B",
        "html": "<p><span><span>40 yr</span></span></p>",
        "text": "40 yr"
      },
      {
        "id": "C",
        "html": "<p><span><span>45 yr</span></span></p>",
        "text": "45 yr"
      },
      {
        "id": "D",
        "html": "<p><span><span>50 yr</span></span></p>",
        "text": "50 yr"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-85",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "85"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q85-1-png-passage.png\" alt=\"Supplied explanation for question 85\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A chemical decays in such a way that the amount left at the end of each week is 20% less than the amount at the beginning of that same week. What percentage of the original amount is left after two weeks?",
    "promptHtml": "<p><span><span>A </span><span>chemical </span><span>decays </span><span>in </span><span>such </span><span>a </span><span>way </span><span>that </span><span>the </span><span>amount</span><span> left </span><span>at </span><span>the </span><span>end </span><span>of </span><span>each</span><span> week </span><span>is </span><span>20% </span><span>less than</span><span> the </span><span>amount </span><span>at </span><span>the </span><span>beginning </span><span>of </span><span>that </span><span>same </span><span>week. </span><span>What </span><span>percentage</span><span> of </span><span>the </span><span>original </span><span>amount </span><span>is </span><span>left </span><span>after </span><span>two </span><span>weeks?</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Percentages",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>40%</span></p>",
        "text": "40%"
      },
      {
        "id": "B",
        "html": "<p><span>60%</span></p>",
        "text": "60%"
      },
      {
        "id": "C",
        "html": "<p><span>64%</span></p>",
        "text": "64%"
      },
      {
        "id": "D",
        "html": "<p><span>80%</span></p>",
        "text": "80%"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-86",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "86"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q86-1-png-passage.png\" alt=\"Supplied explanation for question 86\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "If \\(w-1\\) is an odd integer, which one of the following must be an even integer?",
    "promptHtml": "<p><span>If </span><span><span>\\(w-1\\)</span></span><span><span> is </span><span>an </span><span>odd</span> <span>integer</span><span>, </span><span>which </span><span>one </span><span>of </span><span>the </span><span>following </span><strong>must</strong><span> be </span><span>an </span><span>even </span><span>integer?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Number Types & Properties",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(w+1\\)</span></span></p>",
        "text": "\\(w+1\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(2w-1\\)</span></span></p>",
        "text": "\\(2w-1\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(2w-2\\)</span></span></p>",
        "text": "\\(2w-2\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(2w+1\\)</span></span></p>",
        "text": "\\(2w+1\\)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-87",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "87"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q87-1-png-passage.png\" alt=\"Supplied explanation for question 87\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Three students stand at the starting line of a running track and begin running laps at the same time. Ann completes 1 lap every 2 minutes, Jack completes 1 lap every 3 minutes, and Lee completes 1 lap every 4 minutes. How many laps does Ann complete before all three runners are once again at the starting line at the same time?",
    "promptHtml": "<p><span><span>Three </span><span>students </span><span>stand </span><span>at </span><span>the </span><span>starting </span><span>line</span><span> of </span><span>a </span><span>running </span><span>track </span><span>and </span><span>begin </span><span>running </span><span>laps </span><span>at </span><span>the </span><span>same </span><span>time. </span><span>Ann </span><span>completes </span><span>1 </span><span>lap </span><span>every </span></span><span data-no-break=\"true\"><span><span>2 </span><span>minutes</span><span>,</span></span></span><span><span> Jack </span><span>completes </span><span>1 </span><span>lap </span><span>every </span><span data-no-break=\"true\">3 minutes,</span><span> and </span><span>Lee </span><span>completes </span><span>1 </span><span>lap </span><span>every </span><span data-no-break=\"true\">4 minutes.</span><span> How </span><span>many </span><span>laps </span><span>does </span><span>Ann </span><span>complete </span><span>before</span><span> all </span><span>three </span><span>runners </span><span>are </span><span>once </span><span>again </span><span>at </span><span>the </span><span>starting </span><span>line </span><span>at </span><span>the </span><span>same </span><span>time?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Number Types & Properties",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>4</span></p>",
        "text": "4"
      },
      {
        "id": "B",
        "html": "<p><span>6</span></p>",
        "text": "6"
      },
      {
        "id": "C",
        "html": "<p><span>12</span></p>",
        "text": "12"
      },
      {
        "id": "D",
        "html": "<p><span>20</span></p>",
        "text": "20"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-88",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "88"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q88-1-png-passage.png\" alt=\"Supplied explanation for question 88\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Simplify this expression:\n\\(4\\left(7-3x\\right)-\\left(5-x\\right)\\)",
    "promptHtml": "<p><span><span>Simplify</span><span> this </span><span>expression</span><span>:</span></span></p> <p data-align=\"center\"><span><span>\\(4\\left(7-3x\\right)-\\left(5-x\\right)\\)</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Algebraic Expressions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(23-4x\\)</span></span></p>",
        "text": "\\(23-4x\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(23-11x\\)</span></span></p>",
        "text": "\\(23-11x\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(28-4x\\)</span></span></p>",
        "text": "\\(28-4x\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(28-12x\\)</span></span></p>",
        "text": "\\(28-12x\\)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-89",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "89"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q89-1-png-passage.png\" alt=\"Supplied explanation for question 89\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "PET SURVEY\nNumber of Pets Number of Students\n0 12\n1 16\n2 7\n3 or more 5\n\nAmy surveyed students at her school about the number of pets they have. What is the probability that a student who participated in the survey has at least 2 pets?",
    "promptHtml": "<p data-align=\"center\"><span><span>PET </span><span>SURVEY</span></span></p> <table data-table-style=\"compact\"><tbody><tr><th scope=\"col\"><span><strong>Number of Pets</strong></span></th><th scope=\"col\"><span><strong>Number of Students</strong></span></th></tr><tr><td data-align=\"center\"><span>0</span></td><td data-align=\"center\"><span>12</span></td></tr><tr><td data-align=\"center\"><span>1</span></td><td data-align=\"center\"><span>16</span></td></tr><tr><td data-align=\"center\"><span>2</span></td><td data-align=\"center\"><span>7</span></td></tr><tr><td data-align=\"center\"><span>3 or more</span></td><td data-align=\"center\"><span>5</span></td></tr></tbody></table> <p>&nbsp;</p><p><span><span>Amy </span><span>surveyed</span><span> students </span><span>at </span><span>her </span><span>school </span><span>about </span><span>the </span><span>number</span><span> of </span><span>pets </span><span>they </span><span>have. </span><span>What </span><span>is </span><span>the </span><span>probability</span><span> that </span><span>a </span><span>student </span><span>who </span><span>participated </span><span>in </span><span>the </span><span>survey </span><span>has </span><span>at least</span><span> 2 </span><span>pets?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{7}{40}\\)</span></span></p>",
        "text": "\\(\\frac{7}{40}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(\\frac{1}{12}\\)</span></span></p>",
        "text": "\\(\\frac{1}{12}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{1}{8}\\)</span></span></p>",
        "text": "\\(\\frac{1}{8}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\frac{3}{10}\\)</span></span></p>",
        "text": "\\(\\frac{3}{10}\\)"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-90",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "90"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q90-1-png-passage.png\" alt=\"Supplied explanation for question 90\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A circle has a radius of 5 inches. What is the area of the circle in terms of \\(\\pi \\)?\nUse \\(\\pi \\) to express your answer.\nEnter your answer in the space provided. Enter only your answer.",
    "promptHtml": "<p><span><span>A </span><span>circle</span><span> has </span><span>a </span><span>radius</span><span> of </span></span><span data-no-break=\"true\"><span><span>5 </span><span>inches</span><span>.</span></span></span><span><span> What </span><span>is </span><span>the </span><span>area</span><span> of </span><span>the </span><span>circle </span><span>in </span><span>terms</span><span> of </span></span><span><span>\\(\\pi \\)</span></span><span>?</span></p> <p><span>Use </span><span><span>\\(\\pi \\)</span></span><span> to express your answer.</span></p><p><span><span>Enter </span><span>your </span><span>answer </span><span>in </span><span>the </span><span>space </span><span>provided. </span><span>Enter </span><span>only</span><span> your </span><span>answer.</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Circles",
    "correctTextAnswers": [
      "25π"
    ],
    "entryLayout": "plain",
    "type": "expression_entry"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-91",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "91"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q91-1-png-passage.png\" alt=\"Supplied explanation for question 91\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "\\(5{x}^{3}+3x+9+\\frac{1}{{x}^{2}}\\)\nIf \\(x=10,\\) what is the value of the expression above?",
    "promptHtml": "<p data-align=\"center\"><span><span>\\(5{x}^{3}+3x+9+\\frac{1}{{x}^{2}}\\)</span></span></p> <p><span>If </span><span><span>\\(x=10,\\)</span></span><span><span> what </span><span>is </span><span>the </span><span>value</span><span> of </span><span>the </span><span>expression</span><span> above?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Fractions & Decimals",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>2,539.01</span></p>",
        "text": "2,539.01"
      },
      {
        "id": "B",
        "html": "<p><span>5,039.01</span></p>",
        "text": "5,039.01"
      },
      {
        "id": "C",
        "html": "<p><span>5,039.1</span></p>",
        "text": "5,039.1"
      },
      {
        "id": "D",
        "html": "<p><span>5,139</span></p>",
        "text": "5,139"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-92",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "92"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q92-1-png-passage.png\" alt=\"Supplied explanation for question 92\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "R, S, and T are midpoints of the sides of square MNPQ, as shown above. What is the sum of the areas of the shaded triangles?",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm88-474-1-svgz-passage.svgz\" alt=\"The figure is a square labeled MNPQ. Point R is between N and M. Point S is between N and P. Point T is between M and Q. A straight line connects S at the top to T at the bottom. Side PQ equals 6 centimeters. There are two shaded triangles marked in the upper left corner and the lower left corner.\" width=\"259\"></span></p><p><span><span>R, </span><span>S, </span><span>and </span><span>T </span><span>are </span><span>midpoints</span><span> of </span><span>the </span><span>sides</span><span> of </span></span><span data-no-break=\"true\"><span><span>square</span><span> MNPQ,</span></span></span><span><span> as </span><span>shown </span><span>above. </span><span>What </span><span>is </span><span>the </span><span>sum</span><span> of </span><span>the </span><span>areas</span><span> of </span><span>the </span><span>shaded</span> <span>triangles</span><span>?</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Perimeter, Area & Composite Figures",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>9 sq cm</span></span></p>",
        "text": "9 sq cm"
      },
      {
        "id": "B",
        "html": "<p><span><span>12 sq cm</span></span></p>",
        "text": "12 sq cm"
      },
      {
        "id": "C",
        "html": "<p><span><span>18 sq cm</span></span></p>",
        "text": "18 sq cm"
      },
      {
        "id": "D",
        "html": "<p><span><span>36 sq cm</span></span></p>",
        "text": "36 sq cm"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-93",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "93"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q93-1-png-passage.png\" alt=\"Supplied explanation for question 93\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "The Chens spend $5 of every $8 they earn on planned expenses. If the family earns $29,600 in one year, how much will they spend on planned expenses that year?",
    "promptHtml": "<p><span>The </span><span>Chens</span><span><span> spend </span><span>$5 </span><span>of </span><span>every </span><span>$8 </span><span>they </span><span>earn </span><span>on </span><span>planned </span><span>expenses</span><span>. </span><span>If </span><span>the </span><span>family </span><span>earns </span><span>$29,600 </span><span>in </span><span>one </span><span>year, </span><span>how </span><span>much </span><span>will </span><span>they </span><span>spend </span><span>on </span><span>planned </span><span>expenses </span><span>that </span><span>year?</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>$1,850</span></p>",
        "text": "$1,850"
      },
      {
        "id": "B",
        "html": "<p><span>$3,700</span></p>",
        "text": "$3,700"
      },
      {
        "id": "C",
        "html": "<p><span>$5,920</span></p>",
        "text": "$5,920"
      },
      {
        "id": "D",
        "html": "<p><span>$18,500</span></p>",
        "text": "$18,500"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-94",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "94"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q94-1-png-passage.png\" alt=\"Supplied explanation for question 94\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A pizza shop offers a choice of 3 sizes (small, medium, and large) and 7 different toppings. Different pizzas can be created by changing the size and the choice of toppings. If Cody wants to order a pizza with exactly 2 different toppings, how many different pizzas can he create?",
    "promptHtml": "<p><span><span>A </span><span>pizza </span><span>shop </span><span>offers </span><span>a </span><span>choice </span><span>of </span><span>3 </span><span>sizes </span><span>(</span><span>small</span><span>, </span><span>medium, </span><span>and </span><span>large</span><span>) </span><span>and </span><span>7 </span><span>different </span><span>toppings. </span><span>Different </span><span>pizzas </span><span>can </span><span>be </span><span>created </span><span>by </span><span>changing </span><span>the </span><span>size </span><span>and </span><span>the </span><span>choice </span><span>of </span><span>toppings. </span><span>If </span><span>Cody </span><span>wants </span><span>to </span><span>order</span><span> a </span><span>pizza </span><span>with </span><span>exactly </span><span>2 </span><span>different </span><span>toppings, </span><span>how </span><span>many </span><span>different </span><span>pizzas </span><span>can </span><span>he </span><span>create?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Counting & Sets",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>6</span></p>",
        "text": "6"
      },
      {
        "id": "B",
        "html": "<p><span>21</span></p>",
        "text": "21"
      },
      {
        "id": "C",
        "html": "<p><span>63</span></p>",
        "text": "63"
      },
      {
        "id": "D",
        "html": "<p><span>126</span></p>",
        "text": "126"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-95",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "95"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q95-1-png-passage.png\" alt=\"Supplied explanation for question 95\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "At North High School, a survey asked two questions, Question A and Question B. For each question, students could answer either “yes” or “no.” Of the 800 students who responded to the survey, 720 answered “yes” to Question A, and 640 answered “yes” to Question B. What is the least possible number of these students who could have answered “yes” to both questions?",
    "promptHtml": "<p><span><span>At </span><span>North </span><span>High </span><span>School, </span><span>a </span><span>survey</span><span> asked </span><span>two </span><span>questions, </span><span data-no-break=\"true\">Question A</span><span> and </span><span data-no-break=\"true\">Question B.</span><span> For </span><span>each</span><span> question, </span><span>students </span><span>could </span><span>answer </span><span>either </span><span>“yes” </span><span>or </span><span>“no.” </span><span>Of </span><span>the </span><span>800 </span><span>students </span><span>who </span><span>responded </span><span>to </span><span>the </span><span>survey, </span><span>720 </span><span>answered </span><span>“yes” </span><span>to </span><span data-no-break=\"true\">Question A,</span><span> and </span><span>640 </span><span>answered </span><span>“yes” </span><span>to </span><span data-no-break=\"true\">Question B.</span><span> What </span><span>is </span><span>the </span><strong>least</strong><span> possible </span><span>number</span><span> of </span><span>these </span><span>students </span><span>who </span><span>could </span><span>have </span><span>answered </span><span>“yes” </span><span>to </span><strong>both</strong><span> questions?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Counting & Sets",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>80</span></p>",
        "text": "80"
      },
      {
        "id": "B",
        "html": "<p><span>160</span></p>",
        "text": "160"
      },
      {
        "id": "C",
        "html": "<p><span>560</span></p>",
        "text": "560"
      },
      {
        "id": "D",
        "html": "<p><span>640</span></p>",
        "text": "640"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-96",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "96"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q96-1-png-passage.png\" alt=\"Supplied explanation for question 96\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A wooden box has a square base. The height of this box is 3 times the length of one side of the base. If one side of the base is 3 feet long, what is the volume of this box?",
    "promptHtml": "<p><span><span>A </span><span>wooden </span><span>box </span><span>has </span><span>a </span><span>square</span> <span>base</span><span>. </span><span>The </span><span>height</span><span> of </span><span>this </span><span>box </span><span>is </span></span><span data-no-break=\"true\"><span><span>3 </span><span>times</span></span></span><span><span> the </span><span>length</span><span> of </span><span>one </span><span>side</span><span> of </span><span>the </span><span>base. </span><span>If </span><span>one </span><span>side </span><span>of </span><span>the </span><span>base </span><span>is </span></span><span data-no-break=\"true\"><span><span>3 </span><span>feet</span></span></span> <span><span>long</span><span>, </span><span>what </span><span>is </span><span>the </span><span>volume</span><span> of </span><span>this </span><span>box?</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Surface Area & Volume",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>9 cu ft</span></span></p>",
        "text": "9 cu ft"
      },
      {
        "id": "B",
        "html": "<p><span><span>27 cu ft</span></span></p>",
        "text": "27 cu ft"
      },
      {
        "id": "C",
        "html": "<p><span><span>36 cu ft</span></span></p>",
        "text": "36 cu ft"
      },
      {
        "id": "D",
        "html": "<p><span><span>81 cu ft</span></span></p>",
        "text": "81 cu ft"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-97",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "97"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q97-1-png-passage.png\" alt=\"Supplied explanation for question 97\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "On a bike trip, Rajiv traveled 65 kilometers in 5 hours, while Shaina traveled 72 kilometers in 4 hours. How much less was Rajiv’s mean speed, in kilometers per hour (kph), than Shaina’s?",
    "promptHtml": "<p><span>On a bike trip, Rajiv traveled </span><span data-no-break=\"true\"><span><span>65 </span><span>kilometers</span></span></span><span> in </span><span data-no-break=\"true\"><span><span>5 </span><span>hours</span><span>,</span></span></span><span><span> while </span><span>Shaina </span><span>traveled </span><span data-no-break=\"true\">72 kilometers</span><span> in </span><span data-no-break=\"true\">4 hours.</span><span> How </span><span>much </span><span><strong>less</strong></span><span> was </span><span>Rajiv’s </span><span>mean</span> <span>speed</span><span>, </span><span>in </span><span>kilometers </span><span>per</span><span> hour </span><span>(kph), </span><span>than </span><span>Shaina’s?</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Rates & Unit Rates",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>1</span></p>",
        "text": "1"
      },
      {
        "id": "B",
        "html": "<p><span>5</span></p>",
        "text": "5"
      },
      {
        "id": "C",
        "html": "<p><span>7</span></p>",
        "text": "7"
      },
      {
        "id": "D",
        "html": "<p><span>9</span></p>",
        "text": "9"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-98",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "98"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q98-1-png-passage.png\" alt=\"Supplied explanation for question 98\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Points P, Q, R, and S represent \\(-3\\text{, }-1\\text{, }0\\text{,}\\) and \\(2,\\) respectively, on a number line. How many units is the midpoint of \\(\\overline{\\text{PQ}}\\) from the midpoint of \\(\\overline{\\text{RS}}?\\)",
    "promptHtml": "<p><span><span>Points</span><span> P, </span><span>Q, </span><span>R, </span><span>and </span><span>S </span><span>represent </span></span><span><span>\\(-3\\text{, }-1\\text{, }0\\text{,}\\)</span></span><span>&nbsp;and </span><span><span>\\(2,\\)</span></span><span><span> respectively, </span><span>on </span><span>a </span><span>number line</span><span>. </span><span>How </span><span>many </span><span>units</span><span> is </span><span>the </span><span>midpoint</span><span> of </span></span><span><span>\\(\\overline{\\text{PQ}}\\)</span></span><span> from the midpoint of </span><span><span>\\(\\overline{\\text{RS}}?\\)</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Coordinate Geometry & Transformations",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>1</span></p>",
        "text": "1"
      },
      {
        "id": "B",
        "html": "<p><span>2</span></p>",
        "text": "2"
      },
      {
        "id": "C",
        "html": "<p><span>3</span></p>",
        "text": "3"
      },
      {
        "id": "D",
        "html": "<p><span>4</span></p>",
        "text": "4"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-99",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "99"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q99-1-png-passage.png\" alt=\"Supplied explanation for question 99\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "There are 1,000 cubic centimeters in 1 liter, and 1,000 cubic millimeters in 1 milliliter. How many cubic millimeters are there in 1,000 cubic centimeters?",
    "promptHtml": "<p><span>There are </span><span data-no-break=\"true\"><span><span>1,000 </span><span>cubic centimeters</span></span></span><span> in </span><span data-no-break=\"true\"><span><span>1 </span><span>liter</span><span>,</span></span></span><span><span> and </span><span data-no-break=\"true\">1,000 cubic</span><span> millimeters </span><span>in </span></span><span data-no-break=\"true\"><span><span>1 </span><span>milliliter</span><span>.</span></span></span><span><span> How </span><span>many </span><span>cubic </span><span>millimeters </span><span>are </span><span>there </span><span>in </span><span data-no-break=\"true\">1,000 cubic</span><span> centimeters?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Units & Conversions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>1,000</span></p>",
        "text": "1,000"
      },
      {
        "id": "B",
        "html": "<p><span>10,000</span></p>",
        "text": "10,000"
      },
      {
        "id": "C",
        "html": "<p><span>100,000</span></p>",
        "text": "100,000"
      },
      {
        "id": "D",
        "html": "<p><span>1,000,000</span></p>",
        "text": "1,000,000"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-100",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "100"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q100-1-png-passage.png\" alt=\"Supplied explanation for question 100\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "In the quarter circle above, what is \\(y\\) in terms of \\(x?\\)",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm96-036-1-svgz-passage.svgz\" alt=\"A quarter circle with a triangle in the middle. The triangle's side length is x plus 1. The triangle has a right angle. A line segment labeled y runs under the triangle, a second, connected line segment is labeled 2.\" width=\"259\"></span></p><p><span><span>In </span><span>the </span><span>quarter</span> <span>circle</span><span> above, </span><span>what </span><span>is </span></span><span><span>\\(y\\)</span></span><span><span> in </span><span>terms</span><span> of </span></span><span><span>\\(x?\\)</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Circles",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(x-1\\)</span></span></p>",
        "text": "\\(x-1\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(x+1\\)</span></span></p>",
        "text": "\\(x+1\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{x+1}{2}\\)</span></span></p>",
        "text": "\\(\\frac{x+1}{2}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\sqrt{\\frac{{\\left(x+1\\right)}^{2}}{2}}\\)</span></span></p>",
        "text": "\\(\\sqrt{\\frac{{\\left(x+1\\right)}^{2}}{2}}\\)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-101",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "101"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q101-1-png-passage.png\" alt=\"Supplied explanation for question 101\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "The hash marks on the number line above are evenly spaced. What is the coordinate of point R?",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm08-046-1-svgz-passage.svgz\" alt=\"A number line with points labeled M, R, T.  At the left, point M is marked negative one fourth, and at the right, point T is labeled five eighths. Point R is in between Points M and T.\" width=\"304\"></span></p><p><span><span>The </span><span>hash </span><span>marks </span><span>on </span><span>the </span><span>number line</span><span> above </span><span>are </span><span>evenly </span><span>spaced. </span><span>What </span><span>is </span><span>the </span><span>coordinate</span><span> of </span></span><span data-no-break=\"true\"><span><span>point</span><span> R?</span></span></span></p>",
    "topic": "Geometry",
    "subtopic": "Coordinate Geometry & Transformations",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{7}{40}\\)</span></span></p>",
        "text": "\\(\\frac{7}{40}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(\\frac{9}{40}\\)</span></span></p>",
        "text": "\\(\\frac{9}{40}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{11}{40}\\)</span></span></p>",
        "text": "\\(\\frac{11}{40}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\frac{21}{40}\\)</span></span></p>",
        "text": "\\(\\frac{21}{40}\\)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-102",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "102"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q102-1-png-passage.png\" alt=\"Supplied explanation for question 102\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Phan chose an Internet service that charges $18.00 per month plus $0.024 per minute. Deion chose an Internet service that charges $30.00 per month for unlimited usage. At the end of the month, Phan’s and Deion’s charges were identical. For how many minutes did Phan use the Internet service that month?",
    "promptHtml": "<p><span><span>Phan </span><span>chose </span><span>an </span><span>Internet </span><span>service </span><span>that </span><span>charges </span><span>$18.00 </span><span>per </span><span>month </span><span>plus </span><span>$0.024 </span><span>per</span> <span>minute</span><span>. </span><span>Deion </span><span>chose </span><span>an </span><span>Internet </span><span>service </span><span>that </span><span>charges </span><span>$30.00 </span><span>per </span><span>month </span><span>for </span><span>unlimited </span><span>usage. </span><span>At </span><span>the </span><span>end </span><span>of </span><span>the </span><span>month, </span><span>Phan’s </span><span>and </span><span>Deion’s </span><span>charges </span><span>were </span><span>identical. </span><span>For </span><span>how </span><span>many </span><span>minutes </span><span>did </span><span>Phan </span><span>use </span><span>the </span><span>Internet </span><span>service </span><span>that </span><span>month?</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>50</span></p>",
        "text": "50"
      },
      {
        "id": "B",
        "html": "<p><span>60</span></p>",
        "text": "60"
      },
      {
        "id": "C",
        "html": "<p><span>100</span></p>",
        "text": "100"
      },
      {
        "id": "D",
        "html": "<p><span>500</span></p>",
        "text": "500"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-103",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "103"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q103-1-png-passage.png\" alt=\"Supplied explanation for question 103\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "In a sample of 50 cars at a local dealership, there are 12 red cars and 10 cars with backup cameras. Of the 12 red cars, 4 have backup cameras. If a car is selected at random from the given sample, what is the probability that both of the following are true: the car is not red and does not have a backup camera?",
    "promptHtml": "<p><span><span>In </span><span>a </span><span>sample </span><span>of </span><span>50 </span><span>cars </span><span>at </span><span>a </span><span>local </span><span>dealership, </span><span>there </span><span>are </span><span>12 </span><span>red </span><span>cars </span><span>and </span><span>10 </span><span>cars </span><span>with </span><span>backup </span><span>cameras. </span><span>Of </span><span>the </span><span>12 </span><span>red </span><span>cars, </span><span>4 </span><span>have </span><span>backup </span><span>cameras. </span><span>If </span><span>a </span><span>car </span><span>is </span><span>selected </span><span>at </span><span>random</span><span> from </span><span>the </span><span>given </span><span>sample, </span><span>what </span><span>is </span><span>the </span><span>probability</span><span> that </span><strong>both</strong><span> of </span><span>the </span><span>following </span><span>are </span><span>true: </span><span>the </span><span>car </span><span>is </span><span><strong>not</strong></span><span> red </span><span>and </span><span>does </span><strong>not</strong><span> have </span><span>a </span><span>backup </span><span>camera?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{3}{5}\\)</span></span></p>",
        "text": "\\(\\frac{3}{5}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(\\frac{16}{25}\\)</span></span></p>",
        "text": "\\(\\frac{16}{25}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{19}{25}\\)</span></span></p>",
        "text": "\\(\\frac{19}{25}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\frac{4}{5}\\)</span></span></p>",
        "text": "\\(\\frac{4}{5}\\)"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-104",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "104"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q104-1-png-passage.png\" alt=\"Supplied explanation for question 104\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "\\(\\frac{147-x}{12}=12\\)\nWhat is the value of \\(x\\) in the equation shown above?\nEnter your answer in the space.",
    "promptHtml": "<p data-align=\"center\"><span><span>\\(\\frac{147-x}{12}=12\\)</span></span></p> <p><span><span>What </span><span>is </span><span>the </span><span>value</span><span> of </span></span><span><span>\\(x\\)</span></span><span><span> in </span><span>the </span><span>equation</span><span> shown </span><span>above?</span></span></p><p><span>Enter your answer in the space.</span></p><div><p>\n</p>\n\n<p></p></div>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "correctTextAnswers": [
      "3"
    ],
    "type": "short_response"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-105",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "105"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q105-1-png-passage.png\" alt=\"Supplied explanation for question 105\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "What is the area of the shaded triangle shown above?",
    "promptHtml": "<p data-align=\"center\"><span><img src=\"/exam-images/restore-shm98-080-1-svgz-passage.svgz\" alt=\"A triangle is drawn along the x axis of a coordinate plane.  The left corner of the base is labeled M and the right corner of the base is labeled N. A dotted line runs along the tip of the triangle at 4 on the y axis.\" width=\"272\"></span></p><p><span><span>What </span><span>is </span><span>the </span><span>area</span><span> of </span><span>the </span><span>shaded</span> <span>triangle</span><span> shown </span><span>above?</span></span></p>",
    "topic": "Geometry",
    "subtopic": "Perimeter, Area & Composite Figures",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(m+n\\)</span></span></p>",
        "text": "\\(m+n\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(n-m\\)</span></span></p>",
        "text": "\\(n-m\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(2\\left(n-m\\right)\\)</span></span></p>",
        "text": "\\(2\\left(n-m\\right)\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(4\\left(n-m\\right)\\)</span></span></p>",
        "text": "\\(4\\left(n-m\\right)\\)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-106",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "106"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q106-1-png-passage.png\" alt=\"Supplied explanation for question 106\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "ANIMAL CARDSNumber of Cards Picture on Card\n8 Cat\n6 Dog\n5 Bird\n4 Fish\n1 Horse\n\nThe cards in the table above are mixed in a box. Which animal pictured on a card has exactly a 1 in 4 chance of being picked at random from the box?",
    "promptHtml": "<table data-table-style=\"compact\"><caption><span>ANIMAL CARDS</span></caption><tbody><tr><th data-align=\"center\" scope=\"col\"><span><span>Number</span><span> of </span><span>Cards</span></span></th><th data-align=\"center\" scope=\"col\"><span>Picture on Card</span></th></tr><tr><td data-align=\"center\"><span>8</span></td><td data-align=\"center\"><span>Cat</span></td></tr><tr><td data-align=\"center\"><span>6</span></td><td data-align=\"center\"><span>Dog</span></td></tr><tr><td data-align=\"center\"><span>5</span></td><td data-align=\"center\"><span>Bird</span></td></tr><tr><td data-align=\"center\"><span>4</span></td><td data-align=\"center\"><span>Fish</span></td></tr><tr><td data-align=\"center\"><span>1</span></td><td data-align=\"center\"><span>Horse</span></td></tr></tbody></table> <p>&nbsp;</p><p><span><span>The </span><span>cards </span><span>in </span><span>the </span><span>table </span><span>above </span><span>are </span><span>mixed </span><span>in </span><span>a </span><span>box. </span><span>Which </span><span>animal </span><span>pictured </span><span>on </span><span>a </span><span>card </span><span>has </span><span>exactly </span><span>a </span><span>1 </span><span>in </span><span>4 </span><span>chance </span><span>of </span><span>being </span><span>picked </span><span>at </span><span>random</span><span> from </span><span>the </span><span>box?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>cat</span></p>",
        "text": "cat"
      },
      {
        "id": "B",
        "html": "<p><span>dog</span></p>",
        "text": "dog"
      },
      {
        "id": "C",
        "html": "<p><span>fish</span></p>",
        "text": "fish"
      },
      {
        "id": "D",
        "html": "<p><span>horse</span></p>",
        "text": "horse"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-107",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "107"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q107-1-png-passage.png\" alt=\"Supplied explanation for question 107\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Which number line below shows the solution set for \\(2x-2\\le y\\le 4x+10\\) when \\(y=1?\\)",
    "promptHtml": "<p><span><span>Which </span><span>number line</span> <span>below</span><span> shows </span><span>the </span><span>solution set</span><span> for </span></span><span><span>\\(2x-2\\le y\\le 4x+10\\)</span></span><span>&nbsp;when </span><span><span>\\(y=1?\\)</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Inequalities",
    "choices": [
      {
        "id": "A",
        "image": {
          "alt": "negative 2 1 fourth to negative one one half",
          "src": "/exam-images/restore-shm04-265-a-svgz-passage.svgz"
        },
        "text": ""
      },
      {
        "id": "B",
        "image": {
          "alt": "negative 1, one half to two one fourth",
          "src": "/exam-images/restore-shm04-265-b-svgz-passage.svgz"
        },
        "text": ""
      },
      {
        "id": "C",
        "image": {
          "alt": "negative 2 one fourth to 1 one half",
          "src": "/exam-images/restore-shm04-265-c-svgz-passage.svgz"
        },
        "text": ""
      },
      {
        "id": "D",
        "image": {
          "alt": "arrow with end point at 1 1/2 and arrow going to the left.",
          "src": "/exam-images/restore-shm04-265-d-svgz-passage.svgz"
        },
        "text": ""
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-108",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "108"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q108-1-png-passage.png\" alt=\"Supplied explanation for question 108\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "\\(\\frac{14}{21}=\\frac{p}{7}\\)\nIn the equation above, what is the value of \\(p?\\)",
    "promptHtml": "<p data-align=\"center\"><span><span>\\(\\frac{14}{21}=\\frac{p}{7}\\)</span></span></p><p><span><span>In </span><span>the </span><span>equation</span><span> above, </span><span>what </span><span>is </span><span>the </span><span>value</span><span> of </span></span><span><span>\\(p?\\)</span></span></p>",
    "topic": "Ratios and Proportional Relationships",
    "subtopic": "Ratios & Proportions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{2}{3}\\)</span></span></p>",
        "text": "\\(\\frac{2}{3}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(3\\)</span></span></p>",
        "text": "\\(3\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{14}{3}\\)</span></span></p>",
        "text": "\\(\\frac{14}{3}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(14\\)</span></span></p>",
        "text": "\\(14\\)"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-109",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "109"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q109-1-png-passage.png\" alt=\"Supplied explanation for question 109\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "A ball is selected at random from a box that contains 7 black balls, 14 green balls, and 21 red balls. What is the probability that the ball selected is black?",
    "promptHtml": "<p><span><span>A </span><span>ball </span><span>is </span><span>selected </span><span>at </span><span>random</span><span> from </span><span>a </span><span>box </span><span>that </span><span>contains </span><span>7 </span><span>black </span><span>balls, </span><span>14 </span><span>green </span><span>balls, </span><span>and </span><span>21 </span><span>red </span><span>balls. </span><span>What </span><span>is </span><span>the </span><span>probability</span><span> that </span><span>the </span><span>ball </span><span>selected </span><span>is </span><span>black?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(\\frac{1}{6}\\)</span></span></p>",
        "text": "\\(\\frac{1}{6}\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(\\frac{1}{5}\\)</span></span></p>",
        "text": "\\(\\frac{1}{5}\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(\\frac{1}{3}\\)</span></span></p>",
        "text": "\\(\\frac{1}{3}\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(\\frac{5}{6}\\)</span></span></p>",
        "text": "\\(\\frac{5}{6}\\)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-110",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "110"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q110-1-png-passage.png\" alt=\"Supplied explanation for question 110\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Amiya subscribes to an online streaming service. She pays a onetime setup fee of \\(\\$50\\text{,}\\) plus \\(\\$20\\) per month for service.\nWrite an equation that can be used to determine the total amount Amiya will pay, \\(y\\text{,}\\) for \\(x\\) months of service.\nEnter your equation in the space provided. Enter only the equation.",
    "promptHtml": "<p><span>Amiya subscribes to an online streaming service. She pays a onetime setup fee of </span><span><span>\\(\\$50\\text{,}\\)</span></span><span> plus </span><span><span>\\(\\$20\\)</span></span> <span><span>per</span><span> month </span><span>for </span><span>service.</span></span></p> <p><span><span>Write an equation</span><span> that </span><span>can </span><span>be </span><span>used </span><span>to </span><span>determine </span><span>the </span><span>total</span> <span>amount</span><span> Amiya </span><span>will </span><span>pay, </span></span><span><span>\\(y\\text{,}\\)</span></span><span> for </span><span data-no-break=\"true\"><span><span>\\(x\\)</span></span><span> months</span></span><span> of service.</span></p><p><span><span>Enter </span><span>your </span><span>equation</span><span> in </span><span>the </span><span>space </span><span>provided. </span><span>Enter </span><span>only</span><span> the </span><span>equation.</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Functions & Graphs",
    "correctTextAnswers": [
      "y=20x+50"
    ],
    "entryLayout": "plain",
    "entryVariable": "x, y",
    "type": "expression_entry"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-111",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "111"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q111-1-png-passage.png\" alt=\"Supplied explanation for question 111\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Raoul is at least 3 years older than Vahn. Which of the following inequalities gives the relationship between Raoul’s age \\((r)\\) and Vahn’s age \\((v)?\\)",
    "promptHtml": "<p><span><span>Raoul </span><span>is </span><span>at least</span> <span data-no-break=\"true\">3 years</span><span> older </span><span>than </span><span>Vahn. </span><span>Which </span><span>of </span><span>the </span><span>following </span><span>inequalities</span><span> gives </span><span>the </span><span>relationship </span><span>between</span><span> Raoul’s </span><span>age </span></span><span><span>\\((r)\\)</span></span><span> and Vahn’s age </span><span><span>\\((v)?\\)</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Inequalities",
    "choices": [
      {
        "id": "A",
        "html": "<p><span><span>\\(r-v\\ge 3\\)</span></span></p>",
        "text": "\\(r-v\\ge 3\\)"
      },
      {
        "id": "B",
        "html": "<p><span><span>\\(r-v\\le 3\\)</span></span></p>",
        "text": "\\(r-v\\le 3\\)"
      },
      {
        "id": "C",
        "html": "<p><span><span>\\(3-v\\le r\\)</span></span></p>",
        "text": "\\(3-v\\le r\\)"
      },
      {
        "id": "D",
        "html": "<p><span><span>\\(3-r\\le v\\)</span></span></p>",
        "text": "\\(3-r\\le v\\)"
      }
    ],
    "correctChoiceId": "A",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-112",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "112"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q112-1-png-passage.png\" alt=\"Supplied explanation for question 112\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "1 sind = 5.6 ricks\n1 sind = 12.88 dalts\nUsing the conversion above, how many dalts are equal to 1 rick?",
    "promptHtml": "<p data-align=\"center\">&nbsp;</p> <p data-align=\"center\"><span>1 sind </span><span><span>=</span></span><span> 5.6 ricks</span></p> <p data-align=\"center\"><span>1 sind </span><span><span>=</span></span><span> 12.88 dalts</span></p> <p><span><span>Using </span><span>the </span><span>conversion </span><span>above, </span><span>how </span><span>many </span><span>dalts </span><span>are </span><span>equal</span><span> to </span><span data-no-break=\"true\">1 rick?</span></span></p>",
    "topic": "Arithmetic & Number Sense",
    "subtopic": "Units & Conversions",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>0.43</span></p>",
        "text": "0.43"
      },
      {
        "id": "B",
        "html": "<p><span>2.30</span></p>",
        "text": "2.30"
      },
      {
        "id": "C",
        "html": "<p><span>7.28</span></p>",
        "text": "7.28"
      },
      {
        "id": "D",
        "html": "<p><span>18.48</span></p>",
        "text": "18.48"
      }
    ],
    "correctChoiceId": "B",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-113",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "113"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q113-1-png-passage.png\" alt=\"Supplied explanation for question 113\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "There are now \\(x\\) cans stacked on a shelf that holds 36 cans when full. If 4 of these cans were removed, the shelf would be half full. What is the value of \\(x?\\)",
    "promptHtml": "<p><span>There are now </span><span><span>\\(x\\)</span></span><span><span> cans </span><span>stacked </span><span>on </span><span>a </span><span>shelf </span><span>that </span><span>holds </span><span>36 </span><span>cans </span><span>when </span><span>full. </span><span>If </span><span>4 </span><span>of </span><span>these </span><span>cans </span><span>were </span><span>removed, </span><span>the </span><span>shelf </span><span>would </span><span>be </span><span>half</span><span> full. </span><span>What </span><span>is </span><span>the </span><span>value</span><span> of </span></span><span><span>\\(x?\\)</span></span></p>",
    "topic": "Algebra",
    "subtopic": "Equations & Systems",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>14</span></p>",
        "text": "14"
      },
      {
        "id": "B",
        "html": "<p><span>16</span></p>",
        "text": "16"
      },
      {
        "id": "C",
        "html": "<p><span>18</span></p>",
        "text": "18"
      },
      {
        "id": "D",
        "html": "<p><span>22</span></p>",
        "text": "22"
      }
    ],
    "correctChoiceId": "D",
    "type": "multiple_choice"
  },
  {
    "id": "2025-2026-form-b-official-shsat-2025-b-114",
    "source": {
      "sourceFamily": "official_shsat",
      "sourceFormat": "testnav",
      "playerProfile": "testnav",
      "label": "2025-2026 Form B",
      "url": "https://www.stuyprep.nyc/16tests.html",
      "year": "2025-2026",
      "form": "B",
      "section": "Math",
      "sourceQuestion": "114"
    },
    "explanationHtml": "<p><img src=\"/exam-images/restore-20252026-form-b-math-answers-q114-1-png-passage.png\" alt=\"Supplied explanation for question 114\"></p>",
    "skilled": "TBD",
    "explanation": "",
    "points": 1,
    "prompt": "Carlos tossed a paper cup in the air 50 times and found that the probability of it landing on its side was 72%. If he tosses the cup in the air 150 more times, what is the total number of times he can expect the cup to land on its side?",
    "promptHtml": "<p><span><span>Carlos </span><span>tossed </span><span>a </span><span>paper </span><span>cup</span><span> in </span><span>the </span><span>air </span><span>50 </span><span>times</span><span> and </span><span>found </span><span>that </span><span>the </span><span>probability</span><span> of </span><span>it </span><span>landing </span><span>on </span><span>its </span><span>side</span><span> was </span><span>72%. </span><span>If </span><span>he </span><span>tosses </span><span>the </span><span>cup </span><span>in </span><span>the </span><span>air </span><span>150 </span><strong>more</strong><span> times, </span><span>what </span><span>is </span><span>the </span><span>total</span> <span>number</span><span> of </span><span>times </span><span>he </span><span>can </span><span>expect </span><span>the </span><span>cup </span><span>to </span><span>land </span><span>on </span><span>its </span><span>side?</span></span></p>",
    "topic": "Statistics and Probability",
    "subtopic": "Probability",
    "choices": [
      {
        "id": "A",
        "html": "<p><span>72</span></p>",
        "text": "72"
      },
      {
        "id": "B",
        "html": "<p><span>108</span></p>",
        "text": "108"
      },
      {
        "id": "C",
        "html": "<p><span>144</span></p>",
        "text": "144"
      },
      {
        "id": "D",
        "html": "<p><span>158</span></p>",
        "text": "158"
      }
    ],
    "correctChoiceId": "C",
    "type": "multiple_choice"
  }
],
};
