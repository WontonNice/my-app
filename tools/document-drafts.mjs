import { createHash, randomUUID } from 'node:crypto';
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import contract from './document-import.cjs';
import batches from './math-import-batch.cjs';
import { retainSourcePackage } from './source-packages.mjs';
import sourceWriter from './write-export-file.cjs';
import versions from './passage-versions.cjs';

const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(batches.canonical(value))).digest('hex');
const copy = value => JSON.parse(JSON.stringify(value));
function orderBatch(entry) {
  const expected=new Map(entry.batch.expectedQuestions.map((n,i)=>[n,i]));
  if(expected.size)entry.batch.items.sort((a,b)=>(expected.get(a.sourceQuestion)??Number.MAX_SAFE_INTEGER)-(expected.get(b.sourceQuestion)??Number.MAX_SAFE_INTEGER));
  const questions=new Map(entry.content.questions.map(q=>[q.id,q]));
  entry.content.questions=entry.batch.items.map(i=>questions.get(i.questionId)).filter(Boolean);
  entry.batch.completedQuestions=entry.batch.items.filter(i=>!i.error).map(i=>i.sourceQuestion||i.questionId);
  entry.batch.unresolvedQuestions=[...new Set([...entry.batch.items.filter(i=>i.error||i.conflicts?.length).map(i=>i.sourceQuestion||i.raw?.id||i.id),...entry.batch.expectedQuestions.filter(n=>!entry.batch.items.some(i=>i.sourceQuestion===n))])];
  if(entry.batch.inventoryConfirmed)entry.batch.nextScope=entry.batch.unresolvedQuestions.join(', ');
}

