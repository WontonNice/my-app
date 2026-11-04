import type { ExamQuestion } from './examTypes';
import { conditionalOutcomeParameters, specificOutcomeTemplate, withoutReplacementSuccessProbability, probabilityFraction as fraction, probabilitySequence as sequence, probabilityChoices } from './probabilityPractice';

const category = 'Statistics and Probability';
const foundationParent = 'foundation-statistics-and-probability-probability-mzsbkv';
const countingParent = 'general-statistics-and-probability-overlapping-groups-e6op6z';
const compound = { moduleId:'probability-foundation', moduleTitle:'Compound Probability', parentId:foundationParent, groupType:'foundation', create:false } as const;
const simple = { moduleId:'6416a55e-4152-4dec-833a-a405288cf40a', moduleTitle:'Simple Probability', parentId:foundationParent, groupType:'foundation', create:false } as const;
const counting = { moduleId:'combinatorics-0b340ac9', moduleTitle:'Combinatorics', parentId:countingParent, groupType:'general', create:true } as const;

function template(id:string, sourceId:string, requestId:string, title:string, description:string, topic:string, distinctCount:number, destination:typeof compound|typeof simple|typeof counting) {
  return { id, sourceId, requestId, title, description, category, topic, distinctCount, destination, moduleId:destination.moduleId,
    enabled:false, publishAfterValidation:true, skilled:'TBD', difficulty:destination.groupType==='foundation'?'foundation' as const:'standard' as const };
}
function base(t:{id:string;topic:string},index:number,seed:string) { return { id:`${t.id}:${seed}:${index}`, points:1, topic:category, subtopic:t.topic }; }
const latex = ({n,d}:{n:number;d:number}) => d===1 ? String(n) : `\\frac{${n}}{${d}}`;
function countChoices(answer:number, candidates:number[], variant:number) {
  const values = [...new Set([answer,...candidates])];
  for(let value=1;values.length<4;value++) if(!values.includes(value)) values.push(value);
  const options=values.slice(0,4), rotation=variant%4, ordered=options.slice(rotation).concat(options.slice(0,rotation));
  return { choices:ordered.map((value,i)=>({id:'ABCD'[i],text:String(value),math:String(value)})),correctChoiceId:'ABCD'[ordered.indexOf(answer)] };
}

export const raffleTemplate = template('probability-raffle-card-expression-v1','2026-2027-form-d-math-item-5','73016a97-d9d6-41ab-91b6-787443886026','Raffle and Specific Card','Multiply the chance of winning by the chance of a specified card; write the unsimplified product of the two probabilities.','Probability',specificOutcomeTemplate.distinctCount,compound);
export function generateRaffle(index:number,seed='raffle') {
  // Reuse the existing conditional-outcome family, retaining its multiple-choice version unchanged.
  const {variant,people,viruses:cards,virus:card}=conditionalOutcomeParameters(index,seed);
  const expression=`\\frac{1}{${people}}\\cdot\\frac{1}{${cards}}`;
  const accepted=new Set([`\\(${expression}\\)`]);
  for(const [first,second] of [[people,cards],[cards,people]])for(const multiply of ['*','×','·','\\times','\\cdot']) {
    accepted.add(`1/${first}${multiply}1/${second}`);
    accepted.add(`(1/${first})${multiply}(1/${second})`);
    accepted.add(`\\frac{1}{${first}}${multiply}\\frac{1}{${second}}`);
    accepted.add(`(\\frac{1}{${first}})${multiply}(\\frac{1}{${second}})`);
  }
  for(const value of [...accepted].slice(1))accepted.add(`(${value})`);
  const question:ExamQuestion={...base(raffleTemplate,index,seed),type:'expression_entry',entryLayout:'plain',entryControl:'expression',
    prompt:`In a school raffle, 1 out of every ${people} students wins a prize. Each prize includes a randomly selected trading card from a set of ${cards} different cards, labeled C1 through C${cards}, with each card equally likely to be chosen. Write an expression that represents the probability that a randomly selected student both wins a prize and receives Card C${card}.`,
    instructions:'Enter the product of the two probabilities. Do not multiply or simplify.',correctTextAnswers:[...accepted],
    explanation:`The probability of winning is 1/${people}. Given a win, the probability of Card C${card} is 1/${cards}. Both must happen, so multiply:\n\\[\\left(${expression}\\right)\\]\nThe card label identifies one card; it is not the number of favorable cards.`};
  return {question,variant,people,cards,card};
}

