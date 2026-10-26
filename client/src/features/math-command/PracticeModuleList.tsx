import { useState } from 'react';
import { ArrowRight, Settings2 } from 'lucide-react';
import { generatorTopicKey, managedGeneratorIds, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import { useAccountProfile } from '../account/account';
import type { StudentPreviewContext } from '../../lib/studentPreview';
import './practice-modules.css';

type Choices={hiddenChildren?:string[];hiddenTopics?:string[]};
type ChoiceMap=Record<string,Record<string,Choices>>;
function restore():ChoiceMap {try{const value=JSON.parse(localStorage.getItem('practice-module-choices:v1')??'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
const strings=(value:unknown):string[]=>Array.isArray(value)?value.filter(item=>typeof item==='string').slice(0,100):[];
export function PracticeModuleList({catalog,previewContext,onStart,category,topic}:{catalog:PracticeCatalog;previewContext:StudentPreviewContext;onStart:(id:string,selection:PracticeSelection)=>void;category?:string;topic?:string}) {
  const {profile}=useAccountProfile();
  const [preferences,setPreferences]=useState<ChoiceMap>(restore),[settings,setSettings]=useState<Record<string,boolean>>({});
  const accountKey=previewContext.isPreview?`preview:${previewContext.studentId||previewContext.mode}`:profile?.id??'pending';
  const own=preferences[accountKey]??{};
  function change(id:string,choices:Choices) {
    setPreferences(current=>{const next={...current,[accountKey]:{...current[accountKey],[id]:choices}};if(accountKey!=='pending')try{localStorage.setItem('practice-module-choices:v1',JSON.stringify(next));}catch{/* Settings still work when browser storage is unavailable. */}return next;});
  }
  const modules=catalog.modules.filter(module=>module.published&&!module.parentId&&(!category||module.category===category)&&(!topic||module.topic===topic));
  return <div className="math-study-modules practice-module-list" role="region" aria-label="Infinite practice modules" tabIndex={0}>{modules.map(module=>{
    const children=catalog.modules.filter(child=>child.published&&child.parentId===module.id),topics=[...new Set(catalog.generators.filter(generator=>generator.enabled).map(generatorTopicKey))];
    const choices=own[module.id]??{},hiddenChildren=strings(choices.hiddenChildren),hiddenTopics=strings(choices.hiddenTopics);
    const selection:PracticeSelection={...(children.length?{childModuleIds:children.filter(child=>!hiddenChildren.includes(child.id)).map(child=>child.id)}:{}),...(module.id==='all'||module.includeAll?{topics:topics.filter(topic=>!hiddenTopics.includes(topic))}:{})};
    const count=managedGeneratorIds(module,catalog,selection).length,canConfigure=module.id==='foundation'||children.length>0||module.id==='all'||module.includeAll;
    return <article className="practice-module-group" key={module.id}>
      <div className="practice-module-heading"><div><h4>{module.title}</h4><p>{module.description}</p><small>{count} generator{count===1?'':'s'} · No calculator</small></div><button disabled={!count} type="button" onClick={()=>onStart(module.id,selection)} aria-label={`Start ${module.title}`}>Start <ArrowRight size={16}/></button></div>
      {canConfigure&&<button className="practice-module-settings-toggle" aria-expanded={!!settings[module.id]} aria-label={`${module.title} settings`} type="button" onClick={()=>setSettings(current=>({...current,[module.id]:!current[module.id]}))}><Settings2 size={14}/> Settings</button>}
      {settings[module.id]&&<div className="practice-module-settings">
        {(module.id==='all'||module.includeAll)?<><h5>Topics to practice</h5><p>All enabled generators are available. Choose which topics to include in your next session.</p>{topics.map(topic=><label key={topic}><input type="checkbox" checked={!hiddenTopics.includes(topic)} onChange={event=>change(module.id,{...choices,hiddenTopics:event.target.checked?hiddenTopics.filter(item=>item!==topic):[...hiddenTopics,topic]})}/>{topic}</label>)}</>:<><h5>Modules in Foundation Building</h5><p>Choose which modules to include in your next Foundation Building session.</p>{children.map(child=><label key={child.id}><input type="checkbox" checked={!hiddenChildren.includes(child.id)} onChange={event=>change(module.id,{...choices,hiddenChildren:event.target.checked?hiddenChildren.filter(item=>item!==child.id):[...hiddenChildren,child.id]})}/>{child.title}</label>)}{!children.length&&<p>Your teacher can move modules into Foundation Building from the studio.</p>}</>}
        {!count&&<p className="practice-module-warning">Select at least one available topic or module to start.</p>}<small>Settings are saved on this device.</small>
      </div>}
    </article>;
  })}{!modules.length&&<p className="math-study-resource-status">No practice modules are published here yet.</p>}</div>;
}
