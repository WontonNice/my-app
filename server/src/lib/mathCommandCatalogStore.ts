import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import type { ExamContent, ExamQuestion } from "../shared/examTypes";
import type { QuestionBank } from "../shared/questionBank";
import { validateMathCatalogFilters } from "../shared/mathCommandCatalog";
import { validMathRules } from "../shared/mathCommandAnalytics";
import type { MathCatalogFilters, MathDiagnosticSkill, MathInventoryTargets, MathQuestionMetadata, MathQuestionRecord, MathTaxonomy } from "../shared/mathCommandTypes";
import { defaultMathDiagnosticSkills } from "../shared/mathCommandTaxonomy";
import { resolveSkilled, skilledTbd } from '../shared/mathClassificationSkills';

export type MathManagementState = {
  classificationSkills?: import('../shared/mathClassificationSkills').MathClassificationSkill[];
  retiredClassificationSkillIds?: string[];
  revision: string;
  taxonomyTopicRenames?: {category:string;from:string;to:string}[];
  teacherLabels?: Record<string, import("../shared/teacherLabels").TeacherLabels>;
  taxonomy?: MathTaxonomy;
  metadata: Record<string, MathQuestionMetadata & { category?: string; subcategory?: string }>;
  savedViews: { id: string; name: string; filters: MathCatalogFilters }[];
  collections: { id: string; name: string; questionIds: string[] }[];
  targets: MathInventoryTargets;
  skills: MathDiagnosticSkill[];
  rules: Record<string, number>;
  pacePerWeek: number;
  history: { id: string; revision: string; at: string; actor: string; before: MathManagementState["metadata"]; after: MathManagementState["metadata"] }[];
};
export const mathCommandRoot = path.resolve(__dirname, "../../..");
export type MathCommandStateContext = {root:string;state:MathManagementState;originalRevision:string|null;dirty:boolean};
const stateContext = new AsyncLocalStorage<MathCommandStateContext>();
export const runMathCommandStateContext = <T>(context:MathCommandStateContext,operation:()=>T):T => stateContext.run(context,operation);
export function currentMathCommandStateContext(root=mathCommandRoot) {
  const context=stateContext.getStore();return context&&path.resolve(context.root)===path.resolve(root)?context:undefined;
}
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fail = (message: string, status = 400) => Object.assign(new Error(message), { status });
const plain = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));
const read = <T>(file: string, fallback: T): T => { try { return JSON.parse(fs.readFileSync(file, "utf8")) as T; } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback; throw error; } };
const statePath = (root: string) => path.join(root, "server/data/math-command.json");

export function readMathCommandState(root = mathCommandRoot): MathManagementState {
  const context=currentMathCommandStateContext(root);
  if(context)return structuredClone(context.state);
  const saved = read<Partial<MathManagementState>>(statePath(root), {});
  const state = { metadata: {}, savedViews: [], collections: [], targets: { defaultPerDifficulty: 10 }, skills: structuredClone(defaultMathDiagnosticSkills),
    rules: { targetAccuracy: 70, minAttempts: 5, minUniqueQuestions: 3, minAssessments: 2, recentDays: 90, recentMinAttempts: 3, trendMinAttempts: 3, trendDifference: 10 }, pacePerWeek: 20, history: [], ...saved };
  return { ...state, revision: saved.revision || hash(state) } as MathManagementState;
}

export function readMathCommandTaxonomy(root = mathCommandRoot): MathTaxonomy {
  const taxonomy = read<MathTaxonomy>(path.join(root, "tools/math-topics.json"), { categories: [] });
  const state = readMathCommandState(root);
  return { ...(state.taxonomy ?? taxonomy), skills: state.skills, classificationSkills: state.classificationSkills??[] };
}

