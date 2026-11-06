import { canonicalRecords, candidatePairs, duplicateIndex } from "../shared/mathDuplicateReview";
import { readTeacherLabels, saveTeacherLabels, teacherCatalog } from "./teacherLabels";
import { readGeneratorPlanner, saveGeneratorPlanner } from './generatorPlanner';
import { saveMathTaxonomy } from "./mathTaxonomyManagement";
import { readClassificationSkills, saveClassificationSkills } from './mathClassificationSkillsManagement';
import { readCachedJson } from "./cachedJson";
import { examInventoryRows } from "../shared/examInventory";
import type { ExamContent } from "../shared/examTypes";
import fs from "node:fs";
import path from "node:path";
import { findMathDuplicates, buildMathCommandCatalog, queryMathCommandCatalog, summarizeMathCommandCatalog, mathCatalogCsv, validateMathCatalogFilters } from "../shared/mathCommandCatalog";
import type { MathCatalogFilters, MathQuestionPerformance } from "../shared/mathCommandTypes";
import { commitMathCommandState, mathClassificationRevision, applyMathMetadata, mathCommandRoot, previewMathMetadata, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy, saveMathCommandPreferences, undoMathMetadata } from "./mathCommandCatalogStore";

function buildSnapshot(root:string,signature:string) {
  const records=readMathCommandCatalog(root),taxonomy=readMathCommandTaxonomy(root);
  const index=duplicateIndex(records,readMathCommandState(root).duplicateDecisions??[]);
  const merged=canonicalRecords(records,index.canonical);
  const scan=findMathDuplicates(records),pairs=candidatePairs(scan.groups,index);
  const groups=pairs.map(p=>({id:JSON.stringify([p.left,p.right]),kind:p.kind,reason:p.reason,score:p.score,questionIds:[p.left,p.right]}));
  const catalog=buildMathCommandCatalog(merged,taxonomy,{duplicateResult:{groups,search:scan.search}});
  return {signature,records,merged,catalog,taxonomy,pairs,index};
}
const cache = new Map<string,ReturnType<typeof buildSnapshot>>();
const signature = (root:string) => ["server/data/exam-content.json","server/data/question-bank.json","server/data/math-command.json","server/data/math-import-review.json","tools/math-topics.json","tools/.content-drafts/math-import-status.json"].map(file=>{try{const s=fs.statSync(path.join(root,file));return `${s.mtimeMs}:${s.size}`;}catch{return "missing";}}).join("|")+"|"+readMathCommandState(root).revision+"|"+mathClassificationRevision(root);
export function mathCatalogSnapshot(root=mathCommandRoot, performance?:Record<string,MathQuestionPerformance>) {
  const version=signature(root);let snapshot=cache.get(root);
  if(!snapshot||snapshot.signature!==version){snapshot=buildSnapshot(root,version);cache.set(root,snapshot);if(cache.size>8)cache.delete(cache.keys().next().value!);}
  return {...snapshot,catalog:performance?{...snapshot.catalog,rows:snapshot.catalog.rows.map(row=>({...row,performance:performance[row.id]??null}))}:snapshot.catalog};
}
const fail=(message:string,status=400)=>Object.assign(new Error(message),{status});
function parseFilters(value:unknown):MathCatalogFilters {
  try{return validateMathCatalogFilters(value);}catch(error){throw fail((error as Error).message);}
}

