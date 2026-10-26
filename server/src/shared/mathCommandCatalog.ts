import type { ExamQuestion } from "./examTypes";
import { isMathAnswerComplete, normalizeMathAnswer } from "./mathAnswer";
import { mathDifficulties } from "./mathCommandTypes";
import type { MathCatalog, MathCatalogFilters, MathCatalogPage, MathCatalogRow, MathCatalogSummary, MathCoverageRow, MathDifficulty, MathDuplicateGroup, MathDuplicateKind, MathInventoryTargets, MathQuestionMetadata, MathQuestionPerformance, MathQuestionRecord, MathRepresentation, MathReviewIssue, MathTaxonomy } from "./mathCommandTypes";

export const mathReviewIssueLabels: Record<MathReviewIssue, string> = {
  missing_category: "Missing category", missing_subcategory: "Missing subcategory", missing_difficulty: "Missing difficulty",
  missing_source: "Missing source", missing_answer: "Missing answer key", missing_explanation: "Missing explanation",
  missing_diagram: "Missing required diagram", invalid_formatting: "Invalid formatting", invalid_answer: "Invalid answer configuration",
  invalid_classification: "Invalid classification", possible_duplicate: "Duplicate review", teacher_review: "Teacher review",
};

const words = (value: unknown) => String(value ?? "").trim();
export function mathPlainText(value: unknown) {
  return words(value).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<\/?(?:p|div|br|li|h[1-6])\b[^>]*>/gi, " ").replace(/<\/?(?:span|b|strong|i|em|u|s|sub|sup|table|thead|tbody|tr|td|th|img|ol|ul|blockquote|code|a)\b[^>]*>/gi, "")
    .replace(/&(#x[0-9a-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi, (match, entity: string) => {
      if (!entity.startsWith("#")) return ({nbsp:" ",amp:"&",lt:"<",gt:">",quot:'"',apos:"'"} as Record<string,string>)[entity.toLowerCase()];
      const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2),16) : Number(entity.slice(1));
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
    }).replace(/\s+/g," ").trim();
}

// Deliberately preserves letter case, signs, numbers, inequalities and grouping.
// Removing them could label mathematically different prompts as exact matches.
export function normalizeMathDuplicateText(value: unknown) {
  return mathPlainText(value).normalize("NFC").replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\u2212/g,"-")
    .replace(/\\(?:left|right)\b/g,"").replace(/\\[()[\]]|\$\$/g,"").replace(/\\(?:dfrac|tfrac)\b/g,"\\frac")
    .replace(/\\(?:leq|le)\b/g,"≤").replace(/\\(?:geq|ge)\b/g,"≥").replace(/\\times\b/g,"×").replace(/\\cdot\b/g,"·")
    .replace(/\\[,!;:]|\\(?:quad|qquad)\b/g," ").replace(/\s*([=+*/^≤≥<>×·{},()-])\s*/g,"$1").replace(/\s+/g," ").trim();
}

const stable = (value: unknown): unknown => Array.isArray(value) ? value.map(stable) : value && typeof value === "object"
  ? Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,stable(item)])) : value;
const hash = (value: string) => { let h=2166136261; for (let i=0;i<value.length;i++) h=Math.imul(h^value.charCodeAt(i),16777619); return (h>>>0).toString(36); };
const unique = <T>(values: T[]) => [...new Set(values)];
const imagesIn = (q: ExamQuestion) => unique([q.image?.src, ...(q.choices||[]).map(c=>c.image?.src), ...[q.promptHtml,q.stimulusHtml,q.instructionsHtml,...(q.choices||[]).map(c=>c.html)].flatMap(html=>[...String(html||"").matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]))].filter((s):s is string=>Boolean(s)));
export function effectiveMathQuestion(record: MathQuestionRecord): ExamQuestion {
  return {...record.question, topic: record.metadata?.category ?? record.question.topic, subtopic: record.metadata?.subcategory ?? record.question.subtopic};
}

