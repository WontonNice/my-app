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
  const [launch,setLaunch]=useState<{id:string;selection:PracticeSelection;startNew?:boolean}|null>(null);
  async function start(id:string,selection:PracticeSelection,startNew=false){const fresh=await reload(),module=fresh?.modules.find(item=>item.id===id&&item.published);if(fresh&&module&&managedGeneratorIds(module,fresh,selection).length)setLaunch({id,selection,startNew});}
  return <section className="student-practice-shelf math-study-resource-section" aria-labelledby="dashboard-practice-title"><header><InfinityIcon size={25}/><div><h2 id="dashboard-practice-title">Infinite practice</h2><p>Start or resume practice. Customize Foundation Building and earn stars for each module.</p></div></header>{error?<div role="alert" className="math-study-resource-status"><p>{error}</p><button onClick={()=>void reload()}>Try again</button></div>:loading?<p role="status" className="math-study-resource-status">Loading practice modules…</p>:catalog?<PracticeModuleList catalog={catalog} previewContext={previewContext} onStart={(id,selection,startNew)=>void start(id,selection,startNew)}/>:null}{launch&&catalog&&<Suspense fallback={<p role="status">Opening practice…</p>}><Player initialModuleId={launch.id} catalog={catalog} initialSelection={launch.selection} initialStartNew={launch.startNew} onClose={()=>setLaunch(null)}/></Suspense>}</section>;
}
