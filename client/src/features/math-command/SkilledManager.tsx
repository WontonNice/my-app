import { notifyPlannerChanged } from './generatorPlannerSync';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import type { MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';
import { jsonRequest, type MathCommandRequest } from './client';
import './skilled-manager.css';

export type SkilledSnapshot={revision:string;skills:MathClassificationSkill[];categories:{label:string;topics:string[]}[]};
export function SkilledManager({request,onClose,onSaved,initialCategory='',initialTopic=''}:{request:MathCommandRequest;onClose:()=>void;onSaved?:(snapshot:SkilledSnapshot)=>void;initialCategory?:string;initialTopic?:string}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [relocating,setRelocating]=useState<{id:string;category:string;topic:string}|null>(null);
  const [data,setData]=useState<SkilledSnapshot|null>(null),[draft,setDraft]=useState<MathClassificationSkill[]>([]),[category,setCategory]=useState(initialCategory),[topic,setTopic]=useState(initialTopic),[name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();return()=>{previous?.focus({preventScroll:true});};},[]);
  useEffect(()=>{let active=true;void request<SkilledSnapshot>('/classification-skills').then(next=>{if(active){setData(next);setDraft(next.skills);}}).catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Skilled definitions could not be loaded.');});return()=>{active=false;};},[request]);
  const currentCategory=data?.categories.find(item=>item.label===category)??data?.categories[0],currentTopic=currentCategory?.topics.includes(topic)?topic:currentCategory?.topics[0]??'';
  const items=draft.filter(skill=>skill.category===currentCategory?.label&&skill.subcategory===currentTopic),dirty=Boolean(data&&JSON.stringify(data.skills)!==JSON.stringify(draft));
  const relocations=draft.flatMap(skill=>{const before=data?.skills.find(item=>item.id===skill.id);return before&&(before.category!==skill.category||before.subcategory!==skill.subcategory)?[{before,after:skill}]:[];});
  function stageLocation(){
    if(!relocating)return;
    const skill=draft.find(item=>item.id===relocating.id);if(!skill)return;
    setDraft(draft.map(item=>item.id===skill.id?{...item,category:relocating.category,subcategory:relocating.topic}:item));
    setCategory(relocating.category);setTopic(relocating.topic);setRelocating(null);
    setNotice(`Move staged for ${skill.label}. Review the destination, then Save Skilled to apply it everywhere.`);
  }
  function add(){if(!currentCategory||!currentTopic||!name.trim())return;setDraft([...draft,{id:crypto.randomUUID(),label:name.trim(),category:currentCategory.label,subcategory:currentTopic}]);setName('');setNotice('Skill added to this draft. Save Skilled to make it available everywhere.');}
  function move(id:string,direction:number){const index=items.findIndex(item=>item.id===id),other=items[index+direction];if(!other)return;const next=[...draft],first=next.findIndex(item=>item.id===id),second=next.findIndex(item=>item.id===other.id);[next[first],next[second]]=[next[second],next[first]];setDraft(next);}
  async function save(){if(!data)return;setBusy(true);setError('');try{const next=await request<SkilledSnapshot>('/classification-skills',jsonRequest('POST',{revision:data.revision,skills:draft}));setData(next);setDraft(next.skills);setNotice('Skills saved. Linked module names, locations, assigned questions and planner destinations are up to date.');setRelocating(null);onSaved?.(next);notifyPlannerChanged();}catch(reason){setError(reason instanceof Error?reason.message:'Skilled definitions could not be saved.');}finally{setBusy(false);}}
  async function reload(){setBusy(true);setError('');try{const next=await request<SkilledSnapshot>('/classification-skills');setData(next);setDraft(next.skills);setNotice('Loaded the latest definitions.');}catch(reason){setError(reason instanceof Error?reason.message:'Could not reload Skilled.');}finally{setBusy(false);}}
  function close(){if(busy)return;if(dirty&&!window.confirm('Discard your unsaved Skilled changes?'))return;onClose();}
  return createPortal(<dialog ref={dialog} className="skilled-manager" aria-labelledby="skilled-manager-title" onCancel={event=>{event.preventDefault();close();}}>
    <header><div><h2 id="skilled-manager-title">Manage Skilled</h2><p>One shared list of skills, organized within each subcategory.</p></div><button type="button" disabled={busy} aria-label="Close Skilled manager" onClick={close}><X size={18}/></button></header>
    <div className="skilled-manager-body">
      <p>Module names and skills share this list. Rename a skill or use Move to change its category and topic everywhere. Remove a module in Practice Studio before deleting its skill label. Questions stay <strong>TBD</strong> until you assign them.</p>
      {error&&<div className="skilled-error" role="alert">{error}<button type="button" disabled={busy} onClick={()=>void reload()}>Reload definitions</button></div>}
      {notice&&<p role="status">{notice}</p>}
      {relocations.length>0&&<section className="skilled-move-review" aria-label="Pending skill moves"><strong>Moves to save</strong><ul>{relocations.map(({before,after})=><li key={after.id}><strong>{after.label}</strong>: {before.category} / {before.subcategory} → {after.category} / {after.subcategory}</li>)}</ul><p>Assigned source questions and planner destinations follow the skill. Generators stay in their current topics. Linked modules keep only generators in the destination topic; an empty module becomes a draft.</p></section>}
      {!data?<p role="status">{error?'Definitions could not be loaded.':'Loading Skilled definitions…'}</p>:<fieldset disabled={busy}>
        <div className="skilled-scope"><label>Main category<select value={currentCategory?.label??''} onChange={event=>{setCategory(event.target.value);setTopic('');setName('');}}>{data.categories.map(item=><option key={item.label}>{item.label}</option>)}</select></label><label>Specific topic<select value={currentTopic} onChange={event=>{setTopic(event.target.value);setName('');}}>{currentCategory?.topics.map(item=><option key={item}>{item}</option>)}</select></label></div>
        <h3>Skills in {currentTopic||'this subcategory'}</h3>
        <p className="skilled-note">TBD is always available and cannot be renamed or deleted.</p>
        {items.map((skill,index)=><div className="skilled-item" key={skill.id}><div className="skilled-row"><label>Skill name<input aria-label={`Skill name ${index+1}`} maxLength={120} value={skill.label} onChange={event=>setDraft(draft.map(item=>item.id===skill.id?{...item,label:event.target.value}:item))}/></label><div><button type="button" aria-label={`Change category or topic for ${skill.label}`} onClick={()=>setRelocating({id:skill.id,category:skill.category,topic:skill.subcategory})}>Move</button><button type="button" aria-label={`Move ${skill.label} up`} disabled={!index} onClick={()=>move(skill.id,-1)}><ArrowUp size={15}/></button><button type="button" aria-label={`Move ${skill.label} down`} disabled={index===items.length-1} onClick={()=>move(skill.id,1)}><ArrowDown size={15}/></button><button type="button" aria-label={`Delete skill ${skill.label}`} disabled={Boolean(skill.moduleIds?.length)} title={skill.moduleIds?.length?"Remove the linked module in Practice Studio first":undefined} onClick={()=>{setDraft(draft.filter(item=>item.id!==skill.id));setNotice('Deletion staged. Save Skilled to reset this skill’s linked classifications to TBD.');}}>Delete</button></div></div>
          {relocating?.id===skill.id&&<section className="skilled-relocate" aria-label={`Move ${skill.label}`}>
            <h4>Move {skill.label}</h4>
            <div className="skilled-scope"><label>Destination category<select value={relocating.category} onChange={event=>setRelocating({...relocating,category:event.target.value,topic:data.categories.find(item=>item.label===event.target.value)?.topics[0]??''})}>{data.categories.map(item=><option key={item.label}>{item.label}</option>)}</select></label><label>Destination topic<select value={relocating.topic} onChange={event=>setRelocating({...relocating,topic:event.target.value})}>{data.categories.find(item=>item.label===relocating.category)?.topics.map(item=><option key={item}>{item}</option>)}</select></label></div>
            <p>Moves this skill, its linked modules and assigned source questions. Generators stay in their current topics. A moved module with no matching generators becomes a draft.</p>
            <div className="skilled-move-actions"><button type="button" disabled={!relocating.topic||(relocating.category===skill.category&&relocating.topic===skill.subcategory)} onClick={stageLocation}>Use this location</button><button type="button" onClick={()=>setRelocating(null)}>Cancel move</button></div>
          </section>}
        </div>)}
        {!items.length&&<p className="skilled-note">No skills defined here yet. Questions remain TBD.</p>}
        <div className="skilled-add"><label>New skill name<input value={name} maxLength={120} onChange={event=>setName(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();add();}}}/></label><button type="button" disabled={!name.trim()||!currentTopic} onClick={add}>Add skill</button></div>
      </fieldset>}
    </div><footer><span>{dirty?'Unsaved changes':'All changes saved'}</span><button type="button" disabled={busy} onClick={close}>Close</button><button type="button" className="skilled-save" disabled={!dirty||busy} onClick={()=>void save()}>{busy?'Saving…':'Save Skilled'}</button></footer>
  </dialog>,document.body);
}
