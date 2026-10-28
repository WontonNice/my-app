import type { ExamQuestion } from './examTypes';

const category='Statistics and Probability',topic='Probability';
export const probabilityModule={id:'probability-foundation',title:'Probability',category,topic,placement:'foundation' as const,
  description:'Build probability skills with number cubes, spinners, sample spaces, and draws with and without replacement.'};
type Fraction={n:number;d:number};
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
function fraction(n:number,d:number):Fraction {
  if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error('Invalid probability fraction.');
  const divisor=gcd(Math.abs(n),d);return {n:n/divisor,d:d/divisor};
}
const key=({n,d}:Fraction)=>`${n}/${d}`;
const latex=({n,d}:Fraction)=>d===1?String(n):`\\frac{${n}}{${d}}`;
const fractionText=({n,d}:Fraction)=>d===1?String(n):`${n}/${d}`;
function sequence(index:number,seed:string,count:number){
  if(!Number.isSafeInteger(index)||index<0)throw new Error('Question index must be a nonnegative safe integer.');
  let hash=0;for(const char of seed)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  let stride=101;while(gcd(stride,count)!==1)stride+=2;
  return ((index%count)*stride+hash%count)%count;
}
function rotate<T>(values:T[],variant:number){const at=variant%values.length;return values.slice(at).concat(values.slice(0,at));}
function probabilityChoices(answer:Fraction,candidates:Fraction[],variant:number){
  if(answer.n<0||answer.n>answer.d)throw new Error('The probability must be between zero and one.');
  const values=new Map<string,Fraction>([[key(answer),answer]]);
  for(const value of candidates)if(value.n>=0&&value.n<=value.d)values.set(key(value),value);
  // Small fractions cover collisions at symmetric counts and impossible events.
  for(let d=2;values.size<4;d++)values.set(key(fraction(1,d)),fraction(1,d));
  const ordered=rotate([...values.values()].slice(0,4),variant);
  return {choices:ordered.map((value,at)=>({id:'ABCD'[at],math:latex(value),text:fractionText(value)})),correctChoiceId:'ABCD'[ordered.findIndex(value=>key(value)===key(answer))]};
}
function textChoices(answer:string,candidates:string[],variant:number){
  const options=[...new Set([answer,...candidates])].slice(0,4);
  if(options.length!==4)throw new Error('Four distinct sample-space lists are required.');
  const ordered=rotate(options,variant);
  return {choices:ordered.map((text,at)=>({id:'ABCD'[at],text})),correctChoiceId:'ABCD'[ordered.indexOf(answer)]};
}
function template(id:string,sourceId:string,title:string,description:string,distinctCount:number){return {id,sourceId,moduleId:probabilityModule.id,title,description,category,topic,distinctCount};}
function base(t:{id:string},index:number,seed:string){return {id:`${t.id}:${seed}:${index}`,points:1,topic:category,subtopic:topic};}

export const cubeSumsTemplate=template('probability-cube-sum-counts-v1','2020-2021-form-b-math-2','Probability: Number-cube Sum Counts','Count the ordered outcomes of two six-sided number cubes that produce a specified sum.',1100);
export function generateCubeSums(index:number,seed='cube-sums'){
  const variant=sequence(index,seed,cubeSumsTemplate.distinctCount),firstStart=variant%10+1,secondStart=Math.floor(variant/10)%10+1;
  const target=firstStart+secondStart+Math.floor(variant/100),pairs:number[][]=[];
  for(let first=firstStart;first<firstStart+6;first++)for(let second=secondStart;second<secondStart+6;second++)if(first+second===target)pairs.push([first,second]);
  const labels=firstStart===secondStart?`Two number cubes have sides labeled ${firstStart} through ${firstStart+5}.`:`The first number cube has sides labeled ${firstStart} through ${firstStart+5}. The second has sides labeled ${secondStart} through ${secondStart+5}.`;
  const question:ExamQuestion={...base(cubeSumsTemplate,index,seed),type:'short_response',instructions:'Enter your answer in the space.',
    prompt:`${labels} Both number cubes are rolled. How many different outcomes will have a sum of ${target}?`,correctTextAnswers:[String(pairs.length)],
    explanation:`List the ordered pairs (first cube, second cube) that add to ${target}:\n\n${pairs.map(pair=>`(${pair.join(', ')})`).join(', ')}.\n\nThere are ${pairs.length} outcomes. Record which number is on each cube. Two different numbers in reversed positions count separately when both orders are possible.`};
  return {question,variant,firstStart,secondStart,target,pairs};
}

