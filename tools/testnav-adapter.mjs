import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';
const letter=i=>String.fromCharCode(65+i);
const escape=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function responseSchema(item) {
 const match=String(item.itemBodyExtraScript||'').match(/var responseSchema=(\[[\s\S]*?\]);/);
 if(!match)throw new Error(`Missing response schema: ${item.item_id}`);
 return JSON.parse(match[1]); // Parse JSON data only; never execute vendor scripts.
}
export function mathMLToLatex(html) {
 const $=load(html.replace(/&(?:amp;)?nbsp;/g,' ').replace(/\u00a0/g,' '),{xmlMode:true});
 const rec=node=>{
  if(node.type==='text')return node.data.replace(/\$/g,'\\$').replace(/%/g,'\\%').replace(/±/g,'\\pm ');
  const children=(node.children||[]).filter(n=>n.type==='tag'||n.type==='text'),parts=children.map(rec),inside=parts.join('');
  const a=node.attribs||{},name=node.name?.toLowerCase();
  if(name==='mphantom')return '';
  if(name==='math'&&$(node).find('mspace[linebreak="newline"]').length)return `\\begin{array}{l}${inside}\\end{array}`;
  if(name==='mfrac')return `\\frac{${parts[0]||''}}{${parts[1]||''}}`;
  if(name==='msup')return `{${parts[0]||''}}^{${parts[1]||''}}`;
  if(name==='msub')return `{${parts[0]||''}}_{${parts[1]||''}}`;
  if(name==='msubsup')return `{${parts[0]||''}}_{${parts[1]||''}}^{${parts[2]||''}}`;
  if(name==='msqrt')return `\\sqrt{${inside}}`;
  if(name==='mroot')return `\\sqrt[${parts[1]||''}]{${parts[0]||''}}`;
  if(name==='mfenced')return `\\left${a.open==='{'?'\\{':a.open||'('}${parts.join(a.separators??',')}\\right${a.close==='}'?'\\}':a.close||')'}`;
  if(name==='mtext')return inside.trim()?`\\text{${inside.replace(/[{}]/g,'')}}`: '\\ ';
  if(name==='mspace')return a.linebreak==='newline'?'\\\\':'\\ ';
  if(name==='mtable')return `\\begin{matrix}${parts.join('\\\\')}\\end{matrix}`;
  if(name==='mtr')return parts.join('&');
  if(name==='mover')return parts[1]==='¯'?`\\overline{${parts[0]}}`:`\\overset{${parts[1]}}{${parts[0]}}`;
  if(name==='munder')return `\\underset{${parts[1]}}{${parts[0]}}`;
  if(name==='mo')return ({'×':'\\times ','÷':'\\div ','−':'-','≤':'\\le ','≥':'\\ge ','≠':'\\ne ','·':'\\cdot ','π':'\\pi ','∞':'\\infty ','∥':'\\parallel ','°':'^{\\circ}'}[inside]||inside);
  if(name==='mi'&&inside==='π')return '\\pi ';
  if(name==='annotation'||name==='annotation-xml')return '';
  return inside;
 };
 return $('math').map((_,el)=>rec(el)).get().join(' ');
}
export function cleanHtml(html, assets=new Map()) {
 const $=load(html||'',null,false);
 hydrateGlossary($);
 $('.exhibits-list,.keyword-translation-list,.abbi-glossary,.visuallyhidden,script,style').remove();
 $('math').each((_,el)=>{const latex=mathMLToLatex($.html(el));$(el).replaceWith(latex.trim()?escape(`\\(${latex}\\)`):'')});
 $('.boxText').each((_,el)=>{$(el).replaceWith(`<blockquote data-boxed="true">${$(el).html()}</blockquote>`)});
 $('.badge').each((_,el)=>{$(el).parent('p').attr('data-numbered','true');$(el).remove()});
 $('.poem_body,[class^="count_"]').each((_,el)=>{$(el).attr('data-poetry-line','true')});
 $('.passage-title').each((_,el)=>{$(el).replaceWith(`<h3 data-align="center">${$(el).html()}</h3>`)});
 $('.underline').each((_,el)=>{$(el).wrapInner('<u></u>')});
 $('.center').attr('data-align','center');$('.left').attr('data-align','left');$('.indent-1').attr('data-align','indent');
 $('.small-caps').attr('data-small-caps','true');
 $('.nobreak').attr('data-no-break','true');
 $('.abbi-richtext,.abbi-image,.abbi-table,.abbi-inline-gap-text-wrapper').each((_,el)=>$(el).replaceWith($(el).html()||''));
 $('img').each((_,el)=>{const src=$(el).attr('src');if(assets.has(src))$(el).attr('src',assets.get(src).destination);});
 $('[style]').each((_,el)=>{const s=$(el).attr('style')||'';const align=s.match(/text-align\s*:\s*(left|right|center|justify)/)?.[1];if(align)$(el).attr('data-align',align);});
 $('*').each((_,el)=>{
  for(const k of Object.keys(el.attribs||{}))if(!['src','alt','width','height','colspan','rowspan','scope','data-align','data-numbered','data-poetry-line','data-small-caps','data-no-break','data-dropdown-width','data-boxed','data-choice-id','data-glossary-definition','role','tabindex'].includes(k))$(el).removeAttr(k);
 });
 return $.root().html().trim();
}
function hydrateGlossary($) {
 $('.glossary-term[data-content]').each((_,el)=>{
  const target=$(el).attr('data-content'),definition=$(`[id="${target}"] [data-lang="en"]`).first().text().trim();
  if(definition)$(el).attr('data-glossary-definition',definition).attr('role','link').attr('tabindex','0');
 });
}
export function plain(html) {
 const $=load(html||'',null,false);$('br').replaceWith('\n');$('p,div,blockquote,h2,h3,tr,li').append('\n');$('td,th').append(' ');
 return $.root().text().replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function passagePresentation(html, assets=new Map()) {
 const $=load(html||'',null,false);hydrateGlossary($);
 const title=$('.passage-title').first(),byline=$('.author').first();
 // Source order, rather than italics or paragraph wording, identifies a blurb.
 // Keep nested wrappers and all blocks before the first passage title together.
 const takeBeforeTitle=parent=>{
  const parts=[];
  for(const node of parent.contents().toArray()) {
   if(node===title[0])break;
   const child=$(node);
   if(child.find('.passage-title').toArray().includes(title[0])) {
    const prefix=takeBeforeTitle(child);
    if(prefix)parts.push($.html(child.clone().empty().append(prefix)));
    break;
   }
   parts.push($.html(node));child.remove();
  }
  return parts.join('');
 };
 const blurbHtml=title.length?cleanHtml(takeBeforeTitle($.root()),assets):'';
 const result={title:title.text().trim(),titleHtml:cleanHtml(title.html(),assets),
  byline:byline.text().trim(),bylineHtml:cleanHtml(byline.html(),assets),
  blurb:plain(blurbHtml),blurbHtml,
  poem:$('.poem_body,[class^="count_"]').length>0,
  sourceNote:$('.copyright-tm').text().trim()};
 title.remove();byline.remove();$('.copyright-tm').remove();
 result.richText=cleanHtml($.root().html(),assets);
 result.text=plain(result.richText);
 return result;
}
function optionsJson(script) {
 const m=script.match(/var interaction_RESPONSE_options = (\{[^\n]*?\});/);
 if(!m)throw new Error('Missing custom-interaction configuration');
 return JSON.parse(m[1]);
}
function normalizedItems($,selector,assets) {
 return $(selector).map((i,el)=>({id:`item-${i+1}`,sourceId:$(el).attr('data-identifier'),text:plain(cleanHtml($(el).html(),assets)),html:cleanHtml($(el).html(),assets)})).get();
}
export function convertItem(data, item, context) {
 const {assets,source,key={}}=context,$=load(data.itemBodyHtml,null,false),schema=responseSchema(data);
 hydrateGlossary($);
 $('.exhibits-list,.abbi-glossary,.keyword-translation-list').remove();$('.visuallyhidden').not('[data-identifier]').remove();
 const content=$('.row').first();
 const stimulus=$('.stimulus .passageContent').first();
 let promptPanel=content.children().last().clone();
 const selection=$('[data-module="CustomInteraction-texthighlighter"]').first().clone();
 const prompt=promptPanel.clone();
 prompt.find('[data-module],.int-gapmatch,.abbi-equationeditor,.abbi-hotspot,[id="interaction_RESPONSE"],.gapmatch-content,.sourcechoices,.targetchoices').remove();
 const promptHtml=cleanHtml(prompt.html(),assets);
 const answerAsset=assets.get(item.exhibit);
 const q={id:`official-shsat-2026-${source.form.toLowerCase()}-${item.number}`,sourceQuestion:String(item.number),points:1,topic:'',
  prompt:plain(promptHtml),promptHtml,explanation:'',explanationHtml:answerAsset?`<img src="${escape(answerAsset.destination)}" alt="Official explanation for question ${item.number}">`:'',
  source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',year:2026,form:source.form,itemId:item.itemId,originalItemId:item.id,
   questionNumber:item.number,section:item.section,sourceUrl:item.url,sourceSha256:item.sha256,answerSourceUrl:item.exhibit,interactionSchema:schema},
  review:{sourceQuestion:String(item.number),sourceFile:source.sourceUrl,answerSource:{sourceFile:item.exhibit,sourcePages:[]},explanationSource:{sourceFile:item.exhibit,sourcePages:[]},
   expectedChoiceCount:null,warnings:[],classificationReviewed:false,completenessReviewed:true,sourceReviewed:false}};
 const type=schema[0]?.interactionType;
 if(type==='CHOICEINTERACTION') {
  const list=$('.int-choice-list').first(),entries=list.children('li').length?list.children('li'):list.children('[data-identifier]');
  q.choices=entries.map((i,el)=>{const desc=$(el).find('.int-choice-desc'),h=cleanHtml(desc.length?desc.html():$(el).html(),assets);return{id:letter(i),text:plain(h),html:h}}).get();
  q.type=schema[0].cardinality==='multiple'?'multi_select':'multiple_choice';
  if(q.type==='multiple_choice')q.correctChoiceId=key.correctChoiceId||'';
  else {q.correctChoiceIds=key.correctChoiceIds||[];const max=Number(list.attr('data-maxchoices'));if(max>0)q.requiredSelections=max;}
  q.review.expectedChoiceCount=q.choices.length;
 } else if(type==='HOTTEXTINTERACTION') {
  selection.find('.badge').each((_,el)=>$(el).replaceWith(`<strong>${escape($(el).text())}</strong> `));
  const elements=selection.find('[data-identifier]');
  q.choices=elements.map((i,el)=>{const h=cleanHtml($(el).html(),assets);$(el).attr('data-choice-id',letter(i));return{id:letter(i),text:plain(h),html:h}}).get();
  q.type=schema[0].cardinality==='multiple'?'multi_select':'multiple_choice';q.selectionHtml=cleanHtml(selection.html(),assets);
  if(q.type==='multiple_choice')q.correctChoiceId=key.correctChoiceId||'';else q.correctChoiceIds=key.correctChoiceIds||[];
  q.review.expectedChoiceCount=q.choices.length;
 } else if(type==='TEXTENTRYINTERACTION'||schema[0]?.subType==='tei-ee') {
  q.type=schema[0].subType==='tei-ee'?'expression_entry':'short_response';q.correctTextAnswers=key.correctTextAnswers||[];
  if(q.type==='expression_entry'){const config=optionsJson(data.itemBodyExtraScript),math=config.models?.[0]?.math||'';const variable=math.match(/<mi>([a-zA-Z])<\/mi><mo>=<\/mo>/)?.[1];q.entryLayout=variable?'x_equals':math.includes('<mfrac>')?'fraction':'plain';if(variable)q.entryVariable=variable;}
 } else if(type==='INLINECHOICEINTERACTION') {
  q.type='inline_dropdown';q.dropdowns=[];
  const working=promptPanel.clone();
  working.find('select').each((i,el)=>{const options=$(el).find('option').filter((_,o)=>$(o).attr('value')!=='').map((j,o)=>({id:letter(j),text:plain(cleanHtml($(o).html(),assets))})).get();
   const id=`dropdown-${i+1}`;q.dropdowns.push({id,options,correctChoiceId:key.dropdowns?.[i]||''});
   const width=[['input-mini',60],['input-small',90],['input-medium',150],['input-large',210],['input-xlarge',270]].find(([name])=>$(el).hasClass(name))?.[1];
   $(el).replaceWith(width?`<span data-dropdown-width="${width}">{{${id}}}</span>`:`{{${id}}}`);
  });
  q.dropdownContentHtml=cleanHtml(working.html(),assets);q.dropdownContent=[plain(q.dropdownContentHtml)];
  q.prompt='';q.promptHtml='';
 } else if(type==='GAPMATCHINTERACTION') {
  q.type='math_drag_drop';q.items=normalizedItems($,'.sourcechoices > li,.gap-choiceList > li',assets).map(({sourceId,...rest})=>rest);
  const target=$('.gapmatch-content').clone();q.dragDropSlots=[];
  target.find('.gap').each((i,el)=>{const id=`slot-${i+1}`;q.dragDropSlots.push({id,correctItemId:key.slots?.[i]||''});$(el).replaceWith(`{{${id}}}`)});
  q.dragDropContentHtml=cleanHtml(target.html(),assets);q.dragDropContent=[plain(q.dragDropContentHtml)];q.allowReuse=$('.sourcechoices > li,.gap-choiceList > li').toArray().some(el=>Number($(el).attr('data-maxlimit'))!==1);q.dragDropStyle='outlined';
 } else if(type==='GRAPHICGAPMATCHINTERACTION') {
  if(item.id!=='SHB25-010'||$('.sourcechoices > li').length!==5||$('.gap-hotspot').length!==2)throw new Error(`Unreviewed graphic-gap layout: ${item.id}`);
  q.type='math_drag_drop';q.items=normalizedItems($,'.sourcechoices > li',assets).map(({sourceId,...rest},i)=>({...rest,text:['1','17','-5','-8','11'][i]}));
  // This source form has one graphic expression: |[blank]| - |[blank]|.
  // Preserve the original background and coordinates in provenance as well.
  q.dragDropContent=['\\(\\left|\\right.\\){{slot-1}}\\(\\left.\\right| - \\left|\\right.\\){{slot-2}}\\(\\left.\\right|\\)'];
  q.dragDropContentHtml='<p>\\(|\\){{slot-1}}\\(| - |\\){{slot-2}}\\(|\\)</p>';
  q.dragDropSlots=$('.gap-hotspot').map((i)=>({id:`slot-${i+1}`,correctItemId:key.slots?.[i]||''})).get();q.allowReuse=false;q.dragDropStyle='outlined';
  q.source.graphicDropHtml=cleanHtml($('#interaction_targetchoices_RESPONSE').html(),assets);
  const background=$('#interaction_targetchoices_RESPONSE > img').first();
  q.source.graphicDropLayout={imageUrl:background.attr('src'),width:Number(background.attr('width')),height:Number(background.attr('height')),
   slots:$('.gap-hotspot').map((i,el)=>{const style=$(el).attr('style')||'';return{id:`slot-${i+1}`,sourceId:$(el).attr('data-identifier'),
    ...Object.fromEntries(['left','top','width','height'].map(k=>[k,Number(style.match(new RegExp(`${k}:\\s*([\\d.]+)px`))?.[1])]))}}).get()};
 } else if(type==='MATCHINTERACTION') {
  const grid=$('[data-module="MatchInteraction-tablegrid"]');
  q.type=grid.length?'matrix_choice':'category_sort';q.items=normalizedItems($,grid.length?'.row-header-cell':'.sourcechoices > li',assets).map(({sourceId,...rest})=>rest);
  q.categories=$(grid.length?'.column-header-cell':'.targetchoices > li').map((i,el)=>({id:`category-${i+1}`,title:plain(cleanHtml($(el).html(),assets))})).get();
  q.correctPlacements=Object.fromEntries((key.placements||[]).map((v,i)=>v?[`item-${i+1}`,`category-${v}`]:null).filter(Boolean));
  q.requiredPlacements=Number($('.sourcechoices').attr('data-minassociations'))||q.items.length;
 } else if(type==='HOTSPOTINTERACTION') {
  q.type='graph_point_select';const holder=$('.int-hotspot-holder'),style=holder.attr('style')||'',url=style.match(/url\(['"]?([^)'"\s]+)/)?.[1],asset=assets.get(url);
  const width=Number(style.match(/width:\s*([\d.]+)px/)?.[1]),height=Number(style.match(/height:\s*([\d.]+)px/)?.[1]);
  const pts=holder.find('[data-coords]').map((i,el)=>{const [x,y]=($(el).attr('data-coords')||'').split(',').map(Number);return{id:`point-${i+1}`,x:key.graphCoordinates?.[i]?.[0]??i,y:key.graphCoordinates?.[i]?.[1]??0,sourceX:x,sourceY:y}}).get();
  q.graph={xMin:0,xMax:Math.max(1,...pts.map(p=>p.x)),xStep:1,yMin:0,yMax:Math.max(1,...pts.map(p=>p.y)),yStep:1,points:pts,sourceImage:{src:asset?.destination||url,alt:holder.attr('aria-label')||'',width,height}};
  q.correctPointIds=(key.points||[]).map(i=>`point-${i}`);q.requiredSelections=key.points?.length||1;
 } else if(schema[0]?.subType==='tei-numberline') {
  q.type='number_line_response';const config=optionsJson(data.itemBodyExtraScript);
  q.numberLineResponse={min:config.startPoint,max:config.startPoint+config.largeHashMarkIntervals,tickStep:config.increment,labelStep:config.largeHashMarkIntervals/2,correctValue:key.value??null,correctEndpoint:key.endpoint||'closed',correctDirection:key.direction||'right'};
 } else throw new Error(`Unsupported source interaction ${type}/${schema[0]?.subType} at ${source.form} ${item.number}`);
 if(!stimulus.length&&!selection.length&&content.children().length>1) {const left=content.children().first();q.stimulusHtml=cleanHtml(left.html(),assets);q.stimulus=plain(q.stimulusHtml);}
 if(key.evidence)q.source.keyEvidence=key.evidence;
 if(!Object.keys(key).length)q.review.warnings.push({code:'ANSWER_KEY_MISSING',message:'Official exhibit captured; key awaits verification.',state:'unresolved'});
 return q;
}
export async function convertPackage(folder) {
 const inv=JSON.parse(await fs.readFile(path.join(folder,'inventory.json'),'utf8'));
 let keys={};try{keys=JSON.parse(await fs.readFile(path.join(folder,'verified-keys.json'),'utf8'))}catch{}
 const usable=[],omittedAssets=[];
 for(const a of inv.assets) {
  if(!/\.(png|svg|jpe?g)$/i.test(a.file)) {
   const bytes=await fs.readFile(path.join(folder,a.file));
   if(bytes.toString('utf8').trim()||inv.items.some(i=>i.exhibit===a.url))throw new Error(`Unrecognized required source asset: ${a.url}`);
   omittedAssets.push({...a,reason:'Empty auxiliary exhibit placeholder; primary official explanation image retained.'});continue;
  }
  usable.push(a);
 }
 const assets=new Map(usable.map(a=>[a.url,{...a,localPath:path.join(folder,a.file),destination:`/exam-images/official-shsat-2026-${inv.form.toLowerCase()}-${a.sha256.slice(0,20)}${path.extname(a.file)}`}]));
 const source={...inv,expectedQuestionCount:100,items:undefined,sections:undefined,assets:[...assets.values()],omittedAssets};
 // The legacy mixed-envelope parser attaches root review to its Math entry.
 const result={format:'nathan-tutors-official-passage-v1',source,passages:[],mathQuestions:[],review:{expectedQuestionCount:50,warnings:[]}};
 const groups=[];
 for(const section of inv.sections) {
  const qs=section.items.filter(i=>i.question);if(!qs.length)continue;
  const questions=[];let passage;
  for(const entry of qs) {
   const item=inv.items.find(i=>i.itemId===entry.itemId),data=JSON.parse(await fs.readFile(path.join(folder,item.file),'utf8'));
   const q=convertItem(data,item,{assets,source,key:keys[item.number]});questions.push(q);
   if(!passage&&section.title.includes('Passage Set')) {
    const $=load(data.itemBodyHtml,null,false);hydrateGlossary($);const stimulus=$('.stimulus .passageContent').first().clone();
    const {poem,...presentation}=passagePresentation(stimulus.html(),assets);
    const sectionName=entry.id.startsWith('EW')?'revising_editing_a':'reading';
    passage={...presentation,author:presentation.byline.replace(/^by\s+/i,''),preserveSourceLayout:true,format:poem?'poem':sectionName==='revising_editing_a'?'sentence_prose':'prose',passageType:poem?'poem':'long_reading',passageCategory:'official_handbook',section:sectionName,
     teacherSource:inv.sourceUrl,versionLabel:`SHSAT 2026 Practice Test ${inv.form}`,source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',year:2026,form:inv.form,section:section.title},questions:[],review:{expectedQuestionCount:qs.length,warnings:[]}};
   }
  }
  if(section.title==='Math')result.mathQuestions.push(...questions);
  else {passage??={title:section.title,text:'',richText:'',format:'prose',passageType:'informational',passageCategory:'official_handbook',section:'revising_editing_a',source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',year:2026,form:inv.form,section:section.title},review:{expectedQuestionCount:questions.length,warnings:[]}};passage.questions=questions;result.passages.push(passage);}
  groups.push({title:section.title,questions:questions.map(q=>q.id)});
 }
 result.source.sectionOrder=groups;
 const all=[...result.passages.flatMap(p=>p.questions),...result.mathQuestions];
 if(all.length!==100||new Set(all.map(q=>q.sourceQuestion)).size!==100)throw new Error('Capture must contain exactly 100 distinct ordered questions');
 await fs.writeFile(path.join(folder,'import.json'),JSON.stringify(result,null,2));
 return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 for(const form of ['A','B','C','D']) {const result=await convertPackage(path.join(path.resolve(process.argv[2]),`testnav-${form}`));console.log(form,result.passages.length,result.passages.flatMap(p=>p.questions).length,result.mathQuestions.length);}
}
