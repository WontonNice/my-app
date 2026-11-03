import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {cleanHtml,plain,convertItem} from '../../tools/testnav-adapter.mjs';
import {normalizeCoordinateResponse} from '../../tools/coordinate-response.mjs';
const root=new URL('./',import.meta.url), api='http://127.0.0.1:4319';
const sources=Object.fromEntries(JSON.parse(await fs.readFile(new URL('source-items-unique.json',root),'utf8')).map(x=>[x.source,x]));
const downloads=JSON.parse((await fs.readFile(new URL('downloads.json',root),'utf8')).replace(/^\uFEFF/,''));
const state=await fetch(api+'/api/state').then(r=>r.json());
async function post(route,body) {const r=await fetch(api+route,{method:'POST',headers:{'content-type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify(body)});const v=await r.json();if(!r.ok)throw new Error(JSON.stringify(v));return v;}
const assets=new Map();
let uploaded;try{uploaded=JSON.parse(await fs.readFile(new URL('uploaded-assets.json',root),'utf8'));}catch{uploaded={};}
async function upload(key,name,bytes) {
 if(uploaded[key])return uploaded[key];
 const mimeType=name.endsWith('.png')?'image/png':'image/svg+xml';
 const result=await post('/api/images',{passageId:'grade9-mini-'+key.replace(/[^a-z0-9]/gi,'-').toLowerCase(),fileName:name,mimeType,dataUrl:`data:${mimeType};base64,${bytes.toString('base64')}`});
 uploaded[key]=result.image.src;await fs.writeFile(new URL('uploaded-assets.json',root),JSON.stringify(uploaded,null,2));return result.image.src;
}
for(const a of downloads)assets.set(a.url,{destination:await upload(a.name,a.name,await fs.readFile(a.path))});
const gridConfigs={
 'adam-2':{width:774.8,height:503,plot:{left:285.8,top:20,width:446,height:446},xMin:-10,xMax:10,yMin:-10,yMax:10,xStep:1,yStep:1,xSnap:1,ySnap:1,tools:[],shapes:[
  {id:'orientation-1',bankX:30,bankY:30,vertices:[{x:0,y:-5,label:"A'"},{x:0,y:0,label:"B'"},{x:3,y:0,label:"C'"}]},
  {id:'orientation-2',bankX:223.8,bankY:141.5,vertices:[{x:0,y:5,label:"A'"},{x:0,y:0,label:"B'"},{x:-3,y:0,label:"C'"}]},
  {id:'orientation-3',bankX:96.9,bankY:201.5,vertices:[{x:0,y:-5,label:"A'"},{x:0,y:0,label:"B'"},{x:-3,y:0,label:"C'"}]},
  {id:'orientation-4',bankX:156.9,bankY:313,vertices:[{x:0,y:5,label:"A'"},{x:0,y:0,label:"B'"},{x:3,y:0,label:"C'"}]}
 ],correctShapeId:'orientation-1',correctAnchor:{x:-7,y:-4}},
 'adam-11':{width:450,height:450,plot:{left:53,top:53,width:344,height:344},xMin:-7,xMax:7,yMin:-7,yMax:7,xStep:1,yStep:1,xSnap:1,ySnap:1,tools:[
  {id:'line-1',kind:'line',label:'Line 1',color:'#0000ff',correctPoints:[{x:0,y:5},{x:1,y:3}]},
  {id:'line-2',kind:'line',label:'Line 2',color:'#962d73',correctPoints:[{x:-1,y:-2},{x:2,y:1}]},
  {id:'solution',kind:'point',label:'Solution',color:'#465a5a',correctPoints:[{x:2,y:1}]}
 ]},
 'nyc-12':{width:467,height:467,plot:{left:77,top:53,width:344,height:344},title:'Taxi Ride Cost',xMin:0,xMax:6,yMin:0,yMax:12,xStep:.5,yStep:1,xSnap:.25,ySnap:.5,tools:[{id:'line',kind:'line',label:'Line',color:'#0000ff',correctPoints:[{x:0,y:4.5},{x:1,y:8}]}]}
};
for(const [id,c] of Object.entries(gridConfigs)) {
 const $=load(sources[id].html),svg=$('svg').first();
 if(id==='adam-2')svg.children().slice(128).remove();
 else svg.find('[data-automation^="pathGraph"],[data-automation^="polygonGraph"],rect[opacity="0"]').remove();
 svg.attr({xmlns:'http://www.w3.org/2000/svg',width:c.width,height:c.height,viewBox:`0 0 ${c.width} ${c.height}`}).removeAttr('style').removeAttr('class');
 // No scripts, event handlers or remote references are retained in the static grid artwork.
 svg.find('script,foreignObject').remove();svg.find('*').each((i,e)=>{for(const a of Object.keys(e.attribs??{}))if(a.startsWith('on')||a.startsWith('data-')||['tabindex','class'].includes(a))$(e).removeAttr(a);});
 const bytes=Buffer.from($.html(svg));await fs.writeFile(new URL(`${id}-grid.svg`,root),bytes);
 c.background={src:await upload(`${id}-grid`,'grid.svgz',bytes),alt:id==='adam-2'?'Coordinate plane with triangle A at (−7, 7), B at (−7, 2), and C at (−4, 2).':'Coordinate plane for drawing the response.'};
 normalizeCoordinateResponse(c);
}
const exhibitNames={adam:['SHM89-238_exp_exhibit.png','SHB25-021-G9_exhibit.png','SHM91-501_exp_exhibit.png','SHM12-016_exp_exhibit.png','SHB25-015-G9_exhibit.png','SHM06-065_exp_exhibit.png','SHB25-022-G9_exhibit.png','SHM13-346_exp_exhibit.png','SHM09-010_exp_exhibit.png','SHM14-045_exp_exhibit.png','SHB25-007-G9_exhibit.png','SHM96-052_exp_exhibit.png','SHM05-095_exhibit.png'],nyc:['shb239008_exp_exh.png','SHB239005_exp_exh.png','SHB239007_exp_exh.png','M269264_exp_exh.png','SHB239004_exp_exh.png','M269262_exp_exh.png','SHB239015_exp_exh.png','SHB239011_exp_exh.png','SHB239012_exp_exh.png','SHB239003_exp_exh.png','SHB239009_exp_exh.png','M269265_exp_exh.png','SHB239001_exp_exh.png']};
const keys={adam:[{correctChoiceId:'C'},{},{correctChoiceId:'C'},{correctChoiceId:'D'},{dropdowns:['B','C','A']},{correctChoiceId:'D'},{correctChoiceIds:['B','E']},{correctChoiceId:'C'},{correctChoiceId:'D'},{correctChoiceId:'B'},{},{correctTextAnswers:['12']},{correctChoiceId:'B'}],nyc:[{correctChoiceId:'C'},{correctChoiceId:'C'},{correctChoiceId:'D'},{placements:[1,2,1]},{correctChoiceId:'D'},{slots:['function','not-function','function','not-function']},{correctChoiceId:'B'},{correctChoiceId:'A'},{correctChoiceId:'C'},{correctTextAnswers:['20']},{correctChoiceId:'A'},{},{correctTextAnswers:['11']}]};
const questions=[];
for(const host of ['adam','nyc'])for(let number=1;number<=13;number++) {
 const id=`${host}-${number}`, raw=sources[id],$=load(raw.html,null,false);
 $('.MathJax_CHTML,.MathJax_Preview,.MJX_Assistive_MathML').remove();
 $('script[type="math/mml"]').each((i,e)=>$(e).replaceWith($(e).html()));
 $('canvas,.int-error-message,.int-error-msg').remove();
 if(id==='adam-7') {const descriptions=$('.int-choice-desc').map((i,e)=>$(e).html()).get();$('.int-choice-list').html(descriptions.map(h=>`<li><div class="int-choice-desc">${h}</div></li>`).join(''));}
 const key=keys[host][number-1],exhibit=downloads.find(a=>a.name.toLowerCase()===exhibitNames[host][number-1].toLowerCase());if(!exhibit)throw new Error('Missing exhibit '+id);
 const custom=Boolean(gridConfigs[id])||id==='nyc-6';
 let q;
 if(custom) {
  $('.abbi-shapetransform,.abbi-compositegraph,.abbi-pointgraph,.abbi-graphicgapmatch,[data-module]').remove();
  // Keep only the source's rich text blocks; response controls are represented by their typed configuration.
  const blocks=$('.row').first().children().last().children('.abbi-richtext');
  const promptHtml=cleanHtml(blocks.map((i,e)=>$.html(e)).get().join(''),assets);
  q={type:gridConfigs[id]?'coordinate_response':'math_drag_drop',promptHtml,prompt:plain(promptHtml),...(gridConfigs[id]?{coordinateResponse:gridConfigs[id]}:{})};
 }else {
  const interactionType=$('.int-choice-list').length?'CHOICEINTERACTION':$('select').length?'INLINECHOICEINTERACTION':$('[data-module="MatchInteraction-tablegrid"]').length?'MATCHINTERACTION':'TEXTENTRYINTERACTION';
  q=convertItem({itemBodyHtml:$.root().html(),itemBodyExtraScript:`var responseSchema=${JSON.stringify([{identifier:'RESPONSE',interactionType,cardinality:id==='adam-7'?'multiple':'single'}])};`},{number,section:'Math',exhibit:exhibit.url},{assets,source:{form:host},key});
 }
 if(id==='adam-7'){q.hideChoiceLabels=true;q.requiredSelections=2;}
 if(id==='nyc-4'){q.tableHeaders={row:'Function',answer:''};q.matrixStyle='compact';}
 if(id==='nyc-9')q.promptHtml=q.promptHtml.replace('<table ','<table data-align="left" ');
 if(id==='nyc-6') {
  const a=downloads.find(a=>a.name==='M260262_1.svgz');
  Object.assign(q,{items:[{id:'function',text:'Function'},{id:'not-function',text:'Not a Function'}],allowReuse:true,dragDropStyle:'compact',dragDropContent:['{{slot-1}} {{slot-2}} {{slot-3}} {{slot-4}}'],dragDropSlots:[[61,235],[323,235],[61,528],[323,528]].map(([left,top],i)=>({id:`slot-${i+1}`,correctItemId:key.slots[i],left,top,width:100,height:28})),dragDropImage:{src:assets.get(a.url).destination,alt:'Four coordinate graphs arranged in two rows, each with an answer box below.',width:498,height:562}});
 }
 const label=host==='adam'?'SHSAT Grade 9 Sample Items — 2025':'SHSAT Grade 9 Sample Items';
 Object.assign(q,{id:`grade-9-mini-${id}`,points:1,topic:'Uncategorized',sourceQuestion:String(questions.length+1),source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',sourceId:`grade-9-mini-${host}`,label,section:'Math',sourceQuestion:String(number),moduleQuestion:id,url:`https://${host}.testnav.com/client/index.html`},explanation:'',explanationHtml:`<img src="${assets.get(exhibit.url).destination}" alt="Official answer and explanation for ${host} question ${number}">`,review:{sourceQuestion:String(number),sourceFile:label,answerSource:{sourceFile:exhibit.url,sourcePages:[]},explanationSource:{sourceFile:exhibit.url,sourcePages:[]},warnings:[],classificationReviewed:false,completenessReviewed:false,sourceReviewed:false}});
 questions.push(q);
}
const payload={format:'nathan-tutors-official-passage-v1',source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',sourceId:'grade-9-mini-form',label:'Grade 9 Mini Form'},mathQuestions:questions,review:{expectedQuestionCount:26,warnings:[],classificationReviewed:false,completenessReviewed:false,sourceReviewed:false}};
await fs.writeFile(new URL('import.json',root),JSON.stringify(payload,null,2));
await fs.writeFile(new URL('verified-source-keys.json',root),JSON.stringify({keys,exhibitNames,coordinateKeys:gridConfigs},null,2));
console.log(questions.map((q,i)=>({number:i+1,type:q.type,prompt:q.prompt.slice(0,100),choices:q.choices?.length})));