const ratioCases:{parts:number[];scale:number;removed:number}[]=[];
for(let red=1;red<=5;red++)for(let white=1;white<=5;white++)for(let blue=1;blue<=5;blue++)for(let scale=2;scale<=6;scale++)for(let removed=1;removed<scale;removed++)ratioCases.push({parts:[red,white,blue],scale,removed});
export const ratioRemovalTemplate=template('probability-ratio-removal-v1','2020-2021-form-b-q102','Probability: Ratio Counts After Removal','Convert a color ratio to counts, remove the specified items, and update the probability.',ratioCases.length);
export function generateRatioRemoval(index:number,seed='ratio-removal'){
  const variant=sequence(index,seed,ratioCases.length),{parts,scale,removed}=ratioCases[variant],counts=parts.map(part=>part*scale);
  const total=counts.reduce((sum,count)=>sum+count,0),remainingTotal=total-3*removed,remainingBlue=counts[2]-removed,answer=fraction(remainingBlue,remainingTotal);
  const question:ExamQuestion={...base(ratioRemovalTemplate,index,seed),type:'multiple_choice',
    prompt:`A box contains a total of ${total} paper clips with colors in the ratio red:white:blue = ${parts.join(':')}. Suppose that ${removed===1?'one paper clip':`${removed} paper clips`} of each color ${removed===1?'is':'are'} removed from the box and not replaced. What is the probability that the next paper clip chosen will be blue?`,
    ...probabilityChoices(answer,[fraction(counts[2],total),fraction(remainingBlue,total),fraction(counts[2],remainingTotal),fraction(counts[0]-removed,remainingTotal),fraction(counts[1]-removed,remainingTotal)],variant),
    explanation:`The ratio has ${parts.join(' + ')} = ${parts.reduce((a,b)=>a+b,0)} parts. Each part represents ${scale} paper clips, so there are ${counts[2]} blue paper clips initially.\n\nRemoving ${removed} of each of the three colors removes ${3*removed} paper clips in all.\nRemaining blue: ${counts[2]} − ${removed} = ${remainingBlue}.\nRemaining total: ${total} − ${3*removed} = ${remainingTotal}.\n\nTherefore, the probability is \\(${remainingBlue}/${remainingTotal}=${latex(answer)}\\).`};
  return {question,variant,parts:[...parts],counts,total,removed,remainingBlue,remainingTotal};
}

const shirtNames=['Chris','Alex','Jordan','Taylor'];
export const orderedDrawsTemplate=template('probability-ordered-draws-v1','2020-2021-form-b-q107','Probability: Ordered Draws Without Replacement','Find the probability of two different colors in a specified order without replacement.',8**3*shirtNames.length);
export function generateOrderedDraws(index:number,seed='ordered-draws'){
  const variant=sequence(index,seed,orderedDrawsTemplate.distinctCount);let rank=variant;
  const name=shirtNames[rank%4];rank=Math.floor(rank/4);const red=rank%8+1;rank=Math.floor(rank/8);const white=rank%8+1,black=Math.floor(rank/8)+1,total=red+white+black;
  const answer=fraction(black*red,total*(total-1));
  const question:ExamQuestion={...base(orderedDrawsTemplate,index,seed),type:'multiple_choice',
    prompt:`${name} has ${red} red ${red===1?'shirt':'shirts'}, ${white} white ${white===1?'shirt':'shirts'}, and ${black} black ${black===1?'shirt':'shirts'}. ${name} picks a shirt at random. Without putting the first shirt back, ${name} picks a second shirt at random. What is the probability that the first shirt is black and the second shirt is red?`,
    ...probabilityChoices(answer,[fraction(black*red,total*total),fraction(2*black*red,total*(total-1)),fraction(black,total),fraction(red,total-1)],variant),
    explanation:`There are ${total} shirts. The probability of black first is ${black}/${total}. After a black shirt is removed, ${total-1} shirts remain, including all ${red} red shirts.\n\nMultiply the probabilities for this specific order:\n\\[\\frac{${black}}{${total}}\\times\\frac{${red}}{${total-1}}=${latex(answer)}\\]\n\nDo not double the result: red then black is not the requested order.`};
  return {question,variant,name,red,white,black,total};
}

export const sameColorTemplate=template('probability-same-color-no-replacement-v1','2021-2022-form-a-q78','Probability: Both Not Blue','Use the complement color and reduce both the favorable and total counts after a draw.',400);
export function generateSameColor(index:number,seed='same-color'){
  const variant=sequence(index,seed,sameColorTemplate.distinctCount),red=variant%20+1,blue=Math.floor(variant/20)+1,total=red+blue,answer=fraction(red*(red-1),total*(total-1));
  const question:ExamQuestion={...base(sameColorTemplate,index,seed),type:'multiple_choice',
    prompt:`In a sample of ${total} cards, ${red} are red and ${blue} are blue. If 2 cards are selected at random from the sample, one at a time without replacement, what is the probability that both cards are not blue?`,
    ...probabilityChoices(answer,[fraction(red*red,total*total),fraction(red,total),fraction(blue*(blue-1),total*(total-1)),fraction(red*(red-1),total*total)],variant),
    explanation:`Only red and blue cards are present, so “not blue” means red. The probability of red on the first draw is ${red}/${total}. After drawing red, ${red-1} red cards remain among ${total-1} cards.\n\\[\\frac{${red}}{${total}}\\times\\frac{${red-1}}{${total-1}}=${latex(answer)}\\]\n${red===1?'There is only one red card, so drawing two red cards is impossible.':'Both the favorable count and total count decrease because the first card is not replaced.'}`};
  return {question,variant,red,blue,total};
}

