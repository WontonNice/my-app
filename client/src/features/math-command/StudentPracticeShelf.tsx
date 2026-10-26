import { lazy, Suspense, useState } from 'react';
import { Infinity as InfinityIcon } from 'lucide-react';
import { usePracticeCatalog } from './usePracticeCatalog';
import { PracticeModuleList } from './PracticeModuleList';
import { managedGeneratorIds, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';
import type { StudentPreviewContext } from '../../lib/studentPreview';
import '../../styles/math-study-hall.css';
const Player=lazy(()=>import('./InequalityPractice').then(module=>({default:module.InequalityPractice})));
export function StudentPracticeShelf({previewContext}:{previewContext:StudentPreviewContext}) {
  const {catalog,loading,error,reload}=usePracticeCatalog();
  const [launch,setLaunch]=useState<{id:string;selection:PracticeSelection}|null>(null);
  async function start(id:string,selection:PracticeSelection){const fresh=await reload(),module=fresh?.modules.find(item=>item.id===id&&item.published);if(fresh&&module&&managedGeneratorIds(module,fresh,selection).length)setLaunch({id,selection});}
  return <section className="student-practice-shelf math-study-resource-section" aria-labelledby="dashboard-practice-title"><header><InfinityIcon size={25}/><div><h2 id="dashboard-practice-title">Infinite practice</h2><p>Start a module here. Use Settings to choose your practice mix.</p></div></header>{error?<div role="alert" className="math-study-resource-status"><p>{error}</p><button onClick={()=>void reload()}>Try again</button></div>:loading?<p role="status" className="math-study-resource-status">Loading practice modules…</p>:catalog?<PracticeModuleList catalog={catalog} previewContext={previewContext} onStart={(id,selection)=>void start(id,selection)}/>:null}{launch&&catalog&&<Suspense fallback={<p role="status">Opening practice…</p>}><Player initialModuleId={launch.id} catalog={catalog} initialSelection={launch.selection} onClose={()=>setLaunch(null)}/></Suspense>}</section>;
}
