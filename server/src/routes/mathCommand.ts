import { teacherCatalog } from "../lib/teacherLabels";
import { Router, type Response } from "express";
import { createHash, randomUUID } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser, getEnrolledClassIds, getUserRole, isStudentArchived } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { assignmentDetail, toAssignmentRow, updateAssignment } from "../lib/learningPlanStore";
import { mathCommandRoot, readMathCommandCatalog, readMathCommandState } from "../lib/mathCommandCatalogStore";
import { withMathCommandPersistence } from "../lib/mathCommandPersistence";
import { queryMathCommandCatalog, validateMathCatalogFilters } from "../shared/mathCommandCatalog";
import { mathCatalogSnapshot } from "../lib/mathCommandCatalogService";
import { createMathCommandCatalogRouter } from "./mathCommandCatalog";
import { assignmentMathIds, invalidateMathPerformance, loadMathStudent, mathCommandFail as fail, mathCommandStudent, mathCommandStudents, mathPerformance, mathStudentInsights } from "../lib/mathCommandAnalytics";
import { mathQuestionMetrics, selectMathAssignment, type MathAssignmentPreview, type MathAssignmentRules, type MathPracticeView } from "../shared/mathCommandAnalytics";
import { createExamResult, type ExamResult, type SelectedAnswers } from "../shared/examGrading";
import type { ExamContent, ExamQuestion } from "../shared/examTypes";
import { validDate, type PlanAssignment } from "../shared/learningPlan";

export const mathCommandRouter = Router();
const staff = (user:User) => ["teacher","admin"].includes(String(user.app_metadata.role));
const uuid = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
const hash=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const asUuid=(value:string)=>`${value.slice(0,8)}-${value.slice(8,12)}-${value.slice(12,16)}-${value.slice(16,20)}-${value.slice(20,32)}`;
type PreviewRecord={actorId:string; preview:MathAssignmentPreview; signature:string};
const previews=new Map<string,PreviewRecord>();
type PracticeState={revision:number;startedAt:string;savedAt:string;status:"in_progress"|"completed";answers:SelectedAnswers;content:ExamContent;result?:ExamResult};