const marbleNames=['Sarah','Maya','Lena','Ava'];
export const replacementTemplate=template('probability-with-replacement-v1','2022-2023-form-a-q100','Probability: Repeated Draws With Replacement','Multiply unchanged single-draw probabilities when the first item is returned.',15*15*marbleNames.length);
export function generateReplacement(index:number,seed='replacement'){
  const variant=sequence(index,seed,replacementTemplate.distinctCount);let rank=variant;
  const name=marbleNames[rank%4];rank=Math.floor(rank/4);const red=rank%15+1,blue=Math.floor(rank/15)+1,total=red+blue,answer=fraction(red*red,total*total);
  const question:ExamQuestion={...base(replacementTemplate,index,seed),type:'multiple_choice',
    prompt:`A bag contains ${total} marbles: ${blue} blue ${blue===1?'marble':'marbles'} and ${red} red ${red===1?'marble':'marbles'}. ${name} picks one marble randomly, returns it to the bag, and then randomly picks one marble again. What is the probability that she picks a red marble both times?`,
    ...probabilityChoices(answer,[fraction(red*red,blue*blue),fraction(2*red,total),fraction(blue*blue,total*total),fraction(red,total),fraction(red*(red-1),total*(total-1))],variant),
    explanation:`The probability of red on one draw is ${red}/${total}. Because the marble is returned, the second draw has the same probability.\n\\[\\frac{${red}}{${total}}\\times\\frac{${red}}{${total}}=${latex(answer)}\\]\n\nThe number of marbles stays ${total} on both draws.`};
  return {question,variant,name,red,blue,total};
}

const spinnerNames=['Karl','Mia','Ali','Lena'];
const spinnerCases:{sections:number;product:number}[]=[];
for(let sections=3;sections<=8;sections++){
  const products=new Set<number>();for(let a=1;a<=sections;a++)for(let b=1;b<=sections;b++)products.add(a*b);
  for(const product of [...products].sort((a,b)=>a-b))spinnerCases.push({sections,product});
}
export const spinnerProductsTemplate=template('probability-spinner-products-v1','2022-2023-form-b-q100','Probability: Spinner Products','Count favorable ordered spinner pairs and divide by all equally likely outcomes.',spinnerCases.length*spinnerNames.length);
export function generateSpinnerProducts(index:number,seed='spinner-products'){
  const variant=sequence(index,seed,spinnerProductsTemplate.distinctCount),name=spinnerNames[variant%4],{sections,product}=spinnerCases[Math.floor(variant/4)],pairs:number[][]=[];
  for(let red=1;red<=sections;red++)for(let blue=1;blue<=sections;blue++)if(red*blue===product)pairs.push([red,blue]);
  const total=sections*sections,answer=fraction(pairs.length,total);
  const question:ExamQuestion={...base(spinnerProductsTemplate,index,seed),type:'multiple_choice',
    prompt:`${name} has one red spinner and one blue spinner. Each spinner is divided into ${sections} equal sections, numbered 1 through ${sections}. ${name} spins each spinner once and writes down the number that each lands on. What is the probability that the two numbers, when multiplied together, will have ${product} as a product?`,
    ...probabilityChoices(answer,[fraction(1,total),fraction(sections,2*sections-1),fraction(2*sections-1,total),fraction(pairs.length,sections),fraction(pairs.filter(([a,b])=>a<=b).length,total)],variant),
    explanation:`Each spinner has ${sections} equally likely results, so there are ${sections} × ${sections} = ${total} ordered outcomes. The pairs (red spinner, blue spinner) with product ${product} are:\n\n${pairs.map(pair=>`(${pair.join(', ')})`).join(', ')}.\n\nThere are ${pairs.length} favorable outcomes, giving probability \\(${pairs.length}/${total}=${latex(answer)}\\).`};
  return {question,variant,name,sections,product,pairs,total};
}

