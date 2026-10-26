import type { ExamContent, ExamQuestion } from "./examTypes";
import type { ExamResult, SelectedAnswer, SelectedAnswers } from "./examGrading";
import { isExamQuestionCorrect } from "./examGrading";
import type { PlanAssignment } from "./learningPlan";
import type { MathCatalogFilters, MathQuestionRecord } from "./mathCommandTypes";
import { findMathDuplicates, mathAnswerStatus } from "./mathCommandCatalog";
import type { AnswerSheet, SheetGrade } from "./answerSheets";

export type MathEvidenceStatus = "correct" | "incorrect" | "unanswered" | "pending";
export type MathWeaknessRules = { targetAccuracy: number; minAttempts: number; minUniqueQuestions: number; minAssessments: number; recentDays: number; recentMinAttempts: number; trendMinAttempts: number; trendDifference: number };
export const defaultMathWeaknessRules: MathWeaknessRules = { targetAccuracy: 70, minAttempts: 5, minUniqueQuestions: 3, minAssessments: 2, recentDays: 90, recentMinAttempts: 3, trendMinAttempts: 3, trendDifference: 10 };
export type MathAttemptEvidence = {
  id: string; studentId: string; questionId: string; assessmentId: string; assessmentTitle: string;
  questionNumber: number; attemptId: string; at: string | null; answer: SelectedAnswer | null;
  correctAnswer: SelectedAnswer | null; status: MathEvidenceStatus; category: string; subcategory: string;
  diagnosticSkill: string; prompt: string; question: ExamQuestion; previouslyAttempted: boolean; source: string; gradingBasis: "saved_snapshot" | "released_grade" | "current_key";
};
export type MathQuestionMetrics = { attempts: number; answeredAttempts: number; uniqueStudents: number; correct: number; incorrect: number; unanswered: number; pending: number; accuracy: number | null; firstAttemptAccuracy: number | null; lastAttemptedAt: string | null; answerDistribution: {answer: string; attempts: number; students: number; correct: boolean | null}[]; signals: string[] };
export type MathSkillMetrics = { id: string; label: string; level: "category" | "subcategory" | "skill"; category: string; subcategory: string; diagnosticSkill: string; correct: number; total: number; accuracy: number | null; unanswered: number; pending: number; uniqueQuestions: number; assessments: number; recentCorrect: number; recentTotal: number; recentAccuracy: number | null; trend: "Improving" | "Declining" | "Stable" | "Insufficient data"; needsAttention: boolean; reason: string; progression: {assessmentId: string; title: string; at: string | null; correct: number; total: number; accuracy: number | null}[] };
export type MathRemainingCounts = {total:number;ready:number;seen:number;assigned:number;planned:number;completed:number;remaining:number;unready:number};
export type MathStudentInsights = { student: {id: string; fullName: string; insightsHref: string}; rules: MathWeaknessRules; summary: MathQuestionMetrics; skills: MathSkillMetrics[]; assessments: {assessmentId: string; title: string; at: string | null; correct: number; total: number; accuracy: number | null}[]; remaining: (MathRemainingCounts & {category:string;subcategory:string})[]; remainingBreakdowns:{difficulty:(MathRemainingCounts & {label:string})[];source:(MathRemainingCounts & {label:string})[]}; questionStates: Record<string,{seen:boolean;correct:boolean;incorrect:boolean;unanswered:boolean;assigned:boolean;planned:boolean;completed:boolean}>; availableEvidence: number; warnings: string[] };
export type MathEvidencePage = {items: MathAttemptEvidence[]; total: number; page: number; pageSize: number};
export type MathAssignmentRules = { questionIds?: string[]; catalogFilters?: MathCatalogFilters; category?: string; subcategory?: string; diagnosticSkill?: string; skillId?: string; difficulties?: string[]; count?: number; quotas?: Partial<Record<"easy" | "medium" | "hard" | "expert", number>>; excludeSeen?: boolean; reviewCount?: number };
export type MathAssignmentPreview = {previewToken: string; studentId: string; questionIds: string[]; questions: {id: string; prompt: string; category: string; subcategory: string; diagnosticSkill: string; difficulty: string | null; previouslySeen: boolean; source: string}[]; requested: number; selected: number; shortfall: number; warnings: string[]; rules: MathAssignmentRules; expiresAt: string};
export type MathPracticeView = {assignment: Pick<PlanAssignment, "id" | "title" | "instructions" | "status" | "dueDate" | "studentId">; questions: ExamQuestion[]; answers: SelectedAnswers; status: "not_started" | "in_progress" | "completed"; revision: number; startedAt: string | null; savedAt: string | null; result?: ExamResult};
export type MathQuestionSource = MathQuestionRecord;

