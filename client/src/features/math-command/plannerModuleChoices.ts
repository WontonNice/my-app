import type { PlannerDestination, PlannerEntry } from '../../../../server/src/shared/generatorPlanner';
import { practiceModuleKind, type ManagedPracticeModule, type PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';
import type { MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';

export function plannerExistingModuleGroups(catalog:PracticeCatalog,category:string,topic:string,skills:MathClassificationSkill[]=[]) {
  const modules=catalog.modules.filter(module=>module.category===category);
  const unmatched=skills.filter(skill=>skill.category===category&&!modules.some(module=>!practiceModuleKind(module)&&module.topic===skill.subcategory&&(module.skilled===skill.id||module.title.trim().toLowerCase()===skill.label.trim().toLowerCase())));
  const topics=[...new Set([...modules.filter(module=>!practiceModuleKind(module)).map(module=>module.topic),...unmatched.map(skill=>skill.subcategory)])]
    .sort((a,b)=>Number(b===topic)-Number(a===topic)||a.localeCompare(b));
  const groups=topics.map(label=>({label,modules:modules.filter(module=>!practiceModuleKind(module)&&module.topic===label).sort((a,b)=>a.title.localeCompare(b.title)),skills:unmatched.filter(skill=>skill.subcategory===label).sort((a,b)=>a.label.localeCompare(b.label))}));
  const defaults=modules.filter(module=>practiceModuleKind(module)&&module.topic===topic);
  if(defaults.length)groups.push({label:`${topic} — practice groups`,modules:defaults,skills:[]});
  return groups;
}

export function plannerModuleDestination(module:ManagedPracticeModule):PlannerDestination {
  return {moduleId:module.id,moduleTitle:module.title,category:module.category,topic:module.topic,group:practiceModuleKind(module)==='general'?'general':'foundation',...(module.skilled&&module.skilled!=='TBD'?{skilled:module.skilled}:{})};
}

export function plannerSkillDestination(skill:MathClassificationSkill):PlannerDestination {
  return {moduleId:'',moduleTitle:skill.label,category:skill.category,topic:skill.subcategory,group:'foundation',skilled:skill.id};
}

export function plannedModuleKey(destination: PlannerDestination): string {
  return JSON.stringify([destination.category, destination.topic, destination.group, destination.moduleTitle.trim()]);
}

// Destinations are saved with the batch entries, so these choices also survive reloads.
export function plannerModuleChoices(entries: PlannerEntry[]) {
  const choices = new Map<string, { value: string; destination: PlannerDestination }>();
  for (const { destination } of entries) {
    if (destination.moduleId || !destination.moduleTitle.trim()) continue;
    const key = plannedModuleKey(destination);
    if (!choices.has(key)) choices.set(key, {
      value: `planned:${key}`,
      destination: { ...destination, moduleTitle: destination.moduleTitle.trim() },
    });
  }
  return [...choices.values()];
}
