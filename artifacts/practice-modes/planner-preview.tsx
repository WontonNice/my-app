import React from 'react';
import {createRoot} from 'react-dom/client';
import {GeneratorPlanner} from '../../client/src/features/math-command/GeneratorPlanner';
import {notifyPlannerChanged} from '../../client/src/features/math-command/generatorPlannerSync';
import type {MathCommandRequest} from '../../client/src/features/math-command/client';
import '../../client/src/styles/global.css';
import stored from './planner-catalog-current.json';
import taxonomy from '../../tools/math-topics.json';

const resources:any={catalog:structuredClone(stored.catalog),taxonomy:taxonomy.categories,classificationSkills:[{id:'9abd5350-a5f2-4fad-9822-c1e064977942',label:'Simplifying Expressions',category:'Algebra',subcategory:'Algebraic Expressions'},{id:'qa-factoring',label:'Factoring Expressions',category:'Algebra',subcategory:'Algebraic Expressions'}]};
let planner:any={revision:'qa-1',activeBatchId:'qa-batch',batches:[{id:'qa-batch',name:'Fictional planner verification',notes:'',updatedAt:'2026-11-04',entries:[{id:'qa-entry',source:{id:'qa-algebra',question:{id:'qa-algebra',type:'multiple_choice',prompt:'Simplify 2x + 3x.',choices:[{id:'A',text:'5x'},{id:'B',text:'6x'}],correctChoiceId:'A'},sources:[],category:'Algebra',subcategory:'Algebraic Expressions',skilled:'TBD'},destination:{category:'Algebra',topic:'Algebraic Expressions',moduleId:'',moduleTitle:'',group:'foundation'},notes:'',status:'available',addedAt:'2026-11-04'}]}]};
const request:MathCommandRequest=async <T,>(path:string,options?:RequestInit)=>{
 if(options?.method==='POST'){
  const body=JSON.parse(String(options.body));
  if(body.action==='update'){planner.batches[0]={...planner.batches[0],name:body.name,notes:body.notes,entries:body.entries.map((entry:any)=>({...planner.batches[0].entries.find((saved:any)=>saved.id===entry.id),...entry}))};planner.revision+='x';}
 }
 return structuredClone(planner) as T;
};
const practiceRequest:MathCommandRequest=async <T,>()=>structuredClone(resources) as T;
function addSavedModule(){
 if(resources.catalog.modules.some((m:any)=>m.id==='qa-new-module'))return;
 resources.catalog.modules.push({id:'qa-new-module',title:'Solving Linear Equations',category:'Algebra',topic:'Equations & Systems',published:false,includeAll:false,generatorIds:[],description:'',parentId:'foundation-algebra-equations-systems-1iaob9y'});
 notifyPlannerChanged();
}
createRoot(document.getElementById('root')!).render(<main style={{maxWidth:1500,margin:'32px auto',padding:24}}><p>Local verification fixture · sample question and batch</p><button onClick={addSavedModule}>Simulate saving an Algebra module</button><GeneratorPlanner request={request} practiceRequest={practiceRequest}/></main>);