function questionSignature(record: MathQuestionRecord) {
  const q=record.question;
  const normalize=(value: unknown):unknown=>Array.isArray(value)?value.map(normalize):value&&typeof value==="object" ? Object.fromEntries(Object.entries(value).filter(([key])=>!["id","alt","correctChoiceId","correctItemId","correctValue","correctDirection","correctEndpoint"].includes(key)).map(([key,item])=>[key,normalize(item)])) : typeof value==="string"?normalizeMathDuplicateText(value):value;
  const choices=(q.choices||[]).map(c=>({text:normalizeMathDuplicateText(c.html || c.math || c.text),image:c.image?.src||"",numberLine:c.numberLine||null})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const text=[normalizeMathDuplicateText(q.promptHtml||q.prompt), normalizeMathDuplicateText(q.stimulusHtml||q.stimulus),normalizeMathDuplicateText(q.instructionsHtml||q.instructions),...choices.map(c=>c.text)].filter(Boolean).join(" ");
  const structure=Object.fromEntries(["dropdownContent","dropdowns","dragDropContent","dragDropSlots","items","categories","tableHeaders","graph","numberLineResponse","requiredSelections","requiredPlacements","allowReuse","categoryCapacity"].filter(key=>q[key as keyof ExamQuestion]!==undefined).map(key=>[key,normalize(q[key as keyof ExamQuestion])]));
  const fingerprint=JSON.stringify(stable({type:q.type,text,choices,images:imagesIn(q).sort(),structure,context:record.metadata?.context||""}));
  const numbers=(text.match(/\d+(?:\.\d+)?/g)||[]).join("|");
  const template=text.replace(/\d+(?:\.\d+)?/g,"#");
  const tokens=unique(text.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
  return {id:record.id,text,fingerprint,numbers,template,type:q.type,tokens,sourceKey:record.metadata?.sourceQuestionId&&record.metadata.source?`${record.metadata.source}\0${record.metadata.sourceQuestionId}`:""};
}

export function findMathDuplicates(records: MathQuestionRecord[]) {
  const descriptions=records.map(questionSignature).filter(d=>d.text.length>=3);
  const groups:MathDuplicateGroup[]=[];
  const exact=new Map<string,typeof descriptions>();
  const templates=new Map<string,typeof descriptions>();
  const sources=new Map<string,typeof descriptions>();
  for(const d of descriptions){
    exact.set(d.fingerprint,[...(exact.get(d.fingerprint)||[]),d]);
    if(d.numbers && d.template.length>=24) { const key=d.type+":"+d.template; templates.set(key,[...(templates.get(key)||[]),d]); }
    if(d.sourceKey)sources.set(d.sourceKey,[...(sources.get(d.sourceKey)||[]),d]);
  }
  const covered=new Set<string>();
  const pair=(a:string,b:string)=>a<b?`${a}\0${b}`:`${b}\0${a}`;
  const addGroup=(kind:MathDuplicateKind, items:typeof descriptions,score:number,reason:string)=>{
    const ids=unique(items.map(item=>item.id)).sort(); if(ids.length<2)return;
    groups.push({id:`${kind}-${hash(ids.join("\0"))}`,kind,questionIds:ids,score,reason});
    // Mark only bounded groups; the exact fingerprint still avoids needless comparisons below.
    if(ids.length<=200)for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)covered.add(pair(ids[i],ids[j]));
  };
  for(const items of exact.values()) if(items.length>1)addGroup("exact",items,100,"Matching normalized prompt, choices, interaction, context and image references. Check answer keys before linking copies.");
  for(const items of templates.values()) if(new Set(items.map(d=>d.numbers)).size>1)addGroup("template",items,100,"Same wording and response pattern with different numeric values. These are distinct practice variants, not automatic duplicates.");
  for(const items of sources.values()) if(new Set(items.map(d=>d.fingerprint)).size>1)addGroup("possible",items,100,"Same teacher-entered source identifier with differing content. Review both versions.");

  // Rare-token blocking avoids all-pairs work over thousands of questions.
  const inverted=new Map<string,number[]>();
  descriptions.forEach((d,index)=>d.tokens.filter(t=>t.length>=3).forEach(token=>{const list=inverted.get(token)||[];list.push(index);inverted.set(token,list);}));
  let comparedPairs=0,blockedLargeGroups=0;
  descriptions.forEach((a,index)=>{
    if(a.text.length<40)return;
    const candidates=new Set<number>();
    a.tokens.filter(t=>t.length>=3).map(token=>inverted.get(token)||[]).sort((x,y)=>x.length-y.length).slice(0,8).forEach(list=>{if(list.length>300){blockedLargeGroups++;return;}list.forEach(j=>{if(j>index)candidates.add(j);});});
    for(const j of candidates){const b=descriptions[j];
      if(a.type!==b.type||a.fingerprint===b.fingerprint||covered.has(pair(a.id,b.id))||Math.min(a.text.length,b.text.length)/Math.max(a.text.length,b.text.length)<.8)continue;
      comparedPairs++; const bt=new Set(b.tokens); const intersection=a.tokens.filter(token=>bt.has(token)).length;
      const score=2*intersection/(a.tokens.length+b.tokens.length);
      if(score>=.9){addGroup("possible",[a,b],Math.round(score*100),a.numbers!==b.numbers?"Similar wording; numbers or values differ. Teacher review required.":"Similar wording; choices, interaction, images or phrasing may differ. Teacher review required.");}
    }
  });
  return {groups:groups.sort((a,b)=>({exact:0,possible:1,template:2}[a.kind]-{exact:0,possible:1,template:2}[b.kind])||b.score-a.score||a.id.localeCompare(b.id)),search:{comparedPairs,blockedLargeGroups,description:"Exact fingerprints and numeric templates cover the full bank. Possible matches use rare-token candidate blocking and ≥90% token Dice overlap; this is a review aid, not an exhaustive proof of uniqueness."}};
}

function hasRichContent(text: unknown, html?: unknown) { return Boolean(mathPlainText(html||text) || /<img\b/i.test(words(html))); }
function hasUniqueIds(items: {id:string}[]) { return items.every(item=>Boolean(item.id)) && new Set(items.map(item=>item.id)).size===items.length; }
export function mathAnswerStatus(q: ExamQuestion): {hasAnswer:boolean;valid:boolean;signals:string[]} {
  const choices=q.choices||[],ids=new Set(choices.map(c=>c.id)), signals:string[]=[];
  if(q.type==="multiple_choice"||q.type==="multi_select"||q.type==="transition_drop"&&!q.dragDropSlots?.length){
    const keys=q.type==="multi_select"?q.correctChoiceIds||[]:q.correctChoiceId?[q.correctChoiceId]:[];
    const hasAnswer=keys.length>0;
    let valid=hasAnswer && choices.length>=2 && hasUniqueIds(choices) && keys.every(id=>ids.has(id)) && unique(keys).length===keys.length && choices.every(c=>hasRichContent(c.math||c.text,c.html)||Boolean(c.image)||Boolean(c.numberLine));
    if(q.type==="multi_select" && q.requiredSelections!==undefined) valid=valid&&q.requiredSelections===keys.length;
    // Only identical mathematical literals are checked; no algebra solver or inferred answers.
    if(q.type==="multiple_choice"&&q.correctChoiceId){
      const keyed=choices.find(c=>c.id===q.correctChoiceId); const key=literalValue(keyed?.math||keyed?.text||"");
      if(key!==null&&choices.some(c=>c.id!==q.correctChoiceId&&literalValue(c.math||c.text||"")===key))signals.push("Multiple choices have the same numeric value as the keyed answer.");
    }
    return {hasAnswer,valid:valid&&!signals.length,signals};
  }
  if(["short_response","numeric_entry","expression_entry","grid_in"].includes(q.type)){
    const keys=(q.correctTextAnswers||[]).filter(key=>typeof key==="string"&&key.trim());
    return {hasAnswer:keys.length>0,valid:keys.length>0&&(q.type==="short_response"||keys.every(isMathAnswerComplete)),signals};
  }
  if(q.type==="graph_point_select"){
    const points=q.graph?.points||[], keys=q.correctPointIds||[];
    return {hasAnswer:keys.length>0,valid:keys.length>0&&hasUniqueIds(points)&&unique(keys).length===keys.length&&keys.every(id=>points.some(p=>p.id===id)),signals};
  }
  if(q.type==="number_line_response"){
    const n=q.numberLineResponse; const hasAnswer=n?.correctValue!==null&&n?.correctValue!==undefined;
    return {hasAnswer,valid:Boolean(hasAnswer&&n&&Number.isFinite(n.correctValue)&&n.min<n.max&&n.tickStep>0&&n.labelStep>0&&n.correctValue!>=n.min&&n.correctValue!<=n.max&&["left","right"].includes(n.correctDirection)&&["open","closed"].includes(n.correctEndpoint)),signals};
  }
  if(q.type==="inline_dropdown"){
    const list=q.dropdowns||[];const hasAnswer=list.length>0&&list.every(d=>Boolean(d.correctChoiceId));
    return {hasAnswer,valid:hasAnswer&&hasUniqueIds(list)&&list.every(d=>d.options.length>=2&&hasUniqueIds(d.options)&&d.options.some(o=>o.id===d.correctChoiceId)),signals};
  }
  if(q.type==="math_drag_drop"||q.type==="transition_drop"){
    const slots=q.dragDropSlots||[],items=q.type==="transition_drop"?q.choices||[]:q.items||[];
    const hasAnswer=slots.length>0&&slots.every(s=>Boolean(s.correctItemId));
    return {hasAnswer,valid:hasAnswer&&hasUniqueIds(slots)&&hasUniqueIds(items)&&slots.every(s=>items.some(i=>i.id===s.correctItemId))&&(q.allowReuse===true||unique(slots.map(s=>s.correctItemId)).length===slots.length),signals};
  }
  if(["category_sort","matrix_choice","table_match"].includes(q.type)){
    const entries=Object.entries(q.correctPlacements||{}), hasAnswer=entries.length>0;
    return {hasAnswer,valid:hasAnswer&&entries.every(([id,target])=>q.items?.some(i=>i.id===id)&&q.categories?.some(c=>c.id===target))&&(q.requiredPlacements===undefined||q.requiredPlacements===entries.length),signals};
  }
  return {hasAnswer:false,valid:false,signals:["This response type is not supported by automatic exam grading."]};
}

function literalValue(input:string) {
  const value=normalizeMathAnswer(input);
  if(value.length>200)return null;
  const reduce=(n:bigint,d:bigint)=>{if(d===0n)return null;if(d<0n){n=-n;d=-d;}let a=n<0n?-n:n,b=d;while(b){const next=a%b;a=b;b=next;}return `${n/a}/${d/a}`;};
  if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)){
    const negative=value.startsWith("-"),parts=value.replace(/^[+-]/,"").split("."),decimals=parts[1]||"";
    return reduce(BigInt((parts[0]||"0")+decimals)*(negative?-1n:1n),10n**BigInt(decimals.length));
  }
  const fraction=value.match(/^([+-]?\d+)\/([+-]?\d+)$/)||value.match(/^\\frac\{([+-]?\d+)\}\{([+-]?\d+)\}$/);
  return fraction?reduce(BigInt(fraction[1]),BigInt(fraction[2])):null;
}

