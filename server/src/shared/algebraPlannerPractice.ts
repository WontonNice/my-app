import type { ExamChoice, ExamQuestion } from './examTypes';
import { probabilitySequence as sequence } from './probabilityPractice';

const expressionsParent='foundation-algebra-algebraic-expressions-rj42ee';
const simple={moduleId:'ed43bc4b-77e7-42c2-b0fa-f677efd08459',moduleTitle:'Simplifying Expressions',parentId:expressionsParent,groupType:'foundation' as const,create:false};
const evaluate={moduleId:'evaluating-substituting-55e91aa0',moduleTitle:'Evaluating & Substituting Expressions',parentId:expressionsParent,groupType:'foundation' as const,create:true};
const bothSides={moduleId:'2022-2023-form-b-q70',moduleTitle:'Inequalities: Variables on Both Sides',parentId:'foundation',groupType:'foundation' as const,create:false};
const graphing={moduleId:'ca02b8f6-c345-4113-8249-87ec13615831',moduleTitle:'Graphing Inequalities',parentId:'foundation',groupType:'foundation' as const,create:false};
const consecutive={moduleId:'consecutive-integers-55e91aa0',moduleTitle:'Consecutive Integers',parentId:'foundation-arithmetic-number-sense-number-properties-1j4ekza',groupType:'foundation' as const,create:true};
type Destination=typeof simple;
function template(id:string,sourceId:string,requestId:string,title:string,description:string,distinctCount:number,destination:Destination,skilled='TBD'){
  return {id,sourceId,requestId,title,description,distinctCount,destination,moduleId:destination.moduleId,category:destination===consecutive?'Arithmetic & Number Sense':'Algebra',topic:destination===consecutive?'Number Types & Properties':destination===bothSides||destination===graphing?'Inequalities':'Algebraic Expressions',skilled,enabled:false,publishAfterValidation:true,difficulty:'standard' as const};
}
type Template=ReturnType<typeof template>;
const simpleSkill='9abd5350-a5f2-4fad-9822-c1e064977942';
const base=(t:Template,index:number,seed:string)=>({id:`${t.id}:${seed}:${index}`,points:1,topic:t.category,subtopic:t.topic});
const signed=(n:number)=>n<0?String(n):`+${n}`;
const term=(n:number,v='x')=>n===0?'0':n===1?v:n===-1?`-${v}`:`${n}${v}`;
const poly=(a:number,b:number,v='x')=>a===0?String(b):term(a,v)+(b?signed(b):'');
const constantFirst=(a:number,b:number)=>`${b}${a<0?'-':'+'}${term(Math.abs(a),'n')}`;
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
function choices(answer:string,traps:string[],variant:number){
  const values=[...new Set([answer,...traps])];if(values.length<4)throw Error('Distinct answer choices required.');
  const four=values.slice(0,4),r=variant%4,ordered=four.slice(r).concat(four.slice(0,r));
  return {choices:ordered.map((math,i)=>({id:'ABCD'[i],math,text:math})),correctChoiceId:'ABCD'[ordered.indexOf(answer)]};
}

const coefficientCases:{p:number;q:number;a:number;b:number;c:number}[]=[];
for(const q of [2,4,5,10])for(let p=1;p<q;p++)if(gcd(p,q)===1)for(let a=2;a<=7;a++)for(let b=2;b<=8;b++)for(let c=1;c<=6;c++)coefficientCases.push({p,q,a,b,c});
export const decimalCoefficientTemplate=template('algebra-decimal-coefficient-v1','2020-2021-form-b-q58','7f296eec-e9dc-4229-a93c-3819864e77fe','Decimal Coefficient after Distribution','Distribute a fractional multiplier and combine variable terms; enter the coefficient as a decimal.',coefficientCases.length,simple,simpleSkill);
export function generateDecimalCoefficient(index:number,seed='decimal-coefficient'){
  const variant=sequence(index,seed,coefficientCases.length),{p,q,a,b,c}=coefficientCases[variant],answer=String((p*a-c*q)/q);
  const question:ExamQuestion={...base(decimalCoefficientTemplate,index,seed),type:'numeric_entry',instructions:'Enter only your answer as a decimal.',entryLayout:'x_equals',
    prompt:`\\[\\frac{${p}}{${q}}(${a}x+${b})-${term(c)}\\]\n\nAfter the expression above is simplified, what is the coefficient of \\(x\\) expressed as a decimal?`,correctTextAnswers:[...new Set([answer,...[2,3,4].map(places=>Number(answer).toFixed(places))].flatMap(value=>[value,value.replace(/^(-?)0\./,'$1.')]))],
    explanation:`Distribute the fraction to both terms. The variable coefficient becomes \\(\\frac{${p}\\cdot${a}}{${q}}-${c}=\\frac{${p*a-c*q}}{${q}}=${answer}\\). The constant term \\(\\frac{${p*b}}{${q}}\\) does not affect the coefficient of x.`};
  return {question,variant};
}