export function readMathCommandCatalog(root = mathCommandRoot): MathQuestionRecord[] {
  const content = read<Record<string, ExamContent>>(path.join(root, "server/data/exam-content.json"), {});
  const state = readMathCommandState(root);
  const importStatus = read<Record<string,{needsEditing?:boolean;source?:string}>>(path.join(root,"tools/.content-drafts/math-import-status.json"),{});
  const publishedReview=read<{schemaVersion:number;needsEditingQuestionIds:string[]}>(path.join(root,"server/data/math-import-review.json"),{schemaVersion:1,needsEditingQuestionIds:[]});
  const draftIds=new Set(publishedReview.needsEditingQuestionIds),localFlags=new Map<string,boolean[]>();
  const canonicalSources=new Set(Object.values(content).flatMap(exam=>(exam.mathSection?.questions||[]).map(question=>JSON.stringify([exam.assessmentId,question.id]))));
  for(const [identity,status]of Object.entries(importStatus))try{const parsed=JSON.parse(identity);if(Array.isArray(parsed)&&canonicalSources.has(JSON.stringify(parsed))&&typeof status.needsEditing==="boolean")localFlags.set(parsed[1],[...(localFlags.get(parsed[1])||[]),status.needsEditing]);}catch{/* Non-canonical legacy status entries do not identify a question. */}
  for(const [id,flags]of localFlags){if(flags.some(Boolean))draftIds.add(id);else draftIds.delete(id);}
  const records = new Map<string, MathQuestionRecord>();
  for (const exam of Object.values(content)) {
    for (const [index, question] of (exam.mathSection?.questions ?? []).entries()) {
      const previous = records.get(question.id);
      const year = exam.title.match(/\b(20\d{2}(?:[-–]20\d{2})?)\b/)?.[1];
      const form = exam.title.match(/\bform\s+([a-z0-9]+)/i)?.[1]?.toUpperCase();
      const source = { assessmentId: exam.assessmentId, title: exam.title, number: index + 1, ...(year ? { year } : {}), ...(form ? { form } : {}), source: exam.title };
      if (previous) {
        previous.sources.push(source);
        if(draftIds.has(question.id))previous.metadata={...previous.metadata,reviewStatus:"needs_review"};
      }
      else records.set(question.id, { id: question.id, question, sources: [source], ...(draftIds.has(question.id) ? {metadata:{reviewStatus:"needs_review" as const}} : {}) });
    }
  }
  const bank = read<QuestionBank>(path.join(root, "server/data/question-bank.json"), { revision: 0, questions: [], sets: [] });
  for (const item of bank.questions.filter(question => question.subject === "Math")) {
    if (records.has(item.id)) continue;
    const question: ExamQuestion = { id: item.id, type: "multiple_choice", topic: item.topic, prompt: item.prompt, choices: item.choices, correctChoiceId: item.correctChoiceId, explanation: item.explanation, image: item.visualImage };
    records.set(item.id, { id: item.id, question, sources: bank.sets.filter(set => set.questionIds.includes(item.id)).map(set => ({ assessmentId: set.id, title: set.title, number: set.questionIds.indexOf(item.id) + 1, source: set.source })), metadata: { source: item.source, importedAt: item.capturedAt, ...(item.status === "draft" ? {reviewStatus:"needs_review" as const} : {}), ...(item.difficulty !== "unknown" ? { difficulty: item.difficulty === "elite" ? "expert" : item.difficulty } : {}) } });
  }
  return [...records.values()].map(record => {
    const metadata = { ...record.metadata, ...state.metadata[record.id] };
    metadata.skilled=resolveSkilled(metadata.skilled??record.question.skilled,metadata.category??record.question.topic,metadata.subcategory??record.question.subtopic,state.classificationSkills??[]);
    // A manual duplicate-review acknowledgement cannot publish an imported draft.
    if(record.metadata?.reviewStatus==="needs_review")metadata.reviewStatus="needs_review";
    return { ...record, question: { ...record.question, skilled:metadata.skilled, ...(metadata.category !== undefined ? { topic: metadata.category } : {}), ...(metadata.subcategory !== undefined ? { subtopic: metadata.subcategory } : {}) }, metadata };
  });
}

export function mathClassificationRevision(root = mathCommandRoot) {
  const state = readMathCommandState(root);
  return hash({metadata: state.metadata, taxonomy: state.taxonomy, classificationSkills:state.classificationSkills});
}