export function validMathRules(input: Partial<MathWeaknessRules> = {}): MathWeaknessRules {
  const rules = {...defaultMathWeaknessRules};
  for (const key of Object.keys(rules) as (keyof MathWeaknessRules)[]) {
    const value = input[key]; if (value === undefined) continue;
    const max = key === "targetAccuracy" || key === "trendDifference" ? 100 : key === "recentDays" ? 3650 : 1000;
    const min = key === "targetAccuracy" || key === "trendDifference" ? 0 : 1;
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid ${key}: enter a whole number from ${min} to ${max}.`);
    rules[key] = value;
  }
  return rules;
}
export function mathCorrectAnswer(q: ExamQuestion): SelectedAnswer | null {
  if (["multiple_choice", "transition_drop"].includes(q.type) && !q.dragDropSlots?.length) return q.correctChoiceId || null;
  if (q.type === "multi_select") return q.correctChoiceIds?.length ? q.correctChoiceIds : null;
  if (q.type === "graph_point_select") return q.correctPointIds?.length ? q.correctPointIds : null;
  if (["short_response", "numeric_entry", "expression_entry", "grid_in"].includes(q.type)) return q.correctTextAnswers?.filter(x => x.trim()).join(" or ") || null;
  if (q.type === "math_drag_drop" || q.type === "transition_drop") return q.dragDropSlots?.length && q.dragDropSlots.every(x => x.correctItemId) ? Object.fromEntries(q.dragDropSlots.map(x=>[x.id,x.correctItemId])) : null;
  if (q.type === "inline_dropdown") return q.dropdowns?.length && q.dropdowns.every(x=>x.correctChoiceId) ? Object.fromEntries(q.dropdowns.map(x=>[x.id,x.correctChoiceId!])) : null;
  if (q.type === "number_line_response") return q.numberLineResponse?.correctValue != null ? {value:String(q.numberLineResponse.correctValue),direction:q.numberLineResponse.correctDirection,endpoint:q.numberLineResponse.correctEndpoint} : null;
  return q.correctPlacements && Object.keys(q.correctPlacements).length ? q.correctPlacements : null;
}
export const mathAnswerPresent = (answer: unknown): boolean => typeof answer === "string" ? Boolean(answer.trim()) : Array.isArray(answer) ? answer.length > 0 : Boolean(answer && typeof answer === "object" && Object.values(answer).some(mathAnswerPresent));
const percent = (correct: number, total: number) => total ? Math.round(correct / total * 1000) / 10 : null;
const chronological = (a: MathAttemptEvidence, b: MathAttemptEvidence) => (a.at ?? "9999").localeCompare(b.at ?? "9999") || a.id.localeCompare(b.id);

/** Historical question snapshots retain the key actually used, even after content edits. */
export function mathEvidenceFromResults(studentId: string, results: Partial<ExamResult>[], catalog: MathQuestionSource[], contentFor: (id: string) => ExamContent | null): MathAttemptEvidence[] {
  const byId = new Map(catalog.map(row => [row.id, row]));
  const deduplicated = new Map<string, Partial<ExamResult>>();
  for (const result of results) {
    if (!result.assessmentId || !result.answers || typeof result.answers !== "object") continue;
    if (result.completedSections?.length ? !result.completedSections.includes("math") : result.completionStatus === "english_complete") continue;
    const attempt = result.attemptId || `legacy:${result.assessmentId}:${result.completedAt || "undated"}`;
    deduplicated.set(`${result.assessmentId}:${attempt}`, result);
  }
  const evidence: MathAttemptEvidence[] = [];
  for (const result of deduplicated.values()) {
    // Released paper answer sheets keep their mapping snapshot and grades nested.
    // Respect that saved release, including manual/pending grading decisions.
    const sheet = (result as Partial<ExamResult> & {answerSheet?: {analysisContent?: ExamContent; grade?: SheetGrade; mapping?: AnswerSheet["mapping"]}}).answerSheet;
    const content = result.analysisContent || sheet?.analysisContent || contentFor(result.assessmentId!);
    if (!content?.mathSection?.questions) continue;
    const attemptId = result.attemptId || `legacy:${result.assessmentId}:${result.completedAt || "undated"}`;
    const rawDate = result.sectionCompletedAt?.math ?? result.completedAt;
    const at = rawDate && Number.isFinite(Date.parse(rawDate)) ? rawDate : null;
    content.mathSection.questions.forEach((question, index) => {
      const current = byId.get(question.id), answer = result.answers![question.id] ?? null;
      const correctAnswer = mathCorrectAnswer(question);
      const mappedItem = sheet?.mapping?.items.find(item => item.questionId === question.id);
      const releasedStatus = mappedItem && sheet?.grade?.items.find(item => item.itemId === mappedItem.itemId)?.status;
      const status: MathEvidenceStatus = releasedStatus || (correctAnswer === null || !mathAnswerStatus(question).valid ? "pending" : !mathAnswerPresent(answer) ? "unanswered" : isExamQuestionCorrect(question, answer ?? undefined) ? "correct" : "incorrect");
      evidence.push({id:`${studentId}:${result.assessmentId}:${attemptId}:${question.id}`,studentId,questionId:question.id,assessmentId:result.assessmentId!,assessmentTitle:result.title || content.title,questionNumber:index+1,attemptId,at,answer,correctAnswer,status,category:current?.question.topic || question.topic || "",subcategory:current?.question.subtopic || question.subtopic || "",diagnosticSkill:String(current?.metadata?.diagnosticSkill || ""),prompt:question.prompt,question,previouslyAttempted:false,source:result.source || "digital",gradingBasis:releasedStatus?"released_grade":result.analysisContent||sheet?.analysisContent?"saved_snapshot":"current_key"});
    });
  }
  const seen = new Set<string>();
  return evidence.sort(chronological).map(row => { const key=`${row.studentId}:${row.questionId}`; const repeat=seen.has(key); seen.add(key); return {...row,previouslyAttempted:repeat}; });
}

export function mathQuestionMetrics(rows: MathAttemptEvidence[], sampleMinimum = 10): MathQuestionMetrics {
  const scored = rows.filter(row=>row.status!=="pending"), correct=scored.filter(row=>row.status==="correct").length;
  const incorrect=scored.filter(row=>row.status==="incorrect").length, unanswered=scored.filter(row=>row.status==="unanswered").length;
  const first = new Map<string,MathAttemptEvidence>();
  for(const row of [...rows].sort(chronological)) if(!first.has(`${row.studentId}:${row.questionId}`)) first.set(`${row.studentId}:${row.questionId}`,row);
  const firstScored=[...first.values()].filter(row=>row.status!=="pending");
  const distribution = new Map<string,{attempts:number;students:Set<string>;correct:boolean|null}>();
  for(const row of rows.filter(row=>mathAnswerPresent(row.answer))) {
    const answer = typeof row.answer === "string" ? row.answer : JSON.stringify(row.answer);
    const entry=distribution.get(answer)||{attempts:0,students:new Set<string>(),correct:null}; entry.attempts++; entry.students.add(row.studentId);
    const correctness=row.status==="pending"?null:row.status==="correct";
    entry.correct=entry.attempts===1?correctness:entry.correct===correctness?correctness:null; distribution.set(answer,entry);
  }
  const accuracy=percent(correct,scored.length), signals:string[]=[];
  const uniqueStudents=new Set(rows.map(row=>row.studentId)).size;
  if(new Set(scored.map(row=>row.studentId)).size>=sampleMinimum) {
    if(accuracy!==null && accuracy<25) signals.push(`${correct}/${scored.length} scored responses correct (${accuracy}%). Review signal; minimum ${sampleMinimum} students.`);
    if(unanswered/scored.length>=0.3) signals.push(`${unanswered}/${scored.length} scored responses unanswered.`);
    if(distribution.size===1 && [...distribution.values()][0].correct===false) signals.push("Every recorded answer selected the same incorrect response. Inspect the question and key.");
  }
  return {attempts:rows.length,answeredAttempts:rows.filter(row=>mathAnswerPresent(row.answer)).length,uniqueStudents,correct,incorrect,unanswered,pending:rows.length-scored.length,accuracy,firstAttemptAccuracy:percent(firstScored.filter(row=>row.status==="correct").length,firstScored.length),lastAttemptedAt:rows.flatMap(row=>row.at?[row.at]:[]).sort().at(-1)??null,answerDistribution:[...distribution].map(([answer,value])=>({answer,attempts:value.attempts,students:value.students.size,correct:value.correct})).sort((a,b)=>b.attempts-a.attempts),signals};
}

export function mathSkillMetrics(rows: MathAttemptEvidence[], rules: MathWeaknessRules, now = Date.now()): MathSkillMetrics[] {
  const groups=new Map<string,{level:MathSkillMetrics["level"]; label:string; rows:MathAttemptEvidence[]}>();
  for(const row of rows) for(const [level,label,id] of [["category",row.category,`category:${row.category}`],["subcategory",row.subcategory,`subcategory:${row.category}:${row.subcategory}`],["skill",row.diagnosticSkill,`skill:${row.diagnosticSkill}`]] as const) {
    if(!label) continue; const group=groups.get(id)||{level,label,rows:[]}; group.rows.push(row);groups.set(id,group);
  }
  return [...groups].map(([id,group])=>{
    const all=group.rows, scored=all.filter(row=>row.status!=="pending").sort(chronological), correct=scored.filter(row=>row.status==="correct").length;
    const recent=scored.filter(row=>row.at && Date.parse(row.at)>=now-rules.recentDays*86400000), recentCorrect=recent.filter(row=>row.status==="correct").length;
    const assessments=new Map<string,MathAttemptEvidence[]>();for(const row of scored){const key=`${row.assessmentId}:${row.attemptId}`;assessments.set(key,[...(assessments.get(key)||[]),row]);}
    const progression=[...assessments.values()].map(items=>({assessmentId:items[0].assessmentId,title:items[0].assessmentTitle,at:items[0].at,correct:items.filter(row=>row.status==="correct").length,total:items.length,accuracy:percent(items.filter(row=>row.status==="correct").length,items.length)})).sort((a,b)=>(a.at??"9999").localeCompare(b.at??"9999"));
    const uniqueQuestions=new Set(scored.map(row=>row.questionId)).size, assessmentCount=new Set(scored.map(row=>row.assessmentId)).size, accuracy=percent(correct,scored.length), recentAccuracy=percent(recentCorrect,recent.length);
    const eligible=progression.filter(item=>item.at && item.total>=rules.trendMinAttempts);
    let trend:MathSkillMetrics["trend"]="Insufficient data";
    if(new Set(eligible.map(row=>row.assessmentId)).size>=2) {const delta=eligible.at(-1)!.accuracy!-eligible[0].accuracy!;trend=delta>=rules.trendDifference?"Improving":delta<=-rules.trendDifference?"Declining":"Stable";}
    const sufficient=scored.length>=rules.minAttempts&&uniqueQuestions>=rules.minUniqueQuestions&&assessmentCount>=rules.minAssessments&&recent.length>=rules.recentMinAttempts;
    const needsAttention=sufficient&&accuracy!==null&&accuracy<rules.targetAccuracy;
    const reason=needsAttention?`${correct}/${scored.length} correct (${accuracy}%), below the configured ${rules.targetAccuracy}% target; ${uniqueQuestions} distinct questions, ${assessmentCount} assessments, ${recent.length} recent responses.`:sufficient?`At or above the configured ${rules.targetAccuracy}% target.`:`Limited evidence: needs ${rules.minAttempts} scored responses, ${rules.minUniqueQuestions} distinct questions, ${rules.minAssessments} assessments, and ${rules.recentMinAttempts} responses in ${rules.recentDays} days.`;
    return {id,label:group.label,level:group.level,category:all[0].category,subcategory:group.level==="category"?"":all[0].subcategory,diagnosticSkill:group.level==="skill"?all[0].diagnosticSkill:"",correct,total:scored.length,accuracy,unanswered:all.filter(row=>row.status==="unanswered").length,pending:all.length-scored.length,uniqueQuestions,assessments:assessmentCount,recentCorrect,recentTotal:recent.length,recentAccuracy,trend,needsAttention,reason,progression};
  }).sort((a,b)=>Number(b.needsAttention)-Number(a.needsAttention)||(a.accuracy??101)-(b.accuracy??101)||a.label.localeCompare(b.label));
}

export function selectMathAssignment(catalog: MathQuestionSource[], seenIds: Set<string>, assignedIds: Set<string>, rules: MathAssignmentRules) {
  if(!rules||typeof rules!=="object"||Array.isArray(rules))throw new Error("Choose assignment selection rules.");
  const count=rules.count??10;if(!Number.isInteger(count)||count<1||count>100)throw new Error("Choose 1–100 questions.");
  if(rules.questionIds&&(!Array.isArray(rules.questionIds)||rules.questionIds.length>100||rules.questionIds.some(id=>typeof id!=="string")))throw new Error("Choose at most 100 existing question IDs.");
  const reviewCount=rules.reviewCount??0;if(!Number.isInteger(reviewCount)||reviewCount<0||reviewCount>count)throw new Error("Review count must be between zero and the requested count.");
  const families=new Map<string,string>();
  // Numeric templates and merely similar questions remain distinct; exact copies do not.
  for(const group of findMathDuplicates(catalog).groups.filter(group=>group.kind==="exact"))for(const id of group.questionIds)families.set(id,group.id);
  const family=(id:string)=>families.get(id)??id;
  const seenFamilies=new Set([...seenIds,...assignedIds].map(family));
  const alreadySeen=(id:string)=>seenFamilies.has(family(id));
  const unique=(rows:MathQuestionSource[])=>rows.filter((row,index)=>rows.findIndex(other=>family(row.id)===family(other.id))===index);
  let pool=catalog.filter(row=>mathCorrectAnswer(row.question)!==null&&row.question.prompt.trim()&&row.metadata?.reviewStatus!=="needs_review");
  if(rules.category)pool=pool.filter(row=>row.question.topic===rules.category);
  if(rules.subcategory)pool=pool.filter(row=>row.question.subtopic===rules.subcategory);
  if(rules.diagnosticSkill||rules.skillId)pool=pool.filter(row=>row.metadata?.diagnosticSkill===(rules.diagnosticSkill||rules.skillId));
  if(rules.difficulties?.length)pool=pool.filter(row=>rules.difficulties!.includes(String(row.metadata?.difficulty??"")));
  pool.sort((a,b)=>a.id.localeCompare(b.id));
  const selected:MathQuestionSource[]=[],warnings:string[]=[];
  if(rules.questionIds?.length) {
    if(new Set(rules.questionIds).size!==rules.questionIds.length)throw new Error("The selection contains duplicate question IDs.");
    let encountered=0;
    for(const id of rules.questionIds){const row=pool.find(item=>item.id===id);if(!row)throw new Error(`Question ${id} is unavailable or does not match the selection rules.`);if(selected.some(item=>family(item.id)===family(id)))throw new Error("The selection contains exact copies of the same question. Keep one version.");if(alreadySeen(id))encountered++;if(rules.excludeSeen!==false&&encountered>reviewCount)throw new Error(`Question ${id} was already seen or assigned, including exact copies. Increase intentional review to include it.`);selected.push(row);}
  } else {
    const fresh=unique(pool.filter(row=>!alreadySeen(row.id))), review=unique(pool.filter(row=>alreadySeen(row.id)));
    const candidates=rules.excludeSeen===false?[...fresh,...review]:fresh;
    const quotas=rules.quotas && Object.keys(rules.quotas).length?rules.quotas:null;
    if(quotas){let total=0;for(const [difficulty,quantity]of Object.entries(quotas)){if(!["easy","medium","hard","expert"].includes(difficulty)||!Number.isInteger(quantity)||quantity!<0||quantity!>100)throw new Error("Difficulty quotas must be whole numbers from 0–100.");total+=quantity!;}if(total!==count)throw new Error("Difficulty quotas must add up to the requested question count.");
      for(const [difficulty,quantity]of Object.entries(quotas)){const matches=candidates.filter(row=>row.metadata?.difficulty===difficulty);selected.push(...matches.slice(0,quantity));if(matches.length<quantity!)warnings.push(`${difficulty}: ${quantity!} requested, ${matches.length} available.`);}
    } else selected.push(...candidates.slice(0,count-reviewCount));
    if(reviewCount){if(quotas)throw new Error("Use either difficulty quotas or a separate intentional-review count.");selected.push(...review.filter(row=>!selected.some(item=>item.id===row.id)).slice(0,reviewCount));}
  }
  const requested=rules.questionIds?.length||count,shortfall=Math.max(0,requested-selected.length);
  if(shortfall)warnings.push(`${shortfall} fewer questions than requested. No question was invented, repeated, or silently substituted.`);
  return {selected,requested,shortfall,warnings};
}
