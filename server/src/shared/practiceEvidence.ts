import {generatePracticeQuestion} from './infinitePractice';
import {generateCatalogQuestion} from './practiceCatalog';
import {isExamQuestionCorrect, type SelectedAnswer} from './examGrading';
import type {ExamQuestion} from './examTypes';
import type {PracticeState} from './practiceCheckpoint';

export type PracticeResponseEvidence={index:number;sequenceIndex:number;generatorId:string;question:ExamQuestion;answer:SelectedAnswer;correct:boolean;durationMs:number;submittedAt:string};
export type SavedPracticeEvidence=PracticeResponseEvidence & {moduleId:string;moduleTitle:string;seed:string;startedAt:number;generationVersion:number;sourceQuestionIds:string[]};
export function practiceGeneratorFor(state:PracticeState,sequence=state.sequenceIndex??state.index){
  let hash=0;if(!state.generatorDefinitions)for(const char of state.seed)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  return state.generatorIds[(sequence%state.generatorIds.length+hash%state.generatorIds.length)%state.generatorIds.length];
}
export function generatedPracticeInstance(state:PracticeState,sequence=state.sequenceIndex??state.index){
  const definition=state.generatorDefinitions?.find(item=>item.id===practiceGeneratorFor(state,sequence));
  return definition?generateCatalogQuestion(definition,Math.floor(sequence/state.generatorIds.length),state.seed,state.generationVersion??1):generatePracticeQuestion(state.generatorIds,sequence,state.seed,state.generationVersion??1);
}
export function practiceResponseEvidence(state:PracticeState):PracticeResponseEvidence{
  const question=generatedPracticeInstance(state);
  return {index:state.index,sequenceIndex:state.sequenceIndex??state.index,generatorId:practiceGeneratorFor(state),question,answer:structuredClone(state.answer),correct:isExamQuestionCorrect(question,state.answer),durationMs:state.questionMs,submittedAt:new Date().toISOString()};
}
export function validatePracticeEvidence(state:PracticeState):PracticeResponseEvidence[]{
  const seen=new Set<number>();
  return (state.responses??[]).map(row=>{
    if(!row||!Number.isSafeInteger(row.index)||row.index<0||row.index>=state.checked||seen.has(row.index)||!Number.isSafeInteger(row.sequenceIndex)||row.sequenceIndex<row.index||row.sequenceIndex>(state.sequenceIndex??state.index)||!Number.isSafeInteger(row.durationMs)||row.durationMs<0||!Number.isFinite(Date.parse(row.submittedAt))||JSON.stringify(row.answer).length>20000)throw new Error('Invalid saved practice response.');
    seen.add(row.index);
    const question=generatedPracticeInstance(state,row.sequenceIndex);
    if(row.generatorId!==practiceGeneratorFor(state,row.sequenceIndex)||JSON.stringify(row.question)!==JSON.stringify(question))throw new Error('The generated question version does not match this session. Keep the browser copy and retry with the matching runtime.');
    return {...row,question,correct:isExamQuestionCorrect(question,row.answer)};
  });
}