export function syncMathNativeClassifications(root:string,questions:ExamQuestion[],expectedRevision?:string) {
  const state=readMathCommandState(root);let changed=false;
  // A source save can yield between its initial guard and this synchronization.
  // Preserve newer overlays; they remain effective until the editor is refreshed.
  if(expectedRevision!==undefined&&state.revision!==expectedRevision&&mathClassificationRevision(root)!==expectedRevision)return;
  for(const question of questions){const metadata=state.metadata[question.id];if(!metadata)continue;
    // Legacy callers without a revision may only retire already-persisted values.
    if(expectedRevision===undefined&&((metadata.category!==undefined&&metadata.category!==question.topic)||(metadata.subcategory!==undefined&&metadata.subcategory!==question.subtopic)||(metadata.skilled!==undefined&&metadata.skilled!==question.skilled)))continue;
    if(metadata.category!==undefined||metadata.subcategory!==undefined||metadata.skilled!==undefined){delete metadata.category;delete metadata.subcategory;delete metadata.skilled;changed=true;}
  }
  if(changed)commitMathCommandState(root,state.revision,state);
}

// Only management metadata and references live here. Question content, results,
// assignments and keys continue to live in their existing authoritative stores.
export function commitMathCommandState(root: string, expected: string, state: MathManagementState) {
  const context=currentMathCommandStateContext(root);
  if(context){
    if(context.state.revision!==expected)throw fail("Math management changed in another window. Reload before saving.",409);
    state.revision=randomUUID();context.state=structuredClone(state);context.dirty=true;return state;
  }
  const file = statePath(root), temporary = file + `.${randomUUID()}.tmp`, lock=file+".lock";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Content Studio and the authenticated API can run in separate processes.
  // Exclusive creation makes the revision check and replacement one transaction.
  let descriptor:number;
  try{descriptor=fs.openSync(lock,"wx");}catch(error){if((error as NodeJS.ErrnoException).code==="EEXIST")throw fail("Another Math Command Center save is in progress. Retry after it finishes.",409);throw error;}
  try {
    if (readMathCommandState(root).revision !== expected) throw fail("Math management changed in another window. Reload before saving.", 409);
    state.revision = randomUUID();
    fs.writeFileSync(temporary, JSON.stringify(state, null, 2) + "\n");
    if (readMathCommandState(root).revision !== expected) throw fail("Math management changed while saving. Reload and try again.", 409);
    fs.renameSync(temporary, file);
  } finally {
    try{if (fs.existsSync(temporary)) fs.unlinkSync(temporary);}
    finally{fs.closeSync(descriptor);fs.unlinkSync(lock);}
  }
  return state;
}

