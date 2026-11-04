import type { ExamQuestion } from './examTypes';
import { probabilityFraction as fraction, probabilitySequence as sequence, probabilityChoices } from './probabilityPractice';

type Destination = { moduleId:string; moduleTitle:string; parentId:string|null; groupType:'general'|'foundation'; create:boolean };
const simple:Destination={moduleId:'6416a55e-4152-4dec-833a-a405288cf40a',moduleTitle:'Simple Probability',parentId:'foundation-statistics-and-probability-probability-mzsbkv',groupType:'foundation',create:false};
const algebra:Destination={moduleId:'general-algebra-algebraic-expressions-rj42ee',moduleTitle:'General Practice',parentId:null,groupType:'general',create:false};
const numberParent='general-arithmetic-number-sense-number-properties-1j4ekza';
const rates:Destination={moduleId:'rates-f764fde9',moduleTitle:'Rates',parentId:numberParent,groupType:'general',create:true};
const factors:Destination={moduleId:'factors-multiples-f764fde9',moduleTitle:'Factors & Multiples',parentId:numberParent,groupType:'general',create:true};
function template(id:string,sourceId:string,requestId:string,title:string,description:string,distinctCount:number,destination:Destination,category:string,topic:string) {
  return {id,sourceId,requestId,title,description,distinctCount,destination,moduleId:destination.moduleId,category,topic,enabled:false,publishAfterValidation:true,skilled:'TBD',difficulty:destination.groupType==='foundation'?'foundation' as const:'standard' as const};
}
type Template=ReturnType<typeof template>;
const probability=(id:string,source:string,request:string,title:string,description:string,count:number)=>template(id,source,request,title,description,count,simple,'Statistics and Probability','Probability');
const arithmetic=(id:string,source:string,request:string,title:string,description:string,count:number,destination:Destination)=>template(id,source,request,title,description,count,destination,'Arithmetic & Number Sense','Number Types & Properties');
const base=(t:Template,index:number,seed:string)=>({id:`${t.id}:${seed}:${index}`,points:1,topic:t.category,subtopic:t.topic});
const latex=({n,d}:{n:number;d:number})=>d===1?String(n):`\\frac{${n}}{${d}}`;
function choices(answer:string,candidates:string[],variant:number,math=true) {
  const values=[...new Set([answer,...candidates])];
  if(values.length<4)throw new Error('Four distinct answers are required.');
  const first=values.slice(0,4),at=variant%4,ordered=first.slice(at).concat(first.slice(0,at));
  return {choices:ordered.map((value,i)=>({id:'ABCD'[i],text:value,...(math?{math:value}:{})})),correctChoiceId:'ABCD'[ordered.indexOf(answer)]};
}
function numberChoices(answer:number,candidates:number[],variant:number) {
  const values=[...new Set([answer,...candidates.filter(Number.isInteger)])];
  for(let i=2;values.length<4;i++)if(!values.includes(i))values.push(i);
  return choices(String(answer),values.map(String),variant);
}

export const missingCandyTemplate=probability('probability-missing-color-count-v1','2020-2021-form-b-q74','74f48973-c295-4f83-b22d-054d37c52015','Probability with an Unknown Color Count','Use a probability ratio to recover a missing count before finding the total.',11*4*12);
export function generateMissingCandy(index:number,seed='missing-candy') {
  const variant=sequence(index,seed,missingCandyTemplate.distinctCount),red=2+variant%11,multiplier=2+Math.floor(variant/11)%4,yellow=1+Math.floor(variant/44),green=red*multiplier,total=red+green+yellow,answer=fraction(yellow,total);
  const question:ExamQuestion={...base(missingCandyTemplate,index,seed),type:'multiple_choice',
    prompt:`A bowl contains ${green} green candies, ${yellow} yellow candies, and some red candies. The probability of choosing a green candy at random is ${multiplier===2?'twice':`${multiplier} times`} as great as the probability of choosing a red candy at random. What is the probability of choosing a yellow candy at random?`,
    ...probabilityChoices(answer,[fraction(yellow,green+yellow),fraction(yellow,green+yellow+green*multiplier),fraction(red,total),fraction(green,total)],variant),
    explanation:`All candies have the same chance of being chosen. With the same total in both denominators, the probability ratio equals the count ratio. There are ${green} ÷ ${multiplier} = ${red} red candies, not ${green} × ${multiplier}. The total is ${green} + ${yellow} + ${red} = ${total}. Therefore the probability of yellow is \\(\\frac{${yellow}}{${total}}=${latex(answer)}\\).`};
  return {question,variant};
}

