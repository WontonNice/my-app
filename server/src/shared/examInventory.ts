import type { ExamContent, ExamQuestion } from './examTypes';
import { isExamQuestionCorrect, type ExamResult } from './examGrading';
import { mathAnswerPresent } from "./mathCommandAnalytics";
import { orderedEnglishQuestions, orderByQuestionIds } from './examQuestionOrder';
import { submittedExamSections } from './examCompletion';
import { mathAnswerStatus, mathPlainText } from './mathCommandCatalog';
import type { AnswerSheet, SheetGrade } from './answerSheets';
import type { MathCatalogRow } from './mathCommandTypes';

export type QuestionRate = { correct:number; total:number };
export type ExamInventoryRow = {
  id:string; plannerId:string; number:number; subject:'English'|'Math'; prompt:string;
  category:string; subcategory:string; skill:string; tei:boolean;
};
export function examInventoryRows(exam:ExamContent, mathRows:Map<string,MathCatalogRow>, canonical:Map<string,string>):ExamInventoryRow[] {
  const english=orderedEnglishQuestions(exam).map(({question,kind,passageIndex})=>{
    const section=kind==='standalone'?'Revising/Editing Part B':(exam.passageSections?.[exam.passageSets[passageIndex].id]??exam.passageSets[passageIndex].section)==='revising_editing_a'?'Revising/Editing Part A':'Reading';
    return {question,section};
  });
  const describe=(q:ExamQuestion)=>({id:q.id,prompt:mathPlainText(q.promptHtml||q.prompt),tei:Boolean(q.selectionHtml || q.hotSpot)||!['multiple_choice','grid_in','essay'].includes(q.type)});
  return [
    ...english.map(({question:q,section},i)=>({...describe(q),plannerId:q.id,number:i+1,subject:'English' as const,category:section,subcategory:q.topic||'',skill:q.subtopic||q.skilled||''})),
    ...orderByQuestionIds(exam.mathSection?.questions??[],exam.questionOrder).map((q,i)=>{
      const plannerId=canonical.get(q.id)??q.id,row=mathRows.get(plannerId);
      return {...describe(q),plannerId,number:i+1,subject:'Math' as const,category:row?.category??q.topic??'',subcategory:row?.subcategory??q.subtopic??'',skill:row?.skilledLabel&&row.skilledLabel!=='TBD'?row.skilledLabel:row?.diagnosticSkill||''};
    }),
  ];
}

/** Compute rates from submitted question-level evidence. Each student's first scored
 * response counts once across all confirmed copies, with historical keys and released paper grades. */
export function examQuestionRates(byStudent:Map<string,Partial<ExamResult>[]>,contents:Record<string,ExamContent>,canonical:Map<string,string>) {
  const totals:Record<string,QuestionRate>=Object.create(null);
  for(const results of byStudent.values()){
    const first=new Map<string,{date:number;correct:boolean}>();
    for(const result of results){
      if(!result.answers||result.source==='manual'||!result.assessmentId)continue;
      const sheet=(result as {answerSheet?:{analysisContent?:ExamContent;mapping?:AnswerSheet['mapping'];grade?:SheetGrade}}).answerSheet;
      const exam=result.analysisContent??sheet?.analysisContent??contents[result.assessmentId];
      if(!exam)continue;
      const sections=submittedExamSections(result);
      for(const section of sections){
        const questions=section==='math'?orderByQuestionIds(exam.mathSection?.questions??[],exam.questionOrder):orderedEnglishQuestions(exam).map(i=>i.question);
        const stamp=Date.parse(result.sectionCompletedAt?.[section]??result.completedAt??'');
        const date=Number.isFinite(stamp)?stamp:Infinity;
        for(const q of questions){
          const mapped=sheet?.mapping?.items.find(item=>item.questionId===q.id);
          const grade=mapped&&sheet?.grade?.items.find(item=>item.itemId===mapped.itemId);
          if(sheet ? (!grade||grade.status==='pending'||grade.status==='unanswered') : (!mathAnswerPresent(result.answers[q.id])||!mathAnswerStatus(q).valid))continue;
          const key=JSON.stringify([section,section==='math'?canonical.get(q.id)??q.id:q.id]),old=first.get(key);
          if(!old||date<old.date)first.set(key,{date,correct:grade?grade.status==='correct':isExamQuestionCorrect(q,result.answers[q.id])});
        }
      }
    }
    for(const [key,value] of first){
      const rate=totals[key]??={correct:0,total:0};rate.total++;rate.correct+=Number(value.correct);
    }
  }
  return totals;
}