const cleanString = (value: unknown, label: string, limit = 160) => {
  if (typeof value !== "string" || value.length > limit) throw fail(`${label} must be text of at most ${limit} characters.`);
  return value.trim();
};
const cleanList = (value: unknown, label: string, limit = 50): string[] => {
  if (!Array.isArray(value) || value.length > limit) throw fail(`${label} must be a list with at most ${limit} entries.`);
  return [...new Set(value.map(item => cleanString(item, label)).filter(Boolean))];
};
const metadataFields = new Set(["category", "subcategory", "skilled", "diagnosticSkill", "secondarySkills", "difficulty", "source", "sourceQuestionId", "standards", "representations", "requiresDiagram", "reviewStatus", "importedAt", "context", "notes"]);
export function validateMathMetadataPatch(input: unknown, taxonomy: MathTaxonomy): MathQuestionMetadata & {category?: string; subcategory?: string} {
  if (!plain(input) || !Object.keys(input).length || Object.keys(input).some(key => !metadataFields.has(key))) throw fail("Choose supported metadata fields to change. Question wording and answer keys cannot be edited in bulk.");
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "secondarySkills" || key === "representations") {
      result[key] = cleanList(value, key);
      if (key === "representations" && (result[key] as string[]).some(value => !["diagram", "graph", "table"].includes(value))) throw fail("Choose diagram, graph, or table.");
    } else if (key === "requiresDiagram") { if (typeof value !== "boolean") throw fail("Requires diagram must be true or false."); result[key] = value; }
    else if (key === "standards") {
      if (!Array.isArray(value) || value.length > 30) throw fail("Choose at most 30 standard mappings.");
      result[key] = value.map(mapping => {
        if (!plain(mapping) || typeof mapping.verified !== "boolean") throw fail("Standards must explicitly state whether the mapping was teacher verified.");
        const code = cleanString(mapping.code, "Standard code", 50);
        const referenceUrl = cleanString(mapping.referenceUrl ?? "", "Standard reference", 1000);
        if (!code || referenceUrl && !/^https:\/\//i.test(referenceUrl)) throw fail("Standards need a code and a valid HTTPS reference.");
        if (mapping.verified && !referenceUrl) throw fail("Verified standards require a source reference.");
        return { code, verified: mapping.verified, ...(referenceUrl ? { referenceUrl } : {}), ...(mapping.note ? { note: cleanString(mapping.note, "Mapping note", 1500) } : {}) };
      });
    } else result[key] = cleanString(value, key, key === "notes" ? 4000 : 200);
  }
  if (result.difficulty && !["easy", "medium", "hard", "expert"].includes(String(result.difficulty))) throw fail("Choose Easy, Medium, Hard, or Expert.");
  if (result.reviewStatus && !["needs_review", "reviewed"].includes(String(result.reviewStatus))) throw fail("Choose a valid review status.");
  if (result.importedAt && !Number.isFinite(Date.parse(String(result.importedAt)))) throw fail("Imported date must be a valid date.");
  if (result.category && !taxonomy.categories.some(category => category.label === result.category)) throw fail("Choose an existing main category.");
  if('skilled'in result&&!result.skilled)result.skilled=skilledTbd;
  if(result.skilled&&result.skilled!==skilledTbd&&!taxonomy.classificationSkills?.some(skill=>skill.id===result.skilled))throw fail("Choose a configured Skilled definition, or TBD.");
  if (result.diagnosticSkill && !taxonomy.skills?.some(skill => skill.id === result.diagnosticSkill)) throw fail("Choose a configured diagnostic skill.");
  return result;
}

type BulkPreview = { token: string; root: string; revision: string; sourceRevision: string; actor: string; expires: number; ids: string[]; patch: ReturnType<typeof validateMathMetadataPatch>; changes: {id: string; fields: {field: string; before: unknown; after: unknown}[]}[] };
const previews = new Map<string, BulkPreview>();
export function previewMathMetadata(root: string, input: {questionIds?: unknown; patch?: unknown; revision?: string}, actor: string) {
  const state = readMathCommandState(root);
  if (input.revision !== state.revision) throw fail("Reload the Math Command Center before changing metadata.", 409);
  const ids = cleanList(input.questionIds, "Question selection", 1000);
  if (!ids.length) throw fail("Select at least one question.");
  const taxonomy = readMathCommandTaxonomy(root), patch = validateMathMetadataPatch(input.patch, taxonomy);
  const records = new Map(readMathCommandCatalog(root).map(record => [record.id, record]));
  const changes = ids.map(id => {
    const record = records.get(id); if (!record) throw fail(`Question ${id} no longer exists.`, 409);
    const category = patch.category ?? record.question.topic, subcategory = patch.subcategory ?? record.question.subtopic;
    if (("category" in patch || "subcategory" in patch) && subcategory && !taxonomy.categories.find(item => item.label === category)?.topics.includes(subcategory)) throw fail(`Select a subcategory under ${category} for ${id}.`);
    const assignedSkilled=patch.skilled??record.metadata?.skilled??skilledTbd;
    if(assignedSkilled!==skilledTbd&&resolveSkilled(assignedSkilled,category,subcategory,taxonomy.classificationSkills)!==assignedSkilled)throw fail(`Choose a Skilled definition under ${category} / ${subcategory}, or choose TBD.`);
    const diagnostic = patch.diagnosticSkill ?? record.metadata?.diagnosticSkill;
    const skill = taxonomy.skills?.find(skill => skill.id === diagnostic);
    if (skill && (skill.category !== category || skill.subcategory !== subcategory)) throw fail(`Diagnostic skill ${skill.label} does not belong to ${category} / ${subcategory}. Clear or change the skill with the classification.`);
    return { id, fields: Object.entries(patch).map(([field, after]) => ({ field, before: field === "category" ? record.question.topic : field === "subcategory" ? record.question.subtopic || "" : (record.metadata as Record<string, unknown> | undefined)?.[field] ?? "", after })) };
  });
  for (const [token, preview] of previews) if (preview.expires < Date.now()) previews.delete(token);
  if (previews.size > 100) previews.delete(previews.keys().next().value!);
  const token = randomUUID();
  previews.set(token, { token, root: path.resolve(root), revision: state.revision, sourceRevision: hash(ids.map(id => records.get(id))), actor, expires: Date.now() + 15 * 60_000, ids, patch, changes });
  return { token, count: ids.length, changes, revision: state.revision };
}

