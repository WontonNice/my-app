import { randomUUID } from 'node:crypto';
import { teacherMathClassification } from '../shared/mathClassificationReview';
import { practiceSkillSnapshot } from './practiceSkillContext';
import { mathClassificationRevision, commitMathCommandState, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy } from './mathCommandCatalogStore';
import { resolveSkilled, skilledTbd, validateClassificationSkills } from '../shared/mathClassificationSkills';

export function readClassificationSkills(root:string) {
  const state=readMathCommandState(root),taxonomy=readMathCommandTaxonomy(root);
  return {revision:practiceSkillSnapshot(root)?mathClassificationRevision(root):state.revision,skills:state.classificationSkills??[],categories:taxonomy.categories};
}
export function saveClassificationSkills(root:string,input:Record<string,unknown>,actor="teacher") {
  const state=readMathCommandState(root),taxonomy=readMathCommandTaxonomy(root);
  if(input.revision!==readClassificationSkills(root).revision)throw Object.assign(new Error('Skilled definitions changed in another window. Reload before saving.'),{status:409});
  const skills=validateClassificationSkills(input.skills,taxonomy),previous=state.classificationSkills??[];
  for(const skill of previous){
    if(skill.moduleIds?.length&&!skills.some(item=>item.id===skill.id))throw Object.assign(new Error(`“${skill.label}” names an existing practice module. Delete the module in Practice Studio before deleting its skill label.`),{status:400});
  }
  for(const skill of skills){
    const old=previous.find(item=>item.id===skill.id);
    if(old?.moduleIds?.length){
      if(skill.category!==old.category||skill.subcategory!==old.subcategory)skill.moduleScopeOverride=true;
      else if(old.moduleScopeOverride)skill.moduleScopeOverride=true;
      else delete skill.moduleScopeOverride;
      skill.moduleIds=old.moduleIds;skill.moduleOwned=old.moduleOwned;
    }else{delete skill.moduleIds;delete skill.moduleOwned;delete skill.moduleScopeOverride;}
  }
  const retired=new Set(state.retiredClassificationSkillIds??[]);
  if(skills.some(skill=>retired.has(skill.id)))throw Object.assign(new Error('A deleted Skilled ID cannot be reused. Add a new definition instead.'),{status:400});
  for(const skill of previous)if(!skills.some(item=>item.id===skill.id))retired.add(skill.id);
  for(const record of readMathCommandCatalog(root)){
    const value=record.metadata?.skilled??record.question.skilled;
    const next=skills.find(skill=>skill.id===value),old=previous.find(skill=>skill.id===value);
    if(next&&old&&(next.category!==old.category||next.subcategory!==old.subcategory)){
      state.metadata[record.id]={...state.metadata[record.id],category:next.category,subcategory:next.subcategory,skilled:next.id,
        classification:teacherMathClassification(record.metadata,{category:record.question.topic,subcategory:record.question.subtopic},next,actor)};
    }else if(value&&value!==skilledTbd&&resolveSkilled(value,record.question.topic,record.question.subtopic,skills)===skilledTbd)state.metadata[record.id]={...state.metadata[record.id],skilled:skilledTbd};
  }
  // Keep saved build destinations attached to the same organization label.
  for(const planner of Object.values(state.generatorPlanners??{})){
    let changed=false;
    for(const batch of planner.batches)for(const entry of batch.entries){
      const next=skills.find(skill=>skill.id===entry.destination.skilled||skill.moduleIds?.includes(entry.destination.moduleId));
      if(!next)continue;
      const destination={...entry.destination,category:next.category,topic:next.subcategory,moduleTitle:next.label,skilled:next.id,group:'foundation' as const};
      if(JSON.stringify(destination)!==JSON.stringify(entry.destination)){entry.destination=destination;batch.updatedAt=new Date().toISOString();changed=true;}
    }
    if(changed)planner.revision=randomUUID();
  }
  state.classificationSkills=skills;state.retiredClassificationSkillIds=[...retired];
  commitMathCommandState(root,state.revision,state);
  return readClassificationSkills(root);
}
