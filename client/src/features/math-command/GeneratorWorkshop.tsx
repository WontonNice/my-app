import { useEffect, useRef, useState } from 'react';
import { Copy, Search, X } from 'lucide-react';
import { ExamText } from '../../components/ExamReviewQuestion';
import type { PracticeCatalog, PracticeTaxonomy } from '../../../../server/src/shared/practiceCatalog';
import { practiceModuleKind } from '../../../../server/src/shared/practiceCatalog';
import type { MathCatalogPage } from '../../../../server/src/shared/mathCommandTypes';
import type { MathCommandRequest, MathQuestionDetail } from './client';
import { generatorCodingBrief } from './generatorCodingBrief';

export function GeneratorWorkshop({catalog,taxonomy,request,sourceId='',moduleId='',onClose,onDirtyChange}: {
  catalog:PracticeCatalog;taxonomy:PracticeTaxonomy['categories'];request:MathCommandRequest;sourceId?:string;moduleId?:string;
  onClose:()=>void;onDirtyChange:(dirty:boolean)=>void;
}) {
  const [query,setQuery]=useState(''),[matches,setMatches]=useState<MathCatalogPage['items']>([]),[selectedSource,setSelectedSource]=useState(sourceId),[loadedSource,setSource]=useState<MathQuestionDetail>();
  const source=loadedSource?.record.id===selectedSource?loadedSource:undefined;
  const sourceCount=catalog.generators.filter(item=>item.sourceQuestionIds?.includes(selectedSource)).length;
  const [category,setCategory]=useState(''),[topic,setTopic]=useState(''),[destination,setDestination]=useState(moduleId),[moduleName,setModuleName]=useState(''),[parentKind,setParentKind]=useState<'general'|'foundation'>('general');
  const [notes,setNotes]=useState(''),[copiedPrompt,setCopiedPrompt]=useState('');
  const [busy,setBusy]=useState(Boolean(sourceId)),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>()=>onDirtyChange(false),[onDirtyChange]);
  useEffect(()=>{heading.current?.focus();},[]);
  useEffect(()=>{if(!selectedSource)return;let active=true;void request<MathQuestionDetail>(`/catalog/${encodeURIComponent(selectedSource)}`).then(next=>{
    if(!active)return;setSource(next);setCategory(next.row.category??'');setTopic(next.row.subcategory??'');
  }).catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Could not load the source question.');}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[request,selectedSource]);
  const modules=catalog.modules.filter(item=>item.category===category&&item.topic===topic);
  const existing=modules.find(item=>item.id===destination);
  const targetTitle=existing?.title??moduleName.trim();
  const parent=modules.find(item=>practiceModuleKind(item)===parentKind);
  const validDestination=taxonomy.some(item=>item.label===category&&item.topics.includes(topic))&&Boolean(targetTitle&&targetTitle.length<=120&&(existing||parent));
  const prompt=source&&validDestination?generatorCodingBrief(source,{category,topic,title:targetTitle,module:existing,parent,notes},catalog.generators.filter(item=>item.sourceQuestionIds?.includes(source.record.id))):'';
  useEffect(()=>{onDirtyChange(Boolean((moduleName.trim()||notes.trim())&&prompt!==copiedPrompt));},[moduleName,notes,prompt,copiedPrompt,onDirtyChange]);
  async function search(){setBusy(true);setError('');try{const page=await request<MathCatalogPage>('/catalog?'+new URLSearchParams({filters:JSON.stringify({search:query,page:1,pageSize:10,sort:'source',direction:'asc'})}));setMatches(page.items);setNotice(page.total?`${page.total} matching questions. Showing the first ${page.items.length}.`:'No source questions match. Try a title, phrase, or question ID.');}catch(reason){setError((reason as Error).message);}finally{setBusy(false);}}
  return <section className="ps-workshop" aria-label="Create a question generator">
    <header><div><h2 ref={heading} tabIndex={-1}>Create from a math question</h2><p>Choose a source and destination, then give the coding brief to your coding assistant.</p></div><button type="button" onClick={onClose} aria-label="Close generator workshop"><X size={18}/></button></header>
    <section className="ps-workshop-source"><h3>Source question</h3><form onSubmit={event=>{event.preventDefault();void search();}}><label>Find a source question<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Question ID, wording, or source"/></label><button disabled={busy||!query.trim()}><Search size={16}/> Search questions</button></form>
      {matches.length>0&&<ul className="ps-source-results">{matches.map(item=><li key={item.id}><button type="button" aria-pressed={selectedSource===item.id} onClick={()=>{if(item.id===selectedSource)return;setError('');setNotice('');setBusy(true);setSelectedSource(item.id);}}><strong>{item.prompt||item.id}</strong><small>{item.id} · {item.category} / {item.subcategory}</small></button></li>)}</ul>}
      {busy&&<p role="status">Loading questions…</p>}
      {source&&<div className="ps-source-context"><strong>{source.record.id}</strong><p><ExamText text={source.record.question.prompt}/></p><details><summary>Source answer, choices, and explanation</summary>{source.record.question.choices?.map(choice=><p key={choice.id}>{choice.id}. <ExamText text={choice.text??choice.math??''}/></p>)}<p>Answer: {source.record.question.correctChoiceId??source.record.question.correctTextAnswers?.join(' or ')??'No answer key recorded'}</p><ExamText text={source.record.question.explanation??'No explanation recorded.'}/></details><small>{source.record.sources.map(item=>item.title).join(' · ')}</small><p className="ps-note">{sourceCount} existing generator{sourceCount===1?' references':'s reference'} this source. Reuse them from the module’s generation set when they already cover the skill.</p></div>}
    </section>
    {source&&<><section className="ps-workshop-destination"><h3>Destination module</h3><div className="ps-fields"><label>Category<select value={category} onChange={event=>{setCategory(event.target.value);setTopic(taxonomy.find(item=>item.label===event.target.value)?.topics[0]??'');setDestination('');}}><option value="">Choose category</option>{taxonomy.map(item=><option key={item.label}>{item.label}</option>)}</select></label><label>Subcategory<select value={topic} onChange={event=>{setTopic(event.target.value);setDestination('');}}><option value="">Choose subcategory</option>{taxonomy.find(item=>item.label===category)?.topics.map(item=><option key={item}>{item}</option>)}</select></label></div>
      <label>Add to module<select value={existing?.id??''} onChange={event=>setDestination(event.target.value)}><option value="">Create a new focused module</option>{modules.map(item=><option key={item.id} value={item.id}>{item.title}{practiceModuleKind(item)?' (topic group)':''}</option>)}</select></label>
      {!existing&&<div className="ps-fields"><label>New module name<input value={moduleName} onChange={event=>setModuleName(event.target.value)} maxLength={120} placeholder="A short name for this skill"/></label><label>Practice group<select value={parentKind} onChange={event=>setParentKind(event.target.value as typeof parentKind)}><option value="general">General Practice</option><option value="foundation">Foundation Building</option></select></label></div>}
    </section><section className="ps-workshop-template"><h3>Build with custom code</h3><p>Your coding assistant will implement and test a generator in the repository, then register it for review in this studio.</p><label>What should the generator do?<textarea value={notes} onChange={event=>setNotes(event.target.value)} maxLength={6000} rows={3} placeholder="Optional: difficulty, variations, diagrams, answer format, or examples to include"/></label><button type="button" disabled={!prompt||busy} onClick={()=>{void navigator.clipboard.writeText(prompt).then(()=>{setCopiedPrompt(prompt);setError('');setNotice('Coding brief copied. Paste it into your coding chat. Once the generator is implemented and registered, reload this studio to preview it.');}).catch(()=>setError('Clipboard unavailable. Open the coding brief below and copy its text.'));}}><Copy size={16}/> Copy coding brief</button><details><summary>View coding brief</summary><textarea aria-label="Coding brief" readOnly value={prompt} rows={12}/></details><p className="ps-note">Copying prepares the request. Implementation, testing, and catalog registration happen in your coding chat. The new generator starts disabled; preview it here before enabling student access.</p></section></>}
    {error&&<p className="ps-message is-error" role="alert">{error}</p>}{notice&&<p className="ps-message" role="status">{notice}</p>}
  </section>;
}
