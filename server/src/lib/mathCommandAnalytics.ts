import fs from "node:fs";
import path from "node:path";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { getEnrolledClassIds, getUserRole, isStudentArchived } from "./auth";
import { fromAssignmentRow, checkStorage } from "./learningPlanStore";
import { mathCommandRoot, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy } from "./mathCommandCatalogStore";
import { buildMathCommandCatalog } from "../shared/mathCommandCatalog";
import { mathCatalogSnapshot } from "./mathCommandCatalogService";
import { defaultMathWeaknessRules, mathEvidenceFromResults, mathQuestionMetrics, mathSkillMetrics, validMathRules, type MathAttemptEvidence, type MathStudentInsights, type MathQuestionSource, type MathRemainingCounts } from "../shared/mathCommandAnalytics";
import type { ExamContent } from "../shared/examTypes";
import type { ExamResult } from "../shared/examGrading";
import type { PlanAssignment } from "../shared/learningPlan";
import type { MathQuestionPerformance } from "../shared/mathCommandTypes";

type ResultRow = {user_id: string; assessment_id: string; result: Partial<ExamResult>};
export const mathCommandFail = (message: string, status = 400) => Object.assign(new Error(message), {status});
const checked = (error: unknown) => {if(error)throw mathCommandFail("Saved mathematics evidence is temporarily unavailable. Try again; missing storage is not zero performance.",503);};
export async function mathCommandStudents() {
  const students:User[]=[];
  for(let page=1;;page++){const result=await supabase.auth.admin.listUsers({page,perPage:1000});checked(result.error);students.push(...result.data.users.filter(user=>getUserRole(user)==="student"&&!isStudentArchived(user)&&getEnrolledClassIds(user.app_metadata).includes("shsat")));if(result.data.users.length<1000)return students;}
}
export async function mathCommandStudent(id: string) {
  if(!/^[a-f\d-]{36}$/i.test(id))throw mathCommandFail("Choose a valid student.");
  const found=await supabase.auth.admin.getUserById(id),student=found.data.user;
  if(found.error||!student||getUserRole(student)!=="student"||isStudentArchived(student)||!getEnrolledClassIds(student.app_metadata).includes("shsat"))throw mathCommandFail("Choose an active SHSAT student.",404);
  return student;
}
function contents() {return JSON.parse(fs.readFileSync(path.join(mathCommandRoot,"server/data/exam-content.json"),"utf8")) as Record<string,ExamContent>;}
export async function mathResultRows(studentId?: string):Promise<ResultRow[]> {
  const rows:ResultRow[]=[];
  for(let offset=0;;offset+=250){let query=supabase.from("student_exam_results").select("user_id,assessment_id,result").order("user_id").order("assessment_id");if(studentId)query=query.eq("user_id",studentId);const result=await query.range(offset,offset+249);checked(result.error);rows.push(...(result.data??[]).filter(row=>!row.assessment_id.startsWith("__")||row.assessment_id.startsWith("__exam_history__:")));if((result.data?.length??0)<250)return rows;}
}
type ResultVersion={user_id:string;assessment_id:string;updated_at?:string;completed_at?:string};
const resultPayloadCache=new Map<string,{version:string;row:ResultRow}>();
const resultKey=(row:ResultVersion)=>`${row.user_id}\0${row.assessment_id}`;
const resultVersion=(row:ResultVersion)=>`${row.updated_at??"legacy"}|${row.completed_at??""}`;
/** A cold process reads historical payloads once; subsequent refreshes fetch changed rows only. */
async function incrementalMathResultRows():Promise<ResultRow[]> {
  const versions:ResultVersion[]=[];
  for(let offset=0;;offset+=500){
    const result=await supabase.from("student_exam_results").select("user_id,assessment_id,updated_at,completed_at").order("user_id").order("assessment_id").range(offset,offset+499);checked(result.error);
    versions.push(...(result.data??[]).filter(row=>!row.assessment_id.startsWith("__")||row.assessment_id.startsWith("__exam_history__:")));
    if((result.data?.length??0)<500)break;
  }
  const changed=versions.filter(row=>resultPayloadCache.get(resultKey(row))?.version!==resultVersion(row));
  const fetched=new Map<string,ResultRow>();
  // Composite-key batches avoid one request per student and avoid rereading unchanged responses.
  for(let offset=0;offset<changed.length;offset+=75){
    const batch=changed.slice(offset,offset+75),filter=batch.map(row=>`and(user_id.eq.${row.user_id},assessment_id.eq.${JSON.stringify(row.assessment_id)})`).join(",");
    const result=await supabase.from("student_exam_results").select("user_id,assessment_id,result").or(filter);checked(result.error);
    for(const row of result.data??[])fetched.set(resultKey(row),row);
  }
  for(const row of changed){const payload=fetched.get(resultKey(row));if(payload)resultPayloadCache.set(resultKey(row),{version:resultVersion(row),row:payload});else resultPayloadCache.delete(resultKey(row));}
  const current=new Set(versions.map(resultKey));for(const key of resultPayloadCache.keys())if(!current.has(key))resultPayloadCache.delete(key);
  return versions.flatMap(row=>{const payload=resultPayloadCache.get(resultKey(row));return payload?[payload.row]:[];});
}
function includeLegacyResults(results:Partial<ExamResult>[],student:User) {
  const metadata=student.user_metadata?.learning_progress?.examResults;
  if(Array.isArray(metadata)){const saved=new Set(results.map(result=>result.assessmentId));results.push(...metadata.filter(result=>result&&typeof result.assessmentId==="string"&&!saved.has(result.assessmentId)));}
  return results;
}
export async function mathAssignments(studentId?:string):Promise<PlanAssignment[]> {
  const rows:PlanAssignment[]=[];
  for(let offset=0;;offset+=500){let query=supabase.from("student_assignments").select("*").order("id");if(studentId)query=query.eq("student_id",studentId);const result=await query.range(offset,offset+499);checkStorage(result.error);rows.push(...(result.data??[]).map(fromAssignmentRow));if((result.data?.length??0)<500)return rows;}
}
export function assignmentMathIds(task:PlanAssignment,catalog:MathQuestionSource[]) {
  const definition=task.events?.find(event=>event.changes?.mathCommand)?.changes.mathCommand as {questionIds?:string[]}|undefined;
  if(Array.isArray(definition?.questionIds))return definition.questionIds;
  return task.kind==="exam"?catalog.filter(row=>row.sources.some(source=>source.assessmentId===task.contentId)).map(row=>row.id):[];
}
export function mathQuestionStates(catalog:MathQuestionSource[],evidence:MathAttemptEvidence[],tasks:PlanAssignment[]) {
  const states:MathStudentInsights["questionStates"]={};
  const state=(id:string)=>states[id]??=( {seen:false,correct:false,incorrect:false,unanswered:false,assigned:false,planned:false,completed:false});
  for(const row of evidence){const value=state(row.questionId);value.seen=true;if(row.status!=="pending")value[row.status]=true;}
  for(const task of tasks)if(!["cancelled","skipped"].includes(task.status))for(const id of assignmentMathIds(task,catalog)){const value=state(id);if(task.status==="planned")value.planned=true;else if(task.status==="completed")value.completed=true;else if(task.assignedAt)value.assigned=true;}
  return states;
}
export async function loadMathStudent(student:User) {
  const [rows,tasks]=await Promise.all([mathResultRows(student.id),mathAssignments(student.id)]);
  const catalog=readMathCommandCatalog(),examContents=contents();
  const results=includeLegacyResults(rows.map(row=>({...row.result,assessmentId:row.result.assessmentId??row.assessment_id})),student);
  const evidence=mathEvidenceFromResults(student.id,results,catalog,id=>examContents[id]??null);
  const questionStates=mathQuestionStates(catalog,evidence,tasks);
  return {catalog,evidence,tasks,questionStates};
}
export function mathStudentInsights(student:User,data:Awaited<ReturnType<typeof loadMathStudent>>):MathStudentInsights {
  const {catalog,evidence,questionStates}=data,settings=readMathCommandState();
  const rules=validMathRules({...defaultMathWeaknessRules,...settings.rules});
  const skills=mathSkillMetrics(evidence,rules),byAssessment=new Map<string,MathAttemptEvidence[]>();
  for(const row of evidence){const key=`${row.assessmentId}:${row.attemptId}`;byAssessment.set(key,[...(byAssessment.get(key)??[]),row]);}
  const assessments=[...byAssessment.values()].map(rows=>{const stats=mathQuestionMetrics(rows);return {assessmentId:rows[0].assessmentId,title:rows[0].assessmentTitle,at:rows[0].at,correct:stats.correct,total:stats.correct+stats.incorrect+stats.unanswered,accuracy:stats.accuracy};}).sort((a,b)=>(a.at??"9999").localeCompare(b.at??"9999"));
  const inventory=new Map<string,MathStudentInsights["remaining"][number]>();
  const difficulty=new Map<string,MathRemainingCounts & {label:string}>(),source=new Map<string,MathRemainingCounts & {label:string}>();
  const counts=():MathRemainingCounts=>({total:0,ready:0,seen:0,assigned:0,planned:0,completed:0,remaining:0,unready:0});
  const readyIds=new Set(buildMathCommandCatalog(catalog,readMathCommandTaxonomy()).rows.filter(row=>row.ready).map(row=>row.id));
  for(const row of catalog){
    const category=row.question.topic||"Uncategorized",subcategory=row.question.subtopic||"Uncategorized",key=`${category}:${subcategory}`;
    const summary=inventory.get(key)??{category,subcategory,...counts()},state=questionStates[row.id],ready=readyIds.has(row.id);
    const difficultyLabel=row.metadata?.difficulty||"unclassified",sourceLabel=row.metadata?.source||row.sources[0]?.source||row.sources[0]?.title||"Unknown source";
    const byDifficulty=difficulty.get(difficultyLabel)??{label:difficultyLabel,...counts()},bySource=source.get(sourceLabel)??{label:sourceLabel,...counts()};
    // Disjoint availability precedence; historical flags remain independent on questionStates.
    const status=state?.assigned?"assigned":state?.planned?"planned":state?.seen?"seen":state?.completed?"completed":ready?"remaining":"unready";
    for(const group of [summary,byDifficulty,bySource]){group.total++;if(ready)group.ready++;group[status]++;}
    inventory.set(key,summary);difficulty.set(difficultyLabel,byDifficulty);source.set(sourceLabel,bySource);
  }
  return {student:{id:student.id,fullName:student.user_metadata?.full_name||student.email?.split("@")[0]||"Student",insightsHref:`/teacher/students/${student.id}`},rules,summary:mathQuestionMetrics(evidence),skills,assessments,remaining:[...inventory.values()],remainingBreakdowns:{difficulty:[...difficulty.values()],source:[...source.values()]},questionStates,availableEvidence:evidence.length,warnings:["Accuracy includes unanswered scored questions; pending grading is excluded. Repeated attempts are retained but distinct questions and assessment IDs control weakness rules.","Inventory counts use this precedence: assigned but incomplete, planned, previously seen, completed without question evidence, unused ready, then unready. Question history filters retain all matching history flags.",...(evidence.some(row=>row.gradingBasis==="current_key")?["Some legacy responses have no saved question snapshot. Those rows are evaluated against the current key and marked current_key; their original grading cannot be reconstructed."]:[]),...(!evidence.length?["No saved question-level math evidence is available yet. Aggregate-only historical results cannot establish exact answers or question accuracy."]:[])]};
}
type PerformanceSnapshot={at:number;revision:string;metrics:Record<string,MathQuestionPerformance>;details:Record<string,ReturnType<typeof mathQuestionMetrics>>};
let performanceCache:PerformanceSnapshot|null=null;
let pendingPerformance:Promise<PerformanceSnapshot>|null=null;
export function invalidateMathPerformance(){performanceCache=null;}
export async function mathPerformance() {
  const revision=mathCatalogSnapshot().signature;
  if(performanceCache&&performanceCache.revision===revision&&Date.now()-performanceCache.at<60000)return performanceCache;
  if(pendingPerformance)return pendingPerformance;
  pendingPerformance=computeMathPerformance(revision).finally(()=>{pendingPerformance=null;});return pendingPerformance;
}
async function computeMathPerformance(revision:string):Promise<PerformanceSnapshot> {
  const [rows,tasks,students]=await Promise.all([incrementalMathResultRows(),mathAssignments(),mathCommandStudents()]);
  const allowed=new Set(students.map(student=>student.id)),catalog=readMathCommandCatalog(),examContents=contents();
  const byStudent=new Map<string,Partial<ExamResult>[]>();
  for(const row of rows)if(allowed.has(row.user_id))byStudent.set(row.user_id,[...(byStudent.get(row.user_id)??[]),{...row.result,assessmentId:row.result.assessmentId??row.assessment_id}]);
  for(const student of students)byStudent.set(student.id,includeLegacyResults(byStudent.get(student.id)??[],student));
  const byQuestion=new Map<string,MathAttemptEvidence[]>();
  for(const [id,results]of byStudent)for(const row of mathEvidenceFromResults(id,results,catalog,id=>examContents[id]??null))byQuestion.set(row.questionId,[...(byQuestion.get(row.questionId)??[]),row]);
  const details=Object.fromEntries([...byQuestion].map(([id,evidence])=>[id,mathQuestionMetrics(evidence)])),metrics:Record<string,MathQuestionPerformance>={};
  for(const row of catalog){const stats=details[row.id]??mathQuestionMetrics([]);metrics[row.id]={attempts:stats.attempts,uniqueStudents:stats.uniqueStudents,correct:stats.correct,incorrect:stats.incorrect,unanswered:stats.unanswered,accuracy:stats.accuracy,firstAttemptAccuracy:stats.firstAttemptAccuracy,lastAttemptedAt:stats.lastAttemptedAt??undefined,assignmentCount:0};}
  for(const task of tasks)if(allowed.has(task.studentId)&&task.assignedAt)for(const id of assignmentMathIds(task,catalog)){const metric=metrics[id];if(metric){metric.assignmentCount=(metric.assignmentCount??0)+1;metric.lastAssignedAt=[metric.lastAssignedAt??"",task.assignedAt].sort().at(-1);}}
  performanceCache={at:Date.now(),revision,metrics,details};return performanceCache;
}
