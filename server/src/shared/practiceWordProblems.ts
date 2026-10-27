import type { ExamQuestion } from './examTypes';

// Coprime affine permutations visit every stem once before starting another cycle.
function sequence(index:number,seed:string,count:number) {
  if(!Number.isSafeInteger(index)||index<0)throw new Error('Question index must be a nonnegative safe integer.');
  let hash=0;for(const char of seed)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  return ((index%count)*101+hash%count)%count;
}
function choices(answer:number,distractors:number[],variant:number,format:(value:number)=>{text:string;math?:string}) {
  const values=[...new Set([answer,...distractors])].slice(0,4);
  if(values.length!==4)throw new Error('A question needs four distinct choices.');
  const rotation=variant%4,ordered=values.slice(rotation).concat(values.slice(0,rotation));
  return {choices:ordered.map((value,at)=>({id:'ABCD'[at],...format(value)})),correctChoiceId:'ABCD'[ordered.indexOf(answer)]};
}
function base(id:string,index:number,seed:string,category:string,topic:string) {
  return {id:`${id}:${seed}:${index}`,points:1,topic:category,subtopic:topic};
}
const ratioCategory='Ratios and Proportional Relationships';

export const surveyTotalsTemplate={
  id:'overlapping-survey-totals-v1',sourceId:'2025-2026-form-a-math-5',
  moduleId:'2021-2022-form-a-q76',
  title:'Overlapping Groups: Survey Totals',category:'Statistics and Probability',topic:'Overlapping Groups',
  description:'Based on 2025–2026 Form A math item 5. Subtract a survey overlap once and include those in neither group to find the total.',
  distinctCount:35*35*21*16*3,
};
const surveyContexts=[
  {intro:'A survey asked students what pets they have.',a:'cats',b:'dogs',both:'dogs and cats',neither:'no dogs or cats'},
  {intro:'A survey asked students which school supplies they have.',a:'notebooks',b:'folders',both:'folders and notebooks',neither:'no folders or notebooks'},
  {intro:'A survey asked students which sports equipment they have.',a:'basketballs',b:'tennis rackets',both:'tennis rackets and basketballs',neither:'no tennis rackets or basketballs'},
];
export function generateSurveyTotals(index:number,seed='survey-totals') {
  const template=surveyTotalsTemplate,variant=sequence(index,seed,template.distinctCount);let rank=variant;
  const contextIndex=rank%3;rank=Math.floor(rank/3);
  const onlyA=rank%35+1;rank=Math.floor(rank/35);
  const onlyB=rank%35+1;rank=Math.floor(rank/35);
  const both=rank%21;rank=Math.floor(rank/21);
  const neither=rank,groupA=onlyA+both,groupB=onlyB+both,total=onlyA+onlyB+both+neither,c=surveyContexts[contextIndex];
  const introduction=`${c.intro} Based on the results, the following statements are all true:`;
  const facts=[`${groupA} students have ${c.a}.`,`${groupB} students have ${c.b}.`,`${both} students have both ${c.both}.`,`${neither} students have ${c.neither}.`];
  const question:ExamQuestion={...base(template.id,index,seed,template.category,template.topic),type:'short_response',instructions:'Enter your answer in the space.',
    prompt:`${introduction}\n\n${facts.map(fact=>`. ${fact}`).join('\n')}\n\nHow many students were surveyed?`,
    promptHtml:`${introduction}<ul>${facts.map(fact=>`<li>${fact}</li>`).join('')}</ul><p>How many students were surveyed?</p>`,
    correctTextAnswers:[String(total)],
    explanation:`The students in both groups are counted twice when adding the two group counts. Subtract the overlap once, then add the students in neither group.\n\\[${groupA}+${groupB}-${both}+${neither}=${total}\\]\n\nTherefore, ${total} students were surveyed. Check: ${onlyA} in only the first group, ${onlyB} in only the second group, ${both} in both, and ${neither} in neither add to ${total}.`,
  };
  return {question,variant,contextIndex,groupA,groupB,both,neither,total};
}

