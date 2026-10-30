/* A passage version includes its ordered question set, not just its title. */
const labels = passage => {
  const seen = new Set();
  return [passage.versionLabel, ...(passage.versionLabels || [])].filter(value=>typeof value==='string').map(value=>value.trim()).filter(value=>{const key=value.toLocaleLowerCase();if(!value || seen.has(key))return false;seen.add(key);return true;});
};
const text = value => String(value || '').replace(/\r\n?/g, '\n').replace(/\s+/g, ' ').trim();
const rich = (html, plain) => text(html || plain)
  // A glossary popup's footnote number is not part of the passage wording.
  .replace(/(<span\b[^>]*\bdata-glossary-definition=[^>]*>[\s\S]*?<\/span>)\s*<sup>\s*\d+\s*<\/sup>/gi, '$1')
  .replace(/<(sup|sub)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, value) => `${tag.toLowerCase() === 'sup' ? '^' : '_'}{${value}}`)
  // Underlining can identify the exact phrase the student must revise.
  .replace(/<u\b[^>]*>([\s\S]*?)<\/u>/gi, '[underlined:$1]')
  .replace(/<img\b[^>]*>/gi, tag => {
    const src = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
    return ` [image:${src?.[1] ?? src?.[2] ?? tag}] `;
  })
  .replace(/<\/?(?:p|div|blockquote|li|h[1-6])\b[^>]*>|<br\s*\/?>/gi, ' ')
  .replace(/<[^>]*>/g, '')
  .replace(/&(#x[\da-f]+|#\d+|nbsp|amp|quot|apos|lt|gt);/gi, (entity, name) => {
    if (name[0] !== '#') return {nbsp:' ',amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'}[name.toLowerCase()];
    const code = parseInt(name.slice(name[1].toLowerCase() === 'x' ? 2 : 1), name[1].toLowerCase() === 'x' ? 16 : 10);
    return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }).replace(/\s+/g, ' ').trim();
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
function questionKey(question) {
  const { id, source, topic, subtopic, skilled, explanation, explanationHtml, review, visuals, prompt, promptHtml, stimulus, stimulusHtml, instructions, instructionsHtml, ...rest } = question;
  const choices = question.choices || [];
  const choiceIndex = id => choices.findIndex(choice => choice.id === id);
  return canonical({ ...rest, prompt: rich(promptHtml, prompt), stimulus: rich(stimulusHtml, stimulus), instructions: rich(instructionsHtml, instructions),
    ...(choices.length ? { choices: choices.map(({id, text:plain, html, ...choice}) => ({...choice,text:rich(html,plain)})), correctChoiceId: choiceIndex(question.correctChoiceId), correctChoiceIds: (question.correctChoiceIds || []).map(choiceIndex) } : {}) });
}
function identical(left, right) {
  if (left.source?.sourceFamily && right.source?.sourceFamily && left.source.sourceFamily !== right.source.sourceFamily) return false;
  if (left.section !== right.section || !text(left.text) || !left.questions?.length || left.questions.length !== right.questions?.length) return false;
  if ((left.format === 'poem' || right.format === 'poem') && String(left.text).replace(/\r\n?/g,'\n').trim() !== String(right.text).replace(/\r\n?/g,'\n').trim()) return false;
  return JSON.stringify(canonical({text:rich(left.richText,left.text), images:left.images || [], image:left.image || null, questions:left.questions.map(questionKey)})) ===
    JSON.stringify(canonical({text:rich(right.richText,right.text), images:right.images || [], image:right.image || null, questions:right.questions.map(questionKey)}));
}
function distinct(passage, existing) {
  const occupied = new Set(existing.flatMap(item => [item.id, item.fileName?.replace(/\.ts$/, '')]));
  let index=2, id=passage.id;
  while (occupied.has(id)) id=`${passage.id}-version-${index++}`;
  return {...passage,id,fileName:`${id}.ts`,exportName:'passage'+id.replace(/-([a-z0-9])/g,(_,letter)=>letter.toUpperCase())+'Set',passageSetId:`ela-${id}`,
    questions:passage.questions.map((question,index)=>({...question,id:`${id}-${index+1}`}))};
}
module.exports={labels,identical,distinct};