export function reviewMathQuestion(record: MathQuestionRecord,taxonomy:MathTaxonomy,duplicateKinds:MathDuplicateKind[]=[]): MathReviewIssue[] {
  const q=effectiveMathQuestion(record),m=record.metadata||{},issues:MathReviewIssue[]=[];
  const category=taxonomy.categories.find(c=>c.label===q.topic);
  if(!words(q.topic))issues.push("missing_category");
  if(!words(q.subtopic))issues.push("missing_subcategory");
  if(words(q.topic)&&(!category||words(q.subtopic)&&!category.topics.includes(q.subtopic!)))issues.push("invalid_classification");
  if(m.diagnosticSkill&&taxonomy.skills?.length&&!taxonomy.skills.some(s=>(s.id===m.diagnosticSkill||s.label===m.diagnosticSkill)&&s.category===q.topic&&s.subcategory===q.subtopic))issues.push("invalid_classification");
  if(!mathDifficulties.includes(m.difficulty!))issues.push("missing_difficulty");
  if(!words(m.source)&&!record.sources.some(s=>words(s.source||s.title)))issues.push("missing_source");
  const answer=mathAnswerStatus(q);if(!answer.hasAnswer)issues.push("missing_answer");else if(!answer.valid)issues.push("invalid_answer");
  if(!hasRichContent(q.explanation,q.explanationHtml))issues.push("missing_explanation");
  const images=imagesIn(q);
  if(m.requiresDiagram&&!images.length&&!q.graph&&!q.numberLineResponse&&!q.choices?.some(c=>c.numberLine))issues.push("missing_diagram");
  const rich=[q.promptHtml,q.instructionsHtml,q.stimulusHtml,q.explanationHtml,...(q.choices||[]).map(c=>c.html)].filter(Boolean).join(" ");
  if(!hasRichContent(q.prompt,q.promptHtml)||/<(?:script|iframe)\b|javascript\s*:|\bon\w+\s*=/i.test(rich)||/\\placeholder\b|\[\[MISSING|\[IMAGE MISSING\]/i.test([q.prompt,q.promptHtml,q.stimulus].join(" ")))issues.push("invalid_formatting");
  if(m.reviewStatus==="needs_review"||(q as ExamQuestion&{importNeedsEditing?:boolean}).importNeedsEditing)issues.push("teacher_review");
  if(m.reviewStatus!=="reviewed"&&duplicateKinds.some(k=>k!=="template"))issues.push("possible_duplicate");
  return unique(issues);
}

export function buildMathCommandCatalog(records:MathQuestionRecord[],taxonomy:MathTaxonomy,options:{performance?:Record<string,MathQuestionPerformance>;includeDuplicates?:boolean}={}):MathCatalog {
  const duplicateResult=options.includeDuplicates===false?{groups:[] as MathDuplicateGroup[],search:{comparedPairs:0,blockedLargeGroups:0,description:"Duplicate scan omitted."}}:findMathDuplicates(records);
  const kinds=new Map<string,MathDuplicateKind[]>();
  for(const group of duplicateResult.groups)for(const id of group.questionIds)kinds.set(id,unique([...(kinds.get(id)||[]),group.kind]));
  const rows=records.map(record=>{
    const q=effectiveMathQuestion(record),m=record.metadata||{},duplicateKinds=kinds.get(record.id)||[],issues=reviewMathQuestion(record,taxonomy,duplicateKinds), answer=mathAnswerStatus(q);
    const representations:MathRepresentation[]=unique([...(m.representations||[]),...(imagesIn(q).length?["diagram" as const]:[]),...(q.graph||q.numberLineResponse||q.choices?.some(c=>c.numberLine)?["graph" as const]:[]),...(/<table\b/i.test([q.promptHtml,q.stimulusHtml].join(" "))||q.tableHeaders?["table" as const]:[])]);
    return {id:record.id,prompt:mathPlainText(q.promptHtml||q.prompt).slice(0,600),type:q.type,category:words(q.topic),subcategory:words(q.subtopic),diagnosticSkill:words(m.diagnosticSkill),secondarySkills:m.secondarySkills||[],difficulty:mathDifficulties.includes(m.difficulty!)?m.difficulty!:"",source:words(m.source)||unique(record.sources.map(s=>s.source||s.title)).join("; "),sourceQuestionId:words(m.sourceQuestionId),sources:record.sources,years:unique(record.sources.flatMap(s=>s.year?[s.year]:[])),forms:unique(record.sources.flatMap(s=>s.form?[s.form]:[])),standards:m.standards||[],representations,context:words(m.context),importedAt:m.importedAt&&Number.isFinite(Date.parse(m.importedAt))?m.importedAt:null,issues,ready:issues.length===0,hasAnswer:answer.hasAnswer&&answer.valid,hasExplanation:hasRichContent(q.explanation,q.explanationHtml),duplicateKinds,performance:options.performance?.[record.id]||null} as MathCatalogRow;
  });
  return {rows,duplicates:duplicateResult.groups,duplicateSearch:duplicateResult.search};
}

export function queryMathCommandCatalog(catalog:MathCatalog,filters:MathCatalogFilters={}):MathCatalogPage {
  const matches=(values:string[]|undefined,value:string|string[])=>!values?.length||values.some(v=>(Array.isArray(value)?value:[value]).includes(v));
  const ids=filters.collectionQuestionIds?new Set(filters.collectionQuestionIds):null,exclude=new Set(filters.excludeQuestionIds||[]);
  const terms=words(filters.search).toLowerCase().split(/\s+/).filter(Boolean);
  const rows=catalog.rows.filter(row=>{
    if(ids&&!ids.has(row.id)||exclude.has(row.id))return false;
    if(!matches(filters.category,row.category)||!matches(filters.subcategory,row.subcategory)||!matches(filters.diagnosticSkill,row.diagnosticSkill)||!matches(filters.secondarySkill,row.secondarySkills)||!matches(filters.standard,row.standards.filter(s=>s.verified).map(s=>s.code))||!matches(filters.difficulty,row.difficulty||"unclassified")||!matches(filters.responseType,row.type)||!matches(filters.source,[row.source,...row.sources.map(s=>s.source||s.title)])||!matches(filters.year,row.years)||!matches(filters.form,row.forms)||!matches(filters.assessmentId,row.sources.map(s=>s.assessmentId)))return false;
    if(terms.length){const haystack=[row.id,row.prompt,row.category,row.subcategory,row.diagnosticSkill,...row.secondarySkills,row.source,row.context,...row.sources.map(s=>s.title)].join(" ").toLowerCase();if(!terms.every(term=>haystack.includes(term)))return false;}
    if(filters.context&&!row.context.toLowerCase().includes(filters.context.toLowerCase()))return false;
    for(const type of ["diagram","graph","table"] as const)if(filters[type]!==undefined&&row.representations.includes(type)!==filters[type])return false;
    if(filters.issue?.length&&!filters.issue.some(issue=>row.issues.includes(issue)))return false;
    if(filters.status==="ready"&&!row.ready||filters.status==="needs_review"&&!row.issues.length||filters.status==="possible_duplicate"&&!row.duplicateKinds.length)return false;
    if(filters.status==="never_assigned"&&row.performance?.assignmentCount!==0||filters.status==="previously_assigned"&&!(row.performance?.assignmentCount!>0))return false;
    return true;
  });
  const field=filters.sort||"category",direction=filters.direction==="desc"?-1:1;
  const sortValue=(row:MathCatalogRow):string|number|null=>{
    if(field==="difficulty")return row.difficulty?mathDifficulties.indexOf(row.difficulty):null;
    if(field==="importedAt")return row.importedAt;
    if(["attempts","accuracy","incorrect","unanswered","lastAssignedAt"].includes(field))return row.performance?.[field as "attempts"|"accuracy"|"incorrect"|"unanswered"|"lastAssignedAt"]??null;
    return row[field as "category"|"subcategory"|"source"|"id"];
  };
  rows.sort((a,b)=>{const x=sortValue(a),y=sortValue(b);if(x===null||y===null)return x===y?a.id.localeCompare(b.id):x===null?1:-1;const order=typeof x==="number"&&typeof y==="number"?x-y:String(x).localeCompare(String(y),undefined,{numeric:true});return direction*order||a.subcategory.localeCompare(b.subcategory)||a.id.localeCompare(b.id);});
  const pageSize=Math.min(100,Math.max(1,Math.floor(filters.pageSize||50))),pages=Math.max(1,Math.ceil(rows.length/pageSize)),page=Math.min(pages,Math.max(1,Math.floor(filters.page||1)));
  return {items:rows.slice((page-1)*pageSize,page*pageSize),total:rows.length,page,pageSize,pages};
}

export function validateMathCatalogFilters(value:unknown):MathCatalogFilters {
  let parsed:unknown;
  try{parsed=typeof value==="string"?JSON.parse(value):value??{};}catch{throw new Error("Invalid saved question filters.");}
  if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)||JSON.stringify(parsed).length>250_000)throw new Error("Invalid question filters.");
  const filter=parsed as Record<string,unknown>;
  const lists=["category","subcategory","diagnosticSkill","secondarySkill","standard","difficulty","responseType","source","year","form","assessmentId","issue","collectionQuestionIds","excludeQuestionIds"];
  const strings=["search","context","status","sort","direction"],numbers=["page","pageSize"],booleans=["diagram","graph","table"];
  if(Object.keys(filter).some(key=>![...lists,...strings,...numbers,...booleans].includes(key)))throw new Error("Unsupported question filter.");
  for(const key of lists)if(filter[key]!==undefined&&(!Array.isArray(filter[key])||(filter[key] as unknown[]).length>10000||(filter[key] as unknown[]).some(item=>typeof item!=="string"||item.length>2000)))throw new Error(`Invalid ${key} filter.`);
  for(const key of strings)if(filter[key]!==undefined&&(typeof filter[key]!=="string"||String(filter[key]).length>2000))throw new Error(`Invalid ${key} filter.`);
  for(const key of numbers)if(filter[key]!==undefined&&(!Number.isInteger(filter[key])||Number(filter[key])<1))throw new Error(`Invalid ${key}.`);
  for(const key of booleans)if(filter[key]!==undefined&&typeof filter[key]!=="boolean")throw new Error(`Invalid ${key} filter.`);
  if(filter.difficulty&&(filter.difficulty as string[]).some(d=>![...mathDifficulties,"unclassified"].includes(d)))throw new Error("Invalid difficulty filter.");
  if(filter.issue&&(filter.issue as string[]).some(d=>!(d in mathReviewIssueLabels)))throw new Error("Invalid review filter.");
  if(filter.status!==undefined&&!["ready","needs_review","never_assigned","previously_assigned","possible_duplicate"].includes(String(filter.status)))throw new Error("Invalid status filter.");
  if(filter.sort!==undefined&&!["category","subcategory","difficulty","importedAt","attempts","accuracy","incorrect","unanswered","lastAssignedAt","source","id"].includes(String(filter.sort)))throw new Error("Invalid sort field.");
  if(filter.direction!==undefined&&!["asc","desc"].includes(String(filter.direction)))throw new Error("Invalid sort direction.");
  return structuredClone(filter) as MathCatalogFilters;
}

