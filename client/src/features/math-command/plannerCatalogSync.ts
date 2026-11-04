import type { MathCommandRequest } from './client';
import type { PracticeCatalog, PracticeTaxonomy } from '../../../../server/src/shared/practiceCatalog';
import { subscribePlannerChanges } from './generatorPlannerSync';

export type PlannerCatalogData={catalog:PracticeCatalog;taxonomy:PracticeTaxonomy['categories'];classificationSkills?:PracticeTaxonomy['classificationSkills']};

// Refresh catalog choices independently of the editable batch. Coalesce events,
// reread after an in-flight change, and ignore responses after an account switch.
export function watchPlannerCatalog(request:MathCommandRequest,onData:(data:PlannerCatalogData)=>void,onError:(message:string)=>void,subscribe=subscribePlannerChanges) {
  let active=true,running=false,pending=false;
  async function refresh(){
    if(!active)return;
    if(running){pending=true;return;}
    running=true;
    try{const next=await request<PlannerCatalogData>('/catalog?manage=1');if(active)onData(next);}
    catch(reason){if(active)onError(reason instanceof Error?reason.message:'Could not refresh destination modules.');}
    finally{running=false;if(active&&pending){pending=false;void refresh();}}
  }
  const unsubscribe=subscribe(()=>void refresh());
  void refresh();
  return {refresh,dispose(){active=false;unsubscribe();}};
}
