import { createHash } from 'node:crypto';

const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
function htmlText(value) {
  return String(value || '').replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<\/?(?:p|div|br|li|h[1-6])\b[^>]*>/gi,' ').replace(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi, '')
    .replace(/&(#x[0-9a-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi, (match, entity) => {
      if (!entity.startsWith('#')) return ({nbsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"})[entity.toLowerCase()];
      const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2),16) : Number(entity.slice(1));
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
    });
}
export function normalizeDuplicateText(value, math = false) {
  const result = String(value || '').normalize('NFC').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"')
    .replace(/\u2212/g,'-').replace(/\\(?:left|right)\b/g,'').replace(/\\[()[\]]|\$\$/g,'')
    .replace(/\\(?:dfrac|tfrac)\b/g,'\\frac').replace(/\\(?:leq|le)\b/g,'≤').replace(/\\(?:geq|ge)\b/g,'≥')
    .replace(/\\times\b/g,'×').replace(/\\cdot\b/g,'·').replace(/\\[,!;:]|\\(?:quad|qquad)\b/g,' ')
    .replace(/\s+/g,' ').trim();
  return math ? result.replace(/\s*([=+*/^≤≥<>×·{},()-])\s*/g,'$1') : result.toLowerCase();
}
function similarity(a,b) {
  if (a === b) return a ? 1 : 0;
  if (!a || !b || Math.min(a.length,b.length)/Math.max(a.length,b.length) < .75) return 0;
  const grams = value => {
    const tokens = value.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
    const result = new Map();
    for (let i=1;i<tokens.length;i++) { const key=tokens[i-1]+' '+tokens[i];result.set(key,(result.get(key)||0)+1); }
    return result;
  };
  const left=grams(a),right=grams(b);let overlap=0,total=0;
  for(const [key,count] of left){total+=count;overlap+=Math.min(count,right.get(key)||0);}
  for(const count of right.values())total+=count;
  return total ? 2*overlap/total : 0;
}