export const candyTemplate=template('probability-complement-candy-draws-v1','2021-2022-form-a-q99','2827a75e-31d7-4283-abba-23f31ec302b9','Two Candies Excluding a Flavor','Combine two favorable flavors, then reduce favorable and total counts after the first draw.','Probability',8**3*3,compound);
export function generateCandy(index:number,seed='candies') {
  const variant=sequence(index,seed,candyTemplate.distinctCount),excluded=variant%3;let rank=Math.floor(variant/3);
  const counts=Array.from({length:3},()=>{const count=rank%8+1;rank=Math.floor(rank/8);return count;});
  const flavors=['strawberry','banana','orange'],total=counts.reduce((a,b)=>a+b,0),favorable=total-counts[excluded],answer=withoutReplacementSuccessProbability(favorable,total);
  const question:ExamQuestion={...base(candyTemplate,index,seed),type:'multiple_choice',
    prompt:`A box contains ${counts[0]} strawberry ${counts[0]===1?'candy':'candies'}, ${counts[1]} banana ${counts[1]===1?'candy':'candies'}, and ${counts[2]} orange ${counts[2]===1?'candy':'candies'}. If Braden selects 2 candies at random from this box, without replacement, what is the probability that both candies are not ${flavors[excluded]}?`,
    ...probabilityChoices(answer,[fraction(counts[excluded]*(counts[excluded]-1),total*(total-1)),fraction(counts[excluded]**2,total**2),fraction(favorable**2,total**2),fraction(favorable,total)],variant),
    explanation:`There are ${counts.join(' + ')} = ${total} candies. The flavors other than ${flavors[excluded]} contribute ${counts.filter((_,i)=>i!==excluded).join(' + ')} = ${favorable} favorable candies. They do not have to be the same flavor.\nAfter a favorable first draw, ${favorable-1} favorable candies remain among ${total-1} candies.\n\\[\\frac{${favorable}}{${total}}\\cdot\\frac{${favorable-1}}{${total-1}}=${latex(answer)}.\\]\nWithout replacement, both counts decrease by one.`};
  return {question,variant,counts,excluded};
}

const paintCases:{colors:number;parts:number}[]=[];
for(let colors=2;colors<=8;colors++)for(let parts=2;parts<=Math.min(3,colors);parts++)paintCases.push({colors,parts});
export const paintTemplate=template('counting-distinct-paint-arrangements-v1','2020-2021-form-b-q104','b52428e8-11e6-4e11-ac89-ea20045bdfb5','Paint Arrangements Without Repeats','Count assignments of distinct colors to different house parts; order matters.','Counting & Sets',paintCases.length,counting);
export function generatePaint(index:number,seed='paint') {
  const variant=sequence(index,seed,paintCases.length),{colors,parts}=paintCases[variant],factors=Array.from({length:parts},(_,i)=>colors-i),answer=factors.reduce((a,b)=>a*b,1);
  const question:ExamQuestion={...base(paintTemplate,index,seed),type:'multiple_choice',
    prompt:`There are ${colors} different colors of paint available to paint ${parts===3?'the window frame, the door, and the wall':'the door and the wall'} of a house. If no two parts may be painted the same color, how many different ways are there to paint these ${parts} parts?`,
    ...countChoices(answer,[colors,colors*parts,colors**parts,answer/(parts===3?6:2)],variant),
    explanation:`The parts are different positions, so swapping colors between them changes the arrangement. There are ${factors.join(', then ')} choices for successive parts because each used color is unavailable.\n\\[${factors.join('\\times')}=${answer}.\\]\nDo not divide by the number of orders: the window, door, and wall have distinct roles.`};
  return {question,variant,colors,parts};
}