function mergeMathBatch(state, incoming, sanitize, publishedMath=[], { replaceUnpublished = false } = {}) {
  const meta = incoming.batch;
  const key = meta.sourceId ? JSON.stringify([meta.sourceId,meta.section,meta.jobId]) : `anonymous:${digest(meta.items.map(i=>i.raw))}`;
  let current = state.entries.find(e=>e.kind==='math' && e.batch && (meta.sourceId
    ? e.batch.sourceId===meta.sourceId && e.batch.section===meta.section && e.batch.jobId===meta.jobId
    : e.batch.key===key));
  if (!current) {
    current = {kind:'math',destination:'exam',id:`import-${digest(key).slice(0,20)}`,status:'draft',createdAt:new Date().toISOString(),content:{...incoming.content,questions:[]},batch:{...meta,key,items:[],chunks:[],receipts:[]}};
    current.content.importDraftId = current.id;
    state.entries.push(current);
  } else {
    if (meta.expectedTotal !== null && current.batch.expectedTotal !== null && meta.expectedTotal !== current.batch.expectedTotal) throw new Error('Job inventory total changed. Review its scope before importing this chunk.');
    if(current.batch.inventoryConfirmed && meta.expectedQuestions.some(n=>!current.batch.expectedQuestions.includes(n)) || meta.inventoryConfirmed && current.batch.expectedQuestions.some(n=>!meta.expectedQuestions.includes(n)))throw new Error('Confirmed source inventories disagree. Review the saved job scope before merging this chunk.');
    current.batch.expectedQuestions = [...new Set([...current.batch.expectedQuestions,...meta.expectedQuestions])];
    if (meta.expectedTotal !== null) current.batch.expectedTotal = meta.expectedTotal;
    if (meta.inventoryConfirmed) current.batch.inventoryConfirmed = true;
    current.content.review.warnings = [...(current.content.review.warnings || []),...(incoming.content.review.warnings || [])].filter((w,i,a)=>a.findIndex(v=>v.code===w.code && v.message===w.message)===i);
  }
  const chunk = {id:meta.chunkId || `chunk-${digest(meta.items.map(i=>i.raw)).slice(0,16)}`,digest:digest(meta.items.map(i=>i.raw)),receivedAt:new Date().toISOString(),sourceQuestions:meta.items.map(i=>i.sourceQuestion),completedQuestions:meta.completedQuestions,unresolvedQuestions:meta.unresolvedQuestions,nextScope:meta.nextScope};
  if (!current.batch.chunks.some(c=>c.id===chunk.id && c.digest===chunk.digest)) current.batch.chunks.push(chunk);
  for (const incomingItem of meta.items) {
    const itemKey = incomingItem.sourceQuestion ? `source:${incomingItem.sourceQuestion}` : incomingItem.questionId ? `id:${incomingItem.questionId}` : `invalid:${incomingItem.position}:${digest(incomingItem.raw)}`;
    const item = current.batch.items.find(i=>i.key===itemKey);
    const q = incoming.content.questions.find(q=>q.id===incomingItem.questionId);
    const receiptKey = digest([chunk.digest,itemKey,incomingItem.receivedFingerprint || incomingItem.raw]);
    const receipt = outcome => {
      const id=receiptKey+':'+outcome;
      if (!current.batch.receipts.some(r=>r.id===id)) current.batch.receipts.push({id,chunkId:chunk.id,sourceQuestion:incomingItem.sourceQuestion,outcome});
    };
    if (item) {
      if (item.receivedFingerprint && item.receivedFingerprint === incomingItem.receivedFingerprint || item.error && JSON.stringify(item.raw)===JSON.stringify(incomingItem.raw)) { receipt('duplicate'); continue; }
      // A corrected retry can repair an unusable record directly. Questions
      // already inserted into any test always keep their authored content.
      if (replaceUnpublished && !Object.keys(item.publications || {}).length && (item.error || Object.keys(item.publicationErrors || {}).length) && q && !incomingItem.error && !current.content.questions.some(old => old.id === q.id && old.id !== item.questionId)) {
        item.history ||= []; item.history.push({ raw:item.raw, at:new Date().toISOString() });
        current.content.questions = current.content.questions.filter(old => old.id !== item.questionId);
        current.content.questions.push(sanitize({ questions:[q] }).questions[0]);
        Object.assign(item,copy(incomingItem),{ conflicts:[], publicationErrors:{} });
        delete item.error;
        receipt('corrected'); continue;
      }
      const conflictId = digest(incomingItem.raw).slice(0,20);
      item.conflicts ||= [];
      if (!item.conflicts.some(c=>c.id===conflictId)) item.conflicts.push({id:conflictId,...copy(incomingItem),question:q ? sanitize({questions:[q]}).questions[0] : null});
      receipt('conflict'); continue;
    }
    const added = {...copy(incomingItem),key:itemKey,id:`item-${digest(itemKey).slice(0,20)}`,publications:{}};
    if (q) {
      if (current.content.questions.some(old=>old.id===q.id)) { added.error='This internal question ID belongs to another source question. Give the new item a distinct ID.'; delete added.questionId; }
      else {
        const possible = state.entries.flatMap(e=>e.kind==='math' ? e.content.questions.map(question=>({entry:e,question})) : []).find(v=>batches.contentFingerprint(v.question)===batches.contentFingerprint(q));
        if (possible) added.possibleDuplicate={entryId:possible.entry.id,questionId:possible.question.id};
        else {
          const published=publishedMath.find(old=>old.prompt===q.prompt);
          if(published)added.possibleDuplicate={assessmentId:published.assessmentId,questionId:published.id};
        }
        current.content.questions.push(sanitize({questions:[q]}).questions[0]);
      }
    }
    current.batch.items.push(added); receipt(added.error ? 'invalid' : 'saved');
  }
  current.updatedAt = new Date().toISOString();
  orderBatch(current);
  current.batch.nextScope=meta.nextScope || (current.batch.inventoryConfirmed ? current.batch.unresolvedQuestions.join(', ') : current.batch.nextScope || 'Confirm the remaining requested source inventory');
  return current.id;
}