const substitutionCases:{k:number;a:number;b:number;c:number;d:number;e:number}[]=[];
for(let k=2;k<=6;k++)for(let a=1;a<=4;a++)for(let b=2;b<=4;b++)for(let c=2;c<=5;c++)for(let d=1;d<=6;d++)for(let e=1;e<=4;e++)substitutionCases.push({k,a,b,c,d,e});
export const substitutionTemplate=template('algebra-substitute-linear-expression-v1','2020-2021-form-b-q88','ba789860-7372-40c3-ba40-80f12a00aa2a','Substitution into a Distributed Expression','Substitute a variable relationship, distribute, and combine like terms.',substitutionCases.length,evaluate);
export function generateSubstitution(index:number,seed='substitution'){
  const variant=sequence(index,seed,substitutionCases.length),{k,a,b,c,d,e}=substitutionCases[variant],coefficient=k*(a+b*c)-e,constant=b*d,answer=poly(coefficient,constant);
  const question:ExamQuestion={...base(substitutionTemplate,index,seed),type:'multiple_choice',prompt:`If \\(y=${k}x\\), what is the value of \\(${term(a,'y')}+${b}(${term(c,'y')}+${d})-${term(e)}\\) in terms of \\(x\\)?`,
    ...choices(answer,[poly(a+b*c-e,constant),poly(coefficient,d),poly(coefficient+e,constant)],variant),
    explanation:`First distribute: \\(${term(a,'y')}+${term(b*c,'y')}+${constant}-${term(e)}=${term(a+b*c,'y')}+${constant}-${term(e)}\\). Replace y with ${k}x, then combine variable terms: \\(${term((a+b*c)*k)}+${constant}-${term(e)}=${answer}\\).`};return {question,variant};
}

const inequalityCases:{a:number;b:number;c:number;d:number;e:number;f:number;relation:'<'|'>'}[]=[];
for(const a of [2,4,6,8])for(const c of [1,3,5])for(const d of [2,3])for(const f of [1,2,3])for(const e of [2,4,5])for(const endpoint of [-4,-2,1,3])for(const relation of ['<','>'] as const){const coefficient=a-c-d*f,b=d*e+coefficient*endpoint;if(coefficient!==0&&b>0&&b<=40)inequalityCases.push({a,b,c,d,e,f,relation});}
export const distributedInequalityTemplate=template('inequality-distribute-both-sides-v1','2020-2021-form-b-q101','a88089fd-948f-40cf-a540-241038b234db','Inequalities with Parentheses on Both Sides','Distribute a negative multiplier before collecting terms and reversing the inequality when needed.',inequalityCases.length,bothSides);
export function generateDistributedInequality(index:number,seed='distributed-inequality'){
  const variant=sequence(index,seed,inequalityCases.length),{a,b,c,d,e,f,relation}=inequalityCases[variant],coefficient=a-c-d*f,constant=b-d*e,endpoint=constant/coefficient,solution=coefficient<0?(relation==='<'?'>':'<'):relation,opposite=solution==='<'?'>':'<',answer=`x${solution}${endpoint}`;
  const question:ExamQuestion={...base(distributedInequalityTemplate,index,seed),type:'multiple_choice',prompt:`Which inequality is equivalent to \\(${term(a)}-${b}${relation}${term(c)}-${d}(${e}-${term(f)})\\)?`,...choices(answer,[`x${opposite}${endpoint}`,`x${solution}${-endpoint}`,`x${opposite}${-endpoint}`],variant),
    explanation:`Distribute −${d} to both terms: \\(${term(a)}-${b}${relation}${term(c+d*f)}-${d*e}\\). Collect the x terms and constants: \\(${term(coefficient)}${relation}${constant}\\). Divide by ${coefficient}${coefficient<0?', reversing the inequality sign':', keeping the inequality sign'}. Therefore \\(${answer}\\).`};return {question,variant};
}

