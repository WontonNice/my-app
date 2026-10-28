import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import type { MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';
import { jsonRequest, type MathCommandRequest } from './client';
import './skilled-manager.css';

export type SkilledSnapshot={revision:string;skills:MathClassificationSkill[];categories:{label:string;topics:string[]}[]};
export function SkilledManager({request,onClose,onSaved,initialCategory='',initialTopic=''}:{request:MathCommandRequest;onClose:()=>void;onSaved?:(snapshot:SkilledSnapshot)=>void;initialCategory?:string;initialTopic?:string}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [data,setData]=useState<SkilledSnapshot|null>(null),[draft,setDraft]=useState<MathClassificationSkill[]>([]),[category,setCategory]=useState(initialCategory),[topic,setTopic]=useState(initialTopic),[name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();return()=>{previous?.focus({preventScroll:true});};},[]);
  useEffect(()=>{let active=true;void request<SkilledSnapshot>('/classification-skills').then(next=>{if(active){setData(next);setDraft(next.skills);}}).catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Skilled definitions could not be loaded.');});return()=>{active=false;};},[request]);
  const currentCategory=data?.categories.find(item=>item.label===category)??data?.categories[0],currentTopic=currentCategory?.topics.includes(topic)?topic:currentCategory?.topics[0]??'';
  const items=draft.filter(skill=>skill.category===currentCategory?.label&&skill.subcategory===currentTopic),dirty=Boolean(data&&JSON.stringify(data.skills)!==JSON.stringify(draft));
  function add(){if(!currentCategory||!currentTopic||!name.trim())return;setDraft([...draft,{id:crypto.randomUUID(),label:name.trim(),category:currentCategory.label,subcategory:currentTopic}]);setName('');setNotice('Skill added to this draft. Save Skilled to make it available everywhere.');}
  function move(id:string,direction:number){const index=items.findIndex(item=>item.id===id),other=items[index+direction];if(!other)return;const next=[...draft],first=next.findIndex(item=>item.id===id),second=next.findIndex(item=>item.id===other.id);[next[first],next[second]]=[next[second],next[first]];setDraft(next);}
  async function save(){if(!data)return;setBusy(true);setError('');try{const next=await request<SkilledSnapshot>('/classification-skills',jsonRequest('POST',{revision:data.revision,skills:draft}));setData(next);setDraft(next.skills);setNotice('Skilled definitions saved everywhere. Linked module names now follow these names.');onSaved?.(next);}catch(reason){setError(reason instanceof Error?reason.message:'Skilled definitions could not be saved.');}finally{setBusy(false);}}
  async function reload(){setBusy(true);setError('');try{const next=await request<SkilledSnapshot>('/classification-skills');setData(next);setDraft(next.skills);setNotice('Loaded the latest definitions.');}catch(reason){setError(reason instanceof Error?reason.message:'Could not reload Skilled.');}finally{setBusy(false);}}
  function close(){if(busy)return;if(dirty&&!window.confirm('Discard your unsaved Skilled changes?'))return;onClose();}
  return createPortal(<dialog ref={dialog} className="skilled-manager" aria-labelledby="skilled-manager-title" onCancel={event=>{event.preventDefault();close();}}>
    <header><div><h2 id="skilled-manager-title">Manage Skilled</h2><p>One shared list of skills, organized within each subcategory.</p></div><button type="button" disabled={busy} aria-label="Close Skilled manager" onClick={close}><X size={18}/></button></header>
    <div className="skilled-manager-body">
      <p>Questions start as <strong>TBD</strong> until you assign a skill. Linked infinite-practice modules use the same skill name. Renames apply everywhere; deleting a skill returns its linked classifications to TBD.</p>
      {error&&<div className="skilled-error" role="alert">{error}<button type="button" disabled={busy} onClick={()=>void reload()}>Reload definitions</button></div>}
      {notice&&<p role="status">{notice}</p>}
      {!data?<p role="status">{error?'Definitions could not be loaded.':'Loading Skilled definitions…'}</p>:<fieldset disabled={busy}>
        <div className="skilled-scope"><label>Main category<select value={currentCategory?.label??''} onChange={event=>{setCategory(event.target.value);setTopic('');setName('');}}>{data.categories.map(item=><option key={item.label}>{item.label}</option>)}</select></label><label>Specific topic<select value={currentTopic} onChange={event=>{setTopic(event.target.value);setName('');}}>{currentCategory?.topics.map(item=><option key={item}>{item}</option>)}</select></label></div>
        <h3>Skills in {currentTopic||'this subcategory'}</h3>
        <p className="skilled-note">TBD is always available and cannot be renamed or deleted.</p>
        {items.map((skill,index)=><div className="skilled-row" key={skill.id}><label>Skill name<input aria-label={`Skill name ${index+1}`} maxLength={120} value={skill.label} onChange={event=>setDraft(draft.map(item=>item.id===skill.id?{...item,label:event.target.value}:item))}/></label><div><button type="button" aria-label={`Move ${skill.label} up`} disabled={!index} onClick={()=>move(skill.id,-1)}><ArrowUp size={15}/></button><button type="button" aria-label={`Move ${skill.label} down`} disabled={index===items.length-1} onClick={()=>move(skill.id,1)}><ArrowDown size={15}/></button><button type="button" aria-label={`Delete skill ${skill.label}`} onClick={()=>{setDraft(draft.filter(item=>item.id!==skill.id));setNotice('Deletion staged. Save Skilled to reset this skill’s linked classifications to TBD.');}}>Delete</button></div></div>)}
        {!items.length&&<p className="skilled-note">No skills defined here yet. Questions remain TBD.</p>}
        <div className="skilled-add"><label>New skill name<input value={name} maxLength={120} onChange={event=>setName(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();add();}}}/></label><button type="button" disabled={!name.trim()||!currentTopic} onClick={add}>Add skill</button></div>
      </fieldset>}
    </div><footer><span>{dirty?'Unsaved changes':'All changes saved'}</span><button type="button" disabled={busy} onClick={close}>Close</button><button type="button" className="skilled-save" disabled={!dirty||busy} onClick={()=>void save()}>{busy?'Saving…':'Save Skilled'}</button></footer>
  </dialog>,document.body);
}