// Teacher-only sidecar. Student exporters only read the existing published sources.
export function documentDraftStore(root, sanitize = content => content) {
  const directory = join(root, 'tools', '.content-drafts');
  const file = join(directory, 'document-imports.json');
  let pending = Promise.resolve();
  async function read() {
    try {
      const state = JSON.parse(await readFile(file, 'utf8'));
      state.entries = state.entries.map(entry => ({ ...entry, content: contract.normalizeEntryChoices(entry.content) }));
      return state;
    }
    catch (error) { if (error.code === 'ENOENT') return { revision: 0, entries: [] }; throw error; }
  }
  function mutate(revision, operation) {
    const task = pending.then(async () => {
      const state = await read();
      if (revision !== undefined && revision !== state.revision) throw new Error('Document drafts changed. Reopen the draft library before saving.');
      await operation(state);
      state.revision++;
      await mkdir(directory, { recursive: true });
      sourceWriter.writeExportFile(file, JSON.stringify(state, null, 2));
      return state;
    });
    pending = task.catch(() => {});
    return task;
  }
  return {
    read,
    async import(source, revision, published = [], destination = 'exam', options = {}) {
      if (!['exam', 'advanced'].includes(destination)) throw new Error('Choose Exam passages or SAT passages as the import destination.');
      let entries;
      const packageId = await retainSourcePackage(root, source);
      try {
        const data = batches.decode(source);
        if (options.batch) data.batch = {...data.batch,...options.batch};
        entries = batches.parse(data, { createQuestionId: question => `math-question-${digest(question).slice(0, 16)}` });
      } catch (error) {
        if (!options.captureFailures) throw error;
        return mutate(revision,state=>{
          state.rejectedInputs ||= [];
          const id=digest(source);
          if (!state.rejectedInputs.some(r=>r.id===id)) state.rejectedInputs.push({id,source,error:error.message,createdAt:new Date().toISOString()});
          state.lastImport={error:error.message,rejectedId:id,entryIds:[]};
        });
      }
      return mutate(revision, state => {
        state.lastImport={entryIds:[]};
        for (const entry of entries) {
          const sourcePackages=[packageId,...(/^[a-f0-9]{64}$/.test(entry.content.source?.originalPackageId || '') ? [entry.content.source.originalPackageId] : [])];
          entry.content.source = {...(entry.content.source || {}),packageId};
          if (entry.batch) {
            const entryId=mergeMathBatch(state,entry,sanitize,options.publishedMath,{ replaceUnpublished:options.directImport === true });
            const saved=state.entries.find(candidate=>candidate.id===entryId);
            saved.sourcePackages=[...new Set([...(saved.sourcePackages || []),...sourcePackages])];
            state.lastImport.entryIds.push(entryId);
            continue;
          }
          entry.destination = entry.kind === 'passage' ? destination : 'exam';
          const fingerprint = createHash('sha256').update((entry.destination === 'advanced' ? 'advanced:' : '') + contract.fingerprint(entry)).digest('hex');
          const existing = state.entries.find(e => e.kind === entry.kind && (e.destination || 'exam') === entry.destination && (e.fingerprint === fingerprint || contract.fingerprint(e) === contract.fingerprint(entry)));
          if (existing) {
            existing.content.versionLabels = versions.labels({...existing.content, versionLabels:[...versions.labels(existing.content),...versions.labels(entry.content)]});
            existing.sourcePackages = [...new Set([...(existing.sourcePackages || []),...sourcePackages])];
            state.lastImport.entryIds.push(existing.id);
            continue;
          }
          if (entry.kind === 'passage') {
            const occupied = [...state.entries.filter(e => e.kind === 'passage' && (e.destination || 'exam') === destination).map(e => e.content), ...published];
            if (occupied.some(p => p.id === entry.content.id)) entry.content = versions.distinct(entry.content, occupied);
          }
          if (entry.destination === 'advanced') {
            const p = entry.content;
            p.advancedId ||= p.id;
            p.genre ||= p.passageType === 'literary' || p.format === 'poem' ? 'Fiction' : 'Science';
            p.excerpt ||= String(p.text || '').replace(/\s+/g, ' ').trim().slice(0, 180) || p.title;
            p.tone ||= 'blue';
            p.thumbnailAlt ||= p.title;
          }
          entry.content = sanitize(entry.content);
          entry.id = `import-${fingerprint.slice(0, 20)}-${randomUUID().slice(0, 8)}`;
          entry.fingerprint = fingerprint;
          entry.sourcePackages = sourcePackages;
          entry.status = 'draft';
          entry.content.importDraftId = entry.id;
          entry.createdAt = new Date().toISOString();
          state.entries.push(entry);
          state.lastImport.entryIds.push(entry.id);
        }
      });
    },
    async delete(input) {
      if (!Number.isInteger(input.revision)) throw new Error('Reopen the draft before deleting.');
      return mutate(input.revision, state => {
        const entry = state.entries.find(entry => entry.id === input.id);
        if (!entry) throw new Error('Import draft not found.');
        if (entry.kind !== 'passage' || entry.status === 'published' || entry.batch) throw new Error('Only unpublished passage drafts can be deleted here.');
        state.entries = state.entries.filter(entry => entry.id !== input.id);
      });
    },
    async save(input) {
      input = copy(input);
      return mutate(input.revision, state => {
        const current = state.entries.find(e => e.id === input.entry.id);
        if (!current) throw new Error('Import draft not found.');
        if (!Array.isArray(input.entry.content?.questions)) throw new Error('Keep the ordered questions array.');
        if (current.batch) {
          const ids = input.entry.content.questions.map(q=>q.id);
          if (new Set(ids).size!==ids.length || ids.length!==current.content.questions.length || current.content.questions.some(q=>!ids.includes(q.id))) throw new Error('Keep each existing batch question and its identity; use Skip for exclusions.');
          input.entry.content.questions.forEach(q=>batches.shape(copy(q)));
          const old = new Map(current.content.questions.map(q=>[q.id,q]));
          input.entry.content.questions.forEach(q=>{
            const projected=batches.previewQuestion(old.get(q.id));
            for(const visual of q.visuals || []) {
              const previous=visual.choiceId ? projected.choices?.find(c=>c.id===visual.choiceId)?.image : projected.image;
              const next=visual.choiceId ? q.choices?.find(c=>c.id===visual.choiceId)?.image : q.image;
              if(visual.state==='resolved' && visual.image && (previous?.src===visual.image.src || batches.hasInlineImage(old.get(q.id),visual.image.src,visual.choiceId)) && next?.src!==visual.image.src && !batches.hasInlineImage(q,visual.image.src,visual.choiceId))visual.state='unresolved';
            }
            if (batches.fingerprint(old.get(q.id))!==batches.fingerprint(q)) for(const flag of ['sourceReviewed','completenessReviewed','classificationReviewed']) {
              if(old.get(q.id).review?.[flag]===true)q.review={...q.review,[flag]:false};
            }
          });
        }
        if (!current.batch && contract.fingerprint(current) !== contract.fingerprint(input.entry)) {
          input.entry.content.review = {...input.entry.content.review,sourceReviewed:false,completenessReviewed:false};
          for (const question of input.entry.content.questions) {
            const previous = current.content.questions.find(q => q.id === question.id);
            if (!previous || contract.fingerprint({kind:'question',content:{questions:[previous]}}) !== contract.fingerprint({kind:'question',content:{questions:[question]}})) question.review = {...question.review,sourceReviewed:false,completenessReviewed:false};
          }
        }
        current.content = sanitize(input.entry.content);
        current.content.importDraftId = current.id;
        current.status = 'draft';
        current.updatedAt = new Date().toISOString();
      });
    },
    async batchAction(input) {
      if(!Number.isInteger(input.revision))throw new Error('Reload the draft revision before changing this batch.');
      return mutate(input.revision,state=>{
        const entry=state.entries.find(e=>e.id===input.entryId && e.batch);
        if (!entry) throw new Error('Math batch not found.');
        if (input.operation==='scope') {
          const next=batches.metadata({...entry.batch,...input.batch});
          if (next.sourceId!==entry.batch.sourceId || next.jobId!==entry.batch.jobId || next.section!==entry.batch.section) throw new Error('Source identity is fixed after creation. Start a separate job for another source/version.');
          Object.assign(entry.batch,next); orderBatch(entry); return;
        }
        const selected=entry.batch.items.filter(i=>input.itemIds?.includes(i.id));
        if (!selected.length) throw new Error('Select at least one question.');
        for (const item of selected) {
          if (input.operation==='skip') item.skipped=true;
          else if (input.operation==='restore') item.skipped=false;
          else if (input.operation==='distinct') item.distinctConfirmed=true;
          else if (input.operation==='confirm') {
            const q=batches.question(entry,item);
            if (q) q.review={...q.review,sourceReviewed:true,completenessReviewed:true,classificationReviewed:true};
          } else if (input.operation==='correct' || input.operation==='use-incoming') {
            if (Object.keys(item.publications || {}).length) throw new Error('This question has been published. Create a new source/version rather than replace it.');
            const conflict=input.operation==='use-incoming' ? item.conflicts?.find(c=>c.id===input.conflictId) : null;
            const candidate=conflict ? conflict.question || conflict.raw : batches.decode(input.source);
            if (!candidate) throw new Error('Replacement question not found.');
            const parsed=batches.parse({format:contract.format,mathQuestions:[candidate],visuals:conflict ? [] : item.sourceVisuals || []});
            const next=parsed[0].batch.items[0],q=parsed[0].content.questions[0];
            if (next.error) throw new Error(next.error);
            if (input.operation!=='correct' && item.sourceQuestion && next.sourceQuestion!==item.sourceQuestion) throw new Error('Keep the original source question identity.');
            if(entry.batch.sourceId && !next.sourceQuestion)throw new Error('Provide the original source question number for this named job.');
            if(next.sourceQuestion && entry.batch.items.some(other=>other.id!==item.id && other.sourceQuestion===next.sourceQuestion))throw new Error('That source question is already in this batch. Review the existing item instead.');
            if (entry.content.questions.some(old=>old.id===q.id && old.id!==item.questionId)) throw new Error('Another question already has this ID.');
            item.history ||= [];
            item.history.push({raw:item.raw,question:batches.question(entry,item) || null,at:new Date().toISOString()});
            entry.content.questions=entry.content.questions.filter(old=>old.id!==item.questionId);
            entry.content.questions.push(sanitize({questions:[q]}).questions[0]);
            Object.assign(item,{raw:conflict?.raw || candidate,error:null,questionId:q.id,sourceQuestion:next.sourceQuestion,key:next.sourceQuestion?`source:${next.sourceQuestion}`:`id:${q.id}`,receivedFingerprint:next.receivedFingerprint,conflicts:[]});
          } else if (input.operation==='keep-current') { item.history ||= []; item.history.push({conflicts:item.conflicts,at:new Date().toISOString()}); item.conflicts=[]; }
          else if (input.operation!=='revalidate') throw new Error('Unknown batch operation.');
        }
        entry.updatedAt=new Date().toISOString();
        orderBatch(entry);
      });
    },
    async publishBatch(input, publish) {
      if(!Number.isInteger(input.revision))throw new Error('Reload the draft revision before publishing this batch.');
      return mutate(input.revision,async state=>{
        const entry=state.entries.find(e=>e.id===input.entryId && e.batch);
        if (!entry) throw new Error('Math batch not found.');
        const items=entry.batch.items.filter(i=>input.itemIds?.includes(i.id));
        if (!items.length) throw new Error('Select questions to publish.');
        await publish(entry,items);
        entry.status=entry.batch.items.every(i=>i.skipped || Object.keys(i.publications || {}).length) ? 'published' : 'draft';
      });
    },
    async publishStandalone(input, publish) {
      if (!Number.isInteger(input.revision)) throw new Error('Reload the draft before publishing these English questions.');
      return mutate(input.revision, async state => {
        const entry = state.entries.find(e => e.id === input.entryId && e.kind === 'standalone');
        if (!entry) throw new Error('Independent English draft not found.');
        const publication = await publish(entry);
        entry.publications = {...entry.publications, [input.assessmentId]: publication};
        entry.status = 'published';
        entry.publishedAt = new Date().toISOString();
      });
    },
    async published(id, content, assessmentId) {
      return mutate(undefined, state => {
        const current = state.entries.find(e => e.id === id);
        if(current?.batch && assessmentId) {
          for(const item of current.batch.items) {
            const question=content.questions.find(q=>q.id===item.questionId);
            if(!question)continue;
            item.publications ||= {};
            item.publications[assessmentId]={questionId:question.id.startsWith(assessmentId+'-')?question.id:`${assessmentId}-${question.id}`,publishedAt:new Date().toISOString(),snapshotFingerprint:batches.contentFingerprint(question)};
          }
          current.status=current.batch.items.every(item=>item.skipped || Object.values(item.publications||{}).some(p=>p.snapshotFingerprint===batches.contentFingerprint(batches.question(current,item))))?'published':'draft';
          return;
        }
        if (current) { current.content = content; current.status = 'published'; current.publishedAt = new Date().toISOString(); }
      });
    },
  };
}

