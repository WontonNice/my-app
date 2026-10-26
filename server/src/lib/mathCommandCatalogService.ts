import fs from "node:fs";
import path from "node:path";
import { buildMathCommandCatalog, queryMathCommandCatalog, summarizeMathCommandCatalog, mathCatalogCsv, validateMathCatalogFilters } from "../shared/mathCommandCatalog";
import type { MathCatalog, MathCatalogFilters, MathQuestionPerformance, MathQuestionRecord, MathTaxonomy } from "../shared/mathCommandTypes";
import { applyMathMetadata, mathCommandRoot, previewMathMetadata, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy, saveMathCommandPreferences, undoMathMetadata } from "./mathCommandCatalogStore";

const cache = new Map<string,{signature:string;records:MathQuestionRecord[];catalog:MathCatalog;taxonomy:MathTaxonomy}>();
const signature = (root:string) => ["server/data/exam-content.json","server/data/question-bank.json","server/data/math-command.json","server/data/math-import-review.json","tools/math-topics.json","tools/.content-drafts/math-import-status.json"].map(file=>{try{const s=fs.statSync(path.join(root,file));return `${s.mtimeMs}:${s.size}`;}catch{return "missing";}}).join("|")+"|"+readMathCommandState(root).revision;
export function mathCatalogSnapshot(root=mathCommandRoot, performance?:Record<string,MathQuestionPerformance>) {
  const version=signature(root);let snapshot=cache.get(root);
  if(!snapshot||snapshot.signature!==version){const records=readMathCommandCatalog(root),taxonomy=readMathCommandTaxonomy(root);snapshot={signature:version,records,taxonomy,catalog:buildMathCommandCatalog(records,taxonomy)};cache.set(root,snapshot);if(cache.size>8)cache.delete(cache.keys().next().value!);}
  return {...snapshot,catalog:performance?{...snapshot.catalog,rows:snapshot.catalog.rows.map(row=>({...row,performance:performance[row.id]??null}))}:snapshot.catalog};
}
const fail=(message:string,status=400)=>Object.assign(new Error(message),{status});
function parseFilters(value:unknown):MathCatalogFilters {
  try{return validateMathCatalogFilters(value);}catch(error){throw fail((error as Error).message);}
}

/** Shared handler for the authenticated teacher app and same-origin local editor. */
export function handleMathCatalogRequest(input:{method:string;pathname:string;body?:unknown;query?:Record<string,unknown>;root?:string;actor:string;performance?:Record<string,MathQuestionPerformance>}) {
  const {method,pathname,actor,performance}=input,root=input.root??mathCommandRoot,query=input.query??{},body=(input.body??{}) as Record<string,unknown>;
  if(method==="GET"&&pathname==="/overview"){
    const {catalog,taxonomy}=mathCatalogSnapshot(root,performance),state=readMathCommandState(root);
    return {revision:state.revision,summary:summarizeMathCommandCatalog(catalog,taxonomy,state.targets),taxonomy,targets:state.targets,savedViews:state.savedViews,collections:state.collections,skills:state.skills,prerequisites:Object.fromEntries(state.skills.map(skill=>[skill.id,skill.prerequisiteIds??[]])),rules:state.rules,pacePerWeek:state.pacePerWeek};
  }
  if(method==="GET"&&pathname==="/catalog")return queryMathCommandCatalog(mathCatalogSnapshot(root,performance).catalog,parseFilters(query.filters));
  if(method==="GET"&&pathname==="/player-queue"){
    const catalog=mathCatalogSnapshot(root,performance).catalog,filters={...parseFilters(query.filters),pageSize:100,page:1};
    let page=queryMathCommandCatalog(catalog,filters);const ids=page.items.map(row=>row.id);
    while(page.page<page.pages){page=queryMathCommandCatalog(catalog,{...filters,page:page.page+1});ids.push(...page.items.map(row=>row.id));}
    return {ids,total:ids.length};
  }
  if(method==="GET"&&pathname.startsWith("/catalog/")){
    const id=decodeURIComponent(pathname.slice("/catalog/".length)),snapshot=mathCatalogSnapshot(root,performance),record=snapshot.records.find(item=>item.id===id),row=snapshot.catalog.rows.find(item=>item.id===id);
    if(!record||!row)throw fail("This math question no longer exists.",404);return {record,row};
  }
  if(method==="GET"&&pathname==="/duplicates"){
    const {catalog}=mathCatalogSnapshot(root,performance);const kind=query.kind;return {groups:catalog.duplicates.filter(group=>!kind||kind===group.kind),...catalog.duplicateSearch};
  }
  if(method==="GET"&&pathname==="/export"){
    const catalog=mathCatalogSnapshot(root,performance).catalog,filters={...parseFilters(query.filters),pageSize:100,page:1};let result=queryMathCommandCatalog(catalog,filters);const rows=[...result.items];
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
