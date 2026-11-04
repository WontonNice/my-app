import { useEffect, useState } from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import type { StudentPreviewContext } from '../../lib/studentPreview';
import { useAccountProfile } from '../account/account';
import { practiceProgressEvent, readPracticeProgress } from './practiceSessionStorage';
import { PracticeStars } from './PracticeStars';
import { foundationOptions, foundationSelection, foundationPreferencesEvent, readFoundationPreferences, saveFoundationPreferences, type FoundationPreferences } from './foundationPreferences';
import './practice-modules.css';

type Props={catalog:PracticeCatalog;previewContext:StudentPreviewContext;onStart:(id:string,selection:PracticeSelection,startNew?:boolean)=>void;category?:string;topic?:string};
export function PracticeModuleList(props:Props) {
  const {profile}=useAccountProfile();
  const {previewContext}=props;
  const owner=previewContext.isPreview?'preview:'+previewContext.mode+':'+(previewContext.studentId||'teacher'):profile?.id;
  return <ModuleList key={owner??'loading'} {...props} owner={owner}/>;
}
function ModuleList({catalog,onStart,category,topic,owner}:Props&{owner?:string}) {
  const [,refresh]=useState(0);
  const [saveErrors,setSaveErrors]=useState<Record<string,string>>({});
  useEffect(()=>{
    const update=()=>refresh(value=>value+1);
    window.addEventListener('storage',update);
    window.addEventListener(practiceProgressEvent,update);
    window.addEventListener(foundationPreferencesEvent,update);
    return ()=>{window.removeEventListener('storage',update);window.removeEventListener(practiceProgressEvent,update);window.removeEventListener(foundationPreferencesEvent,update);};
  },[]);
  const modules=catalog.modules.filter(module=>module.published&&Boolean(practiceModuleKind(module))&&!module.parentId&&(!category||module.category===category)&&(!topic||module.topic===topic)&&(Boolean(category||topic)||managedGeneratorIds(module,catalog).length>0));
  function moduleBest(id:string){try{return owner?readPracticeProgress(localStorage,owner,id).longestStreak:0;}catch{return 0;}}
  function row(module:PracticeCatalog['modules'][number]) {
    const customizable=practiceModuleKind(module)==='foundation',options=foundationOptions(module,catalog);
    let preferences:FoundationPreferences={excludedModuleIds:[],includeUnassigned:true},loadFailed=false;
    try{if(owner&&customizable)preferences=readFoundationPreferences(localStorage,owner,module.id);}catch{loadFailed=true;}
    const selection=customizable?foundationSelection(module,catalog,preferences):{};
    const count=managedGeneratorIds(module,catalog,selection).length;
    function change(next:FoundationPreferences){
      if(!owner)return;
      try{saveFoundationPreferences(localStorage,owner,module.id,next);setSaveErrors(errors=>({...errors,[module.id]:''}));refresh(value=>value+1);}
      catch{setSaveErrors(errors=>({...errors,[module.id]:'Your changes could not be saved. Your previous settings are still in use. Try again.'}));}
    }
    let progress:ReturnType<typeof readPracticeProgress>|undefined;
    try { if(owner)progress=readPracticeProgress(localStorage,owner,module.id); } catch { /* Practice remains available without browser storage. */ }
    const best=progress?.longestStreak??0,checked=progress?.checked??0;
    return <article className="practice-module-group" key={module.id}>
      <div className="practice-module-heading">
        <div>{!category&&<small className="practice-module-topic">{module.category} / {module.topic}</small>}<h4>{module.title}</h4><p>{customizable?'The same practice content, customized to the modules you choose.':'Practice all available modules and question types in this topic.'}</p><small>{count} generator{count===1?'':'s'}{customizable?' selected':''} · No calculator</small></div>
        <button disabled={!count&&!progress?.resumable} type="button" onClick={()=>onStart(module.id,progress?.resumable?{}:selection)} aria-label={`Start or resume ${module.title}`}>{progress?.resumable?'Resume practice':'Start practice'}<ArrowRight size={16} aria-hidden="true"/></button>
      </div>
      {customizable&&<details className="practice-module-settings">
        <summary>Foundation Building settings</summary>
        <p>Choose the modules you want to practice. New modules are included automatically. A question shared by multiple modules stays included while any of those modules is checked.</p>
        <fieldset disabled={!owner}><legend>Modules to practice</legend>
          {options.modules.map(child=><div className="practice-module-choice" key={child.id}><label><input type="checkbox" aria-label={child.title} checked={!preferences.excludedModuleIds.includes(child.id)} onChange={event=>change({...preferences,excludedModuleIds:event.target.checked?preferences.excludedModuleIds.filter(id=>id!==child.id):[...preferences.excludedModuleIds,child.id]})}/><span>{child.title}</span></label><PracticeStars longestStreak={moduleBest(child.id)} step={5} compact label={child.title}/></div>)}
          {options.unassigned.length>0&&<label><input type="checkbox" checked={preferences.includeUnassigned} onChange={event=>change({...preferences,includeUnassigned:event.target.checked})}/><span>Other question types ({options.unassigned.length})<small>Available questions that are not part of a named module.</small></span></label>}
          {!options.modules.length&&!options.unassigned.length&&<p>No practice content is available in this topic yet.</p>}
        </fieldset>
        <small>Each module earns stars at 5, 10, 15, 20, and 25 correct in a row. A wrong answer resets that module’s streak; earned stars stay.</small>
        {(saveErrors[module.id]||loadFailed)?<p role="alert" className="practice-module-warning">{saveErrors[module.id]||'Saved settings could not be read. Try again with browser storage available.'}</p>:<small>Choices and module stars are saved for your account on this device.</small>}
        {!count&&<p role="status">Select at least one module or question type to start a new session.</p>}
        {progress?.resumable&&<><p>Resume keeps your current question set. Start a new session to use these settings; your personal best is kept.</p><button type="button" disabled={!count} onClick={()=>onStart(module.id,selection,true)}>Start new with these settings</button></>}
      </details>}
      <div className="practice-module-progress">
        <dl><div className="practice-module-record"><dt><Trophy size={14} aria-hidden="true"/>Longest streak</dt><dd>{best}<span> in a row</span></dd></div><div><dt>Accuracy</dt><dd>{checked?`${Math.round(100*(progress?.correct??0)/checked)}%`:'—'}</dd></div><div><dt>Questions checked</dt><dd>{checked}</dd></div></dl>
        {!customizable&&<PracticeStars longestStreak={best}/>}
      </div>
      <small className="practice-module-save-note">{checked||best?'Accuracy and questions from your latest session. Records saved on this device.':'Start practicing to build your streak and earn stars.'}</small>
    </article>;
  }
  return <div className="math-study-modules practice-module-list" role="region" aria-label="Infinite practice modules">
    {modules.map(row)}
    {!modules.length&&<p className="math-study-resource-status">No practice modules are published here yet.</p>}
  </div>;
}