const decimalCases:{start:number;length:number;exponent:number;digit:number}[]=[];
for(let start=1;start<=2;start++)for(let length=4;length<=5;length++)for(let exponent=start;exponent<start+length;exponent++)for(const digit of [1,5])decimalCases.push({start,length,exponent,digit});
const decimal=(digit:number,exponent:number)=>`0.${'0'.repeat(exponent-1)}${digit}`;
export const decimalTemplate=template('probability-decimal-set-threshold-v1','2019-2020-form-a-q80','ce69c192-bbc2-4964-be83-11e577430de4','Probability from a Decimal Set','Compare decimal place values and count outcomes strictly below a threshold.','Probability',decimalCases.length,simple);
export function generateDecimalSet(index:number,seed='decimal-set') {
  const variant=sequence(index,seed,decimalCases.length),{start,length,exponent,digit}=decimalCases[variant];
  const values=Array.from({length},(_,i)=>decimal(1,start+i)),threshold=decimal(digit,exponent);
  // Compare exact scaled integers; equality is deliberately excluded.
  const scale=start+length-1,limit=digit*10**(scale-exponent),successes=values.filter((_,i)=>10**(scale-start-i)<limit),answer=fraction(successes.length,length);
  const equalCount=digit===1?1:0;
  const question:ExamQuestion={...base(decimalTemplate,index,seed),type:'multiple_choice',
    prompt:`\\[\\{${values.join(',')}\\}\\]\nIf a person chooses a number at random from the set above, with each number equally likely to be chosen, what is the probability that the number is less than ${threshold}?`,
    ...probabilityChoices(answer,[fraction(length-successes.length,length),fraction(successes.length+equalCount,length),fraction(Math.max(0,successes.length-1),length),fraction(successes.length,Math.max(1,length-1))],variant),
    explanation:`Compare place values, lining up the decimal points. ${successes.length?`The values strictly below ${threshold} are ${successes.join(', ')}.`:`No values are strictly below ${threshold}.`} ${equalCount?'The value equal to the threshold does not count.':''}\nThere are ${successes.length} favorable choices among ${length} equally likely choices, so the probability is \\(${successes.length}/${length}=${latex(answer)}\\).`};
  return {question,variant,values,threshold};
}

export const cookiesTemplate=template('counting-unordered-cookie-pairs-v1','choose-pairs-of-cookies','3a167138-a2b3-408a-8333-416edf20a507','Choosing Unordered Pairs','Count pairs of distinct cookies, counting each pair once.','Counting & Sets',12,counting);
export function generateCookies(index:number,seed='cookie-pairs') {
  const variant=sequence(index,seed,cookiesTemplate.distinctCount),count=variant+4,answer=count*(count-1)/2;
  const question:ExamQuestion={...base(cookiesTemplate,index,seed),type:'multiple_choice',
    prompt:`There are ${count} different cookies on a plate. Aiden will choose 2 of these cookies to pack in his lunch. How many different pairs of 2 cookies can he choose from the ${count}?`,
    ...countChoices(answer,[2*count,count*(count-1),count**2,count],variant),
    explanation:`There are ${count} choices for a first cookie and ${count-1} for a different second cookie. This counts each pair twice: cookie A then B is the same pair as B then A. Divide by 2:\n\\[\\frac{${count}\\times${count-1}}{2}=${answer}.\\]\nThe selection is a pair, so order does not matter.`};
  return {question,variant,count};
}
export const probabilityBatchPractice=[{...raffleTemplate,generate:generateRaffle},{...candyTemplate,generate:generateCandy},{...paintTemplate,generate:generatePaint},{...decimalTemplate,generate:generateDecimalSet},{...cookiesTemplate,generate:generateCookies}];