export function applyMathMetadata(root: string, token: string, actor: string) {
  const preview = previews.get(token);
  if (!preview || preview.root !== path.resolve(root) || preview.actor !== actor || preview.expires < Date.now()) throw fail("Preview these changes again before applying them.", 409);
  const state = readMathCommandState(root);
  if (state.revision !== preview.revision) throw fail("Metadata changed after this preview. Review a fresh preview.", 409);
  const records = new Map(readMathCommandCatalog(root).map(record => [record.id, record]));
  if (hash(preview.ids.map(id => records.get(id))) !== preview.sourceRevision) throw fail("Question content changed after this preview. Preview again.", 409);
  const before: MathManagementState["metadata"] = {}, after: MathManagementState["metadata"] = {};
  for (const id of preview.ids) { before[id] = state.metadata[id] ?? {}; after[id] = { ...before[id], ...preview.patch }; state.metadata[id] = after[id]; }
  const undoToken = randomUUID();
  state.history = [...state.history.slice(-39), {id: undoToken, revision: state.revision, at: new Date().toISOString(), actor, before, after}];
  const saved = commitMathCommandState(root, state.revision, state); previews.delete(token);
  return { undoToken, changed: preview.ids.length, revision: saved.revision };
}

export function undoMathMetadata(root: string, token: string, actor: string) {
  const state = readMathCommandState(root), change = state.history.find(item => item.id === token);
  if (!change || change.actor !== actor) throw fail("This change is not available to undo.", 409);
  for (const [id, after] of Object.entries(change.after)) if (hash(state.metadata[id]) !== hash(after)) throw fail("These questions changed after that edit. Undo would overwrite newer work.", 409);
  for (const [id, before] of Object.entries(change.before)) { if (Object.keys(before).length) state.metadata[id] = before; else delete state.metadata[id]; }
  state.history = state.history.filter(item => item.id !== token);
  return { revision: commitMathCommandState(root, state.revision, state).revision, changed: Object.keys(change.before).length };
}