const jarCases:{nq:number;nr:number;yq:number;yr:number}[]=[];
for(const [a,b] of [[1,2],[1,3],[2,3],[1,4],[3,4]])for(const [c,d] of [[1,2],[1,3],[2,3],[1,4],[3,4]])for(let u=1;u<=4;u++)for(let v=1;v<=4;v++)if(b*u!==d*v&&a*d!==c*b)jarCases.push({nq:b*u,nr:d*v,yq:a*u,yr:c*v});
export const combinedJarsTemplate=probability('probability-combined-jars-v1','2020-2021-form-b-q86','17ad6f7d-c938-44e7-aa33-3a6f92cf1df8','Combining Jars','Recover favorable counts from each jar, then combine counts rather than averaging probabilities.',jarCases.length);
export function generateCombinedJars(index:number,seed='combined-jars') {
  const variant=sequence(index,seed,jarCases.length),{nq,nr,yq,yr}=jarCases[variant],p=fraction(yq,nq),r=fraction(yr,nr),answer=fraction(yq+yr,nq+nr);
  const question:ExamQuestion={...base(combinedJarsTemplate,index,seed),type:'multiple_choice',
    prompt:`Jar Q contains ${nq} balls, and Jar R contains ${nr} balls. The probability of drawing a yellow ball at random from Jar Q is \\(${latex(p)}\\). The probability of drawing a yellow ball at random from Jar R is \\(${latex(r)}\\). All the balls are poured into an empty jar, Jar S. What is the probability of drawing a yellow ball at random from Jar S?`,
    ...probabilityChoices(answer,[fraction(p.n*r.d+r.n*p.d,2*p.d*r.d),fraction(p.n+r.n,p.d+r.d),fraction(p.n*r.n,p.d*r.d),p,r],variant),
    explanation:`Jar Q has \\(${nq}\\times${latex(p)}=${yq}\\) yellow balls, and Jar R has \\(${nr}\\times${latex(r)}=${yr}\\). The combined jar has ${yq} + ${yr} = ${yq+yr} yellow balls among ${nq} + ${nr} = ${nq+nr} balls. Thus the probability is \\(\\frac{${yq+yr}}{${nq+nr}}=${latex(answer)}\\). The jars have different sizes, so averaging the two probabilities does not give the combined probability.`};
  return {question,variant};
}

const expressionCases:{a:number;b:number;c:number;d:number;inner:number;outer:number}[]=[];
for(let a=4;a<=10;a++)for(let b=2;b<=9;b++)for(let twiceC=1;twiceC<=11;twiceC+=2)if(twiceC<2*a)for(let d=1;d<=5;d++)for(const inner of [-1,1])for(const outer of [-1,1])expressionCases.push({a,b,c:twiceC/2,d,inner,outer});
const term=(value:number)=>`${value<0?'-':'+'}${Math.abs(value)}`;
const polynomial=(coefficient:number,constant:number)=>`${coefficient}x${constant?term(constant):''}`;
export const negativeDistributionTemplate=template('algebra-distribute-negative-v1','2020-2021-form-b-q84','66b8fa00-511a-4014-bc78-74d31eb0f8e2','Distributing a Negative Sign','Subtract a parenthesized expression, changing every sign inside, then combine like terms.',expressionCases.length,algebra,'Algebra','Algebraic Expressions');
export function generateNegativeDistribution(index:number,seed='negative-distribution') {
  const variant=sequence(index,seed,expressionCases.length),{a,b,c,d,inner,outer}=expressionCases[variant],coefficient=a-inner*c,constant=-b+outer*d,answer=polynomial(coefficient,constant);
  const question:ExamQuestion={...base(negativeDistributionTemplate,index,seed),type:'multiple_choice',
    prompt:`Simplify:\n\\[${a}x-(${b}${term(inner*c)}x)${term(outer*d)}\\]`,
    ...choices(answer,[polynomial(a+inner*c,constant),polynomial(coefficient,b+outer*d),polynomial(a+inner*c,b+outer*d)],variant),
    explanation:`The minus sign before parentheses means multiply every term inside by −1. In particular, \\(-(${b}${term(inner*c)}x)=-${b}${term(-inner*c)}x\\). ${inner<0?'Subtracting the negative variable term makes it positive.':'Both terms inside change signs.'} The term outside the parentheses keeps its sign.\n\\[${a}x-${b}${term(-inner*c)}x${term(outer*d)}=${answer}.\\]\nCombine the x terms: ${a} ${term(-inner*c)} = ${coefficient}; combine constants: −${b} ${term(outer*d)} = ${constant}.`};
  return {question,variant};
}