const colorSets=[{names:['red','green','white'],letters:['R','G','W']},{names:['blue','yellow','orange'],letters:['B','Y','O']},{names:['pink','violet','gold'],letters:['P','V','G']}];
const sampleNames=['Melissa','Dana','Kim','Robin'];
export const sampleSpacesTemplate=template('probability-unordered-sample-spaces-v1','2022-2023-form-b-q101','Probability: Unordered Sample Spaces','List possible color pairs once each, allowing repeats only when enough items exist.',5**3*colorSets.length*sampleNames.length);
export function generateSampleSpaces(index:number,seed='sample-spaces'){
  const variant=sequence(index,seed,sampleSpacesTemplate.distinctCount);let rank=variant;
  const name=sampleNames[rank%4];rank=Math.floor(rank/4);const colors=colorSets[rank%3];rank=Math.floor(rank/3);
  const counts=Array.from({length:3},()=>{const count=rank%5+1;rank=Math.floor(rank/5);return count;});
  const pairs:string[]=[],ordered:string[]=[],distinct:string[]=[];
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)if(a!==b||counts[a]>=2){const pair=colors.letters[a]+colors.letters[b];ordered.push(pair);if(a<=b)pairs.push(pair);if(a<b)distinct.push(pair);}
  const answer=pairs.join(', '),bag=counts.flatMap((count,at)=>Array.from({length:count},()=>colors.letters[at]));
  const descriptions=counts.map((count,at)=>`${count} ${colors.names[at]} (${colors.letters[at]}) ${count===1?'marble':'marbles'}`);
  const question:ExamQuestion={...base(sampleSpacesTemplate,index,seed),type:'multiple_choice',
    prompt:`${name} has a bag of marbles that are all the same size. The bag contains ${descriptions.slice(0,2).join(', ')}, and ${descriptions[2]}. For an experiment, ${name} will take two marbles out of the bag without looking and without replacement. The order of the colors does not matter. Which list shows every possible color pair, with each unordered pair listed exactly once?`,
    ...textChoices(answer,[colors.letters.join(', '),distinct.join(', '),bag.join(', '),ordered.join(', '),pairs.slice(0,-1).join(', '),pairs.slice(1).join(', ')],variant),
    explanation:`List pairs of colors, rather than individual marbles. Different-color pairs are ${distinct.join(', ')}. A repeated-color pair is possible only if the bag contains at least two marbles of that color.\n\nThe complete list is:\n${answer}.\n\nOrder does not matter, so a pair such as ${colors.letters[0]+colors.letters[1]} and its reversal ${colors.letters[1]+colors.letters[0]} is listed only once. These color pairs need not be equally likely; this question asks which pairs are possible.`};
  return {question,variant,name,counts,letters:[...colors.letters],pairs};
}

const conditionalCases:{people:number;viruses:number;virus:number}[]=[];
for(let people=5;people<=40;people+=5)for(let viruses=20;viruses<=200;viruses+=20)for(let virus=1;virus<=viruses;virus++)conditionalCases.push({people,viruses,virus});
export const specificOutcomeTemplate=template('probability-specific-conditional-outcome-v1','2022-2023-form-b-q99','Probability: One Specific Conditional Outcome','Multiply an event probability by the conditional probability of one equally likely cause.',conditionalCases.length);
export function generateSpecificOutcome(index:number,seed='specific-outcome'){
  const variant=sequence(index,seed,conditionalCases.length),{people,viruses,virus}=conditionalCases[variant],answer=fraction(1,people*viruses);
  const question:ExamQuestion={...base(specificOutcomeTemplate,index,seed),type:'multiple_choice',
    prompt:`In a probability model, one person out of every ${people} people has a cold. Assume that a cold can be caused by any one of ${viruses} different viruses, each equally likely to be the cause. One is labeled V${virus}. What is the probability that a randomly selected person has a cold caused by virus V${virus}?`,
    ...probabilityChoices(answer,[fraction(1,people),fraction(1,viruses),fraction(1,people+viruses),fraction(people+viruses,people*viruses)],variant),
    explanation:`In this model, the probability of having a cold is 1/${people}. Among people with a cold, the probability that the cause is V${virus} is 1/${viruses}. Both conditions must hold:\n\\[\\frac{1}{${people}}\\times\\frac{1}{${viruses}}=${latex(answer)}\\]\n\nTherefore, the probability is ${fractionText(answer)}.`};
  return {question,variant,people,viruses,virus};
}

export const probabilityPractice=[
  {...cubeSumsTemplate,generate:generateCubeSums},
  {...ratioRemovalTemplate,generate:generateRatioRemoval},
  {...orderedDrawsTemplate,generate:generateOrderedDraws},
  {...sameColorTemplate,generate:generateSameColor},
  {...replacementTemplate,generate:generateReplacement},
  {...spinnerProductsTemplate,generate:generateSpinnerProducts},
  {...sampleSpacesTemplate,generate:generateSampleSpaces},
  {...specificOutcomeTemplate,generate:generateSpecificOutcome},
];
