import type {ExamContent,ExamQuestion} from './examTypes';

const grading = ['type','correctChoiceId','correctChoiceIds','correctTextAnswers','correctPlacements','correctPointIds','requiredSelections','requiredPlacements','points','textMatchMode','categoryCapacity','allowReuse','dragDropSlots'] as const;
const textEntry = (question:ExamQuestion):ExamQuestion['entryControl'] => question.type==='short_response' ? 'text' : question.type==='expression_entry' ? 'expression' : ['numeric_entry','grid_in'].includes(question.type) ? 'numeric' : undefined;
const editableBase = (question:ExamQuestion) => JSON.stringify(Object.fromEntries(Object.entries(question).filter(([key])=>!['source','topic','subtopic','skilled','explanation','explanationHtml'].includes(key))));

/** A later canonical edit invalidates the stored display snapshot instead of hiding the edit. */
export function applyExamPresentation(content:ExamContent):ExamContent {
  const overrides=content.presentationOverrides;
  if(!overrides)return content;
  const question=(current:ExamQuestion):ExamQuestion=>{
    const override=overrides.questions?.[current.id];
    if(!override || editableBase(current)!==editableBase(override.base))return current;
    // Source typography may improve; grading and response IDs retain the saved contract.
    const merged={...override.question,id:current.id,topic:current.topic,subtopic:current.subtopic,skilled:current.skilled};
    for(const key of ['explanation','explanationHtml'] as const) {
      if(current[key]!==override.base[key]) {
        if(current[key]===undefined)delete merged[key];
        else merged[key]=current[key];
      }
    }
    for(const key of grading) {
      if(current[key]===undefined)delete merged[key];
      else Object.assign(merged,{[key]:current[key]});
    }
    // These controls all persist string answers. Keep historical grading while
    // displaying the source keypad or text field independently of its type name.
    if(textEntry(current)&&textEntry(override.question))merged.entryControl=override.question.entryControl||textEntry(override.question);
    else if(current.entryControl===undefined)delete merged.entryControl;
    else merged.entryControl=current.entryControl;
    if(current.numberLineResponse)merged.numberLineResponse={
      ...current.numberLineResponse,...merged.numberLineResponse,
      correctValue:current.numberLineResponse.correctValue,
      correctEndpoint:current.numberLineResponse.correctEndpoint,
      correctDirection:current.numberLineResponse.correctDirection,
    };
    else delete merged.numberLineResponse;
    if(current.dropdowns)merged.dropdowns=merged.dropdowns?.map(dropdown=>({...dropdown,correctChoiceId:current.dropdowns?.find(original=>original.id===dropdown.id)?.correctChoiceId}));
    return merged;
  };
  return {...content,
    passageSets:content.passageSets.map(set=>{
      const override=overrides.passages?.[set.passage.id];
      const passage=override && JSON.stringify(set.passage.lines)===JSON.stringify(override.baseLines) ? {...override.passage,id:set.passage.id} : set.passage;
      return {...set,passage,questions:set.questions.map(question)};
    }),
    ...(content.standaloneSection ? {standaloneSection:{...content.standaloneSection,questions:content.standaloneSection.questions.map(question)}} : {}),
    ...(content.mathSection ? {mathSection:{...content.mathSection,questions:content.mathSection.questions.map(question)}} : {}),
  };
}