const payCases:{hours:number;rate:number;tax:number}[]=[];
for(let hours=8;hours<=30;hours+=2)for(let rate=800;rate<=2000;rate+=25)for(let tax=12;tax<=60;tax+=4)if(hours*rate>tax*200)payCases.push({hours,rate,tax});
const money=(cents:number)=>`$${(cents/100).toFixed(2)}`;
export const grossPayTemplate=arithmetic('rates-hourly-pay-before-tax-v1','2020-2021-form-b-q95','491a6fe8-089b-4cb2-9a92-c089caf7453e','Hourly Pay Before Taxes','Add deducted taxes back to take-home pay, then divide gross pay by hours.',payCases.length,rates);
export function generateGrossPay(index:number,seed='gross-pay') {
  const variant=sequence(index,seed,payCases.length),{hours,rate,tax}=payCases[variant],net=hours*rate-tax*100;
  const question:ExamQuestion={...base(grossPayTemplate,index,seed),type:'multiple_choice',
    prompt:`Michael received a check for ${money(net)} for working ${hours} hours at his part-time job. The amount on the check was his total pay after ${money(tax*100)} in taxes was deducted. What was Michael's hourly pay rate before taxes were deducted?`,
    ...choices(money(rate),[money(Math.round((net-tax*100)/hours)),money(Math.round(net/hours)),money(Math.round(net/hours+tax*100)),money(rate+100)],variant,false),
    explanation:`The check is take-home pay, so first add back the deducted tax: ${money(net)} + ${money(tax*100)} = ${money(hours*rate)} in gross pay. Then divide by the ${hours} hours worked: ${money(hours*rate)} ÷ ${hours} = ${money(rate)} per hour. Subtracting the tax again or dividing only the check amount would not recover the pay rate before taxes.`};
  return {question,variant};
}

const consecutiveCases:{total:number;answer:number}[]=[];
for(let total=12;total<=600;total+=6){let answer=0;for(let n=2;n<total;n++)if(total%(n-1)===0&&total%n===0&&total%(n+1)===0)answer=n;if(answer>=3)consecutiveCases.push({total,answer});}
export const consecutiveFactorsTemplate=arithmetic('factors-consecutive-integers-v1','2020-2021-form-b-q93','c8cf1faa-ea9a-45bd-85e6-39e9c19659bf','Greatest Middle of Consecutive Factors','Find three consecutive integers that each divide the given number, and choose the greatest possible middle.',consecutiveCases.length,factors);
export function generateConsecutiveFactors(index:number,seed='consecutive-factors') {
  const variant=sequence(index,seed,consecutiveCases.length),{total,answer}=consecutiveCases[variant],divisors=Array.from({length:total},(_,i)=>i+1).filter(d=>total%d===0),middles=divisors.filter(n=>n>1&&total%(n-1)===0&&total%(n+1)===0);
  const question:ExamQuestion={...base(consecutiveFactorsTemplate,index,seed),type:'multiple_choice',
    prompt:`The integers \\((n-1)\\), \\(n\\), and \\((n+1)\\) are factors of ${total}. What is the greatest possible value of \\(n\\)?`,
    ...numberChoices(answer,[3,total/12,total/2,answer-1,answer+1],variant),
    explanation:`Each of the three consecutive integers must divide ${total}; their product does not have to equal ${total}. The positive factors are ${divisors.join(', ')}. The possible positive middle values whose neighbors are also factors are ${middles.join(', ')}. The greatest is ${answer}: ${answer-1}, ${answer}, and ${answer+1} each divide ${total}. Checking only n without its neighbors can give a larger but invalid answer.`};
  return {question,variant};
}

const smallestCases:{p:number;q:number;k:number}[]=[];
for(const p of [3,5,7,11])for(const q of [3,5,7,11,13,17,19])if(q>=p)for(let k=2;k<=12;k++)smallestCases.push({p,q,k});
export const smallestFactorTemplate=arithmetic('factors-smallest-factor-multiple-v1','2021-2022-form-a-q82','974457c3-c1b7-467f-9bc7-3883c86f35d5','Multiples of the Smallest Factor','Find the smallest factor greater than 1, then identify a number divisible by it.',smallestCases.length,factors);
export function generateSmallestFactor(index:number,seed='smallest-factor') {
  const variant=sequence(index,seed,smallestCases.length),{p,q,k}=smallestCases[variant],total=p*q,answer=p*k;
  const wrong=[answer-5,q*3,answer+9,answer-1,answer+1,answer+2].filter(n=>n>0&&n%p!==0);
  const question:ExamQuestion={...base(smallestFactorTemplate,index,seed),type:'multiple_choice',
    prompt:`Which of the following numbers has factors that include the smallest factor (other than \\(1\\)) of \\(${total}\\)?`,
    ...numberChoices(answer,wrong,variant),
    explanation:`The prime factorization of ${total} is ${p} × ${q}. Therefore its smallest factor greater than 1 is ${p}. We need a choice divisible by ${p}, not merely by the other prime factor. Since ${answer} = ${p} × ${k}, ${answer} has ${p} as a factor; the other choices leave nonzero remainders when divided by ${p}.`};
  return {question,variant};
}

export const prob2Practice=[{...missingCandyTemplate,generate:generateMissingCandy},{...combinedJarsTemplate,generate:generateCombinedJars},{...negativeDistributionTemplate,generate:generateNegativeDistribution},{...grossPayTemplate,generate:generateGrossPay},{...consecutiveFactorsTemplate,generate:generateConsecutiveFactors},{...smallestFactorTemplate,generate:generateSmallestFactor}];