export const remainingReadingTemplate={
  id:'remaining-reading-time-v1',sourceId:'2021-2022-form-a-q95',
  title:'Rates: Remaining Reading Time',category:ratioCategory,topic:'Rates & Unit Rates',
  description:'Based on 2021–2022 Form A Q95. Use a constant reading rate to find additional time, expressed in hours.',
  distinctCount:8*19*96*4,
};
const readingRates=[[1,2],[2,3],[3,4],[1,1],[3,2],[2,1],[5,2],[3,1]] as const;
const names=['Ryan','Maya','Elena','Noah'];
function gcd(a:number,b:number):number{return b?gcd(b,a%b):a;}
function hours(minutes:number) {
  const whole=Math.floor(minutes/60),remainder=minutes%60,divisor=gcd(remainder,60);
  const fraction=remainder?`${remainder/divisor}/${60/divisor}`:'';
  const text=(whole?String(whole)+(fraction?' ':''):'')+fraction;
  const math=(whole?String(whole):'')+(fraction?`\\frac{${remainder/divisor}}{${60/divisor}}`:'');
  return {text:`${text||'0'} hr`,math:`${math||'0'}\\text{ hr}`};
}
export function generateRemainingReading(index:number,seed='remaining-reading') {
  const template=remainingReadingTemplate,variant=sequence(index,seed,template.distinctCount);let rank=variant;
  const name=names[rank%4];rank=Math.floor(rank/4);
  const [numerator,denominator]=readingRates[rank%8];rank=Math.floor(rank/8);
  const completedUnits=rank%19+2,remainingUnits=Math.floor(rank/19)+5;
  const completedPages=completedUnits*denominator,remainingPages=remainingUnits*denominator,totalPages=completedPages+remainingPages;
  const elapsedMinutes=completedUnits*numerator,additionalMinutes=remainingUnits*numerator,totalMinutes=elapsedMinutes+additionalMinutes;
  const answerChoices=choices(additionalMinutes,[totalMinutes,remainingPages,elapsedMinutes,additionalMinutes*2,additionalMinutes+60,additionalMinutes+15,additionalMinutes+30],variant,hours);
  const prompt=`${name} must read ${totalPages} pages for school this weekend. It took ${name==='Ryan'||name==='Noah'?'him':'her'} ${elapsedMinutes} minutes to read the first ${completedPages} pages. At this rate, how much additional time will it take ${name==='Ryan'||name==='Noah'?'him':'her'} to finish the reading?`;
  const question:ExamQuestion={...base(template.id,index,seed,template.category,template.topic),type:'multiple_choice',prompt,promptHtml:prompt.replace('additional','<strong>additional</strong>'),...answerChoices,
    explanation:`First find the pages still to read: ${totalPages} − ${completedPages} = ${remainingPages}.\n\nUse the given time per page for only the remaining pages:\n\\[${remainingPages}\\times\\frac{${elapsedMinutes}}{${completedPages}}=${additionalMinutes}\\text{ minutes}\\]\n\nConvert minutes to hours by dividing by 60:\n\\[\\frac{${additionalMinutes}}{60}=${hours(additionalMinutes).math}\\]\n\nThe additional time is ${hours(additionalMinutes).text}. The ${elapsedMinutes} minutes already spent reading are not part of the additional time.`,
  };
  return {question,variant,completedPages,remainingPages,totalPages,elapsedMinutes,additionalMinutes};
}

export const mixtureRatiosTemplate={
  id:'ratio-mixture-amounts-v1',sourceId:'2021-2022-form-a-q114',
  title:'Ratios: Mixture Amounts',category:ratioCategory,topic:'Ratios & Proportions',
  description:'Based on 2021–2022 Form A Q114. Find one ingredient’s share of a mixture needed for several projects.',
  distinctCount:6**4*8*11*3,
};
const mixtures=[
  {intro:'A paste used to cover a billboard',ingredients:['powder','water','resin','hardener'],action:'cover',unit:'billboard'},
  {intro:'A soil mixture used to fill a planter',ingredients:['compost','sand','topsoil','gravel'],action:'fill',unit:'planter'},
  {intro:'A concrete mixture used to make a paving slab',ingredients:['cement','water','sand','gravel'],action:'make',unit:'paving slab'},
];
export function generateMixtureRatios(index:number,seed='mixture-ratios') {
  const template=mixtureRatiosTemplate,variant=sequence(index,seed,template.distinctCount);let rank=variant;
  const contextIndex=rank%3,c=mixtures[contextIndex];rank=Math.floor(rank/3);
  const parts=Array.from({length:4},()=>{const value=rank%6+1;rank=Math.floor(rank/6);return value;});
  const multiplier=rank%8+1,projects=Math.floor(rank/8)+2,totalParts=parts.reduce((sum,value)=>sum+value,0);
  const poundsPerProject=totalParts*multiplier,totalPounds=poundsPerProject*projects,answer=parts[2]*multiplier*projects;
  const ingredientText=parts.map((value,at)=>`${value} part${value===1?'':'s'} ${c.ingredients[at]}`);
  const prompt=`${c.intro} is made by mixing the following ingredients by weight:\n\n${ingredientText.slice(0,3).join(', ')}, and ${ingredientText[3]}. To ${c.action} one ${c.unit} requires ${poundsPerProject} pounds of this ${contextIndex===0?'paste':'mixture'}. How many total pounds of ${c.ingredients[2]} are required to ${c.action} ${projects} ${c.unit}s?`;
  const question:ExamQuestion={...base(template.id,index,seed,template.category,template.topic),type:'multiple_choice',prompt,
    ...choices(answer,[parts[2]*multiplier,parts[2]*projects,totalPounds,parts[0]*multiplier*projects,answer*2,answer+1],variant,value=>({text:String(value)})),
    explanation:`Add all the ratio parts: ${parts.join(' + ')} = ${totalParts}. ${c.ingredients[2][0].toUpperCase()+c.ingredients[2].slice(1)} accounts for ${parts[2]} of those ${totalParts} parts.\n\nThe ${projects} ${c.unit}s require ${poundsPerProject} × ${projects} = ${totalPounds} pounds in total.\n\\[${totalPounds}\\times\\frac{${parts[2]}}{${totalParts}}=${answer}\\]\n\nTherefore, ${answer} pounds of ${c.ingredients[2]} are needed.`,
  };
  return {question,variant,parts,totalParts,projects,poundsPerProject,totalPounds,answer,contextIndex};
}

export const wordProblemPractice=[
  {...surveyTotalsTemplate,generate:generateSurveyTotals},
  {...remainingReadingTemplate,generate:generateRemainingReading},
  {...mixtureRatiosTemplate,generate:generateMixtureRatios},
];