export async function compareExamState(state, leftId, rightId, { imageFingerprint = async () => null } = {}) {
  if (!leftId || !rightId || leftId === rightId) throw new Error('Choose two different saved tests.');
  const tests = [leftId,rightId].map(id => state.tests.find(test => test.assessmentId === id));
  if(tests.some(test=>!test))throw new Error('Both tests need saved exam content before they can be compared.');
  const imageCache=new Map();
  function image(src) {
    if(!imageCache.has(src))imageCache.set(src,Promise.resolve().then(()=>imageFingerprint(src)).catch(()=>null));
    return imageCache.get(src);
  }
  async function descriptor(content, math) {
    let verified=true;const images=[];
    async function asset(src) {
      const value=await image(src);if(!value)verified=false;images.push(src);
      return value || `unverified:${src}`;
    }
    async function rich(text,html) {
      const sources=[...String(html||'').matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)].map(match=>match[1]);
      return {text:normalizeDuplicateText(html ? htmlText(html) : text,math),images:await Promise.all(sources.map(asset))};
    }
    async function clean(value) {
      if(Array.isArray(value))return Promise.all(value.map(clean));
      if(!value || typeof value!=='object')return typeof value==='string' ? normalizeDuplicateText(value,math) : value;
      if(value.src)return {image:await asset(value.src),caption:normalizeDuplicateText(value.caption,math)};
      const result={};
      if(value.text!==undefined || value.html!==undefined)result.content=await rich(value.text,value.html);
      for(const [key,entry] of Object.entries(value)) {
        if(['id','text','html','alt','review','explanation','topic','subtopic','points','entryLayout'].includes(key)||key.startsWith('correct')||entry===undefined)continue;
        result[key]=await clean(entry);
      }
      return result;
    }
    let semantic;
    if(content.kind==='passage')semantic={body:await rich(content.text,content.richText),images:await clean(content.images || [])};
    else {
      const q=content;
      semantic={type:q.type,prompt:await rich(q.prompt,q.promptHtml),instructions:await rich(q.instructions,q.instructionsHtml),stimulus:await rich(q.stimulus,q.stimulusHtml),image:q.image ? await clean(q.image) : null};
      semantic.choices=(await Promise.all((q.choices||[]).map(clean))).map(canonical).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
      for(const key of ['dropdownContent','dropdowns','dragDropContent','dragDropSlots','items','categories','tableHeaders','graph','numberLineResponse','requiredSelections','requiredPlacements','allowReuse','categoryCapacity'])if(q[key]!==undefined)semantic[key]=await clean(q[key]);
    }
    const text=content.kind==='passage' ? semantic.body.text : [semantic.prompt.text,semantic.instructions.text,semantic.stimulus.text,...semantic.choices.map(choice=>choice.content?.text || choice.math || '')].join(' ').trim();
    return {key:digest(canonical(semantic)),text,verified,images:[...new Set(images)]};
  }
  async function collect(test) {
    const result={passages:[],english:[],math:[],warnings:[]};let englishNumber=0;
    for(const [index,id] of (test.passageIds||[]).entries()){
      const passage=state.passages.find(p=>p.id===id);
      if(!passage){result.warnings.push(`A passage in ${test.title} could not be read.`);continue;}
      const record={id,number:index+1,label:passage.title||`Passage ${index+1}`,content:{...passage,kind:'passage'},...(await descriptor({...passage,kind:'passage'},false))};
      if(/[\p{L}\p{N}]/u.test(record.text)||record.images.length)result.passages.push(record);
      for(const q of passage.questions||[])result.english.push({id:q.id,number:++englishNumber,label:`English ${englishNumber} · ${record.label}`,content:q,context:record,...(await descriptor(q,false))});
    }
    for(const id of test.standaloneItemIds||[]){
      const q=state.standaloneItems.find(q=>q.id===id);if(!q){result.warnings.push(`A Part B question in ${test.title} could not be read.`);continue;}
      result.english.push({id:q.id,number:++englishNumber,label:`English ${englishNumber} · Part B`,content:q,...(await descriptor(q,false))});
    }
    const section=state.mathSections.find(section=>section.fileName===test.mathSectionFileName);
    if(test.mathSectionFileName&&!section)result.warnings.push(`The Math section in ${test.title} could not be read.`);
    for(const [index,q] of (section?.questions||[]).entries())result.math.push({id:q.id,number:index+1,label:`Math ${index+1}`,content:q,...(await descriptor(q,true))});
    for(const kind of ['math','english']){
      const before=result[kind].length;
      result[kind]=result[kind].filter(item=>/[\p{L}\p{N}]/u.test(normalizeDuplicateText(item.content.promptHtml ? htmlText(item.content.promptHtml) : item.content.prompt))||item.images.length);
      if(result[kind].length<before)result.warnings.push(`${before-result[kind].length} empty ${kind==='math'?'Math':'English'} question(s) in ${test.title} were excluded.`);
    }
    return result;
  }
  const [left,right]=await Promise.all(tests.map(collect));
  const matches=[],possible=[];const stats={};
  const publicItem=item=>({id:item.id,number:item.number,label:item.label,content:item.content,images:item.images});
  const key=item=>item.key+(item.context?':'+item.context.key:'');
  for(const kind of ['math','english','passages']){
    const groups=new Map();
    for(const side of ['left','right'])for(const item of (side==='left'?left:right)[kind]){
      if(!item.verified || item.context&&!item.context.verified)continue;
      const identity=key(item);if(!groups.has(identity))groups.set(identity,{kind,left:[],right:[]});groups.get(identity)[side].push(item);
    }
    const shared=[...groups.values()].filter(group=>group.left.length&&group.right.length);
    stats[kind]={groups:shared.length,leftMatched:shared.reduce((n,g)=>n+g.left.length,0),rightMatched:shared.reduce((n,g)=>n+g.right.length,0),leftTotal:left[kind].length,rightTotal:right[kind].length};
    matches.push(...shared.map(group=>({kind,left:group.left.map(publicItem),right:group.right.map(publicItem)})));
    for(const a of left[kind])for(const b of right[kind]){
      if(key(a)===key(b)&&a.verified&&b.verified&&(!a.context||a.context.verified&&b.context?.verified))continue;
      if(Boolean(a.context)!==Boolean(b.context))continue;
      if(a.context && a.context.key!==b.context.key && !(Math.min(a.context.text.length,b.context.text.length)>=120&&similarity(a.context.text,b.context.text)>=.95))continue;
      const score=similarity(a.text,b.text);
      if(score<.9 || Math.min(a.text.length,b.text.length)<40 && a.text!==b.text)continue;
      const numbers=value=>(value.match(/-?\d+(?:\.\d+)?/g)||[]).join('|');
      possible.push({kind,score:Math.round(score*100),reason:!a.verified||!b.verified||a.context&&!a.context.verified||b.context&&!b.context.verified ? 'An image could not be verified.' : numbers(a.text)!==numbers(b.text) ? 'Numbers or values differ.' : a.text===b.text ? 'Images, interactions, or passage context differ.' : 'Wording or choices differ.',left:[publicItem(a)],right:[publicItem(b)]});
    }
  }
  possible.sort((a,b)=>b.score-a.score);
  const warnings=[...left.warnings,...right.warnings];
  if([...(state.passageErrors||[]),...(state.mathErrors||[]),...(state.testErrors||[])].length)warnings.push('Some content files could not be read. Counts may be incomplete; check the editor’s content errors.');
  return {left:{id:leftId,title:tests[0].title},right:{id:rightId,title:tests[1].title},stats,matches,possible:possible.slice(0,200),possibleTotal:possible.length,warnings:[...new Set(warnings)],comparedAt:new Date().toISOString()};
}
