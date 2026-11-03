import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {load} from 'cheerio';import {convertItem,plain} from '../../tools/testnav-adapter.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),read=async n=>JSON.parse(await fs.readFile(path.join(root,n),'utf8')),save=async(n,d)=>fs.writeFile(path.join(root,n),JSON.stringify(d,null,2));
const state=await fetch('http://127.0.0.1:4319/api/state').then(r=>r.json());let uploads={};try{uploads=await read('uploads.json')}catch{}
async function upload(file){if(uploads[file])return uploads[file];const bytes=await fs.readFile(path.join(root,file)),svg=/\.svgz?$/.test(file),mimeType=svg?'image/svg+xml':'image/png';const r=await fetch('http://127.0.0.1:4319/api/images',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({passageId:'restore-' + path.basename(file).replace(/[^a-zA-Z0-9-]/g,'-'),fileName:path.basename(file).replace(/\.svg$/,'.svgz'),mimeType,dataUrl:`data:${mimeType};base64,${bytes.toString('base64')}`})});const d=await r.json();if(!r.ok)throw Error(JSON.stringify(d));uploads[file]=d.image.src;await save('uploads.json',uploads);return uploads[file];}
const assets=new Map();for(const [url,a]of Object.entries(await read('source-assets.json')))assets.set(url,{destination:await upload(a.file)});
const guides=await read('guide-crops.json');for(const g of Object.values(guides))for(const f of g.files)await upload(f);
function explanation(name,n){const g=guides[name+':'+n];if(!g?.files.length)throw Error('Missing guide '+name+n);return {html:g.files.map(f=>`<p><img src="${uploads[f]}" alt="Supplied explanation for question ${n}"></p>`).join(''),pages:g.pages};}
const needA=[84,96,97,98,100,101,102,103,104,105,107,108,109,110,111,112,113];
for(const f of ['a','b']){const name=`20252026_form_${f}_-_math_answers`,text=await fs.readFile(path.join(root,name+'.txt'),'utf8'),letterKeys=Object.fromEntries([...text.matchAll(/^(\d+)\.\s*\(([A-H])\)/gm)].map(m=>[+m[1],m[2]])),source={sourceFamily:'official_shsat',sourceFormat:'testnav',playerProfile:'testnav',label:`2025-2026 Form ${f.toUpperCase()}`,year:'2025-2026',form:f.toUpperCase(),url:'https://www.stuyprep.nyc/16tests.html'},qs=[];
 for(const r of (await read(`testnav-${f}.json`)).filter(r=>f==='a'?needA.includes(r.number):r.number===60||r.number>=63).sort((a,b)=>a.number-b.number)){
  const $=load(r.html,null,false);$('.MathJax_CHTML,.MathJax_Preview,.MJX_Assistive_MathML').remove();$('script[type="math/mml"]').each((i,e)=>$(e).replaceWith($(e).html()));$('canvas,.int-error-message,.int-error-msg').remove();$('.ttsword,.tts_textwrapper').each((i,e)=>$(e).replaceWith($(e).html()));
  const mod=$('[data-module]').first().attr('data-module');const schema={identifier:'RESPONSE',interactionType:mod==='CustomInteraction-equationeditor'?'CUSTOMINTERACTION':mod==='TextEntry'?'TEXTENTRYINTERACTION':mod.toUpperCase(),cardinality:'single'};let key={correctChoiceId:letterKeys[r.number]};
  if(mod==='TextEntry'){const m=text.match(new RegExp(`^${r.number}\\.\\s*\\(([^)]+)\\)`,'m'));if(!m)throw Error('No short response key');key={correctTextAnswers:[m[1]]};}
  if(mod==='ChoiceInteraction'&&$('.int-choice-list input[type="checkbox"],.int-choice-list [role="checkbox"]').length)schema.cardinality='multiple';
  if(f==='b'&&r.number===60)key={slots:['item-5','item-1']};
  if(f==='b'&&r.number===72)key={points:[5],graphCoordinates:Array.from({length:11},(_,i)=>[i/10,0])};
  if(f==='b'&&r.number===75){schema.cardinality='multiple';key={correctChoiceIds:['A','C']};}
  if(f==='b'&&[90,110].includes(r.number)){schema.subType='tei-ee';key={correctTextAnswers:[r.number===90?'25π':'20x+50']};}
  if(mod==='ChoiceInteraction'&&!key.correctChoiceId&&!key.correctChoiceIds)throw Error('Unkeyed choice '+f+r.number);
  const q=convertItem({itemBodyHtml:$.root().html(),itemBodyExtraScript:`var responseSchema=${JSON.stringify([schema])};\nvar interaction_RESPONSE_options = {"models":[{}]};`},{number:r.number,section:'Math',exhibit:name+'.pdf'},{assets,source:{...source,sourceUrl:source.url},key});
  q.id=`official-shsat-2025-${f}-${r.number}`;q.source={...q.source,...source,questionNumber:r.number};q.review.sourceReviewed=false;q.review.completenessReviewed=false;q.review.classificationReviewed=false;
  if(r.number===110&&f==='b'){q.entryLayout='x_equals';q.entryVariable='x';q.entryPrefixVariable='y';q.source.keyEvidence='Supplied guide: y = 20x + 50. Existing equation-entry format supplies y = before the answer.';}
  const exp=explanation(name,r.number);q.explanationHtml=exp.html;q.review.answerSource={sourceFile:name+'.pdf',sourcePages:exp.pages};q.review.explanationSource=q.review.answerSource;
  // Use the existing taxonomy only when a close matching bank question establishes it.
  const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(x=>x.length>2);const words=new Set(norm(q.prompt));let best=null,score=0;
  for(const m of state.mathSections)for(const old of m.questions){const ow=new Set(norm(old.prompt)),s=[...words].filter(x=>ow.has(x)).length/Math.max(words.size,ow.size);if(s>score){score=s;best=old;}}
  if(score>.85&&best?.topic){q.topic=best.topic;q.subtopic=best.subtopic||'';q.review.classificationSource='inferred';}
  for(const c of q.choices||[]){if(!c.text?.trim()&&c.html?.includes('<img')){const im=load(c.html)('img').first();c.image={src:im.attr('src'),alt:im.attr('alt')||'Source answer-choice diagram'};delete c.html;}}
  qs.push(q);
 }
 if(qs.length!==(f==='a'?17:53))throw Error('Wrong count');await save(`20252026_form_${f}-prepared.json`,{format:'nathan-tutors-official-passage-v1',source,mathQuestions:qs});console.log(f,qs.length,qs.reduce((a,q)=>(a[q.type]=(a[q.type]||0)+1,a),{}));
}
for(const name of ['20202021_form_a','20202021_form_b','20242025_form_a']){const d=await read(name+'-prepared.json');for(const q of [...d.englishQuestions,...d.passages.flatMap(p=>p.questions),...d.mathQuestions]){const n=+q.review.sourceQuestion,exp=explanation(name+'_-_answers',n);q.explanationHtml=exp.html;q.review.explanationSource={sourceFile:name+'_-_answers.pdf',sourcePages:exp.pages};
 if(name==='20202021_form_a'&&n===5)for(const word of ['homes','company','becomes','remarketed'])q.promptHtml=q.promptHtml.replace(new RegExp(`\\b${word}\\b`),`<u>${word}</u>`);
 q.promptHtml=q.promptHtml.replace(/<\/blockquote><blockquote data-boxed="true">/g,'<br>');
 }await save(name+'-prepared.json',d);}



