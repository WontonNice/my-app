/** Transfer a complete source adapter package through the existing editor APIs.
 * Default: a disposable authored-content copy. --apply is explicit; nothing
 * connects to student databases, starts an auxiliary server, or deploys.
 */
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {cp, mkdir, mkdtemp, readFile, readdir, writeFile, access} from 'node:fs/promises';
import {basename, dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import documentImport from './document-import.cjs';
import sourceWriter from './write-export-file.cjs';
import {retainSourcePackage} from './source-packages.mjs';

const require=createRequire(import.meta.url);
const toolsRoot=dirname(fileURLToPath(import.meta.url));
const repository=resolve(toolsRoot,'..');
const sha=value=>createHash('sha256').update(value).digest('hex');
const slug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const questionSignature=q=>JSON.stringify(canonical(Object.fromEntries(['type','prompt','promptHtml','stimulus','stimulusHtml','selectionHtml','choices','correctChoiceId','correctChoiceIds','correctTextAnswers','items','categories','correctPlacements'].filter(key=>q[key]!==undefined&&q[key]!=='').map(key=>[key,q[key]]))));
export function auditQuestionFingerprint(question) {
  const copy={...question};
  for(const key of ['topic','subtopic','skilled','commandMetadata','importNeedsEditing','importSource','importNotes','review','source','sourceQuestion','provenance'])delete copy[key];
  return sha(JSON.stringify(canonical(copy)));
}
export function hasSuppliedKey(q) {
  if(q.type==='inline_dropdown')return Boolean(q.dropdowns?.length&&q.dropdowns.every(d=>d.correctChoiceId&&d.options?.some(o=>o.id===d.correctChoiceId)));
  if(q.type==='math_drag_drop'||q.type==='transition_drop'&&q.dragDropSlots?.length)return Boolean(q.dragDropSlots?.length&&q.dragDropSlots.every(s=>s.correctItemId&&(q.items||q.choices)?.some(i=>i.id===s.correctItemId)));
  if(q.type==='graph_point_select')return Boolean(q.correctPointIds?.length);
  if(q.type==='number_line_response')return q.numberLineResponse?.correctValue!==undefined&&q.numberLineResponse?.correctValue!==null;
  if(['matrix_choice','table_match'].includes(q.type))return Boolean(Object.keys(q.correctPlacements||{}).length||Object.keys(q.correctResponses||{}).length||q.rows?.length&&q.rows.every(r=>r.correctChoiceId||r.correctChoiceIds?.length));
  return Boolean(q.correctChoiceId||(q.correctChoiceIds||[]).length||(q.correctTextAnswers||[]).length||Object.keys(q.correctPlacements||{}).length||Object.keys(q.correctResponses||{}).length||q.correctValue!==undefined||q.correctPoint||q.correctPoints);
}
function withAuthoredTypeScript(action) {
  const ts=require('typescript'),previous=require.extensions['.ts'];
  require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(require('node:fs').readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
  try{return action();}finally{if(previous)require.extensions['.ts']=previous;else delete require.extensions['.ts'];}
}
function authoredExam(root,test) {
  return withAuthoredTypeScript(()=>{
    const contentRoot=join(root,'client/src/content/exams');
    for(const file of Object.keys(require.cache))if(file.startsWith(contentRoot+sep))delete require.cache[file];
    const exports=require(join(contentRoot,'tests',test.fileName));
    const exam=Object.values(exports).find(value=>value?.assessmentId===test.assessmentId&&Array.isArray(value.passageSets));
    if(!exam)throw new Error('Canonical exam source could not be read for presentation overlay.');
    return {exam,createSourcePassage:require(join(contentRoot,'formatters.ts')).createSourcePassage};
  });
}

export function remapPresentationQuestion(incoming,base) {
  const result=structuredClone(incoming),maps={};result.id=base.id;
  for(const field of ['choices','items','categories','dropdowns','dragDropSlots','graphPoints']) {
    const source=incoming[field],target=base[field];
    if(!Array.isArray(source)||!Array.isArray(target)||source.length!==target.length)continue;
    const map=new Map();
    result[field]=source.map((item,index)=>{
      const counterpart=field==='graphPoints'?target.find(p=>p.x===item.x&&p.y===item.y)||target[index]:target[index];
      map.set(item.id,counterpart.id);
      const mapped={...item,id:counterpart.id};
      if(field==='dropdowns'&&Array.isArray(item.options)&&Array.isArray(counterpart.options)) {
        const choices=new Map(item.options.map((o,i)=>[o.id,counterpart.options[i]?.id||o.id]));
        mapped.options=item.options.map(o=>({...o,id:choices.get(o.id)}));
        mapped.correctChoiceId=counterpart.correctChoiceId;
      }
      if(field==='dragDropSlots')mapped.correctItemId=counterpart.correctItemId;
      return mapped;
    });maps[field]=map;
  }
  if(incoming.graph?.points&&base.graph?.points) {
    const map=new Map();
    result.graph.points=incoming.graph.points.map(point=>{
      const counterpart=base.graph.points.find(p=>p.x===point.x&&p.y===point.y);
      if(!counterpart)throw new Error(`Graph point (${point.x}, ${point.y}) has no canonical response identity for ${base.id}.`);
      map.set(point.id,counterpart.id);return {...point,id:counterpart.id};
    });maps.graphPoints=map;
  }
  if(incoming.numberLineResponse&&base.numberLineResponse)for(const key of ['correctValue','correctEndpoint','correctDirection'])result.numberLineResponse[key]=base.numberLineResponse[key];
  const remapString=text=>String(text).replace(/\{\{([^}]+)\}\}/g,(token,id)=>`{{${maps.dropdowns?.get(id)||maps.dragDropSlots?.get(id)||id}}}`);
  for(const key of ['prompt','promptHtml','dropdownContentHtml','dragDropContentHtml','stimulusHtml','selectionHtml'])if(typeof result[key]==='string')result[key]=remapString(result[key]);
  for(const key of ['dropdownContent','dragDropContent'])if(Array.isArray(result[key]))result[key]=result[key].map(remapString);
  if(result.correctPlacements)result.correctPlacements=Object.fromEntries(Object.entries(result.correctPlacements).map(([id,target])=>[maps.items?.get(id)||id,maps.categories?.get(target)||target]));
  if(result.correctPointIds)result.correctPointIds=result.correctPointIds.map(id=>maps.graphPoints?.get(id)||id);
  if(result.correctChoiceId)result.correctChoiceId=maps.choices?.get(result.correctChoiceId)||result.correctChoiceId;
  if(result.correctChoiceIds)result.correctChoiceIds=result.correctChoiceIds.map(id=>maps.choices?.get(id)||id);
  return result;
}

function presentationForTransfer(root,test,receipt,inspection) {
  const {exam,createSourcePassage}=authoredExam(root,test);
  const baseQuestions=new Map([...exam.passageSets.flatMap(s=>s.questions),...(exam.standaloneSection?.questions||[]),...(exam.mathSection?.questions||[])].map(q=>[q.id,q]));
  const incomingQuestions=new Map(inspection.entries.flatMap(e=>e.content.questions).map(q=>[q.id,q]));
  const mappings=[...receipt.passages.flatMap(p=>p.sourceQuestionIds.map((sourceId,i)=>({sourceId,id:p.questionIds[i]}))),...receipt.standalone,...(receipt.reusedMath?.mapping||[]).map(p=>({sourceId:p.sourceId,id:p.existingId}))];
  if(!receipt.reusedMath)for(const q of inspection.maths.flatMap(e=>e.content.questions))mappings.push({sourceId:q.id,id:q.id});
  const overrides={questions:{},passages:{}};
  for(const pair of mappings) {
    const incoming=incomingQuestions.get(pair.sourceId),base=baseQuestions.get(pair.id);
    if(!incoming||!base)throw new Error('Presentation question mapping is incomplete: '+pair.sourceId);
    overrides.questions[pair.id]={base:structuredClone(base),question:remapPresentationQuestion(incoming,base)};
  }
  for(const saved of receipt.passages) {
    const entry=inspection.passages.find(e=>sha(documentImport.fingerprint(e))===saved.key);
    const set=exam.passageSets.find(s=>s.passage.id===saved.id);
    if(!entry||!set)throw new Error('Presentation passage mapping is incomplete: '+saved.id);
    overrides.passages[saved.id]={baseLines:structuredClone(set.passage.lines),passage:createSourcePassage({...entry.content,id:saved.id,versionLabel:receipt.title,source:{...inspection.source,...entry.content.source,packageId:receipt.packageId}})};
  }
  return overrides;
}
function verifyPresentation(root,test,expectedCount) {
  const {exam}=authoredExam(root,test);
  const resolved=withAuthoredTypeScript(()=>require(join(root,'server/src/shared/examPresentation.ts')).applyExamPresentation(exam));
  const questions=content=>[...content.passageSets.flatMap(s=>s.questions),...(content.standaloneSection?.questions||[]),...(content.mathSection?.questions||[])];
  const canonicalQuestions=new Map(questions(exam).map(q=>[q.id,q]));
  const rendered=questions(resolved),overrides=exam.presentationOverrides;
  if(rendered.length!==expectedCount||Object.keys(overrides?.questions||{}).length!==expectedCount)throw Error('Source presentation does not cover every question.');
  const grading=['type','correctChoiceId','correctChoiceIds','correctTextAnswers','correctPlacements','correctPointIds','requiredSelections','requiredPlacements','points','textMatchMode'];
  const presentation=['prompt','promptHtml','instructionsHtml','stimulusHtml','explanationHtml','selectionHtml','image','graph','dropdownContentHtml','dragDropContentHtml'];
  for(const q of rendered) {
    const original=canonicalQuestions.get(q.id),overlay=overrides.questions[q.id]?.question;
    if(!overlay)throw Error('Missing source question presentation: '+q.id);
    for(const key of grading)if(!same(q[key],original[key]))throw Error(`Canonical grading changed for ${q.id}: ${key}.`);
    for(const key of presentation)if(!same(q[key],overlay[key]))throw Error(`Source presentation was not applied for ${q.id}: ${key}.`);
    for(const key of ['choices','items','categories','dropdowns','dragDropSlots'])if(original[key]&&q[key]&&!same(q[key].map(item=>item.id),original[key].map(item=>item.id)))throw Error(`Canonical response identities changed for ${q.id}: ${key}.`);
    if(original.numberLineResponse)for(const key of ['correctValue','correctEndpoint','correctDirection'])if(!same(q.numberLineResponse?.[key],original.numberLineResponse[key]))throw Error(`Canonical number-line grading changed for ${q.id}: ${key}.`);
    for(const key of ['dropdowns','dragDropSlots'])if(original[key])for(const item of original[key]) {
      const incoming=q[key]?.find(next=>next.id===item.id),answer=key==='dropdowns'?'correctChoiceId':'correctItemId';
      if(!same(incoming?.[answer],item[answer]))throw Error(`Canonical nested grading changed for ${q.id}: ${key}.`);
    }
  }
  for(const set of resolved.passageSets) {
    const overlay=overrides.passages?.[set.passage.id];
    if(!overlay||!same(set.passage,overlay.passage))throw Error('Source passage presentation was not applied: '+set.passage.id);
  }
  return {questionPresentations:rendered.length,passagePresentations:resolved.passageSets.length,canonicalGradingPreserved:true,responseIdentitiesPreserved:true,sourcePresentationApplied:true};
}
const exists=async path=>access(path).then(()=>true,()=>false);
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const atomicJson=(path,value)=>sourceWriter.writeExportFile(path,JSON.stringify(value,null,2)+'\n');
const configFiles=['client/src/lib/studentMaterials.ts','server/data/assessments.json','tools/content-topics.json','tools/math-topics.json','tools/practice-topics.json','tools/content-studio-glossary.js','tools/content-studio-glossary.d.ts','tools/poem-layout.js','tools/poem-layout.d.ts','tools/exam-labels.json','tools/english-topic-sections.json'];

export async function disposableCopy(repo,scratch) {
  await mkdir(scratch,{recursive:true});
  const root=await mkdtemp(join(scratch,'transfer-'));
  for(const path of ['client/src/content','server/src/shared']) await cp(join(repo,path),join(root,path),{recursive:true});
  for(const path of configFiles) if(await exists(join(repo,path))) {await mkdir(dirname(join(root,path)),{recursive:true});await cp(join(repo,path),join(root,path));}
  const receipts='tools/.content-drafts/source-transfers';
  if(await exists(join(repo,receipts)))await cp(join(repo,receipts),join(root,receipts),{recursive:true});
  await mkdir(join(root,'client/public/exam-images'),{recursive:true});
  await mkdir(join(root,'server/data'),{recursive:true});
  await writeFile(join(root,'server/data/question-bank.json'),'{"revision":0,"questions":[],"sets":[]}\n');
  return root;
}

/** Reuse the real service implementation without its CLI listener. This is the
 * same bounded service-loading technique used by editor-recovery.test.mjs.
 * Fail closed if the startup/root declarations no longer match. */
export async function loadEditorService(root,scratch) {
  let source=await readFile(join(toolsRoot,'content-studio.mjs'),'utf8');
  const marker='if (process.argv.includes("--validate"))';
  const rootDeclaration='const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");';
  if(!source.includes(marker)||!source.includes(rootDeclaration)) throw new Error('Editor module boundary changed; update the bounded service loader before transfer.');
  source=source.split(marker)[0].replace(rootDeclaration,`const workspaceRoot = ${JSON.stringify(resolve(root))};`);
  source=rewriteServiceImports(source);
  await mkdir(scratch,{recursive:true});
  const file=join(scratch,`editor-service-${sha(root+source).slice(0,18)}.mjs`);
  await writeFile(file,source+'\nexport {getState,createExam,saveTest,saveMath,savePassage,saveStandaloneItem,normalizeStandaloneItem,publishDocumentStandalone,documentDrafts,listPassages,normalizePassage};\n');
  return import(pathToFileURL(file).href);
}

/** Only executable import declarations move with the bounded service module.
 * Template literals generate authored files and must keep their relative imports. */
export function rewriteServiceImports(source) {
  const ts=require('typescript');
  const parsed=ts.createSourceFile('content-studio.mjs',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const edits=parsed.statements.filter(ts.isImportDeclaration).flatMap(statement=>{
    const specifier=statement.moduleSpecifier;
    if(!ts.isStringLiteral(specifier))return [];
    const path=specifier.text==='typescript'?require.resolve('typescript'):specifier.text.startsWith('./')?resolve(toolsRoot,specifier.text):null;
    return path?[{start:specifier.getStart(parsed),end:specifier.getEnd(),text:JSON.stringify(pathToFileURL(path).href)}]:[];
  });
  for(const edit of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);
  return source;
}

export function typecheckAuthoredContent(root) {
  const ts=require('typescript');
  const program=ts.createProgram([join(root,'client/src/content/exams/index.ts')],{
    target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,
    strict:true,noEmit:true,skipLibCheck:true,esModuleInterop:true,allowSyntheticDefaultImports:true,resolveJsonModule:true,types:[],
  });
  const errors=ts.getPreEmitDiagnostics(program).filter(d=>d.category===ts.DiagnosticCategory.Error).map(d=>({
    file:d.file?relative(root,d.file.fileName).replaceAll('\\','/'):undefined,
    line:d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:undefined,
    code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,'\n'),
  }));
  return {passed:errors.length===0,scope:'All authored exams and their imported content/shared type graph',errors};
}

function collectQuestions(payload) {
  return [...(payload.passages||[]).flatMap(p=>p.questions||[]),...(payload.englishQuestions||[]),...(payload.mathQuestions||[])];
}

export async function inspectTransfer(inputFile,{assetsFile,expected}={}) {
  inputFile=resolve(inputFile);
  const raw=await readFile(inputFile,'utf8'),payload=JSON.parse(raw);
  const source={...(payload.source||{})};
  for(const [key,alias] of [['sourceId','examId'],['url','sourceUrl'],['label','title']])if(!source[key]&&source[alias])source[key]=source[alias];
  const capturedDocuments=(payload.sourcePackages||[]).flatMap(p=>(p.files||[]).map(file=>({kind:'source-capture',localPath:resolve(dirname(inputFile),file)})));
  if(capturedDocuments.length)source.documents=[...(source.documents||[]),...capturedDocuments];
  const entries=documentImport.parse(JSON.stringify({...payload,source})); // All normalization stays shared; the untouched original is archived.
  const questions=collectQuestions(payload);
  const expectedCount=Number(expected??source.expectedQuestionCount??payload.review?.expectedQuestionCount);
  const errors=[];
  if(!Number.isInteger(expectedCount)||expectedCount<1)errors.push('Declare the independently established expected question count.');
  else if(questions.length!==expectedCount)errors.push(`Expected ${expectedCount} source questions; package contains ${questions.length}.`);
  if(new Set(questions.map(q=>q.id)).size!==questions.length)errors.push('Source question IDs are not unique.');
  const manifestPath=assetsFile?resolve(assetsFile):!source.assets&&await exists(join(dirname(inputFile),'assets.json'))?join(dirname(inputFile),'assets.json'):null;
  const manifest=manifestPath?await json(manifestPath):source.assets||[];
  const assets=Array.isArray(manifest)?manifest:Object.entries(manifest).map(([sourceUrl,asset])=>({...asset,sourceUrl}));
  const checkedAssets=[];
  for(const a of assets) {
    const destination=a.destination||a.url||a.src;
    if(!/^\/exam-images\/[a-zA-Z0-9._-]+$/.test(destination||'')){errors.push(`Invalid local asset destination: ${destination}`);continue;}
    const local=a.localPath||a.file;
    const path=isAbsolute(local||'')?local:resolve(dirname(manifestPath||inputFile),local||'');
    try {const bytes=await readFile(path),hash=sha(bytes);if(a.sha256&&hash!==a.sha256)throw Error('hash mismatch');checkedAssets.push({...a,path,destination,sha256:hash,bytes:bytes.length});}
    catch(error){errors.push(`Asset ${destination}: ${error.message}`);}
  }
  const assetUrls=new Set(checkedAssets.map(a=>a.destination));
  for(const url of new Set(raw.match(/\/exam-images\/[a-zA-Z0-9._-]+/g)||[]))if(!assetUrls.has(url))errors.push(`No source asset for ${url}`);
  for(const q of questions) {
    if(!hasSuppliedKey(q))errors.push(`No supplied grading key for ${q.id} (${q.type}).`);
  }
  const standalone=entries.filter(e=>e.kind==='standalone'||e.kind==='passage'&&!e.content.text?.trim()&&!e.content.richText?.trim());
  const passages=entries.filter(e=>e.kind==='passage'&&!standalone.includes(e));
  const maths=entries.filter(e=>e.kind==='math');
  const sourceOrder=Array.isArray(source.sectionOrder)?source.sectionOrder.flatMap(s=>s.questions||[]):Array.isArray(payload.questionOrder)?payload.questionOrder:questions.map(q=>q.id);
  if(sourceOrder.length!==questions.length||new Set(sourceOrder).size!==questions.length||sourceOrder.some(id=>!questions.some(q=>q.id===id)))errors.push('Source order does not cover every question exactly once.');
  return {inputFile,raw,payload,entries,source,questions,expectedCount,assets:checkedAssets,standalone,passages,maths,sourceOrder,errors};
}

async function protectedSnapshot(root) {
  const files={};
  async function visit(directory) {for(const entry of await readdir(directory,{withFileTypes:true})) {const path=join(directory,entry.name);if(entry.isDirectory())await visit(path);else files[relative(root,path).replaceAll('\\','/')]=sha(await readFile(path));}}
  await visit(join(root,'client/src/content'));
  return {files,assessments:await json(join(root,'server/data/assessments.json'))};
}

export async function transferExam(inputFile,options={}) {
  const inspection=await inspectTransfer(inputFile,options);
  if(inspection.errors.length)throw new Error('Source package is not ready:\n'+inspection.errors.join('\n'));
  const scratch=resolve(options.scratch||join(dirname(inspection.inputFile),'transfer-work'));
  let preflight;
  if(options.apply) {
    const sourceRoot=resolve(options.root||repository),baseline=await protectedSnapshot(sourceRoot);
    preflight=await transferExam(inputFile,{...options,apply:false,root:sourceRoot,scratch:join(scratch,'apply-preflight'),report:join(scratch,'apply-preflight-report.json')});
    if(preflight.packageId!==sha(inspection.raw)||sha(await readFile(inspection.inputFile))!==sha(inspection.raw))throw new Error('Source package changed during disposable preflight. Live transfer was not started; inspect the new source and retry.');
    if(!same(baseline,await protectedSnapshot(sourceRoot)))throw new Error('Authored content changed during disposable preflight. Live transfer was not started; review the concurrent edit and retry.');
  }
  const root=options.apply?resolve(options.root||repository):await disposableCopy(options.root||repository,scratch);
  const before=await protectedSnapshot(root);
  const packageId=await retainSourcePackage(root,inspection.raw,inspection.source);
  const receiptDir=join(root,'tools/.content-drafts/source-transfers');await mkdir(receiptDir,{recursive:true});
  const receiptPath=join(receiptDir,`${packageId}.json`);
  const title=options.title||inspection.source.title;
  if(!title)throw new Error('Source exam title is missing.');
  const assessmentId=slug(title);
  let receipt=await exists(receiptPath)?await json(receiptPath):null;
  const service=await loadEditorService(root,join(scratch,'service'));
  let state=await service.getState();
  const existingAssessment=state.assessments.find(a=>a.id===assessmentId||a.title.toLowerCase()===title.toLowerCase());
  const existingTest=state.tests.find(t=>t.assessmentId===existingAssessment?.id);
  const existingMath=state.mathSections.find(section=>section.fileName===existingTest?.mathSectionFileName);
  const reusableEmpty=Boolean(options.reuseEmpty&&existingAssessment?.id===assessmentId&&existingAssessment.status==='locked'&&!(existingAssessment.questions||[]).length&&!(existingAssessment.passages||[]).length&&!(existingTest?.readingPassageIds||[]).length&&!(existingTest?.revisingEditingPartAPassageIds||[]).length&&!(existingTest?.standaloneItemIds||[]).length&&!existingTest?.mathSectionFileName);
  let mathAudit=null;
  if(!receipt&&options.reuseMatching&&existingAssessment?.id===assessmentId&&existingMath&&!(existingTest.readingPassageIds||[]).length&&!(existingTest.revisingEditingPartAPassageIds||[]).length&&!(existingTest.standaloneItemIds||[]).length) {
    if(!options.matchingAudit)throw new Error('--reuse-matching requires a reviewed fingerprint-bound --matching-audit JSON. Existing Math will not be replaced.');
    mathAudit=await json(resolve(options.matchingAudit));
    const incoming=inspection.payload.mathQuestions||[],mapping=mathAudit.mapping||[];
    const conflicts=[];
    if(mathAudit.assessmentId!==assessmentId||mathAudit.sourcePackageSha256!==packageId)conflicts.push('Audit target or source-package hash differs.');
    if(existingMath.questions.length!==incoming.length||mapping.length!==incoming.length)conflicts.push('Existing/source/audit question counts differ.');
    for(let i=0;i<incoming.length;i++) {
      const next=incoming[i],old=existingMath.questions[i],pair=mapping[i];
      if(!old||!pair||pair.existingId!==old.id||pair.sourceId!==next.id||pair.existingQuestionSha256!==auditQuestionFingerprint(old)||pair.sourceQuestionSha256!==auditQuestionFingerprint(next)||pair.equivalent!==true)conflicts.push(`Ordered Math question ${i+1} is not covered by a matching reviewed fingerprint.`);
    }
    if((mathAudit.conflicts||[]).length&&!options.allowPresentationCorrections)conflicts.push('The audit records source presentation corrections. Review them and explicitly enable --allow-presentation-corrections; canonical questions and grading remain untouched.');
    if(conflicts.length) {
      const path=join(scratch,'matching-conflicts.json');atomicJson(path,{assessmentId,packageId,conflicts,auditConflicts:mathAudit.conflicts||[]});
      throw new Error('Existing Math source match did not pass. No existing content was replaced. '+path);
    }
  }
  if(!receipt&&existingAssessment&&!reusableEmpty&&!mathAudit)throw new Error(`An existing exam already matches “${title}”. Automatic replacement is prohibited; --reuse-empty only accepts a locked exam with no content; --reuse-matching requires a reviewed Math match.`);
  if(receipt&&(receipt.assessmentId!==assessmentId||receipt.packageId!==packageId))throw new Error('Transfer receipt identity mismatch.');
  if(!receipt) {
    const backup=join(scratch,`backup-${packageId.slice(0,16)}-${Date.now()}`);
    await mkdir(backup,{recursive:true});
    for(const path of ['client/src/content','server/data/assessments.json'])await cp(join(root,path),join(backup,path),{recursive:true});
    receipt={version:1,packageId,assessmentId,title,reusedEmptyAssessment:reusableEmpty,reusedMath:mathAudit?{fileName:existingMath.fileName,sourceHash:existingMath.sourceHash,mapping:mathAudit.mapping,conflicts:mathAudit.conflicts||[],auditFile:resolve(options.matchingAudit)}:null,source:inspection.source,inputFile:inspection.inputFile,backup,startedAt:new Date().toISOString(),passages:[],standalone:[],mathComplete:false,complete:false};
    atomicJson(receiptPath,receipt);
  }
  // Archives include source paths and hashes, not just transformed editor data.
  const originals=[];
  for(const document of inspection.source.documents||[]) {
    const local=document.localPath||document.path;
    if(!local) {originals.push(document);continue;}
    const path=isAbsolute(local)?local:resolve(dirname(inspection.inputFile),local);
    const bytes=await readFile(path);if(document.sha256&&sha(bytes)!==document.sha256)throw Error('Original document hash mismatch.');
    const directory=join(root,'tools/.content-drafts/source-packages',packageId,'originals');await mkdir(directory,{recursive:true});
    const file=basename(path);
    if(await exists(join(directory,file))) {if(sha(await readFile(join(directory,file)))!==sha(bytes))throw Error('Archived original document basename collision: '+file);}
    else await writeFile(join(directory,file),bytes,{flag:'wx'});
    originals.push({...document,localPath:path,sha256:sha(bytes),archivedFile:`originals/${file}`});
  }
  atomicJson(join(root,'tools/.content-drafts/source-packages',packageId,'documents.json'),originals);
  for(const asset of inspection.assets) {
    if(sha(await readFile(asset.path))!==asset.sha256)throw new Error(`Source asset changed after inspection: ${asset.destination}. Retry after reviewing the new source.`);
    const destination=join(root,'client/public',asset.destination.slice(1));await mkdir(dirname(destination),{recursive:true});
    if(await exists(destination)) {if(sha(await readFile(destination))!==asset.sha256)throw new Error(`Asset collision: ${asset.destination}. Existing asset preserved.`);}
    else await cp(asset.path,destination,{errorOnExist:true,force:false});
  }
  if(!state.assessments.some(a=>a.id===assessmentId))await service.createExam({title,examLabel:inspection.source.sourceFamily==='official_shsat'?'Official practice':'Other exams',durationMinutes:180,description:'Imported from the retained source package. Source fidelity review is pending.'});
  if(!receipt.complete) {
    for(const entry of inspection.passages) {
      const key=sha(documentImport.fingerprint(entry));
      if(receipt.passages.some(p=>p.key===key))continue;
      let drafts=await service.documentDrafts.read();
      state=await service.getState();
      drafts=await service.documentDrafts.import({format:documentImport.format,source:inspection.source,passages:[{...entry.content,versionLabel:title,versionLabels:[title,...(entry.content.versionLabels||[])]}]},drafts.revision,state.passages);
      const draft=drafts.entries.find(e=>e.id===drafts.lastImport.entryIds[0]);
      const saved=await service.savePassage({...draft.content,importDraftId:draft.id,publishNow:true});
      receipt.passages.push({key,id:saved.id,section:saved.section,fileName:saved.fileName,sourceHash:saved.sourceHash,sourceQuestionIds:entry.content.questions.map(q=>q.id),questionIds:saved.questions.map(q=>q.id)});atomicJson(receiptPath,receipt);
    }
    for(const entry of inspection.standalone)for(const raw of entry.content.questions) {
      if(receipt.standalone.some(q=>q.sourceId===raw.id))continue;
      state=await service.getState();
      const item={...raw,stimulus:raw.stimulus||'',source:{...inspection.source,...raw.source,packageId},importNeedsEditing:true,versionLabels:[title,...(raw.versionLabels||[])]};
      const old=state.standaloneItems.find(q=>q.id===item.id);
      if(old&&questionSignature(service.normalizeStandaloneItem(old))!==questionSignature(service.normalizeStandaloneItem(item)))throw new Error(`Existing standalone item ${item.id} differs from this source. It was not replaced.`);
      const saved=old?{item:old}:await service.saveStandaloneItem({item,originalId:'',sourceHash:state.standaloneSourceHash});
      receipt.standalone.push({sourceId:raw.id,id:saved.item.id});atomicJson(receiptPath,receipt);
    }
    if(!receipt.mathComplete&&inspection.maths.length) {
      state=await service.getState();
      const test=state.tests.find(t=>t.assessmentId===assessmentId),existing=state.mathSections.find(m=>m.fileName===test?.mathSectionFileName);
      const questions=inspection.maths.flatMap(e=>e.content.questions);
      if(receipt.reusedMath) {
        if(existing?.sourceHash!==receipt.reusedMath.sourceHash)throw new Error('Existing Math was edited after the reuse audit. Refresh the audit; it was not replaced.');
      } else await service.saveMath({assessmentId,questions,sourceHash:existing?.sourceHash,managementRevision:existing?.managementRevision}, {importedStatuses:Object.fromEntries(questions.map(q=>[q.id,{needsEditing:true,source:title,notes:['Source imported; teacher classification and visual player review remain pending.']}]))});
      receipt.mathComplete=true;atomicJson(receiptPath,receipt);
    }
    state=await service.getState();
    const test=state.tests.find(t=>t.assessmentId===assessmentId);
    const mapping=new Map([...receipt.passages.flatMap(p=>p.sourceQuestionIds.map((id,i)=>[id,p.questionIds[i]])),...receipt.standalone.map(q=>[q.sourceId,q.id]),...(receipt.reusedMath?.mapping||[]).map(q=>[q.sourceId,q.existingId])]);
    const questionOrder=inspection.sourceOrder.map(id=>mapping.get(id)||id);
    await service.saveTest({...test,assessmentId,readingPassageIds:receipt.passages.filter(p=>p.section==='reading').map(p=>p.id),revisingEditingPartAPassageIds:receipt.passages.filter(p=>p.section==='revising_editing_a').map(p=>p.id),standaloneItemIds:receipt.standalone.map(q=>q.id),questionOrder,source:{...inspection.source,packageId}});
    receipt.questionOrder=questionOrder;receipt.complete=true;receipt.completedAt=new Date().toISOString();atomicJson(receiptPath,receipt);
  }
  if(!receipt.presentationComplete) {
    state=await service.getState();
    const test=state.tests.find(t=>t.assessmentId===assessmentId);
    const presentationOverrides=presentationForTransfer(root,test,receipt,inspection);
    await service.saveTest({...test,assessmentId,readingPassageIds:receipt.passages.filter(p=>p.section==='reading').map(p=>p.id),revisingEditingPartAPassageIds:receipt.passages.filter(p=>p.section==='revising_editing_a').map(p=>p.id),standaloneItemIds:receipt.standalone.map(q=>q.id),questionOrder:receipt.questionOrder,source:{...inspection.source,packageId},presentationOverrides});
    receipt.presentationComplete=true;atomicJson(receiptPath,receipt);
  }
  state=await service.getState();
  const after=await protectedSnapshot(root),assessment=state.assessments.find(a=>a.id===assessmentId);
  const reusedMathPreserved=!receipt.reusedMath||state.mathSections.find(s=>s.fileName===receipt.reusedMath.fileName)?.sourceHash===receipt.reusedMath.sourceHash;
  if(!reusedMathPreserved)throw new Error('Existing Math source changed during transfer. Stop and inspect the retained backup.');
  const previousPreserved=before.assessments.filter(old=>old.id!==assessmentId).every(old=>same(after.assessments.find(a=>a.id===old.id),old));
  if(!previousPreserved)throw new Error('Transfer changed an existing assessment. Backup retained; inspect before continuing.');
  if(assessment.questions.length!==inspection.expectedCount)throw new Error(`Published ${assessment.questions.length}/${inspection.expectedCount} questions.`);
  const previousTarget=before.assessments.find(a=>a.id===assessmentId);
  const assessmentStatusPreserved=previousTarget?assessment.status===previousTarget.status:assessment.status==='locked';
  if(!assessmentStatusPreserved)throw new Error('Transfer changed the assessment release status. Stop and inspect the retained backup.');
  const sourceOrderPreserved=same(assessment.questions.map(q=>q.id),receipt.questionOrder);
  if(!sourceOrderPreserved)throw new Error('Published question order differs from the source order. Exam remains locked; inspect before release.');
  const presentationVerification=verifyPresentation(root,state.tests.find(t=>t.assessmentId===assessmentId),inspection.expectedCount);
  const typecheck=typecheckAuthoredContent(root);
  if(!typecheck.passed) {
    const path=join(scratch,'typecheck-errors.json');atomicJson(path,typecheck);
    throw new Error(`Authored exam TypeScript check failed (${typecheck.errors.length} errors). Inspect ${path}.`);
  }
  const changedAuthoredFiles=[...new Set([...Object.keys(before.files),...Object.keys(after.files)])].filter(path=>before.files[path]!==after.files[path]).sort();
  const report={mode:options.apply?'apply':'disposable-dry-run',root,packageId,assessmentId,title,reusedEmptyAssessment:receipt.reusedEmptyAssessment,reusedMathPreserved,sourcePresentationCorrections:receipt.reusedMath?.conflicts||[],expectedQuestions:inspection.expectedCount,publishedQuestions:assessment.questions.length,passages:receipt.passages.length,standalone:receipt.standalone.length,math:inspection.maths.reduce((n,e)=>n+e.content.questions.length,0),assets:inspection.assets.length,existingAssessmentsPreserved:previousPreserved,assessmentStatusPreserved,assessmentStatus:assessment.status,sourceOrderPreserved,presentationVerification,changedAuthoredFiles,backup:receipt.backup,receiptPath,sourceQuestionOrder:receipt.questionOrder,readiness:{completeTransfer:true,studentRelease:false,visualParityVerified:false,classificationReviewPending:true},errors:[]};
  report.typecheck=typecheck;
  if(preflight)report.disposablePreflight={passed:true,packageId:preflight.packageId,root:preflight.root,authoredBaselineUnchanged:true,typecheckPassed:preflight.typecheck.passed};
  atomicJson(options.report||join(scratch,'transfer-report.json'),report);
  return report;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2),get=name=>args.find(v=>v.startsWith(`--${name}=`))?.slice(name.length+3);
  const input=get('input');if(!input)throw new Error('Use --input=import.json [--assets=assets.json] --expected=114 [--root=repo] [--scratch=directory] [--report=report.json]. Default is a disposable dry run; --apply explicitly enables the target root.');
  console.log(JSON.stringify(await transferExam(input,{assetsFile:get('assets'),expected:get('expected'),root:get('root'),scratch:get('scratch'),report:get('report'),title:get('title'),apply:args.includes('--apply'),reuseEmpty:args.includes('--reuse-empty'),reuseMatching:args.includes('--reuse-matching'),matchingAudit:get('matching-audit'),allowPresentationCorrections:args.includes('--allow-presentation-corrections')}),null,2));
}
