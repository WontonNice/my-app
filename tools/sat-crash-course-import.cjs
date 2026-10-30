/* Convert Reader exports into existing authoring contracts; never infer an answer. */
const { createHash } = require('node:crypto');
const text = value => typeof value === 'string' ? value : '';
const escape = value => text(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = html => text(html).replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 20);
function sourceMetadata(data) {
  return { ...data.source, sourceFamily:'sat_crash_course', sourceFormat:'web', playerProfile:'sat_crash_course', sourceId:text(data.source?.sourceId) || `satcc-${hash(text(data.source?.url).split(/[?#]/)[0])}`, label:text(data.source?.label) || text(data.testPreview?.testTitle) };
}
function decode(source) { return typeof source === 'string' ? JSON.parse(source.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1')) : source; }
function isReader(data) { return Boolean(data?.testPreview && data?.source); }
function preview(data, kind) {
  const p = data.testPreview;
  if (!p || !Array.isArray(p.questions) || !p.questions.length || p.questions.length > 50) throw new Error('The reader export needs 1–50 captured questions.');
  if (kind === 'math' ? !/math/i.test(p.module || '') : !/english/i.test(p.module || '')) throw new Error(`Use a ${kind === 'math' ? 'Mathematics' : 'Part B / English Language Arts'} reader export here.`);
  if (kind === 'part-b' && p.capture?.mode !== 'part-b') throw new Error('Choose Revising/Editing Part B in SAT Crash Course Reader and export the requested question range.');
  const numbers = p.questions.map(q => q.number);
  if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 50) || new Set(numbers).size !== numbers.length) throw new Error('Reader question numbers are missing, duplicated, or outside 1–50.');
  return p;
}
function choices(q) {
  return (q.choices || []).map((c, i) => ({ id: String.fromCharCode(65 + i), text: plain(c.html) || text(c.text), html: text(c.html), sourceLabel: text(c.label) }));
}
function key(q, options) {
  const matches = options.filter(c => c.sourceLabel === q.correctAnswer?.label);
  return matches.length === 1 ? matches[0].id : '';
}
function expressionAlternatives(value) {
  // Commas within parentheses/braces belong to an expression, not its answer list.
  const parts = []; let depth = 0, start = 0;
  for (let i = 0; i < value.length; i++) {
    if ('([{'.includes(value[i])) depth++;
    else if (')]}'.includes(value[i])) depth--;
    else if (value[i] === ',' && depth === 0) { parts.push(value.slice(start, i).trim()); start = i + 1; }
    if (depth < 0) return [];
  }
  if (depth !== 0) return [];
  parts.push(value.slice(start).trim());
  return [...new Set(parts.filter(Boolean))];
}
function mathResponse(q, options, warnings) {
  const interaction = q.interaction;
  const unsupported = message => {
    warnings.push({code:'UNSUPPORTED_RESPONSE_TYPE', message, state:'unresolved'});
    return {type:'short_response', correctTextAnswers:[]};
  };
  if (interaction?.type === 'short_response') {
    if (interaction.slots?.length !== 1) return unsupported('Source has several text-entry blanks. Configure their response manually; source fields and keys are retained in the original record.');
    return {type:'short_response', correctTextAnswers:interaction.slots[0].answer ? [text(interaction.slots[0].answer)] : []};
  }
  if (interaction?.type === 'expression_entry') {
    const answers = expressionAlternatives(text(interaction.answer));
    return {type:'expression_entry', entryLayout:'plain', correctTextAnswers:answers};
  }
  if (interaction?.type === 'inline_dropdown') {
    return {type:'inline_dropdown', dropdownContent:[plain(interaction.contentHtml)], dropdownContentHtml:text(interaction.contentHtml), dropdowns:interaction.dropdowns.map(menu => {
      const correct = menu.options.filter(item => item.isCorrect);
      return {id:menu.id, options:menu.options.map(item => ({id:item.id, text:plain(item.html) || text(item.text),html:text(item.html)})), correctChoiceId:correct.length === 1 ? correct[0].id : ''};
    })};
  }
  if (interaction?.type === 'matrix_choice' || interaction?.type === 'category_sort') {
    const items=(interaction.items||[]).map(item=>({id:text(item.id),text:text(item.text),html:text(item.html)}));
    const categories=(interaction.categories||[]).map(category=>({id:text(category.id),title:text(category.title)}));
    const correctPlacements={};
    for(const item of items){const target=interaction.correctPlacements?.[item.id];if(categories.some(c=>c.id===target))correctPlacements[item.id]=target;}
    return {type:interaction.type,items,categories,correctPlacements,requiredPlacements:items.length};
  }
  if (interaction?.type === 'sentence_blank') {
    const items = interaction.options.map(item => ({id:item.id, text:plain(item.html) || text(item.text)}));
    const dragDropSlots = interaction.slots.map(slot => {
      const answer = plain(slot.answerHtml) || text(slot.answer);
      const matches = items.filter(item => item.text.trim() === answer.trim());
      return {id:slot.id, correctItemId:answer && matches.length === 1 ? matches[0].id : ''};
    });
    return {type:'math_drag_drop', items:items.map((item,i)=>({...item,html:text(interaction.options[i].html)})), dragDropContent:[plain(interaction.contentHtml)],dragDropContentHtml:text(interaction.contentHtml), dragDropSlots, allowReuse:false};
  }
  if (interaction) return unsupported(`Source interaction ${interaction.type} needs manual setup; the full captured record is retained.`);
  if (!options.length) return unsupported('Unrecognized response controls; source question retained with a blank key for manual setup.');
  const selected = options.filter((_, i) => q.choices[i].isCorrect).map(option => option.id);
  return q.responseType === 'multi_select' || selected.length > 1 ? {type:'multi_select', choices:options, correctChoiceIds:selected, ...(q.requiredSelections || selected.length ? {requiredSelections:q.requiredSelections || selected.length} : {})}
    : {type:'multiple_choice', choices:options, correctChoiceId:key(q, options)};
}
function partB(data) {
  const p = preview(data, 'part-b');
  return { format: 'nathan-tutors-part-b-v1', source:sourceMetadata(data), questions: p.questions.map(q => {
    const options = choices(q), blocks = q.passage?.formattedBlocks || [];
    const stimulusHtml = blocks.map(b => `<p>${b.html || escape(b.text)}</p>`).join('') || escape(q.passage?.text);
    const notes = [...(p.capture?.warnings || []), `SAT Crash Course source question ${q.sourceNumber || q.number}.`];
    const base = { sourceQuestion: String(q.sourceNumber || q.number), prompt: plain(q.promptHtml) || text(q.prompt), promptHtml: text(q.promptHtml), stimulus: text(q.passage?.text) || plain(stimulusHtml), stimulusHtml,
      explanation: plain(q.explanationHtml) || text(q.explanation), explanationHtml: text(q.explanationHtml), topic: '', points: 1, versionLabels: [text(p.testTitle)].filter(Boolean), notes };
    if (q.interaction?.type === 'hot_text') {
      const words = q.interaction.options || [], correct = words.filter(item => item.isCorrect);
      notes.push('Source hot-text selection imported as multiple choice. The selectable words remain in source order; the original interaction is retained below.');
      return { ...base, type: 'multiple_choice', choices: words.map((w, i) => ({ id: String.fromCharCode(65 + i), text: text(w.text), html: text(w.html) })), correctChoiceId: correct.length === 1 ? String.fromCharCode(65 + words.indexOf(correct[0])) : '', sourceInteraction: q.interaction };
    }
    if (q.interaction?.type === 'sentence_blank' && q.interaction.slots?.length === 1) {
      const interaction = q.interaction, items = interaction.options.map((item, i) => ({ id: `card-${i + 1}`, text: text(item.text), html: text(item.html) }));
      const answers = items.filter(item => item.text === interaction.slots[0].answer);
      const sentenceHtml = text(interaction.contentHtml).replace(/\{\{blank-\d+\}\}/g, '<u>________</u>');
      notes.push('Source sentence blank imported as a drag-and-drop answer box. The exact sentence and blank are included below the paragraph; original interaction retained.');
      return { ...base, type: 'category_sort', stimulusHtml: `${stimulusHtml}<p>${sentenceHtml}</p>`, stimulus: `${base.stimulus}\n\n${plain(sentenceHtml)}`, items, categories: [{ id: 'answer-box', title: 'Sentence blank' }], categoryCapacity: 1, requiredPlacements: 1, correctPlacements: answers.length === 1 ? { [answers[0].id]: 'answer-box' } : {}, sourceInteraction: interaction };
    }
    if (q.interaction || !options.length) notes.push('Source response needs manual setup. Full captured record retained.');
    return { ...base, type: 'multiple_choice', choices: options, correctChoiceId: key(q, options), ...(q.interaction || !options.length ? { sourceRecord: q } : {}) };
  }) };
}
async function math(data, resolveImage) {
  const p = preview(data, 'math');
  const sourceId = sourceMetadata(data).sourceId;
  const missing = Array.from({length:50}, (_, i) => i + 1).filter(n => !p.questions.some(q => q.number === n));
  const reviewNotes = [...(p.capture?.warnings || []), ...(missing.length ? [`Partial Math export: missing module questions ${missing.join(', ')}.`] : [])];
  const mathQuestions = [];
  for (const q of p.questions) {
    const options = choices(q), visuals = [], warnings = [];
    const id = `${sourceId}-math-${q.number}`;
    async function image(media, choiceId = '') {
      if (!media?.url) return null;
      const alt = text(media.alt) || `Source figure for question ${q.sourceNumber || q.number}`;
      try { return { ...(await resolveImage(media.url)), alt }; }
      catch (error) {
        visuals.push({ scope: `Question ${q.sourceNumber || q.number}${choiceId ? ` choice ${choiceId}` : ''}`, questionId: id, choiceId, description: `${alt} — ${media.url}`, sourceFile: text(p.testTitle), sourcePage: null, state: 'unresolved' });
        warnings.push({ code: 'IMAGE_REQUIRED', message: `Source diagram could not be downloaded: ${error.message}. ${media.url}`, state: 'unresolved' });
        return null;
      }
    }
    for (let i = 0; i < options.length; i++) {
      const media = q.choices[i].media || [];
      for (const item of media) {
        const asset = await image(item, options[i].id);
        if (asset) {
          const original=`src="${escape(item.url)}"`;
          options[i].html = options[i].html.includes(original) ? options[i].html.split(original).join(`src="${escape(asset.src)}"`) : options[i].html + `<br><img src="${escape(asset.src)}" alt="${escape(asset.alt)}">`;
        }
      }
    }
    const choiceUrls = new Set((q.choices || []).flatMap(c => (c.media || []).map(m => m.url)));
    let promptHtml = text(q.promptHtml) || escape(q.prompt);
    for (const media of (q.media || []).filter(m => !choiceUrls.has(m.url))) {
      const asset = await image(media);
      if (asset) {
        const original=`src="${escape(media.url)}"`;
        promptHtml = promptHtml.includes(original) ? promptHtml.split(original).join(`src="${escape(asset.src)}"`) : promptHtml + `<br><img src="${escape(asset.src)}" alt="${escape(asset.alt)}">`;
      }
    }
    let explanationHtml=text(q.explanationHtml);
    for(const media of q.explanationMedia || []) {
      const asset=await image(media);
      if(asset) explanationHtml=explanationHtml.split(`src="${escape(media.url)}"`).join(`src="${escape(asset.src)}"`);
    }
    const response = mathResponse(q, options, warnings);
    mathQuestions.push({ id, ...response, prompt: plain(q.promptHtml) || text(q.prompt), promptHtml,
      explanation: plain(q.explanationHtml) || text(q.explanation), explanationHtml, topic:'', subtopic:'', points:1, visuals,
      source:{...sourceMetadata(data),section:'math',questionNumber:q.number,sourceQuestionNumber:q.sourceNumber || q.number},
      review: { sourceFile: text(p.testTitle), sourceQuestion: String(q.number), printedPages: `Site question ${q.sourceNumber || q.number}`, warnings },
      sourceRecord: q });
  }
  return { format:'nathan-tutors-official-passage-v1', source:sourceMetadata(data), mathQuestions, reviewNotes,
    batch: { sourceId, jobId:'math-section', sourceLabel:text(p.testTitle), section:'math', requestedScope:'All 50 math questions', expectedQuestions:Array.from({length:50}, (_, i) => String(i + 1)), expectedTotal:50, inventoryConfirmed: p.questions.every(q => q.total === 50), completedQuestions:p.questions.map(q => String(q.number)), unresolvedQuestions:missing.map(String), nextScope:missing.join(', ') } };
}
async function ela(data, resolveImage = async () => {throw Error('No source asset resolver supplied');}) {
  const p=preview(data,'ela'), source=sourceMetadata(data), groups=new Map();
  for(const q of p.questions) {
    const groupKey=q.passage?.id || (q.passage?.text ? hash(q.passage.text) : 'independent');
    if(!groups.has(groupKey)) groups.set(groupKey,{sourcePassage:q.passage,questions:[]});
    groups.get(groupKey).questions.push(q);
  }
  const passages=[],englishQuestions=[];
  for(const [groupKey,group] of groups) {
    const warnings=(group.sourcePassage?.reviewNotes||[]).map(message=>({code:'POSSIBLE_FORMATTING_LOSS',message,state:'unresolved'})), visuals=[];
    async function localize(html, media=[], questionId='') {
      let result=text(html);
      const observed=new Map(media.filter(m=>m.url).map(m=>[m.url,m]));
      for(const match of result.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) {
        const url=match[1].replace(/&amp;/g,'&');if(!observed.has(url))observed.set(url,{url,alt:''});
      }
      for(const media of observed.values()) {
        try {
          const asset=await resolveImage(media.url), old=`src="${escape(media.url)}"`;
          if(result.includes(old))result=result.split(old).join(`src="${escape(asset.src)}"`);
          else result+=`<img src="${escape(asset.src)}" alt="${escape(media.alt)}"${media.width?` width="${Number(media.width)}"`:''}>`;
        } catch(error) {
          warnings.push({code:'IMAGE_REQUIRED',message:`Source image ${media.url}: ${error.message}`,state:'unresolved'});
          visuals.push({scope:questionId||groupKey,questionId,choiceId:'',sourceFile:p.testTitle,sourcePage:null,description:media.url,state:'unresolved'});
        }
      }
      return result;
    }
    const sp=group.sourcePassage, richText=await localize(sp?.html || (sp?.formattedBlocks || []).map(b=>`<p>${b.html || escape(b.text)}</p>`).join('') || escape(sp?.text),sp?.media);
    if(sp?.glossaryTerms?.length&&!richText.includes('data-glossary-definition='))warnings.push({code:'POSSIBLE_FORMATTING_LOSS',message:`Source has glossary popups for ${sp.glossaryTerms.join(', ')}, but this export contains only the terms. Capture their exact source definitions before claiming glossary fidelity.`,state:'unresolved'});
    const questions=[];
    for(const q of group.questions) {
      const id=`${source.sourceId}-ela-${q.number}`, qw=(q.reviewNotes||[]).map(message=>({code:'POSSIBLE_FORMATTING_LOSS',message,state:'unresolved'})), options=choices(q);
      for(let i=0;i<options.length;i++)options[i].html=await localize(options[i].html,q.choices[i].media,id);
      let response;
      if(q.interaction?.type==='hot_text') {
        const words=q.interaction.options || [], selected=words.filter(w=>w.isCorrect).map(w=>String.fromCharCode(65+words.indexOf(w)));
        let selectionHtml=text(q.interaction.contentHtml);
        words.forEach((w,i)=>{selectionHtml=selectionHtml.split(`data-source-option="${w.id}"`).join(`data-choice-id="${String.fromCharCode(65+i)}"`);});
        if(!selectionHtml) {selectionHtml=escape(q.interaction.text);qw.push({code:'POSSIBLE_FORMATTING_LOSS',message:'Legacy hot-text export lacks selectable source markup; recapture with Reader 0.8.0.',state:'unresolved'});}
        response={type:selected.length>1?'multi_select':'multiple_choice',choices:words.map((w,i)=>({id:String.fromCharCode(65+i),text:w.text,html:w.html})),selectionHtml,...(selected.length>1?{correctChoiceIds:selected,requiredSelections:selected.length}:{correctChoiceId:selected[0]||''})};
      } else if(q.interaction?.type==='sentence_blank') {
        const interaction=q.interaction;
        response={type:'transition_drop',choices:interaction.options.map(item=>({id:item.id,text:item.text,html:item.html})),dragDropContent:[plain(interaction.contentHtml)],dragDropContentHtml:text(interaction.contentHtml),dragDropSlots:interaction.slots.map(slot=>{const matches=interaction.options.filter(item=>item.text===slot.answer);return {id:slot.id,correctItemId:matches.length===1?matches[0].id:''};}),allowReuse:false};
      } else response=mathResponse(q,options,qw);
      const choiceUrls=new Set((q.choices||[]).flatMap(c=>(c.media||[]).map(m=>m.url)));
      questions.push({id,...response,prompt:plain(q.promptHtml)||text(q.prompt),promptHtml:await localize(q.promptHtml||escape(q.prompt),(q.media||[]).filter(m=>!choiceUrls.has(m.url)),id),explanation:plain(q.explanationHtml)||text(q.explanation),explanationHtml:await localize(q.explanationHtml,q.explanationMedia,id),points:1,topic:'',source:{...source,section:'ela',questionNumber:q.number,sourceQuestionNumber:q.sourceNumber||q.number},sourceInteraction:q.interaction||null,sourceRecord:q,review:{sourceFile:p.testTitle,sourceQuestion:String(q.sourceNumber||q.number),warnings:qw}});
    }
    if(sp?.section==='revising_editing_b') {
      englishQuestions.push(...questions.map(q=>({...q,stimulus:text(sp?.text)||plain(richText),stimulusHtml:richText,source:{...q.source,section:'revising_editing_b'},review:{...q.review,warnings:[...q.review.warnings,...warnings]},visuals})));
    } else passages.push({id:`${source.sourceId}-${groupKey}`.toLowerCase().replace(/[^a-z0-9-]/g,'-'),title:text(sp?.title),author:text(sp?.author),byline:text(sp?.byline),blurb:text(sp?.blurb),sourceNote:text(sp?.sourceNote),label:text(sp?.label)||text(sp?.title),versionLabel:p.testTitle,source,sourceRecord:sp||null,format:sp?.format||'prose',passageType:sp?.format==='poem'?'poem':'long_reading',passageCategory:'prestige',section:sp?.section||'reading',text:text(sp?.text)||plain(richText),richText,questions,review:{sourceFile:p.testTitle,expectedQuestionCount:questions.length,warnings},visuals});
  }
  return {format:'nathan-tutors-official-passage-v1',source,passages,...(englishQuestions.length?{englishQuestions}:{}),questionOrder:p.questions.map(q=>`${source.sourceId}-ela-${q.number}`),reviewNotes:p.capture?.warnings||[]};
}
module.exports = { decode, isReader, partB, math, ela, plain, sourceMetadata };
