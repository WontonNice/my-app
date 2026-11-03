import { useEffect, useState } from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { managedGeneratorIds, practiceModuleKind, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import type { StudentPreviewContext } from '../../lib/studentPreview';
import { useAccountProfile } from '../account/account';
import { practiceProgressEvent, readPracticeProgress } from './practiceSessionStorage';
import { PracticeStars } from './PracticeStars';
import './practice-modules.css';

export function PracticeModuleList({catalog,onStart,category,topic,previewContext}:{catalog:PracticeCatalog;previewContext:StudentPreviewContext;onStart:(id:string,selection:PracticeSelection)=>void;category?:string;topic?:string}) {
  const {profile}=useAccountProfile();
  const owner=previewContext.isPreview?'preview:'+previewContext.mode+':'+(previewContext.studentId||'teacher'):profile?.id;
  const [,refresh]=useState(0);
  useEffect(()=>{
    const update=()=>refresh(value=>value+1);
    window.addEventListener('storage',update);
    window.addEventListener(practiceProgressEvent,update);
    return ()=>{window.removeEventListener('storage',update);window.removeEventListener(practiceProgressEvent,update);};
  },[]);
  const modules=catalog.modules.filter(module=>module.published&&Boolean(practiceModuleKind(module))&&!module.parentId&&(!category||module.category===category)&&(!topic||module.topic===topic)&&(Boolean(category||topic)||managedGeneratorIds(module,catalog).length>0));
  function row(module:PracticeCatalog['modules'][number]) {
    const count=managedGeneratorIds(module,catalog).length;
    let progress;
    try { if(owner)progress=readPracticeProgress(localStorage,owner,module.id); } catch { /* Practice remains available without browser storage. */ }
    const best=progress?.longestStreak??0,checked=progress?.checked??0;
    return <article className="practice-module-group" key={module.id}>
      <div className="practice-module-heading">
        <div>{!category&&<small className="practice-module-topic">{module.category} / {module.topic}</small>}<h4>{module.title}</h4><p>{module.description}</p><small>{count} generator{count===1?'':'s'} · No calculator</small></div>
        <button disabled={!count} type="button" onClick={()=>onStart(module.id,{})} aria-label={`Start or resume ${module.title}`}>{progress?.resumable?'Resume practice':'Start practice'}<ArrowRight size={16} aria-hidden="true"/></button>
      </div>
      <div className="practice-module-progress">
        <dl><div className="practice-module-record"><dt><Trophy size={14} aria-hidden="true"/>Longest streak</dt><dd>{best}<span> in a row</span></dd></div><div><dt>Accuracy</dt><dd>{checked?`${Math.round(100*(progress?.correct??0)/checked)}%`:'—'}</dd></div><div><dt>Questions checked</dt><dd>{checked}</dd></div></dl>
        <PracticeStars longestStreak={best}/>
      </div>
      <small className="practice-module-save-note">{checked||best?'Accuracy and questions from your latest session. Records saved on this device.':'Start practicing to build your streak and earn stars.'}</small>
    </article>;
  }
  return <div className="math-study-modules practice-module-list" role="region" aria-label="Infinite practice modules">
    {modules.map(row)}
    {!modules.length&&<p className="math-study-resource-status">No practice modules are published here yet.</p>}
  </div>;
}