mathCommandRouter.use(async(request,response,next)=>{const auth=await getAuthenticatedUser(request.headers.authorization);if(!auth.user){response.status(401).json({message:auth.error});return;}response.locals.user=auth.user;next();});
mathCommandRouter.use((request,response,next)=>{if(request.path.startsWith("/student/")){next();return;}if(!staff(response.locals.user)){response.status(403).json({message:"Teacher access is required."});return;}next();});
// Catalog and analytics read one durable metadata revision per API request.
mathCommandRouter.use(async(_request,_response,next)=>{try{await withMathCommandPersistence(mathCommandRoot,()=>next());}catch(error){next(error);}});
// Catalog has its own staff guard, and deliberately passes unknown paths onward.
mathCommandRouter.use(createMathCommandCatalogRouter(async()=> (await mathPerformance()).metrics));
mathCommandRouter.get("/students",async(_request,response)=>{response.json({students:(await mathCommandStudents()).map(user=>({id:user.id,fullName:user.user_metadata?.full_name||user.email?.split("@")[0]||"Student",insightsHref:`/teacher/students/${user.id}`}))});});
mathCommandRouter.get("/students/:studentId/insights",async(request,response)=>{const student=await mathCommandStudent(request.params.studentId);response.json(mathStudentInsights(student,await loadMathStudent(student)));});
mathCommandRouter.get("/students/:studentId/evidence",async(request,response)=>{
  const student=await mathCommandStudent(request.params.studentId),data=await loadMathStudent(student),query=request.query;
  let rows=data.evidence;
  if(query.category)rows=rows.filter(row=>row.category===query.category);
  if(query.subcategory)rows=rows.filter(row=>row.subcategory===query.subcategory);
  if(query.skillId||query.diagnosticSkill)rows=rows.filter(row=>row.diagnosticSkill===(query.skillId||query.diagnosticSkill));
  if(query.questionId)rows=rows.filter(row=>row.questionId===query.questionId);
  if(["correct","incorrect","unanswered","pending"].includes(String(query.status)))rows=rows.filter(row=>row.status===query.status);
  if(query.recent==="1"){const days=readMathCommandState().rules.recentDays??90;rows=rows.filter(row=>row.at&&Date.parse(row.at)>=Date.now()-days*86400000);}
  if(query.repeat==="1")rows=rows.filter(row=>row.previouslyAttempted);
  rows.sort((a,b)=>(b.at??"").localeCompare(a.at??""));const page=Math.max(0,Math.min(100000,Math.floor(Number(query.page)||0))),pageSize=50;
  response.json({items:rows.slice(page*pageSize,(page+1)*pageSize),total:rows.length,page,pageSize});
});
mathCommandRouter.get("/questions/:questionId/performance",async(request,response)=>{const stats=await mathPerformance();response.json({...stats.details[request.params.questionId]??mathQuestionMetrics([]),assignmentCount:stats.metrics[request.params.questionId]?.assignmentCount??0,lastAssignedAt:stats.metrics[request.params.questionId]?.lastAssignedAt??null,sampleMinimum:10});});
async function selectionContext(data:Awaited<ReturnType<typeof loadMathStudent>>,rules:MathAssignmentRules,actor: string){
  if(!rules||typeof rules!=="object"||Array.isArray(rules))throw fail("Choose assignment selection rules.");
  const filters=validateMathCatalogFilters(rules.catalogFilters),needsPerformance=filters.status==="never_assigned"||filters.status==="previously_assigned";
  const snapshot=mathCatalogSnapshot(undefined,needsPerformance?(await mathPerformance()).metrics:undefined),eligible=new Set<string>();
  const personalCatalog=teacherCatalog(snapshot.catalog,mathCommandRoot,actor);
  let page=queryMathCommandCatalog(personalCatalog,{...filters,page:1,pageSize:100});
  for(;;){page.items.filter(row=>row.ready).forEach(row=>eligible.add(row.id));if(page.page>=page.pages)break;page=queryMathCommandCatalog(personalCatalog,{...filters,page:page.page+1,pageSize:100});}
  const seen=new Set(data.evidence.map(row=>row.questionId)),assigned=new Set(Object.entries(data.questionStates).filter(([,value])=>value.assigned||value.planned||value.completed).map(([id])=>id));
  for(const group of snapshot.catalog.duplicates.filter(group=>group.kind==="exact")){
    if(group.questionIds.some(id=>seen.has(id)))group.questionIds.forEach(id=>seen.add(id));
    if(group.questionIds.some(id=>assigned.has(id)))group.questionIds.forEach(id=>assigned.add(id));
  }
  return {pool:data.catalog.filter(row=>eligible.has(row.id)),seen,assigned};
}
mathCommandRouter.post("/students/:studentId/assignment-preview",async(request,response)=>{
  const student=await mathCommandStudent(request.params.studentId),data=await loadMathStudent(student),rules=request.body as MathAssignmentRules;
  const {pool,seen,assigned}=await selectionContext(data,rules,response.locals.user.id),selection=selectMathAssignment(pool,seen,assigned,rules);
  const previewToken=randomUUID(),expiresAt=new Date(Date.now()+15*60000).toISOString();
  const preview:MathAssignmentPreview={previewToken,studentId:student.id,questionIds:selection.selected.map(row=>row.id),questions:selection.selected.map(row=>({id:row.id,prompt:row.question.prompt,category:row.question.topic,subcategory:row.question.subtopic||"",diagnosticSkill:row.metadata?.diagnosticSkill||"",difficulty:row.metadata?.difficulty??null,previouslySeen:seen.has(row.id)||assigned.has(row.id),source:row.sources.map(source=>source.title).join("; ")})),requested:selection.requested,selected:selection.selected.length,shortfall:selection.shortfall,warnings:selection.warnings,rules,expiresAt};
  for(const [id,record]of previews)if(Date.parse(record.preview.expiresAt)<Date.now())previews.delete(id);
  if(previews.size>=1000)previews.delete(previews.keys().next().value!);
  previews.set(previewToken,{actorId:response.locals.user.id,preview,signature:hash(selection.selected)});response.json(preview);
});
mathCommandRouter.post("/students/:studentId/assignments",async(request,response)=>{
  const actor=response.locals.user as User,student=await mathCommandStudent(request.params.studentId),body=request.body??{};
  if(!uuid.test(body.batchId??""))throw fail("Choose a valid assignment submission ID.");
  const id=asUuid(hash(`${student.id}:${body.batchId}:math-command`)),old=await assignmentDetail(student.id,id);
  if(old){response.json({assignment:old});return;}
  const record=previews.get(body.previewToken);
  if(!record||record.actorId!==actor.id||record.preview.studentId!==student.id||Date.parse(record.preview.expiresAt)<Date.now())throw fail("Preview the assignment again before saving.",409);
  const ids=record.preview.questionIds;
  if(!ids.length)throw fail("No questions are available for this assignment.");
  if(!Array.isArray(body.questionIds)||hash(body.questionIds)!==hash(ids))throw fail("The question selection changed. Preview it again before assigning.",409);
  const catalog=readMathCommandCatalog(),selection=ids.map(id=>catalog.find(row=>row.id===id));
  if(selection.some(row=>!row)||hash(selection)!==record.signature)throw fail("Question content or classification changed. Preview again before assigning.",409);
  const latest=await selectionContext(await loadMathStudent(student),record.preview.rules,actor.id);
  if(record.preview.rules.excludeSeen!==false&&record.preview.questions.some(row=>!row.previouslySeen&&(latest.seen.has(row.id)||latest.assigned.has(row.id))))throw fail("Student history or assignments changed after this preview. Preview again to select unseen questions.",409);
  try{selectMathAssignment(latest.pool,latest.seen,latest.assigned,{...record.preview.rules,questionIds:ids});}catch(error){throw fail(`The preview is no longer eligible: ${(error as Error).message}`,409);}
  const title=String(body.title??`${ids.length}-question math practice`).trim();if(!title||title.length>300)throw fail("Use an assignment title of 1–300 characters.");
  const dueDate=body.dueDate||null;if(dueDate&&!validDate(dueDate))throw fail("Choose a valid due date.");
  const at=new Date().toISOString(),task:PlanAssignment={id,studentId:student.id,kind:"practice",contentId:`math-command:${id}`,title,instructions:typeof body.instructions==="string"?body.instructions.slice(0,10000):"Complete the selected mathematics questions.",url:`/math-practice/${id}`,status:"assigned",assignedAt:at,dueDate,plannedDate:null,completedAt:null,estimatedMinutes:null,questionTarget:ids.length,practiceBaseline:null,createdAt:at,createdBy:actor.id,updatedAt:at,revision:1,completion:null,events:[{at,actor:actor.id,action:"Assigned mathematics questions from existing content",changes:{mathCommand:{questionIds:ids,signature:record.signature}}}]};
  const saved=await supabase.from("student_assignments").upsert(toAssignmentRow(task),{onConflict:"id",ignoreDuplicates:true});if(saved.error)throw fail("The assignment could not be saved. Retry with the same submission ID.",503);
  invalidateMathPerformance();response.status(201).json({assignment:task});
});