export function publicationContent(entry, { allowUnresolved = false } = {}) {
  const p = JSON.parse(JSON.stringify(entry.content));
  const allVisuals = [...(p.visuals || []), ...p.questions.flatMap(q => (q.visuals || []).map(v => ({ ...v, questionId: v.questionId || q.id })))];
  p.images = p.images || [];
  for (const v of allVisuals) {
    if (!v.image && allowUnresolved) continue;
    if (!v.questionId) {
      if (!p.image && !p.images.length) p.image = v.image;
      else if (p.image?.src !== v.image.src && !p.images.some(image => image.src === v.image.src)) p.images.push(v.image);
      continue;
    }
    const q = p.questions.find(q => q.id === v.questionId);
    if (!q) throw new Error(`Visual refers to missing question ${v.questionId}.`);
    if(entry.kind==='math' && batches.hasInlineImage(q,v.image.src,v.choiceId))continue;
    if (v.choiceId) {
      const choice = q.choices?.find(c => c.id === v.choiceId);
      if (!choice) throw new Error(`Visual refers to missing choice ${v.choiceId}.`);
      if (choice.image && choice.image.src !== v.image.src) throw new Error('Combine multiple choice visuals into one faithful crop before publishing.');
      choice.image = v.image;
    } else {
      if (q.image && q.image.src !== v.image.src) throw new Error('Combine multiple question visuals into one faithful crop before publishing.');
      q.image = v.image;
    }
  }
  delete p.review; delete p.visuals; delete p.importDraftId; delete p.teacherSource;
  p.questions = p.questions.map(({ review, visuals, ...q }) => ({ ...q,
    ...(entry.kind === 'passage' && !q.id.startsWith(p.id + '-') ? { id: `${p.id}-${q.id}` } : {}) }));
  p.preserveSourceLayout = true;
  return p;
}
