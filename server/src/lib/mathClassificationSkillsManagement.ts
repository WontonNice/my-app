import { commitMathCommandState, readMathCommandCatalog, readMathCommandState, readMathCommandTaxonomy } from './mathCommandCatalogStore';
import { resolveSkilled, skilledTbd, validateClassificationSkills } from '../shared/mathClassificationSkills';

export function readClassificationSkills(root:string) {
  const state=readMathCommandState(root),taxonomy=readMathCommandTaxonomy(root);
  return {revision:state.revision,skills:state.classificationSkills??[],categories:taxonomy.categories};
}
export function saveClassificationSkills(root:string,input:Record<string,unknown>) {
  const state=readMathCommandState(root),taxonomy=readMathCommandTaxonomy(root);
  if(input.revision!==state.revision)throw Object.assign(new Error('Skilled definitions changed in another window. Reload before saving.'),{status:409});
  const skills=validateClassificationSkills(input.skills,taxonomy),previous=state.classificationSkills??[];
  const retired=new Set(state.retiredClassificationSkillIds??[]);
  if(skills.some(skill=>retired.has(skill.id)))throw Object.assign(new Error('A deleted Skilled ID cannot be reused. Add a new definition instead.'),{status:400});
  for(const skill of previous)if(!skills.some(item=>item.id===skill.id))retired.add(skill.id);
  for(const record of readMathCommandCatalog(root)){
    const value=record.metadata?.skilled??record.question.skilled;
    if(value&&value!==skilledTbd&&resolveSkilled(value,record.question.topic,record.question.subtopic,skills)===skilledTbd)state.metadata[record.id]={...state.metadata[record.id],skilled:skilledTbd};
  }
  state.classificationSkills=skills;state.retiredClassificationSkillIds=[...retired];
  commitMathCommandState(root,state.revision,state);
  return readClassificationSkills(root);
}
