/* Convert Reader exports into existing authoring contracts; never infer an answer. */
const { createHash } = require('node:crypto');
const { proseHtml, passageHeading, applyGlossary, inlinePhrase } = require('../extensions/sat-crash-course-reader/rich-text.js');
const text = value => typeof value === 'string' ? value : '';
const escape = value => text(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = html => text(html).replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 20);
function passageText(html, format) {
  // An empty verse block is one stanza spacer. Its br and closing p must not
  // each add a newline to the plain copy used by the shared poem renderer.
  return plain(format === 'poem' ? text(html).replace(/(<(?:p|div)\b[^>]*>)\s*<br\s*\/?>\s*(<\/(?:p|div)>)/gi, '$1$2') : html);
}
function passageHtml(passage) {
  let blocks = passage?.formattedBlocks || [];
  if (passage?.format === 'poem') {
    // Reader 0.8.0 copied its rendered verse table into the metadata, followed
    // by the same verse as individual lines. Remove only a proven duplicate.
    blocks = blocks.filter((block, index) => {
      if (!/\\begin\{array\}/.test(block.html || '')) return true;
      const lines = [...block.html.matchAll(/\\text\{((?:\\[\\$%&#_{}]|[^\\{}])*)\}/g)]
        .map(match => plain(proseHtml(`\\(\\text{${match[1]}}\\)`))).filter(Boolean);
      const following = blocks.slice(index + 1).map(b => plain(proseHtml(b.html || escape(b.text)))).filter(Boolean);
      return !lines.length || lines.length !== following.length || lines.some((line, i) => line !== following[i]);
    });
  }
  const html = text(passage?.html);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  const lastBlockPosition = blocks.length ? html.lastIndexOf(blocks.at(-1).html) : -1;
  const trailingImages = images.length && lastBlockPosition >= 0 && images.every(image => image.index > lastBlockPosition);
  // Blocks retain source paragraph/title breaks lost by HTML whitespace
  // collapsing. Keep whole HTML for tables/lists and positioned figures.
  if (blocks.length && (passage?.format === 'poem' || !/<(?:table|ul|ol|blockquote)\b/i.test(html) && (!images.length || trailingImages))) {
    const cleaned = blocks.map(block => proseHtml(block.html || escape(block.text)));
    const numbered = passage?.format !== 'poem' && cleaned.length > 1 && cleaned.every((block, i) => plain(block).match(/^(\d+)\s+/)?.[1] === String(i + 1));
    return cleaned.map(block => `<p>${numbered ? block.replace(/^(?:<(?:strong|em|b|i)>)*\d+(?:<\/(?:strong|em|b|i)>)*(?:\s|&nbsp;)+/, '') : block}</p>`).join('') +
      (trailingImages ? images.map(image => `<p data-numbered="false">${image[0]}</p>`).join('') : '');
  }
  return proseHtml(html || escape(passage?.text));
}
function passagePresentation(passage) {
  const blocks = passage?.formattedBlocks || [];
  const {end,metadata} = passageHeading(passage);
  if (!end) return {passage,metadata};
  let html = text(passage.html);
  for (const block of blocks.slice(0, end)) html = html.replace(block.html, '');
  return { metadata, passage: { ...passage, html, formattedBlocks: blocks.slice(end) } };
}
function passageFormat(passage, presentation) {
  const blurb = passage?.blurb || presentation.metadata.blurb || '';
  const firstParagraph = presentation.passage?.formattedBlocks?.[0]?.text || '';
  if (passage?.format !== 'poem' && /numbered sentences/i.test(blurb) && /^\s*\(1\)\s[\s\S]*\(2\)\s/.test(firstParagraph)) return 'sentence_prose';
  return passage?.format || 'prose';
}
function sourceMetadata(data) {
  return { ...data.source, sourceFamily:'sat_crash_course', sourceFormat:'web', playerProfile:'sat_crash_course', sourceId:text(data.source?.sourceId) || `satcc-${hash(text(data.source?.url).split(/[?#]/)[0])}`, label:text(data.source?.label) || text(data.testPreview?.testTitle) };
}
function decode(source) { return typeof source === 'string' ? JSON.parse(source.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/i, '$1')) : source; }
function isReader(data) { return Boolean(data?.testPreview && data?.source); }
function preview(data, kind) {
  const p = data.testPreview;
  if (!p || !Array.isArray(p.questions) || !p.questions.length || p.questions.length > 50) throw new Error('The reader export needs 1–50 captured questions.');
  if (kind === 'math' && !/math/i.test(p.module || '')) {
    throw new Error(`This file contains ${p.questions.length} questions from ${p.module || 'an unidentified section'}. Open Mathematics on the source test, choose “All 50 math questions” in the Reader, select Read, and download the new Mathematics JSON.`);
  }
  if (kind !== 'math' && !/english/i.test(p.module || '')) throw new Error('Use a Part B / English Language Arts reader export here.');
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
function hotTextResponse(interaction, warn) {
  const words = interaction.options || [];
  const choices = words.map((word, i) => ({
    id: String.fromCharCode(65 + i), text: text(word.text), html: inlinePhrase(proseHtml(word.html)),
  }));
  const correct = choices.filter((_, i) => words[i].isCorrect).map(choice => choice.id);
  const ids = new Map(words.map((word, i) => [word.id, choices[i].id]));
  const found = new Set();
  let depth = 0, phrase = '', selectionHtml = '';
  // Repair older captures before an HTML parser closes the surrounding
  // paragraph. Only flatten blocks within a marked phrase.
  for (const token of proseHtml(interaction.contentHtml).split(/(<\/?span\b[^>]*>)/i)) {
    const marker = /^<span\b[^>]*\bdata-source-option=["']([^"']+)["']/i.exec(token);
    if (!depth && marker && ids.has(marker[1])) {
      found.add(marker[1]);
      selectionHtml += `<span data-choice-id="${ids.get(marker[1])}">`;
      depth = 1;
    } else if (depth) {
      if (/^<span\b/i.test(token)) depth++;
      if (/^<\/span>/i.test(token)) depth--;
      if (depth) phrase += token;
      else { selectionHtml += inlinePhrase(phrase) + '</span>'; phrase = ''; }
    } else selectionHtml += token;
  }
  if (depth) selectionHtml += inlinePhrase(phrase) + '</span>';
  if (depth || !choices.length || found.size !== words.length) {
    warn('Source Hot Text is missing selectable phrase markup. Review the source and mark the phrases before publishing.');
    selectionHtml = selectionHtml || escape(interaction.text);
  }
  return {type: correct.length > 1 ? 'multi_select' : 'multiple_choice', choices, selectionHtml,
    ...(correct.length > 1 ? {correctChoiceIds:correct, requiredSelections:correct.length} : {correctChoiceId:correct[0] || ''})};
}

function partB(data) {
  const p = preview(data, 'part-b');
  return { format: 'nathan-tutors-part-b-v1', source:sourceMetadata(data), questions: p.questions.map(q => {
    const options = choices(q);
    const stimulusHtml = passageHtml(q.passage);
    const notes = [...(p.capture?.warnings || []), `SAT Crash Course source question ${q.sourceNumber || q.number}.`];
    const base = { sourceQuestion: String(q.sourceNumber || q.number), prompt: plain(q.promptHtml) || text(q.prompt), promptHtml: text(q.promptHtml), stimulus: text(q.passage?.text) || plain(stimulusHtml), stimulusHtml,
      explanation: plain(q.explanationHtml) || text(q.explanation), explanationHtml: text(q.explanationHtml), topic: '', points: 1, versionLabels: [text(p.testTitle)].filter(Boolean), notes };
    if (q.interaction?.type === 'hot_text') {
      return { ...base, ...hotTextResponse(q.interaction, message => notes.push(message)), sourceInteraction: q.interaction };
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
          if (q.hotSpot && media.length === 1) {
            options[i].image = {...asset, alt: options[i].text};
            continue;
          }
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
    mathQuestions.push({ id, ...response, ...(q.hotSpot && options.length ? {hotSpot:true} : {}), prompt: plain(q.promptHtml) || text(q.prompt), promptHtml,
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
    const standalone=q.contentRole==='standalone' || q.passage?.section==='revising_editing_b' || p.capture?.mode==='part-b' ||
      !q.passage || !q.passage.text && !q.passage.html && !q.passage.formattedBlocks?.length && !q.passage.media?.length ||
      q.contentRole!=='passage' && /\/tests\/digital-shsat\//i.test(source.url || '') && q.total===50 && q.number>=47 && q.number<=50;
    const groupKey=standalone ? `independent-${q.number}` : q.passage?.id || hash(q.passage.text || q.passage.html || JSON.stringify(q.passage));
    if(!groups.has(groupKey)) groups.set(groupKey,{sourcePassage:q.passage,standalone,questions:[]});
    groups.get(groupKey).questions.push(q);
  }
  const passages=[],englishQuestions=[];
  for(const [groupKey,group] of groups) {
    const warnings=(group.sourcePassage?.reviewNotes||[]).map(message=>({code:'POSSIBLE_FORMATTING_LOSS',message,state:'unresolved'})), visuals=[];
    async function localize(html, media=[], questionId='') {
      let result=proseHtml(html);
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
    const sp=applyGlossary(group.sourcePassage,group.sourcePassage?.glossary), presentation=passagePresentation(sp), richText=await localize(passageHtml(presentation.passage),sp?.media);
    const definedTerms=new Set([...richText.matchAll(/<span\b[^>]*\bdata-glossary-definition="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g)].filter(match=>plain(match[1])).map(match=>plain(match[2])));
    const missingTerms=(sp?.glossaryTerms || []).filter(term=>!definedTerms.has(term));
    if(missingTerms.length)warnings.push({code:'POSSIBLE_FORMATTING_LOSS',message:`Source has glossary popups for ${missingTerms.join(', ')}, but this export contains only the terms. Capture their exact source definitions before claiming glossary fidelity.`,state:'unresolved'});
    const questions=[];
    for(const q of group.questions) {
      const id=`${source.sourceId}-ela-${q.number}`, qw=(q.reviewNotes||[]).map(message=>({code:'POSSIBLE_FORMATTING_LOSS',message,state:'unresolved'})), options=choices(q);
      for (const option of options) { option.html = proseHtml(option.html); option.text = plain(option.html) || option.text; }
      for(let i=0;i<options.length;i++)options[i].html=await localize(options[i].html,q.choices[i].media,id);
      let response;
      if(q.interaction?.type==='hot_text') {
        response=hotTextResponse(q.interaction, message => qw.push({code:'POSSIBLE_FORMATTING_LOSS',message,state:'unresolved'}));
      } else if(q.interaction?.type==='sentence_blank') {
        const interaction=q.interaction;
        response={type:'transition_drop',dragDropStyle:'outlined',choices:interaction.options.map(item=>({id:item.id,text:item.text,html:proseHtml(item.html)})),dragDropContent:[plain(proseHtml(interaction.contentHtml))],dragDropContentHtml:proseHtml(interaction.contentHtml),dragDropSlots:interaction.slots.map(slot=>{const matches=interaction.options.filter(item=>item.text===slot.answer);return {id:slot.id,correctItemId:matches.length===1?matches[0].id:''};}),allowReuse:false};
      } else response=mathResponse(q,options,qw);
      const choiceUrls=new Set((q.choices||[]).flatMap(c=>(c.media||[]).map(m=>m.url)));
      questions.push({id,...response,prompt:plain(proseHtml(q.promptHtml))||text(q.prompt),promptHtml:await localize(q.promptHtml||escape(q.prompt),(q.media||[]).filter(m=>!choiceUrls.has(m.url)),id),explanation:plain(proseHtml(q.explanationHtml))||text(q.explanation),explanationHtml:await localize(q.explanationHtml,q.explanationMedia,id),points:1,topic:'',source:{...source,section:'ela',questionNumber:q.number,sourceQuestionNumber:q.sourceNumber||q.number},sourceInteraction:q.interaction||null,sourceRecord:q,review:{sourceFile:p.testTitle,sourceQuestion:String(q.sourceNumber||q.number),warnings:qw}});
    }
    if(group.standalone) {
      englishQuestions.push(...questions.map(q=>({...q,stimulus:passageText(richText,sp?.format)||text(sp?.text),stimulusHtml:richText,versionLabels:[p.testTitle].filter(Boolean),source:{...q.source,section:'revising_editing_a'},review:{...q.review,warnings:[...q.review.warnings,...warnings]},visuals})));
    } else passages.push({id:`${source.sourceId}-${groupKey}`.toLowerCase().replace(/[^a-z0-9-]/g,'-'),...presentation.metadata,title:text(sp?.title)||presentation.metadata.title||'',author:text(sp?.author)||presentation.metadata.author||'',byline:text(sp?.byline)||presentation.metadata.byline||'',blurb:text(sp?.blurb)||presentation.metadata.blurb||'',sourceNote:text(sp?.sourceNote),label:text(sp?.label)||text(sp?.title)||presentation.metadata.title||'',versionLabel:p.testTitle,source,sourceRecord:sp||null,format:passageFormat(sp,presentation),passageType:passageFormat(sp,presentation)==='poem'?'poem':sp?.passageType==='literary'?'literary':'informational',passageCategory:'prestige',section:sp?.section||'reading',text:passageText(richText,sp?.format)||text(sp?.text),richText,questions,review:{sourceFile:p.testTitle,expectedQuestionCount:questions.length,warnings},visuals});
  }
  return {format:'nathan-tutors-official-passage-v1',source,passages,...(englishQuestions.length?{englishQuestions}:{}),questionOrder:p.questions.map(q=>`${source.sourceId}-ela-${q.number}`),reviewNotes:p.capture?.warnings||[]};
}
module.exports = { decode, isReader, partB, math, ela, plain, passageText, sourceMetadata };
