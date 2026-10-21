/* Private Math batch bookkeeping shared by the draft store and review UI. */
var MathImportBatch = (() => {
  const contract = typeof module !== 'undefined' ? require('./document-import.cjs') : DocumentImport;
  const clone = value => JSON.parse(JSON.stringify(value));
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (!object(value)) return value;
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  function fingerprint(question) {
    const q = clone(question);
    delete q.id;
    if (q.review) for (const key of ['sourceReviewed', 'completenessReviewed', 'classificationReviewed']) delete q.review[key];
    return JSON.stringify(canonical(q));
  }
  function contentFingerprint(question) {
    const q=clone(question); delete q.id; delete q.review;
    return JSON.stringify(canonical(q));
  }
  function hasInlineImage(question,src,choiceId='') {
    const fields=choiceId ? [question.choices?.find(c=>c.id===choiceId)?.html] : [question.promptHtml,question.stimulusHtml,question.instructionsHtml];
    return fields.some(html=>typeof html==='string' && html.includes(`src="${src}"`));
  }
  function previewQuestion(question) {
    const q=clone(question);
    for(const v of q.visuals || []) {
      if(v.state!=='resolved' || !v.image || hasInlineImage(q,v.image.src,v.choiceId))continue;
      const target=v.choiceId ? q.choices?.find(c=>c.id===v.choiceId) : q;
      if(target && !target.image)target.image=clone(v.image);
    }
    return q;
  }
  function metadata(value = {}) {
    if (!object(value)) throw new Error('batch must be an object.');
    const result = {};
    for (const key of ['jobId', 'sourceId', 'sourceLabel', 'section', 'requestedScope', 'chunkId', 'nextScope']) {
      if (value[key] !== undefined && typeof value[key] !== 'string') throw new Error(`batch.${key} must be a string.`);
      result[key] = (value[key] || '').trim();
    }
    result.section ||= 'math';
    if(result.section!=='math')throw new Error('Math batch.section must be math.');
    result.expectedQuestions = value.expectedQuestions || [];
    if (!Array.isArray(result.expectedQuestions) || result.expectedQuestions.some(n => typeof n !== 'string' || !n.trim()) || new Set(result.expectedQuestions).size !== result.expectedQuestions.length) throw new Error('batch.expectedQuestions must contain unique, nonempty source question strings.');
    result.expectedTotal = value.expectedTotal ?? null;
    if (result.expectedTotal !== null && (!Number.isInteger(result.expectedTotal) || result.expectedTotal < 0)) throw new Error('batch.expectedTotal must be null or a nonnegative integer.');
    result.inventoryConfirmed = value.inventoryConfirmed === true;
    if (result.inventoryConfirmed && result.expectedTotal !== null && result.expectedQuestions.length !== result.expectedTotal) throw new Error('A confirmed inventory must list every expected source question.');
    if (result.jobId && !result.sourceId) throw new Error('A jobId requires a stable sourceId including its exam/form/version.');
    for(const key of ['completedQuestions','unresolvedQuestions']) {
      result[key]=value[key] || [];
      if(!Array.isArray(result[key]) || result[key].some(n=>typeof n!=='string'))throw new Error(`batch.${key} must be a string array.`);
    }
    return result;
  }
  function shape(q) {
    if (!object(q)) throw new Error('Question must be an object.');
    if (typeof q.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(q.id)) throw new Error('Question needs a stable lowercase hyphenated id.');
    if (typeof q.type !== 'string' || !q.type.trim()) throw new Error('Question needs a response type.');
    for (const key of ['prompt', 'promptHtml', 'instructions', 'instructionsHtml', 'stimulus', 'stimulusHtml', 'topic', 'subtopic']) if (q[key] !== undefined && typeof q[key] !== 'string') throw new Error(`${key} must be a string.`);
    if(q.explanation!==undefined && q.explanation!==null && typeof q.explanation!=='string')throw new Error('explanation must be a string or null.');
    for (const key of ['choices', 'correctChoiceIds', 'correctTextAnswers', 'visuals', 'dropdowns', 'dropdownContent', 'items', 'dragDropSlots', 'dragDropContent', 'correctPointIds']) {
      if (q[key] !== undefined && !Array.isArray(q[key])) throw new Error(`${key} must be an array.`);
    }
    for (const key of ['correctChoiceIds', 'correctTextAnswers', 'dropdownContent', 'dragDropContent', 'correctPointIds']) if (q[key]?.some(v => typeof v !== 'string')) throw new Error(`${key} must contain strings.`);
    if (q.review !== undefined && !object(q.review)) throw new Error('review must be an object.');
    if(q.review?.sourceQuestion!==undefined && typeof q.review.sourceQuestion!=='string')throw new Error('review.sourceQuestion must be the original number as a string.');
    if(q.review?.sourcePages!==undefined && (!Array.isArray(q.review.sourcePages) || q.review.sourcePages.some(n=>!Number.isInteger(n)||n<1)))throw new Error('review.sourcePages must contain 1-based PDF page numbers.');
    for(const image of [q.image,...(q.choices||[]).map(c=>c?.image),...(q.visuals||[]).map(v=>v?.image)].filter(Boolean))if(!object(image)||!/^\/exam-images\/[a-zA-Z0-9._-]+$/.test(image.src||'')||typeof image.alt!=='string')throw new Error('Images must reference an actual uploaded /exam-images/ asset with alt text.');
    for (const key of ['choices', 'dropdowns', 'items', 'dragDropSlots']) if (q[key]?.some(v => !object(v))) throw new Error(`${key} must contain objects.`);
    for (const menu of q.dropdowns || []) if (!Array.isArray(menu.options) || menu.options.some(v => !object(v))) throw new Error('Each dropdown needs an options array of objects.');
    if (q.graph !== undefined && (!object(q.graph) || !Array.isArray(q.graph.points) || q.graph.points.some(v => !object(v)))) throw new Error('graph needs a points array of objects.');
    if (q.numberLineResponse !== undefined && !object(q.numberLineResponse)) throw new Error('numberLineResponse must be an object.');
    if (q.type === 'short_response' || ['short_answer', 'short answer', 'short-answer'].includes(q.type)) delete q.entryLayout;
    return q;
  }
  function decode(source) {
    const data = typeof source === 'string' ? JSON.parse(source.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1')) : clone(source);
    if (!object(data)) throw new Error('Import one JSON object.');
    return data;
  }
  function parse(source, { createQuestionId } = {}) {
    let data = decode(source);
    const hasMathQuestions = Object.hasOwn(data, 'mathQuestions');
    if (Object.hasOwn(data, 'question') && (hasMathQuestions || data.passage || data.passages)) throw new Error('Use question for one Math question, or mathQuestions for a batch or mixed document, not both.');
    const bareQuestion = !hasMathQuestions && !data.passage && !data.passages && data.text === undefined && !Object.hasOwn(data, 'questions') && typeof data.type === 'string';
    if (!hasMathQuestions && (Object.hasOwn(data, 'question') || bareQuestion)) {
      const single = clone(bareQuestion ? data : data.question);
      if (bareQuestion) for (const key of ['format', 'batch', 'reviewNotes', 'imageDescription']) delete single[key];
      if (object(single) && (single.id == null || typeof single.id === 'string' && !single.id.trim()) && createQuestionId) {
        delete single.id;
        single.id = createQuestionId(single);
      }
      data = {
        ...(bareQuestion ? { format: data.format, batch: data.batch, reviewNotes: data.reviewNotes, imageDescription: data.imageDescription } : data),
        mathQuestions: [single],
        ...(!bareQuestion && Array.isArray(data.visuals) ? { visuals: data.visuals.map(visual => object(visual) && !visual.questionId ? { ...visual, questionId: single?.id } : visual) } : {}),
      };
      delete data.question;
    }
    const math = data.mathQuestions ?? null;
    if (math === null) return contract.parse(data);
    if (data.format && ![contract.format, contract.mathFormat].includes(data.format)) throw new Error(`Expected ${contract.format}.`);
    if (!Array.isArray(math)) throw new Error('mathQuestions must be an array.');
    const info = metadata(data.batch);
    const entries = data.passage || data.passages ? contract.parse({ ...data, mathQuestions: [], batch: undefined }) : [];
    if (!math.length && !data.batch && entries.length) return entries;
    if (!math.length && !data.batch && !entries.length) throw new Error('Include Math questions, or a named batch continuation manifest.');
    const envelope = { ...data, passage: undefined, passages: undefined, mathQuestions: [] };
    // Validate shared metadata even if every question fails independently.
    const rootReview = contract.review(data.review || {}, true);
    const rootVisuals = contract.visuals(data.visuals || [], true);
    if (data.reviewNotes !== undefined && !Array.isArray(data.reviewNotes)) throw new Error('reviewNotes must be an array.');
    const ids = new Map(), sourceNumbers = new Map();
    for (const q of math) if (object(q)) {
      if (q.id) ids.set(q.id, (ids.get(q.id) || 0) + 1);
      if (q.review?.sourceQuestion) sourceNumbers.set(q.review.sourceQuestion, (sourceNumbers.get(q.review.sourceQuestion) || 0) + 1);
    }
    const content = { id: 'imported-math-questions', title: info.sourceLabel || 'Imported Math questions', questions: [], review: rootReview, visuals: [] };
    const items = math.map((raw, index) => {
      const item = { raw: clone(raw), sourceQuestion: typeof raw?.review?.sourceQuestion === 'string' ? raw.review.sourceQuestion : '', position: index, publications: {} };
      try {
        shape(clone(raw));
        if(info.sourceId && !item.sourceQuestion)throw new Error('Named source jobs require review.sourceQuestion on each question.');
        if (ids.get(raw.id) > 1 || item.sourceQuestion && sourceNumbers.get(item.sourceQuestion) > 1) throw new Error('Ambiguous duplicate question ID/source number in this chunk; correct each identity.');
        const visuals = rootVisuals.filter(v => !v.questionId || v.questionId === raw.id);
        if (visuals.some(v => !v.questionId)) throw new Error('Math batch visuals need an explicit questionId; shared figures must identify each question.');
        const [entry] = contract.parse({ ...envelope, review: rootReview, visuals, mathQuestions: [raw] });
        const question = shape(entry.content.questions[0]);
        question.visuals = [...(question.visuals || []), ...entry.content.visuals.map(v => ({ ...v, questionId: question.id }))];
        if(question.visuals.some(v=>v.questionId && v.questionId!==question.id))throw new Error('A visual questionId must match its containing question.');
        item.sourceVisuals=clone(visuals);
        item.questionId = question.id;
        item.receivedFingerprint = fingerprint(question);
        content.questions.push(question);
      } catch (error) { item.error = error.message; }
      return item;
    });
    if (rootVisuals.some(v => v.questionId && !math.some(q => q?.id === v.questionId))) throw new Error('A root visual refers to a question outside this chunk.');
    rootReview.warnings.push(...(data.reviewNotes || []).map(message => ({code:'UNCERTAIN_TEXT_EXTRACTION', message:String(message), state:'unresolved'})));
    // expectedQuestionCount describes this complete chunk, never the entire job.
    if (rootReview.expectedQuestionCount != null && rootReview.expectedQuestionCount !== math.length) rootReview.warnings.push({code:'COUNT_MISMATCH',message:`Chunk declares ${rootReview.expectedQuestionCount} questions but contains ${math.length}.`,state:'unresolved'});
    delete rootReview.expectedQuestionCount;
    entries.push({kind:'math',content,batch:{...info,items,chunks:[],receipts:[]}});
    return entries;
  }
  function question(entry, item) { return entry.content.questions.find(q => q.id === item.questionId); }
  function itemIssues(entry, item, taxonomy) {
    if (item.error) return [{code:'INVALID',message:item.error,blocking:true}];
    const q = question(entry,item);
    if (!q) return [{code:'INVALID',message:'Draft question is missing.',blocking:true}];
    try {
      shape(clone(q));
      const issues=contract.issues({...entry,content:{...entry.content, questions:[q], review:{...entry.content.review,expectedQuestionCount:1,sourceReviewed:q.review?.sourceReviewed === true,completenessReviewed:q.review?.completenessReviewed === true}}},taxonomy);
      const slots=new Map([["question",q.image?.src],...(q.choices||[]).map(c=>[c.id,c.image?.src])]);
      for(const visual of q.visuals||[]) {
        if(visual.state!=='resolved'||!visual.image||hasInlineImage(q,visual.image.src,visual.choiceId))continue;
        const slot=visual.choiceId||'question';
        if(!slots.has(slot))issues.push({code:'IMAGE_REQUIRED',message:'A source visual refers to a missing answer choice.',blocking:true});
        else if(slots.get(slot)&&slots.get(slot)!==visual.image.src)issues.push({code:'IMAGE_REQUIRED',message:'Place multiple source visuals inline or combine them into one faithful crop for this image slot.',blocking:true});
        else slots.set(slot,visual.image.src);
      }
      if(entry.batch?.inventoryConfirmed && !entry.batch.expectedQuestions.includes(item.sourceQuestion))issues.push({code:'COUNT_MISMATCH',message:'This question is outside the confirmed source inventory. Review the job scope.',blocking:true});
      const katex=typeof module !== 'undefined' ? require('katex') : globalThis.katex;
      const fields=[q.prompt,q.instructions,q.stimulus,q.promptHtml,q.instructionsHtml,q.stimulusHtml,...(q.choices||[]).flatMap(c=>[c.text,c.html]),...(q.dropdownContent||[]),...(q.dragDropContent||[]),...(q.items||[]).map(i=>i.text)];
      const expressions=fields.filter(v=>typeof v==='string').flatMap(text=>Array.from(text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g),m=>m[1]??m[2]??m[3]));
      expressions.push(...(q.choices||[]).map(c=>c.math).filter(Boolean),...(q.dropdowns||[]).flatMap(d=>d.options.map(o=>o.math).filter(Boolean)));
      if(katex)for(const expression of expressions)try{katex.renderToString(expression,{throwOnError:true,trust:false,strict:'ignore'});}catch(error){issues.push({code:'POSSIBLE_FORMATTING_LOSS',message:`Invalid math: ${error.message}`,blocking:true});}
      return issues;
    } catch (error) { return [{code:'INVALID',message:error.message,blocking:true}]; }
  }
  function report(entry, taxonomy) {
    const items = entry.batch.items;
    const received = new Set(items.map(i=>i.sourceQuestion).filter(Boolean));
    const missing = entry.batch.expectedQuestions.filter(n=>!received.has(n));
    return { identified:entry.batch.expectedTotal ?? (entry.batch.inventoryConfirmed ? entry.batch.expectedQuestions.length : null), received:items.length,
      draftSaved:items.filter(i=>!i.error).length, invalid:items.filter(i=>i.error).length, skipped:items.filter(i=>i.skipped).length,
      conflicts:items.filter(i=>i.conflicts?.length || i.possibleDuplicate && !i.distinctConfirmed).length,
      duplicates:entry.batch.receipts.filter(r=>r.outcome==='duplicate').length,
      published:items.filter(i=>Object.keys(i.publications || {}).length).length,
      ready:items.filter(i=>!i.skipped && !i.error && !Object.keys(i.publications || {}).length && !i.conflicts?.length && (!i.possibleDuplicate || i.distinctConfirmed) && !itemIssues(entry,i,taxonomy).some(e=>e.blocking)).length,
      missing, unreceived:Math.max(missing.length,(entry.batch.expectedTotal??items.length)-items.length), unresolved:items.filter(i=>!i.skipped && (i.error || i.conflicts?.length || i.possibleDuplicate && !i.distinctConfirmed || itemIssues(entry,i,taxonomy).some(e=>e.blocking))).length + Math.max(missing.length,(entry.batch.expectedTotal??items.length)-items.length) };
  }
  return {canonical,fingerprint,contentFingerprint,hasInlineImage,previewQuestion,metadata,shape,decode,parse,question,itemIssues,report};
})();
if (typeof module !== 'undefined') module.exports = MathImportBatch;
