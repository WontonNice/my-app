import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {isDeepStrictEqual} from 'node:util';
const base='http://127.0.0.1:4319',dir=new URL('./',import.meta.url);
const readState=()=>fetch(base+'/api/state').then(r=>r.json());
let state=await readState();const token=state.editToken;
async function post(route,body){const r=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':token},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(route+' '+JSON.stringify(d));return d;}
const test=state.tests.find(t=>t.assessmentId==='2025-2026-form-b');
let before;try{before=JSON.parse(await fs.readFile(new URL('standalone-b-before.json',dir),'utf8'));}catch{before={test,items:state.standaloneItems.filter(q=>test.standaloneItemIds.includes(q.id))};await fs.writeFile(new URL('standalone-b-before.json',dir),JSON.stringify(before,null,2));}
const restoreSpaces=value=>Array.isArray(value)?value.map(restoreSpaces):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,(k==='html'||k.endsWith('Html'))&&typeof v==='string'?v.replace(/&nbsp;|&#160;|&#x0*a0;|\u00a0/gi,' '):restoreSpaces(v)])):value;
for(const old of before.items){state=await readState();await post('/api/standalone-items',{item:restoreSpaces(old),originalId:old.id,sourceHash:state.standaloneSourceHash});}
const raw=JSON.parse(await fs.readFile(new URL('q54-testnav-source.json',dir),'utf8'));
const $=load(raw.html),p=$('#interaction_RESPONSE p.boxText');
const choices=[];
p.find('[role="checkbox"]').each((i,el)=>{const id=String.fromCharCode(65+i),text=$(el).text().replace(/\u00a0/g,' ');choices.push({id,text,html:text});$(el).replaceWith(`<span data-choice-id="${id}">${text}</span>`);});
p.find('span:not([data-choice-id])').each((_,el)=>$(el).replaceWith($(el).contents()));
if(choices.length!==4||choices[0].text!=='Institution, the')throw Error('Source mismatch');
const selectionHtml='<p data-boxed="true">'+p.html().replace(/&nbsp;|\u00a0/g,' ')+'</p>';
const explanationUrl='https://adam.pearsontestcontent.com/nycqc/8749727de9f7ba56e4acf3a74be56803bb149be5/3860/1/401645/1/EWSA25103_EXP_EXHIBIT.png';
const bytes=await fs.readFile(new URL('q54-explanation.png',dir));
const upload=await post('/api/images',{passageId:'2025-2026-form-b-q54-explanation',fileName:'q54-explanation.png',mimeType:'image/png',dataUrl:'data:image/png;base64,'+bytes.toString('base64')});
const question={id:'official-shsat-2025-b-54',sourceQuestion:'54',type:'multiple_choice',points:1,topic:'Sentence Structure',versionLabels:['2025-2026 Form B'],source:{sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',label:'2025-2026 Form B',year:'2025-2026',form:'B',section:'English',sourceQuestion:'54',url:'https://adam.testnav.com/client/index.html'},prompt:'Which part of the paragraph contains an error in sentence structure?',promptHtml:'Which part of the paragraph contains an error in sentence structure?',stimulus:'',selectionHtml,instructions:'Select the one error.',choices,correctChoiceId:'A',explanation:'',explanationHtml:`<p><img src="${upload.image.src}" alt="Official TestNav explanation for question 54"></p>`,notes:['Source paragraph preserved in selectionHtml for inline phrase selection. Answer A confirmed by the official TestNav exhibit.']};
const source={format:'nathan-tutors-part-b-v1',questions:[question]};
await fs.writeFile(new URL('q54-import.json',dir),JSON.stringify(source,null,2));
const imported=await post('/api/standalone-import',{source});
const draft=imported.drafts.find(d=>[...imported.added,...imported.existing].includes(d.id));
if(!draft)throw Error('No import draft returned: '+JSON.stringify(imported));
state=await readState();const pub=await post('/api/standalone-drafts/publish',{id:draft.id,version:draft.version,sourceHash:state.standaloneSourceHash});
state=await readState();const currentTest=state.tests.find(t=>t.assessmentId===test.assessmentId);
await post('/api/tests',{...currentTest,questionOrder:undefined,standaloneItemIds:[pub.id,...currentTest.standaloneItemIds.filter(id=>id!==pub.id)]});
state=await readState();const saved=state.tests.find(t=>t.assessmentId===test.assessmentId);
const count=saved.passageIds.reduce((n,id)=>n+state.passages.find(p=>p.id===id).questions.length,0)+saved.standaloneItemIds.length;
if(count!==57||!isDeepStrictEqual(saved.passageIds,test.passageIds))throw Error('Unexpected English count/order');
const changes=before.items.map(old=>{const now=state.standaloneItems.find(q=>q.id===old.id);return{id:old.id,fields:[...new Set([...Object.keys(old),...Object.keys(now)])].filter(k=>!isDeepStrictEqual(old[k],now[k]))};});
await fs.writeFile(new URL('standalone-b-receipt.json',dir),JSON.stringify({english:count,standaloneIds:saved.standaloneItemIds,changes,newQuestion:state.standaloneItems.find(q=>q.id===pub.id)},null,2));
console.log(JSON.stringify({english:count,standaloneIds:saved.standaloneItemIds,changes},null,2));