async function practiceAssignment(id:string,user:User) {
  if(getUserRole(user)!=="student"||isStudentArchived(user)||!getEnrolledClassIds(user.app_metadata).includes("shsat"))throw fail("SHSAT student access is required.",403);
  if(!uuid.test(id))throw fail("Invalid assignment ID.");
  const task=await assignmentDetail(user.id,id);
  if(!task||task.kind!=="practice"||task.contentId!==`math-command:${id}`||!task.assignedAt||["planned","cancelled","skipped"].includes(task.status))throw fail("This assignment is not available for your account.",404);
  return task;
}
async function practiceState(task:PlanAssignment):Promise<PracticeState|null>{const result=await supabase.from("student_practice_progress").select("progress").eq("user_id",task.studentId).eq("topic_slug",task.contentId!).maybeSingle();if(result.error)throw fail("Saved responses could not be loaded.",503);return result.data?.progress??null;}
function studentQuestion(question:ExamQuestion):ExamQuestion {
  const q=JSON.parse(JSON.stringify(question)) as ExamQuestion;
  delete q.correctChoiceId;delete q.correctChoiceIds;delete q.correctTextAnswers;delete q.correctPointIds;delete q.correctPlacements;delete q.explanation;delete q.explanationHtml;
  if(q.dragDropSlots)q.dragDropSlots=q.dragDropSlots.map(slot=>({...slot,correctItemId:""}));
  if(q.dropdowns)q.dropdowns=q.dropdowns.map(dropdown=>({...dropdown,correctChoiceId:""}));
  if(q.numberLineResponse)q.numberLineResponse={...q.numberLineResponse,correctValue:null,correctDirection:"left",correctEndpoint:"open"};
  return q;
}
function practiceView(task:PlanAssignment,state:PracticeState):MathPracticeView{return {assignment:{id:task.id,title:task.title,instructions:task.instructions,status:task.status,dueDate:task.dueDate,studentId:task.studentId},questions:state.content.mathSection!.questions.map(studentQuestion),answers:state.answers,status:state.status,revision:state.revision,startedAt:state.startedAt,savedAt:state.savedAt,...(state.result?{result:state.result}:{})};}
function cleanAnswers(input:unknown,questions:ExamQuestion[]):SelectedAnswers {
  if(!input||typeof input!=="object"||Array.isArray(input))throw fail("Send question responses.");
  const ids=new Set(questions.map(q=>q.id));
  for(const [id,value]of Object.entries(input)){if(!ids.has(id))throw fail("Responses must belong to this assignment.");if(typeof value==="string"){if(value.length>10000)throw fail("Keep an individual answer under 10,000 characters.");}else if(Array.isArray(value)){if(value.length>100||value.some(item=>typeof item!=="string"||item.length>1000))throw fail("Invalid selected answers.");}else if(!value||typeof value!=="object"||Object.keys(value).length>100||Object.values(value).some(item=>typeof item!=="string"||item.length>1000))throw fail("Invalid response format.");}
  return input as SelectedAnswers;
}
async function savePractice(task:PlanAssignment,state:PracticeState,revision:unknown,next:PracticeState) {
  if(revision!==state.revision)throw fail("Responses changed in another window. Reload before saving.",409);
  const saved=await supabase.from("student_practice_progress").update({progress:next,updated_at:next.savedAt}).eq("user_id",task.studentId).eq("topic_slug",task.contentId!).eq("progress->>revision",String(state.revision)).select("topic_slug").maybeSingle();
  if(saved.error)throw fail("Responses could not be saved. Please retry.",503);if(!saved.data)throw fail("Responses changed in another window. Reload before saving.",409);
}
async function syncCompletedPractice(task:PlanAssignment,state:PracticeState):Promise<PlanAssignment> {
  const result=state.result;if(state.status!=="completed"||!result)return task;
  const existing=await supabase.from("student_exam_results").select("assessment_id").eq("user_id",task.studentId).eq("assessment_id",result.assessmentId).maybeSingle();
  if(existing.error)throw fail("Your submitted answers are saved, but results need syncing. Open this assignment again to retry.",503);
  if(!existing.data){
    const saved=await supabase.from("student_exam_results").upsert({user_id:task.studentId,assessment_id:result.assessmentId,result,completed_at:result.completedAt,updated_at:new Date().toISOString()},{onConflict:"user_id,assessment_id",ignoreDuplicates:true});
    if(saved.error)throw fail("Your submitted answers are saved, but results need syncing. Open this assignment again to retry.",503);
  }
  if(task.status!=="completed")task=await updateAssignment(task,{status:"completed",completedAt:result.completedAt,completion:{source:"exam",at:result.completedAt,reference:result.assessmentId,correct:result.correct,total:result.total}},task.studentId,"Completed from saved mathematics practice responses");
  if(!existing.data)invalidateMathPerformance();
  return task;
}
mathCommandRouter.get("/student/assignments/:id",async(request,response)=>{
  let task=await practiceAssignment(request.params.id,response.locals.user),state=await practiceState(task);
  if(!state){const catalog=readMathCommandCatalog(),ids=assignmentMathIds(task,catalog),questions=ids.map(id=>catalog.find(row=>row.id===id)?.question);if(!questions.length||questions.some(q=>!q))throw fail("Some assigned content is no longer available. Ask your teacher to review this assignment.",409);const at=new Date().toISOString();const content:ExamContent={assessmentId:`math-command-${task.id}`,title:task.title,passageSets:[],mathSection:{id:`math-command-${task.id}`,label:task.title,questionCount:questions.length,directions:{title:task.title,subject:"Mathematics",body:"Solve each question.",notes:[]},questions:questions as ExamQuestion[]}};
    state={revision:1,startedAt:at,savedAt:at,status:"in_progress",answers:{},content};const saved=await supabase.from("student_practice_progress").upsert({user_id:task.studentId,topic_slug:task.contentId!,progress:state,updated_at:at},{onConflict:"user_id,topic_slug",ignoreDuplicates:true});if(saved.error)throw fail("The assignment could not be opened. Please retry.",503);state=(await practiceState(task))??state;
  }
  if(task.status==="assigned")task=await updateAssignment(task,{status:"in_progress"},task.studentId,"Started assigned mathematics practice");
  // Reloading after a deferred sync must retain a route to complete the saved submission.
  if(state.status==="completed")task=await syncCompletedPractice(task,state);
  response.json(practiceView(task,state));
});
mathCommandRouter.put("/student/assignments/:id/responses",async(request,response)=>{const task=await practiceAssignment(request.params.id,response.locals.user),state=await practiceState(task);if(!state)throw fail("Open the assignment first.",409);if(state.status==="completed")throw fail("This assignment has already been submitted.",409);const next={...state,answers:cleanAnswers(request.body.answers,state.content.mathSection!.questions),revision:state.revision+1,savedAt:new Date().toISOString()};await savePractice(task,state,request.body.revision,next);response.json(practiceView(task,next));});
mathCommandRouter.post("/student/assignments/:id/submit",async(request,response)=>{
  let task=await practiceAssignment(request.params.id,response.locals.user);const state=await practiceState(task);if(!state)throw fail("Open the assignment first.",409);
  let completed=state;
  if(state.status!=="completed"){
    const answers=cleanAnswers(request.body.answers,state.content.mathSection!.questions),at=new Date().toISOString();
    const result={...createExamResult(state.content,answers,["math"]),attemptId:task.id,completedAt:at,source:"digital" as const};
    completed={...state,answers,status:"completed",revision:state.revision+1,savedAt:at,result};await savePractice(task,state,request.body.revision,completed);
  }
  // Retry repairs deferred writes without replacing answers or an existing released result.
  task=await syncCompletedPractice(task,completed);
  invalidateMathPerformance();response.json(practiceView(task,completed));
});
mathCommandRouter.use((error:unknown,_request:unknown,response:Response,_next:unknown)=>{const value=error as {status?:number;message?:string};response.status(value.status??400).json({message:value.message??"Math Command Center could not complete this request."});});