type Graph={low:number;high:number;outside:boolean;leftClosed:boolean;rightClosed:boolean};
function graphDescription(g:Graph){return g.outside?`Number line shaded to the left of ${g.low} and to the right of ${g.high}, with ${g.leftClosed?'closed':'open'} circle at ${g.low} and ${g.rightClosed?'closed':'open'} circle at ${g.high}.`:`Number line shaded between ${g.low} and ${g.high}, with ${g.leftClosed?'closed':'open'} circle at ${g.low} and ${g.rightClosed?'closed':'open'} circle at ${g.high}.`;}
/** Pure generated artwork: no source-image crops or remote resources. */
export function inequalityNumberLine(g:Graph,min:number,max:number){
  const width=400,left=20,right=380,y=30,x=(v:number)=>left+(v-min)/(max-min)*(right-left),step=Math.max(1,Math.ceil((max-min)/16));
  let marks='';for(let v=min;v<=max;v++)marks+=`<path d="M${x(v)},24v12" stroke="#475569"/>${v%step===0&&[g.low,g.high].every(endpoint=>v===endpoint||Math.abs(v-endpoint)>=step)?`<text x="${x(v)}" y="59" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">${v}</text>`:''}`;
  // Label endpoints explicitly even when a wider scale skips their tick labels.
  for(const v of [g.low,g.high])if(v%step!==0)marks+=`<text x="${x(v)}" y="59" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">${v}</text>`;
  const line=(a:number,b:number)=>`<path d="M${a},${y}H${b}" stroke="#123b61" stroke-width="4"/>`;
  const arrow=(at:number,direction:number)=>`<path d="M${at},${y}l${direction*8},-5v10z" fill="#123b61"/>`;
  const solution=g.outside?line(left,x(g.low))+line(x(g.high),right)+arrow(left,1)+arrow(right,-1):line(x(g.low),x(g.high));
  const circles=[{at:g.low,closed:g.leftClosed},{at:g.high,closed:g.rightClosed}].map(p=>`<circle cx="${x(p.at)}" cy="${y}" r="4.5" stroke="#123b61" stroke-width="2" fill="${p.closed?'#123b61':'white'}"/>`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="70" viewBox="0 0 400 70"><rect width="400" height="70" fill="white"/><path d="M${left},${y}H${right}" stroke="#475569"/><path d="M12,30l8,-4v8z M388,30l-8,-4v8z" fill="#475569"/>${marks}${solution}${circles}</svg>`;
  return {src:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,alt:graphDescription(g),width,height:70};
}
function graphChoices(correct:Graph,traps:Graph[],variant:number){
  const all=[correct,...traps],min=Math.min(...all.map(g=>g.low))-2,max=Math.max(...all.map(g=>g.high))+2,r=variant%4,ordered=all.slice(r).concat(all.slice(0,r));
  return {choices:ordered.map((g,i):ExamChoice=>({id:'ABCD'[i],text:'',image:inequalityNumberLine(g,min,max)})),correctChoiceId:'ABCD'[ordered.indexOf(correct)]};
}
const absoluteCases:{h:number;r:number;relation:string}[]=[];
for(let h=-5;h<=5;h++)for(let r=1;r<=5;r++)for(const relation of ['>','\\geq','<','\\leq'])absoluteCases.push({h,r,relation});
export const absoluteGraphTemplate=template('inequality-absolute-value-number-line-v1','2020-2021-form-b-q110','37840bf2-fea1-437c-a44d-8ecc6b2a71dd','Graphing Absolute-Value Inequalities','Translate distance from a point into an interval or two rays, with open or closed endpoints.',absoluteCases.length,graphing);
export function generateAbsoluteGraph(index:number,seed='absolute-graph'){
  const variant=sequence(index,seed,absoluteCases.length),{h,r,relation}=absoluteCases[variant],low=-h-r,high=-h+r,outside=relation==='>'||relation==='\\geq',closed=relation.includes('eq'),correct={low,high,outside,leftClosed:closed,rightClosed:closed};
  const question:ExamQuestion={...base(absoluteGraphTemplate,index,seed),type:'multiple_choice',prompt:`Which graph represents the solution to \\(|x${h?signed(h):''}|${relation}${r}\\)?`,...graphChoices(correct,[{...correct,outside:!outside},{...correct,leftClosed:!closed,rightClosed:!closed},{...correct,outside:!outside,leftClosed:!closed,rightClosed:!closed}],variant),
    explanation:`The expression |x${h?signed(h):''}| is the distance from ${-h}. The boundary points are ${-h} − ${r} = ${low} and ${-h} + ${r} = ${high}. Shade ${outside?'the two outside rays':'between these points'} because the distance is ${outside?'greater':'less'} than${closed?' or equal to':''} ${r}. Use ${closed?'closed':'open'} circles because equality is ${closed?'included':'excluded'}.`};return {question,variant};
}

const combineCases:{a:number;b:number;c:number;d:number;e:number}[]=[];
for(const a of [3,5,7,9])for(const b of [1,3,5])for(const c of [2,4,6,8])for(const d of [2,4,6])for(const e of [2,4,8])combineCases.push({a,b,c,d,e});
export const combiningGroupsTemplate=template('algebra-combine-parenthesized-groups-v1','2021-2022-form-a-q64','e08360d9-c70e-4be7-9b6b-4caff83e5e8d','Combining Parenthesized Groups','Remove parentheses with the correct signs, then group constants and variable terms.',combineCases.length,simple,simpleSkill);
export function generateCombiningGroups(index:number,seed='combining-groups'){
  const variant=sequence(index,seed,combineCases.length),{a,b,c,d,e}=combineCases[variant],coefficient=b-d,constant=a+c-e,answer=constantFirst(coefficient,constant);
  const question:ExamQuestion={...base(combiningGroupsTemplate,index,seed),type:'multiple_choice',prompt:`\\(${a}+(${term(b,'n')}+${c})-(${term(d,'n')}+${e})=\\)`,...choices(answer,[constantFirst(b+d,constant),constantFirst(coefficient,a+c+e),constantFirst(b+d,a+c+e)],variant),
    explanation:`Subtract both terms in the last parentheses: \\(${a}+${term(b,'n')}+${c}-${term(d,'n')}-${e}\\). Combine constants, ${a} + ${c} − ${e} = ${constant}, and coefficients, ${b} − ${d} = ${coefficient}. The result is \\(${answer}\\).`};return {question,variant};
}

const compoundCases:{a:number;b:number;d:number;leftClosed:boolean;rightClosed:boolean}[]=[];
for(let a=-5;a<=-1;a++)for(let b=1;b<=5;b++)for(let d=2;d<=5;d++)for(const leftClosed of [false,true])for(const rightClosed of [false,true])compoundCases.push({a,b,d,leftClosed,rightClosed});
export const compoundGraphTemplate=template('inequality-compound-number-line-v1','2021-2022-form-a-q71','73db8c4e-7373-45fc-9fe4-72d67e8a8751','Graphing Compound Inequalities','Multiply all three parts of a compound inequality and graph the bounded interval.',compoundCases.length,graphing);
export function generateCompoundGraph(index:number,seed='compound-graph'){
  const variant=sequence(index,seed,compoundCases.length),{a,b,d,leftClosed,rightClosed}=compoundCases[variant],correct={low:a*d,high:b*d,outside:false,leftClosed,rightClosed};
  const question:ExamQuestion={...base(compoundGraphTemplate,index,seed),type:'multiple_choice',prompt:`Which number line below shows the solution to the inequality \\(${a}${leftClosed?'\\leq':'<'}\\frac{x}{${d}}${rightClosed?'\\leq':'<'}${b}\\)?`,
    ...graphChoices(correct,[{...correct,low:a,high:b},{...correct,outside:true},{...correct,leftClosed:!leftClosed,rightClosed:!rightClosed}],variant),
    explanation:`Multiply all three parts by the positive number ${d}, so neither inequality sign reverses: \\(${a*d}${leftClosed?'\\leq':'<'}x${rightClosed?'\\leq':'<'}${b*d}\\). Shade between ${a*d} and ${b*d}. The left endpoint is ${leftClosed?'closed':'open'} and the right endpoint is ${rightClosed?'closed':'open'}, matching whether each inequality includes equality.`};return {question,variant};
}

const sumCases:{p:number;q:number;a:number;b:number;c:number;r:number;s:number;d:number}[]=[];
for(const p of [2,4])for(const q of [1.5,2.5,3.5])for(let a=1;a<=6;a++)for(const r of [2,3,4])if((p*q+a)%r===0)for(const b of [2,4,5,6])for(const c of [2,4,6])for(const d of [3,5,7])if(b-p*c+r*d!==0)sumCases.push({p,q,a,b,c,r,s:(p*q+a)/r,d});
export const expressionSumTemplate=template('algebra-equivalent-expression-sums-v1','2025-2026-form-a-math-2','8179b486-1ec3-4713-beab-300f99744bbb','Equivalent Forms of an Expression Sum','Select both an expanded form and a simplified form of a sum whose variable terms cancel.',sumCases.length,simple,simpleSkill);
export function generateExpressionSum(index:number,seed='expression-sum'){
  const variant=sequence(index,seed,sumCases.length),{p,q,a,b,c,r,s,d}=sumCases[variant],answer=b-p*c+r*d,expanded=`${b}-${term(a,'n')}+${term(r*s,'n')}+${r*d}-${term(p*q,'n')}-${p*c}`;
  const values=[expanded,`${b}-${term(a,'n')}+${term(r*s,'n')}+${r*d}-${term(p*q,'n')}+${p*c}`,`${b}-${term(a,'n')}+${term(r*s-1,'n')}+${r*d}-${term(p*q,'n')}-${p*c}`,`${answer}-${term(a,'n')}`,String(answer),String(answer+2*p*c)];
  const rotation=variant%6,ordered=values.slice(rotation).concat(values.slice(0,rotation));
  const question:ExamQuestion={...base(expressionSumTemplate,index,seed),type:'multi_select',requiredSelections:2,prompt:`Three expressions are given:\n\n\\[-${p}(${q}n+${c})\\]\n\\[${b}-${term(a,'n')}\\]\n\\[${r}(${term(s,'n')}+${d})\\]\n\nWhich of these are equivalent to the sum of these three expressions?\n\nSelect the **two** correct answers.`,choices:ordered.map((math,i)=>({id:'ABCDEF'[i],math,text:math})),correctChoiceIds:[expanded,String(answer)].map(value=>'ABCDEF'[ordered.indexOf(value)]),
    explanation:`Distribute the multipliers: the first expression becomes \\(-${term(p*q,'n')}-${p*c}\\) and the third becomes \\(${term(r*s,'n')}+${r*d}\\). An expanded sum is \\(${expanded}\\). The coefficient of n is −${p*q} − ${a} + ${r*s} = 0, while the constants total ${b} − ${p*c} + ${r*d} = ${answer}. Thus both that expanded expression and ${answer} are correct.`};return {question,variant};
}

const integerCases:{count:number;least:string;greatest:string}[]=[];
for(let count=3;count<=31;count+=2)for(const [least,greatest] of [['l','g'],['a','b'],['p','q'],['m','n']])integerCases.push({count,least,greatest});
export const consecutiveAverageTemplate=template('number-consecutive-integer-average-v1','average-of-consecutive-integers','84024a78-035d-4795-bc51-e88590922e6f','Average of Consecutive Integer Endpoints','Express the greatest integer using the least, then simplify the average of the endpoints.',integerCases.length,consecutive,'6ef8aa5f-caf0-4820-9d24-eaf0e4b2c21e');
export function generateConsecutiveAverage(index:number,seed='consecutive-average'){
  const variant=sequence(index,seed,integerCases.length),{count,least,greatest}=integerCases[variant],offset=(count-1)/2,answer=`${least}+${offset}`;
  const question:ExamQuestion={...base(consecutiveAverageTemplate,index,seed),type:'multiple_choice',prompt:`The least of ${count} consecutive integers is \\(${least}\\), and the greatest is \\(${greatest}\\). What is the value of \\(\\frac{${least}+${greatest}}{2}\\) in terms of \\(${least}\\)?`,...choices(answer,[`2${least}`,`${least}+${count}`,`${least}+${count-1}`],variant),
    explanation:`There are ${count-1} steps from the least integer to the greatest, so \\(${greatest}=${least}+${count-1}\\). Substitute and simplify: \\(\\frac{${least}+(${least}+${count-1})}{2}=\\frac{2${least}+${count-1}}{2}=${answer}\\).`};return {question,variant};
}

export const algebraPlannerPractice=[
  {...decimalCoefficientTemplate,generate:generateDecimalCoefficient},{...substitutionTemplate,generate:generateSubstitution},{...distributedInequalityTemplate,generate:generateDistributedInequality},{...absoluteGraphTemplate,generate:generateAbsoluteGraph},
  {...combiningGroupsTemplate,generate:generateCombiningGroups},{...compoundGraphTemplate,generate:generateCompoundGraph},{...expressionSumTemplate,generate:generateExpressionSum},{...consecutiveAverageTemplate,generate:generateConsecutiveAverage},
];