export function summarizeMathCommandCatalog(catalog:MathCatalog,taxonomy:MathTaxonomy,targets:MathInventoryTargets={}):MathCatalogSummary {
  const reviewCounts=Object.fromEntries(Object.keys(mathReviewIssueLabels).map(key=>[key,0])) as Record<MathReviewIssue,number>;
  const empty=()=>({easy:0,medium:0,hard:0,expert:0,unclassified:0});
  const coverage=new Map<string,MathCoverageRow>();
  const get=(category:string,subcategory:string)=>{const key=JSON.stringify([category,subcategory]);if(!coverage.has(key))coverage.set(key,{category,subcategory,total:0,ready:0,needsReview:0,missingExplanation:0,difficulties:empty(),readyDifficulties:empty(),gaps:[]});return coverage.get(key)!;};
  taxonomy.categories.forEach(c=>{get(c.label,"");c.topics.forEach(topic=>get(c.label,topic));});
  for(const row of catalog.rows){for(const issue of row.issues)reviewCounts[issue]++;for(const group of unique([get(row.category||"Uncategorized",""),get(row.category||"Uncategorized",row.subcategory||"Unclassified")])){group.total++;if(row.ready)group.ready++;else group.needsReview++;if(!row.hasExplanation)group.missingExplanation++;group.difficulties[row.difficulty||"unclassified"]++;if(row.ready)group.readyDifficulties[row.difficulty||"unclassified"]++;}}
  for(const row of coverage.values())if(row.subcategory)row.gaps=mathDifficulties.flatMap(difficulty=>{const configured=targets.overrides?.find(t=>t.category===row.category&&t.subcategory===row.subcategory&&t.difficulty===difficulty)?.minimum??targets.defaultPerDifficulty??10;const target=Number.isFinite(configured)?Math.max(0,Math.floor(configured)):10;const available=row.readyDifficulties[difficulty];return available<target?[{difficulty,available,target,shortage:target-available}]:[];});
  return {total:catalog.rows.length,ready:catalog.rows.filter(r=>r.ready).length,needsReview:catalog.rows.filter(r=>!r.ready).length,categories:taxonomy.categories.length,subcategories:taxonomy.categories.reduce((n,c)=>n+c.topics.length,0),reviewCounts,coverage:[...coverage.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.subcategory.localeCompare(b.subcategory)),duplicateGroups:{exact:catalog.duplicates.filter(g=>g.kind==="exact").length,possible:catalog.duplicates.filter(g=>g.kind==="possible").length,template:catalog.duplicates.filter(g=>g.kind==="template").length}};
}

export function mathCatalogCsv(rows:MathCatalogRow[]) {
  const escape=(value:unknown)=>{let text=String(value??"");if(/^\s*[=+\-@]|^[\t\r]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
  const headers=["question_id","category","subcategory","diagnostic_skill","secondary_skills","difficulty","source","exam_ids","exam_years","exam_forms","response_type","verified_standards","ready","review_issues","attempts","accuracy","last_assigned"];
  return [headers,...rows.map(row=>[row.id,row.category,row.subcategory,row.diagnosticSkill,row.secondarySkills.join(" | "),row.difficulty,row.source,row.sources.map(s=>s.assessmentId).join(" | "),row.years.join(" | "),row.forms.join(" | "),row.type,row.standards.filter(s=>s.verified).map(s=>s.code).join(" | "),row.ready,row.issues.join(" | "),row.performance?.attempts,row.performance?.accuracy,row.performance?.lastAssignedAt])].map(row=>row.map(escape).join(",")).join("\r\n");
}