/** Shared handler for the authenticated teacher app and same-origin local editor. */
export function handleMathCatalogRequest(input:{method:string;pathname:string;body?:unknown;query?:Record<string,unknown>;root?:string;actor:string;performance?:Record<string,MathQuestionPerformance>}) {
  const {method,pathname,actor,performance}=input,root=input.root??mathCommandRoot,query=input.query??{},body=(input.body??{}) as Record<string,unknown>;
  if(method==='GET' && pathname==='/exam-inventory'){
    const exams=readCachedJson<Record<string,ExamContent>>(path.join(root,'server/data/exam-content.json'));
    if(!query.exam)return {exams:Object.values(exams).map(e=>({id:e.assessmentId,title:e.title}))};
    const exam=Object.values(exams).find(e=>e.assessmentId===query.exam);
    if(!exam)throw fail('Exam not found.',404);
    const snapshot=mathCatalogSnapshot(root);
    return {rows:examInventoryRows(exam,new Map(snapshot.catalog.rows.map(r=>[r.id,r])),snapshot.index.canonical)};
  }
  if (pathname === '/generator-planner') {
    if (method === 'GET') return readGeneratorPlanner(root, actor);
    if (method === 'POST') return saveGeneratorPlanner(root, actor, body);
  }
  if(pathname === "/teacher-labels") {
    if(method === "GET") return readTeacherLabels(root, actor);
    if(method === "POST") return saveTeacherLabels(root, actor, body);
  }
  if(pathname === "/taxonomy" && method === "POST") return saveMathTaxonomy(root, body);
  if(pathname === '/classification-skills') {
    if(method==='GET')return readClassificationSkills(root);
    if(method==='POST')return saveClassificationSkills(root,body,actor);
  }
  const personalSnapshot = () => { const snapshot = mathCatalogSnapshot(root, performance); return {...snapshot, catalog: teacherCatalog(snapshot.catalog, root, actor)}; };
  if(method==="GET"&&pathname==="/overview"){
    const {catalog,taxonomy}=mathCatalogSnapshot(root,performance),state=readMathCommandState(root);
    return {revision:state.revision,classificationRevision:mathClassificationRevision(root),summary:summarizeMathCommandCatalog(catalog,taxonomy,state.targets),taxonomy,targets:state.targets,savedViews:state.savedViews,collections:state.collections,skills:state.skills,prerequisites:Object.fromEntries(state.skills.map(skill=>[skill.id,skill.prerequisiteIds??[]])),rules:state.rules,pacePerWeek:state.pacePerWeek};
  }
  if(method==="GET"&&pathname==="/catalog")return queryMathCommandCatalog(personalSnapshot().catalog,parseFilters(query.filters));
  if(method==="GET"&&pathname==="/player-queue"){
    const catalog=personalSnapshot().catalog,filters={...parseFilters(query.filters),pageSize:100,page:1};
    let page=queryMathCommandCatalog(catalog,filters);const ids=page.items.map(row=>row.id);
    while(page.page<page.pages){page=queryMathCommandCatalog(catalog,{...filters,page:page.page+1});ids.push(...page.items.map(row=>row.id));}
    return {ids,total:ids.length};
  }
  if(method==="GET"&&pathname.startsWith("/catalog/")){
    const id=decodeURIComponent(pathname.slice("/catalog/".length)),snapshot=personalSnapshot(),record=snapshot.merged.find(item=>item.id===id)??snapshot.records.find(item=>item.id===id),row=snapshot.catalog.rows.find(item=>item.id===(snapshot.index.canonical.get(id)??id));
    if(!record||!row)throw fail("This math question no longer exists.",404);return {record,row};
  }
  if(pathname==='/duplicate-review'){
    const snapshot=mathCatalogSnapshot(root),state=readMathCommandState(root);
    if(method==='GET')return {pairs:snapshot.pairs,revision:state.revision,signature:snapshot.signature,lastDecision:state.duplicateDecisions?.at(-1)??null};
    if(method==='POST'){
      if(body.revision!==state.revision||body.signature!==snapshot.signature)throw fail('The review has changed. Reload the comparison.',409);
      if(body.decision==='undo' && state.duplicateDecisions?.length){
        state.duplicateDecisions.pop();
        return {revision:commitMathCommandState(root,state.revision,state).revision};
      }
      const pair=snapshot.pairs.find(p=>p.left===body.left&&p.right===body.right);
      if(!pair||(body.decision!=='link'&&body.decision!=='separate'))throw fail('Choose a pending comparison.');
      state.duplicateDecisions=[...(state.duplicateDecisions??[]),{left:pair.left,right:pair.right,decision:body.decision,actor,at:new Date().toISOString()}];
      return {revision:commitMathCommandState(root,state.revision,state).revision};
    }
  }
  if(method==="GET"&&pathname==="/duplicates"){
    const {catalog}=mathCatalogSnapshot(root,performance);const kind=query.kind;return {groups:catalog.duplicates.filter(group=>!kind||kind===group.kind),...catalog.duplicateSearch};
  }
  if(method==="GET"&&pathname==="/export"){
    const catalog=personalSnapshot().catalog,filters={...parseFilters(query.filters),pageSize:100,page:1};let result=queryMathCommandCatalog(catalog,filters);const rows=[...result.items];
    while(result.page<result.pages){result=queryMathCommandCatalog(catalog,{...filters,page:result.page+1});rows.push(...result.items);}return {csv:mathCatalogCsv(rows),count:rows.length};
  }
  if(method==="POST"&&pathname==="/bulk-preview")return previewMathMetadata(root,body,actor);
  if(method==="POST"&&pathname==="/bulk-apply")return applyMathMetadata(root,String(body.token??""),actor);
  if(method==="POST"&&pathname==="/bulk-undo")return undoMathMetadata(root,String(body.undoToken??""),actor);
  if(method==="PUT"&&pathname==="/preferences"){
    const state=saveMathCommandPreferences(root,body);return {revision:state.revision,targets:state.targets,savedViews:state.savedViews,collections:state.collections,skills:state.skills,rules:state.rules,pacePerWeek:state.pacePerWeek};
  }
  return undefined;
}