export function saveMathCommandPreferences(root: string, input: unknown) {
  if (!plain(input)) throw fail("Invalid math preferences.");
  const state = readMathCommandState(root);
  if (input.revision !== state.revision) throw fail("Preferences changed. Reload before saving.", 409);
  const recordIds = new Set(readMathCommandCatalog(root).map(record => record.id));
  if (input.savedViews !== undefined) {
    if (!Array.isArray(input.savedViews) || input.savedViews.length > 100) throw fail("Keep at most 100 saved views.");
    state.savedViews = input.savedViews.map(view => {
      if (!plain(view) || !plain(view.filters)) throw fail("Invalid saved filter.");
      const id=cleanString(view.id,"View ID"),name=cleanString(view.name,"View name");if(!id||!name)throw fail("Saved views need an ID and name.");
      try{return {id,name,filters:validateMathCatalogFilters(view.filters)};}catch(error){throw fail((error as Error).message);}
    });
    if(new Set(state.savedViews.map(view=>view.id)).size!==state.savedViews.length)throw fail("Saved view IDs must be unique.");
  }
  if (input.collections !== undefined) {
    if (!Array.isArray(input.collections) || input.collections.length > 200) throw fail("Keep at most 200 collections.");
    state.collections = input.collections.map(collection => { if (!plain(collection)) throw fail("Invalid collection."); const questionIds = cleanList(collection.questionIds, "Collection questions", 10000); if (questionIds.some(id => !recordIds.has(id))) throw fail("A collection references a question that no longer exists."); const id=cleanString(collection.id,"Collection ID"),name=cleanString(collection.name,"Collection name");if(!id||!name)throw fail("Collections need an ID and name.");return {id,name,questionIds}; });
    if(new Set(state.collections.map(collection=>collection.id)).size!==state.collections.length)throw fail("Collection IDs must be unique.");
  }
  if (input.targets !== undefined) {
    if (!plain(input.targets)) throw fail("Invalid inventory targets.");
    const minimum = (value: unknown) => { if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 10000) throw fail("Inventory targets must be whole numbers from 0–10,000."); return Number(value); };
    const overrides = input.targets.overrides ?? [];
    if (!Array.isArray(overrides) || overrides.length > 5000) throw fail("Invalid target overrides.");
    const taxonomy=readMathCommandTaxonomy(root),keys=new Set<string>();
    state.targets = {defaultPerDifficulty:minimum(input.targets.defaultPerDifficulty ?? 10),overrides:overrides.map(item => {
      if (!plain(item) || !["easy","medium","hard","expert"].includes(String(item.difficulty))) throw fail("Choose a valid target difficulty.");
      const category=cleanString(item.category,"Category"),subcategory=cleanString(item.subcategory,"Subcategory"),key=JSON.stringify([category,subcategory,item.difficulty]);
      if(!taxonomy.categories.some(c=>c.label===category&&c.topics.includes(subcategory)))throw fail("Target overrides need an existing category and subcategory.");
      if(keys.has(key))throw fail("Use only one inventory target for each subcategory and difficulty.");keys.add(key);
      return {category,subcategory,difficulty:item.difficulty as "easy"|"medium"|"hard"|"expert",minimum:minimum(item.minimum)};
    })};
  }
  if (input.skills !== undefined) {
    if (!Array.isArray(input.skills) || input.skills.length > 300) throw fail("Keep at most 300 diagnostic skills.");
    const taxonomy = readMathCommandTaxonomy(root);
    const skills = input.skills.map(item => {
      if (!plain(item)) throw fail("Invalid diagnostic skill.");
      const skill = {id:cleanString(item.id,"Skill ID"),label:cleanString(item.label,"Skill name"),category:cleanString(item.category,"Category"),subcategory:cleanString(item.subcategory,"Subcategory"),prerequisiteIds:cleanList(item.prerequisiteIds ?? [],"Prerequisites"),standardReferences:cleanList(item.standardReferences ?? [],"Standards")};
      if (!skill.id || !skill.label || !taxonomy.categories.find(category => category.label === skill.category)?.topics.includes(skill.subcategory)) throw fail("Each diagnostic skill needs an existing category and subcategory.");
      return skill;
    });
    const ids = new Set(skills.map(skill=>skill.id)); if (ids.size!==skills.length) throw fail("Diagnostic skill IDs must be unique.");
    for (const skill of skills) if (skill.prerequisiteIds.some(id=>!ids.has(id)||id===skill.id)) throw fail("Prerequisites must reference another saved skill.");
    const visit=(id:string, stack:Set<string>)=>{ if(stack.has(id)) throw fail("Prerequisites cannot contain a cycle."); const next=new Set([...stack,id]); for(const before of skills.find(skill=>skill.id===id)?.prerequisiteIds??[])visit(before,next); }; skills.forEach(skill=>visit(skill.id,new Set()));
    for(const metadata of Object.values(state.metadata)) if(metadata.diagnosticSkill&&!ids.has(metadata.diagnosticSkill)) throw fail("Reclassify questions before removing a skill in use.");
    state.skills=skills;
  }
  if (input.rules !== undefined) {
    if (!plain(input.rules)) throw fail("Invalid weakness rules.");
    if(Object.keys(input.rules).some(key=>!(key in state.rules)))throw fail("Choose a supported weakness threshold.");
    try{state.rules=validMathRules({...state.rules,...input.rules});}catch(error){throw fail((error as Error).message);}
  }
  if (input.pacePerWeek !== undefined) { if (!Number.isInteger(input.pacePerWeek)||Number(input.pacePerWeek)<1||Number(input.pacePerWeek)>1000)throw fail("Weekly pace must be a whole number from 1–1,000.");state.pacePerWeek=Number(input.pacePerWeek); }
  return commitMathCommandState(root,state.revision,state);
}
