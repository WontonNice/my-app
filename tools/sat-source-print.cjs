/* Recover editable text from a SAT source print archive. Layout JSON comes from
 * pdfplumber; all coordinates, fonts, colors and original PDF stay archived.
 * Passage boundaries and non-radio controls require a reviewed manifest.
 */
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function cleaned(chars) {
  const seen=new Set();
  return chars.filter(c=>c.size>=3&&!/SegoeFluentIcons/.test(c.fontname)).filter(c=>{
    const key=[c.text,Math.round(c.x0*10),Math.round(c.top*10)].join('|');
    if(seen.has(key))return false;seen.add(key);return true;
  });
}
function lines(chars) {
  const groups=[];
  for(const c of cleaned(chars).sort((a,b)=>a.top-b.top||a.x0-b.x0)) {
    let line=groups.find(g=>Math.abs(g.top-c.top)<1.25);
    if(!line){line={top:c.top,chars:[]};groups.push(line)}line.chars.push(c);
  }
  return groups.sort((a,b)=>a.top-b.top).map(l=>({...l,chars:l.chars.sort((a,b)=>a.x0-b.x0)}));
}
function lineText(chars) {
  let result='',prior;
  for(const c of chars){if(prior&&c.x0-prior.x1>1.4&&!/\s$/.test(result)&&!/^\s/.test(c.text))result+=' ';result+=c.text;prior=c}
  return result;
}
function rich(chars, page, {poem=false}={}) {
  const groups=lines(chars), paragraphs=[];let previous,paragraph=[];
  for(const line of groups) {
    if(previous&&line.top-previous.top>23){paragraphs.push(paragraph.join(poem?'<br>':' '));paragraph=[]}
    const runs=[];let previousChar;
    for(const c of line.chars){
      const under=(page.lines||[]).some(l=>Math.abs(l.top-c.bottom)<3&&l.x0<=c.x0+1&&l.x1>=c.x1-1&&Math.abs(l.top-l.bottom)<1);
      const style=[/Bold/.test(c.fontname),/Italic/.test(c.fontname),under];
      let value=(previousChar&&c.x0-previousChar.x1>1.4&&!/\s$/.test(previousChar.text)&&!/^\s/.test(c.text)?' ':'')+c.text;
      const last=runs.at(-1);if(last&&last.style.join()==style.join())last.text+=value;else runs.push({style,text:value});previousChar=c;
    }
    paragraph.push(runs.map(({style,text})=>{let s=escape(text);if(style[0])s=`<strong>${s}</strong>`;if(style[1])s=`<em>${s}</em>`;if(style[2])s=`<u>${s}</u>`;return s}).join(''));
    previous=line;
  }
  if(paragraph.length)paragraphs.push(paragraph.join(poem?'<br>':' '));
  return paragraphs.map(p=>`<p>${p}</p>`).join('');
}
function plain(chars){return lines(chars).map(l=>lineText(l.chars)).join('\n')}
function annotateGlossary(html,entries=[]) {
  for(const {term,definition} of entries){
    const pattern=new RegExp(`(^|[^A-Za-z])(${escape(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})(?=[^A-Za-z]|$)`);let found=false;
    html=html.split(/(<[^>]*>)/g).map(part=>{
      if(found||part.startsWith('<')||!pattern.test(part))return part;
      found=true;return part.replace(pattern,(_,prefix,word)=>`${prefix}<span data-glossary-definition="${escape(definition)}" role="link" tabindex="0">${word}</span>`);
    }).join('');
    if(!found)throw Error(`Source glossary term missing from passage: ${term}`);
  }
  return html;
}
function passageBody(pages,start,end,{format='prose',numbered=false}={}) {
  const blocks=[];let block=[],previous;
  for(let n=start.page;n<=end.page;n++) {
    const page=pages[n-1];
    const cs=page.chars.filter(c=>c.top>=(n===start.page?start.top:0)&&c.top<(n===end.page?end.top:792));
    for(const line of lines(cs)) {
      let chars=line.chars, paragraphStart=false;
      // Strip only manifest-confirmed margin labels; keep (1) sentence labels.
      if(format==='poem') chars=chars.filter(c=>c.x0>=68);
      else if(numbered&&/^\d+\s/.test(lineText(chars))&&chars[0]?.x0<46) {
        let count=0;while(count<chars.length&&/^[\d\s]+$/.test(chars[count].text))count++;
        chars=chars.slice(count);paragraphStart=true;
      }
      if(!chars.length)continue;
      const gap=previous?.page===n&&line.top-previous.top>23;
      if(block.length&&(paragraphStart||gap)){blocks.push(block);block=[];}
      block.push({text:lineText(chars),html:rich(chars,page).replace(/^<p>|<\/p>$/g,'')});
      previous={page:n,top:line.top};
    }
  }
  if(block.length)blocks.push(block);
  const join=(b,key)=>b.map((line,i)=>(i?(format==='poem'?(key==='html'?'<br>':'\n'):/[-‐‑]$/.test(b[i-1].text)?'':' '):'')+line[key]).join('');
  const tag=format==='poem'?'div':'p';
  return {html:blocks.map(b=>`<${tag}>${join(b,'html')}</${tag}>`).join(''),text:blocks.map(b=>join(b,'text')).join('\n\n')};
}
function extract(pages,manifest){
  const starts=new Map();for(const p of pages)for(const l of p.labels)starts.set(l.number,{page:p.page,top:l.box[1],bottom:l.box[3]});
  const passages=manifest.passages.map((p,i)=>{
    const end=starts.get(p.first),body=passageBody(pages,p.bodyStart||p.start,end,p);
    body.html=annotateGlossary(body.html,p.glossary);
    if(p.image)body.html+=`<p data-numbered="false"><img src="${escape(p.image.src)}" alt="${escape(p.image.alt)}"></p>`;
    return {...p,id:p.id||`print-passage-${i+1}`,...body,media:p.image?[{url:p.image.src,alt:p.image.alt}]:[],sourcePrint:{firstPage:p.start.page,lastPage:end.page}};
  });
  const questions=[];
  for(let number=1;number<=50;number++){
    const start=starts.get(number);if(!start)throw Error(`Missing source question ${number}`);
    const page=pages[start.page-1],next=starts.get(number+1),passage=passages.find(p=>number>=p.first&&number<=p.last);
    const laterPassage=passages.find(p=>p.start.page===start.page&&p.start.top>start.bottom);
    const bottom=Math.min(next?.page===start.page?next.top:792,laterPassage?.start.top??792);
    const cs=cleaned(page.chars.filter(c=>c.top>=start.bottom&&c.top<bottom));
    const byMcid=new Map();for(const c of cs){const list=byMcid.get(c.mcid)||[];list.push(c);byMcid.set(c.mcid,list)}
    const explanationLabel=[...byMcid.values()].find(a=>a[0].fontname.includes('ArialMT')&&plain(a)==='Explanation:');
    if(!explanationLabel)throw Error(`Missing explanation boundary ${number}`);
    const explanationTop=Math.min(...explanationLabel.map(c=>c.top));
    const labels=[...byMcid].filter(([id,a])=>id!==null&&a[0].fontname.includes('ArialMT')&&/^[A-F]$/.test(plain(a))&&a.every(c=>c.top<explanationTop)).sort((a,b)=>a[1][0].top-b[1][0].top);
    const choiceInfo=labels.map(([id,a],i)=>{
      const limit=labels[i+1]?.[0]??Infinity;
      const core=cs.filter(c=>c.mcid!==null&&c.mcid>=id+2&&c.mcid<limit&&c.top<explanationTop);
      if(!core.length)throw Error(`Missing option ${number}/${plain(a)}`);
      const top=Math.min(...core.map(c=>c.top)),bottom=Math.max(...core.map(c=>c.bottom)),left=Math.min(...core.map(c=>c.x0));
      const glyphs=cs.filter(c=>c.top>=top-1&&c.bottom<=bottom+1&&c.x0>=left-1&&c.top<explanationTop);
      return {label:plain(a),text:plain(glyphs).replace(/\s+/g,' ').trim(),html:rich(glyphs,page),isCorrect:glyphs.some(c=>c.non_stroking_color?.[1]>.4&&c.non_stroking_color?.[0]<.1),media:[],top};
    });
    const special=manifest.interactions[number];
    const promptEnd=special?.promptEnd??Math.min(...choiceInfo.map(c=>c.top));
    const promptChars=cs.filter(c=>c.top<promptEnd);
    const explanationChars=cs.filter(c=>c.top>explanationTop+11);
    const correct=choiceInfo.filter(c=>c.isCorrect);
    const q={number,total:50,sourceNumber:number,prompt:plain(promptChars).replace(/\s+/g,' ').trim(),promptHtml:rich(promptChars,page),choices:choiceInfo.map(({top,...c})=>c),passage:passage?{id:passage.id,text:passage.text,html:passage.html,format:passage.format||'prose',section:passage.section||'reading',media:passage.media,sourcePrint:passage.sourcePrint}:null,correctAnswer:correct.length?{label:correct.map(c=>c.label).join(', '),text:correct.map(c=>c.text).join(' | ')}:special?.correctAnswer||null,explanation:plain(explanationChars),explanationHtml:rich(explanationChars,page),explanationStatus:'captured',media:[],sourcePrint:{page:start.page,box:[81,start.top,531,bottom],method:'font-and-position-extraction',keyEvidence:correct.length?'source-selected-color-and-explanation':'reviewed-source-print-interaction'},...(correct.length>1?{responseType:'multi_select',requiredSelections:correct.length}:{}),...(special?{interaction:special.interaction,...(special.reviewNotes?{reviewNotes:special.reviewNotes}:{})}:{})};
    if(q.passage)for(const key of ['title','author','byline','blurb','reviewNotes'])q.passage[key]=passage[key];
    if(!q.prompt||!q.explanation)throw Error(`Incomplete text in ${number}`);
    if(q.choices.length){const match=q.explanation.match(/Correct Answers?:\s*([A-F](?:,\s*[A-F])*)/i);if(!match||match[1].replace(/\s/g,'')!==q.correctAnswer?.label.replace(/\s/g,''))throw Error(`Print answer disagreement ${number}`)}
    questions.push(q);
  }
  return {readerVersion:'print-archive-1',schemaVersion:3,capturedAt:manifest.capturedAt,source:manifest.source,signedInLikely:true,tests:[],tables:[],links:[],testPreview:{testTitle:manifest.source.label,module:'English Language Arts',questions,question:questions[0],capture:{mode:'ela-all',complete:true,expectedNumbers:Array.from({length:50},(_,i)=>i+1),missingNumbers:[],warnings:manifest.warnings||[]}}};
}
module.exports={extract,rich,plain,lines,passageBody,annotateGlossary};
if(require.main===module){const fs=require('node:fs');const [layout,manifest,out]=process.argv.slice(2);if(!out)throw Error('Usage: node sat-source-print.cjs layout.json reviewed-manifest.json reader.json');fs.writeFileSync(out,JSON.stringify(extract(JSON.parse(fs.readFileSync(layout)),JSON.parse(fs.readFileSync(manifest))),null,2));}
